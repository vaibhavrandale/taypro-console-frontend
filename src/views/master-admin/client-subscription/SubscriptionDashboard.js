import React, { useEffect, useReducer, useState } from "react";
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import { useDispatch, useSelector } from "react-redux";
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

  const {
    loading,
    error,
    subscriptions,
    totalPages,
    hasNextPage,
    hasPrevPage,
  } = state;
  const authtoken = useSelector((state) => state.authtoken);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

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
        <Link to="create" className="btn btn-sm btn-primary">
          Create
        </Link>
      </div>

      <CTable bordered hover responsive className="text-center bg-important">
        <CTableHead>
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
          {subscriptions.map((sub, index) => (
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
                {sub.subscription_status}
              </CTableDataCell>
              <CTableDataCell style={{ minWidth: "200px" }}>
                {moment(sub.subscription_start_date).format("DD-MM-YYYY")}
              </CTableDataCell>
              <CTableDataCell style={{ minWidth: "200px" }}>
                {moment(sub.subscription_end_date).format("DD-MM-YYYY")}
              </CTableDataCell>
              <CTableDataCell style={{ minWidth: "200px" }}>
                {/* <Link to={`view/${sub._id}`}>View</Link> */}
                <Link
                  className="btn btn-sm btn-secondary m-1"
                  color="secondary"
                  size="sm"
                  to={`view/${sub._id}`}
                >
                  View
                </Link>

                <Link
                  className="btn btn-sm btn-warning m-1"
                  to={`renew/${sub.client_id}`}
                >
                  Renew
                </Link>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </div>
  );
};

export default SubscriptionDashboard;
