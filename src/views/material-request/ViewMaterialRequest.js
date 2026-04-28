import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  CTable,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CBadge,
  CTableHead,
  CAlert,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CFormLabel,
  CFormInput,
  CModalFooter,
} from "@coreui/react";
import LoadingSpinner from "../../components/LoadingSpinner";
import LastActivity from "../../components/LastActivity";
import CIcon from "@coreui/icons-react";
import { cilX } from "@coreui/icons";

// ================= REDUCER =================
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };

    case "FETCH_SUCCESS":
      return { ...state, loading: false, material: action.payload };

    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "APPROVE_REQUEST":
      return { ...state, approveLoading: true };

    case "APPROVE_SUCCESS":
      return { ...state, approveLoading: false };

    case "APPROVE_FAIL":
      return { ...state, approveLoading: false };

    default:
      return state;
  }
};

const ViewMaterialRequest = () => {
  const { id } = useParams();
  // const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);

  const [{ loading, material, error, approveLoading }, dispatch] = useReducer(
    reducer,
    {
      loading: false,
      material: {},
      error: "",
      approveLoading: false,
    },
  );

  const [showApproveModal, setShowApproveModal] = useState(false);
  const [remark, setRemark] = useState("");

  // ================= FETCH =================
  const fetchMaterial = async () => {
    dispatch({ type: "FETCH_REQUEST" });

    try {
      const res = await axios.get(`/api/v1/material-requests/${id}`, {
        // headers: { Authorization: `Bearer ${authtoken}` },
        withCredentials: true,
      });

      dispatch({
        type: "FETCH_SUCCESS",
        payload: res.data.data,
      });
    } catch (err) {
      dispatch({
        type: "FETCH_FAIL",
        payload: err.response?.data?.message || err.response?.data?.error,
      });

      toast.error(err.response?.data?.message || err.response?.data?.error);
    }
  };

  useEffect(() => {
    fetchMaterial();
  }, [id]);

  // ================= APPROVE =================
  const handleApprove = async () => {
    dispatch({ type: "APPROVE_REQUEST" });

    try {
      const res = await axios.put(
        `/api/v1/material-requests/approve/${id}`,
        { remark },
        { headers: { Authorization: `Bearer ${authtoken}` } },
      );

      dispatch({ type: "APPROVE_SUCCESS" });

      toast.success(res?.data?.message);
      fetchMaterial();
      setRemark("");
    } catch (err) {
      dispatch({ type: "APPROVE_FAIL" });

      toast.error(err.response?.data?.message || err.message);
    }
  };

  // ================= STATUS =================
  const getStatusBadge = (status) => {
    switch (status) {
      case "Draft":
        return "secondary";
      case "Pending":
        return "warning";
      case "Transferred":
      case "Completed":
        return "success";
      case "Cancelled":
        return "danger";
      default:
        return "primary";
    }
  };

  return (
    <div>
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <CAlert color="danger">{error}</CAlert>
      ) : (
        <>
          {/* APPROVE BUTTON */}
          <div className="d-flex justify-content-end mb-3">
            {["Master Admin", "Service Admin", "Project Admin"].includes(
              userInfo.role,
            ) &&
              material.status === "Draft" && (
                <CButton
                  size="sm"
                  color="primary"
                  onClick={() => setShowApproveModal(true)}
                >
                  Approve
                </CButton>
              )}
          </div>

          {/* DETAILS */}
          <CTable bordered striped responsive>
            <CTableBody>
              <CTableRow>
                <CTableHeaderCell>Request ID</CTableHeaderCell>
                <CTableDataCell>{material.name || "Draft"}</CTableDataCell>
              </CTableRow>

              <CTableRow>
                <CTableHeaderCell>Company</CTableHeaderCell>
                <CTableDataCell>{material.company}</CTableDataCell>
              </CTableRow>

              <CTableRow>
                <CTableHeaderCell>Site</CTableHeaderCell>
                <CTableDataCell>{material.site_id}</CTableDataCell>
              </CTableRow>

              <CTableRow>
                <CTableHeaderCell>Warehouse</CTableHeaderCell>
                <CTableDataCell>{material.set_warehouse}</CTableDataCell>
              </CTableRow>

              <CTableRow>
                <CTableHeaderCell>Request Type</CTableHeaderCell>
                <CTableDataCell>
                  {material.material_request_type}
                </CTableDataCell>
              </CTableRow>

              <CTableRow>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableDataCell>
                  <CBadge color={getStatusBadge(material.status)}>
                    {material.status}
                  </CBadge>
                </CTableDataCell>
              </CTableRow>

              {/* <CTableRow>
                <CTableHeaderCell>ERP Status</CTableHeaderCell>
                <CTableDataCell>
                  <CBadge color={getStatusBadge(material.erp_status)}>
                    {material.erp_status || "-"}
                  </CBadge>
                </CTableDataCell>
              </CTableRow> */}

              <CTableRow>
                <CTableHeaderCell>Created At</CTableHeaderCell>
                <CTableDataCell>
                  {material.createdAt &&
                    new Date(material.createdAt).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                    })}
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>

          {/* ITEMS */}
          <h5 className="mt-4">Items</h5>

          <CTable bordered responsive>
            <CTableHead color="secondary">
              <CTableRow>
                <CTableHeaderCell>Sr</CTableHeaderCell>
                <CTableHeaderCell>Item Code</CTableHeaderCell>
                <CTableHeaderCell>Requested Qty</CTableHeaderCell>
                <CTableHeaderCell>Ordered Qty</CTableHeaderCell>
                {/* <CTableHeaderCell>Pending Qty</CTableHeaderCell> */}
                <CTableHeaderCell>UOM</CTableHeaderCell>
              </CTableRow>
            </CTableHead>

            <CTableBody>
              {material.items?.map((item, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>{item.item_code}</CTableDataCell>
                  <CTableDataCell>
                    {item.requested_qty || item.qty}
                  </CTableDataCell>
                  <CTableDataCell>{item.ordered_qty || 0}</CTableDataCell>

                  <CTableDataCell>{item.uom}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>

          {/* ACTIVITY */}
          <div className="mt-4">
            <h5>Activity</h5>
            <LastActivity lastactivity={material.last_activity} />
          </div>
        </>
      )}

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
            className="border-0 ms-auto"
            style={{ background: "none" }}
            onClick={() => setShowApproveModal(false)}
          >
            <CIcon icon={cilX} size="lg" />
          </button>
        </CModalHeader>

        <CModalBody>
          <CFormLabel>Remark</CFormLabel>
          <CFormInput
            placeholder="Enter remark..."
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
          />
        </CModalBody>

        <CModalFooter>
          <CButton
            color="danger"
            size="sm"
            onClick={() => {
              handleApprove();
              setShowApproveModal(false);
            }}
          >
            {approveLoading ? <LoadingSpinner size="sm" /> : "Approve"}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default ViewMaterialRequest;
