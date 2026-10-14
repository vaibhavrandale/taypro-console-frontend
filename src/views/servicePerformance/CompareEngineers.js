import React, { useState } from "react";
import { useSelector } from "react-redux";
import { CButton, CCol, CRow } from "@coreui/react";
import toast from "react-hot-toast";
import ConfirmModal from "../../components/ConfirmModal";
import Page, { PageHeader } from "./components/Page";
import Panel from "./components/Panel";
import FilterBar from "./components/FilterBar";
import MetricTile from "./components/MetricTile";
import StatusChip from "./components/StatusChip";
import TableSearch, { rowMatches } from "./components/TableSearch";
import { performanceApi, toApiError, errorText } from "./api/client";
import { useApi } from "./hooks/useApi";
import { useFilters } from "./hooks/useFilters";
import { useEngineerOptions, useFaultOptions, useSiteOptions } from "./hooks/useLookups";
import { canReadAll } from "./utils/access";
import { apiParams, periodText } from "./utils/filters";
import { kpiScore, scoreSummary } from "./utils/score";
import { duration, num, pct } from "./utils/format";
import { uptimeChip } from "./Dashboard";

const MAX_COMPARE = 20;
const SEGMENTS = [
  ["Ground", { mounting_type: "ground" }],
  ["Rooftop", { mounting_type: "rooftop" }],
  ["PBT", { cloth_type: "PBT" }],
  ["MF", { cloth_type: "MF" }],
  ["PBT+MF", { cloth_type: "PBT+MF" }],
  ["In warranty", { warranty_status: "in_warranty" }],
  ["Out of warranty", { warranty_status: "out_of_warranty" }],
];

function median(values) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function ScoreBar({ score, completeness }) {
  if (score == null) return <span className="sp-muted">—</span>;
  const tone = completeness != null && completeness < 80 ? "amber" : "";
  return (
    <div className="d-flex align-items-center gap-2" style={{ minWidth: 140 }}>
      <div className="sp-bar" role="img" aria-label={`Score ${num(score)}${tone ? ", completeness under 80%" : ""}`}>
        <div className={`sp-bar-fill${tone ? " sp-bar-fill--amber" : ""}`} style={{ width: `${Math.min(100, score)}%` }} />
      </div>
      <strong>{num(score)}</strong>
    </div>
  );
}

export function warningsFor(engineers) {
  const out = [];
  for (const e of engineers) {
    const name = e.engineer?.username || "Engineer";
    for (const kpi of e.score?.kpis || []) {
      if (kpi.status === "excluded") out.push(["Data", `${name}: ${kpi.key} excluded (${kpi.reason || "missing_data"})`]);
    }
    if (e.configuration?.incomplete_count) out.push(["Config", `${name}: ${e.configuration.incomplete_count} site(s) missing configuration`]);
    if (e.uptime?.missing_sites?.length) out.push(["Uptime", `${name}: no uptime report for ${e.uptime.missing_sites.join(", ")}`]);
  }
  return out;
}

const WARNING_TONE = { Failure: "red", Data: "amber", Config: "red", Uptime: "blue" };

