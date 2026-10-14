import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CBreadcrumb, CBreadcrumbItem, CButton, CCol, CRow } from "@coreui/react";
import Page from "./components/Page";
import Panel from "./components/Panel";
import FilterBar from "./components/FilterBar";
import StatusChip from "./components/StatusChip";
import MetricTile from "./components/MetricTile";
import MonthlyUptimeList from "./components/MonthlyUptimeList";
import Pager from "./components/Pager";
import TableSearch from "./components/TableSearch";
import { performanceApi } from "./api/client";
import { useApi } from "./hooks/useApi";
import { useFilters } from "./hooks/useFilters";
import { useFaultOptions, useSiteOptions } from "./hooks/useLookups";
import { apiParams, lastSixMonths, scopeParams, writeFilters } from "./utils/filters";
import { scoreSummary } from "./utils/score";
import { count, day, dateTime, duration, humanize, pct } from "./utils/format";
import { BASE, uptimeChip } from "./Dashboard";

const TERMINAL = new Set(["Transferred", "Cancelled", "Stopped"]);

export function breachDays(row) {
  if (row.sla_breach_days != null) return row.sla_breach_days;
  if (row.duration_days == null || row.sla_target_days == null) return null;
  return Math.max(0, row.duration_days - row.sla_target_days);
}

export function DelayChip({ row }) {
  if (row.delay_reason_code) return <StatusChip status={row.delay_reason_code} tone="grey" label={humanize(row.delay_reason_code)} />;
  if (row.delay_reason_missing) return <StatusChip status="delay_reason_missing" />;
  return <span className="sp-muted">—</span>;
}

function materialChip(status) {
  if (status === "Transferred") return <StatusChip status="transferred" />;
  if (TERMINAL.has(status)) return <StatusChip status={status} tone="grey" label={status} />;
  return <StatusChip status="awaiting_dispatch" title={`ERP status: ${status || "unknown"}`} />;
}

function usePaged(section, siteId, params, q) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const query = { ...params, site_id: siteId, page, limit, ...(q.trim() ? { q: q.trim() } : {}) };
  const state = useApi((signal) => performanceApi.details(section, query, signal), JSON.stringify([section, query]), { delay: 200 });
  return { ...state, page, limit, setPage, setLimit: (n) => { setLimit(n); setPage(1); } };
}

