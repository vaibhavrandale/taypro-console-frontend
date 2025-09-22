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
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CAvatar,
//   CFormSelect,
// } from "@coreui/react";
// import { Link } from "react-router-dom";
// import toast from "react-hot-toast";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import LoadingSpinner from "../../../components/LoadingSpinner";
// import LastActivity from "../../../components/LastActivity";
// // import PaginateInput from "../../../components/PaginateInput";
// import * as XLSX from "xlsx"; // Import xlsx for Excel export
// import CIcon from "@coreui/icons-react";
// import { cilX } from "@coreui/icons";

// const reducer = (state, action) => {
//   switch (action.type) {
//     case "FETCH_DPRBYDATE_REQUEST":
//       return { ...state, loadingDprs: true, error: "" };
//     case "FETCH_DPRBYDATE_SUCCESS":
//       return {
//         ...state,
//         loadingDprs: false,
//         dprs: action.payload.data,
//         totalPages: action.payload.totalPages,
//         hasNextPage: action.payload.hasNextPage,
//         hasPrevPage: action.payload.hasPrevPage,
//       };
//     case "FETCH_DPRBYDATE_FAIL":
//       return { ...state, loadingDprs: false, error: action.payload };

// case "FETCH_SITEID_REQUEST":
//   return { ...state, loadingSiteIds: true, error: "" };
// case "FETCH_SITEID_SUCCESS":
//   return { ...state, loadingSiteIds: false, siteIds: action.payload };
// case "FETCH_SITEID_FAIL":
//   return { ...state, loadingSiteIds: false, error: action.payload };

//     case "SELECT_SITENAME_REQUEST":
//       return { ...state, loadingFields: true };
//     case "SELECT_SITENAME_SUCCESS":
//       return {
//         ...state,
//         loadingFields: false,
//         selectedSiteName: action.payload,
//       };
//     case "SELECT_SITENAME_FAIL":
//       return { ...state, loadingFields: false };

//     case "DELETE_REQUEST":
//       return { ...state, loadingDelete: true, successDelete: false };
//     case "DELETE_SUCCESS":
//       return { ...state, loadingDelete: false, successDelete: true };
//     case "DELETE_FAIL":
//       return { ...state, loadingDelete: false, successDelete: false };
//     case "DELETE_RESET":
//       return { ...state, successDelete: false };

//     default:
//       return state;
//   }
// };

// const AllSiteDpr = () => {
//   const [{ error, dprs, loadingDprs, successDelete, siteIds }, dispatch] =
//     useReducer(reducer, {
//       dprs: [],
//       loading: true,
//       loadingDprs: true,
//       error: "",
//       totalPages: 1,
//       hasNextPage: false,
//       hasPrevPage: false,
//       loadingSiteIds: false,
//       loadingFields: false,
//       siteIds: [],
//     });

//   const authtoken = useSelector((state) => state.authtoken);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [site_id, setSiteId] = useState("all");
//   const [fromDate, setFromDate] = useState(
//     new Date().toISOString().split("T")[0]
//   );
//   const [toDate, setToDate] = useState(new Date().toISOString().split("T")[0]);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedInventory, setSelectedInventory] = useState(null);

//   const [formData, setFormData] = useState({
//     site_id: "",
//     total_running_robots: "",
//     total_failed_robots: "",
//     robots_run_by: "",
//     total_robots: "",
//     comments: "",
//   });

//   useEffect(() => {
//     const fetchSiteIds = async () => {
//       dispatch({ type: "FETCH_SITEID_REQUEST" });
//       try {
//         const result = await axios.get(`/api/v1/sites`, {
//           headers: { Authorization: `Bearer ${authtoken}` },
//         });
//         dispatch({ type: "FETCH_SITEID_SUCCESS", payload: result.data.data });
//       } catch (error) {
//         dispatch({
//           type: "FETCH_SITEID_FAIL",
//           payload: error.response?.data?.error || "Error fetching sites",
//         });
//         toast.error(error.response?.data?.error || "Error fetching sites");
//       }
//     };

//     const fetchDprDates = async () => {
//       dispatch({ type: "FETCH_DPRBYDATE_REQUEST" });
//       try {
//         const payload = {
//           startDate: new Date(fromDate).toISOString().split("T")[0],
//           endDate: new Date(toDate).toISOString().split("T")[0],
//           siteId: site_id,
//         };

//         const result = await axios.post(
//           `/api/v1/techniciandprs/site-date-wise`,
//           payload,
//           { headers: { Authorization: `Bearer ${authtoken}` } }
//         );

//         const dprArray = result.data.data;
//         const totalPages = Math.ceil(
//           Number(result.data.total) / Number(result.data.limit)
//         );
//         const hasNextPage = result.data.hasNextPage;
//         const hasPrevPage = result.data.hasPrevPage;

//         dispatch({
//           type: "FETCH_DPRBYDATE_SUCCESS",
//           payload: {
//             data: Array.isArray(dprArray) ? dprArray : [],
//             totalPages,
//             hasNextPage,
//             hasPrevPage,
//           },
//         });
//       } catch (error) {
//         dispatch({
//           type: "FETCH_DPRBYDATE_FAIL",
//           payload: error.response?.data?.error || "Failed to fetch DPR by Date",
//         });
//         toast.error(
//           error.response?.data?.error || "Failed to fetch DPR by Date"
//         );
//       }
//     };

//     if (successDelete) {
//       dispatch({ type: "DELETE_RESET" });
//     } else {
//       fetchDprDates();
//     }

