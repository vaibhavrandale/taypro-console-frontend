// import axios from "axios";
// import React, { useEffect, useReducer } from "react";
// import { useParams } from "react-router-dom";
// // ─── Reducer ──────────────────────────────────────────────────────────────────
// const reducer = (state, action) => {
//   switch (action.type) {
//     case "FETCH_MMS_REQUEST":
//       return { ...state, loadingMMS: true, error: "" };
//     case "FETCH_MMS_SUCCESS":
//       return {
//         ...state,
//         loadingMMS: false,
//         mms: action.payload,
//       };
//     case "FETCH_MMS_FAIL":
//       return {
//         ...state,
//         loadingMMS: false,
//         error: action.payload,
//       };
//     default:
//       return state;
//   }
// };
// const ViewMms = () => {
//   const { id } = useParams();
//   const [{ mms, loadingMMS, error }, dispatch] = useReducer(reducer, {
//     mms: null,
//     loadingMMS: true,
//     error: "",
//   });

//   const refetch = async () => {
//     try {
//       dispatch({ type: "FETCH_MMS_REQUEST" });
//       const resp = await axios.get(`/api/v1/mms-structure/${id}`, {
//         withCredentials: true,
//       });

//       dispatch({ type: "FETCH_MMS_SUCCESS", payload: resp.data });
//     } catch (e) {
//       // Dev fallback — remove in production
//       //   dispatch({ type: "FETCH_MMS_SUCCESS", payload: MOCK });
//       dispatch({
//         type: "FETCH_MMS_FAIL",
//         payload: e.response?.data?.message || e.response?.data?.error,
//       });
//       // toast.error(e.response?.data?.message);
//     }
//   };

//   useEffect(() => {
//     refetch();
//   }, [id]); // eslint-disable-line

//   return <div>ViewMms</div>;
// };

// export default ViewMms;

import axios from "axios";
import React, { useEffect, useReducer, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import mmsImage from "../../assets/images/mms.png";
// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK = {
  success: true,
  data: {
    mms_id: "MMS-ID-2627-1",
    client: { client_name: "Adani Solar", email: "admin@adanisolar.com" },
    site: { site_name: "Rajasthan Solar Plant", location: "Rajasthan" },
    mms_type_name: "2P MMS Structure",
    perlin: {
      type: "C",
      perlin_dimension: {
        height: { value: 120 },
        width: { value: 60 },
        thickness: { value: 5 },
        c_bar_height: { value: 30 },
        flenge_length: { value: 25 },
      },
    },
    rafter: {
      total_length: { value: 5000 },
      height: { value: 150 },
      width: { value: 80 },
      thickness: { value: 6 },
      c_bar_height: { value: 40 },
      perlin_dimension: {
        perlin_count: { value: 4 },
        module_to_perlin_gap: { value: 10 },
        perlin_to_perlin_gap: { value: 20 },
        center_perlin_to_perlin_gap: { value: 15 },
      },
    },
    braces: {
      a: {
        length: { value: 1000 },
        height: { value: 50 },
        width: { value: 40 },
        thickness: { value: 4 },
        c_bar_height: { value: 20 },
      },
      b: {
        length: { value: 1200 },
        height: { value: 55 },
        width: { value: 45 },
        thickness: { value: 5 },
        c_bar_height: { value: 22 },
      },
    },
    column: {
      total_length: { value: 6000 },
      piling_depth_length: { value: 1500 },
      upper_ground_length: { value: 4500 },
      pilling_diameter: { value: 300 },
      height: { value: 180 },
      width: { value: 100 },
      thickness: { value: 8 },
      c_bar_height: { value: 50 },
    },
    status: "draft",
    remark: "2P MMS Structure Testing",
    last_activity: [
      {
        name: "Vishwajeet Usnale",
        role: "Master Admin",
        timestamp: "2026-05-27T07:44:46.849Z",
        details: "Doc created.",
      },
    ],
  },
};

// ─── Reducer ──────────────────────────────────────────────────────────────────
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_MMS_REQUEST":
      return { ...state, loadingMMS: true, error: "" };
    case "FETCH_MMS_SUCCESS":
      return { ...state, loadingMMS: false, mms: action.payload };
    case "FETCH_MMS_FAIL":
      return { ...state, loadingMMS: false, error: action.payload };
    default:
      return state;
  }
};

