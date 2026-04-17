import React, { useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────────
   Weather.jsx  –  premium weather card
   Props:
     weatherType : "sunny" | "rainy" | "cloudy" | "foggy"
     weatherData : { temperature, cloudiness, wind_speed,
                     humidity, description, time }
     siteName    : string
   ───────────────────────────────────────────────────────── */

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

export default function Weather({
  weatherType = "sunny",
  weatherData = {},
  siteName,
  logo,
}) {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    drops: [],
    clouds: [],
    fogBands: [],
    sparks: [],
    frame: 0,
    type: weatherType,
  });
  const rafRef = useRef(null);
  const theme = THEMES[weatherType] || THEMES.sunny;

  /* ── canvas animation ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    stateRef.current.type = weatherType;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      init();
    };

    const init = () => {
      const W = canvas.width,
        H = canvas.height;
      const s = stateRef.current;

      /* clouds */
      const cc = {
        rainy: "#3a4a62",
        cloudy: "#6a7d94",
        foggy: "#7a9aaa",
        sunny: "#e0eeff",
      }[weatherType];
      const co = { rainy: 0.9, cloudy: 0.8, foggy: 0.5, sunny: 0.55 }[
        weatherType
      ];
      const cn = { rainy: 5, cloudy: 4, foggy: 3, sunny: 2 }[weatherType];
      s.clouds = Array.from({ length: cn }, (_, i) => ({
        x: (W / cn) * i - 40,
        y: H * (0.03 + i * 0.06),
        w: 120 + Math.random() * 90,
        opacity: co - Math.random() * 0.12,
        speed: 0.15 + Math.random() * 0.22,
        color: cc,
      })).map((c) => ({ ...c, h: c.w * 0.36 }));

      /* rain */
      s.drops =
        weatherType === "rainy"
          ? Array.from({ length: 200 }, () => ({
              x: Math.random() * W,
              y: Math.random() * H,
              len: 12 + Math.random() * 20,
              speed: 10 + Math.random() * 9,
              opacity: 0.3 + Math.random() * 0.5,
              thick: 0.8 + Math.random() * 0.9,
            }))
          : [];

      /* fog */
      s.fogBands =
        weatherType === "foggy"
          ? [0.25, 0.45, 0.62, 0.8].map((f, i) => ({
              y: H * f,
              h: H * 0.2,
              opacity: 0.5 - i * 0.06,
              speed: (i % 2 === 0 ? 1 : -1) * (0.1 + i * 0.03),
              offset: Math.random() * W,
            }))
          : [];
    };

    const drawSky = () => {
      const W = canvas.width,
        H = canvas.height;
      const g = ctx.createLinearGradient(0, 0, 0, H);
      theme.sky.forEach((c, i) =>
        g.addColorStop(i / (theme.sky.length - 1), c),
      );
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    };

    const drawCloud = ({ x, y, w, h, opacity, color }) => {
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.fillStyle = color;
      ctx.shadowColor = "rgba(0,0,0,0.3)";
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.roundRect(x, y + h * 0.35, w, h * 0.65, h * 0.32);
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
      ctx.restore();
    };

    const drawRain = (drops) => {
      const W = canvas.width;
      drops.forEach((d) => {
        ctx.save();
        const g = ctx.createLinearGradient(
          d.x,
          d.y,
          d.x + d.len * 0.2,
          d.y + d.len,
        );
        g.addColorStop(0, "rgba(147,196,255,0)");
        g.addColorStop(1, `rgba(147,196,255,${d.opacity})`);
        ctx.strokeStyle = g;
        ctx.lineWidth = d.thick;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + d.len * 0.2, d.y + d.len);
        ctx.stroke();
        ctx.restore();
        d.y += d.speed;
        d.x += d.speed * 0.2;
        if (d.y > canvas.height + 20) {
          d.y = -20;
          d.x = Math.random() * W;
        }
        if (d.x > W + 10) d.x = -5;
      });
    };

    const drawFog = (bands) => {
      const W = canvas.width;
      bands.forEach((b) => {
        b.offset += b.speed;
        const g = ctx.createLinearGradient(0, b.y, 0, b.y + b.h);
        g.addColorStop(0, "rgba(180,210,220,0)");
        g.addColorStop(0.5, `rgba(180,210,220,${b.opacity})`);
        g.addColorStop(1, "rgba(180,210,220,0)");
        ctx.save();
        ctx.fillStyle = g;
        ctx.fillRect((b.offset % (W * 0.5)) - W * 0.1, b.y, W * 1.2, b.h);
        ctx.restore();
      });
    };

    const drawSun = () => {
      const W = canvas.width,
        f = stateRef.current.frame;
      const cx = W * 0.78,
        cy = 55,
        r = 30;
      /* outer glow */
      const glow = ctx.createRadialGradient(cx, cy, r * 0.5, cx, cy, r * 3);
      glow.addColorStop(0, "rgba(255,220,60,0.28)");
      glow.addColorStop(1, "rgba(255,220,60,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 3, 0, Math.PI * 2);
      ctx.fill();
      /* rays */
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2 + f * 0.003;
        const pulse = 0.3 + 0.15 * Math.sin(f * 0.05 + i);
        ctx.save();
        ctx.globalAlpha = pulse;
        ctx.strokeStyle = "#FFD93D";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * (r + 6), cy + Math.sin(a) * (r + 6));
        ctx.lineTo(cx + Math.cos(a) * (r + 20), cy + Math.sin(a) * (r + 20));
        ctx.stroke();
        ctx.restore();
      }
      /* disc */
      const disc = ctx.createRadialGradient(cx - 5, cy - 5, 2, cx, cy, r);
      disc.addColorStop(0, "#FFF176");
      disc.addColorStop(1, "#FFB300");
      ctx.fillStyle = disc;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    };

    const loop = () => {
      const s = stateRef.current;
      s.frame++;
      drawSky();
      if (s.type === "sunny") drawSun();
      s.clouds.forEach((c) => {
        c.x += c.speed;
        if (c.x > canvas.width + 30) c.x = -c.w - 20;
        drawCloud(c);
      });
      if (s.type === "rainy") drawRain(s.drops);
      if (s.type === "foggy") drawFog(s.fogBands);
      rafRef.current = requestAnimationFrame(loop);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [weatherType]);

  /* ── helpers ── */
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

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        // fontFamily: "'Inter', 'Segoe UI', sans-serif",
        minHeight: 360,
      }}
    >
      {/* sky canvas */}
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

      {/* bottom gradient scrim for readability */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(160deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.45) 100%)",
        }}
      />

      {/* ── main content ── */}
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
        {/* ── row 1: site + description pill ── */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "end",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              // background: "rgba(255,255,255,0.14)",
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

        {/* ── row 2: hero temperature ── */}
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
              <>
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
              </>
            )}
            <div>
              {" "}
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
          {/* <div
            style={{
              fontSize: 13,
              opacity: 0.65,
              marginTop: 2,
              letterSpacing: "0.02em",
            }}
          >
            Feels like {fmt(weatherData.temperature, "°C")}
          </div> */}
        </div>

        {/* ── row 3: divider ── */}
        <div
          style={{
            height: 1,
            // background: "rgba(255,255,255,0.12)",
            margin: "14px 0",
            flexShrink: 0,
          }}
        />

        {/* ── row 4: three stat pills ── */}
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
              key={label}
              style={{
                background: "rgba(255,255,255,0.10)",
                backdropFilter: "blur(12px)",
                // border: "1px solid rgba(255,255,255,0.16)",
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
        {/* {logo && (
            <img
              src={logo}
              alt="Site Logo"
              style={{
                width: 140,
                height: 90,
                // marginTop: 10,
                // borderRadius: 20,
                padding: 10,
                objectFit: "contain",
                border: "1px solid white",
              }}
            />

        )} */}
        {/* ── spacer ── */}
        <div style={{ flex: 1, minHeight: 0 }} />

        {/* ── row 5: timestamp ── */}
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
            Last updated: <strong style={{ fontWeight: 600 }}>{timeStr}</strong>
          </div>
        )}
      </div>
    </div>
  );
}
