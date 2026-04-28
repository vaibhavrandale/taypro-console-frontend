import React, { useEffect, useReducer } from "react";
import { CChartPie } from "@coreui/react-chartjs";
import { CRow, CCol, CCard, CCardBody, CCardHeader } from "@coreui/react";
import axios from "axios";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_INVENTORY_REQUEST":
      return { ...state, loading: true };
    case "FETCH_INVENTORY_SUCCESS":
      return { ...state, inventoryData: action.payload, loading: false };
    case "FETCH_INVENTORY_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const InventoryOverview = () => {
  const [{ loading, error, inventoryData }, dispatch] = useReducer(reducer, {
    inventoryData: [],
    loading: true,
    error: "",
  });

  // const authtoken = useSelector((state) => state.authtoken);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        dispatch({ type: "FETCH_INVENTORY_REQUEST" });
        const response = await axios.get(
          "/api/v1/service-inventory/site-wise-inventory",
          {
            // headers: { Authorization: `Bearer ${authtoken}` },
            withCredentials: true,
          },
        );

        dispatch({
          type: "FETCH_INVENTORY_SUCCESS",
          payload: response.data.data,
        });
      } catch (error) {
        dispatch({
          type: "FETCH_INVENTORY_FAIL",
          payload: error.response.data.message || error.response.data.error,
        });
      }
    };

    fetchInventory();
  }, []);

  const chartColors = [
    "#FF5733",
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
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "100px", width: "100px" }}
        >
          <LoadingSpinner />
        </div>
      ) : error ? (
        <p className="text-danger text-center">{error}</p>
      ) : (
        inventoryData.map((site, index) => {
          const itemLabels = site.items.map(
            (item) =>
              `${item.item_name} | Qty: ${item.quantity} | Thresh: ${item.threshold}`,
          );
          const itemValues = site.items.map((item) => item.quantity);

          return (
            <CCol xs={12} md={6} key={site.site_id}>
              <CCard className="mb-4 shadow">
                <CCardHeader>
                  <h5 className="text-center">
                    {site.sitename || "Unknown Site"}
                  </h5>
                </CCardHeader>
                <CCardBody className="d-flex justify-content-center align-items-center">
                  <div style={{ width: "100%", height: "100%" }}>
                    <CChartPie
                      style={{ height: "350px" }}
                      data={{
                        labels: itemLabels,
                        datasets: [
                          {
                            data: itemValues,
                            backgroundColor: chartColors.slice(
                              0,
                              itemLabels.length,
                            ),
                          },
                        ],
                      }}
                      options={{
                        plugins: {
                          legend: { position: "right" },
                          tooltip: {
                            callbacks: {
                              label: function (tooltipItem) {
                                const item = site.items[tooltipItem.dataIndex];
                                return `📦 ${item.item_name} | 🔢 Qty: ${item.quantity} | ⚠️ Thresh: ${item.threshold}`;
                              },
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
          );
        })
      )}
    </CRow>
  );
};

export default InventoryOverview;
