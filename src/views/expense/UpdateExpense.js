import axios from "axios";
import React, { useState, useEffect, useReducer } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../components/LoadingSpinner";

import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormCheck,
  CFormInput,
  CFormSelect,
} from "@coreui/react";
import { GrAddCircle } from "react-icons/gr";
import { MdDeleteOutline } from "react-icons/md";
import CIcon from "@coreui/icons-react";
import { cilCloudDownload, cilPaperclip } from "@coreui/icons";
// import { formatDate } from "date-fns";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, expense: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "UPDATE_REQUEST":
      return { ...state, updateloading: true };
    case "UPDATE_SUCCESS":
      return { ...state, updateloading: false };
    case "UPDATE_FAIL":
      return { ...state, updateloading: false, error: action.payload };
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

const UpdateExpense = () => {
  const [{ loading, error, updateloading, expense, uploadLoading }, dispatch] =
    useReducer(reducer, {
      loading: true,
      expense: {},
      error: "",
      updateloading: false,
      uploadLoading: false,
    });

  const { id } = useParams(); // expense claim ID from URL
  // const authtoken = useSelector((state) => state.authtoken);
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.userInfo);
  // const isTechnician = userInfo?.role === "Site Technician";

  // Expense items
  const [expenseItems, setExpenseItems] = useState([
    {
      expense_date: "",
      cost_center: "Main - TAYPRO",
      expense_type: "",
      description: "",
      amount: 0,
      sanctioned_amount: 0,
      default_account: "",
      file: "",
    },
  ]);
  const [formData, setFormData] = useState({
    company: "",
    naming_series: "",
    name: "",
    posting_date: "",
    cost_center: "",
    payable_account: "",
    department: "",
    expense_approver: "",
    company_gstin: "",
    employee: "",
    employee_name: "",
  });

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

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });

        const { data } = await axios.get(`/api/v1/expenseclaims/${id}`, {
          // headers: { Authorization: `Bearer ${authtoken}` },
          withCredentials: true,
        });

        dispatch({ type: "FETCH_SUCCESS", payload: data.data });
        setFormData(data.data);

        setExpenseItems(data.data.expenses || []);

        if (
          userInfo.role === "Site Technician" &&
          data.data.can_technician_edit === false
        ) {
          navigate(`/${adminroute}/expenses`);
          toast.error("You cannot edit this expense contact to admin");
        }
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: error.response?.data.message || error.response?.data?.error,
        });
        toast.error(
          error.response?.data.message || error.response?.data?.error,
        );
      }
    };

    fetchExpense();
  }, [id, userInfo.role, navigate, adminroute]);

  const handleFormChange = (e) => {
    // const { name, value } = e.target;
    const { name, type, checked, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const updatedExpenseClaim = async (e) => {
    e.preventDefault();

    try {
      dispatch({ type: "UPDATE_REQUEST" });
      const totals = calculateTotals();

      const { createdAt, _id, last_activity, ...restFormData } = formData;
      if (userInfo.role === "Site Technician") {
        restFormData.can_technician_edit = false; // Technician uses up their one-time access
      }

      const payload = {
        ...restFormData,
        expenses: expenseItems,
        total_claimed_amount: totals.total_claimed_amount,
        grand_total: totals.grand_total,
      };

      const result = await axios.put(`/api/v1/expenseclaims/${id}`, payload, {
        // headers: { Authorization: `Bearer ${authtoken}` },
        withCredentials: true,
      });

      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success(result.data.message);
      navigate(`/${adminroute}/expenses`);
    } catch (error) {
      dispatch({
        type: "UPDATE_FAIL",
        payload: error.response?.data.message || error.response?.data?.error,
      });
      toast.error(error.response?.data.message || error.response?.data?.error);
    }
  };

  // const handleExpenseItemChange = (index, field, value) => {
  //   const updatedItems = [...expenseItems];
  //   updatedItems[index] = {
  //     ...updatedItems[index],
  //     [field]: value,
  //   };

  //   // Set default account based on expense type
  //   if (field === "expense_type") {
  //     updatedItems[index].default_account = getDefaultAccount(value);
  //   }

  //   // Auto-set sanctioned amount equal to amount when amount changes
  //   if (field === "amount") {
  //     updatedItems[index].sanctioned_amount = value;
  //   }

  //   setExpenseItems(updatedItems);
  // };

  const handleExpenseItemChange = async (index, field, value) => {
    const updatedItems = [...expenseItems];

    if (field === "file" && value) {
      try {
        dispatch({ type: "UPLOAD_REQUEST" });

        const formData = new FormData();
        formData.append("file", value);

        const { data } = await axios.post(
          "/api/v1/image-upload/expense-claim",
          formData,
        );

        updatedItems[index][field] = data.url; // Save the uploaded file URL

        dispatch({ type: "UPLOAD_SUCCESS" });
        toast.success("File uploaded");
      } catch (error) {
        dispatch({
          type: "UPLOAD_FAIL",
          payload: error.response.data.error || error.response.data.message,
        });
        toast.error(error.response.data.error || error.response.data.message);
      }
    } else {
      updatedItems[index][field] = value;

      // Auto-set default account
      if (field === "expense_type") {
        updatedItems[index].default_account = getDefaultAccount(value);
      }

      // Auto-set sanctioned amount equal to amount
      if (field === "amount") {
        updatedItems[index].sanctioned_amount = value;
      }
    }

    setExpenseItems(updatedItems);
  };

  const getDefaultAccount = (expenseType) => {
    switch (expenseType) {
      case "Food":
        return "Material Cost For Accessories - TAYPRO";
      case "Travel":
        return "RaaS Site Travel & Lodging - TAYPRO";
      case "Stay":
        return "RaaS Site Travel & Lodging - TAYPRO";
      case "Communication":
        return "Miscellaneous Office Expenses - TAYPRO";
      case "Office":
        return "Miscellaneous Office Expenses - TAYPRO";
      default:
        return "Miscellaneous Office Expenses - TAYPRO";
    }
  };

  const addExpenseItem = () => {
    setExpenseItems([
      ...expenseItems,
      {
        expense_date: new Date().toISOString().split("T")[0], // ✅ correct format

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
      0,
    );
    return {
      total_claimed_amount: parseFloat(totalClaimed.toFixed(2)),
      total_sanctioned_amount: parseFloat(totalClaimed.toFixed(2)), // Initially same as claimed
      grand_total: parseFloat(totalClaimed.toFixed(2)),
    };
  };

  return (
    <div className="container mt-4">
      <CCard>
        <CCardHeader>
          Update Expense Claim - <b className="badge bg-success">{id}</b>
        </CCardHeader>
        {loading ? (
          <div className="d-flex mt-2 justify-content-center align-items-center">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <CAlert color="danger">{error}</CAlert>
        ) : (
          <CCardBody>
            <CForm onSubmit={updatedExpenseClaim}>
              {/* Basic Information Section */}
              <div className="mb-4">
                <h4 className="border-bottom pb-2">Basic Information</h4>
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
                      value={
                        formData.posting_date
                          ? new Date(formData.posting_date)
                              .toISOString()
                              .split("T")[0]
                          : ""
                      }
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
                      <option value="Projects - TAYPRO">Project</option>
                      <option value="Field Service - TAYPRO">Service</option>
                      {/* <option value="HR - TAYPRO">HR</option> */}
                      {/* <option value="Finance - TAYPRO">Finance</option> */}
                      {/* <option value="Operations - TAYPRO">Operations</option> */}
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
                      <option value="Main - TAYPRO">Main</option>
                      {/* <option value="Project - TAYPRO">Project</option>
                             <option value="Administration - TAYPRO">Administration</option> */}
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
                      value={formData.expense_approver || "abhay.singh@taypro.in"}
                      readOnly
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label"> GSTIN</label>
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
                            item.expense_type !== "",
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
                                      e.target.value,
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
                                      e.target.value,
                                    )
                                  }
                                  required
                                >
                                  <option value="">Select Type</option>
                                  {["Food", "Travel", "Medical", "Others"].map(
                                    (type) => {
                                      const isAlreadySelected =
                                        expenseItems.some(
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
                              <td>
                                <textarea
                                  className="form-control form-control-sm"
                                  rows={2}
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
                              <td>
                                <CFormInput
                                  type="number"
                                  className="form-control form-control-sm"
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
                              <td className="text-center">
                                <span className="d-flex align-items-center  justify-content-center">
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
                                  )}{" "}
                                  &nbsp; &nbsp;
                                  <CFormInput
                                    type="file"
                                    className="form-control form-control-sm w-50"
                                    onChange={(e) =>
                                      handleExpenseItemChange(
                                        index,
                                        "file",
                                        e.target.files[0],
                                      )
                                    }
                                  />
                                  {uploadLoading ? <LoadingSpinner /> : ""}
                                </span>
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

              {userInfo.role === "Site Technician" ? (
                ""
              ) : (
                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    Enable to edit technitian
                  </label>
                  <CFormCheck
                    type="checkbox"
                    name="can_technician_edit"
                    className="form-control"
                    checked={formData.can_technician_edit || false}
                    onChange={handleFormChange}
                  />
                </div>
              )}
              {/* Form Actions */}
              <div className="d-flex justify-content-end border-top pt-3">
                <CButton
                  className="btn btn-primary btn-sm m-1"
                  type="submit"
                  color="primary"
                  disabled={updateloading}
                >
                  {updateloading ? (
                    <>
                      Updating...
                      <LoadingSpinner />
                    </>
                  ) : (
                    "Update"
                  )}
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        )}
      </CCard>
    </div>
  );
};

export default UpdateExpense;
