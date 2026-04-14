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

//   const authtoken = useSelector((state) => state.authtoken);
//   const userInfo = useSelector((state) => state.userInfo);

//   const [month, setMonth] = useState(new Date().getMonth() + 1);
//   const [year, setYear] = useState(new Date().getFullYear());
//   const [site_id, setSiteId] = useState("all");
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedInventory, setSelectedInventory] = useState(null);
//   const [formData, setFormData] = useState({});
//   let adminroute = "";
//   if (userInfo.role === "Master Admin") adminroute = "master-admin";
//   else if (userInfo.role === "Service Admin") adminroute = "service-admin";
//   else if (userInfo.role === "Project Admin") adminroute = "project-admin";

//   const fetchDprMonthWise = async () => {
//     dispatch({ type: "FETCH_DPR_REQUEST" });
//     try {
//       const payload = { month, year, siteId: site_id };
//       const result = await axios.post(
//         "/api/v1/techniciandprs/monthly",
//         payload,
//         { headers: { Authorization: `Bearer ${authtoken}` } },
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
//     // eslint-disable-next-line react-hooks/exhaustive-deps
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
//           payload: error.response?.data?.error || error.response?.data?.message,
//         });
//         toast.error(
//           error.response?.data?.error || error.response?.data?.message,
//         );
//       }
//     };

//     fetchSiteIds();
//   }, [authtoken]);

//   const openModal = (dpr) => {
//     setSelectedInventory(dpr);
//     setFormData(dpr);
//     setModalVisible(true);
//   };

//   const getWeekOfMonth = (dateObj) => {
//     return Math.ceil(dateObj.getDate() / 7);
//   };

//   // Process the data to create proper headers with weeks inserted after every 7 days
//   // const processDprData = () => {
//   //   if (!dprs.length) return { headers: [], weekHeaders: [] };

//   //   // Extract all dates and weeks from the first site (all sites should have same structure)
//   //   const dateEntries = [];
//   //   const weekEntries = [];

//   //   dprs[0].month_wise_data.forEach((entry) => {
//   //     if (entry.date) {
//   //       dateEntries.push({
//   //         key: entry.date,
//   //         type: "date",
//   //         value: entry.date,
//   //         // Parse date for sorting
//   //         dateObj: new Date(
//   //           parseInt(entry.date.split("-")[2]),
//   //           parseInt(entry.date.split("-")[1]) - 1,
//   //           parseInt(entry.date.split("-")[0])
//   //         ),
//   //       });
//   //     } else if (entry.week) {
//   //       weekEntries.push({
//   //         key: entry.week,
//   //         type: "week",
//   //         value: entry.week,
//   //         weekNum: parseInt(entry.week.replace("Week ", "")),
//   //       });
//   //     }
//   //   });

//   //   // Sort dates chronologically
//   //   dateEntries.sort((a, b) => a.dateObj - b.dateObj);

//   //   // Sort weeks numerically
//   //   weekEntries.sort((a, b) => a.weekNum - b.weekNum);

//   //   // Insert weeks after every 7 days
//   //   const headers = [];
//   //   const weekHeaders = [];

//   //   let dayCount = 0;
//   //   let weekIndex = 0;

//   //   dateEntries.forEach((date, index) => {
//   //     headers.push(date);
//   //     dayCount++;

//   //     // After 7 days, insert the corresponding week summary
//   //     if (dayCount === 7 && weekIndex < weekEntries.length) {
//   //       const weekEntry = weekEntries[weekIndex];
//   //       headers.push(weekEntry);

//   //       // Add to week headers for the table
//   //       weekHeaders.push({ week: weekEntry.value, span: 8 }); // 7 days + 1 week column

//   //       dayCount = 0;
//   //       weekIndex++;
//   //     }
//   //   });

//   //   // Add any remaining weeks (if any)
//   //   while (weekIndex < weekEntries.length) {
//   //     const weekEntry = weekEntries[weekIndex];
//   //     headers.push(weekEntry);
//   //     weekHeaders.push({ week: weekEntry.value, span: 1 });
//   //     weekIndex++;
//   //   }

//   //   return { headers, weekHeaders };
//   // };

//   const processDprData = () => {
//     if (!dprs.length) return { headers: [] };

//     const dateSet = new Set();

//     dprs[0].month_wise_data.forEach((entry) => {
//       if (entry.date) dateSet.add(entry.date);
//     });

//     const dates = Array.from(dateSet).map((d) => {
//       const [dd, mm, yyyy] = d.split("-");
//       const dateObj = new Date(yyyy, mm - 1, dd);

//       return {
//         key: d,
//         type: "date",
//         value: d,
//         dateObj,
//         week: getWeekOfMonth(dateObj),
//       };
//     });

