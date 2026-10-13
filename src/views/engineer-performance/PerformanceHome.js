import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCol,
  CFormInput,
  CFormSelect,
  CRow,
} from "@coreui/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import LoadingSpinner from "../../components/LoadingSpinner";
import { apiError, performanceGet } from "./api";
import {
  COLORS,
  ChartBox,
  ChartCard,
  MONTHS,
  ScoreRing,
  Stat,
  fmt,
  kpiRowsFrom,
  shortMonth,
  slaSlices,
  tipStyle,
} from "./charts";

export { fmt };

function monthHasWork(point) {
  if (!point) return false;
  return (
    (point.service_tickets?.created_in_period || 0) > 0 ||
    (point.service_tickets?.resolved_in_period || 0) > 0 ||
    (point.client_tickets?.created_in_period || 0) > 0 ||
    (point.client_tickets?.resolved_in_period || 0) > 0 ||
    (point.preventive_maintenance_completed || 0) > 0 ||
    point.uptime?.cleaning_uptime != null
  );
}

function dashboardHasWork(report) {
  if (!report) return false;
  return (
    (report.service_tickets?.created_in_period || 0) > 0 ||
    (report.service_tickets?.resolved_in_period || 0) > 0 ||
    (report.service_tickets?.current_open || 0) > 0 ||
    (report.client_tickets?.created_in_period || 0) > 0 ||
    (report.client_tickets?.resolved_in_period || 0) > 0 ||
    (report.client_tickets?.current_open || 0) > 0 ||
    (report.preventive_maintenance?.completed || 0) > 0 ||
    (report.materials?.created_in_period || 0) > 0 ||
    report.uptime?.cleaning_uptime != null
  );
}

export function PeriodFields({ month, year, setMonth, setYear, extra }) {
  return (
    <CRow className="g-2 mb-3 align-items-end">
      <CCol md={2}>
        <CFormSelect value={month} onChange={(e) => setMonth(Number(e.target.value))}>
          {MONTHS.map((name, i) => (
            <option key={name} value={i + 1}>
              {name}
            </option>
          ))}
        </CFormSelect>
      </CCol>
      <CCol md={2}>
        <CFormInput type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} />
      </CCol>
      {extra}
    </CRow>
  );
}

