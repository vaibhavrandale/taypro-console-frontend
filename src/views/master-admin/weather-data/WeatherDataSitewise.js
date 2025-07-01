import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import PaginateInput from "../../../components/PaginateInput";
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
  CSpinner,
} from "@coreui/react";
import LoadingSpinner from "../../../components/LoadingSpinner";

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

  const authtoken = useSelector((state) => state.authtoken);
  const [selectedSite, setSelectedSite] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pageInput, setPageInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const selectedSiteDetails = sites.find(
    (site) => site.site_id === selectedSite
  );

  useEffect(() => {
    const fetchSites = async () => {
      dispatch({ type: "FETCH_SITES_REQUEST" });
      try {
        const response = await axios.get(`/api/v1/sites`, {
          headers: { Authorization: `Bearer ${authtoken}` },
        });
        dispatch({ type: "FETCH_SITES_SUCCESS", payload: response.data.data });

        if (response.data.data.length > 0) {
          setSelectedSite(response.data.data[0].site_id);
        }
      } catch (error) {
        const errorMsg =
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to fetch sites";
        dispatch({ type: "FETCH_SITES_FAIL", payload: errorMsg });
        toast.error(errorMsg);
      }
    };

    fetchSites();
  }, [authtoken]);

  useEffect(() => {
    if (!selectedSite) return;

    const fetchWeatherData = async () => {
      dispatch({ type: "FETCH_WEATHER_REQUEST" });
      try {
        const response = await axios.post(
          `/api/v1/weatherdata/get-by-siteId`,
          {
            siteId: selectedSite,
            pg: page,
            limit: limit,
          },
          { headers: { Authorization: `Bearer ${authtoken}` } }
        );

        dispatch({
          type: "FETCH_WEATHER_SUCCESS",
          payload: {
            data: response.data.data,
            totalPages: Math.ceil(response.data.total / limit),
            hasNextPage: response.data.hasNextPage,
            hasPrevPage: response.data.hasPrevPage,
            totalRecords: response.data.total,
          },
        });
      } catch (error) {
        const errorMsg =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to fetch weather data";
        dispatch({ type: "FETCH_WEATHER_FAIL", payload: errorMsg });
        toast.error(errorMsg);
      }
    };

    fetchWeatherData();
  }, [selectedSite, page, limit, authtoken]);

  const handleSiteChange = (e) => {
    setSelectedSite(e.target.value);
    setPage(1);

    // Clear previous weather data on site change
    dispatch({
      type: "FETCH_WEATHER_SUCCESS",
      payload: {
        data: [],
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
        totalRecords: 0,
      },
    });
  };

  const handlePageInputChange = (e) => setPageInput(e.target.value);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handlePageInputSubmit = () => {
    const pageNumber = parseInt(pageInput);
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
      {/* Site Id and Site Name Centered */}
      {selectedSiteDetails && weatherData.length > 0 && (
        <div className="text-center fw-bold fs-5 mb-4">
          Weather Data for Site: {selectedSiteDetails.site_id} -{" "}
          {selectedSiteDetails.site_name}
        </div>
      )}

      {/* Site Dropdown and Search */}
      <CRow className="mb-4">
        <CCol md={4}>
          {loadingSites ? (
            <CSpinner />
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
        <CCol md={4} className="ms-auto">
          <CInputGroup>
            <CFormInput
              type="text"
              placeholder="Search weather data..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </CInputGroup>
        </CCol>
      </CRow>

      {/* Error */}
      {error && <CAlert color="danger">{error}</CAlert>}

      {/* Weather Data Table */}
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
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {loadingWeather ? (
            <CTableRow>
              <CTableDataCell colSpan="11" className="text-center">
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
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan="11" className="text-center">
                {selectedSite
                  ? "No weather data found"
                  : "Please select a site"}
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>

      {/* Pagination */}
      {selectedSite && (
        <PaginateInput
          page={page}
          totalPages={totalPages}
          hasPrevPage={hasPrevPage}
          hasNextPage={hasNextPage}
          pageInput={pageInput}
          handlePageChange={handlePageChange}
          handlePageInputChange={handlePageInputChange}
          handlePageInputSubmit={handlePageInputSubmit}
          limit={limit}
          handleLimitChange={setLimit}
          totalRecords={totalRecords}
        />
      )}
    </div>
  );
};

export default WeatherDashboard;
