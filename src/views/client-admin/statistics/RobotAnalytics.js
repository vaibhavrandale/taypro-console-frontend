import React, { useState } from "react";
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CFormInput,
} from "@coreui/react";

import { CChartBar, CChartLine } from "@coreui/react-chartjs";

const CleaningData = [
  {
    robot_no: "AAG-2324337",
    site_id: "avaada_agar",
    block: "Block-3",
    cleaning: {
      start: true,
      startAt: "2026-03-05T05:28:46Z",
      finish: true,
      finishAt: "2026-03-05T06:10:52Z",
      forward_cleaning_time: 1267,
      reverse_cleaning_time: 1055,
      total_cleaning_time: 2456,
      battery_before_cleaning: 80,
      battery_at_reverse_station: 63,
      battery_after_cleaning: 64,
      cycle_average_brush_current: 4627,
      cycle_average_wheel_current: 2434,
      cycle_max_wheel_current: 3328,
      cycle_max_brush_current: 3328,
      cycle_count: 37,
    },
  },
  {
    robot_no: "AAG-2324337",
    site_id: "avaada_agar",
    block: "Block-3",
    cleaning: {
      start: true,
      startAt: "2026-03-04T05:30:21Z",
      finish: true,
      finishAt: "2026-03-04T06:12:15Z",
      forward_cleaning_time: 1255,
      reverse_cleaning_time: 1042,
      total_cleaning_time: 2401,
      battery_before_cleaning: 82,
      battery_at_reverse_station: 66,
      battery_after_cleaning: 65,
      cycle_average_brush_current: 3605,
      cycle_average_wheel_current: 3410,
      cycle_max_wheel_current: 3302,
      cycle_max_brush_current: 3310,
      cycle_count: 36,
    },
  },
  {
    robot_no: "AAG-2324337",
    site_id: "avaada_agar",
    block: "Block-3",
    cleaning: {
      start: true,
      startAt: "2026-03-03T05:31:40Z",
      finish: true,
      finishAt: "2026-03-03T06:14:02Z",
      forward_cleaning_time: 1270,
      reverse_cleaning_time: 1030,
      total_cleaning_time: 2445,
      battery_before_cleaning: 79,
      battery_at_reverse_station: 61,
      battery_after_cleaning: 62,
      cycle_average_brush_current: 3580,
      cycle_average_wheel_current: 3398,
      cycle_max_wheel_current: 3290,
      cycle_max_brush_current: 3305,
      cycle_count: 35,
    },
  },
  {
    robot_no: "AAG-2324337",
    site_id: "avaada_agar",
    block: "Block-3",
    cleaning: {
      start: true,
      startAt: "2026-03-02T05:29:15Z",
      finish: true,
      finishAt: "2026-03-02T06:11:08Z",
      forward_cleaning_time: 1248,
      reverse_cleaning_time: 1048,
      total_cleaning_time: 2395,
      battery_before_cleaning: 81,
      battery_at_reverse_station: 64,
      battery_after_cleaning: 63,
      cycle_average_brush_current: 3610,
      cycle_average_wheel_current: 3420,
      cycle_max_wheel_current: 3332,
      cycle_max_brush_current: 3320,
      cycle_count: 34,
    },
  },
  {
    robot_no: "AAG-2324337",
    site_id: "avaada_agar",
    block: "Block-3",
    cleaning: {
      start: true,
      startAt: "2026-03-01T05:33:12Z",
      finish: true,
      finishAt: "2026-03-01T06:16:05Z",
      forward_cleaning_time: 1280,
      reverse_cleaning_time: 1060,
      total_cleaning_time: 2470,
      battery_before_cleaning: 83,
      battery_at_reverse_station: 67,
      battery_after_cleaning: 66,
      cycle_average_brush_current: 3650,
      cycle_average_wheel_current: 3450,
      cycle_max_wheel_current: 3340,
      cycle_max_brush_current: 3335,
      cycle_count: 33,
    },
  },
  {
    robot_no: "AAG-2324337",
    site_id: "avaada_agar",
    block: "Block-3",
    cleaning: {
      start: true,
      startAt: "2026-02-28T05:34:30Z",
      finish: true,
      finishAt: "2026-02-28T06:17:00Z",
      forward_cleaning_time: 1295,
      reverse_cleaning_time: 1055,
      total_cleaning_time: 2488,
      battery_before_cleaning: 84,
      battery_at_reverse_station: 68,
      battery_after_cleaning: 67,
      cycle_average_brush_current: 3660,
      cycle_average_wheel_current: 3465,
      cycle_max_wheel_current: 3355,
      cycle_max_brush_current: 3342,
      cycle_count: 32,
    },
  },
  {
    robot_no: "AAG-2324337",
    site_id: "avaada_agar",
    block: "Block-3",
    cleaning: {
      start: true,
      startAt: "2026-02-27T05:35:02Z",
      finish: true,
      finishAt: "2026-02-27T06:18:15Z",
      forward_cleaning_time: 1302,
      reverse_cleaning_time: 1068,
      total_cleaning_time: 2498,
      battery_before_cleaning: 85,
      battery_at_reverse_station: 69,
      battery_after_cleaning: 68,
      cycle_average_brush_current: 3685,
      cycle_average_wheel_current: 3480,
      cycle_max_wheel_current: 3360,
      cycle_max_brush_current: 3355,
      cycle_count: 31,
    },
  },
  {
    robot_no: "AAG-2324337",
    site_id: "avaada_agar",
    block: "Block-3",
    cleaning: {
      start: true,
      startAt: "2026-02-26T05:35:02Z",
      finish: true,
      finishAt: "2026-02-26T06:18:15Z",
      forward_cleaning_time: 1100,
      reverse_cleaning_time: 1168,
      total_cleaning_time: 2580,
      battery_before_cleaning: 85,
      battery_at_reverse_station: 69,
      battery_after_cleaning: 68,
      cycle_average_brush_current: 3185,
      cycle_average_wheel_current: 3780,
      cycle_max_wheel_current: 360,
      cycle_max_brush_current: 355,
      cycle_count: 30,
    },
  },
  {
    robot_no: "AAG-2324337",
    site_id: "avaada_agar",
    block: "Block-3",
    cleaning: {
      start: true,
      startAt: "2026-02-16T05:35:02Z",
      finish: true,
      finishAt: "2026-02-16T06:18:15Z",
      forward_cleaning_time: 100,
      reverse_cleaning_time: 168,
      total_cleaning_time: 2588,
      battery_before_cleaning: 100,
      battery_at_reverse_station: 49,
      battery_after_cleaning: 18,
      cycle_average_brush_current: 4185,
      cycle_average_wheel_current: 3800,
      cycle_max_wheel_current: 4160,
      cycle_max_brush_current: 4355,
      cycle_count: 30,
    },
  },
];
const RobotAnalytics = () => {
  const today = new Date();
  const last7 = new Date();
  last7.setDate(today.getDate() - 6);

  const formatDate = (d) => d.toISOString().slice(0, 10);

  const [startDate, setStartDate] = useState(formatDate(last7));
  const [endDate, setEndDate] = useState(formatDate(today));

  /* ---------------------- PROCESS DATA ---------------------- */

  const processedData = CleaningData.map((d) => ({
    date: new Date(d.cleaning.startAt).toISOString().slice(0, 10),

    cleaning_minutes: Math.round(d.cleaning.total_cleaning_time / 60),

    battery_start: d.cleaning.battery_before_cleaning,
    battery_end: d.cleaning.battery_after_cleaning,

    brush_current: d.cleaning.cycle_average_brush_current,
    wheel_current: d.cleaning.cycle_average_wheel_current,

    cycles: d.cleaning.cycle_count,
  }));
  const filteredData = processedData.filter((d) => {
    const rowDate = new Date(d.date);
    const start = new Date(startDate);
    const end = new Date(endDate);

    return rowDate >= start && rowDate <= end;
  });

  /* ---------------------- KPI ---------------------- */

  const avgCleaningTime =
    filteredData.reduce((a, b) => a + b.cleaning_minutes, 0) /
    filteredData.length;

  const avgCycles =
    filteredData.reduce((a, b) => a + b.cycles, 0) / filteredData.length;

  return (
    <>
      {/* FILTER */}

      <CCard className="mb-4">
        <CCardHeader>Filters</CCardHeader>
        <CCardBody>
          <CRow>
            <CCol md={2}>
              <CFormInput
                type="date"
                label="Start Date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </CCol>

            <CCol md={2}>
              <CFormInput
                type="date"
                label="End Date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </CCol>
            <CCol md={3}>
              <CCard className="text-center">
                <CCardBody>
                  <h6>Average Cleaning Time</h6>
                  <h4>{avgCleaningTime.toFixed(1)} min</h4>
                </CCardBody>
              </CCard>
            </CCol>

            <CCol md={2}>
              <CCard className="text-center">
                <CCardBody>
                  <h6>Total Cycles</h6>
                  <h4>{avgCycles.toFixed(0)}</h4>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {/* CLEANING TIME GRAPH */}

      <CRow>
        <CCol md={12}>
          <CCard>
            <CCardHeader>Cleaning Duration</CCardHeader>
            <CCardBody style={{ height: 300 }}>
              <CChartLine
                data={{
                  labels: filteredData.map((d) => d.date),
                  datasets: [
                    {
                      label: "Cleaning Time (minutes)",
                      borderColor: "#27AE60",
                      backgroundColor: "#27AE60",
                      data: filteredData.map((d) => d.cleaning_minutes),
                      tension: 0,
                    },
                  ],
                }}
                options={{ maintainAspectRatio: false }}
              />
            </CCardBody>
          </CCard>
        </CCol>

        {/* CYCLES */}
      </CRow>
      <CRow className="mt-4">
        <CCol md={12}>
          <CCard>
            <CCardHeader>Battery Level</CCardHeader>
            <CCardBody>
              <CChartBar
                style={{ height: 320 }}
                data={{
                  labels: filteredData.map((d) => d.date),
                  datasets: [
                    {
                      label: "Battery Start %",
                      backgroundColor: "#27AE60",
                      data: filteredData.map((d) => d.battery_start),
                      barThickness: 25,
                    },
                    {
                      label: "Battery End %",
                      backgroundColor: "#4e73df",
                      data: filteredData.map((d) => d.battery_end),
                      barThickness: 25,
                    },
                  ],
                }}
                options={{
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      title: { display: true, text: "Battery %" },
                      min: 0,
                      max: 100,
                    },
                  },
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow className="my-4">
        <CCol md={12}>
          <CCard>
            <CCardHeader>Motor Current</CCardHeader>

            <CCardBody>
              <CChartBar
                style={{ height: 320 }}
                data={{
                  labels: filteredData.map((d) => d.date),

                  datasets: [
                    {
                      label: "Brush Current (mA)",
                      backgroundColor: "#27AE60",
                      data: filteredData.map((d) => d.brush_current),
                      barThickness: 25,
                    },

                    {
                      label: "Wheel Current (mA)",
                      backgroundColor: "#4e73df",
                      data: filteredData.map((d) => d.wheel_current),
                      barThickness: 25,
                    },
                  ],
                }}
                options={{
                  maintainAspectRatio: false,

                  plugins: {
                    legend: {
                      position: "top",
                    },
                  },

                  scales: {
                    y: {
                      title: {
                        display: true,
                        text: "Current (mA)",
                      },
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default RobotAnalytics;
