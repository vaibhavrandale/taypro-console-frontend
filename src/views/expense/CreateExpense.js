import React, { useEffect, useReducer, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MdDeleteOutline } from "react-icons/md";
import { GrAddCircle } from "react-icons/gr";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  CButton,
  CForm,
  CFormInput,
  CFormSelect,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CModal,
  CTableBody,
  CTable,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
} from "@coreui/react";
import { cilX } from "@coreui/icons";
import CIcon from "@coreui/icons-react";

const reducer = (state, action) => {
  switch (action.type) {
    case "CREATE_REQUEST":
      return { ...state, loading: true };
    case "CREATE_SUCCESS":
      return { ...state, loading: false };
    case "CREATE_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "UPLOAD_REQUEST":
      return { ...state, uploadLoading: true };
    case "UPLOAD_SUCCESS":
      return { ...state, uploadLoading: false };
    case "UPLOAD_FAIL":
      return { ...state, uploadLoading: false, error: action.payload };
    default:
      return state;
  }
};

const CreateExpense = () => {
  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
    uploadLoading: false,
    error: null,
  });

  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.userInfo);

  const [visible, setVisible] = useState(false);
  // const authtoken = useSelector((state) => state.authtoken);
  let adminroute = "";

  if (userInfo?.role === "Master Admin") {
    adminroute = "master-admin";
  } else if (userInfo?.role === "Service Admin") {
    adminroute = "service-admin";
  } else if (userInfo?.role === "Project Admin") {
    adminroute = "project-admin";
  } else if (userInfo?.role === "Client Admin") {
    adminroute = "client-admin";
  } else if (userInfo?.role === "Site Incharge") {
    adminroute = "site-incharge";
  } else if (userInfo?.role === "Site Technician") {
    adminroute = "site-technician";
  } else if (userInfo?.role === "Client Site Technician") {
    adminroute = "client-site-technician";
  } else if (userInfo?.role === "Master User") {
    adminroute = "master-user";
  } else if (userInfo?.role === "Service User") {
    adminroute = "service-user";
  } else if (userInfo?.role === "Project User") {
    adminroute = "project-user";
  }

  useEffect(() => {
    // Show modal on page load
    setVisible(true);
  }, []);
  // Main form state
  const [formData, setFormData] = useState({
    company: "Taypro Private Limited",
    naming_series: "HR-EXP-.YYYY.-",
    name: "new-expense-claim-znzqxzcgqd",
    posting_date: new Date().toISOString().split("T")[0],
    cost_center: "Main - TAYPRO",
    payable_account: "Expense Claim Payable - TAYPRO",
    department: "Projects - TAYPRO",
    expense_approver: "tejas.memane@taypro.in",
    company_gstin: "27AAHCT4250H1ZA",
    department_of_visit: "",
    employee: userInfo.employee_id,
    employee_name: userInfo.username,
  });

  // Expense items
  const [expenseItems, setExpenseItems] = useState([
    {
      expense_date: new Date().toISOString().split("T")[0],
      cost_center: "Main - TAYPRO",
      expense_type: "",
      description: "",
      amount: 0,
      sanctioned_amount: 0,
      default_account: "",
      file: "",
    },
  ]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleExpenseItemChange = (index, field, value) => {
    setExpenseItems((prevItems) => {
      const newItems = [...prevItems];
      const updatedItem = { ...newItems[index], [field]: value };

      // 🛑 Check if this change will cause a duplicate
      const isDuplicate = newItems.some(
        (itm, idx) =>
          idx !== index &&
          itm.expense_date ===
            (field === "expense_date" ? value : updatedItem.expense_date) &&
          itm.expense_type ===
            (field === "expense_type" ? value : updatedItem.expense_type),
      );

      if (isDuplicate) {
        // Optionally show a toast or alert
        toast.error(
          "This expense type is already selected for the selected date.",
        );
        return prevItems; // 🚫 Do not apply the change
      }

      // ✅ No duplicate, proceed
      newItems[index] = updatedItem;
      return newItems;
    });
  };

  // const getDefaultAccount = (expenseType) => {
  //   switch (expenseType) {
  //     case "Food":
  //       return "Food Expenses - TPL";
  //     case "Travel":
  //       return "Travel Expenses - TPL";
  //     case "Stay":
  //       return "Hotel Expenses - TPL";
  //     case "Communication":
  //       return "Communication Expenses - TPL";
  //     case "Office":
  //       return "Office Expenses - TPL";
  //     default:
  //       return "Miscellaneous Expenses - TPL";
  //   }
  // };

  const addExpenseItem = () => {
    setExpenseItems([
      ...expenseItems,
      {
        expense_date: new Date().toISOString().split("T")[0], // ✅ "YYYY-MM-DD"
        cost_center: formData.cost_center,
        expense_type: "",
        description: "",
        amount: 0,
        sanctioned_amount: 0,
        default_account: "",
      },
    ]);
  };

  const removeExpenseItem = (index) => {
    if (expenseItems.length <= 1) {
      toast.error("At least one expense item is required");
      return;
    }
    setExpenseItems(expenseItems.filter((_, i) => i !== index));
  };

  const calculateTotals = () => {
    const totalClaimed = expenseItems.reduce(
      (sum, item) => sum + parseFloat(item.amount),
      0,
    );
    return {
      total_claimed_amount: parseFloat(totalClaimed.toFixed(2)),
      total_sanctioned_amount: parseFloat(totalClaimed.toFixed(2)), // Initially same as claimed
      grand_total: parseFloat(totalClaimed.toFixed(2)),
    };
  };

  const validateForm = () => {
    const errors = [];

    if (!formData.expense_approver) errors.push("Expense Approver");
    // if (!formData.department) errors.push("Department");

    expenseItems.forEach((item, index) => {
      if (!item.expense_date) errors.push(`Item ${index + 1}: Date`);
      if (!item.expense_type) errors.push(`Item ${index + 1}: Type`);
      if (!item.description) errors.push(`Item ${index + 1}: Description`);
      if (!item.amount || item.amount <= 0)
        errors.push(`Item ${index + 1}: Valid Amount`);
    });

    return errors;
  };

  const submitExpenseClaim = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      toast.error(`Missing required fields: ${validationErrors.join(", ")}`);
      return;
    }

    try {
      dispatch({ type: "CREATE_REQUEST" });

      const totals = calculateTotals();
      for (const item of expenseItems) {
        if (item.file) {
          const formData = new FormData();
          formData.append("file", item.file);

          try {
            dispatch({ type: "UPLOAD_REQUEST" });
            const { data } = await axios.post(
              "/api/v1/image-upload/expense-claim",
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                  // Authorization: `Bearer ${authtoken}`,
                },
                withCredentials: true,
              },
            );
            item.file = data.url; // assume server returns { url: "..." }
            dispatch({ type: "UPLOAD_SUCCESS" });
          } catch (uploadErr) {
            dispatch({ type: "UPLOAD_FAIL" });
            toast.error("Failed to upload attachment");
            return;
          }
        }
      }

      const payload = {
        ...formData,
        docstatus: 0,
        doctype: "Expense Claim",
        __islocal: 1,
        __unsaved: 1,
        name:
          formData.name ||
          `new-expense-claim-${Math.random().toString(36).substring(2, 12)}`,
        owner: userInfo.email,
        approval_status: "Draft",
        status: "Draft",
        workflow_state: "Draft",
        console_status: "Waiting For Approval",
        is_paid: true,
        taxes: [],
        advances: [],
        remark: "Site visit",
        total_claimed_amount: totals.total_claimed_amount,
        total_sanctioned_amount: totals.total_sanctioned_amount,
        grand_total: totals.grand_total,
        expenses: expenseItems.map((item, idx) => ({
          ...item,
          docstatus: 0,
          doctype: "Expense Claim Detail",
          __islocal: 1,
          __unsaved: 1,
          owner: userInfo.email,
          name: `new-expense-claim-detail-${Math.random()
            .toString(36)
            .substring(2, 12)}`,
          parent: formData.name,
          parentfield: "expenses",
          parenttype: "Expense Claim",
          idx: idx + 1,
          attachment: item.file || "",
        })),
      };

      const { data } = await axios.post("/api/v1/expenseclaims", payload, {
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${authtoken}`,
        },
        withCredentials: true,
      });
      console.log(data);

      dispatch({ type: "CREATE_SUCCESS" });
      toast.success("Expense claim created successfully");
      navigate(`/${adminroute}/expenses`);
    } catch (error) {
      dispatch({
        type: "CREATE_FAIL",
        payload: error.response?.data?.message || error.response?.data?.error,
      });
      toast.error(error.response?.data?.message || error.response?.data?.error);
    }
  };

  return (
    <div className="erp-container-wrapper py-3">
      {/* ERPNext Theme Custom Styles */}
      <style>{`
        .erp-container {
          background-color: transparent;
          border-radius: 8px;
          border: none;
          box-shadow: none;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          color: #f8fafc;
          overflow: hidden;
        }

        .erp-breadcrumb {
          font-size: 12px;
          color: #94a3b8;
          padding: 16px 0px 4px 0px;
          display: flex;
          gap: 6px;
        }

        .erp-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0px 16px 0px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .erp-header-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .erp-header-title h2 {
          font-size: 20px;
          font-weight: 600;
          margin: 0;
          color: #ffffff;
        }

        .erp-status-badge {
          font-size: 11px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .erp-status-badge.draft {
          background-color: rgba(217, 119, 6, 0.15);
          color: #fbbf24;
          border: 1px solid rgba(251, 191, 36, 0.3);
        }

        .erp-actions {
          display: flex;
          gap: 10px;
        }

        .erp-btn {
          font-size: 13px;
          font-weight: 500;
          padding: 6px 14px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border: 1px solid #334155;
          background-color: #1e293b;
          color: #e2e8f0;
          outline: none;
        }

        .erp-btn:hover {
          background-color: #334155;
          border-color: #475569;
        }

        .erp-btn-primary {
          background-color: #1b66ec;
          color: #ffffff;
          border-color: #1b66ec;
        }

        .erp-btn-primary:hover {
          background-color: #1652be;
          border-color: #1652be;
        }

        .erp-body {
          padding: 24px 0px;
        }

        .erp-section {
          margin-bottom: 28px;
          background: transparent;
        }

        .erp-section-header {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          color: #38bdf8;
          letter-spacing: 1px;
          margin-bottom: 16px;
          padding-bottom: 6px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .erp-field-group {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 16px 24px;
        }

        .erp-field {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .erp-label {
          font-size: 12px;
          font-weight: 500;
          color: #cbd5e1;
        }

        .erp-label .required {
          color: #f87171;
          margin-left: 2px;
        }

        .erp-input {
          font-size: 13px;
          padding: 8px 12px;
          border-radius: 6px;
          border: 1px solid #334155;
          background-color: #111c2e;
          color: #ffffff;
          outline: none;
          transition: all 0.2s;
        }

        .erp-input:focus {
          border-color: #1b66ec;
          box-shadow: 0 0 0 3px rgba(27, 102, 236, 0.25);
        }

        .erp-input[readonly] {
          background-color: #1e293b;
          color: #94a3b8;
          cursor: not-allowed;
          border-color: #334155;
        }

        select.erp-input option {
          background-color: #111c2e;
          color: #ffffff;
        }

        .erp-grid-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .erp-grid-header h4 {
          font-size: 15px;
          font-weight: 600;
          margin: 0;
          color: #ffffff;
        }

        .erp-grid-container {
          border: 1px solid #334155;
          border-radius: 6px;
          overflow: hidden;
          margin-bottom: 20px;
          background-color: #111c2e;
        }

        .erp-grid-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }

        .erp-grid-thead {
          background-color: #1e293b;
          border-bottom: 1px solid #334155;
        }

        .erp-grid-thead th {
          padding: 10px 12px;
          font-weight: 500;
          color: #cbd5e1;
          text-align: left;
          font-size: 12px;
        }

        .erp-grid-row {
          border-bottom: 1px solid #334155;
          transition: background-color 0.2s;
        }

        .erp-grid-row:last-child {
          border-bottom: none;
        }

        .erp-grid-row:hover {
          background-color: rgba(255, 255, 255, 0.02);
        }

        .erp-grid-td {
          padding: 6px 8px;
          vertical-align: middle;
        }

        .erp-grid-input {
          width: 100%;
          padding: 5px 8px;
          border: 1px solid transparent;
          background-color: transparent;
          border-radius: 4px;
          font-size: 13px;
          color: #ffffff;
          outline: none;
          transition: all 0.2s;
        }

        .erp-grid-input:focus, .erp-grid-input:hover {
          border-color: #475569;
          background-color: #111c2e;
        }

        select.erp-grid-input option {
          background-color: #111c2e;
          color: #ffffff;
        }

        .erp-grid-btn-delete {
          background: none;
          border: none;
          color: #f87171;
          font-size: 18px;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s;
        }

        .erp-grid-btn-delete:disabled {
          color: #475569;
          cursor: not-allowed;
          background: none;
        }

        .erp-grid-btn-delete:hover:not(:disabled) {
          background-color: rgba(248, 113, 113, 0.15);
        }

        .erp-summary-card {
          background-color: #111c2e;
          border-radius: 6px;
          padding: 14px 18px;
          border: 1px solid #334155;
          width: 280px;
          margin-left: auto;
        }

        .erp-summary-row {
          display: flex;
          justify-content: space-between;
          padding: 4px 0;
          font-size: 13px;
          color: #cbd5e1;
        }

        .erp-summary-row.total {
          font-size: 14px;
          font-weight: 600;
          border-top: 1px dashed #334155;
          margin-top: 6px;
          padding-top: 10px;
          color: #4ade80;
        }
      `}</style>

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

      <div className="erp-container">
        {/* Breadcrumb */}
        <div className="erp-breadcrumb">
          <span>HR</span> / <span>Expense Claim</span> /{" "}
          <span style={{ fontWeight: 500 }}>New Expense Claim</span>
        </div>

        {/* Form header toolbar */}
        <div className="erp-header">
          <div className="erp-header-title">
            <h2>New Expense Claim</h2>
            <span className="erp-status-badge draft">Draft</span>
          </div>
          <div className="erp-actions">
            <button
              type="button"
              className="erp-btn erp-btn-secondary"
              onClick={() => setVisible(true)}
            >
              Allowance Limits
            </button>
            <button
              type="submit"
              form="expense-form"
              className="erp-btn erp-btn-primary"
              disabled={loading}
            >
              {loading ? <LoadingSpinner /> : "Save"}
            </button>
          </div>
        </div>

        {/* Form body */}
        <div className="erp-body">
          <CForm id="expense-form" onSubmit={submitExpenseClaim}>
            {/* Claimant Details */}
            <div className="erp-section">
              <div className="erp-section-header">Employee Details</div>
              <div className="erp-field-group">
                <div className="erp-field">
                  <label className="erp-label">Employee ID</label>
                  <input
                    type="text"
                    className="erp-input"
                    value={formData.employee}
                    readOnly
                  />
                </div>
                <div className="erp-field">
                  <label className="erp-label">Employee Name</label>
                  <input
                    type="text"
                    className="erp-input"
                    value={formData.employee_name}
                    readOnly
                  />
                </div>
                <div className="erp-field">
                  <label className="erp-label">Company</label>
                  <input
                    type="text"
                    className="erp-input"
                    value={formData.company}
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* Accounting and Approvals */}
            <div className="erp-section">
              <div className="erp-section-header">Accounting & Approvals</div>
              <div className="erp-field-group">
                <div className="erp-field">
                  <label className="erp-label">
                    Posting Date <span className="required">*</span>
                  </label>
                  <input
                    type="date"
                    name="posting_date"
                    className="erp-input"
                    value={formData.posting_date}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="erp-field">
                  <label className="erp-label">
                    Department of Visit <span className="required">*</span>
                  </label>
                  <select
                    name="department_of_visit"
                    className="erp-input"
                    value={formData.department_of_visit}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="">Select Department of Visit</option>
                    <option value="Projects - TAYPRO">Project</option>
                    <option value="Field Service - TAYPRO">Service</option>
                  </select>
                </div>
                <div className="erp-field">
                  <label className="erp-label">
                    Cost Center <span className="required">*</span>
                  </label>
                  <select
                    name="cost_center"
                    className="erp-input"
                    value={formData.cost_center}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="Main - TAYPRO">Main</option>
                  </select>
                </div>
              </div>

              <div className="erp-field-group mt-3">
                <div className="erp-field" style={{ gridColumn: "span 2" }}>
                  <label className="erp-label">Expense Approver Email</label>
                  <input
                    type="email"
                    name="expense_approver"
                    className="erp-input"
                    value={formData.expense_approver}
                    readOnly
                  />
                </div>
                <div className="erp-field">
                  <label className="erp-label">Company GSTIN</label>
                  <input
                    type="text"
                    className="erp-input"
                    value={formData.company_gstin}
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* Expenses Child Table Grid */}
            <div className="erp-section">
              <div className="erp-grid-header">
                <h4>Expenses</h4>
                <button
                  type="button"
                  onClick={addExpenseItem}
                  className="erp-btn erp-btn-secondary"
                  style={{ padding: "4px 10px", fontSize: "12px" }}
                >
                  <GrAddCircle /> Add Row
                </button>
              </div>

              <div className="erp-grid-container">
                <table className="erp-grid-table">
                  <thead className="erp-grid-thead">
                    <tr>
                      <th style={{ width: "15%" }}>Date</th>
                      <th style={{ width: "20%" }}>Type</th>
                      <th style={{ width: "35%" }}>Description</th>
                      <th style={{ width: "15%" }}>Amount (₹)</th>
                      <th style={{ width: "10%" }}>Attachment</th>
                      <th style={{ width: "5%", textAlign: "center" }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenseItems.map((item, index) => {
                      const isDuplicate = expenseItems.some(
                        (itm, idx) =>
                          idx !== index &&
                          itm.expense_date === item.expense_date &&
                          itm.expense_type === item.expense_type &&
                          item.expense_type !== "",
                      );

                      return (
                        <React.Fragment key={index}>
                          <tr className="erp-grid-row">
                            <td className="erp-grid-td">
                              <input
                                type="date"
                                className="erp-grid-input"
                                value={item.expense_date}
                                onChange={(e) =>
                                  handleExpenseItemChange(
                                    index,
                                    "expense_date",
                                    e.target.value,
                                  )
                                }
                                required
                              />
                            </td>
                            <td className="erp-grid-td">
                              <select
                                className="erp-grid-input"
                                value={item.expense_type}
                                onChange={(e) =>
                                  handleExpenseItemChange(
                                    index,
                                    "expense_type",
                                    e.target.value,
                                  )
                                }
                                required
                              >
                                <option value="">Select Type</option>
                                {["Food", "Travel", "Medical", "Others"].map(
                                  (type) => {
                                    const isAlreadySelected = expenseItems.some(
                                      (itm, idx) =>
                                        idx !== index &&
                                        itm.expense_date ===
                                          item.expense_date &&
                                        itm.expense_type === type,
                                    );
                                    return (
                                      <option
                                        key={type}
                                        value={type}
                                        disabled={isAlreadySelected}
                                      >
                                        {type}
                                      </option>
                                    );
                                  },
                                )}
                              </select>
                            </td>
                            <td className="erp-grid-td">
                              <textarea
                                className="erp-grid-input"
                                rows={1}
                                style={{
                                  resize: "vertical",
                                  minHeight: "32px",
                                }}
                                value={item.description}
                                onChange={(e) =>
                                  handleExpenseItemChange(
                                    index,
                                    "description",
                                    e.target.value,
                                  )
                                }
                                required
                              />
                            </td>
                            <td className="erp-grid-td">
                              <input
                                type="number"
                                className="erp-grid-input"
                                min="0"
                                step="0.01"
                                value={item.amount}
                                onChange={(e) =>
                                  handleExpenseItemChange(
                                    index,
                                    "amount",
                                    e.target.value,
                                  )
                                }
                                required
                              />
                            </td>
                            <td className="erp-grid-td">
                              <CFormInput
                                type="file"
                                size="sm"
                                style={{ fontSize: "11px", padding: "2px 4px" }}
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (file) {
                                    const maxSize = 1 * 1024 * 1024;
                                    if (file.size > maxSize) {
                                      const fileSizeInMB = (
                                        file.size /
                                        (1024 * 1024)
                                      ).toFixed(2);
                                      toast.error(
                                        `File size must be less than 1MB. Your file size is ${fileSizeInMB} MB.`,
                                      );
                                      e.target.value = "";
                                      return;
                                    }
                                    handleExpenseItemChange(
                                      index,
                                      "file",
                                      file,
                                    );
                                  }
                                }}
                              />
                            </td>
                            <td
                              className="erp-grid-td"
                              style={{ textAlign: "center" }}
                            >
                              <button
                                type="button"
                                onClick={() => removeExpenseItem(index)}
                                className="erp-grid-btn-delete"
                                disabled={expenseItems.length <= 1}
                                title="Delete Row"
                              >
                                <MdDeleteOutline />
                              </button>
                            </td>
                          </tr>

                          {isDuplicate && (
                            <tr>
                              <td
                                colSpan="6"
                                style={{
                                  padding: "2px 14px",
                                  backgroundColor: "#fef2f2",
                                }}
                              >
                                <div className="text-danger small">
                                  <strong>{item.expense_type}</strong> already
                                  selected for this date.
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary */}
            <div className="erp-summary-card">
              <div className="erp-summary-row">
                <span>Total Claimed:</span>
                <strong>
                  ₹{calculateTotals().total_claimed_amount.toFixed(2)}
                </strong>
              </div>
              <div className="erp-summary-row total">
                <span>Grand Total:</span>
                <span>₹{calculateTotals().grand_total.toFixed(2)}</span>
              </div>
            </div>
          </CForm>
        </div>
      </div>
    </div>
  );
};

export default CreateExpense;
