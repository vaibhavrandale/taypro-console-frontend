import React, { useState, useCallback, useEffect, useReducer } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CForm,
  CFormLabel,
  CFormInput,
  CButton,
  CBadge,
  CSpinner,
  CAlert,
  CProgress,
} from "@coreui/react";
import { CIcon } from "@coreui/icons-react";
import {
  cilSend,
  cilCheck,
  cilReload,
  cilSave,
  cilSignalCellular4,
  cilLocationPin,
  cilDevices,
  cilListNumbered,
} from "@coreui/icons";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../../../components/LoadingSpinner";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_SURVEY_LOCATION_REQUEST":
      return { ...state, surveyFetchLoading: true };
    case "FETCH_SURVEY_LOCATION_SUCCESS":
      return { ...state, survey: action.payload, surveyFetchLoading: false };
    case "FETCH_SURVEY_LOCATION_FAIL":
      return {
        ...state,
        surveyFetchLoading: false,
        surveyFetchError: action.payload,
      };
    default:
      return state;
  }
};
const api = axios.create({
  baseURL: "/api/v1",
  withCredentials: true,
});

// ─── hardcoded downlink command ───────────────────────────────────────────────
const DOWNLINK_PAYLOAD = "63";

// ─── debug log polling config ─────────────────────────────────────────────────
const POLL_INTERVAL_MS = 3000; // how often to re-fetch debug logs
const POLL_TIMEOUT_MS = 60000; // give up after 60 s

// ─── helpers ──────────────────────────────────────────────────────────────────

function rssiQuality(rssi) {
  if (rssi > -80) return { label: "Excellent", color: "success" };
  if (rssi > -100) return { label: "Marginal", color: "warning" };
  return { label: "Poor", color: "danger" };
}

function snrQuality(snr) {
  if (snr > 5) return { label: "Good", color: "success" };
  if (snr > 0) return { label: "Weak", color: "warning" };
  return { label: "Poor", color: "danger" };
}

function rssiPercent(rssi) {
  return Math.max(0, Math.min(100, ((rssi + 120) / 80) * 100));
}

function snrPercent(snr) {
  return Math.max(0, Math.min(100, ((snr + 20) / 35) * 100));
}

const STEPS = [
  { id: 1, title: "Enter device info & capture location" },
  { id: 2, title: "Send downlink command" },
  { id: 3, title: "Wait for device uplink (debug log)" },
  { id: 4, title: "Submit reading" },
];

// ─── component ────────────────────────────────────────────────────────────────

