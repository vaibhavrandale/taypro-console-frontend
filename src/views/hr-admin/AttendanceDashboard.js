import axios from "axios";
import React, { useEffect, useMemo, useReducer, useState } from "react";
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import toast from "react-hot-toast";
import CIcon from "@coreui/icons-react";
import {
  cilCheckCircle,
  cilCloud,
  cilCreditCard,
  cilDevices,
  cilLan,
  cilWarning,
} from "@coreui/icons";
import LoadingSpinner from "../../components/LoadingSpinner";
import PaginateInput from "../../components/PaginateInput";
import socket from "../../components/Socket";

const API_BASE = "/api/v1/hr/attendance";

const formatHardwareId = (hardwareId) => {
  if (!hardwareId) return "-";
  const clean = String(hardwareId).replace(/[^a-f0-9]/gi, "");
  if (clean.length === 12) {
    return `HW-${clean.slice(0, 4).toUpperCase()}:${clean.slice(4, 8).toUpperCase()}:${clean.slice(8, 12).toUpperCase()}`;
  }
  return `HW-${String(hardwareId).toUpperCase()}`;
};

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_PUNCHES_REQUEST":
      return { ...state, loadingPunches: true, error: "" };
    case "FETCH_PUNCHES_SUCCESS":
      return {
        ...state,
        loadingPunches: false,
        punchesLoaded: true,
        punches: action.payload.data,
        totalPages: action.payload.totalPages,
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
        totalPunchCount: action.payload.totalPunchCount,
      };
    case "FETCH_PUNCHES_FAIL":
      return { ...state, loadingPunches: false, error: action.payload };
    case "FETCH_DEVICES_REQUEST":
      return { ...state, loadingDevices: true };
    case "FETCH_DEVICES_SUCCESS":
      return {
        ...state,
        loadingDevices: false,
        devicesLoaded: true,
        devices: action.payload,
      };
    case "FETCH_DEVICES_FAIL":
      return { ...state, loadingDevices: false };
    case "UPDATE_DEVICE_STATUS": {
      const exists = state.devices.some(
        (device) =>
          device.device_id === action.payload.device_id ||
          (action.payload.hardware_id &&
            device.hardware_id === action.payload.hardware_id),
      );

      if (!exists) {
        return {
          ...state,
          devices: [...state.devices, action.payload],
        };
      }

      return {
        ...state,
        devices: state.devices.map((device) =>
          device.device_id === action.payload.device_id ||
          (action.payload.hardware_id &&
            device.hardware_id === action.payload.hardware_id)
            ? { ...device, ...action.payload }
            : device,
        ),
      };
    }
    default:
      return state;
  }
};

const formatDeviceLogMessage = (message) =>
  String(message || "").replace(/^\[\d{2}:\d{2}:\d{2}\]\s*/, "");

const deviceLogMessageClass = (message) => {
  const text = formatDeviceLogMessage(message);
  if (text.includes("problem —")) return "text-danger";
  if (text.includes(" OK —") || text.startsWith("Ready —")) return "text-success";
  if (text.startsWith("WiFi setup —") || text.startsWith("HR settings")) return "text-warning";
  if (text.startsWith("Boot #")) return "text-info";
  return "text-light";
};

const SAAS_PANEL = {
  background: "rgba(255,255,255,0.03)",
  borderColor: "rgba(255,255,255,0.08)",
};

