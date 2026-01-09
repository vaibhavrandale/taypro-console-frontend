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
// } from "@coreui/react";
// import { useParams } from "react-router-dom";
// import toast from "react-hot-toast";
// import { useSelector } from "react-redux";
// import axios from "axios";
// // import PaginateInput from "../../../components/PaginateInput";
// import * as XLSX from "xlsx";
// import LoadingSpinner from "../../../components/LoadingSpinner";

// const reducer = (state, action) => {
//   switch (action.type) {
//     case "FETCH_CLEANING_REQUEST":
//       return { ...state, cleaningLoading: true, cleaningError: "" };
//     case "FETCH_CLEANING_SUCCESS":
//       return {
//         ...state,
//         cleaningLoading: false,
//         cleaninglogs: action.payload.cleaninglogs,
//       };
//     case "FETCH_FAIL":
//       return {
//         ...state,
//         cleaningLoading: false,
//         cleaningError: action.payload,
//       };
// case "FETCH_ERROR_LOGS_SUCCESS":
//   return { ...state, errorLogs: action.payload };
// case "FETCH_TIMER_LOGS_SUCCESS":
//   return { ...state, timerLogs: action.payload };
// case "FETCH_TIMER_LOGS_FAIL":
//   return { ...state, error: action.payload };
// case "FETCH_DPR_SUCCESS":
//   return { ...state, dprLogs: action.payload };

//     default:
//       return state;
//   }
// };

// const SitewaiseLog = () => {
//   const [
//     {
//       loading,
//       cleaninglogs,
//       cleaningLoading,
//       cleaningError,
//       // totalPages,
//       // hasNextPage,
//       // hasPrevPage,

//       timerLogs,
//       dprLogs,
//       errorLogs,
//     },
//     dispatch,
//   ] = useReducer(reducer, {
//     cleaninglogs: [],
//     errorLogs: [],
//     timerLogs: [],
//     dprLogs: [],
//     loading: false,
//     cleaningError: false,
//     error: "",
//     cleaningError: "",
//     // totalPages: 1,
//     // hasNextPage: false,
//     // hasPrevPage: false,
//   });

//   const authtoken = useSelector((state) => state.authtoken);
//   const { site_id } = useParams();

//   const [startDate, setStartDate] = useState(
//     new Date().toISOString().split("T")[0]
//   );
//   // const [startDate, setEndDate] = useState(
//   //   new Date().toISOString().split("T")[0]
//   // );
//   // const [pageInput, setPageInput] = useState("");
//   // const [page, setPage] = useState(1);
//   // const [limit, setLimit] = useState(10);

//   useEffect(() => {
//     // const fetchCleaningLogs = async () => {
//     //   let pagination = {
//     //     pg: page,
//     //     limit: limit,
//     //   };
//     //   try {
//     //     dispatch({ type: "FETCH_REQUEST" });
//     //     const result = await axios.post(
//     //       `/api/v1/cleaninglogs/${startDate}/${startDate}/${site_id}`,
//     //       pagination,
//     //       {
//     //         headers: {
//     //           Authorization: `Bearer ${authtoken}`,
//     //         },
//     //       }
//     //     );
//     //     let total = Math.ceil(
//     //       Number(result.data.total) / Number(result.data.limit)
//     //     );
//     //     let next = result.data.hasNextPage;
//     //     let prev = result.data.hasPrevPage;
//     //     const data = result.data.data;
//     //     dispatch({
//     //       type: "FETCH_SUCCESS",
//     //       payload: {
//     //         cleaninglogs: data,
//     //         totalPages: total,
//     //         hasNextPage: next,
//     //         hasPrevPage: prev,
//     //       },
//     //     });
//     //   } catch (error) {
//     //     dispatch({
//     //       type: "FETCH_FAIL",
//     //       payload: error.response?.data?.error || error.message,
//     //     });
//     //     toast.error(error.response?.data?.error || error.message);
//     //   }
//     // };
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
//           }
//         );

//         const data = result.data.data;
//         dispatch({
//           type: "FETCH_CLEANING_SUCCESS",
//           payload: {
//             cleaninglogs: data,
//           },
//         });
//       } catch (error) {
//         dispatch({
//           type: "FETCH_FAIL",
//           payload: error.response?.data?.error || error.response?.data?.message,
//         });
//         toast.error(
//           error.response?.data?.error || error.response?.data?.message
//         );
//       }
//     };
// const fetchErrorLogs = async () => {
//   try {
//     const response = await axios.get(
//       `/api/v1/errorlogs/site-error-logs/${site_id}/${startDate}/${startDate}`,
//       {
//         headers: {
//           Authorization: `Bearer ${authtoken}`,
//         },
//       }
//     );
//     dispatch({
//       type: "FETCH_ERROR_LOGS_SUCCESS",
//       payload: response.data.data,
//     });
//   } catch (error) {
//     toast.error("Failed to fetch error logs");
//   }
// };

//     const fetchTimerLogs = async () => {
//       try {
//         const response = await axios.get(
//           `/api/v1/weathertimerupdatenotification/get-weather-timer-update-notification/${site_id}/${startDate}/${startDate}`,
//           {
//             headers: {
//               Authorization: `Bearer ${authtoken}`,
//             },
//           }
//         );
//         dispatch({
//           type: "FETCH_TIMER_LOGS_SUCCESS",
//           payload: response.data.data,
//         });
//       } catch (error) {
//         dispatch({
//           type: "FETCH_TIMER_LOGS_FAIL",
//           payload:
//             error.response?.data?.error ||
//             error.response?.data?.message ||
//             error.message,
//         });
//         toast.error(
//           error.response?.data?.error ||
//             error.response?.data?.message ||
//             error.message
//         );
//       }
//     };

// const fetchDprLogs = async () => {
//   try {
//     const { data } = await axios.get(
//       `/api/v1/techniciandprs/techniciandpr/${site_id}/${startDate}/${startDate}`,
//       {
//         headers: {
//           Authorization: `Bearer ${authtoken}`,
//         },
//       }
//     );
//     console.log(data.data);

//     if (data.success) {
//       dispatch({
//         type: "FETCH_DPR_SUCCESS",
//         payload: data.data,
//       });
//     } else {
//       throw new Error(data.message || "Failed to fetch DPR logs");
//     }
//   } catch (err) {
//     dispatch({
//       type: "FETCH_FAIL",
//       payload: err.response?.data?.error || err.message,
//     });
//     toast.error(err.response?.data?.error || err.message);
//   }
// };

//     fetchCleaningLogs();
//     fetchErrorLogs();
//     fetchTimerLogs();
//     fetchDprLogs();
//   }, [site_id, startDate, authtoken]);

//   const exportToExcel = () => {
//     const hasCleaningLogs =
//       Array.isArray(cleaninglogs) && cleaninglogs.length > 0;
//     const hasErrorLogs = Array.isArray(errorLogs) && errorLogs.length > 0;
//     const hasTimerLogs = Array.isArray(timerLogs) && timerLogs.length > 0;

