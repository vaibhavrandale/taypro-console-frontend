import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import React, { useReducer, useEffect } from "react";
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
    case "SET_SITES":
      return {
        ...state,
        sites: action.payload,
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
      gateway_simnumber: "",
      gateway_id_in_lns_server: "",
      gateway_name_in_lns_server: "",
    },
    loading: false,
    success: false,
    error: "",
    sites: [],
  });
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
  }

  const handleChange = (e) => {
    dispatch({
      type: "SET_FIELD",
      name: e.target.name,
      value: e.target.value,
    });
  };

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const { data } = await axios.get("/api/v1/sites", {
          headers: { Authorization: `Bearer ${authtoken}` },
        });

        dispatch({ type: "SET_SITES", payload: data.data });
      } catch (err) {
        toast.error("Failed to load sites");
      }
    };

    fetchSites();
  }, [authtoken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "SUBMIT_REQUEST" });
    try {
      await axios.post("/api/v1/gateways", state.gatewayData, {
        headers: { Authorization: `Bearer ${authtoken}` },
      });
      toast.success("Gateway Created Successfully!");
      dispatch({ type: "SUBMIT_SUCCESS" });
      navigate(`/${adminroute}/all-site-gateways`);
    } catch (error) {
      dispatch({
        type: "SUBMIT_FAIL",
        payload: error.response?.data?.error || "Error creating gateway",
      });
      toast.error(error.response?.data?.error || "Error creating gateway");
    }
  };

  const { gatewayData } = state;

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
                  <CFormSelect
                    name="site_id"
                    value={gatewayData.site_id}
                    onChange={handleChange}
                    label="Site ID"
                    required
                    className="mb-3"
                  >
                    <option value="">Select a Site ID</option>
                    {state.sites.map((site) => (
                      <option key={site.site_id} value={site.site_id}>
                        {site.site_id}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>

                {/* Gateway Type */}
                <CCol md={6}>
                  <CFormSelect
                    name="gateway_type"
                    value={gatewayData.gateway_type}
                    onChange={handleChange}
                    label="Gateway Type"
                    required
                    className="mb-3"
                  >
                    <option value="">Select Gateway Type</option>
                    <option value="Indoor">Indoor</option>
                    <option value="Outdoor">Outdoor</option>
                  </CFormSelect>
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
