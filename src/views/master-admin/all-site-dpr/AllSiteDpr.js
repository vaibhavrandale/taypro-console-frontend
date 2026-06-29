// import React, { useEffect, useReducer, useState } from "react";
// import {
//   CTable,
//   CTableHead,
//   CTableRow,
//   CTableHeaderCell,
//   CTableBody,
//   CTableDataCell,
//   CRow,
//   CCol,
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CFormSelect,
//   CButton,
//   CModalFooter,
//   CBadge,
// } from "@coreui/react";
// import { Link } from "react-router-dom";
// import toast from "react-hot-toast";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import LoadingSpinner from "../../../components/LoadingSpinner";
// import * as XLSX from "xlsx";
// import CIcon from "@coreui/icons-react";
// import { cilX } from "@coreui/icons";

// // ─── All metric definitions in one place ─────────────────────────────────────
// const METRICS = [
//   // Operational
//   { label: "Robots Uptime (%)", field: "robots_uptime", group: "Operational" },
//   {
//     label: "Robots Availability",
//     field: "robots_availability",
//     group: "Operational",
//   },
//   {
//     label: "Online Operational",
//     field: "online_operational",
//     group: "Operational",
//   },
//   {
//     label: "Manual Operational",
//     field: "manual_operational",
//     group: "Operational",
//   },
//   { label: "Unoperational", field: "unoperational", group: "Operational" },
//   {
//     label: "Running Robots",
//     field: "total_running_robots",
//     group: "Operational",
//   },
//   {
//     label: "Failed Robots",
//     field: "total_failed_robots",
//     group: "Operational",
//   },
//   // Breakdown reasons
//   { label: "Oxidation", field: "due_to_oxidation", group: "Breakdown" },
//   { label: "Offline", field: "due_to_offline", group: "Breakdown" },
//   {
//     label: "Transit Online→Offline",
//     field: "due_to_transit",
//     group: "Breakdown",
//   },
//   { label: "Battery Dead", field: "due_to_battery_issue", group: "Breakdown" },
//   { label: "Vegetation", field: "due_to_vegetation", group: "Breakdown" },
//   { label: "Client Reasons", field: "due_to_client", group: "Breakdown" },
//   { label: "Service Reasons", field: "due_to_service", group: "Breakdown" },
//   { label: "Timer", field: "due_to_timer", group: "Breakdown" },
//   { label: "Breakdown", field: "due_to_breakdown", group: "Breakdown" },
//   {
//     label: "Material Unavailability",
//     field: "due_to_material_unavailability",
//     group: "Breakdown",
//   },
//   // Preventive Maintenance
//   { label: "PM Auto Attempted", field: "pm_automatic_attempted", group: "PM" },
//   { label: "PM Auto Completed", field: "pm_automatic_completed", group: "PM" },
//   {
//     label: "PM Semi-Auto Attempted",
//     field: "pm_semi_auto_attempted",
//     group: "PM",
//   },
//   {
//     label: "PM Semi-Auto Completed",
//     field: "pm_semi_auto_completed",
//     group: "PM",
//   },
//   { label: "Total PM Done", field: "total_pm_done", group: "PM" },
//   // Tickets
//   { label: "Tickets Raised", field: "tickets_raised", group: "Tickets" },
//   { label: "Tickets Closed", field: "tickets_closed", group: "Tickets" },
//   { label: "Tickets Pending", field: "tickets_pending", group: "Tickets" },
// ];

// // Group colour accents (light tints for the sticky label column)
// const GROUP_COLORS = {
//   Operational: "#e8f4fd",
//   Breakdown: "#fdf0e8",
//   PM: "#edf7ed",
//   Tickets: "#f9f0fd",
// };

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
//   const [{ dprs, loadingDprs, loadingSiteIds, siteIds }, dispatch] = useReducer(
//     reducer,
//     {
//       dprs: [],
//       loadingDprs: true,
//       error: "",
//       siteIds: [],
//       loadingSiteIds: true,
//       sitesError: "",
//     },
//   );

//   // const authtoken = useSelector((state) => state.authtoken);
//   const userInfo = useSelector((state) => state.userInfo);