//     if (!hasCleaningLogs && !hasErrorLogs && !hasTimerLogs) {
//       toast.error("No data available to export.");
//       return;
//     }

//     const mergedData = [];

//     // 1. Timer Logs
//     mergedData.push(["Timer Logs"]);
//     if (hasTimerLogs) {
//       mergedData.push([
//         "Site ID",
//         "Block",
//         "Timer Update",
//         "Last Updated",
//         "Created At",
//       ]);
//       timerLogs.forEach((siteData) => {
//         if (!siteData || !Array.isArray(siteData.last_activity)) return;
//         siteData.last_activity.forEach((blockData) => {
//           if (!blockData) return;
//           if (blockData.detail) {
//             mergedData.push([
//               siteData.site_id || "N/A",
//               blockData.block || "N/A",
//               blockData.detail || "N/A",
//               siteData.updatedAt
//                 ? new Date(siteData.updatedAt).toLocaleString()
//                 : "N/A",
//               siteData.createdAt
//                 ? new Date(siteData.createdAt).toLocaleString()
//                 : "N/A",
//             ]);
//           } else if (Array.isArray(blockData.details)) {
//             blockData.details.forEach((detail) => {
//               mergedData.push([
//                 siteData.site_id || "N/A",
//                 blockData.block || "N/A",
//                 detail || "N/A",
//                 siteData.updatedAt
//                   ? new Date(siteData.updatedAt).toLocaleString()
//                   : "N/A",
//                 siteData.createdAt
//                   ? new Date(siteData.createdAt).toLocaleString()
//                   : "N/A",
//               ]);
//             });
//           }
//         });
//       });
//     } else {
//       mergedData.push(["No timer logs data available"]);
//     }
//     mergedData.push([]);

//     // 2. Cleaning Logs
//     mergedData.push(["Cleaning Logs"]);
//     if (hasCleaningLogs) {
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
//       cleaninglogs.forEach((log, index) => {
//         mergedData.push([
//           index + 1,
//           log.robot_no || "N/A",
//           log.row_no || "N/A",
//           log.row_length || "N/A",
//           log.cleaning.start
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
//           log.cleaning.battery_before_cleaning
//             ? log.cleaning.battery_before_cleaning
//             : "N/A",

//           log.cleaning.battery_after_cleaning
//             ? log.cleaning.battery_after_cleaning
//             : "N/A",
//           log.cleaning.finish
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
//           log.cleaning.finish
//             ? "Completed"
//             : log.cleaning.battery_dead
//             ? "Battery Dead"
//             : log.cleaning.cleaning_cancelled
//             ? "Cleaning Cancelled"
//             : "In Progress",
//         ]);
//       });
//     } else {
//       mergedData.push(["No cleaning logs data available"]);
//     }
//     mergedData.push([]);

//     // 3. Error Logs
//     // mergedData.push(["Error Logs"]);
//     // if (hasErrorLogs) {
//     //   mergedData.push(["Sr No", "Robot No", "Block", "Error Type", "Date"]);
//     //   errorLogs.forEach((log, index) => {
//     //     const errorDate = log.date ? new Date(log.date) : null;
//     //     mergedData.push([
//     //       index + 1,
//     //       log.robot_no || "N/A",
//     //       log.block || "N/A",
//     //       log.error_type || "N/A",
//     //       errorDate ? errorDate.toLocaleDateString() : "N/A",
//     //     ]);
//     //   });
//     // } else {
//     //   mergedData.push(["No error logs data available"]);
//     // }
//     mergedData.push([]);

//     // 4. Summary
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
//       "Cleaning Logs",
//       hasCleaningLogs ? cleaninglogs.length : 0,
//     ]);
//     mergedData.push(["Error Logs", hasErrorLogs ? errorLogs.length : 0]);
//     mergedData.push(["Timer Updates", hasTimerLogs ? timerLogs.length : 0]);

//     const ws = XLSX.utils.aoa_to_sheet(mergedData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "All Logs");

//     try {
//       XLSX.writeFile(
//         wb,
//         `Site_${site_id || "Unknown"}_Logs_${startDate || "Start"}_To_${
//           startDate || "End"
//         }.xlsx`
//       );
//       toast.success("Excel file downloaded successfully!");
//     } catch (error) {
//       toast.error("Failed to export Excel file");
//       console.error("Export error:", error);
//     }
//   };

//   // const exportToExcel = () => {
//   //   const hasCleaningLogs =
//   //     Array.isArray(cleaninglogs) && cleaninglogs.length > 0;
//   //   const hasErrorLogs = Array.isArray(errorLogs) && errorLogs.length > 0;
//   //   const hasTimerLogs = Array.isArray(timerLogs) && timerLogs.length > 0;
//   //   const hasDPR = Array.isArray(dprLogs) && dprLogs.length > 0;

//   //   if (!hasCleaningLogs && !hasErrorLogs && !hasTimerLogs && !hasDPR) {
//   //     toast.error("No data available to export.");
//   //     return;
//   //   }

//   //   const mergedData = [];

//   //   // 1. Timer Logs
//   //   mergedData.push(["Timer Logs"]);
//   //   if (hasTimerLogs) {
//   //     mergedData.push([
//   //       "Site ID",
//   //       "Block",
//   //       "Timer Update",
//   //       "Last Updated",
//   //       "Created At",
//   //     ]);
//   //     timerLogs.forEach((siteData) => {
//   //       if (!siteData || !Array.isArray(siteData.last_activity)) return;
//   //       siteData.last_activity.forEach((blockData) => {
//   //         if (!blockData) return;
//   //         if (blockData.detail) {
//   //           mergedData.push([
//   //             siteData.site_id || "N/A",
//   //             blockData.block || "N/A",
//   //             blockData.detail || "N/A",
//   //             siteData.updatedAt
//   //               ? new Date(siteData.updatedAt).toLocaleString()
//   //               : "N/A",
//   //             siteData.createdAt
//   //               ? new Date(siteData.createdAt).toLocaleString()
//   //               : "N/A",
//   //           ]);
//   //         } else if (Array.isArray(blockData.details)) {
//   //           blockData.details.forEach((detail) => {
//   //             mergedData.push([
//   //               siteData.site_id || "N/A",
//   //               blockData.block || "N/A",
//   //               detail || "N/A",
//   //               siteData.updatedAt
//   //                 ? new Date(siteData.updatedAt).toLocaleString()
//   //                 : "N/A",
//   //               siteData.createdAt
//   //                 ? new Date(siteData.createdAt).toLocaleString()
//   //                 : "N/A",
//   //             ]);
//   //           });
//   //         }
//   //       });
//   //     });
//   //   } else {
//   //     mergedData.push(["No timer logs data available"]);
//   //   }
//   //   mergedData.push([]);

