import React from "react";
import StatusChip from "./StatusChip";

/** SVG donut so it renders without a chart library and has a text label. */
export default function ScoreDonut({ score, eligible, total, completeness, size = 148 }) {
  const known = score != null && !Number.isNaN(Number(score));
  const value = known ? Math.max(0, Math.min(100, Number(score))) : 0;
  const provisional = !known || completeness == null || completeness < 100;
  const stroke = 14;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const color = !known ? "#94a3b8" : value >= 80 ? "#15803d" : value >= 60 ? "#b45309" : "#b91c1c";
  const text = known ? value.toFixed(1) : "—";
  const description = `Overall score ${known ? `${text} out of 100` : "not available"}, ${provisional ? "provisional" : "final"}, ${eligible} of ${total} KPIs eligible`;

  return (
    <div className="d-flex flex-column align-items-center gap-2">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={description}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e9edf2" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${(value / 100) * circumference} ${circumference}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <text x="50%" y="47%" textAnchor="middle" fontSize="28" fontWeight="600" fill="#1f2937">
          {text}
        </text>
        <text x="50%" y="62%" textAnchor="middle" fontSize="12" fill="#4b5563">
          out of 100
        </text>
      </svg>
      <StatusChip status={provisional ? "provisional" : "final"} />
      <div className="sp-small sp-muted text-center">
        {eligible} of {total} KPIs eligible
        {completeness != null && ` · ${completeness.toFixed(1)}% of weight`}
      </div>
    </div>
  );
}