//   const [month, setMonth] = useState(new Date().getMonth() + 1);
//   const [year, setYear] = useState(new Date().getFullYear());
//   const [site_id, setSiteId] = useState("all");
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedSite, setSelectedSite] = useState(null);

//   let adminroute = "";
//   if (userInfo.role === "Master Admin") adminroute = "master-admin";
//   else if (userInfo.role === "Service Admin") adminroute = "service-admin";
//   else if (userInfo.role === "Project Admin") adminroute = "project-admin";

//   // ─── Fetch DPR data ──────────────────────────────────────────────────────────
//   const fetchDprMonthWise = async () => {
//     dispatch({ type: "FETCH_DPR_REQUEST" });
//     try {
//       const result = await axios.post(
//         "/api/v1/techniciandprs/monthly",
//         { month, year, siteId: site_id },
//         {
//           //  headers: { Authorization: `Bearer ${authtoken}` }
//           withCredentials: true,
//         },
//       );
//       dispatch({ type: "FETCH_DPR_SUCCESS", payload: result.data.data });
//     } catch (err) {
//       const msg = err.response?.data?.error || "Failed to fetch DPR";
//       dispatch({ type: "FETCH_DPR_FAIL", payload: msg });
//       toast.error(msg);
//     }
//   };

//   useEffect(() => {
//     fetchDprMonthWise();
//   }, [month, year, site_id]); // eslint-disable-line

//   useEffect(() => {
//     const fetchSiteIds = async () => {
//       dispatch({ type: "FETCH_SITEID_REQUEST" });
//       try {
//         const result = await axios.get("/api/v1/sites", {
//           // headers: { Authorization: `Bearer ${authtoken}` },
//           withCredentials: true,
//         });
//         dispatch({ type: "FETCH_SITEID_SUCCESS", payload: result.data.data });
//       } catch (err) {
//         const msg = err.response?.data?.error || err.response?.data?.message;
//         dispatch({ type: "FETCH_SITEID_FAIL", payload: msg });
//         toast.error(msg);
//       }
//     };
//     fetchSiteIds();
//   }, []);

//   // ─── FIX 3: derive headers DIRECTLY from backend order ──────────────────────
//   // The backend already emits month_wise_data in the correct order with week
//   // summaries inserted at the right positions.  We just read that order instead
//   // of recomputing week numbers in the frontend (which caused a key mismatch).
//   const buildHeaders = () => {
//     if (!dprs.length) return [];
//     return dprs[0].month_wise_data.map((entry) => ({
//       key: entry.date || entry.week, // exact key used in entryMap
//       type: entry.date ? "date" : "week",
//       value: entry.date || entry.week,
//     }));
//   };

//   const headers = buildHeaders();

//   // ─── Build per-site entry map ────────────────────────────────────────────────
//   const buildEntryMap = (monthWiseData) => {
//     const map = {};
//     for (const entry of monthWiseData) {
//       const key = entry.date || entry.week;
//       for (const { field } of METRICS) {
//         if (!map[field]) map[field] = {};
//         map[field][key] = entry[field] ?? "";
//       }
//     }
//     return map;
//   };

//   // ─── Export ──────────────────────────────────────────────────────────────────
//   const exportToExcel = () => {
//     if (!dprs.length) {
//       toast.error("No data to export");
//       return;
//     }

//     const headerRow = [
//       "Sr No.",
//       "Site Name",
//       "Robots Details",
//       "Robots Qty",
//       ...headers.map((h) => h.value),
//     ];

//     const dataRows = [];
//     dprs.forEach((site, si) => {
//       const entryMap = buildEntryMap(site.month_wise_data);
//       METRICS.forEach((metric, ri) => {
//         dataRows.push([
//           ri === 0 ? si + 1 : "",
//           ri === 0 ? site.site_id : "",
//           metric.label,
//           ri === 0 ? site.total_robots : "", // ← FIX 2 applied in export too
//           ...headers.map((h) => entryMap[metric.field]?.[h.key] ?? ""),
//         ]);
//       });
//     });

//     const aoa = [["DPR Report"], [], headerRow, ...dataRows];
//     const ws = XLSX.utils.aoa_to_sheet(aoa);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "DPR");
//     XLSX.writeFile(wb, `DPR_${month}_${year}.xlsx`);
//   };

