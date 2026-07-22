// import React, { useState, useEffect, useReducer } from "react";
// import axios from "axios";
// import {
//   CRow,
//   CCol,
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CFormInput,
// } from "@coreui/react";
// import { useSelector } from "react-redux";
// import { CChartBar, CChartLine } from "@coreui/react-chartjs";
// import LoadingSpinner from "../../../components/LoadingSpinner";
// import SubscriptionExpiryCard from "../../../components/SubscriptionExpiryCard";
// import toast from "react-hot-toast";
// import { Link } from "react-router-dom";
// const reducer = (state, action) => {
//   switch (action.type) {
//     case "FETCH_CLEANING_REQUEST":
//       return { ...state, robotAnalyticsLoading: true, robotAnalyticsError: "" };

//     case "FETCH_CLEANING_SUCCESS":
//       return {
//         ...state,
//         robotAnalyticsLoading: false,
//         CleaningData: action.payload.data,
//         avg_cleaning_minutes: action.payload.avg_cleaning_minutes,
//         total_cycles: action.payload.total_cycles,
//         maxWheelCurrent: action.payload.maxWheelCurrent,
//         avgWheelCurrent: action.payload.avgWheelCurrent,
//         maxBrushCurrent: action.payload.maxBrushCurrent,
//         avgBrushCurrent: action.payload.avgBrushCurrent,
//       };

//     case "FETCH_FAIL":
//       return {
//         ...state,
//         robotAnalyticsLoading: false,
//         robotAnalyticsError: action.payload,
//         subscriptiondata: action.subscriptiondata,
//         subscriptionStatus: action.subscriptionStatus,
//       };
//     default:
//       return state;
//   }
// };

// const RobotAnalytics = () => {
//   const [
//     {
//       robotAnalyticsLoading,
//       robotAnalyticsError,
//       CleaningData,
//       total_cycles,
//       avg_cleaning_minutes,
//       maxWheelCurrent,
//       avgWheelCurrent,
//       maxBrushCurrent,
//       avgBrushCurrent,
//       subscriptiondata,
//       subscriptionStatus,
//     },
//     dispatch,
//   ] = useReducer(reducer, {
//     robotAnalyticsLoading: false,
//     robotAnalyticsError: "",
//     CleaningData: [],
//     avg_cleaning_minutes: 0,
//     total_cycles: 0,
//     maxWheelCurrent: 0,
//     avgWheelCurrent: 0,
//     maxBrushCurrent: 0,
//     avgBrushCurrent: 0,
//     subscriptiondata: {},
//     subscriptionStatus: "",
//   });

//   const today = new Date();
//   const last7 = new Date();
//   // const authtoken = useSelector((state) => state.authtoken);
//   const userInfo = useSelector((state) => state.userInfo);
//   last7.setDate(today.getDate() - 7);

//   const formatDate = (d) => d.toISOString().slice(0, 10);

//   const [startDate, setStartDate] = useState(formatDate(last7));
//   const [endDate, setEndDate] = useState(formatDate(today));

//   const [robots, setRobots] = useState([]);
//   const [filteredRobots, setFilteredRobots] = useState([]);
//   const [selectedRobot, setSelectedRobot] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

//   useEffect(() => {
//     const cachedRobots = JSON.parse(localStorage.getItem("robots")) || [];
//     setRobots(cachedRobots);
//   }, []);

//   useEffect(() => {
//     if (robots.length > 0 && !selectedRobot) {
//       setSelectedRobot(robots[0]?.robot_no);
//       setSearchTerm(robots[0]?.robot_no);
//     }
//   }, [robots, selectedRobot]);
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedSearch(searchTerm);
//     }, 400);

//     return () => clearTimeout(timer);
//   }, [searchTerm]);

//   useEffect(() => {
//     const fetchRobotAnalytics = async () => {
//       try {
//         if (!selectedRobot) return;
//         dispatch({ type: "FETCH_CLEANING_REQUEST" });

//         const result = await axios.post(
//           `/api/v1/robot-tracking/robot-cleaning-analytics`,
//           {
//             robot_no: selectedRobot,
//             startDate,
//             endDate,
//           },
//           {
//             // headers: { Authorization: `Bearer ${authtoken}` },
//             withCredentials: true,
//           },
//         );
//         const resData = result.data;

//         dispatch({
//           type: "FETCH_CLEANING_SUCCESS",
//           payload: {
//             data: resData.data, // ✅ correct
//             avg_cleaning_minutes: resData.avg_cleaning_minutes,
//             total_cycles: resData.total_cycles,
//             maxWheelCurrent: resData.maxWheelCurrent,
//             avgWheelCurrent: resData.avgWheelCurrent,
//             maxBrushCurrent: resData.maxBrushCurrent,
//             avgBrushCurrent: resData.avgBrushCurrent,
//           },
//         });
//       } catch (error) {
//         dispatch({
//           type: "FETCH_FAIL",
//           payload: error.response?.data?.error || error.response?.data?.message,
//           subscriptiondata: error.response?.data?.data,
//           subscriptionStatus: error.response?.data?.subscriptionStatus,
//         });
//         toast.error(
//           error.response?.data?.error || error.response?.data?.message,
//         );
//       }
//     };

//     fetchRobotAnalytics();
//   }, [startDate, endDate, , selectedRobot]);
//   useEffect(() => {
//     if (debouncedSearch && debouncedSearch.length > 0) {
//       const filtered =
//         robots &&
//         robots.filter((robot) =>
//           robot.robot_no?.toLowerCase().includes(debouncedSearch.toLowerCase()),
//         );

//       setFilteredRobots(filtered);
//     } else {
//       setFilteredRobots([]);
//     }
//   }, [debouncedSearch, robots]);

//   const handleRobotSearch = (e) => {
//     setSearchTerm(e.target.value);
//   };
//   /* ---------------------- PROCESS DATA ---------------------- */

//   const formatCurrent = (value) => {
//     if (!value && value !== 0) return "-";
//     return (value / 1000).toFixed(2);
//   };
//   const processedData = CleaningData.map((d) => ({
//     date: new Date(d.createdAt).toISOString().slice(0, 10),
//     robot_no: d.robot_no, // add this

//     cleaning_minutes: Math.round(d.cleaning.total_cleaning_time / 60),

//     battery_start: d.cleaning.battery_before_cleaning,
//     battery_end: d.cleaning.battery_after_cleaning,

//     max_brush_current: formatCurrent(d.cleaning.cycle_max_brush_current),
//     max_wheel_current: formatCurrent(d.cleaning.cycle_max_wheel_current),

//     average_brush_current: formatCurrent(
//       d.cleaning.cycle_average_brush_current,
//     ),
//     average_wheel_current: formatCurrent(
//       d.cleaning.cycle_average_wheel_current,
//     ),

//     cycles: d.cleaning.cycle_count,
//   }));

//   const filteredData = processedData.filter((d) => {
//     const rowDate = new Date(d.date);
//     const start = new Date(startDate);
//     const end = new Date(endDate);
//     const robotMatch =
//       !searchTerm ||
//       d.robot_no?.toLowerCase().includes(searchTerm?.toLowerCase());

//     return rowDate >= start && rowDate <= end && robotMatch;
//   });

//   /* ---------------------- KPI ---------------------- */

//   const avgCleaningTime = avg_cleaning_minutes && avg_cleaning_minutes;
//   const checkStatus = [
//     "subscriptionSitesAssigned",
//     "subscriptionFound",
//     "subscriptionaRenewStatus",
//     "subscriptionPaymentStatus",
//     "subscriptionPlanAccess",
//   ];

//   let adminroute = "";

