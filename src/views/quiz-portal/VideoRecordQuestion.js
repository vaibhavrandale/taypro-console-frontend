import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { CButton, CProgress, CSpinner } from "@coreui/react";
import { formatMmSs } from "./quizUtils";

/**
 * Browser camera recording → upload to quiz-portal media API.
 * Recording timer is separate from the quiz countdown.
 */
const VideoRecordQuestion = ({
  attemptId,
  question,
  mediaById = {},
  value,
  onUploaded,
}) => {
  const maxSec = question.mediaConfig?.maxDurationSec || 120;
  const liveRef = useRef(null);
  const playbackRef = useRef(null);
  const streamRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const elapsedRef = useRef(0);
  const mimeRef = useRef("video/webm");

  const [phase, setPhase] = useState("idle"); // idle | previewCam | recording | review | uploading
  const [recElapsed, setRecElapsed] = useState(0);
  const [blobUrl, setBlobUrl] = useState("");
  const [blob, setBlob] = useState(null);
  const [uploadPct, setUploadPct] = useState(0);

  const existingIds = value?.mediaIds || [];
  const existing = existingIds
    .map((id) => mediaById[String(id)])
    .filter(Boolean);

  const stopStream = () => {
    streamRef.current?.getTracks()?.forEach((t) => t.stop());
    streamRef.current = null;
    if (liveRef.current) liveRef.current.srcObject = null;
  };

  const clearRecTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      clearRecTimer();
      stopStream();
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Attach live stream after <video> mounts (fixes blank screen)
  useEffect(() => {
    if (phase !== "previewCam" && phase !== "recording") return undefined;
    const el = liveRef.current;
    const stream = streamRef.current;
    if (!el || !stream) return undefined;
    el.srcObject = stream;
    el.muted = true;
    el.playsInline = true;
    const play = el.play();
    if (play?.catch) play.catch(() => {});
    return undefined;
  }, [phase]);

  const startCamera = async () => {
    try {
      stopStream();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: true,
      });
      streamRef.current = stream;
      setPhase("previewCam");
    } catch (e) {
      toast.error(
        e?.name === "NotAllowedError"
          ? "Camera/microphone permission denied"
          : "Cannot access camera",
      );
    }
  };

  const stopRecording = () => {
    clearRecTimer();
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      try {
        recorderRef.current.stop();
      } catch (_) {
        /* ignore */
      }
    }
  };

  const startRecording = () => {
    if (!streamRef.current) return;
    chunksRef.current = [];
    elapsedRef.current = 0;
    setRecElapsed(0);

    const mime = MediaRecorder.isTypeSupported("video/webm;codecs=vp8,opus")
      ? "video/webm;codecs=vp8,opus"
      : MediaRecorder.isTypeSupported("video/webm")
        ? "video/webm"
        : MediaRecorder.isTypeSupported("video/mp4")
          ? "video/mp4"
          : "";
    mimeRef.current = mime || "video/webm";

    let recorder;
    try {
      recorder = new MediaRecorder(
        streamRef.current,
        mime ? { mimeType: mime } : undefined,
      );
    } catch {
      recorder = new MediaRecorder(streamRef.current);
    }
    recorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data?.size) chunksRef.current.push(e.data);
    };
    recorder.onstop = () => {
      clearRecTimer();
      const type =
        recorder.mimeType || mimeRef.current || "video/webm";
      const b = new Blob(chunksRef.current, { type });
      setBlob(b);
      const url = URL.createObjectURL(b);
      setBlobUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });
      stopStream();
      setPhase("review");
    };

    recorder.start(500);
    setPhase("recording");
    timerRef.current = setInterval(() => {
      elapsedRef.current += 1;
      const next = elapsedRef.current;
      setRecElapsed(next);
      if (next >= maxSec) stopRecording();
    }, 1000);
  };

  const retake = () => {
    clearRecTimer();
    setBlob(null);
    if (blobUrl) URL.revokeObjectURL(blobUrl);
    setBlobUrl("");
    setRecElapsed(0);
    elapsedRef.current = 0;
    setUploadPct(0);
    startCamera();
  };

  const upload = async () => {
    if (!blob) return;
    try {
      setPhase("uploading");
      setUploadPct(0);
      const ext = (blob.type || mimeRef.current).includes("mp4") ? "mp4" : "webm";
      const fileType = blob.type || mimeRef.current || `video/${ext}`;
      const file = new File([blob], `recording-${Date.now()}.${ext}`, {
        type: fileType,
      });
      const form = new FormData();
      form.append("file", file);
      form.append("questionId", String(question.questionId));
      form.append("durationSec", String(elapsedRef.current || recElapsed));
      const { data } = await axios.post(
        `/api/v1/quiz-portal/attempts/${attemptId}/media`,
        form,
        {
          withCredentials: true,
          onUploadProgress: (ev) => {
            if (ev.total) {
              setUploadPct(Math.round((ev.loaded / ev.total) * 100));
            }
          },
        },
      );
      toast.success("Recording uploaded");
      onUploaded?.(data.data);
      setPhase("idle");
      setBlob(null);
      if (blobUrl) URL.revokeObjectURL(blobUrl);
      setBlobUrl("");
      setRecElapsed(0);
      elapsedRef.current = 0;
    } catch (e) {
      toast.error(e.response?.data?.message || "Upload failed");
      setPhase("review");
    }
  };

  return (
    <div>
      <div className="small text-body-secondary mb-2">
        Max clip length: {maxSec}s (own recording timer — not the quiz timer)
      </div>

      {existing.length > 0 && phase === "idle" ? (
        <div className="mb-3">
          {existing.map((m) => (
            <video
              key={m._id}
              src={m.url}
              controls
              playsInline
              className="w-100 rounded mb-2"
              style={{ maxHeight: 320, minHeight: 200, background: "#000" }}
            />
          ))}
          <CButton color="warning" size="sm" onClick={startCamera}>
            Record again
          </CButton>
        </div>
      ) : null}

      {phase === "idle" && existing.length === 0 ? (
        <CButton color="success" size="sm" onClick={startCamera}>
          Start camera
        </CButton>
      ) : null}

      {(phase === "previewCam" || phase === "recording") && (
        <div className="mb-2">
          {phase === "recording" ? (
            <div
              className="d-flex justify-content-between align-items-center mb-2 px-2 py-2 rounded"
              style={{ background: "rgba(220,38,38,0.15)" }}
            >
              <span className="text-danger fw-bold">● RECORDING</span>
              <span className="fw-bold fs-5">
                Recording timer: {formatMmSs(recElapsed)} / {formatMmSs(maxSec)}
              </span>
            </div>
          ) : (
            <div className="small text-body-secondary mb-1">Camera preview</div>
          )}
          <video
            ref={liveRef}
            autoPlay
            muted
            playsInline
            className="w-100 rounded"
            style={{
              maxHeight: 360,
              minHeight: 240,
              width: "100%",
              objectFit: "cover",
              background: "#000",
              transform: "scaleX(-1)",
            }}
          />
        </div>
      )}

      {(phase === "review" || phase === "uploading") && blobUrl ? (
        <div className="mb-2">
          <div className="small text-body-secondary mb-1">
            Preview ({formatMmSs(recElapsed)})
          </div>
          <video
            ref={playbackRef}
            src={blobUrl}
            controls
            playsInline
            className="w-100 rounded"
            style={{ maxHeight: 360, minHeight: 200, background: "#000" }}
          />
        </div>
      ) : null}

      {phase === "previewCam" ? (
        <CButton color="danger" size="sm" onClick={startRecording}>
          Start recording
        </CButton>
      ) : null}

      {phase === "recording" ? (
        <CButton color="secondary" size="sm" onClick={stopRecording}>
          Stop recording
        </CButton>
      ) : null}

      {phase === "review" ? (
        <div className="d-flex gap-2 flex-wrap">
          <CButton color="secondary" size="sm" onClick={retake}>
            Retake
          </CButton>
          <CButton color="success" size="sm" onClick={upload}>
            Submit recording
          </CButton>
        </div>
      ) : null}

      {phase === "uploading" ? (
        <div>
          <div className="small mb-1">
            Uploading… {uploadPct}% <CSpinner size="sm" />
          </div>
          <CProgress value={uploadPct} color="success" />
        </div>
      ) : null}
    </div>
  );
};

export default VideoRecordQuestion;
