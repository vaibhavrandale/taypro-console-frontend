import React from "react";

import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
} from "@coreui/react";
import { CChartBar } from "@coreui/react-chartjs";
import LoadingSpinner from "../../../components/LoadingSpinner";
const RobotAndCleaningGraph = ({ cleaningrobots, loading, site_id, error }) => {
  const chartColors = [
    "#4e73df",
    "#28A745",
    "#FFC107",
    "#17A2B8",
    "#DC3545",
    "#6C757D",
    "#8E44AD",
    "#3498DB",
    "#E74C3C",
    "#2ECC71",
    "#F39C12",
    "#D35400",
    "#C0392B",
    "#27AE60",
    "#16A085",
    "#2980B9",
    "#2C3E50",
    "#1ABC9C",
    "#34495E",
    "#95A5A6",
  ];

  return (
    <CRow className="justify-content-center">
      {loading ? (
        <CCol xs={12}>
          <CCard className="mb-4 shadow">
            <CCardHeader>
              <h5 className="text-start">
                Cleaning Log per Robot of &nbsp;
                <span className="text-primary">{site_id}</span>
              </h5>
            </CCardHeader>
            <CCardBody className="">
              <LoadingSpinner />
            </CCardBody>
          </CCard>
        </CCol>
      ) : error ? (
        <CCol xs={12}>
          <CCard className="mb-4 shadow">
            <CCardHeader>
              <h5 className="text-start">
                Cleaning Log per Robot of &nbsp;
                <span className="text-primary">{site_id}</span>
              </h5>
            </CCardHeader>
            <CCardBody className="">
              <CBadge color="danger">{error}</CBadge>
            </CCardBody>
          </CCard>
        </CCol>
      ) : cleaningrobots.length > 0 ? (
        <CCol xs={12}>
          <CCard className="mb-4 shadow">
            <CCardHeader>
              <h5 className="text-start">
                Cleaning Log per Robot of &nbsp;
                <span className="text-primary">{site_id}</span>
              </h5>
            </CCardHeader>
            <CCardBody className="">
              <div>
                <CChartBar
                  style={{ height: "350px", width: "100%" }}
                  data={{
                    labels: cleaningrobots.map((robot) => robot.robot_no),
                    datasets: [
                      {
                        label: "Calculated Distance (M)",
                        data: cleaningrobots.map(
                          (robot) => robot.calculated_distance
                        ),
                        backgroundColor: chartColors[0],
                        borderWidth: 1,
                        barThickness: 20, // 👈 Fixed width for each bar (in pixels)
                        maxBarThickness: 20, // 👈 Optional: max limit for bar width
                        categoryPercentage: 0.8, // 👈 Optional: % of available space per category
                        barPercentage: 0.9, // 👈 Optional: % of space inside each category
                      },
                    ],
                  }}
                  options={{
                    responsive: true,

                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        callbacks: {
                          label: function (context) {
                            return `🚀 ${context.parsed.y} M`;
                          },
                        },
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: "Cleaning Distance (M)",
                        },
                      },
                      x: {
                        title: {
                          display: true,
                          text: "Robot Number",
                        },
                      },
                    },
                  }}
                />
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      ) : (
        <CCol xs={12}>
          <CCard className="mb-4 shadow">
            <CCardHeader>
              <h5 className="text-center">Cleaning Log Per Robot</h5>
            </CCardHeader>
            <CCardBody className="d-flex justify-content-center align-items-center">
              <CBadge color="primary">Not Robots Found</CBadge>
            </CCardBody>
          </CCard>
        </CCol>
      )}
    </CRow>
  );
};

export default RobotAndCleaningGraph;
