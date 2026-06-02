import React, { useEffect, useReducer, useState } from "react";
import {
  CRow,
  CCol,
  CInputGroup,
  CFormInput,
  CFormSelect,
  CButton,
} from "@coreui/react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import moment from "moment";
import { Link } from "react-router-dom";

import LoadingSpinner from "../../../components/LoadingSpinner";
import FeedbackCard from "./FeedbackCard";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_FEEDBACK_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_FEEDBACK_SUCCESS":
      return { ...state, loading: false, feedbacks: action.payload };
    case "FETCH_FEEDBACK_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const ClientFeedback = () => {
  const [{ feedbacks, loading, error }, dispatch] = useReducer(reducer, {
    feedbacks: [],
    loading: false,
    error: "",
  });

  // const authtoken = useSelector((state) => state.authtoken);

  /* ================= FILTERS ================= */
  const [siteId, setSiteId] = useState("");
  const [status, setStatus] = useState("all");
  const [month, setMonth] = useState(moment().month() + 1);
  const [year, setYear] = useState(moment().year());
  const [searchTerm, setSearchTerm] = useState("");

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    if (!month || !year) return;

    const fetchFeedbacks = async () => {
      dispatch({ type: "FETCH_FEEDBACK_REQUEST" });
      try {
        const res = await axios.post(
          "/api/v1/customer-feedback/get-all",
          { month, year },
          {
            // headers: { Authorization: `Bearer ${authtoken}` }
            withCredentials: true,
          },
        );

        dispatch({
          type: "FETCH_FEEDBACK_SUCCESS",
          payload: res.data.data,
        });
      } catch (err) {
        const message =
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Failed to fetch feedbacks";

        dispatch({
          type: "FETCH_FEEDBACK_FAIL",
          payload: message,
        });

        toast.error(message);
      }
    };

    fetchFeedbacks();
  }, [month, year]);

  /* ================= FRONTEND FILTERING ================= */
  // const filteredFeedbacks = feedbacks.filter((f) => {
  //   const matchesSearch =
  //     f.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     f.user.username?.toLowerCase().includes(searchTerm.toLowerCase());

  //   return matchesSearch;
  // });

  const term = searchTerm.toLowerCase().trim();

  const filteredFeedbacks = feedbacks.filter((f) => {
    const email = f.user?.email?.toLowerCase() || "";
    const username = f.user?.username?.toLowerCase() || "";

    const matchesSearch = email.includes(term) || username.includes(term);

    const matchesStatus = status === "all" || f.status === status;

    return matchesSearch && matchesStatus;
  });

  const exportToCSV = () => {
    if (!filteredFeedbacks || filteredFeedbacks.length === 0) {
      toast.error("No data to export");
      return;
    }

    const headers = [
      "Feedback No",
      "Site ID",
      "Site Name",

      "Customer Name",
      "Customer Email",
      "Customer Designation",
      "Status",
      "Portal Rating",
      "Portal Feedback",
      "Technician Rating",
      "Technician Feedback",

      "Service Rating",
      "Service Feedback",

      "Created At",
      "Updated At",
    ];

    const rows = filteredFeedbacks.map((feedback) => [
      feedback.customer_feedback_no || "",

      feedback.user?.assigned_sites?.[0]?.site_id || "",
      feedback.user?.assigned_sites?.[0]?.siteName || "",

      feedback.user?.username || "",
      feedback.user?.email || "",
      feedback.user?.designation || "",
      feedback.status ? "Submitted" : "Pending",
      feedback.feedback_data?.rating || "",
      feedback.feedback_data?.comments || "",

      feedback.technician_feedback_data?.rating || "",
      feedback.technician_feedback_data?.comments || "",

      feedback.service_feedback_data?.rating || "",
      feedback.service_feedback_data?.comments || "",

      feedback.createdAt
        ? new Date(feedback.createdAt).toLocaleString("en-GB")
        : "",

      feedback.updatedAt
        ? new Date(feedback.updatedAt).toLocaleString("en-GB")
        : "",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows]
        .map((row) =>
          row
            .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
            .join(","),
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);

    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `customer_feedbacks_${Date.now()}.csv`);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("CSV exported successfully");
  };

  return (
    <div>
      <h2 className="text-center mb-4">Client Feedbacks</h2>

      {/* Top Bar */}
      <div className="d-flex justify-content-end mb-3">
        <Link className="btn btn-sm btn-primary">Export</Link>
      </div>

      {/* ================= FILTER BAR ================= */}
      <CRow className="mb-3 g-2 justify-content-end">
        <CCol md={2}>
          <CFormSelect
            value={status ?? "all"}
            onChange={(e) => {
              const value = e.target.value;

              if (value === "all") setStatus("all");
              else setStatus(value === "true");
            }}
          >
            <option value="all">All Status</option>
            <option value="true">Submitted</option>
            <option value="false">Pending</option>
          </CFormSelect>
        </CCol>

        <CCol md={2}>
          <CFormSelect
            value={month}
            onChange={(e) =>
              setMonth(
                e.target.value === "all" ? "all" : Number(e.target.value),
              )
            }
          >
            <option value="all">All of {year}</option>

            {[...Array(12)].map((_, i) => (
              <option key={i} value={i + 1}>
                {moment().month(i).format("MMMM")}
              </option>
            ))}
          </CFormSelect>
        </CCol>

        <CCol md={2}>
          <CFormSelect
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          >
            {[year, year - 1, year - 2].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </CFormSelect>
        </CCol>
        <CCol xs={12} md={3}>
          <CInputGroup>
            <CFormInput
              placeholder="Search by username or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </CInputGroup>
        </CCol>
        <CCol xs={12} md={2}>
          <CButton color="primary" onClick={exportToCSV}>
            Export to CSV
          </CButton>
        </CCol>
      </CRow>

      {/* Search */}
      <CRow className="justify-content-end"></CRow>

      {/* ================= CONTENT ================= */}
      <CRow>
        {loading ? (
          <CCol xs={12} md={4}>
            {" "}
            <LoadingSpinner />
          </CCol>
        ) : error ? (
          <CCol xs={12} md={4}>
            {" "}
            <div className="text-center text-danger fw-bold">{error}</div>
          </CCol>
        ) : filteredFeedbacks.length === 0 ? (
          <CCol xs={12} md={4}>
            {" "}
            <div className="text-center fw-bold mt-4">No feedbacks found.</div>
          </CCol>
        ) : (
          filteredFeedbacks.map((feedback) => (
            <CCol xs={12} md={6} key={feedback._id} className="my-2">
              <FeedbackCard feedback={feedback} />
            </CCol>
          ))
        )}
      </CRow>
    </div>
  );
};

export default ClientFeedback;
