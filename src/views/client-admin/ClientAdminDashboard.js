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
// import { useSelector } from "react-redux";
// import LoadingSpinner from "../../components/LoadingSpinner";
// import { CChartBar, CChartPie } from "@coreui/react-chartjs";
// import "./GoogleMapEmbed.css";
// // import CIcon from "@coreui/icons-react";
// // import { cilBolt, cilCloud, cilSpeedometer } from "@coreui/icons";
// import Weather from "./weather/Weather";

// const chartColors = [
//   "#052638",
//   "#4e73df",
//   "#FFC107",
//   "#17A2B8",
//   "#DC3545",
//   "#6C757D",
//   "#8E44AD",
//   "#3498DB",
//   "#E74C3C",
//   "#2ECC71",
//   "#F39C12",
//   "#D35400",
//   "#C0392B",
//   "#27AE60",
//   "#16A085",
//   "#2980B9",
//   "#2C3E50",
//   "#1ABC9C",
//   "#34495E",
//   "#95A5A6",
// ];

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
//       return { ...state, loadingSiteIds: false, errorSiteIds: action.payload };

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

// const ClientAdminDashboard = () => {
// const authtoken = useSelector((state) => state.authtoken);
// const userInfo = useSelector((state) => state.userInfo);
// const [
//   {
//     siteDetailsError,
//     loadingSiteDetails,
//     loadingSiteIds,
//     siteIds,
//     weatherData,
//     loadingWeatherData,
//     errorWeatherData,
//     errorSiteIds,
//   },
//   dispatch,
// ] = useReducer(reducer, {
//   siteDetailsError: "",
//   loadingSiteDetails: false,
//   siteDetails: {},
//   weatherData: {},
//   siteIds: [],
//   loadingSiteIds: false,
//   loadingWeatherData: true,
//   errorSiteIds: "",
//   errorWeatherData: "",
// });

// const [site_id, setSiteid] = useState(
//   userInfo.assigned_sites[0]?.site_id || "abc",
// );
// const [blockWiseCleaning, setBlockWiseCleaning] = useState([]);
// const [gateways, setGateways] = useState([]);
// const [robotsData, setRobotsData] = useState([]);
// const [siteCoordinates, setSiteCoordinates] = useState({});
// const [totalAreaCleaned, setTotalAreaCleaned] = useState(0);
// const [isLoaded, setIsLoaded] = useState(false);
// const [logo, setLogo] = useState("");
// const fetchSiteIds = async () => {
//   dispatch({ type: "FETCH_SITEID_REQUEST" });
//   try {
//     const result = await axios.get(`/api/v1/sites`, {
//       headers: { Authorization: `Bearer ${authtoken}` },
//     });
//     dispatch({
//       type: "FETCH_SITEID_SUCCESS",
//       payload: result.data.data,
//     });
//   } catch (error) {
//     dispatch({
//       type: "FETCH_SITEID_FAIL",
//       payload: error.response?.data?.error || error.response?.data?.message,
//     });
//   }
// };

// useEffect(() => {
//   const fetchSiteDetails = async () => {
//     dispatch({ type: "FETCH_SITE_DETAILS_REQUEST" });
//     try {
//       const response = await axios.get(
//         `/api/v1/sites-coordinates/site-details/${site_id}`,
//         {
//           headers: { Authorization: `Bearer ${authtoken}` },
//         },
//       );

//       dispatch({
//         type: "FETCH_SITE_DETAILS_SUCCESS",
//         payload: response.data.data,
//       });
//       setSiteCoordinates(response.data.data.coordinates);
//       setTotalAreaCleaned(response.data.data.totalAreaCleaned);
//       setRobotsData(response.data.data.robots);
//       setGateways(response.data.data.gateways);
//       setBlockWiseCleaning(response.data.data.blockWiseCleaning);
//       setLogo(response.data.data.logo);
//     } catch (error) {
//       dispatch({
//         type: "FETCH_SITE_DETAILS_FAIL",
//         payload: error.response?.data?.message || error.response?.data?.error,
//       });
//       // toast.error(error.response?.data?.message || error.message);
//     }
//   };

//   const fetchWeatherData = async () => {
//     dispatch({ type: "FETCH_WEATHER_REQUEST" });
//     try {
//       const response = await axios.get(
//         `/api/v1/weatherdata/client/${site_id}`,
//         {
//           headers: { Authorization: `Bearer ${authtoken}` },
//         },
//       );
//       dispatch({
//         type: "FETCH_WEATHER_SUCCESS",
//         payload: response.data.data,
//       });
//     } catch (error) {
//       dispatch({
//         type: "FETCH_WEATHER_FAIL",
//         payload: error.response?.data?.message || error.response?.data?.error,
//       });
//       // toast.error(
//       //   error.response?.data?.message || error.response?.data?.error
//       // );
//     }
//   };

//   fetchSiteDetails();
//   fetchWeatherData();
//   fetchSiteIds();
// }, [authtoken, site_id]);

// const handleSiteNameChange = (e) => {
//   dispatch({ type: "SELECT_SITENAME_REQUEST" });

//   const selectedSiteName = e.target.value;

//   const selectedSite = siteIds.find(
//     (site) => site.site_id === selectedSiteName,
//   );

//   if (selectedSite) {
//     setSiteid(selectedSite.site_id);

//     dispatch({
//       type: "SELECT_SITENAME_SUCCESS",
//       payload: selectedSite.site_id,
//     });
//   } else {
//     dispatch({ type: "SELECT_SITENAME_FAIL" });
//   }
// };

// // const greeting = weatherData.createdAt
// //   ? new Date(weatherData.createdAt).getHours()
// //   : 0;
// const greeting = new Date().getHours();

// const getGreeting = () => {
//   if (greeting < 12) {
//     return "Good Morning";
//   } else if (greeting < 18) {
//     return "Good Afternoon";
//   } else {
//     return "Good Evening";
//   }
// };

// const GoogleMapEmbed = (latitude, longitude) => {
//   const mapSrc = `https://maps.google.com/maps?hl=en&q=${latitude},${longitude}&t=k&z=18&ie=UTF8&iwloc=B&output=embed`;

//   return (
//     <div
//       className="map-container"
//       style={{
//         position: "relative",
//         height: "415px",
//         width: "100%",
//         // borderRadius: "5px",
//         overflow: "hidden",
//       }}
//     >
//       {!isLoaded && (
//         <div className="map-loader">
//           <div className="spinner"></div>
//           <p>Loading Map...</p>
//         </div>
//       )}
//       <iframe
//         title="Google Satellite Map"
//         width="100%"
//         height="100%"
//         src={mapSrc}
//         onLoad={() => setIsLoaded(true)}
//         allowFullScreen
//       ></iframe>
//     </div>
//   );
// };

// const batteryChartData =
//   robotsData?.map((entry) => ({
//     robot: entry.robot_no,
//     value: parseInt(entry.battery_voltage),
//   })) || [];
// const formatNumberShort = (num) => {
//   if (num === null || num === undefined) return "0";

//   const n = Number(num); // ✅ handle string values
//   if (isNaN(n)) return "0";

//   const absNum = Math.abs(n);

//   if (absNum >= 1e12) return (n / 1e12).toFixed(2) + " T";
//   if (absNum >= 1e9) return (n / 1e9).toFixed(2) + " B";
//   if (absNum >= 1e6) return (n / 1e6).toFixed(2) + " M";
//   if (absNum >= 1e3) return (n / 1e3).toFixed(2) + " K";

//   return n.toFixed(2);
// };

// const getWeatherType = () => {
//   const cloudiness = weatherData && weatherData?.cloudiness;
//   const cloudy = weatherData && weatherData?.description?.includes("cloud");

