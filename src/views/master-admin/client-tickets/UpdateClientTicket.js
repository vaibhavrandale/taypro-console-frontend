// import React, { useEffect, useReducer, useState } from "react";
// import {
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CButton,
//   CForm,
//   CFormInput,
//   CFormSelect,
//   CFormTextarea,
//   CRow,
//   CCol,
//   CBadge,
//   CImage,
// } from "@coreui/react";
// import { useNavigate, useParams } from "react-router-dom";
// import { useSelector } from "react-redux";
// import axios from "axios";
// import toast from "react-hot-toast";
// import LoadingSpinner from "../../../components/LoadingSpinner";
// import { cilCloudUpload, cilX } from "@coreui/icons";
// import CIcon from "@coreui/icons-react";

// const reducer = (state, action) => {
//   switch (action.type) {
//     case "FETCH_TICKET_SUCCESS":
//       return { ...state, ticket: action.payload, loading: false };
//     case "FETCH_TICKET_FAIL":
//       return { ...state, error: action.payload, loading: false };
//     case "UPDATE_TICKET_REQUEST":
//       return { ...state, updating: true };
//     case "UPDATE_TICKET_SUCCESS":
//       return { ...state, updating: false };
//     case "UPDATE_TICKET_FAIL":
//       return { ...state, updating: false, error: action.payload };
//     default:
//       return state;
//   }
// };

// const UpdateClientTicket = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   // const authtoken = useSelector((state) => state.authtoken);

//   const [state, dispatch] = useReducer(reducer, {
//     ticket: {},
//     loading: true,
//     error: "",
//     updating: false,
//   });

//   const [formData, setFormData] = useState({});
//   const [resolutionImage1, setResolutionImage1] = useState("");
//   const [resolutionImage2, setResolutionImage2] = useState("");
//   const [uploading1, setUploading1] = useState(false);
//   const [uploading2, setUploading2] = useState(false);
//   useEffect(() => {
//     const fetchTicket = async () => {
//       try {
//         const { data } = await axios.get(`/api/v1/clienttickets/${id}`, {
//           // headers: { authorization: `Bearer ${authtoken}` },
//           withCredentials: true,
//         });

//         dispatch({ type: "FETCH_TICKET_SUCCESS", payload: data.data });
//         setFormData(data.data);
//       } catch (error) {
//         dispatch({
//           type: "FETCH_TICKET_FAIL",
//           payload: "Failed to load ticket",
//         });
//       }
//     };
//     fetchTicket();
//   }, [id]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     dispatch({ type: "UPDATE_TICKET_REQUEST" });
//     const {
//       createdAt,
//       _id,
//       last_activity,
//       created_by,
//       resolution_image1,
//       resolution_image2,
//       ...updatedTicket
//     } = formData;
//     // Ensure images are included
//     updatedTicket.resolution_image1 = resolutionImage1 || "";
//     updatedTicket.resolution_image2 = resolutionImage2 || "";
//     try {
//       await axios.put(`/api/v1/clienttickets/${id}`, updatedTicket, {
//         // headers: { authorization: `Bearer ${authtoken}` },
//         withCredentials: true,
//       });
//       toast.success("Ticket updated successfully");
//       dispatch({ type: "UPDATE_TICKET_SUCCESS" });
//       navigate("/master-admin/client-tickets");
//     } catch (error) {
//       dispatch({
//         type: "UPDATE_TICKET_FAIL",
//         payload: error.reponse.data.message,
//       });
//       toast.error(error.reponse.data.message);
//     }
//   };

//   const handleImageUpload1 = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       setUploading1(true);

//       const { data } = await axios.post(
//         "/api/v1/image-upload/client-tickets",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             // Authorization: `Bearer ${authtoken}`,
//           },
//           withCredentials: true,
//         },
//       );

