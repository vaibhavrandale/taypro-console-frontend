import React, { useEffect, useMemo, useReducer, useState } from "react";
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CFormSelect,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import { CChartBar } from "@coreui/react-chartjs";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../../components/LoadingSpinner";
import ConfirmModal from "../../../components/ConfirmModal";

const YEARS = [2023, 2024, 2025, 2026, 2027];
const INTERNAL_ROLES = [
  "Master Admin",
  "Master User",
  "Service Admin",
  "Project Admin",
  "Project User",
  "Service User",
];
const TICK = "#94a3b8";
const GRID = "rgba(148, 163, 184, 0.12)";

const reducer = (state, action) => {
  switch (action.type) {
    case "CLIENTS_REQUEST":
      return { ...state, loadingClients: true, clientsError: "" };
    case "CLIENTS_SUCCESS":
      return { ...state, loadingClients: false, clients: action.payload };
    case "CLIENTS_FAIL":
      return {
        ...state,
        loadingClients: false,
        clientsError: action.payload,
      };
    case "REPORT_REQUEST":
      return { ...state, loadingReport: true, reportError: "", report: null };
    case "REPORT_SUCCESS":
      return { ...state, loadingReport: false, report: action.payload };
    case "REPORT_FAIL":
      return {
        ...state,
        loadingReport: false,
        reportError: action.payload,
        report: null,
      };
    default:
      return state;
  }
};

const roleToRoute = (role) => {
  if (role === "Master Admin") return "master-admin";
  if (role === "Service Admin") return "service-admin";
  if (role === "Project Admin") return "project-admin";
  if (role === "Client Admin") return "client-admin";
  if (role === "Master User") return "master-user";
  if (role === "Service User") return "service-user";
  if (role === "Project User") return "project-user";
  return "";
};

const cleaningReportPath = (adminroute, siteId) =>
  adminroute === "client-admin"
    ? `/${adminroute}/cleaning-log-sites/cleaning-report/${siteId}`
    : `/${adminroute}/all-site-cleaning-log/cleaning-report/${siteId}`;

const pctColor = (n) => {
  if (n >= 80) return "success";
  if (n >= 50) return "warning";
  return "danger";
};

const wrapLocation = (text, maxChars = 12, maxLines = 3) => {
  const raw = String(text || "").trim();
  if (!raw) return [""];
  const lines = raw.split(/,\s*/).flatMap((part) => {
    if (part.length <= maxChars) return [part];
    const words = part.split(/\s+/);
    const wrapped = [];
    let line = "";
    for (const word of words) {
      const next = line ? `${line} ${word}` : word;
      if (next.length > maxChars && line) {
        wrapped.push(line);
        line = word;
      } else {
        line = next;
      }
    }
    if (line) wrapped.push(line);
    return wrapped;
  });
  if (lines.length <= maxLines) return lines;
  return [...lines.slice(0, maxLines - 1), `${lines[maxLines - 1]}…`];
};