//   const rainy = weatherData && weatherData?.is_rain;

//   if (rainy) return "rainy";
//   if (cloudy || cloudiness > 70) return "cloudy";
//   if (weatherData?.humidity > 60 && cloudiness > 40 && !rainy) return "foggy";
//   return "sunny";
// };

// const weatherType = getWeatherType();
//   console.log(weatherData?.cloudiness);
//   console.log(weatherData?.is_rain);
//   console.log(weatherData?.humidity);
//   console.log(weatherData?.description);
//   return (
//     <>
//       <div className={``}>
//         <div className="p-2 z-0">
//           <div className="">
//             <CRow className="g-4">
//               {/* Map Section */}
//               <CCol xs={12} md={6}>
//                 <CCard className="h-100 border-0 shadow-sm z-0">
//                   <CCardHeader className="">
//                     Hello {userInfo.username},
//                     <span className="text-success"> {getGreeting()}</span>
//                   </CCardHeader>
//                   <CCardBody className="p-0">
//                     <div>
//                       {loadingSiteDetails ? (
//                         <div
//                           className="d-flex justify-content-center align-items-center"
//                           style={{ minHeight: "350px" }}
//                         >
//                           <LoadingSpinner />
//                         </div>
//                       ) : (
//                         GoogleMapEmbed(
//                           siteCoordinates.latitude,
//                           siteCoordinates.longitude,
//                         )
//                       )}
//                     </div>
//                   </CCardBody>
//                 </CCard>
//               </CCol>

//               {/* Weather Section */}
//               <CCol xs={12} md={6}>
//                 <CCard className="h-100 shadow-sm border-0">
//                   <CCardHeader className="fw-bold">
//                     <CRow className="d-flex justify-content-between align-items-center">
//                       <CCol md={4} className="">
//                         Current Weather
//                       </CCol>

//                       <CCol md={8} className="">
//                         {loadingSiteIds ? (
//                           // <LoadingSpinner />
//                           <span className="d-flex justify-content-center align-items-center">
//                             {" "}
//                             Fetching
//                           </span>
//                         ) : errorSiteIds ? (
//                           <CBadge color="warning" className="">
//                             {errorSiteIds === "Site not found"
//                               ? "Please contact Admin to view Data"
//                               : errorSiteIds}
//                           </CBadge>
//                         ) : (
//                           <CFormSelect
//                             value={site_id}
//                             onChange={handleSiteNameChange}
//                             className="form-select p-1 mx-1"
//                             style={{ fontSize: "12px" }}
//                             aria-label="Select Site"
//                           >
//                             <option value="" disabled>
//                               Select Site
//                             </option>
//                             {siteIds.map((site) => (
//                               <option key={site.site_id} value={site.site_id}>
//                                 {site.site_id}
//                               </option>
//                             ))}
//                           </CFormSelect>
//                         )}
//                       </CCol>
//                     </CRow>
//                   </CCardHeader>

//                   <CCardBody className="p-0">
//                     {loadingWeatherData ? (
//                       <div
//                         className="d-flex justify-content-center align-items-center"
//                         style={{ minHeight: 390 }}
//                       >
//                         <LoadingSpinner />
//                       </div>
//                     ) : errorWeatherData ? (
//                       <div
//                         className="d-flex justify-content-center align-items-center"
//                         style={{ minHeight: 390 }}
//                       >
//                         <CBadge color="warning" className="p-2">
//                           {errorWeatherData ===
//                           `Weather data for site: ${site_id} not found`
//                             ? "Please contact Admin to view Data"
//                             : errorWeatherData}
//                         </CBadge>
//                       </div>
//                     ) : (
// <Weather
//   weatherType={weatherType} // "sunny"|"rainy"|"cloudy"|"foggy"
//   weatherData={weatherData} // full API response object
//   siteName={weatherData?.siteName}
//   logo={logo}
// />
//                     )}
//                   </CCardBody>
//                 </CCard>
//               </CCol>
//             </CRow>
//           </div>
//           <div className="mt-2">
//             <CRow className="justify-content-center">
//               <CCol xs={12} md={6} className="mt-4">
//                 <CCard className=" shadow">
//                   <CCardHeader>
//                     <h5 className="text-center">
//                       Total Area Cleaned
//                       <span className="text-success fw-bold ms-2">
//                         {totalAreaCleaned} m²
//                       </span>
//                     </h5>
//                   </CCardHeader>
//                   <div
//                     className="d-flex justify-content-center align-items-center"
//                     style={{ minHeight: "350px" }}
//                   >
//                     {loadingSiteDetails ? (
//                       <LoadingSpinner />
//                     ) : siteDetailsError ? (
//                       <>
//                         {siteDetailsError === "Site not found" ||
//                         siteDetailsError === "Site Coordinates not found" ? (
//                           <CBadge color="warning" className="p-2">
//                             Please contact to Admin to view Data
//                           </CBadge>
//                         ) : (
//                           siteDetailsError
//                         )}
//                       </>
//                     ) : (
//                       <>
//                         {blockWiseCleaning?.length > 0 ? (
//                           <CChartPie
//                             style={{ height: "300px" }}
//                             data={{
//                               labels: blockWiseCleaning.map(
//                                 (block) => block.block,
//                               ),
//                               datasets: [
//                                 {
//                                   data: blockWiseCleaning.map(
//                                     (block) => block.areaCleaned,
//                                   ),
//                                   backgroundColor: chartColors.slice(
//                                     0,
//                                     blockWiseCleaning.length,
//                                   ),
//                                 },
//                               ],
//                             }}
//                             options={{
//                               plugins: {
//                                 legend: {
//                                   display: false, // ✅ This hides the legend
//                                 },
//                                 tooltip: {
//                                   callbacks: {
//                                     label: function (tooltipItem) {
//                                       const block =
//                                         blockWiseCleaning[
//                                           tooltipItem.dataIndex
//                                         ];
//                                       return ` ${
//                                         block.block || "Unassigned"
//                                       } | ${formatNumberShort(block.areaCleaned)} m²`;
//                                       // return ` ${
//                                       //   block.block || "Unassigned"
//                                       // } |  ${block.areaCleaned} m`;
//                                     },
//                                   },
//                                 },
//                               },
//                             }}
//                           />
//                         ) : (
//                           <CBadge color="warning">
//                             No Cleaning Data available
//                           </CBadge>
//                         )}
//                       </>
//                       // <div>
//                       //   <CBadge color="warning fs-5">
//                       //     Stay tuned for more updates!
//                       //   </CBadge>
//                       // </div>
//                     )}
//                   </div>
//                 </CCard>
//               </CCol>

//               <CCol xs={12} md={6} className="mt-4">
//                 <CCard className="mb-4 shadow">
//                   <CCardHeader>
//                     <h5 className="text-center">Gateway Details</h5>
//                   </CCardHeader>
//                   <div
//                     className="d-flex justify-content-center align-items-center"
//                     style={{ minHeight: "350px" }}
//                   >
//                     {loadingSiteDetails ? (
//                       <LoadingSpinner />
//                     ) : siteDetailsError ? (
//                       <>
//                         {siteDetailsError === "Site not found" ||
//                         siteDetailsError === "Site Coordinates not found" ? (
//                           <CBadge color="warning" className="p-2">
//                             Please contact to Admin to view Data
//                           </CBadge>
//                         ) : siteDetailsError ? (
//                           <CBadge color="warning" className="p-2">
//                             {siteDetailsError}
//                           </CBadge>
//                         ) : null}
//                       </>
//                     ) : (
//                       <>
//                         {gateways.length > 0 ? (
//                           <CChartPie
//                             style={{ height: "300px" }}
//                             data={{
//                               labels: gateways.map(
//                                 (gateway) => gateway.gateway_name,
//                               ),
//                               datasets: [
//                                 {
//                                   data: gateways.map(() => 1),
//                                   backgroundColor: gateways.map((gateway) =>
//                                     gateway.gateway_status
//                                       ? "#28a745"
//                                       : "#dc3545",
//                                   ),
//                                 },
//                               ],
//                             }}
//                             options={{
//                               plugins: {
//                                 legend: {
//                                   display: false, // ✅ This hides the legend
//                                 },