//     // Sort dates
//     dates.sort((a, b) => a.dateObj - b.dateObj);

//     const headers = [];
//     let currentWeek = null;

//     dates.forEach((d, index) => {
//       headers.push(d);

//       if (currentWeek === null) {
//         currentWeek = d.week;
//       }

//       const next = dates[index + 1];

//       // Insert week column when week changes OR last date
//       if (!next || next.week !== currentWeek) {
//         headers.push({
//           key: `Week ${currentWeek}`,
//           type: "week",
//           value: `Week ${currentWeek}`,
//         });
//         currentWeek = next?.week;
//       }
//     });

//     return { headers };
//   };

//   const { headers, weekHeaders } = processDprData();

//   const exportToExcel = () => {
//     if (!dprs.length) {
//       toast.error("No data to export");
//       return;
//     }

//     const metrics = [
//       { label: "Robots Uptime", field: "robots_uptime" },
//       { label: "Robots Availability", field: "robots_availability" },
//       { label: "Due to Oxidation", field: "due_to_oxidation" },
//       { label: "Due to Offline", field: "due_to_offline" },
//       { label: "Battery issue", field: "due_to_battery_issue" },
//       { label: "Due to Vegetation", field: "due_to_vegetation" },
//       { label: "Due to Client", field: "due_to_client" },
//       { label: "Due to Service", field: "due_to_service" },
//       { label: "Due to Timer", field: "due_to_timer" },
//       { label: "Due to Breakdown", field: "due_to_breakdown" },
//       {
//         label: "Material Unavailability",
//         field: "due_to_material_unavailability",
//       },
//     ];

//     // Create the header rows
//     const headerRow1 = [
//       "Sr No.",
//       "Site Name",
//       "Robots Details",
//       "Robots Qty",
//       ...headers.map((header) => header.value),
//     ];

//     // Create the data rows
//     const dataRows = [];

//     dprs.forEach((site, siteIndex) => {
//       // Create a map of all entries for this site
//       const entryMap = {};
//       site.month_wise_data.forEach((entry) => {
//         const key = entry.date || entry.week;
//         metrics.forEach((metric) => {
//           if (!entryMap[metric.field]) {
//             entryMap[metric.field] = {};
//           }
//           entryMap[metric.field][key] = entry[metric.field];
//         });
//       });

//       // Add rows for each metric
//       metrics.forEach((metric, rowIndex) => {
//         const rowData = [
//           rowIndex === 0 ? siteIndex + 1 : "", // Sr No. (only in first row for this site)
//           rowIndex === 0 ? site.site_id : "", // Site Name (only in first row for this site)
//           metric.label,
//           rowIndex === 0 ? site.total_robots : "", // Robots Qty (only in first row for this site)
//           ...headers.map(
//             (header) => entryMap[metric.field]?.[header.key] ?? "",
//           ),
//         ];
//         dataRows.push(rowData);
//       });
//     });

//     // Create the worksheet with proper structure
//     const aoa = [
//       ["DPR Report"],
//       [], // Empty row
//       headerRow1,
//       ...dataRows,
//     ];

//     const worksheet = XLSX.utils.aoa_to_sheet(aoa);

//     // Style the main headers (row 3, which is index 2 in 0-based)
//     for (let col = 0; col < headerRow1.length; col++) {
//       const cellAddress = XLSX.utils.encode_cell({ r: 2, c: col });
//       if (!worksheet[cellAddress]) continue;

//       worksheet[cellAddress].s = {
//         font: { bold: true },
//         fill: { fgColor: { rgb: "D3D3D3" } }, // Light gray background
//       };
//     }

//     // Style week headers with yellow background
//     headers.forEach((header, idx) => {
//       if (header.type === "week") {
//         const col = 4 + idx; // 4 fixed columns before date/week columns
//         const cellAddress = XLSX.utils.encode_cell({ r: 2, c: col });
//         if (worksheet[cellAddress]) {
//           worksheet[cellAddress].s = {
//             font: { bold: true },
//             fill: { fgColor: { rgb: "FFFF00" } }, // Yellow background
//           };
//         }
//       }
//     });

//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "DPR");
//     XLSX.writeFile(workbook, `DPR_${month}_${year}.xlsx`);
//   };

//   const handleSiteNameChange = (e) => {
//     const selectedSiteId = e.target.value;
//     setSiteId(selectedSiteId);
//   };

//   return (
//     <div className="p-2">
//       <h2 className="text-center mb-4">Monthly DPR</h2>

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

