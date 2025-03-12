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
// import { debug_log } from "../../../data"; // Import debug log data
import { useParams } from "react-router-dom";
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
      return { ...state, debuglogs: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
const DebugLog = () => {
  const [{ loading, error, debuglogs }, dispatch] = useReducer(reducer, {
    debuglogs: [],
    loading: true,
    error: "",
  });
  const { robot_no } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const authtoken = useSelector((state) => state.authtoken);

  useEffect(() => {
    const fetchDownlink = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });

        const { data } = await axios.get(
          `/api/v1/debuglogs/robot/${robot_no}`,
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );
        // console.log(data);
        dispatch({ type: "FETCH_SUCCESS", payload: data.data });
        // console.log(data.data);
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: error.response?.data || "Failed to fetch data",
        });
        toast.error(error.response?.data || "Failed to fetch data");
      }
    };

    fetchDownlink();
  }, [authtoken, robot_no]);

  // Filter logs based on robot_no
  const filteredRobotLogs = debuglogs
    .filter((log) => log.robot_no === robot_no)
    .reverse();

  // Search by robot_no or topic
  const filteredLogs = filteredRobotLogs
    .filter(
      (log) =>
        (log.robot_no &&
          log.robot_no.toLowerCase().includes(searchTerm.toLowerCase())) ||
        log.data.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.deveui.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.timestamp.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.topic &&
          log.topic.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

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
        Timestamp: log.timestamp,
        Topic: log.topic,
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Debug Logs");

    // Trigger download
    XLSX.writeFile(workbook, `DebugLogs_${robot_no}.xlsx`);
  };

  return (
    <div>
      <CCard className="shadow-0 border-0">
        <CCardBody>
          <CRow className="justify-content-between my-3">
            <CCol md={4} className="text-end">
              {" "}
              <h5 className="text-primary text-center">
                Debug Logs of - <span>{robot_no}</span>
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
              <CTableHead>
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
          </div>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default DebugLog;
