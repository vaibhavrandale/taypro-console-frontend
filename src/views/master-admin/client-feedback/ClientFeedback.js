import React, { useEffect, useReducer, useState } from "react";
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CRow,
  CCol,
  CInputGroup,
  CFormInput,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CCard,
} from "@coreui/react";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";
import PaginateInput from "../../../components/PaginateInput";
import * as XLSX from "xlsx"; // Import xlsx for Excel export
import { Link } from "react-router-dom";
import moment from "moment";
import { BsStar, BsStarFill } from "react-icons/bs";
import CIcon from "@coreui/icons-react";
import { cilX } from "@coreui/icons";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_FEEDBACK_REQUEST":
      return { ...state, loadingFeedbacks: true, error: "" };
    case "FETCH_FEEDBACK_SUCCESS":
      return {
        ...state,
        loadingFeedbacks: false,
        feedbacks: action.payload.data,
        totalPages: action.payload.totalPages, // Use API-provided totalPages
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
      };
    case "FETCH_FEEDBACK_FAIL":
      return { ...state, loadingFeedbacks: false, error: action.payload };
    default:
      return state;
  }
};

const ClientFeedback = () => {
  const [
    {
      error,
      feedbacks,
      loadingFeedbacks,
      totalPages,
      hasNextPage,
      hasPrevPage,
    },
    dispatch,
  ] = useReducer(reducer, {
    feedbacks: [],
    loading: true,
    loadingFeedbacks: true,
    error: "",
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const authtoken = useSelector((state) => state.authtoken);
  //   const [searchTerm, setSearchTerm] = useState("");
  const [pageInput, setPageInput] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [feedbackModal, setFeedbackModal] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState(null);

  useEffect(() => {
    let pagination = {
      pg: page,
      limit: limit,
    };
    const fetchfeedbacks = async () => {
      dispatch({ type: "FETCH_FEEDBACK_REQUEST" });
      try {
        const result = await axios.post(
          `/api/v1/customer-feedback/get-all`,
          pagination,
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );

        console.log("Feedbacks fetched:", result.data.data.data);
        let total = Math.ceil(
          Number(result.data.data.total) / Number(result.data.data.limit)
        );
        let next = result.data.data.hasNextPage;
        let prev = result.data.data.hasPrevPage;

        dispatch({
          type: "FETCH_FEEDBACK_SUCCESS",
          payload: {
            data: result.data.data.data,
            totalPages: total,
            hasNextPage: next,
            hasPrevPage: prev,
          },
        });
      } catch (error) {
        dispatch({
          type: "FETCH_FEEDBACK_FAIL",
          payload: "Failed to fetch feedbacks",
        });
        toast.error("Failed to fetch feedbacks");
      }
    };

    fetchfeedbacks();
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

  const exportToExcel = () => {
    if (!feedbacks || feedbacks.length === 0) {
      toast.error("No data available for export.");
      return;
    }

    const excelData = feedbacks.map((item, index) => ({
      "#": index + 1,

      // Client Info
      "Client Name": item.user?.username || "N/A",
      "Client Email": item.user?.email || "N/A",
      Designation: item.user?.designation || "No designation",

      // Assigned Sites
      "Site IDs":
        item.user?.assigned_sites?.length > 0
          ? item.user.assigned_sites.map((site) => site.site_id).join(", ")
          : "No Sites",

      // Portal Feedback
      "Portal Rating": item.feedback_data?.rating ?? 0,
      "Portal Comments": item.feedback_data?.comments?.trim() || "-",

      // Technician Feedback
      "Technician Assigned": item.technician_feedback_data
        ?.is_technician_assigned
        ? "Yes"
        : "No",
      "Technician Rating": item.technician_feedback_data?.rating ?? "-",
      "Technician Comments":
        item.technician_feedback_data?.comments?.trim() || "-",

      // Service Feedback
      "Service Rating": item.service_feedback_data?.rating ?? "-",
      "Service Comments": item.service_feedback_data?.comments?.trim() || "-",

      // Status
      Status: item.status ? "Completed" : "Pending",

      // Date
      Date: moment(item.createdAt).format("DD/MM/YYYY hh:mm A"),
      "Updated At": moment(item.updatedAt).format("DD/MM/YYYY hh:mm A"),
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Client Feedback");

    XLSX.writeFile(workbook, "Client_Feedback.xlsx");
  };

  // const userInfo = useSelector((state) => state.userInfo);
  // let adminroute = "";

  // if (userInfo.role === "Master Admin") {
  //   adminroute = "master-admin";
  // } else if (userInfo.role === "Service Admin") {
  //   adminroute = "service-admin";
  // } else if (userInfo.role === "Project Admin") {
  //   adminroute = "project-admin";
  // } else if (userInfo?.role === "Master User") {
  //   adminroute = "master-user";
  // } else if (userInfo?.role === "Service User") {
  //   adminroute = "service-user";
  // } else if (userInfo?.role === "Project User") {
  //   adminroute = "project-user";
  // }

  const Feedbacks = feedbacks.filter(
    (feedback) =>
      feedback.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.user.site_id.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const StarRating = ({ rating, onChange, section }) => {
    const currentRating = Number(rating) || 0;

    return (
      <div
        className="d-flex gap-2"
        style={{ cursor: "pointer", fontSize: "1.8rem" }}
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const FilledStar = star <= currentRating;
          return FilledStar ? (
            <BsStarFill
              size={20}
              key={star}
              color="#ffc107"
              onClick={() =>
                onChange({
                  //  target: { name: "rating", value: star }
                  target: { name: "rating", value: star, section },
                })
              }
              onKeyDown={(e) => {
                if (e.key === "Enter")
                  onChange({
                    target: { name: "rating", value: star, section },
                  });
              }}
              role="radio"
              tabIndex={0}
              aria-checked={star === currentRating}
              aria-label={`${star} Star${star > 1 ? "s" : ""}`}
            />
          ) : (
            <BsStar
              size={20}
              key={star}
              color="#e4e5e9"
              onClick={() =>
                onChange({ target: { name: "rating", value: star, section } })
              }
              onKeyDown={(e) => {
                if (e.key === "Enter")
                  onChange({
                    target: { name: "rating", value: star, section },
                  });
              }}
              role="radio"
              tabIndex={0}
              aria-checked={star === currentRating}
              aria-label={`${star} Star${star > 1 ? "s" : ""}`}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="">
      <h2 className="text-center  mb-4">Client Feedbacks</h2>
      <div className="d-flex justify-content-end mb-3">
        <Link className="btn btn-sm btn-primary m-1" onClick={exportToExcel}>
          Export
        </Link>
      </div>
      <CRow className="justify-content-end">
        <CCol xs={12} sm={10} md={8} lg={5}>
          <CInputGroup className="mb-3">
            <CFormInput
              type="text"
              placeholder="Search by username,site_id ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </CInputGroup>
        </CCol>
      </CRow>
      {/* feedbacks Table */}
      <CTable
        bordered
        hover
        responsive
        className="text-center shadow-sm bg-important"
      >
        <CTableHead color="secondary">
          <CTableRow>
            <CTableHeaderCell>#</CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "200px" }}>
              Client Name
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "100px" }}>
              Client Email
            </CTableHeaderCell>

            <CTableHeaderCell style={{ minWidth: "100px" }}>
              Site ID
            </CTableHeaderCell>

            <CTableHeaderCell style={{ minWidth: "140px" }}>
              Date
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "140px" }}>
              Updated At
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "100px" }}>
              Actions
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {loadingFeedbacks ? (
            <CTableRow>
              <CTableDataCell colSpan="9" className="text-start fw-bold">
                <LoadingSpinner />
              </CTableDataCell>
            </CTableRow>
          ) : error ? (
            <CTableRow>
              {" "}
              <CTableDataCell colSpan="9" className="text-center fw-bold">
                {error}
              </CTableDataCell>
            </CTableRow>
          ) : Feedbacks.length > 0 ? (
            Feedbacks.map((feedback, index) => (
              <CTableRow
                key={index}
                className={feedback.is_delete ? "table-danger" : ""}
              >
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell>{feedback.user.username}</CTableDataCell>
                <CTableDataCell>{feedback.user.email}</CTableDataCell>

                <CTableDataCell>
                  {feedback.user?.assigned_sites?.length > 0
                    ? feedback.user.assigned_sites
                        .map((site) => site.site_id)
                        .join(", ")
                    : ""}
                </CTableDataCell>
                {/* <CTableDataCell>
                  {feedback.user?.assigned_sites?.[0]?.site_id}
                </CTableDataCell> */}

                <CTableDataCell>
                  {moment(feedback.createdAt).format("MMM YYYY ")}
                </CTableDataCell>
                <CTableDataCell>
                  {moment(feedback.updatedAt).format("DD/MM/YYYY, HH:mm:ss")}
                </CTableDataCell>

                <CTableDataCell>
                  <button
                    className="btn btn-sm btn-info"
                    onClick={() => {
                      setCurrentFeedback(feedback);

                      setFeedbackModal(true);
                    }}
                  >
                    View
                  </button>
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan="8" className="text-center fw-bold">
                No matching feedbacks found.
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>
      {/* Feedback Modal */}
      {feedbackModal && currentFeedback && (
        <CModal
          backdrop="static"
          scrollable
          alignment="top"
          visible={feedbackModal}
          size="xl"
          onClose={() => setFeedbackModal(false)}
        >
          <CModalHeader closeButton={false}>
            <CModalTitle>Client Feedback Details</CModalTitle>
            <button
              type="button"
              className="border-0 ms-auto py-0 px-1"
              onClick={() => setFeedbackModal(false)}
              style={{ background: "none" }}
            >
              <CIcon icon={cilX} size="lg" />
            </button>
          </CModalHeader>

          <CModalBody>
            <CRow className="g-4">
              {/* PORTAL FEEDBACK */}
              <CCol md={4}>
                <CCard className="shadow-sm rounded-3 p-3 border-0 bg-light h-100">
                  <h6 className="mb-3 text-warning fw-bold">Portal Feedback</h6>
                  <p className="mb-2">
                    <strong>Rating:</strong>{" "}
                    <StarRating
                      rating={currentFeedback.feedback_data?.rating || 0}
                      readOnly
                    />
                  </p>
                  <p className="mb-0">
                    <strong>Comments:</strong>
                    <br />
                    {currentFeedback.feedback_data?.comments || "No comments"}
                  </p>
                </CCard>
              </CCol>

              {/* TECHNICIAN FEEDBACK */}
              <CCol md={4}>
                <CCard className="shadow-sm rounded-3 p-3 border-0 bg-light h-100">
                  <h6 className="mb-3 text-success fw-bold">
                    Technician Feedback
                  </h6>

                  {currentFeedback.technician_feedback_data
                    ?.is_technician_assigned ? (
                    <>
                      <p className="mb-2">
                        <strong>Rating:</strong>{" "}
                        <StarRating
                          rating={
                            currentFeedback.technician_feedback_data?.rating ||
                            0
                          }
                          readOnly
                        />
                      </p>
                      <p className="mb-0">
                        <strong>Comments:</strong>
                        <br />
                        {currentFeedback.technician_feedback_data?.comments ||
                          "No comments"}
                      </p>
                    </>
                  ) : (
                    <p className="text-muted">Technician not assigned yet.</p>
                  )}
                </CCard>
              </CCol>

              {/* SERVICE FEEDBACK */}
              <CCol md={4}>
                <CCard className="shadow-sm rounded-3 p-3 border-0 bg-light h-100">
                  <h6 className="mb-3 text-info fw-bold">Service Feedback</h6>
                  <p className="mb-2">
                    <strong>Rating:</strong>{" "}
                    <StarRating
                      rating={
                        currentFeedback.service_feedback_data?.rating || 0
                      }
                      readOnly
                    />
                  </p>
                  <p className="mb-0">
                    <strong>Comments:</strong>
                    <br />
                    {currentFeedback.service_feedback_data?.comments ||
                      "No comments"}
                  </p>
                </CCard>
              </CCol>
            </CRow>
          </CModalBody>
        </CModal>
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

export default ClientFeedback;
