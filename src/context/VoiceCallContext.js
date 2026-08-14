import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import socket from "../components/Socket";
import {
  addRemoteIceCandidate,
  answerAsCallee,
  applyRemoteAnswer,
  leaveVoiceChannel,
  setMuted as setMediaMuted,
  startAsCaller,
  subscribeAudioLevels,
} from "../services/webrtcVoice";
import {
  playDisconnectSound,
  playMuteSound,
  startIncomingRingtone,
  startOutgoingRingback,
  stopRingtone,
  unlockCallAudio,
} from "../services/callSounds";

const VoiceCallContext = createContext(null);

function isSameCall(current, incoming) {
  return current != null && String(current._id) === String(incoming._id);
}

async function apiStartCall(calleeId) {
  const { data } = await axios.post(
    "/api/v1/calls",
    { callee_id: calleeId },
    { withCredentials: true },
  );
  return data.data;
}

async function apiAccept(callId) {
  const { data } = await axios.post(
    `/api/v1/calls/${callId}/accept`,
    {},
    { withCredentials: true },
  );
  return data.data;
}

async function apiReject(callId) {
  const { data } = await axios.post(
    `/api/v1/calls/${callId}/reject`,
    {},
    { withCredentials: true },
  );
  return data.data;
}

async function apiEnd(callId) {
  const { data } = await axios.post(
    `/api/v1/calls/${callId}/end`,
    {},
    { withCredentials: true },
  );
  return data.data;
}

