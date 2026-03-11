// import React, { useEffect, useReducer, useState } from "react";
// import {
//   CTable,
//   CTableHead,
//   CTableRow,
//   CTableHeaderCell,
//   CTableBody,
//   CTableDataCell,
//   CFormInput,
//   CRow,
//   CCol,
//   CButton,
//   CBadge,
//   // CAlert,
//   CCard,
//   CCardBody,
//   CTabs,
//   CTab,
//   CTabList,
//   CTabContent,
//   CTabPanel,
// } from "@coreui/react";
// import { useParams } from "react-router-dom";
// import toast from "react-hot-toast";
// import { useSelector } from "react-redux";
// import axios from "axios";
// // import PaginateInput from "../../../components/PaginateInput";
// import * as XLSX from "xlsx";
// import LoadingSpinner from "../../../components/LoadingSpinner";
// import SubscriptionExpiryCard from "../../../components/SubscriptionExpiryCard";
// const reducer = (state, action) => {
//   switch (action.type) {
//     case "FETCH_CLEANING_REQUEST":
//       return { ...state, cleaningLoading: true, cleaningError: "" };
//     case "FETCH_CLEANING_SUCCESS":
//       return {
//         ...state,
//         cleaningLoading: false,
//         cleaninglogs: action.payload.cleaninglogs,
//         totalAssignedRobots: action.payload.totalAssignedRobots,
//         cleaningCompleted: action.payload.cleaningCompleted,
//         cleaningInProgress: action.payload.cleaningInProgress,
//         failureLogs: action.payload.failureLogs,
//         totalPages: action.payload.totalPages,
//         hasNextPage: action.payload.hasNextPage,
//         hasPrevPage: action.payload.hasPrevPage,
//         robotswhichareonlineandnotstartedForthisSite:
//           action.payload.robotswhichareonlineandnotstartedForthisSite || [],
//       };
//     case "FETCH_CLEANING_FAIL":
//       return {
//         ...state,
//         cleaningLoading: false,
//         cleaningError: action.payload,
//         subscriptiondata: action.subscriptiondata,
//         subscriptionStatus: action.subscriptionStatus,
//       };

//     case "FETCH_ERROR_LOGS_REQUEST":
//       return { ...state, errLogloading: true, errorLogError: "" };
//     case "FETCH_ERROR_LOGS_SUCCESS":
//       return { ...state, errorLogs: action.payload, errLogloading: false };
//     case "FETCH_ERROR_LOGS_FAIL":
//       return {
//         ...state,
//         errLogloading: false,
//         errorLogError: action.payload,
//         subscriptiondata: action.subscriptiondata,
//         subscriptionStatus: action.subscriptionStatus,
//       };

//     case "FETCH_TIMER_LOGS_REQUEST":
//       return { ...state, timerLogLoading: true, timerLogError: "" };
//     case "FETCH_TIMER_LOGS_SUCCESS":
//       return { ...state, timerLogs: action.payload, timerLogLoading: false };
//     case "FETCH_TIMER_LOGS_FAIL":
//       return {
//         ...state,
//         timerLogError: action.payload,
//         timerLogLoading: false,
//         subscriptiondata: action.subscriptiondata,
//         subscriptionStatus: action.subscriptionStatus,
//       };

//     case "FETCH_OFFLINE_LOGS_REQUEST":
//       return { ...state, offlineLogsloading: true, offlineLogError: "" };
//     case "FETCH_OFFLINE_LOGS_SUCCESS":
//       return {
//         ...state,
//         offlineLogs: action.payload,
//         offlineLogsloading: false,
//       };
//     case "FETCH_OFFLINE_LOGS_FAIL":
//       return {
//         ...state,
//         offlineLogsloading: false,
//         offlineLogError: action.payload,
//         subscriptiondata: action.subscriptiondata,
//         subscriptionStatus: action.subscriptionStatus,
//       };

//     default:
//       return state;
//   }
// };

// const ClientCleaningLog = () => {
//   const [
//     {
//       cleaningLoading,
//       cleaningError,

//       cleaningCompleted,
//       totalAssignedRobots,
//       cleaningInProgress,
//       failureLogs,
//       errLogloading,
//       // errorLogError,
//       // errorLogs,
//       timerLogLoading,
//       // timerLogs,
//       // timerLogError,
//       // totalPages,
//       // hasNextPage,
//       // hasPrevPage,
//       subscriptiondata,
//       subscriptionStatus,
//       offlineLogError,
//       offlineLogsloading,
//       offlineLogs,
//       robotswhichareonlineandnotstartedForthisSite,
//     },
//     dispatch,
//   ] = useReducer(reducer, {
//     cleaninglogs: [],
//     totalAssignedRobots: 0,
//     cleaningCompleted: [],
//     cleaningInProgress: [],
//     failureLogs: [],
//     cleaningLoading: false,
//     cleaningError: "",
//     robotswhichareonlineandnotstartedForthisSite: [],
//     errLogloading: false,
//     errorLogError: "",
//     errorLogs: [],
//     subscriptionStatus: "",
//     subscriptiondata: {},
//     timerLogs: [],
//     timerLogLoading: false,
//     timerLogError: "",
//     totalPages: 1,
//     hasNextPage: false,
//     hasPrevPage: false,
//     offlineLogError: "",
//     offlineLogsloading: false,
//     offlineLogs: [],
//   });

//   const authtoken = useSelector((state) => state.authtoken);
//   const { site_id } = useParams();

//   const [startDate, setStartDate] = useState(
//     new Date().toISOString().split("T")[0],
//   );

