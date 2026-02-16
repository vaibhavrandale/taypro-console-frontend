// import { CBadge } from "@coreui/react";
// import { CChartLine } from "@coreui/react-chartjs";
// import { getStyle } from "@coreui/utils";
// import React, { useMemo } from "react";

// const BatteryGraph = ({ data = [] }) => {
//   const processed = useMemo(() => {
//     if (!data.length) return { labels: [], values: [] };

//     // 1️⃣ Sort ascending by time
//     const sorted = [...data].sort(
//       (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
//     );

//     // 2️⃣ Map labels & values
//     const labels = sorted.map((item) =>
//       new Date(item.createdAt).toLocaleTimeString("en-IN", {
//         timeZone: "Asia/Kolkata",
//         hour: "2-digit",
//         minute: "2-digit",
//       }),
//     );

//     const values = sorted.map((item) => Number(item.data));

//     return { labels, values };
//   }, [data]);

//   return (
//     <div className="border-top border-bottom">
//       <div className="my-2 text-center">
//         <CBadge color="warning">Battery Graph</CBadge>
//       </div>
//       <div style={{ width: "100%", margin: "auto" }}>
//         <CChartLine
//           style={{ height: "280px" }}
//           className="p-2"
//           data={{
//             labels: processed.labels,
//             datasets: [
//               {
//                 label: "Battery %",
//                 backgroundColor: `rgba(${getStyle("--cui-info-rgb")}, .1)`,
//                 borderColor: getStyle("--cui-info"),
//                 pointHoverBackgroundColor: getStyle("--cui-info"),
//                 borderWidth: 2,
//                 data: processed.values,
//                 tension: 0.4,
//               },
//             ],
//           }}
//           options={{
//             responsive: true,
//             plugins: {
//               legend: {
//                 display: true,
//               },
//             },
//             scales: {
//               x: {
//                 ticks: {
//                   maxRotation: 0,
//                   autoSkip: true,
//                   maxTicksLimit: 10,
//                 },
//               },
//               y: {
//                 min: 0,
//                 max: 105,
//                 ticks: {
//                   stepSize: 15,
//                 },
//               },
//             },
//           }}
//         />
//       </div>
//     </div>
//   );
// };

// export default BatteryGraph;

import { CCard, CCardBody } from "@coreui/react";
import { CChartLine } from "@coreui/react-chartjs";
import { getStyle } from "@coreui/utils";
import React, { useMemo } from "react";

const BatteryGraph = ({ data = [] }) => {
  const processed = useMemo(() => {
    if (!data.length) {
      return { labels: [], values: [], latest: "--", min: "--", max: "--" };
    }

    const sorted = [...data].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    );

    const labels = sorted.map((item) =>
      new Date(item.createdAt).toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      }),
    );

    const values = sorted.map((item) => Number(item.data));

    return {
      labels,
      values,
    };
  }, [data]);

  return (
    <CCard className="shadow-sm rounded-0 border-0  border-top border-warning border-bottom">
      <CCardBody>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h6 className="mb-0">Last Battery Updates</h6>
          </div>
        </div>

        {/* Chart */}
        <CChartLine
          style={{ height: "240px" }}
          data={{
            labels: processed.labels,
            datasets: [
              {
                label: "Battery %",
                data: processed.values,
                borderColor: getStyle("--cui-primary"),
                backgroundColor: "transparent",
                borderWidth: 2,
                tension: 0.3,
                pointRadius: 2,
                pointHoverRadius: 4,
                fill: false,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: (context) => ` ${context.raw}%`,
                },
              },
            },
            scales: {
              x: {
                grid: {
                  display: false,
                },
                ticks: {
                  maxRotation: 0,

                  maxTicksLimit: 10,
                },
              },
              y: {
                min: 0,
                max: 105,
                ticks: {
                  stepSize: 20,
                },
                grid: {
                  color: "rgba(0,0,0,0.05)",
                },
              },
            },
          }}
        />
      </CCardBody>
    </CCard>
  );
};

export default BatteryGraph;
