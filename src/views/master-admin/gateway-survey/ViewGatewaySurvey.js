// import axios from "axios";
// import React, { useCallback, useEffect, useReducer } from "react";
// import { useSelector } from "react-redux";
// import { useParams } from "react-router-dom";

// const reducer = (state, action) => {
//   switch (action.type) {
//     case "FETCH_SURVEY_LOCATION_REQUEST":
//       return { ...state, surveyFetchLoading: true };
//     case "FETCH_SURVEY_LOCATION_SUCCESS":
//       return { ...state, survey: action.payload, surveyFetchLoading: false };
//     case "FETCH_SURVEY_LOCATION_FAIL":
//       return {
//         ...state,
//         surveyFetchLoading: false,
//         surveyFetchError: action.payload,
//       };
//     default:
//       return state;
//   }
// };

// const ViewGatewaySurvey = () => {
//   const [{ survey, surveyFetchLoading, surveyFetchError }, dispatch] =
//     useReducer(reducer, {
//       survey: null,
//       surveyFetchLoading: false,
//       surveyFetchError: "",
//     });

//   const { id } = useParams();

//   const fetchSurveyLocation = useCallback(async () => {
//     try {
//       dispatch({ type: "FETCH_SURVEY_LOCATION_REQUEST" });
//       const { data } = await axios.get(`/api/v1/gateway-surveys/${id}`, {
//         // headers: { Authorization: `Bearer ${authtoken}` },
//         withCredentials: true,
//       });
//       dispatch({ type: "FETCH_SURVEY_LOCATION_SUCCESS", payload: data.data });
//     } catch (err) {
//       dispatch({
//         type: "FETCH_SURVEY_LOCATION_FAIL",
//         payload: err.response?.data?.message || "Fetch failed",
//       });
//     }
//   }, [id]);

//   useEffect(() => {
//     fetchSurveyLocation();
//   }, [fetchSurveyLocation]);

//   return (
//     <div>
//       ViewLocation{" "}
//       {surveyFetchLoading
//         ? "Loading..."
//         : surveyFetchError
//           ? `Error: ${surveyFetchError}`
//           : survey?.site_id}
//     </div>
//   );
// };

// export default ViewGatewaySurvey;

// ViewGatewaySurvey.jsx — CoreUI React
// Requires: @coreui/react, @coreui/icons-react

import React, { useCallback, useEffect, useReducer, useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CBadge,
  CSpinner,
  CAlert,
  CProgress,
  CAvatar,
  CButton,
} from "@coreui/react";
import { CIcon } from "@coreui/icons-react";
import {
  cilRouter,
  cilLocationPin,
  cilSignalCellular4,
  cilChartPie,
  cilClock,
  cilInfo,
} from "@coreui/icons";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import LastActivity from "../../../components/LastActivity";
import { useSelector } from "react-redux";
import SurveySignalMapModal from "./SurveySignalMapModal";

// ─── reducer ──────────────────────────────────────────────────────────────────

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_SURVEY_LOCATION_REQUEST":
      return { ...state, surveyFetchLoading: true, surveyFetchError: "" };
    case "FETCH_SURVEY_LOCATION_SUCCESS":
      return { ...state, survey: action.payload, surveyFetchLoading: false };
    case "FETCH_SURVEY_LOCATION_FAIL":
      return {
        ...state,
        surveyFetchLoading: false,
        surveyFetchError: action.payload,
      };
    default:
      return state;
  }
};

// ─── helpers ──────────────────────────────────────────────────────────────────

function rssiQuality(rssi) {
  if (rssi > -80) return { label: "Excellent", color: "success" };
  if (rssi > -100) return { label: "Marginal", color: "warning" };
  return { label: "Poor", color: "danger" };
}

function snrQuality(snr) {
  if (snr > 5) return { label: "Good", color: "success" };
  if (snr > 0) return { label: "Weak", color: "warning" };
  return { label: "Poor", color: "danger" };
}

function rssiPercent(rssi) {
  return Math.max(0, Math.min(100, ((rssi + 120) / 80) * 100));
}

function snrPercent(snr) {
  return Math.max(0, Math.min(100, ((snr + 20) / 35) * 100));
}

