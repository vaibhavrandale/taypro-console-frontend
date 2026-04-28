import React, { useEffect, useReducer } from "react";
import { CChartBar } from "@coreui/react-chartjs";
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CAlert,
  CSpinner,
} from "@coreui/react";
import axios from "axios";
import { useSelector } from "react-redux";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_PARAMETERS_REQUEST":
      return { ...state, loading: true };
    case "FETCH_PARAMETERS_SUCCESS":
      return { ...state, parameterData: action.payload, loading: false };
    case "FETCH_PARAMETERS_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const KeyMaintenanceMatrixOverview = () => {
  const [{ loading, parameterData }, dispatch] = useReducer(reducer, {
    parameterData: [],
    loading: true,
    error: "",
  });

  // const authtoken = useSelector((state) => state.authtoken);

  useEffect(() => {
    const fetchParameters = async () => {
      try {
        dispatch({ type: "FETCH_PARAMETERS_REQUEST" });
        const response = await axios.get(
          "/api/v1/servicetickets/by-fault-type",
          {
            // headers: { Authorization: `Bearer ${authtoken}` },
            withCredentials: true,
          },
        );
        dispatch({
          type: "FETCH_PARAMETERS_SUCCESS",
          payload: response.data.data,
        });
      } catch (error) {
        dispatch({ type: "FETCH_PARAMETERS_FAIL", payload: error.message });
      }
    };

    fetchParameters();
  }, []);

  return (
    <div className="mt-4" style={{ width: "100%" }}>
      {loading ? (
        <CSpinner color="primary" />
      ) : parameterData?.length === 0 ? (
        <CAlert color="warning">No Measurable Parameters Found</CAlert>
      ) : (
        <CRow>
          {parameterData.map((faultItem, index) => {
            const robotLabels = faultItem.items.map((item) => item.robot_no);

            return (
              <CCol md={12} className="mb-4" key={index}>
                <CCard>
                  <CCardHeader>{faultItem.fault_type}</CCardHeader>
                  <CCardBody>
                    <CChartBar
                      style={{ maxHeight: "300px", width: "100%" }}
                      data={{
                        labels: robotLabels,
                        datasets: [
                          {
                            label: "Fault Count",
                            backgroundColor: "#42A5F5",
                            barThickness: 15,
                            data: faultItem.items.map((item) => ({
                              x: item.robot_no,
                              y: parseInt(item.service_ticket_cnt, 10),
                              mttr: item.mttr,
                              mtbf: item.mtbf,
                              reliability: item.reliability,
                            })),
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        plugins: {
                          tooltip: {
                            callbacks: {
                              label: function (tooltipItem) {
                                const dataPoint = tooltipItem.raw;
                                return [
                                  `Fault Occurence: ${dataPoint.y}`,
                                  `MTTR: ${dataPoint.mttr}`,
                                  `MTBF: ${dataPoint.mtbf}`,
                                  `Reliability: ${dataPoint.reliability}`,
                                ];
                              },
                            },
                          },
                          legend: {
                            position: "top",
                          },
                          title: {
                            display: false,
                          },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            max: 2, // <-- Adjust this value based on your expected maximum fault count
                            ticks: {
                              stepSize: 1,
                              precision: 0,
                            },
                          },
                        },
                      }}
                    />
                  </CCardBody>
                </CCard>
              </CCol>
            );
          })}
        </CRow>
      )}
    </div>
  );
};

export default KeyMaintenanceMatrixOverview;