//   // ─── Helpers ─────────────────────────────────────────────────────────────────
//   const MONTH_NAMES = [
//     "",
//     "Jan",
//     "Feb",
//     "Mar",
//     "Apr",
//     "May",
//     "Jun",
//     "Jul",
//     "Aug",
//     "Sep",
//     "Oct",
//     "Nov",
//     "Dec",
//   ];

//   // ─── Render ──────────────────────────────────────────────────────────────────
//   return (
//     <div className="p-2">
//       <h2 className="text-center mb-4">Monthly DPR</h2>

//       {/* ── Toolbar ── */}
//       <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
//         <div className="d-flex gap-2">
//           <Link
//             className="btn btn-sm btn-secondary"
//             to={`/${adminroute}/all-site-dpr/add-dpr`}
//           >
//             Add DPR
//           </Link>
//           <button className="btn btn-sm btn-primary" onClick={exportToExcel}>
//             Export
//           </button>
//         </div>

//         <CRow className="g-2 align-items-center">
//           <CCol xs="auto">
//             <CFormSelect
//               size="sm"
//               value={site_id}
//               onChange={(e) => setSiteId(e.target.value)}
//               style={{ minWidth: 120 }}
//             >
//               {loadingSiteIds ? (
//                 <option>Loading…</option>
//               ) : (
//                 <>
//                   <option value="all">All Sites</option>
//                   {siteIds?.map((s) => (
//                     <option key={s.site_id} value={s.site_id}>
//                       {s.site_id}
//                     </option>
//                   ))}
//                 </>
//               )}
//             </CFormSelect>
//           </CCol>
//           <CCol xs="auto">
//             <CFormSelect
//               size="sm"
//               value={month}
//               onChange={(e) => setMonth(Number(e.target.value))}
//             >
//               {MONTH_NAMES.slice(1).map((name, i) => (
//                 <option key={i + 1} value={i + 1}>
//                   {name}
//                 </option>
//               ))}
//             </CFormSelect>
//           </CCol>
//           <CCol xs="auto">
//             <CFormSelect
//               size="sm"
//               value={year}
//               onChange={(e) => setYear(Number(e.target.value))}
//             >
//               {Array.from({ length: 10 }, (_, i) => {
//                 const y = new Date().getFullYear() - i;
//                 return (
//                   <option key={y} value={y}>
//                     {y}
//                   </option>
//                 );
//               })}
//             </CFormSelect>
//           </CCol>
//         </CRow>
//       </div>

//       {/* ── Table ── */}
//       <div style={{ overflowX: "auto", overflowY: "auto", maxHeight: "75vh" }}>
//         <CTable bordered hover style={{ minWidth: "1400px", marginBottom: 0 }}>
//           {/* ── Single header row (rowSpan removed from Action — FIX 4) ── */}
//           <CTableHead
//             color="secondary"
//             style={{ position: "sticky", top: 0, zIndex: 10 }}
//           >
//             <CTableRow>
//               {/* Fixed left columns */}
//               <CTableHeaderCell style={{ ...stickyCell(0), minWidth: 40 }}>
//                 Sr.
//               </CTableHeaderCell>
//               <CTableHeaderCell style={{ ...stickyCell(40), minWidth: 110 }}>
//                 Site
//               </CTableHeaderCell>
//               <CTableHeaderCell style={{ ...stickyCell(150), minWidth: 170 }}>
//                 Metric
//               </CTableHeaderCell>
//               <CTableHeaderCell
//                 style={{
//                   ...stickyCell(320),
//                   minWidth: 70,
//                   textAlign: "center",
//                 }}
//               >
//                 Qty
//               </CTableHeaderCell>

//               {/* Date / Week columns */}
//               {headers.map((h, idx) => (
//                 <CTableHeaderCell
//                   key={idx}
//                   style={{
//                     minWidth: h.type === "week" ? 80 : 70,
//                     textAlign: "center",
//                     background: h.type === "week" ? "#fff200" : "#e9ecef",
//                     fontWeight: h.type === "week" ? 700 : 500,
//                     // fontSize: h.type === "week" ? "0.75rem" : "0.7rem",
//                     whiteSpace: "nowrap",
//                     position: "sticky",
//                     top: 0,
//                     zIndex: 5,
//                   }}
//                 >
//                   {h.type === "date"
//                     ? h.value.slice(0, 2) // show "DD-MM" only
//                     : h.value}
//                 </CTableHeaderCell>
//               ))}

