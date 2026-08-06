import axios from "axios";
import React, { useEffect, useReducer, useRef } from "react";
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
} from "@coreui/react";
import { getStyle } from "@coreui/utils";
import { CChartLine } from "@coreui/react-chartjs";
import { useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Cog } from "lucide-react";
import logo from "./assets/brand/logofordarkbg.png";

const LoadingGears = () => (
  <div
    style={{
      height: "80vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 16,
    }}
  >
    <div style={{ position: "relative", width: 96, height: 80 }}>
      <Cog
        size={64}
        strokeWidth={1.75}
        color="#0d6efd"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          animation: "robot-data-gear-cw 1.4s linear infinite",
          transformOrigin: "center",
        }}
      />
      <Cog
        size={44}
        strokeWidth={1.75}
        color="#198754"
        style={{
          position: "absolute",
          right: 0,
          bottom: 0,
          animation: "robot-data-gear-ccw 1.4s linear infinite",
          transformOrigin: "center",
        }}
      />
    </div>
    <div className="text-muted small">Please wait...</div>
    <style>{`
      @keyframes robot-data-gear-cw {
        to { transform: rotate(360deg); }
      }
      @keyframes robot-data-gear-ccw {
        to { transform: rotate(-360deg); }
      }
    `}</style>
  </div>
);

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

const fmtDateTime = (value) => {
  if (!value) return "NA";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "NA";
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};

const fmtVal = (value, unit = "") =>
  value != null && value !== "" ? `${value}${unit}` : "NA";

const stripHtml = (html) =>
  (html || "")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();

const getCleaningStatus = (item) => {
  const c = item?.cleaning || {};
  if (c.finish) return { label: "Success", color: "success" };
  if (c.cleaning_cancelled) return { label: "Cancelled", color: "danger" };
  if (c.battery_dead) return { label: "Battery Dead", color: "danger" };
  if (c.start) return { label: "In Progress", color: "warning" };
  return { label: "Not Started", color: "secondary" };
};

