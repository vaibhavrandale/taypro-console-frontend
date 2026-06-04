// import React, { useEffect, useReducer, useState } from "react";
// import {
//   CTable,
//   CTableHead,
//   CTableRow,
//   CTableHeaderCell,
//   CTableBody,
//   CTableDataCell,
//   CBadge,
//   CFormInput,
//   CRow,
//   CCol,
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CTooltip,
//   CImage,
// } from "@coreui/react";
// import { Link } from "react-router-dom";
// import toast from "react-hot-toast";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import "@coreui/react";
// import LoadingSpinner from "../../../components/LoadingSpinner";
// import { formatDistanceToNow } from "date-fns";
// import PaginateInput from "../../../components/PaginateInput";
// import LastActivity from "../../../components/LastActivity";
// import CIcon from "@coreui/icons-react";
// import { cilX } from "@coreui/icons";

// const reducer = (state, action) => {
//   switch (action.type) {
//     case "FETCH_CLIENT_TICKET_REQUEST":
//       return { ...state, loadingTickets: true, error: "" };
//     case "FETCH_CLIENT_TICKET_SUCCESS":
//       return {
//         ...state,
//         loadingTickets: false,
//         client_tickets: action.payload.data,
//         totalPages: action.payload.totalPages, // Use API-provided totalPages
//         hasNextPage: action.payload.hasNextPage,
//         hasPrevPage: action.payload.hasPrevPage,
//       };
//     case "FETCH_CLIENT_TICKET_FAIL":
//       return { ...state, loadingTickets: false, error: action.payload };

//     default:
//       return state;
//   }
// };

// const ClientTicketsDashboard = () => {
//   const [
//     {
//       error,
//       client_tickets,
//       loadingTickets,
//       totalPages,
//       hasNextPage,
//       hasPrevPage,
//     },
//     dispatch,
//   ] = useReducer(reducer, {
//     client_tickets: [],
//     loadingTickets: true,
//     error: "",
//     totalPages: 1,
//     hasNextPage: false,
//     hasPrevPage: false,
//   });

//   const [searchTerm, setSearchTerm] = useState("");
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedTicket, setSelectedTicket] = useState(null);
//   const [formData, setFormData] = useState({});
//   // const authtoken = useSelector((state) => state.authtoken);
//   const [pageInput, setPageInput] = useState("");
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(10);
//   const userInfo = useSelector((state) => state.userInfo);
//   let adminroute = "";

//   if (userInfo.role === "Master Admin") {
//     adminroute = "master-admin";
//   } else if (userInfo.role === "Service Admin") {
//     adminroute = "service-admin";
//   } else if (userInfo.role === "Project Admin") {
//     // eslint-disable-next-line no-unused-vars
//     adminroute = "project-admin";
//   } else if (userInfo?.role === "Master User") {
//     adminroute = "master-user";
//   } else if (userInfo?.role === "Service User") {
//     adminroute = "service-user";
//   } else if (userInfo?.role === "Project User") {
//     adminroute = "project-user";
//   }
//   useEffect(() => {
//     let pagination = {
//       pg: page,
//       limit: limit,
//     };

//     const fetchClientTickets = async () => {
//       dispatch({ type: "FETCH_CLIENT_TICKET_REQUEST" });

//       try {
//         const result = await axios.post(
//           `/api/v1/clienttickets/get-all`,
//           pagination,
//           {
//             //  headers: { Authorization: `Bearer ${authtoken}` }
//             withCredentials: true,
//           },
//         );

//         // Handle totalPages, hasNextPage, and hasPrevPage logic
//         let total = Math.ceil(
//           Number(result.data.total) / Number(result.data.limit),
//         );
//         let next = result.data.hasNextPage;
//         let prev = result.data.hasPrevPage;

//         // Dispatch success action with the fetched data and pagination info
//         dispatch({
//           type: "FETCH_CLIENT_TICKET_SUCCESS",
//           payload: {
//             data: result.data.data,
//             totalPages: total,
//             hasNextPage: next,
//             hasPrevPage: prev,
//           },
//         });
//       } catch (error) {
//         dispatch({
//           type: "FETCH_CLIENT_TICKET_FAIL",
//           payload: error.response.data.error,
//         });
//         toast.error(
//           error.response.data.error || "Failed to fetch the Client Tickets",
//         );
//       }
//     };

//     // Reset the delete state if successDelete flag is true
//     fetchClientTickets();
//   }, [limit, page]);

//   /** 🔍 Search Function */
//   const filteredTickets = client_tickets.filter(
//     (ticket) =>
//       ticket.ticket_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       ticket.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       ticket.created_by.name.toLowerCase().includes(searchTerm.toLowerCase()),
//   );

//   /** ✏️ Open Update Modal */
//   const openViewModal = (ticket) => {
//     setSelectedTicket(ticket);
//     setFormData(ticket);
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

//   const getTimeDifference = (start, end) => {
//     if (!start || !end) return "NA";

