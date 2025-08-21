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
  const authtoken = useSelector((state) => state.authtoken);
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
  } else if (userInfo?.role === "Client Technician") {
    adminroute = "client-technician";
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
    cost_center: "Main - TPL",
    payable_account: "Employee Expenses Payable - TPL",
    department: "Project - TPL",
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
      cost_center: "Main - TPL",
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
            (field === "expense_type" ? value : updatedItem.expense_type)
      );

      if (isDuplicate) {
        // Optionally show a toast or alert
        toast.error(
          "This expense type is already selected for the selected date."
        );
        return prevItems; // 🚫 Do not apply the change
      }

      // ✅ No duplicate, proceed
      newItems[index] = updatedItem;
      return newItems;
    });
  };

  const getDefaultAccount = (expenseType) => {
    switch (expenseType) {
      case "Food":
        return "Food Expenses - TPL";
      case "Travel":
        return "Travel Expenses - TPL";
      case "Stay":
        return "Hotel Expenses - TPL";
      case "Communication":
        return "Communication Expenses - TPL";
      case "Office":
        return "Office Expenses - TPL";
      default:
        return "Miscellaneous Expenses - TPL";
    }
  };

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
      0
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
                  Authorization: `Bearer ${authtoken}`,
                },
              }
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
        console_status: "Draft",
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
          Authorization: `Bearer ${authtoken}`,
        },
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
    <div className="container py-4">
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
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">New Expense</h3>
        </div>

        <div className="card-body">
          <CForm onSubmit={submitExpenseClaim}>
            {/* Basic Information Section */}
            <div className="mb-4">
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label">Employee Name</label>
                  <CFormInput
                    type="text"
                    className="form-control"
                    value={formData.employee_name}
                    readOnly
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Employee ID</label>
                  <CFormInput
                    type="text"
                    className="form-control"
                    value={formData.employee}
                    readOnly
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Posting Date</label>
                  <CFormInput
                    type="date"
                    name="posting_date"
                    className="form-control"
                    value={formData.posting_date}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label">Company</label>
                  <CFormInput
                    type="text"
                    className="form-control"
                    value={formData.company}
                    readOnly
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Department</label>
                  {/* <CFormSelect
                    type="hidden"
                    name="department"
                    className="form-control"
                    value={formData.department}
                    onChange={handleFormChange}
                    required
                  >
                    <option selected value="Project - TPL">
                      Project
                    </option>
                  </CFormSelect> */}
                  <CFormInput
                    type="hidden"
                    name="department"
                    className="form-control"
                    value={formData.department}
                    onChange={handleFormChange}
                    required
                    placeholder="Enter department"
                  />
                  <CFormSelect
                    name="department_of_visit"
                    className="form-control"
                    value={formData.department_of_visit}
                    onChange={handleFormChange}
                    required
                  >
                    <option selected value="">
                      Select Department of Visit
                    </option>
                    <option value="project">Project</option>
                    <option value="service">Service</option>
                  </CFormSelect>
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Cost Center</label>
                  <CFormSelect
                    name="cost_center"
                    className="form-control"
                    value={formData.cost_center}
                    onChange={handleFormChange}
                    required
                  >
                    <option selected value="Main - TPL">
                      Main
                    </option>
                    {/* <option value="Project - TPL">Project</option>
                    <option value="Administration - TPL">Administration</option> */}
                  </CFormSelect>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Expense Approver Email</label>
                  <CFormInput
                    type="email"
                    name="expense_approver"
                    className="form-control"
                    value={formData.expense_approver}
                    onChange={handleFormChange}
                    required
                    placeholder="Enter approver's email"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Company GSTIN</label>
                  <CFormInput
                    type="text"
                    name="company_gstin"
                    className="form-control"
                    value={formData.company_gstin}
                    onChange={handleFormChange}
                    placeholder="Optional"
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* Expense Items Section */}
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0">Expense Items</h4>
                <button
                  type="button"
                  onClick={addExpenseItem}
                  className="btn btn-sm btn-primary"
                >
                  <GrAddCircle className="me-1" /> Add Item
                </button>
              </div>

              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead className="table-light">
                    <tr>
                      <th>Date</th>
                      <th style={{ minWidth: "150px" }}>Type</th>
                      <th style={{ minWidth: "200px" }}>Description</th>
                      <th style={{ minWidth: "150px" }}>Amount (₹)</th>
                      <th style={{ minWidth: "150px" }}>Bill Attachment</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenseItems.map((item, index) => {
                      // 🔍 Check for duplicates: is this expense_type already used for this date in another row?
                      const isDuplicate = expenseItems.some(
                        (itm, idx) =>
                          idx !== index &&
                          itm.expense_date === item.expense_date &&
                          itm.expense_type === item.expense_type &&
                          item.expense_type !== ""
                      );

                      return (
                        <React.Fragment key={index}>
                          <tr>
                            <td>
                              <CFormInput
                                type="date"
                                className="form-control form-control-sm"
                                value={item.expense_date}
                                onChange={(e) =>
                                  handleExpenseItemChange(
                                    index,
                                    "expense_date",
                                    e.target.value
                                  )
                                }
                                required
                              />
                            </td>
                            <td>
                              <select
                                className="form-control form-control-sm"
                                value={item.expense_type}
                                onChange={(e) =>
                                  handleExpenseItemChange(
                                    index,
                                    "expense_type",
                                    e.target.value
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
                                        itm.expense_type === type
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
                                  }
                                )}
                              </select>
                            </td>
                            <td>
                              <textarea
                                className="form-control form-control-sm"
                                rows={2}
                                value={item.description}
                                onChange={(e) =>
                                  handleExpenseItemChange(
                                    index,
                                    "description",
                                    e.target.value
                                  )
                                }
                                required
                              />
                            </td>
                            <td>
                              <CFormInput
                                type="number"
                                className="form-control form-control-sm"
                                min="0"
                                step="0.01"
                                value={item.amount}
                                onChange={(e) =>
                                  handleExpenseItemChange(
                                    index,
                                    "amount",
                                    e.target.value
                                  )
                                }
                                required
                              />
                            </td>
                            <td>
                              <CFormInput
                                type="file"
                                className="form-control form-control-sm"
                                onChange={(e) =>
                                  handleExpenseItemChange(
                                    index,
                                    "file",
                                    e.target.files[0]
                                  )
                                }
                              />
                            </td>
                            <td className="text-center">
                              <CButton
                                type="button"
                                onClick={() => removeExpenseItem(index)}
                                className="btn btn-sm btn-danger"
                                disabled={expenseItems.length <= 1}
                                title="Remove Item"
                              >
                                <MdDeleteOutline />
                              </CButton>
                            </td>
                          </tr>

                          {/* 🔴 Show warning if duplicate found */}
                          {isDuplicate && (
                            <tr>
                              <td colSpan="5">
                                <div className="text-danger small mt-1">
                                  <strong>{item.expense_type}</strong> already
                                  selected for{" "}
                                  <strong>{item.expense_date}</strong>. Please
                                  choose a different type.
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

            <div className="mb-4">
              <div className="row justify-content-end">
                <div className="col-md-4 col-sm-6 col-12">
                  <div className="card">
                    <div className="card-header">
                      <h6 className="mb-0">Expense Summary</h6>
                    </div>
                    <div className="card-body py-2">
                      <div className="d-flex justify-content-between mb-2">
                        <strong className="small">Total Claimed:</strong>
                        <span className="small">
                          ₹{calculateTotals().total_claimed_amount.toFixed(2)}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between fw-bold small">
                        <span>Grand Total:</span>
                        <span className="text-success">
                          ₹{calculateTotals().grand_total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="d-flex justify-content-end border-top pt-3">
              <CButton
                type="submit"
                color="primary"
                size="sm"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <LoadingSpinner /> Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </CButton>
            </div>
          </CForm>
        </div>
      </div>
    </div>
  );
};

export default CreateExpense;