//   if (userInfo?.role === "Master Admin") {
//     adminroute = "master-admin";
//   } else if (userInfo?.role === "Service Admin") {
//     adminroute = "service-admin";
//   } else if (userInfo?.role === "Project Admin") {
//     adminroute = "project-admin";
//   } else if (userInfo?.role === "Client Admin") {
//     adminroute = "client-admin";
//   } else if (userInfo?.role === "Site Incharge") {
//     adminroute = "site-incharge";
//   } else if (userInfo?.role === "Site Technician") {
//     adminroute = "site-technician";
//   } else if (userInfo?.role === "Client Site Technician") {
//     adminroute = "client-site-technician";
//   } else if (userInfo?.role === "Master User") {
//     adminroute = "master-user";
//   } else if (userInfo?.role === "Service User") {
//     adminroute = "service-user";
//   } else if (userInfo?.role === "Project User") {
//     adminroute = "project-user";
//   } else if (userInfo?.role === "Factory Admin") {
//     adminroute = "factory-admin";
//   }
//   return (
//     <div>
//       {robotAnalyticsLoading ? (
//         <LoadingSpinner />
//       ) : checkStatus.includes(subscriptionStatus) ? (
//         <SubscriptionExpiryCard
//           data={subscriptiondata}
//           subscriptionStatus={subscriptionStatus}
//           error={robotAnalyticsError}
//         />
//       ) : (
//         <>
//           {/* FILTER */}

//           <CCard className="mb-4">
//             <CCardHeader className="d-flex justify-content-between align-items-center">
//               Filters
//               <Link target="blank" to={`/${adminroute}/site-statistics`}>
//                 View Site Statistics
//               </Link>
//             </CCardHeader>
//             <CCardBody>
//               <CRow>
//                 <CCol md={3}>
//                   <div style={{ position: "relative" }}>
//                     <CFormInput
//                       type="text"
//                       label="Search Robot"
//                       placeholder="Search Robot No"
//                       value={searchTerm}
//                       onChange={handleRobotSearch}
//                     />

//                     {searchTerm !== selectedRobot &&
//                       filteredRobots.length > 0 && (
//                         <div
//                           style={{
//                             position: "absolute",
//                             top: "70px",
//                             width: "100%",
//                             maxHeight: "200px",
//                             overflowY: "auto",
//                             background: "#212631",
//                             border: "1px solid #ddd",
//                             borderRadius: "6px",
//                             zIndex: 1000,
//                           }}
//                         >
//                           {filteredRobots.length === 0 ? (
//                             <div className="p-2 text-center">
//                               No robots found
//                             </div>
//                           ) : (
//                             filteredRobots.map((robot, index) => (
//                               <div
//                                 key={index}
//                                 className="p-2"
//                                 style={{
//                                   cursor: "pointer",
//                                   borderBottom: "1px solid #eee",
//                                 }}
//                                 onClick={() => {
//                                   setSearchTerm(robot.robot_no); // show in input
//                                   setSelectedRobot(robot.robot_no); // 🔥 THIS will trigger API
//                                   setFilteredRobots([]);
//                                 }}
//                               >
//                                 {robot.robot_no}
//                               </div>
//                             ))
//                           )}
//                         </div>
//                       )}
//                   </div>
//                 </CCol>
//                 <CCol md={2}>
//                   <CFormInput
//                     type="date"
//                     label="Start Date"
//                     value={startDate}
//                     onChange={(e) => setStartDate(e.target.value)}
//                   />
//                 </CCol>

//                 <CCol md={2}>
//                   <CFormInput
//                     type="date"
//                     label="End Date"
//                     value={endDate}
//                     onChange={(e) => setEndDate(e.target.value)}
//                   />
//                 </CCol>
//               </CRow>
//             </CCardBody>
//           </CCard>

//           <CCard className="mb-4">
//             <CCardBody>
//               <CRow className="g-3">
//                 <CCol md={3}>
//                   <CCard className="text-center h-100 shadow-sm ">
//                     <CCardBody>
//                       <div className="text-muted small mb-1">
//                         Average Cleaning Time
//                       </div>
//                       <div className="fs-3 fw-semibold text-warning">
//                         {avgCleaningTime.toFixed(1)}
//                       </div>
//                       <div className="text-muted small">minutes</div>
//                     </CCardBody>
//                   </CCard>
//                 </CCol>

//                 <CCol md={3}>
//                   <CCard className="text-center h-100 shadow-sm ">
//                     <CCardBody>
//                       <div className="text-muted small mb-1">Total Cycles</div>
//                       <div className="fs-3 fw-semibold text-success">
//                         {total_cycles}
//                       </div>
//                     </CCardBody>
//                   </CCard>
//                 </CCol>

//                 <CCol md={3}>
//                   <CCard className="text-center h-100 shadow-sm ">
//                     <CCardBody>
//                       <div className="text-muted small mb-2">Brush Current</div>

//                       <div className="d-flex justify-content-between px-2">
//                         <span className="text-muted small">Max</span>
//                         <span className="fw-semibold">
//                           {maxBrushCurrent}&nbsp;A
//                         </span>
//                       </div>

//                       <div className="d-flex justify-content-between px-2">
//                         <span className="text-muted small">Avg</span>
//                         <span className="fw-semibold">
//                           {avgBrushCurrent}&nbsp;A
//                         </span>
//                       </div>
//                     </CCardBody>
//                   </CCard>
//                 </CCol>

//                 <CCol md={3}>
//                   <CCard className="text-center h-100 shadow-sm ">
//                     <CCardBody>
//                       <div className="text-muted small mb-2">Wheel Current</div>

//                       <div className="d-flex justify-content-between px-2">
//                         <span className="text-muted small">Max</span>
//                         <span className="fw-semibold">
//                           {maxWheelCurrent}&nbsp;A
//                         </span>
//                       </div>

//                       <div className="d-flex justify-content-between px-2">
//                         <span className="text-muted small">Avg</span>
//                         <span className="fw-semibold">
//                           {avgWheelCurrent}&nbsp;A
//                         </span>
//                       </div>
//                     </CCardBody>
//                   </CCard>
//                 </CCol>
//               </CRow>
//             </CCardBody>
//           </CCard>

//           {/* CLEANING TIME GRAPH */}

//           <CRow>
//             <CCol md={12}>
//               <CCard>
//                 <CCardHeader>Cleaning Duration</CCardHeader>
//                 <CCardBody>
//                   <CChartLine
//                     style={{ height: 300 }}
//                     data={{
//                       labels: filteredData.map((d) => d.date),
//                       datasets: [
//                         {
//                           label: "Cleaning Time (minutes)",
//                           // borderColor: "#27AE60",
//                           // backgroundColor: "#27AE60",
//                           data: filteredData.map((d) => d.cleaning_minutes),
//                           tension: 0.4,
//                         },
//                       ],
//                     }}
//                     options={{ maintainAspectRatio: false }}
//                   />
//                 </CCardBody>
//               </CCard>
//             </CCol>

//             {/* CYCLES */}
//           </CRow>
//           <CRow className="mt-4">
//             <CCol md={12}>
//               <CCard>
//                 <CCardHeader>Battery Level</CCardHeader>
//                 <CCardBody>
//                   <CChartBar
//                     style={{ height: 320 }}
//                     data={{
//                       labels: filteredData.map((d) => d.date),
//                       datasets: [
//                         {
//                           label: "Battery Start %",
//                           backgroundColor: "#27AE60",
//                           data: filteredData.map((d) => d.battery_start),
//                           barThickness: 25,
//                         },
//                         {
//                           label: "Battery End %",
//                           backgroundColor: "#4e73df",
//                           data: filteredData.map((d) => d.battery_end),
//                           barThickness: 25,
//                         },
//                       ],
//                     }}
//                     options={{
//                       maintainAspectRatio: false,
//                       scales: {
//                         y: {
//                           title: { display: true, text: "Battery %" },
//                           min: 0,
//                           max: 100,
//                         },
//                       },
//                     }}
//                   />
//                 </CCardBody>
//               </CCard>
//             </CCol>
//           </CRow>
//           <CRow className="my-4">
//             <CCol md={12}>
//               <CCard>
//                 <CCardHeader>Max Motor Current</CCardHeader>

