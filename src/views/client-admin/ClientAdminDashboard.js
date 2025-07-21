import {
  CAlert,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormSelect,
  CRow,
} from "@coreui/react";
import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../components/LoadingSpinner";
import { CChartLine, CChartPie } from "@coreui/react-chartjs";
import "./GoogleMapEmbed.css";
import CIcon from "@coreui/icons-react";
import { cilBolt, cilCloud, cilSpeedometer } from "@coreui/icons";
import moment from "moment";

const chartColors = ["#52357B", "#5459AC", "#648DB3", "#B2D8CE"];

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_SITEID_REQUEST":
      return { ...state, loadingSiteIds: true, errorSIteIds: "" };
    case "FETCH_SITEID_SUCCESS":
      return {
        ...state,
        loadingSiteIds: false,
        siteIds: action.payload,
      };
    case "FETCH_SITEID_FAIL":
      return { ...state, loadingSiteIds: false, errorSIteIds: action.payload };

    case "FETCH_SITE_DETAILS_REQUEST":
      return {
        ...state,
        loadingSiteDetails: true,
      };
    case "FETCH_SITE_DETAILS_SUCCESS":
      return {
        ...state,
        loadingSiteDetails: false,
        siteDetails: action.payload,
      };
    case "FETCH_SITE_DETAILS_FAIL":
      return {
        ...state,
        loadingSiteDetails: false,
        siteDetailsError: action.payload,
      };
    case "FETCH_WEATHER_REQUEST":
      return { ...state, loadingWeatherData: true, errorWeatherData: "" };
    case "FETCH_WEATHER_SUCCESS":
      return {
        ...state,
        loadingWeatherData: false,
        weatherData: action.payload,
      };
    case "FETCH_WEATHER_FAIL":
      return {
        ...state,
        loadingWeatherData: false,
        errorWeatherData: action.payload,
      };
    default:
      return state;
  }
};

