// // SurveySignalMapModal.jsx
// import React, { useEffect, useRef } from "react";
// import {
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CBadge,
// } from "@coreui/react";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Circle,
//   Polyline,
//   useMap,
// } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";

// // ─── helpers ──────────────────────────────────────────────────────────────────

// function signalInfo(rssi) {
//   if (rssi > -90)
//     return {
//       color: "#22c55e",
//       label: "Strong",
//       badgeColor: "success",
//       radius: 18,
//       ringOpacity: 0.18,
//     };
//   if (rssi > -105)
//     return {
//       color: "#f59e0b",
//       label: "Decent",
//       badgeColor: "warning",
//       radius: 14,
//       ringOpacity: 0.18,
//     };
//   return {
//     color: "#ef4444",
//     label: "Weak",
//     badgeColor: "danger",
//     radius: 10,
//     ringOpacity: 0.18,
//   };
// }

// function snrLabel(snr) {
//   if (snr > 5) return "Clean";
//   if (snr > 0) return "Good";
//   if (snr > -15) return "LoRa zone";
//   return "Unreliable";
// }

// function feasibilityBadge(status) {
//   if (status === "feasible") return "success";
//   if (status === "marginal") return "warning";
//   if (status === "poor") return "warning";
//   if (status === "not_feasible") return "danger";
//   return "secondary";
// }

// function gatewayIcon() {
//   return L.divIcon({
//     className: "",
//     iconSize: [32, 32],
//     iconAnchor: [16, 16],
//     html: `<div style="width:32px;height:32px;border-radius:50%;background:#3b82f6;
//              border:3px solid #fff;display:flex;align-items:center;justify-content:center;
//              box-shadow:0 0 10px rgba(59,130,246,0.6);">
//              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
//                stroke="#fff" stroke-width="2.5">
//                <path d="M5 12.55a11 11 0 0 1 14.08 0"/>
//                <path d="M1.42 9a16 16 0 0 1 21.16 0"/>
//                <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
//                <line x1="12" y1="20" x2="12" y2="20"/>
//              </svg>
//            </div>`,
//   });
// }

// function readingIcon(rssi) {
//   const { color } = signalInfo(rssi);
//   return L.divIcon({
//     className: "",
//     iconSize: [20, 20],
//     iconAnchor: [10, 10],
//     html: `<div style="width:20px;height:20px;border-radius:50%;background:${color};
//              border:2px solid rgba(255,255,255,0.8);
//              box-shadow:0 0 6px rgba(0,0,0,0.5);"></div>`,
//   });
// }

// // Auto-fit map bounds
// function FitBounds({ positions }) {
//   const map = useMap();
//   useEffect(() => {
//     if (positions.length > 0) {
//       map.fitBounds(positions, { padding: [30, 30] });
//     }
//   }, [map, positions]);
//   return null;
// }

// // ─── component ────────────────────────────────────────────────────────────────

// const SurveySignalMapModal = ({ visible, onClose, survey }) => {
//   if (!survey) return null;

//   const {
//     gateway_name,
//     gateway_location,
//     gateway_eui,
//     robot_readings = [],
//     feasibility = {},
//   } = survey;

//   const gwCoords = gateway_location?.coordinates
//     ? [gateway_location.coordinates[1], gateway_location.coordinates[0]]
//     : null;

//   // Only plot readings that are geographically near the gateway (same site)
//   const localReadings = robot_readings.filter((r) => {
//     if (!gwCoords) return true;
//     const lat = r.location?.coordinates?.[1];
//     const lng = r.location?.coordinates?.[0];
//     return Math.abs(lat - gwCoords[0]) < 1 && Math.abs(lng - gwCoords[1]) < 1;
//   });

//   const allPositions = [
//     ...(gwCoords ? [gwCoords] : []),
//     ...localReadings.map((r) => [
//       r.location.coordinates[1],
//       r.location.coordinates[0],
//     ]),
//   ];

//   const fColor = feasibilityBadge(feasibility.status);
//   const rssiPct = (rssi) =>
//     Math.max(0, Math.min(100, ((rssi + 120) / 80) * 100));

//   return (
//     <CModal
//       visible={visible}
//       onClose={onClose}
//       size="lg"
//       alignment="center"
//       scrollable
//     >
//       <CModalHeader className="border-bottom py-2">
//         <div className="d-flex align-items-center gap-3 flex-wrap">
//           <CModalTitle className="fs-6 fw-semibold">
//             {gateway_name} — Signal map
//           </CModalTitle>
//           <CBadge color={fColor} shape="rounded-pill">
//             {feasibility.coverage_percent ?? 0}% coverage ·{" "}
//             {feasibility.status?.replace("_", " ")}
//           </CBadge>
//         </div>
//       </CModalHeader>

