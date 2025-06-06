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
  CCard,
  CCardBody,
  CFormInput,
  CButton,
  CFormCheck,
} from "@coreui/react";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
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
        cleaninglogs: action.payload.data,
        totalPages: action.payload.totalPages,
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const CleaningLog = () => {
  const [
    { loading, error, cleaninglogs, totalPages, hasNextPage, hasPrevPage },
    dispatch,
  ] = useReducer(reducer, {
    cleaninglogs: [],
    loading: true,
    error: "",
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const { robot_no, site_id } = useParams();
  const [fetchBySite, setFetchBySite] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageInput, setPageInput] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // ✅ New Date Filter States
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const authtoken = useSelector((state) => state.authtoken);

  useEffect(() => {
    const fetchCleaningLogs = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });

        let requestBody = {
          pg: page,
          limit: limit,
        };

        if (fetchBySite) {
          requestBody.site_id = site_id;
        } else {
          requestBody.robot_no = robot_no;
        }

        // ✅ Add Dates to Request
        if (startDate && endDate) {
          requestBody.startDate = startDate;
          requestBody.endDate = endDate;
        }

        const response = await axios.post(
          `/api/v1/rawcleaninglogs/get-raw-cleaning-logs`,
          requestBody,
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );

        let total = Math.ceil(
          Number(response.data.total) / Number(response.data.limit)
        );

        dispatch({
          type: "FETCH_SUCCESS",
          payload: {
            data: response.data.data,
            totalPages: total,
            hasNextPage: response.data.hasNextPage,
            hasPrevPage: response.data.hasPrevPage,
          },
        });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: error.response?.data?.error || "Failed to fetch data",
        });
        toast.error(error.response?.data?.error || "Failed to fetch data");
      }
    };

    fetchCleaningLogs();
  }, [
    authtoken,
    limit,
    page,
    robot_no,
    site_id,
    fetchBySite,
    startDate,
    endDate,
  ]);

  const filteredLogs = (
    fetchBySite
      ? cleaninglogs
      : cleaninglogs.filter((log) => log.robot_no === robot_no)
  ).filter(
    (log) =>
      (log.robot_no &&
        log.robot_no.toLowerCase().includes(searchTerm.toLowerCase())) ||
      log.data.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.deveui.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.topic && log.topic.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const exportToExcel = () => {
    if (filteredLogs.length === 0) {
      toast.error("No data available for export.");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(
      filteredLogs.map((log, index) => ({
        "#": index + 1,
        "Robot No": log.robot_no,
        Deveui: log.deveui,
        Data: log.data,
        Timestamp: new Date(log.createdAt).toLocaleString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }),
        Topic: log.topic,
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Cleaning Logs");
    XLSX.writeFile(workbook, `CleaningLogs_${robot_no}.xlsx`);
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
    <div>
      <CCard className="shadow-0 border-0">
        <CCardBody>
          {/* Title row centered */}
          <CRow className="my-2">
            <CCol className="text-center">
              <h5 className="text-primary mb-0">
                <>
                  <span className="text-danger">
                    {" "}
                    {fetchBySite ? site_id : robot_no}
                  </span>{" "}
                  - Cleaning Logs
                </>
              </h5>
            </CCol>
          </CRow>

          {/* Second line: Checkbox left, Export button right */}
          <CRow className="align-items-center justify-content-between my-2">
            <CCol md={6}>
              <CFormCheck
                type="checkbox"
                id="fetchBySite"
                label="Fetch Site Logs"
                checked={fetchBySite}
                onChange={(e) => {
                  setFetchBySite(e.target.checked);
                  setPage(1);
                }}
                style={{
                  cursor: "pointer",
                  transform: "scale(1.1)",
                  marginBottom: "0",
                }}
              />
            </CCol>
            <CCol md={6} className="text-end">
              <CButton
                color="success"
                className="btn-sm shadow-sm text-white"
                onClick={exportToExcel}
              >
                Export to Excel
              </CButton>
            </CCol>
          </CRow>

          {/* Third line: Date filters left, search bar right */}
          <CRow className="align-items-center justify-content-between my-2">
            <CCol md={6} className="d-flex gap-3">
              {/* Start Date */}
              <div className="d-flex flex-column" style={{ minWidth: "150px" }}>
                <label htmlFor="startDate" className="mb-1 fw-semibold">
                  Start Date
                </label>
                <CFormInput
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              {/* End Date */}
              <div className="d-flex flex-column" style={{ minWidth: "150px" }}>
                <label htmlFor="endDate" className="mb-1 fw-semibold">
                  End Date
                </label>
                <CFormInput
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </CCol>

            <CCol md={6}>
              <CFormInput
                type="text"
                placeholder="Search by Robot No or Topic or data..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </CCol>
          </CRow>

          <div className="table-responsive">
            <CTable striped responsive hover bordered>
              <CTableHead color="secondary">
                <CTableRow>
                  <CTableHeaderCell>#</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">
                    Robot No
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center">
                    Deveui
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center">
                    Data
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center">
                    Timestamp
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center">
                    Topic
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {loading ? (
                  <CTableRow>
                    <CTableHeaderCell colSpan={6} className="text-center">
                      <LoadingSpinner />
                    </CTableHeaderCell>
                  </CTableRow>
                ) : error ? (
                  <CTableRow>
                    <CTableHeaderCell colSpan={6} className="text-center">
                      {error}
                    </CTableHeaderCell>
                  </CTableRow>
                ) : filteredLogs.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan="6" className="text-center">
                      No data found
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  filteredLogs.map((log, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell className="text-center">
                        {log.robot_no}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        {log.deveui}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        {log.data}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        {new Date(log.createdAt).toLocaleString("en-GB")}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        {log.topic}
                      </CTableDataCell>
                    </CTableRow>
                  ))
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
          </div>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default CleaningLog;