//       setResolutionImage1(data.url);
//       toast.success("Image 1 uploaded");
//     } catch (err) {
//       toast.error("Image upload failed");
//     } finally {
//       setUploading1(false);
//     }
//   };
//   const handleImageUpload2 = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       setUploading2(true);

//       const { data } = await axios.post(
//         "/api/v1/image-upload/client-tickets",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             // Authorization: `Bearer ${authtoken}`,
//           },
//           withCredentials: true,
//         },
//       );

//       setResolutionImage2(data.url);
//       toast.success("Image 2 uploaded");
//     } catch (err) {
//       toast.error("Image upload failed");
//     } finally {
//       setUploading2(false);
//     }
//   };
//   const deleteImage1 = () => {
//     setResolutionImage1("");
//     toast.success("Image 1 removed");
//   };

//   const deleteImage2 = () => {
//     setResolutionImage2("");
//     toast.success("Image 2 removed");
//   };

//   return (
//     <CCard>
//       <CCardHeader>
//         Update Client Ticket -{" "}
//         <CBadge color="danger">{formData.ticket_id}</CBadge>
//       </CCardHeader>
//       <CCardBody>
//         {state.loading ? (
//           <LoadingSpinner />
//         ) : (
//           <CForm onSubmit={handleSubmit}>
//             <CRow>
//               <CCol md={6}>
//                 <CFormInput
//                   name="ticket_id"
//                   value={formData.ticket_id || ""}
//                   label="Ticket ID"
//                   readOnly
//                 />
//               </CCol>
//               <CCol md={6}>
//                 <CFormInput
//                   name="ticket_id"
//                   value={formData.site_id || ""}
//                   label="Ticket ID"
//                   readOnly
//                 />
//               </CCol>
//               <CCol md={6}>
//                 <CFormInput
//                   name="subject"
//                   value={formData.subject || ""}
//                   label="Subject"
//                   onChange={handleChange}
//                 />
//               </CCol>
//               <CCol md={12}>
//                 <CFormTextarea
//                   name="description"
//                   value={formData.description || ""}
//                   label="Description"
//                   onChange={handleChange}
//                 />
//               </CCol>
//               <CCol md={6}>
//                 <CFormSelect
//                   name="status"
//                   value={formData.status || ""}
//                   onChange={handleChange}
//                   label="Status"
//                 >
//                   <option>Open</option>
//                   <option>In Progress</option>
//                   <option>Resolved</option>
//                 </CFormSelect>
//               </CCol>
//               <CCol md={6}>
//                 <CFormInput
//                   name="created_by.name"
//                   value={formData.created_by?.name || ""}
//                   label="Created By"
//                   disabled
//                 />
//               </CCol>
//               <CCol md={6}>
//                 <CFormInput
//                   name="created_at"
//                   type="datetime-local"
//                   value={
//                     formData.created_by?.timestamp
//                       ? new Date(formData.created_by.timestamp)
//                           .toISOString()
//                           .slice(0, 16)
//                       : ""
//                   }
//                   label="Created At"
//                   disabled
//                 />
//               </CCol>
//               {formData.status === "Resolved" && (
//                 <>
//                   <CCol md={6}>
//                     <CFormInput
//                       name="resolved_by.name"
//                       value={formData.resolved_by?.name || ""}
//                       label="Resolved By"
//                       onChange={handleChange}
//                       hidden
//                     />
//                   </CCol>
//                   <CCol md={6}>
//                     <CFormInput
//                       name="resolved_at"
//                       type="datetime-local"
//                       hidden
//                       value={
//                         formData.resolved_at
//                           ? new Date(formData.resolved_at)
//                               .toISOString()
//                               .slice(0, 16)
//                           : ""
//                       }
//                       label="Resolved At"
//                       onChange={handleChange}
//                     />
//                   </CCol>
//                 </>
//               )}
//               <CCol md={12}>
//                 <CFormTextarea
//                   name="resolution_notes"
//                   value={formData.resolution_notes || ""}
//                   label="Resolution Notes"
//                   onChange={handleChange}
//                 />
//               </CCol>
//             </CRow>
//             <CCol md="3">
//               <label className="form-label">Image 1</label>