//     const startDate = new Date(start);
//     const endDate = new Date(end);

//     const diffMs = endDate - startDate;

//     const minutes = Math.floor(diffMs / (1000 * 60));
//     const hours = Math.floor(diffMs / (1000 * 60 * 60));
//     const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
//     const months = Math.floor(days / 30);
//     const years = Math.floor(days / 365);

//     if (minutes < 60) return `${minutes} min`;
//     if (hours < 24) return `${hours} hr`;
//     if (days < 30) return `${days} day${days > 1 ? "s" : ""}`;
//     if (months < 12) return `${months} month${months > 1 ? "s" : ""}`;

//     return `${years} year${years > 1 ? "s" : ""}`;
//   };
//   const exportToCSV = () => {
//     if (!filteredTickets || filteredTickets.length === 0) {
//       toast.error("No data to export");
//       return;
//     }

//     const makeHyperlink = (url, label = "View") => {
//       if (!url) return "";
//       return `=HYPERLINK("${url}","${label}")`;
//     };

//     const headers = [
//       "Ticket ID",
//       "Site ID",
//       "Subject",
//       "Description",
//       "Status",

//       "Created By Name",
//       "Created By Email",
//       "Created By Designation",

//       "Resolution Notes",

//       "Resolved By Name",
//       "Resolved By Email",
//       "Resolved By Role",

//       "Created At",
//       "Updated At",
//       "Resolved At",
//       "Resolution Time",

//       "Creation Image 1",
//       "Creation Image 2",
//       "Resolution Image 1",
//       "Resolution Image 2",
//     ];

//     const rows = filteredTickets.map((ticket) => [
//       ticket.ticket_id,
//       ticket.site_id,
//       ticket.subject,
//       ticket.description,
//       ticket.status,

//       ticket.created_by?.name || "",
//       ticket.created_by?.email || "",
//       ticket.created_by?.designation || "",

//       ticket.resolution_notes || "",

//       ticket.resolved_by?.name || "",
//       ticket.resolved_by?.email || "",
//       ticket.resolved_by?.role || "",

//       new Date(ticket.createdAt).toLocaleString("en-GB"),
//       new Date(ticket.updatedAt).toLocaleString("en-GB"),
//       ticket.resolved_at
//         ? new Date(ticket.resolved_at).toLocaleString("en-GB")
//         : "NA",

//       ticket.status === "Resolved"
//         ? getTimeDifference(ticket.createdAt, ticket.resolved_at)
//         : "NA",

//       makeHyperlink(ticket.creation_image1, "View Image"),
//       makeHyperlink(ticket.creation_image2, "View Image"),
//       makeHyperlink(ticket.resolution_image1, "View Image"),
//       makeHyperlink(ticket.resolution_image2, "View Image"),
//     ]);

//     const csvContent =
//       "data:text/csv;charset=utf-8," +
//       [headers, ...rows]
//         .map((row) =>
//           row
//             .map((value) => `"${String(value).replace(/"/g, '""')}"`)
//             .join(","),
//         )
//         .join("\n");

//     const link = document.createElement("a");
//     link.href = encodeURI(csvContent);
//     link.download = `client_tickets_full_${Date.now()}.csv`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return (
//     <div className="">
//       <h2 className="text-center">Client Tickets</h2>
//       <div className="d-flex justify-content-end my-2 align-items-center">
//         <div>
//           {!["Master User", "Project User", "Service User"].includes(
//             userInfo?.role,
//           ) && (
//             <Link
//               to="create-new-client-ticket"
//               className="btn btn-sm btn-primary me-2"
//             >
//               NEW
//             </Link>
//           )}
//         </div>

//         <button className="btn btn-sm btn-success" onClick={exportToCSV}>
//           Export
//         </button>
//       </div>

//       {/* 🔍 Search Input */}
//       <CRow className="justify-content-end">
//         <CCol md={4}>
//           <CFormInput
//             type="text"
//             placeholder="Search by Ticket Id, Subject, or Status"
//             className="mb-3"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </CCol>
//       </CRow>

//       {/* 📋 Ticket Table */}
//       <CTable bordered hover responsive className="text-center bg-important">
//         <CTableHead color="secondary">
//           <CTableRow>
//             <CTableHeaderCell>#</CTableHeaderCell>
//             <CTableHeaderCell>Ticket ID</CTableHeaderCell>
//             <CTableHeaderCell>Site Id</CTableHeaderCell>
//             <CTableHeaderCell style={{ minWidth: "300px" }}>
//               Subject
//             </CTableHeaderCell>
//             <CTableHeaderCell>Status</CTableHeaderCell>

