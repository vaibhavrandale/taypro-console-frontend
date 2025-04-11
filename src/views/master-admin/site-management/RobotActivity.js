import React, { useEffect, useReducer, useState } from "react";
import {
  CCard,
  CCardBody,
  CRow,
  CCol,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from "@coreui/react";
import axios from "axios";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";
import PaginateInput from "../../../components/PaginateInput";
import toast from "react-hot-toast";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return {
        ...state,
        notifications: action.payload.data,
        currentPage: action.payload.currentPage,
        totalPages: action.payload.totalPages,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const RobotActivity = () => {
  const [{ loading, error, notifications, currentPage, totalPages }, dispatch] =
    useReducer(reducer, {
      notifications: [],
      currentPage: 1,
      totalPages: 1,
      loading: true,
      error: "",
    });

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pageInput, setPageInput] = useState(1);

  const authtoken = useSelector((state) => state.authtoken);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(
          `/api/v1/robot-notification?page=${page}&limit=${limit}`,
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: error.response?.data?.message || "Failed to fetch data",
        });
        toast.error(error.response?.data?.message || "Failed to fetch data");
      }
    };
    fetchNotifications();
  }, [authtoken, page, limit]);

  const filtered = notifications.filter((item) =>
    item.robot_no?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePageChange = (newPage) => {
    setPage(newPage);
    setPageInput(newPage);
  };

  const handlePageInputChange = (e) => {
    setPageInput(e.target.value);
  };

  const handlePageInputSubmit = () => {
    const newPage = Math.max(1, Math.min(Number(pageInput), totalPages));
    setPage(newPage);
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
    setPageInput(1);
  };

  return (
    <div className="my-3">
      <CCard className="shadow border-0" style={{ minHeight: "73vh" }}>
        <CCardBody>
          <CRow className="justify-content-between mb-3">
            <CCol md={4}>
              <h5 className="text-primary">Robot Notifications</h5>
            </CCol>
            <CCol md={4} className="text-end">
              <input
                type="text"
                placeholder="Search by Robot No"
                value={searchTerm}
                className="form-control form-control-sm"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </CCol>
          </CRow>

          {loading ? (
            <div className="text-center my-5">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <h6 className="text-danger text-center">{error}</h6>
          ) : (
            <>
              <CTable striped hover responsive bordered>
                <CTableHead color="dark">
                  <CTableRow>
                    <CTableHeaderCell>#</CTableHeaderCell>
                    <CTableHeaderCell>Robot No</CTableHeaderCell>
                    <CTableHeaderCell>Command</CTableHeaderCell>
                    <CTableHeaderCell>DevEUI</CTableHeaderCell>
                    <CTableHeaderCell>Site ID</CTableHeaderCell>
                    <CTableHeaderCell>Sent By</CTableHeaderCell>
                    <CTableHeaderCell>Email</CTableHeaderCell>
                    <CTableHeaderCell>Timestamp</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {filtered.map((item, index) => (
                    <CTableRow key={item._id}>
                      <CTableDataCell>
                        {(page - 1) * limit + index + 1}
                      </CTableDataCell>
                      <CTableDataCell>{item.robot_no}</CTableDataCell>
                      <CTableDataCell>{item.command}</CTableDataCell>
                      <CTableDataCell>{item.deveui}</CTableDataCell>
                      <CTableDataCell>{item.site_id}</CTableDataCell>
                      <CTableDataCell>
                        {item.last_activity?.name}
                      </CTableDataCell>
                      <CTableDataCell>
                        {item.last_activity?.email}
                      </CTableDataCell>
                      <CTableDataCell>
                        {new Date(item.createdAt).toLocaleString("en-GB")}
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>

              <PaginateInput
                page={page}
                totalPages={totalPages}
                hasPrevPage={page > 1}
                hasNextPage={page < totalPages}
                pageInput={pageInput}
                handlePageChange={handlePageChange}
                handlePageInputChange={handlePageInputChange}
                handlePageInputSubmit={handlePageInputSubmit}
                limit={limit}
                handleLimitChange={handleLimitChange}
              />
            </>
          )}
        </CCardBody>
      </CCard>
    </div>
  );
};

export default RobotActivity;
