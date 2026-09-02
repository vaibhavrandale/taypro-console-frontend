/**
 * Service Admin / Service User — approve Site Technician WFH requests.
 * Rainy-season / no-site days: manager approve → auto ERP attendance.
 */
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  CAlert,
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CFormSelect,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import LoadingSpinner from "../../components/LoadingSpinner";

const statusColor = (s) => {
  if (s === "pending") return "warning";
  if (s === "approved") return "success";
  if (s === "rejected") return "danger";
  return "secondary";
};

const TechnicianWfhApprovals = () => {
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("/api/v1/technician-attendance/wfh-request", {
        params: { status },
        withCredentials: true,
      });
      setRows(res.data?.data || []);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to load WFH requests";
      setError(msg);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    load();
  }, [load]);

  const approve = async (id) => {
    setBusyId(id);
    try {
      await axios.post(
        `/api/v1/technician-attendance/wfh-request/${id}/approve`,
        {},
        { withCredentials: true },
      );
      toast.success("WFH approved — attendance marked");
      await load();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Approve failed",
      );
    } finally {
      setBusyId(null);
    }
  };

  const reject = async (id) => {
    const reject_reason = window.prompt("Reject reason (optional):") || "";
    setBusyId(id);
    try {
      await axios.post(
        `/api/v1/technician-attendance/wfh-request/${id}/reject`,
        { reject_reason },
        { withCredentials: true },
      );
      toast.success("WFH rejected");
      await load();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Reject failed",
      );
    } finally {
      setBusyId(null);
    }
  };

  return (
    <CCard className="mb-3">
      <CCardHeader className="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <strong>Technician WFH Approvals</strong>
        <div className="d-flex gap-2 align-items-center">
          <CFormSelect
            size="sm"
            style={{ width: 140 }}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="all">All</option>
          </CFormSelect>
          <CButton color="secondary" size="sm" variant="outline" onClick={load}>
            Refresh
          </CButton>
        </div>
      </CCardHeader>
      <CCardBody>
        {error && <CAlert color="danger">{error}</CAlert>}
        {loading ? (
          <LoadingSpinner />
        ) : rows.length === 0 ? (
          <CAlert color="info">No WFH requests for this filter.</CAlert>
        ) : (
          <CTable responsive hover small>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Date</CTableHeaderCell>
                <CTableHeaderCell>Technician</CTableHeaderCell>
                <CTableHeaderCell>Site</CTableHeaderCell>
                <CTableHeaderCell>Reason</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {rows.map((row) => (
                <CTableRow key={row._id}>
                  <CTableDataCell>{row.date}</CTableDataCell>
                  <CTableDataCell>
                    {row.username}
                    {row.email ? (
                      <div className="small text-medium-emphasis">
                        {row.email}
                      </div>
                    ) : null}
                  </CTableDataCell>
                  <CTableDataCell>{row.site_id}</CTableDataCell>
                  <CTableDataCell style={{ maxWidth: 280 }}>
                    {row.reason}
                    {row.reject_reason ? (
                      <div className="small text-danger">
                        Reject: {row.reject_reason}
                      </div>
                    ) : null}
                  </CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={statusColor(row.status)}>
                      {row.status}
                    </CBadge>
                    {row.approved_by_name ? (
                      <div className="small">{row.approved_by_name}</div>
                    ) : null}
                  </CTableDataCell>
                  <CTableDataCell>
                    {row.status === "pending" ? (
                      <div className="d-flex gap-1">
                        <CButton
                          color="success"
                          size="sm"
                          disabled={busyId === row._id}
                          onClick={() => approve(row._id)}
                        >
                          {busyId === row._id ? (
                            <CSpinner size="sm" />
                          ) : (
                            "Approve"
                          )}
                        </CButton>
                        <CButton
                          color="danger"
                          size="sm"
                          variant="outline"
                          disabled={busyId === row._id}
                          onClick={() => reject(row._id)}
                        >
                          Reject
                        </CButton>
                      </div>
                    ) : (
                      "—"
                    )}
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        )}
      </CCardBody>
    </CCard>
  );
};

export default TechnicianWfhApprovals;
