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
  CButton,
  CBadge,
  CAlert,
  CCard,
  CCardBody,
  CTabs,
  CTabList,
  CTab,
  CTabPanel,
  CTabContent,
  CProgress,
  CProgressBar,
} from "@coreui/react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import axios from "axios";
// import PaginateInput from "../../../components/PaginateInput";
import * as XLSX from "xlsx";
import LoadingSpinner from "../../../components/LoadingSpinner";
import SubscriptionExpiryCard from "../../../components/SubscriptionExpiryCard";
import Logmodal from "../../../components/individual-robot-log/Logmodal";

// import CompletedCycles from "./CompletedCycles";
// import ErrorCycles from "./ErrorCycles";
// import OfflineRobotsCycle from "./OfflineRobotsCycle";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_CLEANING_REQUEST":
      return { ...state, cleaningLoading: true, cleaningError: "" };
    case "FETCH_CLEANING_SUCCESS":
      return {
        ...state,
        cleaningLoading: false,
        total_cleaning_logs: action.payload.total_cleaning_logs,
        total_cleaning_completed: action.payload.total_cleaning_completed,
        total_cleaning_in_progress: action.payload.total_cleaning_in_progress,
        total_failure_logs: action.payload.total_failure_logs,
        total_robots_assigned: action.payload.total_robots_assigned,
        total_not_started_robots: action.payload.total_not_started_robots,
        total_offline_robots_at_time_of_cleaning:
          action.payload.total_offline_robots_at_time_of_cleaning,
        cleaning_completed: action.payload.cleaning_completed,
        cleaning_in_progress: action.payload.cleaning_in_progress,
        cleaning_failures: action.payload.cleaning_failures,
        not_started_robots: action.payload.not_started_robots,
        offline_robots_at_time_of_cleaning:
          action.payload.offline_robots_at_time_of_cleaning,
        dpr: action.payload.dpr,
      };
    case "FETCH_FAIL":
      return {
        ...state,
        cleaningLoading: false,
        cleaningError: action.payload,
        subscriptiondata: action.subscriptiondata,
        subscriptionStatus: action.subscriptionStatus,
      };

    default:
      return state;
  }
};

