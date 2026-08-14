import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  CFormInput,
  CSpinner,
  CBadge,
  CButton,
} from "@coreui/react";

const SATELLITE_TILE =
  "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}";
const DEFAULT_CENTER = [23.74, 76.11];
const ROBOT_COLOR = "#facc15";
const SELECTED_COLOR = "#38bdf8";

const STYLES = `
  .rlm-map .leaflet-container { background: #0b1220; }
  .rlm-map .leaflet-control-zoom a {
    background: rgba(15, 23, 42, 0.92);
    color: #e2e8f0;
    border-color: rgba(148, 163, 184, 0.25);
  }
  .rlm-popup .leaflet-popup-content-wrapper {
    background: #0f172a;
    color: #e2e8f0;
    border: 1px solid rgba(250, 204, 21, 0.45);
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(0,0,0,.45);
  }
  .rlm-popup .leaflet-popup-tip { background: #0f172a; }
  .rlm-popup .leaflet-popup-content { margin: 10px 12px; font-size: 12px; line-height: 1.7; }
  .rlm-suggest {
    position: absolute;
    left: 0; right: 0; top: 100%;
    margin-top: 4px;
    max-height: 260px;
    overflow-y: auto;
    background: #0f172a;
    border: 1px solid #2a3a60;
    border-radius: 8px;
    z-index: 20;
    box-shadow: 0 12px 28px rgba(0,0,0,.45);
  }
  .rlm-suggest-item {
    padding: 10px 12px;
    cursor: pointer;
    border-bottom: 1px solid rgba(42,58,96,.6);
    font-size: 13px;
  }
  .rlm-suggest-item:hover,
  .rlm-suggest-item.active { background: rgba(56,189,248,.12); }
  .rlm-suggest-item:last-child { border-bottom: none; }
`;

function robotIcon(selected) {
  const color = selected ? SELECTED_COLOR : ROBOT_COLOR;
  const size = selected ? 18 : 10;
  return L.divIcon({
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2 - 4],
    html: `<div style="
      width:${size}px;height:${size}px;
      transform:rotate(45deg);
      background:${color};
      border:2px solid #fff;
      box-shadow:0 0 10px ${color},0 0 18px ${color};
      ${selected ? "animation:rlmPulse 1.2s ease-out infinite;" : ""}
    "></div>`,
  });
}

function MapReady({ onReady }) {
  const map = useMap();
  useEffect(() => {
    onReady?.(map);
    const t = setTimeout(() => {
      try {
        map.invalidateSize({ pan: false });
      } catch (_) {}
    }, 200);
    return () => clearTimeout(t);
  }, [map, onReady]);
  return null;
}

