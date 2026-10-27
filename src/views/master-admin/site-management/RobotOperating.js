// import RobotNoLink from "../../../components/RobotNoLink";
// import React, { useEffect, useReducer, useState } from "react";
// import {
//   CRow,
//   CCol,
//   CCard,
//   CCardBody,
//   CButton,
//   CModal,
//   CModalBody,
//   CModalFooter,
//   CModalHeader,
//   CModalTitle,
//   CTable,
//   CTableHead,
//   CTableRow,
//   CTableHeaderCell,
//   CTableBody,
//   CTableDataCell,
//   CDropdownMenu,
//   CDropdown,
//   CDropdownToggle,
//   CInputGroup,
//   CFormInput,
//   CTooltip,
//   CBadge,
//   CFormCheck,
// } from "@coreui/react";
// import { FaArrowUp } from "react-icons/fa";
// import { FaCircleInfo } from "react-icons/fa6"; // Correct import
// import { Link, useParams } from "react-router-dom";
// import "./management.css";
// import toast from "react-hot-toast";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import LoadingSpinner from "../../../components/LoadingSpinner";
// import WeatherCheckResultModal from "../../../components/WeatherCheckResultModal";
// import { formatDistanceToNow } from "date-fns";
// import PaginateInput from "../../../components/PaginateInput";

// const reducer = (state, action) => {
//   switch (action.type) {
//     case "FETCH_REQUEST":
//       return { ...state, loading: true };

//     case "FETCH_SUCCESS":
//       return {
//         ...state,
//         downlinks: action.payload.data,
//         totalPages: action.payload.totalPages, // Use API-provided totalPages
//         hasNextPage: action.payload.hasNextPage,
//         hasPrevPage: action.payload.hasPrevPage,
//         loading: false,
//       };

//     case "FETCH_FAIL":
//       return { ...state, loading: false, error: action.payload };

//     case "DELETE_REQUEST":
//       return { ...state, loadingDelete: true, successDelete: false };

//     case "DELETE_SUCCESS":
//       return { ...state, loadingDelete: false, successDelete: true };

//     case "DELETE_FAIL":
//       return { ...state, loadingDelete: false, successDelete: false };

//     case "DELETE_RESET":
//       return { ...state, successDelete: false };

//     case "FETCH_ROBOTS_REQUEST":
//       return { ...state, loadingRobots: true, error: "" };

//     case "FETCH_ROBOTS_SUCCESS":
//       return { ...state, loadingRobots: false, robots: action.payload };

//     case "FETCH_ROBOTS_FAIL":
//       return { ...state, loadingRobots: false, error: action.payload };

//     case "FETCH_ROBOT_REQUEST":
//       return { ...state, loadingRobot: true, error: "" };

//     case "FETCH_ROBOT_SUCCESS":
//       return { ...state, loadingRobot: false, robot: action.payload };

//     case "FETCH_ROBOT_FAIL":
//       return { ...state, loadingRobot: false, error: action.payload };

//     case "SEND_DOWNLINK_REQUEST":
//       return { ...state, sendingCommandloading: true, error: "" };

//     case "SEND_DOWNLINK_SUCCESS":
//       return { ...state, sendingCommandloading: false };

//     case "SEND_DOWNLINK_FAIL":
//       return { ...state, sendingCommandloading: false, error: action.payload };

//     default:
//       return state;
//   }
// };

// const RobotOperating = () => {
//   const [
//     {
//       loading,
//       loadingRobot,
//       error,
//       robot,
//       downlinks,
//       successDelete,
//       loadingRobots,
//       robots,
//       totalPages,
//       hasNextPage,
//       hasPrevPage,
//       sendingCommandloading,
//     },
//     dispatch,
//   ] = useReducer(reducer, {
//     downlinks: [],
//     robots: [],
//     robot: {},
//     loading: true,
//     error: "",
//     loadingRobots: true,
//     sendingCommandloading: false,
//     loadingRobot: false,
//     totalPages: 1,
//     hasNextPage: false,
//     hasPrevPage: false,
//   });
//   const { site_id, block, robot_no } = useParams();
//   const [modalVisible, setModalVisible] = useState(false);
//   // const [siteRobots, setSiteRobots] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [text, setText] = useState("");
//   const [base64Text, setBase64Text] = useState("");

//   // const authtoken = useSelector((state) => state.authtoken);
//   const userInfo = useSelector((state) => state.userInfo);

//   const [pageInput, setPageInput] = useState("");
//   const [wheelCurrentValue, setWheelCurrentValue] = useState("");
//   const [brushCurrentValue, setBrushCurrentValue] = useState("");
//   const [wheelSpeedValue, setWheelSpeedValue] = useState("");
//   const [brushSpeedValue, setBrushSpeedValue] = useState("");

//   let start = "11";
//   let partialStart = "12";
//   let stop = "14";
//   let returntodock = "15";
//   let removecurrentLimit = "HCD";
//   let setWheelPwm100 = "69";
//   let setWheelPwm200 = "6A";
//   let setWheelPwm250 = "6B";
//   let setBrushPwm100 = "66";
//   let setBrushPwm200 = "67";
//   let setBrushPwm250 = "68";
//   let setWheelCurrent = "GWC";
//   let setBrushCurrent = "GBC";
//   let batteryVoltage = "63";
//   let temp = "60";
//   let cleanRight = "C3";
//   let cleanLeft = "C2";

//   let moveLeft = "C4";
//   let moveRight = "C5";
//   // let returnToDock = "D1";
//   // let cleaningStart = "C1";
//   let weatherLockEnable = "WE";
//   let weatherLockDisable = "WD";
//   let testModeOn = "1A";
//   let testModeOff = "1B";
//   let setDockAtLeft = "65"; //D@
//   let setDockAtRight = "64";

//   let setWheelSpeed = "RWS";
//   let setBrushSpeed = "RBS";
//   let intelligentStart = "13";
//   // let getPwmWheel = "PW";
//   // let getPwmBrush = "PB";
//   // let getAntiStuckBrushSpeed = "SP"; // PA180
//   // let getBrushCurrent = "SB"; // CB
//   // let getWheelCurrent = "SW"; // CW
//   // let getEepromWheelCurrent = "EW";
//   // let getEepromBrushCurrent = "EB";

//   let resetBoard = "RE";
//   // let atDock = "AD";
//   let CheckDock = "ZD";
//   let CheckSensorState = "CD";
//   let checkManualMode = "AU";
//   let checkActuatorMode = "LE";
//   let checkBrushCurrent = "EB";
//   let checkWheelCurrent = "EW";
//   let checkWheelSpeed = "PW";
//   let checkBrushSpeed = "PB";
//   let checkTracker = "KE";

//   let setManualEnable = "62";
//   let setManualDisable = "61";

//   let setActuatorEnable = "ILE";
//   let setActuatorDisable = "ILD";

//   let setTrackerEnable = "KTE";
//   let setTrackerDisable = "KTD";

//   let newCleaningStart = "01";

//   const [loadingRow, setLoadingRow] = useState(null); // Track the row index
//   const [commandButton, setCommandButton] = useState(null); // Track the row index
//   const [weatherErrorModal, setWeatherErrorModal] = useState(false);
//   const [weatherError, setWeatherError] = useState(null);

//   const [customDownlink, setCustomDownlink] = useState("");
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(10);
//   const [sent_custom_to_all, setSentCustomToAll] = useState(false);

//   useEffect(() => {
//     const getRobots = async () => {
//       try {
//         dispatch({ type: "FETCH_ROBOTS_REQUEST" });
//         const response = await axios.get(
//           `/api/v1/robots/get-robotsno-by-site-and-block/${site_id}/${block}`,
//           {
//             // headers: { Authorization: `Bearer ${authtoken}` },
//             withCredentials: true,
//           },
//         );
//         // robots/site/taypro_office/Block-1/
//         const robotsData = response.data.data; // Ensure correct data access

//         dispatch({ type: "FETCH_ROBOTS_SUCCESS", payload: robotsData });

//         // const filteredRobots = robotsData.sort(
//         //   (a, b) => a.robot_no - b.robot_no
//         // );

//         // setSiteRobots(filteredRobots);
//       } catch (error) {
//         dispatch({
//           type: "FETCH_ROBOTS_FAIL",
//           payload: error.response.data.message || error.response.data.error,
//         });
//       }
//     };

//     getRobots();
//   }, [block, site_id]);

//   useEffect(() => {
//     let pagination = {
//       pg: page,
//       limit: limit,
//     };

//     const getDownlinks = async () => {
//       try {
//         dispatch({ type: "FETCH_REQUEST" });
//         const response = await axios.post(
//           `/api/v1/downlinks/get-downlinks`,
//           pagination,
//           {
//             // headers: { Authorization: `Bearer ${authtoken}` },
//             withCredentials: true,
//           },
//         );

//         let total = Math.ceil(
//           Number(response.data.total) / Number(response.data.limit),
//         );
//         let next = response.data.hasNextPage;
//         let prev = response.data.hasPrevPage;
//         dispatch({
//           type: "FETCH_SUCCESS",
//           payload: {
//             data: response.data.data,
//             totalPages: total,
//             hasNextPage: next,
//             hasPrevPage: prev,
//           },
//         });
//       } catch (error) {
//         dispatch({
//           type: "FETCH_FAIL",
//           payload: error.response ? error.response.data.message : error.message,
//         });
//       }
//     };

//     if (successDelete) {
//       dispatch({ type: "DELETE_RESET" });
//     } else {
//       getDownlinks();
//     }
//   }, [successDelete, page, limit]);

//   useEffect(() => {
//     const getRobot = async () => {
//       try {
//         dispatch({ type: "FETCH_ROBOT_REQUEST" });
//         const response = await axios.get(
//           `/api/v1/robots/get-robot-using-robot-no/${robot_no}`,
//           {
//             // headers: { Authorization: `Bearer ${authtoken}` },
//             withCredentials: true,
//           },
//         );

//         dispatch({ type: "FETCH_ROBOT_SUCCESS", payload: response.data.data });
//       } catch (error) {
//         dispatch({
//           type: "FETCH_ROBOT_FAIL",
//           payload: error.response
//             ? error.response.data.message
//             : error.response.data.error,
//         });
//       }
//     };

//     getRobot();
//   }, [robot_no]);

//   const filteredDownlink = downlinks.filter((item) =>
//     item.downlink.toLowerCase().includes(searchTerm.toLowerCase()),
//   );

//   const deleteDownlink = async (downlink) => {
//     if (
//       window.confirm(
//         `Are you sure you want to delete downlink ${downlink.downlink}🚫`,
//       )
//     ) {
//       try {
//         await axios.delete(`/api/v1/downlinks/${downlink._id}`, {
//           // headers: { Authorization: `Bearer ${authtoken}` },
//           withCredentials: true,
//         });

//         toast.success("Downlink deleted successfully");
//         dispatch({ type: "DELETE_SUCCESS" });
//       } catch (err) {
//         toast.error(err.response ? err.response.data.message : err.message);
//         dispatch({ type: "DELETE_FAIL" });
//       }
//     }
//   };

//   const blockwiserobots =
//     robots?.length > 0 ? robots.filter((robot) => robot.block === block) : [];

//   const sendsingleDownlink = async (command, index) => {
//     setLoadingRow(index);
//     setCommandButton(index);
//     //deveui,command,robot_no,site_id,lora_no......
//     // let robotdownlink =;
//     dispatch({ type: "SEND_DOWNLINK_REQUEST" });
//     try {
//       const data = await axios.post(
//         // "/api/v1/robots/downlink",
//         "/api/v1/robots/send-mqtt-downlink",
//         {
//           deveui: robot.deveui,
//           robot_no: robot.robot_no,
//           site_id: site_id,
//           payload: command,
//           lora_no: robot.lora_no,
//         },
//         {
//           // headers: { Authorization: `Bearer ${authtoken}` },
//           withCredentials: true,
//         },
//       );

//       dispatch({ type: "SEND_DOWNLINK_SUCCESS" });
//       toast.success(data.data.message);
//     } catch (error) {
//       dispatch({
//         type: "SEND_DOWNLINK_FAIL",
//         payload: error.response?.data?.message || error.response.data.error,
//       });

//       toast.error(error.response.data.message || error.response.data.error);
//     }
//     setLoadingRow(null);
//     setCommandButton(null);
//   };

//   const sendsingleintelligentDownlink = async (command, index) => {
//     setCommandButton(index);
//     dispatch({ type: "SEND_DOWNLINK_REQUEST" });
//     try {
//       const data = await axios.post(
//         "/api/v1/robots/intelligent-command-weather-check",
//         {
//           deveui: robot.deveui,
//           robot_no: robot.robot_no,
//           site_id: site_id,
//           payload: command,
//           lora_no: robot.lora_no,
//         },
//         { withCredentials: true },
//       );
//       dispatch({ type: "SEND_DOWNLINK_SUCCESS" });
//       toast.success(data.data.message);
//     } catch (error) {
//       const errData = error.response?.data || {};
//       dispatch({
//         type: "SEND_DOWNLINK_FAIL",
//         payload: errData.message || errData.error || "Command failed",
//       });
//       if (errData.weather || errData.failed_field || errData.checks) {
//         setWeatherError({
//           message: errData.message || errData.error || "Weather check failed",
//           failed_field: errData.failed_field,
//           failed_fields: errData.failed_fields || [],
//           failed_count: errData.failed_count ?? 0,
//           passed_count: errData.passed_count ?? 0,
//           total_checks: errData.total_checks ?? 0,
//           checks: errData.checks || [],
//           weather: errData.weather || {},
//           thresholds: errData.thresholds || {},
//         });
//         setWeatherErrorModal(true);
//       } else {
//         toast.error(errData.message || errData.error || "Command failed");
//       }
//     }
//     setCommandButton(null);
//   };

//   const sendCustomDownlink = async (command, sent_custom_to_all) => {
//     let robotdownlink = {};

//     if (sent_custom_to_all) {
//       let robots = blockwiserobots.map((robot) => ({
//         deveui: robot.deveui,
//         robot_no: robot.robot_no,
//       }));
//       robotdownlink = {
//         robots,
//         // deveui: [allrobots.deveui],
//         // robot_no: [allrobots.robot_no],
//         block: block,
//         site_id: site_id,
//         command: command,
//       };
//     } else {
//       //deveui,command,robot_no,site_id,lora_no
//       robotdownlink = {
//         robots: [
//           {
//             deveui: robot.deveui,
//             robot_no: robot.robot_no,
//           },
//         ],

//         site_id: site_id,
//         command: command,
//         lora_no: robot.lora_no,
//       };
//     }
//     dispatch({ type: "SEND_DOWNLINK_REQUEST" });
//     try {
//       const data = await axios.post(
//         "/api/v1/robots/custom-downlink",
//         robotdownlink,
//         {
//           // headers: { Authorization: `Bearer ${authtoken}` },
//           withCredentials: true,
//         },
//       );

