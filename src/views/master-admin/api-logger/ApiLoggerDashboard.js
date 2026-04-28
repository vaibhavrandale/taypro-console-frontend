import React, { useEffect, useReducer, useState } from "react";
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CCard,
  CCardBody,
  CRow,
  CCol,
  CButton,
  CAlert,
  CFormInput,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CImage,
} from "@coreui/react";
import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { RefreshCcw } from "lucide-react";
import { cilX } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import UserApiUsageBarChart from "./UserApiUsageBarChart";
import EndpointUsageTable from "./EndpointUsageTable";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_LOGS_REQUEST":
      return { ...state, loading: true, error: "" };

    case "FETCH_LOGS_SUCCESS":
      return {
        ...state,
        loading: false,
        users: action.payload.users,
        summary: action.payload.summary,
      };

    case "FETCH_LOGS_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

const ApiLoggerDashboard = () => {
  const [{ users, summary, loading, error }, dispatch] = useReducer(reducer, {
    users: [],
    summary: null,
    loading: true,
    error: "",
  });
  const [refreshKey, setRefreshKey] = useState(0);
  const [mainSearch, setMainSearch] = useState("");
  const [modalSearch, setModalSearch] = useState("");
  const [selectedUserName, setSelectedUserName] = useState("");
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);

  // const authtoken = useSelector((state) => state.authtoken);
  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userLogs, setUserLogs] = useState([]);
  const [userLogsLoading, setUserLogsLoading] = useState(false);
  const [userLogsError, setUserLogsError] = useState("");
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        dispatch({ type: "FETCH_LOGS_REQUEST" });

        const result = await axios.get("/api/v1/api-logger/user-wise", {
          // headers: { Authorization: `Bearer ${authtoken}` },
          withCredentials: true,
        });

        dispatch({
          type: "FETCH_LOGS_SUCCESS",
          payload: {
            summary: result.data.summary,
            users: result.data.users,
          },
        });
      } catch (err) {
        dispatch({
          type: "FETCH_LOGS_FAIL",
          payload:
            err.response?.data?.error ||
            err.response?.data?.message ||
            "Error fetching logs",
        });
      }
    };

    fetchLogs();
  }, [refreshKey]);

  // Fetch logs when modal opens
  useEffect(() => {
    if (modalVisible && selectedUserId) {
      const fetchUserLogs = async () => {
        try {
          setUserLogsLoading(true);
          setUserLogsError("");
          const res = await axios.get(
            `/api/v1/api-logger/full-logs/${selectedUserId}`,
          );
          console.log(res);

          setUserLogs(res.data.logs);
        } catch (err) {
          setUserLogsError(
            err.response?.data?.message || err.response?.data?.error,
          );
        } finally {
          setUserLogsLoading(false);
        }
      };
      fetchUserLogs();
    }
  }, [modalVisible, selectedUserId]);

  // ⭐ Filter users based on search box
  const filteredLogs =
    users &&
    users.filter((log) => {
      const user = log._id?.name?.toLowerCase() || "";
      return user.includes(mainSearch.toLowerCase());
    });

  const filteredUserLogs =
    userLogs &&
    userLogs.filter((log) => {
      const user = log.endpoint?.toLowerCase();
      return user.includes(modalSearch.toLowerCase());
    });

  return (
    <div className="">
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <CAlert>{error}</CAlert>
      ) : (
        <>
          <h2 className=" text-center mb-4">User API Usage Logs</h2>
          <div className="d-flex justify-content-end align-items-center gap-2 mb-3">
            <CButton
              size="sm"
              color="primary"
              onClick={() => setRefreshKey((prev) => prev + 1)}
            >
              <RefreshCcw size={18} /> Refresh
            </CButton>
          </div>
          {/* SUMMARY CARDS */}
          {summary && (
            <CRow className="mb-4">
              {/* MOST ACTIVE USERS */}
              <CCol md={6}>
                <CCard className="shadow-sm">
                  <CCardBody>
                    <h5 className="fw-bold mb-3">🔥 Most Active Users</h5>

                    <div className=" p-2 small">
                      {summary?.mostActiveUsers.length > 0 ? (
                        summary.mostActiveUsers.map((u, index) => (
                          <div
                            key={index}
                            className="py-2 px-2 d-flex align-items-center justify-content-between border-bottom"
                          >
                            <div className="d-flex align-items-center gap-2">
                              <CBadge color="warning" className="p-2">
                                {index + 1}
                              </CBadge>
                              <img
                                alt={u._id.role}
                                src={u._id.profile_image}
                                className="border"
                                style={{
                                  borderRadius: "50%",
                                  height: "20px",
                                  width: "20px",
                                }}
                              />
                              <span className="">
                                {u._id.name || "- "} - {u._id.role || "-"}
                              </span>
                            </div>

                            <strong className="text-success">
                              {u.hitCount} hits
                            </strong>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-3 fw-semibold text-muted">
                          No users found
                        </div>
                      )}
                    </div>
                  </CCardBody>
                </CCard>
              </CCol>

              {/* MOST USED ENDPOINTS */}
              <CCol md={6}>
                <CCard className="shadow-sm">
                  <CCardBody>
                    <h5 className="fw-bold mb-3">📌 Top Used Endpoints</h5>

                    <div className="rounded p-2  small">
                      {summary?.mostUsedEndpoints.length > 0 ? (
                        summary.mostUsedEndpoints.map((e, index) => (
                          <div
                            key={index}
                            className="py-2 px-2 d-flex align-items-center justify-content-between border-bottom"
                          >
                            <div className="d-flex align-items-center gap-2">
                              <CBadge color="warning" className="p-2">
                                {index + 1}
                              </CBadge>
                              <span
                                title={e._id}
                                style={{
                                  maxWidth: "260px",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {e._id}
                              </span>
                            </div>

                            <span className="text-danger fw-semibold">
                              {e.hitCount} hits
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-3 fw-semibold text-muted">
                          No endpoints found
                        </div>
                      )}
                    </div>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          )}
          <div className="d-flex justify-content-end align-items-center gap-2 mb-3">
            <CFormInput
              placeholder="Search by user, endpoint, or method..."
              value={mainSearch}
              onChange={(e) => setMainSearch(e.target.value)}
              style={{ maxWidth: "350px" }}
            />{" "}
          </div>
          {/* LOGS TABLE */}
          <CTable
            bordered
            hover
            responsive
            className="text-center shadow-sm bg-important"
          >
            <CTableHead color="secondary">
              <CTableRow>
                <CTableHeaderCell>#</CTableHeaderCell>
                <CTableHeaderCell>User</CTableHeaderCell>

                <CTableHeaderCell style={{ width: "100px" }}>
                  Hit Count
                </CTableHeaderCell>
                <CTableHeaderCell>Last Hit</CTableHeaderCell>
                <CTableHeaderCell>Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>

            <CTableBody>
              {filteredLogs?.length > 0 ? (
                filteredLogs.map((log, i) => (
                  <CTableRow key={i}>
                    <CTableDataCell>{i + 1}</CTableDataCell>

                    <CTableDataCell>{log._id?.name || "-"}</CTableDataCell>

                    <CTableDataCell>{log.totalHits}</CTableDataCell>

                    <CTableDataCell>
                      {moment(log.lastHit).format("DD/MM/YYYY hh:mm A")}
                    </CTableDataCell>
                    <CTableDataCell>
                      <CButton
                        size="sm"
                        color="info"
                        onClick={() => {
                          setSelectedUserId(log._id?.userId);
                          setSelectedUserName(log._id?.name);
                          setModalVisible(true);
                        }}
                      >
                        View Logs
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan={6} className="fw-bold text-center">
                    No API logs found
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>

          {/* Modal for User Logs */}
          <CModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            size="xl"
            scrollable
            backdrop="static"
          >
            <CModalHeader closeButton={false}>
              <CModalTitle>User Logs – {selectedUserName}</CModalTitle>
              <button
                type="button"
                className="border-0 ms-auto py-0 px-1"
                onClick={() => setModalVisible(false)}
                style={{ background: "none" }}
              >
                <CIcon icon={cilX} size="lg" />
              </button>
            </CModalHeader>
            {/* <CModalBody>
              {userLogsLoading ? (
                <LoadingSpinner />
              ) : userLogsError ? (
                <CAlert color="danger">{userLogsError}</CAlert>
              ) : filteredUserLogs.length === 0 ? (
                <div className="text-center py-3">
                  No logs found for this user
                </div>
              ) : (
                <>
                  <div className="d-flex justify-content-end align-items-center gap-2 mb-3">
                    <CFormInput
                      placeholder="Search by user, endpoint, or method..."
                      value={modalSearch}
                      onChange={(e) => setModalSearch(e.target.value)}
                      style={{ maxWidth: "350px" }}
                    />{" "}
                  </div>
                  <CTable bordered hover responsive className="text-center">
                    <CTableHead color="secondary">
                      <CTableRow>
                        <CTableHeaderCell>#</CTableHeaderCell>
                        <CTableHeaderCell>Endpoint</CTableHeaderCell>
                        <CTableHeaderCell>Method</CTableHeaderCell>
                        <CTableHeaderCell>Created At</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {filteredUserLogs.map((log, index) => (
                        <CTableRow key={index}>
                          <CTableDataCell>{index + 1}</CTableDataCell>
                          <CTableDataCell>{log.endpoint}</CTableDataCell>
                          <CTableDataCell>{log.method}</CTableDataCell>
                          <CTableDataCell>
                            {moment(log.createdAt).format("DD/MM/YYYY hh:mm A")}
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                </>
              )}
            </CModalBody> */}
            <CModalBody>
              {userLogsLoading ? (
                <LoadingSpinner />
              ) : userLogsError ? (
                <CAlert color="danger">{userLogsError}</CAlert>
              ) : filteredUserLogs.length === 0 ? (
                <div className="text-center py-3">
                  No logs found for this user
                </div>
              ) : (
                <>
                  {/* BAR CHART */}
                  <UserApiUsageBarChart
                    logs={filteredUserLogs}
                    onSelectEndpoint={setSelectedEndpoint}
                  />

                  {/* TABLE */}
                  <EndpointUsageTable selectedLog={selectedEndpoint} />
                </>
              )}
            </CModalBody>
          </CModal>
        </>
      )}
    </div>
  );
};

export default ApiLoggerDashboard;
