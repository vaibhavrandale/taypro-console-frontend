// import {
//   CBadge,
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CCol,
//   CFormSelect,
//   CRow,
// } from "@coreui/react";
// import axios from "axios";
// import React, { useEffect, useReducer, useState } from "react";
// import toast from "react-hot-toast";
// import { useSelector } from "react-redux";
// import LoadingSpinner from "../../components/LoadingSpinner";
// import { CChartLine, CChartPie } from "@coreui/react-chartjs";
// import "./GoogleMapEmbed.css";
// // import CIcon from "@coreui/icons-react";
// // import { cilBolt, cilCloud, cilSpeedometer } from "@coreui/icons";
// import Weather from "../client-admin/weather/Weather";
// import { Link } from "react-router-dom";
// // import moment from "moment";

// const chartColors = ["#52357B", "#5459AC", "#648DB3", "#B2D8CE"];

// const reducer = (state, action) => {
//   switch (action.type) {
//     case "FETCH_SITEID_REQUEST":
//       return { ...state, loadingSiteIds: true, errorSIteIds: "" };
//     case "FETCH_SITEID_SUCCESS":
//       return {
//         ...state,
//         loadingSiteIds: false,
//         siteIds: action.payload,
//       };
//     case "FETCH_SITEID_FAIL":
//       return { ...state, loadingSiteIds: false, errorSIteIds: action.payload };

//     case "FETCH_SITE_DETAILS_REQUEST":
//       return {
//         ...state,
//         loadingSiteDetails: true,
//       };
//     case "FETCH_SITE_DETAILS_SUCCESS":
//       return {
//         ...state,
//         loadingSiteDetails: false,
//         siteDetails: action.payload,
//       };
//     case "FETCH_SITE_DETAILS_FAIL":
//       return {
//         ...state,
//         loadingSiteDetails: false,
//         siteDetailsError: action.payload,
//       };
//     case "FETCH_WEATHER_REQUEST":
//       return { ...state, loadingWeatherData: true, errorWeatherData: "" };
//     case "FETCH_WEATHER_SUCCESS":
//       return {
//         ...state,
//         loadingWeatherData: false,
//         weatherData: action.payload,
//       };
//     case "FETCH_WEATHER_FAIL":
//       return {
//         ...state,
//         loadingWeatherData: false,
//         errorWeatherData: action.payload,
//       };
//     default:
//       return state;
//   }
// };

// const SiteTechnicianDashboard = () => {
//   const authtoken = useSelector((state) => state.authtoken);
//   const userInfo = useSelector((state) => state.userInfo);
//   const [
//     {
//       siteDetailsError,
//       loadingSiteDetails,
//       loadingSiteIds,
//       siteIds,
//       weatherData,
//       loadingWeatherData,
//       errorWeatherData,
//     },
//     dispatch,
//   ] = useReducer(reducer, {
//     siteDetailsError: "",
//     loadingSiteDetails: false,
//     siteDetails: {},
//     weatherData: {},
//     siteIds: [],
//     loadingSiteIds: false,
//     loadingWeatherData: true,
//     errorSIteIds: "",
//     errorWeatherData: "",
//   });

//   const [site_id, setSiteid] = useState(
//     userInfo.assigned_sites[0]?.site_id || "",
//   );
//   const [blockWiseCleaning, setBlockWiseCleaning] = useState([]);
//   const [gateways, setGateways] = useState([]);
//   const [robotsData, setRobotsData] = useState([]);
//   const [siteCoordinates, setSiteCoordinates] = useState({});
//   const [totalAreaCleaned, setTotalAreaCleaned] = useState(0);
//   const [isLoaded, setIsLoaded] = useState(false);
//   const fetchSiteIds = async () => {
//     dispatch({ type: "FETCH_SITEID_REQUEST" });
//     try {
//       const result = await axios.get(`/api/v1/sites`, {
//         headers: { Authorization: `Bearer ${authtoken}` },
//       });
//       dispatch({
//         type: "FETCH_SITEID_SUCCESS",
//         payload: result.data.data,
//       });
//     } catch (error) {
//       dispatch({
//         type: "FETCH_SITEID_FAIL",
//         payload: error.response?.data?.error || error.response?.data?.message,
//       });
//       toast.error(error.response?.data?.error || error.response?.data?.message);
//     }
//   };

//   useEffect(() => {
//     const fetchSiteDetails = async () => {
//       dispatch({ type: "FETCH_SITE_DETAILS_REQUEST" });
//       try {
//         const response = await axios.get(
//           `/api/v1/sites-coordinates/site-details/${site_id}`,
//           {
//             headers: { Authorization: `Bearer ${authtoken}` },
//           },
//         );

//         dispatch({
//           type: "FETCH_SITE_DETAILS_SUCCESS",
//           payload: response.data.data,
//         });
//         setSiteCoordinates(response.data.data.coordinates);
//         setTotalAreaCleaned(response.data.data.totalAreaCleaned);
//         setRobotsData(response.data.data.robots);
//         setGateways(response.data.data.gateways);
//         setBlockWiseCleaning(response.data.data.blockWiseCleaning);
//       } catch (error) {
//         dispatch({
//           type: "FETCH_SITE_DETAILS_FAIL",
//           payload: error.response?.data?.message || error.response?.data?.error,
//         });
//         toast.error(
//           error.response?.data?.message || error.response?.data?.error,
//         );
//       }
//     };

//     const fetchWeatherData = async () => {
//       dispatch({ type: "FETCH_WEATHER_REQUEST" });
//       try {
//         const response = await axios.get(
//           `/api/v1/weatherdata/client/${site_id}`,
//           {
//             headers: { Authorization: `Bearer ${authtoken}` },
//           },
//         );
//         dispatch({
//           type: "FETCH_WEATHER_SUCCESS",
//           payload: response.data.data,
//         });
//       } catch (error) {
//         dispatch({
//           type: "FETCH_WEATHER_FAIL",
//           payload: error.response?.data?.message || error.response?.data?.error,
//         });
//         toast.error(
//           error.response?.data?.message || error.response?.data?.error,
//         );
//       }
//     };

//     fetchSiteDetails();
//     fetchWeatherData();
//     fetchSiteIds();
//   }, [authtoken, site_id]);

//   const handleSiteNameChange = (e) => {
//     dispatch({ type: "SELECT_SITENAME_REQUEST" });

//     const selectedSiteName = e.target.value;

//     const selectedSite = siteIds.find(
//       (site) => site.site_id === selectedSiteName,
//     );

//     if (selectedSite) {
//       setSiteid(selectedSite.site_id);

//       dispatch({
//         type: "SELECT_SITENAME_SUCCESS",
//         payload: selectedSite.site_id,
//       });
//     } else {
//       dispatch({ type: "SELECT_SITENAME_FAIL" });
//     }
//   };

//   // const greeting = weatherData.createdAt
//   //   ? new Date(weatherData.createdAt).getHours()
//   //   : 0;
//   const greeting = new Date().getHours();

