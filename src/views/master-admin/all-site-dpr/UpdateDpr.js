import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import {
  CAvatar,
  CButton,
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
import LoadingSpinner from "../../../components/LoadingSpinner";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_DPR_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_DPR_SUCCESS":
      return { ...state, loading: false, dprData: action.payload };
    case "FETCH_DPR_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "SET_FIELD":
      return {
        ...state,
        dprData: { ...state.dprData, [action.name]: action.value },
      };
    case "UPDATE_REQUEST":
      return { ...state, updateLoading: true, success: false };
    case "UPDATE_SUCCESS":
      return { ...state, updateLoading: false, success: true };
    case "UPDATE_FAIL":
      return {
        ...state,
        updateLoading: false,
        error: action.payload,
        success: false,
      };

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
    default:
      return state;
  }
};

const UpdateDpr = () => {
  const { id } = useParams();
  const authtoken = useSelector((state) => state.authtoken);
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.userInfo);
  let adminroute = "";

  if (userInfo.role === "Master Admin") {
    adminroute = "master-admin";
  } else if (userInfo.role === "Service Admin") {
    adminroute = "service-admin";
  } else if (userInfo.role === "Project Admin") {
    adminroute = "project-admin";
  }

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
    loading: false,
    error: "",
    success: false,
    updateLoading: false,
    sites: [],
    technicians: [],
  });

  useEffect(() => {
    const fetchDprDetails = async () => {
      dispatch({ type: "FETCH_DPR_REQUEST" });
      try {
        const result = await axios.get(`/api/v1/techniciandprs/${id}`, {
          headers: { Authorization: `Bearer ${authtoken}` },
        });

        dispatch({ type: "FETCH_DPR_SUCCESS", payload: result.data.data });
      } catch (error) {
        dispatch({
          type: "FETCH_DPR_FAIL",
          payload: error.response?.data?.error || "Error fetching DPR details",
        });
      }
    };
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
    fetchSiteIds();
    fetchDprDetails();
  }, [id, authtoken]);

  const handleChange = (e) => {
    dispatch({ type: "SET_FIELD", name: e.target.name, value: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "UPDATE_REQUEST" });

    try {
      const {
        createdAt,
        _id,
        last_activity,
        assigned_to,
        created_by,
        ...updatedData
      } = state.dprData;
      const result = await axios.put(
        `/api/v1/techniciandprs/${id}`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${authtoken}` },
        }
      );
      toast.success(result.data.message);
      dispatch({ type: "UPDATE_SUCCESS" });
      navigate(`/${adminroute}/all-site-dpr`);
    } catch (error) {
      dispatch({
        type: "UPDATE_FAIL",
        payload: error.response?.data?.error || "Error updating DPR",
      });
      toast.error(error.response?.data?.error || "Error updating DPR");
    }
  };

  return (
    <div className="container mt-6">
      <CCard>
        <CCardHeader>
          <h2>Update Technician Daily Progress Report (DPR)</h2>
        </CCardHeader>

        <CCardBody>
          {state.loading ? (
            <LoadingSpinner />
          ) : (
            <form onSubmit={handleSubmit}>
              <CRow>
                <CCol>
                  <label className="form-label">Site Id</label>
                  <CFormSelect
                    name="site_id"
                    value={state.dprData.site_id}
                    onChange={handleChange}
                  >
                    <option value="">Select Site Id</option>
                    {state.sites?.length > 0 &&
                      state.sites.map((item) => (
                        <option key={item.site_id} value={item.site_id}>
                          {item.site_id}
                        </option>
                      ))}
                  </CFormSelect>
                </CCol>
                <CCol md="6">
                  <div className="mb-3">
                    <label className="form-label">Running Robots</label>

                    <input
                      type="text"
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
                      type="text"
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
                      type="text"
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
                    {state.dprData.technician_present.map((tech, index) => (
                      <CTableRow key={index}>
                        <CTableHeaderCell>{index + 1}</CTableHeaderCell>
                        <CTableDataCell>
                          <CAvatar src={tech.profile_image} className="me-2" />
                        </CTableDataCell>
                        <CTableDataCell>
                          {tech.name} - {tech.email}
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
              <CButton
                size="sm"
                type="submit"
                siz
                className="btn btn-primary mt-3"
              >
                {state.updateLoading ? (
                  <>
                    upadting..
                    <LoadingSpinner />
                  </>
                ) : (
                  "Update"
                )}
              </CButton>
            </form>
          )}
        </CCardBody>
      </CCard>
    </div>
  );
};

export default UpdateDpr;
