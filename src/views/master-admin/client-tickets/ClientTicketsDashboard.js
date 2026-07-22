import React, { useEffect, useReducer, useState } from "react";
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CFormSelect,
  CImage,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";
import PaginateInput from "../../../components/PaginateInput";
import LastActivity from "../../../components/LastActivity";

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

const statusBadge = (status) => {
  if (status === "Resolved") return "success";
  if (status === "Open") return "danger";
  if (status === "In Progress") return "warning";
  return "secondary";
};

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

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

  const filteredTickets = client_tickets.filter((t) => {
    const q = searchTerm.toLowerCase();
    const matchSearch =
      t.ticket_id.toLowerCase().includes(q) ||
      t.subject.toLowerCase().includes(q) ||
      t.status.toLowerCase().includes(q) ||
      t.created_by?.name?.toLowerCase().includes(q);
    const matchStatus = statusFilter === "All" || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

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

  const handlePageInputSubmit = () => {
    const n = parseInt(pageInput, 10);
    if (!isNaN(n) && n >= 1 && n <= totalPages) handlePageChange(n);
  };

  const ticket = selectedTicket;

  return (
    <div>
      <h4 className="mb-3">Client Tickets</h4>

      <CRow className="g-3 mb-3">
        <CCol xs={6} md={3}>
          <CCard className="text-center">
            <CCardBody className="py-2">
              <div className="small text-medium-emphasis">Total</div>
              <div className="fs-5 fw-semibold">{counts.total}</div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={6} md={3}>
          <CCard className="text-center">
            <CCardBody className="py-2">
              <div className="small text-medium-emphasis">Open</div>
              <div className="fs-5 fw-semibold text-danger">{counts.open}</div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={6} md={3}>
          <CCard className="text-center">
            <CCardBody className="py-2">
              <div className="small text-medium-emphasis">In Progress</div>
              <div className="fs-5 fw-semibold text-warning">
                {counts.inProgress}
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={6} md={3}>
          <CCard className="text-center">
            <CCardBody className="py-2">
              <div className="small text-medium-emphasis">Resolved</div>
              <div className="fs-5 fw-semibold text-success">
                {counts.resolved}
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CCard>
        <CCardHeader className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <strong>All Client Tickets</strong>
          <div className="d-flex gap-2">
            {!isReadOnly && (
              <Link
                to="create-new-client-ticket"
                className="btn btn-sm btn-primary"
              >
                New Ticket
              </Link>
            )}
            <CButton color="secondary" size="sm" onClick={exportToCSV}>
              Export CSV
            </CButton>
          </div>
        </CCardHeader>

        <CCardBody>
          <CRow className="mb-3 g-2 justify-content-end">
            <CCol md={3} xs={12}>
              <CFormInput
                type="text"
                placeholder="Search by Ticket ID, Subject, Status…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </CCol>
            <CCol md={2} xs={12}>
              <CFormSelect
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </CFormSelect>
            </CCol>
          </CRow>

          <CTable bordered hover responsive className="text-center align-middle">
            <CTableHead color="secondary">
              <CTableRow>
                <CTableHeaderCell>#</CTableHeaderCell>
                <CTableHeaderCell>Ticket ID</CTableHeaderCell>
                <CTableHeaderCell>Site ID</CTableHeaderCell>
                <CTableHeaderCell>Subject</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell>Created By</CTableHeaderCell>
                <CTableHeaderCell>Created</CTableHeaderCell>
                <CTableHeaderCell>Resolved By</CTableHeaderCell>
                <CTableHeaderCell>Resolved</CTableHeaderCell>
                <CTableHeaderCell>Duration</CTableHeaderCell>
                <CTableHeaderCell>Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>

            <CTableBody>
              {loadingTickets ? (
                <CTableRow>
                  <CTableDataCell colSpan={11}>
                    <LoadingSpinner />
                  </CTableDataCell>
                </CTableRow>
              ) : error ? (
                <CTableRow>
                  <CTableDataCell colSpan={11} className="text-danger">
                    {error}
                  </CTableDataCell>
                </CTableRow>
              ) : filteredTickets.length === 0 ? (
                <CTableRow>
                  <CTableDataCell colSpan={11}>No data found</CTableDataCell>
                </CTableRow>
              ) : (
                filteredTickets.map((t, index) => (
                  <CTableRow key={t._id || index}>
                    <CTableDataCell>
                      {(page - 1) * limit + index + 1}
                    </CTableDataCell>
                    <CTableDataCell style={{ minWidth: 160 }}>
                      {t.ticket_id}
                    </CTableDataCell>
                    <CTableDataCell style={{ minWidth: 140 }}>
                      {t.site_id}
                    </CTableDataCell>
                    <CTableDataCell
                      className="text-start"
                      style={{ minWidth: 200 }}
                    >
                      {t.subject}
                    </CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={statusBadge(t.status)}>{t.status}</CBadge>
                    </CTableDataCell>
                    <CTableDataCell style={{ minWidth: 140 }}>
                      {t.created_by?.name || "—"}
                    </CTableDataCell>
                    <CTableDataCell style={{ minWidth: 150 }}>
                      {fmtDate(t.createdAt)}
                    </CTableDataCell>
                    <CTableDataCell style={{ minWidth: 140 }}>
                      {t.status === "Resolved"
                        ? t.resolved_by?.name || "—"
                        : "—"}
                    </CTableDataCell>
                    <CTableDataCell style={{ minWidth: 150 }}>
                      {t.status === "Resolved" ? fmtDate(t.resolved_at) : "—"}
                    </CTableDataCell>
                    <CTableDataCell>
                      {t.status === "Resolved" ? (
                        <CBadge color="info">
                          {getTimeDifference(t.createdAt, t.resolved_at)}
                        </CBadge>
                      ) : (
                        "—"
                      )}
                    </CTableDataCell>
                    <CTableDataCell style={{ minWidth: 160 }}>
                      <CButton
                        color="secondary"
                        size="sm"
                        className="me-1"
                        onClick={() => openModal(t)}
                      >
                        View
                      </CButton>
                      <Link
                        className="btn btn-sm btn-primary"
                        to={`update-client-ticket/${t._id}`}
                      >
                        Update
                      </Link>
                    </CTableDataCell>
                  </CTableRow>
                ))
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
            handlePageInputChange={(e) => setPageInput(e.target.value)}
            handlePageInputSubmit={handlePageInputSubmit}
            limit={limit}
            handleLimitChange={setLimit}
          />
        </CCardBody>
      </CCard>

      <CModal
        size="xl"
        scrollable
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        <CModalHeader>
          <CModalTitle>
            Ticket Details {ticket ? `— ${ticket.ticket_id}` : ""}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {!ticket ? null : (
            <>
              <CTable bordered small responsive className="mb-3">
                <CTableBody>
                  <CTableRow>
                    <CTableHeaderCell style={{ width: "30%" }}>
                      Ticket ID
                    </CTableHeaderCell>
                    <CTableDataCell>{ticket.ticket_id}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Site ID</CTableHeaderCell>
                    <CTableDataCell>{ticket.site_id}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Subject</CTableHeaderCell>
                    <CTableDataCell>{ticket.subject}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableDataCell>
                      <CBadge color={statusBadge(ticket.status)}>
                        {ticket.status}
                      </CBadge>
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Description</CTableHeaderCell>
                    <CTableDataCell>{ticket.description || "—"}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Root Cause</CTableHeaderCell>
                    <CTableDataCell>{ticket.root_cause || "—"}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Corrective Action</CTableHeaderCell>
                    <CTableDataCell>
                      {ticket.corrective_action || "—"}
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>
                      Review of Corrective Action
                    </CTableHeaderCell>
                    <CTableDataCell>
                      {ticket.review_of_corrective_action || "—"}
                    </CTableDataCell>
                  </CTableRow>
                  {ticket.status === "Resolved" && (
                    <>
                      <CTableRow>
                        <CTableHeaderCell>Resolution Notes</CTableHeaderCell>
                        <CTableDataCell>
                          {ticket.resolution_notes || "—"}
                        </CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableHeaderCell>Resolved By</CTableHeaderCell>
                        <CTableDataCell>
                          {ticket.resolved_by?.name || "—"}
                          {ticket.resolved_by?.email
                            ? ` (${ticket.resolved_by.email})`
                            : ""}
                        </CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableHeaderCell>Resolved At</CTableHeaderCell>
                        <CTableDataCell>
                          {fmtDate(ticket.resolved_at)}
                        </CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableHeaderCell>Resolution Time</CTableHeaderCell>
                        <CTableDataCell>
                          <CBadge color="info">
                            {getTimeDifference(
                              ticket.createdAt,
                              ticket.resolved_at,
                            )}
                          </CBadge>
                        </CTableDataCell>
                      </CTableRow>
                    </>
                  )}
                  <CTableRow>
                    <CTableHeaderCell>Created By</CTableHeaderCell>
                    <CTableDataCell>
                      {ticket.created_by?.name || "—"}
                      {ticket.created_by?.designation
                        ? ` — ${ticket.created_by.designation}`
                        : ""}
                      {ticket.created_by?.email
                        ? ` (${ticket.created_by.email})`
                        : ""}
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Created At</CTableHeaderCell>
                    <CTableDataCell>{fmtDate(ticket.createdAt)}</CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>

              <h6>Attachments</h6>
              <CRow className="g-3 mb-3">
                {[
                  ["Creation Image 1", ticket.creation_image1],
                  ["Creation Image 2", ticket.creation_image2],
                  ["Resolution Image 1", ticket.resolution_image1],
                  ["Resolution Image 2", ticket.resolution_image2],
                ].map(([label, url]) => (
                  <CCol xs={6} md={3} key={label}>
                    <div className="small text-medium-emphasis mb-1">
                      {label}
                    </div>
                    {url ? (
                      <a href={url} target="_blank" rel="noreferrer">
                        <CImage
                          src={url}
                          width={160}
                          height={110}
                          style={{ objectFit: "cover" }}
                        />
                      </a>
                    ) : (
                      <div className="text-medium-emphasis small">No image</div>
                    )}
                  </CCol>
                ))}
              </CRow>

              {ticket.last_activity?.length > 0 && (
                <>
                  <h6>Activity Log</h6>
                  <LastActivity lastactivity={ticket.last_activity} />
                </>
              )}
            </>
          )}
        </CModalBody>
      </CModal>
    </div>
  );
};

export default ClientTicketsDashboard;
