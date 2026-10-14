import React from "react";
import { CFormInput } from "@coreui/react";

export function rowMatches(query, values) {
  const q = String(query || "").trim().toLowerCase();
  if (!q) return true;
  return values.some((value) => String(value ?? "").toLowerCase().includes(q));
}

export default function TableSearch({ value, onChange, placeholder = "Search", label = "Search table" }) {
  return (
    <CFormInput
      size="sm"
      className="sp-table-search mb-2"
      aria-label={label}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
