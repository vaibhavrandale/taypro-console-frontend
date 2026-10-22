import React from "react";
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import { modulesCleanedByRobot } from "./modulesCleaned.mjs";

const MODULE_COLOR = {
  none: "#0d47a1",
  one: "#86efac",
  both: "#166534",
};

const robots = [
  {
    id: 1,
    robot_no: "Robot 1",
    site_id: "taypro_office",
    row_no: 1,
    row_length: 50, //100m
    module_count: 952,
    modules: {
      module_counts: 952,
      across: 2, // 2P: brush cleans two modules at once
      height: 1.6, // m
      width: 1.2, // m along the row
    },
  },
  {
    id: 2,
    robot_no: "Robot 2",
    site_id: "taypro_office",
    row_no: 1,
    row_length: 102, //100m
    module_count: 952,
    modules: {
      module_counts: 952,
      across: 2, // 2P: brush cleans two modules at once
      height: 1.6, // m
      width: 1.2, // m along the row
    },
  },
  {
    id: 3,
    robot_no: "Robot 3",
    site_id: "taypro_office",
    row_no: 1,
    row_length: 101, //100m
    module_count: 952,
    modules: {
      module_counts: 952,
      across: 2, // 2P: brush cleans two modules at once
      height: 1.6, // m
      width: 1.2, // m along the row
    },
  },
];

const cleaning_data = [
  {
    id: 1,
    robot_no: "Robot 1",
    site_id: "taypro_office",
    cleaning_date: "2023-10-01",
    row_no: 1,
    row_length: 50, //100m
    cleaning: {
      start: true,
      startAt: "2023-10-01 10:00:00",
      finish: true,
      finishAt: "2023-10-01 10:30:00",
      track_details: [
        { data: "21", time: "2023-10-01 10:05:00" },
        { data: "22", time: "2023-10-01 10:06:00" },
        { data: "23", time: "2023-10-01 10:07:00" },
        { data: "24", time: "2023-10-01 10:08:00" },
        { data: "25", time: "2023-10-01 10:09:00" },
        { data: "26", time: "2023-10-01 10:10:00" },
        { data: "27", time: "2023-10-01 10:11:00" },
        { data: "28", time: "2023-10-01 10:12:00" },
        { data: "29", time: "2023-10-01 10:13:00" },
        { data: "30", time: "2023-10-01 10:14:00" }, //neglect
        { data: "31", time: "2023-10-01 10:15:00" },
        { data: "32", time: "2023-10-01 10:16:00" },
        { data: "33", time: "2023-10-01 10:17:00" },
        { data: "34", time: "2023-10-01 10:18:00" },
        { data: "35", time: "2023-10-01 10:19:00" },
        { data: "36", time: "2023-10-01 10:20:00" },
        { data: "37", time: "2023-10-01 10:21:00" },
        { data: "38", time: "2023-10-01 10:22:00" },
        { data: "39", time: "2023-10-01 10:23:00" },
        { data: "40", time: "2023-10-01 10:24:00" },
      ],
    },
  },

  {
    id: 1,
    robot_no: "Robot 1",
    site_id: "taypro_office",
    cleaning_date: "2023-10-01",
    row_no: 1,
    row_length: 100, //100m

    cleaning: {
      start: true,
      startAt: "2023-10-01 10:00:00",
      finish: false,
      finishAt: null,
      track_details: [
        { data: "21", time: "2023-10-01 10:05:00" },
        { data: "22", time: "2023-10-01 10:06:00" },
        { data: "23", time: "2023-10-01 10:07:00" },
        { data: "24", time: "2023-10-01 10:08:00" },
        { data: "25", time: "2023-10-01 10:09:00" },
        { data: "26", time: "2023-10-01 10:10:00" },
        { data: "27", time: "2023-10-01 10:11:00" },
        { data: "28", time: "2023-10-01 10:12:00" },
        { data: "29", time: "2023-10-01 10:13:00" },
        { data: "30", time: "2023-10-01 10:14:00" }, //neglect
        { data: "31", time: "2023-10-01 10:15:00" },
        { data: "32", time: "2023-10-01 10:16:00" },
        { data: "33", time: "2023-10-01 10:17:00" },
        { data: "34", time: "2023-10-01 10:18:00" },
        { data: "35", time: "2023-10-01 10:19:00" },
        { data: "36", time: "2023-10-01 10:20:00" },
        { data: "37", time: "2023-10-01 10:21:00" },
        // { data: "38", time: "2023-10-01 10:22:00" },
      ],
    },
  },
];

