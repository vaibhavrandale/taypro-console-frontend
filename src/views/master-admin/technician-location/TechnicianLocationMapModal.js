import React, { useEffect, useMemo, useState, useCallback, memo } from "react";
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CBadge,
  CButton,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilLocationPin, cilMap, cilMagnifyingGlass } from "@coreui/icons";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
  CircleMarker,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MAP_STYLES = `
  .tech-track-map .leaflet-container {
    background: #0b1220;
    font-family: system-ui, sans-serif;
  }
  .tech-track-map .leaflet-control-zoom a {
    background: rgba(15, 23, 42, 0.92);
    color: #e2e8f0;
    border-color: rgba(148, 163, 184, 0.25);
  }
  .tech-track-map .leaflet-control-zoom a:hover {
    background: rgba(30, 41, 59, 0.98);
    color: #fff;
  }
  .tech-track-popup .leaflet-popup-content-wrapper {
    border-radius: 10px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
    border: 1px solid rgba(148, 163, 184, 0.2);
  }
  .tech-track-popup .leaflet-popup-tip {
    background: #fff;
  }
  .tech-track-table thead th {
    position: sticky;
    top: 0;
    z-index: 2;
    background: #1e293b !important;
    color: #f8fafc;
    font-size: 0.78rem;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    white-space: nowrap;
  }
  .tech-track-table tbody tr {
    cursor: pointer;
    transition: background-color 0.15s ease;
  }
  .tech-track-table tbody tr:hover {
    background-color: rgba(59, 130, 246, 0.08);
  }
  .tech-track-table tbody tr.is-selected {
    background-color: rgba(59, 130, 246, 0.16) !important;
  }
`;

const MAP_MAX_ZOOM = 19;
const SATELLITE_TILE_URL =
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";

const START_ICON = L.divIcon({
  className: "",
  iconSize: [34, 34],
  iconAnchor: [17, 17],
  html: `<div style="width:34px;height:34px;border-radius:50%;background:#22c55e;border:3px solid #fff;box-shadow:0 0 0 4px rgba(34,197,94,0.35),0 4px 12px rgba(0,0,0,0.45);display:flex;align-items:center;justify-content:center;color:#fff;font-size:12px;font-weight:700;">S</div>`,
});

const END_ICON = L.divIcon({
  className: "",
  iconSize: [34, 34],
  iconAnchor: [17, 17],
  html: `<div style="width:34px;height:34px;border-radius:50%;background:#ef4444;border:3px solid #fff;box-shadow:0 0 0 4px rgba(239,68,68,0.35),0 4px 12px rgba(0,0,0,0.45);display:flex;align-items:center;justify-content:center;color:#fff;font-size:12px;font-weight:700;">E</div>`,
});

function FitTrackHandler({ points, trigger }) {
  const map = useMap();

  useEffect(() => {
    if (!trigger) return;

    const latLngs = points
      .filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lng))
      .map((p) => [p.lat, p.lng]);

    if (!latLngs.length) return;

    map.whenReady(() => {
      map.invalidateSize();
      if (latLngs.length === 1) {
        map.setView(latLngs[0], 17);
      } else {
        map.fitBounds(L.latLngBounds(latLngs), {
          padding: [48, 48],
          maxZoom: MAP_MAX_ZOOM,
        });
      }
    });
  }, [map, points, trigger]);

  useEffect(() => {
    map.whenReady(() => {
      requestAnimationFrame(() => map.invalidateSize());
    });
  }, [map]);

  return null;
}

function PanToPoint({ point, active }) {
  const map = useMap();

  useEffect(() => {
    if (!active || !point) return;
    const lat = point?.location?.lat;
    const lng = point?.location?.lng;
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
    map.panTo([lat, lng], { animate: true, duration: 0.4 });
  }, [active, map, point]);

  return null;
}

