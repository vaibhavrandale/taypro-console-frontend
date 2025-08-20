import React, { useEffect, useReducer, useState } from "react";
import {
  CCard,
  CCardHeader,
  CCardBody,
  CCardTitle,
  CCardText,
  CListGroup,
  CListGroupItem,
  CRow,
  CCol,
  CTable,
  CTableHead,
  CTableHeaderCell,
  CTableBody,
  CTableRow,
  CTableDataCell,
  CBadge,
} from "@coreui/react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import moment from "moment";
import LastActivity from "../../../components/LastActivity";
import LoadingSpinner from "../../../components/LoadingSpinner";
import CIcon from "@coreui/icons-react";
import { cilCloudDownload } from "@coreui/icons";
import html2pdf from "html2pdf.js";
import headerImage from "../../../assets/brand/letterheader.png";
import footerImage from "../../../assets/brand/letterfooter.png";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        subscription: action.payload.data[0],
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const SubscriptionViewPage = () => {
  const [{ loading, error, subscription }, dispatch] = useReducer(reducer, {
    subscriptions: [],
    loading: true,
    error: "",
  });
  const { id } = useParams();
  const authtoken = useSelector((state) => state.authtoken);
  const [downloadingInvoiceIds, setDownloadingInvoiceIds] = useState([]);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      dispatch({ type: "FETCH_REQUEST" });

      try {
        const response = await axios.get(
          `/api/v1/client-subscription/get-subscriptions`,
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );
        const subscriptions = response?.data?.data;
        dispatch({
          type: "FETCH_SUCCESS",
          payload: {
            data: subscriptions,
          },
        });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: error.response?.data?.message || error.response?.data?.error,
        });
        toast.error(
          error.response?.data?.message || error.response?.data?.error
        );
      }
    };
    fetchSubscriptions();
  }, [id, authtoken]);

  const getBase64ImageFromURL = async (url) => {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const exportToPdf = async (
    subscriptionId,
    clientId,
    planId,
    clientName,
    clientLogo,
    invoice_id,
    frequency,
    amount,
    start_date,
    end_date,
    cgst,
    sgst,
    igst,
    place_of_supply,
    status,
    transaction_id
  ) => {
    const headerBase64 = await getBase64ImageFromURL(headerImage);
    const footerBase64 = await getBase64ImageFromURL(footerImage);
    const logoBase64 = await getBase64ImageFromURL(clientLogo);
    const total = amount + cgst + sgst + igst;

    const content = `
<div style="position: relative; width: 100%; height: 1122px; padding: 40px 40px 120px 40px; box-sizing: border-box; font-family: Arial, sans-serif; background-color: #fff; color: #000;">

  <!-- Header -->
  <div style="margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center;">
    <img src="${headerBase64}" style="width: 80%; height: auto;" />
    <img src="${logoBase64}" style="max-height: 60px; object-fit: contain;" />
  </div>

  <!-- Bill To -->
  <table style="width: 100%; font-size: 14px; margin-bottom: 10px;">
    <tr>
      <td>
        <strong>Bill to:</strong><br/>
        ATTN: Yogesh Kudale<br/>
        NL-4/41/05, Sector-11, Nerul, Navi Mumbai<br/>
        Mumbai, Maharashtra, 400706, IN
      </td>
    </tr>
  </table>

  <!-- Faint Separator -->
  <hr style="border: none; border-top: 1px solid #ccc; margin: 10px 0 30px 0;" />

  <!-- Invoice Metadata -->
  <table style="width: 100%; font-size: 14px; margin-bottom: 30px;">
    <tr>
      <td><strong>Subscription ID:</strong></td>
      <td>${subscriptionId}</td>
        <td><strong>Invoice ID:</strong></td>
      <td>${invoice_id}</td>
    </tr>
    <tr>
      <td><strong>Client Name:</strong></td>
      <td>${clientName}</td>
      <td><strong>Status:</strong></td>
      <td>${status}</td>
    </tr>
    <tr>
      <td><strong>Frequency:</strong></td>
      <td>${planId} (${frequency})</td>
      <td><strong>Transaction ID:</strong></td>
      <td>${transaction_id || "N/A"}</td>
    </tr>
    <tr>
      <td><strong>Start Date:</strong></td>
      <td>${moment(start_date).format("DD-MM-YYYY")}</td>
      <td><strong>End Date:</strong></td>
      <td>${moment(end_date).format("DD-MM-YYYY")}</td>
    </tr>
  </table>

  <h3>Billing Details</h3>
  <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 60px;">
  <thead style="background-color: #f5f5f5;">
      <tr>
        <th style="border: 1px solid #ccc; padding: 10px;">Amount (INR)</th>
        <th style="border: 1px solid #ccc; padding: 10px;">CGST (INR)</th>
        <th style="border: 1px solid #ccc; padding: 10px;">SGST (INR)</th>
        <th style="border: 1px solid #ccc; padding: 10px;">IGST (INR)</th>
        <th style="border: 1px solid #ccc; padding: 10px;">Total (INR)</th>
      </tr>
    </thead>
    <tbody>
      <tr style="text-align: center;">
        <td style="border: 1px solid #ccc; padding: 10px;">₹${amount}</td>
        <td style="border: 1px solid #ccc; padding: 10px;">₹${cgst}</td>
        <td style="border: 1px solid #ccc; padding: 10px;">₹${sgst}</td>
        <td style="border: 1px solid #ccc; padding: 10px;">₹${igst}</td>
        <td style="border: 1px solid #ccc; padding: 10px; font-weight: bold;">₹${total}</td>
      </tr>
    </tbody>
  </table>

  <!-- Footer (strictly flush to page bottom) -->
  <div style="position: absolute; bottom: 0; left: 0; width: 100%;">
  <img src="${footerBase64}" style="width: 100%; height: auto;" />
</div>
</div>
`;

    const opt = {
      margin: 0,
      filename: `Invoice_${invoice_id}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        backgroundColor: "#fff",
        useCORS: true,
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf().from(content).set(opt).save();
  };

  return (
    <div className="p-4">
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <span className="text-center fw-bold">{error}</span>
      ) : (
        <>
          {" "}
          {/* <CCard className="mb-4">
            <CCardHeader className="bg-primary text-white">
              <CCardTitle className="h4">Subscription Details</CCardTitle>
            </CCardHeader>
            <CCardBody>
              <CListGroup flush>
                <CListGroupItem>
                  <strong>Client ID:</strong> {subscription.client_id}
                </CListGroupItem>
                <CListGroupItem>
                  <strong>Client Name:</strong>{" "}
                  {subscription.client_name || "N/A"}
                </CListGroupItem>
                <CListGroupItem>
                  <strong>Plan:</strong> {subscription.plan_id}
                </CListGroupItem>
                <CListGroupItem>
                  <strong>Status:</strong> {subscription.subscription_status}
                </CListGroupItem>
                <CListGroupItem>
                  <strong>Start Date:</strong>{" "}
                  {moment(subscription.subscription_start_date).format(
                    "DD-MM-YYYY HH:mm"
                  )}
                </CListGroupItem>
                <CListGroupItem>
                  <strong>End Date:</strong>{" "}
                  {moment(subscription.subscription_end_date).format(
                    "DD-MM-YYYY HH:mm"
                  )}
                </CListGroupItem>
                <CListGroupItem>
                  <strong>Frequency:</strong> {subscription.frequency}
                </CListGroupItem>
              </CListGroup>
            </CCardBody>
          </CCard> */}
          <CCard className="mb-4 shadow-sm border-0">
            <CCardHeader className="bg-gradient-primary text-white">
              <h4 className="mb-0">Subscription Details</h4>
            </CCardHeader>
            <CCardBody>
              <CRow className="gy-3">
                <CCol md={6}>
                  <small className="text-muted">Client ID</small>
                  <div className="fw-bold">{subscription.client_id}</div>
                </CCol>
                <CCol md={6}>
                  <small className="text-muted">Client Name</small>
                  <div className="fw-bold">
                    {subscription.client_name || "N/A"}
                  </div>
                </CCol>

                <CCol md={6}>
                  <small className="text-muted">Plan</small>
                  <div>
                    <CBadge color="success" className="px-3 py-1">
                      {subscription.plan_id.toUpperCase()}
                    </CBadge>
                  </div>
                </CCol>
                <CCol md={6}>
                  <small className="text-muted">Status</small>
                  <div>
                    <CBadge
                      color={
                        subscription.subscription_status === "subscribed"
                          ? "success"
                          : subscription.subscription_status === "expired"
                          ? "warning"
                          : "danger"
                      }
                      className="px-3 py-1"
                    >
                      {subscription.subscription_status.toUpperCase()}
                    </CBadge>
                  </div>
                </CCol>

                <CCol md={6}>
                  <small className="text-muted">Start Date</small>
                  <div className="fw-bold">
                    {moment(subscription.subscription_start_date).format(
                      "DD-MM-YYYY"
                    )}
                  </div>
                </CCol>
                <CCol md={6}>
                  <small className="text-muted">End Date</small>
                  <div className="fw-bold">
                    {moment(subscription.subscription_end_date).format(
                      "DD-MM-YYYY"
                    )}
                  </div>
                </CCol>

                <CCol md={6}>
                  <small className="text-muted">Frequency</small>
                  <div className="fw-bold">{subscription.frequency}</div>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
          <CCard className="mb-4">
            <CCardHeader className="bg-primary text-white">
              <CCardTitle className="h4">Invoice Details</CCardTitle>
            </CCardHeader>
            <CCardBody>
              {subscription?.invoice?.length === 0 ? (
                <CCardText>No invoices available.</CCardText>
              ) : (
                <CTable responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell style={{ minWidth: "350px" }}>
                        Invoice ID
                      </CTableHeaderCell>
                      <CTableHeaderCell style={{ minWidth: "150px" }}>
                        Frequency
                      </CTableHeaderCell>

                      <CTableHeaderCell style={{ minWidth: "150px" }}>
                        Start Date
                      </CTableHeaderCell>
                      <CTableHeaderCell style={{ minWidth: "150px" }}>
                        End Date
                      </CTableHeaderCell>
                      <CTableHeaderCell
                        style={{ minWidth: "400px" }}
                        className="text-center"
                      >
                        Tax Details
                      </CTableHeaderCell>
                      <CTableHeaderCell style={{ minWidth: "150px" }}>
                        Basic Amount (INR)
                      </CTableHeaderCell>
                      <CTableHeaderCell style={{ minWidth: "150px" }}>
                        Total (INR)
                      </CTableHeaderCell>
                      <CTableHeaderCell style={{ minWidth: "150px" }}>
                        Payment Status
                      </CTableHeaderCell>
                      <CTableHeaderCell style={{ minWidth: "100px" }}>
                        Action
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {subscription?.invoice?.map((invoice, index) => (
                      <CTableRow key={index}>
                        <CTableDataCell>{invoice.invoice_id}</CTableDataCell>
                        <CTableDataCell>
                          {invoice.frequency === "monthly" ? (
                            <CBadge color="success text-uppercase">
                              Monthly
                            </CBadge>
                          ) : invoice.frequency === "yearly" ? (
                            <CBadge color="warning text-uppercase">
                              Yearly
                            </CBadge>
                          ) : (
                            <CBadge color="warning text-uppercase">FREE</CBadge>
                          )}
                        </CTableDataCell>

                        <CTableDataCell>
                          {moment(invoice.start_date).format("DD-MM-YYYY")}
                        </CTableDataCell>
                        <CTableDataCell>
                          {moment(invoice.end_date).format("DD-MM-YYYY")}
                        </CTableDataCell>
                        <CTableDataCell>
                          <CRow>
                            <CCol>
                              <strong>CGST:</strong> {invoice.tax_details.cgst}
                            </CCol>
                            <CCol>
                              <strong>SGST:</strong> {invoice.tax_details.sgst}
                            </CCol>
                            <CCol>
                              <strong>IGST:</strong> {invoice.tax_details.igst}
                            </CCol>
                          </CRow>
                        </CTableDataCell>
                        <CTableDataCell>{invoice.amount}</CTableDataCell>
                        <CTableDataCell>
                          {invoice.amount +
                            invoice.tax_details.cgst +
                            invoice.tax_details.sgst +
                            invoice.tax_details.igst}
                        </CTableDataCell>
                        <CTableDataCell>
                          {invoice.status === "paid" ? (
                            <CBadge color="success text-uppercase">Paid</CBadge>
                          ) : (
                            <CBadge color="danger text-uppercase">
                              Pending
                            </CBadge>
                          )}
                        </CTableDataCell>
                        <CTableDataCell>
                          <Link
                            className="btn btn-sm btn-secondary m-1"
                            onClick={async () => {
                              setDownloadingInvoiceIds((prev) => [
                                ...prev,
                                invoice.invoice_id,
                              ]);

                              await exportToPdf(
                                subscription._id,
                                subscription.client_id,
                                subscription.plan_id,
                                subscription.client_name,
                                subscription.client_logo,
                                invoice.invoice_id,
                                invoice.frequency,
                                invoice.amount,
                                invoice.start_date,
                                invoice.end_date,
                                invoice.tax_details.cgst,
                                invoice.tax_details.sgst,
                                invoice.tax_details.igst,
                                invoice.tax_details.place_of_supply,
                                invoice.status,
                                invoice.transaction_id
                              );

                              setDownloadingInvoiceIds((prev) =>
                                prev.filter((id) => id !== invoice.invoice_id)
                              );
                            }}
                          >
                            {downloadingInvoiceIds.includes(
                              invoice.invoice_id
                            ) ? (
                              <LoadingSpinner size="sm" />
                            ) : (
                              <CIcon
                                icon={cilCloudDownload}
                                style={{ color: "white" }}
                              />
                            )}
                          </Link>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              )}
            </CCardBody>
          </CCard>
          {subscription.last_activity && (
            <LastActivity lastactivity={subscription.last_activity} />
          )}
        </>
      )}
    </div>
  );
};

export default SubscriptionViewPage;