// ─── Annotation Components ────────────────────────────────────────────────────

/**
 * Renders a dimension label at (lx, ly) with a leader line to the structural element.
 * anchor: where the label box is positioned relative to the point
 *   "right" | "left" | "top" | "bottom"
 */
const DimAnnotation = ({
  px,
  py, // pointer/tip coordinates
  lx,
  ly, // label box anchor point (could differ from pointer)
  label,
  value,
  unit = "mm",
  color,
  side = "right", // label goes to the right or left of lx,ly
  active,
  onEnter,
  onLeave,
  id,
}) => {
  const boxW = 148;
  const boxH = 26;
  const r = 5;

  // Box position
  const bx = side === "right" ? lx + 10 : lx - boxW - 10;
  const by = ly - boxH / 2;

  // Leader goes from pointer tip to the nearest edge of the box
  const leaderX = side === "right" ? bx : bx + boxW;
  const leaderY = ly;

  const displayVal = unit ? `${value} ${id === "per_type" ? "" : unit}` : value;

  return (
    <g
      style={{ cursor: "pointer" }}
      onMouseEnter={() => onEnter && onEnter(id)}
      onMouseLeave={() => onLeave && onLeave()}
    >
      {/* Leader line */}
      <line
        x1={px}
        y1={py}
        x2={leaderX}
        y2={leaderY}
        stroke={color}
        strokeWidth={active ? 1.8 : 1.2}
        strokeDasharray="4,3"
        opacity={active ? 0.9 : 0.6}
      />
      {/* Pointer dot */}
      {/* <circle
        cx={px}
        cy={py}
        r={active ? 5 : 3.5}
        fill={active ? color : "#fff"}
        stroke={color}
        strokeWidth={1.8}
      /> */}
      {/* Arrow indicator */}
      <line
        x1={px - 14}
        y1={py - 14}
        x2={px}
        y2={py}
        stroke={color}
        strokeWidth={active ? 2.2 : 1.6}
        markerEnd="url(#annotationArrow)"
        opacity={active ? 1 : 0.85}
      />
      {/* Label box */}
      <rect
        x={bx}
        y={by}
        width={boxW}
        height={boxH}
        rx={r}
        fill={active ? color : "rgba(255,255,255,0.97)"}
        stroke={color}
        strokeWidth={active ? 0 : 1.4}
        style={{
          filter: active ? `drop-shadow(0 2px 6px ${color}66)` : "none",
        }}
      />
      {/* Label text */}
      <text
        x={bx + boxW / 2}
        y={by + boxH / 2 + 4}
        textAnchor="middle"
        fontSize={active ? 10 : 9.5}
        fontFamily="'JetBrains Mono', monospace"
        fontWeight="700"
        fill={active ? "#fff" : color}
        pointerEvents="none"
      >
        {label}&nbsp;: {displayVal}
      </text>
    </g>
  );
};

/** Simple dimension line with arrows and a centered label */
const DimLine = ({
  x1,
  y1,
  x2,
  y2,
  label,
  color,
  offset = 0,
  orient = "h",
}) => {
  // Horizontal or vertical dimension line with offset
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const len = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

  if (len < 5) return null;

  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={1.5}
        markerEnd="url(#arr)"
        markerStart="url(#arr)"
        opacity={0.75}
      />
      <rect
        x={mx - 38}
        y={my - 9}
        width={76}
        height={18}
        rx={4}
        fill="rgba(255,255,255,0.92)"
        stroke={color}
        strokeWidth={1}
      />
      <text
        x={mx}
        y={my + 5}
        textAnchor="middle"
        fontSize={9}
        fontFamily="monospace"
        fontWeight="700"
        fill={color}
      >
        {label}
      </text>
    </g>
  );
};

/** Side panel spec row */
const SpecRow = ({ label, value, color }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "4px 0",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
    }}
  >
    <span style={{ color: "#94a3b8", fontSize: 10, letterSpacing: "0.02em" }}>
      {label}
    </span>
    <span
      style={{
        color: color || "#e2e8f0",
        fontSize: 10,
        fontWeight: 700,
        background: "rgba(255,255,255,0.06)",
        padding: "1px 7px",
        borderRadius: 4,
        fontFamily: "monospace",
      }}
    >
      {value}
    </span>
  </div>
);

