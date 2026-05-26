import { useState } from "react";

// ─── Color palette per dimension letter ───────────────────────────────────────
// const DIM_COLORS = {
//   A: "#f59e0b",
//   B: "#10b981",
//   C: "#3b82f6",
//   D: "#8b5cf6",
//   E: "#ef4444",
//   F: "#06b6d4",
//   G: "#f97316",
//   H: "#ec4899",
//   I: "#84cc16",
//   J: "#e11d48",
//   K: "#a78bfa",
// };

// const col = (k, activeKey) => (activeKey === k ? DIM_COLORS[k] : "#334155");
// const lw = (k, activeKey) => (activeKey === k ? 2.2 : 1);
// const fc = (k, activeKey) => (activeKey === k ? DIM_COLORS[k] : "#94a3b8");
// const fw = (k, activeKey) => (activeKey === k ? 700 : 500);
// const fs = (k, activeKey) => (activeKey === k ? 13 : 10);
// const cur = { cursor: "pointer" };

// ─── Shared SVG defs (gradients, markers, filters) ────────────────────────────
// const SvgDefs = () => (
//   <defs>
//     <linearGradient id="panelG" x1="0%" y1="0%" x2="100%" y2="100%">
//       <stop offset="0%" stopColor="#1e4080" />
//       <stop offset="100%" stopColor="#0f2744" />
//     </linearGradient>
//     <linearGradient id="bgG" x1="0%" y1="0%" x2="0%" y2="100%">
//       <stop offset="0%" stopColor="#060f1e" />
//       <stop offset="100%" stopColor="#0a1628" />
//     </linearGradient>
//     <linearGradient id="roofG" x1="0%" y1="0%" x2="0%" y2="100%">
//       <stop offset="0%" stopColor="#1e293b" />
//       <stop offset="100%" stopColor="#0f172a" />
//     </linearGradient>
//     <filter id="glow">
//       <feGaussianBlur stdDeviation="2.5" result="cb" />
//       <feMerge>
//         <feMergeNode in="cb" />
//         <feMergeNode in="SourceGraphic" />
//       </feMerge>
//     </filter>
//     {Object.entries(DIM_COLORS).map(([k, c]) => (
//       <marker
//         key={k}
//         id={`arr${k}`}
//         markerWidth="5"
//         markerHeight="5"
//         refX="2.5"
//         refY="2.5"
//         orient="auto"
//       >
//         <path d="M0,0 L5,2.5 L0,5 Z" fill={c} />
//       </marker>
//     ))}
//     <marker
//       id="arrGray"
//       markerWidth="5"
//       markerHeight="5"
//       refX="2.5"
//       refY="2.5"
//       orient="auto"
//     >
//       <path d="M0,0 L5,2.5 L0,5 Z" fill="#475569" />
//     </marker>
//   </defs>
// );

// ─── Arrow annotation helper ──────────────────────────────────────────────────
// const Arrow = ({ x1, y1, x2, y2, k, activeKey, label, lx, ly, onSelect }) => (
//   <g onClick={() => onSelect(k)} style={cur}>
//     <line
//       x1={x1}
//       y1={y1}
//       x2={x2}
//       y2={y2}
//       stroke={col(k, activeKey)}
//       strokeWidth={lw(k, activeKey)}
//       markerEnd={`url(#arr${k})`}
//       markerStart={`url(#arr${k})`}
//     />
//     <text
//       x={lx}
//       y={ly}
//       textAnchor="middle"
//       fontSize={fs(k, activeKey)}
//       fontWeight={fw(k, activeKey)}
//       fill={fc(k, activeKey)}
//     >
//       {label || k}
//     </text>
//   </g>
// );

// ─── Sun decoration ───────────────────────────────────────────────────────────
// const Sun = ({ cx = 470, cy = 42 }) => (
//   <>
//     <circle
//       cx={cx}
//       cy={cy}
//       r="18"
//       fill="#fbbf24"
//       style={{ filter: "url(#glow)", opacity: 0.85 }}
//     />
//     {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
//       <line
//         key={a}
//         x1={cx + 22 * Math.cos((a * Math.PI) / 180)}
//         y1={cy + 22 * Math.sin((a * Math.PI) / 180)}
//         x2={cx + 29 * Math.cos((a * Math.PI) / 180)}
//         y2={cy + 29 * Math.sin((a * Math.PI) / 180)}
//         stroke="#fbbf24"
//         strokeWidth="2"
//         strokeLinecap="round"
//         opacity="0.8"
//       />
//     ))}
//     {[0, 1, 2, 3].map((i) => (
//       <line
//         key={i}
//         x1={cx - 40 - i * 18}
//         y1={cy + 28 + i * 12}
//         x2={cx - 220 - i * 14}
//         y2={cy + 130 + i * 6}
//         stroke="#fbbf24"
//         strokeWidth="0.7"
//         strokeDasharray="4,3"
//         opacity="0.18"
//       />
//     ))}
//   </>
// );

// ─── Ground line ──────────────────────────────────────────────────────────────
const Ground = ({ y = 240, x1 = 20, x2 = 480 }) => (
  <>
    <line
      x1={x1}
      y1={y}
      x2={x2}
      y2={y}
      stroke="#1e3a5f"
      strokeWidth="2"
      strokeDasharray="5,3"
    />
    <text x={x2 + 4} y={y + 4} fill="#475569" fontSize="9" fontWeight="600">
      GL
    </text>
    {Array.from({ length: 12 }).map((_, i) => (
      <line
        key={i}
        x1={x1 + i * 38}
        y1={y}
        x2={x1 - 10 + i * 38}
        y2={y + 14}
        stroke="#1e3a5f"
        strokeWidth="1.5"
      />
    ))}
  </>
);

// ─── Roof line (for rooftop types) ────────────────────────────────────────────
const Roof = ({ y = 180, x1 = 20, x2 = 490 }) => (
  <>
    <rect x={x1} y={y} width={x2 - x1} height="8" fill="url(#roofG)" rx="2" />
    <rect x={x1} y={y + 8} width={x2 - x1} height="4" fill="#0d1f3c" rx="1" />
    <text x={x2 + 4} y={y + 8} fill="#475569" fontSize="9" fontWeight="600">
      ROOF
    </text>
  </>
);

// ─── Panel grid helper ────────────────────────────────────────────────────────
// const PanelGrid = ({ x, y, w, h, cols = 6, rows = 2 }) => {
//   const cw = (w - 4) / cols,
//     rh = (h - 4) / rows;
//   return (
//     <>
//       <rect
//         x={x}
//         y={y}
//         width={w}
//         height={h}
//         fill="url(#panelG)"
//         rx="3"
//         stroke="#2563eb"
//         strokeWidth="0.8"
//       />
//       {Array.from({ length: cols }).map((_, ci) =>
//         Array.from({ length: rows }).map((_, ri) => (
//           <rect
//             key={`${ci}${ri}`}
//             x={x + 2 + ci * cw}
//             y={y + 2 + ri * rh}
//             width={cw - 1}
//             height={rh - 1}
//             fill="none"
//             stroke="#1e4a8a"
//             strokeWidth="0.5"
//             rx="1"
//           />
//         )),
//       )}
//     </>
//   );
// };

// ══════════════════════════════════════════════════════════════════════════════
// 2P — Ground-mount fixed tilt (pole + braces, existing design enhanced)
// ══════════════════════════════════════════════════════════════════════════════
// const Diagram2P = ({ dims, activeKey, onSelect }) => {
//   const tilt = parseFloat(dims?.J?.value || 25);
//   return (
//     <svg viewBox="0 0 520 290" style={{ width: "100%", height: "100%" }}>
//       <SvgDefs />
//       <rect width="520" height="290" fill="url(#bgG)" rx="10" />
//       <Sun />
//       <Ground y={240} />
//       {/* Pole */}
//       <rect x="192" y="175" width="16" height="65" fill="#1a3a70" rx="2" />
//       <rect x="180" y="237" width="40" height="8" fill="#1a3a70" rx="2" />
//       {/* Braces */}
//       <line
//         x1="200"
//         y1="205"
//         x2="135"
//         y2="240"
//         stroke="#2563eb"
//         strokeWidth="3"
//         strokeLinecap="round"
//       />
//       <line
//         x1="200"
//         y1="205"
//         x2="272"
//         y2="240"
//         stroke="#2563eb"
//         strokeWidth="3"
//         strokeLinecap="round"
//       />
//       {/* Panel (tilted) */}
//       <g transform={`rotate(-${tilt}, 200, 175)`}>
//         <PanelGrid x={76} y={150} w={248} h={58} cols={3} rows={2} />
//         {/* A */}
//         <g onClick={() => onSelect("A")} style={cur}>
//           <line
//             x1="80"
//             y1="162"
//             x2="320"
//             y2="162"
//             stroke={col("A", activeKey)}
//             strokeWidth={lw("A", activeKey)}
//             markerEnd="url(#arrA)"
//             markerStart="url(#arrA)"
//           />
//           <text
//             x="198"
//             y="158"
//             textAnchor="middle"
//             fontSize={fs("A", activeKey)}
//             fontWeight={fw("A", activeKey)}
//             fill={fc("A", activeKey)}
//           >
//             A
//           </text>
//         </g>
//         {/* B */}
//         <g onClick={() => onSelect("B")} style={cur}>
//           <line
//             x1="68"
//             y1="150"
//             x2="68"
//             y2="208"
//             stroke={col("B", activeKey)}
//             strokeWidth={lw("B", activeKey)}
//             markerEnd="url(#arrB)"
//             markerStart="url(#arrB)"
//           />
//           <text
//             x="58"
//             y="185"
//             fontSize={fs("B", activeKey)}
//             fontWeight={fw("B", activeKey)}
//             fill={fc("B", activeKey)}
//           >
//             B
//           </text>
//         </g>
//         {/* G */}
//         <g onClick={() => onSelect("G")} style={cur}>
//           <circle
//             cx="76"
//             cy="150"
//             r="5"
//             fill="none"
//             stroke={col("G", activeKey)}
//             strokeWidth={lw("G", activeKey)}
//           />
//           <line
//             x1="63"
//             y1="137"
//             x2="76"
//             y2="150"
//             stroke={col("G", activeKey)}
//             strokeWidth={lw("G", activeKey)}
//           />
//           <text
//             x="50"
//             y="133"
//             fontSize={fs("G", activeKey)}
//             fontWeight={fw("G", activeKey)}
//             fill={fc("G", activeKey)}
//           >
//             G
//           </text>
//         </g>
//       </g>
//       {/* C */}
//       <g onClick={() => onSelect("C")} style={cur}>
//         <line
//           x1="78"
//           y1="126"
//           x2="326"
//           y2="126"
//           stroke={col("C", activeKey)}
//           strokeWidth={lw("C", activeKey)}
//           markerEnd="url(#arrC)"
//           markerStart="url(#arrC)"
//         />
//         <text
//           x="200"
//           y="120"
//           textAnchor="middle"
//           fontSize={fs("C", activeKey)}
//           fontWeight={fw("C", activeKey)}
//           fill={fc("C", activeKey)}
//         >
//           C
//         </text>
//       </g>
//       {/* D */}
//       <g onClick={() => onSelect("D")} style={cur}>
//         <line
//           x1="338"
//           y1="140"
//           x2="338"
//           y2="238"
//           stroke={col("D", activeKey)}
//           strokeWidth={lw("D", activeKey)}
//           markerEnd="url(#arrD)"
//           markerStart="url(#arrD)"
//         />
//         <text
//           x="346"
//           y="196"
//           fontSize={fs("D", activeKey)}
//           fontWeight={fw("D", activeKey)}
//           fill={fc("D", activeKey)}
//         >
//           D
//         </text>
//       </g>
//       {/* E */}
//       <g onClick={() => onSelect("E")} style={cur}>
//         <line
//           x1="62"
//           y1="218"
//           x2="62"
//           y2="238"
//           stroke={col("E", activeKey)}
//           strokeWidth={lw("E", activeKey)}
//           markerEnd="url(#arrE)"
//           markerStart="url(#arrE)"
//         />
//         <text
//           x="50"
//           y="232"
//           fontSize={fs("E", activeKey)}
//           fontWeight={fw("E", activeKey)}
//           fill={fc("E", activeKey)}
//         >
//           E
//         </text>
//       </g>
//       {/* F */}
//       <g onClick={() => onSelect("F")} style={cur}>
//         <line
//           x1="42"
//           y1="196"
//           x2="42"
//           y2="238"
//           stroke={col("F", activeKey)}
//           strokeWidth={lw("F", activeKey)}
//           markerEnd="url(#arrF)"
//           markerStart="url(#arrF)"
//         />
//         <text
//           x="30"
//           y="222"
//           fontSize={fs("F", activeKey)}
//           fontWeight={fw("F", activeKey)}
//           fill={fc("F", activeKey)}
//         >
//           F
//         </text>
//       </g>
//       {/* J */}
//       <g onClick={() => onSelect("J")} style={cur}>
//         <path
//           d={`M 200 240 A 36 36 0 0 1 ${200 + 36 * Math.cos(((90 - tilt) * Math.PI) / 180)} ${240 - 36 * Math.sin(((90 - tilt) * Math.PI) / 180)}`}
//           fill="none"
//           stroke={col("J", activeKey)}
//           strokeWidth={lw("J", activeKey)}
//           strokeDasharray="3,2"
//         />
//         <text
//           x="220"
//           y="230"
//           fontSize={fs("J", activeKey)}
//           fontWeight={fw("J", activeKey)}
//           fill={fc("J", activeKey)}
//         >
//           J={tilt}°
//         </text>
//       </g>
//       <text
//         x="16"
//         y="278"
//         fill="#1e3a5f"
//         fontSize="8"
//         fontWeight="700"
//         letterSpacing="2"
//       >
//         TAYPRO® 2P FIXED TILT
//       </text>
//     </svg>
//   );
// };

// ─── Color palette per dimension letter ───────────────────────────────────────

// Double-headed arrow helper
const DimArrow = ({
  x1,
  y1,
  x2,
  y2,
  dimKey,
  ak,
  label,
  lx,
  ly,
  textAnchor = "middle",
  onSelect,
}) => (
  <g onClick={() => onSelect(dimKey)} style={cur}>
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={col(dimKey, ak)}
      strokeWidth={lw(dimKey, ak)}
      markerEnd={`url(#arrE_${dimKey})`}
      markerStart={`url(#arrS_${dimKey})`}
    />
    <text
      x={lx}
      y={ly}
      textAnchor={textAnchor}
      fontSize={fs(dimKey, ak)}
      fontWeight={fw(dimKey, ak)}
      fill={fc(dimKey, ak)}
    >
      {label}
    </text>
  </g>
);

const Sun = ({ cx = 470, cy = 38 }) => (
  <>
    <circle
      cx={cx}
      cy={cy}
      r="16"
      fill="#fbbf24"
      style={{ filter: "url(#glow)", opacity: 0.9 }}
    />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
      <line
        key={a}
        x1={cx + 20 * Math.cos((a * Math.PI) / 180)}
        y1={cy + 20 * Math.sin((a * Math.PI) / 180)}
        x2={cx + 27 * Math.cos((a * Math.PI) / 180)}
        y2={cy + 27 * Math.sin((a * Math.PI) / 180)}
        stroke="#fbbf24"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.85"
      />
    ))}
  </>
);

const DIM_COLORS = {
  A: "#f59e0b",
  B: "#10b981",
  C: "#3b82f6",
  D: "#8b5cf6",
  E: "#ef4444",
  F: "#06b6d4",
  G: "#f97316",
  H: "#ec4899",
  I: "#84cc16",
  J: "#e11d48",
  K: "#a78bfa",
};

const col = (k, activeKey) => (activeKey === k ? DIM_COLORS[k] : "#334155");
const lw = (k, activeKey) => (activeKey === k ? 2.2 : 1);
const fc = (k, activeKey) => (activeKey === k ? DIM_COLORS[k] : "#94a3b8");
const fw = (k, activeKey) => (activeKey === k ? 700 : 500);
const fs = (k, activeKey) => (activeKey === k ? 13 : 10);
const cur = { cursor: "pointer" };

