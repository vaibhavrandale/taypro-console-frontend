import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import { formatQuizDate } from "./quizUtils";

const quizAxios = axios.create({ withCredentials: true });

const QuizHome = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [live, setLive] = useState([]);
  const [past, setPast] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const boot = async () => {
      try {
        const me = await quizAxios.get("/api/v1/quiz-portal/me");
        setUser(me.data.data.user);
        const [liveRes, pastRes] = await Promise.all([
          quizAxios.get("/api/v1/quiz-portal/quizzes/live"),
          quizAxios.get("/api/v1/quiz-portal/quizzes/past"),
        ]);
        setLive(liveRes.data.data || []);
        setPast(pastRes.data.data || []);
      } catch {
        toast.error("Session expired");
        navigate("/quiz/login");
      } finally {
        setLoading(false);
      }
    };
    boot();
  }, [navigate]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <CSpinner />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3">
        <h4 className="mb-0">Hi, {user?.username}</h4>
        <div className="text-body-secondary small">{user?.role}</div>
      </div>

      <h5 className="mb-3">Live / Upcoming</h5>
      <CRow className="g-3 mb-4">
        {live.length === 0 ? (
          <CCol xs={12}>
            <div className="text-body-secondary">
              No quizzes available for your role.
            </div>
          </CCol>
        ) : (
          live.map((q) => (
            <CCol xs={12} md={6} key={q._id}>
              <CCard className="h-100">
                <CCardHeader className="d-flex justify-content-between align-items-center">
                  <span className="fw-semibold">{q.title}</span>
                  <CBadge
                    color={q.effectiveStatus === "LIVE" ? "success" : "info"}
                  >
                    {q.effectiveStatus}
                  </CBadge>
                </CCardHeader>
                <CCardBody>
                  {q.description ? (
                    <div className="text-body-secondary small mb-2">
                      {q.description}
                    </div>
                  ) : null}
                  <div className="small mb-1">
                    Category: {q.category || "—"}
                  </div>
                  <div className="small mb-1">Questions: {q.questionCount}</div>
                  <div className="small mb-1">
                    Duration: {q.durationMinutes} min
                  </div>
                  <div className="small mb-1">
                    Marks: {q.maxMarks} (Pass {q.passingMarks})
                  </div>
                  <div className="small mb-3">
                    {formatQuizDate(q.startAt)} → {formatQuizDate(q.endAt)}
                  </div>
                  <div className="small mb-2">
                    Attempt: {q.attemptStatus || "NOT_STARTED"}
                  </div>
                  {q.attemptStatus === "IN_PROGRESS" ? (
                    <Link
                      className="btn btn-warning btn-sm"
                      to={`/quiz/${q._id}/attempt/${q.attemptId}`}
                    >
                      Resume
                    </Link>
                  ) : q.attemptStatus && q.attemptStatus !== "NOT_STARTED" ? (
                    <Link
                      className="btn btn-secondary btn-sm"
                      to={`/quiz/result/${q.attemptId}`}
                    >
                      View result
                    </Link>
                  ) : (
                    <Link
                      className="btn btn-success btn-sm"
                      to={`/quiz/${q._id}/instructions`}
                    >
                      Start Quiz
                    </Link>
                  )}
                </CCardBody>
              </CCard>
            </CCol>
          ))
        )}
      </CRow>

      <h5 className="mb-3">Past quizzes</h5>
      <CTable hover responsive bordered>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Quiz</CTableHeaderCell>
            <CTableHeaderCell>Date</CTableHeaderCell>
            <CTableHeaderCell>Score</CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {past.length === 0 ? (
            <CTableRow>
              <CTableDataCell colSpan={4} className="text-center">
                No past attempts
              </CTableDataCell>
            </CTableRow>
          ) : (
            past.map((p) => (
              <CTableRow key={p.attemptId}>
                <CTableDataCell>
                  <Link to={`/quiz/result/${p.attemptId}`}>{p.title}</Link>
                </CTableDataCell>
                <CTableDataCell>{formatQuizDate(p.date)}</CTableDataCell>
                <CTableDataCell>{p.score || "—"}</CTableDataCell>
                <CTableDataCell>{p.resultLabel}</CTableDataCell>
              </CTableRow>
            ))
          )}
        </CTableBody>
      </CTable>
    </div>
  );
};

export default QuizHome;