function FlyToRobot({ robot, tick }) {
  const map = useMap();
  useEffect(() => {
    if (!tick || !robot) return;
    const lat = Number(robot.location?.latitude);
    const lng = Number(robot.location?.longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

    const t = setTimeout(() => {
      map.whenReady(() => {
        try {
          map.invalidateSize({ pan: false });
          map.flyTo([lat, lng], 19, { animate: true, duration: 1.4 });
        } catch (_) {}
      });
    }, 80);
    return () => clearTimeout(t);
  }, [map, robot, tick]);
  return null;
}

function FitAll({ robots, enabled }) {
  const map = useMap();
  useEffect(() => {
    if (!enabled || !robots?.length) return;
    const pts = robots
      .map((r) => [Number(r.location?.latitude), Number(r.location?.longitude)])
      .filter(([lat, lng]) => Number.isFinite(lat) && Number.isFinite(lng));
    if (!pts.length) return;
    const t = setTimeout(() => {
      try {
        if (pts.length === 1) map.setView(pts[0], 17);
        else map.fitBounds(L.latLngBounds(pts), { padding: [48, 48], maxZoom: 18 });
      } catch (_) {}
    }, 250);
    return () => clearTimeout(t);
  }, [map, robots, enabled]);
  return null;
}

function RobotMarker({ robot, selected, onSelect, markerRefs }) {
  const lat = Number(robot.location?.latitude);
  const lng = Number(robot.location?.longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  const isSelected = selected?._id === robot._id;
  const mapsUrl =
    robot.location?.map_url ||
    `https://www.google.com/maps?q=${lat},${lng}`;

  return (
    <Marker
      position={[lat, lng]}
      icon={robotIcon(isSelected)}
      zIndexOffset={isSelected ? 1000 : 0}
      eventHandlers={{
        click: () => onSelect(robot),
      }}
      ref={(ref) => {
        if (ref) markerRefs.current[robot._id] = ref;
        else delete markerRefs.current[robot._id];
      }}
    >
      <Popup className="rlm-popup">
        <div>
          <strong style={{ color: ROBOT_COLOR }}>{robot.robot_no}</strong>
          <br />
          <span style={{ color: "#8899bb" }}>Block:</span> {robot.block || "—"}
          <br />
          <span style={{ color: "#8899bb" }}>DevEUI:</span> {robot.deveui || "—"}
          <br />
          <span style={{ color: "#8899bb" }}>Last Gateway:</span>{" "}
          {robot.last_gateway || "—"}
          <br />
          <span style={{ color: "#8899bb" }}>Lat/Lng:</span> {lat.toFixed(6)},{" "}
          {lng.toFixed(6)}
          <br />
          <a href={mapsUrl} target="_blank" rel="noreferrer">
            Open in Google Maps
          </a>
        </div>
      </Popup>
    </Marker>
  );
}

export default function RobotLocationsMapModal({ visible, onClose, site_id }) {
  const [robots, setRobots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [flyTick, setFlyTick] = useState(0);
  const [showSuggest, setShowSuggest] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const markerRefs = useRef({});
  const searchRef = useRef(null);

  const fetchLocations = useCallback(async () => {
    if (!site_id) return;
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `/api/v1/robot-locations/only-locations/${site_id}`,
        { withCredentials: true },
      );
      setRobots(res.data?.data || []);
    } catch (e) {
      setRobots([]);
      setError(e.response?.data?.message || e.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [site_id]);

  useEffect(() => {
    if (!visible) return;
    setQuery("");
    setSelected(null);
    setFlyTick(0);
    setShowSuggest(false);
    fetchLocations();
    const t = setTimeout(() => searchRef.current?.focus(), 300);
    return () => clearTimeout(t);
  }, [visible, fetchLocations]);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return robots
      .filter((r) => {
        const no = (r.robot_no || "").toLowerCase();
        const block = (r.block || "").toLowerCase();
        const deveui = (r.deveui || "").toLowerCase();
        return no.includes(q) || block.includes(q) || deveui.includes(q);
      })
      .slice(0, 12);
  }, [query, robots]);

  const selectRobot = useCallback((robot) => {
    if (!robot) return;
    setSelected(robot);
    setQuery(robot.robot_no || "");
    setShowSuggest(false);
    setFlyTick((n) => n + 1);
    // open popup after fly animation settles
    setTimeout(() => {
      const marker = markerRefs.current[robot._id];
      if (marker?.openPopup) marker.openPopup();
    }, 1500);
  }, []);

  const onSearchKeyDown = (e) => {
    if (!showSuggest || !suggestions.length) {
      if (e.key === "Enter" && suggestions[0]) {
        e.preventDefault();
        selectRobot(suggestions[0]);
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      selectRobot(suggestions[activeIdx] || suggestions[0]);
    } else if (e.key === "Escape") {
      setShowSuggest(false);
    }
  };

  if (!visible) return null;

  const selectedLat = Number(selected?.location?.latitude);
  const selectedLng = Number(selected?.location?.longitude);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.88)",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <style>{STYLES}{`@keyframes rlmPulse{0%{box-shadow:0 0 0 0 rgba(56,189,248,.7)}70%{box-shadow:0 0 0 14px rgba(56,189,248,0)}100%{box-shadow:0 0 0 0 rgba(56,189,248,0)}}`}</style>

      {/* header */}
      <div
        style={{
          height: 56,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "0 16px",
          borderBottom: "1px solid #2a3a60",
          background: "#0f172a",
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: 13, color: "#e2e8f0", whiteSpace: "nowrap" }}>
          Robot Locations — {site_id}
        </span>
        <CBadge color="info">{robots.length} robots</CBadge>

        <div style={{ position: "relative", flex: 1, maxWidth: 420 }}>
          <CFormInput
            ref={searchRef}
            size="sm"
            placeholder="Search robot no, block, or DevEUI…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggest(true);
              setActiveIdx(0);
            }}
            onFocus={() => setShowSuggest(true)}
            onKeyDown={onSearchKeyDown}
            style={{ background: "#101936", borderColor: "#2a3a60", color: "#e2e8f0" }}
          />
          {showSuggest && suggestions.length > 0 && (
            <div className="rlm-suggest">
              {suggestions.map((r, i) => (
                <div
                  key={r._id}
                  className={`rlm-suggest-item${i === activeIdx ? " active" : ""}`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    selectRobot(r);
                  }}
                >
                  <strong style={{ color: ROBOT_COLOR }}>{r.robot_no}</strong>
                  <span style={{ color: "#8899bb", marginLeft: 8 }}>
                    {r.block || "—"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {selected && (
          <CButton
            size="sm"
            color="secondary"
            variant="outline"
            onClick={() => {
              setSelected(null);
              setQuery("");
              setFlyTick(0);
            }}
          >
            Clear
          </CButton>
        )}

        <button
          type="button"
          onClick={onClose}
          style={{
            fontSize: 12,
            padding: "6px 12px",
            borderRadius: 6,
            border: "1px solid #ff4d4d",
            background: "rgba(255,77,77,.1)",
            color: "#ff4d4d",
            cursor: "pointer",
            marginLeft: "auto",
          }}
        >
          ✕ Close
        </button>
      </div>

      {/* body */}
      <div style={{ flex: 1, minHeight: 0, display: "flex", position: "relative" }}>
        <div className="rlm-map" style={{ flex: 1, minWidth: 0 }}>
          {loading ? (
            <div
              style={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                color: "#8899bb",
              }}
            >
              <CSpinner size="sm" /> Loading locations…
            </div>
          ) : error ? (
            <div
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                color: "#ff4d4d",
              }}
            >
              {error}
              <CButton size="sm" color="info" onClick={fetchLocations}>
                Retry
              </CButton>
            </div>
          ) : (
            <MapContainer
              center={DEFAULT_CENTER}
              zoom={14}
              maxZoom={21}
              style={{ width: "100%", height: "100%" }}
              attributionControl={false}
            >
              <TileLayer url={SATELLITE_TILE} maxZoom={21} />
              <MapReady />
              <FitAll robots={robots} enabled={!selected && flyTick === 0} />
              <FlyToRobot robot={selected} tick={flyTick} />
              {robots.map((r) => (
                <RobotMarker
                  key={r._id}
                  robot={r}
                  selected={selected}
                  onSelect={selectRobot}
                  markerRefs={markerRefs}
                />
              ))}
            </MapContainer>
          )}
        </div>

        {/* detail panel */}
        {selected && (
          <div
            style={{
              width: 300,
              flexShrink: 0,
              background: "#0f172a",
              borderLeft: "1px solid #2a3a60",
              padding: 16,
              color: "#e2e8f0",
              overflowY: "auto",
            }}
          >
            <div style={{ fontSize: 11, color: "#8899bb", marginBottom: 4 }}>
              SELECTED ROBOT
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: SELECTED_COLOR }}>
              {selected.robot_no}
            </div>
            <div style={{ marginTop: 14, fontSize: 13, lineHeight: 1.9 }}>
              <div>
                <span style={{ color: "#8899bb" }}>Block: </span>
                {selected.block || "—"}
              </div>
              <div>
                <span style={{ color: "#8899bb" }}>DevEUI: </span>
                {selected.deveui || "—"}
              </div>
              <div>
                <span style={{ color: "#8899bb" }}>Last Gateway: </span>
                {selected.last_gateway || "—"}
              </div>
              <div>
                <span style={{ color: "#8899bb" }}>Latitude: </span>
                {Number.isFinite(selectedLat) ? selectedLat.toFixed(7) : "—"}
              </div>
              <div>
                <span style={{ color: "#8899bb" }}>Longitude: </span>
                {Number.isFinite(selectedLng) ? selectedLng.toFixed(7) : "—"}
              </div>
            </div>
            {Number.isFinite(selectedLat) && Number.isFinite(selectedLng) && (
              <a
                href={
                  selected.location?.map_url ||
                  `https://www.google.com/maps?q=${selectedLat},${selectedLng}`
                }
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-block",
                  marginTop: 16,
                  padding: "8px 12px",
                  borderRadius: 6,
                  border: "1px solid rgba(56,189,248,.4)",
                  background: "rgba(56,189,248,.1)",
                  color: "#38bdf8",
                  textDecoration: "none",
                  fontSize: 12,
                }}
              >
                Open in Google Maps →
              </a>
            )}
            <CButton
              size="sm"
              color="info"
              className="mt-3 w-100"
              onClick={() => selectRobot(selected)}
            >
              Re-center on robot
            </CButton>
          </div>
        )}
      </div>
    </div>
  );
}
