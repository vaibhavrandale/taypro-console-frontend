import React from "react";
import { CCard, CCardBody, CCardHeader, CRow, CCol } from "@coreui/react";
import { CChartLine } from "@coreui/react-chartjs";

const GraphCard = ({ title, labels, data, label, color }) => {
  return (
    <CCard className="border-0 h-100" style={{ background: "#020617" }}>
      <CCardHeader
        className="text-white py-2"
        style={{
          background: "transparent",
          borderBottom: "1px solid #1e293b",
          fontSize: "14px",
        }}
      >
        {title}
      </CCardHeader>

      <CCardBody>
        <CChartLine
          data={{
            labels,
            datasets: [
              {
                label,
                data,
                borderColor: color,
                backgroundColor: `${color}20`,
                borderWidth: 2,
                pointRadius: 2,
                tension: 0.35,
              },
            ],
          }}
          options={{
            maintainAspectRatio: false,
            plugins: {
              legend: {
                labels: {
                  color: "#e5e7eb",
                },
              },
            },
            scales: {
              x: {
                ticks: { color: "#94a3b8", maxRotation: 0 },
                grid: { color: "rgba(148,163,184,0.1)" },
              },
              y: {
                ticks: { color: "#94a3b8" },
                grid: { color: "rgba(148,163,184,0.1)" },
              },
            },
          }}
          style={{ height: "220px" }}
        />
      </CCardBody>
    </CCard>
  );
};

const LogsGraph = ({ logs = [] }) => {
  const sortedLogs = [...logs].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
  );

  const labels = sortedLogs.map((log) =>
    new Date(log.createdAt).toLocaleTimeString(),
  );

  const currentData = sortedLogs.map((log) => log.current);
  const voltageData = sortedLogs.map((log) => log.voltage);
  const powerData = sortedLogs.map((log) => log.power);

  return (
    <CRow className="g-3">
      {/* Row 1 */}
      <CCol md={6}>
        <GraphCard
          title="Current vs Time"
          labels={labels}
          data={currentData}
          label="Current (A)"
          color="#facc15"
        />
      </CCol>

      <CCol md={6}>
        <GraphCard
          title="Voltage vs Time"
          labels={labels}
          data={voltageData}
          label="Voltage (V)"
          color="#38bdf8"
        />
      </CCol>

      {/* Row 2 */}
      <CCol md={6}>
        <GraphCard
          title="Power vs Time"
          labels={labels}
          data={powerData}
          label="Power (W)"
          color="#22c55e"
        />
      </CCol>
    </CRow>
  );
};

export default LogsGraph;
