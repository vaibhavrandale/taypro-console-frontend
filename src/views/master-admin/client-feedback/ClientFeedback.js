// import React, { useEffect, useReducer, useState } from "react";
// import {
//   CRow,
//   CCol,
//   CInputGroup,
//   CFormInput,
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CCard,
// } from "@coreui/react";
// import toast from "react-hot-toast";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import LoadingSpinner from "../../../components/LoadingSpinner";
// import PaginateInput from "../../../components/PaginateInput";
// import * as XLSX from "xlsx"; // Import xlsx for Excel export
// import { Link } from "react-router-dom";
// import moment from "moment";
// import { BsStar, BsStarFill } from "react-icons/bs";
// import CIcon from "@coreui/icons-react";
// import { cilX } from "@coreui/icons";

// const reducer = (state, action) => {
//   switch (action.type) {
//     case "FETCH_FEEDBACK_REQUEST":
//       return { ...state, loadingFeedbacks: true, error: "" };
//     case "FETCH_FEEDBACK_SUCCESS":
//       return {
//         ...state,
//         loadingFeedbacks: false,
//         feedbacks: action.payload.data,
//         totalPages: action.payload.totalPages, // Use API-provided totalPages
//         hasNextPage: action.payload.hasNextPage,
//         hasPrevPage: action.payload.hasPrevPage,
//       };
//     case "FETCH_FEEDBACK_FAIL":
//       return { ...state, loadingFeedbacks: false, error: action.payload };
//     default:
//       return state;
//   }
// };

// const ClientFeedback = () => {
//   const [
//     {
//       error,
//       feedbacks,
//       loadingFeedbacks,
//       totalPages,
//       hasNextPage,
//       hasPrevPage,
//     },
//     dispatch,
//   ] = useReducer(reducer, {
//     feedbacks: [],
//     loading: true,
//     loadingFeedbacks: true,
//     error: "",
//     totalPages: 1,
//     hasNextPage: false,
//     hasPrevPage: false,
//   });
//   const authtoken = useSelector((state) => state.authtoken);
//   //   const [searchTerm, setSearchTerm] = useState("");
//   const [pageInput, setPageInput] = useState("");
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(10);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [feedbackModal, setFeedbackModal] = useState(false);
//   const [currentFeedback, setCurrentFeedback] = useState(null);

//   useEffect(() => {
//     let pagination = {
//       pg: page,
//       limit: limit,
//     };
//     const fetchfeedbacks = async () => {
//       dispatch({ type: "FETCH_FEEDBACK_REQUEST" });
//       try {
//         const result = await axios.post(
//           `/api/v1/customer-feedback/get-all`,
//           pagination,
//           {
//             headers: { Authorization: `Bearer ${authtoken}` },
//           },
//         );

//         console.log("Feedbacks fetched:", result.data.data.data);
//         let total = Math.ceil(
//           Number(result.data.data.total) / Number(result.data.data.limit),
//         );
//         let next = result.data.data.hasNextPage;
//         let prev = result.data.data.hasPrevPage;

//         dispatch({
//           type: "FETCH_FEEDBACK_SUCCESS",
//           payload: {
//             data: result.data.data.data,
//             totalPages: total,
//             hasNextPage: next,
//             hasPrevPage: prev,
//           },
//         });
//       } catch (error) {
//         dispatch({
//           type: "FETCH_FEEDBACK_FAIL",
//           payload: "Failed to fetch feedbacks",
//         });
//         toast.error("Failed to fetch feedbacks");
//       }
//     };

//     fetchfeedbacks();
//   }, [authtoken, limit, page]);

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

//   const exportToExcel = () => {
//     if (!feedbacks || feedbacks.length === 0) {
//       toast.error("No data available for export.");
//       return;
//     }

//     const excelData = feedbacks.map((item, index) => ({
//       "#": index + 1,

//       // Client Info
//       "Client Name": item.user?.username || "N/A",
//       "Client Email": item.user?.email || "N/A",
//       Designation: item.user?.designation || "No designation",

//       // Assigned Sites
//       "Site IDs":
//         item.user?.assigned_sites?.length > 0
//           ? item.user.assigned_sites.map((site) => site.site_id).join(", ")
//           : "No Sites",

//       // Portal Feedback
//       "Portal Rating": item.feedback_data?.rating ?? 0,
//       "Portal Comments": item.feedback_data?.comments?.trim() || "-",

