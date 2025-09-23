import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";
import {
  CAvatar,
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormCheck,
  CFormSelect,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import "../service-tickets/servicetickts.css";
import CIcon from "@coreui/icons-react";
import { cilX } from "@coreui/icons";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_SITEID_REQUEST":
      return { ...state, loadingSiteIds: true, error: "" };
    case "FETCH_SITEID_SUCCESS":
      return {
        ...state,
        loadingSiteIds: false,
        sites: action.payload,
      };
    case "FETCH_SITEID_FAIL":
      return { ...state, loadingSiteIds: false, error: action.payload };
    case "FETCH_TECHNICIAN_REQUEST":
      return { ...state, loadingTechnicians: true, error: "" };
    case "FETCH_TECHNICIAN_SUCCESS":
      return {
        ...state,
        loadingTechnicians: false,
        technicians: action.payload,
      };
    case "FETCH_TECHNICIAN_FAIL":
      return { ...state, loadingTechnicians: false, error: action.payload };
    case "FETCH_ROBOTS_REQUEST":
      return { ...state, loadingRobots: true, error: "" };
    case "FETCH_ROBOTS_SUCCESS":
      return {
        ...state,
        loadingRobots: false,
        availableRobots: action.payload,
      };
    case "FETCH_ROBOTS_FAIL":
      return { ...state, loadingRobots: false, error: action.payload };

    case "FETCH_PM_DETAILS_REQUEST":
      return { ...state, loadingPMDetails: true, error: "" };
    case "FETCH_PM_DETAILS_SUCCESS":
      return {
        ...state,
        loadingPMDetails: false,
        pmDetails: action.payload,
      };
    case "FETCH_PM_DETAILS_FAIL":
      return { ...state, loadingPMDetails: false, error: action.payload };
    case "SUBMIT_REQUEST":
      return { ...state, loading: true, success: false };
    case "SUBMIT_SUCCESS":
      return { ...state, loading: false, success: true };
    case "SUBMIT_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false,
      };
    case "SET_FIELD":
      return {
        ...state,
        dprData: {
          ...state.dprData,
          [action.name]: action.value,
        },
      };

    case "SET_NESTED_FIELD":
      return {
        ...state,
        dprData: {
          ...state.dprData,
          [action.section]: {
            ...state.dprData[action.section],
            [action.name]: action.value,
          },
        },
      };

    case "SET_DOUBLE_NESTED_FIELD":
      return {
        ...state,
        dprData: {
          ...state.dprData,
          [action.section]: {
            ...state.dprData[action.section],
            [action.subsection]: {
              ...state.dprData[action.section][action.subsection],
              [action.name]: action.value,
            },
          },
        },
      };

    case "ADD_BREAKDOWN_REASON":
      return {
        ...state,
        dprData: {
          ...state.dprData,
          breakdown_reasons: [
            ...state.dprData.breakdown_reasons,
            action.payload,
          ],
        },
      };

    case "UPDATE_BREAKDOWN_REASON":
      const updatedReasons = state.dprData.breakdown_reasons.map(
        (reason, index) =>
          index === action.index ? { ...reason, ...action.payload } : reason
      );
      return {
        ...state,
        dprData: {
          ...state.dprData,
          breakdown_reasons: updatedReasons,
        },
      };

    case "REMOVE_BREAKDOWN_REASON":
      return {
        ...state,
        dprData: {
          ...state.dprData,
          breakdown_reasons: state.dprData.breakdown_reasons.filter(
            (_, index) => index !== action.index
          ),
        },
      };

    case "ADD_ROBOT_TO_BREAKDOWN":
      const breakdownReasons = [...state.dprData.breakdown_reasons];
      if (!breakdownReasons[action.reasonIndex].robots) {
        breakdownReasons[action.reasonIndex].robots = [];
      }
      breakdownReasons[action.reasonIndex].robots.push(action.payload);
      breakdownReasons[action.reasonIndex].count =
        breakdownReasons[action.reasonIndex].robots.length;
      return {
        ...state,
        dprData: {
          ...state.dprData,
          breakdown_reasons: breakdownReasons,
        },
      };

    case "REMOVE_ROBOT_FROM_BREAKDOWN":
      const updatedBreakdownReasons = [...state.dprData.breakdown_reasons];
      updatedBreakdownReasons[action.reasonIndex].robots =
        updatedBreakdownReasons[action.reasonIndex].robots.filter(
          (_, robotIndex) => robotIndex !== action.robotIndex
        );
      updatedBreakdownReasons[action.reasonIndex].count =
        updatedBreakdownReasons[action.reasonIndex].robots.length;
      return {
        ...state,
        dprData: {
          ...state.dprData,
          breakdown_reasons: updatedBreakdownReasons,
        },
      };

    case "ADD_PM_ROBOT": {
      const pmSection = action.pmType; // 'automatic' or 'semi_automatic'

      // Ensure the section exists
      const existingSection = state.dprData.preventive_maintenance_status[
        pmSection
      ] || {
        robots: [],
      };

      const updatedPMData = {
        ...state.dprData.preventive_maintenance_status,
        [pmSection]: {
          ...existingSection,
          robots: [...existingSection.robots, action.payload],
        },
      };

      return {
        ...state,
        dprData: {
          ...state.dprData,
          preventive_maintenance_status: updatedPMData,
        },
      };
    }

    case "REMOVE_PM_ROBOT":
      const pmType = action.pmType;
      const filteredPMRobots = state.dprData.preventive_maintenance_status[
        pmType
      ].robots.filter((_, index) => index !== action.index);
      return {
        ...state,
        dprData: {
          ...state.dprData,
          preventive_maintenance_status: {
            ...state.dprData.preventive_maintenance_status,
            [pmType]: {
              ...state.dprData.preventive_maintenance_status[pmType],
              robots: filteredPMRobots,
            },
          },
        },
      };

    case "CALCULATE_TOTAL_PM":
      const totalPM =
        state.dprData.preventive_maintenance_status.automatic.completed +
        state.dprData.preventive_maintenance_status.semi_automatic.completed;
      return {
        ...state,
        dprData: {
          ...state.dprData,
          preventive_maintenance_status: {
            ...state.dprData.preventive_maintenance_status,
            total_pm_done: totalPM,
          },
        },
      };

    default:
      return state;
  }
};

