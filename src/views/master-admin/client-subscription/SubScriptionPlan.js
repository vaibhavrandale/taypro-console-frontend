import React, { useEffect, useReducer, useState } from "react";
import axios from "axios";

import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CSpinner,
  CBadge,
  CListGroup,
  CListGroupItem,
  CAlert,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CFormTextarea,
  CFormSelect,
  CFormCheck,
} from "@coreui/react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import toast from "react-hot-toast";
import {
  AlertTriangle,
  BarChart2,
  BatteryFull,
  BotMessageSquare,
  Building,
  ClipboardList,
  CloudRain,
  Cpu,
  MapPin,
  Megaphone,
  MessageCircle,
  ServerCog,
  ShieldCheck,
  SquarePen,
  Users,
  Users2,
  WifiOff,
} from "lucide-react";
import { useSelector } from "react-redux";

/* ===========================
   REDUCER
=========================== */
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_PLANS_REQUEST":
      return { ...state, loading: true, error: "" };

    case "FETCH_PLANS_SUCCESS":
      return {
        ...state,
        loading: false,
        plans: action.payload,
      };

    case "FETCH_PLANS_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case "CREATE_PLAN_REQUEST":
      return { ...state, creating: true, error: "" };

    case "CREATE_PLAN_SUCCESS":
      return {
        ...state,
        creating: false,
        plans: [action.payload, ...state.plans],
      };

    case "CREATE_PLAN_FAIL":
      return { ...state, creating: false, error: action.payload };

    case "UPDATE_PLAN_REQUEST":
      return { ...state, updateLoading: true };

    case "UPDATE_PLAN_SUCCESS":
      return {
        ...state,
        updateLoading: false,
        plans: state.plans.map((p) =>
          p._id === action.payload._id ? action.payload : p,
        ),
      };

    case "UPDATE_PLAN_FAIL":
      return { ...state, updateLoading: false, updateError: action.payload };

    default:
      return state;
  }
};

