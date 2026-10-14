import React from "react";
import Select from "react-select";

const COLORS = {
  surface: "#1b2230",
  surface2: "#222a3a",
  border: "#2f3a4d",
  text: "#e5e7eb",
  muted: "#a3adbd",
  blue: "#60a5fa",
};

const styles = {
  control: (base, state) => ({
    ...base,
    background: COLORS.surface2,
    borderColor: state.isFocused ? COLORS.blue : COLORS.border,
    boxShadow: "none",
    minHeight: 38,
    fontSize: 14,
    ":hover": { borderColor: COLORS.blue },
  }),
  menu: (base) => ({ ...base, background: COLORS.surface, border: `1px solid ${COLORS.border}`, zIndex: 20 }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  menuList: (base) => ({ ...base, background: COLORS.surface }),
  option: (base, state) => ({
    ...base,
    background: state.isSelected ? "rgba(96,165,250,0.28)" : state.isFocused ? COLORS.surface2 : COLORS.surface,
    color: COLORS.text,
    fontSize: 13,
  }),
  singleValue: (base) => ({ ...base, color: COLORS.text }),
  input: (base) => ({ ...base, color: COLORS.text }),
  placeholder: (base) => ({ ...base, color: COLORS.muted }),
  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: (base) => ({ ...base, color: COLORS.muted }),
  clearIndicator: (base) => ({ ...base, color: COLORS.muted }),
  noOptionsMessage: (base) => ({ ...base, color: COLORS.muted }),
};

/** Searchable single-value list. Clearing the box selects the empty value. */
export default function SearchSelect({ id, value, onChange, options, placeholder, ariaLabel }) {
  const selected = options.find((option) => option.value === value) || null;
  return (
    <Select
      inputId={id}
      aria-label={ariaLabel || placeholder}
      options={options}
      value={selected}
      onChange={(option) => onChange(option?.value || "")}
      isClearable
      isSearchable
      placeholder={placeholder}
      styles={styles}
      menuPortalTarget={typeof document !== "undefined" ? document.body : null}
      noOptionsMessage={() => "No match"}
    />
  );
}
