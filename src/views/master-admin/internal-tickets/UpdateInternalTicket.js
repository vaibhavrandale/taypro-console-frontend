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
import CIcon from "@coreui/icons-react";
import { cilCloudUpload, cilX } from "@coreui/icons";

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
  const [uploadingFields, setUploadingFields] = useState({});
  const userInfo = useSelector((state) => state.userInfo);
  let adminroute = "";

  if (userInfo.role === "Master Admin") {
    adminroute = "master-admin";
  } else if (userInfo.role === "Service Admin") {
    adminroute = "service-admin";
  } else if (userInfo.role === "Project Admin") {
    adminroute = "project-admin";
  } else if (userInfo?.role === "Master User") {
    adminroute = "master-user";
  } else if (userInfo?.role === "Service User") {
    adminroute = "service-user";
  } else if (userInfo?.role === "Project User") {
    adminroute = "project-user";
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

  const deleteFileHandler = async (fileName) => {
    setFormData((prevData) => ({
      ...prevData,
      [`ticket_generated_images${fileName}`]: "",
      [`ticket_resolved_images${fileName}`]: "",
    }));
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

  const handleFileChange = async (event) => {
    const { name, files } = event.target;
    if (files.length === 0) return;

    const file = files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploadingFields((prev) => ({ ...prev, [name]: true })); // ✅ Set only this field to loading

      const response = await axios.post(
        "/api/v1/image-upload/service-tickets",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authtoken}`,
          },
        }
      );

      // ✅ Update uploaded image dynamically for the specific field
      setFormData((prevData) => ({
        ...prevData,
        [name]: response.data.url, // Assuming backend returns { url: "uploaded_image_url" }
      }));

      setUploadingFields((prev) => ({ ...prev, [name]: false })); // ✅ Stop loading for this input
    } catch (error) {
      setUploadingFields((prev) => ({ ...prev, [name]: false })); // ✅ Stop loading on error
      console.error("File upload error:", error);
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
              {[1, 2, 3, 4, 5].map((num, index) => (
                <CRow key={index}>
                  <CCol md={2} xs={5}>
                    <div className="container-btn-file p-2 m-2 w-80">
                      <CIcon icon={cilCloudUpload} className="upload-icon" />
                      {`Image ${num}`}
                      <input
                        className="file"
                        name={`ticket_generated_images${num}`}
                        type="file"
                        onChange={handleFileChange}
                        disabled={
                          uploadingFields[`ticket_generated_images${num}`]
                        }
                      />
                    </div>
                  </CCol>
                  <CCol md={3} sm={2}>
                    {uploadingFields[`ticket_generated_images${num}`] ? ( // ✅ Show loader only for the uploading input
                      <div className="mt-2 d-flex justify-content-center">
                        <LoadingSpinner />
                      </div>
                    ) : formData[`ticket_generated_images${num}`] ? (
                      <div className="my-2 ">
                        <img
                          // className="position-relative"
                          src={formData[`ticket_generated_images${num}`]}
                          alt={`Ticket attachment ${num}`}
                          width="80"
                          height="80"
                          style={{ objectFit: "cover", borderRadius: "5px" }}
                        />
                        <CBadge
                          color="primary"
                          position="absolute"
                          top="0"
                          left="0"
                          shape="rounded-pill"
                          className=" p-1"
                        >
                          <CIcon
                            icon={cilX}
                            cursor="pointer"
                            onClick={() => deleteFileHandler(num)}
                            title="Remove file"
                          />
                        </CBadge>
                      </div>
                    ) : null}
                  </CCol>
                </CRow>
              ))}
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

              <CCol className="mb-2" md={12}>
                <CFormTextarea
                  name="resolution_notes"
                  value={formData.resolution_notes || ""}
                  label="Resolution Notes"
                  onChange={handleChange}
                />
              </CCol>
              {[1, 2, 3, 4, 5].map((num, index) => (
                <CRow key={index}>
                  <CCol md={2} xs={5}>
                    <div className="container-btn-file p-2 m-2 w-80">
                      <CIcon icon={cilCloudUpload} className="upload-icon" />
                      {`Image ${num}`}
                      <input
                        className="file"
                        name={`ticket_resolved_images${num}`}
                        type="file"
                        onChange={handleFileChange}
                        disabled={
                          uploadingFields[`ticket_resolved_images${num}`]
                        }
                      />
                    </div>
                  </CCol>
                  <CCol md={3} sm={2}>
                    {uploadingFields[`ticket_resolved_images${num}`] ? ( // ✅ Show loader only for the uploading input
                      <div className="mt-2 d-flex justify-content-center">
                        <LoadingSpinner />
                      </div>
                    ) : formData[`ticket_resolved_images${num}`] ? (
                      <div className="my-2 ">
                        <img
                          // className="position-relative"
                          src={formData[`ticket_resolved_images${num}`]}
                          alt={`Ticket attachment ${num}`}
                          width="80"
                          height="80"
                          style={{ objectFit: "cover", borderRadius: "5px" }}
                        />
                        <CBadge
                          color="primary"
                          position="absolute"
                          top="0"
                          left="0"
                          shape="rounded-pill"
                          className=" p-1"
                        >
                          <CIcon
                            icon={cilX}
                            cursor="pointer"
                            onClick={() => deleteFileHandler(num)}
                            title="Remove file"
                          />
                        </CBadge>
                      </div>
                    ) : null}
                  </CCol>
                </CRow>
              ))}
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
