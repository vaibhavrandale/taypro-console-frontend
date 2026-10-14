import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { CButton, CCol, CRow } from "@coreui/react";
import { CartesianGrid, Legend, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Page, { PageHeader } from "./components/Page";
import Panel from "./components/Panel";
import FilterBar from "./components/FilterBar";
import StatusChip from "./components/StatusChip";
import MetricTile from "./components/MetricTile";
import ScoreDonut from "./components/ScoreDonut";
import BulletBar from "./components/BulletBar";
import DataQualityBanner from "./components/DataQualityBanner";
import PmSummary from "./components/PmSummary";
import TableSearch, { rowMatches } from "./components/TableSearch";
import { performanceApi } from "./api/client";
import { useApi } from "./hooks/useApi";
import { useFilters } from "./hooks/useFilters";
import { useEngineerOptions, useFaultOptions, useSiteOptions, sitesForEngineer } from "./hooks/useLookups";
import { canReadAll } from "./utils/access";
import { apiParams, lastSixMonths, periodText, scopeParams, writeFilters } from "./utils/filters";
import { categoryCards, scoreSummary } from "./utils/score";
import { MONTHS, count, dateTime, day, downloadCsv, duration, humanize, monthLabel, num, pct } from "./utils/format";
import { COLORS } from "./components/Page";

export const BASE = "/service-performance";

export function uptimeChip(aggregation) {
  if (aggregation === "robot_weighted_mean_of_stored_monthly_percentages") {
    return <StatusChip status="robot_weighted" title="Weighted by total_assigned_robots. Each site value is itself an unweighted mean of daily percents." />;
  }
  return <StatusChip status="unweighted" />;
}

/** Fault type to SLA target days, read from ticket detail rows. */
export function faultTargets(rows) {
  const map = {};
  for (const row of rows || []) {
    if (row.fault_type && row.sla_target_days != null) map[row.fault_type] = Number(row.sla_target_days);
  }
  return map;
}

export function ResolutionRows({ summary, targets, kind }) {
  if (kind === "client") {
    return <div className="sp-small sp-muted">n/a: client tickets have no priority or category. Only one SLA threshold applies.</div>;
  }
  const rows = (summary?.by_fault || []).filter((row) => row.average_resolution_days != null);
  return (
    <>
      <div className="sp-small sp-muted mb-2">n/a by priority: tickets have no priority field. Shown by fault type against its target_days.</div>
      {rows.length === 0 && <div className="sp-small sp-muted">No resolved ticket with a duration in this period.</div>}
      {rows.slice(0, 6).map((row) => {
        const target = targets[row.fault_type] ?? null;
        const max = Math.max(row.average_resolution_days, target || 0) * 1.15 || 1;
        const late = target != null && row.average_resolution_days > target;
        return (
          <div className="sp-row" key={row.fault_type}>
            <div className="sp-row-label text-truncate" title={row.fault_type}>
              {row.fault_type}
            </div>
            <BulletBar value={row.average_resolution_days} target={target} max={max} breachWhen="above" label={`${row.fault_type} average resolution days`} />
            <div className={`sp-row-value${late ? " text-danger fw-semibold" : ""}`}>
              {duration(row.average_resolution_days)} / {target == null ? "no SLA" : `${target} d`}
            </div>
          </div>
        );
      })}
    </>
  );
}

function TicketCard({ title, kind, summary, config, targets, loading, error, onRetry }) {
  const sla = summary?.sla || {};
  const clientSlaOff = kind === "client" && config?.client_ticket_sla_days == null;
  return (
    <Panel title={title} subtitle={kind === "client" ? "Client ticket collection" : "Service ticket collection"} loading={loading} error={error} onRetry={onRetry} lines={6}>
      <CRow className="g-2 mb-3">
        <CCol xs={6} md={3}>
          <MetricTile label="Assigned" na="No assignee on tickets" tone="blue" />
        </CCol>
        <CCol xs={6} md={3}>
          <MetricTile label="Raised at your sites" value={count(summary?.created_in_period)} hint="Counted by site_id" tone="sky" />
        </CCol>
        <CCol xs={6} md={3}>
          <MetricTile label="Resolved" value={count(summary?.resolved_in_period)} tone="green" />
        </CCol>
        <CCol xs={6} md={3}>
          <MetricTile label="Open / in progress" value={count(summary?.current_open)} tone="amber" />
        </CCol>
        <CCol xs={6} md={3}>
          <MetricTile
            label="Overdue"
            value={count(summary?.overdue_open)}
            na={summary?.overdue_open == null ? (clientSlaOff ? "Client SLA days not set" : "Not calculable") : undefined}
            hint="Average age not stored"
            tone="red"
          />
        </CCol>
        <CCol xs={6} md={3}>
          <MetricTile label="Avg resolution" value={duration(summary?.average_resolution_days)} tone="violet" />
        </CCol>
        <CCol xs={6} md={3}>
          <MetricTile label="Median" value={duration(summary?.median_resolution_days)} tone="violet" />
        </CCol>
        <CCol xs={6} md={3}>
          <MetricTile
            label="SLA compliance"
            value={pct(sla.compliance_percent)}
            hint={sla.eligible ? `${sla.met} of ${sla.eligible}` : undefined}
            na={clientSlaOff ? "Client SLA days not set" : !sla.eligible ? "No ticket with a target" : undefined}
            tone="cyan"
          />
        </CCol>
        <CCol xs={6} md={3}>
          <MetricTile label="Reopened" na="No reopen history" tone="red" />
        </CCol>
      </CRow>
      <h3 className="h6">Avg resolution time by priority</h3>
      <ResolutionRows summary={summary} targets={targets} kind={kind} />
    </Panel>
  );
}

export function siteRows(report) {
  const map = new Map();
  const get = (id) => {
    if (!map.has(id)) map.set(id, { site_id: id });
    return map.get(id);
  };
  for (const s of report?.configuration?.sites || []) get(s.site_id).config = s;
  for (const s of report?.service_tickets?.by_site || []) get(s.site_id).service = s;
  for (const s of report?.client_tickets?.by_site || []) get(s.site_id).client = s;
  for (const s of report?.preventive_maintenance?.by_site || []) get(s.site_id).pm = s;
  for (const s of report?.uptime?.by_site || []) {
    const row = get(s.site_id);
    if (!row.uptime || s.status === "available") row.uptime = s;
  }
  return [...map.values()].sort((a, b) => a.site_id.localeCompare(b.site_id));
}

function UptimeCell({ uptime, target }) {
  if (!uptime || uptime.status !== "available") return <span className="sp-muted">No report</span>;
  const below = target != null && uptime.monthly_cleaning_uptime < target;
  return (
    <>
      <span className={below ? "text-danger fw-semibold" : ""}>{pct(uptime.monthly_cleaning_uptime)}{below ? " (below target)" : ""}</span>
      <div className="sp-small sp-muted">Avail. {uptime.monthly_availability_uptime == null ? "No record" : pct(uptime.monthly_availability_uptime)}</div>
    </>
  );
}

export default function Dashboard() {
  const user = useSelector((state) => state.userInfo);
  const admin = canReadAll(user);
  const navigate = useNavigate();
  const [filters, setFilters] = useFilters();
  const params = apiParams(filters);
  const key = JSON.stringify(params);
  const months = lastSixMonths(filters);
  const years = [...new Set(months.map((m) => m.year))];
  const scope = scopeParams(filters);

  const dash = useApi((signal) => performanceApi.dashboard(params, signal), key, { delay: 300 });
  const config = useApi((signal) => performanceApi.config(signal), "config");
  const trends = useApi(
    (signal) => Promise.all(years.map((year) => performanceApi.trends({ ...scope, year }, signal))).then((list) => list.flatMap((t) => t?.points || [])),
    JSON.stringify([scope, years]),
    { delay: 300 },
  );
  // ponytail: one page of 100 detail rows feeds the delay-reason chart and fault targets. Above 100 tickets the chart says so; a server-side breakdown would remove the ceiling.
  const late = useApi((signal) => performanceApi.details("tickets", { ...params, page: 1, limit: 100 }, signal), key, { delay: 300 });
  const sites = useSiteOptions(dash.data, filters.site_id);
  const faults = useFaultOptions();
  const engineers = useEngineerOptions(admin);

  const report = dash.data;
  const cfg = config.data;
  const summary = scoreSummary(report?.score);
  const categories = categoryCards(cfg, report);
  const targets = faultTargets(late.data?.data);
  const uptimeTarget = cfg?.uptime_target ?? null;
  const rows = useMemo(() => siteRows(report), [report]);
  const [siteQuery, setSiteQuery] = useState("");
  const visibleRows = rows.filter((r) => rowMatches(siteQuery, [r.site_id, r.config?.mounting_type, r.config?.cloth_type, r.config?.warranty_status, r.config?.analysis_status]));
  const query = writeFilters(filters).toString();

  const sixMonths = months.map((m) => ({
    label: m.label,
    month: `${MONTHS[m.month - 1]} ${String(m.year).slice(2)}`,
    value: (trends.data || []).find((p) => p.label === m.label)?.uptime?.cleaning_uptime ?? null,
    availability: (trends.data || []).find((p) => p.label === m.label)?.uptime?.availability_uptime ?? null,
  }));

  const lateRows = (late.data?.data || []).filter((row) => row.resolved_late === true);
  const reasonCounts = {};
  for (const row of lateRows) {
    const code = row.delay_reason_code || "delay_reason_missing";
    reasonCounts[code] = (reasonCounts[code] || 0) + 1;
  }
  const reasons = Object.entries(reasonCounts).sort((a, b) => b[1] - a[1]);
  const reasonMax = Math.max(1, ...reasons.map(([, n]) => n));
  const missingReasonRows = lateRows.filter((row) => !row.delay_reason_code);
  const materialReasonCount = lateRows.filter((row) => ["material_unavailable", "material_dispatch_delay"].includes(row.delay_reason_code)).length;

  const presentSites = (report?.uptime?.by_site || []).filter((s) => s.status === "available").map((s) => s.site_id);
  const uptimeSiteCount = new Set((report?.uptime?.by_site || []).map((s) => s.site_id)).size;

  const activeChips = [
    filters.site_id && ["site_id", `Site ${filters.site_id}`],
    filters.engineer_id && ["engineer_id", `Engineer ${(engineers.data || []).find((u) => u._id === filters.engineer_id)?.username || "selected"}`],
    filters.fault_type && ["fault_type", filters.fault_type],
    filters.status && ["status", `Service ${filters.status}`],
    filters.client_status && ["client_status", `Client ${filters.client_status}`],
  ].filter(Boolean);

  const exportCsv = () => {
    const head = [
      ["Period", periodText(filters)],
      ["Overall score", num(summary.overall)],
      ["Eligible KPIs", `${summary.eligible} of ${summary.total}`],
      ["Completeness %", num(summary.completeness)],
      ["Service SLA %", num(report?.service_tickets?.sla?.compliance_percent)],
      ["Cleaning uptime %", num(report?.uptime?.cleaning_uptime)],
      ["Availability uptime %", num(report?.uptime?.availability_uptime)],
      [],
      ["Site", "Mounting", "Cloth", "Warranty", "Service raised", "Service resolved", "Service open", "Client raised", "Cleaning uptime %", "Availability uptime %", "PM completed", "Analysis status"],
    ];
    const body = rows.map((r) => [
      r.site_id,
      r.config?.mounting_type || "",
      r.config?.cloth_type || "",
      r.config?.warranty_status || "",
      r.service?.created ?? "",
      r.service?.resolved ?? "",
      r.service?.open ?? "",
      r.client?.created ?? "",
      r.uptime?.status === "available" ? r.uptime.monthly_cleaning_uptime : "No report",
      r.uptime?.status === "available" ? r.uptime.monthly_availability_uptime ?? "No record" : "No report",
      r.pm?.completed ?? 0,
      r.config?.analysis_status || "",
    ]);
    downloadCsv(`service-performance-${report?.period?.label || "period"}.csv`, [...head, ...body]);
  };

  const engineerName = report?.engineer?.username;
  const siteCountText = Array.isArray(report?.site_ids) ? `${report.site_ids.length} site${report.site_ids.length === 1 ? "" : "s"}` : "All sites";
  const versionText = cfg ? (cfg.version ? `Scoring v${cfg.version}, effective ${day(cfg.effective_from)}` : "Scoring v0 (built-in default)") : "Scoring version loading";

  return (
    <Page>
      <PageHeader
        title={admin ? (engineerName ? `${engineerName}: performance` : "Service engineer performance") : "My Performance"}
        subtitle={`${siteCountText} · ${periodText(filters)} · ${versionText}`}
        actions={
          <>
            {activeChips.map(([field, text]) => (
              <span key={field} className="sp-chip sp-chip--grey">
                {text}
                <button type="button" className="btn btn-link btn-sm p-0 ms-1 text-reset" aria-label={`Remove filter ${text}`} onClick={() => setFilters({ [field]: "" })}>
                  ×
                </button>
              </span>
            ))}
            <Link className="btn btn-outline-secondary btn-sm" to={`${BASE}/tickets?${query}`}>
              Ticket performance
            </Link>
            <CButton color="success" size="sm" onClick={exportCsv} disabled={!report}>
              Export CSV
            </CButton>
          </>
        }
      />
      <FilterBar
        filters={filters}
        setFilters={setFilters}
        sites={sitesForEngineer(sites, engineers.data, filters.engineer_id, filters.site_id)}
        faults={faults}
        engineers={admin ? engineers.data || [] : null}
        notice={report?.scope_note || ""}
      />

      {report && (
        <DataQualityBanner
          summary={summary}
          configLink={admin && report.configuration?.incomplete_count ? `${BASE}/admin/sites` : null}
          extra={report.configuration?.incomplete_count ? `${report.configuration.incomplete_count} site${report.configuration.incomplete_count === 1 ? " is" : "s are"} missing configuration.` : ""}
        />
      )}

      <CRow className="g-3 mb-3">
        <CCol lg={4}>
          <Panel title="Overall score" loading={dash.loading} error={dash.error} onRetry={dash.reload}>
            <ScoreDonut score={summary.overall} eligible={summary.eligible} total={summary.total} completeness={summary.completeness} />
            <dl className="row sp-small mt-3 mb-0">
              <dt className="col-6 sp-muted fw-normal">Eligible KPIs</dt>
              <dd className="col-6 mb-1">
                {summary.eligible} of {summary.total}
              </dd>
              <dt className="col-6 sp-muted fw-normal">Score completeness</dt>
              <dd className="col-6 mb-1">{pct(summary.completeness)}</dd>
              <dt className="col-6 sp-muted fw-normal">Calculated at</dt>
              <dd className="col-6 mb-1">{dateTime(report?.calculated_at)}</dd>
            </dl>
            <div className="sp-small sp-muted mt-2">Σ(eligible KPI score × weight) ÷ Σ(eligible weights). KPIs without data are left out, not scored 0.</div>
          </Panel>
        </CCol>
        <CCol lg={8}>
          <Panel title="Score by category" loading={dash.loading || config.loading} error={dash.error || config.error} onRetry={dash.reload} empty={!categories.length} lines={6}>
            <CRow className="g-2">
              {categories.map((c) => (
                <CCol md={6} xl={4} key={c.key}>
                  <div className={`sp-tile sp-tile--${c.state === "eligible" ? "green" : c.state === "partial" ? "amber" : c.state === "informational" ? "blue" : "slate"}`}>
                    <div className="d-flex justify-content-between align-items-start gap-2">
                      <div className="fw-semibold">{c.name}</div>
                      <StatusChip status={c.state} />
                    </div>
                    <div className="sp-small sp-muted">Weight {num(c.weight, 0)}%</div>
                    <div className="sp-tile-value">{c.score == null ? "—" : num(c.score)}</div>
                    <BulletBar value={c.score} missingLabel="Excluded" label={`${c.name} score`} />
                    <div className="sp-small sp-muted mt-2">{c.reason}</div>
                  </div>
                </CCol>
              ))}
            </CRow>
          </Panel>
        </CCol>
      </CRow>

      <CRow className="g-3 mb-3">
        <CCol xl={6}>
          <TicketCard title="Service tickets" kind="service" summary={report?.service_tickets} config={cfg} targets={targets} loading={dash.loading} error={dash.error} onRetry={dash.reload} />
        </CCol>
        <CCol xl={6}>
          <TicketCard title="Client tickets" kind="client" summary={report?.client_tickets} config={cfg} targets={targets} loading={dash.loading} error={dash.error} onRetry={dash.reload} />
        </CCol>
      </CRow>

      <div className="mb-3">
        <Panel
          title="Site uptime"
          actions={report?.uptime ? uptimeChip(report.uptime.aggregation) : null}
          loading={dash.loading || trends.loading}
          error={dash.error || trends.error}
          onRetry={() => {
            dash.reload();
            trends.reload();
          }}
        >
          <CRow className="g-3 align-items-center">
            <CCol md={3}>
              <div className={`display-6 fw-semibold sp-uptime ${report?.uptime?.cleaning_uptime == null ? "" : uptimeTarget != null && report.uptime.cleaning_uptime < uptimeTarget ? "sp-uptime--low" : "sp-uptime--ok"}`}>{report?.uptime?.cleaning_uptime == null ? "No record" : pct(report.uptime.cleaning_uptime)}</div>
              <div className="sp-small sp-muted mb-1">Cleaning uptime</div>
              <div className="fs-4 fw-semibold">{report?.uptime?.availability_uptime == null ? "No record" : pct(report.uptime.availability_uptime)}</div>
              <div className="sp-small sp-muted mb-2">Availability uptime</div>
              <div className="sp-small sp-muted">
                {report?.uptime?.aggregation === "robot_weighted_mean_of_stored_monthly_percentages" ? "Robot-weighted mean of stored site percents" : "Unweighted mean"} across {new Set(presentSites).size} of {uptimeSiteCount} sites with a valid report
                {uptimeTarget != null ? `, target ${uptimeTarget}%` : ""}. Not a fleet-wide robot-day uptime.
              </div>
            </CCol>
            <CCol md={9}>
              <figure className="mb-0" aria-label={`Uptime, last six months: ${sixMonths.map((m) => `${monthLabel(m.label)} cleaning ${m.value == null ? "no record" : pct(m.value)}, availability ${m.availability == null ? "no record" : pct(m.availability)}`).join("; ")}`}>
                <div style={{ width: "100%", height: 200 }} aria-hidden="true">
                  <ResponsiveContainer>
                    <LineChart data={sixMonths} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
                      <XAxis dataKey="month" tick={{ fontSize: 12, fill: COLORS.muted }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: COLORS.muted }} />
                      <Tooltip formatter={(value, name) => [value == null ? "No record" : `${Number(value).toFixed(1)}%`, name]} />
                      <Legend wrapperStyle={{ fontSize: 12, color: COLORS.muted }} />
                      {uptimeTarget != null && <ReferenceLine y={uptimeTarget} stroke={COLORS.amber} strokeDasharray="6 4" label={{ value: `Target ${uptimeTarget}%`, fontSize: 11, fill: COLORS.amberText, position: "insideTopRight" }} />}
                      <Line type="monotone" dataKey="value" name="Cleaning uptime" stroke={COLORS.green} strokeWidth={2} dot connectNulls={false} />
                      <Line type="monotone" dataKey="availability" name="Availability uptime" stroke={COLORS.blue} strokeWidth={2} dot connectNulls={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="d-flex justify-content-between flex-wrap gap-2 sp-small mt-1">
                  {sixMonths.map((m) => (
                    <span key={m.label}>
                      {m.month}: <strong className={m.value == null ? "sp-muted fw-normal" : ""}>{m.value == null ? "No record" : pct(m.value)}</strong>
                      <span className="sp-muted"> / {m.availability == null ? "No record" : pct(m.availability)}</span>
                    </span>
                  ))}
                </div>
              </figure>
            </CCol>
          </CRow>
        </Panel>
      </div>

      <CRow className="g-3 mb-3">
        <CCol lg={5}>
          <Panel title="Preventive maintenance" loading={dash.loading} error={dash.error} onRetry={dash.reload}>
            <PmSummary plan={report?.preventive_maintenance?.schedule} records={report?.preventive_maintenance?.completed} scheduleLink={admin ? `${BASE}/admin/pm-schedule` : null} />
          </Panel>
        </CCol>
        <CCol lg={7}>
          <Panel title="Material requests & ERP" loading={dash.loading} error={dash.error} onRetry={dash.reload}>
            {(() => {
              const m = report?.materials || {};
              const raised = m.created_in_period ?? 0;
              const closed = raised - (m.awaiting_dispatch ?? 0);
              const funnel = [
                ["Raised", raised, null],
                ["Dispatched", null, "No dispatch timestamp in ERP"],
                ["Transferred or closed (ERP)", closed, "Transferred, Cancelled or Stopped"],
                ["Available at site", null, "No receipt confirmation"],
              ];
              return (
                <>
                  {funnel.map(([name, value, note]) => (
                    <div className="sp-row" key={name}>
                      <div className="sp-row-label">{name}</div>
                      <BulletBar value={value} max={Math.max(1, raised)} missingLabel="n/a" label={name} />
                      <div className="sp-row-value" title={note || undefined}>
                        {value == null ? "n/a" : value}
                      </div>
                    </div>
                  ))}
                  <div className="sp-small sp-muted mb-2">“Transferred or closed” is the ERP status, not proof the part is usable on site.</div>
                  <CRow className="g-2 mb-2">
                    <CCol md={4}>
                      <MetricTile label="Awaiting dispatch" value={count(m.awaiting_dispatch)} tone="amber" />
                    </CCol>
                    <CCol md={4}>
                      <MetricTile label={`Delayed past ${m.threshold_days ?? "—"} d`} value={count(m.delayed_beyond_threshold)} na={m.delayed_beyond_threshold == null ? "No threshold set" : undefined} tone="red" />
                    </CCol>
                    <CCol md={4}>
                      <MetricTile label="Avg processing days" na={`0 of ${raised} have dates`} hint={`Open requests average ${duration(m.average_open_age_days)} old`} tone="violet" />
                    </CCol>
                  </CRow>
                  <div className="sp-notice">{raised} request{raised === 1 ? "" : "s"} lack a transfer timestamp: ERP does not store one.</div>
                  <div className="sp-notice">Unmatched ERP events: n/a, the sync does not record events.</div>
                  <div className="sp-notice">
                    Tickets delayed by material: {materialReasonCount} late ticket{materialReasonCount === 1 ? "" : "s"} cite a material reason. Requests are not linked to tickets, so no request ID is shown.
                  </div>
                </>
              );
            })()}
          </Panel>
        </CCol>
      </CRow>

      <div className="mb-3">
        <Panel
          title="Late resolutions by delay reason"
          subtitle={late.data && late.data.total > (late.data.data || []).length ? `Based on the first ${(late.data.data || []).length} of ${late.data.total} tickets` : undefined}
          loading={late.loading}
          error={late.error}
          onRetry={late.reload}
          empty={!reasons.length}
          emptyText="No ticket was resolved late in this period."
        >
          <div role="list">
            {reasons.map(([code, n]) => (
              <div className="sp-row" key={code} role="listitem">
                <div className="sp-row-label">{code === "delay_reason_missing" ? <StatusChip status="delay_reason_missing" /> : humanize(code)}</div>
                <div className="sp-bar" role="img" aria-label={`${code}: ${n}`}>
                  <div className={code === "delay_reason_missing" ? "sp-hatch--red" : "sp-bar-fill sp-bar-fill--blue"} style={{ width: `${(n / reasonMax) * 100}%`, height: "100%", borderRadius: 999 }} />
                </div>
                <div className="sp-row-value">{n}</div>
              </div>
            ))}
          </div>
          {missingReasonRows.length > 0 && (
            <div className="sp-notice sp-notice--red mt-2">
              {missingReasonRows.length} late ticket{missingReasonRows.length === 1 ? " has" : "s have"} no delay reason:{" "}
              {missingReasonRows.slice(0, 8).map((row, i) => (
                <React.Fragment key={row.ticket_id}>
                  {i > 0 && ", "}
                  <Link to={`${BASE}/tickets?${query}&ticket=${encodeURIComponent(row.ticket_id)}`}>{row.ticket_id}</Link>
                </React.Fragment>
              ))}
              {missingReasonRows.length > 8 && ` and ${missingReasonRows.length - 8} more`}
            </div>
          )}
        </Panel>
      </div>

      <Panel
        title={admin ? "Sites" : "Assigned sites"}
        subtitle={report?.configuration?.note}
        loading={dash.loading}
        error={dash.error}
        onRetry={dash.reload}
        empty={!rows.length}
        emptyText={report?.scope_note || (Array.isArray(report?.site_ids) && !report.site_ids.length ? "No sites are assigned to this account." : "No site has activity in this period.")}
      >
        <TableSearch value={siteQuery} onChange={setSiteQuery} placeholder="Search site" label="Search sites" />
        {!visibleRows.length && siteQuery ? (
          <div className="sp-muted sp-small py-2">No site matches "{siteQuery}".</div>
        ) : (
        <div className="sp-table-wrap">
          <table className="table sp-table mb-0">
            <caption className="visually-hidden">Sites with tickets, SLA, uptime and analysis status</caption>
            <thead>
              <tr>
                <th scope="col">Site</th>
                <th scope="col">Type</th>
                <th scope="col">Cloth</th>
                <th scope="col">Warranty</th>
                <th scope="col">Tickets</th>
                <th scope="col">SLA</th>
                <th scope="col">Uptime (cleaning / avail.)</th>
                <th scope="col">Analysis status</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((r) => (
                <tr key={r.site_id} className="sp-row-click" onClick={() => navigate(`${BASE}/sites/${encodeURIComponent(r.site_id)}?${query}`)}>
                  <td>
                    <Link to={`${BASE}/sites/${encodeURIComponent(r.site_id)}?${query}`} onClick={(e) => e.stopPropagation()}>
                      {r.site_id}
                    </Link>
                    <div className="sp-small sp-muted">
                      PM {r.pm?.completed ?? 0} done / schedule n/a
                      {r.config?.warranty_inconsistent ? " · warranty status and date disagree" : ""}
                    </div>
                  </td>
                  <td>{r.config?.mounting_type ? humanize(r.config.mounting_type) : "—"}</td>
                  <td>{r.config?.cloth_type || "—"}</td>
                  <td>
                    {r.config?.warranty_status ? humanize(r.config.warranty_status) : "—"}
                    {r.config?.warranty_date && <div className="sp-small sp-muted">until {day(r.config.warranty_date)}</div>}
                  </td>
                  <td>
                    Service {r.service?.created ?? 0} raised, {r.service?.resolved ?? 0} resolved, {r.service?.open ?? 0} open
                    <div className="sp-small sp-muted">Client {r.client?.created ?? 0} raised</div>
                  </td>
                  <td>
                    <span className="sp-muted">On site page</span>
                  </td>
                  <td>
                    <UptimeCell uptime={r.uptime} target={uptimeTarget} />
                  </td>
                  <td>{r.config ? <StatusChip status={r.config.analysis_status} /> : <StatusChip status="no_record" label="Not loaded" title={report?.configuration?.note} />}</td>
                </tr>
              ))}
            </tbody>
            </table>
        </div>
        )}
      </Panel>
    </Page>
  );
}
