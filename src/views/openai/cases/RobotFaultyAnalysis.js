import React from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CBadge,
  CAlert,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableDataCell,
  CTableHeaderCell,
  CTabContent,
  CTabPanel,
  CTabs,
  CTabList,
  CTab,
  CAvatar,
} from "@coreui/react";
import BatteryGraph from "./BatteryGraph";

const formatValue = (value) =>
  value === null || value === undefined || value === "" ? "NA" : value;

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      })
    : "NA";

const RobotFaultyAnalysis = ({ data }) => {
  if (!data) return null;

  const isOnline = data.online;
  const cleaning = data.latest_tracking?.cleaning;

  return (
    <CCard
      className="mb-4 shadow-lg border-0"
      style={{
        background: "#1e1e2f",
        color: "#e4e6eb",
        borderRadius: "12px",
      }}
    >
      {/* ===== HEADER ===== */}
      <CCardHeader
        className="d-flex justify-content-between align-items-center"
        style={{
          background: isOnline ? "#198754" : "#dc3545",
          color: "white",
        }}
      >
        <strong>{data.robot_no}</strong>

        <div>
          <CBadge
            color={data.severity === "High" ? "danger" : "warning"}
            className="me-2 px-3 py-2"
          >
            {data.severity}
          </CBadge>

          <CBadge color={isOnline ? "success" : "danger"} className="px-3 py-2">
            {isOnline ? "ONLINE" : "OFFLINE"}
          </CBadge>
        </div>
      </CCardHeader>

      <CCardBody>
        {/* ===== BASIC STATUS ===== */}
        <CRow className="mb-4 text-center">
          <CCol md={6}>
            <div className="p-3 rounded bg-dark bg-opacity-50">
              <div className="small text-muted">Last Uplink</div>
              <div className="fw-bold">{formatDate(data.last_uplink)}</div>
            </div>
          </CCol>

          <CCol md={6}>
            <div className="p-3 rounded bg-dark bg-opacity-50">
              <div className="d-flex justify-content-center align-items-center">
                <div className="small text-muted me-2">Gateway</div>

                <CBadge
                  color={data.gateway?.gateway_status ? "success" : "danger"}
                >
                  {data.gateway?.gateway_name}
                </CBadge>
              </div>
              <div className="d-flex justify-content-center align-items-center">
                <div className="fw-bold me-2">
                  <CBadge
                    color={data.gateway?.gateway_status ? "success" : "danger"}
                  >
                    {data.gateway?.gateway_status ? "Online" : "Offline"}
                  </CBadge>
                </div>
                -
                <div className="fw-bold ms-2">
                  {formatDate(data.gateway?.gateway_last_uplink)}
                </div>
              </div>
            </div>
          </CCol>

          {/* <CCol md={4}>
            <div className="p-3 rounded bg-dark bg-opacity-50">
              <div className="small text-muted">Last Tracking</div>
              <div className="fw-bold">
                {formatDate(data.latest_tracking?.updatedAt)}
              </div>
            </div>
          </CCol> */}
        </CRow>
        {cleaning && (
          <CCard className="mb-4 border-0" style={{ background: "#25263b" }}>
            <CCardHeader className="border-0 text-light fw-semibold">
              Last Cleaning Overview
            </CCardHeader>
            <CCardBody>
              <CTable
                hover
                responsive
                bordered
                align="middle"
                className="text-light"
                style={{ background: "#1e1e2f" }}
              >
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Metric</CTableHeaderCell>
                    <CTableHeaderCell>Value</CTableHeaderCell>
                    <CTableHeaderCell>Timestamp</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  <CTableRow>
                    <CTableDataCell>Started</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={cleaning.start ? "success" : "danger"}>
                        {cleaning.start ? "Yes" : "No"}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell>
                      {formatDate(cleaning.startAt)}
                    </CTableDataCell>
                  </CTableRow>

                  <CTableRow>
                    <CTableDataCell>Finished</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={cleaning.finish ? "success" : "danger"}>
                        {cleaning.finish ? "Yes" : "No"}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell>
                      {formatDate(cleaning.finishAt)}
                    </CTableDataCell>
                  </CTableRow>

                  <CTableRow>
                    <CTableDataCell>Battery Before Cleaning (%)</CTableDataCell>
                    <CTableDataCell className="fw-bold text-success">
                      {formatValue(cleaning.battery_before_cleaning)} %
                    </CTableDataCell>
                    <CTableDataCell>
                      {formatDate(cleaning.battery_before_cleaning_received_at)}
                    </CTableDataCell>
                  </CTableRow>

                  <CTableRow>
                    <CTableDataCell>Battery After Cleaning (%)</CTableDataCell>
                    <CTableDataCell className="fw-bold">
                      {formatValue(cleaning.battery_after_cleaning)} %
                    </CTableDataCell>
                    <CTableDataCell>
                      {formatDate(cleaning.battery_after_cleaning_received_at)}
                    </CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        )}
        <CTabs activeItemKey="debug-logs" className="mt-3">
          <CTabList variant="tabs">
            <CTab itemKey="debug-logs">Debug Logs</CTab>

            <CTab itemKey="cleaning-logs">Raw Cleaning Logs</CTab>
            <CTab itemKey="robot-commands">Last Robot Commands</CTab>
            <CTab itemKey="last-ten-day-cleaning">Last 10 days cleaning</CTab>
            <CTab itemKey="service-tickets">Service Tickets</CTab>
          </CTabList>
          <CTabContent>
            {/* COMPLETED TAB */}
            <CTabPanel itemKey="debug-logs">
              <CTable hover responsive small className="text-light">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Sr</CTableHeaderCell>
                    <CTableHeaderCell>Time</CTableHeaderCell>
                    <CTableHeaderCell>Topic</CTableHeaderCell>
                    <CTableHeaderCell>Data</CTableHeaderCell>
                    <CTableHeaderCell>RSSI</CTableHeaderCell>
                    <CTableHeaderCell>SNR</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {data.debug_logs.length > 0 ? (
                    data.debug_logs?.map((log, idx) => (
                      <CTableRow key={log._id}>
                        <CTableDataCell>{idx + 1}</CTableDataCell>
                        <CTableDataCell>
                          {formatDate(log.createdAt)}
                        </CTableDataCell>

                        <CTableDataCell>{log.topic}</CTableDataCell>
                        <CTableDataCell>{log.data}</CTableDataCell>
                        <CTableDataCell>{log.rssi}</CTableDataCell>
                        <CTableDataCell>{log.snr}</CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan={6} className="text-center">
                        No Logs Found
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </CTabPanel>
            <CTabPanel itemKey="cleaning-logs">
              <CTable hover responsive small className="text-light">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Sr</CTableHeaderCell>
                    <CTableHeaderCell>Time</CTableHeaderCell>
                    <CTableHeaderCell>Topic</CTableHeaderCell>
                    <CTableHeaderCell>Data</CTableHeaderCell>
                    <CTableHeaderCell>RSSI</CTableHeaderCell>
                    <CTableHeaderCell>SNR</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {data.raw_cleaning_logs.length > 0 ? (
                    data.raw_cleaning_logs?.map((log, idx) => (
                      <CTableRow key={log._id}>
                        <CTableDataCell>{idx + 1}</CTableDataCell>
                        <CTableDataCell>
                          {formatDate(log.createdAt)}
                        </CTableDataCell>
                        <CTableDataCell>{log.topic}</CTableDataCell>
                        <CTableDataCell>{log.data}</CTableDataCell>
                        <CTableDataCell>{log.rssi}</CTableDataCell>
                        <CTableDataCell>{log.snr}</CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan={6} className="text-center">
                        No Logs Found
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </CTabPanel>

            <CTabPanel itemKey="robot-commands">
              <CTable hover responsive small className="text-light">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Sr</CTableHeaderCell>
                    <CTableHeaderCell>Command</CTableHeaderCell>
                    <CTableHeaderCell>Name</CTableHeaderCell>
                    <CTableHeaderCell>Email</CTableHeaderCell>
                    <CTableHeaderCell>Timestamp</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {data.robot_commands.length > 0 ? (
                    data.robot_commands?.map((log, idx) => (
                      <CTableRow key={log._id}>
                        <CTableDataCell>{idx + 1}</CTableDataCell>
                        <CTableDataCell>
                          {log.command === "11" ||
                          log.command === "Cleaning Start" ? (
                            <CBadge color="success">Cleaning Start</CBadge>
                          ) : log.command === "14" ||
                            log.command === "Cleaning Stop" ? (
                            <CBadge color="danger"> Cleaning Stop</CBadge>
                          ) : log.command === "15" ? (
                            <CBadge color="secondary">Return To Dock</CBadge>
                          ) : (
                            <CBadge color="secondary">{log.command}</CBadge>
                          )}
                        </CTableDataCell>
                        <CTableDataCell>
                          {log.last_activity?.name}
                        </CTableDataCell>
                        <CTableDataCell>
                          {log.last_activity?.email}
                        </CTableDataCell>
                        <CTableDataCell>
                          {formatDate(log.createdAt)}
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan={6} className="text-center">
                        No command Found
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </CTabPanel>
            <CTabPanel itemKey="last-ten-day-cleaning">
              <CTable hover responsive small className="text-light">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Sr</CTableHeaderCell>
                    <CTableHeaderCell>Start Time</CTableHeaderCell>
                    <CTableHeaderCell>Finish Time</CTableHeaderCell>
                    <CTableHeaderCell>Start Battery</CTableHeaderCell>
                    <CTableHeaderCell>Finish Battery</CTableHeaderCell>
                    <CTableHeaderCell>Is Completed</CTableHeaderCell>
                    <CTableHeaderCell>comments</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {data.last_ten_days_cleaning.length > 0 ? (
                    data.last_ten_days_cleaning?.map((log, idx) => (
                      <CTableRow key={log._id}>
                        <CTableDataCell>{idx + 1}</CTableDataCell>
                        <CTableDataCell>
                          {log.cleaning.start
                            ? formatDate(log.cleaning?.startAt)
                            : "NA"}
                        </CTableDataCell>
                        <CTableDataCell>
                          {log.cleaning?.finish
                            ? formatDate(log.cleaning?.finishAt)
                            : "NA"}
                        </CTableDataCell>
                        <CTableDataCell>
                          {log.cleaning?.battery_before_cleaning || "N/A"}
                        </CTableDataCell>
                        <CTableDataCell>
                          {log.cleaning?.battery_after_cleaning || "N/A"}
                        </CTableDataCell>
                        <CTableDataCell>
                          {log.cleaning?.finish ? (
                            <CBadge color="success">YES</CBadge>
                          ) : (
                            <CBadge color="danger">NO</CBadge>
                          )}
                        </CTableDataCell>
                        <CTableDataCell>
                          {log.cleaning?.start &&
                          !log.cleaning?.finish &&
                          !log.cleaning?.battery_dead &&
                          !log.cleaning?.cleaning_cancelled ? (
                            <CBadge color="warning">
                              Cleaning In Progress
                            </CBadge>
                          ) : (
                            log.comments
                          )}
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan={6} className="text-center">
                        No Logs Found
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </CTabPanel>
            <CTabPanel itemKey="service-tickets">
              <CTable hover responsive small className="text-light">
                <CTableHead>
                  <CTableRow className="text-center">
                    <CTableHeaderCell>Sr</CTableHeaderCell>
                    <CTableHeaderCell>Ticket No</CTableHeaderCell>
                    <CTableHeaderCell>Robot No</CTableHeaderCell>
                    <CTableHeaderCell>Block</CTableHeaderCell>
                    <CTableHeaderCell>Fault Type</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Created At</CTableHeaderCell>
                    <CTableHeaderCell>Created By</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {data.service_tickets.length > 0 ? (
                    data.service_tickets?.map((log, idx) => (
                      <CTableRow key={log._id} className="text-center">
                        <CTableDataCell>{idx + 1}</CTableDataCell>
                        <CTableDataCell>{log.ticket_id}</CTableDataCell>
                        <CTableDataCell>{log.robot_no}</CTableDataCell>
                        <CTableDataCell>{log.block}</CTableDataCell>
                        <CTableDataCell>{log.fault_type}</CTableDataCell>
                        <CTableDataCell>
                          {log.ticket_resolved ? (
                            <div className="d-flex flex-column justify-content-center align-items-center">
                              <CBadge color="success">Resolved</CBadge>
                              <span className="small">
                                {formatDate(log.ticket_resolved_at)}
                              </span>
                            </div>
                          ) : (
                            <CBadge color="warning">Pending</CBadge>
                          )}
                        </CTableDataCell>

                        <CTableDataCell>
                          {formatDate(log.createdAt)}
                        </CTableDataCell>
                        <CTableDataCell>
                          {log.last_activity && log.last_activity.length > 0 ? (
                            <div className="d-flex align-items-center justify-content-start gap-3">
                              <CAvatar
                                size="md"
                                src={log.last_activity[0]?.profile_image || ""}
                              />

                              <div className="text-start">
                                <div className="fw-semibold">
                                  {log.last_activity[0]?.name || "Unknown User"}
                                </div>
                                <div className="small text-medium-emphasis">
                                  {log.last_activity[0]?.email || "-"}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <span className="text-medium-emphasis small">
                              No Activity
                            </span>
                          )}
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan={6} className="text-center">
                        No Logs Found
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </CTabPanel>
          </CTabContent>
        </CTabs>
        {data.battery_debug_logs.length > 0 && (
          <BatteryGraph data={data.battery_debug_logs} />
        )}

        {/* ===== AI ANALYSIS ===== */}
        <CAlert
          color="info"
          className="mt-4"
          style={{ background: "#2c2f48", color: "#e4e6eb" }}
        >
          <strong>AI Analysis</strong>
          <div className="mt-2">{data.analysis}</div>
        </CAlert>

        {/* ===== RECOMMENDATION ===== */}
        <div className="mt-3">
          <strong>Recommendation</strong>
          <ul>
            {data.recommendations?.length ? (
              data.recommendations.map((rec, i) => <li key={i}>{rec}</li>)
            ) : (
              <li>NA</li>
            )}
          </ul>
        </div>
      </CCardBody>
    </CCard>
  );
};

export default RobotFaultyAnalysis;
