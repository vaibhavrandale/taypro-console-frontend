import { CCard, CCardBody, CCardHeader, CCol, CRow } from "@coreui/react";
import React, { useState } from "react";
import {
  Cpu,
  BatteryFull,
  ClipboardList,
  Building,
  Users,
  BarChart2,
  ShieldCheck,
  MessageCircle,
  AlertCircle,
  WifiOff,
  AlertTriangle,
  CloudRain,
  Brain,
  ServerCog,
  Users2,
} from "lucide-react";

const featureIcons = {
  "Robot Operating": <Cpu size={16} className="me-2 text-warning" />,
  "Battery Status": <BatteryFull size={16} className="me-2 text-warning" />,
  "Cleaning Log": <ClipboardList size={16} className="me-2 text-warning" />,
  "Site Management": <Building size={16} className="me-2 text-warning" />,
  "Only 3 Users": <Users size={16} className="me-2 text-warning" />,
  "Statistics/Reports": <BarChart2 size={16} className="me-2 text-warning" />,
  "Prev. Maintenance": <ShieldCheck size={16} className="me-2 text-warning" />,
  "Live Chat": <MessageCircle size={16} className="me-2 text-warning" />,
  "Multiple Users": <Users2 size={16} className="me-2 text-warning" />,
  "Multiple Alerts": <AlertCircle size={16} className="me-2 text-warning" />,
  "Robot Failure Alert": (
    <AlertTriangle size={16} className="me-2 text-warning" />
  ),
  "Robot Offline Alert": <WifiOff size={16} className="me-2 text-warning" />,
  "Major Breakdown": <AlertTriangle size={16} className="me-2 text-warning" />,
  "Grass Cutting Alert": (
    <ClipboardList size={16} className="me-2 text-warning" />
  ),
  "Forecast Weather Alert": (
    <CloudRain size={16} className="me-2 text-warning" />
  ),

  "Scada Integration": <ServerCog size={16} className="me-2 text-warning" />,
};

const plans = [
  {
    plan_id: "basic",
    name: "Basic Plan",
    description: "Essential features for basic robot operation and monitoring.",
    price: 1000,
    features: [
      "Robot Operating",
      "Battery Status",
      "Cleaning Log",
      "Site Management",
      "Only 3 Users",
    ],
  },
  {
    plan_id: "premium",
    name: "Premium Plan",
    description:
      "Advanced features including reports, maintenance, and alerts.",
    price: 5000,
    features: [
      "Robot Operating",
      "Battery Status",
      "Cleaning Log",
      "Site Management",
      "Statistics/Reports",
      "Prev. Maintenance",
      "Live Chat",
      "Multiple Users",
      "Multiple Alerts",
      "Robot Failure Alert",
      "Robot Offline Alert",
      "Major Breakdown",
      "Grass Cutting Alert",
      "Forecast Weather Alert",
    ],
  },
  {
    plan_id: "enterprise",
    name: "Enterprise Plan",
    description:
      "Comprehensive features with AI, weather models, and scalability.",
    price: 10000,
    features: [
      "Robot Operating",
      "Battery Status",
      "Cleaning Log",
      "Site Management",
      "Statistics/Reports",
      "Prev. Maintenance",
      "Live Chat",
      "Multiple Users",
      "Multiple Alerts",
      "Robot Failure Alert",
      "Robot Offline Alert",
      "Major Breakdown",
      "Grass Cutting Alert",
      "Forecast Weather Alert",
      "Scada Integration",
    ],
  },
];

const allFeatures = [
  "Robot Operating",
  "Battery Status",
  "Cleaning Log",
  "Site Management",
  "Only 3 Users",
  "Statistics/Reports",
  "Prev. Maintenance",
  "Live Chat",
  "Multiple Users",
  "Multiple Alerts",
  "Robot Failure Alert",
  "Robot Offline Alert",
  "Major Breakdown",
  "Grass Cutting Alert",
  "Forecast Weather Alert",
  "Scada Integration",
];

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="m-0">
      <CRow className="my-1 d-flex justify-content-center">
        <CCol className="">
          <CCard className="border-0 h-75 w-75 mx-auto rounded overflow-hidden pricing-card">
            <div className="pricing-card-header p-2">
              <h2 className="text-center mt-1">Taypro Console</h2>
              <p className="text-center text-white mt-2 pb-3">
                Choose the perfect plan for your Business
              </p>
            </div>
          </CCard>
        </CCol>
      </CRow>

      <div className="d-flex justify-content-center mb-3">
        Monthly{" "}
        <div className="form-check form-switch">
          <input
            value="check"
            id="check"
            className="form-check-input"
            type="checkbox"
            onChange={(e) => {
              e.target.checked ? setIsYearly(true) : setIsYearly(false);
            }}
          />
        </div>{" "}
        Yearly
      </div>

      <CRow className="my-2 ">
        {plans.map((plan) => (
          <CCol xs={12} md={4} key={plan.plan_id} className="mb-4">
            <CCard className="shadow-sm h-100 ">
              <CCardHeader className="pricing-card-header">
                <h5 className="mb-0 text-center">{plan.name}</h5>
              </CCardHeader>
              <CCardBody>
                <h5 className="text-center">
                  ₹{isYearly ? plan.price * 12 : plan.price}/
                  <small>{isYearly ? "year" : "month"}</small>
                </h5>
                <p className="text-center text-muted">{plan.description}</p>
                <CRow>
                  {plan.features.map((feature, idx) => (
                    <CCol xs={6} key={idx} className="mb-2">
                      <span style={{ fontSize: "12px" }}>
                        {featureIcons[feature] || "✅"} {feature}
                      </span>
                    </CCol>
                  ))}
                </CRow>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
        <h4 className="text-center my-3">Compare Plan Features</h4>
        <CCol xs={12} md={9} className="mx-auto border">
          {/* Header Row */}
          <CRow className="border-bottom  fw-bold py-2 text-center">
            <CCol xs={4} className="text-start ">
              Feature
            </CCol>
            {plans.map((plan) => (
              <CCol key={plan.plan_id} className="text-center">
                {plan.name}
              </CCol>
            ))}
          </CRow>

          {/* Feature Rows */}
          {allFeatures.map((feature, index) => (
            <CRow
              key={feature}
              className={`py-2 align-items-center  border-bottom`}
            >
              <CCol xs={4} className="text-start" style={{ fontSize: "14px" }}>
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
      </CRow>
    </div>
  );
};

export default Pricing;