//                                 tooltip: {
//                                   callbacks: {
//                                     label: function (tooltipItem) {
//                                       const gateway =
//                                         gateways[tooltipItem.dataIndex];
//                                       return `${
//                                         gateway.gateway_status
//                                           ? "Online"
//                                           : "Offline"
//                                       }${
//                                         gateway.battery_voltage
//                                           ? `| Battery:  ${gateway.battery_voltage} %`
//                                           : ""
//                                       }`;
//                                     },
//                                   },
//                                 },
//                               },
//                             }}
//                           />
//                         ) : (
//                           <CBadge color="warning">
//                             No Gateway details available
//                           </CBadge>
//                         )}
//                       </>
//                     )}
//                   </div>
//                 </CCard>
//               </CCol>
//             </CRow>
//           </div>
//           <div className="mt-2">
//             <CCard className="shadow">
//               <CCardHeader>
//                 <h5>Battery Status</h5>{" "}
//               </CCardHeader>
//               <CCardBody
//                 className="d-flex justify-content-center align-items-center"
//                 // style={{ minHeight: "350px" }}
//               >
//                 {loadingSiteDetails ? (
//                   <LoadingSpinner />
//                 ) : siteDetailsError ? (
//                   <>
//                     {siteDetailsError === "Site not found" ||
//                     siteDetailsError === "Site Coordinates not found" ? (
//                       <CBadge color="warning" className="p-2">
//                         Please contact to Admin to view Data
//                       </CBadge>
//                     ) : (
//                       siteDetailsError
//                     )}
//                   </>
//                 ) : (
//                   <>
//                     {robotsData?.length > 0 ? (
//                       <CChartBar
//                         style={{ height: "300px", width: "100%" }}
//                         data={{
//                           labels: batteryChartData.map((entry) =>
//                             entry.robot.slice(-3),
//                           ),
//                           datasets: [
//                             {
//                               label: "Battery (%)",
//                               data: batteryChartData.map(
//                                 (entry) => entry.value,
//                               ),
//                               backgroundColor: chartColors[1],
//                               borderWidth: 1,
//                               barThickness: 20, // 👈 Fixed width for each bar (in pixels)
//                               maxBarThickness: 20, // 👈 Optional: max limit for bar width
//                               categoryPercentage: 0.8, // 👈 Optional: % of available space per category
//                               barPercentage: 0.9, // 👈 Optional: % of space inside each category
//                             },
//                           ],
//                         }}
//                         options={{
//                           maintainAspectRatio: false, // 🔑 let it expand
//                           responsive: true, // 🔑 auto adjust width
//                           scales: {
//                             y: {
//                               beginAtZero: true,
//                             },
//                           },
//                         }}
//                       />
//                     ) : (
//                       <CBadge color="warning">
//                         No battery logs found for the Robots
//                       </CBadge>
//                     )}
//                   </>
//                 )}
//               </CCardBody>
//             </CCard>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ClientAdminDashboard;

// -------------------------------------------------------------------------------------------------------------------
// import axios from "axios";
// import { useState, useEffect, useReducer } from "react";
// import { useSelector } from "react-redux";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
// } from "recharts";

// /* ─── Colors ─────────────────────────────────────────────────── */
// const ACCENT = "#00D4FF";
// const GREEN = "#00E87A";
// const ORANGE = "#FF6B35";
// const WARNING = "#FFB800";
// const DANGER = "#FF4470";
// const DIMTEXT = "#fff";
// const BODYTEXT = "#C8DEF0";

// const BLOCK_COLORS = ["#00D4FF", "#00E87A", "#A855F7", "#FFB800", "#FF6B35"];

// /* ─── Tiny helpers ────────────────────────────────────────────── */
// const fmt = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n));

// const battColor = (v) => (v > 60 ? ACCENT : v > 30 ? WARNING : DANGER);

// const getGreeting = () => {
//   const h = new Date().getHours();
//   return h < 12 ? "Good Morning" : h < 18 ? "Good Afternoon" : "Good Evening";
// };

// const weatherIcon = (d = "") => {
//   if (d.includes("rain")) return "🌧";
//   if (d.includes("cloud")) return "⛅";
//   if (d.includes("fog")) return "🌫";
//   return "☀️";
// };

// /* ─── Custom Tooltips ────────────────────────────────────────── */
// const TipBox = ({ children }) => (
//   <div
//     style={{
//       background: "#0A1120",
//       border: `1px solid rgba(0,212,255,.18)`,
//       borderRadius: 8,
//       padding: "8px 12px",
//       fontSize: 12,
//       color: BODYTEXT,
//       boxShadow: "0 4px 24px rgba(0,0,0,.5)",
//     }}
//   >
//     {children}
//   </div>
// );

// const PieTip = ({ active, payload }) => {
//   if (!active || !payload?.length) return null;
//   const d = payload[0];
//   return (
//     <TipBox>
//       <p style={{ margin: 0, fontWeight: 600 }}>{d.name}</p>
//       <p style={{ margin: 0, color: ACCENT }}>
//         {Number(d.value).toLocaleString()} m²
//       </p>
//     </TipBox>
//   );
// };

// const GwTip = ({ active, payload }) => {
//   if (!active || !payload?.length) return null;
//   const gw = payload[0]?.payload;
//   return (
//     <TipBox>
//       <p style={{ margin: 0, fontWeight: 600 }}>{gw?.gateway_name}</p>
//       <p style={{ margin: 0, color: gw?.gateway_status ? GREEN : DANGER }}>
//         {gw?.gateway_status ? "Online" : "Offline"}
//       </p>
//       {gw?.battery_voltage && (
//         <p style={{ margin: 0, color: DIMTEXT }}>
//           Battery: {gw.battery_voltage}%
//         </p>
//       )}
//     </TipBox>
//   );
// };

// const BatTip = ({ active, payload, label }) => {
//   if (!active || !payload?.length) return null;
//   return (
//     <TipBox>
//       <p style={{ margin: 0, fontWeight: 600 }}>Robot {label}</p>
//       <p style={{ margin: 0, color: ACCENT }}>{payload[0].value}%</p>
//     </TipBox>
//   );
// };

// /* ─── Reusable card shell ────────────────────────────────────── */
// const Card = ({ children, style = {}, delay = 0 }) => (
//   <div
//     style={{
//       // background: "rgba(10,17,32,.97)",
//       border: "1px solid rgba(0,212,255,.07)",
//       borderRadius: 14,
//       overflow: "hidden",
//       transition: "border-color .25s",
//       animation: `fadeUp .45s ease ${delay}ms both`,
//       ...style,
//     }}
//     onMouseEnter={(e) =>
//       (e.currentTarget.style.borderColor = "rgba(0,212,255,.18)")
//     }
//     onMouseLeave={(e) =>
//       (e.currentTarget.style.borderColor = "rgba(0,212,255,.07)")
//     }
//   >
//     {children}
//   </div>
// );