//       <CRow className="justify-content-end mb-3">
//         <CCol md={3} className="m-1">
//           <div className="mb-3">
//             <CFormSelect
//               name="site_id"
//               value={site_id}
//               onChange={handleSiteNameChange}
//             >
//               {loadingSiteIds && <LoadingSpinner />}
//               <option value="all">All</option>
//               {siteIds?.length > 0 &&
//                 siteIds.map((item) => (
//                   <option key={item.site_id} value={item.site_id}>
//                     {item.site_id}
//                   </option>
//                 ))}
//             </CFormSelect>
//           </div>
//         </CCol>
//         <CCol md={2} className="m-1">
//           <CFormSelect
//             value={month}
//             onChange={(e) => setMonth(Number(e.target.value))}
//           >
//             <option value="">Select Month</option>
//             <option value={1}>January</option>
//             <option value={2}>February</option>
//             <option value={3}>March</option>
//             <option value={4}>April</option>
//             <option value={5}>May</option>
//             <option value={6}>June</option>
//             <option value={7}>July</option>
//             <option value={8}>August</option>
//             <option value={9}>September</option>
//             <option value={10}>October</option>
//             <option value={11}>November</option>
//             <option value={12}>December</option>
//           </CFormSelect>
//         </CCol>

//         <CCol md={2} className="m-1">
//           <CFormSelect
//             value={year}
//             onChange={(e) => setYear(Number(e.target.value))}
//           >
//             <option value="">Select Year</option>
//             {Array.from({ length: 10 }, (_, i) => {
//               const y = new Date().getFullYear() - i; // last 10 years
//               return (
//                 <option key={y} value={y}>
//                   {y}
//                 </option>
//               );
//             })}
//           </CFormSelect>
//         </CCol>
//       </CRow>

//       <div style={{}}>
//         <CTable
//           bordered
//           hover
//           responsive
//           style={{ minWidth: "1200px", overflowY: "auto", maxHeight: "100vh" }}
//         >
//           <CTableHead color="secondary" style={{ minHeight: "200px" }}>
//             <CTableRow>
//               <CTableHeaderCell
//                 rowSpan={2}
//                 style={{
//                   position: "sticky",
//                   top: 0,
//                   zIndex: 5,
//                   background: "#f8f9fa",
//                 }}
//               >
//                 Sr.
//               </CTableHeaderCell>

//               <CTableHeaderCell
//                 rowSpan={2}
//                 style={{
//                   position: "sticky",
//                   top: 0,
//                   left: 0,
//                   zIndex: 6,
//                   background: "#f8f9fa",
//                   minWidth: "120px",
//                 }}
//               >
//                 Site Name
//               </CTableHeaderCell>

//               <CTableHeaderCell
//                 rowSpan={2}
//                 style={{
//                   position: "sticky",
//                   top: 0,
//                   left: 120,
//                   zIndex: 6,
//                   background: "#f8f9fa",
//                   minWidth: "140px",
//                 }}
//               >
//                 Robots Details
//               </CTableHeaderCell>

//               <CTableHeaderCell
//                 rowSpan={2}
//                 style={{
//                   position: "sticky",
//                   top: 0,
//                   zIndex: 5,
//                   background: "#f8f9fa",
//                 }}
//               >
//                 Robots Qty
//               </CTableHeaderCell>

//               {headers.map((header, idx) => (
//                 <CTableHeaderCell
//                   key={idx}
//                   style={{
//                     position: "sticky",
//                     top: 0,
//                     zIndex: 5,
//                     background: header.type === "week" ? "#fff200" : "#f8f9fa",
//                   }}
//                 >
//                   {header.value}
//                 </CTableHeaderCell>
//               ))}

//               <CTableHeaderCell
//                 rowSpan={2}
//                 style={{
//                   position: "sticky",
//                   top: 0,
//                   zIndex: 5,
//                   background: "#f8f9fa",
//                 }}
//               >
//                 Action
//               </CTableHeaderCell>
//             </CTableRow>
//           </CTableHead>

//           <CTableBody>
//             {loadingDprs ? (
//               <CTableRow>
//                 <CTableDataCell colSpan={headers.length + 4}>
//                   <LoadingSpinner />
//                 </CTableDataCell>
//               </CTableRow>
//             ) : dprs.length ? (
//               dprs.map((site, siteIndex) => {
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

//                 const entryMap = {};
//                 site.month_wise_data.forEach((entry) => {
//                   const key = entry.date || entry.week;
//                   metrics.forEach((metric) => {
//                     if (!entryMap[metric.field]) {
//                       entryMap[metric.field] = {};
//                     }
//                     entryMap[metric.field][key] = entry[metric.field];
//                   });
//                 });

