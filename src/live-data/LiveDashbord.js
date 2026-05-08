import React, { useState, useEffect, useCallback, useRef } from "react";
// import TayproLogo from "../assets/brand/logofordarkbg.png"; // Import the image
import TayproLogo from "../assets/brand/logofordarkbg.png"; // Import the image
import { CImage } from "@coreui/react";
/* ══════════════════════════════════════════════
   MOCK DATA GENERATOR  (fallback when API fails)
══════════════════════════════════════════════ */
const LOCATIONS = [
  ["Chakan", "MH"],
  ["Yadgiri", "KN"],
  ["Rajkot", "GJ"],
  ["Jodhpur", "RJ"],
  ["Nashik", "MH"],
  ["Pune", "MH"],
  ["Surat", "GJ"],
  ["Hyderabad", "TS"],
  ["Bhopal", "MP"],
  ["Indore", "MP"],
  ["Jaipur", "RJ"],
  ["Nagpur", "MH"],
  ["Vadodara", "GJ"],
  ["Ahmedabad", "GJ"],
  ["Aurangabad", "MH"],
  ["Raipur", "CG"],
  ["Bhilai", "CG"],
  ["Ranchi", "JH"],
  ["Patna", "BR"],
  ["Lucknow", "UP"],
  ["Agra", "UP"],
  ["Kanpur", "UP"],
  ["Varanasi", "UP"],
  ["Bikaner", "RJ"],
  ["Kota", "RJ"],
  ["Mehsana", "GJ"],
  ["Anand", "GJ"],
  ["Solapur", "MH"],
  ["Kolhapur", "MH"],
  ["Hubli", "KN"],
];
const CLIENTS = [
  "AVPS Solar Technology",
  "Avaada Clean Projects",
  "Adani Green Energy",
  "Tata Power Solar",
  "ReNew Power",
  "Greenko Group",
  "Azure Power",
  "Sprng Energy",
  "SB Energy",
  "Hero Future",
  "Acme Solar",
  "Waaree Energies",
  "Vikram Solar",
  "Goldi Solar",
  "Saatvik Green",
];
const DESCS = [
  "clear sky",
  "scattered clouds",
  "broken clouds",
  "few clouds",
  "overcast clouds",
  "light rain",
];

const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const randF = (a, b) => +(Math.random() * (b - a) + a).toFixed(2);

const genSite = (i) => {
  const [loc, state] = LOCATIONS[i % LOCATIONS.length];
  const client = CLIENTS[i % CLIENTS.length];
  const totalRobots = rand(8, 120);
  const online = rand(0, totalRobots);
  const offline = totalRobots - online;
  const failures = rand(0, 3);
  const inprogress = rand(0, 4);
  const completed = rand(0, 20);
  const techCount = rand(0, 3);
  const techs = Array.from({ length: techCount }, (_, j) => ({
    username: [
      "Rahul Sharma",
      "Priya Patel",
      "Amit Kumar",
      "Sneha Joshi",
      "Vikas Singh",
    ][j % 5],
    punchin_time: new Date(Date.now() - rand(30, 300) * 60000).toISOString(),
    profile_image: "",
  }));
  const gwOnline = Math.random() > 0.1;
  // weather can be null in real API — simulate that ~10% of the time
  const hasWeather = Math.random() > 0.1;
  return {
    cleaning_data: { completed, inprogress, failure: failures },
    robot_data: { online, offline },
    weather: hasWeather
      ? {
          temperature: 42,
          humidity: rand(10, 60),
          wind_speed: randF(0.5, 8),
          description: DESCS[rand(0, DESCS.length - 1)],
          pressure: rand(1000, 1015),
          visibility: rand(6, 10),
          cloudiness: rand(5, 90),
        }
      : null,
    technician_data: techs,
    gateways: [
      {
        gateway_name: `GW-${loc.toLowerCase()}-${String(i + 1).padStart(2, "0")}`,
        gateway_status: gwOnline,
        last_uplink: new Date(Date.now() - rand(1, 120) * 60000).toISOString(),
      },
    ],
    site: {
      site_id: `site_${loc.toLowerCase()}_${i}`,
      siteName: `${client} - ${loc}`,
      location: `${loc}, ${state}`,
      site_type: Math.random() > 0.4 ? "capex" : "opex",
      logo: "",
    },
  };
};

const MOCK_DATA = Array.from({ length: 30 }, (_, i) => genSite(i));

/* ══════════════════════════════════════════════
   HEALTH SCORING
══════════════════════════════════════════════ */
const getHealth = (d) => {
  const { cleaning_data: c, robot_data: r, gateways, technician_data: t } = d;
  if (
    c.failure > 0 ||
    gateways.some((g) => g.gateway_status === false) ||
    (r.offline > 0 && r.online)
  )
    return "critical";
  if (t.length === 0 || r.online < r.offline * 0.2) return "warning";
  return "healthy";
};