//   useEffect(() => {
//     const fetchCleaningLogs = async () => {
//       try {
//         dispatch({ type: "FETCH_CLEANING_REQUEST" });
//         const result = await axios.post(
//           `/api/v1/robot-tracking/sitewise/fetch-cleaninglog/-by-sites-and-date`,
//           {
//             site_id,
//             date: startDate,
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${authtoken}`,
//             },
//           },
//         );

//         const data = result.data.data;
//         dispatch({
//           type: "FETCH_CLEANING_SUCCESS",
//           payload: {
//             totalAssignedRobots: data.totalAssignedRobots || 0,

//             cleaninglogs: data.cleaninglogs || [],
//             cleaningCompleted: data.cleaningCompleted || [],
//             cleaningInProgress: data.cleaningInProgress || [],
//             failureLogs: data.failureLogs || [],
//             robotswhichareonlineandnotstartedForthisSite:
//               data.robotswhichareonlineandnotstartedForthisSite || [],
//             totalPages: data.totalPages || 1,
//             hasNextPage: data.hasNextPage || false,
//             hasPrevPage: data.hasPrevPage || false,
//           },
//         });
//       } catch (error) {
//         dispatch({
//           type: "FETCH_CLEANING_FAIL",
//           payload: error.response.data.error || error.response.data.message,
//           subscriptiondata: error.response?.data?.data,
//           subscriptionStatus: error.response?.data.subscriptionStatus,
//         });
//         toast.error(error.response.data.error || error.response.data.message);
//       }
//     };
//     const fetchOfflineLogs = async () => {
//       try {
//         dispatch({
//           type: "FETCH_OFFLINE_LOGS_REQUEST",
//         });
//         const response = await axios.get(
//           `/api/v1/errorlogs/site-error-logs/${site_id}/${startDate}/${startDate}`,
//           {
//             headers: {
//               Authorization: `Bearer ${authtoken}`,
//             },
//           },
//         );
//         dispatch({
//           type: "FETCH_OFFLINE_LOGS_SUCCESS",
//           payload: response.data.data,
//         });
//       } catch (error) {
//         dispatch({
//           type: "FETCH_OFFLINE_LOGS_FAIL",
//           payload: error.response.data.error || error.response.data.message,
//           subscriptiondata: error.response?.data?.data,
//           subscriptionStatus: error.response?.data.subscriptionStatus,
//         });
//         toast.error(error.response.data.error || error.response.data.message);
//       }
//     };
//     fetchCleaningLogs();
//     fetchOfflineLogs();
//   }, [site_id, startDate, authtoken]);

//   const exportToExcel = () => {
//     if (
//       !cleaningCompleted?.length &&
//       !cleaningInProgress?.length &&
//       !failureLogs?.length &&
//       !offlineLogs?.length &&
//       !robotswhichareonlineandnotstartedForthisSite?.length
//     ) {
//       toast.error("No data available to export.");
//       return;
//     }

//     const mergedData = [];

//     // ===== 1. Cleaning Logs (Completed) =====
//     mergedData.push(["Cleaning Logs"]);
//     if (cleaningCompleted?.length) {
//       mergedData.push([
//         "Sr No",
//         "Robot No",
//         "Row Number",
//         "Row Length (Meters)",
//         "Start Time",
//         "Start Battery (%)",
//         "Finish Battery (%)",
//         "Finish Time",
//         "Status",
//       ]);

//       cleaningCompleted.forEach((log, index) => {
//         mergedData.push([
//           index + 1,
//           log.robot_no || "N/A",
//           log.row_no || "N/A",
//           log.row_length || "N/A",
//           log.cleaning?.startAt
//             ? new Date(log.cleaning.startAt).toLocaleString("en-GB", {
//                 day: "2-digit",
//                 month: "2-digit",
//                 year: "numeric",
//                 hour: "2-digit",
//                 minute: "2-digit",
//                 second: "2-digit",
//                 hour12: true,
//               })
//             : "N/A",
//           log.cleaning?.battery_before_cleaning ?? "N/A",
//           log.cleaning?.battery_after_cleaning ?? "N/A",
//           log.cleaning?.finishAt
//             ? new Date(log.cleaning.finishAt).toLocaleString("en-GB", {
//                 day: "2-digit",
//                 month: "2-digit",
//                 year: "numeric",
//                 hour: "2-digit",
//                 minute: "2-digit",
//                 second: "2-digit",
//                 hour12: true,
//               })
//             : "N/A",
//           log.cleaning?.finish
//             ? "Completed"
//             : log.cleaning?.battery_dead
//               ? "Battery Dead"
//               : log.cleaning?.cleaning_cancelled
//                 ? "Cleaning Cancelled"
//                 : "In Progress",
//         ]);
//       });
//     } else {
//       mergedData.push(["No cleaning logs data available"]);
//     }

//     mergedData.push([]);
//     mergedData.push([]);

//     // ===== 2. Cleaning In Progress =====
//     mergedData.push(["Cleaning In Progress"]);
//     if (cleaningInProgress?.length) {
//       mergedData.push(["Sr No", "Robot No", "Started At", "Block", "Status"]);
//       cleaningInProgress.forEach((log, index) => {
//         mergedData.push([
//           index + 1,
//           log.robot_no || "N/A",
//           log.cleaning?.startAt
//             ? new Date(log.cleaning.startAt).toLocaleString("en-GB", {
//                 day: "2-digit",
//                 month: "2-digit",
//                 year: "numeric",
//                 hour: "2-digit",
//                 minute: "2-digit",
//                 second: "2-digit",
//                 hour12: true,
//               })
//             : "N/A",
//           log.block || "N/A",
//           "In Progress",
//         ]);
//       });
//     } else {
//       mergedData.push(["No Cleaning In Progress logs found"]);
//     }

//     mergedData.push([]);
//     mergedData.push([]);

//     // ===== 3. Error Logs (Failure Logs tab) =====
//     mergedData.push(["Error Logs"]);
//     if (failureLogs?.length) {
//       mergedData.push(["Sr No", "Robot No", "Block", "Error Type"]);
//       failureLogs.forEach((log, index) => {
//         mergedData.push([
//           index + 1,
//           log.robot_no || "N/A",
//           log.block || "N/A",
//           log.cleaning?.battery_dead ? "In Complete" : "Cleaning Cancelled",
//         ]);
//       });
//     } else {
//       mergedData.push(["No error logs found"]);
//     }

//     mergedData.push([]);
//     mergedData.push([]);

//     // ===== 4. Offline Robots =====
//     mergedData.push([
//       "Robots that were offline at scheduled cleaning time (Timer). These robot numbers may still appear in the above cleaning log if the robots started cleaning after the timer.",
//     ]);
//     if (offlineLogs?.length) {
//       mergedData.push(["Sr No", "Robot No", "Block", "Error Type"]);
//       offlineLogs.forEach((log, index) => {
//         mergedData.push([
//           index + 1,
//           log.robot_no || "N/A",
//           log.block || "N/A",
//           log.error_type || "N/A",
//         ]);
//       });
//     } else {
//       mergedData.push(["No offline Robots found"]);
//     }

//     mergedData.push([]);
//     mergedData.push([]);

//     // ===================================================
//     // 5. Online – Command given, Not Started
//     // ===================================================
//     mergedData.push(["Not Started"]);

//     if (robotswhichareonlineandnotstartedForthisSite?.length) {
//       mergedData.push(["Sr No", "Robot No", "Block", "Status", "Last Uplink"]);

//       robotswhichareonlineandnotstartedForthisSite.forEach((log, index) => {
//         mergedData.push([
//           index + 1,
//           log.robot_no || "N/A",
//           log.block || "N/A",
//           log.lora_state === 1 ? "Online" : "Offline",
//           new Date(log.last_uplink).toLocaleString("en-GB", {
//             day: "2-digit",
//             month: "2-digit",
//             year: "numeric",
//             hour: "2-digit",
//             minute: "2-digit",
//             second: "2-digit",
//             hour12: true,
//           }),
//         ]);
//       });
//     } else {
//       mergedData.push(["All Robots are started cleaning"]);
//     }

//     mergedData.push([]);
//     mergedData.push([]);

//     // ===== 5. Summary =====
//     mergedData.push(["Summary"]);
//     mergedData.push(["Site ID", site_id || "N/A"]);
//     mergedData.push([
//       "Report Period",
//       `${startDate || "N/A"} to ${startDate || "N/A"}`,
//     ]);
//     mergedData.push(["Generated At", new Date().toLocaleString()]);
//     mergedData.push([]);
//     mergedData.push(["Data Summary"]);
//     mergedData.push([
//       "Cleaning Logs (Completed)",
//       cleaningCompleted ? cleaningCompleted.length : 0,
//     ]);
//     mergedData.push([
//       "Cleaning In Progress",
//       cleaningInProgress ? cleaningInProgress.length : 0,
//     ]);
//     mergedData.push(["Error Logs", failureLogs ? failureLogs.length : 0]);
//     mergedData.push(["Offline Robots", offlineLogs ? offlineLogs.length : 0]);
//     mergedData.push([
//       "Not Started Robots",
//       robotswhichareonlineandnotstartedForthisSite
//         ? robotswhichareonlineandnotstartedForthisSite.length
//         : 0,
//     ]);

//     // ===== Build worksheet =====
//     const ws = XLSX.utils.aoa_to_sheet(mergedData);

//     // Set column widths
//     ws["!cols"] = [
//       { wch: 5 }, // Sr No
//       { wch: 15 }, // Robot No
//       { wch: 15 }, // Row Number / Block
//       { wch: 20 }, // Row Length / Error Type
//       { wch: 25 }, // Time columns
//       { wch: 20 },
//       { wch: 20 },
//       { wch: 25 },
//       { wch: 15 }, // Status
//     ];

//     // Style setup for headers, table names and center alignment
//     const range = XLSX.utils.decode_range(ws["!ref"]);

//     const tableNameFill = {
//       fill: { fgColor: { rgb: "FFFFF2CC" } }, // Light yellow highlight for table names
//       font: { bold: true },
//       alignment: { horizontal: "center", vertical: "center" },
//       border: {
//         top: { style: "thin" },
//         bottom: { style: "thin" },
//         left: { style: "thin" },
//         right: { style: "thin" },
//       },
//     };

//     const headerFill = {
//       fill: { fgColor: { rgb: "FFBDD7EE" } }, // Light blue fill for column headers
//       font: { bold: true },
//       alignment: { horizontal: "center", vertical: "center" },
//       border: {
//         top: { style: "thin" },
//         bottom: { style: "thin" },
//         left: { style: "thin" },
//         right: { style: "thin" },
//       },
//     };

//     const centerAlign = {
//       alignment: { horizontal: "center", vertical: "center", wrapText: true },
//     };

//     // Define row indices that contain table names and headers (0-based)
//     const tableNameRows = new Set([0, 4, 8, 12, 16]); // Your table titles
//     const headerRows = new Set([1, 5, 9, 13, 18]); // Your column header rows

//     for (let R = range.s.r; R <= range.e.r; ++R) {
//       for (let C = range.s.c; C <= range.e.c; ++C) {
//         const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
//         const cell = ws[cellAddress];
//         if (!cell) continue;
//         cell.s = cell.s || {};

//         if (tableNameRows.has(R)) {
//           Object.assign(cell.s, tableNameFill);
//         } else if (headerRows.has(R)) {
//           Object.assign(cell.s, headerFill);
//         } else {
//           Object.assign(cell.s, centerAlign);
//         }
//       }
//     }

//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "All Logs");

//     try {
//       XLSX.writeFile(
//         wb,
//         `Site_${site_id || "Unknown"}_Logs_${startDate || "Start"}_To_${
//           startDate || "End"
//         }.xlsx`,
//       );
//       toast.success("Excel file downloaded successfully!");
//     } catch (error) {
//       toast.error("Failed to export Excel file");
//       console.error("Export error:", error);
//     }
//   };

//   const checkStatus = [
//     "subscriptionSitesAssigned",
//     "subscriptionFound",
//     "subscriptionaRenewStatus",
//     "subscriptionPaymentStatus",
//     "subscriptionPlanAccess",
//   ];
//   return (
//     <>
//       {cleaningLoading || errLogloading || timerLogLoading ? (
//         <LoadingSpinner />
//       ) : checkStatus.includes(subscriptionStatus) ? (
//         <SubscriptionExpiryCard
//           data={subscriptiondata}
//           subscriptionStatus={subscriptionStatus}
//           error={offlineLogError || cleaningError}
//         />
//       ) : (
//         //  errorLogError || cleaningError || timerLogError ? (
//         //   <CAlert className="p-2 w-50" color="danger">
//         //     {errorLogError || cleaningError || timerLogError}
//         //   </CAlert>
//         // ) :
//         <div>
//           {/* ================= HEADER + FILTERS ================= */}
//           <h5 className="text-center mb-3">
//             <CBadge color="warning">{site_id.toUpperCase()}</CBadge>
//           </h5>

//           <CRow className="my-3">
//             <CCol md={7} xs={12} className="d-flex flex-wrap gap-2">
//               <CCol md={4} xs={12} className="m-1">
//                 <CFormInput
//                   type="date"
//                   value={startDate}
//                   onChange={(e) => setStartDate(e.target.value)}
//                 />
//               </CCol>
//             </CCol>

//             <CCol
//               md={5}
//               xs={12}
//               className="d-flex justify-content-md-end justify-content-center align-items-center mt-2 mt-md-0"
//             >
//               <CButton color="primary" size="sm" onClick={exportToExcel}>
//                 Export to Excel
//               </CButton>
//             </CCol>
//           </CRow>
//           <div className="mb-3">
//             <CCard className="shadow-sm border-0">
//               <CCardBody className="py-3">
//                 <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2">
//                   {/* Title */}
//                   <h5 className="fw-bold mb-0">🤖 Logs</h5>

//                   {/* Badges */}
//                   <div className="d-flex flex-wrap justify-content-md-end align-items-center gap-2">
//                     <div className="border d-flex flex-wrap justify-content-between align-items-center gap-2 p-2 rounded">
//                       <CBadge
//                         color="secondary"
//                         className="px-3 py-2 rounded-pill"
//                       >
//                         Logs:{" "}
//                         {cleaningCompleted.length +
//                           cleaningInProgress.length +
//                           failureLogs.length}
//                       </CBadge>

//                       <CBadge
//                         color="success"
//                         className="px-3 py-2 rounded-pill"
//                       >
//                         Completed: {cleaningCompleted.length}
//                       </CBadge>

//                       <CBadge
//                         color="warning"
//                         className="px-3 py-2 rounded-pill"
//                       >
//                         In Progress: {cleaningInProgress.length}
//                       </CBadge>
//                       <CBadge color="danger" className="px-3 py-2 rounded-pill">
//                         Error: {failureLogs.length}
//                       </CBadge>
//                     </div>

//                     <CBadge
//                       color="light"
//                       className="px-3 py-2 text-dark rounded-pill"
//                     >
//                       Not Started:
//                       <span className="ms-2 fw-bold">
//                         {robotswhichareonlineandnotstartedForthisSite.length}
//                       </span>
//                     </CBadge>
//                     <CBadge color="primary" className="px-3 py-2 rounded-pill">
//                       Total Assigned Robots: {totalAssignedRobots}
//                     </CBadge>
//                   </div>
//                 </div>
//               </CCardBody>
//             </CCard>
//           </div>
//           {timerLogLoading || offlineLogsloading ? (
//             <div className="text-center my-4">
//               <LoadingSpinner />
//             </div>
//           ) : (
//             <>
//               {/* =============== TABS START =============== */}
//               <CTabs activeItemKey="cleaning-logs">
//                 <CTabList variant="tabs">
//                   <CTab itemKey="cleaning-logs" className="text-white">
//                     Completed Logs
//                   </CTab>
//                   <CTab itemKey="in-progress" className="text-white">
//                     Cleaning In Progress
//                   </CTab>
//                   <CTab itemKey="error-logs" className="text-white">
//                     Error Logs
//                   </CTab>
//                   <CTab itemKey="offline-robots" className="text-white">
//                     Robots that were offline at scheduled cleaning time (Timer)
//                   </CTab>
//                   <CTab itemKey="online-not-started" className="text-white">
//                     Not Started
//                   </CTab>
//                 </CTabList>

//                 <CTabContent>
//                   {/* ================= CLEANING LOGS TAB ============= */}
//                   <CTabPanel itemKey="cleaning-logs">
//                     {/* TABLE */}
//                     <CTable
//                       bordered
//                       hover
//                       responsive
//                       className="text-center bg-important mb-2"
//                     >
//                       <CTableHead color="secondary">
//                         <CTableRow>
//                           <CTableHeaderCell>Sr</CTableHeaderCell>
//                           <CTableHeaderCell style={{ minWidth: "150px" }}>
//                             Robot No
//                           </CTableHeaderCell>
//                           <CTableHeaderCell>Status</CTableHeaderCell>
//                           <CTableHeaderCell style={{ minWidth: "130px" }}>
//                             Row Number
//                           </CTableHeaderCell>
//                           <CTableHeaderCell style={{ minWidth: "190px" }}>
//                             Row Length (Meters)
//                           </CTableHeaderCell>
//                           <CTableHeaderCell style={{ minWidth: "190px" }}>
//                             Started At
//                           </CTableHeaderCell>
//                           <CTableHeaderCell style={{ minWidth: "190px" }}>
//                             Finished At
//                           </CTableHeaderCell>
//                           <CTableHeaderCell style={{ minWidth: "150px" }}>
//                             Battery Start (%)
//                           </CTableHeaderCell>
//                           <CTableHeaderCell style={{ minWidth: "190px" }}>
//                             Battery Finished (%)
//                           </CTableHeaderCell>
//                         </CTableRow>
//                       </CTableHead>

//                       <CTableBody>
//                         {cleaningCompleted.length > 0 ? (
//                           cleaningCompleted.map((log, index) => (
//                             <CTableRow key={index}>
//                               <CTableDataCell>{index + 1}</CTableDataCell>
//                               <CTableDataCell>{log.robot_no}</CTableDataCell>

//                               {/* STATUS */}
//                               <CTableDataCell>
//                                 {log.cleaning.finish ? (
//                                   <CBadge color="success">Completed</CBadge>
//                                 ) : log.cleaning.battery_dead ? (
//                                   <CBadge color="danger">Battery Dead</CBadge>
//                                 ) : log.cleaning.cleaning_cancelled ? (
//                                   <CBadge color="danger">
//                                     Cleaning Cancelled
//                                   </CBadge>
//                                 ) : (
//                                   <CBadge color="info">In Progress</CBadge>
//                                 )}
//                               </CTableDataCell>

//                               <CTableDataCell>{log.row_no}</CTableDataCell>
//                               <CTableDataCell>{log.row_length}</CTableDataCell>

//                               <CTableDataCell>
//                                 {log.cleaning.start &&
//                                   new Date(log.cleaning.startAt).toLocaleString(
//                                     "en-GB",
//                                     {
//                                       day: "2-digit",
//                                       month: "2-digit",
//                                       year: "numeric",
//                                       hour: "2-digit",
//                                       minute: "2-digit",
//                                       second: "2-digit",
//                                       hour12: true,
//                                     },
//                                   )}
//                               </CTableDataCell>

//                               <CTableDataCell>
//                                 {log.cleaning.finish ? (
//                                   new Date(
//                                     log.cleaning.finishAt,
//                                   ).toLocaleString("en-GB", {
//                                     day: "2-digit",
//                                     month: "2-digit",
//                                     year: "numeric",
//                                     hour: "2-digit",
//                                     minute: "2-digit",
//                                     second: "2-digit",
//                                     hour12: true,
//                                   })
//                                 ) : log.cleaning.battery_dead ? (
//                                   <CBadge color="danger">Battery Dead</CBadge>
//                                 ) : log.cleaning.cleaning_cancelled ? (
//                                   <CBadge color="danger">
//                                     Cleaning Cancelled
//                                   </CBadge>
//                                 ) : (
//                                   <CBadge color="info">In Progress</CBadge>
//                                 )}
//                               </CTableDataCell>

//                               <CTableDataCell>
//                                 {log.cleaning.battery_before_cleaning || "N/A"}
//                               </CTableDataCell>

//                               <CTableDataCell>
//                                 {log.cleaning.battery_after_cleaning || "N/A"}
//                               </CTableDataCell>
//                             </CTableRow>
//                           ))
//                         ) : (
//                           <CTableRow>
//                             <CTableDataCell colSpan="11" className="text-start">
//                               No logs found for the selected date.
//                             </CTableDataCell>
//                           </CTableRow>
//                         )}
//                       </CTableBody>
//                     </CTable>
//                   </CTabPanel>

//                   {/* ============ CLEANING IN PROGRESS TAB =========== */}
//                   <CTabPanel itemKey="in-progress">
//                     <h5 className="mt-3 mb-3">Cleaning In Progress</h5>

//                     <CTable
//                       bordered
//                       hover
//                       responsive
//                       className="text-center bg-important"
//                     >
//                       <CTableHead color="secondary">
//                         <CTableRow>
//                           <CTableHeaderCell>#</CTableHeaderCell>
//                           <CTableHeaderCell>Robot No</CTableHeaderCell>
//                           <CTableHeaderCell>Started At</CTableHeaderCell>
//                           <CTableHeaderCell>Block</CTableHeaderCell>
//                           <CTableHeaderCell>Status</CTableHeaderCell>
//                         </CTableRow>
//                       </CTableHead>

//                       <CTableBody>
//                         {cleaningInProgress?.length > 0 ? (
//                           cleaningInProgress.map((log, index) => (
//                             <CTableRow key={index}>
//                               <CTableDataCell>{index + 1}</CTableDataCell>
//                               <CTableDataCell>{log.robot_no}</CTableDataCell>

//                               <CTableDataCell>
//                                 {log.cleaning.start &&
//                                   new Date(log.cleaning.startAt).toLocaleString(
//                                     "en-GB",
//                                     {
//                                       day: "2-digit",
//                                       month: "2-digit",
//                                       year: "numeric",
//                                       hour: "2-digit",
//                                       minute: "2-digit",
//                                       second: "2-digit",
//                                       hour12: true,
//                                     },
//                                   )}
//                               </CTableDataCell>

//                               <CTableDataCell>{log.block}</CTableDataCell>

//                               <CTableDataCell>
//                                 <CBadge color="info">In Progress</CBadge>
//                               </CTableDataCell>
//                             </CTableRow>
//                           ))
//                         ) : (
//                           <CTableRow>
//                             <CTableDataCell colSpan={5} className="text-start">
//                               No Cleaning In Progress logs found for the
//                               selected date.
//                             </CTableDataCell>
//                           </CTableRow>
//                         )}
//                       </CTableBody>
//                     </CTable>
//                   </CTabPanel>

//                   {/* ================================================= */}
//                   {/* ==================== ERROR LOGS ================= */}
//                   {/* ================================================= */}
//                   <CTabPanel itemKey="error-logs">
//                     <h5 className="mt-3 mb-3">🚨 Error Logs</h5>

//                     <CTable
//                       bordered
//                       hover
//                       responsive
//                       className="text-center bg-important"
//                     >
//                       <CTableHead color="secondary">
//                         <CTableRow>
//                           <CTableHeaderCell>#</CTableHeaderCell>
//                           <CTableHeaderCell>Robot No</CTableHeaderCell>
//                           <CTableHeaderCell>Block</CTableHeaderCell>
//                           <CTableHeaderCell>startAt</CTableHeaderCell>
//                           <CTableHeaderCell>Error Type</CTableHeaderCell>
//                         </CTableRow>
//                       </CTableHead>

//                       <CTableBody>
//                         {failureLogs?.length > 0 ? (
//                           failureLogs.map((log, index) => (
//                             <CTableRow key={index}>
//                               <CTableDataCell>{index + 1}</CTableDataCell>
//                               <CTableDataCell>{log.robot_no}</CTableDataCell>
//                               <CTableDataCell>{log.block}</CTableDataCell>
//                               <CTableDataCell>
//                                 {log.createdAt &&
//                                   new Date(log.createdAt).toLocaleString(
//                                     "en-GB",
//                                     {
//                                       day: "2-digit",
//                                       month: "2-digit",
//                                       year: "numeric",
//                                       hour: "2-digit",
//                                       minute: "2-digit",
//                                       second: "2-digit",
//                                       hour12: true,
//                                     },
//                                   )}
//                               </CTableDataCell>{" "}
//                               <CTableDataCell>
//                                 {log.cleaning.battery_dead
//                                   ? "In Complete"
//                                   : "Cleaning Cancelled"}
//                               </CTableDataCell>
//                             </CTableRow>
//                           ))
//                         ) : (
//                           <CTableRow>
//                             <CTableDataCell colSpan={5} className="text-start">
//                               No error logs found for the selected date.
//                             </CTableDataCell>
//                           </CTableRow>
//                         )}
//                       </CTableBody>
//                     </CTable>
//                   </CTabPanel>

//                   {/* ================================================= */}
//                   {/* ============ OFFLINE ROBOTS TAB ================= */}
//                   {/* ================================================= */}
//                   <CTabPanel itemKey="offline-robots">
//                     <h6 className="mt-3">
//                       🚨 Robots that were offline at cleaning time (Timer),
//                     </h6>
//                     <h7 className="text-warning my-3">
//                       Note: These robots numbers may still appear in the above
//                       cleaning log if the robots started cleaning after the
//                       timer.
//                     </h7>
//                     <CTable
//                       bordered
//                       hover
//                       responsive
//                       className="text-center bg-important"
//                     >
//                       <CTableHead color="secondary">
//                         <CTableRow>
//                           <CTableHeaderCell>#</CTableHeaderCell>
//                           <CTableHeaderCell>Robot No</CTableHeaderCell>
//                           <CTableHeaderCell>Block</CTableHeaderCell>
//                           <CTableHeaderCell>Last Uplink</CTableHeaderCell>
//                           <CTableHeaderCell>Error Type</CTableHeaderCell>
//                         </CTableRow>
//                       </CTableHead>

//                       <CTableBody>
//                         {offlineLogsloading ? (
//                           <CTableRow>
//                             <CTableDataCell colSpan={5}>
//                               <LoadingSpinner />
//                             </CTableDataCell>
//                           </CTableRow>
//                         ) : offlineLogError ? (
//                           <CBadge color="danger">{offlineLogError}</CBadge>
//                         ) : offlineLogs?.length > 0 ? (
//                           offlineLogs.map((log, index) => (
//                             <CTableRow key={index}>
//                               <CTableDataCell>{index + 1}</CTableDataCell>
//                               <CTableDataCell>{log.robot_no}</CTableDataCell>
//                               <CTableDataCell>{log.block}</CTableDataCell>
//                               {/* <CTableDataCell>{log.createdAt}</CTableDataCell> */}

//                               <CTableDataCell>
//                                 {log.createdAt &&
//                                   new Date(log.createdAt).toLocaleString(
//                                     "en-GB",
//                                     {
//                                       day: "2-digit",
//                                       month: "2-digit",
//                                       year: "numeric",
//                                       hour: "2-digit",
//                                       minute: "2-digit",
//                                       second: "2-digit",
//                                       hour12: true,
//                                     },
//                                   )}
//                               </CTableDataCell>

//                               <CTableDataCell>{log.error_type}</CTableDataCell>
//                             </CTableRow>
//                           ))
//                         ) : (
//                           <CTableRow>
//                             <CTableDataCell colSpan={5} className="text-start">
//                               No offline Robots found for the selected date.
//                             </CTableDataCell>
//                           </CTableRow>
//                         )}
//                       </CTableBody>
//                     </CTable>
//                   </CTabPanel>

//                   {/* ============online–command-given-not-started TAB ================= */}

//                   <CTabPanel itemKey="online-not-started">
//                     <CTable
//                       bordered
//                       hover
//                       responsive
//                       className="text-center bg-important"
//                     >
//                       <CTableHead color="secondary">
//                         <CTableRow>
//                           <CTableHeaderCell>#</CTableHeaderCell>
//                           <CTableHeaderCell>Robot No</CTableHeaderCell>
//                           <CTableHeaderCell>Block</CTableHeaderCell>
//                           <CTableHeaderCell>Online Status</CTableHeaderCell>
//                           <CTableHeaderCell>Last Uplink</CTableHeaderCell>
//                         </CTableRow>
//                       </CTableHead>

//                       <CTableBody>
//                         {robotswhichareonlineandnotstartedForthisSite?.length >
//                         0 ? (
//                           robotswhichareonlineandnotstartedForthisSite.map(
//                             (log, index) => (
//                               <CTableRow key={index}>
//                                 <CTableDataCell>{index + 1}</CTableDataCell>
//                                 <CTableDataCell>{log.robot_no}</CTableDataCell>
//                                 <CTableDataCell>{log.block}</CTableDataCell>
//                                 <CTableDataCell>
//                                   {log.lora_state === 1 ? (
//                                     <CBadge color="success">Online</CBadge>
//                                   ) : (
//                                     <CBadge color="danger">Offline</CBadge>
//                                   )}
//                                 </CTableDataCell>
//                                 <CTableDataCell>
//                                   {log.last_uplink &&
//                                     new Date(log.last_uplink).toLocaleString(
//                                       "en-GB",
//                                       {
//                                         day: "2-digit",
//                                         month: "2-digit",
//                                         year: "numeric",
//                                         hour: "2-digit",
//                                         minute: "2-digit",
//                                         second: "2-digit",
//                                         hour12: true,
//                                       },
//                                     )}
//                                 </CTableDataCell>
//                               </CTableRow>
//                             ),
//                           )
//                         ) : (
//                           <CTableRow>
//                             <CTableDataCell colSpan={5} className="text-start">
//                               No Online but Not Started robots found.
//                             </CTableDataCell>
//                           </CTableRow>
//                         )}
//                       </CTableBody>
//                     </CTable>
//                   </CTabPanel>
//                 </CTabContent>
//               </CTabs>
//               {/* =============== TABS END =============== */}
//             </>
//           )}
//         </div>
//       )}
//     </>
//   );
// };

// export default ClientCleaningLog;

import React, { useEffect, useReducer, useState } from "react";
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormInput,
  CRow,
  CCol,
  CButton,
  CBadge,
  CAlert,
  CCard,
  CCardBody,
  CTabs,
  CTabList,
  CTab,
  CTabPanel,
  CTabContent,
} from "@coreui/react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import axios from "axios";
// import PaginateInput from "../../../components/PaginateInput";
import * as XLSX from "xlsx";
import SubscriptionExpiryCard from "../../../components/SubscriptionExpiryCard";
import LoadingSpinner from "../../../components/LoadingSpinner";

