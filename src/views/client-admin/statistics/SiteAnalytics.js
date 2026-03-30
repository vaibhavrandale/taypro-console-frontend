import React, { useState, useEffect, useReducer } from "react";
import axios from "axios";
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CFormInput,
  CTable,
  CTableDataCell,
  CBadge,
  CTableRow,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
} from "@coreui/react";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";
import SubscriptionExpiryCard from "../../../components/SubscriptionExpiryCard";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_CLEANING_REQUEST":
      return { ...state, siteAnalyticsLoading: true, siteAnalyticsError: "" };

    case "FETCH_CLEANING_SUCCESS":
      return {
        ...state,
        siteAnalyticsLoading: false,
        robots: action.payload.robots,
        summary: action.payload.summary,
      };

    case "FETCH_FAIL":
      return {
        ...state,
        siteAnalyticsLoading: false,
        siteAnalyticsError: action.payload,
        subscriptiondata: action.subscriptiondata,
        subscriptionStatus: action.subscriptionStatus,
      };
    default:
      return state;
  }
};

const SiteAnalytics = () => {
  const [
    {
      summary,
      robots,
      siteAnalyticsLoading,
      siteAnalyticsError,
      subscriptiondata,
      subscriptionStatus,
    },
    dispatch,
  ] = useReducer(reducer, {
    summary: {
      total_robots: 0,
      total_cycles: 0,
      avg_cleaning_minutes: 0,
    },
    robots: [],
    siteAnalyticsError: "",
    siteAnalyticsLoading: false,
    subscriptiondata: {},
    subscriptionStatus: "",
  });
  const site_id = "avaada_agar";
  const today = new Date();
  const last7 = new Date();
  const authtoken = useSelector((state) => state.authtoken);
  last7.setDate(today.getDate() - 7);

  const formatDate = (d) => d.toISOString().slice(0, 10);

  const [startDate, setStartDate] = useState(formatDate(last7));
  const [endDate, setEndDate] = useState(formatDate(today));

  useEffect(() => {
    const fetchRobotAnalytics = async () => {
      try {
        dispatch({ type: "FETCH_CLEANING_REQUEST" });

        const result = await axios.post(
          `/api/v1/robot-tracking/site-cleaning-analytics`,
          {
            site_id,
            startDate,
            endDate,
          },
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          },
        );
        const resData = result.data.data;
        dispatch({
          type: "FETCH_CLEANING_SUCCESS",
          payload: {
            summary: resData.summary,
            robots: resData.robots,
          },
        });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: error.response?.data?.error || error.response?.data?.message,
          subscriptiondata: error.response?.data?.data,
          subscriptionStatus: error.response?.data?.subscriptionStatus,
        });
        toast.error(
          error.response?.data?.error || error.response?.data?.message,
        );
      }
    };

    fetchRobotAnalytics();
  }, [startDate, endDate, authtoken]);

  const checkStatus = [
    "subscriptionSitesAssigned",
    "subscriptionFound",
    "subscriptionaRenewStatus",
    "subscriptionPaymentStatus",
    "subscriptionPlanAccess",
  ];
  return (
    <div>
      {siteAnalyticsLoading ? (
        <LoadingSpinner />
      ) : checkStatus.includes(subscriptionStatus) ? (
        <SubscriptionExpiryCard
          data={subscriptiondata}
          subscriptionStatus={subscriptionStatus}
          error={siteAnalyticsError}
        />
      ) : (
        <>
          {/* FILTER */}

          <CCard className="mb-4 shadow-sm border-0">
            <CCardHeader className="fw-semibold d-flex justify-content-between align-items-center">
              <span>Filters</span>
            </CCardHeader>

            <CCardBody>
              <CRow className="align-items-end g-3">
                {/* Date Filters */}
                <CCol md={3}>
                  <CFormInput
                    type="date"
                    label="Start Date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </CCol>

                <CCol md={3}>
                  <CFormInput
                    type="date"
                    label="End Date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </CCol>

                {/* Summary Badges */}
                <CCol md={6}>
                  <div className="d-flex flex-wrap justify-content-md-end gap-2">
                    <CBadge
                      color="warning"
                      shape="rounded-pill"
                      className="px-3 py-2 fs-6 d-flex align-items-center gap-1"
                    >
                      <small className=" ms-1 me-1">Total Robots</small>
                      <span className="fw-semibold">
                        : {summary.total_robots}
                      </span>
                    </CBadge>

                    <CBadge
                      color="info"
                      shape="rounded-pill"
                      className="px-3 py-2 fs-6 d-flex align-items-center gap-1"
                    >
                      <small className="ms-1 me-1">Avg Cleaning Time</small>
                      <span className="fw-semibold">
                        : {summary.avg_cleaning_minutes}
                      </span>
                    </CBadge>

                    <CBadge
                      color="success"
                      shape="rounded-pill"
                      className="px-3 py-2 fs-6 d-flex align-items-center gap-1"
                    >
                      <small className="ms-1 me-1">Total Cycles</small>
                      <span className="fw-semibold">
                        : {summary.total_cycles}
                      </span>
                    </CBadge>
                  </div>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>

          <div>
            <CTable striped hover responsive bordered align="middle">
              <CTableHead color="dark">
                <CTableRow>
                  <CTableHeaderCell>#</CTableHeaderCell>
                  <CTableHeaderCell>Robot No</CTableHeaderCell>
                  <CTableHeaderCell>Total Cycles</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">
                    Avg Time (min)
                  </CTableHeaderCell>

                  <CTableHeaderCell className="text-center">
                    Avg Battery Before Cleaning
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center">
                    Avg Battery After Cleaning
                  </CTableHeaderCell>

                  <CTableHeaderCell className="text-center">
                    Max Wheel
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center">
                    Avg Wheel
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center">
                    Max Brush
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center">
                    Avg Brush
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>

              <CTableBody>
                {robots.length > 0 ? (
                  robots.map((robot, index) => (
                    <CTableRow key={robot.robot_no}>
                      <CTableDataCell>{index + 1}</CTableDataCell>

                      <CTableDataCell>{robot.robot_no}</CTableDataCell>
                      <CTableDataCell>{robot.total_cycles}</CTableDataCell>

                      <CTableDataCell className="text-center">
                        {robot.avg_cleaning_minutes}
                      </CTableDataCell>

                      <CTableDataCell className="text-center">
                        {robot.avgBatteryBeforeCleaning}
                      </CTableDataCell>

                      <CTableDataCell className="text-center">
                        {robot.avgBatteryAfterCleaning}
                      </CTableDataCell>

                      <CTableDataCell className="text-center">
                        {robot.maxWheelCurrent}
                      </CTableDataCell>

                      <CTableDataCell className="text-center">
                        {robot.avgWheelCurrent}
                      </CTableDataCell>

                      <CTableDataCell className="text-center">
                        {robot.maxBrushCurrent}
                      </CTableDataCell>

                      <CTableDataCell className="text-center">
                        {robot.avgBrushCurrent}
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan={11} className="text-center">
                      No data available for the selected date range.
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          </div>
        </>
      )}
    </div>
  );
};

export default SiteAnalytics;
