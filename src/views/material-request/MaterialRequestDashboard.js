// import React from "react";

// const MaterialRequestDashboard = () => {
//   return <div>MaterialRequestDashboard</div>;
// };

// export default MaterialRequestDashboard;

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
  CButton,
  CBadge,
  CTooltip,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CFormLabel,
  CModalFooter,
  CCard,
  CCardBody,
} from "@coreui/react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";
import PaginateInput from "../../components/PaginateInput";
import moment from "moment";
import CIcon from "@coreui/icons-react";
import { cilX } from "@coreui/icons";
import Paginations from "../base/paginations/Paginations";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };

    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        materials: action.payload.data,
        totalPages: action.payload.totalPages,
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
      };

    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "APPROVE_REQUEST":
      return { ...state, approveLoading: true };

    case "APPROVE_SUCCESS":
      return { ...state, approveLoading: false };

    case "APPROVE_FAIL":
      return { ...state, approveLoading: false };

    case "DELETE_REQUEST":
      return { ...state, deleteLoading: true };

    case "DELETE_SUCCESS":
      return { ...state, deleteLoading: false };

    case "DELETE_FAIL":
      return { ...state, deleteLoading: false };

    default:
      return state;
  }
};

const MaterialRequestDashboard = () => {
  const [
    {
      loading,
      error,
      materials,
      totalPages,
      hasNextPage,
      hasPrevPage,
      approveLoading,
      deleteLoading,
    },
    dispatch,
  ] = useReducer(reducer, {
    materials: [],
    loading: true,
    error: "",
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
    approveLoading: false,
    deleteLoading: false,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pageInput, setPageInput] = useState("");

  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [material, setMaterial] = useState(null);
  const [remark, setRemark] = useState("");
  const [deleteReason, setDeleteReason] = useState("");

  // const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);

  // const navigate = useNavigate();
  const [summary, setSummary] = useState({
    Draft: 0,
    Pending: 0,
    Transferred: 0,
    Stopped: 0,
    Issued: 0,
    "Partially Received": 0,
    Cancelled: 0,
    total: 0,
  });
  // ================= FETCH =================
  const fetchMaterials = async () => {
    dispatch({ type: "FETCH_REQUEST" });

    try {
      const result = await axios.post(
        `/api/v1/material-requests/get-material-requests`,
        Paginations,
        {
          // headers: {
          //   Authorization: `Bearer ${authtoken}`,
          // },
          withCredentials: true,
        },
      );

      const resData = result?.data?.data;

      const total = Math.ceil(
        Number(result?.data?.data?.total) / Number(result?.data?.data?.limit),
      );
      // const hasNextPage = result?.data?.data?.hasNextPage;
      // const hasPrevPage = result?.data?.data?.hasPrevPage;
      // const expenses = result?.data?.data?.data;

      dispatch({
        type: "FETCH_SUCCESS",
        payload: {
          data: resData?.data || [], // ✅ FIXED
          totalPages: total,
          hasNextPage: resData?.hasNextPage,
          hasPrevPage: resData?.hasPrevPage,
        },
      });
    } catch (error) {
      dispatch({
        type: "FETCH_FAIL",
        payload: error.response?.data?.message || error.response?.data?.error,
      });

      toast.error(error.response?.data?.message || error.response?.data?.error);
    }
  };

  useEffect(() => {
    fetchMaterials();
    fetchSummary();
  }, [page, limit]);

  // ================= SEARCH =================
  const filteredData = materials?.filter(
    (item) =>
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.site_id?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // ================= STATUS BADGE =================
  const getStatusBadge = (status) => {
    switch (status) {
      case "Draft":
        return "secondary";
      case "Pending":
        return "warning";
      case "Transferred":
      case "Completed":
        return "success";
      default:
        return "primary";
    }
  };

  // ================= APPROVE =================
  const handleApprove = async (id) => {
    dispatch({ type: "APPROVE_REQUEST" });

    try {
      const res = await axios.put(
        `/api/v1/material-requests/approve/${id}`,
        { remark },
        {
          //  headers: { Authorization: `Bearer ${authtoken}` }
          withCredentials: true,
        },
      );

      dispatch({ type: "APPROVE_SUCCESS" });
      toast.success(res?.data?.message);
      setShowApproveModal(false);
      fetchMaterials();
    } catch (error) {
      dispatch({
        type: "APPROVE_FAIL",
        payload: error.response?.data?.message || error.response?.data?.error,
      });

      toast.error(error.response?.data?.message || error.response?.data?.error);
    }
  };

  // ================= DELETE =================
  const deleteMaterial = async (id) => {
    dispatch({ type: "DELETE_REQUEST" });

    try {
      const res = await axios.put(
        `/api/v1/material-requests/delete-material/${id}`,
        { reason: deleteReason },
        {
          //  headers: { Authorization: `Bearer ${authtoken}` }
          withCredentials: true,
        },
      );

      dispatch({ type: "DELETE_SUCCESS", payload: id });
      toast.success(res?.data?.message);
      fetchMaterials();
    } catch (error) {
      dispatch({
        type: "DELETE_FAIL",
        payload: error.response?.data?.message || error.response?.data?.error,
      });
      toast.error(error.response?.data?.message || error.response?.data?.error);
    }
  };

  const fetchSummary = async () => {
    try {
      const { data } = await axios.get(
        "/api/v1/material-requests/get-erp-material-requests-status/summary",
        {
          // headers: { Authorization: `Bearer ${authtoken}` },
          withCredentials: true,
        },
      );

      setSummary(data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || error.response?.data?.error);
    }
  };

  // ================= PAGINATION =================
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  const handlePageInputSubmit = () => {
    const pageNumber = parseInt(pageInput);
    if (!isNaN(pageNumber)) handlePageChange(pageNumber);
  };

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
  } else if (userInfo?.role === "Site Technician") {
    adminroute = "site-technician";
  }
  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Material Requests</h4>

        <Link
          to={`/${adminroute}/material-requests/create-material-request`}
          className="btn btn-primary btn-sm d-flex align-items-center"
        >
          New Request
        </Link>
      </div>
      {/* Material Request Summary Badges */}
      <div className="mb-3">
        <CCard className="shadow-sm border-0">
          <CCardBody className="py-3">
            <CRow>
              <CCol xs="12">
                <div className="d-flex flex-wrap justify-content-between align-items-center">
                  <CBadge color="dark" className="px-3 py-2 rounded-pill m-1 ">
                    Total: {summary.total}
                  </CBadge>

                  <CBadge
                    color="secondary"
                    className="px-3 py-2 rounded-pill m-1 "
                  >
                    Draft: {summary.Draft}
                  </CBadge>

                  <CBadge
                    color="warning"
                    className="px-3 py-2 rounded-pill m-1 "
                  >
                    Pending: {summary.Pending}
                  </CBadge>

                  <CBadge color="info" className="px-3 py-2 rounded-pill m-1 ">
                    Approved: {summary.Stopped}
                  </CBadge>

                  <CBadge color="dark" className="px-3 py-2 rounded-pill m-1 ">
                    Issued: {summary.Issued}
                  </CBadge>

                  <CBadge
                    color="success"
                    className="px-3 py-2 rounded-pill m-1 "
                  >
                    Transferred: {summary.Transferred}
                  </CBadge>

                  <CBadge
                    color="primary"
                    className="px-3 py-2 rounded-pill m-1 "
                  >
                    Partially Received: {summary["Partially Received"]}
                  </CBadge>

                  <CBadge
                    color="danger"
                    className="px-3 py-2 rounded-pill m-1 "
                  >
                    Cancelled: {summary.Cancelled}
                  </CBadge>
                </div>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </div>
      {/* Search */}
      <CRow className="justify-content-end">
        <CCol md={4}>
          <CInputGroup className="mb-3">
            <CFormInput
              placeholder="Search by Request ID or Site"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </CInputGroup>
        </CCol>
      </CRow>

      {/* Table */}
      <CTable bordered hover responsive className="text-center">
        <CTableHead color="secondary">
          <CTableRow>
            <CTableHeaderCell>Sr</CTableHeaderCell>
            <CTableHeaderCell>Request ID</CTableHeaderCell>
            <CTableHeaderCell>Site</CTableHeaderCell>
            <CTableHeaderCell>Items</CTableHeaderCell>
            <CTableHeaderCell>Warehouse</CTableHeaderCell>

            <CTableHeaderCell>Erp Status</CTableHeaderCell>
            <CTableHeaderCell>Console Status</CTableHeaderCell>
            <CTableHeaderCell>Created At</CTableHeaderCell>
            <CTableHeaderCell>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>

        <CTableBody>
          {loading ? (
            <CTableRow>
              <CTableDataCell colSpan="9">
                <LoadingSpinner />
              </CTableDataCell>
            </CTableRow>
          ) : filteredData.length > 0 || error ? (
            filteredData.map((item, index) => (
              <CTableRow key={item._id}>
                <CTableDataCell>{index + 1}</CTableDataCell>
                {error}
                <CTableDataCell>
                  <Link
                    to={`/${adminroute}/material-requests/view/${item._id}`}
                  >
                    {item.name || "Draft"}
                  </Link>
                </CTableDataCell>

                <CTableDataCell>{item.site_id}</CTableDataCell>

                <CTableDataCell>{item.items?.length}</CTableDataCell>
                <CTableDataCell>{item.set_warehouse}</CTableDataCell>

                <CTableDataCell>
                  <CBadge color={getStatusBadge(item.status)}>
                    {item.status}
                  </CBadge>
                </CTableDataCell>

                <CTableDataCell>
                  <CBadge color={getStatusBadge(item.console_status)}>
                    {item.console_status || "-"}
                  </CBadge>
                </CTableDataCell>

                <CTableDataCell>
                  <CTooltip
                    content={moment(item.createdAt).format(
                      "DD MMM YYYY, hh:mm A",
                    )}
                  >
                    <span>{moment(item.createdAt).fromNow()}</span>
                  </CTooltip>
                </CTableDataCell>

                <CTableDataCell>
                  <Link
                    className="btn btn-sm btn-secondary m-1"
                    to={`/${adminroute}/material-requests/view/${item._id}`}
                  >
                    View
                  </Link>
                  {/* Update */}
                  {!["Master User", "Service User", "Project User"].includes(
                    userInfo?.role,
                  ) &&
                    (userInfo.role !== "Site Technician" ||
                      item.can_technician_edit) && (
                      <Link
                        className="btn btn-sm btn-warning m-1"
                        to={`/${adminroute}/material-requests/update/${item._id}`}
                      >
                        Update
                      </Link>
                    )}
                  {["Master Admin", "Service Admin", "Project Admin"].includes(
                    userInfo.role,
                  ) &&
                    item.status === "Draft" && (
                      <CButton
                        className="btn btn-primary btn-sm m-1"
                        onClick={() => {
                          setMaterial(item);
                          setShowApproveModal(true);
                        }}
                      >
                        Approve
                      </CButton>
                    )}

                  {["Master Admin", "Service Admin", "Project Admin"].includes(
                    userInfo.role,
                  ) && (
                    <CButton
                      color="danger"
                      size="sm"
                      className="m-1"
                      onClick={() => {
                        setMaterial(item);
                        setShowDeleteModal(true);
                      }}
                    >
                      Delete
                    </CButton>
                  )}
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan="9">
                No Material Requests Found
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>

      {/* Pagination */}
      <PaginateInput
        page={page}
        totalPages={totalPages}
        hasPrevPage={hasPrevPage}
        hasNextPage={hasNextPage}
        pageInput={pageInput}
        handlePageChange={handlePageChange}
        handlePageInputChange={(e) => setPageInput(e.target.value)}
        handlePageInputSubmit={handlePageInputSubmit}
        limit={limit}
        handleLimitChange={setLimit}
      />

      {/* APPROVE MODAL */}
      <CModal
        visible={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        backdrop="static"
      >
        <CModalHeader closeButton={false}>
          <CModalTitle>Approve Request</CModalTitle>
          <button
            type="button"
            className="border-0 ms-auto py-0 px-1"
            onClick={() => {
              setShowApproveModal(false);
            }}
            style={{ background: "none" }}
          >
            <CIcon icon={cilX} size="lg" />
          </button>
        </CModalHeader>
        <CModalBody>
          <CFormLabel>Remark</CFormLabel>
          <CFormInput
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
          />
        </CModalBody>
        <CModalFooter>
          <CButton
            color="danger"
            onClick={() => {
              handleApprove(material._id);
            }}
          >
            {approveLoading ? <LoadingSpinner size="sm" /> : "Approve"}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* DELETE MODAL */}
      <CModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        backdrop="static"
      >
        <CModalHeader closeButton={false}>
          <CModalTitle>Delete Request</CModalTitle>
          <button
            type="button"
            className="border-0 ms-auto py-0 px-1"
            onClick={() => {
              setShowDeleteModal(false);
            }}
            style={{ background: "none" }}
          >
            <CIcon icon={cilX} size="lg" />
          </button>
        </CModalHeader>

        <CModalBody>
          <CFormInput
            placeholder="Enter reason..."
            value={deleteReason}
            onChange={(e) => setDeleteReason(e.target.value)}
          />
        </CModalBody>

        <CModalFooter>
          <CButton
            color="danger"
            onClick={() => {
              deleteMaterial(material._id);
              setShowDeleteModal(false);
            }}
          >
            {deleteLoading ? <LoadingSpinner size="sm" /> : "Delete"}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default MaterialRequestDashboard;
