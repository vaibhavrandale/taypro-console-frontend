import axios from "axios";
import { useEffect, useRef, useState, useCallback, useReducer } from "react";

/* ─── Leaflet lazy-loader (singleton) ──────────────────────── */
const loadLeaflet = (() => {
  let promise = null;
  return () => {
    if (promise) return promise;
    promise = new Promise((resolve, reject) => {
      if (window.L) return resolve(window.L);
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = () => resolve(window.L);
      script.onerror = reject;
      document.head.appendChild(script);
    });
    return promise;
  };
})();

/* ─── default tokens ────────────────────────────────────────── */
const DEFAULT_T = {
  surfaceHi: "#101936",
  border: "#2a3a60",
  cyan: "#22d3ee",
  textDim: "#8899bb",
  text: "#e2e8f0",
};

/* ─── safe layer remover ────────────────────────────────────── */
function safeRemoveLayers(list) {
  list.forEach((l) => {
    try {
      if (l?.remove) l.remove();
    } catch (_) {}
  });
}

/* ─── colour palette ─────────────────────────────────────────
   Gateway:  #00ffcc (online)  |  #ff4d4d (offline)
   Robot:    #facc15 (yellow)  — always distinct from gateways
   Link line: semi-transparent white
──────────────────────────────────────────────────────────── */
const CLR = {
  gwOnline: "#00ffcc",
  gwOffline: "#ff4d4d",
  robot: "#facc15",
  link: "rgba(255,255,255,0.35)",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_ROBOTS_REQUEST":
      return { ...state, loadingRobots: true };
    case "FETCH_ROBOTS_SUCCESS":
      return { ...state, loadingRobots: false, data: action.payload };
    case "FETCH_ROBOTS_FAIL":
      return { ...state, loadingRobots: false, errorRobots: action.payload };

    default:
      return state;
  }
};

