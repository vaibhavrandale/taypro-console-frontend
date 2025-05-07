import React, { useEffect, useReducer, useState } from "react";
import { useSelector } from "react-redux";
import {
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
  CCol,
  CSpinner,
  CAlert,
  CCard,
  CCardBody,
  CCardHeader,
} from "@coreui/react";
import { CChartLine } from "@coreui/react-chartjs";
import axios from "axios";

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
    default:
      return state;
  }
};

const BatteryAndTemperature = () => {
  const [{ loading, robotData, error }, dispatch] = useReducer(reducer, {
    robotData: null,
    loading: false,
    error: "",
  });

  const authtoken = useSelector((state) => state.authtoken);
  const [robot_no, setRobot_no] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    if (!robot_no || !date) {
      dispatch({ type: "FETCH_SUCCESS", payload: null });
      return;
    }

    const fetchDebugData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const response = await axios.post(
          `/api/v1/debuglogs/get-robotdetails-datewise`,
          { robot_no, date },
          {
            headers: {
              Authorization: `Bearer ${authtoken}`,
            },
          }
        );
        const [robotEntry] = response.data.data; // assumes only one robot returned
        dispatch({ type: "FETCH_SUCCESS", payload: robotEntry });
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

    fetchDebugData();
  }, [authtoken, robot_no, date]);

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

      <CForm className="mb-4">
        <CRow className="g-3">
          <CCol md={3}>
            <CFormLabel htmlFor="robotInput">Robot No</CFormLabel>
            <CFormInput
              id="robotInput"
              type="text"
              placeholder="Enter robot number"
              value={robot_no}
              onChange={(e) => setRobot_no(e.target.value)}
            />
          </CCol>
          <CCol md={3}>
            <CFormLabel htmlFor="dateInput">Date</CFormLabel>
            <CFormInput
              id="dateInput"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </CCol>
        </CRow>
      </CForm>

      {loading ? (
        <CSpinner color="primary" />
      ) : error ? (
        <CAlert color="danger">Error: {error}</CAlert>
      ) : !robotData ? (
        <CAlert color="warning">No logs found for the given filters.</CAlert>
      ) : (
        <CCard>
          <CCardHeader>
            Robot: {robotData.robot_no} | Date: {robotData.date}
          </CCardHeader>
          <CCardBody>
            {robotData?.battery.length === 0 ? (
              <CAlert color="warning">
                No battery logs found for the given filters.
              </CAlert>
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
            )}{" "}
            <br />
            {robotData?.battery.length === 0 ? (
              <CAlert color="warning">
                No Temperature logs found for the given filters.
              </CAlert>
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
      )}
    </div>
  );
};

export default BatteryAndTemperature;
