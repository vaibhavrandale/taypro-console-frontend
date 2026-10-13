import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation, useParams } from "react-router-dom";
import { canReadAll, canViewPerformance } from "../utils/access";
import { NotAuthorized } from "./Panel";
import "../servicePerformance.css";

/** SVG and chart colours; SVG attributes cannot read the CSS variables. Keep in sync with servicePerformance.css. */
export const COLORS = {
  text: "#e5e7eb",
  muted: "#a3adbd",
  grid: "#2f3a4d",
  track: "#2f3a4d",
  green: "#4ade80",
  amber: "#fbbf24",
  amberText: "#fcd34d",
  red: "#f87171",
  blue: "#60a5fa",
  none: "#6b7280",
};

export default function Page({ children }) {
  return <div className="sp">{children}</div>;
}

/**
 * Route guard. `admin` pages need read-all access. The backend checks again,
 * so a 403 from the API still renders the not-authorized state.
 */
export function PerformanceRoute({ admin = false, children }) {
  const user = useSelector((state) => state.userInfo);
  const allowed = admin ? canReadAll(user) : canViewPerformance(user);
  if (allowed) return children;
  return (
    <Page>
      <NotAuthorized message={admin ? "This page is for service admins." : "This page is for service engineers and service admins."} />
    </Page>
  );
}

/** Keeps old engineer-performance bookmarks working. `to` may contain :siteId. */
export function LegacyRedirect({ to }) {
  const { siteId } = useParams();
  const { search } = useLocation();
  return <Navigate replace to={`${to.replace(":siteId", encodeURIComponent(siteId || ""))}${search}`} />;
}

export function PageHeader({ title, subtitle, actions }) {
  return (
    <header className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
      <div>
        <h1 className="h3 mb-1">{title}</h1>
        {subtitle && <div className="sp-muted">{subtitle}</div>}
      </div>
      {actions && <div className="d-flex gap-2 flex-wrap align-items-center">{actions}</div>}
    </header>
  );
}
