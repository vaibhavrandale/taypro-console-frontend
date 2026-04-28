import React, { useState, useEffect, useReducer } from "react";
import {
  CForm,
  CFormInput,
  CFormSelect,
  CButton,
  CCol,
  CRow,
} from "@coreui/react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import { subPlans } from "../../../data.js";
import { useNavigate, useParams } from "react-router-dom";

const reducer = (state, action) => {
  switch (action.type) {
    case "CREATE_REQUEST":
      return { ...state, loading: true, error: "" };
    case "CREATE_SUCCESS":
      return { ...state, loading: false };
    case "CREATE_FAIL":
      return { ...state, loading: false, error: action.payload };

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
    default:
      return state;
  }
};

const RenewSubscription = () => {
  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    error: "",
    loadingSubPlans: false,
    subPlansError: "",
    subPlans: [],
  });
  const { client_id } = useParams();
  const { loading, error, loadingSubPlans, subPlansError, subPlans } = state;

  // const authtoken = useSelector((state) => state.authtoken);
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

  // const [formData, setFormData] = useState({
  //   client_id: "",
  //   amount: 0,
  //   plan_id: "basic",
  //   frequency: "monthly",
  // });

  const [formData, setFormData] = useState({
    plan_id: "",
    frequency: "",
    amount: 0,
    customAmount: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const subscriptionPlans = async () => {
      dispatch({ type: "FETCH_SUB_PLANS_REQUEST" });
      try {
        const result = await axios.get(`/api/v1/subscription-plans`, {
          // headers: { Authorization: `Bearer ${authtoken}` },
          withCredentials: true,
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
  }, []);

  useEffect(() => {
    const plan = subPlans.find((p) => p.plan_id === formData.plan_id);
    if (plan && !plan.frequency.includes(formData.frequency)) {
      setFormData((prev) => ({ ...prev, frequency: plan.frequency[0] }));
    }
  }, [formData.plan_id, formData.frequency]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const subscriptionData = {
      ...formData,
      client_object_id: null,
    };

    dispatch({ type: "CREATE_REQUEST" });

    try {
      const response = await axios.put(
        `/api/v1/client-subscription/renew-subscription/${client_id}`,
        subscriptionData,
        {
          // headers: { Authorization: `Bearer ${authtoken}` },
          withCredentials: true,
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

  const selectedPlan =
    subPlans && subPlans.find((p) => p.plan_id === formData.plan_id);
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
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Renew Subscription</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <CForm onSubmit={handleSubmit}>
        <CRow className="mb-3">
          <CCol md={3}>
            <CFormInput
              label={<span className="fw-semibold">client Id</span>}
              type="text"
              name="client_id"
              value={client_id}
              onChange={handleChange}
              placeholder="Client ID"
              required
            />
          </CCol>
          <CCol md={3}>
            <CFormSelect
              name="plan_id"
              label={<span className="fw-semibold">Plan</span>}
              value={formData.plan_id}
              onChange={handleChange}
            >
              {subPlans.map((plan) => (
                <option key={plan.plan_id} value={plan.plan_id}>
                  {plan.name}
                </option>
              ))}
            </CFormSelect>
          </CCol>
        </CRow>

        <CRow className="mb-3">
          <CCol md={3}>
            <CFormSelect
              label={<span className="fw-semibold">Frequency</span>}
              name="frequency"
              value={formData.frequency}
              onChange={handleChange}
              disabled={formData.plan_id === "Free"}
            >
              {subPlans
                .find((p) => p.plan_id === formData.plan_id)
                ?.frequency.map((freq) => (
                  <option key={freq} value={freq}>
                    {freq}
                  </option>
                ))}
            </CFormSelect>
          </CCol>
          <CCol md={3}>
            <CCol md={3}>
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
        </CRow>
        <div className="d-flex justify-content-end">
          <CButton type="submit" size="sm" color="primary" disabled={loading}>
            {loading ? "Updating..." : "Renew Subscription"}
          </CButton>
        </div>
      </CForm>
    </div>
  );
};

export default RenewSubscription;