const SubScriptionPlan = () => {
  const [
    { loading, error, plans, creating, updateLoading, updateError },
    dispatch,
  ] = useReducer(reducer, {
    loading: false,
    error: "",
    plans: [],
    creating: false,
    updateLoading: false,
    updateError: "",
  });
  // const authtoken = useSelector((state) => state.authtoken);
  const [visible, setVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [formData, setFormData] = useState({
    plan_id: "",
    name: "",
    description: "",
    price: "",
    currency: "INR",
    frequency: [], // ✅ EMPTY ARRAY
    features: [],
    serviceTier: "Basic",
    trialDuration: 0,
  });

  const [featureInput, setFeatureInput] = useState("");
  /* ===========================
     FETCH DATA
  =========================== */
  useEffect(() => {
    const fetchPlans = async () => {
      dispatch({ type: "FETCH_PLANS_REQUEST" });

      try {
        const data = await axios.get("/api/v1/subscription-plans", {
          // headers: {
          //   Authorization: `Bearer ${authtoken}`,
          // },
          withCredentials: true,
        });
        console.log(data.data.data);
        dispatch({
          type: "FETCH_PLANS_SUCCESS",
          payload: data.data.data,
        });
      } catch (err) {
        dispatch({
          type: "FETCH_PLANS_FAIL",
          payload: err.response?.data?.error || err.response?.data?.message,
        });
      }
    };

    fetchPlans();
  }, []);

  const handleCreatePlan = async (e) => {
    e.preventDefault();

    dispatch({ type: "CREATE_PLAN_REQUEST" });
    if (formData.frequency.length === 0) {
      alert("Please select at least one frequency option");
      return;
    }
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        trialDuration: Number(formData.trialDuration),
      };

      const { data } = await axios.post("/api/v1/subscription-plans", payload);

      dispatch({
        type: "CREATE_PLAN_SUCCESS",
        payload: data.data,
      });

      setVisible(false);
      setFormData({
        plan_id: "",
        name: "",
        description: "",
        price: "",
        currency: "INR",
        frequency: [],
        features: [],
        serviceTier: "Basic",
        trialDuration: 0,
      });
      toast.success(data.message);
    } catch (err) {
      dispatch({
        type: "CREATE_PLAN_FAIL",
        payload: err.response?.data?.error || err.response?.data?.message,
      });
      toast.error(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to create plan",
      );
    }
  };

  const handleAddFeature = () => {
    if (!featureInput.trim()) return;

    if (formData.features.includes(featureInput.trim())) return;

    setFormData({
      ...formData,
      features: [...formData.features, featureInput.trim()],
    });

    setFeatureInput("");
  };

  const handleRemoveFeature = (feature) => {
    setFormData({
      ...formData,
      features: formData.features.filter((f) => f !== feature),
    });
  };

  const handleFrequencyChange = (value) => {
    setFormData((prev) => {
      const exists = prev.frequency.includes(value);

      return {
        ...prev,
        frequency: exists
          ? prev.frequency.filter((f) => f !== value)
          : [...prev.frequency, value],
      };
    });
  };

  const featureIcons = {
    "Robot Operating": <Cpu size={16} className="me-2 text-warning" />,
    "Battery Status": <BatteryFull size={16} className="me-2 text-warning" />,
    "Cleaning Log": <ClipboardList size={16} className="me-2 text-warning" />,
    "Site Management": <Building size={16} className="me-2 text-warning" />,
    "Only 3 Users": <Users size={16} className="me-2 text-warning" />,
    "Statistics/Reports": <BarChart2 size={16} className="me-2 text-warning" />,
    "Preventive Maintenance": (
      <ShieldCheck size={16} className="me-2 text-warning" />
    ),
    "Live Chat": <MessageCircle size={16} className="me-2 text-warning" />,
    "Multiple Users": <Users2 size={16} className="me-2 text-warning" />,
    // "Multiple Alerts": <AlertCircle size={16} className="me-2 text-warning" />,
    "Robot Failure Alert": (
      <AlertTriangle size={16} className="me-2 text-warning" />
    ),
    "Robot Offline Alert": <WifiOff size={16} className="me-2 text-warning" />,
    "Robot Position Tracking": (
      <MapPin size={16} className="me-2 text-warning" />
    ),
    "Major Breakdown": (
      <AlertTriangle size={16} className="me-2 text-warning" />
    ),
    "Grass Cutting Alert": (
      <ClipboardList size={16} className="me-2 text-warning" />
    ),
    "Forecast Weather Alert": (
      <CloudRain size={16} className="me-2 text-warning" />
    ),
    "Weather Model": <CloudRain size={16} className="me-2 text-warning" />,
    "Multiple Alerts": <Megaphone size={16} className="me-2 text-warning" />,

    "Scada Integration": <ServerCog size={16} className="me-2 text-warning" />,
    "AI Chat": <BotMessageSquare size={16} className="me-2 text-warning" />,
  };

  //   const allFeatures = [
  //     "Robot Operating",
  //     "Battery Status",
  //     "Robot Pos. Tracking",
  //     "Cleaning Log",
  //     "Site Management",
  //     // "Only 3 Users",
  //     "Statistics/Reports",
  //     "Prev. Maintenance",
  //     "Live Chat",
  //     "Multiple Users",
  //     // "Multiple Alerts",
  //     "Robot Failure Alert",
  //     "Robot Offline Alert",
  //     "Major Breakdown",
  //     "Grass Cutting Alert",
  //     "Forecast Weather Alert",
  //     "Scada Integration",
  //   ];

  const allFeaturesSet = new Set();
  plans &&
    plans.forEach((plan) => {
      plan.features.forEach((feature) => allFeaturesSet.add(feature));
    });
  const allFeatures = [...allFeaturesSet].sort((a, b) => a.localeCompare(b));
  const handleEditPlan = (plan) => {
    setEditingPlanId(plan._id);

    setFormData({
      plan_id: plan.plan_id,
      name: plan.name,
      description: plan.description,
      price: plan.price,
      currency: plan.currency,
      frequency: plan.frequency,
      features: plan.features,
      serviceTier: plan.serviceTier,
      trialDuration: plan.trialDuration,
    });

    setEditVisible(true);
  };
  const handleUpdatePlan = async (e) => {
    e.preventDefault();

    dispatch({ type: "UPDATE_PLAN_REQUEST" });

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        trialDuration: Number(formData.trialDuration),
      };

      const { data } = await axios.put(
        `/api/v1/subscription-plans/${editingPlanId}`,
        payload,
        {
          // headers: {
          //   Authorization: `Bearer ${authtoken}`,
          // },
        },
      );

      dispatch({
        type: "UPDATE_PLAN_SUCCESS",
        payload: data.data,
      });

      setEditVisible(false);
      toast.success(data.message);
    } catch (err) {
      dispatch({
        type: "UPDATE_PLAN_FAIL",
        payload: err.response?.data?.error || err.message,
      });

      toast.error(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to update plan",
      );
    }
  };
  return (
    <>
      <div className="d-flex justify-content-end mb-3">
        <CButton size="sm" color="success" onClick={() => setVisible(true)}>
          + Create Plan
        </CButton>
      </div>

      <CRow className="mt-4">
        {loading ? (
          <CCol md={4} className="mb-4">
            <LoadingSpinner />
          </CCol>
        ) : error ? (
          <CCol md={12}>
            <CAlert color="danger" className="mt-4 text-center">
              {error}
            </CAlert>
          </CCol>
        ) : plans.length > 0 ? (
          <>
            {/* PLAN CARDS */}
            {plans.map((plan) => (
              <CCol md={4} className="mb-4" key={plan._id}>
                <CCard className="h-100 shadow-sm rounded-0 border border-primary">
                  <CCardHeader className="text-center bg-light position-relative">
                    <h5 className="mb-0">{plan.name}</h5>

                    <CBadge
                      color={
                        plan.serviceTier === "Basic"
                          ? "secondary"
                          : plan.serviceTier === "Premium"
                            ? "warning"
                            : "success"
                      }
                      className="mt-2"
                    >
                      {plan.serviceTier}
                    </CBadge>
                    <div className="position-absolute top-0 end-0 m-1 cursor-pointer">
                      <CBadge
                        size="sm"
                        color="warning"
                        onClick={() => handleEditPlan(plan)}
                        className="d-flex justify-content-center align-items-center "
                      >
                        <SquarePen size={16} />
                      </CBadge>
                    </div>
                  </CCardHeader>

                  <CCardBody>
                    <h4 className="text-center mb-3">
                      ₹{plan.price}
                      {plan.frequency.includes("monthly") && " / month"}
                    </h4>

                    <p className="text-muted text-center">{plan.description}</p>

                    <CListGroup className="mt-3">
                      {[...plan.features]
                        .sort((a, b) => a.localeCompare(b))
                        .map((feature, index) => (
                          <CListGroupItem
                            key={index}
                            className="d-flex align-items-center bg-transparent rounded-0"
                          >
                            {featureIcons[feature] || (
                              <ShieldCheck
                                size={16}
                                className="me-2 text-success"
                              />
                            )}
                            {feature}
                          </CListGroupItem>
                        ))}
                    </CListGroup>

                    {plan.frequency.includes("trial") && (
                      <div className="text-center mt-3">
                        <CBadge color="info">
                          {plan.trialDuration} Days Free Trial
                        </CBadge>
                      </div>
                    )}
                  </CCardBody>
                </CCard>
              </CCol>
            ))}

            {/* COMPARISON TABLE */}
            <CCol xs={12} className="mt-4">
              <h4 className="text-center my-3">Compare Plan Features</h4>

              <CRow className="mx-3  border-bottom fw-bold py-2 text-center">
                <CCol xs={4} className="text-start">
                  Feature
                </CCol>

                {plans.map((plan) => (
                  <CCol key={plan.plan_id}>{plan.name}</CCol>
                ))}
              </CRow>

              {[...allFeatures].map((feature) => (
                <CRow
                  key={feature}
                  className="my-2 py-2 mx-3 align-items-center border-bottom"
                >
                  <CCol
                    xs={4}
                    md={4}
                    className="text-start"
                    style={{ fontSize: "14px" }}
                  >
                    {featureIcons[feature] || "📌"} {feature}
                  </CCol>

                  {plans.map((plan) => (
                    <CCol key={plan.plan_id} className="text-center">
                      {plan.features.includes(feature) ? (
                        <span className="text-success">✔</span>
                      ) : (
                        <span className="text-danger">✖</span>
                      )}
                    </CCol>
                  ))}
                </CRow>
              ))}
            </CCol>
          </>
        ) : (
          <CCol md={12}>
            <CAlert color="info" className="mt-4 text-center">
              No subscription plans available.
            </CAlert>
          </CCol>
        )}
      </CRow>

      {/* ================= Modal ================= */}
      <CModal
        visible={visible}
        onClose={() => setVisible(false)}
        size="lg"
        backdrop="static"
        scrollable
      >
        <CModalHeader>
          <CModalTitle>Create Subscription Plan</CModalTitle>
        </CModalHeader>

        <CModalBody>
          <CForm onSubmit={handleCreatePlan}>
            <CFormInput
              label="Plan ID"
              value={formData.plan_id}
              onChange={(e) =>
                setFormData({ ...formData, plan_id: e.target.value })
              }
              required
            />

            <CFormInput
              label="Plan Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />

            <CFormTextarea
              label="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />

            <CFormInput
              type="number"
              label="Price"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              required
            />
            <div className="mt-3">
              <label className="form-label">Features</label>

              <div className="d-flex gap-2 justify-content-center align-items-center">
                <CFormInput
                  placeholder="Enter feature"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                />
                <CButton
                  size="sm"
                  type="button"
                  color="primary"
                  onClick={handleAddFeature}
                >
                  Add
                </CButton>
              </div>

              <div className="mt-3 d-flex flex-wrap gap-2">
                {formData.features.map((feature, index) => (
                  <CBadge
                    key={index}
                    color="info"
                    className="p-2"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleRemoveFeature(feature)}
                  >
                    {feature} ✕
                  </CBadge>
                ))}
              </div>
            </div>

            <CFormSelect
              label="Service Tier"
              value={formData.serviceTier}
              onChange={(e) =>
                setFormData({ ...formData, serviceTier: e.target.value })
              }
            >
              <option value="Basic">Basic</option>
              <option value="Premium">Premium</option>
              <option value="Enterprise">Enterprise</option>
            </CFormSelect>

            <CFormInput
              label="Trial Duration (Days)"
              type="number"
              value={formData.trialDuration}
              onChange={(e) =>
                setFormData({ ...formData, trialDuration: e.target.value })
              }
            />
            <div className="mt-3">
              <label className="form-label">Frequency</label>

              <CFormCheck
                label="Monthly"
                checked={formData.frequency.includes("monthly")}
                onChange={() => handleFrequencyChange("monthly")}
              />

              <CFormCheck
                label="Yearly"
                checked={formData.frequency.includes("yearly")}
                onChange={() => handleFrequencyChange("yearly")}
              />

              <CFormCheck
                label="Trial"
                checked={formData.frequency.includes("trial")}
                onChange={() => handleFrequencyChange("trial")}
              />
            </div>

            <CModalFooter>
              <CButton
                size="sm"
                color="secondary"
                onClick={() => setVisible(false)}
              >
                Cancel
              </CButton>

              <CButton
                size="sm"
                color="primary"
                type="submit"
                disabled={creating}
              >
                {creating ? <CSpinner size="sm" /> : "Create Plan"}
              </CButton>
            </CModalFooter>
          </CForm>
        </CModalBody>
      </CModal>

      {/* ================== Edit Modal ================= */}
      <CModal
        visible={editVisible}
        onClose={() => setEditVisible(false)}
        size="lg"
        backdrop="static"
        scrollable
      >
        <CModalHeader>
          <CModalTitle>
            Update <CBadge color="primary"> {formData.plan_id}</CBadge>{" "}
            Subscription Plan
          </CModalTitle>
        </CModalHeader>

        <CModalBody>
          <CForm onSubmit={handleUpdatePlan}>
            <CRow>
              <CCol md={6}>
                <CFormInput label="Plan ID" value={formData.plan_id} disabled />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  label="Plan Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </CCol>
              <CCol md={6}>
                {" "}
                <CFormTextarea
                  label="Description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  type="number"
                  label="Price"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />
              </CCol>
              <CCol md={12}>
                {" "}
                <div className="my-3">
                  <label className="form-label">Features</label>

                  <div className="d-flex gap-2 justify-content-center align-items-center">
                    <CFormInput
                      placeholder="Enter feature"
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                    />
                    <CButton
                      size="sm"
                      type="button"
                      color="primary"
                      onClick={handleAddFeature}
                    >
                      Add
                    </CButton>
                  </div>

                  <div className="mt-3 d-flex flex-wrap gap-2">
                    {formData.features.map((feature, index) => (
                      <CBadge
                        key={index}
                        color="info"
                        className="p-2"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleRemoveFeature(feature)}
                      >
                        {feature} ✕
                      </CBadge>
                    ))}
                  </div>
                </div>
              </CCol>
              <CCol md={6}>
                {" "}
                <CFormSelect
                  label="Service Tier"
                  value={formData.serviceTier}
                  onChange={(e) =>
                    setFormData({ ...formData, serviceTier: e.target.value })
                  }
                >
                  <option value="Basic">Basic</option>
                  <option value="Premium">Premium</option>
                  <option value="Enterprise">Enterprise</option>
                </CFormSelect>
              </CCol>
              <CCol md={6}>
                {" "}
                <CFormInput
                  label="Trial Duration"
                  type="number"
                  value={formData.trialDuration}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      trialDuration: e.target.value,
                    })
                  }
                />
              </CCol>
              <CCol md={6}>
                {" "}
                <div className="my-3">
                  <label className="form-label">Frequency</label>

                  <div className="d-flex justify-content-between align-items-center">
                    <CFormCheck
                      label="Monthly"
                      checked={formData.frequency.includes("monthly")}
                      onChange={() => handleFrequencyChange("monthly")}
                    />

                    <CFormCheck
                      label="Yearly"
                      checked={formData.frequency.includes("yearly")}
                      onChange={() => handleFrequencyChange("yearly")}
                    />

                    <CFormCheck
                      label="Trial"
                      checked={formData.frequency.includes("trial")}
                      onChange={() => handleFrequencyChange("trial")}
                    />
                  </div>
                </div>
              </CCol>
            </CRow>

            <CModalFooter>
              <CButton
                size="sm"
                color="secondary"
                onClick={() => setEditVisible(false)}
              >
                Cancel
              </CButton>

              <CButton size="sm" color="warning" type="submit">
                {updateLoading ? "Updating..." : "Update Plan"}
              </CButton>
            </CModalFooter>
          </CForm>
        </CModalBody>
      </CModal>
      {/* ================== Edit Modal ================= */}
    </>
  );
};

export default SubScriptionPlan;
