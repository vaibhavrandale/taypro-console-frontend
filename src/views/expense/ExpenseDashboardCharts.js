import React, { useMemo } from "react";
import { CChartBar, CChartDoughnut } from "@coreui/react-chartjs";
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
} from "@coreui/react";

const COLORS = {
  approved: "#34d399",
  pending: "#fbbf24",
  rejected: "#f87171",
  draft: "#38bdf8",
  amount: "#60a5fa",
  tick: "#94a3b8",
  grid: "rgba(148, 163, 184, 0.18)",
  legend: "#e2e8f0",
};

const fmtSite = (id = "") =>
  String(id || "Unknown")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const fmtMoney = (n) => {
  const v = Number(n) || 0;
  if (v >= 100000) return `₹${(v / 100000).toFixed(1)}L`;
  if (v >= 1000) return `₹${(v / 1000).toFixed(1)}k`;
  return `₹${Math.round(v).toLocaleString("en-IN")}`;
};

const claimAmount = (claim) =>
  Number(
    claim.grand_total ??
      claim.total_claimed_amount ??
      claim.total_sanctioned_amount ??
      0,
  ) || 0;

const claimStatus = (claim) => {
  const raw = String(
    claim.console_status ?? claim.status ?? claim.workflow_state ?? "Draft",
  ).toLowerCase();
  if (raw.includes("reject") || raw.includes("cancel")) return "rejected";
  if (raw.includes("approved") || raw === "paid" || raw === "true")
    return "approved";
  if (!raw || raw === "draft" || raw === "false") return "draft";
  return "pending";
};

const claimSite = (claim) => claim.department || "Unknown";

/** Normalize API `/dashboard-stats` payload (or legacy claims list). */
export function normalizeExpenseStats(payload) {
  if (!payload) {
    return {
      summary: {
        totalClaims: 0,
        approved: 0,
        pending: 0,
        rejected: 0,
        draft: 0,
        totalAmount: 0,
        approvedAmount: 0,
        pendingAmount: 0,
        rejectedAmount: 0,
      },
      bySite: [],
      byType: [],
    };
  }

  // New API shape
  if (payload.summary || payload.by_site || payload.by_type) {
    const s = payload.summary || {};
    return {
      summary: {
        totalClaims: s.totalClaims || 0,
        approved: s.approved || 0,
        pending: s.pending || 0,
        rejected: s.rejected || 0,
        draft: s.draft || 0,
        totalAmount: s.totalAmount || 0,
        approvedAmount: s.approvedAmount || 0,
        pendingAmount: s.pendingAmount || 0,
        rejectedAmount: s.rejectedAmount || 0,
      },
      bySite: Array.isArray(payload.by_site) ? payload.by_site : [],
      byType: Array.isArray(payload.by_type) ? payload.by_type : [],
    };
  }

  // Legacy: array of claims
  if (Array.isArray(payload)) {
    return buildExpenseChartStats(payload);
  }

  return normalizeExpenseStats(null);
}

export function buildExpenseChartStats(claims = []) {
  const summary = {
    totalClaims: claims.length,
    approved: 0,
    pending: 0,
    rejected: 0,
    draft: 0,
    totalAmount: 0,
    approvedAmount: 0,
    pendingAmount: 0,
    rejectedAmount: 0,
  };

  const bySite = new Map();
  const byType = new Map();

  for (const claim of claims) {
    const amount = claimAmount(claim);
    const status = claimStatus(claim);
    summary.totalAmount += amount;
    summary[status] += 1;
    if (status === "approved") summary.approvedAmount += amount;
    else if (status === "pending" || status === "draft")
      summary.pendingAmount += amount;
    else if (status === "rejected") summary.rejectedAmount += amount;

    const site = claimSite(claim);
    const siteRow = bySite.get(site) || {
      site,
      claims: 0,
      amount: 0,
      approved: 0,
      pending: 0,
      rejected: 0,
      draft: 0,
    };
    siteRow.claims += 1;
    siteRow.amount += amount;
    siteRow[status] += 1;
    bySite.set(site, siteRow);

    for (const line of claim.expenses || []) {
      const type = (line.expense_type || "Other").trim() || "Other";
      const lineAmt = Number(line.amount ?? line.sanctioned_amount ?? 0) || 0;
      const typeRow = byType.get(type) || { type, count: 0, amount: 0 };
      typeRow.count += 1;
      typeRow.amount += lineAmt;
      byType.set(type, typeRow);
    }
  }

  return {
    summary,
    bySite: [...bySite.values()].sort((a, b) => b.amount - a.amount),
    byType: [...byType.values()].sort((a, b) => b.amount - a.amount),
  };
}

