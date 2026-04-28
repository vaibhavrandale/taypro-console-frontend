import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  CForm,
  CFormInput,
  CButton,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
} from "@coreui/react";
import toast from "react-hot-toast";
import LoadingSpinner from "../../../components/LoadingSpinner";

const UpdateServiceTicketsFault = () => {
  const { id } = useParams();
  // const authtoken = useSelector((state) => state.authtoken);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [faultName, setFaultName] = useState("");
  const [targetDays, setTargetDays] = useState("");

  useEffect(() => {
    const fetchFaultData = async () => {
      try {
        const response = await axios.get(`/api/v1/serviceticketsfaults/${id}`, {
          // headers: { Authorization: `Bearer ${authtoken}` },
          withCredentials: true,
        });
        if (response.data.success) {
          const fault = response.data.data;
          setFaultName(fault.fault_name || "");
          setTargetDays(fault.target_days || "");
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.error || "Failed to fetch fault details",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFaultData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        fault_name: faultName,
        target_days: targetDays,
      };

      const response = await axios.put(
        `/api/v1/serviceticketsfaults/${id}`,
        payload,
        {
          // headers: { Authorization: `Bearer ${authtoken}` },
          withCredentials: true,
        },
      );

      if (response.data.success) {
        toast.success("Service Ticket Fault Updated Successfully");
        navigate(-1); // 👈 go back to previous page
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.error || "Failed to update fault details",
      );
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <CCard>
      <CCardHeader>
        <h4>Update Service Ticket Fault</h4>
      </CCardHeader>
      <CCardBody>
        <CForm onSubmit={handleSubmit}>
          <CRow className="mb-3">
            <CCol md={6}>
              <label>Fault Name</label>
              <CFormInput
                type="text"
                value={faultName}
                onChange={(e) => setFaultName(e.target.value)}
                required
              />
            </CCol>
            <CCol md={6}>
              <label>Target Days</label>
              <CFormInput
                type="number"
                value={targetDays}
                onChange={(e) => setTargetDays(e.target.value)}
                required
              />
            </CCol>
          </CRow>
          <div className="d-flex justify-content-end">
            <CButton type="submit" color="primary">
              Update
            </CButton>
          </div>
        </CForm>
      </CCardBody>
    </CCard>
  );
};

export default UpdateServiceTicketsFault;
