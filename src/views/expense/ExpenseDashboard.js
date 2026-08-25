import React, { useEffect, useReducer, useState } from "react";
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
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
  CFormSelect,
  CModalFooter,
} from "@coreui/react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";
import PaginateInput from "../../components/PaginateInput";
import moment from "moment";
import CIcon from "@coreui/icons-react";
import { cilX } from "@coreui/icons";
import ExpenseDashboardCharts from "./ExpenseDashboardCharts";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        expenses: action.payload.data,
        totalPages: action.payload.totalPages,
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "STATS_REQUEST":
      return { ...state, statsLoading: true };
    case "STATS_SUCCESS":
      return {
        ...state,
        statsLoading: false,
        stats: action.payload,
      };
    case "STATS_FAIL":
      return { ...state, statsLoading: false, stats: null };

    case "APPROVE_REQUEST":
      return { ...state, approveLoading: true, approveError: "" };
    case "APPROVE_SUCCESS":
      return {
        ...state,
        approveLoading: false,
      };
    case "APPROVE_FAIL":
      return { ...state, approveLoading: false, approveError: action.payload };
    case "DELETE_EXPENSE_REQUEST":
      return { ...state, deleteLoading: true, deleteError: "" };

    case "DELETE_EXPENSE_SUCCESS":
      return { ...state, deleteLoading: false };

    case "DELETE_EXPENSE_FAIL":
      return { ...state, deleteLoading: false, deleteError: action.payload };

    default:
      return state;
  }
};

