import { useState } from "react";

// ─── Color palette per dimension letter ───────────────────────────────────────
const DIM_COLORS = {
  A: "#f59e0b", B: "#10b981", C: "#3b82f6", D: "#8b5cf6",
  E: "#ef4444", F: "#06b6d4", G: "#f97316", H: "#ec4899",
  I: "#84cc16", J: "#e11d48", K: "#a78bfa",
};

const col = (k, activeKey) => (activeKey === k ? DIM_COLORS[k] : "#334155");
const lw  = (k, activeKey) => (activeKey === k ? 2.2 : 1);
const fc  = (k, activeKey) => (activeKey === k ? DIM_COLORS[k] : "#94a3b8");
const fw  = (k, activeKey) => (activeKey === k ? 700 : 500);
const fs  = (k, activeKey) => (activeKey === k ? 13 : 10);
const cur = { cursor: "pointer" };

// ─── Shared SVG defs (gradients, markers, filters) ────────────────────────────
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
    <linearGradient id="roofG" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#1e293b" />
      <stop offset="100%" stopColor="#0f172a" />
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="2.5" result="cb" />
      <feMerge><feMergeNode in="cb" /><feMergeNode in="SourceGraphic" /></feMerge>
    </filter>
    {Object.entries(DIM_COLORS).map(([k, c]) => (
      <marker key={k} id={`arr${k}`} markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto">
        <path d="M0,0 L5,2.5 L0,5 Z" fill={c} />
      </marker>
    ))}
    <marker id="arrGray" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto">
      <path d="M0,0 L5,2.5 L0,5 Z" fill="#475569" />
    </marker>
  </defs>
);

// ─── Arrow annotation helper ──────────────────────────────────────────────────
const Arrow = ({ x1, y1, x2, y2, k, activeKey, label, lx, ly, onSelect }) => (
  <g onClick={() => onSelect(k)} style={cur}>
    <line x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={col(k, activeKey)} strokeWidth={lw(k, activeKey)}
      markerEnd={`url(#arr${k})`} markerStart={`url(#arr${k})`} />
    <text x={lx} y={ly} textAnchor="middle" fontSize={fs(k, activeKey)}
      fontWeight={fw(k, activeKey)} fill={fc(k, activeKey)}>{label || k}</text>
  </g>
);

// ─── Sun decoration ───────────────────────────────────────────────────────────
const Sun = ({ cx = 470, cy = 42 }) => (
  <>
    <circle cx={cx} cy={cy} r="18" fill="#fbbf24" style={{ filter: "url(#glow)", opacity: 0.85 }} />
    {[0,45,90,135,180,225,270,315].map(a => (
      <line key={a}
        x1={cx + 22*Math.cos(a*Math.PI/180)} y1={cy + 22*Math.sin(a*Math.PI/180)}
        x2={cx + 29*Math.cos(a*Math.PI/180)} y2={cy + 29*Math.sin(a*Math.PI/180)}
        stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
    ))}
    {[0,1,2,3].map(i => (
      <line key={i} x1={cx-40-i*18} y1={cy+28+i*12} x2={cx-220-i*14} y2={cy+130+i*6}
        stroke="#fbbf24" strokeWidth="0.7" strokeDasharray="4,3" opacity="0.18" />
    ))}
  </>
);

// ─── Ground line ──────────────────────────────────────────────────────────────
const Ground = ({ y = 240, x1 = 20, x2 = 480 }) => (
  <>
    <line x1={x1} y1={y} x2={x2} y2={y} stroke="#1e3a5f" strokeWidth="2" strokeDasharray="5,3" />
    <text x={x2+4} y={y+4} fill="#475569" fontSize="9" fontWeight="600">GL</text>
    {Array.from({length:12}).map((_,i) => (
      <line key={i} x1={x1+i*38} y1={y} x2={x1-10+i*38} y2={y+14} stroke="#1e3a5f" strokeWidth="1.5" />
    ))}
  </>
);

// ─── Roof line (for rooftop types) ────────────────────────────────────────────
const Roof = ({ y = 180, x1 = 20, x2 = 490 }) => (
  <>
    <rect x={x1} y={y} width={x2-x1} height="8" fill="url(#roofG)" rx="2" />
    <rect x={x1} y={y+8} width={x2-x1} height="4" fill="#0d1f3c" rx="1" />
    <text x={x2+4} y={y+8} fill="#475569" fontSize="9" fontWeight="600">ROOF</text>
  </>
);

