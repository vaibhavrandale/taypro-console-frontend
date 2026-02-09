import React from "react";

const Gauge = ({
  value,
  min = 0,
  max = 100,
  label,
  unit,
  size = 100,
  stroke = 5,
  color = "#3399ff",
}) => {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const percent = Math.min(Math.max(value / max, 0), 1);
  const offset = circumference * (1 - percent);

  return (
    <svg width={size} height={size}>
      {/* Background ring */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#1e293b"
        strokeWidth={stroke}
        fill="none"
      />

      {/* Active arc */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />

      {/* Value */}
      <text
        x="50%"
        y="40%"
        textAnchor="middle"
        fill="#e5e7eb"
        fontSize="16"
        fontWeight="600"
      >
        {value}
      </text>

      {/* Unit */}
      <text x="50%" y="58%" textAnchor="middle" fill="#94a3b8" fontSize="13">
        {unit}
      </text>

      {/* Label */}
      <text
        x="50%"
        y="75%"
        textAnchor="middle"
        fill="#64748b"
        fontSize="12"
        letterSpacing="1"
      >
        {label}
      </text>
    </svg>
  );
};

export default Gauge;
