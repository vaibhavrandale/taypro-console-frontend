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

//   const authtoken = useSelector((state) => state.authtoken);
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
//             headers: { Authorization: `Bearer ${authtoken}` },
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
//   }, [authtoken, site_id, month, year]);
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
//         headers: { Authorization: `Bearer ${authtoken}` },
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

  const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);
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
          headers: { Authorization: `Bearer ${authtoken}` },
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
  }, [authtoken, site_id, month, year]);
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
        headers: { Authorization: `Bearer ${authtoken}` },
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
                            to={`/${adminroute}/cleaning-log-sites/daywise-cleaning/${site_id}/${new Date(item.date).toISOString().split("T")[0]}`}
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
    </>
  );
};

export default CleaningSummary;
