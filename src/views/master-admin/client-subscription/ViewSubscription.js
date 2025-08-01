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
  CModal,
  CModalHeader,
  CModalBody,
  CFormCheck,
  CModalFooter,
  CButton,
  CModalTitle,
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
import { cilCloudDownload, cilX } from "@coreui/icons";
import html2pdf from "html2pdf.js";
import headerImage from "../../../assets/brand/letterheader.png";
import footerImage from "../../../assets/brand/letterfooter.png";

const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_REQUEST":
      return { ...state, updatingStatusLoading: true, updateError: "" };

    case "UPDATE_SUCCESS":
      return {
        ...state,
        updatingStatusLoading: false,
        subscription: {
          ...state.subscription,
          invoice: state.subscription.invoice.map((inv) =>
            inv.invoice_id === action.payload.invoice_id
              ? { ...inv, status: action.payload.status }
              : inv
          ),
        },
      };

    case "UPDATE_FAIL":
      return {
        ...state,
        updatingStatusLoading: false,
        updateError: action.payload,
      };
    case "SET_SUBSCRIPTION":
      return {
        ...state,
        subscription: action.payload,
      };
    default:
      return state;
  }
};

const ViewSubscription = () => {
  const { id } = useParams();
  const authtoken = useSelector((state) => state.authtoken);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const [{ subscription, updatingStatusLoading, updateError }, dispatch] =
    useReducer(reducer, {
      subscription: null,
      updatingStatusLoading: false,
      updateError: "",
    });

  useEffect(() => {
    const fetchSubscription = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`/api/v1/client-subscription/${id}`, {
          headers: { Authorization: `Bearer ${authtoken}` },
        });
        dispatch({ type: "SET_SUBSCRIPTION", payload: response.data });
      } catch (err) {
        const msg = err.response?.data?.message || err.response?.data?.error;
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchSubscription();
  }, [id, authtoken]);

  const handleOpenStatusModal = (subscriptionId, invoiceId, currentStatus) => {
    setSelectedStatus(currentStatus);
    setSelectedInvoice({
      subscription_id: subscriptionId,
      invoice_id: invoiceId,
    });
    setShowStatusModal(true);
  };

  const handlePaymentStatusUpdate = async () => {
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      const { subscription_id, invoice_id } = selectedInvoice;
      const result = await axios.put(
        `/api/v1/client-subscription/update-payment-status/${subscription_id}/${invoice_id}`,
        { status: selectedStatus },
        {
          headers: { Authorization: `Bearer ${authtoken}` },
        }
      );
      dispatch({
        type: "UPDATE_SUCCESS",
        payload: { invoice_id, status: selectedStatus },
      });
      toast.success(result.data.message);
      setShowStatusModal(false);
    } catch (error) {
      const msg = error.response?.data?.message || error.response?.data?.error;
      dispatch({ type: "UPDATE_FAIL", payload: msg });
      toast.error(msg);
    }
  };

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
    invoice_id,
    frequency,
    amount,
    start_date,
    end_date,
    cgst,
    sgst,
    igst,
    place_of_supply
  ) => {
    const headerBase64 = await getBase64ImageFromURL(headerImage);
    const footerBase64 = await getBase64ImageFromURL(footerImage);

    const content = `
  <div style="font-family: Arial, sans-serif; font-size: 14px; color: #000; background-color: #fff; display: flex; flex-direction: column; min-height: 1120px; padding: 20px 40px 120px 40px; position: relative; box-sizing: border-box;">

    <div>
      <img src="${headerBase64}" style="width: 100%; height: auto; margin-bottom: 20px;" />
    </div>

    <div style="flex: 1;">
      <h2 style="text-align: center; margin-bottom: 20px;">Invoice</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px;"><strong>Invoice ID:</strong></td><td style="padding: 8px;">${invoice_id}</td></tr>
        <tr><td style="padding: 8px;"><strong>Frequency:</strong></td><td style="padding: 8px;">${frequency}</td></tr>
        <tr><td style="padding: 8px;"><strong>Amount (INR):</strong></td><td style="padding: 8px;">₹${amount}</td></tr>
        <tr><td style="padding: 8px;"><strong>Start Date:</strong></td><td style="padding: 8px;">${moment(
          start_date
        ).format("DD-MM-YYYY HH:mm")}</td></tr>
        <tr><td style="padding: 8px;"><strong>End Date:</strong></td><td style="padding: 8px;">${moment(
          end_date
        ).format("DD-MM-YYYY HH:mm")}</td></tr>
        <tr><td style="padding: 8px;"><strong>CGST:</strong></td><td style="padding: 8px;">₹${cgst}</td></tr>
        <tr><td style="padding: 8px;"><strong>SGST:</strong></td><td style="padding: 8px;">₹${sgst}</td></tr>
        <tr><td style="padding: 8px;"><strong>IGST:</strong></td><td style="padding: 8px;">₹${igst}</td></tr>
        <tr><td style="padding: 8px;"><strong>Place of Supply:</strong></td><td style="padding: 8px;">${place_of_supply}</td></tr>
      </table>
    </div>

    <div style="width: 100%; position: absolute; bottom: 0; left: 0; padding: 0 40px;">
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

  if (loading)
    return (
      <div className="p-4 text-center">
        <LoadingSpinner />
      </div>
    );
  if (error) return <div className="p-4 text-red-500 text-center">{error}</div>;
  if (!subscription)
    return <div className="p-4 text-center">No subscription found</div>;

  return (
    <div className="p-4">
      <CCard className="mb-4">
        <CCardHeader className="bg-primary text-white">
          <CCardTitle className="h4">Subscription Details</CCardTitle>
        </CCardHeader>
        <CCardBody>
          <CListGroup flush>
            <CListGroupItem>
              <strong>Client ID:</strong> {subscription.client_id}
            </CListGroupItem>
            <CListGroupItem>
              <strong>Client Name:</strong> {subscription.client_name || "N/A"}
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
      </CCard>

      <CCard className="mb-4">
        <CCardHeader className="bg-primary text-white">
          <CCardTitle className="h4">Invoice Details</CCardTitle>
        </CCardHeader>
        <CCardBody>
          {subscription.invoice.length === 0 ? (
            <CCardText>No invoices available.</CCardText>
          ) : (
            <CTable responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell style={{ minWidth: "150px" }}>
                    Invoice ID
                  </CTableHeaderCell>
                  <CTableHeaderCell style={{ minWidth: "150px" }}>
                    Frequency
                  </CTableHeaderCell>
                  <CTableHeaderCell style={{ minWidth: "150px" }}>
                    Amount (INR)
                  </CTableHeaderCell>
                  <CTableHeaderCell style={{ minWidth: "150px" }}>
                    Status
                  </CTableHeaderCell>
                  <CTableHeaderCell style={{ minWidth: "150px" }}>
                    Start Date
                  </CTableHeaderCell>
                  <CTableHeaderCell style={{ minWidth: "150px" }}>
                    End Date
                  </CTableHeaderCell>
                  <CTableHeaderCell style={{ minWidth: "400px" }}>
                    Tax Details
                  </CTableHeaderCell>
                  <CTableHeaderCell style={{ minWidth: "200px" }}>
                    Action
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {subscription.invoice.map((invoice, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>{invoice.invoice_id}</CTableDataCell>
                    <CTableDataCell>{invoice.frequency}</CTableDataCell>
                    <CTableDataCell>{invoice.amount}</CTableDataCell>
                    <CTableDataCell>
                      {invoice.status === "paid" ? (
                        <CBadge color="success">Paid</CBadge>
                      ) : (
                        <CBadge color="danger">Pending</CBadge>
                      )}
                    </CTableDataCell>
                    <CTableDataCell>
                      {moment(invoice.start_date).format("DD-MM-YYYY HH:mm")}
                    </CTableDataCell>
                    <CTableDataCell>
                      {moment(invoice.end_date).format("DD-MM-YYYY HH:mm")}
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
                        <CCol>
                          <strong>Place of Supply:</strong>{" "}
                          {invoice.tax_details.place_of_supply}
                        </CCol>
                      </CRow>
                    </CTableDataCell>
                    <CTableDataCell>
                      <Link
                        className="btn btn-sm btn-secondary m-1"
                        onClick={() =>
                          handleOpenStatusModal(
                            subscription._id,
                            invoice.invoice_id,
                            invoice.status
                          )
                        }
                      >
                        Update Status
                      </Link>

                      <Link
                        className="btn btn-sm btn-secondary m-1"
                        onClick={() =>
                          exportToPdf(
                            invoice.invoice_id,
                            invoice.frequency,
                            invoice.amount,
                            invoice.start_date,
                            invoice.end_date,
                            invoice.tax_details.cgst,
                            invoice.tax_details.sgst,
                            invoice.tax_details.igst,
                            invoice.tax_details.place_of_supply
                          )
                        }
                      >
                        <CIcon
                          icon={cilCloudDownload}
                          style={{ color: "white" }}
                        />
                      </Link>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          )}
        </CCardBody>
      </CCard>

      <CCard className="mb-4">
        <CCardHeader className="bg-primary text-white">
          Admin Last Activity
        </CCardHeader>
        <CCardBody>
          {subscription.admin_last_activity && (
            <LastActivity lastactivity={subscription.admin_last_activity} />
          )}
        </CCardBody>
      </CCard>

      <CCard className="mb-4">
        <CCardHeader className="bg-primary text-white">
          Last Activity
        </CCardHeader>
        <CCardBody>
          {subscription.last_activity && (
            <LastActivity lastactivity={subscription.last_activity} />
          )}
        </CCardBody>
      </CCard>

      <CModal
        scrollable
        backdrop="static"
        visible={showStatusModal}
        onClose={() => setShowStatusModal(false)}
      >
        <CModalHeader closeButton={false}>
          <CModalTitle>Update Invoice Status</CModalTitle>
          <button
            type="button"
            className="border-0 ms-auto py-0 px-1"
            onClick={() => setShowStatusModal(false)}
            style={{ background: "none" }}
          >
            <CIcon icon={cilX} size="lg" />
          </button>
        </CModalHeader>
        <CModalBody>
          <div className="my-2">
            <CFormCheck
              type="radio"
              label="Paid"
              name="invoiceStatus"
              checked={selectedStatus === "paid"}
              onChange={() => setSelectedStatus("paid")}
            />
            <CFormCheck
              type="radio"
              label="Pending"
              name="invoiceStatus"
              checked={selectedStatus === "pending"}
              onChange={() => setSelectedStatus("pending")}
            />
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            size="sm"
            onClick={() => setShowStatusModal(false)}
          >
            Cancel
          </CButton>
          <CButton
            color="primary"
            size="sm"
            onClick={handlePaymentStatusUpdate}
          >
            {updatingStatusLoading ? <LoadingSpinner /> : "Save"}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default ViewSubscription;