//   const getGreeting = () => {
//     if (greeting < 12) {
//       return "Good Morning";
//     } else if (greeting < 18) {
//       return "Good Afternoon";
//     } else {
//       return "Good Evening";
//     }
//   };

//   const GoogleMapEmbed = (latitude, longitude) => {
//     const mapSrc = `https://maps.google.com/maps?hl=en&q=${latitude},${longitude}&t=k&z=18&ie=UTF8&iwloc=B&output=embed`;

//     return (
//       <div
//         className="map-container"
//         style={{
//           position: "relative",
//           height: "415px",
//           width: "100%",
//           // borderRadius: "5px",
//           overflow: "hidden",
//         }}
//       >
//         {!isLoaded && (
//           <div className="map-loader">
//             <div className="spinner"></div>
//             <p>Loading Map...</p>
//           </div>
//         )}
//         <iframe
//           title="Google Satellite Map"
//           width="100%"
//           height="100%"
//           src={mapSrc}
//           onLoad={() => setIsLoaded(true)}
//           allowFullScreen
//         ></iframe>
//       </div>
//     );
//   };

//   const batteryChartData =
//     robotsData?.map((entry) => ({
//       robot: entry.robot_no,
//       value: parseInt(entry.battery_voltage),
//     })) || [];

//   const getWeatherType = () => {
//     const cloudiness = weatherData && weatherData?.cloudiness;
//     const cloudy = weatherData && weatherData?.description?.includes("cloud");

//     const rainy = weatherData && weatherData?.is_rain;

//     if (rainy) return "rainy";
//     if (cloudy || cloudiness > 70) return "cloudy";
//     if (weatherData?.humidity > 60 && cloudiness > 40 && !rainy) return "foggy";
//     return "sunny";
//   };

//   const weatherType = getWeatherType();

//   return (
//     <>
//       <div className="p-2">
//         <div className="">
//           <CRow className="g-4">
//             {/* Map Section */}
//             <CCol xs={12} md={7}>
//               <CCard className="h-100 border-0 shadow-sm">
//                 <CCardHeader className="d-flex justify-content-between align-items-center ">
//                   <span>
//                     Hello {userInfo.username},
//                     <span className="text-success"> {getGreeting()}</span>
//                   </span>
//                   <CBadge color="primary " shape="rounded-pill">
//                     {" "}
// <Link
//   to="/site-technician/punch-in-punch-out"
//   className="text-white"
// >
//   Punch
// </Link>
//                   </CBadge>
//                 </CCardHeader>
//                 <CCardBody className="p-0">
//                   <div>
//                     {loadingSiteDetails ? (
//                       <div
//                         className="d-flex justify-content-center align-items-center"
//                         style={{ minHeight: "350px" }}
//                       >
//                         <LoadingSpinner />
//                       </div>
//                     ) : (
//                       GoogleMapEmbed(
//                         siteCoordinates.latitude,
//                         siteCoordinates.longitude,
//                       )
//                     )}
//                   </div>
//                 </CCardBody>
//               </CCard>
//             </CCol>

//             {/* Weather Section */}
//             <CCol xs={12} md={5}>
//               <CCard className="h-100 shadow-sm border-0">
//                 <CCardHeader className="fw-bold">
//                   <CRow className="d-flex justify-content-between align-items-center">
//                     <CCol md={5} className="mb-3">
//                       Weather Today{" "}
//                     </CCol>

//                     <CCol md={7} className="m-0">
//                       {loadingSiteIds ? (
//                         "fetching"
//                       ) : siteIds?.length > 0 ? (
//                         <CFormSelect
//                           name="site_id"
//                           value={site_id}
//                           onChange={handleSiteNameChange}
//                         >
//                           {siteIds.map((item) => (
//                             <option key={item.site_id} value={item.site_id}>
//                               {item.site_id}
//                             </option>
//                           ))}
//                         </CFormSelect>
//                       ) : (
//                         <p>No Sites Found</p>
//                       )}
//                     </CCol>
//                   </CRow>
//                 </CCardHeader>
//                 {/* <CCardBody className="d-flex flex-column">
//                   {loadingWeatherData ? (
//                     <div
//                       className="d-flex justify-content-center align-items-center"
//                       style={{ minHeight: "350px" }}
//                     >
//                       <LoadingSpinner />
//                     </div>
//                   ) : errorWeatherData ? (
//                     <div
//                       className="d-flex justify-content-center align-items-center"
//                       style={{ minHeight: "350px" }}
//                     >
//                       <CBadge color="danger">{errorWeatherData}</CBadge>
//                     </div>
//                   ) : (
//                     <>

//                       <p className="">
//                         Last Updated:{" "}
//                        {new Date(weatherData?.createdAt).toLocaleString(
//                           "en-GB",
//                           {
//                             day: "2-digit",
//                             month: "2-digit",
//                             year: "numeric",
//                             hour: "2-digit",
//                             minute: "2-digit",
//                             second: "2-digit",
//                             hour12: true,
//                           }
//                         )}
//                       </p>
//                       <p className="">{weatherData?.siteName}</p>

