import React, { useMemo } from "react";
import {
  CButton,
  CModal,
  CModalBody,
  CSpinner,
  CProgress,
} from "@coreui/react";
import { useSelector } from "react-redux";
import { useVoiceCall } from "../context/VoiceCallContext";

function LevelMeter({ label, level, talking, color }) {
  const pct = Math.round(Math.min(1, Math.max(0, level)) * 100);
  return (
    <div className="text-start mb-2">
      <div className="d-flex justify-content-between small mb-1">
        <span className="text-muted">{label}</span>
        <span className={talking ? "text-success fw-semibold" : "text-muted"}>
          {talking ? "Speaking" : "Silent"}
        </span>
      </div>
      <CProgress thin value={pct} color={talking ? color || "success" : "secondary"} />
    </div>
  );
}

export default function VoiceCallModal() {
  const userInfo = useSelector((state) => state.userInfo);
  const {
    phase,
    call,
    error,
    muted,
    submitting,
    audioLevels,
    accept,
    reject,
    hangUp,
    toggleMute,
  } = useVoiceCall();

  const visible = phase !== "idle";

  const peer = useMemo(() => {
    if (!call || !userInfo?._id) return null;
    const iAmCaller = String(call.caller_id) === String(userInfo._id);
    return iAmCaller ? call.callee_snapshot : call.caller_snapshot;
  }, [call, userInfo?._id]);

  const statusLabel = (() => {
    switch (phase) {
      case "outgoing":
        return "Calling…";
      case "incoming":
        return "Incoming call";
      case "connecting":
        return "Connecting…";
      case "active":
        return "On call";
      case "ended":
        if (call?.status === "rejected") return "Call declined";
        if (call?.status === "missed") return "Call missed";
        return "Call ended";
      default:
        return "";
    }
  })();

  if (!visible) return null;

  const showMeters =
    phase === "active" || phase === "connecting" || phase === "outgoing";

  return (
    <CModal
      visible={visible}
      alignment="center"
      backdrop="static"
      keyboard={false}
      onClose={() => {}}
    >
      <CModalBody className="text-center py-4">
        <div className="text-uppercase text-muted small fw-bold mb-3">
          Voice call
        </div>
        {peer?.profile_image ? (
          <img
            src={peer.profile_image}
            alt=""
            className="rounded-circle mb-3"
            width={72}
            height={72}
            style={{ objectFit: "cover" }}
          />
        ) : (
          <div
            className="rounded-circle bg-secondary d-inline-flex align-items-center justify-content-center mb-3 text-white"
            style={{ width: 72, height: 72, fontSize: 28 }}
          >
            {(peer?.username || "?")[0]}
          </div>
        )}
        <h5 className="mb-1">{peer?.username || "Console user"}</h5>
        <div className="text-muted small mb-2">
          {peer?.role || peer?.email || ""}
        </div>
        <div className="text-success fw-semibold mb-3">{statusLabel}</div>
        {error ? <div className="text-danger small mb-3">{error}</div> : null}
        {submitting && phase === "connecting" ? (
          <CSpinner size="sm" className="mb-3" />
        ) : null}

        {showMeters ? (
          <div className="px-3 mb-3">
            <LevelMeter
              label="You (mic)"
              level={muted ? 0 : audioLevels?.localLevel || 0}
              talking={!muted && audioLevels?.isLocalTalking}
              color="info"
            />
            <LevelMeter
              label="Other person"
              level={audioLevels?.remoteLevel || 0}
              talking={audioLevels?.isRemoteTalking}
              color="success"
            />
            <div className="text-muted" style={{ fontSize: 11 }}>
              If &quot;Other person&quot; stays silent while they talk, audio is
              not connected yet (check mic permission / network).
            </div>
          </div>
        ) : null}

        {(phase === "active" ||
          phase === "outgoing" ||
          phase === "connecting") && (
          <div className="mb-3">
            <CButton
              color={muted ? "warning" : "secondary"}
              size="sm"
              onClick={toggleMute}
            >
              {muted ? "Unmute" : "Mute"}
            </CButton>
          </div>
        )}

        <div className="d-flex justify-content-center gap-3">
          {phase === "incoming" ? (
            <>
              <CButton
                color="danger"
                disabled={submitting}
                onClick={() => void reject()}
              >
                Decline
              </CButton>
              <CButton
                color="success"
                disabled={submitting}
                onClick={() => void accept()}
              >
                Accept
              </CButton>
            </>
          ) : phase === "ended" ? null : (
            <CButton
              color="danger"
              disabled={submitting}
              onClick={() => void hangUp()}
            >
              End call
            </CButton>
          )}
        </div>
      </CModalBody>
    </CModal>
  );
}