//   //   // 2. Cleaning Logs
//   //   mergedData.push(["Cleaning Logs"]);
//   //   if (hasCleaningLogs) {
//   //     mergedData.push([
//   //       "Sr No",
//   //       "Robot No",
//   //       "Row Number",
//   //       "Row Length (Meters)",
//   //       "Cleaning Date",
//   //       "Start Time",
//   //       "Start Battery (%)",
//   //       "Finish Time",
//   //       "Finish Battery (%)",
//   //       "Distance Covered (Meters)",
//   //       "Status",
//   //       "Duration (Minutes)",
//   //     ]);
//   //     cleaninglogs.forEach((log, index) => {
//   //       const startDateObj = log.start_timestamp
//   //         ? new Date(log.start_timestamp)
//   //         : null;
//   //       const endDateObj = log.finish_timestamp
//   //         ? new Date(log.finish_timestamp)
//   //         : null;
//   //       mergedData.push([
//   //         index + 1,
//   //         log.robot_no || "N/A",
//   //         log.row_number || "N/A",
//   //         log.row_length || "N/A",
//   //         startDateObj ? startDateObj.toISOString().split("T")[0] : "N/A",
//   //         startDateObj ? startDateObj.toLocaleTimeString() : "N/A",
//   //         log.start_battery_percentage || "N/A",
//   //         endDateObj ? endDateObj.toLocaleTimeString() : "In Progress",
//   //         log.finish_battery_percentage || "N/A",
//   //         log.calculated_distance || "N/A",
//   //         log.cleaning_status || "N/A",
//   //         startDateObj && endDateObj
//   //           ? Math.round((endDateObj - startDateObj) / (1000 * 60))
//   //           : "N/A",
//   //       ]);
//   //     });
//   //   } else {
//   //     mergedData.push(["No cleaning logs data available"]);
//   //   }
//   //   mergedData.push([]);

//   //   // 3. Error Logs
//   //   mergedData.push(["Error Logs"]);
//   //   if (hasErrorLogs) {
//   //     mergedData.push(["Sr No", "Robot No", "Block", "Error Type", "Date"]);
//   //     errorLogs.forEach((log, index) => {
//   //       const errorDate = log.date ? new Date(log.date) : null;
//   //       mergedData.push([
//   //         index + 1,
//   //         log.robot_no || "N/A",
//   //         log.block || "N/A",
//   //         log.error_type || "N/A",
//   //         errorDate ? errorDate.toLocaleDateString() : "N/A",
//   //       ]);
//   //     });
//   //   } else {
//   //     mergedData.push(["No error logs data available"]);
//   //   }
//   //   mergedData.push([]);
//   //   // 4. Technician DPR Logs
//   //   mergedData.push(["Technician DPR Logs"]);
//   //   mergedData.push([
//   //     "Sr.",
//   //     "Date",
//   //     "Site",
//   //     "Operational Robots",
//   //     "Failed Robots",
//   //     "Total Robots",
//   //     "FromLog (Success)",
//   //     "Remarks",
//   //     "Technician",
//   //   ]);

//   //   if (hasDPR) {
//   //     dprLogs.forEach((log, index) => {
//   //       const technician = log.technician_present?.[0]?.name || "N/A";
//   //       const reportDate = log.report_date
//   //         ? new Date(log.report_date).toLocaleDateString()
//   //         : "N/A";

//   //       mergedData.push([
//   //         index + 1,
//   //         reportDate,
//   //         log.site_id || "N/A",
//   //         log.total_running_robots ?? "N/A",
//   //         log.total_failed_robots ?? "N/A",
//   //         log.total_robots ?? "N/A",
//   //         "Yes", // Assuming success if data exists
//   //         log.comments || "N/A",
//   //         technician,
//   //       ]);
//   //     });
//   //   } else {
//   //     mergedData.push(["No DPR logs found for this range"]);
//   //   }
//   //   mergedData.push([]);

//   //   // 5. Summary
//   //   mergedData.push(["Summary"]);
//   //   mergedData.push(["Site ID", site_id || "N/A"]);
//   //   mergedData.push([
//   //     "Report Period",
//   //     `${startDate || "N/A"} to ${startDate || "N/A"}`,
//   //   ]);
//   //   mergedData.push(["Generated At", new Date().toLocaleString()]);
//   //   mergedData.push([]);
//   //   mergedData.push(["Data Summary"]);
//   //   mergedData.push([
//   //     "Cleaning Logs",
//   //     hasCleaningLogs ? cleaninglogs.length : 0,
//   //   ]);
//   //   mergedData.push(["Error Logs", hasErrorLogs ? errorLogs.length : 0]);
//   //   mergedData.push(["Timer Updates", hasTimerLogs ? timerLogs.length : 0]);
//   //   mergedData.push(["Technician DPR Logs", hasDPR ? dprLogs.length : 0]);

//   //   const ws = XLSX.utils.aoa_to_sheet(mergedData);
//   //   const wb = XLSX.utils.book_new();
//   //   XLSX.utils.book_append_sheet(wb, ws, "All Logs");

//   //   try {
//   //     XLSX.writeFile(
//   //       wb,
//   //       `Site_${site_id || "Unknown"}_Logs_${startDate || "Start"}_To_${
//   //         startDate || "End"
//   //       }.xlsx`
//   //     );
//   //     toast.success("Excel file downloaded successfully!");
//   //   } catch (error) {
//   //     toast.error("Failed to export Excel file");
//   //     console.error("Export error:", error);
//   //   }
//   // };

//   // const handlePageInputChange = (e) => {
//   //   setPageInput(e.target.value);
//   // };

//   // const handlePageChange = (newPage) => {
//   //   if (newPage >= 1 && newPage <= totalPages) {
//   //     setPage(newPage);
//   //   }
//   // };

//   // const handlePageInputSubmit = () => {
//   //   const pageNumber = parseInt(pageInput);
//   //   if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
//   //     handlePageChange(pageNumber);
//   //   }
//   // };
//   // ✅ Place this at the top of your component function, before the `return`:
//   const cleaningSuccessMap = {};

//   dprLogs?.forEach((log) => {
//     const siteId = log.site_id;
//     const successCount =
//       log.cleaning_logs?.filter((entry) => entry.success === true).length || 0;
//     cleaningSuccessMap[siteId] = successCount;
//   });

