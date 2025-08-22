import React, { useEffect, useReducer, useState } from "react";
import {
  CBadge,
  CCol,
  CFormInput,
  CInputGroup,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import moment from "moment";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { Link } from "react-router-dom";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        subscriptions: action.payload.data,
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

const SubscriptionDashboard = () => {
  const [state, dispatch] = useReducer(reducer, {
    subscriptions: [],
    loading: true,
    error: "",
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [searchTerm, setSearchTerm] = useState("");

  const { loading, error, subscriptions } = state;
  const authtoken = useSelector((state) => state.authtoken);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
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
    const fetchSubscriptions = async () => {
      const pagination = { pg: page, limit };
      dispatch({ type: "FETCH_REQUEST" });

      try {
        const response = await axios.get(`/api/v1/client-subscription`, {
          pagination,
          headers: { Authorization: `Bearer ${authtoken}` },
        });

        const total = Math.ceil(Number(response?.data?.total) / Number(limit));
        const hasNextPage = response?.data?.hasNextPage || false;
        const hasPrevPage = response?.data?.hasPrevPage || false;
        const subscriptions = response?.data?.data || [];

        dispatch({
          type: "FETCH_SUCCESS",
          payload: {
            data: subscriptions,
            totalPages: total,
            hasNextPage,
            hasPrevPage,
          },
        });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload:
            error.response?.data?.message ||
            error.response?.data?.error ||
            "Failed to fetch subscriptions",
        });
        toast.error(
          error.response?.data?.message ||
            error.response?.data?.error ||
            "Failed to fetch subscriptions"
        );
      }
    };
    fetchSubscriptions();
  }, [authtoken, page, limit]);

  // Filter table rows based on search term
  const filteredData = subscriptions.filter(
    (subscriptions) =>
      subscriptions.subscription_status
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      subscriptions.client_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      subscriptions.plan_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return (
      <div className="p-4 text-center">
        <LoadingSpinner />
      </div>
    );
  if (error)
    return <div className="p-4 text-red-500 text-center">Error: {error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Subscription Dashboard</h2>

      <div className="d-flex justify-content-end my-2">
        {!["Master User", "Project User", "Service User"].includes(
          userInfo?.role
        ) && (
          <Link to="create" className="btn btn-sm btn-primary">
            Create
          </Link>
        )}
      </div>
      {/* Search Input */}
      <CRow className="justify-content-end">
        <CCol xs={12} sm={10} md={8} lg={5}>
          <CInputGroup className="mb-3">
            <CFormInput
              type="text"
              placeholder="Search Site..."
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
            <CTableHeaderCell scope="col">Sr</CTableHeaderCell>
            <CTableHeaderCell scope="col" style={{ minWidth: "200px" }}>
              Client ID
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" style={{ minWidth: "200px" }}>
              Client Name
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" style={{ minWidth: "200px" }}>
              Plan
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" style={{ minWidth: "200px" }}>
              Status
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" style={{ minWidth: "200px" }}>
              Start Date
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" style={{ minWidth: "200px" }}>
              End Date
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" style={{ minWidth: "200px" }}>
              Action
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {loading ? (
            <CTableRow>
              <CTableDataCell colSpan="7" className="text-center fw-bold">
                <LoadingSpinner />
              </CTableDataCell>
            </CTableRow>
          ) : error ? (
            <CTableRow>
              <CTableDataCell
                colSpan="7"
                className="text-center text-danger fw-bold"
              >
                {error}
              </CTableDataCell>
            </CTableRow>
          ) : filteredData.length === 0 ? (
            <CTableDataCell colSpan="7" className="text-center">
              No Subscriptions found.
            </CTableDataCell>
          ) : (
            filteredData.map((sub, index) => (
              <CTableRow key={index}>
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell style={{ minWidth: "250px" }}>
                  <Link to={`view/${sub._id}`}> {sub._id}</Link>
                </CTableDataCell>
                <CTableDataCell style={{ minWidth: "280px" }}>
                  {sub.client_name || "N/A"}
                </CTableDataCell>
                <CTableDataCell style={{ minWidth: "200px" }}>
                  {sub.plan_id}
                </CTableDataCell>
                <CTableDataCell style={{ minWidth: "200px" }}>
                  {sub.subscription_status === "subscribed" ? (
                    <CBadge color="success">Subscribed</CBadge>
                  ) : sub.subscription_status === "expired" ? (
                    <CBadge color="danger">Expired</CBadge>
                  ) : sub.subscription_status === "cancelled" ? (
                    <CBadge color="warning">Cancelled</CBadge>
                  ) : (
                    <CBadge color="secondary">{sub.subscription_status}</CBadge>
                  )}
                </CTableDataCell>
                <CTableDataCell style={{ minWidth: "200px" }}>
                  {moment(sub.subscription_start_date).format("DD-MM-YYYY")}
                </CTableDataCell>
                <CTableDataCell style={{ minWidth: "200px" }}>
                  {moment(sub.subscription_end_date).format("DD-MM-YYYY")}
                </CTableDataCell>
                <CTableDataCell style={{ minWidth: "200px" }}>
                  <Link
                    className="btn btn-sm btn-secondary m-1"
                    color="secondary"
                    size="sm"
                    to={`view/${sub._id}`}
                  >
                    View
                  </Link>
                  {!["Master User", "Project User", "Service User"].includes(
                    userInfo?.role
                  ) && (
                    <Link
                      className="btn btn-sm btn-warning m-1"
                      to={`renew/${sub.client_id}`}
                    >
                      Renew
                    </Link>
                  )}
                </CTableDataCell>
              </CTableRow>
            ))
          )}
        </CTableBody>
      </CTable>
    </div>
  );
};

export default SubscriptionDashboard;
