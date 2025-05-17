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
        // console.log(result.data);

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
  //   console.log(robot);

  const debugData = robot?.data?.debugdata || [];

  const chartLabels = debugData.map((entry) =>
    new Date(entry.createdAt).toLocaleTimeString()
  );

  const chartValues = debugData.map((entry) => entry.data || 0); // adjust `entry.value` as per your schema

  const robotData = robot?.data?.robotdata || {};
  const cleaningData = robot?.data?.cleaningdata || {};
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
        <p>Loading...</p>
      ) : (
        <div className="m-2">
          <CRow className="">
            {/* Robot Basic Info */}
            <CCol xs={12} md={6}>
              <CCard className="rounded-2 shadow-sm mb-2">
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
            <CCol xs={12} md={6}>
              <CCard className="rounded-2 shadow-sm mb-2 border-0">
                <CCardHeader className="bg-primary text-white fw-bold">
                  Today's Cleaning Summary
                </CCardHeader>
                <CTable
                  bordered
                  responsive
                  hover
                  className="mb-0 text-center"
                  //   style={{ maxWidth: "500px", margin: "auto" }}
                >
                  <CTableBody>
                    <CTableRow>
                      <CTableHeaderCell
                        style={{ minWidth: "160px", textAlign: "left" }}
                      >
                        Start Time
                      </CTableHeaderCell>
                      <CTableDataCell>
                        {cleaningData?.start_timestamp
                          ? new Date(
                              cleaningData.start_timestamp
                            ).toLocaleString()
                          : "NA"}
                      </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableHeaderCell style={{ textAlign: "left" }}>
                        Start Battery
                      </CTableHeaderCell>
                      <CTableDataCell>
                        {cleaningData?.start_battery_percentage || "NA"}
                      </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableHeaderCell style={{ textAlign: "left" }}>
                        Finish Time
                      </CTableHeaderCell>
                      <CTableDataCell>
                        {cleaningData?.finish_timestamp
                          ? new Date(
                              cleaningData.finish_timestamp
                            ).toLocaleString()
                          : "NA"}
                      </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableHeaderCell style={{ textAlign: "left" }}>
                        Finish Battery
                      </CTableHeaderCell>
                      <CTableDataCell>
                        {cleaningData?.finish_battery_percentage || "NA"}
                      </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableHeaderCell style={{ textAlign: "left" }}>
                        Distance Travel
                      </CTableHeaderCell>
                      <CTableDataCell>
                        {cleaningData?.calculated_distance || "NA"}
                      </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableHeaderCell style={{ textAlign: "left" }}>
                        Status
                      </CTableHeaderCell>
                      <CTableDataCell>
                        {cleaningData?.cleaning_status === "success" ? (
                          <CBadge color="success">Success</CBadge>
                        ) : (
                          <CBadge color="danger">Error</CBadge>
                        )}
                      </CTableDataCell>
                    </CTableRow>
                  </CTableBody>
                </CTable>
              </CCard>
            </CCol>
          </CRow>
          <CCard className="mb-3 ">
            <CCardHeader className="bg-primary text-white fw-bold">
              Todays Battery Status
            </CCardHeader>
            <CCardBody>
              <CChartLine
                style={{ maxHeight: "300px", width: "100%" }}
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
