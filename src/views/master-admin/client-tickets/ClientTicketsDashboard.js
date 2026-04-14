import React, { useEffect, useReducer, useState } from "react";
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
  CTooltip,
  CImage,
} from "@coreui/react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";
import "@coreui/react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { formatDistanceToNow } from "date-fns";
import PaginateInput from "../../../components/PaginateInput";
import LastActivity from "../../../components/LastActivity";
import CIcon from "@coreui/icons-react";
import { cilX } from "@coreui/icons";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_CLIENT_TICKET_REQUEST":
      return { ...state, loadingTickets: true, error: "" };
    case "FETCH_CLIENT_TICKET_SUCCESS":
      return {
        ...state,
        loadingTickets: false,
        client_tickets: action.payload.data,
        totalPages: action.payload.totalPages, // Use API-provided totalPages
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
      };
    case "FETCH_CLIENT_TICKET_FAIL":
      return { ...state, loadingTickets: false, error: action.payload };

    default:
      return state;
  }
};

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
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [formData, setFormData] = useState({});
  const authtoken = useSelector((state) => state.authtoken);
  const [pageInput, setPageInput] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const userInfo = useSelector((state) => state.userInfo);
  let adminroute = "";

  if (userInfo.role === "Master Admin") {
    adminroute = "master-admin";
  } else if (userInfo.role === "Service Admin") {
    adminroute = "service-admin";
  } else if (userInfo.role === "Project Admin") {
    // eslint-disable-next-line no-unused-vars
    adminroute = "project-admin";
  } else if (userInfo?.role === "Master User") {
    adminroute = "master-user";
  } else if (userInfo?.role === "Service User") {
    adminroute = "service-user";
  } else if (userInfo?.role === "Project User") {
    adminroute = "project-user";
  }
  useEffect(() => {
    let pagination = {
      pg: page,
      limit: limit,
    };

    const fetchClientTickets = async () => {
      dispatch({ type: "FETCH_CLIENT_TICKET_REQUEST" });

      try {
        const result = await axios.post(
          `/api/v1/clienttickets/get-all`,
          pagination,
          { headers: { Authorization: `Bearer ${authtoken}` } }
        );

        // Handle totalPages, hasNextPage, and hasPrevPage logic
        let total = Math.ceil(
          Number(result.data.total) / Number(result.data.limit)
        );
        let next = result.data.hasNextPage;
        let prev = result.data.hasPrevPage;

        // Dispatch success action with the fetched data and pagination info
        dispatch({
          type: "FETCH_CLIENT_TICKET_SUCCESS",
          payload: {
            data: result.data.data,
            totalPages: total,
            hasNextPage: next,
            hasPrevPage: prev,
          },
        });
      } catch (error) {
        dispatch({
          type: "FETCH_CLIENT_TICKET_FAIL",
          payload: error.response.data.error,
        });
        toast.error(
          error.response.data.error || "Failed to fetch the Client Tickets"
        );
      }
    };

    // Reset the delete state if successDelete flag is true
    fetchClientTickets();
  }, [authtoken, limit, page]);

  /** 🔍 Search Function */
  const filteredTickets = client_tickets.filter(
    (ticket) =>
      ticket.ticket_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.created_by.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /** ✏️ Open Update Modal */
  const openViewModal = (ticket) => {
    setSelectedTicket(ticket);
    setFormData(ticket);
    setModalVisible(true);
  };

  const handlePageInputChange = (e) => {
    setPageInput(e.target.value);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handlePageInputSubmit = () => {
    const pageNumber = parseInt(pageInput);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      handlePageChange(pageNumber);
    }
  };

  const getTimeDifference = (start, end) => {
  if (!start || !end) return "NA";

  const startDate = new Date(start);
  const endDate = new Date(end);

  const diffMs = endDate - startDate;

  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (minutes < 60) return `${minutes} min`;
  if (hours < 24) return `${hours} hr`;
  if (days < 30) return `${days} day${days > 1 ? "s" : ""}`;
  if (months < 12) return `${months} month${months > 1 ? "s" : ""}`;

  return `${years} year${years > 1 ? "s" : ""}`;
};
const exportToCSV = () => {
  if (!filteredTickets || filteredTickets.length === 0) {
    toast.error("No data to export");
    return;
  }

  const makeHyperlink = (url, label = "View") => {
    if (!url) return "";
    return `=HYPERLINK("${url}","${label}")`;
  };

  const headers = [
    "Ticket ID",
    "Site ID",
    "Subject",
    "Description",
    "Status",

    "Created By Name",
    "Created By Email",
    "Created By Designation",

    "Resolution Notes",

    "Resolved By Name",
    "Resolved By Email",
    "Resolved By Role",

    "Created At",
    "Updated At",
    "Resolved At",
    "Resolution Time",

    "Creation Image 1",
    "Creation Image 2",
    "Resolution Image 1",
    "Resolution Image 2",
  ];

  const rows = filteredTickets.map((ticket) => [
    ticket.ticket_id,
    ticket.site_id,
    ticket.subject,
    ticket.description,
    ticket.status,

    ticket.created_by?.name || "",
    ticket.created_by?.email || "",
    ticket.created_by?.designation || "",

    ticket.resolution_notes || "",

    ticket.resolved_by?.name || "",
    ticket.resolved_by?.email || "",
    ticket.resolved_by?.role || "",

    new Date(ticket.createdAt).toLocaleString("en-GB"),
    new Date(ticket.updatedAt).toLocaleString("en-GB"),
    ticket.resolved_at
      ? new Date(ticket.resolved_at).toLocaleString("en-GB")
      : "NA",

    ticket.status === "Resolved"
      ? getTimeDifference(ticket.createdAt, ticket.resolved_at)
      : "NA",

    makeHyperlink(ticket.creation_image1, "View Image"),
    makeHyperlink(ticket.creation_image2, "View Image"),
    makeHyperlink(ticket.resolution_image1, "View Image"),
    makeHyperlink(ticket.resolution_image2, "View Image"),
  ]);

  const csvContent =
    "data:text/csv;charset=utf-8," +
    [headers, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

  const link = document.createElement("a");
  link.href = encodeURI(csvContent);
  link.download = `client_tickets_full_${Date.now()}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

  return (
    <div className="">
      <h2 className="text-center">Client Tickets</h2>
     <div className="d-flex justify-content-end my-2 align-items-center">
  <div>
    {!["Master User", "Project User", "Service User"].includes(
      userInfo?.role
    ) && (
      <Link
        to="create-new-client-ticket"
        className="btn btn-sm btn-primary me-2"
      >
        NEW
      </Link>
    )}
  </div>

  <button
    className="btn btn-sm btn-success"
    onClick={exportToCSV}
  >
    Export 
  </button>
</div>

      {/* 🔍 Search Input */}
      <CRow className="justify-content-end">
        <CCol md={4}>
          <CFormInput
            type="text"
            placeholder="Search by Ticket Id, Subject, or Status"
            className="mb-3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CCol>
      </CRow>

      {/* 📋 Ticket Table */}
      <CTable bordered hover responsive className="text-center bg-important">
        <CTableHead color="secondary">
          <CTableRow>
            <CTableHeaderCell>#</CTableHeaderCell>
            <CTableHeaderCell>Ticket ID</CTableHeaderCell>
            <CTableHeaderCell>Site Id</CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "300px" }}>
              Subject
            </CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>

            <CTableHeaderCell style={{ minWidth: "200px" }}>
              Created By
            </CTableHeaderCell>
            <CTableHeaderCell>Created Date</CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "200px" }}>Resolved By</CTableHeaderCell>
            <CTableHeaderCell>Resolved Date</CTableHeaderCell>
            <CTableHeaderCell>Resolving Time Duration</CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "200px" }}>
              Action
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {loadingTickets ? (
            <CTableRow>
              <CTableDataCell colSpan="11" className="text-center">
                <LoadingSpinner />
              </CTableDataCell>
            </CTableRow>
          ) : error ? (
            <CTableRow>
              <CTableDataCell colSpan="11" className="text-center">
                {error}
              </CTableDataCell>
            </CTableRow>
          ) : filteredTickets.length > 0 ? (
            filteredTickets.map((ticket, index) => (
              <CTableRow key={index}>
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell style={{ minWidth: "150px" }}>
                  {/* {ticket.ticket_id} */}
                  <Link
                    className="m-1"
                    color="primary"
                    size="sm"
                    onClick={() => openViewModal(ticket)}
                  >
                    {ticket.ticket_id}
                  </Link>
                </CTableDataCell>
                <CTableDataCell style={{ minWidth: "150px" }}>
                  {ticket.site_id}
                </CTableDataCell>
                <CTableDataCell>
                  {ticket.subject.length > 30
                    ? `${ticket.subject.slice(0, 30)}...`
                    : ticket.subject}
                </CTableDataCell>

                <CTableDataCell>
                  <CBadge
                    color={
                      ticket.status === "Resolved"
                        ? "success"
                        : ticket.status === "Open"
                        ? "danger"
                        : "warning"
                    }
                  >
                    {ticket.status}
                  </CBadge>
                </CTableDataCell>
                <CTableDataCell>{ticket.created_by.name}</CTableDataCell>
               
                <CTableDataCell style={{ minWidth: "150px" }}>
                  
                        {new Date(ticket.createdAt).toLocaleString("en-GB", {
                          year: "numeric",
                          month: "numeric",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: true,
                        })}
                    
                </CTableDataCell>
              <CTableDataCell>{
                  ticket.status==="Resolved"?ticket.resolved_by.name:<CBadge
                    color={
                      ticket.status === "Resolved"
                        ? "success"
                        : ticket.status === "Open"
                        ? "danger"
                        : "warning"
                    }
                  >
                    {ticket.status}
                  </CBadge>
                  }</CTableDataCell>
                <CTableDataCell style={{ minWidth: "150px" }}>
                  
                        {
                        ticket.status==="Resolved"?
                        new Date(ticket.resolved_at).toLocaleString("en-GB", {
                          year: "numeric",
                          month: "numeric",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: true,
                        }):"NA"}
                    
                </CTableDataCell>
                 <CTableDataCell style={{ minWidth: "150px" }}>
  {ticket.status === "Resolved"
    ? getTimeDifference(ticket.createdAt, ticket.resolved_at)
    : "NA"}
</CTableDataCell>
                <CTableDataCell>
                  <Link
                    className="btn btn-sm btn-secondary m-1"
                    color="primary"
                    size="sm"
                    onClick={() => openViewModal(ticket)}
                  >
                    view
                  </Link>
                  <Link
                    className="btn btn-sm btn-success m-1"
                    to={`update-client-ticket/${ticket._id}`}
                    color="primary"
                    size="sm"
                  >
                    Update
                  </Link>
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan="11" className="text-center text-danger">
                No tickets found.
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>

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
        handleLimitChange={setLimit} // New prop
      />

      {/* 🛠 view Modal */}
      <CModal
        size="xl"
        scrollable
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        <CModalHeader closeButton={false}>
          <CModalTitle>
            Update Ticket:{" "}
            <span className="badge bg-success">{formData.ticket_id}</span>
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
          {selectedTicket && (
            <>
              <CTable
                bordered
                striped
                responsive
                className="shadow-sm rounded overflow-hidden"
              >
                <CTableHead color="primary" className="text-white">
                  <CTableRow>
                    <CTableHeaderCell className="fw-bold">
                      Field
                    </CTableHeaderCell>
                    <CTableHeaderCell className="fw-bold">
                      Value
                    </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  {Object.entries({
                    "Ticket ID": formData.ticket_id,
                    Subject: formData.subject,
                    Description: formData.description,
                    Status: (
                      <CBadge
                        color={
                          formData.status === "Resolved"
                            ? "success"
                            : formData.status === "Open"
                            ? "danger"
                            : "warning"
                        }
                        className="px-3 py-2"
                      >
                        {formData.status}
                      </CBadge>
                    ),
                    "Resolution Notes": formData.resolution_notes,
                    "Created By": formData.created_by.name,
                    "Created By Email": formData.created_by.email,
                    "Created At": new Date(formData.createdAt).toLocaleString(
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
                    ),
                    ...(formData.status === "Resolved" && {
                      "Resolved By": formData.resolved_by?.name || "--",
                      "Resolved By Email": formData.resolved_by?.email || "--",
                      "Resolved By ID": formData.resolved_by?.id || "--",
                      "Resolved At": formData.resolved_at || "--",
                    }),

                    // ---------------- Images ----------------
                    "Creation Image 1": formData.creation_image1,
                    "Creation Image 2": formData.creation_image2,
                    "Resolution Image 1": formData.resolution_image1,
                    "Resolution Image 2": formData.resolution_image2,
                  }).map(([field, value]) => (
                    <CTableRow key={field}>
                      <CTableDataCell className="">{field}</CTableDataCell>

                      <CTableDataCell className="">
                        {typeof value === "string" &&
                        value.startsWith("http") ? (
                          <a href={value} target="_blank" rel="noreferrer">
                            <CImage
                              src={value}
                              width={120}
                              height={80}
                              className="rounded border shadow-sm"
                            />
                          </a>
                        ) : (
                          value
                        )}
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>

              <div className="mt-2">
                <LastActivity lastactivity={formData.last_activity} />
              </div>
            </>
          )}
        </CModalBody>
      </CModal>

      {/* 🛠 view Modal */}
    </div>
  );
};

export default ClientTicketsDashboard;
