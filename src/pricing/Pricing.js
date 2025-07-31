// import {
//   CBadge,
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CCol,
//   CListGroup,
//   CListGroupItem,
//   CRow,
//   CTable,
//   CTableBody,
//   CTableDataCell,
//   CTableHead,
//   CTableHeaderCell,
//   CTableRow,
// } from "@coreui/react";
// import React from "react";
// const plans = [
//   {
//     plan_id: "basic",
//     name: "Basic Plan",
//     description: "Essential features for basic robot operation and monitoring.",
//     price: 1000,
//     features: [
//       "Robot Operating",
//       "Battery Status",
//       "Cleaning Log",
//       "Site Management",
//       "Only 3 Users",
//     ],
//   },
//   {
//     plan_id: "premium",
//     name: "Premium Plan",
//     description:
//       "Advanced features including reports, maintenance, and alerts.",
//     price: 5000,
//     features: [
//       "Robot Operating",
//       "Battery Status",
//       "Cleaning Log",
//       "Site Management",
//       "Statistics/Reports",
//       "Preventive Maintenance",
//       "Data Live Chat",
//       "Multiple Users",
//       "Multiple Alerts",
//       "Robot Failure Alert",
//       "Robot Offline Alert",
//       "Major Breakdown",
//       "Grass Cutting Alert",
//       "Forecast Weather Alert",
//     ],
//   },
//   {
//     plan_id: "enterprise",
//     name: "Enterprise Plan",
//     description:
//       "Comprehensive features with AI, weather models, and scalability.",
//     price: 10000,
//     features: [
//       "Robot Operating",
//       "Battery Status",
//       "Cleaning Log",
//       "Site Management",
//       "Statistics/Reports",
//       "Preventive Maintenance",
//       "Data Live Chat",
//       "Multiple Users",
//       "Multiple Alerts",
//       "Robot Failure Alert",
//       "Robot Offline Alert",
//       "Major Breakdown",
//       "Grass Cutting Alert",
//       "Forecast Weather Alert",
//       "Weather Model",
//       "Scada Integration",
//     ],
//   },
// ];

// const allFeatures = [
//   "Robot Operating",
//   "Battery Status",
//   "Cleaning Log",
//   "Site Management",
//   "Only 3 Users",
//   "Statistics/Reports",
//   "Preventive Maintenance",
//   "Data Live Chat",
//   "Multiple Users",
//   "Multiple Alerts",
//   "Robot Failure Alert",
//   "Robot Offline Alert",
//   "Major Breakdown",
//   "Grass Cutting Alert",
//   "Forecast Weather Alert",
//   "Weather Model",
//   "Scada Integration",
// ];

// const Pricing = () => {
//   return (
//     <div>
//       <div className="p-4">
//         <h2 className="text-center mb-4">Choose the perfect plan</h2>
//         <CRow className="mb-5">
//           {plans.map((plan) => (
//             <CCol xs={12} md={4} key={plan.plan_id} className="mb-4">
//               <CCard className="shadow-sm h-100">
//                 <CCardHeader className="bg-primary text-white">
//                   <h5 className="mb-0">{plan.name}</h5>
//                 </CCardHeader>
//                 <CCardBody>
//                   <h3>
//                     ₹{plan.price}/<small>month</small>
//                   </h3>
//                   <p>{plan.description}</p>
//                   <CListGroup>
//                     {plan.features.map((feature, idx) => (
//                       <CListGroupItem key={idx}>✅ {feature}</CListGroupItem>
//                     ))}
//                   </CListGroup>
//                 </CCardBody>
//               </CCard>
//             </CCol>
//           ))}