const TrackMapLayers = memo(function TrackMapLayers({
  polyline,
  mapPoints,
  allPoints,
  selectedIndex,
  onPointSelect,
}) {
  const selectedPointRef =
    selectedIndex != null ? allPoints[selectedIndex] : null;

  return (
    <>
      {polyline.length > 1 && (
        <>
          <Polyline
            positions={polyline}
            pathOptions={{
              color: "rgba(255,255,255,0.35)",
              weight: 8,
              opacity: 0.55,
              lineCap: "round",
              lineJoin: "round",
            }}
          />
          <Polyline
            positions={polyline}
            pathOptions={{
              color: "#38bdf8",
              weight: 4,
              opacity: 0.95,
              lineCap: "round",
              lineJoin: "round",
            }}
          />
        </>
      )}

      {mapPoints.map((point, index) => {
        const isSelected = selectedPointRef === point;
        const pos = [point.location.lat, point.location.lng];
        return (
          <CircleMarker
            key={`${point.recorded_at}_${index}`}
            center={pos}
            radius={isSelected ? 9 : 5}
            pathOptions={{
              color: isSelected ? "#fff" : "#38bdf8",
              fillColor: isSelected ? "#fbbf24" : "#0ea5e9",
              fillOpacity: isSelected ? 1 : 0.85,
              weight: isSelected ? 3 : 2,
            }}
            eventHandlers={{
              click: () => {
                const rowIndex = allPoints.indexOf(point);
                if (rowIndex >= 0) onPointSelect(rowIndex);
              },
            }}
          />
        );
      })}

      <Marker position={polyline[0]} icon={START_ICON} zIndexOffset={1000}>
        <Popup className="tech-track-popup">
          <strong>Start</strong>
          <br />
          {formatTime(mapPoints[0].recorded_at)}
        </Popup>
      </Marker>

      {polyline.length > 1 && (
        <Marker
          position={polyline[polyline.length - 1]}
          icon={END_ICON}
          zIndexOffset={1000}
        >
          <Popup className="tech-track-popup">
            <strong>Latest</strong>
            <br />
            {formatTime(mapPoints[mapPoints.length - 1].recorded_at)}
          </Popup>
        </Marker>
      )}
    </>
  );
});

function formatTime(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

function formatCellValue(value) {
  if (value == null || value === "") return "—";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function getExtraColumns(points) {
  const keys = new Set();
  points.forEach((point) => {
    Object.keys(point).forEach((key) => {
      if (key !== "location" && key !== "recorded_at") keys.add(key);
    });
  });
  return Array.from(keys).sort();
}

function StatCard({ icon, label, value, accent }) {
  return (
    <div
      className="d-flex align-items-center gap-2 px-3 py-2 rounded-3"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(148,163,184,0.12)",
        minWidth: 140,
      }}
    >
      <div
        className="rounded-circle d-flex align-items-center justify-content-center"
        style={{
          width: 36,
          height: 36,
          background: `${accent}22`,
          color: accent,
        }}
      >
        <CIcon icon={icon} />
      </div>
      <div>
        <div style={{ fontSize: "0.72rem", color: "#94a3b8", letterSpacing: "0.04em" }}>
          {label}
        </div>
        <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "#f1f5f9" }}>
          {value}
        </div>
      </div>
    </div>
  );
}

