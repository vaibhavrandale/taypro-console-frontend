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
      return {
        ...state,
        loadingRobots: false,
        robots: action.payload,
      };
    case "FETCH_ROBOTS_FAIL":
      return { ...state, loadingRobots: false, robotsError: action.payload };

    case "FETCH_STATS_REQUEST":
      return { ...state, loadingStats: true, statsError: "" };
    case "FETCH_STATS_SUCCESS":
      return {
        ...state,
        loadingStats: false,
        statsData: action.payload,
      };
    case "FETCH_STATS_FAIL":
      return { ...state, loadingStats: false, statsError: action.payload };

    case "SET_FILTERS":
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };

    case "RESET_STATS":
      return {
        ...state,
        statsData: [],
        statsError: "",
      };

    default:
      return state;
  }
};

const RssiSnrGraph = () => {
  const [
    {
      loadingRobots,
      loadingStats,
      robots,
      robotsError,
      statsData,
      statsError,
      filters,
    },
    dispatch,
  ] = useReducer(reducer, {
    loadingRobots: true,
    loadingStats: false,
    robots: [],
    robotsError: "",
    statsData: [],
    statsError: "",
    filters: {
      robot_no: "",
      topic: "Cleaning Log",
      date: moment().format("YYYY-MM-DD"),
      month: "",
    },
  });

  // const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);
  const [availableTopics, setAvailableTopics] = useState([
    "Cleaning Log",
    "Battery Status",
    "Position Update",
    "Tracking Log",
  ]);

  const { site_id } = useParams();
  const fetchRobots = async () => {
    dispatch({ type: "FETCH_ROBOTS_REQUEST" });
    try {
      const result = await axios.get(
        `/api/v1/robots/get-all-robots-sitewise/${site_id}`,
        {
          headers: {
            Authorization: `Bearer ${authtoken}`,
          },
        },
      );

      // const robotsList = result?.data?.data?.data || [];
      dispatch({
        type: "FETCH_ROBOTS_SUCCESS",
        payload: result.data.data,
      });
    } catch (error) {
      dispatch({
        type: "FETCH_ROBOTS_FAIL",
        payload: error.response?.data?.error || error.response?.data?.message,
      });
      toast.error(error.response?.data?.error || error.response?.data?.message);
    }
  };

  // Fetch signal statistics
  const fetchSignalStats = async () => {
    if (!filters.topic) {
      toast.error("Please select a topic");
      return;
    }

    if (!filters.date && !filters.month) {
      toast.error("Please select either a date or month");
      return;
    }

    dispatch({ type: "FETCH_STATS_REQUEST" });
    try {
      const payload = {
        robot_no: filters.robot_no,
        topic: filters.topic,
        ...(filters.date && { date: filters.date }),
        ...(filters.month && { month: filters.month }),
      };

      const result = await axios.post(
        `/api/v1/rawcleaninglogs/daily-signal-stats`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${authtoken}`,
          },
        },
      );

      dispatch({
        type: "FETCH_STATS_SUCCESS",
        payload: result.data.data,
      });
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
    fetchSignalStats();
  };

  // Prepare chart data
  const prepareChartData = () => {
    if (!statsData || statsData.length === 0) {
      return { labels: [], values: [] };
    }

    // For date query (individual records)
    if (filters.date) {
      const labels = statsData.map(
        (item, index) =>
          moment(item.date).format("HH:mm:ss") || `Record ${index + 1}`,
      );
      const rssiValues = statsData.map((item) => item.rssi);
      const snrValues = statsData.map((item) => item.snr);

      return { labels, rssiValues, snrValues };
    }

    // For month query (daily averages)
    if (filters.month) {
      const labels = statsData.map((item) =>
        moment(item.date).format("MMM DD"),
      );
      const rssiValues = statsData.map((item) => item.avg_rssi);
      const snrValues = statsData.map((item) => item.avg_snr);

      return { labels, rssiValues, snrValues };
    }

    return { labels: [], values: [] };
  };

  const { labels, rssiValues, snrValues } = prepareChartData();

  useEffect(() => {
    fetchRobots();
  }, [userInfo]);

  return (
    <div className="container-fluid">
      <h3 className="mb-4">Robot Signal Analysis</h3>

      {/* Filters Card */}
      <CCard className="mb-4">
        <CCardBody>
          <CRow className="g-3 align-items-end">
            <CCol md="auto">
              <label className="form-label">Robot</label>
              <CFormSelect
                className="w-auto"
                style={{ minWidth: "200px" }}
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
              {loadingRobots && <LoadingSpinner className="mt-2" />}
            </CCol>

            <CCol md="auto">
              <label className="form-label">Topic</label>
              <CFormSelect
                className="w-auto"
                style={{ minWidth: "120px" }}
                value={filters.topic}
                onChange={(e) => handleFilterChange("topic", e.target.value)}
              >
                {availableTopics.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </CFormSelect>
            </CCol>

            <CCol md="auto">
              <label className="form-label">Date</label>
              <CFormInput
                className="w-auto"
                style={{ minWidth: "120px" }}
                type="date"
                value={filters.date}
                onChange={(e) => handleFilterChange("date", e.target.value)}
                max={moment().format("YYYY-MM-DD")}
              />
            </CCol>

            <CCol md="auto">
              <label className="form-label">Month</label>
              <CFormInput
                className="w-auto"
                style={{ minWidth: "120px" }}
                type="month"
                value={filters.month}
                onChange={(e) => handleFilterChange("month", e.target.value)}
                max={moment().format("YYYY-MM")}
              />
            </CCol>

            <CCol md="auto" className="d-flex gap-2">
              <CButton
                color="primary"
                size="sm"
                onClick={handleSearch}
                disabled={loadingStats || !filters.topic}
              >
                {loadingStats ? <LoadingSpinner size="sm" /> : "Search"}
              </CButton>
              <CButton
                color="secondary"
                size="sm"
                onClick={() => {
                  dispatch({
                    type: "SET_FILTERS",
                    payload: {
                      robot_no: "",
                      topic: "Cleaning Log",
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

      {/* Error Display */}
      {statsError && (
        <CAlert color="danger" className="mb-4">
          {statsError}
        </CAlert>
      )}

      {/* Charts */}
      {loadingStats ? (
        <div className="d-flex justify-content-center align-items-center h-50">
          <LoadingSpinner />
        </div>
      ) : statsData.length > 0 ? (
        <CRow>
          <CCol lg={12} className="mb-4">
            {/* RSSI Chart */}
            <DynamicChart
              title="RSSI (Signal Strength)"
              labels={labels}
              datasets={[
                {
                  label: filters.month ? "Average RSSI (dBm)" : "RSSI (dBm)",

                  data: rssiValues,
                  borderColor: "rgba(255, 99, 132, 1)",
                  backgroundColor: "rgba(255, 99, 132, 0.2)",
                },
              ]}
              options={{
                scales: {
                  y: {
                    beginAtZero: true,
                    title: { display: true, text: "RSSI (dBm)" },
                  },
                  x: {
                    grid: {
                      drawTicks: true,
                    },
                  },
                },
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: (context) =>
                        `${context.dataset.label}: ${context.raw} dBm`,
                    },
                  },
                },
              }}
            />
          </CCol>

          <CCol lg={12}>
            {/* SNR Chart */}
            <DynamicChart
              title="SNR (Signal-to-Noise Ratio)"
              labels={labels}
              datasets={[
                {
                  label: filters.month ? "Average SNR (dB)" : "SNR (dB)",
                  data: snrValues,
                  borderColor: "rgba(54, 162, 235, 1)",
                  backgroundColor: "rgba(54, 162, 235, 0.2)",
                },
              ]}
              options={{
                scales: {
                  y: {
                    beginAtZero: true,

                    title: { display: true, text: "SNR (dB)" },
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
                <h5>No data available</h5>
                <p>Select filters and click Search to view signal statistics</p>
              </div>
            </CCardBody>
          </CCard>
        )
      )}
    </div>
  );
};

export default RssiSnrGraph;
