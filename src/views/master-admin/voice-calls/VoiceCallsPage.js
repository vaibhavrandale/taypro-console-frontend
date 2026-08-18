import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CRow,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import axios from "axios";
import { useSelector } from "react-redux";
import { BsTelephoneFill } from "react-icons/bs";
import toast from "react-hot-toast";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { useVoiceCall } from "../../../context/VoiceCallContext";
import socket from "../../../components/Socket";

const statusColor = {
  ringing: "warning",
  accepted: "info",
  ended: "success",
  rejected: "danger",
  missed: "secondary",
};

const fmtWhen = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};

const fmtDuration = (startedAt, endedAt) => {
  if (!startedAt || !endedAt) return "—";
  const ms = new Date(endedAt) - new Date(startedAt);
  if (Number.isNaN(ms) || ms < 0) return "—";
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
};

export default function VoiceCallsPage() {
  const userInfo = useSelector((state) => state.userInfo);
  const { startCall, phase, submitting } = useVoiceCall();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const onOnline = (users) => {
      setOnlineUsers(Array.isArray(users) ? users : []);
    };
    socket.on("updateOnlineUsers", onOnline);
    // Re-join so server broadcasts current online list
    if (userInfo?._id) {
      socket.emit("join", {
        _id: userInfo._id,
        username: userInfo.username,
        email: userInfo.email,
        profile_image: userInfo.profile_image,
      });
    }
    return () => {
      socket.off("updateOnlineUsers", onOnline);
    };
  }, [userInfo]);

  const isUserOnline = useCallback(
    (userId) =>
      onlineUsers.some(
        (u) => String(u.id) === String(userId) && (u.socketIds?.length || 0) > 0,
      ),
    [onlineUsers],
  );

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        "/api/v1/users/get-all-internal-users-without-pg",
        { withCredentials: true },
      );
      setUsers(Array.isArray(data?.data) ? data.data : []);
    } catch (err) {
      toast.error(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to load users",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const loadHistory = useCallback(async () => {
    setLoadingHistory(true);
    try {
      const { data } = await axios.get("/api/v1/calls", {
        withCredentials: true,
        params: { limit: 50 },
      });
      setHistory(Array.isArray(data?.data) ? data.data : []);
    } catch (err) {
      toast.error(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to load call history",
      );
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    void load();
    void loadHistory();
  }, [load, loadHistory]);

  useEffect(() => {
    if (phase === "idle") void loadHistory();
  }, [phase, loadHistory]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users
      .filter((u) => u._id !== userInfo?._id)
      .filter((u) => {
        if (!q) return true;
        return (
          (u.username || "").toLowerCase().includes(q) ||
          (u.email || "").toLowerCase().includes(q) ||
          (u.role || "").toLowerCase().includes(q) ||
          (u.department || "").toLowerCase().includes(q)
        );
      })
      .sort((a, b) =>
        String(a.username || "").localeCompare(String(b.username || "")),
      );
  }, [search, userInfo?._id, users]);

  const myId = String(userInfo?._id || "");

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex flex-wrap gap-2 justify-content-between align-items-center">
            <strong>Voice Calls</strong>
            <CFormInput
              style={{ maxWidth: 280 }}
              placeholder="Search users…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </CCardHeader>
          <CCardBody>
            <p className="text-muted small mb-3">
              Tap <strong>Call</strong> to start a 1:1 voice call. Offline app
              users can still be reached via push notification if they have the
              mobile app installed. Allow microphone access when the browser
              asks. During the call you will see mic / remote sound level bars.
            </p>
            {loading ? (
              <div className="text-center py-5">
                <LoadingSpinner />
              </div>
            ) : (
              <CTable hover responsive bordered align="middle">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>#</CTableHeaderCell>
                    <CTableHeaderCell>User</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Role</CTableHeaderCell>
                    <CTableHeaderCell>Department</CTableHeaderCell>
                    <CTableHeaderCell>Action</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {filtered.map((user, index) => {
                    const online = isUserOnline(user._id);
                    return (
                      <CTableRow key={user._id}>
                        <CTableDataCell>{index + 1}</CTableDataCell>
                        <CTableDataCell>
                          <div className="d-flex align-items-center gap-2">
                            {user.profile_image ? (
                              <img
                                src={user.profile_image}
                                alt=""
                                className="rounded-circle"
                                width={32}
                                height={32}
                                style={{ objectFit: "cover" }}
                              />
                            ) : null}
                            <div>
                              <div className="fw-semibold">{user.username}</div>
                              <small className="text-muted">{user.email}</small>
                            </div>
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={online ? "success" : "secondary"}>
                            {online ? "Online" : "Offline"}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge color="info">{user.role || "—"}</CBadge>
                        </CTableDataCell>
                        <CTableDataCell>
                          {user.department || "—"}
                        </CTableDataCell>
                        <CTableDataCell>
                          <CButton
                            color="success"
                            size="sm"
                            disabled={phase !== "idle" || submitting}
                            title={
                              online
                                ? "Start voice call"
                                : "User appears offline — will ring via push if they have the app"
                            }
                            onClick={() => void startCall(user._id)}
                          >
                            {submitting ? (
                              <CSpinner size="sm" />
                            ) : (
                              <>
                                <BsTelephoneFill className="me-1" /> Call
                              </>
                            )}
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    );
                  })}
                  {filtered.length === 0 ? (
                    <CTableRow>
                      <CTableDataCell colSpan={6} className="text-center">
                        No users found
                      </CTableDataCell>
                    </CTableRow>
                  ) : null}
                </CTableBody>
              </CTable>
            )}
          </CCardBody>
        </CCard>
      </CCol>

      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <strong>Call History</strong>
            <CButton
              color="secondary"
              size="sm"
              variant="outline"
              disabled={loadingHistory}
              onClick={() => void loadHistory()}
            >
              Refresh
            </CButton>
          </CCardHeader>
          <CCardBody>
            {loadingHistory ? (
              <div className="text-center py-4">
                <LoadingSpinner />
              </div>
            ) : (
              <CTable hover responsive bordered align="middle">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>#</CTableHeaderCell>
                    <CTableHeaderCell>Direction</CTableHeaderCell>
                    <CTableHeaderCell>With</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Started</CTableHeaderCell>
                    <CTableHeaderCell>Ended</CTableHeaderCell>
                    <CTableHeaderCell>Duration</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {history.map((call, index) => {
                    const outgoing = String(call.caller_id) === myId;
                    const other = outgoing
                      ? call.callee_snapshot
                      : call.caller_snapshot;
                    return (
                      <CTableRow key={call._id}>
                        <CTableDataCell>{index + 1}</CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={outgoing ? "primary" : "dark"}>
                            {outgoing ? "Outgoing" : "Incoming"}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="fw-semibold">
                            {other?.username || "—"}
                          </div>
                          <small className="text-muted">
                            {other?.email || ""}
                          </small>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge
                            color={statusColor[call.status] || "secondary"}
                          >
                            {call.status}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell>
                          {fmtWhen(call.started_at || call.createdAt)}
                        </CTableDataCell>
                        <CTableDataCell>
                          {fmtWhen(call.ended_at)}
                        </CTableDataCell>
                        <CTableDataCell>
                          {fmtDuration(call.started_at, call.ended_at)}
                        </CTableDataCell>
                      </CTableRow>
                    );
                  })}
                  {history.length === 0 ? (
                    <CTableRow>
                      <CTableDataCell colSpan={7} className="text-center">
                        No past calls yet
                      </CTableDataCell>
                    </CTableRow>
                  ) : null}
                </CTableBody>
              </CTable>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
}