//       <CModalBody className="p-0">
//         {/* ── Map ── */}
//         <div style={{ height: 340, position: "relative" }}>
//           {gwCoords && (
//             <MapContainer
//               center={gwCoords}
//               zoom={18}
//               scrollWheelZoom={false}
//               zoomControl
//               style={{ height: "100%", width: "100%" }}
//             >
//               <TileLayer
//                 url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
//                 attribution="Tiles © Google"
//               />

//               <FitBounds positions={allPositions} />

//               {/* Gateway marker */}
//               <Marker position={gwCoords} icon={gatewayIcon()} />

//               {/* Robot reading markers */}
//               {robot_readings.map((r, i) => {
//                 const lat = r.location?.coordinates?.[1];
//                 const lng = r.location?.coordinates?.[0];
//                 if (!lat || !lng) return null;
//                 const info = signalInfo(r.rssi);
//                 const pos = [lat, lng];
//                 const isLocal = localReadings.includes(r);

//                 return (
//                   <React.Fragment key={r._id?.$oid ?? i}>
//                     <Marker position={pos} icon={readingIcon(r.rssi)} />
//                     <Circle
//                       center={pos}
//                       radius={info.radius}
//                       pathOptions={{
//                         color: info.color,
//                         fillColor: info.color,
//                         fillOpacity: info.ringOpacity,
//                         weight: 1,
//                       }}
//                     />
//                     {/* Dashed line from gateway to nearby readings */}
//                     {isLocal && gwCoords && (
//                       <Polyline
//                         positions={[gwCoords, pos]}
//                         pathOptions={{
//                           color: info.color,
//                           weight: 1.5,
//                           opacity: 0.5,
//                           dashArray: "5 5",
//                         }}
//                       />
//                     )}
//                   </React.Fragment>
//                 );
//               })}
//             </MapContainer>
//           )}

//           {/* Legend overlay */}
//           <div
//             style={{
//               position: "absolute",
//               bottom: 10,
//               left: 10,
//               zIndex: 1000,
//               background: "rgba(0,0,0,0.72)",
//               borderRadius: 8,
//               padding: "8px 12px",
//               display: "flex",
//               flexDirection: "column",
//               gap: 5,
//               pointerEvents: "none",
//             }}
//           >
//             <p
//               style={{
//                 margin: 0,
//                 color: "#fff",
//                 fontSize: 10,
//                 fontWeight: 600,
//                 letterSpacing: "0.06em",
//               }}
//             >
//               SIGNAL STRENGTH
//             </p>
//             {[
//               { color: "#22c55e", label: "Strong  (above −90 dBm)" },
//               { color: "#f59e0b", label: "Decent  (−90 to −105 dBm)" },
//               { color: "#ef4444", label: "Weak  (below −105 dBm)" },
//               {
//                 color: "#3b82f6",
//                 label: "Gateway location",
//                 border: "2px solid #fff",
//               },
//             ].map(({ color, label, border }) => (
//               <div
//                 key={label}
//                 style={{ display: "flex", alignItems: "center", gap: 6 }}
//               >
//                 <div
//                   style={{
//                     width: 10,
//                     height: 10,
//                     borderRadius: "50%",
//                     background: color,
//                     border: border ?? "none",
//                     flexShrink: 0,
//                   }}
//                 />
//                 <span style={{ color: "#ccc", fontSize: 11 }}>{label}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </CModalBody>
//     </CModal>
//   );
// };

// export default SurveySignalMapModal;

// SurveySignalMapModal.jsx
import React, { useEffect } from "react";
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CBadge,
} from "@coreui/react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  Polyline,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ─── helpers ──────────────────────────────────────────────────────────────────

function signalInfo(rssi) {
  if (rssi > -90)
    return {
      color: "#22c55e",
      label: "Strong",
      badgeColor: "success",
      ringRadius: 5,
      ringOpacity: 0.2,
    };
  if (rssi > -105)
    return {
      color: "#f59e0b",
      label: "Decent",
      badgeColor: "warning",
      ringRadius: 4,
      ringOpacity: 0.2,
    };
  return {
    color: "#ef4444",
    label: "Weak",
    badgeColor: "danger",
    ringRadius: 3,
    ringOpacity: 0.2,
  };
}

