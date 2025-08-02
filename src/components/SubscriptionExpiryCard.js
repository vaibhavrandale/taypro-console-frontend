import React from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CAvatar,
  CRow,
  CCol,
  CBadge,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilWarning, cilReload } from "@coreui/icons";

const SubscriptionExpiryCard = ({ data, error }) => {
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
              <CBadge
                className="d-flex align-items-center p-2"
                color="success"
                variant="outline"
                onClick={() => {
                  // alert("Renew Subscription Clicked");
                }}
              >
                <CIcon icon={cilReload} className="me-2" />
                Subscribe Now
              </CBadge>
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
    invoice = [],
    last_activity = [],
  } = data;

  const latestInvoice = invoice[invoice?.length - 1] || {};

  const clientUser = last_activity[last_activity.length - 1];

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <CRow className="justify-content-center mt-5">
      <CCol md={10}>
        <CCard className="shadow-lg rounded-0">
          <CCardHeader className="bg-danger text-white d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <CIcon icon={cilWarning} className="me-2" />
              <h5 className="mb-0">
                {latestInvoice.status === "pending"
                  ? "Please Make Payment"
                  : "Subscription Expired"}
              </h5>
            </div>
            <CBadge color="danger" className="fw-bold p-2">
              {latestInvoice.status === "pending"
                ? "Payment Pending"
                : "Please Subscribe"}
            </CBadge>
          </CCardHeader>

          <CCardBody>
            <CRow className="align-items-center mb-4">
              <CCol sm="auto">
                <img className="fluid" src={client_logo} alt={data._id} />
              </CCol>
              <CCol>
                <h4 className="mb-1">{client_name}</h4>
                <div className="text-muted">
                  Plan :{" "}
                  <CBadge color="success">{plan_id?.toUpperCase()}</CBadge>
                </div>
              </CCol>
            </CRow>

            {/* <CRow className="mb-5">
              <CCol md={6}>
                <strong>Start Date :</strong>{" "}
                {formatDate(subscription_start_date)}
              </CCol>
              <CCol md={6}>
                <strong>End Date :</strong> {formatDate(subscription_end_date)}
              </CCol>
              <CCol md={6}>
                <strong>Frequency :</strong> {frequency}
              </CCol>
              <CCol md={6}>
                <strong>Amount :</strong> {latestInvoice?.currency}&nbsp;
                {latestInvoice?.amount || "--"}
              </CCol>
            </CRow> */}

            <CRow className="mb-4">
              <CCol md={6} className="mb-2">
                <strong>Start Date -</strong>{" "}
                {formatDate(subscription_start_date)}
              </CCol>
              <CCol md={6} className="mb-2">
                <strong>End Date -</strong> {formatDate(subscription_end_date)}
              </CCol>
              <CCol md={6} className="mb-2">
                <strong>Frequency -</strong> {frequency}
              </CCol>
              <CCol md={6} className="mb-2">
                <strong>Amount -</strong> {latestInvoice?.currency}&nbsp;
                {latestInvoice?.amount || "--"}
              </CCol>
            </CRow>

            <div className="text-muted my-3">{error}</div>

            {clientUser && (
              <div className="d-flex align-items-center mb-4">
                <img
                  src={clientUser.profile_image}
                  alt="Profile"
                  className="rounded-circle me-3"
                  width="50"
                  height="50"
                  style={{ objectFit: "cover", cursor: "pointer" }}
                />
                <div>
                  <div className="fw-bold">{clientUser.name}</div>
                  <div className="text-muted small">{clientUser.details}</div>
                </div>
              </div>
            )}

            <div className="text-end">
              <CBadge
                color="warning"
                variant="outline"
                onClick={() => {
                  // alert("Renew Subscription Clicked");
                }}
              >
                <CIcon icon={cilReload} className="me-2" />
                Renew Subscription
              </CBadge>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default SubscriptionExpiryCard;
