// import {
//   CBadge,
//   CButton,
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CCol,
//   CModal,
//   CModalBody,
//   CModalFooter,
//   CModalHeader,
//   CRow,
//   CTable,
//   CTableBody,
//   CTableDataCell,
//   CTableHead,
//   CTableHeaderCell,
//   CTableRow,
// } from "@coreui/react";
// import axios from "axios";
// import React, { useEffect, useReducer, useState } from "react";
// import toast from "react-hot-toast";
// import { useSelector } from "react-redux";
// import { useParams } from "react-router-dom";
// import LoadingSpinner from "../../../../components/LoadingSpinner";
// import { cilX } from "@coreui/icons";
// import CIcon from "@coreui/icons-react";
// const reducer = (state, action) => {
//   switch (action.type) {
//     case "FETCH_REQUEST":
//       return { ...state, loading: true, error: "" };
//     case "FETCH_SUCCESS":
//       return {
//         ...state,
//         loading: false,
//         data: action.payload.data, // ✅ ARRAY
//         average_success: action.payload.average_success,
//         average_failure: action.payload.average_failure,
//         uptime: action.payload.uptime,
//       };
//     case "FETCH_FAIL":
//       return { ...state, loading: false, error: action.payload };
//     default:
//       return state;
//   }
// };
// const CleaningSummary = () => {
//   const [
//     { loading, error, data, average_success, average_failure, uptime },
//     dispatch,
//   ] = useReducer(reducer, {
//     data: [],
//     loading: true,
//     error: "",
//     average_success: 0,
//     average_failure: 0,
//     uptime: 0,
//   });
//   const { site_id } = useParams();

//  // const authtoken = useSelector((state) => state.authtoken);
//   const [month, setMonth] = useState(new Date().getMonth() + 1);
//   const [year, setYear] = useState(new Date().getFullYear());
//   // Main table search
//   const [mainSearch, setMainSearch] = useState("");
//   const [masterData, setMasterData] = useState({});
//   // Modal table search
//   const [modalSearch, setModalSearch] = useState("");

//   const [modalVisible, setModalVisible] = useState(false);
//   const [modalData, setModalData] = useState({
//     date: "",
//     robots: [],
//     type: "success",
//   });

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         dispatch({ type: "FETCH_REQUEST" });
//         const data = {
//           site_id: site_id,
//           month: month,
//           year: year,
//         };
//         const result = await axios.post(
//           `/api/v1/robot-tracking/monthly/report`,
//           data,
//           {
//             // headers: { Authorization: `Bearer ${authtoken}` },
// withCredentials: true,
//           },
//         );

//         dispatch({
//           type: "FETCH_SUCCESS",
//           payload: {
//             data: result.data.data,
//             average_success: result.data.average_success,
//             average_failure: result.data.average_failure,
//             uptime: result.data.uptime,
//           },
//         });
//         setMasterData(result.data);
//       } catch (error) {
//         dispatch({
//           type: "FETCH_FAIL",
//           payload: error.response?.data.error || error.response?.data.message,
//         });
//         toast.error(error.response?.data.error || error.response?.data.message);
//       }
//     };

//     fetchData();
//   }, [ site_id, month, year]);
//   const handleViewDetails = (date, type, robots) => {
//     setModalSearch("");
//     setModalData({ date, type, robots });
//     setModalVisible(true);
//   };

//   const filteredMainData = data.filter((item) =>
//     item.date.toLowerCase().includes(mainSearch.toLowerCase()),
//   );
//   const filteredModalRobots = modalData.robots.filter((robot) =>
//     robot.robot_no.toLowerCase().includes(modalSearch.toLowerCase()),
//   );

//   const handleExport = async () => {
//     try {
//       toast.loading("Preparing Excel report...", { id: "export" });
//       const data = {
//         site_id: site_id,
//         month: month,
//         year: year,
//       };

//       const response = await axios.post(`/api/v1/robot-tracking/export`, data, {
//         // headers: { Authorization: `Bearer ${authtoken}` },
// withCredentials: true,
//         responseType: "blob",
//       });

//       const blob = new Blob([response.data], {
//         type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//       });

//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");

//       a.href = url;
//       a.download = `${site_id}_Cleaning_Report_${month}_${year}.xlsx`;
//       document.body.appendChild(a);
//       a.click();

//       a.remove();
//       window.URL.revokeObjectURL(url);

//       toast.success("Excel downloaded", { id: "export" });
//     } catch (error) {
//       toast.error(
//         error.response?.data?.message || error.response?.data?.error,
//         {
//           id: "export",
//         },
//       );
//     }
//   };

//   return (
//     <>
//       <CRow className="my-1">
//         <div className="mb-2 d-flex justify-content-center align-items-center flex-wrap">
//           <h4 className="">
//             <span className="me-2  text-success ">{site_id}</span>
//             Cleaning Summary
//           </h4>
//         </div>
//         <CCol xs="12">
//           <CCard>
//             <CCardHeader>
//               <CRow className="mb-2 align-items-end g-3">
//                 {/* Month Selector */}
//                 <CCol xs="6" md="2">
//                   <label
//                     htmlFor="monthSelect"
//                     className="form-label small fw-semibold"
//                   >
//                     Month
//                   </label>
//                   <select
//                     id="monthSelect"
//                     className="form-select"
//                     value={month}
//                     onChange={(e) => setMonth(parseInt(e.target.value))}
//                   >
//                     {[...Array(12)].map((_, i) => (
//                       <option key={i + 1} value={i + 1}>
//                         {new Date(0, i).toLocaleString("en-US", {
//                           month: "long",
//                         })}
//                       </option>
//                     ))}
//                   </select>
//                 </CCol>

