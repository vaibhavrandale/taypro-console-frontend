import React, { useEffect, useReducer, useState } from "react";
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CInputGroup,
  CFormInput,
  CRow,
  CCol,
  CBadge,
} from "@coreui/react";
import axios from "axios";
import toast from "react-hot-toast";
import moment from "moment";
import LoadingSpinner from "../../../components/LoadingSpinner";
import PaginateInput from "../../../components/PaginateInput";
import { useSelector } from "react-redux";
import Paginations from "../../base/paginations/Paginations";
import { Link } from "react-router-dom";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        logs: action.payload.data,
        total: action.payload.total,
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

const EmailLogs = () => {
  const [
    { loading, error, logs, total, totalPages, hasNextPage, hasPrevPage },
    dispatch,
  ] = useReducer(reducer, {
    logs: [],
    loading: true,
    error: "",
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const authtoken = useSelector((state) => state.authtoken);
  const [pageInput, setPageInput] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const userInfo = useSelector((state) => state.userInfo);

  let adminroute = "";

  if (userInfo.role === "Master Admin") {
    adminroute = "master-admin";
  } else if (userInfo.role === "Service Admin") {
    adminroute = "service-admin";
  } else if (userInfo.role === "Project Admin") {
    adminroute = "project-admin";
  } else if (userInfo?.role === "Master User") {
    adminroute = "master-user";
  } else if (userInfo?.role === "Service User") {
    adminroute = "service-user";
  } else if (userInfo?.role === "Project User") {
    adminroute = "project-user";
  }

  useEffect(() => {
    const fetchEmailLogs = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      let pagination = {
        pg: page,
        limit: limit,
      };
      try {
        const result = await axios.post(
          `/api/v1/email-logs/get-all-email-logs`,
          pagination,
          {
            headers: {
              Authorization: `Bearer ${authtoken}`,
            },
          }
        );

        const responseData = result?.data || {};
        const totalItems = responseData.total || 0;
        const totalPages = Math.ceil(totalItems / limit);

        dispatch({
          type: "FETCH_SUCCESS",
          payload: {
            data: responseData.data || [],
            total: totalItems,
            totalPages: totalPages,
            hasNextPage: responseData.hasNextPage || false,
            hasPrevPage: responseData.hasPrevPage || false,
          },
        });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: error.response?.data?.message || error.response?.data?.error,
        });

        toast.error(
          error.response?.data?.message || error.response?.data?.error
        );
      }
    };
    fetchEmailLogs();
  }, [authtoken, page, limit]);

  // const filteredData = React.useMemo(() => {
  //   return (logs || []).filter((log) => {
  //     if (!log) return false;
  //     const searchLower = searchTerm.toLowerCase();
  //     return (
  //       (log.module_name?.toLowerCase() || "").includes(searchLower) ||
  //       (log.log_message?.toLowerCase() || "").includes(searchLower) ||
  //       (log.sent_to?.join(", ")?.toLowerCase() || "").includes(searchLower)
  //     );
  //   });
  // }, [logs, searchTerm]);

  const filteredData = logs.filter((log) => {
    if (!log) return false;
    const searchLower = searchTerm.toLowerCase();
    return (
      (log.module_name?.toLowerCase() || "").includes(searchLower) ||
      (log.log_message?.toLowerCase() || "").includes(searchLower) ||
      (log.sent_to?.join(", ")?.toLowerCase() || "").includes(searchLower)
    );
  });

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
    if (!isNaN(pageNumber)) {
      if (pageNumber >= 1 && pageNumber <= totalPages) {
        handlePageChange(pageNumber);
      } else {
        toast.error(`Please enter a page number between 1 and ${totalPages}`);
      }
    }
  };

  const getStatusBadge = (status) => {
    return status ? "success" : "danger";
  };

  return (
    <div className="">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="">Email Logs</h3>
        <div className="text-muted">Total: {total} records</div>
      </div>

      {/* Search Input */}
      <CRow className="justify-content-end">
        <CCol xs={12} sm={10} md={8} lg={5}>
          <CInputGroup className="mb-3">
            <CFormInput
              type="text"
              placeholder="Search by module name, recipients or log message"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </CInputGroup>
        </CCol>
      </CRow>

      {/* Email Logs Table */}
      <CTable bordered hover responsive className="bg-important">
        <CTableHead color="secondary">
          <CTableRow>
            <CTableHeaderCell>Sr</CTableHeaderCell>
            <CTableHeaderCell>Module</CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "160px" }}>
              Recipients
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "200px" }}>
              {" "}
              Log Message
            </CTableHeaderCell>

            <CTableHeaderCell style={{ minWidth: "160px" }}>
              Sent At
            </CTableHeaderCell>
            <CTableHeaderCell>View</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {loading ? (
            <CTableRow>
              <CTableHeaderCell colSpan="7" className="text-center">
                <LoadingSpinner />
              </CTableHeaderCell>
            </CTableRow>
          ) : error ? (
            <CTableRow>
              <CTableHeaderCell colSpan="7" className="text-center">
                {error}
              </CTableHeaderCell>
            </CTableRow>
          ) : filteredData && filteredData.length > 0 ? (
            filteredData.map((log, index) => (
              <CTableRow key={log?._id || index}>
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell>{log?.module_name || "N/A"}</CTableDataCell>
                <CTableDataCell>
                  <CBadge color={getStatusBadge(log?.email_sent)}>
                    {log?.email_sent ? "Success" : "Failed"}
                  </CBadge>
                </CTableDataCell>
                <CTableDataCell>
                  {/* {log?.sent_to?.slice(0, 2).join(", ") || "N/A"}
                  {log?.sent_to?.length > 2 && (
                    <CTooltip content={log.sent_to?.join(", ") || ""}>
                      <span> +{log.sent_to.length - 2} more</span>
                    </CTooltip>
                  )} */}
                  <ul>
                    {log?.sent_to?.length > 0 ? (
                      log.sent_to.map((recipient, idx) => (
                        <li key={idx}>{recipient}</li>
                      ))
                    ) : (
                      <span>N/A</span>
                    )}
                  </ul>
                </CTableDataCell>
                <CTableDataCell>{log?.log_message || "N/A"}</CTableDataCell>
                <CTableDataCell>
                  {moment(log.sent_at).format("DD MMM YYYY, hh:mm A")}
                </CTableDataCell>
                <CTableDataCell>
                  {log?.email_sent ? (
                    <Link
                      to={`${log?._id}`}
                      className="btn btn-sm btn-secondary m-1"
                    >
                      View
                    </Link>
                  ) : (
                    <span
                      className="btn btn-sm btn-secondary m-1 disabled text-muted"
                      style={{ pointerEvents: "none", opacity: 0.6 }}
                    >
                      View
                    </span>
                  )}
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan="6" className="text-center">
                No email logs found
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

export default EmailLogs;
