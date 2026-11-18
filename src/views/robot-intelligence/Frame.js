import React from "react";
import { Link, useLocation } from "react-router-dom";

export const T = {
  surface: "#121a2e",
  surfaceHi: "#18243d",
  border: "rgba(148,163,184,.16)",
  green: "#34d399",
  greenDim: "rgba(52,211,153,.14)",
  cyan: "#38bdf8",
  amber: "#fbbf24",
  amberDim: "rgba(251,191,36,.14)",
  red: "#f87171",
  redDim: "rgba(248,113,113,.14)",
  text: "#e8eef7",
  mid: "#94a3b8",
};

const SECTIONS = [
  ["Overview", "/master-admin/robot-intelligence"],
  ["Battery", "/master-admin/robot-intelligence/battery"],
  ["Motors", "/master-admin/robot-intelligence/motors"],
  ["Cleaning", "/master-admin/robot-intelligence/cleaning"],
  ["Records", "/master-admin/robot-intelligence/data"],
];

const toneColor = {
  green: [T.green, T.greenDim],
  amber: [T.amber, T.amberDim],
  red: [T.red, T.redDim],
  cyan: [T.cyan, "rgba(56,189,248,.14)"],
  mid: [T.mid, "rgba(148,163,184,.12)"],
};

function sectionOn(path, current) {
  if (path === "/master-admin/robot-intelligence") {
    return current === path || current.includes("/sites/") || current.includes("/robots/");
  }
  return current.startsWith(path);
}

export function Shell({ kicker, title, subtitle, children }) {
  const { pathname } = useLocation();
  return (
    <div
      style={{
        color: T.text,
        background: "#0c1324",
        border: `1px solid ${T.border}`,
        borderRadius: 14,
        padding: "12px 14px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', sans-serif",
        fontSize: 13,
        lineHeight: 1.35,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 10, letterSpacing: "0.08em", color: T.green, fontWeight: 600 }}>{kicker}</div>
          <h2 style={{ margin: "1px 0 0", fontSize: 17, fontWeight: 650, letterSpacing: "-0.02em" }}>{title}</h2>
          {subtitle ? <div style={{ color: T.mid, marginTop: 2, maxWidth: 680, fontSize: 12 }}>{subtitle}</div> : null}
        </div>
        <span style={{ border: `1px solid ${T.border}`, background: T.surfaceHi, color: T.mid, borderRadius: 999, padding: "2px 8px", fontSize: 11 }}>
          Sample preview
        </span>
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", margin: "10px 0 12px" }}>
        {SECTIONS.map(([name, path]) => {
          const on = sectionOn(path, pathname);
          return (
            <Link
              key={path}
              to={path}
              style={{
                textDecoration: "none",
                color: on ? "#06281c" : T.text,
                background: on ? T.green : T.surface,
                border: `1px solid ${on ? T.green : T.border}`,
                borderRadius: 999,
                padding: "3px 9px",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {name}
            </Link>
          );
        })}
      </div>
      {children}
    </div>
  );
}

export function Note({ children }) {
  return <div style={{ color: T.mid, fontSize: 11, marginBottom: 6 }}>{children}</div>;
}

export function Grid({ children, min = 220 }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fit, minmax(${min}px, 1fr))`, gap: 8 }}>
      {children}
    </div>
  );
}

export function Panel({ title, children, style }) {
  return (
    <section style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: "10px 12px", ...style }}>
      {title ? <div style={{ color: T.mid, fontSize: 11, letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 8 }}>{title}</div> : null}
      {children}
    </section>
  );
}

export function Kpi({ label, value, hint, tone = "green" }) {
  const color = toneColor[tone]?.[0] || T.green;
  return (
    <Panel>
      <div style={{ color: T.mid, fontSize: 11 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 650, color, lineHeight: 1.2, marginTop: 2, letterSpacing: "-0.03em" }}>{value}</div>
      {hint ? <div style={{ color: T.mid, marginTop: 2, fontSize: 11 }}>{hint}</div> : null}
    </Panel>
  );
}

export function Pill({ children, tone = "mid" }) {
  const [fg, bg] = toneColor[tone] || toneColor.mid;
  return (
    <span style={{ display: "inline-block", color: fg, background: bg, borderRadius: 999, padding: "1px 7px", fontSize: 11, fontWeight: 600 }}>
      {children}
    </span>
  );
}

export function ScoreRing({ value, label = "Health" }) {
  const size = 84;
  const stroke = 6;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.max(0, Math.min(100, value)) / 100) * c;
  const color = value >= 80 ? T.green : value >= 65 ? T.amber : T.red;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <svg width={size} height={size} aria-label={`${label} ${value} out of 100`}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(148,163,184,.2)" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <text x="50%" y="46%" textAnchor="middle" fill={T.text} fontSize="18" fontWeight="650">{value}</text>
        <text x="50%" y="64%" textAnchor="middle" fill={T.mid} fontSize="9">/ 100</text>
      </svg>
      <div style={{ color: T.mid, fontSize: 11 }}>{label}</div>
    </div>
  );
}

export function Meter({ label, value }) {
  const color = value >= 80 ? T.green : value >= 65 ? T.amber : T.red;
  return (
    <div style={{ marginBottom: 7 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
        <span>{label}</span>
        <span style={{ color }}>{value}</span>
      </div>
      <div style={{ height: 4, borderRadius: 99, background: "rgba(148,163,184,.16)" }}>
        <div style={{ width: `${Math.max(0, Math.min(100, value))}%`, height: "100%", borderRadius: 99, background: color }} />
      </div>
    </div>
  );
}

export function Table({ headers, rows }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ color: T.mid, textAlign: "left", fontSize: 11 }}>
            {headers.map((header) => (
              <th key={header} style={{ padding: "4px 6px", fontWeight: 600 }}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} style={{ borderTop: `1px solid ${T.border}` }}>
              {row.cells.map((cell, index) => (
                <td key={index} style={{ padding: "6px", verticalAlign: "middle", fontSize: 12 }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Tip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#0f172a", border: `1px solid ${T.border}`, borderRadius: 8, padding: "4px 8px" }}>
      <div style={{ color: T.mid, fontSize: 11, marginBottom: 2 }}>{label}</div>
      {payload.map((item) => (
        <div key={item.dataKey} style={{ color: T.text, fontSize: 12 }}>{item.name}: {item.value}</div>
      ))}
    </div>
  );
}

export const axis = { stroke: T.mid, fontSize: 11, tickLine: false, axisLine: false };
export const grid = { stroke: "rgba(148,163,184,.12)", vertical: false };
