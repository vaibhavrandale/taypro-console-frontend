import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormSelect,
  CRow,
} from "@coreui/react";

const reducer = (state, action) => {
  switch (action.type) {
    case "SUBMIT_REQUEST":
      return { ...state, loading: true, success: false };
    case "SUBMIT_SUCCESS":
      return { ...state, loading: false, success: true };
    case "SET_FIELD":
      return {
        ...state,
        coordinatesData: {
          ...state.coordinatesData,
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
      };
    case "SELECT_SITENAME_FAIL":
      return { ...state, loadingFields: false };
    default:
      return state;
  }
};

//to add new site coordinates
const AddSitesCoordinates = () => {
  const authtoken = useSelector((state) => state.authtoken);
  const navigate = useNavigate();

  const [state, dispatch] = useReducer(reducer, {
    coordinatesData: {
      longitude: "",
      latitude: "",
      radius: "",
    },
    loading: false,
    success: false,
    loadingFields: false,
    loadingSites: false,
    loadingSiteIds: false,
    siteIds: [],
    error: "",
  });

  const [siteName, setSiteName] = useState({
    site_id: "",
  });

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
    fetchSiteIds();
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
      setSiteName({
        site_id: selectedSite.site_id,
      });

      dispatch({ type: "SELECT_SITENAME_SUCCESS", payload: selectedSite });
    } else {
      dispatch({ type: "SELECT_SITENAME_FAIL" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "SUBMIT_REQUEST" });

    const newData = {
      ...siteName,
      ...state.coordinatesData,
    };
    try {
      await axios.post("/api/v1/sites-coordinates", newData, {
        headers: { Authorization: `Bearer ${authtoken}` },
      });
      toast.success("Site Coordinates Added Successfully!");
      dispatch({ type: "SUBMIT_SUCCESS" });

      navigate(`/${adminroute}/sites-coordinates`);
    } catch (error) {
      dispatch({
        type: "SUBMIT_FAIL",
        payload: error.response?.data?.error || "Error Adding Site Coordinates",
      });

      toast.error(error.response.data.error || "Error Adding Site Coordinates");
    }
  };

  return (
    <div className="container mt-6">
      <CCard>
        <CCardHeader>
          <h2>Add Site Coordinates</h2>
        </CCardHeader>
        <CCardBody>
          <CForm className="space-y-4">
            <CRow>
              <CCol md="6">
                <div className="mb-3">
                  <label className="form-label">Site Id</label>
                  <CFormSelect
                    name="site_id"
                    value={siteName.site_id}
                    onChange={handleSiteNameChange}
                  >
                    <option value="">Select Site Name</option>
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
                  <label className="form-label">Longitude</label>

                  <input
                    type="text"
                    className="form-control"
                    name="longitude"
                    value={state.coordinatesData.longitude}
                    onChange={handleChange}
                  />
                </div>
              </CCol>
              <CCol md="6">
                <div className="mb-3">
                  <label className="form-label">Latitude</label>

                  <input
                    type="text"
                    className="form-control"
                    name="latitude"
                    value={state.coordinatesData.latitude}
                    onChange={handleChange}
                  />
                </div>
              </CCol>
              <CCol md="6">
                <div className="mb-3">
                  <label className="form-label">Radius(cm)</label>

                  <input
                    type="text"
                    className="form-control"
                    name="radius"
                    value={state.coordinatesData.radius}
                    onChange={handleChange}
                  />
                </div>
              </CCol>
            </CRow>

            <CRow className="mb-3"></CRow>

            <Link onClick={handleSubmit} className="btn btn-warning btn-sm">
              {state.loading ? (
                <>
                  Adding..
                  <LoadingSpinner />
                </>
              ) : (
                "Add Site Coordinates"
              )}
            </Link>
          </CForm>
        </CCardBody>
      </CCard>
    </div>
  );
};
export default AddSitesCoordinates;
