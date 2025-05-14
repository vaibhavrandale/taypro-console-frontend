// import React from "react";

// const UpdateInternalTicket = () => {
//   return <div>UpdateInternalTicket</div>;
// };

// export default UpdateInternalTicket;

import React, { useEffect, useReducer, useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CForm,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CRow,
  CCol,
  CBadge,
} from "@coreui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import LoadingSpinner from "../../../components/LoadingSpinner";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_TICKET_SUCCESS":
      return { ...state, ticket: action.payload, loading: false };
    case "FETCH_TICKET_FAIL":
      return { ...state, error: action.payload, loading: false };
    case "UPDATE_TICKET_REQUEST":
      return { ...state, updating: true };
    case "UPDATE_TICKET_SUCCESS":
      return { ...state, updating: false };
    case "UPDATE_TICKET_FAIL":
      return { ...state, updating: false, error: action.payload };
    default:
      return state;
  }
};

const UpdateInternalTicket = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const authtoken = useSelector((state) => state.authtoken);

  const [state, dispatch] = useReducer(reducer, {
    ticket: {},
    loading: true,
    error: "",
    updating: false,
  });

  const [formData, setFormData] = useState({});
  const userInfo = useSelector((state) => state.userInfo);
  let adminroute = "";

  if (userInfo.role === "Master Admin") {
    adminroute = "master-admin";
  } else if (userInfo.role === "Service Admin") {
    adminroute = "service-admin";
  } else if (userInfo.role === "Project Admin") {
    adminroute = "project-admin";
  }

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const { data } = await axios.get(`/api/v1/internaltickets/${id}`, {
          headers: { authorization: `Bearer ${authtoken}` },
        });

        dispatch({ type: "FETCH_TICKET_SUCCESS", payload: data.data });
        setFormData(data.data);
      } catch (error) {
        dispatch({
          type: "FETCH_TICKET_FAIL",
          payload: "Failed to load ticket",
        });
      }
    };
    fetchTicket();
  }, [id, authtoken]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "UPDATE_TICKET_REQUEST" });
    const {
      createdAt,
      _id,
      last_activity,
      assigned_to,
      created_by,
      ...updatedTicket
    } = formData;
    try {
      await axios.put(`/api/v1/internaltickets/${id}`, updatedTicket, {
        headers: { authorization: `Bearer ${authtoken}` },
      });
      toast.success("Ticket updated successfully");
      dispatch({ type: "UPDATE_TICKET_SUCCESS" });
      navigate(`/${adminroute}/internal-tickets`);
    } catch (error) {
      dispatch({
        type: "UPDATE_TICKET_FAIL",
        payload: error.reponse.data.message,
      });
      toast.error(error.reponse.data.message);
    }
  };

  return (
    <CCard>
      <CCardHeader>
        Update Internal Ticket -{" "}
        <CBadge color="danger">{formData.ticket_id}</CBadge>
      </CCardHeader>
      <CCardBody>
        {state.loading ? (
          <LoadingSpinner />
        ) : (
          <CForm onSubmit={handleSubmit}>
            <CRow>
              <CCol md={6}>
                <CFormInput
                  name="ticket_id"
                  value={formData.ticket_id || ""}
                  label="Ticket ID"
                  readOnly
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  name="assigned_to.name"
                  value={formData.assigned_to?.username || ""}
                  label="Assigned To"
                  onChange={handleChange}
                  readOnly
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  name="assigned_to.email"
                  value={formData.assigned_to?.email || ""}
                  label="Assigned To Email"
                  onChange={handleChange}
                  readOnly
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  name="department"
                  value={formData.department || ""}
                  label="Department"
                  readOnly
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  name="subject"
                  value={formData.subject || ""}
                  label="Subject"
                  onChange={handleChange}
                />
              </CCol>
              <CCol md={12}>
                <CFormTextarea
                  name="description"
                  value={formData.description || ""}
                  label="Description"
                  onChange={handleChange}
                />
              </CCol>
              <CCol md={6}>
                <CFormSelect
                  name="priority"
                  value={formData.priority || ""}
                  onChange={handleChange}
                  label="Priority"
                >
                  <option>Critical</option>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </CFormSelect>
              </CCol>
              <CCol md={6}>
                <CFormSelect
                  name="status"
                  value={formData.status || ""}
                  onChange={handleChange}
                  label="Status"
                >
                  <option>Open</option>
                  <option>In Progress</option>
                  <option>Resolved</option>
                </CFormSelect>
              </CCol>
              <CCol md={6}>
                <CFormInput
                  name="created_by.name"
                  value={formData.created_by?.name || ""}
                  label="Created By"
                  disabled
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  name="created_at"
                  type="datetime-local"
                  value={
                    formData.created_by?.timestamp
                      ? new Date(formData.created_by.timestamp)
                          .toISOString()
                          .slice(0, 16)
                      : ""
                  }
                  label="Created At"
                  disabled
                />
              </CCol>
              {formData.status === "Resolved" && (
                <>
                  <CCol md={6}>
                    <CFormInput
                      name="resolved_by.name"
                      value={formData.resolved_by?.name || ""}
                      label="Resolved By"
                      onChange={handleChange}
                      hidden
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormInput
                      name="resolved_at"
                      type="datetime-local"
                      hidden
                      value={
                        formData.resolved_at
                          ? new Date(formData.resolved_at)
                              .toISOString()
                              .slice(0, 16)
                          : ""
                      }
                      label="Resolved At"
                      onChange={handleChange}
                    />
                  </CCol>
                </>
              )}
              <CCol md={12}>
                <CFormTextarea
                  name="resolution_notes"
                  value={formData.resolution_notes || ""}
                  label="Resolution Notes"
                  onChange={handleChange}
                />
              </CCol>
            </CRow>
            <CButton
              size="sm"
              className="mt-4"
              type="submit"
              color="primary"
              disabled={state.updating}
            >
              {state.updating ? (
                <>
                  Updating...
                  <LoadingSpinner />
                </>
              ) : (
                "Update Ticket"
              )}
            </CButton>
          </CForm>
        )}
      </CCardBody>
    </CCard>
  );
};

export default UpdateInternalTicket;