const TechnicianLocationMapModal = ({ visible, onClose, track }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [fitTrackTick, setFitTrackTick] = useState(0);
  const allPoints = track?.points ?? [];

  const mapPoints = useMemo(
    () =>
      allPoints.filter(
        (p) =>
          Number.isFinite(p?.location?.lat) &&
          Number.isFinite(p?.location?.lng),
      ),
    [allPoints],
  );

  const polyline = useMemo(
    () => mapPoints.map((p) => [p.location.lat, p.location.lng]),
    [mapPoints],
  );
  const extraColumns = useMemo(() => getExtraColumns(allPoints), [allPoints]);
  const center = polyline[0] ?? [20.5937, 78.9629];
  const selectedPoint = selectedIndex != null ? allPoints[selectedIndex] : null;
  const locationCoords = useMemo(
    () => mapPoints.map((p) => p.location),
    [mapPoints],
  );

  const handlePointSelect = useCallback((index) => {
    setSelectedIndex((prev) => (prev === index ? null : index));
  }, []);

  useEffect(() => {
    if (visible) setSelectedIndex(null);
  }, [visible, track?.attendance_id, track?.user_id]);

  return (
    <>
      <style>{MAP_STYLES}</style>
      <CModal fullscreen visible={visible} onClose={onClose}>
        <CModalHeader
          closeButton
          className="py-2 px-3 border-0"
          style={{ background: "#0f172a", color: "#f8fafc" }}
        >
          <div className="d-flex align-items-center justify-content-between w-100 pe-3 flex-wrap gap-2">
            <CModalTitle className="fs-5 mb-0 text-white">
              Location Track — {track?.username || "Technician"}
            </CModalTitle>
            <div className="d-flex flex-wrap gap-2">
              {track?.sources?.map((source) => (
                <CBadge
                  color="secondary"
                  key={source}
                  shape="rounded-pill"
                  className="px-3"
                >
                  {source}
                </CBadge>
              ))}
            </div>
          </div>
        </CModalHeader>

        <CModalBody
          className="p-0 d-flex flex-column tech-track-map"
          style={{ height: "calc(100vh - 56px)", background: "#0b1220" }}
        >
          <div
            className="px-3 py-3 border-bottom d-flex flex-wrap gap-3"
            style={{
              background: "linear-gradient(180deg, #111827 0%, #0f172a 100%)",
              borderColor: "rgba(148,163,184,0.15) !important",
            }}
          >
            <StatCard
              icon={cilMap}
              label="Site"
              value={track?.site_id || "—"}
              accent="#38bdf8"
            />
            <StatCard
              icon={cilLocationPin}
              label="Total Points"
              value={track?.point_count || allPoints.length}
              accent="#a78bfa"
            />
            <StatCard
              icon={cilLocationPin}
              label="Valid Coordinates"
              value={mapPoints.length}
              accent="#34d399"
            />
            <StatCard
              icon={cilMap}
              label="Session"
              value={formatTime(track?.first_recorded_at)}
              accent="#fbbf24"
            />
          </div>

          {!allPoints.length ? (
            <div className="text-center py-5" style={{ color: "#94a3b8" }}>
              No location points available for this session.
            </div>
          ) : (
            <>
              {visible && mapPoints.length > 0 && (
                <div
                  className="position-relative border-bottom"
                  style={{
                    height: "52vh",
                    minHeight: 320,
                    borderColor: "rgba(148,163,184,0.15) !important",
                  }}
                >
                  <MapContainer
                    key={`${track?.user_id}_${track?.attendance_id}`}
                    center={center}
                    zoom={16}
                    minZoom={3}
                    maxZoom={MAP_MAX_ZOOM}
                    style={{ height: "100%", width: "100%" }}
                    scrollWheelZoom
                    zoomControl
                    preferCanvas
                  >
                    <TileLayer
                      url={SATELLITE_TILE_URL}
                      attribution="Tiles &copy; Esri &mdash; Maxar, Earthstar Geographics"
                      maxNativeZoom={MAP_MAX_ZOOM}
                      maxZoom={MAP_MAX_ZOOM}
                      minZoom={3}
                      updateWhenZooming={false}
                      updateWhenIdle
                      keepBuffer={3}
                    />

                    <FitTrackHandler points={locationCoords} trigger={fitTrackTick} />
                    <PanToPoint point={selectedPoint} active={selectedIndex != null} />

                    <TrackMapLayers
                      polyline={polyline}
                      mapPoints={mapPoints}
                      allPoints={allPoints}
                      selectedIndex={selectedIndex}
                      onPointSelect={handlePointSelect}
                    />
                  </MapContainer>

                  <div
                    className="position-absolute d-flex gap-2"
                    style={{ top: 12, right: 12, zIndex: 1000 }}
                  >
                    <button
                      type="button"
                      onClick={() => setFitTrackTick((tick) => tick + 1)}
                      className="btn btn-sm d-flex align-items-center gap-1 border-0 shadow"
                      style={{
                        background: "rgba(15, 23, 42, 0.9)",
                        color: "#e2e8f0",
                        backdropFilter: "blur(6px)",
                        fontSize: "0.8rem",
                      }}
                    >
                      <CIcon icon={cilMagnifyingGlass} size="sm" />
                      Fit track
                    </button>
                  </div>

                  <div
                    className="position-absolute d-flex flex-column gap-1 px-3 py-2 rounded-3 shadow-sm"
                    style={{
                      bottom: 14,
                      left: 14,
                      zIndex: 1000,
                      background: "rgba(15, 23, 42, 0.88)",
                      backdropFilter: "blur(6px)",
                      border: "1px solid rgba(148,163,184,0.18)",
                      pointerEvents: "none",
                    }}
                  >
                    <span style={{ fontSize: "0.68rem", color: "#94a3b8", letterSpacing: "0.08em" }}>
                      MAP LEGEND
                    </span>
                    {[
                      { color: "#22c55e", label: "Start" },
                      { color: "#ef4444", label: "Latest" },
                      { color: "#38bdf8", label: "Track / points" },
                    ].map(({ color, label }) => (
                      <div
                        key={label}
                        className="d-flex align-items-center gap-2"
                        style={{ fontSize: "0.78rem", color: "#e2e8f0" }}
                      >
                        <span
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            background: color,
                            display: "inline-block",
                          }}
                        />
                        {label}
                      </div>
                    ))}
                    <span style={{ fontSize: "0.72rem", color: "#64748b", marginTop: 4 }}>
                      Satellite view · max zoom {MAP_MAX_ZOOM}
                    </span>
                  </div>
                </div>
              )}

              <div
                className="flex-grow-1 overflow-auto px-3 py-3"
                style={{ background: "#0f172a" }}
              >
                <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
                  <h6 className="mb-0" style={{ color: "#e2e8f0", fontWeight: 600 }}>
                    All Location Points ({allPoints.length})
                  </h6>
                  <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                    Click a row to highlight on map · zoom freely with scroll or controls
                  </span>
                </div>

                <CTable
                  bordered
                  hover
                  responsive
                  align="middle"
                  className="mb-0 tech-track-table"
                  style={{
                    fontSize: "0.84rem",
                    color: "#cbd5e1",
                    borderColor: "rgba(148,163,184,0.15)",
                  }}
                >
                  <CTableHead>
                    <CTableRow className="text-center">
                      <CTableHeaderCell>#</CTableHeaderCell>
                      <CTableHeaderCell>Recorded At</CTableHeaderCell>
                      <CTableHeaderCell>Latitude</CTableHeaderCell>
                      <CTableHeaderCell>Longitude</CTableHeaderCell>
                      {extraColumns.map((column) => (
                        <CTableHeaderCell key={column}>
                          {column.replace(/_/g, " ")}
                        </CTableHeaderCell>
                      ))}
                      <CTableHeaderCell>Map</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {allPoints.map((point, index) => {
                      const lat = point?.location?.lat;
                      const lng = point?.location?.lng;
                      const hasCoords =
                        Number.isFinite(lat) && Number.isFinite(lng);
                      const isSelected = selectedIndex === index;

                      return (
                        <CTableRow
                          key={`${point.recorded_at}_${index}`}
                          className={isSelected ? "is-selected" : ""}
                          style={{
                            background: index % 2 === 0 ? "rgba(15,23,42,0.5)" : "rgba(30,41,59,0.35)",
                          }}
                          onClick={() => handlePointSelect(index)}
                        >
                          <CTableDataCell className="text-center fw-semibold">
                            {index + 1}
                          </CTableDataCell>
                          <CTableDataCell style={{ whiteSpace: "nowrap" }}>
                            {formatTime(point.recorded_at)}
                          </CTableDataCell>
                          <CTableDataCell
                            className="text-center"
                            style={{ fontFamily: "monospace", fontSize: "0.8rem" }}
                          >
                            {hasCoords ? lat.toFixed(6) : "—"}
                          </CTableDataCell>
                          <CTableDataCell
                            className="text-center"
                            style={{ fontFamily: "monospace", fontSize: "0.8rem" }}
                          >
                            {hasCoords ? lng.toFixed(6) : "—"}
                          </CTableDataCell>
                          {extraColumns.map((column) => (
                            <CTableDataCell key={column}>
                              {formatCellValue(point[column])}
                            </CTableDataCell>
                          ))}
                          <CTableDataCell className="text-center">
                            {hasCoords ? (
                              <CButton
                                size="sm"
                                color="info"
                                variant="outline"
                                className="py-0 px-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(
                                    `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
                                    "_blank",
                                    "noopener,noreferrer",
                                  );
                                }}
                              >
                                Open
                              </CButton>
                            ) : (
                              "—"
                            )}
                          </CTableDataCell>
                        </CTableRow>
                      );
                    })}
                  </CTableBody>
                </CTable>
              </div>
            </>
          )}
        </CModalBody>
      </CModal>
    </>
  );
};

export default TechnicianLocationMapModal;
