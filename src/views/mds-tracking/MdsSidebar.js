import React, { useState } from "react";
import {
  COffcanvas,
  COffcanvasHeader,
  COffcanvasTitle,
  COffcanvasBody,
  CBadge,
  CCard,
  CCardBody,
  CTable,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CTableHead,
} from "@coreui/react";
import { cilX } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
// import RobotLastActivity from "../robot-position/RobotLastActivity";
// import CleaningStatusCard from "../robot-position/CleaningStatusCard";
// import BatteryStatusCard from "../robot-position/BatteryStatusCard";
import {
  // getRobotPhase,
  RowsTabs,
} from "./mdsTrackingHelper";
import MdsStatusOverviewCard from "./MdsStatusOverviewCard";
import MdsPositionInformationCard from "./MdsPositionInformationCard";

const MdsSideBar = ({
  mds,
  deleteHandler,
  loadingDelete,
  visible,
  onClose,
  userInfo,
}) => {
  const [activeTab, setActiveTab] = useState(0); // For row tabs

  if (!mds) {
    return null;
  }

  // Utility function to format time
  const formatTime = (totalSec) => {
    if (!totalSec || isNaN(totalSec)) return "N/A";

    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;

    let result = "";
    if (hours > 0) result += `${hours}h `;
    if (minutes > 0) result += `${minutes}m `;
    if (seconds > 0) result += `${seconds}s`;

    return result.trim();
  };

  const getMdsStatusColor = () => {
    if (
      mds.default_mds_position?.mds_released &&
      !mds.default_mds_position?.mds_returned
    ) {
      return "success";
    }
    if (mds.default_mds_position?.mds_returned) {
      return "secondary";
    }
    return "warning";
  };

  const formatRelativeTime = (dateString) => {
    if (!dateString) return "N/A";
    const now = new Date();
    const then = new Date(dateString);
    const diff = Math.floor((now - then) / 1000); // seconds

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  // Format date/time
  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const activePosition = mds.mds_positions?.find((pos) => pos.active);
  // Format time only
  const formatTimeOnly = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const getMdsStatusText = () => {
    if (
      mds.default_mds_position?.mds_released &&
      !mds.default_mds_position?.mds_returned
    ) {
      return "RELEASED";
    }
    if (mds.default_mds_position?.mds_returned) {
      return "RETURNED";
    }
    return "PENDING";
  };
  const rows = mds?.rows || [];

  return (
    <COffcanvas
      placement="end"
      visible={visible}
      onHide={onClose}
      className="bg-dark text-light"
      size="xl"
      style={{
        width: "100%",
        maxWidth: window.innerWidth < 768 ? "100%" : "70%",
      }}
    >
      {/* Header */}
      <COffcanvasHeader className="">
        <COffcanvasTitle className="d-flex flex-column justify-content-start">
          <span style={{ fontSize: "15px" }}>
            📍 MDS Details -{" "}
            <CBadge color="warning" className="px-2 py-2">
              {mds.mds_no}
            </CBadge>
          </span>
          <span style={{ fontSize: "15px" }}>Doc ID: {mds._id}</span>
          <span style={{ fontSize: "15px" }}>Site: {mds.site_id}</span>
        </COffcanvasTitle>
        <button
          type="button"
          className="border-0 ms-auto py-0 px-1"
          onClick={onClose}
          style={{ background: "none" }}
        >
          <CIcon icon={cilX} size="xl" />
        </button>
      </COffcanvasHeader>
      {/* Body */}
      <COffcanvasBody className="p-1">
        {/* MDS Overview Card */}

        <MdsStatusOverviewCard
          mds={mds}
          getMdsStatusColor={getMdsStatusColor}
          getMdsStatusText={getMdsStatusText}
        />

        <MdsPositionInformationCard mds={mds} formatDateTime={formatDateTime} />

        {/* MDS Position Details */}
        {/* <CCard className="border-0 mb-3 shadow-sm bg-secondary">
          <CCardBody>
            <h5 className="text-light mb-3">
              <CIcon icon={cilLocationPin} className="me-2" />
              MDS Position Information
            </h5>

            <CTable
              responsive
              striped
              hover
              bordered
              size="sm"
              className="text-light mb-0"
            >
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell style={{ minWidth: "100px" }}>
                    Released
                  </CTableHeaderCell>
                  <CTableHeaderCell>Released At</CTableHeaderCell>
                  <CTableHeaderCell>Returned</CTableHeaderCell>
                  <CTableHeaderCell>Returned At</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow>
                  <CTableDataCell>
                    {mds.default_mds_position?.mds_released ? (
                      <CIcon
                        icon={cilCheckCircle}
                        style={{
                          color: "white",
                          background: "green",
                          borderRadius: "50%",
                        }}
                      />
                    ) : (
                      <CIcon
                        icon={cilXCircle}
                        style={{
                          color: "white",
                          background: "red",
                          borderRadius: "50%",
                        }}
                      />
                    )}
                  </CTableDataCell>
                  <CTableDataCell style={{ fontSize: "12px" }}>
                    <span className="text-success">
                      {formatDateTime(
                        mds.default_mds_position?.mds_released_at
                      )}
                    </span>
                  </CTableDataCell>
                  <CTableDataCell>
                    {mds.default_mds_position?.mds_returned ? (
                      <CIcon
                        icon={cilCheckCircle}
                        style={{
                          color: "white",
                          background: "green",
                          borderRadius: "50%",
                        }}
                      />
                    ) : (
                      <CIcon
                        icon={cilXCircle}
                        style={{
                          color: "white",
                          background: "red",
                          borderRadius: "50%",
                        }}
                      />
                    )}
                  </CTableDataCell>
                  <CTableDataCell style={{ fontSize: "12px" }}>
                    <span className="text-success">
                      {" "}
                      {formatDateTime(
                        mds.default_mds_position?.mds_returned_at
                      )}
                    </span>
                  </CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard> */}

        <CCard style={{ fontSize: "14px" }} className="border-0">
          <CCardBody className="d-flex justify-content-between">
            <span>MDS Release Status</span>
            <CBadge
              color={
                mds?.default_mds_position?.mds_released ? "success" : "warning"
              }
              style={{ fontSize: "14px" }}
            >
              {mds?.default_mds_position?.mds_released
                ? "RELEASED"
                : "NOT RELEASED"}
            </CBadge>
          </CCardBody>
        </CCard>

        {/* Row Positions Status */}
        <CCard className="border-0 mb-3 shadow-sm bg-secondary">
          <CCardBody>
            <h5 className="text-light mb-3">Row Positions Status</h5>

            {mds.mds_positions?.length > 0 ? (
              <CTable
                responsive
                striped
                hover
                bordered
                size="sm"
                className="text-light mb-0"
              >
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell style={{ minWidth: "80px" }}>
                      Row
                    </CTableHeaderCell>
                    <CTableHeaderCell>Reached At</CTableHeaderCell>
                    <CTableHeaderCell>Robot Released</CTableHeaderCell>
                    <CTableHeaderCell>Direction</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {mds.mds_positions.map((position, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>
                        <CBadge
                          color={position.active ? "success" : "secondary"}
                          className="px-2 py-1"
                        >
                          Row {position.row_number}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell style={{ fontSize: "12px" }}>
                        {formatRelativeTime(position.reached_at)}
                      </CTableDataCell>
                      <CTableDataCell>
                        {position.robot_released ? (
                          <CBadge color="success" className="px-2 py-1">
                            Released
                          </CBadge>
                        ) : (
                          <CBadge color="warning" className="px-2 py-1">
                            Not Released
                          </CBadge>
                        )}
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge
                          color="info"
                          className="px-2 py-1"
                          style={{ textTransform: "capitalize" }}
                        >
                          {position.cleaning_direction}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        {position.active ? (
                          <CBadge color="success" className="px-2 py-1">
                            ACTIVE
                          </CBadge>
                        ) : (
                          <CBadge color="secondary" className="px-2 py-1">
                            INACTIVE
                          </CBadge>
                        )}
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            ) : (
              <div className="text-center text-muted py-4">
                No position data available
              </div>
            )}
          </CCardBody>
        </CCard>

        {/* Active Row Details */}
        {activePosition && (
          <CCard className="border-0 mb-3 shadow-sm bg-secondary">
            <CCardBody>
              <h5 className="text-light mb-3">
                🟢 Currently Active: Row {activePosition.row_number}
              </h5>

              <CTable
                responsive
                striped
                hover
                bordered
                size="sm"
                className="text-light mb-0"
              >
                <CTableBody>
                  <CTableRow>
                    <CTableDataCell scope="row" style={{ minWidth: "150px" }}>
                      Reached At
                    </CTableDataCell>
                    <CTableDataCell>
                      {formatDateTime(activePosition.reached_at)}
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell scope="row">
                      Robot Released
                    </CTableHeaderCell>
                    <CTableDataCell>
                      {activePosition.robot_released ? (
                        <CBadge color="success">Yes</CBadge>
                      ) : (
                        <CBadge color="danger">No</CBadge>
                      )}
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell scope="row">
                      Cleaning Direction
                    </CTableHeaderCell>
                    <CTableDataCell style={{ textTransform: "capitalize" }}>
                      {activePosition.cleaning_direction}
                    </CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        )}

        {/* Associated Robot Information */}
        {mds.robot && (
          <CCard className="border-0 mb-3 shadow-sm bg-secondary">
            <CCardBody>
              <h5 className="text-light mb-3">
                {/* <CIcon icon={cilArrowBottom} className="me-2" /> */}
                🤖 Associated Robot Information
              </h5>

              <CTable
                responsive
                striped
                hover
                bordered
                size="sm"
                className="text-light mb-0"
              >
                <CTableBody>
                  <CTableRow>
                    <CTableDataCell scope="row" style={{ minWidth: "100px" }}>
                      Robot Number
                    </CTableDataCell>
                    <CTableDataCell>
                      <CBadge color="warning" className="px-2 py-1">
                        {mds.robot.robot_no}
                      </CBadge>
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell scope="row">DevEUI</CTableHeaderCell>
                    <CTableDataCell style={{ fontSize: "12px" }}>
                      {mds.robot.deveui}
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell scope="row">Block</CTableHeaderCell>
                    <CTableDataCell>{mds.robot.block}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell scope="row">Site ID</CTableHeaderCell>
                    <CTableDataCell>{mds.robot.site_id}</CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        )}

        {/* Row Cleaning Summary */}
        {mds.rows?.length > 0 && (
          <CCard className="border-0 mb-3 shadow-sm bg-secondary">
            <CCardBody>
              <h5 className="text-light mb-3">Rows Cleaning Summary</h5>

              <div className="overflow-auto">
                <CTable
                  responsive
                  striped
                  hover
                  bordered
                  size="sm"
                  className="text-light mb-0"
                >
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Row</CTableHeaderCell>
                      <CTableHeaderCell>Length</CTableHeaderCell>
                      <CTableHeaderCell>Status</CTableHeaderCell>
                      <CTableHeaderCell>Battery</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {mds.rows.map((row, index) => (
                      <CTableRow key={index}>
                        <CTableDataCell>
                          <CBadge color="primary" className="px-2 py-1">
                            Row {row.row_no}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell>{row.row_length} m</CTableDataCell>
                        <CTableDataCell>
                          {row.cleaning?.finish ? (
                            <CBadge color="success" className="px-2 py-1">
                              Completed
                            </CBadge>
                          ) : row.cleaning?.start ? (
                            <CBadge color="warning" className="px-2 py-1">
                              In Progress
                            </CBadge>
                          ) : (
                            <CBadge color="secondary" className="px-2 py-1">
                              Pending
                            </CBadge>
                          )}
                        </CTableDataCell>
                        <CTableDataCell>
                          {row.cleaning?.battery_health_status ? (
                            <small style={{ color: "#28a745" }}>
                              {row.cleaning.battery_health_status}
                            </small>
                          ) : (
                            <CBadge color="secondary">N/A</CBadge>
                          )}
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              </div>
            </CCardBody>
          </CCard>
        )}

        <RowsTabs
          rows={rows}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          userInfo={userInfo}
          formatDateTime={formatDateTime}
          formatTimeOnly={formatTimeOnly}
          formatTime={formatTime}
          formatRelativeTime={formatRelativeTime}
          mds={mds}
        />

        {/* <div className="mx-3">
          <h4>MDS Last Activity</h4>
        </div>
        {userInfo.type === "Internal" && mds.last_activity && (
          <RobotLastActivity last_activity={mds.last_activity} />
        )} */}
      </COffcanvasBody>
    </COffcanvas>
  );
};

export default MdsSideBar;
