import React from "react";
import { CCard, CCardBody, CCol } from "@coreui/react";
import { ResponsiveContainer } from "recharts";

export const COLORS = {
  score: "#0ea5e9",
  uptime: "#10b981",
  created: "#6366f1",
  resolved: "#14b8a6",
  breach: "#ef4444",
  muted: "#94a3b8",
  amber: "#f59e0b",
};

export const KPI_LABELS = {
  service_ticket_sla: "Service SLA",
  client_ticket_sla: "Client SLA",
  cleaning_uptime: "Uptime",
  pm_completed: "PM records",
  material_request_on_time: "Materials",
  consumption_compliance: "Consumption",
};

export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function shortMonth(label) {
  const month = Number(String(label || "").split("-")[1]);
  return MONTHS[month - 1] || label;
}

export function fmt(value, digits = 1) {
  if (value == null || Number.isNaN(Number(value))) return "—";
  return Number(value).toFixed(digits);
}

export const tipStyle = {
  background: "#0f172a",
  border: "none",
  borderRadius: 8,
  color: "#fff",
  fontSize: 12,
};

export function ChartCard({ title, hint, children }) {
  return (
    <CCard className="mb-3 h-100 shadow-sm">
      <CCardBody>
        <div className="fw-semibold">{title}</div>
        {hint && <div className="text-medium-emphasis small mb-2">{hint}</div>}
        {children}
      </CCardBody>
    </CCard>
  );
}

export function ChartBox({ empty, height = 260, children }) {
  if (empty) {
    return (
      <div
        className="d-flex align-items-center justify-content-center text-medium-emphasis small"
        style={{ height }}
      >
        No calculated values for this period.
      </div>
    );
  }
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>{children}</ResponsiveContainer>
    </div>
  );
}

export function Stat({ label, value, hint, tone = COLORS.score }) {
  return (
    <CCol md={3} sm={6}>
      <CCard className="mb-3 shadow-sm" style={{ borderLeft: `4px solid ${tone}` }}>
        <CCardBody className="py-3">
          <div className="text-medium-emphasis small">{label}</div>
          <div className="fs-3 fw-semibold lh-sm">{value}</div>
          {hint && <div className="small text-medium-emphasis">{hint}</div>}
        </CCardBody>
      </CCard>
    </CCol>
  );
}

export function kpiRowsFrom(score) {
  return (score?.kpis || [])
    .filter((kpi) => kpi.score != null && kpi.status !== "disabled")
    .map((kpi) => ({
      name: KPI_LABELS[kpi.key] || kpi.key,
      score: Number(Number(kpi.score).toFixed(1)),
      weight: kpi.weight,
    }));
}

export function slaSlices(sla = {}) {
  return [
    { name: "Within SLA", value: sla.met || 0, fill: COLORS.uptime },
    { name: "Breached", value: sla.breached || 0, fill: COLORS.breach },
    { name: "No target", value: sla.target_missing || 0, fill: COLORS.muted },
  ].filter((slice) => slice.value > 0);
}

export function ScoreRing({ score }) {
  const known = score != null && !Number.isNaN(Number(score));
  const value = known ? Math.max(0, Math.min(100, Number(score))) : 0;
  const color = !known ? COLORS.muted : value >= 80 ? COLORS.uptime : value >= 60 ? COLORS.amber : COLORS.breach;
  return (
    <div
      style={{
        width: 132,
        height: 132,
        borderRadius: "50%",
        background: `conic-gradient(${color} ${value * 3.6}deg, #e5e7eb 0deg)`,
        display: "grid",
        placeItems: "center",
      }}
    >
      <div
        className="bg-white d-flex flex-column align-items-center justify-content-center"
        style={{ width: 96, height: 96, borderRadius: "50%" }}
      >
        <div className="fs-4 fw-semibold lh-1">{known ? value.toFixed(1) : "—"}</div>
        <div className="small text-medium-emphasis">score</div>
      </div>
    </div>
  );
}
