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
  CModalHeader,
  CModal,
  CModalTitle,
  CModalBody,
} from "@coreui/react";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { Link } from "react-router-dom";
import LastActivity from "../../../components/LastActivity";
import CIcon from "@coreui/icons-react";
import { cilX } from "@coreui/icons";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_SITEID_REQUEST":
      return { ...state, loadingSiteIds: true, sitesError: "" };
    case "FETCH_SITEID_SUCCESS":
      return {
        ...state,
        loadingSiteIds: false,
        siteIds: action.payload,
      };
    case "FETCH_SITEID_FAIL":
      return { ...state, loadingSiteIds: false, sitesError: action.payload };

    case "SELECT_SITENAME_REQUEST":
      return { ...state, loadingFields: true };

    case "SELECT_SITENAME_SUCCESS":
      return {
        ...state,
        loadingFields: false,
        selectedSiteName: action.payload,
      };
    case "SELECT_SITENAME_FAIL":
      return { ...state, loadingFields: false };

    case "FETCH_TIMER_REQUEST":
      return { ...state, loadingAllTimers: true, timerError: "" };
    case "FETCH_TIMER_SUCCESS":
      return {
        ...state,
        loadingAllTimers: false,
        timers: action.payload.data,
      };
    case "FETCH_TIMER_FAIL":
      return { ...state, loadingAllTimers: false, timerError: action.payload };
    default:
      return state;
  }
};

const Mdstimer = () => {
  const [
    {
      timers,
      loadingAllTimers,
      timerError,
      siteIds,
      sitesError,
      loadingSiteIds,
    },
    dispatch,
  ] = useReducer(reducer, {
    timers: [],
    loadingAllTimers: true,
    timerError: "",
    siteIds: [],
    loadingSiteIds: true,
    sitesError: "",
  });

  const [site_id, setSiteId] = useState("all");

  const authtoken = useSelector((state) => state.authtoken);

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
  }

  useEffect(() => {
    const fetchSiteIds = async () => {
      dispatch({ type: "FETCH_SITEID_REQUEST" });
      try {
        const result = await axios.get(`/api/v1/sites`, {
          headers: { Authorization: `Bearer ${authtoken}` },
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

    const fetchAllTimers = async () => {
      dispatch({ type: "FETCH_TIMER_REQUEST" });
      try {
        const result = await axios.get(
          `/api/v1/mds-device/get-mds-timers/${site_id}`,
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );

        dispatch({
          type: "FETCH_TIMER_SUCCESS",
          payload: result.data,
        });
        console.log(result.data);
      } catch (error) {
        dispatch({
          type: "FETCH_TIMER_FAIL",
          payload: error.response?.data?.error || error.response?.data?.message,
        });
        toast.error(
          error.response?.data?.error || error.response?.data?.message
        );
      }
    };
    fetchSiteIds();
    fetchAllTimers();
  }, [authtoken, site_id]);

  const handleViewClick = (robot) => {
    setSelectedRobot(robot);
    setViewModalVisible(true);
  };

  const handleSiteNameChange = (e) => {
    dispatch({ type: "SELECT_SITENAME_REQUEST" });

    const selectedSiteName = e.target.value;
    const selectedSite = siteIds.find(
      (site) => site.site_id.toString() === selectedSiteName
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
      <h2>⏳ MDS Timer Management</h2>
      {/* 📌 Site Filter */}
      <CRow className="justify-content-start mb-3">
        <CCol md={4}>
          <CFormSelect
            name="site_id"
            value={site_id}
            onChange={handleSiteNameChange}
          >
            <option value="">All</option>
            {siteIds?.length > 0 &&
              siteIds.map((item) => (
                <option key={item.site_id} value={item.site_id}>
                  {item.site_id}
                </option>
              ))}
          </CFormSelect>
        </CCol>
      </CRow>
      {/* 📝 Timers Table */}
      <CCard className="shadow-sm">
        <CCardHeader>
          <h5 className="m-0">
            📋 Timers for &nbsp;
            <b>{site_id ? site_id : "All Sites"}</b>
          </h5>
        </CCardHeader>
        <CCardBody>
          <CTable bordered hover responsive>
            <CTableHead color="secondary">
              <CTableRow>
                <CTableHeaderCell>Sr</CTableHeaderCell>
                <CTableHeaderCell>Site ID</CTableHeaderCell>
                <CTableHeaderCell>Block</CTableHeaderCell>
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
                  <CTableDataCell colSpan={11}>
                    <LoadingSpinner />
                  </CTableDataCell>
                </CTableRow>
              ) : timers.length > 0 ? (
                timers.map((timer, siteIndex) => (
                  <CTableRow key={`${siteIndex}`}>
                    <CTableDataCell>{siteIndex + 1}</CTableDataCell>
                    <CTableDataCell>{timer.site_id}</CTableDataCell>
                    <CTableDataCell>{timer.block}</CTableDataCell>

                    <CTableDataCell>
                      {timer.timer1 === "25:00:00" ? (
                        <CBadge color="danger">Disabled</CBadge>
                      ) : (
                        timer.timer1
                      )}
                    </CTableDataCell>
                    <CTableDataCell>{timer.timer1_date}</CTableDataCell>
                    <CTableDataCell>
                      {timer.timer2 === "25:00:00" ? (
                        <CBadge color="danger">Disabled</CBadge>
                      ) : (
                        timer.timer2
                      )}
                    </CTableDataCell>
                    <CTableDataCell>{timer.timer2_date}</CTableDataCell>
                    <CTableDataCell>
                      {timer.timer3 === "25:00:00" ? (
                        <CBadge color="danger">Disabled</CBadge>
                      ) : (
                        timer.timer3
                      )}
                    </CTableDataCell>
                    <CTableDataCell>{timer.timer3_date}</CTableDataCell>
                    <CTableDataCell style={{ minWidth: "150px" }}>
                      <CButton
                        color="info"
                        size="sm"
                        onClick={() => handleViewClick(timer)} // Open modal with this robot
                        className="m-1"
                      >
                        View
                      </CButton>

                      <Link
                        className="btn btn-sm btn-warning m-1"
                        to={`/${adminroute}/mds-timer/update/${timer.block}/${timer.site_id}`}
                      >
                        Update
                      </Link>
                    </CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell
                    colSpan="11"
                    className="text-center text-danger"
                  >
                    No Mds Found
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
      {/* View */}
      <CModal
        size="xl"
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

export default Mdstimer;
