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
import { CChartBar, CChartPie } from "@coreui/react-chartjs";
import "./GoogleMapEmbed.css";
// import CIcon from "@coreui/icons-react";
// import { cilBolt, cilCloud, cilSpeedometer } from "@coreui/icons";
import Weather from "./weather/Weather";

const chartColors = [
  "#052638",
  "#4e73df",
  "#FFC107",
  "#17A2B8",
  "#DC3545",
  "#6C757D",
  "#8E44AD",
  "#3498DB",
  "#E74C3C",
  "#2ECC71",
  "#F39C12",
  "#D35400",
  "#C0392B",
  "#27AE60",
  "#16A085",
  "#2980B9",
  "#2C3E50",
  "#1ABC9C",
  "#34495E",
  "#95A5A6",
];

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
      return { ...state, loadingSiteIds: false, errorSiteIds: action.payload };

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
      errorSiteIds,
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
    errorSiteIds: "",
    errorWeatherData: "",
  });

  const [site_id, setSiteid] = useState(
    userInfo.assigned_sites[0]?.site_id || "abc",
  );
  const [blockWiseCleaning, setBlockWiseCleaning] = useState([]);
  const [gateways, setGateways] = useState([]);
  const [robotsData, setRobotsData] = useState([]);
  const [siteCoordinates, setSiteCoordinates] = useState({});
  const [totalAreaCleaned, setTotalAreaCleaned] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [logo, setLogo] = useState("");
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
          },
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
        setLogo(response.data.data.logo);
      } catch (error) {
        dispatch({
          type: "FETCH_SITE_DETAILS_FAIL",
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
          },
        );
        dispatch({
          type: "FETCH_WEATHER_SUCCESS",
          payload: response.data.data,
        });
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

    fetchSiteDetails();
    fetchWeatherData();
    fetchSiteIds();
  }, [authtoken, site_id]);

  const handleSiteNameChange = (e) => {
    dispatch({ type: "SELECT_SITENAME_REQUEST" });

    const selectedSiteName = e.target.value;

    const selectedSite = siteIds.find(
      (site) => site.site_id === selectedSiteName,
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
  const formatNumberShort = (num) => {
    if (num === null || num === undefined) return "0";

    const n = Number(num); // ✅ handle string values
    if (isNaN(n)) return "0";

    const absNum = Math.abs(n);

    if (absNum >= 1e12) return (n / 1e12).toFixed(2) + " T";
    if (absNum >= 1e9) return (n / 1e9).toFixed(2) + " B";
    if (absNum >= 1e6) return (n / 1e6).toFixed(2) + " M";
    if (absNum >= 1e3) return (n / 1e3).toFixed(2) + " K";

    return n.toFixed(2);
  };

  const getWeatherType = () => {
    const cloudiness = weatherData && weatherData?.cloudiness;
    const cloudy = weatherData && weatherData?.description?.includes("cloud");

    const rainy = weatherData && weatherData?.is_rain;

    if (rainy) return "rainy";
    if (cloudy || cloudiness > 70) return "cloudy";
    if (weatherData?.humidity > 60 && cloudiness > 40 && !rainy) return "foggy";
    return "sunny";
  };

  const weatherType = getWeatherType();
  console.log(weatherData?.cloudiness);
  console.log(weatherData?.is_rain);
  console.log(weatherData?.humidity);
  console.log(weatherData?.description);
  return (
    <>
      <div className={``}>
        <div className="p-2 z-0">
          <div className="">
            <CRow className="g-4">
              {/* Map Section */}
              <CCol xs={12} md={6}>
                <CCard className="h-100 border-0 shadow-sm z-0">
                  <CCardHeader className="">
                    Hello {userInfo.username},
                    <span className="text-success"> {getGreeting()}</span>
                  </CCardHeader>
                  <CCardBody className="p-0">
                    <div>
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
                          siteCoordinates.longitude,
                        )
                      )}
                    </div>
                  </CCardBody>
                </CCard>
              </CCol>

              {/* Weather Section */}
              <CCol xs={12} md={6}>
                <CCard className="h-100 shadow-sm border-0">
                  <CCardHeader className="fw-bold">
                    <CRow className="d-flex justify-content-between align-items-center">
                      <CCol md={4} className="">
                        Current Weather
                      </CCol>

                      <CCol md={8} className="">
                        {loadingSiteIds ? (
                          // <LoadingSpinner />
                          <span className="d-flex justify-content-center align-items-center">
                            {" "}
                            Fetching
                          </span>
                        ) : errorSiteIds ? (
                          <CBadge color="warning" className="">
                            {errorSiteIds === "Site not found"
                              ? "Please contact Admin to view Data"
                              : errorSiteIds}
                          </CBadge>
                        ) : (
                          <CFormSelect
                            value={site_id}
                            onChange={handleSiteNameChange}
                            className="form-select p-1 mx-1"
                            style={{ fontSize: "12px" }}
                            aria-label="Select Site"
                          >
                            <option value="" disabled>
                              Select Site
                            </option>
                            {siteIds.map((site) => (
                              <option key={site.site_id} value={site.site_id}>
                                {site.site_id}
                              </option>
                            ))}
                          </CFormSelect>
                        )}
                      </CCol>
                    </CRow>
                  </CCardHeader>
                  {/* <CCardBody className="d-flex flex-column">
                    {loadingWeatherData ? (
                      <div
                        className="d-flex justify-content-center align-items-center"
                        style={{ minHeight: "350px" }}
                      >
                        <LoadingSpinner />
                      </div>
                    ) : errorWeatherData ? (
                      <div
                        className="d-flex justify-content-center align-items-center"
                        style={{ minHeight: "350px" }}
                      >
                        {errorWeatherData ===
                        `Weather data for site: ${site_id} not found` ? (
                          <CBadge color="warning" className="p-2">
                            Please contact Admin to view Data
                          </CBadge>
                        ) : errorWeatherData ? (
                          <CBadge color="warning" className="p-2">
                            {errorWeatherData}
                          </CBadge>
                        ) : (
                          errorWeatherData
                        )}
                      </div>
                    ) : (
                      <>
               
                        <p className="">
                          Last Updated:{" "}
                          {new Date(weatherData?.createdAt).toLocaleString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                              hour12: true,
                            },
                          )}
                        </p>
                        <p className="">{weatherData?.siteName}</p>

                        <CRow className="s">
                          <CCol xs={6}>
                            <CCard className="text-center border-0  bg-gradient rounded-0">
                              <CCardBody>
                                <CIcon
                                  icon={cilSpeedometer}
                                  className="mb-2 text-danger"
                                  size="lg"
                                />
                                <h5>{weatherData?.temperature}°C</h5>
                                <div className="text-muted small">
                                  Feels Like
                                </div>
                              </CCardBody>
                            </CCard>
                          </CCol>
                          <CCol xs={6}>
                            <CCard className="text-center border-0 bg-gradient rounded-0">
                              <CCardBody>
                                <CIcon
                                  icon={cilCloud}
                                  className="mb-2 text-primary"
                                  size="lg"
                                />
                                <h5>{weatherData?.cloudiness}%</h5>
                                <div className="text-muted small">
                                  Cloudiness
                                </div>
                              </CCardBody>
                            </CCard>
                          </CCol>
                          <CCol xs={6}>
                            <CCard className="text-center border-0 bg-gradient rounded-0">
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
                                    weatherData?.createdAt,
                                  ).toLocaleTimeString()}
                                </div>
                              </CCardBody>
                            </CCard>
                          </CCol>
                          <CCol xs={6}>
                            <CCard className="text-center border-0  bg-gradient rounded-0">
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
                  </CCardBody> */}

                  <CCardBody className="p-0">
                    {loadingWeatherData ? (
                      <div
                        className="d-flex justify-content-center align-items-center"
                        style={{ minHeight: 390 }}
                      >
                        <LoadingSpinner />
                      </div>
                    ) : errorWeatherData ? (
                      <div
                        className="d-flex justify-content-center align-items-center"
                        style={{ minHeight: 390 }}
                      >
                        <CBadge color="warning" className="p-2">
                          {errorWeatherData ===
                          `Weather data for site: ${site_id} not found`
                            ? "Please contact Admin to view Data"
                            : errorWeatherData}
                        </CBadge>
                      </div>
                    ) : (
                      <Weather
                        weatherType={weatherType} // "sunny"|"rainy"|"cloudy"|"foggy"
                        weatherData={weatherData} // full API response object
                        siteName={weatherData?.siteName}
                        logo={logo}
                      />
                    )}
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          </div>
          <div className="mt-2">
            <CRow className="justify-content-center">
              <CCol xs={12} md={6} className="mt-4">
                <CCard className=" shadow">
                  <CCardHeader>
                    <h5 className="text-center">
                      Total Area Cleaned
                      <span className="text-success fw-bold ms-2">
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
                      <>
                        {siteDetailsError === "Site not found" ||
                        siteDetailsError === "Site Coordinates not found" ? (
                          <CBadge color="warning" className="p-2">
                            Please contact to Admin to view Data
                          </CBadge>
                        ) : (
                          siteDetailsError
                        )}
                      </>
                    ) : (
                      <>
                        {blockWiseCleaning?.length > 0 ? (
                          <CChartPie
                            style={{ height: "300px" }}
                            data={{
                              labels: blockWiseCleaning.map(
                                (block) => block.block,
                              ),
                              datasets: [
                                {
                                  data: blockWiseCleaning.map(
                                    (block) => block.areaCleaned,
                                  ),
                                  backgroundColor: chartColors.slice(
                                    0,
                                    blockWiseCleaning.length,
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
                                        blockWiseCleaning[
                                          tooltipItem.dataIndex
                                        ];
                                      return ` ${
                                        block.block || "Unassigned"
                                      } | ${formatNumberShort(block.areaCleaned)} m²`;
                                      // return ` ${
                                      //   block.block || "Unassigned"
                                      // } |  ${block.areaCleaned} m`;
                                    },
                                  },
                                },
                              },
                            }}
                          />
                        ) : (
                          <CBadge color="warning">
                            No Cleaning Data available
                          </CBadge>
                        )}
                      </>
                      // <div>
                      //   <CBadge color="warning fs-5">
                      //     Stay tuned for more updates!
                      //   </CBadge>
                      // </div>
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
                      <>
                        {siteDetailsError === "Site not found" ||
                        siteDetailsError === "Site Coordinates not found" ? (
                          <CBadge color="warning" className="p-2">
                            Please contact to Admin to view Data
                          </CBadge>
                        ) : siteDetailsError ? (
                          <CBadge color="warning" className="p-2">
                            {siteDetailsError}
                          </CBadge>
                        ) : null}
                      </>
                    ) : (
                      <>
                        {gateways.length > 0 ? (
                          <CChartPie
                            style={{ height: "300px" }}
                            data={{
                              labels: gateways.map(
                                (gateway) => gateway.gateway_name,
                              ),
                              datasets: [
                                {
                                  data: gateways.map(() => 1),
                                  backgroundColor: gateways.map((gateway) =>
                                    gateway.gateway_status
                                      ? "#28a745"
                                      : "#dc3545",
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
                                      }${
                                        gateway.battery_voltage
                                          ? `| Battery:  ${gateway.battery_voltage} %`
                                          : ""
                                      }`;
                                    },
                                  },
                                },
                              },
                            }}
                          />
                        ) : (
                          <CBadge color="warning">
                            No Gateway details available
                          </CBadge>
                        )}
                      </>
                    )}
                  </div>
                </CCard>
              </CCol>
            </CRow>
          </div>
          <div className="mt-2">
            <CCard className="shadow">
              <CCardHeader>
                <h5>Battery Status</h5>{" "}
              </CCardHeader>
              <CCardBody
                className="d-flex justify-content-center align-items-center"
                // style={{ minHeight: "350px" }}
              >
                {loadingSiteDetails ? (
                  <LoadingSpinner />
                ) : siteDetailsError ? (
                  <>
                    {siteDetailsError === "Site not found" ||
                    siteDetailsError === "Site Coordinates not found" ? (
                      <CBadge color="warning" className="p-2">
                        Please contact to Admin to view Data
                      </CBadge>
                    ) : (
                      siteDetailsError
                    )}
                  </>
                ) : (
                  <>
                    {robotsData?.length > 0 ? (
                      // <CChartLine
                      //   style={{ height: "300px", width: "100%" }}
                      //   data={{
                      //     labels: batteryChartData.map((entry) =>
                      //       entry.robot.slice(-3)
                      //     ),
                      //     datasets: [
                      //       {
                      //         label: "Battery (%)",
                      //         data: batteryChartData.map((entry) => entry.value),
                      //         borderColor: "#648DB3",
                      //         tension: 0.4,
                      //       },
                      //     ],
                      //   }}
                      //   options={{
                      //     scales: {
                      //       y: {
                      //         beginAtZero: true,
                      //       },
                      //     },
                      //   }}
                      // />
                      <CChartBar
                        style={{ height: "300px", width: "100%" }}
                        data={{
                          labels: batteryChartData.map((entry) =>
                            entry.robot.slice(-3),
                          ),
                          datasets: [
                            {
                              label: "Battery (%)",
                              data: batteryChartData.map(
                                (entry) => entry.value,
                              ),
                              backgroundColor: chartColors[1],
                              borderWidth: 1,
                              barThickness: 20, // 👈 Fixed width for each bar (in pixels)
                              maxBarThickness: 20, // 👈 Optional: max limit for bar width
                              categoryPercentage: 0.8, // 👈 Optional: % of available space per category
                              barPercentage: 0.9, // 👈 Optional: % of space inside each category
                            },
                          ],
                        }}
                        options={{
                          maintainAspectRatio: false, // 🔑 let it expand
                          responsive: true, // 🔑 auto adjust width
                          scales: {
                            y: {
                              beginAtZero: true,
                            },
                          },
                        }}
                      />
                    ) : (
                      <CBadge color="warning">
                        No battery logs found for the Robots
                      </CBadge>
                    )}
                  </>
                )}
              </CCardBody>
            </CCard>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientAdminDashboard;