//               {/* Upload Button */}
//               <div className="container-btn-file p-2 m-2 w-50">
//                 <CIcon icon={cilCloudUpload} className="upload-icon" />
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleImageUpload1}
//                   disabled={uploading1}
//                   className="file"
//                 />
//               </div>

//               {/* Preview */}
//               {uploading1 ? (
//                 <div className="d-flex justify-content-center">
//                   <LoadingSpinner />
//                 </div>
//               ) : resolutionImage1 ? (
//                 <div className="position-relative d-inline-block">
//                   <img
//                     src={resolutionImage1}
//                     alt="creation im 2"
//                     width="50"
//                     height="50"
//                     style={{ objectFit: "cover", borderRadius: "5px" }}
//                   />
//                   <CBadge
//                     className="p-1 position-absolute"
//                     style={{
//                       top: "-8px",
//                       right: "-8px",
//                       cursor: "pointer",
//                       borderRadius: "50%",
//                       backgroundColor: "red",
//                     }}
//                     onClick={deleteImage1}
//                   >
//                     <CIcon icon={cilX} size="sm" />
//                   </CBadge>
//                 </div>
//               ) : null}
//             </CCol>

//             <CCol md="3">
//               <label className="form-label">Image 2</label>

//               {/* Upload Button */}
//               <div className="container-btn-file p-2 m-2 w-50">
//                 <CIcon icon={cilCloudUpload} className="upload-icon" />
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleImageUpload2}
//                   disabled={uploading2}
//                   className="file"
//                 />
//               </div>

//               {/* Preview */}
//               {uploading2 ? (
//                 <div className="d-flex justify-content-center">
//                   <LoadingSpinner />
//                 </div>
//               ) : resolutionImage2 ? (
//                 <div className="position-relative d-inline-block">
//                   <img
//                     src={resolutionImage2}
//                     alt="creation im 2"
//                     width="50"
//                     height="50"
//                     style={{ objectFit: "cover", borderRadius: "5px" }}
//                   />
//                   <CBadge
//                     className="p-1 position-absolute"
//                     style={{
//                       top: "-8px",
//                       right: "-8px",
//                       cursor: "pointer",
//                       borderRadius: "50%",
//                       backgroundColor: "red",
//                     }}
//                     onClick={deleteImage2}
//                   >
//                     <CIcon icon={cilX} size="sm" />
//                   </CBadge>
//                 </div>
//               ) : null}
//             </CCol>
//             <CRow>
//               {formData.creation_image1 && (
//                 <CCol md={3} className="my-2 d-flex flex-column">
//                   Creation Image 1{" "}
//                   <a
//                     href={formData.creation_image1}
//                     target="_blank"
//                     rel="noreferrer"
//                   >
//                     <CImage
//                       src={formData.creation_image1}
//                       width={120}
//                       height={80}
//                       className="rounded border shadow-sm"
//                     />
//                   </a>
//                 </CCol>
//               )}
//               {formData.creation_image2 && (
//                 <CCol md={3} className="my-2 d-flex flex-column">
//                   Creation Image 2{" "}
//                   <a
//                     href={formData.creation_image2}
//                     target="_blank"
//                     rel="noreferrer"
//                   >
//                     <CImage
//                       src={formData.creation_image2}
//                       width={120}
//                       height={80}
//                       className="rounded border shadow-sm"
//                     />
//                   </a>
//                 </CCol>
//               )}