function feasibilityColor(status) {
  if (status === "feasible") return "success";
  if (status === "marginal") return "warning";
  if (status === "not_feasible") return "danger";
  return "secondary";
}

function formatCoords(coordinates) {
  if (!coordinates || coordinates.length < 2) return "—";
  const [lng, lat] = coordinates;
  return `${parseFloat(lat).toFixed(6)}, ${parseFloat(lng).toFixed(6)}`;
}

function formatDate(dateVal) {
  const d = new Date(dateVal?.$date ?? dateVal);
  if (isNaN(d)) return "—";
  return d.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  });
}

function initials(name = "") {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

// ─── coverage ring (pure SVG) ─────────────────────────────────────────────────

function CoverageRing({ percent = 0 }) {
  const r = 46;
  const circ = 2 * Math.PI * r;
  const dash = (percent / 100) * circ;
  return (
    <div
      style={{ position: "relative", width: 112, height: 112, flexShrink: 0 }}
    >
      <svg width="112" height="112" viewBox="0 0 112 112">
        <circle
          cx="56"
          cy="56"
          r={r}
          fill="none"
          stroke="var(--cui-border-color-translucent)"
          strokeWidth="9"
        />
        <circle
          cx="56"
          cy="56"
          r={r}
          fill="none"
          stroke={
            percent >= 80 ? "#2eb85c" : percent >= 50 ? "#f9b115" : "#e55353"
          }
          strokeWidth="9"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 56 56)"
          style={{ transition: "stroke-dasharray 0.6s ease" }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <strong style={{ fontSize: 20 }}>{percent}%</strong>
        <span className="text-medium-emphasis" style={{ fontSize: 11 }}>
          coverage
        </span>
      </div>
    </div>
  );
}

// ─── component ────────────────────────────────────────────────────────────────

const ViewGatewaySurvey = () => {
  const [{ survey, surveyFetchLoading, surveyFetchError }, dispatch] =
    useReducer(reducer, {
      survey: null,
      surveyFetchLoading: false,
      surveyFetchError: "",
    });

  const { id } = useParams();
  const userInfo = useSelector((state) => state.userInfo);
  const [showMap, setShowMap] = useState(false);

  const fetchSurveyLocation = useCallback(async () => {
    try {
      dispatch({ type: "FETCH_SURVEY_LOCATION_REQUEST" });
      const { data } = await axios.get(`/api/v1/gateway-surveys/${id}`, {
        withCredentials: true,
      });
      dispatch({ type: "FETCH_SURVEY_LOCATION_SUCCESS", payload: data.data });
    } catch (err) {
      dispatch({
        type: "FETCH_SURVEY_LOCATION_FAIL",
        payload: err.response?.data?.message || "Fetch failed",
      });
    }
  }, [id]);

  useEffect(() => {
    fetchSurveyLocation();
  }, [fetchSurveyLocation]);

  // ── loading ──────────────────────────────────────────────────────────────────
  if (surveyFetchLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <CSpinner color="primary" />
      </div>
    );
  }

  // ── error ────────────────────────────────────────────────────────────────────
  if (surveyFetchError) {
    return (
      <CAlert color="danger" className="m-3">
        <CIcon icon={cilInfo} className="me-2" />
        {surveyFetchError}
      </CAlert>
    );
  }

  // ── no data yet ───────────────────────────────────────────────────────────────
  if (!survey) return null;

  const {
    site_id,
    location_no,
    gateway_name,
    gateway_type,
    gateway_eui,
    deveui,
    robot_no,
    gateway_location,
    robot_readings = [],
    feasibility = {},
    last_activity = [],
    createdAt,
    updatedAt,
  } = survey;

  const fColor = feasibilityColor(feasibility.status);
  const coverage = feasibility.coverage_percent ?? 0;

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

  return (
    <CRow className="justify-content-center">
      <CCol lg={11} xl={10}>
        {/* ── breadcrumb + header ──────────────────────────────────────── */}
        <div className="mb-4">
          <CButton
            className="btn btn-sm btn-outline-primary"
            onClick={() => setShowMap(true)}
          >
            View signal map
          </CButton>{" "}
          <SurveySignalMapModal
            visible={showMap}
            onClose={() => setShowMap(false)}
            survey={survey}
          />
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mt-1">
            <div>
              <h4 className="mb-0">{gateway_name}</h4>
              <p className="text-medium-emphasis small mt-1 mb-0">
                Location no. {location_no} &nbsp;·&nbsp;
                <CBadge color="info" shape="rounded-pill" className="ms-1">
                  {gateway_type}
                </CBadge>
              </p>
            </div>
            <CBadge
              color={fColor}
              style={{ fontSize: 13, padding: "6px 14px" }}
            >
              {feasibility.status?.replace("_", " ") ?? "—"}
            </CBadge>
          </div>
        </div>

        {/* ── feasibility metrics ──────────────────────────────────────── */}
        <CRow className="g-3 mb-3">
          {[
            {
              label: "Coverage",
              value: `${coverage}%`,
              sub: `${feasibility.robots_covered ?? 0} of ${feasibility.total_robots_tested ?? 0} robots`,
              color: fColor,
            },
            {
              label: "Avg RSSI",
              value: `${feasibility.avg_rssi ?? "—"} dBm`,
              sub:
                feasibility.avg_rssi !== undefined
                  ? rssiQuality(feasibility.avg_rssi).label
                  : "",
              color:
                feasibility.avg_rssi !== undefined
                  ? rssiQuality(feasibility.avg_rssi).color
                  : "secondary",
            },
            {
              label: "Avg SNR",
              value: `${feasibility.avg_snr !== undefined ? parseFloat(feasibility.avg_snr).toFixed(1) : "—"} dB`,
              sub:
                feasibility.avg_snr !== undefined
                  ? snrQuality(feasibility.avg_snr).label
                  : "",
              color:
                feasibility.avg_snr !== undefined
                  ? snrQuality(feasibility.avg_snr).color
                  : "secondary",
            },
            {
              label: "Readings",
              value: robot_readings.length,
              sub: "total captured",
              color: "primary",
            },
          ].map(({ label, value, sub, color }) => (
            <CCol xs={6} md={3} key={label}>
              <div
                className="p-3 h-100"
                style={{
                  background: "var(--cui-secondary-bg)",
                  borderRadius: 8,
                }}
              >
                <div className="text-medium-emphasis small mb-1">{label}</div>
                <div
                  className={`fs-5 fw-semibold text-${color} font-monospace`}
                >
                  {value}
                </div>
                {sub && (
                  <div className="small text-medium-emphasis mt-1">{sub}</div>
                )}
              </div>
            </CCol>
          ))}
        </CRow>

        <CRow className="g-3 mb-3">
          {/* ── gateway info ────────────────────────────────────────────── */}
          <CCol md={6}>
            <CCard className="h-100">
              <CCardHeader className="py-2 d-flex align-items-center gap-2">
                <CIcon icon={cilRouter} size="sm" />
                <strong className="small">Gateway info</strong>
              </CCardHeader>
              <CCardBody>
                {[
                  { label: "Site ID", value: site_id },
                  { label: "Gateway EUI", value: gateway_eui, mono: true },
                  { label: "Device EUI", value: deveui, mono: true },
                  { label: "Robot no.", value: robot_no, mono: true },
                  { label: "Type", value: gateway_type },
                  { label: "Created", value: formatDate(createdAt) },
                  { label: "Last updated", value: formatDate(updatedAt) },
                ].map(({ label, value, mono }) => (
                  <div
                    key={label}
                    className="d-flex justify-content-between align-items-center py-2"
                    style={{
                      borderBottom:
                        "1px solid var(--cui-border-color-translucent)",
                    }}
                  >
                    <span className="text-medium-emphasis small">{label}</span>
                    <span
                      className={`small fw-semibold${mono ? " font-monospace" : ""}`}
                      style={{
                        maxWidth: "55%",
                        textAlign: "right",
                        wordBreak: "break-all",
                      }}
                    >
                      {value ?? "—"}
                    </span>
                  </div>
                ))}

                <div className="mt-3">
                  <p className="text-medium-emphasis small mb-1">
                    <CIcon icon={cilLocationPin} size="sm" className="me-1" />
                    Gateway coordinates
                  </p>
                  <div
                    className="font-monospace small p-2"
                    style={{
                      background: "var(--cui-secondary-bg)",
                      borderRadius: 6,
                    }}
                  >
                    {formatCoords(gateway_location?.coordinates)}
                  </div>
                </div>
              </CCardBody>
            </CCard>
          </CCol>

          {/* ── coverage + feasibility ───────────────────────────────────── */}
          <CCol md={6}>
            <CCard className="h-100">
              <CCardHeader className="py-2 d-flex align-items-center gap-2">
                <CIcon icon={cilChartPie} size="sm" />
                <strong className="small">Coverage &amp; feasibility</strong>
                <CBadge color={fColor} shape="rounded-pill" className="ms-auto">
                  {feasibility.status?.replace("_", " ") ?? "—"}
                </CBadge>
              </CCardHeader>
              <CCardBody>
                <div className="d-flex align-items-center gap-4 mb-3">
                  <CoverageRing percent={coverage} />
                  <div className="flex-grow-1">
                    <CRow className="g-2">
                      {[
                        {
                          label: "Tested",
                          value: feasibility.total_robots_tested ?? 0,
                        },
                        {
                          label: "Covered",
                          value: feasibility.robots_covered ?? 0,
                          color: fColor,
                        },
                      ].map(({ label, value, color }) => (
                        <CCol xs={6} key={label}>
                          <div
                            className="p-2 text-center"
                            style={{
                              background: "var(--cui-secondary-bg)",
                              borderRadius: 6,
                            }}
                          >
                            <div
                              className="text-medium-emphasis"
                              style={{ fontSize: 11 }}
                            >
                              {label}
                            </div>
                            <div
                              className={`fs-4 fw-semibold${color ? ` text-${color}` : ""}`}
                            >
                              {value}
                            </div>
                          </div>
                        </CCol>
                      ))}
                    </CRow>
                  </div>
                </div>

                {/* avg signal bars */}
                {[
                  {
                    label: "Avg RSSI",
                    value: feasibility.avg_rssi,
                    unit: "dBm",
                    percent: rssiPercent(feasibility.avg_rssi ?? -120),
                    q: rssiQuality(feasibility.avg_rssi ?? -120),
                  },
                  {
                    label: "Avg SNR",
                    value: feasibility.avg_snr,
                    unit: "dB",
                    percent: snrPercent(feasibility.avg_snr ?? -20),
                    q: snrQuality(feasibility.avg_snr ?? -20),
                  },
                ].map(({ label, value, unit, percent, q }) => (
                  <div key={label} className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="text-medium-emphasis small">
                        {label}
                      </span>
                      <span className="small font-monospace fw-semibold">
                        {value !== undefined ? value : "—"} {unit}
                        &nbsp;
                        <CBadge color={q.color} shape="rounded-pill">
                          {q.label}
                        </CBadge>
                      </span>
                    </div>
                    <CProgress
                      value={percent}
                      color={q.color}
                      height={5}
                      style={{ borderRadius: 4 }}
                    />
                  </div>
                ))}
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        {/* ── robot readings ───────────────────────────────────────────── */}
        <CCard className="mb-3">
          <CCardHeader className="py-2 d-flex align-items-center gap-2">
            <CIcon icon={cilSignalCellular4} size="sm" />
            <strong className="small">Robot readings</strong>
            <CBadge color="secondary" shape="rounded-pill" className="ms-auto">
              {robot_readings.length}
            </CBadge>

            <Link
              to={`/${adminroute}/gateway-survey-dashboard/create-robot-survey/${id}`}
              className="btn btn-sm btn-primary"
            >
              Add New Location
            </Link>
          </CCardHeader>
          <CCardBody className="p-0">
            {robot_readings.length === 0 ? (
              <p className="text-medium-emphasis small p-3 mb-0">
                No readings captured yet.
              </p>
            ) : (
              robot_readings.map((r, i) => {
                const rQ = rssiQuality(r.rssi);
                const sQ = snrQuality(r.snr);
                return (
                  <div
                    key={r._id?.$oid ?? i}
                    className="p-3"
                    style={{
                      borderBottom:
                        i < robot_readings.length - 1
                          ? "1px solid var(--cui-border-color-translucent)"
                          : "none",
                    }}
                  >
                    <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                      <CBadge
                        color="secondary"
                        shape="rounded-pill"
                        style={{ minWidth: 22, fontSize: 11 }}
                      >
                        {i + 1}
                      </CBadge>
                      <CBadge color="info" shape="rounded-pill">
                        {r.robot_no}
                      </CBadge>
                      <span className="text-medium-emphasis small ms-auto">
                        <CIcon icon={cilClock} size="sm" className="me-1" />
                        {formatDate(r.captured_at)}
                      </span>
                    </div>

                    <p className="font-monospace small text-medium-emphasis mb-2">
                      <CIcon icon={cilLocationPin} size="sm" className="me-1" />
                      {formatCoords(r.location?.coordinates)}
                    </p>

                    <CRow className="g-2">
                      {[
                        {
                          label: "RSSI",
                          value: r.rssi,
                          unit: "dBm",
                          percent: rssiPercent(r.rssi),
                          q: rQ,
                        },
                        {
                          label: "SNR",
                          value: parseFloat(r.snr).toFixed(1),
                          unit: "dB",
                          percent: snrPercent(r.snr),
                          q: sQ,
                        },
                      ].map(({ label, value, unit, percent, q }) => (
                        <CCol xs={6} key={label}>
                          <div
                            className="p-2"
                            style={{
                              background: "var(--cui-secondary-bg)",
                              borderRadius: 8,
                            }}
                          >
                            <div
                              className="text-medium-emphasis small text-uppercase mb-1"
                              style={{ letterSpacing: "0.06em" }}
                            >
                              {label}
                            </div>
                            <div className="fs-5 fw-semibold font-monospace">
                              {value}
                              <span className="text-medium-emphasis small ms-1">
                                {unit}
                              </span>
                            </div>
                            <CProgress
                              value={percent}
                              color={q.color}
                              height={4}
                              className="mt-2"
                              style={{ borderRadius: 4 }}
                            />
                            <CBadge color={q.color} className="mt-1">
                              {q.label}
                            </CBadge>
                          </div>
                        </CCol>
                      ))}
                    </CRow>
                  </div>
                );
              })
            )}
          </CCardBody>
        </CCard>

        {/* ── last activity ────────────────────────────────────────────── */}

        {last_activity.length === 0 ? (
          <p className="text-medium-emphasis small p-3 mb-0">
            No activity recorded.
          </p>
        ) : (
          // last_activity.map((act, i) => (
          //   <div
          //     key={act.id?.$oid ?? i}
          //     className="d-flex align-items-start gap-3 p-3"
          //     style={{
          //       borderBottom:
          //         i < last_activity.length - 1
          //           ? "1px solid var(--cui-border-color-translucent)"
          //           : "none",
          //     }}
          //   >
          //     <CAvatar
          //       src={act.profile_image}
          //       name={act.name}
          //       size="md"
          //       color="info"
          //       textColor="white"
          //     >
          //       {!act.profile_image && initials(act.name)}
          //     </CAvatar>

          //     <div className="flex-grow-1 min-width-0">
          //       <div className="fw-semibold small">{act.name}</div>
          //       <div className="text-medium-emphasis small">
          //         {act.details}
          //       </div>
          //       <div
          //         className="text-medium-emphasis"
          //         style={{ fontSize: 11 }}
          //       >
          //         <CIcon icon={cilClock} size="sm" className="me-1" />
          //         {formatDate(act.timestamp)}
          //         &nbsp;·&nbsp;
          //         {act.email}
          //       </div>
          //     </div>

          //     <CBadge
          //       color="success"
          //       shape="rounded-pill"
          //       className="flex-shrink-0"
          //     >
          //       <CIcon icon={cilCheck} size="sm" className="me-1" />
          //       done
          //     </CBadge>
          //   </div>
          // ))

          <LastActivity lastactivity={last_activity} />
        )}
      </CCol>
    </CRow>
  );
};

export default ViewGatewaySurvey;
