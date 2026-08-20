/**
 * Call UX tones via Web Audio (no asset files).
 * Incoming ring / outgoing ringback / mute click / disconnect.
 */

let audioCtx = null;
let ringTimer = null;
let ringMode = null; // "incoming" | "outgoing"

function ctx() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    audioCtx = new AC();
  }
  if (audioCtx.state === "suspended") {
    void audioCtx.resume();
  }
  return audioCtx;
}

function beep({ freq = 440, duration = 0.15, type = "sine", gain = 0.08, when = 0 }) {
  const c = ctx();
  if (!c) return;
  const t0 = c.currentTime + when;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(g);
  g.connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

function stopRingLoop() {
  if (ringTimer) {
    clearInterval(ringTimer);
    ringTimer = null;
  }
  ringMode = null;
}

function playIncomingBurst() {
  // Two-tone ring like a phone
  beep({ freq: 480, duration: 0.35, gain: 0.1 });
  beep({ freq: 620, duration: 0.35, gain: 0.1, when: 0.38 });
}

function playOutgoingBurst() {
  // Softer single ringback pulse
  beep({ freq: 425, duration: 0.4, gain: 0.07, type: "triangle" });
  beep({ freq: 425, duration: 0.4, gain: 0.07, type: "triangle", when: 0.5 });
}

export function startIncomingRingtone() {
  const c = ctx();
  if (!c) return;
  if (ringMode === "incoming") return;
  stopRingLoop();
  ringMode = "incoming";
  playIncomingBurst();
  ringTimer = setInterval(playIncomingBurst, 2200);
}

export function startOutgoingRingback() {
  const c = ctx();
  if (!c) return;
  if (ringMode === "outgoing") return;
  stopRingLoop();
  ringMode = "outgoing";
  playOutgoingBurst();
  ringTimer = setInterval(playOutgoingBurst, 3000);
}

export function stopRingtone() {
  stopRingLoop();
}

export function playMuteSound(isMuted) {
  // Mute = lower pitch, unmute = higher
  beep({
    freq: isMuted ? 280 : 520,
    duration: 0.1,
    gain: 0.06,
    type: "square",
  });
}

export function playDisconnectSound() {
  beep({ freq: 500, duration: 0.12, gain: 0.08 });
  beep({ freq: 320, duration: 0.18, gain: 0.08, when: 0.12 });
  beep({ freq: 180, duration: 0.22, gain: 0.07, when: 0.28 });
}

/** Call once after any user gesture so incoming ring can play later. */
export function unlockCallAudio() {
  const c = ctx();
  if (!c) return;
  // Tiny silent blip to unlock autoplay policies
  beep({ freq: 40, duration: 0.01, gain: 0.0001 });
}
