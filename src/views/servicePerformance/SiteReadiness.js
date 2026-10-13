import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { CButton, CCol, CFormCheck, CFormInput, CFormLabel, CFormSelect, CFormTextarea, CRow } from "@coreui/react";
import toast from "react-hot-toast";
import Page, { PageHeader } from "./components/Page";
import Panel from "./components/Panel";
import Pager from "./components/Pager";
import MetricTile from "./components/MetricTile";
import StatusChip from "./components/StatusChip";
import { performanceApi, errorText } from "./api/client";
import { useApi } from "./hooks/useApi";
import { useFilters } from "./hooks/useFilters";
import { useEngineerOptions } from "./hooks/useLookups";
import { canWriteConfig } from "./utils/access";
import { apiParams, periodText } from "./utils/filters";
import { count, day, humanize } from "./utils/format";
import { siteRows } from "./Dashboard";

const FIELD_LABELS = {
  commissioning_date: "Commissioning date",
  warranty_status: "Warranty status",
  warranty_date: "Warranty end date",
  cloth_type: "Cloth type",
  mounting_type: "Site type",
};
const STATUS_ORDER = ["configuration_incomplete", "data_incomplete", "partially_analyzable", "ready"];
const METRIC_LABELS = {
  service_ticket_counts: "Service ticket counts",
  client_ticket_counts: "Client ticket counts",
  pm_records: "PM records",
  uptime: "Uptime",
  warranty_segment: "Warranty comparison",
  cloth_segment: "Cloth type comparison",
  mounting_segment: "Site type comparison",
  assignment_time: "Assignment time (not stored)",
  reopened: "Reopen rate (not stored)",
  priority: "Priority (not stored)",
  pm_on_time: "PM on time (no PM schedule)",
  material_dispatch_time: "Material dispatch time (not stored)",
};
const toInputDate = (value) => (value ? new Date(value).toISOString().slice(0, 10) : "");

export function warrantyState(form, now = new Date()) {
  if (!form.warranty_date) return { tone: "grey", text: "Cannot be calculated until the warranty end date is set." };
  const end = new Date(form.warranty_date);
  const expired = end.getTime() < now.getTime();
  const text = expired ? `Expired on ${day(end)}` : `Active until ${day(end)}`;
  const mismatch = form.warranty_status && (form.warranty_status === "in_warranty") === expired;
  return mismatch ? { tone: "red", text: `${text}, which contradicts the stored status.` } : { tone: expired ? "amber" : "green", text };
}

function SourceChips({ row }) {
  const chip = (label, ok, title) => <StatusChip key={label} status={ok ? "recorded" : "no_record"} tone={ok ? "green" : "grey"} label={label} strike={!ok} title={title} />;
  if (!row) return <span className="sp-muted sp-small">Pick an engineer to see source data</span>;
  return (
    <div className="d-flex flex-wrap gap-1">
      {chip("Tickets", Boolean(row.service || row.client), "Service or client tickets in this period")}
      {chip("Uptime", row.uptime?.status === "available", "Monthly uptime report present")}
      {chip("PM", row.pm?.completed > 0, "Preventive maintenance records in this period")}
      <StatusChip status="unweighted" tone="blue" label="ERP: fleet only" title="Material requests are not broken down per site" />
    </div>
  );
}