//               {formData.resolution_image1 && (
//                 <CCol md={3} className="my-2 d-flex flex-column">
//                   Resolution Image 1{" "}
//                   <a
//                     href={formData.resolution_image1}
//                     target="_blank"
//                     rel="noreferrer"
//                   >
//                     <CImage
//                       src={formData.resolution_image1}
//                       width={120}
//                       height={80}
//                       className="rounded border shadow-sm"
//                     />
//                   </a>
//                 </CCol>
//               )}
//               {formData.resolution_image2 && (
//                 <CCol md={3} className="my-2 d-flex flex-column">
//                   Resolution Image 2
//                   <a
//                     href={formData.resolution_image2}
//                     target="_blank"
//                     rel="noreferrer"
//                   >
//                     <CImage
//                       src={formData.resolution_image2}
//                       width={120}
//                       height={80}
//                       className="rounded border shadow-sm"
//                     />
//                   </a>
//                 </CCol>
//               )}
//             </CRow>

//             <CButton
//               size="sm"
//               className="mt-4"
//               type="submit"
//               color="primary"
//               disabled={state.updating}
//             >
//               {state.updating ? (
//                 <>
//                   Updating...
//                   <LoadingSpinner />
//                 </>
//               ) : (
//                 "Update Ticket"
//               )}
//             </CButton>
//           </CForm>
//         )}
//       </CCardBody>
//     </CCard>
//   );
// };

// export default UpdateClientTicket;