// import CompletedCycles from "./CompletedCycles";
// import ErrorCycles from "./ErrorCycles";
// import OfflineRobotsCycle from "./OfflineRobotsCycle";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_CLEANING_REQUEST":
      return { ...state, cleaningLoading: true, cleaningError: "" };
    case "FETCH_CLEANING_SUCCESS":
      return {
        ...state,
        cleaningLoading: false,
        total_cleaning_logs: action.payload.total_cleaning_logs,
        total_cleaning_completed: action.payload.total_cleaning_completed,
        total_cleaning_in_progress: action.payload.total_cleaning_in_progress,
        total_failure_logs: action.payload.total_failure_logs,
        total_robots_assigned: action.payload.total_robots_assigned,
        total_not_started_robots: action.payload.total_not_started_robots,
        total_offline_robots_at_time_of_cleaning:
          action.payload.total_offline_robots_at_time_of_cleaning,
        cleaning_completed: action.payload.cleaning_completed,
        cleaning_in_progress: action.payload.cleaning_in_progress,
        cleaning_failures: action.payload.cleaning_failures,
        not_started_robots: action.payload.not_started_robots,
        offline_robots_at_time_of_cleaning:
          action.payload.offline_robots_at_time_of_cleaning,
        dpr: action.payload.dpr,
      };
    case "FETCH_FAIL":
      return {
        ...state,
        cleaningLoading: false,
        cleaningError: action.payload,
        subscriptiondata: action.subscriptiondata,
        subscriptionStatus: action.subscriptionStatus,
      };

    default:
      return state;
  }
};

