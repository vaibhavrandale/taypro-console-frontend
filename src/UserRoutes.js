import React from "react";
import { useSelector } from "react-redux";

const Page404 = React.lazy(() => import("./views/pages/page404/Page404"));

// ✅ Route wrapper for Service Admin
export function ServiceAdminRoute({ children }) {
  const userInfo = useSelector((state) => state.userInfo);
  return userInfo && userInfo.role === "Service Admin" ? children : <Page404 />;
}

// ✅ Route wrapper for Project Admin
export function ProjectAdminRoute({ children }) {
  const userInfo = useSelector((state) => state.userInfo);
  return userInfo && userInfo.role === "Project Admin" ? children : <Page404 />;
}

// ✅ Route wrapper for Master Admin
export function MasterAdminRoute({ children }) {
  const userInfo = useSelector((state) => state.userInfo);
  return userInfo && userInfo.role === "Master Admin" ? children : <Page404 />;
}

export function SiteTechnicianRoute({ children }) {
  const userInfo = useSelector((state) => state.userInfo);
  return userInfo && userInfo.role === "Site Technician" ? (
    children
  ) : (
    <Page404 />
  );
}

export function ClientAdminRoute({ children }) {
  const userInfo = useSelector((state) => state.userInfo);
  return userInfo && userInfo.role === "Client Admin" ? children : <Page404 />;
}

export function ClientSiteInchargeRoute({ children }) {
  const userInfo = useSelector((state) => state.userInfo);
  return userInfo && userInfo.role === "Site Incharge" ? children : <Page404 />;
}

export function ClientSiteTechnicianRoute({ children }) {
  const userInfo = useSelector((state) => state.userInfo);
  return userInfo && userInfo.role === "Client Site Technician" ? (
    children
  ) : (
    <Page404 />
  );
}
