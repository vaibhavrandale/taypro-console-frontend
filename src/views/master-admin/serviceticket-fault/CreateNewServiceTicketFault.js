import axios from "axios";
import React, { useReducer } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CRow,
} from "@coreui/react";

const reducer = (state, action) => {
  switch (action.type) {
    case "SUBMIT_REQUEST":
      return { ...state, loading: true, success: false };
    case "SUBMIT_SUCCESS":
      return { ...state, loading: false, success: true };
    case "SET_FIELD":
      return {
        ...state,
        faultData: {
          ...state.faultData,
          [action.name]: action.value,
        },
      };
    case "SUBMIT_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false,
      };

    default:
      return state;
  }
};

const CreateNewServiceTicketFault = () => {
  const authtoken = useSelector((state) => state.authtoken);
  const navigate = useNavigate();

  const [state, dispatch] = useReducer(reducer, {
    faultData: {
      fault_name: "",
      target_days: "",
    },
    loading: false,
    success: false,

    error: "",
  });

  const userInfo = useSelector((state) => state.userInfo);
  let adminroute = "";

  if (userInfo.role === "Master Admin") {
    adminroute = "master-admin";
  } else if (userInfo.role === "Service Admin") {
    adminroute = "service-admin";
  } else if (userInfo.role === "Project Admin") {
    adminroute = "project-admin";
  }

  const handleChange = (e) => {
    dispatch({
      type: "SET_FIELD",
      name: e.target.name,
      value: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "SUBMIT_REQUEST" });

    const newData = {
      ...state.faultData,
      target_days: Number(state.faultData.target_days), // ensure it's numeric
    };
    try {
      await axios.post("/api/v1/serviceticketsfaults", newData, {
        headers: { Authorization: `Bearer ${authtoken}` },
      });
      toast.success("Service Ticket Fault Added Successfully!");
      dispatch({ type: "SUBMIT_SUCCESS" });
      navigate(
        `/${adminroute}/serviceticket-fault/service-tickets-fault-dashboard`
      );
    } catch (error) {
      dispatch({
        type: "SUBMIT_FAIL",
        payload: error.response?.data?.error || error.response?.data?.message,
      });

      toast.error(error.response.data.error || error.response?.data?.message);
    }
  };

  return (
    <div className="container mt-6">
      <CCard>
        <CCardHeader>
          <h2>Add Service Ticket Fault</h2>
        </CCardHeader>
        <CCardBody>
          <CForm className="space-y-4">
            <CRow>
              <CCol md="6">
                <div className="mb-3">
                  <label className="form-label">Fault Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="fault_name"
                    value={state.faultData.fault_name || ""}
                    onChange={handleChange}
                    placeholder="Enter Fault Name"
                    required
                  />
                </div>
              </CCol>
              <CCol md="6">
                <div className="mb-3">
                  <label className="form-label">Target Days</label>
                  <input
                    type="number"
                    className="form-control"
                    name="target_days"
                    value={state.faultData.target_days || ""}
                    onChange={handleChange}
                    placeholder="Enter Target Days"
                    min="0"
                  />
                </div>
              </CCol>
            </CRow>

            <CRow className="mb-3"></CRow>

            <Link onClick={handleSubmit} className="btn btn-warning btn-sm">
              {state.loading ? (
                <>
                  Creating...
                  <LoadingSpinner />
                </>
              ) : (
                "Add Service Ticket Fault"
              )}
            </Link>
          </CForm>
        </CCardBody>
      </CCard>
    </div>
  );
};
export default CreateNewServiceTicketFault;