//                 {/* Year Selector */}
//                 <CCol xs="6" md="2">
//                   <label
//                     htmlFor="yearSelect"
//                     className="form-label small fw-semibold"
//                   >
//                     Year
//                   </label>
//                   <select
//                     id="yearSelect"
//                     className="form-select"
//                     value={year}
//                     onChange={(e) => setYear(parseInt(e.target.value))}
//                   >
//                     {[2023, 2024, 2025, 2026, 2027].map((y) => (
//                       <option key={y} value={y}>
//                         {y}
//                       </option>
//                     ))}
//                   </select>
//                 </CCol>
//                 <CCol xs="3" md="2">
//                   <CButton
//                     className=" btn-sm"
//                     color="primary"
//                     onClick={handleExport}
//                   >
//                     Export
//                   </CButton>
//                 </CCol>

//                 {/* KPI / Loader Container */}
//                 <CCol xs="12" md="6">
//                   <div className="d-flex justify-content-end align-items-center h-100 ">
//                     {loading ? (
//                       <div className="d-flex justify-content-center align-items-center">
//                         <LoadingSpinner size="sm" />
//                       </div>
//                     ) : (
//                       <>
//                         {/* Avg Success */}
//                         <div className="text-center me-2 ">
//                           <div className="text-muted small">Avg Success</div>
//                           <CBadge color="success" className="fs-5 px-3 mt-1">
//                             {average_success}
//                           </CBadge>
//                         </div>

//                         {/* Avg Failure */}
//                         <div className="text-center ms-2 ">
//                           <div className="text-muted small">Avg Failure</div>
//                           <CBadge color="danger" className="fs-5 px-3 mt-1">
//                             {average_failure}
//                           </CBadge>
//                         </div>
//                         <div className="text-center ms-2 ">
//                           <div className="text-muted small">Uptime</div>
//                           <CBadge color="warning" className="fs-5 px-3 mt-1">
//                             {uptime}%
//                           </CBadge>
//                         </div>
//                       </>
//                     )}
//                   </div>
//                 </CCol>
//               </CRow>
//             </CCardHeader>

//             <CCardBody>
//               <CTable hover bordered responsive>
//                 <CTableHead color="light">
//                   <CTableRow>
//                     <CTableHeaderCell>#</CTableHeaderCell>
//                     <CTableHeaderCell>Date</CTableHeaderCell>
//                     <CTableHeaderCell>Successful Cleanings</CTableHeaderCell>
//                     <CTableHeaderCell>Failed Cleanings</CTableHeaderCell>
//                     <CTableHeaderCell>Technician Comment</CTableHeaderCell>
//                     <CTableHeaderCell>Actions</CTableHeaderCell>
//                   </CTableRow>
//                 </CTableHead>
//                 <CTableBody>
//                   {loading ? (
//                     <CTableRow>
//                       <CTableHeaderCell colSpan="6" className="text-center">
//                         <LoadingSpinner />
//                       </CTableHeaderCell>
//                     </CTableRow>
//                   ) : error ? (
//                     <CTableRow>
//                       <CTableHeaderCell colSpan="6" className="text-center">
//                         {error}
//                       </CTableHeaderCell>
//                     </CTableRow>
//                   ) : filteredMainData.length > 0 ? (
//                     filteredMainData.map((item, index) => (
//                       <CTableRow key={item.date}>
//                         <CTableDataCell>{index + 1}</CTableDataCell>
//                         <CTableDataCell>
//                           {new Date(item.date).toLocaleDateString("en-GB", {
//                             day: "2-digit",
//                             month: "2-digit",
//                             year: "numeric",
//                           })}
//                         </CTableDataCell>
//                         <CTableDataCell>{item.success_count}</CTableDataCell>
//                         <CTableDataCell>{item.failure_count}</CTableDataCell>
//                         <CTableDataCell>
//                           {item.dpr_comment
//                             ? item.dpr_comment
//                             : "Cleaning Cycle completed Successfully"}
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           <CButton
//                             color="success"
//                             size="sm"
//                             className="m-1"
//                             onClick={() =>
//                               handleViewDetails(
//                                 item.date,
//                                 "success",
//                                 item.success_robots,
//                               )
//                             }
//                           >
//                             Success Robots
//                           </CButton>
//                           <CButton
//                             color="danger"
//                             className="m-1"
//                             size="sm"
//                             onClick={() =>
//                               handleViewDetails(
//                                 item.date,
//                                 "failure",
//                                 item.failure_robots,
//                               )
//                             }
//                           >
//                             Failure Robots
//                           </CButton>
//                         </CTableDataCell>
//                       </CTableRow>
//                     ))
//                   ) : (
//                     <CTableRow>
//                       <CTableDataCell colSpan="6" className="text-center">
//                         No records found for the selected month and year.
//                       </CTableDataCell>
//                     </CTableRow>
//                   )}
//                 </CTableBody>
//               </CTable>
//             </CCardBody>
//           </CCard>
//         </CCol>
//       </CRow>

