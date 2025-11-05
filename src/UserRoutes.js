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
// Master USer
export function MasterUserRoute({ children }) {
  const userInfo = useSelector((state) => state.userInfo);
  return userInfo && userInfo.role === "Master User" ? children : <Page404 />;
}

// Project User
export function ProjectUserRoute({ children }) {
  const userInfo = useSelector((state) => state.userInfo);
  return userInfo && userInfo.role === "Project User" ? children : <Page404 />;
}

// Service User
export function ServiceUserRoute({ children }) {
  const userInfo = useSelector((state) => state.userInfo);
  return userInfo && userInfo.role === "Service User" ? children : <Page404 />;
}
// Service User
export function OpexClientAdmin({ children }) {
  const userInfo = useSelector((state) => state.userInfo);
  return userInfo && userInfo.role === "Opex Client Admin" ? (
    children
  ) : (
    <Page404 />
  );
}

export function OpexSiteTechnicianRoute({ children }) {
  const userInfo = useSelector((state) => state.userInfo);
  return userInfo && userInfo.role === "Opex Site Technician" ? (
    children
  ) : (
    <Page404 />
  );
}
export function SalesAdminRoute({ children }) {
  const userInfo = useSelector((state) => state.userInfo);
  return userInfo && userInfo.role === "Sales Admin" ? children : <Page404 />;
}

export function HRAndAdminRoute({ children }) {
  const userInfo = useSelector((state) => state.userInfo);
  return userInfo && userInfo.role === "Hr Admin" ? children : <Page404 />;
}

export function AccountAdminRoute({ children }) {
  const userInfo = useSelector((state) => state.userInfo);
  return userInfo && userInfo.role === "Accounts Admin" ? (
    children
  ) : (
    <Page404 />
  );
}

export function QualityAdminRoute({ children }) {
  const userInfo = useSelector((state) => state.userInfo);
  return userInfo && userInfo.role === "Quality Admin" ? children : <Page404 />;
}

export function SupplyChainAndLogisticsAdminRoute({ children }) {
  const userInfo = useSelector((state) => state.userInfo);
  return userInfo && userInfo.role === "Supply Chain And Logistics Admin" ? (
    children
  ) : (
    <Page404 />
  );
}
export function ResearchAndDevelopmentAndProductDevelopmentAdminRoute({
  children,
}) {
  const userInfo = useSelector((state) => state.userInfo);
  return userInfo &&
    userInfo.role ===
      "Research And Development And Product Development Admin" ? (
    children
  ) : (
    <Page404 />
  );
}

export function ProductionAndOperationsAdminRoute({ children }) {
  const userInfo = useSelector((state) => state.userInfo);
  return userInfo && userInfo.role === "Production And Operations Admin" ? (
    children
  ) : (
    <Page404 />
  );
}
