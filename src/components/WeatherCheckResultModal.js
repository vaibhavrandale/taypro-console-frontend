import React, { useEffect, useState } from "react";
import {
  CAlert,
  CBadge,
  CButton,
  CCol,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CTab,
  CTabContent,
  CTabList,
  CTabPanel,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTabs,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilWarning } from "@coreui/icons";

const formatWeatherValue = (row) => {
  if (row.field === "is_rain") return row.current ? "Yes" : "No";
  if (row.current == null || row.current === "") return "—";
  if (row.unit) return `${row.current}${row.unit}`;
  return String(row.current);
};

const formatWeatherLimit = (row) => {
  if (row.field === "is_rain") return "Must be No";
  if (row.field === "description") return row.limit || "No rain keywords";
  if (row.limit == null || row.limit === "") return "—";
  if (row.rule === "min") return `Min ${row.limit}${row.unit || ""}`;
  if (row.unit) return `Max ${row.limit}${row.unit}`;
  return String(row.limit);
};

// Keep in sync with utility/weatherHelper.js weatherCheckForRobot thresholds
export const WEATHER_THRESHOLD_REASONS = [
  {
    field: "temperature",
    label: "Temperature ≤ 45°C",
    reason:
      "High panel/ambient heat stresses motors, batteries, and electronics. Above ~45°C cleaning runs risk overheating and thermal cutouts.",
  },
  {
    field: "humidity",
    label: "Humidity ≤ 75%",
    reason:
      "Very high humidity with dust forms sticky film on panels and can leave residue after wet cleaning. It also increases condensation risk on electronics.",
  },
  {
    field: "wind_speed",
    label: "Wind speed ≤ 20 m/s",
    reason:
      "Strong wind can sway the robot on the row, reduce brush contact quality, and in extreme cases risk derailment or unstable docking.",
  },
  {
    field: "cloudiness",
    label: "Cloudiness ≤ 70%",
    reason:
      "Heavy cloud cover often precedes rain or storms. We treat high cloudiness as an early weather-risk signal before rain flags flip.",
  },
  {
    field: "pressure",
    label: "Pressure ≥ 1005 hPa",
    reason:
      "Falling / low pressure commonly indicates an approaching weather system (rain or storm). Low pressure is used as a precautionary block.",
  },
  {
    field: "is_rain",
    label: "No rain (is_rain = false)",
    reason:
      "Cleaning during rain is unsafe and ineffective — water + dust, slip risk on rails, and possible electrical/sensor issues. Commands stay blocked while rain is active.",
  },
  {
    field: "description",
    label: "Description has no rain keywords",
    reason:
      'OpenWeather text like "rain", "shower", "drizzle", or "thunderstorm" means precipitation is present or imminent even if the boolean flag lags. We block on those keywords too.',
  },
];

