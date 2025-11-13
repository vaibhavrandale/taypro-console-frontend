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
} from "@coreui/react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import axios from "axios";
// import PaginateInput from "../../../components/PaginateInput";
import * as XLSX from "xlsx";
import LoadingSpinner from "../../../components/LoadingSpinner";
import SubscriptionExpiryCard from "../../../components/SubscriptionExpiryCard";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_CLEANING_REQUEST":
      return { ...state, cleaningLoading: true, cleaningError: "" };
    case "FETCH_CLEANING_SUCCESS":
      return {
        ...state,
        cleaningLoading: false,
        cleaninglogs: action.payload.cleaninglogs,
        totalAssignedRobots: action.payload.totalAssignedRobots,
        cleaningCompleted: action.payload.cleaningCompleted,
        cleaningInProgress: action.payload.cleaningInProgress,
        failureLogs: action.payload.failureLogs,
        totalPages: action.payload.totalPages,
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
      };
    case "FETCH_FAIL":
      return {
        ...state,
        cleaningLoading: false,
        cleaningError: action.payload,
        subscriptiondata: action.subscriptiondata,
        subscriptionStatus: action.subscriptionStatus,
      };

    case "FETCH_ERROR_LOGS_REQUEST":
      return { ...state, errLogloading: true, errorLogError: "" };
    case "FETCH_ERROR_LOGS_SUCCESS":
      return { ...state, errorLogs: action.payload, errLogloading: false };
    case "FETCH_ERROR_LOGS_FAIL":
      return {
        ...state,
        errLogloading: false,
        errorLogError: action.payload,
        subscriptiondata: action.subscriptiondata,
        subscriptionStatus: action.subscriptionStatus,
      };

    case "FETCH_TIMER_LOGS_REQUEST":
      return { ...state, timerLogLoading: true, timerLogError: "" };
    case "FETCH_TIMER_LOGS_SUCCESS":
      return { ...state, timerLogs: action.payload, timerLogLoading: false };
    case "FETCH_TIMER_LOGS_FAIL":
      return {
        ...state,
        timerLogError: action.payload,
        timerLogLoading: false,
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
      cleaninglogs,
      cleaningCompleted,
      totalAssignedRobots,
      cleaningInProgress,
      failureLogs,
      errLogloading,
      errorLogError,
      errorLogs,
      timerLogLoading,
      timerLogs,
      timerLogError,
      // totalPages,
      // hasNextPage,
      // hasPrevPage,
      subscriptiondata,
      subscriptionStatus,
    },
    dispatch,
  ] = useReducer(reducer, {
    cleaninglogs: [],
    totalAssignedRobots: 0,
    cleaningCompleted: [],
    cleaningInProgress: [],
    failureLogs: [],
    cleaningLoading: false,
    cleaningError: "",

    errLogloading: false,
    errorLogError: "",
    errorLogs: [],
    subscriptionStatus: "",
    subscriptiondata: {},
    timerLogs: [],
    timerLogLoading: false,
    timerLogError: "",
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const authtoken = useSelector((state) => state.authtoken);
  const { site_id } = useParams();

  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    const fetchCleaningLogs = async () => {
      try {
        dispatch({ type: "FETCH_CLEANING_REQUEST" });
        const result = await axios.post(
          `/api/v1/robot-tracking/sitewise/fetch-cleaninglog/-by-sites-and-date`,
          {
            site_id,
            date: startDate,
          },
          {
            headers: {
              Authorization: `Bearer ${authtoken}`,
            },
          }
        );

        const data = result.data.data;
        dispatch({
          type: "FETCH_CLEANING_SUCCESS",
          payload: {
            totalAssignedRobots: data.totalAssignedRobots || 0,

            cleaninglogs: data.cleaninglogs || [],
            cleaningCompleted: data.cleaningCompleted || [],
            cleaningInProgress: data.cleaningInProgress || [],
            failureLogs: data.failureLogs || [],
            totalPages: data.totalPages || 1,
            hasNextPage: data.hasNextPage || false,
            hasPrevPage: data.hasPrevPage || false,
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
          error.response?.data?.error || error.response?.data?.message
        );
      }
    };

    fetchCleaningLogs();
  }, [site_id, startDate, authtoken]);

  const exportToExcel = () => {
    if (!cleaningCompleted) {
      toast.error("No data available to export.");
      return;
    }

    const mergedData = [];

    // 2. Cleaning Logs
    mergedData.push(["Cleaning Logs"]);
    if (cleaningCompleted) {
      mergedData.push([
        "Sr No",
        "Robot No",
        "Row Number",
        "Row Length (Meters)",
        "Start Time",
        "Start Battery (%)",
        "Finish Battery (%)",
        "Finish Time",
        "Status",
      ]);
      cleaningCompleted.forEach((log, index) => {
        mergedData.push([
          index + 1,
          log.robot_no || "N/A",
          log.row_no || "N/A",
          log.row_length || "N/A",
          log.cleaning.start
            ? new Date(log.cleaning.startAt).toLocaleString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
              })
            : "N/A",
          log.cleaning.battery_before_cleaning
            ? log.cleaning.battery_before_cleaning
            : "N/A",

          log.cleaning.battery_after_cleaning
            ? log.cleaning.battery_after_cleaning
            : "N/A",
          log.cleaning.finish
            ? new Date(log.cleaning.finishAt).toLocaleString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
              })
            : "N/A",
          log.cleaning.finish
            ? "Completed"
            : log.cleaning.battery_dead
            ? "Battery Dead"
            : log.cleaning.cleaning_cancelled
            ? "Cleaning Cancelled"
            : "In Progress",
        ]);
      });
    } else {
      mergedData.push(["No cleaning logs data available"]);
    }
    mergedData.push([]);

    mergedData.push([]);

    // 4. Summary
    mergedData.push(["Summary"]);
    mergedData.push(["Site ID", site_id || "N/A"]);
    mergedData.push([
      "Report Period",
      `${startDate || "N/A"} to ${startDate || "N/A"}`,
    ]);
    mergedData.push(["Generated At", new Date().toLocaleString()]);
    mergedData.push([]);
    mergedData.push(["Data Summary"]);
    mergedData.push([
      "Cleaning Logs",
      cleaningCompleted ? cleaningCompleted.length : 0,
    ]);

    const ws = XLSX.utils.aoa_to_sheet(mergedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "All Logs");

    try {
      XLSX.writeFile(
        wb,
        `Site_${site_id || "Unknown"}_Logs_${startDate || "Start"}_To_${
          startDate || "End"
        }.xlsx`
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

  return (
    <>
      {cleaningLoading || errLogloading || timerLogLoading ? (
        <LoadingSpinner />
      ) : checkStatus.includes(subscriptionStatus) ? (
        <SubscriptionExpiryCard
          data={subscriptiondata}
          subscriptionStatus={subscriptionStatus}
          error={errorLogError || cleaningError || timerLogError}
        />
      ) : errorLogError || cleaningError || timerLogError ? (
        <CAlert className="p-2 w-50" color="danger">
          {errorLogError || cleaningError || timerLogError}
        </CAlert>
      ) : (
        <div className="">
          <div>
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
                {/* <CCol md={3} xs={12} className="m-1">
                  <CFormInput
                    type="date"
                    value={startDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </CCol> */}
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
          </div>
          {timerLogLoading ? (
            <div className="text-center my-4">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              {/* Cleaning Logs Table */}
              <div className="mb-3">
                <CCard className="shadow-sm border-0">
                  <CCardBody className="py-3">
                    <CRow className="align-items-center">
                      <CCol xs="12" md="3" className="mb-2 mb-md-0">
                        <h5 className="fw-bold mb-0">🤖 Cleaning Logs</h5>
                      </CCol>

                      {/* <CCol xs="12" md="9">
                        <div className="d-flex flex-wrap gap-3 justify-content-md-end text-center text-md-end">
                          <CBadge
                            color="secondary"
                            className="px-3 py-2 rounded-pill"
                          >
                            Total:{" "}
                            {cleaningCompleted.length +
                              cleaningInProgress.length +
                              failureLogs.length}
                          </CBadge>

                          <CBadge
                            color="info"
                            className="px-3 py-2 rounded-pill"
                          >
                            In Progress: {cleaningInProgress.length}
                          </CBadge>

                          <CBadge
                            color="success"
                            className="px-3 py-2 rounded-pill"
                          >
                            Completed: {cleaningCompleted.length}
                          </CBadge>

                          <CBadge
                            color="danger"
                            className="px-3 py-2 rounded-pill"
                          >
                            Failure: {failureLogs.length}
                          </CBadge>
                        </div>
                      </CCol> */}
                      <CCol xs="12" md="9">
                        <div className="d-flex flex-wrap gap-3 justify-content-md-end text-center text-md-end">
                          <CBadge
                            color="primary"
                            className="px-3 py-2 rounded-pill"
                          >
                            Total Assigned Robots: {totalAssignedRobots}
                          </CBadge>
                          <CBadge
                            color="secondary"
                            className="px-3 py-2 rounded-pill"
                          >
                            Total Logs:{" "}
                            {cleaningCompleted.length +
                              cleaningInProgress.length +
                              failureLogs.length}
                          </CBadge>
                          <CBadge
                            color="success"
                            className="px-3 py-2 rounded-pill"
                          >
                            Completed: {cleaningCompleted.length}
                          </CBadge>
                          <CBadge
                            color="warning"
                            className="px-3 py-2 rounded-pill"
                          >
                            In Progress: {cleaningInProgress.length}
                          </CBadge>

                          <CBadge
                            color="danger"
                            className="px-3 py-2 rounded-pill"
                          >
                            Failure: {failureLogs.length}
                          </CBadge>
                        </div>
                      </CCol>
                    </CRow>
                  </CCardBody>
                </CCard>
              </div>
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
                    <CTableHeaderCell style={{ minWidth: "130px" }}>
                      Row Number
                    </CTableHeaderCell>
                    <CTableHeaderCell style={{ minWidth: "190px" }}>
                      Row Length (Meters)
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
                    {/* <CTableHeaderCell style={{ minWidth: "190px" }}>
                      Distance Covered (Meters)
                    </CTableHeaderCell> */}
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {cleaningCompleted.length > 0 ? (
                    cleaningCompleted.map((log, index) => (
                      <CTableRow key={index}>
                        <CTableDataCell>{index + 1}</CTableDataCell>
                        <CTableDataCell>{log.robot_no}</CTableDataCell>
                        <CTableDataCell>
                          {log.cleaning.finish ? (
                            <CBadge color="success">Completed</CBadge>
                          ) : log.cleaning.battery_dead ? (
                            <CBadge color="danger">Battery Dead</CBadge>
                          ) : log.cleaning.cleaning_cancelled ? (
                            <CBadge color="danger">Cleaning Cancelled</CBadge>
                          ) : (
                            <CBadge color="info">In Progress</CBadge>
                          )}
                        </CTableDataCell>
                        <CTableDataCell>{log.row_no}</CTableDataCell>
                        <CTableDataCell>{log.row_length}</CTableDataCell>
                        <CTableDataCell>
                          {log.cleaning.start &&
                            new Date(log.cleaning.startAt).toLocaleString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                                hour12: true,
                              }
                            )}
                        </CTableDataCell>
                        <CTableDataCell>
                          {log.cleaning.finish ? (
                            new Date(log.cleaning.finishAt).toLocaleString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                                hour12: true,
                              }
                            )
                          ) : log.cleaning.battery_dead ? (
                            <CBadge color="danger">Battery Dead</CBadge>
                          ) : log.cleaning.cleaning_cancelled ? (
                            <CBadge color="danger">Cleaning Cancelled</CBadge>
                          ) : (
                            <CBadge color="info">In Progress</CBadge>
                          )}
                        </CTableDataCell>
                        <CTableDataCell>
                          {log.cleaning.battery_before_cleaning
                            ? log.cleaning.battery_before_cleaning
                            : "N/A"}
                        </CTableDataCell>
                        <CTableDataCell>
                          {log.cleaning.battery_after_cleaning
                            ? log.cleaning.battery_after_cleaning
                            : "N/A"}
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan="11" className=" text-start  ">
                        No logs found for the selected date.
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>

              {/* <PaginateInput
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
              /> */}

              {/* Error Logs Table */}
              <h5 className="mt-5 mb-3">Cleaning In Progress</h5>
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
                    <CTableHeaderCell>Block</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {cleaningInProgress?.length > 0 ? (
                    cleaningInProgress.map((log, index) => (
                      <CTableRow key={index}>
                        <CTableDataCell>{index + 1}</CTableDataCell>
                        <CTableDataCell>{log.robot_no}</CTableDataCell>
                        <CTableDataCell>
                          {" "}
                          {log.cleaning.start &&
                            new Date(log.cleaning.startAt).toLocaleString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                                hour12: true,
                              }
                            )}
                        </CTableDataCell>
                        <CTableDataCell>{log.block}</CTableDataCell>
                        <CTableDataCell>
                          <CBadge color="info">In Progress</CBadge>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan={5} className=" text-start ">
                        No Cleaning In Progress logs found for the selected
                        date.
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>

              {/* Error Logs Table */}
              <h5 className="mt-5 mb-3">🚨 Error Logs for</h5>
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
                    <CTableHeaderCell>Error Type</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {failureLogs?.length > 0 ? (
                    failureLogs.map((log, index) => (
                      <CTableRow key={index}>
                        <CTableDataCell>{index + 1}</CTableDataCell>
                        <CTableDataCell>{log.robot_no}</CTableDataCell>
                        <CTableDataCell>{log.block}</CTableDataCell>
                        <CTableDataCell>
                          {log.cleaning.battery_dead
                            ? "In Complete"
                            : "Cleaning Cancelled"}
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan={5} className=" text-start ">
                        No error logs found for the selected date.
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ClientCleaningLog;
