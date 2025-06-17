import React, { useState, useEffect, useReducer } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  CRow,
  CCol,
  CFormSelect,
  CFormInput,
  CCard,
  CCardBody,
  CCardHeader,
  CBadge,
} from "@coreui/react";
import toast from "react-hot-toast";
import LoadingSpinner from "../../../components/LoadingSpinner";
import PaginateInput from "../../../components/PaginateInput";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_SITES_REQUEST":
      return { ...state, loadingSites: true, error: "" };
    case "FETCH_SITES_SUCCESS":
      return { ...state, loadingSites: false, sites: action.payload };
    case "FETCH_SITES_FAIL":
      return { ...state, loadingSites: false, error: action.payload };
    case "FETCH_MONTHLYREPORT_REQUEST":
      return { ...state, loadingMonthlyReport: true, errorReport: "" };
    case "FETCH_MONTHLYREPORT_SUCCESS":
      return {
        ...state,
        loadingMonthlyReport: false,
        monthlyreports: action.payload.data,
        totalPages: action.payload.totalPages, // Use API-provided totalPages
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
      };
    case "FETCH_MONTHLYREPORT_FAIL":
      return {
        ...state,
        loadingMonthlyReport: false,
        errorReport: action.payload,
      };
    default:
      return state;
  }
};

