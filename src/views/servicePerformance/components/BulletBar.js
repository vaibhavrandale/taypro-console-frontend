import React from "react";

/**
 * Bar with a target tick. `breachWhen` decides which side of the target is
 * bad: "above" for durations, "below" for percentages like uptime.
 * A missing value draws a hatched bar and the missing label, never 0.
 */
export default function BulletBar({ value, target, max = 100, breachWhen = "below", missingLabel = "No record", label }) {
  const missing = value == null || Number.isNaN(Number(value));
  const scale = Math.max(max, target || 0, missing ? 0 : Number(value)) || 1;
  const width = missing ? 100 : Math.max(0, Math.min(100, (Number(value) / scale) * 100));
  const breached = !missing && target != null && (breachWhen === "above" ? Number(value) > target : Number(value) < target);
  const fill = missing ? "sp-hatch" : breached ? "sp-bar-fill sp-bar-fill--red" : "sp-bar-fill";
  const description = missing
    ? `${label || "Value"}: ${missingLabel}`
    : `${label || "Value"}: ${Number(value).toFixed(1)}${target != null ? `, target ${target}` : ""}${breached ? ", breached" : ""}`;

  return (
    <div className="sp-bar" role="img" aria-label={description}>
      <div className={fill} style={{ width: `${width}%`, height: "100%", borderRadius: 999 }} />
      {target != null && <div className="sp-bar-tick" style={{ left: `${Math.min(100, (target / scale) * 100)}%` }} aria-hidden="true" />}
    </div>
  );
}
