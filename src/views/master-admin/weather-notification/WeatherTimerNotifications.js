import React, { useEffect, useReducer, useState } from "react";
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormInput,
  CFormSelect,
  CRow,
  CCol,
  CButton,
} from "@coreui/react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import axios from "axios";
import LoadingSpinner from "../../../components/LoadingSpinner";
import * as XLSX from "xlsx";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SITES_SUCCESS":
      return { ...state, loading: false, sites: action.payload, error: "" };
    case "FETCH_TIMER_LOGS_SUCCESS":
      return { ...state, loading: false, timerLogs: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const WeatherTimerNotifications = () => {
  const [{ loading, timerLogs, sites, error }, dispatch] = useReducer(reducer, {
    timerLogs: [],
    sites: [],
    loading: false,
    error: "",
  });

  const authtoken = useSelector((state) => state.authtoken);
  const [selectedSite, setSelectedSite] = useState("");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    const fetchSites = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const response = await axios.post(
          "/api/v1/sites/get-sites",
          { pg: 1, limit: 1000 },
          { headers: { Authorization: `Bearer ${authtoken}` } }
        );

        if (response.data.success) {
          const sites = response.data.data || [];
          dispatch({
            type: "FETCH_SITES_SUCCESS",
            payload: sites.map((site) => site.site_id),
          });
        } else {
          throw new Error("Failed to fetch sites");
        }
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: err.response?.data?.message || err.message,
        });
        toast.error(err.response?.data?.message || err.message);
      }
    };

    if (authtoken) fetchSites();
  }, [authtoken]);

  useEffect(() => {
    if (!selectedSite) return;

    const fetchTimerLogs = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const response = await axios.get(
          `/api/v1/weathertimerupdatenotification/get-weather-timer-update-notification/${selectedSite}/${startDate}/${endDate}`,
          {
            headers: {
              Authorization: `Bearer ${authtoken}`,
            },
          }
        );
        dispatch({
          type: "FETCH_TIMER_LOGS_SUCCESS",
          payload: response.data.data,
        });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload:
            error.response?.data?.error ||
            error.response?.data?.message ||
            error.message,
        });
        toast.error(
          error.response?.data?.error ||
            error.response?.data?.message ||
            error.message
        );
      }
    };

    fetchTimerLogs();
  }, [selectedSite, startDate, endDate, authtoken]);

  // ... rest of the component remains the same ...
  const exportToExcel = () => {
    if (!selectedSite) {
      toast.error("Please select a site first");
      return;
    }

    const hasTimerLogs = Array.isArray(timerLogs) && timerLogs.length > 0;

    if (!hasTimerLogs) {
      toast.error("No timer logs data available to export.");
      return;
    }

    const mergedData = [];

    // Timer Logs
    mergedData.push(["Timer Logs"]);
    if (hasTimerLogs) {
      mergedData.push([
        "Site ID",
        "Block",
        "Timer Update",
        "Last Updated",
        "Created At",
      ]);
      timerLogs.forEach((siteData) => {
        if (!siteData || !Array.isArray(siteData.last_activity)) return;
        siteData.last_activity.forEach((blockData) => {
          if (!blockData) return;
          if (blockData.detail) {
            mergedData.push([
              siteData.site_id || "N/A",
              blockData.block || "N/A",
              blockData.detail || "N/A",
              siteData.updatedAt
                ? new Date(siteData.updatedAt).toLocaleString()
                : "N/A",
              siteData.createdAt
                ? new Date(siteData.createdAt).toLocaleString()
                : "N/A",
            ]);
          } else if (Array.isArray(blockData.details)) {
            blockData.details.forEach((detail) => {
              mergedData.push([
                siteData.site_id || "N/A",
                blockData.block || "N/A",
                detail || "N/A",
                siteData.updatedAt
                  ? new Date(siteData.updatedAt).toLocaleString()
                  : "N/A",
                siteData.createdAt
                  ? new Date(siteData.createdAt).toLocaleString()
                  : "N/A",
              ]);
            });
          }
        });
      });
    } else {
      mergedData.push(["No timer logs data available"]);
    }
    mergedData.push([]);

    // Summary
    mergedData.push(["Summary"]);
    mergedData.push(["Site ID", selectedSite || "N/A"]);
    mergedData.push([
      "Report Period",
      `${startDate || "N/A"} to ${endDate || "N/A"}`,
    ]);
    mergedData.push(["Generated At", new Date().toLocaleString()]);
    mergedData.push([]);
    mergedData.push(["Data Summary"]);
    mergedData.push(["Timer Updates", hasTimerLogs ? timerLogs.length : 0]);

    const ws = XLSX.utils.aoa_to_sheet(mergedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Timer Logs");

    try {
      XLSX.writeFile(
        wb,
        `Site_${selectedSite || "Unknown"}_Timer_Logs_${
          startDate || "Start"
        }_To_${endDate || "End"}.xlsx`
      );
      toast.success("Excel file downloaded successfully!");
    } catch (error) {
      toast.error("Failed to export Excel file");
      console.error("Export error:", error);
    }
  };

  return (
    <div className="p-4">
      <form>
        <CRow className="my-3">
          <CCol md={7} xs={12} className="d-flex flex-wrap gap-2">
            <CCol md={3} xs={12} className="m-1">
              <CFormSelect
                value={selectedSite}
                onChange={(e) => setSelectedSite(e.target.value)}
                placeholder="Select Site"
              >
                <option value="">Select Site</option>
                {sites.map((site) => (
                  <option key={site} value={site}>
                    {site}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol md={3} xs={12} className="m-1">
              <CFormInput
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={loading}
              />
            </CCol>
            <CCol md={3} xs={12} className="m-1">
              <CFormInput
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={loading}
              />
            </CCol>
          </CCol>
          <CCol
            md={5}
            xs={12}
            className="d-flex justify-content-md-end justify-content-center align-items-center mt-2 mt-md-0"
          >
            <CButton
              color="primary"
              size="sm"
              onClick={exportToExcel}
              disabled={!selectedSite || loading}
            >
              Export to Excel
            </CButton>
          </CCol>
        </CRow>
      </form>
      {loading ? (
        <div className="text-center my-4">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="alert alert-danger text-center">{error}</div>
      ) : (
        <>
          {selectedSite && (
            <>
              <h5 className="mt-3 mb-3">
                ⏱ Timer Update Notifications -{" "}
                <span className="text-danger">{selectedSite}</span>
              </h5>
              <CTable bordered hover responsive className="text-center">
                <CTableHead color="info">
                  <CTableRow>
                    <CTableHeaderCell>#</CTableHeaderCell>
                    <CTableHeaderCell>Block</CTableHeaderCell>
                    <CTableHeaderCell>Timer Updates</CTableHeaderCell>
                    <CTableHeaderCell>Last Updated</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {Array.isArray(timerLogs) && timerLogs.length > 0 ? (
                    timerLogs.flatMap(
                      (siteData, siteIndex) =>
                        Array.isArray(siteData.last_activity)
                          ? siteData.last_activity.map(
                              (blockData, blockIndex) => (
                                <CTableRow key={`${siteIndex}-${blockIndex}`}>
                                  <CTableDataCell>
                                    {siteIndex * siteData.last_activity.length +
                                      blockIndex +
                                      1}
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    {blockData.block}
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <ul
                                      className="text-start"
                                      style={{
                                        listStyleType: "none",
                                        paddingLeft: 0,
                                      }}
                                    >
                                      {blockData.details?.map(
                                        (detail, detailIndex) => (
                                          <li key={detailIndex}>{detail}</li>
                                        )
                                      )}
                                    </ul>
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    {new Date(
                                      siteData.updatedAt
                                    ).toLocaleString()}
                                  </CTableDataCell>
                                </CTableRow>
                              )
                            )
                          : [] // fallback if last_activity is not an array
                    )
                  ) : (
                    <CTableRow>
                      <CTableDataCell
                        colSpan={4}
                        className="text-info text-center"
                      >
                        {selectedSite
                          ? "No timer update notifications found for the selected date."
                          : "Please select a site to view timer notifications"}
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default WeatherTimerNotifications;
