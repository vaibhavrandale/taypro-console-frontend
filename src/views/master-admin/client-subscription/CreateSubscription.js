import React, { useState, useEffect, useReducer } from "react";
import { CForm, CFormSelect, CButton, CCol, CRow } from "@coreui/react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import { clientSubscriptionPlans } from "../../../data.js";
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
  const [{ loading, error, clients, loadingClient, clientError }, dispatch] =
    useReducer(reducer, {
      loading: false,
      error: "",
      clients: [],
      loadingClient: false,
      clientError: "",
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
    plan_id: "basic",
    frequency: "monthly",
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
          error.response?.data?.error || error.response?.data?.message
        );
      }
    };
    clients();
  }, [authtoken]);

  const plan = clientSubscriptionPlans.find(
    (p) => p.plan_id === formData.plan_id
  );
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
      (client) => client.client_id === selectedClients
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
        }
      );
      dispatch({ type: "CREATE_SUCCESS" });
      toast.success(response.data.message);
      setFormData({
        client_id: "",
        client_name: "",
        client_logo: "",
        plan_id: "basic",
        frequency: "monthly",
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

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Create Subscription</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <CForm onSubmit={handleSubmit}>
        <CRow className="mb-3">
          <CCol md={6}>
            {loadingClient ? (
              <LoadingSpinner />
            ) : clientError ? (
              <div className="text-red-500 mb-4">{clientError}</div>
            ) : clients?.length > 0 ? (
              <CFormSelect
                name="client_id"
                value={client_id}
                onChange={handleSiteNameChange}
              >
                <option value="">Select Client</option>
                {clients.map((item) => (
                  <option key={item.client_id} value={item.client_id}>
                    {item.client_id}
                  </option>
                ))}
              </CFormSelect>
            ) : (
              <p>No Clients Found</p>
            )}
          </CCol>
          <CCol md={6}>
            <CFormSelect
              name="plan_id"
              value={formData.plan_id}
              onChange={handleChange}
            >
              {clientSubscriptionPlans.map((plan) => (
                <option key={plan.plan_id} value={plan.plan_id}>
                  {plan.name}
                </option>
              ))}
            </CFormSelect>
          </CCol>
        </CRow>

        <CRow className="mb-3">
          <CCol md={6}>
            <CFormSelect
              name="frequency"
              value={formData.frequency}
              onChange={handleChange}
              disabled={formData.plan_id === "free_trial"}
            >
              {clientSubscriptionPlans
                .find((p) => p.plan_id === formData.plan_id)
                ?.frequency.map((freq) => (
                  <option key={freq} value={freq}>
                    {freq}
                  </option>
                ))}
            </CFormSelect>
          </CCol>
        </CRow>
        <div className="d-flex justify-content-end">
          <CButton type="submit" size="sm" color="primary" disabled={loading}>
            {loading ? "Creating..." : "Create Subscription"}
          </CButton>
        </div>
      </CForm>
    </div>
  );
};

export default CreateSubscription;
