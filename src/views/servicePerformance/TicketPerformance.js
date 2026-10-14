import React, { useState } from "react";
import { useSelector } from "react-redux";
import { CCol, CRow } from "@coreui/react";
import { Bar, BarChart, CartesianGrid, Cell, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Page, { PageHeader } from "./components/Page";
import Panel from "./components/Panel";
import FilterBar from "./components/FilterBar";
import MetricTile from "./components/MetricTile";
import StatusChip from "./components/StatusChip";
import Pager from "./components/Pager";
import DelayReasonForm from "./components/DelayReasonForm";
import { performanceApi, saveDelayReason, errorText } from "./api/client";
import { useApi } from "./hooks/useApi";
import { useFilters } from "./hooks/useFilters";
import { useEngineerOptions, useFaultOptions, useSiteOptions, sitesForEngineer } from "./hooks/useLookups";
import { canReadAll } from "./utils/access";
import { apiParams, lastSixMonths, periodText, scopeParams } from "./utils/filters";
import { count, dateTime, duration, MONTHS, pct } from "./utils/format";
import { breachDays, DelayChip } from "./SiteDetail";
import { COLORS } from "./components/Page";

const TABS = [
  ["service", "Service tickets"],
  ["client", "Client tickets"],
  ["combined", "Combined (unique)"],
];
const COMBINED_LIMIT = 100;

/** Service and client tickets are different collections; count each ticket id once. */
export function uniqueTickets(rows) {
  const seen = new Set();
  return rows.filter((row) => {
    if (seen.has(row.ticket_id)) return false;
    seen.add(row.ticket_id);
    return true;
  });
}

const byBreach = (a, b) => (breachDays(b) ?? -1) - (breachDays(a) ?? -1);

function Tiles({ tab, report }) {
  const s = tab === "client" ? report?.client_tickets : report?.service_tickets;
  if (tab === "combined") {
    const a = report?.service_tickets?.sla || {};
    const b = report?.client_tickets?.sla || {};
    const met = (a.met || 0) + (b.met || 0);
    const eligible = (a.eligible || 0) + (b.eligible || 0);
    return (
      <CRow className="g-2">
        <CCol md={2} xs={6}><MetricTile label="Resolved" value={count(report?.combined?.resolved_in_period)} hint="Each ticket counted once" /></CCol>
        <CCol md={2} xs={6}><MetricTile label="Open / in progress" value={count(report?.combined?.current_open)} /></CCol>
        <CCol md={2} xs={6}><MetricTile label="SLA compliance" value={eligible ? pct((met / eligible) * 100) : "—"} hint={eligible ? `${met} of ${eligible}` : "No ticket with a target"} /></CCol>
        <CCol md={2} xs={6}><MetricTile label="Avg resolution" na="Not combined: different SLA bases" /></CCol>
        <CCol md={2} xs={6}><MetricTile label="Median" na="Not combined" /></CCol>
        <CCol md={2} xs={6}><MetricTile label="Late without reason" value={(report?.service_tickets?.delay_reason_missing || 0) + (report?.client_tickets?.delay_reason_missing || 0)} /></CCol>
      </CRow>
    );
  }
  const sla = s?.sla || {};
  const slaOff = tab === "client" && sla.status === "unavailable";
  return (
    <CRow className="g-2">
      <CCol md={2} xs={6}><MetricTile label="Resolved" value={count(s?.resolved_in_period)} /></CCol>
      <CCol md={2} xs={6}><MetricTile label="Open / in progress" value={count(s?.current_open)} /></CCol>
      <CCol md={2} xs={6}><MetricTile label="SLA compliance" value={pct(sla.compliance_percent)} hint={sla.eligible ? `${sla.met} of ${sla.eligible}` : undefined} na={slaOff ? "Client SLA days not set" : !sla.eligible ? "No ticket with a target" : undefined} /></CCol>
      <CCol md={2} xs={6}><MetricTile label="Avg resolution" value={duration(s?.average_resolution_days)} /></CCol>
      <CCol md={2} xs={6}><MetricTile label="Median" value={duration(s?.median_resolution_days)} /></CCol>
      <CCol md={2} xs={6}><MetricTile label="Late without reason" value={count(s?.delay_reason_missing)} /></CCol>
    </CRow>
  );
}

function TicketPanel({ row, reasons, onSaved }) {
  const late = breachDays(row);
  const deadline = row.created_at && row.sla_target_days != null ? new Date(new Date(row.created_at).getTime() + row.sla_target_days * 86400000) : null;
  const steps = [
    ["Created", dateTime(row.created_at), "sp-done"],
    ["Assigned", "Not recorded: no assignment timestamp", ""],
    ["SLA deadline", deadline ? dateTime(deadline) : "No target for this ticket", ""],
    ["Resolved", row.resolved_at ? dateTime(row.resolved_at) : "Still open", row.resolved_at ? (late > 0 ? "sp-late" : "sp-done") : ""],
  ];
  return (
    <Panel title={`Ticket ${row.ticket_id}`} subtitle={`${row.kind === "client_ticket" ? "Client" : "Service"} ticket · site ${row.site_id}`}>
      <ol className="sp-timeline mb-3">
        {steps.map(([name, text, cls]) => (
          <li key={name} className={cls}>
            <div className="fw-semibold sp-small">{name}</div>
            <div className="sp-small sp-muted">{text}</div>
          </li>
        ))}
      </ol>
      {late > 0 && <div className="sp-notice sp-notice--red">Breached by {duration(late)}</div>}
      <CRow className="g-2 mb-3">
        <CCol xs={6}><MetricTile label="Elapsed" value={row.resolved_at ? duration(row.duration_days) : "Open"} /></CCol>
        <CCol xs={6}><MetricTile label="SLA" value={row.sla_target_days == null ? "—" : `${row.sla_target_days} d`} na={row.sla_target_days == null ? "No target" : undefined} /></CCol>
      </CRow>
      <div className="mb-2">
        Delay reason: <DelayChip row={row} />
        {row.delay_reason_remarks && <div className="sp-small sp-muted">{row.delay_reason_remarks}</div>}
      </div>
      {row.delay_reason_missing && (
        <DelayReasonForm
          key={row.ticket_id}
          ticketId={row.ticket_id}
          reasons={reasons}
          disabledReason={row._id ? "" : `Ticket ${row.ticket_id} has no record id in the performance API response, so it cannot be saved here.`}
          onSave={async (body) => {
            try {
              await saveDelayReason(row, body);
            } catch (error) {
              throw new Error(errorText(error));
            }
            onSaved();
          }}
        />
      )}
    </Panel>
  );
}

export default function TicketPerformance() {
  const user = useSelector((state) => state.userInfo);
  const admin = canReadAll(user);
  const [filters, setFilters, search, setSearch] = useFilters();
  const tab = TABS.some(([key]) => key === search.get("tab")) ? search.get("tab") : "service";
  const selectedId = search.get("ticket") || "";
  const [pages, setPages] = useState({ service: 1, client: 1, combined: 1 });
  const [limit, setLimit] = useState(20);
  const params = apiParams(filters);
  const key = JSON.stringify(params);
  const combined = tab === "combined";
  const endYear = lastSixMonths(filters)[5].year;

  const setParam = (name, value) => {
    const next = new URLSearchParams(search);
    if (value) next.set(name, value);
    else next.delete(name);
    setSearch(next, { replace: true });
  };

  const sectionQuery = (name) => ({ ...params, page: combined ? 1 : pages[name], limit: combined ? COMBINED_LIMIT : limit });
  const svcQuery = sectionQuery("service");
  const cliQuery = sectionQuery("client");
  const svc = useApi((signal) => performanceApi.details("tickets", svcQuery, signal), JSON.stringify(svcQuery), { delay: 300 });
  const cli = useApi((signal) => performanceApi.details("client_tickets", cliQuery, signal), JSON.stringify(cliQuery), { delay: 300 });
  const dash = useApi((signal) => performanceApi.dashboard(params, signal), key, { delay: 300 });
  const config = useApi((signal) => performanceApi.config(signal), "config");
  const trendScope = { ...scopeParams(filters), year: endYear };
  const trends = useApi((signal) => performanceApi.trends(trendScope, signal), JSON.stringify(trendScope), { delay: 300 });
  const sites = useSiteOptions(dash.data, filters.site_id);
  const faults = useFaultOptions();
  const engineers = useEngineerOptions(admin);

  const combinedRows = uniqueTickets([...(svc.data?.data || []), ...(cli.data?.data || [])]).sort(byBreach);
  const truncated = (svc.data?.total || 0) > COMBINED_LIMIT || (cli.data?.total || 0) > COMBINED_LIMIT;
  const current = tab === "client" ? cli : svc;
  // ponytail: the details API cannot sort, so rows are ordered by breach within the fetched page only.
  const rows = combined ? combinedRows.slice((pages.combined - 1) * limit, pages.combined * limit) : [...(current.data?.data || [])].sort(byBreach);
  const total = combined ? combinedRows.length : current.data?.total;
  const loading = combined ? svc.loading || cli.loading : current.loading;
  const error = combined ? svc.error || cli.error : current.error;
  const selected = [...(svc.data?.data || []), ...(cli.data?.data || [])].find((row) => row.ticket_id === selectedId);

  const kpiKey = tab === "client" ? "client_ticket_sla" : "service_ticket_sla";
  const slaTarget = (config.data?.kpis || []).find((k) => k.key === kpiKey)?.target ?? null;
  const monthly = (trends.data?.points || []).map((point) => {
    const row = (point.score?.kpis || []).find((k) => k.key === kpiKey);
    const month = Number(point.label.split("-")[1]);
    return { month: MONTHS[month - 1], value: row && (row.status === "eligible" || row.status === "zeroed") ? Number(row.score) : null };
  });

  const counts = {
    service: svc.data?.total,
    client: cli.data?.total,
    combined: combined ? `${combinedRows.length}${truncated ? "+" : ""}` : undefined,
  };

  return (
    <Page>
      <PageHeader title="Ticket performance" subtitle={`${periodText(filters)} · service and client tickets are reported separately`} />
      <FilterBar
        filters={filters}
        setFilters={setFilters}
        sites={sitesForEngineer(sites, engineers.data, filters.engineer_id, filters.site_id)}
        faults={faults}
        engineers={admin ? engineers.data || [] : null}
        notice={dash.data?.scope_note || ""}
      />

      <div className="sp-tabs" role="tablist" aria-label="Ticket source">
        {TABS.map(([value, label]) => (
          <button
            key={value}
            type="button"
            role="tab"
            id={`sp-tab-${value}`}
            aria-selected={tab === value}
            aria-controls="sp-ticket-panel"
            tabIndex={tab === value ? 0 : -1}
            className="sp-tab"
            onClick={() => setParam("tab", value === "service" ? "" : value)}
            onKeyDown={(e) => {
              if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
              const i = TABS.findIndex(([k]) => k === tab);
              const next = TABS[(i + (e.key === "ArrowRight" ? 1 : TABS.length - 1)) % TABS.length][0];
              setParam("tab", next === "service" ? "" : next);
              document.getElementById(`sp-tab-${next}`)?.focus();
            }}
          >
            {label} {counts[value] != null && <span className="sp-chip sp-chip--grey ms-1">{counts[value]}</span>}
          </button>
        ))}
      </div>

      <div id="sp-ticket-panel" role="tabpanel" aria-labelledby={`sp-tab-${tab}`}>
        <div className="mb-3">
          <Panel loading={dash.loading} error={dash.error} onRetry={dash.reload} lines={2}>
            <Tiles tab={tab} report={dash.data} />
          </Panel>
        </div>

        <CRow className="g-3 mb-3">
          <CCol lg={8}>
            <Panel
              title={`SLA compliance by month, ${endYear}${combined ? " (service tickets)" : ""}`}
              subtitle={slaTarget == null ? "No compliance target is configured in KPI rules, so bars are not graded." : `Dashed line is the ${slaTarget}% target. Green meets it, amber is below.`}
              loading={trends.loading || config.loading}
              error={trends.error}
              onRetry={trends.reload}
              empty={!monthly.some((m) => m.value != null)}
              emptyText="No month has a calculable SLA. Months without eligible tickets are not shown as 0%."
            >
              <figure className="mb-0" aria-label={`SLA compliance by month: ${monthly.map((m) => `${m.month} ${m.value == null ? "no data" : pct(m.value)}`).join(", ")}`}>
                <div style={{ width: "100%", height: 220 }} aria-hidden="true">
                  <ResponsiveContainer>
                    <BarChart data={monthly} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
                      <XAxis dataKey="month" tick={{ fontSize: 12, fill: COLORS.muted }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: COLORS.muted }} />
                      <Tooltip formatter={(value) => [value == null ? "No data" : `${Number(value).toFixed(1)}%`, "SLA compliance"]} />
                      {slaTarget != null && <ReferenceLine y={slaTarget} stroke={COLORS.text} strokeDasharray="6 4" />}
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {monthly.map((m) => (
                          <Cell key={m.month} fill={slaTarget == null ? COLORS.blue : m.value >= slaTarget ? COLORS.green : COLORS.amber} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </figure>
            </Panel>
          </CCol>
          <CCol lg={4}>
            <Panel title="How tickets are attributed">
              <ul className="sp-small ps-3 mb-0">
                <li>A ticket counts for an engineer when its site is in the engineer’s current assigned sites. Moving a site moves its history.</li>
                <li>Tickets have no assignee and no assignment timestamp. Assignment time is reported as unavailable, not guessed.</li>
                <li>Service SLA uses the fault type’s target_days. Client SLA uses one threshold from KPI rules.</li>
                <li>Service and client tickets are separate collections. The combined tab lists each ticket id once.</li>
              </ul>
            </Panel>
          </CCol>
        </CRow>

        <CRow className="g-3">
          <CCol xl={selected ? 8 : 12}>
            <Panel
              title="Tickets, most breached first"
              subtitle={combined && truncated ? `Combined lists the first ${COMBINED_LIMIT} of each source. The API has no combined paging yet.` : undefined}
              loading={loading}
              error={error}
              onRetry={() => {
                svc.reload();
                cli.reload();
              }}
              empty={!rows.length}
              emptyText="No ticket in this period."
            >
              <div className="sp-table-wrap">
                <table className="table sp-table mb-0">
                  <thead>
                    <tr>
                      <th scope="col">Ticket</th>
                      <th scope="col">Source</th>
                      <th scope="col">Site</th>
                      <th scope="col">Category / status</th>
                      <th scope="col">Created</th>
                      <th scope="col">Resolved</th>
                      <th scope="col">Elapsed</th>
                      <th scope="col">SLA</th>
                      <th scope="col">Late by</th>
                      <th scope="col">Delay reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => {
                      const late = breachDays(row);
                      const isSelected = row.ticket_id === selectedId;
                      return (
                        <tr key={`${row.kind}-${row.ticket_id}`} className={`sp-row-click${isSelected ? " sp-row-selected" : ""}`} onClick={() => setParam("ticket", row.ticket_id)}>
                          <td>
                            <button type="button" className="btn btn-link btn-sm p-0" aria-pressed={isSelected} onClick={(e) => { e.stopPropagation(); setParam("ticket", row.ticket_id); }}>
                              {row.ticket_id}
                            </button>
                          </td>
                          <td><StatusChip status="tag" tone="grey" label={row.kind === "client_ticket" ? "Client" : "Service"} /></td>
                          <td>{row.site_id}</td>
                          <td>{row.fault_type || row.status || "—"}</td>
                          <td>{dateTime(row.created_at)}</td>
                          <td>{row.resolved_at ? dateTime(row.resolved_at) : <span className="sp-muted">Open</span>}</td>
                          <td>{row.resolved_at ? duration(row.duration_days) : "—"}</td>
                          <td>{row.sla_target_days == null ? <span className="sp-muted">No target</span> : `${row.sla_target_days} d`}</td>
                          <td className={late > 0 ? "text-danger fw-semibold" : ""}>{late == null ? "—" : late > 0 ? duration(late) : "On time"}</td>
                          <td><DelayChip row={row} /></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <Pager
                page={pages[tab]}
                limit={limit}
                total={total}
                onPage={(n) => setPages((p) => ({ ...p, [tab]: n }))}
                onLimit={(n) => {
                  setLimit(n);
                  setPages({ service: 1, client: 1, combined: 1 });
                }}
                label="Ticket pages"
              />
            </Panel>
          </CCol>
          {selected && (
            <CCol xl={4}>
              <TicketPanel
                row={selected}
                reasons={config.data?.delay_reason_codes || []}
                onSaved={() => {
                  svc.reload();
                  cli.reload();
                  dash.reload();
                }}
              />
            </CCol>
          )}
        </CRow>
      </div>
    </Page>
  );
}
