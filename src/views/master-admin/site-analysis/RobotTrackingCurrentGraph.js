import React, { useEffect, useReducer } from "react";
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

const RobotTrackingCurrentGraph = () => {
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

  // const authtoken = useSelector((state) => state.authtoken);
  const { site_id } = useParams();

  // Fetch all robots for the selected site
  const fetchRobots = async () => {
    dispatch({ type: "FETCH_ROBOTS_REQUEST" });
    try {
      const result = await axios.get(
        `/api/v1/robots/get-all-robots-sitewise/${site_id}`,
        { headers: { Authorization: `Bearer ${authtoken}` } },
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

  // Fetch current stats
  const fetchCurrentStats = async () => {
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
        "/api/v1/robot-tracking/avg-current",
        payload,
        {
          // headers: { Authorization: `Bearer ${authtoken}` },
          withCredentials: true,
        },
      );

      dispatch({ type: "FETCH_STATS_SUCCESS", payload: result.data.data });
    } catch (error) {
      dispatch({
        type: "FETCH_STATS_FAIL",
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
    fetchCurrentStats();
  };

  // Prepare chart data
  const prepareChartData = () => {
    if (!statsData || statsData.length === 0)
      return { labels: [], datasets: [] };

    // const labels = statsData.map((item) => item.robot_no || "Robot");
    const labels = statsData.map(
      (item) => `${item.date || "Date"} (${item.robot_no || "Robot"})`,
    );

    const avgBrushValues = statsData.map((item) => item.avg_brush_current);
    const avgWheelValues = statsData.map((item) => item.avg_wheel_current);
    const maxBrushValues = statsData.map((item) => item.max_brush_current);
    const maxWheelValues = statsData.map((item) => item.max_wheel_current);

    return {
      labels,
      avgBrushValues,
      avgWheelValues,
      maxBrushValues,
      maxWheelValues,
    };
  };

  const {
    labels,
    avgBrushValues,
    avgWheelValues,
    maxBrushValues,
    maxWheelValues,
  } = prepareChartData();

  useEffect(() => {
    fetchRobots();
  }, [site_id]);

  return (
    <div className="container-fluid">
      <h3 className="mb-4">Robot Current Analysis</h3>

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
              title="Current Statistics"
              labels={labels}
              datasets={[
                {
                  label: "Avg Brush Current ",
                  data: avgBrushValues,
                  borderColor: "rgba(54, 162, 235, 1)",
                  backgroundColor: "rgba(54, 162, 235, 0.2)",
                },
                {
                  label: "Avg Wheel Current",
                  data: avgWheelValues,
                  borderColor: "rgba(255, 206, 86, 1)",
                  backgroundColor: "rgba(255, 206, 86, 0.2)",
                },
                {
                  label: "Max Brush Current",
                  data: maxBrushValues,
                  borderColor: "rgba(75, 192, 192, 1)",
                  backgroundColor: "rgba(75, 192, 192, 0.2)",
                },
                {
                  label: "Max Wheel Current ",
                  data: maxWheelValues,
                  borderColor: "rgba(255, 99, 132, 1)",
                  backgroundColor: "rgba(255, 99, 132, 0.2)",
                },
              ]}
              options={{
                interaction: {
                  mode: "index",
                  intersect: false,
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: { display: true, text: "Current (mA)" },
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
                <h5>No current data available</h5>
                <p>
                  Select filters and click Search to view current statistics.
                </p>
              </div>
            </CCardBody>
          </CCard>
        )
      )}
    </div>
  );
};

export default RobotTrackingCurrentGraph;
