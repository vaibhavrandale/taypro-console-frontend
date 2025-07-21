import React, { useReducer, useState } from "react";
import {
  CCard,
  CCardHeader,
  CCardBody,
  CForm,
  CFormInput,
  CFormSelect,
  CButton,
  CRow,
  CCol,
  CSpinner,
} from "@coreui/react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import CIcon from "@coreui/icons-react";
import { cilMinus } from "@coreui/icons";

const initialState = {
  serviceItems: [],
  loading: false,
  submitting: false,
  error: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, serviceItems: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "SUBMIT_REQUEST":
      return { ...state, submitting: true };
    case "SUBMIT_SUCCESS":
      return { ...state, submitting: false };
    case "SUBMIT_FAIL":
      return { ...state, submitting: false, error: action.payload };
    default:
      return state;
  }
};

const AddFaultAnalysisChecklist = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [state, dispatch] = useReducer(reducer, initialState);
  const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);
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

  const [formData, setFormData] = useState({
    item_id: id || "",
    checklist_fields: [
      { field_name: "", input_type: "text", input_options: [] },
    ],
  });

  const handleFieldChange = (index, key, value) => {
    const updated = [...formData.checklist_fields];
    updated[index][key] = value;
    if (key === "input_type" && value !== "select") {
      updated[index].input_options = [];
    }
    setFormData({ ...formData, checklist_fields: updated });
  };

  const handleAddField = () => {
    setFormData({
      ...formData,
      checklist_fields: [
        ...formData.checklist_fields,
        { field_name: "", input_type: "text", input_options: [] },
      ],
    });
  };

  const deleteRow = (index) => {
    const updatedFields = formData.checklist_fields.filter(
      (_, i) => i !== index
    );
    setFormData({ ...formData, checklist_fields: updatedFields });
  };

  const handleOptionChange = (index, optionsStr) => {
    handleFieldChange(index, "input_options", optionsStr); // Save raw string
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "SUBMIT_REQUEST" });
    try {
      await axios.post("/api/v1/faultanalysis", formData, {
        headers: { Authorization: `Bearer ${authtoken}` },
      });
      dispatch({ type: "SUBMIT_SUCCESS" });
      toast.success("Checklist created successfully");
      navigate(`/${adminroute}/fault-analysis-checklist`);
    } catch (error) {
      dispatch({ type: "SUBMIT_FAIL", payload: error.message });
      toast.error("Error creating checklist");
    }
  };

  return (
    <CCard className="shadow-sm">
      <CCardHeader>Add Fault Analysis Checklist</CCardHeader>
      <CCardBody>
        <CForm onSubmit={handleSubmit}>
          {formData.checklist_fields.map((field, index) => (
            <CRow className="mb-3" key={index}>
              <CCol md={3}>
                <CFormInput
                  label="Field Name"
                  value={field.field_name}
                  onChange={(e) =>
                    handleFieldChange(index, "field_name", e.target.value)
                  }
                  required
                />
              </CCol>
              <CCol md={3}>
                <CFormSelect
                  label="Input Type"
                  value={field.input_type}
                  onChange={(e) =>
                    handleFieldChange(index, "input_type", e.target.value)
                  }
                >
                  <option value="text">Text</option>
                  <option value="select">Select</option>
                  <option value="checkbox">Checkbox</option>
                </CFormSelect>
              </CCol>
              {field.input_type !== "select" && (
                <>
                  <CCol
                    md={2}
                    className="d-flex align-items-center justify-content-start"
                  >
                    <div className="mt-4">
                      <CButton
                        className="ms-2"
                        color="danger"
                        size="sm"
                        onClick={() => deleteRow(index)}
                        style={{
                          borderRadius: "50%",
                          width: "30px",
                          height: "30px",
                          padding: "0",
                        }}
                      >
                        <CIcon
                          icon={cilMinus}
                          size="sm"
                          style={{ fontWeight: "bold" }}
                        />
                      </CButton>
                    </div>
                  </CCol>
                </>
              )}
              {field.input_type === "select" && (
                <>
                  <CCol md={4}>
                    <CFormInput
                      label="Input Options (comma separated)"
                      value={field.input_options || ""}
                      onChange={(e) =>
                        handleOptionChange(index, e.target.value)
                      }
                    />
                  </CCol>
                  <CCol
                    md={2}
                    className="d-flex align-items-center justify-content-start"
                  >
                    <div className="mt-4">
                      <CButton
                        className="ms-2"
                        color="danger"
                        size="sm"
                        onClick={() => deleteRow(index)}
                        style={{
                          borderRadius: "50%",
                          width: "30px",
                          height: "30px",
                          padding: "0",
                        }}
                      >
                        <CIcon
                          icon={cilMinus}
                          size="sm"
                          style={{ fontWeight: "bold" }}
                        />
                      </CButton>
                    </div>
                  </CCol>
                </>
              )}
            </CRow>
          ))}

          <CButton color="info" onClick={handleAddField} className="mb-3">
            + Add Checklist Field
          </CButton>

          <div className="d-flex justify-content-end">
            <CButton type="submit" color="primary" disabled={state.submitting}>
              {state.submitting ? <CSpinner size="sm" /> : "Create Checklist"}
            </CButton>
          </div>
        </CForm>
      </CCardBody>
    </CCard>
  );
};

export default AddFaultAnalysisChecklist;