const SiteTechnicianAddDpr = () => {
  const authtoken = useSelector((state) => state.authtoken);
  const navigate = useNavigate();

  const [state, dispatch] = useReducer(reducer, {
    dprData: {
      site_id: "",
      total_running_robots: 0,
      total_failed_robots: 0,
      robots_run_by: "",
      total_robots: 0,
      comments: "",
      robots_operational_details: {
        ready_for_operational: null,
        online_operational: null,
        manual_operational: null,
        unoperational: null,
        robots_uptime: null,
      },
      preventive_maintenance_status: {
        automatic: {
          attempted: null,
          completed: null,
          robots: [],
        },
        semi_automatic: {
          attempted: null,
          completed: null,
          robots: [],
        },
        total_pm_done: null,
      },
      ticket_details: {
        total_raised: null,
        total_closed: null,
        total_pending: null,
      },
      breakdown_reasons: [],
      technician_present: [],
      report_date: new Date().toISOString().split("T")[0],
    },
    sites: [],
    technicians: [],
    availableRobots: [],
    pmDetails: [],
    loading: false,
    loadingSiteIds: false,
    loadingTechnicians: false,
    loadingRobots: false,
    loadingPMDetails: false,
    error: "",
    success: false,
  });

  const [site_id, setSiteId] = useState("");
  const [showBreakdownModal, setShowBreakdownModal] = useState(false);
  const [showPMModal, setShowPMModal] = useState(false);
  const [selectedPMType, setSelectedPMType] = useState("");
  const [selectedBreakdownIndex, setSelectedBreakdownIndex] = useState(-1);

  const breakdownReasons = [
    "Oxidation",
    "Offline",
    "Transit Online to Offline",
    "Battery Dead",
    "Vegetation",
    "Client Reasons",
    "Service Reasons",
    "Timer",
    "Breakdown",
    "Material Unavailability",
  ];

  const fetchSiteTechnicians = async (e) => {
    const selectedSiteId = e.target.value;
    setSiteId(selectedSiteId); // Updates local state

    dispatch({
      type: "SET_FIELD",
      name: "site_id",
      value: selectedSiteId,
    });

    if (selectedSiteId) {
      dispatch({ type: "FETCH_TECHNICIAN_REQUEST" });

      try {
        const result = await axios.get(
          `/api/v1/users/role/sitetechnician/${selectedSiteId}`,
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );
        dispatch({
          type: "FETCH_TECHNICIAN_SUCCESS",
          payload: result.data.data,
        });
      } catch (error) {
        dispatch({
          type: "FETCH_TECHNICIAN_FAIL",
          payload: error.response.data.error || error.response.data.message,
        });
        toast.error(error.response.data.error || error.response.data.message);
      }

      dispatch({ type: "FETCH_ROBOTS_REQUEST" });
      try {
        const robotResult = await axios.get(
          `/api/v1/robots/get-all-robots-sitewise/${selectedSiteId}`,
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );
        dispatch({
          type: "FETCH_ROBOTS_SUCCESS",
          payload: robotResult.data.data,
        });
        console.log(robotResult);
      } catch (error) {
        dispatch({
          type: "FETCH_ROBOTS_FAIL",
          payload: error.response?.data?.error || "Error fetching robots!",
        });
        toast.error(error.response?.data?.error || "Error fetching robots!");
      }
    } else {
      dispatch({
        type: "FETCH_TECHNICIAN_SUCCESS",
        payload: [],
      });
      dispatch({
        type: "FETCH_ROBOTS_SUCCESS",
        payload: [],
      });
    }
  };

  useEffect(() => {
    const fetchSiteIds = async () => {
      dispatch({ type: "FETCH_SITEID_REQUEST" });
      try {
        const result = await axios.get(`/api/v1/sites`, {
          headers: { Authorization: `Bearer ${authtoken}` },
        });

        const sitesData = result.data.data;
        dispatch({
          type: "FETCH_SITEID_SUCCESS",
          payload: sitesData,
        });
        if (sitesData.length > 0) {
          const firstSiteId = sitesData[0].site_id; // ✅ use site_id not _id

          dispatch({
            type: "SET_FIELD",
            name: "site_id",
            value: firstSiteId,
          });

          setSiteId(firstSiteId);

          fetchSiteTechnicians({ target: { value: firstSiteId } });
        }
      } catch (error) {
        dispatch({
          type: "FETCH_SITEID_FAIL",
          payload: error.response?.data?.error || error.response?.data?.message,
        });
        toast.error(
          error.response?.data?.error || error.response?.data?.message
        );
      }
    };

    fetchSiteIds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authtoken]);

  // Calculate total operational robots when operational details change
  useEffect(() => {
    const robotsUptime =
      state.dprData.robots_operational_details.online_operational +
      state.dprData.robots_operational_details.manual_operational;

    dispatch({
      type: "SET_NESTED_FIELD",
      section: "robots_operational_details",
      name: "robots_uptime",
      value: robotsUptime,
    });
  }, [
    state.dprData.robots_operational_details.online_operational,
    state.dprData.robots_operational_details.manual_operational,
  ]);

  // Calculate total PM done when PM status changes
  useEffect(() => {
    dispatch({ type: "CALCULATE_TOTAL_PM" });
  }, [
    state.dprData.preventive_maintenance_status.automatic.completed,
    state.dprData.preventive_maintenance_status.semi_automatic.completed,
  ]);

  // Calculate ticket pending when raised and closed change
  useEffect(() => {
    const totalPending =
      state.dprData.ticket_details.total_raised -
      state.dprData.ticket_details.total_closed;

    dispatch({
      type: "SET_NESTED_FIELD",
      section: "ticket_details",
      name: "total_pending",
      value: Math.max(0, totalPending),
    });
  }, [
    state.dprData.ticket_details.total_raised,
    state.dprData.ticket_details.total_closed,
  ]);

  const handleChange = (e) => {
    dispatch({
      type: "SET_FIELD",
      name: e.target.name,
      value: e.target.value,
    });
  };

  const handleNestedChange = (section, field, value) => {
    dispatch({
      type: "SET_NESTED_FIELD",
      section: section,
      name: field,
      value: value,
    });
  };

  const handleDoubleNestedChange = (section, subsection, field, value) => {
    dispatch({
      type: "SET_DOUBLE_NESTED_FIELD",
      section: section,
      subsection: subsection,
      name: field,
      value: value,
    });
  };

  const fetchPMDetails = async (pmType) => {
    if (!state.dprData.report_date) {
      toast.error("Please select a report date first!");
      return;
    }

    dispatch({ type: "FETCH_PM_DETAILS_REQUEST" });
    try {
      const result = await axios.post(
        `/api/v1/techniciandprs/get-PM-robots-details`,
        {
          date: state.dprData.report_date,
          robot_type: pmType,
        },
        {
          headers: { Authorization: `Bearer ${authtoken}` },
        }
      );
      dispatch({
        type: "FETCH_PM_DETAILS_SUCCESS",
        payload: result.data.data,
      });

      // Convert to lowercase for state consistency
      const pmTypeKey = pmType === "Automatic" ? "automatic" : "semi_automatic";
      setSelectedPMType(pmTypeKey);
      setShowPMModal(true);
    } catch (error) {
      dispatch({
        type: "FETCH_PM_DETAILS_FAIL",
        payload: error.response?.data?.error || "Error fetching PM details!",
      });
      toast.error(error.response?.data?.error || "Error fetching PM details!");
    }
  };

  const addBreakdownReason = () => {
    dispatch({
      type: "ADD_BREAKDOWN_REASON",
      payload: {
        reason: breakdownReasons[0],
        count: 0,
        robots: [],
      },
    });
  };

  const updateBreakdownReason = (index, field, value) => {
    dispatch({
      type: "UPDATE_BREAKDOWN_REASON",
      index: index,
      payload: { [field]: value },
    });
  };

  const removeBreakdownReason = (index) => {
    dispatch({
      type: "REMOVE_BREAKDOWN_REASON",
      index: index,
    });
  };

  const addRobotToBreakdown = (reasonIndex, robot) => {
    dispatch({
      type: "ADD_ROBOT_TO_BREAKDOWN",
      reasonIndex: reasonIndex,
      payload: {
        robot_no: robot.robot_no,
        block: robot.block,
        robot_id: robot._id,
      },
    });
  };

  const removeRobotFromBreakdown = (reasonIndex, robotIndex) => {
    dispatch({
      type: "REMOVE_ROBOT_FROM_BREAKDOWN",
      reasonIndex: reasonIndex,
      robotIndex: robotIndex,
    });
  };

  const addPMRobot = (pmRobot) => {
    dispatch({
      type: "ADD_PM_ROBOT",
      pmType: selectedPMType,
      payload: {
        robot_no: pmRobot.robot_no,
        block: pmRobot.block,
        robot_id: pmRobot.robot_id,
        pm_id: pmRobot.pm_object_id,
      },
    });
  };

  const removePMRobot = (pmType, index) => {
    dispatch({
      type: "REMOVE_PM_ROBOT",
      pmType: pmType,
      index: index,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "SUBMIT_REQUEST" });

    const newdata = {
      ...state.dprData,
      site_id: state.dprData.site_id,
    };

    try {
      await axios.post("/api/v1/techniciandprs", newdata, {
        headers: { Authorization: `Bearer ${authtoken}` },
      });
      toast.success("Daily Progress Report Added Successfully!");
      dispatch({ type: "SUBMIT_SUCCESS" });

      navigate(`/site-technician/dpr`);
    } catch (error) {
      if (
        error.response?.data?.error ===
        "You have already submitted a DPR for this site today."
      ) {
        dispatch({
          type: "SUBMIT_FAIL",
          payload: error.response?.data?.error || error.response?.data?.message,
        });

        toast.error(
          error.response?.data?.error || error.response?.data?.message
        );
      } else {
        dispatch({
          type: "SUBMIT_FAIL",
          payload: "Please fill all the required fields!",
        });

        toast.error("Please fill all the required fields!");
      }
    }
  };

  return (
    <div className="container mt-6">
      <CCard>
        <CCardHeader>
          <h4>Create DPR</h4>
        </CCardHeader>
        <CCardBody>
          <form onSubmit={handleSubmit}>
            <CRow className="mb-4">
              <CCol md="12">
                <h4 className="text-primary mb-3">Basic Information</h4>
              </CCol>
              <CCol md="6">
                <div className="mb-3">
                  <label className="form-label">Site Id</label>
                  <br />
                  {state.loadingSiteIds ? (
                    <LoadingSpinner />
                  ) : (
                    <CFormSelect
                      name="site_id"
                      value={site_id}
                      onChange={(e) => fetchSiteTechnicians(e)}
                    >
                      {!site_id && <option value="">Select Site Id</option>}
                      {state.sites?.length > 0 &&
                        state.sites.map((item) => (
                          <option key={item._id} value={item.site_id}>
                            {item.site_id}
                          </option>
                        ))}
                    </CFormSelect>
                  )}
                </div>
              </CCol>

              <CCol md="6">
                <div className="mb-3">
                  <label className="form-label">Report Date *</label>
                  <input
                    type="date"
                    className="form-control"
                    name="report_date"
                    value={state.dprData.report_date}
                    onChange={handleChange}
                    max={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
              </CCol>

              <CCol md="4">
                <div className="">
                  {/* <label className="form-label">Total Robots</label> */}
                  <input
                    type="hidden"
                    className="form-control"
                    name="total_robots"
                    value={state.dprData.total_robots}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
              </CCol>

              <CCol md="6">
                <div className="">
                  {/* <label className="form-label">Running Robots</label> */}

                  <input
                    type="hidden"
                    className="form-control"
                    name="total_running_robots"
                    value={state.dprData.total_running_robots}
                    onChange={handleChange}
                  />
                </div>
              </CCol>

              <CCol md="6">
                <div className="">
                  {/* <label className="form-label">Failed Robots</label> */}

                  <input
                    type="hidden"
                    className="form-control"
                    name="total_failed_robots"
                    value={state.dprData.total_failed_robots}
                    onChange={handleChange}
                  />
                </div>
              </CCol>
              {/* <CCol md="6">
                <div className="mb-3">
                  <label className="form-label">Robots Run By</label>
                  <CFormSelect
                    name="robots_run_by"
                    value={state.dprData.robots_run_by}
                    onChange={handleChange}
                  >
                    <option value="">Select Run Mode</option>
                    <option value="timer">Timer</option>
                    <option value="manual">Manual</option>
                    <option value="automatic">Automatic</option>
                  </CFormSelect>
                </div>
              </CCol> */}
            </CRow>

            {/* Robots Operational Details Section */}
            <CRow className="mb-4">
              <CCol md="12">
                <h4 className="text-primary mb-3">
                  Robots Operational Details
                </h4>
              </CCol>
              <CCol md="3">
                <div className="mb-3">
                  <label className="form-label">Ready for Operational</label>
                  <input
                    type="number"
                    className="form-control"
                    value={
                      state.dprData.robots_operational_details
                        .ready_for_operational
                    }
                    onChange={(e) =>
                      handleNestedChange(
                        "robots_operational_details",
                        "ready_for_operational",
                        parseInt(e.target.value)
                      )
                    }
                    min="0"
                  />
                </div>
              </CCol>
              <CCol md="3">
                <div className="mb-3">
                  <label className="form-label">Online Operational</label>
                  <input
                    type="number"
                    className="form-control"
                    value={
                      state.dprData.robots_operational_details
                        .online_operational
                    }
                    onChange={(e) =>
                      handleNestedChange(
                        "robots_operational_details",
                        "online_operational",
                        parseInt(e.target.value)
                      )
                    }
                    min="0"
                  />
                </div>
              </CCol>
              <CCol md="3">
                <div className="mb-3">
                  <label className="form-label">Manual Operational</label>
                  <input
                    type="number"
                    className="form-control"
                    value={
                      state.dprData.robots_operational_details
                        .manual_operational
                    }
                    onChange={(e) =>
                      handleNestedChange(
                        "robots_operational_details",
                        "manual_operational",
                        parseInt(e.target.value)
                      )
                    }
                    min="0"
                  />
                </div>
              </CCol>
              <CCol md="3">
                <div className="mb-3">
                  <label className="form-label">Unoperational</label>
                  <input
                    type="number"
                    className="form-control"
                    value={
                      // state.dprData.robots_operational_details.unoperational
                      state.dprData.robots_operational_details
                        .ready_for_operational -
                      state.dprData.robots_operational_details.robots_uptime
                    }
                    onChange={(e) =>
                      handleNestedChange(
                        "robots_operational_details",
                        "unoperational",
                        parseInt(e.target.value)
                      )
                    }
                    min="0"
                  />
                </div>
              </CCol>
              <CCol md="12">
                <div className="">
                  <strong>
                    Robots Availability:
                    {/* {state.dprData.robots_operational_details.total_operational} */}
                    {
                      state.dprData.robots_operational_details
                        .ready_for_operational
                    }
                  </strong>
                </div>
              </CCol>
              <CCol md="12">
                <div className="">
                  <strong>
                    Robots Uptime:
                    {state.dprData.robots_operational_details.robots_uptime}
                  </strong>
                </div>
              </CCol>
            </CRow>

            {/* Preventive Maintenance Status Section */}
            <CRow className="mb-4">
              <CCol md="12">
                <h4 className="text-primary mb-3">
                  Preventive Maintenance Status
                </h4>
              </CCol>

              {/* Automatic PM */}
              <CCol md="6">
                <div className="card border">
                  <div className="card-header bg-success text-white">
                    <h6 className="mb-0">Automatic PM</h6>
                  </div>
                  <div className="card-body">
                    <div className="mb-2">
                      <label className="form-label">Attempted</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={
                          state.dprData.preventive_maintenance_status.automatic
                            .attempted
                        }
                        onChange={(e) =>
                          handleDoubleNestedChange(
                            "preventive_maintenance_status",
                            "automatic",
                            "attempted",
                            parseInt(e.target.value)
                          )
                        }
                        min="0"
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Completed</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={
                          state.dprData.preventive_maintenance_status.automatic
                            .completed
                        }
                        onChange={(e) =>
                          handleDoubleNestedChange(
                            "preventive_maintenance_status",
                            "automatic",
                            "completed",
                            parseInt(e.target.value)
                          )
                        }
                        min="0"
                      />
                    </div>
                    <div className="mb-2">
                      <CButton
                        color="success"
                        size="sm"
                        onClick={() => fetchPMDetails("Automatic")}
                        disabled={!state.dprData.report_date}
                      >
                        Add PM Status
                        {state.loadingPMDetails && <LoadingSpinner />}
                      </CButton>
                    </div>
                    {state.dprData.preventive_maintenance_status.automatic
                      .robots.length > 0 && (
                      <div>
                        <small className="text-muted">Selected Robots:</small>
                        {state.dprData.preventive_maintenance_status.automatic.robots?.map(
                          (robot, index) => (
                            <div
                              key={index}
                              className="d-flex justify-content-between align-items-center mt-1"
                            >
                              <CBadge color="success">
                                {robot.robot_no} - {robot.block}
                              </CBadge>
                              <CButton
                                color="danger"
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  removePMRobot("automatic", index)
                                }
                              >
                                ×
                              </CButton>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CCol>

              {/* Semi-Automatic PM */}
              <CCol md="6">
                <div className="card border">
                  <div className="card-header bg-warning text-dark">
                    <h6 className="mb-0">Semi-Automatic PM</h6>
                  </div>
                  <div className="card-body">
                    <div className="mb-2">
                      <label className="form-label">Attempted</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={
                          state.dprData.preventive_maintenance_status
                            .semi_automatic.attempted
                        }
                        onChange={(e) =>
                          handleDoubleNestedChange(
                            "preventive_maintenance_status",
                            "semi_automatic",
                            "attempted",
                            parseInt(e.target.value)
                          )
                        }
                        min="0"
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Completed</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={
                          state.dprData.preventive_maintenance_status
                            .semi_automatic.completed
                        }
                        onChange={(e) =>
                          handleDoubleNestedChange(
                            "preventive_maintenance_status",
                            "semi_automatic",
                            "completed",
                            parseInt(e.target.value)
                          )
                        }
                        min="0"
                      />
                    </div>
                    <div className="mb-2">
                      <CButton
                        color="warning"
                        size="sm"
                        onClick={() => fetchPMDetails("Semi-Automatic")}
                        disabled={!state.dprData.report_date}
                      >
                        Add PM Status
                        {state.loadingPMDetails && <LoadingSpinner />}
                      </CButton>
                    </div>
                    {state.dprData.preventive_maintenance_status.semi_automatic
                      .robots.length > 0 && (
                      <div>
                        <small className="text-muted">Selected Robots:</small>
                        {state.dprData.preventive_maintenance_status.semi_automatic.robots.map(
                          (robot, index) => (
                            <div
                              key={index}
                              className="d-flex justify-content-between align-items-center mt-1"
                            >
                              <CBadge color="warning">
                                {robot.robot_no} - {robot.block}
                              </CBadge>
                              <CButton
                                color="danger"
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  removePMRobot("semi_automatic", index)
                                }
                              >
                                ×
                              </CButton>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CCol>

              <CCol md="12" className="mt-3">
                <div className="">
                  <strong>
                    Total PM Done:{" "}
                    {state.dprData.preventive_maintenance_status.total_pm_done}
                  </strong>
                </div>
              </CCol>
            </CRow>

            {/* Ticket Details Section */}
            <CRow className="mb-4">
              <CCol md="12">
                <h4 className="text-primary mb-3">Ticket Details</h4>
              </CCol>
              <CCol md="4">
                <div className="mb-3">
                  <label className="form-label">Total Raised</label>
                  <input
                    type="number"
                    className="form-control"
                    value={state.dprData.ticket_details.total_raised}
                    onChange={(e) =>
                      handleNestedChange(
                        "ticket_details",
                        "total_raised",
                        parseInt(e.target.value)
                      )
                    }
                    min="0"
                  />
                </div>
              </CCol>
              <CCol md="4">
                <div className="mb-3">
                  <label className="form-label">Total Closed</label>
                  <input
                    type="number"
                    className="form-control"
                    value={state.dprData.ticket_details.total_closed}
                    onChange={(e) =>
                      handleNestedChange(
                        "ticket_details",
                        "total_closed",
                        parseInt(e.target.value)
                      )
                    }
                    min="0"
                  />
                </div>
              </CCol>

              <CCol md="4">
                <div className="mb-3">
                  <label className="form-label">Total Pending</label>
                  <input
                    type="number"
                    className="form-control"
                    value={state.dprData.ticket_details.total_pending}
                    disabled
                    style={{ backgroundColor: "#f8f9fa" }}
                  />
                  <small className="text-muted">
                    Auto-calculated (Raised - Closed)
                  </small>
                </div>
              </CCol>
            </CRow>

            {/* Breakdown Reasons Section */}
            <CRow className="mb-4">
              <CCol md="12">
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
                  <h4 className="text-primary mb-0">
                    Breakdown / Unoperational Reasons
                  </h4>
                  <CButton
                    color="primary"
                    size="sm"
                    onClick={addBreakdownReason}
                  >
                    Add Breakdown Reason
                  </CButton>
                </div>
              </CCol>
              <CCol md="12">
                {state.dprData.breakdown_reasons.map((breakdown, index) => (
                  <div key={index} className="card mb-3 border">
                    <div className="card-header bg-danger text-white d-flex justify-content-between align-items-center">
                      <h6 className="mb-0">Breakdown Reason #{index + 1}</h6>
                      <CButton
                        color="light"
                        size="sm"
                        onClick={() => removeBreakdownReason(index)}
                      >
                        Remove
                      </CButton>
                    </div>
                    <div className="card-body">
                      <CRow>
                        {/* <CCol md="6">
                          <div className="mb-3">
                            <label className="form-label">Reason</label>
                            <CFormSelect
                              value={breakdown.reason}
                              onChange={(e) =>
                                updateBreakdownReason(
                                  index,
                                  "reason",
                                  e.target.value
                                )
                              }
                            >
                              {breakdownReasons.map((reason) => (
                                <option key={reason} value={reason}>
                                  {reason}
                                </option>
                              ))}
                            </CFormSelect>
                          </div>
                        </CCol> */}
                        <CCol xs="12" sm="6" md="6">
                          <div className="mb-3">
                            <label className="form-label">Reason</label>
                            <CFormSelect
                              value={breakdown.reason}
                              onChange={(e) =>
                                updateBreakdownReason(
                                  index,
                                  "reason",
                                  e.target.value
                                )
                              }
                              className="w-50"
                            >
                              {breakdownReasons.map((reason) => (
                                <option key={reason} value={reason}>
                                  {reason}
                                </option>
                              ))}
                            </CFormSelect>
                          </div>
                        </CCol>

                        <CCol md="3">
                          <div className="mb-3">
                            <label className="form-label">Count</label>
                            <input
                              type="number"
                              className="form-control"
                              value={breakdown.count}
                              onChange={(e) =>
                                updateBreakdownReason(
                                  index,
                                  "count",
                                  e.target.value
                                )
                              }
                              style={{ backgroundColor: "#f8f9fa" }}
                              min="0"
                            />
                          </div>
                        </CCol>
                        <CCol md="3">
                          <div className="mb-3">
                            <label className="form-label">Actions</label>
                            <CButton
                              color="danger"
                              size="sm"
                              className="d-block"
                              onClick={() => {
                                setSelectedBreakdownIndex(index);
                                setShowBreakdownModal(true);
                              }}
                              disabled={!site_id}
                            >
                              Add Robots
                            </CButton>
                          </div>
                        </CCol>
                      </CRow>
                      {breakdown.robots && breakdown.robots.length > 0 && (
                        <div>
                          <small className="text-muted">Selected Robots:</small>
                          <div className="mt-2">
                            {breakdown.robots.map((robot, robotIndex) => (
                              <div
                                key={robotIndex}
                                className="d-inline-block me-2 mb-2"
                              >
                                <CBadge
                                  color="danger"
                                  className="d-flex align-items-center"
                                >
                                  {robot.robot_no} - {robot.block}
                                  <CButton
                                    color="light"
                                    size="sm"
                                    variant="ghost"
                                    className="ms-1 p-0"
                                    style={{
                                      fontSize: "12px",
                                      width: "20px",
                                      height: "20px",
                                    }}
                                    onClick={() =>
                                      removeRobotFromBreakdown(
                                        index,
                                        robotIndex
                                      )
                                    }
                                  >
                                    ×
                                  </CButton>
                                </CBadge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </CCol>
            </CRow>

            <CCol md="6">
              <div className="mb-3">
                <label className="form-label">Comments</label>

                <textarea
                  type="textarea"
                  className="form-control"
                  name="comments"
                  rows={2}
                  value={state.dprData.comments}
                  onChange={handleChange}
                  placeholder="Enter comments..."
                ></textarea>
              </div>
            </CCol>

            {/* Technicians Present Section */}
            <CRow className="mb-4">
              <CCol md="12">
                <h4 className="text-primary mb-3">Technicians Present</h4>
              </CCol>
              <CCol md="12">
                {state.loadingTechnicians ? (
                  <div className="text-center">
                    <LoadingSpinner />
                    <p>Loading technicians...</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <CTable striped bordered className="mt-2">
                      <CTableHead color="secondary">
                        <CTableRow>
                          <CTableHeaderCell>#</CTableHeaderCell>
                          <CTableHeaderCell style={{ width: "50px" }}>
                            Present
                          </CTableHeaderCell>
                          <CTableHeaderCell>Image</CTableHeaderCell>
                          <CTableHeaderCell>Name</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {state.technicians.map((tech, index) => (
                          <CTableRow key={index}>
                            <CTableHeaderCell>{index + 1}</CTableHeaderCell>
                            <CTableDataCell>
                              <CFormCheck
                                checked={state.dprData.technician_present.some(
                                  (t) => t.technician_id === tech._id
                                )}
                                onChange={(e) => {
                                  const updatedList = e.target.checked
                                    ? [
                                        ...state.dprData.technician_present,
                                        {
                                          name: tech.username,
                                          email: tech.email,
                                          technician_id: tech._id,
                                          _id: tech._id,
                                          role: tech.role,
                                          profile_image: tech.profile_image,
                                        },
                                      ]
                                    : state.dprData.technician_present.filter(
                                        (t) => t.technician_id !== tech._id
                                      );
                                  dispatch({
                                    type: "SET_FIELD",
                                    name: "technician_present",
                                    value: updatedList,
                                  });
                                }}
                              />
                            </CTableDataCell>
                            <CTableDataCell>
                              <CAvatar
                                src={tech.profile_image}
                                className="me-2"
                              />
                            </CTableDataCell>
                            <CTableDataCell>
                              {tech.username} - {tech.email}
                            </CTableDataCell>
                          </CTableRow>
                        ))}
                      </CTableBody>
                    </CTable>
                  </div>
                )}
              </CCol>
            </CRow>
            <CRow>
              <CCol
                md="12"
                className="d-flex justify-content-end align-items-center text-center "
              >
                <CButton
                  color="warning"
                  size="sm"
                  type="submit"
                  disabled={state.loading}
                >
                  {state.loading ? (
                    <>
                      Adding... <LoadingSpinner />
                    </>
                  ) : (
                    "Create DPR"
                  )}
                </CButton>
              </CCol>
            </CRow>
          </form>
        </CCardBody>
      </CCard>

      {/* PM Robot Selection Modal */}
      <CModal
        visible={showPMModal}
        onClose={() => setShowPMModal(false)}
        size="lg"
      >
        <CModalHeader closeButton={false}>
          <CModalTitle>Select Robots for {selectedPMType} PM</CModalTitle>
          <button
            type="button"
            className=" border-0 ms-auto py-0 px-1"
            onClick={() => setShowPMModal(false)}
            style={{ background: "none" }}
          >
            <CIcon icon={cilX} size="lg" />
          </button>
        </CModalHeader>
        <CModalBody>
          {state.loadingPMDetails ? (
            <div className="text-center">
              <LoadingSpinner />
              <p>Loading PM details...</p>
            </div>
          ) : state.pmDetails.length === 0 ? (
            <div className="text-center">
              <p className="text-muted">
                No Preventive Maintenance details found for {selectedPMType}{" "}
                type on {state.dprData.report_date}
              </p>
            </div>
          ) : (
            <CTable striped>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Robot No</CTableHeaderCell>
                  <CTableHeaderCell>Block</CTableHeaderCell>
                  <CTableHeaderCell>Robot Type</CTableHeaderCell>
                  <CTableHeaderCell>Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {state.pmDetails.map((pmRobot, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>{pmRobot.robot_no}</CTableDataCell>
                    <CTableDataCell>{pmRobot.block}</CTableDataCell>
                    <CTableDataCell>{pmRobot.robot_type}</CTableDataCell>
                    <CTableDataCell>
                      <CButton
                        color="success"
                        size="sm"
                        onClick={() => {
                          addPMRobot(pmRobot);
                          toast.success(
                            `Added ${pmRobot.robot_no} to ${selectedPMType} PM`
                          );
                        }}
                        disabled={state.dprData.preventive_maintenance_status[
                          selectedPMType
                        ]?.robots?.some((r) => r.robot_id === pmRobot.robot_id)}
                      >
                        {state.dprData.preventive_maintenance_status[
                          selectedPMType
                        ]?.robots?.some((r) => r.robot_id === pmRobot.robot_id)
                          ? "Added"
                          : "Add"}
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            size="sm"
            onClick={() => setShowPMModal(false)}
          >
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Breakdown Robot Selection Modal */}
      <CModal
        visible={showBreakdownModal}
        onClose={() => setShowBreakdownModal(false)}
        size="lg"
        fullscreen="sm-down"
      >
        <CModalHeader closeButton={false}>
          <CModalTitle>Select Robots for Breakdown</CModalTitle>
          <button
            type="button"
            className=" border-0 ms-auto py-0 px-1"
            onClick={() => setShowBreakdownModal(false)}
            style={{ background: "none" }}
          >
            <CIcon icon={cilX} size="lg" />
          </button>
        </CModalHeader>
        <CModalBody>
          {state.loadingRobots ? (
            <div className="text-center">
              <LoadingSpinner />
              <p>Loading robots...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <CTable striped>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Robot No</CTableHeaderCell>
                    <CTableHeaderCell>Block</CTableHeaderCell>
                    <CTableHeaderCell>DevEUI</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Action</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {state.availableRobots.map((robot, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>{robot.robot_no}</CTableDataCell>
                      <CTableDataCell>{robot.block}</CTableDataCell>
                      <CTableDataCell>{robot.deveui}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge
                          color={
                            robot.lora_state === "online" ? "success" : "danger"
                          }
                        >
                          {robot.lora_state || "Unknown"}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          color="danger"
                          size="sm"
                          onClick={() => {
                            addRobotToBreakdown(selectedBreakdownIndex, robot);
                            toast.success(
                              `Added ${robot.robot_no} to breakdown reason`
                            );
                          }}
                          disabled={
                            selectedBreakdownIndex >= 0 &&
                            state.dprData.breakdown_reasons[
                              selectedBreakdownIndex
                            ]?.robots?.some((r) => r.robot_id === robot._id)
                          }
                        >
                          {selectedBreakdownIndex >= 0 &&
                          state.dprData.breakdown_reasons[
                            selectedBreakdownIndex
                          ]?.robots?.some((r) => r.robot_id === robot._id)
                            ? "Added"
                            : "Add"}
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            size="sm"
            onClick={() => setShowBreakdownModal(false)}
          >
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};
export default SiteTechnicianAddDpr;