//     fetchSiteIds();
//   }, [successDelete, authtoken, fromDate, toDate, site_id]);

//   const filteredInventories = Array.isArray(dprs)
//     ? dprs.filter((dpr) =>
//         dpr.site_id?.toLowerCase().includes(searchTerm.toLowerCase())
//       )
//     : [];

//   const openModal = (dpr) => {
//     setSelectedInventory(dpr);
//     setFormData(dpr);
//     setModalVisible(true);
//   };

//   const handleSiteNameChange = (e) => {
//     dispatch({ type: "SELECT_SITENAME_REQUEST" });

//     const selectedSiteName = e.target.value;
//     const selectedSite = siteIds.find(
//       (site) => site.site_id.toString() === selectedSiteName
//     );

//     if (selectedSite) {
//       setSiteId(selectedSite.site_id);
//       dispatch({ type: "SELECT_SITENAME_SUCCESS", payload: selectedSite });
//     } else {
//       dispatch({ type: "SELECT_SITENAME_FAIL" });
//     }
//   };

//   const deleteDpr = async (dpr) => {
//     if (dpr.is_delete) {
//       toast.error("This DPR is already deleted.");
//       return;
//     }
//     if (
//       window.confirm(
//         `Are you sure you want to delete DPR of site - ${dpr.site_id}`
//       )
//     ) {
//       try {
//         await axios.delete(`/api/v1/techniciandprs/${dpr._id}`, {
//           headers: { Authorization: `Bearer ${authtoken}` },
//         });
//         toast.success("DPR deleted successfully");
//         dispatch({ type: "DELETE_SUCCESS" });
//       } catch (err) {
//         toast.error(err.response ? err.response.data.message : err.message);
//         dispatch({ type: "DELETE_FAIL" });
//       }
//     }
//   };

//   const allDates = Array.from(
//     new Set(dprs.flatMap((site) => site.day_wise_data.map((day) => day.date)))
//   );

//   const exportToExcel = () => {
//     if (filteredInventories.length === 0) {
//       toast.error("No data available for export.");
//       return;
//     }

//     const realDates = allDates
//       .filter((d) => !d.toLowerCase().includes("week"))
//       .sort();
//     const weekDates = allDates
//       .filter((d) => d.toLowerCase().includes("week"))
//       .sort();
//     const sortedAllDates = [...realDates, ...weekDates];

//     const allRows = [];
//     filteredInventories.forEach((site) => {
//       const matrixRows = [
//         { label: "Robots Uptime", field: "robots_uptime" },
//         { label: "Robots Availability", field: "robots_availability" },
//         { label: "Due to Oxidation", field: "due_to_oxidation" },
//         { label: "Due to Offline", field: "due_to_offline" },
//         {
//           label: "Battery issue (Battery Backup)",
//           field: "due_to_battery_issue",
//         },
//         { label: "Due to Vegetation", field: "due_to_vegetation" },
//         {
//           label: "Due to Client (abnormality at plant)",
//           field: "due_to_client",
//         },
//         { label: "Due to Service (Tech. absent)", field: "due_to_service" },
//         { label: "Due to Timer", field: "due_to_timer" },
//         { label: "Due to Breakdown", field: "due_to_breakdown" },
//         {
//           label: "Due to material Unavailability",
//           field: "due_to_material_unavailability",
//         },
//       ];
//       matrixRows.forEach((row, idx) => {
//         const dateMap = {};
//         (site.day_wise_data || []).forEach((day) => {
//           dateMap[day.date] = day[row.field];
//         });
//         allRows.push([
//           idx === 0 ? site.site_id : "",
//           row.label,
//           site.total_robots,
//           ...sortedAllDates.map((date) => dateMap[date] ?? ""),
//         ]);
//       });
//     });

//     const topMeta = [[`DPR Report (${fromDate} to ${toDate})`]];
//     const blankRow = [""];
//     const aoa = [...topMeta, blankRow, ...allRows];

//     const worksheet = XLSX.utils.aoa_to_sheet(aoa);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "DPR");
//     XLSX.writeFile(workbook, `DPR_${fromDate}_to_${toDate}.xlsx`);
//   };

//   const userInfo = useSelector((state) => state.userInfo);
//   let adminroute = "";
//   if (userInfo.role === "Master Admin") adminroute = "master-admin";
//   else if (userInfo.role === "Service Admin") adminroute = "service-admin";
//   else if (userInfo.role === "Project Admin") adminroute = "project-admin";
//   else if (userInfo?.role === "Master User") adminroute = "master-user";
//   else if (userInfo?.role === "Service User") adminroute = "service-user";
//   else if (userInfo?.role === "Project User") adminroute = "project-user";

//   // ✅ FIXED here
//   const realDates = allDates
//     .filter((d) => !d.toLowerCase().includes("week"))
//     .sort();
//   const weekDates = allDates
//     .filter((d) => d.toLowerCase().includes("week"))
//     .sort();
//   const sortedAllDates = [...realDates, ...weekDates];

