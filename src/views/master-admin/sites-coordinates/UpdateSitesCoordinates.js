import axios from "axios";
import React, { useState, useEffect, useReducer } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";
import {
  CAlert,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormCheck,
  CFormLabel,
  CRow,
} from "@coreui/react";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, coordinates: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "UPDATE_REQUEST":
      return { ...state, updating: true };
    case "UPDATE_SUCCESS":
      return { ...state, updating: false };
    case "UPDATE_FAIL":
      return { ...state, updating: false, error: action.payload };
    default:
      return state;
  }
};

const UpdateSitesCoordinates = () => {
  const [{ loading, error, updating }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
    updating: false,
  });

  const { id } = useParams();
  const authtoken = useSelector((state) => state.authtoken);

  const userInfo = useSelector((state) => state.userInfo);
  let adminroute = "";

  if (userInfo.role === "Master Admin") {
    adminroute = "master-admin";
  } else if (userInfo.role === "Service Admin") {
    adminroute = "service-admin";
  } else if (userInfo.role === "Project Admin") {
    adminroute = "project-admin";
  }

  const navigate = useNavigate();

  const [coordinatesData, setCoordinatesData] = useState({
    site_id: "",
    longitude: "",
    latitude: "",
    radius: "",
  });

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(
          `/api/v1/sites-coordinates/get-by-siteId/${id}`,
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );
        dispatch({ type: "FETCH_SUCCESS", payload: data.data });
        setCoordinatesData(data.data);
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: error.response?.data || "Failed to fetch data",
        });
        toast.error(error.response?.data || "Failed to fetch data");
      }
    };

    fetchCoordinates();
  }, [id, authtoken]);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;

    setCoordinatesData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Fix: Prevent default form submission

    try {
      dispatch({ type: "UPDATE_REQUEST" });
      const { createdAt, _id, updatedAt, last_activity, ...filteredFormData } =
        coordinatesData;

      await axios.put(`/api/v1/sites-coordinates/${id}`, filteredFormData, {
        headers: { Authorization: `Bearer ${authtoken}` },
      });

      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success("Site Coordinates Updated Successfully!");

      navigate(`/${adminroute}/sites-coordinates`);
    } catch (error) {
      dispatch({ type: "UPDATE_FAIL", payload: "Update failed" });
      toast.error("Update failed");
    }
  };

  return (
    <div className="container mt-4">
      <CCard>
        <CCardHeader>
          Update Site Cordinates -{" "}
          <b className="badge bg-success">{coordinatesData.site_id}</b>
        </CCardHeader>
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <CAlert color="danger">{error}</CAlert>
        ) : (
          <CCardBody>
            <form onSubmit={handleSubmit}>
              <CRow>
                <CCol md="6">
                  <div className="mb-3">
                    <label className="form-label">Site Id</label>
                    <input
                      type="text"
                      className="form-control"
                      name="site_id"
                      value={coordinatesData.site_id || ""}
                      onChange={handleChange}
                    />
                  </div>
                </CCol>
                <CCol md="6">
                  <div className="mb-3">
                    <label className="form-label">Longitude</label>
                    <input
                      type="text"
                      className="form-control"
                      name="longitude"
                      value={coordinatesData.longitude || ""}
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
                      value={coordinatesData.latitude || ""}
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
                      value={coordinatesData.radius || ""}
                      onChange={handleChange}
                    />
                  </div>
                </CCol>
                <CCol md="6">
                  <CFormLabel>
                    Delete Site Coordinates :
                    <span className="text-muted ms-2"></span>
                  </CFormLabel>{" "}
                  <CFormCheck
                    id="is_delete"
                    name="is_delete"
                    checked={coordinatesData.is_delete || false}
                    onChange={handleChange}
                  />{" "}
                </CCol>
              </CRow>

              <button
                type="submit"
                className="btn btn-warning btn-sm"
                disabled={updating}
              >
                {updating ? "Updating..." : "Update"}
              </button>
            </form>
          </CCardBody>
        )}
      </CCard>
    </div>
  );
};

export default UpdateSitesCoordinates;
