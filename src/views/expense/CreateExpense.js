import React, { useReducer, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MdDeleteOutline } from "react-icons/md";
import { GrAddCircle } from "react-icons/gr";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../components/LoadingSpinner";
import { CButton, CForm, CFormInput, CFormSelect } from "@coreui/react";

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
      return { ...state, uploadLoading: false };
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
    employee: userInfo.employee_id || "HR-EMP-00042",
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
    const updatedItems = [...expenseItems];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };

    // Set default account based on expense type
    if (field === "expense_type") {
      updatedItems[index].default_account = getDefaultAccount(value);
    }

    // Auto-set sanctioned amount equal to amount when amount changes
    if (field === "amount") {
      updatedItems[index].sanctioned_amount = value;
    }

    setExpenseItems(updatedItems);
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
      (sum, item) => sum + parseFloat(item.amount || 0),
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

  // const submitExpenseClaim = async (e) => {
  //   e.preventDefault();

  //   const validationErrors = validateForm();
  //   if (validationErrors.length > 0) {
  //     toast.error(`Missing required fields: ${validationErrors.join(", ")}`);
  //     return;
  //   }

  //   try {
  //     dispatch({ type: "CREATE_REQUEST" });

  //     const payload = {
  //       ...formData,
  //       expenses: expenseItems,
  //       ...calculateTotals(), // Should return {total_claimed_amount, total_sanctioned_amount}
  //       approval_status: "Draft",
  //       status: "Draft",
  //       workflow_state: "Draft",
  //       console_status: "Draft",
  //       is_paid: false,
  //       taxes: [],
  //       advances: [],
  //       last_activity: [
  //         {
  //           name: userInfo.username,
  //           email: userInfo.email,
  //           profile_image: userInfo.profile_image,
  //           timestamp: new Date().toISOString(),
  //           userId: userInfo._id,
  //           details: `New Expense Claim was created by <span class='text-primary'>${userInfo.username}</span>.`,
  //         },
  //       ],
  //     };

  //     const { data } = await axios.post("/api/v1/expenseclaims", payload, {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${authtoken}`,
  //       },
  //     });
  //     console.log(data);

  //     dispatch({ type: "CREATE_SUCCESS" });
  //     toast.success("Expense claim created successfully");

  //     navigate(`/${adminroute}/expenses`);
  //   } catch (error) {
  //     dispatch({ type: "CREATE_FAIL", payload: error.message });
  //     toast.error(error.response?.data?.message || error.message);
  //   }
  // };

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
                  <CFormSelect
                    name="department"
                    className="form-control"
                    value={formData.department}
                    onChange={handleFormChange}
                    required
                  >
                    {/* <option value="">Select Department</option> */}
                    <option selected value="Project - TPL">
                      Project
                    </option>
                    {/* <option value="HR - TPL">HR</option> */}
                    {/* <option value="Finance - TPL">Finance</option> */}
                    {/* <option value="Operations - TPL">Operations</option> */}
                  </CFormSelect>
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Cost Center</label>
                  <se
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
                  </se>
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
                      <th>Type</th>
                      <th>Description</th>
                      <th>Amount (₹)</th>
                      {/* <th>Bill Attachment</th> */}
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenseItems.map((item, index) => (
                      <tr key={index}>
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
                            <option value="Food">Food</option>
                            <option value="Travel">Travel</option>
                            {/* <option value="Stay">Stay</option> */}
                            <option value="Medical">Medical</option>
                            <option value="Others">Other</option>
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
                        {/* <td>
                          {item.bill_attachment ? (
                            <a
                              href={item.bill_attachment}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-sm btn-outline-success w-100"
                            >
                              <MdAttachFile /> View Bill
                            </a>
                          ) : (
                            <div className="position-relative">
                              <CFormInput
                                type="file"
                                id={`file-upload-${index}`}
                                onChange={(e) =>
                                  handleFileUpload(e.target.files[0], index)
                                }
                                className="d-none"
                                accept="image/*,.pdf"
                              />
                              <label
                                htmlFor={`file-upload-${index}`}
                                className="btn btn-sm btn-outline-primary w-100"
                              >
                                {uploadLoading ? (
                                  "Uploading..."
                                ) : (
                                  <>
                                    <MdAttachFile /> Upload Bill
                                  </>
                                )}
                              </label>
                            </div>
                          )}
                        </td> */}
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
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals Section */}
            {/* Totals Section */}
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