const RobotData = () => {
  const [{ loadingRobot, robot }, dispatch] = useReducer(reducer, {
    robot: {},
    loadingRobot: true,
    error: "",
  });
  const { robot_no } = useParams();
  const chartRef = useRef(null);

  useEffect(() => {
    document.documentElement.addEventListener("ColorSchemeChange", () => {
      if (chartRef.current) {
        setTimeout(() => {
          chartRef.current.options.scales.x.grid.borderColor = getStyle(
            "--cui-border-color-translucent",
          );
          chartRef.current.options.scales.x.grid.color = getStyle(
            "--cui-border-color-translucent",
          );
          chartRef.current.options.scales.x.ticks.color =
            getStyle("--cui-body-color");
          chartRef.current.options.scales.y.grid.borderColor = getStyle(
            "--cui-border-color-translucent",
          );
          chartRef.current.options.scales.y.grid.color = getStyle(
            "--cui-border-color-translucent",
          );
          chartRef.current.options.scales.y.ticks.color =
            getStyle("--cui-body-color");
          chartRef.current.update();
        });
      }
    });

    const fetchAllSites = async () => {
      dispatch({ type: "FETCH_ROBOT_REQUEST" });
      try {
        const result = await axios.get(
          `/api/v1/robots/get-robot-data/${robot_no}`,
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
          payload: error.response?.data?.message || error.response?.data?.error,
        });
        toast.error(
          error.response?.data?.message || error.response?.data?.error,
        );
      }
    };
    fetchAllSites();
  }, [robot_no]);

  const debugData = robot?.data?.debugdata || [];

  const chartLabels = debugData.map((entry) =>
    new Date(entry.createdAt).toLocaleTimeString("en-IN", {
      hour: "numeric",
      hour12: true,
    }),
  );

  const chartValues = debugData.map((entry) =>
    entry.data != null ? Number(entry.data) : 0,
  );

  const robotData = robot?.data?.robotdata || {};
  const cleaningData = robot?.data?.cleaningdata || [];
  const lastUpdate = robotData.last_uplink
    ? formatDistanceToNow(new Date(robotData.last_uplink), {
        addSuffix: true,
      })
    : "NA";

  const online = (
    <>
      <CBadge color="success">Online </CBadge>&nbsp;(&nbsp;{lastUpdate}&nbsp;)
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
        <LoadingGears />
      ) : (
        <div className="m-1">
          <div className="d-flex justify-content-center align-items-center ">
            <img
              src={logo}
              alt="Logo"
              className=""
              style={{ height: "50px" }}
            />
          </div>

          {/* Robot Basic Info */}
          <CCol xs={12} md={5}>
            <CCard className="rounded-0  shadow-sm m-1">
              <CCardHeader className="bg-primary text-white text-center">
                Robot Information
              </CCardHeader>
              <CTable bordered responsive hover className="mb-0 text-center">
                <CTableBody>
                  <CTableRow>
                    <CTableHeaderCell className="fw-semibold text-start">
                      Robot No
                    </CTableHeaderCell>
                    <CTableDataCell>{robot_no}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell className="fw-semibold text-start">
                      Status
                    </CTableHeaderCell>
                    <CTableDataCell>
                      {robotData.lora_state === 1 ? online : offline}
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell className="fw-semibold text-start">
                      Manufactured Date
                    </CTableHeaderCell>
                    <CTableDataCell>
                      {robotData.manufactured_date
                        ? new Date(
                            robotData.manufactured_date,
                          ).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                        : "NA"}
                    </CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
            </CCard>
          </CCol>

          {/* Cleaning Data */}
          <CCol xs={12} md={7}>
            <CCard className="rounded-0  shadow-lg m-1 border-0">
              <CCardHeader className="bg-primary text-white">
                Today&apos;s Cleaning Summary
              </CCardHeader>
              <CTable
                bordered
                responsive
                hover
                className="my-1 text-center bg-important"
              >
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell style={{ minWidth: "50px" }}>
                      Sr
                    </CTableHeaderCell>
                    <CTableHeaderCell style={{ minWidth: "140px" }}>
                      Status
                    </CTableHeaderCell>
                    <CTableHeaderCell style={{ minWidth: "100px" }}>
                      Block
                    </CTableHeaderCell>
                    <CTableHeaderCell style={{ minWidth: "160px" }}>
                      Start Time
                    </CTableHeaderCell>
                    <CTableHeaderCell style={{ minWidth: "100px" }}>
                      Start Battery
                    </CTableHeaderCell>
                    <CTableHeaderCell style={{ minWidth: "160px" }}>
                      End / Stop Time
                    </CTableHeaderCell>
                    <CTableHeaderCell style={{ minWidth: "100px" }}>
                      Finish Battery
                    </CTableHeaderCell>
                    <CTableHeaderCell style={{ minWidth: "100px" }}>
                      Total Time
                    </CTableHeaderCell>
                    <CTableHeaderCell style={{ minWidth: "180px" }}>
                      Comments
                    </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {cleaningData?.length > 0 ? (
                    cleaningData.map((item, index) => {
                      const c = item.cleaning || {};
                      const status = getCleaningStatus(item);
                      const endAt = c.finish
                        ? c.finishAt
                        : c.cleaning_cancelled
                          ? c.cleaning_cancelled_at
                          : c.battery_dead
                            ? c.battery_dead_at
                            : null;

                      return (
                        <CTableRow key={item._id || index}>
                          <CTableDataCell>{index + 1}</CTableDataCell>
                          <CTableDataCell>
                            <CBadge color={status.color}>{status.label}</CBadge>
                          </CTableDataCell>
                          <CTableDataCell>{item.block || "NA"}</CTableDataCell>
                          <CTableDataCell style={{ textAlign: "left" }}>
                            {c.start ? fmtDateTime(c.startAt) : "NA"}
                          </CTableDataCell>
                          <CTableDataCell>
                            {fmtVal(c.battery_before_cleaning)}
                          </CTableDataCell>
                          <CTableDataCell>{fmtDateTime(endAt)}</CTableDataCell>
                          <CTableDataCell>
                            {fmtVal(c.battery_after_cleaning)}
                          </CTableDataCell>
                          <CTableDataCell>
                            {fmtVal(c.total_cleaning_time)}
                          </CTableDataCell>
                          <CTableDataCell
                            className="text-start"
                            style={{ maxWidth: 220 }}
                          >
                            {stripHtml(item.comments) || "—"}
                          </CTableDataCell>
                        </CTableRow>
                      );
                    })
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan={9} className="text-start">
                        No cleaning data available for today.
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </CCard>
          </CCol>

          <CCard className="rounded-0 m-1 ">
            <CCardHeader className="bg-primary text-white">
              Todays Battery Status
            </CCardHeader>
            <CCardBody>
              <CChartLine
                ref={chartRef}
                style={{ height: "100%" }}
                className="p-0"
                data={{
                  labels: chartLabels,
                  datasets: [
                    {
                      label: "Battery Level",
                      backgroundColor: "rgba(40, 167, 69, 0.1)",
                      borderColor: "#28a745",
                      pointHoverBackgroundColor: "#28a745",
                      borderWidth: 2,
                      data: chartValues,
                      tension: 0.1,
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
                        display: true,
                        maxRotation: 45,
                        minRotation: 0,
                        autoSkip: true,
                        maxTicksLimit: 12,
                      },
                    },
                    y: {
                      ticks: {
                        beginAtZero: true,
                      },
                      step: 10,
                    },
                  },
                }}
              />
            </CCardBody>
          </CCard>

          <div className="text-center text-muted small  mt-1">
            All rights reserved <span className="text-success">@Taypro</span>
          </div>
        </div>
      )}
    </>
  );
};

export default RobotData;
