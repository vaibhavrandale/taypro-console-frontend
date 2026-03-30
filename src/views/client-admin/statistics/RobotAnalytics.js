import React, { useState, useEffect, useReducer } from "react";
import axios from "axios";
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CFormInput,
} from "@coreui/react";
import { useSelector } from "react-redux";
import { CChartBar, CChartLine } from "@coreui/react-chartjs";
import LoadingSpinner from "../../../components/LoadingSpinner";
import SubscriptionExpiryCard from "../../../components/SubscriptionExpiryCard";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_CLEANING_REQUEST":
      return { ...state, robotAnalyticsLoading: true, robotAnalyticsError: "" };

    case "FETCH_CLEANING_SUCCESS":
      return {
        ...state,
        robotAnalyticsLoading: false,
        CleaningData: action.payload.data,
        avg_cleaning_minutes: action.payload.avg_cleaning_minutes,
        total_cycles: action.payload.total_cycles,
        maxWheelCurrent: action.payload.maxWheelCurrent,
        avgWheelCurrent: action.payload.avgWheelCurrent,
        maxBrushCurrent: action.payload.maxBrushCurrent,
        avgBrushCurrent: action.payload.avgBrushCurrent,
      };

    case "FETCH_FAIL":
      return {
        ...state,
        robotAnalyticsLoading: false,
        robotAnalyticsError: action.payload,
        subscriptiondata: action.subscriptiondata,
        subscriptionStatus: action.subscriptionStatus,
      };
    default:
      return state;
  }
};

