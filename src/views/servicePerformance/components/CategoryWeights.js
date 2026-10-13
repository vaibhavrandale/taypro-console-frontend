import React from "react";
import { CFormInput } from "@coreui/react";
import StatusChip from "./StatusChip";
import { weightTotal, weightsValid } from "../utils/score";

/** rows: [{ key, name, kpiCount, weight, was }]. Weights must total exactly 100. */
export default function CategoryWeights({ rows, onChange, disabled }) {
  const total = weightTotal(rows);
  const valid = weightsValid(rows);
  return (
    <div>
      <div className="d-flex justify-content-end mb-2">
        <StatusChip status={valid ? "ready" : "calculation_error"} tone={valid ? "green" : "red"} label={`Total ${total.toFixed(1)}%${valid ? "" : " (must be 100%)"}`} />
      </div>
      {rows.map((row) => {
        const id = `sp-weight-${row.key}`;
        const changed = Math.abs((row.was ?? 0) - row.weight) > 0.001;
        return (
          <div className="sp-row" key={row.key}>
            <label htmlFor={id} className="sp-row-label">
              <span className="fw-semibold">{row.name}</span>
              <span className="d-block sp-small sp-muted">
                {row.kpiCount} KPI{row.kpiCount === 1 ? "" : "s"}
              </span>
            </label>
            <div className="sp-bar" aria-hidden="true">
              <div className="sp-bar-fill sp-bar-fill--blue" style={{ width: `${Math.min(100, row.weight)}%` }} />
            </div>
            <CFormInput
              id={id}
              type="number"
              min={0}
              max={100}
              step="any"
              style={{ width: 90 }}
              value={Number.isFinite(row.weight) ? Number(row.weight.toFixed(2)) : ""}
              disabled={disabled || !row.kpiCount}
              invalid={row.weight < 0 || row.weight > 100}
              onChange={(e) => onChange(row.key, e.target.value === "" ? 0 : Number(e.target.value))}
            />
            <div className="sp-row-value sp-small sp-muted" style={{ width: 80 }}>
              {changed ? `was ${(row.was ?? 0).toFixed(1)}%` : ""}
            </div>
          </div>
        );
      })}
      {!valid && (
        <div className="sp-notice sp-notice--red" role="alert">
          Category weights must add up to 100%. Activation is disabled until they do.
        </div>
      )}
    </div>
  );
}
