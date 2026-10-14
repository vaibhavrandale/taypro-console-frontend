import React from "react";
import { humanize } from "../utils/format";

const TONES = {
  ready: ["green", "Ready"],
  final: ["green", "Final"],
  eligible: ["green", "Eligible"],
  available: ["green", "Available"],
  on_time: ["green", "On time"],
  recorded: ["green", "Recorded"],
  transferred: ["green", "Transferred"],
  provisional: ["amber", "Provisional"],
  partial: ["amber", "Partial"],
  partially_analyzable: ["amber", "Partially analyzable"],
  data_incomplete: ["amber", "Data incomplete"],
  awaiting_dispatch: ["amber", "Awaiting dispatch"],
  unweighted: ["grey", "Unweighted"],
  robot_weighted: ["blue", "Robot-weighted"],
  configuration_incomplete: ["red", "Configuration incomplete"],
  calculation_error: ["red", "Calculation error"],
  late: ["red", "Late"],
  delay_reason_missing: ["red", "delay_reason_missing"],
  missing_record: ["red", "Missing record"],
  excluded: ["grey", "Excluded"],
  informational: ["blue", "Informational"],
  no_record: ["grey", "No record"],
  upcoming: ["blue", "Upcoming"],
  pending: ["amber", "Pending"],
  overdue: ["red", "Overdue"],
  completed_on_time: ["green", "Completed on time"],
  completed_late: ["amber", "Completed late"],
  no_robots: ["grey", "No robots at site"],
};

/** Pill badge. Meaning is always in the text, colour only reinforces it. */
export default function StatusChip({ status, label, tone, strike = false, title }) {
  const [defaultTone, defaultLabel] = TONES[status] || ["grey", humanize(status)];
  return (
    <span className={`sp-chip sp-chip--${tone || defaultTone}${strike ? " sp-chip--strike" : ""}`} title={title}>
      {label || defaultLabel}
    </span>
  );
}
