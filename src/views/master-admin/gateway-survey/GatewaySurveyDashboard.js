// import React from "react";

// const GatewaySurveyDashboard = () => {
//   return <div>GatewaySurveyDashboard</div>;
// };

// export default GatewaySurveyDashboard;

import { useState, useEffect, useCallback } from "react";
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CBadge,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CSpinner,
  CAlert,
  CPagination,
  CPaginationItem,
  CInputGroup,
  CFormSelect,
  CFormInput,
  CInputGroupText,
  CButton,
  CProgress,
  CProgressBar,
} from "@coreui/react";
import axios from "axios";
import CreateSurveyModal from "./Createsurveymodal";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const api = axios.create({
  baseURL: "/api/v1",
  withCredentials: true,
});

// ── Status helpers ────────────────────────────────────────────
const STATUS_META = {
  pending: { color: "warning", label: "Pending", dot: "#f6a823" },
  feasible: { color: "success", label: "Feasible", dot: "#2dce89" },
  not_feasible: { color: "danger", label: "Not Feasible", dot: "#f5365c" },
  marginal: { color: "info", label: "Marginal", dot: "#11cdef" },
};

const coverageColor = (pct) => {
  if (pct >= 100) return "success";
  if (pct >= 75) return "info";
  if (pct >= 50) return "warning";
  return "danger";
};

const rssiLabel = (rssi) => {
  if (!rssi && rssi !== 0) return "—";
  if (rssi >= -70) return { text: "Excellent", color: "#2dce89" };
  if (rssi >= -85) return { text: "Good", color: "#11cdef" };
  if (rssi >= -100) return { text: "Weak", color: "#f6a823" };
  return { text: "Poor", color: "#f5365c" };
};

// ── Mini signal bar component ─────────────────────────────────
function SignalBars({ rssi }) {
  const bars = rssi >= -70 ? 4 : rssi >= -85 ? 3 : rssi >= -100 ? 2 : 1;
  return (
    <span
      style={{
        display: "inline-flex",
        gap: 2,
        alignItems: "flex-end",
        height: 16,
      }}
    >
      {[1, 2, 3, 4].map((b) => (
        <span
          key={b}
          style={{
            width: 4,
            height: b * 4,
            borderRadius: 2,
            background:
              b <= bars
                ? bars === 4
                  ? "#2dce89"
                  : bars === 3
                    ? "#11cdef"
                    : bars === 2
                      ? "#f6a823"
                      : "#f5365c"
                : "#2d3748",
            transition: "background 0.3s",
          }}
        />
      ))}
    </span>
  );
}

