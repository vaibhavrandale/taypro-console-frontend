import React from "react";
import { CCol, CFormInput, CFormLabel, CFormSelect, CRow } from "@coreui/react";
import SearchSelect from "./SearchSelect";
import { MONTHS } from "../utils/format";
import { CLIENT_STATUSES, currentIstMonth } from "../utils/filters";

function Field({ id, label, children, md = 2 }) {
  return (
    <CCol md={md} sm={6} xs={12}>
      <CFormLabel htmlFor={id} className="sp-small sp-muted mb-1">
        {label}
      </CFormLabel>
      {children}
    </CCol>
  );
}

/**
 * Global filters. Values come from and go to the URL (useFilters); the data
 * hooks debounce the requests. Priority and PM status are shown disabled
 * because tickets and PM records do not store them.
 */
export default function FilterBar({ filters, setFilters, sites = [], faults = [], engineers = null, showClient = true, showPm = false, notice = "" }) {
  const setPeriodMode = (mode) => {
    if (mode === "range") {
      const today = new Date().toISOString().slice(0, 10);
      setFilters({ mode, from: `${today.slice(0, 8)}01`, to: today });
    } else setFilters({ mode, ...currentIstMonth() });
  };

  return (
    <section className="sp-card mb-3" aria-label="Filters">
      <CRow className="g-2 align-items-end">
        <Field id="sp-period" label="Period">
          <CFormSelect id="sp-period" value={filters.mode} onChange={(e) => setPeriodMode(e.target.value)}>
            <option value="month">Month</option>
            <option value="range">Date range</option>
          </CFormSelect>
        </Field>
        {filters.mode === "month" ? (
          <>
            <Field id="sp-month" label="Month" md={1}>
              <CFormSelect id="sp-month" value={filters.month} onChange={(e) => setFilters({ month: Number(e.target.value) })}>
                {MONTHS.map((name, i) => (
                  <option key={name} value={i + 1}>
                    {name}
                  </option>
                ))}
              </CFormSelect>
            </Field>
            <Field id="sp-year" label="Year" md={1}>
              <CFormInput id="sp-year" type="number" min={2000} max={2100} value={filters.year} onChange={(e) => setFilters({ year: Number(e.target.value) })} />
            </Field>
          </>
        ) : (
          <>
            <Field id="sp-from" label="From">
              <CFormInput id="sp-from" type="date" value={filters.from} onChange={(e) => setFilters({ from: e.target.value })} />
            </Field>
            <Field id="sp-to" label="To">
              <CFormInput id="sp-to" type="date" value={filters.to} onChange={(e) => setFilters({ to: e.target.value })} />
            </Field>
          </>
        )}
        <Field id="sp-site" label="Site" md={3}>
          <SearchSelect
            id="sp-site"
            ariaLabel="Site"
            value={filters.site_id}
            onChange={(site_id) => setFilters({ site_id })}
            placeholder={engineers ? (filters.engineer_id ? "Search this engineer's sites" : "Search sites") : "Search my sites"}
            options={sites.map((id) => ({ value: id, label: id }))}
          />
        </Field>
        {engineers && (
          <Field id="sp-engineer" label="Engineer">
            <CFormSelect id="sp-engineer" value={filters.engineer_id} onChange={(e) => setFilters({ engineer_id: e.target.value })}>
              <option value="">All engineers</option>
              {engineers.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.username || user.email}
                </option>
              ))}
            </CFormSelect>
          </Field>
        )}
        <Field id="sp-fault" label="Ticket category">
          <CFormSelect id="sp-fault" value={filters.fault_type} onChange={(e) => setFilters({ fault_type: e.target.value })}>
            <option value="">All categories</option>
            {faults.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </CFormSelect>
        </Field>
        <Field id="sp-status" label="Service status">
          <CFormSelect id="sp-status" value={filters.status} onChange={(e) => setFilters({ status: e.target.value })}>
            <option value="">Any</option>
            <option value="open">Open</option>
            <option value="resolved">Resolved</option>
          </CFormSelect>
        </Field>
        {showClient && (
          <Field id="sp-client-status" label="Client status">
            <CFormSelect id="sp-client-status" value={filters.client_status} onChange={(e) => setFilters({ client_status: e.target.value })}>
              <option value="">Any</option>
              {CLIENT_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </CFormSelect>
          </Field>
        )}
        <Field id="sp-priority" label="Priority">
          <CFormSelect id="sp-priority" disabled aria-describedby="sp-priority-note">
            <option>Not recorded</option>
          </CFormSelect>
        </Field>
        {showPm && (
          <Field id="sp-pm" label="PM status">
            <CFormSelect id="sp-pm" disabled aria-describedby="sp-priority-note">
              <option>Completed only</option>
            </CFormSelect>
          </Field>
        )}
      </CRow>
      <div id="sp-priority-note" className="sp-small sp-muted mt-2">
        Priority is not stored on tickets{showPm ? ", and PM has no schedule, so only completed records exist" : ""}. Those filters stay off. Times are Asia/Kolkata.
      </div>
      {notice && (
        <div className="sp-notice mt-2" role="status">
          {notice}
        </div>
      )}
      {filters.errors?.length > 0 && (
        <div className="sp-notice sp-notice--red mt-2" role="alert">
          {filters.errors.join(" ")} The current month is shown instead.
        </div>
      )}
    </section>
  );
}
