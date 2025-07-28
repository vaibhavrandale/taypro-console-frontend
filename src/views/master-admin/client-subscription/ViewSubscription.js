// import React from "react";

// const ViewSubscription = () => {
//   return <div>ViewSubscription</div>;
// };

// export default ViewSubscription;

import React, { useEffect, useState } from "react";
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
  CButton,
} from "@coreui/react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import moment from "moment";

const ViewSubscription = () => {
  const { id } = useParams();
  const authtoken = useSelector((state) => state.authtoken);
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`/api/v1/client-subscription/${id}`, {
          headers: { Authorization: `Bearer ${authtoken}` },
        });
        setSubscription(response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.response?.data?.error);
        toast.error(err.response?.data?.message || err.response?.data?.error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubscription();
  }, [id, authtoken]);

  if (loading) return <div className="p-4 text-center">Loading...</div>;
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

      <CCard>
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
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {subscription.invoice.map((invoice, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>{invoice.invoice_id}</CTableDataCell>
                    <CTableDataCell>{invoice.frequency}</CTableDataCell>
                    <CTableDataCell>{invoice.amount}</CTableDataCell>
                    <CTableDataCell>{invoice.status}</CTableDataCell>
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
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          )}
        </CCardBody>
      </CCard>
    </div>
  );
};

export default ViewSubscription;
