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

  const authtoken = useSelector((state) => state.authtoken);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        dispatch({ type: "FETCH_INVENTORY_REQUEST" });
        const response = await axios.get(
          "/api/v1/service-inventory/inventory-site-wise/all",
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );

        dispatch({
          type: "FETCH_INVENTORY_SUCCESS",
          payload: response.data.data,
        });
      } catch (error) {
        dispatch({ type: "FETCH_INVENTORY_FAIL", payload: error.message });
      }
    };

    fetchInventory();
  }, [authtoken]);

  // const chartColors = [
  //   "#FF5733",
  //   "#28A745",
  //   "#FFC107",
  //   "#17A2B8",
  //   "#DC3545",
  //   "#6C757D",
  //   "#8E44AD",
  //   "#3498DB",
  //   "#E74C3C",
  //   "#2ECC71",
  //   "#F39C12",
  //   "#D35400",
  //   "#C0392B",
  //   "#27AE60",
  //   "#16A085",
  //   "#2980B9",
  //   "#2C3E50",
  //   "#1ABC9C",
  //   "#34495E",
  //   "#95A5A6",

  //   "#FF6B6B",
  //   "#4ECDC4",
  //   "#1A535C",
  //   "#F7FFF7",
  //   "#FF9F1C",
  //   "#2B2D42",
  //   "#8D99AE",
  //   "#EDF2F4",
  //   "#EF233C",
  //   "#D90429",
  //   "#FFB6B9",
  //   "#FAE3D9",
  //   "#BBDED6",
  //   "#8AC6D1",
  //   "#FFC3A0",
  //   "#FF677D",
  //   "#D4A5A5",
  //   "#392F5A",
  //   "#31A2AC",
  //   "#61C0BF",
  //   "#6B4226",
  //   "#D9BF77",
  //   "#ACD8AA",
  //   "#FFE156",
  //   "#6A0572",
  //   "#AB83A1",
  //   "#473E66",
  //   "#F5B700",
  //   "#1E3888",
  //   "#00A878",
  // ];

  const chartColors = [
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
    "#007d50",
    "#6bebb6",
    "#27b281",
    "#009cf9",
    "#3b4856",
    "#9eadbd",
    "#463216",
    "#786042",
    "#0b3955",
    "#7b392d",
    "#005a47",
    "#3b4856",
    "#9eadbd",
    "#00c6b4",
    "#ea60da",
    "#ff68a5",
    "#ff9375",
    "#ffc85b",
    "#f9f871",
    "#6c71fd",
    "#00845c",
    "#008a91",
    "#0084ff",
    "#3f8f94",
    "#6bbaa3",
    "#508072",
    "#6bbaa3",
    "#c8fceb",
    "#474554",
    "#aca9bb",
    "#3a7679",
    "#00168b",
    "#4bbea0",
    "#00c19d",
    "#bc7000",
    "#474554",
    "#357175",
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
              `${item.item_name} | Qty: ${item.quantity} | Thresh: ${item.threshold}`
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
                      data={{
                        labels: itemLabels,
                        datasets: [
                          {
                            data: itemValues,
                            backgroundColor: chartColors.slice(
                              0,
                              itemLabels.length
                            ),
                          },
                        ],
                      }}
                      options={{
                        plugins: {
                          legend: { display: false },
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