// const CardHeader = ({ title, badge, right }) => (
//   <div
//     style={{
//       padding: "13px 18px",
//       borderBottom: "1px solid rgba(0,212,255,.06)",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "space-between",
//     }}
//   >
//     <span
//       style={{
//         fontSize: 16,
//         fontWeight: 600,
//         color: BODYTEXT,
//         letterSpacing: ".2px",
//       }}
//     >
//       {title}
//     </span>
//     {badge && (
//       <span
//         style={{
//           fontSize: 12,
//           padding: "3px 9px",
//           borderRadius: 20,
//           background: "rgba(0,212,255,.09)",
//           color: ACCENT,
//           border: "1px solid rgba(0,212,255,.18)",
//           //fontFamily: "'DM Mono', monospace",
//         }}
//       >
//         {badge}
//       </span>
//     )}
//     {right}
//   </div>
// );
// const Loader = ({ height = 100 }) => (
//   <div
//     style={{
//       height,
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       // background: "rgba(0,212,255,.03)",
//       border: "1px solid rgba(0,212,255,.08)",
//       borderRadius: 10,
//     }}
//   >
//     <div
//       style={{
//         width: 28,
//         height: 28,
//         borderRadius: "50%",
//         border: "2px solid rgba(0,212,255,.2)",
//         borderTop: "2px solid #00D4FF",
//         animation: "spin 1s linear infinite",
//       }}
//     />
//   </div>
// );
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
//       return { ...state, loadingSiteIds: false, errorSiteIds: action.payload };

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

// /* ─── Main Component ─────────────────────────────────────────── */
// export default function ClientAdminDashboard() {
//   // const [site, setSite] = useState(SITE_IDS[0].site_id);
//   const [mapLoaded, setMapLoaded] = useState(false);

//   // const totalArea = BLOCKS.reduce((s, b) => s + b.areaCleaned, 0);
//   // const onlineGw = GATEWAYS.filter((g) => g.gateway_status).length;

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
//       errorSiteIds,
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
//     errorSiteIds: "",
//     errorWeatherData: "",
//   });

//   const [site_id, setSiteid] = useState(
//     userInfo.assigned_sites[0]?.site_id || "abc",
//   );
//   const [blockWiseCleaning, setBlockWiseCleaning] = useState([]);
//   const [cleaning, setCleaning] = useState({
//     completed: 0,
//     inprogress: 0,
//     failure: 0,
//   });
//   const [gateways, setGateways] = useState([]);
//   const [robotsData, setRobotsData] = useState([]);
//   const [siteCoordinates, setSiteCoordinates] = useState({});
//   const [totalAreaCleaned, setTotalAreaCleaned] = useState(0);
//   const [isLoaded, setIsLoaded] = useState(false);
//   const [logo, setLogo] = useState("");
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
//         setLogo(response.data.data.logo);
//         setCleaning({
//           completed: response.data.data.cleaning.completed,
//           inprogress: response.data.data.cleaning.inprogress,
//           failure: response.data.data.cleaning.failure,
//         });
//       } catch (error) {
//         dispatch({
//           type: "FETCH_SITE_DETAILS_FAIL",
//           payload: error.response?.data?.message || error.response?.data?.error,
//         });
//         // toast.error(error.response?.data?.message || error.message);
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
//         // toast.error(
//         //   error.response?.data?.message || error.response?.data?.error
//         // );
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
//   const formatNumberShort = (num) => {
//     if (num === null || num === undefined) return "0";

//     const n = Number(num); // ✅ handle string values
//     if (isNaN(n)) return "0";

//     const absNum = Math.abs(n);

//     if (absNum >= 1e12) return (n / 1e12).toFixed(2) + " T";
//     if (absNum >= 1e9) return (n / 1e9).toFixed(2) + " B";
//     if (absNum >= 1e6) return (n / 1e6).toFixed(2) + " M";
//     if (absNum >= 1e3) return (n / 1e3).toFixed(2) + " K";

//     return n.toFixed(2);
//   };

//   const CSS = `
//     @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700&family=DM+Mono:ital,wght@0,300;0,400;0,500&display=swap');
//     *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
//     body, #root { background: #060C18; }
//     .dash {
//       background: #060C18;
//       background-image:
//         radial-gradient(ellipse 60% 40% at 15% 0%, rgba(0,212,255,.07) 0%, transparent 60%),
//         radial-gradient(ellipse 40% 30% at 85% 95%, rgba(168,85,247,.05) 0%, transparent 55%);

//       color: ${BODYTEXT};
//     }
//     @keyframes fadeUp {
//       from { opacity: 0; transform: translateY(14px); }
//       to   { opacity: 1; transform: translateY(0); }
//     }
//     @keyframes pulse {
//       0%, 100% { box-shadow: 0 0 0 0 rgba(0,232,122,.5); }
//       50%       { box-shadow: 0 0 0 6px rgba(0,232,122,0); }
//     }
//     .live-dot { animation: pulse 1.8s ease infinite; }
//     .kpi-card {
//       background: rgba(10,17,32,.97);

//       border-radius: 12px;
//       padding: 16px 18px;
//       position: relative;
//       transition: border-color .2s, transform .2s;
//       overflow: hidden;
//       cursor: default;
//     }
//     .kpi-card:hover { transform: translateY(-2px); }
//     .kpi-card::after {
//       content: '';
//       position: absolute;
//       top: 0; left: 0; right: 0;
//       height: 1px;
//       background: linear-gradient(90deg, transparent, rgba(0,212,255,.22), transparent);
//     }
//     .site-sel {
//       background: rgba(0,212,255,.06);
//       border: 1px solid rgba(0,212,255,.18);
//       border-radius: 8px;
//       color: ${BODYTEXT};
//       padding: 6px 11px;
//       font-size: 12px;
//       cursor: pointer;
//       outline: none;
//       transition: border-color .2s;
//     }
//     .site-sel:hover { border-color: rgba(0,212,255,.35); }
//     .site-sel option { background: #0A1120; }
//     .scrollbar::-webkit-scrollbar { width: 4px; }
//     .scrollbar::-webkit-scrollbar-track { background: transparent; }
//     .scrollbar::-webkit-scrollbar-thumb { background: rgba(0,212,255,.2); border-radius: 4px; }
//   `;

//   const totalArea =
//     blockWiseCleaning &&
//     blockWiseCleaning.reduce((s, b) => s + b.areaCleaned, 0);
//   const onlineGw = gateways && gateways.filter((g) => g.gateway_status).length;

//   const runningRobots = cleaning && cleaning.inprogress;
//   const completedRobots = cleaning && cleaning.completed;
//   const failedRobots = cleaning && cleaning.failure;

//   let totalRobots = robotsData && robotsData.length;
//   let onlineRobots =
//     robotsData &&
//     robotsData.reduce((acc, curr) => {
//       return curr.lora_state === 1 ? acc + 1 : acc;
//     }, 0);
//   let offlineRobots =
//     robotsData &&
//     robotsData.reduce((acc, curr) => {
//       return curr.lora_state === 0 ? acc + 1 : acc;
//     }, 0);

//   const KPI_DATA = [
//     {
//       label: "Todays Cleaning",
//       value: `🟢 ${completedRobots}  🟡 ${runningRobots}  🔴 ${failedRobots}`,
//       unit: "",
//       color: ACCENT,
//     },
//     {
//       label: "Active Robots",
//       value: robotsData && robotsData.length,
//       unit: "units operational",
//       color: GREEN,
//     },
//     {
//       label: "Gateways Online",
//       value: `${onlineGw}/${gateways.length}`,
//       unit: "connected",
//       color: onlineGw === gateways.length ? GREEN : ORANGE,
//     },
//     {
//       label: "Temperature",
//       value: `${weatherData?.temperature}°`,
//       unit: "feels like " + weatherData?.temperature + "°C",
//       color: ACCENT,
//     },
//   ];

