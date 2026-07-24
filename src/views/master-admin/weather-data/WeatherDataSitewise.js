import axios from "axios";
import React, { useCallback, useEffect, useReducer, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import PaginateInput from "../../../components/PaginateInput";
import ConfirmModal from "../../../components/ConfirmModal";
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CFormInput,
  CRow,
  CCol,
  CInputGroup,
  CFormSelect,
  CAlert,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormCheck,
  CFormLabel,
} from "@coreui/react";
import LoadingSpinner from "../../../components/LoadingSpinner";

const emptyForm = {
  site_id: "",
  siteName: "",
  location: "",
  time: "",
  temperature: "",
  humidity: "",
  wind_speed: "",
  description: "",
  pressure: "",
  visibility: "",
  cloudiness: "",
  is_rain: false,
  is_forecast: false,
};

const toLocalInput = (date) => {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_SITES_REQUEST":
      return { ...state, loadingSites: true, error: "" };
    case "FETCH_SITES_SUCCESS":
      return { ...state, loadingSites: false, sites: action.payload };
    case "FETCH_SITES_FAIL":
      return { ...state, loadingSites: false, error: action.payload };
    case "FETCH_WEATHER_REQUEST":
      return { ...state, loadingWeather: true, error: "" };
    case "FETCH_WEATHER_SUCCESS":
      return {
        ...state,
        loadingWeather: false,
        weatherData: action.payload.data,
        totalPages: action.payload.totalPages,
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
        totalRecords: action.payload.totalRecords,
      };
    case "FETCH_WEATHER_FAIL":
      return {
        ...state,
        loadingWeather: false,
        weatherData: [],
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
        totalRecords: 0,
        error: action.payload,
      };
    default:
      return state;
  }
};

