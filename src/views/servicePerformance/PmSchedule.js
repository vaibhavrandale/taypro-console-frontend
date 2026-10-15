import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { CButton, CCol, CFormCheck, CFormInput, CFormLabel, CFormSelect, CFormTextarea, CRow } from "@coreui/react";
import toast from "react-hot-toast";
import ConfirmModal from "../../components/ConfirmModal";
import Page, { PageHeader } from "./components/Page";
import Panel from "./components/Panel";
import Pager from "./components/Pager";
import StatusChip from "./components/StatusChip";
import PmSummary from "./components/PmSummary";
import TableSearch from "./components/TableSearch";
import { errorText, lookupApi, performanceApi } from "./api/client";
import { useApi } from "./hooks/useApi";
import { canWriteConfig } from "./utils/access";
import { dateTime, day } from "./utils/format";

const STATUSES = ["upcoming", "pending", "overdue", "completed_on_time", "completed_late", "no_robots"];
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const pad = (n) => String(n).padStart(2, "0");

/** Calendar quarters around today in Asia/Kolkata, labelled with their months so there is no FY ambiguity. */
export function quarterOptions(now = new Date()) {
  const ist = new Date(now.getTime() + 5.5 * 3600000);
  const base = ist.getUTCFullYear() * 4 + Math.floor(ist.getUTCMonth() / 3);
  return [-1, 0, 1, 2].map((offset) => {
    const q = base + offset;
    const year = Math.floor(q / 4);
    const first = (q % 4) * 3;
    const lastDay = new Date(Date.UTC(year, first + 3, 0)).getUTCDate();
    return {
      value: `${year}-${first}`,
      label: `${MONTH_NAMES[first]}–${MONTH_NAMES[first + 2]} ${year}${offset === 0 ? " (current)" : ""}`,
      start: `${year}-${pad(first + 1)}-01`,
      end: `${year}-${pad(first + 3)}-${pad(lastDay)}`,
    };
  });
}

function SitePicker({ sites, selected, onChange, disabled }) {
  const [query, setQuery] = useState("");
  const shown = sites.filter((s) => s.toLowerCase().includes(query.trim().toLowerCase()));
  const toggle = (id) => onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);
  return (
    <fieldset disabled={disabled}>
      <legend className="fs-6 mb-1">Sites ({selected.length} selected)</legend>
      <div className="d-flex gap-2 mb-2">
        <CFormInput size="sm" aria-label="Search sites" placeholder="Search site_id" value={query} onChange={(e) => setQuery(e.target.value)} />
        <CButton size="sm" color="secondary" variant="outline" onClick={() => onChange([...new Set([...selected, ...shown])])}>
          Select shown
        </CButton>
        <CButton size="sm" color="secondary" variant="outline" onClick={() => onChange([])} disabled={!selected.length}>
          Clear
        </CButton>
      </div>
      <div className="border rounded p-2" style={{ maxHeight: 220, overflowY: "auto", borderColor: "var(--sp-border)" }}>
        {shown.length ? (
          shown.map((id) => <CFormCheck key={id} id={`sp-pm-site-${id}`} label={id} checked={selected.includes(id)} onChange={() => toggle(id)} />)
        ) : (
          <div className="sp-small sp-muted">No site matches "{query}".</div>
        )}
      </div>
    </fieldset>
  );
}

/** Unique users from the recipients response. An explicit pick wins over the server's default selection. */
export function recipientState(data, picks) {
  const users = new Map();
  for (const u of [...(data?.sites || []).flatMap((s) => s.users), ...(data?.internal || [])]) users.set(u._id, u);
  const checked = (u) => picks[u._id] ?? u.default_selected;
  const chosen = [...users.values()].filter(checked);
  return { checked, chosen, ids: chosen.map((u) => u._id), emails: chosen.filter((u) => u.email).length };
}

