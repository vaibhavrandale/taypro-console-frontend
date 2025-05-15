import React, { useEffect, useReducer, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
} from "@coreui/react";
import LoadingSpinner from "../../../components/LoadingSpinner";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return {
        ...state,
        preventivemaintanance: action.payload,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "UPDATE_REQUEST":
      return { ...state, updating: true };
    case "UPDATE_SUCCESS":
      return { ...state, updating: false };
    case "UPDATE_FAIL":
      return { ...state, updating: false, error: action.payload };

    case "UPLOAD_REQUEST":
      return {
        ...state,
        loadingUpload: { ...state.loadingUpload, [action.field]: true },
      };

    case "UPLOAD_SUCCESS":
      return {
        ...state,
        loadingUpload: { ...state.loadingUpload, [action.field]: false },
      };

    case "UPLOAD_FAIL":
      return {
        ...state,
        loadingUpload: { ...state.loadingUpload, [action.field]: false },
        errorUpload: action.payload,
      };

    default:
      return state;
  }
};
const UpdateTechnicianPreventivemaintanance = () => {
  const [{ loading, loadingUpload }, dispatch] = useReducer(reducer, {
    preventivemaintanance: {},
    loading: true,
    error: "",
    updating: false,
    loadingUpload: false,
  });
  const { id } = useParams();
  const navigate = useNavigate();
  const authtoken = useSelector((state) => state.authtoken);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchMaintenance = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" }); // Show loading
        const response = await axios.get(
          `/api/v1/preventivemaintenances/${id}`,
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );
        const data = response.data?.data || {};
        dispatch({ type: "FETCH_SUCCESS" }); // Show loading
        setFormData(data);
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: error.response?.data?.error });
        toast.error(error.response?.data?.error || "Failed to fetch data");
      }
    };

    fetchMaintenance();
  }, [id, authtoken]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "UPDATE_REQUEST" }); // Show loading
      const { createdAt, _id, last_activity, ...filteredFormData } = formData;
      await axios.put(
        `/api/v1/preventivemaintenances/${id}`,

        filteredFormData,

        { headers: { Authorization: `Bearer ${authtoken}` } }
      );
      dispatch({ type: "UPDATE_SUCCESS" }); // Show loading
      toast.success("Preventive Maintenance updated successfully!");
      navigate(`/site-technician/preventive-maintanance-dashboard`);
    } catch (error) {
      dispatch({ type: "UPDATE_FAIL", error: error.response?.data?.error });
      toast.error(
        error.response?.data?.error || "Failed to update maintenance"
      );
    }
  };

  const handleImageUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    const bodyFormData = new FormData();
    bodyFormData.append("file", file);

    dispatch({ type: "UPLOAD_REQUEST", field: fieldName }); // Set loading for this specific field

    try {
      const { data } = await axios.post(
        "/api/v1/image-upload/preventive-maintanance",
        bodyFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authtoken}`,
          },
        }
      );

      if (data?.url) {
        setFormData((prev) => ({
          ...prev,
          [fieldName]: data.url, // Update only the specific field
        }));
      }

      dispatch({ type: "UPLOAD_SUCCESS", field: fieldName }); // Stop loading for this field
      toast.success("Image uploaded successfully.");
    } catch (err) {
      dispatch({
        type: "UPLOAD_FAIL",
        field: fieldName,
        payload: "Upload failed",
      });
      toast.error("Image upload failed.");
    }
  };

  return (
    <CCard className="max-w-3xl mx-auto p-6 shadow-lg rounded-lg">
      <CCardHeader>
        <h2>Update Preventive Maintenance: {}</h2>
      </CCardHeader>

      <CCardBody>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <CForm onSubmit={handleSubmit}>
            <CRow className="gy-3">
              {[
                "pm_id",
                "robot_no",
                "robot_type",
                "client_id",
                "site_name",
                "site_id",
                "site_location",
              ].map((field) => (
                <CCol md={6} key={field}>
                  <CFormLabel>{field.replace(/_/g, " ")}</CFormLabel>
                  <CFormInput
                    name={field}
                    value={formData[field] || ""}
                    onChange={handleChange}
                    required
                  />
                </CCol>
              ))}

              {[
                "physical_condition_of_transPipe_condition",
                "physical_condition_of_channel_condition",
                "physical_condition_of_top_bottom_cover_condition",
                "mf_clothes_alignment",
                "wheels_alignment",
              ].map((field) => (
                <CCol md={6} key={field}>
                  <CFormLabel>{field.replace(/_/g, " ")}</CFormLabel>
                  <CFormSelect
                    name={field}
                    value={formData[field] || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="OK">OK</option>
                    <option value="Not OK">Not OK</option>
                  </CFormSelect>
                </CCol>
              ))}

              {[
                "oiling_need_for_bearing_condition",
                "oiling_need_for_coupling_condition",
                "oiling_need_for_motors_condition",

                "is_wheels_loose",
                "is_nutbolt_loose",
              ].map((field) => (
                <CCol md={6} key={field}>
                  <CFormLabel>{field.replace(/_/g, " ")}</CFormLabel>
                  <CFormSelect
                    name={field}
                    value={formData[field] || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </CFormSelect>
                </CCol>
              ))}

              {[
                "physical_condition_of_transPipe_image",
                "physical_condition_of_channel_image",
                "physical_condition_of_top_bottom_cover_image",
                "oiling_need_for_bearing_condition_image",
                "oiling_need_for_coupling_image",
                "oiling_need_for_motors_image",
              ].map((field) => (
                <CCol md={6} key={field}>
                  <CFormLabel>{field.replace(/_/g, " ")}</CFormLabel>

                  {loadingUpload[field] ? ( // Show spinner only for this field
                    <LoadingSpinner />
                  ) : formData[field] ? (
                    <Link to={formData[field]} target="_blank">
                      View
                    </Link>
                  ) : (
                    <p>No Image Available</p>
                  )}

                  <CFormInput
                    type="file"
                    onChange={(e) => handleImageUpload(e, field)}
                  />
                </CCol>
              ))}

              <CCol md={6}>
                <CFormLabel>Start Date</CFormLabel>
                <CFormInput
                  type="date"
                  name="start_date"
                  value={formData.start_date || ""}
                  onChange={handleChange}
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel>End Date</CFormLabel>
                <CFormInput
                  type="date"
                  name="end_date"
                  value={formData.end_date || ""}
                  onChange={handleChange}
                />
              </CCol>

              <CButton type="submit" color="primary" className="mt-3">
                Update Maintenance
              </CButton>
            </CRow>
          </CForm>
        )}
      </CCardBody>
    </CCard>
  );
};

export default UpdateTechnicianPreventivemaintanance;
