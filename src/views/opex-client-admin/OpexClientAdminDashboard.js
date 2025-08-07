// import React from "react";

// const OpexClientAdminDashboard = () => {
//   return <div>OpexClientAdminDashboard</div>;
// };

// export default OpexClientAdminDashboard;

import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormSelect,
  CRow,
} from "@coreui/react";
import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";

import { useSelector } from "react-redux";
import LoadingSpinner from "../../components/LoadingSpinner";
import "./GoogleMapEmbed.css";
import CIcon from "@coreui/icons-react";
import { cilBolt, cilCloud, cilSpeedometer } from "@coreui/icons";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_SITES_REQUEST":
      return { ...state, loadingSites: true, errorSites: "" };
    case "FETCH_SITES_SUCCESS":
      return {
        ...state,
        loadingSites: false,
        sites: action.payload,
      };
    case "FETCH_SITES_FAIL":
      return { ...state, loadingSites: false, errorSites: action.payload };

    case "FETCH_WEATHER_REQUEST":
      return { ...state, loadingWeather: true, weatherError: "" };
    case "FETCH_WEATHER_SUCCESS":
      return {
        ...state,
        loadingWeather: false,
        weather: action.payload,
      };
    case "FETCH_WEATHER_FAIL":
      return { ...state, loadingWeather: false, weatherError: action.payload };

    case "FETCH_SITE_COORDINATES_REQUEST":
      return { ...state, loadingCoordinates: true, coordinatesError: "" };
    case "FETCH_SITE_COORDINATES_SUCCESS":
      return {
        ...state,
        loadingCoordinates: false,
        coordinates: action.payload,
      };
    case "FETCH_SITE_COORDINATES_FAIL":
      return {
        ...state,
        loadingCoordinates: false,
        coordinatesError: action.payload,
      };

    default:
      return state;
  }
};

