import React, { useState, useEffect, useReducer } from "react";
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CBadge,
  CButton,
  CModalHeader,
  CModal,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormCheck,
} from "@coreui/react";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { Link } from "react-router-dom";
import LastActivity from "../../../components/LastActivity";
import CIcon from "@coreui/icons-react";
import { cilX } from "@coreui/icons";
import SiteSelect from "../../../components/SiteSelect";
import TimerInstructionModal from "../../../components/TimerInstructionModal";

const CLIENT_TECH_ROLES = [
  "Site Technician",
  "Client Admin",
  "Client Site Technician",
];

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_TIMER_REQUEST":
      return { ...state, loadingAllTimers: true, error: "" };
    case "FETCH_TIMER_SUCCESS":
      return {
        ...state,
        loadingAllTimers: false,
        timers: action.payload,
      };
    case "FETCH_TIMER_FAIL":
      return { ...state, loadingAllTimers: false, error: action.payload };

    case "BULK_UPDATE_TOGGLE_REQUEST":
      return {
        ...state,
        loadingBulkUpdateToggle: true,
        bulkUpdateToggleError: "",
      };
    case "BULK_UPDATE_TOGGLE_SUCCESS":
      return {
        ...state,
        loadingBulkUpdateToggle: false,
        timers: state.timers.map((timer) =>
          action.payload.some((updated) => updated._id === timer._id)
            ? {
                ...timer,
                ...action.payload.find((u) => u._id === timer._id),
              }
            : timer,
        ),
      };
    case "BULK_UPDATE_TOGGLE_FAIL":
      return {
        ...state,
        loadingBulkUpdateToggle: false,
        bulkUpdateToggleError: action.payload,
      };

    case "BULK_UPDATE_TIMERS_REQUEST":
      return {
        ...state,
        loadingBulkUpdateTimers: true,
        bulkUpdateTimersError: "",
      };
    case "BULK_UPDATE_TIMERS_SUCCESS":
      return {
        ...state,
        loadingBulkUpdateTimers: false,
        timers: state.timers.map((timer) =>
          action.payload.some((updated) => updated._id === timer._id)
            ? {
                ...timer,
                ...action.payload.find((u) => u._id === timer._id),
              }
            : timer,
        ),
      };
    case "BULK_UPDATE_TIMERS_FAIL":
      return {
        ...state,
        loadingBulkUpdateTimers: false,
        bulkUpdateTimersError: action.payload,
      };

    default:
      return state;
  }
};

const emptyTimerForm = {
  timer1: "00:00:00",
  timer1_date: "",
  timer2: "00:00:00",
  timer2_date: "",
  timer3: "00:00:00",
  timer3_date: "",
};