//       toast.success(data.data.message);
//       dispatch({ type: "SEND_DOWNLINK_SUCCESS" });
//     } catch (error) {
//       dispatch({
//         type: "SEND_DOWNLINK_FAIL",
//         payload: error.response?.data?.message || error.response?.data?.error,
//       });

//       toast.error(error.response.data.message || error.response?.data?.error);
//     }
//     setCustomDownlink("");
//     setSentCustomToAll(false);
//     setLoadingRow(null);
//     setCommandButton(null);
//   };

//   const sendMulticastDownlink = async (command, index) => {
//     let alldeveuis = blockwiserobots.map((robot) => robot.deveui); // Corrected arrow function syntax
//     let allrobotnos = blockwiserobots.map((robot) => robot.robot_no); // Corrected arrow function syntax
//     setCommandButton(index);
//     //deveui,command,robot_no,site_id,lora_no
//     let robotdownlink = {
//       deveui: alldeveuis,
//       block: block,
//       site_id: site_id,
//       command: command,
//       robot_no: allrobotnos,
//     };
//     dispatch({ type: "SEND_DOWNLINK_REQUEST" });
//     try {
//       const data = await axios.post(
//         // "/api/v1/robots/multicast-downlink",
//         "/api/v1/robots/send-mqtt-multicast-downlink",

//         robotdownlink,
//         {
//           // headers: { Authorization: `Bearer ${authtoken}` },
//           withCredentials: true,
//         },
//       );

//       dispatch({ type: "SEND_DOWNLINK_SUCCESS" });

//       toast.success(data.data.message);
//     } catch (error) {
//       dispatch({
//         type: "SEND_DOWNLINK_FAIL",
//         payload: error.response?.data?.message || error.response.data.error,
//       });

//       toast.error(error.response?.data?.message || error.response.data.error);
//     }

//     setCommandButton(null);
//   };

//   const handlePageInputChange = (e) => {
//     setPageInput(e.target.value);
//   };

//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= totalPages) {
//       setPage(newPage);
//     }
//   };

//   const handlePageInputSubmit = () => {
//     const pageNumber = parseInt(pageInput);
//     if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
//       handlePageChange(pageNumber);
//     }
//   };

//   let adminroute = "";

//   if (userInfo.role === "Master Admin") {
//     adminroute = "master-admin";
//   } else if (userInfo.role === "Service Admin") {
//     adminroute = "service-admin";
//   } else if (userInfo.role === "Project Admin") {
//     adminroute = "project-admin";
//   } else if (userInfo?.role === "Master User") {
//     adminroute = "master-user";
//   } else if (userInfo?.role === "Service User") {
//     adminroute = "service-user";
//   } else if (userInfo?.role === "Project User") {
//     adminroute = "project-user";
//   } else if (userInfo?.role === "Factory Admin") {
//     adminroute = "factory-admin";
//   }

//   const TextToBase64 = (text) => {
//     const base64 = btoa(text);
//     setBase64Text(base64);
//     setTimeout(() => {
//       setBase64Text("");
//     }, 5000);
//     setText("");
//     return base64;
//   };
//   error && <CBadge color="danger">{error}</CBadge>;

//   let WheelSpeedBadge = "";

//   if (robot.wheel_motor_speed > 100 && robot.wheel_motor_speed <= 170) {
//     WheelSpeedBadge = "primary";
//   } else if (robot.wheel_motor_speed > 170 && robot.wheel_motor_speed <= 210) {
//     WheelSpeedBadge = "warning";
//   } else if (robot.wheel_motor_speed > 210) {
//     WheelSpeedBadge = "success";
//   } else {
//     WheelSpeedBadge = "primary";
//   }

//   let BrushSpeedBadge = "";

//   if (robot.brush_motor_speed > 100 && robot.brush_motor_speed <= 170) {
//     BrushSpeedBadge = "primary";
//   } else if (robot.brush_motor_speed > 170 && robot.brush_motor_speed <= 210) {
//     BrushSpeedBadge = "warning";
//   } else if (robot.brush_motor_speed > 210) {
//     BrushSpeedBadge = "success";
//   } else {
//     BrushSpeedBadge = "primary";
//   }

//   return (
//     <>
//       {loadingRobots ? (
//         <div className="loading-container">
//           <LoadingSpinner />
//         </div>
//       ) : (
//         <div className="">
//           {/* Page Header */}
//           <CRow>
//             <CCol>
//               <h4 className=" text-center">
//                 <span className="text-success">{site_id} -&nbsp;</span>
//                 <span className="text-warning">{block}</span>
//                 &nbsp;-&nbsp;Robot's Configuration
//               </h4>
//             </CCol>
//           </CRow>

//           {/* Action Buttons */}
//           <CRow className="my-2">
//             <CCol>
//               <div className="d-flex flex-wrap align-items-center">
//                 <CButton
//                   className="btn btn-sm btn-secondary me-2 mb-2 shadow-sm"
//                   onClick={() => sendMulticastDownlink(start, 1)}
//                 >
//                   {commandButton === 1 ? (
//                     <>
//                       START ALL&nbsp;
//                       <LoadingSpinner />
//                     </>
//                   ) : (
//                     "START ALL"
//                   )}
//                 </CButton>
//                 <CButton
//                   className="btn btn-sm btn-danger me-2 mb-2 shadow-sm"
//                   onClick={() => sendMulticastDownlink(newCleaningStart, 44)}
//                 >
//                   {commandButton === 44 ? (
//                     <>
//                       TEST START ALL&nbsp;
//                       <LoadingSpinner />
//                     </>
//                   ) : (
//                     "TEST START ALL"
//                   )}
//                 </CButton>
//                 <CButton
//                   className="btn btn-sm btn-secondary me-2 mb-2 shadow-sm"
//                   onClick={() => sendMulticastDownlink(stop, 2)}
//                 >
//                   {commandButton === 2 ? (
//                     <>
//                       STOP ALL&nbsp;
//                       <LoadingSpinner />
//                     </>
//                   ) : (
//                     "STOP ALL"
//                   )}
//                 </CButton>
//                 <CButton
//                   className="btn btn-sm btn-secondary me-2 mb-2 shadow-sm"
//                   onClick={() => sendMulticastDownlink(returntodock, 3)}
//                 >
//                   {commandButton === 3 ? (
//                     <>
//                       RETURN TO DOCK ALL&nbsp;
//                       <LoadingSpinner />
//                     </>
//                   ) : (
//                     "RETURN TO DOCK ALL"
//                   )}
//                 </CButton>
//                 <CButton
//                   className="btn btn-sm btn-secondary me-2 mb-2 shadow-sm"
//                   onClick={() => sendMulticastDownlink(removecurrentLimit, 42)}
//                 >
//                   {commandButton === 42 ? (
//                     <>
//                       REMOVE CURRENT LIMIT ALL&nbsp;
//                       <LoadingSpinner />
//                     </>
//                   ) : (
//                     "REMOVE CURRENT LIMIT ALL"
//                   )}
//                 </CButton>
//                 <Link
//                   to={`/${adminroute}/site-management/block-management/${site_id}/${block}/${robot_no}/debug_logs`}
//                   className="btn btn-sm btn-secondary me-2 mb-2 shadow-sm"
//                 >
//                   DEBUG LOG
//                 </Link>
//                 <Link
//                   to={`/${adminroute}/site-management/block-management/${site_id}/${block}/${robot_no}/cleaning_logs`}
//                   className="btn btn-sm btn-secondary me-2 mb-2 shadow-sm"
//                 >
//                   CLEANING LOG
//                 </Link>

//                 <CDropdown className="dropdown me-2 mb-2">
//                   {robots.length > 1 ? (
//                     <CDropdownToggle
//                       size="sm"
//                       className="shadow-sm"
//                       color={robot.lora_state === 1 ? "success" : "danger"}
//                     >
//                       {robot.robot_no}
//                     </CDropdownToggle>
//                   ) : (
//                     <CButton
//                       size="sm"
//                       color={robot.lora_state === 1 ? "success" : "danger"}
//                       className="shadow-sm"
//                       disabled // since no dropdown when single robot
//                     >
//                       {robot.robot_no}
//                     </CButton>
//                   )}

//                   {robots.length > 1 && (
//                     <CDropdownMenu className="z-3 px-2 py-1 dropdown-menu-robot border">
//                       {robots.map((item, index) => (
//                         <Link
//                           key={index}
//                           to={
//                             item.robot_no === robot_no
//                               ? `#`
//                               : `/${adminroute}/site-management/block-management/${site_id}/${block}/${item.robot_no}`
//                           }
//                           className="dopdown-item-robot "
//                         >
//                           <CBadge
//                             color={`${
//                               item.lora_state === 1 ? "success" : "danger"
//                             }`}
//                             className="p-2 my-1"
//                           >
//                             {item.robot_no}{" "}
//                           </CBadge>
//                         </Link>
//                       ))}
//                     </CDropdownMenu>
//                   )}
//                 </CDropdown>

//                 {userInfo?.role === "Master Admin" && robot?._id && (
//                   <>
//                     <Link
//                       className="btn btn-sm btn-outline-primary me-2 mb-2"
//                       to={`/${adminroute}/robots/view/${robot._id}`}
//                     >
//                       View Robot
//                     </Link>
//                     <Link
//                       to={`/${adminroute}/robots/update/${robot._id}`}
//                       className="btn btn-sm btn-outline-warning me-2 mb-2"
//                     >
//                       Update Robot
//                     </Link>
//                     {/* /robot-event-and-frames/:robot_no */}
//                   </>
//                 )}
//                 <Link
//                   to={`event-and-frames/${robot.deveui}`}
//                   className="btn btn-sm btn-outline-info me-2 mb-2"
//                 >
//                   View Robot Events and Frames
//                 </Link>
//               </div>
//             </CCol>
//           </CRow>

//           <CRow className="my-2">
//             <CCol></CCol>
//           </CRow>
//           {loadingRobot ? (
//             <LoadingSpinner />
//           ) : (
//             <div>
//               <CRow>
//                 {/* First Card */}
//                 <CCol md={5} className="mt-2">
//                   <CCard className="h-100 border-0 shadow-sm rounded-3">
//                     <CCardBody className="p-3">
//                       {/* Top Section: Robot No + Battery */}
//                       <div className="d-flex justify-content-between align-items-center mb-2">
//                         <h6 className=" mb-0"><RobotNoLink robot={robot} /></h6>
//                         <span className="px-2 py-1">
//                           🔋 {robot.battery_voltage}
//                           <span className="mx-1">%</span>{" "}
//                         </span>
//                       </div>

//                       {/* Info Grid */}
//                       <CRow className="text-center mb-2">
//                         <CCol>
//                           <small className="text-muted">PCB</small>
//                           <div className="fw-semibold">{robot.pcb_version}</div>
//                         </CCol>
//                         <CCol>
//                           <small className="text-muted">Firmware</small>
//                           <div className="fw-semibold">{robot.version}</div>
//                         </CCol>
//                         <CCol>
//                           <small className="text-muted">LoRa/DevEui</small>
//                           {/* <CTooltip content={robot.deveui} placement="top"> */}
//                           <div className=" text-success">
//                             {robot.lora_no ? (
//                               <span className="text-warning me-1">
//                                 {robot.lora_no}
//                               </span>
//                             ) : (
//                               ""
//                             )}
//                             /<span className="ms-1">{robot.deveui} </span>
//                           </div>
//                           {/* </CTooltip> */}
//                         </CCol>
//                       </CRow>

//                       <hr className="my-2" />

//                       {/* Speeds */}
//                       <CRow className="text-center">
//                         <CCol>
//                           <small className="text-muted">Wheel Speed</small>
//                           <div>
//                             <CBadge
//                               color={`${WheelSpeedBadge}`}
//                               className="px-3 py-2 rounded-pill"
//                             >
//                               {robot.wheel_motor_speed_string} -{" "}
//                               {robot.wheel_motor_speed}
//                             </CBadge>
//                           </div>
//                         </CCol>
//                         <CCol>
//                           <small className="text-muted">Brush Speed</small>
//                           <div>
//                             <CBadge
//                               color={`${BrushSpeedBadge}`}
//                               className="px-3 py-2 rounded-pill"
//                             >
//                               {robot.brush_motor_speed_string} -{" "}
//                               {robot.brush_motor_speed}
//                             </CBadge>
//                           </div>
//                         </CCol>
//                       </CRow>
//                     </CCardBody>
//                   </CCard>
//                 </CCol>

//                 {/* Second Card */}
//                 <CCol md={4} className="mt-3">
//                   <CCard className="h-100 border-0 shadow-sm">
//                     <CCardBody className="d-flex flex-column justify-content-start p-3">
//                       {/* Top Row: Status */}
//                       <div className="d-flex justify-content-between align-items-start mb-3">
//                         <div>
//                           <span
//                             className={`fw-bold text-${
//                               robot.lora_state === 1 ? "success" : "danger"
//                             }`}
//                             style={{ fontSize: "16px" }}
//                           >
//                             {robot.lora_state === 1 ? "Online" : "Offline"}
//                           </span>
//                         </div>
//                         {/* Middle Row: Stuck Count */}
//                         <div className="">
//                           {/* <span className="text-danger fw-semibold">
//                             SC: {robot.stuck_count}
//                           </span> */}
//                           <CBadge color="warning" shape="rounded-pill">
//                             {robot.battery_type}
//                           </CBadge>
//                         </div>
//                       </div>

//                       {/* Bottom Row: Last Uplink */}
//                       <div className="d-flex flex-column">
//                         {!robot.last_uplink ||
//                         isNaN(new Date(robot.last_uplink).getTime()) ? (
//                           <CBadge color="danger" shape="rounded-pill">
//                             Robot is not activated
//                           </CBadge>
//                         ) : (
//                           <>
//                             <span
//                               className="text-success "
//                               style={{ cursor: "pointer" }}
//                             >
//                               <span className="me-2">Last Uplink</span>:
//                               <span className="text-white mx-2">
//                                 {formatDistanceToNow(
//                                   new Date(robot.last_uplink),
//                                   {
//                                     addSuffix: true,
//                                   },
//                                 )}
//                               </span>
//                             </span>

//                             <div className="">
//                               <span className="me-2 text-success">
//                                 Last Status
//                               </span>
//                               :
//                               <span className="ms-2">
//                                 {" "}
//                                 {robot.last_status || "-"}
//                               </span>
//                             </div>
//                             <span className="">
//                               ({new Date(robot.last_uplink).toLocaleString()})
//                             </span>
//                           </>
//                         )}
//                       </div>
//                     </CCardBody>
//                   </CCard>
//                 </CCol>