// const SvgDefs = () => (
//   <defs>
//     <linearGradient id="panelG" x1="0%" y1="0%" x2="100%" y2="100%">
//       <stop offset="0%" stopColor="#1e4080" />
//       <stop offset="100%" stopColor="#0f2744" />
//     </linearGradient>
//     <linearGradient id="bgG" x1="0%" y1="0%" x2="0%" y2="100%">
//       <stop offset="0%" stopColor="#060f1e" />
//       <stop offset="100%" stopColor="#0a1628" />
//     </linearGradient>
//     <filter id="glow">
//       <feGaussianBlur stdDeviation="2.5" result="cb" />
//       <feMerge>
//         <feMergeNode in="cb" />
//         <feMergeNode in="SourceGraphic" />
//       </feMerge>
//     </filter>
//     {Object.entries(DIM_COLORS).map(([k, c]) => (
//       <marker
//         key={k}
//         id={`arr${k}`}
//         markerWidth="6"
//         markerHeight="6"
//         refX="3"
//         refY="3"
//         orient="auto"
//       >
//         <path d="M0,0 L6,3 L0,6 Z" fill={c} />
//       </marker>
//     ))}
//     {Object.entries(DIM_COLORS).map(([k, c]) => (
//       <marker
//         key={`s${k}`}
//         id={`arrs${k}`}
//         markerWidth="6"
//         markerHeight="6"
//         refX="3"
//         refY="3"
//         orient="auto-start-reverse"
//       >
//         <path d="M0,0 L6,3 L0,6 Z" fill={c} />
//       </marker>
//     ))}
//     <marker
//       id="arrGray"
//       markerWidth="6"
//       markerHeight="6"
//       refX="3"
//       refY="3"
//       orient="auto"
//     >
//       <path d="M0,0 L6,3 L0,6 Z" fill="#475569" />
//     </marker>
//   </defs>
// );

// const Sun = ({ cx = 470, cy = 42 }) => (
//   <>
//     <circle
//       cx={cx}
//       cy={cy}
//       r="18"
//       fill="#fbbf24"
//       style={{ filter: "url(#glow)", opacity: 0.85 }}
//     />
//     {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
//       <line
//         key={a}
//         x1={cx + 22 * Math.cos((a * Math.PI) / 180)}
//         y1={cy + 22 * Math.sin((a * Math.PI) / 180)}
//         x2={cx + 29 * Math.cos((a * Math.PI) / 180)}
//         y2={cy + 29 * Math.sin((a * Math.PI) / 180)}
//         stroke="#fbbf24"
//         strokeWidth="2"
//         strokeLinecap="round"
//         opacity="0.8"
//       />
//     ))}
//   </>
// );