//       <CModal
//         backdrop="static"
//         visible={modalVisible}
//         onClose={() => setModalVisible(false)}
//         size="xl"
//         scrollable
//       >
//         <CModalHeader closeButton={false}>
//           {modalData.type.toUpperCase()} Robots on {modalData.date}
//           <button
//             type="button"
//             className="border-0 ms-auto py-0 px-1"
//             onClick={() => setModalVisible(false)}
//             style={{ background: "none" }}
//             aria-label="Close"
//           >
//             <CIcon icon={cilX} size="lg" />
//           </button>
//         </CModalHeader>
//         <CModalBody>
//           <CRow className="mb-3 d-flex justify-content-end align-items-center">
//             <CCol md="4">
//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder="Search by robot number"
//                 value={modalSearch}
//                 onChange={(e) => setModalSearch(e.target.value)}
//               />
//             </CCol>
//           </CRow>

//           <CTable hover striped bordered responsive>
//             <CTableHead color="light">
//               <CTableRow>
//                 <CTableHeaderCell>#</CTableHeaderCell>
//                 {/* <CTableHeaderCell>_id</CTableHeaderCell> */}
//                 <CTableHeaderCell style={{ minWidth: "150px" }}>
//                   Robot No
//                 </CTableHeaderCell>

//                 {modalData.type === "success" ? (
//                   <>
//                     <CTableHeaderCell>Start At</CTableHeaderCell>
//                     <CTableHeaderCell>Finish At</CTableHeaderCell>
//                     <CTableHeaderCell>Battery Before Cleaning</CTableHeaderCell>
//                     <CTableHeaderCell>Battery After Cleaning</CTableHeaderCell>
//                   </>
//                 ) : (
//                   <>
//                     <CTableHeaderCell>Start At</CTableHeaderCell>
//                     <CTableHeaderCell>Failure At</CTableHeaderCell>
//                     <CTableHeaderCell style={{ minWidth: "150px" }}>
//                       Failure Reason
//                     </CTableHeaderCell>
//                     <CTableHeaderCell style={{ minWidth: "150px" }}>
//                       Comments
//                     </CTableHeaderCell>
//                   </>
//                 )}
//               </CTableRow>
//             </CTableHead>

//             <CTableBody>
//               {filteredModalRobots.length > 0 ? (
//                 filteredModalRobots.map((robot, index) => (
//                   <CTableRow key={index}>
//                     <CTableDataCell>{index + 1}</CTableDataCell>
//                     {/* <CTableDataCell>{robot._id}</CTableDataCell> */}
//                     <CTableDataCell>{robot.robot_no}</CTableDataCell>

