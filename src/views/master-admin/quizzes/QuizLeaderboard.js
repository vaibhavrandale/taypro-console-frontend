import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCol,
  CRow,
  CSpinner,
} from "@coreui/react";
import { useSelector } from "react-redux";
import { formatMmSs, formatQuizDate } from "../../quiz-portal/quizUtils";

const roleToRoute = (role) => {
  if (role === "Master Admin") return "master-admin";
  if (role === "Service Admin") return "service-admin";
  if (role === "Project Admin") return "project-admin";
  return "master-admin";
};

const initialOf = (name) =>
  String(name || "?").trim().charAt(0).toUpperCase() || "?";

const rankAccent = (rank) => {
  if (rank === 1) return { bar: "#f9b115", label: "Gold", emoji: "🥇" };
  if (rank === 2) return { bar: "#9da5b1", label: "Silver", emoji: "🥈" };
  if (rank === 3) return { bar: "#cd7f32", label: "Bronze", emoji: "🥉" };
  return { bar: "var(--cui-border-color)", label: `#${rank}`, emoji: "" };
};

const QuizLeaderboard = () => {
  const { id } = useParams();
  const userInfo = useSelector((s) => s.userInfo);
  const base = `/${roleToRoute(userInfo?.role)}/quizzes`;
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    load();
  }, [id]);

  const rankings = payload?.rankings || [];
  const top = payload?.topScorer || rankings[0] || null;
  const podium = rankings.filter((r) => r.rank === 2 || r.rank === 3);
  const rest = rankings.filter((r) => r.rank > 3);

  const stats = useMemo(() => {
    if (!rankings.length) {
      return { count: 0, avgPct: null, avgTime: null };
    }
    const withPct = rankings.filter((r) => r.percentage != null);
    const withTime = rankings.filter((r) => r.timeSec != null);
    const avgPct = withPct.length
      ? withPct.reduce((s, r) => s + Number(r.percentage), 0) / withPct.length
      : null;
    const avgTime = withTime.length
      ? Math.round(
          withTime.reduce((s, r) => s + Number(r.timeSec), 0) / withTime.length,
        )
      : null;
    return { count: rankings.length, avgPct, avgTime };
  }, [rankings]);

  return (
    <div className="pb-4">
      <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-2">
        <div>
          <div
            className="text-uppercase small text-body-secondary mb-1"
            style={{ letterSpacing: "0.12em" }}
          >
            Rankings
          </div>
          <h4 className="mb-1 fw-bold">Leaderboard</h4>
          {payload?.quiz?.title ? (
            <div className="text-body-secondary">
              {payload.quiz.title}
              {payload.quiz.status ? (
                <CBadge color="info" className="ms-2 align-middle">
                  {payload.quiz.status}
                </CBadge>
              ) : null}
            </div>
          ) : null}
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <CButton
            color="secondary"
            variant="outline"
            size="sm"
            onClick={load}
            disabled={loading}
          >
            Refresh
          </CButton>
          <Link
            className="btn btn-outline-primary btn-sm"
            to={`${base}/${id}/attempts`}
          >
            Attempts
          </Link>
          <Link className="btn btn-secondary btn-sm" to={base}>
            Back
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <CSpinner color="warning" />
          <div className="small text-body-secondary mt-2">
            Loading rankings…
          </div>
        </div>
      ) : !rankings.length ? (
        <CCard className="border-0 shadow-sm" style={{ borderRadius: 14 }}>
          <CCardBody className="text-center py-5">
            <div className="fs-2 mb-2" aria-hidden>
              🏁
            </div>
            <h5 className="mb-1">No rankings yet</h5>
            <p className="text-body-secondary mb-0 small">
              Scores appear here after submit / evaluation. Publish results when
              ready for technicians.
            </p>
          </CCardBody>
        </CCard>
      ) : (
        <>
          <CRow className="g-3 mb-4">
            <CCol xs={6} md={3}>
              <StatCard label="Participants" value={stats.count} />
            </CCol>
            <CCol xs={6} md={3}>
              <StatCard
                label="Average %"
                value={
                  stats.avgPct != null ? `${stats.avgPct.toFixed(1)}%` : "—"
                }
              />
            </CCol>
            <CCol xs={6} md={3}>
              <StatCard
                label="Avg time"
                value={
                  stats.avgTime != null ? formatMmSs(stats.avgTime) : "—"
                }
              />
            </CCol>
            <CCol xs={6} md={3}>
              <StatCard
                label="Top score"
                value={top?.score || "—"}
                accent
              />
            </CCol>
          </CRow>

          {top ? (
            <CCard
              className="mb-4 border-0 shadow overflow-hidden text-white"
              style={{
                borderRadius: 16,
                background:
                  "linear-gradient(135deg, #1a1a2e 0%, #16213e 45%, #0f3460 100%)",
              }}
            >
              <CCardBody className="p-4 p-md-5">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-4">
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                      style={{
                        width: 72,
                        height: 72,
                        background: "#f9b115",
                        color: "#1a1a2e",
                        fontSize: 28,
                        flexShrink: 0,
                      }}
                    >
                      {initialOf(top.technician)}
                    </div>
                    <div>
                      <div
                        className="text-uppercase small mb-1"
                        style={{ letterSpacing: "0.14em", opacity: 0.8 }}
                      >
                        🏆 Top scorer
                      </div>
                      <h2 className="mb-1 fw-bold">{top.technician}</h2>
                      {top.email ? (
                        <div className="small" style={{ opacity: 0.75 }}>
                          {top.email}
                        </div>
                      ) : null}
                      {top.submittedAt ? (
                        <div className="small mt-1" style={{ opacity: 0.65 }}>
                          Submitted {formatQuizDate(top.submittedAt)}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="text-md-end">
                    <div
                      className="fw-bold"
                      style={{ fontSize: "2.75rem", lineHeight: 1 }}
                    >
                      {top.score}
                    </div>
                    <div className="mt-2 d-flex flex-wrap gap-2 justify-content-md-end">
                      <CBadge color="warning" className="text-dark px-3 py-2">
                        Rank #1
                      </CBadge>
                      {top.percentage != null ? (
                        <CBadge color="light" className="text-dark px-3 py-2">
                          {Number(top.percentage).toFixed(1)}%
                        </CBadge>
                      ) : null}
                      {top.timeSec != null ? (
                        <CBadge color="dark" className="px-3 py-2">
                          {formatMmSs(top.timeSec)}
                        </CBadge>
                      ) : null}
                    </div>
                  </div>
                </div>
              </CCardBody>
            </CCard>
          ) : null}

          {podium.length ? (
            <>
              <h6 className="text-body-secondary text-uppercase small mb-3 fw-semibold">
                Runners-up
              </h6>
              <CRow className="g-3 mb-4">
                {podium.map((r) => {
                  const accent = rankAccent(r.rank);
                  return (
                    <CCol xs={12} md={6} key={`podium-${r.rank}-${r.email}`}>
                      <CCard
                        className="h-100 border-0 shadow-sm"
                        style={{
                          borderRadius: 14,
                          borderTop: `4px solid ${accent.bar}`,
                        }}
                      >
                        <CCardBody className="p-3 d-flex align-items-center gap-3">
                          <div className="fs-3" aria-hidden>
                            {accent.emoji}
                          </div>
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                            style={{
                              width: 48,
                              height: 48,
                              background: r.rank === 2 ? "#6c757d" : "#8B5A2B",
                              color: "#fff",
                            }}
                          >
                            {initialOf(r.technician)}
                          </div>
                          <div className="min-w-0 flex-grow-1">
                            <div className="fw-semibold text-truncate">
                              {r.technician}
                            </div>
                            <div className="small text-body-secondary text-truncate">
                              {r.email || "—"}
                            </div>
                          </div>
                          <div className="text-end flex-shrink-0">
                            <div className="fs-5 fw-bold">{r.score}</div>
                            <div className="small text-body-secondary">
                              {r.percentage != null
                                ? `${Number(r.percentage).toFixed(1)}%`
                                : "—"}
                              {r.timeSec != null
                                ? ` · ${formatMmSs(r.timeSec)}`
                                : ""}
                            </div>
                          </div>
                        </CCardBody>
                      </CCard>
                    </CCol>
                  );
                })}
              </CRow>
            </>
          ) : null}

          <h6 className="text-body-secondary text-uppercase small mb-3 fw-semibold">
            {rest.length ? "Full rankings" : "Standings"}
          </h6>

          <div className="d-flex flex-column gap-2">
            {rest.map((r) => {
              const accent = rankAccent(r.rank);
              return (
                <CCard
                  key={`row-${r.rank}-${r.email}`}
                  className="border-0 shadow-sm"
                  style={{
                    borderRadius: 12,
                    borderLeft: `4px solid ${accent.bar}`,
                  }}
                >
                  <CCardBody className="py-3 px-3 d-flex flex-wrap align-items-center justify-content-between gap-3">
                    <div className="d-flex align-items-center gap-3 min-w-0">
                      <div
                        className="fw-bold text-center"
                        style={{ width: 40, color: accent.bar }}
                      >
                        #{r.rank}
                      </div>
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center fw-semibold text-white flex-shrink-0"
                        style={{
                          width: 40,
                          height: 40,
                          background: "#0f3460",
                          fontSize: 14,
                        }}
                      >
                        {initialOf(r.technician)}
                      </div>
                      <div className="min-w-0">
                        <div className="fw-semibold text-truncate">
                          {r.technician}
                        </div>
                        <div className="small text-body-secondary text-truncate">
                          {r.email || "—"}
                        </div>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-3 flex-wrap ms-auto">
                      <div className="text-end" style={{ minWidth: 72 }}>
                        <div className="small text-body-secondary">Score</div>
                        <div className="fw-semibold">{r.score}</div>
                      </div>
                      <div className="text-end" style={{ minWidth: 56 }}>
                        <div className="small text-body-secondary">%</div>
                        <div className="fw-semibold">
                          {r.percentage != null
                            ? Number(r.percentage).toFixed(1)
                            : "—"}
                        </div>
                      </div>
                      <div className="text-end" style={{ minWidth: 56 }}>
                        <div className="small text-body-secondary">Time</div>
                        <div className="fw-semibold">
                          {r.timeSec != null ? formatMmSs(r.timeSec) : "—"}
                        </div>
                      </div>
                      <CBadge color="secondary">
                        {(r.status || "").replace(/_/g, " ")}
                      </CBadge>
                    </div>
                  </CCardBody>
                </CCard>
              );
            })}
            {!rest.length ? (
              <CCard className="border-0 shadow-sm" style={{ borderRadius: 12 }}>
                <CCardBody className="text-center text-body-secondary small py-3">
                  {rankings.length === 1
                    ? "Only one scorer so far — more ranks will appear as others finish."
                    : "Top 3 shown above. More ranks will appear as more people finish."}
                </CCardBody>
              </CCard>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
};

function StatCard({ label, value, accent }) {
  return (
    <CCard
      className="border-0 shadow-sm h-100"
      style={{
        borderRadius: 12,
        ...(accent
          ? {
              background:
                "linear-gradient(135deg, rgba(249,177,21,0.15), rgba(249,177,21,0.05))",
            }
          : {}),
      }}
    >
      <CCardBody className="p-3">
        <div className="small text-body-secondary mb-1">{label}</div>
        <div className="fs-4 fw-bold">{value}</div>
      </CCardBody>
    </CCard>
  );
}

export default QuizLeaderboard;