const KpiCard = ({ label, value, sub, color }) => (
  <CCard className="h-100 shadow-sm border-0">
    <CCardBody className="py-3">
      <div className="text-medium-emphasis small text-uppercase mb-1">
        {label}
      </div>
      <div className="fs-3 fw-semibold" style={{ color }}>
        {value}
      </div>
      {sub ? <div className="small text-medium-emphasis mt-1">{sub}</div> : null}
    </CCardBody>
  </CCard>
);

const ChartBox = ({ height = 300, children }) => (
  <div
    className="d-flex justify-content-center align-items-center w-100"
    style={{ height, minHeight: height }}
  >
    <div style={{ width: "100%", height: "100%" }}>{children}</div>
  </div>
);

const chartOpts = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: "bottom",
      labels: { color: COLORS.legend, boxWidth: 12, padding: 14 },
    },
  },
  scales: {
    x: {
      ticks: {
        color: COLORS.tick,
        maxRotation: 40,
        minRotation: 0,
        font: { size: 10 },
      },
      grid: { display: false },
    },
    y: {
      beginAtZero: true,
      ticks: { color: COLORS.tick, precision: 0 },
      grid: { color: COLORS.grid },
    },
  },
};

/**
 * Graphs for Expense Claims dashboard.
 * Prefer `stats` from GET /api/v1/expenseclaims/dashboard-stats.
 */
