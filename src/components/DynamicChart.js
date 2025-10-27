import React from "react";
import { CChartBar, CChartLine, CChartDoughnut } from "@coreui/react-chartjs";
import { CCard, CCardHeader, CFormSelect } from "@coreui/react";

const ChartWrapper = ({ type, labels, datasets, height = "50vh", options }) => {
  const props = {
    style: { height, minHeight: "300px" },
    data: { labels, datasets },
    options,
  };

  switch (type) {
    case "line":
      return <CChartLine {...props} />;
    case "doughnut":
      return <CChartDoughnut {...props} />;
    default:
      return <CChartBar {...props} />;
  }
};

const DynamicChart = ({
  title = "Chart",
  labels = [],
  datasets = [], // Now expects an array of dataset objects
  colors = [],
  options = {},
}) => {
  const [chartType, setChartType] = React.useState("bar");

  const defaultColors = [
    "#0b3955",
    "#00627b",
    "#008c8f",
    "#24b68c",
    "#91db7b",
    "#f9f871",
    "#394f75",
    "#666593",
    "#967aac",
    "#c890c0",
    "#f9a7cf",
    "#446887",
    "#d3f4ff",
    "#e49d23",
  ];

  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: {
        backgroundColor: "#1e1e2f",
        titleColor: "#fff",
        bodyColor: "#ddd",
        padding: 12,
      },
    },
    scales: {
      y: { beginAtZero: true },
      x: { ticks: { display: true } },
    },
    ...options,
  };

  return (
    <CCard className="mb-4 shadow">
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">{title}</h5>
        <CFormSelect
          value={chartType}
          onChange={(e) => setChartType(e.target.value)}
          className="w-auto"
        >
          <option value="bar">Bar</option>
          <option value="line">Line</option>
          <option value="doughnut">Doughnut</option>
        </CFormSelect>
      </CCardHeader>
      <div className="container-fluid py-3">
        {labels.length === 0 ? (
          <div className="text-center text-muted">📊 No data available</div>
        ) : (
          <ChartWrapper
            type={chartType}
            labels={labels}
            datasets={
              // If colors provided for each dataset, map and inject them
              datasets.map((ds, idx) => ({
                ...ds,
                backgroundColor:
                  ds.backgroundColor ||
                  (colors[idx]
                    ? colors[idx]
                    : defaultColors[idx % defaultColors.length]),
                borderColor: ds.borderColor || "#fff",
                borderWidth: 1,
                hoverOffset: 8,
              }))
            }
            options={chartOptions}
          />
        )}
      </div>
    </CCard>
  );
};

export default DynamicChart;