const HEALTH_COLOR = {
  critical: "#ff3355",
  warning: "#f5a623",
  healthy: "#22dd88",
};
const HEALTH_BG = {
  critical: "rgba(255,51,85,0.12)",
  warning: "rgba(245,166,35,0.10)",
  healthy: "rgba(34,221,136,0.06)",
};
const HEALTH_BORDER = {
  critical: "rgba(255,51,85,0.35)",
  warning: "rgba(245,166,35,0.30)",
  healthy: "rgba(34,221,136,0.18)",
};
const HEALTH_LABEL = {
  critical: "CRITICAL",
  warning: "WARNING",
  healthy: "HEALTHY",
};

/* ══════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════ */
const fmtTime = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
};
const fmtClock = (d) =>
  d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
const fmtDate = (d) =>
  d.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const wIcon = (desc = "") => {
  const s = (desc || "").toLowerCase();
  if (s.includes("rain")) return "🌧";
  if (s.includes("thunder")) return "⛈";
  if (s.includes("clear")) return "☀️";
  if (s.includes("overcast")) return "🌥";
  if (s.includes("cloud")) return "⛅";
  return "🌤";
};

/* ══════════════════════════════════════════════
   COMPACT SITE CARD  (left grid)
══════════════════════════════════════════════ */
const SiteCard = ({ data, isSelected, onClick, animDelay }) => {
  const h = getHealth(data);
  const {
    robot_data: r,
    cleaning_data: c,
    technician_data: t,
    site,
    gateways,
    weather, // ← may be null
  } = data;

  // ✅ Safe weather access with fallbacks
  const w = weather || {};
  const temp =
    w.temperature != null
      ? `${w.temperature.toFixed ? w.temperature.toFixed(1) : w.temperature}°C`
      : "—°C";
  const weatherDesc = w.description || "";

  const total = r.online + r.offline;
  const pct = total > 0 ? Math.round((r.online / total) * 100) : 0;
  const gwOk = gateways[0]?.gateway_status;

  return (
    <div
      onClick={onClick}
      style={{
        background: isSelected ? HEALTH_BG[h] : "rgba(255,255,255,0.025)",
        // border: `1px solid ${isSelected ? HEALTH_BORDER[h] : "rgba(255,255,255,0.06)"}`,
        borderRadius: 10,
        padding: "10px 12px",
        cursor: "pointer",
        transition: "all 0.3s ease",
        animation: `fadeUp 0.4s ease ${animDelay}s both`,
        position: "relative",
        overflow: "hidden",
        height: "100%",
      }}
    >
      {/* Health accent line */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 3,
          //   background: HEALTH_COLOR[h],
          borderRadius: "10px 0 0 10px",
          //   boxShadow: `0 0 8px ${HEALTH_COLOR[h]}66`,
        }}
      />

      {/* Top row */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 8,
          paddingLeft: 6,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 11,
              //   fontWeight: 700,
              color: "#d8e8f5",
              //fontFamily: "'Barlow Condensed', sans-serif",
              letterSpacing: 0.3,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              lineHeight: 1.2,
            }}
          >
            {site.siteName.split(" - ")[1] ||
              site.siteName.split(" ").slice(0, 3).join(" ")}
          </div>
          <div
            style={{
              fontSize: 9,
              color: "#667788",
              letterSpacing: 1,
              marginTop: 1,
              //fontFamily: "'DM Mono', monospace",
            }}
          >
            📍{site.location}
          </div>
        </div>
        <div
          style={{
            fontSize: 9,
            fontWeight: 700,
            padding: "2px 5px",
            borderRadius: 4,
            background: `${HEALTH_COLOR[h]}18`,
            color: HEALTH_COLOR[h],
            letterSpacing: 1,
            //fontFamily: "'Barlow Condensed', sans-serif",
            flexShrink: 0,
            marginLeft: 4,
          }}
        >
          {HEALTH_LABEL[h]}
        </div>
      </div>

      {/* Metrics row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: 4,
          paddingLeft: 6,
        }}
      >
        <Metric
          icon="🤖"
          val={`${r.online}/${total}`}
          label="robots"
          color={r.online === 0 && total > 0 ? "#ff3355" : "#22dd88"}
        />
        <Metric
          icon="🧹"
          val={c.failure}
          label="fails"
          color={c.failure > 0 ? "#ff3355" : "#334455"}
        />
        <Metric
          icon="👷"
          val={t.length}
          label="techs"
          color={t.length === 0 ? "#f5a623" : "#22dd88"}
        />
        <Metric
          icon="📡"
          val={gwOk ? "ON" : "OFF"}
          label="gw"
          color={gwOk ? "#22dd88" : "#ff3355"}
        />
      </div>

      {/* Mini progress bar */}
      <div style={{ marginTop: 8, paddingLeft: 6 }}>
        <div
          style={{
            height: 3,
            background: "rgba(255,255,255,0.06)",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${pct}%`,
              height: "100%",
              background:
                pct > 50 ? "#22dd88" : pct > 20 ? "#f5a623" : "#ff3355",
              borderRadius: 2,
              transition: "width 1s ease",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 2,
          }}
        >
          <span
            style={{
              fontSize: 9,
              color: "#445566",
              //fontFamily: "'DM Mono', monospace",
            }}
          >
            {pct}% online
          </span>
          <span
            style={{
              fontSize: 9,
              color: "#445566",
              //fontFamily: "'DM Mono', monospace",
            }}
          >
            {/* ✅ Safe: shows — if weather is null */}
            {weather ? `${temp} ${wIcon(weatherDesc)}` : "— no weather"}
          </span>
        </div>
      </div>
    </div>
  );
};

const Metric = ({ icon, val, label, color }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      background: "rgba(255,255,255,0.03)",
      borderRadius: 5,
      padding: "3px 2px",
    }}
  >
    <span
      style={{
        fontSize: 12,
        fontWeight: 800,
        color,
        //fontFamily: "'DM Mono', monospace",
        lineHeight: 1,
      }}
    >
      {val}
    </span>
    <span
      style={{
        fontSize: 8,
        color: "#445566",
        letterSpacing: 0.5,
        marginTop: 1,
        //fontFamily: "'Barlow Condensed', sans-serif",
      }}
    >
      {icon}
      {label}
    </span>
  </div>
);

/* ══════════════════════════════════════════════
   DETAIL PANEL  (right side)
══════════════════════════════════════════════ */
const DetailPanel = ({ data }) => {
  const {
    cleaning_data: c,
    robot_data: r,
    weather, // ← may be null
    technician_data: techs,
    gateways,
    site,
  } = data;

  // ✅ Safe weather access with fallbacks
  const w = weather || {};

  const h = getHealth(data);
  const total = r.online + r.offline;
  const pct = total > 0 ? Math.round((r.online / total) * 100) : 0;
  const circumference = 2 * Math.PI * 38;

  return (
    <div
      key={site.site_id}
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        animation: "slideIn 0.5s ease both",
      }}
    >
      {/* Site name header */}
      <div
        style={{
          background: HEALTH_BG[h],
          border: `1px solid ${HEALTH_BORDER[h]}`,
          borderRadius: 14,
          padding: "16px 20px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 6,
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: HEALTH_COLOR[h],
                  boxShadow: `0 0 12px ${HEALTH_COLOR[h]}`,
                }}
              />
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: HEALTH_COLOR[h],
                  letterSpacing: 2,
                  //fontFamily: "'Barlow Condensed', sans-serif",
                }}
              >
                {HEALTH_LABEL[h]}
              </span>
            </div>
            <div
              style={{
                fontSize: 20,
                // fontWeight: 800,
                color: "#eef4ff",
                //fontFamily: "'Barlow Condensed', sans-serif",
                lineHeight: 1.2,
              }}
            >
              {site.siteName},<span className="ms-1">{site.location}</span>
            </div>
            <div
              style={{
                fontSize: 11,
                color: "#8899aa",
                marginTop: 4,
                //fontFamily: "'DM Mono', monospace",
                letterSpacing: 0.5,
              }}
            >
              &nbsp;&nbsp;
              <span style={{ textTransform: "uppercase", color: "#f5a623" }}>
                {site.site_type}
              </span>
            </div>
          </div>

          <div
            style={{
              position: "relative",
              width: 84,
              height: 84,
              flexShrink: 0,
            }}
          >
            <svg width="84" height="84" style={{ transform: "rotate(-90deg)" }}>
              <circle
                cx="42"
                cy="42"
                r="38"
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="8"
              />
              <circle
                cx="42"
                cy="42"
                r="38"
                fill="none"
                stroke={pct > 50 ? "#22dd88" : pct > 20 ? "#f5a623" : "#ff3355"}
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - pct / 100)}
                strokeLinecap="round"
                style={{
                  transition: "stroke-dashoffset 1s ease",
                  filter: `drop-shadow(0 0 6px ${pct > 50 ? "#22dd88" : pct > 20 ? "#f5a623" : "#ff3355"})`,
                }}
              />
            </svg>
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontSize: 19,
                  fontWeight: 800,
                  color: "#eef4ff",
                  //fontFamily: "'DM Mono', monospace",
                  lineHeight: 1,
                }}
              >
                {pct}%
              </span>
              <span style={{ fontSize: 8, color: "#8899aa", letterSpacing: 1 }}>
                ONLINE
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Robot ring + stats */}
      <div
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 14,
          padding: "14px 18px",
          display: "flex",
          alignItems: "center",
          gap: 18,
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 11,
              color: "#8899aa",
              //fontFamily: "'Barlow Condensed', sans-serif",
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            🤖 Robot Fleet
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 4,
            }}
          >
            {[
              ["Online ", r.online, "#22dd88"],
              ["Offline ", r.offline, "#ff3355"],
              ["Total ", total, "#aabbcc"],
              ["completed ", c.completed, "#22dd88"],
              ["in-progress ", c.inprogress, "#f5a623"],
              ["failed ", c.failure, "#ff3355"],
            ].map(([l, v, col]) => (
              <div key={l}>
                <span
                  style={{
                    fontSize: 12,
                    color: "#667788",
                    //fontFamily: "'Barlow Condensed', sans-serif",
                    letterSpacing: 1,
                  }}
                >
                  {l}
                </span>
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    color: col,
                    //fontFamily: "'DM Mono', monospace",
                  }}
                >
                  {v}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cleaning + Weather row */}
      <div style={{}}>
        {/* Cleaning */}
        {/* <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 14,
            padding: "12px 14px",
          }}
        >
          <div
            style={{
              fontSize: 10,
              color: "#8899aa",
              //fontFamily: "'Barlow Condensed', sans-serif",
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            🧹 Cleaning
          </div>
          {[
            ["Done", c.completed, "#22dd88"],
            ["Running", c.inprogress, "#f5a623"],
            ["Failed", c.failure, "#ff3355"],
          ].map(([l, v, col]) => (
            <div
              key={l}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 5,
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  color: "#556677",
                  //fontFamily: "'Barlow Condensed', sans-serif",
                }}
              >
                {l}
              </span>
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: v > 0 ? col : "#2a3a4a",
                  //fontFamily: "'DM Mono', monospace",
                  lineHeight: 1,
                }}
              >
                {v}
              </span>
            </div>
          ))}
        </div> */}

        {/* Weather — fully null-safe */}
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 14,
            padding: "12px 14px",
          }}
        >
          <div
            style={{
              fontSize: 10,
              color: "#8899aa",
              //fontFamily: "'Barlow Condensed', sans-serif",
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            🌤 Weather
          </div>
          {weather ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  fontSize: 30,
                  fontWeight: 800,
                  //fontFamily: "'DM Mono', monospace",
                  color: "#f5a623",
                  lineHeight: 1,
                  marginRight: 90,
                }}
              >
                {/* ✅ Safe: w.temperature may be int or float */}
                {w.temperature != null
                  ? typeof w.temperature === "number"
                    ? w.temperature.toFixed(1)
                    : w.temperature
                  : "—"}
                <span style={{ fontSize: 14, fontWeight: 400 }}>°C</span>
              </div>
              <div
                style={{
                  fontSize: 18,
                  color: "#667788",
                  textTransform: "capitalize",
                  margin: "3px 0 6px",
                  marginRight: 12,
                  //fontFamily: "'Barlow Condensed', sans-serif",
                }}
              >
                {wIcon(w.description)} {w.description || "—"}
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 3,
                }}
              >
                {[
                  ["💧", w.humidity != null ? `${w.humidity}%` : "—"],
                  [
                    "💨",
                    w.wind_speed != null
                      ? `${typeof w.wind_speed === "number" ? w.wind_speed.toFixed(1) : w.wind_speed}m/s`
                      : "—",
                  ],
                ].map(([ico, val]) => (
                  <div
                    key={ico}
                    style={{
                      fontSize: 18,
                      color: "#556677",
                      marginRight: 12,
                      //fontFamily: "'DM Mono', monospace",
                    }}
                  >
                    {ico} {val}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* ✅ Graceful empty state when weather is null */
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: 20,
                gap: 6,
              }}
            >
              <span style={{ fontSize: 24 }}>🌫</span>
              <span
                style={{
                  fontSize: 9,
                  color: "#445566",
                  letterSpacing: 2,
                  //fontFamily: "'Barlow Condensed', sans-serif",
                }}
              >
                NO DATA
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Techs */}
      <div
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 14,
          padding: "12px 14px",
        }}
      >
        <div
          style={{
            fontSize: 10,
            color: "#8899aa",
            //fontFamily: "'Barlow Condensed', sans-serif",
            letterSpacing: 2,
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          👷 On-Site Technicians
        </div>
        {techs.length > 0 ? (
          techs.slice(0, 3).map((t, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: i < techs.length - 1 ? 6 : 0,
              }}
            >
              {/* ✅ Show profile image if available, else emoji avatar */}
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: t.profile_image
                    ? "transparent"
                    : "rgba(245,166,35,0.15)",
                  border: "1px solid rgba(245,166,35,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  flexShrink: 0,
                  overflow: "hidden",
                }}
              >
                {t.profile_image ? (
                  <img
                    src={t.profile_image}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "50%",
                    }}
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.parentNode.textContent = "👷";
                    }}
                  />
                ) : (
                  "👷"
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#d8e8f5",
                    //fontFamily: "'Barlow Condensed', sans-serif",
                  }}
                >
                  {t.username}
                </div>
                <div
                  style={{
                    fontSize: 9,
                    color: "#667788",
                    //fontFamily: "'DM Mono', monospace",
                  }}
                >
                  In: {fmtTime(t.punchin_time)}
                </div>
              </div>
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#22dd88",
                  boxShadow: "0 0 6px #22dd88",
                }}
              />
            </div>
          ))
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "8px",
              color: "#f5a623",
              fontSize: 11,
              ////fontFamily: "'Barlow Condensed', sans-serif",
              letterSpacing: 1,
              opacity: 0.7,
            }}
          >
            ⚠ No technician on-site
          </div>
        )}
      </div>

      {/* Gateway */}
      {/* <div
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 14,
          padding: "10px 14px",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: gateways[0]?.gateway_status ? "#22dd88" : "#ff3355",
            boxShadow: `0 0 8px ${gateways[0]?.gateway_status ? "#22dd88" : "#ff3355"}88`,
            animation: "pulse 2s infinite",
          }}
        />
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 11,
              color: "#aabbc8",
              //fontFamily: "'DM Mono', monospace",
            }}
          >
            {gateways[0]?.gateway_name || "—"}
          </div>
          <div style={{ fontSize: 9, color: "#445566" }}>
            Last uplink: {fmtTime(gateways[0]?.last_uplink)}
          </div>
        </div>
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: gateways[0]?.gateway_status ? "#22dd88" : "#ff3355",
            //fontFamily: "'Barlow Condensed', sans-serif",
            letterSpacing: 1,
          }}
        >
          {gateways[0]?.gateway_status ? "ONLINE" : "OFFLINE"}
        </span>
      </div> */}

      {/* Gateways — all listed */}
      <div
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 14,
          padding: "12px 14px",
        }}
      >
        <div
          style={{
            fontSize: 10,
            color: "#8899aa",
            //fontFamily: "'Barlow Condensed', sans-serif",
            letterSpacing: 2,
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          📡 Gateways ({gateways.length})
        </div>
        {gateways.length > 0 ? (
          gateways.map((gw, i) => (
            <div
              key={gw.gateway_name || i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "6px 0",
                borderBottom:
                  i < gateways.length - 1
                    ? "1px solid rgba(255,255,255,0.04)"
                    : "none",
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  flexShrink: 0,
                  background: gw.gateway_status ? "#22dd88" : "#ff3355",
                  boxShadow: `0 0 8px ${gw.gateway_status ? "#22dd88" : "#ff3355"}88`,
                  animation: "pulse 2s infinite",
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 11,
                    color: "#aabbc8",
                    //fontFamily: "'DM Mono', monospace",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {gw.gateway_name || `Gateway ${i + 1}`}
                </div>
                <div
                  style={{
                    fontSize: 9,
                    color: "#445566",
                    //fontFamily: "'DM Mono', monospace",
                  }}
                >
                  Last uplink: {fmtTime(gw.last_uplink)}
                </div>
              </div>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: gw.gateway_status ? "#22dd88" : "#ff3355",
                  //fontFamily: "'Barlow Condensed', sans-serif",
                  letterSpacing: 1,
                  flexShrink: 0,
                }}
              >
                {gw.gateway_status ? "ONLINE" : "OFFLINE"}
              </span>
            </div>
          ))
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "8px",
              color: "#445566",
              fontSize: 11,
              //fontFamily: "'Barlow Condensed', sans-serif",
              letterSpacing: 1,
              opacity: 0.7,
            }}
          >
            No gateways configured
          </div>
        )}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════
   FLEET SUMMARY BAR
══════════════════════════════════════════════ */
const FleetStat = ({ label, value, color, sub }) => (
  <div
    style={{
      textAlign: "center",
      padding: "0 16px",
      borderRight: "1px solid rgba(255,255,255,0.06)",
    }}
  >
    <div
      style={{
        fontSize: 26,
        fontWeight: 800,
        //fontFamily: "'DM Mono', monospace",
        color: color || "#eef4ff",
        lineHeight: 1,
      }}
    >
      {value}
    </div>
    <div
      style={{
        fontSize: 9,
        color: "#667788",
        letterSpacing: 2,
        textTransform: "uppercase",
        //fontFamily: "'Barlow Condensed', sans-serif",
        marginTop: 2,
      }}
    >
      {label}
    </div>
    {sub && (
      <div
        style={{
          fontSize: 9,
          color: "#445566",
          //fontFamily: "'DM Mono', monospace",
        }}
      >
        {sub}
      </div>
    )}
  </div>
);

/* ══════════════════════════════════════════════
   ALERT TICKER
══════════════════════════════════════════════ */
const AlertTicker = ({ criticals }) => {
  if (criticals.length === 0) return null;
  const text = criticals
    .map((d) =>
      `⚠ ${d.site.siteName},${d.site.location} — ${d.cleaning_data.failure > 0 ? `${d.cleaning_data.failure} cleaning failure(s)` : ""} ${!d.gateways[0]?.gateway_status ? "Gateway offline" : ""} ${d.robot_data.online === 0 && d.robot_data.offline > 5 ? "All robots offline" : ""}`.trim(),
    )
    .join("   ·   ");
  return (
    <div
      style={{
        background: "rgba(255,51,85,0.08)",
        borderTop: "1px solid rgba(255,51,85,0.2)",
        padding: "6px 0",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          display: "inline-block",
          whiteSpace: "nowrap",
          animation: "ticker 150s linear infinite",
          fontSize: 11,
          color: "#ff5577",
          //fontFamily: "'DM Mono', monospace",
          letterSpacing: 1,
          paddingLeft: "100%",
        }}
      >
        🚨 CRITICAL ALERTS &nbsp;&nbsp; {text} &nbsp;&nbsp;&nbsp; {text}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════
   MAIN DASHBOARD
══════════════════════════════════════════════ */
const LiveDashboard = () => {
  const [sites, setSites] = useState([]);
  const [selected, setSelected] = useState(0);
  const [now, setNow] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);
  const [filterHealth, setFilter] = useState("all");
  const gridRef = useRef(null);
  const detailTimer = useRef(null);
  const DETAIL_INTERVAL = 7000;

  /* ── Fetch & normalise ── */
  const fetchData = useCallback(async () => {
    try {
      const r = await fetch("/api/v1/sites/today/live-data");
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const j = await r.json();
      const arr = Array.isArray(j) ? j : j.data || [];
      if (!arr.length) throw new Error("empty response");

      // ✅ Normalise each site: guarantee weather is either an object or null (never undefined)
      const normalised = arr.map((site) => ({
        ...site,
        weather:
          site.weather && typeof site.weather === "object"
            ? site.weather
            : null,
        technician_data: Array.isArray(site.technician_data)
          ? site.technician_data
          : [],
        gateways: Array.isArray(site.gateways) ? site.gateways : [],
        cleaning_data: site.cleaning_data || {
          completed: 0,
          inprogress: 0,
          failure: 0,
        },
        robot_data: site.robot_data || { online: 0, offline: 0 },
      }));

      setSites(normalised);
      setApiError(false);
    } catch (err) {
      console.warn("API unavailable, using mock data:", err.message);
      setSites(MOCK_DATA);
      setApiError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, 60000);
    return () => clearInterval(id);
  }, [fetchData]);

  /* Clock */
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  /* Sort: critical → warning → healthy */
  const sorted = [...sites].sort((a, b) => {
    const order = { critical: 0, warning: 1, healthy: 2 };
    return order[getHealth(a)] - order[getHealth(b)];
  });

  const filtered =
    filterHealth === "all"
      ? sorted
      : sorted.filter((d) => getHealth(d) === filterHealth);

  const priorityList = [
    ...sorted.filter((d) => getHealth(d) === "critical"),
    ...sorted.filter((d) => getHealth(d) === "warning"),
    ...sorted.filter((d) => getHealth(d) === "healthy"),
  ];

  /* Auto-cycle detail */
  useEffect(() => {
    if (priorityList.length === 0) return;
    detailTimer.current = setInterval(() => {
      setSelected((prev) => {
        const nextIdx = (prev + 1) % priorityList.length;
        const el = document.getElementById(`site-card-${nextIdx}`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
        return nextIdx;
      });
    }, DETAIL_INTERVAL);
    return () => clearInterval(detailTimer.current);
  }, [priorityList.length]);

  /* Fleet stats */
  const totalRobots = sites.reduce(
    (a, d) => a + d.robot_data.online + d.robot_data.offline,
    0,
  );
  const onlineRobots = sites.reduce((a, d) => a + d.robot_data.online, 0);
  const totalFailures = sites.reduce((a, d) => a + d.cleaning_data.failure, 0);
  const totalTechs = sites.reduce((a, d) => a + d.technician_data.length, 0);
  const criticals = sites.filter((d) => getHealth(d) === "critical");
  const warnings = sites.filter((d) => getHealth(d) === "warning");
  const healthyCount = sites.filter((d) => getHealth(d) === "healthy");
  // ADD THESE THREE:
  const totalCompleted = sites.reduce(
    (a, d) => a + (d.cleaning_data?.completed || 0),
    0,
  );
  const totalInProgress = sites.reduce(
    (a, d) => a + (d.cleaning_data?.inprogress || 0),
    0,
  );
  const gateway_totals = sites.reduce(
    (a, d) =>
      a +
      (d.gateways?.filter((g) => g.gateway_status === true).length || 0) +
      (d.gateways?.filter((g) => g.gateway_status === false).length || 0),
    0,
  );

  const totalOnline = sites.reduce(
    (a, d) =>
      a + (d.gateways?.filter((g) => g.gateway_status === true).length || 0),
    0,
  );

  const totalOffline = sites.reduce(
    (a, d) =>
      a + (d.gateways?.filter((g) => g.gateway_status === false).length || 0),
    0,
  );
  const detailData = priorityList[selected] || sorted[0];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;600;700;800;900&family=DM+Mono:ital,wght@0,400;0,500;1,400&display=swap');
        @keyframes ticker    { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes pulse     { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes spin      { to{transform:rotate(360deg)} }
        @keyframes fadeUp    { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn   { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
        * { box-sizing:border-box; margin:0; padding:0; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-track { background:rgba(255,255,255,0.02); }
        ::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.08); border-radius:2px; }
        .site-card-hover:hover { border-color:rgba(255,255,255,0.15) !important; background:rgba(255,255,255,0.05) !important; border-radius:10px  !important}
      `}</style>

      <div
        style={{
          width: "100vw",
          height: "100vh",
          //   background: "#070b12",
          //   backgroundImage:
          //     "radial-gradient(ellipse at 15% 15%, rgba(245,166,35,0.05) 0%,transparent 55%), radial-gradient(ellipse at 85% 85%, rgba(34,120,200,0.05) 0%,transparent 55%), radial-gradient(ellipse at 50% 50%, rgba(255,51,85,0.02) 0%,transparent 70%)",
          //fontFamily: "'Barlow Condensed',sans-serif",
          color: "#e8f0fa",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* ── TOP BAR ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "10px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            background: "rgba(0,0,0,0.3)",
            flexShrink: 0,
            gap: 16,
          }}
        >
          {/* Brand */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginRight: 8,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 900,
                  letterSpacing: 2,
                  color: "#f5f8ff",
                }}
              >
                <CImage
                  src={TayproLogo}
                  alt="Logo"
                  width={200}
                  height={50}
                  style={{
                    objectFit: "contain",
                    marginBottom: "20px",
                  }}
                  className="mb-3"
                />
              </div>
            </div>
          </div>
          <div
            style={{
              width: 1,
              height: 32,
              background: "rgba(255,255,255,0.07)",
            }}
          />

          {/* Fleet stats */}
          <div style={{ display: "flex", alignItems: "stretch", gap: 0 }}>
            <FleetStat
              label="Total Sites"
              value={sites.length}
              color="#eef4ff"
            />
            <FleetStat
              label="Critical"
              value={criticals.length}
              color={criticals.length > 0 ? "#ff3355" : "#334455"}
            />
            <FleetStat
              label="Warning"
              value={warnings.length}
              color={warnings.length > 0 ? "#f5a623" : "#334455"}
            />
            <FleetStat
              label="Healthy"
              value={healthyCount.length}
              color="#22dd88"
            />
            <FleetStat
              label="Robots Online"
              value={onlineRobots}
              color="#22dd88"
              sub={`/ ${totalRobots} total`}
            />
            <FleetStat
              label="Clean Failures"
              value={totalFailures}
              color={totalFailures > 0 ? "#ff3355" : "#334455"}
            />
            <FleetStat
              label="Completed"
              value={totalCompleted}
              color="#22dd88"
            />
            <FleetStat
              label="In Progress"
              value={totalInProgress}
              color={totalInProgress > 0 ? "#f5a623" : "#334455"}
            />
            <FleetStat
              label="Gateway Online"
              value={totalOnline || 0}
              color="#22dd88"
              sub={`/ ${gateway_totals || 0} total`}
            />

            <FleetStat
              label="Gateway Offline"
              value={totalOffline || 0}
              color="#ff4d4f"
              sub={`/ ${gateway_totals || 0} total`}
            />
            <FleetStat
              label="On-Site Techs"
              value={totalTechs}
              color="#f5a623"
            />
          </div>
          <div style={{ flex: 1 }} />

          {/* Live status */}
          {/* <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginRight: 12,
            }}
          >
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: apiError ? "#f5a623" : "#22dd88",
                animation: "pulse 2s infinite",
                boxShadow: `0 0 8px ${apiError ? "#f5a623" : "#22dd88"}`,
              }}
            />
            <span
              style={{
                fontSize: 9,
                color: "#556677",
                letterSpacing: 2,
                //fontFamily: "'DM Mono',monospace",
              }}
            >
              {apiError ? "DEMO" : "LIVE"}
            </span>
          </div> */}

          {/* Clock */}
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: 22,
                fontWeight: 500,
                //fontFamily: "'DM Mono',monospace",
                letterSpacing: -1,
                lineHeight: 1,
              }}
            >
              {fmtClock(now)}
            </div>
            <div
              style={{
                fontSize: 9,
                color: "#8899aa",
                letterSpacing: 2,
                marginTop: 1,
              }}
            >
              {fmtDate(now)}
            </div>
          </div>
        </div>

        {/* ── FILTER BAR ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "7px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            background: "rgba(0,0,0,0.15)",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: 10,
              color: "#445566",
              letterSpacing: 2,
              //fontFamily: "'Barlow Condensed',sans-serif",
              marginRight: 4,
            }}
          >
            FILTER:
          </span>
          {[
            ["all", "All Sites", "#aabbcc"],
            ["critical", "Critical", "#ff3355"],
            ["warning", "Warning", "#f5a623"],
            ["healthy", "Healthy", "#22dd88"],
          ].map(([key, label, col]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              style={{
                padding: "3px 12px",
                borderRadius: 16,
                border: `1px solid ${filterHealth === key ? col + "55" : "rgba(255,255,255,0.06)"}`,
                background: filterHealth === key ? `${col}15` : "transparent",
                color: filterHealth === key ? col : "#445566",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 1,
                cursor: "pointer",
                //fontFamily: "'Barlow Condensed',sans-serif",
                transition: "all 0.2s",
              }}
            >
              {label}{" "}
              {key !== "all" &&
                `(${key === "critical" ? criticals.length : key === "warning" ? warnings.length : healthyCount.length})`}
            </button>
          ))}
          <span
            style={{
              marginLeft: "auto",
              fontSize: 12,
              color: "#fff",
              //fontFamily: "'DM Mono',monospace",
            }}
          >
            {filtered.length} sites shown · auto-cycling detail every{" "}
            {DETAIL_INTERVAL / 1000}s
          </span>
        </div>

        {/* ── MAIN BODY ── */}
        <div
          style={{
            flex: 1,
            display: "flex",
            gap: 0,
            minHeight: 0,
            overflow: "hidden",
          }}
        >
          {/* LEFT: site grid */}
          <div
            ref={gridRef}
            style={{
              flex: "0 0 62%",
              overflowY: "auto",
              padding: "12px 10px 12px 16px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(185px,1fr))",
              alignContent: "start",
              gap: 8,
            }}
          >
            {loading ? (
              <div
                style={{
                  gridColumn: "1/-1",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 200,
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    border: "3px solid rgba(245,166,35,0.2)",
                    borderTopColor: "#f5a623",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }}
                />
                <span
                  style={{ fontSize: 11, color: "#667788", letterSpacing: 3 }}
                >
                  LOADING SITES…
                </span>
              </div>
            ) : filtered.length === 0 ? (
              <div
                style={{
                  gridColumn: "1/-1",
                  textAlign: "center",
                  padding: 40,
                  color: "#334455",
                  fontSize: 13,
                  letterSpacing: 2,
                }}
              >
                NO SITES MATCH FILTER
              </div>
            ) : (
              filtered.map((d, i) => {
                const globalIdx = priorityList.indexOf(d);
                return (
                  <div
                    id={`site-card-${globalIdx}`}
                    key={d.site.site_id || i}
                    className="site-card-hover"
                  >
                    <SiteCard
                      data={d}
                      isSelected={detailData?.site?.site_id === d.site.site_id}
                      onClick={() => {
                        clearInterval(detailTimer.current);
                        setSelected(globalIdx >= 0 ? globalIdx : 0);
                      }}
                      animDelay={i * 0.03}
                    />
                  </div>
                );
              })
            )}
          </div>

          {/* Divider */}
          <div
            style={{
              width: 1,
              background: "rgba(255,255,255,0.06)",
              flexShrink: 0,
            }}
          />

          {/* RIGHT: detail panel */}
          <div
            style={{
              flex: "0 0 38%",
              overflowY: "auto",
              padding: "14px 16px 14px 14px",
            }}
          >
            {!loading && detailData && (
              <>
                <div
                  style={{
                    fontSize: 9,
                    color: "#fff",
                    letterSpacing: 3,
                    //fontFamily: "'Barlow Condensed',sans-serif",
                    textTransform: "uppercase",
                    marginBottom: 10,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>Site Detail</span>
                  <span style={{ color: "#fff" }}>
                    {priorityList.indexOf(detailData) + 1} /{" "}
                    {priorityList.length}
                    &nbsp;·&nbsp;
                    {getHealth(detailData) === "critical"
                      ? "🔴"
                      : getHealth(detailData) === "warning"
                        ? "🟡"
                        : "🟢"}{" "}
                    priority
                  </span>
                </div>
                <DetailPanel data={detailData} />
              </>
            )}
          </div>
        </div>

        {/* ── ALERT TICKER ── */}
        {/* {!loading && <AlertTicker criticals={criticals} />} */}

        {/* ── FOOTER ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "5px 20px",
            borderTop: "1px solid rgba(255,255,255,0.04)",
            background: "rgba(0,0,0,0.2)",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 8, color: "#1a2530", letterSpacing: 3 }}>
            TAYPRO SOLAR OPERATIONS © 2026
          </span>
          <span style={{ fontSize: 8, color: "#1a2530", letterSpacing: 3 }}>
            LOBBY DISPLAY v3.1 · {sites.length} SITES MONITORED
          </span>
        </div>
      </div>
    </>
  );
};

export default LiveDashboard;