const ModulesCleaningReport = () => {
  const rows = cleaning_data.map((log) => {
    const robot = robots.find(
      (item) => item.robot_no === log.robot_no && item.site_id === log.site_id,
    );
    const cleaned = modulesCleanedByRobot({
      row_length: log.row_length || robot?.row_length,
      module_counts: robot?.module_count ?? robot?.modules?.module_counts,
      module_width: robot?.modules?.width,
      across: robot?.modules?.across,
      track_details: log.cleaning?.track_details,
      cleaning: log.cleaning,
    });
    return { log, cleaned };
  });

  return (
    <div>
      <h2 className="blinker-semibold">Modules Cleaning Report</h2>
      <div className="d-flex gap-3 mb-3" style={{ fontSize: 13 }}>
        <Legend color={MODULE_COLOR.none} label="Not cleaned" />
        <Legend color={MODULE_COLOR.one} label="Forward only" />
        <Legend color={MODULE_COLOR.both} label="Forward and reverse" />
      </div>
      {rows.map(({ log, cleaned }, index) => (
        <div
          key={`${log.robot_no}-${index}`}
          className="d-flex align-items-center gap-3 mb-4"
        >
          <div
            className="d-flex align-items-center gap-2"
            style={{ width: 220, flexShrink: 0 }}
          >
            <div
              style={{
                minWidth: 64,
                textAlign: "center",
                fontWeight: 700,
                lineHeight: 1.2,
              }}
            >
              <div style={{ fontSize: 18 }}>{cleaned.module_counts}</div>
              <div style={{ fontSize: 11, fontWeight: 500 }}>Total modules</div>
            </div>
            <div>
              <div className="fw-semibold">{log.robot_no}</div>
              <div style={{ fontSize: 12, opacity: 0.75 }}>
                {cleaned.row_length} m
              </div>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="d-flex align-items-center gap-2">
              <Dock label="DS" />
              <div style={{ flex: 1, minWidth: 0 }}>
                {Array.from({ length: cleaned.across }, (_, band) => (
                  <div
                    key={band}
                    style={{
                      display: "flex",
                      gap: 1,
                      height: 16,
                      marginBottom: band === cleaned.across - 1 ? 0 : 2,
                    }}
                  >
                    {cleaned.columns.map((col, i) => (
                      <div
                        key={i}
                        title={
                          col.state === "both"
                            ? "Cleaned both sides"
                            : col.state === "one"
                              ? col.forward
                                ? "Cleaned forward"
                                : "Cleaned reverse"
                              : "Not cleaned"
                        }
                        style={{
                          flex: 1,
                          minWidth: 2,
                          background: MODULE_COLOR[col.state],
                        }}
                      />
                    ))}
                  </div>
                ))}
              </div>
              <Dock label="RS" />
            </div>
            <div className="mt-1" style={{ fontSize: 13 }}>
              Forward {cleaned.forwardCount} · Reverse {cleaned.reverseCount} ·
              Both {cleaned.bothCount}
            </div>
          </div>
        </div>
      ))}

      <CTable bordered hover responsive className="bg-important">
        <CTableHead color="secondary">
          <CTableRow>
            <CTableHeaderCell>Robot No</CTableHeaderCell>
            <CTableHeaderCell>Date</CTableHeaderCell>
            <CTableHeaderCell>Cleaning %</CTableHeaderCell>
            <CTableHeaderCell>Total modules</CTableHeaderCell>
            <CTableHeaderCell>Modules cleaned both sides</CTableHeaderCell>
            <CTableHeaderCell>Modules cleaned single side</CTableHeaderCell>
            <CTableHeaderCell>Modules remaining of double cleaning</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {rows.map(({ log, cleaned }, index) => (
            <CTableRow key={`summary-${log.robot_no}-${index}`}>
              <CTableDataCell>{log.robot_no}</CTableDataCell>
              <CTableDataCell>{log.cleaning_date}</CTableDataCell>
              <CTableDataCell>{cleaned.percentage}%</CTableDataCell>
              <CTableDataCell>{cleaned.module_counts}</CTableDataCell>
              <CTableDataCell>{cleaned.bothCount}</CTableDataCell>
              <CTableDataCell>{cleaned.forwardOnlyCount}</CTableDataCell>
              <CTableDataCell>{cleaned.doubleRemaining}</CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </div>
  );
};

const Legend = ({ color, label }) => (
  <span className="d-flex align-items-center gap-1">
    <span
      style={{
        width: 14,
        height: 14,
        background: color,
        display: "inline-block",
        borderRadius: 2,
      }}
    />
    {label}
  </span>
);

const Dock = ({ label }) => (
  <span style={{ fontSize: 12, fontWeight: 700, color: "#0277BD" }}>
    {label}
  </span>
);

export default ModulesCleaningReport;
