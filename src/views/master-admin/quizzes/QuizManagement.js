import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  CBadge,
  CButton,
  CFormInput,
  CFormSelect,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { formatQuizDate } from "../../quiz-portal/quizUtils";
import ConfirmModal from "../../../components/ConfirmModal";

const roleToRoute = (role) => {
  if (role === "Master Admin") return "master-admin";
  if (role === "Service Admin") return "service-admin";
  if (role === "Project Admin") return "project-admin";
  return "master-admin";
};

const QuizManagement = () => {
  const userInfo = useSelector((s) => s.userInfo);
  const base = `/${roleToRoute(userInfo?.role)}/quizzes`;
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [publishTarget, setPublishTarget] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/v1/quizzes", {
        params: { q, status: status || undefined },
        withCredentials: true,
      });
      setRows(data.data || []);
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to load quizzes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const publish = async () => {
    if (!publishTarget) return;
    try {
      setBusy(true);
      await axios.post(
        `/api/v1/quizzes/${publishTarget._id}/publish`,
        {},
        { withCredentials: true },
      );
      toast.success("Published");
      setPublishTarget(null);
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || "Publish failed");
    } finally {
      setBusy(false);
    }
  };

  const duplicate = async (id) => {
    try {
      await axios.post(`/api/v1/quizzes/${id}/duplicate`, {}, { withCredentials: true });
      toast.success("Duplicated");
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || "Duplicate failed");
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Quiz Management</h4>
        <Link className="btn btn-primary btn-sm" to={`${base}/create`}>
          Create quiz
        </Link>
      </div>

      <div className="d-flex gap-2 mb-3 flex-wrap">
        <CFormInput
          placeholder="Search title / category"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ maxWidth: 240 }}
        />
        <CFormSelect
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{ maxWidth: 200 }}
        >
          <option value="">All statuses</option>
          <option value="DRAFT">DRAFT</option>
          <option value="SCHEDULED">SCHEDULED</option>
          <option value="LIVE">LIVE</option>
          <option value="ENDED">ENDED</option>
          <option value="RESULT_PUBLISHED">RESULT_PUBLISHED</option>
          <option value="ARCHIVED">ARCHIVED</option>
        </CFormSelect>
        <CButton color="secondary" size="sm" onClick={load}>
          Filter
        </CButton>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <CTable hover bordered responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Quiz</CTableHeaderCell>
              <CTableHeaderCell>Category</CTableHeaderCell>
              <CTableHeaderCell>Questions</CTableHeaderCell>
              <CTableHeaderCell>Duration</CTableHeaderCell>
              <CTableHeaderCell>Participants</CTableHeaderCell>
              <CTableHeaderCell>Status</CTableHeaderCell>
              <CTableHeaderCell>Window</CTableHeaderCell>
              <CTableHeaderCell>Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {rows.map((r) => (
              <CTableRow key={r._id}>
                <CTableDataCell>
                  <div className="fw-semibold">{r.title}</div>
                  <div className="small text-muted">
                    Roles: {(r.audienceRoles || []).join(", ")}
                  </div>
                </CTableDataCell>
                <CTableDataCell>{r.category || "—"}</CTableDataCell>
                <CTableDataCell>{r.questionCount}</CTableDataCell>
                <CTableDataCell>{r.durationMinutes}m</CTableDataCell>
                <CTableDataCell>{r.participants}</CTableDataCell>
                <CTableDataCell>
                  <CBadge color="primary">{r.effectiveStatus || r.status}</CBadge>
                </CTableDataCell>
                <CTableDataCell className="small">
                  {formatQuizDate(r.startAt)}
                  <br />
                  {formatQuizDate(r.endAt)}
                </CTableDataCell>
                <CTableDataCell>
                  <Link className="btn btn-sm btn-outline-primary m-1" to={`${base}/${r._id}/edit`}>
                    Edit
                  </Link>
                  <CButton
                    size="sm"
                    color="success"
                    variant="outline"
                    className="m-1"
                    onClick={() => setPublishTarget(r)}
                  >
                    Publish
                  </CButton>
                  <CButton
                    size="sm"
                    color="secondary"
                    variant="outline"
                    className="m-1"
                    onClick={() => duplicate(r._id)}
                  >
                    Duplicate
                  </CButton>
                  <Link
                    className="btn btn-sm btn-outline-warning m-1"
                    to={`${base}/${r._id}/attempts`}
                  >
                    Attempts
                  </Link>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      )}

      <ConfirmModal
        visible={Boolean(publishTarget)}
        onClose={() => setPublishTarget(null)}
        onConfirm={publish}
        title="Publish quiz?"
        message={`Publish <strong>${publishTarget?.title || ""}</strong> for selected audience roles?`}
        confirmLabel="Publish"
        confirmColor="success"
        loading={busy}
      />
    </div>
  );
};

export default QuizManagement;
