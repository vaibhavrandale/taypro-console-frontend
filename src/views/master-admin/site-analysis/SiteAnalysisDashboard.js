import React from "react";
import { CRow, CCol, CButton, CCard, CCardBody } from "@coreui/react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const SiteAnalysisDashboard = () => {
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.userInfo);

  let adminroute = "";

  if (userInfo?.role === "Master Admin") {
    adminroute = "master-admin";
  } else if (userInfo?.role === "Service Admin") {
    adminroute = "service-admin";
  } else if (userInfo?.role === "Project Admin") {
    adminroute = "project-admin";
  } else if (userInfo?.role === "Client Admin") {
    adminroute = "client-admin";
  } else if (userInfo?.role === "Site Incharge") {
    adminroute = "site-incharge";
  } else if (userInfo?.role === "Site Technician") {
    adminroute = "site-technician";
  } else if (userInfo?.role === "Client Site Technician") {
    adminroute = "client-site-technician";
  } else if (userInfo?.role === "Master User") {
    adminroute = "master-user";
  } else if (userInfo?.role === "Service User") {
    adminroute = "service-user";
  } else if (userInfo?.role === "Project User") {
    adminroute = "project-user";
  }

  return (
    <div className="align-items-center mt-5">
      <CRow className="justify-content-center">
        <CCol md={4} className="mb-3">
          <CCard className="shadow-sm border-0 text-center">
            <CCardBody>
              <h5 className="fw-bold mb-3">Service Dashboard</h5>
              <CButton
                size="sm"
                color="primary"
                onClick={() => navigate(`/${adminroute}/all-clients-dashboard`)}
              >
                Go to Service
              </CButton>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={4} className="mb-3">
          <CCard className="shadow-sm border-0 text-center">
            <CCardBody>
              <h5 className="fw-bold mb-3">Project Dashboard</h5>
              <CButton size="sm" color="secondary">
                Coming Soon
              </CButton>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  );
};

export default SiteAnalysisDashboard;
