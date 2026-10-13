import React, { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
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
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";
import { apiError, performanceGet, performanceSend } from "./api";
import { PeriodFields } from "./PerformanceHome";
import {
  COLORS,
  ChartBox,
  ChartCard,
  ScoreRing,
  Stat,
  fmt,
  kpiRowsFrom,
  slaSlices,
  tipStyle,
} from "./charts";

export default function SitePerformance({ mode, base }) {
  const { siteId } = useParams();
  const [search] = useSearchParams();
  const today = new Date();
  const [month, setMonth] = useState(Number(search.get("month")) || today.getMonth() + 1);
  const [year, setYear] = useState(Number(search.get("year")) || today.getFullYear());
  const [data, setData] = useState(null);
  const [config, setConfig] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const canEdit = mode !== "engineer";

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [performance, configuration] = await Promise.all([
        performanceGet(`/sites/${siteId}`, { month, year }),
        performanceGet(`/sites/${siteId}/configuration`),
      ]);
      setData(performance);
      setConfig(configuration);
      setForm({
        commissioning_date: configuration.commissioning_date
          ? String(configuration.commissioning_date).slice(0, 10)
          : "",
        warranty_status: configuration.warranty_status || "",
        warranty_date: configuration.warranty_date
          ? String(configuration.warranty_date).slice(0, 10)
          : "",
        cloth_type: configuration.cloth_type || "",
        mounting_type: configuration.mounting_type || "",
      });
    } catch (err) {
      setData(null);
      setConfig(null);
      setError(apiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteId]);

  const save = async () => {
    const body = {};
    for (const [key, value] of Object.entries(form)) {
      if (value) body[key] = value;
    }
    try {
      const updated = await performanceSend("patch", `/sites/${siteId}/configuration`, body);
      setConfig(updated);
      toast.success("Site configuration saved");
      load();
    } catch (err) {
      toast.error(apiError(err));
    }
  };

  const kpis = kpiRowsFrom(data?.score);
  const sla = slaSlices(data?.service_tickets?.sla);
  const faults = (data?.service_tickets?.by_fault || []).map((fault) => ({
    fault: fault.fault_type || "Unknown",
    resolved: fault.resolved || 0,
  }));

  return (
    <div className="p-3">
      <Link to={base}>Back</Link>
      <h3 className="mt-2 mb-1">Site {siteId}</h3>
      <div className="text-medium-emphasis small mb-3">Calculated from tickets, uptime, and maintenance for this site.</div>
      <PeriodFields
        month={month}
        year={year}
        setMonth={setMonth}
        setYear={setYear}
        extra={
          <CCol md="auto">
            <CButton color="primary" onClick={load}>
              Apply
            </CButton>
          </CCol>
        }
      />
      {loading && <LoadingSpinner />}
      {error && <CAlert color="danger">{error}</CAlert>}
      {config && (
        <CCard className="mb-3 shadow-sm">
          <CCardBody>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div className="fw-semibold">Site configuration</div>
              <span className={`badge ${config.configuration_complete ? "bg-success" : "bg-warning text-dark"}`}>
                {config.configuration_status?.replaceAll("_", " ")}
              </span>
            </div>
            {config.warranty_inconsistent && (
              <CAlert color="warning">Warranty status and warranty date disagree. The stored status is kept.</CAlert>
            )}
            {canEdit ? (
              <CRow className="g-2">
                <CCol md={3}>
                  <label>Commissioning date</label>
                  <CFormInput type="date" value={form.commissioning_date} onChange={(e) => setForm({ ...form, commissioning_date: e.target.value })} />
                </CCol>
                <CCol md={3}>
                  <label>Warranty status</label>
                  <CFormSelect value={form.warranty_status} onChange={(e) => setForm({ ...form, warranty_status: e.target.value })}>
                    <option value="">Select</option>
                    <option value="in_warranty">In warranty</option>
                    <option value="out_of_warranty">Out of warranty</option>
                  </CFormSelect>
                </CCol>
                <CCol md={3}>
                  <label>Warranty date</label>
                  <CFormInput type="date" value={form.warranty_date} onChange={(e) => setForm({ ...form, warranty_date: e.target.value })} />
                </CCol>
                <CCol md={3}>
                  <label>Cloth type</label>
                  <CFormSelect value={form.cloth_type} onChange={(e) => setForm({ ...form, cloth_type: e.target.value })}>
                    <option value="">Select</option>
                    <option value="PBT">PBT</option>
                    <option value="MF">MF</option>
                  </CFormSelect>
                </CCol>
                <CCol md={3}>
                  <label>Mounting type</label>
                  <CFormSelect value={form.mounting_type} onChange={(e) => setForm({ ...form, mounting_type: e.target.value })}>
                    <option value="">Select</option>
                    <option value="ground">Ground</option>
                    <option value="rooftop">Rooftop</option>
                  </CFormSelect>
                </CCol>
                <CCol md={12}>
                  <CButton color="primary" onClick={save}>
                    Save configuration
                  </CButton>
                </CCol>
              </CRow>
            ) : (
              <p className="mb-0">
                Cloth {config.cloth_type || "—"}, mounting {config.mounting_type || "—"}, warranty {config.warranty_status || "—"} until{" "}
                {config.warranty_date ? String(config.warranty_date).slice(0, 10) : "—"}.
              </p>
            )}
          </CCardBody>
        </CCard>
      )}
      {data && !loading && (
        <>
          <CRow>
            <CCol md={3}>
              <CCard className="mb-3 shadow-sm">
                <CCardBody className="d-flex justify-content-center">
                  <ScoreRing score={data.score?.overall_score} />
                </CCardBody>
              </CCard>
            </CCol>
            <Stat label="Service resolved" value={data.service_tickets?.resolved_in_period ?? 0} tone={COLORS.resolved} />
            <Stat label="Client resolved" value={data.client_tickets?.resolved_in_period ?? 0} tone={COLORS.created} />
            <Stat
              label="Cleaning uptime"
              value={`${fmt(data.uptime?.cleaning_uptime)}%`}
              hint={data.uptime?.status}
              tone={COLORS.uptime}
            />
          </CRow>
          <CRow>
            <CCol lg={7}>
              <ChartCard title="KPI scores">
                <ChartBox empty={!kpis.length}>
                  <BarChart data={kpis} layout="vertical" margin={{ left: 16, right: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
                    <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={tipStyle} />
                    <Bar dataKey="score" fill={COLORS.score} radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ChartBox>
              </ChartCard>
            </CCol>
            <CCol lg={5}>
              <ChartCard title="Service SLA">
                <ChartBox empty={!sla.length}>
                  <PieChart>
                    <Pie data={sla} dataKey="value" nameKey="name" innerRadius={52} outerRadius={80}>
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
          <ChartCard title="Resolved by fault">
            <ChartBox empty={!faults.length} height={220}>
              <BarChart data={faults}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="fault" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={tipStyle} />
                <Bar dataKey="resolved" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartBox>
          </ChartCard>
        </>
      )}
    </div>
  );
}

export function MasterSitePerformance() {
  return <SitePerformance mode="master" base="/master-admin/engineer-performance" />;
}
export function ManagerSitePerformance() {
  return <SitePerformance mode="manager" base="/service-admin/service-manager/performance" />;
}
export function EngineerSitePerformance() {
  return <SitePerformance mode="engineer" base="/service-admin/service-engineer/performance" />;
}
