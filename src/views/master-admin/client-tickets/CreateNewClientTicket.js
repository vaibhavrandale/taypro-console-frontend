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
  CListGroup,
  CListGroupItem,
} from "@coreui/react";

import { departments } from "../../../data";
import "../internal-tickets/internaltickts.css";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import LoadingSpinner from "../../../components/LoadingSpinner";
const reducer = (state, action) => {
  switch (action.type) {
    case "CREATE_TICKET_REQUEST":
      return { ...state, createTicketloading: true, error: "" };
    case "CREATE_TICKET_SUCCESS":
      return {
        ...state,
        createTicketloading: false,
        client_tickets: action.payload,
      };
    case "CREATE_TICKET_FAIL":
      return { ...state, createTicketloading: false, error: action.payload };

    case "FETCH_SITEID_REQUEST":
      return { ...state, loadingSiteIds: true, error: "" };
    case "FETCH_SITEID_SUCCESS":
      return {
        ...state,
        loadingSiteIds: false,
        siteIds: action.payload,
      };
    case "FETCH_SITEID_FAIL":
      return { ...state, loadingSiteIds: false, error: action.payload };
    case "SELECT_SITENAME_REQUEST":
      return { ...state, loadingFields: true };
    case "SELECT_SITENAME_SUCCESS":
      return {
        ...state,
        loadingFields: false,
        selectedSiteName: action.payload,
      };
    case "SELECT_SITENAME_FAIL":
      return { ...state, loadingFields: false };
    default:
      return state;
  }
};
const CreateNewClientTicket = () => {
  const [
    {
      error,
      createTicketloading,
      client_tickets,
      users,
      loadingSiteIds,
      siteIds,
      loadingFields,
    },
    dispatch,
  ] = useReducer(reducer, {
    users: [],
    error: "",
    createTicketloading: false,
    client_tickets: {},
    loadingFields: false,
    loadingSites: false,
    loadingSiteIds: false,
    siteIds: [],
    fetchusersloading: false,
  });

  const [siteName, setSiteName] = useState({
    site_id: "",
  });

  const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);
  let adminroute = "";

  if (userInfo.role === "Master Admin") {
    adminroute = "master-admin";
  } else if (userInfo.role === "Service Admin") {
    adminroute = "service-admin";
  } else if (userInfo.role === "Project Admin") {
    adminroute = "project-admin";
  }

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
  });

  useEffect(() => {
    const fetchSiteIds = async () => {
      dispatch({ type: "FETCH_SITEID_REQUEST" });
      try {
        const result = await axios.get(`/api/v1/sites`, {
          headers: { Authorization: `Bearer ${authtoken}` },
        });
        dispatch({
          type: "FETCH_SITEID_SUCCESS",
          payload: result.data.data,
        });
      } catch (error) {
        dispatch({
          type: "FETCH_SITEID_FAIL",
          payload: error.response?.data?.error || "Error fetching sites",
        });
        toast.error(error.response.data.error || "Error fetching sites");
      }
    };
    fetchSiteIds();
  }, [authtoken]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSiteNameChange = (e) => {
    dispatch({ type: "SELECT_SITENAME_REQUEST" });

    const selectedSiteName = e.target.value;
    const selectedSite = siteIds.find(
      (site) => site.site_id.toString() === selectedSiteName
    );

    if (selectedSite) {
      setSiteName({
        site_id: selectedSite.site_id,
      });

      dispatch({ type: "SELECT_SITENAME_SUCCESS", payload: selectedSite });
    } else {
      dispatch({ type: "SELECT_SITENAME_FAIL" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    const data = {
      ...formData,
      ...siteName,
    };
    try {
      dispatch({ type: "CREATE_TICKET_REQUEST" });

      const response = await axios.post("/api/v1/clienttickets", data, {
        headers: { authorization: `Bearer ${authtoken}` },
      });

      console.log("Ticket successfully created:", response.data);
      dispatch({
        type: "CREATE_TICKET_SUCCESS",
        payload: response.data.data, // Append new robot to state
      });

      toast.success(response.data.message);
      navigate(`/${adminroute}/client-tickets`); // Redirect after success
    } catch (error) {
      console.error(error);
      dispatch({
        type: "CREATE_TICKET_FAIL",
        payload: error.response
          ? error.response.data.error
          : "An error occurred",
      });
      alert(error.response ? error.response.data.error : "An error occurred");
    }
  };

  return (
    <CRow className="justify-content-center mt-2">
      <CCol md={12}>
        <CCard className="shadow">
          <CCardHeader>
            <h4>Create New Client Ticket</h4>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              <CRow>
                <CCol md="6">
                  <div className="mb-3">
                    <label className="form-label">Site Id</label>
                    <CFormSelect
                      name="site_id"
                      value={siteName.site_id}
                      onChange={handleSiteNameChange}
                    >
                      <option value="">Select Site Name</option>
                      {siteIds?.length > 0 &&
                        siteIds.map((item) => (
                          <option key={item.site_id} value={item.site_id}>
                            {item.site_id}
                          </option>
                        ))}
                    </CFormSelect>
                  </div>
                </CCol>
                {/* Subject */}
                <CCol md={6}>
                  <CFormInput
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    label="Subject"
                    required
                    className="mb-3"
                  />
                </CCol>

                {/* Description */}
                <CCol md={12}>
                  <CFormTextarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    label="Description"
                    required
                    className="mb-3"
                  />
                </CCol>

                <CCol md={12}>
                  <CButton
                    className=""
                    size="sm"
                    type="submit"
                    color="primary"
                    disabled={createTicketloading}
                  >
                    {createTicketloading ? (
                      <>
                        {" "}
                        Creating... <LoadingSpinner />
                      </>
                    ) : (
                      "Create"
                    )}
                  </CButton>
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default CreateNewClientTicket;