//                 <CCardBody>
//                   <CChartBar
//                     style={{ height: 320 }}
//                     data={{
//                       labels: filteredData.map((d) => d.date),

//                       datasets: [
//                         {
//                           label: "Brush Current (A)",
//                           backgroundColor: "#27AE60",
//                           data: filteredData.map((d) => d.max_brush_current),
//                           barThickness: 25,
//                         },

//                         {
//                           label: "Wheel Current (A)",
//                           backgroundColor: "#4e73df",
//                           data: filteredData.map((d) => d.max_wheel_current),
//                           barThickness: 25,
//                         },
//                       ],
//                     }}
//                     options={{
//                       maintainAspectRatio: false,

//                       plugins: {
//                         legend: {
//                           position: "top",
//                         },
//                       },

//                       scales: {
//                         y: {
//                           title: {
//                             display: true,
//                             text: "Current (A)",
//                           },
//                           beginAtZero: true,
//                         },
//                       },
//                     }}
//                   />
//                 </CCardBody>
//               </CCard>
//             </CCol>
//           </CRow>

//           <CRow className="my-4">
//             <CCol md={12}>
//               <CCard>
//                 <CCardHeader>Average Motor Current</CCardHeader>

//                 <CCardBody>
//                   <CChartBar
//                     style={{ height: 320 }}
//                     data={{
//                       labels: filteredData.map((d) => d.date),

//                       datasets: [
//                         {
//                           label: "Brush Current (A)",
//                           backgroundColor: "#27AE60",
//                           data: filteredData.map(
//                             (d) => d.average_brush_current,
//                           ),
//                           barThickness: 25,
//                         },

//                         {
//                           label: "Wheel Current (A)",
//                           backgroundColor: "#4e73df",
//                           data: filteredData.map(
//                             (d) => d.average_wheel_current,
//                           ),
//                           barThickness: 25,
//                         },
//                       ],
//                     }}
//                     options={{
//                       maintainAspectRatio: false,

//                       plugins: {
//                         legend: {
//                           position: "top",
//                         },
//                       },

//                       scales: {
//                         y: {
//                           title: {
//                             display: true,
//                             text: "Current (A)",
//                           },
//                           beginAtZero: true,
//                         },
//                       },
//                     }}
//                   />
//                 </CCardBody>
//               </CCard>
//             </CCol>
//           </CRow>
//         </>
//       )}
//     </div>
//   );
// };

// export default RobotAnalytics;

import React, { useState, useEffect, useReducer, useMemo } from "react";
import axios from "axios";
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CFormInput,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from "@coreui/react";
import { useSelector } from "react-redux";
import { CChartBar, CChartLine } from "@coreui/react-chartjs";
import LoadingSpinner from "../../../components/LoadingSpinner";
import SubscriptionExpiryCard from "../../../components/SubscriptionExpiryCard";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

/* ─────────────────────────────────────────────
   REDUCER
───────────────────────────────────────────── */
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        rawData: action.payload.data,
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
        loading: false,
        error: action.payload,
        subscriptiondata: action.subscriptiondata,
        subscriptionStatus: action.subscriptionStatus,
      };
    default:
      return state;
  }
};

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
const fmtA = (mA) => {
  if (mA == null || mA === 0) return null;
  return parseFloat((mA / 1000).toFixed(3));
};

const fmtMin = (sec) => {
  if (!sec) return null;
  return parseFloat((sec / 60).toFixed(1));
};

const outcomeOf = (c, comments = "") => {
  if (c.finish) return "completed";
  if (c.battery_dead) return "battery_dead";
  if (c.cleaning_cancelled) {
    const txt = (comments || "").toLowerCase();
    if (txt.includes("stuck") || txt.includes("mrae")) return "stuck";
    return "cancelled";
  }
  return "in_progress";
};

const OUTCOME_META = {
  completed: { label: "Completed", color: "#2ecc71", badge: "success" },
  cancelled: { label: "Stopped", color: "#e74c3c", badge: "danger" },
  stuck: { label: "Stuck", color: "#f39c12", badge: "warning" },
  battery_dead: { label: "Battery Dead", color: "#9b59b6", badge: "info" },
  in_progress: { label: "In Progress", color: "#3498db", badge: "primary" },
};

const roleRoute = (role) => {
  const map = {
    "Master Admin": "master-admin",
    "Service Admin": "service-admin",
    "Project Admin": "project-admin",
    "Client Admin": "client-admin",
    "Site Incharge": "site-incharge",
    "Site Technician": "site-technician",
    "Client Site Technician": "client-site-technician",
    "Master User": "master-user",
    "Service User": "service-user",
    "Project User": "project-user",
    "Factory Admin": "factory-admin",
  };
  return map[role] || "";
};

/* ─────────────────────────────────────────────
   SECTION HEADER component
───────────────────────────────────────────── */
const SectionLabel = ({ children, accent = "#3498db" }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 16,
    }}
  >
    <div
      style={{ width: 3, height: 18, background: accent, borderRadius: 2 }}
    />
    <span
      style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "#8899aa",
      }}
    >
      {children}
    </span>
  </div>
);

/* ─────────────────────────────────────────────
   KPI CARD
───────────────────────────────────────────── */
const KpiCard = ({ label, value, unit, sub, accent = "#3498db", icon }) => (
  <CCard
    style={{
      background: "linear-gradient(145deg, #0d1b2e 0%, #0a1628 100%)",
      border: `1px solid ${accent}22`,
      borderTop: `2px solid ${accent}`,
      height: "100%",
    }}
  >
    <CCardBody style={{ padding: "16px 18px" }}>
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#607080",
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
        <span
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: accent,
            lineHeight: 1,
          }}
        >
          {value ?? "—"}
        </span>
        {unit && (
          <span style={{ fontSize: 12, color: "#607080", fontWeight: 500 }}>
            {unit}
          </span>
        )}
      </div>
      {sub && (
        <div style={{ fontSize: 11, color: "#607080", marginTop: 6 }}>
          {sub}
        </div>
      )}
    </CCardBody>
  </CCard>
);

/* ─────────────────────────────────────────────
   OUTCOME PILL
───────────────────────────────────────────── */
const OutcomePill = ({ outcome }) => {
  const m = OUTCOME_META[outcome] || OUTCOME_META.in_progress;
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: 4,
        fontSize: 11,
        fontWeight: 600,
        background: `${m.color}22`,
        color: m.color,
        border: `1px solid ${m.color}44`,
      }}
    >
      {m.label}
    </span>
  );
};

/* ─────────────────────────────────────────────
   CHART WRAPPER
───────────────────────────────────────────── */
const ChartCard = ({ title, subtitle, children, height = 260 }) => (
  <CCard
    style={{
      background: "#0a1628",
      border: "1px solid #1a2a40",
      height: "100%",
    }}
  >
    <CCardHeader
      style={{
        background: "transparent",
        borderBottom: "1px solid #1a2a40",
        padding: "12px 16px",
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 600, color: "#c8d8e8" }}>
        {title}
      </div>
      {subtitle && (
        <div style={{ fontSize: 11, color: "#607080", marginTop: 2 }}>
          {subtitle}
        </div>
      )}
    </CCardHeader>
    <CCardBody style={{ padding: "12px 16px" }}>
      <div style={{ height }}>{children}</div>
    </CCardBody>
  </CCard>
);

