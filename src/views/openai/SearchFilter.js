import React, { useEffect, useMemo, useRef, useState } from "react";
import { CFormInput, CListGroup, CListGroupItem } from "@coreui/react";

const SearchFilter = ({ caseType, onSelect }) => {
  const [query, setQuery] = useState("");
  const [showList, setShowList] = useState(false);
  const [dataList, setDataList] = useState([]);

  const debounceRef = useRef(null);

  const isRobotCase = caseType?.includes("ROBOT");
  const isSiteCase = caseType?.includes("SITE");

  // 🔹 Load once from localStorage when caseType changes
  useEffect(() => {
    setQuery("");
    setShowList(false);

    if (isRobotCase) {
      const robots = JSON.parse(localStorage.getItem("robots")) || [];
      setDataList(robots);
    } else if (isSiteCase) {
      const sites = JSON.parse(localStorage.getItem("sites")) || [];
      setDataList(sites);
    } else {
      setDataList([]);
    }
  }, [caseType]);

  // 🔹 Debounced input
  const handleChange = (value) => {
    clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      setQuery(value);
      setShowList(true);
    }, 200);
  };

  // 🔹 Memoized filter (FAST for 2000 items)
  const filtered = useMemo(() => {
    if (!query) return [];

    return dataList
      .filter((item) => {
        const value = isRobotCase ? item.robot_no : item.site_id;

        return value?.toLowerCase().includes(query.toLowerCase());
      })
      .slice(0, 20); // limit display
  }, [query, dataList]);

  const handleSelect = (item) => {
    const value = isRobotCase ? item.robot_no : item.site_id;

    setQuery(value);
    setShowList(false); // 👈 instantly hide
    onSelect(value);
  };

  return (
    <div style={{ position: "relative" }}>
      <CFormInput
        value={query}
        placeholder={isRobotCase ? "Search Robot No" : "Search Site ID"}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => query && setShowList(true)}
      />

      {showList && filtered.length > 0 && (
        <CListGroup
          style={{
            position: "absolute",
            width: "100%",
            zIndex: 999,
            maxHeight: "250px",
            overflowY: "auto",
          }}
        >
          {filtered.map((item, index) => {
            const value = isRobotCase ? item.robot_no : item.site_id;

            return (
              <CListGroupItem
                key={index}
                action
                onClick={() => handleSelect(item)}
              >
                {value}
              </CListGroupItem>
            );
          })}
        </CListGroup>
      )}
    </div>
  );
};

export default SearchFilter;
