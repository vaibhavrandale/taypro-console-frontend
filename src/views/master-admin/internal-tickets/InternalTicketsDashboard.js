import React, { useEffect, useReducer, useState } from "react";
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CButton,
  CFormInput,
  CRow,
  CCol,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormSelect,
  CFormTextarea,
  CTooltip,
} from "@coreui/react";
// import { internal_tickets } from "../../../data";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";
import // CModal,
// CModalHeader,
// CModalTitle,
// CModalBody,
// CTable,
// CTableHead,
// CTableRow,
// CTableHeaderCell,
// CTableBody,
// CTableDataCell,
// CBadge,
// CTooltip,
"@coreui/react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { formatDistanceToNow } from "date-fns";
import PaginateInput from "../../../components/PaginateInput";
import LastActivity from "../../../components/LastActivity";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_INTERNAL_TICKET_REQUEST":
      return { ...state, loadingTickets: true, error: "" };
    case "FETCH_INTERNAL_TICKET_SUCCESS":
      return {
        ...state,
        loadingTickets: false,
        internal_tickets: action.payload.data,
        totalPages: action.payload.totalPages, // Use API-provided totalPages
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
      };
    case "FETCH_INTERNAL_TICKET_FAIL":
      return { ...state, loadingTickets: false, error: action.payload };

    default:
      return state;
  }
};

const InternalTicketsDashboard = () => {
  const [
    {
      error,
      internal_tickets,
      loadingTickets,
      totalPages,
      hasNextPage,
      hasPrevPage,
    },
    dispatch,
  ] = useReducer(reducer, {
    internal_tickets: [],
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

    const fetchInternalTickets = async () => {
      dispatch({ type: "FETCH_INTERNAL_TICKET_REQUEST" });

      try {
        const result = await axios.post(
          `/api/v1/internaltickets/get-internaltickets`,
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
          type: "FETCH_INTERNAL_TICKET_SUCCESS",
          payload: {
            data: result.data.data,
            totalPages: total,
            hasNextPage: next,
            hasPrevPage: prev,
          },
        });
      } catch (error) {
        console.log(error);
        dispatch({
          type: "FETCH_INTERNAL_TICKET_FAIL",
          payload: error.response.data.error,
        });
        toast.error(error.response.data.error);
      }
    };

    // Reset the delete state if successDelete flag is true
    fetchInternalTickets();
  }, [authtoken, limit, page]);

  /** 🔍 Search Function */
  const filteredTickets = internal_tickets.filter(
    (ticket) =>
      ticket.ticket_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.created_by.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /** ✏️ Open Update Modal */
  const openViewModal = (ticket) => {
    setSelectedTicket(ticket);
    setFormData(ticket);
    setModalVisible(true);
  };

  /** 📝 Handle Input Change */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  /** ✅ Handle Update */
  const handleUpdate = () => {
    console.log("Updated Ticket:", formData);
    setModalVisible(false);
  };

  const handlePageInputChange = (e) => {
    setPageInput(e.target.value);
  };

  // // console.log(uniqueSitenames);
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
      <div className="d-flex justify-content-between align-items-center">
        {" "}
        <h2>Internal Tickets</h2>
        <Link
          to="create-new-internal-ticket"
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
            placeholder="Search by Ticket ID, Department, Subject, or Status"
            className="mb-3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CCol>
      </CRow>

      {/* 📋 Ticket Table */}
      <CTable bordered hover responsive className="text-center">
        <CTableHead color="secondary">
          <CTableRow>
            <CTableHeaderCell>#</CTableHeaderCell>
            <CTableHeaderCell>Ticket ID</CTableHeaderCell>
            <CTableHeaderCell>Department</CTableHeaderCell>
            <CTableHeaderCell>Subject</CTableHeaderCell>
            <CTableHeaderCell>Priority</CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
            <CTableHeaderCell>Assigned To</CTableHeaderCell>
            <CTableHeaderCell>Created By</CTableHeaderCell>
            <CTableHeaderCell>Created At</CTableHeaderCell>
            <CTableHeaderCell>Action</CTableHeaderCell>
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
                <CTableDataCell>{ticket.department}</CTableDataCell>
                {/* <CTableDataCell>{ticket.subject}</CTableDataCell> */}
                <CTableDataCell>
                  {ticket.subject.length > 30
                    ? `${ticket.subject.slice(0, 30)}...`
                    : ticket.subject}
                </CTableDataCell>

                <CTableDataCell>
                  <CBadge
                    color={
                      ticket.priority === "Critical"
                        ? "danger"
                        : ticket.priority === "High"
                        ? "warning"
                        : "primary"
                    }
                  >
                    {ticket.priority}
                  </CBadge>
                </CTableDataCell>
                <CTableDataCell>
                  <CBadge
                    color={
                      formData.status === "Resolved"
                        ? "success"
                        : formData.status === "Open"
                        ? "danger"
                        : "warning"
                    }
                  >
                    {ticket.status}
                  </CBadge>
                </CTableDataCell>
                <CTableDataCell>{ticket.assigned_to.username}</CTableDataCell>
                <CTableDataCell>{ticket.created_by.name}</CTableDataCell>
                <CTableDataCell style={{ minWidth: "150px" }}>
                  {/* {ticket.createdAt} */}
                  <span className="">
                    <CTooltip
                      content={new Date(ticket.createdAt).toLocaleString()}
                      placement="top"
                    >
                      <span>
                        {formatDistanceToNow(new Date(ticket.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </CTooltip>
                  </span>
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
                    to={`update-internal-ticket/${ticket._id}`}
                    color="primary"
                    size="sm"
                    // onClick={() => openUpdateModal(ticket)}
                  >
                    Update
                  </Link>
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
      {/* <PaginateInput
        page={page}
        totalPages={totalPages}
        hasPrevPage={hasPrevPage}
        hasNextPage={hasNextPage}
        pageInput={pageInput}
        handlePageChange={handlePageChange}
        handlePageInputChange={handlePageInputChange}
        handlePageInputSubmit={handlePageInputSubmit}
      /> */}

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
        <CModalHeader>
          <CModalTitle>
            Update Ticket:{" "}
            <span className="badge bg-success">{formData.ticket_id}</span>
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedTicket && (
            <>
              <CTable bordered hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Field</CTableHeaderCell>
                    <CTableHeaderCell>Value</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {Object.entries({
                    "Ticket ID": formData.ticket_id,
                    "Assigned To": formData.assigned_to.username,
                    "Assigned Email": formData.assigned_to.email,
                    Department: formData.department,
                    Subject: formData.subject,
                    Description: formData.description,
                    Priority: formData.priority,
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
                    "Created By": formData.created_by.name,
                    "Created By Email": formData.created_by.email,
                    // "Created By ID": formData.created_by.user_id,
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

export default InternalTicketsDashboard;
