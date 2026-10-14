import React, { useEffect, useReducer, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CForm,
  CFormInput,
  CFormSelect,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CSpinner,
  CBadge,
  CCol,
  CRow,
  CFormCheck,
} from "@coreui/react";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import LastActivity from "../../../components/LastActivity";

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

const dateInput = (value) => {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
};

const toActivity = (item) => {
  if (item?.details) return item;
  const next = item?.next || {};
  const previous = item?.previous || {};
  const details =
    Object.keys(next)
      .map((key) => `${key}: "${previous[key] ?? ""}" to "${next[key]}"`)
      .join(", ") || item?.reason || "Updated";
  return { ...item, details };
};

const EditClient = () => {
  const [{ loading, error, updateLoading }, dispatch] = useReducer(
    reducer,
    initialState,
  );
  const { id } = useParams();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.userInfo);
  const isMaster = userInfo?.role === "Master Admin";
  const home =
    userInfo?.role === "Service Admin"
      ? "service-admin"
      : userInfo?.role === "Project Admin"
        ? "project-admin"
        : userInfo?.role === "Master User"
          ? "master-user"
          : "master-admin";
  const [activity, setActivity] = useState([]);
  const [formData, setFormData] = useState({
    client_name: "",
    client_id: "",
    logo: "",
    is_deleted: false, // <-- Add this field to track soft delete status
    is_weather_cleaning_enabled: false, // <-- Add this field to track weather cleaning status
  });
  const [logoFile, setLogoFile] = useState(null);

  useEffect(() => {
    const fetchSite = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });

        const { data } = await axios.get(`/api/v1/sites/${id}`, {
          // headers: { Authorization: `Bearer ${authtoken}` },
          withCredentials: true,
        });

        dispatch({ type: "FETCH_SUCCESS", payload: data.data });

        setFormData({
          site_id: data.data.site_id || "",
          site_type: data.data.site_type || "",
          siteName: data.data.siteName || "",
          location: data.data.location || "",
          logo: data.data.logo || "",
          client_id: data.data.client_id || "",
          password: data.data.password || "",
          is_delete: data.data.is_delete || false,
          set_warehouse: data.data.set_warehouse || "",
          project_code: data.data.project_code || "",
          is_weather_cleaning_enabled:
            data.data.is_weather_cleaning_enabled || false,
          commissioning_date: dateInput(data.data.commissioning_date),
          warranty_status: data.data.warranty_status || "",
          warranty_date: dateInput(data.data.warranty_date),
          amc_status: data.data.amc_status || "",
          amc_date: dateInput(data.data.amc_date),
          cloth_type: data.data.cloth_type || "",
          mounting_type: data.data.mounting_type || "",
        });
        setActivity(data.data.last_activity || []);
      } catch (error) {
        console.error(
          "Failed to fetch site:",
          error.response?.data || error.message,
        );
        dispatch({ type: "FETCH_FAIL", payload: "Failed to fetch site" });
      }
    };

    fetchSite();
  }, [id]);

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
              // Authorization: `Bearer ${authtoken}`,
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          },
        );
        updatedData.logo = uploadRes.data.url;
      }

      const response = await axios.put(`/api/v1/sites/${id}`, updatedData, {
        // headers: { Authorization: `Bearer ${authtoken}` },
        withCredentials: true,
      });

      dispatch({ type: "UPDATE_SUCCESS", payload: response.data });
      toast.success("Site updated successfully!");
      navigate(`/${home}/clients-dashboard/clients-data/${updatedData.client_id || formData.client_id}`);
    } catch (error) {
      dispatch({ type: "UPDATE_FAIL", payload: error.message });
      toast.error("Failed to update site.");
    }
  };

  return (
    <CCard>
      <CCardHeader>
        Edit site — <CBadge color="info">{formData.site_id}</CBadge>
      </CCardHeader>
      <CCardBody>
        {loading ? (
          <CSpinner />
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : (
          <CForm onSubmit={handleUpdate}>
            <h6 className="mt-2 mb-3">Site</h6>
            <CRow className="g-3">
              <CCol md={4}>
                <CFormInput label="Site ID" value={formData.site_id || ""} disabled={!isMaster} onChange={(e) => setFormData({ ...formData, site_id: e.target.value })} />
              </CCol>
              <CCol md={4}>
                <CFormInput label="Site name" value={formData.siteName || ""} required onChange={(e) => setFormData({ ...formData, siteName: e.target.value })} />
              </CCol>
              <CCol md={4}>
                <CFormInput label="Location" value={formData.location || ""} required onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
              </CCol>
              <CCol md={4}>
                <CFormInput label="Client ID" value={formData.client_id || ""} disabled={!isMaster} onChange={(e) => setFormData({ ...formData, client_id: e.target.value })} />
              </CCol>
              <CCol md={4}>
                <CFormInput label="Contract type" value={formData.site_type || ""} placeholder="capex or opex" onChange={(e) => setFormData({ ...formData, site_type: e.target.value })} />
              </CCol>
              <CCol md={4}>
                <CFormInput label="Project code" value={formData.project_code || ""} onChange={(e) => setFormData({ ...formData, project_code: e.target.value })} />
              </CCol>
              <CCol md={4}>
                <CFormInput label="Warehouse" value={formData.set_warehouse || ""} onChange={(e) => setFormData({ ...formData, set_warehouse: e.target.value })} />
              </CCol>
              {isMaster && (
                <CCol md={4}>
                  <CFormInput label="Password" value={formData.password || ""} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                </CCol>
              )}
            </CRow>

            <h6 className="mt-4 mb-3">Warranty, AMC and site setup</h6>
            <CRow className="g-3">
              <CCol md={4}>
                <CFormInput type="date" label="Commissioning date" value={formData.commissioning_date || ""} onChange={(e) => setFormData({ ...formData, commissioning_date: e.target.value })} />
              </CCol>
              <CCol md={4}>
                <CFormSelect label="Warranty status" value={formData.warranty_status || ""} onChange={(e) => setFormData({ ...formData, warranty_status: e.target.value })}>
                  <option value="">Not set</option>
                  <option value="in_warranty">In warranty</option>
                  <option value="out_of_warranty">Out of warranty</option>
                </CFormSelect>
              </CCol>
              <CCol md={4}>
                <CFormInput type="date" label="Warranty end date" value={formData.warranty_date || ""} onChange={(e) => setFormData({ ...formData, warranty_date: e.target.value })} />
              </CCol>
              <CCol md={4}>
                <CFormSelect label="AMC status" value={formData.amc_status || ""} onChange={(e) => setFormData({ ...formData, amc_status: e.target.value })}>
                  <option value="">Not set</option>
                  <option value="in_amc">In AMC</option>
                  <option value="out_of_amc">AMC expired</option>
                </CFormSelect>
              </CCol>
              <CCol md={4}>
                <CFormInput type="date" label="AMC end date" value={formData.amc_date || ""} onChange={(e) => setFormData({ ...formData, amc_date: e.target.value })} />
              </CCol>
              <CCol md={4}>
                <CFormSelect label="Cloth type" value={formData.cloth_type || ""} onChange={(e) => setFormData({ ...formData, cloth_type: e.target.value })}>
                  <option value="">Not set</option>
                  <option value="PBT">PBT</option>
                  <option value="MF">MF</option>
                  <option value="PBT+MF">PBT+MF</option>
                </CFormSelect>
              </CCol>
              <CCol md={4}>
                <CFormSelect label="Site type" value={formData.mounting_type || ""} onChange={(e) => setFormData({ ...formData, mounting_type: e.target.value })}>
                  <option value="">Not set</option>
                  <option value="ground">Ground</option>
                  <option value="rooftop">Rooftop</option>
                </CFormSelect>
              </CCol>
            </CRow>

            <CRow className="g-3 mt-1 align-items-end">
              <CCol md={4}>
                <CFormCheck
                  id="is_weather_cleaning_enabled"
                  label="Weather auto clean is enabled"
                  checked={formData.is_weather_cleaning_enabled || false}
                  onChange={(e) => setFormData({ ...formData, is_weather_cleaning_enabled: e.target.checked })}
                />
              </CCol>
              <CCol md={4}>
                <CFormInput type="file" label="Logo" onChange={handleFileChange} />
                {formData.logo && <img src={formData.logo} alt="Site logo" width="72" className="mt-2" />}
              </CCol>
              {isMaster && (
                <CCol md={4}>
                  <CFormCheck
                    id="is_delete"
                    label="Soft delete this site"
                    checked={formData.is_delete || false}
                    onChange={(e) => setFormData({ ...formData, is_delete: e.target.checked })}
                  />
                </CCol>
              )}
            </CRow>

            <div className="d-flex justify-content-end">
              <CButton size="sm" type="submit" color="primary" className="mt-3" disabled={updateLoading}>
                {updateLoading ? <>Saving… <CSpinner size="sm" /></> : "Save site"}
              </CButton>
            </div>

            <LastActivity lastactivity={(activity || []).map(toActivity)} />
          </CForm>
        )}
      </CCardBody>
    </CCard>
  );
};

export default EditClient;