/* ══════════════════════════════════════════════════════════════
   GatewayMap
══════════════════════════════════════════════════════════════ */
export default function GatewayMap({
  gateways = [],

  site_id,
  T: tokens,
  height = 360,
  radiusKm = 1,
}) {
  const [state, dispatch] = useReducer(reducer, {
    data: [],
    loadingRobots: false,
    errorRobots: "",
  });

  const { data, loadingRobots, errorRobots } = state;

  const T = { ...DEFAULT_T, ...tokens };

  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const layers = useRef([]);
  const isMounted = useRef(true);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(null);

  /* ── mount flag ─────────────────────────────────────────── */
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  /* ── fetch robot locations ──────────────────────────────── */
  const fetchRobots = useCallback(async () => {
    if (!site_id) return;
    try {
      dispatch({ type: "FETCH_ROBOTS_REQUEST" });
      const res = await axios.get(
        `/api/v1/robot-locations/only-locations/${site_id}`,
        {
          // headers: { Authorization: `Bearer ${authtoken}` },
          withCredentials: true,
        },
      );
      console.log(res.data.data);
      dispatch({ type: "FETCH_ROBOTS_SUCCESS", payload: res.data.data });
    } catch (e) {
      dispatch({
        type: "FETCH_ROBOTS_FAIL",
        payload: e.response?.data?.message || e.message,
      });
    }
  }, [site_id]);

  useEffect(() => {
    fetchRobots();
  }, [fetchRobots]);

  /* ── init Leaflet map ───────────────────────────────────── */
  useEffect(() => {
    loadLeaflet()
      .then((L) => {
        if (!isMounted.current || !mapRef.current || leafletMap.current) return;

        const first = gateways.find(
          (g) => g.gateway_lattitude && g.gateway_longitude,
        );
        const center = first
          ? [
              parseFloat(first.gateway_longitude),
              parseFloat(first.gateway_lattitude),
            ]
          : [20, 78];

        const map = L.map(mapRef.current, {
          center,
          zoom: 13,
          zoomControl: true,
          attributionControl: false,
        });

        L.tileLayer("https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", {
          maxZoom: 21,
        }).addTo(map);

        leafletMap.current = map;
        if (isMounted.current) setMapLoaded(true);
      })
      .catch(() => {
        if (isMounted.current) setMapError("Failed to load map library.");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── draw all layers (gateways + robots + links) ─────────── */
  useEffect(() => {
    if (!leafletMap.current || !mapLoaded || !isMounted.current) return;

    const L = window.L;
    const map = leafletMap.current;

    safeRemoveLayers(layers.current);
    layers.current = [];

    const bounds = [];

    /* ── build a lookup: lns_server_id → gateway coords ─── */
    const gwById = {}; // gateway_id_in_lns_server → { lat, lng, name, isOnline }
    const gwCoords = {}; // same key → [lat, lng] for polyline drawing

    /* ═══ GATEWAYS ═══════════════════════════════════════════ */
    gateways.forEach((gw) => {
      if (!isMounted.current || !leafletMap.current) return;

      const lat = parseFloat(gw.gateway_longitude); // field names are swapped in API
      const lng = parseFloat(gw.gateway_lattitude);
      if (isNaN(lat) || isNaN(lng)) return;

      const isOnline = gw.gateway_status;
      const color = isOnline ? CLR.gwOnline : CLR.gwOffline;
      const name = gw.gateway_name?.trim() || "Gateway";
      const lnsId = gw.gateway_id_in_lns_server;
      const totalRobots = gw.robot_count;
      const last_uplink = gw.last_uplink
        ? new Date(gw.last_uplink).toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
        : "—";

      if (lnsId) {
        gwById[lnsId] = { lat, lng, name, isOnline };
        gwCoords[lnsId] = [lat, lng];
      }

      /* pulsing dot marker */
      const iconHtml = `
        <div style="position:relative;width:28px;height:28px;">
          <div style="position:absolute;inset:0;border-radius:50%;
            background:${color};opacity:.3;animation:gwPulse 2s ease-out infinite;"></div>
          <div style="position:absolute;top:50%;left:50%;
            transform:translate(-50%,-50%);
            width:14px;height:14px;border-radius:50%;
            background:${color};border:2px solid #f6f6f6;
            box-shadow:0 0 10px ${color},0 0 20px ${color};"></div>
        </div>`;

      const icon = L.divIcon({
        html: iconHtml,
        className: "",
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -16],
      });

      const marker = L.marker([lat, lng], { icon }).addTo(map);

      // <span style="color:#8899bb">Lat:</span> ${lat.toFixed(5)}<br/>
      // <span style="color:#8899bb">Lng:</span> ${lng.toFixed(5)}<br/>
      marker.bindPopup(
        `<div style="font-family:monospace;font-size:12px;background:#0f172a;
          color:#e2e8f0;border:1px solid ${color};border-radius:6px;
          padding:8px 10px;min-width:170px;line-height:1.7;">
          <strong style="color:${color}">📡 ${name}</strong><br/>
          <span style="color:#8899bb">LNS ID:</span> ${lnsId ?? "—"}<br/>
          <span style="color:#8899bb">Connected Robots:</span> ${totalRobots}<br/>
          <span style="color:#8899bb">Status:</span>
          <span style="color:${color}">${isOnline ? "Online" : "Offline"}</span><br/>
           <span style="color:#8899bb">Open in map: </span>
           <span ><a href="https://www.google.com/maps?q=${lat},${lng}" target="blank">View</a> </span><br/>
           <span style="color:#8899bb">Last Uplink At:</span>
          <span style="color:${color}">${last_uplink}</span>
        </div>`,
        { closeButton: false, className: "gw-popup" },
      );

      //   marker.bindTooltip(name, {
      //     permanent: true,
      //     direction: "top",
      //     offset: [0, -16],
      //     className: "gw-label",
      //   });

      /* radius circle */
      const circle = L.circle([lat, lng], {
        radius: radiusKm * 1000,
        color,
        weight: 2.5,
        opacity: 1,
        fillColor: color,
        fillOpacity: 0.08,
        dashArray: "8 6",
      }).addTo(map);

      layers.current.push(marker, circle);
      bounds.push([lat, lng]);
    });
    const gatewayColors = [
      "rgba(240, 140, 25, 0.95)",
      "rgb(57, 214, 0)",
      "rgb(84, 126, 243)",
      "rgb(255, 242, 0)",
      "rgb(255, 0, 255)",
      "rgb(0, 255, 255)",
    ];

    /* create dynamic color map */
    const gatewayColorMap = {};

    Object.keys(gwById).forEach((gatewayId, index) => {
      gatewayColorMap[gatewayId] = gatewayColors[index % gatewayColors.length];
    });

    /* ═══ ROBOTS ════════════════════════════════════════════ */
    // ✅ NEW — flat object shape from updated API
    data.forEach((robot) => {
      // ← no destructuring
      if (!isMounted.current || !leafletMap.current) return;
      if (!robot) return;

      // const lat = parseFloat(robot.latitude);
      const lat = parseFloat(robot.location?.latitude);
      // const lng = parseFloat(robot.longitude);
      const lng = parseFloat(robot.location?.longitude);
      if (isNaN(lat) || isNaN(lng)) return;

      const robotNo = robot.robot_no?.trim() || "Robot";
      const block = robot.block || "—";
      const lastGw = robot.last_gateway ?? null; // field absent in new API
      const matchedGw = lastGw ? gwById[lastGw] : null;
      const gwName = matchedGw?.name ?? lastGw ?? "Unknown";
      const gwColor = matchedGw
        ? matchedGw.isOnline
          ? CLR.gwOnline
          : CLR.gwOffline
        : "#888";

      /* robot icon — yellow diamond/hexagon feel */
      const robotIconHtml = `
        <div style="position:relative;width:5px;height:5px;">
          <div style="position:absolute;inset:0;border-radius:4px;
            background:${CLR.robot};opacity:.25;
            animation:gwPulse 2.4s ease-out infinite;"></div>
          <div style="position:absolute;top:50%;left:50%;
            transform:translate(-50%,-50%) rotate(45deg);
            width:6px;height:6px;
            background:${CLR.robot};border:2px solid #fff;
            box-shadow:0 0 8px ${CLR.robot},0 0 16px ${CLR.robot};"></div>
        </div>`;

      const robotIcon = L.divIcon({
        html: robotIconHtml,
        className: "",
        iconSize: [6, 6],
        iconAnchor: [3, 3],
        popupAnchor: [0, -14],
      });

      const robotMarker = L.marker([lat, lng], { icon: robotIcon }).addTo(map);

      robotMarker.bindPopup(
        `<div style="font-family:monospace;font-size:12px;background:#0f172a;
          color:#e2e8f0;border:1px solid ${CLR.robot};border-radius:6px;
          padding:8px 10px;min-width:185px;line-height:1.7;">
          <strong style="color:${CLR.robot}">🤖 ${robotNo}</strong><br/>
          <span style="color:#8899bb">Block:</span> ${block}<br/>
          <span style="color:#8899bb">DevEUI:</span> ${robot?.deveui ?? "—"}<br/>
          <span style="color:#8899bb">LoRa No:</span> ${robot?.lora_no ?? "—"}<br/>
          <span style="color:#8899bb">Last Gateway:</span>
          <span style="color:${gwColor}">${gwName}</span><br/>
           <span style="color:#8899bb">Open in map: </span>
           <span ><a href="https://www.google.com/maps?q=${lat},${lng}" target="blank">View</a> </span>
        </div>`,
        { closeButton: false, className: "gw-popup" },
      );

      //   robotMarker.bindTooltip(robotNo, {
      //     permanent: true,
      //     direction: "top",
      //     offset: [0, -14],
      //     className: "robot-label",
      //   });

      layers.current.push(robotMarker);
      bounds.push([lat, lng]);
      const lineColor = gatewayColorMap[lastGw];
      /* ── link line: robot → matched gateway ────────────── */
      if (matchedGw && gwCoords[lastGw]) {
        const line = L.polyline([[lat, lng], gwCoords[lastGw]], {
          color: lineColor,
          weight: 1.5,
          opacity: 1,
          dashArray: "4 8",
        }).addTo(map);

        // small label at midpoint showing gateway name
        // const mid = [
        //   (lat + gwCoords[lastGw][0]) / 2,
        //   (lng + gwCoords[lastGw][1]) / 2,
        // ];
        // const midLabel = L.marker(mid, {
        //   icon: L.divIcon({
        //     html: `<div style="
        //       font-family:monospace;font-size:9px;
        //       background:rgba(10,18,40,.78);
        //       border:1px solid rgba(255,255,255,.18);
        //       border-radius:3px;padding:1px 5px;
        //       color:rgba(255,255,255,.6);white-space:nowrap;">
        //       ${matchedGw.isOnline ? "🟢" : "🔴"} ${gwName}
        //     </div>`,
        //     className: "",
        //     iconAnchor: [0, 0],
        //   }),
        //   interactive: false,
        // }).addTo(map);

        // layers.current.push(line, midLabel);
      }
    });

    if (!isMounted.current) return;

    if (bounds.length > 1) map.fitBounds(bounds, { padding: [52, 52] });
    else if (bounds.length === 1) map.setView(bounds[0], 14);
  }, [gateways, data, mapLoaded, radiusKm]);

  /* ── teardown ───────────────────────────────────────────── */
  useEffect(() => {
    return () => {
      safeRemoveLayers(layers.current);
      layers.current = [];
      const m = leafletMap.current;
      leafletMap.current = null;
      setTimeout(() => {
        try {
          if (m) m.remove();
        } catch (_) {}
      }, 0);
    };
  }, []);

  /* ══ render ═════════════════════════════════════════════ */
  return (
    <>
      <style>{`
        @keyframes gwPulse {
          0%   { transform:scale(1);   opacity:.3; }
          70%  { transform:scale(2.6); opacity:0;  }
          100% { transform:scale(1);   opacity:0;  }
        }
        @keyframes spin { to { transform:rotate(360deg); } }

        .gw-label {
          background:rgba(15,23,42,.88) !important;
          border:1px solid rgba(0,255,204,.3) !important;
          border-radius:4px !important;
          color:#e2e8f0 !important;
          font-family:monospace !important;
          font-size:11px !important;
          padding:2px 6px !important;
          white-space:nowrap !important;
          box-shadow:none !important;
        }
        .robot-label {
          background:rgba(15,23,42,.88) !important;
          border:1px solid rgba(250,204,21,.35) !important;
          border-radius:4px !important;
          color:#facc15 !important;
          font-family:monospace !important;
          font-size:11px !important;
          padding:2px 6px !important;
          white-space:nowrap !important;
          box-shadow:none !important;
        }
        .gw-label::before,
        .robot-label::before { display:none !important; }
        .gw-popup .leaflet-popup-content-wrapper {
          background:transparent !important;
          box-shadow:none !important;
          padding:0 !important;
        }
        .gw-popup .leaflet-popup-tip { display:none !important; }
        .leaflet-container { background:#0d1829; }
      `}</style>

      <div style={{ position: "relative", height, overflow: "hidden" }}>
        {/* map loading overlay */}
        {!mapLoaded && !mapError && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: T.surfaceHi,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              zIndex: 2,
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                border: `2px solid ${T.border}`,
                borderTop: `2px solid ${T.cyan}`,
                animation: "spin 1s linear infinite",
              }}
            />
            <span style={{ fontSize: 12, color: T.textDim }}>Loading map…</span>
          </div>
        )}

        {/* map error */}
        {mapError && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: T.surfaceHi,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2,
            }}
          >
            <span style={{ fontSize: 13, color: CLR.gwOffline }}>
              {mapError}
            </span>
          </div>
        )}

        {/* map canvas */}
        <div
          ref={mapRef}
          style={{ width: "100%", height: "100%", zIndex: 1 }}
        />

        {/* vignette */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "linear-gradient(to bottom,rgba(16,25,54,.28) 0%,transparent 18%,transparent 80%,rgba(16,25,54,.38) 100%)",
            zIndex: 3,
          }}
        />

        {/* robot fetch error badge */}
        {errorRobots && mapLoaded && (
          <div
            style={{
              position: "absolute",
              top: 10,
              left: 50,
              background: "rgba(255,77,77,.15)",
              border: "1px solid #ff4d4d",
              borderRadius: 4,
              padding: "3px 8px",
              zIndex: 5,
              fontSize: 11,
              color: "#ff4d4d",
              fontFamily: "monospace",
            }}
          >
            ⚠ {errorRobots}
          </div>
        )}

        {/* legend */}
        {mapLoaded && (
          <div
            style={{
              position: "absolute",
              bottom: 12,
              right: 12,
              background: "rgba(10,18,40,.88)",
              border: `1px solid ${T.border}`,
              borderRadius: 6,
              padding: "7px 11px",
              zIndex: 4,
              display: "flex",
              flexDirection: "column",
              gap: 5,
              minWidth: 130,
            }}
          >
            {[
              { color: CLR.gwOnline, shape: "circle", label: "GW Online" },
              { color: CLR.gwOffline, shape: "circle", label: "GW Offline" },
              { color: CLR.robot, shape: "diamond", label: "Robot" },
            ].map(({ color, shape, label }) => (
              <div
                key={label}
                style={{ display: "flex", alignItems: "center", gap: 7 }}
              >
                {shape === "circle" ? (
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: color,
                      boxShadow: `0 0 4px ${color}`,
                      flexShrink: 0,
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 1,
                      background: color,
                      transform: "rotate(45deg)",
                      boxShadow: `0 0 4px ${color}`,
                      flexShrink: 0,
                    }}
                  />
                )}
                <span
                  style={{
                    fontSize: 11,
                    color: T.textDim,
                    fontFamily: "monospace",
                  }}
                >
                  {label}
                </span>
              </div>
            ))}
            {/* <div
              style={{
                marginTop: 2,
                borderTop: `1px solid ${T.border}`,
                paddingTop: 4,
                fontSize: 11,
                color: T.textDim,
                fontFamily: "monospace",
              }}
            >
              ◯ {radiusKm} km radius
            </div> */}
            <div
              style={{
                fontSize: 11,
                color: T.textDim,
                fontFamily: "monospace",
              }}
            >
              ╌╌ GW link line
            </div>
          </div>
        )}
      </div>
    </>
  );
}