const RobotAnalytics = () => {
  const [
    {
      robotAnalyticsLoading,
      robotAnalyticsError,
      CleaningData,
      total_cycles,
      avg_cleaning_minutes,
      maxWheelCurrent,
      avgWheelCurrent,
      maxBrushCurrent,
      avgBrushCurrent,
      subscriptiondata,
      subscriptionStatus,
    },
    dispatch,
  ] = useReducer(reducer, {
    robotAnalyticsLoading: false,
    robotAnalyticsError: "",
    CleaningData: [],
    avg_cleaning_minutes: 0,
    total_cycles: 0,
    maxWheelCurrent: 0,
    avgWheelCurrent: 0,
    maxBrushCurrent: 0,
    avgBrushCurrent: 0,
    subscriptiondata: {},
    subscriptionStatus: "",
  });

  const today = new Date();
  const last7 = new Date();
  const authtoken = useSelector((state) => state.authtoken);
  last7.setDate(today.getDate() - 7);

  const formatDate = (d) => d.toISOString().slice(0, 10);

  const [startDate, setStartDate] = useState(formatDate(last7));
  const [endDate, setEndDate] = useState(formatDate(today));

  const [robots, setRobots] = useState([]);
  const [filteredRobots, setFilteredRobots] = useState([]);
  const [selectedRobot, setSelectedRobot] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

  useEffect(() => {
    const cachedRobots = JSON.parse(localStorage.getItem("robots")) || [];
    setRobots(cachedRobots);
  }, []);

  useEffect(() => {
    if (robots.length > 0 && !selectedRobot) {
      setSelectedRobot(robots[0]?.robot_no);
      setSearchTerm(robots[0]?.robot_no);
    }
  }, [robots, selectedRobot]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const fetchRobotAnalytics = async () => {
      try {
        if (!selectedRobot) return;
        dispatch({ type: "FETCH_CLEANING_REQUEST" });

        const result = await axios.post(
          `/api/v1/robot-tracking/robot-cleaning-analytics`,
          {
            robot_no: selectedRobot,
            startDate,
            endDate,
          },
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          },
        );
        const resData = result.data;

        dispatch({
          type: "FETCH_CLEANING_SUCCESS",
          payload: {
            data: resData.data, // ✅ correct
            avg_cleaning_minutes: resData.avg_cleaning_minutes,
            total_cycles: resData.total_cycles,
            maxWheelCurrent: resData.maxWheelCurrent,
            avgWheelCurrent: resData.avgWheelCurrent,
            maxBrushCurrent: resData.maxBrushCurrent,
            avgBrushCurrent: resData.avgBrushCurrent,
          },
        });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: error.response?.data?.error || error.response?.data?.message,
          subscriptiondata: error.response?.data?.data,
          subscriptionStatus: error.response?.data?.subscriptionStatus,
        });
        toast.error(
          error.response?.data?.error || error.response?.data?.message,
        );
      }
    };

    fetchRobotAnalytics();
  }, [startDate, endDate, authtoken, selectedRobot]);
  useEffect(() => {
    if (debouncedSearch && debouncedSearch.length > 0) {
      const filtered =
        robots &&
        robots.filter((robot) =>
          robot.robot_no?.toLowerCase().includes(debouncedSearch.toLowerCase()),
        );

      setFilteredRobots(filtered);
    } else {
      setFilteredRobots([]);
    }
  }, [debouncedSearch, robots]);

  const handleRobotSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  /* ---------------------- PROCESS DATA ---------------------- */

  const formatCurrent = (value) => {
    if (!value && value !== 0) return "-";
    return (value / 1000).toFixed(2);
  };
  const processedData = CleaningData.map((d) => ({
    date: new Date(d.createdAt).toISOString().slice(0, 10),
    robot_no: d.robot_no, // add this

    cleaning_minutes: Math.round(d.cleaning.total_cleaning_time / 60),

    battery_start: d.cleaning.battery_before_cleaning,
    battery_end: d.cleaning.battery_after_cleaning,

    max_brush_current: formatCurrent(d.cleaning.cycle_max_brush_current),
    max_wheel_current: formatCurrent(d.cleaning.cycle_max_wheel_current),

    average_brush_current: formatCurrent(
      d.cleaning.cycle_average_brush_current,
    ),
    average_wheel_current: formatCurrent(
      d.cleaning.cycle_average_wheel_current,
    ),

    cycles: d.cleaning.cycle_count,
  }));

  const filteredData = processedData.filter((d) => {
    const rowDate = new Date(d.date);
    const start = new Date(startDate);
    const end = new Date(endDate);
    const robotMatch =
      !searchTerm ||
      d.robot_no?.toLowerCase().includes(searchTerm?.toLowerCase());

    return rowDate >= start && rowDate <= end && robotMatch;
  });

  /* ---------------------- KPI ---------------------- */

  const avgCleaningTime = avg_cleaning_minutes && avg_cleaning_minutes;
  const checkStatus = [
    "subscriptionSitesAssigned",
    "subscriptionFound",
    "subscriptionaRenewStatus",
    "subscriptionPaymentStatus",
    "subscriptionPlanAccess",
  ];
  return (
    <div>
      {robotAnalyticsLoading ? (
        <LoadingSpinner />
      ) : checkStatus.includes(subscriptionStatus) ? (
        <SubscriptionExpiryCard
          data={subscriptiondata}
          subscriptionStatus={subscriptionStatus}
          error={robotAnalyticsError}
        />
      ) : (
        <>
          {/* FILTER */}

          <CCard className="mb-4">
            <CCardHeader className="d-flex justify-content-between align-items-center">
              Filters
              <Link target="blank" to="/client-admin/site-statistics">
                View Site Statistics
              </Link>
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCol md={3}>
                  <div style={{ position: "relative" }}>
                    <CFormInput
                      type="text"
                      label="Search Robot"
                      placeholder="Search Robot No"
                      value={searchTerm}
                      onChange={handleRobotSearch}
                    />

                    {searchTerm !== selectedRobot &&
                      filteredRobots.length > 0 && (
                        <div
                          style={{
                            position: "absolute",
                            top: "70px",
                            width: "100%",
                            maxHeight: "200px",
                            overflowY: "auto",
                            background: "#212631",
                            border: "1px solid #ddd",
                            borderRadius: "6px",
                            zIndex: 1000,
                          }}
                        >
                          {filteredRobots.length === 0 ? (
                            <div className="p-2 text-center">
                              No robots found
                            </div>
                          ) : (
                            filteredRobots.map((robot, index) => (
                              <div
                                key={index}
                                className="p-2"
                                style={{
                                  cursor: "pointer",
                                  borderBottom: "1px solid #eee",
                                }}
                                onClick={() => {
                                  setSearchTerm(robot.robot_no); // show in input
                                  setSelectedRobot(robot.robot_no); // 🔥 THIS will trigger API
                                  setFilteredRobots([]);
                                }}
                              >
                                {robot.robot_no}
                              </div>
                            ))
                          )}
                        </div>
                      )}
                  </div>
                </CCol>
                <CCol md={2}>
                  <CFormInput
                    type="date"
                    label="Start Date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </CCol>

                <CCol md={2}>
                  <CFormInput
                    type="date"
                    label="End Date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>

          <CCard className="mb-4">
            <CCardBody>
              <CRow className="g-3">
                <CCol md={3}>
                  <CCard className="text-center h-100 shadow-sm ">
                    <CCardBody>
                      <div className="text-muted small mb-1">
                        Average Cleaning Time
                      </div>
                      <div className="fs-3 fw-semibold text-warning">
                        {avgCleaningTime.toFixed(1)}
                      </div>
                      <div className="text-muted small">minutes</div>
                    </CCardBody>
                  </CCard>
                </CCol>

                <CCol md={3}>
                  <CCard className="text-center h-100 shadow-sm ">
                    <CCardBody>
                      <div className="text-muted small mb-1">Total Cycles</div>
                      <div className="fs-3 fw-semibold text-success">
                        {total_cycles}
                      </div>
                    </CCardBody>
                  </CCard>
                </CCol>

                <CCol md={3}>
                  <CCard className="text-center h-100 shadow-sm ">
                    <CCardBody>
                      <div className="text-muted small mb-2">Brush Current</div>

                      <div className="d-flex justify-content-between px-2">
                        <span className="text-muted small">Max</span>
                        <span className="fw-semibold">
                          {maxBrushCurrent}&nbsp;A
                        </span>
                      </div>

                      <div className="d-flex justify-content-between px-2">
                        <span className="text-muted small">Avg</span>
                        <span className="fw-semibold">
                          {avgBrushCurrent}&nbsp;A
                        </span>
                      </div>
                    </CCardBody>
                  </CCard>
                </CCol>

                <CCol md={3}>
                  <CCard className="text-center h-100 shadow-sm ">
                    <CCardBody>
                      <div className="text-muted small mb-2">Wheel Current</div>

                      <div className="d-flex justify-content-between px-2">
                        <span className="text-muted small">Max</span>
                        <span className="fw-semibold">
                          {maxWheelCurrent}&nbsp;A
                        </span>
                      </div>

                      <div className="d-flex justify-content-between px-2">
                        <span className="text-muted small">Avg</span>
                        <span className="fw-semibold">
                          {avgWheelCurrent}&nbsp;A
                        </span>
                      </div>
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>

          {/* CLEANING TIME GRAPH */}

          <CRow>
            <CCol md={12}>
              <CCard>
                <CCardHeader>Cleaning Duration</CCardHeader>
                <CCardBody>
                  <CChartLine
                    style={{ height: 300 }}
                    data={{
                      labels: filteredData.map((d) => d.date),
                      datasets: [
                        {
                          label: "Cleaning Time (minutes)",
                          // borderColor: "#27AE60",
                          // backgroundColor: "#27AE60",
                          data: filteredData.map((d) => d.cleaning_minutes),
                          tension: 0,
                        },
                      ],
                    }}
                    options={{ maintainAspectRatio: false }}
                  />
                </CCardBody>
              </CCard>
            </CCol>

            {/* CYCLES */}
          </CRow>
          <CRow className="mt-4">
            <CCol md={12}>
              <CCard>
                <CCardHeader>Battery Level</CCardHeader>
                <CCardBody>
                  <CChartBar
                    style={{ height: 320 }}
                    data={{
                      labels: filteredData.map((d) => d.date),
                      datasets: [
                        {
                          label: "Battery Start %",
                          backgroundColor: "#27AE60",
                          data: filteredData.map((d) => d.battery_start),
                          barThickness: 25,
                        },
                        {
                          label: "Battery End %",
                          backgroundColor: "#4e73df",
                          data: filteredData.map((d) => d.battery_end),
                          barThickness: 25,
                        },
                      ],
                    }}
                    options={{
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          title: { display: true, text: "Battery %" },
                          min: 0,
                          max: 100,
                        },
                      },
                    }}
                  />
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
          <CRow className="my-4">
            <CCol md={12}>
              <CCard>
                <CCardHeader>Max Motor Current</CCardHeader>

                <CCardBody>
                  <CChartBar
                    style={{ height: 320 }}
                    data={{
                      labels: filteredData.map((d) => d.date),

                      datasets: [
                        {
                          label: "Brush Current (A)",
                          backgroundColor: "#27AE60",
                          data: filteredData.map((d) => d.max_brush_current),
                          barThickness: 25,
                        },

                        {
                          label: "Wheel Current (A)",
                          backgroundColor: "#4e73df",
                          data: filteredData.map((d) => d.max_wheel_current),
                          barThickness: 25,
                        },
                      ],
                    }}
                    options={{
                      maintainAspectRatio: false,

                      plugins: {
                        legend: {
                          position: "top",
                        },
                      },

                      scales: {
                        y: {
                          title: {
                            display: true,
                            text: "Current (A)",
                          },
                          beginAtZero: true,
                        },
                      },
                    }}
                  />
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>

          <CRow className="my-4">
            <CCol md={12}>
              <CCard>
                <CCardHeader>Average Motor Current</CCardHeader>

                <CCardBody>
                  <CChartBar
                    style={{ height: 320 }}
                    data={{
                      labels: filteredData.map((d) => d.date),

                      datasets: [
                        {
                          label: "Brush Current (A)",
                          backgroundColor: "#27AE60",
                          data: filteredData.map(
                            (d) => d.average_brush_current,
                          ),
                          barThickness: 25,
                        },

                        {
                          label: "Wheel Current (A)",
                          backgroundColor: "#4e73df",
                          data: filteredData.map(
                            (d) => d.average_wheel_current,
                          ),
                          barThickness: 25,
                        },
                      ],
                    }}
                    options={{
                      maintainAspectRatio: false,

                      plugins: {
                        legend: {
                          position: "top",
                        },
                      },

                      scales: {
                        y: {
                          title: {
                            display: true,
                            text: "Current (A)",
                          },
                          beginAtZero: true,
                        },
                      },
                    }}
                  />
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </>
      )}
    </div>
  );
};

export default RobotAnalytics;
