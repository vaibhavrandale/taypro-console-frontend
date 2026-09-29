import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCol,
  CRow,
  CSpinner,
} from "@coreui/react";
import { formatMmSs, formatQuizDate } from "./quizUtils";

const QuizResult = () => {
  const { attemptId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`/api/v1/quiz-portal/attempts/${attemptId}/result`, {
        withCredentials: true,
      })
      .then((r) => setData(r.data.data))
      .catch((e) =>
        setError(e.response?.data?.message || "Could not load result"),
      )
      .finally(() => setLoading(false));
  }, [attemptId]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <CSpinner color="success" />
        <div className="small text-body-secondary mt-2">Loading result…</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <CCard className="border-0 shadow-sm" style={{ borderRadius: 14 }}>
        <CCardBody className="text-center py-5">
          <div className="fs-4 mb-2">⚠️</div>
          <h5 className="mb-2">Result unavailable</h5>
          <p className="text-body-secondary mb-4">{error || "Not found"}</p>
          <Link className="btn btn-success btn-sm" to="/quiz">
            Back to quizzes
          </Link>
        </CCardBody>
      </CCard>
    );
  }

  const published = data.status === "RESULT_PUBLISHED";
  const passed = Boolean(data.passed);
  const pendingReview =
    data.evaluationStatus === "PENDING_MANUAL" ||
    data.status === "UNDER_REVIEW";

  const heroBg = published
    ? passed
      ? "linear-gradient(135deg, #0f5132 0%, #198754 55%, #20c997 100%)"
      : "linear-gradient(135deg, #58151c 0%, #b02a37 55%, #dc3545 100%)"
    : "linear-gradient(135deg, #664d03 0%, #997404 50%, #ffc107 100%)";

  const heroTitle = published
    ? passed
      ? "Congratulations — you passed"
      : "Result published — not passed"
    : pendingReview
      ? "Submitted — under review"
      : "Submitted — awaiting results";

  const heroSub = published
    ? passed
      ? "Your score meets the passing marks for this quiz."
      : `Passing marks: ${data.passingMarks ?? 0}. You can check past quizzes from home.`
    : data.message ||
      "Your answers are saved. Scores appear after evaluation and publishing.";

  return (
    <div className="pb-4" style={{ maxWidth: 720, margin: "0 auto" }}>
      <CCard
        className="border-0 shadow mb-3 overflow-hidden text-white"
        style={{ borderRadius: 16, background: heroBg }}
      >
        <CCardBody className="p-4 p-md-5 text-center">
          <div className="mb-2" style={{ fontSize: 40, lineHeight: 1 }}>
            {published ? (passed ? "✓" : "✕") : "◌"}
          </div>
          <div
            className="text-uppercase small mb-2"
            style={{ letterSpacing: "0.14em", opacity: 0.85 }}
          >
            {data.category || "Assessment"}
          </div>
          <h3 className="fw-bold mb-2">{data.title}</h3>
          <p className="mb-0 opacity-90">{heroTitle}</p>
          <p className="small mt-2 mb-0" style={{ opacity: 0.8 }}>
            {heroSub}
          </p>

          {published ? (
            <div className="mt-4">
              <div
                className="fw-bold"
                style={{ fontSize: "2.75rem", lineHeight: 1.1 }}
              >
                {data.obtainedMarks}
                <span style={{ fontSize: "1.25rem", opacity: 0.85 }}>
                  {" "}
                  / {data.maxMarks}
                </span>
              </div>
              <div className="mt-2 d-flex justify-content-center gap-2 flex-wrap">
                <CBadge
                  color={passed ? "light" : "dark"}
                  className={`fs-6 px-3 py-2 ${passed ? "text-success" : ""}`}
                >
                  {Number(data.percentage || 0).toFixed(1)}%
                </CBadge>
                <CBadge
                  color={passed ? "light" : "dark"}
                  className={`fs-6 px-3 py-2 ${passed ? "text-success" : ""}`}
                >
                  {passed ? "Passed" : "Failed"}
                </CBadge>
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <CBadge color="dark" className="fs-6 px-3 py-2 text-warning">
                {pendingReview ? "Under review" : "Awaiting publish"}
              </CBadge>
            </div>
          )}
        </CCardBody>
      </CCard>

      <CCard className="border-0 shadow-sm mb-3" style={{ borderRadius: 14 }}>
        <CCardBody className="p-3 p-md-4">
          <div className="small text-body-secondary text-uppercase mb-3 fw-semibold">
            Attempt summary
          </div>
          <CRow className="g-3">
            <CCol xs={6} md={3}>
              <Stat
                label="Questions"
                value={data.questionCount != null ? data.questionCount : "—"}
              />
            </CCol>
            <CCol xs={6} md={3}>
              <Stat
                label="Time taken"
                value={
                  data.completionTimeSec != null
                    ? formatMmSs(data.completionTimeSec)
                    : "—"
                }
              />
            </CCol>
            <CCol xs={6} md={3}>
              <Stat
                label="Max marks"
                value={data.maxMarks != null ? data.maxMarks : "—"}
              />
            </CCol>
            <CCol xs={6} md={3}>
              <Stat
                label="Pass marks"
                value={data.passingMarks != null ? data.passingMarks : "—"}
              />
            </CCol>
          </CRow>
          {data.submittedAt ? (
            <div className="small text-body-secondary mt-3 pt-3 border-top">
              Submitted {formatQuizDate(data.submittedAt)}
            </div>
          ) : null}
        </CCardBody>
      </CCard>

      <div className="d-flex flex-wrap gap-2 justify-content-center">
        <Link className="btn btn-success" to="/quiz">
          Back to quizzes
        </Link>
        {!published ? (
          <CButton
            color="secondary"
            variant="outline"
            onClick={() => window.location.reload()}
          >
            Refresh result
          </CButton>
        ) : null}
      </div>
    </div>
  );
};

function Stat({ label, value }) {
  return (
    <div
      className="h-100 rounded-3 p-3 text-center"
      style={{ background: "var(--cui-tertiary-bg, rgba(0,0,0,0.04))" }}
    >
      <div className="small text-body-secondary mb-1">{label}</div>
      <div className="fw-semibold fs-5">{value}</div>
    </div>
  );
}

export default QuizResult;
