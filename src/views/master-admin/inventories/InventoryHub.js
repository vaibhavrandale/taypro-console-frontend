import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  CBadge,
  CCard,
  CCardBody,
  CCol,
  CRow,
} from "@coreui/react";

const adminRouteFromRole = (role) => {
  if (role === "Master Admin") return "master-admin";
  if (role === "Service Admin") return "service-admin";
  if (role === "Project Admin") return "project-admin";
  if (role === "Master User") return "master-user";
  if (role === "Service User") return "service-user";
  if (role === "Project User") return "project-user";
  return "master-admin";
};

const ModuleCard = ({ title, desc, badge, color, links }) => (
  <CCard className="h-100 shadow-sm border-0">
    <CCardBody className="d-flex flex-column">
      <div className="d-flex justify-content-between align-items-start mb-2">
        <h6 className="mb-0">{title}</h6>
        {badge ? <CBadge color={color || "secondary"}>{badge}</CBadge> : null}
      </div>
      <p className="small text-medium-emphasis mb-3 flex-grow-1">{desc}</p>
      <div className="d-flex flex-wrap gap-2">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className={`btn btn-sm ${l.primary ? "btn-primary" : "btn-outline-secondary"}`}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </CCardBody>
  </CCard>
);

const InventoryHub = () => {
  const userInfo = useSelector((s) => s.userInfo);
  const base = `/${adminRouteFromRole(userInfo?.role)}`;

  const sections = [
    {
      title: "Material Requests",
      desc: "Request new material from store / warehouse for sites.",
      badge: "Inward",
      color: "info",
      links: [
        { label: "All requests", to: `${base}/material-requests`, primary: true },
        { label: "Create request", to: `${base}/material-requests/create-material-request` },
      ],
    },
    {
      title: "Service Inventory",
      desc: "Good stock at each site — quantities and thresholds.",
      badge: "On site",
      color: "success",
      links: [
        { label: "View inventory", to: `${base}/inventories`, primary: true },
        { label: "Add stock", to: `${base}/inventories/add-inventory` },
      ],
    },
    {
      title: "Service Items",
      desc: "Master catalog of spare parts / service items.",
      badge: "Catalog",
      color: "primary",
      links: [
        { label: "All items", to: `${base}/inventories?tab=item`, primary: true },
        { label: "Add item", to: `${base}/inventories/add-service-item` },
      ],
    },
    {
      title: "Faulty Inventory",
      desc: "Faulty / removed parts still at site, plus item-level tracking.",
      badge: "Faulty",
      color: "danger",
      links: [
        { label: "Faulty stock", to: `${base}/faulty-inventory`, primary: true },
        { label: "Item tracking", to: `${base}/faulty-inventory?tab=tracking` },
      ],
    },
    {
      title: "Material Consumption",
      desc: "Parts used on service tickets — graphs, tables, and Excel export by date range.",
      badge: "Spend",
      color: "warning",
      links: [
        {
          label: "Consumption report",
          to: `${base}/material-consumption`,
          primary: true,
        },
      ],
    },
    {
      title: "Faulty Return Rework",
      desc: "Return faulty parts from N sites to main factory / office for rework.",
      badge: "Return",
      color: "warning",
      links: [
        { label: "All returns", to: `${base}/faulty-return-rework`, primary: true },
        { label: "New return", to: `${base}/faulty-return-rework/create` },
      ],
    },
  ];

  // Master-only extras that sit in the same inventory world
  const isMaster = ["Master Admin", "Master User"].includes(userInfo?.role);
  if (isMaster) {
    sections.push(
      {
        title: "Service Ticket Faults",
        desc: "Fault type master used on service tickets.",
        badge: "Master",
        color: "secondary",
        links: [
          {
            label: "Fault types",
            to: `${base}/serviceticket-fault/service-tickets-fault-dashboard`,
            primary: true,
          },
        ],
      },
      {
        title: "Fault Analysis Checklist",
        desc: "Checklist mapping for fault analysis components.",
        badge: "Master",
        color: "secondary",
        links: [
          {
            label: "Open checklist",
            to: `${base}/fault-analysis-checklist`,
            primary: true,
          },
        ],
      },
    );
  }

  return (
    <div className="p-3">
      <div className="mb-4">
        <h4 className="mb-1">Inventory & Material Hub</h4>
        <p className="text-medium-emphasis small mb-0">
          Material request → site stock → consumption / faulty → return to
          factory. Open any module below.
        </p>
      </div>

      <CRow className="g-3 mb-4">
        {[
          ["1. Request", "Material Requests"],
          ["2. Stock", "Service Inventory / Items"],
          ["3. Faulty", "Faulty Inventory"],
          ["4. Rework", "Return to Factory"],
        ].map(([step, label]) => (
          <CCol xs={6} md={3} key={step}>
            <div
              className="rounded px-3 py-2 h-100"
              style={{ background: "var(--cui-tertiary-bg)" }}
            >
              <div className="small text-medium-emphasis">{step}</div>
              <div className="fw-semibold" style={{ fontSize: "0.9rem" }}>
                {label}
              </div>
            </div>
          </CCol>
        ))}
      </CRow>

      <CRow className="g-3">
        {sections.map((s) => (
          <CCol key={s.title} xs={12} md={6} xl={4}>
            <ModuleCard {...s} />
          </CCol>
        ))}
      </CRow>
    </div>
  );
};

export default InventoryHub;
