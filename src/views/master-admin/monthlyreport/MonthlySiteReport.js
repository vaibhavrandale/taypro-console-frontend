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
  CTableBody,
  CTableRow,
  CTableDataCell,
  CTableHeaderCell,
  CTable,
  CTableHead,
  CButton,
} from "@coreui/react";
import toast from "react-hot-toast";
import LoadingSpinner from "../../../components/LoadingSpinner";
import PaginateInput from "../../../components/PaginateInput";
import * as XLSX from "xlsx";
import SubscriptionExpiryCard from "../../../components/SubscriptionExpiryCard";

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
        subscriptiondata: action.subscriptiondata,
        subscriptionStatus: action.subscriptionStatus,
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
      error,
      errorReport,
      monthlyreports,
      totalPages,
      hasNextPage,
      hasPrevPage,
      subscriptiondata,
      subscriptionStatus,
    },
    dispatch,
  ] = useReducer(reducer, {
    loadingSites: true,
    loadingMonthlyReport: true,
    sites: [],
    monthlyreports: [],
    errorReport: "",
    error: "",
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
    subscriptiondata: {},
    subscriptionStatus: "",
  });

  const authtoken = useSelector((state) => state.authtoken);
  const [site_id, setSiteId] = useState("");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );
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
        console.log(res);
        dispatch({ type: "FETCH_SITES_SUCCESS", payload: res.data.data });
      } catch (error) {
        dispatch({
          type: "FETCH_SITES_FAIL",
          payload: error.response?.data?.error || error.response?.data?.message,
        });
      }
    };

    const data = {
      site_id: site_id,
      pg: page,
      limit: limit,
      startDate: startDate,
      endDate: endDate,
    };
    const fetchMonthlyReport = async () => {
      dispatch({ type: "FETCH_MONTHLYREPORT_REQUEST" });
      try {
        const res = await axios.post(`/api/v1/monthlysitereports`, data, {
          headers: { Authorization: `Bearer ${authtoken}` },
        });
        console.log(res);

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
          subscriptiondata: err.response?.data?.data,
          subscriptionStatus: err.response?.data?.subscriptionStatus,
        });
        toast.error(err.response?.data?.message || err.response?.data?.error);
      }
    };

    fetchSites();
    fetchMonthlyReport();
  }, [authtoken, endDate, limit, page, site_id, startDate]);

  const exportMonthlyReportToExcel = () => {
    if (!monthlyreports || monthlyreports.length === 0) {
      toast.error("No monthly report data available to export.");
      return;
    }

    const mergedData = [];

    monthlyreports.forEach((report, reportIndex) => {
      // Header for each site/month section
      mergedData.push([
        `${report.site_name} - ${new Date(report.report_month).toLocaleString(
          "default",
          {
            month: "long",
            year: "numeric",
          }
        )}`,
      ]);
      mergedData.push([]);

      // Uptime Summary
      mergedData.push(["Uptime Summary"]);
      mergedData.push(["Uptime (%)", "Total Robots"]);
      mergedData.push([
        report.uptimeData?.uptime ?? "N/A",
        report.uptimeData?.totalRobots ?? "N/A",
      ]);
      mergedData.push([]);

      // Inventory Data
      mergedData.push(["Inventory"]);
      if (report.inventoryData?.length > 0) {
        mergedData.push(["Sr No.", "Item Name", "Quantity"]);
        report.inventoryData.forEach((item, idx) => {
          mergedData.push([idx + 1, item.item_name, item.quantity]);
        });
      } else {
        mergedData.push(["No inventory data available"]);
      }
      mergedData.push([]);

      // PM Data
      mergedData.push(["PM Data"]);
      if (report.pmData?.robotsServiced?.length > 0) {
        mergedData.push(["Sr No.", "Robot No", "PM ID", "Date"]);
        report.pmData.robotsServiced.forEach((robot, idx) => {
          mergedData.push([
            idx + 1,
            robot.robot_no || "N/A",
            robot.pm_id || "N/A",
            robot.createdAt
              ? new Date(robot.createdAt).toLocaleString()
              : "N/A",
          ]);
        });
      } else {
        mergedData.push(["No PM data available"]);
      }

      // Spacing between each site report
      mergedData.push([]);
      mergedData.push([]);
    });

    // Create and export the Excel file
    const ws = XLSX.utils.aoa_to_sheet(mergedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Monthly Site Report");

    try {
      XLSX.writeFile(
        wb,
        `Monthly_Report_${site_id || "All"}_${startDate || "Start"}_to_${
          endDate || "End"
        }.xlsx`
      );
      toast.success("Monthly report Excel downloaded successfully!");
    } catch (error) {
      console.error("Excel export error:", error);
      toast.error("Failed to export Excel file.");
    }
  };

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

  // const subscriptionErrors = [
  //   "Subscription expired. Please renew your subscription.",
  //   "Please subscribe to use this feature.",
  //   "Payment for the last invoice is pending. Please complete the payment to continue using the service.",
  // ];

  const checkStatus = [
    "subscriptionSitesAssigned",
    "subscriptionFound",
    "subscriptionaRenewStatus",
    "subscriptionPaymentStatus",
    "subscriptionPlanAccess",
  ];

  return (
    <div className="p-4">
      {loadingSites ? (
        <>
          <LoadingSpinner />
        </>
      ) : loadingMonthlyReport ? (
        <LoadingSpinner />
      ) : // subscriptionErrors.includes(errorReport || error) ? (
      //   <SubscriptionExpiryCard data={subscriptiondata} subscriptionStatus={subscriptionStatus}  error={errorReport} />
      checkStatus.includes(subscriptionStatus) ? (
        <SubscriptionExpiryCard
          data={subscriptiondata}
          subscriptionStatus={subscriptionStatus}
          error={errorReport}
        />
      ) : errorReport || error ? (
        error || errorReport
      ) : (
        <>
          {/* Header Section */}
          <div className="text-center mb-4">
            <h3>Monthly Site Report </h3>
          </div>

          <CRow className="mt-auto justify-content-end">
            <CCol
              md={5}
              xs={12}
              className="d-flex justify-content-end align-items-end mb-3"
            >
              <CButton
                color="primary"
                size="sm"
                onClick={exportMonthlyReportToExcel}
              >
                Export to Excel
              </CButton>
            </CCol>
          </CRow>

          {/* Site Selection & Search */}
          <CRow className="mb-4 justify-content-between align-items-center">
            <CCol md={4}>
              <CFormSelect
                id="siteSelect"
                value={site_id}
                onChange={(e) => setSiteId(e.target.value)}
              >
                <option value="">Select a site</option>
                {sites &&
                  sites?.map((site, index) => (
                    <option key={index} value={site.site_id}>
                      {site.site_id}
                    </option>
                  ))}
              </CFormSelect>
            </CCol>

            <CCol
              md={7}
              xs={12}
              className="d-flex flex-wrap gap-2 justify-content-end"
            >
              <CCol md={3} xs={12} className="m-1">
                <CFormInput
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </CCol>
              <CCol md={3} xs={12} className="m-1">
                <CFormInput
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </CCol>
            </CCol>
          </CRow>

          {/* Report Overview Section */}
          {monthlyreports?.length === 0 ? (
            <CCol className="text-center py-5">No Monthly Report found</CCol>
          ) : (
            monthlyreports.map((report, index) => (
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
                          <CTable striped responsive bordered>
                            <CTableHead>
                              <CTableRow>
                                <CTableHeaderCell scope="col">
                                  Sr No.
                                </CTableHeaderCell>
                                <CTableHeaderCell scope="col">
                                  Item Name
                                </CTableHeaderCell>
                                <CTableHeaderCell scope="col">
                                  Quantity
                                </CTableHeaderCell>
                              </CTableRow>
                            </CTableHead>
                            <CTableBody>
                              {report.inventoryData.map((item, idx) => (
                                <CTableRow key={idx}>
                                  <CTableDataCell>{idx + 1}</CTableDataCell>
                                  <CTableDataCell>
                                    {item.item_name}
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    {item.quantity}
                                  </CTableDataCell>
                                </CTableRow>
                              ))}
                            </CTableBody>
                          </CTable>
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
                                      style={{
                                        fontSize: "0.9rem",
                                        color: "#666",
                                      }}
                                    >
                                      {new Date(
                                        robot.createdAt
                                      ).toLocaleString()}
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
        </>
      )}
    </div>
  );
};

export default MonthlySiteReport;
