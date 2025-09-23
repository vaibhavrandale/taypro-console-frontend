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
// import PaginateInput from "../../../components/PaginateInput";
// import * as XLSX from "xlsx"; // Import xlsx for Excel export

// const reducer = (state, action) => {
//   switch (action.type) {
//     case "FETCH_DPRBYDATE_REQUEST":
//       return { ...state, loadingDprs: true, error: "" };

//     case "FETCH_DPRBYDATE_SUCCESS":
//       return {
//         ...state,
//         loadingDprs: false,
//         dprs: action.payload.data,
//         totalPages: action.payload.totalPages, // Use API-provided totalPages
//         hasNextPage: action.payload.hasNextPage,
//         hasPrevPage: action.payload.hasPrevPage,
//       };

//     case "FETCH_DPRBYDATE_FAIL":
//       return { ...state, loadingDprs: false, error: action.payload };

//     case "FETCH_SITEID_REQUEST":
//       return { ...state, loadingSiteIds: true, error: "" };
//     case "FETCH_SITEID_SUCCESS":
//       return {
//         ...state,
//         loadingSiteIds: false,
//         siteIds: action.payload,
//       };
//     case "FETCH_SITEID_FAIL":
//       return { ...state, loadingSiteIds: false, error: action.payload };

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

//     default:
//       return state;
//   }
// };

// const SiteTechnicianDprDashboard = () => {
//   const [
//     {
//       error,
//       dprs,
//       loadingDprs,
//       totalPages,
//       hasNextPage,
//       hasPrevPage,
//       successDelete,
//       siteIds,
//     },
//     dispatch,
//   ] = useReducer(reducer, {
//     dprs: [],
//     loading: true,
//     loadingDprs: true,
//     error: "",
//     totalPages: 1,
//     hasNextPage: false,
//     hasPrevPage: false,
//     loadingSiteIds: false,
//     loadingFields: false,
//     siteIds: [],
//   });
//   const authtoken = useSelector((state) => state.authtoken);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [site_id, setSiteId] = useState("all");
//   const [fromDate, setFromDate] = useState(
//     new Date().toISOString().split("T")[0]
//   );
//   const [toDate, setToDate] = useState(new Date().toISOString().split("T")[0]);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedInventory, setSelectedInventory] = useState(null);

//   const [pageInput, setPageInput] = useState("");

//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(10);

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
//         dispatch({
//           type: "FETCH_SITEID_SUCCESS",
//           payload: result.data.data,
//         });
//       } catch (error) {
//         dispatch({
//           type: "FETCH_SITEID_FAIL",
//           payload: error.response?.data?.error || "Error fetching sites",
//         });
//         toast.error(error.response.data.error || "Error fetching sites");
//       }
//     };

//     const fetchDprDates = async () => {
//       dispatch({ type: "FETCH_DPRBYDATE_REQUEST" });

//       try {
//         const data = {
//           startDate: new Date(fromDate).toISOString().split("T")[0], // Convert to proper format
//           endDate: new Date(toDate).toISOString().split("T")[0],
//           siteId: site_id, // Ensure the key matches
//           pg: page,
//           limit: limit,
//         };

//         const result = await axios.post(
//           `/api/v1/techniciandprs/site-date-wise`,
//           data,
//           {
//             headers: { Authorization: `Bearer ${authtoken}` },
//           }
//         );

//         let total = Math.ceil(
//           Number(result.data.data.total) / Number(result.data.data.limit)
//         );

//         let next = result.data.data.hasNextPage;
//         let prev = result.data.data.hasPrevPage;

//         dispatch({
//           type: "FETCH_DPRBYDATE_SUCCESS",
//           payload: {
//             data: result.data.data,
//             totalPages: total,
//             hasNextPage: next,
//             hasPrevPage: prev,
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
//   }, [successDelete, authtoken, limit, page, fromDate, toDate, site_id]);

//   const filteredInventories = (dprs || []).filter((dpr) =>
//     dpr.site_id?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Open modal and load robot data
//   const openModal = (dpr) => {
//     setSelectedInventory(dpr);
//     setFormData(dpr);
//     setModalVisible(true);
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
//   const allDates = Array.from(
//     new Set(
//       filteredInventories.flatMap((site) =>
//         (site.day_wise_data || []).map((day) => day.date)
//       )
//     )
//   ).sort((a, b) => new Date(a) - new Date(b));

