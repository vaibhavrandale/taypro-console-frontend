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
  CFormLabel,
} from "@coreui/react";
import { useNavigate, useParams } from "react-router-dom";
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
        debuglogs: action.payload.data,
        totalPages: action.payload.totalPages,
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "FETCH_ROBOT_REQUEST":
      return { ...state, loadingRobots: true, errorRobot: "" };
    case "FETCH_ROBOT_SUCCESS":
      return {
        ...state,
        robots: action.payload.data,
        totalPages: action.payload.totalPages, // Use API-provided totalPages
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
        loadingRobots: false,
      };
    case "FETCH_ROBOT_FAIL":
      return { ...state, loadingRobots: false, errorRobot: action.payload };
    default:
      return state;
  }
};

const DebugLog = () => {
  const [
    { loading, error, debuglogs, totalPages, hasNextPage, hasPrevPage, robots },
    dispatch,
  ] = useReducer(reducer, {
    debuglogs: [],
    loading: true,
    error: "",
    robots: [],
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const userInfo = useSelector((state) => state.userInfo);
  const navigate = useNavigate();
  const { robot_no, site_id } = useParams();
  const [fetchBySite, setFetchBySite] = useState(false);
  const [filteredRobot, setFilteredRobot] = useState([]);
  const [robot_number, setRobotNo] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [pageInput, setPageInput] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const authtoken = useSelector((state) => state.authtoken);
  let adminroute = "";

  if (userInfo?.role === "Master Admin") {
    adminroute = "master-admin";
  } else if (userInfo?.role === "Service Admin") {
    adminroute = "service-admin";
  } else if (userInfo?.role === "Project Admin") {
    adminroute = "project-admin";
  } else if (userInfo?.role === "Client Admin") {
    adminroute = "client-admin";
  } else if (userInfo?.role === "Site Incharge") {
    adminroute = "site-incharge";
  } else if (userInfo?.role === "Site Technician") {
    adminroute = "site-technician";
  } else if (userInfo?.role === "Client Site Technician") {
    adminroute = "client-site-technician";
  }

  useEffect(() => {
    const fetchDebugLogs = async () => {
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

        if (startDate && endDate) {
          requestBody.startDate = startDate;
          requestBody.endDate = endDate;
        }

        const response = await axios.post(
          `/api/v1/debuglogs/get-debug-logs`,
          requestBody,
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );

        if (!response.data.success) {
          throw new Error(
            response.data.message || "Failed to fetch debug logs"
          );
        }

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
          payload: error.response?.data?.message || error.message,
        });
        toast.error(error.response?.data?.message || error.message);
      }
    };

    const fetchRobots = async () => {
      try {
        dispatch({ type: "FETCH_ROBOT_REQUEST" });

        const result = await axios.get(`/api/v1/robots/get-robots-no`, {
          headers: { Authorization: `Bearer ${authtoken}` },
        });

        dispatch({
          type: "FETCH_ROBOT_SUCCESS",
          payload: result.data,
        });
      } catch (error) {
        dispatch({
          type: "FETCH_ROBOT_FAIL",
          payload: error.response?.data?.error || error.response?.data?.message,
        });
        toast.error(
          error.response?.data?.error || error.response?.data?.message
        );
      }
    };
    fetchRobots();
    fetchDebugLogs();
  }, [
    authtoken,
    robot_no,
    site_id,
    page,
    limit,
    fetchBySite,
    startDate,
    endDate,
  ]);

  const filteredLogs = debuglogs.filter(
    (log) =>
      (log.robot_no &&
        log.robot_no.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.data && log.data.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.deveui &&
        log.deveui.toLowerCase().includes(searchTerm.toLowerCase())) ||
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
        Deveui: log.deveui || "N/A",
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
        Topic: log.topic || "N/A",
        SNR: log.snr || "N/A",
        RSSI: log.rssi || "N/A",
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Debug Logs");
    XLSX.writeFile(
      workbook,
      `DebugLogs_${fetchBySite ? site_id : robot_no}.xlsx`
    );
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setRobotNo(value);
    if (value.length > 0) {
      const filtered = robots.filter((robot) =>
        robot.robot_no?.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredRobot(filtered);
    } else {
      setFilteredRobot([]);
    }
  };

  const handleSelectRobot = (robot) => {
    setRobotNo(robot.robot_no);
    setFilteredRobot([]);
    navigate(
      `/${adminroute}/site-management/block-management/${robot.site_id}/${robot.block}/${robot.robot_no}/debug_logs`
    );
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
                    {fetchBySite ? site_id : robot_no}
                  </span>{" "}
                  - Debug Logs
                </>
              </h5>
            </CCol>
          </CRow>

          {/* Second line: Checkbox left, Export button right */}
          {/* <CRow className=" d-flex justify-content-between align-items-center flex-wrap ">
            <CCol md={3} sm={12} className=" my-2">
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
            <CCol md={3} sm={12} className="text-end my-2">
              <CButton
                color="success"
                className="btn-sm shadow-sm text-white"
                onClick={exportToExcel}
              >
                Export to Excel
              </CButton>
            </CCol>
          </CRow>

     
          <CRow className=" my-2">
            <CCol md={6} className="d-flex gap-3">
              <div
                className="d-flex flex-column position-relative"
                style={{ minWidth: "150px", width: "100%" }}
              >
                <CFormLabel htmlFor="robotInput">Robot No</CFormLabel>
                <CFormInput
                  id="robotInput"
                  type="text"
                  placeholder="Search by Robot No..."
                  value={robot_number}
                  className="form-control"
                  onChange={handleSearchChange}
                />
                {robot_number && filteredRobot.length > 0 && (
                  <ul
                    className="position-absolute shadow-sm mt-1 px-2 py-2 rounded"
                    style={{
                      top: "100%",
                      left: 0,
                      width: "100%",
                      maxHeight: "200px",
                      overflowY: "auto",
                      zIndex: 1000,
                      backgroundColor: "white",
                    }}
                  >
                    {filteredRobot.map((robot, index) => (
                      <li
                        key={index}
                        className="text-dark px-2 py-1 border-bottom hover:bg-light"
                        style={{ cursor: "pointer", listStyle: "none" }}
                        onClick={() => handleSelectRobot(robot)}
                      >
                        {robot.robot_no}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
         
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

            <CCol className="mt-4" md={4}>
              <CFormInput
                type="text"
                placeholder="Search by Robot No or Topic or data..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </CCol>
          </CRow> */}

          {/* Row: Checkbox Left | Export Button Right */}
          <CRow className="align-items-center gy-2">
            <CCol xs={12} md={6}>
              <CFormCheck
                id="fetchBySite"
                label="Fetch Site Logs"
                checked={fetchBySite}
                onChange={(e) => {
                  setFetchBySite(e.target.checked);
                  setPage(1);
                }}
                className="fw-semibold"
                style={{ cursor: "pointer", transform: "scale(1.05)" }}
              />
            </CCol>

            <CCol xs={12} md={6} className="text-md-end text-start">
              <CButton
                color="success"
                size="sm"
                className="shadow-sm text-white px-4"
                onClick={exportToExcel}
              >
                Export to Excel
              </CButton>
            </CCol>
          </CRow>

          {/* Row: Robot Search + Date Filters + Main Search */}
          <CRow className="gy-3 mt-2">
            {/* Left 3 fields */}
            <CCol md={8}>
              <CRow className="g-3">
                {/* Robot Search with dropdown */}
                <CCol xs={12} md={4}>
                  <label htmlFor="robotInput" className="fw-semibold mb-1">
                    Robot No
                  </label>
                  <div className="position-relative">
                    <CFormInput
                      id="robotInput"
                      type="text"
                      placeholder="Search by Robot No..."
                      value={robot_number}
                      onChange={handleSearchChange}
                    />

                    {robot_number && filteredRobot.length > 0 && (
                      <ul
                        className="position-absolute shadow border bg-white rounded mt-1 p-0"
                        style={{
                          width: "100%",
                          maxHeight: "200px",
                          overflowY: "auto",
                          zIndex: 5000,
                        }}
                      >
                        {filteredRobot.map((robot, index) => (
                          <li
                            key={index}
                            className="px-3 py-2 border-bottom"
                            style={{ cursor: "pointer", listStyle: "none" }}
                            onClick={() => handleSelectRobot(robot)}
                          >
                            {robot.robot_no}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </CCol>

                {/* Start Date */}
                <CCol xs={12} md={4}>
                  <label htmlFor="startDate" className="fw-semibold mb-1">
                    Start Date
                  </label>
                  <CFormInput
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </CCol>

                {/* End Date */}
                <CCol xs={12} md={4}>
                  <label htmlFor="endDate" className="fw-semibold mb-1">
                    End Date
                  </label>
                  <CFormInput
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </CCol>
              </CRow>
            </CCol>

            {/* Right side general search */}
            <CCol md={4} className="my-2">
              <label className="fw-semibold mb-1">Search</label>
              <CFormInput
                type="text"
                placeholder="Search by Robot No, Topic or Data..."
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
                  <CTableHeaderCell
                    style={{ minWidth: "200px" }}
                    className="text-center"
                  >
                    Robot No
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    style={{ minWidth: "200px" }}
                    className="text-center"
                  >
                    Deveui
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    style={{ minWidth: "200px" }}
                    className="text-center"
                  >
                    Data
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    style={{ minWidth: "200px" }}
                    className="text-center"
                  >
                    Timestamp
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    style={{ minWidth: "200px" }}
                    className="text-center"
                  >
                    Topic
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    style={{ minWidth: "100px" }}
                    className="text-center"
                  >
                    SNR
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    style={{ minWidth: "100px" }}
                    className="text-center"
                  >
                    RSSI
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {loading ? (
                  <CTableRow>
                    <CTableHeaderCell colSpan={8} className="text-center">
                      <LoadingSpinner />
                    </CTableHeaderCell>
                  </CTableRow>
                ) : error ? (
                  <CTableRow>
                    <CTableHeaderCell colSpan={8} className="text-center">
                      {error}
                    </CTableHeaderCell>
                  </CTableRow>
                ) : filteredLogs.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan="8" className="text-center">
                      No debug logs found
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  filteredLogs.map((log, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>
                        {(page - 1) * limit + index + 1}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        {log.robot_no}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        {log.deveui || "N/A"}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        {log.data}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        {new Date(log.createdAt).toLocaleString("en-GB")}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        {log.topic || "N/A"}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        {log.snr}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        {log.rssi}
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

export default DebugLog;