const WeatherCheckResultModal = ({ visible, onClose, weatherError }) => {
  const [activeTab, setActiveTab] = useState("results");

  useEffect(() => {
    if (visible) setActiveTab("results");
  }, [visible]);

  return (
    <CModal
      visible={visible}
      onClose={onClose}
      alignment="center"
      // fullscreen
      backdrop="static"
      size="lg"
      scrollable
    >
      <CModalHeader closeButton={false}>
        <CModalTitle className="d-flex align-items-center gap-2">
          <CIcon icon={cilWarning} className="text-warning" />
          Weather check failed
        </CModalTitle>
      </CModalHeader>

      <CModalBody>
        <CTabs activeItemKey={activeTab} onChange={(key) => setActiveTab(key)}>
          <CTabList variant="tabs" className="mb-3">
            <CTab itemKey="results">Check results</CTab>
            <CTab itemKey="why">Why these thresholds</CTab>
          </CTabList>

          <CTabContent>
            <CTabPanel itemKey="results" className="pt-2">
              <p className="text-muted small mb-3">
                To send a command,{" "}
                <span className="text-body">
                  all {weatherError?.total_checks ?? 0} weather checks must pass
                </span>{" "}
                (0 failed). Right now{" "}
                <span className="text-success">
                  {weatherError?.passed_count ?? 0} passed
                </span>{" "}
                and{" "}
                <span className="text-warning">
                  {weatherError?.failed_count ?? 0} failed
                </span>
                .
              </p>

              <CRow className="g-2 mb-3">
                <CCol xs={4} md={3}>
                  <div
                    className="rounded p-2 text-center h-100"
                    style={{ background: "var(--cui-tertiary-bg)" }}
                  >
                    <div className="small text-muted">Failed</div>
                    <div className="fw-bold text-warning fs-4">
                      {weatherError?.failed_count ?? 0}
                    </div>
                  </div>
                </CCol>
                <CCol xs={4} md={3}>
                  <div
                    className="rounded p-2 text-center h-100"
                    style={{ background: "var(--cui-tertiary-bg)" }}
                  >
                    <div className="small text-muted">Passed</div>
                    <div className="fw-bold text-success fs-4">
                      {weatherError?.passed_count ?? 0}
                    </div>
                  </div>
                </CCol>
                <CCol xs={4} md={3}>
                  <div
                    className="rounded p-2 text-center h-100"
                    style={{ background: "var(--cui-tertiary-bg)" }}
                  >
                    <div className="small text-muted">Must pass</div>
                    <div className="fw-bold fs-4">
                      {weatherError?.total_checks ?? 0}/
                      {weatherError?.total_checks ?? 0}
                    </div>
                  </div>
                </CCol>
              </CRow>

              <CAlert color="danger" className="py-2 mb-3 text-center">
                {weatherError?.message ||
                  "Command blocked due to unsafe weather conditions."}
              </CAlert>

              <CTable
                bordered
                hover
                responsive
                align="middle"
                className="mb-0"
                small
              >
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Sr</CTableHeaderCell>
                    <CTableHeaderCell>Check</CTableHeaderCell>
                    <CTableHeaderCell>Current</CTableHeaderCell>
                    <CTableHeaderCell>Limit</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {[...(weatherError?.checks || [])]
                    .sort((a, b) => Number(a.passed) - Number(b.passed))
                    .map((row, index) => (
                      <CTableRow key={row.field}>
                        <CTableDataCell>{index + 1}</CTableDataCell>
                        <CTableDataCell>
                          <div>{row.label || row.field}</div>
                          {!row.passed && row.message ? (
                            <div className="text-warning mt-1 fst-italic small">
                              {row.message}
                            </div>
                          ) : null}
                        </CTableDataCell>
                        <CTableDataCell className="fw-semibold">
                          {formatWeatherValue(row)}
                        </CTableDataCell>
                        <CTableDataCell className="text-muted">
                          {formatWeatherLimit(row)}
                        </CTableDataCell>
                        <CTableDataCell>
                          {row.passed ? (
                            <CBadge color="success" shape="rounded-pill">
                              Passed
                            </CBadge>
                          ) : (
                            <CBadge color="danger" shape="rounded-pill">
                              Failed
                            </CBadge>
                          )}
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                </CTableBody>
              </CTable>
            </CTabPanel>

            <CTabPanel itemKey="why" className="pt-2">
              <p className="text-muted mb-3">
                These limits gate intelligent / weather-checked start so the
                robot only runs when conditions are safe for cleaning hardware
                and effective for soiling removal.
              </p>
              <CTable bordered responsive align="middle" small>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell style={{ width: "28%" }}>
                      Threshold
                    </CTableHeaderCell>
                    <CTableHeaderCell>Why we set it</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {WEATHER_THRESHOLD_REASONS.map((item) => (
                    <CTableRow key={item.field}>
                      <CTableDataCell className="fw-semibold">
                        {item.label}
                      </CTableDataCell>
                      <CTableDataCell className="text-muted">
                        {item.reason}
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CTabPanel>
          </CTabContent>
        </CTabs>
      </CModalBody>

      <CModalFooter>
        <CButton color="secondary" size="sm" onClick={onClose}>
          Close
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default WeatherCheckResultModal;
