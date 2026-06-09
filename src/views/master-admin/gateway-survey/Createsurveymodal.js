import { useState, useEffect } from "react";
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CForm,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CAlert,
  CSpinner,
  CRow,
  CCol,
  CInputGroup,
  CInputGroupText,
} from "@coreui/react";
import axios from "axios";

const api = axios.create({
  baseURL: "/api/v1",
  withCredentials: true,
});

// ── Step indicator ────────────────────────────────────────────
function StepIndicator({ step }) {
  const steps = [
    { num: 1, label: "Details" },
    { num: 2, label: "Location" },
    { num: 3, label: "Confirm" },
  ];
  return (
    <div className="d-flex align-items-center justify-content-center gap-2 mb-4">
      {steps.map((s, i) => (
        <div key={s.num} className="d-flex align-items-center gap-2">
          <div className="d-flex flex-column align-items-center">
            <div
              className={`rounded-circle d-flex align-items-center justify-content-center fw-bold`}
              style={{
                width: 32,
                height: 32,
                fontSize: 13,
                background:
                  step > s.num
                    ? "#2dce89"
                    : step === s.num
                      ? "#3b82f6"
                      : "#1e293b",
                color: step >= s.num ? "#fff" : "#475569",
                border:
                  step === s.num
                    ? "2px solid #3b82f660"
                    : "2px solid transparent",
                transition: "all 0.3s",
              }}
            >
              {step > s.num ? "✓" : s.num}
            </div>
            <span
              style={{
                fontSize: 10,
                marginTop: 4,
                color: step === s.num ? "#e2e8f0" : "#475569",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              style={{
                width: 48,
                height: 2,
                marginBottom: 20,
                background: step > s.num ? "#2dce89" : "#1e293b",
                borderRadius: 99,
                transition: "background 0.4s",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Location card ─────────────────────────────────────────────
function LocationCard({ coords, accuracy }) {
  return (
    <div
      className="rounded-3 p-3 mt-3"
      style={{ background: "#0f172a", border: "1px solid #2dce8933" }}
    >
      <div className="d-flex align-items-center gap-2 mb-2">
        <span
          className="rounded-circle"
          style={{
            width: 8,
            height: 8,
            background: "#2dce89",
            display: "inline-block",
            boxShadow: "0 0 8px #2dce89",
          }}
        />
        <span
          style={{ color: "#2dce89", fontSize: 11, letterSpacing: "0.08em" }}
        >
          GPS ACQUIRED
        </span>
      </div>
      <div className="row g-2">
        {[
          { label: "Latitude", val: coords.latitude.toFixed(7) },
          { label: "Longitude", val: coords.longitude.toFixed(7) },
          { label: "Accuracy", val: `±${accuracy?.toFixed(0) ?? "—"} m` },
        ].map(({ label, val }) => (
          <div className="col-4" key={label}>
            <div
              style={{
                color: "#475569",
                fontSize: 10,
                marginBottom: 2,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              {label}
            </div>
            <div
              style={{
                color: "#e2e8f0",
                fontSize: 12,
                //  fontFamily: "monospace",
                fontWeight: 600,
              }}
            >
              {val}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Summary row ───────────────────────────────────────────────
function SummaryRow({ label, value, mono }) {
  return (
    <div
      className="d-flex justify-content-between align-items-center py-2"
      style={{ borderBottom: "1px solid #1e293b" }}
    >
      <span style={{ color: "#64748b", fontSize: 12 }}>{label}</span>
      <span
        style={{
          color: "#e2e8f0",
          fontSize: 13,
          //   fontFamily: mono ? "monospace" : "inherit",
          fontWeight: 500,
        }}
      >
        {value || "—"}
      </span>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
//  Main Modal
// ═════════════════════════════════════════════════════════════
export default function CreateSurveyModal({
  visible,
  onClose,
  onCreated,
  sites = [],
}) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    site_id: "",
    location_no: "",
    gateway_eui: "",
    gateway_name: "",
    gateway_type: "",
  });
  const [coords, setCoords] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [geoStatus, setGeoStatus] = useState("idle"); // idle | acquiring | acquired | error
  const [geoError, setGeoError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [formError, setFormError] = useState("");

  // Reset when modal opens
  useEffect(() => {
    if (visible) {
      setStep(1);
      setForm({
        site_id: "",
        location_no: "",
        gateway_eui: "",
        gateway_name: "",
        gateway_type: "",
      });
      setCoords(null);
      setAccuracy(null);
      setGeoStatus("idle");
      setGeoError("");
      setSubmitError("");
      setFormError("");
    }
  }, [visible]);

  // ── Step 1 → 2: validate form fields ───────────────────────
  const handleNext = () => {
    if (
      !form.site_id ||
      !form.location_no ||
      !form.gateway_eui ||
      !form.gateway_name ||
      !form.gateway_type
    ) {
      setFormError("All fields are required to proceed.");
      return;
    }
    setFormError("");
    setStep(2);
  };

  // ── Step 2: acquire GPS ─────────────────────────────────────
  const acquireLocation = () => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser.");
      setGeoStatus("error");
      return;
    }
    setGeoStatus("acquiring");
    setGeoError("");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        setAccuracy(pos.coords.accuracy);
        setGeoStatus("acquired");
      },
      (err) => {
        setGeoError(
          err.code === 1
            ? "Location access denied. Please allow location permission and try again."
            : err.code === 2
              ? "Location unavailable. Check your device GPS."
              : "Location request timed out. Please try again.",
        );
        setGeoStatus("error");
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 },
    );
  };

  // ── Step 3: submit ──────────────────────────────────────────
  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError("");
    try {
      const payload = {
        site_id: form.site_id,
        location_no: form.location_no,
        gateway_eui: form.gateway_eui,
        gateway_name: form.gateway_name,
        robot_no: form.robot_no,
        deveui: form.deveui,
        gateway_type: form.gateway_type,
        longitude: coords.longitude,
        latitude: coords.latitude,
      };
      const { data } = await api.post("/gateway-surveys", payload);
      onCreated?.(data.data);
      onClose();
    } catch (err) {
      setSubmitError(
        err.response?.data?.message ||
          "Failed to create survey. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleField = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  return (
    <>
      <style>{`
        .survey-modal .modal-content {
          background: linear-gradient(160deg, #141824 0%, #111827 100%) !important;
          border: 1px solid #1e293b !important;
          border-radius: 16px !important;
          color: #e2e8f0 !important;
        }
        .survey-modal .modal-header {
          border-bottom: 1px solid #1e293b !important;
          padding: 20px 24px !important;
        }
        .survey-modal .modal-footer {
          border-top: 1px solid #1e293b !important;
          padding: 16px 24px !important;
          background: transparent !important;
        }
        .survey-modal .modal-body { padding: 24px !important; }

        .dark-input {
          background: #1a1f2e !important;
          border: 1px solid #2d3748 !important;
          color: #e2e8f0 !important;
          border-radius: 8px !important;
          font-size: 13px !important;
          transition: border-color 0.2s, box-shadow 0.2s !important;
        }
        .dark-input:focus {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.12) !important;
          outline: none !important;
          background: #1a1f2e !important;
          color: #e2e8f0 !important;
        }
        .dark-input option { background: #1a1f2e; }
        .dark-input::placeholder { color: #374151 !important; }

        .dark-label {
          color: #64748b !important;
          font-size: 11px !important;
          letter-spacing: 0.07em !important;
          text-transform: uppercase !important;
          margin-bottom: 6px !important;
          font-weight: 500 !important;
        }

        .input-prefix {
          background: #1a1f2e !important;
          border: 1px solid #2d3748 !important;
          border-right: none !important;
          color: #475569 !important;
          font-size: 14px !important;
        }

        .btn-primary-dark {
          background: linear-gradient(135deg, #3b82f6, #2563eb) !important;
          border: none !important;
          border-radius: 8px !important;
          font-size: 13px !important;
          font-weight: 500 !important;
          padding: 8px 22px !important;
          transition: opacity 0.2s, transform 0.15s !important;
        }
        .btn-primary-dark:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }

        .btn-ghost-dark {
          background: #1e293b !important;
          border: 1px solid #2d3748 !important;
          color: #94a3b8 !important;
          border-radius: 8px !important;
          font-size: 13px !important;
          padding: 8px 22px !important;
          transition: background 0.2s !important;
        }
        .btn-ghost-dark:hover { background: #243044 !important; color: #e2e8f0 !important; }

        .gps-btn {
          border-radius: 10px !important;
          font-size: 14px !important;
          font-weight: 500 !important;
          padding: 12px 28px !important;
          transition: all 0.2s !important;
        }

        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin-slow 1.5s linear infinite; display: inline-block; }

        @keyframes ping {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        .gps-ring {
          position: absolute; inset: 0;
          border-radius: 50%;
          border: 2px solid #3b82f6;
          animation: ping 1.4s ease-out infinite;
        }
      `}</style>

      <CModal
        visible={visible}
        onClose={onClose}
        alignment="center"
        size="lg"
        className="survey-modal"
      >
        <CModalHeader>
          <div className="d-flex align-items-center gap-3 w-100">
            <div
              className="rounded-3 d-flex align-items-center justify-content-center"
              style={{
                width: 38,
                height: 38,
                background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
                fontSize: 18,
                flexShrink: 0,
              }}
            >
              🛰
            </div>
            <div>
              <CModalTitle
                style={{
                  color: "#f1f5f9",
                  fontSize: 16,
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                }}
              >
                New Gateway Survey
              </CModalTitle>
              <div
                style={{
                  color: "#475569",
                  fontSize: 11,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                Solar Robot Coverage · Step {step} of 3
              </div>
            </div>
          </div>
        </CModalHeader>

        <CModalBody>
          <StepIndicator step={step} />

          {/* ── STEP 1: Survey Details ── */}
          {step === 1 && (
            <CForm>
              {formError && (
                <CAlert
                  color="danger"
                  className="rounded-3 mb-3 py-2 px-3"
                  style={{
                    background: "#1a0a0a",
                    borderColor: "#f5365c44",
                    fontSize: 13,
                  }}
                >
                  {formError}
                </CAlert>
              )}

              <CRow className="g-3">
                {/* Site */}
                <CCol xs={12} md={6}>
                  <CFormLabel className="dark-label">Site</CFormLabel>
                  <CFormSelect
                    name="site_id"
                    className="dark-input"
                    value={form.site_id}
                    onChange={handleField}
                  >
                    <option value="">Select a site…</option>
                    {sites.map((s) => (
                      <option key={s._id} value={s.site_id}>
                        {s.name}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>

                {/* Location No */}
                <CCol xs={12} md={6}>
                  <CFormLabel className="dark-label">Location No</CFormLabel>
                  <CInputGroup>
                    <CInputGroupText className="input-prefix">
                      GW-
                    </CInputGroupText>
                    <CFormInput
                      name="location_no"
                      className="dark-input"
                      placeholder="LOC-001"
                      value={form.location_no}
                      onChange={handleField}
                      style={{ borderLeft: "none" }}
                    />
                  </CInputGroup>
                </CCol>

                {/* Gateway Name */}
                <CCol xs={12} md={6}>
                  <CFormLabel className="dark-label">Gateway Name</CFormLabel>
                  <CFormInput
                    name="gateway_name"
                    className="dark-input"
                    placeholder="e.g. North Field GW"
                    value={form.gateway_name}
                    onChange={handleField}
                  />
                </CCol>

                {/* Gateway EUI */}
                <CCol xs={12} md={6}>
                  <CFormLabel className="dark-label">Gateway EUI</CFormLabel>
                  <CFormInput
                    name="gateway_eui"
                    className="dark-input"
                    placeholder="e.g. A840411AEE400000"
                    value={form.gateway_eui}
                    onChange={handleField}
                    // style={{ fontFamily: "monospace" }}
                  />
                </CCol>
                {/* Gateway Type */}
                <CCol xs={12}>
                  <CFormLabel className="dark-label">Gateway Type</CFormLabel>
                  <CFormSelect
                    name="gateway_type"
                    className="dark-input"
                    value={form.gateway_type}
                    onChange={handleField}
                  >
                    <option value="">Select type…</option>
                    <option value="outdoor">Outdoor</option>
                    <option value="indoor">Indoor</option>
                    <option value="portable">Portable / Testing</option>
                  </CFormSelect>
                </CCol>
                {/* Gateway EUI */}
                <CCol xs={12} md={6}>
                  <CFormLabel className="dark-label">Robot No</CFormLabel>
                  <CFormInput
                    name="robot_no"
                    className="dark-input"
                    placeholder="e.g. RBT-001"
                    value={form.robot_no}
                    onChange={handleField}
                    // style={{ fontFamily: "monospace" }}
                  />
                </CCol>

                {/* Gateway EUI */}
                <CCol xs={12} md={6}>
                  <CFormLabel className="dark-label">Deveui</CFormLabel>
                  <CFormInput
                    name="deveui"
                    className="dark-input"
                    placeholder="e.g. A840411AEE400000"
                    value={form.deveui}
                    onChange={handleField}
                    // style={{ fontFamily: "monospace" }}
                  />
                </CCol>
              </CRow>
            </CForm>
          )}

          {/* ── STEP 2: GPS Location ── */}
          {step === 2 && (
            <div className="text-center">
              <div
                className="mx-auto mb-4 rounded-circle d-flex align-items-center justify-content-center position-relative"
                style={{
                  width: 100,
                  height: 100,
                  background:
                    geoStatus === "acquired"
                      ? "#0d2818"
                      : geoStatus === "error"
                        ? "#1a0a0a"
                        : "#0f172a",
                  border: `2px solid ${geoStatus === "acquired" ? "#2dce89" : geoStatus === "error" ? "#f5365c" : "#2d3748"}`,
                  fontSize: 42,
                  transition: "all 0.4s",
                }}
              >
                {geoStatus === "acquiring" && <div className="gps-ring" />}
                {geoStatus === "acquired"
                  ? "📍"
                  : geoStatus === "error"
                    ? "⚠️"
                    : "🗺️"}
              </div>

              <h6 style={{ color: "#f1f5f9", fontWeight: 600, fontSize: 15 }}>
                {geoStatus === "idle" && "Capture Your Current Location"}
                {geoStatus === "acquiring" && "Acquiring GPS Signal…"}
                {geoStatus === "acquired" && "Location Captured!"}
                {geoStatus === "error" && "Location Error"}
              </h6>

              <p
                style={{
                  color: "#475569",
                  fontSize: 13,
                  maxWidth: 380,
                  margin: "8px auto 0",
                }}
              >
                {geoStatus === "idle" &&
                  "Stand at the proposed gateway installation spot, then tap the button below to capture your precise GPS coordinates."}
                {geoStatus === "acquiring" &&
                  "Please hold still while we get a precise GPS fix from your device…"}
                {geoStatus === "acquired" &&
                  "GPS coordinates captured successfully. Proceed to review and submit."}
                {geoStatus === "error" && geoError}
              </p>

              {/* Acquired coordinates */}
              {geoStatus === "acquired" && coords && (
                <LocationCard coords={coords} accuracy={accuracy} />
              )}

              {/* CTA buttons */}
              <div className="mt-4 d-flex justify-content-center gap-2">
                {geoStatus !== "acquiring" && (
                  <CButton
                    color={geoStatus === "acquired" ? "secondary" : "primary"}
                    className="gps-btn btn-primary-dark"
                    onClick={acquireLocation}
                    style={{
                      background:
                        geoStatus === "acquired"
                          ? "linear-gradient(135deg,#1e293b,#243044)"
                          : undefined,
                    }}
                  >
                    {geoStatus === "acquired"
                      ? "📡 Re-capture"
                      : "📡 Get My Location"}
                  </CButton>
                )}
                {geoStatus === "acquiring" && (
                  <CButton
                    color="secondary"
                    className="gps-btn btn-ghost-dark"
                    disabled
                  >
                    <CSpinner size="sm" className="me-2" /> Locating…
                  </CButton>
                )}
              </div>
            </div>
          )}

          {/* ── STEP 3: Confirm ── */}
          {step === 3 && (
            <div>
              <div
                className="rounded-3 p-3 mb-3"
                style={{ background: "#0f172a", border: "1px solid #1e293b" }}
              >
                <div
                  style={{
                    color: "#64748b",
                    fontSize: 11,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    marginBottom: 12,
                  }}
                >
                  Survey Details
                </div>
                <SummaryRow
                  label="Site"
                  value={
                    sites.find((s) => s._id === form.site_id)?.name ||
                    form.site_id
                  }
                />
                <SummaryRow label="Location No" value={form.location_no} mono />
                <SummaryRow label="Gateway Name" value={form.gateway_name} />
                <SummaryRow label="Gateway EUI" value={form.gateway_eui} mono />
                <SummaryRow label="Gateway Type" value={form.gateway_type} />
              </div>

              <div
                className="rounded-3 p-3"
                style={{ background: "#0f172a", border: "1px solid #1e293b" }}
              >
                <div
                  style={{
                    color: "#64748b",
                    fontSize: 11,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    marginBottom: 12,
                  }}
                >
                  GPS Coordinates
                </div>
                <SummaryRow
                  label="Latitude"
                  value={coords?.latitude.toFixed(7)}
                  mono
                />
                <SummaryRow
                  label="Longitude"
                  value={coords?.longitude.toFixed(7)}
                  mono
                />
                <SummaryRow
                  label="Accuracy"
                  value={accuracy ? `±${accuracy.toFixed(0)} m` : "—"}
                  mono
                />
              </div>

              {submitError && (
                <CAlert
                  color="danger"
                  className="rounded-3 mt-3 py-2 px-3"
                  style={{
                    background: "#1a0a0a",
                    borderColor: "#f5365c44",
                    fontSize: 13,
                  }}
                >
                  {submitError}
                </CAlert>
              )}
            </div>
          )}
        </CModalBody>

        <CModalFooter>
          {/* Back */}
          {step > 1 && (
            <CButton
              className="btn-ghost-dark"
              onClick={() => setStep((s) => s - 1)}
              disabled={submitting}
            >
              ← Back
            </CButton>
          )}

          {/* Cancel */}
          <CButton
            className="btn-ghost-dark ms-auto"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </CButton>

          {/* Next / Submit */}
          {step === 1 && (
            <CButton className="btn-primary-dark" onClick={handleNext}>
              Next →
            </CButton>
          )}

          {step === 2 && (
            <CButton
              className="btn-primary-dark"
              disabled={geoStatus !== "acquired"}
              onClick={() => setStep(3)}
            >
              Review →
            </CButton>
          )}

          {step === 3 && (
            <CButton
              className="btn-primary-dark"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <CSpinner size="sm" className="me-2" />
                  Creating…
                </>
              ) : (
                "✓ Create Survey"
              )}
            </CButton>
          )}
        </CModalFooter>
      </CModal>
    </>
  );
}
