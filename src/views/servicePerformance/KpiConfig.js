import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { CButton, CCol, CFormInput, CFormLabel, CFormSelect, CFormSwitch, CFormTextarea, CRow } from "@coreui/react";
import toast from "react-hot-toast";
import Page, { PageHeader } from "./components/Page";
import Panel from "./components/Panel";
import StatusChip from "./components/StatusChip";
import CategoryWeights from "./components/CategoryWeights";
import { performanceApi, strategyRegistryFrom, errorText } from "./api/client";
import { useApi } from "./hooks/useApi";
import { canWriteConfig } from "./utils/access";
import { weightsValid } from "./utils/score";
import { dateTime, day, humanize } from "./utils/format";

const STRATEGY_LABELS = {
  target_achievement: "Target achievement",
  sla_compliance: "SLA compliance",
  percentage: "Percentage",
  threshold: "Threshold bands",
  inverse_duration: "Duration based",
};
const NEEDS_TARGET = new Set(["target_achievement", "inverse_duration"]);
const SLUG = /^[a-z][a-z0-9_]{1,59}$/;
const clone = (value) => JSON.parse(JSON.stringify(value));

export function categoryRows(draft, active) {
  const sum = (config, key) => (config?.kpis || []).filter((k) => k.category === key && k.enabled !== false).reduce((s, k) => s + Number(k.weight || 0), 0);
  return (draft?.categories || []).map((c) => ({
    key: c.key,
    name: c.label || humanize(c.key),
    kpiCount: (draft.kpis || []).filter((k) => k.category === c.key && k.enabled !== false).length,
    weight: sum(draft, c.key),
    was: sum(active, c.key),
  }));
}

/** Sets a category's weight by scaling its enabled KPIs, or splitting evenly when they are all 0. */
export function setCategoryWeight(draft, key, value) {
  const kpis = draft.kpis.map((k) => ({ ...k }));
  const inCategory = kpis.filter((k) => k.category === key && k.enabled !== false);
  const current = inCategory.reduce((s, k) => s + Number(k.weight || 0), 0);
  for (const kpi of inCategory) kpi.weight = current > 0 ? (Number(kpi.weight || 0) / current) * value : value / inCategory.length;
  return { ...draft, kpis };
}

const numberOrNull = (value) => (value === "" || value == null ? null : Number(value));

