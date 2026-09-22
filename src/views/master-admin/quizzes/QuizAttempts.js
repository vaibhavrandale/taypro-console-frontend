import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  CBadge,
  CButton,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";
import ConfirmModal from "../../../components/ConfirmModal";
import { formatQuizDate } from "../../quiz-portal/quizUtils";

const roleToRoute = (role) => {
  if (role === "Master Admin") return "master-admin";
  if (role === "Service Admin") return "service-admin";
  if (role === "Project Admin") return "project-admin";
  return "master-admin";
};

const QuizAttempts = () => {
  const { id } = useParams();
  const userInfo = useSelector((s) => s.userInfo);
  const base = `/${roleToRoute(userInfo?.role)}/quizzes`;
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/quizzes/${id}/attempts`, {
        withCredentials: true,
      });
      setRows(data.data || []);
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const remove = async () => {
    try {
      setBusy(true);
      await axios.delete(`/api/v1/quiz-attempts/${deleteId}`, {
        withCredentials: true,
      });
      toast.success("Attempt deleted — user can retake");
      setDeleteId(null);
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || "Delete failed");
    } finally {
      setBusy(false);
    }
  };

  const publishResults = async () => {
    try {
      await axios.post(
        `/api/v1/quizzes/${id}/publish-results`,
        {},
        { withCredentials: true },
      );
      toast.success("Results published");
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || "Publish failed");
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h4 className="mb-0">Quiz attempts</h4>
        <div className="d-flex gap-2">
          <CButton color="success" size="sm" onClick={publishResults}>
            Publish results
          </CButton>
          <Link className="btn btn-secondary btn-sm" to={base}>
            Back
          </Link>
        </div>
      </div>
      <p className="small text-muted">
        One attempt per user. Delete an attempt to allow a retake.
      </p>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <CTable hover bordered responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>User</CTableHeaderCell>
              <CTableHeaderCell>Status</CTableHeaderCell>
              <CTableHeaderCell>Score</CTableHeaderCell>
              <CTableHeaderCell>Submitted</CTableHeaderCell>
              <CTableHeaderCell>Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {rows.map((r) => (
              <CTableRow key={r._id}>
                <CTableDataCell>
                  {r.userSnapshot?.username}
                  <div className="small text-muted">{r.userSnapshot?.email}</div>
                </CTableDataCell>
                <CTableDataCell>
                  <CBadge color="info">{r.status}</CBadge>
                </CTableDataCell>
                <CTableDataCell>
                  {r.obtainedMarks != null
                    ? `${r.obtainedMarks}/${r.maxMarks}`
                    : "—"}
                </CTableDataCell>
                <CTableDataCell>{formatQuizDate(r.submittedAt)}</CTableDataCell>
                <CTableDataCell>
                  <Link
                    className="btn btn-sm btn-outline-primary m-1"
                    to={`${base}/attempts/${r._id}/evaluate`}
                  >
                    Evaluate
                  </Link>
                  <CButton
                    size="sm"
                    color="danger"
                    variant="outline"
                    className="m-1"
                    onClick={() => setDeleteId(r._id)}
                  >
                    Delete attempt
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      )}

      <ConfirmModal
        visible={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={remove}
        title="Delete attempt?"
        message="This permanently deletes the attempt so the user can start again (one-attempt policy)."
        confirmLabel="Delete"
        loading={busy}
      />
    </div>
  );
};

export default QuizAttempts;