const ClientWiseYearlyUptime = () => {
  const userInfo = useSelector((state) => state.userInfo);
  const adminroute = roleToRoute(userInfo?.role);
  const isInternal = INTERNAL_ROLES.includes(userInfo?.role);

  const [
    {
      loadingClients,
      clientsError,
      clients,
      loadingReport,
      reportError,
      report,
    },
    dispatch,
  ] = useReducer(reducer, {
    clients: [],
    loadingClients: true,
    clientsError: "",
    report: null,
    loadingReport: false,
    reportError: "",
  });

  const [year, setYear] = useState(new Date().getFullYear());
  const [clientId, setClientId] = useState("");
  const [siteSearch, setSiteSearch] = useState("");
  const [expandedSite, setExpandedSite] = useState("");
  const [emailing, setEmailing] = useState(false);
  const [emailModal, setEmailModal] = useState(false);
  const isClientAdmin = userInfo?.role === "Client Admin";

  useEffect(() => {
    const fetchClients = async () => {
      try {
        dispatch({ type: "CLIENTS_REQUEST" });
        const response = await axios.get(`/api/v1/clients/get-all-clients`, {
          withCredentials: true,
        });
        let list = response.data.data || [];
        if (!isInternal) {
          const allowed = new Set(
            (userInfo?.assigned_sites || [])
              .map((s) => s.client_id)
              .filter(Boolean),
          );
          if (allowed.size) {
            list = list.filter((c) => allowed.has(c.client_id));
          }
        }
        dispatch({ type: "CLIENTS_SUCCESS", payload: list });
        if (list.length) {
          setClientId((current) => current || list[0].client_id);
        }
      } catch (error) {
        const msg =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message;
        dispatch({ type: "CLIENTS_FAIL", payload: msg });
        toast.error(msg);
      }
    };
    fetchClients();
  }, [isInternal, userInfo?.assigned_sites]);

  useEffect(() => {
    if (!clientId) return undefined;
    const fetchReport = async () => {
      try {
        dispatch({ type: "REPORT_REQUEST" });
        const result = await axios.post(
          `/api/v1/yearly-uptime/client-summary`,
          { client_id: clientId, year },
          { withCredentials: true },
        );
        dispatch({ type: "REPORT_SUCCESS", payload: result.data });
        setExpandedSite("");
      } catch (error) {
        const msg =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to load client yearly uptime";
        dispatch({ type: "REPORT_FAIL", payload: msg });
        toast.error(msg);
      }
    };
    fetchReport();
  }, [clientId, year]);

  const handleEmailClientAdmin = async () => {
    if (!clientId) return;
    try {
      setEmailing(true);
      toast.loading(
        isClientAdmin
          ? "Queuing yearly uptime email..."
          : "Queuing yearly uptime email to Client Admins...",
        { id: "client-yearly-email" },
      );
      const result = await axios.post(
        `/api/v1/yearly-uptime/client-email`,
        { client_id: clientId, year },
        { withCredentials: true },
      );
      toast.success(result.data?.message || "Email queued", {
        id: "client-yearly-email",
      });
      setEmailModal(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to queue email",
        { id: "client-yearly-email" },
      );
    } finally {
      setEmailing(false);
    }
  };

  const filteredSites = useMemo(() => {
    const sites = report?.sites || [];
    const term = siteSearch.toLowerCase();
    return sites.filter(
      (s) =>
        s.siteName?.toLowerCase().includes(term) ||
        s.site_id?.toLowerCase().includes(term) ||
        s.location?.toLowerCase().includes(term),
    );
  }, [report, siteSearch]);

  const selectedClient = clients.find((c) => c.client_id === clientId);
  const y = report?.client;
  const chartHeight = 380;

  return (
    <div>
      <div className="mb-2 d-flex justify-content-center">
        <h4 className="mb-0">Client-wise Yearly Uptime</h4>
      </div>

      <CCard>
        <CCardHeader>
          <CRow className="align-items-end g-3">
            <CCol xs={12} md={4}>
              <label className="form-label small fw-semibold">Client</label>
              {loadingClients ? (
                <LoadingSpinner size="sm" />
              ) : clientsError ? (
                <div className="text-danger small">{clientsError}</div>
              ) : (
                <CFormSelect
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                >
                  {clients.length === 0 ? (
                    <option value="">No clients found</option>
                  ) : (
                    clients.map((c) => (
                      <option key={c.client_id} value={c.client_id}>
                        {c.client_name}
                      </option>
                    ))
                  )}
                </CFormSelect>
              )}
            </CCol>
            <CCol xs={6} md={2}>
              <label className="form-label small fw-semibold">Year</label>
              <CFormSelect
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value, 10))}
              >
                {YEARS.map((yOption) => (
                  <option key={yOption} value={yOption}>
                    {yOption}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol xs={6} md={3}>
              <label className="form-label small fw-semibold">Search site</label>
              <CFormInput
                placeholder="Name / ID / location"
                value={siteSearch}
                onChange={(e) => setSiteSearch(e.target.value)}
              />
            </CCol>
            <CCol xs={12} md={3}>
              <div className="d-flex flex-wrap justify-content-md-end gap-3">
                {loadingReport ? (
                  <LoadingSpinner size="sm" />
                ) : y ? (
                  <>
                    <div className="text-center">
                      <div className="text-muted small">Sites</div>
                      <CBadge color="primary" className="fs-6 px-2 mt-1">
                        {y.sites_with_data}/{y.sites_count}
                      </CBadge>
                    </div>
                    <div className="text-center">
                      <div className="text-muted small">Robots</div>
                      <CBadge color="primary" className="fs-6 px-2 mt-1">
                        {y.total_assigned_robots}
                      </CBadge>
                    </div>
                    <div className="text-center">
                      <div className="text-muted small">Availability</div>
                      <CBadge color="warning" className="fs-6 px-2 mt-1">
                        {y.monthlyAvailibilityUptime}%
                      </CBadge>
                    </div>
                    <div className="text-center">
                      <div className="text-muted small">Cleaning</div>
                      <CBadge color="warning" className="fs-6 px-2 mt-1">
                        {y.monthlyCleaningUptime}%
                      </CBadge>
                    </div>
                    <CButton
                      color="success"
                      size="sm"
                      className="align-self-end"
                      disabled={emailing || !clientId}
                      onClick={() => setEmailModal(true)}
                    >
                      {isClientAdmin
                        ? "Email Report"
                        : "Email Client Admin"}
                    </CButton>
                  </>
                ) : null}
              </div>
            </CCol>
          </CRow>
        </CCardHeader>

        <CCardBody>
          {selectedClient ? (
            <h6 className="mb-3">
              {selectedClient.client_name}
              <span className="text-muted"> — {year}</span>
            </h6>
          ) : null}

          {loadingReport ? (
            <div className="text-center py-5">
              <LoadingSpinner />
            </div>
          ) : reportError ? (
            <div className="text-danger text-center py-3">{reportError}</div>
          ) : !report ? (
            <div className="text-muted text-center py-4">
              Select a client to see yearly uptime of all sites.
            </div>
          ) : (
            <>
              {filteredSites.length > 0 ? (
                <div className="mb-4" style={{ height: chartHeight }}>
                  <CChartBar
                    style={{ height: "100%", width: "100%" }}
                    data={{
                      labels: filteredSites.map((s) =>
                        wrapLocation(s.location || s.site_id),
                      ),
                      datasets: [
                        {
                          label: "Availability %",
                          backgroundColor: "#2563eb",
                          data: filteredSites.map(
                            (s) =>
                              Number(s.yearly?.monthlyAvailibilityUptime) || 0,
                          ),
                        },
                        {
                          label: "Cleaning %",
                          backgroundColor: "#0f766e",
                          data: filteredSites.map(
                            (s) =>
                              Number(s.yearly?.monthlyCleaningUptime) || 0,
                          ),
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      datasets: {
                        bar: {
                          barPercentage: 1,
                          categoryPercentage: 0.5,
                        },
                      },
                      plugins: {
                        legend: {
                          position: "top",
                          labels: { color: TICK, boxWidth: 12 },
                        },
                        tooltip: {
                          callbacks: {
                            title: (items) => {
                              const site = filteredSites[items[0]?.dataIndex];
                              if (!site) return "";
                              return site.location || site.site_id;
                            },
                          },
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          max: 100,
                          ticks: { color: TICK },
                          grid: { color: GRID },
                          title: { display: true, text: "%", color: TICK },
                        },
                        x: {
                          ticks: {
                            color: TICK,
                            font: { size: 10 },
                            maxRotation: 0,
                            minRotation: 0,
                            autoSkip: false,
                          },
                          grid: { display: false },
                        },
                      },
                    }}
                  />
                </div>
              ) : null}

              <CTable hover bordered responsive>
                <CTableHead color="secondary">
                  <CTableRow>
                    <CTableHeaderCell>Sr</CTableHeaderCell>
                    <CTableHeaderCell>Site</CTableHeaderCell>
                    <CTableHeaderCell>Location</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">
                      Robots
                    </CTableHeaderCell>
                    <CTableHeaderCell className="text-center">
                      Availability Uptime
                    </CTableHeaderCell>
                    <CTableHeaderCell className="text-center">
                      Cleaning Uptime
                    </CTableHeaderCell>
                    <CTableHeaderCell className="text-center">
                      Months
                    </CTableHeaderCell>
                    <CTableHeaderCell>Action</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {filteredSites.length === 0 ? (
                    <CTableRow>
                      <CTableDataCell colSpan="8" className="text-center">
                        No capex sites with Automatic robots for this client.
                      </CTableDataCell>
                    </CTableRow>
                  ) : (
                    filteredSites.map((site, index) => {
                      const cleaning =
                        Number(site.yearly?.monthlyCleaningUptime) || 0;
                      const availability =
                        Number(site.yearly?.monthlyAvailibilityUptime) || 0;
                      return (
                        <React.Fragment key={site.site_id}>
                          <CTableRow>
                            <CTableHeaderCell scope="row">
                              {index + 1}
                            </CTableHeaderCell>
                            <CTableDataCell>
                              <div>{site.siteName}</div>
                              <div className="text-muted small">
                                {site.site_id}
                              </div>
                            </CTableDataCell>
                            <CTableDataCell>{site.location}</CTableDataCell>
                            <CTableDataCell className="text-center">
                              {site.yearly?.total_assigned_robots || 0}
                            </CTableDataCell>
                            <CTableDataCell className="text-center">
                              <CBadge color={pctColor(availability)}>
                                {availability}%
                              </CBadge>
                            </CTableDataCell>
                            <CTableDataCell className="text-center">
                              <CBadge color={pctColor(cleaning)}>
                                {cleaning}%
                              </CBadge>
                            </CTableDataCell>
                            <CTableDataCell className="text-center">
                              {site.yearly?.months_with_data || 0}
                            </CTableDataCell>
                            <CTableDataCell>
                              <CButton
                                color="success"
                                size="sm"
                                className="m-1"
                                onClick={() =>
                                  setExpandedSite(
                                    expandedSite === site.site_id
                                      ? ""
                                      : site.site_id,
                                  )
                                }
                              >
                                {expandedSite === site.site_id
                                  ? "Hide"
                                  : "Months"}
                              </CButton>
                              <Link
                                className="btn btn-success btn-sm m-1"
                                to={cleaningReportPath(
                                  adminroute,
                                  site.site_id,
                                )}
                              >
                                Report
                              </Link>
                            </CTableDataCell>
                          </CTableRow>
                          {expandedSite === site.site_id ? (
                            <CTableRow>
                              <CTableDataCell colSpan="8">
                                <CTable bordered small responsive className="mb-0">
                                  <CTableHead color="secondary">
                                    <CTableRow>
                                      <CTableHeaderCell>Month</CTableHeaderCell>
                                      <CTableHeaderCell className="text-center">
                                        Availability
                                      </CTableHeaderCell>
                                      <CTableHeaderCell className="text-center">
                                        Cleaning
                                      </CTableHeaderCell>
                                      <CTableHeaderCell className="text-center">
                                        Status
                                      </CTableHeaderCell>
                                    </CTableRow>
                                  </CTableHead>
                                  <CTableBody>
                                    {(site.months || []).map((m) => (
                                      <CTableRow key={m.month}>
                                        <CTableDataCell>
                                          {m.month_name}
                                        </CTableDataCell>
                                        <CTableDataCell className="text-center">
                                          {m.monthlyAvailibilityUptime}%
                                        </CTableDataCell>
                                        <CTableDataCell className="text-center">
                                          {m.monthlyCleaningUptime}%
                                        </CTableDataCell>
                                        <CTableDataCell className="text-center">
                                          {m.has_data ? "Data" : "No data"}
                                        </CTableDataCell>
                                      </CTableRow>
                                    ))}
                                  </CTableBody>
                                </CTable>
                              </CTableDataCell>
                            </CTableRow>
                          ) : null}
                        </React.Fragment>
                      );
                    })
                  )}
                </CTableBody>
              </CTable>
            </>
          )}
        </CCardBody>
      </CCard>

      <ConfirmModal
        visible={emailModal}
        onClose={() => !emailing && setEmailModal(false)}
        onConfirm={handleEmailClientAdmin}
        title={
          isClientAdmin
            ? "Email yearly uptime report?"
            : "Email Client Admins?"
        }
        message={
          isClientAdmin
            ? `This will email the <strong>${year}</strong> yearly uptime for your assigned sites to <strong>${userInfo?.email || "you"}</strong>.`
            : `This will email the <strong>${year}</strong> yearly uptime to each Client Admin of <strong>${selectedClient?.client_name || clientId}</strong>, with only their assigned sites in that mail.`
        }
        confirmLabel="Send email"
        confirmColor="success"
        loading={emailing}
      />
    </div>
  );
};

export default ClientWiseYearlyUptime;