const timeAgo = (iso) => {
  if (!iso) return "Never";
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const SaasMetric = ({ label, value, hint, accent, icon }) => (
  <CCol sm={6} xl={3}>
    <div
      className="h-100 p-3 rounded-4 border"
      style={SAAS_PANEL}
    >
      <div className="d-flex justify-content-between align-items-start gap-2">
        <div>
          <div
            className="text-muted small text-uppercase mb-1"
            style={{ letterSpacing: "0.08em", fontSize: "0.7rem" }}
          >
            {label}
          </div>
          <div className="fs-3 fw-semibold" style={{ color: accent || "#fff" }}>
            {value}
          </div>
          {hint ? <div className="text-muted small mt-1">{hint}</div> : null}
        </div>
        {icon ? (
          <div
            className="rounded-3 p-2 d-flex align-items-center justify-content-center"
            style={{ background: `${accent}18`, color: accent, minWidth: 40 }}
          >
            <CIcon icon={icon} size="lg" />
          </div>
        ) : null}
      </div>
    </div>
  </CCol>
);

const DeviceFleetCard = ({ device, onEdit, onLogs, logsLoading }) => {
  const online = device.status === "online";
  return (
    <div
      className="h-100 p-3 rounded-4 border position-relative"
      style={{
        ...SAAS_PANEL,
        borderColor: online ? "rgba(46,184,92,0.35)" : SAAS_PANEL.borderColor,
      }}
    >
      <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
        <div className="min-w-0">
          <div className="fw-semibold text-truncate">
            {device.name || device.device_id}
          </div>
          <div className="text-muted small text-truncate">{device.device_id}</div>
        </div>
        <CBadge color={online ? "success" : "secondary"} className="text-uppercase">
          {device.status || "offline"}
        </CBadge>
      </div>

      <div className="font-monospace small text-muted mb-2">
        {formatHardwareId(device.hardware_id)}
      </div>

      <div className="d-flex flex-wrap gap-2 small text-muted mb-2">
        <span className="text-capitalize">{device.location || "—"}</span>
        <span>·</span>
        <span>{timeAgo(device.last_seen_at)}</span>
      </div>

      {device.wifi_ssid ? (
        <div className="small text-muted mb-2">
          <CIcon icon={cilLan} size="sm" className="me-1" />
          {device.wifi_ssid}
        </div>
      ) : null}

      <div className="d-flex flex-wrap gap-1 mb-3">
        {device.setup_status === "pending_setup" ? (
          <CBadge color="warning">Pending Setup</CBadge>
        ) : null}
        {device.config_pending ? (
          <CBadge color="info">Config Queued</CBadge>
        ) : null}
      </div>

      <div className="d-flex gap-2">
        <CButton color="warning" size="sm" variant="outline" onClick={onEdit}>
          Configure
        </CButton>
        <CButton
          color="info"
          size="sm"
          variant="ghost"
          onClick={onLogs}
          disabled={logsLoading}
        >
          Logs
        </CButton>
      </div>
    </div>
  );
};

const formatPunchType = (value) =>
  value ? String(value).replace(/_/g, " ").toUpperCase() : "-";

const AttendanceDashboard = () => {
  const [state, dispatch] = useReducer(reducer, {
    punches: [],
    devices: [],
    loadingPunches: false,
    loadingDevices: false,
    punchesLoaded: false,
    devicesLoaded: false,
    error: "",
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
    totalPunchCount: 0,
  });

  const {
    punches,
    devices,
    loadingPunches,
    loadingDevices,
    punchesLoaded,
    devicesLoaded,
    error,
    totalPages,
    hasNextPage,
    hasPrevPage,
    totalPunchCount,
  } = state;

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pageInput, setPageInput] = useState("");
  const [searchText, setSearchText] = useState("");
  const [liveTap, setLiveTap] = useState(null);
  const [deviceModal, setDeviceModal] = useState(false);
  const [editDeviceModal, setEditDeviceModal] = useState(false);
  const [creatingDevice, setCreatingDevice] = useState(false);
  const [updatingDevice, setUpdatingDevice] = useState(false);
  const [deviceForm, setDeviceForm] = useState({
    device_id: "",
    name: "",
    location: "office",
    wifi_ssid: "",
    wifi_password: "",
  });
  const [editDeviceForm, setEditDeviceForm] = useState({
    hardware_id: "",
    device_id: "",
    name: "",
    location: "office",
    wifi_ssid: "",
    wifi_password: "",
  });
  const [editingDeviceId, setEditingDeviceId] = useState("");
  const [createdDevice, setCreatedDevice] = useState(null);
  const [exportModal, setExportModal] = useState(false);
  const [exportingReport, setExportingReport] = useState(false);
  const [logsModal, setLogsModal] = useState(false);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [deviceLogs, setDeviceLogs] = useState([]);
  const [logDevice, setLogDevice] = useState(null);
  const [logSearch, setLogSearch] = useState("");
  const [exportForm, setExportForm] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const monthOptions = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const yearOptions = Array.from({ length: 6 }, (_, index) => {
    const year = new Date().getFullYear() - index;
    return { value: year, label: String(year) };
  });

  const fetchDevices = async () => {
    try {
      dispatch({ type: "FETCH_DEVICES_REQUEST" });
      const result = await axios.get(`${API_BASE}/devices/status`, {
        withCredentials: true,
      });
      dispatch({
        type: "FETCH_DEVICES_SUCCESS",
        payload: result.data.data || [],
      });
    } catch (err) {
      dispatch({ type: "FETCH_DEVICES_FAIL" });
      toast.error(
        err.response?.data?.message || "Failed to load attendance devices",
      );
    }
  };

  const fetchPunches = async (pageOverride = page) => {
    try {
      dispatch({ type: "FETCH_PUNCHES_REQUEST" });
      const payload = { pg: pageOverride, limit };
      if (searchText.trim()) payload.search = searchText.trim();

      const result = await axios.post(`${API_BASE}/punches/list`, payload, {
        withCredentials: true,
      });

      const total = Math.ceil(
        Number(result.data.total) / Number(result.data.limit),
      );

      dispatch({
        type: "FETCH_PUNCHES_SUCCESS",
        payload: {
          data: result.data.data,
          totalPages: total,
          hasNextPage: result.data.hasNextPage,
          hasPrevPage: result.data.hasPrevPage,
          totalPunchCount: Number(result.data.total) || 0,
        },
      });
    } catch (err) {
      dispatch({
        type: "FETCH_PUNCHES_FAIL",
        payload:
          err.response?.data?.message || "Failed to load attendance punches",
      });
    }
  };

  const fetchDeviceLogs = async (device) => {
    if (!device?.device_id) return;

    try {
      setLoadingLogs(true);
      const result = await axios.post(
        `${API_BASE}/devices/logs`,
        {
          device_id: device.device_id,
          pg: 1,
          limit: 200,
          search: logSearch.trim() || undefined,
        },
        { withCredentials: true },
      );

      setDeviceLogs(result.data.data || []);
      setLogDevice(device);
      setLogsModal(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load device logs");
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    fetchDevices();
    fetchPunches(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    socket.emit("attendance-join");

    const handleTap = (payload) => {
      setLiveTap(payload);
    };

    const handleDeviceStatus = (payload) => {
      if (payload?.device_id) {
        dispatch({ type: "UPDATE_DEVICE_STATUS", payload });
      }
    };

    const handleDeviceLog = (payload) => {
      if (!payload?.device_id || !payload?.lines?.length) return;
      if (logDevice?.device_id === payload.device_id && logsModal) {
        setDeviceLogs((prev) => [...payload.lines.reverse(), ...prev].slice(0, 300));
      }
    };

    socket.on("attendance-tap", handleTap);
    socket.on("attendance-device-status", handleDeviceStatus);
    socket.on("attendance-device-log", handleDeviceLog);

    return () => {
      socket.emit("attendance-leave");
      socket.off("attendance-tap", handleTap);
      socket.off("attendance-device-status", handleDeviceStatus);
      socket.off("attendance-device-log", handleDeviceLog);
    };
  }, [logDevice, logsModal]);

  const handlePageInputChange = (e) => setPageInput(e.target.value);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      if (punchesLoaded) fetchPunches(newPage);
    }
  };

  const handlePageInputSubmit = () => {
    const pageNumber = parseInt(pageInput, 10);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      handlePageChange(pageNumber);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchPunches(1);
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
    if (punchesLoaded) fetchPunches(1);
  };

  const handleCreateDevice = async () => {
    try {
      setCreatingDevice(true);
      const result = await axios.post(`${API_BASE}/devices`, deviceForm, {
        withCredentials: true,
      });
      toast.success(result.data.message || "Device created");
      setCreatedDevice(result.data.data);
      setDeviceModal(false);
      setDeviceForm({
        device_id: "",
        name: "",
        location: "office",
        wifi_ssid: "",
        wifi_password: "",
      });
      fetchDevices();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create device");
    } finally {
      setCreatingDevice(false);
    }
  };

  const openEditDeviceModal = (device) => {
    setEditingDeviceId(device.device_id);
    setEditDeviceForm({
      hardware_id: device.hardware_id || "",
      device_id: device.device_id || "",
      name: device.name || "",
      location: device.location || "office",
      wifi_ssid: device.wifi_ssid || "",
      wifi_password: "",
    });
    setEditDeviceModal(true);
  };

  const handleUpdateDevice = async () => {
    if (!editingDeviceId) return;

    try {
      setUpdatingDevice(true);
      const payload = {
        device_id: editDeviceForm.device_id.trim(),
        name: editDeviceForm.name.trim(),
        location: editDeviceForm.location,
        wifi_ssid: editDeviceForm.wifi_ssid.trim(),
      };

      if (editDeviceForm.wifi_password.trim()) {
        payload.wifi_password = editDeviceForm.wifi_password;
      }

      const result = await axios.put(
        `${API_BASE}/devices/${editingDeviceId}`,
        payload,
        { withCredentials: true },
      );

      toast.success(
        result.data.message || "Device updated. Settings sent to device.",
      );
      setEditDeviceModal(false);
      setEditingDeviceId("");
      fetchDevices();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update device");
    } finally {
      setUpdatingDevice(false);
    }
  };

  const handleExportMonthlyReport = async () => {
    try {
      setExportingReport(true);
      toast.loading("Preparing monthly report...", { id: "hr-attendance-export" });

      const response = await axios.post(
        `${API_BASE}/export/monthly-report`,
        {
          month: Number(exportForm.month),
          year: Number(exportForm.year),
        },
        {
          withCredentials: true,
          responseType: "blob",
        },
      );

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      const monthLabel = monthOptions.find(
        (item) => item.value === Number(exportForm.month),
      )?.label;

      link.href = url;
      link.download = `Taypro_HR_Attendance_${monthLabel}_${exportForm.year}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Monthly report downloaded", { id: "hr-attendance-export" });
      setExportModal(false);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to export monthly report",
        { id: "hr-attendance-export" },
      );
    } finally {
      setExportingReport(false);
    }
  };

  const deviceStats = useMemo(() => {
    const online = devices.filter((d) => d.status === "online").length;
    const pending = devices.filter(
      (d) => d.setup_status === "pending_setup",
    ).length;
    const queued = devices.filter((d) => d.config_pending).length;
    const total = devices.length;
    return {
      total,
      online,
      offline: total - online,
      pending,
      queued,
      healthPct: total ? Math.round((online / total) * 100) : 0,
    };
  }, [devices]);

  const recentActivity = useMemo(() => punches.slice(0, 8), [punches]);

  return (
    <div className="container-fluid py-3">
      <div
        className="rounded-4 p-4 mb-4 border position-relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, rgba(17,28,68,0.98) 0%, rgba(28,40,88,0.92) 45%, rgba(12,22,48,0.98) 100%)",
          borderColor: "rgba(0,212,255,0.2)",
        }}
      >
        <div
          className="position-absolute top-0 end-0 opacity-25"
          style={{
            width: 280,
            height: 280,
            background:
              "radial-gradient(circle, rgba(0,212,255,0.35) 0%, transparent 70%)",
            transform: "translate(30%, -30%)",
          }}
        />
        <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 position-relative">
          <div>
            <div className="d-flex align-items-center gap-2 flex-wrap mb-2">
              <CBadge
                color="info"
                className="px-2 py-1 text-uppercase"
                style={{ letterSpacing: "0.1em", fontSize: "0.65rem" }}
              >
                SaaS Fleet
              </CBadge>
              <span className="d-inline-flex align-items-center gap-2 small text-success">
                <span
                  className="rounded-circle d-inline-block"
                  style={{
                    width: 8,
                    height: 8,
                    background: "#2eb85c",
                    boxShadow: "0 0 0 4px rgba(46,184,92,0.25)",
                  }}
                />
                Live monitoring
              </span>
            </div>
            <h3 className="mb-2 fw-semibold">Taypro Attendance</h3>
            <p className="text-muted mb-0 small" style={{ maxWidth: 560 }}>
              Multi-site RFID fleet — devices auto-register on first boot.
              Configure WiFi, names, and locations from here; settings sync over
              MQTT to each unit.
            </p>
          </div>
          <div className="d-flex gap-2 flex-wrap align-items-center">
            <CButton
              color="light"
              variant="outline"
              size="sm"
              onClick={() => {
                fetchDevices();
                fetchPunches(page);
              }}
              disabled={loadingDevices || loadingPunches}
            >
              {loadingDevices || loadingPunches ? "Syncing..." : "Sync All"}
            </CButton>
            <CButton
              color="success"
              size="sm"
              onClick={() => setExportModal(true)}
            >
              Export Report
            </CButton>
            <CButton color="primary" size="sm" onClick={() => setDeviceModal(true)}>
              + Provision Device
            </CButton>
          </div>
        </div>
      </div>

      <CRow className="g-3 mb-4">
        <SaasMetric
          label="Fleet Online"
          value={`${deviceStats.online}/${deviceStats.total}`}
          hint={`${deviceStats.healthPct}% operational`}
          accent="#2eb85c"
          icon={cilCheckCircle}
        />
        <SaasMetric
          label="Registered Units"
          value={deviceStats.total}
          hint="Across all locations"
          accent="#00d4ff"
          icon={cilDevices}
        />
        <SaasMetric
          label="Needs Setup"
          value={deviceStats.pending}
          hint={
            deviceStats.queued
              ? `${deviceStats.queued} config push queued`
              : "Awaiting HR action"
          }
          accent="#f9b115"
          icon={cilWarning}
        />
        <SaasMetric
          label="Total Punches"
          value={punchesLoaded ? totalPunchCount.toLocaleString() : "—"}
          hint="Recorded in cloud"
          accent="#a371f7"
          icon={cilCreditCard}
        />
      </CRow>

      <CRow className="g-4 mb-4">
        <CCol xl={8}>
          <CCard className="border-0 shadow-sm h-100" style={SAAS_PANEL}>
            <CCardBody>
              <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
                <div>
                  <h5 className="mb-1">Device Fleet</h5>
                  <div className="text-muted small">
                    Each hardware ID is unique — like an IMEI. Tap a unit to
                    configure or view logs.
                  </div>
                </div>
                <CButton
                  color="light"
                  variant="outline"
                  size="sm"
                  onClick={fetchDevices}
                  disabled={loadingDevices}
                >
                  Refresh fleet
                </CButton>
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between small mb-1">
                  <span className="text-muted">Fleet health</span>
                  <span className="fw-semibold">{deviceStats.healthPct}%</span>
                </div>
                <div
                  className="rounded-pill overflow-hidden"
                  style={{ height: 6, background: "rgba(255,255,255,0.08)" }}
                >
                  <div
                    className="h-100 rounded-pill"
                    style={{
                      width: `${deviceStats.healthPct}%`,
                      background:
                        "linear-gradient(90deg, #2eb85c 0%, #00d4ff 100%)",
                      transition: "width 0.4s ease",
                    }}
                  />
                </div>
              </div>

              {loadingDevices ? (
                <LoadingSpinner />
              ) : devices.length > 0 ? (
                <CRow className="g-3">
                  {devices.map((device) => (
                    <CCol key={device._id || device.device_id} md={6}>
                      <DeviceFleetCard
                        device={device}
                        onEdit={() => openEditDeviceModal(device)}
                        onLogs={() => fetchDeviceLogs(device)}
                        logsLoading={loadingLogs}
                      />
                    </CCol>
                  ))}
                </CRow>
              ) : (
                <div
                  className="text-center text-muted py-5 rounded-4 border"
                  style={SAAS_PANEL}
                >
                  {devicesLoaded
                    ? "No devices in fleet yet — power on a unit to auto-register"
                    : "Loading fleet..."}
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>

        <CCol xl={4}>
          <CCard
            className="border-0 shadow-sm mb-4"
            style={{
              ...SAAS_PANEL,
              borderLeft: liveTap
                ? `3px solid ${liveTap.success ? "#2eb85c" : "#e55353"}`
                : "3px solid rgba(0,212,255,0.4)",
            }}
          >
            <CCardBody>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0 text-uppercase text-muted small">
                  Live Tap
                </h6>
                <CBadge color={liveTap?.success ? "success" : liveTap ? "danger" : "secondary"}>
                  {liveTap ? (liveTap.success ? "OK" : "Fail") : "Idle"}
                </CBadge>
              </div>
              {liveTap ? (
                <>
                  <div className="fs-4 fw-semibold mb-1">
                    {liveTap.employee_name || "Unknown card"}
                  </div>
                  <div className="text-muted small mb-3">
                    {liveTap.tapped_at
                      ? new Date(liveTap.tapped_at).toLocaleString()
                      : "—"}
                  </div>
                  <div className="d-flex flex-wrap gap-2 mb-2">
                    <CBadge color="info">{formatPunchType(liveTap.punch_type)}</CBadge>
                    <CBadge color="secondary">{liveTap.device_id}</CBadge>
                  </div>
                  <div className="font-monospace small text-muted">
                    {liveTap.card_id}
                  </div>
                </>
              ) : (
                <div className="text-muted py-4 text-center small">
                  Waiting for next RFID tap...
                </div>
              )}
            </CCardBody>
          </CCard>

          <CCard className="border-0 shadow-sm mb-4" style={SAAS_PANEL}>
            <CCardBody>
              <h6 className="mb-3 text-uppercase text-muted small">
                Recent Activity
              </h6>
              {recentActivity.length > 0 ? (
                <div className="d-flex flex-column gap-3">
                  {recentActivity.map((item) => (
                    <div
                      key={item._id}
                      className="pb-3 border-bottom"
                      style={{ borderColor: "rgba(255,255,255,0.06) !important" }}
                    >
                      <div className="d-flex justify-content-between gap-2">
                        <span className="fw-semibold small">
                          {item.employee_name}
                        </span>
                        <span className="text-muted small">
                          {timeAgo(item.tapped_at)}
                        </span>
                      </div>
                      <div className="small text-muted">
                        {formatPunchType(item.punch_type)} · {item.device_id}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-muted small">No recent punches loaded.</div>
              )}
            </CCardBody>
          </CCard>

          <CCard className="border-0 shadow-sm" style={SAAS_PANEL}>
            <CCardBody>
              <h6 className="mb-3 text-uppercase text-muted small">
                Cloud Services
              </h6>
              <div className="d-flex flex-column gap-3 small">
                <div className="d-flex align-items-center gap-2">
                  <CIcon icon={cilCloud} className="text-info" />
                  <div>
                    <div className="fw-semibold">MQTT Broker</div>
                    <div className="text-muted">Taps, heartbeat, config push</div>
                  </div>
                  <CBadge color="success" className="ms-auto">
                    Cloud
                  </CBadge>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <CIcon icon={cilLan} className="text-info" />
                  <div>
                    <div className="fw-semibold">REST API</div>
                    <div className="text-muted">Health check & HTTP fallback</div>
                  </div>
                  <CBadge color="info" className="ms-auto">
                    Separate
                  </CBadge>
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CCard className="border-0 shadow-sm" style={SAAS_PANEL}>
        <CCardBody>
          <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap gap-3">
            <div>
              <h5 className="mb-1">Attendance Log</h5>
              <div className="text-muted small">
                Searchable punch history across all sites and devices.
              </div>
            </div>
            <CButton
              color="light"
              variant="outline"
              size="sm"
              onClick={() => fetchPunches(page)}
              disabled={loadingPunches}
            >
              Refresh
            </CButton>
          </div>

          <CForm onSubmit={handleSearch} className="mb-4">
            <CRow className="g-2 align-items-end">
              <CCol md={5} lg={4}>
                <CFormLabel htmlFor="searchPunches" className="small text-muted">
                  Search
                </CFormLabel>
                <CFormInput
                  id="searchPunches"
                  placeholder="Employee, card, device..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </CCol>
              <CCol md="auto">
                <CButton color="primary" type="submit" disabled={loadingPunches}>
                  Search
                </CButton>
              </CCol>
            </CRow>
          </CForm>

          <div className="table-responsive rounded-4 border" style={SAAS_PANEL}>
            <CTable hover className="mb-0 align-middle">
              <CTableHead style={{ background: "rgba(255,255,255,0.04)" }}>
                <CTableRow>
                  <CTableHeaderCell className="text-center">#</CTableHeaderCell>
                  <CTableHeaderCell>Employee</CTableHeaderCell>
                  <CTableHeaderCell>Card</CTableHeaderCell>
                  <CTableHeaderCell>Device</CTableHeaderCell>
                  <CTableHeaderCell>Punch</CTableHeaderCell>
                  <CTableHeaderCell>Time</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Source</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {loadingPunches ? (
                  <CTableRow>
                    <CTableDataCell colSpan={7}>
                      <LoadingSpinner />
                    </CTableDataCell>
                  </CTableRow>
                ) : error ? (
                  <CTableRow>
                    <CTableDataCell colSpan={7} className="text-danger">
                      {error}
                    </CTableDataCell>
                  </CTableRow>
                ) : !punchesLoaded ? (
                  <CTableRow>
                    <CTableDataCell colSpan={7} className="text-center text-muted py-4">
                      Loading attendance log...
                    </CTableDataCell>
                  </CTableRow>
                ) : punches.length > 0 ? (
                  punches.map((item, index) => (
                    <CTableRow key={item._id}>
                      <CTableDataCell className="text-center text-muted">
                        {(page - 1) * limit + index + 1}
                      </CTableDataCell>
                      <CTableDataCell className="fw-semibold">
                        {item.employee_name}
                      </CTableDataCell>
                      <CTableDataCell className="font-monospace small">
                        {item.card_id}
                      </CTableDataCell>
                      <CTableDataCell>{item.device_id}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color="info">{formatPunchType(item.punch_type)}</CBadge>
                      </CTableDataCell>
                      <CTableDataCell className="small">
                        {new Date(item.tapped_at).toLocaleString()}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CBadge color="secondary">{item.source}</CBadge>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan={7} className="text-center text-muted py-4">
                      No punches found
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          </div>

          {punchesLoaded ? (
            <div className="mt-3">
              <PaginateInput
                page={page}
                totalPages={totalPages}
                hasNextPage={hasNextPage}
                hasPrevPage={hasPrevPage}
                pageInput={pageInput}
                handlePageInputChange={handlePageInputChange}
                handlePageChange={handlePageChange}
                handlePageInputSubmit={handlePageInputSubmit}
                limit={limit}
                handleLimitChange={handleLimitChange}
              />
            </div>
          ) : null}
        </CCardBody>
      </CCard>

      <CModal
        visible={deviceModal}
        onClose={() => setDeviceModal(false)}
        backdrop="static"
      >
        <CModalHeader>
          <CModalTitle>Add Attendance Device</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p className="text-muted small">
            Optional: pre-create before hardware ships. If you skip this, the
            device auto-registers on first power-on using its unique Hardware
            ID (like an IMEI).
          </p>
          <CForm>
            <CRow className="g-3">
              <CCol md={12}>
                <CFormLabel htmlFor="device_id">Device ID</CFormLabel>
                <CFormInput
                  id="device_id"
                  value={deviceForm.device_id}
                  onChange={(e) =>
                    setDeviceForm({ ...deviceForm, device_id: e.target.value })
                  }
                  placeholder="office-main-gate"
                />
              </CCol>
              <CCol md={12}>
                <CFormLabel htmlFor="device_name">Device Name</CFormLabel>
                <CFormInput
                  id="device_name"
                  value={deviceForm.name}
                  onChange={(e) =>
                    setDeviceForm({ ...deviceForm, name: e.target.value })
                  }
                  placeholder="Office Main Gate"
                />
              </CCol>
              <CCol md={12}>
                <CFormLabel htmlFor="device_location">Location</CFormLabel>
                <CFormSelect
                  id="device_location"
                  value={deviceForm.location}
                  onChange={(e) =>
                    setDeviceForm({ ...deviceForm, location: e.target.value })
                  }
                >
                  <option value="office">Office</option>
                  <option value="factory">Factory</option>
                </CFormSelect>
              </CCol>
              <CCol md={12}>
                <CFormLabel htmlFor="device_wifi_ssid">WiFi Name (SSID)</CFormLabel>
                <CFormInput
                  id="device_wifi_ssid"
                  value={deviceForm.wifi_ssid}
                  onChange={(e) =>
                    setDeviceForm({ ...deviceForm, wifi_ssid: e.target.value })
                  }
                  placeholder="TAYPRO"
                />
              </CCol>
              <CCol md={12}>
                <CFormLabel htmlFor="device_wifi_password">WiFi Password</CFormLabel>
                <CFormInput
                  id="device_wifi_password"
                  type="password"
                  value={deviceForm.wifi_password}
                  onChange={(e) =>
                    setDeviceForm({
                      ...deviceForm,
                      wifi_password: e.target.value,
                    })
                  }
                  placeholder="WiFi password"
                />
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDeviceModal(false)}>
            Cancel
          </CButton>
          <CButton
            color="success"
            onClick={handleCreateDevice}
            disabled={creatingDevice}
          >
            {creatingDevice ? "Creating..." : "Create Device"}
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal
        visible={editDeviceModal}
        onClose={() => setEditDeviceModal(false)}
        backdrop="static"
      >
        <CModalHeader>
          <CModalTitle>Edit Device Settings</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p className="text-muted small">
            Changes are saved in the dashboard and sent to the device. If the
            device is offline, settings stay queued and apply automatically on
            next connection. The device restarts when new settings are received.
          </p>
          <CForm>
            <CRow className="g-3">
              <CCol md={12}>
                <CFormLabel htmlFor="edit_hardware_id">Hardware ID</CFormLabel>
                <CFormInput
                  id="edit_hardware_id"
                  value={
                    editDeviceForm.hardware_id
                      ? formatHardwareId(editDeviceForm.hardware_id)
                      : "Waiting for device to connect"
                  }
                  disabled
                />
              </CCol>
              <CCol md={12}>
                <CFormLabel htmlFor="edit_device_id">Device ID</CFormLabel>
                <CFormInput
                  id="edit_device_id"
                  value={editDeviceForm.device_id}
                  onChange={(e) =>
                    setEditDeviceForm({
                      ...editDeviceForm,
                      device_id: e.target.value,
                    })
                  }
                  placeholder="office-main-gate"
                />
              </CCol>
              <CCol md={12}>
                <CFormLabel htmlFor="edit_device_name">Device Name</CFormLabel>
                <CFormInput
                  id="edit_device_name"
                  value={editDeviceForm.name}
                  onChange={(e) =>
                    setEditDeviceForm({
                      ...editDeviceForm,
                      name: e.target.value,
                    })
                  }
                  placeholder="Office Main Gate"
                />
              </CCol>
              <CCol md={12}>
                <CFormLabel htmlFor="edit_device_location">Location</CFormLabel>
                <CFormSelect
                  id="edit_device_location"
                  value={editDeviceForm.location}
                  onChange={(e) =>
                    setEditDeviceForm({
                      ...editDeviceForm,
                      location: e.target.value,
                    })
                  }
                >
                  <option value="office">Office</option>
                  <option value="factory">Factory</option>
                </CFormSelect>
              </CCol>
              <CCol md={12}>
                <CFormLabel htmlFor="edit_wifi_ssid">WiFi Name (SSID)</CFormLabel>
                <CFormInput
                  id="edit_wifi_ssid"
                  value={editDeviceForm.wifi_ssid}
                  onChange={(e) =>
                    setEditDeviceForm({
                      ...editDeviceForm,
                      wifi_ssid: e.target.value,
                    })
                  }
                  placeholder="TAYPRO"
                />
              </CCol>
              <CCol md={12}>
                <CFormLabel htmlFor="edit_wifi_password">WiFi Password</CFormLabel>
                <CFormInput
                  id="edit_wifi_password"
                  type="password"
                  value={editDeviceForm.wifi_password}
                  onChange={(e) =>
                    setEditDeviceForm({
                      ...editDeviceForm,
                      wifi_password: e.target.value,
                    })
                  }
                  placeholder="Leave blank to keep current password"
                />
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setEditDeviceModal(false)}>
            Cancel
          </CButton>
          <CButton
            color="success"
            onClick={handleUpdateDevice}
            disabled={updatingDevice}
          >
            {updatingDevice ? "Saving..." : "Save & Push To Device"}
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal
        visible={Boolean(createdDevice)}
        onClose={() => setCreatedDevice(null)}
        backdrop="static"
      >
        <CModalHeader>
          <CModalTitle>Device Credentials</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {createdDevice ? (
            <>
              <p className="mb-2">
                Save these credentials on your ESP8266 / RFID device.
              </p>
              <p className="mb-1">
                <strong>Device ID:</strong> {createdDevice.device_id}
              </p>
              <p className="mb-1">
                <strong>Device Key:</strong> {createdDevice.api_key}
              </p>
            </>
          ) : null}
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={() => setCreatedDevice(null)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal
        visible={exportModal}
        onClose={() => setExportModal(false)}
        backdrop="static"
      >
        <CModalHeader>
          <CModalTitle>Export Monthly Attendance Report</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow className="g-3">
              <CCol md={6}>
                <CFormLabel htmlFor="export_month">Month</CFormLabel>
                <CFormSelect
                  id="export_month"
                  value={exportForm.month}
                  onChange={(e) =>
                    setExportForm({
                      ...exportForm,
                      month: Number(e.target.value),
                    })
                  }
                >
                  {monthOptions.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="export_year">Year</CFormLabel>
                <CFormSelect
                  id="export_year"
                  value={exportForm.year}
                  onChange={(e) =>
                    setExportForm({
                      ...exportForm,
                      year: Number(e.target.value),
                    })
                  }
                >
                  {yearOptions.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>
            <p className="text-muted small mt-3 mb-0">
              Sheet 1: report info. Sheet 2: location summary. Sheet 3: employee
              summary. Further sheets: day-wise detail per employee.
            </p>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setExportModal(false)}>
            Cancel
          </CButton>
          <CButton
            color="success"
            onClick={handleExportMonthlyReport}
            disabled={exportingReport}
          >
            {exportingReport ? "Exporting..." : "Download Excel"}
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal
        visible={logsModal}
        onClose={() => setLogsModal(false)}
        backdrop="static"
        size="xl"
      >
        <CModalHeader>
          <CModalTitle>
            Device Logs {logDevice ? `- ${logDevice.name || logDevice.device_id}` : ""}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow className="g-3 mb-3">
            <CCol md={8}>
              <CFormInput
                placeholder="Search log message..."
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
              />
            </CCol>
            <CCol md={4}>
              <CButton
                color="primary"
                onClick={() => fetchDeviceLogs(logDevice)}
                disabled={loadingLogs || !logDevice}
              >
                {loadingLogs ? "Loading..." : "Refresh"}
              </CButton>
            </CCol>
          </CRow>

          {loadingLogs ? (
            <LoadingSpinner />
          ) : (
            <div
              className="border rounded p-3"
              style={{
                maxHeight: "420px",
                overflowY: "auto",
                background: "#0b1220",
                fontFamily: "Consolas, monospace",
                fontSize: "12px",
                whiteSpace: "pre-wrap",
              }}
            >
              {deviceLogs.length > 0 ? (
                deviceLogs.map((entry) => (
                  <div key={entry._id} className="mb-2">
                    <span className="text-info">
                      {new Date(entry.logged_at).toLocaleString()}
                    </span>
                    {entry.boot_id ? (
                      <span className="text-warning"> · boot #{entry.boot_id}</span>
                    ) : null}
                    <div className={deviceLogMessageClass(entry.message)}>
                      {formatDeviceLogMessage(entry.message)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-muted">No logs found for this device.</div>
              )}
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setLogsModal(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default AttendanceDashboard;
