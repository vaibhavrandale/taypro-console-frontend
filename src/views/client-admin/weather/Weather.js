import {
  CBadge,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const THEMES = {
  rainy: {
    sky: ["#0d1b2e", "#162847", "#1e3a60"],
    accent: "#7eb8f7",
    glow: "rgba(100,160,255,0.18)",
    label: "Rain",
    emoji: "🌧️",
  },
  cloudy: {
    sky: ["#1e2a38", "#2e3f52", "#3d5269"],
    accent: "#a0bcd4",
    glow: "rgba(140,180,210,0.15)",
    label: "Cloudy",
    emoji: "☁️",
  },
  foggy: {
    sky: ["#1a2830", "#2a3c44", "#3a5060"],
    accent: "#b0cdd8",
    glow: "rgba(160,200,210,0.15)",
    label: "Foggy",
    emoji: "🌫️",
  },
  sunny: {
    sky: ["#0a2a6e", "#1a4fa8", "#2272d8"],
    accent: "#ffd966",
    glow: "rgba(255,210,80,0.22)",
    label: "Clear",
    emoji: "☀️",
  },
};

const weatherEmoji = (item) => {
  const desc = (item?.description || "").toLowerCase();
  if (item?.is_rain || desc.includes("rain") || desc.includes("drizzle"))
    return "🌧️";
  if (desc.includes("thunder")) return "⛈️";
  if (desc.includes("snow")) return "❄️";
  if (desc.includes("fog") || desc.includes("mist") || desc.includes("haze"))
    return "🌫️";
  if ((item?.cloudiness ?? 0) > 60 || desc.includes("cloud")) return "☁️";
  if (desc.includes("clear") || desc.includes("sun")) return "☀️";
  return "🌤️";
};

const hourLabel = (time) => {
  if (!time) return "--";
  return new Date(time).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });
};

