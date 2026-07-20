import axios from "axios";
import React, { useEffect, useMemo, useReducer, useState } from "react";
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
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "", rows: [] };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, rows: action.payload };
    case "FETCH_FAIL":
      return {
        ...state,
        loading: false,
        rows: [],
        error: action.payload,
      };
    default:
      return state;
  }
};

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const fmtSite = (id = "") =>
  id.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const BarGraph = () => {
  const [{ loading, rows, error }, dispatch] = useReducer(reducer, {
    rows: [],
    loading: true,
    error: "",
  });

  const [year, setYear] = useState(new Date().getFullYear());
  const [chartType, setChartType] = useState("bar");
  const [siteId, setSiteId] = useState("");

  useEffect(() => {
    const fetchCount = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const response = await axios.get(
          `/api/v1/servicetickets/service-ticket-count/${year}`,
          { withCredentials: true },
        );
        dispatch({
          type: "FETCH_SUCCESS",
          payload: response.data.data || [],
        });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload:
            err.response?.data?.message ||
            err.response?.data?.error ||
            "No data",
        });
      }
    };
    fetchCount();
  }, [year]);

  const uniqueSites = useMemo(
    () => Array.from(new Set(rows.map((r) => r.siteid))).sort(),
    [rows],
  );

  // one simple series: total (or selected site) tickets per month
  const monthlyTotals = useMemo(() => {
    const totals = Array(12).fill(0);
    rows.forEach((item) => {
      if (item.month < 1 || item.month > 12) return;
      if (siteId && item.siteid !== siteId) return;
      totals[item.month - 1] += item.count;
    });
    return totals;
  }, [rows, siteId]);

  const yearOptions = Array.from({ length: 5 }, (_, i) => {
    const y = new Date().getFullYear() - i;
    return { label: y, value: y };
  });

  const exportToExcel = () => {
    if (rows.length === 0) {
      toast.error("No data available to export.");
      return;
    }

    const sheetRows = monthNames.map((month, i) => ({
      Month: month,
      Tickets: monthlyTotals[i],
    }));

    const worksheet = XLSX.utils.json_to_sheet(sheetRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Monthly Tickets");
    XLSX.writeFile(
      workbook,
      `Service_Tickets_${siteId || "All"}_${year}.xlsx`,
    );
  };

  const Chart = chartType === "line" ? CChartLine : CChartBar;
  const label = siteId ? fmtSite(siteId) : "All Sites";

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="my-2 shadow-sm">
          <CCardHeader>
            <h6 className="mb-0">Monthly Tickets Raised — {year}</h6>
          </CCardHeader>
          <CCardBody>
            <CRow className="mb-3 g-2 align-items-end">
              <CCol xs={6} md={2}>
                <CFormSelect
                  label="Year"
                  value={year}
                  onChange={(e) => setYear(parseInt(e.target.value, 10))}
                >
                  {yearOptions.map((y) => (
                    <option key={y.value} value={y.value}>
                      {y.label}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol xs={6} md={2}>
                <CFormSelect
                  label="Chart"
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value)}
                >
                  <option value="bar">Bar</option>
                  <option value="line">Line</option>
                </CFormSelect>
              </CCol>
              <CCol xs={8} md={3}>
                <CFormSelect
                  label="Site"
                  value={siteId}
                  onChange={(e) => setSiteId(e.target.value)}
                >
                  <option value="">All Sites</option>
                  {uniqueSites.map((site) => (
                    <option key={site} value={site}>
                      {fmtSite(site)}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol xs={4} md={2}>
                <CButton size="sm" color="success" onClick={exportToExcel}>
                  Export
                </CButton>
              </CCol>
            </CRow>

            {loading ? (
              <LoadingSpinner />
            ) : error && rows.length === 0 ? (
              <div className="text-center text-muted py-4">{error}</div>
            ) : (
              <div
                className="d-flex justify-content-center align-items-center w-100"
                style={{ height: 320 }}
              >
                <div style={{ width: "100%", height: "100%" }}>
                  <Chart
                    style={{ height: "100%", width: "100%" }}
                    data={{
                      labels: monthNames,
                      datasets: [
                        {
                          label,
                          data: monthlyTotals,
                          backgroundColor: "#38bdf8",
                          borderColor: "#38bdf8",
                          fill: false,
                          tension: 0.25,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: true,
                          position: "bottom",
                          labels: { color: "#e2e8f0", boxWidth: 12 },
                        },
                      },
                      scales: {
                        x: {
                          grid: { display: false },
                          ticks: { color: "#94a3b8" },
                        },
                        y: {
                          beginAtZero: true,
                          ticks: { precision: 0, color: "#94a3b8" },
                          grid: { color: "rgba(148, 163, 184, 0.18)" },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default BarGraph;