export default function SiteDetail() {
  const { siteId } = useParams();
  const navigate = useNavigate();
  const [filters, setFilters] = useFilters();
  const params = apiParams({ ...filters, site_id: "" });
  const key = JSON.stringify([siteId, params]);
  const months = lastSixMonths(filters);
  const years = [...new Set(months.map((m) => m.year))];
  const scope = { ...scopeParams(filters), site_id: siteId };
  const [source, setSource] = useState("tickets");
  const [ticketQ, setTicketQ] = useState("");
  const [materialQ, setMaterialQ] = useState("");
  const [pmQ, setPmQ] = useState("");

  const report = useApi((signal) => performanceApi.site(siteId, params, signal), key, { delay: 300 });
  const conf = useApi((signal) => performanceApi.siteConfiguration(siteId, signal), siteId);
  const config = useApi((signal) => performanceApi.config(signal), "config");
  const trends = useApi(
    (signal) => Promise.all(years.map((year) => performanceApi.trends({ ...scope, year }, signal))).then((list) => list.flatMap((t) => t?.points || [])),
    JSON.stringify([scope, years]),
    { delay: 300 },
  );
  const tickets = usePaged(source, siteId, params, ticketQ);
  const materials = usePaged("materials", siteId, params, materialQ);
  const pm = usePaged("maintenance", siteId, params, pmQ);
  const sites = useSiteOptions(null, siteId);
  const faults = useFaultOptions();

  const r = report.data;
  const c = conf.data;
  const siteMeta = r?.configuration?.sites?.[0];
  const target = config.data?.uptime_target ?? null;
  const summary = scoreSummary(r?.score);
  const query = writeFilters({ ...filters, site_id: "" }).toString();
  const uptimeRows = months.map((m) => {
    const point = (trends.data || []).find((p) => p.label === m.label);
    return { label: m.label, value: point?.uptime?.cleaning_uptime ?? null, availability: point?.uptime?.availability_uptime ?? null };
  });
  const uptimeHint = r?.uptime ? (r.uptime.aggregation === "unweighted" ? "Unweighted" : "Stored monthly percent") : "";
  const sla = r?.service_tickets?.sla || {};
  const siteSchedule = (r?.preventive_maintenance?.schedules || []).find((s) => s.site_id === siteId) || null;
  const consumption = r?.consumption || {};

  const changeFilters = (patch) => {
    if (patch.site_id !== undefined) {
      if (patch.site_id && patch.site_id !== siteId) navigate(`${BASE}/sites/${encodeURIComponent(patch.site_id)}?${query}`);
      if (!patch.site_id) navigate(`${BASE}?${query}`);
      return;
    }
    setFilters(patch);
  };

  const materialRows = (materials.data?.data || []).flatMap((request) =>
    (request.items?.length ? request.items : [{}]).map((item, i) => ({ request, item, key: `${request.name}-${i}` })),
  );

  if (report.error?.status === 403 || report.error?.status === 404) {
    return (
      <Page>
        <Link to={`${BASE}?${query}`}>Back to service performance</Link>
        <div className="mt-3">
          <Panel title={`Site ${siteId}`} error={report.error} />
        </div>
      </Page>
    );
  }

  return (
    <Page>
      <CBreadcrumb className="mb-2">
        <CBreadcrumbItem>
          <Link to={`${BASE}?${query}`}>Service performance</Link>
        </CBreadcrumbItem>
        <CBreadcrumbItem active>Site {siteId}</CBreadcrumbItem>
      </CBreadcrumb>
      <header className="mb-3">
        <h1 className="h3 mb-2">Site {siteId}</h1>
        <div className="d-flex gap-2 flex-wrap">
          {siteMeta && <StatusChip status={siteMeta.analysis_status} />}
          {c && <StatusChip status="tag" tone="grey" label={c.mounting_type ? `Site type: ${humanize(c.mounting_type)}` : "Site type not set"} />}
          {c && <StatusChip status="tag" tone="grey" label={c.cloth_type ? `Cloth: ${c.cloth_type}` : "Cloth not set"} />}
          {c && (
            <StatusChip
              status="tag"
              tone={c.warranty_inconsistent ? "amber" : "grey"}
              label={c.warranty_status ? `${humanize(c.warranty_status)}${c.warranty_date ? ` until ${day(c.warranty_date)}` : ""}${c.warranty_inconsistent ? " (date disagrees)" : ""}` : "Warranty not set"}
            />
          )}
          {summary.provisional && r && <StatusChip status="provisional" label={`Score provisional: ${summary.eligible} of ${summary.total} KPIs`} />}
        </div>
      </header>
      <FilterBar filters={{ ...filters, site_id: siteId }} setFilters={changeFilters} sites={r && !sites.includes(siteId) ? [siteId, ...sites] : sites} faults={faults} />

      <CRow className="g-3 mb-3">
        {[
          ["Cleaning uptime", r?.uptime?.cleaning_uptime == null ? "No record" : pct(r.uptime.cleaning_uptime), uptimeHint],
          ["Availability uptime", r?.uptime?.availability_uptime == null ? "No record" : pct(r.uptime.availability_uptime), uptimeHint],
          ["Ticket SLA", pct(sla.compliance_percent), sla.eligible ? `${sla.met} of ${sla.eligible} within target` : "No resolved ticket with a target"],
          siteSchedule
            ? ["PM schedule", `${siteSchedule.robots_done} of ${siteSchedule.robots_due} robots`, `${humanize(siteSchedule.status)} · ${day(siteSchedule.start_date)} to ${day(siteSchedule.end_date)}`]
            : ["PM completed", count(r?.preventive_maintenance?.completed), "No PM schedule in this period"],
          ["Parts consumed", consumption.expected ? `${consumption.matched} of ${consumption.expected}` : "—", consumption.expected ? "Replaced parts with a ledger record" : "No replaced part recorded"],
        ].map(([label, value, hint]) => (
          <CCol xl md={4} sm={6} key={label}>
            {report.loading ? <Panel loading lines={2} /> : report.error ? <Panel error={report.error} onRetry={report.reload} /> : <MetricTile label={label} value={value} hint={hint} />}
          </CCol>
        ))}
      </CRow>

      <CRow className="g-3 mb-3">
        <CCol lg={6}>
          <Panel title="Monthly cleaning and availability uptime, last 6 months" actions={r?.uptime ? uptimeChip(r.uptime.aggregation) : null} loading={trends.loading || config.loading} error={trends.error} onRetry={trends.reload}>
            <MonthlyUptimeList rows={uptimeRows} target={target} />
            <div className="sp-small sp-muted">{target != null ? `Tick marks the ${target}% target. ` : ""}A month without a site report shows “No record”, never 0% or 100%.</div>
          </Panel>
        </CCol>
        <CCol lg={6}>
          <Panel title="Preventive maintenance" subtitle={siteSchedule ? `Schedule ${day(siteSchedule.start_date)} to ${day(siteSchedule.end_date)} · ${siteSchedule.pending_robots.length} robot(s) still due` : "Completed checklist records. No PM schedule overlaps this period."} loading={pm.loading} error={pm.error} onRetry={pm.reload} empty={!pm.data?.data?.length && !pmQ.trim()}>
            <TableSearch value={pmQ} onChange={(value) => { setPmQ(value); pm.setPage(1); }} placeholder="Search PM or robot" label="Search preventive maintenance" />
            {pmQ.trim() && !pm.data?.data?.length ? <div className="sp-muted sp-small py-2">No PM matches "{pmQ.trim()}".</div> : (
            <>
            <div className="sp-table-wrap">
              <table className="table table-sm mb-0">
                <thead>
                  <tr>
                    <th scope="col">PM</th>
                    <th scope="col">Technician</th>
                    <th scope="col">Due</th>
                    <th scope="col">Done</th>
                    <th scope="col">State</th>
                  </tr>
                </thead>
                <tbody>
                  {(pm.data?.data || []).map((row) => (
                    <tr key={`${row.pm_id}-${row.created_at}`}>
                      <td>
                        {row.pm_id || "—"}
                        <div className="sp-small sp-muted">Robot {row.robot_no || "—"}</div>
                      </td>
                      <td className="sp-muted">Not stored</td>
                      <td className={siteSchedule ? "" : "sp-muted"}>{siteSchedule ? day(siteSchedule.end_date) : "No schedule"}</td>
                      <td>{dateTime(row.created_at)}</td>
                      <td>
                        {(() => {
                          if (!siteSchedule) return <StatusChip status="completed" tone="green" label="Completed" title="On time / late needs a PM schedule" />;
                          const t = new Date(row.created_at).getTime();
                          if (t < new Date(siteSchedule.start_date).getTime()) return <StatusChip status="excluded" label="Before schedule" />;
                          return t <= new Date(siteSchedule.end_date).getTime() ? <StatusChip status="on_time" /> : <StatusChip status="late" />;
                        })()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pager page={pm.page} limit={pm.limit} total={pm.data?.total} onPage={pm.setPage} label="PM pages" />
            </>
            )}
          </Panel>
        </CCol>
      </CRow>

      <div className="mb-3">
        <Panel
          title="Tickets"
          actions={
            <div className="btn-group" role="group" aria-label="Ticket source">
              {[
                ["tickets", "Service"],
                ["client_tickets", "Client"],
              ].map(([value, label]) => (
                <CButton key={value} size="sm" color="secondary" variant={source === value ? undefined : "outline"} aria-pressed={source === value} onClick={() => { setSource(value); tickets.setPage(1); }}>
                  {label}
                </CButton>
              ))}
            </div>
          }
          loading={tickets.loading}
          error={tickets.error}
          onRetry={tickets.reload}
          empty={!tickets.data?.data?.length && !ticketQ.trim()}
          emptyText="No ticket from this source in this period."
        >
          <TableSearch value={ticketQ} onChange={(value) => { setTicketQ(value); tickets.setPage(1); }} placeholder="Search ticket" label="Search tickets" />
          {ticketQ.trim() && !tickets.data?.data?.length ? <div className="sp-muted sp-small py-2">No ticket matches "{ticketQ.trim()}".</div> : (
          <>
          <div className="sp-table-wrap">
            <table className="table sp-table mb-0">
              <thead>
                <tr>
                  <th scope="col">Ticket</th>
                  <th scope="col">Source</th>
                  <th scope="col">Priority</th>
                  <th scope="col">Engineer at assignment</th>
                  <th scope="col">Resolved in</th>
                  <th scope="col">SLA</th>
                  <th scope="col">Late by</th>
                  <th scope="col">Delay reason</th>
                </tr>
              </thead>
              <tbody>
                {(tickets.data?.data || []).map((row) => {
                  const late = breachDays(row);
                  return (
                    <tr key={`${row.kind}-${row.ticket_id}`}>
                      <td>
                        <Link to={`${BASE}/tickets?${query}&site_id=${encodeURIComponent(siteId)}&tab=${row.kind === "client_ticket" ? "client" : "service"}&ticket=${encodeURIComponent(row.ticket_id)}`}>{row.ticket_id}</Link>
                        <div className="sp-small sp-muted">{row.fault_type || row.status}</div>
                      </td>
                      <td>
                        <StatusChip status="tag" tone="grey" label={row.kind === "client_ticket" ? "Client" : "Service"} />
                      </td>
                      <td className="sp-muted">n/a</td>
                      <td className="sp-muted" title="No assignment history is stored">
                        Not recorded
                      </td>
                      <td>{row.resolved_at ? duration(row.duration_days) : <span className="sp-muted">Open</span>}</td>
                      <td>{row.sla_target_days == null ? <span className="sp-muted">No target</span> : `${row.sla_target_days} d`}</td>
                      <td className={late ? "text-danger fw-semibold" : ""}>{late == null ? "—" : late > 0 ? duration(late) : "On time"}</td>
                      <td>
                        <DelayChip row={row} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <Pager page={tickets.page} limit={tickets.limit} total={tickets.data?.total} onPage={tickets.setPage} onLimit={tickets.setLimit} label="Ticket pages" />
          </>
          )}
        </Panel>
      </div>

      <CRow className="g-3">
        <CCol lg={8}>
          <Panel title="Material requests" loading={materials.loading} error={materials.error} onRetry={materials.reload} empty={!materialRows.length && !materialQ.trim()}>
            <TableSearch value={materialQ} onChange={(value) => { setMaterialQ(value); materials.setPage(1); }} placeholder="Search material or request" label="Search material requests" />
            {materialQ.trim() && !materialRows.length ? <div className="sp-muted sp-small py-2">No material matches "{materialQ.trim()}".</div> : (
            <>
            <div className="sp-table-wrap">
              <table className="table table-sm mb-0" style={{ minWidth: 720 }}>
                <thead>
                  <tr>
                    <th scope="col">Request ID</th>
                    <th scope="col">Material</th>
                    <th scope="col">Qty</th>
                    <th scope="col">Raised</th>
                    <th scope="col">Transferred</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {materialRows.map(({ request, item, key: rowKey }) => (
                    <tr key={rowKey}>
                      <td>{request.name || "—"}</td>
                      <td>
                        {item.item_name || "—"}
                        <div className="sp-small sp-muted sp-mono">{item.item_code || ""}</div>
                      </td>
                      <td>
                        {count(item.qty)}
                        {item.outstanding_qty ? <div className="sp-small sp-muted">{item.outstanding_qty} outstanding</div> : null}
                      </td>
                      <td>{day(request.created_at)}</td>
                      <td className="sp-muted">No timestamp</td>
                      <td>{materialChip(request.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pager page={materials.page} limit={materials.limit} total={materials.data?.total} onPage={materials.setPage} label="Material request pages" />
            <div className="sp-small sp-muted mt-2">“Transferred” is the ERP status, not proof the part is usable on site.</div>
            </>
            )}
          </Panel>
        </CCol>
        <CCol lg={4}>
          <Panel title="Parts consumed" subtitle="Read-only. This view never changes stock." loading={report.loading} error={report.error} onRetry={report.reload} empty={!consumption.expected} emptyText="No replaced part is recorded on tickets in this period.">
            <div className="d-flex gap-2 flex-wrap mb-2">
              <StatusChip status="recorded" label={`Recorded: ${consumption.matched ?? 0}`} />
              <StatusChip status="missing_record" label={`Missing record: ${consumption.missing ?? 0}`} />
            </div>
            <div className="sp-small sp-muted">
              Counts replaced parts on tickets against the consumption ledger. The per-ticket part list is not returned by the performance API yet.
            </div>
          </Panel>
        </CCol>
      </CRow>
    </Page>
  );
}