//                       <CRow className="s">
//                         <CCol xs={6}>
//                           <CCard className="text-center border-0 shadow-sm">
//                             <CCardBody>
//                               <CIcon
//                                 icon={cilSpeedometer}
//                                 className="mb-2 text-danger"
//                                 size="lg"
//                               />
//                               <h5>{weatherData?.temperature}°C</h5>
//                               <div className="text-muted small">Feels Like</div>
//                             </CCardBody>
//                           </CCard>
//                         </CCol>
//                         <CCol xs={6}>
//                           <CCard className="text-center border-0 shadow-sm">
//                             <CCardBody>
//                               <CIcon
//                                 icon={cilCloud}
//                                 className="mb-2 text-primary"
//                                 size="lg"
//                               />
//                               <h5>{weatherData?.cloudiness}%</h5>
//                               <div className="text-muted small">Cloudiness</div>
//                             </CCardBody>
//                           </CCard>
//                         </CCol>
//                         <CCol xs={6}>
//                           <CCard className="text-center border-0 shadow-sm">
//                             <CCardBody>
//                               <CIcon
//                                 icon={cilSpeedometer}
//                                 className="mb-2 text-warning"
//                                 size="lg"
//                               />
//                               <h5>{weatherData?.wind_speed} m/s</h5>
//                               <div className="text-muted small">
//                                 Wind @{" "}
//                                 {new Date(
//                                   weatherData?.createdAt
//                                 ).toLocaleTimeString()}
//                               </div>
//                             </CCardBody>
//                           </CCard>
//                         </CCol>
//                         <CCol xs={6}>
//                           <CCard className="text-center border-0 shadow-sm">
//                             <CCardBody>
//                               <CIcon
//                                 icon={cilBolt}
//                                 className="mb-2 text-success"
//                                 size="lg"
//                               />
//                               <h5>{weatherData?.humidity}%</h5>
//                               <div className="text-muted small">Humidity</div>
//                             </CCardBody>
//                           </CCard>
//                         </CCol>
//                       </CRow>
//                     </>
//                   )}
//                 </CCardBody> */}
//                 <CCardBody className="p-0">
//                   {loadingWeatherData ? (
//                     <div
//                       className="d-flex justify-content-center align-items-center"
//                       style={{ minHeight: 390 }}
//                     >
//                       <LoadingSpinner />
//                     </div>
//                   ) : errorWeatherData ? (
//                     <div
//                       className="d-flex justify-content-center align-items-center"
//                       style={{ minHeight: 390 }}
//                     >
//                       <CBadge color="warning" className="p-2">
//                         {errorWeatherData ===
//                         `Weather data for site: ${site_id} not found`
//                           ? "Please contact Admin to view Data"
//                           : errorWeatherData}
//                       </CBadge>
//                     </div>
//                   ) : (
//                     <Weather
//                       weatherType={weatherType} // "sunny"|"rainy"|"cloudy"|"foggy"
//                       weatherData={weatherData} // full API response object
//                       siteName={weatherData?.siteName}
//                     />
//                   )}
//                 </CCardBody>
//               </CCard>
//             </CCol>
//           </CRow>
//         </div>
//         <div className="mt-4">
//           <CRow className="justify-content-center">
//             <CCol xs={12} md={6} className="mt-4">
//               <CCard className="mb-4 shadow">
//                 <CCardHeader>
//                   <h5 className="text-center">
//                     Total Area Cleaned:{" "}
//                     <span className="text-success fw-bold">
//                       {totalAreaCleaned} m²
//                     </span>
//                   </h5>
//                 </CCardHeader>
//                 <div
//                   className="d-flex justify-content-center align-items-center"
//                   style={{ minHeight: "350px" }}
//                 >
//                   {loadingSiteDetails ? (
//                     <LoadingSpinner />
//                   ) : siteDetailsError ? (
//                     <div
//                       className="d-flex justify-content-center align-items-center"
//                       style={{ minHeight: "350px" }}
//                     >
//                       <CBadge color="warning">{siteDetailsError}</CBadge>
//                     </div>
//                   ) : (
//                     <>
//                       {blockWiseCleaning?.length > 0 ? (
//                         <CChartPie
//                           data={{
//                             labels: blockWiseCleaning.map(
//                               (block) => block.block,
//                             ),
//                             datasets: [
//                               {
//                                 data: blockWiseCleaning.map(
//                                   (block) => block.areaCleaned,
//                                 ),
//                                 backgroundColor: chartColors.slice(
//                                   0,
//                                   blockWiseCleaning.length,
//                                 ),
//                               },
//                             ],
//                           }}
//                           options={{
//                             plugins: {
//                               legend: {
//                                 display: false, // ✅ This hides the legend
//                               },
//                               tooltip: {
//                                 callbacks: {
//                                   label: function (tooltipItem) {
//                                     const block =
//                                       blockWiseCleaning[tooltipItem.dataIndex];
//                                     return ` ${
//                                       block.block || "Unassigned"
//                                     } |  ${block.areaCleaned} m²`;
//                                   },
//                                 },
//                               },
//                             },
//                           }}
//                         />
//                       ) : (
//                         <CBadge color="warning">
//                           No Cleaning Data available
//                         </CBadge>
//                       )}
//                     </>
//                   )}
//                 </div>
//               </CCard>
//             </CCol>

//             <CCol xs={12} md={6} className="mt-4">
//               <CCard className="mb-4 shadow">
//                 <CCardHeader>
//                   <h5 className="text-center">Gateway Details</h5>
//                 </CCardHeader>
//                 <div
//                   className="d-flex justify-content-center align-items-center"
//                   style={{ minHeight: "350px" }}
//                 >
//                   {loadingSiteDetails ? (
//                     <LoadingSpinner />
//                   ) : siteDetailsError ? (
//                     <div
//                       className="d-flex justify-content-center align-items-center"
//                       style={{ minHeight: "350px" }}
//                     >
//                       <CBadge color="warning">{siteDetailsError}</CBadge>
//                     </div>
//                   ) : (
//                     <>
//                       {gateways.length > 0 ? (
//                         <CChartPie
//                           data={{
//                             labels: gateways.map(
//                               (gateway) => gateway.gateway_name,
//                             ),
//                             datasets: [
//                               {
//                                 data: gateways.map(() => 1),
//                                 backgroundColor: gateways.map((gateway) =>
//                                   gateway.gateway_status
//                                     ? "#28a745"
//                                     : "#dc3545",
//                                 ),
//                               },
//                             ],
//                           }}
//                           options={{
//                             plugins: {
//                               legend: {
//                                 display: false, // ✅ This hides the legend
//                               },

//                               tooltip: {
//                                 callbacks: {
//                                   label: function (tooltipItem) {
//                                     const gateway =
//                                       gateways[tooltipItem.dataIndex];
//                                     return `${
//                                       gateway.gateway_status
//                                         ? "Online"
//                                         : "Offline"
//                                     }`;
//                                   },
//                                 },
//                               },
//                             },
//                           }}
//                         />
//                       ) : (
//                         <CBadge color="warning">
//                           No Gateway details available
//                         </CBadge>
//                       )}
//                     </>
//                   )}
//                 </div>
//               </CCard>
//             </CCol>
//           </CRow>
//         </div>
//         <div className="mt-4">
//           <CCard className="mb-4 shadow">
//             <CCardHeader>
//               <h5>Battery Status</h5>{" "}
//             </CCardHeader>
//             <CCardBody className="d-flex justify-content-center align-items-center">
//               {loadingSiteDetails ? (
//                 <LoadingSpinner />
//               ) : siteDetailsError ? (
//                 <div
//                   className="d-flex justify-content-center align-items-center"
//                   style={{ minHeight: "350px" }}
//                 >
//                   {" "}
//                   <CBadge color="warning">{siteDetailsError}</CBadge>
//                 </div>
//               ) : (
//                 <>
//                   {robotsData?.length > 0 ? (
//                     <CChartLine
//                       style={{ height: "300px", width: "100%" }}
//                       data={{
//                         labels: batteryChartData.map((entry) =>
//                           entry.robot.slice(-3),
//                         ),
//                         datasets: [
//                           {
//                             label: "Battery (%)",
//                             data: batteryChartData.map((entry) => entry.value),
//                             borderColor: "#648DB3",
//                             tension: 0.4,
//                           },
//                         ],
//                       }}
//                       options={{
//                         scales: {
//                           y: {
//                             beginAtZero: true,
//                           },
//                         },
//                       }}
//                     />
//                   ) : (
//                     <CBadge color="warning">
//                       No battery logs found for the Robots
//                     </CBadge>
//                   )}
//                 </>
//               )}
//             </CCardBody>
//           </CCard>
//         </div>
//       </div>
//     </>
//   );
// };

// export default SiteTechnicianDashboard;

import axios from "axios";
import { useState, useEffect, useReducer } from "react";
import { useSelector } from "react-redux";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import Weather from "../client-admin/weather/Weather";
import { Link } from "react-router-dom";
import GatewayMap from "../../components/GatewayMap";