function snrInfo(snr) {
  if (snr > 5) return { label: "Clean", color: "#22c55e" };
  if (snr > 0) return { label: "Good", color: "#84cc16" };
  if (snr > -15) return { label: "LoRa zone", color: "#f59e0b" };
  return { label: "Unreliable", color: "#ef4444" };
}

function feasibilityBadge(status) {
  const map = {
    feasible: "success",
    marginal: "warning",
    poor: "warning",
    not_feasible: "danger",
  };
  return map[status] ?? "secondary";
}

function rssiPercent(rssi) {
  return Math.max(0, Math.min(100, ((rssi + 120) / 80) * 100));
}

function formatTime(val) {
  const d = new Date(val?.$date ?? val);
  if (isNaN(d)) return "—";
  return d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

// ─── custom icons ─────────────────────────────────────────────────────────────

function gatewayIcon() {
  return L.divIcon({
    className: "",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    html: `
      <div style="
        width:40px; height:40px; border-radius:50%;
        background:#3b82f6; border:3px solid #fff;
        display:flex; align-items:center; justify-content:center;
        box-shadow:0 0 0 4px rgba(59,130,246,0.3), 0 2px 8px rgba(0,0,0,0.4);
      ">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5">
          <path d="M5 12.55a11 11 0 0 1 14.08 0"/>
          <path d="M1.42 9a16 16 0 0 1 21.16 0"/>
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
          <line x1="12" y1="20" x2="12" y2="20"/>
        </svg>
      </div>`,
  });
}

function readingIcon(rssi, index) {
  const { color } = signalInfo(rssi);
  return L.divIcon({
    className: "",
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    html: `
      <div style="
        width:28px; height:28px; border-radius:50%;
        background:${color}; border:2.5px solid rgba(255,255,255,0.9);
        display:flex; align-items:center; justify-content:center;
        box-shadow:0 0 0 3px ${color}40, 0 2px 6px rgba(0,0,0,0.4);
        font-size:11px; font-weight:700; color:#fff;
      ">${index}</div>`,
  });
}

// ─── FitBounds ────────────────────────────────────────────────────────────────

function FitBounds({ positions }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length > 1) {
      map.fitBounds(positions, { padding: [50, 50] });
    } else if (positions.length === 1) {
      map.setView(positions[0], 18);
    }
  }, []);
  return null;
}

// ─── Popup card ───────────────────────────────────────────────────────────────

