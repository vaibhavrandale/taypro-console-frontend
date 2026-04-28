import {
  CBadge,
  CButton,
  CCol,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CRow,
} from "@coreui/react";
import axios from "axios";
import React, { useReducer, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "ADD_DAY_SUCCESS":
      return {
        ...state,
        loading: false,
      };

    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
const AddDayInCycle = () => {
  const [{ loading, error }, dispatch] = useReducer(reducer, {
    loading: false,
    error: "",
  });
  const navigate = useNavigate();
  // const authtoken = useSelector((state) => state.authtoken);
  const { moduleId, cycleId } = useParams();
  const [formData, setFormData] = useState({
    is_cleaning_done: false,
    is_sunday: false,
    is_pm: false,
    is_labour_absent: false,
    is_other: false,
    remarks: "",
    modules_cleaned_for_day: 0,
  });

  const handleAddDay = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "FETCH_REQUEST" });
      const response = await axios.put(
        `/api/v1/opex/${moduleId}/cycle/${cycleId}/addday`,
        formData,
        {
          // headers: { Authorization: `Bearer ${authtoken}`  }
          withCredentials: true,
        },
      );
      console.log(response.data);

      dispatch({
        type: "ADD_DAY_SUCCESS",
        payload: response.data,
      });

      toast.success(response.data.message);
      navigate(-1);
    } catch (error) {
      dispatch({
        type: "FETCH_FAIL",
        payload: error.response?.data.error || error.response?.data.message,
      });
      toast.error(error.response?.data.error || error.response?.data.message);
    }
  };

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
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
  } else if (userInfo.role === "Opex Client Admin") {
    adminroute = "opex-client-admin";
  } else if (userInfo.role === "Opex Site Technician") {
    adminroute = "opex-site-technician";
  }
  return (
    <div>
      <CForm onSubmit={handleAddDay}>
        <CRow className="mb-3">
          <CCol>
            <h6>Status Flags</h6>
            <CRow>
              <CCol md={4}>
                <CFormCheck
                  type="checkbox"
                  id="is_cleaning_done"
                  label="Cleaning Done"
                  name="is_cleaning_done"
                  checked={formData.is_cleaning_done}
                  onChange={handleChange}
                />
              </CCol>
              <CCol md={4}>
                <CFormCheck
                  type="checkbox"
                  id="is_sunday"
                  label="Sunday"
                  name="is_sunday"
                  checked={formData.is_sunday}
                  onChange={handleChange}
                />
              </CCol>
              <CCol md={4}>
                <CFormCheck
                  type="checkbox"
                  id="is_pm"
                  label="PM Scheduled"
                  name="is_pm"
                  checked={formData.is_pm}
                  onChange={handleChange}
                />
              </CCol>
            </CRow>
            <CRow className="mt-2">
              <CCol md={4}>
                <CFormCheck
                  type="checkbox"
                  id="is_labour_absent"
                  label="Labour Absent"
                  name="is_labour_absent"
                  checked={formData.is_labour_absent}
                  onChange={handleChange}
                />
              </CCol>
              <CCol md={4}>
                <CFormCheck
                  type="checkbox"
                  id="is_other"
                  label="Other Reason"
                  name="is_other"
                  checked={formData.is_other}
                  onChange={handleChange}
                />
              </CCol>
            </CRow>
          </CCol>
        </CRow>

        {formData.is_cleaning_done && (
          <CRow className="mb-3">
            <CCol>
              <CFormLabel>
                Modules Cleaned Today{" "}
                <span className="text-muted">
                  (Once you enterd value this cannot be change later)
                </span>
              </CFormLabel>
              <CFormInput
                type="text"
                id="modules_cleaned_for_day"
                name="modules_cleaned_for_day"
                value={formData.modules_cleaned_for_day}
                onChange={handleChange}
                min="0"
                required={formData.is_cleaning_done}
                style={{ maxWidth: "200px" }}
              />
            </CCol>
          </CRow>
        )}

        <CRow className="mb-3">
          <CCol md={6}>
            <CFormTextarea
              id="remarks"
              label="Remarks"
              name="remarks"
              rows={4}
              value={formData.remarks}
              onChange={handleChange}
              placeholder="Enter any remarks or notes here"
            />
          </CCol>
        </CRow>

        <CRow className="mb-3">
          <CCol>
            <CButton
              type="submit"
              color="btn btn primary btn-sm"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify Day"}
            </CButton>
            {error ? <CBadge color="danger">{error}</CBadge> : ""}
          </CCol>
        </CRow>
      </CForm>
    </div>
  );
};

export default AddDayInCycle;
