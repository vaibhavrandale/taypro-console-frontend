/**
 * Browser WebRTC helpers for 1:1 voice calls.
 * Plays remote audio and exposes mic/remote level meters.
 */

let pc = null;
let localStream = null;
let remoteStream = null;
let remoteAudioEl = null;
const pendingRemoteCandidates = [];
let remoteDescriptionSet = false;

let audioCtx = null;
let localAnalyser = null;
let remoteAnalyser = null;
let localData = null;
let remoteData = null;
let levelTimer = null;
let levelsListener = null;

function defaultIceServers() {
  return [{ urls: "stun:stun.l.google.com:19302" }];
}

function ensureAudioElement() {
  if (remoteAudioEl) return remoteAudioEl;
  remoteAudioEl = document.createElement("audio");
  remoteAudioEl.autoplay = true;
  remoteAudioEl.playsInline = true;
  remoteAudioEl.setAttribute("playsinline", "true");
  remoteAudioEl.style.display = "none";
  document.body.appendChild(remoteAudioEl);
  return remoteAudioEl;
}

function rmsFromAnalyser(analyser, data) {
  if (!analyser || !data) return 0;
  analyser.getByteTimeDomainData(data);
  let sum = 0;
  for (let i = 0; i < data.length; i += 1) {
    const v = (data[i] - 128) / 128;
    sum += v * v;
  }
  return Math.min(1, Math.sqrt(sum / data.length) * 4);
}

function startLevelLoop() {
  if (levelTimer) return;
  levelTimer = window.setInterval(() => {
    if (!levelsListener) return;
    const localLevel = rmsFromAnalyser(localAnalyser, localData);
    const remoteLevel = rmsFromAnalyser(remoteAnalyser, remoteData);
    levelsListener({
      localLevel,
      remoteLevel,
      isLocalTalking: localLevel > 0.08,
      isRemoteTalking: remoteLevel > 0.08,
    });
  }, 100);
}

function stopLevelLoop() {
  if (levelTimer) {
    clearInterval(levelTimer);
    levelTimer = null;
  }
}

function hookStreamAnalyser(stream, kind) {
  try {
    if (!audioCtx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      audioCtx = new Ctx();
    }
    if (audioCtx.state === "suspended") {
      void audioCtx.resume();
    }
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 512;
    source.connect(analyser);
    // Do not connect to destination for local (echo). Remote plays via <audio>.

    if (kind === "local") {
      localAnalyser = analyser;
      localData = new Uint8Array(analyser.fftSize);
    } else {
      remoteAnalyser = analyser;
      remoteData = new Uint8Array(analyser.fftSize);
    }
    startLevelLoop();
  } catch {
    // Analyser optional
  }
}

function attachRemoteTrack(event) {
  const track = event.track;
  const stream =
    (event.streams && event.streams[0]) ||
    remoteStream ||
    new MediaStream();

  if (!event.streams?.length) {
    stream.addTrack(track);
  }
  remoteStream = stream;

  const el = ensureAudioElement();
  el.srcObject = stream;
  el.muted = false;
  el.volume = 1;
  void el.play().catch(() => {
    // Autoplay may need a user gesture; accept/call click usually counts.
  });

  hookStreamAnalyser(stream, "remote");
}

async function ensurePeer({ iceServers, onLocalIce }) {
  if (pc) return pc;

  localStream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false,
  });
  hookStreamAnalyser(localStream, "local");

  pc = new RTCPeerConnection({
    iceServers:
      iceServers && iceServers.length ? iceServers : defaultIceServers(),
  });

  for (const track of localStream.getTracks()) {
    pc.addTrack(track, localStream);
  }

  pc.ontrack = attachRemoteTrack;

  pc.onicecandidate = (event) => {
    if (!event.candidate) return;
    onLocalIce({
      type: "ice",
      candidate: {
        candidate: event.candidate.candidate,
        sdpMLineIndex: event.candidate.sdpMLineIndex,
        sdpMid: event.candidate.sdpMid,
      },
    });
  };

  return pc;
}

async function flushPendingRemoteCandidates() {
  if (!pc || !remoteDescriptionSet) return;
  while (pendingRemoteCandidates.length) {
    const raw = pendingRemoteCandidates.shift();
    try {
      await pc.addIceCandidate(new RTCIceCandidate(raw));
    } catch {
      // ignore
    }
  }
}

export async function startAsCaller({ iceServers, onLocalIce }) {
  remoteDescriptionSet = false;
  pendingRemoteCandidates.length = 0;
  const peer = await ensurePeer({ iceServers, onLocalIce });
  const offer = await peer.createOffer();
  await peer.setLocalDescription(offer);
  return { type: offer.type, sdp: offer.sdp };
}

export async function answerAsCallee({ iceServers, remoteOffer, onLocalIce }) {
  remoteDescriptionSet = false;
  pendingRemoteCandidates.length = 0;
  const peer = await ensurePeer({ iceServers, onLocalIce });
  await peer.setRemoteDescription(new RTCSessionDescription(remoteOffer));
  remoteDescriptionSet = true;
  await flushPendingRemoteCandidates();
  const answer = await peer.createAnswer();
  await peer.setLocalDescription(answer);
  return { type: answer.type, sdp: answer.sdp };
}

export async function applyRemoteAnswer(answer) {
  if (!pc) return;
  await pc.setRemoteDescription(new RTCSessionDescription(answer));
  remoteDescriptionSet = true;
  await flushPendingRemoteCandidates();
}

export async function addRemoteIceCandidate(candidate) {
  if (!candidate) return;
  if (!pc || !remoteDescriptionSet) {
    pendingRemoteCandidates.push(candidate);
    return;
  }
  try {
    await pc.addIceCandidate(new RTCIceCandidate(candidate));
  } catch {
    // ignore
  }
}

export function setMuted(muted) {
  localStream?.getAudioTracks().forEach((track) => {
    track.enabled = !muted;
  });
}

/** Subscribe to { localLevel, remoteLevel, isLocalTalking, isRemoteTalking } */
export function subscribeAudioLevels(listener) {
  levelsListener = listener;
  startLevelLoop();
  return () => {
    if (levelsListener === listener) levelsListener = null;
  };
}

export function leaveVoiceChannel() {
  try {
    localStream?.getTracks().forEach((t) => t.stop());
    remoteStream?.getTracks().forEach((t) => t.stop());
    pc?.close();
  } catch {
    // ignore
  }
  if (remoteAudioEl) {
    try {
      remoteAudioEl.pause();
      remoteAudioEl.srcObject = null;
      remoteAudioEl.remove();
    } catch {
      // ignore
    }
    remoteAudioEl = null;
  }
  stopLevelLoop();
  try {
    audioCtx?.close();
  } catch {
    // ignore
  }
  audioCtx = null;
  localAnalyser = null;
  remoteAnalyser = null;
  localData = null;
  remoteData = null;
  localStream = null;
  remoteStream = null;
  pc = null;
  remoteDescriptionSet = false;
  pendingRemoteCandidates.length = 0;
}
