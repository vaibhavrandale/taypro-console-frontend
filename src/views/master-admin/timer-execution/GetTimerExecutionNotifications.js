import React, { useEffect, useReducer, useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTableDataCell,
  CBadge,
  CInputGroup,
  CFormInput,
  CRow,
  CCol,
} from "@coreui/react";
import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";
import PaginateInput from "../../../components/PaginateInput";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        data: action.payload.data,
        totalPages: action.payload.totalPages,
        totalCount: action.payload.totalCount,
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const TimerExecutionNotificationView = () => {
  const [
    { loading, error, data, totalPages, totalCount, hasNextPage, hasPrevPage },
    dispatch,
  ] = useReducer(reducer, {
    loading: false,
    error: "",
    data: [],
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // const authtoken = useSelector((state) => state.authtoken);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pageInput, setPageInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const res = await axios.post(
          "/api/v1/timerexecutionnotifications/get-all",
          { pg: page, limit },
          {
            // headers: { Authorization: `Bearer ${authtoken}` }
            withCredentials: true,
          },
        );

        const totalPagesCalc = Math.ceil(
          Number(res.data.totalCount) / Number(res.data.limit),
        );

        dispatch({
          type: "FETCH_SUCCESS",
          payload: {
            data: res.data.data || [],
            totalPages: totalPagesCalc,
            totalCount: res.data.totalCount || 0,
            hasNextPage: res.data.hasNextPage,
            hasPrevPage: res.data.hasPrevPage,
          },
        });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload:
            err.response?.data?.message || "Failed to load notifications",
        });
      }
    };

    fetchData();
  }, [page, limit]);

  const handlePageInputChange = (e) => setPageInput(e.target.value);
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

  const filteredData = data.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.site_id?.toLowerCase().includes(term) ||
      item.user?.username?.toLowerCase().includes(term) ||
      item.user?.designation?.toLowerCase().includes(term) ||
      item.block?.join(", ").toLowerCase().includes(term)
    );
  });

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-danger text-center my-4">{error}</div>;

  return (
    <CCard>
      <CCardHeader>
        <h4>Timer Execution Notifications</h4>
      </CCardHeader>
      <CCardBody>
        {/* Search Input */}
        <CRow className="justify-content-end mb-3">
          <CCol xs={12} sm={8} md={6} lg={4}>
            <CInputGroup>
              <CFormInput
                type="text"
                placeholder="Search by Site, User, Designation, Block"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </CInputGroup>
          </CCol>
        </CRow>
        <CTable
          bordered
          hover
          responsive
          className="text-center shadow-sm bg-important"
        >
          <CTableHead color="secondary">
            <CTableRow>
              <CTableHeaderCell>#</CTableHeaderCell>
              <CTableHeaderCell>Site</CTableHeaderCell>
              <CTableHeaderCell>User</CTableHeaderCell>
              <CTableHeaderCell>Block</CTableHeaderCell>
              <CTableHeaderCell>Status</CTableHeaderCell>
              {/* <CTableHeaderCell>Created</CTableHeaderCell> */}
              <CTableHeaderCell>Read At</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <CTableRow key={item._id}>
                  <CTableDataCell>
                    {(page - 1) * limit + index + 1}
                  </CTableDataCell>
                  <CTableDataCell>{item.site_id}</CTableDataCell>
                  <CTableDataCell>
                    <div className="d-flex align-items-center">
                      {/* {item.user?.profile_image && (
                        <CAvatar
                          src={item.user.profile_image}
                          size="sm"
                          className="me-2"
                        />
                      )} */}
                      <div>
                        <div className="fw-semibold">{item.user?.username}</div>
                        <small className="text-medium-emphasis">
                          {item.user?.designation}
                        </small>
                      </div>
                    </div>
                  </CTableDataCell>
                  <CTableDataCell>{item.block?.join(", ")}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={item.read_status ? "success" : "danger"}>
                      {item.read_status ? "Read" : "Unread"}
                    </CBadge>
                  </CTableDataCell>
                  {/* <CTableDataCell>
                    {moment(item.createdAt).format("DD/MM/YYYY hh:mm A")}
                  </CTableDataCell> */}
                  <CTableDataCell>
                    {item.read_at ? (
                      moment(item.read_at).format("DD/MM/YYYY hh:mm A")
                    ) : (
                      <CBadge color="danger">Unread</CBadge>
                    )}
                  </CTableDataCell>
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan={6} className="text-center py-4">
                  No notifications found
                </CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>

        {/* Pagination Input */}
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
          totalRecords={totalCount}
        />
      </CCardBody>
    </CCard>
  );
};

export default TimerExecutionNotificationView;
