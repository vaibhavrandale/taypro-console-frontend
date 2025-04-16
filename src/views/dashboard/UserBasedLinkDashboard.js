import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CCard, CCardBody, CCol, CRow, CCardHeader } from "@coreui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserShield,
  faUserTie,
  faCogs,
  faTools,
  faBuilding,
} from "@fortawesome/free-solid-svg-icons";
// import NetworkStatus from '../NetworkStatus';

const UserBasedLinkDashboard = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (!user) {
      navigate("/login"); // Redirect if user is not found
    } else {
      setUserInfo(user);
    }
  }, [navigate]);

  if (!userInfo) {
    return null; // Prevent rendering if user isn't loaded
  }

  // Role-based routes
  const roleRoutes = {
    "Master Admin": {
      path: "/master-admin/dashboard",
      dept: "Administration",
      icon: faUserShield,
    },
    "Master User": {
      path: "/master-admin/dashboard",
      dept: "Administration",
      icon: faUserTie,
    },
    "Project Admin": {
      path: "/project-admin/dashboard",
      dept: "Project Management",
      icon: faCogs,
    },
    "Project Engineer": {
      path: "/project-admin/dashboard",
      dept: "Project Management",
      icon: faCogs,
    },
    "Service Admin": {
      path: "/service-admin/dashboard",
      dept: "Service Department",
      icon: faTools,
    },
    "Service User": {
      path: "/service-admin/dashboard",
      dept: "Service Department",
      icon: faTools,
    },
    "Site Technician": {
      path: "/site-technician/dashboard",
      dept: "Field Operations",
      icon: faTools,
    },
    "Client Admin": {
      path: "/client-admin/dashboard",
      dept: "Client Management",
      icon: faBuilding,
    },
    "Client Technician": {
      path: "/client-admin/dashboard",
      dept: "Client Management",
      icon: faBuilding,
    },
    "Site Incharge": {
      path: "/client-site-incharge/dashboard",
      dept: "Client Management",
      icon: faBuilding,
    },
  };

  // Get dashboard details for the logged-in user's role
  const userRoleData = roleRoutes[userInfo.role];

  return (
    <div className="mt-3 mx-2">
      <h2 className="text-center mb-4">
        Welcome, {userInfo.username} &nbsp;({userInfo.role})
      </h2>
      {/* <NetworkStatus /> */}
      <CRow className="justify-content-center">
        {userRoleData ? (
          <CCol md={4} className="mb-4">
            <CCard className="shadow-lg text-center" style={{ height: "100%" }}>
              <CCardHeader>
                <h5>{userInfo.role}</h5>
                <p className="text-muted">{userRoleData.dept}</p>
              </CCardHeader>
              <CCardBody>
                <FontAwesomeIcon
                  icon={userRoleData.icon}
                  size="3x"
                  className="mb-3"
                />
                <br />
                <Link to={userRoleData.path} className="btn btn-success btn-sm">
                  Go to {userInfo.role} Dashboard
                </Link>
              </CCardBody>
            </CCard>
          </CCol>
        ) : (
          <p className="text-center text-danger">
            No dashboard assigned for your role.
          </p>
        )}
      </CRow>
    </div>
  );
};

export default UserBasedLinkDashboard;