//                 {/* Third Card (Custom Downlink) */}
//                 {(userInfo.role === "Master Admin" ||
//                   userInfo.role === "Master User") && (
//                   <CCol md={3} className="mt-2">
//                     <CCard
//                       className="shadow border-0 "
//                       style={{ height: "100%" }}
//                     >
//                       <CCardBody>
//                         <div className="d-flex justify-content-between align-items-center">
//                           <h6 className="fw-bold">Custom Downlink</h6>

//                           <FaCircleInfo
//                             className="text-primary"
//                             style={{ cursor: "pointer" }}
//                             onClick={() => setModalVisible(true)}
//                           />
//                         </div>
//                         {/* <form className="position-relative mt-4">
//                           <CFormCheck
//                             type="checkbox"
//                             className="my-1"
//                             label="Send to all"
//                             id="sent_custom_to_all"
//                             checked={sent_custom_to_all}
//                             onChange={(e) => {
//                               setSentCustomToAll(e.target.checked);
//                             }}
//                             style={{
//                               cursor: "pointer",
//                               transform: "scale(1.1)",
//                               marginBottom: "0",
//                             }}
//                           />

//                           <input
//                             type="text"
//                             className="form-control"
//                             placeholder="Enter command"
//                             name={customDownlink}
//                             onChange={(e) => setCustomDownlink(e.target.value)}
//                             onKeyDown={(e) => {
//                               if (e.key === "Enter" && customDownlink) {
//                                 e.preventDefault(); // Prevent form submission
//                                 sendCustomDownlink(
//                                   customDownlink,
//                                   sent_custom_to_all,
//                                 ); // Trigger the same function as the button
//                               }
//                             }}
//                           />
//                           <CButton
//                             disabled={!customDownlink}
//                             onClick={() =>
//                               sendCustomDownlink(
//                                 customDownlink,
//                                 sent_custom_to_all,
//                               )
//                             }
//                             type="button"
//                             className="d-flex justify-content-center align-items-center btn-sm send-button "
//                           >
//                             <span className="d-flex justify-content-center align-items-center">
//                               {sendingCommandloading ? (
//                                 <LoadingSpinner />
//                               ) : (
//                                 <FaArrowUp />
//                               )}
//                             </span>
//                           </CButton>
//                         </form> */}
//                         <form className="mt-4">
//                           <CFormCheck
//                             type="checkbox"
//                             className="my-2"
//                             label="Send to all"
//                             id="sent_custom_to_all"
//                             checked={sent_custom_to_all}
//                             onChange={(e) =>
//                               setSentCustomToAll(e.target.checked)
//                             }
//                             style={{
//                               cursor: "pointer",
//                               transform: "scale(1.1)",
//                               marginBottom: "6px",
//                             }}
//                           />

//                           {/* INPUT WRAPPER */}
//                           <div className="position-relative">
//                             <input
//                               type="text"
//                               className="form-control pe-5"
//                               placeholder="Enter command"
//                               name={customDownlink}
//                               onChange={(e) =>
//                                 setCustomDownlink(e.target.value)
//                               }
//                               onKeyDown={(e) => {
//                                 if (e.key === "Enter" && customDownlink) {
//                                   e.preventDefault();
//                                   sendCustomDownlink(
//                                     customDownlink,
//                                     sent_custom_to_all,
//                                   );
//                                 }
//                               }}
//                             />

//                             <CButton
//                               disabled={!customDownlink}
//                               onClick={() =>
//                                 sendCustomDownlink(
//                                   customDownlink,
//                                   sent_custom_to_all,
//                                 )
//                               }
//                               type="button"
//                               className="send-button d-flex justify-content-center align-items-center btn-sm"
//                             >
//                               {sendingCommandloading ? (
//                                 <LoadingSpinner />
//                               ) : (
//                                 <FaArrowUp />
//                               )}
//                             </CButton>
//                           </div>
//                         </form>
//                       </CCardBody>
//                     </CCard>
//                   </CCol>
//                 )}
//               </CRow>

//               {/* Modal for Commands */}
//               <CModal
//                 scrollable
//                 backdrop="static"
//                 visible={modalVisible}
//                 onClose={() => setModalVisible(false)}
//                 size="xl"
//               >
//                 <CModalHeader>
//                   <CModalTitle>Custom Downlink</CModalTitle>
//                 </CModalHeader>
//                 <CModalBody>
//                   <CRow className="d-flex justify-content-between">
//                     <CCol xs={12} sm={10} md={6} lg={4}>
//                       <CInputGroup className="mb-3">
//                         <CFormInput
//                           type="text"
//                           placeholder="Search downlink..."
//                           value={searchTerm}
//                           onChange={(e) => setSearchTerm(e.target.value)}
//                         />
//                       </CInputGroup>
//                     </CCol>
//                     <CCol
//                       className="d-flex justify-content-end align-items-center"
//                       xs={12}
//                       sm={10}
//                       md={6}
//                       lg={4}
//                     >
//                       <Link
//                         className="btn btn-sm btn-warning justify-content-end"
//                         size="md"
//                         // to="/master-admin/site-management/add-downlink"
//                         to={`/master-admin/site-management/block-management/${site_id}/${block}/${robot_no}/add-downlink`}
//                       >
//                         Add Downlink
//                       </Link>
//                     </CCol>
//                   </CRow>
//                   <CTable responsive hover bordered>
//                     <CTableHead color="secondary">
//                       <CTableRow>
//                         <CTableHeaderCell style={{ minWidth: "70px" }}>
//                           Sr No
//                         </CTableHeaderCell>
//                         <CTableHeaderCell style={{ minWidth: "150px" }}>
//                           Command
//                         </CTableHeaderCell>
//                         <CTableHeaderCell style={{ minWidth: "150px" }}>
//                           Decoded String
//                         </CTableHeaderCell>
//                         <CTableHeaderCell style={{ minWidth: "120px" }}>
//                           Hexa decimal
//                         </CTableHeaderCell>
//                         <CTableHeaderCell style={{ minWidth: "120px" }}>
//                           Uplink
//                         </CTableHeaderCell>
//                         <CTableHeaderCell style={{ minWidth: "240px" }}>
//                           Description
//                         </CTableHeaderCell>
//                         <CTableHeaderCell
//                           style={{ minWidth: "250px" }}
//                           className="text-center"
//                         >
//                           Action
//                         </CTableHeaderCell>
//                       </CTableRow>
//                     </CTableHead>

//                     <CTableBody>
//                       {loading ? (
//                         <CTableRow className="text-center">
//                           <CTableDataCell colSpan={7}>
//                             <LoadingSpinner />
//                           </CTableDataCell>
//                         </CTableRow>
//                       ) : error ? (
//                         <CTableRow>
//                           <CTableDataCell
//                             colSpan={7}
//                             className="text-center text-danger"
//                           >
//                             {error}
//                           </CTableDataCell>
//                         </CTableRow>
//                       ) : filteredDownlink.length > 0 ? (
//                         filteredDownlink.map((item, index) => (
//                           <CTableRow key={index}>
//                             <CTableDataCell>{index + 1}</CTableDataCell>

//                             <CTableDataCell>
//                               <Link
//                                 className=" "
//                                 style={{ textDecoration: "none" }}
//                                 onClick={() =>
//                                   sendsingleDownlink(item.downlink, index)
//                                 }
//                               >
//                                 {item.downlink}&nbsp;
//                                 {loadingRow === index ? <LoadingSpinner /> : ""}
//                               </Link>
//                             </CTableDataCell>
//                             <CTableDataCell>
//                               {item.decodedString}
//                             </CTableDataCell>
//                             <CTableDataCell>{item.hexadecimal}</CTableDataCell>
//                             <CTableDataCell>{item.uplink}</CTableDataCell>
//                             <CTableDataCell>
//                               {item.additionalInfo}
//                             </CTableDataCell>
//                             <CTableDataCell>
//                               <div className="d-flex justify-content-center align-items-center">
//                                 <Link
//                                   to={`/master-admin/site-management/block-management/${site_id}/${block}/${robot_no}/view-downlink/${item._id}`}
//                                   color=""
//                                   size="sm"
//                                   className="btn btn-sm btn-secondary m-1"
//                                 >
//                                   View
//                                 </Link>

//                                 <Link
//                                   to={`/master-admin/site-management/block-management/${site_id}/${block}/${robot_no}/update-downlink/${item._id}`}
//                                   color="warning"
//                                   size="sm"
//                                   className="btn btn-sm btn-warning m-1"
//                                 >
//                                   Edit
//                                 </Link>

//                                 <Link
//                                   color="danger"
//                                   size="sm"
//                                   className=" btn btn-sm btn-danger m-1 text-white"
//                                   onClick={() => deleteDownlink(item)}
//                                 >
//                                   Delete
//                                 </Link>
//                               </div>
//                             </CTableDataCell>
//                           </CTableRow>
//                         ))
//                       ) : (
//                         <CTableRow>
//                           <CTableDataCell className="text-center" colSpan={7}>
//                             No Data Found.
//                           </CTableDataCell>
//                         </CTableRow>
//                       )}
//                     </CTableBody>
//                   </CTable>

//                   <PaginateInput
//                     page={page}
//                     totalPages={totalPages}
//                     hasPrevPage={hasPrevPage}
//                     hasNextPage={hasNextPage}
//                     pageInput={pageInput}
//                     handlePageChange={handlePageChange}
//                     handlePageInputChange={handlePageInputChange}
//                     handlePageInputSubmit={handlePageInputSubmit}
//                     limit={limit}
//                     handleLimitChange={setLimit} // New prop
//                   />
//                 </CModalBody>

//                 <CModalFooter>
//                   <CButton
//                     size="sm"
//                     color="secondary"
//                     onClick={() => setModalVisible(false)}
//                   >
//                     Close
//                   </CButton>
//                 </CModalFooter>
//               </CModal>

//               <CRow className="my-2">
//                 {/* First Card - Cleaning Cycle */}
//                 <CCol md={3} className="mt-2">
//                   <CCard
//                     className="shadow border-0 "
//                     style={{ height: "100%" }}
//                   >
//                     <CCardBody>
//                       <p>Cleaning Cycle</p>
//                       <CButton
//                         className="btn btn-sm btn-secondary m-1 shadow"
//                         onClick={() => sendsingleDownlink(start, 45)}
//                       >
//                         {commandButton === 45 ? (
//                           <>
//                             START&nbsp;
//                             <LoadingSpinner />
//                           </>
//                         ) : (
//                           "START"
//                         )}
//                       </CButton>

//                       <CButton
//                         className="btn btn-sm btn-secondary m-1 shadow-sm"
//                         onClick={() => sendsingleDownlink(stop, 2)}
//                       >
//                         {commandButton === 2 ? (
//                           <>
//                             STOP&nbsp;
//                             <LoadingSpinner />
//                           </>
//                         ) : (
//                           "STOP"
//                         )}
//                       </CButton>
//                       <CButton
//                         className="btn btn-sm btn-secondary m-1 shadow-sm"
//                         onClick={() => sendsingleDownlink(returntodock, 3)}
//                       >
//                         {commandButton === 3 ? (
//                           <>
//                             RETURN&nbsp;
//                             <LoadingSpinner />
//                           </>
//                         ) : (
//                           "RETURN"
//                         )}
//                       </CButton>
//                       <div className=" border-top">
//                         {(userInfo.role === "Master Admin" ||
//                           userInfo.role === "Service Admin") && (
//                           <>
//                             <CButton
//                               className="btn btn-sm btn-info m-1 shadow"
//                               onClick={() =>
//                                 sendsingleintelligentDownlink(start, 47)
//                               }
//                             >
//                               {commandButton === 47 ? (
//                                 <>
//                                   Checking weather&nbsp;
//                                   <LoadingSpinner />
//                                 </>
//                               ) : (
//                                 "Check Weather & Start"
//                               )}
//                             </CButton>
//                             <CButton
//                               className="btn btn-sm btn-warning m-1 shadow"
//                               onClick={() =>
//                                 sendsingleDownlink(partialStart, 43)
//                               }
//                             >
//                               {commandButton === 43 ? (
//                                 <>
//                                   Partial Start&nbsp;
//                                   <LoadingSpinner />
//                                 </>
//                               ) : (
//                                 "Partial Start"
//                               )}
//                             </CButton>
//                             <CButton
//                               className="btn btn-sm btn-warning m-1 shadow"
//                               onClick={() =>
//                                 sendsingleDownlink(intelligentStart, 46)
//                               }
//                             >
//                               {commandButton === 46 ? (
//                                 <>
//                                   Intelligent Start&nbsp;
//                                   <LoadingSpinner />
//                                 </>
//                               ) : (
//                                 "Intelligent Start"
//                               )}
//                             </CButton>
//                           </>
//                         )}
//                       </div>
//                     </CCardBody>
//                   </CCard>
//                 </CCol>

//                 {/* Second Card - Set Wheel Speed */}
//                 <CCol md={3} className="mt-2">
//                   <CCard
//                     className="shadow border-0 "
//                     style={{ height: "100%" }}
//                   >
//                     <CCardBody>
//                       <p>Set Wheel Speed</p>
//                       <CButton
//                         className="btn btn-sm btn-secondary m-1 shadow-sm"
//                         onClick={() => sendsingleDownlink(setWheelPwm100, 4)}
//                       >
//                         {commandButton === 4 ? (
//                           <>
//                             LOW&nbsp;
//                             <LoadingSpinner />
//                           </>
//                         ) : (
//                           "LOW"
//                         )}
//                       </CButton>
//                       <CButton
//                         className="btn btn-sm btn-secondary m-1 shadow-sm"
//                         onClick={() => sendsingleDownlink(setWheelPwm200, 5)}
//                       >
//                         {commandButton === 5 ? (
//                           <>
//                             MEDIUM&nbsp;
//                             <LoadingSpinner />
//                           </>
//                         ) : (
//                           "MEDIUM"
//                         )}
//                       </CButton>
//                       <CButton
//                         className="btn btn-sm btn-secondary m-1 shadow-sm"
//                         onClick={() => sendsingleDownlink(setWheelPwm250, 6)}
//                       >
//                         {commandButton === 6 ? (
//                           <>
//                             HIGH&nbsp;
//                             <LoadingSpinner />
//                           </>
//                         ) : (
//                           "HIGH"
//                         )}
//                       </CButton>
//                     </CCardBody>
//                   </CCard>
//                 </CCol>

