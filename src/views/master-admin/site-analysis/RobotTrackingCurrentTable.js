// import React from "react";

// const RobotTrackingCurrentTable = () => {
//   return <div>RobotTrackingCurrentTable</div>;
// };

// export default RobotTrackingCurrentTable;

import React, { useEffect, useReducer, useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CCol,
  CRow,
  CFormSelect,
  CFormInput,
  CButton,
  CAlert,
  CBadge,
} from "@coreui/react";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import moment from "moment";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { useParams } from "react-router-dom";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_ROBOTS_REQUEST":
      return { ...state, loadingRobots: true, robotsError: "" };
    case "FETCH_ROBOTS_SUCCESS":
      return { ...state, loadingRobots: false, robots: action.payload };
    case "FETCH_ROBOTS_FAIL":
      return { ...state, loadingRobots: false, robotsError: action.payload };

    case "FETCH_STATS_REQUEST":
      return { ...state, loadingStats: true, statsError: "" };
    case "FETCH_STATS_SUCCESS":
      return { ...state, loadingStats: false, statsData: action.payload };
    case "FETCH_STATS_FAIL":
      return { ...state, loadingStats: false, statsError: action.payload };

    case "SET_FILTERS":
      return { ...state, filters: { ...state.filters, ...action.payload } };

    case "RESET_STATS":
      return { ...state, statsData: [], statsError: "" };

    default:
      return state;
  }
};