//   const exportToExcel = () => {
//     if (filteredInventories.length === 0) {
//       toast.error("No data available for export.");
//       return;
//     }

//     // Convert JSON to sheet
//     const worksheet = XLSX.utils.json_to_sheet(
//       filteredInventories.map((item, index) => ({
//         "#": index + 1,
//         "Site Id": item.site_id,
//         "Running Robots": item.total_running_robots,
//         "Failed Robots": item.total_failed_robots,
//         "Total Robots": item.total_robots,
//         "Robots Run By": item.robots_run_by,
//         Comment: item.comments,
//       }))
//     );
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "DPR");

//     // Trigger download
//     XLSX.writeFile(workbook, `${site_id}_${fromDate}_${toDate}_DPR.xlsx`);
//   };

//   return (
//     <div className="p-2">
//       <h2 className="text-center mt-4">Daily Progress Reports</h2>
//       <div className="d-flex justify-content-end mb-3">
//         <Link
//           className="btn btn-sm btn-secondary m-1"
//           to={`/site-technician/dpr/add-dpr`}
//         >
//           Add DPR
//         </Link>
//         <Link className="btn btn-sm btn-success m-1" onClick={exportToExcel}>
//           Export
//         </Link>
//       </div>
//       {/* Search Input */}
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

//       <CTable bordered hover responsive className="text-center shadow-sm mb-4">
//         <CTableHead color="secondary">
//           <CTableRow>
//             <CTableHeaderCell rowSpan={2} style={{ minWidth: "150px" }}>
//               Site Name
//             </CTableHeaderCell>
//             <CTableHeaderCell rowSpan={2} style={{ minWidth: "200px" }}>
//               Robot Details
//             </CTableHeaderCell>
//             <CTableHeaderCell rowSpan={2}>Robots Qty</CTableHeaderCell>
//             {allDates.map((date, idx) => (
//               <CTableHeaderCell key={date}>{date}</CTableHeaderCell>
//             ))}
//           </CTableRow>
//         </CTableHead>
//         <CTableBody>
//           {filteredInventories.length > 0 ? (
//             filteredInventories.map((site, siteIndex) =>
//               [
//                 { label: "Robots Uptime", field: "robots_uptime" },
//                 { label: "Robots Availability", field: "robots_availability" },
//                 { label: "Due to Oxidation", field: "due_to_oxidation" },
//                 { label: "Due to Offline", field: "due_to_offline" },
//                 {
//                   label: "Battery issue (Battery Backup)",
//                   field: "due_to_battery_issue",
//                 },
//                 { label: "Due to Vegetation", field: "due_to_vegetation" },
//                 {
//                   label: "Due to Client (abnormality at plant)",
//                   field: "due_to_client",
//                 },
//                 {
//                   label: "Due to Service (Tech. absent)",
//                   field: "due_to_service",
//                 },
//                 { label: "Due to Timer", field: "due_to_timer" },
//                 { label: "Due to Breakdown", field: "due_to_breakdown" },
//                 {
//                   label: "Due to material Unavailability",
//                   field: "due_to_material_unavailability",
//                 },
//               ].map((row, rowIndex) => {
//                 // Lookup for each date value per site per row
//                 const dateMap = {};
//                 (site.day_wise_data || []).forEach((day) => {
//                   dateMap[day.date] = day[row.field];
//                 });
//                 return (
//                   <CTableRow key={site.site_id + "-" + row.field}>
//                     {rowIndex === 0 && (
//                       <CTableDataCell
//                         rowSpan={11}
//                         style={{ verticalAlign: "middle", fontWeight: "bold" }}
//                       >
//                         {site.site_id.replace(/_/g, " ")}
//                       </CTableDataCell>
//                     )}
//                     <CTableDataCell>{row.label}</CTableDataCell>
//                     <CTableDataCell>{site.total_robots}</CTableDataCell>
//                     {allDates.map((date) => (
//                       <CTableDataCell key={date}>
//                         {dateMap[date] ?? ""}
//                       </CTableDataCell>
//                     ))}
//                   </CTableRow>
//                 );
//               })
//             )
//           ) : (
//             <CTableRow>
//               <CTableDataCell
//                 colSpan={allDates.length + 3}
//                 className="text-center fw-bold"
//               >
//                 No matching DPR found.
//               </CTableDataCell>
//             </CTableRow>
//           )}
//         </CTableBody>
//       </CTable>
//       <PaginateInput
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
//       />
//       {/* view Modal */}
//       <CModal
//         size="xl"
//         scrollable
//         visible={modalVisible}
//         onClose={() => setModalVisible(false)}
//       >
//         <CModalHeader>
//           <CModalTitle>
//             DPR Data :&nbsp;
//             <span className="badge bg-success">{formData.site_id}</span>{" "}
//           </CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           {selectedInventory && (
//             <>
//               <CTable bordered responsive>
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
//                               <CTable className=" border-0">
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

