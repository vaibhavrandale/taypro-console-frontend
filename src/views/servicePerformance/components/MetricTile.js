import React from "react";

/**
 * A number with a label. Pass `na` (a short reason) when the workflow cannot
 * produce the metric; the tile then shows "n/a" instead of a misleading 0.
 */
export default function MetricTile({ label, value, hint, na }) {
  return (
    <div className="sp-tile">
      <div className="sp-tile-label">{label}</div>
      <div className="sp-tile-value">{na ? "n/a" : value ?? "—"}</div>
      {(na || hint) && <div className="sp-tile-hint">{na || hint}</div>}
    </div>
  );
}
