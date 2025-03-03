/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useReducer, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  CForm,
  CFormInput,
  CButton,
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CFormTextarea,
  CFormSelect,
} from "@coreui/react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import toast from "react-hot-toast";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_SUCCESS":
      return { ...state, ticket: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "UPDATE_SUCCESS":
      return { ...state, updating: false, success: true };
    case "UPDATE_FAIL":
      return { ...state, updating: false, error: action.payload };
    case "UPDATE_REQUEST":
      return { ...state, updating: true };
    case "UPLOAD_REQUEST":
      return { ...state, loadingUpload: true, errorUpload: "" };
    case "UPLOAD_SUCCESS":
      return {
        ...state,
        loadingUpload: false,
        errorUpload: "",
      };
    case "UPLOAD_FAIL":
      return { ...state, loadingUpload: false, errorUpload: action.payload };
    default:
      return state;
  }
};

const UpdateServiceTicket = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const authtoken = useSelector((state) => state.authtoken);
  const [state, dispatch] = useReducer(reducer, {
    ticket: {},
    loading: true,
    loadingUpload: false,
    error: "",
    updating: false,
    success: false,
  });
  const [formData, setFormData] = useState({});

  const [uploadingFields, setUploadingFields] = useState({});

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await axios.get(`/api/v1/servicetickets/${id}`, {
          headers: { Authorization: `Bearer ${authtoken}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: response.data.data });
        setFormData(response.data.data);
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: error.message });
      }
    };
    fetchTicket();
  }, [id, authtoken]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "UPDATE_REQUEST" });

    // Create a copy of formData excluding last_activity
    const { createdAt, _id, last_activity, ...filteredFormData } = formData;

    try {
      await axios.put(`/api/v1/servicetickets/${id}`, filteredFormData, {
        headers: { Authorization: `Bearer ${authtoken}` },
      });
      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success(
        `${filteredFormData.ticket_id} Service ticket updated successfully`
      );
      navigate("/master-admin/service-tickets");
    } catch (error) {
      dispatch({ type: "UPDATE_FAIL", payload: error.message });
    }
  };
  //   const handleFileChange = async (event) => {
  //     const { name, files } = event.target;
  //     if (files.length === 0) return;

  //     const file = files[0]; // Single file per input
  //     const formData = new FormData();
  //     formData.append("file", file);

  //     try {
  //       dispatch({ type: "UPLOAD_REQUEST" });

  //       const response = await axios.post(
  //         "/api/v1/image-upload/service-tickets", // Adjust backend URL
  //         formData,
  //         {
  //           headers: {
  //             "Content-Type": "multipart/form-data",
  //             Authorization: `Bearer ${authtoken}`,
  //           },
  //         }
  //       );

  //       dispatch({ type: "UPLOAD_SUCCESS" });

  //       // Store uploaded image URL dynamically
  //       setFormData((prevData) => ({
  //         ...prevData,
  //         [name]: response.data.url, // Assuming backend returns { url: "uploaded_image_url" }
  //       }));
  //     } catch (error) {
  //       dispatch({ type: "UPLOAD_FAIL", payload: error.message });
  //       console.error("File upload error:", error);
  //     }
  //   };

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
    <CContainer>
      <CCard>
        <CCardHeader>
          Update Service Ticket -{" "}
          <b className="badge bg-success">{formData.ticket_id}</b>
        </CCardHeader>
        <CCardBody>
          {state.loading ? (
            <div className="d-flex justify-content-center align-items-center h-50">
              <LoadingSpinner />
            </div>
          ) : state.error ? (
            <p>{state.error}</p>
          ) : (
            <CForm onSubmit={handleSubmit}>
              <CRow>
                {/* Non-editable fields */}

                <CFormInput
                  type="hidden"
                  name="ticket_id"
                  value={formData.ticket_id || ""}
                  readOnly
                />

                {/* Editable fields */}
                <CCol md={6}>
                  <CFormInput
                    label="Robot No"
                    name="robot_no"
                    value={formData.robot_no || ""}
                    readOnly
                  />
                </CCol>

                <CCol md={6}>
                  <CFormInput
                    label="Deveui"
                    name="deveui"
                    value={formData.deveui || ""}
                    readOnly
                  />
                </CCol>

                <CCol md={6}>
                  <CFormInput
                    label="Block"
                    name="block"
                    value={formData.block || ""}
                    readOnly
                  />
                </CCol>

                <CCol md={6}>
                  <CFormInput
                    label="Robot Type"
                    name="robot_type"
                    value={formData.robot_type || ""}
                    readOnly
                  />
                </CCol>

                <CCol md={6}>
                  <CFormInput
                    label="Site ID"
                    name="site_id"
                    value={formData.site_id || ""}
                    readOnly
                  />
                </CCol>

                <CCol md={6}>
                  <CFormInput
                    label="Company"
                    name="company"
                    value={formData.company || ""}
                    readOnly
                  />
                </CCol>

                <CCol md={6}>
                  <CFormInput
                    label="Lora No"
                    name="lora_no"
                    value={formData.lora_no || ""}
                    readOnly
                  />
                </CCol>

                <CCol md={6}>
                  <CFormInput
                    label="Fault Type"
                    name="fault_type"
                    value={formData.fault_type || ""}
                    onChange={handleChange}
                  />
                </CCol>

                {/* Ticket Generated Info */}
                <CCol md={6}>
                  <CFormInput
                    label="Ticket Generated At"
                    name="ticket_generated_at"
                    value={formData.ticket_generated_at || ""}
                    readOnly
                  />
                </CCol>

                <CCol md={6}>
                  <CFormInput
                    label="Ticket Generated By"
                    name="ticket_generated_by"
                    value={formData.ticket_generated_by || ""}
                    readOnly
                  />
                </CCol>

                <CCol md={6}>
                  <CFormInput
                    label="Ticket Generated By Email"
                    name="ticket_generated_by_email"
                    value={formData.ticket_generated_by_email || ""}
                    readOnly
                  />
                </CCol>

                <CCol md={6}>
                  <CFormInput
                    label="Ticket Generated By User ID"
                    name="ticket_generated_by_user_id"
                    value={formData.ticket_generated_by_user_id || ""}
                    readOnly
                  />
                </CCol>

                {/* Ticket Resolution Info */}

                {formData.ticket_resolved_at ? (
                  <CCol md={6}>
                    <CFormInput
                      label="Ticket Resolved At"
                      name="ticket_resolved_at"
                      value={formData.ticket_resolved_at || ""}
                      readOnly
                    />
                  </CCol>
                ) : (
                  ""
                )}
                {formData.ticket_resolved_by ? (
                  <CCol md={6}>
                    <CFormInput
                      label="Ticket Resolved By"
                      name="ticket_resolved_by"
                      value={formData.ticket_resolved_by || ""}
                      readOnly
                    />
                  </CCol>
                ) : (
                  ""
                )}
                {formData.ticket_resolved_by_email ? (
                  <CCol md={6}>
                    <CFormInput
                      label="Ticket Resolved By Email"
                      name="ticket_resolved_by_email"
                      value={formData.ticket_resolved_by_email || ""}
                      readOnly
                    />
                  </CCol>
                ) : (
                  ""
                )}
                {formData.ticket_resolved_at ? (
                  <CCol md={6}>
                    <CFormInput
                      label="Ticket Resolved By User ID"
                      name="ticket_resolved_by_user_id"
                      value={formData.ticket_resolved_by_user_id || ""}
                      readOnly
                    />
                  </CCol>
                ) : (
                  ""
                )}

                <CCol md={6}>
                  <CFormTextarea
                    label="Ticket Generating Notes"
                    name="ticket_generating_notes"
                    value={formData.ticket_generating_notes || ""}
                    onChange={handleChange}
                  />
                </CCol>
                {/* Ticket Images - Generated */}
                {/* {[1, 2, 3, 4, 5].map((num) => (
                  <CCol md={6} key={`generated-${num}`}>
                    <CFormInput
                      label={`Ticket Generated Image ${num}`}
                      type="file"
                      name={`ticket_generated_images${num}`}
                      onChange={handleFileChange}
                    />

                    {state.loadingUpload ? (
                      <div className="mt-2 d-flex justify-content-center">
                        <LoadingSpinner />
                      </div>
                    ) : formData[`ticket_generated_images${num}`] ? (
                      <div className="mt-2">
                        <img
                          src={formData[`ticket_generated_images${num}`]}
                          alt={`Generated Image ${num}`}
                          width="100"
                          height="100"
                          style={{ objectFit: "cover", borderRadius: "5px" }}
                        />
                      </div>
                    ) : null}
                  </CCol>
                ))} */}

                {[1, 2, 3, 4, 5].map((num) => (
                  <CCol md={3} key={`resolved-${num}`}>
                    <CFormInput
                      label={`Ticket Generated Image ${num}`}
                      type="file"
                      name={`ticket_generated_images${num}`}
                      onChange={handleFileChange}
                      disabled={
                        uploadingFields[`ticket_generated_images${num}`]
                      } // ✅ Disable only the input being uploaded
                    />

                    {uploadingFields[`ticket_generated_images${num}`] ? ( // ✅ Show loader only for the uploading input
                      <div className="mt-2 d-flex justify-content-center">
                        <LoadingSpinner />
                      </div>
                    ) : formData[`ticket_generated_images${num}`] ? (
                      <div className="mt-2">
                        <img
                          src={formData[`ticket_generated_images${num}`]}
                          alt={`Generated Image ${num}`}
                          width="100"
                          height="100"
                          style={{ objectFit: "cover", borderRadius: "5px" }}
                        />
                      </div>
                    ) : null}
                  </CCol>
                ))}
                <CCol md={6}>
                  <CFormSelect
                    label="Ticket Resolved"
                    name="ticket_resolved"
                    value={String(formData.ticket_resolved)}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        ticket_resolved: e.target.value === "true",
                      })
                    }
                  >
                    <option value="">Select an option</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </CFormSelect>
                </CCol>

                <CCol md={6}>
                  <CFormTextarea
                    label="Ticket Resolving Notes"
                    name="ticket_resolving_notes"
                    value={formData.ticket_resolving_notes || ""}
                    onChange={handleChange}
                  />
                </CCol>

                {/* {[1, 2, 3, 4, 5].map((num) => (
                  <CCol md={6} key={`resolved-${num}`}>
                    <CFormInput
                      label={`Ticket Resolved Image ${num}`}
                      type="file"
                      name={`ticket_resolved_images${num}`}
                      onChange={handleFileChange}
                    />

                    {state.loadingUpload ? (
                      <div className="mt-2 d-flex justify-content-center">
                        <LoadingSpinner />
                      </div>
                    ) : formData[`ticket_resolved_images${num}`] ? (
                      <div className="mt-2">
                        <img
                          src={formData[`ticket_resolved_images${num}`]}
                          alt={`Resolved Image ${num}`}
                          width="100"
                          height="100"
                          style={{ objectFit: "cover", borderRadius: "5px" }}
                        />
                      </div>
                    ) : null}
                  </CCol>
                ))} */}

                {[1, 2, 3, 4, 5].map((num) => (
                  <CCol md={3} key={`resolved-${num}`}>
                    <CFormInput
                      label={`Ticket Resolved Image ${num}`}
                      type="file"
                      name={`ticket_resolved_images${num}`}
                      onChange={handleFileChange}
                      disabled={uploadingFields[`ticket_resolved_images${num}`]} // ✅ Disable only the input being uploaded
                    />

                    {uploadingFields[`ticket_resolved_images${num}`] ? ( // ✅ Show loader only for the uploading input
                      <div className="mt-2 d-flex justify-content-center">
                        <LoadingSpinner />
                      </div>
                    ) : formData[`ticket_resolved_images${num}`] ? (
                      <div className="mt-2">
                        <img
                          src={formData[`ticket_resolved_images${num}`]}
                          alt={`Resolved Image ${num}`}
                          width="100"
                          height="100"
                          style={{ objectFit: "cover", borderRadius: "5px" }}
                        />
                      </div>
                    ) : null}
                  </CCol>
                ))}
              </CRow>

              {/* <div className="d-flex justify-content-end">
                <CButton
                  className="my-2"
                  type="submit"
                  size="sm"
                  color="primary"
                  readOnly={state.updating}
                >
                  {state.updating ? (
                    <>
                      Updating <LoadingSpinner />
                    </>
                  ) : (
                    "Update Ticket"
                  )}
                </CButton>
              </div> */}
              <div className="d-flex justify-content-end">
                <CButton
                  className="my-2"
                  type="submit"
                  size="sm"
                  color="primary"
                  disabled={state.updating || state.loadingUpload} // ✅ Merge both loading states
                >
                  {state.updating || state.loadingUpload ? (
                    <>
                      Processing <LoadingSpinner />
                    </>
                  ) : (
                    "Update Ticket"
                  )}
                </CButton>
              </div>
            </CForm>
          )}
        </CCardBody>
      </CCard>
    </CContainer>
  );
};

export default UpdateServiceTicket;
