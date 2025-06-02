import React, { useEffect, useReducer, useState } from "react";
import { useSelector } from "react-redux";
import {
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
  CCol,
  CAlert,
  CCard,
  CCardBody,
  CCardHeader,
} from "@coreui/react";
import { CChartLine } from "@coreui/react-chartjs";
import axios from "axios";
import toast from "react-hot-toast";
import LoadingSpinner from "../../../components/LoadingSpinner";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        robotData: action.payload,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "FETCH_ROBOT_REQUEST":
      return { ...state, loadingRobots: true, errorRobot: "" };
    case "FETCH_ROBOT_SUCCESS":
      return {
        ...state,
        robots: action.payload.data,
        totalPages: action.payload.totalPages, // Use API-provided totalPages
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
        loadingRobots: false,
      };
    case "FETCH_ROBOT_FAIL":
      return { ...state, loadingRobots: false, errorRobot: action.payload };
    default:
      return state;
  }
};

const BatteryAndTemperature = () => {
  const [{ loading, robotData, error, robots }, dispatch] = useReducer(
    reducer,
    {
      robotData: null,
      loading: false,
      error: "",
      robots: [],
      loadingRobots: true,
      errorRobot: "",
    }
  );

  const authtoken = useSelector((state) => state.authtoken);
  const [robot_no, setRobotNo] = useState("");
  const [filteredRobot, setFilteredRobot] = useState([]);
  const [date, setDate] = useState("");

  useEffect(() => {
    const fetchRobots = async () => {
      try {
        dispatch({ type: "FETCH_ROBOT_REQUEST" });

        const result = await axios.get(`/api/v1/robots/get-robots-no`, {
          headers: { Authorization: `Bearer ${authtoken}` },
        });

        dispatch({
          type: "FETCH_ROBOT_SUCCESS",
          payload: result.data,
        });
      } catch (error) {
        dispatch({
          type: "FETCH_ROBOT_FAIL",
          payload: error.response?.data?.error || error.response?.data?.message,
        });
        toast.error(
          error.response?.data?.error || error.response?.data?.message
        );
      }
    };

    fetchRobots();
  }, [authtoken]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setRobotNo(value);
    if (value.length > 0) {
      const filtered = robots.filter((robot) =>
        robot.robot_no.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredRobot(filtered);
    } else {
      setFilteredRobot([]);
    }
  };

  const handleSelectRobot = (robot_no) => {
    setRobotNo(robot_no);
    setFilteredRobot([]);
  };

  const handleSearch = async () => {
    dispatch({ type: "FETCH_REQUEST" });
    try {
      const response = await axios.post(
        `/api/v1/debuglogs/get-robotdetails-datewise`,
        { robot_no, date },
        {
          headers: { Authorization: `Bearer ${authtoken}` },
        }
      );
      const [robotEntry] = response.data.data;
      dispatch({ type: "FETCH_SUCCESS", payload: robotEntry || null });
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

  const batteryChartData =
    robotData?.battery.map((entry) => ({
      time: new Date(entry.createdAt).toLocaleTimeString(),
      value: parseInt(entry.battery_percentage),
    })) || [];

  const temperatureChartData =
    robotData?.temperature.map((entry) => ({
      time: new Date(entry.createdAt).toLocaleTimeString(),
      value: parseInt(entry.temperature),
    })) || [];

  return (
    <div className="p-3">
      <h4 className="mb-4">Battery and Temperature Logs</h4>

      <CForm
        className="mb-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
      >
        <CRow className="g-3 align-items-end">
          <CCol md={4} style={{ position: "relative" }}>
            <CFormLabel htmlFor="robotInput">Robot No</CFormLabel>
            <CFormInput
              type="text"
              placeholder="Search by Robot No..."
              value={robot_no}
              className="form-control"
              onChange={handleSearchChange}
            />
            {robot_no && filteredRobot.length > 0 && (
              <ul
                className="position-absolute bg-white shadow-sm w-100 mt-1 px-2 py-2 rounded"
                style={{ maxHeight: "200px", overflowY: "auto", zIndex: 1000 }}
              >
                {filteredRobot.map((robot, index) => (
                  <li
                    key={index}
                    className="py-1 px-2 border-bottom hover:bg-light"
                    style={{ cursor: "pointer", listStyle: "none" }}
                    onClick={() => handleSelectRobot(robot.robot_no)}
                  >
                    {robot.robot_no}
                  </li>
                ))}
              </ul>
            )}
          </CCol>

          <CCol md={4}>
            <CFormLabel htmlFor="dateInput">Date</CFormLabel>
            <CFormInput
              id="dateInput"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </CCol>

          <CCol md={2}>
            <button type="submit" className="btn btn-primary w-100">
              Search
            </button>
          </CCol>
        </CRow>
      </CForm>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <CAlert color="danger">Error: {error}</CAlert>
      ) : robot_no && !robotData ? (
        <CAlert color="warning">
          No logs found for the given robot and date.
        </CAlert>
      ) : robotData ? (
        <CCard>
          <CCardHeader>
            Robot: {robotData.robot_no} | Date: {robotData.date}
          </CCardHeader>
          <CCardBody>
            {robotData?.battery.length === 0 ? (
              <CAlert color="warning">No battery logs found.</CAlert>
            ) : (
              <CChartLine
                data={{
                  labels: batteryChartData.map((entry) => entry.time),
                  datasets: [
                    {
                      label: "Battery (%)",
                      data: batteryChartData.map((entry) => entry.value),
                      borderColor: "rgb(255, 99, 132)",
                      tension: 0.4,
                    },
                  ],
                }}
              />
            )}
            <br />
            {robotData?.temperature.length === 0 ? (
              <CAlert color="warning">No Temperature logs found.</CAlert>
            ) : (
              <CChartLine
                data={{
                  labels: temperatureChartData.map((entry) => entry.time),
                  datasets: [
                    {
                      label: "Temperature (°C)",
                      data: temperatureChartData.map((entry) => entry.value),
                      borderColor: "rgb(75, 192, 192)",
                      tension: 0.4,
                    },
                  ],
                }}
              />
            )}
          </CCardBody>
        </CCard>
      ) : null}
    </div>
  );
};

export default BatteryAndTemperature;
