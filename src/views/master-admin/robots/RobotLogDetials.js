import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import { useSelector } from "react-redux";
import { CChartBar, CChartLine } from "@coreui/react-chartjs";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormSelect,
  CRow,
  CFormInput,
  CFormLabel,
  CButton,
} from "@coreui/react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import * as XLSX from "xlsx";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "", data: {} };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, data: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, data: {}, error: action.payload };
    default:
      return state;
  }
};

// Color palette for charts
const CHART_COLORS = {
  blue: "#4e73df",
  lightBlue: "#36a2eb",
  green: "#1cc88a",
  orange: "#f6c23e",
  red: "#e74a3b",
  purple: "#6f42c1",
  teal: "#20c9a6",
  gray: "#858796",
};

const generateRandomColor = () => {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
};

const RobotLogDetails = () => {
  const [{ loading, data, error }, dispatch] = useReducer(reducer, {
    loading: true,
    data: {},
    error: "",
  });
  const authtoken = useSelector((state) => state.authtoken);
  const [chartType, setChartType] = useState("bar");
  const [siteId, setSiteId] = useState("all");
  const [siteOptions, setSiteOptions] = useState([]);
  const [robotNo, setRobotNo] = useState("");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [isFetchingSites, setIsFetchingSites] = useState(false);
  useEffect(() => {
    if (!authtoken) return;

    let isMounted = true; // avoid state updates after unmount

    const fetchSitesAndData = async () => {
      try {
        setIsFetchingSites(true);

        // 1) Fetch sites
        const sitesResponse = await axios.post(
          "/api/v1/sites/get-sites",
          { pg: 1, limit: 1000 },
          { headers: { Authorization: `Bearer ${authtoken}` } }
        );

        if (!isMounted) return;

        let siteIds = [];
        if (sitesResponse.data.success) {
          const sites = sitesResponse.data.data || [];
          siteIds = sites.map((site) => site.site_id);
          setSiteOptions(siteIds);
          if (!siteId) setSiteId("all");
        }

        setIsFetchingSites(false);

        // 2) Fetch uplink data **only if sites fetched successfully**
        dispatch({ type: "FETCH_REQUEST" });

        const uplinkResponse = await axios.get(
          `/api/v1/debuglogs/uplink-summary-count/${
            siteId || "all"
          }/${startDate}/${endDate}`,
          { headers: { Authorization: `Bearer ${authtoken}` } }
        );

        if (!isMounted) return;

        const transformed = {};

        if (siteId === "all" || !siteId) {
          const allSitesData = uplinkResponse.data.data || {};
          const combinedTotals = {};
          for (const siteKey in allSitesData) {
            const siteData = allSitesData[siteKey];
            if (!siteData) continue;
            if (siteData.robots) {
              for (const robot_no in siteData.robots) {
                const robotMetrics = siteData.robots[robot_no];
                for (const metric in robotMetrics) {
                  if (metric === "total") continue;
                  combinedTotals[metric] =
                    (combinedTotals[metric] || 0) + robotMetrics[metric];
                }
              }
            }
            if (siteData.siteTotals) {
              for (const metric in siteData.siteTotals) {
                if (metric === "total") continue;
                combinedTotals[metric] =
                  (combinedTotals[metric] || 0) + siteData.siteTotals[metric];
              }
            }
          }
          combinedTotals.total = Object.values(combinedTotals).reduce(
            (a, b) => a + b,
            0
          );
          transformed["all"] = combinedTotals;
        } else {
          const siteData = uplinkResponse.data.data?.[siteId];
          if (siteData) {
            transformed[siteId] = {};
            for (const robot_no in siteData.robots) {
              transformed[siteId][robot_no] = {
                ...siteData.robots[robot_no],
                total: siteData.robots[robot_no].total,
              };
            }
            transformed[siteId]["siteTotals"] = siteData.siteTotals;
          }
        }

        dispatch({ type: "FETCH_SUCCESS", payload: transformed });
        setRobotNo("");
      } catch (err) {
        if (!isMounted) return;
        setIsFetchingSites(false);
        dispatch({
          type: "FETCH_FAIL",
          payload: err.response?.data?.message || err.message,
        });
        console.error(err);
      }
    };

    fetchSitesAndData();

    return () => {
      isMounted = false; // cleanup flag to prevent setting state after unmount
    };
  }, [authtoken, siteId, startDate, endDate]);

  const exportEntirePayloadToExcel = () => {
    if (!data || Object.keys(data).length === 0) {
      alert("No data to export.");
      return;
    }

    const flattenedData = [];

    for (const site in data) {
      const siteData = data[site];

      for (const robot in siteData) {
        const entry = {
          Robot: robot,
          ...siteData[robot],
        };
        delete entry.total; // optional: remove "total" if not needed per row
        flattenedData.push(entry);
      }
    }

    const worksheet = XLSX.utils.json_to_sheet(flattenedData, {
      origin: "A4", // Start at row 4 to leave room for header info
    });

    // Add custom heading rows (start date, end date, site ID)
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [
        ["Start Date:", startDate],
        ["End Date:", endDate],
        ["Site ID:", siteId],
      ],
      { origin: "A1" }
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Uplink Summary");

    const sanitizedSite = siteId.replace(/_/g, "-");
    const fileName = `Uplink_Summary_${sanitizedSite}_${startDate}_to_${endDate}.xlsx`;

    XLSX.writeFile(workbook, fileName);
  };

  const getSiteData = () => {
    if (!siteId || !data[siteId]) return {};
    if (siteId === "all") return data["all"] || {};
    return data[siteId]["siteTotals"] || {};
  };
  const siteData = getSiteData();
  const siteLabels = Object.keys(siteData).filter((k) => k !== "total");

  const getRobotData = () => {
    if (
      !siteId ||
      siteId === "all" ||
      !data[siteId] ||
      Object.keys(data[siteId]).length === 0
    )
      return {};
    if (robotNo) return data[siteId][robotNo] || {};
    const allRobots = Object.keys(data[siteId]).filter(
      (key) => key !== "siteTotals"
    );
    const combined = {};
    for (const robot of allRobots) {
      const robotMetrics = data[siteId][robot] || {};
      for (const metric in robotMetrics) {
        combined[metric] =
          (combined[metric] || 0) + (robotMetrics[metric] || 0);
      }
    }
    return combined;
  };
  const robotData = getRobotData();
  const robotLabels = Object.keys(robotData).filter((k) => k !== "total");

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
          },
        },
      },
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 12,
          padding: 20,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1, precision: 0 },
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  // Generate distinct colors for each bar
  const getBarColors = (labels) => {
    const colors = [
      CHART_COLORS.blue,
      CHART_COLORS.green,
      CHART_COLORS.orange,
      CHART_COLORS.red,
      CHART_COLORS.purple,
      CHART_COLORS.teal,
      CHART_COLORS.gray,
      CHART_COLORS.lightBlue,
    ];

    // If we have more labels than predefined colors, generate random ones
    if (labels.length > colors.length) {
      const additionalColors = Array.from(
        { length: labels.length - colors.length },
        () => generateRandomColor()
      );
      return [...colors, ...additionalColors];
    }

    return colors.slice(0, labels.length);
  };

  const renderChart = (labels, dataValues, title, isRobotChart = false) => {
    const backgroundColors = getBarColors(labels);

    const chartData = {
      labels: labels,
      datasets: [
        {
          label: title,
          data: dataValues,
          backgroundColor:
            chartType === "bar" ? backgroundColors : CHART_COLORS.blue,
          borderColor: isRobotChart
            ? CHART_COLORS.lightBlue
            : CHART_COLORS.blue,
          borderWidth: 2,
          fill: false,
          tension: 0.4,
        },
      ],
    };

    return chartType === "bar" ? (
      <CChartBar
        data={chartData}
        options={chartOptions}
        style={{ height: "400px", width: "100%" }}
      />
    ) : (
      <CChartLine
        data={chartData}
        options={chartOptions}
        style={{ height: "400px", width: "100%" }}
      />
    );
  };

  const renderTable = (labels, dataObj) => {
    return (
      <table
        className="table table-bordered table-sm"
        style={{ fontSize: "0.85rem" }}
      >
        <thead>
          <tr>
            <th>Topic</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {labels.map((label) => (
            <tr key={label}>
              <td>{label}</td>
              <td>{dataObj[label]}</td>
            </tr>
          ))}
          {dataObj.total !== undefined && (
            <tr>
              <td>
                <strong>Total</strong>
              </td>
              <td>
                <strong>{dataObj.total}</strong>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    );
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader>
            <h5 className="text-center">Uplink Summary - Topic Wise</h5>
          </CCardHeader>
          <CCardBody>
            <CRow className="mb-3">
              <CCol className="d-flex justify-content-end">
                <CButton
                  color="primary"
                  className="btn-sm"
                  onClick={exportEntirePayloadToExcel}
                  disabled={loading}
                >
                  Export
                </CButton>
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={2}>
                <CFormSelect
                  label="Chart Type"
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value)}
                >
                  <option value="bar">Bar Chart</option>
                  <option value="line">Line Chart</option>
                </CFormSelect>
              </CCol>

              <CCol md={3}>
                <CFormSelect
                  label="Select Site"
                  value={siteId}
                  onChange={(e) => setSiteId(e.target.value)}
                  disabled={isFetchingSites}
                >
                  <option value="all">-- All Sites --</option>
                  {siteOptions.map((site) => (
                    <option key={site} value={site}>
                      {site
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (c) => c.toUpperCase())}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>

              <CCol md={2}>
                <CFormLabel>Start Date</CFormLabel>
                <CFormInput
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  disabled={loading}
                  style={{ width: "100%" }}
                />
              </CCol>

              <CCol md={2}>
                <CFormLabel>End Date</CFormLabel>
                <CFormInput
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  disabled={loading}
                  style={{ width: "100%" }}
                />
              </CCol>
            </CRow>

            {loading ? (
              <div className="text-center py-5">
                <LoadingSpinner />
                <p className="mt-2">Loading data...</p>
              </div>
            ) : error ? (
              <div className="alert alert-danger text-center">{error}</div>
            ) : !loading && !error && Object.keys(data).length === 0 ? (
              <div className="alert alert-info text-center">
                No data available for the selected filters
              </div>
            ) : (
              <>
                {/* only render charts/tables when siteLabels are valid */}
                {siteLabels.length > 0 && (
                  <>
                    {/* Site-level chart + table */}
                    <CRow>
                      <CCol md={7}>
                        {renderChart(
                          siteLabels,
                          siteLabels.map((key) => siteData[key] || 0),
                          siteId === "all"
                            ? "All Sites Combined"
                            : `Site: ${siteId.replace(/_/g, " ")}`
                        )}
                      </CCol>
                      <CCol
                        md={5}
                        style={{ overflowY: "auto", maxHeight: "400px" }}
                      >
                        {renderTable(siteLabels, siteData)}
                      </CCol>
                    </CRow>
                  </>
                )}

                {/* Robot-level section */}
                {siteId !== "all" && data[siteId] && (
                  <>
                    <hr />
                    <h5 className="text-center mt-4">
                      Robot Details for Site: {siteId.replace(/_/g, " ")}
                    </h5>

                    <CRow className="mb-3 justify-content-center">
                      <CCol md={4}>
                        <CFormSelect
                          label="Select Robot"
                          value={robotNo}
                          onChange={(e) => setRobotNo(e.target.value)}
                          disabled={loading}
                        >
                          <option value="">-- All Robots --</option>
                          {Object.keys(data[siteId])
                            .filter((key) => key !== "siteTotals")
                            .map((robot) => (
                              <option key={robot} value={robot}>
                                {robot}
                              </option>
                            ))}
                        </CFormSelect>
                      </CCol>
                    </CRow>

                    <CRow>
                      <CCol md={12}>
                        {renderChart(
                          robotLabels,
                          robotLabels.map((key) => robotData[key] || 0),
                          robotNo
                            ? `Robot ${robotNo}`
                            : `All Robots Combined at Site: ${siteId.replace(
                                /_/g,
                                " "
                              )}`,
                          true
                        )}
                      </CCol>
                    </CRow>
                  </>
                )}
              </>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default RobotLogDetails;