const ClientCleaningLog = () => {
  const [
    {
      cleaningLoading,
      cleaningError,
      cleaning_completed,
      cleaning_in_progress,
      cleaning_failures,
      total_cleaning_logs,
      total_cleaning_completed,
      total_cleaning_in_progress,
      total_failure_logs,
      total_robots_assigned,
      total_not_started_robots,
      total_offline_robots_at_time_of_cleaning,
      not_started_robots,
      offline_robots_at_time_of_cleaning,
      dpr,
      subscriptionStatus,
      subscriptiondata,
    },
    dispatch,
  ] = useReducer(reducer, {
    cleaningLoading: false,
    cleaningError: "",
    cleaning_completed: [],
    cleaning_in_progress: [],
    cleaning_failures: [],
    dpr: [],
    not_started_robots: [],
    offline_robots_at_time_of_cleaning: [],
    total_cleaning_logs: 0,
    total_cleaning_completed: 0,
    total_cleaning_in_progress: 0,
    total_failure_logs: 0,
    total_robots_assigned: 0,
    total_not_started_robots: 0,
    total_offline_robots_at_time_of_cleaning: 0,

    subscriptionStatus: "",
    subscriptiondata: {},
  });

  const authtoken = useSelector((state) => state.authtoken);
  const { site_id } = useParams();

  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  useEffect(() => {
    const fetchCleaningLogs = async () => {
      try {
        dispatch({ type: "FETCH_CLEANING_REQUEST" });
        const result = await axios.post(
          `/api/v1/robot-tracking/cleaning-logs-for-a-day`,
          {
            site_id,
            date: startDate,
          },
          {
            headers: {
              Authorization: `Bearer ${authtoken}`,
            },
          },
        );

        const data = result.data.data;
        dispatch({
          type: "FETCH_CLEANING_SUCCESS",
          payload: {
            total_cleaning_logs: data.total_cleaning_logs,
            total_cleaning_completed: data.total_cleaning_completed,
            total_cleaning_in_progress: data.total_cleaning_in_progress,
            total_failure_logs: data.total_failure_logs,
            total_robots_assigned: data.total_robots_assigned,
            total_not_started_robots: data.total_not_started_robots,
            total_offline_robots_at_time_of_cleaning:
              data.total_offline_robots_at_time_of_cleaning,
            total_offline_robots: data.total_offline_robots,
            cleaning_completed: data.cleaning_completed,
            cleaning_in_progress: data.cleaning_in_progress,
            cleaning_failures: data.cleaning_failures,
            not_started_robots: data.not_started_robots,
            offline_robots_at_time_of_cleaning:
              data.offline_robots_at_time_of_cleaning,
            dpr: data.dpr,
          },
        });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: error.response?.data?.error || error.response?.data?.message,
          subscriptiondata: error.response?.data?.data,
          subscriptionStatus: error.response?.data.subscriptionStatus,
        });
        toast.error(
          error.response?.data?.error || error.response?.data?.message,
        );
      }
    };

    fetchCleaningLogs();
  }, [site_id, startDate, authtoken]);

  const exportToExcel = () => {
    if (
      !cleaning_completed?.length &&
      !cleaning_in_progress?.length &&
      !cleaning_failures?.length &&
      !offline_robots_at_time_of_cleaning?.length
    ) {
      toast.error("No data available to export.");
      return;
    }

    const mergedData = [];

    // ===================================================
    // 1. Cleaning Logs (Completed)
    // ===================================================
    mergedData.push(["Cleaning Completed Logs"]);

    if (cleaning_completed?.length) {
      mergedData.push([
        "Sr No",
        "Robot No",
        "Row Number",
        "Row Length (Meters)",
        "Start Time",
        "Start Battery (%)",
        "Finish Battery (%)",
        "Finish Time",
        "Status",
      ]);

      cleaning_completed.forEach((log, index) => {
        mergedData.push([
          index + 1,
          log.robot_no || "N/A",
          log.row_no || "N/A",
          log.row_length || "N/A",
          log.cleaning?.startAt
            ? new Date(log.cleaning?.startAt).toLocaleString()
            : "N/A",
          log.cleaning?.battery_before_cleaning ?? "N/A",
          log.cleaning?.battery_after_cleaning ?? "N/A",
          log.cleaning?.finishAt
            ? new Date(log.cleaning?.finishAt).toLocaleString()
            : "N/A",
          log.cleaning?.finish
            ? "Completed"
            : log.cleaning?.battery_dead
              ? "Battery Dead"
              : log.cleaning?.cleaning_cancelled
                ? "Cleaning Cancelled"
                : "In Progress",
        ]);
      });
    } else {
      mergedData.push(["No cleaning logs data available"]);
    }

    mergedData.push([]);
    mergedData.push([]);

    // ===================================================
    // 2. Cleaning In Progress
    // ===================================================
    mergedData.push(["Cleaning In Progress"]);

    if (cleaning_in_progress?.length) {
      mergedData.push(["Sr No", "Robot No", "Started At", "Block", "Status"]);

      cleaning_in_progress.forEach((log, index) => {
        mergedData.push([
          index + 1,
          log.robot_no || "N/A",
          log.cleaning?.startAt
            ? new Date(log.cleaning?.startAt).toLocaleString()
            : "N/A",
          log.block || "N/A",
          "In Progress",
        ]);
      });
    } else {
      mergedData.push(["No Cleaning In Progress logs found"]);
    }

    mergedData.push([]);
    mergedData.push([]);

    // ===================================================
    // 3. Failure Logs
    // ===================================================
    mergedData.push(["Failure Logs"]);

    if (cleaning_failures?.length) {
      mergedData.push(["Sr No", "Robot No", "Block", "Error Type", "Comments"]);

      cleaning_failures.forEach((log, index) => {
        mergedData.push([
          index + 1,
          log.robot_no || "N/A",
          log.block || "N/A",
          log.cleaning?.battery_dead ? "Incomplete" : "Cleaning Cancelled",
          log.comments,
        ]);
      });
    } else {
      mergedData.push(["No error logs found"]);
    }

    mergedData.push([]);
    mergedData.push([]);

    // ===================================================
    // 4. Offline Robots
    // ===================================================
    mergedData.push(["Offline Robots At the time of cleaning"]);

    if (offline_robots_at_time_of_cleaning?.length) {
      mergedData.push(["Sr No", "Robot No", "Block", "Error Type"]);

      offline_robots_at_time_of_cleaning.forEach((log, index) => {
        mergedData.push([
          index + 1,
          log.robot_no || "N/A",
          log.block || "N/A",
          log.error_type || "N/A",
        ]);
      });
    } else {
      mergedData.push(["No offline Robots found"]);
    }

    mergedData.push([]);
    mergedData.push([]);

    // ===================================================
    // 5.  Not Started
    // ===================================================

    mergedData.push(["Not Started"]);

    if (not_started_robots?.length) {
      mergedData.push(["Sr No", "Robot No", "Block", "Status"]);

      not_started_robots.forEach((log, index) => {
        mergedData.push([
          index + 1,
          log.robot_no || "N/A",
          log.block || "N/A",
          "Not Started",
        ]);
      });
    } else {
      mergedData.push([" Not Started robots found"]);
    }

    mergedData.push([]);
    mergedData.push([]);
    // ===================================================
    // 6. Technician DPR Logs (NEW)
    // ===================================================
    mergedData.push(["Technician DPR Logs"]);

    if (dpr?.length) {
      mergedData.push([
        "Sr No",
        "Date",
        "Site",
        // "Operational Robots",
        // "Failed Robots",
        // "Total Robots",
        "Remarks",
        "Technician",
      ]);

      dpr.forEach((log, index) => {
        const technician = log.technician_present?.[0]?.name || "-";
        const reportDate = log.report_date
          ? new Date(log.report_date).toLocaleDateString()
          : "-";

        mergedData.push([
          index + 1,
          reportDate,
          log.site_id,
          // log.total_running_robots,
          // log.total_failed_robots,
          // log.total_robots,
          log.comments || "-",
          technician,
        ]);
      });
    } else {
      mergedData.push(["No DPR logs available"]);
    }

    mergedData.push([]);
    mergedData.push([]);
    // ===================================================
    // 5. Summary
    // ===================================================
    mergedData.push(["Summary"]);
    mergedData.push(["Site ID", site_id || "N/A"]);
    mergedData.push(["Report Period", `${startDate} to ${startDate}`]);
    mergedData.push(["Generated At", new Date().toLocaleString()]);
    mergedData.push([]);
    mergedData.push(["Data Summary"]);
    mergedData.push([
      "Cleaning Logs (Completed)",
      total_cleaning_completed || 0,
    ]);
    mergedData.push([
      "Cleaning In Progress",
      total_cleaning_in_progress?.length || 0,
    ]);
    mergedData.push(["Failure Logs", total_failure_logs || 0]);
    mergedData.push([
      "Offline Robots",
      total_offline_robots_at_time_of_cleaning || 0,
    ]);
    mergedData.push(["Technician DPR Logs", dpr?.length || 0]);

    mergedData.push([]);
    mergedData.push([]);

    // ===================================================
    // Create Sheet + Formatting
    // ===================================================
    const ws = XLSX.utils.aoa_to_sheet(mergedData);

    // Column widths
    ws["!cols"] = [
      { wch: 5 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 25 },
      { wch: 25 },
    ];

    const range = XLSX.utils.decode_range(ws["!ref"]);

    const tableNameFill = {
      fill: { fgColor: { rgb: "FFFFF2CC" } },
      font: { bold: true },
      alignment: { horizontal: "center" },
    };
    const headerFill = {
      fill: { fgColor: { rgb: "FFBDD7EE" } },
      font: { bold: true },
      alignment: { horizontal: "center" },
    };
    const centerAlign = {
      alignment: { horizontal: "center", wrapText: true },
    };

    // Identify table title rows (every section title)
    const tableNameRows = new Set([0, 4, 8, 12, 16, 23]); // added DPR section
    const headerRows = new Set([1, 5, 9, 13, 18, 24]);

    // Apply style
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        const cell = ws[cellAddress];
        if (!cell) continue;
        cell.s = cell.s || {};

        if (tableNameRows.has(R)) {
          Object.assign(cell.s, tableNameFill);
        } else if (headerRows.has(R)) {
          Object.assign(cell.s, headerFill);
        } else {
          Object.assign(cell.s, centerAlign);
        }
      }
    }

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "All Logs");

    try {
      XLSX.writeFile(
        wb,
        `Site_${site_id || "Unknown"}_Logs_${startDate}_To_${startDate}.xlsx`,
      );
      toast.success("File exported!");
    } catch (error) {
      toast.error("Failed to export Excel file");
      console.error("Export error:", error);
    }
  };

  // const handlePageInputChange = (e) => {
  //   setPageInput(e.target.value);
  // };

  // const handlePageChange = (newPage) => {
  //   if (newPage >= 1 && newPage <= totalPages) {
  //     setPage(newPage);
  //   }
  // };

  // const handlePageInputSubmit = () => {
  //   const pageNumber = parseInt(pageInput);
  //   if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
  //     handlePageChange(pageNumber);
  //   }
  // };
  const checkStatus = [
    "subscriptionSitesAssigned",
    "subscriptionFound",
    "subscriptionaRenewStatus",
    "subscriptionPaymentStatus",
    "subscriptionPlanAccess",
  ];

  const successRobotCount = {};
  const inProgressRobotCount = {};
  const failureRobotCount = {};
  const notStartedRobotCount = {};

  cleaning_completed &&
    cleaning_completed.forEach((log) => {
      successRobotCount[log.robot_no] =
        (successRobotCount[log.robot_no] || 0) + 1;
    });

  cleaning_in_progress &&
    cleaning_in_progress.forEach((log) => {
      inProgressRobotCount[log.robot_no] =
        (inProgressRobotCount[log.robot_no] || 0) + 1;
    });

  cleaning_failures &&
    cleaning_failures.forEach((log) => {
      failureRobotCount[log.robot_no] =
        (failureRobotCount[log.robot_no] || 0) + 1;
    });

  not_started_robots &&
    not_started_robots.forEach((log) => {
      notStartedRobotCount[log.robot_no] =
        (notStartedRobotCount[log.robot_no] || 0) + 1;
    });
  return (
    <>
      {cleaningLoading ? (
        <LoadingSpinner />
      ) : checkStatus.includes(subscriptionStatus) ? (
        <SubscriptionExpiryCard
          data={subscriptiondata}
          subscriptionStatus={subscriptionStatus}
          error={cleaningError}
        />
      ) : cleaningError ? (
        <CAlert className="p-2 w-50" color="danger">
          {cleaningError}
        </CAlert>
      ) : (
        <div>
          {/* HEADER + FILTERS */}
          <h5 className="text-center mb-3">
            <CBadge color="warning">{site_id.toUpperCase()}</CBadge>
          </h5>

          <CRow className="my-3">
            <CCol md={7} xs={12} className="d-flex flex-wrap gap-2">
              <CCol md={4} xs={12} className="m-1">
                <CFormInput
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </CCol>
            </CCol>

            <CCol
              md={5}
              xs={12}
              className="d-flex justify-content-md-end justify-content-center align-items-center mt-2 mt-md-0"
            >
              <CButton color="primary" size="sm" onClick={exportToExcel}>
                Export to Excel
              </CButton>
            </CCol>
          </CRow>

          {/* Total Logs Badges */}
          <div className="mb-3">
            <CCard className="shadow-sm border-0">
              <CCardBody className="py-3">
                <CRow className="align-items-center">
                  <CCol xs="12" md="12">
                    <div className="d-flex flex-wrap  justify-content-between  align-iems-center">
                      <h5 className="fw-bold mb-0 me-3">🤖 Logs</h5>
                      <CBadge
                        color="primary"
                        className="px-3 py-2 rounded-pill m-1"
                        style={{ fontSize: "14px" }}
                      >
                        Total Assigned Robots: {total_robots_assigned}
                      </CBadge>
                      <CBadge
                        color="secondary"
                        className="px-3 py-2 rounded-pill m-1"
                        style={{ fontSize: "14px" }}
                      >
                        Total Logs:
                        {total_cleaning_logs}
                      </CBadge>
                      <CBadge
                        color="success"
                        className="px-3 py-2 rounded-pill m-1"
                        style={{ fontSize: "14px" }}
                      >
                        Completed: {total_cleaning_completed}
                      </CBadge>
                      <CBadge
                        color="warning"
                        className="px-3 py-2 rounded-pill m-1"
                        style={{ fontSize: "14px" }}
                      >
                        In Progress: {total_cleaning_in_progress}
                      </CBadge>
                      <CBadge
                        color="danger"
                        className="px-3 py-2 rounded-pill m-1"
                        style={{ fontSize: "14px" }}
                      >
                        Failure: {total_failure_logs}
                      </CBadge>
                      <CBadge
                        color="danger"
                        className="px-3 py-2 rounded-pill m-1"
                        style={{ fontSize: "14px" }}
                      >
                        Offline at cleaning time:
                        {total_offline_robots_at_time_of_cleaning}
                      </CBadge>
                      <CBadge
                        color="danger"
                        className="px-3 py-2 rounded-pill m-1"
                        style={{ fontSize: "14px" }}
                      >
                        Not Started :
                        <spa className="ms-2">{total_not_started_robots}</spa>
                      </CBadge>
                    </div>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          </div>

          {/* Tabs Section */}
          {cleaningLoading ? (
            <div className="text-center my-4">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              <CTabs activeItemKey="cleaning-logs">
                <CTabList variant="tabs" className="border-bottom">
                  <CTab itemKey="cleaning-logs" className="text-white">
                    Completed Logs
                  </CTab>
                  <CTab itemKey="in-progress" className="text-white">
                    Cleaning In Progress
                  </CTab>
                  <CTab itemKey="error-logs" className="text-white">
                    Failure Logs
                  </CTab>
                  <CTab itemKey="offline-robots" className="text-white">
                    Offline at cleaning time
                  </CTab>

                  <CTab
                    itemKey="online–command-given-not-started"
                    className="text-white"
                  >
                    Not Started
                  </CTab>
                  <CTab itemKey="technician-dpr-logs" className="text-white">
                    Technician DPR Logs
                  </CTab>
                </CTabList>

                <CTabContent>
                  {/* Completed Logs Tab */}
                  <CTabPanel itemKey="cleaning-logs">
                    <CTable
                      bordered
                      hover
                      responsive
                      className="text-center bg-important mb-2"
                    >
                      <CTableHead color="secondary">
                        <CTableRow>
                          <CTableHeaderCell>Sr</CTableHeaderCell>
                          <CTableHeaderCell style={{ minWidth: "150px" }}>
                            Robot No
                          </CTableHeaderCell>
                          <CTableHeaderCell>Status</CTableHeaderCell>
                          <CTableHeaderCell>Block</CTableHeaderCell>
                          <CTableHeaderCell style={{ minWidth: "130px" }}>
                            Row Number
                          </CTableHeaderCell>
                          <CTableHeaderCell style={{ minWidth: "190px" }}>
                            Row Length (Meters)
                          </CTableHeaderCell>
                          <CTableHeaderCell style={{ minWidth: "190px" }}>
                            Started At
                          </CTableHeaderCell>
                          <CTableHeaderCell style={{ minWidth: "190px" }}>
                            Finished At
                          </CTableHeaderCell>
                          <CTableHeaderCell style={{ minWidth: "150px" }}>
                            Battery Start (%)
                          </CTableHeaderCell>
                          <CTableHeaderCell style={{ minWidth: "190px" }}>
                            Battery Finished (%)
                          </CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>

                      <CTableBody>
                        {cleaning_completed.length > 0 ? (
                          cleaning_completed.map((log, index) => (
                            <CTableRow key={index}>
                              <CTableDataCell>{index + 1}</CTableDataCell>
                              <CTableDataCell
                                color={
                                  successRobotCount[log.robot_no] > 1
                                    ? "success"
                                    : ""
                                }
                              >
                                {log.robot_no}
                              </CTableDataCell>

                              {/* STATUS */}
                              <CTableDataCell>
                                {log.cleaning?.finish ? (
                                  <CBadge color="success">Completed</CBadge>
                                ) : log.cleaning?.battery_dead ? (
                                  <CBadge color="danger">Battery Dead</CBadge>
                                ) : log.cleaning?.cleaning_cancelled ? (
                                  <CBadge color="danger">
                                    Cleaning Cancelled
                                  </CBadge>
                                ) : (
                                  <CBadge color="info">In Progress</CBadge>
                                )}
                              </CTableDataCell>
                              <CTableDataCell>{log.block}</CTableDataCell>
                              <CTableDataCell>{log.row_no}</CTableDataCell>
                              <CTableDataCell>{log.row_length}</CTableDataCell>

                              <CTableDataCell>
                                {log.cleaning?.start &&
                                  new Date(
                                    log.cleaning?.startAt,
                                  ).toLocaleString("en-GB", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                    hour12: true,
                                  })}
                              </CTableDataCell>

                              <CTableDataCell>
                                {log.cleaning?.finish ? (
                                  new Date(
                                    log.cleaning?.finishAt,
                                  ).toLocaleString("en-GB", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                    hour12: true,
                                  })
                                ) : log.cleaning?.battery_dead ? (
                                  <CBadge color="danger">Battery Dead</CBadge>
                                ) : log.cleaning?.cleaning_cancelled ? (
                                  <CBadge color="danger">
                                    Cleaning Cancelled
                                  </CBadge>
                                ) : (
                                  <CBadge color="info">In Progress</CBadge>
                                )}
                              </CTableDataCell>

                              <CTableDataCell>
                                {log.cleaning?.battery_before_cleaning || "N/A"}
                              </CTableDataCell>

                              <CTableDataCell>
                                {log.cleaning?.battery_after_cleaning || "N/A"}
                              </CTableDataCell>
                            </CTableRow>
                          ))
                        ) : (
                          <CTableRow>
                            <CTableDataCell colSpan="11" className="text-start">
                              No logs found for the selected date.
                            </CTableDataCell>
                          </CTableRow>
                        )}
                      </CTableBody>
                    </CTable>
                  </CTabPanel>

                  {/* Cleaning In Progress */}
                  <CTabPanel itemKey="in-progress">
                    <CTable
                      bordered
                      hover
                      responsive
                      className="text-center bg-important"
                    >
                      <CTableHead color="secondary">
                        <CTableRow>
                          <CTableHeaderCell>#</CTableHeaderCell>
                          <CTableHeaderCell>Robot No</CTableHeaderCell>
                          <CTableHeaderCell>Started At</CTableHeaderCell>
                          <CTableHeaderCell>Block</CTableHeaderCell>
                          <CTableHeaderCell>Status</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>

                      <CTableBody>
                        {cleaning_in_progress?.length > 0 ? (
                          cleaning_in_progress.map((log, index) => (
                            <CTableRow key={index}>
                              <CTableDataCell>{index + 1}</CTableDataCell>
                              <CTableDataCell
                                color={
                                  inProgressRobotCount[log.robot_no] > 1
                                    ? "warning"
                                    : ""
                                }
                              >
                                {log.robot_no}
                              </CTableDataCell>
                              <CTableDataCell>
                                {log.cleaning?.start &&
                                  new Date(
                                    log.cleaning?.startAt,
                                  ).toLocaleString("en-GB", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                    hour12: true,
                                  })}
                              </CTableDataCell>
                              <CTableDataCell>{log.block}</CTableDataCell>
                              <CTableDataCell>
                                <CBadge color="info">In Progress</CBadge>
                              </CTableDataCell>
                            </CTableRow>
                          ))
                        ) : (
                          <CTableRow>
                            <CTableDataCell colSpan={5} className="text-start">
                              No Cleaning In Progress logs found for the
                              selected date.
                            </CTableDataCell>
                          </CTableRow>
                        )}
                      </CTableBody>
                    </CTable>
                  </CTabPanel>

                  {/* Failure Logs */}
                  <CTabPanel itemKey="error-logs">
                    <CTable
                      bordered
                      hover
                      responsive
                      className="text-center bg-important"
                    >
                      <CTableHead color="secondary">
                        <CTableRow>
                          <CTableHeaderCell>#</CTableHeaderCell>
                          <CTableHeaderCell>Robot No</CTableHeaderCell>
                          <CTableHeaderCell>Block</CTableHeaderCell>
                          <CTableHeaderCell>Is Duplicate</CTableHeaderCell>
                          <CTableHeaderCell>startAt</CTableHeaderCell>
                          <CTableHeaderCell>Error Type</CTableHeaderCell>
                          <CTableHeaderCell>Comments</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>

                      <CTableBody>
                        {cleaning_failures?.length > 0 ? (
                          cleaning_failures.map((log, index) => (
                            <CTableRow key={index}>
                              <CTableDataCell>{index + 1}</CTableDataCell>
                              <CTableDataCell
                                color={
                                  failureRobotCount[log.robot_no] > 1
                                    ? "danger"
                                    : ""
                                }
                              >
                                {log.robot_no}
                              </CTableDataCell>
                              <CTableDataCell>{log.block}</CTableDataCell>
                              <CTableDataCell>
                                {log.is_duplicate ? (
                                  <CBadge color="danger">Yes</CBadge>
                                ) : (
                                  <CBadge color="success">No</CBadge>
                                )}
                              </CTableDataCell>
                              <CTableDataCell>
                                {log.createdAt &&
                                  new Date(log.createdAt).toLocaleString(
                                    "en-GB",
                                    {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      second: "2-digit",
                                      hour12: true,
                                    },
                                  )}
                              </CTableDataCell>{" "}
                              <CTableDataCell>
                                {log.cleaning?.battery_dead
                                  ? "In Complete"
                                  : "Cleaning Cancelled"}
                              </CTableDataCell>
                              <CTableDataCell>{log.comments}</CTableDataCell>
                            </CTableRow>
                          ))
                        ) : (
                          <CTableRow>
                            <CTableDataCell colSpan={6} className="text-start">
                              No error logs found for the selected date.
                            </CTableDataCell>
                          </CTableRow>
                        )}
                      </CTableBody>
                    </CTable>

                    {/* <h4 className="my-3  border-top">Testing Error Cycles</h4>
                    <ErrorCycles errorlogs={failureLogs} /> */}
                  </CTabPanel>

                  {/* ============ OFFLINE ROBOTS TAB ================= */}
                  {/* ================================================= */}
                  <CTabPanel itemKey="offline-robots">
                    <CTable
                      bordered
                      hover
                      responsive
                      className="text-center bg-important"
                    >
                      <CTableHead color="secondary">
                        <CTableRow>
                          <CTableHeaderCell>#</CTableHeaderCell>
                          <CTableHeaderCell>Robot No</CTableHeaderCell>
                          <CTableHeaderCell>Block</CTableHeaderCell>
                          <CTableHeaderCell>Timer At</CTableHeaderCell>
                          <CTableHeaderCell>Error Type</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>

                      <CTableBody>
                        {offline_robots_at_time_of_cleaning?.length > 0 ? (
                          offline_robots_at_time_of_cleaning.map(
                            (log, index) => (
                              <CTableRow key={index}>
                                <CTableDataCell>{index + 1}</CTableDataCell>
                                <CTableDataCell>{log.robot_no}</CTableDataCell>
                                <CTableDataCell>{log.block}</CTableDataCell>
                                <CTableDataCell>
                                  {log.createdAt &&
                                    new Date(log.createdAt).toLocaleString(
                                      "en-GB",
                                      {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit",
                                        hour12: true,
                                      },
                                    )}
                                </CTableDataCell>

                                <CTableDataCell>
                                  {log.error_type}
                                </CTableDataCell>
                              </CTableRow>
                            ),
                          )
                        ) : (
                          <CTableRow>
                            <CTableDataCell colSpan={5} className="text-start">
                              No offline Robots found for the selected date.
                            </CTableDataCell>
                          </CTableRow>
                        )}
                      </CTableBody>
                    </CTable>
                    {/* <h4 className="my-3  border-top">Offline Robots Cycles</h4>
                    <OfflineRobotsCycle
                      offlineLogs={offlineRobots}
                      loading={offlineRobotLoading}
                      error={offlineRobotError}
                    /> */}
                  </CTabPanel>

                  {/* ============online–command-given-not-started TAB ================= */}
                  {/* ================================================= */}
                  <CTabPanel itemKey="online–command-given-not-started">
                    <CTable
                      bordered
                      hover
                      responsive
                      className="text-center bg-important"
                    >
                      <CTableHead color="secondary">
                        <CTableRow>
                          <CTableHeaderCell>#</CTableHeaderCell>
                          <CTableHeaderCell>Robot No</CTableHeaderCell>
                          <CTableHeaderCell>Block</CTableHeaderCell>
                          <CTableHeaderCell>Online Status</CTableHeaderCell>
                          <CTableHeaderCell>Last Uplink</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>

                      <CTableBody>
                        {not_started_robots?.length > 0 ? (
                          not_started_robots.map((log, index) => (
                            <CTableRow
                              key={index}
                              color={
                                notStartedRobotCount[log.robot_no] > 1
                                  ? "danger"
                                  : ""
                              }
                            >
                              <CTableDataCell>{index + 1}</CTableDataCell>
                              <CTableDataCell>{log.robot_no}</CTableDataCell>
                              <CTableDataCell>{log.block}</CTableDataCell>
                              <CTableDataCell>
                                {log.lora_state ? (
                                  <CBadge color="success">Online</CBadge>
                                ) : (
                                  <CBadge color="danger">Offline</CBadge>
                                )}
                              </CTableDataCell>
                              {/* <CTableDataCell>{log.createdAt}</CTableDataCell> */}

                              <CTableDataCell>
                                {log.last_uplink &&
                                  new Date(log.last_uplink).toLocaleString(
                                    "en-GB",
                                    {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      second: "2-digit",
                                      hour12: true,
                                    },
                                  )}
                              </CTableDataCell>
                            </CTableRow>
                          ))
                        ) : (
                          <CTableRow>
                            <CTableDataCell colSpan={5} className="text-start">
                              No Robots Found
                            </CTableDataCell>
                          </CTableRow>
                        )}
                      </CTableBody>
                    </CTable>
                  </CTabPanel>

                  {/* Technician DPR Robots */}
                  <CTabPanel itemKey="technician-dpr-logs">
                    <CTable
                      bordered
                      hover
                      responsive
                      className="text-center bg-important"
                    >
                      <CTableHead color="secondary">
                        <CTableRow>
                          <CTableHeaderCell>Sr</CTableHeaderCell>
                          <CTableHeaderCell>Date</CTableHeaderCell>
                          <CTableHeaderCell>Site</CTableHeaderCell>
                          {/* <CTableHeaderCell>
                            Operational Robots
                          </CTableHeaderCell>
                          <CTableHeaderCell>Failed Robots</CTableHeaderCell>
                          <CTableHeaderCell>Total Robots</CTableHeaderCell>
                          <CTableHeaderCell>FromLog (Success)</CTableHeaderCell> */}
                          <CTableHeaderCell>Remarks</CTableHeaderCell>
                          <CTableHeaderCell>Technician</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>

                      <CTableBody>
                        {dpr?.length > 0 ? (
                          dpr.map((log, index) => {
                            const technician =
                              log.technician_present?.[0]?.name || "-";
                            const reportDate = log.report_date
                              ? new Date(log.report_date).toLocaleDateString()
                              : "-";

                            return (
                              <CTableRow key={index}>
                                <CTableDataCell>{index + 1}</CTableDataCell>
                                <CTableDataCell>{reportDate}</CTableDataCell>
                                <CTableDataCell>{log.site_id}</CTableDataCell>
                                {/* <CTableDataCell>
                                  {log.total_running_robots}
                                </CTableDataCell>
                                <CTableDataCell>
                                  {log.total_failed_robots}
                                </CTableDataCell>
                                <CTableDataCell>
                                  {log.total_robots}
                                </CTableDataCell> */}
                                {/* <CTableDataCell>
                                 <span
                                  className={`badge ${
                                    cleaningSuccessMap?.[log.site_id]
                                      ? "bg-success"
                                      : "bg-danger"
                                  }`}
                                >
                                  {cleaningSuccessMap?.[log.site_id] || 0}
                                </span> 
                                </CTableDataCell> */}
                                <CTableDataCell>
                                  {log.comments || "-"}
                                </CTableDataCell>
                                <CTableDataCell>{technician}</CTableDataCell>
                              </CTableRow>
                            );
                          })
                        ) : (
                          <CTableRow>
                            <CTableDataCell colSpan={9} className="text-start">
                              No DPR logs found for the selected date.
                            </CTableDataCell>
                          </CTableRow>
                        )}
                      </CTableBody>
                    </CTable>{" "}
                  </CTabPanel>
                </CTabContent>
              </CTabs>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ClientCleaningLog;
