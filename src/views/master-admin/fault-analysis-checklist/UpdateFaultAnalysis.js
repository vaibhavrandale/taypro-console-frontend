import React, { useReducer, useEffect, useState } from "react";
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

const initialState = {
  loading: false,
  submitting: false,
  error: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false };
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

const UpdateFaultAnalysisChecklist = () => {
  const { id } = useParams(); // this is item_id
  const [formData, setFormData] = useState({
    item_id: id,
    checklist_fields: [],
  });

  const [checklistId, setChecklistId] = useState(null);
  const [state, dispatch] = useReducer(reducer, initialState);
  const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChecklist = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const { data } = await axios.get(`/api/v1/faultanalysis/${id}`, {
          headers: { Authorization: `Bearer ${authtoken}` },
        });
        const checklist = data.data[0]; // get first match
        setChecklistId(checklist._id);
        setFormData({
          item_id: checklist.component._id,
          checklist_fields: checklist.checklist_fields,
        });
        dispatch({ type: "FETCH_SUCCESS" });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: error.message });
        toast.error("Error fetching checklist");
      }
    };

    fetchChecklist();
  }, [id, authtoken]);

  const handleFieldChange = (index, key, value) => {
    const updated = [...formData.checklist_fields];
    updated[index][key] = value;
    if (key === "input_type" && value !== "select") {
      updated[index].input_options = [];
    }
    setFormData({ ...formData, checklist_fields: updated });
  };

  const handleOptionChange = (index, optionsStr) => {
    const options = optionsStr.split(",").map((opt) => opt.trim());
    handleFieldChange(index, "input_options", options);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "SUBMIT_REQUEST" });
    try {
      await axios.put(
        `/api/v1/faultanalysis/${checklistId}`,
        { checklist_fields: formData.checklist_fields },
        {
          headers: { Authorization: `Bearer ${authtoken}` },
        }
      );
      dispatch({ type: "SUBMIT_SUCCESS" });
      toast.success("Checklist updated successfully");
      navigate(`/${adminroute}/fault-analysis-checklist`);
    } catch (error) {
      dispatch({ type: "SUBMIT_FAIL", payload: error.message });
      toast.error("Error updating checklist");
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

  return (
    <CCard className="shadow-sm">
      <CCardHeader>Update Fault Analysis Checklist</CCardHeader>
      <CCardBody>
        {state.loading ? (
          <div className="text-center">
            <CSpinner />
          </div>
        ) : (
          <CForm onSubmit={handleSubmit}>
            {formData.checklist_fields.map((field, index) => (
              <CRow className="mb-3" key={index}>
                <CCol md={4}>
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
                {field.input_type === "select" && (
                  <CCol md={5}>
                    <CFormInput
                      label="Input Options (comma separated)"
                      value={field.input_options?.join(", ") || ""}
                      onChange={(e) =>
                        handleOptionChange(index, e.target.value)
                      }
                    />
                  </CCol>
                )}
              </CRow>
            ))}

            <CButton color="info" onClick={handleAddField} className="mb-3">
              + Add Checklist Field
            </CButton>

            <div className="d-flex justify-content-end">
              <CButton
                type="submit"
                color="primary"
                disabled={state.submitting}
              >
                {state.submitting ? <CSpinner size="sm" /> : "Update Checklist"}
              </CButton>
            </div>
          </CForm>
        )}
      </CCardBody>
    </CCard>
  );
};

export default UpdateFaultAnalysisChecklist;