export default function PerformanceHome({ mode, base, title }) {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());
  const [siteId, setSiteId] = useState("");
  const [engineerId, setEngineerId] = useState("");
  const [data, setData] = useState(null);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openedNote, setOpenedNote] = useState("");
  const keepSelection = useRef(false);
  const canManage = mode !== "engineer";

  const load = async () => {
    setLoading(true);
    setError("");
    const params = { month, year };
    if (siteId.trim()) params.site_id = siteId.trim();
    if (canManage && engineerId.trim()) params.engineer_id = engineerId.trim();
    const trendParams = { year };
    if (params.site_id) trendParams.site_id = params.site_id;
    if (params.engineer_id) trendParams.engineer_id = params.engineer_id;
    try {
      const [dashboard, trend] = await Promise.all([
        performanceGet("/", params),
        performanceGet("/trends", trendParams),
      ]);
      let report = dashboard;
      let points = trend?.points || [];
      let activeYear = year;
      if (!keepSelection.current && !dashboardHasWork(dashboard)) {
        let active = [...points].reverse().find(monthHasWork);
        if (!active && year > 2000) {
          const previous = await performanceGet("/trends", { ...trendParams, year: year - 1 });
          const previousPoints = previous?.points || [];
          const older = [...previousPoints].reverse().find(monthHasWork);
          if (older) {
            active = older;
            points = previousPoints;
            activeYear = year - 1;
          }
        }
        if (active) {
          const activeMonth = Number(String(active.label).split("-")[1]);
          setMonth(activeMonth);
          setYear(activeYear);
          report = await performanceGet("/", { ...params, month: activeMonth, year: activeYear });
          setOpenedNote(`${MONTHS[activeMonth - 1]} ${activeYear} is the latest month with tickets or uptime.`);
        } else {
          setOpenedNote("");
        }
      }
      setData(report);
      setTrends(points);
    } catch (err) {
      setData(null);
      setTrends([]);
      setError(apiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const trendRows = trends.map((point) => ({
    month: shortMonth(point.label),
    score: point.score?.overall_score,
    uptime: point.uptime?.cleaning_uptime,
    created: point.service_tickets?.created_in_period || 0,
    resolved: point.service_tickets?.resolved_in_period || 0,
  }));
  const hasScoreLine = trendRows.some((row) => row.score != null || row.uptime != null);
  const kpis = kpiRowsFrom(data?.score);
  const sla = slaSlices(data?.service_tickets?.sla);
  const sites = [...(data?.service_tickets?.by_site || [])]
    .sort((a, b) => (b.created || 0) + (b.resolved || 0) - ((a.created || 0) + (a.resolved || 0)))
    .slice(0, 12)
    .map((site) => ({
      site: site.site_id,
      created: site.created || 0,
      resolved: site.resolved || 0,
      open: site.open || 0,
    }));
  const uptimeSites = (data?.uptime?.by_site || [])
    .filter((site) => site.monthly_cleaning_uptime != null)
    .slice(0, 12)
    .map((site) => ({
      site: site.site_id,
      uptime: Number(Number(site.monthly_cleaning_uptime).toFixed(1)),
    }));
  const faults = [...(data?.service_tickets?.by_fault || [])]
    .sort((a, b) => (b.resolved || 0) - (a.resolved || 0))
    .slice(0, 8)
    .map((fault) => ({
      fault: fault.fault_type || "Unknown",
      resolved: fault.resolved || 0,
      days: fault.average_resolution_days,
    }));

  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div>
          <h3 className="mb-0">{title}</h3>
          <div className="text-medium-emphasis small">
            Live calculations from tickets, uptime, maintenance, and material requests. Asia/Kolkata.
          </div>
          {openedNote && <div className="small text-primary">{openedNote}</div>}
        </div>
        <div className="d-flex gap-2">
          <Link className="btn btn-secondary" to={`${base}/gaps`}>
            Configuration gaps
          </Link>
          {canManage && (
            <>
              <Link className="btn btn-secondary" to={`${base}/compare`}>
                Compare
              </Link>
              <Link className="btn btn-secondary" to={`${base}/rules`}>
                KPI rules
              </Link>
            </>
          )}
        </div>
      </div>
      <PeriodFields
        month={month}
        year={year}
        setMonth={setMonth}
        setYear={setYear}
        extra={
          <>
            <CCol md={3}>
              <CFormInput placeholder="Site id" value={siteId} onChange={(e) => setSiteId(e.target.value)} />
            </CCol>
            {canManage && (
              <CCol md={3}>
                <CFormInput
                  placeholder="Engineer user id"
                  value={engineerId}
                  onChange={(e) => setEngineerId(e.target.value)}
                />
              </CCol>
            )}
            <CCol md="auto">
              <CButton
                color="primary"
                onClick={() => {
                  keepSelection.current = true;
                  setOpenedNote("");
                  load();
                }}
              >
                Apply
              </CButton>
            </CCol>
          </>
        }
      />
      {loading && <LoadingSpinner />}
      {error && <CAlert color="danger">{error}</CAlert>}
      {data && !loading && (
        <>
          <CRow className="align-items-stretch">
            <CCol md={3} sm={6}>
              <CCard className="mb-3 shadow-sm h-100">
                <CCardBody className="d-flex align-items-center gap-3">
                  <ScoreRing score={data.score?.overall_score} />
                  <div>
                    <div className="text-medium-emphasis small">Overall score</div>
                    <div className="fw-semibold text-capitalize">{data.score?.score_completeness || "—"}</div>
                    <div className="small text-medium-emphasis">
                      {data.score?.eligible_kpi_count ?? 0} KPIs in the score
                      {data.score?.excluded_kpi_count
                        ? `, ${data.score.excluded_kpi_count} waiting on data`
                        : ""}
                    </div>
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
            <Stat
              label="Service SLA"
              value={`${fmt(data.service_tickets?.sla?.compliance_percent)}%`}
              hint={`${data.service_tickets?.sla?.met ?? 0} met · ${data.service_tickets?.sla?.breached ?? 0} late`}
              tone={COLORS.uptime}
            />
            <Stat
              label="Cleaning uptime"
              value={`${fmt(data.uptime?.cleaning_uptime)}%`}
              hint={data.uptime?.status === "available" ? "Robot-weighted stored percent" : "No uptime report this month"}
              tone={COLORS.amber}
            />
            <Stat
              label="Open tickets"
              value={data.combined?.current_open ?? 0}
              hint={`${data.service_tickets?.current_open ?? 0} service · ${data.client_tickets?.current_open ?? 0} client`}
              tone={COLORS.breach}
            />
          </CRow>
          <CRow>
            <Stat label="Service created" value={data.service_tickets?.created_in_period ?? 0} tone={COLORS.created} />
            <Stat label="Service resolved" value={data.service_tickets?.resolved_in_period ?? 0} tone={COLORS.resolved} />
            <Stat
              label="Avg resolution"
              value={data.service_tickets?.average_resolution_days == null ? "—" : `${fmt(data.service_tickets.average_resolution_days)} d`}
              hint={`Median ${fmt(data.service_tickets?.median_resolution_days)} d`}
            />
            <Stat
              label="PM records"
              value={data.preventive_maintenance?.completed ?? 0}
              hint="Completed checklists only"
              tone="#8b5cf6"
            />
          </CRow>

          <CRow>
            <CCol lg={7}>
              <ChartCard title={`${year} score and uptime`} hint="Missing months stay blank. They are not scored as zero.">
                <ChartBox empty={!hasScoreLine}>
                  <LineChart data={trendRows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={tipStyle} />
                    <Legend />
                    <Line type="monotone" dataKey="score" name="Score" stroke={COLORS.score} strokeWidth={2} dot connectNulls={false} />
                    <Line type="monotone" dataKey="uptime" name="Uptime %" stroke={COLORS.uptime} strokeWidth={2} dot connectNulls={false} />
                  </LineChart>
                </ChartBox>
              </ChartCard>
            </CCol>
            <CCol lg={5}>
              <ChartCard title="KPI breakdown" hint="Each bar is that KPI’s own score. Weight decides how much it moves the overall.">
                <ChartBox empty={!kpis.length} height={260}>
                  <BarChart data={kpis} layout="vertical" margin={{ left: 16, right: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
                    <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={tipStyle} formatter={(value, _name, item) => [`${value} (weight ${item.payload.weight})`, "Score"]} />
                    <Bar dataKey="score" fill={COLORS.score} radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ChartBox>
              </ChartCard>
            </CCol>
          </CRow>

          <CRow>
            <CCol lg={8}>
              <ChartCard title={`${year} service tickets`} hint="Created and resolved inside each month.">
                <ChartBox empty={!trendRows.some((row) => row.created || row.resolved)} height={240}>
                  <BarChart data={trendRows}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={tipStyle} />
                    <Legend />
                    <Bar dataKey="created" name="Created" fill={COLORS.created} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="resolved" name="Resolved" fill={COLORS.resolved} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartBox>
              </ChartCard>
            </CCol>
            <CCol lg={4}>
              <ChartCard title="Service SLA mix" hint="Resolved tickets with a fault target.">
                <ChartBox empty={!sla.length} height={240}>
                  <PieChart>
                    <Pie data={sla} dataKey="value" nameKey="name" innerRadius={58} outerRadius={84} paddingAngle={2}>
                      {sla.map((slice) => (
                        <Cell key={slice.name} fill={slice.fill} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tipStyle} />
                    <Legend />
                  </PieChart>
                </ChartBox>
              </ChartCard>
            </CCol>
          </CRow>

          <CRow>
            <CCol lg={6}>
              <ChartCard title="Tickets by site" hint="Sites with service ticket activity this month.">
                <ChartBox empty={!sites.length} height={Math.max(220, sites.length * 36)}>
                  <BarChart data={sites} layout="vertical" margin={{ left: 8, right: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
                    <YAxis type="category" dataKey="site" width={120} tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={tipStyle} />
                    <Legend />
                    <Bar dataKey="created" name="Created" stackId="t" fill={COLORS.created} />
                    <Bar dataKey="resolved" name="Resolved" stackId="t" fill={COLORS.resolved} />
                    <Bar dataKey="open" name="Open" stackId="t" fill={COLORS.amber} />
                  </BarChart>
                </ChartBox>
              </ChartCard>
            </CCol>
            <CCol lg={6}>
              <ChartCard title="Uptime by site" hint="Stored monthly cleaning percent. Sites without a report are left out.">
                <ChartBox empty={!uptimeSites.length} height={Math.max(220, uptimeSites.length * 32)}>
                  <BarChart data={uptimeSites} layout="vertical" margin={{ left: 8, right: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
                    <YAxis type="category" dataKey="site" width={120} tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={tipStyle} />
                    <Bar dataKey="uptime" name="Uptime %" fill={COLORS.uptime} radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ChartBox>
              </ChartCard>
            </CCol>
          </CRow>

          <CRow>
            <CCol lg={7}>
              <ChartCard title="Resolved by fault" hint="Average days is in the tooltip.">
                <ChartBox empty={!faults.length} height={240}>
                  <BarChart data={faults}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="fault" tick={{ fontSize: 11 }} interval={0} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={tipStyle}
                      formatter={(value, _name, item) => {
                        const days = item?.payload?.days;
                        const extra = days == null ? "" : ` · avg ${Number(days).toFixed(1)} days`;
                        return [`${value}${extra}`, "Resolved"];
                      }}
                    />
                    <Bar dataKey="resolved" name="resolved" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartBox>
              </ChartCard>
            </CCol>
            <CCol lg={5}>
              <CCard className="mb-3 shadow-sm h-100">
                <CCardBody>
                  <div className="fw-semibold mb-2">Materials and consumption</div>
                  <div className="d-flex justify-content-between border-bottom py-2">
                    <span>Material requests</span>
                    <strong>{data.materials?.created_in_period ?? 0}</strong>
                  </div>
                  <div className="d-flex justify-content-between border-bottom py-2">
                    <span>Still open</span>
                    <strong>{data.materials?.awaiting_dispatch ?? 0}</strong>
                  </div>
                  <div className="d-flex justify-content-between border-bottom py-2">
                    <span>Within age threshold</span>
                    <strong>{fmt(data.materials?.on_time_percent)}%</strong>
                  </div>
                  <div className="d-flex justify-content-between border-bottom py-2">
                    <span>Part ledger match</span>
                    <strong>{fmt(data.consumption?.percent)}%</strong>
                  </div>
                  <div className="d-flex justify-content-between py-2">
                    <span>Client tickets resolved</span>
                    <strong>{data.client_tickets?.resolved_in_period ?? 0}</strong>
                  </div>
                  <div className="small text-medium-emphasis mt-2">
                    Client SLA stays blank until a day threshold is saved in KPI rules.
                    Late tickets without a reason: {data.service_tickets?.delay_reason_missing ?? 0}.
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>

          {(data.configuration?.sites || []).length > 0 && (
            <>
              <h5 className="mt-2">Sites in this scope</h5>
              <CRow>
                {data.configuration.sites.map((site) => (
                  <CCol md={4} key={site.site_id}>
                    <CCard className="mb-3 shadow-sm">
                      <CCardBody>
                        <Link to={`${base}/site/${site.site_id}?month=${month}&year=${year}`}>
                          {site.site_id}
                        </Link>
                        <div className="small mt-1 text-capitalize">{site.configuration_status?.replaceAll("_", " ")}</div>
                        <div className="small text-medium-emphasis">
                          {(site.missing_fields || []).join(", ") || "All required fields set"}
                        </div>
                      </CCardBody>
                    </CCard>
                  </CCol>
                ))}
              </CRow>
            </>
          )}
          <details className="small text-medium-emphasis mb-3">
            <summary>How these numbers are calculated</summary>
            <div className="mt-2">{data.uptime?.note}</div>
            {(data.limitations || []).map((line) => (
              <div key={line}>{line}</div>
            ))}
          </details>
        </>
      )}
    </div>
  );
}

export function MasterPerformanceHome() {
  return (
    <PerformanceHome
      mode="master"
      base="/master-admin/engineer-performance"
      title="Engineer performance"
    />
  );
}

export function ManagerPerformanceHome() {
  return (
    <PerformanceHome
      mode="manager"
      base="/service-admin/service-manager/performance"
      title="Engineer performance"
    />
  );
}

export function EngineerPerformanceHome() {
  return (
    <PerformanceHome
      mode="engineer"
      base="/service-admin/service-engineer/performance"
      title="My performance"
    />
  );
}