// export default SiteTechnicianDprDashboard;

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
import CIcon from "@coreui/icons-react";
import { cilX } from "@coreui/icons";

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
  const [{ dprs, loadingDprs, loadingSiteIds, siteIds }, dispatch] = useReducer(
    reducer,
    {
      dprs: [],
      loadingDprs: true,
      error: "",
      siteIds: [],
      loadingSiteIds: true,
      sitesError: "",
    }
  );

  const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);

  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [site_id, setSiteId] = useState("all");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState(null);
  const [formData, setFormData] = useState({});
  let adminroute = "";
  if (userInfo.role === "Master Admin") adminroute = "master-admin";
  else if (userInfo.role === "Service Admin") adminroute = "service-admin";
  // eslint-disable-next-line no-unused-vars
  else if (userInfo.role === "Project Admin") adminroute = "project-admin";

  const fetchDprMonthWise = async () => {
    dispatch({ type: "FETCH_DPR_REQUEST" });
    try {
      const payload = { month, year, siteId: site_id };
      const result = await axios.post(
        "/api/v1/techniciandprs/monthly",
        payload,
        { headers: { Authorization: `Bearer ${authtoken}` } }
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

  useEffect(() => {
    fetchDprMonthWise();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, year, site_id, authtoken]);

  useEffect(() => {
    const fetchSiteIds = async () => {
      dispatch({ type: "FETCH_SITEID_REQUEST" });
      try {
        const result = await axios.get(`/api/v1/sites`, {
          headers: { Authorization: `Bearer ${authtoken}` },
        });

        dispatch({ type: "FETCH_SITEID_SUCCESS", payload: result.data.data });
      } catch (error) {
        dispatch({
          type: "FETCH_SITEID_FAIL",
          payload: error.response?.data?.error || error.response?.data?.message,
        });
        toast.error(
          error.response?.data?.error || error.response?.data?.message
        );
      }
    };

    fetchSiteIds();
  }, [authtoken]);

  const openModal = (dpr) => {
    setSelectedInventory(dpr);
    setFormData(dpr);
    setModalVisible(true);
  };
  // Process the data to create proper headers with weeks inserted after every 7 days
  const processDprData = () => {
    if (!dprs.length) return { headers: [], weekHeaders: [] };

    // Extract all dates and weeks from the first site (all sites should have same structure)
    const dateEntries = [];
    const weekEntries = [];

    dprs[0].month_wise_data.forEach((entry) => {
      if (entry.date) {
        dateEntries.push({
          key: entry.date,
          type: "date",
          value: entry.date,
          // Parse date for sorting
          dateObj: new Date(
            parseInt(entry.date.split("-")[2]),
            parseInt(entry.date.split("-")[1]) - 1,
            parseInt(entry.date.split("-")[0])
          ),
        });
      } else if (entry.week) {
        weekEntries.push({
          key: entry.week,
          type: "week",
          value: entry.week,
          weekNum: parseInt(entry.week.replace("Week ", "")),
        });
      }
    });

    // Sort dates chronologically
    dateEntries.sort((a, b) => a.dateObj - b.dateObj);

    // Sort weeks numerically
    weekEntries.sort((a, b) => a.weekNum - b.weekNum);

    // Insert weeks after every 7 days
    const headers = [];
    const weekHeaders = [];

    let dayCount = 0;
    let weekIndex = 0;

    dateEntries.forEach((date, index) => {
      headers.push(date);
      dayCount++;

      // After 7 days, insert the corresponding week summary
      if (dayCount === 7 && weekIndex < weekEntries.length) {
        const weekEntry = weekEntries[weekIndex];
        headers.push(weekEntry);

        // Add to week headers for the table
        weekHeaders.push({ week: weekEntry.value, span: 8 }); // 7 days + 1 week column

        dayCount = 0;
        weekIndex++;
      }
    });

    // Add any remaining weeks (if any)
    while (weekIndex < weekEntries.length) {
      const weekEntry = weekEntries[weekIndex];
      headers.push(weekEntry);
      weekHeaders.push({ week: weekEntry.value, span: 1 });
      weekIndex++;
    }

    return { headers, weekHeaders };
  };

  const { headers, weekHeaders } = processDprData();

  const handleSiteNameChange = (e) => {
    const selectedSiteId = e.target.value;
    setSiteId(selectedSiteId);
  };

  return (
    <div className="p-2">
      <h2 className="text-center mb-4">Monthly DPR</h2>

      <div className="d-flex justify-content-end mb-3">
        <Link
          className="btn btn-sm btn-secondary m-1"
          to={`/site-technician/dpr/add-dpr`}
        >
          Add DPR
        </Link>
      </div>

      <CRow className="justify-content-end mb-3">
        <CCol md={3} className="m-1">
          <CFormSelect
            name="site_id"
            value={site_id}
            onChange={handleSiteNameChange}
          >
            <option value="all">All</option>
            {loadingSiteIds && <LoadingSpinner />}
            {siteIds?.length > 0 &&
              siteIds.map((item) => (
                <option key={item.site_id} value={item.site_id}>
                  {item.site_id}
                </option>
              ))}
          </CFormSelect>
        </CCol>

        <CCol md={2} className="m-1">
          <CFormSelect
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
          >
            <option value="">Select Month</option>
            <option value={1}>January</option>
            <option value={2}>February</option>
            <option value={3}>March</option>
            <option value={4}>April</option>
            <option value={5}>May</option>
            <option value={6}>June</option>
            <option value={7}>July</option>
            <option value={8}>August</option>
            <option value={9}>September</option>
            <option value={10}>October</option>
            <option value={11}>November</option>
            <option value={12}>December</option>
          </CFormSelect>
        </CCol>

        <CCol md={2} className="m-1">
          <CFormSelect
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          >
            <option value="">Select Year</option>
            {Array.from({ length: 10 }, (_, i) => {
              const y = new Date().getFullYear() - i; // last 10 years
              return (
                <option key={y} value={y}>
                  {y}
                </option>
              );
            })}
          </CFormSelect>
        </CCol>
      </CRow>

      <div style={{}}>
        <CTable bordered hover responsive>
          <CTableHead color="secondary" style={{ minHeight: "200px" }}>
            <CTableRow>
              <CTableHeaderCell
                rowSpan={2}
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 5,
                  background: "#f8f9fa",
                }}
              >
                Sr.
              </CTableHeaderCell>

              <CTableHeaderCell
                rowSpan={2}
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 5,
                  background: "#f8f9fa",
                  minWidth: "100px",
                }}
              >
                Site Name
              </CTableHeaderCell>

              {/* <CTableHeaderCell
                rowSpan={2}
                style={{
                  position: "sticky",
                  top: 0,
                  left: 0,
                  zIndex: 6,
                  background: "#f8f9fa",
                  minWidth: "120px",
                }}
              >
                Robots Details
              </CTableHeaderCell> */}

              <CTableHeaderCell
                rowSpan={2}
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 5,
                  background: "#f8f9fa",
                }}
              >
                Robots Qty
              </CTableHeaderCell>

              {/* {headers.map((header, idx) => (
                <CTableHeaderCell
                  key={idx}
                  style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 5,
                    background: header.type === "week" ? "#fff200" : "#f8f9fa",
                  }}
                >
                  {header.value}
                </CTableHeaderCell>
              ))} */}

              <CTableHeaderCell
                rowSpan={2}
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 5,
                  background: "#f8f9fa",
                }}
              >
                Action
              </CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {loadingDprs ? (
              <CTableRow>
                <CTableDataCell colSpan={3}>
                  <LoadingSpinner />
                </CTableDataCell>
              </CTableRow>
            ) : dprs.length ? (
              dprs.map((site, siteIndex) => (
                <CTableRow key={site.site_id}>
                  <CTableDataCell>{siteIndex + 1}</CTableDataCell>
                  <CTableDataCell>{site.site_id}</CTableDataCell>
                  <CTableDataCell>{site.total_robots}</CTableDataCell>
                  <CTableDataCell
                    style={{
                      minWidth: "100px",
                      textAlign: "center",
                      verticalAlign: "middle",
                    }}
                  >
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => openModal(site)}
                    >
                      View
                    </button>
                  </CTableDataCell>
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan={3}>No Data Found</CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>
      </div>

      <CModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        size="lg"
      >
        <CModalHeader closeButton={false}>
          <CModalTitle>
            DPR Details -{" "}
            <CBadge color="success"> {selectedInventory?.site_id}</CBadge>
          </CModalTitle>
          <button
            type="button"
            className=" border-0 ms-auto py-0 px-1"
            onClick={() => setModalVisible(false)}
            style={{ background: "none" }}
          >
            <CIcon icon={cilX} size="lg" />
          </button>
        </CModalHeader>
        <CModalBody>
          {selectedInventory && (
            <div>
              <h5>Site Information</h5>
              <p>
                <strong>Site ID:</strong> {selectedInventory.site_id}
              </p>
              <p>
                <strong>Total Robots:</strong>{" "}
                <CBadge color="warning">
                  {selectedInventory.total_robots}
                </CBadge>
              </p>

              <h5 className="mt-4">Monthly Data</h5>
              <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                <CTable striped bordered>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Date/Week</CTableHeaderCell>
                      <CTableHeaderCell>Robots Uptime</CTableHeaderCell>
                      <CTableHeaderCell>Robots Availability</CTableHeaderCell>
                      <CTableHeaderCell>Due to Oxidation</CTableHeaderCell>
                      <CTableHeaderCell>Due to Offline</CTableHeaderCell>
                      <CTableHeaderCell>Battery Issue</CTableHeaderCell>
                      <CTableHeaderCell>Due to Vegetation</CTableHeaderCell>
                      <CTableHeaderCell>Due to Client</CTableHeaderCell>
                      <CTableHeaderCell>Due to Service</CTableHeaderCell>
                      <CTableHeaderCell>Due to Timer</CTableHeaderCell>
                      <CTableHeaderCell>Due to Breakdown</CTableHeaderCell>
                      <CTableHeaderCell>
                        Material Unavailability
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {selectedInventory.month_wise_data.map((entry, index) => (
                      <CTableRow key={index}>
                        <CTableDataCell
                          style={
                            entry.week ? { backgroundColor: "#dbd67aff" } : {}
                          }
                        >
                          {entry.date || entry.week}
                        </CTableDataCell>
                        <CTableDataCell>{entry.robots_uptime}</CTableDataCell>
                        <CTableDataCell>
                          {entry.robots_availability}
                        </CTableDataCell>
                        <CTableDataCell>
                          {entry.due_to_oxidation}
                        </CTableDataCell>
                        <CTableDataCell>{entry.due_to_offline}</CTableDataCell>
                        <CTableDataCell>
                          {entry.due_to_battery_issue}
                        </CTableDataCell>
                        <CTableDataCell>
                          {entry.due_to_vegetation}
                        </CTableDataCell>
                        <CTableDataCell>{entry.due_to_client}</CTableDataCell>
                        <CTableDataCell>{entry.due_to_service}</CTableDataCell>
                        <CTableDataCell>{entry.due_to_timer}</CTableDataCell>
                        <CTableDataCell>
                          {entry.due_to_breakdown}
                        </CTableDataCell>
                        <CTableDataCell>
                          {entry.due_to_material_unavailability}
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              </div>
            </div>
          )}
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
    </div>
  );
};

export default AllSiteDpr;
