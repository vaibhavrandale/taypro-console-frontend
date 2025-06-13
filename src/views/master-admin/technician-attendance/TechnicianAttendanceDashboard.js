import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

import {
  CBadge,
  CButton,
  CCol,
  CFormSelect,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        technicians: action.payload.data,
        totalPages: action.payload.totalPages,
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const TechnicianAttendanceDashboard = () => {
  const [
    { loading, technicians, totalPages, hasNextPage, hasPrevPage },
    dispatch,
  ] = useReducer(reducer, {
    technicians: [],
    loading: true,
    error: "",
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const authtoken = useSelector((state) => state.authtoken);
  const [pageInput, setPageInput] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchText, setSearchText] = useState("");

  const currentDate = new Date();
  const [month, setMonth] = useState(
    String(currentDate.getMonth() + 1).padStart(2, "0")
  );
  const [year, setYear] = useState(String(currentDate.getFullYear()));

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });

        const result = await axios.post(
          `/api/v1/technician-attendance/${month}/${year}`,
          { pg: page, limit: limit },
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );

        let total = Math.ceil(result.data.total / result.data.limit);
        dispatch({
          type: "FETCH_SUCCESS",
          payload: {
            data: result.data.data,
            totalPages: total,
            hasNextPage: result.data.hasNextPage,
            hasPrevPage: result.data.hasPrevPage,
          },
        });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: error.response?.data.error || "Failed to fetch",
        });
        toast.error(error.response?.data.error || "Failed to fetch");
      }
    };

    fetchAttendance();
  }, [authtoken, limit, month, page, year]);

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

  const getDaysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
  };

  const daysInMonth = getDaysInMonth(month, year);

  // Grouping logic
  const groupedData = {};
  technicians.forEach((record) => {
    const date = new Date(record.punchin_time).toISOString().split("T")[0];
    if (!groupedData[record.username]) {
      groupedData[record.username] = {
        site_id: record.site_id,
        profile_image: record.profile_image,
        attendance: {},
      };
    }
    groupedData[record.username].attendance[date] = {
      in: record.punchin_time,
      out: record.punchout_time || null,
    };
  });

  const exportToExcel = () => {
    const table = document.querySelector("table");
    if (!table) {
      console.error("Attendance table not found!");
      return;
    }

    if (!Object.keys(groupedData).length) {
      toast.error("No data available to export");
      return;
    }

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.table_to_sheet(table, { raw: true });

    XLSX.utils.book_append_sheet(workbook, worksheet, "Technician Attendance");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(data, `Technician_Attendance_${month}_${year}.xlsx`);
  };

  const filteredEntries = Object.entries(groupedData).filter(
    ([username, data]) =>
      username.toLowerCase().includes(searchText) ||
      data.site_id.toLowerCase().includes(searchText)
  );

  return (
    <div>
      {" "}
      <h3 className="text-center">All Site Technicians Timesheet</h3>
      <CRow className="mb-3">
        <CCol xs="auto">
          <CFormSelect value={month} onChange={(e) => setMonth(e.target.value)}>
            {[...Array(12)].map((_, index) => {
              const m = String(index + 1).padStart(2, "0");
              return (
                <option key={m} value={m}>
                  {m}
                </option>
              );
            })}
          </CFormSelect>
        </CCol>
        <CCol xs="auto">
          <CFormSelect value={year} onChange={(e) => setYear(e.target.value)}>
            {Array.from({ length: 5 }).map((_, index) => {
              const y = String(new Date().getFullYear() - 2 + index);
              return (
                <option key={y} value={y}>
                  {y}
                </option>
              );
            })}
          </CFormSelect>
        </CCol>

        <CCol lg="2" xs="auto">
          <input
            type="text"
            className="form-control"
            placeholder="Search by username or site ID"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value.toLowerCase())}
          />
        </CCol>
        <CCol xs="auto">
          <CButton size="sm" color="success" onClick={exportToExcel}>
            Export
          </CButton>
        </CCol>
      </CRow>
      <CTable bordered hover responsive>
        <CTableHead color="dark">
          <CTableRow className="text-center">
            <CTableHeaderCell>Sr</CTableHeaderCell>
            <CTableHeaderCell>Name</CTableHeaderCell>
            <CTableHeaderCell>Site</CTableHeaderCell>
            {[...Array(daysInMonth)].map((_, i) => (
              <CTableHeaderCell key={i}>{i + 1}</CTableHeaderCell>
            ))}
            <CTableHeaderCell>Total</CTableHeaderCell>{" "}
            {/* 👈 Add Total column */}
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {loading ? (
            <CTableRow>
              <CTableDataCell colSpan={daysInMonth + 4}>
                <LoadingSpinner />
              </CTableDataCell>
            </CTableRow>
          ) : Object.keys(groupedData).length > 0 ? (
            filteredEntries.map(([username, data], idx) => {
              let presentCount = 0;

              return (
                <CTableRow key={idx} className="text-center">
                  <CTableDataCell>{idx + 1}</CTableDataCell>
                  <CTableDataCell style={{ minWidth: "170px" }}>
                    {username}
                  </CTableDataCell>
                  <CTableDataCell>{data.site_id}</CTableDataCell>

                  {[...Array(daysInMonth)].map((_, dayIdx) => {
                    const day = String(dayIdx + 1).padStart(2, "0");
                    const formattedDate = `${year}-${month}-${day}`;
                    const log = data.attendance[formattedDate];

                    if (log?.in && log?.out) presentCount++; // Count only full Present

                    return (
                      <CTableDataCell key={dayIdx}>
                        {log ? (
                          log.in && log.out ? (
                            <CBadge color="success">
                              P
                              <br />
                              {new Date(log.in).toLocaleTimeString("en-IN", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })}
                              <br />
                              {new Date(log.out).toLocaleTimeString("en-IN", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </CBadge>
                          ) : log.in && !log.out ? (
                            <CBadge color="warning">
                              P*
                              <br />
                              {new Date(log.in).toLocaleTimeString("en-IN", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </CBadge>
                          ) : (
                            <CBadge color="danger">A</CBadge>
                          )
                        ) : (
                          <CBadge color="danger">A</CBadge>
                        )}
                      </CTableDataCell>
                    );
                  })}

                  <CTableDataCell>
                    <strong>{presentCount}</strong>
                  </CTableDataCell>
                </CTableRow>
              );
            })
          ) : (
            <CTableRow>
              <CTableDataCell colSpan={daysInMonth + 4} className="text-center">
                No data found
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>
    </div>
  );
};

export default TechnicianAttendanceDashboard;