const ExpenseDashboard = () => {
  const [
    {
      loading,
      error,
      expenses,
      totalPages,
      hasNextPage,
      hasPrevPage,
      approveLoading,
      deleteLoading,
      deleteError,
      stats,
      statsLoading,
    },
    dispatch,
  ] = useReducer(reducer, {
    expenses: [],
    stats: null,
    loading: true,
    statsLoading: true,
    approveLoading: false,
    error: "",
    approveError: "",
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
    deleteError: "",
    deleteLoading: false,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({
    department: "",
    employee: "",
    status: "",
  });
  // const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);
  const [pageInput, setPageInput] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [uploadingFields, setUploadingFields] = useState({});
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [expense, setExpense] = useState(null);
  const [remark, setRemark] = useState("");
  const [deleteReason, setDeleteReason] = useState("");

  const navigate = useNavigate();

  const fetchExpenses = async () => {
    const body = {
      pg: page,
      limit: limit,
      ...(appliedFilters.department.trim()
        ? { department: appliedFilters.department.trim() }
        : {}),
      ...(appliedFilters.employee.trim()
        ? { employee: appliedFilters.employee.trim() }
        : {}),
      ...(appliedFilters.status ? { status: appliedFilters.status } : {}),
    };

    dispatch({ type: "FETCH_REQUEST" });

    try {
      const result = await axios.post(
        `/api/v1/expenseclaims/get-expense-claims`,
        body,
        {
          withCredentials: true,
        },
      );

      const total = Math.ceil(
        Number(result?.data?.data?.total) / Number(result?.data?.data?.limit),
      );
      const hasNextPage = result?.data?.data?.hasNextPage;
      const hasPrevPage = result?.data?.data?.hasPrevPage;
      const expenses = result?.data?.data?.data;

      dispatch({
        type: "FETCH_SUCCESS",
        payload: {
          data: expenses,
          totalPages: total,
          hasNextPage: hasNextPage,
          hasPrevPage: hasPrevPage,
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

  const fetchExpenseStats = async () => {
    dispatch({ type: "STATS_REQUEST" });
    try {
      const result = await axios.get(
        `/api/v1/expenseclaims/dashboard-stats`,
        { withCredentials: true },
      );
      dispatch({
        type: "STATS_SUCCESS",
        payload: result?.data?.data || null,
      });
    } catch {
      dispatch({ type: "STATS_FAIL" });
    }
  };

  const deleteExpense = async (id, reason) => {
    dispatch({ type: "DELETE_EXPENSE_REQUEST" });
    try {
      const result = await axios.put(
        `/api/v1/expenseclaims/delete-expense/${id}`,
        { reason },
        {
          // headers: { Authorization: `Bearer ${authtoken}` }
          withCredentials: true,
        },
      );

      dispatch({ type: "DELETE_EXPENSE_SUCCESS", payload: id });
      toast.success(result?.data?.message);
      fetchExpenses();
      fetchExpenseStats();
    } catch (error) {
      dispatch({
        type: "DELETE_EXPENSE_FAIL",
        payload: error.response?.data?.message || error.response?.data?.error,
      });
      toast.error(error.response?.data?.message || error.response?.data?.error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [page, limit, appliedFilters]);

  useEffect(() => {
    fetchExpenseStats();
  }, []);

  const applyFilters = () => {
    setPage(1);
    setAppliedFilters({
      department: departmentFilter,
      employee: employeeFilter,
      status: statusFilter,
    });
  };

  const clearFilters = () => {
    setDepartmentFilter("");
    setEmployeeFilter("");
    setStatusFilter("");
    setSearchTerm("");
    setPage(1);
    setAppliedFilters({ department: "", employee: "", status: "" });
  };

  const filteredData = expenses?.filter((expense) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      expense.name?.toLowerCase().includes(term) ||
      expense.employee_name?.toLowerCase().includes(term) ||
      expense.department?.toLowerCase().includes(term)
    );
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return "success";
      case "Pending Approval":
        return "warning";
      case "Rejected":
        return "danger";
      case "Draft":
        return "warning";
      case true:
        return "success";
      case false:
        return "warning";
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
      fetchExpenses();
      fetchExpenseStats();
      toast.success(response.data.frappe_response.data.name);
      setUploadingFields((prev) => ({ ...prev, [id]: false })); // ✅ Set only this field to loading
    } catch (error) {
      const raw =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Failed to approve and push to ERP";
      const msg = typeof raw === "string" ? raw : JSON.stringify(raw);
      toast.error(msg);
      dispatch({
        type: "APPROVE_FAIL",
        payload: msg,
      });
      setUploadingFields((prev) => ({ ...prev, [id]: false })); // ✅ Set only this field to loading
    }
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

  const checkEmployeeID = (e) => {
    e.preventDefault(); // important to stop <Link> from navigating
    if (
      !userInfo.employee_id ||
      userInfo.employee_id === "" ||
      userInfo.employee_id === null
    ) {
      toast.error("Please update Employee ID");
    } else {
      navigate(`/${adminroute}/expenses/create-expense`);
    }
  };

  return (
    <div className="">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="">Expense Claims</h3>
        <Link
          // to={`/${adminroute}/expenses/create-expense`}
          onClick={checkEmployeeID}
          className="btn btn-primary btn-sm"
        >
          New Expense Claim
        </Link>
      </div>

      <ExpenseDashboardCharts
        stats={stats}
        loading={statsLoading}
      />

      {/* remark modal */}
      <CModal
        visible={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        backdrop="static"
      >
        <CModalHeader closeButton={false}>
          <CModalTitle>Enter Remark {expense?.name}</CModalTitle>
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
          {/* <CButton color="secondary" size="sm">
            Cancel
          </CButton> */}

          <CButton
            color="danger"
            size="sm"
            onClick={() => {
              handleApproveAndPushToERP(expense._id);
              setShowApproveModal(false);
              setRemark("");
            }}
          >
            {approveLoading ? <LoadingSpinner size="sm" /> : "Approve"}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Filters */}
      <CRow className="mb-3 g-2 align-items-end">
        <CCol xs={12} sm={6} md={3} lg={2}>
          <CFormLabel className="mb-1">Department</CFormLabel>
          <CFormInput
            type="text"
            placeholder="Department"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
          />
        </CCol>
        <CCol xs={12} sm={6} md={3} lg={2}>
          <CFormLabel className="mb-1">Employee</CFormLabel>
          <CFormInput
            type="text"
            placeholder="Employee"
            value={employeeFilter}
            onChange={(e) => setEmployeeFilter(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
          />
        </CCol>
        <CCol xs={12} sm={6} md={3} lg={2}>
          <CFormLabel className="mb-1">Status</CFormLabel>
          <CFormSelect
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Draft">Draft</option>
            <option value="Rejected">Rejected</option>
          </CFormSelect>
        </CCol>
        <CCol xs={12} sm={6} md={3} lg={2}>
          <CFormLabel className="mb-1">Search</CFormLabel>
          <CFormInput
            type="text"
            placeholder="Claim ID on this page"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CCol>
        <CCol xs={12} sm={6} md={6} lg={4} className="d-flex gap-2">
          <CButton color="primary" size="sm" onClick={applyFilters}>
            Apply
          </CButton>
          <CButton color="secondary" variant="outline" size="sm" onClick={clearFilters}>
            Clear
          </CButton>
        </CCol>
      </CRow>

      {/* Expense Claims Table */}
      <CTable bordered hover responsive className="text-center bg-important">
        {/* className="text-center shadow-sm" */}
        <CTableHead color="secondary">
          <CTableRow>
            <CTableHeaderCell> Sr</CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "250px" }}>
              Claim ID
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "100px" }}>
              Dept. of Visit
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "160px" }}>
              Date
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "160px" }}>
              Employee
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "160px" }}>
              Department
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "100px" }}>
              Amount
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "130px" }}>
              Console Status
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "130px" }}>
              ERP Status
            </CTableHeaderCell>
            {userInfo.role === "Site Technician" ? (
              ""
            ) : (
              <CTableHeaderCell style={{ minWidth: "130px" }}>
                Technician Update
              </CTableHeaderCell>
            )}
            <CTableHeaderCell style={{ minWidth: "250px" }}>
              Created At
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "250px" }}>
              Actions
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {loading ? (
            <CTableRow>
              <CTableHeaderCell colSpan="12" className="text-center">
                <LoadingSpinner />
              </CTableHeaderCell>
            </CTableRow>
          ) : error ? (
            <CTableRow>
              <CTableHeaderCell colSpan="12" className="text-center">
                {error}
              </CTableHeaderCell>
            </CTableRow>
          ) : filteredData.length > 0 ? (
            filteredData.map((expense, index) => (
              <CTableRow key={index}>
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell>
                  <Link to={`/${adminroute}/expenses/view/${expense._id}`}>
                    {expense.name}
                  </Link>
                </CTableDataCell>
                <CTableDataCell>{expense.department_of_visit}</CTableDataCell>
                <CTableDataCell>
                  {new Date(expense.posting_date).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </CTableDataCell>
                <CTableDataCell>{expense.employee_name}</CTableDataCell>
                <CTableDataCell>{expense.department}</CTableDataCell>
                <CTableDataCell>
                  ₹{expense.grand_total?.toFixed(2)}
                </CTableDataCell>
                <CTableDataCell>
                  <CBadge color={getStatusBadge(expense.console_status)}>
                    {expense.console_status}
                  </CBadge>
                </CTableDataCell>
                <CTableDataCell>
                  <CBadge color={getStatusBadge(expense.status)}>
                    {expense.status}
                  </CBadge>
                </CTableDataCell>
                {userInfo.role === "Site Technician" ? (
                  ""
                ) : (
                  <CTableDataCell>
                    <CBadge color={getStatusBadge(expense.can_technician_edit)}>
                      {expense.can_technician_edit ? "Enable" : "Disable"}
                    </CBadge>
                  </CTableDataCell>
                )}
                <CTableDataCell>
                  <CTooltip
                    content={moment(expense.createdAt).format(
                      "DD MMM YYYY, hh:mm A",
                    )}
                  >
                    <span>{moment(expense.createdAt).fromNow()}</span>
                  </CTooltip>
                  <br />(
                  {new Date(expense.createdAt).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                  })}
                  )
                </CTableDataCell>
                <CTableDataCell>
                  {/* View */}
                  <Link
                    to={`/${adminroute}/expenses/view/${expense._id}`}
                    className="btn btn-sm btn-secondary m-1"
                  >
                    View
                  </Link>

                  {/* Update */}
                  {!["Master User", "Service User", "Project User"].includes(
                    userInfo?.role,
                  ) &&
                    (userInfo.role !== "Site Technician" ||
                      expense.can_technician_edit) && (
                      <Link
                        className="btn btn-sm btn-warning m-1"
                        to={`/${adminroute}/expenses/update/${expense._id}`}
                      >
                        Update
                      </Link>
                    )}

                  {/* Approve (only Admins & if Draft) */}
                  {["Master Admin", "Service Admin", "Project Admin"].includes(
                    userInfo.role,
                  ) &&
                    expense.status === "Draft" && (
                      <CButton
                        className="btn btn-primary btn-sm m-1"
                        onClick={() => {
                          setShowApproveModal(true); // ✅ Correct modal for approve
                          setExpense(expense);
                        }}
                        disabled={
                          approveLoading ||
                          expense.console_status === "Approved"
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

                  {/* Delete (only Admins) */}
                  {["Master Admin", "Service Admin", "Project Admin"].includes(
                    userInfo.role,
                  ) && (
                    <CButton
                      color="danger"
                      size="sm"
                      className="m-1"
                      onClick={() => {
                        setExpense(expense); // ✅ Set the expense to be deleted
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
              <CTableDataCell colSpan="12" className="text-center">
                No expense claims found
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
      {/* Delete Expense Modal */}
      <CModal
        visible={showDeleteModal && expense}
        onClose={() => {
          setShowDeleteModal(false);
          setExpense(null);
          setDeleteReason("");
        }}
        backdrop="static"
      >
        <CModalHeader closeButton={false}>
          <CModalTitle>Delete Expense</CModalTitle>
          <button
            type="button"
            className="border-0 ms-auto py-0 px-1"
            onClick={() => {
              setShowDeleteModal(false);
              setExpense(null);
              setDeleteReason("");
            }}
            style={{ background: "none" }}
          >
            <CIcon icon={cilX} size="lg" />
          </button>
        </CModalHeader>

        <CModalBody>
          <p>
            Are you sure you want to delete{" "}
            <strong>{expense?.name || expense?._id}</strong>?
          </p>
          <CFormLabel>Reason for Deletion</CFormLabel>
          <CFormInput
            type="text"
            placeholder="Enter reason..."
            value={deleteReason}
            onChange={(e) => setDeleteReason(e.target.value)}
          />
          {deleteError && <p className="text-danger mt-2">{deleteError}</p>}
        </CModalBody>

        <CModalFooter>
          <CButton
            color="secondary"
            size="sm"
            onClick={() => {
              setShowDeleteModal(false);
              setExpense(null);
              setDeleteReason("");
            }}
            disabled={deleteLoading}
          >
            Cancel
          </CButton>
          <CButton
            color="danger"
            size="sm"
            onClick={() => {
              if (!deleteReason.trim()) {
                toast.error("Please enter a reason for deletion");
                return;
              }
              deleteExpense(expense._id, deleteReason);
              setShowDeleteModal(false);
              setDeleteReason("");
            }}
            disabled={deleteLoading}
          >
            {deleteLoading ? <LoadingSpinner size="sm" /> : "Delete"}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default ExpenseDashboard;
