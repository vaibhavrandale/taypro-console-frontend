import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { CButton, CProgress, CSpinner } from "@coreui/react";
import { formatMmSs } from "./quizUtils";
import { uploadQuizMediaDirect } from "./uploadQuizMediaDirect";
import ConfirmModal from "../../components/ConfirmModal";

/**
 * Browser camera recording → signed direct upload to Cloudinary.
 * Stop asks to confirm, then uploads immediately (no retake).
 */
const VideoRecordQuestion = ({
  attemptId,
  question,
  mediaById = {},
  value,
  onUploaded,
}) => {
  const maxSec = Math.min(
    Number(question.mediaConfig?.maxDurationSec) || 60,
    60,
  );
  const liveRef = useRef(null);
  const playbackRef = useRef(null);
  const streamRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const elapsedRef = useRef(0);
  const mimeRef = useRef("video/webm");
  const autoUploadOnStopRef = useRef(false);
  const blobRef = useRef(null);
  const blobUrlRef = useRef("");

  const [phase, setPhase] = useState("idle"); // idle | previewCam | recording | uploading | uploadFailed | awaitingLimitConfirm
  const [recElapsed, setRecElapsed] = useState(0);
  const [blobUrl, setBlobUrl] = useState("");
  const [uploadPct, setUploadPct] = useState(0);
  const [stopConfirmVisible, setStopConfirmVisible] = useState(false);
  const [limitConfirmVisible, setLimitConfirmVisible] = useState(false);

  const existingIds = value?.mediaIds || [];
  const existing = existingIds
    .map((id) => mediaById[String(id)])
    .filter(Boolean);

  const isBusy = phase === "uploading";

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

  const clearBlobUrl = () => {
    if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
    blobUrlRef.current = "";
    setBlobUrl("");
    blobRef.current = null;
  };

  useEffect(() => {
    return () => {
      clearRecTimer();
      stopStream();
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const stopRecorder = () => {
    clearRecTimer();
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      try {
        recorderRef.current.stop();
      } catch (_) {
        /* ignore */
      }
    }
  };

  const uploadBlob = async (b) => {
    if (!b || isBusy) return;
    try {
      setPhase("uploading");
      setUploadPct(0);
      const ext = (b.type || mimeRef.current).includes("mp4") ? "mp4" : "webm";
      const fileType = b.type || mimeRef.current || `video/${ext}`;
      const file = new File([b], `recording-${Date.now()}.${ext}`, {
        type: fileType,
      });
      const data = await uploadQuizMediaDirect({
        attemptId,
        questionId: question.questionId,
        file,
        durationSec: elapsedRef.current || recElapsed,
        onProgress: setUploadPct,
      });
      toast.success("Recording uploaded");
      onUploaded?.(data);
      clearBlobUrl();
      setRecElapsed(0);
      elapsedRef.current = 0;
      setPhase("idle");
    } catch (e) {
      toast.error(e.response?.data?.message || e.message || "Upload failed");
      setPhase("uploadFailed");
    }
  };

  const requestStopAndUpload = () => {
    if (isBusy) return;
    setStopConfirmVisible(true);
  };

  const confirmStopAndUpload = () => {
    setStopConfirmVisible(false);
    autoUploadOnStopRef.current = true;
    stopRecorder();
  };

  const confirmLimitUpload = () => {
    setLimitConfirmVisible(false);
    uploadBlob(blobRef.current);
  };

  const discardLimitRecording = () => {
    setLimitConfirmVisible(false);
    clearBlobUrl();
    setPhase("idle");
    toast("Recording discarded");
  };

  const startRecording = () => {
    if (!streamRef.current || isBusy) return;
    chunksRef.current = [];
    elapsedRef.current = 0;
    setRecElapsed(0);
    autoUploadOnStopRef.current = false;

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
      const type = recorder.mimeType || mimeRef.current || "video/webm";
      const b = new Blob(chunksRef.current, { type });
      blobRef.current = b;
      const url = URL.createObjectURL(b);
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = url;
      setBlobUrl(url);
      stopStream();

      if (autoUploadOnStopRef.current) {
        autoUploadOnStopRef.current = false;
        uploadBlob(b);
      } else {
        setPhase("awaitingLimitConfirm");
        setLimitConfirmVisible(true);
      }
    };

    recorder.start(500);
    setPhase("recording");
    timerRef.current = setInterval(() => {
      elapsedRef.current += 1;
      const next = elapsedRef.current;
      setRecElapsed(next);
      if (next >= maxSec) {
        autoUploadOnStopRef.current = false;
        stopRecorder();
      }
    }, 1000);
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
          <div className="small text-body-secondary">Recording submitted</div>
        </div>
      ) : null}

      {phase === "idle" && existing.length === 0 ? (
        <CButton color="success" size="sm" onClick={startCamera} disabled={isBusy}>
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

      {(phase === "uploading" ||
        phase === "uploadFailed" ||
        phase === "awaitingLimitConfirm") &&
      blobUrl ? (
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
        <CButton
          color="danger"
          size="sm"
          onClick={startRecording}
          disabled={isBusy}
        >
          Start recording
        </CButton>
      ) : null}

      {phase === "recording" ? (
        <CButton
          color="secondary"
          size="sm"
          onClick={requestStopAndUpload}
          disabled={isBusy || stopConfirmVisible}
        >
          Stop & upload
        </CButton>
      ) : null}

      {phase === "uploading" ? (
        <div>
          <div className="small mb-1">
            Uploading… {uploadPct}% <CSpinner size="sm" />
          </div>
          <CProgress value={uploadPct} color="success" />
          <CButton color="secondary" size="sm" className="mt-2" disabled>
            Uploading — please wait
          </CButton>
        </div>
      ) : null}

      {phase === "uploadFailed" ? (
        <CButton
          color="warning"
          size="sm"
          disabled={isBusy}
          onClick={() => uploadBlob(blobRef.current)}
        >
          Retry upload
        </CButton>
      ) : null}

      <ConfirmModal
        visible={stopConfirmVisible}
        onClose={() => setStopConfirmVisible(false)}
        onConfirm={confirmStopAndUpload}
        title="Stop & upload?"
        message="Are you sure you want to stop recording and upload now?<br/><br/>You <strong>cannot retake</strong> after uploading."
        confirmLabel="Yes, upload"
        confirmColor="success"
      />

      <ConfirmModal
        visible={limitConfirmVisible}
        onClose={discardLimitRecording}
        onConfirm={confirmLimitUpload}
        title="Time limit reached"
        message="Recording time limit reached.<br/><br/>Upload this clip now? You <strong>cannot retake</strong> after uploading."
        confirmLabel="Yes, upload"
        confirmColor="success"
      />
    </div>
  );
};

export default VideoRecordQuestion;