//   return (
//     <div className="p-2">
//       <h2 className="text-center mt-4">Daily Progress Reports</h2>
//       <div className="d-flex justify-content-end mb-3">
//         <Link
//           className="btn btn-sm btn-secondary m-1"
//           to={`/${adminroute}/all-site-dpr/add-dpr`}
//         >
//           Add DPR
//         </Link>
//         <Link className="btn btn-sm btn-primary m-1" onClick={exportToExcel}>
//           Export
//         </Link>
//       </div>
//       {/* Search Input */}
//       <CRow className="justify-content-end mb-3">
//         <CCol md={3} className="m-1">
// <CFormSelect
//   name="site_id"
//   value={site_id}
//   onChange={handleSiteNameChange}
// >
//   <option value="">All</option>
//   {siteIds?.length > 0 &&
//     siteIds.map((item) => (
//       <option key={item.site_id} value={item.site_id}>
//         {item.site_id}
//       </option>
//     ))}
// </CFormSelect>
//         </CCol>
//         <CCol md={3} className="m-1">
//           <CFormInput
//             type="date"
//             value={fromDate}
//             onChange={(e) => setFromDate(e.target.value)}
//           />
//         </CCol>
//         <CCol md={3} className="m-1">
//           <CFormInput
//             type="date"
//             value={toDate}
//             onChange={(e) => setToDate(e.target.value)}
//           />
//         </CCol>
//         <CCol md={4} className="mt-3">
//           <CFormInput
//             type="text"
//             placeholder="Search by Site Id..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </CCol>
//       </CRow>

//       <div style={{ overflowX: "auto", width: "100%", minHeight: "1px" }}>
//         <CTable
//           bordered
//           hover
//           responsive={false}
//           className="text-center shadow-sm mb-4"
//           style={{ minWidth: "1200px", tableLayout: "fixed" }}
//         >
//           <CTableHead color="secondary">
//             <CTableRow>
//               <CTableHeaderCell
//                 rowSpan={2}
//                 style={{
//                   minWidth: "150px",
//                   maxWidth: "150px",
//                   width: "150px",
//                   whiteSpace: "nowrap",
//                   textOverflow: "ellipsis",
//                   overflow: "hidden",
//                   padding: "8px",
//                   fontWeight: "bold",
//                   position: "sticky",
//                   left: 0,
//                   zIndex: 3,
//                 }}
//               >
//                 Site Name
//               </CTableHeaderCell>
//               <CTableHeaderCell
//                 rowSpan={2}
//                 style={{
//                   minWidth: "180px",
//                   maxWidth: "180px",
//                   width: "180px",
//                   whiteSpace: "nowrap",
//                   textOverflow: "ellipsis",
//                   overflow: "hidden",
//                   padding: "8px",
//                   fontWeight: "bold",
//                   position: "sticky",
//                   left: 150,
//                   zIndex: 3,
//                 }}
//               >
//                 Robots Details
//               </CTableHeaderCell>
//               <CTableHeaderCell
//                 rowSpan={2}
//                 style={{
//                   minWidth: "120px",
//                   maxWidth: "120px",
//                   width: "120px",
//                   padding: "8px",
//                   fontWeight: "bold",
//                   textAlign: "center",
//                 }}
//               >
//                 Robots Qty
//               </CTableHeaderCell>
//               {sortedAllDates.map((date) => (
//                 <CTableHeaderCell
//                   key={date}
//                   style={{
//                     minWidth: "100px",
//                     maxWidth: "100px",
//                     width: "100px",
//                     padding: "6px",
//                     fontWeight: "bold",
//                     textAlign: "center",
//                     backgroundColor: date.toLowerCase().includes("week")
//                       ? "#fff200"
//                       : "#f8f9fa",
//                     whiteSpace: "normal",
//                     wordBreak: "break-word",
//                   }}
//                 >
//                   {date}
//                 </CTableHeaderCell>
//               ))}
//             </CTableRow>
//           </CTableHead>

