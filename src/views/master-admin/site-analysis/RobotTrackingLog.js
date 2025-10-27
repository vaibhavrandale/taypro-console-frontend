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
} from "@coreui/react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import axios from "axios";
import LoadingSpinner from "../../../components/LoadingSpinner";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_CLEANING_REQUEST":
      return { ...state, cleaningLoading: true, cleaningError: "" };
    case "FETCH_CLEANING_SUCCESS":
      return {
        ...state,
        cleaningLoading: false,
        cleaninglogs: action.payload.cleaninglogs,
      };
    case "FETCH_FAIL":
      return {
        ...state,
        cleaningLoading: false,
        cleaningError: action.payload,
      };

    default:
      return state;
  }
};

const RobotTrackingLog = () => {
  const [
    {
      loading,
      cleaninglogs,
      cleaningLoading,
      cleaningError,

      dprLogs,
    },
    dispatch,
  ] = useReducer(reducer, {
    cleaninglogs: [],
    errorLogs: [],
    timerLogs: [],
    dprLogs: [],
    loading: false,
    cleaningError: false,
    error: "",
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
            cleaninglogs: data,
          },
        });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: error.response?.data?.error || error.response?.data?.message,
        });
        toast.error(
          error.response?.data?.error || error.response?.data?.message
        );
      }
    };

    fetchCleaningLogs();
  }, [site_id, startDate, authtoken]);

  // ✅ Place this at the top of your component function, before the `return`:
  const cleaningSuccessMap = {};

  dprLogs?.forEach((log) => {
    const siteId = log.site_id;
    const successCount =
      log.cleaning_logs?.filter((entry) => entry.success === true).length || 0;
    cleaningSuccessMap[siteId] = successCount;
  });

  return (
    <div className="p-4">
      <h3 className=" mb-4">Robot Tracking Cleaning Logs</h3>

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
          </CCol>
        </CRow>
      </form>
      {loading ? (
        <div className="text-center my-4">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          {/* Cleaning Logs Table */}
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
                <CTableHeaderCell>Status</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {cleaningLoading ? (
                <CTableRow>
                  <CTableDataCell colSpan="11" className=" text-start  ">
                    <LoadingSpinner />
                  </CTableDataCell>
                </CTableRow>
              ) : cleaningError ? (
                <CTableRow>
                  <CTableDataCell colSpan="11" className=" text-start  ">
                    {cleaningError}
                  </CTableDataCell>
                </CTableRow>
              ) : cleaninglogs.length > 0 ? (
                cleaninglogs.map((log, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>{index + 1}</CTableDataCell>
                    <CTableDataCell>{log.robot_no}</CTableDataCell>
                    <CTableDataCell>{log.row_no}</CTableDataCell>
                    <CTableDataCell>{log.row_length}</CTableDataCell>
                    <CTableDataCell>
                      {log.cleaning.start &&
                        new Date(log.cleaning.startAt).toLocaleString("en-GB", {
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
        </>
      )}
    </div>
  );
};

export default RobotTrackingLog;
