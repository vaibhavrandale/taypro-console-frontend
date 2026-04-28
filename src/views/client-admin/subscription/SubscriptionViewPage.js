import React, { useEffect, useReducer, useState } from "react";
import {
  CCard,
  CCardHeader,
  CCardBody,
  CCardTitle,
  CCardText,
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
import { cilCloudDownload, cilWarning } from "@coreui/icons";
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
        subscription: action.payload.data,
      };
    case "FETCH_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
        subscription: null,
      };
    default:
      return state;
  }
};

const SubscriptionViewPage = () => {
  const [{ loading, error, subscription }, dispatch] = useReducer(reducer, {
    subscription: null,
    loading: true,
    error: "",
  });
  const { id } = useParams();
  // const authtoken = useSelector((state) => state.authtoken);
  const [downloadingInvoiceIds, setDownloadingInvoiceIds] = useState([]);
  const userInfo = useSelector((state) => state.userInfo);
  useEffect(() => {
    const fetchSubscriptions = async () => {
      dispatch({ type: "FETCH_REQUEST" });

      try {
        const response = await axios.get(
          `/api/v1/client-subscription/get-subscriptions`,
          {
            // headers: { Authorization: `Bearer ${authtoken}` },
            withCredentials: true,
          },
        );

        const result = response.data.data;
        dispatch({
          type: "FETCH_SUCCESS",
          payload: {
            data: result,
          },
        });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: error.response?.data?.message || error.response?.data?.error,
        });
        toast.error(
          error.response?.data?.message || error.response?.data?.error,
        );
      }
    };
    fetchSubscriptions();
  }, [id]);

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

  // if (!subscription) {
  //   return (
  //     <>
  //       <CCard className="shadow-lg  border-2 p-5">
  //         <CCardBody>
  //           <div className="d-flex align-items-center justify-content-center flex-column">
  //             <div className="d-flex mb-3 align-items-center">
  //               <CIcon icon={cilWarning} className="me-2 text-warning" />
  //               <h5 className="mb-0">
  //                 You haven't Activated any subscriptions, Please Subscribe !
  //               </h5>
  //             </div>
  //             <Link
  //               to={`/${adminroute}/pricing`}
  //               className="btn btn-success btn-sm"
  //             >
  //               View Pricing
  //             </Link>
  //           </div>
  //         </CCardBody>
  //       </CCard>
  //     </>
  //   );
  // }

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
  useEffect(() => {
    console.log("Runs once (mount)");
  }, []);

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
    transaction_id,
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

  const invoice =
    subscription && subscription.invoice[subscription.invoice.length - 1];

  return (
    <div className="">
      {loading ? (
        <LoadingSpinner />
      ) : !subscription ? (
        <CCard className="shadow-lg  border-2 p-5">
          <CCardBody>
            <div className="d-flex align-items-center justify-content-center flex-column">
              <div className="d-flex mb-3 align-items-center">
                <CIcon icon={cilWarning} className="me-2 text-warning" />
                <h5 className="mb-0">
                  You haven't Activated any subscriptions, Please Subscribe !
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
      ) : error ? (
        <span className="text-center ">{error}</span>
      ) : (
        <>
          <CRow>
            <CCol md={6}>
              <CCard className="my-2 shadow-sm border-0">
                <CCardHeader className="bg-gradient-primary text-white">
                  <h4 className="mb-0">Subscription Details</h4>
                </CCardHeader>
                <CCardBody>
                  <CRow className="gy-3">
                    <CCol md={6}>
                      <small className="text-success">Client ID</small>
                      <div className="">{subscription?.client_id}</div>
                    </CCol>
                    <CCol md={6}>
                      <small className="text-success">Client Name</small>
                      <div className="">
                        {subscription?.client_name || "N/A"}
                      </div>
                    </CCol>

                    <CCol md={6}>
                      <small className="text-success">Plan</small>
                      <div>
                        <CBadge color="success" className="px-2 py-1">
                          {subscription?.plan_id.toUpperCase()}
                        </CBadge>
                      </div>
                    </CCol>
                    <CCol md={6}>
                      <small className="text-success">Status</small>
                      <div>
                        <CBadge
                          color={
                            subscription.subscription_status === "subscribed"
                              ? "success"
                              : subscription.subscription_status === "expired"
                                ? "warning"
                                : "danger"
                          }
                          className="px-2 py-1"
                        >
                          {subscription?.subscription_status.toUpperCase()}
                        </CBadge>
                      </div>
                    </CCol>

                    <CCol md={6}>
                      <small className="text-success">Start Date</small>
                      <div className="">
                        {moment(subscription.subscription_start_date).format(
                          "DD-MM-YYYY",
                        )}
                      </div>
                    </CCol>
                    <CCol md={6}>
                      <small className="text-success">End Date</small>
                      <div className="">
                        {moment(subscription.subscription_end_date).format(
                          "DD-MM-YYYY",
                        )}
                      </div>
                    </CCol>

                    <CCol md={6}>
                      <small className="text-success">Frequency</small>
                      <div>
                        <CBadge color="warning">
                          {subscription?.frequency.toUpperCase()}
                        </CBadge>
                      </div>
                    </CCol>
                    <CCol md={6}>
                      <small className="text-success">Payment Status</small>
                      <div>
                        {" "}
                        <CBadge
                          color={`${
                            invoice.status === "paid" ? "success" : "danger"
                          }`}
                        >
                          {invoice.status === "paid" ? "Paid" : "Pending"}
                        </CBadge>
                      </div>
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol md={6}>
              <CCard
                className="my-2 shadow-sm border-0"
                style={{ minHeight: "320px" }}
              >
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
                          {/* <CTableHeaderCell
                            style={{ minWidth: "400px" }}
                            className="text-center"
                          >
                            Tax Details
                          </CTableHeaderCell> */}
                          {/* <CTableHeaderCell style={{ minWidth: "150px" }}>
                            Basic Amount (INR)
                          </CTableHeaderCell>
                          <CTableHeaderCell style={{ minWidth: "150px" }}>
                            Total (INR)
                          </CTableHeaderCell>
                          <CTableHeaderCell style={{ minWidth: "150px" }}>
                            Payment Status
                          </CTableHeaderCell> */}
                          {/* <CTableHeaderCell style={{ minWidth: "100px" }}>
                            Action
                          </CTableHeaderCell> */}
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {subscription?.invoice?.map((invoice, index) => (
                          <CTableRow key={index}>
                            <CTableDataCell>
                              {invoice.invoice_id}
                            </CTableDataCell>
                            <CTableDataCell>
                              {invoice.frequency === "monthly" ? (
                                <CBadge color="warning text-uppercase">
                                  Monthly
                                </CBadge>
                              ) : invoice.frequency === "yearly" ? (
                                <CBadge color="warning text-uppercase">
                                  Yearly
                                </CBadge>
                              ) : (
                                <CBadge color="warning text-uppercase">
                                  FREE
                                </CBadge>
                              )}
                            </CTableDataCell>

                            <CTableDataCell>
                              {moment(invoice.start_date).format("DD-MM-YYYY")}
                            </CTableDataCell>
                            <CTableDataCell>
                              {moment(invoice.end_date).format("DD-MM-YYYY")}
                            </CTableDataCell>
                            {/* <CTableDataCell>
                              <CRow>
                                <CCol>
                                  <strong>CGST:</strong>{" "}
                                  {invoice.tax_details.cgst}
                                </CCol>
                                <CCol>
                                  <strong>SGST:</strong>{" "}
                                  {invoice.tax_details.sgst}
                                </CCol>
                                <CCol>
                                  <strong>IGST:</strong>{" "}
                                  {invoice.tax_details.igst}
                                </CCol>
                              </CRow>
                            </CTableDataCell>
                            <CTableDataCell>{invoice.amount}</CTableDataCell>
                            <CTableDataCell>
                              {invoice.amount +
                                invoice.tax_details.cgst +
                                invoice.tax_details.sgst +
                                invoice.tax_details.igst}
                            </CTableDataCell> */}
                            {/* <CTableDataCell>
                              {invoice.status === "paid" ? (
                                <CBadge color="success text-uppercase">
                                  Paid
                                </CBadge>
                              ) : (
                                <CBadge color="danger text-uppercase">
                                  Pending
                                </CBadge>
                              )}
                            </CTableDataCell> */}
                            {/* <CTableDataCell>
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
                                    prev.filter(
                                      (id) => id !== invoice.invoice_id
                                    )
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
                            </CTableDataCell> */}
                          </CTableRow>
                        ))}
                      </CTableBody>
                    </CTable>
                  )}
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>

          {subscription?.last_activity && (
            <LastActivity lastactivity={subscription?.last_activity} />
          )}
        </>
      )}
    </div>
  );
};

export default SubscriptionViewPage;
