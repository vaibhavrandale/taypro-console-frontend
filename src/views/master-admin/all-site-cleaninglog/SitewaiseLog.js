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
  CCard,
  CCardBody,
  CCardHeader,
  CSpinner,
  CButton,
  CFormSelect, // Import Loading Spinner
} from "@coreui/react";
import { cleaning_log } from "../../../data"; // Import cleaning logs data
import { useParams } from "react-router-dom";
// import * as XLSX from 'xlsx'; // Import xlsx for Excel export
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import axios from "axios";
import LoadingSpinner from "../../../components/LoadingSpinner";
import PaginateInput from "../../../components/PaginateInput";
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        cleaninglogs: action.payload.data,
        totalPages: action.payload.totalPages, // Use API-provided totalPages
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    // case "FETCH_SITES_REQUEST":
    //   return { ...state, loadingSites: true, error: "" };
    // case "FETCH_SITES_SUCCESS":
    //   return {
    //     ...state,
    //     loadingSites: false,
    //     sites: action.payload,
    //   };
    // case "FETCH_SITES_FAIL":
    //   return { ...state, loadingSites: false, error: action.payload };

    default:
      return state;
  }
};

const SitewaiseLog = () => {
  const [
    {
      loading,
      cleaninglogs,
      // sites,
      totalPages,
      hasNextPage,
      hasPrevPage,
      loadingSites,
    },
    dispatch,
  ] = useReducer(reducer, {
    cleaninglogs: [],
    // sites: [],
    loading: false,
    // loadingSites: false,
    error: "",
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  // const userInfo = useSelector((state) => state.userInfo);
  const authtoken = useSelector((state) => state.authtoken);
  const { site_id } = useParams();
  const [selectedDate, setSelectedDate] = useState("");
  // const [filteredLogs, setFilteredLogs] = useState([]);

  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedsite, setSelectedsiteid] = useState("all");
  const [pageInput, setPageInput] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  useEffect(() => {
    // const fetchSites = async () => {
    //   dispatch({ type: "FETCH_SITES_REQUEST" });
    //   try {
    //     const result = await axios.get(`/api/v1/sites`, {
    //       headers: { Authorization: `Bearer ${authtoken}` },
    //     });
    //     dispatch({
    //       type: "FETCH_SITES_SUCCESS",
    //       payload: result.data.data,
    //     });
    //   } catch (error) {
    //     dispatch({
    //       type: "FETCH_SITES_FAIL",
    //       payload: error.response.data.error,
    //     });
    //     toast.error("Failed to fetch sites");
    //   }
    // };

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
              Authorization: `Bearer ${authtoken}`, // Attach Authorization token
            },
          }
        );
        let total = Math.ceil(
          Number(result.data.total) / Number(result.data.limit)
        );
        let next = result.data.hasNextPage;
        let prev = result.data.hasPrevPage;
        // setUsers(filteredUsers)
        const data = result.data.data;
        dispatch({
          type: "FETCH_SUCCESS",
          payload: {
            data: data,
            totalPages: total,
            hasNextPage: next,
            hasPrevPage: prev,
          },
        });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: error.response.data.error,
        });
        toast.error(error.response ? error.response.data.error : error.message);
      }
    };

    fetchCleaningLogs();
    // fetchSites();
  }, [authtoken, endDate, limit, page, site_id, startDate]);

  // Function to export data to Excel

  const handleSiteNameChange = (e) => {
    const site = e.target.value;
    setSelectedsiteid(site); // Updates local state
  };

  // 🔽 Export to CSV Function
  const exportToCSV = () => {
    if (cleaninglogs.length === 0) {
      toast.error("No data available to export.");
      return;
    }

    const csvHeader = [
      "Sr,Robot No,Row Number,Row Length (Meters),Cleaning Date,Cleaning Start Time,Battery Start (%),Cleaning Finished Time,Battery Finished (%),Distance Covered (Meters),Status",
    ];

    const csvRows = cleaninglogs.map((log, index) => {
      const startBattery = log.start_battery_percentage ?? "";
      const endBattery = log.finish_battery_percentage ?? "";

      // Convert timestamps properly
      const cleaningDate = log.start_timestamp
        ? new Date(log.start_timestamp).toISOString().split("T")[0]
        : "";
      const cleaningStartTime = log.start_timestamp
        ? new Date(log.start_timestamp).toLocaleTimeString()
        : "";
      const cleaningFinishedTime = log.finish_timestamp
        ? new Date(log.finish_timestamp).toLocaleTimeString()
        : "";

      return [
        index + 1,
        log.robot_no ?? "",
        log.row_number ?? "",
        log.row_length ?? "",
        cleaningDate,
        cleaningStartTime,
        startBattery,
        cleaningFinishedTime,
        endBattery,
        log.calculated_distance ?? "",
        log.cleaning_status ?? "",
      ]
        .map((field) => `"${field}"`) // Wrap fields in quotes to avoid issues
        .join(",");
    });

    const csvContent = [csvHeader, ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Cleaning_Log_${site_id}_${startDate}_To_${endDate}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
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
      <h4 className="mb-4">
        📝 Cleaning Log Report of -&nbsp;
        <span className="text-danger">{site_id}</span>
      </h4>

      <form>
        <CRow className="my-3">
          {/* Inputs aligned to the left */}
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

          {/* Export Button - Right Aligned on Desktop, Centered on Mobile */}
          <CCol
            md={5}
            xs={12}
            className="d-flex justify-content-md-end justify-content-center align-items-center mt-2 mt-md-0"
          >
            <CButton color="primary" size="sm" onClick={exportToCSV}>
              Export
            </CButton>
          </CCol>
        </CRow>
      </form>

      {/* 📝 Show Table Only if Date is Selected */}

      {/* 🔄 Loading Indicator */}
      {loading ? (
        <div className="text-center my-4">
          <CSpinner color="primary" />
        </div>
      ) : (
        <>
          <CTable bordered hover responsive className="text-center">
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
                          {/* {log.finish_timestamp} */}
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
            handleLimitChange={setLimit} // New prop
          />
        </>
      )}
    </div>
  );
};

export default SitewaiseLog;
