import React from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCardFooter,
  CBadge,
  CRow,
  CCol,
} from "@coreui/react";
import {
  Clock,
  CloudRain,
  Droplets,
  Wind,
  Info,
  Timer,
  CalendarClock,
  Layers,
  MapPin,
  ArrowDownLeft,
  ArrowUpRight,
} from "lucide-react";

const WeatherNotificationCard = ({ data }) => {
  if (!data) return null;

  const formatTime = (timeStr) => {
    if (!timeStr) return "N/A";
    const [hours, minutes] = timeStr.split(":");
    const h = parseInt(hours);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${String(h12).padStart(2, "0")}:${minutes} ${ampm}`;
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatRainTime = (dateStr) => {
    if (!dateStr) return "N/A";
    return (
      new Date(dateStr).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Kolkata",
        hour12: true,
      }) + " IST"
    );
  };

  const getTimeDiff = () => {
    if (!data.previous_time || !data.updated_time) return null;
    const toMins = (t) => {
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m;
    };
    return Math.abs(toMins(data.previous_time) - toMins(data.updated_time));
  };

  const isPrepone = data.decision === "PREPONE";
  const timeDiff = getTimeDiff();
  const DecisionIcon = isPrepone ? ArrowUpRight : ArrowDownLeft;

  return (
    <CCard className="mb-4  border-0 shadow-sm" style={{ maxWidth: "600px" }}>
      {/* Header */}
      <CCardHeader className="bg-body border-bottom border-secondary px-4 pt-4 pb-3">
        <div className="d-flex justify-content-between">
          <div className="d-flex align-items-center gap-3">
            <div
              className="rounded-circle bg-info text-white d-flex align-items-center justify-content-center"
              style={{ width: 46, height: 46 }}
            >
              <Clock size={20} className="text-white" />
            </div>

            <div>
              <div className="d-flex align-items-center gap-1 mb-1">
                <MapPin size={12} className="text-body-secondary" />
                <span className="fw-semibold text-body">{data.site_id}</span>
              </div>

              <div className="d-flex gap-2">
                <CBadge color="secondary">{data.block}</CBadge>
                <CBadge color="secondary">{data.timer_type}</CBadge>
              </div>
            </div>
          </div>

          <div className="text-end">
            <CBadge color={isPrepone ? "success" : "danger"}>
              <DecisionIcon size={12} /> {data.decision}
            </CBadge>
            <div className="text-body-tertiary small">{data.timer_date}</div>
          </div>
        </div>
      </CCardHeader>

      <CCardBody className="px-4">
        {/* Timer Update */}
        <div className="bg-body border border-secondary border border-secondary rounded-3 p-3 mb-3">
          <div className="text-body-tertiary small mb-2 text-uppercase">
            Timer Update
          </div>

          <div className="d-flex align-items-center gap-2">
            {/* Previous */}
            <div className="flex-fill text-center bg-body border border-secondary rounded p-2">
              <div className="text-body-secondary small">Previous</div>
              <div className="text-body  fw-semibold">
                {formatTime(data.previous_time)}
              </div>
            </div>

            {/* Diff */}
            <div className="text-center">
              <DecisionIcon
                className={isPrepone ? "text-success" : "text-warning"}
              />
              {timeDiff && (
                <div
                  className={
                    isPrepone ? "text-success small" : "text-warning small"
                  }
                >
                  {timeDiff}m
                </div>
              )}
            </div>

            {/* Updated */}
            <div
              className={`flex-fill text-center border rounded p-2 ${
                isPrepone ? "bg-success text-white" : "bg-warning text-dark"
              }`}
            >
              <div className="small">Updated</div>
              <div className="fw-semibold">
                {data.decision === "CANCEL"
                  ? "CANCELLED"
                  : formatTime(data.updated_time)}
              </div>
            </div>
          </div>
        </div>

        {/* Weather + Meta */}
        <CRow className="g-3">
          {/* Weather */}
          <CCol md={7}>
            <div className="bg-body border border-secondary border border-secondary rounded-3 p-3 h-100">
              <div className="text-body-tertiary small mb-2 text-uppercase">
                Weather
              </div>

              <div className="bg-info text-white rounded p-2 mb-3 d-flex gap-2">
                <CloudRain size={16} />
                <div>
                  <div className="fw-semibold">{data.weather?.status}</div>
                  <div className="text-body-secondary small">
                    {data.weather?.description}
                  </div>
                </div>
              </div>

              <div className="d-flex gap-2">
                <div className="flex-fill text-center bg-body border border-secondary rounded p-2">
                  <Droplets size={14} className="text-info" />
                  <div className="text-body-secondary small">Cloud</div>
                  <div className="fw-semibold">{data.weather?.cloudiness}%</div>
                </div>

                <div className="flex-fill text-center bg-body border border-secondary rounded p-2">
                  <Droplets size={14} className="text-primary" />
                  <div className="text-body-secondary small">Humidity</div>
                  <div className="fw-semibold">{data.weather?.humidity}%</div>
                </div>

                <div className="flex-fill text-center bg-body border border-secondary rounded p-2">
                  <Wind size={14} className="text-secondary" />
                  <div className="text-body-secondary small">Wind</div>
                  <div className="fw-semibold">
                    {data.weather?.wind_speed} m/s
                  </div>
                </div>
              </div>
            </div>
          </CCol>

          {/* Meta */}
          <CCol md={5}>
            <div className="bg-body border border-secondary border border-secondary rounded-3 p-3 h-100">
              <div className="text-body-tertiary small mb-2 text-uppercase">
                Schedule Meta
              </div>

              <div className="d-flex justify-content-between border-bottom border-secondary py-2">
                <span className="text-body-secondary">Buffer</span>
                <span className="fw-semibold">
                  {data.meta?.buffer_minutes} min
                </span>
              </div>

              <div className="d-flex justify-content-between border-bottom border-secondary py-2">
                <span className="text-body-secondary">Max cleaning</span>
                <span className="fw-semibold">
                  {data.meta?.max_cleaning_time} min
                </span>
              </div>

              <div className="d-flex justify-content-between py-2">
                <span className="text-body-secondary">Rain starts</span>
                <span className="fw-semibold text-info">
                  {formatRainTime(data.meta?.rain_start_time)}
                </span>
              </div>
            </div>
          </CCol>
        </CRow>

        {/* Reason */}
        {data.reason && (
          <div className="bg-warning text-white border-start border-3 border-warning rounded p-3 mt-3 d-flex gap-2">
            <Info size={14} />
            <span>{data.reason}</span>
          </div>
        )}
      </CCardBody>

      {/* Footer */}
      <CCardFooter className=" d-flex justify-content-between">
        <span className="text-body-tertiary small">
          {formatDateTime(data.createdAt)}
        </span>
        <span className="text-body-tertiary small">
          #{(data._id?.$oid ?? data._id ?? "").toString().slice(0, 8)}
        </span>
      </CCardFooter>
    </CCard>
  );
};

export default WeatherNotificationCard;
