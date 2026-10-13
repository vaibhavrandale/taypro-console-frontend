import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CAlert,
  CButton,
  CFormInput,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";
import { apiError, performanceGet, performanceSend } from "./api";

export default function KpiRules({ base }) {
  const [config, setConfig] = useState(null);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    performanceGet("/config")
      .then((data) => setConfig(data))
      .catch((err) => setError(apiError(err)))
      .finally(() => setLoading(false));
  }, []);

  const setWeight = (key, weight) => {
    setConfig({
      ...config,
      kpis: config.kpis.map((kpi) =>
        kpi.key === key ? { ...kpi, weight: Number(weight) } : kpi,
      ),
    });
  };

  const save = async () => {
    setError("");
    const body = {
      ...config,
      reason: reason || "Updated from console",
      version: undefined,
      status: undefined,
      _id: undefined,
    };
    try {
      const created = await performanceSend("post", "/config", body);
      await performanceSend("post", `/config/${created.version}/activate`, {});
      toast.success(`Version ${created.version} is now active`);
      const active = await performanceGet("/config");
      setConfig(active);
    } catch (err) {
      setError(apiError(err));
    }
  };

  return (
    <div className="p-3">
      <Link to={base}>Back</Link>
      <h3 className="mt-2">KPI rules</h3>
      <p>
        Saving creates a new version and activates it. Earlier snapshots keep the version they were calculated with.
      </p>
      {loading && <LoadingSpinner />}
      {error && <CAlert color="danger">{error}</CAlert>}
      {config && (
        <>
          <p>Active version {config.version}. Client SLA days and uptime target apply to new calculations.</p>
          <CTable bordered>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>KPI</CTableHeaderCell>
                <CTableHeaderCell>Strategy</CTableHeaderCell>
                <CTableHeaderCell>Weight</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {(config.kpis || []).map((kpi) => (
                <CTableRow key={kpi.key}>
                  <CTableDataCell>
                    {kpi.name}
                    <div className="small text-medium-emphasis">{kpi.description}</div>
                  </CTableDataCell>
                  <CTableDataCell>{kpi.strategy}</CTableDataCell>
                  <CTableDataCell>
                    <CFormInput
                      type="number"
                      min="0"
                      value={kpi.weight}
                      onChange={(e) => setWeight(kpi.key, e.target.value)}
                    />
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
          <div className="d-flex gap-2 mt-3">
            <CFormInput
              placeholder="Client ticket SLA days"
              type="number"
              value={config.client_ticket_sla_days ?? ""}
              onChange={(e) =>
                setConfig({
                  ...config,
                  client_ticket_sla_days: e.target.value === "" ? null : Number(e.target.value),
                })
              }
            />
            <CFormInput
              placeholder="Uptime target"
              type="number"
              value={config.uptime_target ?? ""}
              onChange={(e) =>
                setConfig({
                  ...config,
                  uptime_target: e.target.value === "" ? null : Number(e.target.value),
                })
              }
            />
            <CFormInput
              placeholder="Reason for change"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
          <CButton color="primary" className="mt-3" onClick={save}>
            Save and activate
          </CButton>
        </>
      )}
    </div>
  );
}

export function MasterRules() {
  return <KpiRules base="/master-admin/engineer-performance" />;
}
export function ManagerRules() {
  return <KpiRules base="/service-admin/service-manager/performance" />;
}