//           <CTableBody>
//             {loadingDprs ? (
//               <CTableRow>
//                 <CTableDataCell colSpan={sortedAllDates.length + 3}>
//                   <LoadingSpinner />
//                 </CTableDataCell>
//               </CTableRow>
//             ) : filteredInventories.length > 0 ? (
//               filteredInventories.map((site) =>
//                 [
//                   { label: "Robots Uptime", field: "robots_uptime" },
//                   {
//                     label: "Robots Availability",
//                     field: "robots_availability",
//                   },
//                   { label: "Due to Oxidation", field: "due_to_oxidation" },
//                   { label: "Due to Offline", field: "due_to_offline" },
//                   {
//                     label: "Battery issue (Battery Backup)",
//                     field: "due_to_battery_issue",
//                   },
//                   { label: "Due to Vegetation", field: "due_to_vegetation" },
//                   {
//                     label: "Due to Client (abnormality at plant)",
//                     field: "due_to_client",
//                   },
//                   {
//                     label: "Due to Service (Tech. absent)",
//                     field: "due_to_service",
//                   },
//                   { label: "Due to Timer", field: "due_to_timer" },
//                   { label: "Due to Breakdown", field: "due_to_breakdown" },
//                   {
//                     label: "Due to material Unavailability",
//                     field: "due_to_material_unavailability",
//                   },
//                 ].map((row, rowIndex, arr) => {
//                   const dateMap = {};
//                   (site.day_wise_data || []).forEach((day) => {
//                     dateMap[day.date] = day[row.field];
//                   });
//                   return (
//                     <CTableRow
//                       key={site.site_id + "-" + row.field}
//                       style={
//                         rowIndex === arr.length - 1
//                           ? { borderBottom: "3px solid white" }
//                           : {}
//                       }
//                     >
//                       {rowIndex === 0 && (
//                         <CTableDataCell
//                           rowSpan={arr.length}
//                           style={{
//                             verticalAlign: "middle",
//                             fontWeight: "bold",
//                             position: "sticky",
//                             left: 0,
//                             zIndex: 2,
//                             minWidth: "150px",
//                             maxWidth: "150px",
//                             width: "150px",
//                             whiteSpace: "nowrap",
//                             overflow: "hidden",
//                             textOverflow: "ellipsis",
//                             padding: "8px",
//                           }}
//                         >
//                           {site.site_id.replace(/_/g, " ")}
//                         </CTableDataCell>
//                       )}
//                       <CTableDataCell
//                         style={{
//                           position: "sticky",
//                           left: 150,
//                           zIndex: 2,
//                           fontWeight: "bold",
//                           minWidth: "180px",
//                           maxWidth: "180px",
//                           width: "180px",
//                           whiteSpace: "nowrap",
//                           overflow: "hidden",
//                           textOverflow: "ellipsis",
//                           padding: "8px",
//                         }}
//                       >
//                         {row.label}
//                       </CTableDataCell>
//                       <CTableDataCell
//                         style={{
//                           minWidth: "120px",
//                           maxWidth: "120px",
//                           width: "120px",
//                           padding: "8px",
//                           textAlign: "center",
//                         }}
//                       >
//                         {site.total_robots}
//                       </CTableDataCell>
//                       {sortedAllDates.map((date) => (
//                         <CTableDataCell
//                           key={date}
//                           style={{
//                             minWidth: "100px",
//                             maxWidth: "100px",
//                             width: "100px",
//                             padding: "8px",
//                             textAlign: "center",
//                             whiteSpace: "nowrap",
//                             overflow: "hidden",
//                             textOverflow: "ellipsis",
//                           }}
//                         >
//                           {dateMap[date] ?? ""}
//                         </CTableDataCell>
//                       ))}
//                     </CTableRow>
//                   );
//                 })
//               )
//             ) : (
//               <CTableRow>
//                 <CTableDataCell
//                   colSpan={sortedAllDates.length + 3}
//                   className="text-center fw-bold"
//                 >
//                   No matching DPR found.
//                 </CTableDataCell>
//               </CTableRow>
//             )}
//           </CTableBody>
//         </CTable>
//       </div>
//       {/* <PaginateInput
//         page={page}
//         totalPages={totalPages}
//         hasPrevPage={hasPrevPage}
//         hasNextPage={hasNextPage}
//         pageInput={pageInput}
//         handlePageChange={handlePageChange}
//         handlePageInputChange={handlePageInputChange}
//         handlePageInputSubmit={handlePageInputSubmit}
//         limit={limit}
//         handleLimitChange={setLimit} // New prop
//       /> */}

//       {/* view Modal */}
//       <CModal
//         size="xl"
//         scrollable
//         visible={modalVisible}
//         onClose={() => setModalVisible(false)}
//       >
//         <CModalHeader closeButton={false}>
//           <CModalTitle>
//             DPR Data :&nbsp;
//             <span className="badge bg-success">{formData.site_id}</span>{" "}
//           </CModalTitle>
//           <button
//             type="button"
//             className=" border-0 ms-auto py-0 px-1"
//             onClick={() => setModalVisible(false)}
//             style={{ background: "none" }}
//           >
//             <CIcon icon={cilX} size="lg" />
//           </button>
//         </CModalHeader>
//         <CModalBody>
//           {selectedInventory && (
//             <>
//               <CTable bordered responsive className="bg-important">
//                 <CTableHead color="secondary">
//                   <CTableRow>
//                     <CTableHeaderCell>Field</CTableHeaderCell>
//                     <CTableHeaderCell>Value</CTableHeaderCell>
//                   </CTableRow>
//                 </CTableHead>
//                 <CTableBody>
//                   {Object.entries(formData)
//                     .filter(([key]) => key !== "last_activity") // Exclude last_activity
//                     .map(([key, value]) => (
//                       <CTableRow key={key}>
//                         <CTableHeaderCell>
//                           {key.replace(/_/g, " ")}
//                         </CTableHeaderCell>
//                         <CTableDataCell>
//                           {Array.isArray(value) ? (
//                             key === "technician_present" ? (
//                               <CTable className=" border-0 bg-important">
//                                 <CTableBody>
//                                   {value.map((tech, index) => {
//                                     return (
//                                       <CTableRow key={index} className="border">
//                                         <CTableDataCell className="border-0">
//                                           {index + 1})
//                                         </CTableDataCell>
//                                         <CTableDataCell className="border-0">
//                                           <CAvatar
//                                             src={tech.profile_image}
//                                             className="me-2"
//                                           />
//                                         </CTableDataCell>
//                                         <CTableDataCell className="border-0">
//                                           {tech.name}
//                                         </CTableDataCell>
//                                         {/* <CTableDataCell className="border-0">
//                                       {tech.technitian_email}
//                                     </CTableDataCell> */}
//                                       </CTableRow>
//                                     );
//                                   })}
//                                 </CTableBody>
//                               </CTable>
//                             ) : (
//                               JSON.stringify(value)
//                             )
//                           ) : (
//                             value?.toString() || "N/A"
//                           )}
//                         </CTableDataCell>
//                       </CTableRow>
//                     ))}
//                 </CTableBody>
//               </CTable>

//               {formData.last_activity && (
//                 <LastActivity lastactivity={formData.last_activity} />
//               )}
//             </>
//           )}
//         </CModalBody>
//       </CModal>
//     </div>
//   );
// };

