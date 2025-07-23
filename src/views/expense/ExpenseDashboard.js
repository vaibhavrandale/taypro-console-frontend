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
  CModalFooter,
  CFormLabel,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CModal,
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
    },
    dispatch,
  ] = useReducer(reducer, {
    expenses: [],
    loading: true,
    approveLoading: false,
    error: "",
    approveError: "",
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);
  const [pageInput, setPageInput] = useState("");
  const [remark, setRemark] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [uploadingFields, setUploadingFields] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [expense, setExpense] = useState(null);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  const fetchExpenses = async () => {
    const pagination = {
      pg: page,
      limit: limit,
    };

    dispatch({ type: "FETCH_REQUEST" });

    try {
      const result = await axios.post(
        `/api/v1/expenseclaims/get-expense-claims`,
        pagination,
        {
          headers: {
            Authorization: `Bearer ${authtoken}`,
          },
        }
      );

      const total = Math.ceil(
        Number(result?.data?.data?.total) / Number(result?.data?.data?.limit)
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
  useEffect(() => {
    // Show modal on page load
    setVisible(true);
    fetchExpenses();
  }, [authtoken, page, limit]);

  const filteredData = expenses?.filter(
    (expense) =>
      expense.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.employee_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        { headers: { Authorization: `Bearer ${authtoken}` } }
      );
      console.log(response.data.frappe_response.data.name);

      dispatch({ type: "APPROVE_SUCCESS" });
      fetchExpenses();
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
      <CModal
        visible={visible}
        onClose={() => setVisible(false)}
        backdrop="static"
      >
        <CModalHeader closeButton={false}>
          <CModalTitle>Technician Daily Allowance Limits</CModalTitle>
          <button
            type="button"
            className=" border-0 ms-auto py-0 px-1"
            onClick={() => setVisible(false)}
            style={{ background: "none" }}
          >
            <CIcon icon={cilX} size="lg" />
          </button>
        </CModalHeader>
        <CModalBody>
          <CTable bordered responsive>
            <CTableBody>
              <CTableRow>
                <CTableHeaderCell>Food</CTableHeaderCell>
                <CTableDataCell>₹500</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell>Stay</CTableHeaderCell>
                <CTableDataCell>₹1,000</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell>Travel</CTableHeaderCell>
                <CTableDataCell>₹1,000</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell>Other</CTableHeaderCell>
                <CTableDataCell>₹110</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell>Total Per Day</CTableHeaderCell>
                <CTableDataCell>₹2,610</CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </CModalBody>
      </CModal>
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
          {/* <CButton color="secondary" size="sm">
            Cancel
          </CButton> */}

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

      {/* Search Input */}
      <CRow className="justify-content-end">
        <CCol xs={12} sm={10} md={8} lg={5}>
          <CInputGroup className="mb-3">
            <CFormInput
              type="text"
              placeholder="Search by Claim ID, Employee or Department"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </CInputGroup>
        </CCol>
      </CRow>

      {/* Expense Claims Table */}
      <CTable bordered hover responsive className="bg-important">
        <CTableHead color="secondary">
          <CTableRow>
            <CTableHeaderCell> Sr</CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "250px" }}>
              Claim ID
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
              <CTableHeaderCell colSpan="7" className="text-center">
                <LoadingSpinner />
              </CTableHeaderCell>
            </CTableRow>
          ) : error ? (
            <CTableRow>
              <CTableHeaderCell colSpan="7" className="text-center">
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
                      "DD MMM YYYY, hh:mm A"
                    )}
                  >
                    <span>{moment(expense.createdAt).fromNow()}</span>
                  </CTooltip>
                  <br />({new Date(expense.createdAt).toLocaleString()})
                </CTableDataCell>
                <CTableDataCell>
                  <Link
                    to={`/${adminroute}/expenses/view/${expense._id}`}
                    className="btn btn-sm btn-secondary m-1"
                  >
                    View
                  </Link>
                  {(userInfo.role !== "Site Technician" ||
                    expense.can_technician_edit) && (
                    <Link
                      className="btn btn-sm btn-warning m-1"
                      to={`/${adminroute}/expenses/update/${expense._id}`}
                    >
                      Update
                    </Link>
                  )}

                  {(userInfo.role === "Master Admin" ||
                    userInfo.role === "Service Admin" ||
                    userInfo.role === "Project Admin") &&
                    expense.status === "Draft" && (
                      <CButton
                        className="btn btn-primary btn-sm m-1"
                        // onClick={() => handleApproveAndPushToERP(expense._id)}
                        onClick={() => {
                          setShowDeleteModal(true);
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
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan="7" className="text-center">
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
    </div>
  );
};

export default ExpenseDashboard;
