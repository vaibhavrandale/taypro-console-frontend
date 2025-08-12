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
  CBadge,
} from "@coreui/react";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";
import PaginateInput from "../../../components/PaginateInput";
import { Link } from "react-router-dom";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_ATTENDANCE_REQUEST":
      return { ...state, loadingAttendance: true, error: "" };
    case "FETCH_ATTENDANCE_SUCCESS":
      return {
        ...state,
        loadingAttendance: false,
        attendances: action.payload.data,
        totalPages: action.payload.totalPages, // Use API-provided totalPages
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
      };
    case "FETCH_ATTENDANCE_FAIL":
      return { ...state, loadingAttendance: false, error: action.payload };

    default:
      return state;
  }
};

const SitesCoordinates = () => {
  const [
    {
      error,
      attendances,
      loadingAttendance,
      totalPages,
      hasNextPage,
      hasPrevPage,
      successDelete,
    },
    dispatch,
  ] = useReducer(reducer, {
    attendances: [],
    loading: true,
    loadingAttendance: true,
    error: "",
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const authtoken = useSelector((state) => state.authtoken);

  const [searchTerm, setSearchTerm] = useState("");

  const [pageInput, setPageInput] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    let pagination = {
      pg: page,
      limit: limit,
    };
    const fetchAttendance = async () => {
      dispatch({ type: "FETCH_ATTENDANCE_REQUEST" });
      try {
        const result = await axios.post(
          `/api/v1/technician-attendance/get-user-attendance`,
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
          type: "FETCH_ATTENDANCE_SUCCESS",
          payload: {
            data: result.data.data,
            totalPages: total,
            hasNextPage: next,
            hasPrevPage: prev,
          },
        });
      } catch (error) {
        dispatch({
          type: "FETCH_ATTENDANCE_FAIL",
          payload: error.response.data.error || error.response.data.message,
        });
        toast.error(error.response.data.error || error.response.data.message);
      }
    };

    fetchAttendance();
  }, [successDelete, authtoken, limit, page]);

  const filteredAttendance = attendances.filter((attendance) =>
    attendance.site_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePageInputChange = (e) => {
    setPageInput(e.target.value);
  };

  // // console.item(uniqueSitenames);
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

  const userInfo = useSelector((state) => state.userInfo);
  let adminroute = "";

  if (userInfo.role === "Master Admin") {
    adminroute = "master-admin";
  } else if (userInfo.role === "Service Admin") {
    adminroute = "service-admin";
  } else if (userInfo.role === "Project Admin") {
    // eslint-disable-next-line no-unused-vars
    adminroute = "project-admin";
  }

  return (
    <div className="p-2">
      <h2 className="text-center mt-4">User Site Attendance List</h2>
      {/* Search Input */}
      <CRow className="justify-content-end mb-3">
        <CCol md={4}>
          <CFormInput
            type="text"
            placeholder="Search by Site Id..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CCol>
      </CRow>

      {/* Coordinates Table */}
      <CTable bordered hover responsive className="text-center shadow-sm">
        <CTableHead color="secondary">
          <CTableRow>
            <CTableHeaderCell>#</CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "200px" }}>
              Site Id
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "100px" }}>
              In Time
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "140px" }}>
              In Location
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "140px" }}>
              Out Time
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "100px" }}>
              Out Location
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {loadingAttendance ? (
            <CTableRow>
              <CTableDataCell colSpan="9" className="text-center fw-bold">
                <LoadingSpinner />
              </CTableDataCell>
            </CTableRow>
          ) : error ? (
            <CTableRow>
              {" "}
              <CTableDataCell colSpan="9" className="text-center fw-bold">
                {error}
              </CTableDataCell>
            </CTableRow>
          ) : filteredAttendance.length > 0 ? (
            filteredAttendance.map((attendances, index) => (
              <CTableRow
                key={index}
                className={attendances.is_delete ? "table-danger" : ""}
              >
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell>{attendances.site_id}</CTableDataCell>
                <CTableDataCell>
                  {new Date(attendances.punchin_time).toLocaleString("en-IN", {
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
                    to={`https://www.google.com/maps/search/?api=1&query=${attendances.punchin_location.lat},${attendances.punchin_location.lng}`}
                  >
                    View
                  </Link>
                </CTableDataCell>

                <CTableDataCell>
                  {attendances.punchout_time ? (
                    new Date(attendances.punchout_time).toLocaleString(
                      "en-IN",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      }
                    )
                  ) : (
                    <CBadge color="warning">N/A</CBadge>
                  )}
                </CTableDataCell>

                <CTableDataCell>
                  {attendances.punchout_time ? (
                    <>
                      <Link
                        target="blank"
                        className="text-decoration-none"
                        to={`https://www.google.com/maps/search/?api=1&query=${attendances.punchout_location.lat},${attendances.punchout_location.lng}`}
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
              <CTableDataCell colSpan="7" className="text-center fw-bold">
                No Attendance found.
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

export default SitesCoordinates;