function RecipientGroup({ title, users, state, setPicks, prefix, emptyText }) {
  const all = users.length > 0 && users.every(state.checked);
  return (
    <div className="mb-2">
      <div className="d-flex justify-content-between align-items-center">
        <span className="fw-semibold sp-small">{title}</span>
        {users.length > 0 && (
          <CButton size="sm" color="link" className="p-0" onClick={() => setPicks((p) => ({ ...p, ...Object.fromEntries(users.map((u) => [u._id, !all])) }))}>
            {all ? "Clear" : "Select all"}
          </CButton>
        )}
      </div>
      {users.length ? (
        users.map((u) => (
          <CFormCheck
            key={u._id}
            id={`sp-pm-${prefix}-${u._id}`}
            checked={state.checked(u)}
            onChange={() => setPicks((p) => ({ ...p, [u._id]: !state.checked(u) }))}
            label={
              <span>
                {u.username}
                <span className="sp-muted sp-small">
                  {" "}· {u.designation ? `${u.role}, ${u.designation}` : u.role} · {u.email || <span className="text-warning">no email, app notification only</span>}
                </span>
              </span>
            }
          />
        ))
      ) : (
        <div className="sp-small sp-muted">{emptyText}</div>
      )}
    </div>
  );
}

export function RecipientPicker({ recipients, state, setPicks, disabled }) {
  if (recipients.loading) return <div className="sp-small sp-muted mt-2">Loading users linked to the selected sites…</div>;
  if (recipients.error) {
    return (
      <div className="sp-notice sp-notice--red mt-2" role="alert">
        <strong>Recipients could not be loaded:</strong> {errorText(recipients.error)}{" "}
        <CButton size="sm" color="link" className="p-0" onClick={recipients.reload}>Retry</CButton>
      </div>
    );
  }
  const data = recipients.data;
  if (!data) return null;
  const withoutEmail = state.chosen.length - state.emails;
  return (
    <fieldset disabled={disabled} className="mt-2">
      <legend className="fs-6 mb-1">Recipients ({state.chosen.length} selected)</legend>
      <div className="border rounded p-2" style={{ maxHeight: 320, overflowY: "auto", borderColor: "var(--sp-border)" }}>
        {data.sites.map((s) => (
          <RecipientGroup
            key={s.site_id}
            prefix={s.site_id}
            title={`${s.site_id} · ${s.users.length} user${s.users.length === 1 ? "" : "s"} linked`}
            users={s.users}
            state={state}
            setPicks={setPicks}
            emptyText="No active user is linked to this site."
          />
        ))}
        <RecipientGroup
          prefix="internal"
          title={`Internal team · ${data.internal.length} user${data.internal.length === 1 ? "" : "s"} (all selected sites)`}
          users={data.internal}
          state={state}
          setPicks={setPicks}
          emptyText="No active Service Admin, Project Admin or Master Admin user."
        />
      </div>
      <div className="sp-small mt-1" aria-live="polite">
        <strong>{state.emails}</strong> {state.emails === 1 ? "person receives" : "people each receive"} their own email (only them in To, BCC {data.bcc}).
        {withoutEmail > 0 && ` ${withoutEmail} selected user${withoutEmail === 1 ? " has no email and gets" : "s have no email and get"} the app notification only.`}
      </div>
    </fieldset>
  );
}