const RobotTrackingCurrentTable = () => {
  const [
    { loadingRobots, loadingStats, robots, statsData, statsError, filters },
    dispatch,
  ] = useReducer(reducer, {
    loadingRobots: true,
    loadingStats: false,
    robots: [],
    statsData: [],
    statsError: "",
    filters: {
      robot_no: "",
      date: "",
      month: moment().format("YYYY-MM"),
    },
  });

  // const authtoken = useSelector((state) => state.authtoken);
  const { site_id } = useParams();
  const [searchTerm, setSearchTerm] = useState("");

  const fetchRobots = async () => {
    dispatch({ type: "FETCH_ROBOTS_REQUEST" });
    try {
      const result = await axios.get(
        `/api/v1/robots/get-all-robots-sitewise/${site_id}`,
        {
          headers: {
            Authorization: `Bearer ${authtoken}`,
          },
        },
      );

      // const robotsList = result?.data?.data?.data || [];
      dispatch({
        type: "FETCH_ROBOTS_SUCCESS",
        payload: result.data.data,
      });
    } catch (error) {
      dispatch({
        type: "FETCH_ROBOTS_FAIL",
        payload: error.response?.data?.error || error.response?.data?.message,
      });
      toast.error(error.response?.data?.error || error.response?.data?.message);
    }
  };

  // Fetch robot current stats
  const fetchCurrentStats = async () => {
    if (!filters.date && !filters.month) {
      toast.error("Please select either a date or month");
      return;
    }

    dispatch({ type: "FETCH_STATS_REQUEST" });

    try {
      const payload = {
        robot_no: filters.robot_no,
        ...(filters.date && { date: filters.date }),
        ...(filters.month && { month: filters.month }),
      };

      const result = await axios.post(
        "/api/v1/robot-tracking/avg-current",
        payload,
        { headers: { Authorization: `Bearer ${authtoken}` } },
      );

      dispatch({ type: "FETCH_STATS_SUCCESS", payload: result.data.data });
    } catch (error) {
      const msg = error.response?.data?.error || error.response?.data?.message;
      dispatch({ type: "FETCH_STATS_FAIL", payload: msg });
      toast.error(msg);
    }
  };

  const handleFilterChange = (field, value) => {
    dispatch({
      type: "SET_FILTERS",
      payload: {
        [field]: value,
        ...(field === "date" && { month: "" }),
        ...(field === "month" && { date: "" }),
      },
    });
  };

  const handleSearch = () => {
    dispatch({ type: "RESET_STATS" });
    fetchCurrentStats();
  };

  useEffect(() => {
    fetchRobots();
  }, [site_id]);

  const filteredData = statsData.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.robot_no?.toLowerCase().includes(term) ||
      item.date?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="container-fluid">
      <h3 className="mb-4">Robot Current Stats</h3>

      <CCard className="mb-4">
        <CCardHeader>Filters</CCardHeader>
        <CCardBody>
          <CRow className="g-3 align-items-end">
            <CCol md={3}>
              <label className="form-label">Robot</label>
              <CFormSelect
                value={filters.robot_no}
                onChange={(e) => handleFilterChange("robot_no", e.target.value)}
                disabled={loadingRobots}
              >
                <option value="">All Robots</option>
                {robots.map((robot) => (
                  <option key={robot._id} value={robot.robot_no}>
                    {robot.robot_no}
                  </option>
                ))}
              </CFormSelect>
            </CCol>

            <CCol md={3}>
              <label className="form-label">Date</label>
              <CFormInput
                type="date"
                value={filters.date}
                onChange={(e) => handleFilterChange("date", e.target.value)}
                max={moment().format("YYYY-MM-DD")}
              />
            </CCol>

            <CCol md={3}>
              <label className="form-label">Month</label>
              <CFormInput
                type="month"
                value={filters.month}
                onChange={(e) => handleFilterChange("month", e.target.value)}
                max={moment().format("YYYY-MM")}
              />
            </CCol>

            <CCol md="auto" className="d-flex gap-2">
              <CButton color="primary" size="sm" onClick={handleSearch}>
                {loadingStats ? <LoadingSpinner size="sm" /> : "Search"}
              </CButton>
              <CButton
                color="secondary"
                size="sm"
                onClick={() => {
                  dispatch({
                    type: "SET_FILTERS",
                    payload: {
                      robot_no: "",
                      date: "",
                      month: moment().format("YYYY-MM"),
                    },
                  });
                  dispatch({ type: "RESET_STATS" });
                }}
              >
                Reset
              </CButton>
            </CCol>
            {/* 
            <CCol md={3}>
              <CFormInput
                type="text"
                placeholder="Search by Robot or Date"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </CCol> */}
          </CRow>
        </CCardBody>
      </CCard>

      {statsError && <CAlert color="danger">{statsError}</CAlert>}

      <CCard>
        <CCardBody>
          <CTable bordered hover responsive className="text-center">
            <CTableHead color="secondary">
              <CTableRow>
                <CTableHeaderCell>Robot No</CTableHeaderCell>
                <CTableHeaderCell style={{ width: "150px" }}>
                  Date
                </CTableHeaderCell>
                <CTableHeaderCell>Total Records</CTableHeaderCell>
                <CTableHeaderCell>Avg Brush Current</CTableHeaderCell>
                <CTableHeaderCell>Avg Wheel Current</CTableHeaderCell>
                <CTableHeaderCell>Max Brush Current</CTableHeaderCell>
                <CTableHeaderCell>Max Wheel Current</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {loadingStats ? (
                <CTableRow>
                  <CTableDataCell colSpan="7" className="text-center">
                    <LoadingSpinner />
                  </CTableDataCell>
                </CTableRow>
              ) : filteredData.length === 0 ? (
                <CTableRow>
                  <CTableDataCell
                    colSpan="7"
                    className="text-center text-danger"
                  >
                    No data found
                  </CTableDataCell>
                </CTableRow>
              ) : (
                filteredData.map((item, idx) => (
                  <CTableRow key={idx}>
                    <CTableDataCell>{item.robot_no}</CTableDataCell>
                    <CTableDataCell>{item.date}</CTableDataCell>
                    <CTableDataCell>{item.totalRecords}</CTableDataCell>
                    <CTableDataCell>
                      {item.avg_brush_current ?? "N/A"}
                    </CTableDataCell>
                    <CTableDataCell>
                      {item.avg_wheel_current ?? "N/A"}
                    </CTableDataCell>
                    <CTableDataCell>
                      {item.max_brush_current ?? "N/A"}
                    </CTableDataCell>
                    <CTableDataCell>
                      {item.max_wheel_current ?? "N/A"}
                    </CTableDataCell>
                  </CTableRow>
                ))
              )}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default RobotTrackingCurrentTable;