export default function CreateRobotReading() {
  const { id } = useParams();

  const [{ survey, surveyFetchLoading, surveyFetchError }, dispatch] =
    useReducer(reducer, {
      survey: null,
      surveyFetchLoading: false,
      surveyFetchError: "",
    });

  const fetchSurveyLocation = useCallback(async () => {
    try {
      dispatch({ type: "FETCH_SURVEY_LOCATION_REQUEST" });
      const data = await axios.get(`/api/v1/gateway-surveys/${id}`, {
        // headers: { Authorization: `Bearer ${authtoken}` },
        withCredentials: true,
      });
      console.log(data.data.data);
      dispatch({
        type: "FETCH_SURVEY_LOCATION_SUCCESS",
        payload: data.data.data,
      });
    } catch (err) {
      dispatch({
        type: "FETCH_SURVEY_LOCATION_FAIL",
        payload: err.response?.data?.message || "Fetch failed",
      });
    }
  }, [id]);

  useEffect(() => {
    fetchSurveyLocation();
  }, [fetchSurveyLocation]);

  const [form, setForm] = useState({
    robot_no: "",
    deveui: "",
    longitude: "",
    latitude: "",
  });
  useEffect(() => {
    if (survey) {
      setForm((prev) => ({
        ...prev,
        robot_no: survey.robot_no ?? "",
        deveui: survey.deveui ?? "",
      }));
    }
  }, [survey]);
  // step: 1 | 2 | 3 | 4 | "done"
  const [step, setStep] = useState(1);
  const [sending, setSending] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [locLoading, setLocLoading] = useState(false);
  const [signal, setSignal] = useState(null); // { rssi, snr }
  const [alert, setAlert] = useState(null); // { color, msg }
  const navigate = useNavigate();
  // ── auto-capture geolocation on mount ─────────────────────────────────────
  useEffect(() => {
    if (!navigator.geolocation) return;
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((prev) => ({
          ...prev,
          longitude: pos.coords.longitude.toString(),
          latitude: pos.coords.latitude.toString(),
        }));
        setLocLoading(false);
      },
      (err) => {
        console.warn("Geolocation error:", err.message);
        setLocLoading(false);
        setAlert({
          color: "warning",
          msg: "Could not capture location automatically. Please enter coordinates manually.",
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  }, []);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // all required fields filled
  const allFieldsReady =
    form.robot_no.trim() &&
    form.deveui.trim() &&
    form.longitude.trim() &&
    form.latitude.trim();

  const canSend = allFieldsReady && step === 1;
  const canSubmit = signal && allFieldsReady && step === 4;

  // ── send downlink & poll debug logs ───────────────────────────────────────
  const handleSendDownlink = useCallback(async (deveui) => {
    // if (!canSend) return;
    setSending(true);
    setAlert(null);
    setStep(2);

    // record the exact moment we sent the command
    const sentAt = new Date();

    try {
      await api.post("/robots/send-mqtt-downlink", {
        deveui: deveui,
        payload: DOWNLINK_PAYLOAD,
      });

      setAlert({
        color: "info",
        msg: "Downlink sent. Watching debug logs for uplink…",
      });
      setStep(3);

      // ── poll /debug-logs/deveui/:deveui for a new log AFTER sentAt ───────
      await pollDebugLogs({
        deveui: deveui,
        sentAt,
        onData: (data) => {
          setSignal(data);
          setAlert({
            color: "success",
            msg: `Uplink received — RSSI: ${data.rssi} dBm, SNR: ${data.snr.toFixed(1)} dB`,
          });
          setStep(4);
        },
        onTimeout: () => {
          setAlert({
            color: "danger",
            msg: "Timed out waiting for device uplink. Check device and try again.",
          });
          setStep(1);
        },
      });
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Downlink failed.";
      setAlert({ color: "danger", msg });
      setStep(1);
    } finally {
      setSending(false);
    }
  }, []);

  // ── submit reading ────────────────────────────────────────────────────────
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!canSubmit) return;
      setSubmitting(true);
      setAlert(null);

      try {
        await api.put(`/gateway-surveys/${id}/robot-reading`, {
          robot_no: form.robot_no.trim(),
          deveui: form.deveui.trim(),
          longitude: parseFloat(form.longitude),
          latitude: parseFloat(form.latitude),
          rssi: signal.rssi,
          snr: signal.snr,
        });

        setAlert({
          color: "success",
          msg: "Reading saved and feasibility updated.",
        });
        setStep("done");
        navigate(
          `/master-admin/gateway-survey-dashboard/view-gateway-survey/${id}`,
        );
      } catch (err) {
        const msg =
          err.response?.data?.message || err.message || "Submit failed.";
        setAlert({ color: "danger", msg });
      } finally {
        setSubmitting(false);
      }
    },
    [canSubmit, form, signal, id],
  );

  // ── reset ─────────────────────────────────────────────────────────────────
  const handleReset = () => {
    setForm({ robot_no: "", deveui: "", longitude: "", latitude: "" });
    setStep(1);
    setSending(false);
    setSubmitting(false);
    setSignal(null);
    setAlert(null);
    // re-capture location
    setLocLoading(true);
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        setForm((prev) => ({
          ...prev,
          longitude: pos.coords.longitude.toString(),
          latitude: pos.coords.latitude.toString(),
        }));
        setLocLoading(false);
      },
      () => setLocLoading(false),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  };

  const rssiQ = signal ? rssiQuality(signal.rssi) : null;
  const snrQ = signal ? snrQuality(signal.snr) : null;

  return (
    <CRow className="justify-content-center">
      <CCol lg={10} xl={9}>
        {/* ── page header ──────────────────────────────────────────────── */}
        <div className="mb-4">
          <small className="text-medium-emphasis">
            surveys / gateway-survey-001 / <strong>robot readings</strong>
          </small>
          <h4 className="mt-1 mb-0">Add Robot Reading</h4>
          <p className="text-medium-emphasis small mt-1">
            Send a downlink command to the device and capture RSSI / SNR from
            the device's debug log.
          </p>
        </div>

        {/* ── alert ────────────────────────────────────────────────────── */}
        {alert && (
          <CAlert
            color={alert.color}
            dismissible
            onClose={() => setAlert(null)}
            className="mb-3"
          >
            {alert.msg}
          </CAlert>
        )}

        <CForm onSubmit={handleSubmit}>
          <CRow className="g-3">
            {/* ── device info ──────────────────────────────────────────── */}
            <CCol md={6}>
              <CCard className="h-100">
                <CCardHeader className="py-2 d-flex align-items-center gap-2">
                  <CIcon icon={cilDevices} size="sm" />
                  <strong className="small">Device Info</strong>
                </CCardHeader>
                <CCardBody>
                  {surveyFetchLoading ? (
                    <LoadingSpinner />
                  ) : surveyFetchError ? (
                    <CAlert color="danger">
                      Error loading survey: {surveyFetchError}
                    </CAlert>
                  ) : (
                    <>
                      <div className="mb-3">
                        <CFormLabel className="small fw-semibold">
                          Robot No <span className="text-danger">*</span>
                        </CFormLabel>
                        <CFormInput
                          readOnly
                          name="robot_no"
                          value={survey?.robot_no}
                          onChange={handleChange}
                          placeholder="e.g. R-042"
                          disabled={step !== 1}
                          className="font-monospace"
                        />
                      </div>

                      <div className="mb-3">
                        <CFormLabel className="small fw-semibold">
                          Device EUI <span className="text-danger">*</span>
                        </CFormLabel>
                        <CFormInput
                          readOnly
                          name="deveui"
                          value={survey?.deveui}
                          onChange={handleChange}
                          placeholder="e.g. A8404121E183C4B3"
                          disabled={step !== 1}
                          className="font-monospace"
                        />
                      </div>
                    </>
                  )}

                  {/* ── hardcoded send command button ───────────────────── */}
                  <div className="mt-4 pt-2 border-top">
                    <CFormLabel className="small fw-semibold d-block mb-1">
                      Downlink Command
                    </CFormLabel>
                    <code className="small text-medium-emphasis d-block mb-2">
                      payload: {DOWNLINK_PAYLOAD}
                    </code>
                    <CButton
                      color="success"
                      disabled={
                        sending || surveyFetchLoading || surveyFetchError
                      }
                      onClick={() =>
                        handleSendDownlink(survey?.deveui ?? form.deveui)
                      }
                      type="button"
                      className="w-100"
                    >
                      {sending ? (
                        <>
                          <CSpinner size="sm" className="me-1" /> Sending…
                        </>
                      ) : (
                        <>
                          <CIcon icon={cilSend} size="sm" className="me-1" />{" "}
                          Send Command
                        </>
                      )}
                    </CButton>
                  </div>
                </CCardBody>
              </CCard>
            </CCol>

            {/* ── coordinates (auto from geolocation) ──────────────────── */}
            <CCol md={6}>
              <CCard className="h-100">
                <CCardHeader className="py-2 d-flex align-items-center gap-2">
                  <CIcon icon={cilLocationPin} size="sm" />
                  <strong className="small">Coordinates</strong>
                  {locLoading && (
                    <CSpinner
                      size="sm"
                      className="ms-auto"
                      title="Acquiring location…"
                    />
                  )}
                  {!locLoading && form.latitude && form.longitude && (
                    <CBadge color="success" className="ms-auto">
                      GPS captured
                    </CBadge>
                  )}
                </CCardHeader>
                <CCardBody>
                  <CRow className="g-3">
                    <CCol xs={6}>
                      <CFormLabel className="small fw-semibold">
                        Longitude <span className="text-danger">*</span>
                      </CFormLabel>
                      <CFormInput
                        name="longitude"
                        value={form.longitude}
                        onChange={handleChange}
                        type="number"
                        step="any"
                        placeholder="103.8198"
                        className="font-monospace"
                      />
                    </CCol>
                    <CCol xs={6}>
                      <CFormLabel className="small fw-semibold">
                        Latitude <span className="text-danger">*</span>
                      </CFormLabel>
                      <CFormInput
                        name="latitude"
                        value={form.latitude}
                        onChange={handleChange}
                        type="number"
                        step="any"
                        placeholder="1.3521"
                        className="font-monospace"
                      />
                    </CCol>
                  </CRow>

                  {form.longitude && form.latitude && (
                    <p className="mt-2 mb-0 text-medium-emphasis font-monospace small">
                      ↳ {parseFloat(form.latitude).toFixed(6)},{" "}
                      {parseFloat(form.longitude).toFixed(6)}
                    </p>
                  )}

                  {!locLoading && !form.latitude && (
                    <p className="mt-3 text-medium-emphasis small mb-0">
                      Location not yet acquired. Allow browser location
                      permission or enter coordinates manually.
                    </p>
                  )}
                </CCardBody>
              </CCard>
            </CCol>

            {/* ── signal data ───────────────────────────────────────────── */}
            <CCol md={6}>
              <CCard className="h-100">
                <CCardHeader className="py-2 d-flex align-items-center gap-2">
                  <CIcon icon={cilSignalCellular4} size="sm" />
                  <strong className="small">Signal Data</strong>
                </CCardHeader>
                <CCardBody>
                  {!signal ? (
                    <div className="d-flex flex-column align-items-center justify-content-center py-4 text-medium-emphasis gap-2">
                      {step === 3 ? (
                        <>
                          <CSpinner color="primary" />
                          <small className="font-monospace">
                            polling debug logs for uplink…
                          </small>
                        </>
                      ) : (
                        <small className="font-monospace">
                          awaiting downlink command…
                        </small>
                      )}
                    </div>
                  ) : (
                    <CRow className="g-3">
                      {/* RSSI */}
                      <CCol xs={6}>
                        <div
                          className="text-medium-emphasis small text-uppercase mb-1"
                          style={{ letterSpacing: "0.06em" }}
                        >
                          RSSI
                        </div>
                        <div className="fs-4 fw-semibold font-monospace">
                          {signal.rssi}
                          <span className="text-medium-emphasis small ms-1">
                            dBm
                          </span>
                        </div>
                        <CProgress
                          value={rssiPercent(signal.rssi)}
                          color={rssiQ.color}
                          height={4}
                          className="mt-2"
                        />
                        <CBadge color={rssiQ.color} className="mt-1">
                          {rssiQ.label}
                        </CBadge>
                      </CCol>

                      {/* SNR */}
                      <CCol xs={6}>
                        <div
                          className="text-medium-emphasis small text-uppercase mb-1"
                          style={{ letterSpacing: "0.06em" }}
                        >
                          SNR
                        </div>
                        <div className="fs-4 fw-semibold font-monospace">
                          {signal.snr.toFixed(1)}
                          <span className="text-medium-emphasis small ms-1">
                            dB
                          </span>
                        </div>
                        <CProgress
                          value={snrPercent(signal.snr)}
                          color={snrQ.color}
                          height={4}
                          className="mt-2"
                        />
                        <CBadge color={snrQ.color} className="mt-1">
                          {snrQ.label}
                        </CBadge>
                      </CCol>
                    </CRow>
                  )}
                </CCardBody>
              </CCard>
            </CCol>

            {/* ── workflow steps ────────────────────────────────────────── */}
            <CCol md={6}>
              <CCard className="h-100">
                <CCardHeader className="py-2 d-flex align-items-center gap-2">
                  <CIcon icon={cilListNumbered} size="sm" />
                  <strong className="small">Workflow</strong>
                </CCardHeader>
                <CCardBody className="py-2">
                  {STEPS.map((s) => {
                    const isActive =
                      step === s.id || (step === "done" && s.id === 4);
                    const isDone =
                      (typeof step === "number" && step > s.id) ||
                      step === "done";
                    return (
                      <div
                        key={s.id}
                        className="d-flex align-items-start gap-2 py-2"
                        style={{
                          borderBottom:
                            s.id < 4
                              ? "1px solid var(--cui-border-color-translucent)"
                              : "none",
                        }}
                      >
                        <CBadge
                          color={
                            isDone
                              ? "success"
                              : isActive
                                ? "primary"
                                : "secondary"
                          }
                          shape="rounded-pill"
                          style={{ minWidth: 22, fontSize: 11 }}
                        >
                          {isDone ? "✓" : s.id}
                        </CBadge>
                        <span
                          className={`small ${
                            isActive
                              ? "fw-semibold"
                              : isDone
                                ? "text-success"
                                : "text-medium-emphasis"
                          }`}
                        >
                          {s.title}
                        </span>
                      </div>
                    );
                  })}
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>

          {/* ── actions — Save Reading only appears when everything is ready ── */}
          <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
            <CButton
              color="secondary"
              variant="outline"
              onClick={handleReset}
              type="button"
            >
              <CIcon icon={cilReload} size="sm" className="me-1" /> Reset
            </CButton>

            {/* Only render Save Reading once we have signal + all fields */}

            <CButton
              color="primary"
              type="submit"
              disabled={sending || !allFieldsReady}
            >
              {submitting ? (
                <>
                  <CSpinner size="sm" className="me-1" /> Saving…
                </>
              ) : step === "done" ? (
                <>
                  <CIcon icon={cilCheck} size="sm" className="me-1" /> Saved
                </>
              ) : (
                <>
                  <CIcon icon={cilSave} size="sm" className="me-1" /> Save
                  Reading
                </>
              )}
            </CButton>
          </div>
        </CForm>
      </CCol>
    </CRow>
  );
}

