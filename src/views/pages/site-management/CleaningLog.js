// import React from 'react';

// const CleaningLog = () => {
//   return <div>CleaningLog</div>;
// };

// export default CleaningLog;

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
  CInputGroup,
  CButton,
} from "@coreui/react";
// import { cleaning_log } from "../../../data"; // Import debug log data
import { useLocation, useNavigate, useParams } from "react-router-dom";
import * as XLSX from "xlsx"; // Import xlsx for Excel export
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import axios from "axios";
import LoadingSpinner from "../../../components/LoadingSpinner";
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      // return { ...state, cleaninglogs: action.payload, loading: false };
      return {
        ...state,
        cleaninglogs: action.payload.data,
        totalPages: action.payload.totalPages, // Use API-provided totalPages
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
  const { robot_no } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const page = parseInt(queryParams.get("pg")) || 1;
  const limit = parseInt(queryParams.get("limit")) || 10;
  const [searchTerm, setSearchTerm] = useState("");

  const authtoken = useSelector((state) => state.authtoken);

  useEffect(() => {
    const fetchDownlink = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });

        const { data } = await axios.get(
          `/api/v1/rawcleaninglogs/robot/${robot_no}?pg=${page}&limit=${limit}`,
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );

        let total = Math.ceil(Number(data.total) / Number(data.limit));
        let next = data.hasNextPage;
        let prev = data.hasPrevPage;

        dispatch({
          type: "FETCH_SUCCESS",
          payload: {
            data: data.data,
            totalPages: total,
            hasNextPage: next,
            hasPrevPage: prev,
          },
        });

        // console.log(data.data);
      } catch (error) {
        console.log(error.response.data.error);

        dispatch({
          type: "FETCH_FAIL",
          payload: error.response.data.error || "Failed to fetch data",
        });
        toast.error(error.response.data.error || "Failed to fetch data");
      }
    };

    fetchDownlink();
  }, [authtoken, limit, page, robot_no]);

  // Filter logs based on robot_no
  const filteredRobotLogs = cleaninglogs.filter(
    (log) => log.robot_no === robot_no
  );

  // Search by robot_no or topic
  const filteredLogs = filteredRobotLogs.filter(
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

    // Convert JSON to sheet
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

    // Trigger download
    XLSX.writeFile(workbook, `CleaningLogs_${robot_no}.xlsx`);
  };

  const handlePageChange = (newPage) => {
    navigate(`?pg=${newPage}&limit=${limit}`);
  };

  return (
    <div>
      <CCard className="shadow-0 border-0">
        <CCardBody>
          <CRow className="justify-content-between my-3">
            <CCol md={4} className="text-end">
              {" "}
              <h5 className="text-primary text-center">
                <span className="text-danger">{robot_no}</span> - Cleaning Logs
              </h5>
            </CCol>
            <CCol md={2} className="text-end">
              <CButton
                color="success"
                className="btn-sm m-1 shadow-sm text-white"
                onClick={exportToExcel}
              >
                Export to Excel
              </CButton>
            </CCol>
          </CRow>

          {/* Search Bar */}
          <CRow className="justify-content-end my-3">
            <CCol md={4}>
              <CInputGroup className="mb-3">
                <CFormInput
                  type="text"
                  placeholder="Search by Robot No or Topic or data..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </CInputGroup>
            </CCol>
          </CRow>

          <div className="table-responsive">
            <CTable striped responsive hover bordered>
              <CTableHead color="secondary">
                <CTableRow>
                  <CTableHeaderCell>#</CTableHeaderCell>
                  <CTableHeaderCell
                    className="text-center"
                    style={{ minWidth: "140px" }}
                  >
                    Robot No
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    className="text-center"
                    style={{ minWidth: "140px" }}
                  >
                    Deveui
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    className="text-center"
                    style={{ minWidth: "150px" }}
                  >
                    Data
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    className="text-center"
                    style={{ minWidth: "170px" }}
                  >
                    Timestamp (D/M/Y)
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    className="text-center"
                    style={{ minWidth: "140px" }}
                  >
                    Topic
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {loading ? (
                  <CTableRow>
                    <CTableHeaderCell className="text-center" colSpan={6}>
                      <LoadingSpinner />
                    </CTableHeaderCell>{" "}
                  </CTableRow>
                ) : error ? (
                  <CTableRow>
                    <CTableHeaderCell className="text-center" colSpan={6}>
                      {error}
                    </CTableHeaderCell>{" "}
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
                      <CTableHeaderCell>{index + 1}</CTableHeaderCell>
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
                        {new Date(log.createdAt).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: true,
                        })}
                      </CTableDataCell>

                      <CTableDataCell className="text-center">
                        {log.topic}
                      </CTableDataCell>
                    </CTableRow>
                  ))
                )}
              </CTableBody>
            </CTable>
            <CRow className="mt-3">
              <CCol className="d-flex justify-content-end">
                <CButton
                  color="secondary"
                  disabled={!hasPrevPage}
                  onClick={() => handlePageChange(page - 1)}
                  className="mx-1"
                  size="sm"
                >
                  Prev
                </CButton>

                {Array.from({ length: totalPages }, (_, i) => (
                  <CButton
                    key={i + 1}
                    color={page === i + 1 ? "primary" : ""}
                    onClick={() => handlePageChange(i + 1)}
                    className="mx-1"
                  >
                    {i + 1}
                  </CButton>
                ))}

                <CButton
                  color="secondary"
                  disabled={!hasNextPage}
                  onClick={() => handlePageChange(page + 1)}
                  className="mx-1"
                  size="sm"
                >
                  Next
                </CButton>
              </CCol>
            </CRow>
          </div>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default CleaningLog;
