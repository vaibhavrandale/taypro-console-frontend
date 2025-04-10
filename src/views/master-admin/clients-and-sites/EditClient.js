import React, { useEffect, useReducer, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CForm,
  CFormInput,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CSpinner,
  CBadge,
  CCol,
  CFormLabel,
  CFormCheck,
} from "@coreui/react";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import LoadingSpinner from "../../../components/LoadingSpinner";

const initialState = {
  client: {},
  loading: false,
  error: "",
  updateLoading: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, client: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "UPDATE_REQUEST":
      return { ...state, updateLoading: true };
    case "UPDATE_SUCCESS":
      return { ...state, client: action.payload, updateLoading: false };
    case "UPDATE_FAIL":
      return { ...state, updateLoading: false, error: action.payload };
    default:
      return state;
  }
};

const EditClient = () => {
  const [{ loading, error, client, updateLoading }, dispatch] = useReducer(
    reducer,
    initialState
  );
  const { id } = useParams();
  const navigate = useNavigate();
  const authtoken = useSelector((state) => state.authtoken);
  const [formData, setFormData] = useState({
    client_name: "",
    client_id: "",
    logo: "",
    is_deleted: false, // <-- Add this field to track soft delete status
  });
  const [logoFile, setLogoFile] = useState(null);

  useEffect(() => {
    const fetchSite = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });

        const { data } = await axios.get(`/api/v1/sites/${id}`, {
          headers: { Authorization: `Bearer ${authtoken}` },
        });

        console.log("Fetched site data:", data);

        dispatch({ type: "FETCH_SUCCESS", payload: data.data });

        setFormData({
          site_id: data.data.site_id || "",
          site_type: data.data.site_type || "",
          siteName: data.data.siteName || "",
          location: data.data.location || "",
          logo: data.data.logo || "",
          client_id: data.data.client_id || "",
          password: data.data.password || "",
          is_deleted: data.data.is_delete || false,
        });
      } catch (error) {
        console.error(
          "Failed to fetch site:",
          error.response?.data || error.message
        );
        dispatch({ type: "FETCH_FAIL", payload: "Failed to fetch site" });
      }
    };

    fetchSite();
  }, [id, authtoken]);

  const handleFileChange = (e) => {
    setLogoFile(e.target.files[0]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      let updatedData = { ...formData };

      // Upload logo if a new file is selected
      if (logoFile) {
        const formDataUpload = new FormData();
        formDataUpload.append("file", logoFile);
        const uploadRes = await axios.post(
          "/api/v1/image-upload/client-logo",
          formDataUpload,
          {
            headers: {
              Authorization: `Bearer ${authtoken}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        updatedData.logo = uploadRes.data.url;
      }

      const response = await axios.put(`/api/v1/sites/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${authtoken}` },
      });

      dispatch({ type: "UPDATE_SUCCESS", payload: response.data });
      toast.success("Site updated successfully!");
      navigate("/master-admin/clients-dashboard");
    } catch (error) {
      dispatch({ type: "UPDATE_FAIL", payload: error.message });
      toast.error("Failed to update site.");
    }
  };

  return (
    <CCard>
      <CCardHeader>
        Edit Client - <CBadge color="danger">{formData.client_id}</CBadge>
      </CCardHeader>
      <CCardBody>
        {loading ? (
          <CSpinner />
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : (
          <CForm onSubmit={handleUpdate}>
            <CFormInput
              label="Site ID"
              type="text"
              value={formData.site_id}
              onChange={(e) =>
                setFormData({ ...formData, site_id: e.target.value })
              }
              placeholder="Enter Site ID"
              className="my-3"
            />

            <CFormInput
              label="Site Type"
              type="text"
              value={formData.site_type}
              onChange={(e) =>
                setFormData({ ...formData, site_type: e.target.value })
              }
              placeholder="Enter Site Type"
              className="my-3"
            />

            <CFormInput
              label="Site Name"
              type="text"
              value={formData.siteName}
              onChange={(e) =>
                setFormData({ ...formData, siteName: e.target.value })
              }
              placeholder="Enter Site Name"
              className="my-3"
            />

            <CFormInput
              label="Location"
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              placeholder="Enter Location"
              className="my-3"
            />

            <CFormInput
              label="Client ID"
              type="text"
              value={formData.client_id}
              onChange={(e) =>
                setFormData({ ...formData, client_id: e.target.value })
              }
              placeholder="Client ID"
              className="my-3"
            />

            <CFormInput
              label="Password"
              type="text"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="Enter Password"
              className="my-3"
            />

            <CFormInput
              label="Logo"
              type="file"
              onChange={handleFileChange}
              className="my-3"
            />
            {formData.logo && (
              <img
                src={formData.logo}
                alt="Client Logo"
                width="100"
                className="mt-3"
              />
            )}

            {/* Delete Inventory Section */}
            <CCol md="6">
              <CFormLabel>
                Delete Site:
                <span className="text-muted ms-2">
                  {" "}
                  (When checked, it will be soft deleted)
                </span>
              </CFormLabel>
              <br />
              <CFormCheck
                id="is_delete"
                name="is_delete"
                checked={formData.is_delete || false} // Make sure to use formData instead of serviceItemData
                onChange={
                  (e) =>
                    setFormData({ ...formData, is_delete: e.target.checked }) // Handling change to set the 'is_delete' value
                }
              />
            </CCol>

            <div className="d-flex justify-content-end">
              <CButton
                size="sm"
                type="submit"
                color="primary"
                className="mt-3"
                disabled={updateLoading}
              >
                {updateLoading ? (
                  <>
                    Updating...
                    <CSpinner size="sm" />
                  </>
                ) : (
                  "Update"
                )}
              </CButton>
            </div>
          </CForm>
        )}
      </CCardBody>
    </CCard>
  );
};

export default EditClient;