//   const mapSrc = `https://maps.google.com/maps?hl=en&q=${siteCoordinates.latitude},${siteCoordinates.longitude}&t=k&z=17&ie=UTF8&iwloc=B&output=embed`;

//   return (
//     <>
//       <style>{CSS}</style>
//       <div className="dash">
//         {/* ── Header ── */}
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             padding: "3px 4px",
//             borderBottom: "1px solid rgba(0,212,255,.07)",
//             background: "rgba(6,12,24,.88)",
//             backdropFilter: "blur(16px)",
//             position: "sticky",
//             top: 0,
//             zIndex: 100,
//           }}
//         >
//           {/* <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//             <div
//               style={{
//                 width: 32,
//                 height: 32,
//                 borderRadius: 8,
//                 background: `linear-gradient(135deg, ${ACCENT}, #0080FF)`,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 fontSize: 14,
//                 fontWeight: 700,
//                 color: "#060C18",
//               }}
//             >
//               S
//             </div>
//             <span
//               style={{ fontSize: 14, fontWeight: 700, letterSpacing: "-.3px" }}
//             >
//               SolarOps
//             </span>
//           </div> */}

//           <span style={{ fontSize: 14, color: DIMTEXT }}>
//             Hello, {userInfo.username} —&nbsp;
//             <span style={{ color: ACCENT, fontWeight: 500 }}>
//               {getGreeting()}
//             </span>
//           </span>

//           <select
//             className="site-sel"
//             value={site_id}
//             onChange={(e) => setSiteid(e.target.value)}
//           >
//             {siteIds.map((s) => (
//               <option key={s.site_id} value={s.site_id}>
//                 {s.site_id}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* ── Content ── */}
//         <div style={{ padding: "10px 10px", maxWidth: 1800, margin: "0 auto" }}>
//           {/* KPI Row */}
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "repeat(4,1fr)",
//               gap: 12,
//               marginBottom: 18,
//             }}
//           >
//             {loadingSiteDetails || loadingWeatherData
//               ? Array(4)
//                   .fill(0)
//                   .map((_, i) => <Loader key={i} height={90} />)
//               : KPI_DATA.map((k, i) => (
//                   <div
//                     key={i}
//                     className="kpi-card"
//                     style={{ animation: `fadeUp .4s ease ${i * 70}ms both` }}
//                   >
//                     <div
//                       style={{
//                         fontSize: 13,
//                         color: DIMTEXT,
//                         textTransform: "uppercase",
//                         letterSpacing: ".9px",
//                         marginBottom: 9,
//                       }}
//                     >
//                       {k.label}
//                     </div>
//                     {k.label === "Active Robots" ? (
//                       <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
//                         {/* Completed */}
//                         <div
//                           style={{
//                             flex: 1,
//                             // background: "rgba(0,232,122,.08)",
//                             border: "1px solid  rgba(108,231,253,.2)",
//                             borderRadius: 8,
//                             padding: "6px 8px",
//                             textAlign: "center",
//                           }}
//                         >
//                           <div style={{ fontSize: 10, color: "#6ce7fd" }}>
//                             Total Rbots
//                           </div>
//                           <div
//                             style={{
//                               fontSize: 16,
//                               fontWeight: 700,
//                               color: "#6ce7fd",
//                             }}
//                           >
//                             {totalRobots}
//                           </div>
//                         </div>

//                         {/* Online */}
//                         <div
//                           style={{
//                             flex: 1,
//                             // background: "rgba(255,184,0,.08)",
//                             border: "1px solid rgba(0,232,122,.2)",
//                             borderRadius: 8,
//                             padding: "6px 8px",
//                             textAlign: "center",
//                           }}
//                         >
//                           <div style={{ fontSize: 10, color: GREEN }}>
//                             Online
//                           </div>
//                           <div
//                             style={{
//                               fontSize: 16,
//                               fontWeight: 700,
//                               color: GREEN,
//                             }}
//                           >
//                             {onlineRobots}
//                           </div>
//                         </div>

//                         {/* Failed */}
//                         <div
//                           style={{
//                             flex: 1,
//                             // background: "rgba(255,68,112,.08)",
//                             border: "1px solid rgba(255,68,112,.2)",
//                             borderRadius: 8,
//                             padding: "6px 8px",
//                             textAlign: "center",
//                           }}
//                         >
//                           <div style={{ fontSize: 10, color: DANGER }}>
//                             Offline
//                           </div>
//                           <div
//                             style={{
//                               fontSize: 16,
//                               fontWeight: 700,
//                               color: DANGER,
//                             }}
//                           >
//                             {offlineRobots}
//                           </div>
//                         </div>
//                       </div>
//                     ) : k.label === "Todays Cleaning" ? (
//                       <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
//                         {/* Completed */}
//                         <div
//                           style={{
//                             flex: 1,
//                             // background: "rgba(0,232,122,.08)",
//                             border: "1px solid rgba(0,232,122,.2)",
//                             borderRadius: 8,
//                             padding: "6px 8px",
//                             textAlign: "center",
//                           }}
//                         >
//                           <div style={{ fontSize: 10, color: GREEN }}>
//                             Completed
//                           </div>
//                           <div
//                             style={{
//                               fontSize: 16,
//                               fontWeight: 700,
//                               color: GREEN,
//                             }}
//                           >
//                             {completedRobots}
//                           </div>
//                         </div>

//                         {/* Running */}
//                         <div
//                           style={{
//                             flex: 1,
//                             // background: "rgba(255,184,0,.08)",
//                             border: "1px solid rgba(255,184,0,.2)",
//                             borderRadius: 8,
//                             padding: "6px 8px",
//                             textAlign: "center",
//                           }}
//                         >
//                           <div style={{ fontSize: 10, color: WARNING }}>
//                             Running
//                           </div>
//                           <div
//                             style={{
//                               fontSize: 16,
//                               fontWeight: 700,
//                               color: WARNING,
//                             }}
//                           >
//                             {runningRobots}
//                           </div>
//                         </div>

//                         {/* Failed */}
//                         <div
//                           style={{
//                             flex: 1,
//                             // background: "rgba(255,68,112,.08)",
//                             border: "1px solid rgba(255,68,112,.2)",
//                             borderRadius: 8,
//                             padding: "6px 8px",
//                             textAlign: "center",
//                           }}
//                         >
//                           <div style={{ fontSize: 10, color: DANGER }}>
//                             Failed
//                           </div>
//                           <div
//                             style={{
//                               fontSize: 16,
//                               fontWeight: 700,
//                               color: DANGER,
//                             }}
//                           >
//                             {failedRobots}
//                           </div>
//                         </div>
//                       </div>
//                     ) : (
//                       <>
//                         <div
//                           style={{
//                             fontSize: 16,
//                             fontWeight: 700,
//                             color: k.color,
//                             //fontFamily: "'DM Mono', monospace",
//                             lineHeight: 1,
//                           }}
//                         >
//                           {k.value}
//                         </div>
//                         <div
//                           style={{ fontSize: 14, color: DIMTEXT, marginTop: 5 }}
//                         >
//                           {k.unit}
//                         </div>
//                       </>
//                     )}
//                   </div>
//                 ))}
//           </div>