//           <h4 className="text-center my-4">Compare Plan Features</h4>
//           <CCol xs={12} md={9} className="mx-auto">
//             <CTable striped responsive className="rounded-5">
//               <CTableHead>
//                 <CTableRow>
//                   <CTableHeaderCell>Feature</CTableHeaderCell>
//                   {plans.map((plan) => (
//                     <CTableHeaderCell
//                       key={plan.plan_id}
//                       className="text-center"
//                     >
//                       {plan.name}
//                     </CTableHeaderCell>
//                   ))}
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {allFeatures.map((feature) => (
//                   <CTableRow key={feature}>
//                     <CTableDataCell>{feature}</CTableDataCell>
//                     {plans.map((plan) => (
//                       <CTableDataCell
//                         key={plan.plan_id}
//                         className="text-center"
//                       >
//                         {plan.features.includes(feature) ? (
//                           <CBadge color="success">✔</CBadge>
//                         ) : (
//                           <CBadge color="danger">✖</CBadge>
//                         )}
//                       </CTableDataCell>
//                     ))}
//                   </CTableRow>
//                 ))}
//               </CTableBody>
//             </CTable>
//           </CCol>
//         </CRow>
//       </div>
//     </div>
//   );
// };

// export default Pricing;

import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CListGroup,
  CListGroupItem,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import React from "react";
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
  "Preventive Maintenance": (
    <ShieldCheck size={16} className="me-2 text-warning" />
  ),
  "Data Live Chat": <MessageCircle size={16} className="me-2 text-warning" />,
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
  "Weather Model": <Brain size={16} className="me-2 text-warning" />,
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
      "Preventive Maintenance",
      "Data Live Chat",
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
      "Preventive Maintenance",
      "Data Live Chat",
      "Multiple Users",
      "Multiple Alerts",
      "Robot Failure Alert",
      "Robot Offline Alert",
      "Major Breakdown",
      "Grass Cutting Alert",
      "Forecast Weather Alert",
      "Weather Model",
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
  "Preventive Maintenance",
  "Data Live Chat",
  "Multiple Users",
  "Multiple Alerts",
  "Robot Failure Alert",
  "Robot Offline Alert",
  "Major Breakdown",
  "Grass Cutting Alert",
  "Forecast Weather Alert",
  "Weather Model",
  "Scada Integration",
];

const Pricing = () => {
  return (
    <div>
      <div className="p-4">
        <h2 className="text-center mb-4">Choose the perfect plan</h2>
        <CRow className="mb-5">
          {plans.map((plan) => (
            <CCol xs={12} md={4} key={plan.plan_id} className="mb-4">
              <CCard className="shadow-sm h-100">
                <CCardHeader className="bg-primary text-white">
                  <h5 className="mb-0">{plan.name}</h5>
                </CCardHeader>
                <CCardBody>
                  <h3>
                    ₹{plan.price}/<small>month</small>
                  </h3>
                  <p>{plan.description}</p>
                  <CListGroup>
                    {plan.features.map((feature, idx) => (
                      <CListGroupItem key={idx}>
                        {featureIcons[feature] || "✅"} {feature}
                      </CListGroupItem>
                    ))}
                  </CListGroup>
                </CCardBody>
              </CCard>
            </CCol>
          ))}

          <h4 className="text-center my-4">Compare Plan Features</h4>
          <CCol xs={12} md={9} className="mx-auto">
            <CTable striped responsive className="rounded-5">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Feature</CTableHeaderCell>
                  {plans.map((plan) => (
                    <CTableHeaderCell
                      key={plan.plan_id}
                      className="text-center"
                    >
                      {plan.name}
                    </CTableHeaderCell>
                  ))}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {allFeatures.map((feature) => (
                  <CTableRow key={feature}>
                    <CTableDataCell>
                      {featureIcons[feature] || "📌"} {feature}
                    </CTableDataCell>
                    {plans.map((plan) => (
                      <CTableDataCell
                        key={plan.plan_id}
                        className="text-center"
                      >
                        {plan.features.includes(feature) ? (
                          <CBadge color="success">✔</CBadge>
                        ) : (
                          <CBadge color="danger">✖</CBadge>
                        )}
                      </CTableDataCell>
                    ))}
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCol>
        </CRow>
      </div>
    </div>
  );
};

export default Pricing;