export default function Weather({
  siteDetailsError,
  weatherType,
  weatherData = {},
  siteName,
  logo,
  siteId,
}) {
  const stateRef = useRef({
    drops: [],
    clouds: [],
    fogBands: [],
    sparks: [],
    frame: 0,
    type: weatherType,
  });

  const rafRef = useRef(null);
  const canvasRef = useRef(null);
  const theme = THEMES[weatherType] || THEMES.sunny;

  const [forecastOpen, setForecastOpen] = useState(false);
  const [todayWeather, setTodayWeather] = useState([]);
  const [loadingToday, setLoadingToday] = useState(false);
  const [todayError, setTodayError] = useState("");

  const openForecast = async () => {
    const id = siteId || weatherData?.site_id;
    if (!id) {
      setTodayError("Site id missing");
      setForecastOpen(true);
      return;
    }
    setForecastOpen(true);
    setLoadingToday(true);
    setTodayError("");
    try {
      const { data } = await axios.get(
        `/api/v1/weatherdata/client/${id}/today`,
        {
          withCredentials: true,
        },
      );
      setTodayWeather(data.data || []);
    } catch (e) {
      setTodayWeather([]);
      setTodayError(
        e.response?.data?.message ||
          e.response?.data?.error ||
          "Failed to load today's weather",
      );
    } finally {
      setLoadingToday(false);
    }
  };

  /* ── canvas animation (throttled + pause when off-screen/hidden) ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    stateRef.current.type = weatherType;

    let running = false;
    let visible = true;
    let lastTs = 0;
    const FPS_MS = 1000 / 20; // ~20fps — enough for weather, far cheaper than 60
    let skyGrad = null;
    let skyH = 0;

    const resize = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      if (!w || !h) return;
      // Cap pixel density — full retina + 60fps was melting the dashboard
      const dpr = Math.min(window.devicePixelRatio || 1, 1);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      skyGrad = null;
      skyH = 0;
      init(w, h);
    };

    const init = (W, H) => {
      const s = stateRef.current;

      const cc = {
        rainy: "#3a4a62",
        cloudy: "#6a7d94",
        foggy: "#7a9aaa",
        sunny: "#e0eeff",
      }[weatherType];
      const co = { rainy: 0.9, cloudy: 0.8, foggy: 0.5, sunny: 0.55 }[
        weatherType
      ];
      const cn = { rainy: 4, cloudy: 3, foggy: 2, sunny: 2 }[weatherType];
      s.clouds = Array.from({ length: cn }, (_, i) => ({
        x: (W / cn) * i - 40,
        y: H * (0.03 + i * 0.06),
        w: 120 + Math.random() * 90,
        opacity: co - Math.random() * 0.12,
        speed: 0.15 + Math.random() * 0.22,
        color: cc,
      })).map((c) => ({ ...c, h: c.w * 0.36 }));

      s.drops =
        weatherType === "rainy"
          ? Array.from({ length: 40 }, () => ({
              x: Math.random() * W,
              y: Math.random() * H,
              len: 12 + Math.random() * 16,
              speed: 8 + Math.random() * 7,
              opacity: 0.35 + Math.random() * 0.4,
              thick: 1,
            }))
          : [];

      s.fogBands =
        weatherType === "foggy"
          ? [0.3, 0.55, 0.78].map((f, i) => ({
              y: H * f,
              h: H * 0.18,
              opacity: 0.45 - i * 0.08,
              speed: (i % 2 === 0 ? 1 : -1) * (0.08 + i * 0.03),
              offset: Math.random() * W,
            }))
          : [];
    };

    const drawSky = (cssW, cssH) => {
      if (!skyGrad || skyH !== cssH) {
        skyGrad = ctx.createLinearGradient(0, 0, 0, cssH);
        theme.sky.forEach((c, i) =>
          skyGrad.addColorStop(i / (theme.sky.length - 1), c),
        );
        skyH = cssH;
      }
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, cssW, cssH);
    };

    const drawCloud = ({ x, y, w, h, opacity, color }) => {
      ctx.globalAlpha = opacity;
      ctx.fillStyle = color;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(x, y + h * 0.35, w, h * 0.65, h * 0.32);
      } else {
        ctx.rect(x, y + h * 0.35, w, h * 0.65);
      }
      ctx.fill();
      [
        { dx: w * 0.08, dy: -h * 0.5, r: h * 0.52 },
        { dx: w * 0.32, dy: -h * 0.72, r: h * 0.68 },
        { dx: w * 0.58, dy: -h * 0.52, r: h * 0.52 },
        { dx: w * 0.82, dy: -h * 0.32, r: h * 0.38 },
      ].forEach(({ dx, dy, r }) => {
        ctx.beginPath();
        ctx.arc(x + dx, y + h + dy, r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    };

    const drawRain = (drops, W, H) => {
      ctx.strokeStyle = "rgba(147,196,255,0.55)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + d.len * 0.2, d.y + d.len);
        d.y += d.speed;
        d.x += d.speed * 0.2;
        if (d.y > H + 20) {
          d.y = -20;
          d.x = Math.random() * W;
        }
        if (d.x > W + 10) d.x = -5;
      }
      ctx.stroke();
    };

    const drawFog = (bands, W) => {
      bands.forEach((b) => {
        b.offset += b.speed;
        ctx.fillStyle = `rgba(180,210,220,${b.opacity * 0.55})`;
        ctx.fillRect((b.offset % (W * 0.5)) - W * 0.1, b.y, W * 1.2, b.h);
      });
    };

    const drawSun = (W) => {
      const f = stateRef.current.frame;
      const cx = W * 0.78,
        cy = 55,
        r = 30;
      ctx.fillStyle = "rgba(255,220,60,0.22)";
      ctx.beginPath();
      ctx.arc(cx, cy, r * 2.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,217,61,0.45)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2 + f * 0.003;
        ctx.moveTo(cx + Math.cos(a) * (r + 6), cy + Math.sin(a) * (r + 6));
        ctx.lineTo(cx + Math.cos(a) * (r + 18), cy + Math.sin(a) * (r + 18));
      }
      ctx.stroke();
      ctx.fillStyle = "#FFB300";
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    };

    const loop = (ts) => {
      if (!running) return;
      rafRef.current = requestAnimationFrame(loop);
      if (!visible || document.hidden) return;
      if (ts - lastTs < FPS_MS) return;
      lastTs = ts;

      const s = stateRef.current;
      const cssW = canvas.offsetWidth;
      const cssH = canvas.offsetHeight;
      if (!cssW || !cssH) return;

      s.frame++;
      drawSky(cssW, cssH);
      if (s.type === "sunny") drawSun(cssW);
      s.clouds.forEach((c) => {
        c.x += c.speed;
        if (c.x > cssW + 30) c.x = -c.w - 20;
        drawCloud(c);
      });
      if (s.type === "rainy") drawRain(s.drops, cssW, cssH);
      if (s.type === "foggy") drawFog(s.fogBands, cssW);
    };

    const start = () => {
      if (running) return;
      running = true;
      lastTs = 0;
      rafRef.current = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (visible) start();
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting && entry.intersectionRatio > 0.05;
        if (visible && !document.hidden) start();
        else stop();
      },
      { threshold: [0, 0.05, 0.2] },
    );
    io.observe(canvas);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    document.addEventListener("visibilitychange", onVisibility);
    if (!document.hidden) start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [theme.sky, weatherType]);

  if (!weatherData) {
    return <div style={{ padding: 20, color: "#fff" }}>{siteDetailsError}</div>;
  }

  const fmt = (v, unit) =>
    v != null && v !== undefined ? `${v}${unit}` : `--${unit}`;
  const timeStr = weatherData?.time
    ? new Date(weatherData.time).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : null;

  const todayTitle = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "short",
    timeZone: "Asia/Kolkata",
  });

  return (
    <>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          minHeight: 360,
          borderRadius: "10px",
        }}
      >
        {siteDetailsError ? (
          <div
            className="border"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CBadge color="warning">{siteDetailsError}</CBadge>
          </div>
        ) : (
          <>
            <canvas
              ref={canvasRef}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                display: "block",
              }}
            />

            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(160deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.45) 100%)",
              }}
            />

            <div
              style={{
                position: "relative",
                zIndex: 2,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                padding: "20px 20px 16px",
                boxSizing: "border-box",
                color: "#ffffff",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 8,
                  flexShrink: 0,
                }}
              >
                <button
                  type="button"
                  onClick={openForecast}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    background: "rgba(255,255,255,0.14)",
                    border: "1px solid rgba(255,255,255,0.28)",
                    borderRadius: 20,
                    padding: "5px 12px",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    color: "#fff",
                    backdropFilter: "blur(8px)",
                    cursor: "pointer",
                  }}
                >
                  📅 Today&apos;s Forecast
                </button>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    border: "1px solid rgba(255,255,255,0.22)",
                    borderRadius: 20,
                    padding: "4px 10px",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: theme.accent,
                    backdropFilter: "blur(8px)",
                    flexShrink: 0,
                  }}
                >
                  {theme.emoji} {weatherData.description || theme.label}
                </div>
              </div>

              <div style={{ marginTop: 23, flexShrink: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 4,
                  }}
                >
                  {siteName && (
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        opacity: 0.95,
                        maxWidth: "65%",
                        lineHeight: 1.3,
                      }}
                    >
                      {siteName},&nbsp;{weatherData.location}
                    </div>
                  )}
                  <div>
                    <span
                      style={{
                        fontSize: 30,
                        fontWeight: 700,
                        lineHeight: 1,
                        color: "#ffffff",
                        textShadow: `0 0 40px ${theme.glow}, 0 2px 12px rgba(0,0,0,0.4)`,
                        letterSpacing: "-2px",
                        right: 9,
                      }}
                      className=" position-relative"
                    >
                      {weatherData.temperature ?? "--"}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 300,
                        right: 12,
                        opacity: 0.85,
                      }}
                      className=" position-absolute"
                    >
                      °C
                    </span>
                  </div>
                </div>
              </div>

              <div
                style={{
                  height: 1,
                  margin: "14px 0",
                  flexShrink: 0,
                }}
              />

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                  flexShrink: 0,
                }}
              >
                {[
                  {
                    icon: logo && (
                      <div className=" d-flex justify-content-center align-items-center  ">
                        <img
                          src={logo}
                          alt="Site Logo"
                          style={{
                            width: "90%",
                            height: 70,
                            objectFit: "contain",
                          }}
                        />
                      </div>
                    ),
                    value: "",
                    label: "",
                  },
                  {
                    icon: "💧",
                    value: fmt(weatherData.humidity, "%"),
                    label: "Humidity",
                  },
                  {
                    icon: "💨",
                    value: fmt(weatherData.wind_speed, " m/s"),
                    label: "Wind",
                  },
                  {
                    icon: "☁️",
                    value: fmt(weatherData.cloudiness, "%"),
                    label: "Cloud cover",
                  },
                ].map(({ icon, value, label }) => (
                  <div
                    key={label || "logo"}
                    style={{
                      background: "rgba(255,255,255,0.10)",
                      backdropFilter: "blur(12px)",
                      borderRadius: 14,
                      padding: "12px 10px 10px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 3,
                    }}
                  >
                    <span style={{ fontSize: 18 }}>{icon}</span>
                    <span
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: "#fff",
                        lineHeight: 1,
                      }}
                    >
                      {value}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        opacity: 0.6,
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                      }}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ flex: 1, minHeight: 0 }} />

              {timeStr && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    background: "rgba(0,0,0,0.28)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    borderRadius: 10,
                    padding: "7px 14px",
                    fontSize: 11,
                    opacity: 0.85,
                    letterSpacing: "0.03em",
                    flexShrink: 0,
                  }}
                >
                  <span style={{ opacity: 0.6 }}>🕐</span>
                  Last updated:{" "}
                  <strong style={{ fontWeight: 600 }}>{timeStr}</strong>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <CModal
        visible={forecastOpen}
        onClose={() => setForecastOpen(false)}
        alignment="center"
        size="xl"
        scrollable
        backdrop="static"
      >
        <CModalHeader
          style={{
            background:
              "linear-gradient(160deg, #0a2a6e 0%, #1a4fa8 55%, #162847 100%)",
            color: "#fff",
            borderBottom: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <CModalTitle style={{ fontSize: 22, fontWeight: 700 }}>
            {siteName || weatherData?.siteName || siteId || "Site"} ·{" "}
            {todayTitle}
          </CModalTitle>
        </CModalHeader>
        <CModalBody
          style={{
            background: "linear-gradient(180deg, #0d1b2e 0%, #162847 100%)",
            color: "#fff",
            padding: "24px 20px 28px",
          }}
        >
          <div
            style={{
              fontSize: 15,
              opacity: 0.75,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 16,
              paddingLeft: 4,
              fontWeight: 600,
            }}
          >
            Forecast
          </div>

          {loadingToday ? (
            <div
              style={{
                padding: 32,
                textAlign: "center",
                opacity: 0.8,
                fontSize: 16,
              }}
            >
              Loading today&apos;s weather…
            </div>
          ) : todayError ? (
            <div style={{ padding: 20, color: "#ffb4b4", fontSize: 15 }}>
              {todayError}
            </div>
          ) : todayWeather.length === 0 ? (
            <div
              style={{
                padding: 32,
                textAlign: "center",
                opacity: 0.75,
                fontSize: 16,
              }}
            >
              No weather records for today.
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 14,
                overflowX: "auto",
                paddingBottom: 10,
                WebkitOverflowScrolling: "touch",
                scrollbarWidth: "thin",
              }}
            >
              {todayWeather.map((item) => (
                <div
                  key={item._id || item.time}
                  style={{
                    minWidth: 128,
                    maxWidth: 140,
                    flex: "0 0 auto",
                    background: "rgba(255,255,255,0.10)",
                    border: "1px solid rgba(255,255,255,0.14)",
                    borderRadius: 20,
                    padding: "20px 14px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 10,
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      opacity: 0.9,
                      textAlign: "center",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {hourLabel(item.time)}
                  </div>
                  <div style={{ fontSize: 36, lineHeight: 1 }}>
                    {weatherEmoji(item)}
                  </div>
                  <div
                    style={{
                      fontSize: 26,
                      fontWeight: 700,
                      letterSpacing: "-0.5px",
                    }}
                  >
                    {item.temperature ?? "--"}°
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      opacity: 0.7,
                      textAlign: "center",
                      lineHeight: 1.3,
                      maxHeight: 36,
                      overflow: "hidden",
                    }}
                  >
                    {item.description || (item.is_rain ? "Rain" : "—")}
                  </div>
                  <div style={{ fontSize: 13, opacity: 0.6 }}>
                    💧 {item.humidity ?? "--"}%
                  </div>
                  <div style={{ fontSize: 13, opacity: 0.6 }}>
                    💨 {item.wind_speed ?? "--"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CModalBody>
      </CModal>
    </>
  );
}
