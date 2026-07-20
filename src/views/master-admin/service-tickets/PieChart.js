import React, { useEffect, useReducer } from "react";
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
import axios from "axios";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../../components/LoadingSpinner";

const COLORS = {
  raised: "#38bdf8",
  resolved: "#34d399",
  pending: "#fbbf24",
  danger: "#f87171",
  accent: "#60a5fa",
  tick: "#94a3b8",
  grid: "rgba(148, 163, 184, 0.18)",
  legend: "#e2e8f0",
  aging: ["#34d399", "#a3e635", "#fbbf24", "#fb923c", "#f87171"],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, data: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const fmtSite = (id = "") =>
  id.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

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

const ChartBox = ({ height = 320, maxWidth, children }) => (
  <div
    className="d-flex justify-content-center align-items-center w-100"
    style={{ height, minHeight: height }}
  >
    <div style={{ width: "100%", height: "100%", maxWidth: maxWidth || "100%" }}>
      {children}
    </div>
  </div>
);

const baseScales = {
  x: {
    ticks: { color: COLORS.tick, maxRotation: 45, minRotation: 0, font: { size: 10 } },
    grid: { display: false, color: COLORS.grid },
  },
  y: {
    beginAtZero: true,
    ticks: { color: COLORS.tick, precision: 0 },
    grid: { color: COLORS.grid },
  },
};

const chartOpts = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: "bottom",
      labels: { color: COLORS.legend, boxWidth: 12, padding: 16 },
    },
  },
  scales: baseScales,
};