//                 {/* Third Card - Set Brush Speed */}
//                 <CCol md={3} className="mt-2">
//                   <CCard
//                     className="shadow border-0 "
//                     style={{ height: "100%" }}
//                   >
//                     <CCardBody>
//                       <p>Set Brush Speed</p>
//                       <CButton
//                         className="btn btn-sm btn-secondary m-1 shadow-sm"
//                         onClick={() => sendsingleDownlink(setBrushPwm100, 7)}
//                       >
//                         {commandButton === 7 ? (
//                           <>
//                             LOW&nbsp;
//                             <LoadingSpinner />
//                           </>
//                         ) : (
//                           "LOW"
//                         )}
//                       </CButton>
//                       <CButton
//                         className="btn btn-sm btn-secondary m-1 shadow-sm"
//                         onClick={() => sendsingleDownlink(setBrushPwm200, 8)}
//                       >
//                         {commandButton === 8 ? (
//                           <>
//                             MEDIUM&nbsp;
//                             <LoadingSpinner />
//                           </>
//                         ) : (
//                           "MEDIUM"
//                         )}
//                       </CButton>
//                       <CButton
//                         className="btn btn-sm btn-secondary m-1 shadow-sm"
//                         onClick={() => sendsingleDownlink(setBrushPwm250, 9)}
//                       >
//                         {commandButton === 9 ? (
//                           <>
//                             HIGH&nbsp;
//                             <LoadingSpinner />
//                           </>
//                         ) : (
//                           "HIGH"
//                         )}
//                       </CButton>
//                     </CCardBody>
//                   </CCard>
//                 </CCol>

//                 {/* Fourth Card - Text To Base64 */}
//                 {(userInfo.role === "Master Admin" ||
//                   userInfo.role === "Service Admin") && (
//                   <CCol md={3} className="mt-2">
//                     <CCard
//                       className="shadow border-0 "
//                       style={{ height: "100%" }}
//                     >
//                       <CCardBody>
//                         <div className="d-flex justify-content-between align-items-center">
//                           <h6 className="fw-bold">Text to Base64</h6>
//                           <span className="text-danger fst-italic">
//                             {base64Text}
//                           </span>
//                         </div>
//                         <form className="position-relative mt-4">
//                           <input
//                             type="text"
//                             className="form-control"
//                             placeholder="Enter value"
//                             value={text}
//                             onChange={(e) => setText(e.target.value)}
//                           />
//                           <CButton
//                             onClick={() => TextToBase64(text)}
//                             type="button"
//                             className="d-flex justify-content-center align-items-center btn-sm send-button "
//                           >
//                             <span className="d-flex justify-content-center align-items-center">
//                               <FaArrowUp />
//                             </span>
//                           </CButton>
//                         </form>
//                       </CCardBody>
//                     </CCard>
//                   </CCol>
//                 )}
//               </CRow>

//               {/* Fourth Row */}
//               <CRow className="my-2">
//                 {(userInfo.role === "Master Admin" ||
//                   userInfo.role === "Service Admin") && (
//                   <>
//                     {/* Card 1 - Custom Current */}
//                     <CCol md={3} className="mt-2">
//                       <CCard
//                         className="shadow border-0"
//                         style={{ height: "100%" }}
//                       >
//                         <CCardBody>
//                           <div className="d-flex justify-content-between align-items-center mb-3">
//                             <p className="mb-0">Custom Current</p>
//                             <CButton className="btn btn-sm btn-secondary me-2 mb-2">
//                               Remove Current Limit
//                             </CButton>
//                           </div>

//                           {/* Wheel Current */}
//                           <form className="position-relative mb-3 mt-4">
//                             <input
//                               type="text"
//                               className="form-control"
//                               placeholder="Enter Wheel Current"
//                               value={wheelCurrentValue}
//                               onChange={(e) =>
//                                 setWheelCurrentValue(e.target.value)
//                               }
//                             />
//                             <CButton
//                               disabled={!wheelCurrentValue}
//                               onClick={() =>
//                                 sendsingleDownlink(
//                                   `${setWheelCurrent}${wheelCurrentValue}`,
//                                   10,
//                                 )
//                               }
//                               type="button"
//                               className="d-flex justify-content-center align-items-center btn-sm send-button "
//                             >
//                               {commandButton === 10 ? (
//                                 <>
//                                   <LoadingSpinner />
//                                 </>
//                               ) : (
//                                 <FaArrowUp />
//                               )}
//                             </CButton>
//                           </form>

//                           {/* Brush Current */}
//                           <div className="position-relative">
//                             <input
//                               type="text"
//                               className="form-control"
//                               placeholder="Enter Brush Current"
//                               value={brushCurrentValue}
//                               onChange={(e) =>
//                                 setBrushCurrentValue(e.target.value)
//                               }
//                             />
//                             <CButton
//                               disabled={!brushCurrentValue}
//                               type="button"
//                               className="d-flex justify-content-between align-items-center btn-sm btn-secondary position-absolute send-button shadow-sm"
//                               onClick={() =>
//                                 sendsingleDownlink(
//                                   `${setBrushCurrent}${brushCurrentValue}`,
//                                   11,
//                                 )
//                               }
//                             >
//                               {commandButton === 11 ? (
//                                 <>
//                                   <LoadingSpinner />
//                                 </>
//                               ) : (
//                                 <FaArrowUp />
//                               )}
//                             </CButton>
//                           </div>
//                         </CCardBody>
//                       </CCard>
//                     </CCol>

//                     {/* Card 2 - Speed */}
//                     <CCol md={3} className="mt-2">
//                       <CCard
//                         className="shadow border-0"
//                         style={{ height: "100%" }}
//                       >
//                         <CCardBody>
//                           <div className="d-flex justify-content-between align-items-center mb-3">
//                             <p className="mb-0">Custom Speed</p>
//                             <small className="text-danger">(0-255)</small>
//                           </div>

//                           {/* Enter Speed */}
//                           <div className="position-relative mb-3">
//                             <input
//                               type="text"
//                               className="form-control"
//                               placeholder="Brush Speed"
//                               value={brushSpeedValue}
//                               onChange={(e) =>
//                                 setBrushSpeedValue(e.target.value)
//                               }
//                             />
//                             <CButton
//                               type="button"
//                               disabled={!brushSpeedValue}
//                               className="d-flex justify-content-between align-items-center btn-sm btn-secondary position-absolute send-button shadow-sm"
//                               onClick={() =>
//                                 sendsingleDownlink(
//                                   `${setBrushSpeed}${brushSpeedValue}`,
//                                   12,
//                                 )
//                               }
//                             >
//                               {commandButton === 12 ? (
//                                 <>
//                                   <LoadingSpinner />
//                                 </>
//                               ) : (
//                                 <FaArrowUp />
//                               )}
//                             </CButton>
//                           </div>

//                           {/* Brush Speed */}
//                           <div className="position-relative">
//                             <input
//                               type="text"
//                               className="form-control"
//                               placeholder="wheel Speed"
//                               value={wheelSpeedValue}
//                               onChange={(e) =>
//                                 setWheelSpeedValue(e.target.value)
//                               }
//                             />
//                             <CButton
//                               type="button"
//                               disabled={!wheelSpeedValue}
//                               className="d-flex justify-content-between align-items-center btn-sm btn-secondary position-absolute send-button shadow-sm"
//                               onClick={() =>
//                                 sendsingleDownlink(
//                                   `${setWheelSpeed}${wheelSpeedValue}`,
//                                   13,
//                                 )
//                               }
//                             >
//                               {commandButton === 13 ? (
//                                 <>
//                                   <LoadingSpinner />
//                                 </>
//                               ) : (
//                                 <FaArrowUp />
//                               )}
//                             </CButton>
//                           </div>
//                         </CCardBody>
//                       </CCard>
//                     </CCol>

//                     {/* Card 3 - Direction */}
//                     <CCol md={3} className="mt-2">
//                       <CCard
//                         className="shadow border-0"
//                         style={{ height: "100%" }}
//                       >
//                         <CCardBody>
//                           <p>Direction</p>
//                           <div className="d-flex flex-wrap gap-2">
//                             <CButton
//                               className="btn btn-sm btn-secondary m-1 shadow-sm"
//                               onClick={() => sendsingleDownlink(moveLeft, 14)}
//                             >
//                               {commandButton === 14 ? (
//                                 <>
//                                   Move Left&nbsp;
//                                   <LoadingSpinner />
//                                 </>
//                               ) : (
//                                 "Move Left"
//                               )}
//                             </CButton>
//                             <CButton
//                               className="btn btn-sm btn-secondary m-1 shadow-sm"
//                               onClick={() => sendsingleDownlink(moveRight, 15)}
//                             >
//                               {commandButton === 15 ? (
//                                 <>
//                                   Move Right&nbsp;
//                                   <LoadingSpinner />
//                                 </>
//                               ) : (
//                                 "Move Right"
//                               )}
//                             </CButton>
//                             <CButton
//                               className="btn btn-sm btn-secondary m-1 shadow-sm"
//                               onClick={() => sendsingleDownlink(cleanLeft, 16)}
//                             >
//                               {commandButton === 16 ? (
//                                 <>
//                                   Clean Left&nbsp;
//                                   <LoadingSpinner />
//                                 </>
//                               ) : (
//                                 "Clean Left"
//                               )}
//                             </CButton>
//                             <CButton
//                               className="btn btn-sm btn-secondary m-1 shadow-sm"
//                               onClick={() => sendsingleDownlink(cleanRight, 17)}
//                             >
//                               {commandButton === 17 ? (
//                                 <>
//                                   Clean Right&nbsp;
//                                   <LoadingSpinner />
//                                 </>
//                               ) : (
//                                 "Clean Right"
//                               )}
//                             </CButton>
//                           </div>
//                         </CCardBody>
//                       </CCard>
//                     </CCol>

//                     {/* Card 4 - Test Mode */}
//                     <CCol md={3} className="mt-2">
//                       <CCard
//                         className="shadow border-0"
//                         style={{ height: "100%" }}
//                       >
//                         <CCardBody>
//                           <p>Test Mode ☀️</p>
//                           <CButton
//                             className="btn btn-sm btn-secondary m-1 shadow-sm"
//                             onClick={() => sendsingleDownlink(testModeOn, 18)}
//                           >
//                             {commandButton === 18 ? (
//                               <>
//                                 Enable&nbsp;
//                                 <LoadingSpinner />
//                               </>
//                             ) : (
//                               "Enable"
//                             )}
//                           </CButton>
//                           <CButton
//                             className="btn btn-sm btn-secondary m-1 shadow-sm"
//                             onClick={() => sendsingleDownlink(testModeOff, 19)}
//                           >
//                             {commandButton === 19 ? (
//                               <>
//                                 Disable&nbsp;
//                                 <LoadingSpinner />
//                               </>
//                             ) : (
//                               "Disable"
//                             )}
//                           </CButton>
//                         </CCardBody>
//                       </CCard>
//                     </CCol>
//                   </>
//                 )}
//               </CRow>

//               {/* Seventh Row */}
//               <CRow className="my-2">
//                 {(userInfo.role === "Master Admin" ||
//                   userInfo.role === "Service Admin") && (
//                   <>
//                     {/* Card 1 - Weather Lock */}
//                     <CCol md={3} className="mt-2">
//                       <CCard
//                         className="shadow border-0"
//                         style={{ height: "100%" }}
//                       >
//                         <CCardBody>
//                           <p>Weather Lock ☀️</p>
//                           <CButton
//                             className="btn btn-sm btn-secondary m-1 shadow-sm"
//                             onClick={() =>
//                               sendsingleDownlink(weatherLockEnable, 20)
//                             }
//                           >
//                             {commandButton === 20 ? (
//                               <>
//                                 Enable&nbsp;
//                                 <LoadingSpinner />
//                               </>
//                             ) : (
//                               "Enable"
//                             )}
//                           </CButton>
//                           <CButton
//                             className="btn btn-sm btn-secondary m-1 shadow-sm"
//                             onClick={() =>
//                               sendsingleDownlink(weatherLockDisable, 21)
//                             }
//                           >
//                             {commandButton === 21 ? (
//                               <>
//                                 Disable&nbsp;
//                                 <LoadingSpinner />
//                               </>
//                             ) : (
//                               "Disable"
//                             )}
//                           </CButton>
//                         </CCardBody>
//                       </CCard>
//                     </CCol>

//                     {/* Card 2 - Reset */}
//                     <CCol md={3} className="mt-2">
//                       <CCard
//                         className="shadow border-0"
//                         style={{ height: "100%" }}
//                       >
//                         <CCardBody>
//                           <p>Reset</p>
//                           <CButton
//                             className="btn btn-sm btn-secondary m-1 shadow-sm"
//                             onClick={() => sendsingleDownlink(resetBoard, 22)}
//                           >
//                             {commandButton === 22 ? (
//                               <>
//                                 Reset&nbsp;
//                                 <LoadingSpinner />
//                               </>
//                             ) : (
//                               "Reset"
//                             )}
//                           </CButton>
//                         </CCardBody>
//                       </CCard>
//                     </CCol>

//                     {/* Card 3 - Set Dock Station */}
//                     <CCol md={3} className="mt-2">
//                       <CCard
//                         className="shadow border-0"
//                         style={{ height: "100%" }}
//                       >
//                         <CCardBody>
//                           <p>Set Dock Station</p>
//                           <div className="d-flex flex-wrap gap-2">
//                             <CButton
//                               className="btn btn-sm btn-secondary m-1 shadow-sm"
//                               disabled={robot.dock === "left" ? true : false}
//                               onClick={() =>
//                                 sendsingleDownlink(setDockAtLeft, 23)
//                               }
//                             >
//                               {" "}
//                               {commandButton === 23 ? (
//                                 <>
//                                   Left&nbsp;
//                                   <LoadingSpinner />
//                                 </>
//                               ) : (
//                                 "Left"
//                               )}
//                             </CButton>
//                             <CButton
//                               className="btn btn-sm btn-secondary m-1 shadow-sm"
//                               disabled={robot.dock === "right" ? true : false}
//                               onClick={() =>
//                                 sendsingleDownlink(setDockAtRight, 24)
//                               }
//                             >
//                               {commandButton === 24 ? (
//                                 <>
//                                   Right&nbsp;
//                                   <LoadingSpinner />
//                                 </>
//                               ) : (
//                                 "Right"
//                               )}
//                             </CButton>
//                             <CButton
//                               className="btn btn-sm btn-secondary m-1 shadow-sm"
//                               onClick={() => sendsingleDownlink(CheckDock, 25)}
//                             >
//                               {commandButton === 25 ? (
//                                 <>
//                                   Check EEPROM Dock&nbsp;
//                                   <LoadingSpinner />
//                                 </>
//                               ) : (
//                                 "Check EEPROM Dock"
//                               )}
//                             </CButton>
//                             <CButton
//                               className="btn btn-sm btn-secondary m-1 shadow-sm"
//                               onClick={() =>
//                                 sendsingleDownlink(CheckSensorState, 26)
//                               }
//                             >
//                               {commandButton === 26 ? (
//                                 <>
//                                   Check Sensor State&nbsp;
//                                   <LoadingSpinner />
//                                 </>
//                               ) : (
//                                 "Check Sensor State"
//                               )}
//                             </CButton>
//                           </div>
//                         </CCardBody>
//                       </CCard>
//                     </CCol>

