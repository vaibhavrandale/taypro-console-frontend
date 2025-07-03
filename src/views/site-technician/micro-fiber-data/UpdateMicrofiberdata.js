import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormSelect,
  CRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilCloudUpload, cilX } from "@coreui/icons";
import "../service-tickets/servicetickts.css";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_SITES_REQUEST":
      return { ...state, loadingSites: true, error: "" };
    case "FETCH_SITES_SUCCESS":
      return { ...state, loadingSites: false, sites: action.payload };
    case "FETCH_SITES_FAIL":
      return { ...state, loadingSites: false, error: action.payload };
    case "FETCH_MICROFIBER_SUCCESS":
      return { ...state, microfiberdata: action.payload };
    case "SUBMIT_REQUEST":
      return { ...state, loading: true };
    case "SUBMIT_SUCCESS":
      return { ...state, loading: false, success: true };
    case "SUBMIT_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "SET_FIELD":
      return {
        ...state,
        microfiberdata: {
          ...state.microfiberdata,
          [action.name]: action.value,
        },
      };
    default:
      return state;
  }
};

const UpdateMicrofiberdata = () => {
  const authtoken = useSelector((state) => state.authtoken);
  const navigate = useNavigate();
  const { id } = useParams();

  const [state, dispatch] = useReducer(reducer, {
    microfiberdata: { site_id: "", category: "", image: "" },
    loadingSites: false,
    sites: [],
    loading: false,
    success: false,
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_SITES_REQUEST" });
      try {
        const [siteRes, microfiberRes] = await Promise.all([
          axios.get(`/api/v1/sites`, {
            headers: { Authorization: `Bearer ${authtoken}` },
          }),
          axios.get(`/api/v1/microfiberdata/get-by-id/${id}`, {
            headers: { Authorization: `Bearer ${authtoken}` },
          }),
        ]);

        dispatch({ type: "FETCH_SITES_SUCCESS", payload: siteRes.data.data });
        dispatch({
          type: "FETCH_MICROFIBER_SUCCESS",
          payload: microfiberRes.data.data,
        });
      } catch (err) {
        toast.error("Failed to fetch microfiber data or site list.");
        dispatch({ type: "FETCH_SITES_FAIL", payload: err.message });
      }
    };

    fetchData();
  }, [authtoken, id]);

  const handleChange = (e) => {
    dispatch({
      type: "SET_FIELD",
      name: e.target.name,
      value: e.target.value,
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const { data } = await axios.post(
        "/api/v1/image-upload/service-item",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authtoken}`,
          },
        }
      );

      dispatch({
        type: "SET_FIELD",
        name: "image",
        value: data.url,
      });

      toast.success("Image uploaded successfully.");
    } catch {
      toast.error("Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const deleteImageHandler = () => {
    dispatch({
      type: "SET_FIELD",
      name: "image",
      value: "",
    });
    toast.success("Image removed.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !state.microfiberdata.site_id ||
      !state.microfiberdata.category ||
      !state.microfiberdata.image
    ) {
      toast.error(
        "All fields are required. Please fill out the form completely."
      );
      return;
    }
    dispatch({ type: "SUBMIT_REQUEST" });

    try {
      await axios.put(`/api/v1/microfiberdata/${id}`, state.microfiberdata, {
        headers: { Authorization: `Bearer ${authtoken}` },
      });

      toast.success("Micro Fiber Data updated successfully!");
      dispatch({ type: "SUBMIT_SUCCESS" });
      navigate(`/site-technician/micro-fiber-data`);
    } catch (err) {
      dispatch({
        type: "SUBMIT_FAIL",
        payload: err.response?.data?.error || "Error updating data",
      });
      toast.error(err.response?.data?.error || "Error updating data");
    }
  };

  return (
    <div className="container mt-6">
      <CCard>
        <CCardHeader>
          <h2>Update Micro Fiber Data</h2>
        </CCardHeader>
        <CCardBody>
          <form onSubmit={handleSubmit}>
            <CRow>
              <CCol md="6">
                <div className="mb-3">
                  <label className="form-label">
                    Site ID {state.loadingSites && <LoadingSpinner />}
                  </label>
                  <CFormSelect
                    name="site_id"
                    value={state.microfiberdata.site_id}
                    onChange={handleChange}
                  >
                    <option value="">Select Site</option>
                    {state.sites.map((site) => (
                      <option key={site.site_id} value={site.site_id}>
                        {site.site_id}
                      </option>
                    ))}
                  </CFormSelect>
                </div>
              </CCol>

              <CCol md="6">
                <div className="mb-3">
                  <label className="form-label">Microfiber Condition</label>
                  <CFormSelect
                    name="category"
                    value={state.microfiberdata.category}
                    onChange={handleChange}
                  >
                    <option value="">Select Condition</option>
                    <option value="Good">Good</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Bad">Bad</option>
                  </CFormSelect>
                </div>
              </CCol>

              <CCol className="mt-4" md="3">
                <div className="mb-3">
                  <label className="form-label">Upload Image</label>
                  <div className="container-btn-file p-2 m-2 w-80">
                    <CIcon icon={cilCloudUpload} className="upload-icon" />
                    <input
                      type="file"
                      name="image"
                      onChange={handleImageUpload}
                      className="mb-3 file"
                      disabled={uploading}
                    />
                  </div>
                </div>
              </CCol>

              <CCol md="3">
                {uploading ? (
                  <div className="d-flex justify-content-center">
                    <LoadingSpinner />
                  </div>
                ) : state.microfiberdata.image ? (
                  <div className="position-relative d-inline-block">
                    <img
                      src={state.microfiberdata.image}
                      alt="Uploaded"
                      width="100"
                      height="100"
                      style={{ objectFit: "cover", borderRadius: "5px" }}
                    />
                    <CBadge
                      color="primary"
                      className="p-1 position-absolute"
                      style={{
                        top: "-8px",
                        right: "-8px",
                        cursor: "pointer",
                        borderRadius: "50%",
                        backgroundColor: "red",
                      }}
                      onClick={deleteImageHandler}
                    >
                      <CIcon icon={cilX} size="sm" />
                    </CBadge>
                  </div>
                ) : null}
              </CCol>
            </CRow>

            <button type="submit" className="btn btn-warning btn-sm">
              {state.loading ? (
                <>
                  Updating...
                  <LoadingSpinner />
                </>
              ) : (
                "Update"
              )}
            </button>
          </form>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default UpdateMicrofiberdata;
