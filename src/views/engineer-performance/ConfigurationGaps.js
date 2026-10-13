import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CAlert, CBadge, CCard, CCardBody, CCol, CRow } from "@coreui/react";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import LoadingSpinner from "../../components/LoadingSpinner";
import { apiError, performanceGet } from "./api";
import { COLORS, ChartBox, ChartCard, tipStyle } from "./charts";

const FIELD_LABELS = {
  commissioning_date: "Commissioning",
  warranty_status: "Warranty status",
  warranty_date: "Warranty date",
  cloth_type: "Cloth",
  mounting_type: "Mounting",
};

export default function ConfigurationGaps({ base }) {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    performanceGet("/configuration-gaps", { limit: 100 })
      .then((data) => {
        setRows(data?.data || []);
        setTotal(data?.total || 0);
      })
      .catch((err) => setError(apiError(err)))
      .finally(() => setLoading(false));
  }, []);

  const counts = Object.keys(FIELD_LABELS).map((field) => ({
    field: FIELD_LABELS[field],
    sites: rows.filter((site) => (site.missing_fields || []).includes(field)).length,
  }));

  return (
    <div className="p-3">
      <Link to={base}>Back</Link>
      <h3 className="mt-2">Sites missing configuration</h3>
      <p className="text-medium-emphasis">
        Real sites that are still missing commissioning, warranty, cloth, or mounting. {total} in scope.
      </p>
      {loading && <LoadingSpinner />}
      {error && <CAlert color="danger">{error}</CAlert>}
      {!loading && !error && rows.length === 0 && (
        <CAlert color="success">Every site in this scope has the required fields.</CAlert>
      )}
      {rows.length > 0 && (
        <>
          <ChartCard title="Missing fields" hint="How many of the listed sites are missing each field.">
            <ChartBox height={240}>
              <BarChart data={counts}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="field" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={tipStyle} />
                <Bar dataKey="sites" name="Sites" fill={COLORS.amber} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartBox>
          </ChartCard>
          <CRow>
            {rows.map((site) => (
              <CCol md={4} key={site.site_id}>
                <CCard className="mb-3 shadow-sm">
                  <CCardBody>
                    <Link to={`${base}/site/${site.site_id}`}>{site.site_id}</Link>
                    <div className="mt-2 d-flex flex-wrap gap-1">
                      {(site.missing_fields || []).map((field) => (
                        <CBadge key={field} color="warning">
                          {FIELD_LABELS[field] || field}
                        </CBadge>
                      ))}
                    </div>
                  </CCardBody>
                </CCard>
              </CCol>
            ))}
          </CRow>
        </>
      )}
    </div>
  );
}

export function MasterGaps() {
  return <ConfigurationGaps base="/master-admin/engineer-performance" />;
}
export function ManagerGaps() {
  return <ConfigurationGaps base="/service-admin/service-manager/performance" />;
}
export function EngineerGaps() {
  return <ConfigurationGaps base="/service-admin/service-engineer/performance" />;
}