export default function ExpenseDashboardCharts({ stats: statsProp, loading }) {
  const stats = useMemo(() => normalizeExpenseStats(statsProp), [statsProp]);
  const { summary, bySite, byType } = stats;
  const topSites = bySite.slice(0, 10);

  if (loading && !statsProp) {
    return (
      <div className="text-center text-medium-emphasis py-3 mb-3">
        Loading expense graphs…
      </div>
    );
  }

  if (!summary.totalClaims) return null;

  return (
    <div className="mb-4">
      <CRow className="g-3 mb-3">
        <CCol xs={6} md={3}>
          <KpiCard
            label="Total claims"
            value={summary.totalClaims}
            sub={fmtMoney(summary.totalAmount)}
            color={COLORS.amount}
          />
        </CCol>
        <CCol xs={6} md={3}>
          <KpiCard
            label="Approved"
            value={summary.approved}
            sub={fmtMoney(summary.approvedAmount)}
            color={COLORS.approved}
          />
        </CCol>
        <CCol xs={6} md={3}>
          <KpiCard
            label="Pending / Draft"
            value={summary.pending + summary.draft}
            sub={fmtMoney(summary.pendingAmount)}
            color={COLORS.pending}
          />
        </CCol>
        <CCol xs={6} md={3}>
          <KpiCard
            label="Rejected"
            value={summary.rejected}
            sub={fmtMoney(summary.rejectedAmount)}
            color={COLORS.rejected}
          />
        </CCol>
      </CRow>

      <CRow className="g-3 mb-3">
        <CCol xs={12} lg={5}>
          <CCard className="h-100 shadow-sm">
            <CCardHeader>
              <h6 className="mb-0">Claims by status</h6>
            </CCardHeader>
            <CCardBody>
              <ChartBox height={280}>
                <CChartDoughnut
                  style={{ height: "100%", width: "100%" }}
                  data={{
                    labels: ["Approved", "Pending", "Draft", "Rejected"],
                    datasets: [
                      {
                        data: [
                          summary.approved,
                          summary.pending,
                          summary.draft,
                          summary.rejected,
                        ],
                        backgroundColor: [
                          COLORS.approved,
                          COLORS.pending,
                          COLORS.draft,
                          COLORS.rejected,
                        ],
                        borderWidth: 0,
                      },
                    ],
                  }}
                  options={{
                    maintainAspectRatio: false,
                    responsive: true,
                    plugins: {
                      legend: {
                        position: "bottom",
                        labels: { color: COLORS.legend, boxWidth: 12 },
                      },
                    },
                  }}
                />
              </ChartBox>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol xs={12} lg={7}>
          <CCard className="h-100 shadow-sm">
            <CCardHeader>
              <h6 className="mb-0">Amount by status (₹)</h6>
            </CCardHeader>
            <CCardBody>
              <ChartBox>
                <CChartBar
                  style={{ height: "100%", width: "100%" }}
                  data={{
                    labels: ["Approved", "Pending / Draft", "Rejected"],
                    datasets: [
                      {
                        label: "Amount",
                        backgroundColor: [
                          COLORS.approved,
                          COLORS.pending,
                          COLORS.rejected,
                        ],
                        data: [
                          Math.round(summary.approvedAmount),
                          Math.round(summary.pendingAmount),
                          Math.round(summary.rejectedAmount),
                        ],
                      },
                    ],
                  }}
                  options={{
                    ...chartOpts,
                    plugins: {
                      ...chartOpts.plugins,
                      legend: { display: false },
                    },
                  }}
                />
              </ChartBox>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow className="g-3 mb-3">
        <CCol xs={12} lg={7}>
          <CCard className="h-100 shadow-sm">
            <CCardHeader>
              <h6 className="mb-0">
                By department (approved vs pending)
              </h6>
            </CCardHeader>
            <CCardBody>
              {topSites.length === 0 ? (
                <div className="text-center text-medium-emphasis py-5">
                  No site data
                </div>
              ) : (
                <ChartBox height={340}>
                  <CChartBar
                    style={{ height: "100%", width: "100%" }}
                    data={{
                      labels: topSites.map((s) => fmtSite(s.site)),
                      datasets: [
                        {
                          label: "Approved",
                          backgroundColor: COLORS.approved,
                          data: topSites.map((s) => s.approved),
                        },
                        {
                          label: "Pending / Draft",
                          backgroundColor: COLORS.pending,
                          data: topSites.map((s) => s.pending + s.draft),
                        },
                        {
                          label: "Rejected",
                          backgroundColor: COLORS.rejected,
                          data: topSites.map((s) => s.rejected),
                        },
                      ],
                    }}
                    options={{
                      ...chartOpts,
                      plugins: {
                        ...chartOpts.plugins,
                        tooltip: {
                          callbacks: {
                            afterBody: (items) => {
                              const i = items[0]?.dataIndex;
                              if (i == null) return "";
                              const s = topSites[i];
                              return `Spent: ${fmtMoney(s.amount)} · Claims: ${s.claims}`;
                            },
                          },
                        },
                      },
                    }}
                  />
                </ChartBox>
              )}
            </CCardBody>
          </CCard>
        </CCol>

        <CCol xs={12} lg={5}>
          <CCard className="h-100 shadow-sm">
            <CCardHeader>
              <h6 className="mb-0">Spend by expense type</h6>
            </CCardHeader>
            <CCardBody>
              {byType.length === 0 ? (
                <div className="text-center text-medium-emphasis py-5">
                  No type data
                </div>
              ) : (
                <ChartBox>
                  <CChartBar
                    style={{ height: "100%", width: "100%" }}
                    data={{
                      labels: byType.slice(0, 8).map((t) => t.type),
                      datasets: [
                        {
                          label: "Amount (₹)",
                          backgroundColor: COLORS.amount,
                          data: byType
                            .slice(0, 8)
                            .map((t) => Math.round(t.amount)),
                        },
                      ],
                    }}
                    options={{
                      ...chartOpts,
                      plugins: {
                        ...chartOpts.plugins,
                        legend: { display: false },
                      },
                    }}
                  />
                </ChartBox>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CCard className="shadow-sm">
        <CCardHeader>
          <h6 className="mb-0">Department summary</h6>
        </CCardHeader>
        <CCardBody className="p-0">
          <CTable hover responsive className="mb-0 align-middle">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Department</CTableHeaderCell>
                <CTableHeaderCell>Claims</CTableHeaderCell>
                <CTableHeaderCell>Spent</CTableHeaderCell>
                <CTableHeaderCell>Approved</CTableHeaderCell>
                <CTableHeaderCell>Pending</CTableHeaderCell>
                <CTableHeaderCell>Rejected</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {topSites.map((s) => (
                <CTableRow key={s.site}>
                  <CTableDataCell>{fmtSite(s.site)}</CTableDataCell>
                  <CTableDataCell>{s.claims}</CTableDataCell>
                  <CTableDataCell>{fmtMoney(s.amount)}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color="success">{s.approved}</CBadge>
                  </CTableDataCell>
                  <CTableDataCell>
                    <CBadge color="warning">{s.pending + s.draft}</CBadge>
                  </CTableDataCell>
                  <CTableDataCell>
                    <CBadge color="danger">{s.rejected}</CBadge>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </div>
  );
}
