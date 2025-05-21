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
    case "SET_SITE_COORDINATES":
      return { ...state, selectedSiteData: action.payload };
    case "FETCH_DISTANCE_REQUEST":
      return { ...state, loadingDistance: true };
    case "FETCH_DISTANCE_SUCCESS":
      return {
        ...state,
        distanceSummaryData: action.payload,
        loadingDistance: false,
      };
    case "FETCH_DISTANCE_FAIL":
      return { ...state, loadingDistance: false, error: action.payload };
    case "FETCH_REQUEST":
      return { ...state, loadingBatteryStatus: true, error: "" };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loadingBatteryStatus: false,
        robotData: action.payload,
      };
    case "FETCH_FAIL":
      return { ...state, loadingBatteryStatus: false, error: action.payload };
    case "FETCH_GATEWAYS_REQUEST":
      return { ...state, loadingGateways: true };
    case "FETCH_GATEWAYS_SUCCESS":
      return {
        ...state,
        gatewaysData: action.payload,
        loadingGateways: false,
      };
    case "FETCH_GATEWAYS_FAIL":
      return { ...state, loadingGateways: false, error: action.payload };
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
    error: "",
    selectedSiteData: null,
    loading: true,
    distanceSummaryData: [],
    gatewaysData: [],
    loadingGateways: false,
    robotData: null,
    loadingBatteryStatus: false,
    loadingDistance: false,
  });

  const [siteName, setSiteName] = useState({
    site_id: "",
  });

  const [liveLocation, setLiveLocation] = useState(null);

  // Fetch site IDs on first load
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

    fetchSiteIds();
  }, [authtoken]);

  useEffect(() => {
    if (state.siteIds.length > 0 && !siteName.site_id) {
      const firstSite = state.siteIds[0];
      setSiteName({ site_id: firstSite.site_id });
      dispatch({ type: "SELECT_SITENAME_SUCCESS", payload: firstSite });
      fetchCoordinates(firstSite.site_id);
    }
  }, [state.siteIds, siteName.site_id]);

  // Fetch robot and distance data when site_id is updated
  useEffect(() => {
    if (!siteName.site_id) return;

    const fetchDebugData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const response = await axios.get(
          `/api/v1/robots/sitewise-battery-status/${siteName.site_id}`,
          {
            headers: {
              Authorization: `Bearer ${authtoken}`,
            },
          }
        );
        dispatch({ type: "FETCH_SUCCESS", payload: response.data.robots });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload:
            error.response?.data?.message ||
            error.response?.data?.error ||
            "Unknown error",
        });
      }
    };

    const fetchDistanceSummary = async () => {
      dispatch({ type: "FETCH_DISTANCE_REQUEST" });
      try {
        const response = await axios.get(
          `/api/v1/cleaninglogs/distance-summary/${siteName.site_id}`,
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );
        dispatch({
          type: "FETCH_DISTANCE_SUCCESS",
          payload: response.data,
        });
      } catch (error) {
        toast.error(error.response?.data?.message || error.message);
        dispatch({ type: "FETCH_DISTANCE_FAIL", payload: error.message });
      }
    };

    const fetchGateways = async () => {
      dispatch({ type: "FETCH_GATEWAYS_REQUEST" });
      try {
        const response = await axios.get(
          `/api/v1/gateways/site/${siteName.site_id}`,
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );
        dispatch({
          type: "FETCH_GATEWAYS_SUCCESS",
          payload: response.data.data,
        });
      } catch (error) {
        toast.error(error.response?.data?.message || error.message);
        dispatch({ type: "FETCH_GATEWAYS_FAIL", payload: error.message });
      }
    };

    fetchDebugData();
    fetchDistanceSummary();
    fetchGateways();
  }, [siteName.site_id, authtoken]);

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

  useEffect(() => {
    getLiveLocation();
  }, []);

  const RecenterMap = ({ lat, lng }) => {
    const map = useMap();

    useEffect(() => {
      map.setView([lat, lng], map.getZoom(), { animate: true });
    }, [lat, lng, map]);

    return null;
  };

  const fetchCoordinates = async (selectedId) => {
    try {
      const res = await axios.post(
        "/api/v1/sites-coordinates/get-by-siteId",
        { site_id: selectedId },
        { headers: { Authorization: `Bearer ${authtoken}` } }
      );
      dispatch({ type: "SET_SITE_COORDINATES", payload: res.data.data });
    } catch (error) {
      toast.error(error.response.data.message || error.response.data.error);
      dispatch({
        type: "PUNCH_FAIL",
        payload: error.response.data.message || error.response.data.error,
      });
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

      fetchCoordinates(selectedSite.site_id);
    } else {
      dispatch({ type: "SELECT_SITENAME_FAIL" });
    }
  };

  useEffect(() => {
    if (state.siteIds?.length > 0 && !siteName.site_id) {
      const firstSite = state.siteIds[0];
      setSiteName({ site_id: firstSite.site_id });

      dispatch({ type: "SELECT_SITENAME_SUCCESS", payload: firstSite });

      fetchCoordinates(firstSite.site_id);
    }
  }, [fetchCoordinates, siteName.site_id, state.siteIds]);

  const chartColors = [
    "#FF5733",
    "#28A745",
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

    "#FF6B6B",
    "#4ECDC4",
    "#1A535C",
    "#F7FFF7",
    "#FF9F1C",
    "#2B2D42",
    "#8D99AE",
    "#EDF2F4",
    "#EF233C",
    "#D90429",
    "#FFB6B9",
    "#FAE3D9",
    "#BBDED6",
    "#8AC6D1",
    "#FFC3A0",
    "#FF677D",
    "#D4A5A5",
    "#392F5A",
    "#31A2AC",
    "#61C0BF",
    "#6B4226",
    "#D9BF77",
    "#ACD8AA",
    "#FFE156",
    "#6A0572",
    "#AB83A1",
    "#473E66",
    "#F5B700",
    "#1E3888",
    "#00A878",
  ];

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

  const batteryChartData =
    state.robotData?.map((entry) => ({
      robot: entry.robot_no,
      value: parseInt(entry.battery_voltage),
    })) || [];

  return (
    <>
      <div className="p-4">
        <CCol md={3} className="mb-3">
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
                    state.selectedSiteData
                      ? [
                          state.selectedSiteData.latitude,
                          state.selectedSiteData.longitude,
                        ]
                      : [18.6485, 73.8313]
                  }
                  zoom={12}
                  scrollWheelZoom={false}
                  style={{ height: "100%", width: "100%", borderRadius: "8px" }}
                >
                  <SatelliteMap
                    latitude={state.selectedSiteData?.latitude}
                    longitude={state.selectedSiteData?.longitude}
                  />
                  {state.selectedSiteData && (
                    <>
                      <RecenterMap
                        lat={state.selectedSiteData.latitude}
                        lng={state.selectedSiteData.longitude}
                      />
                    </>
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
      </div>

      <div className="mt-4">
        <CRow className="justify-content-center">
          <CCol xs={12} md={6} className="mt-4">
            <CCard className="mb-4 shadow">
              {state.loadingDistance ? (
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ minHeight: "350px" }}
                >
                  <LoadingSpinner />
                </div>
              ) : state.error ? (
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ minHeight: "350px" }}
                >
                  <p className="text-danger text-center">{state.error}</p>
                </div>
              ) : state.distanceSummaryData.blocks === 0 ? (
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ minHeight: "350px" }}
                >
                  <CAlert color="warning" className="text-center mb-0">
                    No data available for the selected site.
                  </CAlert>
                </div>
              ) : (
                <>
                  <CCardHeader>
                    <h5 className="text-center">
                      Total Area Cleaned:{" "}
                      <span className="text-success fw-bold">
                        {state.distanceSummaryData?.totalAreaCleaned} m
                      </span>
                    </h5>
                  </CCardHeader>
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ minHeight: "350px" }}
                  >
                    {Array.isArray(state.distanceSummaryData?.blocks) &&
                    state.distanceSummaryData.blocks.length > 0 ? (
                      <CChartPie
                        style={{ height: "300px" }}
                        data={{
                          labels: state.distanceSummaryData.blocks.map(
                            (block) => block.block
                          ),
                          datasets: [
                            {
                              data: state.distanceSummaryData.blocks.map(
                                (block) => block.areaCleaned
                              ),
                              backgroundColor: chartColors.slice(
                                0,
                                state.distanceSummaryData.blocks.length
                              ),
                            },
                          ],
                        }}
                        options={{
                          plugins: {
                            legend: { position: "right" },
                            tooltip: {
                              callbacks: {
                                label: function (tooltipItem) {
                                  const block =
                                    state.distanceSummaryData.blocks[
                                      tooltipItem.dataIndex
                                    ];
                                  return `🧱 ${block.block} | 🧼 ${block.areaCleaned} m²`;
                                },
                              },
                            },
                          },
                        }}
                      />
                    ) : (
                      <p className="text-center text-muted">
                        No data available
                      </p>
                    )}
                  </div>
                </>
              )}
            </CCard>
          </CCol>

          <CCol xs={12} md={6} className="mt-4">
            <CCard className="mb-4 shadow">
              <CCardHeader>
                <h5 className="text-center">Gateways Brief</h5>
              </CCardHeader>

              <CCardBody
                className="d-flex justify-content-center align-items-center"
                style={{ minHeight: "350px" }}
              >
                {state.loadingGateways ? (
                  <LoadingSpinner />
                ) : state.error ? (
                  <p className="text-danger text-center">{state.error}</p>
                ) : state.gatewaysData.length === 0 ? (
                  <CAlert color="warning" className="text-center mb-0">
                    No data available for the selected site.
                  </CAlert>
                ) : (
                  <CChart
                    type="doughnut"
                    style={{ height: "300px" }}
                    data={{
                      labels: state.gatewaysData.map(
                        (gateway) => gateway.gateway_name
                      ),
                      datasets: [
                        {
                          data: state.gatewaysData.map(() => 1),
                          backgroundColor: state.gatewaysData.map((gateway) =>
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
                )}
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </div>

      <div className="mt-4" style={{ width: "100%", height: "70%" }}>
        {state.loadingBatteryStatus ? (
          <CSpinner color="primary" />
        ) : state.robotData?.length === 0 ? (
          <CAlert color="warning">No battery logs found for the Robots</CAlert>
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
    </>
  );
};

export default ClientAdminDashboard;
