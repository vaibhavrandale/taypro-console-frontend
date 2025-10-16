import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { CRow, CCol, CCard, CCardBody, CButton } from "@coreui/react";

const RobotDataGraphs = () => {
  const navigate = useNavigate();
  const { clientId, site_id } = useParams(); // match route param
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
        {/* RSSI & SNR Graph */}
        <CCol md={4} className="mb-3">
          <CCard className="shadow-sm border-0 text-center">
            <CCardBody>
              <h5 className="fw-bold mb-3">Rssi & Snr</h5>
              <div className="d-flex justify-content-center gap-2">
                <CButton
                  size="sm"
                  color="primary"
                  onClick={() =>
                    navigate(
                      `/${adminroute}/all-clients-dashboard/${clientId}/RobotDataGraphs/${site_id}/rssi-snr`
                    )
                  }
                >
                  Graph
                </CButton>
                <CButton
                  size="sm"
                  color="secondary"
                  onClick={() =>
                    navigate(
                      `/${adminroute}/all-clients-dashboard/${clientId}/RobotDataTable/${site_id}/rssi-snr`
                    )
                  }
                >
                  Table
                </CButton>
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Battery Graph */}
        <CCol md={4} className="mb-3">
          <CCard className="shadow-sm border-0 text-center">
            <CCardBody>
              <h5 className="fw-bold mb-3">Battery Percentage</h5>
              <div className="d-flex justify-content-center gap-2">
                <CButton
                  size="sm"
                  color="primary"
                  onClick={() =>
                    navigate(
                      `/${adminroute}/all-clients-dashboard/${clientId}/RobotDataGraphs/${site_id}/battery`
                    )
                  }
                >
                  Graph
                </CButton>
                <CButton
                  size="sm"
                  color="secondary"
                  onClick={() =>
                    navigate(
                      `/${adminroute}/all-clients-dashboard/${clientId}/RobotDataTable/${site_id}/battery`
                    )
                  }
                >
                  Table
                </CButton>
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Current Graph */}
        <CCol md={4} className="mb-3">
          <CCard className="shadow-sm border-0 text-center">
            <CCardBody>
              <h5 className="fw-bold mb-3">Current</h5>
              <div className="d-flex justify-content-center gap-2">
                <CButton
                  size="sm"
                  color="primary"
                  onClick={() =>
                    navigate(
                      `/${adminroute}/all-clients-dashboard/${clientId}/RobotDataGraphs/${site_id}/current`
                    )
                  }
                >
                  Graph
                </CButton>
                <CButton
                  size="sm"
                  color="secondary"
                  onClick={() =>
                    navigate(
                      `/${adminroute}/all-clients-dashboard/${clientId}/RobotDataTable/${site_id}/current`
                    )
                  }
                >
                  Table
                </CButton>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  );
};

export default RobotDataGraphs;
