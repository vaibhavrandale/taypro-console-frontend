import React, { useEffect, useReducer } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import moment from "moment";
import {
  CAlert,
  CBadge,
  CButton,
  CImage,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
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

const fmt = (d) =>
  d
    ? moment(d).format("DD/MM/YYYY, hh:mm:ss A")
    : "—";

const fmtSite = (id = "") =>
  id.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const thStyle = { width: "18%", whiteSpace: "nowrap", verticalAlign: "middle" };
const tdStyle = { verticalAlign: "middle" };

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

  if (loading) return <LoadingSpinner />;
  if (error || !ticket) {
    return (
      <div>
        <CAlert color="danger">{error || "Ticket not found"}</CAlert>
        <CButton
          color="secondary"
          size="sm"
          onClick={() => navigate(`/${adminroute}/service-tickets`)}
        >
          Back
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

  const partsList =
    Array.isArray(ticket.parts_replaced) && ticket.parts_replaced.length > 0
      ? ticket.parts_replaced
      : ticket.part_replaced
        ? [
            {
              part_replaced: ticket.part_replaced,
              part_replaced_id: ticket.part_replaced_id,
              replaced_part_quantity: ticket.replaced_part_quantity,
              item_image: ticket.part_replaced_image,
              item_code: "",
            },
          ]
        : [];

  const partsWithChecklist = partsList.map((part) => {
    if (part.checklist) return part;
    const entry = (ticket.part_checklist || []).find(
      (c) => c.part_id === part.part_replaced_id,
    );
    return { ...part, checklist: entry?.checklist || null };
  });

  const isResolved = !!ticket.ticket_resolved;

  return (
    <div>
      {/* Actions */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <CButton
          color="secondary"
          size="sm"
          variant="outline"
          onClick={() => navigate(`/${adminroute}/service-tickets`)}
        >
          Back
        </CButton>
        <div className="d-flex gap-2">
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

      {/* Ticket details */}
      <h5 className="mb-2">Ticket details</h5>
      <CTable bordered striped responsive className="mb-4">
        <CTableBody>
          <CTableRow>
            <CTableHeaderCell style={thStyle}>Ticket ID</CTableHeaderCell>
            <CTableDataCell style={tdStyle}>
              <strong>{ticket.ticket_id}</strong>
            </CTableDataCell>
            <CTableHeaderCell style={thStyle}>Status</CTableHeaderCell>
            <CTableDataCell style={tdStyle}>
              <CBadge color={isResolved ? "success" : "warning"}>
                {isResolved ? "Resolved" : "Open"}
              </CBadge>
            </CTableDataCell>
          </CTableRow>

          <CTableRow>
            <CTableHeaderCell style={thStyle}>Fault type</CTableHeaderCell>
            <CTableDataCell style={tdStyle}>
              {ticket.fault_type?.replace(/-/g, " ") || "—"}
            </CTableDataCell>
            <CTableHeaderCell style={thStyle}>Site</CTableHeaderCell>
            <CTableDataCell style={tdStyle}>
              {fmtSite(ticket.site_id)}
            </CTableDataCell>
          </CTableRow>

          <CTableRow>
            <CTableHeaderCell style={thStyle}>Company</CTableHeaderCell>
            <CTableDataCell style={tdStyle} colSpan={3}>
              {ticket.company || "—"}
            </CTableDataCell>
          </CTableRow>

          <CTableRow>
            <CTableHeaderCell style={thStyle}>Opened at</CTableHeaderCell>
            <CTableDataCell style={tdStyle}>
              {fmt(ticket.createdAt)}
            </CTableDataCell>
            <CTableHeaderCell style={thStyle}>Opened by</CTableHeaderCell>
            <CTableDataCell style={tdStyle}>
              {ticket.ticket_generated_by || "—"}
              {ticket.ticket_generated_by_email ? (
                <div className="small text-medium-emphasis">
                  {ticket.ticket_generated_by_email}
                </div>
              ) : null}
            </CTableDataCell>
          </CTableRow>

          <CTableRow>
            <CTableHeaderCell style={thStyle}>Resolved at</CTableHeaderCell>
            <CTableDataCell style={tdStyle}>
              {fmt(ticket.ticket_resolved_at)}
            </CTableDataCell>
            <CTableHeaderCell style={thStyle}>Resolved by</CTableHeaderCell>
            <CTableDataCell style={tdStyle}>
              {ticket.ticket_resolved_by || "—"}
              {ticket.ticket_resolved_by_email ? (
                <div className="small text-medium-emphasis">
                  {ticket.ticket_resolved_by_email}
                </div>
              ) : null}
            </CTableDataCell>
          </CTableRow>

          <CTableRow>
            <CTableHeaderCell style={thStyle}>
              Generating notes
            </CTableHeaderCell>
            <CTableDataCell style={tdStyle} colSpan={3}>
              <div style={{ whiteSpace: "pre-wrap" }}>
                {ticket.ticket_generating_notes || "—"}
              </div>
            </CTableDataCell>
          </CTableRow>

          <CTableRow>
            <CTableHeaderCell style={thStyle}>
              Resolving notes
            </CTableHeaderCell>
            <CTableDataCell style={tdStyle} colSpan={3}>
              <div style={{ whiteSpace: "pre-wrap" }}>
                {ticket.ticket_resolving_notes || "—"}
              </div>
            </CTableDataCell>
          </CTableRow>

          <CTableRow>
            <CTableHeaderCell style={thStyle}>Part replaced</CTableHeaderCell>
            <CTableDataCell style={tdStyle} colSpan={3}>
              <CBadge
                color={
                  ticket.service_part_replaced || partsWithChecklist.length
                    ? "info"
                    : "secondary"
                }
              >
                {ticket.service_part_replaced || partsWithChecklist.length
                  ? "Yes"
                  : "No"}
              </CBadge>
            </CTableDataCell>
          </CTableRow>
        </CTableBody>
      </CTable>

      {/* Robot / configuration item */}
      <h5 className="mb-2">Robot details</h5>
      <CTable bordered striped responsive className="mb-4">
        <CTableBody>
          <CTableRow>
            <CTableHeaderCell style={thStyle}>Robot No</CTableHeaderCell>
            <CTableDataCell style={tdStyle}>{ticket.robot_no}</CTableDataCell>
            <CTableHeaderCell style={thStyle}>Robot type</CTableHeaderCell>
            <CTableDataCell style={tdStyle}>
              {ticket.robot_type || "—"}
            </CTableDataCell>
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell style={thStyle}>Block</CTableHeaderCell>
            <CTableDataCell style={tdStyle}>{ticket.block || "—"}</CTableDataCell>
            <CTableHeaderCell style={thStyle}>LoRa No</CTableHeaderCell>
            <CTableDataCell style={tdStyle}>
              {ticket.lora_no || "—"}
            </CTableDataCell>
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell style={thStyle}>DevEUI</CTableHeaderCell>
            <CTableDataCell style={tdStyle} colSpan={3}>
              <span className="font-monospace">{ticket.deveui || "—"}</span>
            </CTableDataCell>
          </CTableRow>
        </CTableBody>
      </CTable>

      {/* Parts replaced */}
      <h5 className="mb-2">
        Parts replaced{" "}
        <CBadge color="secondary" className="ms-1">
          {partsWithChecklist.length}
        </CBadge>
      </h5>
      <CTable bordered responsive className="mb-4 align-middle">
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell style={{ width: 50 }}>Sr</CTableHeaderCell>
            <CTableHeaderCell style={{ width: 70 }}>Image</CTableHeaderCell>
            <CTableHeaderCell>Part name</CTableHeaderCell>
            <CTableHeaderCell>Item code</CTableHeaderCell>
            <CTableHeaderCell style={{ width: 90 }}>Quantity</CTableHeaderCell>
            <CTableHeaderCell>Checklist</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {!partsWithChecklist.length ? (
            <CTableRow>
              <CTableDataCell colSpan={6} className="text-center text-medium-emphasis">
                No parts replaced
              </CTableDataCell>
            </CTableRow>
          ) : (
            partsWithChecklist.map((part, index) => {
              const checklistEntries =
                part.checklist && typeof part.checklist === "object"
                  ? Object.entries(part.checklist)
                  : [];
              return (
                <CTableRow key={part._id || part.part_replaced_id || index}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>
                    {part.item_image ? (
                      <a
                        href={part.item_image}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <CImage
                          src={part.item_image}
                          width={40}
                          height={40}
                          className="rounded border"
                          style={{ objectFit: "cover" }}
                        />
                      </a>
                    ) : (
                      "—"
                    )}
                  </CTableDataCell>
                  <CTableDataCell>
                    <strong>{part.part_replaced || "—"}</strong>
                  </CTableDataCell>
                  <CTableDataCell>{part.item_code || "—"}</CTableDataCell>
                  <CTableDataCell>
                    {part.replaced_part_quantity ?? "—"}
                  </CTableDataCell>
                  <CTableDataCell>
                    {checklistEntries.length ? (
                      <ul className="mb-0 ps-3 small">
                        {checklistEntries.map(([k, v]) => (
                          <li key={k}>
                            {k.replace(/_/g, " ")}: {String(v)}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      "—"
                    )}
                  </CTableDataCell>
                </CTableRow>
              );
            })
          )}
        </CTableBody>
      </CTable>

      {/* Attachments */}
      <h5 className="mb-2">Attachments</h5>
      <CTable bordered striped responsive className="mb-4">
        <CTableBody>
          <CTableRow>
            <CTableHeaderCell style={thStyle}>
              Raised images ({generatedImages.length})
            </CTableHeaderCell>
            <CTableDataCell>
              {generatedImages.length ? (
                <div className="d-flex flex-wrap gap-2">
                  {generatedImages.map((src, i) => (
                    <a key={i} href={src} target="_blank" rel="noreferrer">
                      <CImage
                        src={src}
                        width={90}
                        height={68}
                        className="rounded border"
                        style={{ objectFit: "cover" }}
                      />
                    </a>
                  ))}
                </div>
              ) : (
                "—"
              )}
            </CTableDataCell>
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell style={thStyle}>
              Resolved images ({resolvedImages.length})
            </CTableHeaderCell>
            <CTableDataCell>
              {resolvedImages.length ? (
                <div className="d-flex flex-wrap gap-2">
                  {resolvedImages.map((src, i) => (
                    <a key={i} href={src} target="_blank" rel="noreferrer">
                      <CImage
                        src={src}
                        width={90}
                        height={68}
                        className="rounded border"
                        style={{ objectFit: "cover" }}
                      />
                    </a>
                  ))}
                </div>
              ) : (
                "—"
              )}
            </CTableDataCell>
          </CTableRow>
        </CTableBody>
      </CTable>

      {/* Activity */}
      <h5 className="mb-2">Activity</h5>
      {ticket.last_activity?.length ? (
        <LastActivity lastactivity={ticket.last_activity} />
      ) : (
        <p className="text-medium-emphasis">No activity recorded.</p>
      )}
    </div>
  );
};

export default ViewServiceTicket;