const PieChart = () => {
  const [{ loading, error, data }, dispatch] = useReducer(reducer, {
    data: null,
    loading: true,
    error: "",
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const res = await axios.get("/api/v1/servicetickets/dashboard-stats", {
          withCredentials: true,
        });
        dispatch({ type: "FETCH_SUCCESS", payload: res.data.data });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload:
            err.response?.data?.message ||
            err.response?.data?.error ||
            "Failed to load dashboard stats",
        });
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-4">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-danger py-3">{error}</div>;
  }

  const summary = data?.summary || {
    raised: 0,
    resolved: 0,
    pending: 0,
    avg_pending_days: 0,
  };
  const bySite = (data?.by_site || []).slice(0, 12);
  const faults = data?.recurring_faults || [];
  const aging = data?.pending_aging || [];
  const oldest = data?.oldest_pending || [];

  const resolveRate =
    summary.raised > 0
      ? Math.round((summary.resolved / summary.raised) * 100)
      : 0;

  return (
    <div className="mb-3">
      <CRow className="g-3 mb-3">
        <CCol xs={6} md={3}>
          <KpiCard
            label="Raised"
            value={summary.raised}
            sub="All service tickets"
            color={COLORS.raised}
          />
        </CCol>
        <CCol xs={6} md={3}>
          <KpiCard
            label="Resolved"
            value={summary.resolved}
            sub={`${resolveRate}% resolve rate`}
            color={COLORS.resolved}
          />
        </CCol>
        <CCol xs={6} md={3}>
          <KpiCard
            label="Pending"
            value={summary.pending}
            sub="Still open"
            color={COLORS.pending}
          />
        </CCol>
        <CCol xs={6} md={3}>
          <KpiCard
            label="Avg Pending Age"
            value={`${summary.avg_pending_days}d`}
            sub="Open tickets average"
            color={COLORS.danger}
          />
        </CCol>
      </CRow>

      <CRow className="g-3 mb-3">
        <CCol xs={12} lg={7}>
          <CCard className="h-100 shadow-sm">
            <CCardHeader>
              <h6 className="mb-0">Tickets by Site (Open vs Resolved)</h6>
            </CCardHeader>
            <CCardBody>
              {bySite.length === 0 ? (
                <div className="text-center text-muted py-5">No data</div>
              ) : (
                <ChartBox>
                  <CChartBar
                    style={{ height: "100%", width: "100%" }}
                    data={{
                      labels: bySite.map((s) => fmtSite(s.site_id)),
                      datasets: [
                        {
                          label: "Pending",
                          backgroundColor: COLORS.pending,
                          data: bySite.map((s) => s.pending),
                        },
                        {
                          label: "Resolved",
                          backgroundColor: COLORS.resolved,
                          data: bySite.map((s) => s.resolved),
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
                              const s = bySite[i];
                              return `Avg pending: ${s.avg_pending_days}d · Raised: ${s.raised}`;
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
              <h6 className="mb-0">Status Split</h6>
            </CCardHeader>
            <CCardBody>
              <ChartBox maxWidth={280}>
                <CChartDoughnut
                  style={{ height: "100%", width: "100%" }}
                  data={{
                    labels: ["Resolved", "Pending"],
                    datasets: [
                      {
                        data: [summary.resolved, summary.pending],
                        backgroundColor: [COLORS.resolved, COLORS.pending],
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
      </CRow>

      <CRow className="g-3 mb-3">
        <CCol xs={12} lg={6}>
          <CCard className="h-100 shadow-sm">
            <CCardHeader>
              <h6 className="mb-0">Faults Raised Again & Again (Top 10)</h6>
            </CCardHeader>
            <CCardBody>
              {faults.length === 0 ? (
                <div className="text-center text-muted py-5">No data</div>
              ) : (
                <ChartBox height={300}>
                  <CChartBar
                    style={{ height: "100%", width: "100%" }}
                    data={{
                      labels: faults.map((f) => f.fault_type),
                      datasets: [
                        {
                          label: "Times raised",
                          backgroundColor: COLORS.accent,
                          data: faults.map((f) => f.count),
                        },
                      ],
                    }}
                    options={{
                      ...chartOpts,
                      indexAxis: "y",
                      plugins: { legend: { display: false } },
                      scales: {
                        x: {
                          beginAtZero: true,
                          ticks: { color: COLORS.tick, precision: 0 },
                          grid: { color: COLORS.grid },
                        },
                        y: {
                          ticks: { color: COLORS.tick, font: { size: 10 } },
                          grid: { display: false },
                        },
                      },
                    }}
                  />
                </ChartBox>
              )}
            </CCardBody>
          </CCard>
        </CCol>

        <CCol xs={12} lg={6}>
          <CCard className="h-100 shadow-sm">
            <CCardHeader>
              <h6 className="mb-0">Pending Tickets by Age</h6>
            </CCardHeader>
            <CCardBody>
              {aging.every((a) => a.count === 0) ? (
                <div className="text-center text-muted py-5">
                  No pending tickets
                </div>
              ) : (
                <ChartBox height={300}>
                  <CChartBar
                    style={{ height: "100%", width: "100%" }}
                    data={{
                      labels: aging.map((a) => a.label),
                      datasets: [
                        {
                          label: "Pending",
                          backgroundColor: COLORS.aging,
                          data: aging.map((a) => a.count),
                        },
                      ],
                    }}
                    options={{
                      ...chartOpts,
                      plugins: { legend: { display: false } },
                    }}
                  />
                </ChartBox>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow className="g-3">
        <CCol xs={12} lg={7}>
          <CCard className="shadow-sm">
            <CCardHeader>
              <h6 className="mb-0">Oldest Pending Tickets</h6>
            </CCardHeader>
            <CCardBody className="p-0">
              <CTable hover responsive className="mb-0 text-center align-middle">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Ticket</CTableHeaderCell>
                    <CTableHeaderCell>Site</CTableHeaderCell>
                    <CTableHeaderCell>Fault</CTableHeaderCell>
                    <CTableHeaderCell>Days Pending</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {oldest.length === 0 ? (
                    <CTableRow>
                      <CTableDataCell colSpan={4} className="text-muted">
                        No pending tickets
                      </CTableDataCell>
                    </CTableRow>
                  ) : (
                    oldest.map((t) => (
                      <CTableRow key={t.ticket_id}>
                        <CTableDataCell className="small">
                          {t._id ? (
                            <Link
                              to={`view-service-ticket/${t._id}`}
                              className="text-decoration-none"
                            >
                              {t.ticket_id}
                            </Link>
                          ) : (
                            t.ticket_id
                          )}
                        </CTableDataCell>
                        <CTableDataCell className="small">
                          {fmtSite(t.site_id)}
                        </CTableDataCell>
                        <CTableDataCell className="small">
                          {t.fault_type}
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge
                            color={
                              t.days_pending > 30
                                ? "danger"
                                : t.days_pending > 14
                                  ? "warning"
                                  : "secondary"
                            }
                          >
                            {t.days_pending}d
                          </CBadge>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  )}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol xs={12} lg={5}>
          <CCard className="shadow-sm">
            <CCardHeader>
              <h6 className="mb-0">Sites with Most Pending</h6>
            </CCardHeader>
            <CCardBody className="p-0">
              <CTable hover responsive className="mb-0 text-center align-middle">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Site</CTableHeaderCell>
                    <CTableHeaderCell>Pending</CTableHeaderCell>
                    <CTableHeaderCell>Avg Age</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {bySite.filter((s) => s.pending > 0).length === 0 ? (
                    <CTableRow>
                      <CTableDataCell colSpan={3} className="text-muted">
                        No pending tickets
                      </CTableDataCell>
                    </CTableRow>
                  ) : (
                    bySite
                      .filter((s) => s.pending > 0)
                      .slice(0, 10)
                      .map((s) => (
                        <CTableRow key={s.site_id}>
                          <CTableDataCell className="small text-start px-3">
                            {fmtSite(s.site_id)}
                          </CTableDataCell>
                          <CTableDataCell>
                            <CBadge color="warning">{s.pending}</CBadge>
                          </CTableDataCell>
                          <CTableDataCell>{s.avg_pending_days}d</CTableDataCell>
                        </CTableRow>
                      ))
                  )}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  );
};

export default PieChart;