/* ══════════════════════════════════════════════
   DESIGN TOKENS
══════════════════════════════════════════════ */
const T = {
  bg: "",
  surface: "#151f38",
  surfaceHi: "#1a2642",
  border: "rgba(99,179,237,.10)",
  borderHi: "rgba(99,179,237,.22)",

  cyan: "#38BDF8",
  cyanDim: "rgba(56,189,248,.12)",
  green: "#34D399",
  greenDim: "rgba(52,211,153,.12)",
  amber: "#FBBF24",
  amberDim: "rgba(251,191,36,.12)",
  red: "#F87171",
  redDim: "rgba(248,113,113,.12)",
  purple: "#A78BFA",

  text: "#E2EAF4",
  textMid: "#94A3B8",
  textDim: "#FFF",

  font: "",
  mono: "",
};

/* ══════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════ */
const fmtNum = (n) => {
  if (!n && n !== 0) return "—";
  const v = Number(n);
  if (v >= 1e6) return (v / 1e6).toFixed(1) + "M";
  if (v >= 1e3) return (v / 1e3).toFixed(1) + "K";
  return v.toFixed(0);
};

const battColor = (v) => (v > 60 ? T.cyan : v > 30 ? T.amber : T.red);

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? "Good Morning" : h < 18 ? "Good Afternoon" : "Good Evening";
};

const wxIcon = (desc = "", rain = false) => {
  if (rain || desc.includes("rain")) return "🌧";
  if (desc.includes("cloud")) return "⛅";
  if (desc.includes("fog")) return "🌫";
  return "☀️";
};

/* ══════════════════════════════════════════════
   GLOBAL CSS
══════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body, #root {
  background: ${T.bg};
  font-family: ${T.font};
  color: ${T.text};
  -webkit-font-smoothing: antialiased;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
@keyframes shimmer {
  0%   { background-position: -600px 0; }
  100% { background-position: 600px 0; }
}
@keyframes pulseDot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: .55; transform: scale(1.4); }
}

.skeleton {
  background: linear-gradient(90deg, ${T.surface} 25%, ${T.surfaceHi} 50%, ${T.surface} 75%);
  background-size: 800px 100%;
  animation: shimmer 1.6s ease infinite;
  border-radius: 8px;
}

.site-sel {
  background: ${T.surfaceHi};
  border: 1px solid ${T.border};
  border-radius: 8px;
  color: ${T.text};
  padding: 7px 30px 7px 12px;
  font-family: ${T.font};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  outline: none;
  transition: border-color .2s, background .2s;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-color: ${T.surfaceHi};
}
.site-sel:hover, .site-sel:focus { border-color: ${T.borderHi}; }
.site-sel option { background: #1a2642; color: ${T.text}; }

::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: ${T.borderHi}; }

.status-badge {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 11px; font-weight: 500;
  padding: 3px 8px; border-radius: 20px; letter-spacing: .2px;
}

.pulse-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: ${T.green};
  animation: pulseDot 2s ease infinite;
  display: inline-block;
}

.card-glow {
  transition: border-color .25s, box-shadow .25s;
}
.card-glow:hover {
  border-color: ${T.borderHi} !important;
  box-shadow: 0 0 0 1px rgba(56,189,248,.05), 0 8px 32px rgba(0,0,0,.22);
}

.recharts-tooltip-wrapper { outline: none; }
`;

/* ══════════════════════════════════════════════
   PRIMITIVE COMPONENTS
══════════════════════════════════════════════ */
const Card = ({ children, style = {}, delay = 0, className = "" }) => (
  <div
    className={`card-glow ${className}`}
    style={{
      background: T.surface,
      border: `1px solid ${T.border}`,
      borderRadius: 14,
      overflow: "hidden",
      animation: `fadeUp .4s ease ${delay}ms both`,
      ...style,
    }}
  >
    {children}
  </div>
);

const CardHead = ({ icon, title, badge, badgeColor = T.cyan, right }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "13px 18px",
      borderBottom: `1px solid ${T.border}`,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
      {icon && (
        <span
          style={{
            fontSize: 13,
            width: 28,
            height: 28,
            borderRadius: 7,
            background: T.cyanDim,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </span>
      )}
      <span
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: T.text,
          letterSpacing: ".1px",
        }}
      >
        {title}
      </span>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {badge && (
        <span
          style={{
            fontSize: 11,
            fontWeight: 500,
            padding: "3px 9px",
            borderRadius: 20,
            background: badgeColor === T.green ? T.greenDim : T.cyanDim,
            color: badgeColor,
            border: `1px solid ${badgeColor === T.green ? "rgba(52,211,153,.22)" : "rgba(56,189,248,.22)"}`,
            // fontFamily: T.mono,
            letterSpacing: ".3px",
          }}
        >
          {badge}
        </span>
      )}
      {right}
    </div>
  </div>
);

const Skel = ({ h = 16, w = "100%", r = 6, style = {} }) => (
  <div
    className="skeleton"
    style={{ height: h, width: w, borderRadius: r, flexShrink: 0, ...style }}
  />
);

const CardSkeleton = ({ height = 300 }) => (
  <div
    style={{
      background: T.surface,
      border: `1px solid ${T.border}`,
      borderRadius: 14,
      overflow: "hidden",
      height,
      padding: "13px 18px",
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 14,
      }}
    >
      <Skel h={13} w={130} />
      <Skel h={13} w={72} r={20} />
    </div>
    <Skel h={height - 72} r={8} />
  </div>
);

const KpiSkeleton = () => (
  <div
    style={{
      background: T.surface,
      border: `1px solid ${T.border}`,
      borderRadius: 12,
      padding: "14px 16px",
    }}
  >
    <Skel h={9} w={90} style={{ marginBottom: 14 }} />
    <div style={{ display: "flex", gap: 8 }}>
      <Skel h={52} style={{ flex: 1, borderRadius: 8 }} />
      <Skel h={52} style={{ flex: 1, borderRadius: 8 }} />
      <Skel h={52} style={{ flex: 1, borderRadius: 8 }} />
    </div>
  </div>
);

/* ══════════════════════════════════════════════
   TOOLTIPS
══════════════════════════════════════════════ */
const Tip = ({ children }) => (
  <div
    style={{
      background: "#0C1426",
      border: `1px solid ${T.borderHi}`,
      borderRadius: 10,
      padding: "9px 13px",
      fontSize: 12,
      color: T.text,
      boxShadow: "0 8px 32px rgba(0,0,0,.55)",
      lineHeight: 1.6,
    }}
  >
    {children}
  </div>
);