const MonthlySiteReport = () => {
  const [
    {
      sites,
      loadingSites,
      loadingMonthlyReport,
      reportError,
      monthlyreports,
      totalPages,
      hasNextPage,
      hasPrevPage,
    },
    dispatch,
  ] = useReducer(reducer, {
    loadingSites: false,
    loadingMonthlyReport: true,
    sites: [],
    monthlyreports: [],
    errorReport: "",
    error: "",
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const authtoken = useSelector((state) => state.authtoken);
  const [site_id, setSiteId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [pageInput, setPageInput] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    const fetchSites = async () => {
      dispatch({ type: "FETCH_SITES_REQUEST" });
      try {
        const res = await axios.get(`/api/v1/sites`, {
          headers: { Authorization: `Bearer ${authtoken}` },
        });
        dispatch({ type: "FETCH_SITES_SUCCESS", payload: res.data.data });
      } catch (err) {
        dispatch({
          type: "FETCH_SITES_FAIL",
          payload:
            err.response?.data?.error ||
            err.response?.data?.message ||
            err.message,
        });
        toast.error(
          "Failed to fetch sites" ||
            err.response?.data?.error ||
            err.response?.data?.message
        );
      }
    };

    const data = {
      site_id: site_id,
      pg: page,
      limit: limit,
    };
    const fetchMonthlyReport = async () => {
      dispatch({ type: "FETCH_MONTHLYREPORT_REQUEST" });
      try {
        const res = await axios.post(`/api/v1/monthlysitereports`, data, {
          headers: { Authorization: `Bearer ${authtoken}` },
        });

        let total = Math.ceil(Number(res.data.total) / Number(res.data.limit));
        let next = res.data.hasNextPage;
        let prev = res.data.hasPrevPage;
        dispatch({
          type: "FETCH_MONTHLYREPORT_SUCCESS",
          payload: {
            data: res.data.data,
            totalPages: total,
            hasNextPage: next,
            hasPrevPage: prev,
          },
        });
      } catch (err) {
        dispatch({
          type: "FETCH_MONTHLYREPORT_FAIL",
          payload: err.response?.data?.message || err.response?.data.error,
        });
        toast.error(err.response?.data?.message || err.response?.data?.error);
      }
    };

    fetchSites();
    fetchMonthlyReport();
  }, [authtoken, limit, page, site_id]);

  const filteredReports = monthlyreports
    // Convert search filter to string from the actual Date object
    .filter((report) =>
      new Date(report.report_month)
        .toLocaleString("default", { month: "long", year: "numeric" })
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    // Sort by latest month first
    .sort((a, b) => new Date(b.report_month) - new Date(a.report_month));

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
    <div className="p-4">
      {/* Header Section */}
      <div className="text-center mb-4">
        <h3>Monthly Site Report </h3>
      </div>

      {/* Site Selection & Search */}
      <CRow className="mb-4 justify-content-between align-items-center">
        <CCol md={4}>
          <CFormSelect
            id="siteSelect"
            value={site_id}
            onChange={(e) => setSiteId(e.target.value)}
          >
            <option value="">Select a site</option>
            {loadingSites ? (
              <LoadingSpinner />
            ) : (
              sites?.map((site, index) => (
                <option key={index} value={site.site_id}>
                  {site.site_id}
                </option>
              ))
            )}
          </CFormSelect>
        </CCol>
        <CCol md={4}>
          <CFormInput
            type="text"
            placeholder="Search by Month..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CCol>
      </CRow>

      {/* Report Overview Section */}
      {loadingMonthlyReport ? (
        <CCol className="text-center py-5">
          {" "}
          <LoadingSpinner />
        </CCol>
      ) : reportError ? (
        <CCol className="text-center text-danger py-5">{reportError}</CCol>
      ) : filteredReports?.length === 0 ? (
        <CCol className="text-center py-5">No Monthly Report found</CCol>
      ) : (
        filteredReports.map((report, index) => (
          <div key={index} className="mb-4">
            <CCard className="mb-3">
              <CCardHeader className="bg-light text-center">
                <h5>
                  {report.site_name} -{" "}
                  {new Date(report.report_month).toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })}
                </h5>
              </CCardHeader>
              <CCardBody>
                {/* Uptime & Robots Summary */}
                <CRow className="mb-3">
                  <CCol md={6}>
                    <div className="border rounded p-3 text-center h-100 shadow-sm">
                      <h6 className="text-white mb-1">Uptime</h6>
                      <h5 className="text-success">
                        {report.uptimeData?.uptime}%
                      </h5>
                    </div>
                  </CCol>
                  <CCol md={6}>
                    <div className="border rounded p-3 text-center h-100 shadow-sm">
                      <h6 className="text-white mb-1">Total Robots</h6>
                      <h5 className="text-success">
                        {report.uptimeData?.totalRobots}
                      </h5>
                    </div>
                  </CCol>
                </CRow>

                {/* Inventory Data */}
                {report.inventoryData?.length > 0 && (
                  <CCard className="mb-3">
                    <CCardHeader className="bg-success text-white">
                      Inventory
                    </CCardHeader>
                    <CCardBody>
                      <CRow>
                        {report.inventoryData.map((item, idx) => (
                          <CCol md={4} key={idx}>
                            <ul className="mb-0">
                              <li>
                                {item.item_name} (Count: {item.quantity})
                              </li>
                            </ul>
                          </CCol>
                        ))}
                      </CRow>
                    </CCardBody>
                  </CCard>
                )}

                {/* PM Data */}
                <CCard className="mb-3">
                  <CCardHeader className="bg-success text-white">
                    PM Data
                  </CCardHeader>
                  <CCardBody>
                    {report.pmData?.robotsServiced?.length > 0 ? (
                      <CRow className="g-3">
                        {report.pmData.robotsServiced.map((robot, idx) => (
                          <CCol md={3} sm={6} xs={12} key={idx}>
                            <CCard className="border shadow-sm h-100">
                              <CCardBody>
                                <h6 className="mb-2">
                                  Robot: {robot.robot_no}
                                </h6>
                                <CBadge color="success" className="mb-2">
                                  PM ID: {robot.pm_id}
                                </CBadge>
                                <div
                                  style={{ fontSize: "0.9rem", color: "#666" }}
                                >
                                  {new Date(robot.createdAt).toLocaleString()}
                                </div>
                              </CCardBody>
                            </CCard>
                          </CCol>
                        ))}
                      </CRow>
                    ) : (
                      <p className="text-muted">
                        No Robots serviced this month.
                      </p>
                    )}
                  </CCardBody>
                </CCard>
              </CCardBody>
            </CCard>
          </div>
        ))
      )}
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

export default MonthlySiteReport;
