import React, { useEffect, useReducer, useState } from "react";
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from "@coreui/react";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";
import PaginateInput from "../../../components/PaginateInput";
import * as XLSX from "xlsx"; // Import xlsx for Excel export
import { Link } from "react-router-dom";

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
    if (feedbacks.length === 0) {
      toast.error("No data available for export.");
      return;
    }

    // Convert JSON to sheet
    const worksheet = XLSX.utils.json_to_sheet(
      feedbacks.map((item, index) => ({
        "#": index + 1,
        "Client Name": item.user.name,
        "Client Email": item.user.email,
        Designation: item.user.designation,
        Comments: item.feedback_data.comments,
        Rating: item.feedback_data.rating,
        Date: new Date(item.createdAt).toISOString().split("T")[0],
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Client Feedback");

    // Trigger download
    XLSX.writeFile(workbook, "Client Feedback.xlsx");
  };

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

  return (
    <div className="p-2">
      <h2 className="text-center mt-4 mb-4">Client Feedback</h2>
      <div className="d-flex justify-content-end mb-3">
        <Link className="btn btn-sm btn-primary m-1" onClick={exportToExcel}>
          Export
        </Link>
      </div>

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
              Designation
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "100px" }}>
              Comments
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "140px" }}>
              Rating (out of 5)
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "140px" }}>
              Date
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {loadingFeedbacks ? (
            <CTableRow>
              <CTableDataCell colSpan="9" className="text-center fw-bold">
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
          ) : feedbacks.length > 0 ? (
            feedbacks.map((feedback, index) => (
              <CTableRow
                key={index}
                className={feedback.is_delete ? "table-danger" : ""}
              >
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell>{feedback.user.name}</CTableDataCell>
                <CTableDataCell>{feedback.user.email}</CTableDataCell>
                <CTableDataCell>{feedback.user.designation}</CTableDataCell>
                <CTableDataCell>
                  {feedback.feedback_data.comments}
                </CTableDataCell>
                <CTableDataCell>{feedback.feedback_data.rating}</CTableDataCell>
                <CTableDataCell>
                  {new Date(feedback.createdAt).toISOString().split("T")[0]}
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan="7" className="text-center fw-bold">
                No matching feedbacks found.
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
        handleLimitChange={setLimit} // New prop
      />
    </div>
  );
};

export default ClientFeedback;
