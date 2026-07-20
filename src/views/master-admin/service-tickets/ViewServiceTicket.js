import React, { useEffect, useReducer } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import moment from "moment";
import {
  CBadge,
  CButton,
  CCol,
  CImage,
  CRow,
} from "@coreui/react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import LastActivity from "../../../components/LastActivity";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, ticket: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const S = {
  page: { maxWidth: 1280, margin: "0 auto" },
  header: {
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "16px 18px",
    borderRadius: 10,
    border: "1px solid rgba(148,163,184,0.18)",
    background: "rgba(15, 23, 42, 0.45)",
    marginBottom: 14,
  },
  number: {
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
    fontSize: 13,
    color: "#38bdf8",
    letterSpacing: 0.3,
  },
  title: { fontSize: 22, fontWeight: 650, margin: "4px 0 6px", color: "#e2e8f0" },
  meta: { fontSize: 13, color: "#94a3b8" },
  actions: { display: "flex", flexWrap: "wrap", gap: 8 },
  panel: {
    borderRadius: 10,
    border: "1px solid rgba(148,163,184,0.18)",
    background: "rgba(15, 23, 42, 0.45)",
    marginBottom: 14,
    overflow: "hidden",
  },
  panelHead: {
    padding: "10px 16px",
    borderBottom: "1px solid rgba(148,163,184,0.14)",
    fontSize: 12,
    fontWeight: 650,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: "#94a3b8",
  },
  panelBody: { padding: 16 },
  fieldRow: {
    display: "grid",
    gridTemplateColumns: "140px 1fr",
    gap: 8,
    padding: "8px 0",
    borderBottom: "1px solid rgba(148,163,184,0.08)",
    fontSize: 13,
  },
  fieldLabel: { color: "#94a3b8", fontWeight: 500 },
  fieldValue: { color: "#e2e8f0", wordBreak: "break-word" },
  note: {
    whiteSpace: "pre-wrap",
    lineHeight: 1.55,
    color: "#e2e8f0",
    fontSize: 14,
    minHeight: 48,
  },
  imgGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
    gap: 10,
  },
};

const fmt = (d) => (d ? moment(d).format("DD MMM YYYY, hh:mm A") : "—");
const fmtSite = (id = "") =>
  id.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const Field = ({ label, children }) => (
  <div style={S.fieldRow}>
    <div style={S.fieldLabel}>{label}</div>
    <div style={S.fieldValue}>{children ?? "—"}</div>
  </div>
);

const Panel = ({ title, children }) => (
  <div style={S.panel}>
    <div style={S.panelHead}>{title}</div>
    <div style={S.panelBody}>{children}</div>
  </div>
);

const ImageGrid = ({ images, empty }) => {
  if (!images.length) {
    return <div style={{ color: "#64748b", fontSize: 13 }}>{empty}</div>;
  }
  return (
    <div style={S.imgGrid}>
      {images.map((src, i) => (
        <a key={i} href={src} target="_blank" rel="noreferrer">
          <CImage
            src={src}
            alt={`Attachment ${i + 1}`}
            style={{
              width: "100%",
              height: 120,
              objectFit: "cover",
              borderRadius: 8,
              border: "1px solid rgba(148,163,184,0.2)",
            }}
          />
        </a>
      ))}
    </div>
  );
};

