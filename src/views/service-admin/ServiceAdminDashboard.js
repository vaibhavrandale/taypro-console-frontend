import React, { useCallback, useEffect, useReducer } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilReload } from "@coreui/icons";
import LoadingSpinner from "../../components/LoadingSpinner";

const BASE = "/service-admin";

const LINKS = {
  attendance: `${BASE}/technician-attendance`,
  location: `${BASE}/technician-location`,
  tickets: `${BASE}/service-tickets`,
  cleaning: `${BASE}/all-site-cleaning-log`,
  gateways: `${BASE}/all-site-gateways`,
  robots: `${BASE}/robot-battery-temperature`,
  siteManagement: `${BASE}/site-management`,
  dpr: `${BASE}/all-site-dpr`,
};

const COLORS = {
  cyan: "#38bdf8",
  green: "#34d399",
  amber: "#fbbf24",
  red: "#f87171",
  purple: "#a78bfa",
  slate: "#94a3b8",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOAD":
      return { ...state, loading: true, refreshing: false, error: "" };
    case "REFRESH":
      return { ...state, refreshing: true, error: "" };
    case "OK":
      return {
        ...state,
        loading: false,
        refreshing: false,
        data: action.payload,
      };
    case "FAIL":
      return {
        ...state,
        loading: false,
        refreshing: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

const RefreshBtn = ({ onClick, disabled }) => (
  <CButton
    color="secondary"
    variant="outline"
    size="sm"
    className="px-2"
    title="Refresh"
    disabled={disabled}
    onClick={onClick}
  >
    {disabled ? (
      <CSpinner size="sm" />
    ) : (
      <CIcon icon={cilReload} size="sm" />
    )}
  </CButton>
);

const fmtSite = (id = "") =>
  String(id)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const fmtTime = (d) => (d ? moment(d).format("hh:mm A") : "—");

const Kpi = ({ label, value, sub, color, to, onRefresh, refreshing }) => (
  <CCard className="h-100 shadow-sm border-0">
    <CCardBody className="py-3">
      <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
        <div className="small text-medium-emphasis text-uppercase fw-semibold">
          {label}
        </div>
        <div className="d-flex align-items-center gap-2 flex-shrink-0">
          {to ? (
            <Link to={to} className="small text-decoration-none">
              View →
            </Link>
          ) : null}
          {onRefresh ? (
            <RefreshBtn onClick={onRefresh} disabled={refreshing} />
          ) : null}
        </div>
      </div>
      <div className="fs-4 fw-semibold lh-1" style={{ color }}>
        {value}
      </div>
      {sub ? <div className="small text-medium-emphasis mt-2">{sub}</div> : null}
    </CCardBody>
  </CCard>
);

const Section = ({
  title,
  to,
  children,
  actionLabel = "View details",
  onRefresh,
  refreshing,
}) => (
  <CCard className="h-100 shadow-sm mb-0">
    <CCardHeader className="d-flex justify-content-between align-items-center gap-2">
      <h6 className="mb-0">{title}</h6>
      <div className="d-flex align-items-center gap-2 flex-shrink-0">
        {to ? (
          <Link to={to} className="btn btn-sm btn-outline-secondary">
            {actionLabel}
          </Link>
        ) : null}
        {onRefresh ? (
          <RefreshBtn onClick={onRefresh} disabled={refreshing} />
        ) : null}
      </div>
    </CCardHeader>
    <CCardBody>{children}</CCardBody>
  </CCard>
);

const Empty = ({ text = "No data" }) => (
  <div className="text-center text-medium-emphasis py-3 small">{text}</div>
);

const ServiceAdminDashboard = () => {
  const [{ loading, refreshing, error, data }, dispatch] = useReducer(reducer, {
    loading: true,
    refreshing: false,
    error: "",
    data: null,
  });

  const load = useCallback(async (soft = false) => {
    try {
      dispatch({ type: soft ? "REFRESH" : "LOAD" });
      const res = await axios.get("/api/v1/service-admin/dashboard-summary", {
        withCredentials: true,
      });
      dispatch({ type: "OK", payload: res.data.data });
    } catch (err) {
      dispatch({
        type: "FAIL",
        payload:
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to load service dashboard",
      });
    }
  }, []);

  useEffect(() => {
    load(false);
  }, [load]);

  const refresh = () => load(true);
  const rf = { onRefresh: refresh, refreshing };

  if (loading) {
    return (
      <div className="text-center py-5">
        <LoadingSpinner />
        <div className="small text-medium-emphasis mt-2">
          Loading all-sites summary…
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-5">
        <div className="text-danger mb-3">{error || "No data"}</div>
        <CButton color="secondary" size="sm" onClick={() => load(false)}>
          Retry
        </CButton>
      </div>
    );
  }

  const {
    cleaning,
    uptime_sites,
    attendance,
    location,
    robots,
    gateways,
    tickets,
    subscriptions,
    month,
  } = data;

  const fmtDate = (d) => (d ? moment(d).format("DD MMM YYYY") : "—");

  const daysLabel = (days) => {
    if (days == null) return "—";
    if (days < 0) return `Expired ${Math.abs(days)}d ago`;
    if (days === 0) return "Expires today";
    return `${days}d left`;
  };

  const daysBadge = (s) => {
    if (s.days_remaining == null) return "secondary";
    if (s.days_remaining < 0 || s.subscription_status === "expired")
      return "danger";
    if (s.days_remaining <= 30) return "warning";
    return "success";
  };

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3">
        <div>
          <h4 className="mb-1">Service Operations Dashboard</h4>
          <p className="text-medium-emphasis mb-0">
            Priority: Cleaning → Attendance → Location → Online/Offline →
            Tickets · Uptime via site links
          </p>
        </div>
        <div className="d-flex flex-wrap gap-2">
          <Link to={LINKS.cleaning} className="btn btn-sm btn-primary">
            Cleaning Logs
          </Link>
          <Link to={LINKS.attendance} className="btn btn-sm btn-secondary">
            Attendance
          </Link>
          <Link to={LINKS.location} className="btn btn-sm btn-secondary">
            Location
          </Link>
        </div>
      </div>

      {/* Priority KPI strip — 2 rows × 3 cards */}
      <CRow className="g-3 mb-3">
        <CCol xs={12} sm={6} md={4}>
          <Kpi
            label="1 · Cleaning Today"
            value={cleaning.completed}
            sub={`${cleaning.inprogress} running · ${cleaning.failure} failed`}
            color={COLORS.green}
            to={LINKS.cleaning}
            {...rf}
          />
        </CCol>
        <CCol xs={12} sm={6} md={4}>
          <Kpi
            label="2 · Attendance"
            value={attendance.total}
            sub={`${attendance.punched_in} on site · ${attendance.punched_out} out`}
            color={COLORS.cyan}
            to={LINKS.attendance}
            {...rf}
          />
        </CCol>
        <CCol xs={12} sm={6} md={4}>
          <Kpi
            label="3 · Location Tracks"
            value={location.technician_count}
            sub={`${location.points} pts · ${location.site_count} sites`}
            color={COLORS.amber}
            to={LINKS.location}
            {...rf}
          />
        </CCol>
        <CCol xs={12} sm={6} md={4}>
          <Kpi
            label="4 · Robots Online"
            value={`${robots.online}/${robots.total}`}
            sub={`${robots.offline} offline`}
            color={COLORS.cyan}
            to={LINKS.siteManagement}
            {...rf}
          />
        </CCol>
        <CCol xs={12} sm={6} md={4}>
          <Kpi
            label="5 · Gateways"
            value={`${gateways.online}/${gateways.total}`}
            sub={`${gateways.offline} offline`}
            color={gateways.offline > 0 ? COLORS.red : COLORS.green}
            to={LINKS.gateways}
            {...rf}
          />
        </CCol>
        <CCol xs={12} sm={6} md={4}>
          <Kpi
            label="6 · Tickets Pending"
            value={tickets.pending}
            sub={`${tickets.raised} raised`}
            color={COLORS.red}
            to={LINKS.tickets}
            {...rf}
          />
        </CCol>
      </CRow>

      {/* 1. CLEANING — detailed */}
      <CRow className="g-3 mb-3">
        <CCol xs={12}>
          <Section title="1. Cleaning Summary (Today) — All Sites" to={LINKS.cleaning} {...rf}>
            <CRow className="g-3 mb-3">
              <CCol xs={4}>
                <div className="small text-medium-emphasis">Completed</div>
                <div className="fs-3 fw-semibold" style={{ color: COLORS.green }}>
                  {cleaning.completed}
                </div>
              </CCol>
              <CCol xs={4}>
                <div className="small text-medium-emphasis">In progress</div>
                <div className="fs-3 fw-semibold" style={{ color: COLORS.amber }}>
                  {cleaning.inprogress}
                </div>
              </CCol>
              <CCol xs={4}>
                <div className="small text-medium-emphasis">Failed</div>
                <div className="fs-3 fw-semibold" style={{ color: COLORS.red }}>
                  {cleaning.failure}
                </div>
              </CCol>
            </CRow>
            {!cleaning.by_site?.length ? (
              <Empty text="No cleaning cycles today" />
            ) : (
              <CTable hover responsive bordered small className="mb-0 align-middle text-center">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>SR</CTableHeaderCell>
                    <CTableHeaderCell className="text-start">Site</CTableHeaderCell>
                    <CTableHeaderCell>Completed</CTableHeaderCell>
                    <CTableHeaderCell>Running</CTableHeaderCell>
                    <CTableHeaderCell>Failed</CTableHeaderCell>
                    <CTableHeaderCell>Uptime</CTableHeaderCell>
                    <CTableHeaderCell>Detail</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {cleaning.by_site.map((s, i) => (
                    <CTableRow key={s.site_id}>
                      <CTableDataCell>{i + 1}</CTableDataCell>
                      <CTableDataCell className="text-start small">
                        {fmtSite(s.site_id)}
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color="success">{s.completed}</CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color="warning">{s.inprogress}</CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={s.failure ? "danger" : "secondary"}>
                          {s.failure}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        <Link
                          to={`${LINKS.cleaning}/cleaning-report/${s.site_id}`}
                          className="btn btn-sm btn-outline-info"
                        >
                          Uptime
                        </Link>
                      </CTableDataCell>
                      <CTableDataCell>
                        <Link
                          to={`${LINKS.cleaning}/${s.site_id}`}
                          className="btn btn-sm btn-outline-secondary"
                        >
                          Open
                        </Link>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            )}
          </Section>
        </CCol>
      </CRow>

      {/* 2. UPTIME — links only */}
      <CRow className="g-3 mb-3">
        <CCol xs={12}>
          <Section
            title={`2. Site Uptime Links — ${month}`}
            to={LINKS.dpr}
            actionLabel="DPR"
            {...rf}
          >
            <p className="small text-medium-emphasis mb-3">
              Open a site report for cleaning / availability uptime (loaded on
              demand).
            </p>
            {!uptime_sites?.length ? (
              <Empty text="No sites" />
            ) : (
              <div className="d-flex flex-wrap gap-2">
                {uptime_sites.map((s) => (
                  <Link
                    key={s.site_id}
                    to={`${LINKS.cleaning}/cleaning-report/${s.site_id}`}
                    className="btn btn-sm btn-outline-secondary"
                  >
                    {fmtSite(s.site_id)}
                  </Link>
                ))}
              </div>
            )}
          </Section>
        </CCol>
      </CRow>

      {/* 3. ATTENDANCE — detailed */}
      <CRow className="g-3 mb-3">
        <CCol xs={12} lg={5}>
          <Section
            title="3. Technician Attendance (Today) by Site"
            to={LINKS.attendance}
            {...rf}
          >
            <CRow className="g-2 mb-3">
              <CCol xs={4}>
                <div className="small text-medium-emphasis">Present</div>
                <div className="fs-4 fw-semibold" style={{ color: COLORS.cyan }}>
                  {attendance.total}
                </div>
              </CCol>
              <CCol xs={4}>
                <div className="small text-medium-emphasis">On site</div>
                <div className="fs-4 fw-semibold" style={{ color: COLORS.amber }}>
                  {attendance.punched_in}
                </div>
              </CCol>
              <CCol xs={4}>
                <div className="small text-medium-emphasis">Punched out</div>
                <div className="fs-4 fw-semibold" style={{ color: COLORS.green }}>
                  {attendance.punched_out}
                </div>
              </CCol>
            </CRow>
            {!attendance.by_site?.length ? (
              <Empty text="No punches today" />
            ) : (
              <CTable hover responsive small className="mb-0">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>SR</CTableHeaderCell>
                    <CTableHeaderCell>Site</CTableHeaderCell>
                    <CTableHeaderCell>Present</CTableHeaderCell>
                    <CTableHeaderCell>On site</CTableHeaderCell>
                    <CTableHeaderCell>Out</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {attendance.by_site.map((s, i) => (
                    <CTableRow key={s.site_id}>
                      <CTableDataCell>{i + 1}</CTableDataCell>
                      <CTableDataCell className="small">
                        {fmtSite(s.site_id)}
                      </CTableDataCell>
                      <CTableDataCell>{s.total}</CTableDataCell>
                      <CTableDataCell>{s.punched_in}</CTableDataCell>
                      <CTableDataCell>{s.punched_out}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            )}
          </Section>
        </CCol>
        <CCol xs={12} lg={7}>
          <Section
            title="3b. Who Punched In Today"
            to={LINKS.attendance}
            actionLabel="Full list"
            {...rf}
          >
            {!attendance.list?.length ? (
              <Empty text="No technicians punched in today" />
            ) : (
              <CTable hover responsive small className="mb-0 align-middle">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>SR</CTableHeaderCell>
                    <CTableHeaderCell>Technician</CTableHeaderCell>
                    <CTableHeaderCell>Site</CTableHeaderCell>
                    <CTableHeaderCell>In</CTableHeaderCell>
                    <CTableHeaderCell>Out</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {attendance.list.map((a, i) => (
                    <CTableRow key={a._id || i}>
                      <CTableDataCell>{i + 1}</CTableDataCell>
                      <CTableDataCell className="small">
                        {a.username}
                      </CTableDataCell>
                      <CTableDataCell className="small">
                        {fmtSite(a.site_id)}
                      </CTableDataCell>
                      <CTableDataCell className="small">
                        {fmtTime(a.punchin_time)}
                      </CTableDataCell>
                      <CTableDataCell className="small">
                        {fmtTime(a.punchout_time)}
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge
                          color={
                            a.status === "punched_out" ? "success" : "warning"
                          }
                        >
                          {a.status === "punched_out" ? "Out" : "On site"}
                        </CBadge>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            )}
          </Section>
        </CCol>
      </CRow>

      {/* 4. LOCATION TRACKING */}
      <CRow className="g-3 mb-3">
        <CCol xs={12} lg={5}>
          <Section
            title="4. Technician Location Tracking (Today)"
            to={LINKS.location}
            {...rf}
          >
            <CRow className="g-2 mb-3">
              <CCol xs={4}>
                <div className="small text-medium-emphasis">Technicians</div>
                <div className="fs-4 fw-semibold" style={{ color: COLORS.amber }}>
                  {location.technician_count}
                </div>
              </CCol>
              <CCol xs={4}>
                <div className="small text-medium-emphasis">GPS points</div>
                <div className="fs-4 fw-semibold" style={{ color: COLORS.cyan }}>
                  {location.points}
                </div>
              </CCol>
              <CCol xs={4}>
                <div className="small text-medium-emphasis">Sites</div>
                <div className="fs-4 fw-semibold">{location.site_count}</div>
              </CCol>
            </CRow>
            {!location.by_site?.length ? (
              <Empty text="No location tracks today" />
            ) : (
              <CTable hover responsive small className="mb-0">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>SR</CTableHeaderCell>
                    <CTableHeaderCell>Site</CTableHeaderCell>
                    <CTableHeaderCell>Techs</CTableHeaderCell>
                    <CTableHeaderCell>Points</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {location.by_site.map((s, i) => (
                    <CTableRow key={s.site_id}>
                      <CTableDataCell>{i + 1}</CTableDataCell>
                      <CTableDataCell className="small">
                        {fmtSite(s.site_id)}
                      </CTableDataCell>
                      <CTableDataCell>{s.technician_count}</CTableDataCell>
                      <CTableDataCell>{s.points}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            )}
          </Section>
        </CCol>
        <CCol xs={12} lg={7}>
          <Section
            title="4b. Latest Location Activity"
            to={LINKS.location}
            actionLabel="Open map"
            {...rf}
          >
            {!location.tracks?.length ? (
              <Empty text="No live tracks" />
            ) : (
              <CTable hover responsive small className="mb-0 align-middle">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>SR</CTableHeaderCell>
                    <CTableHeaderCell>Technician</CTableHeaderCell>
                    <CTableHeaderCell>Site</CTableHeaderCell>
                    <CTableHeaderCell>Last seen</CTableHeaderCell>
                    <CTableHeaderCell>Points</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {location.tracks.map((t, i) => (
                    <CTableRow key={String(t.user_id)}>
                      <CTableDataCell>{i + 1}</CTableDataCell>
                      <CTableDataCell className="small">
                        {t.username}
                      </CTableDataCell>
                      <CTableDataCell className="small">
                        {fmtSite(t.site_id)}
                      </CTableDataCell>
                      <CTableDataCell className="small">
                        {t.last_recorded_at
                          ? moment(t.last_recorded_at).format("hh:mm A")
                          : "—"}
                      </CTableDataCell>
                      <CTableDataCell>{t.points}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            )}
          </Section>
        </CCol>
      </CRow>

      {/* 5. ONLINE / OFFLINE */}
      <CRow className="g-3 mb-3">
        <CCol xs={12} lg={6}>
          <Section title="5. Robots Online / Offline" to={LINKS.siteManagement} {...rf}>
            <CRow className="g-2 mb-3">
              <CCol xs={4}>
                <div className="small text-medium-emphasis">Online</div>
                <div className="fs-4 fw-semibold" style={{ color: COLORS.green }}>
                  {robots.online}
                </div>
              </CCol>
              <CCol xs={4}>
                <div className="small text-medium-emphasis">Offline</div>
                <div className="fs-4 fw-semibold" style={{ color: COLORS.red }}>
                  {robots.offline}
                </div>
              </CCol>
              <CCol xs={4}>
                <div className="small text-medium-emphasis">Low battery</div>
                <div className="fs-4 fw-semibold" style={{ color: COLORS.amber }}>
                  {robots.low_battery}
                </div>
              </CCol>
            </CRow>
            {!robots.by_site?.length ? (
              <Empty />
            ) : (
              <CTable hover responsive small className="mb-0">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>SR</CTableHeaderCell>
                    <CTableHeaderCell>Site</CTableHeaderCell>
                    <CTableHeaderCell>On</CTableHeaderCell>
                    <CTableHeaderCell>Off</CTableHeaderCell>
                    <CTableHeaderCell>Avg V</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {robots.by_site.map((s, i) => (
                    <CTableRow key={s.site_id}>
                      <CTableDataCell>{i + 1}</CTableDataCell>
                      <CTableDataCell className="small">
                        {fmtSite(s.site_id)}
                      </CTableDataCell>
                      <CTableDataCell>{s.online}</CTableDataCell>
                      <CTableDataCell>{s.offline}</CTableDataCell>
                      <CTableDataCell>{s.avg_battery}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            )}
          </Section>
        </CCol>
        <CCol xs={12} lg={6}>
          <Section title="5b. Gateways Online / Offline" to={LINKS.gateways} {...rf}>
            <CRow className="g-2 mb-3">
              <CCol xs={6}>
                <div className="small text-medium-emphasis">Online</div>
                <div className="fs-4 fw-semibold" style={{ color: COLORS.green }}>
                  {gateways.online}/{gateways.total}
                </div>
              </CCol>
              <CCol xs={6}>
                <div className="small text-medium-emphasis">Offline</div>
                <div className="fs-4 fw-semibold" style={{ color: COLORS.red }}>
                  {gateways.offline}
                </div>
              </CCol>
            </CRow>
            {!gateways.by_site?.length ? (
              <Empty />
            ) : (
              <CTable hover responsive small className="mb-0">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>SR</CTableHeaderCell>
                    <CTableHeaderCell>Site</CTableHeaderCell>
                    <CTableHeaderCell>Online</CTableHeaderCell>
                    <CTableHeaderCell>Offline</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {gateways.by_site.map((s, i) => (
                    <CTableRow key={s.site_id}>
                      <CTableDataCell>{i + 1}</CTableDataCell>
                      <CTableDataCell className="small">
                        {fmtSite(s.site_id)}
                      </CTableDataCell>
                      <CTableDataCell>{s.online}</CTableDataCell>
                      <CTableDataCell>{s.offline}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            )}
          </Section>
        </CCol>
      </CRow>

      {/* 6. SERVICE TICKETS */}
      <CRow className="g-3 mb-3">
        <CCol xs={12} lg={7}>
          <Section title="6. Service Tickets by Site" to={LINKS.tickets} {...rf}>
            {!tickets.by_site?.length ? (
              <Empty />
            ) : (
              <CTable hover responsive small className="mb-0">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>SR</CTableHeaderCell>
                    <CTableHeaderCell>Site</CTableHeaderCell>
                    <CTableHeaderCell>Raised</CTableHeaderCell>
                    <CTableHeaderCell>Pending</CTableHeaderCell>
                    <CTableHeaderCell>Resolved</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {tickets.by_site.map((s, i) => (
                    <CTableRow key={s.site_id}>
                      <CTableDataCell>{i + 1}</CTableDataCell>
                      <CTableDataCell className="small">
                        {fmtSite(s.site_id)}
                      </CTableDataCell>
                      <CTableDataCell>{s.raised}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={s.pending ? "warning" : "secondary"}>
                          {s.pending}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell>{s.resolved}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            )}
          </Section>
        </CCol>
        <CCol xs={12} lg={5}>
          <Section title="6b. Oldest Pending Tickets" to={LINKS.tickets} {...rf}>
            {!tickets.oldest_pending?.length ? (
              <Empty text="No pending tickets" />
            ) : (
              tickets.oldest_pending.map((t) => (
                <div
                  key={t._id || t.ticket_id}
                  className="d-flex justify-content-between small border-bottom py-2"
                >
                  <Link
                    to={`${LINKS.tickets}/view-service-ticket/${t._id}`}
                    className="text-decoration-none"
                  >
                    {t.ticket_id}
                  </Link>
                  <span className="text-medium-emphasis">
                    {fmtSite(t.site_id)} · {t.days_pending}d
                  </span>
                </div>
              ))
            )}
          </Section>
        </CCol>
      </CRow>

      {/* Subscriptions — full details */}
      <CRow className="g-3 mb-4">
        <CCol xs={12}>
          <Section title="Client Subscriptions" {...rf}>
            <CRow className="g-2 mb-3">
              {[
                ["subscribed", COLORS.green],
                ["free", COLORS.cyan],
                ["expired", COLORS.red],
                ["cancelled", COLORS.slate],
              ].map(([key, color]) => (
                <CCol xs={6} md={3} key={key}>
                  <div className="small text-medium-emphasis text-capitalize">
                    {key}
                  </div>
                  <div className="fs-5 fw-semibold" style={{ color }}>
                    {subscriptions[key] || 0}
                  </div>
                </CCol>
              ))}
            </CRow>
            {!subscriptions.list?.length ? (
              <Empty />
            ) : (
              <CTable hover responsive bordered small className="mb-0 align-middle">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>SR</CTableHeaderCell>
                    <CTableHeaderCell>Client</CTableHeaderCell>
                    <CTableHeaderCell>Plan / Tier</CTableHeaderCell>
                    <CTableHeaderCell>Frequency</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Start date</CTableHeaderCell>
                    <CTableHeaderCell>End date</CTableHeaderCell>
                    <CTableHeaderCell>Days remaining</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {subscriptions.list.map((s, i) => (
                    <CTableRow
                      key={s._id || s.client_id}
                      className={
                        s.is_expired
                          ? "table-danger"
                          : s.is_expiring_soon
                            ? "table-warning"
                            : ""
                      }
                    >
                      <CTableDataCell>{i + 1}</CTableDataCell>
                      <CTableDataCell className="small">
                        <div className="fw-semibold">
                          {s.client_name || s.client_id}
                        </div>
                        <div className="text-medium-emphasis">{s.client_id}</div>
                      </CTableDataCell>
                      <CTableDataCell className="small">
                        {s.plan_id || "—"}
                        <div className="text-medium-emphasis">
                          {s.serviceTier || "—"}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell className="small text-capitalize">
                        {s.frequency || "—"}
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge
                          color={
                            s.subscription_status === "subscribed"
                              ? "success"
                              : s.subscription_status === "expired"
                                ? "danger"
                                : s.subscription_status === "free"
                                  ? "info"
                                  : "secondary"
                          }
                        >
                          {s.subscription_status}
                        </CBadge>
                        {s.is_trial_ended ? (
                          <div className="small text-medium-emphasis mt-1">
                            Trial ended
                          </div>
                        ) : null}
                      </CTableDataCell>
                      <CTableDataCell className="small">
                        {fmtDate(s.subscription_start_date)}
                      </CTableDataCell>
                      <CTableDataCell className="small">
                        {fmtDate(s.subscription_end_date)}
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={daysBadge(s)}>
                          {daysLabel(s.days_remaining)}
                        </CBadge>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            )}
          </Section>
        </CCol>
      </CRow>
    </div>
  );
};

export default ServiceAdminDashboard;