import React, { useEffect, useReducer, useState } from "react";
import {
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
import axios from "axios";
import toast from "react-hot-toast";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { cilCloudUpload, cilX, cilCheckCircle } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { useSelector } from "react-redux";

/* ─── Reducer ──────────────────────────────────────────────── */
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

/* ─── Status colour helper ─────────────────────────────────── */
const statusColor = (s) =>
  ({
    Open: "danger",
    "In Progress": "warning",
    Resolved: "success",
    Closed: "secondary",
  })[s] ?? "secondary";

/* ─── Section wrapper ──────────────────────────────────────── */
const Section = ({ title, icon, children }) => (
  <div style={styles.section}>
    <div style={styles.sectionHeader}>
      <span style={styles.sectionIcon}>{icon}</span>
      <span style={styles.sectionTitle}>{title}</span>
    </div>
    <div style={styles.sectionBody}>{children}</div>
  </div>
);

/* ─── Image upload slot ────────────────────────────────────── */
const ImageSlot = ({ label, imageUrl, uploading, onChange, onDelete }) => (
  <div style={styles.imageSlot}>
    <label style={styles.fieldLabel}>{label}</label>
    {uploading ? (
      <div style={styles.imagePreviewBox}>
        <LoadingSpinner />
      </div>
    ) : imageUrl ? (
      <div style={{ position: "relative", display: "inline-block" }}>
        <img src={imageUrl} alt={label} style={styles.imageThumb} />
        <button
          type="button"
          style={styles.imageDeleteBtn}
          onClick={onDelete}
          title="Remove"
        >
          <CIcon icon={cilX} size="sm" />
        </button>
      </div>
    ) : (
      <label style={styles.uploadLabel}>
        <CIcon icon={cilCloudUpload} style={{ marginRight: 6, opacity: 0.6 }} />
        <span style={{ fontSize: 13, color: "#64748b" }}>Click to upload</span>
        <input
          type="file"
          accept="image/*"
          onChange={onChange}
          style={{ display: "none" }}
        />
      </label>
    )}
  </div>
);

/* ─── Main component ───────────────────────────────────────── */
const UpdateClientTicket = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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
  const userInfo = useSelector((state) => state.userInfo);
  let adminroute = "";

  if (userInfo.role === "Master Admin") {
    adminroute = "master-admin";
  } else if (userInfo.role === "Service Admin") {
    adminroute = "service-admin";
  } else if (userInfo.role === "Project Admin") {
    // eslint-disable-next-line no-unused-vars
    adminroute = "project-admin";
  } else if (userInfo?.role === "Master User") {
    adminroute = "master-user";
  } else if (userInfo?.role === "Service User") {
    adminroute = "service-user";
  } else if (userInfo?.role === "Project User") {
    adminroute = "project-user";
  }
  /* fetch */
  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const { data } = await axios.get(`/api/v1/clienttickets/${id}`, {
          withCredentials: true,
        });
        dispatch({ type: "FETCH_TICKET_SUCCESS", payload: data.data });
        setFormData(data.data);
        setResolutionImage1(data.data.resolution_image1 || "");
        setResolutionImage2(data.data.resolution_image2 || "");
      } catch {
        dispatch({
          type: "FETCH_TICKET_FAIL",
          payload: "Failed to load ticket",
        });
        toast.error("Failed to load ticket");
      }
    };
    fetchTicket();
  }, [id]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  /* submit */
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
    updatedTicket.resolution_image1 = resolutionImage1 || null;
    updatedTicket.resolution_image2 = resolutionImage2 || null;
    try {
      await axios.put(`/api/v1/clienttickets/${id}`, updatedTicket, {
        withCredentials: true,
      });
      toast.success("Ticket updated successfully");
      dispatch({ type: "UPDATE_TICKET_SUCCESS" });
      navigate(`/${adminroute}/client-tickets`);
    } catch (error) {
      const msg = error?.response?.data?.message ?? "Update failed";
      dispatch({ type: "UPDATE_TICKET_FAIL", payload: msg });
      toast.error(msg);
    }
  };

  /* image upload helper */
  const uploadImage = async (file, setUrl, setLoading, label) => {
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    try {
      setLoading(true);
      const { data } = await axios.post(
        "/api/v1/image-upload/client-tickets",
        fd,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        },
      );
      setUrl(data.url);
      toast.success(`${label} uploaded`);
    } catch {
      toast.error("Image upload failed");
    } finally {
      setLoading(false);
    }
  };

  if (state.loading) {
    return (
      <div style={styles.loadingWrapper}>
        <LoadingSpinner />
      </div>
    );
  }

  const isResolved = formData.status === "Resolved";

  return (
    <div style={styles.pageWrapper}>
      {/* ── Page header ── */}
      <div style={styles.pageHeader}>
        <div>
          <h4 style={styles.pageTitle}>Update Client Ticket</h4>
          <div style={styles.pageMeta}>
            <span style={styles.ticketIdChip}># {formData.ticket_id}</span>
            {formData.site_id && (
              <span style={styles.siteChip}>Site: {formData.site_id}</span>
            )}
            <CBadge
              color={statusColor(formData.status)}
              style={{ fontSize: 12, padding: "4px 10px" }}
            >
              {formData.status}
            </CBadge>
          </div>
        </div>
        <CButton
          color="light"
          size="sm"
          onClick={() => navigate(`/${adminroute}/client-tickets`)}
          style={styles.backBtn}
        >
          ← Back
        </CButton>
      </div>

      <CForm onSubmit={handleSubmit}>
        <CRow className="g-4">
          {/* ── Left column ── */}
          <CCol lg={8}>
            {/* Basic Info */}
            <Section title="Basic Information" icon="📋">
              <CRow className="g-3">
                <CCol md={6}>
                  <label style={styles.fieldLabel}>Ticket ID</label>
                  <CFormInput
                    value={formData.ticket_id || ""}
                    readOnly
                    style={styles.readonlyInput}
                  />
                </CCol>
                <CCol md={6}>
                  <label style={styles.fieldLabel}>Site ID</label>
                  <CFormInput
                    value={formData.site_id || ""}
                    readOnly
                    style={styles.readonlyInput}
                  />
                </CCol>
                <CCol md={12}>
                  <label style={styles.fieldLabel}>
                    Subject <span style={styles.required}>*</span>
                  </label>
                  <CFormInput
                    name="subject"
                    value={formData.subject || ""}
                    onChange={handleChange}
                    placeholder="Brief summary of the issue"
                    style={styles.input}
                  />
                </CCol>
                <CCol md={12}>
                  <label style={styles.fieldLabel}>Description</label>
                  <CFormTextarea
                    name="description"
                    value={formData.description || ""}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Detailed description of the issue…"
                    style={styles.textarea}
                  />
                </CCol>
              </CRow>
            </Section>

            {/* Root Cause Analysis */}
            <Section title="Root Cause Analysis" icon="🔍">
              <CRow className="g-3">
                <CCol md={12}>
                  <label style={styles.fieldLabel}>
                    Root Cause <span style={styles.required}>*</span>
                  </label>
                  <CFormTextarea
                    name="root_cause"
                    value={formData.root_cause || ""}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Identify the underlying root cause of the issue…"
                    required
                    style={styles.textarea}
                  />
                </CCol>
                <CCol md={12}>
                  <label style={styles.fieldLabel}>
                    Corrective Action <span style={styles.required}>*</span>
                  </label>
                  <CFormTextarea
                    name="corrective_action"
                    value={formData.corrective_action || ""}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Permanent solution implemented to prevent recurrence…"
                    required
                    style={styles.textarea}
                  />
                </CCol>
                <CCol md={12}>
                  <label style={styles.fieldLabel}>
                    Review of Corrective Action{" "}
                    <span style={styles.required}>*</span>
                  </label>
                  <CFormSelect
                    name="review_of_corrective_action"
                    value={formData.review_of_corrective_action || ""}
                    onChange={handleChange}
                    required
                    style={styles.input}
                  >
                    <option value="">— Select —</option>
                    <option value="Yes">
                      Yes – Action reviewed and effective
                    </option>
                    <option value="No">No – Further review needed</option>
                    <option value="Pending">Pending – Under evaluation</option>
                  </CFormSelect>
                </CCol>
              </CRow>
            </Section>

            {/* Resolution */}
            <Section title="Resolution" icon="✅">
              <CRow className="g-3">
                <CCol md={12}>
                  <label style={styles.fieldLabel}>Resolution Notes</label>
                  <CFormTextarea
                    name="resolution_notes"
                    value={formData.resolution_notes || ""}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Steps taken to resolve the issue…"
                    style={styles.textarea}
                  />
                </CCol>

                {/* Resolution images */}
                <CCol md={12}>
                  <label style={styles.fieldLabel}>Resolution Images</label>
                  <div style={styles.imageRow}>
                    <ImageSlot
                      label="Image 1"
                      imageUrl={resolutionImage1}
                      uploading={uploading1}
                      onChange={(e) =>
                        uploadImage(
                          e.target.files[0],
                          setResolutionImage1,
                          setUploading1,
                          "Image 1",
                        )
                      }
                      onDelete={() => {
                        setResolutionImage1("");
                        toast.success("Image 1 removed");
                      }}
                    />
                    <ImageSlot
                      label="Image 2"
                      imageUrl={resolutionImage2}
                      uploading={uploading2}
                      onChange={(e) =>
                        uploadImage(
                          e.target.files[0],
                          setResolutionImage2,
                          setUploading2,
                          "Image 2",
                        )
                      }
                      onDelete={() => {
                        setResolutionImage2("");
                        toast.success("Image 2 removed");
                      }}
                    />
                  </div>
                </CCol>
              </CRow>
            </Section>
          </CCol>

          {/* ── Right column (sidebar) ── */}
          <CCol lg={4}>
            {/* Status & Assignment */}
            <Section title="Status & Assignment" icon="🏷️">
              <div
                style={{ display: "flex", flexDirection: "column", gap: 14 }}
              >
                <div>
                  <label style={styles.fieldLabel}>Status</label>
                  <CFormSelect
                    name="status"
                    value={formData.status || ""}
                    onChange={handleChange}
                    style={styles.input}
                  >
                    <option>Open</option>
                    <option>In Progress</option>
                    <option>Resolved</option>
                    <option>Closed</option>
                  </CFormSelect>
                </div>
                <div>
                  <label style={styles.fieldLabel}>Created By</label>
                  <CFormInput
                    value={formData.created_by?.name || "—"}
                    disabled
                    style={styles.readonlyInput}
                  />
                </div>
                <div>
                  <label style={styles.fieldLabel}>Created At</label>
                  <CFormInput
                    type="datetime-local"
                    value={
                      formData.created_by?.timestamp
                        ? new Date(formData.created_by.timestamp)
                            .toISOString()
                            .slice(0, 16)
                        : ""
                    }
                    disabled
                    style={styles.readonlyInput}
                  />
                </div>

                {isResolved && (
                  <>
                    <div style={styles.divider} />
                    <div>
                      <label style={styles.fieldLabel}>Resolved By</label>
                      <CFormInput
                        value={formData.resolved_by?.name || "—"}
                        disabled
                        style={styles.readonlyInput}
                      />
                    </div>
                    <div>
                      <label style={styles.fieldLabel}>Resolved At</label>
                      <CFormInput
                        type="datetime-local"
                        value={
                          formData.resolved_at
                            ? new Date(formData.resolved_at)
                                .toISOString()
                                .slice(0, 16)
                            : ""
                        }
                        disabled
                        style={styles.readonlyInput}
                      />
                    </div>
                  </>
                )}
              </div>
            </Section>

            {/* Creation Images (read-only) */}
            {(formData.creation_image1 || formData.creation_image2) && (
              <Section title="Creation Images" icon="📷">
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  {formData.creation_image1 && (
                    <a
                      href={formData.creation_image1}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <div style={styles.existingImageWrapper}>
                        <CImage
                          src={formData.creation_image1}
                          width={100}
                          height={70}
                          className="rounded"
                          style={{ objectFit: "cover" }}
                        />
                        <span style={styles.imageCaption}>Image 1</span>
                      </div>
                    </a>
                  )}
                  {formData.creation_image2 && (
                    <a
                      href={formData.creation_image2}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <div style={styles.existingImageWrapper}>
                        <CImage
                          src={formData.creation_image2}
                          width={100}
                          height={70}
                          className="rounded"
                          style={{ objectFit: "cover" }}
                        />
                        <span style={styles.imageCaption}>Image 2</span>
                      </div>
                    </a>
                  )}
                </div>
              </Section>
            )}

            {/* Existing Resolution Images (read-only previews) */}
            {(formData.resolution_image1 || formData.resolution_image2) && (
              <Section title="Saved Resolution Images" icon="🖼️">
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  {formData.resolution_image1 && (
                    <a
                      href={formData.resolution_image1}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <div style={styles.existingImageWrapper}>
                        <CImage
                          src={formData.resolution_image1}
                          width={100}
                          height={70}
                          className="rounded"
                          style={{ objectFit: "cover" }}
                        />
                        <span style={styles.imageCaption}>Image 1</span>
                      </div>
                    </a>
                  )}
                  {formData.resolution_image2 && (
                    <a
                      href={formData.resolution_image2}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <div style={styles.existingImageWrapper}>
                        <CImage
                          src={formData.resolution_image2}
                          width={100}
                          height={70}
                          className="rounded"
                          style={{ objectFit: "cover" }}
                        />
                        <span style={styles.imageCaption}>Image 2</span>
                      </div>
                    </a>
                  )}
                </div>
              </Section>
            )}
          </CCol>
        </CRow>

        {/* ── Footer actions ── */}
        <div style={styles.footer}>
          <CButton
            color="light"
            size="sm"
            onClick={() => navigate(`/${adminroute}/client-tickets`)}
            style={styles.cancelBtn}
          >
            Cancel
          </CButton>
          <CButton
            type="submit"
            color="primary"
            size="sm"
            disabled={state.updating}
            style={styles.submitBtn}
          >
            {state.updating ? (
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <LoadingSpinner /> Updating…
              </span>
            ) : (
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <CIcon icon={cilCheckCircle} /> Update Ticket
              </span>
            )}
          </CButton>
        </div>
      </CForm>
    </div>
  );
};

