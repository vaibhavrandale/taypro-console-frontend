import {
  CButton,
  CCol,
  CFormInput,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import LoadingSpinner from "../../../components/LoadingSpinner";
import PaginateInput from "../../../components/PaginateInput";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_PROJECTDOC_REQUEST":
      return { ...state, loadingProjectDocs: true, error: "" };
    case "FETCH_PROJECTDOC_SUCCESS":
      return {
        ...state,
        loadingProjectDocs: false,
        projectDocs: action.payload.data,
        totalPages: action.payload.totalPages, // Use API-provided totalPages
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
      };
    case "FETCH_PROJECTDOC_FAIL":
      return { ...state, loadingProjectDocs: false, error: action.payload };
    case "SUBMIT_REQUEST":
      return { ...state, loading: true, success: false };
    case "SUBMIT_SUCCESS":
      return { ...state, loading: false, success: true };
    case "SUBMIT_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false,
      };
    default:
      return state;
  }
};

const ProjectClosureDashboard = () => {
  const [
    {
      error,
      projectDocs,
      loadingProjectDocs,
      totalPages,
      hasNextPage,
      hasPrevPage,
      loading,
    },
    dispatch,
  ] = useReducer(reducer, {
    projectDocs: [],
    loading: false,
    loadingProjectDocs: true,
    error: "",
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const navigate = useNavigate();
  const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);
  let adminroute = "";

  if (userInfo.role === "Master Admin") {
    adminroute = "master-admin";
  } else if (userInfo.role === "Service Admin") {
    adminroute = "service-admin";
  } else if (userInfo.role === "Project Admin") {
    adminroute = "project-admin";
  }

  const [searchTerm, setSearchTerm] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProjectDoc, setSelectedProjectDoc] = useState(null);
  const [pageInput, setPageInput] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [formData, setFormData] = useState({});

  useEffect(() => {
    let pagination = {
      pg: page,
      limit: limit,
    };
    const fetchProjectDocs = async () => {
      dispatch({ type: "FETCH_PROJECTDOC_REQUEST" });
      try {
        const result = await axios.post(
          `/api/v1/projectdocs/get-all-project-docs`,
          pagination,
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );

        let total = Math.ceil(
          Number(result.data.total) / Number(result.data.limit)
        );
        let next = result.data.hasNextPage;
        let prev = result.data.hasPrevPage;

        dispatch({
          type: "FETCH_PROJECTDOC_SUCCESS",
          payload: {
            data: result.data.data,
            totalPages: total,
            hasNextPage: next,
            hasPrevPage: prev,
          },
        });

        setFormData(result.data.data);
      } catch (error) {
        dispatch({
          type: "FETCH_PROJECTDOC_FAIL",
          payload:
            error.response?.data?.error ||
            "Failed to fetch Project Handover Docs",
        });
        toast.error(
          error.response?.data?.error || "Failed to fetch Project Handover Docs"
        );
      }
    };

    fetchProjectDocs();
  }, [authtoken, limit, page]);

  const updateApprovalSentStatus = async (data) => {
    dispatch({ type: "SUBMIT_REQUEST" });
    try {
      const result = await axios.put(
        `/api/v1/projectdocs/project-doc/send-for-approval/${data._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${authtoken}` },
        }
      );
      dispatch({
        type: "SUBMIT_SUCCESS",
      });
      toast.success(
        result.data.message || "Approval request sent successfully."
      );
      setFormData(result.data.data);
      setModalVisible(false);
      navigate(`/${adminroute}/project-handover/view/${data._id}`);
    } catch (error) {
      dispatch({
        type: "SUBMIT_FAIL",
        payload:
          error.response?.data?.error || "Failed to send an approval request",
      });
      toast.error(
        error.response?.data?.error || "Failed to send an approval request"
      );
    }
  };

  const filteredProjectDocs = projectDocs.filter(
    (doc) =>
      doc.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.project_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.prepared_by.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Open modal and load doc data
  const openModal = (doc) => {
    setSelectedProjectDoc(doc);
    setFormData(doc);
    setModalVisible(true);
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

  return (
    <div className="p-2">
      <h2 className="text-center mt-4">Project Handover Data</h2>
      <div className="d-flex justify-content-end mb-3">
        {(userInfo.role === "Master Admin" ||
          userInfo.role === "Project Admin") && (
          <Link
            className="btn btn-sm btn-secondary m-1"
            to={`/${adminroute}/project-handover/add-project-handover`}
          >
            New Project Handover
          </Link>
        )}
      </div>
      {/* Search Input */}
      <CRow className="justify-content-end mb-3">
        <CCol md={4}>
          <CFormInput
            type="text"
            placeholder="Search by Project Name, Project Location, or Creator's Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CCol>
      </CRow>

      {/* projectDocs Table */}
      <CTable bordered hover responsive className="text-center shadow-sm">
        <CTableHead color="secondary">
          <CTableRow>
            <CTableHeaderCell>#</CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "200px" }}>
              Project Name
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "100px" }}>
              Project Location
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "140px" }}>
              Prepared By
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "140px" }}>
              Start Date
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "100px" }}>
              End Date
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "100px" }}>
              Plant Capacity
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "100px" }}>
              Total Systems
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "100px" }}>
              Created By
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "100px" }}>
              Approved By
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "300px" }}>
              Action
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {loadingProjectDocs ? (
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
          ) : filteredProjectDocs.length > 0 ? (
            filteredProjectDocs.map((doc, index) => (
              <CTableRow
                key={index}
                // className={doc.is_delete ? "table-danger" : ""}
              >
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell>{doc.project_name}</CTableDataCell>
                <CTableDataCell>{doc.project_location}</CTableDataCell>
                <CTableDataCell>{doc.prepared_by}</CTableDataCell>
                <CTableDataCell>
                  {" "}
                  {new Date(doc.project_start_date)
                    .toLocaleDateString("en-GB")
                    .replace(/\//g, "-")}
                </CTableDataCell>
                <CTableDataCell>
                  {" "}
                  {new Date(doc.project_completion_date)
                    .toLocaleDateString("en-GB")
                    .replace(/\//g, "-")}
                </CTableDataCell>
                <CTableDataCell>{doc.plant_capacity}</CTableDataCell>
                <CTableDataCell>{doc.total_no_of_systems}</CTableDataCell>
                <CTableDataCell>{doc.created_by.name}</CTableDataCell>
                <CTableDataCell>
                  {doc.approved_by && doc.approved_by.name
                    ? doc.approved_by.name
                    : "-"}
                </CTableDataCell>
                <CTableDataCell>
                  {/* 🔴 Show "Send to Service Team" only if not sent OR user is Admin */}
                  {!doc.is_sent_for_approval &&
                    ["Master Admin", "Project Admin"].includes(
                      userInfo.role
                    ) && (
                      <Link
                        className="btn btn-sm btn-danger m-1 text-white"
                        onClick={() => openModal(doc)}
                      >
                        Send To Service Team
                      </Link>
                    )}

                  {/* 👁 View Button */}
                  <Link
                    className="btn btn-sm btn-secondary m-1"
                    to={`/${adminroute}/project-handover/view/${doc._id}`}
                  >
                    View
                  </Link>
                  {(userInfo.role === "Master Admin" ||
                    userInfo.role === "Project Admin") && (
                    <Link
                      className="btn btn-sm btn-warning m-1"
                      to={`/${adminroute}/project-handover/update/${doc._id}`}
                    >
                      Update
                    </Link>
                  )}
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan="7" className="text-center fw-bold">
                No matching Project Handover Documents found.
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
      {/* view Modal */}
      <CModal
        size="xl"
        scrollable
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        <CModalHeader>
          <CModalTitle>
            Project Handover Document Approval Request:&nbsp;
            <span className="badge bg-success">
              {formData.project_name}
            </span>{" "}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedProjectDoc && (
            <>
              <CButton
                color="secondary"
                onClick={() => updateApprovalSentStatus(formData)}
                disabled={loading}
              >
                {loading ? (
                  <>
                    Sending... <LoadingSpinner />
                  </>
                ) : (
                  "Send Approval Request"
                )}
              </CButton>
            </>
          )}
        </CModalBody>
      </CModal>
    </div>
  );
};

export default ProjectClosureDashboard;