//                     {/* Card 4 - Motor Modes */}
//                     <CCol md={3} className="mt-2">
//                       <CCard
//                         className="shadow border-0"
//                         style={{ height: "100%" }}
//                       >
//                         <CCardBody>
//                           <p>Motor Modes</p>
//                           <div className="d-flex flex-wrap gap-2">
//                             <CButton className="btn btn-sm btn-secondary m-1 shadow-sm">
//                               40W
//                             </CButton>
//                             <CButton className="btn btn-sm btn-secondary m-1 shadow-sm">
//                               60W
//                             </CButton>
//                           </div>
//                         </CCardBody>
//                       </CCard>
//                     </CCol>
//                   </>
//                 )}
//               </CRow>

//               {/* Fifth Row */}
//               <CRow className="my-2">
//                 {(userInfo.role === "Master Admin" ||
//                   userInfo.role === "Service Admin") && (
//                   <>
//                     {/* Card 1 - Get Values */}
//                     <CCol md={3} className="mt-2">
//                       <CCard
//                         className="shadow border-0"
//                         style={{ height: "100%" }}
//                       >
//                         <CCardBody>
//                           <p>Get Values</p>
//                           <div className="d-flex flex-wrap gap-2">
//                             <CButton
//                               className="btn btn-sm btn-secondary m-1 shadow-sm"
//                               onClick={() =>
//                                 sendsingleDownlink(batteryVoltage, 27)
//                               }
//                             >
//                               {commandButton === 27 ? (
//                                 <>
//                                   Battery Voltage&nbsp;
//                                   <LoadingSpinner />
//                                 </>
//                               ) : (
//                                 "Battery Voltage"
//                               )}
//                             </CButton>
//                             <CButton
//                               className="btn btn-sm btn-secondary m-1 shadow-sm"
//                               onClick={() => sendsingleDownlink(temp, 28)}
//                             >
//                               {commandButton === 28 ? (
//                                 <>
//                                   Temperature&nbsp;
//                                   <LoadingSpinner />
//                                 </>
//                               ) : (
//                                 "Temperature"
//                               )}
//                             </CButton>
//                           </div>
//                         </CCardBody>
//                       </CCard>
//                     </CCol>

//                     {/* Card 2 - Get EEPROM Values */}
//                     <CCol md={6} className="mt-2">
//                       <CCard
//                         className="shadow border-0"
//                         style={{ height: "100%" }}
//                       >
//                         <CCardBody>
//                           <p>Get EEPROM Values</p>
//                           <div className="d-flex justify-content-start flex-wrap gap-2">
//                             <CButton
//                               className="btn btn-sm btn-secondary m-1 shadow-sm"
//                               onClick={() =>
//                                 sendsingleDownlink(checkManualMode, 29)
//                               }
//                             >
//                               {commandButton === 29 ? (
//                                 <>
//                                   Check Manual&nbsp;
//                                   <LoadingSpinner />
//                                 </>
//                               ) : (
//                                 "Check Manual"
//                               )}
//                             </CButton>
//                             <CButton
//                               className="btn btn-sm btn-secondary m-1 shadow-sm"
//                               onClick={() =>
//                                 sendsingleDownlink(checkActuatorMode, 30)
//                               }
//                             >
//                               {commandButton === 30 ? (
//                                 <>
//                                   Check Actuator&nbsp;
//                                   <LoadingSpinner />
//                                 </>
//                               ) : (
//                                 "Check Actuator"
//                               )}
//                             </CButton>
//                             <CButton
//                               className="btn btn-sm btn-secondary m-1 shadow-sm"
//                               onClick={() =>
//                                 sendsingleDownlink(checkBrushCurrent, 31)
//                               }
//                             >
//                               {commandButton === 31 ? (
//                                 <>
//                                   Brush Current&nbsp;
//                                   <LoadingSpinner />
//                                 </>
//                               ) : (
//                                 "Brush Current"
//                               )}
//                             </CButton>
//                             <CButton
//                               className="btn btn-sm btn-secondary m-1 shadow-sm"
//                               onClick={() =>
//                                 sendsingleDownlink(checkWheelCurrent, 32)
//                               }
//                             >
//                               {commandButton === 32 ? (
//                                 <>
//                                   Wheel Current&nbsp;
//                                   <LoadingSpinner />
//                                 </>
//                               ) : (
//                                 "Wheel Current"
//                               )}
//                             </CButton>
//                             <CButton
//                               className="btn btn-sm btn-secondary m-1 shadow-sm"
//                               onClick={() =>
//                                 sendsingleDownlink(checkWheelSpeed, 33)
//                               }
//                             >
//                               {commandButton === 33 ? (
//                                 <>
//                                   Wheel Speed&nbsp;
//                                   <LoadingSpinner />
//                                 </>
//                               ) : (
//                                 "Wheel Speed"
//                               )}
//                             </CButton>
//                             <CButton
//                               className="btn btn-sm btn-secondary m-1 shadow-sm"
//                               onClick={() =>
//                                 sendsingleDownlink(checkBrushSpeed, 34)
//                               }
//                             >
//                               {commandButton === 34 ? (
//                                 <>
//                                   Burush Speed&nbsp;
//                                   <LoadingSpinner />
//                                 </>
//                               ) : (
//                                 "Burush Speed"
//                               )}
//                             </CButton>
//                             <CButton
//                               className="btn btn-sm btn-secondary m-1 shadow-sm"
//                               onClick={() =>
//                                 sendsingleDownlink(checkTracker, 35)
//                               }
//                             >
//                               {commandButton === 35 ? (
//                                 <>
//                                   Check Tracker&nbsp;
//                                   <LoadingSpinner />
//                                 </>
//                               ) : (
//                                 "Check Tracker"
//                               )}
//                             </CButton>
//                           </div>
//                         </CCardBody>
//                       </CCard>
//                     </CCol>

//                     {/* Card 3 - Set EEPROM Values */}
//                     <CCol md={3} className="mt-2">
//                       <CCard
//                         className="shadow border-0"
//                         style={{ height: "100%" }}
//                       >
//                         <CCardBody>
//                           <p>Set EEPROM Values</p>
//                           <div className="d-flex flex-wrap gap-2">
//                             <CButton
//                               className="btn btn-sm btn-secondary m-1 shadow-sm"
//                               onClick={() =>
//                                 sendsingleDownlink(setManualEnable, 36)
//                               }
//                             >
//                               {commandButton === 36 ? (
//                                 <>
//                                   Manual Enable &nbsp;
//                                   <LoadingSpinner />
//                                 </>
//                               ) : (
//                                 "Manual Enable"
//                               )}
//                             </CButton>
//                             <CButton
//                               className="btn btn-sm btn-secondary m-1 shadow-sm"
//                               onClick={() =>
//                                 sendsingleDownlink(setManualDisable, 37)
//                               }
//                             >
//                               {commandButton === 37 ? (
//                                 <>
//                                   Manual Disable&nbsp;
//                                   <LoadingSpinner />
//                                 </>
//                               ) : (
//                                 "Manual Disable"
//                               )}
//                             </CButton>
//                             <CButton
//                               className="btn btn-sm btn-secondary m-1 shadow-sm"
//                               onClick={() =>
//                                 sendsingleDownlink(setActuatorEnable, 38)
//                               }
//                             >
//                               {commandButton === 38 ? (
//                                 <>
//                                   Actuator Enable&nbsp;
//                                   <LoadingSpinner />
//                                 </>
//                               ) : (
//                                 "Actuator Enable"
//                               )}
//                             </CButton>

//                             <CButton
//                               className="btn btn-sm btn-secondary m-1 shadow-sm"
//                               onClick={() =>
//                                 sendsingleDownlink(setActuatorDisable, 39)
//                               }
//                             >
//                               {commandButton === 39 ? (
//                                 <>
//                                   Actuator Disable&nbsp;
//                                   <LoadingSpinner />
//                                 </>
//                               ) : (
//                                 "Actuator Disable"
//                               )}
//                             </CButton>
//                             <CButton
//                               className="btn btn-sm btn-secondary m-1 shadow-sm"
//                               onClick={() =>
//                                 sendsingleDownlink(setTrackerEnable, 40)
//                               }
//                             >
//                               {commandButton === 40 ? (
//                                 <>
//                                   Tracker Enable&nbsp;
//                                   <LoadingSpinner />
//                                 </>
//                               ) : (
//                                 "Tracker Enable"
//                               )}
//                             </CButton>
//                             <CButton
//                               className="btn btn-sm btn-secondary m-1 shadow-sm"
//                               onClick={() =>
//                                 sendsingleDownlink(setTrackerDisable, 41)
//                               }
//                             >
//                               {commandButton === 41 ? (
//                                 <>
//                                   Tracker Disable&nbsp;
//                                   <LoadingSpinner />
//                                 </>
//                               ) : (
//                                 "Tracker Disable"
//                               )}
//                             </CButton>
//                           </div>
//                         </CCardBody>
//                       </CCard>
//                     </CCol>
//                   </>
//                 )}
//               </CRow>

//               {/* Sixth Row */}
//               <CRow className="my-2">
//                 {(userInfo.role === "Master Admin" ||
//                   userInfo.role === "Service Admin") && (
//                   <>
//                     {/* Card 1 - Custom Temperature Limit */}
//                     <CCol md={3} className="mt-2">
//                       <CCard
//                         className="shadow border-0"
//                         style={{ height: "100%" }}
//                       >
//                         <CCardBody>
//                           <div className="d-flex justify-content-between align-items-center mb-3">
//                             <p className="mb-0">Custom Temp</p>
//                             <span className="text-danger fst-italic small"></span>
//                           </div>
//                           <div className="position-relative">
//                             <input
//                               type="text"
//                               className="form-control"
//                               placeholder="Enter Temp"
//                             />
//                             <CButton
//                               type="button"
//                               className="d-flex justify-content-between align-items-center btn-sm btn-secondary position-absolute send-button shadow-sm"
//                             >
//                               <FaArrowUp />
//                             </CButton>
//                           </div>
//                         </CCardBody>
//                       </CCard>
//                     </CCol>
//                   </>
//                 )}
//               </CRow>
//             </div>
//           )}
//         </div>
//       )}

//       <WeatherCheckResultModal
//         visible={weatherErrorModal}
//         onClose={() => setWeatherErrorModal(false)}
//         weatherError={weatherError}
//       />
//     </>
//   );
// };

// export default RobotOperating;

import RobotNoLink from "../../../components/RobotNoLink";
import React, { useEffect, useReducer, useState } from "react";
import {
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CInputGroup,
  CFormInput,
  CRow,
  CCol,
  CBadge,
  CDropdown,
  CDropdownMenu,
  CDropdownToggle,
} from "@coreui/react";
import {
  FaArrowUp,
  FaPlay,
  FaStop,
  FaHome,
  FaCloudSun,
  FaSyncAlt,
  FaTachometerAlt,
  FaBolt,
  FaMicrochip,
  FaBroom,
  FaArrowsAltH,
  FaFlask,
  FaAnchor,
  FaTerminal,
  FaExclamationTriangle,
  FaCopy,
  FaThermometerHalf,
  FaWrench,
  FaCog,
  FaStream,
  FaTimes,
} from "react-icons/fa";
import RobotEventAndFrames from "../mqtt/RobotEventAndFrames";
import { FaCircleInfo } from "react-icons/fa6";
import { Link, useParams } from "react-router-dom";
import "./management.css";
import "./robotOperating.css";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";
import WeatherCheckResultModal from "../../../components/WeatherCheckResultModal";
import { formatDistanceToNow } from "date-fns";
import PaginateInput from "../../../components/PaginateInput";

/* ------------------------------------------------------------------ */
/* Reducer (unchanged)                                                 */
/* ------------------------------------------------------------------ */
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        downlinks: action.payload.data,
        totalPages: action.payload.totalPages,
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true, successDelete: false };
    case "DELETE_SUCCESS":
      return { ...state, loadingDelete: false, successDelete: true };
    case "DELETE_FAIL":
      return { ...state, loadingDelete: false, successDelete: false };
    case "DELETE_RESET":
      return { ...state, successDelete: false };
    case "FETCH_ROBOTS_REQUEST":
      return { ...state, loadingRobots: true, error: "" };
    case "FETCH_ROBOTS_SUCCESS":
      return { ...state, loadingRobots: false, robots: action.payload };
    case "FETCH_ROBOTS_FAIL":
      return { ...state, loadingRobots: false, error: action.payload };
    case "FETCH_ROBOT_REQUEST":
      return { ...state, loadingRobot: true, error: "" };
    case "FETCH_ROBOT_SUCCESS":
      return { ...state, loadingRobot: false, robot: action.payload };
    case "FETCH_ROBOT_FAIL":
      return { ...state, loadingRobot: false, error: action.payload };
    case "SEND_DOWNLINK_REQUEST":
      return { ...state, sendingCommandloading: true, error: "" };
    case "SEND_DOWNLINK_SUCCESS":
      return { ...state, sendingCommandloading: false };
    case "SEND_DOWNLINK_FAIL":
      return { ...state, sendingCommandloading: false, error: action.payload };
    default:
      return state;
  }
};

/* ------------------------------------------------------------------ */
/* Command codes                                                       */
/* ------------------------------------------------------------------ */
const CMD = {
  start: "11",
  partialStart: "12",
  intelligentStart: "13",
  stop: "14",
  returnToDock: "15",
  newCleaningStart: "01",
  removeCurrentLimit: "HCD",
  wheelPwm: { low: "69", medium: "6A", high: "6B" },
  brushPwm: { low: "66", medium: "67", high: "68" },
  setWheelCurrent: "GWC",
  setBrushCurrent: "GBC",
  setWheelSpeed: "RWS",
  setBrushSpeed: "RBS",
  batteryVoltage: "63",
  temp: "60",
  cleanLeft: "C2",
  cleanRight: "C3",
  moveLeft: "C4",
  moveRight: "C5",
  weatherLockEnable: "WE",
  weatherLockDisable: "WD",
  testModeOn: "1A",
  testModeOff: "1B",
  dockLeft: "65",
  dockRight: "64",
  resetBoard: "RE",
  checkDock: "ZD",
  checkSensorState: "CD",
  checkManual: "AU",
  checkActuator: "LE",
  checkBrushCurrent: "EB",
  checkWheelCurrent: "EW",
  checkWheelSpeed: "PW",
  checkBrushSpeed: "PB",
  checkTracker: "KE",
  manualEnable: "62",
  manualDisable: "61",
  actuatorEnable: "ILE",
  actuatorDisable: "ILD",
  trackerEnable: "KTE",
  trackerDisable: "KTD",
};

const ROLE_ROUTES = {
  "Master Admin": "master-admin",
  "Service Admin": "service-admin",
  "Project Admin": "project-admin",
  "Master User": "master-user",
  "Service User": "service-user",
  "Project User": "project-user",
  "Factory Admin": "factory-admin",
};

