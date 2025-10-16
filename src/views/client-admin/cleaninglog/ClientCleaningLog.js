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
  // const [startDate, setEndDate] = useState(
  //   new Date().toISOString().split("T")[0]
  // );
  // const [pageInput, setPageInput] = useState("");
  // const [page, setPage] = useState(1);
  // const [limit, setLimit] = useState(10);

  useEffect(() => {
    // const fetchCleaningLogs = async () => {
    //   let pagination = {
    //     pg: page,
    //     limit: limit,
    //   };
    //   try {
    //     dispatch({ type: "FETCH_CLEANING_REQUEST" });
    //     const result = await axios.post(
    //       `/api/v1/cleaninglogs/${startDate}/${startDate}/${site_id}`,
    //       pagination,
    //       {
    //         headers: {
    //           Authorization: `Bearer ${authtoken}`,
    //         },
    //       }
    //     );
    //     let total = Math.ceil(
    //       Number(result.data.total) / Number(result.data.limit)
    //     );
    //     let next = result.data.hasNextPage;
    //     let prev = result.data.hasPrevPage;
    //     const data = result.data.data;
    //     dispatch({
    //       type: "FETCH_CLEANING_SUCCESS",
    //       payload: {
    //         cleaninglogs: data,
    //         totalPages: total,
    //         hasNextPage: next,
    //         hasPrevPage: prev,
    //       },
    //     });
    //   } catch (error) {
    //     dispatch({
    //       type: "FETCH_FAIL",
    //       payload: error.response?.data?.error || error.message,
    //       subscriptiondata: error.response?.data?.data,
    //       subscriptionStatus: error.response?.data.subscriptionStatus,
    //     });
    //     toast.error(error.response?.data?.error || error.message);
    //   }
    // };
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
            cleaninglogs: data,
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

    const fetchErrorLogs = async () => {
      try {
        dispatch({ type: "FETCH_ERROR_LOGS_REQUEST" });
        const response = await axios.get(
          `/api/v1/errorlogs/site-error-logs/${site_id}/${startDate}/${startDate}`,
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
        dispatch({
          type: "FETCH_ERROR_LOGS_FAIL",
          payload: error.response?.data?.error || error.response?.data?.message,
          subscriptiondata: error.response?.data?.data,
          subscriptionStatus: error.response?.data.subscriptionStatus,
        });
        toast.error(
          error.response?.data?.error || error.response?.data?.message
        );
      }
    };

    const fetchTimerLogs = async () => {
      try {
        dispatch({ type: "FETCH_TIMER_LOGS_REQUEST" });
        const response = await axios.get(
          `/api/v1/weathertimerupdatenotification/get-weather-timer-update-notification/${site_id}/${startDate}/${startDate}`,
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
    fetchErrorLogs();
    fetchTimerLogs();
  }, [site_id, startDate, authtoken]);

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
        "Start Time",
        "Start Battery (%)",
        "Finish Battery (%)",
        "Finish Time",
        "Status",
      ]);
      cleaninglogs.forEach((log, index) => {
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

    // 3. Error Logs
    // mergedData.push(["Error Logs"]);
    // if (hasErrorLogs) {
    //   mergedData.push(["Sr No", "Robot No", "Block", "Error Type", "Date"]);
    //   errorLogs.forEach((log, index) => {
    //     const errorDate = log.date ? new Date(log.date) : null;
    //     mergedData.push([
    //       index + 1,
    //       log.robot_no || "N/A",
    //       log.block || "N/A",
    //       log.error_type || "N/A",
    //       errorDate ? errorDate.toLocaleDateString() : "N/A",
    //     ]);
    //   });
    // } else {
    //   mergedData.push(["No error logs data available"]);
    // }
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
              {/* Timer Update Notifications Table - Comes First */}
              <h5 className="mt-3 mb-3">⏱ Timer Update Notifications</h5>
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
                      <CTableDataCell colSpan={4} className="  text-start ">
                        No timer update notifications found for the selected
                        date.
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>

              {/* Cleaning Logs Table */}
              <h5 className="mt-2 mb-3">🤖 Cleaning Logs</h5>
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
                  {cleaninglogs.length > 0 ? (
                    cleaninglogs.map((log, index) => (
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
              {/* <h5 className="mt-5 mb-3">🚨 Error Logs for</h5> */}
              {/* <CTable
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
                      <CTableDataCell colSpan={5} className=" text-start ">
                        No error logs found for the selected date.
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable> */}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ClientCleaningLog;
