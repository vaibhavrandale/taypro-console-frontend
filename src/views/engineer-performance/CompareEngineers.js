import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { CAlert, CButton, CCol, CFormCheck, CRow } from "@coreui/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import LoadingSpinner from "../../components/LoadingSpinner";
import { apiError, performanceGet } from "./api";
import { COLORS, ChartBox, ChartCard, tipStyle } from "./charts";

export default function CompareEngineers({ base }) {
  const today = new Date();
  const [users, setUsers] = useState([]);
  const [picked, setPicked] = useState([]);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get("/api/v1/users/get-all-internal-users-without-pg", { withCredentials: true })
      .then((response) => {
        const list = response.data?.data || response.data || [];
        const engineers = (Array.isArray(list) ? list : []).filter(
          (user) => String(user.designation || "").trim().toLowerCase() === "service engineer",
        );
        setUsers(engineers);
      })
      .catch((err) => setError(apiError(err)));
  }, []);

  const toggle = (id) => {
    setPicked((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  const compare = async () => {
    if (picked.length < 2) {
      setError("Select at least two service engineers");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await performanceGet("/compare", {
        month: today.getMonth() + 1,
        year: today.getFullYear(),
        engineer_ids: picked.join(","),
      });
      setRows(data?.engineers || []);
    } catch (err) {
      setRows([]);
      setError(apiError(err));
    } finally {
      setLoading(false);
    }
  };

  const chart = rows.map((row) => ({
    name: row.engineer?.username || "Engineer",
    score: row.score?.overall_score,
    sla: row.service_tickets?.sla?.compliance_percent,
    uptime: row.uptime?.cleaning_uptime,
    resolved: row.service_tickets?.resolved_in_period || 0,
    open: row.service_tickets?.current_open || 0,
  }));

  return (
    <div className="p-3">
      <Link to={base}>Back</Link>
      <h3 className="mt-2">Compare service engineers</h3>
      <p className="text-medium-emphasis">Current month, calculated from each engineer’s assigned sites.</p>
      {error && <CAlert color="danger">{error}</CAlert>}
      <CRow>
        {users.map((user) => (
          <CCol md={4} key={user._id}>
            <CFormCheck
              label={`${user.username || user.email}`}
              checked={picked.includes(String(user._id))}
              onChange={() => toggle(String(user._id))}
            />
          </CCol>
        ))}
      </CRow>
      {users.length === 0 && !error && <p>No users with designation Service Engineer.</p>}
      <CButton color="primary" className="mt-3" onClick={compare} disabled={picked.length < 2}>
        Compare
      </CButton>
      {loading && <LoadingSpinner />}
      {chart.length > 0 && (
        <CRow className="mt-3">
          <CCol lg={7}>
            <ChartCard title="Score, SLA, and uptime" hint="Blank bars mean that KPI had no eligible data.">
              <ChartBox empty={!chart.length} height={320}>
                <BarChart data={chart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={tipStyle} />
                  <Legend />
                  <Bar dataKey="score" name="Score" fill={COLORS.score} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="sla" name="Service SLA %" fill={COLORS.created} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="uptime" name="Uptime %" fill={COLORS.uptime} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartBox>
            </ChartCard>
          </CCol>
          <CCol lg={5}>
            <ChartCard title="Service tickets">
              <ChartBox empty={!chart.length} height={320}>
                <BarChart data={chart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={tipStyle} />
                  <Legend />
                  <Bar dataKey="resolved" name="Resolved" fill={COLORS.resolved} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="open" name="Open" fill={COLORS.amber} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartBox>
            </ChartCard>
          </CCol>
        </CRow>
      )}
    </div>
  );
}

export function MasterCompare() {
  return <CompareEngineers base="/master-admin/engineer-performance" />;
}
export function ManagerCompare() {
  return <CompareEngineers base="/service-admin/service-manager/performance" />;
}