/** Side panel section */
const SpecSection = ({ title, color, children }) => (
  <div style={{ marginBottom: 12 }}>
    <div
      style={{
        fontSize: 9,
        fontWeight: 800,
        letterSpacing: "0.14em",
        color: color,
        textTransform: "uppercase",
        borderLeft: `3px solid ${color}`,
        paddingLeft: 8,
        marginBottom: 6,
      }}
    >
      {title}
    </div>
    <div style={{ paddingLeft: 4 }}>{children}</div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const ViewMms = ({ id: propId }) => {
  let { id } = useParams();
  const [{ mms, loadingMMS, error }, dispatch] = useReducer(reducer, {
    mms: MOCK,
    loadingMMS: false,
    error: "",
  });
  const [hovered, setHovered] = useState(null);
  const [showPanel, setShowPanel] = useState(true);
  const [imgLoaded, setImgLoaded] = useState(false);
  const svgRef = useRef(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      dispatch({ type: "FETCH_MMS_REQUEST" });
      try {
        const resp = await axios.get(`/api/v1/mms-structure/${id}`, {
          withCredentials: true,
        });
        dispatch({ type: "FETCH_MMS_SUCCESS", payload: resp.data });
      } catch (err) {
        dispatch({
          type: "FETCH_MMS_FAIL",
          payload: err.response?.data?.message || "Failed",
        });
      }
    })();
  }, [id]);

  const d = mms?.data || mms;
  if (!d) return null;

  const col = d.column || {};
  const raf = d.rafter || {};
  const per = d.perlin || {};
  const bra = d.braces || {};

  const statusColor =
    { draft: "#f59e0b", approved: "#10b981", rejected: "#ef4444" }[d.status] ||
    "#6b7280";

  // ── SVG coordinate system: viewBox "0 0 1200 700" mapped to the clean 2P image ──
  // The image from image 2 reference: total height 2083mm, column above GL ~1197, pile depth ~500
  // We place annotations based on the actual diagram anatomy visible in image 1

  const annotations = [
    // ── COLUMN annotations (blue) ──────────────────────────────────────
    {
      id: "col_total",
      px: 588,
      py: 290,
      lx: 420,
      ly: 290,
      label: "Col. Total",
      value: col.total_length?.value,
      color: "#1d4ed8",
      side: "left",
    },
    {
      id: "col_above_gl",
      px: 590,
      py: 360,
      lx: 415,
      ly: 360,
      label: "Above GL",
      value: col.upper_ground_length?.value,
      color: "#2563eb",
      side: "left",
    },
    {
      id: "col_pile",
      px: 595,
      py: 598,
      lx: 418,
      ly: 598,
      label: "Pile Depth",
      value: col.piling_depth_length?.value,
      color: "#1e40af",
      side: "left",
    },
    {
      id: "col_dia",
      px: 608,
      py: 638,
      lx: 430,
      ly: 638,
      label: "Pile Ø",
      value: col.pilling_diameter?.value,
      color: "#1e40af",
      side: "left",
    },
    {
      id: "col_section",
      px: 624,
      py: 450,
      lx: 440,
      ly: 450,
      label: "H×W×T",
      value: `${col.height?.value}×${col.width?.value}×${col.thickness?.value}`,
      unit: "",
      color: "#3b82f6",
      side: "left",
    },

    // ── RAFTER annotations (purple) ────────────────────────────────────
    {
      id: "raf_total",
      px: 720,
      py: 102,
      lx: 760,
      ly: 82,
      label: "Rafter L",
      value: raf.total_length?.value,
      color: "#7c3aed",
      side: "right",
    },
    {
      id: "raf_section",
      px: 680,
      py: 175,
      lx: 760,
      ly: 152,
      label: "H×W×T",
      value: `${raf.height?.value}×${raf.width?.value}×${raf.thickness?.value}`,
      unit: "",
      color: "#8b5cf6",
      side: "right",
    },
    {
      id: "raf_pcount",
      px: 810,
      py: 222,
      lx: 870,
      ly: 202,
      label: "Perlin Cnt",
      value: raf.perlin_dimension?.perlin_count?.value,
      unit: "pcs",
      color: "#7c3aed",
      side: "right",
    },
    {
      id: "raf_pp_gap",
      px: 755,
      py: 248,
      lx: 870,
      ly: 228,
      label: "P→P Gap",
      value: raf.perlin_dimension?.perlin_to_perlin_gap?.value,
      color: "#6d28d9",
      side: "right",
    },
    {
      id: "raf_mp_gap",
      px: 655,
      py: 268,
      lx: 870,
      ly: 255,
      label: "Mod→P Gap",
      value: raf.perlin_dimension?.module_to_perlin_gap?.value,
      color: "#6d28d9",
      side: "right",
    },

    // ── PERLIN annotations (green) ─────────────────────────────────────
    {
      id: "per_type",
      px: 400,
      py: 50,
      lx: 450,
      ly: 58,
      label: "Perlin Type",
      value: per.type,
      color: "#059669",
      side: "center",
    },
    {
      id: "per_height",
      px: 510,
      py: 250,
      lx: 408,
      ly: 95,
      label: "Perlin H",
      value: per.perlin_dimension?.height?.value,
      color: "#059669",
      side: "left",
    },
    {
      id: "per_width",
      px: 530,
      py: 240,
      lx: 408,
      ly: 95,
      label: "Perlin W",
      value: per.perlin_dimension?.width?.value,
      color: "#059669",
      side: "right",
    },
    {
      id: "per_flange",
      px: 525,
      py: 265,
      lx: 570,
      ly: 95,
      label: "Flange L (w to w)",
      value: per.perlin_dimension?.flenge_length?.value,
      color: "#10b981",
      side: "right",
    },
    {
      id: "per_thickness",
      px: 310,
      py: 278,
      lx: 70,
      ly: 95,
      label: "Perlin T",
      value: per.perlin_dimension?.thickness?.value,
      color: "#10b981",
      side: "right",
    },

    // ── BRACE A annotations (amber) ────────────────────────────────────
    {
      id: "brace_a",
      px: 440,
      py: 415,
      lx: 262,
      ly: 415,
      label: "Brace A",
      value: bra.a?.length?.value,
      color: "#d97706",
      side: "left",
    },
    {
      id: "brace_a_sec",
      px: 470,
      py: 445,
      lx: 262,
      ly: 445,
      label: "H×W×T",
      value: `${bra.a?.height?.value}×${bra.a?.width?.value}×${bra.a?.thickness?.value}`,
      unit: "",
      color: "#b45309",
      side: "left",
    },

    // ── BRACE B annotations (red) ──────────────────────────────────────
    {
      id: "brace_b",
      px: 800,
      py: 492,
      lx: 870,
      ly: 475,
      label: "Brace B",
      value: bra.b?.length?.value,
      color: "#dc2626",
      side: "right",
    },
    {
      id: "brace_b_sec",
      px: 820,
      py: 518,
      lx: 870,
      ly: 502,
      label: "H×W×T",
      value: `${bra.b?.height?.value}×${bra.b?.width?.value}×${bra.b?.thickness?.value}`,
      unit: "",
      color: "#b91c1c",
      side: "right",
    },

    // ── OVERALL DIMENSIONS (slate) ─────────────────────────────────────
    {
      id: "total_h",
      px: 148,
      py: 340,
      lx: 0,
      ly: 310,
      label: "Total H",
      value: "2083",
      color: "#475569",
      side: "right",
    },
    {
      id: "low_h",
      px: 1080,
      py: 518,
      lx: 1060,
      ly: 495,
      label: "Low H",
      value: "520",
      color: "#475569",
      side: "right",
    },
    {
      id: "tilt_angle",
      px: 990,
      py: 455,
      lx: 1060,
      ly: 438,
      label: "Tilt",
      value: "20",
      unit: "°",
      color: "#64748b",
      side: "right",
    },
    {
      id: "gl_depth",
      px: 610,
      py: 670,
      lx: 620,
      ly: 658,
      label: "GL Depth",
      value: "250",
      color: "#475569",
      side: "right",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080f1a",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'JetBrains Mono', 'Fira Mono', monospace",
        color: "#e2e8f0",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0d1a2d; }
        ::-webkit-scrollbar-thumb { background: #1e3a5f; border-radius: 2px; }
        .ann-label { transition: all 0.15s ease; }
        .ann-label:hover rect { filter: brightness(0.88); }
      `}</style>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header
        style={{
          background: "linear-gradient(90deg, #060d1a, #0c1829)",
          borderBottom: "1px solid #1e3a5f",
          padding: "10px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {/* Blueprint grid icon */}
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "linear-gradient(135deg, #1d4ed8, #7c3aed)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect
                x="2"
                y="2"
                width="14"
                height="14"
                rx="2"
                stroke="white"
                strokeWidth="1.5"
                fill="none"
              />
              <line
                x1="2"
                y1="7"
                x2="16"
                y2="7"
                stroke="white"
                strokeWidth="1"
              />
              <line
                x1="2"
                y1="12"
                x2="16"
                y2="12"
                stroke="white"
                strokeWidth="1"
              />
              <line
                x1="7"
                y1="2"
                x2="7"
                y2="16"
                stroke="white"
                strokeWidth="1"
              />
              <line
                x1="12"
                y1="2"
                x2="12"
                y2="16"
                stroke="white"
                strokeWidth="1"
              />
            </svg>
          </div>
          <div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 800,
                color: "#f1f5f9",
                letterSpacing: "0.05em",
              }}
            >
              {d.mms_id}
            </div>
            <div style={{ fontSize: 10, color: "#64748b", marginTop: 1 }}>
              {d.mms_type_name} · {d.site?.site_name} · {d.site?.location}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              padding: "3px 10px",
              borderRadius: 20,
              fontSize: 9,
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              background: `${statusColor}22`,
              border: `1px solid ${statusColor}66`,
              color: statusColor,
            }}
          >
            {d.status}
          </span>
          <span
            style={{
              color: "#94a3b8",
              fontSize: 10,
              background: "#0e2040",
              padding: "4px 12px",
              borderRadius: 8,
              border: "1px solid #1e3a5f",
            }}
          >
            {d.client?.client_name}
          </span>
          <button
            onClick={() => setShowPanel((p) => !p)}
            style={{
              background: "rgba(59,130,246,0.12)",
              border: "1px solid rgba(59,130,246,0.35)",
              color: "#60a5fa",
              padding: "5px 14px",
              borderRadius: 7,
              cursor: "pointer",
              fontSize: 10,
              fontFamily: "monospace",
              fontWeight: 700,
            }}
          >
            {showPanel ? "Hide Specs" : "Show Specs"}
          </button>
        </div>
      </header>

      {/* ── Body ────────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Diagram area */}
        <div
          style={{
            flex: 1,
            padding: "12px 14px 8px",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Title strip */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 3,
                  height: 20,
                  borderRadius: 2,
                  background: "linear-gradient(180deg,#1d4ed8,#7c3aed)",
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#cbd5e1",
                  letterSpacing: "0.1em",
                }}
              >
                FRONT VIEW — 2P MMS STRUCTURE
              </span>
            </div>
            {/* Legend */}
            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              {[
                ["#1d4ed8", "Column"],
                ["#7c3aed", "Rafter"],
                ["#059669", "Perlin"],
                ["#d97706", "Brace A"],
                ["#dc2626", "Brace B"],
                ["#475569", "Dimensions"],
              ].map(([c, l]) => (
                <span
                  key={l}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    color: "#94a3b8",
                    fontSize: 9,
                  }}
                >
                  <span
                    style={{
                      width: 14,
                      height: 4,
                      borderRadius: 2,
                      background: c,
                      display: "inline-block",
                    }}
                  />
                  {l}
                </span>
              ))}
            </div>
          </div>

          {/* SVG overlay on image */}
          <div
            style={{
              flex: 1,
              position: "relative",
              borderRadius: 10,
              overflow: "hidden",
              border: "1px solid #1e3a5f",
              background: "#f8fafc",
            }}
          >
            <svg
              ref={svgRef}
              viewBox="0 0 1200 700"
              style={{ width: "100%", height: "100%", display: "block" }}
              preserveAspectRatio="xMidYMid meet"
            >
              {/* <defs>
                <marker
                  id="arr"
                  markerWidth="6"
                  markerHeight="6"
                  refX="3"
                  refY="3"
                  orient="auto"
                >
                  <path d="M0,0 L6,3 L0,6 Z" fill="#94a3b8" />
                </marker>
              </defs> */}
              <defs>
                {/* Dimension arrow */}
                <marker
                  id="arr"
                  markerWidth="6"
                  markerHeight="6"
                  refX="3"
                  refY="3"
                  orient="auto"
                >
                  <path d="M0,0 L6,3 L0,6 Z" fill="#94a3b8" />
                </marker>

                {/* Annotation Arrow */}
                <marker
                  id="annotationArrow"
                  markerWidth="10"
                  markerHeight="10"
                  refX="8"
                  refY="3"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <path d="M0,0 L0,6 L9,3 z" fill="context-stroke" />
                </marker>
              </defs>

              {/* The actual structural image */}
              <image
                href={mmsImage}
                x="80"
                y="30"
                width="1060"
                height="640"
                preserveAspectRatio="xMidYMid meet"
                onLoad={() => setImgLoaded(true)}
              />

              {/* Semi-transparent white overlay to lighten image slightly for label readability */}
              <rect
                x="80"
                y="30"
                width="1060"
                height="640"
                fill="rgba(255,255,255,0.08)"
              />

              {/* Title watermark */}
              <rect
                x="870"
                y="8"
                width="322"
                height="22"
                rx="4"
                fill="rgba(8,15,26,0.72)"
              />
              <text
                x="1031"
                y="24"
                textAnchor="middle"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="700"
                fill="#64748b"
                letterSpacing="2"
              >
                FRONT VIEW — 2P MMS
              </text>

              {/* MMS ID badge */}
              <rect
                x="8"
                y="8"
                width="180"
                height="22"
                rx="4"
                fill="rgba(29,78,216,0.2)"
                stroke="rgba(29,78,216,0.5)"
                strokeWidth="1"
              />
              <text
                x="98"
                y="23"
                textAnchor="middle"
                fontSize="9.5"
                fontFamily="monospace"
                fontWeight="800"
                fill="#60a5fa"
              >
                {d.mms_id}
              </text>

              {/* ── Annotation dots + labels ─────────────────────────────── */}
              {annotations.map((a) => (
                <DimAnnotation
                  key={a.id}
                  {...a}
                  active={hovered === a.id}
                  onEnter={setHovered}
                  onLeave={() => setHovered(null)}
                />
              ))}

              {/* ── Vertical dimension line for total height ─────────────── */}
              <line
                x1="100"
                y1="98"
                x2="100"
                y2="630"
                stroke="#475569"
                strokeWidth="1.5"
                strokeDasharray="4,2"
                opacity="0.55"
              />
              <line
                x1="94"
                y1="98"
                x2="106"
                y2="98"
                stroke="#475569"
                strokeWidth="1.5"
                opacity="0.7"
              />
              <line
                x1="94"
                y1="630"
                x2="106"
                y2="630"
                stroke="#475569"
                strokeWidth="1.5"
                opacity="0.7"
              />
              <rect
                x="52"
                y="342"
                width="42"
                height="20"
                rx="4"
                fill="rgba(255,255,255,0.95)"
                stroke="#475569"
                strokeWidth="1"
              />
              <text
                x="73"
                y="356"
                textAnchor="middle"
                fontSize="9"
                fontFamily="monospace"
                fontWeight="700"
                fill="#475569"
              >
                2083
              </text>

              {/* ── GL line label ─────────────────────────────────────────── */}
              <text
                x="130"
                y="645"
                fontSize="9"
                fontFamily="monospace"
                fontWeight="700"
                fill="#374151"
                opacity="0.8"
              >
                GL
              </text>
            </svg>
          </div>
        </div>

        {/* ── Side specs panel ─────────────────────────────────────────── */}
        {showPanel && (
          <aside
            style={{
              width: 236,
              background: "#060d1a",
              borderLeft: "1px solid #1e3a5f",
              padding: "14px 12px",
              overflowY: "auto",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                fontSize: 9,
                fontWeight: 800,
                color: "#64748b",
                letterSpacing: "0.18em",
                marginBottom: 14,
              }}
            >
              SPECIFICATIONS
            </div>

            <SpecSection title="Column" color="#1d4ed8">
              <SpecRow
                label="Total Length"
                value={`${col.total_length?.value} mm`}
                color="#60a5fa"
              />
              <SpecRow
                label="Above Ground"
                value={`${col.upper_ground_length?.value} mm`}
              />
              <SpecRow
                label="Pile Depth"
                value={`${col.piling_depth_length?.value} mm`}
              />
              <SpecRow
                label="Pile Ø"
                value={`${col.pilling_diameter?.value} mm`}
              />
              <SpecRow
                label="H × W × T"
                value={`${col.height?.value}×${col.width?.value}×${col.thickness?.value}`}
              />
              <SpecRow
                label="C-Bar H"
                value={`${col.c_bar_height?.value} mm`}
              />
            </SpecSection>

            <SpecSection title="Rafter" color="#7c3aed">
              <SpecRow
                label="Total Length"
                value={`${raf.total_length?.value} mm`}
                color="#a78bfa"
              />
              <SpecRow
                label="H × W × T"
                value={`${raf.height?.value}×${raf.width?.value}×${raf.thickness?.value}`}
              />
              <SpecRow
                label="C-Bar H"
                value={`${raf.c_bar_height?.value} mm`}
              />
              <SpecRow
                label="Perlin Count"
                value={`${raf.perlin_dimension?.perlin_count?.value} pcs`}
              />
              <SpecRow
                label="P→P Gap"
                value={`${raf.perlin_dimension?.perlin_to_perlin_gap?.value} mm`}
              />
              <SpecRow
                label="Mod→P Gap"
                value={`${raf.perlin_dimension?.module_to_perlin_gap?.value} mm`}
              />
              <SpecRow
                label="Center P→P"
                value={`${raf.perlin_dimension?.center_perlin_to_perlin_gap?.value} mm`}
              />
            </SpecSection>

            <SpecSection
              title={`Perlin (${per.type || "C"}-Type)`}
              color="#059669"
            >
              <SpecRow
                label="Height"
                value={`${per.perlin_dimension?.height?.value} mm`}
                color="#34d399"
              />
              <SpecRow
                label="Width"
                value={`${per.perlin_dimension?.width?.value} mm`}
              />
              <SpecRow
                label="Thickness"
                value={`${per.perlin_dimension?.thickness?.value} mm`}
              />
              <SpecRow
                label="C-Bar H"
                value={`${per.perlin_dimension?.c_bar_height?.value} mm`}
              />
              <SpecRow
                label="Flange L"
                value={`${per.perlin_dimension?.flenge_length?.value} mm`}
              />
            </SpecSection>

            <SpecSection title="Brace A" color="#d97706">
              <SpecRow
                label="Length"
                value={`${bra.a?.length?.value} mm`}
                color="#fbbf24"
              />
              <SpecRow
                label="H × W × T"
                value={`${bra.a?.height?.value}×${bra.a?.width?.value}×${bra.a?.thickness?.value}`}
              />
              <SpecRow
                label="C-Bar H"
                value={`${bra.a?.c_bar_height?.value} mm`}
              />
            </SpecSection>

            <SpecSection title="Brace B" color="#dc2626">
              <SpecRow
                label="Length"
                value={`${bra.b?.length?.value} mm`}
                color="#f87171"
              />
              <SpecRow
                label="H × W × T"
                value={`${bra.b?.height?.value}×${bra.b?.width?.value}×${bra.b?.thickness?.value}`}
              />
              <SpecRow
                label="C-Bar H"
                value={`${bra.b?.c_bar_height?.value} mm`}
              />
            </SpecSection>

            {/* Activity log */}
            {d.last_activity?.length > 0 && (
              <div>
                <div
                  style={{
                    fontSize: 9,
                    fontWeight: 800,
                    color: "#64748b",
                    letterSpacing: "0.18em",
                    marginBottom: 8,
                  }}
                >
                  ACTIVITY
                </div>
                {d.last_activity.map((act, i) => (
                  <div
                    key={i}
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid #1e3a5f",
                      borderRadius: 6,
                      padding: "6px 8px",
                      marginBottom: 6,
                    }}
                  >
                    <div
                      style={{ fontSize: 9, fontWeight: 700, color: "#94a3b8" }}
                    >
                      {act.name}
                    </div>
                    <div
                      style={{ fontSize: 8, color: "#475569", marginTop: 2 }}
                    >
                      {act.details}
                    </div>
                    <div
                      style={{ fontSize: 8, color: "#334155", marginTop: 2 }}
                    >
                      {new Date(act.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </aside>
        )}
      </div>
    </div>
  );
};

export default ViewMms;
