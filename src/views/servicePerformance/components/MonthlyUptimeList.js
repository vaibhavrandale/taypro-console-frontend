import React from "react";
import BulletBar from "./BulletBar";
import { monthLabel, pct } from "../utils/format";

/** rows: [{ label: "2026-10", value: number|null, availability: number|null }]. Missing months stay "No record". */
export default function MonthlyUptimeList({ rows, target }) {
  return (
    <div>
      {rows.map((row) => {
        const missing = row.value == null;
        return (
          <div className="sp-row" key={row.label}>
            <div className="sp-row-label">{monthLabel(row.label)}</div>
            <BulletBar value={row.value} target={target} label={`Cleaning uptime ${monthLabel(row.label)}`} />
            <div className={`sp-row-value${missing ? " sp-muted" : row.value < target ? " text-danger fw-semibold" : ""}`}>
              <span>{missing ? "No record" : pct(row.value)}</span>
              <div className="sp-small sp-muted fw-normal">{`Avail. ${row.availability == null ? "No record" : pct(row.availability)}`}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