//   return (
//     <div className="p-4">
//       <form>
//         <CRow className="my-3">
//           <CCol md={7} xs={12} className="d-flex flex-wrap gap-2">
//             <CCol md={3} xs={12} className="m-1">
//               <CFormInput
//                 type="date"
//                 value={startDate}
//                 onChange={(e) => setStartDate(e.target.value)}
//               />
//             </CCol>
//             {/* <CCol md={3} xs={12} className="m-1">
//               <CFormInput
//                 type="date"
//                 value={startDate}
//                 onChange={(e) => setEndDate(e.target.value)}
//               />
//             </CCol> */}
//           </CCol>
//           <CCol
//             md={5}
//             xs={12}
//             className="d-flex justify-content-md-end justify-content-center align-items-center mt-2 mt-md-0"
//           >
//             <CButton color="primary" size="sm" onClick={exportToExcel}>
//               Export to Excel
//             </CButton>
//           </CCol>
//         </CRow>
//       </form>
//       {loading ? (
//         <div className="text-center my-4">
//           <LoadingSpinner />
//         </div>
//       ) : (
//         <>
//           {/* Timer Update Notifications Table - Comes First */}
//           <h5 className="mt-3 mb-3">
//             ⏱ Timer Update Notifications -{" "}
//             <span className="text-danger">{site_id}</span>
//           </h5>
//           <CTable
//             bordered
//             hover
//             responsive
//             className="text-center bg-important"
//           >
//             <CTableHead color="info">
//               <CTableRow>
//                 <CTableHeaderCell>#</CTableHeaderCell>
//                 <CTableHeaderCell>Block</CTableHeaderCell>
//                 <CTableHeaderCell>Timer Updates</CTableHeaderCell>
//                 <CTableHeaderCell>Last Updated</CTableHeaderCell>
//               </CTableRow>
//             </CTableHead>
//             <CTableBody>
//               {Array.isArray(timerLogs) && timerLogs.length > 0 ? (
//                 timerLogs.flatMap(
//                   (siteData, siteIndex) =>
//                     Array.isArray(siteData.last_activity)
//                       ? siteData.last_activity.map((blockData, blockIndex) => (
//                           <CTableRow key={`${siteIndex}-${blockIndex}`}>
//                             <CTableDataCell>
//                               {siteIndex * siteData.last_activity.length +
//                                 blockIndex +
//                                 1}
//                             </CTableDataCell>
//                             <CTableDataCell>{blockData.block}</CTableDataCell>
//                             <CTableDataCell>
//                               <ul
//                                 className="text-start"
//                                 style={{
//                                   listStyleType: "none",
//                                   paddingLeft: 0,
//                                 }}
//                               >
//                                 {blockData.details?.map(
//                                   (detail, detailIndex) => (
//                                     <li key={detailIndex}>{detail}</li>
//                                   )
//                                 )}
//                               </ul>
//                             </CTableDataCell>
//                             <CTableDataCell>
//                               {new Date(siteData.updatedAt).toLocaleString()}
//                             </CTableDataCell>
//                           </CTableRow>
//                         ))
//                       : [] // fallback if last_activity is not an array
//                 )
//               ) : (
//                 <CTableRow>
//                   <CTableDataCell colSpan={4} className="text-info text-center">
//                     No timer update notifications found for the selected date.
//                   </CTableDataCell>
//                 </CTableRow>
//               )}
//             </CTableBody>
//           </CTable>

//           {/* Cleaning Logs Table */}
//           <h5 className="mt-2 mb-3">🤖 Cleaning Logs</h5>
//           <CTable
//             bordered
//             hover
//             responsive
//             className="text-center bg-important mb-2"
//           >
//             <CTableHead color="secondary">
//               <CTableRow>
//                 <CTableHeaderCell>Sr</CTableHeaderCell>
//                 <CTableHeaderCell style={{ minWidth: "150px" }}>
//                   Robot No
//                 </CTableHeaderCell>
//                 <CTableHeaderCell style={{ minWidth: "130px" }}>
//                   Row Number
//                 </CTableHeaderCell>
//                 <CTableHeaderCell style={{ minWidth: "190px" }}>
//                   Row Length (Meters)
//                 </CTableHeaderCell>

//                 <CTableHeaderCell style={{ minWidth: "190px" }}>
//                   Started At
//                 </CTableHeaderCell>
//                 <CTableHeaderCell style={{ minWidth: "190px" }}>
//                   Finished At
//                 </CTableHeaderCell>
//                 <CTableHeaderCell style={{ minWidth: "150px" }}>
//                   Battery Start (%)
//                 </CTableHeaderCell>

//                 <CTableHeaderCell style={{ minWidth: "190px" }}>
//                   Battery Finished (%)
//                 </CTableHeaderCell>
//                 {/* <CTableHeaderCell style={{ minWidth: "190px" }}>
//                              Distance Covered (Meters)
//                            </CTableHeaderCell> */}
//                 <CTableHeaderCell>Status</CTableHeaderCell>
//               </CTableRow>
//             </CTableHead>
//             <CTableBody>
//               {cleaningLoading ? (
//                 <CTableRow>
//                   <CTableDataCell colSpan="11" className=" text-start  ">
//                     <LoadingSpinner />
//                   </CTableDataCell>
//                 </CTableRow>
//               ) : cleaningError ? (
//                 <CTableRow>
//                   <CTableDataCell colSpan="11" className=" text-start  ">
//                     {cleaningError}
//                   </CTableDataCell>
//                 </CTableRow>
//               ) : cleaninglogs.length > 0 ? (
//                 cleaninglogs.map((log, index) => (
//                   <CTableRow key={index}>
//                     <CTableDataCell>{index + 1}</CTableDataCell>
//                     <CTableDataCell>{log.robot_no}</CTableDataCell>
//                     <CTableDataCell>{log.row_no}</CTableDataCell>
//                     <CTableDataCell>{log.row_length}</CTableDataCell>
//                     <CTableDataCell>
//                       {log.cleaning.start &&
//                         new Date(log.cleaning.startAt).toLocaleString("en-GB", {
//                           day: "2-digit",
//                           month: "2-digit",
//                           year: "numeric",
//                           hour: "2-digit",
//                           minute: "2-digit",
//                           second: "2-digit",
//                           hour12: true,
//                         })}
//                     </CTableDataCell>
//                     <CTableDataCell>
//                       {log.cleaning.finish ? (
//                         new Date(log.cleaning.finishAt).toLocaleString(
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
//                         )
//                       ) : log.cleaning.battery_dead ? (
//                         <CBadge color="danger">Battery Dead</CBadge>
//                       ) : log.cleaning.cleaning_cancelled ? (
//                         <CBadge color="danger">Cleaning Cancelled</CBadge>
//                       ) : (
//                         <CBadge color="info">In Progress</CBadge>
//                       )}
//                     </CTableDataCell>
//                     <CTableDataCell>
//                       {log.cleaning.battery_before_cleaning
//                         ? log.cleaning.battery_before_cleaning
//                         : "N/A"}
//                     </CTableDataCell>
//                     <CTableDataCell>
//                       {log.cleaning.battery_after_cleaning
//                         ? log.cleaning.battery_after_cleaning
//                         : "N/A"}
//                     </CTableDataCell>
//                     <CTableDataCell>
//                       {log.cleaning.finish ? (
//                         <CBadge color="success">Completed</CBadge>
//                       ) : log.cleaning.battery_dead ? (
//                         <CBadge color="danger">Battery Dead</CBadge>
//                       ) : log.cleaning.cleaning_cancelled ? (
//                         <CBadge color="danger">Cleaning Cancelled</CBadge>
//                       ) : (
//                         <CBadge color="info">In Progress</CBadge>
//                       )}
//                     </CTableDataCell>
//                   </CTableRow>
//                 ))
//               ) : (
//                 <CTableRow>
//                   <CTableDataCell colSpan="11" className=" text-start  ">
//                     No logs found for the selected date.
//                   </CTableDataCell>
//                 </CTableRow>
//               )}
//             </CTableBody>
//           </CTable>

