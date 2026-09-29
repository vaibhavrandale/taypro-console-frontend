import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  CBadge,
  CCard,
  CCardBody,
  CCol,
  CRow,
  CSpinner,
} from "@coreui/react";
import { formatQuizDate } from "./quizUtils";

const quizAxios = axios.create({ withCredentials: true });

const statusColor = (status) => {
  if (status === "LIVE") return "success";
  if (status === "SCHEDULED") return "info";
  if (status === "ENDED" || status === "RESULT_PUBLISHED") return "secondary";
  return "primary";
};

const attemptCta = (q) => {
  if (q.attemptStatus === "IN_PROGRESS") {
    return {
      to: `/quiz/${q._id}/attempt/${q.attemptId}`,
      label: "Resume quiz",
      color: "warning",
    };
  }
  if (q.attemptStatus && q.attemptStatus !== "NOT_STARTED") {
    return {
      to: `/quiz/result/${q.attemptId}`,
      label: "View result",
      color: "secondary",
    };
  }
  return {
    to: `/quiz/${q._id}/instructions`,
    label: "Start quiz",
    color: "success",
  };
};

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
        <CSpinner color="success" />
        <div className="small text-body-secondary mt-2">Loading quizzes…</div>
      </div>
    );
  }

  const firstName = (user?.username || "there").split(" ")[0];

  return (
    <div className="pb-4">
      <CCard
        className="border-0 shadow-sm mb-4 overflow-hidden text-white"
        style={{
          borderRadius: 16,
          background:
            "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        }}
      >
        <CCardBody className="p-4">
          <div
            className="text-uppercase small mb-1"
            style={{ letterSpacing: "0.14em", opacity: 0.75 }}
          >
            Quiz assessment
          </div>
          <h3 className="fw-bold mb-1">Hi, {firstName}</h3>
          <div className="small mb-0" style={{ opacity: 0.85 }}>
            {user?.role}
            {live.length
              ? ` · ${live.length} quiz${live.length === 1 ? "" : "zes"} available`
              : " · No live quizzes right now"}
          </div>
        </CCardBody>
      </CCard>

      <div className="d-flex align-items-center justify-content-between mb-3">
        <h5 className="mb-0 fw-semibold">Live / Upcoming</h5>
        {live.length ? (
          <span className="small text-body-secondary">{live.length} total</span>
        ) : null}
      </div>

      <CRow className="g-3 mb-4">
        {live.length === 0 ? (
          <CCol xs={12}>
            <CCard
              className="border-0 shadow-sm"
              style={{ borderRadius: 14 }}
            >
              <CCardBody className="text-center py-5">
                <div className="fs-3 mb-2" aria-hidden>
                  📭
                </div>
                <div className="fw-semibold mb-1">No quizzes available</div>
                <div className="small text-body-secondary">
                  Nothing is live or scheduled for your role yet. Check back
                  later.
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        ) : (
          live.map((q) => {
            const cta = attemptCta(q);
            const isLive = q.effectiveStatus === "LIVE";
            return (
              <CCol xs={12} md={6} key={q._id}>
                <CCard
                  className="h-100 border-0 shadow-sm"
                  style={{
                    borderRadius: 14,
                    borderLeft: isLive
                      ? "4px solid var(--cui-success)"
                      : "4px solid var(--cui-info)",
                  }}
                >
                  <CCardBody className="p-3 p-md-4 d-flex flex-column h-100">
                    <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                      <div>
                        {q.category ? (
                          <div
                            className="small text-body-secondary text-uppercase mb-1"
                            style={{ letterSpacing: "0.08em", fontSize: 11 }}
                          >
                            {q.category}
                          </div>
                        ) : null}
                        <h5 className="mb-0 fw-semibold">{q.title}</h5>
                      </div>
                      <CBadge color={statusColor(q.effectiveStatus)}>
                        {q.effectiveStatus}
                      </CBadge>
                    </div>

                    {q.description ? (
                      <p
                        className="text-body-secondary small mb-3"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {q.description}
                      </p>
                    ) : (
                      <div className="mb-3" />
                    )}

                    <CRow className="g-2 mb-3">
                      <CCol xs={6}>
                        <Meta label="Questions" value={q.questionCount} />
                      </CCol>
                      <CCol xs={6}>
                        <Meta
                          label="Duration"
                          value={`${q.durationMinutes} min`}
                        />
                      </CCol>
                      <CCol xs={6}>
                        <Meta
                          label="Marks"
                          value={`${q.maxMarks} (pass ${q.passingMarks})`}
                        />
                      </CCol>
                      <CCol xs={6}>
                        <Meta
                          label="Attempt"
                          value={(q.attemptStatus || "NOT_STARTED").replace(
                            /_/g,
                            " ",
                          )}
                        />
                      </CCol>
                    </CRow>

                    <div className="small text-body-secondary mb-3">
                      {formatQuizDate(q.startAt)}
                      <span className="mx-1">→</span>
                      {formatQuizDate(q.endAt)}
                    </div>

                    <div className="mt-auto">
                      <Link
                        className={`btn btn-${cta.color} w-100`}
                        to={cta.to}
                      >
                        {cta.label}
                      </Link>
                    </div>
                  </CCardBody>
                </CCard>
              </CCol>
            );
          })
        )}
      </CRow>

      <div className="d-flex align-items-center justify-content-between mb-3">
        <h5 className="mb-0 fw-semibold">Past quizzes</h5>
        {past.length ? (
          <span className="small text-body-secondary">{past.length} total</span>
        ) : null}
      </div>

      {past.length === 0 ? (
        <CCard className="border-0 shadow-sm" style={{ borderRadius: 14 }}>
          <CCardBody className="text-center py-4 text-body-secondary small">
            No past attempts yet. Completed quizzes will show here.
          </CCardBody>
        </CCard>
      ) : (
        <CRow className="g-3">
          {past.map((p) => (
            <CCol xs={12} key={p.attemptId}>
              <CCard
                className="border-0 shadow-sm"
                style={{ borderRadius: 12 }}
              >
                <CCardBody className="p-3 d-flex flex-wrap align-items-center justify-content-between gap-3">
                  <div className="min-w-0">
                    <Link
                      to={`/quiz/result/${p.attemptId}`}
                      className="fw-semibold text-decoration-none"
                    >
                      {p.title}
                    </Link>
                    <div className="small text-body-secondary">
                      {formatQuizDate(p.date)}
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-3 flex-wrap">
                    <div className="text-end">
                      <div className="small text-body-secondary">Score</div>
                      <div className="fw-semibold">{p.score || "—"}</div>
                    </div>
                    <CBadge color="secondary">{p.resultLabel}</CBadge>
                    <Link
                      className="btn btn-sm btn-outline-success"
                      to={`/quiz/result/${p.attemptId}`}
                    >
                      Open
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
          ))}
        </CRow>
      )}
    </div>
  );
};

function Meta({ label, value }) {
  return (
    <div
      className="rounded-3 px-2 py-2 h-100"
      style={{ background: "var(--cui-tertiary-bg, rgba(0,0,0,0.04))" }}
    >
      <div className="text-body-secondary" style={{ fontSize: 11 }}>
        {label}
      </div>
      <div className="fw-semibold small text-truncate" title={String(value)}>
        {value}
      </div>
    </div>
  );
}

export default QuizHome;