// ── Stat card ─────────────────────────────────────────────────
function StatCard({ label, value, sub, accent }) {
  return (
    <CCard
      style={{
        background: "linear-gradient(135deg, #1a1f2e 0%, #141824 100%)",
        border: `1px solid ${accent}22`,
        borderLeft: `3px solid ${accent}`,
        borderRadius: 12,
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = `0 8px 24px ${accent}22`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <CCardBody style={{ padding: "20px 24px" }}>
        <div
          style={{
            color: "#6b7280",
            fontSize: 11,
            // fontFamily: "'DM Mono', monospace",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          {label}
        </div>
        <div
          style={{
            color: "#f1f5f9",
            fontSize: 28,
            fontWeight: 700,
            // fontFamily: "'Sora', sans-serif",
            lineHeight: 1,
          }}
        >
          {value}
        </div>
        {sub && (
          <div
            style={{
              color: "#6b7280",
              fontSize: 12,
              marginTop: 6,
              // fontFamily: "'DM Mono', monospace",
            }}
          >
            {sub}
          </div>
        )}
      </CCardBody>
    </CCard>
  );
}

// ── Main Dashboard ────────────────────────────────────────────
export default function GatewaySurveyDashboard() {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const LIMIT = 10;
  const userInfo = useSelector((state) => state.userInfo);

  let adminroute = "";

  if (userInfo?.role === "Master Admin") {
    adminroute = "master-admin";
  } else if (userInfo?.role === "Service Admin") {
    adminroute = "service-admin";
  } else if (userInfo?.role === "Project Admin") {
    adminroute = "project-admin";
  } else if (userInfo?.role === "Client Admin") {
    adminroute = "client-admin";
  } else if (userInfo?.role === "Site Incharge") {
    adminroute = "site-incharge";
  } else if (userInfo?.role === "Site Technician") {
    adminroute = "site-technician";
  } else if (userInfo?.role === "Client Site Technician") {
    adminroute = "client-site-technician";
  } else if (userInfo?.role === "Master User") {
    adminroute = "master-user";
  } else if (userInfo?.role === "Service User") {
    adminroute = "service-user";
  } else if (userInfo?.role === "Project User") {
    adminroute = "project-user";
  } else if (userInfo?.role === "Factory Admin") {
    adminroute = "factory-admin";
  }
  // add these states
  const [showCreate, setShowCreate] = useState(false);
  const [sites, setSites] = useState([
    {
      _id: "1",
      site_id: "avaada_bachau",
      name: "Avaada Bachau",
    },
    {
      _id: "2",
      site_id: "tata_bachau",
      name: "Tata Bachau",
    },
  ]); // fetch your sites list here

  const fetchSurveys = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { pg: page, limit: LIMIT };
      if (statusFilter) params.status = statusFilter;
      if (search) params.site_id = search;

      const { data } = await api.get("/gateway-surveys", { params });

      setSurveys(data.data || []);
      setTotal(data.total || 0);
      setTotalPages(data.pages || 1);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load surveys.");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search]);

  useEffect(() => {
    fetchSurveys();
  }, [fetchSurveys]);

  // Stats derived from current page data
  const stats = {
    total,
    feasible: surveys.filter((s) => s.feasibility?.status === "feasible")
      .length,
    pending: surveys.filter((s) => s.feasibility?.status === "pending").length,
    not_feasible: surveys.filter(
      (s) => s.feasibility?.status === "not_feasible",
    ).length,
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(160deg, #0d1117 0%, #111827 50%, #0d1117 100%)",
        // fontFamily: "'DM Sans', sans-serif",
        padding: "0 0 48px",
      }}
    >
      {/* Google Fonts */}
      <style>{`
       

        .survey-row { transition: background 0.15s; }
        .survey-row:hover { background: rgba(255,255,255,0.03) !important; }

        .filter-select, .filter-input {
          background: #1a1f2e !important;
          border: 1px solid #2d3748 !important;
          color: #e2e8f0 !important;
          border-radius: 8px !important;
          font-family: 'DM Mono', monospace !important;
          font-size: 13px !important;
        }
        .filter-select:focus, .filter-input:focus {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.15) !important;
          outline: none !important;
        }
        .filter-select option { background: #1a1f2e; }

        .refresh-btn {
          background: linear-gradient(135deg, #3b82f6, #2563eb) !important;
          border: none !important;
          border-radius: 8px !important;
          font-family: 'DM Mono', monospace !important;
          font-size: 13px !important;
          padding: 6px 18px !important;
          transition: opacity 0.2s, transform 0.15s !important;
        }
        .refresh-btn:hover { opacity: 0.88; transform: translateY(-1px); }

        .page-item .page-link {
          background: #1a1f2e !important;
          border-color: #2d3748 !important;
          color: #94a3b8 !important;
          font-family: 'DM Mono', monospace !important;
          font-size: 13px !important;
        }
        .page-item.active .page-link {
          background: #3b82f6 !important;
          border-color: #3b82f6 !important;
          color: #fff !important;
        }

        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-in { animation: fadeSlideIn 0.4s ease forwards; }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>

      {/* ── Header ── */}
      <div
        style={{
          background: "linear-gradient(90deg, #0f172a 0%, #1e293b 100%)",
          borderBottom: "1px solid #1e293b",
          padding: "20px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 100,
          backdropFilter: "blur(12px)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
            }}
          >
            🛰
          </div>
          <div>
            <div
              style={{
                color: "#f1f5f9",
                fontSize: 17,
                fontWeight: 700,
                // fontFamily: "'Sora', sans-serif",
                letterSpacing: "-0.02em",
              }}
            >
              Gateway Survey
            </div>
            <div
              style={{
                color: "#475569",
                fontSize: 11,
                // fontFamily: "'DM Mono', monospace",
                letterSpacing: "0.05em",
              }}
            >
              SOLAR ROBOT COVERAGE MONITOR
            </div>
          </div>
        </div>
      </div>

      <CContainer fluid style={{ maxWidth: 1400, padding: "32px 24px 0" }}>
        {/* ── Stat Cards ── */}
        <CRow className="g-3 mb-4 fade-in">
          <CCol xs={6} md={3}>
            <StatCard label="Total Surveys" value={total} accent="#3b82f6" />
          </CCol>
          <CCol xs={6} md={3}>
            <StatCard
              label="Feasible"
              value={stats.feasible}
              accent="#2dce89"
              sub="on this page"
            />
          </CCol>
          <CCol xs={6} md={3}>
            <StatCard
              label="Pending"
              value={stats.pending}
              accent="#f6a823"
              sub="awaiting review"
            />
          </CCol>
          <CCol xs={6} md={3}>
            <StatCard
              label="Not Feasible"
              value={stats.not_feasible}
              accent="#f5365c"
              sub="requires relocation"
            />
          </CCol>
        </CRow>

        {/* ── Main Card ── */}
        <CCard
          style={{
            background: "linear-gradient(135deg, #141824 0%, #111827 100%)",
            border: "1px solid #1e293b",
            borderRadius: 16,
            boxShadow: "0 4px 40px rgba(0,0,0,0.4)",
            overflow: "hidden",
          }}
          className="fade-in"
        >
          {/* Card Header */}
          <CCardHeader
            style={{
              background: "transparent",
              borderBottom: "1px solid #1e293b",
              padding: "20px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div
              style={{
                color: "#f1f5f9",
                // fontFamily: "'Sora', sans-serif",
                fontWeight: 600,
                fontSize: 15,
              }}
            >
              All Surveys
              <span
                style={{
                  marginLeft: 10,
                  background: "#1e293b",
                  color: "#64748b",
                  fontSize: 11,
                  // fontFamily: "'DM Mono', monospace",
                  padding: "2px 8px",
                  borderRadius: 99,
                  border: "1px solid #2d3748",
                }}
              >
                {total} records
              </span>
            </div>

            {/* Filters */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <CInputGroup style={{ width: 220 }}>
                <CInputGroupText
                  style={{
                    background: "#1a1f2e",
                    border: "1px solid #2d3748",
                    borderRight: "none",
                    color: "#475569",
                    fontSize: 13,
                  }}
                >
                  🔍
                </CInputGroupText>
                <CFormInput
                  className="filter-input"
                  placeholder="Search site ID…"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setSearch(searchInput);
                      setPage(1);
                    }
                  }}
                  style={{ borderLeft: "none" }}
                />
              </CInputGroup>

              <CFormSelect
                className="filter-select"
                style={{ width: 160 }}
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="feasible">Feasible</option>
                <option value="marginal">Marginal</option>
                <option value="not_feasible">Not Feasible</option>
              </CFormSelect>

              <CButton
                className="refresh-btn"
                onClick={fetchSurveys}
                disabled={loading}
              >
                {loading ? <CSpinner size="sm" /> : "⟳ Refresh"}
              </CButton>
              {/* // add this button in your card header, next to Refresh: */}
              <CButton
                className="btn-primary-dark"
                onClick={() => setShowCreate(true)}
              >
                + New Survey
              </CButton>
            </div>
          </CCardHeader>

          <CCardBody style={{ padding: 0 }}>
            {/* Error */}
            {error && (
              <CAlert
                color="danger"
                style={{
                  margin: 20,
                  borderRadius: 10,
                  background: "#1a0a0a",
                  borderColor: "#f5365c33",
                }}
              >
                {error}
              </CAlert>
            )}

            {/* Loading */}
            {loading && !error && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: 60,
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                <CSpinner style={{ color: "#3b82f6", width: 36, height: 36 }} />
                <span
                  style={{
                    color: "#475569",
                    // fontFamily: "'DM Mono', monospace",
                    fontSize: 13,
                  }}
                >
                  Fetching surveys…
                </span>
              </div>
            )}

            {/* Table */}
            {!loading && !error && (
              <div style={{ overflowX: "auto" }}>
                <CTable hover={false}>
                  <CTableHead>
                    <CTableRow>
                      {[
                        "Location No",
                        "Gateway",
                        "Site",
                        "Coordinates",
                        "Coverage",
                        "Signal",
                        "Readings",
                        "Status",
                        "Created",
                      ].map((h) => (
                        <CTableHeaderCell key={h}>{h}</CTableHeaderCell>
                      ))}
                    </CTableRow>
                  </CTableHead>

                  <CTableBody>
                    {surveys.length === 0 ? (
                      <CTableRow>
                        <CTableDataCell colSpan={9}>
                          No surveys found.
                        </CTableDataCell>
                      </CTableRow>
                    ) : (
                      surveys.map((s, idx) => {
                        const status = s.feasibility?.status || "pending";
                        const meta = STATUS_META[status] || STATUS_META.pending;
                        const coords = s.gateway_location?.coordinates || [];
                        const rssiInfo = rssiLabel(s.feasibility?.avg_rssi);
                        const coverage = s.feasibility?.coverage_percent ?? 0;

                        return (
                          <CTableRow
                            key={s._id}
                            style={{
                              borderBottom: "1px solid #1e293b",
                              animationDelay: `${idx * 40}ms`,
                            }}
                          >
                            {/* Location No */}
                            <CTableDataCell>
                              <Link
                                to={`/${adminroute}/gateway-survey-dashboard/view-gateway-survey/${s._id}`}
                              >
                                Location {s.location_no}
                              </Link>
                            </CTableDataCell>

                            {/* Gateway */}
                            <CTableDataCell>
                              {s.gateway_name || "—"}

                              {s.gateway_eui || ""}

                              {s.gateway_type && s.gateway_type}
                            </CTableDataCell>

                            {/* Site */}
                            <CTableDataCell>{s.site_id}</CTableDataCell>

                            {/* Coordinates */}
                            <CTableDataCell>
                              <Link
                                target="blank"
                                className="text-decoration-none"
                                to={`https://www.google.com/maps/search/?api=1&query=${coords[1]},${coords[0]}`}
                              >
                                View
                              </Link>
                            </CTableDataCell>

                            {/* Coverage */}
                            <CTableDataCell>
                              {coverage}% ({s.feasibility?.robots_covered ?? 0}/
                              {s.feasibility?.total_robots_tested ?? 0})
                              <CProgress
                                style={{
                                  height: 5,
                                  background: "#1e293b",
                                  borderRadius: 99,
                                }}
                              >
                                <CProgressBar
                                  color={coverageColor(coverage)}
                                  value={coverage}
                                  style={{
                                    borderRadius: 99,
                                    transition: "width 0.6s ease",
                                  }}
                                />
                              </CProgress>
                            </CTableDataCell>

                            {/* Signal */}
                            <CTableDataCell>
                              {s.feasibility?.avg_rssi != null ? (
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                  }}
                                >
                                  <SignalBars rssi={s.feasibility.avg_rssi} />
                                  <div>
                                    <div
                                      style={{
                                        color: rssiInfo.color,
                                        fontSize: 12,
                                        // fontFamily: "'DM Mono', monospace",
                                        fontWeight: 600,
                                      }}
                                    >
                                      {s.feasibility.avg_rssi} dBm
                                    </div>
                                    <div
                                      style={{
                                        color: "#475569",
                                        fontSize: 10,
                                        // fontFamily: "'DM Mono', monospace",
                                      }}
                                    >
                                      SNR {s.feasibility?.avg_snr ?? "—"} dB
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <span
                                  style={{
                                    color: "#334155",
                                    // fontFamily: "'DM Mono', monospace",
                                    fontSize: 12,
                                  }}
                                >
                                  No data
                                </span>
                              )}
                            </CTableDataCell>

                            {/* Readings count */}
                            <CTableDataCell>
                              <div
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  width: 32,
                                  height: 32,
                                  borderRadius: 8,
                                  background: "#1e293b",
                                  border: "1px solid #2d3748",
                                  color: "#94a3b8",
                                  // fontFamily: "'DM Mono', monospace",
                                  fontSize: 13,
                                  fontWeight: 600,
                                }}
                              >
                                {s.robot_readings?.length ??
                                  s.feasibility?.total_robots_tested ??
                                  0}
                              </div>
                            </CTableDataCell>

                            {/* Status */}
                            <CTableDataCell>
                              <CBadge
                                color={meta.color}
                                style={{
                                  // fontFamily: "'DM Mono', monospace",
                                  fontSize: 10,
                                  letterSpacing: "0.06em",
                                  textTransform: "uppercase",
                                  padding: "4px 10px",
                                  borderRadius: 6,
                                }}
                              >
                                <span
                                  style={{
                                    display: "inline-block",
                                    width: 6,
                                    height: 6,
                                    borderRadius: "50%",
                                    background: "#fff",
                                    marginRight: 6,
                                    opacity: 0.8,
                                    verticalAlign: "middle",
                                  }}
                                />
                                {meta.label}
                              </CBadge>
                            </CTableDataCell>

                            {/* Created */}
                            <CTableDataCell>
                              <div
                                style={{
                                  color: "#64748b",
                                  // fontFamily: "'DM Mono', monospace",
                                  fontSize: 11,
                                }}
                              >
                                {new Date(s.createdAt).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )}
                              </div>
                              <div
                                style={{
                                  color: "#334155",
                                  // fontFamily: "'DM Mono', monospace",
                                  fontSize: 10,
                                  marginTop: 2,
                                }}
                              >
                                {new Date(s.createdAt).toLocaleTimeString(
                                  "en-IN",
                                  { hour: "2-digit", minute: "2-digit" },
                                )}
                              </div>
                            </CTableDataCell>
                          </CTableRow>
                        );
                      })
                    )}
                  </CTableBody>
                </CTable>
              </div>
            )}

            {/* Pagination */}
            {!loading && !error && totalPages > 1 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px 24px",
                  borderTop: "1px solid #1e293b",
                }}
              >
                <span
                  style={{
                    color: "#475569",
                    // fontFamily: "'DM Mono', monospace",
                    fontSize: 12,
                  }}
                >
                  Page {page} of {totalPages} · {total} total
                </span>
                <CPagination style={{ margin: 0 }}>
                  <CPaginationItem
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    style={{ cursor: page === 1 ? "default" : "pointer" }}
                  >
                    ‹
                  </CPaginationItem>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pg =
                      Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                    return pg <= totalPages ? (
                      <CPaginationItem
                        key={pg}
                        active={pg === page}
                        onClick={() => setPage(pg)}
                        style={{ cursor: "pointer" }}
                      >
                        {pg}
                      </CPaginationItem>
                    ) : null;
                  })}

                  <CPaginationItem
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    style={{
                      cursor: page === totalPages ? "default" : "pointer",
                    }}
                  >
                    ›
                  </CPaginationItem>
                </CPagination>
              </div>
            )}
          </CCardBody>
        </CCard>
      </CContainer>
      {/* // add modal at the bottom of your return: */}
      <CreateSurveyModal
        visible={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={() => fetchSurveys()} // auto-refreshes table after create
        sites={sites} // your sites array [{_id, name}]
      />
    </div>
  );
}
