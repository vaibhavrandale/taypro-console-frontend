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

const ClientTicketsDashboardClient = () => {
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

  return (
    <div className="">
      <h2 className="text-center">Client Tickets</h2>
      <div className="d-flex justify-content-end my-2 align-items-center">
        <Link
          to="/client-admin/clientadmin-client-ticket/create-client-ticket"
          className="btn btn-sm btn-primary"
        >
          NEW
        </Link>
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
            <CTableHeaderCell style={{ minWidth: "150px" }}>
              Ticket ID
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "150px" }}>
              Site Id
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "300px" }}>
              Subject
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "100px" }}>
              Status
            </CTableHeaderCell>

            <CTableHeaderCell style={{ minWidth: "200px" }}>
              Created By
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "150px" }}>
              Created At
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "200px" }}>
              Action
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {loadingTickets ? (
            <CTableRow>
              <CTableDataCell colSpan="8" className="text-center">
                <LoadingSpinner />
              </CTableDataCell>
            </CTableRow>
          ) : error ? (
            <CTableRow>{error}</CTableRow>
          ) : filteredTickets.length > 0 ? (
            filteredTickets.map((ticket, index) => (
              <CTableRow key={index}>
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell style={{ minWidth: "150px" }}>
                  {ticket.ticket_id}
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
                  {ticket.createdAt.toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                  })}
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
                  {/* <Link
                    className="btn btn-sm btn-success m-1"
                    to={`update-client-ticket/${ticket._id}`}
                    color="primary"
                    size="sm"
                  >
                    Update
                  </Link> */}
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan="10" className="text-center text-danger">
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
              <CTable bordered hover responsive className="bg-important">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Field</CTableHeaderCell>
                    <CTableHeaderCell>Value</CTableHeaderCell>
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
                      >
                        {formData.status}
                      </CBadge>
                    ),
                    "Resolution Notes": formData.resolution_notes,
                    "Created By": formData.created_by.name,
                    "Created By Email": formData.created_by.email,
                    "Created At": new Date(formData.createdAt).toLocaleString(),
                    ...(formData.status === "Resolved" && {
                      "Resolved By": formData.resolved_by?.name || "",
                      "Resolved By Email": formData.resolved_by?.email || "",
                      "Resolved By ID": formData.resolved_by?.id || "",
                      "Resolved At": formData.resolved_at || "",
                    }),
                  }).map(([field, value]) => (
                    <CTableRow key={field}>
                      <CTableDataCell>{field}</CTableDataCell>
                      <CTableDataCell>{value}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>

              <LastActivity lastactivity={formData.last_activity} />
            </>
          )}
        </CModalBody>
      </CModal>

      {/* 🛠 view Modal */}
    </div>
  );
};

export default ClientTicketsDashboardClient;