/* ─────────────────────────────────────────────
   SHARED CHART OPTIONS
───────────────────────────────────────────── */
const baseOpts = (yLabel = "", extra = {}) => ({
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: "#8899aa", font: { size: 11 }, boxWidth: 12 } },
    tooltip: {
      backgroundColor: "#0d1b2e",
      titleColor: "#c8d8e8",
      bodyColor: "#8899aa",
      borderColor: "#1a2a40",
      borderWidth: 1,
    },
  },
  scales: {
    x: {
      ticks: { color: "#607080", font: { size: 10 }, maxRotation: 45 },
      grid: { color: "#1a2a4020" },
    },
    y: {
      title: {
        display: !!yLabel,
        text: yLabel,
        color: "#607080",
        font: { size: 10 },
      },
      ticks: { color: "#607080", font: { size: 10 } },
      grid: { color: "#1a2a4040" },
      beginAtZero: true,
    },
  },
  ...extra,
});

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
const RobotAnalytics = () => {
  const [
    {
      loading,
      error,
      rawData,
      avg_cleaning_minutes,
      total_cycles,
      maxWheelCurrent,
      avgWheelCurrent,
      maxBrushCurrent,
      avgBrushCurrent,
      subscriptiondata,
      subscriptionStatus,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: false,
    error: "",
    rawData: [],
    avg_cleaning_minutes: 0,
    total_cycles: 0,
    maxWheelCurrent: 0,
    avgWheelCurrent: 0,
    maxBrushCurrent: 0,
    avgBrushCurrent: 0,
    subscriptiondata: {},
    subscriptionStatus: "",
  });

  const userInfo = useSelector((state) => state.userInfo);
  const today = new Date();
  const last7 = new Date();
  last7.setDate(today.getDate() - 7);
  const fmt = (d) => d.toISOString().slice(0, 10);

  const [startDate, setStartDate] = useState(fmt(last7));
  const [endDate, setEndDate] = useState(fmt(today));
  const [robots, setRobots] = useState([]);
  const [filteredRobots, setFilteredRobots] = useState([]);
  const [selectedRobot, setSelectedRobot] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  /* robots from cache */
  useEffect(() => {
    const cached = JSON.parse(localStorage.getItem("robots")) || [];
    setRobots(cached);
  }, []);

  useEffect(() => {
    if (robots.length > 0 && !selectedRobot) {
      setSelectedRobot(robots[0]?.robot_no);
      setSearchTerm(robots[0]?.robot_no);
    }
  }, [robots, selectedRobot]);

  /* debounce */
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(t);
  }, [searchTerm]);

  /* filter dropdown */
  useEffect(() => {
    if (debouncedSearch) {
      setFilteredRobots(
        robots.filter((r) =>
          r.robot_no?.toLowerCase().includes(debouncedSearch.toLowerCase()),
        ),
      );
    } else {
      setFilteredRobots([]);
    }
  }, [debouncedSearch, robots]);

  /* fetch */
  useEffect(() => {
    if (!selectedRobot) return;
    const fetch = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data: res } = await axios.post(
          "/api/v1/robot-tracking/robot-cleaning-analytics",
          { robot_no: selectedRobot, startDate, endDate },
          { withCredentials: true },
        );
        dispatch({
          type: "FETCH_SUCCESS",
          payload: {
            data: res.data,
            avg_cleaning_minutes: res.avg_cleaning_minutes,
            total_cycles: res.total_cycles,
            maxWheelCurrent: res.maxWheelCurrent,
            avgWheelCurrent: res.avgWheelCurrent,
            maxBrushCurrent: res.maxBrushCurrent,
            avgBrushCurrent: res.avgBrushCurrent,
          },
        });
      } catch (e) {
        dispatch({
          type: "FETCH_FAIL",
          payload: e.response?.data?.error || e.response?.data?.message,
          subscriptiondata: e.response?.data?.data,
          subscriptionStatus: e.response?.data?.subscriptionStatus,
        });
        toast.error(e.response?.data?.error || e.response?.data?.message);
      }
    };
    fetch();
  }, [startDate, endDate, selectedRobot]);

  /* ─── DERIVED DATA ─── */
  const records = useMemo(() => {
    if (!rawData?.length) return [];
    return rawData.map((d) => {
      const c = d.cleaning || {};
      const outcome = outcomeOf(c, d.comments);

      // time
      const actualDurationSec =
        c.startAt && c.finishAt
          ? (new Date(c.finishAt) - new Date(c.startAt)) / 1000
          : null;
      const actualDurationMin = actualDurationSec
        ? parseFloat((actualDurationSec / 60).toFixed(1))
        : null;
      const cleaningSec = c.total_cleaning_time || null;
      const overheadSec =
        actualDurationSec && cleaningSec
          ? Math.max(0, Math.round(actualDurationSec - cleaningSec))
          : null;
      const fwdTime = c.forward_cleaning_time || null;
      const revTime = c.reverse_cleaning_time || null;
      const fwdRevRatio =
        fwdTime && revTime ? parseFloat((fwdTime / revTime).toFixed(2)) : null;

      // battery
      const batBefore = c.battery_before_cleaning ?? null;
      const batMid = c.battery_at_reverse_station ?? null;
      const batAfter = c.battery_after_cleaning ?? null;
      const batDrain =
        batBefore != null && batAfter != null ? batBefore - batAfter : null;
      const batFwdDrain =
        batBefore != null && batMid != null ? batBefore - batMid : null;
      const batRevDrain =
        batMid != null && batAfter != null ? batMid - batAfter : null;

      // currents
      const avgBrush = fmtA(c.cycle_average_brush_current);
      const maxBrush = fmtA(c.cycle_max_brush_current);
      const avgWheel = fmtA(c.cycle_average_wheel_current);
      const maxWheel = fmtA(c.cycle_max_wheel_current);
      const brushSpike =
        avgBrush && maxBrush
          ? parseFloat((maxBrush / avgBrush).toFixed(2))
          : null;
      const wheelSpike =
        avgWheel && maxWheel
          ? parseFloat((maxWheel / avgWheel).toFixed(2))
          : null;
      const brushWheelRatio =
        avgBrush && avgWheel
          ? parseFloat((avgBrush / avgWheel).toFixed(2))
          : null;

      // temperature
      const temp = c.temperature_before_cleaning ?? null;

      // date label
      const dateLabel = new Date(d.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      });
      const hourOfDay = new Date(d.createdAt).getHours();

      return {
        _id: d._id,
        date: new Date(d.createdAt).toISOString().slice(0, 10),
        dateLabel,
        hourOfDay,
        robot_no: d.robot_no,
        block: d.block,
        outcome,

        actualDurationMin,
        cleaningMin: fmtMin(cleaningSec),
        overheadSec,
        fwdTime,
        revTime,
        fwdRevRatio,

        batBefore,
        batMid,
        batAfter,
        batDrain,
        batFwdDrain,
        batRevDrain,

        avgBrush,
        maxBrush,
        avgWheel,
        maxWheel,
        brushSpike,
        wheelSpike,
        brushWheelRatio,

        temp,
        cycleCount: c.cycle_count,
      };
    });
  }, [rawData]);

  /* outcome counts */
  const outcomeCounts = useMemo(() => {
    const counts = {
      completed: 0,
      cancelled: 0,
      stuck: 0,
      battery_dead: 0,
      in_progress: 0,
    };
    records.forEach((r) => {
      if (counts[r.outcome] !== undefined) counts[r.outcome]++;
    });
    return counts;
  }, [records]);

  const completedRecords = useMemo(
    () => records.filter((r) => r.outcome === "completed"),
    [records],
  );

  /* aggregates over completed only */
  const agg = useMemo(() => {
    const c = completedRecords;
    if (!c.length) return {};
    const avg = (arr, key) => {
      const vals = arr.map((r) => r[key]).filter((v) => v != null);
      return vals.length
        ? parseFloat((vals.reduce((s, v) => s + v, 0) / vals.length).toFixed(2))
        : null;
    };
    return {
      avgBatDrain: avg(c, "batDrain"),
      avgOverhead: Math.round(avg(c, "overheadSec") || 0),
      avgTemp: avg(c, "temp"),
      avgBrushSpike: avg(c, "brushSpike"),
      avgWheelSpike: avg(c, "wheelSpike"),
      avgFwdRevRatio: avg(c, "fwdRevRatio"),
      successRate: Math.round((outcomeCounts.completed / records.length) * 100),
    };
  }, [completedRecords, outcomeCounts, records.length]);

  /* chart labels — use all records sorted by date */
  const labels = records.map((r) => r.dateLabel);
  const cLabels = completedRecords.map((r) => r.dateLabel);

  const adminroute = roleRoute(userInfo?.role);

  const checkStatus = [
    "subscriptionSitesAssigned",
    "subscriptionFound",
    "subscriptionaRenewStatus",
    "subscriptionPaymentStatus",
    "subscriptionPlanAccess",
  ];

  /* ─────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────── */
  if (loading) return <LoadingSpinner />;
  if (checkStatus.includes(subscriptionStatus))
    return (
      <SubscriptionExpiryCard
        data={subscriptiondata}
        subscriptionStatus={subscriptionStatus}
        error={error}
      />
    );

  return (
    <div
      style={{ background: "#060f1e", minHeight: "100vh", padding: "0 0 40px" }}
    >
      {/* ── FILTERS ── */}
      <CCard
        style={{
          background: "#0a1628",
          border: "1px solid #1a2a40",
          marginBottom: 20,
        }}
      >
        <CCardHeader
          style={{
            background: "transparent",
            borderBottom: "1px solid #1a2a40",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 16px",
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#607080",
            }}
          >
            Robot Analytics
          </span>
          <Link
            to={`/${adminroute}/site-statistics`}
            style={{ fontSize: 12, color: "#3498db", textDecoration: "none" }}
          >
            View Site Statistics →
          </Link>
        </CCardHeader>
        <CCardBody style={{ padding: "14px 16px" }}>
          <CRow className="g-3 align-items-end">
            <CCol md={3}>
              <div style={{ position: "relative" }}>
                <label
                  style={{
                    fontSize: 11,
                    color: "#607080",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    marginBottom: 4,
                    display: "block",
                  }}
                >
                  Robot
                </label>
                <CFormInput
                  placeholder="Search robot no."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    background: "#0d1b2e",
                    border: "1px solid #1a2a40",
                    color: "#c8d8e8",
                    fontSize: 13,
                  }}
                />
                {searchTerm !== selectedRobot && filteredRobots.length > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      top: "64px",
                      width: "100%",
                      maxHeight: 200,
                      overflowY: "auto",
                      background: "#0d1b2e",
                      border: "1px solid #1a2a40",
                      borderRadius: 6,
                      zIndex: 1000,
                    }}
                  >
                    {filteredRobots.map((robot, i) => (
                      <div
                        key={i}
                        style={{
                          padding: "8px 12px",
                          cursor: "pointer",
                          borderBottom: "1px solid #1a2a40",
                          fontSize: 13,
                          color: "#c8d8e8",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = "#132030")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                        onClick={() => {
                          setSearchTerm(robot.robot_no);
                          setSelectedRobot(robot.robot_no);
                          setFilteredRobots([]);
                        }}
                      >
                        {robot.robot_no}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CCol>
            <CCol md={2}>
              <label
                style={{
                  fontSize: 11,
                  color: "#607080",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: 4,
                  display: "block",
                }}
              >
                Start Date
              </label>
              <CFormInput
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{
                  background: "#0d1b2e",
                  border: "1px solid #1a2a40",
                  color: "#c8d8e8",
                  fontSize: 13,
                }}
              />
            </CCol>
            <CCol md={2}>
              <label
                style={{
                  fontSize: 11,
                  color: "#607080",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: 4,
                  display: "block",
                }}
              >
                End Date
              </label>
              <CFormInput
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{
                  background: "#0d1b2e",
                  border: "1px solid #1a2a40",
                  color: "#c8d8e8",
                  fontSize: 13,
                }}
              />
            </CCol>
            {records[0]?.block && (
              <CCol
                md="auto"
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  paddingBottom: 2,
                }}
              >
                <div
                  style={{
                    padding: "6px 14px",
                    background: "#3498db11",
                    border: "1px solid #3498db44",
                    borderRadius: 6,
                    fontSize: 12,
                    color: "#3498db",
                    fontWeight: 600,
                  }}
                >
                  📍 {records[0].block}
                </div>
              </CCol>
            )}
          </CRow>
        </CCardBody>
      </CCard>

      {records.length === 0 && !loading ? (
        <CCard style={{ background: "#0a1628", border: "1px solid #1a2a40" }}>
          <CCardBody
            style={{ textAlign: "center", padding: 48, color: "#607080" }}
          >
            <div style={{ fontSize: 32, marginBottom: 12 }}>🤖</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>
              No cleaning data found
            </div>
            <div style={{ fontSize: 12, marginTop: 6 }}>
              Try adjusting the date range or selecting a different robot.
            </div>
          </CCardBody>
        </CCard>
      ) : (
        <>
          {/* ── SECTION 1: CYCLE OUTCOMES ── */}
          <div style={{ marginBottom: 20 }}>
            <SectionLabel accent="#2ecc71">Cycle Outcomes</SectionLabel>
            <CRow className="g-3">
              <CCol xs={6} md>
                <KpiCard
                  label="Total Cycles"
                  value={total_cycles}
                  accent="#3498db"
                  sub={`in selected range: ${records.length}`}
                />
              </CCol>
              <CCol xs={6} md>
                <KpiCard
                  label="Completed"
                  value={outcomeCounts.completed}
                  accent="#2ecc71"
                  sub={
                    records.length
                      ? `${Math.round((outcomeCounts.completed / records.length) * 100)}% success rate`
                      : null
                  }
                />
              </CCol>
              <CCol xs={6} md>
                <KpiCard
                  label="Manually Stopped"
                  value={outcomeCounts.cancelled}
                  accent="#e74c3c"
                  sub={
                    records.length
                      ? `${Math.round((outcomeCounts.cancelled / records.length) * 100)}% of cycles`
                      : null
                  }
                />
              </CCol>
              <CCol xs={6} md>
                <KpiCard
                  label="Stuck on Row"
                  value={outcomeCounts.stuck}
                  accent="#f39c12"
                  sub={
                    records.length
                      ? `${Math.round((outcomeCounts.stuck / records.length) * 100)}% of cycles`
                      : null
                  }
                />
              </CCol>
              <CCol xs={6} md>
                <KpiCard
                  label="Battery Dead"
                  value={outcomeCounts.battery_dead}
                  accent="#9b59b6"
                />
              </CCol>
            </CRow>

            {/* success rate bar */}
            {records.length > 0 && (
              <CCard
                style={{
                  background: "#0a1628",
                  border: "1px solid #1a2a40",
                  marginTop: 12,
                }}
              >
                <CCardBody style={{ padding: "12px 16px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 8,
                      fontSize: 11,
                      color: "#607080",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                      }}
                    >
                      Overall Success Rate
                    </span>
                    <span
                      style={{
                        color:
                          agg.successRate >= 80
                            ? "#2ecc71"
                            : agg.successRate >= 50
                              ? "#f39c12"
                              : "#e74c3c",
                        fontWeight: 700,
                        fontSize: 13,
                      }}
                    >
                      {agg.successRate}%
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      height: 8,
                      borderRadius: 4,
                      overflow: "hidden",
                      gap: 2,
                    }}
                  >
                    {outcomeCounts.completed > 0 && (
                      <div
                        style={{
                          flex: outcomeCounts.completed,
                          background: "#2ecc71",
                          borderRadius: "4px 0 0 4px",
                        }}
                      />
                    )}
                    {outcomeCounts.cancelled > 0 && (
                      <div
                        style={{
                          flex: outcomeCounts.cancelled,
                          background: "#e74c3c",
                        }}
                      />
                    )}
                    {outcomeCounts.stuck > 0 && (
                      <div
                        style={{
                          flex: outcomeCounts.stuck,
                          background: "#f39c12",
                        }}
                      />
                    )}
                    {outcomeCounts.battery_dead > 0 && (
                      <div
                        style={{
                          flex: outcomeCounts.battery_dead,
                          background: "#9b59b6",
                          borderRadius: "0 4px 4px 0",
                        }}
                      />
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 16,
                      marginTop: 8,
                      flexWrap: "wrap",
                    }}
                  >
                    {Object.entries(OUTCOME_META)
                      .filter(([k]) => k !== "in_progress")
                      .map(
                        ([k, m]) =>
                          outcomeCounts[k] > 0 && (
                            <span
                              key={k}
                              style={{
                                fontSize: 10,
                                color: m.color,
                                fontWeight: 600,
                              }}
                            >
                              ● {m.label}: {outcomeCounts[k]}
                            </span>
                          ),
                      )}
                  </div>
                </CCardBody>
              </CCard>
            )}
          </div>

          {/* ── SECTION 2: PERFORMANCE KPIs ── */}
          <div style={{ marginBottom: 20 }}>
            <SectionLabel accent="#3498db">Performance Summary</SectionLabel>
            <CRow className="g-3">
              <CCol xs={6} md={3}>
                <KpiCard
                  label="Avg Cleaning Time"
                  value={avg_cleaning_minutes?.toFixed(1)}
                  unit="min"
                  accent="#3498db"
                  sub="active cleaning only"
                />
              </CCol>
              <CCol xs={6} md={3}>
                <KpiCard
                  label="Avg Battery Drain"
                  value={agg.avgBatDrain != null ? agg.avgBatDrain : "—"}
                  unit="%"
                  accent="#f39c12"
                  sub={
                    agg.avgBatDrain != null
                      ? agg.avgBatDrain <= 2
                        ? "✓ Efficient"
                        : agg.avgBatDrain <= 5
                          ? "Moderate"
                          : "⚠ High drain"
                      : "completed cycles only"
                  }
                />
              </CCol>
              <CCol xs={6} md={3}>
                <KpiCard
                  label="Avg Overhead / Cycle"
                  value={agg.avgOverhead != null ? agg.avgOverhead : "—"}
                  unit="sec"
                  accent="#8e44ad"
                  sub="boot + positioning time"
                />
              </CCol>
              <CCol xs={6} md={3}>
                <KpiCard
                  label="Avg Temperature"
                  value={agg.avgTemp != null ? agg.avgTemp : "—"}
                  unit="°C"
                  accent="#e67e22"
                  sub="at cycle start"
                />
              </CCol>
            </CRow>
          </div>

          {/* ── SECTION 3: CURRENT KPIs ── */}
          <div style={{ marginBottom: 20 }}>
            <SectionLabel accent="#e74c3c">Motor Current Summary</SectionLabel>
            <CRow className="g-3">
              <CCol xs={6} md={3}>
                <KpiCard
                  label="Max Brush Current"
                  value={maxBrushCurrent}
                  unit="A"
                  accent="#e74c3c"
                  sub="peak brush motor stress"
                />
              </CCol>
              <CCol xs={6} md={3}>
                <KpiCard
                  label="Avg Brush Current"
                  value={avgBrushCurrent}
                  unit="A"
                  accent="#c0392b"
                  sub="typical brush load"
                />
              </CCol>
              <CCol xs={6} md={3}>
                <KpiCard
                  label="Max Wheel Current"
                  value={maxWheelCurrent}
                  unit="A"
                  accent="#2980b9"
                  sub="peak drive motor stress"
                />
              </CCol>
              <CCol xs={6} md={3}>
                <KpiCard
                  label="Avg Wheel Current"
                  value={avgWheelCurrent}
                  unit="A"
                  accent="#1a6fa0"
                  sub="typical wheel load"
                />
              </CCol>
            </CRow>

            {/* spike ratio insight */}
            {(agg.avgBrushSpike != null || agg.avgWheelSpike != null) && (
              <CCard
                style={{
                  background: "#0a1628",
                  border: "1px solid #1a2a40",
                  marginTop: 12,
                }}
              >
                <CCardBody style={{ padding: "14px 16px" }}>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#607080",
                      marginBottom: 12,
                    }}
                  >
                    Motor Stress Index{" "}
                    <span
                      style={{
                        color: "#3498db",
                        fontSize: 10,
                        fontWeight: 400,
                        marginLeft: 6,
                      }}
                    >
                      (max ÷ avg — closer to 1.0 = consistent clean load)
                    </span>
                  </div>
                  <CRow className="g-3">
                    {[
                      {
                        label: "Brush Spike Ratio",
                        val: agg.avgBrushSpike,
                        color: "#e74c3c",
                      },
                      {
                        label: "Wheel Spike Ratio",
                        val: agg.avgWheelSpike,
                        color: "#2980b9",
                      },
                    ].map(
                      ({ label, val, color }) =>
                        val != null && (
                          <CCol md={6} key={label}>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: 6,
                              }}
                            >
                              <span style={{ fontSize: 12, color: "#8899aa" }}>
                                {label}
                              </span>
                              <span
                                style={{
                                  fontSize: 13,
                                  fontWeight: 700,
                                  color:
                                    val <= 1.1
                                      ? "#2ecc71"
                                      : val <= 1.5
                                        ? "#f39c12"
                                        : "#e74c3c",
                                }}
                              >
                                {val}×{" "}
                                {val <= 1.1
                                  ? "✓ Smooth"
                                  : val <= 1.5
                                    ? "Moderate spikes"
                                    : "⚠ High spikes"}
                              </span>
                            </div>
                            <div
                              style={{
                                height: 6,
                                background: "#1a2a40",
                                borderRadius: 3,
                              }}
                            >
                              <div
                                style={{
                                  height: "100%",
                                  borderRadius: 3,
                                  width: `${Math.min(((val - 1) / 2) * 100, 100)}%`,
                                  background:
                                    val <= 1.1
                                      ? "#2ecc71"
                                      : val <= 1.5
                                        ? "#f39c12"
                                        : "#e74c3c",
                                  transition: "width 0.6s ease",
                                }}
                              />
                            </div>
                          </CCol>
                        ),
                    )}
                  </CRow>
                </CCardBody>
              </CCard>
            )}
          </div>

          {/* ── SECTION 4: TIME CHARTS ── */}
          <div style={{ marginBottom: 20 }}>
            <SectionLabel accent="#16a085">Cleaning Time Analysis</SectionLabel>
            <CRow className="g-3">
              <CCol md={6}>
                <ChartCard
                  title="Cleaning Duration per Cycle"
                  subtitle="Active cleaning time (minutes)"
                >
                  <CChartLine
                    style={{ height: "100%" }}
                    data={{
                      labels,
                      datasets: [
                        {
                          label: "Total Cleaning (min)",
                          data: records.map((r) => r.cleaningMin),
                          borderColor: "#3498db",
                          backgroundColor: "#3498db22",
                          tension: 0.4,
                          fill: true,
                          pointRadius: 3,
                        },
                        {
                          label: "Actual Duration (min)",
                          data: records.map((r) => r.actualDurationMin),
                          borderColor: "#8e44ad",
                          backgroundColor: "transparent",
                          tension: 0.4,
                          borderDash: [4, 3],
                          pointRadius: 3,
                        },
                      ],
                    }}
                    options={baseOpts("Minutes")}
                  />
                </ChartCard>
              </CCol>
              <CCol md={6}>
                <ChartCard
                  title="Forward vs Reverse Cleaning Time"
                  subtitle="Seconds per cycle — asymmetry may indicate row layout or motor wear"
                >
                  <CChartBar
                    style={{ height: "100%" }}
                    data={{
                      labels: cLabels,
                      datasets: [
                        {
                          label: "Forward (sec)",
                          backgroundColor: "#16a08599",
                          data: completedRecords.map((r) => r.fwdTime),
                          barThickness: 16,
                        },
                        {
                          label: "Reverse (sec)",
                          backgroundColor: "#8e44ad99",
                          data: completedRecords.map((r) => r.revTime),
                          barThickness: 16,
                        },
                      ],
                    }}
                    options={baseOpts("Seconds")}
                  />
                </ChartCard>
              </CCol>
            </CRow>
          </div>

          {/* ── SECTION 5: BATTERY ── */}
          <div style={{ marginBottom: 20 }}>
            <SectionLabel accent="#f39c12">Battery Analysis</SectionLabel>
            <CRow className="g-3">
              <CCol md={8}>
                <ChartCard
                  title="3-Point Battery Tracking"
                  subtitle="Before → Mid (reverse station) → After cleaning"
                >
                  <CChartLine
                    style={{ height: "100%" }}
                    data={{
                      labels: cLabels,
                      datasets: [
                        {
                          label: "Before Cleaning (%)",
                          data: completedRecords.map((r) => r.batBefore),
                          borderColor: "#2ecc71",
                          backgroundColor: "#2ecc7122",
                          tension: 0.3,
                          fill: false,
                          pointRadius: 3,
                        },
                        {
                          label: "At Reverse Station (%)",
                          data: completedRecords.map((r) => r.batMid),
                          borderColor: "#f39c12",
                          backgroundColor: "#f39c1222",
                          tension: 0.3,
                          fill: false,
                          pointRadius: 3,
                          borderDash: [5, 3],
                        },
                        {
                          label: "After Cleaning (%)",
                          data: completedRecords.map((r) => r.batAfter),
                          borderColor: "#e74c3c",
                          backgroundColor: "#e74c3c22",
                          tension: 0.3,
                          fill: false,
                          pointRadius: 3,
                        },
                      ],
                    }}
                    options={baseOpts("Battery %", {
                      scales: {
                        ...baseOpts("Battery %").scales,
                        y: {
                          ...baseOpts("Battery %").scales.y,
                          min: 0,
                          max: 100,
                        },
                      },
                    })}
                  />
                </ChartCard>
              </CCol>
              <CCol md={4}>
                <ChartCard
                  title="Battery Drain per Cycle"
                  subtitle="Total % consumed (before − after)"
                >
                  <CChartBar
                    style={{ height: "100%" }}
                    data={{
                      labels: cLabels,
                      datasets: [
                        {
                          label: "Drain (%)",
                          backgroundColor: completedRecords.map((r) =>
                            r.batDrain == null
                              ? "#607080"
                              : r.batDrain <= 2
                                ? "#2ecc71"
                                : r.batDrain <= 5
                                  ? "#f39c12"
                                  : "#e74c3c",
                          ),
                          data: completedRecords.map((r) => r.batDrain),
                          barThickness: 16,
                        },
                      ],
                    }}
                    options={baseOpts("Battery %")}
                  />
                </ChartCard>
              </CCol>
            </CRow>
          </div>

          {/* ── SECTION 6: CURRENT TRENDS ── */}
          <div style={{ marginBottom: 20 }}>
            <SectionLabel accent="#e74c3c">Motor Current Trends</SectionLabel>
            <CRow className="g-3">
              <CCol md={6}>
                <ChartCard
                  title="Brush Current — Max vs Avg"
                  subtitle="Rising max/avg gap = stress events (debris, worn brush, dirty panels)"
                >
                  <CChartLine
                    style={{ height: "100%" }}
                    data={{
                      labels: cLabels,
                      datasets: [
                        {
                          label: "Max Brush (A)",
                          data: completedRecords.map((r) => r.maxBrush),
                          borderColor: "#e74c3c",
                          backgroundColor: "#e74c3c22",
                          tension: 0.3,
                          fill: false,
                          pointRadius: 3,
                        },
                        {
                          label: "Avg Brush (A)",
                          data: completedRecords.map((r) => r.avgBrush),
                          borderColor: "#e74c3c66",
                          backgroundColor: "#e74c3c11",
                          tension: 0.3,
                          fill: true,
                          pointRadius: 3,
                          borderDash: [4, 3],
                        },
                      ],
                    }}
                    options={baseOpts("Current (A)")}
                  />
                </ChartCard>
              </CCol>
              <CCol md={6}>
                <ChartCard
                  title="Wheel Current — Max vs Avg"
                  subtitle="Rising trend = terrain resistance or motor degradation"
                >
                  <CChartLine
                    style={{ height: "100%" }}
                    data={{
                      labels: cLabels,
                      datasets: [
                        {
                          label: "Max Wheel (A)",
                          data: completedRecords.map((r) => r.maxWheel),
                          borderColor: "#2980b9",
                          backgroundColor: "#2980b922",
                          tension: 0.3,
                          fill: false,
                          pointRadius: 3,
                        },
                        {
                          label: "Avg Wheel (A)",
                          data: completedRecords.map((r) => r.avgWheel),
                          borderColor: "#2980b966",
                          backgroundColor: "#2980b911",
                          tension: 0.3,
                          fill: true,
                          pointRadius: 3,
                          borderDash: [4, 3],
                        },
                      ],
                    }}
                    options={baseOpts("Current (A)")}
                  />
                </ChartCard>
              </CCol>
            </CRow>

            {/* spike ratio over time */}
            <CRow className="g-3 mt-0">
              <CCol md={6}>
                <ChartCard
                  title="Motor Spike Ratio Over Time"
                  subtitle="max ÷ avg — spikes above 1.5 indicate stress events worth investigating"
                  height={220}
                >
                  <CChartLine
                    style={{ height: "100%" }}
                    data={{
                      labels: cLabels,
                      datasets: [
                        {
                          label: "Brush Spike Ratio",
                          data: completedRecords.map((r) => r.brushSpike),
                          borderColor: "#e74c3c",
                          backgroundColor: "transparent",
                          tension: 0.3,
                          pointRadius: 4,
                        },
                        {
                          label: "Wheel Spike Ratio",
                          data: completedRecords.map((r) => r.wheelSpike),
                          borderColor: "#2980b9",
                          backgroundColor: "transparent",
                          tension: 0.3,
                          pointRadius: 4,
                        },
                      ],
                    }}
                    options={baseOpts("Ratio (×)", {
                      plugins: {
                        ...baseOpts().plugins,
                        annotation: {
                          annotations: {
                            warningLine: {
                              type: "line",
                              yMin: 1.5,
                              yMax: 1.5,
                              borderColor: "#f39c1266",
                              borderWidth: 1,
                              borderDash: [5, 5],
                            },
                          },
                        },
                      },
                    })}
                  />
                </ChartCard>
              </CCol>
              <CCol md={6}>
                <ChartCard
                  title="Brush ÷ Wheel Current Ratio"
                  subtitle="Brush draws ~3× more than wheel — a falling ratio may indicate brush wear"
                  height={220}
                >
                  <CChartLine
                    style={{ height: "100%" }}
                    data={{
                      labels: cLabels,
                      datasets: [
                        {
                          label: "Brush / Wheel Ratio",
                          data: completedRecords.map((r) => r.brushWheelRatio),
                          borderColor: "#16a085",
                          backgroundColor: "#16a08522",
                          tension: 0.3,
                          fill: true,
                          pointRadius: 3,
                        },
                      ],
                    }}
                    options={baseOpts("Ratio (×)")}
                  />
                </ChartCard>
              </CCol>
            </CRow>
          </div>

          {/* ── SECTION 7: TEMPERATURE ── */}
          {completedRecords.some((r) => r.temp != null) && (
            <div style={{ marginBottom: 20 }}>
              <SectionLabel accent="#e67e22">
                Temperature at Cleaning Start
              </SectionLabel>
              <ChartCard
                title="Temperature Trend"
                subtitle="Higher temperatures correlate with higher brush current (baked-on dust) and reduced battery efficiency"
              >
                <CChartLine
                  style={{ height: "100%" }}
                  data={{
                    labels: cLabels,
                    datasets: [
                      {
                        label: "Temp (°C)",
                        data: completedRecords.map((r) => r.temp),
                        borderColor: "#e67e22",
                        backgroundColor: "#e67e2222",
                        tension: 0.4,
                        fill: true,
                        pointRadius: 3,
                      },
                    ],
                  }}
                  options={baseOpts("°C")}
                />
              </ChartCard>
            </div>
          )}

          {/* ── SECTION 8: PER-CYCLE TABLE ── */}
          <div style={{ marginBottom: 20 }}>
            <SectionLabel accent="#607080">Per-Cycle Detail</SectionLabel>
            <CCard
              style={{ background: "#0a1628", border: "1px solid #1a2a40" }}
            >
              <CCardHeader
                style={{
                  background: "transparent",
                  borderBottom: "1px solid #1a2a40",
                  padding: "10px 16px",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#8899aa",
                }}
              >
                All {records.length} cycles in selected range
              </CCardHeader>
              <div style={{ overflowX: "auto" }}>
                <CTable style={{ marginBottom: 0 }} hover>
                  <CTableHead>
                    <CTableRow style={{ background: "#060f1e" }}>
                      {[
                        "Date",
                        "Outcome",
                        "Total Time",
                        "Actual Duration",
                        "Overhead",
                        "Fwd / Rev",
                        "Bat Before",
                        "Bat Mid",
                        "Bat After",
                        "Drain",
                        "Avg Brush",
                        "Avg Wheel",
                        "Brush Spike",
                        "Temp °C",
                      ].map((h) => (
                        <CTableHeaderCell
                          key={h}
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            color: "#607080",
                            padding: "10px 12px",
                            whiteSpace: "nowrap",
                            borderBottom: "1px solid #1a2a40",
                            background: "#060f1e",
                          }}
                        >
                          {h}
                        </CTableHeaderCell>
                      ))}
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {records.map((r, i) => (
                      <CTableRow
                        key={r._id || i}
                        style={{
                          borderBottom: "1px solid #1a2a4040",
                          opacity: r.outcome === "completed" ? 1 : 0.75,
                        }}
                      >
                        <CTableDataCell
                          style={{
                            fontSize: 12,
                            color: "#8899aa",
                            padding: "9px 12px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {r.dateLabel}
                        </CTableDataCell>
                        <CTableDataCell style={{ padding: "9px 12px" }}>
                          <OutcomePill outcome={r.outcome} />
                        </CTableDataCell>
                        <CTableDataCell
                          style={{
                            fontSize: 12,
                            color: "#c8d8e8",
                            padding: "9px 12px",
                          }}
                        >
                          {r.cleaningMin != null ? `${r.cleaningMin} min` : "—"}
                        </CTableDataCell>
                        <CTableDataCell
                          style={{
                            fontSize: 12,
                            color: "#c8d8e8",
                            padding: "9px 12px",
                          }}
                        >
                          {r.actualDurationMin != null
                            ? `${r.actualDurationMin} min`
                            : "—"}
                        </CTableDataCell>
                        <CTableDataCell
                          style={{
                            fontSize: 12,
                            color: r.overheadSec > 120 ? "#f39c12" : "#8899aa",
                            padding: "9px 12px",
                          }}
                        >
                          {r.overheadSec != null ? `${r.overheadSec}s` : "—"}
                        </CTableDataCell>
                        <CTableDataCell
                          style={{
                            fontSize: 12,
                            color: "#8899aa",
                            padding: "9px 12px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {r.fwdTime != null && r.revTime != null
                            ? `${r.fwdTime}s / ${r.revTime}s`
                            : "—"}
                        </CTableDataCell>
                        <CTableDataCell
                          style={{
                            fontSize: 12,
                            color: "#2ecc71",
                            padding: "9px 12px",
                          }}
                        >
                          {r.batBefore != null ? `${r.batBefore}%` : "—"}
                        </CTableDataCell>
                        <CTableDataCell
                          style={{
                            fontSize: 12,
                            color: "#f39c12",
                            padding: "9px 12px",
                          }}
                        >
                          {r.batMid != null ? `${r.batMid}%` : "—"}
                        </CTableDataCell>
                        <CTableDataCell
                          style={{
                            fontSize: 12,
                            color: "#e74c3c",
                            padding: "9px 12px",
                          }}
                        >
                          {r.batAfter != null ? `${r.batAfter}%` : "—"}
                        </CTableDataCell>
                        <CTableDataCell
                          style={{
                            fontSize: 12,
                            padding: "9px 12px",
                            color:
                              r.batDrain == null
                                ? "#607080"
                                : r.batDrain <= 2
                                  ? "#2ecc71"
                                  : r.batDrain <= 5
                                    ? "#f39c12"
                                    : "#e74c3c",
                          }}
                        >
                          {r.batDrain != null ? `${r.batDrain}%` : "—"}
                        </CTableDataCell>
                        <CTableDataCell
                          style={{
                            fontSize: 12,
                            color: "#c8d8e8",
                            padding: "9px 12px",
                          }}
                        >
                          {r.avgBrush != null ? `${r.avgBrush} A` : "—"}
                        </CTableDataCell>
                        <CTableDataCell
                          style={{
                            fontSize: 12,
                            color: "#c8d8e8",
                            padding: "9px 12px",
                          }}
                        >
                          {r.avgWheel != null ? `${r.avgWheel} A` : "—"}
                        </CTableDataCell>
                        <CTableDataCell
                          style={{
                            fontSize: 12,
                            padding: "9px 12px",
                            color:
                              r.brushSpike == null
                                ? "#607080"
                                : r.brushSpike <= 1.1
                                  ? "#2ecc71"
                                  : r.brushSpike <= 1.5
                                    ? "#f39c12"
                                    : "#e74c3c",
                          }}
                        >
                          {r.brushSpike != null ? `${r.brushSpike}×` : "—"}
                        </CTableDataCell>
                        <CTableDataCell
                          style={{
                            fontSize: 12,
                            color: r.temp != null ? "#e67e22" : "#607080",
                            padding: "9px 12px",
                          }}
                        >
                          {r.temp != null ? `${r.temp}°C` : "—"}
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              </div>
            </CCard>
          </div>
        </>
      )}
    </div>
  );
};

export default RobotAnalytics;
