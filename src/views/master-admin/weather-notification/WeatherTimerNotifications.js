import React, { useEffect, useReducer, useState } from "react";
import { CFormInput, CFormSelect, CRow, CCol, CButton } from "@coreui/react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import axios from "axios";
import LoadingSpinner from "../../../components/LoadingSpinner";
import * as XLSX from "xlsx";
import WeatherNotificationCard from "./WeatherNotificationCard";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_TIMER_LOGS_REQUEST":
      return { ...state, loading: true, error: "" };

    case "FETCH_TIMER_LOGS_SUCCESS":
      return { ...state, loading: false, timerLogs: action.payload, error: "" };
    case "FETCH_TIMER_LOGS_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const WeatherTimerNotifications = () => {
  const [{ loading, timerLogs, error }, dispatch] = useReducer(reducer, {
    timerLogs: [],

    loading: false,
    error: "",
  });

  // const authtoken = useSelector((state) => state.authtoken);
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  useEffect(() => {
    const fetchTimerLogs = async () => {
      try {
        dispatch({ type: "FETCH_TIMER_LOGS_REQUEST" });
        const response = await axios.get(
          `/api/v1/weathertimerupdatenotification/get-weather-timer-update-notification/${startDate}/${endDate}`,
          {
            // headers: {
            //   Authorization: `Bearer ${authtoken}`,
            // },
            withCredentials: true,
          },
        );
        dispatch({
          type: "FETCH_TIMER_LOGS_SUCCESS",
          payload: response.data.data,
        });
      } catch (error) {
        dispatch({
          type: "FETCH_TIMER_LOGS_FAIL",
          payload:
            error.response?.data?.error ||
            error.response?.data?.message ||
            error.message,
        });
        toast.error(
          error.response?.data?.error ||
            error.response?.data?.message ||
            error.message,
        );
      }
    };

    fetchTimerLogs();
  }, [startDate, endDate]);

  // ... rest of the component remains the same ...
  const exportToExcel = () => {
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
    // mergedData.push(["Site ID", selectedSite || "N/A"]);
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
        `Timer_Logs_${startDate || "Start"}_To_${endDate || "End"}.xlsx`,
      );
      toast.success("File Exported successfully!");
    } catch (error) {
      toast.error("Failed to export Excel file");
      console.error("Export error:", error);
    }
  };

  return (
    <div className="">
      <h5 className="mt-3 mb-3">⏱ Timer Update Notifications</h5>
      <form>
        <CRow className="my-2">
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

          <CCol md={3} xs={12} className="m-1">
            <CButton
              color="primary"
              size="sm"
              onClick={exportToExcel}
              disabled={loading}
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
          {
            <>
              {loading ? (
                <LoadingSpinner />
              ) : timerLogs.length > 0 ? (
                timerLogs.map((log) => (
                  <WeatherNotificationCard key={log._id} data={log} />
                ))
              ) : (
                <div className="w-50 alert alert-warning text-center">
                  No timer update notifications found for the date range.
                </div>
              )}
            </>
          }
        </>
      )}
    </div>
  );
};

export default WeatherTimerNotifications;