//           {/* <PaginateInput
//             page={page}
//             totalPages={totalPages}
//             hasPrevPage={hasPrevPage}
//             hasNextPage={hasNextPage}
//             pageInput={pageInput}
//             handlePageChange={handlePageChange}
//             handlePageInputChange={handlePageInputChange}
//             handlePageInputSubmit={handlePageInputSubmit}
//             limit={limit}
//             handleLimitChange={setLimit}
//           /> */}

// {/* Error Logs Table */}
// <h5 className="mt-5 mb-3">
//   🚨 Error Logs for - <span className="text-danger">{site_id}</span>
// </h5>
// <CTable
//   bordered
//   hover
//   responsive
//   className="text-center bg-important"
// >
//   <CTableHead color="dark">
//     <CTableRow>
//       <CTableHeaderCell>#</CTableHeaderCell>
//       <CTableHeaderCell>Robot No</CTableHeaderCell>
//       <CTableHeaderCell>Block</CTableHeaderCell>
//       <CTableHeaderCell>Error Type</CTableHeaderCell>
//       <CTableHeaderCell>Date</CTableHeaderCell>
//     </CTableRow>
//   </CTableHead>
//   <CTableBody>
//     {errorLogs?.length > 0 ? (
//       errorLogs.map((log, index) => (
//         <CTableRow key={index}>
//           <CTableDataCell>{index + 1}</CTableDataCell>
//           <CTableDataCell>{log.robot_no}</CTableDataCell>
//           <CTableDataCell>{log.block}</CTableDataCell>
//           <CTableDataCell>{log.error_type}</CTableDataCell>
//           <CTableDataCell>
//             {new Date(log.date).toLocaleDateString()}{" "}
//           </CTableDataCell>
//         </CTableRow>
//       ))
//     ) : (
//       <CTableRow>
//         <CTableDataCell
//           colSpan={5}
//           className="text-danger text-center"
//         >
//           No error logs found for the selected date.
//         </CTableDataCell>
//       </CTableRow>
//     )}
//   </CTableBody>
// </CTable>

// {/* DPR Summary Table */}
// {/* DPR Summary Table */}
// <>
//   <h5 className="mt-5 mb-3">
//     📋 Daily Progress Report -{" "}
//     <span className="text-danger">{site_id}</span>
//   </h5>

//   <CTable
//     bordered
//     hover
//     responsive
//     className="text-center bg-important"
//   >
//     <CTableHead color="success">
//       <CTableRow>
//         <CTableHeaderCell>Sr</CTableHeaderCell>
//         <CTableHeaderCell>Date</CTableHeaderCell>
//         <CTableHeaderCell>Site</CTableHeaderCell>
//         <CTableHeaderCell>Operational Robots</CTableHeaderCell>
//         <CTableHeaderCell>Failed Robots</CTableHeaderCell>
//         <CTableHeaderCell>Total Robots</CTableHeaderCell>
//         <CTableHeaderCell>FromLog (Success)</CTableHeaderCell>
//         <CTableHeaderCell>Remarks</CTableHeaderCell>
//         <CTableHeaderCell>Technician</CTableHeaderCell>
//       </CTableRow>
//     </CTableHead>

//     <CTableBody>
//       {dprLogs?.length > 0 ? (
//         dprLogs.map((log, index) => {
//           const technician = log.technician_present?.[0]?.name || "-";
//           const reportDate = log.report_date
//             ? new Date(log.report_date).toLocaleDateString()
//             : "-";

//           return (
//             <CTableRow key={index}>
//               <CTableDataCell>{index + 1}</CTableDataCell>
//               <CTableDataCell>{reportDate}</CTableDataCell>
//               <CTableDataCell>{log.site_id}</CTableDataCell>
//               <CTableDataCell>
//                 {log.total_running_robots}
//               </CTableDataCell>
//               <CTableDataCell>
//                 {log.total_failed_robots}
//               </CTableDataCell>
//               <CTableDataCell>{log.total_robots}</CTableDataCell>
//               <CTableDataCell>
//                 <span
//                   className={`badge ${
//                     cleaningSuccessMap?.[log.site_id]
//                       ? "bg-success"
//                       : "bg-danger"
//                   }`}
//                 >
//                   {cleaningSuccessMap?.[log.site_id] || 0}
//                 </span>
//               </CTableDataCell>
//               <CTableDataCell>{log.comments || "-"}</CTableDataCell>
//               <CTableDataCell>{technician}</CTableDataCell>
//             </CTableRow>
//           );
//         })
//       ) : (
//         <CTableRow>
//           <CTableDataCell
//             colSpan={9}
//             className="text-center text-danger"
//           >
//             No DPR logs found for the selected date.
//           </CTableDataCell>
//         </CTableRow>
//       )}
//     </CTableBody>
//   </CTable>
//           </>
//         </>
//       )}
//     </div>
//   );
// };

// export default SitewaiseLog;

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
import LoadingSpinner from "../../../components/LoadingSpinner";
import SubscriptionExpiryCard from "../../../components/SubscriptionExpiryCard";
import CompletedCycles from "./CompletedCycles";
import ErrorCycles from "./ErrorCycles";
import OfflineRobotsCycle from "./OfflineRobotsCycle";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_CLEANING_REQUEST":
      return { ...state, cleaningLoading: true, cleaningError: "" };
    case "FETCH_CLEANING_SUCCESS":
      return {
        ...state,
        cleaningLoading: false,
        cleaninglogs: action.payload.cleaninglogs,
        totalAssignedRobots: action.payload.totalAssignedRobots,
        cleaningCompleted: action.payload.cleaningCompleted,
        cleaningInProgress: action.payload.cleaningInProgress,
        failureLogs: action.payload.failureLogs,
        totalPages: action.payload.totalPages,
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
        dynamicCycles: action.payload.dynamicCycles,
        robotswhichareonlineandnotstartedForthisSite:
          action.payload.robotswhichareonlineandnotstartedForthisSite,
      };
    case "FETCH_FAIL":
      return {
        ...state,
        cleaningLoading: false,
        cleaningError: action.payload,
        subscriptiondata: action.subscriptiondata,
        subscriptionStatus: action.subscriptionStatus,
      };

    case "FETCH_ERROR_LOGS_REQUEST":
      return { ...state, errLogloading: true, errorLogError: "" };
    case "FETCH_ERROR_LOGS_SUCCESS":
      return { ...state, errorLogs: action.payload, errLogloading: false };
    case "FETCH_ERROR_LOGS_FAIL":
      return {
        ...state,
        errLogloading: false,
        errorLogError: action.payload,
        subscriptiondata: action.subscriptiondata,
        subscriptionStatus: action.subscriptionStatus,
      };

    case "FETCH_TIMER_LOGS_REQUEST":
      return { ...state, timerLogLoading: true, timerLogError: "" };
    case "FETCH_TIMER_LOGS_SUCCESS":
      return { ...state, timerLogs: action.payload, timerLogLoading: false };
    case "FETCH_TIMER_LOGS_FAIL":
      return {
        ...state,
        timerLogError: action.payload,
        timerLogLoading: false,
        subscriptiondata: action.subscriptiondata,
        subscriptionStatus: action.subscriptionStatus,
      };

    case "FETCH_OFFLINE_REQUEST":
      return { ...state, offlineRobotLoading: true, offlineRobotError: "" };
    case "FETCH_OFFLINE_SUCCESS":
      return {
        ...state,
        offlineRobots: action.payload,
        offlineRobotLoading: false,
      };
    case "FETCH_OFFLINE_FAIL":
      return {
        ...state,
        offlineRobotError: action.payload,
        offlineRobotLoading: false,
      };

    case "FETCH_DPR_REQUEST":
      return { ...state, dprLoading: true, dprError: "" };
    case "FETCH_DPR_SUCCESS":
      return { ...state, dprLogs: action.payload, dprLoading: false };
    case "FETCH_DPR_FAIL":
      return {
        ...state,
        dprError: action.payload,
        dprLoading: false,
      };

    default:
      return state;
  }
};

