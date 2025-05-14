import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import PaginateInput from "../../../components/PaginateInput";
import {
  CCol,
  CFormInput,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import LoadingSpinner from "../../../components/LoadingSpinner";
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_PM_NOTIFICATION_REQUEST":
      return { ...state, pmloading: true, error: "" };
    case "FETCH_PM_NOTIFICATION_SUCCESS":
      return {
        ...state,
        pmloading: false,
        preventivemaintanancenotifications: action.payload.data,
        totalPages: action.payload.totalPages, // Use API-provided totalPages
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
      };
    case "FETCH_PM_NOTIFICATION_FAIL":
      return { ...state, pmloading: false, error: action.payload };
    default:
      return state;
  }
};

const PreventiveMaintananceNotifications = () => {
  const [
    {
      error,
      preventivemaintanancenotifications,
      pmloading,
      totalPages,
      hasNextPage,
      hasPrevPage,
    },
    dispatch,
  ] = useReducer(reducer, {
    preventivemaintanancenotifications: [],
    pmloading: true,
    error: "",
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const authtoken = useSelector((state) => state.authtoken);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pageInput, setPageInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let pagination = {
      pg: page,
      limit: limit,
    };
    const fetchPreventivemaintenances = async () => {
      dispatch({ type: "FETCH_PM_NOTIFICATION_REQUEST" });
      try {
        const result = await axios.post(
          `/api/v1/preventivemaintenances-notification`,
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
          type: "FETCH_PM_NOTIFICATION_SUCCESS",
          payload: {
            data: result.data.data,
            totalPages: total,
            hasNextPage: next,
            hasPrevPage: prev,
          },
        });
      } catch (error) {
        dispatch({
          type: "FETCH_PM_NOTIFICATION_FAIL",
          payload: error.response.data.error,
        });
        toast.error(error.response.data.error);
      }
    };

    fetchPreventivemaintenances();
  }, [authtoken, limit, page]);

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

  const FilteredPreventivemaintenances = preventivemaintanancenotifications
    ? preventivemaintanancenotifications.filter(
        (robot) =>
          robot.pm_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          robot.robot_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
          robot.message.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div>
      <h2 className="text-center">Preventive Maintenances Activity</h2>
      {/* Search Input */}
      <CRow className="justify-content-end mb-3">
        <CCol md={4}>
          <CFormInput
            type="text"
            placeholder="Search by Robot No or Site ID or message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CCol>
      </CRow>
      <CTable bordered hover responsive className="text-center shadow-sm">
        <CTableHead color="secondary">
          <CTableRow>
            <CTableHeaderCell>SR</CTableHeaderCell>
            <CTableHeaderCell>PM Notification ID</CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "200px" }}>
              Robot No
            </CTableHeaderCell>

            <CTableHeaderCell>Site ID</CTableHeaderCell>
            <CTableHeaderCell>client ID</CTableHeaderCell>
            <CTableHeaderCell>site_location</CTableHeaderCell>
            <CTableHeaderCell>Message</CTableHeaderCell>
            <CTableHeaderCell>Action By</CTableHeaderCell>
            <CTableHeaderCell>Time</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {pmloading ? (
            <CTableRow>
              <CTableDataCell colSpan="9" className="text-center fw-bold">
                <LoadingSpinner />
              </CTableDataCell>
            </CTableRow>
          ) : error ? (
            <CTableRow>
              <CTableDataCell colSpan="9" className="text-center fw-bold">
                {error}
              </CTableDataCell>
            </CTableRow>
          ) : FilteredPreventivemaintenances.length > 0 ? (
            FilteredPreventivemaintenances.map((pm, index) => (
              <CTableRow key={index}>
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell>{pm.pm_id}</CTableDataCell>
                <CTableDataCell>{pm.robot_no}</CTableDataCell>
                <CTableDataCell>{pm.site_id}</CTableDataCell>
                <CTableDataCell>{pm.client_id}</CTableDataCell>
                <CTableDataCell>{pm.site_location}</CTableDataCell>
                <CTableDataCell>{pm.message}</CTableDataCell>
                <CTableDataCell>{pm.last_activity?.name}</CTableDataCell>
                <CTableDataCell>
                  {/* {pm.createdAt} */}
                  <span>
                    {new Date(pm.createdAt).toLocaleString()}
                    {/* <span>
                            {formatDistanceToNow(new Date(pm.createdAt), {
                              addSuffix: true,
                            })}
                          </span> */}
                  </span>
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan="7" className="text-center fw-bold">
                No matching robots found.
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

export default PreventiveMaintananceNotifications;
