// import React, { useEffect, useState } from "react";
// import {
//   CContainer,
//   CRow,
//   CCol,
//   CCard,
//   CCardBody,
//   CCardTitle,
//   CCardText,
//   CFormInput,
// } from "@coreui/react";
// import { Link, useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import _nav from "../../_nav"; // Import Navigation Data

// const MasterAdminDashboard = () => {
//   const userInfo = useSelector((state) => state.userInfo);
//   const navigate = useNavigate();
//   const [searchText, setSearchText] = useState("");

//   useEffect(() => {
//     if (!userInfo) {
//       navigate("/login");
//     }
//   }, [navigate, userInfo]);

//   const filteredNav = _nav.filter((navItem) => {
//     if (userInfo.role === "Master Admin")
//       return navItem.name === "Master Admin";
//     if (userInfo.role === "Project Admin")
//       return navItem.name === "Project Admin";
//     if (userInfo.role === "Service Admin")
//       return navItem.name === "Service Admin";
//     if (userInfo.role === "Service User")
//       return navItem.name === "Service User";
//     if (userInfo.role === "Site Technician")
//       return navItem.name === "Site Technician";
//     if (userInfo.role === "Client Admin")
//       return navItem.name === "Client Admin";
//     if (userInfo.role === "Site Incharge")
//       return navItem.name === "Site Incharge";
//     if (userInfo.role === "Client Site Technician")
//       return navItem.name === "Client Site Technician";
//     return false;
//   });

//   const navItems = filteredNav[0]?.items || [];

//   const filteredItems = navItems.filter((item) =>
//     item.name.toLowerCase().includes(searchText.toLowerCase())
//   );

//   return (
//     <CContainer fluid>
//       <CRow className="align-items-center justify-content-between mt-2 mb-3">
//         <CCol>
//           <h3 className="text-primary text-center my-2">
//             Master Admin Dashboard
//           </h3>
//         </CCol>
//       </CRow>

//       <div className="d-flex justify-content-end mb-3">
//         <CCol xs="12" md="4" lg="3">
//           <CFormInput
//             placeholder="Search..."
//             value={searchText}
//             onChange={(e) => setSearchText(e.target.value)}
//           />
//         </CCol>
//       </div>

//       <CRow className="g-4 my-3">
//         {filteredItems.map((item, index) => (
//           <CCol md={3} lg={3} key={index}>
//             <CCard className="shadow-sm border-0 text-center">
//               <CCardBody>
//                 {item.icon}
//                 <CCardTitle className="my-2 fs-6">
//                   <Link
//                     to={item.to}
//                     className="text-primary text-decoration-none"
//                   >
//                     {item.name}
//                   </Link>
//                 </CCardTitle>
//                 <CCardText />
//               </CCardBody>
//             </CCard>
//           </CCol>
//         ))}
//         {filteredItems.length === 0 && (
//           <p className="text-center text-muted">No results found.</p>
//         )}
//       </CRow>
//     </CContainer>
//   );
// };

// export default MasterAdminDashboard;

import React, { useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ApiLoggerDashboard from "./api-logger/ApiLoggerDashboard";

const MasterAdminDashboard = () => {
  const userInfo = useSelector((state) => state.userInfo);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
  }, [navigate, userInfo]);

  return (
    // <div
    //   style={{ height: "80vh" }}
    //   className=" d-flex flex-wrap align-items-start justify-content-center"
    // >
    //   <h2 className="py-2">
    //     Delivering&nbsp;
    //     <span
    //       style={{
    //         color: "#39d600",
    //       }}
    //     >
    //       Solar Cleaning Robots
    //     </span>
    //     &nbsp; With Highest Up-Time Guarantee
    //   </h2>
    //   <iframe
    //     width="860"
    //     height="350"
    //     src="https://www.youtube.com/embed/PiXJhQ_MYgk?si=22r6pGnC1wbewKuy"
    //     title="YouTube video player"
    //     // frameBorder="0"
    //     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    //     referrerPolicy="strict-origin-when-cross-origin"
    //     allowFullScreen
    //   ></iframe>
    // </div>
    <ApiLoggerDashboard />
  );
};

export default MasterAdminDashboard;