function EditPanel({ siteId, period, periodLabel, canWrite, onSaved }) {
  const report = useApi((signal) => performanceApi.site(siteId, period, signal), JSON.stringify([siteId, period]));
  const config = report.data?.configuration?.sites?.find((s) => s.site_id === siteId);
  const [form, setForm] = useState(null);
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!config) return;
    setForm({
      commissioning_date: toInputDate(config.commissioning_date),
      warranty_status: config.warranty_status || "",
      warranty_date: toInputDate(config.warranty_date),
      cloth_type: config.cloth_type || "",
      mounting_type: config.mounting_type || "",
    });
  }, [config]);

  const missing = new Set(config?.missing_fields || []);
  const changes = form && config ? Object.fromEntries(Object.entries(form).filter(([k, v]) => v && v !== (k.endsWith("_date") ? toInputDate(config[k]) : config[k] || ""))) : {};
  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });
  const missingClass = (field) => (missing.has(field) && !form?.[field] ? "border border-danger rounded p-2" : "p-2");

  const save = async () => {
    setSaving(true);
    try {
      await performanceApi.updateSiteConfiguration(siteId, { ...changes, reason: reason.trim() || undefined });
      toast.success(`Saved configuration for ${siteId}`);
      setReason("");
      report.reload();
      onSaved();
    } catch (error) {
      toast.error(errorText(error));
    } finally {
      setSaving(false);
    }
  };

  const radio = (field, value, label) => (
    <CFormCheck inline type="radio" name={`sp-${field}`} id={`sp-${field}-${value}`} label={label} value={value} checked={form[field] === value} disabled={!canWrite} onChange={set(field)} />
  );

  return (
    <Panel title={`Configure ${siteId}`} subtitle={periodLabel} loading={report.loading} error={report.error} onRetry={report.reload} empty={!config} emptyText="This site was not returned by the performance API.">
      {form && (
        <>
          <div className={missingClass("commissioning_date")}>
            <CFormLabel htmlFor="sp-commissioning">Commissioning date{missing.has("commissioning_date") ? " (missing)" : ""}</CFormLabel>
            <CFormInput id="sp-commissioning" type="date" value={form.commissioning_date} disabled={!canWrite} onChange={set("commissioning_date")} />
          </div>
          <fieldset className={missingClass("warranty_status")}>
            <legend className="fs-6 mb-1">Warranty status{missing.has("warranty_status") ? " (missing)" : ""}</legend>
            {radio("warranty_status", "in_warranty", "In warranty")}
            {radio("warranty_status", "out_of_warranty", "Out of warranty")}
          </fieldset>
          <div className={missingClass("warranty_date")}>
            <CFormLabel htmlFor="sp-warranty-date">Warranty end date{missing.has("warranty_date") ? " (missing)" : ""}</CFormLabel>
            <CFormInput id="sp-warranty-date" type="date" value={form.warranty_date} disabled={!canWrite} onChange={set("warranty_date")} />
            <div className={`sp-small mt-1 ${warrantyState(form).tone === "red" ? "text-danger" : "sp-muted"}`}>{warrantyState(form).text}</div>
          </div>
          <fieldset className={missingClass("cloth_type")}>
            <legend className="fs-6 mb-1">Cloth type{missing.has("cloth_type") ? " (missing)" : ""}</legend>
            {radio("cloth_type", "PBT", "PBT")}
            {radio("cloth_type", "MF", "MF")}
          </fieldset>
          <fieldset className={missingClass("mounting_type")}>
            <legend className="fs-6 mb-1">Site type{missing.has("mounting_type") ? " (missing)" : ""}</legend>
            {radio("mounting_type", "ground", "Ground")}
            {radio("mounting_type", "rooftop", "Rooftop")}
          </fieldset>

          <CRow className="g-2 mt-1">
            <CCol sm={6}>
              <div className="fw-semibold sp-small mb-1">What this blocks</div>
              <ul className="sp-small mb-0">
                {(config.metrics_unavailable || []).map((m) => (
                  <li key={m}>{METRIC_LABELS[m] || humanize(m)}</li>
                ))}
              </ul>
            </CCol>
            <CCol sm={6}>
              <div className="fw-semibold sp-small mb-1">Still works</div>
              <ul className="sp-small mb-0">
                {(config.metrics_calculable || []).map((m) => (
                  <li key={m}>{METRIC_LABELS[m] || humanize(m)}</li>
                ))}
              </ul>
            </CCol>
          </CRow>

          {canWrite ? (
            <>
              <CFormLabel htmlFor="sp-site-reason" className="mt-2">
                Reason for change (optional)
              </CFormLabel>
              <CFormTextarea id="sp-site-reason" rows={2} value={reason} onChange={(e) => setReason(e.target.value)} />
              <CButton color="success" className="mt-2" disabled={saving || !Object.keys(changes).length} onClick={save}>
                {saving ? "Saving…" : "Save configuration"}
              </CButton>
            </>
          ) : (
            <div className="sp-banner mt-2">Read-only: your role cannot change site configuration.</div>
          )}
        </>
      )}
    </Panel>
  );
}

