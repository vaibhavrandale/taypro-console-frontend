import React, { useEffect } from "react";
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardTitle,
  CCardText,
} from "@coreui/react";
import { Link, useNavigate } from "react-router-dom";

import //   cilPeople,

"@coreui/icons";
import _nav from "../../_nav"; // Import Navigation Data
import { useSelector } from "react-redux";

const ProjectAdminDashboard = () => {
  const userInfo = useSelector((state) => state.userInfo);
  const navigate = useNavigate();
  useEffect(() => {
    // const user = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo) {
      navigate("/login"); // Redirect to login if user is not found
    }
  }, [navigate, userInfo]);
  // 🔍 Filter Navigation Links Based on User Role
  const filteredNav = _nav.filter((navItem) => {
    if (userInfo.role === "Master Admin") {
      // return true; // Show all menu items
      return navItem.name === "Master Admin";
    } else if (userInfo.role === "Project Admin") {
      return navItem.name === "Project Admin"; // Show only Service Admin items
    } else if (userInfo.role === "Service Admin") {
      return navItem.name === "Service Admin"; // Show only Service Admin items
    } else if (userInfo.role === "Service User") {
      return navItem.name === "Service User"; // Show only Service Admin items
    } else if (userInfo.role === "Site Technician") {
      return navItem.name === "Site Technician"; // Show only Service Admin items
    } else if (userInfo.role === "Client Admin") {
      return navItem.name === "Client Admin"; // Show only Client Admin items
    } else if (userInfo.role === "Site Incharge") {
      return navItem.name === "Site Incharge"; // Show only Client Admin items
    } else if (userInfo.role === "Client Technician") {
      return navItem.name === "Client Technician"; // Show only Client Admin items
    }
    return false;
  });

  console.log(filteredNav[0].items);

  return (
    <CContainer fluid className="">
      <h3 className="text-center my-2 text-primary">Project Admin Dashboard</h3>
      <CRow className="g-4 my-3">
        {filteredNav[0].items.map((item, index) => (
          <CCol md={3} lg={3} key={index}>
            <CCard className="shadow-sm border-0 text-center">
              <CCardBody>
                {/* <CIcon
                       icon=
                       size="xxl"
                       className="text-primary mb-3"
                     /> */}

                {item.icon}

                <CCardTitle className="my-2 fs-6">
                  {" "}
                  <Link
                    to={item.to}
                    className=" text-primary text-decoration-none"
                  >
                    {item.name}
                  </Link>
                </CCardTitle>
                <CCardText></CCardText>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>
    </CContainer>
  );
};

export default ProjectAdminDashboard;