const OpexClientAdminDashboard = () => {
  const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);
  const [
    {
      sites,
      loadingSites,
      errorSites,
      loadingCoordinates,
      coordinates,
      coordinatesError,
      loadingWeather,
      weatherError,
      weather,
    },
    dispatch,
  ] = useReducer(reducer, {
    sites: [],
    loadingSites: false,
    errorSites: "",
    coordinatesError: "",
    coordinates: {},
    loadingCoordinates: false,
    weatherError: "",
    weather: {},
    loadingWeather: false,
  });

  const [site_id, setSiteid] = useState(
    userInfo.assigned_sites[0]?.site_id || "abc"
  );

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchSites = async () => {
      dispatch({ type: "FETCH_SITES_REQUEST" });
      try {
        const result = await axios.get(`/api/v1/sites`, {
          headers: { Authorization: `Bearer ${authtoken}` },
        });
        dispatch({
          type: "FETCH_SITES_SUCCESS",
          payload: result.data.data,
        });
      } catch (error) {
        dispatch({
          type: "FETCH_SITES_FAIL",
          payload: error.response?.data?.error || error.response?.data?.message,
        });
      }
    };
    const fetchSiteCoordinates = async () => {
      dispatch({ type: "FETCH_SITE_COORDINATES_REQUEST" });
      try {
        const response = await axios.post(
          `/api/v1/sites-coordinates/get-by-siteId`,
          { site_id },
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );

        dispatch({
          type: "FETCH_SITE_COORDINATES_SUCCESS",
          payload: response.data.data.coordinates,
        });
      } catch (error) {
        dispatch({
          type: "FETCH_SITE_COORDINATES_FAIL",
          payload: error.response?.data?.message || error.response?.data?.error,
        });
        // toast.error(error.response?.data?.message || error.message);
      }
    };

    const fetchWeatherData = async () => {
      dispatch({ type: "FETCH_WEATHER_REQUEST" });
      try {
        const response = await axios.get(
          `/api/v1/weatherdata/client/${site_id}`,
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );
        dispatch({
          type: "FETCH_WEATHER_SUCCESS",
          payload: response.data.data,
        });

        console.log(response.data.data);
      } catch (error) {
        dispatch({
          type: "FETCH_WEATHER_FAIL",
          payload: error.response?.data?.message || error.response?.data?.error,
        });
        // toast.error(
        //   error.response?.data?.message || error.response?.data?.error
        // );
      }
    };

    fetchSiteCoordinates();
    fetchWeatherData();
    fetchSites();
  }, [authtoken, site_id]);

  const handleSiteNameChange = (e) => {
    dispatch({ type: "SELECT_SITENAME_REQUEST" });

    const selectedSiteName = e.target.value;

    const selectedSite = sites.find(
      (site) => site.site_id === selectedSiteName
    );

    if (selectedSite) {
      setSiteid(selectedSite.site_id);

      dispatch({
        type: "SELECT_SITENAME_SUCCESS",
        payload: selectedSite.site_id,
      });
    } else {
      dispatch({ type: "SELECT_SITENAME_FAIL" });
    }
  };

  // const greeting = weatherData.createdAt
  //   ? new Date(weatherData.createdAt).getHours()
  //   : 0;
  const greeting = new Date().getHours();

  const getGreeting = () => {
    if (greeting < 12) {
      return "Good Morning";
    } else if (greeting < 18) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  };

  const GoogleMapEmbed = (latitude, longitude) => {
    const mapSrc = `https://maps.google.com/maps?hl=en&q=${latitude},${longitude}&t=k&z=18&ie=UTF8&iwloc=B&output=embed`;

    return (
      <div
        className="map-container"
        style={{
          position: "relative",
          height: "415px",
          width: "100%",
          // borderRadius: "5px",
          overflow: "hidden",
        }}
      >
        {!isLoaded && (
          <div className="map-loader">
            <div className="spinner"></div>
            <p>Loading Map...</p>
          </div>
        )}
        <iframe
          title="Google Satellite Map"
          width="100%"
          height="100%"
          src={mapSrc}
          onLoad={() => setIsLoaded(true)}
          allowFullScreen
        ></iframe>
      </div>
    );
  };

  return (
    <>
      <div className="p-2">
        <div className="">
          <CRow className="g-4">
            {/* Map Section */}
            <CCol xs={12} md={7}>
              <CCard className="h-100 border-0 shadow-sm">
                <CCardHeader className="">
                  Hello {userInfo.username},
                  <span className="text-success"> {getGreeting()}</span>
                </CCardHeader>
                <CCardBody className="p-0">
                  <div>
                    {loadingCoordinates ? (
                      <div
                        className="d-flex justify-content-center align-items-center"
                        style={{ minHeight: "350px" }}
                      >
                        <LoadingSpinner />
                      </div>
                    ) : coordinatesError ? (
                      <div
                        className="d-flex justify-content-center align-items-center"
                        style={{ minHeight: "350px" }}
                      >
                        <CBadge color="warning" className="p-2">
                          {" "}
                          {coordinatesError === "Site Coordinates not found"
                            ? "Please contact Admin to view Data"
                            : coordinatesError}
                        </CBadge>
                      </div>
                    ) : (
                      GoogleMapEmbed(
                        coordinates ? coordinates.latitude : "28.6131016",
                        coordinates ? coordinates.longitude : "77.2230819"
                      )
                    )}
                  </div>
                </CCardBody>
              </CCard>
            </CCol>

            {/* Weather Section */}
            <CCol xs={12} md={5}>
              <CCard className="h-100 shadow-sm border-0">
                <CCardHeader className="fw-bold">
                  <CRow className="d-flex justify-content-between align-items-center">
                    <CCol md={5} className="">
                      Weather Today{" "}
                    </CCol>

                    <CCol md={7} className="m-0">
                      {loadingSites ? (
                        // <LoadingSpinner />
                        "Fetching"
                      ) : errorSites ? (
                        <CBadge color="warning" className="p-2">
                          {errorSites === "Sites Not Found"
                            ? "Please contact Admin to view Data"
                            : errorSites}
                        </CBadge>
                      ) : (
                        <CFormSelect
                          value={site_id}
                          onChange={handleSiteNameChange}
                          className="form-select"
                          aria-label="Select Site"
                        >
                          <option value="" disabled>
                            Select Site
                          </option>
                          {sites.map((site) => (
                            <option key={site.site_id} value={site.site_id}>
                              {site.site_id}
                            </option>
                          ))}
                        </CFormSelect>
                      )}
                    </CCol>
                  </CRow>
                </CCardHeader>
                <CCardBody className="d-flex flex-column">
                  {loadingWeather ? (
                    <div
                      className="d-flex justify-content-center align-items-center"
                      style={{ minHeight: "350px" }}
                    >
                      <LoadingSpinner />
                    </div>
                  ) : weatherError ? (
                    <div
                      className="d-flex justify-content-center align-items-center"
                      style={{ minHeight: "350px" }}
                    >
                      {weatherError ===
                      `Weather data for site: ${site_id} not found` ? (
                        <CBadge color="warning" className="p-2">
                          Please contact Admin to view Data
                        </CBadge>
                      ) : (
                        weatherError
                      )}
                    </div>
                  ) : (
                    <>
                      {/* Welcome */}
                      <p className="">
                        Last Updated:{" "}
                        {/* {new Date(weatherData?.createdAt).toLocaleString()} */}
                        {new Date(weather?.createdAt).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: true,
                        })}
                      </p>
                      <p className="">{weather?.siteName}</p>

                      {/* Weather Grid */}
                      <CRow className="s">
                        <CCol xs={6}>
                          <CCard className="text-center border-0 shadow-sm">
                            <CCardBody>
                              <CIcon
                                icon={cilSpeedometer}
                                className="mb-2 text-danger"
                                size="lg"
                              />
                              <h5>{weather?.temperature}°C</h5>
                              <div className="text-muted small">Feels Like</div>
                            </CCardBody>
                          </CCard>
                        </CCol>
                        <CCol xs={6}>
                          <CCard className="text-center border-0 shadow-sm">
                            <CCardBody>
                              <CIcon
                                icon={cilCloud}
                                className="mb-2 text-primary"
                                size="lg"
                              />
                              <h5>{weather?.cloudiness}%</h5>
                              <div className="text-muted small">Cloudiness</div>
                            </CCardBody>
                          </CCard>
                        </CCol>
                        <CCol xs={6}>
                          <CCard className="text-center border-0 shadow-sm">
                            <CCardBody>
                              <CIcon
                                icon={cilSpeedometer}
                                className="mb-2 text-warning"
                                size="lg"
                              />
                              <h5>{weather?.wind_speed} m/s</h5>
                              <div className="text-muted small">
                                Wind @{" "}
                                {new Date(
                                  weather?.createdAt
                                ).toLocaleTimeString()}
                              </div>
                            </CCardBody>
                          </CCard>
                        </CCol>
                        <CCol xs={6}>
                          <CCard className="text-center border-0 shadow-sm">
                            <CCardBody>
                              <CIcon
                                icon={cilBolt}
                                className="mb-2 text-success"
                                size="lg"
                              />
                              <h5>{weather?.humidity}%</h5>
                              <div className="text-muted small">Humidity</div>
                            </CCardBody>
                          </CCard>
                        </CCol>
                      </CRow>
                    </>
                  )}
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </div>
      </div>
    </>
  );
};

export default OpexClientAdminDashboard;