//           {/* Map + Weather */}
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "1fr 1fr",
//               gap: 16,
//               marginBottom: 16,
//             }}
//           >
//             {/* Map */}
//             {loadingSiteDetails ? (
//               <Loader height={400} />
//             ) : (
//               <Card delay={200}>
//                 <CardHeader
//                   title="Site Location"
//                   // badge={}
//                   right={
//                     <div
//                       className="live-dot"
//                       style={{
//                         width: 8,
//                         height: 8,
//                         borderRadius: "50%",
//                         background: GREEN,
//                         marginLeft: 8,
//                       }}
//                     />
//                   }
//                 />
//                 <div
//                   style={{
//                     position: "relative",
//                     height: 360,
//                     overflow: "hidden",
//                   }}
//                 >
//                   {!mapLoaded && (
//                     <div
//                       style={{
//                         position: "absolute",
//                         inset: 0,
//                         // background: "#0A1120",
//                         display: "flex",
//                         flexDirection: "column",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         gap: 10,
//                         zIndex: 2,
//                       }}
//                     >
//                       <div
//                         style={{
//                           width: 32,
//                           height: 32,
//                           borderRadius: "50%",
//                           border: `2px solid rgba(0,212,255,.15)`,
//                           borderTop: `2px solid ${ACCENT}`,
//                           animation: "spin 1s linear infinite",
//                         }}
//                       />
//                       <span style={{ fontSize: 12, color: DIMTEXT }}>
//                         Loading map…
//                       </span>
//                       <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
//                     </div>
//                   )}
//                   <iframe
//                     title="Satellite Map"
//                     src={mapSrc}
//                     width="100%"
//                     height="100%"
//                     style={{
//                       border: 0,
//                       display: "block",
//                       // filter: "hue-rotate(190deg) saturate(0.7) brightness(0.85)",
//                     }}
//                     onLoad={() => setMapLoaded(true)}
//                     allowFullScreen
//                   />
//                   {/* Vignette overlays */}
//                   <div
//                     style={{
//                       position: "absolute",
//                       inset: 0,
//                       pointerEvents: "none",
//                       background:
//                         "linear-gradient(to bottom, rgba(6,12,24,.3) 0%, transparent 20%, transparent 80%, rgba(6,12,24,.4) 100%)",
//                     }}
//                   />
//                 </div>
//               </Card>
//             )}

//             {loadingSiteDetails ? (
//               <Loader height={400} />
//             ) : (
//               <Card delay={270}>
//                 <CardHeader
//                   title="Current Weather"
//                   badge={`${weatherData.siteName}, ${weatherData.location}`}
//                 />
//                 <div style={{ padding: "22px 20px" }}>
//                   <div
//                     style={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "flex-start",
//                       marginBottom: 24,
//                     }}
//                   >
//                     <div>
//                       <div
//                         style={{
//                           fontSize: 60,
//                           fontWeight: 700,
//                           //fontFamily: "'DM Mono',monospace",
//                           color: BODYTEXT,
//                           lineHeight: 1,
//                         }}
//                       >
//                         {weatherData.temperature}
//                         <span style={{ fontSize: 26, color: DIMTEXT }}>°C</span>
//                       </div>
//                       <div
//                         style={{
//                           fontSize: 14,
//                           color: DIMTEXT,
//                           marginTop: 4,
//                           textTransform: "capitalize",
//                         }}
//                       >
//                         {weatherData.description}
//                       </div>
//                       <div
//                         style={{ fontSize: 11, color: ACCENT, marginTop: 3 }}
//                       >
//                         Feels like {weatherData.feelsLike}°C
//                       </div>
//                     </div>
//                     <div
//                       style={{
//                         width: 72,
//                         height: 72,
//                         borderRadius: "50%",
//                         background: "rgba(0,212,255,.07)",
//                         border: "1px solid rgba(0,212,255,.14)",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         fontSize: 30,
//                       }}
//                     >
//                       {weatherIcon(weatherData.description)}
//                     </div>
//                   </div>

//                   <div
//                     style={{
//                       display: "grid",
//                       gridTemplateColumns: "1fr 1fr",
//                       gap: 10,
//                     }}
//                   >
//                     {[
//                       { label: "Humidity", value: `${weatherData.humidity}%` },
//                       {
//                         label: "Wind",
//                         value: `${weatherData.wind_speed} km/h`,
//                       },
//                       {
//                         label: "Cloudiness",
//                         value: `${weatherData.cloudiness}%`,
//                       },
//                       {
//                         label: "Pressure",
//                         value: `${weatherData.pressure} hPa`,
//                       },
//                     ].map((s, i) => (
//                       <div
//                         key={i}
//                         style={{
//                           background: "rgba(0,212,255,.04)",
//                           border: "1px solid rgba(0,212,255,.07)",
//                           borderRadius: 10,
//                           padding: "12px 14px",
//                         }}
//                       >
//                         <div
//                           style={{
//                             fontSize: 10,
//                             color: DIMTEXT,
//                             textTransform: "uppercase",
//                             letterSpacing: ".8px",
//                             marginBottom: 5,
//                           }}
//                         >
//                           {s.label}
//                         </div>
//                         <div
//                           style={{
//                             fontSize: 19,
//                             fontWeight: 600,
//                             //fontFamily: "'DM Mono',monospace",
//                             color: BODYTEXT,
//                           }}
//                         >
//                           {s.value}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </Card>
//             )}
//           </div>

//           {/* Pie charts row */}
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "1fr 1fr",
//               gap: 16,
//               marginBottom: 16,
//             }}
//           >
//             {loadingSiteDetails ? (
//               <Loader height={300} />
//             ) : (
//               <Card delay={350}>
//                 <CardHeader
//                   title="Area Cleaned by Block"
//                   badge={`${totalArea.toLocaleString()} m²`}
//                 />
//                 <div
//                   style={{
//                     padding: "16px 18px",
//                     display: "flex",
//                     // gap: 14,
//                     justifyContent: "center",
//                     alignItems: "center",
//                   }}
//                 >
//                   <ResponsiveContainer width={180} height={190}>
//                     <PieChart>
//                       <Pie
//                         data={blockWiseCleaning}
//                         cx="50%"
//                         cy="50%"
//                         innerRadius={52}
//                         outerRadius={82}
//                         dataKey="areaCleaned"
//                         nameKey="block"
//                         paddingAngle={3}
//                       >
//                         {blockWiseCleaning.map((_, i) => (
//                           <Cell
//                             key={i}
//                             fill={BLOCK_COLORS[i % BLOCK_COLORS.length]}
//                             stroke="transparent"
//                           />
//                         ))}
//                       </Pie>
//                       <Tooltip content={<PieTip />} />
//                     </PieChart>
//                   </ResponsiveContainer>
//                   {/* <div style={{ flex: 1 }}>
//                     {blockWiseCleaning.map((b, i) => (
//                       <div
//                         key={i}
//                         style={{
//                           display: "flex",
//                           alignItems: "center",
//                           fontSize: 12,
//                           color: DIMTEXT,
//                           marginBottom: 8,
//                           gap: 7,
//                         }}
//                       >
//                         <span
//                           style={{
//                             width: 7,
//                             height: 7,
//                             borderRadius: 2,
//                             background: BLOCK_COLORS[i % BLOCK_COLORS.length],
//                             flexShrink: 0,
//                           }}
//                         />
//                         <span style={{ flex: 1 }}>{b.block}</span>
//                         <span
//                           style={{
//                             //fontFamily: "'DM Mono',monospace",
//                             fontSize: 11,
//                             color: BODYTEXT,
//                           }}
//                         >
//                           {fmt(b.areaCleaned)} m²
//                         </span>
//                       </div>
//                     ))}
//                   </div> */}
//                 </div>
//               </Card>
//             )}

