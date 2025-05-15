import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import { useSelector } from "react-redux";
import { CChartBar, CChartLine } from "@coreui/react-chartjs";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormSelect,
  CRow,
} from "@coreui/react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_SERVICE_TICKET_COUNT_REQUEST":
      return {
        ...state,
        fetchserviceticketcountloading: true,
        serviceticketcount: [],
      };
    case "FETCH_SERVICE_TICKET_COUNT_SUCCESS":
      return {
        ...state,
        serviceticketcount: action.payload,
        fetchserviceticketcountloading: false,
      };
    case "FETCH_SERVICE_TICKET_COUNT_FAIL":
      return {
        ...state,
        fetchserviceticketcountloading: false,
        serviceticketcount: [],
        error: action.payload,
      };
    default:
      return state;
  }
};

const BarGraph = () => {
  const [{ fetchserviceticketcountloading, serviceticketcount }, dispatch] =
    useReducer(reducer, {
      serviceticketcount: [],
      fetchserviceticketcountloading: true,
      error: "",
    });

  const [year, setYear] = useState(new Date().getFullYear());
  const authtoken = useSelector((state) => state.authtoken);
  const [chartType, setChartType] = useState("bar");
  const [siteId, setSiteId] = useState("");

  useEffect(() => {
    const fetchServiceticketCount = async () => {
      try {
        dispatch({ type: "FETCH_SERVICE_TICKET_COUNT_REQUEST" });
        const response = await axios.get(
          `/api/v1/servicetickets/service-ticket-count/${year}`,
          { headers: { Authorization: `Bearer ${authtoken}` } }
        );
        dispatch({
          type: "FETCH_SERVICE_TICKET_COUNT_SUCCESS",
          payload: response.data.data,
        });
      } catch (error) {
        dispatch({
          type: "FETCH_SERVICE_TICKET_COUNT_FAIL",
          payload: error.response?.data?.message || error.response?.data?.error,
        });
      }
    };

    fetchServiceticketCount();
  }, [authtoken, year]);

  const monthNames = [
    "",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Get unique sites
  const uniqueSites = Array.from(
    new Set(serviceticketcount.map((item) => item.siteid))
  );

  const chartLabels = monthNames.slice(1); // Jan to Dec
  let datasets = [];

  if (siteId) {
    const siteData = Array(12).fill(0); // Initialize an array with 12 months of 0s
    serviceticketcount.forEach((item) => {
      if (item.siteid === siteId && item.month >= 1 && item.month <= 12) {
        siteData[item.month - 1] += item.count; // Add the count to the correct month
      }
    });
    console.log(siteData);

    datasets = [
      {
        label: siteId
          .replace(/_/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase()), // Format the site name
        data: siteData,
        backgroundColor: "#4e73df",
        borderColor: "#4e73df",
        fill: false,
        tension: 0.4,
      },
    ];
  } else {
    // All sites
    const siteMonthlyData = {};
    uniqueSites.forEach((site) => {
      siteMonthlyData[site] = Array(12).fill(0); // Initialize an array for each site with 12 months of 0s
    });

    serviceticketcount.forEach((item) => {
      if (item.month >= 1 && item.month <= 12) {
        siteMonthlyData[item.siteid][item.month - 1] += item.count; // Add the count for each site and month
      }
    });

    datasets = Object.entries(siteMonthlyData).map(([site, data], i) => {
      const color = `hsl(${(i * 40) % 360}, 70%, 50%)`; // Unique color for each site
      return {
        label: site.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()), // Format the site name
        data,
        backgroundColor: color,
        borderColor: color,
        fill: false,
        tension: 0.4,
      };
    });
  }

  // Year options for dropdown
  const yearOptions = Array.from({ length: 5 }, (_, i) => {
    const y = new Date().getFullYear() - i;
    return { label: y, value: y };
  });

  // Export data to Excel
  const exportToExcel = () => {
    if (serviceticketcount.length === 0) {
      toast.error("No data available to export.");
      return;
    }

    const rows = monthNames.slice(1).map((month) => ({ Month: month }));

    serviceticketcount.forEach(({ siteid, month, count }) => {
      if (month >= 1 && month <= 12) {
        rows[month - 1][siteid] = count;
      }
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Service Tickets");
    XLSX.writeFile(workbook, `Service_Tickets_${year}.xlsx`);
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        mode: "index", // Show tooltip for the bar you're hovering over
        intersect: false, // Make sure the tooltip only appears for the hovered bar
        callbacks: {
          label: function (tooltipItem) {
            const siteName = tooltipItem.dataset.label; // Get the site name (dataset label)
            const count = tooltipItem.raw; // Get the count for this specific bar

            return `${siteName}: ${count}`;
          },
        },
      },
      legend: {
        position: "bottom",
      },
    },
    scales: {
      x: {
        stacked: false, // Ensure bars are side by side, not stacked
      },
      y: {
        ticks: {
          stepSize: 1, // This ensures y-axis increases by whole numbers
          beginAtZero: true,
          precision: 0, // Prevent decimal points
        },
      },
    },
  };

  return (
    <CRow>
      <CCol xs={12}></CCol>
      <CCol xs={12}>
        <CCard className="my-2">
          <CCardHeader>
            {" "}
            <h5 className="text-center">Month and Year wise Service Tickets</h5>
          </CCardHeader>
          <CCardBody>
            <CRow className="mb-4">
              <CCol xs={12} md={2} lg={2}>
                <CFormSelect
                  label="Select Year"
                  value={year}
                  onChange={(e) => setYear(parseInt(e.target.value))}
                >
                  {yearOptions.map((y) => (
                    <option key={y.value} value={y.value}>
                      {y.label}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>

              <CCol xs={12} md={2} lg={2}>
                <CFormSelect
                  label="Chart Type"
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value)}
                >
                  <option value="bar">Bar</option>
                  <option value="line">Line</option>
                </CFormSelect>
              </CCol>

              <CCol xs={12} md={2} lg={2}>
                <CFormSelect
                  label="Select Site"
                  value={siteId}
                  onChange={(e) => setSiteId(e.target.value)}
                >
                  <option value="">All Sites</option>
                  {uniqueSites.map((site) => (
                    <option key={site} value={site}>
                      {site
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (c) => c.toUpperCase())}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>

              <CCol xs={12} md={2} lg={2}>
                <CButton size="sm" color="success" onClick={exportToExcel}>
                  Export
                </CButton>
              </CCol>
            </CRow>

            {fetchserviceticketcountloading ? (
              <LoadingSpinner />
            ) : serviceticketcount.length === 0 ? (
              <div className="text-center">No data available</div>
            ) : (
              <>
                {chartType === "bar" ? (
                  <CChartBar
                    style={{ maxHeight: "300px" }}
                    data={{
                      labels: chartLabels,
                      datasets: datasets,
                    }}
                    options={options}
                  />
                ) : (
                  <CChartLine
                    data={{
                      labels: chartLabels,
                      datasets: datasets,
                    }}
                    options={options}
                  />
                )}
              </>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default BarGraph;