// export default AllSiteDpr;

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
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CAvatar,
//   CFormSelect,
// } from "@coreui/react";
// import { Link } from "react-router-dom";
// import toast from "react-hot-toast";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import LoadingSpinner from "../../../components/LoadingSpinner";
// import LastActivity from "../../../components/LastActivity";
// import * as XLSX from "xlsx";
// import CIcon from "@coreui/icons-react";
// import { cilX } from "@coreui/icons";

// const reducer = (state, action) => {
//   switch (action.type) {
//     case "FETCH_DPR_REQUEST":
//       return { ...state, loadingDprs: true, error: "" };
//     case "FETCH_DPR_SUCCESS":
//       return { ...state, loadingDprs: false, dprs: action.payload };
//     case "FETCH_DPR_FAIL":
//       return { ...state, loadingDprs: false, error: action.payload };
//     case "FETCH_SITEID_REQUEST":
//       return { ...state, loadingSiteIds: true, sitesError: "" };
//     case "FETCH_SITEID_SUCCESS":
//       return { ...state, loadingSiteIds: false, siteIds: action.payload };
//     case "FETCH_SITEID_FAIL":
//       return { ...state, loadingSiteIds: false, sitesError: action.payload };
//     default:
//       return state;
//   }
// };

// const AllSiteDpr = () => {
//   const [{ dprs, loadingDprs, loadingSiteIds, siteIds, sitesError }, dispatch] =
//     useReducer(reducer, {
//       dprs: [],
//       loadingDprs: true,
//       error: "",
//       siteIds: [],
//       loadingSiteIds: true,
//       sitesError: "",
//     });

//   const authtoken = useSelector((state) => state.authtoken);

//   const [month, setMonth] = useState(new Date().getMonth() + 1);
//   const [year, setYear] = useState(new Date().getFullYear());
//   const [site_id, setSiteId] = useState("all");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedInventory, setSelectedInventory] = useState(null);
//   const [formData, setFormData] = useState({});

//   const fetchDprMonthWise = async () => {
//     dispatch({ type: "FETCH_DPR_REQUEST" });
//     try {
//       const payload = { month, year, siteId: site_id };
//       const result = await axios.post(
//         "/api/v1/techniciandprs/monthly",
//         payload,
//         { headers: { Authorization: `Bearer ${authtoken}` } }
//       );
//       dispatch({ type: "FETCH_DPR_SUCCESS", payload: result.data.data });
//     } catch (error) {
//       dispatch({
//         type: "FETCH_DPR_FAIL",
//         payload: error.response?.data?.error || "Failed to fetch DPR",
//       });
//       toast.error(error.response?.data?.error || "Failed to fetch DPR");
//     }
//   };

//   useEffect(() => {
//     fetchDprMonthWise();
//   }, [month, year, site_id, authtoken]);

//   useEffect(() => {
//     const fetchSiteIds = async () => {
//       dispatch({ type: "FETCH_SITEID_REQUEST" });
//       try {
//         const result = await axios.get(`/api/v1/sites`, {
//           headers: { Authorization: `Bearer ${authtoken}` },
//         });

//         dispatch({ type: "FETCH_SITEID_SUCCESS", payload: result.data.data });
//       } catch (error) {
//         dispatch({
//           type: "FETCH_SITEID_FAIL",
//           payload: error.response?.data?.error || "Error fetching sites",
//         });
//         toast.error(error.response?.data?.error || "Error fetching sites");
//       }
//     };

//     fetchSiteIds();
//   }, [authtoken]);

//   const filteredInventories = dprs.filter((dpr) =>
//     dpr.site_id?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const openModal = (dpr) => {
//     setSelectedInventory(dpr);
//     setFormData(dpr);
//     setModalVisible(true);
//   };

//   const allDates = Array.from(
//     new Set(
//       dprs.flatMap((site) =>
//         site.month_wise_data.map((day) => (day.week ? day.week : day.date))
//       )
//     )
//   );

//   const realDates = allDates.filter((d) => !d.toLowerCase().includes("week"));
//   const weekDates = allDates.filter((d) => d.toLowerCase().includes("week"));
//   // const sortedAllDates = [...realDates, ...weekDates];
//   // Map each date to its week (if any)
//   // Map each date to its week
//   // Map each date to its week
//   const dateToWeekMap = {};
//   dprs.forEach((site) => {
//     site.month_wise_data.forEach((day) => {
//       if (day.date && day.week) {
//         dateToWeekMap[day.date] = day.week;
//       }
//     });
//   });

//   // Get unique dates in order
//   const uniqueDates = Array.from(
//     new Set(dprs.flatMap((site) => site.month_wise_data.map((day) => day.date)))
//   ).sort((a, b) => new Date(a) - new Date(b));

//   // Build sorted dates array, inserting week after last date of that week
//   const sortedAllDates = [];
//   // let currentWeek = null;

//   // Build week headers and date headers
//   const weekHeaders = [];
//   const dateHeaders = [];
//   let currentWeek = null;
//   let weekSpanCount = 0;

//   uniqueDates.forEach((date, idx) => {
//     const week = dateToWeekMap[date] || "";
//     dateHeaders.push(date);

//     if (week !== currentWeek) {
//       // finish previous week
//       if (weekSpanCount > 0) {
//         weekHeaders.push({ week: currentWeek, span: weekSpanCount });
//       }
//       currentWeek = week;
//       weekSpanCount = 1;
//     } else {
//       weekSpanCount++;
//     }

