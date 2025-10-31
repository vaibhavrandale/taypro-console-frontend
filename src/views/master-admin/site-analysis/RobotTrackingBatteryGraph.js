import React, { useEffect, useReducer, useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CFormSelect,
  CFormInput,
  CButton,
  CAlert,
} from "@coreui/react";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import moment from "moment";
import LoadingSpinner from "../../../components/LoadingSpinner";
import DynamicChart from "../../../components/DynamicChart";
import { useParams } from "react-router-dom";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_ROBOTS_REQUEST":
      return { ...state, loadingRobots: true, robotsError: "" };
    case "FETCH_ROBOTS_SUCCESS":
      return { ...state, loadingRobots: false, robots: action.payload };
    case "FETCH_ROBOTS_FAIL":
      return { ...state, loadingRobots: false, robotsError: action.payload };

    case "FETCH_STATS_REQUEST":
      return { ...state, loadingStats: true, statsError: "" };
    case "FETCH_STATS_SUCCESS":
      return { ...state, loadingStats: false, statsData: action.payload };
    case "FETCH_STATS_FAIL":
      return { ...state, loadingStats: false, statsError: action.payload };

    case "SET_FILTERS":
      return { ...state, filters: { ...state.filters, ...action.payload } };

    case "RESET_STATS":
      return { ...state, statsData: [], statsError: "" };

    default:
      return state;
  }
};