const ViewServiceTicket = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.userInfo);
  const [{ loading, error, ticket }, dispatch] = useReducer(reducer, {
    ticket: null,
    loading: true,
    error: "",
  });

  let adminroute = "master-admin";
  if (userInfo?.role === "Service Admin") adminroute = "service-admin";
  else if (userInfo?.role === "Project Admin") adminroute = "project-admin";
  else if (userInfo?.role === "Master User") adminroute = "master-user";
  else if (userInfo?.role === "Service User") adminroute = "service-user";
  else if (userInfo?.role === "Project User") adminroute = "project-user";

  const canUpdate = userInfo?.role === "Master Admin";
  const canResolve = !["Master User", "Project User", "Service User"].includes(
    userInfo?.role,
  );

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const res = await axios.get(`/api/v1/servicetickets/getone/${id}`, {
          withCredentials: true,
        });
        dispatch({ type: "FETCH_SUCCESS", payload: res.data.data });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload:
            err.response?.data?.message ||
            err.response?.data?.error ||
            "Failed to load ticket",
        });
      }
    };
    fetchTicket();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div style={S.page}>
        <div className="text-danger mb-3">{error || "Ticket not found"}</div>
        <CButton
          color="secondary"
          size="sm"
          onClick={() => navigate(`/${adminroute}/service-tickets`)}
        >
          Back to list
        </CButton>
      </div>
    );
  }

  const generatedImages = [
    ticket.ticket_generated_images1,
    ticket.ticket_generated_images2,
    ticket.ticket_generated_images3,
    ticket.ticket_generated_images4,
    ticket.ticket_generated_images5,
  ].filter(Boolean);

  const resolvedImages = [
    ticket.ticket_resolved_images1,
    ticket.ticket_resolved_images2,
    ticket.ticket_resolved_images3,
    ticket.ticket_resolved_images4,
    ticket.ticket_resolved_images5,
  ].filter(Boolean);

  const daysOpen = moment().diff(moment(ticket.createdAt), "days");
  const isResolved = !!ticket.ticket_resolved;

  return (
    <div style={S.page}>
      {/* ITSM header */}
      <div style={S.header}>
        <div>
          <div style={S.number}>{ticket.ticket_id}</div>
          <h1 style={S.title}>{ticket.fault_type || "Service Ticket"}</h1>
          <div style={S.meta}>
            <CBadge color={isResolved ? "success" : "warning"} className="me-2">
              {isResolved ? "Resolved" : "Open"}
            </CBadge>
            <span>
              {fmtSite(ticket.site_id)} · Robot {ticket.robot_no}
              {!isResolved ? ` · Open ${daysOpen}d` : ""}
            </span>
          </div>
        </div>
        <div style={S.actions}>
          <CButton
            color="secondary"
            variant="outline"
            size="sm"
            onClick={() => navigate(`/${adminroute}/service-tickets`)}
          >
            Back
          </CButton>
          {canUpdate && (
            <Link
              to={`/${adminroute}/service-tickets/update-service-ticket/${ticket._id}`}
              className="btn btn-sm btn-primary"
            >
              Update
            </Link>
          )}
          {canResolve && !isResolved && (
            <Link
              to={`/${adminroute}/service-tickets/resolve-service-ticket/${ticket._id}`}
              className="btn btn-sm btn-success"
            >
              Resolve
            </Link>
          )}
        </div>
      </div>

      <CRow className="g-3">
        {/* Main column — ServiceNow style */}
        <CCol xs={12} lg={8}>
          <Panel title="Short description">
            <div style={S.note}>
              {ticket.fault_type}
              {ticket.ticket_generating_notes
                ? ` — ${ticket.ticket_generating_notes}`
                : ""}
            </div>
          </Panel>

          <Panel title="Work notes / generating notes">
            <div style={S.note}>
              {ticket.ticket_generating_notes || "No generating notes."}
            </div>
          </Panel>

          {isResolved && (
            <Panel title="Resolution notes">
              <div style={S.note}>
                {ticket.ticket_resolving_notes || "No resolution notes."}
              </div>
            </Panel>
          )}

          <Panel title="Attachments — raised">
            <ImageGrid
              images={generatedImages}
              empty="No images attached at raise time."
            />
          </Panel>

          {isResolved && (
            <Panel title="Attachments — resolved">
              <ImageGrid
                images={resolvedImages}
                empty="No images attached at resolve time."
              />
            </Panel>
          )}

          <Panel title="Activity">
            {ticket.last_activity?.length ? (
              <LastActivity lastactivity={ticket.last_activity} />
            ) : (
              <div style={{ color: "#64748b", fontSize: 13 }}>
                No activity recorded.
              </div>
            )}
          </Panel>
        </CCol>

        {/* Right sidebar — SAP/ServiceNow fields */}
        <CCol xs={12} lg={4}>
          <Panel title="Ticket information">
            <Field label="Number">{ticket.ticket_id}</Field>
            <Field label="State">
              <CBadge color={isResolved ? "success" : "warning"}>
                {isResolved ? "Resolved" : "Open"}
              </CBadge>
            </Field>
            <Field label="Fault">{ticket.fault_type}</Field>
            <Field label="Site">{fmtSite(ticket.site_id)}</Field>
            <Field label="Company">{ticket.company}</Field>
            <Field label="Opened">{fmt(ticket.createdAt)}</Field>
            <Field label="Resolved">{fmt(ticket.ticket_resolved_at)}</Field>
            {!isResolved && <Field label="Age">{daysOpen} days</Field>}
          </Panel>

          <Panel title="Configuration item">
            <Field label="Robot No">{ticket.robot_no}</Field>
            <Field label="DevEUI">{ticket.deveui}</Field>
            <Field label="Robot Type">{ticket.robot_type}</Field>
            <Field label="Block">{ticket.block}</Field>
            <Field label="LoRa No">{ticket.lora_no || "—"}</Field>
          </Panel>

          <Panel title="People">
            <Field label="Opened by">{ticket.ticket_generated_by}</Field>
            <Field label="Opened email">
              {ticket.ticket_generated_by_email}
            </Field>
            <Field label="Resolved by">
              {ticket.ticket_resolved_by || "—"}
            </Field>
            <Field label="Resolved email">
              {ticket.ticket_resolved_by_email || "—"}
            </Field>
          </Panel>

          {(ticket.service_part_replaced || ticket.part_replaced) && (
            <Panel title="Parts">
              <Field label="Part replaced">
                {ticket.service_part_replaced ? "Yes" : "No"}
              </Field>
              <Field label="Part">{ticket.part_replaced || "—"}</Field>
              <Field label="Qty">
                {ticket.replaced_part_quantity ?? "—"}
              </Field>
            </Panel>
          )}
        </CCol>
      </CRow>
    </div>
  );
};

export default ViewServiceTicket;
