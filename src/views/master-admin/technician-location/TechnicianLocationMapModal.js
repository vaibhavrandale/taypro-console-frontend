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
  Polyline,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function FitBounds({ points }) {
  const map = useMap();

  useEffect(() => {
    if (!points?.length) return;
    const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng]));
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [map, points]);

  return null;
}

function startIcon() {
  return L.divIcon({
    className: "",
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    html: `<div class="rounded-circle bg-success d-flex align-items-center justify-content-center text-white fw-bold border border-2 border-white shadow" style="width:30px;height:30px;font-size:11px;">S</div>`,
  });
}

function endIcon() {
  return L.divIcon({
    className: "",
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    html: `<div class="rounded-circle bg-danger d-flex align-items-center justify-content-center text-white fw-bold border border-2 border-white shadow" style="width:30px;height:30px;font-size:11px;">E</div>`,
  });
}

function formatTime(value) {
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

const TechnicianLocationMapModal = ({ visible, onClose, track }) => {
  const points = track?.points ?? [];
  const polyline = points.map((p) => [p.location.lat, p.location.lng]);
  const center = polyline[0] ?? [20.5937, 78.9629];

  return (
    <CModal visible={visible} onClose={onClose} size="xl" scrollable>
      <CModalHeader closeButton>
        <CModalTitle>
          Location Track — {track?.username || "Technician"}
        </CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div className="d-flex flex-wrap gap-2 mb-3">
          <CBadge color="info">Site: {track?.site_id || "—"}</CBadge>
          <CBadge color="primary">Points: {track?.point_count || 0}</CBadge>
          {track?.sources?.map((source) => (
            <CBadge color="secondary" key={source}>
              {source}
            </CBadge>
          ))}
        </div>

        {!points.length ? (
          <div className="text-center text-body-secondary py-5">
            No location points available for this session.
          </div>
        ) : (
          <div className="rounded overflow-hidden border">
            <MapContainer
              center={center}
              zoom={15}
              style={{ height: "420px", width: "100%" }}
              scrollWheelZoom
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <FitBounds points={points.map((p) => p.location)} />
              {polyline.length > 1 && (
                <Polyline positions={polyline} color="#321fdb" weight={4} />
              )}
              <Marker position={polyline[0]} icon={startIcon()}>
                <Popup>
                  Start
                  <br />
                  {formatTime(points[0].recorded_at)}
                </Popup>
              </Marker>
              {polyline.length > 1 && (
                <Marker position={polyline[polyline.length - 1]} icon={endIcon()}>
                  <Popup>
                    Latest
                    <br />
                    {formatTime(points[points.length - 1].recorded_at)}
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          </div>
        )}
      </CModalBody>
    </CModal>
  );
};

export default TechnicianLocationMapModal;