export default function CompareEngineers() {
  const user = useSelector((state) => state.userInfo);
  const [filters, setFilters] = useFilters();
  const params = apiParams({ ...filters, engineer_id: "" });
  const engineers = useEngineerOptions(true);
  const list = (engineers.data || []).slice(0, MAX_COMPARE);
  const ids = list.map((u) => u._id).join(",");
  const compareKey = JSON.stringify([params, ids]);

  const compare = useApi((signal) => performanceApi.compare({ ...params, engineer_ids: ids }, signal), compareKey, { delay: 300, enabled: list.length >= 2 });
  const gaps = useApi((signal) => performanceApi.configurationGaps({ limit: 1 }, signal), "gaps");
  const segments = useApi(
    (signal) =>
      Promise.all(
        SEGMENTS.map(([label, trait]) =>
          performanceApi
            .dashboard({ ...params, ...trait }, signal)
            .then((report) => ({ label, report }))
            .catch((error) => {
              if (signal.aborted) throw error;
              return { label, error: toApiError(error) };
            }),
        ),
      ),
    JSON.stringify(params),
    { delay: 300 },
  );
  const sites = useSiteOptions(null, filters.site_id);
  const faults = useFaultOptions();
  const [confirm, setConfirm] = useState(false);
  const [running, setRunning] = useState(false);
  const [scoreQ, setScoreQ] = useState("");
  const [segmentQ, setSegmentQ] = useState("");

  const allRows = compare.data?.engineers || [];
  const rows = allRows.filter((r) => rowMatches(scoreQ, [r.engineer?.username, r.engineer?.email]));
  const scored = allRows.filter((r) => r.score?.overall_score != null);
  const warnings = [...(compare.error ? [["Failure", `Comparison failed: ${errorText(compare.error)}`]] : []), ...warningsFor(allRows)];
  const canRecalculate = canReadAll(user) && filters.mode === "month" && list.length > 0;

  const recalculate = async () => {
    setRunning(true);
    const failed = [];
    for (const engineer of list) {
      try {
        await performanceApi.recalculate({ month: filters.month, year: filters.year, engineer_id: engineer._id });
      } catch (error) {
        failed.push(`${engineer.username}: ${errorText(error)}`);
      }
    }
    setRunning(false);
    setConfirm(false);
    if (failed.length) toast.error(`${failed.length} of ${list.length} recalculations failed\n${failed.join("\n")}`, { duration: 10000, style: { whiteSpace: "pre-line" } });
    else toast.success(`Stored ${list.length} labelled snapshots for ${periodText(filters)}`);
    compare.reload();
  };

  return (
    <Page>
      <PageHeader
        title="Compare engineers"
        subtitle={`${periodText(filters)} · ${list.length} service engineer${list.length === 1 ? "" : "s"}${(engineers.data || []).length > MAX_COMPARE ? ` (first ${MAX_COMPARE} of ${engineers.data.length})` : ""}`}
        actions={
          <CButton color="success" size="sm" disabled={!canRecalculate || running} onClick={() => setConfirm(true)} title={filters.mode !== "month" ? "Recalculation works on a single month" : undefined}>
            Recalculate period
          </CButton>
        }
      />
      <FilterBar filters={{ ...filters, engineer_id: "" }} setFilters={setFilters} sites={sites} faults={faults} />

      <CRow className="g-3 mb-3">
        <CCol md={3} sm={6}><MetricTile label="Engineers scored" value={compare.loading ? "…" : `${scored.length} of ${allRows.length}`} /></CCol>
        <CCol md={3} sm={6}><MetricTile label="Median score" value={num(median(scored.map((r) => r.score.overall_score)))} /></CCol>
        <CCol md={3} sm={6}><MetricTile label="Sites needing configuration" value={gaps.data ? gaps.data.total : "—"} /></CCol>
        <CCol md={3} sm={6}><MetricTile label="Calculation failures" value={compare.error ? 1 : 0} hint={compare.error ? errorText(compare.error) : "Requests that failed"} /></CCol>
      </CRow>

      <div className="mb-3">
        <Panel
          title="Scorecard"
          loading={engineers.loading || compare.loading}
          error={engineers.error || compare.error}
          onRetry={compare.reload}
          empty={list.length < 2}
          emptyText="At least two users with designation Service Engineer are needed to compare."
        >
          <TableSearch value={scoreQ} onChange={setScoreQ} placeholder="Search engineer" label="Search engineers" />
          <div className="sp-table-wrap">
            <table className="table sp-table mb-0">
              <thead>
                <tr>
                  <th scope="col">Engineer</th>
                  <th scope="col">Region</th>
                  <th scope="col">Sites</th>
                  <th scope="col">Overall score</th>
                  <th scope="col">Completeness</th>
                  <th scope="col">Service</th>
                  <th scope="col">Client</th>
                  <th scope="col">Uptime</th>
                  <th scope="col">PM</th>
                  <th scope="col">Materials</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const s = scoreSummary(r.score);
                  return (
                    <tr key={r.engineer?.user_id}>
                      <td>{r.engineer?.username || r.engineer?.email}</td>
                      <td className="sp-muted">Not stored</td>
                      <td>{r.engineer?.assigned_site_count ?? "—"}</td>
                      <td><ScoreBar score={s.overall} completeness={s.completeness} /></td>
                      <td>{pct(s.completeness)}</td>
                      <td>{num(kpiScore(r, "service_ticket_sla"))}</td>
                      <td>{num(kpiScore(r, "client_ticket_sla"))}</td>
                      <td>{num(kpiScore(r, "cleaning_uptime"))}</td>
                      <td>{num(kpiScore(r, "pm_completed"))}</td>
                      <td>{num(kpiScore(r, "material_request_on_time"))}</td>
                      <td>
                        {s.overall == null ? <StatusChip status="data_incomplete" title="No KPI had eligible data" /> : <StatusChip status={s.provisional ? "provisional" : "final"} />}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="sp-small sp-muted mt-2">Category columns are KPI scores out of 100. “—” means the KPI had no eligible data and was left out of the overall score.</div>
        </Panel>
      </div>

      <CRow className="g-3">
        <CCol xl={8}>
          <Panel title="Segment comparison" subtitle="All sites in each segment for this period." loading={segments.loading} error={segments.error} onRetry={segments.reload}>
            <TableSearch value={segmentQ} onChange={setSegmentQ} placeholder="Search segment" label="Search segments" />
            <div className="sp-table-wrap">
              <table className="table table-sm mb-0" style={{ minWidth: 760 }}>
                <thead>
                  <tr>
                    <th scope="col">Segment</th>
                    <th scope="col">Sites</th>
                    <th scope="col">Tickets per site</th>
                    <th scope="col">Avg resolution</th>
                    <th scope="col">Uptime</th>
                    <th scope="col">Parts per resolved ticket</th>
                  </tr>
                </thead>
                <tbody>
                  {(segments.data || []).filter(({ label }) => rowMatches(segmentQ, [label])).map(({ label, report, error }) => {
                    if (error) {
                      return (
                        <tr key={label}>
                          <td>{label}</td>
                          <td colSpan={5}><StatusChip status="calculation_error" title={errorText(error)} /></td>
                        </tr>
                      );
                    }
                    const siteCount = report?.site_ids?.length ?? 0;
                    const resolved = report?.service_tickets?.resolved_in_period || 0;
                    return (
                      <tr key={label}>
                        <td>{label}</td>
                        <td>{siteCount}</td>
                        <td>{siteCount ? num((report.service_tickets?.created_in_period || 0) / siteCount) : "—"}</td>
                        <td>{duration(report?.service_tickets?.average_resolution_days)}</td>
                        <td>
                          {report?.uptime?.cleaning_uptime == null ? <span className="sp-muted">No record</span> : pct(report.uptime.cleaning_uptime)} {report?.uptime?.cleaning_uptime != null && uptimeChip(report.uptime.aggregation)}
                        </td>
                        <td>{resolved && report?.consumption?.expected != null ? num(report.consumption.expected / resolved, 2) : "—"}</td>
                      </tr>
                    );
                  })}
                  {segments.data && (
                    <tr>
                      <td>Unclassified</td>
                      <td colSpan={5} className="sp-muted">n/a: the API cannot filter sites with a missing field. See sites needing configuration.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Panel>
        </CCol>
        <CCol xl={4}>
          <Panel title="Warnings & calculation failures" loading={compare.loading} empty={!warnings.length} emptyText="No warnings for this period.">
            <ul className="list-unstyled mb-0">
              {warnings.slice(0, 40).map(([type, text], i) => (
                <li key={i} className="d-flex gap-2 align-items-start mb-2 sp-small">
                  <StatusChip status={type} tone={WARNING_TONE[type]} label={type} />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
            {warnings.length > 40 && <div className="sp-small sp-muted">and {warnings.length - 40} more</div>}
          </Panel>
        </CCol>
      </CRow>

      <ConfirmModal
        visible={confirm}
        onClose={() => setConfirm(false)}
        onConfirm={recalculate}
        loading={running}
        confirmColor="success"
        confirmLabel="Recalculate"
        title={`Recalculate ${periodText(filters)}?`}
        message={`This stores a labelled snapshot for ${list.length} engineer(s) with the active scoring version. Existing snapshots for other versions are kept.`}
      />
    </Page>
  );
}
