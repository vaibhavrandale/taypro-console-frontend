export const mapSystemLogsForCharts = (logs) => ({
  // labels: logs.map((l) => l.timestamp.slice(11, 16)),
  labels: logs.map((l) => {
    const date = new Date(l.timestamp); // parse timestamp
    return date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // 24-hour format
      timeZone: "Asia/Kolkata", // ensure IST
    });
  }),
  cpu: logs.map((l) => Number((l.cpu.user + l.cpu.system).toFixed(1))),

  // Memory in GB
  memory: logs.map((l) => +(l.memory_mb.used / 1024).toFixed(2)), // used GB
  memory_total: logs.map((l) => +(l.memory_mb.total / 1024).toFixed(2)), // optional for reference

  disk: logs.map((l) => l.disk[0]?.usage_percent ?? 0),

  load1: logs.map((l) => l.load_avg.one),
  load5: logs.map((l) => l.load_avg.five),
  load15: logs.map((l) => l.load_avg.fifteen),
});

// metricsRegistry.js
// export const METRIC_REGISTRY = {
//   cpu: {
//     title: "CPU utilization (%)",
//     unit: "%",
//     yAxis: {
//       min: 0,
//       max: 100,
//       ticks: {
//         stepSize: 1,
//         callback: (v) => `${v}%`,
//       },
//     },
//     datasets: (metrics) => [
//       {
//         label: "CPU %",
//         data: metrics.cpu,
//         borderColor: "#3399ff",
//         borderWidth: 2,
//         tension: 0.4,
//       },
//     ],
//   },

//   memory: {
//     title: "Memory Usage (GB)",
//     unit: "GB",
//     yAxis: {
//       beginAtZero: true,
//       ticks: {
//         stepSize: 1, // 1 GB steps
//         callback: (v) => `${v} GB`,
//       },
//     },
//     datasets: (metrics) => [
//       {
//         label: "Memory Used (GB)",
//         data: metrics.memory,
//         borderColor: "#2eb85c",
//         borderWidth: 2,
//         tension: 0.4,
//       },
//     ],
//   },

//   disk: {
//     title: "Disk usage (%)",
//     unit: "%",
//     datasets: (metrics) => [
//       {
//         label: "Disk %",
//         data: metrics.disk,
//         borderColor: "#f9b115",
//         borderWidth: 2,
//         tension: 0.4,
//       },
//     ],
//   },

//   load: {
//     title: "Load average",
//     unit: "",
//     datasets: (metrics) => [
//       {
//         label: "1 min",
//         data: metrics.load1,
//         borderColor: "#e5533d",
//       },
//       {
//         label: "5 min",
//         data: metrics.load5,
//         borderColor: "#3399ff",
//         borderDash: [6, 4],
//       },
//       {
//         label: "15 min",
//         data: metrics.load15,
//         borderColor: "#8a93a2",
//         borderDash: [2, 2],
//       },
//     ],
//   },
// };

export const METRIC_REGISTRY = {
  cpu: {
    title: "CPU Utilization (%)",
    yScale: {
      min: 0,
      max: 100,
      ticks: {
        stepSize: 10,
        callback: (v) => `${v}%`,
      },
    },
    datasets: (metrics) => [
      {
        label: "CPU %",
        data: metrics.cpu,
        borderColor: "#3399ff",
        backgroundColor: "rgba(51,153,255,0.1)",
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  },

  memory: {
    title: "Memory Usage (GB)",
    yScale: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
        callback: (v) => `${v} GB`,
      },
    },
    datasets: (metrics) => [
      {
        label: "Memory Used",
        data: metrics.memory,
        borderColor: "#2eb85c",
        backgroundColor: "rgba(46,184,92,0.1)",
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  },

  disk: {
    title: "Disk Usage (%)",
    yScale: {
      min: 0,
      max: 100,
      ticks: {
        stepSize: 10,
        callback: (v) => `${v}%`,
      },
    },
    datasets: (metrics) => [
      {
        label: "Disk %",
        data: metrics.disk,
        borderColor: "#f9b115",
        backgroundColor: "rgba(249,177,21,0.1)",
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  },

  load: {
    title: "Load Average",
    yScale: {
      beginAtZero: true,
      ticks: { stepSize: 1 },
    },
    datasets: (metrics) => [
      { label: "1 min", data: metrics.load1, borderColor: "#e5533d" },
      {
        label: "5 min",
        data: metrics.load5,
        borderColor: "#3399ff",
        borderDash: [6, 4],
      },
      {
        label: "15 min",
        data: metrics.load15,
        borderColor: "#8a93a2",
        borderDash: [2, 2],
      },
    ],
  },
};