//             {loadingSiteDetails ? (
//               <Loader height={300} />
//             ) : (
//               <Card delay={420}>
//                 <CardHeader
//                   title="Gateway Status"
//                   badge={`${onlineGw}/${gateways.length} online`}
//                 />
//                 <div
//                   style={{
//                     padding: "16px 18px",
//                     display: "flex",
//                     gap: 14,
//                     alignItems: "center",
//                   }}
//                 >
//                   <ResponsiveContainer width={180} height={190}>
//                     <PieChart>
//                       <Pie
//                         data={gateways}
//                         cx="50%"
//                         cy="50%"
//                         innerRadius={52}
//                         outerRadius={82}
//                         dataKey={() => 1}
//                         nameKey="gateway_name"
//                         paddingAngle={4}
//                       >
//                         {gateways.map((gw, i) => (
//                           <Cell
//                             key={i}
//                             fill={gw.gateway_status ? GREEN : DANGER}
//                             stroke="transparent"
//                           />
//                         ))}
//                       </Pie>
//                       <Tooltip content={<GwTip />} />
//                     </PieChart>
//                   </ResponsiveContainer>
//                   <div style={{ flex: 1 }}>
//                     {gateways.map((gw, i) => (
//                       <div
//                         key={i}
//                         style={{
//                           display: "flex",
//                           alignItems: "center",
//                           gap: 8,
//                           marginBottom: 10,
//                           background: "rgba(0,212,255,.03)",
//                           border: "1px solid rgba(0,212,255,.06)",
//                           borderRadius: 8,
//                           padding: "7px 10px",
//                         }}
//                       >
//                         <span
//                           style={{
//                             width: 7,
//                             height: 7,
//                             borderRadius: "50%",
//                             background: gw.gateway_status ? GREEN : DANGER,
//                             flexShrink: 0,
//                           }}
//                         />
//                         <span
//                           style={{ flex: 1, fontSize: 12, color: BODYTEXT }}
//                         >
//                           {gw.gateway_name}
//                         </span>
//                         <span
//                           style={{
//                             fontSize: 10,
//                             padding: "2px 7px",
//                             borderRadius: 12,
//                             background: gw.gateway_status
//                               ? "rgba(0,232,122,.12)"
//                               : "rgba(255,68,112,.12)",
//                             color: gw.gateway_status ? GREEN : DANGER,
//                             //fontFamily: "'DM Mono',monospace",
//                           }}
//                         >
//                           {gw.gateway_status ? "online" : "offline"}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </Card>
//             )}
//           </div>

//           {loadingSiteDetails ? (
//             <Loader height={300} />
//           ) : (
//             <Card delay={500}>
//               <CardHeader
//                 title="Robot Battery Status"
//                 badge={`${robotsData.length} robots`}
//               />
//               <div style={{ padding: "16px 20px 20px" }}>
//                 <ResponsiveContainer width="100%" height={220}>
//                   <BarChart
//                     data={robotsData.map((r) => ({
//                       name: r.robot_no.slice(-3),
//                       battery: parseInt(r.battery_voltage),
//                     }))}
//                     barSize={30}
//                     margin={{ top: 4, right: 8, left: -18, bottom: 0 }}
//                   >
//                     <CartesianGrid
//                       strokeDasharray="3 3"
//                       stroke="rgba(0,212,255,.06)"
//                       vertical={false}
//                     />
//                     <XAxis
//                       dataKey="name"
//                       tick={{
//                         fill: DIMTEXT,
//                         fontSize: 12,
//                         //fontFamily: "'DM Mono',monospace",
//                       }}
//                       axisLine={false}
//                       tickLine={false}
//                     />
//                     <YAxis
//                       domain={[0, 100]}
//                       tick={{
//                         fill: DIMTEXT,
//                         fontSize: 11,
//                         //fontFamily: "'DM Mono',monospace",
//                       }}
//                       axisLine={false}
//                       tickLine={false}
//                     />
//                     <Tooltip
//                       content={<BatTip />}
//                       cursor={{ fill: "rgba(0,212,255,.04)" }}
//                     />
//                     <Bar dataKey="battery" radius={[5, 5, 0, 0]}>
//                       {robotsData.map((r, i) => (
//                         <Cell
//                           key={i}
//                           fill={battColor(parseInt(r.battery_voltage))}
//                         />
//                       ))}
//                     </Bar>
//                   </BarChart>
//                 </ResponsiveContainer>

//                 <div
//                   style={{
//                     display: "flex",
//                     gap: 18,
//                     marginTop: 12,
//                     justifyContent: "center",
//                   }}
//                 >
//                   {[
//                     { color: ACCENT, label: "High >60%" },
//                     { color: WARNING, label: "Medium 30–60%" },
//                     { color: DANGER, label: "Low <30%" },
//                   ].map((l, i) => (
//                     <div
//                       key={i}
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: 6,
//                         fontSize: 11,
//                         color: DIMTEXT,
//                       }}
//                     >
//                       <span
//                         style={{
//                           width: 8,
//                           height: 8,
//                           borderRadius: 2,
//                           background: l.color,
//                           display: "inline-block",
//                         }}
//                       />
//                       {l.label}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </Card>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }
// ------------------------------------------------------------------------------------

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
import Weather from "./weather/Weather";

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
    case "FETCH_WEATHER_REQUEST":
      return { ...state, loadingWeatherData: true };
    case "FETCH_WEATHER_SUCCESS":
      return {
        ...state,
        loadingWeatherData: false,
        weatherData: action.payload,
      };
    case "FETCH_WEATHER_FAIL":
      return {
        ...state,
        loadingWeatherData: false,
        errorWeatherData: action.payload,
      };
    default:
      return state;
  }
};