//               <CTableHeaderCell
//                 style={{
//                   minWidth: 70,
//                   textAlign: "center",
//                   position: "sticky",
//                   top: 0,
//                   zIndex: 5,
//                   background: "#e9ecef",
//                 }}
//               >
//                 Action
//               </CTableHeaderCell>
//             </CTableRow>
//           </CTableHead>

//           <CTableBody>
//             {loadingDprs ? (
//               <CTableRow>
//                 <CTableDataCell colSpan={headers.length + 5}>
//                   <LoadingSpinner />
//                 </CTableDataCell>
//               </CTableRow>
//             ) : dprs.length ? (
//               dprs.map((site, siteIndex) => {
//                 const entryMap = buildEntryMap(site.month_wise_data);

//                 return METRICS.map((row, rowIndex, arr) => {
//                   const isFirst = rowIndex === 0;
//                   const isLast = rowIndex === arr.length - 1;
//                   // const groupBg = GROUP_COLORS[row.group] || "#fff";

//                   return (
//                     <CTableRow
//                       key={`${site.site_id}-${row.field}`}
//                       style={isLast ? { borderBottom: "3px solid #aaa" } : {}}
//                     >
//                       {/* Sr — rowSpan for whole site block */}
//                       {isFirst && (
//                         <CTableDataCell
//                           rowSpan={arr.length}
//                           style={{
//                             ...stickyCell(0, "#fff"),
//                             textAlign: "center",
//                             verticalAlign: "middle",
//                             fontWeight: 600,
//                           }}
//                         >
//                           {siteIndex + 1}
//                         </CTableDataCell>
//                       )}

//                       {/* Site ID */}
//                       {isFirst && (
//                         <CTableDataCell
//                           rowSpan={arr.length}
//                           style={{
//                             ...stickyCell(40, "#fff"),
//                             verticalAlign: "middle",
//                             fontWeight: 600,
//                           }}
//                         >
//                           {site.site_id}
//                         </CTableDataCell>
//                       )}

//                       {/* Metric label */}
//                       <CTableDataCell
//                         style={{
//                           ...stickyCell(150),
//                           // fontSize: "0.75rem",
//                           whiteSpace: "nowrap",
//                           borderRight: "2px solid #ccc",
//                         }}
//                       >
//                         <span
//                           style={{
//                             display: "inline-block",
//                             width: 8,
//                             height: 8,
//                             borderRadius: "50%",
//                             background: groupDot(row.group),
//                             marginRight: 5,
//                           }}
//                         />
//                         {row.label}
//                       </CTableDataCell>

//                       {/* ── FIX 2: Robots Qty only in first row with rowSpan ── */}
//                       {isFirst && (
//                         <CTableDataCell
//                           rowSpan={arr.length}
//                           style={{
//                             ...stickyCell(320, "#fff"),
//                             textAlign: "center",
//                             verticalAlign: "middle",
//                             fontWeight: 600,
//                           }}
//                         >
//                           {site.total_robots}
//                         </CTableDataCell>
//                       )}

//                       {/* Data cells */}
//                       {headers.map((h) => {
//                         // console.log(entryMap);
//                         // const val = entryMap[row.field]?.[h.key];
//                         // const isEmpty =
//                         //   val === "" || val === undefined || val === null;
//                         const entry = site.month_wise_data.find(
//                           (item) => (item.date || item.week) === h.key,
//                         );

//                         const val = entryMap[row.field]?.[h.key];

//                         const dprId = entry?._id;

//                         const isEmpty =
//                           val === "" || val === undefined || val === null;