export default function SiteReadiness() {
  const user = useSelector((state) => state.userInfo);
  const canWrite = canWriteConfig(user);
  const [filters, setFilters] = useFilters();
  const period = apiParams({ ...filters, site_id: "", engineer_id: "" });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [selected, setSelected] = useState(null);
  const engineers = useEngineerOptions(true);
  const engineerId = filters.engineer_id;

  const gaps = useApi((signal) => performanceApi.configurationGaps({ page, limit }, signal), JSON.stringify([page, limit]));
  const assigned = useApi((signal) => performanceApi.dashboard({ ...period, engineer_id: engineerId }, signal), JSON.stringify([period, engineerId]), { enabled: Boolean(engineerId) });

  const assignedRows = siteRows(assigned.data)
    .filter((r) => r.config)
    .sort((a, b) => STATUS_ORDER.indexOf(a.config.analysis_status) - STATUS_ORDER.indexOf(b.config.analysis_status) || a.site_id.localeCompare(b.site_id));
  const rows = engineerId ? assignedRows : (gaps.data?.data || []).map((config) => ({ site_id: config.site_id, config }));
  const byStatus = (status) => (engineerId && assigned.data ? assignedRows.filter((r) => r.config.analysis_status === status).length : null);
  const needsEngineer = "Pick an engineer to see the analysis status of all their sites";
  const source = engineerId ? assigned : gaps;

  return (
    <Page>
      <PageHeader title="Site configuration readiness" subtitle="Sites missing configuration are excluded from segment comparisons until fixed." />

      <div className="d-flex flex-wrap gap-3 align-items-end mb-3">
        <div>
          <CFormLabel htmlFor="sp-readiness-engineer">Engineer</CFormLabel>
          <CFormSelect id="sp-readiness-engineer" value={engineerId} onChange={(e) => { setSelected(null); setFilters({ engineer_id: e.target.value }); }}>
            <option value="">All sites with missing configuration</option>
            {(engineers.data || []).map((u) => (
              <option key={u._id} value={u._id}>
                {u.username}
              </option>
            ))}
          </CFormSelect>
        </div>
        {engineerId && <div className="sp-small sp-muted pb-2">Source data for {periodText(filters)}</div>}
      </div>

      <CRow className="g-3 mb-3">
        <CCol sm={6} lg={3}>
          <MetricTile label="Sites missing configuration" value={count(gaps.data?.total)} hint="Across every site you can access" />
        </CCol>
        <CCol sm={6} lg={3}>
          <MetricTile label="Ready" value={count(byStatus("ready"))} na={!engineerId ? needsEngineer : null} />
        </CCol>
        <CCol sm={6} lg={3}>
          <MetricTile label="Partially analyzable" value={count(byStatus("partially_analyzable"))} na={!engineerId ? needsEngineer : null} />
        </CCol>
        <CCol sm={6} lg={3}>
          <MetricTile label="Configuration incomplete" value={count(byStatus("configuration_incomplete"))} na={!engineerId ? needsEngineer : null} />
        </CCol>
      </CRow>

      <CRow className="g-3">
        <CCol xl={selected ? 7 : 12}>
          <Panel
            title={engineerId ? "Assigned sites" : "Sites with missing configuration"}
            subtitle="Sites needing attention are listed first. Select a row to configure it."
            loading={source.loading}
            error={source.error}
            onRetry={source.reload}
            empty={!rows.length}
            emptyText={engineerId ? "This engineer has no assigned sites." : "Every site has its required configuration."}
          >
            <div className="sp-table-wrap">
              <table className="table sp-table mb-2">
                <thead>
                  <tr>
                    <th scope="col">Site</th>
                    <th scope="col">Status</th>
                    <th scope="col">Missing fields</th>
                    <th scope="col">Source data</th>
                    <th scope="col">Warranty</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr
                      key={row.site_id}
                      tabIndex={0}
                      className={`sp-row-click${selected === row.site_id ? " sp-row-selected" : ""}`}
                      aria-selected={selected === row.site_id}
                      onClick={() => setSelected(row.site_id)}
                      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setSelected(row.site_id))}
                    >
                      <td className="fw-semibold">{row.site_id}</td>
                      <td>
                        <StatusChip status={row.config.analysis_status || row.config.configuration_status} />
                      </td>
                      <td>{row.config.missing_fields.length ? row.config.missing_fields.map((f) => FIELD_LABELS[f] || humanize(f)).join(", ") : <span className="sp-muted">None</span>}</td>
                      <td>
                        <SourceChips row={engineerId ? row : null} />
                      </td>
                      <td>{row.config.warranty_inconsistent ? <StatusChip status="calculation_error" tone="red" label="Status contradicts date" /> : <span className="sp-muted">{row.config.warranty_status ? humanize(row.config.warranty_status) : "Not set"}</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!engineerId && gaps.data && (
              <Pager page={page} limit={limit} total={gaps.data.total} onPage={setPage} onLimit={(value) => { setLimit(value); setPage(1); }} label="sites" />
            )}
          </Panel>
        </CCol>
        {selected && (
          <CCol xl={5}>
            <EditPanel siteId={selected} period={period} periodLabel={periodText(filters)} canWrite={canWrite} onSaved={() => (engineerId ? assigned.reload() : gaps.reload())} />
          </CCol>
        )}
      </CRow>
    </Page>
  );
}