const PieTip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <Tip>
      <div style={{ fontWeight: 600 }}>{payload[0].name}</div>
      <div
        style={{
          color: T.cyan,
          // fontFamily: T.mono
        }}
      >
        {Number(payload[0].value).toLocaleString()} m²
      </div>
    </Tip>
  );
};
const GwTip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const g = payload[0]?.payload;
  return (
    <Tip>
      <div style={{ fontWeight: 600 }}>{g?.gateway_name}</div>
      <div style={{ color: g?.gateway_status ? T.green : T.red }}>
        {g?.gateway_status ? "● Online" : "○ Offline"}
      </div>
      {g?.battery_voltage && (
        <div
          style={{
            color: T.textMid,
            // fontFamily: T.mono
          }}
        >
          Battery {g.battery_voltage}%
        </div>
      )}
    </Tip>
  );
};
const BatTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const v = payload[0].value;
  return (
    <Tip>
      <div style={{ fontWeight: 600 }}>{label}</div>
      <div
        style={{
          color: battColor(v),
          //  fontFamily: T.mono
        }}
      >
        {v}%
      </div>
    </Tip>
  );
};

/* ══════════════════════════════════════════════
   REDUCER
══════════════════════════════════════════════ */
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_SITEID_REQUEST":
      return { ...state, loadingSiteIds: true };
    case "FETCH_SITEID_SUCCESS":
      return { ...state, loadingSiteIds: false, siteIds: action.payload };
    case "FETCH_SITEID_FAIL":
      return { ...state, loadingSiteIds: false, errorSiteIds: action.payload };
    case "FETCH_SITE_DETAILS_REQUEST":
      return { ...state, loadingSiteDetails: true };
    case "FETCH_SITE_DETAILS_SUCCESS":
      return {
        ...state,
        loadingSiteDetails: false,
        siteDetails: action.payload,
      };
    case "FETCH_SITE_DETAILS_FAIL":
      return {
        ...state,
        loadingSiteDetails: false,
        siteDetailsError: action.payload,
      };
    // case "FETCH_WEATHER_REQUEST":
    //   return { ...state, loadingWeatherData: true };
    // case "FETCH_WEATHER_SUCCESS":
    //   return {
    //     ...state,
    //     loadingWeatherData: false,
    //     weatherData: action.payload,
    //   };
    // case "FETCH_WEATHER_FAIL":
    //   return {
    //     ...state,
    //     loadingWeatherData: false,
    //     errorWeatherData: action.payload,
    //   };
    default:
      return state;
  }
};