/* ══════════════════════════════════════════════
   MAIN DASHBOARD
══════════════════════════════════════════════ */
export default function ClientAdminDashboard() {
  const authtoken = useSelector((s) => s.authtoken);
  const userInfo = useSelector((s) => s.userInfo);

  const [state, dispatch] = useReducer(reducer, {
    siteIds: [],
    siteDetails: {},
    weatherData: {},
    loadingSiteIds: false,
    loadingSiteDetails: false,
    loadingWeatherData: true,
    errorSiteIds: "",
    siteDetailsError: "",
    errorWeatherData: "",
  });

  const {
    siteIds,
    siteDetails,
    weatherData,
    loadingSiteIds,
    loadingSiteDetails,
    loadingWeatherData,
    siteDetailsError,
    errorWeatherData,
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
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
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
        setCleaning(d.cleaning || { completed: 0, inprogress: 0, failure: 0 });
      } catch (e) {
        dispatch({
          type: "FETCH_SITE_DETAILS_FAIL",
          payload: e.response?.data?.message || e.message,
        });
      }
    };

    const fetchWeather = async () => {
      dispatch({ type: "FETCH_WEATHER_REQUEST" });
      try {
        const { data } = await axios.get(
          `/api/v1/weatherdata/client/${site_id}`,
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          },
        );
        dispatch({ type: "FETCH_WEATHER_SUCCESS", payload: data.data });
      } catch (e) {
        dispatch({
          type: "FETCH_WEATHER_FAIL",
          payload: e.response?.data?.message || e.message,
        });
      }
    };

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

    fetchSiteDetails();
    fetchWeather();
    fetchSiteIds();
    setMapLoaded(false);
  }, [authtoken, site_id]);

  /* derived */
  const totalArea = blockWiseCleaning.reduce((s, b) => s + b.areaCleaned, 0);
  const onlineGw = gateways.filter((g) => g.gateway_status).length;
  const totalRobots = robotsData.length;
  const onlineRobs = robotsData.filter((r) => r.lora_state === 1).length;
  const offlineRobs = robotsData.filter((r) => r.lora_state === 0).length;
  const mapSrc = `https://maps.google.com/maps?hl=en&q=${siteCoords.latitude},${siteCoords.longitude}&t=k&z=18&ie=UTF8&iwloc=B&output=embed`;

  const isLoading = loadingSiteDetails || loadingWeatherData;

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
            alignItems: "center",
            justifyContent: "end",
            padding: "0 10px",
            height: 50,
            // background: "rgba(16,25,54,.94)",
            backdropFilter: "blur(20px)",
            borderBottom: `1px solid ${T.border}`,
          }}
        >
          {/* <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="pulse-dot" />
            <span style={{ fontSize: 13, color: T.textMid }}>
              Hello,&nbsp;
              <strong style={{ color: T.text, fontWeight: 600 }}>
                {userInfo.username}
              </strong>
              &nbsp;—&nbsp;
              <span style={{ color: T.cyan }}>{greeting()}</span>
            </span>
          </div> */}

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {loadingSiteIds ? (
              <Skel h={32} w={160} r={8} />
            ) : (
              <select
                className="site-sel"
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
              gridTemplateColumns: "repeat(4, 1fr)",
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
                <KpiCard label="Today's Cleaning" icon="🧹" delay={0}>
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

                <KpiCard label="Robots" icon="🤖" delay={80}>
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
              gridTemplateColumns: "1fr 1fr",
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
                  title="Site Location"
                  badge={site_id}
                  right={
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 5 }}
                    >
                      <span
                        className="pulse-dot"
                        style={{ width: 6, height: 6 }}
                      />
                      <span
                        style={{
                          fontSize: 11,
                          color: T.green,
                          fontWeight: 500,
                        }}
                      >
                        Live
                      </span>
                    </div>
                  }
                />
                <div
                  style={{
                    position: "relative",
                    height: 360,
                    overflow: "hidden",
                  }}
                >
                  {!mapLoaded && (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: T.surfaceHi,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 10,
                        zIndex: 2,
                      }}
                    >
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          border: `2px solid ${T.border}`,
                          borderTop: `2px solid ${T.cyan}`,
                          animation: "spin 1s linear infinite",
                        }}
                      />
                      <span style={{ fontSize: 12, color: T.textDim }}>
                        Loading map…
                      </span>
                    </div>
                  )}
                  <iframe
                    title="Satellite Map"
                    src={mapSrc}
                    width="100%"
                    height="100%"
                    style={{ border: 0, display: "block" }}
                    onLoad={() => setMapLoaded(true)}
                    allowFullScreen
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      pointerEvents: "none",
                      background:
                        "linear-gradient(to bottom,rgba(16,25,54,.28) 0%,transparent 18%,transparent 80%,rgba(16,25,54,.38) 100%)",
                    }}
                  />
                </div>
              </Card>
            )}

            {loadingWeatherData ? (
              <CardSkeleton height={416} />
            ) : errorWeatherData ? (
              <Card delay={260}>
                <CardHead icon="🌤" title="Current Weather" />
                <ErrorState message="Weather data unavailable. Please contact admin." />
              </Card>
            ) : (
              <Weather
                weatherType={weatherType} // "sunny"|"rainy"|"cloudy"|"foggy"
                weatherData={weatherData} // full API response object
                siteName={weatherData?.siteName}
                logo={siteDetails.logo}
              />
              // <Card delay={260}>
              //   <CardHead
              //     icon="🌤"
              //     title="Current Weather"
              //     badge={[weatherData.siteName, weatherData.location]
              //       .filter(Boolean)
              //       .join(", ")}
              //   />
              //   <div style={{ padding: "20px 20px 18px" }}>
              //     <div
              //       style={{
              //         display: "flex",
              //         justifyContent: "space-between",
              //         alignItems: "flex-start",
              //         marginBottom: 18,
              //       }}
              //     >
              //       <div>
              //         <div
              //           style={{
              //             fontSize: 62,
              //             fontWeight: 700,
              //             // fontFamily: T.mono,
              //             lineHeight: 1,
              //             color: T.text,
              //           }}
              //         >
              //           {weatherData.temperature}
              //           <span style={{ fontSize: 26, color: T.textMid }}>
              //             °
              //           </span>
              //         </div>
              //         <div
              //           style={{
              //             fontSize: 14,
              //             color: T.textMid,
              //             marginTop: 5,
              //             textTransform: "capitalize",
              //           }}
              //         >
              //           {weatherData.description}
              //         </div>
              //         <div
              //           style={{ fontSize: 11, color: T.cyan, marginTop: 3 }}
              //         >
              //           Feels like {weatherData.feelsLike}°C
              //         </div>
              //       </div>
              //       <div
              //         style={{
              //           width: 74,
              //           height: 74,
              //           borderRadius: "50%",
              //           background: T.cyanDim,
              //           border: `1px solid rgba(56,189,248,.18)`,
              //           display: "flex",
              //           alignItems: "center",
              //           justifyContent: "center",
              //           fontSize: 30,
              //         }}
              //       >
              //         {wxIcon(weatherData.description, weatherData.is_rain)}
              //       </div>
              //     </div>

              //     <div
              //       style={{
              //         display: "grid",
              //         gridTemplateColumns: "1fr 1fr",
              //         gap: 9,
              //       }}
              //     >
              //       {[
              //         {
              //           icon: "💧",
              //           label: "Humidity",
              //           value: `${weatherData.humidity}%`,
              //         },
              //         {
              //           icon: "💨",
              //           label: "Wind",
              //           value: `${weatherData.wind_speed ?? weatherData.windSpeed} km/h`,
              //         },
              //         {
              //           icon: "☁️",
              //           label: "Cloudiness",
              //           value: `${weatherData.cloudiness}%`,
              //         },
              //         {
              //           icon: "🔬",
              //           label: "Pressure",
              //           value: `${weatherData.pressure} hPa`,
              //         },
              //       ].map((s, i) => (
              //         <div
              //           key={i}
              //           style={{
              //             background: T.surfaceHi,
              //             border: `1px solid ${T.border}`,
              //             borderRadius: 10,
              //             padding: "11px 13px",
              //             display: "flex",
              //             alignItems: "center",
              //             gap: 10,
              //           }}
              //         >
              //           <span style={{ fontSize: 18, lineHeight: 1 }}>
              //             {s.icon}
              //           </span>
              //           <div>
              //             <div
              //               style={{
              //                 fontSize: 10,
              //                 color: T.textDim,
              //                 textTransform: "uppercase",
              //                 letterSpacing: ".7px",
              //                 marginBottom: 3,
              //               }}
              //             >
              //               {s.label}
              //             </div>
              //             <div
              //               style={{
              //                 fontSize: 17,
              //                 fontWeight: 600,
              //                 // fontFamily: T.mono,
              //                 color: T.text,
              //               }}
              //             >
              //               {s.value}
              //             </div>
              //           </div>
              //         </div>
              //       ))}
              //     </div>
              //   </div>
              // </Card>
            )}
          </section>

          {/* CHARTS ROW */}
          <section
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
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
    </>
  );
}

/* ══════════════════════════════════════════════
   UTILITY COMPONENTS
══════════════════════════════════════════════ */
function KpiCard({ label, icon, children, delay = 0, accent = T.cyan }) {
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
        cursor: "default",
      }}
    >
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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: 10,
          color: T.textDim,
          textTransform: "uppercase",
          letterSpacing: ".85px",
          marginBottom: 2,
        }}
      >
        <span style={{ fontSize: 12 }}>{icon}</span>
        {label}
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
