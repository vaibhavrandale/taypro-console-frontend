import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";
import {
  CAvatar,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormCheck,
  CFormSelect,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import "../service-tickets/servicetickts.css";

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
    case "SUBMIT_REQUEST":
      return { ...state, loading: true, success: false };
    case "SUBMIT_SUCCESS":
      return { ...state, loading: false, success: true };
    case "SET_FIELD":
      return {
        ...state,
        dprData: {
          ...state.dprData,
          [action.name]: action.value,
        },
      };
    case "SUBMIT_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false,
      };
    default:
      return state;
  }
};

const AddDpr = () => {
  const authtoken = useSelector((state) => state.authtoken);
  const navigate = useNavigate();

  const [state, dispatch] = useReducer(reducer, {
    dprData: {
      site_id: "",
      total_running_robots: "",
      total_failed_robots: "",
      robots_run_by: "",
      total_robots: "",
      comments: "",
      technician_present: [],
    },
    sites: [],
    technicians: [],
    loading: false,
    loadingSiteIds: false,
    loadingTechnicians: false,
    error: "",
    success: false,
  });

  const [site_id, setSiteId] = useState("");

  const userInfo = useSelector((state) => state.userInfo);
  let adminroute = "";

  if (userInfo.role === "Master Admin") {
    adminroute = "master-admin";
  } else if (userInfo.role === "Service Admin") {
    adminroute = "service-admin";
  } else if (userInfo.role === "Project Admin") {
    adminroute = "project-admin";
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

    fetchSiteIds(); // Only fetch site ids here
  }, [authtoken]);

  const handleChange = (e) => {
    dispatch({
      type: "SET_FIELD",
      name: e.target.name,
      value: e.target.value,
    });
  };

  const handleSiteNameChange = async (e) => {
    const selectedSiteId = e.target.value;
    setSiteId(selectedSiteId);

    dispatch({
      type: "SET_FIELD",
      name: "site_id",
      value: selectedSiteId,
    });

    dispatch({
      type: "SET_FIELD",
      name: "technician_present",
      value: [],
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
          payload: error.response?.data?.error || "Error fetching Technicians!",
        });
        toast.error(
          error.response?.data?.error || "Error fetching Technicians!"
        );
      }
    } else {
      dispatch({
        type: "FETCH_TECHNICIAN_SUCCESS",
        payload: [],
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "SUBMIT_REQUEST" });
    if (state.dprData.site_id === "") {
      toast.error("Site Id is required!");
    }
    const newdata = {
      ...state.dprData,
      site_id: state.dprData.site_id, // Use the correct state variable
    };

    try {
      await axios.post("/api/v1/techniciandprs", newdata, {
        headers: { Authorization: `Bearer ${authtoken}` },
      });
      toast.success("Daily Progress Report Added Successfully!");
      dispatch({ type: "SUBMIT_SUCCESS" });

      navigate(`/${adminroute}/all-site-dpr`);
    } catch (error) {
      dispatch({
        type: "SUBMIT_FAIL",
        payload:
          error.response?.data?.error || "Error Adding Daily Progress Report",
      });

      toast.error(
        error.response.data.error || "Error Adding Daily Progress Report"
      );
    }
  };

  return (
    <div className="container mt-6">
      <CCard>
        <CCardHeader>
          <h2>Create Technician Daily Progress Report (DPR)</h2>
        </CCardHeader>
        <CCardBody>
          <form>
            <CRow>
              <CCol>
                <div className="mb-3">
                  <label className="form-label">Site Id</label>
                  <CFormSelect
                    name="site_id"
                    value={site_id}
                    onChange={handleSiteNameChange}
                  >
                    <option value="">Select Site Id</option>
                    {state.sites?.length > 0 &&
                      state.sites.map((item) => (
                        <option key={item.site_id} value={item.site_id}>
                          {item.site_id}
                        </option>
                      ))}
                  </CFormSelect>
                </div>
              </CCol>

              <CCol md="6">
                <div className="mb-3">
                  <label className="form-label">Running Robots</label>

                  <input
                    type="number"
                    className="form-control"
                    name="total_running_robots"
                    value={state.dprData.total_running_robots}
                    onChange={handleChange}
                  />
                </div>
              </CCol>

              <CCol md="6">
                <div className="mb-3">
                  <label className="form-label">Failed Robots</label>

                  <input
                    type="number"
                    className="form-control"
                    name="total_failed_robots"
                    value={state.dprData.total_failed_robots}
                    onChange={handleChange}
                  />
                </div>
              </CCol>

              <CCol md="6">
                <div className="mb-3">
                  <label className="form-label">Total Robots</label>

                  <input
                    type="number"
                    className="form-control"
                    name="total_robots"
                    value={state.dprData.total_robots}
                    onChange={handleChange}
                  />
                </div>
              </CCol>
              <CCol md="6">
                <div className="mb-3">
                  <label className="form-label">robots_run_by</label>

                  <input
                    type="text"
                    className="form-control"
                    name="robots_run_by"
                    value={state.dprData.robots_run_by}
                    onChange={handleChange}
                  />
                </div>
              </CCol>

              <CCol md="6">
                <div className="mb-3">
                  <label className="form-label">Comments</label>

                  <input
                    type="text"
                    className="form-control"
                    name="comments"
                    value={state.dprData.comments}
                    onChange={handleChange}
                  />
                </div>
              </CCol>
              <CCol md="6">
                <div className="mb-3">
                  <label className="form-label"> Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="report_date"
                    value={state.dprData.report_date}
                    onChange={handleChange}
                    max={new Date().toISOString().split("T")[0]} // Optional: restrict to past dates
                  />
                </div>
              </CCol>
              <CTable striped bordered className="mt-2">
                <CTableHead color="secondary">
                  <CTableRow>
                    <CTableHeaderCell>#</CTableHeaderCell>
                    <CTableHeaderCell>Image</CTableHeaderCell>
                    <CTableHeaderCell>Name</CTableHeaderCell>
                    <CTableHeaderCell style={{ width: "80px" }}>
                      Actions
                    </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {state.technicians.map((tech, index) => (
                    <CTableRow key={index}>
                      <CTableHeaderCell>{index + 1}</CTableHeaderCell>
                      <CTableDataCell>
                        <CAvatar src={tech.profile_image} className="me-2" />
                      </CTableDataCell>
                      <CTableDataCell>
                        {tech.username} - {tech.email}
                      </CTableDataCell>
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
                                    technician_id: tech._id, // Ensure consistent field name
                                    _id: tech._id, // Ensure consistent field name
                                    role: tech.role,
                                    profile_image: tech.profile_image,
                                  },
                                ]
                              : state.dprData.technician_present.filter(
                                  (t) => t.technician_id !== tech._id // Match correctly
                                );

                            dispatch({
                              type: "SET_FIELD",
                              name: "technician_present",
                              value: updatedList,
                            });
                          }}
                        />
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CRow>

            <Link onClick={handleSubmit} className="btn btn-warning btn-sm">
              {state.loading ? (
                <>
                  Adding..
                  <LoadingSpinner />
                </>
              ) : (
                "Add"
              )}
            </Link>
          </form>
        </CCardBody>
      </CCard>
    </div>
  );
};
export default AddDpr;
