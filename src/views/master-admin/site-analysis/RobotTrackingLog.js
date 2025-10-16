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
  CButton,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CModal,
  CModalBody,
  //   CTooltip,
} from "@coreui/react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import axios from "axios";
import LoadingSpinner from "../../../components/LoadingSpinner";
import PaginateInput from "../../../components/PaginateInput";
import { useParams } from "react-router-dom";
import moment from "moment";
import CIcon from "@coreui/icons-react";
import { cilX } from "@coreui/icons";
// import { formatDistanceToNow } from "date-fns";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_LOGS_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_LOGS_SUCCESS":
      return {
        ...state,
        loading: false,
        logs: action.payload.data,
        total: action.payload.total,
      };
    case "FETCH_LOGS_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const RobotTrackingLog = () => {
  const [state, dispatch] = useReducer(reducer, {
    logs: [],
    loading: false,
    error: "",
    total: 0,
  });
  const { logs, loading, error, total } = state;

  const authtoken = useSelector((state) => state.authtoken);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pageInput, setPageInput] = useState("");
  const { site_id } = useParams();
  const [filters, setFilters] = useState({ date: "" });
  const [selectedTrack, setSelectedTrack] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchLogs = async () => {
    dispatch({ type: "FETCH_LOGS_REQUEST" });
    try {
      const response = await axios.post(
        `/api/v1/robot-tracking/log-data/${site_id}`,
        {
          pg: page,
          limit,
          date: filters.date, // send date here
        },
        {
          headers: { Authorization: `Bearer ${authtoken}` },
        }
      );
      dispatch({
        type: "FETCH_LOGS_SUCCESS",
        payload: response.data,
      });
    } catch (err) {
      dispatch({
        type: "FETCH_LOGS_FAIL",
        payload: err.response?.data?.error || err.response?.data?.message,
      });
      toast.error(err.response?.data?.error || err.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, limit, site_id, filters.date]);

  const filteredData = logs.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.robot_no?.toLowerCase().includes(term) ||
      item.block?.toLowerCase().includes(term) ||
      item.site_id?.toLowerCase().includes(term)
    );
  });

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPage(1); // reset to first page when filter changes
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1) setPage(newPage);
  };

  const handlePageInputChange = (e) => setPageInput(e.target.value);

  const handlePageInputSubmit = () => {
    const pageNumber = parseInt(pageInput);
    if (!isNaN(pageNumber) && pageNumber >= 1) setPage(pageNumber);
  };
  const handleTrackClick = (trackDetails) => {
    setSelectedTrack(trackDetails);
    setModalVisible(true);
  };

  return (
    <div>
      {/* Title */}
      <CRow className="justify-content-start">
        <CCol xs="12" className="text-center">
          <h2 className="m-0">Robot Tracking Logs</h2>
        </CCol>
      </CRow>

      {/* Filters: Date + Search */}
      <CRow className="mb-3 justify-content-end gap-2">
        {/* Date Filter */}
        <CCol xs="12" sm="auto">
          <CFormInput
            type="date"
            value={filters.date}
            onChange={(e) => handleFilterChange("date", e.target.value)}
            max={moment().format("YYYY-MM-DD")}
            style={{ minWidth: "140px" }}
          />
        </CCol>

        {/* Search Input */}
        <CCol xs="12" sm="auto">
          <CFormInput
            type="text"
            placeholder="Search by Robot No, Block, or Site ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ minWidth: "200px" }}
          />
        </CCol>
      </CRow>

      <CTable bordered hover responsive className="text-center table-container">
        <CTableHead color="secondary">
          <CTableRow>
            <CTableHeaderCell>Robot No</CTableHeaderCell>
            <CTableHeaderCell>Block</CTableHeaderCell>
            <CTableHeaderCell>Row No</CTableHeaderCell>
            <CTableHeaderCell>Row Length</CTableHeaderCell>
            <CTableHeaderCell>Start At</CTableHeaderCell>
            <CTableHeaderCell>Finish At</CTableHeaderCell>
            <CTableHeaderCell>Cleaning Cancelled</CTableHeaderCell>
            <CTableHeaderCell>Battery Dead</CTableHeaderCell>
            <CTableHeaderCell>Battery Status</CTableHeaderCell>
            <CTableHeaderCell>Battery Status Updated At</CTableHeaderCell>
            <CTableHeaderCell>Comments</CTableHeaderCell>
            <CTableHeaderCell>Track Details</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {loading ? (
            <CTableRow>
              <CTableDataCell colSpan="11" className="text-center fw-bold">
                <LoadingSpinner />
              </CTableDataCell>
            </CTableRow>
          ) : error ? (
            <CTableRow>
              <CTableDataCell
                colSpan="11"
                className="text-center text-danger fw-bold"
              >
                {error}
              </CTableDataCell>
            </CTableRow>
          ) : filteredData.length === 0 ? (
            <CTableRow>
              <CTableDataCell colSpan="11" className="text-center text-danger">
                No logs found
              </CTableDataCell>
            </CTableRow>
          ) : (
            filteredData.map((item, index) => (
              <CTableRow key={index}>
                <CTableDataCell>{item.robot_no}</CTableDataCell>
                <CTableDataCell>{item.block}</CTableDataCell>
                <CTableDataCell>{item.row_no}</CTableDataCell>
                <CTableDataCell>{item.row_length}</CTableDataCell>
                <CTableDataCell>
                  {item.startAt
                    ? new Date(item.startAt).toLocaleString()
                    : "N/A"}
                </CTableDataCell>
                <CTableDataCell>
                  {item.finishAt
                    ? new Date(item.finishAt).toLocaleString()
                    : "N/A"}
                </CTableDataCell>
                <CTableDataCell>
                  {item.cleaning_cancelled_at ? (
                    <CBadge color="danger">Yes</CBadge>
                  ) : (
                    <CBadge color="success">No</CBadge>
                  )}
                </CTableDataCell>
                <CTableDataCell>
                  {item.battery_dead_at ? (
                    <CBadge color="danger">Yes</CBadge>
                  ) : (
                    <CBadge color="success">No</CBadge>
                  )}
                </CTableDataCell>
                <CTableDataCell>
                  {item.battery_health_status || "N/A"}
                </CTableDataCell>
                <CTableDataCell>
                  {item.battery_health_status_updated_at
                    ? new Date(
                        item.battery_health_status_updated_at
                      ).toLocaleString()
                    : "N/A"}
                </CTableDataCell>
                <CTableDataCell>{item.comments || ""}</CTableDataCell>
                <CTableDataCell>
                  <CButton
                    color="info"
                    size="sm"
                    onClick={() => handleTrackClick(item.track_details)}
                    disabled={
                      !item.track_details || item.track_details.length === 0
                    }
                  >
                    View
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))
          )}
        </CTableBody>
      </CTable>

      <CModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        size="lg"
      >
        <CModalHeader closeButton={false}>
          <CModalTitle>Track Details</CModalTitle>{" "}
          <button
            type="button"
            className=" border-0 ms-auto py-0 px-1"
            onClick={() => setModalVisible(false)}
            style={{ background: "none" }}
          >
            <CIcon icon={cilX} size="lg" />
          </button>
        </CModalHeader>
        <CModalBody>
          {selectedTrack.length === 0 ? (
            <p>No track details available</p>
          ) : (
            <CTable bordered hover responsive>
              <CTableHead color="secondary">
                <CTableRow>
                  <CTableHeaderCell>Point</CTableHeaderCell>
                  <CTableHeaderCell>Timestamp</CTableHeaderCell>
                  <CTableHeaderCell>Reached Next Point</CTableHeaderCell>
                  <CTableHeaderCell>Next Point</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {selectedTrack.map((t, idx) => (
                  <CTableRow key={idx}>
                    <CTableDataCell>{t.point}</CTableDataCell>
                    <CTableDataCell>
                      {new Date(t.timestamp).toLocaleString()}
                    </CTableDataCell>
                    <CTableDataCell>
                      {t.reached_to_next_point ? "Yes" : "No"}
                    </CTableDataCell>
                    <CTableDataCell>{t.next_point || "-"}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      <PaginateInput
        page={page}
        totalPages={Math.ceil(total / limit)}
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

export default RobotTrackingLog;