function ScheduleForm({ onCreated }) {
  const sites = useApi((signal) => lookupApi.sites(signal), "sites");
  const quarters = useMemo(() => quarterOptions(), []);
  const [selected, setSelected] = useState([]);
  const [quarter, setQuarter] = useState(quarters[1].value);
  const [start, setStart] = useState(quarters[1].start);
  const [end, setEnd] = useState(quarters[1].end);
  const [notes, setNotes] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [picks, setPicks] = useState({});
  const recipients = useApi((signal) => performanceApi.pmScheduleRecipients(selected, signal), JSON.stringify(selected), { delay: 300, enabled: selected.length > 0 });
  const people = recipientState(recipients.data, picks);
  const invalid = !selected.length
    ? "Select at least one site."
    : !start || !end
      ? "Start and end date are required."
      : end < start
        ? `End date ${end} is before start date ${start}.`
        : recipients.loading
          ? "Loading recipients."
          : recipients.error
            ? "Recipients could not be loaded."
            : "";

  const pickQuarter = (value) => {
    setQuarter(value);
    const q = quarters.find((x) => x.value === value);
    if (q) {
      setStart(q.start);
      setEnd(q.end);
    }
  };

  const submit = async () => {
    setSaving(true);
    setError("");
    try {
      const data = await performanceApi.createPmSchedules({ site_ids: selected, start_date: start, end_date: end, notes, recipient_ids: people.ids });
      setResult(data);
      setSelected([]);
      setPicks({});
      setNotes("");
      toast.success(`Scheduled PM for ${data.created} site(s)`);
      onCreated();
    } catch (err) {
      setError(errorText(err));
    } finally {
      setSaving(false);
      setConfirm(false);
    }
  };

  return (
    <Panel title="Schedule preventive maintenance" subtitle="One schedule per site. Choose who is notified: users linked to each site and the internal team. Each person gets their own email." loading={sites.loading} error={sites.error} onRetry={sites.reload}>
      <SitePicker sites={sites.data || []} selected={selected} onChange={setSelected} disabled={saving} />
      {selected.length > 0 && <RecipientPicker recipients={recipients} state={people} setPicks={setPicks} disabled={saving} />}
      <CRow className="g-2 mt-1">
        <CCol md={12}>
          <CFormLabel htmlFor="sp-pm-quarter">Quarter</CFormLabel>
          <CFormSelect id="sp-pm-quarter" value={quarter} onChange={(e) => pickQuarter(e.target.value)}>
            {quarters.map((q) => (
              <option key={q.value} value={q.value}>
                {q.label}
              </option>
            ))}
            <option value="custom">Custom dates</option>
          </CFormSelect>
        </CCol>
        <CCol sm={6}>
          <CFormLabel htmlFor="sp-pm-start">Start date</CFormLabel>
          <CFormInput id="sp-pm-start" type="date" value={start} onChange={(e) => { setStart(e.target.value); setQuarter("custom"); }} />
        </CCol>
        <CCol sm={6}>
          <CFormLabel htmlFor="sp-pm-end">End date</CFormLabel>
          <CFormInput id="sp-pm-end" type="date" value={end} min={start} invalid={Boolean(start && end && end < start)} onChange={(e) => { setEnd(e.target.value); setQuarter("custom"); }} />
        </CCol>
        <CCol md={12}>
          <CFormLabel htmlFor="sp-pm-notes">Notes (optional, included in the notification and email)</CFormLabel>
          <CFormTextarea id="sp-pm-notes" rows={2} maxLength={2000} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </CCol>
      </CRow>
      {invalid && selected.length > 0 && <div className="sp-notice mt-2">{invalid}</div>}
      {error && (
        <div className="sp-notice sp-notice--red mt-2" role="alert">
          <strong>Error:</strong> {error}
        </div>
      )}
      <CButton color="success" className="mt-2" disabled={Boolean(invalid) || saving} onClick={() => setConfirm(true)}>
        Schedule PM for {selected.length} site{selected.length === 1 ? "" : "s"}
      </CButton>

      {result && (
        <div className="mt-3" aria-live="polite">
          <div className="fw-semibold mb-1">
            Created {result.created} schedule(s) for {day(result.window.start_date)} to {day(result.window.end_date)}
          </div>
          <div className="sp-small mb-1">
            {result.recipients.total} recipient(s) notified ·{" "}
            {result.recipients.total && !result.recipients.failed.length ? (
              <StatusChip status="ready" label={`${result.recipients.emails_sent} individual email(s) sent`} />
            ) : (
              <StatusChip status={result.recipients.total ? "calculation_error" : "no_record"} label={`${result.recipients.emails_sent} of ${result.recipients.total} email(s) sent`} />
            )}{" "}
            · BCC {result.bcc}
          </div>
          {result.recipients.failed.length > 0 && (
            <ul className="sp-small text-danger mb-1 ps-3">
              {result.recipients.failed.map((f) => (
                <li key={`${f.username}-${f.email}`}>Not sent to {f.username}: {f.error}</li>
              ))}
            </ul>
          )}
          <ul className="sp-small mb-0 ps-3">
            {result.sites.map((s) => (
              <li key={s.site_id}>
                {s.site_id}: {s.robots_due} robots · {s.recipients} recipient(s) · {s.emails_sent} email(s) sent
              </li>
            ))}
          </ul>
        </div>
      )}

      <ConfirmModal
        visible={confirm}
        onClose={() => setConfirm(false)}
        onConfirm={submit}
        loading={saving}
        confirmColor="success"
        confirmLabel="Schedule and notify"
        title={`Schedule PM for ${selected.length} site(s)?`}
        message={people.chosen.length ? `${start} to ${end}. ${people.chosen.length} selected user(s) get an app notification and ${people.emails} get their own email (BCC ${recipients.data?.bcc}).` : `${start} to ${end}. No recipient is selected, so no notification or email is sent.`}
      />
    </Panel>
  );
}

