import { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";

export default function SiteSelect({
  value,
  onChange,
  width = 260,
  placeholder = "Search Site...",
}) {
  const [siteIds, setSiteIds] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSiteIds = async () => {
      setLoading(true);

      try {
        const result = await axios.get(`/api/v1/sites`, {
          withCredentials: true,
        });

        const formatted = result.data.data.map((site) => ({
          value: site.site_id,
          label: site.site_id,
        }));

        setSiteIds(formatted);
        // Default select first value
        if (formatted.length > 0) {
          onChange(formatted[0].value);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    fetchSiteIds();
  }, [onChange]);

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      background: "#111c44",
      border: "none",
      borderRadius: "12px",
      minHeight: "26px",
      minWdth: "70px",
      cursor: "pointer",
      transition: "0.3s",
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
      padding: "0px 0px 0px 0px",
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
      padding: "0px 0px 0px 20px",
    }),
  };

  return (
    <div style={{ width }}>
      <Select
        options={siteIds}
        value={siteIds.find((s) => s.value === value)}
        onChange={(selected) => onChange(selected?.value || "")}
        isLoading={loading}
        isSearchable
        placeholder={placeholder}
        styles={customStyles}
      />
    </div>
  );
}
