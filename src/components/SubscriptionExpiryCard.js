import React from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CBadge,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilWarning } from "@coreui/icons";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const SubscriptionExpiryCard = ({ data, error, subscriptionStatus }) => {
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

  if (!data) {
    return (
      <>
        <CCard className="shadow-lg  border-2 p-5">
          <CCardBody>
            <div className="d-flex align-items-center justify-content-center flex-column">
              <div className="d-flex mb-3 align-items-center">
                <CIcon icon={cilWarning} className="me-2 text-warning" />
                <h5 className="mb-0">
                  Please Subscribe to Unlock this Feature!
                </h5>
              </div>
              <Link
                to={`/${adminroute}/pricing`}
                className="btn btn-success btn-sm"
              >
                View Pricing
              </Link>
            </div>
          </CCardBody>
        </CCard>
      </>
    );
  }

  const {
    client_name,
    client_logo,
    plan_id,
    subscription_start_date,
    subscription_end_date,
    frequency,
    subscription_status,
    invoice = [],
  } = data;

  const statusConfig = {
    subscriptionSitesAssigned: {
      label: "Sites Assigned Issue",
      color: "warning",
    },
    subscriptionFound: {
      label: "Subscription Not Found",
      color: "danger",
    },
    subscriptionaRenewStatus: {
      label: "Renewal Required",
      color: "info",
    },
    subscriptionPaymentStatus: {
      label: "Payment Pending",
      color: "danger",
    },
    subscriptionPlanAccess: {
      label: "Access Restricted",
      color: "secondary",
    },
  };

  const latestInvoice = invoice[invoice?.length - 1] || {};

  // const clientUser = last_activity[last_activity.length - 1];

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <CRow className="justify-content-center mb-2">
      <CCol md={10}>
        <CCard className="shadow-lg rounded-3 ">
          <CCardHeader
            className={` bg-${
              statusConfig[subscriptionStatus]?.color || "danger"
            } text-white d-flex align-items-center justify-content-between `}
          >
            <div className="d-flex align-items-center">
              <CIcon icon={cilWarning} className="me-2 fs-5" />
              <h6 className="mb-0">
                {statusConfig[subscriptionStatus]?.label ||
                  "Subscription Alert"}
              </h6>
            </div>
            <CBadge
              color="light"
              shape="rounded-pill"
              className="text-dark px-3 py-2"
            >
              {latestInvoice.status === "pending"
                ? "Payment Pending"
                : latestInvoice.status === "paid"
                  ? "Upgrade Plan"
                  : "Subscribe Now"}
            </CBadge>
          </CCardHeader>

          <CCardBody>
            {/* Client Info */}
            <CRow className="align-items-center border-bottom pb-3 mb-3">
              <CCol sm="auto">
                <img
                  className="rounded border p-1"
                  src={client_logo}
                  alt="Client Logo"
                  width="60"
                  height="60"
                  style={{ objectFit: "contain" }}
                />
              </CCol>
              <CCol>
                <h5 className="mb-1">{client_name}</h5>
                <div className="text-muted">
                  Current Plan&nbsp;:{" "}
                  <CBadge color="success">{plan_id?.toUpperCase()}</CBadge>
                </div>
              </CCol>
            </CRow>
            {/* Subscription Details */}
            <CRow className="mb-3">
              <CCol md={3}>
                <span className="text-success">Start Date&nbsp;:</span>{" "}
                {formatDate(subscription_start_date)}
              </CCol>
              <CCol md={3}>
                <span className="text-success">End Date&nbsp;:</span>{" "}
                {formatDate(subscription_end_date)}
              </CCol>
              <CCol md={3}>
                <span className="text-success">Frequency&nbsp;:</span>{" "}
                <CBadge
                  // shape="rounded-pill"
                  className="text-dark ms-1"
                  color="warning"
                >
                  {frequency.toUpperCase()}
                </CBadge>
              </CCol>
              <CCol md={3}>
                <span className="text-success">Status&nbsp;:</span>{" "}
                <CBadge
                  color={
                    subscription_status === "expired" ? "danger" : "success"
                  }
                >
                  {subscription_status.toUpperCase()}
                </CBadge>
              </CCol>
            </CRow>

            {error && (
              <div className="text-warning text-center mb-3">{error}</div>
            )}
            {/* <CRow>
              <CCol className="d-flex justify-content-center align-items-center">
                <CBadge
                  color="warning"
                  className="text-dark fs-6 text-uppercase d-flex justify-content-center align-items-center"
                >
                  {latestInvoice.status === "pending"
                    ? "Payment Pending"
                    : latestInvoice.status === "paid"
                    ? "Please Upgrade your Plan"
                    : "Please Subscribe"}
                </CBadge>
              </CCol>
            </CRow> */}
            <div className="d-flex justify-content-center align-items-center ">
              <Link to={`/${adminroute}/subscriptions`} className="ms-1">
                <CBadge color="success" className="m-2 p-2">
                  View Your current Subscription
                </CBadge>
              </Link>
              <Link to={`/${adminroute}/pricing`}>
                {" "}
                <CBadge color="success" className="m-2 p-2">
                  View Pricing
                </CBadge>
              </Link>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default SubscriptionExpiryCard;