//             <CTableHeaderCell style={{ minWidth: "200px" }}>
//               Created By
//             </CTableHeaderCell>
//             <CTableHeaderCell>Created Date</CTableHeaderCell>
//             <CTableHeaderCell style={{ minWidth: "200px" }}>
//               Resolved By
//             </CTableHeaderCell>
//             <CTableHeaderCell>Resolved Date</CTableHeaderCell>
//             <CTableHeaderCell>Resolving Time Duration</CTableHeaderCell>
//             <CTableHeaderCell style={{ minWidth: "200px" }}>
//               Action
//             </CTableHeaderCell>
//           </CTableRow>
//         </CTableHead>
//         <CTableBody>
//           {loadingTickets ? (
//             <CTableRow>
//               <CTableDataCell colSpan="11" className="text-center">
//                 <LoadingSpinner />
//               </CTableDataCell>
//             </CTableRow>
//           ) : error ? (
//             <CTableRow>
//               <CTableDataCell colSpan="11" className="text-center">
//                 {error}
//               </CTableDataCell>
//             </CTableRow>
//           ) : filteredTickets.length > 0 ? (
//             filteredTickets.map((ticket, index) => (
//               <CTableRow key={index}>
//                 <CTableDataCell>{index + 1}</CTableDataCell>
//                 <CTableDataCell style={{ minWidth: "150px" }}>
//                   {/* {ticket.ticket_id} */}
//                   <Link
//                     className="m-1"
//                     color="primary"
//                     size="sm"
//                     onClick={() => openViewModal(ticket)}
//                   >
//                     {ticket.ticket_id}
//                   </Link>
//                 </CTableDataCell>
//                 <CTableDataCell style={{ minWidth: "150px" }}>
//                   {ticket.site_id}
//                 </CTableDataCell>
//                 <CTableDataCell>
//                   {ticket.subject.length > 30
//                     ? `${ticket.subject.slice(0, 30)}...`
//                     : ticket.subject}
//                 </CTableDataCell>

//                 <CTableDataCell>
//                   <CBadge
//                     color={
//                       ticket.status === "Resolved"
//                         ? "success"
//                         : ticket.status === "Open"
//                           ? "danger"
//                           : "warning"
//                     }
//                   >
//                     {ticket.status}
//                   </CBadge>
//                 </CTableDataCell>
//                 <CTableDataCell>{ticket.created_by.name}</CTableDataCell>

//                 <CTableDataCell style={{ minWidth: "150px" }}>
//                   {new Date(ticket.createdAt).toLocaleString("en-GB", {
//                     year: "numeric",
//                     month: "numeric",
//                     day: "numeric",
//                     hour: "2-digit",
//                     minute: "2-digit",
//                     second: "2-digit",
//                     hour12: true,
//                   })}
//                 </CTableDataCell>
//                 <CTableDataCell>
//                   {ticket.status === "Resolved" ? (
//                     ticket.resolved_by.name
//                   ) : (
//                     <CBadge
//                       color={
//                         ticket.status === "Resolved"
//                           ? "success"
//                           : ticket.status === "Open"
//                             ? "danger"
//                             : "warning"
//                       }
//                     >
//                       {ticket.status}
//                     </CBadge>
//                   )}
//                 </CTableDataCell>
//                 <CTableDataCell style={{ minWidth: "150px" }}>
//                   {ticket.status === "Resolved"
//                     ? new Date(ticket.resolved_at).toLocaleString("en-GB", {
//                         year: "numeric",
//                         month: "numeric",
//                         day: "numeric",
//                         hour: "2-digit",
//                         minute: "2-digit",
//                         second: "2-digit",
//                         hour12: true,
//                       })
//                     : "NA"}
//                 </CTableDataCell>
//                 <CTableDataCell style={{ minWidth: "150px" }}>
//                   {ticket.status === "Resolved"
//                     ? getTimeDifference(ticket.createdAt, ticket.resolved_at)
//                     : "NA"}
//                 </CTableDataCell>
//                 <CTableDataCell>
//                   <Link
//                     className="btn btn-sm btn-secondary m-1"
//                     color="primary"
//                     size="sm"
//                     onClick={() => openViewModal(ticket)}
//                   >
//                     view
//                   </Link>
//                   <Link
//                     className="btn btn-sm btn-success m-1"
//                     to={`update-client-ticket/${ticket._id}`}
//                     color="primary"
//                     size="sm"
//                   >
//                     Update
//                   </Link>
//                 </CTableDataCell>
//               </CTableRow>
//             ))
//           ) : (
//             <CTableRow>
//               <CTableDataCell colSpan="11" className="text-center text-danger">
//                 No tickets found.
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

//       {/* 🛠 view Modal */}
//       <CModal
//         size="xl"
//         scrollable
//         visible={modalVisible}
//         onClose={() => setModalVisible(false)}
//       >
//         <CModalHeader closeButton={false}>
//           <CModalTitle>
//             Update Ticket:{" "}
//             <span className="badge bg-success">{formData.ticket_id}</span>
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
//           {selectedTicket && (
//             <>
//               <CTable
//                 bordered
//                 striped
//                 responsive
//                 className="shadow-sm rounded overflow-hidden"
//               >
//                 <CTableHead color="primary" className="text-white">
//                   <CTableRow>
//                     <CTableHeaderCell className="fw-bold">
//                       Field
//                     </CTableHeaderCell>
//                     <CTableHeaderCell className="fw-bold">
//                       Value
//                     </CTableHeaderCell>
//                   </CTableRow>
//                 </CTableHead>