const SitewaiseLog = () => {
  const [
    {
      cleaningLoading,
      cleaningError,

      cleaningCompleted,
      cleaningInProgress,
      totalAssignedRobots,
      failureLogs,
      errLogloading,
      errorLogError,
      errorLogs,
      timerLogLoading,
      timerLogs,
      timerLogError,
      // totalPages,
      // hasNextPage,
      // hasPrevPage,
      subscriptiondata,
      subscriptionStatus,
      offlineRobotLoading,
      offlineRobotError,
      offlineRobots,
      dprError,
      dprLogs,
      dprLoading,
      dynamicCycles,
      robotswhichareonlineandnotstartedForthisSite,
    },
    dispatch,
  ] = useReducer(reducer, {
    cleaninglogs: [],
    totalAssignedRobots: 0,
    cleaningCompleted: [],
    cleaningInProgress: [],
    failureLogs: [],
    cleaningLoading: false,
    cleaningError: "",

    errLogloading: false,
    errorLogError: "",
    errorLogs: [],
    subscriptionStatus: "",
    subscriptiondata: {},
    timerLogs: [],
    timerLogLoading: false,
    timerLogError: "",
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
    offlineRobotLoading: false,
    offlineRobotError: "",
    offlineRobots: [],
    dynamicCycles: {},
    robotswhichareonlineandnotstartedForthisSite: [],
    dprError: "",
    dprLogs: [],
    dprLoading: false,
  });

  const authtoken = useSelector((state) => state.authtoken);
  const { site_id } = useParams();

  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    const fetchCleaningLogs = async () => {
      try {
        dispatch({ type: "FETCH_CLEANING_REQUEST" });
        const result = await axios.post(
          `/api/v1/robot-tracking/sitewise/fetch-cleaninglog/-by-sites-and-date`,
          {
            site_id,
            date: startDate,
          },
          {
            headers: {
              Authorization: `Bearer ${authtoken}`,
            },
          }
        );

        const data = result.data.data;

        dispatch({
          type: "FETCH_CLEANING_SUCCESS",
          payload: {
            totalAssignedRobots: data.totalAssignedRobots || 0,
            cleaninglogs: data.cleaninglogs || [],
            cleaningCompleted: data.cleaningCompleted || [],
            cleaningInProgress: data.cleaningInProgress || [],
            failureLogs: data.failureLogs || [],
            robotswhichareonlineandnotstartedForthisSite:
              data.robotswhichareonlineandnotstartedForthisSite || [],
            dynamicCycles: data.dynamicCycles || {},
            totalPages: data.totalPages || 1,
            hasNextPage: data.hasNextPage || false,
            hasPrevPage: data.hasPrevPage || false,
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
          error.response?.data?.error || error.response?.data?.message
        );
      }
    };

    const fetchDprLogs = async () => {
      try {
        const { data } = await axios.get(
          `/api/v1/techniciandprs/techniciandpr/${site_id}/${startDate}/${startDate}`,
          {
            headers: {
              Authorization: `Bearer ${authtoken}`,
            },
          }
        );

        dispatch({
          type: "FETCH_DPR_SUCCESS",
          payload: data.data,
        });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: err.response?.data?.error || err.response?.data?.message,
        });
        toast.error(err.response?.data?.error || err.response?.data?.message);
      }
    };

    const fetchOfflineLogs = async () => {
      try {
        dispatch({
          type: "FETCH_OFFLINE_REQUEST",
        });
        const response = await axios.get(
          `/api/v1/errorlogs/site-error-logs/${site_id}/${startDate}/${startDate}`,
          {
            headers: {
              Authorization: `Bearer ${authtoken}`,
            },
          }
        );
        dispatch({
          type: "FETCH_OFFLINE_SUCCESS",
          payload: response.data.data,
        });
      } catch (error) {
        dispatch({
          type: "FETCH_OFFLINE_FAIL",
          payload: error.response.data.data || error.response.data.error,
        });
        toast.error(error.response.data.data || error.response.data.error);
      }
    };
    fetchOfflineLogs();
    fetchDprLogs();
    fetchCleaningLogs();
  }, [site_id, startDate, authtoken]);

  const exportToExcel = () => {
    if (
      !cleaningCompleted?.length &&
      !cleaningInProgress?.length &&
      !failureLogs?.length &&
      !offlineRobots?.length &&
      !dprLogs?.length
    ) {
      toast.error("No data available to export.");
      return;
    }

    const mergedData = [];

    // ===================================================
    // 1. Cleaning Logs (Completed)
    // ===================================================
    mergedData.push(["Cleaning Logs"]);

    if (cleaningCompleted?.length) {
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

      cleaningCompleted.forEach((log, index) => {
        mergedData.push([
          index + 1,
          log.robot_no || "N/A",
          log.row_no || "N/A",
          log.row_length || "N/A",
          log.cleaning?.startAt
            ? new Date(log.cleaning.startAt).toLocaleString()
            : "N/A",
          log.cleaning?.battery_before_cleaning ?? "N/A",
          log.cleaning?.battery_after_cleaning ?? "N/A",
          log.cleaning?.finishAt
            ? new Date(log.cleaning.finishAt).toLocaleString()
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

    if (cleaningInProgress?.length) {
      mergedData.push(["Sr No", "Robot No", "Started At", "Block", "Status"]);

      cleaningInProgress.forEach((log, index) => {
        mergedData.push([
          index + 1,
          log.robot_no || "N/A",
          log.cleaning?.startAt
            ? new Date(log.cleaning.startAt).toLocaleString()
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
    mergedData.push(["Error Logs"]);

    if (failureLogs?.length) {
      mergedData.push(["Sr No", "Robot No", "Block", "Error Type", "Comments"]);

      failureLogs.forEach((log, index) => {
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

    if (offlineRobots?.length) {
      mergedData.push(["Sr No", "Robot No", "Block", "Error Type"]);

      offlineRobots.forEach((log, index) => {
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
    // 6. Technician DPR Logs (NEW)
    // ===================================================
    mergedData.push(["Technician DPR Logs"]);

    if (dprLogs?.length) {
      mergedData.push([
        "Sr No",
        "Date",
        "Site",
        "Operational Robots",
        "Failed Robots",
        "Total Robots",
        "Remarks",
        "Technician",
      ]);

      dprLogs.forEach((log, index) => {
        const technician = log.technician_present?.[0]?.name || "-";
        const reportDate = log.report_date
          ? new Date(log.report_date).toLocaleDateString()
          : "-";

        mergedData.push([
          index + 1,
          reportDate,
          log.site_id,
          log.total_running_robots,
          log.total_failed_robots,
          log.total_robots,
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
      cleaningCompleted?.length || 0,
    ]);
    mergedData.push(["Cleaning In Progress", cleaningInProgress?.length || 0]);
    mergedData.push(["Error Logs", failureLogs?.length || 0]);
    mergedData.push(["Offline Robots", offlineRobots?.length || 0]);
    mergedData.push(["Technician DPR Logs", dprLogs?.length || 0]);

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
        `Site_${site_id || "Unknown"}_Logs_${startDate}_To_${startDate}.xlsx`
      );
      toast.success("Excel file downloaded successfully!");
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
  return (
    <>
      {cleaningLoading || errLogloading || timerLogLoading ? (
        <LoadingSpinner />
      ) : checkStatus.includes(subscriptionStatus) ? (
        <SubscriptionExpiryCard
          data={subscriptiondata}
          subscriptionStatus={subscriptionStatus}
          error={errorLogError || cleaningError || timerLogError}
        />
      ) : errorLogError || cleaningError || timerLogError ? (
        <CAlert className="p-2 w-50" color="danger">
          {errorLogError || cleaningError || timerLogError}
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
                        Total Assigned Robots: {totalAssignedRobots}
                      </CBadge>
                      <CBadge
                        color="secondary"
                        className="px-3 py-2 rounded-pill m-1"
                        style={{ fontSize: "14px" }}
                      >
                        Total Logs:
                        {cleaningCompleted.length +
                          cleaningInProgress.length +
                          failureLogs.length}
                      </CBadge>
                      <CBadge
                        color="success"
                        className="px-3 py-2 rounded-pill m-1"
                        style={{ fontSize: "14px" }}
                      >
                        Completed: {cleaningCompleted.length}
                      </CBadge>
                      <CBadge
                        color="warning"
                        className="px-3 py-2 rounded-pill m-1"
                        style={{ fontSize: "14px" }}
                      >
                        In Progress: {cleaningInProgress.length}
                      </CBadge>
                      <CBadge
                        color="danger"
                        className="px-3 py-2 rounded-pill m-1"
                        style={{ fontSize: "14px" }}
                      >
                        Failure: {failureLogs.length}
                      </CBadge>
                      <CBadge
                        color="danger"
                        className="px-3 py-2 rounded-pill m-1"
                        style={{ fontSize: "14px" }}
                      >
                        Online – Command given, Not Started :
                        <spa className="ms-2">
                          {robotswhichareonlineandnotstartedForthisSite.length}
                        </spa>
                      </CBadge>
                    </div>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          </div>

          {/* Tabs Section */}
          {timerLogLoading ? (
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
                    Error Logs
                  </CTab>
                  <CTab itemKey="offline-robots" className="text-white">
                    Offline Robots At the time of execution
                  </CTab>

                  <CTab
                    itemKey="online–command-given-not-started"
                    className="text-white"
                  >
                    Online but Not Started
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
                        {cleaningCompleted.length > 0 ? (
                          cleaningCompleted.map((log, index) => (
                            <CTableRow key={index}>
                              <CTableDataCell>{index + 1}</CTableDataCell>
                              <CTableDataCell>{log.robot_no}</CTableDataCell>

                              {/* STATUS */}
                              <CTableDataCell>
                                {log.cleaning.finish ? (
                                  <CBadge color="success">Completed</CBadge>
                                ) : log.cleaning.battery_dead ? (
                                  <CBadge color="danger">Battery Dead</CBadge>
                                ) : log.cleaning.cleaning_cancelled ? (
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
                                {log.cleaning.start &&
                                  new Date(log.cleaning.startAt).toLocaleString(
                                    "en-GB",
                                    {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      second: "2-digit",
                                      hour12: true,
                                    }
                                  )}
                              </CTableDataCell>

                              <CTableDataCell>
                                {log.cleaning.finish ? (
                                  new Date(
                                    log.cleaning.finishAt
                                  ).toLocaleString("en-GB", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                    hour12: true,
                                  })
                                ) : log.cleaning.battery_dead ? (
                                  <CBadge color="danger">Battery Dead</CBadge>
                                ) : log.cleaning.cleaning_cancelled ? (
                                  <CBadge color="danger">
                                    Cleaning Cancelled
                                  </CBadge>
                                ) : (
                                  <CBadge color="info">In Progress</CBadge>
                                )}
                              </CTableDataCell>

                              <CTableDataCell>
                                {log.cleaning.battery_before_cleaning || "N/A"}
                              </CTableDataCell>

                              <CTableDataCell>
                                {log.cleaning.battery_after_cleaning || "N/A"}
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

                    {/* {Object.keys(dynamicCycles).map((cycleKey, cycleIndex) => (
                      <div key={cycleKey} className="mb-4">
                   
                        <h4 className="fw-bold my-2">
                          {cycleKey.replace(
                            "completedCycle",
                            "Completed Cycle "
                          )}
                        </h4>

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
                            {dynamicCycles[cycleKey].length > 0 ? (
                              dynamicCycles[cycleKey].map((log, index) => (
                                <CTableRow key={index}>
                                  <CTableDataCell>{index + 1}</CTableDataCell>
                                  <CTableDataCell>
                                    {log.robot_no}
                                  </CTableDataCell>

                                 
                                  <CTableDataCell>
                                    {log.cleaning.finish ? (
                                      <CBadge color="success">Completed</CBadge>
                                    ) : log.cleaning.battery_dead ? (
                                      <CBadge color="danger">
                                        Battery Dead
                                      </CBadge>
                                    ) : log.cleaning.cleaning_cancelled ? (
                                      <CBadge color="danger">
                                        Cleaning Cancelled
                                      </CBadge>
                                    ) : (
                                      <CBadge color="info">In Progress</CBadge>
                                    )}
                                  </CTableDataCell>

                                  <CTableDataCell>{log.row_no}</CTableDataCell>
                                  <CTableDataCell>
                                    {log.row_length}
                                  </CTableDataCell>

                                 
                                  <CTableDataCell>
                                    {log.cleaning.startAt &&
                                      new Date(
                                        log.cleaning.startAt
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
                                    {log.cleaning.finish ? (
                                      new Date(
                                        log.cleaning.finishAt
                                      ).toLocaleString("en-GB", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit",
                                        hour12: true,
                                      })
                                    ) : log.cleaning.battery_dead ? (
                                      <CBadge color="danger">
                                        Battery Dead
                                      </CBadge>
                                    ) : log.cleaning.cleaning_cancelled ? (
                                      <CBadge color="danger">
                                        Cleaning Cancelled
                                      </CBadge>
                                    ) : (
                                      <CBadge color="info">In Progress</CBadge>
                                    )}
                                  </CTableDataCell>

                                  <CTableDataCell>
                                    {log.cleaning.battery_before_cleaning ||
                                      "N/A"}
                                  </CTableDataCell>

                                  <CTableDataCell>
                                    {log.cleaning.battery_after_cleaning ||
                                      "N/A"}
                                  </CTableDataCell>
                                </CTableRow>
                              ))
                            ) : (
                              <CTableRow>
                                <CTableDataCell
                                  colSpan="11"
                                  className="text-start"
                                >
                                  No logs found for this cycle.
                                </CTableDataCell>
                              </CTableRow>
                            )}
                          </CTableBody>
                        </CTable>
                      </div>
                    ))} */}

                    <h4 className="my-3  border-top">Testing Cycles</h4>

                    <CompletedCycles completedLogs={cleaningCompleted} />
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
                        {cleaningInProgress?.length > 0 ? (
                          cleaningInProgress.map((log, index) => (
                            <CTableRow key={index}>
                              <CTableDataCell>{index + 1}</CTableDataCell>
                              <CTableDataCell>{log.robot_no}</CTableDataCell>
                              <CTableDataCell>
                                {log.cleaning.start &&
                                  new Date(log.cleaning.startAt).toLocaleString(
                                    "en-GB",
                                    {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      second: "2-digit",
                                      hour12: true,
                                    }
                                  )}
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

                  {/* Error Logs */}
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
                        {failureLogs?.length > 0 ? (
                          failureLogs.map((log, index) => (
                            <CTableRow key={index}>
                              <CTableDataCell>{index + 1}</CTableDataCell>
                              <CTableDataCell>{log.robot_no}</CTableDataCell>
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
                                    }
                                  )}
                              </CTableDataCell>{" "}
                              <CTableDataCell>
                                {log.cleaning.battery_dead
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

                    <h4 className="my-3  border-top">Testing Error Cycles</h4>
                    <ErrorCycles errorlogs={failureLogs} />
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
                          <CTableHeaderCell>startAt</CTableHeaderCell>
                          <CTableHeaderCell>Error Type</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>

                      <CTableBody>
                        {offlineRobotLoading ? (
                          <CTableRow>
                            <CTableDataCell colSpan={5}>
                              <LoadingSpinner />
                            </CTableDataCell>
                          </CTableRow>
                        ) : offlineRobotError ? (
                          <CBadge color="danger">{offlineRobotError}</CBadge>
                        ) : offlineRobots?.length > 0 ? (
                          offlineRobots.map((log, index) => (
                            <CTableRow key={index}>
                              <CTableDataCell>{index + 1}</CTableDataCell>
                              <CTableDataCell>{log.robot_no}</CTableDataCell>
                              <CTableDataCell>{log.block}</CTableDataCell>
                              {/* <CTableDataCell>{log.createdAt}</CTableDataCell> */}

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
                                    }
                                  )}
                              </CTableDataCell>

                              <CTableDataCell>{log.error_type}</CTableDataCell>
                            </CTableRow>
                          ))
                        ) : (
                          <CTableRow>
                            <CTableDataCell colSpan={5} className="text-start">
                              No offline Robots found for the selected date.
                            </CTableDataCell>
                          </CTableRow>
                        )}
                      </CTableBody>
                    </CTable>
                    <h4 className="my-3  border-top">Offline Robots Cycles</h4>
                    <OfflineRobotsCycle
                      offlineLogs={offlineRobots}
                      loading={offlineRobotLoading}
                      error={offlineRobotError}
                    />
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
                        {timerLogLoading ? (
                          <CTableRow>
                            <CTableDataCell colSpan={4}>
                              <LoadingSpinner />
                            </CTableDataCell>
                          </CTableRow>
                        ) : cleaningError ? (
                          <CBadge color="danger">{cleaningError}</CBadge>
                        ) : robotswhichareonlineandnotstartedForthisSite?.length >
                          0 ? (
                          robotswhichareonlineandnotstartedForthisSite.map(
                            (log, index) => (
                              <CTableRow key={index}>
                                <CTableDataCell>{index + 1}</CTableDataCell>
                                <CTableDataCell>{log.robot_no}</CTableDataCell>
                                <CTableDataCell>{log.block}</CTableDataCell>
                                <CTableDataCell>
                                  {log.lora_state ? "Online" : "Offline"}
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
                                      }
                                    )}
                                </CTableDataCell>
                              </CTableRow>
                            )
                          )
                        ) : (
                          <CTableRow>
                            <CTableDataCell colSpan={4} className="text-start">
                              Online Command Given Not Started found for the
                              selected date.
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
                          <CTableHeaderCell>
                            Operational Robots
                          </CTableHeaderCell>
                          <CTableHeaderCell>Failed Robots</CTableHeaderCell>
                          <CTableHeaderCell>Total Robots</CTableHeaderCell>
                          <CTableHeaderCell>FromLog (Success)</CTableHeaderCell>
                          <CTableHeaderCell>Remarks</CTableHeaderCell>
                          <CTableHeaderCell>Technician</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>

                      <CTableBody>
                        {dprLoading ? (
                          <CTableRow>
                            <CTableDataCell colSpan={9}>
                              <LoadingSpinner />
                            </CTableDataCell>
                          </CTableRow>
                        ) : dprError ? (
                          <CTableRow>
                            <CTableDataCell colSpan={9}>
                              {dprError}
                            </CTableDataCell>
                          </CTableRow>
                        ) : dprLogs?.length > 0 ? (
                          dprLogs.map((log, index) => {
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
                                <CTableDataCell>
                                  {log.total_running_robots}
                                </CTableDataCell>
                                <CTableDataCell>
                                  {log.total_failed_robots}
                                </CTableDataCell>
                                <CTableDataCell>
                                  {log.total_robots}
                                </CTableDataCell>
                                <CTableDataCell>
                                  {/* <span
                                  className={`badge ${
                                    cleaningSuccessMap?.[log.site_id]
                                      ? "bg-success"
                                      : "bg-danger"
                                  }`}
                                >
                                  {cleaningSuccessMap?.[log.site_id] || 0}
                                </span> */}
                                </CTableDataCell>
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

export default SitewaiseLog;