//       // Technician Feedback
//       "Technician Assigned": item.technician_feedback_data
//         ?.is_technician_assigned
//         ? "Yes"
//         : "No",
//       "Technician Rating": item.technician_feedback_data?.rating ?? "-",
//       "Technician Comments":
//         item.technician_feedback_data?.comments?.trim() || "-",

//       // Service Feedback
//       "Service Rating": item.service_feedback_data?.rating ?? "-",
//       "Service Comments": item.service_feedback_data?.comments?.trim() || "-",

//       // Status
//       Status: item.status ? "Completed" : "Pending",

//       // Date
//       Date: moment(item.createdAt).format("DD/MM/YYYY hh:mm A"),
//       "Updated At": moment(item.updatedAt).format("DD/MM/YYYY hh:mm A"),
//     }));

//     const worksheet = XLSX.utils.json_to_sheet(excelData);
//     const workbook = XLSX.utils.book_new();

//     XLSX.utils.book_append_sheet(workbook, worksheet, "Client Feedback");

//     XLSX.writeFile(workbook, "Client_Feedback.xlsx");
//   };

//   const filteredFeedbacks = feedbacks.filter(
//     (feedback) =>
//       feedback.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       feedback.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       feedback.user.assigned_sites?.some((site) =>
//         site.site_id.toLowerCase().includes(searchTerm.toLowerCase()),
//       ),
//   );
//   const StarRating = ({ rating, onChange, section }) => {
//     const currentRating = Number(rating) || 0;

//     return (
//       <div
//         className="d-flex gap-2"
//         style={{ cursor: "pointer", fontSize: "1.8rem" }}
//       >
//         {[1, 2, 3, 4, 5].map((star) => {
//           const FilledStar = star <= currentRating;
//           return FilledStar ? (
//             <BsStarFill
//               size={20}
//               key={star}
//               color="#ffc107"
//               onClick={() =>
//                 onChange({
//                   //  target: { name: "rating", value: star }
//                   target: { name: "rating", value: star, section },
//                 })
//               }
//               onKeyDown={(e) => {
//                 if (e.key === "Enter")
//                   onChange({
//                     target: { name: "rating", value: star, section },
//                   });
//               }}
//               role="radio"
//               tabIndex={0}
//               aria-checked={star === currentRating}
//               aria-label={`${star} Star${star > 1 ? "s" : ""}`}
//             />
//           ) : (
//             <BsStar
//               size={20}
//               key={star}
//               color="#e4e5e9"
//               onClick={() =>
//                 onChange({ target: { name: "rating", value: star, section } })
//               }
//               onKeyDown={(e) => {
//                 if (e.key === "Enter")
//                   onChange({
//                     target: { name: "rating", value: star, section },
//                   });
//               }}
//               role="radio"
//               tabIndex={0}
//               aria-checked={star === currentRating}
//               aria-label={`${star} Star${star > 1 ? "s" : ""}`}
//             />
//           );
//         })}
//       </div>
//     );
//   };

//   const [openMonth, setOpenMonth] = useState(null);

//   const groupedByMonth = filteredFeedbacks.reduce((acc, item) => {
//     const monthKey = moment(item.createdAt).format("MMMM YYYY");
//     if (!acc[monthKey]) acc[monthKey] = [];
//     acc[monthKey].push(item);
//     return acc;
//   }, {});
//   return (
//     <div className="">
//       <h2 className="text-center  mb-4">Client Feedbacks</h2>
//       <div className="d-flex justify-content-end mb-3">
//         <Link className="btn btn-sm btn-primary m-1" onClick={exportToExcel}>
//           Export
//         </Link>
//       </div>
//       <CRow className="justify-content-end">
//         <CCol xs={12} sm={10} md={8} lg={5}>
//           <CInputGroup className="mb-3">
//             <CFormInput
//               type="text"
//               placeholder="Search by username,site_id ..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </CInputGroup>
//         </CCol>
//       </CRow>
//       {/* feedbacks Table */}
//       {/* ================= ADMIN MONTH-WISE VIEW ================= */}
//       {loadingFeedbacks ? (
//         <LoadingSpinner />
//       ) : error ? (
//         <div className="text-center text-danger fw-bold">{error}</div>
//       ) : Object.keys(groupedByMonth).length === 0 ? (
//         <div className="text-center fw-bold">No feedbacks found.</div>
//       ) : (
//         Object.entries(groupedByMonth).map(([month, items]) => {
//           const completedItems = items.filter((f) => f.status === true);

//           const validServiceItems = completedItems.filter(
//             (f) => typeof f.service_feedback_data?.rating === "number",
//           );

