import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  CButton,
  CCard,
  CCardBody,
  CFormInput,
  CFormTextarea,
} from "@coreui/react";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";

const roleToRoute = (role) => {
  if (role === "Master Admin") return "master-admin";
  if (role === "Service Admin") return "service-admin";
  if (role === "Project Admin") return "project-admin";
  return "master-admin";
};

const QuizEvaluate = () => {
  const { attemptId } = useParams();
  const userInfo = useSelector((s) => s.userInfo);
  const base = `/${roleToRoute(userInfo?.role)}/quizzes`;
  const [data, setData] = useState(null);
  const [scores, setScores] = useState({});
  const [comments, setComments] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    axios
      .get(`/api/v1/quiz-attempts/${attemptId}`, { withCredentials: true })
      .then((r) => {
        setData(r.data.data);
        const init = {};
        const cinit = {};
        for (const a of r.data.data.answers || []) {
          init[String(a.questionId)] =
            a.manualScore ?? a.finalScore ?? a.autoScore ?? "";
          cinit[String(a.questionId)] = a.evaluatorComment || "";
        }
        setScores(init);
        setComments(cinit);
      })
      .catch((e) => toast.error(e.response?.data?.message || "Load failed"))
      .finally(() => setLoading(false));
  }, [attemptId]);

  const save = async () => {
    try {
      setSaving(true);
      const payload = {
        scores: Object.keys(scores).map((questionId) => ({
          questionId,
          manualScore: Number(scores[questionId]),
          comment: comments[questionId] || "",
        })),
      };
      await axios.put(
        `/api/v1/quiz-attempts/${attemptId}/evaluation`,
        payload,
        { withCredentials: true },
      );
      await axios.post(
        `/api/v1/quiz-attempts/${attemptId}/finalize`,
        {},
        { withCredentials: true },
      );
      toast.success("Evaluation saved");
    } catch (e) {
      toast.error(e.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  const attempt = data?.attempt;
  const mediaById = data?.mediaById || {};
  const answerByQ = Object.fromEntries(
    (data?.answers || []).map((a) => [String(a.questionId), a]),
  );

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <div>
          <h4 className="mb-0">{attempt?.quizSnapshot?.title}</h4>
          <div className="text-muted small">
            {attempt?.userSnapshot?.username} · {attempt?.userSnapshot?.email}
          </div>
        </div>
        <Link className="btn btn-secondary btn-sm" to={`${base}/${attempt?.quizId}/attempts`}>
          Back
        </Link>
      </div>

      {(attempt?.questionSnapshot || []).map((q, i) => {
        const ans = answerByQ[String(q.questionId)];
        const mediaList = (ans?.value?.mediaIds || [])
          .map((id) => mediaById[String(id)])
          .filter(Boolean);
        return (
          <CCard key={String(q.questionId)} className="mb-3">
            <CCardBody>
              <div className="small text-muted">
                Question {i + 1} · {q.questionType} · max {q.marks}
              </div>
              <div className="fw-semibold mb-2">{q.questionText}</div>
              <div className="small mb-2">
                Answer:{" "}
                {ans?.value?.optionIds?.length
                  ? ans.value.optionIds.join(", ")
                  : ans?.value?.text ??
                    ans?.value?.number ??
                    (mediaList.length ? "Media attached" : "—")}
              </div>
              {mediaList.map((m) =>
                m.resourceType === "video" || m.mime?.startsWith("video/") ? (
                  <video
                    key={m._id}
                    src={m.url}
                    controls
                    className="w-100 rounded mb-2"
                    style={{ maxHeight: 320, background: "#000" }}
                  />
                ) : m.resourceType === "image" || m.mime?.startsWith("image/") ? (
                  <img
                    key={m._id}
                    src={m.url}
                    alt={m.fileName}
                    className="rounded mb-2"
                    style={{ maxWidth: "100%", maxHeight: 280 }}
                  />
                ) : (
                  <div key={m._id} className="mb-2">
                    <a href={m.url} target="_blank" rel="noreferrer">
                      {m.fileName || "Open file"}
                    </a>
                  </div>
                ),
              )}
              <div className="small mb-2">
                Auto score: {ans?.autoScore ?? "—"}
              </div>
              <CFormInput
                type="number"
                label={`Admin marks (0–${q.marks})`}
                value={scores[String(q.questionId)] ?? ""}
                onChange={(e) =>
                  setScores({
                    ...scores,
                    [String(q.questionId)]: e.target.value,
                  })
                }
                className="mb-2"
                style={{ maxWidth: 160 }}
              />
              <CFormTextarea
                rows={2}
                placeholder="Comment"
                value={comments[String(q.questionId)] || ""}
                onChange={(e) =>
                  setComments({
                    ...comments,
                    [String(q.questionId)]: e.target.value,
                  })
                }
              />
            </CCardBody>
          </CCard>
        );
      })}

      <CButton color="success" disabled={saving} onClick={save}>
        {saving ? "Saving..." : "Save evaluation"}
      </CButton>
    </div>
  );
};

export default QuizEvaluate;