export function VoiceCallProvider({ children }) {
  const userInfo = useSelector((state) => state.userInfo);
  const [phase, setPhase] = useState("idle");
  const [call, setCall] = useState(null);
  const [error, setError] = useState(null);
  const [muted, setMutedState] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [audioLevels, setAudioLevels] = useState({
    localLevel: 0,
    remoteLevel: 0,
    isLocalTalking: false,
    isRemoteTalking: false,
  });

  const callRef = useRef(null);
  const phaseRef = useRef("idle");
  const userIdRef = useRef(undefined);

  useEffect(() => {
    callRef.current = call;
  }, [call]);
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);
  useEffect(() => {
    userIdRef.current = userInfo?._id;
  }, [userInfo?._id]);

  // Unlock Web Audio so incoming ringtone can play without a click on that tab
  useEffect(() => {
    const unlock = () => unlockCallAudio();
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  const peerUserId = useCallback((current) => {
    const me = String(userIdRef.current || "");
    return String(current.caller_id) === me
      ? String(current.callee_id)
      : String(current.caller_id);
  }, []);

  const emitSignal = useCallback(
    (current, payload) => {
      socket.emit("call:signal", {
        ...payload,
        callId: current._id,
        toUserId: peerUserId(current),
      });
    },
    [peerUserId],
  );

  const resetLocal = useCallback(() => {
    stopRingtone();
    leaveVoiceChannel();
    setMutedState(false);
    setMediaMuted(false);
    setPhase("idle");
    setCall(null);
    setSubmitting(false);
  }, []);

  const finishCall = useCallback(
    (next) => {
      stopRingtone();
      playDisconnectSound();
      leaveVoiceChannel();
      setCall(next);
      setPhase("ended");
      setTimeout(() => {
        if (callRef.current && String(callRef.current._id) === String(next._id)) {
          resetLocal();
        }
      }, 1500);
    },
    [resetLocal],
  );

  const beginCallerOffer = useCallback(
    async (current) => {
      const offer = await startAsCaller({
        iceServers: current.iceServers,
        onLocalIce: (ice) => emitSignal(current, ice),
      });
      emitSignal(current, { type: "offer", sdp: offer });
      setPhase("active");
    },
    [emitSignal],
  );

  const startCall = useCallback(
    async (calleeId) => {
      if (!userInfo?._id) return;
      if (phaseRef.current !== "idle") {
        setError("You are already on a call");
        return;
      }
      setError(null);
      setSubmitting(true);
      try {
        const created = await apiStartCall(calleeId);
        setCall(created);
        setPhase("outgoing");
      } catch (err) {
        setError(
          err.response?.data?.error ||
            err.response?.data?.message ||
            err.message ||
            "Failed to start call",
        );
        resetLocal();
      } finally {
        setSubmitting(false);
      }
    },
    [resetLocal, userInfo?._id],
  );

  const accept = useCallback(async () => {
    const current = callRef.current;
    if (!current) return;
    stopRingtone();
    setSubmitting(true);
    setError(null);
    try {
      setPhase("connecting");
      const updated = await apiAccept(current._id);
      setCall(updated);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Failed to accept call",
      );
      setPhase("incoming");
      startIncomingRingtone();
    } finally {
      setSubmitting(false);
    }
  }, []);

  const reject = useCallback(async () => {
    const current = callRef.current;
    if (!current) return;
    stopRingtone();
    setSubmitting(true);
    try {
      const updated = await apiReject(current._id);
      finishCall(updated);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Failed to reject call",
      );
      resetLocal();
    } finally {
      setSubmitting(false);
    }
  }, [finishCall, resetLocal]);

  const hangUp = useCallback(async () => {
    const current = callRef.current;
    if (!current) {
      resetLocal();
      return;
    }
    stopRingtone();
    setSubmitting(true);
    try {
      const updated = await apiEnd(current._id);
      finishCall(updated);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Failed to end call",
      );
      resetLocal();
    } finally {
      setSubmitting(false);
    }
  }, [finishCall, resetLocal]);

  const toggleMute = useCallback(() => {
    setMutedState((prev) => {
      const next = !prev;
      setMediaMuted(next);
      playMuteSound(next);
      return next;
    });
  }, []);

  // Ring / ringback by phase
  useEffect(() => {
    if (phase === "incoming") {
      startIncomingRingtone();
      return () => stopRingtone();
    }
    if (phase === "outgoing") {
      startOutgoingRingback();
      return () => stopRingtone();
    }
    stopRingtone();
    return undefined;
  }, [phase]);

  // Join user room + listen for call events
  useEffect(() => {
    if (!userInfo?._id) {
      leaveVoiceChannel();
      resetLocal();
      return;
    }

    const user = {
      _id: userInfo._id,
      username: userInfo.username,
      email: userInfo.email,
      profile_image: userInfo.profile_image,
    };

    const joinRooms = () => {
      socket.emit("join_user_room", userInfo._id);
      socket.emit("join", user);
    };

    const onIncoming = (payload) => {
      if (!payload?._id) return;
      if (phaseRef.current !== "idle") return;
      if (String(payload.callee_id) !== String(userInfo._id)) return;
      setCall(payload);
      setPhase("incoming");
      setError(null);
    };

    const onAccepted = async (payload) => {
      if (!isSameCall(callRef.current, payload)) return;
      setCall((prev) => ({ ...(prev || payload), ...payload }));
      if (String(payload.caller_id) === String(userInfo._id)) {
        setPhase("connecting");
        try {
          await beginCallerOffer({ ...(callRef.current || payload), ...payload });
        } catch (err) {
          setError(err.message || "Failed to start WebRTC offer");
        }
      } else {
        setPhase("connecting");
      }
    };

    const onRejected = (payload) => {
      if (!isSameCall(callRef.current, payload)) return;
      finishCall(payload);
    };

    const onEnded = (payload) => {
      if (!isSameCall(callRef.current, payload)) return;
      finishCall(payload);
    };

    const onMissed = (payload) => {
      if (isSameCall(callRef.current, payload)) finishCall(payload);
    };

    const onSignal = async (payload) => {
      const current = callRef.current;
      if (!current || String(payload.callId) !== String(current._id)) return;

      try {
        if (payload.type === "offer" && payload.sdp) {
          const answer = await answerAsCallee({
            iceServers: current.iceServers,
            remoteOffer: payload.sdp,
            onLocalIce: (ice) => emitSignal(current, ice),
          });
          emitSignal(current, { type: "answer", sdp: answer });
          setPhase("active");
        } else if (payload.type === "answer" && payload.sdp) {
          await applyRemoteAnswer(payload.sdp);
          setPhase("active");
        } else if (payload.type === "ice") {
          await addRemoteIceCandidate(payload.candidate ?? null);
        }
      } catch (err) {
        setError(err.message || "WebRTC signaling failed");
      }
    };

    if (socket.connected) joinRooms();
    socket.on("connect", joinRooms);
    socket.on("call:incoming", onIncoming);
    socket.on("call:accepted", onAccepted);
    socket.on("call:rejected", onRejected);
    socket.on("call:ended", onEnded);
    socket.on("call:missed", onMissed);
    socket.on("call:signal", onSignal);

    return () => {
      socket.off("connect", joinRooms);
      socket.off("call:incoming", onIncoming);
      socket.off("call:accepted", onAccepted);
      socket.off("call:rejected", onRejected);
      socket.off("call:ended", onEnded);
      socket.off("call:missed", onMissed);
      socket.off("call:signal", onSignal);
      socket.emit("leave_user_room", userInfo._id);
    };
  }, [
    beginCallerOffer,
    emitSignal,
    finishCall,
    resetLocal,
    userInfo,
  ]);

  useEffect(() => () => leaveVoiceChannel(), []);

  useEffect(() => {
    if (phase === "idle" || phase === "ended" || phase === "incoming") {
      setAudioLevels({
        localLevel: 0,
        remoteLevel: 0,
        isLocalTalking: false,
        isRemoteTalking: false,
      });
      return undefined;
    }
    return subscribeAudioLevels(setAudioLevels);
  }, [phase]);

  const value = useMemo(
    () => ({
      phase,
      call,
      error,
      muted,
      submitting,
      audioLevels,
      startCall,
      accept,
      reject,
      hangUp,
      toggleMute,
      clearError: () => setError(null),
    }),
    [
      accept,
      audioLevels,
      call,
      error,
      hangUp,
      muted,
      phase,
      reject,
      startCall,
      submitting,
      toggleMute,
    ],
  );

  return (
    <VoiceCallContext.Provider value={value}>
      {children}
    </VoiceCallContext.Provider>
  );
}

export function useVoiceCall() {
  const ctx = useContext(VoiceCallContext);
  if (!ctx) {
    throw new Error("useVoiceCall must be used within VoiceCallProvider");
  }
  return ctx;
}
