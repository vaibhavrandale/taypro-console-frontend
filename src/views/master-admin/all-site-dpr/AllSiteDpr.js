import React, { useEffect, useReducer, useState } from "react";
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CRow,
  CCol,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CFormSelect,
  CButton,
  CModalFooter,
  CBadge,
} from "@coreui/react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";
import * as XLSX from "xlsx";
import CIcon from "@coreui/icons-react";
import { cilX } from "@coreui/icons";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_DPR_REQUEST":
      return { ...state, loadingDprs: true, error: "" };
    case "FETCH_DPR_SUCCESS":
      return { ...state, loadingDprs: false, dprs: action.payload };
    case "FETCH_DPR_FAIL":
      return { ...state, loadingDprs: false, error: action.payload };
    case "FETCH_SITEID_REQUEST":
      return { ...state, loadingSiteIds: true, sitesError: "" };
    case "FETCH_SITEID_SUCCESS":
      return { ...state, loadingSiteIds: false, siteIds: action.payload };
    case "FETCH_SITEID_FAIL":
      return { ...state, loadingSiteIds: false, sitesError: action.payload };
    default:
      return state;
  }
};

const AllSiteDpr = () => {
  const [{ dprs, loadingDprs, loadingSiteIds, siteIds }, dispatch] = useReducer(
    reducer,
    {
      dprs: [],
      loadingDprs: true,
      error: "",
      siteIds: [],
      loadingSiteIds: true,
      sitesError: "",
    },
  );

  const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);

  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [site_id, setSiteId] = useState("all");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState(null);
  const [formData, setFormData] = useState({});
  let adminroute = "";
  if (userInfo.role === "Master Admin") adminroute = "master-admin";
  else if (userInfo.role === "Service Admin") adminroute = "service-admin";
  else if (userInfo.role === "Project Admin") adminroute = "project-admin";

  const fetchDprMonthWise = async () => {
    dispatch({ type: "FETCH_DPR_REQUEST" });
    try {
      const payload = { month, year, siteId: site_id };
      const result = await axios.post(
        "/api/v1/techniciandprs/monthly",
        payload,
        { headers: { Authorization: `Bearer ${authtoken}` } },
      );
      dispatch({ type: "FETCH_DPR_SUCCESS", payload: result.data.data });
    } catch (error) {
      dispatch({
        type: "FETCH_DPR_FAIL",
        payload: error.response?.data?.error || "Failed to fetch DPR",
      });
      toast.error(error.response?.data?.error || "Failed to fetch DPR");
    }
  };

  useEffect(() => {
    fetchDprMonthWise();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, year, site_id, authtoken]);

  useEffect(() => {
    const fetchSiteIds = async () => {
      dispatch({ type: "FETCH_SITEID_REQUEST" });
      try {
        const result = await axios.get(`/api/v1/sites`, {
          headers: { Authorization: `Bearer ${authtoken}` },
        });

        dispatch({ type: "FETCH_SITEID_SUCCESS", payload: result.data.data });
      } catch (error) {
        dispatch({
          type: "FETCH_SITEID_FAIL",
          payload: error.response?.data?.error || error.response?.data?.message,
        });
        toast.error(
          error.response?.data?.error || error.response?.data?.message,
        );
      }
    };

    fetchSiteIds();
  }, [authtoken]);

  const openModal = (dpr) => {
    setSelectedInventory(dpr);
    setFormData(dpr);
    setModalVisible(true);
  };

  const getWeekOfMonth = (dateObj) => {
    return Math.ceil(dateObj.getDate() / 7);
  };

  // Process the data to create proper headers with weeks inserted after every 7 days
  // const processDprData = () => {
  //   if (!dprs.length) return { headers: [], weekHeaders: [] };

  //   // Extract all dates and weeks from the first site (all sites should have same structure)
  //   const dateEntries = [];
  //   const weekEntries = [];

  //   dprs[0].month_wise_data.forEach((entry) => {
  //     if (entry.date) {
  //       dateEntries.push({
  //         key: entry.date,
  //         type: "date",
  //         value: entry.date,
  //         // Parse date for sorting
  //         dateObj: new Date(
  //           parseInt(entry.date.split("-")[2]),
  //           parseInt(entry.date.split("-")[1]) - 1,
  //           parseInt(entry.date.split("-")[0])
  //         ),
  //       });
  //     } else if (entry.week) {
  //       weekEntries.push({
  //         key: entry.week,
  //         type: "week",
  //         value: entry.week,
  //         weekNum: parseInt(entry.week.replace("Week ", "")),
  //       });
  //     }
  //   });

  //   // Sort dates chronologically
  //   dateEntries.sort((a, b) => a.dateObj - b.dateObj);

  //   // Sort weeks numerically
  //   weekEntries.sort((a, b) => a.weekNum - b.weekNum);

  //   // Insert weeks after every 7 days
  //   const headers = [];
  //   const weekHeaders = [];

  //   let dayCount = 0;
  //   let weekIndex = 0;

  //   dateEntries.forEach((date, index) => {
  //     headers.push(date);
  //     dayCount++;

  //     // After 7 days, insert the corresponding week summary
  //     if (dayCount === 7 && weekIndex < weekEntries.length) {
  //       const weekEntry = weekEntries[weekIndex];
  //       headers.push(weekEntry);

  //       // Add to week headers for the table
  //       weekHeaders.push({ week: weekEntry.value, span: 8 }); // 7 days + 1 week column

  //       dayCount = 0;
  //       weekIndex++;
  //     }
  //   });

  //   // Add any remaining weeks (if any)
  //   while (weekIndex < weekEntries.length) {
  //     const weekEntry = weekEntries[weekIndex];
  //     headers.push(weekEntry);
  //     weekHeaders.push({ week: weekEntry.value, span: 1 });
  //     weekIndex++;
  //   }

  //   return { headers, weekHeaders };
  // };

  const processDprData = () => {
    if (!dprs.length) return { headers: [] };

    const dateSet = new Set();

    dprs[0].month_wise_data.forEach((entry) => {
      if (entry.date) dateSet.add(entry.date);
    });

    const dates = Array.from(dateSet).map((d) => {
      const [dd, mm, yyyy] = d.split("-");
      const dateObj = new Date(yyyy, mm - 1, dd);

      return {
        key: d,
        type: "date",
        value: d,
        dateObj,
        week: getWeekOfMonth(dateObj),
      };
    });

    // Sort dates
    dates.sort((a, b) => a.dateObj - b.dateObj);

    const headers = [];
    let currentWeek = null;

    dates.forEach((d, index) => {
      headers.push(d);

      if (currentWeek === null) {
        currentWeek = d.week;
      }

      const next = dates[index + 1];

      // Insert week column when week changes OR last date
      if (!next || next.week !== currentWeek) {
        headers.push({
          key: `Week ${currentWeek}`,
          type: "week",
          value: `Week ${currentWeek}`,
        });
        currentWeek = next?.week;
      }
    });

    return { headers };
  };

  const { headers, weekHeaders } = processDprData();

  const exportToExcel = () => {
    if (!dprs.length) {
      toast.error("No data to export");
      return;
    }

    const metrics = [
      { label: "Robots Uptime", field: "robots_uptime" },
      { label: "Robots Availability", field: "robots_availability" },
      { label: "Due to Oxidation", field: "due_to_oxidation" },
      { label: "Due to Offline", field: "due_to_offline" },
      { label: "Battery issue", field: "due_to_battery_issue" },
      { label: "Due to Vegetation", field: "due_to_vegetation" },
      { label: "Due to Client", field: "due_to_client" },
      { label: "Due to Service", field: "due_to_service" },
      { label: "Due to Timer", field: "due_to_timer" },
      { label: "Due to Breakdown", field: "due_to_breakdown" },
      {
        label: "Material Unavailability",
        field: "due_to_material_unavailability",
      },
    ];

    // Create the header rows
    const headerRow1 = [
      "Sr No.",
      "Site Name",
      "Robots Details",
      "Robots Qty",
      ...headers.map((header) => header.value),
    ];

    // Create the data rows
    const dataRows = [];

    dprs.forEach((site, siteIndex) => {
      // Create a map of all entries for this site
      const entryMap = {};
      site.month_wise_data.forEach((entry) => {
        const key = entry.date || entry.week;
        metrics.forEach((metric) => {
          if (!entryMap[metric.field]) {
            entryMap[metric.field] = {};
          }
          entryMap[metric.field][key] = entry[metric.field];
        });
      });

      // Add rows for each metric
      metrics.forEach((metric, rowIndex) => {
        const rowData = [
          rowIndex === 0 ? siteIndex + 1 : "", // Sr No. (only in first row for this site)
          rowIndex === 0 ? site.site_id : "", // Site Name (only in first row for this site)
          metric.label,
          rowIndex === 0 ? site.total_robots : "", // Robots Qty (only in first row for this site)
          ...headers.map(
            (header) => entryMap[metric.field]?.[header.key] ?? "",
          ),
        ];
        dataRows.push(rowData);
      });
    });

    // Create the worksheet with proper structure
    const aoa = [
      ["DPR Report"],
      [], // Empty row
      headerRow1,
      ...dataRows,
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(aoa);

    // Style the main headers (row 3, which is index 2 in 0-based)
    for (let col = 0; col < headerRow1.length; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 2, c: col });
      if (!worksheet[cellAddress]) continue;

      worksheet[cellAddress].s = {
        font: { bold: true },
        fill: { fgColor: { rgb: "D3D3D3" } }, // Light gray background
      };
    }

    // Style week headers with yellow background
    headers.forEach((header, idx) => {
      if (header.type === "week") {
        const col = 4 + idx; // 4 fixed columns before date/week columns
        const cellAddress = XLSX.utils.encode_cell({ r: 2, c: col });
        if (worksheet[cellAddress]) {
          worksheet[cellAddress].s = {
            font: { bold: true },
            fill: { fgColor: { rgb: "FFFF00" } }, // Yellow background
          };
        }
      }
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DPR");
    XLSX.writeFile(workbook, `DPR_${month}_${year}.xlsx`);
  };

  const handleSiteNameChange = (e) => {
    const selectedSiteId = e.target.value;
    setSiteId(selectedSiteId);
  };

  return (
    <div className="p-2">
      <h2 className="text-center mb-4">Monthly DPR</h2>

      <div className="d-flex justify-content-end mb-3">
        <Link
          className="btn btn-sm btn-secondary m-1"
          to={`/${adminroute}/all-site-dpr/add-dpr`}
        >
          Add DPR
        </Link>
        <Link className="btn btn-sm btn-primary m-1" onClick={exportToExcel}>
          Export
        </Link>
      </div>

      <CRow className="justify-content-end mb-3">
        <CCol md={3} className="m-1">
          <div className="mb-3">
            <CFormSelect
              name="site_id"
              value={site_id}
              onChange={handleSiteNameChange}
            >
              {loadingSiteIds && <LoadingSpinner />}
              <option value="all">All</option>
              {siteIds?.length > 0 &&
                siteIds.map((item) => (
                  <option key={item.site_id} value={item.site_id}>
                    {item.site_id}
                  </option>
                ))}
            </CFormSelect>
          </div>
        </CCol>
        <CCol md={2} className="m-1">
          <CFormSelect
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
          >
            <option value="">Select Month</option>
            <option value={1}>January</option>
            <option value={2}>February</option>
            <option value={3}>March</option>
            <option value={4}>April</option>
            <option value={5}>May</option>
            <option value={6}>June</option>
            <option value={7}>July</option>
            <option value={8}>August</option>
            <option value={9}>September</option>
            <option value={10}>October</option>
            <option value={11}>November</option>
            <option value={12}>December</option>
          </CFormSelect>
        </CCol>

        <CCol md={2} className="m-1">
          <CFormSelect
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          >
            <option value="">Select Year</option>
            {Array.from({ length: 10 }, (_, i) => {
              const y = new Date().getFullYear() - i; // last 10 years
              return (
                <option key={y} value={y}>
                  {y}
                </option>
              );
            })}
          </CFormSelect>
        </CCol>
      </CRow>

      <div style={{}}>
        <CTable
          bordered
          hover
          responsive
          style={{ minWidth: "1200px", overflowY: "auto", maxHeight: "100vh" }}
        >
          <CTableHead color="secondary" style={{ minHeight: "200px" }}>
            <CTableRow>
              <CTableHeaderCell
                rowSpan={2}
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 5,
                  background: "#f8f9fa",
                }}
              >
                Sr.
              </CTableHeaderCell>

              <CTableHeaderCell
                rowSpan={2}
                style={{
                  position: "sticky",
                  top: 0,
                  left: 0,
                  zIndex: 6,
                  background: "#f8f9fa",
                  minWidth: "120px",
                }}
              >
                Site Name
              </CTableHeaderCell>

              <CTableHeaderCell
                rowSpan={2}
                style={{
                  position: "sticky",
                  top: 0,
                  left: 120,
                  zIndex: 6,
                  background: "#f8f9fa",
                  minWidth: "140px",
                }}
              >
                Robots Details
              </CTableHeaderCell>

              <CTableHeaderCell
                rowSpan={2}
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 5,
                  background: "#f8f9fa",
                }}
              >
                Robots Qty
              </CTableHeaderCell>

              {headers.map((header, idx) => (
                <CTableHeaderCell
                  key={idx}
                  style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 5,
                    background: header.type === "week" ? "#fff200" : "#f8f9fa",
                  }}
                >
                  {header.value}
                </CTableHeaderCell>
              ))}

              <CTableHeaderCell
                rowSpan={2}
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 5,
                  background: "#f8f9fa",
                }}
              >
                Action
              </CTableHeaderCell>
            </CTableRow>
          </CTableHead>

          <CTableBody>
            {loadingDprs ? (
              <CTableRow>
                <CTableDataCell colSpan={headers.length + 4}>
                  <LoadingSpinner />
                </CTableDataCell>
              </CTableRow>
            ) : dprs.length ? (
              dprs.map((site, siteIndex) => {
                const metrics = [
                  { label: "Robots Uptime", field: "robots_uptime" },
                  {
                    label: "Robots Availability",
                    field: "robots_availability",
                  },
                  { label: "Due to Oxidation", field: "due_to_oxidation" },
                  { label: "Due to Offline", field: "due_to_offline" },
                  { label: "Battery issue", field: "due_to_battery_issue" },
                  { label: "Due to Vegetation", field: "due_to_vegetation" },
                  { label: "Due to Client", field: "due_to_client" },
                  { label: "Due to Service", field: "due_to_service" },
                  { label: "Due to Timer", field: "due_to_timer" },
                  { label: "Due to Breakdown", field: "due_to_breakdown" },
                  {
                    label: "Material Unavailability",
                    field: "due_to_material_unavailability",
                  },
                ];

                const entryMap = {};
                site.month_wise_data.forEach((entry) => {
                  const key = entry.date || entry.week;
                  metrics.forEach((metric) => {
                    if (!entryMap[metric.field]) {
                      entryMap[metric.field] = {};
                    }
                    entryMap[metric.field][key] = entry[metric.field];
                  });
                });

                return metrics.map((row, rowIndex, arr) => (
                  <CTableRow
                    key={site.site_id + "-" + row.field}
                    style={
                      rowIndex === arr.length - 1
                        ? {
                            borderBottom: "3px solid white",
                          }
                        : {}
                    }
                  >
                    {rowIndex === 0 && (
                      <CTableDataCell rowSpan={arr.length}>
                        {siteIndex + 1}
                      </CTableDataCell>
                    )}
                    {rowIndex === 0 && (
                      <CTableDataCell
                        rowSpan={arr.length}
                        style={{
                          position: "sticky",
                          left: 0,
                          zIndex: 3,
                        }}
                      >
                        {site.site_id}
                      </CTableDataCell>
                    )}
                    <CTableDataCell
                      style={{
                        position: "sticky",
                        left: 140,
                        zIndex: 3,
                      }}
                    >
                      {row.label}
                    </CTableDataCell>
                    <CTableDataCell style={{ minWidth: "100px" }}>
                      {site.total_robots}
                    </CTableDataCell>
                    {headers.map((header) => (
                      <CTableDataCell
                        style={{ minWidth: "100px" }}
                        key={header.key}
                      >
                        {entryMap[row.field]?.[header.key] ?? ""}
                      </CTableDataCell>
                    ))}
                    {rowIndex === 0 && (
                      <CTableDataCell
                        rowSpan={arr.length}
                        style={{
                          minWidth: "100px",
                          textAlign: "center",
                          verticalAlign: "middle",
                        }}
                      >
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => openModal(site)}
                        >
                          View
                        </button>
                      </CTableDataCell>
                    )}
                  </CTableRow>
                ));
              })
            ) : (
              <CTableRow>
                <CTableDataCell colSpan={headers.length + 4}>
                  No Data Found
                </CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>
      </div>

      <CModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        size="lg"
      >
        <CModalHeader closeButton={false}>
          <CModalTitle>
            DPR Details -{" "}
            <CBadge color="success"> {selectedInventory?.site_id}</CBadge>
          </CModalTitle>
          <button
            type="button"
            className=" border-0 ms-auto py-0 px-1"
            onClick={() => setModalVisible(false)}
            style={{ background: "none" }}
          >
            <CIcon icon={cilX} size="lg" />
          </button>
        </CModalHeader>
        <CModalBody>
          {selectedInventory && (
            <div>
              <h5>Site Information</h5>
              <p>
                <strong>Site ID:</strong> {selectedInventory.site_id}
              </p>
              <p>
                <strong>Total Robots:</strong>{" "}
                <CBadge color="warning">
                  {selectedInventory.total_robots}
                </CBadge>
              </p>

              <h5 className="mt-4">Monthly Data</h5>
              <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                <CTable striped bordered>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Date/Week</CTableHeaderCell>
                      <CTableHeaderCell>Robots Uptime</CTableHeaderCell>
                      <CTableHeaderCell>Robots Availability</CTableHeaderCell>
                      <CTableHeaderCell>Due to Oxidation</CTableHeaderCell>
                      <CTableHeaderCell>Due to Offline</CTableHeaderCell>
                      <CTableHeaderCell>Battery Issue</CTableHeaderCell>
                      <CTableHeaderCell>Due to Vegetation</CTableHeaderCell>
                      <CTableHeaderCell>Due to Client</CTableHeaderCell>
                      <CTableHeaderCell>Due to Service</CTableHeaderCell>
                      <CTableHeaderCell>Due to Timer</CTableHeaderCell>
                      <CTableHeaderCell>Due to Breakdown</CTableHeaderCell>
                      <CTableHeaderCell>
                        Material Unavailability
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {selectedInventory.month_wise_data.map((entry, index) => (
                      <CTableRow key={index}>
                        <CTableDataCell
                          style={
                            entry.week ? { backgroundColor: "#dbd67aff" } : {}
                          }
                        >
                          {entry.date || entry.week}
                        </CTableDataCell>
                        <CTableDataCell>{entry.robots_uptime}</CTableDataCell>
                        <CTableDataCell>
                          {entry.robots_availability}
                        </CTableDataCell>
                        <CTableDataCell>
                          {entry.due_to_oxidation}
                        </CTableDataCell>
                        <CTableDataCell>{entry.due_to_offline}</CTableDataCell>
                        <CTableDataCell>
                          {entry.due_to_battery_issue}
                        </CTableDataCell>
                        <CTableDataCell>
                          {entry.due_to_vegetation}
                        </CTableDataCell>
                        <CTableDataCell>{entry.due_to_client}</CTableDataCell>
                        <CTableDataCell>{entry.due_to_service}</CTableDataCell>
                        <CTableDataCell>{entry.due_to_timer}</CTableDataCell>
                        <CTableDataCell>
                          {entry.due_to_breakdown}
                        </CTableDataCell>
                        <CTableDataCell>
                          {entry.due_to_material_unavailability}
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              </div>
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton
            size="sm"
            color="secondary"
            onClick={() => setModalVisible(false)}
          >
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default AllSiteDpr;
