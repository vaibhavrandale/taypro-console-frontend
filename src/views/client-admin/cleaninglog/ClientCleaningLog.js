import React, { useEffect, useReducer, useState } from "react";
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormInput,
  CRow,
  CCol,
  CSpinner,
  CButton,
} from "@coreui/react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import axios from "axios";
import PaginateInput from "../../../components/PaginateInput";
import * as XLSX from "xlsx";
import LoadingSpinner from "../../../components/LoadingSpinner";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        cleaninglogs: action.payload.cleaninglogs,
        totalPages: action.payload.totalPages,
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
      };
    case "FETCH_ERROR_LOGS_SUCCESS":
      return { ...state, errorLogs: action.payload };
    case "FETCH_TIMER_LOGS_SUCCESS":
      return { ...state, timerLogs: action.payload };
    case "FETCH_TIMER_LOGS_FAIL":
      return { ...state, error: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const ClientCleaningLog = () => {
  const [
    {
      loading,
      cleaninglogs,
      totalPages,
      hasNextPage,
      hasPrevPage,
      errorLogs,
      timerLogs,
      error,
    },
    dispatch,
  ] = useReducer(reducer, {
    cleaninglogs: [],
    errorLogs: [],
    timerLogs: [],
    loading: false,
    error: "",
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const authtoken = useSelector((state) => state.authtoken);
  const { site_id } = useParams();

  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [pageInput, setPageInput] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    const fetchCleaningLogs = async () => {
      let pagination = {
        pg: page,
        limit: limit,
      };
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const result = await axios.post(
          `/api/v1/cleaninglogs/${startDate}/${endDate}/${site_id}`,
          pagination,
          {
            headers: {
              Authorization: `Bearer ${authtoken}`,
            },
          }
        );
        let total = Math.ceil(
          Number(result.data.total) / Number(result.data.limit)
        );
        let next = result.data.hasNextPage;
        let prev = result.data.hasPrevPage;
        const data = result.data.data;
        dispatch({
          type: "FETCH_SUCCESS",
          payload: {
            cleaninglogs: data,
            totalPages: total,
            hasNextPage: next,
            hasPrevPage: prev,
          },
        });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: error.response?.data?.error || error.message,
        });
        toast.error(error.response?.data?.error || error.message);
      }
    };

    const fetchErrorLogs = async () => {
      try {
        const response = await axios.get(
          `/api/v1/errorlogs/site-error-logs/${site_id}/${startDate}/${endDate}`,
          {
            headers: {
              Authorization: `Bearer ${authtoken}`,
            },
          }
        );
        dispatch({
          type: "FETCH_ERROR_LOGS_SUCCESS",
          payload: response.data.data,
        });
      } catch (error) {
        toast.error("Failed to fetch error logs");
      }
    };

    const fetchTimerLogs = async () => {
      try {
        const response = await axios.get(
          `/api/v1/weathertimerupdatenotification/get-weather-timer-update-notification/${site_id}/${startDate}/${endDate}`,
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
          type: "FETCH_TIMER_LOGS_FAIL",
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

    fetchCleaningLogs();
    fetchErrorLogs();
    fetchTimerLogs();
  }, [site_id, startDate, endDate, page, limit, authtoken]);

  const exportToExcel = () => {
    const hasCleaningLogs =
      Array.isArray(cleaninglogs) && cleaninglogs.length > 0;
    const hasErrorLogs = Array.isArray(errorLogs) && errorLogs.length > 0;
    const hasTimerLogs = Array.isArray(timerLogs) && timerLogs.length > 0;

    if (!hasCleaningLogs && !hasErrorLogs && !hasTimerLogs) {
      toast.error("No data available to export.");
      return;
    }

    const mergedData = [];

    // 1. Timer Logs
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

    // 2. Cleaning Logs
    mergedData.push(["Cleaning Logs"]);
    if (hasCleaningLogs) {
      mergedData.push([
        "Sr No",
        "Robot No",
        "Row Number",
        "Row Length (Meters)",
        "Cleaning Date",
        "Start Time",
        "Start Battery (%)",
        "Finish Time",
        "Finish Battery (%)",
        "Distance Covered (Meters)",
        "Status",
        "Duration (Minutes)",
      ]);
      cleaninglogs.forEach((log, index) => {
        const startDateObj = log.start_timestamp
          ? new Date(log.start_timestamp)
          : null;
        const endDateObj = log.finish_timestamp
          ? new Date(log.finish_timestamp)
          : null;
        mergedData.push([
          index + 1,
          log.robot_no || "N/A",
          log.row_number || "N/A",
          log.row_length || "N/A",
          startDateObj ? startDateObj.toISOString().split("T")[0] : "N/A",
          startDateObj ? startDateObj.toLocaleTimeString() : "N/A",
          log.start_battery_percentage || "N/A",
          endDateObj ? endDateObj.toLocaleTimeString() : "In Progress",
          log.finish_battery_percentage || "N/A",
          log.calculated_distance || "N/A",
          log.cleaning_status || "N/A",
          startDateObj && endDateObj
            ? Math.round((endDateObj - startDateObj) / (1000 * 60))
            : "N/A",
        ]);
      });
    } else {
      mergedData.push(["No cleaning logs data available"]);
    }
    mergedData.push([]);

    // 3. Error Logs
    mergedData.push(["Error Logs"]);
    if (hasErrorLogs) {
      mergedData.push(["Sr No", "Robot No", "Block", "Error Type", "Date"]);
      errorLogs.forEach((log, index) => {
        const errorDate = log.date ? new Date(log.date) : null;
        mergedData.push([
          index + 1,
          log.robot_no || "N/A",
          log.block || "N/A",
          log.error_type || "N/A",
          errorDate ? errorDate.toLocaleDateString() : "N/A",
        ]);
      });
    } else {
      mergedData.push(["No error logs data available"]);
    }
    mergedData.push([]);

    // 4. Summary
    mergedData.push(["Summary"]);
    mergedData.push(["Site ID", site_id || "N/A"]);
    mergedData.push([
      "Report Period",
      `${startDate || "N/A"} to ${endDate || "N/A"}`,
    ]);
    mergedData.push(["Generated At", new Date().toLocaleString()]);
    mergedData.push([]);
    mergedData.push(["Data Summary"]);
    mergedData.push([
      "Cleaning Logs",
      hasCleaningLogs ? cleaninglogs.length : 0,
    ]);
    mergedData.push(["Error Logs", hasErrorLogs ? errorLogs.length : 0]);
    mergedData.push(["Timer Updates", hasTimerLogs ? timerLogs.length : 0]);

    const ws = XLSX.utils.aoa_to_sheet(mergedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "All Logs");

    try {
      XLSX.writeFile(
        wb,
        `Site_${site_id || "Unknown"}_Logs_${startDate || "Start"}_To_${
          endDate || "End"
        }.xlsx`
      );
      toast.success("Excel file downloaded successfully!");
    } catch (error) {
      toast.error("Failed to export Excel file");
      console.error("Export error:", error);
    }
  };

  const handlePageInputChange = (e) => {
    setPageInput(e.target.value);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handlePageInputSubmit = () => {
    const pageNumber = parseInt(pageInput);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      handlePageChange(pageNumber);
    }
  };

  return (
    <div className="p-4">
      <form>
        <CRow className="my-3">
          <CCol md={7} xs={12} className="d-flex flex-wrap gap-2">
            <CCol md={3} xs={12} className="m-1">
              <CFormInput
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </CCol>
            <CCol md={3} xs={12} className="m-1">
              <CFormInput
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </CCol>
          </CCol>
          <CCol
            md={5}
            xs={12}
            className="d-flex justify-content-md-end justify-content-center align-items-center mt-2 mt-md-0"
          >
            <CButton color="primary" size="sm" onClick={exportToExcel}>
              Export to Excel
            </CButton>
          </CCol>
        </CRow>
      </form>
      {loading ? (
        <div className="text-center my-4">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          {/* Timer Update Notifications Table - Comes First */}
          <h5 className="mt-3 mb-3">
            ⏱ Timer Update Notifications -{" "}
            <span className="text-danger">{site_id}</span>
          </h5>
          <CTable
            bordered
            hover
            responsive
            className="text-center bg-important"
          >
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
                      ? siteData.last_activity.map((blockData, blockIndex) => (
                          <CTableRow key={`${siteIndex}-${blockIndex}`}>
                            <CTableDataCell>
                              {siteIndex * siteData.last_activity.length +
                                blockIndex +
                                1}
                            </CTableDataCell>
                            <CTableDataCell>{blockData.block}</CTableDataCell>
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
                              {new Date(siteData.updatedAt).toLocaleString()}
                            </CTableDataCell>
                          </CTableRow>
                        ))
                      : [] // fallback if last_activity is not an array
                )
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan={4} className="text-info text-center">
                    No timer update notifications found for the selected date.
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>

          {/* Cleaning Logs Table */}
          <h5 className="mt-5 mb-3">
            🤖 Cleaning Logs - <span className="text-danger">{site_id}</span>
          </h5>
          <CTable
            bordered
            hover
            responsive
            className="text-center bg-important"
          >
            <CTableHead color="secondary">
              <CTableRow>
                <CTableHeaderCell>Sr</CTableHeaderCell>
                <CTableHeaderCell style={{ minWidth: "150px" }}>
                  Robot No
                </CTableHeaderCell>
                <CTableHeaderCell style={{ minWidth: "190px" }}>
                  Row Number
                </CTableHeaderCell>
                <CTableHeaderCell style={{ minWidth: "190px" }}>
                  Row Length (Meters)
                </CTableHeaderCell>
                <CTableHeaderCell style={{ minWidth: "160px" }}>
                  Cleaning Date
                </CTableHeaderCell>
                <CTableHeaderCell style={{ minWidth: "190px" }}>
                  Started At
                </CTableHeaderCell>
                <CTableHeaderCell style={{ minWidth: "150px" }}>
                  Battery Start (%)
                </CTableHeaderCell>
                <CTableHeaderCell style={{ minWidth: "190px" }}>
                  Finished At
                </CTableHeaderCell>
                <CTableHeaderCell style={{ minWidth: "190px" }}>
                  Battery Finished (%)
                </CTableHeaderCell>
                <CTableHeaderCell style={{ minWidth: "190px" }}>
                  Distance Covered (Meters)
                </CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {cleaninglogs.length > 0 ? (
                cleaninglogs.map((log, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>{index + 1}</CTableDataCell>
                    <CTableDataCell>{log.robot_no}</CTableDataCell>
                    <CTableDataCell>{log.row_number}</CTableDataCell>
                    <CTableDataCell>{log.row_length}</CTableDataCell>
                    <CTableDataCell>
                      {
                        new Date(log.start_timestamp)
                          .toISOString()
                          .split("T")[0]
                      }
                    </CTableDataCell>
                    <CTableDataCell>
                      {new Date(log.start_timestamp).toLocaleString()}
                    </CTableDataCell>
                    <CTableDataCell>
                      {log.start_battery_percentage}
                    </CTableDataCell>
                    {log.finish_timestamp === null ? (
                      <CTableDataCell colSpan={4} className="text-center">
                        <span className="badge bg-warning">
                          Cleaning in progress
                        </span>
                      </CTableDataCell>
                    ) : (
                      <>
                        <CTableDataCell>
                          {new Date(log.finish_timestamp).toLocaleString()}
                        </CTableDataCell>
                        <CTableDataCell>
                          {log.finish_battery_percentage}
                        </CTableDataCell>
                        <CTableDataCell>
                          {log.calculated_distance}
                        </CTableDataCell>
                        <CTableDataCell>{log.cleaning_status}</CTableDataCell>
                      </>
                    )}
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell
                    colSpan="11"
                    className="text-center text-danger"
                  >
                    No logs found for the selected date.
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>

          <PaginateInput
            page={page}
            totalPages={totalPages}
            hasPrevPage={hasPrevPage}
            hasNextPage={hasNextPage}
            pageInput={pageInput}
            handlePageChange={handlePageChange}
            handlePageInputChange={handlePageInputChange}
            handlePageInputSubmit={handlePageInputSubmit}
            limit={limit}
            handleLimitChange={setLimit}
          />

          {/* Error Logs Table */}
          <h5 className="mt-5 mb-3">
            🚨 Error Logs for - <span className="text-danger">{site_id}</span>
          </h5>
          <CTable
            bordered
            hover
            responsive
            className="text-center bg-important"
          >
            <CTableHead color="dark">
              <CTableRow>
                <CTableHeaderCell>#</CTableHeaderCell>
                <CTableHeaderCell>Robot No</CTableHeaderCell>
                <CTableHeaderCell>Block</CTableHeaderCell>
                <CTableHeaderCell>Error Type</CTableHeaderCell>
                <CTableHeaderCell>Date</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {errorLogs?.length > 0 ? (
                errorLogs.map((log, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>{index + 1}</CTableDataCell>
                    <CTableDataCell>{log.robot_no}</CTableDataCell>
                    <CTableDataCell>{log.block}</CTableDataCell>
                    <CTableDataCell>{log.error_type}</CTableDataCell>
                    <CTableDataCell>
                      {new Date(log.date).toLocaleDateString()}{" "}
                    </CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell
                    colSpan={5}
                    className="text-danger text-center"
                  >
                    No error logs found for the selected date.
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        </>
      )}
    </div>
  );
};

export default ClientCleaningLog;
