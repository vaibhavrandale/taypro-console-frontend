import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  CAvatar,
  CModal,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CTabs,
  CTabList,
  CTab,
  CTabContent,
  CTabPanel,
  CModalBody,
  CModalHeader,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilCalendar,
  cilPeople,
  cilWarning,
  cilCheckCircle,
  cilClock,
  cilBolt,
  cilSpeedometer,
  cilChart,
  cilLocationPin,
  cilRouter,
} from "@coreui/icons";
import { Link } from "react-router-dom";

// ── Theme tokens ─────────────────────────────────────────────────────────────
const T = {
  bg0: "#0d0f12", // deepest
  bg1: "#13161b", // card bg
  bg2: "#1c2029", // elevated surface
  bg3: "#252a35", // tile bg
  border: "rgba(255,255,255,0.07)",
  borderHover: "rgba(255,255,255,0.14)",
  textPrimary: "#e8eaf0",
  textMuted: "rgba(255,255,255,0.4)",
  textDim: "rgba(255,255,255,0.22)",
  green: "#22c55e",
  greenDim: "rgba(34,197,94,0.12)",
  greenBorder: "rgba(34,197,94,0.25)",
  red: "#f43f5e",
  redDim: "rgba(244,63,94,0.1)",
  redBorder: "rgba(244,63,94,0.22)",
  yellow: "#eab308",
  yellowDim: "rgba(234,179,8,0.1)",
  yellowBorder: "rgba(234,179,8,0.22)",
  blue: "#3b82f6",
  blueDim: "rgba(59,130,246,0.12)",
  blueBorder: "rgba(59,130,246,0.25)",
  cyan: "#06b6d4",
  cyanDim: "rgba(6,182,212,0.1)",
};

const getRoleRoute = (role) => {
  const map = {
    "Master Admin": "master-admin",
    "Service Admin": "service-admin",
    "Project Admin": "project-admin",
    "Client Admin": "client-admin",
    "Site Incharge": "site-incharge",
    "Site Technician": "site-technician",
    "Client Site Technician": "client-site-technician",
    "Master User": "master-user",
    "Service User": "service-user",
    "Project User": "project-user",
    "Factory Admin": "factory-admin",
  };
  return map[role] || "";
};

const fmt = (ts) =>
  new Date(ts).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

const fmtDate = (ts) =>
  new Date(ts).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

