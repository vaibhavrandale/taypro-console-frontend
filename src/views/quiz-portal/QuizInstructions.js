import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CFormInput,
  CProgress,
  CSpinner,
} from "@coreui/react";
import { formatQuizDate } from "./quizUtils";

const QuizInstructions = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [profileUrl, setProfileUrl] = useState("");
  const [profileReady, setProfileReady] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadPct, setUploadPct] = useState(0);

  useEffect(() => {
    axios
      .get(`/api/v1/quiz-portal/quizzes/${quizId}/instructions`, {
        withCredentials: true,
      })
      .then((r) => {
        setData(r.data.data);
        setProfileUrl(r.data.data.profileImage || "");
        // Must upload/confirm a fresh image on this page before Begin
        setProfileReady(false);
      })
      .catch((e) => {
        toast.error(e.response?.data?.message || "Failed to load");
        navigate("/quiz");
      })
      .finally(() => setLoading(false));
  }, [quizId, navigate]);

  const onPickProfile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!String(file.type || "").startsWith("image/")) {
      toast.error("Please choose an image file (JPG, PNG, WEBP)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5 MB");
      return;
    }
    try {
      setUploading(true);
      setUploadPct(0);
      const form = new FormData();
      form.append("file", file);
      const { data: res } = await axios.post(
        "/api/v1/quiz-portal/me/profile-image",
        form,
        {
          withCredentials: true,
          onUploadProgress: (ev) => {
            if (ev.total) setUploadPct(Math.round((ev.loaded / ev.total) * 100));
          },
        },
      );
      const url = res.data?.user?.profile_image || "";
      setProfileUrl(url);
      setProfileReady(true);
      sessionStorage.setItem(
        "quizUser",
        JSON.stringify(res.data?.user || {}),
      );
      toast.success("Profile image uploaded");
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
      setProfileReady(false);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const start = async () => {
    if (!profileReady) {
      toast.error("Upload your latest profile image to continue");
      return;
    }
    try {
      setStarting(true);
      const { data: res } = await axios.post(
        `/api/v1/quiz-portal/quizzes/${quizId}/start`,
        {},
        { withCredentials: true },
      );
      navigate(`/quiz/${quizId}/attempt/${res.data.attemptId}`);
    } catch (e) {
      toast.error(e.response?.data?.message || "Cannot start");
    } finally {
      setStarting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <CSpinner />
      </div>
    );
  }

  const canBegin = Boolean(data?.canStart) && profileReady && !uploading;

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }} className="pb-4">
      <CCard className="border-0 shadow-sm mb-3" style={{ borderRadius: 14 }}>
        <CCardHeader className="bg-transparent border-0 pt-4 px-4 pb-0">
          <div
            className="text-uppercase small text-body-secondary mb-1"
            style={{ letterSpacing: "0.1em" }}
          >
            Before you begin
          </div>
          <h4 className="mb-0 fw-bold">{data.title}</h4>
        </CCardHeader>
        <CCardBody className="p-4">
          {data.description ? (
            <p className="text-body-secondary">{data.description}</p>
          ) : null}
          <ul className="small mb-0">
            <li>Questions: {data.questionCount}</li>
            <li>Duration: {data.durationMinutes} minutes</li>
            <li>
              Marks: {data.maxMarks} (Pass {data.passingMarks})
            </li>
            <li>
              Window: {formatQuizDate(data.startAt)} →{" "}
              {formatQuizDate(data.endAt)}
            </li>
            <li>Only one attempt. Do not refresh to restart.</li>
            {data.settings?.detectTabSwitch ? (
              <li>Leaving the quiz window may count as a violation.</li>
            ) : null}
          </ul>
        </CCardBody>
      </CCard>

      <CCard
        className="border-0 shadow-sm mb-3"
        style={{
          borderRadius: 14,
          borderLeft: profileReady
            ? "4px solid var(--cui-success)"
            : "4px solid var(--cui-warning)",
        }}
      >
        <CCardBody className="p-4">
          <div className="d-flex align-items-start justify-content-between gap-2 flex-wrap mb-3">
            <div>
              <h5 className="mb-1 fw-semibold">1. Upload latest profile photo</h5>
              <p className="small text-body-secondary mb-0">
                Upload your latest profile image (for example a ChatGPT-generated
                photo of you). This is required before you can start the quiz.
              </p>
            </div>
            {profileReady ? (
              <span className="badge bg-success">Ready</span>
            ) : (
              <span className="badge bg-warning text-dark">Required</span>
            )}
          </div>

          <div className="d-flex flex-wrap align-items-center gap-3 mb-3">
            <div
              className="rounded-circle overflow-hidden d-flex align-items-center justify-content-center bg-secondary bg-opacity-25"
              style={{ width: 96, height: 96, flexShrink: 0 }}
            >
              {profileUrl ? (
                <img
                  src={profileUrl}
                  alt="Profile preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span className="small text-body-secondary">No photo</span>
              )}
            </div>
            <div className="flex-grow-1" style={{ minWidth: 200 }}>
              <CFormInput
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/jpg"
                disabled={uploading || starting}
                onChange={onPickProfile}
              />
              <div className="small text-body-secondary mt-1">
                JPG, PNG or WEBP · max 5 MB
              </div>
              {uploading ? (
                <div className="mt-2">
                  <div className="small mb-1">Uploading… {uploadPct}%</div>
                  <CProgress value={uploadPct} color="success" />
                </div>
              ) : null}
            </div>
          </div>
        </CCardBody>
      </CCard>

      <CCard className="border-0 shadow-sm" style={{ borderRadius: 14 }}>
        <CCardBody className="p-4">
          <h5 className="mb-3 fw-semibold">2. Start assessment</h5>
          {!profileReady ? (
            <p className="small text-warning mb-3">
              Upload your profile photo above to unlock Begin assessment.
            </p>
          ) : (
            <p className="small text-success mb-3">
              Profile photo saved. You can start the quiz now.
            </p>
          )}
          <div className="d-flex gap-2 flex-wrap">
            <Link className="btn btn-secondary btn-sm" to="/quiz">
              Back
            </Link>
            <CButton
              color="success"
              size="sm"
              disabled={!canBegin || starting}
              onClick={start}
            >
              {starting ? "Starting..." : "Begin assessment"}
            </CButton>
          </div>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default QuizInstructions;
