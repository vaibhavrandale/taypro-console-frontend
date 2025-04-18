import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import PaginateInput from "../../../components/PaginateInput";
import {
  CBadge,
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
    { loading, error, technicians, totalPages, hasNextPage, hasPrevPage },
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

  useEffect(() => {
    let pagination = {
      pg: page,
      limit: limit,
    };
    const fetchAttendance = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });

        const result = await axios.post(
          `/api/v1/technician-attendance/04/2025`,
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
          //  payload: data.data
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
          payload: error.response?.data.error || error.response?.data.message,
        });
        toast.error(error.response?.data.error || error.response?.data.message);
      }
    };

    fetchAttendance();
  }, [authtoken, limit, page]);
  console.log(technicians);
  const handlePageInputChange = (e) => {
    setPageInput(e.target.value);
  };

  // // console.log(uniqueSitenames);
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
      {" "}
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
              <CTableHeaderCell colSpan="4" className="text-center">
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
                  {site.punchin_location.lat},{site.punchin_location.lng}
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
                      {site.punchout_location.lat},{site.punchout_location.lng}
                    </>
                  ) : (
                    <CBadge color="warning">N/A</CBadge>
                  )}
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan="4" className="text-center">
                No Site found
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>
      {/* <PaginateInput
  page={page}
  totalPages={totalPages}
  hasPrevPage={hasPrevPage}
  hasNextPage={hasNextPage}
  pageInput={pageInput}
  handlePageChange={handlePageChange}
  handlePageInputChange={handlePageInputChange}
  handlePageInputSubmit={handlePageInputSubmit}
/> */}
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
