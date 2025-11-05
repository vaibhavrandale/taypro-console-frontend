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
//     case "FETCH_ERROR_LOGS_SUCCESS":
//       return { ...state, errorLogs: action.payload };
//     case "FETCH_TIMER_LOGS_SUCCESS":
//       return { ...state, timerLogs: action.payload };
//     case "FETCH_TIMER_LOGS_FAIL":
//       return { ...state, error: action.payload };
//     case "FETCH_DPR_SUCCESS":
//       return { ...state, dprLogs: action.payload };

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
//     const fetchErrorLogs = async () => {
//       try {
//         const response = await axios.get(
//           `/api/v1/errorlogs/site-error-logs/${site_id}/${startDate}/${startDate}`,
//           {
//             headers: {
//               Authorization: `Bearer ${authtoken}`,
//             },
//           }
//         );
//         dispatch({
//           type: "FETCH_ERROR_LOGS_SUCCESS",
//           payload: response.data.data,
//         });
//       } catch (error) {
//         toast.error("Failed to fetch error logs");
//       }
//     };

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

//     const fetchDprLogs = async () => {
//       try {
//         const { data } = await axios.get(
//           `/api/v1/techniciandprs/techniciandpr/${site_id}/${startDate}/${startDate}`,
//           {
//             headers: {
//               Authorization: `Bearer ${authtoken}`,
//             },
//           }
//         );
//         console.log(data.data);

//         if (data.success) {
//           dispatch({
//             type: "FETCH_DPR_SUCCESS",
//             payload: data.data,
//           });
//         } else {
//           throw new Error(data.message || "Failed to fetch DPR logs");
//         }
//       } catch (err) {
//         dispatch({
//           type: "FETCH_FAIL",
//           payload: err.response?.data?.error || err.message,
//         });
//         toast.error(err.response?.data?.error || err.message);
//       }
//     };

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

//           {/* Error Logs Table */}
//           <h5 className="mt-5 mb-3">
//             🚨 Error Logs for - <span className="text-danger">{site_id}</span>
//           </h5>
//           <CTable
//             bordered
//             hover
//             responsive
//             className="text-center bg-important"
//           >
//             <CTableHead color="dark">
//               <CTableRow>
//                 <CTableHeaderCell>#</CTableHeaderCell>
//                 <CTableHeaderCell>Robot No</CTableHeaderCell>
//                 <CTableHeaderCell>Block</CTableHeaderCell>
//                 <CTableHeaderCell>Error Type</CTableHeaderCell>
//                 <CTableHeaderCell>Date</CTableHeaderCell>
//               </CTableRow>
//             </CTableHead>
//             <CTableBody>
//               {errorLogs?.length > 0 ? (
//                 errorLogs.map((log, index) => (
//                   <CTableRow key={index}>
//                     <CTableDataCell>{index + 1}</CTableDataCell>
//                     <CTableDataCell>{log.robot_no}</CTableDataCell>
//                     <CTableDataCell>{log.block}</CTableDataCell>
//                     <CTableDataCell>{log.error_type}</CTableDataCell>
//                     <CTableDataCell>
//                       {new Date(log.date).toLocaleDateString()}{" "}
//                     </CTableDataCell>
//                   </CTableRow>
//                 ))
//               ) : (
//                 <CTableRow>
//                   <CTableDataCell
//                     colSpan={5}
//                     className="text-danger text-center"
//                   >
//                     No error logs found for the selected date.
//                   </CTableDataCell>
//                 </CTableRow>
//               )}
//             </CTableBody>
//           </CTable>

//           {/* DPR Summary Table */}
//           {/* DPR Summary Table */}
//           <>
//             <h5 className="mt-5 mb-3">
//               📋 Daily Progress Report -{" "}
//               <span className="text-danger">{site_id}</span>
//             </h5>

//             <CTable
//               bordered
//               hover
//               responsive
//               className="text-center bg-important"
//             >
//               <CTableHead color="success">
//                 <CTableRow>
//                   <CTableHeaderCell>Sr</CTableHeaderCell>
//                   <CTableHeaderCell>Date</CTableHeaderCell>
//                   <CTableHeaderCell>Site</CTableHeaderCell>
//                   <CTableHeaderCell>Operational Robots</CTableHeaderCell>
//                   <CTableHeaderCell>Failed Robots</CTableHeaderCell>
//                   <CTableHeaderCell>Total Robots</CTableHeaderCell>
//                   <CTableHeaderCell>FromLog (Success)</CTableHeaderCell>
//                   <CTableHeaderCell>Remarks</CTableHeaderCell>
//                   <CTableHeaderCell>Technician</CTableHeaderCell>
//                 </CTableRow>
//               </CTableHead>