//     // last date, push the current week
//     if (idx === uniqueDates.length - 1 && week) {
//       weekHeaders.push({ week: currentWeek, span: weekSpanCount });
//     }
//   });

//   const exportToExcel = () => {
//     if (!filteredInventories.length) {
//       toast.error("No data to export");
//       return;
//     }

//     const rows = [];
//     filteredInventories.forEach((site) => {
//       const metrics = [
//         { label: "Robots Uptime", field: "robots_uptime" },
//         { label: "Robots Availability", field: "robots_availability" },
//         { label: "Due to Oxidation", field: "due_to_oxidation" },
//         { label: "Due to Offline", field: "due_to_offline" },
//         {
//           label: "Battery issue (Battery Backup)",
//           field: "due_to_battery_issue",
//         },
//         { label: "Due to Vegetation", field: "due_to_vegetation" },
//         { label: "Due to Client", field: "due_to_client" },
//         { label: "Due to Service", field: "due_to_service" },
//         { label: "Due to Timer", field: "due_to_timer" },
//         { label: "Due to Breakdown", field: "due_to_breakdown" },
//         {
//           label: "Due to Material Unavailability",
//           field: "due_to_material_unavailability",
//         },
//       ];

//       metrics.forEach((metric, idx) => {
//         const dateMap = {};
//         site.month_wise_data.forEach((day) => {
//           dateMap[day.date ?? day.week] = day[metric.field];
//         });
//         rows.push([
//           idx === 0 ? site.site_id : "",
//           metric.label,
//           site.total_robots,
//           ...sortedAllDates.map((d) => dateMap[d] ?? ""),
//         ]);
//       });
//     });

//     const aoa = [["DPR Report"], [], ...rows];
//     const worksheet = XLSX.utils.aoa_to_sheet(aoa);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "DPR");
//     XLSX.writeFile(workbook, `DPR_${month}_${year}.xlsx`);
//   };

//   const userInfo = useSelector((state) => state.userInfo);
//   let adminroute = "";
//   if (userInfo.role === "Master Admin") adminroute = "master-admin";
//   else if (userInfo.role === "Service Admin") adminroute = "service-admin";
//   else if (userInfo.role === "Project Admin") adminroute = "project-admin";

//   const handleSiteNameChange = (e) => {
//     dispatch({ type: "SELECT_SITENAME_REQUEST" });

//     const selectedSiteName = e.target.value;
//     const selectedSite = siteIds.find(
//       (site) => site.site_id.toString() === selectedSiteName
//     );

//     if (selectedSite) {
//       setSiteId(selectedSite.site_id);
//       dispatch({ type: "SELECT_SITENAME_SUCCESS", payload: selectedSite });
//     } else {
//       dispatch({ type: "SELECT_SITENAME_FAIL" });
//     }
//   };

//   return (
//     <div className="p-2">
//       <h2 className="text-center mt-4">Monthly DPR</h2>

//       <CRow className="justify-content-end mb-3">
//         <CCol md={3} className="m-1">
//           <CFormSelect
//             name="site_id"
//             value={site_id}
//             onChange={handleSiteNameChange}
//           >
//             <option value="">All</option>
//             {siteIds?.length > 0 &&
//               siteIds.map((item) => (
//                 <option key={item.site_id} value={item.site_id}>
//                   {item.site_id}
//                 </option>
//               ))}
//           </CFormSelect>
//         </CCol>
//         <CCol md={2} className="m-1">
//           <CFormInput
//             type="number"
//             placeholder="Month (1-12)"
//             value={month}
//             onChange={(e) => setMonth(Number(e.target.value))}
//           />
//         </CCol>
//         <CCol md={2} className="m-1">
//           <CFormInput
//             type="number"
//             placeholder="Year"
//             value={year}
//             onChange={(e) => setYear(Number(e.target.value))}
//           />
//         </CCol>
//         <CCol md={3} className="mt-3">
//           <CFormInput
//             type="text"
//             placeholder="Search by Site Id..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </CCol>
//         <CCol md={2} className="mt-3">
//           <button className="btn btn-primary" onClick={exportToExcel}>
//             Export
//           </button>
//         </CCol>
//       </CRow>

//       <div style={{ overflowX: "auto" }}>
//         <CTable bordered hover responsive style={{ minWidth: "1200px" }}>
//           <CTableHead color="secondary">
//             <CTableRow>
//               <CTableHeaderCell rowSpan={2}>Site Name</CTableHeaderCell>
//               <CTableHeaderCell rowSpan={2}>Robots Details</CTableHeaderCell>
//               <CTableHeaderCell rowSpan={2}>Robots Qty</CTableHeaderCell>
//               {weekHeaders.map((w, idx) => (
//                 <CTableHeaderCell
//                   key={idx}
//                   colSpan={w.span}
//                   style={{ backgroundColor: "#fff200" }}
//                 >
//                   {w.week}
//                 </CTableHeaderCell>
//               ))}
//             </CTableRow>
//             <CTableRow>
//               {dateHeaders.map((date, idx) => (
//                 <CTableHeaderCell key={idx}>{date}</CTableHeaderCell>
//               ))}
//             </CTableRow>
//           </CTableHead>