// ─── Panel grid helper ────────────────────────────────────────────────────────
const PanelGrid = ({ x, y, w, h, cols = 6, rows = 2 }) => {
  const cw = (w-4) / cols, rh = (h-4) / rows;
  return (
    <>
      <rect x={x} y={y} width={w} height={h} fill="url(#panelG)" rx="3" stroke="#2563eb" strokeWidth="0.8" />
      {Array.from({length:cols}).map((_,ci) =>
        Array.from({length:rows}).map((_,ri) => (
          <rect key={`${ci}${ri}`} x={x+2+ci*cw} y={y+2+ri*rh} width={cw-1} height={rh-1}
            fill="none" stroke="#1e4a8a" strokeWidth="0.5" rx="1" />
        ))
      )}
    </>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// 2P — Ground-mount fixed tilt (pole + braces, existing design enhanced)
// ══════════════════════════════════════════════════════════════════════════════
const Diagram2P = ({ dims, activeKey, onSelect }) => {
  const tilt = parseFloat(dims?.J?.value || 25);
  return (
    <svg viewBox="0 0 520 290" style={{width:"100%",height:"100%"}}>
      <SvgDefs />
      <rect width="520" height="290" fill="url(#bgG)" rx="10" />
      <Sun />
      <Ground y={240} />
      {/* Pole */}
      <rect x="192" y="175" width="16" height="65" fill="#1a3a70" rx="2" />
      <rect x="180" y="237" width="40" height="8" fill="#1a3a70" rx="2" />
      {/* Braces */}
      <line x1="200" y1="205" x2="135" y2="240" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
      <line x1="200" y1="205" x2="272" y2="240" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
      {/* Panel (tilted) */}
      <g transform={`rotate(-${tilt}, 200, 175)`}>
        <PanelGrid x={76} y={150} w={248} h={58} cols={3} rows={2} />
        {/* A */}
        <g onClick={() => onSelect("A")} style={cur}>
          <line x1="80" y1="162" x2="320" y2="162" stroke={col("A",activeKey)} strokeWidth={lw("A",activeKey)} markerEnd="url(#arrA)" markerStart="url(#arrA)" />
          <text x="198" y="158" textAnchor="middle" fontSize={fs("A",activeKey)} fontWeight={fw("A",activeKey)} fill={fc("A",activeKey)}>A</text>
        </g>
        {/* B */}
        <g onClick={() => onSelect("B")} style={cur}>
          <line x1="68" y1="150" x2="68" y2="208" stroke={col("B",activeKey)} strokeWidth={lw("B",activeKey)} markerEnd="url(#arrB)" markerStart="url(#arrB)" />
          <text x="58" y="185" fontSize={fs("B",activeKey)} fontWeight={fw("B",activeKey)} fill={fc("B",activeKey)}>B</text>
        </g>
        {/* G */}
        <g onClick={() => onSelect("G")} style={cur}>
          <circle cx="76" cy="150" r="5" fill="none" stroke={col("G",activeKey)} strokeWidth={lw("G",activeKey)} />
          <line x1="63" y1="137" x2="76" y2="150" stroke={col("G",activeKey)} strokeWidth={lw("G",activeKey)} />
          <text x="50" y="133" fontSize={fs("G",activeKey)} fontWeight={fw("G",activeKey)} fill={fc("G",activeKey)}>G</text>
        </g>
      </g>
      {/* C */}
      <g onClick={() => onSelect("C")} style={cur}>
        <line x1="78" y1="126" x2="326" y2="126" stroke={col("C",activeKey)} strokeWidth={lw("C",activeKey)} markerEnd="url(#arrC)" markerStart="url(#arrC)" />
        <text x="200" y="120" textAnchor="middle" fontSize={fs("C",activeKey)} fontWeight={fw("C",activeKey)} fill={fc("C",activeKey)}>C</text>
      </g>
      {/* D */}
      <g onClick={() => onSelect("D")} style={cur}>
        <line x1="338" y1="140" x2="338" y2="238" stroke={col("D",activeKey)} strokeWidth={lw("D",activeKey)} markerEnd="url(#arrD)" markerStart="url(#arrD)" />
        <text x="346" y="196" fontSize={fs("D",activeKey)} fontWeight={fw("D",activeKey)} fill={fc("D",activeKey)}>D</text>
      </g>
      {/* E */}
      <g onClick={() => onSelect("E")} style={cur}>
        <line x1="62" y1="218" x2="62" y2="238" stroke={col("E",activeKey)} strokeWidth={lw("E",activeKey)} markerEnd="url(#arrE)" markerStart="url(#arrE)" />
        <text x="50" y="232" fontSize={fs("E",activeKey)} fontWeight={fw("E",activeKey)} fill={fc("E",activeKey)}>E</text>
      </g>
      {/* F */}
      <g onClick={() => onSelect("F")} style={cur}>
        <line x1="42" y1="196" x2="42" y2="238" stroke={col("F",activeKey)} strokeWidth={lw("F",activeKey)} markerEnd="url(#arrF)" markerStart="url(#arrF)" />
        <text x="30" y="222" fontSize={fs("F",activeKey)} fontWeight={fw("F",activeKey)} fill={fc("F",activeKey)}>F</text>
      </g>
      {/* J */}
      <g onClick={() => onSelect("J")} style={cur}>
        <path d={`M 200 240 A 36 36 0 0 1 ${200+36*Math.cos((90-tilt)*Math.PI/180)} ${240-36*Math.sin((90-tilt)*Math.PI/180)}`}
          fill="none" stroke={col("J",activeKey)} strokeWidth={lw("J",activeKey)} strokeDasharray="3,2" />
        <text x="220" y="230" fontSize={fs("J",activeKey)} fontWeight={fw("J",activeKey)} fill={fc("J",activeKey)}>J={tilt}°</text>
      </g>
      <text x="16" y="278" fill="#1e3a5f" fontSize="8" fontWeight="700" letterSpacing="2">TAYPRO® 2P FIXED TILT</text>
    </svg>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// 1P-1L — Rooftop single panel portrait/landscape (flat/low-tilt on roof)
// ══════════════════════════════════════════════════════════════════════════════
const Diagram1P = ({ dims, activeKey, onSelect }) => {
  const tilt = parseFloat(dims?.J?.value || 10);
  return (
    <svg viewBox="0 0 520 300" style={{width:"100%",height:"100%"}}>
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
          <line x1="64" y1="168" x2="458" y2="168" stroke={col("A",activeKey)} strokeWidth={lw("A",activeKey)} markerEnd="url(#arrA)" markerStart="url(#arrA)" />
          <text x="258" y="163" textAnchor="middle" fontSize={fs("A",activeKey)} fontWeight={fw("A",activeKey)} fill={fc("A",activeKey)}>A</text>
        </g>
        {/* B — vertical gap (module thickness zone) */}
        <g onClick={() => onSelect("B")} style={cur}>
          <line x1="52" y1="175" x2="52" y2="215" stroke={col("B",activeKey)} strokeWidth={lw("B",activeKey)} markerEnd="url(#arrB)" markerStart="url(#arrB)" />
          <text x="40" y="200" fontSize={fs("B",activeKey)} fontWeight={fw("B",activeKey)} fill={fc("B",activeKey)}>B</text>
        </g>
        {/* K — frame cross section */}
        <g onClick={() => onSelect("K")} style={cur}>
          <circle cx="60" cy="175" r="5" fill="none" stroke={col("K",activeKey)} strokeWidth={lw("K",activeKey)} />
          <line x1="47" y1="162" x2="60" y2="175" stroke={col("K",activeKey)} strokeWidth={lw("K",activeKey)} />
          <text x="34" y="158" fontSize={fs("K",activeKey)} fontWeight={fw("K",activeKey)} fill={fc("K",activeKey)}>K</text>
        </g>
      </g>
      {/* C — table width (horizontal) */}
      <g onClick={() => onSelect("C")} style={cur}>
        <line x1="60" y1="148" x2="460" y2="148" stroke={col("C",activeKey)} strokeWidth={lw("C",activeKey)} markerEnd="url(#arrC)" markerStart="url(#arrC)" />
        <text x="258" y="142" textAnchor="middle" fontSize={fs("C",activeKey)} fontWeight={fw("C",activeKey)} fill={fc("C",activeKey)}>C</text>
      </g>
      {/* D — vertical ground clearance */}
      <g onClick={() => onSelect("D")} style={cur}>
        <line x1="490" y1="175" x2="490" y2="210" stroke={col("D",activeKey)} strokeWidth={lw("D",activeKey)} markerEnd="url(#arrD)" markerStart="url(#arrD)" />
        <text x="498" y="197" fontSize={fs("D",activeKey)} fontWeight={fw("D",activeKey)} fill={fc("D",activeKey)}>D</text>
      </g>
      {/* E — horizontal clearance */}
      <g onClick={() => onSelect("E")} style={cur}>
        <line x1="60" y1="225" x2="100" y2="225" stroke={col("E",activeKey)} strokeWidth={lw("E",activeKey)} markerEnd="url(#arrE)" markerStart="url(#arrE)" />
        <text x="80" y="238" textAnchor="middle" fontSize={fs("E",activeKey)} fontWeight={fw("E",activeKey)} fill={fc("E",activeKey)}>E</text>
      </g>
      {/* F — row to row gap (shown as gap between two mini rows) */}
      <g onClick={() => onSelect("F")} style={cur}>
        <line x1="30" y1="185" x2="30" y2="218" stroke={col("F",activeKey)} strokeWidth={lw("F",activeKey)} markerEnd="url(#arrF)" markerStart="url(#arrF)" />
        <text x="18" y="206" fontSize={fs("F",activeKey)} fontWeight={fw("F",activeKey)} fill={fc("F",activeKey)}>F</text>
      </g>
      {/* G — horizontal module gap */}
      <g onClick={() => onSelect("G")} style={cur}>
        <line x1="455" y1="188" x2="475" y2="188" stroke={col("G",activeKey)} strokeWidth={lw("G",activeKey)} markerEnd="url(#arrG)" markerStart="url(#arrG)" />
        <text x="465" y="182" textAnchor="middle" fontSize={fs("G",activeKey)} fontWeight={fw("G",activeKey)} fill={fc("G",activeKey)}>G</text>
      </g>
      {/* H — inter table gap */}
      <g onClick={() => onSelect("H")} style={cur}>
        <line x1="60" y1="258" x2="120" y2="258" stroke={col("H",activeKey)} strokeWidth={lw("H",activeKey)} markerEnd="url(#arrH)" markerStart="url(#arrH)" />
        <text x="90" y="270" textAnchor="middle" fontSize={fs("H",activeKey)} fontWeight={fw("H",activeKey)} fill={fc("H",activeKey)}>H</text>
      </g>
      {/* I — frame cross section */}
      <g onClick={() => onSelect("I")} style={cur}>
        <rect x="460" y="172" width="12" height="12" fill="none" stroke={col("I",activeKey)} strokeWidth={lw("I",activeKey)} />
        <text x="476" y="182" fontSize={fs("I",activeKey)} fontWeight={fw("I",activeKey)} fill={fc("I",activeKey)}>I</text>
      </g>
      {/* J tilt arc */}
      <g onClick={() => onSelect("J")} style={cur}>
        <path d={`M 260 210 A 30 30 0 0 1 ${260+30*Math.cos((90-tilt)*Math.PI/180)} ${210-30*Math.sin((90-tilt)*Math.PI/180)}`}
          fill="none" stroke={col("J",activeKey)} strokeWidth={lw("J",activeKey)} strokeDasharray="3,2" />
        <text x="280" y="206" fontSize={fs("J",activeKey)} fontWeight={fw("J",activeKey)} fill={fc("J",activeKey)}>J={tilt}°</text>
      </g>
      <text x="16" y="292" fill="#1e3a5f" fontSize="8" fontWeight="700" letterSpacing="2">TAYPRO® 1P PORTRAIT/LANDSCAPE</text>
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
    <svg viewBox="0 0 520 300" style={{width:"100%",height:"100%"}}>
      <SvgDefs />
      <rect width="520" height="300" fill="url(#bgG)" rx="10" />
      <Sun cx={460} cy={40} />
      <Roof y={210} x1={20} x2={490} />
      {/* panels on roof */}
      <g transform={`rotate(-${tilt}, 260, 195)`}>
        {Array.from({length: panelCount}).map((_,i) => (
          <PanelGrid key={i} x={startX + i*(pW+gap)} y={178} w={pW} h={38} cols={5} rows={2} />
        ))}
        {/* A — single module width */}
        <g onClick={() => onSelect("A")} style={cur}>
          <line x1={startX} y1="168" x2={startX+pW} y2="168" stroke={col("A",activeKey)} strokeWidth={lw("A",activeKey)} markerEnd="url(#arrA)" markerStart="url(#arrA)" />
          <text x={startX+pW/2} y="162" textAnchor="middle" fontSize={fs("A",activeKey)} fontWeight={fw("A",activeKey)} fill={fc("A",activeKey)}>A</text>
        </g>
        {/* B — gap between panels */}
        <g onClick={() => onSelect("B")} style={cur}>
          <line x1={startX+pW} y1="183" x2={startX+pW+gap} y2="183" stroke={col("B",activeKey)} strokeWidth={lw("B",activeKey)} markerEnd="url(#arrB)" markerStart="url(#arrB)" />
          <text x={startX+pW+gap/2} y="178" textAnchor="middle" fontSize={fs("B",activeKey)} fontWeight={fw("B",activeKey)} fill={fc("B",activeKey)}>B</text>
        </g>
        {/* K — frame cross section */}
        <g onClick={() => onSelect("K")} style={cur}>
          <circle cx={startX} cy="178" r="5" fill="none" stroke={col("K",activeKey)} strokeWidth={lw("K",activeKey)} />
          <line x1={startX-12} y1="165" x2={startX} y2="178" stroke={col("K",activeKey)} strokeWidth={lw("K",activeKey)} />
          <text x={startX-22} y="162" fontSize={fs("K",activeKey)} fontWeight={fw("K",activeKey)} fill={fc("K",activeKey)}>K</text>
        </g>
      </g>
      {/* C — total table width */}
      <g onClick={() => onSelect("C")} style={cur}>
        <line x1={startX} y1="148" x2={startX+totalW} y2="148" stroke={col("C",activeKey)} strokeWidth={lw("C",activeKey)} markerEnd="url(#arrC)" markerStart="url(#arrC)" />
        <text x={startX+totalW/2} y="142" textAnchor="middle" fontSize={fs("C",activeKey)} fontWeight={fw("C",activeKey)} fill={fc("C",activeKey)}>C (={panelCount > 1 ? `${panelCount}A+${panelCount-1}B` : "A"})</text>
      </g>
      {/* D — vertical ground clearance */}
      <g onClick={() => onSelect("D")} style={cur}>
        <line x1="494" y1="178" x2="494" y2="210" stroke={col("D",activeKey)} strokeWidth={lw("D",activeKey)} markerEnd="url(#arrD)" markerStart="url(#arrD)" />
        <text x="502" y="198" fontSize={fs("D",activeKey)} fontWeight={fw("D",activeKey)} fill={fc("D",activeKey)}>D</text>
      </g>
      {/* E — horizontal clearance */}
      <g onClick={() => onSelect("E")} style={cur}>
        <line x1={startX+totalW+10} y1="222" x2={startX+totalW+42} y2="222" stroke={col("E",activeKey)} strokeWidth={lw("E",activeKey)} markerEnd="url(#arrE)" markerStart="url(#arrE)" />
        <text x={startX+totalW+26} y="234" textAnchor="middle" fontSize={fs("E",activeKey)} fontWeight={fw("E",activeKey)} fill={fc("E",activeKey)}>E</text>
      </g>
      {/* F — row to row gap */}
      <g onClick={() => onSelect("F")} style={cur}>
        <line x1="26" y1="185" x2="26" y2="218" stroke={col("F",activeKey)} strokeWidth={lw("F",activeKey)} markerEnd="url(#arrF)" markerStart="url(#arrF)" />
        <text x="14" y="206" fontSize={fs("F",activeKey)} fontWeight={fw("F",activeKey)} fill={fc("F",activeKey)}>F</text>
      </g>
      {/* G — horizontal module gap */}
      <g onClick={() => onSelect("G")} style={cur}>
        <line x1="44" y1="225" x2="80" y2="225" stroke={col("G",activeKey)} strokeWidth={lw("G",activeKey)} markerEnd="url(#arrG)" markerStart="url(#arrG)" />
        <text x="62" y="236" textAnchor="middle" fontSize={fs("G",activeKey)} fontWeight={fw("G",activeKey)} fill={fc("G",activeKey)}>G</text>
      </g>
      {/* H — inter table gap */}
      <g onClick={() => onSelect("H")} style={cur}>
        <line x1="44" y1="255" x2="110" y2="255" stroke={col("H",activeKey)} strokeWidth={lw("H",activeKey)} markerEnd="url(#arrH)" markerStart="url(#arrH)" />
        <text x="77" y="267" textAnchor="middle" fontSize={fs("H",activeKey)} fontWeight={fw("H",activeKey)} fill={fc("H",activeKey)}>H</text>
      </g>
      {/* I — frame cross section */}
      <g onClick={() => onSelect("I")} style={cur}>
        <rect x="460" y="174" width="10" height="10" fill="none" stroke={col("I",activeKey)} strokeWidth={lw("I",activeKey)} />
        <text x="474" y="183" fontSize={fs("I",activeKey)} fontWeight={fw("I",activeKey)} fill={fc("I",activeKey)}>I</text>
      </g>
      {/* J — tilt angle */}
      <g onClick={() => onSelect("J")} style={cur}>
        <path d={`M 260 210 A 28 28 0 0 1 ${260+28*Math.cos((90-tilt)*Math.PI/180)} ${210-28*Math.sin((90-tilt)*Math.PI/180)}`}
          fill="none" stroke={col("J",activeKey)} strokeWidth={lw("J",activeKey)} strokeDasharray="3,2" />
        <text x="278" y="206" fontSize={fs("J",activeKey)} fontWeight={fw("J",activeKey)} fill={fc("J",activeKey)}>J={tilt}°</text>
      </g>
      <text x="16" y="292" fill="#1e3a5f" fontSize="8" fontWeight="700" letterSpacing="2">TAYPRO® {panelCount}P PORTRAIT/LANDSCAPE</text>
    </svg>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// Tracker MMS — Single-axis tracker with bearing housing
// ══════════════════════════════════════════════════════════════════════════════
const DiagramTracker = ({ dims, activeKey, onSelect }) => {
  const tilt = 20; // trackers are shown at operational angle
  return (
    <svg viewBox="0 0 520 300" style={{width:"100%",height:"100%"}}>
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
      <circle cx="153" cy="195" r="9" fill="none" stroke="#f97316" strokeWidth="2" />
      <circle cx="313" cy="195" r="9" fill="none" stroke="#f97316" strokeWidth="2" />
      {/* Panel tilted on tracker */}
      <g transform={`rotate(-${tilt}, 228, 190)`}>
        <PanelGrid x={90} y={158} w={280} h={54} cols={5} rows={2} />
        {/* A — module length */}
        <g onClick={() => onSelect("A")} style={cur}>
          <line x1="94" y1="150" x2="366" y2="150" stroke={col("A",activeKey)} strokeWidth={lw("A",activeKey)} markerEnd="url(#arrA)" markerStart="url(#arrA)" />
          <text x="228" y="145" textAnchor="middle" fontSize={fs("A",activeKey)} fontWeight={fw("A",activeKey)} fill={fc("A",activeKey)}>A — Module Length</text>
        </g>
        {/* B — thickness */}
        <g onClick={() => onSelect("B")} style={cur}>
          <line x1="78" y1="158" x2="78" y2="212" stroke={col("B",activeKey)} strokeWidth={lw("B",activeKey)} markerEnd="url(#arrB)" markerStart="url(#arrB)" />
          <text x="64" y="190" fontSize={fs("B",activeKey)} fontWeight={fw("B",activeKey)} fill={fc("B",activeKey)}>B</text>
        </g>
        {/* C — frame cross section (callout circle) */}
        <g onClick={() => onSelect("C")} style={cur}>
          <circle cx="370" cy="158" r="8" fill="none" stroke={col("C",activeKey)} strokeWidth={lw("C",activeKey)} />
          <line x1="370" y1="166" x2="390" y2="185" stroke={col("C",activeKey)} strokeWidth={lw("C",activeKey)} />
          <text x="394" y="193" fontSize={fs("C",activeKey)} fontWeight={fw("C",activeKey)} fill={fc("C",activeKey)}>C</text>
        </g>
      </g>
      {/* H — inter table gap (fixed bridge) */}
      <g onClick={() => onSelect("H")} style={cur}>
        <line x1="370" y1="198" x2="420" y2="198" stroke={col("H",activeKey)} strokeWidth={lw("H",activeKey)} markerEnd="url(#arrH)" markerStart="url(#arrH)" />
        <text x="395" y="192" textAnchor="middle" fontSize={fs("H",activeKey)} fontWeight={fw("H",activeKey)} fill={fc("H",activeKey)}>H (Fixed)</text>
      </g>
      {/* Bearing housing label */}
      <g onClick={() => onSelect("G")} style={cur}>
        <line x1="153" y1="206" x2="153" y2="230" stroke={col("G",activeKey)} strokeWidth={lw("G",activeKey)} />
        <text x="118" y="242" fontSize={fs("G",activeKey)} fontWeight={fw("G",activeKey)} fill={fc("G",activeKey)}>BHA Gap</text>
      </g>
      {/* Tilt indicator */}
      <g>
        <path d={`M 228 250 A 40 40 0 0 1 ${228+40*Math.cos((90-tilt)*Math.PI/180)} ${250-40*Math.sin((90-tilt)*Math.PI/180)}`}
          fill="none" stroke="#e11d48" strokeWidth="1.5" strokeDasharray="3,2" />
        <text x="246" y="242" fontSize="10" fontWeight="600" fill="#e11d48">±{tilt}°</text>
      </g>
      <text x="16" y="290" fill="#1e3a5f" fontSize="8" fontWeight="700" letterSpacing="2">TAYPRO® SINGLE-AXIS TRACKER</text>
    </svg>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// Top-view table layout (reused across types, adapts panel count per table)
// ══════════════════════════════════════════════════════════════════════════════
const TableLayout = ({ nom, mmsType, activeKey, onSelect }) => {
  const isPanelType = ["1p-1l","3p-3l","4p-4l"].includes((mmsType||"").toLowerCase());
  const r1 = nom?.tableNo1Rows || 2, c1 = nom?.tableNo1Cols || (isPanelType ? 4 : 3);
  const r2 = nom?.tableNo2Rows || 2, c2 = nom?.tableNo2Cols || (isPanelType ? 4 : 3);
  const cw = 40, ch = 50, g = 4;
  const fcl = (k) => (activeKey === k ? DIM_COLORS[k] : "#64748b");
  const fwl = (k) => (activeKey === k ? 700 : 500);

  return (
    <svg viewBox="0 0 360 200" style={{width:"100%",height:"100%"}}>
      <rect width="360" height="200" fill="#060f1e" rx="8" />
      <text x="12" y="16" fill="#475569" fontSize="8" fontWeight="600" letterSpacing="1">TABLE-NO-1</text>
      {Array.from({length:r1}).map((_,ri) => Array.from({length:c1}).map((_,ci) => (
        <rect key={`t1${ri}${ci}`} x={12+ci*(cw+g)} y={22+ri*(ch+g)} width={cw} height={ch} fill="#0d1f3c" stroke="#1e4080" strokeWidth="1.2" rx="2" />
      )))}
      {/* B arrow */}
      <g onClick={() => onSelect("B")} style={cur}>
        <line x1="8" y1="22" x2="8" y2={22+r1*(ch+g)-g} stroke={activeKey==="B"?DIM_COLORS.B:"#334155"} strokeWidth="1.2" />
        <text x="2" y={22+(r1*(ch+g))/2+4} fill={fcl("B")} fontSize="10" fontWeight={fwl("B")}>B</text>
      </g>
      {/* H inter-table gap */}
      <g onClick={() => onSelect("H")} style={cur}>
        <line x1={12+c1*(cw+g)} y1="180" x2="182" y2="180" stroke={activeKey==="H"?DIM_COLORS.H:"#334155"} strokeWidth="1.2" strokeDasharray="2,2" />
        <text x={12+c1*(cw+g)+(182-(12+c1*(cw+g)))/2} y="194" textAnchor="middle" fill={fcl("H")} fontSize="10" fontWeight={fwl("H")}>← H →</text>
      </g>
      <text x="188" y="16" fill="#475569" fontSize="8" fontWeight="600" letterSpacing="1">TABLE-NO-2</text>
      {Array.from({length:r2}).map((_,ri) => Array.from({length:c2}).map((_,ci) => (
        <rect key={`t2${ri}${ci}`} x={188+ci*(cw+g)} y={22+ri*(ch+g)} width={cw} height={ch} fill="#0d1f3c" stroke="#1e4080" strokeWidth="1.2" rx="2" />
      )))}
      {/* I */}
      <g onClick={() => onSelect("I")} style={cur}>
        <line x1={188+c2*(cw+g)} y1="20" x2={188+c2*(cw+g)} y2="26" stroke={activeKey==="I"?DIM_COLORS.I:"#334155"} strokeWidth="1.2" />
        <text x={188+c2*(cw+g)+4} y="18" fill={fcl("I")} fontSize="10" fontWeight={fwl("I")}>I</text>
      </g>
    </svg>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// Tracker top-view layout
// ══════════════════════════════════════════════════════════════════════════════
const TrackerLayout = ({ activeKey, onSelect }) => {
  const fcl = (k) => (activeKey === k ? DIM_COLORS[k] : "#64748b");
  const fwl = (k) => (activeKey === k ? 700 : 500);
  return (
    <svg viewBox="0 0 360 200" style={{width:"100%",height:"100%"}}>
      <rect width="360" height="200" fill="#060f1e" rx="8" />
      <text x="12" y="16" fill="#475569" fontSize="8" fontWeight="600" letterSpacing="1">TRACKER TOP VIEW</text>
      {/* Torque tube (long horizontal bar) */}
      <rect x="20" y="94" width="320" height="12" fill="#1a3a70" rx="3" />
      {/* Table panels */}
      {[0,1,2,3].map(i => (
        <g key={i}>
          <rect x={22+i*76} y={22} width={68} height={66} fill="#0d1f3c" stroke="#1e4080" strokeWidth="1.2" rx="2" />
          <rect x={22+i*76} y={112} width={68} height={66} fill="#0d1f3c" stroke="#1e4080" strokeWidth="1.2" rx="2" />
        </g>
      ))}
      {/* Bearing housing dots */}
      {[1,2,3].map(i => (
        <circle key={i} cx={20+i*76} cy={100} r="6" fill="none" stroke={activeKey==="G"?DIM_COLORS.G:"#334155"} strokeWidth="1.5" />
      ))}
      <g onClick={() => onSelect("G")} style={cur}>
        <text x="170" y="195" textAnchor="middle" fill={fcl("G")} fontSize="9" fontWeight={fwl("G")}>G — Bearing Housing Gaps</text>
      </g>
      <g onClick={() => onSelect("H")} style={cur}>
        <line x1="90" y1="186" x2="166" y2="186" stroke={activeKey==="H"?DIM_COLORS.H:"#334155"} strokeWidth="1.2" strokeDasharray="2,2" />
        <text x="128" y="180" textAnchor="middle" fill={fcl("H")} fontSize="9" fontWeight={fwl("H")}>← H →</text>
      </g>
    </svg>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// Master router — picks correct diagram based on mms_type
// ══════════════════════════════════════════════════════════════════════════════
const MountingDiagram = ({ mmsType, dims, activeKey, onSelect }) => {
  const t = (mmsType || "").toLowerCase();
  if (t === "2p")        return <Diagram2P dims={dims} activeKey={activeKey} onSelect={onSelect} />;
  if (t === "1p-1l")     return <Diagram1P dims={dims} activeKey={activeKey} onSelect={onSelect} />;
  if (t === "3p-3l")     return <DiagramNP dims={dims} activeKey={activeKey} onSelect={onSelect} panelCount={3} />;
  if (t === "4p-4l")     return <DiagramNP dims={dims} activeKey={activeKey} onSelect={onSelect} panelCount={4} />;
  if (t === "tracker")   return <DiagramTracker dims={dims} activeKey={activeKey} onSelect={onSelect} />;
  // fallback
  return <Diagram2P dims={dims} activeKey={activeKey} onSelect={onSelect} />;
};

const MountingTopView = ({ mmsType, nom, activeKey, onSelect }) => {
  const t = (mmsType || "").toLowerCase();
  if (t === "tracker") return <TrackerLayout activeKey={activeKey} onSelect={onSelect} />;
  return <TableLayout nom={nom} mmsType={mmsType} activeKey={activeKey} onSelect={onSelect} />;
};

// ══════════════════════════════════════════════════════════════════════════════
// Label for diagram header
// ══════════════════════════════════════════════════════════════════════════════
const MMS_LABELS = {
  "2p":      "2P Fixed Tilt — Side View",
  "1p-1l":   "1P Portrait/Landscape — Rooftop Side View",
  "3p-3l":   "3P Portrait/Landscape — Rooftop Side View",
  "4p-4l":   "4P Portrait/Landscape — Rooftop Side View",
  "tracker": "Single-Axis Tracker — Side View",
};

// ══════════════════════════════════════════════════════════════════════════════
// Demo wrapper (shows the diagram panel with type switcher for preview)
// ══════════════════════════════════════════════════════════════════════════════
const DEMO_DIMS_2P = {
  A: { label: "Solar Module Dimension", value: "1722", unit: "mm" },
  B: { label: "Solar Module Vertical Gap", value: "20", unit: "mm" },
  C: { label: "Table Width", value: "3464", unit: "mm" },
  D: { label: "Back Ground Clearance", value: "1500", unit: "mm" },
  E: { label: "Front Ground Clearance", value: "300", unit: "mm" },
  F: { label: "Solar Module Height", value: "1134", unit: "mm" },
  G: { label: "Frame Cross Section", value: "35", unit: "mm" },
  H: { label: "Inter Table Gap", value: "20", unit: "mm" },
  I: { label: "Module Gap Horizontal", value: "10", unit: "mm" },
  J: { label: "Tilt Angle", value: "25", unit: "°" },
};
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
  { value: "2p",      label: "2P Fixed Tilt" },
  { value: "1p-1l",   label: "1P Portrait/Landscape" },
  { value: "3p-3l",   label: "3P Portrait/Landscape" },
  { value: "4p-4l",   label: "4P Portrait/Landscape" },
  { value: "tracker", label: "Tracker MMS" },
];

const getDemoDims = (type) => {
  if (type === "tracker") return DEMO_DIMS_TRACKER;
  if (type === "2p") return DEMO_DIMS_2P;
  return DEMO_DIMS_ROOF;
};

export default function MMSDiagramDemo() {
  const [mmsType, setMmsType] = useState("2p");
  const [activeKey, setActiveKey] = useState(null);
  const dims = getDemoDims(mmsType);
  const dimKeys = Object.keys(dims);

  const sel = (k) => setActiveKey(p => p === k ? null : k);
  const act = activeKey ? dims[activeKey] : null;
  const diagramLabel = MMS_LABELS[mmsType] || "Mounting Structure — Side View";

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg,#060f1e 0%,#0a1628 100%)",
      padding: "24px 16px",
      fontFamily: "'DM Sans', system-ui, sans-serif",
      color: "#e2e8f0",
    }}>
      <style>{`
        * { box-sizing: border-box; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .sdot { width:8px;height:8px;border-radius:50%;background:#10b981;box-shadow:0 0 8px #10b981;animation:pulse 2s infinite;display:inline-block; }
        .type-btn { background:#0d1f3c;border:1px solid #1e3a5f;border-radius:8px;color:#94a3b8;font-size:.78rem;font-weight:600;padding:6px 14px;cursor:pointer;transition:all .2s; }
        .type-btn:hover { border-color:#2563eb;color:#e2e8f0; }
        .type-btn.active { background:linear-gradient(135deg,#1d4ed8,#2563eb);border-color:#2563eb;color:#fff;box-shadow:0 4px 14px rgba(37,99,235,.4); }
        .dim-card { background:#0d1f3c;border:1.5px solid #1e3a5f;border-radius:10px;padding:10px 12px;cursor:pointer;transition:all .2s; }
        .dim-card:hover { border-color:#2563eb; }
        .dim-card.active { transform:translateY(-2px); }
        ::-webkit-scrollbar{width:3px} ::-webkit-scrollbar-thumb{background:#1e3a5f;border-radius:2px}
      `}</style>

      {/* Header */}
      <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:20,animation:"fadeIn .4s ease-out"}}>
        <div style={{width:46,height:46,borderRadius:13,background:"linear-gradient(135deg,#1d4ed8,#f59e0b)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>
          ☀️
        </div>
        <div>
          <div style={{fontSize:"1.5rem",fontWeight:800,letterSpacing:".04em",lineHeight:1}}>MMS Nomenclature Viewer</div>
          <div style={{display:"flex",alignItems:"center",gap:8,marginTop:4}}>
            <div className="sdot" />
            <span style={{color:"#64748b",fontSize:".72rem"}}>Dynamic diagram — {TYPE_OPTIONS.find(t=>t.value===mmsType)?.label}</span>
          </div>
        </div>
      </div>

      {/* Type switcher */}
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:20}}>
        {TYPE_OPTIONS.map(t => (
          <button key={t.value} className={`type-btn${mmsType===t.value?" active":""}`}
            onClick={() => { setMmsType(t.value); setActiveKey(null); }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Main layout */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 340px",gap:16,alignItems:"start"}}>
        {/* Left — diagram */}
        <div style={{background:"#0a1628",border:"1px solid #1e3a5f",borderRadius:16,overflow:"hidden"}}>
          <div style={{background:"linear-gradient(135deg,#0d1f3c,#162d50)",borderBottom:"1px solid #1e3a5f",padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <span style={{fontWeight:600,fontSize:".88rem",color:"#64748b",letterSpacing:".08em",textTransform:"uppercase"}}>{diagramLabel}</span>
            {activeKey && (
              <span style={{background:DIM_COLORS[activeKey],color:"#fff",fontSize:".78rem",fontWeight:700,borderRadius:6,padding:"3px 10px"}}>
                {activeKey} — {act?.label}
              </span>
            )}
          </div>
          <div style={{padding:16}}>
            <div style={{height:290}}>
              <MountingDiagram mmsType={mmsType} dims={dims} activeKey={activeKey} onSelect={sel} />
            </div>
            <hr style={{borderColor:"#1e3a5f",margin:"12px 0"}} />
            <div style={{fontSize:".7rem",letterSpacing:".12em",textTransform:"uppercase",fontWeight:600,marginBottom:10,color:"#475569"}}>
              Top View — Panel Module Layout
            </div>
            <div style={{height:160}}>
              <MountingTopView mmsType={mmsType} nom={{tableNo1Rows:2,tableNo1Cols:3,tableNo2Rows:2,tableNo2Cols:3}} activeKey={activeKey} onSelect={sel} />
            </div>
            <p style={{fontSize:".68rem",textAlign:"center",marginTop:8,color:"#475569"}}>
              Click any label on the diagram to highlight its specification →
            </p>
          </div>
        </div>

        {/* Right — specs */}
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {/* Active dimension spotlight */}
          {activeKey && act && (
            <div style={{background:"linear-gradient(135deg,#0d2d5e,#0f3460)",border:`1.5px solid ${DIM_COLORS[activeKey]}`,borderRadius:12,padding:"14px 16px",animation:"fadeIn .3s ease-out"}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
                <div style={{width:44,height:44,borderRadius:12,background:DIM_COLORS[activeKey],display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:22,color:"#fff"}}>
                  {activeKey}
                </div>
                <div>
                  <div style={{fontWeight:600,fontSize:".85rem",color:"#94a3b8",lineHeight:1.2}}>{act.label}</div>
                  <div style={{fontSize:"1.9rem",fontWeight:800,color:DIM_COLORS[activeKey],lineHeight:1.1}}>
                    {act.value} <span style={{fontSize:"1rem",fontWeight:500,color:"#94a3b8"}}>{act.unit}</span>
                  </div>
                </div>
              </div>
              <div style={{fontSize:".65rem",color:"#475569"}}>
                Dimension {activeKey} · {act.unit === "°" ? "Angular measurement" : "Linear measurement"}
              </div>
            </div>
          )}

          {/* All dimension cards */}
          <div style={{background:"#0a1628",border:"1px solid #1e3a5f",borderRadius:16,overflow:"hidden"}}>
            <div style={{background:"linear-gradient(135deg,#0d1f3c,#162d50)",borderBottom:"1px solid #1e3a5f",padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <span style={{fontWeight:600,fontSize:".88rem",color:"#64748b",letterSpacing:".08em",textTransform:"uppercase"}}>
                Dimensions {dimKeys[0]}–{dimKeys[dimKeys.length-1]}
              </span>
              {activeKey && (
                <button onClick={() => setActiveKey(null)} style={{background:"#0d1f3c",border:"1px solid #1e3a5f",borderRadius:6,color:"#94a3b8",fontSize:".7rem",padding:"2px 8px",cursor:"pointer"}}>
                  Clear
                </button>
              )}
            </div>
            <div style={{padding:"14px 16px",maxHeight:460,overflowY:"auto"}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {dimKeys.map(k => {
                  const v = dims[k];
                  const isAct = activeKey === k;
                  const c = DIM_COLORS[k] || "#64748b";
                  return (
                    <div key={k} className={`dim-card${isAct?" active":""}`}
                      onClick={() => sel(k)}
                      style={{border:`1.5px solid ${isAct?c:"#1e3a5f"}`,background:isAct?`${c}15`:"#0d1f3c",boxShadow:isAct?`0 6px 20px ${c}28`:"none"}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                        <div style={{width:28,height:28,borderRadius:7,background:isAct?c:`${c}22`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:14,color:isAct?"#fff":c,flexShrink:0,transition:"all .2s"}}>
                          {k}
                        </div>
                        <div style={{fontSize:".95rem",fontWeight:600,color:isAct?c:"#e2e8f0",lineHeight:1.2}}>
                          {v?.value ? `${v.value} ${v.unit}` : "—"}
                        </div>
                      </div>
                      <div style={{fontSize:".68rem",color:"#64748b",lineHeight:1.3}}>{v?.label || `Dimension ${k}`}</div>
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

// ══════════════════════════════════════════════════════════════════════════════
// Named exports for use in ViewNomenClature.jsx
// ══════════════════════════════════════════════════════════════════════════════
export { MountingDiagram, MountingTopView, MMS_LABELS, DIM_COLORS };