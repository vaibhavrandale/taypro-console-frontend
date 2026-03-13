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
  CImage,
} from "@coreui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { cilCloudUpload, cilX } from "@coreui/icons";
import CIcon from "@coreui/icons-react";

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

const UpdateClientTicket = () => {
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
  const [resolutionImage1, setResolutionImage1] = useState("");
  const [resolutionImage2, setResolutionImage2] = useState("");
  const [uploading1, setUploading1] = useState(false);
  const [uploading2, setUploading2] = useState(false);
  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const { data } = await axios.get(`/api/v1/clienttickets/${id}`, {
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
      created_by,
      resolution_image1,
      resolution_image2,
      ...updatedTicket
    } = formData;
    // Ensure images are included
    updatedTicket.resolution_image1 = resolutionImage1 || "";
    updatedTicket.resolution_image2 = resolutionImage2 || "";
    try {
      await axios.put(`/api/v1/clienttickets/${id}`, updatedTicket, {
        headers: { authorization: `Bearer ${authtoken}` },
      });
      toast.success("Ticket updated successfully");
      dispatch({ type: "UPDATE_TICKET_SUCCESS" });
      navigate("/master-admin/client-tickets");
    } catch (error) {
      dispatch({
        type: "UPDATE_TICKET_FAIL",
        payload: error.reponse.data.message,
      });
      toast.error(error.reponse.data.message);
    }
  };

  const handleImageUpload1 = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading1(true);

      const { data } = await axios.post(
        "/api/v1/image-upload/client-tickets",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authtoken}`,
          },
        },
      );

      setResolutionImage1(data.url);
      toast.success("Image 1 uploaded");
    } catch (err) {
      toast.error("Image upload failed");
    } finally {
      setUploading1(false);
    }
  };
  const handleImageUpload2 = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading2(true);

      const { data } = await axios.post(
        "/api/v1/image-upload/client-tickets",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authtoken}`,
          },
        },
      );

      setResolutionImage2(data.url);
      toast.success("Image 2 uploaded");
    } catch (err) {
      toast.error("Image upload failed");
    } finally {
      setUploading2(false);
    }
  };
  const deleteImage1 = () => {
    setResolutionImage1("");
    toast.success("Image 1 removed");
  };

  const deleteImage2 = () => {
    setResolutionImage2("");
    toast.success("Image 2 removed");
  };

  return (
    <CCard>
      <CCardHeader>
        Update Client Ticket -{" "}
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
                  name="ticket_id"
                  value={formData.site_id || ""}
                  label="Ticket ID"
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
            <CCol md="3">
              <label className="form-label">Image 1</label>

              {/* Upload Button */}
              <div className="container-btn-file p-2 m-2 w-50">
                <CIcon icon={cilCloudUpload} className="upload-icon" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload1}
                  disabled={uploading1}
                  className="file"
                />
              </div>

              {/* Preview */}
              {uploading1 ? (
                <div className="d-flex justify-content-center">
                  <LoadingSpinner />
                </div>
              ) : resolutionImage1 ? (
                <div className="position-relative d-inline-block">
                  <img
                    src={resolutionImage1}
                    alt="creation im 2"
                    width="50"
                    height="50"
                    style={{ objectFit: "cover", borderRadius: "5px" }}
                  />
                  <CBadge
                    className="p-1 position-absolute"
                    style={{
                      top: "-8px",
                      right: "-8px",
                      cursor: "pointer",
                      borderRadius: "50%",
                      backgroundColor: "red",
                    }}
                    onClick={deleteImage1}
                  >
                    <CIcon icon={cilX} size="sm" />
                  </CBadge>
                </div>
              ) : null}
            </CCol>

            <CCol md="3">
              <label className="form-label">Image 2</label>

              {/* Upload Button */}
              <div className="container-btn-file p-2 m-2 w-50">
                <CIcon icon={cilCloudUpload} className="upload-icon" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload2}
                  disabled={uploading2}
                  className="file"
                />
              </div>

              {/* Preview */}
              {uploading2 ? (
                <div className="d-flex justify-content-center">
                  <LoadingSpinner />
                </div>
              ) : resolutionImage2 ? (
                <div className="position-relative d-inline-block">
                  <img
                    src={resolutionImage2}
                    alt="creation im 2"
                    width="50"
                    height="50"
                    style={{ objectFit: "cover", borderRadius: "5px" }}
                  />
                  <CBadge
                    className="p-1 position-absolute"
                    style={{
                      top: "-8px",
                      right: "-8px",
                      cursor: "pointer",
                      borderRadius: "50%",
                      backgroundColor: "red",
                    }}
                    onClick={deleteImage2}
                  >
                    <CIcon icon={cilX} size="sm" />
                  </CBadge>
                </div>
              ) : null}
            </CCol>
            <CRow>
              {formData.creation_image1 && (
                <CCol md={3} className="my-2 d-flex flex-column">
                  Creation Image 1{" "}
                  <a
                    href={formData.creation_image1}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <CImage
                      src={formData.creation_image1}
                      width={120}
                      height={80}
                      className="rounded border shadow-sm"
                    />
                  </a>
                </CCol>
              )}
              {formData.creation_image2 && (
                <CCol md={3} className="my-2 d-flex flex-column">
                  Creation Image 2{" "}
                  <a
                    href={formData.creation_image2}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <CImage
                      src={formData.creation_image2}
                      width={120}
                      height={80}
                      className="rounded border shadow-sm"
                    />
                  </a>
                </CCol>
              )}

              {formData.resolution_image1 && (
                <CCol md={3} className="my-2 d-flex flex-column">
                  Resolution Image 1{" "}
                  <a
                    href={formData.resolution_image1}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <CImage
                      src={formData.resolution_image1}
                      width={120}
                      height={80}
                      className="rounded border shadow-sm"
                    />
                  </a>
                </CCol>
              )}
              {formData.resolution_image2 && (
                <CCol md={3} className="my-2 d-flex flex-column">
                  Resolution Image 2
                  <a
                    href={formData.resolution_image2}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <CImage
                      src={formData.resolution_image2}
                      width={120}
                      height={80}
                      className="rounded border shadow-sm"
                    />
                  </a>
                </CCol>
              )}
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

export default UpdateClientTicket;