//           const avgServiceRating =
//             validServiceItems.length > 0
//               ? (
//                   validServiceItems.reduce(
//                     (sum, f) => sum + f.service_feedback_data.rating,
//                     0,
//                   ) / validServiceItems.length
//                 ).toFixed(1)
//               : "N/A";

//           const validPortalItems = completedItems.filter(
//             (f) => typeof f.feedback_data?.rating === "number",
//           );

//           const avgPortalRating =
//             validPortalItems.length > 0
//               ? (
//                   validPortalItems.reduce(
//                     (sum, f) => sum + f.feedback_data.rating,
//                     0,
//                   ) / validPortalItems.length
//                 ).toFixed(1)
//               : "N/A";

//           const criticalCount = items.filter((f) => {
//             const ratings = [
//               f.feedback_data?.rating,
//               f.service_feedback_data?.rating,
//               f.technician_feedback_data?.rating,
//             ].filter(Boolean);
//             return ratings.some((r) => r <= 2);
//           }).length;

//           return (
//             <CCard key={month} className="mb-3 shadow-sm">
//               {/* Month Header */}
//               <div
//                 className="d-flex justify-content-between align-items-center px-3 py-3 "
//                 style={{ cursor: "pointer" }}
//                 onClick={() => setOpenMonth(openMonth === month ? null : month)}
//               >
//                 <div>
//                   <h6 className="mb-0 fw-bold">{month}</h6>
//                   <small className="text-muted">{items.length} feedbacks</small>
//                 </div>

//                 <div className="d-flex flex-wrap gap-2 align-items-center">
//                   {/* Portal Rating */}
//                   <div className="d-flex align-items-center gap-1 px-2 py-1 rounded  border">
//                     <span className="small text-success fw-semibold">
//                       Portal
//                     </span>
//                     <span className="fw-bold text-warning">
//                       ⭐ {isNaN(avgPortalRating) ? "N/A" : avgPortalRating}
//                     </span>
//                   </div>

//                   {/* Service Rating */}
//                   <div className="d-flex align-items-center gap-1 px-2 py-1 rounded  border">
//                     <span className="small text-info fw-semibold">Service</span>
//                     <span className="fw-bold text-warning">
//                       ⭐ {isNaN(avgServiceRating) ? "N/A" : avgServiceRating}
//                     </span>
//                   </div>

//                   {/* Critical Badge */}
//                   {criticalCount > 0 && (
//                     <div className="px-2 py-1 rounded bg-danger text-white fw-semibold small">
//                       🚨 {criticalCount} Critical
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Month Body */}
//               {openMonth === month && (
//                 <div className="p-3 ">
//                   <CRow className="g-3">
//                     {items.map((feedback) => (
//                       <CCol key={feedback._id} xs={12} lg={6}>
//                         <CCard className="h-100 shadow-sm border rounded-0">
//                           {/* ================= CARD HEADER ================= */}
//                           <div className="p-3 border-bottom d-flex justify-content-between align-items-start">
//                             <div>
//                               <h6 className="mb-0 fw-bold">
//                                 {feedback.user.username}
//                               </h6>
//                               <small className="text-muted">
//                                 {feedback.user.email}
//                               </small>
//                               <div className="text-muted small">
//                                 Site:{" "}
//                                 {feedback.user?.assigned_sites
//                                   ?.map((site) => site.site_id)
//                                   .join(", ") || "No Sites"}
//                               </div>
//                             </div>

//                             <div className="text-end">
//                               <span
//                                 className={`badge ${
//                                   feedback.status ? "bg-success" : "bg-warning"
//                                 }`}
//                               >
//                                 {feedback.status ? "Completed" : "Pending"}
//                               </span>
//                               <div className="small text-muted mt-1">
//                                 {moment(feedback.createdAt).format(
//                                   "DD MMM YYYY",
//                                 )}
//                               </div>
//                             </div>
//                           </div>

//                           {/* ================= CARD BODY ================= */}
//                           <div className="p-3">
//                             <CRow className="g-3">
//                               {/* PORTAL */}
//                               <CCol md={4}>
//                                 <div className="border rounded p-2 h-100">
//                                   <h6 className="text-warning mb-1">Portal</h6>
//                                   <div className="fw-semibold">
//                                     ⭐ {feedback.feedback_data?.rating ?? "N/A"}
//                                   </div>
//                                   <p className="small text-muted mb-0">
//                                     {feedback.feedback_data?.comments ||
//                                       "No comments"}
//                                   </p>
//                                 </div>
//                               </CCol>

