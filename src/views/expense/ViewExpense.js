import axios from "axios";
import React, { useEffect, useReducer } from "react";
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
} from "@coreui/react";
import LoadingSpinner from "../../components/LoadingSpinner";
import LastActivity from "../../components/LastActivity";
import CIcon from "@coreui/icons-react";
import { cilPaperclip } from "@coreui/icons";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_EXPENSE_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_EXPENSE_SUCCESS":
      return { ...state, loading: false, expense: action.payload };
    case "FETCH_EXPENSE_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const ViewExpenseClaim = () => {
  const { id } = useParams();
  const authtoken = useSelector((state) => state.authtoken);
  const [{ loading, expense, error }, dispatch] = useReducer(reducer, {
    loading: false,
    expense: {},
    error: "",
  });

  useEffect(() => {
    const fetchExpense = async () => {
      dispatch({ type: "FETCH_EXPENSE_REQUEST" });
      try {
        const res = await axios.get(`/api/v1/expenseclaims/${id}`, {
          headers: { Authorization: `Bearer ${authtoken}` },
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
    fetchExpense();
  }, [authtoken, id]);

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
        return "success";
      case false:
        return "info";
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
                  {new Date(expense.createdAt).toLocaleString()}
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
                <CTableHeaderCell>Expense Date</CTableHeaderCell>
                <CTableHeaderCell>Expense Type</CTableHeaderCell>
                <CTableHeaderCell>Description</CTableHeaderCell>
                <CTableHeaderCell>Amount</CTableHeaderCell>
                <CTableHeaderCell>File</CTableHeaderCell>
                {/* <CTableHeaderCell>Cost Center</CTableHeaderCell> */}
                {/* <CTableHeaderCell>Default Account</CTableHeaderCell> */}
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {expense.expenses?.map((item, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>{item.expense_date}</CTableDataCell>
                  <CTableDataCell>{item.expense_type}</CTableDataCell>
                  <CTableDataCell>{item.description}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={getStatusBadge(item.is_over_limit)}>
                      ₹{item.amount}{" "}
                      {/* {item.is_over_limit ? "(Over Limit)" : "(Under Limit)"} */}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell>
                    {item.file ? (
                      <div className="d-flex align-items-center gap-2">
                        {/* Image thumbnail */}
                        <img
                          src={item.file}
                          alt="File"
                          style={{
                            width: "40px",
                            height: "40px",
                            objectFit: "cover",
                            borderRadius: "4px",
                          }}
                        />
                        {/* View link */}
                        <a
                          href={item.file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="white-link"
                        >
                          <CIcon
                            icon={cilPaperclip}
                            style={{ color: "white" }}
                          />
                        </a>
                      </div>
                    ) : (
                      <span className="text-muted">No File</span>
                    )}
                  </CTableDataCell>
                  {/* <CTableDataCell>{item.cost_center}</CTableDataCell> */}
                  {/* <CTableDataCell>{item.default_account}</CTableDataCell> */}
                </CTableRow>
              ))}

              {/* Add Total Row */}
              <CTableRow>
                <CTableDataCell className="text-end" colSpan={5}>
                  Total
                </CTableDataCell>
                <CTableHeaderCell className="fw-bold text-start">
                  ₹{expense.total_claimed_amount}
                </CTableHeaderCell>
                {/* <CTableDataCell /> */}
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
    </div>
  );
};

export default ViewExpenseClaim;
