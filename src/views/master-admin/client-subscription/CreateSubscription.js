import React, { useState, useEffect, useReducer } from "react";
import {
  CForm,
  CFormSelect,
  CButton,
  CCol,
  CRow,
  CBadge,
  CFormInput,
  CInputGroup,
  CAlert,
} from "@coreui/react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
// import { subplans } from "../../../data.js";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../../components/LoadingSpinner.js";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_CLIENTS_REQUEST":
      return { ...state, loadingClient: true, clientError: "" };
    case "FETCH_CLIENTS_SUCCESS":
      return {
        ...state,
        loadingClient: false,
        clients: action.payload,
      };
    case "FETCH_CLIENTS_FAIL":
      return { ...state, loadingClient: false, clientError: action.payload };

    case "FETCH_SUB_PLANS_REQUEST":
      return { ...state, loadingSubPlans: true, subPlansError: "" };
    case "FETCH_SUB_PLANS_SUCCESS":
      return {
        ...state,
        loadingSubPlans: false,
        subPlans: action.payload,
      };
    case "FETCH_SUB_PLANS_FAIL":
      return {
        ...state,
        loadingSubPlans: false,
        subPlansError: action.payload,
      };

    case "CREATE_REQUEST":
      return { ...state, loading: true, error: "" };
    case "CREATE_SUCCESS":
      return { ...state, loading: false };
    case "CREATE_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const CreateSubscription = () => {
  const [
    {
      loading,
      error,
      clients,
      loadingClient,
      clientError,
      loadingSubPlans,
      subPlansError,
      subPlans,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: false,
    error: "",
    clients: [],
    loadingClient: false,
    clientError: "",
    loadingSubPlans: false,
    subPlansError: "",
    subPlans: [],
  });
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
  }

  const [formData, setFormData] = useState({
    plan_id: "",
    frequency: "",
    amount: 0,
    customAmount: false,
  });
  const [client_id, setClientId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const clients = async () => {
      dispatch({ type: "FETCH_CLIENTS_REQUEST" });
      try {
        const result = await axios.get(`/api/v1/clients/get-all-clients`, {
          headers: { Authorization: `Bearer ${authtoken}` },
        });
        dispatch({
          type: "FETCH_CLIENTS_SUCCESS",
          payload: result.data.data,
        });
      } catch (error) {
        dispatch({
          type: "FETCH_CLIENTS_FAIL",
          payload: error.response?.data?.error || error.response?.data?.message,
        });
        toast.error(
          error.response?.data?.error || error.response?.data?.message,
        );
      }
    };
    clients();

    const subscriptionPlans = async () => {
      dispatch({ type: "FETCH_SUB_PLANS_REQUEST" });
      try {
        const result = await axios.get(`/api/v1/subscription-plans`, {
          headers: { Authorization: `Bearer ${authtoken}` },
        });
        dispatch({
          type: "FETCH_SUB_PLANS_SUCCESS",
          payload: result.data.data,
        });
      } catch (error) {
        dispatch({
          type: "FETCH_SUB_PLANS_FAIL",
          payload: error.response?.data?.error || error.response?.data?.message,
        });
        toast.error(
          error.response?.data?.error || error.response?.data?.message,
        );
      }
    };
    subscriptionPlans();
  }, [authtoken]);

  const plan =
    subPlans &&
    subPlans.length > 0 &&
    subPlans.find((p) => p.plan_id === formData.plan_id);
  if (plan && !plan.frequency.includes(formData.frequency)) {
    setFormData((prev) => ({ ...prev, frequency: plan.frequency[0] }));
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSiteNameChange = (e) => {
    dispatch({ type: "SELECT_CLIENT_REQUEST" });

    const selectedClients = e.target.value;

    const selectedClient = clients.find(
      (client) => client.client_id === selectedClients,
    );

    if (selectedClient) {
      setClientId(selectedClient.client_id);

      dispatch({
        type: "SELECT_CLIENT_SUCCESS",
        payload: selectedClient.client_id,
      });
    } else {
      dispatch({ type: "SELECT_CLIENT_FAIL" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const subscriptionData = {
      ...formData,
      client_object_id: null,
      client_id: client_id,
    };

    dispatch({ type: "CREATE_REQUEST" });

    try {
      const response = await axios.post(
        "/api/v1/client-subscription",
        subscriptionData,
        {
          headers: { Authorization: `Bearer ${authtoken}` },
        },
      );
      dispatch({ type: "CREATE_SUCCESS" });
      toast.success(response.data.message);
      setFormData({
        client_id: "",
        client_name: "",
        client_logo: "",
        plan_id: "",
        frequency: "",
        amount: 0,
        customAmount: false,
      });
      navigate(`/${adminroute}/client-subscriptions`);
    } catch (error) {
      dispatch({
        type: "CREATE_FAIL",
        payload: error.response?.data?.message || error.response?.data?.error,
      });
      toast.error(error.response?.data?.message || error.response?.data?.error);
    }
  };

  const selectedPlan = subPlans.find((p) => p.plan_id === formData.plan_id);

  useEffect(() => {
    if (!selectedPlan) return;

    const calculatedAmount =
      formData.frequency === "monthly"
        ? selectedPlan.price
        : selectedPlan.price * 12;

    setFormData((prev) => {
      // If user already entered custom amount, don't override
      if (prev.customAmount) return prev;

      return {
        ...prev,
        amount: calculatedAmount || 0,
      };
    });
  }, [formData.plan_id, formData.frequency]);
  return (
    <div className="shadow-lg rounded-3">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
        <h4 className="text-2xl  m-0">Create Subscription</h4>
      </div>

      {/* Error Alerts */}
      {(clientError || error) && (
        <div className="mb-3">
          <CBadge color="danger" className="p-2 ">
            {clientError || error}
          </CBadge>
        </div>
      )}

      <CForm onSubmit={handleSubmit}>
        <CRow className="g-4">
          <CCol md={6}>
            {/* Select Client */}
            {loadingClient || loadingSubPlans ? (
              <LoadingSpinner />
            ) : clientError ? (
              <div className="text-danger fw-semibold">{clientError}</div>
            ) : clients?.length > 0 ? (
              <CFormSelect
                label={<span className="fw-semibold">Select Client</span>}
                name="client_id"
                value={client_id}
                onChange={handleSiteNameChange}
                className="rounded-2 shadow-sm"
              >
                <option value="" disabled hidden>
                  -- Select Client --
                </option>
                {clients.map((item) => (
                  <option key={item._id} value={item.client_id}>
                    {item.client_id}
                  </option>
                ))}
              </CFormSelect>
            ) : (
              <p className="text-muted">No Clients Found</p>
            )}
          </CCol>

          {subPlansError ? (
            <CCol md={6}>
              <CAlert color="danger">{subPlansError}</CAlert>
            </CCol>
          ) : (
            subPlans &&
            subPlans.length > 0 && (
              <>
                <CCol md={6}>
                  {/* Select Plan */}
                  <CFormSelect
                    label={<span className="fw-semibold">Select Plan</span>}
                    name="plan_id"
                    value={formData.plan_id}
                    onChange={handleChange}
                    className="rounded-2 shadow-sm"
                  >
                    <option value="" disabled hidden>
                      -- Select Plan --
                    </option>
                    {subPlans.map((plan) => (
                      <option key={plan.plan_id} value={plan.plan_id}>
                        {plan.name}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>

                <CCol md={6}>
                  {/* Select Frequency */}
                  <CFormSelect
                    label={
                      <span className="fw-semibold">Select Frequency</span>
                    }
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleChange}
                    disabled={formData.plan_id === "free_trial"}
                    className="rounded-2 shadow-sm"
                  >
                    <option value="" disabled hidden>
                      -- Select Frequency --
                    </option>
                    {subPlans
                      .find((p) => p.plan_id === formData.plan_id)
                      ?.frequency.map((freq) => (
                        <option key={freq} value={freq}>
                          {freq}
                        </option>
                      ))}
                  </CFormSelect>
                </CCol>

                <CCol md={6}>
                  <CCol md={6}>
                    <CFormInput
                      type="number"
                      label={<span className="fw-semibold">Amount</span>}
                      name="amount"
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          amount: Number(e.target.value),
                          customAmount: true, // 🔥 prevents auto overwrite
                        }))
                      }
                      disabled={formData.plan_id === "free_trial"}
                      className="rounded-2 shadow-sm"
                    />
                  </CCol>
                </CCol>
              </>
            )
          )}
          {/* Submit Button */}
          <CCol xs={12} className="d-flex justify-content-end">
            <CButton
              type="submit"
              color="primary"
              size="sm"
              className="px-4 fw-semibold shadow-sm"
              disabled={loading}
            >
              {loading ? (
                <span className="d-flex align-items-center">
                  <LoadingSpinner />
                  <span className="ms-2">Creating...</span>
                </span>
              ) : (
                "Create Subscription"
              )}
            </CButton>
          </CCol>
        </CRow>
      </CForm>
    </div>
  );
};

export default CreateSubscription;
