import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { CRow, CCol, CCard, CCardBody, CButton } from "@coreui/react";
import { Activity, BatteryFull, Signal } from "lucide-react";

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
        {/* RSSI & SNR */}
        <CCol md={4} className="mb-3">
          <CCard className="shadow-sm border-0 text-center">
            <CCardBody>
              <div className="d-flex justify-content-center align-items-center gap-2 mb-2">
                <Signal size={22} className="text-primary" />
                <h5 className="mb-0">Rssi & Snr</h5>
              </div>
              <div className="d-flex justify-content-center gap-2 mt-2">
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

        {/* Battery */}
        <CCol md={4} className="mb-3">
          <CCard className="shadow-sm border-0 text-center">
            <CCardBody>
              <div className="d-flex justify-content-center align-items-center gap-2 mb-2">
                <BatteryFull size={22} className="text-success" />
                <h5 className="mb-0">Battery Percentage</h5>
              </div>
              <div className="d-flex justify-content-center gap-2 mt-2">
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

        {/* Current */}
        <CCol md={4} className="mb-3">
          <CCard className="shadow-sm border-0 text-center">
            <CCardBody>
              <div className="d-flex justify-content-center align-items-center gap-2 mb-2">
                <Activity size={22} className="text-warning" />
                <h5 className="mb-0">Current</h5>
              </div>
              <div className="d-flex justify-content-center gap-2 mt-2">
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
