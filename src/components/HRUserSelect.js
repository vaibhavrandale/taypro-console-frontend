import { useMemo } from "react";
import Select from "react-select";

const selectStyles = {
  control: (provided) => ({
    ...provided,
    background: "#111c44",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px",
    minHeight: "42px",
    cursor: "pointer",
    transition: "0.3s",
    boxShadow: "none",
    "&:hover": {
      borderColor: "rgba(0,212,255,0.35)",
    },
  }),
  valueContainer: (provided) => ({
    ...provided,
    paddingLeft: "12px",
  }),
  menu: (provided) => ({
    ...provided,
    background: "#16213e",
    borderRadius: "5px",
    overflow: "hidden",
    zIndex: 9999,
  }),
  menuList: (provided) => ({
    ...provided,
    padding: 0,
    background: "#16213e",
  }),
  option: (provided, state) => ({
    ...provided,
    background: state.isSelected
      ? "#00d4ff22"
      : state.isFocused
        ? "#1b2a52"
        : "#16213e",
    color: state.isSelected ? "#00d4ff" : "#ffffff",
    padding: 8,
    cursor: "pointer",
    transition: "0.2s",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#ffffff",
    fontWeight: 500,
  }),
  input: (provided) => ({
    ...provided,
    color: "#ffffff",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#94a3b8",
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    color: state.isFocused ? "#00d4ff" : "#94a3b8",
    "&:hover": {
      color: "#00d4ff",
    },
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  noOptionsMessage: (provided) => ({
    ...provided,
    color: "#94a3b8",
    padding: "8px 12px",
  }),
};

export default function HRUserSelect({
  users = [],
  value,
  onChange,
  width = "100%",
  placeholder = "Search employee...",
  isLoading = false,
}) {
  const options = useMemo(
    () =>
      users.map((user) => ({
        value: String(user.user_id),
        label: `${user.username} (${user.employee_id})`,
        searchText: [user.username, user.email, user.employee_id]
          .filter(Boolean)
          .join(" ")
          .toLowerCase(),
      })),
    [users],
  );

  const selectedOption =
    options.find((option) => option.value === String(value)) || null;

  const filterOption = (option, inputValue) => {
    if (!inputValue) return true;
    return option.data.searchText.includes(inputValue.toLowerCase());
  };

  return (
    <div style={{ width }}>
      <Select
        options={options}
        value={selectedOption}
        onChange={(selected) => onChange(selected?.value || "")}
        isLoading={isLoading}
        isSearchable
        isClearable
        placeholder={placeholder}
        styles={selectStyles}
        filterOption={filterOption}
        noOptionsMessage={() => "No employee found"}
      />
    </div>
  );
}
