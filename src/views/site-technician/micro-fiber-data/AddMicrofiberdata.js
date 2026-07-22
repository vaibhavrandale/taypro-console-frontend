import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import LoadingSpinner from "../../../components/LoadingSpinner";
import {
  CBadge,
  CButton,
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
    case "SUBMIT_REQUEST":
      return { ...state, loading: true, success: false };
    case "SUBMIT_SUCCESS":
      return { ...state, loading: false, success: true };
    case "SET_FIELD":
      return {
        ...state,
        microfiberdata: {
          ...state.microfiberdata,
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

const AddMicrofiberdata = () => {
  // const authtoken = useSelector((state) => state.authtoken);
  const navigate = useNavigate();

  const [state, dispatch] = useReducer(reducer, {
    microfiberdata: {
      category: "",
    },
    loadingSites: false,
    sites: [],
    loading: false,
    success: false,
    loadingUpload: false,
  });
  const [site_id, setSiteId] = useState("");
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchSites = async () => {
      dispatch({ type: "FETCH_SITES_REQUEST" });
      try {
        const res = await axios.get(`/api/v1/sites`, {
          // headers: { Authorization: `Bearer ${authtoken}` },
          withCredentials: true,
        });
        console.log(res.data.data);
        dispatch({ type: "FETCH_SITES_SUCCESS", payload: res.data.data });
      } catch (err) {
        dispatch({
          type: "FETCH_SITES_FAIL",
          payload: err.response?.data?.error || err.message,
        });
        toast.error("Failed to fetch sites");
      }
    };
    fetchSites();
  }, []);

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

    const bodyFormData = new FormData();
    bodyFormData.append("file", file);

    try {
      setUploading(true);
      const { data } = await axios.post(
        "/api/v1/image-upload/microfiber-cloth",
        bodyFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            // Authorization: `Bearer ${authtoken}`,
          },
          withCredentials: true,
        },
      );

      setImage(data.url);
      toast.success("Image uploaded successfully. Click Update to apply it.");
    } catch (err) {
      toast.error("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const deleteImageHandler = () => {
    setImage("");
    toast.success("Image removed.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!site_id || !image || !state.microfiberdata.category) {
      toast.error(
        "All fields are required.Please fill out the form completely.",
      );
      return;
    }

    dispatch({ type: "SUBMIT_REQUEST" });

    const newdata = {
      ...state.microfiberdata,
      site_id: site_id,
      image: image,
    };
    try {
      await axios.post(
        "/api/v1/microfiberdata/create-microfiberdata",
        newdata,
        {
          // headers: { Authorization: `Bearer ${authtoken}` },
          withCredentials: true,
        },
      );
      toast.success("Micro Fiber Data Added Successfully!");
      dispatch({ type: "SUBMIT_SUCCESS" });

      navigate(`/site-technician/micro-fiber-data`);
    } catch (error) {
      dispatch({
        type: "SUBMIT_FAIL",
        payload: error.response?.data?.error || "Error Adding Micro Fiber Data",
      });

      toast.error(error.response.data.error || "Error Adding Micro Fiber Data");
    }
  };

  return (
    <div className="container mt-6">
      <CCard>
        <CCardHeader>
          <h2>Add Micro Fiber Data</h2>
        </CCardHeader>
        <CCardBody>
          <form>
            <CRow>
              <CCol md="6">
                <div className="mb-3">
                  <label className="form-label">
                    Site Id {state.loadingSites && <LoadingSpinner />}{" "}
                  </label>

                  <CFormSelect
                    name="site_id"
                    value={site_id}
                    onChange={(e) => setSiteId(e.target.value)}
                  >
                    <option value="">Select Site Name</option>
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
                  <label className="form-label">Microfiber Condition</label>
                  <CFormSelect
                    name="category"
                    value={state.microfiberdata.category || ""}
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
                  <div className=" d-flex justify-content-center">
                    <LoadingSpinner />
                  </div>
                ) : image ? (
                  <div className="position-relative d-inline-block">
                    <img
                      src={image}
                      alt="Uploaded Item"
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

            <CButton
              onClick={handleSubmit}
              className="btn btn-warning btn-sm"
              disabled={state.loading}
            >
              {state.loading ? (
                <>
                  Adding..
                  <LoadingSpinner />
                </>
              ) : (
                "Add"
              )}
            </CButton>
          </form>
        </CCardBody>
      </CCard>
    </div>
  );
};
export default AddMicrofiberdata;