/* ══════════════════════════════════════════════
   MAIN DASHBOARD
══════════════════════════════════════════════ */
export default function SiteTechnicianDashboard() {
  const authtoken = useSelector((s) => s.authtoken);
  const userInfo = useSelector((s) => s.userInfo);

  const [state, dispatch] = useReducer(reducer, {
    siteIds: [],
    siteDetails: {},
    // weatherData: {},
    loadingSiteIds: false,
    loadingSiteDetails: false,
    // loadingWeatherData: true,
    errorSiteIds: "",
    siteDetailsError: "",
    // errorWeatherData: "",
  });

  const {
    siteIds,
    siteDetails,
    // weatherData,
    loadingSiteIds,
    loadingSiteDetails,
    // loadingWeatherData,
    siteDetailsError,
    // errorWeatherData,
  } = state;

  const [site_id, setSiteid] = useState(
    userInfo.assigned_sites[0]?.site_id || "",
  );
  const [blockWiseCleaning, setBlocks] = useState([]);
  const [cleaning, setCleaning] = useState({
    completed: 0,
    inprogress: 0,
    failure: 0,
  });
  const [gateways, setGateways] = useState([]);
  const [robotsData, setRobots] = useState([]);
  const [siteCoords, setSiteCoords] = useState({});
  const [weatherData, setWeatherData] = useState({});
  const [mapLoaded, setMapLoaded] = useState(false);
  const isMobile = window.innerWidth < 768;

  const [showMapModal, setShowMapModal] = useState(false);
  const fetchSiteDetails = async () => {
    dispatch({ type: "FETCH_SITE_DETAILS_REQUEST" });
    try {
      const { data } = await axios.get(
        `/api/v1/sites-coordinates/site-details/${site_id}`,
        { headers: { Authorization: `Bearer ${authtoken}` } },
      );
      const d = data.data;
      dispatch({ type: "FETCH_SITE_DETAILS_SUCCESS", payload: d });
      setSiteCoords(d.coordinates);
      setRobots(d.robots);
      setGateways(d.gateways);
      setBlocks(d.blockWiseCleaning);
      setWeatherData(d.weather);
      setCleaning(d.cleaning || { completed: 0, inprogress: 0, failure: 0 });
    } catch (e) {
      dispatch({
        type: "FETCH_SITE_DETAILS_FAIL",
        payload: e.response?.data?.message || e.message,
      });
    }
  };

  useEffect(() => {
    const fetchSiteIds = async () => {
      dispatch({ type: "FETCH_SITEID_REQUEST" });
      try {
        const { data } = await axios.get(`/api/v1/sites`, {
          headers: { Authorization: `Bearer ${authtoken}` },
        });
        dispatch({ type: "FETCH_SITEID_SUCCESS", payload: data.data });
      } catch (e) {
        dispatch({
          type: "FETCH_SITEID_FAIL",
          payload: e.response?.data?.error || e.message,
        });
      }
    };
    fetchSiteIds();
  }, [authtoken]);

  // const fetchWeather = async () => {
  //   dispatch({ type: "FETCH_WEATHER_REQUEST" });
  //   try {
  //     const { data } = await axios.get(
  //       `/api/v1/weatherdata/client/${site_id}`,
  //       {
  //         headers: { Authorization: `Bearer ${authtoken}` },
  //       },
  //     );
  //     dispatch({ type: "FETCH_WEATHER_SUCCESS", payload: data.data });
  //   } catch (e) {
  //     dispatch({
  //       type: "FETCH_WEATHER_FAIL",
  //       payload: e.response?.data?.message || e.message,
  //     });
  //   }
  // };

  useEffect(() => {
    fetchSiteDetails();
    // fetchWeather();

    setMapLoaded(false);
  }, [authtoken, site_id]);

  /* derived */
  const totalArea = blockWiseCleaning.reduce((s, b) => s + b.areaCleaned, 0);
  const onlineGw = gateways.filter((g) => g.gateway_status).length;
  const totalRobots = robotsData.length;
  const onlineRobs = robotsData.filter((r) => r.lora_state === 1).length;
  const offlineRobs = robotsData.filter((r) => r.lora_state === 0).length;
  // const mapSrc = `https://maps.google.com/maps?hl=en&q=${siteCoords.latitude},${siteCoords.longitude}&t=k&z=18&ie=UTF8&iwloc=B&output=embed`;

  const isLoading = loadingSiteDetails;

  const getWeatherType = () => {
    const cloudiness = weatherData && weatherData?.cloudiness;
    const cloudy = weatherData && weatherData?.description?.includes("cloud");

    const rainy = weatherData && weatherData?.is_rain;

    if (rainy) return "rainy";
    if (cloudy || cloudiness > 70) return "cloudy";
    if (weatherData?.humidity > 60 && cloudiness > 40 && !rainy) return "foggy";
    return "sunny";
  };

  const weatherType = getWeatherType();

  return (
    <>
      <style>{CSS}</style>
      <div
        className=""
        style={{
          background: T.bg,
          minHeight: "100vh",
          //  fontFamily: T.font
        }}
      >
        {/* ══ TOP BAR ══ */}
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 200,
            display: "flex",
            flexDirection: isMobile ? "column" : "row", // ✅ KEY
            alignItems: isMobile ? "center" : "center",
            justifyContent: isMobile ? "center" : "space-between",
            padding: "8px 12px", // ✅ flexible padding
            minHeight: 50, // ❌ remove fixed height
            backdropFilter: "blur(20px)",
            borderBottom: `1px solid ${T.border}`,
            rowGap: 6, // ✅ spacing when wrapped
          }}
        >
          <div
            style={{
              // display: "flex",
              // alignItems: "center",
              // flex: "1 1 200px", // ✅ responsive grow/shrink
              // minWidth: 0, // ✅ prevents overflow
              display: "flex",
              alignItems: "center",
              justifyContent: isMobile ? "center" : "flex-start", // ✅ center
              width: "100%",
              textAlign: isMobile ? "center" : "left", // ✅ important
            }}
          >
            <div
              style={{
                fontSize: 13,
                color: T.textMid,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis", // ✅ truncate long username
              }}
            >
              Hello,&nbsp;
              <strong style={{ color: T.text, fontWeight: 600 }}>
                {userInfo.username}
              </strong>
              &nbsp;—&nbsp;
              <span style={{ color: T.cyan }}>{greeting()}</span>
            </div>
          </div>
          <div
            style={{
              // display: "flex",
              // alignItems: "center",

              // gap: 8,
              // flex: "1 1 200px",
              // justifyContent: "flex-end",
              // flexWrap: "wrap", // ✅ wrap on mobile
              display: "flex",
              alignItems: "center",
              justifyContent: isMobile ? "center" : "flex-end", // ✅ center
              gap: 8,
              flexWrap: "wrap",
              width: isMobile ? "100%" : "auto", // ✅ full width for centering
            }}
          >
            {/* <span
              style={{
                fontSize: 11,
                color: T.textDim,
                textTransform: "uppercase",
                letterSpacing: ".8px",
              }}
            >
              Site
            </span> */}
            <Link
              to="/site-technician/punch-in-punch-out"
              style={{
                padding: "6px 12px",
                borderRadius: 8,
                background: "#6366F1",
                color: "#fff",
                fontSize: 12,
                textDecoration: "none",
              }}
            >
              Punch
            </Link>
            {loadingSiteIds ? (
              <Skel h={32} w={120} r={8} />
            ) : (
              <select
                className="site-sel"
                style={{
                  maxWidth: isMobile ? "140px" : "180px", // ✅ prevent overflow
                }}
                value={site_id}
                onChange={(e) => setSiteid(e.target.value)}
              >
                {siteIds.map((s) => (
                  <option key={s.site_id} value={s.site_id}>
                    {s.site_id}
                  </option>
                ))}
              </select>
            )}
            <button
              onClick={fetchSiteDetails}
              disabled={loadingSiteDetails}
              style={{
                background: T.cyanDim,
                border: `1px solid ${T.border}`,
                color: T.cyan,
                borderRadius: 8,
                padding: "6px 10px",
                fontSize: 12,
                display: "flex",
                alignItems: "center",
                gap: 6,
                whiteSpace: "nowrap", // ✅ prevents breaking
                opacity: loadingSiteDetails ? 0.6 : 1,
                cursor: loadingSiteDetails ? "not-allowed" : "pointer",
              }}
            >
              {loadingSiteDetails ? "Refreshing..." : "🔄 Refresh"}
            </button>
          </div>
        </header>

        {/* ══ MAIN CONTENT ══ */}
        <main
          style={{
            padding: "16px 16px 32px",
            maxWidth: 1800,
            margin: "0 auto",
          }}
        >
          {/* KPI STRIP */}
          <section
            style={{
              display: "grid",
              // gridTemplateColumns: "repeat(4, 1fr)",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 11,
              marginBottom: 14,
            }}
          >
            {isLoading ? (
              Array(4)
                .fill(0)
                .map((_, i) => <KpiSkeleton key={i} />)
            ) : (
              <>
                <KpiCard
                  label="Robots"
                  icon="🤖"
                  delay={80}
                  right={
                    <Link
                      to={`/site-technician/site-management/block-management/${site_id}`}
                      style={{
                        fontSize: 11,
                        color: T.cyan,
                        textDecoration: "none",
                        padding: "2px 6px",
                        borderRadius: 6,
                        border: `1px solid ${T.border}`,
                        background: T.cyanDim,
                        whiteSpace: "nowrap",
                      }}
                    >
                      blockwise →
                    </Link>
                  }
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      gap: 7,
                      marginTop: 9,
                    }}
                  >
                    <MiniStat
                      label="Total"
                      value={totalRobots}
                      color={T.cyan}
                    />
                    <MiniStat
                      label="Online"
                      value={onlineRobs}
                      color={T.green}
                    />
                    <MiniStat
                      label="Offline"
                      value={offlineRobs}
                      color={T.red}
                    />
                  </div>
                </KpiCard>

                <KpiCard
                  label="Today's Cleaning"
                  icon="🧹"
                  delay={0}
                  right={
                    <Link
                      to={`/site-technician/cleaning-log-sites/${site_id}`}
                      style={{
                        fontSize: 11,
                        color: T.cyan,
                        textDecoration: "none",
                        padding: "2px 6px",
                        borderRadius: 6,
                        border: `1px solid ${T.border}`,
                        background: T.cyanDim,
                        whiteSpace: "nowrap",
                      }}
                    >
                      Log →
                    </Link>
                  }
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      gap: 7,
                      marginTop: 9,
                    }}
                  >
                    <MiniStat
                      label="Completed"
                      value={cleaning.completed}
                      color={T.green}
                    />
                    <MiniStat
                      label="Running"
                      value={cleaning.inprogress}
                      color={T.amber}
                    />
                    <MiniStat
                      label="Failed"
                      value={cleaning.failure}
                      color={T.red}
                    />
                  </div>
                </KpiCard>
                <KpiCard
                  label="Gateways"
                  icon="📡"
                  delay={160}
                  accent={onlineGw === gateways.length ? T.green : T.amber}
                >
                  <div style={{ marginTop: 9 }}>
                    {gateways.length === 1 ? (
                      // ✅ SINGLE GATEWAY VIEW
                      <div
                        style={{
                          fontSize: 22,
                          fontWeight: 700,
                          color: onlineGw === 1 ? T.green : T.red,
                        }}
                      >
                        {onlineGw === 1 ? "Online" : "Offline"}
                      </div>
                    ) : (
                      // ✅ MULTIPLE GATEWAYS VIEW (your existing UI)
                      <>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "baseline",
                            gap: 5,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 30,
                              fontWeight: 700,
                              color:
                                onlineGw === gateways.length
                                  ? T.green
                                  : T.amber,
                              lineHeight: 1,
                            }}
                          >
                            {onlineGw}
                          </span>
                          <span style={{ fontSize: 14, color: T.textMid }}>
                            / {gateways.length} online
                          </span>
                        </div>

                        <div
                          style={{
                            marginTop: 8,
                            height: 4,
                            borderRadius: 4,
                            background: T.surfaceHi,
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              borderRadius: 4,
                              width:
                                gateways.length > 0
                                  ? `${(onlineGw / gateways.length) * 100}%`
                                  : "0%",
                              background:
                                onlineGw === gateways.length
                                  ? T.green
                                  : T.amber,
                              transition: "width .7s ease",
                            }}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </KpiCard>

                <KpiCard
                  label="Weather"
                  icon={wxIcon(weatherData.description, weatherData.is_rain)}
                  delay={240}
                >
                  <div style={{ marginTop: 6 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: 4,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 34,
                          fontWeight: 700,
                          // fontFamily: T.mono,
                          color: T.text,
                          lineHeight: 1,
                        }}
                      >
                        {weatherData.temperature ?? "—"}
                      </span>
                      <span style={{ fontSize: 17, color: T.textMid }}>°C</span>
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: T.textMid,
                        marginTop: 4,
                        textTransform: "capitalize",
                      }}
                    >
                      {weatherData.description || "—"}
                    </div>
                    {weatherData.feelsLike && (
                      <div
                        style={{ fontSize: 11, color: T.textDim, marginTop: 2 }}
                      >
                        Feels like {weatherData.feelsLike}°C
                      </div>
                    )}
                  </div>
                </KpiCard>
              </>
            )}
          </section>

          {/* MAP + WEATHER */}
          <section
            style={{
              display: "grid",
              // gridTemplateColumns: "1fr 1fr",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 13,
              marginBottom: 13,
            }}
          >
            {loadingSiteDetails ? (
              <CardSkeleton height={416} />
            ) : (
              <Card delay={200}>
                <CardHead
                  icon="📍"
                  title="Gateway Coverage"
                  badge={site_id}
                  right={
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => setShowMapModal(true)}
                        style={{
                          fontSize: 11,
                          padding: "5px 10px",
                          borderRadius: 6,
                          border: "1px solid rgba(56,189,248,.3)",
                          background: "rgba(56,189,248,.1)",
                          color: "#38BDF8",
                          cursor: "pointer",
                        }}
                      >
                        ⛶ Fullscreen
                      </button>
                    </div>
                  }
                />

                <GatewayMap
                  gateways={gateways}
                  authtoken={authtoken}
                  site_id={site_id}
                  T={T} // your existing token object
                  height={360} // optional, defaults to 360
                  radiusKm={1.5} // optional, defaults to 2
                />
              </Card>
            )}

            {loadingSiteDetails ? (
              <CardSkeleton height={416} />
            ) : (
              <Weather
                siteDetailsError={siteDetailsError}
                weatherType={weatherType} // "sunny"|"rainy"|"cloudy"|"foggy"
                weatherData={weatherData} // full API response object
                siteName={weatherData?.siteName}
                logo={siteDetails.logo}
              />
            )}
          </section>

          {/* CHARTS ROW */}
          <section
            style={{
              display: "grid",
              // gridTemplateColumns: "1fr 1fr",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 13,
              marginBottom: 13,
            }}
          >
            {loadingSiteDetails ? (
              <CardSkeleton height={265} />
            ) : (
              <Card delay={350}>
                <CardHead
                  icon="🧽"
                  title="Area Cleaned by Block"
                  badge={`${fmtNum(totalArea)} m²`}
                />
                <div style={{ padding: "16px 18px" }}>
                  {blockWiseCleaning.length === 0 ? (
                    <EmptyState label="No cleaning data available" />
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 14,
                      }}
                    >
                      <ResponsiveContainer width={170} height={175}>
                        <PieChart>
                          <Pie
                            data={blockWiseCleaning}
                            cx="50%"
                            cy="50%"
                            innerRadius={48}
                            outerRadius={78}
                            dataKey="areaCleaned"
                            nameKey="block"
                            paddingAngle={3}
                            strokeWidth={0}
                          >
                            {blockWiseCleaning.map((_, i) => (
                              <Cell
                                key={i}
                                fill={
                                  [
                                    T.cyan,
                                    T.green,
                                    T.purple,
                                    T.amber,
                                    "#FF6B35",
                                  ][i % 5]
                                }
                              />
                            ))}
                          </Pie>
                          <Tooltip content={<PieTip />} />
                        </PieChart>
                      </ResponsiveContainer>
                      {/* <div
                        style={{
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          gap: 7,
                        }}
                      >
                        {blockWiseCleaning.map((b, i) => (
                          <div
                            key={i}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            <span
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: 2,
                                flexShrink: 0,
                                background: [
                                  T.cyan,
                                  T.green,
                                  T.purple,
                                  T.amber,
                                  "#FF6B35",
                                ][i % 5],
                              }}
                            />
                            <span
                              style={{
                                flex: 1,
                                fontSize: 12,
                                color: T.textMid,
                              }}
                            >
                              {b.block}
                            </span>
                            <span
                              style={{
                                fontSize: 11,
                                // fontFamily: T.mono,
                                color: T.text,
                              }}
                            >
                              {fmtNum(b.areaCleaned)} m²
                            </span>
                          </div>
                        ))}
                      </div> */}
                    </div>
                  )}
                </div>
              </Card>
            )}

            {loadingSiteDetails ? (
              <CardSkeleton height={265} />
            ) : (
              <Card delay={420}>
                <CardHead
                  icon="📡"
                  title="Gateway Status"
                  badge={`${onlineGw}/${gateways.length} online`}
                  badgeColor={onlineGw === gateways.length ? T.green : T.amber}
                />
                <div style={{ padding: "16px 18px" }}>
                  {gateways.length === 0 ? (
                    <EmptyState label="No gateways found" />
                  ) : (
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 14 }}
                    >
                      <ResponsiveContainer width={150} height={155}>
                        <PieChart>
                          <Pie
                            data={gateways}
                            cx="50%"
                            cy="50%"
                            innerRadius={44}
                            outerRadius={68}
                            dataKey={() => 1}
                            nameKey="gateway_name"
                            paddingAngle={4}
                            strokeWidth={0}
                          >
                            {gateways.map((g, i) => (
                              <Cell
                                key={i}
                                fill={g.gateway_status ? T.green : T.red}
                              />
                            ))}
                          </Pie>
                          <Tooltip content={<GwTip />} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div
                        style={{
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          gap: 6,
                        }}
                      >
                        {gateways.map((g, i) => (
                          <div
                            key={i}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              background: T.surfaceHi,
                              border: `1px solid ${T.border}`,
                              borderRadius: 8,
                              padding: "7px 10px",
                            }}
                          >
                            <span
                              style={{
                                width: 7,
                                height: 7,
                                borderRadius: "50%",
                                flexShrink: 0,
                                background: g.gateway_status ? T.green : T.red,
                                boxShadow: `0 0 5px ${g.gateway_status ? T.green : T.red}`,
                              }}
                            />
                            <span
                              style={{ flex: 1, fontSize: 12, color: T.text }}
                            >
                              {g.gateway_name}
                            </span>
                            <span
                              className="status-badge"
                              style={{
                                background: g.gateway_status
                                  ? T.greenDim
                                  : T.redDim,
                                color: g.gateway_status ? T.green : T.red,
                                border: `1px solid ${g.gateway_status ? "rgba(52,211,153,.2)" : "rgba(248,113,113,.2)"}`,
                              }}
                            >
                              {g.gateway_status ? "online" : "offline"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </section>

          {/* BATTERY CHART */}
          {loadingSiteDetails ? (
            <CardSkeleton height={265} />
          ) : (
            <Card delay={500}>
              <CardHead
                icon="🔋"
                title="Robot Battery Status"
                badge={`${robotsData.length} robots`}
              />
              <div style={{ padding: "14px 18px 20px" }}>
                {robotsData.length === 0 ? (
                  <EmptyState label="No robot battery data" />
                ) : (
                  <>
                    <ResponsiveContainer width="100%" height={210}>
                      <BarChart
                        data={robotsData.map((r) => ({
                          name: r.robot_no,
                          battery: parseInt(r.battery_voltage) || 0,
                        }))}
                        barSize={22}
                        margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="rgba(99,179,237,.06)"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="name"
                          tick={{
                            fill: T.textMid,
                            fontSize: 11,
                            // fontFamily: T.mono,
                          }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          domain={[0, 100]}
                          tick={{
                            fill: T.textDim,
                            fontSize: 11,
                            // fontFamily: T.mono,
                          }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip
                          content={<BatTip />}
                          cursor={{ fill: "rgba(56,189,248,.04)", radius: 4 }}
                        />
                        <Bar dataKey="battery" radius={[5, 5, 0, 0]}>
                          {robotsData.map((r, i) => (
                            <Cell
                              key={i}
                              fill={battColor(parseInt(r.battery_voltage) || 0)}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>

                    <div
                      style={{
                        display: "flex",
                        gap: 20,
                        justifyContent: "center",
                        marginTop: 12,
                        paddingTop: 12,
                        borderTop: `1px solid ${T.border}`,
                      }}
                    >
                      {[
                        { color: T.cyan, label: "High  > 60%" },
                        { color: T.amber, label: "Medium  30–60%" },
                        { color: T.red, label: "Low  < 30%" },
                      ].map((l, i) => (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            fontSize: 11,
                            color: T.textMid,
                          }}
                        >
                          <span
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: 2,
                              background: l.color,
                              flexShrink: 0,
                            }}
                          />
                          {l.label}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </Card>
          )}
        </main>
      </div>

      {showMapModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.85)",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* HEADER */}
          <div
            style={{
              height: 50,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 16px",
              borderBottom: `1px solid ${T.border}`,
              background: "#0f172a",
            }}
          >
            <span style={{ fontSize: 13, color: T.text }}>
              📍 Full Map View — {site_id}
            </span>

            <button
              onClick={() => setShowMapModal(false)}
              style={{
                fontSize: 12,
                padding: "6px 12px",
                borderRadius: 6,
                border: "1px solid #ff4d4d",
                background: "rgba(255,77,77,.1)",
                color: "#ff4d4d",
                cursor: "pointer",
              }}
            >
              ✕ Close
            </button>
          </div>

          {/* FULLSCREEN MAP */}
          <div style={{ flex: 1 }}>
            <GatewayMap
              gateways={gateways}
              authtoken={authtoken}
              site_id={site_id}
              T={T}
              height={"100%"} // 🔥 important
              radiusKm={1.5}
            />
          </div>
        </div>
      )}
    </>
  );
}

/* ══════════════════════════════════════════════
   UTILITY COMPONENTS
══════════════════════════════════════════════ */
// function KpiCard({ label, icon, children, delay = 0, accent = T.cyan }) {
//   return (
//     <div
//       className="card-glow"
//       style={{
//         background: T.surface,
//         border: `1px solid ${T.border}`,
//         borderRadius: 12,
//         padding: "13px 15px",
//         position: "relative",
//         overflow: "hidden",
//         animation: `fadeUp .4s ease ${delay}ms both`,
//         cursor: "default",
//       }}
//     >
//       <div
//         style={{
//           position: "absolute",
//           top: 0,
//           left: "12%",
//           right: "12%",
//           height: 1,
//           background: `linear-gradient(90deg, transparent, ${accent}55, transparent)`,
//         }}
//       />
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           gap: 6,
//           fontSize: 10,
//           color: T.textDim,
//           textTransform: "uppercase",
//           letterSpacing: ".85px",
//           marginBottom: 2,
//         }}
//       >
//         <span style={{ fontSize: 12 }}>{icon}</span>
//         {label}
//       </div>
//       {children}
//     </div>
//   );
// }
function KpiCard({ label, icon, children, delay = 0, accent = T.cyan, right }) {
  return (
    <div
      className="card-glow"
      style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 12,
        padding: "13px 15px",
        position: "relative",
        overflow: "hidden",
        animation: `fadeUp .4s ease ${delay}ms both`,
      }}
    >
      {/* top glow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "12%",
          right: "12%",
          height: 1,
          background: `linear-gradient(90deg, transparent, ${accent}55, transparent)`,
        }}
      />

      {/* HEADER ROW */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between", // ✅ key
          marginBottom: 6,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 10,
            color: T.textDim,
            textTransform: "uppercase",
            letterSpacing: ".85px",
          }}
        >
          <span style={{ fontSize: 12 }}>{icon}</span>
          {label}
        </div>

        {right}
      </div>

      {children}
    </div>
  );
}
function MiniStat({ label, value, color }) {
  return (
    <div
      style={{
        background: T.surfaceHi,
        border: `1px solid ${color}2A`,
        borderRadius: 8,
        padding: "8px 6px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: 9,
          color,
          textTransform: "uppercase",
          letterSpacing: ".6px",
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 22,
          fontWeight: 700,
          color,
          // fontFamily: T.mono,
          lineHeight: 1,
        }}
      >
        {value ?? 0}
      </div>
    </div>
  );
}

function EmptyState({ label }) {
  return (
    <div
      style={{
        minHeight: 130,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 12,
        color: T.textDim,
        border: `1px dashed ${T.border}`,
        borderRadius: 10,
      }}
    >
      {label}
    </div>
  );
}

function ErrorState({ message }) {
  return (
    <div
      style={{
        minHeight: 120,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px 20px",
        fontSize: 12,
        color: T.amber,
        background: T.amberDim,
        borderRadius: 10,
        margin: 16,
        border: `1px solid rgba(251,191,36,.15)`,
        textAlign: "center",
      }}
    >
      ⚠️ &nbsp;{message}
    </div>
  );
}
