import React, { useEffect, useReducer, useState } from "react";
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CBadge,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormInput,
  CRow,
  CCol,
  CImage,
  CTooltip,
  CCarouselItem,
  CCarousel,
} from "@coreui/react";

import LoadingSpinner from "../../../components/LoadingSpinner";
import "./servicetickts.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import LastActivity from "../../../components/LastActivity";
import { formatDistanceToNow } from "date-fns";
import PaginateInput from "../../../components/PaginateInput";
import CIcon from "@coreui/icons-react";
import { cilX } from "@coreui/icons";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };

    case "FETCH_SUCCESS":
      return {
        ...state,
        servicetickets: action.payload.data,
        totalPages: action.payload.totalPages, // Use API-provided totalPages
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
        loading: false,
      };

    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "FETCH_TICKET_REQUEST":
      return { ...state, fetchserviceticketloading: true };

    case "FETCH_TICKET_SUCCESS":
      return {
        ...state,
        serviceticket: action.payload,
        fetchserviceticketloading: false,
      };

    case "FETCH_TICKET_FAIL":
      return {
        ...state,
        fetchserviceticketloading: false,
        error: action.payload,
      };
    case "UPDATE_TICKET_REQUEST":
      return { ...state, updateserviceticketloading: true };

    case "UPDATE_TICKET_SUCCESS":
      return {
        ...state,
        serviceticket: action.payload,
        updateserviceticketloading: false,
      };

    case "UPDATE_TICKET_FAIL":
      return {
        ...state,
        updateserviceticketloading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

const SiteTechnicianServiceTicketDashboard = () => {
  const [
    {
      loading,
      servicetickets,
      serviceticket,
      fetchserviceticketloading,
      updateserviceticketloading,
      totalPages,
      hasNextPage,
      hasPrevPage,
    },
    dispatch,
  ] = useReducer(reducer, {
    servicetickets: [],
    serviceticket: [],
    loading: true,
    fetchserviceticketloading: true,
    updateserviceticketloading: true,
    error: "",
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const authtoken = useSelector((state) => state.authtoken);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const userInfo = useSelector((state) => state.userInfo);
  let adminroute = "";

  if (userInfo.role === "Master Admin") {
    adminroute = "master-admin";
  } else if (userInfo.role === "Service Admin") {
    adminroute = "service-admin";
  } else if (userInfo.role === "Project Admin") {
    // eslint-disable-next-line no-unused-vars
    adminroute = "project-admin";
  }

  const openViewModal = async (id) => {
    setViewModalVisible(true);

    try {
      dispatch({ type: "FETCH_TICKET_REQUEST" });
      const response = await axios.get(`/api/v1/servicetickets/getone/${id}`, {
        headers: { Authorization: `Bearer ${authtoken}` },
      });

      let result = response.data.data;

      dispatch({ type: "FETCH_TICKET_SUCCESS", payload: result });
    } catch (error) {
      console.error("Error fetching ticket:", error);
      dispatch({ type: "FETCH_TICKET_FAIL", payload: error });
    }
  };

  // 📌 Handle input change in modal
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (id) => {
    try {
      dispatch({ type: "UPDATE_TICKET_REQUEST" });
      await axios.put(`/api/v1/servicetickets/${id}`, formData, {
        headers: { Authorization: `Bearer ${authtoken}` },
      });
      setModalVisible(false);

      // Update local state with the modified ticket
      dispatch({
        type: "UPDATE_TICKET_SUCCESS",
        payload: servicetickets.map((ticket) =>
          ticket.id === id ? { ...ticket, ...formData } : ticket
        ),
      });
    } catch (error) {
      dispatch({ type: "UPDATE_TICKET_FAIL", payload: error });
      console.error("Error updating ticket:", error);
    }
  };

  const [pageInput, setPageInput] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    let pagination = {
      pg: page,
      limit: limit,
    };
    const fetchServicetickets = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const response = await axios.post(
          `/api/v1/servicetickets/get-sitewise-servicetickets`,
          pagination,
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );

        let total = Math.ceil(
          Number(response.data.total) / Number(response.data.limit)
        );
        let next = response.data.hasNextPage;
        let prev = response.data.hasPrevPage;
        let result = response.data.data;

        dispatch({
          type: "FETCH_SUCCESS",
          payload: {
            data: result,
            totalPages: total,
            hasNextPage: next,
            hasPrevPage: prev,
          },
        });
      } catch (error) {
        console.error("Error fetching notifications:", error);
        dispatch({
          type: "FETCH_FAIL",
          payload: error,
        });
      }
    };

    fetchServicetickets();
  }, [authtoken, limit, page]);

  const filteredData = servicetickets
    ? servicetickets.filter(
        (item) =>
          item.ticket_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.robot_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.deveui.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.site_id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handlePageInputChange = (e) => {
    setPageInput(e.target.value);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handlePageInputSubmit = () => {
    const pageNumber = parseInt(pageInput);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      handlePageChange(pageNumber);
    }
  };

  return (
    <div className="">
      <h4 className="text-center">All Service Tickets</h4>

      {/* 📋 Service Tickets Table */}
      <div className="mt-4">
        <div className="m-2 d-flex justify-content-end align-items-center">
          <Link to="create-new-ticket" className="btn btn-sm btn-primary">
            NEW
          </Link>
        </div>

        <div>
          <CRow className="justify-content-end">
            <CCol md={5} lg={4}>
              <CFormInput
                type="text"
                placeholder="Search by Robot No, Deveui, or Site ID"
                className="mb-3"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </CCol>
          </CRow>
          <CTable bordered hover responsive className="text-center">
            <CTableHead color="secondary">
              <CTableRow>
                <CTableHeaderCell>Serial</CTableHeaderCell>
                <CTableHeaderCell className="sticky-col">
                  Ticket ID
                </CTableHeaderCell>
                <CTableHeaderCell>Robot No</CTableHeaderCell>
                <CTableHeaderCell>Site ID</CTableHeaderCell>
                <CTableHeaderCell>Fault Type</CTableHeaderCell>

                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell>created At</CTableHeaderCell>
                <CTableHeaderCell>Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {loading ? (
                <CTableRow>
                  <CTableDataCell colSpan="8" className="text-center">
                    <LoadingSpinner />
                  </CTableDataCell>
                </CTableRow>
              ) : filteredData.length === 0 ? (
                <CTableRow>
                  {" "}
                  <CTableDataCell colSpan="8" className="text-center">
                    No Tickets Found{" "}
                  </CTableDataCell>
                </CTableRow>
              ) : (
                filteredData.map((ticket, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>{index + 1}</CTableDataCell>
                    <CTableDataCell
                      style={{ minWidth: "240px" }}
                      className="sticky-col"
                    >
                      {ticket.ticket_id}
                    </CTableDataCell>
                    <CTableDataCell style={{ minWidth: "150px" }}>
                      {ticket.robot_no}
                    </CTableDataCell>
                    <CTableDataCell style={{ minWidth: "150px" }}>
                      {ticket.site_id}
                    </CTableDataCell>
                    <CTableDataCell style={{ minWidth: "150px" }}>
                      {ticket.fault_type}
                    </CTableDataCell>
                    <CTableDataCell style={{ minWidth: "150px" }}>
                      {ticket.ticket_resolved ? (
                        <CBadge color="success">Resolved</CBadge>
                      ) : (
                        <CBadge color="danger">Open</CBadge>
                      )}
                    </CTableDataCell>
                    <CTableDataCell style={{ minWidth: "150px" }}>
                      {/* {ticket.createdAt} */}
                      <span className="">
                        <CTooltip
                          content={new Date(ticket.createdAt).toLocaleString()}
                          placement="top"
                        >
                          <span>
                            {formatDistanceToNow(new Date(ticket.createdAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </CTooltip>
                      </span>
                    </CTableDataCell>
                    <CTableDataCell style={{ minWidth: "210px" }}>
                      <CButton
                        color="secondary"
                        size="sm"
                        className="m-1"
                        onClick={() => openViewModal(ticket._id)}
                      >
                        View
                      </CButton>

                      {userInfo.role === "Master Admin" && (
                        <Link
                          color="primary"
                          size="sm"
                          className="m-1 btn btn-sm btn-primary text-decoration-none"
                          to={`update-service-ticket/${ticket._id}`}
                        >
                          Update
                        </Link>
                      )}

                      {ticket.ticket_resolved ? (
                        ""
                      ) : (
                        <Link
                          size="sm"
                          className="m-1 btn btn-sm btn-secondary text-decoration-none"
                          to={`resolve-service-ticket/${ticket._id}`}
                        >
                          Resolve
                        </Link>
                      )}
                    </CTableDataCell>
                  </CTableRow>
                ))
              )}
            </CTableBody>
          </CTable>

          <PaginateInput
            page={page}
            totalPages={totalPages}
            hasPrevPage={hasPrevPage}
            hasNextPage={hasNextPage}
            pageInput={pageInput}
            handlePageChange={handlePageChange}
            handlePageInputChange={handlePageInputChange}
            handlePageInputSubmit={handlePageInputSubmit}
            limit={limit}
            handleLimitChange={setLimit} // New prop
          />
        </div>
      </div>

      {/* 📌 View Modal */}
      <CModal
        scrollable
        size="xl"
        backdrop="static"
        visible={viewModalVisible}
        onClose={() => setViewModalVisible(false)}
      >
        {fetchserviceticketloading ? (
          <CModalBody className="d-flex justify-content-center align-items-center">
            <LoadingSpinner />
          </CModalBody>
        ) : (
          <>
            <CModalHeader closeButton={false}>
              <CModalTitle>
                Details :{" "}
                <span className="badge bg-danger">
                  {serviceticket.ticket_id}
                </span>
              </CModalTitle>
              <button
                type="button"
                className="border-0 ms-auto py-0 px-1"
                onClick={() => setViewModalVisible(false)}
                style={{ background: "none" }}
              >
                <CIcon icon={cilX} size="lg" />
              </button>
            </CModalHeader>

            <CModalBody>
              {/* Ticket Details Table */}
              <CTable striped hover bordered responsive>
                <CTableBody>
                  <CTableRow>
                    <CTableHeaderCell>Ticket ID</CTableHeaderCell>
                    <CTableDataCell>{serviceticket.ticket_id}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Robot No</CTableHeaderCell>
                    <CTableDataCell>{serviceticket.robot_no}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Deveui</CTableHeaderCell>
                    <CTableDataCell>{serviceticket.deveui}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Robot Type</CTableHeaderCell>
                    <CTableDataCell>{serviceticket.robot_type}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Site ID</CTableHeaderCell>
                    <CTableDataCell>{serviceticket.site_id}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Company</CTableHeaderCell>
                    <CTableDataCell>{serviceticket.company}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Fault Type</CTableHeaderCell>
                    <CTableDataCell>{serviceticket.fault_type}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Ticket Generated At</CTableHeaderCell>
                    <CTableDataCell>
                      {new Date(serviceticket.createdAt).toLocaleString()}
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Generated By</CTableHeaderCell>
                    <CTableDataCell>
                      {serviceticket.ticket_generated_by}
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Generated By Email</CTableHeaderCell>
                    <CTableDataCell>
                      {serviceticket.ticket_generated_by_email}
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Generating Notes</CTableHeaderCell>
                    <CTableDataCell>
                      {serviceticket.ticket_generating_notes}
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Ticket Resolved</CTableHeaderCell>
                    <CTableDataCell>
                      {serviceticket.ticket_resolved ? (
                        <CBadge color="success">Resolved</CBadge>
                      ) : (
                        <CBadge color="danger">Open</CBadge>
                      )}
                    </CTableDataCell>
                  </CTableRow>

                  {serviceticket.ticket_resolved && (
                    <>
                      <CTableRow>
                        <CTableHeaderCell>Ticket Resolved At</CTableHeaderCell>
                        <CTableDataCell>
                          {new Date(serviceticket.updatedAt).toLocaleString()}
                        </CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableHeaderCell>Resolved By</CTableHeaderCell>
                        <CTableDataCell>
                          {serviceticket.ticket_resolved_by}
                        </CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableHeaderCell>Resolved By Email</CTableHeaderCell>
                        <CTableDataCell>
                          {serviceticket.ticket_resolved_by_email}
                        </CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableHeaderCell>Resolving Notes</CTableHeaderCell>
                        <CTableDataCell>
                          {serviceticket.ticket_resolving_notes}
                        </CTableDataCell>
                      </CTableRow>
                      {serviceticket.part_checklist.some(
                        (item) => item.checklist
                      ) && (
                        <CTableRow>
                          <CTableHeaderCell>
                            Fault Analysis Checklist
                          </CTableHeaderCell>
                          <CTableDataCell>
                            {serviceticket.part_checklist.map((item, index) =>
                              item.checklist ? (
                                <div key={index} className="mb-2">
                                  <span className="mb-0">
                                    {Object.entries(item.checklist).map(
                                      ([key, value], idx) => (
                                        <li key={idx}>
                                          <strong>
                                            {key.replace(/_/g, " ")}:
                                          </strong>{" "}
                                          {value}
                                        </li>
                                      )
                                    )}
                                  </span>
                                </div>
                              ) : null
                            )}
                          </CTableDataCell>
                        </CTableRow>
                      )}

                      {/* <CTableRow>
                        <CTableHeaderCell>
                          Fault Analysis Checklist
                        </CTableHeaderCell>
                        <CTableDataCell>
                          {serviceticket.part_checklist.map((item, index) => (
                            <div key={index} className="mb-2">
                              {item.checklist ? (
                                <span className="mb-0">
                                  {Object.entries(item.checklist).map(
                                    ([key, value], idx) => (
                                      <li key={idx}>
                                        <strong>
                                          {key.replace(/_/g, " ")}:
                                        </strong>{" "}
                                        {value}
                                      </li>
                                    )
                                  )}
                                </span>
                              ) : (
                                <div className="text-muted">
                                  No checklist available
                                </div>
                              )}
                            </div>
                          ))}
                        </CTableDataCell>
                      </CTableRow> */}
                    </>
                  )}
                </CTableBody>
              </CTable>

              {/* Ticket Generated Images Carousel */}
              {(() => {
                const generatedImages = [
                  serviceticket.ticket_generated_images1,
                  serviceticket.ticket_generated_images2,
                  serviceticket.ticket_generated_images3,
                  serviceticket.ticket_generated_images4,
                  serviceticket.ticket_generated_images5,
                ].filter(Boolean);

                if (generatedImages.length === 0) {
                  return (
                    <div className="text-center text-muted my-2">
                      No Generated Images Available
                    </div>
                  );
                }

                return (
                  <>
                    <h6 className="mt-3">Ticket Generating Images</h6>
                    <CCarousel
                      controls={generatedImages.length > 1}
                      indicators={generatedImages.length > 1}
                      dark
                    >
                      {generatedImages.map((img, index) => (
                        <CCarouselItem key={index}>
                          <div
                            style={{
                              height: "500px",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              overflow: "hidden",
                            }}
                          >
                            <Link to={img} target="_blank">
                              <CImage
                                className="d-block mx-auto"
                                src={img}
                                alt={`Generated Image ${index + 1}`}
                                style={{
                                  maxHeight: "100%",
                                  maxWidth: "70%",
                                  objectFit: "contain",
                                  display: "block",
                                  margin: "0 auto",
                                }}
                              />
                            </Link>
                          </div>
                        </CCarouselItem>
                      ))}
                    </CCarousel>
                  </>
                );
              })()}

              {/* Ticket Resolved Images Carousel */}
              {(() => {
                const resolvedImages = [
                  serviceticket.ticket_resolved_images1,
                  serviceticket.ticket_resolved_images2,
                  serviceticket.ticket_resolved_images3,
                  serviceticket.ticket_resolved_images4,
                  serviceticket.ticket_resolved_images5,
                ].filter(Boolean);

                if (resolvedImages.length === 0) {
                  return (
                    <div className="text-center text-muted my-3">
                      No Resolved Images Available
                    </div>
                  );
                }

                return (
                  <>
                    <h6 className="mt-4">Resolved Ticket Images</h6>
                    <CCarousel
                      controls={resolvedImages.length > 1}
                      indicators={resolvedImages.length > 1}
                      dark
                    >
                      {resolvedImages.map((img, index) => (
                        <CCarouselItem key={index}>
                          <div
                            style={{
                              height: "500px",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              overflow: "hidden",
                            }}
                          >
                            <Link to={img} target="_blank">
                              <CImage
                                className="d-block mx-auto"
                                src={img}
                                alt={`Resolved Image ${index + 1}`}
                                style={{
                                  maxHeight: "100%",
                                  maxWidth: "70%",
                                  objectFit: "contain",
                                  display: "block",
                                  margin: "0 auto",
                                }}
                              />
                            </Link>
                          </div>
                        </CCarouselItem>
                      ))}
                    </CCarousel>
                  </>
                );
              })()}

              <LastActivity lastactivity={serviceticket.last_activity} />
            </CModalBody>

            <CModalFooter>
              <CButton
                color="secondary"
                size="sm"
                onClick={() => setViewModalVisible(false)}
              >
                Close
              </CButton>
            </CModalFooter>
          </>
        )}
      </CModal>

      {/* 📌 Update Modal */}
      <CModal
        scrollable
        backdrop="static"
        size="xl"
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        <CModalHeader>
          <CModalTitle>
            Update Service Ticket :{" "}
            <span className="badge bg-danger">{serviceticket.ticket_id}</span>
          </CModalTitle>
        </CModalHeader>

        {fetchserviceticketloading ? (
          <CModalBody className="d-flex justify-content-center align-items-center">
            {" "}
            <LoadingSpinner />
          </CModalBody>
        ) : (
          <CModalBody>
            <CRow>
              {/* Ticket ID & Robot No () */}
              <CCol md={6}>
                <CFormInput
                  type="text"
                  name="ticket_id"
                  value={serviceticket.ticket_id}
                  disabled
                  label="Ticket ID"
                  className="mb-3"
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  type="text"
                  name="robot_no"
                  value={serviceticket.robot_no}
                  disabled
                  label="Robot No"
                  className="mb-3"
                />
              </CCol>

              {/* Device & Site Information */}
              <CCol md={6}>
                <CFormInput
                  type="text"
                  name="deveui"
                  value={serviceticket.deveui}
                  disabled
                  label="Deveui"
                  className="mb-3"
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  type="text"
                  name="site_id"
                  value={serviceticket.site_id}
                  disabled
                  label="Site ID"
                  className="mb-3"
                />
              </CCol>

              {/* Fault Type & Lora No */}
              <CCol md={6}>
                <CFormInput
                  type="text"
                  name="fault_type"
                  value={serviceticket.fault_type}
                  label="Fault Type"
                  onChange={handleChange}
                  className="mb-3"
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  type="text"
                  name="lora_no"
                  value={serviceticket.lora_no}
                  disabled
                  label="Lora No"
                  className="mb-3"
                />
              </CCol>

              {/* Ticket Generated Info */}
              <CCol md={6}>
                <CFormInput
                  type="text"
                  name="ticket_generated_by"
                  value={serviceticket.ticket_generated_by}
                  disabled
                  label="Generated By"
                  className="mb-3"
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  type="email"
                  name="ticket_generated_by_email"
                  value={serviceticket.ticket_generated_by_email}
                  disabled
                  label="Generated By Email"
                  className="mb-3"
                />
              </CCol>

              {/* Ticket Generated At & Notes */}
              <CCol md={6}>
                <CFormInput
                  type="datetime-local"
                  name="ticket_generated_at"
                  value={serviceticket.ticket_generated_at}
                  label="Generated At"
                  className="mb-3"
                />
              </CCol>
              <CCol md={12}>
                <CFormInput
                  type="textarea"
                  name="ticket_generating_notes"
                  value={serviceticket.ticket_generating_notes}
                  label="Generating Notes"
                  className="mb-3"
                />
              </CCol>
              {/* Ticket Status & Resolved Timestamp */}
              <CCol md={6}>
                <CFormInput
                  type="text"
                  name="ticket_resolved"
                  value={serviceticket.ticket_resolved ? "Resolved" : "Open"}
                  label="Status"
                  className="mb-3"
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  type="datetime-local"
                  name="ticket_resolved_at"
                  value={serviceticket.ticket_resolved_at || ""}
                  label="Resolved At"
                  onChange={handleChange}
                  className="mb-3"
                />
              </CCol>
              {/* Ticket Resolution Info */}
              <CCol md={6}>
                <CFormInput
                  type="text"
                  name="ticket_resolved_by"
                  value={serviceticket.ticket_resolved_by || "N/A"}
                  label="Resolved By"
                  className="mb-3"
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  type="email"
                  name="ticket_resolved_by_email"
                  value={serviceticket.ticket_resolved_by_email || "N/A"}
                  label="Resolved By Email"
                  className="mb-3"
                />
              </CCol>

              {/* Resolution Notes */}
              <CCol md={12}>
                <CFormInput
                  type="textarea"
                  name="ticket_resolving_notes"
                  value={serviceticket.ticket_resolving_notes}
                  label="Resolving Notes"
                  onChange={handleChange}
                  className="mb-3"
                />
              </CCol>

              {/* Image Upload */}
              <CCol md={12}>
                <label className="form-label">Upload Images</label>
                <CFormInput type="file" multiple className="mb-3" />
              </CCol>

              {/* Image Gallery */}
              <CCol md={12}>
                <h6 className="mt-3">Service Ticket Generating Time Images</h6>
                <div className="d-flex flex-wrap">
                  {serviceticket.ticket_generated_images1 ? (
                    <div
                      className="p-2"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        setSelectedImage(serviceticket.ticket_generated_images1)
                      }
                    >
                      {" "}
                      <CImage
                        fluid
                        src={serviceticket.ticket_generated_images1}
                        className="m-2"
                        alt={`Ticket Image ${serviceticket.ticket_generated_images1}`}
                        style={{ width: "10vw", height: "10vh" }}
                      />{" "}
                    </div>
                  ) : (
                    ""
                  )}

                  {serviceticket.ticket_generated_images2 ? (
                    <div
                      className="p-2"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        setSelectedImage(serviceticket.ticket_generated_images2)
                      }
                    >
                      {" "}
                      <CImage
                        fluid
                        src={serviceticket.ticket_generated_images2}
                        className="m-2"
                        alt={`Ticket Image ${serviceticket.ticket_generated_images2}`}
                        style={{ width: "10vw", height: "10vh" }}
                      />{" "}
                    </div>
                  ) : (
                    ""
                  )}

                  {serviceticket.ticket_generated_images3 ? (
                    <div
                      className="p-2"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        setSelectedImage(serviceticket.ticket_generated_images3)
                      }
                    >
                      {" "}
                      <CImage
                        fluid
                        src={serviceticket.ticket_generated_images3}
                        className="m-2"
                        alt={`Ticket Image ${serviceticket.ticket_generated_images3}`}
                        style={{ width: "10vw", height: "10vh" }}
                      />{" "}
                    </div>
                  ) : (
                    ""
                  )}
                  {serviceticket.ticket_generated_images4 ? (
                    <div
                      className="p-2"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        setSelectedImage(serviceticket.ticket_generated_images4)
                      }
                    >
                      {" "}
                      <CImage
                        fluid
                        src={serviceticket.ticket_generated_images4}
                        className="m-2"
                        alt={`Ticket Image ${serviceticket.ticket_generated_images4}`}
                        style={{ width: "10vw", height: "10vh" }}
                      />{" "}
                    </div>
                  ) : (
                    ""
                  )}
                  {serviceticket.ticket_generated_images5 ? (
                    <div
                      className="p-2"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        setSelectedImage(serviceticket.ticket_generated_images5)
                      }
                    >
                      {" "}
                      <CImage
                        fluid
                        src={serviceticket.ticket_generated_images5}
                        className="m-2"
                        alt={`Ticket Image ${serviceticket.ticket_generated_images5}`}
                        style={{ width: "10vw", height: "10vh" }}
                      />{" "}
                    </div>
                  ) : (
                    ""
                  )}

                  {/* {serviceticket.ticket_images &&
                    serviceticket.ticket_images.map((image, index) => (
                      <div
                        key={index}
                        className="p-2"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setSelectedImage(image.image)}
                      >
                        <img
                          src={image.image}
                          alt={`Ticket ${index + 1}`}
                          className="img-thumbnail"
                          width="100"
                          height="80"
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    ))} */}
                </div>
              </CCol>

              <CCol md={12}>
                <h6 className="mt-3">Service Ticket Resolving Time Images</h6>
                <div className="d-flex flex-wrap">
                  {serviceticket.ticket_resolved_images1 ? (
                    <div
                      className="p-2"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        setSelectedImage(serviceticket.ticket_resolved_images1)
                      }
                    >
                      {" "}
                      <CImage
                        fluid
                        src={serviceticket.ticket_resolved_images1}
                        className="m-2"
                        alt={`Ticket Image ${serviceticket.ticket_resolved_images1}`}
                        style={{ width: "10vw", height: "10vh" }}
                      />{" "}
                    </div>
                  ) : (
                    ""
                  )}

                  {serviceticket.ticket_resolved_images2 ? (
                    <div
                      className="p-2"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        setSelectedImage(serviceticket.ticket_resolved_images2)
                      }
                    >
                      {" "}
                      <CImage
                        fluid
                        src={serviceticket.ticket_resolved_images2}
                        className="m-2"
                        alt={`Ticket Image ${serviceticket.ticket_resolved_images2}`}
                        style={{ width: "10vw", height: "10vh" }}
                      />{" "}
                    </div>
                  ) : (
                    ""
                  )}

                  {serviceticket.ticket_resolved_images3 ? (
                    <div
                      className="p-2"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        setSelectedImage(serviceticket.ticket_resolved_images3)
                      }
                    >
                      {" "}
                      <CImage
                        fluid
                        src={serviceticket.ticket_resolved_images3}
                        className="m-2"
                        alt={`Ticket Image ${serviceticket.ticket_resolved_images3}`}
                        style={{ width: "10vw", height: "10vh" }}
                      />{" "}
                    </div>
                  ) : (
                    ""
                  )}
                  {serviceticket.ticket_resolved_images4 ? (
                    <div
                      className="p-2"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        setSelectedImage(serviceticket.ticket_resolved_images4)
                      }
                    >
                      {" "}
                      <CImage
                        fluid
                        src={serviceticket.ticket_resolved_images4}
                        className="m-2"
                        alt={`Ticket Image ${serviceticket.ticket_resolved_images4}`}
                        style={{ width: "10vw", height: "10vh" }}
                      />{" "}
                    </div>
                  ) : (
                    ""
                  )}
                  {serviceticket.ticket_resolved_images5 ? (
                    <div
                      className="p-2"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        setSelectedImage(serviceticket.ticket_resolved_images5)
                      }
                    >
                      {" "}
                      <CImage
                        fluid
                        src={serviceticket.ticket_resolved_images5}
                        className="m-2"
                        alt={`Ticket Image ${serviceticket.ticket_resolved_images5}`}
                        style={{ width: "10vw", height: "10vh" }}
                      />{" "}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </CCol>

              {/* Enlarged Image Modal */}
              {selectedImage && (
                <CModal
                  className=""
                  visible={true}
                  onClose={() => setSelectedImage(null)}
                  size="xl"
                >
                  <div
                    className="position-absolute top-0 end-0 m-2"
                    style={{ zIndex: 999 }}
                  >
                    <CButton onClick={() => setSelectedImage(null)}>✖</CButton>
                  </div>
                  <CModalBody
                    style={{ background: "transparent" }}
                    className="d-flex justify-content-center"
                  >
                    <img
                      src={selectedImage}
                      alt="Selected"
                      className="p-2"
                      style={{ height: "80vh", width: "90%" }}
                    />
                  </CModalBody>
                </CModal>
              )}
            </CRow>
          </CModalBody>
        )}
        <CModalFooter>
          <CButton
            color="secondary"
            size="sm"
            onClick={() => setModalVisible(false)}
          >
            Cancel
          </CButton>
          <CButton
            color="primary"
            size="sm"
            onClick={() => handleUpdate(serviceticket._id)}
          >
            {updateserviceticketloading ? (
              <>
                Saving <LoadingSpinner />
              </>
            ) : (
              "save changes"
            )}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default SiteTechnicianServiceTicketDashboard;