const ClientCleaningLog = () => {
  const [
    {
      cleaningLoading,
      cleaningError,
      cleaning_completed,
      cleaning_in_progress,
      cleaning_failures,
      total_cleaning_logs,
      total_cleaning_completed,
      total_cleaning_in_progress,
      total_failure_logs,
      total_robots_assigned,
      total_not_started_robots,
      total_offline_robots_at_time_of_cleaning,
      not_started_robots,
      offline_robots_at_time_of_cleaning,
      dpr,
      subscriptionStatus,
      subscriptiondata,
    },
    dispatch,
  ] = useReducer(reducer, {
    cleaningLoading: false,
    cleaningError: "",
    cleaning_completed: [],
    cleaning_in_progress: [],
    cleaning_failures: [],
    dpr: [],
    not_started_robots: [],
    offline_robots_at_time_of_cleaning: [],
    total_cleaning_logs: 0,
    total_cleaning_completed: 0,
    total_cleaning_in_progress: 0,
    total_failure_logs: 0,
    total_robots_assigned: 0,
    total_not_started_robots: 0,
    total_offline_robots_at_time_of_cleaning: 0,

    subscriptionStatus: "",
    subscriptiondata: {},
  });

  const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);
  const { site_id, date } = useParams();
  const [startDate, setStartDate] = useState(
    date || new Date().toISOString().split("T")[0],
  );
  // Completed logs filters
  const [completedSearch, setCompletedSearch] = useState("");
  const [completedBlock, setCompletedBlock] = useState("");

  // In progress filters
  const [progressSearch, setProgressSearch] = useState("");
  const [progressBlock, setProgressBlock] = useState("");

  // Failure filters
  const [failureSearch, setFailureSearch] = useState("");
  const [failureBlock, setFailureBlock] = useState("");

  // Offline filters
  const [offlineSearch, setOfflineSearch] = useState("");
  const [offlineBlock, setOfflineBlock] = useState("");

  // Not started filters
  const [notStartedSearch, setNotStartedSearch] = useState("");
  const [notStartedBlock, setNotStartedBlock] = useState("");

  const [selectedLogId, setSelectedLogId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchCleaningLogs = async () => {
      try {
        dispatch({ type: "FETCH_CLEANING_REQUEST" });
        const result = await axios.post(
          `/api/v1/robot-tracking/cleaning-logs-for-a-day`,
          {
            site_id,
            date: startDate,
          },
          {
            headers: {
              Authorization: `Bearer ${authtoken}`,
            },
          },
        );

        const data = result.data.data;
        dispatch({
          type: "FETCH_CLEANING_SUCCESS",
          payload: {
            total_cleaning_logs: data.total_cleaning_logs,
            total_cleaning_completed: data.total_cleaning_completed,
            total_cleaning_in_progress: data.total_cleaning_in_progress,
            total_failure_logs: data.total_failure_logs,
            total_robots_assigned: data.total_robots_assigned,
            total_not_started_robots: data.total_not_started_robots,
            total_offline_robots_at_time_of_cleaning:
              data.total_offline_robots_at_time_of_cleaning,
            total_offline_robots: data.total_offline_robots,
            cleaning_completed: data.cleaning_completed,
            cleaning_in_progress: data.cleaning_in_progress,
            cleaning_failures: data.cleaning_failures,
            not_started_robots: data.not_started_robots,
            offline_robots_at_time_of_cleaning:
              data.offline_robots_at_time_of_cleaning,
            dpr: data.dpr,
          },
        });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: error.response?.data?.error || error.response?.data?.message,
          subscriptiondata: error.response?.data?.data,
          subscriptionStatus: error.response?.data.subscriptionStatus,
        });
        toast.error(
          error.response?.data?.error || error.response?.data?.message,
        );
      }
    };

    fetchCleaningLogs();
  }, [site_id, startDate, authtoken]);

  const exportToExcel = () => {
    if (
      !cleaning_completed?.length &&
      !cleaning_in_progress?.length &&
      !cleaning_failures?.length &&
      !offline_robots_at_time_of_cleaning?.length
    ) {
      toast.error("No data available to export.");
      return;
    }

    const mergedData = [];

    // ===================================================
    // 1. Cleaning Logs (Completed)
    // ===================================================
    mergedData.push(["Cleaning Completed Logs"]);

    if (cleaning_completed?.length) {
      mergedData.push([
        "Sr No",
        "Robot No",
        "Row Number",
        "Row Length (Meters)",
        "Cleaning Percentage",
        "Start Time",
        "Start Battery (%)",
        "Finish Battery (%)",
        "Finish Time",
        "Status",
      ]);

      cleaning_completed.forEach((log, index) => {
        const lastPoint = log.track_details?.length
          ? log.track_details[log.track_details.length - 1].point
          : 0;

        const { percentage } = getCleaningPercentage(lastPoint, log);
        mergedData.push([
          index + 1,
          log.robot_no || "N/A",
          log.row_no || "N/A",
          log.row_length || "N/A",
          `${percentage} %` || "N/A",
          log.cleaning?.startAt
            ? new Date(log.cleaning?.startAt).toLocaleString()
            : "N/A",
          log.cleaning?.battery_before_cleaning ?? "N/A",
          log.cleaning?.battery_after_cleaning ?? "N/A",
          log.cleaning?.finishAt
            ? new Date(log.cleaning?.finishAt).toLocaleString()
            : "N/A",
          log.cleaning?.finish
            ? "Completed"
            : log.cleaning?.battery_dead
              ? "Battery Dead"
              : log.cleaning?.cleaning_cancelled
                ? "Cleaning Cancelled"
                : "In Progress",
        ]);
      });
    } else {
      mergedData.push(["No cleaning logs data available"]);
    }

    mergedData.push([]);
    mergedData.push([]);

    // ===================================================
    // 2. Cleaning In Progress
    // ===================================================
    mergedData.push(["Cleaning In Progress"]);

    if (cleaning_in_progress?.length) {
      mergedData.push([
        "Sr No",
        "Robot No",
        "Started At",
        "Cleaning Percentage",
        "Block",
        "Status",
      ]);

      cleaning_in_progress.forEach((log, index) => {
        const lastPoint = log.track_details?.length
          ? log.track_details[log.track_details.length - 1].point
          : 0;

        const { percentage } = getCleaningPercentage(lastPoint, log);
        mergedData.push([
          index + 1,
          log.robot_no || "N/A",
          log.cleaning?.startAt
            ? new Date(log.cleaning?.startAt).toLocaleString()
            : "N/A",
          `${percentage} %` || "N/A",
          log.block || "N/A",
          "In Progress",
        ]);
      });
    } else {
      mergedData.push(["No Cleaning In Progress logs found"]);
    }

    mergedData.push([]);
    mergedData.push([]);

    // ===================================================
    // 3. Failure Logs
    // ===================================================
    mergedData.push(["Failure Logs"]);

    if (cleaning_failures?.length) {
      mergedData.push([
        "Sr No",
        "Robot No",
        "Block",
        "Start At",
        "Cleaning Percentage",
        "Error Type",
        "Comments",
      ]);

      cleaning_failures.forEach((log, index) => {
        const lastPoint = log.track_details?.length
          ? log.track_details[log.track_details.length - 1].point
          : 0;

        const { percentage } = getCleaningPercentage(lastPoint, log);
        mergedData.push([
          index + 1,
          log.robot_no || "N/A",
          log.block || "N/A",
          log.cleaning?.startAt,
          `${percentage} %` || "N/A",
          log.cleaning?.battery_dead ? "Incomplete" : "Cleaning Cancelled",
          log.comments,
        ]);
      });
    } else {
      mergedData.push(["No error logs found"]);
    }

    mergedData.push([]);
    mergedData.push([]);

    // ===================================================
    // 4. Offline Robots
    // ===================================================
    mergedData.push(["Offline Robots At the time of cleaning"]);

    if (offline_robots_at_time_of_cleaning?.length) {
      mergedData.push(["Sr No", "Robot No", "Block", "Error Type"]);

      offline_robots_at_time_of_cleaning.forEach((log, index) => {
        mergedData.push([
          index + 1,
          log.robot_no || "N/A",
          log.block || "N/A",
          log.error_type || "N/A",
        ]);
      });
    } else {
      mergedData.push(["No offline Robots found"]);
    }

    mergedData.push([]);
    mergedData.push([]);

    // ===================================================
    // 5.  Not Started
    // ===================================================

    mergedData.push(["Not Started"]);

    if (not_started_robots?.length) {
      mergedData.push(["Sr No", "Robot No", "Block", "Status"]);

      not_started_robots.forEach((log, index) => {
        mergedData.push([
          index + 1,
          log.robot_no || "N/A",
          log.block || "N/A",
          "Not Started",
        ]);
      });
    } else {
      mergedData.push([" Not Started robots found"]);
    }

    mergedData.push([]);
    mergedData.push([]);
    // ===================================================
    // 6. Technician DPR Logs (NEW)
    // ===================================================
    mergedData.push(["Technician DPR Logs"]);

    if (dpr?.length) {
      mergedData.push([
        "Sr No",
        "Date",
        "Site",
        // "Operational Robots",
        // "Failed Robots",
        // "Total Robots",
        "Remarks",
        "Technician",
      ]);

      dpr.forEach((log, index) => {
        const technician = log.technician_present?.[0]?.name || "-";
        const reportDate = log.report_date
          ? new Date(log.report_date).toLocaleDateString()
          : "-";

        mergedData.push([
          index + 1,
          reportDate,
          log.site_id,
          // log.total_running_robots,
          // log.total_failed_robots,
          // log.total_robots,
          log.comments || "-",
          technician,
        ]);
      });
    } else {
      mergedData.push(["No DPR logs available"]);
    }

    mergedData.push([]);
    mergedData.push([]);
    // ===================================================
    // 5. Summary
    // ===================================================
    mergedData.push(["Summary"]);
    mergedData.push(["Site ID", site_id || "N/A"]);
    mergedData.push(["Report Period", `${startDate} to ${startDate}`]);
    mergedData.push(["Generated At", new Date().toLocaleString()]);
    mergedData.push([]);
    mergedData.push(["Data Summary"]);
    mergedData.push([
      "Cleaning Logs (Completed)",
      total_cleaning_completed || 0,
    ]);
    mergedData.push([
      "Cleaning In Progress",
      total_cleaning_in_progress?.length || 0,
    ]);
    mergedData.push(["Failure Logs", total_failure_logs || 0]);
    mergedData.push([
      "Offline Robots",
      total_offline_robots_at_time_of_cleaning || 0,
    ]);
    mergedData.push(["Technician DPR Logs", dpr?.length || 0]);

    mergedData.push([]);
    mergedData.push([]);

    // ===================================================
    // Create Sheet + Formatting
    // ===================================================
    const ws = XLSX.utils.aoa_to_sheet(mergedData);

    // Column widths
    ws["!cols"] = [
      { wch: 5 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 25 },
      { wch: 25 },
    ];

    const range = XLSX.utils.decode_range(ws["!ref"]);

    const tableNameFill = {
      fill: { fgColor: { rgb: "FFFFF2CC" } },
      font: { bold: true },
      alignment: { horizontal: "center" },
    };
    const headerFill = {
      fill: { fgColor: { rgb: "FFBDD7EE" } },
      font: { bold: true },
      alignment: { horizontal: "center" },
    };
    const centerAlign = {
      alignment: { horizontal: "center", wrapText: true },
    };

    // Identify table title rows (every section title)
    const tableNameRows = new Set([0, 4, 8, 12, 16, 23]); // added DPR section
    const headerRows = new Set([1, 5, 9, 13, 18, 24]);

    // Apply style
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        const cell = ws[cellAddress];
        if (!cell) continue;
        cell.s = cell.s || {};

        if (tableNameRows.has(R)) {
          Object.assign(cell.s, tableNameFill);
        } else if (headerRows.has(R)) {
          Object.assign(cell.s, headerFill);
        } else {
          Object.assign(cell.s, centerAlign);
        }
      }
    }

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "All Logs");

    try {
      XLSX.writeFile(
        wb,
        `Site_${site_id || "Unknown"}_Logs_${startDate}_To_${startDate}.xlsx`,
      );
      toast.success("Excel file downloaded successfully!");
    } catch (error) {
      toast.error("Failed to export Excel file");
      console.error("Export error:", error);
    }
  };

  // const handlePageInputChange = (e) => {
  //   setPageInput(e.target.value);
  // };

  // const handlePageChange = (newPage) => {
  //   if (newPage >= 1 && newPage <= totalPages) {
  //     setPage(newPage);
  //   }
  // };

  // const handlePageInputSubmit = () => {
  //   const pageNumber = parseInt(pageInput);
  //   if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
  //     handlePageChange(pageNumber);
  //   }
  // };
  const checkStatus = [
    "subscriptionSitesAssigned",
    "subscriptionFound",
    "subscriptionaRenewStatus",
    "subscriptionPaymentStatus",
    "subscriptionPlanAccess",
  ];

  const successRobotCount = {};
  const inProgressRobotCount = {};
  const failureRobotCount = {};
  const notStartedRobotCount = {};

  cleaning_completed &&
    cleaning_completed.forEach((log) => {
      successRobotCount[log.robot_no] =
        (successRobotCount[log.robot_no] || 0) + 1;
    });

  cleaning_in_progress &&
    cleaning_in_progress.forEach((log) => {
      inProgressRobotCount[log.robot_no] =
        (inProgressRobotCount[log.robot_no] || 0) + 1;
    });

  cleaning_failures &&
    cleaning_failures.forEach((log) => {
      failureRobotCount[log.robot_no] =
        (failureRobotCount[log.robot_no] || 0) + 1;
    });

  not_started_robots &&
    not_started_robots.forEach((log) => {
      notStartedRobotCount[log.robot_no] =
        (notStartedRobotCount[log.robot_no] || 0) + 1;
    });

  const getBlocks = (data) => {
    return [...new Set(data.map((item) => item.block).filter(Boolean))];
  };
  const filteredCompleted = cleaning_completed.filter((log) => {
    return (
      log.robot_no.toLowerCase().includes(completedSearch.toLowerCase()) &&
      (completedBlock ? log.block === completedBlock : true)
    );
  });

  const filteredProgress = cleaning_in_progress.filter((log) => {
    return (
      log.robot_no.toLowerCase().includes(progressSearch.toLowerCase()) &&
      (progressBlock ? log.block === progressBlock : true)
    );
  });

  const filteredFailure = cleaning_failures.filter((log) => {
    return (
      log.robot_no.toLowerCase().includes(failureSearch.toLowerCase()) &&
      (failureBlock ? log.block === failureBlock : true)
    );
  });

  const filteredOffline = offline_robots_at_time_of_cleaning.filter((log) => {
    return (
      log.robot_no.toLowerCase().includes(offlineSearch.toLowerCase()) &&
      (offlineBlock ? log.block === offlineBlock : true)
    );
  });

  const filteredNotStarted = not_started_robots.filter((log) => {
    return (
      log.robot_no.toLowerCase().includes(notStartedSearch.toLowerCase()) &&
      (notStartedBlock ? log.block === notStartedBlock : true)
    );
  });

  const OpenCleaningModal = (logId) => {
    setSelectedLogId(logId);
    setModalOpen(true);
    // Here you can set the state to open the modal and pass the logId to it
  };

  const getCleaningPercentage = (pt, robot) => {
    let percentage = 0;
    let distance = 0;
    const totalSteps = 20;

    // ✅ If cleaning is finished (uplink 16 or metrics received), always return 100%
    if (robot.cleaning?.finish === true) {
      return {
        point: pt,
        distanceCovered: totalSteps,
        totalDistance: totalSteps,
        percentage: 100,
      };
    }

    // ✅ Find highest point from track_details (19-40) instead of using last point
    let highestPoint = pt;
    if (robot.track_details && robot.track_details.length > 0) {
      const validPoints = robot.track_details
        .map((td) => td.point)
        .filter((p) => p >= 19 && p <= 40);
      if (validPoints.length > 0) {
        highestPoint = Math.max(...validPoints);
      }
    }

    // Use highest point for calculation
    if (highestPoint >= 20 && highestPoint <= 29) {
      distance = highestPoint - 19;
      percentage = (distance / totalSteps) * 100;
    } else if (highestPoint === 30) {
      distance = 10;
      percentage = (distance / totalSteps) * 100;
    } else if (highestPoint >= 31 && highestPoint <= 39) {
      distance = 10 + (highestPoint - 30);
      percentage = (distance / totalSteps) * 100;
    } else if (highestPoint === 40) {
      // ✅ Point 40 should show 99% (not 100%) unless cleaning is finished
      // Cleaning finished is handled above, so if we reach here, cleaning is not finished
      distance = 10 + (40 - 30); // = 20
      percentage = 99; // Cap at 99% for point 40 when not finished
    }

    return { percentage: Math.round(percentage) };
  };

  return (
    <>
      {cleaningLoading ? (
        <LoadingSpinner />
      ) : checkStatus.includes(subscriptionStatus) ? (
        <SubscriptionExpiryCard
          data={subscriptiondata}
          subscriptionStatus={subscriptionStatus}
          error={cleaningError}
        />
      ) : cleaningError ? (
        <CAlert className="p-2 w-50" color="danger">
          {cleaningError}
        </CAlert>
      ) : (
        <div>
          {/* HEADER + FILTERS */}
          <h5 className="text-center mb-3">
            <CBadge color="warning">{site_id.toUpperCase()}</CBadge>
          </h5>

          <CRow className="my-3">
            <CCol md={7} xs={12} className="d-flex flex-wrap gap-2">
              <CCol md={4} xs={12} className="m-1">
                <CFormInput
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
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

          {/* Total Logs Badges */}
          <div className="mb-3">
            <CCard className="shadow-sm border-0">
              <CCardBody className="py-3">
                <CRow className="align-items-center">
                  <CCol xs="12" md="12">
                    <div className="d-flex flex-wrap  justify-content-between  align-iems-center">
                      <h5 className="fw-bold mb-0 me-3">🤖 Logs</h5>
                      <CBadge
                        color="primary"
                        className="px-3 py-2 rounded-pill m-1"
                        style={{ fontSize: "14px" }}
                      >
                        Total Assigned Robots: {total_robots_assigned}
                      </CBadge>
                      <CBadge
                        color="secondary"
                        className="px-3 py-2 rounded-pill m-1"
                        style={{ fontSize: "14px" }}
                      >
                        Total Logs:
                        {total_cleaning_logs}
                      </CBadge>
                      <CBadge
                        color="success"
                        className="px-3 py-2 rounded-pill m-1"
                        style={{ fontSize: "14px" }}
                      >
                        Completed: {total_cleaning_completed}
                      </CBadge>
                      <CBadge
                        color="warning"
                        className="px-3 py-2 rounded-pill m-1"
                        style={{ fontSize: "14px" }}
                      >
                        In Progress: {total_cleaning_in_progress}
                      </CBadge>
                      <CBadge
                        color="danger"
                        className="px-3 py-2 rounded-pill m-1"
                        style={{ fontSize: "14px" }}
                      >
                        Failure: {total_failure_logs}
                      </CBadge>
                      <CBadge
                        color="danger"
                        className="px-3 py-2 rounded-pill m-1"
                        style={{ fontSize: "14px" }}
                      >
                        Offline at cleaning time:
                        {total_offline_robots_at_time_of_cleaning}
                      </CBadge>
                      <CBadge
                        color="danger"
                        className="px-3 py-2 rounded-pill m-1"
                        style={{ fontSize: "14px" }}
                      >
                        Not Started :
                        <spa className="ms-2">{total_not_started_robots}</spa>
                      </CBadge>
                    </div>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          </div>

          {/* Tabs Section */}
          {cleaningLoading ? (
            <div className="text-center my-4">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              <CTabs activeItemKey="cleaning-logs">
                <CTabList variant="tabs" className="border-bottom">
                  <CTab itemKey="cleaning-logs" className="text-white">
                    Completed Logs
                  </CTab>
                  <CTab itemKey="in-progress" className="text-white">
                    Cleaning In Progress
                  </CTab>
                  <CTab itemKey="error-logs" className="text-white">
                    Failure Logs
                  </CTab>
                  <CTab itemKey="offline-robots" className="text-white">
                    Offline at cleaning time
                  </CTab>

                  <CTab
                    itemKey="online–command-given-not-started"
                    className="text-white"
                  >
                    Not Started
                  </CTab>
                  <CTab itemKey="technician-dpr-logs" className="text-white">
                    Technician DPR Logs
                  </CTab>
                </CTabList>

                <CTabContent>
                  {/* Completed Logs Tab */}
                  <CTabPanel itemKey="cleaning-logs">
                    <CRow className="my-2 justify-content-end">
                      <CCol md={2}>
                        <CFormInput
                          placeholder="Search Robot No..."
                          value={completedSearch}
                          onChange={(e) => setCompletedSearch(e.target.value)}
                        />
                      </CCol>

                      <CCol md={2}>
                        <select
                          className="form-select"
                          value={completedBlock}
                          onChange={(e) => setCompletedBlock(e.target.value)}
                        >
                          <option value="">All Blocks</option>
                          {getBlocks(cleaning_completed).map((block) => (
                            <option key={block} value={block}>
                              {block}
                            </option>
                          ))}
                        </select>
                      </CCol>
                    </CRow>
                    <CTable
                      bordered
                      hover
                      responsive
                      className="text-center bg-important mb-2"
                    >
                      <CTableHead color="secondary">
                        <CTableRow>
                          <CTableHeaderCell>Sr</CTableHeaderCell>
                          <CTableHeaderCell style={{ minWidth: "150px" }}>
                            Robot No
                          </CTableHeaderCell>
                          <CTableHeaderCell>Status</CTableHeaderCell>
                          <CTableHeaderCell>Block</CTableHeaderCell>
                          <CTableHeaderCell style={{ minWidth: "130px" }}>
                            Row Number
                          </CTableHeaderCell>
                          <CTableHeaderCell style={{ minWidth: "190px" }}>
                            Row Length (Meters)
                          </CTableHeaderCell>
                          <CTableHeaderCell style={{ minWidth: "190px" }}>
                            Cleaning Percentage (%)
                          </CTableHeaderCell>
                          <CTableHeaderCell style={{ minWidth: "190px" }}>
                            Started At
                          </CTableHeaderCell>
                          <CTableHeaderCell style={{ minWidth: "190px" }}>
                            Finished At
                          </CTableHeaderCell>
                          <CTableHeaderCell style={{ minWidth: "150px" }}>
                            Battery Start (%)
                          </CTableHeaderCell>
                          <CTableHeaderCell style={{ minWidth: "190px" }}>
                            Battery Finished (%)
                          </CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>

                      <CTableBody>
                        {cleaning_completed.length > 0 ? (
                          filteredCompleted.map((log, index) => {
                            const lastPoint = log.track_details?.length
                              ? log.track_details[log.track_details.length - 1]
                                  .point
                              : 0;

                            const { percentage } = getCleaningPercentage(
                              lastPoint,
                              log,
                            );
                            return (
                              <CTableRow key={index}>
                                <CTableDataCell>{index + 1}</CTableDataCell>
                                <CTableDataCell
                                  className="cursor-pointer"
                                  onClick={() => OpenCleaningModal(log._id)}
                                  color={
                                    successRobotCount[log.robot_no] > 1
                                      ? "success"
                                      : ""
                                  }
                                >
                                  {log.robot_no}
                                </CTableDataCell>

                                {/* STATUS */}
                                <CTableDataCell>
                                  {log.cleaning?.finish ? (
                                    <CBadge color="success">Completed</CBadge>
                                  ) : log.cleaning?.battery_dead ? (
                                    <CBadge color="danger">Battery Dead</CBadge>
                                  ) : log.cleaning?.cleaning_cancelled ? (
                                    <CBadge color="danger">
                                      Cleaning Cancelled
                                    </CBadge>
                                  ) : (
                                    <CBadge color="info">In Progress</CBadge>
                                  )}
                                </CTableDataCell>
                                <CTableDataCell>{log.block}</CTableDataCell>
                                <CTableDataCell>{log.row_no}</CTableDataCell>
                                <CTableDataCell>
                                  {log.row_length}
                                </CTableDataCell>
                                <CTableDataCell>
                                  {/* {percentage}% */}
                                  <CProgress className=" ">
                                    <CProgressBar value={percentage}>
                                      {percentage}%
                                    </CProgressBar>
                                  </CProgress>
                                </CTableDataCell>

                                <CTableDataCell>
                                  {log.cleaning?.start &&
                                    new Date(
                                      log.cleaning?.startAt,
                                    ).toLocaleString("en-GB", {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      second: "2-digit",
                                      hour12: true,
                                    })}
                                </CTableDataCell>

                                <CTableDataCell>
                                  {log.cleaning?.finish ? (
                                    new Date(
                                      log.cleaning?.finishAt,
                                    ).toLocaleString("en-GB", {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      second: "2-digit",
                                      hour12: true,
                                    })
                                  ) : log.cleaning?.battery_dead ? (
                                    <CBadge color="danger">Battery Dead</CBadge>
                                  ) : log.cleaning?.cleaning_cancelled ? (
                                    <CBadge color="danger">
                                      Cleaning Cancelled
                                    </CBadge>
                                  ) : (
                                    <CBadge color="info">In Progress</CBadge>
                                  )}
                                </CTableDataCell>

                                <CTableDataCell>
                                  {log.cleaning?.battery_before_cleaning ||
                                    "N/A"}
                                </CTableDataCell>

                                <CTableDataCell>
                                  {log.cleaning?.battery_after_cleaning ||
                                    "N/A"}
                                </CTableDataCell>
                              </CTableRow>
                            );
                          })
                        ) : (
                          <CTableRow>
                            <CTableDataCell colSpan="11" className="text-start">
                              No logs found for the selected date.
                            </CTableDataCell>
                          </CTableRow>
                        )}
                      </CTableBody>
                    </CTable>
                  </CTabPanel>

                  {/* Cleaning In Progress */}
                  <CTabPanel itemKey="in-progress">
                    <CRow className="my-2 justify-content-end">
                      <CCol md={2}>
                        <CFormInput
                          placeholder="Search Robot No..."
                          value={progressSearch}
                          onChange={(e) => setProgressSearch(e.target.value)}
                        />
                      </CCol>

                      <CCol md={2}>
                        <select
                          className="form-select"
                          value={progressBlock}
                          onChange={(e) => setProgressBlock(e.target.value)}
                        >
                          <option value="">All Blocks</option>
                          {getBlocks(cleaning_in_progress).map((block) => (
                            <option key={block} value={block}>
                              {block}
                            </option>
                          ))}
                        </select>
                      </CCol>
                    </CRow>
                    <CTable
                      bordered
                      hover
                      responsive
                      className="text-center bg-important"
                    >
                      <CTableHead color="secondary">
                        <CTableRow>
                          <CTableHeaderCell>#</CTableHeaderCell>
                          <CTableHeaderCell>Robot No</CTableHeaderCell>
                          <CTableHeaderCell>Started At</CTableHeaderCell>
                          <CTableHeaderCell>
                            Cleaning Percentage
                          </CTableHeaderCell>
                          <CTableHeaderCell>Block</CTableHeaderCell>
                          <CTableHeaderCell>Status</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>

                      <CTableBody>
                        {filteredProgress?.length > 0 ? (
                          filteredProgress.map((log, index) => {
                            const lastPoint = log.track_details?.length
                              ? log.track_details[log.track_details.length - 1]
                                  .point
                              : 0;

                            const { percentage } = getCleaningPercentage(
                              lastPoint,
                              log,
                            );
                            return (
                              <CTableRow key={index}>
                                <CTableDataCell>{index + 1}</CTableDataCell>
                                <CTableDataCell
                                  className="cursor-pointer"
                                  onClick={() => OpenCleaningModal(log._id)}
                                  color={
                                    inProgressRobotCount[log.robot_no] > 1
                                      ? "warning"
                                      : ""
                                  }
                                >
                                  {log.robot_no}
                                </CTableDataCell>
                                <CTableDataCell>
                                  {log.cleaning?.start &&
                                    new Date(
                                      log.cleaning?.startAt,
                                    ).toLocaleString("en-GB", {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      second: "2-digit",
                                      hour12: true,
                                    })}
                                </CTableDataCell>
                                <CTableDataCell>
                                  <CProgress className=" ">
                                    <CProgressBar value={percentage}>
                                      {percentage}%
                                    </CProgressBar>
                                  </CProgress>
                                </CTableDataCell>
                                <CTableDataCell>{log.block}</CTableDataCell>
                                <CTableDataCell>
                                  <CBadge color="info">In Progress</CBadge>
                                </CTableDataCell>
                              </CTableRow>
                            );
                          })
                        ) : (
                          <CTableRow>
                            <CTableDataCell colSpan={6} className="text-start">
                              No Cleaning In Progress logs found for the
                              selected date.
                            </CTableDataCell>
                          </CTableRow>
                        )}
                      </CTableBody>
                    </CTable>
                  </CTabPanel>

                  {/* Failure Logs */}
                  <CTabPanel itemKey="error-logs">
                    <CRow className="my-2 justify-content-end">
                      <CCol md={2}>
                        <CFormInput
                          placeholder="Search Robot No..."
                          value={failureSearch}
                          onChange={(e) => setFailureSearch(e.target.value)}
                        />
                      </CCol>

                      <CCol md={2}>
                        <select
                          className="form-select"
                          value={failureBlock}
                          onChange={(e) => setFailureBlock(e.target.value)}
                        >
                          <option value="">All Blocks</option>
                          {getBlocks(cleaning_failures).map((block) => (
                            <option key={block} value={block}>
                              {block}
                            </option>
                          ))}
                        </select>
                      </CCol>
                    </CRow>
                    <CTable
                      bordered
                      hover
                      responsive
                      className="text-center bg-important"
                    >
                      <CTableHead color="secondary">
                        <CTableRow>
                          <CTableHeaderCell>#</CTableHeaderCell>
                          <CTableHeaderCell>Robot No</CTableHeaderCell>
                          <CTableHeaderCell>Block</CTableHeaderCell>
                          {/* <CTableHeaderCell>Is Duplicate</CTableHeaderCell> */}
                          <CTableHeaderCell>startAt</CTableHeaderCell>
                          <CTableHeaderCell>
                            Cleaning Percentage
                          </CTableHeaderCell>
                          <CTableHeaderCell>Error Type</CTableHeaderCell>
                          <CTableHeaderCell>Comments</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>

                      <CTableBody>
                        {filteredFailure?.length > 0 ? (
                          filteredFailure.map((log, index) => {
                            const lastPoint = log.track_details?.length
                              ? log.track_details[log.track_details.length - 1]
                                  .point
                              : 0;

                            const { percentage } = getCleaningPercentage(
                              lastPoint,
                              log,
                            );

                            return (
                              <CTableRow key={index}>
                                <CTableDataCell>{index + 1}</CTableDataCell>
                                <CTableDataCell
                                  className="cursor-pointer"
                                  onClick={() => OpenCleaningModal(log._id)}
                                  color={
                                    failureRobotCount[log.robot_no] > 1
                                      ? "danger"
                                      : ""
                                  }
                                >
                                  {log.robot_no}
                                </CTableDataCell>
                                <CTableDataCell>{log.block}</CTableDataCell>
                                {/* <CTableDataCell>
                                {log.is_duplicate ? (
                                  <CBadge color="danger">Yes</CBadge>
                                ) : (
                                  <CBadge color="success">No</CBadge>
                                )}
                              </CTableDataCell> */}
                                <CTableDataCell>
                                  {log.createdAt &&
                                    new Date(log.createdAt).toLocaleString(
                                      "en-GB",
                                      {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit",
                                        hour12: true,
                                      },
                                    )}
                                </CTableDataCell>
                                <CTableDataCell>
                                  <CProgress>
                                    <CProgressBar value={percentage}>
                                      {/* <span className="text-white"> */}
                                      {percentage}%{/* </span> */}
                                    </CProgressBar>
                                  </CProgress>
                                </CTableDataCell>
                                <CTableDataCell>
                                  {log.cleaning?.battery_dead
                                    ? "In Complete"
                                    : "Cleaning Cancelled"}
                                </CTableDataCell>
                                <CTableDataCell>{log.comments}</CTableDataCell>
                              </CTableRow>
                            );
                          })
                        ) : (
                          <CTableRow>
                            <CTableDataCell colSpan={7} className="text-start">
                              No error logs found for the selected date.
                            </CTableDataCell>
                          </CTableRow>
                        )}
                      </CTableBody>
                    </CTable>

                    {/* <h4 className="my-3  border-top">Testing Error Cycles</h4>
                    <ErrorCycles errorlogs={failureLogs} /> */}
                  </CTabPanel>

                  {/* ============ OFFLINE ROBOTS TAB ================= */}
                  {/* ================================================= */}
                  <CTabPanel itemKey="offline-robots">
                    <CRow className="my-2 justify-content-end">
                      <CCol md={2}>
                        <CFormInput
                          placeholder="Search Robot No..."
                          value={offlineSearch}
                          onChange={(e) => setOfflineSearch(e.target.value)}
                        />
                      </CCol>

                      <CCol md={2}>
                        <select
                          className="form-select"
                          value={offlineBlock}
                          onChange={(e) => setOfflineBlock(e.target.value)}
                        >
                          <option value="">All Blocks</option>
                          {getBlocks(offline_robots_at_time_of_cleaning).map(
                            (block) => (
                              <option key={block} value={block}>
                                {block}
                              </option>
                            ),
                          )}
                        </select>
                      </CCol>
                    </CRow>
                    <CTable
                      bordered
                      hover
                      responsive
                      className="text-center bg-important"
                    >
                      <CTableHead color="secondary">
                        <CTableRow>
                          <CTableHeaderCell>#</CTableHeaderCell>
                          <CTableHeaderCell>Robot No</CTableHeaderCell>
                          <CTableHeaderCell>Block</CTableHeaderCell>
                          <CTableHeaderCell>Timer At</CTableHeaderCell>
                          <CTableHeaderCell>Error Type</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>

                      <CTableBody>
                        {filteredOffline?.length > 0 ? (
                          filteredOffline.map((log, index) => (
                            <CTableRow key={index}>
                              <CTableDataCell>{index + 1}</CTableDataCell>
                              <CTableDataCell>{log.robot_no}</CTableDataCell>
                              <CTableDataCell>{log.block}</CTableDataCell>
                              <CTableDataCell>
                                {log.createdAt &&
                                  new Date(log.createdAt).toLocaleString(
                                    "en-GB",
                                    {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      second: "2-digit",
                                      hour12: true,
                                    },
                                  )}
                              </CTableDataCell>

                              <CTableDataCell>{log.error_type}</CTableDataCell>
                            </CTableRow>
                          ))
                        ) : (
                          <CTableRow>
                            <CTableDataCell colSpan={5} className="text-start">
                              No offline Robots found for the selected date.
                            </CTableDataCell>
                          </CTableRow>
                        )}
                      </CTableBody>
                    </CTable>
                    {/* <h4 className="my-3  border-top">Offline Robots Cycles</h4>
                    <OfflineRobotsCycle
                      offlineLogs={offlineRobots}
                      loading={offlineRobotLoading}
                      error={offlineRobotError}
                    /> */}
                  </CTabPanel>

                  {/* ============online–command-given-not-started TAB ================= */}
                  {/* ================================================= */}
                  <CTabPanel itemKey="online–command-given-not-started">
                    <CRow className="my-2 justify-content-end">
                      <CCol md={2}>
                        <CFormInput
                          placeholder="Search Robot No..."
                          value={notStartedSearch}
                          onChange={(e) => setNotStartedSearch(e.target.value)}
                        />
                      </CCol>

                      <CCol md={2}>
                        <select
                          className="form-select"
                          value={notStartedBlock}
                          onChange={(e) => setNotStartedBlock(e.target.value)}
                        >
                          <option value="">All Blocks</option>
                          {getBlocks(not_started_robots).map((block) => (
                            <option key={block} value={block}>
                              {block}
                            </option>
                          ))}
                        </select>
                      </CCol>
                    </CRow>
                    <CTable
                      bordered
                      hover
                      responsive
                      className="text-center bg-important"
                    >
                      <CTableHead color="secondary">
                        <CTableRow>
                          <CTableHeaderCell>#</CTableHeaderCell>
                          <CTableHeaderCell>Robot No</CTableHeaderCell>
                          <CTableHeaderCell>Block</CTableHeaderCell>
                          <CTableHeaderCell>Online Status</CTableHeaderCell>
                          <CTableHeaderCell>Last Uplink</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>

                      <CTableBody>
                        {filteredNotStarted?.length > 0 ? (
                          filteredNotStarted.map((log, index) => (
                            <CTableRow
                              key={index}
                              color={
                                notStartedRobotCount[log.robot_no] > 1
                                  ? "danger"
                                  : ""
                              }
                            >
                              <CTableDataCell>{index + 1}</CTableDataCell>
                              <CTableDataCell>{log.robot_no}</CTableDataCell>
                              <CTableDataCell>{log.block}</CTableDataCell>
                              <CTableDataCell>
                                {log.lora_state ? (
                                  <CBadge color="success">Online</CBadge>
                                ) : (
                                  <CBadge color="danger">Offline</CBadge>
                                )}
                              </CTableDataCell>
                              {/* <CTableDataCell>{log.createdAt}</CTableDataCell> */}

                              <CTableDataCell>
                                {log.last_uplink &&
                                  new Date(log.last_uplink).toLocaleString(
                                    "en-GB",
                                    {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      second: "2-digit",
                                      hour12: true,
                                    },
                                  )}
                              </CTableDataCell>
                            </CTableRow>
                          ))
                        ) : (
                          <CTableRow>
                            <CTableDataCell colSpan={5} className="text-start">
                              No Robots Found
                            </CTableDataCell>
                          </CTableRow>
                        )}
                      </CTableBody>
                    </CTable>
                  </CTabPanel>

                  {/* Technician DPR Robots */}
                  <CTabPanel itemKey="technician-dpr-logs">
                    <CTable
                      bordered
                      hover
                      responsive
                      className="text-center bg-important"
                    >
                      <CTableHead color="secondary">
                        <CTableRow>
                          <CTableHeaderCell>Sr</CTableHeaderCell>
                          <CTableHeaderCell>Date</CTableHeaderCell>
                          <CTableHeaderCell>Site</CTableHeaderCell>
                          {/* <CTableHeaderCell>
                            Operational Robots
                          </CTableHeaderCell>
                          <CTableHeaderCell>Failed Robots</CTableHeaderCell>
                          <CTableHeaderCell>Total Robots</CTableHeaderCell>
                          <CTableHeaderCell>FromLog (Success)</CTableHeaderCell> */}
                          <CTableHeaderCell>Remarks</CTableHeaderCell>
                          <CTableHeaderCell>Technician</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>

                      <CTableBody>
                        {dpr?.length > 0 ? (
                          dpr.map((log, index) => {
                            const technician =
                              log.technician_present?.[0]?.name || "-";
                            const reportDate = log.report_date
                              ? new Date(log.report_date).toLocaleDateString()
                              : "-";

                            return (
                              <CTableRow key={index}>
                                <CTableDataCell>{index + 1}</CTableDataCell>
                                <CTableDataCell>{reportDate}</CTableDataCell>
                                <CTableDataCell>{log.site_id}</CTableDataCell>
                                {/* <CTableDataCell>
                                  {log.total_running_robots}
                                </CTableDataCell>
                                <CTableDataCell>
                                  {log.total_failed_robots}
                                </CTableDataCell>
                                <CTableDataCell>
                                  {log.total_robots}
                                </CTableDataCell> */}
                                {/* <CTableDataCell>
                                 <span
                                  className={`badge ${
                                    cleaningSuccessMap?.[log.site_id]
                                      ? "bg-success"
                                      : "bg-danger"
                                  }`}
                                >
                                  {cleaningSuccessMap?.[log.site_id] || 0}
                                </span> 
                                </CTableDataCell> */}
                                <CTableDataCell>
                                  {log.comments || "-"}
                                </CTableDataCell>
                                <CTableDataCell>{technician}</CTableDataCell>
                              </CTableRow>
                            );
                          })
                        ) : (
                          <CTableRow>
                            <CTableDataCell colSpan={9} className="text-start">
                              No DPR logs found for the selected date.
                            </CTableDataCell>
                          </CTableRow>
                        )}
                      </CTableBody>
                    </CTable>{" "}
                  </CTabPanel>
                </CTabContent>
              </CTabs>
              <Logmodal
                _id={selectedLogId}
                modalState={modalOpen}
                authtoken={authtoken}
                userInfo={userInfo}
                onClose={() => setModalOpen(false)}
              />
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ClientCleaningLog;
