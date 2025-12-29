import React, { useState } from "react";
import { CRow, CCol, CCard, CCardHeader, CCardBody } from "@coreui/react";

import { CChartLine } from "@coreui/react-chartjs";
import { Cpu, MemoryStick, HardDrive, Activity } from "lucide-react";
import { mapSystemLogsForCharts, METRIC_REGISTRY } from "./helper";
// import { system_debug_logs } from "../../../data";
import MetricModal from "./MetricModal";

const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: "#8a93a2" },
    },
    y: {
      beginAtZero: true,
      ticks: { color: "#8a93a2" },
      grid: { color: "rgba(255,255,255,0.05)" },
    },
  },
  plugins: {
    legend: {
      labels: { color: "#8a93a2" },
    },
  },
};

const MetricCard = ({ title, icon: Icon, chart, onExpand }) => (
  <CCard className="cursor-pointer" onClick={onExpand}>
    <CCardHeader className="d-flex align-items-center justify-content-between">
      <div>
        <Icon size={16} className="me-2" />
        {title}
      </div>
    </CCardHeader>
    <CCardBody style={{ height: 200 }}>{chart}</CCardBody>
  </CCard>
);

const SystemMetricsDashboard = ({ data }) => {
  const metrics = data && mapSystemLogsForCharts(data);
  const [activeMetricKey, setActiveMetricKey] = useState(null);

  const activeMetric = METRIC_REGISTRY[activeMetricKey];
  return (
    <CRow className="g-4 my-2">
      {/* CPU */}
      <CCol md={6}>
        <MetricCard
          title="CPU Utilization (%)"
          icon={Cpu}
          onExpand={() => setActiveMetricKey("cpu")}
          chart={
            <CChartLine
              data={{
                labels: metrics.labels,
                yAxis: {
                  min: 0,
                  max: 100,
                  ticks: {
                    stepSize: 1,
                    callback: (v) => `${v}%`,
                  },
                },
                datasets: [
                  {
                    label: "CPU %",
                    data: metrics.cpu,
                    borderColor: "#3399ff",
                    backgroundColor: "rgba(51,153,255,0.1)",
                    borderWidth: 2,
                    tension: 0.4,
                  },
                ],
              }}
              options={commonOptions}
            />
          }
        />
      </CCol>

      {/* Memory */}
      <CCol md={6}>
        <MetricCard
          title="Memory Usage (GB)"
          icon={MemoryStick}
          onExpand={() => setActiveMetricKey("memory")}
          chart={
            <CChartLine
              data={{
                labels: metrics.labels,
                datasets: METRIC_REGISTRY.memory.datasets(metrics),
              }}
              options={commonOptions}
            />
          }
        />
      </CCol>

      {/* Disk */}
      <CCol md={6}>
        <MetricCard
          title="Disk Usage (%)"
          onExpand={() => setActiveMetricKey("disk")}
          icon={HardDrive}
          chart={
            <CChartLine
              data={{
                labels: metrics.labels,
                datasets: [
                  {
                    label: "Disk %",
                    data: metrics.disk,
                    borderColor: "#f9b115",
                    backgroundColor: "rgba(249,177,21,0.1)",
                    borderWidth: 2,
                    tension: 0.4,
                  },
                ],
              }}
              options={commonOptions}
            />
          }
        />
      </CCol>

      {/* Load */}
      <CCol md={6}>
        <MetricCard
          title="Load Average"
          onExpand={() => setActiveMetricKey("load")}
          icon={Activity}
          chart={
            <CChartLine
              data={{
                labels: metrics.labels,
                datasets: [
                  {
                    label: "1 min",
                    data: metrics.load1,
                    borderColor: "#e5533d",
                    borderWidth: 2,
                  },
                  {
                    label: "5 min",
                    data: metrics.load5,
                    borderColor: "#39f",
                    borderDash: [6, 4],
                  },
                  {
                    label: "15 min",
                    data: metrics.load15,
                    borderColor: "#8a93a2",
                    borderDash: [2, 2],
                  },
                ],
              }}
              options={commonOptions}
            />
          }
        />
      </CCol>
      <MetricModal
        visible={!!activeMetricKey}
        onClose={() => setActiveMetricKey(null)}
        metric={activeMetric}
        labels={metrics.labels}
        datasets={activeMetric ? activeMetric.datasets(metrics) : []}
      />
    </CRow>
  );
};

export default SystemMetricsDashboard;