const Timers = () => {
  const [
    {
      timers,
      loadingAllTimers,
      loadingBulkUpdateToggle,
      bulkUpdateToggleError,
      loadingBulkUpdateTimers,
      bulkUpdateTimersError,
    },
    dispatch,
  ] = useReducer(reducer, {
    timers: [],
    loadingAllTimers: true,
    error: "",
    loadingBulkUpdateToggle: false,
    bulkUpdateToggleError: "",
    loadingBulkUpdateTimers: false,
    bulkUpdateTimersError: "",
  });

  const [site_id, setSiteId] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedRobot, setSelectedRobot] = useState(null);
  const [bulkUpdateModalVisible, setBulkUpdateModalVisible] = useState(false);
  const [bulkTimerData, setBulkTimerData] = useState(emptyTimerForm);
  const [showInstructionModal, setShowInstructionModal] = useState(false);

  const userInfo = useSelector((state) => state.userInfo);
  const isClientTech = CLIENT_TECH_ROLES.includes(userInfo.role);

  let adminroute = "";

  if (userInfo.role === "Master Admin") {
    adminroute = "master-admin";
  } else if (userInfo.role === "Service Admin") {
    adminroute = "service-admin";
  } else if (userInfo.role === "Project Admin") {
    adminroute = "project-admin";
  } else if (userInfo?.role === "Master User") {
    adminroute = "master-user";
  } else if (userInfo?.role === "Service User") {
    adminroute = "service-user";
  } else if (userInfo?.role === "Project User") {
    adminroute = "project-user";
  } else if (userInfo?.role === "Client Admin") {
    adminroute = "client-admin";
  } else if (userInfo?.role === "Site Technician") {
    adminroute = "site-technician";
  } else if (userInfo?.role === "Client Site Technician") {
    adminroute = "client-site-technician";
  } else if (userInfo?.role === "Site Incharge") {
    adminroute = "site-incharge";
  }

  const canSelectRow = (row) =>
    !isClientTech || row.is_available_to_edit !== false;

  const selectableTimers = timers.filter(canSelectRow);

  useEffect(() => {
    const fetchAllTimers = async () => {
      dispatch({ type: "FETCH_TIMER_REQUEST" });
      try {
        const result = await axios.post(
          `/api/v1/timers`,
          { site_id },
          { withCredentials: true },
        );

        dispatch({
          type: "FETCH_TIMER_SUCCESS",
          payload: result.data.data,
        });
        setSelectedRows([]);
      } catch (error) {
        dispatch({
          type: "FETCH_TIMER_FAIL",
          payload:
            error.response?.data?.error || error.response?.data?.message,
        });
        toast.error(
          error.response?.data?.error || error.response?.data?.message,
        );
      }
    };

    fetchAllTimers();
  }, [site_id]);

  const handleCheckboxChange = (site) => {
    if (!canSelectRow(site)) return;

    setSelectedRows((prev) => {
      const exists = prev.some((r) => r._id === site._id);
      if (exists) {
        return prev.filter((r) => r._id !== site._id);
      }
      return [...prev, site];
    });
  };

  const handleBulkTogglePermission = async () => {
    if (selectedRows.length === 0) {
      toast.error("Please select at least one block to update.");
      return;
    }

    try {
      const siteIdsToUpdate = selectedRows.map((row) => row._id);

      dispatch({ type: "BULK_UPDATE_TOGGLE_REQUEST" });

      const res = await axios.put(
        "/api/v1/timers/enable-disable/edit",
        { ids: siteIdsToUpdate },
        { withCredentials: true },
      );

      dispatch({
        type: "BULK_UPDATE_TOGGLE_SUCCESS",
        payload: res.data.data,
      });

      toast.success(res.data.message || "Bulk update successful.");
      setSelectedRows([]);
    } catch (error) {
      dispatch({
        type: "BULK_UPDATE_TOGGLE_FAIL",
        payload:
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Bulk update failed",
      });

      toast.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Bulk update failed.",
      );
    }
  };

  const openBulkUpdateModal = () => {
    if (selectedRows.length === 0) {
      toast.error("Please select at least one block to update.");
      return;
    }

    // Prefill from first selected row so form matches Update Timer page defaults
    const first = selectedRows[0];
    setBulkTimerData({
      timer1: first?.timer1 || "00:00:00",
      timer1_date: first?.timer1_date || "",
      timer2: first?.timer2 || "00:00:00",
      timer2_date: first?.timer2_date || "",
      timer3: first?.timer3 || "00:00:00",
      timer3_date: first?.timer3_date || "",
    });
    setBulkUpdateModalVisible(true);
  };

  const handleBulkTimerChange = (e) => {
    const { name, value } = e.target;
    setBulkTimerData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBulkUpdateTimers = async (e) => {
    e.preventDefault();

    if (selectedRows.length === 0) {
      toast.error("Please select at least one block to update.");
      return;
    }

    try {
      dispatch({ type: "BULK_UPDATE_TIMERS_REQUEST" });

      const res = await axios.put(
        "/api/v1/timers/bulk",
        {
          ids: selectedRows.map((row) => row._id),
          ...bulkTimerData,
        },
        { withCredentials: true },
      );

      dispatch({
        type: "BULK_UPDATE_TIMERS_SUCCESS",
        payload: res.data.data,
      });

      toast.success(res.data.message || "Timers updated successfully.");
      if (res.data.skipped?.length) {
        toast.error(
          `${res.data.skipped.length} block(s) were skipped (permission or invalid).`,
        );
      }

      setSelectedRows([]);
      setBulkUpdateModalVisible(false);
      setBulkTimerData(emptyTimerForm);
    } catch (error) {
      dispatch({
        type: "BULK_UPDATE_TIMERS_FAIL",
        payload:
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Bulk timer update failed",
      });

      toast.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Bulk timer update failed.",
      );
    }
  };

  const handleViewClick = (robot) => {
    setSelectedRobot(robot);
    setViewModalVisible(true);
  };

  const renderTimerInput = (timerKey, label) => (
    <CCol md={4} lg={2}>
      <div className="mb-3">
        <label className="form-label">{label}</label>
        <input
          type="time"
          className="form-control"
          name={timerKey}
          value={
            bulkTimerData[timerKey] === "25:00:00"
              ? ""
              : bulkTimerData[timerKey]
          }
          onChange={handleBulkTimerChange}
          step="1"
          disabled={bulkTimerData[timerKey] === "25:00:00"}
        />
        <div className="form-check mt-1">
          <input
            className="form-check-input"
            type="checkbox"
            checked={bulkTimerData[timerKey] === "25:00:00"}
            onChange={(e) =>
              setBulkTimerData((prev) => ({
                ...prev,
                [timerKey]: e.target.checked ? "25:00:00" : "00:00:00",
              }))
            }
            id={`bulk-disable-${timerKey}`}
          />
          <label
            className="form-check-label"
            htmlFor={`bulk-disable-${timerKey}`}
          >
            Disable Timer
          </label>
        </div>
      </div>
    </CCol>
  );

  return (
    <div className="">
      <h2>⏳ Timers Management</h2>
      <CRow className="justify-content-start mb-3">
        <CCol md={4}>
          <SiteSelect value={site_id} onChange={setSiteId} />
        </CCol>
      </CRow>
      <CCard className="shadow-sm">
        <CCardHeader className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <h5 className="m-0">
            📋 Timers for &nbsp;
            <b>{site_id ? site_id : "All Sites"}</b>
          </h5>

          <div className="d-flex gap-2 flex-wrap">
            <CButton
              color="warning"
              size="sm"
              onClick={openBulkUpdateModal}
              disabled={selectedRows.length === 0}
            >
              Update Selected ({selectedRows.length})
            </CButton>

            {!isClientTech && (
              <CButton
                color="primary"
                size="sm"
                onClick={handleBulkTogglePermission}
                disabled={selectedRows.length === 0}
              >
                {loadingBulkUpdateToggle
                  ? "Updating..."
                  : "Toggle Timer Permission"}
              </CButton>
            )}
          </div>
        </CCardHeader>
        {(bulkUpdateToggleError || bulkUpdateTimersError) && (
          <div className="alert alert-danger m-2 mb-0">
            {bulkUpdateToggleError || bulkUpdateTimersError}
          </div>
        )}
        <CCardBody>
          <CTable bordered hover responsive>
            <CTableHead color="secondary">
              <CTableRow>
                <CTableHeaderCell>
                  <CFormCheck
                    checked={
                      selectableTimers.length > 0 &&
                      selectedRows.length === selectableTimers.length
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedRows(selectableTimers);
                      } else {
                        setSelectedRows([]);
                      }
                    }}
                  />
                </CTableHeaderCell>
                <CTableHeaderCell>Sr</CTableHeaderCell>
                <CTableHeaderCell>Site ID</CTableHeaderCell>
                <CTableHeaderCell>Block</CTableHeaderCell>
                <CTableHeaderCell>Total Robots</CTableHeaderCell>
                <CTableHeaderCell>Max Cleaning Time</CTableHeaderCell>
                <CTableHeaderCell>Timer 1</CTableHeaderCell>
                <CTableHeaderCell>Date 1</CTableHeaderCell>
                <CTableHeaderCell>Timer 2</CTableHeaderCell>
                <CTableHeaderCell>Date 2</CTableHeaderCell>
                <CTableHeaderCell>Timer 3</CTableHeaderCell>
                <CTableHeaderCell>Date 3</CTableHeaderCell>
                <CTableHeaderCell>Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {loadingAllTimers ? (
                <CTableRow className="text-center">
                  <CTableDataCell colSpan={13}>
                    <LoadingSpinner />
                  </CTableDataCell>
                </CTableRow>
              ) : timers.length > 0 ? (
                timers.map((site, siteIndex) => (
                  <CTableRow key={`${siteIndex}-${site.block}`}>
                    <CTableDataCell>
                      <CFormCheck
                        checked={selectedRows.some((r) => r._id === site._id)}
                        disabled={!canSelectRow(site)}
                        onChange={() => handleCheckboxChange(site)}
                      />
                    </CTableDataCell>
                    <CTableDataCell>{siteIndex + 1}</CTableDataCell>
                    <CTableDataCell>{site.site_id}</CTableDataCell>
                    <CTableDataCell>{site.block}</CTableDataCell>
                    <CTableDataCell>
                      {site.total_robots_in_block}
                    </CTableDataCell>
                    <CTableDataCell>
                      {site.max_cleaning_time} min
                    </CTableDataCell>
                    <CTableDataCell>
                      {site.timer1 === "25:00:00" ? (
                        <CBadge color="danger">Disabled</CBadge>
                      ) : (
                        site?.timer1
                      )}
                    </CTableDataCell>
                    <CTableDataCell>{site.timer1_date}</CTableDataCell>
                    <CTableDataCell>
                      {site.timer2 === "25:00:00" ? (
                        <CBadge color="danger">Disabled</CBadge>
                      ) : (
                        site?.timer2
                      )}
                    </CTableDataCell>
                    <CTableDataCell>{site.timer2_date}</CTableDataCell>
                    <CTableDataCell>
                      {site.timer3 === "25:00:00" ? (
                        <CBadge color="danger">Disabled</CBadge>
                      ) : (
                        site?.timer3
                      )}
                    </CTableDataCell>
                    <CTableDataCell>{site.timer3_date}</CTableDataCell>
                    <CTableDataCell style={{ minWidth: "150px" }}>
                      <CButton
                        color="info"
                        size="sm"
                        onClick={() => handleViewClick(site)}
                        className="m-1"
                      >
                        View
                      </CButton>

                      {!site.is_available_to_edit && isClientTech ? (
                        <>
                          <CButton
                            size="sm"
                            color="secondary"
                            className="m-1"
                            disabled
                          >
                            Update
                          </CButton>

                          <CBadge color="danger" className="ms-2">
                            Timer Update Disabled
                          </CBadge>
                        </>
                      ) : (
                        <>
                          <Link
                            className="btn btn-sm btn-warning m-1"
                            to={`/${adminroute}/timers/${site._id}`}
                          >
                            Update
                          </Link>

                          {!site.is_available_to_edit && (
                            <CBadge color="danger" className="ms-2">
                              Timer Update Disabled for Client & Technicians
                            </CBadge>
                          )}
                        </>
                      )}
                    </CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell
                    colSpan="13"
                    className="text-center text-danger"
                  >
                    No blocks found for this site.
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      {/* Bulk Update Timers Modal — same fields as Update Timer page */}
      <CModal
        size="xl"
        scrollable
        visible={bulkUpdateModalVisible}
        onClose={() => setBulkUpdateModalVisible(false)}
      >
        <CModalHeader closeButton={false}>
          <CModalTitle className="d-flex align-items-center gap-2 flex-wrap">
            Update Timers for {selectedRows.length} block(s)
            <CButton
              size="sm"
              color="info"
              onClick={() => setShowInstructionModal(true)}
            >
              ?
            </CButton>
          </CModalTitle>
          <button
            type="button"
            className="border-0 ms-auto py-0 px-1"
            onClick={() => setBulkUpdateModalVisible(false)}
            style={{ background: "none" }}
          >
            <CIcon icon={cilX} size="lg" />
          </button>
        </CModalHeader>

        <form onSubmit={handleBulkUpdateTimers}>
          <CModalBody>
            <div className="mb-3 small text-medium-emphasis">
              Selected:{" "}
              {selectedRows
                .map((r) => `${r.site_id}:${r.block}`)
                .join(", ")}
            </div>
            <CRow>
              {renderTimerInput("timer1", "Timer1")}
              <CCol md={4} lg={2}>
                <div className="mb-3">
                  <label className="form-label">Timer1_date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="timer1_date"
                    value={bulkTimerData.timer1_date}
                    onChange={handleBulkTimerChange}
                  />
                </div>
              </CCol>

              {renderTimerInput("timer2", "Timer2")}
              <CCol md={4} lg={2}>
                <div className="mb-3">
                  <label className="form-label">Timer2_date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="timer2_date"
                    value={bulkTimerData.timer2_date}
                    onChange={handleBulkTimerChange}
                  />
                </div>
              </CCol>

              {renderTimerInput("timer3", "Timer3")}
              <CCol md={4} lg={2}>
                <div className="mb-3">
                  <label className="form-label">Timer3_date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="timer3_date"
                    value={bulkTimerData.timer3_date}
                    onChange={handleBulkTimerChange}
                  />
                </div>
              </CCol>
            </CRow>
          </CModalBody>
          <CModalFooter>
            <CButton
              color="secondary"
              size="sm"
              type="button"
              onClick={() => setBulkUpdateModalVisible(false)}
            >
              Cancel
            </CButton>
            <CButton
              color="warning"
              size="sm"
              type="submit"
              disabled={loadingBulkUpdateTimers}
            >
              {loadingBulkUpdateTimers ? "Updating..." : "Update"}
            </CButton>
          </CModalFooter>
        </form>
      </CModal>

      <TimerInstructionModal
        visible={showInstructionModal}
        onClose={() => setShowInstructionModal(false)}
      />

      {/* View */}
      <CModal
        size="lg"
        scrollable
        visible={viewModalVisible}
        onClose={() => setViewModalVisible(false)}
      >
        <CModalHeader closeButton={false}>
          <CModalTitle>Robot Timer Details</CModalTitle>
          <button
            type="button"
            className="border-0 ms-auto py-0 px-1"
            onClick={() => setViewModalVisible(false)}
            style={{ background: "none" }}
          >
            <CIcon icon={cilX} size="lg" />
          </button>
        </CModalHeader>

        <CModalBody>
          {selectedRobot && (
            <>
              <CTable bordered responsive>
                <CTableHead color="secondary">
                  <CTableRow>
                    <CTableHeaderCell>Field</CTableHeaderCell>
                    <CTableHeaderCell>Value</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {Object.entries(selectedRobot)
                    .filter(([key]) => key !== "last_activity")
                    .map(([key, value]) => (
                      <CTableRow key={key} className="align-middle">
                        <CTableDataCell className="fw-semibold text-uppercase">
                          {key.replace(/_/g, " ")}
                        </CTableDataCell>
                        <CTableDataCell>
                          <span className="fw-medium">
                            {Array.isArray(value)
                              ? JSON.stringify(value)
                              : String(value)}
                          </span>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                </CTableBody>
              </CTable>

              {selectedRobot.last_activity && (
                <>
                  <h6 className="mt-3">Last Activity:</h6>
                  <LastActivity lastactivity={selectedRobot.last_activity} />
                </>
              )}
            </>
          )}
        </CModalBody>
      </CModal>
    </div>
  );
};

export default Timers;