/* ─── Styles ────────────────────────────────────────────────── */
const styles = {
  pageWrapper: {
    padding: "24px",
    maxWidth: 1200,
    margin: "0 auto",
  },
  loadingWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: 300,
  },
  pageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 28,
    paddingBottom: 20,
    borderBottom: "1px solid #e2e8f0",
  },
  pageTitle: {
    margin: 0,
    fontSize: 22,
    fontWeight: 700,
    letterSpacing: "-0.3px",
  },
  pageMeta: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  ticketIdChip: {
    // border: "1px solid #cbd5e1",
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 600,
    padding: "2px 8px",
    fontFamily: "monospace",
  },
  siteChip: {
    // border: "1px solid #bfdbfe",
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 500,

    padding: "2px 8px",
  },
  backBtn: {
    fontSize: 13,
    fontWeight: 500,
    borderRadius: 8,
    // border: "1px solid #e2e8f0",
    padding: "6px 14px",
  },
  section: {
    // border: "1px solid #e2e8f0",
    borderRadius: 12,
    marginBottom: 20,
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(0,0,0,.04)",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "14px 20px",
    borderBottom: "1px solid #f1f5f9",
  },
  sectionIcon: { fontSize: 16 },
  sectionTitle: {
    fontWeight: 600,
    fontSize: 14,
    letterSpacing: "0.1px",
  },
  sectionBody: { padding: "20px" },
  fieldLabel: {
    display: "block",
    fontSize: 12,
    fontWeight: 600,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  required: {},
  input: {
    borderRadius: 8,
    // border: "1px solid #d1d5db",
    fontSize: 14,
    padding: "8px 12px",
    width: "100%",
  },
  textarea: {
    borderRadius: 8,
    // border: "1px solid #d1d5db",
    fontSize: 14,
    resize: "vertical",
  },
  readonlyInput: {
    borderRadius: 8,
    // border: "1px solid #e2e8f0",
    fontSize: 14,
  },
  divider: {
    height: 1,

    margin: "4px 0",
  },
  imageRow: {
    display: "flex",
    gap: 16,
    flexWrap: "wrap",
  },
  imageSlot: {
    flex: "1 1 140px",
  },
  uploadLabel: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    // border: "2px dashed #cbd5e1",
    borderRadius: 10,
    padding: "16px 12px",
    cursor: "pointer",
    transition: "border-color 0.2s",
  },
  imagePreviewBox: {
    // border: "1px solid #e2e8f0",
    borderRadius: 10,
    padding: 16,
    display: "flex",
    justifyContent: "center",
  },
  imageThumb: {
    width: 80,
    height: 80,
    objectFit: "cover",
    borderRadius: 8,
    // border: "1px solid #e2e8f0",
    display: "block",
  },
  imageDeleteBtn: {
    position: "absolute",
    top: -8,
    right: -8,
    // border: "none",
    borderRadius: "50%",
    width: 22,
    height: 22,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    padding: 0,
  },
  existingImageWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
    cursor: "pointer",
    transition: "opacity 0.2s",
  },
  imageCaption: {
    fontSize: 11,
    fontWeight: 500,
  },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    paddingTop: 20,
    marginTop: 8,
    borderTop: "1px solid #e2e8f0",
  },
  cancelBtn: {
    borderRadius: 8,
    fontWeight: 500,
    fontSize: 14,
    padding: "8px 18px",
    // border: "1px solid #e2e8f0",
  },
  submitBtn: {
    borderRadius: 8,
    fontWeight: 600,
    fontSize: 14,
    padding: "8px 22px",
    boxShadow: "0 1px 3px rgba(59,130,246,.25)",
  },
};

export default UpdateClientTicket;