//                 <CTableBody>
//                   {Object.entries({
//                     "Ticket ID": formData.ticket_id,
//                     Subject: formData.subject,
//                     Description: formData.description,
//                     Status: (
//                       <CBadge
//                         color={
//                           formData.status === "Resolved"
//                             ? "success"
//                             : formData.status === "Open"
//                               ? "danger"
//                               : "warning"
//                         }
//                         className="px-3 py-2"
//                       >
//                         {formData.status}
//                       </CBadge>
//                     ),
//                     "Resolution Notes": formData.resolution_notes,
//                     "Created By": formData.created_by.name,
//                     "Created By Email": formData.created_by.email,
//                     "Created At": new Date(formData.createdAt).toLocaleString(
//                       "en-GB",
//                       {
//                         day: "2-digit",
//                         month: "2-digit",
//                         year: "numeric",
//                         hour: "2-digit",
//                         minute: "2-digit",
//                         second: "2-digit",
//                         hour12: true,
//                       },
//                     ),
//                     ...(formData.status === "Resolved" && {
//                       "Resolved By": formData.resolved_by?.name || "--",
//                       "Resolved By Email": formData.resolved_by?.email || "--",
//                       "Resolved By ID": formData.resolved_by?.id || "--",
//                       "Resolved At": formData.resolved_at || "--",
//                     }),

//                     // ---------------- Images ----------------
//                     "Creation Image 1": formData.creation_image1,
//                     "Creation Image 2": formData.creation_image2,
//                     "Resolution Image 1": formData.resolution_image1,
//                     "Resolution Image 2": formData.resolution_image2,
//                   }).map(([field, value]) => (
//                     <CTableRow key={field}>
//                       <CTableDataCell className="">{field}</CTableDataCell>

//                       <CTableDataCell className="">
//                         {typeof value === "string" &&
//                         value.startsWith("http") ? (
//                           <a href={value} target="_blank" rel="noreferrer">
//                             <CImage
//                               src={value}
//                               width={120}
//                               height={80}
//                               className="rounded border shadow-sm"
//                             />
//                           </a>
//                         ) : (
//                           value
//                         )}
//                       </CTableDataCell>
//                     </CTableRow>
//                   ))}
//                 </CTableBody>
//               </CTable>

//               <div className="mt-2">
//                 <LastActivity lastactivity={formData.last_activity} />
//               </div>
//             </>
//           )}
//         </CModalBody>
//       </CModal>

//       {/* 🛠 view Modal */}
//     </div>
//   );
// };

// export default ClientTicketsDashboard;

import React, { useEffect, useReducer, useState, useCallback } from "react";
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CFormInput,
  CRow,
  CCol,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CImage,
} from "@coreui/react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";
import PaginateInput from "../../../components/PaginateInput";
import LastActivity from "../../../components/LastActivity";
import CIcon from "@coreui/icons-react";
import {
  cilX,
  cilCloudDownload,
  cilPlus,
  cilMagnifyingGlass,
} from "@coreui/icons";

/* ─────────────────────────────── reducer ─────────────────────────────── */
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loadingTickets: true, error: "" };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loadingTickets: false,
        client_tickets: action.payload.data,
        totalPages: action.payload.totalPages,
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
      };
    case "FETCH_FAIL":
      return { ...state, loadingTickets: false, error: action.payload };
    default:
      return state;
  }
};

/* ──────────────────────────── helpers ──────────────────────────── */
const getTimeDifference = (start, end) => {
  if (!start || !end) return "—";
  const diffMs = new Date(end) - new Date(start);
  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 30) return `${days}d`;
  if (months < 12) return `${months} mo`;
  return `${years}y`;
};

const STATUS_META = {
  Resolved: { color: "success", icon: "✓" },
  Open: { color: "danger", icon: "!" },
  "In Progress": { color: "warning", icon: "↻" },
};

const StatusBadge = ({ status }) => {
  const meta = STATUS_META[status] || { color: "secondary", icon: "" };
  return (
    <CBadge
      color={meta.color}
      style={{
        fontSize: "0.72rem",
        letterSpacing: "0.03em",
        padding: "4px 10px",
        fontWeight: 600,
        textTransform: "uppercase",
      }}
    >
      {status}
    </CBadge>
  );
};