//                         return (
//                           <CTableDataCell
//                             key={h.key}
//                             style={{
//                               textAlign: "center",
//                               minWidth: h.type === "week" ? 80 : 70,
//                               background:
//                                 h.type === "week"
//                                   ? "rgba(255,242,0,0.25)"
//                                   : "transparent",
//                               color: isEmpty ? "#ccc" : undefined,
//                               fontWeight: h.type === "week" ? 600 : 400,
//                             }}
//                           >
//                             {dprId ? (
//                               <Link to={`/${adminroute}/update-dpr/${dprId}`}>
//                                 {isEmpty ? "–" : val}
//                               </Link>
//                             ) : isEmpty ? (
//                               "–"
//                             ) : (
//                               val
//                             )}
//                           </CTableDataCell>
//                         );
//                       })}

//                       {/* Action */}
//                       {isFirst && (
//                         <CTableDataCell
//                           rowSpan={arr.length}
//                           style={{
//                             textAlign: "center",
//                             verticalAlign: "middle",
//                           }}
//                         >
//                           <button
//                             className="btn btn-outline-primary btn-sm"
//                             onClick={() => {
//                               setSelectedSite(site);
//                               setModalVisible(true);
//                             }}
//                           >
//                             View
//                           </button>
//                         </CTableDataCell>
//                       )}
//                     </CTableRow>
//                   );
//                 });
//               })
//             ) : (
//               <CTableRow>
//                 <CTableDataCell
//                   colSpan={headers.length + 5}
//                   className="text-center py-4 text-muted"
//                 >
//                   No Data Found
//                 </CTableDataCell>
//               </CTableRow>
//             )}
//           </CTableBody>
//         </CTable>
//       </div>

//       {/* ── Detail Modal ── */}
//       <CModal
//         visible={modalVisible}
//         onClose={() => setModalVisible(false)}
//         size="xl"
//       >
//         <CModalHeader closeButton={false}>
//           <CModalTitle>
//             DPR Details —{" "}
//             <CBadge color="success">{selectedSite?.site_id}</CBadge>
//           </CModalTitle>
//           <button
//             type="button"
//             className="border-0 ms-auto py-0 px-1"
//             onClick={() => setModalVisible(false)}
//             style={{ background: "none" }}
//           >
//             <CIcon icon={cilX} size="lg" />
//           </button>
//         </CModalHeader>

//         <CModalBody>
//           {selectedSite && (
//             <>
//               <div className="d-flex gap-4 mb-3">
//                 <p className="mb-0">
//                   <strong>Site ID:</strong> {selectedSite.site_id}
//                 </p>
//                 <p className="mb-0">
//                   <strong>Total Robots:</strong>{" "}
//                   <CBadge color="warning">{selectedSite.total_robots}</CBadge>
//                 </p>
//               </div>

//               <div
//                 style={{
//                   overflowX: "auto",
//                   maxHeight: "55vh",
//                   overflowY: "auto",
//                 }}
//               >
//                 <CTable striped bordered small>
//                   <CTableHead
//                     color="dark"
//                     style={{ position: "sticky", top: 0 }}
//                   >
//                     <CTableRow>
//                       <CTableHeaderCell style={{ minWidth: 120 }}>
//                         Metric
//                       </CTableHeaderCell>
//                       {selectedSite.month_wise_data.map((entry, i) => (
//                         <CTableHeaderCell
//                           key={i}
//                           style={{
//                             minWidth: 70,
//                             textAlign: "center",
//                             background: entry.week ? "#fff200" : undefined,
//                             color: entry.week ? "#333" : undefined,
//                           }}
//                         >
//                           {entry.date ? entry.date.slice(0, 5) : entry.week}
//                         </CTableHeaderCell>
//                       ))}
//                     </CTableRow>
//                   </CTableHead>
//                   <CTableBody>
//                     {METRICS.map((metric) => (
//                       <CTableRow key={metric.field}>
//                         <CTableDataCell
//                           style={{
//                             // background: GROUP_COLORS[metric.group],
//                             fontWeight: 500,
//                             whiteSpace: "nowrap",
//                           }}
//                         >
//                           {metric.label}
//                         </CTableDataCell>
//                         {selectedSite.month_wise_data.map((entry, i) => {
//                           const val = entry[metric.field];
//                           return (
//                             <CTableDataCell
//                               key={i}
//                               style={{
//                                 textAlign: "center",
//                                 background: entry.week
//                                   ? "rgba(255,242,0,0.2)"
//                                   : undefined,
//                                 fontWeight: entry.week ? 600 : 400,
//                               }}
//                             >
//                               {val !== undefined && val !== "" ? val : "–"}
//                             </CTableDataCell>
//                           );
//                         })}
//                       </CTableRow>
//                     ))}
//                   </CTableBody>
//                 </CTable>
//               </div>
//             </>
//           )}
//         </CModalBody>