const WeatherDashboard = () => {
  const [
    {
      loadingSites,
      loadingWeather,
      sites,
      weatherData,
      totalPages,
      hasNextPage,
      hasPrevPage,
      totalRecords,
      error,
    },
    dispatch,
  ] = useReducer(reducer, {
    loadingSites: true,
    loadingWeather: false,
    sites: [],
    weatherData: [],
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
    totalRecords: 0,
    error: "",
  });

  const userInfo = useSelector((state) => state.userInfo);
  const canEdit = userInfo?.role === "Master Admin";

  const [selectedSite, setSelectedSite] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pageInput, setPageInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const [formModal, setFormModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const selectedSiteDetails = sites.find(
    (site) => site.site_id === selectedSite,
  );

  const fetchWeatherData = useCallback(async () => {
    if (!selectedSite) return;
    dispatch({ type: "FETCH_WEATHER_REQUEST" });
    try {
      const response = await axios.post(
        `/api/v1/weatherdata/get-by-siteId`,
        { siteId: selectedSite, pg: page, limit },
        { withCredentials: true },
      );
      dispatch({
        type: "FETCH_WEATHER_SUCCESS",
        payload: {
          data: response.data.data || [],
          totalPages: Math.max(
            1,
            Math.ceil((response.data.total || 0) / limit),
          ),
          hasNextPage: response.data.hasNextPage,
          hasPrevPage: response.data.hasPrevPage,
          totalRecords: response.data.total || 0,
        },
      });
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to fetch weather data";
      dispatch({ type: "FETCH_WEATHER_FAIL", payload: errorMsg });
      toast.error(errorMsg);
    }
  }, [selectedSite, page, limit]);

  useEffect(() => {
    const fetchSites = async () => {
      dispatch({ type: "FETCH_SITES_REQUEST" });
      try {
        const response = await axios.get(`/api/v1/sites`, {
          withCredentials: true,
        });
        dispatch({ type: "FETCH_SITES_SUCCESS", payload: response.data.data });
        if (response.data.data.length > 0) {
          setSelectedSite(response.data.data[0].site_id);
        }
      } catch (err) {
        const errorMsg =
          err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to fetch sites";
        dispatch({ type: "FETCH_SITES_FAIL", payload: errorMsg });
        toast.error(errorMsg);
      }
    };
    fetchSites();
  }, []);

  useEffect(() => {
    fetchWeatherData();
  }, [fetchWeatherData, refreshKey]);

  const handleSiteChange = (e) => {
    setSelectedSite(e.target.value);
    setPage(1);
  };

  const openCreate = () => {
    const site = sites.find((s) => s.site_id === selectedSite);
    setEditingId(null);
    setForm({
      ...emptyForm,
      site_id: selectedSite || "",
      siteName: site?.site_name || "",
      location: site?.location || "",
      time: toLocalInput(new Date()),
    });
    setFormModal(true);
  };

  const openEdit = (item) => {
    setEditingId(item._id);
    setForm({
      site_id: item.site_id || "",
      siteName: item.siteName || "",
      location: item.location || "",
      time: toLocalInput(item.time),
      temperature: item.temperature ?? "",
      humidity: item.humidity ?? "",
      wind_speed: item.wind_speed ?? "",
      description: item.description || "",
      pressure: item.pressure ?? "",
      visibility: item.visibility ?? "",
      cloudiness: item.cloudiness ?? "",
      is_rain: Boolean(item.is_rain),
      is_forecast: Boolean(item.is_forecast),
    });
    setFormModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const saveForm = async () => {
    if (!form.site_id) {
      toast.error("site_id is required");
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      temperature:
        form.temperature === "" ? undefined : Number(form.temperature),
      humidity: form.humidity === "" ? undefined : Number(form.humidity),
      wind_speed: form.wind_speed === "" ? undefined : Number(form.wind_speed),
      pressure: form.pressure === "" ? undefined : Number(form.pressure),
      visibility: form.visibility === "" ? undefined : Number(form.visibility),
      cloudiness: form.cloudiness === "" ? undefined : Number(form.cloudiness),
      time: form.time ? new Date(form.time).toISOString() : undefined,
    };
    try {
      if (editingId) {
        await axios.put(`/api/v1/weatherdata/${editingId}`, payload, {
          withCredentials: true,
        });
        toast.success("Weather data updated");
      } else {
        await axios.post(`/api/v1/weatherdata`, payload, {
          withCredentials: true,
        });
        toast.success("Weather data created");
      }
      setFormModal(false);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Save failed",
      );
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget?._id) return;
    setDeleting(true);
    try {
      await axios.delete(`/api/v1/weatherdata/${deleteTarget._id}`, {
        withCredentials: true,
      });
      toast.success("Weather data deleted");
      setDeleteModal(false);
      setDeleteTarget(null);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Delete failed",
      );
    } finally {
      setDeleting(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  const handlePageInputSubmit = () => {
    const pageNumber = parseInt(pageInput, 10);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      handlePageChange(pageNumber);
    }
  };

  const filteredData = weatherData.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.site_id?.toLowerCase().includes(term) ||
      item.description?.toLowerCase().includes(term) ||
      item.temperature?.toString().includes(term) ||
      new Date(item.time).toLocaleString().toLowerCase().includes(term)
    );
  });

  return (
    <div className="p-4">
      {selectedSiteDetails && (
        <div className="text-center fs-5 mb-4">
          Weather Data for Site: {selectedSiteDetails.site_id}{" "}
          {selectedSiteDetails.site_name}
        </div>
      )}

      <CRow className="mb-4 align-items-end">
        <CCol md={4}>
          {loadingSites ? (
            <LoadingSpinner />
          ) : (
            <CFormSelect
              value={selectedSite}
              onChange={handleSiteChange}
              disabled={loadingSites}
            >
              <option value="">Select a site</option>
              {sites.map((site) => (
                <option key={site._id} value={site.site_id}>
                  {site.site_name || site.site_id}
                </option>
              ))}
            </CFormSelect>
          )}
        </CCol>
        <CCol md={4}>
          <CInputGroup>
            <CFormInput
              type="text"
              placeholder="Search weather data..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </CInputGroup>
        </CCol>
        {canEdit && (
          <CCol md={4} className="text-md-end">
            <CButton
              color="primary"
              size="sm"
              disabled={!selectedSite}
              onClick={openCreate}
            >
              Add Weather Data
            </CButton>
          </CCol>
        )}
      </CRow>

      {error && <CAlert color="danger">{error}</CAlert>}

      <CTable bordered hover responsive className="text-center shadow-sm">
        <CTableHead color="secondary">
          <CTableRow>
            <CTableHeaderCell>#</CTableHeaderCell>
            <CTableHeaderCell>Temperature (°C)</CTableHeaderCell>
            <CTableHeaderCell>Humidity (%)</CTableHeaderCell>
            <CTableHeaderCell>Wind Speed (m/s)</CTableHeaderCell>
            <CTableHeaderCell>Description</CTableHeaderCell>
            <CTableHeaderCell>Pressure (hPa)</CTableHeaderCell>
            <CTableHeaderCell>Visibility (km)</CTableHeaderCell>
            <CTableHeaderCell>Cloudiness (%)</CTableHeaderCell>
            <CTableHeaderCell>Rain Status</CTableHeaderCell>
            <CTableHeaderCell>Is Forecast</CTableHeaderCell>
            <CTableHeaderCell>Time</CTableHeaderCell>
            {canEdit && <CTableHeaderCell>Actions</CTableHeaderCell>}
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {loadingWeather ? (
            <CTableRow>
              <CTableDataCell
                colSpan={canEdit ? 12 : 11}
                className="text-center"
              >
                <LoadingSpinner />
              </CTableDataCell>
            </CTableRow>
          ) : filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <CTableRow key={item._id}>
                <CTableDataCell>
                  {(page - 1) * limit + index + 1}
                </CTableDataCell>
                <CTableDataCell>{item.temperature}</CTableDataCell>
                <CTableDataCell>{item.humidity}</CTableDataCell>
                <CTableDataCell>{item.wind_speed}</CTableDataCell>
                <CTableDataCell>{item.description}</CTableDataCell>
                <CTableDataCell>{item.pressure}</CTableDataCell>
                <CTableDataCell>{item.visibility}</CTableDataCell>
                <CTableDataCell>{item.cloudiness}</CTableDataCell>
                <CTableDataCell>
                  {item.is_rain ? "Rainy" : "No Rainy"}
                </CTableDataCell>
                <CTableDataCell>
                  {item.is_forecast ? "Yes" : "No"}
                </CTableDataCell>
                <CTableDataCell>
                  {new Date(item.time).toLocaleString()}
                </CTableDataCell>
                {canEdit && (
                  <CTableDataCell>
                    <CButton
                      color="warning"
                      size="sm"
                      className="m-1"
                      onClick={() => openEdit(item)}
                    >
                      Edit
                    </CButton>
                    <CButton
                      color="danger"
                      size="sm"
                      onClick={() => {
                        setDeleteTarget(item);
                        setDeleteModal(true);
                      }}
                    >
                      Delete
                    </CButton>
                  </CTableDataCell>
                )}
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell
                colSpan={canEdit ? 12 : 11}
                className="text-center"
              >
                No weather data found
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>

      {selectedSite && (
        <PaginateInput
          page={page}
          totalPages={totalPages}
          hasPrevPage={hasPrevPage}
          hasNextPage={hasNextPage}
          pageInput={pageInput}
          handlePageChange={handlePageChange}
          handlePageInputChange={(e) => setPageInput(e.target.value)}
          handlePageInputSubmit={handlePageInputSubmit}
          limit={limit}
          handleLimitChange={setLimit}
          totalRecords={totalRecords}
        />
      )}

      <CModal
        visible={formModal}
        onClose={() => setFormModal(false)}
        size="lg"
        backdrop="static"
        alignment="center"
      >
        <CModalHeader>
          <CModalTitle>
            {editingId ? "Edit Weather Data" : "Add Weather Data"}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow className="g-3">
            <CCol md={6}>
              <CFormLabel>Site ID</CFormLabel>
              <CFormInput
                name="site_id"
                value={form.site_id}
                onChange={handleFormChange}
                disabled={Boolean(editingId)}
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel>Site Name</CFormLabel>
              <CFormInput
                name="siteName"
                value={form.siteName}
                onChange={handleFormChange}
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel>Location</CFormLabel>
              <CFormInput
                name="location"
                value={form.location}
                onChange={handleFormChange}
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel>Time</CFormLabel>
              <CFormInput
                type="datetime-local"
                name="time"
                value={form.time}
                onChange={handleFormChange}
              />
            </CCol>
            <CCol md={4}>
              <CFormLabel>Temperature (°C)</CFormLabel>
              <CFormInput
                type="number"
                name="temperature"
                value={form.temperature}
                onChange={handleFormChange}
              />
            </CCol>
            <CCol md={4}>
              <CFormLabel>Humidity (%)</CFormLabel>
              <CFormInput
                type="number"
                name="humidity"
                value={form.humidity}
                onChange={handleFormChange}
              />
            </CCol>
            <CCol md={4}>
              <CFormLabel>Wind Speed (m/s)</CFormLabel>
              <CFormInput
                type="number"
                name="wind_speed"
                value={form.wind_speed}
                onChange={handleFormChange}
              />
            </CCol>
            <CCol md={4}>
              <CFormLabel>Pressure (hPa)</CFormLabel>
              <CFormInput
                type="number"
                name="pressure"
                value={form.pressure}
                onChange={handleFormChange}
              />
            </CCol>
            <CCol md={4}>
              <CFormLabel>Visibility</CFormLabel>
              <CFormInput
                type="number"
                name="visibility"
                value={form.visibility}
                onChange={handleFormChange}
              />
            </CCol>
            <CCol md={4}>
              <CFormLabel>Cloudiness (%)</CFormLabel>
              <CFormInput
                type="number"
                name="cloudiness"
                value={form.cloudiness}
                onChange={handleFormChange}
              />
            </CCol>
            <CCol md={12}>
              <CFormLabel>Description</CFormLabel>
              <CFormInput
                name="description"
                value={form.description}
                onChange={handleFormChange}
              />
            </CCol>
            <CCol md={6}>
              <CFormCheck
                label="Is Rain"
                name="is_rain"
                checked={form.is_rain}
                onChange={handleFormChange}
              />
            </CCol>
            <CCol md={6}>
              <CFormCheck
                label="Is Forecast"
                name="is_forecast"
                checked={form.is_forecast}
                onChange={handleFormChange}
              />
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            size="sm"
            onClick={() => setFormModal(false)}
            disabled={saving}
          >
            Cancel
          </CButton>
          <CButton
            color="primary"
            size="sm"
            onClick={saveForm}
            disabled={saving}
          >
            {saving ? <LoadingSpinner /> : editingId ? "Update" : "Create"}
          </CButton>
        </CModalFooter>
      </CModal>

      <ConfirmModal
        visible={deleteModal}
        onClose={() => {
          setDeleteModal(false);
          setDeleteTarget(null);
        }}
        onConfirm={confirmDelete}
        title="Delete weather record?"
        message={`Delete weather data for <strong>${deleteTarget?.site_id || ""}</strong> at ${
          deleteTarget?.time ? new Date(deleteTarget.time).toLocaleString() : ""
        }?`}
        confirmLabel="Delete"
        loading={deleting}
      />
    </div>
  );
};

export default WeatherDashboard;
