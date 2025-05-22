import {
  CAlert,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormSelect,
  CRow,
  CSpinner,
} from "@coreui/react";
import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import toast from "react-hot-toast";
import { MapContainer, useMap } from "react-leaflet";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../components/LoadingSpinner";
import { CChart, CChartLine, CChartPie } from "@coreui/react-chartjs";

const chartColors = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
  "#9966FF",
  "#FF9F40",
];

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_SITEID_REQUEST":
      return { ...state, loadingSiteIds: true, error: "" };
    case "FETCH_SITEID_SUCCESS":
      return {
        ...state,
        loadingSiteIds: false,
        siteIds: action.payload,
      };
    case "FETCH_SITEID_FAIL":
      return { ...state, loadingSiteIds: false, error: action.payload };
    case "SELECT_SITENAME_REQUEST":
      return { ...state, loadingFields: true };
    case "SELECT_SITENAME_SUCCESS":
      return {
        ...state,
        loadingFields: false,
        selectedSiteName: action.payload,
      };
    case "SELECT_SITENAME_FAIL":
      return { ...state, loadingFields: false };
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
    default:
      return state;
  }
};

const ClientAdminDashboard = () => {
  const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);
  const [state, dispatch] = useReducer(reducer, {
    loadingSiteIds: false,
    siteIds: [],
    siteDetailsError: "",
    loadingSiteDetails: false,
    siteDetails: [],
    error: "",
  });

  const [siteName, setSiteName] = useState({
    site_id: "",
  });
  const [liveLocation, setLiveLocation] = useState(null);
  const [blockWiseCleaning, setBlockWiseCleaning] = useState([]);
  const [gateways, setGateways] = useState([]);
  const [robotsData, setRobotsData] = useState([]);
  const [siteCoordinates, setSiteCoordinates] = useState({});
  const [totalAreaCleaned, setTotalAreaCleaned] = useState(0);

  useEffect(() => {
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
          payload: error.response?.data?.error || "Error fetching sites",
        });
        toast.error(error.response?.data?.error || "Error fetching sites");
      }
    };

    const getLiveLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLiveLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => {
            console.error("Error getting location:", error);
          }
        );
      } else {
        alert("Geolocation is not supported by this browser.");
      }
    };

    fetchSiteIds();
    getLiveLocation();
  }, [authtoken]);

  useEffect(() => {
    if (state.siteIds.length > 0 && !siteName.site_id) {
      const firstSite = state.siteIds[0];
      setSiteName({ site_id: firstSite.site_id });
      dispatch({ type: "SELECT_SITENAME_SUCCESS", payload: firstSite });
      fetchSiteDetails(firstSite.site_id);
    }
  }, [state.siteIds, siteName.site_id]);

  const fetchSiteDetails = async (siteId) => {
    dispatch({ type: "FETCH_SITE_DETAILS_REQUEST" });
    try {
      const response = await axios.get(
        `/api/v1/sites-coordinates/site-details/${siteId}`,
        {
          headers: { Authorization: `Bearer ${authtoken}` },
        }
      );

      console.log(response.data.data);

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

  const handleSiteNameChange = (e) => {
    dispatch({ type: "SELECT_SITENAME_REQUEST" });

    const selectedSiteName = e.target.value;
    const selectedSite = state.siteIds.find(
      (site) => site.site_id.toString() === selectedSiteName
    );

    if (selectedSite) {
      setSiteName({
        site_id: selectedSite.site_id,
      });

      dispatch({ type: "SELECT_SITENAME_SUCCESS", payload: selectedSite });
      fetchSiteDetails(selectedSite.site_id);
    } else {
      dispatch({ type: "SELECT_SITENAME_FAIL" });
    }
  };

  const SatelliteMap = ({ latitude, longitude }) => {
    if (!latitude || !longitude) return null;

    const src = `https://maps.google.com/maps?hl=en&q=${latitude},${longitude}&t=k&z=18&ie=UTF8&iwloc=B&output=embed`;

    return (
      <iframe
        title="Google Satellite Map"
        className="rounded map"
        width="100%"
        height="415"
        src={src}
        style={{ borderRadius: "8px", width: "100%" }}
        allowFullScreen
      />
    );
  };

  const RecenterMap = ({ lat, lng }) => {
    const map = useMap();

    useEffect(() => {
      map.setView([lat, lng], map.getZoom(), { animate: true });
    }, [lat, lng, map]);

    return null;
  };

  const batteryChartData =
    robotsData?.map((entry) => ({
      robot: entry.robot_no,
      value: parseInt(entry.battery_voltage),
    })) || [];

  return (
    <>
      <div className="p-4">
        <CCol md={3} className="mb-3">
          <label className="form-label">
            {state.loadingSiteIds && <LoadingSpinner />}
          </label>
          <CFormSelect
            name="site_id"
            value={siteName.site_id}
            onChange={handleSiteNameChange}
          >
            {state.siteIds?.length > 0 ? (
              state.siteIds.map((item) => (
                <option key={item.site_id} value={item.site_id}>
                  {item.site_id}
                </option>
              ))
            ) : (
              <option value="">
                <LoadingSpinner />
              </option>
            )}
          </CFormSelect>
        </CCol>

        <div className="flex flex-wrap gap-4">
          <CRow>
            <CCol>
              {/* Map Container */}
              <div
                style={{ flex: "1 1 60%", minWidth: "350px", height: "400px" }}
              >
                <MapContainer
                  center={
                    siteCoordinates.latitude != null &&
                    siteCoordinates.longitude != null
                      ? [siteCoordinates.latitude, siteCoordinates.longitude]
                      : [18.6485, 73.8313]
                  }
                  zoom={12}
                  scrollWheelZoom={false}
                  style={{ height: "100%", width: "100%", borderRadius: "8px" }}
                >
                  <SatelliteMap
                    latitude={siteCoordinates.latitude}
                    longitude={siteCoordinates.longitude}
                  />
                  {siteCoordinates.latitude != null &&
                    siteCoordinates.longitude != null && (
                      <RecenterMap
                        lat={siteCoordinates.latitude}
                        lng={siteCoordinates.longitude}
                      />
                    )}
                </MapContainer>
              </div>
            </CCol>

            <CCol md={4}>
              <div className="flex flex-col gap-3 ">
                <h6 className="mx-3">
                  Hello{" "}
                  <span className="text-primary"> {userInfo.username}</span> ,
                  Good Morning!
                </h6>
                <CCard
                  className="shadow-sm rounded border-0"
                  style={{
                    background: "linear-gradient(135deg, #C850C0, #4158D0)",
                  }}
                >
                  <CCardBody className="rounded-xl  text-white">
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
                      Last Fetched: 2025-05-07 16:00:03
                    </div>

                    <div className="mt-2 text-lg font-semibold">
                      Avaada Clean Projects Private Limited, Agar, MP - 28.46°C
                    </div>
                  </CCardBody>
                </CCard>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <CRow className="my-1 text-center">
                    <CCol md={6} className=" ">
                      <div className="rounded-md p-2 shadow-sm text-center my-2">
                        <div className="text-sm font-bold text-pink-600">
                          28℃
                        </div>
                        <div style={{ fontSize: "14px" }}>Feels Like</div>
                        <div style={{ fontSize: "14px" }}>Temperature</div>
                      </div>
                      <div className="rounded-md p-2 shadow-sm text-center my-2">
                        <div className="text-sm font-bold text-pink-600">
                          46%
                        </div>
                        <div style={{ fontSize: "14px" }}>Outside</div>
                        <div style={{ fontSize: "14px" }}>Humidity</div>
                      </div>
                    </CCol>
                    <CCol md={6} className=" ">
                      <div className="rounded-md p-2 shadow-sm text-center my-2">
                        <div className="text-sm font-bold text-pink-600">
                          4 m/s
                        </div>
                        <div style={{ fontSize: "14px" }}>Max Wind Speed</div>
                        <div style={{ fontSize: "12px" }}>
                          At 2025-05-07 16:00:03
                        </div>
                      </div>
                      <div className="rounded-md p-2 shadow-sm text-center my-2">
                        <div className="text-sm font-bold text-pink-600">
                          98%
                        </div>
                        <div style={{ fontSize: "14px" }}>Clouds</div>
                        <div style={{ fontSize: "14px" }}>Outside</div>
                      </div>
                    </CCol>
                  </CRow>
                </div>
              </div>
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
                  {state.loadingSiteDetails ? (
                    <LoadingSpinner />
                  ) : state.error ? (
                    <p className="text-danger text-center">{state.error}</p>
                  ) : (
                    <>
                      {blockWiseCleaning.length > 0 ? (
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
                                    return `🧱 ${
                                      block.block || "Unassigned"
                                    } | 🧼 ${block.areaCleaned} m²`;
                                  },
                                },
                              },
                            },
                          }}
                        />
                      ) : (
                        <p className="text-center text-muted">
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
                  <h5 className="text-center">Gateways Brief</h5>
                </CCardHeader>
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ minHeight: "350px" }}
                >
                  {state.loadingSiteDetails ? (
                    <LoadingSpinner />
                  ) : state.error ? (
                    <p className="text-danger text-center">{state.error}</p>
                  ) : (
                    <>
                      {gateways.length > 0 ? (
                        <CChart
                          type="doughnut"
                          style={{ height: "300px" }}
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
                                position: "right",
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

        <div className="mt-4" style={{ width: "100%", height: "70%" }}>
          {state.loadingSiteDetails ? (
            <CSpinner color="primary" />
          ) : state.robotData?.length === 0 ? (
            <CAlert color="warning">
              No battery logs found for the Robots
            </CAlert>
          ) : (
            <CCard>
              <CCardHeader>Battery Status</CCardHeader>
              <CCardBody>
                <CChartLine
                  data={{
                    labels: batteryChartData.map((entry) =>
                      entry.robot.slice(-3)
                    ),
                    datasets: [
                      {
                        label: "Battery (%)",
                        data: batteryChartData.map((entry) => entry.value),
                        borderColor: "rgb(255, 99, 132)",
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
              </CCardBody>
            </CCard>
          )}
        </div>
      </div>
    </>
  );
};

export default ClientAdminDashboard;
