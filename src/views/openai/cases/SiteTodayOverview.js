import React, { useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CBadge,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CTabPanel,
  CTabs,
  CTab,
  CRow,
  CCol,
  CTabList,
  CTabContent,
  CFormInput,
} from "@coreui/react";

const formatTime = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleTimeString();
};

const StatBadge = ({ label, value, color }) => (
  <div
    style={{
      background: "var(--cui-card-bg, #1e1e2d)",
      borderRadius: "10px",
      padding: "10px 5px",
      textAlign: "center",
      boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
      border: "1px solid rgba(255,255,255,0.05)",
      transition: "all 0.2s ease",
    }}
  >
    <div
      style={{
        fontSize: "22px",
        fontWeight: "600",
        marginBottom: "6px",
      }}
    >
      <CBadge color={color} style={{ fontSize: "16px", padding: "6px 10px" }}>
        {value}
      </CBadge>
    </div>

    <div
      style={{
        fontSize: "12px",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        opacity: 0.7,
      }}
    >
      {label}
    </div>
  </div>
);
const SiteTodayOverview = ({ data }) => {
  const [searchInprogress, setSearchInprogress] = useState("");
  const [searchCompleted, setSearchCompleted] = useState("");
  const [searchFailed, setSearchFailed] = useState("");
  const [searchOffline, setSearchOffline] = useState("");

  if (!data) return null;

  const {
    site_id,
    total_robots,
    offline_count,
    offline_robots,
    online_robots,
    today,
  } = data;
  console.log(today);
  const failure = today?.failure_count || 0;
  const inprogress_robots = today?.inprogress_robots || 0;

  // 🔎 Filtered Robots
  const filteredCompletedRobots = today?.completed_robots?.filter((robot) =>
    robot.robot_no.toLowerCase().includes(searchCompleted.toLowerCase()),
  );
  const filteredFailedRobots = today?.failed_robots?.filter((robot) =>
    robot.robot_no.toLowerCase().includes(searchFailed.toLowerCase()),
  );

  const filteredInprogressRobots = today?.inprogress_robots?.filter((robot) =>
    robot.robot_no.toLowerCase().includes(searchInprogress.toLowerCase()),
  );
  const filteredOfflineRobots = offline_robots?.filter((robot) =>
    robot.robot_no.toLowerCase().includes(searchOffline.toLowerCase()),
  );

  console.log(filteredOfflineRobots);

  return (
    <CCard className="shadow-sm border-0">
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <div>
          <strong>{site_id}</strong>
          <div style={{ fontSize: 12, color: "#6c757d" }}>
            Site Operational Summary
          </div>
        </div>

        <CBadge color={offline_count > 0 ? "danger" : "success"}>
          {offline_count > 0 ? "Issues Present" : "All Systems Normal"}
        </CBadge>
      </CCardHeader>

      <CCardBody>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
            gap: "12px",
            marginBottom: "1rem",
          }}
        >
          <StatBadge label="Total" value={total_robots} color="primary" />
          <StatBadge label="Online" value={online_robots} color="success" />
          <StatBadge label="Offline" value={offline_count} color="danger" />
          <StatBadge
            label="Completed"
            value={today?.completed_robots?.length || 0}
            color="success"
          />
          <StatBadge
            label="Inprogress"
            value={inprogress_robots.length}
            color="warning"
          />
          <StatBadge label="Failures" value={failure} color="warning" />
        </div>

        {/* STATUS TABS */}
        <CTabs activeItemKey="completed" className="mt-3">
          <CTabList variant="tabs">
            <CTab itemKey="completed">
              Completed ({today?.completed_robots?.length || 0})
            </CTab>

            <CTab itemKey="inprogress">
              In Progress ({filteredInprogressRobots.length})
            </CTab>

            <CTab itemKey="failed">Failed ({filteredFailedRobots.length})</CTab>

            {filteredOfflineRobots?.length > 0 && (
              <CTab itemKey="offline">
                Offline ({filteredOfflineRobots.length})
              </CTab>
            )}
          </CTabList>
          <CTabContent>
            {/* COMPLETED TAB */}
            <CTabPanel itemKey="completed">
              <CRow className="mb-3 d-flex justify-content-end align-items-center mt-2 ">
                <CCol md={4}>
                  <CFormInput
                    placeholder="Search Robot No..."
                    value={searchCompleted}
                    onChange={(e) => setSearchCompleted(e.target.value)}
                  />
                </CCol>
              </CRow>

              <div style={{ maxHeight: 350, overflowY: "auto" }}>
                <CTable striped hover responsive small>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>#</CTableHeaderCell>
                      <CTableHeaderCell>Robot No</CTableHeaderCell>
                      <CTableHeaderCell>Block</CTableHeaderCell>
                      <CTableHeaderCell>Start Time</CTableHeaderCell>
                      <CTableHeaderCell>Start Battery</CTableHeaderCell>
                      <CTableHeaderCell>Finish Time</CTableHeaderCell>
                      <CTableHeaderCell>Finish Battery</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {filteredCompletedRobots?.map((robot, i) => (
                      <CTableRow key={robot.robot_no}>
                        <CTableDataCell>{i + 1}</CTableDataCell>
                        <CTableDataCell>
                          <CBadge color="success">{robot.robot_no}</CBadge>
                        </CTableDataCell>
                        <CTableDataCell>{robot.block}</CTableDataCell>
                        <CTableDataCell>
                          {formatTime(robot.start_time)}
                        </CTableDataCell>
                        <CTableDataCell>
                          {robot.start_battery || "Watining for Battery Status"}
                        </CTableDataCell>
                        <CTableDataCell>
                          {formatTime(robot.finish_time)}
                        </CTableDataCell>
                        <CTableDataCell>
                          {robot.finish_battery ||
                            "Watining for Battery Status"}
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              </div>
            </CTabPanel>

            {/* IN PROGRESS TAB */}
            <CTabPanel itemKey="inprogress">
              <CRow className="mb-3 d-flex justify-content-end align-items-center mt-2 ">
                <CCol md={4}>
                  <CFormInput
                    placeholder="Search Robot No..."
                    value={searchInprogress}
                    onChange={(e) => setSearchInprogress(e.target.value)}
                  />
                </CCol>
              </CRow>
              <div style={{ maxHeight: 350, overflowY: "auto" }}>
                <CTable striped hover responsive small>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>#</CTableHeaderCell>
                      <CTableHeaderCell>Robot No</CTableHeaderCell>
                      <CTableHeaderCell>Block</CTableHeaderCell>
                      <CTableHeaderCell>Start Time</CTableHeaderCell>
                      <CTableHeaderCell>Status</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {filteredInprogressRobots.map((robot, i) => (
                      <CTableRow key={robot.robot_no}>
                        <CTableDataCell>{i + 1}</CTableDataCell>
                        <CTableDataCell>
                          <CBadge color="warning">{robot.robot_no}</CBadge>
                        </CTableDataCell>
                        <CTableDataCell>{robot.block}</CTableDataCell>
                        <CTableDataCell>
                          {formatTime(robot.start_time)}
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge color="warning">In Progress</CBadge>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              </div>
            </CTabPanel>

            {/* FAILED TAB */}
            <CTabPanel itemKey="failed">
              <CRow className="mb-3 d-flex justify-content-end align-items-center mt-2 ">
                <CCol md={4}>
                  <CFormInput
                    placeholder="Search Robot No..."
                    value={searchFailed}
                    onChange={(e) => setSearchFailed(e.target.value)}
                  />
                </CCol>
              </CRow>
              <div style={{ maxHeight: 350, overflowY: "auto" }}>
                <CTable striped hover responsive small>
                  <CTableHead color="danger">
                    <CTableRow>
                      <CTableHeaderCell>#</CTableHeaderCell>
                      <CTableHeaderCell>Robot No</CTableHeaderCell>
                      <CTableHeaderCell>Block</CTableHeaderCell>
                      <CTableHeaderCell>Start Time</CTableHeaderCell>
                      <CTableHeaderCell>Failure Time</CTableHeaderCell>
                      <CTableHeaderCell>Failure Type</CTableHeaderCell>
                      <CTableHeaderCell>Comments</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {filteredFailedRobots.map((robot, i) => (
                      <CTableRow key={robot.robot_no}>
                        <CTableDataCell>{i + 1}</CTableDataCell>
                        <CTableDataCell>
                          <CBadge color="danger">{robot.robot_no}</CBadge>
                        </CTableDataCell>
                        <CTableDataCell>{robot.block}</CTableDataCell>
                        <CTableDataCell>
                          {formatTime(robot.start_time)}
                        </CTableDataCell>

                        <CTableDataCell>
                          {robot.battery_dead && (
                            <>{formatTime(robot.battery_dead_at)}</>
                          )}
                          {robot.cleaning_cancelled && (
                            <>{formatTime(robot.cleaning_cancelled_at)}</>
                          )}
                        </CTableDataCell>

                        <CTableDataCell>
                          {robot.battery_dead && (
                            <>
                              <CBadge color="danger" className="me-2">
                                Battery Dead
                              </CBadge>
                            </>
                          )}
                          {robot.cleaning_cancelled && (
                            <>
                              <CBadge color="warning">Cancelled</CBadge>
                            </>
                          )}
                        </CTableDataCell>
                        <CTableDataCell>{robot.comments || "—"}</CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              </div>
            </CTabPanel>

            {/* OFFLINE TAB */}
            {filteredOfflineRobots?.length > 0 && (
              <CTabPanel itemKey="offline">
                <CRow className="mb-3 d-flex justify-content-end align-items-center mt-2 ">
                  <CCol md={4}>
                    <CFormInput
                      placeholder="Search Robot No..."
                      value={searchOffline}
                      onChange={(e) => setSearchOffline(e.target.value)}
                    />
                  </CCol>
                </CRow>
                <div style={{ maxHeight: 350, overflowY: "auto" }}>
                  <CTable striped hover responsive small>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>#</CTableHeaderCell>
                        <CTableHeaderCell>Robot No</CTableHeaderCell>
                        <CTableHeaderCell>Block</CTableHeaderCell>
                        <CTableHeaderCell>Last Uplink</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {filteredOfflineRobots.map((robot, i) => (
                        <CTableRow key={robot.robot_no}>
                          <CTableDataCell>{i + 1}</CTableDataCell>
                          <CTableDataCell>
                            <CBadge color="danger">{robot.robot_no}</CBadge>
                          </CTableDataCell>
                          <CTableDataCell>{robot.block || "NA"}</CTableDataCell>
                          <CTableDataCell>
                            {robot.last_uplink
                              ? new Date(robot.last_uplink).toLocaleString(
                                  "en-IN",
                                  {
                                    timeZone: "Asia/Kolkata",
                                  },
                                )
                              : "NA"}
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                </div>
              </CTabPanel>
            )}
          </CTabContent>
        </CTabs>
        <span color="danger">{data.azureai}</span>
      </CCardBody>
    </CCard>
  );
};

export default SiteTodayOverview;