//               <CTableBody>
//                 {dprLogs?.length > 0 ? (
//                   dprLogs.map((log, index) => {
//                     const technician = log.technician_present?.[0]?.name || "-";
//                     const reportDate = log.report_date
//                       ? new Date(log.report_date).toLocaleDateString()
//                       : "-";

//                     return (
//                       <CTableRow key={index}>
//                         <CTableDataCell>{index + 1}</CTableDataCell>
//                         <CTableDataCell>{reportDate}</CTableDataCell>
//                         <CTableDataCell>{log.site_id}</CTableDataCell>
//                         <CTableDataCell>
//                           {log.total_running_robots}
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           {log.total_failed_robots}
//                         </CTableDataCell>
//                         <CTableDataCell>{log.total_robots}</CTableDataCell>
//                         <CTableDataCell>
//                           <span
//                             className={`badge ${
//                               cleaningSuccessMap?.[log.site_id]
//                                 ? "bg-success"
//                                 : "bg-danger"
//                             }`}
//                           >
//                             {cleaningSuccessMap?.[log.site_id] || 0}
//                           </span>
//                         </CTableDataCell>
//                         <CTableDataCell>{log.comments || "-"}</CTableDataCell>
//                         <CTableDataCell>{technician}</CTableDataCell>
//                       </CTableRow>
//                     );
//                   })
//                 ) : (
//                   <CTableRow>
//                     <CTableDataCell
//                       colSpan={9}
//                       className="text-center text-danger"
//                     >
//                       No DPR logs found for the selected date.
//                     </CTableDataCell>
//                   </CTableRow>
//                 )}
//               </CTableBody>
//             </CTable>
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
} from "@coreui/react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import axios from "axios";
// import PaginateInput from "../../../components/PaginateInput";
import * as XLSX from "xlsx";
import LoadingSpinner from "../../../components/LoadingSpinner";
import SubscriptionExpiryCard from "../../../components/SubscriptionExpiryCard";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_CLEANING_REQUEST":
      return { ...state, cleaningLoading: true, cleaningError: "" };
    case "FETCH_CLEANING_SUCCESS":
      return {
        ...state,
        cleaningLoading: false,
        cleaninglogs: action.payload.cleaninglogs,
        cleaningCompleted: action.payload.cleaningCompleted,
        cleaningInProgress: action.payload.cleaningInProgress,
        failureLogs: action.payload.failureLogs,
        totalPages: action.payload.totalPages,
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
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

    default:
      return state;
  }
};

