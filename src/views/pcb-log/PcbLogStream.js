import React, { useEffect, useRef, useState } from "react";
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CFormLabel,
  CRow,
} from "@coreui/react";
import socket from "../../components/Socket";

const MAX_LOG = 50000;
const ROBOT_NO = /^[A-Za-z0-9][A-Za-z0-9 ._/-]{0,63}$/;

function cleanRobotNo(value) {
  const id = String(value ?? "").trim();
  return ROBOT_NO.test(id) ? id : "";
}

export default function PcbLogStream({ robotNo: robotNoProp, embedded = false } = {}) {
  const [robotNo, setRobotNo] = useState(robotNoProp ? String(robotNoProp) : "");
  const [watching, setWatching] = useState("");
  const [status, setStatus] = useState("idle");
  const [log, setLog] = useState("");
  const [session, setSession] = useState(null);
  const watchingRef = useRef("");
  const logRef = useRef(null);

  useEffect(() => {
    const onChunk = (msg) => {
      if (!msg?.text || msg.robotNo !== watchingRef.current) return;
      setLog((prev) => (prev + msg.text).slice(-MAX_LOG));
      setStatus("live");
    };
    const onStatus = (msg) => {
      if (!msg?.robotNo || msg.robotNo !== watchingRef.current) return;
      setStatus(msg.status === "live" ? "live" : "stopped");
      setSession({
        robotNo: msg.robotNo,
        deveui: msg.deveui || "",
        loraNo: msg.loraNo || "",
        room: msg.room || `pcb-log:${msg.robotNo}`,
        user: msg.user || null,
      });
    };
    socket.on("pcb-log-chunk", onChunk);
    socket.on("pcb-log-status", onStatus);
    return () => {
      socket.off("pcb-log-chunk", onChunk);
      socket.off("pcb-log-status", onStatus);
    };
  }, []);

  useEffect(() => {
    if (!robotNoProp) return undefined;
    const next = cleanRobotNo(robotNoProp);
    if (!next) {
      setError("This robot number cannot be matched to the phone stream.");
      setStatus("idle");
      return undefined;
    }
    setRobotNo(next);
    setError("");
    setLog("");
    setSession(null);
    setStatus("waiting");
    setWatching(next);
    watchingRef.current = next;
    socket.emit("join_pcb_log", next);
    return () => {
      socket.emit("leave_pcb_log", next);
      if (watchingRef.current === next) watchingRef.current = "";
    };
  }, [robotNoProp]);

  useEffect(() => {
    if (robotNoProp) return undefined;
    return () => {
      if (watchingRef.current) socket.emit("leave_pcb_log", watchingRef.current);
    };
  }, [robotNoProp]);

  useEffect(() => {
    const node = logRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [log]);

  function watch(event) {
    event.preventDefault();
    const next = cleanRobotNo(robotNo);
    if (!next) {
      setError("Enter the robot number exactly as it is on the phone.");
      return;
    }
    setError("");
    if (watchingRef.current && watchingRef.current !== next) {
      socket.emit("leave_pcb_log", watchingRef.current);
    }
    setLog("");
    setSession(null);
    setStatus("waiting");
    setWatching(next);
    watchingRef.current = next;
    socket.emit("join_pcb_log", next);
  }

  function stopWatching() {
    if (watchingRef.current) socket.emit("leave_pcb_log", watchingRef.current);
    watchingRef.current = "";
    setWatching("");
    setStatus("idle");
  }

  const badge =
    status === "live"
      ? { color: "success", label: "Live" }
      : status === "waiting"
        ? { color: "warning", label: "Waiting" }
        : status === "stopped"
          ? { color: "secondary", label: "Stopped" }
          : { color: "secondary", label: "Not watching" };

  const statusLine = !watching
    ? ""
    : status === "live"
      ? `Live from the phone for ${watching}.`
      : status === "stopped"
        ? `The phone stopped reading ${watching}. The text stays here.`
        : `Waiting for the phone to send ${watching}.`;

  const userLine = session?.user
    ? [session.user.username, session.user.role, session.user.email].filter(Boolean).join(" · ")
    : "";

  const sessionHeader = session ? (
    <div
      className="rounded p-2 mb-2 small"
      style={{ border: "1px solid var(--cui-border-color)", background: "var(--cui-tertiary-bg)" }}
    >
      <div className="fw-semibold mb-1">
        {session.room} · {status === "live" ? "Live" : "Stopped"}
      </div>
      <div>Robot no {session.robotNo || "—"}</div>
      <div>DevEUI {session.deveui || "—"}</div>
      <div>LoRa no {session.loraNo || "—"}</div>
      <div>User {userLine || "—"}</div>
    </div>
  ) : null;

  const logView = (
    <>
      {error ? <p className="text-danger small mb-2">{error}</p> : null}
      {sessionHeader}
      {statusLine ? <p className="text-body-secondary small mb-2">{statusLine}</p> : null}
      <pre
        ref={logRef}
        style={{
          minHeight: embedded ? 180 : 280,
          maxHeight: embedded ? 360 : 520,
          overflow: "auto",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          fontFamily: "monospace",
          fontSize: 12,
          lineHeight: 1.45,
          padding: 12,
          borderRadius: 8,
          border: "1px solid var(--cui-border-color)",
          background: "var(--cui-tertiary-bg)",
          marginBottom: 0,
        }}
      >
        {log || "Log text appears here when the phone is reading this robot."}
      </pre>
    </>
  );

  if (embedded) {
    return (
      <div>
        <div className="d-flex justify-content-between align-items-center gap-2 mb-2">
          <CBadge color={badge.color}>{badge.label}</CBadge>
          <CButton
            type="button"
            color="secondary"
            variant="outline"
            size="sm"
            disabled={!log}
            onClick={() => setLog("")}
          >
            Clear
          </CButton>
        </div>
        <p className="text-body-secondary small">
          Same serial text the phone reads on the TX RX DTR lead. Start PCB log in the Android
          app with this robot number.
        </p>
        {logView}
      </div>
    );
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <span>PCB log</span>
            <CBadge color={badge.color}>{badge.label}</CBadge>
          </CCardHeader>
          <CCardBody>
            <p className="text-body-secondary">
              Plug the phone into the robot with the TX RX DTR lead and start PCB log in the
              Android app. This page shows the same text while that read is open. Lines from
              before you tap Watch are not kept.
            </p>
            <form onSubmit={watch} className="mb-3">
              <CFormLabel htmlFor="pcb-log-robot">Robot number</CFormLabel>
              <div className="d-flex flex-wrap gap-2">
                <CFormInput
                  id="pcb-log-robot"
                  value={robotNo}
                  onChange={(event) => setRobotNo(event.target.value)}
                  placeholder="ABD-2324694"
                  style={{ maxWidth: 280 }}
                />
                <CButton type="submit" color="primary">
                  Watch
                </CButton>
                <CButton
                  type="button"
                  color="secondary"
                  variant="outline"
                  disabled={!log}
                  onClick={() => setLog("")}
                >
                  Clear
                </CButton>
                <CButton
                  type="button"
                  color="secondary"
                  variant="outline"
                  disabled={!watching}
                  onClick={stopWatching}
                >
                  Stop watching
                </CButton>
              </div>
            </form>
            {logView}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
}
