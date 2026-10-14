import React from "react";
import { Link } from "react-router-dom";
import { CCol, CRow } from "@coreui/react";
import MetricTile from "./MetricTile";
import { COLORS } from "./Page";
import { count, duration, pct } from "../utils/format";

export function RateRing({ value, label }) {
  const known = value != null;
  const r = 40;
  const c = 2 * Math.PI * r;
  const color = !known ? COLORS.none : value >= 90 ? COLORS.green : value >= 60 ? COLORS.amber : COLORS.red;
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" role="img" aria-label={label}>
      <circle cx="48" cy="48" r={r} fill="none" stroke={COLORS.track} strokeWidth="10" />
      {known && (
        <circle cx="48" cy="48" r={r} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" strokeDasharray={`${(Math.min(100, value) / 100) * c} ${c}`} transform="rotate(-90 48 48)" />
      )}
      <text x="50%" y="54%" textAnchor="middle" fontSize="18" fontWeight="600" fill={known ? COLORS.text : COLORS.muted}>
        {known ? `${Math.round(value)}%` : "—"}
      </text>
    </svg>
  );
}

/**
 * plan: preventive_maintenance.schedule (or the /pm-schedules summary).
 * records: checklist records in the period, shown as context only.
 */
export default function PmSummary({ plan, records, scheduleLink }) {
  if (!plan || !plan.scheduled) {
    const why = "No PM schedule for this period";
    return (
      <>
        <div className="d-flex gap-3 align-items-center mb-3">
          <RateRing value={null} label="Completion rate not available: no PM schedule for this period" />
          <div className="sp-small">
            <div className="fw-semibold">Completion rate n/a</div>
            <div className="sp-muted">
              No site has a PM schedule overlapping this period.{" "}
              {scheduleLink && <Link to={scheduleLink}>Create a PM schedule</Link>}
            </div>
          </div>
        </div>
        <CRow className="g-2">
          <CCol xs={6} md={4}><MetricTile label="Scheduled" na={why} tone="blue" /></CCol>
          <CCol xs={6} md={4}><MetricTile label="Completed" na={why} tone="green" /></CCol>
          <CCol xs={6} md={4}><MetricTile label="On time" na={why} tone="cyan" /></CCol>
          <CCol xs={6} md={4}><MetricTile label="Pending" na={why} tone="amber" /></CCol>
          <CCol xs={6} md={4}><MetricTile label="Overdue" na={why} tone="red" /></CCol>
          <CCol xs={6} md={4}><MetricTile label="Avg completion time" na={why} tone="violet" /></CCol>
        </CRow>
        {records != null && <div className="sp-small sp-muted mt-2">{count(records)} PM checklist records were saved in this period.</div>}
      </>
    );
  }
  return (
    <>
      <div className="d-flex gap-3 align-items-center mb-3">
        <RateRing value={plan.completion_rate} label={`Completion rate ${pct(plan.completion_rate)}: ${plan.completed} of ${plan.scheduled} scheduled sites completed`} />
        <div className="sp-small">
          <div className="fw-semibold">
            {plan.completed} of {plan.scheduled} scheduled sites completed
          </div>
          <div className="sp-muted">
            {count(plan.robots_done)} of {count(plan.robots_due)} robots have a PM checklist in their window.
          </div>
        </div>
      </div>
      <CRow className="g-2">
        <CCol xs={6} md={4}><MetricTile label="Scheduled" value={count(plan.scheduled)} hint={`${count(plan.robots_due)} robots due`} tone="blue" /></CCol>
        <CCol xs={6} md={4}><MetricTile label="Completed" value={count(plan.completed)} hint={`${count(plan.completed_late)} of them late`} tone="green" /></CCol>
        <CCol xs={6} md={4}><MetricTile label="On time" value={count(plan.on_time)} hint={plan.on_time_rate == null ? "No schedule has ended yet" : `${pct(plan.on_time_rate)} of ended or completed`} tone="cyan" /></CCol>
        <CCol xs={6} md={4}><MetricTile label="Pending" value={count(plan.pending + plan.upcoming)} hint={plan.upcoming ? `${plan.upcoming} not started yet` : "Window open, not all robots done"} tone="amber" /></CCol>
        <CCol xs={6} md={4}><MetricTile label="Overdue" value={count(plan.overdue)} hint="End date passed, robots still missing PM" tone="red" /></CCol>
        <CCol xs={6} md={4}><MetricTile label="Avg completion time" value={duration(plan.avg_completion_days)} hint="Start date to last robot's PM" na={plan.avg_completion_days == null ? "No schedule completed yet" : undefined} tone="violet" /></CCol>
      </CRow>
      {plan.without_robots > 0 && <div className="sp-notice mt-2">{plan.without_robots} scheduled site(s) have no robots registered and are not counted.</div>}
      <div className="sp-small sp-muted mt-2">
        A site is complete when every robot at the site has a PM checklist dated between the schedule's start and end date.
        {scheduleLink && <> <Link to={scheduleLink}>Open PM schedule</Link></>}
      </div>
    </>
  );
}