//                 return metrics.map((row, rowIndex, arr) => (
//                   <CTableRow
//                     key={site.site_id + "-" + row.field}
//                     style={
//                       rowIndex === arr.length - 1
//                         ? {
//                             borderBottom: "3px solid white",
//                           }
//                         : {}
//                     }
//                   >
//                     {rowIndex === 0 && (
//                       <CTableDataCell rowSpan={arr.length}>
//                         {siteIndex + 1}
//                       </CTableDataCell>
//                     )}
//                     {rowIndex === 0 && (
//                       <CTableDataCell
//                         rowSpan={arr.length}
//                         style={{
//                           position: "sticky",
//                           left: 0,
//                           zIndex: 3,
//                         }}
//                       >
//                         {site.site_id}
//                       </CTableDataCell>
//                     )}
//                     <CTableDataCell
//                       style={{
//                         position: "sticky",
//                         left: 140,
//                         zIndex: 3,
//                       }}
//                     >
//                       {row.label}
//                     </CTableDataCell>
//                     <CTableDataCell style={{ minWidth: "100px" }}>
//                       {site.total_robots}
//                     </CTableDataCell>
//                     {headers.map((header) => (
//                       <CTableDataCell
//                         style={{ minWidth: "100px" }}
//                         key={header.key}
//                       >
//                         {entryMap[row.field]?.[header.key] ?? ""}
//                       </CTableDataCell>
//                     ))}
//                     {rowIndex === 0 && (
//                       <CTableDataCell
//                         rowSpan={arr.length}
//                         style={{
//                           minWidth: "100px",
//                           textAlign: "center",
//                           verticalAlign: "middle",
//                         }}
//                       >
//                         <button
//                           className="btn btn-primary btn-sm"
//                           onClick={() => openModal(site)}
//                         >
//                           View
//                         </button>
//                       </CTableDataCell>
//                     )}
//                   </CTableRow>
//                 ));
//               })
//             ) : (
//               <CTableRow>
//                 <CTableDataCell colSpan={headers.length + 4}>
//                   No Data Found
//                 </CTableDataCell>
//               </CTableRow>
//             )}
//           </CTableBody>
//         </CTable>
//       </div>

//       <CModal
//         visible={modalVisible}
//         onClose={() => setModalVisible(false)}
//         size="lg"
//       >
//         <CModalHeader closeButton={false}>
//           <CModalTitle>
//             DPR Details -{" "}
//             <CBadge color="success"> {selectedInventory?.site_id}</CBadge>
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
//             <div>
//               <h5>Site Information</h5>
//               <p>
//                 <strong>Site ID:</strong> {selectedInventory.site_id}
//               </p>
//               <p>
//                 <strong>Total Robots:</strong>{" "}
//                 <CBadge color="warning">
//                   {selectedInventory.total_robots}
//                 </CBadge>
//               </p>

//               <h5 className="mt-4">Monthly Data</h5>
//               <div style={{ maxHeight: "400px", overflowY: "auto" }}>
//                 <CTable striped bordered>
//                   <CTableHead>
//                     <CTableRow>
//                       <CTableHeaderCell>Date/Week</CTableHeaderCell>
//                       <CTableHeaderCell>Robots Uptime</CTableHeaderCell>
//                       <CTableHeaderCell>Robots Availability</CTableHeaderCell>
//                       <CTableHeaderCell>Due to Oxidation</CTableHeaderCell>
//                       <CTableHeaderCell>Due to Offline</CTableHeaderCell>
//                       <CTableHeaderCell>Battery Issue</CTableHeaderCell>
//                       <CTableHeaderCell>Due to Vegetation</CTableHeaderCell>
//                       <CTableHeaderCell>Due to Client</CTableHeaderCell>
//                       <CTableHeaderCell>Due to Service</CTableHeaderCell>
//                       <CTableHeaderCell>Due to Timer</CTableHeaderCell>
//                       <CTableHeaderCell>Due to Breakdown</CTableHeaderCell>
//                       <CTableHeaderCell>
//                         Material Unavailability
//                       </CTableHeaderCell>
//                     </CTableRow>
//                   </CTableHead>
//                   <CTableBody>
//                     {selectedInventory.month_wise_data.map((entry, index) => (
//                       <CTableRow key={index}>
//                         <CTableDataCell
//                           style={
//                             entry.week ? { backgroundColor: "#dbd67aff" } : {}
//                           }
//                         >
//                           {entry.date || entry.week}
//                         </CTableDataCell>
//                         <CTableDataCell>{entry.robots_uptime}</CTableDataCell>
//                         <CTableDataCell>
//                           {entry.robots_availability}
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           {entry.due_to_oxidation}
//                         </CTableDataCell>
//                         <CTableDataCell>{entry.due_to_offline}</CTableDataCell>
//                         <CTableDataCell>
//                           {entry.due_to_battery_issue}
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           {entry.due_to_vegetation}
//                         </CTableDataCell>
//                         <CTableDataCell>{entry.due_to_client}</CTableDataCell>
//                         <CTableDataCell>{entry.due_to_service}</CTableDataCell>
//                         <CTableDataCell>{entry.due_to_timer}</CTableDataCell>
//                         <CTableDataCell>
//                           {entry.due_to_breakdown}
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           {entry.due_to_material_unavailability}
//                         </CTableDataCell>
//                       </CTableRow>
//                     ))}
//                   </CTableBody>
//                 </CTable>
//               </div>
//             </div>
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

