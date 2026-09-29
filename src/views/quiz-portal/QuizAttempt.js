import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CFormCheck,
  CFormInput,
  CProgress,
  CSpinner,
} from "@coreui/react";
import { formatMmSs } from "./quizUtils";
import VideoRecordQuestion from "./VideoRecordQuestion";
import ImageFileUploadQuestion from "./ImageFileUploadQuestion";
import ConfirmModal from "../../components/ConfirmModal";

const QuizAttempt = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [payload, setPayload] = useState(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [mediaById, setMediaById] = useState({});
  const [remaining, setRemaining] = useState(0);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitConfirmVisible, setSubmitConfirmVisible] = useState(false);

  const load = useCallback(async () => {
    const { data } = await axios.get(
      `/api/v1/quiz-portal/attempts/${attemptId}`,
      { withCredentials: true },
    );
    if (data.data?.status && data.data.status !== "IN_PROGRESS") {
      navigate(`/quiz/result/${attemptId}`);
      return;
    }
    setPayload(data.data);
    setAnswers(data.data.answers || {});
    setMediaById(data.data.mediaById || {});
    setIndex(data.data.currentQuestionIndex || 0);
    setRemaining(data.data.remainingSec || 0);
  }, [attemptId, navigate]);

  useEffect(() => {
    load().catch((e) => {
      toast.error(e.response?.data?.message || "Failed to load attempt");
      navigate("/quiz");
    });
  }, [load, navigate]);

  useEffect(() => {
    if (!payload?.endsAt) return undefined;
    const tick = () => {
      const left = Math.max(
        0,
        Math.floor((new Date(payload.endsAt) - Date.now()) / 1000),
      );
      setRemaining(left);
      if (left <= 0) {
        axios
          .post(
            `/api/v1/quiz-portal/attempts/${attemptId}/submit`,
            {},
            { withCredentials: true },
          )
          .finally(() => navigate(`/quiz/result/${attemptId}`));
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [payload?.endsAt, attemptId, navigate]);

  useEffect(() => {
    if (!payload?.settings?.detectTabSwitch) return undefined;
    const onBlur = () => {
      axios
        .post(
          `/api/v1/quiz-portal/attempts/${attemptId}/violation`,
          { type: "blur" },
          { withCredentials: true },
        )
        .then((r) => {
          const d = r.data.data;
          toast.error(`Warning ${d.violationCount}/${d.maxViolations}`);
          if (d.autoSubmitted) navigate(`/quiz/result/${attemptId}`);
        })
        .catch(() => {});
    };
    window.addEventListener("blur", onBlur);
    return () => window.removeEventListener("blur", onBlur);
  }, [payload?.settings?.detectTabSwitch, attemptId, navigate]);

  const questions = payload?.questions || [];
  const q = questions[index];

  const save = async (questionId, value, nextIndex = index) => {
    try {
      setSaving(true);
      const { data } = await axios.put(
        `/api/v1/quiz-portal/attempts/${attemptId}/answer`,
        { questionId, value, currentQuestionIndex: nextIndex },
        { withCredentials: true },
      );
      setSavedAt(data.savedAt);
      if (typeof data.remainingSec === "number") setRemaining(data.remainingSec);
    } catch (e) {
      toast.error(e.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const setMcqSingle = (optionId) => {
    const value = { optionIds: [optionId] };
    setAnswers((prev) => ({ ...prev, [q.questionId]: value }));
    save(q.questionId, value);
  };

  const toggleMcqMulti = (optionId) => {
    const prev = answers[q.questionId]?.optionIds || [];
    const next = prev.includes(optionId)
      ? prev.filter((id) => id !== optionId)
      : [...prev, optionId];
    const value = { optionIds: next };
    setAnswers((a) => ({ ...a, [q.questionId]: value }));
    save(q.questionId, value);
  };

  const setInput = (field, raw) => {
    const value =
      field === "number"
        ? { number: raw === "" ? undefined : Number(raw) }
        : { text: raw };
    setAnswers((a) => ({ ...a, [q.questionId]: value }));
  };

  const progress = useMemo(() => {
    if (!questions.length) return 0;
    return Math.round(((index + 1) / questions.length) * 100);
  }, [index, questions.length]);

  const submit = async () => {
    try {
      setSubmitting(true);
      await axios.post(
        `/api/v1/quiz-portal/attempts/${attemptId}/submit`,
        {},
        { withCredentials: true },
      );
      setSubmitConfirmVisible(false);
      navigate(`/quiz/result/${attemptId}`);
    } catch (e) {
      toast.error(e.response?.data?.message || "Submit failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (!payload || !q) {
    return (
      <div className="text-center py-5">
        <CSpinner />
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div>
          <h4 className="mb-0">{payload.title}</h4>
          <div className="small text-body-secondary">
            Question {index + 1} of {questions.length}
          </div>
        </div>
        <div className="text-center">
          <div className="small text-body-secondary">Quiz time remaining</div>
          <div
            className={`fw-bold fs-4 ${remaining < 60 ? "text-danger" : ""}`}
          >
            {formatMmSs(remaining)}
          </div>
        </div>
      </div>

      <CProgress className="mb-3" color="success" value={progress} />

      <CCard className="mb-3">
        <CCardHeader className="small text-body-secondary">
          {q.questionType} · {q.marks} mark{q.marks === 1 ? "" : "s"}
        </CCardHeader>
        <CCardBody>
          <div className="fw-semibold mb-3">{q.questionText}</div>
          {q.description ? (
            <div className="text-body-secondary small mb-3">{q.description}</div>
          ) : null}

          {q.questionType === "MCQ_SINGLE"
            ? (q.options || []).map((o) => (
                <CFormCheck
                  key={o.id}
                  type="radio"
                  name={`q-${q.questionId}`}
                  label={o.text}
                  className="mb-2"
                  checked={(answers[q.questionId]?.optionIds || [])[0] === o.id}
                  onChange={() => setMcqSingle(o.id)}
                />
              ))
            : null}

          {q.questionType === "MCQ_MULTI"
            ? (q.options || []).map((o) => (
                <CFormCheck
                  key={o.id}
                  label={o.text}
                  className="mb-2"
                  checked={(answers[q.questionId]?.optionIds || []).includes(
                    o.id,
                  )}
                  onChange={() => toggleMcqMulti(o.id)}
                />
              ))
            : null}

          {q.questionType === "INPUT" ? (
            <div>
              <CFormInput
                type={
                  q.inputConfig?.inputType === "text" ? "text" : "number"
                }
                step={
                  q.inputConfig?.inputType === "decimal" ? "0.01" : undefined
                }
                value={
                  q.inputConfig?.inputType === "text"
                    ? answers[q.questionId]?.text || ""
                    : (answers[q.questionId]?.number ?? "")
                }
                onChange={(e) =>
                  setInput(
                    q.inputConfig?.inputType === "text" ? "text" : "number",
                    e.target.value,
                  )
                }
                onBlur={() =>
                  save(
                    q.questionId,
                    q.inputConfig?.inputType === "text"
                      ? { text: answers[q.questionId]?.text || "" }
                      : { number: answers[q.questionId]?.number },
                  )
                }
              />
              {q.inputConfig?.unit ? (
                <div className="small text-body-secondary mt-1">
                  Unit: {q.inputConfig.unit}
                </div>
              ) : null}
            </div>
          ) : null}

          {q.questionType === "VIDEO_RECORD" ? (
            <VideoRecordQuestion
              attemptId={attemptId}
              question={q}
              mediaById={mediaById}
              value={answers[q.questionId]}
              onUploaded={(data) => {
                setAnswers((a) => ({
                  ...a,
                  [q.questionId]: { mediaIds: data.mediaIds },
                }));
                if (data.media) {
                  setMediaById((m) => ({
                    ...m,
                    [String(data.media._id)]: data.media,
                  }));
                }
                setSavedAt(data.savedAt || new Date().toISOString());
              }}
            />
          ) : null}

          {q.questionType === "IMAGE_UPLOAD" ? (
            <ImageFileUploadQuestion
              attemptId={attemptId}
              question={q}
              mediaById={mediaById}
              value={answers[q.questionId]}
              accept="image/jpeg,image/png,image/webp,image/jpg"
              label="JPG, PNG, WEBP"
              onUploaded={(data) => {
                setAnswers((a) => ({
                  ...a,
                  [q.questionId]: { mediaIds: data.mediaIds },
                }));
                if (data.media) {
                  setMediaById((m) => ({
                    ...m,
                    [String(data.media._id)]: data.media,
                  }));
                }
                setSavedAt(data.savedAt || new Date().toISOString());
              }}
            />
          ) : null}

          {q.questionType === "FILE_UPLOAD" ? (
            <ImageFileUploadQuestion
              attemptId={attemptId}
              question={q}
              mediaById={mediaById}
              value={answers[q.questionId]}
              accept=".pdf,.doc,.docx,.xls,.xlsx,application/pdf"
              label="PDF, DOC, DOCX, XLS, XLSX"
              onUploaded={(data) => {
                setAnswers((a) => ({
                  ...a,
                  [q.questionId]: { mediaIds: data.mediaIds },
                }));
                if (data.media) {
                  setMediaById((m) => ({
                    ...m,
                    [String(data.media._id)]: data.media,
                  }));
                }
                setSavedAt(data.savedAt || new Date().toISOString());
              }}
            />
          ) : null}
        </CCardBody>
      </CCard>

      <div className="d-flex justify-content-between align-items-center">
        <div className="small text-success">
          {saving ? "Saving..." : savedAt ? "✓ Answer saved" : ""}
        </div>
        <div className="d-flex gap-2">
          {payload.settings?.allowBack !== false ? (
            <CButton
              color="secondary"
              size="sm"
              disabled={index === 0}
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
            >
              Back
            </CButton>
          ) : null}
          {index < questions.length - 1 ? (
            <CButton
              color="primary"
              size="sm"
              onClick={() => setIndex((i) => i + 1)}
            >
              Next
            </CButton>
          ) : (
            <CButton
              color="success"
              size="sm"
              disabled={submitting}
              onClick={() => setSubmitConfirmVisible(true)}
            >
              {submitting ? "Submitting..." : "Submit quiz"}
            </CButton>
          )}
        </div>
      </div>

      <ConfirmModal
        visible={submitConfirmVisible}
        onClose={() => !submitting && setSubmitConfirmVisible(false)}
        onConfirm={submit}
        title="Are you sure?"
        message="Are you sure you want to submit this quiz?<br/><br/>You will not be able to change answers after submitting."
        confirmLabel="Yes, submit"
        confirmColor="success"
        loading={submitting}
      />
    </div>
  );
};

export default QuizAttempt;
