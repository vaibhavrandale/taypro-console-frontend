import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
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
import { cilCloudDownload, cilPaperclip, cilX } from "@coreui/icons";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_EXPENSE_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_EXPENSE_SUCCESS":
      return { ...state, loading: false, expense: action.payload };
    case "FETCH_EXPENSE_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "APPROVE_REQUEST":
      return { ...state, approveLoading: true, approveError: "" };
    case "APPROVE_SUCCESS":
      return {
        ...state,
        approveLoading: false,
      };
    case "APPROVE_FAIL":
      return { ...state, approveLoading: false, approveError: action.payload };
    default:
      return state;
  }
};

const ViewExpenseClaim = () => {
  const { id } = useParams();
  // const authtoken = useSelector((state) => state.authtoken);
  const [{ loading, expense, error, approveLoading, approveError }, dispatch] =
    useReducer(reducer, {
      loading: false,
      expense: {},
      error: "",
      approveLoading: false,
      approveError: "",
    });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const userInfo = useSelector((state) => state.userInfo);
  const [uploadingFields, setUploadingFields] = useState({});
  const [remark, setRemark] = useState("");

  const fetchExpense = async () => {
    dispatch({ type: "FETCH_EXPENSE_REQUEST" });
    try {
      const res = await axios.get(`/api/v1/expenseclaims/${id}`, {
        // headers: { Authorization: `Bearer ${authtoken}` },
        withCredentials: true,
      });
      dispatch({ type: "FETCH_EXPENSE_SUCCESS", payload: res.data.data });
    } catch (err) {
      dispatch({
        type: "FETCH_EXPENSE_FAIL",
        payload: err.response?.data?.error || err.response?.data?.message,
      });
      toast.error(err.response?.data?.error || err.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchExpense();
  }, [id]);

  const handleApproveAndPushToERP = async (id) => {
    try {
      setUploadingFields((prev) => ({ ...prev, [id]: true })); // ✅ Set only this field to loading

      dispatch({ type: "APPROVE_REQUEST" });

      const response = await axios.put(
        `/api/v1/expenseclaims/approve/${id}`,
        { console_status: "Approved", remark: remark },
        {
          //  headers: { Authorization: `Bearer ${authtoken}` }
          withCredentials: true,
        },
      );
      console.log(response.data.frappe_response.data.name);

      dispatch({ type: "APPROVE_SUCCESS" });
      fetchExpense();
      toast.success(response.data.frappe_response.data.name);
      setUploadingFields((prev) => ({ ...prev, [id]: false })); // ✅ Set only this field to loading
    } catch (error) {
      toast.error(error.response?.data?.message || error.response?.data?.error);
      dispatch({
        type: "APPROVE_FAIL",
        payload: error.response?.data?.message || error.response?.data?.error,
      });
      setUploadingFields((prev) => ({ ...prev, [id]: false })); // ✅ Set only this field to loading
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return "success";
      case "Pending Approval":
        return "warning";
      case "Rejected":
        return "danger";
      case "Draft":
        return "info";
      case true:
        return "danger";
      case false:
        return "success";
      case "Waiting for HR Approval":
        return "warning";
      case "Waiting for Management Approval":
        return "warning";
      case "Waiting for Disbursement":
        return "warning";
      case "Paid":
        return "success";
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
          <div className="d-flex justify-content-end align-items-center mb-3">
            {(userInfo.role === "Master Admin" ||
              userInfo.role === "Service Admin" ||
              userInfo.role === "Project Admin") &&
              expense.status === "Draft" && (
                <CButton
                  className="btn btn-primary btn-sm m-1"
                  onClick={() => {
                    setShowDeleteModal(true);
                  }}
                  disabled={
                    approveLoading || expense.console_status === "Approved"
                  }
                >
                  {uploadingFields[expense._id] ? (
                    <LoadingSpinner />
                  ) : expense.console_status === "Approved" ? (
                    "Approved"
                  ) : (
                    "Approve"
                  )}
                </CButton>
              )}
          </div>

          <CTable striped bordered responsive>
            <CTableBody>
              <CTableRow>
                <CTableHeaderCell>Expense Name</CTableHeaderCell>
                <CTableDataCell>{expense.name}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell>Owner</CTableHeaderCell>
                <CTableDataCell>{expense.owner}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell>Company</CTableHeaderCell>
                <CTableDataCell>{expense.company}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell> ERP Status</CTableHeaderCell>

                <CTableDataCell>
                  <CBadge color={getStatusBadge(expense.status)}>
                    {expense.status}
                  </CBadge>
                </CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell> Console Status</CTableHeaderCell>

                <CTableDataCell>
                  <CBadge color={getStatusBadge(expense.console_status)}>
                    {expense.console_status}
                  </CBadge>
                </CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell>Approval Status</CTableHeaderCell>
                <CTableDataCell>{expense.approval_status}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell>Total Claimed Amount</CTableHeaderCell>
                <CTableDataCell>₹{expense.total_claimed_amount}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell>Remark</CTableHeaderCell>
                <CTableDataCell>{expense.remark}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell>Created At</CTableHeaderCell>
                <CTableDataCell>
                  {new Date(expense.createdAt).toLocaleString("en-GB", {
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

          {/* Expense Items Table */}
          <h5 className="mt-4">Expense Items</h5>
          <CTable bordered responsive style={{ background: "#fff" }}>
            <CTableHead color="secondary">
              <CTableRow>
                <CTableHeaderCell>Sr</CTableHeaderCell>
                <CTableHeaderCell style={{ minWidth: "150px" }}>
                  Expense Date
                </CTableHeaderCell>
                <CTableHeaderCell style={{ minWidth: "150px" }}>
                  Expense Type
                </CTableHeaderCell>
                <CTableHeaderCell style={{ minWidth: "200px" }}>
                  Description
                </CTableHeaderCell>
                <CTableHeaderCell style={{ minWidth: "150px" }}>
                  Amount
                </CTableHeaderCell>
                <CTableHeaderCell>File</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {expense.expenses?.map((item, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>
                    {" "}
                    {new Date(item.expense_date).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </CTableDataCell>
                  <CTableDataCell>{item.expense_type}</CTableDataCell>
                  <CTableDataCell>{item.description}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={getStatusBadge(item.is_over_limit)}>
                      ₹{item.amount}{" "}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell>
                    {item.file ? (
                      item.file.endsWith(".pdf") ? (
                        <Link
                          to={`${item.file}?fl_attachment=true`}
                          className="d-flex align-items-center justify-content-center gap-2 white-link"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <CIcon
                            icon={cilCloudDownload}
                            style={{ color: "white" }}
                          />
                        </Link>
                      ) : (
                        <Link
                          to={`${item.file}?fl_attachment=true`}
                          className="d-flex align-items-center justify-content-center gap-2 white-link"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <CIcon
                            icon={cilPaperclip}
                            style={{ color: "white" }}
                          />
                        </Link>
                      )
                    ) : (
                      <span className="text-muted">No File</span>
                    )}
                  </CTableDataCell>
                </CTableRow>
              ))}

              {/* Add Total Row */}
              <CTableRow>
                <CTableDataCell className="text-end" colSpan={4}>
                  Total
                </CTableDataCell>
                <CTableHeaderCell className="fw-bold text-start">
                  ₹{expense.total_claimed_amount}
                </CTableHeaderCell>
                <CTableDataCell />
                {/* <CTableDataCell /> */}
              </CTableRow>
            </CTableBody>
          </CTable>

          {/* Activity Log */}
          <div className="mt-4">
            <h5>Activity</h5>
            <LastActivity lastactivity={expense.last_activity} />
          </div>
        </>
      )}
      {/* remark modal */}
      <CModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        backdrop="static"
      >
        <CModalHeader closeButton={false}>
          <CModalTitle>Enter Remark {expense?.name}</CModalTitle>
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
          <p>Enter Remark before Approving</p>

          <CFormLabel>Remark</CFormLabel>
          <CFormInput
            type="text"
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
              handleApproveAndPushToERP(expense._id);
              setShowDeleteModal(false);
              setRemark("");
            }}
          >
            {approveLoading ? <LoadingSpinner size="sm" /> : "Approve"}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default ViewExpenseClaim;