// export default AllSiteDpr;


import React, { useEffect, useReducer, useState } from "react";
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CRow,
  CCol,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CFormSelect,
  CButton,
  CModalFooter,
  CBadge,
} from "@coreui/react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";
import * as XLSX from "xlsx";
import CIcon from "@coreui/icons-react";
import { cilX } from "@coreui/icons";

// ─── All metric definitions in one place ─────────────────────────────────────
const METRICS = [
  // Operational
  { label: "Robots Uptime (%)",        field: "robots_uptime",                   group: "Operational" },
  { label: "Robots Availability",       field: "robots_availability",             group: "Operational" },
  { label: "Online Operational",        field: "online_operational",              group: "Operational" },
  { label: "Manual Operational",        field: "manual_operational",              group: "Operational" },
  { label: "Unoperational",             field: "unoperational",                   group: "Operational" },
  { label: "Running Robots",            field: "total_running_robots",            group: "Operational" },
  { label: "Failed Robots",             field: "total_failed_robots",             group: "Operational" },
  // Breakdown reasons
  { label: "Oxidation",                 field: "due_to_oxidation",                group: "Breakdown" },
  { label: "Offline",                   field: "due_to_offline",                  group: "Breakdown" },
  { label: "Transit Online→Offline",    field: "due_to_transit",                  group: "Breakdown" },
  { label: "Battery Dead",              field: "due_to_battery_issue",            group: "Breakdown" },
  { label: "Vegetation",                field: "due_to_vegetation",               group: "Breakdown" },
  { label: "Client Reasons",            field: "due_to_client",                   group: "Breakdown" },
  { label: "Service Reasons",           field: "due_to_service",                  group: "Breakdown" },
  { label: "Timer",                     field: "due_to_timer",                    group: "Breakdown" },
  { label: "Breakdown",                 field: "due_to_breakdown",                group: "Breakdown" },
  { label: "Material Unavailability",   field: "due_to_material_unavailability",  group: "Breakdown" },
  // Preventive Maintenance
  { label: "PM Auto Attempted",         field: "pm_automatic_attempted",          group: "PM" },
  { label: "PM Auto Completed",         field: "pm_automatic_completed",          group: "PM" },
  { label: "PM Semi-Auto Attempted",    field: "pm_semi_auto_attempted",          group: "PM" },
  { label: "PM Semi-Auto Completed",    field: "pm_semi_auto_completed",          group: "PM" },
  { label: "Total PM Done",             field: "total_pm_done",                   group: "PM" },
  // Tickets
  { label: "Tickets Raised",            field: "tickets_raised",                  group: "Tickets" },
  { label: "Tickets Closed",            field: "tickets_closed",                  group: "Tickets" },
  { label: "Tickets Pending",           field: "tickets_pending",                 group: "Tickets" },
];