//           <CTableBody>
//             {loadingDprs ? (
//               <CTableRow>
//                 <CTableDataCell colSpan={sortedAllDates.length + 3}>
//                   <LoadingSpinner />
//                 </CTableDataCell>
//               </CTableRow>
//             ) : filteredInventories.length ? (
//               filteredInventories.map((site) => {
//                 const metrics = [
//                   { label: "Robots Uptime", field: "robots_uptime" },
//                   {
//                     label: "Robots Availability",
//                     field: "robots_availability",
//                   },
//                   { label: "Due to Oxidation", field: "due_to_oxidation" },
//                   { label: "Due to Offline", field: "due_to_offline" },
//                   { label: "Battery issue", field: "due_to_battery_issue" },
//                   { label: "Due to Vegetation", field: "due_to_vegetation" },
//                   { label: "Due to Client", field: "due_to_client" },
//                   { label: "Due to Service", field: "due_to_service" },
//                   { label: "Due to Timer", field: "due_to_timer" },
//                   { label: "Due to Breakdown", field: "due_to_breakdown" },
//                   {
//                     label: "Material Unavailability",
//                     field: "due_to_material_unavailability",
//                   },
//                 ];

//                 return metrics.map((row, rowIndex, arr) => {
//                   const dateMap = {};
//                   site.month_wise_data.forEach((day) => {
//                     dateMap[day.date ?? day.week] = day[row.field];
//                   });

//                   return (
//                     <CTableRow key={site.site_id + "-" + row.field}>
//                       {rowIndex === 0 && (
//                         <CTableDataCell rowSpan={arr.length}>
//                           {site.site_id}
//                         </CTableDataCell>
//                       )}
//                       <CTableDataCell>{row.label}</CTableDataCell>
//                       <CTableDataCell>{site.total_robots}</CTableDataCell>
//                       {sortedAllDates.map((d) => (
//                         <CTableDataCell key={d}>
//                           {dateMap[d] ?? ""}
//                         </CTableDataCell>
//                       ))}
//                     </CTableRow>
//                   );
//                 });
//               })
//             ) : (
//               <CTableRow>
//                 <CTableDataCell colSpan={sortedAllDates.length + 3}>
//                   No Data Found
//                 </CTableDataCell>
//               </CTableRow>
//             )}
//           </CTableBody>
//         </CTable>
//       </div>

//       <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
//         <CModalHeader>
//           <CModalTitle>DPR Details</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           {selectedInventory && (
//             <pre>{JSON.stringify(selectedInventory, null, 2)}</pre>
//           )}
//         </CModalBody>
//       </CModal>
//     </div>
//   );
// };

// export default AllSiteDpr;

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
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CFormSelect,
} from "@coreui/react";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import LoadingSpinner from "../../../components/LoadingSpinner";
import * as XLSX from "xlsx";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_DPR_REQUEST":
      return { ...state, loadingDprs: true, error: "" };
    case "FETCH_DPR_SUCCESS":
      return { ...state, loadingDprs: false, dprs: action.payload };
    case "FETCH_DPR_FAIL":
      return { ...state, loadingDprs: false, error: action.payload };
    case "FETCH_SITEID_REQUEST":
      return { ...state, loadingSiteIds: true, sitesError: "" };
    case "FETCH_SITEID_SUCCESS":
      return { ...state, loadingSiteIds: false, siteIds: action.payload };
    case "FETCH_SITEID_FAIL":
      return { ...state, loadingSiteIds: false, sitesError: action.payload };
    default:
      return state;
  }
};

