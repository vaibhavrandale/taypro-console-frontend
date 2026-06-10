import React, { useState, useEffect, useReducer } from "react";
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormSelect,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CBadge,
  CButton,
  // CModalFooter,
  CModalHeader,
  CModal,
  CModalTitle,
  CModalBody,
  CFormCheck,
} from "@coreui/react";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import PaginateInput from "../../../components/PaginateInput";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { Link } from "react-router-dom";
import LastActivity from "../../../components/LastActivity";
import CIcon from "@coreui/icons-react";
import { cilX } from "@coreui/icons";
import SiteSelect from "../../../components/SiteSelect";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_SITEID_REQUEST":
      return { ...state, loadingSiteIds: true, error: "" };
    case "FETCH_SITEID_SUCCESS":
      return {
        ...state,
        loadingSiteIds: false,
        siteIds: action.payload,
      };
    case "FETCH_SITEID_FAIL":
      return { ...state, loadingSiteIds: false, error: action.payload };

    case "SELECT_SITENAME_REQUEST":
      return { ...state, loadingFields: true };

    case "SELECT_SITENAME_SUCCESS":
      return {
        ...state,
        loadingFields: false,
        selectedSiteName: action.payload,
        totalPages: action.payload.totalPages, // Use API-provided totalPages
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
      };
    case "SELECT_SITENAME_FAIL":
      return { ...state, loadingFields: false };

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

    default:
      return state;
  }
};

