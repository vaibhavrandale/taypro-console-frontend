import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import PaginateInput from "../../../components/PaginateInput";
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CFormInput,
  CRow,
  CCol,
  CInputGroup,
  CAvatar,
  CBadge,
} from "@coreui/react";
import LoadingSpinner from "../../../components/LoadingSpinner";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        robotNotifications: action.payload.data,
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

const RobotActivity = () => {
  const [
    { loading, robotNotifications, totalPages, hasNextPage, hasPrevPage },
    dispatch,
  ] = useReducer(reducer, {
    robotNotifications: [],
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
    loading: true,
    error: "",
  });

  // const authtoken = useSelector((state) => state.authtoken);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pageInput, setPageInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let pagination = {
      pg: page,
      limit: limit,
    };

    const fetchRobotActivity = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });

        const result = await axios.post(
          `/api/v1/robot-notification`,
          pagination,
          {
            // headers: { Authorization: `Bearer ${authtoken}` },
            withCredentials: true,
          },
        );

        let total = Math.ceil(
          Number(result.data.total) / Number(result.data.limit),
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
          payload: error.response?.data.error || error.response?.data.message,
        });
        toast.error(
          error.response?.data?.error || error.response?.data?.message,
        );
      }
    };

    fetchRobotActivity();
  }, [limit, page]);

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

  // const filteredData = robotNotifications.filter((item) => {
  //   const term = searchTerm.toLowerCase();
  //   return (
  //     item.robot_no?.toLowerCase().includes(term) ||
  //     item.command?.toLowerCase().includes(term) ||
  //     item.site_id?.toLowerCase().includes(term) ||
  //     item.last_activity?.name?.toLowerCase().includes(term) ||
  //     item.last_activity?.details?.toLowerCase().includes(term)
  //   );
  // });

  const filteredData = robotNotifications.filter((item) => {
    const term = searchTerm.toLowerCase();

    const cleanDetails = item.last_activity?.details
      ?.replace(/<[^>]+>/g, "") // Remove HTML tags
      .toLowerCase();

    return (
      item.robot_no?.toLowerCase().includes(term) ||
      item.command?.toLowerCase().includes(term) ||
      item.site_id?.toLowerCase().includes(term) ||
      item.last_activity?.name?.toLowerCase().includes(term) ||
      cleanDetails?.includes(term)
    );
  });

  return (
    <div>
      <CRow className="justify-content-end mb-3">
        <CCol xs={12} sm={8} md={6} lg={4}>
          <CInputGroup>
            <CFormInput
              type="text"
              placeholder="Search by Robot No, Command, Site ID, Sent By"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </CInputGroup>
        </CCol>
      </CRow>

      <CTable bordered hover responsive className="text-center shadow-sm">
        <CTableHead color="secondary">
          <CTableRow>
            <CTableHeaderCell>#</CTableHeaderCell>
            <CTableHeaderCell>Robot No</CTableHeaderCell>
            <CTableHeaderCell>Command</CTableHeaderCell>
            {/* <CTableHeaderCell>DevEUI</CTableHeaderCell> */}
            <CTableHeaderCell>Site ID</CTableHeaderCell>
            <CTableHeaderCell>Sent By</CTableHeaderCell>
            <CTableHeaderCell>Details</CTableHeaderCell>{" "}
            <CTableHeaderCell>Timestamp</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {loading ? (
            <CTableRow>
              <CTableDataCell colSpan="8" className="text-center">
                <LoadingSpinner />
              </CTableDataCell>
            </CTableRow>
          ) : filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <CTableRow key={item._id}>
                <CTableDataCell>
                  {(page - 1) * limit + index + 1}
                </CTableDataCell>
                <CTableDataCell style={{ minWidth: "200px" }}>
                  {item.robot_no}
                  <br />
                  <small className="text-muted">{item.deveui}</small>
                </CTableDataCell>
                <CTableDataCell>
                  {item.command === "11" ||
                  item.command === "Cleaning Start" ? (
                    <CBadge color="success">Cleaning Start</CBadge>
                  ) : item.command === "14" ||
                    item.command === "Cleaning Stop" ? (
                    <CBadge color="danger"> Cleaning Stop</CBadge>
                  ) : item.command === "15" ? (
                    <CBadge color="secondary">Return To Dock</CBadge>
                  ) : (
                    <CBadge color="secondary">{item.command}</CBadge>
                  )}
                </CTableDataCell>
                {/* <CTableDataCell></CTableDataCell> */}
                <CTableDataCell>{item.site_id}</CTableDataCell>
                {/* <CTableDataCell>{item.last_activity?.name}</CTableDataCell> */}

                <CTableDataCell>
                  <div className="d-flex justify-content-start align-items-center">
                    <CAvatar
                      src={item.last_activity.profile_image}
                      style={{
                        maxHeight: "40px",
                        maxWidth: "40px",
                        objectFit: "contain",
                      }}
                    />
                    <div className="ms-2 d-flex flex-column justify-content-start align-items-start">
                      <div>{item.last_activity?.name}</div>
                      <small className="text-muted">
                        {item.last_activity?.email}
                      </small>
                    </div>
                  </div>
                </CTableDataCell>
                <CTableDataCell style={{ minWidth: "300px" }}>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: item.last_activity?.details,
                    }}
                  ></span>
                </CTableDataCell>
                <CTableDataCell style={{ minWidth: "200px" }}>
                  {new Date(item.createdAt).toLocaleString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan="8" className="text-center">
                No robot activity found
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
        handleLimitChange={setLimit}
      />
    </div>
  );
};

export default RobotActivity;