//                               {feedback.technician_feedback_data
//                                 ?.is_technician_assigned && (
//                                 <CCol md={4}>
//                                   <div className="border rounded p-2 h-100">
//                                     <h6 className="text-success mb-1">
//                                       Technician
//                                     </h6>

//                                     {feedback.technician_feedback_data
//                                       ?.is_technician_assigned ? (
//                                       <>
//                                         <div className="fw-semibold">
//                                           ⭐{" "}
//                                           {feedback.technician_feedback_data
//                                             ?.rating ?? "N/A"}
//                                         </div>
//                                         <p className="small text-muted mb-0">
//                                           {feedback.technician_feedback_data
//                                             ?.comments || "No comments"}
//                                         </p>
//                                       </>
//                                     ) : (
//                                       <p className="small text-muted mb-0">
//                                         Technician not assigned
//                                       </p>
//                                     )}
//                                   </div>
//                                 </CCol>
//                               )}

//                               {/* SERVICE */}
//                               <CCol md={4}>
//                                 <div className="border rounded p-2 h-100">
//                                   <h6 className="text-info mb-1">Service</h6>
//                                   <div className="fw-semibold">
//                                     ⭐{" "}
//                                     {feedback.service_feedback_data?.rating ??
//                                       "N/A"}
//                                   </div>
//                                   <p className="small text-muted mb-0">
//                                     {feedback.service_feedback_data?.comments ||
//                                       "No comments"}
//                                   </p>
//                                 </div>
//                               </CCol>
//                             </CRow>
//                           </div>
//                         </CCard>
//                       </CCol>
//                     ))}
//                   </CRow>
//                 </div>
//               )}
//             </CCard>
//           );
//         })
//       )}

//       {/* Feedback Modal */}
//       {feedbackModal && currentFeedback && (
//         <CModal
//           backdrop="static"
//           scrollable
//           alignment="top"
//           visible={feedbackModal}
//           size="xl"
//           onClose={() => setFeedbackModal(false)}
//         >
//           <CModalHeader closeButton={false}>
//             <CModalTitle>Client Feedback Details</CModalTitle>
//             <button
//               type="button"
//               className="border-0 ms-auto py-0 px-1"
//               onClick={() => setFeedbackModal(false)}
//               style={{ background: "none" }}
//             >
//               <CIcon icon={cilX} size="lg" />
//             </button>
//           </CModalHeader>

//           <CModalBody>
//             <CRow className="g-4">
//               {/* PORTAL FEEDBACK */}
//               <CCol md={4}>
//                 <CCard className="shadow-sm rounded-3 p-3 border-0 bg-light h-100">
//                   <h6 className="mb-3 text-warning fw-bold">Portal Feedback</h6>
//                   <p className="mb-2">
//                     <strong>Rating:</strong>{" "}
//                     <StarRating
//                       rating={currentFeedback.feedback_data?.rating || 0}
//                       readOnly
//                     />
//                   </p>
//                   <p className="mb-0">
//                     <strong>Comments:</strong>
//                     <br />
//                     {currentFeedback.feedback_data?.comments || "No comments"}
//                   </p>
//                 </CCard>
//               </CCol>

//               {/* TECHNICIAN FEEDBACK */}
//               <CCol md={4}>
//                 <CCard className="shadow-sm rounded-3 p-3 border-0 bg-light h-100">
//                   <h6 className="mb-3 text-success fw-bold">
//                     Technician Feedback
//                   </h6>

//                   {currentFeedback.technician_feedback_data
//                     ?.is_technician_assigned ? (
//                     <>
//                       <p className="mb-2">
//                         <strong>Rating:</strong>{" "}
//                         <StarRating
//                           rating={
//                             currentFeedback.technician_feedback_data?.rating ||
//                             0
//                           }
//                           readOnly
//                         />
//                       </p>
//                       <p className="mb-0">
//                         <strong>Comments:</strong>
//                         <br />
//                         {currentFeedback.technician_feedback_data?.comments ||
//                           "No comments"}
//                       </p>
//                     </>
//                   ) : (
//                     <p className="text-muted">Technician not assigned yet.</p>
//                   )}
//                 </CCard>
//               </CCol>