function ReadingPopup({ reading, index }) {
  const rssi = reading.rssi;
  const snr = reading.snr;
  const si = signalInfo(rssi);
  const sni = snrInfo(snr);
  const pct = rssiPercent(rssi).toFixed(0);

  return (
    <Popup minWidth={220} maxWidth={260} className="signal-popup" closeButton>
      <div style={{ fontFamily: "system-ui, sans-serif", padding: "2px 0" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 10,
            paddingBottom: 8,
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: si.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 700,
              color: "#fff",
              flexShrink: 0,
            }}
          >
            {index}
          </div>
          <div>
            <p
              style={{
                margin: 0,
                fontWeight: 600,
                fontSize: 13,
                color: "#111",
              }}
            >
              Reading #{index}
            </p>
            <p style={{ margin: 0, fontSize: 11, color: "#6b7280" }}>
              {reading.robot_no}
            </p>
          </div>
        </div>

        {/* RSSI row */}
        <div style={{ marginBottom: 10 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 4,
            }}
          >
            <span
              style={{
                fontSize: 11,
                color: "#6b7280",
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              RSSI
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span
                style={{
                  fontFamily: "monospace",
                  fontWeight: 700,
                  fontSize: 14,
                  color: "#111",
                }}
              >
                {rssi} dBm
              </span>
              <span
                style={{
                  fontSize: 10,
                  padding: "2px 7px",
                  borderRadius: 999,
                  background: `${si.color}20`,
                  color: si.color,
                  fontWeight: 600,
                }}
              >
                {si.label}
              </span>
            </div>
          </div>
          <div
            style={{
              height: 5,
              background: "#f3f4f6",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${pct}%`,
                background: si.color,
                borderRadius: 3,
              }}
            />
          </div>
          <p style={{ margin: "3px 0 0", fontSize: 10, color: "#9ca3af" }}>
            Signal power in dBm — closer to 0 is stronger
          </p>
        </div>

        {/* SNR row */}
        <div style={{ marginBottom: 10 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 4,
            }}
          >
            <span
              style={{
                fontSize: 11,
                color: "#6b7280",
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              SNR
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span
                style={{
                  fontFamily: "monospace",
                  fontWeight: 700,
                  fontSize: 14,
                  color: "#111",
                }}
              >
                {snr} dB
              </span>
              <span
                style={{
                  fontSize: 10,
                  padding: "2px 7px",
                  borderRadius: 999,
                  background: `${sni.color}20`,
                  color: sni.color,
                  fontWeight: 600,
                }}
              >
                {sni.label}
              </span>
            </div>
          </div>
          <p style={{ margin: 0, fontSize: 10, color: "#9ca3af" }}>
            Signal clarity — positive values mean clear reception
          </p>
        </div>

        {/* Timestamp */}
        <div
          style={{
            paddingTop: 8,
            borderTop: "1px solid #f3f4f6",
            fontSize: 11,
            color: "#9ca3af",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#9ca3af"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          {formatTime(reading.captured_at)}
        </div>
      </div>
    </Popup>
  );
}

function GatewayPopup({ name, eui }) {
  return (
    <Popup minWidth={200} closeButton>
      <div style={{ fontFamily: "system-ui, sans-serif" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 8,
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "#3b82f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2.5"
            >
              <path d="M5 12.55a11 11 0 0 1 14.08 0" />
              <path d="M1.42 9a16 16 0 0 1 21.16 0" />
              <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
              <line x1="12" y1="20" x2="12" y2="20" />
            </svg>
          </div>
          <div>
            <p
              style={{
                margin: 0,
                fontWeight: 600,
                fontSize: 13,
                color: "#111",
              }}
            >
              Gateway
            </p>
            <p style={{ margin: 0, fontSize: 11, color: "#6b7280" }}>{name}</p>
          </div>
        </div>
        <p style={{ margin: 0, fontSize: 11, color: "#6b7280" }}>
          EUI:{" "}
          <span style={{ fontFamily: "monospace", color: "#374151" }}>
            {eui}
          </span>
        </p>
      </div>
    </Popup>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

const SurveySignalMapModal = ({ visible, onClose, survey }) => {
  if (!survey) return null;

  const {
    gateway_name,
    gateway_location,
    gateway_eui,
    robot_readings = [],
    feasibility = {},
  } = survey;

  const gwCoords = gateway_location?.coordinates
    ? [gateway_location.coordinates[1], gateway_location.coordinates[0]]
    : null;

  const localReadings = robot_readings.filter((r) => {
    if (!gwCoords) return true;
    const lat = r.location?.coordinates?.[1];
    const lng = r.location?.coordinates?.[0];
    return Math.abs(lat - gwCoords[0]) < 1 && Math.abs(lng - gwCoords[1]) < 1;
  });

  const allPositions = [
    ...(gwCoords ? [gwCoords] : []),
    ...localReadings.map((r) => [
      r.location.coordinates[1],
      r.location.coordinates[0],
    ]),
  ];

  const fColor = feasibilityBadge(feasibility.status);

  return (
    <>
      {/* Popup style override — white bg, no default leaflet chrome */}
      <style>{`
        .signal-popup .leaflet-popup-content-wrapper {
          border-radius: 10px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.18);
          padding: 0;
          border: 1px solid #e5e7eb;
        }
        .signal-popup .leaflet-popup-content {
          margin: 12px 14px;
        }
        .signal-popup .leaflet-popup-tip {
          background: #fff;
        }
      `}</style>

      <CModal
        visible={visible}
        onClose={onClose}
        size="xl"
        alignment="center"
        fullscreen="lg" /* full-screen on lg and below */
      >
        <CModalHeader
          className="py-2 px-3"
          style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}
        >
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <CModalTitle className="fs-6 fw-semibold mb-0">
              {gateway_name} — Signal map
            </CModalTitle>
            <CBadge color={fColor} shape="rounded-pill">
              {feasibility.coverage_percent ?? 0}% coverage &nbsp;·&nbsp;
              {feasibility.status?.replace("_", " ")}
            </CBadge>
            <CBadge color="secondary" shape="rounded-pill" className="ms-1">
              {robot_readings.length} readings
            </CBadge>
          </div>
        </CModalHeader>

        <CModalBody className="p-0" style={{ position: "relative" }}>
          {gwCoords ? (
            <MapContainer
              center={gwCoords}
              zoom={18}
              scrollWheelZoom
              zoomControl
              style={{
                // fills the modal body — CModal fullscreen handles the height
                height: "calc(100vh - 56px)",
                width: "100%",
              }}
            >
              <TileLayer
                url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                attribution="Tiles © Google"
              />

              <FitBounds positions={allPositions} />

              {/* ── Gateway marker ── */}
              <Marker position={gwCoords} icon={gatewayIcon()}>
                <GatewayPopup name={gateway_name} eui={gateway_eui} />
              </Marker>

              {/* ── Robot reading markers ── */}
              {robot_readings.map((r, i) => {
                const lat = r.location?.coordinates?.[1];
                const lng = r.location?.coordinates?.[0];
                if (!lat || !lng) return null;
                const info = signalInfo(r.rssi);
                const pos = [lat, lng];
                const isLocal = localReadings.includes(r);

                return (
                  <React.Fragment key={r._id?.$oid ?? i}>
                    {/* Coloured ring around the reading dot */}
                    <Circle
                      center={pos}
                      radius={info.ringRadius}
                      pathOptions={{
                        color: info.color,
                        fillColor: info.color,
                        fillOpacity: info.ringOpacity,
                        weight: 1,
                      }}
                    />

                    {/* Dashed line to gateway (only local readings) */}
                    {isLocal && (
                      <Polyline
                        positions={[gwCoords, pos]}
                        pathOptions={{
                          color: info.color,
                          weight: 1.5,
                          opacity: 0.55,
                          dashArray: "5 6",
                        }}
                      />
                    )}

                    {/* Numbered dot — click opens popup */}
                    <Marker position={pos} icon={readingIcon(r.rssi, i + 1)}>
                      <ReadingPopup reading={r} index={i + 1} />
                    </Marker>
                  </React.Fragment>
                );
              })}
            </MapContainer>
          ) : (
            <div className="d-flex align-items-center justify-content-center py-5 text-medium-emphasis">
              No gateway coordinates available.
            </div>
          )}

          {/* ── Legend overlay (bottom-left) ── */}
          <div
            style={{
              position: "absolute",
              bottom: 16,
              left: 16,
              zIndex: 1000,
              background: "rgba(15,15,15,0.78)",
              backdropFilter: "blur(4px)",
              borderRadius: 10,
              padding: "10px 14px",
              display: "flex",
              flexDirection: "column",
              gap: 6,
              pointerEvents: "none",
            }}
          >
            <p
              style={{
                margin: 0,
                color: "#fff",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.08em",
              }}
            >
              SIGNAL STRENGTH
            </p>
            {[
              { color: "#22c55e", label: "Strong  (above −90 dBm)" },
              { color: "#f59e0b", label: "Decent  (−90 to −105 dBm)" },
              { color: "#ef4444", label: "Weak  (below −105 dBm)" },
              { color: "#3b82f6", label: "Gateway", border: "2px solid #fff" },
            ].map(({ color, label, border }) => (
              <div
                key={label}
                style={{ display: "flex", alignItems: "center", gap: 7 }}
              >
                <div
                  style={{
                    width: 11,
                    height: 11,
                    borderRadius: "50%",
                    background: color,
                    border: border ?? "none",
                    flexShrink: 0,
                  }}
                />
                <span style={{ color: "#d1d5db", fontSize: 11 }}>{label}</span>
              </div>
            ))}
          </div>

          {/* ── Stats strip (top-right) ── */}
          <div
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              zIndex: 1000,
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            {[
              {
                label: "Avg RSSI",
                value: `${feasibility.avg_rssi ?? "—"} dBm`,
              },
              { label: "Avg SNR", value: `${feasibility.avg_snr ?? "—"} dB` },
            ].map(({ label, value }) => (
              <div
                key={label}
                style={{
                  background: "rgba(15,15,15,0.78)",
                  backdropFilter: "blur(4px)",
                  borderRadius: 8,
                  padding: "6px 12px",
                  textAlign: "right",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    color: "#9ca3af",
                    fontSize: 10,
                    fontWeight: 600,
                  }}
                >
                  {label}
                </p>
                <p
                  style={{
                    margin: 0,
                    color: "#fff",
                    fontFamily: "monospace",
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  {value}
                </p>
              </div>
            ))}
          </div>
        </CModalBody>
      </CModal>
    </>
  );
};

export default SurveySignalMapModal;
