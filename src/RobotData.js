import axios from "axios";
import React, { useEffect, useReducer } from "react";
import toast from "react-hot-toast";
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CWidgetStatsB,
} from "@coreui/react";
import { CChartLine } from "@coreui/react-chartjs";
import { useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import LoadingSpinner from "./components/LoadingSpinner";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_ROBOT_REQUEST":
      return { ...state, loadingRobot: true, error: "" };
    case "FETCH_ROBOT_SUCCESS":
      return {
        ...state,
        loadingRobot: false,
        robot: action.payload,
      };
    case "FETCH_ROBOT_FAIL":
      return { ...state, loadingRobot: false, error: action.payload };
    default:
      return state;
  }
};

const RobotData = () => {
  const [{ loadingRobot, robot }, dispatch] = useReducer(reducer, {
    robot: {},
    loadingRobot: true,
    error: "",
  });
  const { robot_no } = useParams();
  useEffect(() => {
    const fetchAllSites = async () => {
      dispatch({ type: "FETCH_ROBOT_REQUEST" });
      try {
        const result = await axios.get(
          `/api/v1/robots/get-robot-data/${robot_no}`
        );

        dispatch({
          type: "FETCH_ROBOT_SUCCESS",
          payload: {
            data: result.data,
          },
        });
      } catch (error) {
        dispatch({
          type: "FETCH_ROBOT_FAIL",
          payload: error.response.data.message || error.response.data.error,
        });
        toast.error(error.response.data.message || error.response.data.error);
      }
    };
    fetchAllSites();
  }, [robot_no]);

  const debugData = robot?.data?.debugdata || [];

  const chartLabels = debugData.map((entry) =>
    new Date(entry.createdAt).toLocaleTimeString()
  );

  const chartValues = debugData.map((entry) => entry.data || 0); // adjust `entry.value` as per your schema

  const robotData = robot?.data?.robotdata || {};
  const cleaningData = robot?.data?.cleaningdata || [];
  const lastUpdate = robotData.last_uplink
    ? formatDistanceToNow(new Date(robotData.last_uplink), {
        addSuffix: true,
      })
    : "NA";

  const online = (
    <>
      <CBadge color="success">Online </CBadge>&nbsp;({lastUpdate})
    </>
  );
  const offline = (
    <>
      <CBadge color="danger">Offline </CBadge>&nbsp;({lastUpdate})
    </>
  );

  return (
    <>
      {loadingRobot ? (
        <div
          style={{ height: "80vh" }}
          className="d-flex justify-content-center align-items-center"
        >
          Please wait....
          <LoadingSpinner />
        </div>
      ) : (
        <div className="m-2">
          <CRow className="">
            {/* Robot Basic Info */}
            <CCol xs={12} md={5}>
              <CCard className="rounded-2 shadow-sm my-2">
                <CCardHeader className="bg-primary text-white fw-bold">
                  Robot Information
                </CCardHeader>
                <CCardBody>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="fw-semibold">Robot No:</span>
                    <span>{robot_no}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="fw-semibold">Status:</span>
                    <span>{robotData.lora_state === 1 ? online : offline}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="fw-semibold">Manufactured Date:</span>
                    <span>{robotData.manufactured_date?.slice(0, 10)}</span>
                  </div>
                </CCardBody>
              </CCard>
            </CCol>

            {/* Cleaning Data */}
            <CCol xs={12} md={7}>
              <CCard className="rounded-2 shadow-sm my-2 border-0">
                <CCardHeader className="bg-primary text-white fw-bold">
                  Today's Cleaning Summary
                </CCardHeader>
                <CTable bordered responsive hover className="mb-0 text-center">
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell style={{ minWidth: "60px" }}>
                        Sr
                      </CTableHeaderCell>
                      <CTableHeaderCell style={{ minWidth: "160px" }}>
                        Start Time
                      </CTableHeaderCell>
                      <CTableHeaderCell style={{ minWidth: "120px" }}>
                        Start Battery
                      </CTableHeaderCell>
                      <CTableHeaderCell style={{ minWidth: "160px" }}>
                        Finish Time
                      </CTableHeaderCell>
                      <CTableHeaderCell style={{ minWidth: "120px" }}>
                        {" "}
                        Finish Battery
                      </CTableHeaderCell>
                      <CTableHeaderCell style={{ minWidth: "120px" }}>
                        Distance Travel
                      </CTableHeaderCell>
                      <CTableHeaderCell>Status</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {cleaningData?.length > 0 ? (
                      cleaningData.map((item, index) => (
                        <CTableRow key={index}>
                          <CTableDataCell>{index + 1}</CTableDataCell>
                          <CTableDataCell style={{ textAlign: "left" }}>
                            {item.start_timestamp
                              ? new Date(item.start_timestamp).toLocaleString()
                              : "NA"}
                          </CTableDataCell>
                          <CTableDataCell>
                            {item.start_battery_percentage || "NA"}
                          </CTableDataCell>
                          <CTableDataCell>
                            {item.finish_timestamp
                              ? new Date(item.finish_timestamp).toLocaleString()
                              : "NA"}
                          </CTableDataCell>
                          <CTableDataCell>
                            {item.finish_battery_percentage || "NA"}
                          </CTableDataCell>
                          <CTableDataCell>
                            {item.calculated_distance || "NA"}
                          </CTableDataCell>
                          <CTableDataCell>
                            {item.cleaning_status === "success" ? (
                              <CBadge color="success">Success</CBadge>
                            ) : (
                              <CBadge color="danger">Error</CBadge>
                            )}
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    ) : (
                      <CTableRow>
                        <CTableDataCell colSpan={6}>
                          No Data Available
                        </CTableDataCell>
                      </CTableRow>
                    )}
                  </CTableBody>
                </CTable>
              </CCard>
            </CCol>
          </CRow>
          <CCard className="m-2 ">
            <CCardHeader className="bg-primary text-white fw-bold">
              Todays Battery Status
            </CCardHeader>
            <CCardBody>
              <CChartLine
                style={{ maxHeight: "300px" }}
                className="p-0"
                data={{
                  labels: chartLabels,
                  datasets: [
                    {
                      label: "Battery Level",
                      // fill: true,
                      backgroundColor: "#052638",
                      borderColor: "#052638",
                      pointBackgroundColor: "#052638",
                      pointBorderColor: "#052638",
                      data: chartValues,
                      tension: 0.6,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: true,
                    },
                  },
                  scales: {
                    x: {
                      ticks: {
                        display: false, // ❌ Hides the X-axis labels
                      },
                      //   grid: {
                      //     display: false, // ❌ Hides the X-axis grid lines
                      //     drawTicks: false,
                      //   },
                    },
                    y: {
                      ticks: {
                        beginAtZero: true,
                      },
                    },
                  },
                }}
              />
            </CCardBody>
          </CCard>
        </div>
      )}
    </>
  );
};

export default RobotData;