const Timers = () => {
  const [
    {
      timers,
      loadingAllTimers,
      error,
      updateLoading,
      siteIds,
      loadingBulkUpdateToggle,
      bulkUpdateToggleError,
    },
    dispatch,
  ] = useReducer(reducer, {
    timers: [],
    loadingAllTimers: true,
    error: "",
    totalPages: 1,
    siteIds: [],
    hasNextPage: false,
    hasPrevPage: false,
    updateLoading: false,
    loadingBulkUpdateToggle: false,
    bulkUpdateToggleError: "",
  });

  const [site_id, setSiteId] = useState("");

  // const authtoken = useSelector((state) => state.authtoken);
  const [selectedRows, setSelectedRows] = useState([]);
  const [targetSite, setTargetSite] = useState("");
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedRobot, setSelectedRobot] = useState(null);

  const userInfo = useSelector((state) => state.userInfo);
  let adminroute = "";

  if (userInfo.role === "Master Admin") {
    adminroute = "master-admin";
  } else if (userInfo.role === "Service Admin") {
    adminroute = "service-admin";
  } else if (userInfo.role === "Project Admin") {
    // eslint-disable-next-line no-unused-vars
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
  }

  useEffect(() => {
    if (!site_id) return;
    const fetchSiteIds = async () => {
      dispatch({ type: "FETCH_SITEID_REQUEST" });
      try {
        const result = await axios.get(`/api/v1/sites`, {
          // headers: { Authorization: `Bearer ${authtoken}` },
          withCredentials: true,
        });
        dispatch({
          type: "FETCH_SITEID_SUCCESS",
          payload: result.data.data,
        });
      } catch (error) {
        dispatch({
          type: "FETCH_SITEID_FAIL",
          payload: error.response?.data?.error || "Error fetching sites",
        });
        toast.error(error.response.data.error || "Error fetching sites");
      }
    };
    fetchSiteIds();
  }, []);

  useEffect(() => {
    const fetchAllTimers = async () => {
      dispatch({ type: "FETCH_TIMER_REQUEST" });
      try {
        const result = await axios.post(
          `/api/v1/timers`,
          { site_id },
          {
            // headers: { Authorization: `Bearer ${authtoken}` },
            withCredentials: true,
          },
        );
        // console.log(result.data.data);

        dispatch({
          type: "FETCH_TIMER_SUCCESS",
          payload: result.data.data,
        });
      } catch (error) {
        dispatch({
          type: "FETCH_TIMER_FAIL",
          payload: error.response?.data?.error || error.response.data.message,
        });
        toast.error(error.response?.data?.error || error.response.data.message);
      }
    };

    fetchAllTimers();
  }, [site_id]);

  const handleCheckboxChange = (site) => {
    setSelectedRows((prev) => {
      const exists = prev.some((r) => r._id === site._id);

      if (exists) {
        return prev.filter((r) => r._id !== site._id);
      }

      return [...prev, site];
    });
  };
  console.log(selectedRows);

  const handleBulkUpdate = async () => {
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
        {
          // headers: { Authorization: `Bearer ${authtoken}` },
          withCredentials: true,
        },
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

  const handleViewClick = (robot) => {
    setSelectedRobot(robot);
    setViewModalVisible(true);
  };

  const handleSiteNameChange = (e) => {
    const selectedSiteName = e.target.value;
    dispatch({ type: "SELECT_SITENAME_REQUEST" });

    // Handle "All" separately
    if (selectedSiteName === "all") {
      setSiteId("all");

      dispatch({
        type: "SELECT_SITENAME_SUCCESS",
        payload: { site_id: "all" },
      });

      return;
    }

    const selectedSite = siteIds.find(
      (site) => site.site_id.toString() === selectedSiteName,
    );

    if (selectedSite) {
      setSiteId(selectedSite.site_id);

      dispatch({ type: "SELECT_SITENAME_SUCCESS", payload: selectedSite });
    } else {
      dispatch({ type: "SELECT_SITENAME_FAIL" });
    }
  };

  return (
    <div className="">
      <h2>⏳ Timers Management</h2>
      {/* 📌 Site Filter */}
      <CRow className="justify-content-start mb-3">
        <CCol md={4}>
          {/* <CFormSelect
            name="site_id"
            value={site_id}
            onChange={handleSiteNameChange}
          >
            <option value="all">All</option>
            {siteIds?.length > 0 &&
              siteIds.map((item) => (
                <option key={item.site_id} value={item.site_id}>
                  {item.site_id}
                </option>
              ))}
          </CFormSelect> */}
          <SiteSelect value={site_id} onChange={setSiteId} />
        </CCol>
      </CRow>
      {/* 📝 Timers Table */}
      <CCard className="shadow-sm">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h5 className="m-0">
            📋 Timers for &nbsp;
            <b>{site_id ? site_id : "All Sites"}</b>
          </h5>

          {!["Site Technician", "Client Admin"].includes(userInfo.role) && (
            <CButton
              color="primary"
              size="sm"
              onClick={handleBulkUpdate}
              disabled={selectedRows.length === 0}
            >
              {loadingBulkUpdateToggle
                ? "Updating..."
                : "Toggle Timer Permission"}
            </CButton>
          )}
          {bulkUpdateToggleError && (
            <div className="alert alert-danger mt-2 mb-0">
              {bulkUpdateToggleError}
            </div>
          )}
        </CCardHeader>
        <CCardBody>
          <CTable bordered hover responsive>
            <CTableHead color="secondary">
              <CTableRow>
                {!["Site Technician", "Client Admin"].includes(
                  userInfo.role,
                ) && (
                  <CTableHeaderCell>
                    <CFormCheck
                      checked={
                        timers.length > 0 &&
                        selectedRows.length === timers.length
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedRows(timers);
                        } else {
                          setSelectedRows([]);
                        }
                      }}
                    />
                  </CTableHeaderCell>
                )}
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
                  <CTableRow
                    key={`${siteIndex}-${site.block}`}
                    // color={`${site.is_available_to_edit ? "" : "warning"}`}
                  >
                    {!["Site Technician", "Client Admin"].includes(
                      userInfo.role,
                    ) && (
                      <CTableDataCell>
                        <CFormCheck
                          checked={selectedRows.some((r) => r._id === site._id)}
                          onChange={() => handleCheckboxChange(site)}
                        />
                      </CTableDataCell>
                    )}
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
                        onClick={() => handleViewClick(site)} // Open modal with this robot
                        className="m-1"
                      >
                        View
                      </CButton>

                      {!site.is_available_to_edit &&
                      ["Site Technician", "Client Admin"].includes(
                        userInfo.role,
                      ) ? (
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
                    .filter(([key]) => key !== "last_activity") // Exclude last_activity
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
