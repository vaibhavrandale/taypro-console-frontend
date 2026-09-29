import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  CBadge,
  CCard,
  CCardBody,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { formatMmSs, formatQuizDate } from "../../quiz-portal/quizUtils";

const roleToRoute = (role) => {
  if (role === "Master Admin") return "master-admin";
  if (role === "Service Admin") return "service-admin";
  if (role === "Project Admin") return "project-admin";
  return "master-admin";
};

const QuizLeaderboard = () => {
  const { id } = useParams();
  const userInfo = useSelector((s) => s.userInfo);
  const base = `/${roleToRoute(userInfo?.role)}/quizzes`;
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/v1/quizzes/${id}/leaderboard`, {
          withCredentials: true,
        });
        setPayload(data.data || null);
      } catch (e) {
        toast.error(e.response?.data?.message || "Failed to load leaderboard");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const top = payload?.topScorer;
  const rankings = payload?.rankings || [];
  const rest = rankings.filter((r) => r.rank !== 1);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div>
          <h4 className="mb-0">Leaderboard</h4>
          {payload?.quiz?.title ? (
            <div className="small text-body-secondary">{payload.quiz.title}</div>
          ) : null}
        </div>
        <div className="d-flex gap-2">
          <Link className="btn btn-outline-primary btn-sm" to={`${base}/${id}/attempts`}>
            Attempts
          </Link>
          <Link className="btn btn-secondary btn-sm" to={base}>
            Back
          </Link>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : !rankings.length ? (
        <div className="text-body-secondary">
          No scored attempts yet. Scores appear after submit / evaluation.
        </div>
      ) : (
        <>
          {top ? (
            <CCard
              className="mb-4 border-0 shadow"
              style={{
                background:
                  "linear-gradient(135deg, #1a1a2e 0%, #16213e 45%, #0f3460 100%)",
                color: "#fff",
              }}
            >
              <CCardBody className="p-4">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                  <div>
                    <div
                      className="text-uppercase small mb-1"
                      style={{ letterSpacing: "0.12em", opacity: 0.85 }}
                    >
                      Top scorer
                    </div>
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <span style={{ fontSize: "1.75rem" }} aria-hidden>
                        🏆
                      </span>
                      <h3 className="mb-0 fw-bold">{top.technician}</h3>
                    </div>
                    {top.email ? (
                      <div className="small" style={{ opacity: 0.8 }}>
                        {top.email}
                      </div>
                    ) : null}
                  </div>
                  <div className="text-end">
                    <div
                      className="fw-bold"
                      style={{ fontSize: "2.25rem", lineHeight: 1.1 }}
                    >
                      {top.score}
                    </div>
                    <div className="small" style={{ opacity: 0.85 }}>
                      {top.percentage != null
                        ? `${Number(top.percentage).toFixed(1)}%`
                        : "—"}
                      {top.timeSec != null
                        ? ` · ${formatMmSs(top.timeSec)}`
                        : ""}
                    </div>
                    <CBadge color="warning" className="mt-2 text-dark">
                      Rank #1
                    </CBadge>
                  </div>
                </div>
              </CCardBody>
            </CCard>
          ) : null}

          <CTable hover bordered responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell style={{ width: 72 }}>Rank</CTableHeaderCell>
                <CTableHeaderCell>Technician</CTableHeaderCell>
                <CTableHeaderCell>Score</CTableHeaderCell>
                <CTableHeaderCell>%</CTableHeaderCell>
                <CTableHeaderCell>Time</CTableHeaderCell>
                <CTableHeaderCell>Submitted</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {rest.map((r) => (
                <CTableRow key={`${r.rank}-${r.email}`}>
                  <CTableDataCell>
                    <CBadge
                      color={r.rank === 2 ? "secondary" : r.rank === 3 ? "dark" : "light"}
                      className={r.rank > 3 ? "text-dark" : ""}
                    >
                      #{r.rank}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell>
                    <div className="fw-semibold">{r.technician}</div>
                    <div className="small text-muted">{r.email}</div>
                  </CTableDataCell>
                  <CTableDataCell>{r.score}</CTableDataCell>
                  <CTableDataCell>
                    {r.percentage != null
                      ? `${Number(r.percentage).toFixed(1)}%`
                      : "—"}
                  </CTableDataCell>
                  <CTableDataCell>
                    {r.timeSec != null ? formatMmSs(r.timeSec) : "—"}
                  </CTableDataCell>
                  <CTableDataCell className="small">
                    {formatQuizDate(r.submittedAt)}
                  </CTableDataCell>
                  <CTableDataCell>
                    <CBadge color="info">{r.status}</CBadge>
                  </CTableDataCell>
                </CTableRow>
              ))}
              {!rest.length ? (
                <CTableRow>
                  <CTableDataCell colSpan={7} className="text-center text-muted">
                    Only one scorer so far
                  </CTableDataCell>
                </CTableRow>
              ) : null}
            </CTableBody>
          </CTable>
        </>
      )}
    </div>
  );
};

export default QuizLeaderboard;
