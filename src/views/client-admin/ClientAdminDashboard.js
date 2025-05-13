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

import _nav from "../../_nav";
import { useSelector } from "react-redux";

const ClientAdminDashboard = () => {
  const userInfo = useSelector((state) => state.userInfo);
  const navigate = useNavigate();
  useEffect(() => {
    // const user = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo) {
      navigate("/login"); // Redirect to login if user is not found
    }
  }, [navigate, userInfo]);
  const filteredNav = _nav.filter((navItem) => {
    if (userInfo.role === "Client Admin") {
      // return true; // Show all menu items
      return navItem.name === "Client Admin";
    }
    return false;
  });
  return (
    <CContainer fluid className="">
      <h3 className="text-center my-2 text-primary">Dashboard</h3>
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

export default ClientAdminDashboard;