export default function KpiConfig() {
  const user = useSelector((state) => state.userInfo);
  const canWrite = canWriteConfig(user);
  const active = useApi((signal) => performanceApi.config(signal), "config");
  const history = useApi((signal) => performanceApi.configHistory(signal), "history");
  const [draft, setDraft] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [validation, setValidation] = useState(null);
  const [effective, setEffective] = useState(new Date().toISOString().slice(0, 10));
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [newKpi, setNewKpi] = useState({ key: "", name: "", category: "", strategy: "" });
  const [newReason, setNewReason] = useState({ code: "", label: "" });

  useEffect(() => {
    if (active.data && !dirty) setDraft(clone(active.data));
  }, [active.data, dirty]);

  const registry = strategyRegistryFrom(active.data);
  const boundKeys = new Set((active.data?.kpis || []).map((k) => k.key));
  const serverDraft = (history.data || []).find((c) => c.status === "draft" && c.version > (active.data?.version || 0));
  const rows = useMemo(() => categoryRows(draft, active.data), [draft, active.data]);
  const valid = weightsValid(rows);

  const edit = (next) => {
    setDraft(next);
    setDirty(true);
    setValidation(null);
  };
  const editKpi = (key, patch) => edit({ ...draft, kpis: draft.kpis.map((k) => (k.key === key ? { ...k, ...patch } : k)) });

  const localChecks = () => {
    const lines = [[valid ? "pass" : "fail", valid ? "Category weights total 100%." : "Category weights do not total 100%."]];
    for (const kpi of draft?.kpis || []) {
      if (kpi.enabled === false || !(kpi.weight > 0)) continue;
      if (NEEDS_TARGET.has(kpi.strategy) && kpi.target == null && kpi.key !== "cleaning_uptime") lines.push(["warn", `${kpi.name}: no target, so it will always be excluded.`]);
      if (!boundKeys.has(kpi.key)) lines.push(["warn", `${kpi.name}: the scoring engine has no data source for key ${kpi.key}; it will be excluded.`]);
    }
    return lines;
  };

  const body = () => ({ ...draft, effective_from: effective || null, reason: reason.trim() });

  const validate = async () => {
    try {
      const result = await performanceApi.validateConfig(body());
      setValidation([...localChecks(), ...(result.valid ? [["pass", "Server validation passed."]] : result.errors.map((e) => ["fail", e]))]);
    } catch (error) {
      setValidation([...localChecks(), ["fail", errorText(error)]]);
    }
  };

  const activate = async () => {
    setBusy(true);
    try {
      const created = await performanceApi.createConfig(body());
      await performanceApi.activateConfig(created.version);
      toast.success(`Scoring v${created.version} is active`);
      setDirty(false);
      setReason("");
      active.reload();
      history.reload();
    } catch (error) {
      toast.error(errorText(error));
    } finally {
      setBusy(false);
    }
  };

  const addKpi = () => {
    if (!SLUG.test(newKpi.key) || draft.kpis.some((k) => k.key === newKpi.key) || !newKpi.category || !newKpi.strategy) return;
    edit({
      ...draft,
      kpis: [...draft.kpis, { key: newKpi.key, name: newKpi.name || newKpi.key, description: "", category: newKpi.category, enabled: true, strategy: newKpi.strategy, target: null, threshold: null, weight: 0, missing_data: "exclude" }],
    });
    setNewKpi({ key: "", name: "", category: "", strategy: "" });
  };

  const addReason = () => {
    if (!SLUG.test(newReason.code) || draft.delay_reason_codes.some((r) => r.code === newReason.code)) return;
    edit({ ...draft, delay_reason_codes: [...draft.delay_reason_codes, { code: newReason.code, label: newReason.label || humanize(newReason.code), enabled: true, isNew: true }] });
    setNewReason({ code: "", label: "" });
  };

  const newKeyInvalid = newKpi.key && (!SLUG.test(newKpi.key) || draft?.kpis.some((k) => k.key === newKpi.key));
  const disabled = !canWrite || busy;

  return (
    <Page>
      <PageHeader
        title="KPI & scoring configuration"
        subtitle={active.data ? (active.data.version ? `Active since ${day(active.data.effective_from)}` : "Built-in default, never saved") : ""}
        actions={
          <>
            {active.data && <StatusChip status="final" tone="green" label={`Active v${active.data.version}`} />}
            {(dirty || serverDraft) && <StatusChip status="provisional" label={dirty ? "Draft: unsaved changes" : `Draft v${serverDraft.version} on server`} />}
            <CButton size="sm" color="secondary" variant="outline" disabled={!dirty || busy} onClick={() => { setDirty(false); setDraft(clone(active.data)); setValidation(null); }}>
              Discard draft
            </CButton>
            <CButton size="sm" color="secondary" disabled={!draft || busy} onClick={validate}>
              Validate
            </CButton>
            <CButton size="sm" color="success" disabled={disabled || !valid || !reason.trim() || !draft} onClick={activate} title={!reason.trim() ? "A reason is required" : undefined}>
              {busy ? "Activating…" : "Activate"}
            </CButton>
          </>
        }
      />
      {!canWrite && <div className="sp-banner">Read-only: your role can view scoring but not change it.</div>}

      <CRow className="g-3">
        <CCol xl={8}>
          <div className="mb-3">
            <Panel title="Category weights" loading={active.loading} error={active.error} onRetry={active.reload}>
              {draft && <CategoryWeights rows={rows} disabled={disabled} onChange={(key, value) => edit(setCategoryWeight(draft, key, value))} />}
            </Panel>
          </div>
          <div className="mb-3">
            <Panel title="Thresholds" loading={active.loading} error={active.error}>
              {draft && (
                <CRow className="g-2">
                  {[
                    ["uptime_target", "Uptime target (%)"],
                    ["client_ticket_sla_days", "Client ticket SLA (days)"],
                    ["material_delay_days", "Material delay threshold (days)"],
                  ].map(([field, label]) => (
                    <CCol md={4} key={field}>
                      <CFormLabel htmlFor={`sp-${field}`}>{label}</CFormLabel>
                      <CFormInput id={`sp-${field}`} type="number" min={0} value={draft[field] ?? ""} placeholder="Not set" disabled={disabled} onChange={(e) => edit({ ...draft, [field]: numberOrNull(e.target.value) })} />
                    </CCol>
                  ))}
                </CRow>
              )}
            </Panel>
          </div>
          <Panel title="KPI definitions" subtitle="Strategies come from the scoring registry. There are no formula or code inputs." loading={active.loading} error={active.error}>
            {draft && (
              <>
                <div className="sp-table-wrap">
                  <table className="table sp-table mb-2">
                    <thead>
                      <tr>
                        <th scope="col">KPI</th>
                        <th scope="col">Strategy</th>
                        <th scope="col">Target</th>
                        <th scope="col">Weight in category</th>
                        <th scope="col">Missing data</th>
                        <th scope="col">Enabled</th>
                      </tr>
                    </thead>
                    <tbody>
                      {draft.kpis.map((kpi) => {
                        const cat = rows.find((r) => r.key === kpi.category);
                        const share = cat?.weight > 0 && kpi.enabled !== false ? (kpi.weight / cat.weight) * 100 : null;
                        return (
                          <tr key={kpi.key}>
                            <td>
                              {kpi.name}
                              <div className="sp-mono sp-muted">{kpi.key}</div>
                              <div className="sp-small sp-muted">{cat?.name || kpi.category}</div>
                            </td>
                            <td>
                              <CFormSelect size="sm" aria-label={`Strategy for ${kpi.name}`} value={kpi.strategy} disabled={disabled} onChange={(e) => editKpi(kpi.key, { strategy: e.target.value })}>
                                {[...new Set([...registry, kpi.strategy])].map((s) => (
                                  <option key={s} value={s}>
                                    {STRATEGY_LABELS[s] || humanize(s)}
                                  </option>
                                ))}
                              </CFormSelect>
                            </td>
                            <td>
                              <CFormInput size="sm" type="number" min={0} style={{ width: 100 }} aria-label={`Target for ${kpi.name}`} value={kpi.target ?? ""} placeholder="None" disabled={disabled} onChange={(e) => editKpi(kpi.key, { target: numberOrNull(e.target.value) })} />
                            </td>
                            <td>{share == null ? <span className="sp-muted">—</span> : `${share.toFixed(1)}%`}<div className="sp-small sp-muted">{Number(kpi.weight).toFixed(1)} of total</div></td>
                            <td>
                              <CFormSelect size="sm" aria-label={`Missing data policy for ${kpi.name}`} value={kpi.missing_data || "exclude"} disabled={disabled} onChange={(e) => editKpi(kpi.key, { missing_data: e.target.value })}>
                                <option value="exclude">Exclude</option>
                                <option value="zero">Count as 0</option>
                                <option value="block" disabled>
                                  Block score (not supported)
                                </option>
                              </CFormSelect>
                              <div className="mt-1">
                                <StatusChip status={kpi.missing_data === "zero" ? "late" : "excluded"} tone={kpi.missing_data === "zero" ? "amber" : "grey"} label={kpi.missing_data === "zero" ? "Count as 0" : "Exclude"} />
                              </div>
                            </td>
                            <td>
                              <CFormSwitch role="switch" aria-checked={kpi.enabled !== false} id={`sp-enable-${kpi.key}`} label={kpi.enabled !== false ? "On" : "Off"} checked={kpi.enabled !== false} disabled={disabled} onChange={(e) => editKpi(kpi.key, { enabled: e.target.checked })} />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {canWrite && (
                  <fieldset className="border rounded p-2">
                    <legend className="float-none w-auto px-1 fs-6 mb-0">Add KPI</legend>
                    <CRow className="g-2 align-items-end">
                      <CCol md={3}>
                        <CFormLabel htmlFor="sp-new-key">Stable key</CFormLabel>
                        <CFormInput id="sp-new-key" className="sp-mono" value={newKpi.key} invalid={Boolean(newKeyInvalid)} onChange={(e) => setNewKpi({ ...newKpi, key: e.target.value.trim() })} placeholder="lower_snake_case" />
                      </CCol>
                      <CCol md={3}>
                        <CFormLabel htmlFor="sp-new-name">Name</CFormLabel>
                        <CFormInput id="sp-new-name" value={newKpi.name} onChange={(e) => setNewKpi({ ...newKpi, name: e.target.value })} />
                      </CCol>
                      <CCol md={2}>
                        <CFormLabel htmlFor="sp-new-cat">Category</CFormLabel>
                        <CFormSelect id="sp-new-cat" value={newKpi.category} onChange={(e) => setNewKpi({ ...newKpi, category: e.target.value })}>
                          <option value="">Select</option>
                          {draft.categories.map((c) => (
                            <option key={c.key} value={c.key}>
                              {c.label}
                            </option>
                          ))}
                        </CFormSelect>
                      </CCol>
                      <CCol md={2}>
                        <CFormLabel htmlFor="sp-new-strategy">Strategy</CFormLabel>
                        <CFormSelect id="sp-new-strategy" value={newKpi.strategy} onChange={(e) => setNewKpi({ ...newKpi, strategy: e.target.value })}>
                          <option value="">Select</option>
                          {registry.map((s) => (
                            <option key={s} value={s}>
                              {STRATEGY_LABELS[s] || humanize(s)}
                            </option>
                          ))}
                        </CFormSelect>
                      </CCol>
                      <CCol md={2}>
                        <CButton color="secondary" onClick={addKpi} disabled={!newKpi.key || newKeyInvalid || !newKpi.category || !newKpi.strategy}>
                          Add KPI
                        </CButton>
                      </CCol>
                    </CRow>
                    <div className="sp-small sp-muted mt-1">New KPIs start at weight 0. The engine only has data for existing keys, so a new key stays excluded until the backend binds it.</div>
                  </fieldset>
                )}
              </>
            )}
          </Panel>
        </CCol>

        <CCol xl={4}>
          <div className="mb-3">
            <Panel title="Validation results" empty={!validation} emptyText="Press Validate to check this draft.">
              <ul className="list-unstyled mb-0">
                {(validation || []).map(([level, text], i) => (
                  <li key={i} className="d-flex gap-2 mb-1 sp-small">
                    <StatusChip status={level} tone={level === "pass" ? "green" : level === "warn" ? "amber" : "red"} label={level === "pass" ? "Pass" : level === "warn" ? "Warn" : "Fail"} />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>
          <div className="mb-3">
            <Panel title="Activation">
              <CFormLabel htmlFor="sp-effective">Effective date</CFormLabel>
              <CFormInput id="sp-effective" type="date" value={effective} disabled={disabled} onChange={(e) => setEffective(e.target.value)} />
              <CFormLabel htmlFor="sp-reason" className="mt-2">
                Reason (required)
              </CFormLabel>
              <CFormTextarea id="sp-reason" rows={3} value={reason} disabled={disabled} invalid={dirty && !reason.trim()} onChange={(e) => setReason(e.target.value)} />
              <div className="sp-small sp-muted mt-2">Activating saves a new version and archives the previous one. Finalized months keep the version they were scored with; recalculation creates a separate labelled result.</div>
            </Panel>
          </div>
          <div className="mb-3">
            <Panel title="Delay reason categories" loading={active.loading}>
              {draft && (
                <>
                  <div className="d-flex flex-wrap gap-2 mb-2">
                    {draft.delay_reason_codes.map((r) => (
                      <span key={r.code} className={`sp-chip sp-chip--${r.enabled === false ? "grey sp-chip--strike" : "blue"}`}>
                        {r.label}
                        <button
                          type="button"
                          className="btn btn-link btn-sm p-0 text-reset"
                          aria-pressed={r.enabled !== false}
                          aria-label={`${r.enabled === false ? "Enable" : "Disable"} ${r.label}`}
                          disabled={disabled}
                          onClick={() =>
                            edit({
                              ...draft,
                              delay_reason_codes: r.isNew ? draft.delay_reason_codes.filter((x) => x.code !== r.code) : draft.delay_reason_codes.map((x) => (x.code === r.code ? { ...x, enabled: x.enabled === false } : x)),
                            })
                          }
                        >
                          {r.isNew ? "×" : r.enabled === false ? "+" : "−"}
                        </button>
                      </span>
                    ))}
                  </div>
                  {canWrite && (
                    <div className="d-flex gap-2">
                      <CFormInput size="sm" className="sp-mono" aria-label="New reason code" placeholder="code" value={newReason.code} onChange={(e) => setNewReason({ ...newReason, code: e.target.value.trim() })} />
                      <CFormInput size="sm" aria-label="New reason label" placeholder="Label" value={newReason.label} onChange={(e) => setNewReason({ ...newReason, label: e.target.value })} />
                      <CButton size="sm" color="secondary" onClick={addReason} disabled={!SLUG.test(newReason.code)}>
                        Add
                      </CButton>
                    </div>
                  )}
                  <div className="sp-small sp-muted mt-1">Existing codes can only be disabled, because past tickets reference them.</div>
                </>
              )}
            </Panel>
          </div>
          <Panel title="Version history" loading={history.loading} error={history.error} onRetry={history.reload} empty={!history.data?.length} emptyText="No saved version. The built-in default is in use.">
            <ol className="sp-timeline">
              {(history.data || []).map((v) => (
                <li key={v.version} className={v.status === "active" ? "sp-done" : ""}>
                  <div className="d-flex gap-2 align-items-center">
                    <strong>v{v.version}</strong>
                    <StatusChip status={v.status} tone={v.status === "active" ? "green" : v.status === "draft" ? "amber" : "grey"} label={humanize(v.status)} />
                  </div>
                  <div className="sp-small sp-muted">
                    {v.created_by?.name || "Unknown"} · {dateTime(v.createdAt)}
                  </div>
                  {v.reason && <div className="sp-small">{v.reason}</div>}
                </li>
              ))}
            </ol>
          </Panel>
        </CCol>
      </CRow>
    </Page>
  );
}
