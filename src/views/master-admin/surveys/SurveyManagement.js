import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import {
  CBadge,
  CButton,
  CFormInput,
  CFormSelect,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import ConfirmModal from "../../../components/ConfirmModal";
import { publicUrl, surveyBase } from "./surveyPaths";

const statusColor = {
  DRAFT: "secondary",
  PUBLISHED: "success",
  CLOSED: "warning",
};

const SurveyManagement = () => {
  const role = useSelector((s) => s.userInfo?.role);
  const base = surveyBase(role);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [pending, setPending] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await axios.get("/api/v1/surveys", {
        params: { q: q || undefined, status: status || undefined },
        withCredentials: true,
      });
      setRows(data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load surveys");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // initial load only; Filter button refreshes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const copyLink = async (path) => {
    try {
      await navigator.clipboard.writeText(publicUrl(path));
      toast.success("Link copied");
    } catch {
      toast.error("Could not copy the link");
    }
  };

  const confirm = async () => {
    if (!pending) return;
    const messages = {
      publish: "Survey is live",
      close: "Survey closed",
      delete: "Survey deleted",
    };
    try {
      setBusy(true);
      if (pending.action === "delete") {
        await axios.delete(`/api/v1/surveys/${pending.id}`, { withCredentials: true });
      } else {
        await axios.post(
          `/api/v1/surveys/${pending.id}/${pending.action}`,
          {},
          { withCredentials: true },
        );
      }
      toast.success(messages[pending.action] || "Saved");
      setPending(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3 gap-2 flex-wrap">
        <div>
          <h4 className="mb-1">Surveys</h4>
          <div className="small text-body-secondary">
            Build a form, publish it, and share one link. Anyone can respond once from their device.
          </div>
        </div>
        <Link className="btn btn-primary btn-sm" to={`${base}/create`}>
          New survey
        </Link>
      </div>

      <div className="d-flex gap-2 mb-3 flex-wrap">
        <CFormInput
          placeholder="Search title"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ maxWidth: 240 }}
        />
        <CFormSelect
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{ maxWidth: 180 }}
        >
          <option value="">All statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="CLOSED">Closed</option>
        </CFormSelect>
        <CButton color="secondary" size="sm" onClick={load}>
          Filter
        </CButton>
      </div>

      {loading ? (
        <div className="py-5 text-center">
          <CSpinner />
          <div className="small text-body-secondary mt-2">Loading surveys…</div>
        </div>
      ) : null}

      {!loading && error ? (
        <div className="border rounded p-4 text-center">
          <div className="mb-2">{error}</div>
          <CButton color="secondary" size="sm" onClick={load}>
            Try again
          </CButton>
        </div>
      ) : null}

      {!loading && !error && rows.length === 0 ? (
        <div className="border rounded p-5 text-center text-body-secondary">
          No surveys yet. Create one to get a public link.
        </div>
      ) : null}

      {!loading && !error && rows.length > 0 ? (
        <CTable hover bordered responsive align="middle">
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Survey</CTableHeaderCell>
              <CTableHeaderCell>Fields</CTableHeaderCell>
              <CTableHeaderCell>Responses</CTableHeaderCell>
              <CTableHeaderCell>Status</CTableHeaderCell>
              <CTableHeaderCell>Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {rows.map((row) => (
              <CTableRow key={row._id}>
                <CTableDataCell>
                  <div className="fw-semibold">{row.title}</div>
                  <div className="small text-body-secondary text-truncate" style={{ maxWidth: 280 }}>
                    {publicUrl(row.publicPath)}
                  </div>
                </CTableDataCell>
                <CTableDataCell>{row.fields?.length || 0}</CTableDataCell>
                <CTableDataCell>{row.responseCount || 0}</CTableDataCell>
                <CTableDataCell>
                  <CBadge color={statusColor[row.status] || "secondary"}>{row.status}</CBadge>
                </CTableDataCell>
                <CTableDataCell>
                  <Link className="btn btn-sm btn-outline-primary m-1" to={`${base}/${row._id}/edit`}>
                    Edit
                  </Link>
                  <Link className="btn btn-sm btn-outline-info m-1" to={`${base}/${row._id}/responses`}>
                    Responses
                  </Link>
                  <CButton
                    size="sm"
                    color="secondary"
                    variant="outline"
                    className="m-1"
                    onClick={() => copyLink(row.publicPath)}
                  >
                    Copy link
                  </CButton>
                  {row.status !== "PUBLISHED" ? (
                    <CButton
                      size="sm"
                      color="success"
                      variant="outline"
                      className="m-1"
                      onClick={() => setPending({ id: row._id, action: "publish", title: row.title })}
                    >
                      Publish
                    </CButton>
                  ) : (
                    <CButton
                      size="sm"
                      color="warning"
                      variant="outline"
                      className="m-1"
                      onClick={() => setPending({ id: row._id, action: "close", title: row.title })}
                    >
                      Close
                    </CButton>
                  )}
                  <CButton
                    size="sm"
                    color="danger"
                    variant="outline"
                    className="m-1"
                    onClick={() => setPending({ id: row._id, action: "delete", title: row.title })}
                  >
                    Delete
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      ) : null}

      <ConfirmModal
        visible={Boolean(pending)}
        onClose={() => (busy ? null : setPending(null))}
        onConfirm={confirm}
        loading={busy}
        title={
          pending?.action === "delete"
            ? "Delete this survey?"
            : pending?.action === "close"
              ? "Close this survey?"
              : "Publish this survey?"
        }
        message={
          pending?.action === "publish"
            ? `${pending?.title || "This survey"} will open on its public link.`
            : pending?.action === "close"
              ? "The link stays, but new responses stop."
              : "The public link will stop working."
        }
        confirmLabel={pending?.action === "publish" ? "Publish" : pending?.action === "close" ? "Close" : "Delete"}
        confirmColor={pending?.action === "publish" ? "success" : "danger"}
      />
    </div>
  );
};

export default SurveyManagement;
