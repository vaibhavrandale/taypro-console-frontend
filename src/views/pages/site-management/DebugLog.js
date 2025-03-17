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
} from "@coreui/react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";
import * as XLSX from "xlsx"; // Import xlsx for Excel export

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return {
        ...state,
        debuglogs: action.payload.data,
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

const DebugLog = () => {
  const [
    { loading, error, debuglogs, totalPages, hasNextPage, hasPrevPage },
    dispatch,
  ] = useReducer(reducer, {
    debuglogs: [],
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
    const fetchDebugLogs = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(
          `/api/v1/debuglogs/robot/${robot_no}?pg=${page}&limit=${limit}`,
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
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: error.response?.data || "Failed to fetch data",
        });
        toast.error(error.response?.data || "Failed to fetch data");
      }
    };
    fetchDebugLogs();
  }, [authtoken, robot_no, page, limit]);

  const handlePageChange = (newPage) => {
    navigate(`?pg=${newPage}&limit=${limit}`);
  };

  //   // Search by robot_no or topic
  const filteredLogs = debuglogs.filter(
    (log) =>
      (log.robot_no &&
        log.robot_no.toLowerCase().includes(searchTerm.toLowerCase())) ||
      log.data.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.deveui.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.topic && log.topic.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Function to export data to Excel
  // Function to export data to Excel
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Debug Logs");

    // Trigger download
    XLSX.writeFile(workbook, `DebugLogs_${robot_no}.xlsx`);
  };

  // console.log(totalPages);

  return (
    <CCard>
      <CCardBody>
        <CRow className="justify-content-between my-3">
          <CCol md={4} className="text-end">
            {" "}
            <h5 className=" text-center">
              <span className="text-danger">{robot_no}</span> - Debug Logs
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

        <CTable striped hover responsive>
          <CTableHead color="secondary">
            <CTableRow>
              <CTableHeaderCell>Sr</CTableHeaderCell>
              <CTableHeaderCell>Robot No</CTableHeaderCell>
              <CTableHeaderCell>Data</CTableHeaderCell>
              <CTableHeaderCell>DevEUI</CTableHeaderCell>
              <CTableHeaderCell>Timestamp</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {loading ? (
              <CTableRow>
                <CTableHeaderCell colSpan="5" className="text-center">
                  <LoadingSpinner />
                </CTableHeaderCell>
              </CTableRow>
            ) : error ? (
              <CTableRow>
                <CTableHeaderCell colSpan="5" className="text-center">
                  {error}
                </CTableHeaderCell>
              </CTableRow>
            ) : (
              debuglogs.map((log, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>{log.robot_no}</CTableDataCell>
                  <CTableDataCell>{log.data}</CTableDataCell>
                  <CTableDataCell>{log.deveui}</CTableDataCell>
                  <CTableDataCell>
                    {" "}
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
      </CCardBody>
    </CCard>
  );
};

export default DebugLog;
