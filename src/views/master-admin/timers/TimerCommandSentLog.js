import {
  CBadge,
  CCol,
  CFormInput,
  CFormSelect,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";
import PaginateInput from "../../../components/PaginateInput";
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_SITES_REQUEST":
      return { ...state, loadingSites: true, sitesError: "" };
    case "FETCH_SITES_SUCCESS":
      return { ...state, loadingSites: false, sites: action.payload };
    case "FETCH_SITES_FAIL":
      return { ...state, loadingSites: false, sitesError: action.payload };

    case "FETCH_TIMER_LOGS_REQUEST":
      return { ...state, loadingTimerLogs: true, timerLogsError: "" };
    case "FETCH_TIMER_LOGS_SUCCESS":
      return {
        ...state,
        loadingTimerLogs: false,

        timerLogs: action.payload.data,
        totalPages: action.payload.totalPages, // Use API-provided totalPages
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
      };
    case "FETCH_TIMER_LOGS_FAIL":
      return {
        ...state,
        loadingTimerLogs: false,
        timerLogsError: action.payload,
      };

    default:
      return state;
  }
};
const TimerCommandSentLog = () => {
  const [
    {
      loadingSites,
      sites,
      sitesError,
      timerLogs,
      loadingTimerLogs,
      timerLogsError,
      totalPages,
      hasNextPage,
      hasPrevPage,
    },
    dispatch,
  ] = useReducer(reducer, {
    sites: [],
    loadingSites: true,
    sitesError: "",
    timerLogs: [],
    loadingTimerLogs: true,
    timerLogsError: "",
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [site_id, setSiteId] = useState("taypro_office");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const authtoken = useSelector((state) => state.authtoken);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pageInput, setPageInput] = useState("");
  useEffect(() => {
    const fetchSites = async () => {
      dispatch({ type: "FETCH_SITES_REQUEST" });
      try {
        const res = await axios.get(`/api/v1/sites`, {
          headers: { Authorization: `Bearer ${authtoken}` },
        });

        const siteData = res.data.data || [];
        dispatch({ type: "FETCH_SITES_SUCCESS", payload: siteData });

        // Set only once on first load
        if (siteData.length > 0 && !site_id) {
          setSiteId(siteData[0].site_id);
        }
      } catch (err) {
        const errorMsg =
          err.response?.data?.error || err.response?.data?.message;
        dispatch({ type: "FETCH_SITES_FAIL", payload: errorMsg });
        toast.error(errorMsg);
      }
    };

    fetchSites();
  }, [authtoken]);

  useEffect(() => {
    if (!site_id) return;

    const fetchTimerLogs = async () => {
      dispatch({ type: "FETCH_TIMER_LOGS_REQUEST" });
      try {
        let pagination = {
          pg: page,
          limit: limit,
        };

        const response = await axios.post(
          `/api/v1/timercommandsentlog/${site_id}/${date}`,
          pagination,
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );

        let total = Math.ceil(
          Number(response.data.total) / Number(response.data.limit)
        );

        dispatch({
          type: "FETCH_TIMER_LOGS_SUCCESS",
          payload: {
            data: response.data.data,
            totalPages: total,
            hasNextPage: response.data.hasNextPage,
            hasPrevPage: response.data.hasPrevPage,
          },
        });
      } catch (err) {
        const errorMsg =
          err.response?.data?.error || err.response?.data?.message;
        dispatch({ type: "FETCH_TIMER_LOGS_FAIL", payload: errorMsg });
        toast.error(errorMsg);
      }
    };

    fetchTimerLogs();
  }, [site_id, date, page, limit, authtoken]);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredLogs = timerLogs.filter(
    (log) =>
      log.robot_no
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      log.block.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );
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
    <div>
      <h4 className="mb-4">Timer Command Status</h4>
      <CRow className="mb-3">
        <CCol md={2}>
          {loadingSites ? (
            <LoadingSpinner />
          ) : sitesError ? (
            sitesError
          ) : (
            <CFormSelect
              id="siteSelect"
              className="p-2"
              value={site_id}
              onChange={(e) => {
                setSiteId(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Select Site</option>
              {sites?.map((site, index) => (
                <option key={index} value={site.site_id}>
                  {site.site_id}
                </option>
              ))}
            </CFormSelect>
          )}
        </CCol>
        <CCol md={2}>
          <CFormInput
            type="date"
            className="p-2"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </CCol>
        <CCol md={4}>
          <CFormInput
            type="text"
            className="p-2"
            placeholder="Search by Robot No or Block"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CCol>
      </CRow>

      <CTable bordered hover responsive>
        <CTableHead color="secondary">
          <CTableRow>
            <CTableHeaderCell>Sr</CTableHeaderCell>
            <CTableHeaderCell>Robot No</CTableHeaderCell>
            <CTableHeaderCell>Site ID</CTableHeaderCell>
            <CTableHeaderCell>Block</CTableHeaderCell>
            <CTableHeaderCell>Is Command Sent?</CTableHeaderCell>
            <CTableHeaderCell>Sent At</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {loadingTimerLogs ? (
            <CTableRow className="text-center">
              <CTableDataCell colSpan={6}>
                <LoadingSpinner />
              </CTableDataCell>
            </CTableRow>
          ) : timerLogsError ? (
            <CTableRow className="text-center">
              <CTableDataCell colSpan={6}>{timerLogsError}</CTableDataCell>
            </CTableRow>
          ) : filteredLogs.length > 0 ? (
            filteredLogs.map((robot, index) => (
              <CTableRow key={index}>
                <CTableDataCell>{index + 1}</CTableDataCell>

                <CTableDataCell>{robot.robot_no}</CTableDataCell>
                <CTableDataCell>{robot.site_id}</CTableDataCell>
                <CTableDataCell>{robot.block}</CTableDataCell>
                <CTableDataCell>
                  {robot.is_sent ? (
                    <CBadge color="success">YES</CBadge>
                  ) : (
                    <CBadge color="danger">NO</CBadge>
                  )}
                </CTableDataCell>
                <CTableDataCell>
                  {new Date(robot.createdAt).toLocaleString("en-GB", {
                    timeZone: "Asia/Kolkata",
                    hour12: true,
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan="6" className="text-start">
                No Robots Found
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
        handleLimitChange={setLimit} // New prop
      />
    </div>
  );
};

export default TimerCommandSentLog;
