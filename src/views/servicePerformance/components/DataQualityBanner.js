import React from "react";
import { Link } from "react-router-dom";

export default function DataQualityBanner({ summary, configLink, extra }) {
  if (!summary?.provisional && !extra) return null;
  return (
    <div className="sp-banner" role="status">
      {summary?.provisional && (
        <strong>
          Overall score is provisional: {summary.eligible} of {summary.total} KPIs eligible
          {summary.completeness != null ? ` (${summary.completeness.toFixed(1)}% of configured weight)` : ""}.
        </strong>
      )}{" "}
      {extra}{" "}
      {configLink && <Link to={configLink}>Open site configuration</Link>}
    </div>
  );
}
