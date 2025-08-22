import React, { useEffect, useReducer } from "react";
import { CChartPie } from "@coreui/react-chartjs";
import { CRow, CCol, CCard, CCardHeader } from "@coreui/react";
import axios from "axios";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_FAULT_REQUEST":
      return { ...state, loading: true };
    case "FETCH_FAULT_SUCCESS":
      return {
        ...state,
        serviceticketsfaulycount: action.payload,
        loading: false,
      };
    case "FETCH_FAULT_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "FETCH_SITEWISE_TICKET_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SITEWISE_TICKET_SUCCESS":
      return {
        ...state,
        serviceticketssitewise: action.payload,
        loading: false,
      };
    case "FETCH_SITEWISE_TICKET_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const PieChart = () => {
  const [
    { loading, error, serviceticketsfaulycount, serviceticketssitewise },
    dispatch,
  ] = useReducer(reducer, {
    serviceticketsfaulycount: [],
    serviceticketssitewise: [],
    loading: true,
    error: "",
  });

  const authtoken = useSelector((state) => state.authtoken);

  useEffect(() => {
    const fetchFaultCounts = async () => {
      try {
        dispatch({ type: "FETCH_FAULT_REQUEST" });
        const response = await axios.get("/api/v1/servicetickets/faultcount", {
          headers: { Authorization: `Bearer ${authtoken}` },
        });

        let result = response.data.data; // Expecting array of objects { count, fault_type }

        const faultData = result.reduce((acc, item) => {
          acc[item.fault_type] = item.count;
          return acc;
        }, {});

        dispatch({ type: "FETCH_FAULT_SUCCESS", payload: faultData });
      } catch (error) {
        dispatch({
          type: "FETCH_FAULT_FAIL",
          payload: error.response.data.message || error.response.data.error,
        });
      }
    };
    fetchFaultCounts();
    const fetchFSitewiseTickets = async () => {
      try {
        dispatch({ type: "FETCH_SITEWISE_TICKET_REQUEST" });
        const response = await axios.get("/api/v1/servicetickets/siteresolve", {
          headers: { Authorization: `Bearer ${authtoken}` },
        });

        dispatch({
          type: "FETCH_SITEWISE_TICKET_SUCCESS",
          payload: response.data.data,
        });
      } catch (error) {
        dispatch({
          type: "FETCH_SITEWISE_TICKET_SUCCESS",
          payload: error.response.data.message || error.response.data.error,
        });
      }
    };
    fetchFSitewiseTickets();
  }, [authtoken]);

  // Ensure serviceticketsfaulycount is not empty before accessing
  const faultLabels = Object.keys(serviceticketsfaulycount || {});
  const faultValues = faultLabels.map(
    (fault) => serviceticketsfaulycount[fault]
  );

  const siteLabels = serviceticketssitewise?.map((site) => site.site_id) || [];
  const siteData =
    serviceticketssitewise?.map((site) => site.total_tickets) || [];

  const siteTicketData = serviceticketssitewise?.reduce((acc, site) => {
    acc[site.site_id] = {
      open: site.unresolved_tickets,
      resolved: site.resolved_tickets,
    };
    return acc;
  }, {});

  // const faultColors = [
  //   "#FF6384",
  //   "#36A2EB",
  //   "#FFCE56",
  //   "#4BC0C0",
  //   "#9966FF",
  //   "#FF9F40",
  //   "#C9CBCF",
  //   "#FF7E79",
  //   "#B39DDB",
  //   "#F06292",
  //   "#E91E63",
  //   "#9C27B0",
  //   "#673AB7",
  //   "#3F51B5",
  //   "#2196F3",
  //   "#03A9F4",
  //   "#00BCD4",
  //   "#4CAF50",
  //   "#8BC34A",
  //   "#CDDC39",
  // ];

  // const siteColors = [
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
  // ];

  const faultColors = [
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

  const siteColors = [
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
      <CCol xs={12} md={6}>
        <CCard className="mb-4 shadow">
          <CCardHeader>
            <h5 className="text-center">All Sitewise Ticket Status</h5>
          </CCardHeader>
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "350px" }}
          >
            {loading ? (
              <LoadingSpinner />
            ) : error ? (
              <div className="text-center text-danger py-4">{error}</div>
            ) : siteLabels?.length > 0 ? (
              <CChartPie
                style={{ height: "350px" }}
                data={{
                  labels: siteLabels.map(
                    (site) =>
                      `${site.replace(/_/g, " ")} | Open: ${
                        siteTicketData[site].open
                      } | Resolved: ${siteTicketData[site].resolved}`
                  ),
                  datasets: [
                    {
                      data: siteData,
                      backgroundColor: siteColors.slice(0, siteLabels.length),
                      hoverOffset: 8,
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: {
                      display: false, // ✅ This hides the legend
                    },
                    tooltip: {
                      callbacks: {
                        label: function (tooltipItem) {
                          const site = siteLabels[tooltipItem.dataIndex];
                          return `📍 ${site.replace(/_/g, " ")} | 🛠 Open: ${
                            siteTicketData[site].open
                          } | ✅ Resolved: ${siteTicketData[site].resolved}`;
                        },
                      },
                    },
                  },
                }}
              />
            ) : (
              <div className="text-center py-4">No data available</div>
            )}
          </div>
        </CCard>
      </CCol>

      <CCol xs={12} md={6}>
        <CCard className="mb-4 shadow">
          <CCardHeader>
            <h5 className="text-center">All Site Fault Occurrences</h5>
          </CCardHeader>
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "350px" }}
          >
            {loading ? (
              <LoadingSpinner />
            ) : error ? (
              error
            ) : Object.keys(serviceticketsfaulycount || {}).length === 0 ? (
              "No data available"
            ) : (
              <CChartPie
                style={{ height: "350px" }}
                data={{
                  labels: faultLabels,
                  datasets: [
                    {
                      data: faultValues,
                      backgroundColor: faultColors.slice(0, faultLabels.length),
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: {
                      display: false, // ✅ This hides the legend
                    },
                  },
                }}
              />
            )}
          </div>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default PieChart;