// Group colour accents (light tints for the sticky label column)
const GROUP_COLORS = {
  Operational: "#e8f4fd",
  Breakdown:   "#fdf0e8",
  PM:          "#edf7ed",
  Tickets:     "#f9f0fd",
};

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
  const [{ dprs, loadingDprs, loadingSiteIds, siteIds }, dispatch] =
    useReducer(reducer, {
      dprs: [],
      loadingDprs: true,
      error: "",
      siteIds: [],
      loadingSiteIds: true,
      sitesError: "",
    });

  const authtoken = useSelector((state) => state.authtoken);
  const userInfo  = useSelector((state) => state.userInfo);

  const [month, setMonth]               = useState(new Date().getMonth() + 1);
  const [year, setYear]                 = useState(new Date().getFullYear());
  const [site_id, setSiteId]            = useState("all");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSite, setSelectedSite] = useState(null);

  let adminroute = "";
  if      (userInfo.role === "Master Admin")  adminroute = "master-admin";
  else if (userInfo.role === "Service Admin") adminroute = "service-admin";
  else if (userInfo.role === "Project Admin") adminroute = "project-admin";

  // ─── Fetch DPR data ──────────────────────────────────────────────────────────
  const fetchDprMonthWise = async () => {
    dispatch({ type: "FETCH_DPR_REQUEST" });
    try {
      const result = await axios.post(
        "/api/v1/techniciandprs/monthly",
        { month, year, siteId: site_id },
        { headers: { Authorization: `Bearer ${authtoken}` } }
      );
      dispatch({ type: "FETCH_DPR_SUCCESS", payload: result.data.data });
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to fetch DPR";
      dispatch({ type: "FETCH_DPR_FAIL", payload: msg });
      toast.error(msg);
    }
  };

  useEffect(() => { fetchDprMonthWise(); }, [month, year, site_id, authtoken]); // eslint-disable-line

  useEffect(() => {
    const fetchSiteIds = async () => {
      dispatch({ type: "FETCH_SITEID_REQUEST" });
      try {
        const result = await axios.get("/api/v1/sites", {
          headers: { Authorization: `Bearer ${authtoken}` },
        });
        dispatch({ type: "FETCH_SITEID_SUCCESS", payload: result.data.data });
      } catch (err) {
        const msg = err.response?.data?.error || err.response?.data?.message;
        dispatch({ type: "FETCH_SITEID_FAIL", payload: msg });
        toast.error(msg);
      }
    };
    fetchSiteIds();
  }, [authtoken]);

  // ─── FIX 3: derive headers DIRECTLY from backend order ──────────────────────
  // The backend already emits month_wise_data in the correct order with week
  // summaries inserted at the right positions.  We just read that order instead
  // of recomputing week numbers in the frontend (which caused a key mismatch).
  const buildHeaders = () => {
    if (!dprs.length) return [];
    return dprs[0].month_wise_data.map((entry) => ({
      key:  entry.date || entry.week,   // exact key used in entryMap
      type: entry.date ? "date" : "week",
      value: entry.date || entry.week,
    }));
  };

  const headers = buildHeaders();

  // ─── Build per-site entry map ────────────────────────────────────────────────
  const buildEntryMap = (monthWiseData) => {
    const map = {};
    for (const entry of monthWiseData) {
      const key = entry.date || entry.week;
      for (const { field } of METRICS) {
        if (!map[field]) map[field] = {};
        map[field][key] = entry[field] ?? "";
      }
    }
    return map;
  };

  // ─── Export ──────────────────────────────────────────────────────────────────
  const exportToExcel = () => {
    if (!dprs.length) { toast.error("No data to export"); return; }

    const headerRow = [
      "Sr No.", "Site Name", "Robots Details", "Robots Qty",
      ...headers.map((h) => h.value),
    ];

    const dataRows = [];
    dprs.forEach((site, si) => {
      const entryMap = buildEntryMap(site.month_wise_data);
      METRICS.forEach((metric, ri) => {
        dataRows.push([
          ri === 0 ? si + 1 : "",
          ri === 0 ? site.site_id : "",
          metric.label,
          ri === 0 ? site.total_robots : "",   // ← FIX 2 applied in export too
          ...headers.map((h) => entryMap[metric.field]?.[h.key] ?? ""),
        ]);
      });
    });

    const aoa = [["DPR Report"], [], headerRow, ...dataRows];
    const ws  = XLSX.utils.aoa_to_sheet(aoa);
    const wb  = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DPR");
    XLSX.writeFile(wb, `DPR_${month}_${year}.xlsx`);
  };

  // ─── Helpers ─────────────────────────────────────────────────────────────────
  const MONTH_NAMES = [
    "","Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec",
  ];

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="p-2">
      <h2 className="text-center mb-4">Monthly DPR</h2>

      {/* ── Toolbar ── */}
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div className="d-flex gap-2">
          <Link
            className="btn btn-sm btn-secondary"
            to={`/${adminroute}/all-site-dpr/add-dpr`}
          >
            Add DPR
          </Link>
          <button className="btn btn-sm btn-primary" onClick={exportToExcel}>
            Export
          </button>
        </div>

        <CRow className="g-2 align-items-center">
          <CCol xs="auto">
            <CFormSelect
              size="sm"
              value={site_id}
              onChange={(e) => setSiteId(e.target.value)}
              style={{ minWidth: 120 }}
            >
              {loadingSiteIds ? (
                <option>Loading…</option>
              ) : (
                <>
                  <option value="all">All Sites</option>
                  {siteIds?.map((s) => (
                    <option key={s.site_id} value={s.site_id}>{s.site_id}</option>
                  ))}
                </>
              )}
            </CFormSelect>
          </CCol>
          <CCol xs="auto">
            <CFormSelect
              size="sm"
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
            >
              {MONTH_NAMES.slice(1).map((name, i) => (
                <option key={i + 1} value={i + 1}>{name}</option>
              ))}
            </CFormSelect>
          </CCol>
          <CCol xs="auto">
            <CFormSelect
              size="sm"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            >
              {Array.from({ length: 10 }, (_, i) => {
                const y = new Date().getFullYear() - i;
                return <option key={y} value={y}>{y}</option>;
              })}
            </CFormSelect>
          </CCol>
        </CRow>
      </div>

      {/* ── Table ── */}
      <div style={{ overflowX: "auto", overflowY: "auto", maxHeight: "75vh" }}>
        <CTable
          bordered
          hover
          style={{ minWidth: "1400px", marginBottom: 0 }}
        >
          {/* ── Single header row (rowSpan removed from Action — FIX 4) ── */}
          <CTableHead
            color="secondary"
            style={{ position: "sticky", top: 0, zIndex: 10 }}
          >
            <CTableRow>
              {/* Fixed left columns */}
              <CTableHeaderCell
                style={{ ...stickyCell(0), minWidth: 40 }}
              >
                Sr.
              </CTableHeaderCell>
              <CTableHeaderCell
                style={{ ...stickyCell(40), minWidth: 110 }}
              >
                Site
              </CTableHeaderCell>
              <CTableHeaderCell
                style={{ ...stickyCell(150), minWidth: 170 }}
              >
                Metric
              </CTableHeaderCell>
              <CTableHeaderCell
                style={{ ...stickyCell(320), minWidth: 70, textAlign: "center" }}
              >
                Qty
              </CTableHeaderCell>

              {/* Date / Week columns */}
              {headers.map((h, idx) => (
                <CTableHeaderCell
                  key={idx}
                  style={{
                    minWidth: h.type === "week" ? 80 : 70,
                    textAlign: "center",
                    background: h.type === "week" ? "#fff200" : "#e9ecef",
                    fontWeight: h.type === "week" ? 700 : 500,
                    // fontSize: h.type === "week" ? "0.75rem" : "0.7rem",
                    whiteSpace: "nowrap",
                    position: "sticky",
                    top: 0,
                    zIndex: 5,
                  }}
                >
                  {h.type === "date"
                    ? h.value.slice(0, 2)   // show "DD-MM" only
                    : h.value}
                </CTableHeaderCell>
              ))}

              <CTableHeaderCell
                style={{ minWidth: 70, textAlign: "center",
                  position: "sticky", top: 0, zIndex: 5, background: "#e9ecef" }}
              >
                Action
              </CTableHeaderCell>
            </CTableRow>
          </CTableHead>

          <CTableBody>
            {loadingDprs ? (
              <CTableRow>
                <CTableDataCell colSpan={headers.length + 5}>
                  <LoadingSpinner />
                </CTableDataCell>
              </CTableRow>
            ) : dprs.length ? (
              dprs.map((site, siteIndex) => {
                const entryMap = buildEntryMap(site.month_wise_data);

                return METRICS.map((row, rowIndex, arr) => {
                  const isFirst = rowIndex === 0;
                  const isLast  = rowIndex === arr.length - 1;
                  // const groupBg = GROUP_COLORS[row.group] || "#fff";

                  return (
                    <CTableRow
                      key={`${site.site_id}-${row.field}`}
                      style={isLast ? { borderBottom: "3px solid #aaa" } : {}}
                    >
                      {/* Sr — rowSpan for whole site block */}
                      {isFirst && (
                        <CTableDataCell
                          rowSpan={arr.length}
                          style={{
                            ...stickyCell(0, "#fff"),
                            textAlign: "center",
                            verticalAlign: "middle",
                            fontWeight: 600,
                          }}
                        >
                          {siteIndex + 1}
                        </CTableDataCell>
                      )}

                      {/* Site ID */}
                      {isFirst && (
                        <CTableDataCell
                          rowSpan={arr.length}
                          style={{
                            ...stickyCell(40, "#fff"),
                            verticalAlign: "middle",
                            fontWeight: 600,
                          }}
                        >
                          {site.site_id}
                        </CTableDataCell>
                      )}

                      {/* Metric label */}
                      <CTableDataCell
                        style={{
                          ...stickyCell(150),
                          // fontSize: "0.75rem",
                          whiteSpace: "nowrap",
                          borderRight: "2px solid #ccc",
                        }}
                      >
                        <span
                          style={{
                            display: "inline-block",
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: groupDot(row.group),
                            marginRight: 5,
                          }}
                        />
                        {row.label}
                      </CTableDataCell>

                      {/* ── FIX 2: Robots Qty only in first row with rowSpan ── */}
                      {isFirst && (
                        <CTableDataCell
                          rowSpan={arr.length}
                          style={{
                            ...stickyCell(320, "#fff"),
                            textAlign: "center",
                            verticalAlign: "middle",
                            fontWeight: 600,
                          }}
                        >
                          {site.total_robots}
                        </CTableDataCell>
                      )}

                      {/* Data cells */}
                      {headers.map((h) => {
                        const val = entryMap[row.field]?.[h.key];
                        const isEmpty = val === "" || val === undefined || val === null;
                        return (
                          <CTableDataCell
                            key={h.key}
                            style={{
                              textAlign: "center",
                              minWidth: h.type === "week" ? 80 : 70,
                              background: h.type === "week"
                                ? "rgba(255,242,0,0.25)"
                                : "transparent",
                              color: isEmpty ? "#ccc" : undefined,
                              fontWeight: h.type === "week" ? 600 : 400,
                            }}
                          >
                            {isEmpty ? "–" : val}
                          </CTableDataCell>
                        );
                      })}

                      {/* Action */}
                      {isFirst && (
                        <CTableDataCell
                          rowSpan={arr.length}
                          style={{ textAlign: "center", verticalAlign: "middle" }}
                        >
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => { setSelectedSite(site); setModalVisible(true); }}
                          >
                            View
                          </button>
                        </CTableDataCell>
                      )}
                    </CTableRow>
                  );
                });
              })
            ) : (
              <CTableRow>
                <CTableDataCell colSpan={headers.length + 5} className="text-center py-4 text-muted">
                  No Data Found
                </CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>
      </div>

      {/* ── Detail Modal ── */}
      <CModal visible={modalVisible} onClose={() => setModalVisible(false)} size="xl">
        <CModalHeader closeButton={false}>
          <CModalTitle>
            DPR Details — <CBadge color="success">{selectedSite?.site_id}</CBadge>
          </CModalTitle>
          <button
            type="button"
            className="border-0 ms-auto py-0 px-1"
            onClick={() => setModalVisible(false)}
            style={{ background: "none" }}
          >
            <CIcon icon={cilX} size="lg" />
          </button>
        </CModalHeader>

        <CModalBody>
          {selectedSite && (
            <>
              <div className="d-flex gap-4 mb-3">
                <p className="mb-0"><strong>Site ID:</strong> {selectedSite.site_id}</p>
                <p className="mb-0">
                  <strong>Total Robots:</strong>{" "}
                  <CBadge color="warning">{selectedSite.total_robots}</CBadge>
                </p>
              </div>

              <div style={{ overflowX: "auto", maxHeight: "55vh", overflowY: "auto" }}>
                <CTable striped bordered small>
                  <CTableHead color="dark" style={{ position: "sticky", top: 0 }}>
                    <CTableRow>
                      <CTableHeaderCell style={{ minWidth: 120 }}>Metric</CTableHeaderCell>
                      {selectedSite.month_wise_data.map((entry, i) => (
                        <CTableHeaderCell
                          key={i}
                          style={{
                            minWidth: 70,
                            textAlign: "center",
                            background: entry.week ? "#fff200" : undefined,
                            color: entry.week ? "#333" : undefined,
                          }}
                        >
                          {entry.date ? entry.date.slice(0, 5) : entry.week}
                        </CTableHeaderCell>
                      ))}
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {METRICS.map((metric) => (
                      <CTableRow key={metric.field}>
                        <CTableDataCell
                          style={{
                            // background: GROUP_COLORS[metric.group],
                            fontWeight: 500,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {metric.label}
                        </CTableDataCell>
                        {selectedSite.month_wise_data.map((entry, i) => {
                          const val = entry[metric.field];
                          return (
                            <CTableDataCell
                              key={i}
                              style={{
                                textAlign: "center",
                                background: entry.week ? "rgba(255,242,0,0.2)" : undefined,
                                fontWeight: entry.week ? 600 : 400,
                              }}
                            >
                              {val !== undefined && val !== "" ? val : "–"}
                            </CTableDataCell>
                          );
                        })}
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              </div>
            </>
          )}
        </CModalBody>

        <CModalFooter>
          <CButton size="sm" color="secondary" onClick={() => setModalVisible(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

// ─── Style helpers ────────────────────────────────────────────────────────────
const stickyCell = (left) => ({
  position: "sticky",
  left,
  zIndex: 4,

});

const groupDot = (group) => ({
  Operational: "#3b82f6",
  Breakdown:   "#f97316",
  PM:          "#22c55e",
  Tickets:     "#a855f7",
}[group] || "#999");

export default AllSiteDpr;