const AllSiteDpr = () => {
  const [{ dprs, loadingDprs, siteIds }, dispatch] = useReducer(reducer, {
    dprs: [],
    loadingDprs: true,
    error: "",
    siteIds: [],
    loadingSiteIds: true,
    sitesError: "",
  });

  const authtoken = useSelector((state) => state.authtoken);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [site_id, setSiteId] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState(null);

  const fetchDprMonthWise = async () => {
    dispatch({ type: "FETCH_DPR_REQUEST" });
    try {
      const payload = { month, year, siteId: site_id };
      const result = await axios.post(
        "/api/v1/techniciandprs/monthly",
        payload,
        {
          headers: { Authorization: `Bearer ${authtoken}` },
        }
      );
      dispatch({ type: "FETCH_DPR_SUCCESS", payload: result.data.data });
    } catch (error) {
      dispatch({
        type: "FETCH_DPR_FAIL",
        payload: error.response?.data?.error || "Failed to fetch DPR",
      });
      toast.error(error.response?.data?.error || "Failed to fetch DPR");
    }
  };

  const fetchSiteIds = async () => {
    dispatch({ type: "FETCH_SITEID_REQUEST" });
    try {
      const result = await axios.get("/api/v1/sites", {
        headers: { Authorization: `Bearer ${authtoken}` },
      });
      dispatch({ type: "FETCH_SITEID_SUCCESS", payload: result.data.data });
    } catch (error) {
      dispatch({
        type: "FETCH_SITEID_FAIL",
        payload: error.response?.data?.error || "Error fetching sites",
      });
      toast.error(error.response?.data?.error || "Error fetching sites");
    }
  };

  useEffect(() => {
    fetchDprMonthWise();
  }, [month, year, site_id, authtoken]);

  useEffect(() => {
    fetchSiteIds();
  }, [authtoken]);

  const filteredInventories = dprs.filter((dpr) =>
    dpr.site_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (dpr) => {
    setSelectedInventory(dpr);
    setModalVisible(true);
  };

  // Map dates to weeks
  const dateToWeekMap = {};
  dprs.forEach((site) => {
    site.month_wise_data.forEach((day) => {
      if (day.date && day.week) dateToWeekMap[day.date] = day.week;
    });
  });
  // Get all columns in order from API, preserving weeks in proper positions
  const sortedAllDates = Array.from(
    new Set(
      dprs.flatMap((site) =>
        site.month_wise_data.map((day) => day.date ?? day.week)
      )
    )
  );

  // Separate week headers and date headers
  const weekHeaders = [];
  const dateHeaders = [];

  let currentWeek = null;
  let weekSpanCount = 0;

  sortedAllDates.forEach((item, idx) => {
    const isWeek = item.toLowerCase().includes("week");

    dateHeaders.push(isWeek ? "" : item);

    if (isWeek) {
      if (weekSpanCount > 0) {
        weekHeaders.push({ week: currentWeek, span: weekSpanCount });
      }
      currentWeek = item;
      weekSpanCount = 0;
    } else {
      weekSpanCount++;
    }

    if (idx === sortedAllDates.length - 1 && currentWeek) {
      weekHeaders.push({ week: currentWeek, span: weekSpanCount });
    }
  });

  // Excel export
  const exportToExcel = () => {
    if (!filteredInventories.length) {
      toast.error("No data to export");
      return;
    }

    const sortedAllDates = dateHeaders;

    const rows = [];
    filteredInventories.forEach((site) => {
      const metrics = [
        { label: "Robots Uptime", field: "robots_uptime" },
        { label: "Robots Availability", field: "robots_availability" },
        { label: "Due to Oxidation", field: "due_to_oxidation" },
        { label: "Due to Offline", field: "due_to_offline" },
        { label: "Battery issue", field: "due_to_battery_issue" },
        { label: "Due to Vegetation", field: "due_to_vegetation" },
        { label: "Due to Client", field: "due_to_client" },
        { label: "Due to Service", field: "due_to_service" },
        { label: "Due to Timer", field: "due_to_timer" },
        { label: "Due to Breakdown", field: "due_to_breakdown" },
        {
          label: "Material Unavailability",
          field: "due_to_material_unavailability",
        },
      ];

      metrics.forEach((metric, idx) => {
        const dateMap = {};
        site.month_wise_data.forEach((day) => {
          dateMap[day.date ?? day.week] = day[metric.field];
        });
        rows.push([
          idx === 0 ? site.site_id : "",
          metric.label,
          site.total_robots,
          ...sortedAllDates.map((d) => dateMap[d] ?? ""),
        ]);
      });
    });

    const aoa = [["DPR Report"], [], ...rows];
    const worksheet = XLSX.utils.aoa_to_sheet(aoa);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DPR");
    XLSX.writeFile(workbook, `DPR_${month}_${year}.xlsx`);
  };

  return (
    <div className="p-2">
      <h2 className="text-center mt-4">Monthly DPR</h2>

      <CRow className="justify-content-end mb-3">
        <CCol md={3} className="m-1">
          <CFormSelect
            value={site_id}
            onChange={(e) => setSiteId(e.target.value)}
          >
            <option value="all">All</option>
            {siteIds?.map((item) => (
              <option key={item.site_id} value={item.site_id}>
                {item.site_id}
              </option>
            ))}
          </CFormSelect>
        </CCol>
        <CCol md={2} className="m-1">
          <CFormInput
            type="number"
            placeholder="Month"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
          />
        </CCol>
        <CCol md={2} className="m-1">
          <CFormInput
            type="number"
            placeholder="Year"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          />
        </CCol>
        <CCol md={3} className="mt-3">
          <CFormInput
            type="text"
            placeholder="Search by Site Id..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CCol>
        <CCol md={2} className="mt-3">
          <button className="btn btn-primary" onClick={exportToExcel}>
            Export
          </button>
        </CCol>
      </CRow>

      <div style={{ overflowX: "auto" }}>
        <CTable bordered hover responsive style={{ minWidth: "1200px" }}>
          <CTableHead color="secondary">
            <CTableRow>
              <CTableHeaderCell rowSpan={2}>Site Name</CTableHeaderCell>
              <CTableHeaderCell rowSpan={2}>Robots Details</CTableHeaderCell>
              <CTableHeaderCell rowSpan={2}>Robots Qty</CTableHeaderCell>
              {weekHeaders.map((w, idx) => (
                <CTableHeaderCell
                  key={idx}
                  colSpan={w.span}
                  style={{ backgroundColor: "#fff200" }}
                >
                  {w.week}
                </CTableHeaderCell>
              ))}
            </CTableRow>
            <CTableRow>
              {dateHeaders.map((date, idx) => (
                <CTableHeaderCell key={idx}>{date}</CTableHeaderCell>
              ))}
            </CTableRow>
          </CTableHead>

          <CTableBody>
            {filteredInventories.map((site, idx) => (
              <CTableRow key={idx}>
                <CTableDataCell>{site.site_id}</CTableDataCell>
                <CTableDataCell>{site.robots_details}</CTableDataCell>
                <CTableDataCell>{site.total_robots}</CTableDataCell>
                {dateHeaders.map((date, idy) => {
                  const dayData = site.month_wise_data.find(
                    (d) => d.date === date
                  );
                  return (
                    <CTableDataCell key={idy}>
                      {dayData ? dayData.robots_uptime : ""}
                    </CTableDataCell>
                  );
                })}
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </div>

      <CModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        size="lg"
      >
        <CModalHeader>
          <CModalTitle>Inventory Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <pre>{JSON.stringify(selectedInventory, null, 2)}</pre>
        </CModalBody>
      </CModal>

      {loadingDprs && <LoadingSpinner />}
    </div>
  );
};

export default AllSiteDpr;
