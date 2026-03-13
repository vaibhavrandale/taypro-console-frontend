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

import { CChartBar, CChartLine } from "@coreui/react-chartjs";

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
        mx_cycle: action.payload.avg_cycle_count,
      };

    case "FETCH_FAIL":
      return {
        ...state,
        robotAnalyticsLoading: false,
        robotAnalyticsError: action.payload,
        // subscriptiondata: action.subscriptiondata,
        // subscriptionStatus: action.subscriptionStatus,
      };

    default:
      return state;
  }
};

const RobotAnalytics = ({ site_id, authtoken }) => {
  const [
    { robotAnalyticsLoading, robotAnalyticsError, CleaningData = [] },
    dispatch,
  ] = useReducer(reducer, {
    robotAnalyticsLoading: false,
    robotAnalyticsError: "",
    CleaningData: [],
    avg_cleaning_minutes: 0,
    mx_cycle: 0,
  });

  const today = new Date();
  const last7 = new Date();
  last7.setDate(today.getDate() - 12);

  const formatDate = (d) => d.toISOString().slice(0, 10);

  const [startDate, setStartDate] = useState(formatDate(last7));
  const [endDate, setEndDate] = useState(formatDate(today));

  const [robots, setRobots] = useState([]);
  const [filteredRobots, setFilteredRobots] = useState([]);
  const [selectedRobot, setSelectedRobot] = useState("");
  // const [searchTerm, setSearchTerm] = useState(robots && robots[0]?.robot_no);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm]);
  useEffect(() => {
    const cachedRobots = JSON.parse(localStorage.getItem("robots")) || [];
    setRobots(cachedRobots);
  }, []);

  useEffect(() => {
    if (robots.length > 0 && !selectedRobot) {
      setSelectedRobot(robots[0].robot_no);
      setSearchTerm(robots[0].robot_no);
    }
  }, [robots, selectedRobot]);

  useEffect(() => {
    const fetchRobotAnalytics = async () => {
      try {
        dispatch({ type: "FETCH_CLEANING_REQUEST" });

        const result = await axios.post(
          `/api/v1/robot-tracking/robot-cleaning-analytics`,
          {
            robot_no: selectedRobot || robots[0]?.robot_no,
            site_id,
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
            avg_cycle_count: resData.avg_cycle_count,
          },
        });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: error.response?.data?.error || error.response?.data?.message,
        });
      }
    };

    fetchRobotAnalytics();
  }, [site_id, startDate, endDate, authtoken, selectedRobot]);
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
  // const handleRobotSearch = (e) => {
  //   const value = e.target.value;
  //   setSearchTerm(value);

  //   if (value.length > 0) {
  //     const filtered = robots.filter((robot) =>
  //       robot.robot_no?.toLowerCase().includes(value.toLowerCase()),
  //     );
  //     setFilteredRobots(filtered);
  //   } else {
  //     setFilteredRobots([]);
  //   }
  // };

  const handleRobotSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  /* ---------------------- PROCESS DATA ---------------------- */

  const processedData = CleaningData.map((d) => ({
    date: new Date(d.cleaning.startAt).toISOString().slice(0, 10),
    robot_no: d.robot_no, // add this

    cleaning_minutes: Math.round(d.cleaning.total_cleaning_time / 60),

    battery_start: d.cleaning.battery_before_cleaning,
    battery_end: d.cleaning.battery_after_cleaning,

    brush_current: d.cleaning.cycle_average_brush_current,
    wheel_current: d.cleaning.cycle_average_wheel_current,

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

  const avgCleaningTime =
    filteredData.length > 0
      ? filteredData.reduce((a, b) => a + b.cleaning_minutes, 0) /
        filteredData.length
      : 0;

  const avgCycles =
    filteredData.length > 0
      ? filteredData.reduce((a, b) => a + b.cycles, 0) / filteredData.length
      : 0;

  return (
    <>
      {/* FILTER */}

      <CCard className="mb-4">
        <CCardHeader>Filters</CCardHeader>
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

                {searchTerm && filteredRobots.length > 0 && (
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
                      <div className="p-2 text-center">No robots found</div>
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
            <CCol md={3}>
              <CCard className="text-center">
                <CCardBody>
                  <h6>Average Cleaning Time</h6>
                  <h4>{avgCleaningTime.toFixed(1)} min</h4>
                </CCardBody>
              </CCard>
            </CCol>

            <CCol md={2}>
              <CCard className="text-center">
                <CCardBody>
                  <h6>Total Cycles</h6>
                  <h4>{avgCycles.toFixed(0)}</h4>
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
            <CCardBody style={{ height: 300 }}>
              <CChartLine
                data={{
                  labels: filteredData.map((d) => d.date),
                  datasets: [
                    {
                      label: "Cleaning Time (minutes)",
                      borderColor: "#27AE60",
                      backgroundColor: "#27AE60",
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
            <CCardHeader>Motor Current</CCardHeader>

            <CCardBody>
              <CChartBar
                style={{ height: 320 }}
                data={{
                  labels: filteredData.map((d) => d.date),

                  datasets: [
                    {
                      label: "Brush Current (mA)",
                      backgroundColor: "#27AE60",
                      data: filteredData.map((d) => d.brush_current),
                      barThickness: 25,
                    },

                    {
                      label: "Wheel Current (mA)",
                      backgroundColor: "#4e73df",
                      data: filteredData.map((d) => d.wheel_current),
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
                        text: "Current (mA)",
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
  );
};

export default RobotAnalytics;
