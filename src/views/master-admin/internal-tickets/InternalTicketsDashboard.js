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

        let total = Math.ceil(
          Number(result.data.total) / Number(result.data.limit)
        );
        let next = result.data.hasNextPage;
        let prev = result.data.hasPrevPage;

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
        dispatch({
          type: "FETCH_INTERNAL_TICKET_FAIL",
          payload: error.response.data.error,
        });
        toast.error(error.response.data.error);
      }
    };

    fetchInternalTickets();
  }, [authtoken, limit, page]);

  /** 🔍 Search Function */
  const filteredTickets = internal_tickets.filter(
    (ticket) =>
      ticket.ticket_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
      <h2 className="text-center">Internal Tickets</h2>
      <div className="d-flex justify-content-end my-2 align-items-center">
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
      <CTable bordered hover responsive className="text-center bg-important">
        <CTableHead color="secondary">
          <CTableRow>
            <CTableHeaderCell>#</CTableHeaderCell>
            <CTableHeaderCell>Ticket ID</CTableHeaderCell>
            <CTableHeaderCell>Department</CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "300px" }}>
              Subject
            </CTableHeaderCell>
            <CTableHeaderCell>Priority</CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "200px" }}>
              Assigned To
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "200px" }}>
              Created By
            </CTableHeaderCell>
            <CTableHeaderCell>Created At</CTableHeaderCell>
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
                        : "blue"
                    }
                  >
                    {ticket.priority}
                  </CBadge>
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
                <CTableDataCell
                // style={{ minWidth: "210px" }}
                >
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
                  >
                    Update
                  </Link>
                  {/* <Link
                    size="sm"
                    className="m-1 btn btn-sm btn-secondary text-decoration-none"
                    to={`resolve-internal-ticket/${ticket._id}`}
                  >
                    Resolve
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
            Details:{" "}
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
                    "Created At": new Date(formData.createdAt).toLocaleString(),
                    ...(formData.status === "Resolved" && {
                      "Resolution Notes": formData.resolution_notes || "",
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

                  {/* Ticket Images Row */}
                  {(formData.ticket_generated_images1 ||
                    formData.ticket_generated_images2 ||
                    formData.ticket_generated_images3 ||
                    formData.ticket_generated_images4 ||
                    formData.ticket_generated_images5) && (
                    <CTableRow>
                      <CTableDataCell>Ticket Generated Images</CTableDataCell>
                      <CTableDataCell>
                        <div className="d-flex flex-wrap">
                          {[1, 2, 3, 4, 5].map((num) => {
                            const img =
                              formData[`ticket_generated_images${num}`];
                            return (
                              img && (
                                <Link to={img} target="blank" key={num}>
                                  <CImage
                                    fluid
                                    src={img}
                                    className="m-2"
                                    alt={`Ticket Image ${num}`}
                                    style={{
                                      width: "200px",
                                      height: "200px",
                                      objectFit: "cover",
                                    }}
                                  />
                                </Link>
                              )
                            );
                          })}
                        </div>
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>

              <LastActivity lastactivity={formData.last_activity} />
            </>
          )}
        </CModalBody>
      </CModal>
    </div>
  );
};

export default InternalTicketsDashboard;
