import axios from "axios";
import React, { useReducer } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";

import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormSelect,
  CRow,
} from "@coreui/react";

const reducer = (state, action) => {
  switch (action.type) {
    case "SUBMIT_REQUEST":
      return { ...state, loading: true, success: false };
    case "SUBMIT_SUCCESS":
      return { ...state, loading: false, success: true };
    case "SUBMIT_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false,
      };
    case "SET_FIELD":
      return {
        ...state,
        gatewayData: { ...state.gatewayData, [action.name]: action.value },
      };
    default:
      return state;
  }
};

const CreateGateway = () => {
  const authtoken = useSelector((state) => state.authtoken);
  const navigate = useNavigate();

  const [state, dispatch] = useReducer(reducer, {
    gatewayData: {
      gateway_id: "",
      gateway_name: "",
      site_id: "",
      gateway_type: "",
      gateway_lattitude: "",
      gateway_longitude: "",
      last_uplink: "",
    },
    loading: false,
    success: false,
    error: "",
  });

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
    console.log(state.gatewayData);
    try {
      await axios.post("/api/v1/gateways", state.gatewayData, {
        headers: { Authorization: `Bearer ${authtoken}` },
      });
      toast.success("Gateway Created Successfully!");
      dispatch({ type: "SUBMIT_SUCCESS" });
      navigate("/master-admin/all-site-gateways");
    } catch (error) {
      dispatch({
        type: "SUBMIT_FAIL",
        payload: error.response?.data?.error || "Error creating gateway",
      });
      toast.error(error.response?.data?.error || "Error creating gateway");
    }
  };

  const { gatewayData, loading } = state;

  return (
    <CRow className="justify-content-center mt-2">
      <CCol md={12}>
        <CCard className="shadow">
          <CCardHeader>
            <h4>Create New Gateway</h4>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              <CRow>
                {/* Gateway ID */}
                <CCol md={6}>
                  <CFormInput
                    type="text"
                    name="gateway_id"
                    value={gatewayData.gateway_id}
                    onChange={handleChange}
                    label="Gateway ID"
                    required
                    className="mb-3"
                  />
                </CCol>
                {/* Gateway Name */}
                <CCol md={6}>
                  <CFormInput
                    type="text"
                    name="gateway_name"
                    value={gatewayData.gateway_name}
                    onChange={handleChange}
                    label="Gateway Name"
                    required
                    className="mb-3"
                  />
                </CCol>
                {/* Site ID */}
                <CCol md={6}>
                  <CFormInput
                    type="text"
                    name="site_id"
                    value={gatewayData.site_id}
                    onChange={handleChange}
                    label="Site ID"
                    required
                    className="mb-3"
                  />
                </CCol>
                {/* Gateway Type */}
                <CCol md={6}>
                  <CFormInput
                    type="text"
                    name="gateway_type"
                    value={gatewayData.gateway_type}
                    onChange={handleChange}
                    label="Gateway Type"
                    required
                    className="mb-3"
                  />
                </CCol>
                {/* Latitude */}
                <CCol md={6}>
                  <CFormInput
                    type="text"
                    name="gateway_lattitude"
                    value={gatewayData.gateway_lattitude}
                    onChange={handleChange}
                    label="Latitude"
                    className="mb-3"
                  />
                </CCol>
                {/* Longitude */}
                <CCol md={6}>
                  <CFormInput
                    type="text"
                    name="gateway_longitude"
                    value={gatewayData.gateway_longitude}
                    onChange={handleChange}
                    label="Longitude"
                    className="mb-3"
                  />
                </CCol>
                {/* SIM Number */}
                <CCol md={6}>
                  <CFormInput
                    type="text"
                    name="gateway_simnumber"
                    value={gatewayData.gateway_simnumber}
                    onChange={handleChange}
                    label="SIM Number"
                    className="mb-3"
                  />
                </CCol>
                {/* LNS Server ID */}
                <CCol md={6}>
                  <CFormInput
                    type="text"
                    name="gateway_id_in_lns_server"
                    value={gatewayData.gateway_id_in_lns_server}
                    onChange={handleChange}
                    label="Gateway ID in LNS Server"
                    required
                    className="mb-3"
                  />
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    type="text"
                    name="gateway_name_in_lns_server"
                    value={gatewayData.gateway_name_in_lns_server}
                    onChange={handleChange}
                    label="Gateway Name in LNS Server"
                    required
                    className="mb-3"
                  />
                </CCol>
                {/* LNS Server Name */}
                <CCol md={12} className="text-end">
                  <CButton
                    type="submit"
                    color="warning"
                    size="sm"
                    disabled={state.loading}
                  >
                    {state.loading ? (
                      <>
                        Creating...
                        <LoadingSpinner />
                      </>
                    ) : (
                      "Create Gateway"
                    )}
                  </CButton>
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default CreateGateway;