const errMsg = (e) =>
  e?.response?.data?.message ||
  e?.response?.data?.error ||
  e?.message ||
  "Something went wrong";

const formatDateTime = (value) => {
  const d = new Date(value);
  if (isNaN(d.getTime())) return "-";
  const p = (n) => String(n).padStart(2, "0");
  const h = d.getHours();
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} ${p(h12)}:${p(
    d.getMinutes(),
  )}:${p(d.getSeconds())} ${h >= 12 ? "pm" : "am"}`;
};

const speedTone = (v) =>
  v > 210 ? "success" : v > 170 ? "warning" : "primary";

const batteryColor = (pct) =>
  pct >= 60 ? "#30D158" : pct >= 30 ? "#FF9F0A" : "#FF453A";

/* ------------------------------------------------------------------ */
/* Small presentational helpers                                        */
/* ------------------------------------------------------------------ */
const Card = ({
  icon,
  title,
  hint,
  action,
  danger,
  className = "",
  children,
}) => (
  <div className={`ro-card ${danger ? "ro-card--danger" : ""} ${className}`}>
    {title && (
      <div className="ro-card-head">
        {icon && <span className="ro-card-icon">{icon}</span>}
        <h6 className="ro-card-title">
          {title}
          {hint && <span className="ro-card-hint">{hint}</span>}
        </h6>
        {action && <span className="ro-card-action">{action}</span>}
      </div>
    )}
    {children}
  </div>
);

/** Text field with an inline "send" button and Enter-to-send. */
const CommandInput = ({
  label,
  prefix,
  placeholder,
  value,
  onChange,
  onSend,
  busy,
  disabled,
  invalid,
  mono,
}) => (
  <div className="ro-field">
    {label && (
      <div className="ro-field-label">
        <span>{label}</span>
        {prefix && (
          <code>
            {prefix}
            {value || "…"}
          </code>
        )}
      </div>
    )}
    <div className="ro-input-wrap">
      <input
        type="text"
        className={`ro-input ${invalid ? "ro-input--invalid" : ""} ${
          mono ? "ro-input--mono" : ""
        }`}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && value && !invalid && !disabled && !busy) {
            e.preventDefault();
            onSend();
          }
        }}
      />
      <button
        type="button"
        className="ro-send"
        aria-label="Send"
        disabled={!value || invalid || disabled || busy}
        onClick={onSend}
      >
        {busy ? <LoadingSpinner /> : <FaArrowUp size={12} />}
      </button>
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
const RobotOperating = () => {
  const [
    {
      loading,
      loadingRobot,
      error,
      robot,
      downlinks,
      successDelete,
      loadingRobots,
      robots,
      totalPages,
      hasNextPage,
      hasPrevPage,
      sendingCommandloading,
    },
    dispatch,
  ] = useReducer(reducer, {
    downlinks: [],
    robots: [],
    robot: {},
    loading: true,
    error: "",
    loadingRobots: true,
    sendingCommandloading: false,
    loadingRobot: false,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const { site_id, block, robot_no } = useParams();
  const userInfo = useSelector((state) => state.userInfo);

  const [modalVisible, setModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [text, setText] = useState("");
  const [base64Text, setBase64Text] = useState("");
  const [pageInput, setPageInput] = useState("");
  const [wheelCurrentValue, setWheelCurrentValue] = useState("");
  const [brushCurrentValue, setBrushCurrentValue] = useState("");
  const [wheelSpeedValue, setWheelSpeedValue] = useState("");
  const [brushSpeedValue, setBrushSpeedValue] = useState("");
  const [commandButton, setCommandButton] = useState(null); // key of the command in flight
  const [weatherErrorModal, setWeatherErrorModal] = useState(false);
  const [weatherError, setWeatherError] = useState(null);
  const [customDownlink, setCustomDownlink] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sent_custom_to_all, setSentCustomToAll] = useState(false);
  const [confirm, setConfirm] = useState(null); // { title, message, onConfirm }
  const [tab, setTab] = useState("operate");
  const [eventsOpen, setEventsOpen] = useState(false);
  const [eventsPos, setEventsPos] = useState(null);

  const startEventsDrag = (e) => {
    if (e.button !== 0 || e.target.closest("button")) return;
    const rect = e.currentTarget.parentElement.getBoundingClientRect();
    const dx = e.clientX - rect.left;
    const dy = e.clientY - rect.top;
    const move = (ev) =>
      setEventsPos({
        x: Math.max(0, Math.min(ev.clientX - dx, window.innerWidth - rect.width)),
        y: Math.max(
          0,
          Math.min(ev.clientY - dy, window.innerHeight - rect.height),
        ),
      });
    const stop = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
  };

  const role = userInfo?.role;
  const isMasterAdmin = role === "Master Admin";
  const isMasterOrService = isMasterAdmin || role === "Service Admin";
  const canCustomDownlink = isMasterAdmin || role === "Master User";
  const adminroute = ROLE_ROUTES[role] || "";
  const isBusy = sendingCommandloading;
  const online = robot?.lora_state === 1;

  /* ---------------- Data loading ---------------- */
  useEffect(() => {
    const getRobots = async () => {
      try {
        dispatch({ type: "FETCH_ROBOTS_REQUEST" });
        const response = await axios.get(
          `/api/v1/robots/get-robotsno-by-site-and-block/${site_id}/${block}`,
          { withCredentials: true },
        );
        dispatch({ type: "FETCH_ROBOTS_SUCCESS", payload: response.data.data });
      } catch (error) {
        dispatch({ type: "FETCH_ROBOTS_FAIL", payload: errMsg(error) });
      }
    };
    getRobots();
  }, [block, site_id]);

  // Downlink library is only needed while the modal is open
  useEffect(() => {
    if (!modalVisible) return;

    const getDownlinks = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const response = await axios.post(
          `/api/v1/downlinks/get-downlinks`,
          { pg: page, limit },
          { withCredentials: true },
        );
        dispatch({
          type: "FETCH_SUCCESS",
          payload: {
            data: response.data.data,
            totalPages: Math.ceil(
              Number(response.data.total) / Number(response.data.limit),
            ),
            hasNextPage: response.data.hasNextPage,
            hasPrevPage: response.data.hasPrevPage,
          },
        });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: errMsg(error) });
      }
    };

    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      getDownlinks();
    }
  }, [successDelete, page, limit, modalVisible]);

  useEffect(() => {
    const getRobot = async () => {
      try {
        dispatch({ type: "FETCH_ROBOT_REQUEST" });
        const response = await axios.get(
          `/api/v1/robots/get-robot-using-robot-no/${robot_no}`,
          { withCredentials: true },
        );
        dispatch({ type: "FETCH_ROBOT_SUCCESS", payload: response.data.data });
      } catch (error) {
        dispatch({ type: "FETCH_ROBOT_FAIL", payload: errMsg(error) });
      }
    };
    getRobot();
  }, [robot_no]);

  const filteredDownlink = downlinks.filter((item) =>
    item.downlink.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const blockwiserobots =
    robots?.length > 0 ? robots.filter((r) => r.block === block) : [];

  /* ---------------- Actions ---------------- */
  const deleteDownlink = async (downlink) => {
    if (
      window.confirm(
        `Are you sure you want to delete downlink ${downlink.downlink}?`,
      )
    ) {
      try {
        await axios.delete(`/api/v1/downlinks/${downlink._id}`, {
          withCredentials: true,
        });
        toast.success("Downlink deleted successfully");
        dispatch({ type: "DELETE_SUCCESS" });
      } catch (err) {
        toast.error(errMsg(err));
        dispatch({ type: "DELETE_FAIL" });
      }
    }
  };

  const sendsingleDownlink = async (command, key) => {
    setCommandButton(key);
    dispatch({ type: "SEND_DOWNLINK_REQUEST" });
    try {
      const data = await axios.post(
        "/api/v1/robots/send-mqtt-downlink",
        {
          deveui: robot.deveui,
          robot_no: robot.robot_no,
          site_id,
          payload: command,
          lora_no: robot.lora_no,
        },
        { withCredentials: true },
      );
      dispatch({ type: "SEND_DOWNLINK_SUCCESS" });
      toast.success(data.data.message);
    } catch (error) {
      dispatch({ type: "SEND_DOWNLINK_FAIL", payload: errMsg(error) });
      toast.error(errMsg(error));
    }
    setCommandButton(null);
  };

  const sendsingleintelligentDownlink = async (command, key) => {
    setCommandButton(key);
    dispatch({ type: "SEND_DOWNLINK_REQUEST" });
    try {
      const data = await axios.post(
        "/api/v1/robots/intelligent-command-weather-check",
        {
          deveui: robot.deveui,
          robot_no: robot.robot_no,
          site_id,
          payload: command,
          lora_no: robot.lora_no,
        },
        { withCredentials: true },
      );
      dispatch({ type: "SEND_DOWNLINK_SUCCESS" });
      toast.success(data.data.message);
    } catch (error) {
      const errData = error.response?.data || {};
      dispatch({
        type: "SEND_DOWNLINK_FAIL",
        payload: errData.message || errData.error || "Command failed",
      });
      if (errData.weather || errData.failed_field || errData.checks) {
        setWeatherError({
          message: errData.message || errData.error || "Weather check failed",
          failed_field: errData.failed_field,
          failed_fields: errData.failed_fields || [],
          failed_count: errData.failed_count ?? 0,
          passed_count: errData.passed_count ?? 0,
          total_checks: errData.total_checks ?? 0,
          checks: errData.checks || [],
          weather: errData.weather || {},
          thresholds: errData.thresholds || {},
        });
        setWeatherErrorModal(true);
      } else {
        toast.error(errData.message || errData.error || "Command failed");
      }
    }
    setCommandButton(null);
  };

  const sendCustomDownlink = async (command, toAll) => {
    let robotdownlink;
    if (toAll) {
      robotdownlink = {
        robots: blockwiserobots.map((r) => ({
          deveui: r.deveui,
          robot_no: r.robot_no,
        })),
        block,
        site_id,
        command,
      };
    } else {
      robotdownlink = {
        robots: [{ deveui: robot.deveui, robot_no: robot.robot_no }],
        site_id,
        command,
        lora_no: robot.lora_no,
      };
    }
    setCommandButton("custom");
    dispatch({ type: "SEND_DOWNLINK_REQUEST" });
    try {
      const data = await axios.post(
        "/api/v1/robots/custom-downlink",
        robotdownlink,
        { withCredentials: true },
      );
      toast.success(data.data.message);
      dispatch({ type: "SEND_DOWNLINK_SUCCESS" });
    } catch (error) {
      dispatch({ type: "SEND_DOWNLINK_FAIL", payload: errMsg(error) });
      toast.error(errMsg(error));
    }
    setCustomDownlink("");
    setSentCustomToAll(false);
    setCommandButton(null);
  };

  const sendMulticastDownlink = async (command, key) => {
    setCommandButton(key);
    dispatch({ type: "SEND_DOWNLINK_REQUEST" });
    try {
      const data = await axios.post(
        "/api/v1/robots/send-mqtt-multicast-downlink",
        {
          deveui: blockwiserobots.map((r) => r.deveui),
          block,
          site_id,
          command,
          robot_no: blockwiserobots.map((r) => r.robot_no),
        },
        { withCredentials: true },
      );
      dispatch({ type: "SEND_DOWNLINK_SUCCESS" });
      toast.success(data.data.message);
    } catch (error) {
      dispatch({ type: "SEND_DOWNLINK_FAIL", payload: errMsg(error) });
      toast.error(errMsg(error));
    }
    setCommandButton(null);
  };

  /* ---------------- Pagination ---------------- */
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };
  const handlePageInputSubmit = () => {
    const n = parseInt(pageInput);
    if (!isNaN(n) && n >= 1 && n <= totalPages) handlePageChange(n);
  };

  /* ---------------- Base64 ---------------- */
  const TextToBase64 = (value) => {
    try {
      setBase64Text(btoa(value));
      setText("");
    } catch {
      toast.error("Only Latin-1 characters can be converted");
    }
  };
  const copyBase64 = async () => {
    try {
      await navigator.clipboard.writeText(base64Text);
      toast.success("Copied");
    } catch {
      toast.error("Could not copy");
    }
  };

  /* ---------------- Button factories ---------------- */
  const askConfirm = (title, message, onConfirm) =>
    setConfirm({ title, message, onConfirm });

  /** Single-robot command button. Pass `confirmText` to require confirmation. */
  const btn = ({
    key,
    label,
    cmd,
    variant = "default",
    confirmText,
    disabled,
    weather,
    icon,
  }) => {
    const exec = () =>
      weather
        ? sendsingleintelligentDownlink(cmd, key)
        : sendsingleDownlink(cmd, key);
    return (
      <button
        key={key}
        type="button"
        className={`ro-btn ro-btn--${variant}`}
        disabled={disabled || isBusy}
        onClick={() =>
          confirmText ? askConfirm(label, confirmText, exec) : exec()
        }
      >
        {commandButton === key ? <LoadingSpinner /> : icon}
        {label}
      </button>
    );
  };

  /** Block-wide (multicast) command button — always confirmed. */
  const bulkBtn = ({ key, label, cmd, variant = "default", icon }) => (
    <button
      key={key}
      type="button"
      className={`ro-btn ro-btn--${variant}`}
      disabled={isBusy || blockwiserobots.length === 0}
      onClick={() =>
        askConfirm(
          label,
          `This will send the command to all ${blockwiserobots.length} robots in ${block}. Continue?`,
          () => sendMulticastDownlink(cmd, key),
        )
      }
    >
      {commandButton === key ? <LoadingSpinner /> : icon}
      {label}
    </button>
  );

  /* ---------------- Derived values ---------------- */
  const hasUplink =
    robot?.last_uplink && !isNaN(new Date(robot.last_uplink).getTime());
  const battery = Math.max(
    0,
    Math.min(100, Number(robot?.battery_voltage) || 0),
  );
  const speedValid = (v) =>
    /^\d+$/.test(v) && Number(v) >= 0 && Number(v) <= 255;
  const numericValid = (v) => /^\d+(\.\d+)?$/.test(v);

  const navBase = `/${adminroute}/site-management/block-management/${site_id}/${block}`;

  if (loadingRobots) {
    return (
      <div className="ro-loading">
        <LoadingSpinner />
      </div>
    );
  }

  const TABS = [
    { id: "operate", label: "Operate", icon: <FaPlay size={11} /> },
    ...(isMasterOrService
      ? [
          { id: "configure", label: "Configure", icon: <FaCog size={12} /> },
          {
            id: "diagnostics",
            label: "Diagnostics",
            icon: <FaThermometerHalf size={12} />,
          },
          { id: "advanced", label: "Advanced", icon: <FaWrench size={12} /> },
        ]
      : []),
  ];
  const activeTab = TABS.some((t) => t.id === tab) ? tab : "operate";

  return (
    <div className="ro-page">
      {/* ================= Page header ================= */}
      <header className="ro-header">
        <div>
          <div className="ro-crumbs">
            <span className="site">{site_id}</span>
            <span className="sep">·</span>
            <span className="block">{block}</span>
          </div>
          <h4 className="ro-title">Robot Configuration</h4>
        </div>

        <div className="ro-nav">
          <CDropdown>
            {robots.length > 1 ? (
              <CDropdownToggle
                size="sm"
                className={`ro-picker ${online ? "ro-picker--on" : "ro-picker--off"}`}
              >
                {robot.robot_no}
              </CDropdownToggle>
            ) : (
              <CButton
                size="sm"
                className={`ro-picker ${online ? "ro-picker--on" : "ro-picker--off"}`}
                disabled
              >
                {robot.robot_no}
              </CButton>
            )}
            {robots.length > 1 && (
              <CDropdownMenu className="z-3 px-2 py-1 dropdown-menu-robot border">
                {robots.map((item) => (
                  <Link
                    key={item.robot_no}
                    to={
                      item.robot_no === robot_no
                        ? "#"
                        : `${navBase}/${item.robot_no}`
                    }
                    className="dopdown-item-robot"
                  >
                    <CBadge
                      color={item.lora_state === 1 ? "success" : "danger"}
                      className="p-2 my-1"
                    >
                      {item.robot_no}
                    </CBadge>
                  </Link>
                ))}
              </CDropdownMenu>
            )}
          </CDropdown>

          <span className="ro-tool-sep" />

          <Link
            to={`${navBase}/${robot_no}/debug_logs`}
            className="ro-btn ro-btn--ghost"
          >
            Debug log
          </Link>
          <Link
            to={`${navBase}/${robot_no}/cleaning_logs`}
            className="ro-btn ro-btn--ghost"
          >
            Cleaning log
          </Link>
          {isMasterAdmin && robot?._id && (
            <>
              <span className="ro-tool-sep" />
              <Link
                to={`/${adminroute}/robots/view/${robot._id}`}
                className="ro-btn ro-btn--ghost"
              >
                View robot
              </Link>
              <Link
                to={`/${adminroute}/robots/update/${robot._id}`}
                className="ro-btn ro-btn--fill"
              >
                Update robot
              </Link>
            </>
          )}
        </div>
      </header>

      {/* {error && (
        <div className="ro-alert" role="alert">
          <FaExclamationTriangle style={{ marginTop: 2 }} />
          <span>{error}</span>
        </div>
      )} */}

      {loadingRobot ? (
        <div className="ro-loading" style={{ minHeight: 260 }}>
          <LoadingSpinner />
        </div>
      ) : (
        <div className="ro-layout">
          {/* ================= Left: robot panel (sticky) ================= */}
          <aside className="ro-side">
            <div className="ro-card ro-hero">
              <div className="ro-hero-top">
                <h5 className="ro-hero-id">
                  <RobotNoLink robot={robot} />
                </h5>
                <div className="ro-status">
                  <span
                    className={`ro-dot ${online ? "ro-dot--online" : ""}`}
                  />
                  <span className={online ? "ro-online" : "ro-offline"}>
                    {online ? "Online" : "Offline"}
                  </span>
                </div>
              </div>

              <div className="ro-battery" title={`Battery ${battery}%`}>
                <div className="ro-battery-top">
                  <span>
                    Battery
                    {robot.battery_type ? ` · ${robot.battery_type}` : ""}
                  </span>
                  <strong>{robot.battery_voltage ?? "-"}%</strong>
                </div>
                <div className="ro-battery-bar">
                  <div
                    className="ro-battery-fill"
                    style={{
                      width: `${battery}%`,
                      background: batteryColor(battery),
                    }}
                  />
                </div>
              </div>

              <div className="ro-stats">
                <div className="ro-stat">
                  <small>PCB</small>
                  <div>{robot.pcb_version ?? "-"}</div>
                </div>
                <div className="ro-stat">
                  <small>Firmware</small>
                  <div>{robot.version ?? "-"}</div>
                </div>
                <div className="ro-stat ro-stat--wide">
                  <small>LoRa / DevEUI</small>
                  <div>
                    {robot.lora_no && (
                      <span className="lora">{robot.lora_no} </span>
                    )}
                    <span className="eui">/ {robot.deveui}</span>
                  </div>
                </div>
              </div>

              <div className="ro-speeds">
                <div className="ro-stat">
                  <small>Wheel speed</small>
                  <span
                    className={`ro-pill ro-pill--${speedTone(robot.wheel_motor_speed)}`}
                  >
                    {robot.wheel_motor_speed_string} · {robot.wheel_motor_speed}
                  </span>
                </div>
                <div className="ro-stat">
                  <small>Brush speed</small>
                  <span
                    className={`ro-pill ro-pill--${speedTone(robot.brush_motor_speed)}`}
                  >
                    {robot.brush_motor_speed_string} · {robot.brush_motor_speed}
                  </span>
                </div>
              </div>

              {hasUplink ? (
                <div className="ro-kv">
                  <div>
                    <span>Last uplink</span>
                    <strong>
                      {formatDistanceToNow(new Date(robot.last_uplink), {
                        addSuffix: true,
                      })}
                    </strong>
                  </div>
                  <div>
                    <span>Last status</span>
                    <strong>{robot.last_status || "-"}</strong>
                  </div>
                  <div className="exact">
                    {formatDateTime(robot.last_uplink)}
                  </div>
                </div>
              ) : (
                <div className="ro-kv">
                  <span className="ro-pill ro-pill--danger">
                    Robot is not activated
                  </span>
                </div>
              )}

              {!online && (
                <div className="ro-alert ro-alert--tight" role="status">
                  <FaExclamationTriangle style={{ marginTop: 2 }} />
                  <span>
                    Offline — commands may not be delivered until it reconnects.
                  </span>
                </div>
              )}
            </div>
          </aside>

          {/* ================= Right: controls ================= */}
          <main className="ro-main">
            {/* Block-wide actions */}
            <div className="ro-blockbar">
              <div className="ro-blockbar-label">
                <span className="ro-card-icon">
                  <FaBolt />
                </span>
                <div>
                  <strong>Block actions</strong>
                  <small>
                    {blockwiserobots.length} robot
                    {blockwiserobots.length === 1 ? "" : "s"} in {block} ·
                    confirmation required
                  </small>
                </div>
              </div>
              <div className="ro-blockbar-actions">
                {bulkBtn({
                  key: "all-start",
                  label: "Start all",
                  cmd: CMD.start,
                  variant: "success",
                  icon: <FaPlay size={9} />,
                })}
                {bulkBtn({
                  key: "all-stop",
                  label: "Stop all",
                  cmd: CMD.stop,
                  variant: "danger",
                  icon: <FaStop size={9} />,
                })}
                {bulkBtn({
                  key: "all-dock",
                  label: "Return to dock all",
                  cmd: CMD.returnToDock,
                  icon: <FaHome size={10} />,
                })}
                {bulkBtn({
                  key: "all-test-start",
                  label: "Test start all",
                  cmd: CMD.newCleaningStart,
                  variant: "warn",
                  icon: <FaFlask size={10} />,
                })}
                {bulkBtn({
                  key: "all-limit",
                  label: "Remove current limit all",
                  cmd: CMD.removeCurrentLimit,
                  variant: "ghost",
                  icon: <FaBolt size={10} />,
                })}
              </div>
            </div>

            {/* Tabs */}
            <div className="ro-tabs" role="tablist">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === t.id}
                  className={`ro-tab ${activeTab === t.id ? "ro-tab--active" : ""}`}
                  onClick={() => setTab(t.id)}
                >
                  {t.icon}
                  {t.label}
                </button>
              ))}
            </div>

            {/* ---------- OPERATE ---------- */}
            {activeTab === "operate" && (
              <div className="ro-grid" role="tabpanel">
                <Card
                  icon={<FaBroom />}
                  title="Cleaning Cycle"
                  hint={`Runs on ${robot.robot_no || "this robot"}`}
                >
                  <div className="ro-quick-row">
                    {btn({
                      key: "start",
                      label: "Start",
                      cmd: CMD.start,
                      variant: "success",
                      icon: <FaPlay size={9} />,
                    })}
                    {btn({
                      key: "stop",
                      label: "Stop",
                      cmd: CMD.stop,
                      variant: "danger",
                      icon: <FaStop size={9} />,
                    })}
                    {btn({
                      key: "return",
                      label: "Return",
                      cmd: CMD.returnToDock,
                      icon: <FaHome size={10} />,
                    })}
                  </div>
                </Card>

                {isMasterOrService && (
                  <Card
                    icon={<FaCloudSun />}
                    title="Smart Start"
                    hint="Conditional start modes"
                  >
                    <div className="ro-btn-row">
                      {btn({
                        key: "weather-start",
                        label: "Check Weather & Start",
                        cmd: CMD.start,
                        variant: "info",
                        weather: true,
                        icon: <FaCloudSun size={11} />,
                      })}
                      {btn({
                        key: "partial-start",
                        label: "Partial Start",
                        cmd: CMD.partialStart,
                        variant: "warn",
                      })}
                      {btn({
                        key: "intelligent-start",
                        label: "Intelligent Start",
                        cmd: CMD.intelligentStart,
                        variant: "warn",
                      })}
                    </div>
                  </Card>
                )}

                {canCustomDownlink && (
                  <Card
                    icon={<FaTerminal />}
                    title="Custom Downlink"
                    action={
                      <button
                        type="button"
                        className="ro-btn ro-btn--ghost ro-btn--sm"
                        onClick={() => setModalVisible(true)}
                        title="Browse saved downlinks"
                      >
                        <FaCircleInfo /> Library
                      </button>
                    }
                  >
                    <label className="ro-check">
                      <input
                        type="checkbox"
                        checked={sent_custom_to_all}
                        onChange={(e) => setSentCustomToAll(e.target.checked)}
                      />
                      Send to all robots in block
                    </label>
                    <CommandInput
                      placeholder="Enter command"
                      value={customDownlink}
                      onChange={setCustomDownlink}
                      busy={commandButton === "custom"}
                      disabled={isBusy}
                      mono
                      onSend={() => {
                        const run = () =>
                          sendCustomDownlink(
                            customDownlink,
                            sent_custom_to_all,
                          );
                        sent_custom_to_all
                          ? askConfirm(
                              "Send to all",
                              `Send "${customDownlink}" to all ${blockwiserobots.length} robots in ${block}?`,
                              run,
                            )
                          : run();
                      }}
                    />
                  </Card>
                )}

                <Card
                  icon={<FaTachometerAlt />}
                  title="Set Wheel Speed"
                  hint="Preset PWM"
                >
                  <div className="ro-btn-row ro-segment">
                    {btn({
                      key: "wheel-low",
                      label: "Low",
                      cmd: CMD.wheelPwm.low,
                    })}
                    {btn({
                      key: "wheel-med",
                      label: "Medium",
                      cmd: CMD.wheelPwm.medium,
                    })}
                    {btn({
                      key: "wheel-high",
                      label: "High",
                      cmd: CMD.wheelPwm.high,
                    })}
                  </div>
                </Card>

                <Card
                  icon={<FaSyncAlt />}
                  title="Set Brush Speed"
                  hint="Preset PWM"
                >
                  <div className="ro-btn-row ro-segment">
                    {btn({
                      key: "brush-low",
                      label: "Low",
                      cmd: CMD.brushPwm.low,
                    })}
                    {btn({
                      key: "brush-med",
                      label: "Medium",
                      cmd: CMD.brushPwm.medium,
                    })}
                    {btn({
                      key: "brush-high",
                      label: "High",
                      cmd: CMD.brushPwm.high,
                    })}
                  </div>
                </Card>

                {isMasterOrService && (
                  <Card
                    icon={<FaArrowsAltH />}
                    title="Direction"
                    hint="Manual movement"
                  >
                    <div className="ro-btn-row">
                      {btn({
                        key: "move-left",
                        label: "Move Left",
                        cmd: CMD.moveLeft,
                      })}
                      {btn({
                        key: "move-right",
                        label: "Move Right",
                        cmd: CMD.moveRight,
                      })}
                      {btn({
                        key: "clean-left",
                        label: "Clean Left",
                        cmd: CMD.cleanLeft,
                      })}
                      {btn({
                        key: "clean-right",
                        label: "Clean Right",
                        cmd: CMD.cleanRight,
                      })}
                    </div>
                  </Card>
                )}
              </div>
            )}

            {/* ---------- CONFIGURE ---------- */}
            {activeTab === "configure" && isMasterOrService && (
              <div className="ro-grid" role="tabpanel">
                <Card
                  icon={<FaTachometerAlt />}
                  title="Custom Speed"
                  action={
                    <span className="ro-meta">0 – 255</span>
                  }
                >
                  <CommandInput
                    label="Brush speed"
                    prefix={CMD.setBrushSpeed}
                    placeholder="Brush Speed"
                    value={brushSpeedValue}
                    onChange={setBrushSpeedValue}
                    invalid={!!brushSpeedValue && !speedValid(brushSpeedValue)}
                    busy={commandButton === "custom-brush-speed"}
                    disabled={isBusy}
                    onSend={() =>
                      sendsingleDownlink(
                        `${CMD.setBrushSpeed}${brushSpeedValue}`,
                        "custom-brush-speed",
                      )
                    }
                  />
                  <CommandInput
                    label="Wheel speed"
                    prefix={CMD.setWheelSpeed}
                    placeholder="Wheel Speed"
                    value={wheelSpeedValue}
                    onChange={setWheelSpeedValue}
                    invalid={!!wheelSpeedValue && !speedValid(wheelSpeedValue)}
                    busy={commandButton === "custom-wheel-speed"}
                    disabled={isBusy}
                    onSend={() =>
                      sendsingleDownlink(
                        `${CMD.setWheelSpeed}${wheelSpeedValue}`,
                        "custom-wheel-speed",
                      )
                    }
                  />
                </Card>

                <Card
                  icon={<FaBolt />}
                  title="Custom Current"
                  action={btn({
                    key: "remove-limit",
                    label: "Remove Limit",
                    cmd: CMD.removeCurrentLimit,
                    variant: "ghost",
                    confirmText: "Remove the current limit on this robot?",
                  })}
                >
                  <CommandInput
                    label="Wheel current"
                    prefix={CMD.setWheelCurrent}
                    placeholder="Enter Wheel Current"
                    value={wheelCurrentValue}
                    onChange={setWheelCurrentValue}
                    invalid={
                      !!wheelCurrentValue && !numericValid(wheelCurrentValue)
                    }
                    busy={commandButton === "custom-wheel-current"}
                    disabled={isBusy}
                    onSend={() =>
                      sendsingleDownlink(
                        `${CMD.setWheelCurrent}${wheelCurrentValue}`,
                        "custom-wheel-current",
                      )
                    }
                  />
                  <CommandInput
                    label="Brush current"
                    prefix={CMD.setBrushCurrent}
                    placeholder="Enter Brush Current"
                    value={brushCurrentValue}
                    onChange={setBrushCurrentValue}
                    invalid={
                      !!brushCurrentValue && !numericValid(brushCurrentValue)
                    }
                    busy={commandButton === "custom-brush-current"}
                    disabled={isBusy}
                    onSend={() =>
                      sendsingleDownlink(
                        `${CMD.setBrushCurrent}${brushCurrentValue}`,
                        "custom-brush-current",
                      )
                    }
                  />
                </Card>

                <Card icon={<FaFlask />} title="Test Mode">
                  <div className="ro-btn-row">
                    {btn({
                      key: "test-on",
                      label: "Enable",
                      cmd: CMD.testModeOn,
                      variant: "success",
                    })}
                    {btn({
                      key: "test-off",
                      label: "Disable",
                      cmd: CMD.testModeOff,
                      variant: "danger",
                    })}
                  </div>
                </Card>

                <Card icon={<FaCloudSun />} title="Weather Lock">
                  <div className="ro-btn-row">
                    {btn({
                      key: "wl-on",
                      label: "Enable",
                      cmd: CMD.weatherLockEnable,
                      variant: "success",
                    })}
                    {btn({
                      key: "wl-off",
                      label: "Disable",
                      cmd: CMD.weatherLockDisable,
                      variant: "danger",
                    })}
                  </div>
                </Card>

                <Card
                  icon={<FaAnchor />}
                  title="Set Dock Station"
                  hint={robot.dock ? `Currently: ${robot.dock}` : undefined}
                >
                  <div className="ro-btn-row ro-segment">
                    {btn({
                      key: "dock-left",
                      label: "Left",
                      cmd: CMD.dockLeft,
                      disabled: robot.dock === "left",
                    })}
                    {btn({
                      key: "dock-right",
                      label: "Right",
                      cmd: CMD.dockRight,
                      disabled: robot.dock === "right",
                    })}
                  </div>
                  <div className="ro-btn-row">
                    {btn({
                      key: "check-dock",
                      label: "Check EEPROM Dock",
                      cmd: CMD.checkDock,
                      variant: "ghost",
                    })}
                    {btn({
                      key: "check-sensor",
                      label: "Check Sensor State",
                      cmd: CMD.checkSensorState,
                      variant: "ghost",
                    })}
                  </div>
                </Card>

                <Card
                  icon={<FaMicrochip />}
                  title="Motor Modes"
                  action={<span className="ro-soon">Soon</span>}
                >
                  <div className="ro-btn-row">
                    <button
                      type="button"
                      className="ro-btn"
                      disabled
                      title="Not wired up yet"
                    >
                      40W
                    </button>
                    <button
                      type="button"
                      className="ro-btn"
                      disabled
                      title="Not wired up yet"
                    >
                      60W
                    </button>
                  </div>
                </Card>
              </div>
            )}

            {/* ---------- DIAGNOSTICS ---------- */}
            {activeTab === "diagnostics" && isMasterOrService && (
              <div className="ro-grid" role="tabpanel">
                <Card
                  icon={<FaThermometerHalf />}
                  title="Get Values"
                  hint="Live readings"
                >
                  <div className="ro-btn-row">
                    {btn({
                      key: "get-battery",
                      label: "Battery Voltage",
                      cmd: CMD.batteryVoltage,
                    })}
                    {btn({
                      key: "get-temp",
                      label: "Temperature",
                      cmd: CMD.temp,
                    })}
                  </div>
                </Card>

                <Card
                  icon={<FaMicrochip />}
                  title="Get EEPROM Values"
                  hint="Stored configuration"
                  className="ro-span-2"
                >
                  <div className="ro-btn-row">
                    {btn({
                      key: "eeprom-manual",
                      label: "Check Manual",
                      cmd: CMD.checkManual,
                    })}
                    {btn({
                      key: "eeprom-actuator",
                      label: "Check Actuator",
                      cmd: CMD.checkActuator,
                    })}
                    {btn({
                      key: "eeprom-brush-current",
                      label: "Brush Current",
                      cmd: CMD.checkBrushCurrent,
                    })}
                    {btn({
                      key: "eeprom-wheel-current",
                      label: "Wheel Current",
                      cmd: CMD.checkWheelCurrent,
                    })}
                    {btn({
                      key: "eeprom-wheel-speed",
                      label: "Wheel Speed",
                      cmd: CMD.checkWheelSpeed,
                    })}
                    {btn({
                      key: "eeprom-brush-speed",
                      label: "Brush Speed",
                      cmd: CMD.checkBrushSpeed,
                    })}
                    {btn({
                      key: "eeprom-tracker",
                      label: "Check Tracker",
                      cmd: CMD.checkTracker,
                    })}
                  </div>
                </Card>
              </div>
            )}

            {/* ---------- ADVANCED ---------- */}
            {activeTab === "advanced" && isMasterOrService && (
              <div className="ro-grid" role="tabpanel">
                <Card
                  icon={<FaCog />}
                  title="Set EEPROM Values"
                  hint="Persists on the robot"
                  className="ro-span-2"
                >
                  <div className="ro-btn-row">
                    <span className="ro-sub-label">Manual mode</span>
                    {btn({
                      key: "manual-on",
                      label: "Enable",
                      cmd: CMD.manualEnable,
                      variant: "success",
                    })}
                    {btn({
                      key: "manual-off",
                      label: "Disable",
                      cmd: CMD.manualDisable,
                      variant: "danger",
                    })}
                  </div>
                  <div className="ro-btn-row">
                    <span className="ro-sub-label">Actuator</span>
                    {btn({
                      key: "actuator-on",
                      label: "Enable",
                      cmd: CMD.actuatorEnable,
                      variant: "success",
                    })}
                    {btn({
                      key: "actuator-off",
                      label: "Disable",
                      cmd: CMD.actuatorDisable,
                      variant: "danger",
                    })}
                  </div>
                  <div className="ro-btn-row">
                    <span className="ro-sub-label">Tracker</span>
                    {btn({
                      key: "tracker-on",
                      label: "Enable",
                      cmd: CMD.trackerEnable,
                      variant: "success",
                    })}
                    {btn({
                      key: "tracker-off",
                      label: "Disable",
                      cmd: CMD.trackerDisable,
                      variant: "danger",
                    })}
                  </div>
                </Card>

                <Card
                  danger
                  icon={<FaWrench />}
                  title="Reset"
                  hint="Restarts the control board"
                >
                  <div className="ro-btn-row">
                    {btn({
                      key: "reset",
                      label: "Reset Board",
                      cmd: CMD.resetBoard,
                      variant: "danger",
                      confirmText:
                        "Reset the control board on this robot? It will restart.",
                      icon: <FaSyncAlt size={10} />,
                    })}
                  </div>
                </Card>

                <Card icon={<FaTerminal />} title="Text to Base64">
                  <CommandInput
                    placeholder="Enter value"
                    value={text}
                    onChange={setText}
                    onSend={() => TextToBase64(text)}
                  />
                  {base64Text && (
                    <div className="ro-b64-out">
                      <span>{base64Text}</span>
                      <button
                        type="button"
                        className="ro-btn ro-btn--ghost ro-btn--sm"
                        onClick={copyBase64}
                        aria-label="Copy"
                      >
                        <FaCopy size={11} />
                      </button>
                    </div>
                  )}
                </Card>

                <Card
                  icon={<FaThermometerHalf />}
                  title="Custom Temp"
                  action={<span className="ro-soon">Soon</span>}
                >
                  <CommandInput
                    placeholder="Enter Temp"
                    value=""
                    onChange={() => {}}
                    onSend={() => {}}
                    disabled
                  />
                </Card>
              </div>
            )}
          </main>
        </div>
      )}

      {/* ---------- Downlink library modal ---------- */}
      <CModal
        className="ro-sheet"
        scrollable
        backdrop="static"
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        size="xl"
      >
        <CModalHeader>
          <CModalTitle>Custom Downlink</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow className="d-flex justify-content-between align-items-center mb-2">
            <CCol xs={12} sm={10} md={6} lg={4}>
              <CInputGroup className="mb-3">
                <CFormInput
                  type="text"
                  placeholder="Search downlink..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </CInputGroup>
            </CCol>
            <CCol
              className="d-flex justify-content-end align-items-center"
              xs={12}
              sm={10}
              md={6}
              lg={4}
            >
              <Link
                className="ro-btn ro-btn--fill"
                to={`/master-admin/site-management/block-management/${site_id}/${block}/${robot_no}/add-downlink`}
              >
                + Add Downlink
              </Link>
            </CCol>
          </CRow>

          <CTable responsive hover bordered className="ro-modal-table">
            <CTableHead color="secondary">
              <CTableRow>
                <CTableHeaderCell style={{ minWidth: 70 }}>
                  Sr No
                </CTableHeaderCell>
                <CTableHeaderCell style={{ minWidth: 150 }}>
                  Command
                </CTableHeaderCell>
                <CTableHeaderCell style={{ minWidth: 150 }}>
                  Decoded String
                </CTableHeaderCell>
                <CTableHeaderCell style={{ minWidth: 120 }}>
                  Hexa decimal
                </CTableHeaderCell>
                <CTableHeaderCell style={{ minWidth: 120 }}>
                  Uplink
                </CTableHeaderCell>
                <CTableHeaderCell style={{ minWidth: 240 }}>
                  Description
                </CTableHeaderCell>
                <CTableHeaderCell
                  style={{ minWidth: 250 }}
                  className="text-center"
                >
                  Action
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {loading ? (
                <CTableRow className="text-center">
                  <CTableDataCell colSpan={7}>
                    <LoadingSpinner />
                  </CTableDataCell>
                </CTableRow>
              ) : error ? (
                <CTableRow>
                  <CTableDataCell
                    colSpan={7}
                    className="text-center text-danger"
                  >
                    {error}
                  </CTableDataCell>
                </CTableRow>
              ) : filteredDownlink.length > 0 ? (
                filteredDownlink.map((item, index) => (
                  <CTableRow key={item._id || index}>
                    <CTableDataCell>{index + 1}</CTableDataCell>
                    <CTableDataCell>
                      <a
                        className="ro-cmd-link"
                        role="button"
                        tabIndex={0}
                        onClick={() =>
                          !isBusy &&
                          sendsingleDownlink(item.downlink, `row-${index}`)
                        }
                        onKeyDown={(e) =>
                          e.key === "Enter" &&
                          !isBusy &&
                          sendsingleDownlink(item.downlink, `row-${index}`)
                        }
                      >
                        {item.downlink}&nbsp;
                        {commandButton === `row-${index}` && <LoadingSpinner />}
                      </a>
                    </CTableDataCell>
                    <CTableDataCell>{item.decodedString}</CTableDataCell>
                    <CTableDataCell>{item.hexadecimal}</CTableDataCell>
                    <CTableDataCell>{item.uplink}</CTableDataCell>
                    <CTableDataCell>{item.additionalInfo}</CTableDataCell>
                    <CTableDataCell>
                      <div className="d-flex justify-content-center align-items-center gap-1">
                        <Link
                          to={`/master-admin/site-management/block-management/${site_id}/${block}/${robot_no}/view-downlink/${item._id}`}
                          className="ro-btn ro-btn--ghost ro-btn--sm"
                        >
                          View
                        </Link>
                        <Link
                          to={`/master-admin/site-management/block-management/${site_id}/${block}/${robot_no}/update-downlink/${item._id}`}
                          className="ro-btn ro-btn--warn ro-btn--sm"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          className="ro-btn ro-btn--danger ro-btn--sm"
                          onClick={() => deleteDownlink(item)}
                        >
                          Delete
                        </button>
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell className="text-center" colSpan={7}>
                    No Data Found.
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>

          <PaginateInput
            page={page}
            totalPages={totalPages}
            hasPrevPage={hasPrevPage}
            hasNextPage={hasNextPage}
            pageInput={pageInput}
            handlePageChange={handlePageChange}
            handlePageInputChange={(e) => setPageInput(e.target.value)}
            handlePageInputSubmit={handlePageInputSubmit}
            limit={limit}
            handleLimitChange={setLimit}
          />
        </CModalBody>
        <CModalFooter>
          <CButton
            size="sm"
            color="secondary"
            onClick={() => setModalVisible(false)}
          >
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      {/* ---------- Confirmation modal ---------- */}
      <CModal
        className="ro-sheet"
        alignment="center"
        visible={!!confirm}
        onClose={() => setConfirm(null)}
      >
        <CModalHeader>
          <CModalTitle>
            <FaExclamationTriangle className="text-warning me-2" />
            Confirm: {confirm?.title}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>{confirm?.message}</CModalBody>
        <CModalFooter>
          <CButton
            size="sm"
            color="secondary"
            variant="outline"
            onClick={() => setConfirm(null)}
          >
            Cancel
          </CButton>
          <CButton
            size="sm"
            color="primary"
            onClick={() => {
              const fn = confirm?.onConfirm;
              setConfirm(null);
              fn && fn();
            }}
          >
            Send command
          </CButton>
        </CModalFooter>
      </CModal>

      <WeatherCheckResultModal
        visible={weatherErrorModal}
        onClose={() => setWeatherErrorModal(false)}
        weatherError={weatherError}
      />

      {eventsOpen && (
        <section
          className="ro-events"
          aria-label="Events and queues"
          style={
            eventsPos && {
              left: eventsPos.x,
              top: eventsPos.y,
              right: "auto",
              bottom: "auto",
            }
          }
        >
          <header
            className="ro-events-head"
            onPointerDown={startEventsDrag}
            title="Drag to move"
          >
            <span className={`ro-dot ${online ? "ro-dot--online" : ""}`} />
            <strong>Live events</strong>
            <button
              type="button"
              className="ro-events-close"
              aria-label="Close events"
              onClick={() => setEventsOpen(false)}
            >
              <FaTimes size={12} />
            </button>
          </header>
          <div className="ro-events-body">
            <RobotEventAndFrames
              key={robot.deveui}
              robotNo={robot.robot_no}
              deveui={robot.deveui}
            />
          </div>
        </section>
      )}

      <button
        type="button"
        className={`ro-fab ${eventsOpen ? "ro-fab--open" : ""}`}
        aria-label={eventsOpen ? "Close events" : "Open events & queues"}
        aria-expanded={eventsOpen}
        onClick={() => setEventsOpen((v) => !v)}
      >
        {eventsOpen ? <FaTimes size={18} /> : <FaStream size={18} />}
      </button>
    </div>
  );
};

export default RobotOperating;