//         <CModalFooter>
//           <CButton
//             size="sm"
//             color="secondary"
//             onClick={() => setModalVisible(false)}
//           >
//             Close
//           </CButton>
//         </CModalFooter>
//       </CModal>
//     </div>
//   );
// };

// // ─── Style helpers ────────────────────────────────────────────────────────────
// const stickyCell = (left) => ({
//   position: "sticky",
//   left,
//   zIndex: 4,
// });

// const groupDot = (group) =>
//   ({
//     Operational: "#3b82f6",
//     Breakdown: "#f97316",
//     PM: "#22c55e",
//     Tickets: "#a855f7",
//   })[group] || "#999";

// export default AllSiteDpr;

import React, { useEffect, useReducer, useState } from "react";
import { CFormInput, CInputGroup, CInputGroupText } from "@coreui/react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";
// import * as XLSX from "xlsx";
import CIcon from "@coreui/icons-react";
import { cilPlus, cilSearch } from "@coreui/icons";
import DPRCard from "./DPRCard";
import SiteSelect from "../../../components/SiteSelect";

// // ─── All metric definitions in one place ─────────────────────────────────────
// const METRICS = [
//   // Operational
//   { label: "Robots Uptime (%)", field: "robots_uptime", group: "Operational" },
//   {
//     label: "Robots Availability",
//     field: "robots_availability",
//     group: "Operational",
//   },
//   {
//     label: "Online Operational",
//     field: "online_operational",
//     group: "Operational",
//   },
//   {
//     label: "Manual Operational",
//     field: "manual_operational",
//     group: "Operational",
//   },
//   { label: "Unoperational", field: "unoperational", group: "Operational" },
//   {
//     label: "Running Robots",
//     field: "total_running_robots",
//     group: "Operational",
//   },
//   {
//     label: "Failed Robots",
//     field: "total_failed_robots",
//     group: "Operational",
//   },
//   // Breakdown reasons
//   { label: "Oxidation", field: "due_to_oxidation", group: "Breakdown" },
//   { label: "Offline", field: "due_to_offline", group: "Breakdown" },
//   {
//     label: "Transit Online→Offline",
//     field: "due_to_transit",
//     group: "Breakdown",
//   },
//   { label: "Battery Dead", field: "due_to_battery_issue", group: "Breakdown" },
//   { label: "Vegetation", field: "due_to_vegetation", group: "Breakdown" },
//   { label: "Client Reasons", field: "due_to_client", group: "Breakdown" },
//   { label: "Service Reasons", field: "due_to_service", group: "Breakdown" },
//   { label: "Timer", field: "due_to_timer", group: "Breakdown" },
//   { label: "Breakdown", field: "due_to_breakdown", group: "Breakdown" },
//   {
//     label: "Material Unavailability",
//     field: "due_to_material_unavailability",
//     group: "Breakdown",
//   },
//   // Preventive Maintenance
//   { label: "PM Auto Attempted", field: "pm_automatic_attempted", group: "PM" },
//   { label: "PM Auto Completed", field: "pm_automatic_completed", group: "PM" },
//   {
//     label: "PM Semi-Auto Attempted",
//     field: "pm_semi_auto_attempted",
//     group: "PM",
//   },
//   {
//     label: "PM Semi-Auto Completed",
//     field: "pm_semi_auto_completed",
//     group: "PM",
//   },
//   { label: "Total PM Done", field: "total_pm_done", group: "PM" },
//   // Tickets
//   { label: "Tickets Raised", field: "tickets_raised", group: "Tickets" },
//   { label: "Tickets Closed", field: "tickets_closed", group: "Tickets" },
//   { label: "Tickets Pending", field: "tickets_pending", group: "Tickets" },
// ];

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_DPR_REQUEST":
      return { ...state, loadingDprs: true, dprError: "" };
    case "FETCH_DPR_SUCCESS":
      return { ...state, loadingDprs: false, dprs: action.payload };
    case "FETCH_DPR_FAIL":
      return { ...state, loadingDprs: false, dprError: action.payload };
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
  const [{ dprs, loadingDprs, dprError, loadingSiteIds, siteIds }, dispatch] =
    useReducer(reducer, {
      dprs: [],
      loadingDprs: true,
      dprError: "",
      siteIds: [],
      loadingSiteIds: true,
      sitesError: "",
    });

  // const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);
  const [searchText, setSearchText] = useState("");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [site_id, setSiteId] = useState("all");

  let adminroute = "";
  if (userInfo.role === "Master Admin") adminroute = "master-admin";
  else if (userInfo.role === "Service Admin") adminroute = "service-admin";
  else if (userInfo.role === "Project Admin") adminroute = "project-admin";

  // ─── Fetch DPR data ──────────────────────────────────────────────────────────
  const fetchDprMonthWise = async () => {
    dispatch({ type: "FETCH_DPR_REQUEST" });
    try {
      const result = await axios.get(
        `/api/v1/techniciandprs/${site_id}/${startDate}/${endDate}`,
        {
          //  headers: { Authorization: `Bearer ${authtoken}` }
          withCredentials: true,
        },
      );
      dispatch({ type: "FETCH_DPR_SUCCESS", payload: result.data.data });
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to fetch DPR";
      dispatch({ type: "FETCH_DPR_FAIL", payload: msg });
      toast.error(msg);
    }
  };

  useEffect(() => {
    fetchDprMonthWise();
  }, [startDate, endDate, site_id]); // eslint-disable-line

  const filtereddprs =
    dprs.filter(
      (dpr) =>
        dpr.site_id?.toLowerCase().includes(searchText.toLowerCase()) ||
        dpr.last_activity[0]?.name
          .toLowerCase()
          .includes(searchText.toLowerCase()),
    ) || [];

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="m-2">
      <h2 className="text-center mb-2"> DPRs</h2>

      {/* ── Toolbar ── */}
      <div className="d-flex justify-content-between align-items-end mb-3 flex-wrap gap-3">
        {/* Left — title or action */}
        <Link
          className="btn btn-sm btn-primary d-flex align-items-center gap-1"
          to={`/${adminroute}/all-site-dpr/add-dpr`}
        >
          <CIcon icon={cilPlus} size="sm" />
          Add DPR
        </Link>

        {/* Right — filters */}
        <div className="d-flex align-items-end flex-wrap gap-2">
          {/* Site */}
          <div>
            <label
              className="form-label text-body-secondary mb-1"
              style={{
                fontSize: 11,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              Site
            </label>
            <SiteSelect value={site_id} onChange={setSiteId} />
          </div>

          {/* From */}
          <div>
            <label
              className="form-label text-body-secondary mb-1"
              style={{
                fontSize: 11,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              From
            </label>
            <CFormInput
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              size="sm"
            />
          </div>

          {/* To */}
          <div>
            <label
              className="form-label text-body-secondary mb-1"
              style={{
                fontSize: 11,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              To
            </label>
            <CFormInput
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              size="sm"
            />
          </div>

          {/* Search */}
          <div>
            <label
              className="form-label text-body-secondary mb-1"
              style={{
                fontSize: 11,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              Search
            </label>
            <CInputGroup size="sm">
              <CInputGroupText className="border-secondary text-body-secondary">
                <CIcon icon={cilSearch} size="sm" />
              </CInputGroupText>
              <CFormInput
                placeholder="Search Site / Technician..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="border-secondary text-white"
                style={{ maxWidth: 200 }}
              />
            </CInputGroup>
          </div>
        </div>
      </div>
      {/* ── Table ── */}
      <div
        className="d-flex justify-content-start align-items-center flex-wrap"
        style={{}}
      >
        {loadingDprs ? (
          <LoadingSpinner />
        ) : dprError ? (
          dprError
        ) : filtereddprs.length > 0 ? (
          filtereddprs.map((item, index) => (
            <DPRCard key={item._id} item={item} />
          ))
        ) : (
          <div className="badge bg-warning p-4">No DPR Found Today</div>
        )}
      </div>
    </div>
  );
};
export default AllSiteDpr;