const SitewaiseLog = () => {
  const [
    {
      cleaningLoading,
      cleaningError,
      cleaninglogs,
      cleaningCompleted,
      cleaningInProgress,
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
    },
    dispatch,
  ] = useReducer(reducer, {
    cleaninglogs: [],
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
            cleaninglogs: data.cleaninglogs || [],
            cleaningCompleted: data.cleaningCompleted || [],
            cleaningInProgress: data.cleaningInProgress || [],
            failureLogs: data.failureLogs || [],
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

    fetchCleaningLogs();
  }, [site_id, startDate, authtoken]);

  const exportToExcel = () => {
    if (!cleaningCompleted) {
      toast.error("No data available to export.");
      return;
    }

    const mergedData = [];

    // 2. Cleaning Logs
    mergedData.push(["Cleaning Logs"]);
    if (cleaningCompleted) {
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
          log.cleaning.start
            ? new Date(log.cleaning.startAt).toLocaleString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
              })
            : "N/A",
          log.cleaning.battery_before_cleaning
            ? log.cleaning.battery_before_cleaning
            : "N/A",

          log.cleaning.battery_after_cleaning
            ? log.cleaning.battery_after_cleaning
            : "N/A",
          log.cleaning.finish
            ? new Date(log.cleaning.finishAt).toLocaleString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
              })
            : "N/A",
          log.cleaning.finish
            ? "Completed"
            : log.cleaning.battery_dead
            ? "Battery Dead"
            : log.cleaning.cleaning_cancelled
            ? "Cleaning Cancelled"
            : "In Progress",
        ]);
      });
    } else {
      mergedData.push(["No cleaning logs data available"]);
    }
    mergedData.push([]);

    mergedData.push([]);

    // 4. Summary
    mergedData.push(["Summary"]);
    mergedData.push(["Site ID", site_id || "N/A"]);
    mergedData.push([
      "Report Period",
      `${startDate || "N/A"} to ${startDate || "N/A"}`,
    ]);
    mergedData.push(["Generated At", new Date().toLocaleString()]);
    mergedData.push([]);
    mergedData.push(["Data Summary"]);
    mergedData.push([
      "Cleaning Logs",
      cleaningCompleted ? cleaningCompleted.length : 0,
    ]);

    const ws = XLSX.utils.aoa_to_sheet(mergedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "All Logs");

    try {
      XLSX.writeFile(
        wb,
        `Site_${site_id || "Unknown"}_Logs_${startDate || "Start"}_To_${
          startDate || "End"
        }.xlsx`
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
        <div className="">
          <div>
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
                {/* <CCol md={3} xs={12} className="m-1">
                  <CFormInput
                    type="date"
                    value={startDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </CCol> */}
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
          </div>
          {timerLogLoading ? (
            <div className="text-center my-4">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              {/* Cleaning Logs Table */}
              <div className="mb-3">
                <CCard className="shadow-sm border-0">
                  <CCardBody className="py-3">
                    <CRow className="align-items-center">
                      <CCol xs="12" md="3" className="mb-2 mb-md-0">
                        <h5 className="fw-bold mb-0">🤖 Cleaning Logs</h5>
                      </CCol>

                      <CCol xs="12" md="9">
                        <div className="d-flex flex-wrap gap-3 justify-content-md-end text-center text-md-end">
                          <CBadge
                            color="secondary"
                            className="px-3 py-2 rounded-pill"
                          >
                            Total:{" "}
                            {cleaningCompleted.length +
                              cleaningInProgress.length +
                              failureLogs.length}
                          </CBadge>

                          <CBadge
                            color="info"
                            className="px-3 py-2 rounded-pill"
                          >
                            In Progress: {cleaningInProgress.length}
                          </CBadge>

                          <CBadge
                            color="success"
                            className="px-3 py-2 rounded-pill"
                          >
                            Completed: {cleaningCompleted.length}
                          </CBadge>

                          <CBadge
                            color="danger"
                            className="px-3 py-2 rounded-pill"
                          >
                            Failure: {failureLogs.length}
                          </CBadge>
                        </div>
                      </CCol>
                    </CRow>
                  </CCardBody>
                </CCard>
              </div>
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
                    {/* <CTableHeaderCell style={{ minWidth: "190px" }}>
                      Distance Covered (Meters)
                    </CTableHeaderCell> */}
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {cleaningCompleted.length > 0 ? (
                    cleaningCompleted.map((log, index) => (
                      <CTableRow key={index}>
                        <CTableDataCell>{index + 1}</CTableDataCell>
                        <CTableDataCell>{log.robot_no}</CTableDataCell>
                        <CTableDataCell>
                          {log.cleaning.finish ? (
                            <CBadge color="success">Completed</CBadge>
                          ) : log.cleaning.battery_dead ? (
                            <CBadge color="danger">Battery Dead</CBadge>
                          ) : log.cleaning.cleaning_cancelled ? (
                            <CBadge color="danger">Cleaning Cancelled</CBadge>
                          ) : (
                            <CBadge color="info">In Progress</CBadge>
                          )}
                        </CTableDataCell>
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
                            new Date(log.cleaning.finishAt).toLocaleString(
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
                            )
                          ) : log.cleaning.battery_dead ? (
                            <CBadge color="danger">Battery Dead</CBadge>
                          ) : log.cleaning.cleaning_cancelled ? (
                            <CBadge color="danger">Cleaning Cancelled</CBadge>
                          ) : (
                            <CBadge color="info">In Progress</CBadge>
                          )}
                        </CTableDataCell>
                        <CTableDataCell>
                          {log.cleaning.battery_before_cleaning
                            ? log.cleaning.battery_before_cleaning
                            : "N/A"}
                        </CTableDataCell>
                        <CTableDataCell>
                          {log.cleaning.battery_after_cleaning
                            ? log.cleaning.battery_after_cleaning
                            : "N/A"}
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan="11" className=" text-start  ">
                        No logs found for the selected date.
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>

              {/* <PaginateInput
                page={page}
                totalPages={totalPages}
                hasPrevPage={hasPrevPage}
                hasNextPage={hasNextPage}
                pageInput={pageInput}
                handlePageChange={handlePageChange}
                handlePageInputChange={handlePageInputChange}
                handlePageInputSubmit={handlePageInputSubmit}
                limit={limit}
                handleLimitChange={setLimit}
              /> */}

              {/* Error Logs Table */}
              <h5 className="mt-5 mb-3">Cleaning In Progress</h5>
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
                          {" "}
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
                      <CTableDataCell colSpan={5} className=" text-start ">
                        No Cleaning In Progress logs found for the selected
                        date.
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>

              {/* Error Logs Table */}
              <h5 className="mt-5 mb-3">🚨 Error Logs for</h5>
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
                    <CTableHeaderCell>Error Type</CTableHeaderCell>
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
                          {log.cleaning.battery_dead
                            ? "In Complete"
                            : "Cleaning Cancelled"}
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan={5} className=" text-start ">
                        No error logs found for the selected date.
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default SitewaiseLog;