//               {/* SERVICE FEEDBACK */}
//               <CCol md={4}>
//                 <CCard className="shadow-sm rounded-3 p-3 border-0 bg-light h-100">
//                   <h6 className="mb-3 text-info fw-bold">Service Feedback</h6>
//                   <p className="mb-2">
//                     <strong>Rating:</strong>{" "}
//                     <StarRating
//                       rating={
//                         currentFeedback.service_feedback_data?.rating || 0
//                       }
//                       readOnly
//                     />
//                   </p>
//                   <p className="mb-0">
//                     <strong>Comments:</strong>
//                     <br />
//                     {currentFeedback.service_feedback_data?.comments ||
//                       "No comments"}
//                   </p>
//                 </CCard>
//               </CCol>
//             </CRow>
//           </CModalBody>
//         </CModal>
//       )}

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
//     </div>
//   );
// };

import React, { useEffect, useReducer, useState } from "react";
import {
  CRow,
  CCol,
  CInputGroup,
  CFormInput,
  CFormSelect,
} from "@coreui/react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import moment from "moment";
import { Link } from "react-router-dom";

import LoadingSpinner from "../../../components/LoadingSpinner";
import MonthFeedbackCard from "./MonthFeedbackCard";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_FEEDBACK_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_FEEDBACK_SUCCESS":
      return { ...state, loading: false, feedbacks: action.payload };
    case "FETCH_FEEDBACK_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const ClientFeedback = () => {
  const [{ feedbacks, loading, error }, dispatch] = useReducer(reducer, {
    feedbacks: [],
    loading: false,
    error: "",
  });

  const authtoken = useSelector((state) => state.authtoken);

  /* ================= FILTERS ================= */
  const [siteId, setSiteId] = useState("");
  const [month, setMonth] = useState(moment().month() + 1);
  const [year, setYear] = useState(moment().year());
  const [searchTerm, setSearchTerm] = useState("");

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    if (!month || !year) return;

    const fetchFeedbacks = async () => {
      dispatch({ type: "FETCH_FEEDBACK_REQUEST" });
      try {
        const res = await axios.post(
          "/api/v1/customer-feedback/get-all",
          { month, year },
          { headers: { Authorization: `Bearer ${authtoken}` } },
        );

        dispatch({
          type: "FETCH_FEEDBACK_SUCCESS",
          payload: res.data.data,
        });
      } catch (err) {
        const message =
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Failed to fetch feedbacks";

        dispatch({
          type: "FETCH_FEEDBACK_FAIL",
          payload: message,
        });

        toast.error(message);
      }
    };

    fetchFeedbacks();
  }, [authtoken, month, year]);

  /* ================= FRONTEND FILTERING ================= */
  const filteredFeedbacks = feedbacks.filter((f) => {
    const matchesSearch =
      f.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.user.username?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSite =
      !siteId ||
      f.user.assigned_sites?.some((s) =>
        s.site_id.toLowerCase().includes(siteId.toLowerCase()),
      );

    return matchesSearch && matchesSite;
  });

  return (
    <div>
      <h2 className="text-center mb-4">Client Feedbacks</h2>

      {/* Top Bar */}
      <div className="d-flex justify-content-end mb-3">
        <Link className="btn btn-sm btn-primary">Export</Link>
      </div>

      {/* ================= FILTER BAR ================= */}
      <CRow className="mb-3 g-2">
        <CCol md={4}>
          <CFormInput
            placeholder="Filter by Site ID (optional)"
            value={siteId}
            onChange={(e) => setSiteId(e.target.value)}
          />
        </CCol>

        <CCol md={4}>
          <CFormSelect
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
          >
            {[...Array(12)].map((_, i) => (
              <option key={i} value={i + 1}>
                {moment().month(i).format("MMMM")}
              </option>
            ))}
          </CFormSelect>
        </CCol>

        <CCol md={4}>
          <CFormSelect
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          >
            {[year, year - 1, year - 2].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </CFormSelect>
        </CCol>
      </CRow>

      {/* Search */}
      <CRow className="justify-content-end">
        <CCol xs={12} md={6}>
          <CInputGroup>
            <CFormInput
              placeholder="Search by username or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </CInputGroup>
        </CCol>
      </CRow>

      {/* ================= CONTENT ================= */}
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="text-center text-danger fw-bold">{error}</div>
      ) : filteredFeedbacks.length === 0 ? (
        <div className="text-center fw-bold mt-4">No feedbacks found.</div>
      ) : (
        <MonthFeedbackCard
          month={`${moment()
            .month(month - 1)
            .format("MMMM")} ${year}`}
          items={filteredFeedbacks}
        />
      )}
    </div>
  );
};

export default ClientFeedback;