// ── Stat tile with accent top-border ─────────────────────────────────────────
const StatTile = ({ val, label, accent = T.textMuted, icon }) => (
  <div className="col-1 m-1">
    <div
      style={{
        background: T.bg3,
        border: `1px solid ${T.border}`,
        borderTop: `2px solid ${accent}`,
        borderRadius: 8,
        padding: "10px 8px 8px",
        textAlign: "center",
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: 22,
          fontWeight: 700,
          color: accent,
          lineHeight: 1,
        }}
      >
        {val}
      </p>
      <p
        style={{
          margin: "4px 0 0",
          fontSize: 10,
          color: T.textMuted,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </p>
    </div>
  </div>
);

// ── Section label ─────────────────────────────────────────────────────────────
const SectionLabel = ({ children, icon }) => (
  <div className="d-flex align-items-center gap-2 mb-2 mt-1">
    {icon && <CIcon icon={icon} style={{ color: T.textDim, fontSize: 13 }} />}
    <span
      style={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.12em",
        color: T.textMuted,
        textTransform: "uppercase",
      }}
    >
      {children}
    </span>
    <div style={{ flex: 1, height: 1, background: T.border }} />
  </div>
);

// ─── Detail Modal ─────────────────────────────────────────────────────────────
const DPRDetailModal = ({ item, visible, onClose, adminroute }) => {
  const [searchText, setSearchText] = useState("");
  if (!item) return null;

  const ops = item.robots_operational_details;
  const pm = item.preventive_maintenance_status;
  const tickets = item.ticket_details;
  const ticketsPending = tickets?.total_pending ?? 0;

  const pmPercent =
    pm?.automatic?.attempted > 0
      ? Math.round((pm.automatic.completed / pm.automatic.attempted) * 100)
      : 0;

  const uptimePercent =
    ops?.ready_for_operational > 0
      ? Math.round((ops.robots_uptime / ops.ready_for_operational) * 100)
      : 0;

  const tabStyle = {
    color: T.textMuted,
    fontSize: 13,
    paddingBottom: 10,
  };
  const filteredAutomaticRobts =
    pm?.automatic?.robots?.filter((robot) =>
      robot.robot_no?.toLowerCase().includes(searchText.toLowerCase()),
    ) || [];
  return (
    <CModal
      backdrop="static"
      visible={visible}
      onClose={onClose}
      size="xl"
      scrollable
      alignment="top"
    >
      <CModalHeader
        closeButton={false}
        className="d-flex align-items-center gap-3 mb-3"
      >
        {/* Site icon pill */}
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: T.blueDim,
            border: `1px solid ${T.blueBorder}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CIcon
            icon={cilLocationPin}
            style={{ color: T.blue, fontSize: 16 }}
          />
        </div>

        <div className="flex-grow-1">
          <p
            style={{
              margin: 0,
              fontSize: 16,

              color: T.textPrimary,
            }}
          >
            {item.site_id}
          </p>
        </div>

        {/* Date pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: T.bg3,
            border: `1px solid ${T.border}`,
            borderRadius: 20,
            padding: "4px 12px",
          }}
        >
          <CIcon
            icon={cilCalendar}
            style={{ color: T.textMuted, fontSize: 12 }}
          />
          <span style={{ fontSize: 12, color: T.textMuted }}>
            {fmtDate(item.report_date)}
          </span>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: T.textMuted,
            cursor: "pointer",
            fontSize: 28,
            lineHeight: 1,
            padding: "0 0 0 8px",
          }}
        >
          ×
        </button>
      </CModalHeader>
      <CModalBody
        style={{
          padding: "20px 24px 0",

          borderRadius: "12px 12px 0 0",
          borderBottom: `1px solid ${T.border}`,
          paddingBottom: 0,
        }}
      >
        {/* Tabs */}
        <CTabs activeItemKey="overview">
          <CTabList
            className="text-white"
            variant="underline"
            style={{ borderBottom: "none", gap: 18 }}
          >
            {[
              { key: "overview", label: "Overview", icon: cilChart },
              {
                key: "pm",
                label: "PM Robots",
                icon: cilSpeedometer,
                badge: pm?.automatic?.completed,
              },
              { key: "technicians", label: "Technicians", icon: cilPeople },
              { key: "activity", label: "Activity", icon: cilClock },
            ].map(({ key, label, icon, badge }) => (
              <CTab key={key} itemKey={key} style={tabStyle}>
                <CIcon icon={icon} style={{ fontSize: 13, marginRight: 5 }} />
                {label}
                {badge !== undefined && (
                  <span
                    style={{
                      marginLeft: 6,
                      fontSize: 10,
                      fontWeight: 700,
                      background: T.greenDim,
                      color: T.green,
                      border: `1px solid ${T.greenBorder}`,
                      borderRadius: 10,
                      padding: "1px 6px",
                    }}
                  >
                    {badge}
                  </span>
                )}
              </CTab>
            ))}
          </CTabList>

          {/* ── Tab content ── */}
          <CTabContent style={{ padding: "20px 0 0" }}>
            {/* OVERVIEW */}
            <CTabPanel itemKey="overview">
              {/* Comment banner — now vivid */}
              {item.comments && (
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    padding: "14px 16px",
                    marginBottom: 20,
                    borderRadius: 10,
                    background: "rgba(234,179,8,0.07)",
                    border: `1px solid ${T.yellowBorder}`,
                    borderLeft: `3px solid ${T.yellow}`,
                  }}
                >
                  <CIcon
                    icon={cilWarning}
                    style={{
                      color: T.yellow,
                      fontSize: 16,
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  />
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13,
                      color: "rgba(255,255,255,0.65)",
                      lineHeight: 1.6,
                    }}
                  >
                    {item.comments}
                  </p>
                </div>
              )}

              <SectionLabel icon={cilRouter}>Robot fleet</SectionLabel>
              <div className="d-flex justify-content-start align-items-start flex-wrap">
                <StatTile
                  val={ops?.ready_for_operational ?? 0}
                  label="Ready"
                  accent={T.blue}
                />
                <StatTile
                  val={ops?.online_operational ?? 0}
                  label="Online"
                  accent={T.green}
                />
                <StatTile
                  val={ops?.manual_operational ?? 0}
                  label="Manual"
                  accent={T.cyan}
                />
                <StatTile
                  val={ops?.unoperational ?? 0}
                  label="Non-op"
                  accent={T.red}
                />
                <StatTile
                  val={item.total_running_robots ?? 0}
                  label="Running"
                  accent={T.green}
                />
                <StatTile
                  val={item.total_failed_robots ?? 0}
                  label="Failed"
                  accent={T.red}
                />
              </div>

              {/* Uptime bar — glowing */}
              <div
                style={{
                  background: T.bg2,
                  border: `1px solid ${T.border}`,
                  borderRadius: 10,
                  padding: "12px 16px",
                  marginBottom: 20,
                }}
              >
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span
                    style={{
                      fontSize: 12,
                      color: T.textMuted,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <CIcon
                      icon={cilBolt}
                      style={{ color: T.yellow, fontSize: 14 }}
                    />
                    Robots uptime
                  </span>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: T.green,
                      textShadow: `0 0 8px ${T.green}`,
                    }}
                  >
                    {uptimePercent}%
                  </span>
                </div>
                <div
                  style={{
                    height: 6,
                    borderRadius: 4,
                    background: "rgba(255,255,255,0.08)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${uptimePercent}%`,
                      background: `linear-gradient(90deg, #16a34a, ${T.green})`,
                      borderRadius: 4,
                      boxShadow: `0 0 8px ${T.green}`,
                      transition: "width 0.6s ease",
                    }}
                  />
                </div>
              </div>

              <SectionLabel icon={cilWarning}>Tickets</SectionLabel>
              <div className="row g-2 mb-3">
                <StatTile
                  val={tickets?.total_raised ?? 0}
                  label="Raised"
                  accent={T.textMuted}
                />
                <StatTile
                  val={tickets?.total_closed ?? 0}
                  label="Closed"
                  accent={T.green}
                />
                <StatTile
                  val={ticketsPending}
                  label="Pending"
                  accent={ticketsPending > 0 ? T.yellow : T.green}
                />
              </div>

              {item.breakdown_reasons?.length > 0 && (
                <>
                  <SectionLabel>Breakdown reasons</SectionLabel>
                  <div
                    style={{
                      background: T.redDim,
                      border: `1px solid ${T.redBorder}`,
                      borderRadius: 8,
                      padding: "10px 14px",
                      marginBottom: 16,
                    }}
                  >
                    {item.breakdown_reasons.map((r, i) => (
                      <div
                        key={i}
                        className="d-flex align-items-start gap-2 py-1"
                      >
                        <CIcon
                          icon={cilWarning}
                          style={{
                            color: T.red,
                            fontSize: 13,
                            flexShrink: 0,
                            marginTop: 2,
                          }}
                        />
                        <span
                          style={{
                            fontSize: 13,
                            color: "rgba(255,255,255,0.55)",
                          }}
                        >
                          {r}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {item.robots_run_by && (
                <p style={{ fontSize: 12, color: T.textMuted, margin: 0 }}>
                  Run by:{" "}
                  <span style={{ color: T.textPrimary, fontWeight: 600 }}>
                    {item.robots_run_by}
                  </span>
                </p>
              )}
            </CTabPanel>

            {/* PM ROBOTS */}
            <CTabPanel itemKey="pm">
              {/* Progress header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: T.greenDim,
                  border: `1px solid ${T.greenBorder}`,
                  borderRadius: 10,
                  padding: "12px 16px",
                  marginBottom: 16,
                }}
              >
                <div>
                  <p style={{ margin: 0, fontSize: 11, color: T.textMuted }}>
                    Completion rate
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 15,
                      fontWeight: 700,
                      color: T.textPrimary,
                    }}
                  >
                    {pm?.automatic?.completed ?? 0}
                    <span style={{ color: T.textMuted, fontWeight: 400 }}>
                      {" "}
                      / {pm?.automatic?.attempted ?? 0}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        color: T.textMuted,
                        fontWeight: 400,
                        marginLeft: 6,
                      }}
                    >
                      automatic
                    </span>
                  </p>
                </div>
                <div style={{ textAlign: "right", minWidth: 90 }}>
                  <div
                    style={{
                      height: 6,
                      borderRadius: 4,
                      background: "rgba(255,255,255,0.08)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${pmPercent}%`,
                        background: `linear-gradient(90deg, #16a34a, ${T.green})`,
                        borderRadius: 4,
                        boxShadow: `0 0 6px ${T.green}`,
                      }}
                    />
                  </div>
                  <p
                    style={{
                      margin: "4px 0 0",
                      fontSize: 13,
                      fontWeight: 700,
                      color: T.green,
                    }}
                  >
                    {pmPercent}%
                  </p>
                </div>
              </div>
              <div className="d-flex justify-content-end align-items-center">
                <input
                  type="text"
                  className="form-control form-control-sm bg-dark text-light border-secondary"
                  placeholder="Search robot"
                  style={{ maxWidth: "250px" }}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>
              {filteredAutomaticRobts?.length > 0 ? (
                <CTable small hover responsive style={{ color: T.textPrimary }}>
                  <CTableHead>
                    <CTableRow style={{ background: T.bg3 }}>
                      {["#", "Robot", "Block", "PM"].map((h) => (
                        <CTableHeaderCell
                          key={h}
                          style={{
                            color: T.textMuted,
                            fontSize: 11,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            border: "none",
                            borderBottom: `1px solid ${T.border}`,
                          }}
                        >
                          {h}
                        </CTableHeaderCell>
                      ))}
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {filteredAutomaticRobts.map((robot, i) => (
                      <CTableRow
                        key={robot._id}
                        style={{ borderBottom: `1px solid ${T.border}` }}
                      >
                        <CTableDataCell
                          style={{
                            color: T.textMuted,
                            fontSize: 12,
                            border: "none",
                          }}
                        >
                          {i + 1}
                        </CTableDataCell>
                        <CTableDataCell
                          style={{
                            fontWeight: 600,
                            fontSize: 13,
                            color: T.textPrimary,
                            border: "none",
                          }}
                        >
                          {robot.robot_no}
                        </CTableDataCell>
                        <CTableDataCell
                          style={{
                            fontSize: 12,
                            color: T.textMuted,
                            border: "none",
                          }}
                        >
                          {robot.block}
                        </CTableDataCell>
                        <CTableDataCell
                          style={{ textAlign: "center", border: "none" }}
                        >
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: 20,
                              height: 20,
                              borderRadius: "50%",
                              background: T.greenDim,
                              border: `1px solid ${T.greenBorder}`,
                            }}
                          >
                            <CIcon
                              icon={cilCheckCircle}
                              style={{ color: T.green, fontSize: 12 }}
                            />
                          </span>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              ) : (
                <p
                  style={{
                    textAlign: "center",
                    color: T.textMuted,
                    padding: "32px 0",
                    fontSize: 13,
                  }}
                >
                  No PM robots recorded
                </p>
              )}
            </CTabPanel>

            {/* TECHNICIANS */}
            <CTabPanel itemKey="technicians">
              {item.technician_present?.length > 0 ? (
                <div className="d-flex flex-column gap-2">
                  {item.technician_present.map((tech) => (
                    <div
                      key={tech._id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        background: T.bg2,
                        border: `1px solid ${T.border}`,
                        borderRadius: 10,
                        padding: "12px 14px",
                        transition: "border-color 0.2s",
                      }}
                    >
                      <CAvatar
                        src={tech.profile_image}
                        size="md"
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: "50%",
                          objectFit: "cover",
                          overflow: "hidden",
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            margin: 0,
                            color: T.textPrimary,
                            fontSize: 14,
                          }}
                        >
                          {tech.name}
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontSize: 11,
                            color: T.textMuted,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {tech.email}
                        </p>
                      </div>
                      <span
                        style={{
                          flexShrink: 0,
                          fontSize: 10,
                          fontWeight: 600,
                          background: T.blueDim,
                          color: T.blue,
                          border: `1px solid ${T.blueBorder}`,
                          borderRadius: 6,
                          padding: "3px 8px",
                          letterSpacing: "0.04em",
                        }}
                      >
                        {tech.role}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p
                  style={{
                    textAlign: "center",
                    color: T.textMuted,
                    padding: "32px 0",
                    fontSize: 13,
                  }}
                >
                  No technicians recorded
                </p>
              )}
            </CTabPanel>

            {/* ACTIVITY */}
            <CTabPanel itemKey="activity">
              {item.last_activity?.length > 0 ? (
                <div className="d-flex flex-column gap-3">
                  {item.last_activity.map((act, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                      }}
                    >
                      <CAvatar
                        src={act.profile_image}
                        size="sm"
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: "50%",
                          objectFit: "cover",
                          overflow: "hidden",
                          flexShrink: 0,
                          marginTop: 2,
                        }}
                      />
                      <div
                        style={{
                          flex: 1,
                          background: T.bg2,
                          border: `1px solid ${T.border}`,
                          borderRadius: 10,
                          padding: "12px 14px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 6,
                          }}
                        >
                          <span
                            style={{
                              fontWeight: 600,
                              fontSize: 13,
                              color: T.textPrimary,
                            }}
                          >
                            {act.name}
                          </span>
                          <span
                            style={{
                              fontSize: 11,
                              color: T.textMuted,
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <CIcon icon={cilClock} style={{ fontSize: 11 }} />
                            {fmt(act.timestamp)}
                          </span>
                        </div>
                        <p
                          style={{
                            margin: 0,
                            fontSize: 12,
                            color: "rgba(255,255,255,0.5)",
                            lineHeight: 1.6,
                          }}
                          dangerouslySetInnerHTML={{ __html: act.details }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p
                  style={{
                    textAlign: "center",
                    color: T.textMuted,
                    padding: "32px 0",
                    fontSize: 13,
                  }}
                >
                  No activity recorded
                </p>
              )}
            </CTabPanel>
          </CTabContent>
        </CTabs>
      </CModalBody>
    </CModal>
  );
};

// ─── Card ─────────────────────────────────────────────────────────────────────
const DPRCard = ({ item }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const userInfo = useSelector((state) => state.userInfo);
  const adminroute = getRoleRoute(userInfo?.role);
  const lastActivity = item.last_activity?.[0];
  const ops = item.robots_operational_details;
  const pm = item.preventive_maintenance_status;
  const tickets = item.ticket_details;
  const ticketsPending = tickets?.total_pending ?? 0;
  const isOnline = (ops?.online_operational ?? 0) > 0;

  return (
    <>
      <div
        className="mx-1 my-2"
        style={{
          width: 290,

          border: `1px solid ${T.border}`,
          borderRadius: 0,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            padding: "12px 14px",

            borderBottom: `1px solid ${T.border}`,
          }}
        >
          <CAvatar
            src={lastActivity?.profile_image}
            size="md"
            style={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              objectFit: "cover",
              overflow: "hidden",
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                margin: 0,
                fontSize: 13,
                fontWeight: 600,
                color: T.textPrimary,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {lastActivity?.name}
            </p>
            <p style={{ margin: 0, fontSize: 10, color: T.textMuted }}>
              {lastActivity?.timestamp ? fmt(lastActivity.timestamp) : "—"} ·
              last update
            </p>
          </div>
          {/* Pulse dot */}
          <span
            style={{ position: "relative", width: 9, height: 9, flexShrink: 0 }}
          >
            <span
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background: isOnline ? T.green : "#374151",
                boxShadow: isOnline ? `0 0 0 3px ${T.greenDim}` : "none",
              }}
            />
          </span>
        </div>

        {/* Body */}
        <div style={{ padding: "14px", flex: 1 }}>
          {/* Site + date */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 14,
            }}
          >
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  color: T.textPrimary,
                }}
              >
                {item.site_id}
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: 11,
                  color: T.textMuted,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  marginTop: 2,
                }}
              >
                <CIcon icon={cilCalendar} style={{ fontSize: 11 }} />
                {fmtDate(item.report_date)}
              </p>
            </div>
            {item.comments && (
              <span
                title={item.comments}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  flexShrink: 0,
                  background: T.yellowDim,
                  border: `1px solid ${T.yellowBorder}`,
                }}
              >
                <CIcon
                  icon={cilWarning}
                  style={{ color: T.yellow, fontSize: 13 }}
                />
              </span>
            )}
          </div>

          {/* Stats — 3 tiles with color accent tops */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 8,
              marginBottom: 12,
            }}
          >
            {[
              {
                val: ops?.ready_for_operational ?? 0,
                label: "total",
                accent: T.blue,
              },
              {
                val: ops?.online_operational ?? 0,
                label: "Online",
                accent: T.green,
              },
              {
                val: ops?.manual_operational ?? 0,
                label: "Manual",
                accent: T.green,
              },
            ].map(({ val, label, accent }) => (
              <div
                key={label}
                style={{
                  background: T.bg3,
                  borderRadius: 8,
                  border: `1px solid ${T.border}`,
                  borderTop: `2px solid ${accent}`,
                  padding: "8px 4px 6px",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: 20,
                    fontWeight: 700,
                    color: accent,
                    lineHeight: 1,
                  }}
                >
                  {val}
                </p>
                <p
                  style={{
                    margin: "3px 0 0",
                    fontSize: 10,
                    color: T.textMuted,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>

          {/* PM row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: T.greenDim,
              border: `1px solid ${T.greenBorder}`,
              borderRadius: 8,
              padding: "8px 12px",
              marginBottom: 12,
            }}
          >
            <span
              style={{
                fontSize: 12,
                color: T.textMuted,
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <CIcon
                icon={cilSpeedometer}
                style={{ color: T.green, fontSize: 13 }}
              />
              Prev. Maintanance
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: T.green }}>
              {pm?.automatic?.completed ?? 0}/{pm?.automatic?.attempted ?? 0}
              <span
                style={{
                  fontSize: 10,
                  color: T.textMuted,
                  fontWeight: 400,
                  marginLeft: 4,
                }}
              >
                auto
              </span>
            </span>
          </div>

          {/* Technicians */}
          {item.technician_present?.length > 0 ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <CIcon
                icon={cilPeople}
                style={{ color: T.textDim, fontSize: 14 }}
              />
              <div style={{ display: "flex" }}>
                {item.technician_present.map((tech, i) => (
                  <CAvatar
                    key={tech._id}
                    src={tech.profile_image}
                    size="sm"
                    title={tech.name}
                    style={{
                      marginLeft: i === 0 ? 0 : -7,
                      border: `2px solid ${T.bg1}`,
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      objectFit: "cover",
                      overflow: "hidden",
                      flexShrink: 0,
                    }}
                  />
                ))}
              </div>
              <span style={{ fontSize: 11, color: T.textMuted, marginLeft: 2 }}>
                {item.technician_present.length} present
              </span>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <CIcon
                icon={cilPeople}
                style={{ color: T.textDim, fontSize: 14 }}
              />
              <div style={{ display: "flex" }}>
                <CAvatar
                  src="https://res.cloudinary.com/decyim6cd/image/upload/v1745395124/profile-image/p051mclk9t82laqu0mvq.webp"
                  size="sm"
                  title="Technician Not Available"
                  style={{
                    marginLeft: -7,
                    border: `2px solid ${T.bg1}`,
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    objectFit: "cover",
                    overflow: "hidden",
                    flexShrink: 0,
                  }}
                />
              </div>
              <span style={{ fontSize: 11, color: T.textMuted, marginLeft: 2 }}>
                No technician present
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "9px 14px",
            borderTop: `1px solid ${T.border}`,
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              color: T.textMuted,
            }}
          >
            {ticketsPending} ticket{ticketsPending !== 1 ? "s" : ""} pending
          </span>
          <div>
            <button
              onClick={() => setModalVisible(true)}
              className="btn btn-sm me-1"
            >
              View
            </button>
            <Link
              className="btn btn-sm"
              to={`/${getRoleRoute(userInfo.role)}/update-dpr/6a3ce6d2af27c7afc4f92121`}
            >
              update
            </Link>
          </div>
        </div>
      </div>

      <DPRDetailModal
        item={item}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        adminroute={adminroute}
      />
    </>
  );
};

export default DPRCard;