// ─── poll /debug-logs/deveui/:deveui until a log newer than sentAt appears ────
//
// Expected log entry shape (adjust field names to match your API):
//   { created_at: "2025-06-01T10:23:45Z", rssi: -87, snr: 4.2, ... }
//
// The function compares log timestamps against sentAt and returns the first
// entry that arrived AFTER the downlink was sent.
//
async function pollDebugLogs({ deveui, sentAt, onData, onTimeout }) {
  const deadline = Date.now() + POLL_TIMEOUT_MS;

  return new Promise((resolve) => {
    const tick = async () => {
      if (Date.now() > deadline) {
        onTimeout();
        resolve();
        return;
      }

      try {
        const data = await api.get(`/debuglogs/${deveui}/deveui`, {
          // headers: { Authorization: `Bearer ${authtoken}` },
          withCredentials: true,
        });
        console.log(data.data.data);
        const match = data.data?.data;
        if (match) {
          // Extract RSSI & SNR — adjust field names to your schema
          const rssi = match.rssi ?? match.signal_rssi ?? match.metadata?.rssi;
          const snr = match.snr ?? match.signal_snr ?? match.metadata?.snr;

          // if (rssi !== undefined && snr !== undefined) {
          //   onData({ rssi: Number(rssi), snr: Number(snr) });
          //   resolve();
          //   return;
          // }
          const logTime = new Date(match.createdAt ?? match.timestamp);
          if (rssi !== undefined && snr !== undefined && logTime > sentAt) {
            onData({ rssi: Number(rssi), snr: Number(snr) });
            resolve();
            return;
          }
        }
      } catch (err) {
        // Network hiccup — keep polling; don't abort
        console.warn("Debug log poll error:", err.message);
      }

      setTimeout(tick, POLL_INTERVAL_MS);
    };

    tick();
  });
}
