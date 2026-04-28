import { CAlert, CSpinner } from "@coreui/react";
import axios from "axios";
import React, {
  useCallback,
  useEffect,
  useRef,
  useReducer,
  useState,
} from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

/* ─── icons ─── */
const Icon = ({ d, size = 20, color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={d} />
  </svg>
);
const LocationIcon = () => (
  <Icon d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7zm0 4a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
);
const CameraIcon = () => (
  <Icon d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
);
const RetakeIcon = () => (
  <Icon d="M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15" />
);
const UploadIcon = () => (
  <Icon d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
);
const CheckIcon = () => <Icon d="M20 6L9 17l-5-5" size={16} color="#34d399" />;
const SpinIcon = () => (
  <svg
    width={18}
    height={18}
    viewBox="0 0 24 24"
    fill="none"
    stroke="#94a3b8"
    strokeWidth={2}
    strokeLinecap="round"
    style={{ animation: "spin 1s linear infinite" }}
  >
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
  </svg>
);

/* ─── reducer ─── */
const initialState = {
  submitting: false,
  submitError: "",
  uploading: false, // image uploading to cloudinary
  uploadError: "",
};
function reducer(state, { type, payload }) {
  switch (type) {
    case "UPLOAD_REQ":
      return { ...state, uploading: true, uploadError: "" };
    case "UPLOAD_OK":
      return { ...state, uploading: false };
    case "UPLOAD_ERR":
      return { ...state, uploading: false, uploadError: payload };
    case "SUBMIT_REQ":
      return { ...state, submitting: true, submitError: "" };
    case "SUBMIT_OK":
      return { ...state, submitting: false };
    case "SUBMIT_ERR":
      return { ...state, submitting: false, submitError: payload };
    default:
      return state;
  }
}

/* ─── helpers ─── */
const dataUrlToBlob = (dataUrl) => {
  const [header, b64] = dataUrl.split(",");
  const mime = header.match(/:(.*?);/)[1];
  const bytes = atob(b64);
  const arr = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
  return new Blob([arr], { type: mime });
};

/* ─── component ─── */
const AddRobotLocation = () => {
  const authtoken = useSelector((s) => s.authtoken);
  const navigate = useNavigate();
  const { robot_no, site_id } = useParams();
  const [state, dispatch] = useReducer(reducer, initialState);

  /* GPS */
  const [coords, setCoords] = useState(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState("");
  const [map_url, setMap_url] = useState("");

  /* Camera */
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState("");

  /* Photo states */
  const [photoDataUrl, setPhotoDataUrl] = useState(null); // preview
  const [uploadedImageUrl, setUploadedImageUrl] = useState(""); // cloudinary URL

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  /* ── GPS ── */
  // const requestLocation = useCallback(() => {
  //   if (!navigator.geolocation) {
  //     setGpsError("Geolocation not supported.");
  //     return;
  //   }
  //   setGpsLoading(true);
  //   setGpsError("");
  //   navigator.geolocation.getCurrentPosition(
  //     ({ coords: c }) => {
  //       setCoords({ lat: c.latitude, lng: c.longitude });
  //       setGpsLoading(false);
  //     },
  //     (err) => {
  //       setGpsError(err.message || "Unable to get location.");
  //       setGpsLoading(false);
  //     },
  //     { enableHighAccuracy: true, timeout: 15000 },
  //   );
  // }, []);

  // ADD these state vars
  const [accuracy, setAccuracy] = useState(null);
  const watchIdRef = useRef(null);
  const ACCURACY_THRESHOLD = 20; // metres — stop once we're within 20m

  const stopWatch = useCallback(() => {
    if (watchIdRef.current != null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setGpsLoading(false);
  }, []);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGpsError("Geolocation not supported.");
      return;
    }
    // Clear any existing watch first
    stopWatch();

    setGpsLoading(true);
    setGpsError("");
    setCoords(null);
    setAccuracy(null);

    watchIdRef.current = navigator.geolocation.watchPosition(
      ({ coords: c }) => {
        setCoords({ lat: c.latitude, lng: c.longitude });
        setAccuracy(Math.round(c.accuracy));

        // Stop watching once accuracy is good enough
        if (c.accuracy <= ACCURACY_THRESHOLD) {
          stopWatch();
        }
      },
      (err) => {
        setGpsError(err.message || "Unable to get location.");
        stopWatch();
      },
      {
        enableHighAccuracy: true,
        timeout: 30000, // longer timeout for GPS lock
        maximumAge: 0, // ← CRITICAL: never use a cached position
      },
    );

    // navigator.geolocation.watchPosition(
    //   (pos) =>
    //     console.log({
    //       lat: pos.coords.latitude,
    //       lng: pos.coords.longitude,
    //       accuracy: pos.coords.accuracy, // metres
    //       source:
    //         pos.coords.accuracy < 30
    //           ? "GPS"
    //           : pos.coords.accuracy < 200
    //             ? "WiFi"
    //             : "IP",
    //     }),
    //   (err) => console.error(err.code, err.message),
    //   { enableHighAccuracy: true, maximumAge: 0 },
    // );
    // Safety: stop after 30s regardless
    setTimeout(() => {
      if (watchIdRef.current != null) stopWatch();
    }, 30000);
  }, [stopWatch]);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  /* ── upload to cloudinary ── */
  const uploadToCloudinary = useCallback(async (dataUrl) => {
    const blob = dataUrlToBlob(dataUrl);
    const form = new FormData();
    form.append("file", blob, "robot_location.jpg");

    dispatch({ type: "UPLOAD_REQ" });
    try {
      const { data } = await axios.post(
        "/api/v1/image-upload/user-images",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authtoken}`,
          },
        },
      );
      const url = data.url || data.secure_url || "";
      setUploadedImageUrl(url);
      dispatch({ type: "UPLOAD_OK" });
      toast.success("Image uploaded ✓");
      return url;
    } catch (err) {
      const msg = err.response?.data?.error || "Image upload failed";
      dispatch({ type: "UPLOAD_ERR", payload: msg });
      toast.error(msg);
      return "";
    }
  }, []);

  /* ── camera ── */
  const openCamera = useCallback(async () => {
    setCameraError("");
    setCameraOpen(true);
    const constraints = [
      {
        video: {
          facingMode: { exact: "environment" },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      },
      { video: true, audio: false },
    ];
    for (const c of constraints) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(c);
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        return;
      } catch {
        /* try next */
      }
    }
    setCameraError("Camera access denied. Use the upload option below.");
    setCameraOpen(false);
  }, []);
  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraOpen(false);
  }, []);

  // Add stopWatch to cleanup
  useEffect(
    () => () => {
      stopCamera();
      stopWatch();
    },
    [stopCamera, stopWatch],
  );

  /* ── CAPTURE → immediately upload ── */
  const capturePhoto = useCallback(async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);

    stopCamera(); // stop stream first
    setPhotoDataUrl(dataUrl); // show preview
    await uploadToCloudinary(dataUrl); // upload right away ✅
  }, [stopCamera, uploadToCloudinary]);

  const retake = useCallback(() => {
    setPhotoDataUrl(null);
    setUploadedImageUrl("");
    openCamera();
  }, [openCamera]);

  /* ── file upload fallback ── */
  const handleFileUpload = useCallback(
    async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const dataUrl = ev.target.result;
        setPhotoDataUrl(dataUrl);
        await uploadToCloudinary(dataUrl); // upload right away ✅
      };
      reader.readAsDataURL(file);
    },
    [uploadToCloudinary],
  );

  /* ── submit ── */
  const handleSubmit = async () => {
    if (!site_id) return toast.error("Site ID missing from URL.");
    if (!robot_no) return toast.error("Robot number missing from URL.");
    if (!coords) return toast.error("GPS location not acquired yet.");
    if (!photoDataUrl) return toast.error("Please capture or upload an image.");
    if (state.uploading)
      return toast.error("Image is still uploading, please wait.");

    dispatch({ type: "SUBMIT_REQ" });
    try {
      await axios.post(
        "/api/v1/robot-locations",
        {
          site_id,
          robot_no,
          latitude: coords.lat,
          longitude: coords.lng,
          image: uploadedImageUrl,
          map_url: map_url,
        },
        { headers: { Authorization: `Bearer ${authtoken}` } },
      );
      dispatch({ type: "SUBMIT_OK" });
      toast.success("Robot location created successfully!");
      navigate(-1);
    } catch (e) {
      const msg =
        e.response?.data?.message ||
        e.response?.data?.error ||
        "Submission failed";
      dispatch({ type: "SUBMIT_ERR", payload: msg });
      toast.error(msg);
    }
  };

  useEffect(() => () => stopCamera(), [stopCamera]);

  /* ── styles ── */
  const s = {
    page: {
      minHeight: "100vh",
      background: "linear-gradient(135deg,#0f172a 0%,#1e293b 50%,#0f2027 100%)",
      padding: "1.5rem 1rem 3rem",
      fontFamily: "'DM Sans','Segoe UI',sans-serif",
    },
    card: {
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "1.25rem",
      backdropFilter: "blur(12px)",
      padding: "1.75rem",
      maxWidth: 520,
      margin: "0 auto",
    },
    heading: {
      color: "#f1f5f9",
      fontSize: "1rem",
      fontWeight: 700,
      letterSpacing: "-0.02em",
      margin: 0,
    },
    sub: { color: "#64748b", fontSize: "0.8rem", marginTop: 4 },
    label: {
      color: "#94a3b8",
      fontSize: "0.75rem",
      fontWeight: 600,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      marginBottom: 6,
      display: "block",
    },
    section: { marginTop: "1.4rem" },
    gpsBox: {
      display: "flex",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 12,
      padding: "0.75rem 1rem",
      borderRadius: "0.6rem",
      border: "1px solid rgba(255,255,255,0.1)",
      background: coords ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.04)",
    },
    gpsText: {
      color: coords ? "#34d399" : "#94a3b8",
      fontSize: "0.85rem",
      flex: 1,
    },
    btnOutline: {
      background: "transparent",
      border: "1px solid rgba(255,255,255,0.2)",
      color: "#cbd5e1",
      padding: "0.5rem 1rem",
      borderRadius: "0.5rem",
      cursor: "pointer",
      fontSize: "0.8rem",
      whiteSpace: "nowrap",
    },
    cameraWrap: {
      position: "relative",
      borderRadius: "0.75rem",
      overflow: "hidden",
      background: "#000",
      aspectRatio: "4/3",
    },
    captureBtn: {
      position: "absolute",
      bottom: 16,
      left: "50%",
      transform: "translateX(-50%)",
      width: 64,
      height: 64,
      borderRadius: "50%",
      border: "4px solid #fff",
      background: "rgba(255,255,255,0.2)",
      cursor: "pointer",
      backdropFilter: "blur(4px)",
    },
    previewWrap: {
      borderRadius: "0.75rem",
      overflow: "hidden",
      position: "relative",
      aspectRatio: "4/3",
    },
    retakeBtn: {
      position: "absolute",
      top: 10,
      right: 10,
      background: "rgba(0,0,0,0.65)",
      border: "none",
      borderRadius: "0.5rem",
      color: "#fff",
      padding: "0.4rem 0.75rem",
      cursor: "pointer",
      fontSize: "0.8rem",
      display: "flex",
      alignItems: "center",
      gap: 6,
    },
    uploadOverlay: {
      position: "absolute",
      inset: 0,
      background: "rgba(0,0,0,0.55)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    },
    uploadBadge: {
      background: "rgba(59,130,246,0.25)",
      border: "1px solid rgba(59,130,246,0.5)",
      borderRadius: "999px",
      color: "#93c5fd",
      fontSize: "0.72rem",
      fontWeight: 600,
      padding: "0.2rem 0.65rem",
      display: "flex",
      alignItems: "center",
      gap: 5,
    },
    uploadSuccess: {
      background: "rgba(16,185,129,0.2)",
      border: "1px solid rgba(16,185,129,0.4)",
      borderRadius: "999px",
      color: "#34d399",
      fontSize: "0.72rem",
      fontWeight: 600,
      padding: "0.2rem 0.65rem",
      display: "flex",
      alignItems: "center",
      gap: 5,
    },
    divider: {
      textAlign: "center",
      color: "#475569",
      fontSize: "0.75rem",
      margin: "0.75rem 0",
    },
    uploadArea: {
      border: "2px dashed rgba(255,255,255,0.15)",
      borderRadius: "0.75rem",
      padding: "1.25rem",
      textAlign: "center",
      cursor: "pointer",
      background: "rgba(255,255,255,0.02)",
    },
    submitBtn: (disabled) => ({
      width: "100%",
      padding: "0.85rem",
      borderRadius: "0.75rem",
      background: disabled
        ? "rgba(100,116,139,0.3)"
        : "linear-gradient(135deg,#3b82f6,#6366f1)",
      border: "none",
      color: disabled ? "#64748b" : "#fff",
      fontWeight: 700,
      fontSize: "1rem",
      cursor: disabled ? "not-allowed" : "pointer",
      marginTop: "1.75rem",
      letterSpacing: "0.02em",
      transition: "all 0.2s",
    }),
    badge: (ok) => ({
      display: "inline-block",
      padding: "0.2rem 0.6rem",
      borderRadius: "999px",
      fontSize: "0.7rem",
      fontWeight: 600,
      marginLeft: 8,
      background: ok ? "rgba(16,185,129,0.2)" : "rgba(100,116,139,0.3)",
      color: ok ? "#34d399" : "#94a3b8",
    }),
  };

  const isSubmitDisabled = state.submitting || state.uploading;

  return (
    <div style={s.page}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <canvas ref={canvasRef} style={{ display: "none" }} />

      <div style={s.card}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: "0.6rem",
              background: "linear-gradient(135deg,#3b82f6,#6366f1)",
              display: "grid",
              placeItems: "center",
            }}
          >
            <LocationIcon />
          </div>
          <div>
            <h2 style={s.heading}>Set Robot Location — {robot_no}</h2>
            <p style={s.sub}>Capture GPS + photo · Site: {site_id}</p>
          </div>
        </div>

        {/* GPS */}
        <div style={s.section}>
          <label style={s.label}>GPS Coordinates</label>
          {/* <div style={s.gpsBox}>
            <div style={{ color: coords ? "#34d399" : "#64748b" }}>
              <LocationIcon />
            </div>
            <span style={s.gpsText}>
              {gpsLoading
                ? "Acquiring GPS…"
                : coords
                  ? `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`
                  : gpsError || "Location not acquired"}
            </span>
            <button
              style={s.btnOutline}
              onClick={requestLocation}
              disabled={gpsLoading}
            >
              {gpsLoading ? "…" : coords ? "Refresh" : "Get Location"}
            </button>
          </div> */}
          <div style={s.gpsBox}>
            <div style={{ color: coords ? "#34d399" : "#64748b" }}>
              <LocationIcon />
            </div>
            <span style={s.gpsText}>
              {gpsLoading && !coords
                ? "Acquiring GPS…"
                : coords
                  ? `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`
                  : gpsError || "Location not acquired"}
            </span>

            {/* accuracy badge — shown while watching */}
            {/* Show manual input if accuracy is bad */}
            {coords && accuracy > 50 && (
              <div
                style={{
                  marginTop: 10,
                  padding: "10px 12px",
                  background: "rgba(251,191,36,.08)",
                  border: "1px solid rgba(251,191,36,.3)",
                  borderRadius: "0.6rem",
                }}
              >
                <p
                  style={{
                    color: "#fbbf24",
                    fontSize: "0.75rem",
                    marginBottom: 8,
                  }}
                >
                  ⚠ Low accuracy ({accuracy}m).
                </p>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    type="number"
                    readOnly
                    step="any"
                    placeholder="Latitude"
                    defaultValue={coords.lat}
                    onChange={(e) =>
                      setCoords((c) => ({
                        ...c,
                        lat: parseFloat(e.target.value),
                      }))
                    }
                    style={{
                      flex: 1,
                      padding: "6px 10px",
                      borderRadius: "0.4rem",
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      color: "#f1f5f9",
                      fontSize: "0.82rem",
                    }}
                  />
                  <input
                    type="number"
                    readOnly
                    step="any"
                    placeholder="Longitude"
                    defaultValue={coords.lng}
                    onChange={(e) =>
                      setCoords((c) => ({
                        ...c,
                        lng: parseFloat(e.target.value),
                      }))
                    }
                    style={{
                      flex: 1,
                      padding: "6px 10px",
                      borderRadius: "0.4rem",
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      color: "#f1f5f9",
                      fontSize: "0.82rem",
                    }}
                  />
                </div>
              </div>
            )}

            <button
              style={s.btnOutline}
              onClick={requestLocation}
              disabled={gpsLoading}
            >
              {gpsLoading ? "Refining…" : coords ? "Refresh" : "Get Location"}
            </button>
          </div>
          {gpsError && !gpsLoading && (
            <p style={{ color: "#fb923c", fontSize: "0.78rem", marginTop: 6 }}>
              ⚠ {gpsError}
            </p>
          )}
        </div>

        {/* Camera / Photo */}
        <div style={s.section}>
          <label style={s.label}>
            Photo (back camera)
            <span style={s.badge(!!uploadedImageUrl)}>
              {uploadedImageUrl
                ? "uploaded ✓"
                : photoDataUrl
                  ? "uploading…"
                  : "required"}
            </span>
          </label>

          {cameraError && (
            <CAlert color="warning" className="py-2 px-3 small mb-2">
              {cameraError}
            </CAlert>
          )}

          {/* Live viewport */}
          {cameraOpen && !photoDataUrl && (
            <div style={s.cameraWrap}>
              <video
                ref={videoRef}
                playsInline
                muted
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  border: "2px solid rgba(255,255,255,0.15)",
                  borderRadius: "0.75rem",
                  pointerEvents: "none",
                }}
              />
              <button
                style={s.captureBtn}
                onClick={capturePhoto}
                title="Take photo"
              />
              <button
                onClick={stopCamera}
                style={{
                  position: "absolute",
                  top: 10,
                  left: 10,
                  background: "rgba(0,0,0,0.5)",
                  border: "none",
                  color: "#fff",
                  borderRadius: "0.4rem",
                  padding: "0.3rem 0.6rem",
                  cursor: "pointer",
                  fontSize: "0.75rem",
                }}
              >
                ✕ Cancel
              </button>
            </div>
          )}

          {/* Preview with upload status overlay */}
          {photoDataUrl && (
            <div style={s.previewWrap}>
              <img
                src={photoDataUrl}
                alt="captured"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />

              {/* uploading overlay */}
              {state.uploading && (
                <div style={s.uploadOverlay}>
                  <SpinIcon />
                  <span style={{ color: "#94a3b8", fontSize: "0.8rem" }}>
                    Uploading to cloud…
                  </span>
                </div>
              )}

              {/* status badge bottom-left */}
              {!state.uploading && (
                <div style={{ position: "absolute", bottom: 10, left: 10 }}>
                  {uploadedImageUrl ? (
                    <span style={s.uploadSuccess}>
                      <CheckIcon /> Uploaded to Cloudinary
                    </span>
                  ) : state.uploadError ? (
                    <span
                      style={{
                        ...s.uploadBadge,
                        color: "#fca5a5",
                        borderColor: "rgba(239,68,68,0.4)",
                      }}
                    >
                      ⚠ Upload failed
                    </span>
                  ) : null}
                </div>
              )}

              {/* retake (disabled while uploading) */}
              {!state.uploading && (
                <button style={s.retakeBtn} onClick={retake}>
                  <RetakeIcon /> Retake
                </button>
              )}
            </div>
          )}

          {/* Open camera button */}
          {!cameraOpen && !photoDataUrl && (
            <button
              onClick={openCamera}
              style={{
                ...s.btnOutline,
                width: "100%",
                padding: "0.85rem",
                borderRadius: "0.65rem",
                fontSize: "0.9rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
            >
              <CameraIcon /> Open Camera
            </button>
          )}

          {/* Upload fallback */}
          {/* {!cameraOpen && !photoDataUrl && (
            <>
              <p style={s.divider}>— or upload —</p>
              <div
                style={s.uploadArea}
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadIcon />
                <p
                  style={{
                    color: "#64748b",
                    fontSize: "0.82rem",
                    margin: "0.5rem 0 0",
                  }}
                >
                  Tap to pick a photo
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  style={{ display: "none" }}
                  onChange={handleFileUpload}
                />
              </div>
            </>
          )} */}

          {state.uploadError && !state.uploading && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 8,
              }}
            >
              <p style={{ color: "#f87171", fontSize: "0.78rem", margin: 0 }}>
                ⚠ {state.uploadError}
              </p>
              <button
                style={{
                  ...s.btnOutline,
                  fontSize: "0.75rem",
                  padding: "0.3rem 0.7rem",
                }}
                onClick={() => photoDataUrl && uploadToCloudinary(photoDataUrl)}
              >
                Retry upload
              </button>
            </div>
          )}
        </div>

        {/* Submit error */}
        {state.submitError && (
          <CAlert color="danger" className="mt-3 py-2 px-3 small">
            {state.submitError}
          </CAlert>
        )}

        <input
          type="string"
          placeholder="Paste Map URL"
          value={map_url}
          onChange={(e) => setMap_url(e.target.value)}
          style={{
            flex: 1,
            padding: "6px 10px",
            borderRadius: "0.4rem",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "#f1f5f9",
            width: "100%",
            marginTop: "1rem",
            fontSize: "0.82rem",
          }}
        />

        {/* Submit */}
        <button
          style={s.submitBtn(isSubmitDisabled)}
          onClick={handleSubmit}
          disabled={isSubmitDisabled || !coords || !uploadedImageUrl}
        >
          {state.submitting ? (
            <CSpinner size="sm" />
          ) : state.uploading ? (
            "Waiting for upload…"
          ) : (
            "Submit"
          )}
        </button>

        {/* Checklist */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 20,
            marginTop: "1rem",
          }}
        >
          {[
            { label: "Site", ok: !!site_id },
            { label: "Robot", ok: !!robot_no },
            { label: "GPS", ok: !!coords },
            { label: "Photo", ok: !!uploadedImageUrl },
          ].map(({ label, ok }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.1rem" }}>{ok ? "✅" : "⬜"}</div>
              <div
                style={{ color: "#64748b", fontSize: "0.68rem", marginTop: 2 }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddRobotLocation;