/* ─────────────────── summary card ─────────────────── */
const SummaryCard = ({ label, value, accent }) => (
  <div
    style={{
      background: "var(--cui-body-bg, #fff)",
      border: "1px solid var(--cui-border-color, #dee2e6)",
      borderRadius: 10,
      padding: "14px 20px",
      borderTop: `3px solid ${accent}`,
      minWidth: 130,
      flex: "1 1 130px",
    }}
  >
    <div
      style={{
        fontSize: "0.72rem",
        color: "#6c757d",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
      }}
    >
      {label}
    </div>
    <div
      style={{
        fontSize: "1.75rem",
        fontWeight: 700,
        lineHeight: 1.3,
        marginTop: 4,
      }}
    >
      {value}
    </div>
  </div>
);

/* ─────────────────── detail modal ─────────────────── */
const DetailModal = ({ visible, ticket, onClose }) => {
  if (!ticket) return null;

  const Section = ({ title }) => (
    <div
      style={{
        fontSize: "0.72rem",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        color: "#6c757d",
        borderBottom: "1px solid #dee2e6",
        paddingBottom: 6,
        marginTop: 20,
        marginBottom: 10,
      }}
    >
      {title}
    </div>
  );

  const Field = ({ label, value, wide }) => (
    <div
      style={{
        display: "flex",
        flexDirection: wide ? "column" : "row",
        gap: wide ? 4 : 0,
        marginBottom: 12,
      }}
    >
      <span
        style={{
          minWidth: 170,
          fontSize: "0.8rem",
          color: "#6c757d",
          fontWeight: 500,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: "0.875rem",
          color: "inherit",
          flex: 1,
          wordBreak: "break-word",
        }}
      >
        {value ?? "—"}
      </span>
    </div>
  );

  const ImageField = ({ label, url }) => (
    <div style={{ flex: "1 1 180px", minWidth: 180 }}>
      <div
        style={{
          fontSize: "0.75rem",
          color: "#6c757d",
          marginBottom: 6,
          fontWeight: 500,
        }}
      >
        {label}
      </div>
      {url ? (
        <a href={url} target="_blank" rel="noreferrer">
          <CImage
            src={url}
            width={160}
            height={110}
            style={{
              objectFit: "cover",
              borderRadius: 8,
              border: "1px solid #dee2e6",
            }}
          />
        </a>
      ) : (
        <div
          style={{
            width: 160,
            height: 110,
            background: "#f5f5f5",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.8rem",
            color: "#aaa",
            border: "1px dashed #ddd",
          }}
        >
          No image
        </div>
      )}
    </div>
  );

  return (
    <CModal size="xl" scrollable visible={visible} onClose={onClose}>
      <CModalHeader
        closeButton={false}
        style={{ borderBottom: "1px solid #dee2e6", paddingBottom: 12 }}
      >
        <div
          style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}
        >
          <CModalTitle style={{ fontSize: "1rem", fontWeight: 700 }}>
            Ticket Details
          </CModalTitle>
          <CBadge
            color="dark"
            style={{
              fontFamily: "monospace",
              fontSize: "0.8rem",
              letterSpacing: "0.05em",
            }}
          >
            {ticket.ticket_id}
          </CBadge>
          <StatusBadge status={ticket.status} />
        </div>
        <button
          type="button"
          className="border-0 ms-auto"
          onClick={onClose}
          style={{
            background: "none",
            padding: "4px 6px",
            cursor: "pointer",
            borderRadius: 6,
            opacity: 0.6,
          }}
        >
          <CIcon icon={cilX} size="lg" />
        </button>
      </CModalHeader>

      <CModalBody style={{ padding: "20px 24px" }}>
        {/* ── Core Info ── */}
        <Section title="Ticket Information" />
        <Field
          label="Ticket ID"
          value={
            <code style={{ fontSize: "0.85rem" }}>{ticket.ticket_id}</code>
          }
        />
        <Field
          label="Site ID"
          value={<code style={{ fontSize: "0.85rem" }}>{ticket.site_id}</code>}
        />
        <Field label="Subject" value={<strong>{ticket.subject}</strong>} />
        <Field label="Status" value={<StatusBadge status={ticket.status} />} />
        <Field label="Description" value={ticket.description} wide />

        {/* ── Analysis ── */}
        <Section title="Root Cause Analysis" />
        <Field label="Root Cause" value={ticket.root_cause} wide />
        <Field
          label="Corrective Action"
          value={ticket.corrective_action}
          wide
        />
        <Field
          label="Review of Corrective Action"
          value={ticket.review_of_corrective_action}
          wide
        />

        {/* ── Resolution ── */}
        {ticket.status === "Resolved" && (
          <>
            <Section title="Resolution" />
            <Field
              label="Resolution Notes"
              value={ticket.resolution_notes}
              wide
            />
            <Field label="Resolved By" value={ticket.resolved_by?.name} />
            <Field
              label="Resolved By Email"
              value={ticket.resolved_by?.email}
            />
            <Field
              label="Resolved At"
              value={
                ticket.resolved_at
                  ? new Date(ticket.resolved_at).toLocaleString("en-GB")
                  : "—"
              }
            />
            <Field
              label="Resolution Time"
              value={
                <CBadge
                  color="info"
                  style={{ fontSize: "0.8rem", fontWeight: 600 }}
                >
                  {getTimeDifference(ticket.createdAt, ticket.resolved_at)}
                </CBadge>
              }
            />
          </>
        )}

        {/* ── Creator ── */}
        <Section title="Created By" />
        <Field label="Name" value={ticket.created_by?.name} />
        <Field label="Email" value={ticket.created_by?.email} />
        <Field label="Designation" value={ticket.created_by?.designation} />
        <Field
          label="Created At"
          value={new Date(ticket.createdAt).toLocaleString("en-GB")}
        />

        {/* ── Images ── */}
        <Section title="Attachments" />
        <div
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            marginBottom: 8,
          }}
        >
          <ImageField label="Creation Image 1" url={ticket.creation_image1} />
          <ImageField label="Creation Image 2" url={ticket.creation_image2} />
          <ImageField
            label="Resolution Image 1"
            url={ticket.resolution_image1}
          />
          <ImageField
            label="Resolution Image 2"
            url={ticket.resolution_image2}
          />
        </div>

        {/* ── Activity ── */}
        {ticket.last_activity?.length > 0 && (
          <>
            <Section title="Activity Log" />
            <div style={{ marginTop: 8 }}>
              <LastActivity lastactivity={ticket.last_activity} />
            </div>
          </>
        )}
      </CModalBody>
    </CModal>
  );
};