//                     {modalData.type === "success" ? (
//                       <>
//                         <CTableDataCell>
//                           {robot.cleaning.startAt
//                             ? new Date(robot.cleaning.startAt).toLocaleString(
//                                 "en-GB",
//                                 {
//                                   day: "2-digit",
//                                   month: "2-digit",
//                                   year: "numeric",
//                                   hour: "2-digit",
//                                   minute: "2-digit",
//                                   second: "2-digit",
//                                   hour12: true,
//                                 },
//                               )
//                             : "N/A"}
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           {robot.cleaning.finishAt
//                             ? new Date(robot.cleaning.finishAt).toLocaleString(
//                                 "en-GB",
//                                 {
//                                   day: "2-digit",
//                                   month: "2-digit",
//                                   year: "numeric",
//                                   hour: "2-digit",
//                                   minute: "2-digit",
//                                   second: "2-digit",
//                                   hour12: true,
//                                 },
//                               )
//                             : "N/A"}
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           {robot.cleaning.battery_before_cleaning || "N/A"}
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           {robot.cleaning.battery_after_cleaning || "N/A"}
//                         </CTableDataCell>
//                       </>
//                     ) : (
//                       <>
//                         <CTableDataCell>
//                           {robot.cleaning.startAt
//                             ? new Date(robot.cleaning.startAt).toLocaleString(
//                                 "en-GB",
//                                 {
//                                   day: "2-digit",
//                                   month: "2-digit",
//                                   year: "numeric",
//                                   hour: "2-digit",
//                                   minute: "2-digit",
//                                   second: "2-digit",
//                                   hour12: true,
//                                 },
//                               )
//                             : "N/A"}
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           {robot.cleaning.battery_dead_at
//                             ? new Date(
//                                 robot.cleaning.battery_dead_at,
//                               ).toLocaleString("en-GB", {
//                                 day: "2-digit",
//                                 month: "2-digit",
//                                 year: "numeric",
//                                 hour: "2-digit",
//                                 minute: "2-digit",
//                                 second: "2-digit",
//                                 hour12: true,
//                               })
//                             : robot.cleaning.cleaning_cancelled_at
//                               ? new Date(
//                                   robot.cleaning.cleaning_cancelled_at,
//                                 ).toLocaleString("en-GB", {
//                                   day: "2-digit",
//                                   month: "2-digit",
//                                   year: "numeric",
//                                   hour: "2-digit",
//                                   minute: "2-digit",
//                                   second: "2-digit",
//                                   hour12: true,
//                                 })
//                               : "N/A"}
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           {robot.cleaning.battery_dead
//                             ? "Battery Dead"
//                             : robot.cleaning.cleaning_cancelled
//                               ? "Cleaning Cancelled"
//                               : "N/A"}
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           {robot.comments ===
//                           "🚫 Emergency Stop By undefined (undefined)"
//                             ? "🚫 Emergency Stop By Admin"
//                             : robot.comments}
//                         </CTableDataCell>
//                       </>
//                     )}
//                   </CTableRow>
//                 ))
//               ) : (
//                 <CTableRow>
//                   <CTableDataCell
//                     colSpan={modalData.type === "success" ? 6 : 4}
//                     className="text-center"
//                   >
//                     No robots found
//                   </CTableDataCell>
//                 </CTableRow>
//               )}
//             </CTableBody>
//           </CTable>
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={() => setModalVisible(false)}>
//             Close
//           </CButton>
//         </CModalFooter>
//       </CModal>
//     </>
//   );
// };

// export default CleaningSummary;

import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import { cilX } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { CChartBar } from "@coreui/react-chartjs";

const JOB_BADGE = {
  active: "warning",
  waiting: "info",
  delayed: "secondary",
  completed: "success",
  failed: "danger",
};

function formatJobTime(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString();
}

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        data: action.payload.data, // ✅ ARRAY
        average_success: action.payload.average_success,
        average_failure: action.payload.average_failure,
        cleaning_uptime: action.payload.cleaning_uptime,
        availibility_uptime: action.payload.availibility_uptime,
        total_assigned_robots: action.payload.total_assigned_robots,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
const CleaningSummary = () => {
  const [
    {
      loading,
      error,
      data,
      average_success,
      average_failure,
      cleaning_uptime,
      availibility_uptime,
      total_assigned_robots,
    },

    dispatch,
  ] = useReducer(reducer, {
    data: [],
    loading: true,
    error: "",
    average_success: 0,
    average_failure: 0,
    cleaning_uptime: 0,
    availibility_uptime: 0,
    total_assigned_robots: 0,
  });
  const { site_id } = useParams();

  // const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);
  const isMasterAdmin = userInfo?.role === "Master Admin";
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  // Main table search
  const [mainSearch, setMainSearch] = useState("");
  const [masterData, setMasterData] = useState({});
  // Modal table search
  const [modalSearch, setModalSearch] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState({
    date: "",
    robots: [],
    type: "success",
  });
  const [yearlyVisible, setYearlyVisible] = useState(false);
  const [yearlyLoading, setYearlyLoading] = useState(false);
  const [yearlyError, setYearlyError] = useState("");
  const [yearlyReport, setYearlyReport] = useState(null);
  const [yearlyEmailing, setYearlyEmailing] = useState(false);
  const [yearlyJobs, setYearlyJobs] = useState(null);

  const fetchYearlyJobs = async () => {
    try {
      const result = await axios.get(`/api/v1/yearly-uptime/jobs`, {
        withCredentials: true,
      });
      setYearlyJobs(result.data);
    } catch (_) {
      // queue status is secondary; don't toast over the report
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const data = {
          site_id: site_id,
          month: month,
          year: year,
        };
        const result = await axios.post(`/api/v1/robot-tracking/uptime`, data, {
          // headers: { Authorization: `Bearer ${authtoken}` },
          withCredentials: true,
        });
        // console.log(result.data);
        dispatch({
          type: "FETCH_SUCCESS",
          payload: {
            data: result.data.data,
            average_success: result.data.average_success,
            average_failure: result.data.average_failure,
            cleaning_uptime: result.data.monthlyCleaningUptime,
            availibility_uptime: result.data.monthlyAvailibilityUptime,
            total_assigned_robots: result.data.total_assigned_robots,
          },
        });
        setMasterData(result.data);
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: error.response?.data.error || error.response?.data.message,
        });
        toast.error(error.response?.data.error || error.response?.data.message);
      }
    };

    fetchData();
  }, [site_id, month, year]);

  useEffect(() => {
    if (!yearlyVisible || !isMasterAdmin) return undefined;
    fetchYearlyJobs();
    const timer = setInterval(fetchYearlyJobs, 5000);
    return () => clearInterval(timer);
  }, [yearlyVisible, isMasterAdmin]);
  // const handleViewDetails = (date, type, robots) => {
  //   setModalSearch("");
  //   setModalData({ date, type, robots });
  //   setModalVisible(true);
  // };

  const filteredMainData = data.filter((item) =>
    item.date.toLowerCase().includes(mainSearch.toLowerCase()),
  );
  const filteredModalRobots = modalData.robots.filter((robot) =>
    robot.robot_no.toLowerCase().includes(modalSearch.toLowerCase()),
  );

  const handleExport = async () => {
    try {
      toast.loading("Preparing Excel report...", { id: "export" });
      const data = {
        site_id: site_id,
        month: month,
        year: year,
      };

      const response = await axios.post(`/api/v1/robot-tracking/export`, data, {
        // headers: { Authorization: `Bearer ${authtoken}` },
        withCredentials: true,
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = `${site_id}_Cleaning_Report_${month}_${year}.xlsx`;
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Excel downloaded", { id: "export" });
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.response?.data?.error,
        {
          id: "export",
        },
      );
    }
  };

  const openYearlyModal = async () => {
    setYearlyVisible(true);
    setYearlyLoading(true);
    setYearlyError("");
    setYearlyReport(null);
    try {
      const result = await axios.post(
        `/api/v1/yearly-uptime/summary`,
        { site_id, year },
        { withCredentials: true },
      );
      setYearlyReport(result.data);
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to load yearly uptime";
      setYearlyError(msg);
      toast.error(msg);
    } finally {
      setYearlyLoading(false);
    }
  };

  const handleYearlyUptimeEmail = async () => {
    try {
      setYearlyEmailing(true);
      toast.loading("Queuing yearly uptime email...", { id: "yearly-uptime" });
      const result = await axios.post(
        `/api/v1/yearly-uptime`,
        { site_id, year },
        { withCredentials: true },
      );
      toast.success(result.data?.message || `Yearly uptime will be emailed`, {
        id: "yearly-uptime",
      });
      if (isMasterAdmin) fetchYearlyJobs();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to queue yearly uptime",
        { id: "yearly-uptime" },
      );
    } finally {
      setYearlyEmailing(false);
    }
  };

  let adminroute = "";

  if (userInfo?.role === "Master Admin") {
    adminroute = "master-admin";
  } else if (userInfo?.role === "Service Admin") {
    adminroute = "service-admin";
  } else if (userInfo?.role === "Project Admin") {
    adminroute = "project-admin";
  } else if (userInfo?.role === "Client Admin") {
    adminroute = "client-admin";
  } else if (userInfo?.role === "Site Incharge") {
    adminroute = "site-incharge";
  } else if (userInfo?.role === "Site Technician") {
    adminroute = "site-technician";
  } else if (userInfo?.role === "Client Site Technician") {
    adminroute = "client-site-technician";
  } else if (userInfo?.role === "Master User") {
    adminroute = "master-user";
  } else if (userInfo?.role === "Service User") {
    adminroute = "service-user";
  } else if (userInfo?.role === "Project User") {
    adminroute = "project-user";
  }

  return (
    <>
      <CRow className="my-1">
        <div className="mb-2 d-flex justify-content-center align-items-center flex-wrap">
          <h4 className="">
            <span className="me-2  text-success ">{site_id}</span>
            Cleaning Summary
          </h4>
        </div>
        <CCol xs="12">
          <CCard>
            <CCardHeader>
              <CRow className="mb-2 align-items-end g-3">
                {/* Month Selector */}
                <CCol xs="6" md="2">
                  <label
                    htmlFor="monthSelect"
                    className="form-label small fw-semibold"
                  >
                    Month
                  </label>
                  <select
                    id="monthSelect"
                    className="form-select"
                    value={month}
                    onChange={(e) => setMonth(parseInt(e.target.value))}
                  >
                    {[...Array(12)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {new Date(0, i).toLocaleString("en-US", {
                          month: "long",
                        })}
                      </option>
                    ))}
                  </select>
                </CCol>

                {/* Year Selector */}
                <CCol xs="6" md="2">
                  <label
                    htmlFor="yearSelect"
                    className="form-label small fw-semibold"
                  >
                    Year
                  </label>
                  <select
                    id="yearSelect"
                    className="form-select"
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value))}
                  >
                    {[2023, 2024, 2025, 2026, 2027].map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </CCol>
                <CCol xs="3" md="2">
                  <CButton
                    className=" btn-sm"
                    color="primary"
                    onClick={handleExport}
                  >
                    Export
                  </CButton>
                  <CButton
                    className="btn-sm ms-2"
                    color="success"
                    onClick={openYearlyModal}
                  >
                    Uptime
                  </CButton>
                </CCol>

                <CCol xs="12" md="6">
                  <div className="d-flex justify-content-end align-items-center h-100 ">
                    {loading ? (
                      <div className="d-flex justify-content-center align-items-center">
                        <LoadingSpinner size="sm" />
                      </div>
                    ) : (
                      <>
                        {/* Avg Success */}
                        <div className="text-center me-2 d-flex flex-column align-items-center">
                          <div className="text-muted small">Total Robots</div>
                          <CBadge color="primary" className="fs-5 px-3 mt-1">
                            {total_assigned_robots}
                          </CBadge>
                        </div>
                        <div className="text-center me-2 d-flex flex-column align-items-center">
                          <div className="text-muted small">Avg Success</div>
                          <CBadge color="success" className="fs-5 px-3 mt-1">
                            {average_success}
                          </CBadge>
                        </div>

                        {/* Avg Failure */}
                        <div className="text-center ms-2 ">
                          <div className="text-muted small">Avg Failure</div>
                          <CBadge color="danger" className="fs-5 px-3 mt-1">
                            {average_failure}
                          </CBadge>
                        </div>
                        <div className="text-center ms-2 ">
                          <div className="text-muted small">
                            Cleaning Uptime
                          </div>
                          <CBadge color="warning" className="fs-5 px-3 mt-1">
                            {cleaning_uptime} %
                          </CBadge>
                        </div>
                        <div className="text-center ms-2 ">
                          <div className="text-muted small">
                            Availibility Uptime
                          </div>
                          <CBadge color="warning" className="fs-5 px-3 mt-1">
                            {availibility_uptime} %
                          </CBadge>
                        </div>
                      </>
                    )}
                  </div>
                </CCol>
              </CRow>
            </CCardHeader>

            <CCardBody>
              <CTable hover bordered responsive>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell>#</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">
                      Date
                    </CTableHeaderCell>
                    <CTableHeaderCell className="text-center">
                      Robots Availability
                    </CTableHeaderCell>
                    <CTableHeaderCell className="text-center">
                      Availibility Uptime
                    </CTableHeaderCell>
                    <CTableHeaderCell className="text-center">
                      Successful Cleanings
                    </CTableHeaderCell>
                    <CTableHeaderCell className="text-center">
                      Failed Cleanings
                    </CTableHeaderCell>

                    <CTableHeaderCell className="text-center">
                      Cleaning Uptime
                    </CTableHeaderCell>
                    <CTableHeaderCell className="text-center">
                      Technician Remarks
                    </CTableHeaderCell>
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {loading ? (
                    <CTableRow>
                      <CTableHeaderCell colSpan="9" className="text-center">
                        <LoadingSpinner />
                      </CTableHeaderCell>
                    </CTableRow>
                  ) : error ? (
                    <CTableRow>
                      <CTableHeaderCell colSpan="9" className="text-center">
                        {error}
                      </CTableHeaderCell>
                    </CTableRow>
                  ) : filteredMainData.length > 0 ? (
                    filteredMainData.map((item, index) => (
                      <CTableRow key={item.date}>
                        <CTableDataCell>{index + 1}</CTableDataCell>
                        <CTableDataCell className="text-center">
                          {new Date(item.date).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </CTableDataCell>
                        <CTableDataCell
                          style={{ minWidth: "150px" }}
                          className="text-center"
                        >
                          {item.available_robots}
                        </CTableDataCell>
                        <CTableDataCell
                          style={{ minWidth: "150px" }}
                          className="text-center"
                        >
                          {item.availibility_uptime_percentage
                            ? `${item.availibility_uptime_percentage}%`
                            : "0%"}
                        </CTableDataCell>
                        <CTableDataCell
                          style={{ minWidth: "150px" }}
                          className="text-center"
                        >
                          {item.success_count}
                        </CTableDataCell>
                        <CTableDataCell
                          style={{ minWidth: "150px" }}
                          className="text-center"
                        >
                          {item.failure_count}
                        </CTableDataCell>

                        <CTableDataCell
                          style={{ minWidth: "150px" }}
                          className="text-center"
                        >
                          {item.cleaning_uptime_percentage
                            ? `${item.cleaning_uptime_percentage}%`
                            : "0%"}
                        </CTableDataCell>
                        <CTableDataCell style={{ minWidth: "250px" }}>
                          {item.dpr && (
                            <>
                              <span className="fw-bold text-success">
                                {item.dpr.submitted_by}
                              </span>{" "}
                              : {item.dpr.dpr_comment}
                            </>
                          )}
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          <Link
                            size="sm"
                            className="m-1 btn btn-sm"
                            to={
                              userInfo.type === "External"
                                ? `/${adminroute}/cleaning-log-sites/daywise-cleaning/${site_id}/${new Date(item.date).toISOString().split("T")[0]}`
                                : `/${adminroute}/all-site-cleaning-log/sitewise-cleaning-log/${site_id}/${new Date(item.date).toISOString().split("T")[0]}`
                            }
                          >
                            View Log
                          </Link>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan="9" className="text-center">
                        No records found for the selected month and year.
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CModal
        backdrop="static"
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        size="xl"
        scrollable
      >
        <CModalHeader closeButton={false}>
          {modalData.type.toUpperCase()} Robots on {modalData.date}
          <button
            type="button"
            className="border-0 ms-auto py-0 px-1"
            onClick={() => setModalVisible(false)}
            style={{ background: "none" }}
            aria-label="Close"
          >
            <CIcon icon={cilX} size="lg" />
          </button>
        </CModalHeader>
        <CModalBody>
          <CRow className="mb-3 d-flex justify-content-end align-items-center">
            <CCol md="4">
              <input
                type="text"
                className="form-control"
                placeholder="Search by robot number"
                value={modalSearch}
                onChange={(e) => setModalSearch(e.target.value)}
              />
            </CCol>
          </CRow>

          <CTable hover striped bordered responsive>
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell>#</CTableHeaderCell>
                {/* <CTableHeaderCell>_id</CTableHeaderCell> */}
                <CTableHeaderCell style={{ minWidth: "150px" }}>
                  Robot No
                </CTableHeaderCell>

                {modalData.type === "success" ? (
                  <>
                    <CTableHeaderCell>Start At</CTableHeaderCell>
                    <CTableHeaderCell>Finish At</CTableHeaderCell>
                    <CTableHeaderCell>Battery Before Cleaning</CTableHeaderCell>
                    <CTableHeaderCell>Battery After Cleaning</CTableHeaderCell>
                  </>
                ) : (
                  <>
                    <CTableHeaderCell>Start At</CTableHeaderCell>
                    <CTableHeaderCell>Failure At</CTableHeaderCell>
                    <CTableHeaderCell style={{ minWidth: "150px" }}>
                      Failure Reason
                    </CTableHeaderCell>
                    <CTableHeaderCell style={{ minWidth: "150px" }}>
                      Comments
                    </CTableHeaderCell>
                  </>
                )}
              </CTableRow>
            </CTableHead>

            <CTableBody>
              {filteredModalRobots.length > 0 ? (
                filteredModalRobots.map((robot, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell className="text-center">
                      {index + 1}
                    </CTableDataCell>
                    {/* <CTableDataCell className="text-center">{robot._id}</CTableDataCell> */}
                    <CTableDataCell className="text-center">
                      {robot.robot_no}
                    </CTableDataCell>

                    {modalData.type === "success" ? (
                      <>
                        <CTableDataCell className="text-center">
                          {robot.cleaning.startAt
                            ? new Date(robot.cleaning.startAt).toLocaleString(
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
                              )
                            : "N/A"}
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          {robot.cleaning.finishAt
                            ? new Date(robot.cleaning.finishAt).toLocaleString(
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
                              )
                            : "N/A"}
                        </CTableDataCell>
                        <CTableDataCell>
                          {robot.cleaning.battery_before_cleaning || "N/A"}
                        </CTableDataCell>
                        <CTableDataCell>
                          {robot.cleaning.battery_after_cleaning || "N/A"}
                        </CTableDataCell>
                      </>
                    ) : (
                      <>
                        <CTableDataCell>
                          {robot.cleaning.startAt
                            ? new Date(robot.cleaning.startAt).toLocaleString(
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
                              )
                            : "N/A"}
                        </CTableDataCell>
                        <CTableDataCell>
                          {robot.cleaning.battery_dead_at
                            ? new Date(
                                robot.cleaning.battery_dead_at,
                              ).toLocaleString("en-GB", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                                hour12: true,
                              })
                            : robot.cleaning.cleaning_cancelled_at
                              ? new Date(
                                  robot.cleaning.cleaning_cancelled_at,
                                ).toLocaleString("en-GB", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  second: "2-digit",
                                  hour12: true,
                                })
                              : "N/A"}
                        </CTableDataCell>
                        <CTableDataCell>
                          {robot.cleaning.battery_dead
                            ? "Battery Dead"
                            : robot.cleaning.cleaning_cancelled
                              ? "Cleaning Cancelled"
                              : "N/A"}
                        </CTableDataCell>
                        <CTableDataCell>
                          {robot.comments ===
                          "🚫 Emergency Stop By undefined (undefined)"
                            ? "🚫 Emergency Stop By Admin"
                            : robot.comments}
                        </CTableDataCell>
                      </>
                    )}
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell
                    colSpan={modalData.type === "success" ? 6 : 4}
                    className="text-center"
                  >
                    No robots found
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal
        backdrop="static"
        visible={yearlyVisible}
        onClose={() => setYearlyVisible(false)}
        size="xl"
        scrollable
      >
        <CModalHeader closeButton={false}>
          {site_id} Yearly Uptime — {year}
          <button
            type="button"
            className="border-0 ms-auto py-0 px-1"
            onClick={() => setYearlyVisible(false)}
            style={{ background: "none" }}
            aria-label="Close"
          >
            <CIcon icon={cilX} size="lg" />
          </button>
        </CModalHeader>
        <CModalBody>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="mb-0">Overall Yearly Uptime</h6>
            <CButton
              color="success"
              disabled={yearlyLoading || yearlyEmailing}
              onClick={handleYearlyUptimeEmail}
            >
              {yearlyEmailing ? (
                <>
                  <LoadingSpinner size="sm" /> Sending...
                </>
              ) : (
                "Send Report on Email"
              )}
            </CButton>
          </div>

          {yearlyLoading ? (
            <div className="text-center py-4">
              <LoadingSpinner />
            </div>
          ) : yearlyError ? (
            <div className="text-center text-danger py-3">{yearlyError}</div>
          ) : yearlyReport ? (
            <>
              <div className="d-flex flex-wrap justify-content-start align-items-center mb-4 gap-3">
                <div className="text-center">
                  <div className="text-muted small">Total Robots</div>
                  <CBadge color="primary" className="fs-5 px-3 mt-1">
                    {yearlyReport.yearly?.total_assigned_robots ?? 0}
                  </CBadge>
                </div>
                <div className="text-center">
                  <div className="text-muted small">Avg Success</div>
                  <CBadge color="success" className="fs-5 px-3 mt-1">
                    {yearlyReport.yearly?.average_success ?? 0}
                  </CBadge>
                </div>
                <div className="text-center">
                  <div className="text-muted small">Avg Failure</div>
                  <CBadge color="danger" className="fs-5 px-3 mt-1">
                    {yearlyReport.yearly?.average_failure ?? 0}
                  </CBadge>
                </div>
                <div className="text-center">
                  <div className="text-muted small">Cleaning Uptime</div>
                  <CBadge color="warning" className="fs-5 px-3 mt-1">
                    {yearlyReport.yearly?.monthlyCleaningUptime ?? 0} %
                  </CBadge>
                </div>
                <div className="text-center">
                  <div className="text-muted small">Availibility Uptime</div>
                  <CBadge color="warning" className="fs-5 px-3 mt-1">
                    {yearlyReport.yearly?.monthlyAvailibilityUptime ?? 0} %
                  </CBadge>
                </div>
              </div>

              <h6 className="mb-2">Month-wise Uptime</h6>
              <div className="mb-4" style={{ height: 280 }}>
                <CChartBar
                  style={{ height: "100%", width: "100%" }}
                  data={{
                    labels: (yearlyReport.months || []).map((m) =>
                      (m.month_name || "").slice(0, 3),
                    ),
                    datasets: [
                      {
                        label: "Cleaning Uptime %",
                        backgroundColor: "#0f766e",
                        data: (yearlyReport.months || []).map(
                          (m) => Number(m.monthlyCleaningUptime) || 0,
                        ),
                      },
                      {
                        label: "Availability Uptime %",
                        backgroundColor: "#2563eb",
                        data: (yearlyReport.months || []).map(
                          (m) => Number(m.monthlyAvailibilityUptime) || 0,
                        ),
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: "top" } },
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100,
                        title: { display: true, text: "%" },
                      },
                    },
                  }}
                />
              </div>
              <CTable hover bordered responsive>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell className="text-center">
                      #
                    </CTableHeaderCell>
                    <CTableHeaderCell>Month</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">
                      Assigned Robots
                    </CTableHeaderCell>
                    <CTableHeaderCell className="text-center">
                      Avg Success
                    </CTableHeaderCell>
                    <CTableHeaderCell className="text-center">
                      Avg Failure
                    </CTableHeaderCell>
                    <CTableHeaderCell className="text-center">
                      Cleaning Uptime
                    </CTableHeaderCell>
                    <CTableHeaderCell className="text-center">
                      Availibility Uptime
                    </CTableHeaderCell>
                    {/* <CTableHeaderCell className="text-center">
                      Status
                    </CTableHeaderCell> */}
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {(yearlyReport.months || []).length ? (
                    yearlyReport.months.map((item, index) => (
                      <CTableRow key={item.month}>
                        <CTableDataCell className="text-center">
                          {index + 1}
                        </CTableDataCell>
                        <CTableDataCell>{item.month_name}</CTableDataCell>
                        <CTableDataCell className="text-center">
                          {item.total_assigned_robots}
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          {item.average_success}
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          {item.average_failure}
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          {item.monthlyCleaningUptime} %
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          {item.monthlyAvailibilityUptime} %
                        </CTableDataCell>
                        {/* <CTableDataCell className="text-center">
                          {item.has_data ? "Data" : "No data"}
                        </CTableDataCell> */}
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan="8" className="text-center">
                        No yearly data
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </>
          ) : null}

          {isMasterAdmin ? (
            <>
              <h6 className="mb-2 mt-4">Email jobs</h6>
              {yearlyJobs ? (
                <>
                  <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                    <CBadge
                      color={yearlyJobs.worker_running ? "success" : "danger"}
                    >
                      Worker {yearlyJobs.worker_running ? "online" : "offline"}
                      {yearlyJobs.workers ? ` (${yearlyJobs.workers})` : ""}
                    </CBadge>
                    {yearlyJobs.paused ? (
                      <CBadge color="warning">Queue paused</CBadge>
                    ) : null}
                    <CBadge color="warning">
                      Running {yearlyJobs.counts?.active ?? 0}
                    </CBadge>
                    <CBadge color="info">
                      Waiting {yearlyJobs.counts?.waiting ?? 0}
                    </CBadge>
                    <CBadge color="secondary">
                      Delayed {yearlyJobs.counts?.delayed ?? 0}
                    </CBadge>
                    <CBadge color="success">
                      Completed {yearlyJobs.counts?.completed ?? 0}
                    </CBadge>
                    <CBadge color="danger">
                      Failed {yearlyJobs.counts?.failed ?? 0}
                    </CBadge>
                  </div>
                  <CTable hover bordered responsive small>
                    <CTableHead color="light">
                      <CTableRow>
                        <CTableHeaderCell>Status</CTableHeaderCell>
                        <CTableHeaderCell>Site</CTableHeaderCell>
                        <CTableHeaderCell>Year</CTableHeaderCell>
                        <CTableHeaderCell>Created by</CTableHeaderCell>
                        <CTableHeaderCell>Email</CTableHeaderCell>
                        <CTableHeaderCell>Created</CTableHeaderCell>
                        <CTableHeaderCell>Started</CTableHeaderCell>
                        <CTableHeaderCell>Finished</CTableHeaderCell>
                        <CTableHeaderCell>Error</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {(yearlyJobs.jobs || []).length ? (
                        yearlyJobs.jobs.map((job) => (
                          <CTableRow key={job.id}>
                            <CTableDataCell>
                              <CBadge
                                color={JOB_BADGE[job.state] || "secondary"}
                              >
                                {job.state === "active" ? "running" : job.state}
                              </CBadge>
                            </CTableDataCell>
                            <CTableDataCell>{job.site_id}</CTableDataCell>
                            <CTableDataCell>{job.year}</CTableDataCell>
                            <CTableDataCell>
                              {job.username || "—"}
                            </CTableDataCell>
                            <CTableDataCell>{job.email || "—"}</CTableDataCell>
                            <CTableDataCell>
                              {formatJobTime(job.createdAt)}
                            </CTableDataCell>
                            <CTableDataCell>
                              {formatJobTime(job.processedAt)}
                            </CTableDataCell>
                            <CTableDataCell>
                              {formatJobTime(job.finishedAt)}
                            </CTableDataCell>
                            <CTableDataCell className="text-danger">
                              {job.failedReason || "—"}
                            </CTableDataCell>
                          </CTableRow>
                        ))
                      ) : (
                        <CTableRow>
                          <CTableDataCell colSpan="9" className="text-center">
                            No jobs in queue
                          </CTableDataCell>
                        </CTableRow>
                      )}
                    </CTableBody>
                  </CTable>
                </>
              ) : (
                <div className="text-muted small">Loading job status…</div>
              )}
            </>
          ) : null}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setYearlyVisible(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default CleaningSummary;