const RobotTrackingBatteryGraph = () => {
  const [
    { loadingRobots, loadingStats, robots, statsData, statsError, filters },
    dispatch,
  ] = useReducer(reducer, {
    loadingRobots: true,
    loadingStats: false,
    robots: [],
    statsData: [],
    statsError: "",
    filters: {
      robot_no: "",
      date: moment().format("YYYY-MM-DD"),
      month: "",
    },
  });

  const authtoken = useSelector((state) => state.authtoken);
  const { site_id } = useParams();

  const fetchRobots = async () => {
    dispatch({ type: "FETCH_ROBOTS_REQUEST" });
    try {
      const result = await axios.get(
        `/api/v1/robots/get-all-robots-sitewise/${site_id}`,
        { headers: { Authorization: `Bearer ${authtoken}` } }
      );
      dispatch({ type: "FETCH_ROBOTS_SUCCESS", payload: result.data.data });
    } catch (error) {
      dispatch({
        type: "FETCH_ROBOTS_FAIL",
        payload: error.response?.data?.error || error.response?.data?.message,
      });
      toast.error(error.response?.data?.error || error.response?.data?.message);
    }
  };

  const fetchBatteryStats = async () => {
    if (!filters.date && !filters.month) {
      toast.error("Please select either a date or month");
      return;
    }

    dispatch({ type: "FETCH_STATS_REQUEST" });

    try {
      const payload = {
        robot_no: filters.robot_no,
        ...(filters.date && { date: filters.date }),
        ...(filters.month && { month: filters.month }),
      };

      const result = await axios.post(
        "/api/v1/robot-tracking/avg-battery",
        payload, // <-- this is the body
        {
          headers: { Authorization: `Bearer ${authtoken}` },
        }
      );

      dispatch({ type: "FETCH_STATS_SUCCESS", payload: result.data.data });
    } catch (error) {
      dispatch({
        type: "FETCH_ROBOTS_FAIL",
        payload: error.response?.data?.error || error.response?.data?.message,
      });
      toast.error(error.response?.data?.error || error.response?.data?.message);
    }
  };

  const handleFilterChange = (field, value) => {
    dispatch({
      type: "SET_FILTERS",
      payload: {
        [field]: value,
        ...(field === "date" && { month: "" }),
        ...(field === "month" && { date: "" }),
      },
    });
  };

  const handleSearch = () => {
    dispatch({ type: "RESET_STATS" });
    fetchBatteryStats();
  };

  // Prepare chart data
  const prepareChartData = () => {
    if (!statsData || statsData.length === 0)
      return { labels: [], datasets: [] };

    // const labels = statsData.map((item) => item.robot_no || "Robot");
    const labels = statsData.map((item) => item.date || "Date");

    const startValues = statsData.map((item) => item.battey_at_start);
    const reverseValues = statsData.map(
      (item) => item.battery_at_revesere_station
    );
    const finishValues = statsData.map((item) => item.battery_at_finish);
    const avgValues = statsData.map((item) => item.avg_battery);

    return { labels, startValues, reverseValues, finishValues, avgValues };
  };

  const { labels, startValues, reverseValues, finishValues, avgValues } =
    prepareChartData();

  useEffect(() => {
    fetchRobots();
  }, [authtoken, site_id]);

  return (
    <div className="container-fluid">
      <h3 className="mb-4">Robot Battery Analysis</h3>

      <CCard className="mb-4">
        <CCardHeader></CCardHeader>
        <CCardBody>
          <CRow className="g-3">
            <CCol md={3}>
              <label className="form-label">Robot</label>
              <CFormSelect
                value={filters.robot_no}
                onChange={(e) => handleFilterChange("robot_no", e.target.value)}
                disabled={loadingRobots}
              >
                <option value="">All Robots</option>
                {robots.map((robot) => (
                  <option key={robot._id} value={robot.robot_no}>
                    {robot.robot_no}
                  </option>
                ))}
              </CFormSelect>
            </CCol>

            <CCol md={3}>
              <label className="form-label">Date</label>
              <CFormInput
                type="date"
                value={filters.date}
                onChange={(e) => handleFilterChange("date", e.target.value)}
                max={moment().format("YYYY-MM-DD")}
              />
            </CCol>

            <CCol md={3}>
              <label className="form-label">Month</label>
              <CFormInput
                type="month"
                value={filters.month}
                onChange={(e) => handleFilterChange("month", e.target.value)}
                max={moment().format("YYYY-MM")}
              />
            </CCol>

            <CCol md={3} className="d-flex align-items-end">
              <CButton color="primary" size="sm" onClick={handleSearch}>
                {loadingStats ? <LoadingSpinner size="sm" /> : "Search"}
              </CButton>
              <CButton
                color="secondary"
                size="sm"
                className="ms-2"
                onClick={() => {
                  dispatch({
                    type: "SET_FILTERS",
                    payload: {
                      robot_no: "",
                      date: moment().format("YYYY-MM-DD"),
                      month: "",
                    },
                  });
                  dispatch({ type: "RESET_STATS" });
                }}
              >
                Reset
              </CButton>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {statsError && (
        <CAlert color="danger" className="mb-4">
          {statsError}
        </CAlert>
      )}

      {loadingStats ? (
        <div className="d-flex justify-content-center align-items-center h-50">
          <LoadingSpinner />
        </div>
      ) : statsData.length > 0 ? (
        <CRow>
          <CCol lg={12}>
            <DynamicChart
              title="Battery Status"
              labels={labels}
              datasets={[
                {
                  label: "Average Battery (%)",
                  data: avgValues,
                  borderColor: "rgba(54, 162, 235, 1)",
                  backgroundColor: "rgba(54, 162, 235, 0.2)",
                  batteryStart: startValues,
                  batteryReverse: reverseValues,
                  batteryFinish: finishValues,
                },
              ]}
              options={{
                interaction: {
                  mode: "index", // ensures tooltip shows values per index
                  intersect: false,
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                    title: { display: true, text: "Battery (%)" },
                  },
                },
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: function (tooltipItem) {
                        const dataset = tooltipItem.dataset;
                        const index = tooltipItem.dataIndex;

                        return [
                          `Average: ${dataset.data[index]}%`,
                          `Start: ${dataset.batteryStart[index]}%`,
                          `Reverse Station: ${dataset.batteryReverse[index]}%`,
                          `Finish: ${dataset.batteryFinish[index]}%`,
                        ];
                      },
                    },
                  },
                },
              }}
            />
          </CCol>
        </CRow>
      ) : (
        !loadingStats &&
        !statsError && (
          <CCard>
            <CCardBody className="text-center py-5">
              <div className="text-muted">
                <h5>No battery data available</h5>
                <p>
                  Select filters and click Search to view battery statistics
                </p>
              </div>
            </CCardBody>
          </CCard>
        )
      )}
    </div>
  );
};

export default RobotTrackingBatteryGraph;
