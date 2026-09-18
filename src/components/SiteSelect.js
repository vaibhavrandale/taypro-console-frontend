import { useEffect, useRef, useState } from "react";
import Select from "react-select";
import axios from "axios";

export const SELECTED_SITE_STORAGE_KEY = "selectedSiteId";

export function getSavedSiteId() {
  try {
    return localStorage.getItem(SELECTED_SITE_STORAGE_KEY) || "";
  } catch {
    return "";
  }
}

export function saveSiteId(siteId) {
  if (!siteId || siteId === "all") return;
  try {
    localStorage.setItem(SELECTED_SITE_STORAGE_KEY, siteId);
  } catch {
    // Ignore quota / private-mode failures.
  }
}

export default function SiteSelect({
  value,
  onChange,
  width = 260,
  placeholder = "Search Site...",
  persist = true,
}) {
  const [siteIds, setSiteIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const restoredRef = useRef(false);

  useEffect(() => {
    const fetchSiteIds = async () => {
      setLoading(true);
      try {
        const result = await axios.get(`/api/v1/sites`, {
          withCredentials: true,
        });
        const formatted = (result.data.data || []).map((site) => ({
          value: site.site_id,
          label: site.site_id,
        }));
        setSiteIds(formatted);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    fetchSiteIds();
  }, []);

  useEffect(() => {
    if (!persist || restoredRef.current || !siteIds.length) return;

    const saved = getSavedSiteId();
    const known = (id) => siteIds.some((s) => s.value === id);

    if (value && value !== "all" && known(value)) {
      restoredRef.current = true;
      saveSiteId(value);
      return;
    }

    if (saved && known(saved) && saved !== value) {
      restoredRef.current = true;
      onChange(saved);
      return;
    }

    restoredRef.current = true;
  }, [onChange, persist, siteIds, value]);

  const customStyles = {
    control: (provided) => ({
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

    menuPortal: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
  };

  return (
    <div style={{ width: "100%", maxWidth: width, minWidth: 150 }}>
      <Select
        options={siteIds}
        value={siteIds.find((s) => s.value === value) || null}
        onChange={(selected) => {
          const next = selected?.value || "";
          if (persist) saveSiteId(next);
          onChange(next);
        }}
        isLoading={loading}
        isSearchable
        placeholder={placeholder}
        styles={customStyles}
        menuPortalTarget={
          typeof document !== "undefined" ? document.body : null
        }
      />
    </div>
  );
}
