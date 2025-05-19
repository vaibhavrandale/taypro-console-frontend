import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import PaginateInput from "../../../components/PaginateInput";
import {
  CBadge,
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
import { Link } from "react-router-dom";
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        technicians: action.payload.data,
        totalPages: action.payload.totalPages, // Use API-provided totalPages
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
  const currentDate = new Date();
  const [month, setMonth] = useState(
    String(currentDate.getMonth() + 1).padStart(2, "0")
  ); // e.g. '04'
  const [year, setYear] = useState(String(currentDate.getFullYear())); // e.g. '2025'

  useEffect(() => {
    let pagination = {
      pg: page,
      limit: limit,
    };
    const fetchAttendance = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });

        const result = await axios.post(
          `/api/v1/technician-attendance/${month}/${year}`,
          pagination,
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );

        let total = Math.ceil(
          Number(result.data.total) / Number(result.data.limit)
        );
        let next = result.data.hasNextPage;
        let prev = result.data.hasPrevPage;
        dispatch({
          type: "FETCH_SUCCESS",
          payload: {
            data: result.data.data,
            totalPages: total,
            hasNextPage: next,
            hasPrevPage: prev,
          },
        });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: {
            error: error.response?.data.error || error.response?.data.message,
            data: [], // Clear the array
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: false,
          },
        });
        toast.error(error.response?.data.error || error.response?.data.message);
      }
    };

    fetchAttendance();
  }, [authtoken, limit, month, page, year]);
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
      </CRow>
      <CTable bordered hover responsive>
        <CTableHead color="secondary">
          <CTableRow className="text-center">
            <CTableHeaderCell>Sr</CTableHeaderCell>{" "}
            <CTableHeaderCell>Profile</CTableHeaderCell>
            <CTableHeaderCell>username</CTableHeaderCell>
            <CTableHeaderCell>site_id</CTableHeaderCell>
            <CTableHeaderCell>In Time</CTableHeaderCell>
            <CTableHeaderCell>In Location</CTableHeaderCell>
            <CTableHeaderCell>out Time</CTableHeaderCell>
            <CTableHeaderCell>Out Location</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {loading ? (
            <CTableRow>
              <CTableHeaderCell colSpan="8" className="text-start">
                <LoadingSpinner />
              </CTableHeaderCell>
            </CTableRow>
          ) : technicians.length > 0 ? (
            technicians.map((site, index) => (
              <CTableRow key={index} className="text-center">
                <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                <CTableDataCell>
                  <img
                    src={site.profile_image}
                    alt={site.site_id}
                    style={{
                      height: "50px",
                      width: "50px",
                      objectFit: "contain",
                      borderRadius: "50%",
                    }}
                  />
                </CTableDataCell>
                <CTableDataCell>{site.username}</CTableDataCell>
                <CTableDataCell>{site.site_id}</CTableDataCell>
                <CTableDataCell>
                  {new Date(site.punchin_time).toLocaleString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </CTableDataCell>

                <CTableDataCell>
                  <Link
                    target="blank"
                    className="text-decoration-none"
                    to={`https://www.google.com/maps/search/?api=1&query=${site.punchin_location.lat},${site.punchin_location.lng}`}
                  >
                    View
                  </Link>
                </CTableDataCell>

                <CTableDataCell>
                  {site.punchout_time ? (
                    new Date(site.punchout_time).toLocaleString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })
                  ) : (
                    <CBadge color="warning">N/A</CBadge>
                  )}
                </CTableDataCell>
                <CTableDataCell>
                  {site.punchout_time ? (
                    <>
                      <Link
                        target="blank"
                        className="text-decoration-none"
                        to={`https://www.google.com/maps/search/?api=1&query=${site.punchout_location.lat},${site.punchout_location.lng}`}
                      >
                        View
                      </Link>
                    </>
                  ) : (
                    <CBadge color="warning">N/A</CBadge>
                  )}
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan="8" className="text-center">
                No data found
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

export default TechnicianAttendanceDashboard;