const ClientAdminDashboard = () => {
  const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);
  const [
    {
      siteDetailsError,
      loadingSiteDetails,
      loadingSiteIds,
      siteIds,
      weatherData,
      loadingWeatherData,
      errorWeatherData,
    },
    dispatch,
  ] = useReducer(reducer, {
    siteDetailsError: "",
    loadingSiteDetails: false,
    siteDetails: {},
    weatherData: {},
    siteIds: [],
    loadingSiteIds: false,
    loadingWeatherData: true,
    errorSIteIds: "",
    errorWeatherData: "",
  });

  const [site_id, setSiteid] = useState(
    userInfo.assigned_sites[0]?.site_id || ""
  );
  const [blockWiseCleaning, setBlockWiseCleaning] = useState([]);
  const [gateways, setGateways] = useState([]);
  const [robotsData, setRobotsData] = useState([]);
  const [siteCoordinates, setSiteCoordinates] = useState({});
  const [totalAreaCleaned, setTotalAreaCleaned] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
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
        payload: error.response?.data?.error || error.response?.data?.message,
      });
      toast.error(error.response?.data?.error || error.response?.data?.message);
    }
  };

  useEffect(() => {
    const fetchSiteDetails = async () => {
      dispatch({ type: "FETCH_SITE_DETAILS_REQUEST" });
      try {
        const response = await axios.get(
          `/api/v1/sites-coordinates/site-details/${site_id}`,
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );

        dispatch({
          type: "FETCH_SITE_DETAILS_SUCCESS",
          payload: response.data.data,
        });
        setSiteCoordinates(response.data.data.coordinates);
        setTotalAreaCleaned(response.data.data.totalAreaCleaned);
        setRobotsData(response.data.data.robots);
        setGateways(response.data.data.gateways);
        setBlockWiseCleaning(response.data.data.blockWiseCleaning);
      } catch (error) {
        dispatch({
          type: "FETCH_SITE_DETAILS_FAIL",
          payload: error.response?.data?.message || error.message,
        });
        toast.error(error.response?.data?.message || error.message);
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
        toast.error(
          error.response?.data?.message || error.response?.data?.error
        );
      }
    };

    fetchSiteDetails();
    fetchWeatherData();
    fetchSiteIds();
  }, [authtoken, site_id]);

  const handleSiteNameChange = (e) => {
    dispatch({ type: "SELECT_SITENAME_REQUEST" });

    const selectedSiteName = e.target.value;

    const selectedSite = siteIds.find(
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

  const batteryChartData =
    robotsData?.map((entry) => ({
      robot: entry.robot_no,
      value: parseInt(entry.battery_voltage),
    })) || [];

  return (
    <>
      <div className="p-2">
        {/* <div className="flex flex-wrap justify-content-between gap-4">
          <CRow className="gap-3">
            <CCol xs={12} md={7}>
              <div style={{ width: "100%", height: "400px" }}>
                {loadingSiteDetails ? (
                  <LoadingSpinner />
                ) : (
                  GoogleMapEmbed(
                    siteCoordinates.latitude,
                    siteCoordinates.longitude
                  )
                )}
              </div>
            </CCol>

            <CCol
              xs={12}
              md={4}
              className="d-flex align-items-center justify-content-center border"
              style={{ minHeight: "400px" }}
            >
              {loadingWeatherData ? (
                <div className="text-center">
                  <LoadingSpinner />
                </div>
              ) : errorWeatherData ? (
                <p className="text-center text-muted">{errorWeatherData}</p>
              ) : (
                <div className="flex flex-col gap-3 w-100">
                  <h6 className="mx-3">
                    Hello{" "}
                    <span className="text-primary">{userInfo.username}</span>,
                    {getGreeting()}
                  </h6>

                  <CCard
                    className="shadow-sm rounded border-0"
                    style={{
                      background: "linear-gradient(135deg, #C850C0, #4158D0)",
                    }}
                  >
                    <CCardBody className="rounded-xl text-white">
                      <div
                        style={{
                          fontSize: "0.875rem",
                          color: "rgba(255, 255, 255, 0.78)",
                        }}
                      >
                        Weather Today
                      </div>

                      <div
                        style={{
                          fontSize: "0.87rem",
                          color: "rgba(255, 255, 255, 0.78)",
                        }}
                      >
                        Last Fetched:{" "}
                        {new Date(weatherData?.createdAt).toLocaleString()}
                      </div>

                      <div className="mt-2 text-lg font-semibold">
                        {weatherData?.siteName}, {weatherData?.location} -{" "}
                        {weatherData?.temperature}°C
                      </div>
                    </CCardBody>
                  </CCard>

                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <CRow className="my-1 text-center">
                      <CCol md={6}>
                        <div className="rounded-md p-2 shadow-sm text-center my-2">
                          <div className="text-sm font-bold text-pink-600">
                            {weatherData?.temperature}℃
                          </div>
                          <div style={{ fontSize: "14px" }}>Feels Like</div>
                          <div style={{ fontSize: "14px" }}>Temperature</div>
                        </div>
                        <div className="rounded-md p-2 shadow-sm text-center my-2">
                          <div className="text-sm font-bold text-pink-600">
                            {weatherData?.humidity}%
                          </div>
                          <div style={{ fontSize: "14px" }}>Outside</div>
                          <div style={{ fontSize: "14px" }}>Humidity</div>
                        </div>
                      </CCol>
                      <CCol md={6}>
                        <div className="rounded-md p-2 shadow-sm text-center my-2">
                          <div className="text-sm font-bold text-pink-600">
                            {weatherData?.wind_speed} m/s
                          </div>
                          <div style={{ fontSize: "14px" }}>Max Wind Speed</div>
                          <div style={{ fontSize: "12px" }}>
                            At{" "}
                            {new Date(
                              weatherData?.createdAt
                            ).toLocaleTimeString()}
                          </div>
                        </div>
                        <div className="rounded-md p-2 shadow-sm text-center my-2">
                          <div className="text-sm font-bold text-pink-600">
                            {weatherData?.cloudiness}%
                          </div>
                          <div style={{ fontSize: "14px" }}>Clouds</div>
                          <div style={{ fontSize: "14px" }}>Outside</div>
                        </div>
                      </CCol>
                    </CRow>
                  </div>
                </div>
              )}
            </CCol>
          </CRow>
        </div> */}

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
                  <div
                  //  style={{ width: "100%", height: "400px" }}
                  >
                    {loadingSiteDetails ? (
                      <div
                        className="d-flex justify-content-center align-items-center"
                        style={{ minHeight: "350px" }}
                      >
                        <LoadingSpinner />
                      </div>
                    ) : (
                      GoogleMapEmbed(
                        siteCoordinates.latitude,
                        siteCoordinates.longitude
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
                    <CCol md={5} className="mb-3">
                      Weather Today{" "}
                    </CCol>

                    <CCol md={7} className="m-0">
                      {loadingSiteIds ? (
                        "fetching"
                      ) : siteIds?.length > 0 ? (
                        <CFormSelect
                          name="site_id"
                          value={site_id}
                          onChange={handleSiteNameChange}
                        >
                          {siteIds.map((item) => (
                            <option key={item.site_id} value={item.site_id}>
                              {item.site_id}
                            </option>
                          ))}
                        </CFormSelect>
                      ) : (
                        <p>No Sites Found</p>
                      )}
                    </CCol>
                  </CRow>
                </CCardHeader>
                <CCardBody className="d-flex flex-column">
                  {loadingWeatherData ? (
                    // <div className="d-flex justify-content-between align-items-center">
                    //
                    // </div>
                    <div
                      className="d-flex justify-content-center align-items-center"
                      style={{ minHeight: "350px" }}
                    >
                      <LoadingSpinner />
                    </div>
                  ) : errorWeatherData ? (
                    <div className="text-center text-danger">
                      {errorWeatherData}
                    </div>
                  ) : (
                    <>
                      {/* Welcome */}
                      <p className="">
                        Last Updated:{" "}
                        {/* {new Date(weatherData?.createdAt).toLocaleString()} */}
                        {moment(weatherData?.createdAt).format(
                          "DD/MM/YYYY hh:mm A"
                        )}
                      </p>
                      <p className="">{weatherData?.siteName}</p>

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
                              <h5>{weatherData?.temperature}°C</h5>
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
                              <h5>{weatherData?.cloudiness}%</h5>
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
                              <h5>{weatherData?.wind_speed} m/s</h5>
                              <div className="text-muted small">
                                Wind @{" "}
                                {new Date(
                                  weatherData?.createdAt
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
                              <h5>{weatherData?.humidity}%</h5>
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
        <div className="mt-4">
          <CRow className="justify-content-center">
            <CCol xs={12} md={6} className="mt-4">
              <CCard className="mb-4 shadow">
                <CCardHeader>
                  <h5 className="text-center">
                    Total Area Cleaned:{" "}
                    <span className="text-success fw-bold">
                      {totalAreaCleaned} m²
                    </span>
                  </h5>
                </CCardHeader>
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ minHeight: "350px" }}
                >
                  {loadingSiteDetails ? (
                    <LoadingSpinner />
                  ) : siteDetailsError ? (
                    <p className="text-danger text-center">
                      {siteDetailsError}
                    </p>
                  ) : (
                    <>
                      {blockWiseCleaning?.length > 0 ? (
                        <CChartPie
                          data={{
                            labels: blockWiseCleaning.map(
                              (block) => block.block
                            ),
                            datasets: [
                              {
                                data: blockWiseCleaning.map(
                                  (block) => block.areaCleaned
                                ),
                                backgroundColor: chartColors.slice(
                                  0,
                                  blockWiseCleaning.length
                                ),
                              },
                            ],
                          }}
                          options={{
                            plugins: {
                              legend: {
                                display: false, // ✅ This hides the legend
                              },
                              tooltip: {
                                callbacks: {
                                  label: function (tooltipItem) {
                                    const block =
                                      blockWiseCleaning[tooltipItem.dataIndex];
                                    return ` ${
                                      block.block || "Unassigned"
                                    } |  ${block.areaCleaned} m²`;
                                  },
                                },
                              },
                            },
                          }}
                        />
                      ) : (
                        <p className="text-center">
                          No cleaning data available
                        </p>
                      )}
                    </>
                  )}
                </div>
              </CCard>
            </CCol>

            <CCol xs={12} md={6} className="mt-4">
              <CCard className="mb-4 shadow">
                <CCardHeader>
                  <h5 className="text-center">Gateway Details</h5>
                </CCardHeader>
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ minHeight: "350px" }}
                >
                  {loadingSiteDetails ? (
                    <LoadingSpinner />
                  ) : siteDetailsError ? (
                    <p className="text-danger text-center">
                      {siteDetailsError}
                    </p>
                  ) : (
                    <>
                      {gateways.length > 0 ? (
                        <CChartPie
                          data={{
                            labels: gateways.map(
                              (gateway) => gateway.gateway_name
                            ),
                            datasets: [
                              {
                                data: gateways.map(() => 1),
                                backgroundColor: gateways.map((gateway) =>
                                  gateway.gateway_status ? "#28a745" : "#dc3545"
                                ),
                              },
                            ],
                          }}
                          options={{
                            plugins: {
                              legend: {
                                display: false, // ✅ This hides the legend
                              },

                              tooltip: {
                                callbacks: {
                                  label: function (tooltipItem) {
                                    const gateway =
                                      gateways[tooltipItem.dataIndex];
                                    return `${
                                      gateway.gateway_status
                                        ? "Online"
                                        : "Offline"
                                    }`;
                                  },
                                },
                              },
                            },
                          }}
                        />
                      ) : (
                        <p className="text-center text-muted">
                          No Gateway details available
                        </p>
                      )}
                    </>
                  )}
                </div>
              </CCard>
            </CCol>
          </CRow>
        </div>
        <div className="mt-4">
          <CCard className="mb-4 shadow">
            <CCardHeader>
              <h5>Battery Status</h5>{" "}
            </CCardHeader>
            <CCardBody
              className="d-flex justify-content-center align-items-center"
              style={{ minHeight: "350px" }}
            >
              {loadingSiteDetails ? (
                <LoadingSpinner />
              ) : siteDetailsError ? (
                <p className="text-danger text-center">{siteDetailsError}</p>
              ) : (
                <>
                  {robotsData?.length > 0 ? (
                    <CChartLine
                      style={{ maxHeight: "300px", width: "100%" }}
                      data={{
                        labels: batteryChartData.map((entry) =>
                          entry.robot.slice(-3)
                        ),
                        datasets: [
                          {
                            label: "Battery (%)",
                            data: batteryChartData.map((entry) => entry.value),
                            borderColor: "#648DB3",
                            tension: 0.4,
                          },
                        ],
                      }}
                      options={{
                        scales: {
                          y: {
                            beginAtZero: true,
                          },
                        },
                      }}
                    />
                  ) : (
                    <CAlert color="warning">
                      No battery logs found for the Robots
                    </CAlert>
                  )}
                </>
              )}
            </CCardBody>
          </CCard>
        </div>
      </div>
    </>
  );
};

export default ClientAdminDashboard;