/* ═══════════════════════ main dashboard ═══════════════════════ */
const ClientTicketsDashboard = () => {
  const [
    {
      error,
      client_tickets,
      loadingTickets,
      totalPages,
      hasNextPage,
      hasPrevPage,
    },
    dispatch,
  ] = useReducer(reducer, {
    client_tickets: [],
    loadingTickets: true,
    error: "",
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [pageInput, setPageInput] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const userInfo = useSelector((state) => state.userInfo);

  const isReadOnly = ["Master User", "Project User", "Service User"].includes(
    userInfo?.role,
  );

  useEffect(() => {
    const fetchClientTickets = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.post(
          `/api/v1/clienttickets/get-all`,
          { pg: page, limit },
          { withCredentials: true },
        );
        dispatch({
          type: "FETCH_SUCCESS",
          payload: {
            data: result.data.data,
            totalPages: Math.ceil(
              Number(result.data.total) / Number(result.data.limit),
            ),
            hasNextPage: result.data.hasNextPage,
            hasPrevPage: result.data.hasPrevPage,
          },
        });
      } catch (err) {
        const msg = err.response?.data?.error || "Failed to fetch tickets";
        dispatch({ type: "FETCH_FAIL", payload: msg });
        toast.error(msg);
      }
    };
    fetchClientTickets();
  }, [limit, page]);

  /* filter */
  const filteredTickets = client_tickets.filter((t) => {
    const matchSearch =
      t.ticket_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.created_by?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "All" || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  /* summary counts */
  const counts = client_tickets.reduce(
    (acc, t) => {
      acc.total++;
      if (t.status === "Open") acc.open++;
      else if (t.status === "In Progress") acc.inProgress++;
      else if (t.status === "Resolved") acc.resolved++;
      return acc;
    },
    { total: 0, open: 0, inProgress: 0, resolved: 0 },
  );

  /* export */
  const exportToCSV = () => {
    if (!filteredTickets.length) {
      toast.error("No data to export");
      return;
    }
    const hl = (url) => (url ? `=HYPERLINK("${url}","View")` : "");
    const headers = [
      "Ticket ID",
      "Site ID",
      "Subject",
      "Description",
      "Status",
      "Created By",
      "Email",
      "Designation",
      "Resolution Notes",
      "Root Cause",
      "Corrective Action",
      "Review",
      "Resolved By",
      "Resolved Email",
      "Created At",
      "Resolved At",
      "Resolution Time",
      "Img1",
      "Img2",
      "Img3",
      "Img4",
    ];
    const rows = filteredTickets.map((t) => [
      t.ticket_id,
      t.site_id,
      t.subject,
      t.description,
      t.status,
      t.created_by?.name,
      t.created_by?.email,
      t.created_by?.designation,
      t.resolution_notes,
      t.root_cause,
      t.corrective_action,
      t.review_of_corrective_action,
      t.resolved_by?.name,
      t.resolved_by?.email,
      new Date(t.createdAt).toLocaleString("en-GB"),
      t.resolved_at ? new Date(t.resolved_at).toLocaleString("en-GB") : "NA",
      t.status === "Resolved"
        ? getTimeDifference(t.createdAt, t.resolved_at)
        : "NA",
      hl(t.creation_image1),
      hl(t.creation_image2),
      hl(t.resolution_image1),
      hl(t.resolution_image2),
    ]);
    const csv =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows]
        .map((r) =>
          r.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(","),
        )
        .join("\n");
    const a = document.createElement("a");
    a.href = encodeURI(csv);
    a.download = `client_tickets_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const openModal = (ticket) => {
    setSelectedTicket(ticket);
    setModalVisible(true);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };
  const handlePageInputChange = (e) => setPageInput(e.target.value);
  const handlePageInputSubmit = () => {
    const n = parseInt(pageInput);
    if (!isNaN(n) && n >= 1 && n <= totalPages) handlePageChange(n);
  };

  const STATUS_FILTERS = ["All", "Open", "In Progress", "Resolved", "Closed"];

  return (
    <div style={{ padding: "0 0 2rem" }}>
      {/* ── Page Header ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <h4 style={{ margin: 0, fontWeight: 700, fontSize: "1.25rem" }}>
            Client Tickets
          </h4>
          <p style={{ margin: 0, fontSize: "0.8rem", color: "#6c757d" }}>
            {filteredTickets.length} ticket
            {filteredTickets.length !== 1 ? "s" : ""} shown
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {!isReadOnly && (
            <Link
              to="create-new-client-ticket"
              className="btn btn-sm btn-primary"
              style={{ display: "flex", alignItems: "center", gap: 5 }}
            >
              <CIcon icon={cilPlus} size="sm" /> New Ticket
            </Link>
          )}
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={exportToCSV}
            style={{ display: "flex", alignItems: "center", gap: 5 }}
          >
            <CIcon icon={cilCloudDownload} size="sm" /> Export CSV
          </button>
        </div>
      </div>

      {/* ── Summary Cards ── */}
      <div
        style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}
      >
        <SummaryCard label="Total" value={counts.total} accent="#6c757d" />
        <SummaryCard label="Open" value={counts.open} accent="#dc3545" />
        <SummaryCard
          label="In Progress"
          value={counts.inProgress}
          accent="#ffc107"
        />
        <SummaryCard
          label="Resolved"
          value={counts.resolved}
          accent="#198754"
        />
      </div>

      {/* ── Filters ── */}
      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        {/* search */}
        <div style={{ position: "relative", flex: "1 1 260px", maxWidth: 360 }}>
          <CIcon
            icon={cilMagnifyingGlass}
            size="sm"
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              opacity: 0.45,
              pointerEvents: "none",
            }}
          />
          <CFormInput
            type="text"
            placeholder="Search ID, subject, status, creator…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: 34, fontSize: "0.875rem" }}
          />
        </div>

        {/* status filter pills */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              style={{
                padding: "4px 12px",
                fontSize: "0.78rem",
                fontWeight: 600,
                borderRadius: 20,
                border: "1px solid",
                cursor: "pointer",
                transition: "all .15s",
                borderColor: statusFilter === s ? "#0d6efd" : "#dee2e6",
                background: statusFilter === s ? "#0d6efd" : "transparent",
                color: statusFilter === s ? "#fff" : "#6c757d",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table ── */}
      <div>
        <CTable hover responsive className="mb-0">
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell style={thStyle}>#</CTableHeaderCell>
              <CTableHeaderCell style={thStyle}>Ticket ID</CTableHeaderCell>
              <CTableHeaderCell style={thStyle}>Site ID</CTableHeaderCell>
              <CTableHeaderCell style={{ ...thStyle, minWidth: 260 }}>
                Subject
              </CTableHeaderCell>
              <CTableHeaderCell style={thStyle}>Status</CTableHeaderCell>
              <CTableHeaderCell style={{ ...thStyle, minWidth: 160 }}>
                Created By
              </CTableHeaderCell>
              <CTableHeaderCell style={{ ...thStyle, minWidth: 140 }}>
                Created
              </CTableHeaderCell>
              <CTableHeaderCell style={{ ...thStyle, minWidth: 140 }}>
                Resolved By
              </CTableHeaderCell>
              <CTableHeaderCell style={{ ...thStyle, minWidth: 140 }}>
                Resolved
              </CTableHeaderCell>
              <CTableHeaderCell style={thStyle}>Duration</CTableHeaderCell>
              <CTableHeaderCell
                style={{ ...thStyle, minWidth: 130, textAlign: "right" }}
              >
                Actions
              </CTableHeaderCell>
            </CTableRow>
          </CTableHead>

          <CTableBody>
            {loadingTickets ? (
              <CTableRow>
                <CTableDataCell colSpan={11} className="text-center py-5">
                  <LoadingSpinner />
                </CTableDataCell>
              </CTableRow>
            ) : error ? (
              <CTableRow>
                <CTableDataCell
                  colSpan={11}
                  className="text-center py-4 text-danger"
                >
                  {error}
                </CTableDataCell>
              </CTableRow>
            ) : filteredTickets.length === 0 ? (
              <CTableRow>
                <CTableDataCell
                  colSpan={11}
                  className="text-center py-5 text-muted"
                >
                  <div style={{ fontSize: "2rem", marginBottom: 8 }}>🎫</div>
                  No tickets match your search.
                </CTableDataCell>
              </CTableRow>
            ) : (
              filteredTickets.map((ticket, index) => (
                <CTableRow
                  key={ticket._id || index}
                  style={{
                    verticalAlign: "middle",
                    cursor: "pointer",
                    transition: "background .1s",
                  }}
                  onClick={() => openModal(ticket)}
                >
                  <CTableDataCell style={tdStyle}>
                    {(page - 1) * limit + index + 1}
                  </CTableDataCell>

                  <CTableDataCell style={tdStyle}>
                    <code
                      style={{
                        fontSize: "0.8rem",
                        color: "#0d6efd",
                        fontWeight: 600,
                      }}
                    >
                      {ticket.ticket_id}
                    </code>
                  </CTableDataCell>

                  <CTableDataCell style={tdStyle}>
                    <code style={{ fontSize: "0.8rem" }}>{ticket.site_id}</code>
                  </CTableDataCell>

                  <CTableDataCell style={tdStyle}>
                    <span
                      title={ticket.subject}
                      style={{
                        display: "block",
                        maxWidth: 280,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {ticket.subject}
                    </span>
                    {ticket.root_cause && (
                      <span
                        style={{
                          fontSize: "0.72rem",
                          color: "#6c757d",
                          display: "block",
                          marginTop: 2,
                          maxWidth: 280,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Root: {ticket.root_cause}
                      </span>
                    )}
                  </CTableDataCell>

                  <CTableDataCell style={tdStyle}>
                    <StatusBadge status={ticket.status} />
                  </CTableDataCell>

                  <CTableDataCell style={tdStyle}>
                    <div style={{ fontWeight: 500 }}>
                      {ticket.created_by?.name}
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "#6c757d" }}>
                      {ticket.created_by?.designation}
                    </div>
                  </CTableDataCell>

                  <CTableDataCell
                    style={{
                      ...tdStyle,
                      color: "#6c757d",
                      fontSize: "0.78rem",
                    }}
                  >
                    {new Date(ticket.createdAt).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </CTableDataCell>

                  <CTableDataCell style={tdStyle}>
                    {ticket.status === "Resolved" ? (
                      <>
                        <div style={{ fontWeight: 500 }}>
                          {ticket.resolved_by?.name}
                        </div>
                        <div style={{ fontSize: "0.72rem", color: "#6c757d" }}>
                          {ticket.resolved_by?.role}
                        </div>
                      </>
                    ) : (
                      <span style={{ color: "#adb5bd", fontSize: "0.8rem" }}>
                        —
                      </span>
                    )}
                  </CTableDataCell>

                  <CTableDataCell
                    style={{
                      ...tdStyle,
                      color: "#6c757d",
                      fontSize: "0.78rem",
                    }}
                  >
                    {ticket.status === "Resolved" ? (
                      new Date(ticket.resolved_at).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    ) : (
                      <span style={{ color: "#adb5bd" }}>—</span>
                    )}
                  </CTableDataCell>

                  <CTableDataCell style={tdStyle}>
                    {ticket.status === "Resolved" ? (
                      <span
                        style={{
                          background: "#d1e7dd",
                          color: "#0a3622",
                          borderRadius: 12,
                          padding: "3px 9px",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                        }}
                      >
                        {getTimeDifference(
                          ticket.createdAt,
                          ticket.resolved_at,
                        )}
                      </span>
                    ) : (
                      <span style={{ color: "#adb5bd" }}>—</span>
                    )}
                  </CTableDataCell>

                  <CTableDataCell
                    style={{ ...tdStyle, textAlign: "right" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="btn btn-sm btn-outline-secondary me-1"
                      style={{ fontSize: "0.75rem", padding: "3px 10px" }}
                      onClick={() => openModal(ticket)}
                    >
                      View
                    </button>
                    <Link
                      className="btn btn-sm btn-outline-primary"
                      to={`update-client-ticket/${ticket._id}`}
                      style={{ fontSize: "0.75rem", padding: "3px 10px" }}
                    >
                      Update
                    </Link>
                  </CTableDataCell>
                </CTableRow>
              ))
            )}
          </CTableBody>
        </CTable>
      </div>

      {/* ── Pagination ── */}
      <div style={{ marginTop: 16 }}>
        <PaginateInput
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
        />
      </div>

      {/* ── Detail Modal ── */}
      <DetailModal
        visible={modalVisible}
        ticket={selectedTicket}
        onClose={() => setModalVisible(false)}
      />
    </div>
  );
};

/* shared style tokens */
const thStyle = {
  fontSize: "0.75rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  color: "#495057",
  borderBottom: "2px solid #dee2e6",
  paddingTop: 10,
  paddingBottom: 10,
  whiteSpace: "nowrap",
};

const tdStyle = {
  verticalAlign: "middle",
  borderBottom: "1px solid #f1f3f5",
  padding: "10px 12px",
};

export default ClientTicketsDashboard;
