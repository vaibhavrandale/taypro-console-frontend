import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  CFormInput,
  CFormSelect,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilCloudUpload, cilX } from "@coreui/icons";
import "../service-tickets/servicetickts.css";

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
      total_running_robots: "",
      total_failed_robots: "",
      robots_run_by: "",
      total_robots: "",
      comments: "",
      technician_present: [],
    },
    siteIds: [],
    technicians: [],
    loading: false,
    loadingSiteIds: false,
    loadingTechnicians: false,
    error: "",
    success: false,
  });
  //   const [image, setImage] = useState("");
  //   const [uploading, setUploading] = useState(false);
  const [site_id, setSiteId] = useState("");
  const [filteredTechnicians, setFilteredTechnicians] = useState([]);
  const [showSuggestionsIndex, setShowSuggestionsIndex] = useState(null);

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
    const fetchSiteTechnicians = async () => {
      dispatch({ type: "FETCH_TECHNICIAN_REQUEST" });
      try {
        const result = await axios.get(`/api/v1/users/role/sitetechnician`, {
          headers: { Authorization: `Bearer ${authtoken}` },
        });
        dispatch({
          type: "FETCH_TECHNICIAN_SUCCESS",
          payload: result.data.data,
        });
        console.log(result);
      } catch (error) {
        dispatch({
          type: "FETCH_TECHNICIAN_FAIL",
          payload: error.response?.data?.error || "Error fetching Technicians!",
        });
        toast.error(error.response.data.error || "Error fetching Technicians!");
      }
    };
    fetchSiteIds();
    fetchSiteTechnicians();
  }, [authtoken]);

  const handleChange = (e) => {
    dispatch({
      type: "SET_FIELD",
      name: e.target.name,
      value: e.target.value,
    });
  };

  const handleSiteNameChange = (e) => {
    dispatch({ type: "SELECT_SITENAME_REQUEST" });

    const selectedSiteName = e.target.value;
    const selectedSite = state.siteIds.find(
      (site) => site.site_id.toString() === selectedSiteName
    );

    if (selectedSite) {
      setSiteId(selectedSite.site_id);

      dispatch({ type: "SELECT_SITENAME_SUCCESS", payload: selectedSite });
    } else {
      dispatch({ type: "SELECT_SITENAME_FAIL" });
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
      siteId: site_id,
      ...filteredTechnicians,
    };
    try {
      console.log(state.dprData);
      const data = await axios.post("/api/v1/techniciandprs", newdata, {
        headers: { Authorization: `Bearer ${authtoken}` },
      });
      console.log(data);
      toast.success("Daily Progress Report Added Successfully!");
      dispatch({ type: "SUBMIT_SUCCESS" });

      navigate(`/master-admin/all-site-dpr`);
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
                    {state.siteIds?.length > 0 &&
                      state.siteIds.map((item) => (
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
              <CCol
                md={12}
                className="mt-4 d-flex justify-content-between align-items-center"
              >
                <h5 className="fw-bold">Technicians Present</h5>
                <CButton
                  color="success"
                  size="sm"
                  onClick={() => {
                    dispatch({
                      type: "SET_FIELD",
                      name: "technician_present",
                      value: [
                        ...state.dprData.technician_present,
                        { username: "", id: "" },
                      ],
                    });
                  }}
                >
                  + Add Technician
                </CButton>
              </CCol>

              {/* Technician Table */}
              <CTable striped bordered className="mt-2">
                <CTableHead color="secondary">
                  <CTableRow>
                    <CTableHeaderCell>#</CTableHeaderCell>
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
                      <CTableDataCell className="position-relative">
                        <CFormInput
                          type="text"
                          placeholder="Search Technician..."
                          onChange={(e) => {
                            const searchValue = e.target.value.toLowerCase();
                            const filtered = state.technicians
                              .filter((tech) =>
                                tech.username
                                  .toLowerCase()
                                  .includes(searchValue)
                              )
                              .slice(0, 5);
                            setFilteredTechnicians(filtered);
                            setShowSuggestionsIndex(0);
                          }}
                          onFocus={() => setShowSuggestionsIndex(0)}
                          onBlur={() =>
                            setTimeout(() => setShowSuggestionsIndex(null), 200)
                          }
                        />

                        {showSuggestionsIndex !== null &&
                          filteredTechnicians.length > 0 && (
                            <div className="suggestion-dropdown">
                              {filteredTechnicians.map((tech, idx) => (
                                <div
                                  key={idx}
                                  className="suggestion-item m-2"
                                  onClick={() => {
                                    dispatch({
                                      type: "SET_FIELD",
                                      name: "technician_present",
                                      value: [
                                        ...state.dprData.technician_present,
                                        tech,
                                      ],
                                    });
                                    setFilteredTechnicians([]);
                                    setShowSuggestionsIndex(null);
                                  }}
                                >
                                  <CAvatar
                                    src={tech.profile_image}
                                    className="me-2"
                                  />
                                  {tech.username}
                                </div>
                              ))}
                            </div>
                          )}
                      </CTableDataCell>

                      {/* Remove Button */}
                      <CTableDataCell className="text-center">
                        <CButton
                          size="sm"
                          onClick={() => {
                            const updatedTechs =
                              state.dprData.technician_present.filter(
                                (_, i) => i !== index
                              );
                            dispatch({
                              type: "SET_FIELD",
                              name: "technician_present",
                              value: updatedTechs,
                            });
                          }}
                        >
                          ❌
                        </CButton>
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