const PanelGrid = ({ x, y, w, h, cols = 6, rows = 2 }) => {
  const cw = (w - 4) / cols,
    rh = (h - 4) / rows;
  return (
    <>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill="url(#panelG)"
        rx="2"
        stroke="#2563eb"
        strokeWidth="0.8"
      />
      {Array.from({ length: cols }).map((_, ci) =>
        Array.from({ length: rows }).map((_, ri) => (
          <rect
            key={`${ci}${ri}`}
            x={x + 2 + ci * cw}
            y={y + 2 + ri * rh}
            width={cw - 1}
            height={rh - 1}
            fill="none"
            stroke="#1e4a8a"
            strokeWidth="0.4"
            rx="1"
          />
        )),
      )}
    </>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// 2P — Ground-mount fixed tilt — EXACT match to reference engineering drawing
//
// Reference layout (from images):
//  - Two panels side by side, tilted ~25° from horizontal, mounted on central pole
//  - C: full table width arrow at TOP of panels (longest dimension)
//  - A: individual module width — shown TWICE (one per panel), along panel face
//  - B: gap between the two modules (small vertical arrow at center join)
//  - D: back post height (right side, from GL to top-right corner of panel)
//  - E: front ground clearance (bottom-left, vertical from ground to front-bottom of panel)
//  - F: front leg height (small tick/dimension at front-left of structure, below E)
//  - G: frame cross-section callout (circle with detail, top-right corner of panel)
//  - H: inter table gap (bottom, horizontal between two tables in top view)
//  - I: module gap horizontal (between tables, top-right)
//  - J: tilt angle arc
// ══════════════════════════════════════════════════════════════════════════════

// const Diagram2P = ({ dims, activeKey, onSelect }) => {
//   const tilt = parseFloat(dims?.J?.value || 25);
//   const tiltRad = (tilt * Math.PI) / 180;

//   // Panel geometry — two panels side by side on a tilted surface
//   // The panel assembly sits on a central pole, angled from lower-left to upper-right
//   // Pivot point (where pole meets panel bottom-back): px, py
//   const px = 260,
//     py = 195; // pole top / panel back-bottom anchor

//   // Panel dimensions in SVG units
//   const panelW = 120; // width of one module along the slope
//   const gap = 8; // gap between two modules
//   const panelH = 48; // height (thickness dimension) of panel
//   const totalPanelW = panelW * 2 + gap; // total along slope

//   // Tilt: panel surface goes from lower-left to upper-right
//   // Lower-left corner of the full panel assembly:
//   const cosT = Math.cos(tiltRad);
//   const sinT = Math.sin(tiltRad);

//   // Panel corners in tilted space (0,0 = back-bottom = pivot at px,py)
//   // Along panel: positive = toward front-left (down the slope)
//   // The back of the panel is at pivot, front is to the lower-left
//   // Panel goes: back-right (pivot) → front-left

//   // Back-bottom (right side in ref image) = pivot point
//   const backBottomX = px;
//   const backBottomY = py;

//   // Front-bottom (left side, lower)
//   const frontBottomX = px - totalPanelW * cosT;
//   const frontBottomY = py + totalPanelW * sinT;

//   // Back-top (right, upper)
//   const backTopX = px - panelH * sinT; // perpendicular up
//   const backTopY = py - panelH * cosT;

//   // Front-top (left, upper)
//   const frontTopX = frontBottomX - panelH * sinT;
//   const frontTopY = frontBottomY - panelH * cosT;

//   // Panel 1 (front, left panel) divider point along bottom
//   const mid1BottomX = px - panelW * cosT;
//   const mid1BottomY = py + panelW * sinT;
//   const mid1TopX = mid1BottomX - panelH * sinT;
//   const mid1TopY = mid1BottomY - panelH * cosT;

//   // Panel 2 (back, right panel) gap end
//   const mid2BottomX = px - (panelW + gap) * cosT;
//   const mid2BottomY = py + (panelW + gap) * sinT;
//   const mid2TopX = mid2BottomX - panelH * sinT;
//   const mid2TopY = mid2BottomY - panelH * cosT;

//   // Ground line Y
//   const groundY = 252;

//   // Pole: from ground to pivot
//   const poleTopX = px,
//     poleTopY = py;
//   const poleBaseX = px,
//     poleBaseY = groundY;

//   // Front leg: from ground to front-bottom of panel
//   const frontLegTopX = frontBottomX + panelH * sinT * 0.5; // approx where brace hits
//   const frontLegTopY = frontBottomY - panelH * cosT * 0.5;
//   const frontLegBaseX = frontBottomX + 10;
//   const frontLegBaseY = groundY;

//   // Midpoint of panel-1 top surface (for A label)
//   const a1MidX = (backTopX + mid1TopX) / 2;
//   const a1MidY = (backTopY + mid1TopY) / 2;
//   // Midpoint of panel-2 top surface (for second A label)
//   const a2MidX = (mid2TopX + frontTopX) / 2;
//   const a2MidY = (mid2TopY + frontTopY) / 2;

//   // C dimension: top of panels, full width
//   // Arrow above the panels, parallel to slope
//   const cOffsetPerp = 22; // offset above panel top surface
//   const cStartX = backTopX - cOffsetPerp * sinT;
//   const cStartY = backTopY - cOffsetPerp * cosT; // wait, perpendicular to slope going "up"
//   // Perpendicular outward from top surface = (-sinT, -cosT) rotated
//   const perpX = sinT; // perpendicular up from slope = (sinT, -cosT) in screen coords?
//   // Actually perpendicular to slope direction (cosT, -sinT) going upward from surface:
//   // slope direction vector: (-cosT, sinT) [going front-left]
//   // perpendicular outward (away from panel face upward): (-sinT, -cosT)
//   const cLabelOffX = -sinT * cOffsetPerp;
//   const cLabelOffY = -cosT * cOffsetPerp;

//   const cS = { x: backTopX + cLabelOffX, y: backTopY + cLabelOffY };
//   const cE = { x: frontTopX + cLabelOffX, y: frontTopY + cLabelOffY };
//   const cMid = { x: (cS.x + cE.x) / 2, y: (cS.y + cE.y) / 2 };

//   // B: gap between panels — vertical arrow perpendicular at mid-panel
//   const bMidX = (mid1BottomX + mid2BottomX) / 2;
//   const bMidY = (mid1BottomY + mid2BottomY) / 2;
//   const bTopX = (mid1TopX + mid2TopX) / 2;
//   const bTopY = (mid1TopY + mid2TopY) / 2;

//   // G callout: top-right corner of panel (back-top corner)
//   const gX = backTopX;
//   const gY = backTopY;

//   // D: right side vertical — from GL to back-top of panel
//   const dX = px + 55;

//   // E: front ground clearance — vertical from GL to front-bottom of panel
//   const eX = frontBottomX - 28;

//   // F: small front-leg vertical dimension (below E, smaller)
//   const fX = frontBottomX - 14;

//   return (
//     <svg viewBox="0 0 520 300" style={{ width: "100%", height: "100%" }}>
//       <SvgDefs />
//       <rect width="520" height="300" fill="url(#bgG)" rx="10" />
//       <Sun cx={470} cy={38} />

//       {/* ── Ground line ── */}
//       <line
//         x1="30"
//         y1={groundY}
//         x2={dX + 20}
//         y2={groundY}
//         stroke="#1e3a5f"
//         strokeWidth="1.5"
//         strokeDasharray="5,3"
//       />
//       <text
//         x={dX + 24}
//         y={groundY + 4}
//         fill="#475569"
//         fontSize="9"
//         fontWeight="600"
//       >
//         GL
//       </text>
//       {/* ground hatching */}
//       {Array.from({ length: 10 }).map((_, i) => (
//         <line
//           key={i}
//           x1={35 + i * 40}
//           y1={groundY}
//           x2={25 + i * 40}
//           y2={groundY + 12}
//           stroke="#1e3a5f"
//           strokeWidth="1.2"
//         />
//       ))}

//       {/* ── Central pole ── */}
//       <rect
//         x={poleBaseX - 5}
//         y={poleTopY}
//         width={10}
//         height={poleBaseY - poleTopY}
//         fill="#1a3a70"
//         rx="2"
//       />
//       {/* Pole base plate */}
//       <rect
//         x={poleBaseX - 14}
//         y={groundY - 4}
//         width={28}
//         height={6}
//         fill="#1a3a70"
//         rx="1"
//       />

//       {/* ── Diagonal braces (from pole to panel corners) ── */}
//       {/* Back brace to back of panel */}
//       <line
//         x1={px}
//         y1={py + 10}
//         x2={backBottomX - totalPanelW * 0.6 * cosT}
//         y2={backBottomY + totalPanelW * 0.6 * sinT}
//         stroke="#2563eb"
//         strokeWidth="2.5"
//         strokeLinecap="round"
//       />
//       {/* Front brace to front-ish of panel */}
//       <line
//         x1={px}
//         y1={py + 10}
//         x2={frontBottomX + 25 * cosT}
//         y2={frontBottomY - 25 * sinT}
//         stroke="#2563eb"
//         strokeWidth="2.5"
//         strokeLinecap="round"
//       />
//       {/* Small front leg from ground */}
//       <line
//         x1={frontLegBaseX}
//         y1={groundY}
//         x2={frontBottomX + 18 * cosT}
//         y2={frontBottomY - 18 * sinT}
//         stroke="#2563eb"
//         strokeWidth="2"
//         strokeLinecap="round"
//       />

//       {/* ── Panel bodies ── */}
//       {/* Panel 1 (right/back panel in reference) */}
//       <polygon
//         points={`${backBottomX},${backBottomY} ${mid1BottomX},${mid1BottomY} ${mid1TopX},${mid1TopY} ${backTopX},${backTopY}`}
//         fill="url(#panelG)"
//         stroke="#2563eb"
//         strokeWidth="0.8"
//       />
//       {/* Cell lines for panel 1 */}
//       {[0.33, 0.66].map((t, i) => {
//         const bx = backBottomX - t * panelW * cosT,
//           by = backBottomY + t * panelW * sinT;
//         const tx = bx - panelH * sinT,
//           ty = by - panelH * cosT;
//         return (
//           <line
//             key={i}
//             x1={bx}
//             y1={by}
//             x2={tx}
//             y2={ty}
//             stroke="#1e4a8a"
//             strokeWidth="0.4"
//           />
//         );
//       })}
//       {[0.5].map((t, i) => {
//         const lx = backBottomX - t * panelH * sinT,
//           ly = backBottomY - t * panelH * cosT;
//         const rx = lx - panelW * cosT,
//           ry = ly + panelW * sinT;
//         return (
//           <line
//             key={i}
//             x1={lx}
//             y1={ly}
//             x2={rx}
//             y2={ry}
//             stroke="#1e4a8a"
//             strokeWidth="0.4"
//           />
//         );
//       })}

//       {/* Panel 2 (left/front panel in reference) */}
//       <polygon
//         points={`${mid2BottomX},${mid2BottomY} ${frontBottomX},${frontBottomY} ${frontTopX},${frontTopY} ${mid2TopX},${mid2TopY}`}
//         fill="url(#panelG)"
//         stroke="#2563eb"
//         strokeWidth="0.8"
//       />
//       {[0.33, 0.66].map((t, i) => {
//         const bx = mid2BottomX - t * panelW * cosT,
//           by = mid2BottomY + t * panelW * sinT;
//         const tx = bx - panelH * sinT,
//           ty = by - panelH * cosT;
//         return (
//           <line
//             key={i}
//             x1={bx}
//             y1={by}
//             x2={tx}
//             y2={ty}
//             stroke="#1e4a8a"
//             strokeWidth="0.4"
//           />
//         );
//       })}
//       {[0.5].map((t, i) => {
//         const lx = mid2BottomX - t * panelH * sinT,
//           ly = mid2BottomY - t * panelH * cosT;
//         const rx = lx - panelW * cosT,
//           ry = ly + panelW * sinT;
//         return (
//           <line
//             key={i}
//             x1={lx}
//             y1={ly}
//             x2={rx}
//             y2={ry}
//             stroke="#1e4a8a"
//             strokeWidth="0.4"
//           />
//         );
//       })}

//       {/* Gap between panels (dark strip) */}
//       <polygon
//         points={`${mid1BottomX},${mid1BottomY} ${mid2BottomX},${mid2BottomY} ${mid2TopX},${mid2TopY} ${mid1TopX},${mid1TopY}`}
//         fill="#060f1e"
//         stroke="#1e3a5f"
//         strokeWidth="0.5"
//       />

//       {/* ── C: Total table width — arrow above panel top ── */}
//       <g onClick={() => onSelect("C")} style={cur}>
//         {/* Line from back-top to front-top, offset above */}
//         <line
//           x1={cS.x}
//           y1={cS.y}
//           x2={cE.x}
//           y2={cE.y}
//           stroke={col("C", activeKey)}
//           strokeWidth={lw("C", activeKey)}
//           markerEnd={`url(#arrC)`}
//           markerStart={`url(#arrsC)`}
//         />
//         {/* C label above midpoint */}
//         <text
//           x={cMid.x - sinT * 10}
//           y={cMid.y - cosT * 10}
//           textAnchor="middle"
//           fontSize={fs("C", activeKey)}
//           fontWeight={fw("C", activeKey)}
//           fill={fc("C", activeKey)}
//         >
//           C
//         </text>
//       </g>

//       {/* ── A: Module width — shown on BOTH panels along their top surface ── */}
//       {/* Panel 1 A arrow (right panel — along top surface) */}
//       <g onClick={() => onSelect("A")} style={cur}>
//         {/* Arrow along top of panel 1 */}
//         <line
//           x1={backTopX + cLabelOffX * 0.4}
//           y1={backTopY + cLabelOffY * 0.4}
//           x2={mid1TopX + cLabelOffX * 0.4}
//           y2={mid1TopY + cLabelOffY * 0.4}
//           stroke={col("A", activeKey)}
//           strokeWidth={lw("A", activeKey)}
//           markerEnd={`url(#arrA)`}
//           markerStart={`url(#arrsA)`}
//         />
//         <text
//           x={a1MidX + cLabelOffX * 0.35 - sinT * 6}
//           y={a1MidY + cLabelOffY * 0.35 - cosT * 6}
//           textAnchor="middle"
//           fontSize={fs("A", activeKey)}
//           fontWeight={fw("A", activeKey)}
//           fill={fc("A", activeKey)}
//         >
//           A
//         </text>
//       </g>
//       {/* Panel 2 A arrow (left panel) */}
//       <g onClick={() => onSelect("A")} style={cur}>
//         <line
//           x1={mid2TopX + cLabelOffX * 0.4}
//           y1={mid2TopY + cLabelOffY * 0.4}
//           x2={frontTopX + cLabelOffX * 0.4}
//           y2={frontTopY + cLabelOffY * 0.4}
//           stroke={col("A", activeKey)}
//           strokeWidth={lw("A", activeKey)}
//           markerEnd={`url(#arrA)`}
//           markerStart={`url(#arrsA)`}
//         />
//         <text
//           x={a2MidX + cLabelOffX * 0.35 - sinT * 6}
//           y={a2MidY + cLabelOffY * 0.35 - cosT * 6}
//           textAnchor="middle"
//           fontSize={fs("A", activeKey)}
//           fontWeight={fw("A", activeKey)}
//           fill={fc("A", activeKey)}
//         >
//           A
//         </text>
//       </g>

//       {/* ── B: Gap between panels — small vertical arrow at the gap ── */}
//       <g onClick={() => onSelect("B")} style={cur}>
//         {/* Small arrow perpendicular across the gap, shown at mid-panel */}
//         <line
//           x1={mid1TopX - sinT * 3}
//           y1={mid1TopY - cosT * 3}
//           x2={mid2TopX - sinT * 3}
//           y2={mid2TopY - cosT * 3}
//           stroke={col("B", activeKey)}
//           strokeWidth={lw("B", activeKey)}
//           markerEnd={`url(#arrB)`}
//           markerStart={`url(#arrsB)`}
//         />
//         {/* B label above gap */}
//         <text
//           x={bTopX - sinT * 14}
//           y={bTopY - cosT * 14}
//           textAnchor="middle"
//           fontSize={fs("B", activeKey)}
//           fontWeight={fw("B", activeKey)}
//           fill={fc("B", activeKey)}
//         >
//           B
//         </text>
//       </g>

//       {/* ── D: Back post height — right side vertical, from GL to back-top corner ── */}
//       <g onClick={() => onSelect("D")} style={cur}>
//         {/* Vertical line at right side */}
//         <line
//           x1={dX}
//           y1={backTopY}
//           x2={dX}
//           y2={groundY}
//           stroke={col("D", activeKey)}
//           strokeWidth={lw("D", activeKey)}
//           markerEnd={`url(#arrD)`}
//           markerStart={`url(#arrsD)`}
//         />
//         {/* Horizontal tick lines connecting to panel and ground */}
//         <line
//           x1={backTopX}
//           y1={backTopY}
//           x2={dX + 2}
//           y2={backTopY}
//           stroke={col("D", activeKey)}
//           strokeWidth="0.7"
//           strokeDasharray="3,2"
//           opacity="0.6"
//         />
//         <line
//           x1={poleBaseX}
//           y1={groundY}
//           x2={dX + 2}
//           y2={groundY}
//           stroke={col("D", activeKey)}
//           strokeWidth="0.7"
//           strokeDasharray="3,2"
//           opacity="0.6"
//         />
//         <text
//           x={dX + 8}
//           y={(backTopY + groundY) / 2 + 4}
//           fontSize={fs("D", activeKey)}
//           fontWeight={fw("D", activeKey)}
//           fill={fc("D", activeKey)}
//         >
//           D
//         </text>
//       </g>

//       {/* ── E: Front ground clearance — vertical from GL to front-bottom of panel ── */}
//       <g onClick={() => onSelect("E")} style={cur}>
//         <line
//           x1={eX}
//           y1={frontBottomY}
//           x2={eX}
//           y2={groundY}
//           stroke={col("E", activeKey)}
//           strokeWidth={lw("E", activeKey)}
//           markerEnd={`url(#arrE)`}
//           markerStart={`url(#arrsE)`}
//         />
//         {/* Tick to panel */}
//         <line
//           x1={frontBottomX}
//           y1={frontBottomY}
//           x2={eX + 2}
//           y2={frontBottomY}
//           stroke={col("E", activeKey)}
//           strokeWidth="0.7"
//           strokeDasharray="3,2"
//           opacity="0.6"
//         />
//         <text
//           x={eX - 10}
//           y={(frontBottomY + groundY) / 2 + 4}
//           fontSize={fs("E", activeKey)}
//           fontWeight={fw("E", activeKey)}
//           fill={fc("E", activeKey)}
//         >
//           E
//         </text>
//       </g>

//       {/* ── F: Front leg height — small dimension just above ground on front-left ── */}
//       {/* In the reference, F is a small vertical tick at the very front-bottom of the structure */}
//       <g onClick={() => onSelect("F")} style={cur}>
//         {/* F is the small distance from ground to the front foot of the front brace */}
//         <line
//           x1={fX}
//           y1={frontBottomY - 18}
//           x2={fX}
//           y2={groundY}
//           stroke={col("F", activeKey)}
//           strokeWidth={lw("F", activeKey)}
//           markerEnd={`url(#arrF)`}
//           markerStart={`url(#arrsF)`}
//         />
//         <text
//           x={fX - 10}
//           y={groundY - 8}
//           fontSize={fs("F", activeKey)}
//           fontWeight={fw("F", activeKey)}
//           fill={fc("F", activeKey)}
//         >
//           F
//         </text>
//       </g>

//       {/* ── G: Frame cross-section callout circle (top-right corner) ── */}
//       <g onClick={() => onSelect("G")} style={cur}>
//         {/* Callout circle at back-top corner of panel */}
//         <circle
//           cx={gX}
//           cy={gY}
//           r="7"
//           fill="none"
//           stroke={col("G", activeKey)}
//           strokeWidth={lw("G", activeKey)}
//         />
//         {/* Leader line to detail circle */}
//         <line
//           x1={gX + 5}
//           y1={gY - 5}
//           x2={gX + 38}
//           y2={gY - 38}
//           stroke={col("G", activeKey)}
//           strokeWidth="0.8"
//         />
//         {/* Detail callout circle */}
//         <circle
//           cx={gX + 58}
//           cy={gY - 52}
//           r="22"
//           fill="#0d1f3c"
//           stroke={col("G", activeKey)}
//           strokeWidth={lw("G", activeKey)}
//         />
//         {/* Frame cross-section inside callout */}
//         <rect
//           x={gX + 42}
//           y={gY - 62}
//           width={32}
//           height={8}
//           fill="none"
//           stroke={col("G", activeKey)}
//           strokeWidth="1.2"
//         />
//         <rect
//           x={gX + 42}
//           y={gY - 56}
//           width={8}
//           height={12}
//           fill="none"
//           stroke={col("G", activeKey)}
//           strokeWidth="1.2"
//         />
//         {/* G label inside callout */}
//         <text
//           x={gX + 78}
//           y={gY - 50}
//           fontSize={fs("G", activeKey)}
//           fontWeight={fw("G", activeKey)}
//           fill={fc("G", activeKey)}
//         >
//           G
//         </text>
//       </g>

//       {/* ── J: Tilt angle arc ── */}
//       <g onClick={() => onSelect("J")} style={cur}>
//         <path
//           d={`M ${px} ${groundY} A 36 36 0 0 1 ${px + 36 * Math.cos(((90 - tilt) * Math.PI) / 180)} ${groundY - 36 * Math.sin(((90 - tilt) * Math.PI) / 180)}`}
//           fill="none"
//           stroke={col("J", activeKey)}
//           strokeWidth={lw("J", activeKey)}
//           strokeDasharray="3,2"
//         />
//         <text
//           x={px + 20}
//           y={groundY - 14}
//           fontSize={fs("J", activeKey)}
//           fontWeight={fw("J", activeKey)}
//           fill={fc("J", activeKey)}
//         >
//           J={tilt}°
//         </text>
//       </g>

//       <text
//         x="16"
//         y="293"
//         fill="#1e3a5f"
//         fontSize="8"
//         fontWeight="700"
//         letterSpacing="2"
//       >
//         TAYPRO® 2P FIXED TILT
//       </text>
//     </svg>
//   );
// };

// ──────────────────────────────────────────────────────────────────────────────
// Top view (unchanged from original)
// ──────────────────────────────────────────────────────────────────────────────

// const SvgDefs = () => (
//   <defs>
//     <linearGradient id="panelG" x1="0%" y1="0%" x2="100%" y2="100%">
//       <stop offset="0%" stopColor="#1e4080" />
//       <stop offset="100%" stopColor="#0f2744" />
//     </linearGradient>
//     <linearGradient id="bgG" x1="0%" y1="0%" x2="0%" y2="100%">
//       <stop offset="0%" stopColor="#060f1e" />
//       <stop offset="100%" stopColor="#0a1628" />
//     </linearGradient>
//     <filter id="glow">
//       <feGaussianBlur stdDeviation="3" result="cb" />
//       <feMerge>
//         <feMergeNode in="cb" />
//         <feMergeNode in="SourceGraphic" />
//       </feMerge>
//     </filter>
//     {Object.entries(DIM_COLORS).map(([k, c]) => (
//       <React.Fragment key={k}>
//         <marker
//           id={`arrE_${k}`}
//           markerWidth="7"
//           markerHeight="7"
//           refX="6"
//           refY="3.5"
//           orient="auto"
//         >
//           <path d="M0,0 L7,3.5 L0,7 Z" fill={c} />
//         </marker>
//         <marker
//           id={`arrS_${k}`}
//           markerWidth="7"
//           markerHeight="7"
//           refX="1"
//           refY="3.5"
//           orient="auto"
//         >
//           <path d="M7,0 L0,3.5 L7,7 Z" fill={c} />
//         </marker>
//       </React.Fragment>
//     ))}
//   </defs>
// );

const DIM_COLORS_ALL = DIM_COLORS;
const fcl = (k, activeKey) => (activeKey === k ? DIM_COLORS_ALL[k] : "#64748b");
const fwl = (k, activeKey) => (activeKey === k ? 700 : 500);

const TableLayout = ({ nom, mmsType, activeKey, onSelect }) => {
  const r1 = nom?.tableNo1Rows || 2,
    c1 = nom?.tableNo1Cols || 3;
  const r2 = nom?.tableNo2Rows || 2,
    c2 = nom?.tableNo2Cols || 3;
  const cw = 40,
    ch = 50,
    g = 4;

  return (
    <svg viewBox="0 0 360 200" style={{ width: "100%", height: "100%" }}>
      <rect width="360" height="200" fill="#060f1e" rx="8" />
      <text
        x="12"
        y="16"
        fill="#475569"
        fontSize="8"
        fontWeight="600"
        letterSpacing="1"
      >
        TABLE-NO-1
      </text>
      {Array.from({ length: r1 }).map((_, ri) =>
        Array.from({ length: c1 }).map((_, ci) => (
          <rect
            key={`t1${ri}${ci}`}
            x={12 + ci * (cw + g)}
            y={22 + ri * (ch + g)}
            width={cw}
            height={ch}
            fill="#0d1f3c"
            stroke="#1e4080"
            strokeWidth="1.2"
            rx="2"
          />
        )),
      )}
      <g onClick={() => onSelect("B")} style={cur}>
        <line
          x1="8"
          y1="22"
          x2="8"
          y2={22 + r1 * (ch + g) - g}
          stroke={activeKey === "B" ? DIM_COLORS.B : "#334155"}
          strokeWidth="1.2"
        />
        <text
          x="2"
          y={22 + (r1 * (ch + g)) / 2 + 4}
          fill={fcl("B", activeKey)}
          fontSize="10"
          fontWeight={fwl("B", activeKey)}
        >
          B
        </text>
      </g>
      <g onClick={() => onSelect("H")} style={cur}>
        <line
          x1={12 + c1 * (cw + g)}
          y1="180"
          x2="182"
          y2="180"
          stroke={activeKey === "H" ? DIM_COLORS.H : "#334155"}
          strokeWidth="1.2"
          strokeDasharray="2,2"
        />
        <text
          x={12 + c1 * (cw + g) + (182 - (12 + c1 * (cw + g))) / 2}
          y="194"
          textAnchor="middle"
          fill={fcl("H", activeKey)}
          fontSize="10"
          fontWeight={fwl("H", activeKey)}
        >
          ← H →
        </text>
      </g>
      <text
        x="188"
        y="16"
        fill="#475569"
        fontSize="8"
        fontWeight="600"
        letterSpacing="1"
      >
        TABLE-NO-2
      </text>
      {Array.from({ length: r2 }).map((_, ri) =>
        Array.from({ length: c2 }).map((_, ci) => (
          <rect
            key={`t2${ri}${ci}`}
            x={188 + ci * (cw + g)}
            y={22 + ri * (ch + g)}
            width={cw}
            height={ch}
            fill="#0d1f3c"
            stroke="#1e4080"
            strokeWidth="1.2"
            rx="2"
          />
        )),
      )}
      <g onClick={() => onSelect("I")} style={cur}>
        <line
          x1={188 + c2 * (cw + g)}
          y1="20"
          x2={188 + c2 * (cw + g)}
          y2="26"
          stroke={activeKey === "I" ? DIM_COLORS.I : "#334155"}
          strokeWidth="1.2"
        />
        <text
          x={188 + c2 * (cw + g) + 4}
          y="18"
          fill={fcl("I", activeKey)}
          fontSize="10"
          fontWeight={fwl("I", activeKey)}
        >
          I
        </text>
      </g>
    </svg>
  );
};

// ──────────────────────────────────────────────────────────────────────────────
// Demo wrapper
// ──────────────────────────────────────────────────────────────────────────────
// const DEMO_DIMS_2P = {
//   A: { label: "Solar Module Dimension", value: "1722", unit: "mm" },
//   B: { label: "Solar Module Vertical Gap", value: "20", unit: "mm" },
//   C: { label: "Table Width", value: "3464", unit: "mm" },
//   D: { label: "Back Ground Clearance", value: "1500", unit: "mm" },
//   E: { label: "Front Ground Clearance", value: "300", unit: "mm" },
//   F: { label: "Solar Module Height", value: "1134", unit: "mm" },
//   G: { label: "Frame Cross Section", value: "35", unit: "mm" },
//   H: { label: "Inter Table Gap", value: "20", unit: "mm" },
//   I: { label: "Module Gap Horizontal", value: "10", unit: "mm" },
//   J: { label: "Tilt Angle", value: "25", unit: "°" },
// };

// export default function MMSDiagramDemo() {
//   const [activeKey, setActiveKey] = useState(null);
//   const dims = DEMO_DIMS_2P;
//   const dimKeys = Object.keys(dims);
//   const sel = (k) => setActiveKey((p) => (p === k ? null : k));
//   const act = activeKey ? dims[activeKey] : null;

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background: "linear-gradient(160deg,#060f1e 0%,#0a1628 100%)",
//         padding: "24px 16px",
//         fontFamily: "'DM Sans', system-ui, sans-serif",
//         color: "#e2e8f0",
//       }}
//     >
//       <style>{`
//         * { box-sizing: border-box; }
//         @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
//         @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
//         .sdot { width:8px;height:8px;border-radius:50%;background:#10b981;box-shadow:0 0 8px #10b981;animation:pulse 2s infinite;display:inline-block; }
//         .dim-card { background:#0d1f3c;border:1.5px solid #1e3a5f;border-radius:10px;padding:10px 12px;cursor:pointer;transition:all .2s; }
//         .dim-card:hover { border-color:#2563eb; }
//         .dim-card.active { transform:translateY(-2px); }
//         ::-webkit-scrollbar{width:3px} ::-webkit-scrollbar-thumb{background:#1e3a5f;border-radius:2px}
//       `}</style>

//       {/* Header */}
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           gap: 14,
//           marginBottom: 20,
//         }}
//       >
//         <div
//           style={{
//             width: 46,
//             height: 46,
//             borderRadius: 13,
//             background: "linear-gradient(135deg,#1d4ed8,#f59e0b)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             fontSize: 22,
//           }}
//         >
//           ☀️
//         </div>
//         <div>
//           <div
//             style={{
//               fontSize: "1.5rem",
//               fontWeight: 800,
//               letterSpacing: ".04em",
//               lineHeight: 1,
//             }}
//           >
//             MMS Nomenclature Viewer
//           </div>
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: 8,
//               marginTop: 4,
//             }}
//           >
//             <div className="sdot" />
//             <span style={{ color: "#64748b", fontSize: ".72rem" }}>
//               2P Fixed Tilt — Ground Mount
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Main layout */}
//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "1fr 340px",
//           gap: 16,
//           alignItems: "start",
//         }}
//       >
//         {/* Left — diagram */}
//         <div
//           style={{
//             background: "#0a1628",
//             border: "1px solid #1e3a5f",
//             borderRadius: 16,
//             overflow: "hidden",
//           }}
//         >
//           <div
//             style={{
//               background: "linear-gradient(135deg,#0d1f3c,#162d50)",
//               borderBottom: "1px solid #1e3a5f",
//               padding: "12px 16px",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//             }}
//           >
//             <span
//               style={{
//                 fontWeight: 600,
//                 fontSize: ".88rem",
//                 color: "#64748b",
//                 letterSpacing: ".08em",
//                 textTransform: "uppercase",
//               }}
//             >
//               2P Fixed Tilt — Side View
//             </span>
//             {activeKey && (
//               <span
//                 style={{
//                   background: DIM_COLORS[activeKey],
//                   color: "#fff",
//                   fontSize: ".78rem",
//                   fontWeight: 700,
//                   borderRadius: 6,
//                   padding: "3px 10px",
//                 }}
//               >
//                 {activeKey} — {act?.label}
//               </span>
//             )}
//           </div>
//           <div style={{ padding: 16 }}>
//             <div style={{ height: 300 }}>
//               <Diagram2P dims={dims} activeKey={activeKey} onSelect={sel} />
//             </div>
//             <hr style={{ borderColor: "#1e3a5f", margin: "12px 0" }} />
//             <div
//               style={{
//                 fontSize: ".7rem",
//                 letterSpacing: ".12em",
//                 textTransform: "uppercase",
//                 fontWeight: 600,
//                 marginBottom: 10,
//                 color: "#475569",
//               }}
//             >
//               Top View — Panel Module Layout
//             </div>
//             <div style={{ height: 160 }}>
//               <TableLayout
//                 nom={{
//                   tableNo1Rows: 2,
//                   tableNo1Cols: 3,
//                   tableNo2Rows: 2,
//                   tableNo2Cols: 3,
//                 }}
//                 mmsType="2p"
//                 activeKey={activeKey}
//                 onSelect={sel}
//               />
//             </div>
//             <p
//               style={{
//                 fontSize: ".68rem",
//                 textAlign: "center",
//                 marginTop: 8,
//                 color: "#475569",
//               }}
//             >
//               Click any label on the diagram to highlight its specification →
//             </p>
//           </div>
//         </div>

//         {/* Right — specs */}
//         <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
//           {activeKey && act && (
//             <div
//               style={{
//                 background: "linear-gradient(135deg,#0d2d5e,#0f3460)",
//                 border: `1.5px solid ${DIM_COLORS[activeKey]}`,
//                 borderRadius: 12,
//                 padding: "14px 16px",
//                 animation: "fadeIn .3s ease-out",
//               }}
//             >
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 12,
//                   marginBottom: 8,
//                 }}
//               >
//                 <div
//                   style={{
//                     width: 44,
//                     height: 44,
//                     borderRadius: 12,
//                     background: DIM_COLORS[activeKey],
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     fontWeight: 900,
//                     fontSize: 22,
//                     color: "#fff",
//                   }}
//                 >
//                   {activeKey}
//                 </div>
//                 <div>
//                   <div
//                     style={{
//                       fontWeight: 600,
//                       fontSize: ".85rem",
//                       color: "#94a3b8",
//                       lineHeight: 1.2,
//                     }}
//                   >
//                     {act.label}
//                   </div>
//                   <div
//                     style={{
//                       fontSize: "1.9rem",
//                       fontWeight: 800,
//                       color: DIM_COLORS[activeKey],
//                       lineHeight: 1.1,
//                     }}
//                   >
//                     {act.value}{" "}
//                     <span
//                       style={{
//                         fontSize: "1rem",
//                         fontWeight: 500,
//                         color: "#94a3b8",
//                       }}
//                     >
//                       {act.unit}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//               <div style={{ fontSize: ".65rem", color: "#475569" }}>
//                 Dimension {activeKey} ·{" "}
//                 {act.unit === "°"
//                   ? "Angular measurement"
//                   : "Linear measurement"}
//               </div>
//             </div>
//           )}

//           <div
//             style={{
//               background: "#0a1628",
//               border: "1px solid #1e3a5f",
//               borderRadius: 16,
//               overflow: "hidden",
//             }}
//           >
//             <div
//               style={{
//                 background: "linear-gradient(135deg,#0d1f3c,#162d50)",
//                 borderBottom: "1px solid #1e3a5f",
//                 padding: "12px 16px",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//               }}
//             >
//               <span
//                 style={{
//                   fontWeight: 600,
//                   fontSize: ".88rem",
//                   color: "#64748b",
//                   letterSpacing: ".08em",
//                   textTransform: "uppercase",
//                 }}
//               >
//                 Dimensions A–J
//               </span>
//               {activeKey && (
//                 <button
//                   onClick={() => setActiveKey(null)}
//                   style={{
//                     background: "#0d1f3c",
//                     border: "1px solid #1e3a5f",
//                     borderRadius: 6,
//                     color: "#94a3b8",
//                     fontSize: ".7rem",
//                     padding: "2px 8px",
//                     cursor: "pointer",
//                   }}
//                 >
//                   Clear
//                 </button>
//               )}
//             </div>
//             <div
//               style={{
//                 padding: "14px 16px",
//                 maxHeight: 460,
//                 overflowY: "auto",
//               }}
//             >
//               <div
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "1fr 1fr",
//                   gap: 8,
//                 }}
//               >
//                 {dimKeys.map((k) => {
//                   const v = dims[k];
//                   const isAct = activeKey === k;
//                   const c = DIM_COLORS[k] || "#64748b";
//                   return (
//                     <div
//                       key={k}
//                       className={`dim-card${isAct ? " active" : ""}`}
//                       onClick={() => sel(k)}
//                       style={{
//                         border: `1.5px solid ${isAct ? c : "#1e3a5f"}`,
//                         background: isAct ? `${c}15` : "#0d1f3c",
//                         boxShadow: isAct ? `0 6px 20px ${c}28` : "none",
//                       }}
//                     >
//                       <div
//                         style={{
//                           display: "flex",
//                           alignItems: "center",
//                           gap: 8,
//                           marginBottom: 4,
//                         }}
//                       >
//                         <div
//                           style={{
//                             width: 28,
//                             height: 28,
//                             borderRadius: 7,
//                             background: isAct ? c : `${c}22`,
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             fontWeight: 800,
//                             fontSize: 14,
//                             color: isAct ? "#fff" : c,
//                             flexShrink: 0,
//                             transition: "all .2s",
//                           }}
//                         >
//                           {k}
//                         </div>
//                         <div
//                           style={{
//                             fontSize: ".95rem",
//                             fontWeight: 600,
//                             color: isAct ? c : "#e2e8f0",
//                             lineHeight: 1.2,
//                           }}
//                         >
//                           {v?.value ? `${v.value} ${v.unit}` : "—"}
//                         </div>
//                       </div>
//                       <div
//                         style={{
//                           fontSize: ".68rem",
//                           color: "#64748b",
//                           lineHeight: 1.3,
//                         }}
//                       >
//                         {v?.label || `Dimension ${k}`}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// ══════════════════════════════════════════════════════════════════════════════
// 1P-1L — Rooftop single panel portrait/landscape (flat/low-tilt on roof)
// ══════════════════════════════════════════════════════════════════════════════
const SvgDefs = () => (
  <defs>
    <linearGradient id="panelG" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#1e4080" />
      <stop offset="100%" stopColor="#0f2744" />
    </linearGradient>
    <linearGradient id="bgG" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#060f1e" />
      <stop offset="100%" stopColor="#0a1628" />
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="3" result="cb" />
      <feMerge>
        <feMergeNode in="cb" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    {Object.entries(DIM_COLORS).map(([k, c]) => (
      <div key={k}>
        <marker
          id={`arrE_${k}`}
          markerWidth="7"
          markerHeight="7"
          refX="6"
          refY="3.5"
          orient="auto"
        >
          <path d="M0,0 L7,3.5 L0,7 Z" fill={c} />
        </marker>
        <marker
          id={`arrS_${k}`}
          markerWidth="7"
          markerHeight="7"
          refX="1"
          refY="3.5"
          orient="auto"
        >
          <path d="M7,0 L0,3.5 L7,7 Z" fill={c} />
        </marker>
      </div>
    ))}
  </defs>
);

const Diagram1P = ({ dims, activeKey, onSelect }) => {
  const tilt = parseFloat(dims?.J?.value || 10);
  return (
    <svg viewBox="0 0 520 300" style={{ width: "100%", height: "100%" }}>
      <SvgDefs />
      <rect width="520" height="300" fill="url(#bgG)" rx="10" />
      <Sun cx={460} cy={40} />
      {/* Roof base */}
      <Roof y={210} x1={20} x2={490} />
      {/* Single panel on roof tilted */}
      <g transform={`rotate(-${tilt}, 260, 195)`}>
        <PanelGrid x={60} y={175} w={400} h={40} cols={6} rows={1} />
        {/* A — module width */}
        <g onClick={() => onSelect("A")} style={cur}>
          <line
            x1="64"
            y1="168"
            x2="458"
            y2="168"
            stroke={col("A", activeKey)}
            strokeWidth={lw("A", activeKey)}
            markerEnd="url(#arrA)"
            markerStart="url(#arrA)"
          />
          <text
            x="258"
            y="163"
            textAnchor="middle"
            fontSize={fs("A", activeKey)}
            fontWeight={fw("A", activeKey)}
            fill={fc("A", activeKey)}
          >
            A
          </text>
        </g>
        {/* B — vertical gap (module thickness zone) */}
        <g onClick={() => onSelect("B")} style={cur}>
          <line
            x1="52"
            y1="175"
            x2="52"
            y2="215"
            stroke={col("B", activeKey)}
            strokeWidth={lw("B", activeKey)}
            markerEnd="url(#arrB)"
            markerStart="url(#arrB)"
          />
          <text
            x="40"
            y="200"
            fontSize={fs("B", activeKey)}
            fontWeight={fw("B", activeKey)}
            fill={fc("B", activeKey)}
          >
            B
          </text>
        </g>
        {/* K — frame cross section */}
        <g onClick={() => onSelect("K")} style={cur}>
          <circle
            cx="60"
            cy="175"
            r="5"
            fill="none"
            stroke={col("K", activeKey)}
            strokeWidth={lw("K", activeKey)}
          />
          <line
            x1="47"
            y1="162"
            x2="60"
            y2="175"
            stroke={col("K", activeKey)}
            strokeWidth={lw("K", activeKey)}
          />
          <text
            x="34"
            y="158"
            fontSize={fs("K", activeKey)}
            fontWeight={fw("K", activeKey)}
            fill={fc("K", activeKey)}
          >
            K
          </text>
        </g>
      </g>
      {/* C — table width (horizontal) */}
      <g onClick={() => onSelect("C")} style={cur}>
        <line
          x1="60"
          y1="148"
          x2="460"
          y2="148"
          stroke={col("C", activeKey)}
          strokeWidth={lw("C", activeKey)}
          markerEnd="url(#arrC)"
          markerStart="url(#arrC)"
        />
        <text
          x="258"
          y="142"
          textAnchor="middle"
          fontSize={fs("C", activeKey)}
          fontWeight={fw("C", activeKey)}
          fill={fc("C", activeKey)}
        >
          C
        </text>
      </g>
      {/* D — vertical ground clearance */}
      <g onClick={() => onSelect("D")} style={cur}>
        <line
          x1="490"
          y1="175"
          x2="490"
          y2="210"
          stroke={col("D", activeKey)}
          strokeWidth={lw("D", activeKey)}
          markerEnd="url(#arrD)"
          markerStart="url(#arrD)"
        />
        <text
          x="498"
          y="197"
          fontSize={fs("D", activeKey)}
          fontWeight={fw("D", activeKey)}
          fill={fc("D", activeKey)}
        >
          D
        </text>
      </g>
      {/* E — horizontal clearance */}
      <g onClick={() => onSelect("E")} style={cur}>
        <line
          x1="60"
          y1="225"
          x2="100"
          y2="225"
          stroke={col("E", activeKey)}
          strokeWidth={lw("E", activeKey)}
          markerEnd="url(#arrE)"
          markerStart="url(#arrE)"
        />
        <text
          x="80"
          y="238"
          textAnchor="middle"
          fontSize={fs("E", activeKey)}
          fontWeight={fw("E", activeKey)}
          fill={fc("E", activeKey)}
        >
          E
        </text>
      </g>
      {/* F — row to row gap (shown as gap between two mini rows) */}
      <g onClick={() => onSelect("F")} style={cur}>
        <line
          x1="30"
          y1="185"
          x2="30"
          y2="218"
          stroke={col("F", activeKey)}
          strokeWidth={lw("F", activeKey)}
          markerEnd="url(#arrF)"
          markerStart="url(#arrF)"
        />
        <text
          x="18"
          y="206"
          fontSize={fs("F", activeKey)}
          fontWeight={fw("F", activeKey)}
          fill={fc("F", activeKey)}
        >
          F
        </text>
      </g>
      {/* G — horizontal module gap */}
      <g onClick={() => onSelect("G")} style={cur}>
        <line
          x1="455"
          y1="188"
          x2="475"
          y2="188"
          stroke={col("G", activeKey)}
          strokeWidth={lw("G", activeKey)}
          markerEnd="url(#arrG)"
          markerStart="url(#arrG)"
        />
        <text
          x="465"
          y="182"
          textAnchor="middle"
          fontSize={fs("G", activeKey)}
          fontWeight={fw("G", activeKey)}
          fill={fc("G", activeKey)}
        >
          G
        </text>
      </g>
      {/* H — inter table gap */}
      <g onClick={() => onSelect("H")} style={cur}>
        <line
          x1="60"
          y1="258"
          x2="120"
          y2="258"
          stroke={col("H", activeKey)}
          strokeWidth={lw("H", activeKey)}
          markerEnd="url(#arrH)"
          markerStart="url(#arrH)"
        />
        <text
          x="90"
          y="270"
          textAnchor="middle"
          fontSize={fs("H", activeKey)}
          fontWeight={fw("H", activeKey)}
          fill={fc("H", activeKey)}
        >
          H
        </text>
      </g>
      {/* I — frame cross section */}
      <g onClick={() => onSelect("I")} style={cur}>
        <rect
          x="460"
          y="172"
          width="12"
          height="12"
          fill="none"
          stroke={col("I", activeKey)}
          strokeWidth={lw("I", activeKey)}
        />
        <text
          x="476"
          y="182"
          fontSize={fs("I", activeKey)}
          fontWeight={fw("I", activeKey)}
          fill={fc("I", activeKey)}
        >
          I
        </text>
      </g>
      {/* J tilt arc */}
      <g onClick={() => onSelect("J")} style={cur}>
        <path
          d={`M 260 210 A 30 30 0 0 1 ${260 + 30 * Math.cos(((90 - tilt) * Math.PI) / 180)} ${210 - 30 * Math.sin(((90 - tilt) * Math.PI) / 180)}`}
          fill="none"
          stroke={col("J", activeKey)}
          strokeWidth={lw("J", activeKey)}
          strokeDasharray="3,2"
        />
        <text
          x="280"
          y="206"
          fontSize={fs("J", activeKey)}
          fontWeight={fw("J", activeKey)}
          fill={fc("J", activeKey)}
        >
          J={tilt}°
        </text>
      </g>
      <text
        x="16"
        y="292"
        fill="#1e3a5f"
        fontSize="8"
        fontWeight="700"
        letterSpacing="2"
      >
        TAYPRO® 1P PORTRAIT/LANDSCAPE
      </text>
    </svg>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// 3P-3L — Rooftop 3-panel portrait/landscape
// ══════════════════════════════════════════════════════════════════════════════
const DiagramNP = ({ dims, activeKey, onSelect, panelCount = 3 }) => {
  const tilt = parseFloat(dims?.J?.value || 10);
  const pW = 88; // each panel width
  const gap = 6;
  const totalW = panelCount * pW + (panelCount - 1) * gap;
  const startX = (460 - totalW) / 2;
  return (
    <svg viewBox="0 0 520 300" style={{ width: "100%", height: "100%" }}>
      <SvgDefs />
      <rect width="520" height="300" fill="url(#bgG)" rx="10" />
      <Sun cx={460} cy={40} />
      <Roof y={210} x1={20} x2={490} />
      {/* panels on roof */}
      <g transform={`rotate(-${tilt}, 260, 195)`}>
        {Array.from({ length: panelCount }).map((_, i) => (
          <PanelGrid
            key={i}
            x={startX + i * (pW + gap)}
            y={178}
            w={pW}
            h={38}
            cols={5}
            rows={2}
          />
        ))}
        {/* A — single module width */}
        <g onClick={() => onSelect("A")} style={cur}>
          <line
            x1={startX}
            y1="168"
            x2={startX + pW}
            y2="168"
            stroke={col("A", activeKey)}
            strokeWidth={lw("A", activeKey)}
            markerEnd="url(#arrA)"
            markerStart="url(#arrA)"
          />
          <text
            x={startX + pW / 2}
            y="162"
            textAnchor="middle"
            fontSize={fs("A", activeKey)}
            fontWeight={fw("A", activeKey)}
            fill={fc("A", activeKey)}
          >
            A
          </text>
        </g>
        {/* B — gap between panels */}
        <g onClick={() => onSelect("B")} style={cur}>
          <line
            x1={startX + pW}
            y1="183"
            x2={startX + pW + gap}
            y2="183"
            stroke={col("B", activeKey)}
            strokeWidth={lw("B", activeKey)}
            markerEnd="url(#arrB)"
            markerStart="url(#arrB)"
          />
          <text
            x={startX + pW + gap / 2}
            y="178"
            textAnchor="middle"
            fontSize={fs("B", activeKey)}
            fontWeight={fw("B", activeKey)}
            fill={fc("B", activeKey)}
          >
            B
          </text>
        </g>
        {/* K — frame cross section */}
        <g onClick={() => onSelect("K")} style={cur}>
          <circle
            cx={startX}
            cy="178"
            r="5"
            fill="none"
            stroke={col("K", activeKey)}
            strokeWidth={lw("K", activeKey)}
          />
          <line
            x1={startX - 12}
            y1="165"
            x2={startX}
            y2="178"
            stroke={col("K", activeKey)}
            strokeWidth={lw("K", activeKey)}
          />
          <text
            x={startX - 22}
            y="162"
            fontSize={fs("K", activeKey)}
            fontWeight={fw("K", activeKey)}
            fill={fc("K", activeKey)}
          >
            K
          </text>
        </g>
      </g>
      {/* C — total table width */}
      <g onClick={() => onSelect("C")} style={cur}>
        <line
          x1={startX}
          y1="148"
          x2={startX + totalW}
          y2="148"
          stroke={col("C", activeKey)}
          strokeWidth={lw("C", activeKey)}
          markerEnd="url(#arrC)"
          markerStart="url(#arrC)"
        />
        <text
          x={startX + totalW / 2}
          y="142"
          textAnchor="middle"
          fontSize={fs("C", activeKey)}
          fontWeight={fw("C", activeKey)}
          fill={fc("C", activeKey)}
        >
          C (={panelCount > 1 ? `${panelCount}A+${panelCount - 1}B` : "A"})
        </text>
      </g>
      {/* D — vertical ground clearance */}
      <g onClick={() => onSelect("D")} style={cur}>
        <line
          x1="494"
          y1="178"
          x2="494"
          y2="210"
          stroke={col("D", activeKey)}
          strokeWidth={lw("D", activeKey)}
          markerEnd="url(#arrD)"
          markerStart="url(#arrD)"
        />
        <text
          x="502"
          y="198"
          fontSize={fs("D", activeKey)}
          fontWeight={fw("D", activeKey)}
          fill={fc("D", activeKey)}
        >
          D
        </text>
      </g>
      {/* E — horizontal clearance */}
      <g onClick={() => onSelect("E")} style={cur}>
        <line
          x1={startX + totalW + 10}
          y1="222"
          x2={startX + totalW + 42}
          y2="222"
          stroke={col("E", activeKey)}
          strokeWidth={lw("E", activeKey)}
          markerEnd="url(#arrE)"
          markerStart="url(#arrE)"
        />
        <text
          x={startX + totalW + 26}
          y="234"
          textAnchor="middle"
          fontSize={fs("E", activeKey)}
          fontWeight={fw("E", activeKey)}
          fill={fc("E", activeKey)}
        >
          E
        </text>
      </g>
      {/* F — row to row gap */}
      <g onClick={() => onSelect("F")} style={cur}>
        <line
          x1="26"
          y1="185"
          x2="26"
          y2="218"
          stroke={col("F", activeKey)}
          strokeWidth={lw("F", activeKey)}
          markerEnd="url(#arrF)"
          markerStart="url(#arrF)"
        />
        <text
          x="14"
          y="206"
          fontSize={fs("F", activeKey)}
          fontWeight={fw("F", activeKey)}
          fill={fc("F", activeKey)}
        >
          F
        </text>
      </g>
      {/* G — horizontal module gap */}
      <g onClick={() => onSelect("G")} style={cur}>
        <line
          x1="44"
          y1="225"
          x2="80"
          y2="225"
          stroke={col("G", activeKey)}
          strokeWidth={lw("G", activeKey)}
          markerEnd="url(#arrG)"
          markerStart="url(#arrG)"
        />
        <text
          x="62"
          y="236"
          textAnchor="middle"
          fontSize={fs("G", activeKey)}
          fontWeight={fw("G", activeKey)}
          fill={fc("G", activeKey)}
        >
          G
        </text>
      </g>
      {/* H — inter table gap */}
      <g onClick={() => onSelect("H")} style={cur}>
        <line
          x1="44"
          y1="255"
          x2="110"
          y2="255"
          stroke={col("H", activeKey)}
          strokeWidth={lw("H", activeKey)}
          markerEnd="url(#arrH)"
          markerStart="url(#arrH)"
        />
        <text
          x="77"
          y="267"
          textAnchor="middle"
          fontSize={fs("H", activeKey)}
          fontWeight={fw("H", activeKey)}
          fill={fc("H", activeKey)}
        >
          H
        </text>
      </g>
      {/* I — frame cross section */}
      <g onClick={() => onSelect("I")} style={cur}>
        <rect
          x="460"
          y="174"
          width="10"
          height="10"
          fill="none"
          stroke={col("I", activeKey)}
          strokeWidth={lw("I", activeKey)}
        />
        <text
          x="474"
          y="183"
          fontSize={fs("I", activeKey)}
          fontWeight={fw("I", activeKey)}
          fill={fc("I", activeKey)}
        >
          I
        </text>
      </g>
      {/* J — tilt angle */}
      <g onClick={() => onSelect("J")} style={cur}>
        <path
          d={`M 260 210 A 28 28 0 0 1 ${260 + 28 * Math.cos(((90 - tilt) * Math.PI) / 180)} ${210 - 28 * Math.sin(((90 - tilt) * Math.PI) / 180)}`}
          fill="none"
          stroke={col("J", activeKey)}
          strokeWidth={lw("J", activeKey)}
          strokeDasharray="3,2"
        />
        <text
          x="278"
          y="206"
          fontSize={fs("J", activeKey)}
          fontWeight={fw("J", activeKey)}
          fill={fc("J", activeKey)}
        >
          J={tilt}°
        </text>
      </g>
      <text
        x="16"
        y="292"
        fill="#1e3a5f"
        fontSize="8"
        fontWeight="700"
        letterSpacing="2"
      >
        TAYPRO® {panelCount}P PORTRAIT/LANDSCAPE
      </text>
    </svg>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// Tracker MMS — Single-axis tracker with bearing housing
// ══════════════════════════════════════════════════════════════════════════════
const DiagramTracker = ({ dims, activeKey, onSelect }) => {
  const tilt = 20; // trackers are shown at operational angle
  return (
    <svg viewBox="0 0 520 300" style={{ width: "100%", height: "100%" }}>
      <SvgDefs />
      <rect width="520" height="300" fill="url(#bgG)" rx="10" />
      <Sun cx={460} cy={40} />
      <Ground y={250} />
      {/* Tracker poles */}
      <rect x="148" y="195" width="10" height="55" fill="#1a3a70" rx="2" />
      <rect x="140" y="247" width="26" height="7" fill="#1a3a70" rx="2" />
      <rect x="308" y="195" width="10" height="55" fill="#1a3a70" rx="2" />
      <rect x="300" y="247" width="26" height="7" fill="#1a3a70" rx="2" />
      {/* Torque tube (horizontal at pivot) */}
      <rect x="110" y="191" width="246" height="8" fill="#2563eb" rx="3" />
      {/* Bearing housing circles */}
      <circle
        cx="153"
        cy="195"
        r="9"
        fill="none"
        stroke="#f97316"
        strokeWidth="2"
      />
      <circle
        cx="313"
        cy="195"
        r="9"
        fill="none"
        stroke="#f97316"
        strokeWidth="2"
      />
      {/* Panel tilted on tracker */}
      <g transform={`rotate(-${tilt}, 228, 190)`}>
        <PanelGrid x={90} y={158} w={280} h={54} cols={5} rows={2} />
        {/* A — module length */}
        <g onClick={() => onSelect("A")} style={cur}>
          <line
            x1="94"
            y1="150"
            x2="366"
            y2="150"
            stroke={col("A", activeKey)}
            strokeWidth={lw("A", activeKey)}
            markerEnd="url(#arrA)"
            markerStart="url(#arrA)"
          />
          <text
            x="228"
            y="145"
            textAnchor="middle"
            fontSize={fs("A", activeKey)}
            fontWeight={fw("A", activeKey)}
            fill={fc("A", activeKey)}
          >
            A — Module Length
          </text>
        </g>
        {/* B — thickness */}
        <g onClick={() => onSelect("B")} style={cur}>
          <line
            x1="78"
            y1="158"
            x2="78"
            y2="212"
            stroke={col("B", activeKey)}
            strokeWidth={lw("B", activeKey)}
            markerEnd="url(#arrB)"
            markerStart="url(#arrB)"
          />
          <text
            x="64"
            y="190"
            fontSize={fs("B", activeKey)}
            fontWeight={fw("B", activeKey)}
            fill={fc("B", activeKey)}
          >
            B
          </text>
        </g>
        {/* C — frame cross section (callout circle) */}
        <g onClick={() => onSelect("C")} style={cur}>
          <circle
            cx="370"
            cy="158"
            r="8"
            fill="none"
            stroke={col("C", activeKey)}
            strokeWidth={lw("C", activeKey)}
          />
          <line
            x1="370"
            y1="166"
            x2="390"
            y2="185"
            stroke={col("C", activeKey)}
            strokeWidth={lw("C", activeKey)}
          />
          <text
            x="394"
            y="193"
            fontSize={fs("C", activeKey)}
            fontWeight={fw("C", activeKey)}
            fill={fc("C", activeKey)}
          >
            C
          </text>
        </g>
      </g>
      {/* H — inter table gap (fixed bridge) */}
      <g onClick={() => onSelect("H")} style={cur}>
        <line
          x1="370"
          y1="198"
          x2="420"
          y2="198"
          stroke={col("H", activeKey)}
          strokeWidth={lw("H", activeKey)}
          markerEnd="url(#arrH)"
          markerStart="url(#arrH)"
        />
        <text
          x="395"
          y="192"
          textAnchor="middle"
          fontSize={fs("H", activeKey)}
          fontWeight={fw("H", activeKey)}
          fill={fc("H", activeKey)}
        >
          H (Fixed)
        </text>
      </g>
      {/* Bearing housing label */}
      <g onClick={() => onSelect("G")} style={cur}>
        <line
          x1="153"
          y1="206"
          x2="153"
          y2="230"
          stroke={col("G", activeKey)}
          strokeWidth={lw("G", activeKey)}
        />
        <text
          x="118"
          y="242"
          fontSize={fs("G", activeKey)}
          fontWeight={fw("G", activeKey)}
          fill={fc("G", activeKey)}
        >
          BHA Gap
        </text>
      </g>
      {/* Tilt indicator */}
      <g>
        <path
          d={`M 228 250 A 40 40 0 0 1 ${228 + 40 * Math.cos(((90 - tilt) * Math.PI) / 180)} ${250 - 40 * Math.sin(((90 - tilt) * Math.PI) / 180)}`}
          fill="none"
          stroke="#e11d48"
          strokeWidth="1.5"
          strokeDasharray="3,2"
        />
        <text x="246" y="242" fontSize="10" fontWeight="600" fill="#e11d48">
          ±{tilt}°
        </text>
      </g>
      <text
        x="16"
        y="290"
        fill="#1e3a5f"
        fontSize="8"
        fontWeight="700"
        letterSpacing="2"
      >
        TAYPRO® SINGLE-AXIS TRACKER
      </text>
    </svg>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// Top-view table layout (reused across types, adapts panel count per table)
// ══════════════════════════════════════════════════════════════════════════════
// const TableLayout = ({ nom, mmsType, activeKey, onSelect }) => {
//   const isPanelType = ["1p-1l", "3p-3l", "4p-4l"].includes(
//     (mmsType || "").toLowerCase(),
//   );
//   const r1 = nom?.tableNo1Rows || 2,
//     c1 = nom?.tableNo1Cols || (isPanelType ? 4 : 3);
//   const r2 = nom?.tableNo2Rows || 2,
//     c2 = nom?.tableNo2Cols || (isPanelType ? 4 : 3);
//   const cw = 40,
//     ch = 50,
//     g = 4;
//   const fcl = (k) => (activeKey === k ? DIM_COLORS[k] : "#64748b");
//   const fwl = (k) => (activeKey === k ? 700 : 500);

//   return (
//     <svg viewBox="0 0 360 200" style={{ width: "100%", height: "100%" }}>
//       <rect width="360" height="200" fill="#060f1e" rx="8" />
//       <text
//         x="12"
//         y="16"
//         fill="#475569"
//         fontSize="8"
//         fontWeight="600"
//         letterSpacing="1"
//       >
//         TABLE-NO-1
//       </text>
//       {Array.from({ length: r1 }).map((_, ri) =>
//         Array.from({ length: c1 }).map((_, ci) => (
//           <rect
//             key={`t1${ri}${ci}`}
//             x={12 + ci * (cw + g)}
//             y={22 + ri * (ch + g)}
//             width={cw}
//             height={ch}
//             fill="#0d1f3c"
//             stroke="#1e4080"
//             strokeWidth="1.2"
//             rx="2"
//           />
//         )),
//       )}
//       {/* B arrow */}
//       <g onClick={() => onSelect("B")} style={cur}>
//         <line
//           x1="8"
//           y1="22"
//           x2="8"
//           y2={22 + r1 * (ch + g) - g}
//           stroke={activeKey === "B" ? DIM_COLORS.B : "#334155"}
//           strokeWidth="1.2"
//         />
//         <text
//           x="2"
//           y={22 + (r1 * (ch + g)) / 2 + 4}
//           fill={fcl("B")}
//           fontSize="10"
//           fontWeight={fwl("B")}
//         >
//           B
//         </text>
//       </g>
//       {/* H inter-table gap */}
//       <g onClick={() => onSelect("H")} style={cur}>
//         <line
//           x1={12 + c1 * (cw + g)}
//           y1="180"
//           x2="182"
//           y2="180"
//           stroke={activeKey === "H" ? DIM_COLORS.H : "#334155"}
//           strokeWidth="1.2"
//           strokeDasharray="2,2"
//         />
//         <text
//           x={12 + c1 * (cw + g) + (182 - (12 + c1 * (cw + g))) / 2}
//           y="194"
//           textAnchor="middle"
//           fill={fcl("H")}
//           fontSize="10"
//           fontWeight={fwl("H")}
//         >
//           ← H →
//         </text>
//       </g>
//       <text
//         x="188"
//         y="16"
//         fill="#475569"
//         fontSize="8"
//         fontWeight="600"
//         letterSpacing="1"
//       >
//         TABLE-NO-2
//       </text>
//       {Array.from({ length: r2 }).map((_, ri) =>
//         Array.from({ length: c2 }).map((_, ci) => (
//           <rect
//             key={`t2${ri}${ci}`}
//             x={188 + ci * (cw + g)}
//             y={22 + ri * (ch + g)}
//             width={cw}
//             height={ch}
//             fill="#0d1f3c"
//             stroke="#1e4080"
//             strokeWidth="1.2"
//             rx="2"
//           />
//         )),
//       )}
//       {/* I */}
//       <g onClick={() => onSelect("I")} style={cur}>
//         <line
//           x1={188 + c2 * (cw + g)}
//           y1="20"
//           x2={188 + c2 * (cw + g)}
//           y2="26"
//           stroke={activeKey === "I" ? DIM_COLORS.I : "#334155"}
//           strokeWidth="1.2"
//         />
//         <text
//           x={188 + c2 * (cw + g) + 4}
//           y="18"
//           fill={fcl("I")}
//           fontSize="10"
//           fontWeight={fwl("I")}
//         >
//           I
//         </text>
//       </g>
//     </svg>
//   );
// };

// ══════════════════════════════════════════════════════════════════════════════
// Tracker top-view layout
// ══════════════════════════════════════════════════════════════════════════════
const TrackerLayout = ({ activeKey, onSelect }) => {
  const fcl = (k) => (activeKey === k ? DIM_COLORS[k] : "#64748b");
  const fwl = (k) => (activeKey === k ? 700 : 500);
  return (
    <svg viewBox="0 0 360 200" style={{ width: "100%", height: "100%" }}>
      <rect width="360" height="200" fill="#060f1e" rx="8" />
      <text
        x="12"
        y="16"
        fill="#475569"
        fontSize="8"
        fontWeight="600"
        letterSpacing="1"
      >
        TRACKER TOP VIEW
      </text>
      {/* Torque tube (long horizontal bar) */}
      <rect x="20" y="94" width="320" height="12" fill="#1a3a70" rx="3" />
      {/* Table panels */}
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect
            x={22 + i * 76}
            y={22}
            width={68}
            height={66}
            fill="#0d1f3c"
            stroke="#1e4080"
            strokeWidth="1.2"
            rx="2"
          />
          <rect
            x={22 + i * 76}
            y={112}
            width={68}
            height={66}
            fill="#0d1f3c"
            stroke="#1e4080"
            strokeWidth="1.2"
            rx="2"
          />
        </g>
      ))}
      {/* Bearing housing dots */}
      {[1, 2, 3].map((i) => (
        <circle
          key={i}
          cx={20 + i * 76}
          cy={100}
          r="6"
          fill="none"
          stroke={activeKey === "G" ? DIM_COLORS.G : "#334155"}
          strokeWidth="1.5"
        />
      ))}
      <g onClick={() => onSelect("G")} style={cur}>
        <text
          x="170"
          y="195"
          textAnchor="middle"
          fill={fcl("G")}
          fontSize="9"
          fontWeight={fwl("G")}
        >
          G — Bearing Housing Gaps
        </text>
      </g>
      <g onClick={() => onSelect("H")} style={cur}>
        <line
          x1="90"
          y1="186"
          x2="166"
          y2="186"
          stroke={activeKey === "H" ? DIM_COLORS.H : "#334155"}
          strokeWidth="1.2"
          strokeDasharray="2,2"
        />
        <text
          x="128"
          y="180"
          textAnchor="middle"
          fill={fcl("H")}
          fontSize="9"
          fontWeight={fwl("H")}
        >
          ← H →
        </text>
      </g>
    </svg>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// Master router — picks correct diagram based on mms_type
// ══════════════════════════════════════════════════════════════════════════════
const MountingDiagram = ({ mmsType, dims, activeKey, onSelect }) => {
  const t = (mmsType || "").toLowerCase();
  if (t === "2p")
    return <Diagram2P dims={dims} activeKey={activeKey} onSelect={onSelect} />;
  if (t === "1p-1l")
    return <Diagram1P dims={dims} activeKey={activeKey} onSelect={onSelect} />;
  if (t === "3p-3l")
    return (
      <DiagramNP
        dims={dims}
        activeKey={activeKey}
        onSelect={onSelect}
        panelCount={3}
      />
    );
  if (t === "4p-4l")
    return (
      <DiagramNP
        dims={dims}
        activeKey={activeKey}
        onSelect={onSelect}
        panelCount={4}
      />
    );
  if (t === "tracker")
    return (
      <DiagramTracker dims={dims} activeKey={activeKey} onSelect={onSelect} />
    );
  // fallback
  return <Diagram2P dims={dims} activeKey={activeKey} onSelect={onSelect} />;
};

const MountingTopView = ({ mmsType, nom, activeKey, onSelect }) => {
  const t = (mmsType || "").toLowerCase();
  if (t === "tracker")
    return <TrackerLayout activeKey={activeKey} onSelect={onSelect} />;
  return (
    <TableLayout
      nom={nom}
      mmsType={mmsType}
      activeKey={activeKey}
      onSelect={onSelect}
    />
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// Label for diagram header
// ══════════════════════════════════════════════════════════════════════════════
const MMS_LABELS = {
  "2p": "2P Fixed Tilt — Side View",
  "1p-1l": "1P Portrait/Landscape — Rooftop Side View",
  "3p-3l": "3P Portrait/Landscape — Rooftop Side View",
  "4p-4l": "4P Portrait/Landscape — Rooftop Side View",
  tracker: "Single-Axis Tracker — Side View",
};

// ══════════════════════════════════════════════════════════════════════════════
// Demo wrapper (shows the diagram panel with type switcher for preview)
// ══════════════════════════════════════════════════════════════════════════════
// const DEMO_DIMS_2P = {
//   A: { label: "Solar Module Dimension", value: "1722", unit: "mm" },
//   B: { label: "Solar Module Vertical Gap", value: "20", unit: "mm" },
//   C: { label: "Table Width", value: "3464", unit: "mm" },
//   D: { label: "Back Ground Clearance", value: "1500", unit: "mm" },
//   E: { label: "Front Ground Clearance", value: "300", unit: "mm" },
//   F: { label: "Solar Module Height", value: "1134", unit: "mm" },
//   G: { label: "Frame Cross Section", value: "35", unit: "mm" },
//   H: { label: "Inter Table Gap", value: "20", unit: "mm" },
//   I: { label: "Module Gap Horizontal", value: "10", unit: "mm" },
//   J: { label: "Tilt Angle", value: "25", unit: "°" },
// };
const DEMO_DIMS_TRACKER = {
  A: { label: "Solar Module Length", value: "2278", unit: "mm" },
  B: { label: "Module Thickness", value: "35", unit: "mm" },
  C: { label: "Frame Cross Section", value: "40", unit: "mm" },
  G: { label: "BHA Gap", value: "15", unit: "mm" },
  H: { label: "Inter Table Gap (Fixed)", value: "150", unit: "mm" },
};
const DEMO_DIMS_ROOF = {
  A: { label: "Solar Module Dimension", value: "1134", unit: "mm" },
  B: { label: "Solar Module Vertical Gap", value: "10", unit: "mm" },
  C: { label: "Table Width", value: "3800", unit: "mm" },
  D: { label: "Vertical Ground Clearance", value: "200", unit: "mm" },
  E: { label: "Horizontal Clearance", value: "150", unit: "mm" },
  F: { label: "Row to Row Gap", value: "800", unit: "mm" },
  G: { label: "Module Gap Horizontal", value: "10", unit: "mm" },
  H: { label: "Inter Table Gap", value: "20", unit: "mm" },
  I: { label: "Frame Cross Section", value: "35", unit: "mm" },
  J: { label: "Tilt Angle", value: "10", unit: "°" },
  K: { label: "Frame Cross Section Alt", value: "30", unit: "mm" },
};

const TYPE_OPTIONS = [
  { value: "2p", label: "2P Fixed Tilt" },
  { value: "1p-1l", label: "1P Portrait/Landscape" },
  { value: "3p-3l", label: "3P Portrait/Landscape" },
  { value: "4p-4l", label: "4P Portrait/Landscape" },
  { value: "tracker", label: "Tracker MMS" },
];

const getDemoDims = (type) => {
  if (type === "tracker") return DEMO_DIMS_TRACKER;
  if (type === "2p") return DEMO_DIMS_2P;
  return DEMO_DIMS_ROOF;
};

// export default function MMSDiagramDemo() {
//   const [mmsType, setMmsType] = useState("2p");
//   const [activeKey, setActiveKey] = useState(null);
//   const dims = getDemoDims(mmsType);
//   const dimKeys = Object.keys(dims);

//   const sel = (k) => setActiveKey((p) => (p === k ? null : k));
//   const act = activeKey ? dims[activeKey] : null;
//   const diagramLabel = MMS_LABELS[mmsType] || "Mounting Structure — Side View";

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background: "linear-gradient(160deg,#060f1e 0%,#0a1628 100%)",
//         padding: "24px 16px",
//         fontFamily: "'DM Sans', system-ui, sans-serif",
//         color: "#e2e8f0",
//       }}
//     >
//       <style>{`
//         * { box-sizing: border-box; }
//         @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
//         @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
//         .sdot { width:8px;height:8px;border-radius:50%;background:#10b981;box-shadow:0 0 8px #10b981;animation:pulse 2s infinite;display:inline-block; }
//         .type-btn { background:#0d1f3c;border:1px solid #1e3a5f;border-radius:8px;color:#94a3b8;font-size:.78rem;font-weight:600;padding:6px 14px;cursor:pointer;transition:all .2s; }
//         .type-btn:hover { border-color:#2563eb;color:#e2e8f0; }
//         .type-btn.active { background:linear-gradient(135deg,#1d4ed8,#2563eb);border-color:#2563eb;color:#fff;box-shadow:0 4px 14px rgba(37,99,235,.4); }
//         .dim-card { background:#0d1f3c;border:1.5px solid #1e3a5f;border-radius:10px;padding:10px 12px;cursor:pointer;transition:all .2s; }
//         .dim-card:hover { border-color:#2563eb; }
//         .dim-card.active { transform:translateY(-2px); }
//         ::-webkit-scrollbar{width:3px} ::-webkit-scrollbar-thumb{background:#1e3a5f;border-radius:2px}
//       `}</style>

//       {/* Header */}
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           gap: 14,
//           marginBottom: 20,
//           animation: "fadeIn .4s ease-out",
//         }}
//       >
//         <div
//           style={{
//             width: 46,
//             height: 46,
//             borderRadius: 13,
//             background: "linear-gradient(135deg,#1d4ed8,#f59e0b)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             fontSize: 22,
//           }}
//         >
//           ☀️
//         </div>
//         <div>
//           <div
//             style={{
//               fontSize: "1.5rem",
//               fontWeight: 800,
//               letterSpacing: ".04em",
//               lineHeight: 1,
//             }}
//           >
//             MMS Nomenclature Viewer
//           </div>
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: 8,
//               marginTop: 4,
//             }}
//           >
//             <div className="sdot" />
//             <span style={{ color: "#64748b", fontSize: ".72rem" }}>
//               Dynamic diagram —{" "}
//               {TYPE_OPTIONS.find((t) => t.value === mmsType)?.label}
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Type switcher */}
//       <div
//         style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}
//       >
//         {TYPE_OPTIONS.map((t) => (
//           <button
//             key={t.value}
//             className={`type-btn${mmsType === t.value ? " active" : ""}`}
//             onClick={() => {
//               setMmsType(t.value);
//               setActiveKey(null);
//             }}
//           >
//             {t.label}
//           </button>
//         ))}
//       </div>

//       {/* Main layout */}
//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "1fr 340px",
//           gap: 16,
//           alignItems: "start",
//         }}
//       >
//         {/* Left — diagram */}
//         <div
//           style={{
//             background: "#0a1628",
//             border: "1px solid #1e3a5f",
//             borderRadius: 16,
//             overflow: "hidden",
//           }}
//         >
//           <div
//             style={{
//               background: "linear-gradient(135deg,#0d1f3c,#162d50)",
//               borderBottom: "1px solid #1e3a5f",
//               padding: "12px 16px",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//             }}
//           >
//             <span
//               style={{
//                 fontWeight: 600,
//                 fontSize: ".88rem",
//                 color: "#64748b",
//                 letterSpacing: ".08em",
//                 textTransform: "uppercase",
//               }}
//             >
//               {diagramLabel}
//             </span>
//             {activeKey && (
//               <span
//                 style={{
//                   background: DIM_COLORS[activeKey],
//                   color: "#fff",
//                   fontSize: ".78rem",
//                   fontWeight: 700,
//                   borderRadius: 6,
//                   padding: "3px 10px",
//                 }}
//               >
//                 {activeKey} — {act?.label}
//               </span>
//             )}
//           </div>
//           <div style={{ padding: 16 }}>
//             <div style={{ height: 290 }}>
//               <MountingDiagram
//                 mmsType={mmsType}
//                 dims={dims}
//                 activeKey={activeKey}
//                 onSelect={sel}
//               />
//             </div>
//             <hr style={{ borderColor: "#1e3a5f", margin: "12px 0" }} />
//             <div
//               style={{
//                 fontSize: ".7rem",
//                 letterSpacing: ".12em",
//                 textTransform: "uppercase",
//                 fontWeight: 600,
//                 marginBottom: 10,
//                 color: "#475569",
//               }}
//             >
//               Top View — Panel Module Layout
//             </div>
//             <div style={{ height: 160 }}>
//               <MountingTopView
//                 mmsType={mmsType}
//                 nom={{
//                   tableNo1Rows: 2,
//                   tableNo1Cols: 3,
//                   tableNo2Rows: 2,
//                   tableNo2Cols: 3,
//                 }}
//                 activeKey={activeKey}
//                 onSelect={sel}
//               />
//             </div>
//             <p
//               style={{
//                 fontSize: ".68rem",
//                 textAlign: "center",
//                 marginTop: 8,
//                 color: "#475569",
//               }}
//             >
//               Click any label on the diagram to highlight its specification →
//             </p>
//           </div>
//         </div>

//         {/* Right — specs */}
//         <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
//           {/* Active dimension spotlight */}
//           {activeKey && act && (
//             <div
//               style={{
//                 background: "linear-gradient(135deg,#0d2d5e,#0f3460)",
//                 border: `1.5px solid ${DIM_COLORS[activeKey]}`,
//                 borderRadius: 12,
//                 padding: "14px 16px",
//                 animation: "fadeIn .3s ease-out",
//               }}
//             >
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 12,
//                   marginBottom: 8,
//                 }}
//               >
//                 <div
//                   style={{
//                     width: 44,
//                     height: 44,
//                     borderRadius: 12,
//                     background: DIM_COLORS[activeKey],
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     fontWeight: 900,
//                     fontSize: 22,
//                     color: "#fff",
//                   }}
//                 >
//                   {activeKey}
//                 </div>
//                 <div>
//                   <div
//                     style={{
//                       fontWeight: 600,
//                       fontSize: ".85rem",
//                       color: "#94a3b8",
//                       lineHeight: 1.2,
//                     }}
//                   >
//                     {act.label}
//                   </div>
//                   <div
//                     style={{
//                       fontSize: "1.9rem",
//                       fontWeight: 800,
//                       color: DIM_COLORS[activeKey],
//                       lineHeight: 1.1,
//                     }}
//                   >
//                     {act.value}{" "}
//                     <span
//                       style={{
//                         fontSize: "1rem",
//                         fontWeight: 500,
//                         color: "#94a3b8",
//                       }}
//                     >
//                       {act.unit}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//               <div style={{ fontSize: ".65rem", color: "#475569" }}>
//                 Dimension {activeKey} ·{" "}
//                 {act.unit === "°"
//                   ? "Angular measurement"
//                   : "Linear measurement"}
//               </div>
//             </div>
//           )}

//           {/* All dimension cards */}
//           <div
//             style={{
//               background: "#0a1628",
//               border: "1px solid #1e3a5f",
//               borderRadius: 16,
//               overflow: "hidden",
//             }}
//           >
//             <div
//               style={{
//                 background: "linear-gradient(135deg,#0d1f3c,#162d50)",
//                 borderBottom: "1px solid #1e3a5f",
//                 padding: "12px 16px",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//               }}
//             >
//               <span
//                 style={{
//                   fontWeight: 600,
//                   fontSize: ".88rem",
//                   color: "#64748b",
//                   letterSpacing: ".08em",
//                   textTransform: "uppercase",
//                 }}
//               >
//                 Dimensions {dimKeys[0]}–{dimKeys[dimKeys.length - 1]}
//               </span>
//               {activeKey && (
//                 <button
//                   onClick={() => setActiveKey(null)}
//                   style={{
//                     background: "#0d1f3c",
//                     border: "1px solid #1e3a5f",
//                     borderRadius: 6,
//                     color: "#94a3b8",
//                     fontSize: ".7rem",
//                     padding: "2px 8px",
//                     cursor: "pointer",
//                   }}
//                 >
//                   Clear
//                 </button>
//               )}
//             </div>
//             <div
//               style={{
//                 padding: "14px 16px",
//                 maxHeight: 460,
//                 overflowY: "auto",
//               }}
//             >
//               <div
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "1fr 1fr",
//                   gap: 8,
//                 }}
//               >
//                 {dimKeys.map((k) => {
//                   const v = dims[k];
//                   const isAct = activeKey === k;
//                   const c = DIM_COLORS[k] || "#64748b";
//                   return (
//                     <div
//                       key={k}
//                       className={`dim-card${isAct ? " active" : ""}`}
//                       onClick={() => sel(k)}
//                       style={{
//                         border: `1.5px solid ${isAct ? c : "#1e3a5f"}`,
//                         background: isAct ? `${c}15` : "#0d1f3c",
//                         boxShadow: isAct ? `0 6px 20px ${c}28` : "none",
//                       }}
//                     >
//                       <div
//                         style={{
//                           display: "flex",
//                           alignItems: "center",
//                           gap: 8,
//                           marginBottom: 4,
//                         }}
//                       >
//                         <div
//                           style={{
//                             width: 28,
//                             height: 28,
//                             borderRadius: 7,
//                             background: isAct ? c : `${c}22`,
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             fontWeight: 800,
//                             fontSize: 14,
//                             color: isAct ? "#fff" : c,
//                             flexShrink: 0,
//                             transition: "all .2s",
//                           }}
//                         >
//                           {k}
//                         </div>
//                         <div
//                           style={{
//                             fontSize: ".95rem",
//                             fontWeight: 600,
//                             color: isAct ? c : "#e2e8f0",
//                             lineHeight: 1.2,
//                           }}
//                         >
//                           {v?.value ? `${v.value} ${v.unit}` : "—"}
//                         </div>
//                       </div>
//                       <div
//                         style={{
//                           fontSize: ".68rem",
//                           color: "#64748b",
//                           lineHeight: 1.3,
//                         }}
//                       >
//                         {v?.label || `Dimension ${k}`}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// ══════════════════════════════════════════════════════════════════════════════
// Named exports for use in ViewNomenClature.jsx
// ══════════════════════════════════════════════════════════════════════════════

const Diagram2P = ({ dims, activeKey, onSelect }) => {
  const tiltDeg = parseFloat(dims?.J?.value || 25);
  const tiltRad = (tiltDeg * Math.PI) / 180;
  const cosT = Math.cos(tiltRad);
  const sinT = Math.sin(tiltRad);

  // ── Layout constants ──────────────────────────────────────────────
  const GY = 258; // ground Y
  const POLE_X = 268; // pole center X
  const POLE_TOP_Y = 190; // where pole meets structure
  const POLE_BOT_Y = GY;

  // Panel geometry along the slope
  // The 2P has two panels stacked along the tilt direction (one above the other on the slope)
  // Each panel: width along slope = pLen, thickness = pThk
  const pLen = 118; // length of one module along slope
  const pThk = 30; // thickness (height) of module
  const pGap = 8; // gap between the two modules
  const totalLen = pLen * 2 + pGap; // total along slope

  // Pivot = top-right corner of upper panel (back of the assembly, right/back side)
  // From reference: the structure pivots at the top of the back post, upper-right
  const pivX = 340;
  const pivY = 90;

  // Direction along slope: panel goes from pivot toward lower-left (front-bottom)
  // slope direction unit vector (downhill = lower-left)
  const sdx = -cosT; // x component going "down the slope" (left)
  const sdy = sinT; // y component going "down the slope" (down)

  // Perpendicular outward (away from top surface, upward-left)
  const pdx = -sinT;
  const pdy = -cosT;

  // Key panel corner points
  // Upper panel: from pivot down pLen along slope
  const p1_backTop = { x: pivX, y: pivY };
  const p1_frontTop = { x: pivX + sdx * pLen, y: pivY + sdy * pLen };
  const p1_backBot = { x: pivX - pdx * pThk, y: pivY - pdy * pThk };
  const p1_frontBot = {
    x: p1_frontTop.x - pdx * pThk,
    y: p1_frontTop.y - pdy * pThk,
  };

  // Gap region
  const gap_top_back = { x: p1_frontTop.x, y: p1_frontTop.y };
  const gap_top_front = {
    x: p1_frontTop.x + sdx * pGap,
    y: p1_frontTop.y + sdy * pGap,
  };
  const gap_bot_back = { x: p1_frontBot.x, y: p1_frontBot.y };
  const gap_bot_front = {
    x: p1_frontBot.x + sdx * pGap,
    y: p1_frontBot.y + sdy * pGap,
  };

  // Lower panel (panel 2)
  const p2_backTop = { x: gap_top_front.x, y: gap_top_front.y };
  const p2_frontTop = {
    x: p2_backTop.x + sdx * pLen,
    y: p2_backTop.y + sdy * pLen,
  };
  const p2_backBot = { x: gap_bot_front.x, y: gap_bot_front.y };
  const p2_frontBot = {
    x: p2_frontTop.x - pdx * pThk,
    y: p2_frontTop.y - pdy * pThk,
  };

  // Front-bottom tip of entire assembly
  const frontTip = p2_frontTop;

  // ── Structure members ──────────────────────────────────────────────
  // Back post: vertical from GL to pivot (right side, tall)
  const backPostX = pivX + 18;
  const backPostTopY = pivY + 10;

  // Front diagonal brace leg (from ground to front of lower panel)
  const frontLegGX = p2_frontTop.x - 5;
  const frontLegGY = GY;

  // Middle diagonal brace rails (two rails from pole top to panels)
  // Rail 1: from pole top to back of upper panel area
  const rail1_start = { x: POLE_X, y: POLE_TOP_Y };
  const rail1_end = { x: p1_backTop.x - 10, y: p1_backTop.y + 20 };
  // Rail 2: from pole top to front-middle area
  const rail2_end = { x: p2_frontTop.x + 15, y: p2_frontTop.y + 15 };

  // ── Dimension annotation positions ────────────────────────────────
  // C: full table width arrow — above and parallel to the slope, spanning both panels
  const cOff = 28; // offset above top surface
  const c_s = { x: p1_backTop.x + pdx * cOff, y: p1_backTop.y + pdy * cOff };
  const c_e = { x: p2_frontTop.x + pdx * cOff, y: p2_frontTop.y + pdy * cOff };
  const c_mid = {
    x: (c_s.x + c_e.x) / 2 + pdx * 8,
    y: (c_s.y + c_e.y) / 2 + pdy * 8,
  };

  // A: each module length — offset slightly above top surface, per panel
  const aOff = 12;
  const a1_s = { x: p1_backTop.x + pdx * aOff, y: p1_backTop.y + pdy * aOff };
  const a1_e = { x: p1_frontTop.x + pdx * aOff, y: p1_frontTop.y + pdy * aOff };
  const a1_mid = {
    x: (a1_s.x + a1_e.x) / 2 + pdx * 6,
    y: (a1_s.y + a1_e.y) / 2 + pdy * 6,
  };

  const a2_s = { x: p2_backTop.x + pdx * aOff, y: p2_backTop.y + pdy * aOff };
  const a2_e = { x: p2_frontTop.x + pdx * aOff, y: p2_frontTop.y + pdy * aOff };
  const a2_mid = {
    x: (a2_s.x + a2_e.x) / 2 + pdx * 6,
    y: (a2_s.y + a2_e.y) / 2 + pdy * 6,
  };

  // B: gap between panels — small perpendicular arrow at the gap
  const b_mid_top = {
    x: (gap_top_back.x + gap_top_front.x) / 2 + pdx * 12,
    y: (gap_top_back.y + gap_top_front.y) / 2 + pdy * 12,
  };
  const b_s = { x: gap_top_back.x + pdx * 12, y: gap_top_back.y + pdy * 12 };
  const b_e = { x: gap_top_front.x + pdx * 12, y: gap_top_front.y + pdy * 12 };

  // D: back height — right side vertical from GL to panel top
  const dX = backPostX + 30;
  const dTopY = pivY;

  // E: front ground clearance — vertical at front-left
  const eX = frontTip.x - 30;

  // F: small front foot — tiny vertical at very front bottom
  const fX = frontTip.x - 14;

  // G: callout circle at back-top corner of upper panel
  const gX = p1_backTop.x;
  const gY = p1_backTop.y;
  const gCalloutX = gX + 65;
  const gCalloutY = gY - 45;
  const gR = 24;

  // J: tilt angle arc at pole base
  const arcR = 38;

  // ── Helpers for polygon points ────────────────────────────────────
  const pts = (...arr) => arr.map((p) => `${p.x},${p.y}`).join(" ");

  // Cell lines for a panel polygon
  const cellLines = (backTop, frontTop, backBot, frontBot, nCols, nRows) => {
    const lines = [];
    for (let c = 1; c < nCols; c++) {
      const t = c / nCols;
      const tx1 = backTop.x + t * (frontTop.x - backTop.x),
        ty1 = backTop.y + t * (frontTop.y - backTop.y);
      const tx2 = backBot.x + t * (frontBot.x - backBot.x),
        ty2 = backBot.y + t * (frontBot.y - backBot.y);
      lines.push(
        <line
          key={`c${c}`}
          x1={tx1}
          y1={ty1}
          x2={tx2}
          y2={ty2}
          stroke="#1e4a8a"
          strokeWidth="0.4"
        />,
      );
    }
    for (let r = 1; r < nRows; r++) {
      const t = r / nRows;
      const tx1 = backTop.x + t * (backBot.x - backTop.x),
        ty1 = backTop.y + t * (backBot.y - backTop.y);
      const tx2 = frontTop.x + t * (frontBot.x - frontTop.x),
        ty2 = frontTop.y + t * (frontBot.y - frontTop.y);
      lines.push(
        <line
          key={`r${r}`}
          x1={tx1}
          y1={ty1}
          x2={tx2}
          y2={ty2}
          stroke="#1e4a8a"
          strokeWidth="0.4"
        />,
      );
    }
    return lines;
  };

  return (
    <svg viewBox="0 0 520 295" style={{ width: "100%", height: "100%" }}>
      <SvgDefs />
      <rect width="520" height="295" fill="url(#bgG)" rx="10" />
      <Sun cx={470} cy={38} />

      {/* ── Ground line ── */}
      <line
        x1="30"
        y1={GY}
        x2="490"
        y2={GY}
        stroke="#1e3a5f"
        strokeWidth="1.5"
        strokeDasharray="5,3"
      />
      <text x="492" y={GY + 4} fill="#64748b" fontSize="9" fontWeight="600">
        GL
      </text>
      {Array.from({ length: 12 }).map((_, i) => (
        <line
          key={i}
          x1={30 + i * 38}
          y1={GY}
          x2={20 + i * 38}
          y2={GY + 12}
          stroke="#1e3a5f"
          strokeWidth="1.2"
        />
      ))}
      {/* SOL label */}
      <text
        x="32"
        y={GY + 22}
        fill="#1e3a5f"
        fontSize="8"
        fontWeight="600"
        letterSpacing="1"
      >
        SOL
      </text>

      {/* ── Back post (vertical, right side) ── */}
      <rect
        x={backPostX - 4}
        y={backPostTopY}
        width={8}
        height={GY - backPostTopY}
        fill="#1a3a70"
        rx="2"
      />
      {/* Base plate */}
      <rect
        x={backPostX - 14}
        y={GY - 4}
        width={28}
        height={7}
        fill="#1a3a70"
        rx="1"
      />

      {/* ── Central pole ── */}
      <rect
        x={POLE_X - 5}
        y={POLE_TOP_Y}
        width={10}
        height={GY - POLE_TOP_Y}
        fill="#1a3a70"
        rx="2"
      />
      <rect
        x={POLE_X - 18}
        y={GY - 4}
        width={36}
        height={8}
        fill="#1a3a70"
        rx="1"
      />
      {/* Bolt detail at base */}
      <circle
        cx={POLE_X}
        cy={GY - 10}
        r="5"
        fill="none"
        stroke="#2563eb"
        strokeWidth="1"
      />

      {/* ── Front diagonal leg (from ground to lower-front of panel) ── */}
      <line
        x1={frontLegGX}
        y1={frontLegGY}
        x2={p2_frontBot.x + 5}
        y2={p2_frontBot.y + 5}
        stroke="#2563eb"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Front foot plate */}
      <rect
        x={frontLegGX - 10}
        y={GY - 4}
        width={20}
        height={6}
        fill="#1a3a70"
        rx="1"
      />

      {/* ── Diagonal braces from pole to panel rails ── */}
      {/* Back-upper brace */}
      <line
        x1={POLE_X}
        y1={POLE_TOP_Y + 5}
        x2={p1_backBot.x + 8}
        y2={p1_backBot.y - 5}
        stroke="#2563eb"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Front-lower brace */}
      <line
        x1={POLE_X}
        y1={POLE_TOP_Y + 5}
        x2={p2_frontBot.x + 8}
        y2={p2_frontBot.y + 5}
        stroke="#2563eb"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Short cross brace */}
      <line
        x1={POLE_X - 5}
        y1={POLE_TOP_Y + 30}
        x2={p1_frontBot.x + 5}
        y2={p1_frontBot.y}
        stroke="#2563eb"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="4,2"
        opacity="0.6"
      />

      {/* ── Rail / purlin lines along slope ── */}
      {/* Two rails running along the back surface of panels */}
      {[0.25, 0.75].map((t, i) => {
        const rx1 = p1_backBot.x + t * (p1_backTop.x - p1_backBot.x);
        const ry1 = p1_backBot.y + t * (p1_backTop.y - p1_backBot.y);
        const rx2 = p2_frontBot.x + t * (p2_frontTop.x - p2_frontBot.x);
        // actually rails run along the slope direction
        const r_s = {
          x: p1_backBot.x - pdx * t * pThk,
          y: p1_backBot.y - pdy * t * pThk,
        };
        const r_e = {
          x: p2_frontBot.x - pdx * t * pThk,
          y: p2_frontBot.y - pdy * t * pThk,
        };
        return (
          <line
            key={i}
            x1={r_s.x}
            y1={r_s.y}
            x2={r_e.x}
            y2={r_e.y}
            stroke="#1a3a70"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.7"
          />
        );
      })}

      {/* ── Panel 1 (upper panel) ── */}
      <polygon
        points={pts(p1_backTop, p1_frontTop, p1_frontBot, p1_backBot)}
        fill="url(#panelG)"
        stroke="#2563eb"
        strokeWidth="0.8"
      />
      {cellLines(p1_backTop, p1_frontTop, p1_backBot, p1_frontBot, 4, 2)}

      {/* ── Gap strip between panels ── */}
      <polygon
        points={pts(gap_top_back, gap_top_front, gap_bot_front, gap_bot_back)}
        fill="#050e1c"
        stroke="#1e3a5f"
        strokeWidth="0.5"
      />

      {/* ── Panel 2 (lower panel) ── */}
      <polygon
        points={pts(p2_backTop, p2_frontTop, p2_frontBot, p2_backBot)}
        fill="url(#panelG)"
        stroke="#2563eb"
        strokeWidth="0.8"
      />
      {cellLines(p2_backTop, p2_frontTop, p2_backBot, p2_frontBot, 4, 2)}

      {/* ── C: Full table diagonal — arrow above both panels ── */}
      <g onClick={() => onSelect("C")} style={cur}>
        {/* Extension lines from panel corners to arrow */}
        <line
          x1={p1_backTop.x}
          y1={p1_backTop.y}
          x2={c_s.x}
          y2={c_s.y}
          stroke={col("C", activeKey)}
          strokeWidth="0.6"
          strokeDasharray="3,2"
          opacity="0.5"
        />
        <line
          x1={p2_frontTop.x}
          y1={p2_frontTop.y}
          x2={c_e.x}
          y2={c_e.y}
          stroke={col("C", activeKey)}
          strokeWidth="0.6"
          strokeDasharray="3,2"
          opacity="0.5"
        />
        <line
          x1={c_s.x}
          y1={c_s.y}
          x2={c_e.x}
          y2={c_e.y}
          stroke={col("C", activeKey)}
          strokeWidth={lw("C", activeKey)}
          markerEnd={`url(#arrE_C)`}
          markerStart={`url(#arrS_C)`}
        />
        <text
          x={c_mid.x}
          y={c_mid.y}
          textAnchor="middle"
          fontSize={fs("C", activeKey)}
          fontWeight={fw("C", activeKey)}
          fill={fc("C", activeKey)}
        >
          C
        </text>
      </g>

      {/* ── A: Panel 1 module length ── */}
      <g onClick={() => onSelect("A")} style={cur}>
        <line
          x1={a1_s.x}
          y1={a1_s.y}
          x2={a1_e.x}
          y2={a1_e.y}
          stroke={col("A", activeKey)}
          strokeWidth={lw("A", activeKey)}
          markerEnd={`url(#arrE_A)`}
          markerStart={`url(#arrS_A)`}
        />
        <text
          x={a1_mid.x}
          y={a1_mid.y}
          textAnchor="middle"
          fontSize={fs("A", activeKey)}
          fontWeight={fw("A", activeKey)}
          fill={fc("A", activeKey)}
        >
          A
        </text>
      </g>

      {/* ── A: Panel 2 module length ── */}
      <g onClick={() => onSelect("A")} style={cur}>
        <line
          x1={a2_s.x}
          y1={a2_s.y}
          x2={a2_e.x}
          y2={a2_e.y}
          stroke={col("A", activeKey)}
          strokeWidth={lw("A", activeKey)}
          markerEnd={`url(#arrE_A)`}
          markerStart={`url(#arrS_A)`}
        />
        <text
          x={a2_mid.x}
          y={a2_mid.y}
          textAnchor="middle"
          fontSize={fs("A", activeKey)}
          fontWeight={fw("A", activeKey)}
          fill={fc("A", activeKey)}
        >
          A
        </text>
      </g>

      {/* ── B: Gap between panels ── */}
      <g onClick={() => onSelect("B")} style={cur}>
        <line
          x1={b_s.x}
          y1={b_s.y}
          x2={b_e.x}
          y2={b_e.y}
          stroke={col("B", activeKey)}
          strokeWidth={lw("B", activeKey)}
          markerEnd={`url(#arrE_B)`}
          markerStart={`url(#arrS_B)`}
        />
        <text
          x={b_mid_top.x + pdx * 8}
          y={b_mid_top.y + pdy * 8}
          textAnchor="middle"
          fontSize={fs("B", activeKey)}
          fontWeight={fw("B", activeKey)}
          fill={fc("B", activeKey)}
        >
          B
        </text>
      </g>

      {/* ── D: Back height — right side vertical ── */}
      <g onClick={() => onSelect("D")} style={cur}>
        <line
          x1={dX}
          y1={dTopY}
          x2={dX}
          y2={GY}
          stroke={col("D", activeKey)}
          strokeWidth={lw("D", activeKey)}
          markerEnd={`url(#arrE_D)`}
          markerStart={`url(#arrS_D)`}
        />
        {/* tick to top */}
        <line
          x1={p1_backTop.x}
          y1={p1_backTop.y}
          x2={dX + 2}
          y2={dTopY}
          stroke={col("D", activeKey)}
          strokeWidth="0.6"
          strokeDasharray="3,2"
          opacity="0.5"
        />
        <line
          x1={backPostX + 4}
          y1={GY}
          x2={dX + 2}
          y2={GY}
          stroke={col("D", activeKey)}
          strokeWidth="0.6"
          strokeDasharray="3,2"
          opacity="0.5"
        />
        <text
          x={dX + 8}
          y={(dTopY + GY) / 2 + 4}
          fontSize={fs("D", activeKey)}
          fontWeight={fw("D", activeKey)}
          fill={fc("D", activeKey)}
        >
          D
        </text>
      </g>

      {/* ── E: Front ground clearance — vertical at front ── */}
      <g onClick={() => onSelect("E")} style={cur}>
        <line
          x1={eX}
          y1={p2_frontTop.y}
          x2={eX}
          y2={GY}
          stroke={col("E", activeKey)}
          strokeWidth={lw("E", activeKey)}
          markerEnd={`url(#arrE_E)`}
          markerStart={`url(#arrS_E)`}
        />
        <line
          x1={p2_frontTop.x}
          y1={p2_frontTop.y}
          x2={eX + 2}
          y2={p2_frontTop.y}
          stroke={col("E", activeKey)}
          strokeWidth="0.6"
          strokeDasharray="3,2"
          opacity="0.5"
        />
        <text
          x={eX - 10}
          y={(p2_frontTop.y + GY) / 2 + 4}
          fontSize={fs("E", activeKey)}
          fontWeight={fw("E", activeKey)}
          fill={fc("E", activeKey)}
        >
          E
        </text>
      </g>

      {/* ── F: Small front foot height (below E, smaller vertical) ── */}
      {/* F is the small distance from GL to the front foot attachment */}
      <g onClick={() => onSelect("F")} style={cur}>
        <line
          x1={fX}
          y1={p2_frontBot.y}
          x2={fX}
          y2={GY}
          stroke={col("F", activeKey)}
          strokeWidth={lw("F", activeKey)}
          markerEnd={`url(#arrE_F)`}
          markerStart={`url(#arrS_F)`}
        />
        <text
          x={fX - 10}
          y={(p2_frontBot.y + GY) / 2 + 4}
          fontSize={fs("F", activeKey)}
          fontWeight={fw("F", activeKey)}
          fill={fc("F", activeKey)}
        >
          F
        </text>
      </g>

      {/* ── G: Frame cross-section callout (top-right corner of upper panel) ── */}
      <g onClick={() => onSelect("G")} style={cur}>
        {/* Small circle at the corner */}
        <circle
          cx={gX}
          cy={gY}
          r="6"
          fill="none"
          stroke={col("G", activeKey)}
          strokeWidth={lw("G", activeKey)}
        />
        {/* Leader line to callout */}
        <line
          x1={gX + 4}
          y1={gY - 4}
          x2={gCalloutX - gR}
          y2={gCalloutY + gR}
          stroke={col("G", activeKey)}
          strokeWidth="0.8"
        />
        {/* Callout circle */}
        <circle
          cx={gCalloutX}
          cy={gCalloutY}
          r={gR}
          fill="#0d1f3c"
          stroke={col("G", activeKey)}
          strokeWidth={lw("G", activeKey)}
        />
        {/* Frame cross-section detail inside callout */}
        <rect
          x={gCalloutX - 16}
          y={gCalloutY - 8}
          width={32}
          height={7}
          fill="none"
          stroke={col("G", activeKey)}
          strokeWidth="1.1"
        />
        <rect
          x={gCalloutX - 16}
          y={gCalloutY - 2}
          width={7}
          height={11}
          fill="none"
          stroke={col("G", activeKey)}
          strokeWidth="1.1"
        />
        {/* G label */}
        <text
          x={gCalloutX + gR + 5}
          y={gCalloutY + 4}
          fontSize={fs("G", activeKey)}
          fontWeight={fw("G", activeKey)}
          fill={fc("G", activeKey)}
        >
          G
        </text>
      </g>

      {/* ── J: Tilt angle arc at pole base ── */}
      <g onClick={() => onSelect("J")} style={cur}>
        <path
          d={`M ${POLE_X} ${GY} A ${arcR} ${arcR} 0 0 1 ${POLE_X + arcR * cosT} ${GY - arcR * sinT}`}
          fill="none"
          stroke={col("J", activeKey)}
          strokeWidth={lw("J", activeKey)}
          strokeDasharray="3,2"
        />
        <text
          x={POLE_X + arcR * 0.5 + 8}
          y={GY - arcR * 0.3}
          fontSize={fs("J", activeKey)}
          fontWeight={fw("J", activeKey)}
          fill={fc("J", activeKey)}
        >
          J={tiltDeg}°
        </text>
      </g>

      <text
        x="16"
        y="289"
        fill="#1e3a5f"
        fontSize="8"
        fontWeight="700"
        letterSpacing="2"
      >
        TAYPRO® 2P FIXED TILT — GROUND MOUNT
      </text>
    </svg>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// Top view — 2 tables, each with panel grid
// ══════════════════════════════════════════════════════════════════════════════
const TableLayout2P = ({ activeKey, onSelect }) => {
  const col2 = (k) => (activeKey === k ? DIM_COLORS[k] : "#334155");
  const fc2 = (k) => (activeKey === k ? DIM_COLORS[k] : "#64748b");
  const fw2 = (k) => (activeKey === k ? 700 : 500);
  // 2P top view: panels portrait (tall), 2 rows × 3 cols per table
  const pW = 38,
    pH = 56,
    gx = 4,
    gy = 4;
  const cols = 3,
    rows = 2;
  const t1x = 18,
    t1y = 18;
  const t2x = 192,
    t2y = 18;
  const tW = cols * (pW + gx) - gx,
    tH = rows * (pH + gy) - gy;

  return (
    <svg viewBox="0 0 360 175" style={{ width: "100%", height: "100%" }}>
      <rect width="360" height="175" fill="#060f1e" rx="8" />
      <text
        x={t1x}
        y="13"
        fill="#475569"
        fontSize="8"
        fontWeight="600"
        letterSpacing="1"
      >
        TABLE-NO-1
      </text>
      {/* Table 1 panels */}
      {Array.from({ length: rows }).map((_, ri) =>
        Array.from({ length: cols }).map((_, ci) => (
          <rect
            key={`t1${ri}${ci}`}
            x={t1x + ci * (pW + gx)}
            y={t1y + ri * (pH + gy)}
            width={pW}
            height={pH}
            fill="#0d1f3c"
            stroke="#1e4080"
            strokeWidth="1.2"
            rx="2"
          />
        )),
      )}
      {/* B: row height (left side) */}
      <g onClick={() => onSelect("B")} style={cur}>
        <line
          x1={t1x - 6}
          y1={t1y}
          x2={t1x - 6}
          y2={t1y + pH}
          stroke={col2("B")}
          strokeWidth="1.2"
          markerEnd={`url(#arrE_B)`}
          markerStart={`url(#arrS_B)`}
        />
        <text
          x={t1x - 15}
          y={t1y + pH / 2 + 3}
          textAnchor="middle"
          fill={fc2("B")}
          fontSize="9"
          fontWeight={fw2("B")}
        >
          B
        </text>
      </g>
      {/* H: inter-table gap */}
      <g onClick={() => onSelect("H")} style={cur}>
        <line
          x1={t1x + tW + 4}
          y1={t1y + tH + 10}
          x2={t2x - 4}
          y2={t1y + tH + 10}
          stroke={col2("H")}
          strokeWidth="1.2"
          strokeDasharray="3,2"
          markerEnd={`url(#arrE_H)`}
          markerStart={`url(#arrS_H)`}
        />
        <text
          x={(t1x + tW + t2x) / 2}
          y={t1y + tH + 22}
          textAnchor="middle"
          fill={fc2("H")}
          fontSize="9"
          fontWeight={fw2("H")}
        >
          H
        </text>
      </g>
      <text
        x={t2x}
        y="13"
        fill="#475569"
        fontSize="8"
        fontWeight="600"
        letterSpacing="1"
      >
        TABLE-NO-2
      </text>
      {/* Table 2 panels */}
      {Array.from({ length: rows }).map((_, ri) =>
        Array.from({ length: cols }).map((_, ci) => (
          <rect
            key={`t2${ri}${ci}`}
            x={t2x + ci * (pW + gx)}
            y={t1y + ri * (pH + gy)}
            width={pW}
            height={pH}
            fill="#0d1f3c"
            stroke="#1e4080"
            strokeWidth="1.2"
            rx="2"
          />
        )),
      )}
      {/* I: inter-module gap between tables */}
      <g onClick={() => onSelect("I")} style={cur}>
        <line
          x1={t2x + tW + 4}
          y1={t1y}
          x2={t2x + tW + 14}
          y2={t1y}
          stroke={col2("I")}
          strokeWidth="1.2"
        />
        <text
          x={t2x + tW + 16}
          y={t1y + 4}
          fill={fc2("I")}
          fontSize="9"
          fontWeight={fw2("I")}
        >
          I
        </text>
      </g>
    </svg>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// Full demo
// ══════════════════════════════════════════════════════════════════════════════
const DEMO_DIMS_2P = {
  A: { label: "Solar Module Dimension", value: "1722", unit: "mm" },
  B: { label: "Solar Module Vertical Gap", value: "20", unit: "mm" },
  C: { label: "Table Width (Full Diagonal)", value: "3464", unit: "mm" },
  D: { label: "Back Ground Clearance", value: "2083", unit: "mm" },
  E: { label: "Front Ground Clearance", value: "520", unit: "mm" },
  F: { label: "Front Foot Height", value: "250", unit: "mm" },
  G: { label: "Frame Cross Section", value: "35", unit: "mm" },
  H: { label: "Inter Table Gap", value: "20", unit: "mm" },
  I: { label: "Module Gap Horizontal", value: "10", unit: "mm" },
  J: { label: "Tilt Angle", value: "25", unit: "°" },
};
export default function MMSDiagramDemo() {
  const [activeKey, setActiveKey] = useState(null);
  const dims = DEMO_DIMS_2P;
  const dimKeys = Object.keys(dims);
  const sel = (k) => setActiveKey((p) => (p === k ? null : k));
  const act = activeKey ? dims[activeKey] : null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg,#060f1e 0%,#0a1628 100%)",
        padding: "24px 16px",
        fontFamily: "'DM Sans', system-ui, sans-serif",
        color: "#e2e8f0",
      }}
    >
      <style>{`
        * { box-sizing: border-box; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .sdot { width:8px;height:8px;border-radius:50%;background:#10b981;
                box-shadow:0 0 8px #10b981;animation:pulse 2s infinite;display:inline-block; }
        .dim-card { background:#0d1f3c;border:1.5px solid #1e3a5f;border-radius:10px;
                    padding:10px 12px;cursor:pointer;transition:all .2s; }
        .dim-card:hover { border-color:#2563eb; }
        .dim-card.active { transform:translateY(-2px); }
        ::-webkit-scrollbar{width:3px} ::-webkit-scrollbar-thumb{background:#1e3a5f;border-radius:2px}
      `}</style>

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 13,
            background: "linear-gradient(135deg,#1d4ed8,#f59e0b)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
          }}
        >
          ☀️
        </div>
        <div>
          <div
            style={{
              fontSize: "1.5rem",
              fontWeight: 800,
              letterSpacing: ".04em",
              lineHeight: 1,
            }}
          >
            MMS Nomenclature Viewer
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginTop: 4,
            }}
          >
            <div className="sdot" />
            <span style={{ color: "#64748b", fontSize: ".72rem" }}>
              2P Fixed Tilt — Ground Mount Structure
            </span>
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 340px",
          gap: 16,
          alignItems: "start",
        }}
      >
        {/* Left — diagram */}
        <div
          style={{
            background: "#0a1628",
            border: "1px solid #1e3a5f",
            borderRadius: 16,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg,#0d1f3c,#162d50)",
              borderBottom: "1px solid #1e3a5f",
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontWeight: 600,
                fontSize: ".88rem",
                color: "#64748b",
                letterSpacing: ".08em",
                textTransform: "uppercase",
              }}
            >
              2P Fixed Tilt — Side View
            </span>
            {activeKey && (
              <span
                style={{
                  background: DIM_COLORS[activeKey],
                  color: "#fff",
                  fontSize: ".78rem",
                  fontWeight: 700,
                  borderRadius: 6,
                  padding: "3px 10px",
                }}
              >
                {activeKey} — {act?.label}
              </span>
            )}
          </div>
          <div style={{ padding: 16 }}>
            <div style={{ height: 310 }}>
              <Diagram2P dims={dims} activeKey={activeKey} onSelect={sel} />
            </div>
            <hr style={{ borderColor: "#1e3a5f", margin: "12px 0" }} />
            <div
              style={{
                fontSize: ".7rem",
                letterSpacing: ".12em",
                textTransform: "uppercase",
                fontWeight: 600,
                marginBottom: 10,
                color: "#475569",
              }}
            >
              Top View — Panel Module Layout
            </div>
            <div style={{ height: 155 }}>
              <TableLayout2P activeKey={activeKey} onSelect={sel} />
            </div>
            <p
              style={{
                fontSize: ".68rem",
                textAlign: "center",
                marginTop: 8,
                color: "#475569",
              }}
            >
              Click any label on the diagram to highlight its specification →
            </p>
          </div>
        </div>

        {/* Right — specs */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {activeKey && act && (
            <div
              style={{
                background: "linear-gradient(135deg,#0d2d5e,#0f3460)",
                border: `1.5px solid ${DIM_COLORS[activeKey]}`,
                borderRadius: 12,
                padding: "14px 16px",
                animation: "fadeIn .3s ease-out",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: DIM_COLORS[activeKey],
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 900,
                    fontSize: 22,
                    color: "#fff",
                  }}
                >
                  {activeKey}
                </div>
                <div>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: ".85rem",
                      color: "#94a3b8",
                      lineHeight: 1.2,
                    }}
                  >
                    {act.label}
                  </div>
                  <div
                    style={{
                      fontSize: "1.9rem",
                      fontWeight: 800,
                      color: DIM_COLORS[activeKey],
                      lineHeight: 1.1,
                    }}
                  >
                    {act.value}{" "}
                    <span
                      style={{
                        fontSize: "1rem",
                        fontWeight: 500,
                        color: "#94a3b8",
                      }}
                    >
                      {act.unit}
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ fontSize: ".65rem", color: "#475569" }}>
                Dimension {activeKey} ·{" "}
                {act.unit === "°"
                  ? "Angular measurement"
                  : "Linear measurement"}
              </div>
            </div>
          )}

          <div
            style={{
              background: "#0a1628",
              border: "1px solid #1e3a5f",
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg,#0d1f3c,#162d50)",
                borderBottom: "1px solid #1e3a5f",
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{
                  fontWeight: 600,
                  fontSize: ".88rem",
                  color: "#64748b",
                  letterSpacing: ".08em",
                  textTransform: "uppercase",
                }}
              >
                Dimensions A–J
              </span>
              {activeKey && (
                <button
                  onClick={() => setActiveKey(null)}
                  style={{
                    background: "#0d1f3c",
                    border: "1px solid #1e3a5f",
                    borderRadius: 6,
                    color: "#94a3b8",
                    fontSize: ".7rem",
                    padding: "2px 8px",
                    cursor: "pointer",
                  }}
                >
                  Clear
                </button>
              )}
            </div>
            <div
              style={{
                padding: "14px 16px",
                maxHeight: 500,
                overflowY: "auto",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 8,
                }}
              >
                {dimKeys.map((k) => {
                  const v = dims[k];
                  const isAct = activeKey === k;
                  const c = DIM_COLORS[k] || "#64748b";
                  return (
                    <div
                      key={k}
                      className={`dim-card${isAct ? " active" : ""}`}
                      onClick={() => sel(k)}
                      style={{
                        border: `1.5px solid ${isAct ? c : "#1e3a5f"}`,
                        background: isAct ? `${c}15` : "#0d1f3c",
                        boxShadow: isAct ? `0 6px 20px ${c}28` : "none",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          marginBottom: 4,
                        }}
                      >
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 7,
                            background: isAct ? c : `${c}22`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 800,
                            fontSize: 14,
                            color: isAct ? "#fff" : c,
                            flexShrink: 0,
                            transition: "all .2s",
                          }}
                        >
                          {k}
                        </div>
                        <div
                          style={{
                            fontSize: ".95rem",
                            fontWeight: 600,
                            color: isAct ? c : "#e2e8f0",
                            lineHeight: 1.2,
                          }}
                        >
                          {v?.value ? `${v.value} ${v.unit}` : "—"}
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: ".68rem",
                          color: "#64748b",
                          lineHeight: 1.3,
                        }}
                      >
                        {v?.label || `Dimension ${k}`}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export { MountingDiagram, MountingTopView, MMS_LABELS, DIM_COLORS };