export default function PmSchedule() {
  const user = useSelector((state) => state.userInfo);
  const canWrite = canWriteConfig(user);
  const quarters = useMemo(() => quarterOptions(), []);
  const [from, setFrom] = useState(quarters[1].start);
  const [to, setTo] = useState(quarters[1].end);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [removing, setRemoving] = useState(null);
  const [busy, setBusy] = useState(false);
  const [q, setQ] = useState("");
  const params = { from: from || undefined, to: to || undefined, status: status || undefined, q: q.trim() || undefined, page, limit };
  const list = useApi((signal) => performanceApi.pmSchedules(params, signal), JSON.stringify(params), { delay: 250 });
  const rows = list.data?.data || [];

  const remove = async () => {
    setBusy(true);
    try {
      await performanceApi.deletePmSchedule(removing._id);
      toast.success(`Deleted PM schedule for ${removing.site_id}`);
      list.reload();
    } catch (err) {
      toast.error(errorText(err));
    } finally {
      setBusy(false);
      setRemoving(null);
    }
  };

  return (
    <Page>
      <PageHeader title="PM schedule" subtitle="Plan preventive maintenance per site and quarter. Progress is checked against the PM checklist records technicians save." />
      <CRow className="g-3">
        {canWrite && (
          <CCol xl={4}>
            <ScheduleForm onCreated={list.reload} />
          </CCol>
        )}
        <CCol xl={canWrite ? 8 : 12}>
          <div className="d-flex flex-wrap gap-3 align-items-end mb-3">
            <div>
              <CFormLabel htmlFor="sp-pm-from">Window overlaps from</CFormLabel>
              <CFormInput id="sp-pm-from" type="date" value={from} onChange={(e) => { setFrom(e.target.value); setPage(1); }} />
            </div>
            <div>
              <CFormLabel htmlFor="sp-pm-to">to</CFormLabel>
              <CFormInput id="sp-pm-to" type="date" value={to} onChange={(e) => { setTo(e.target.value); setPage(1); }} />
            </div>
            <div>
              <CFormLabel htmlFor="sp-pm-status">Status</CFormLabel>
              <CFormSelect id="sp-pm-status" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
                <option value="">All</option>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.replace(/_/g, " ")}
                  </option>
                ))}
              </CFormSelect>
            </div>
          </div>

          <div className="mb-3">
            <Panel title="Progress" loading={list.loading} error={list.error} onRetry={list.reload}>
              <PmSummary plan={list.data?.summary} />
            </Panel>
          </div>

          <Panel title="Scheduled sites" loading={list.loading} error={list.error} onRetry={list.reload} empty={!rows.length && !q.trim()} emptyText={status ? `No schedule with status "${status.replace(/_/g, " ")}" in this window.` : "No PM schedule overlaps this window."}>
            <TableSearch value={q} onChange={(value) => { setQ(value); setPage(1); }} placeholder="Search site" label="Search scheduled sites" />
            {q.trim() && !rows.length ? (
              <div className="sp-muted sp-small py-2">No schedule matches "{q.trim()}".</div>
            ) : (
            <>
            <div className="sp-table-wrap">
              <table className="table sp-table mb-2">
                <thead>
                  <tr>
                    <th scope="col">Site</th>
                    <th scope="col">Window</th>
                    <th scope="col">Robots done</th>
                    <th scope="col">Status</th>
                    <th scope="col">Completed</th>
                    <th scope="col">Notified</th>
                    <th scope="col">Scheduled by</th>
                    {canWrite && <th scope="col"><span className="visually-hidden">Actions</span></th>}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => {
                    const share = row.robots_due ? (row.robots_done / row.robots_due) * 100 : 0;
                    return (
                      <tr key={row._id}>
                        <td className="fw-semibold">{row.site_id}</td>
                        <td>
                          {day(row.start_date)} to {day(row.end_date)}
                          {row.notes && <div className="sp-small sp-muted">{row.notes}</div>}
                        </td>
                        <td style={{ minWidth: 180 }}>
                          <div className="d-flex align-items-center gap-2">
                            <div className="sp-bar" role="img" aria-label={`${row.robots_done} of ${row.robots_due} robots done`}>
                              <div className={`sp-bar-fill${row.status === "overdue" ? " sp-bar-fill--red" : row.status === "pending" ? " sp-bar-fill--amber" : ""}`} style={{ width: `${share}%` }} />
                            </div>
                            <span>
                              {row.robots_done}/{row.robots_due}
                            </span>
                          </div>
                          {row.pending_robots.length > 0 && (
                            <div className="sp-small sp-muted" title={row.pending_robots.join(", ")}>
                              Due: {row.pending_robots.slice(0, 6).join(", ")}
                              {row.pending_robots.length > 6 ? ` +${row.pending_robots.length - 6} more` : ""}
                            </div>
                          )}
                        </td>
                        <td>
                          <StatusChip status={row.status} />
                        </td>
                        <td>{row.completed_at ? <>{dateTime(row.completed_at)}<div className="sp-small sp-muted">{(row.completion_days ?? 0).toFixed(1)} d after start</div></> : <span className="sp-muted">—</span>}</td>
                        <td className="sp-small">
                          {row.notified?.at ? (
                            <>
                              {row.notified.recipient_count ?? row.notified.technician_count + row.notified.internal_count} recipient(s)
                              <div className={row.notified.email_sent ? "sp-muted" : "text-danger"}>
                                {row.notified.emails_sent != null ? `${row.notified.emails_sent} email(s) sent` : row.notified.email_sent ? "Email sent" : "Email not sent"}
                                {!row.notified.email_sent && row.notified.email_error ? `: ${row.notified.email_error}` : ""}
                              </div>
                            </>
                          ) : (
                            <span className="sp-muted">Not notified</span>
                          )}
                        </td>
                        <td className="sp-small">{row.created_by?.name || "—"}</td>
                        {canWrite && (
                          <td>
                            <CButton size="sm" color="danger" variant="outline" onClick={() => setRemoving(row)} aria-label={`Delete PM schedule for ${row.site_id}`}>
                              Delete
                            </CButton>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {list.data && <Pager page={page} limit={limit} total={list.data.total} onPage={setPage} onLimit={(value) => { setLimit(value); setPage(1); }} label="PM schedules" />}
            </>
            )}
          </Panel>
        </CCol>
      </CRow>
      <ConfirmModal
        visible={Boolean(removing)}
        onClose={() => setRemoving(null)}
        onConfirm={remove}
        loading={busy}
        confirmLabel="Delete"
        title={`Delete PM schedule for ${removing?.site_id}?`}
        message={removing ? `${day(removing.start_date)} to ${day(removing.end_date)}. PM checklist records are not touched. No notification is sent for the deletion.` : ""}
      />
    </Page>
  );
}
