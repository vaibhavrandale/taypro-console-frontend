// // import React from "react";

// // const UpdateMms = () => {
// //   return <div>UpdateMms</div>;
// // };

// // export default UpdateMms;

// import React, { useEffect, useReducer, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { useSelector } from "react-redux";

// import {
//   CButton,
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CCol,
//   CFormInput,
//   CFormLabel,
//   CFormSelect,
//   CFormTextarea,
//   CRow,
// } from "@coreui/react";
// import LoadingSpinner from "../../components/LoadingSpinner";

// const reducer = (state, action) => {
//   switch (action.type) {
//     case "FETCH_REQUEST":
//       return {
//         ...state,
//         fetchloading: true,
//         error: "",
//       };

//     case "FETCH_SUCCESS":
//       return {
//         ...state,
//         fetchloading: false,
//         error: "",
//       };

//     case "FETCH_FAIL":
//       return {
//         ...state,
//         fetchloading: false,
//         error: action.payload,
//       };

//     case "UPDATE_REQUEST":
//       return {
//         ...state,
//         updateloading: true,
//       };

//     case "UPDATE_SUCCESS":
//       return {
//         ...state,
//         updateloading: false,
//       };

//     case "UPDATE_FAIL":
//       return {
//         ...state,
//         updateloading: false,
//         error: action.payload,
//       };

//     default:
//       return state;
//   }
// };

// const UpdateMms = () => {
//   const [{ fetchloading, updateloading, error }, dispatch] = useReducer(
//     reducer,
//     {
//       fetchloading: true,
//       updateloading: false,
//       error: "",
//     },
//   );

//   const { id } = useParams();

//   const navigate = useNavigate();

//   const userInfo = useSelector((state) => state.userInfo);

//   const [imageUploading, setImageUploading] = useState({});
//   const [imageRemoving, setImageRemoving] = useState({});

//   const [formData, setFormData] = useState({
//     status: "",
//     remark: "",
//     tilt_angle: {},
//     perlin: {},
//     rafter: {},
//     braces: {},
//     column: {},
//     site_survey: [],
//   });

//   /**
//    * ADMIN ROUTE
//    */

//   let adminroute = "";

//   if (userInfo?.role === "Master Admin") {
//     adminroute = "master-admin";
//   } else if (userInfo?.role === "Master User") {
//     adminroute = "master-user";
//   } else if (userInfo?.role === "Service Admin") {
//     adminroute = "service-admin";
//   } else if (userInfo?.role === "Project Admin") {
//     adminroute = "project-admin";
//   } else if (userInfo?.role === "Design Admin") {
//     adminroute = "design-admin";
//   } else if (userInfo?.role === "Site Incharge") {
//     adminroute = "site-incharge";
//   } else if (userInfo?.role === "Site Technician") {
//     adminroute = "site-technician";
//   } else if (userInfo?.role === "Client Site Technician") {
//     adminroute = "client-site-technician";
//   } else if (userInfo?.role === "Project User") {
//     adminroute = "project-user";
//   } else if (userInfo?.role === "Service User") {
//     adminroute = "service-user";
//   }

//   /**
//    * FETCH DATA
//    */

//   useEffect(() => {
//     const fetchMmsStructure = async () => {
//       dispatch({
//         type: "FETCH_REQUEST",
//       });

//       try {
//         const response = await axios.get(`/api/v1/mms-structure/${id}`, {
//           withCredentials: true,
//         });

//         const data = response.data.data;

//         setFormData({
//           status: data.status || "",
//           remark: data.remark || "",
//           tilt_angle: data.tilt_angle || {},
//           perlin: data.perlin || {},
//           rafter: data.rafter || {},
//           braces: data.braces || {},
//           column: data.column || {},
//           site_survey: data.site_survey || [],
//         });

//         dispatch({
//           type: "FETCH_SUCCESS",
//         });
//       } catch (error) {
//         dispatch({
//           type: "FETCH_FAIL",
//           payload: error.response?.data?.message || error.message,
//         });

//         toast.error(error.response?.data?.message || error.message);
//       }
//     };

//     fetchMmsStructure();
//   }, [id]);

//   /**
//    * NORMAL FIELD CHANGE
//    */

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   /**
//    * UPDATE NESTED FIELD
//    */

//   const updateNestedField = (obj, path, value) => {
//     const keys = path.split(".");

//     const updated = { ...obj };

//     let current = updated;

//     for (let i = 0; i < keys.length - 1; i++) {
//       current[keys[i]] = {
//         ...current[keys[i]],
//       };

//       current = current[keys[i]];
//     }

//     current[keys[keys.length - 1]] = value;

//     return updated;
//   };

//   /**
//    * HANDLE FIELD CHANGE
//    */

//   const handleFieldChange = (path, value) => {
//     setFormData((prev) => updateNestedField(prev, path, value));
//   };

//   /**
//    * UPLOAD ATTACHMENT
//    */

//   const handleAttachmentUpload = async (e, path) => {
//     const files = Array.from(e.target.files);

//     if (!files.length) return;

//     try {
//       setImageUploading((prev) => ({
//         ...prev,
//         [path]: true,
//       }));

//       const uploadedAttachments = [];

//       for (const file of files) {
//         const bodyFormData = new FormData();

//         bodyFormData.append("file", file);

//         const response = await axios.post(
//           `/api/v1/image-upload/mms-structure`,
//           bodyFormData,
//           {
//             headers: {
//               "Content-Type": "multipart/form-data",
//             },
//             withCredentials: true,
//           },
//         );

//         uploadedAttachments.push({
//           name: response.data.original_name || file.name,

//           img: response.data.url,

//           preview_url: response.data.preview_url || response.data.url,
//         });
//       }

//       const currentAttachments =
//         path.split(".").reduce((acc, key) => acc[key], formData)
//           ?.attatchments || [];

//       const updated = updateNestedField(formData, `${path}.attatchments`, [
//         ...currentAttachments,
//         ...uploadedAttachments,
//       ]);

//       setFormData(updated);

//       toast.success("Attachments uploaded successfully!");
//     } catch (error) {
//       toast.error(
//         error.response?.data?.message ||
//           error.response?.data?.error ||
//           "Failed to upload attachments",
//       );
//     } finally {
//       setImageUploading((prev) => ({
//         ...prev,
//         [path]: false,
//       }));
//     }
//   };

//   /**
//    * REMOVE ATTACHMENT
//    */

//   const handleRemoveAttachment = async (path, attachmentIndex) => {
//     try {
//       setImageRemoving((prev) => ({
//         ...prev,
//         [`${path}-${attachmentIndex}`]: true,
//       }));

//       const attachments =
//         path.split(".").reduce((acc, key) => acc[key], formData)
//           ?.attatchments || [];

//       const updatedAttachments = attachments.filter(
//         (_, idx) => idx !== attachmentIndex,
//       );

//       const updated = updateNestedField(
//         formData,
//         `${path}.attatchments`,
//         updatedAttachments,
//       );

//       setFormData(updated);

//       toast.success("Attachment removed successfully!");
//     } catch (error) {
//       toast.error("Failed to remove attachment");
//     } finally {
//       setImageRemoving((prev) => ({
//         ...prev,
//         [`${path}-${attachmentIndex}`]: false,
//       }));
//     }
//   };

//   /**
//    * RENDER DYNAMIC FIELDS
//    */

//   const renderFields = (obj, parentPath = "") => {
//     return Object.entries(obj).map(([key, value]) => {
//       const currentPath = parentPath ? `${parentPath}.${key}` : key;

//       /**
//        * VALUE FIELD
//        */

//       if (typeof value === "object" && value !== null && "value" in value) {
//         return (
//           <CCol md={6} key={currentPath} className="mb-4">
//             <CCard className="shadow-sm h-100">
//               <CCardBody>
//                 <CFormLabel className="fw-bold text-capitalize">
//                   {key.replaceAll("_", " ")}
//                 </CFormLabel>

//                 <CFormInput
//                   type="number"
//                   value={value.value || ""}
//                   onChange={(e) =>
//                     handleFieldChange(`${currentPath}.value`, e.target.value)
//                   }
//                 />

//                 {/* ATTACHMENTS */}
//                 <div className="mt-3">
//                   <div className="d-flex align-items-center gap-2">
//                     <CFormInput
//                       type="file"
//                       multiple
//                       onChange={(e) => handleAttachmentUpload(e, currentPath)}
//                     />

//                     {imageUploading[currentPath] && <LoadingSpinner />}
//                   </div>

//                   {Array.isArray(value.attatchments) &&
//                     value.attatchments.length > 0 && (
//                       <div className="d-flex flex-wrap gap-2 mt-3">
//                         {value.attatchments.map((attachment, idx) => (
//                           <div
//                             key={idx}
//                             className="position-relative border rounded p-1"
//                           >
//                             <img
//                               src={attachment.preview_url || attachment.img}
//                               alt={attachment.name}
//                               width={100}
//                               height={100}
//                               className="rounded"
//                               style={{
//                                 objectFit: "cover",
//                               }}
//                             />

//                             <button
//                               type="button"
//                               className="btn btn-danger btn-sm position-absolute top-0 end-0"
//                               style={{
//                                 padding: "2px 6px",
//                                 fontSize: "10px",
//                               }}
//                               onClick={() =>
//                                 handleRemoveAttachment(currentPath, idx)
//                               }
//                             >
//                               {imageRemoving[`${currentPath}-${idx}`] ? (
//                                 <LoadingSpinner />
//                               ) : (
//                                 "X"
//                               )}
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                 </div>
//               </CCardBody>
//             </CCard>
//           </CCol>
//         );
//       }

//       /**
//        * NESTED OBJECT
//        */

//       if (typeof value === "object" && value !== null) {
//         return (
//           <div key={currentPath}>
//             <h5 className="mt-4 text-uppercase">{key.replaceAll("_", " ")}</h5>

//             <CRow>{renderFields(value, currentPath)}</CRow>
//           </div>
//         );
//       }

//       /**
//        * STRING FIELD
//        */

//       if (typeof value === "string") {
//         return (
//           <CCol md={12} key={currentPath} className="mb-3">
//             <CFormLabel className="fw-bold text-capitalize">
//               {key.replaceAll("_", " ")}
//             </CFormLabel>

//             <CFormTextarea
//               rows={3}
//               value={value}
//               onChange={(e) => handleFieldChange(currentPath, e.target.value)}
//             />
//           </CCol>
//         );
//       }

//       return null;
//     });
//   };

//   /**
//    * SUBMIT
//    */

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     dispatch({
//       type: "UPDATE_REQUEST",
//     });

//     try {
//       await axios.put(`/api/v1/mms-structure/${id}`, formData, {
//         withCredentials: true,
//       });

//       dispatch({
//         type: "UPDATE_SUCCESS",
//       });

//       toast.success("MMS Structure updated successfully!");

//       navigate(`/${adminroute}/view-mms-structure/${id}`);
//     } catch (error) {
//       dispatch({
//         type: "UPDATE_FAIL",
//         payload: error.response?.data?.message || error.message,
//       });

//       toast.error(error.response?.data?.message || error.message);
//     }
//   };

//   /**
//    * LOADING
//    */

//   if (fetchloading) {
//     return <LoadingSpinner />;
//   }

//   /**
//    * ERROR
//    */

//   if (error) {
//     return <p className="text-danger text-center mt-3">{error}</p>;
//   }

//   return (
//     <div className="update-robot-container px-3">
//       <CCard className="w-100 shadow-sm rounded-lg">
//         <CCardHeader>
//           <h4 className="mb-0">Update MMS Structure</h4>
//         </CCardHeader>

//         <CCardBody>
//           <form onSubmit={handleSubmit}>
//             {/* STATUS + REMARK */}
//             <CRow>
//               <CCol md={6} className="mb-3">
//                 <CFormLabel>Status</CFormLabel>

//                 <CFormSelect
//                   name="status"
//                   value={formData.status}
//                   onChange={handleChange}
//                 >
//                   <option value="">Select Status</option>

//                   <option value="draft">Draft</option>

//                   <option value="completed">Completed</option>

//                   <option value="submitted">Submitted</option>

//                   <option value="approved">Approved</option>

//                   <option value="rejected">Rejected</option>
//                 </CFormSelect>
//               </CCol>
//               <CCol md={12} className="mb-4">
//                 <CCard className="shadow-sm">
//                   <CCardBody>
//                     <CFormLabel className="fw-bold">Tilt Angle</CFormLabel>

//                     <CFormInput
//                       type="number"
//                       value={formData?.tilt_angle?.value || ""}
//                       onChange={(e) =>
//                         handleFieldChange("tilt_angle.value", e.target.value)
//                       }
//                     />
//                     {/* ATTACHMENTS */}
//                     <div className="mt-3">
//                       <div className="d-flex align-items-center gap-2">
//                         <CFormInput
//                           type="file"
//                           multiple
//                           onChange={(e) =>
//                             handleAttachmentUpload(e, "tilt_angle")
//                           }
//                         />

//                         {imageUploading["tilt_angle"] && <LoadingSpinner />}
//                       </div>

//                       {Array.isArray(formData?.tilt_angle?.attatchments) &&
//                         formData.tilt_angle.attatchments.length > 0 && (
//                           <div className="d-flex flex-wrap gap-2 mt-3">
//                             {formData.tilt_angle.attatchments.map(
//                               (attachment, idx) => (
//                                 <div
//                                   key={idx}
//                                   className="position-relative border rounded p-1"
//                                 >
//                                   <img
//                                     src={
//                                       attachment.preview_url || attachment.img
//                                     }
//                                     alt={attachment.name}
//                                     width={100}
//                                     height={100}
//                                     className="rounded"
//                                     style={{
//                                       objectFit: "cover",
//                                     }}
//                                   />

//                                   <button
//                                     type="button"
//                                     className="btn btn-danger btn-sm position-absolute top-0 end-0"
//                                     style={{
//                                       padding: "2px 6px",
//                                       fontSize: "10px",
//                                     }}
//                                     onClick={() =>
//                                       handleRemoveAttachment("tilt_angle", idx)
//                                     }
//                                   >
//                                     {imageRemoving[`tilt_angle-${idx}`] ? (
//                                       <LoadingSpinner />
//                                     ) : (
//                                       "X"
//                                     )}
//                                   </button>
//                                 </div>
//                               ),
//                             )}
//                           </div>
//                         )}
//                     </div>
//                   </CCardBody>
//                 </CCard>
//               </CCol>

//               <CCol md={12} className="mb-3">
//                 <CFormLabel>Remark</CFormLabel>

//                 <CFormTextarea
//                   rows={4}
//                   name="remark"
//                   value={formData.remark}
//                   onChange={handleChange}
//                 />
//               </CCol>
//             </CRow>

//             {/* PERLIN */}
//             <h4 className="mt-4 mb-3">Perlin</h4>

//             <CRow>{renderFields(formData.perlin, "perlin")}</CRow>

//             {/* RAFTER */}
//             <h4 className="mt-4 mb-3">Rafter</h4>

//             <CRow>{renderFields(formData.rafter, "rafter")}</CRow>

//             {/* BRACES */}
//             <h4 className="mt-4 mb-3">Braces</h4>

//             <CRow>{renderFields(formData.braces, "braces")}</CRow>

//             {/* COLUMN */}
//             <h4 className="mt-4 mb-3">Column</h4>

//             <CRow>{renderFields(formData.column, "column")}</CRow>

//             {/* SUBMIT */}
//             <div className="d-flex justify-content-end mt-4">
//               <CButton type="submit" color="warning" size="sm" className="w-25">
//                 {updateloading ? (
//                   <>
//                     Updating...
//                     <LoadingSpinner />
//                   </>
//                 ) : (
//                   "Update"
//                 )}
//               </CButton>
//             </div>
//           </form>
//         </CCardBody>
//       </CCard>
//     </div>
//   );
// };

// export default UpdateMms;

import React, { useEffect, useReducer, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CRow,
  CSpinner,
  CBadge,
} from "@coreui/react";
import LoadingSpinner from "../../components/LoadingSpinner";

// ─── Constants ────────────────────────────────────────────────────────────────

const PART_COLORS = {
  column: "#fff",
  rafter: "#fff",
  perlin: "#fff",
  braces: "#fff",
  tilt_angle: "#fff",
};

const SECTION_LABELS = {
  column: "Column",
  rafter: "Rafter",
  perlin: "Perlin",
  braces: "Braces",
  tilt_angle: "Tilt Angle",
};

const LABEL_MAP = {
  height: "Height (H)",
  width: "Width (W)",
  thickness: "Thickness (T)",
  c_bar_height: "C-Bar Height",
  flenge_length: "Flange Length",
  total_length: "Total Length",
  piling_depth_length: "Pile Depth",
  upper_ground_length: "Above Ground",
  pilling_diameter: "Pile Diameter (Ø)",
  length: "Length",
  perlin_count: "Perlin Count",
  module_to_perlin_gap: "Module → Perlin Gap",
  perlin_to_perlin_gap: "Perlin → Perlin Gap",
  center_perlin_to_perlin_gap: "Center P → P Gap",
  tilt_angle: "Tilt Angle (°)",
};

const getLabel = (key) =>
  LABEL_MAP[key] ||
  key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

// ─── Reducer ──────────────────────────────────────────────────────────────────

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, fetchloading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, fetchloading: false, error: "" };
    case "FETCH_FAIL":
      return { ...state, fetchloading: false, error: action.payload };
    case "UPDATE_REQUEST":
      return { ...state, updateloading: true };
    case "UPDATE_SUCCESS":
      return { ...state, updateloading: false };
    case "UPDATE_FAIL":
      return { ...state, updateloading: false, error: action.payload };
    default:
      return state;
  }
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const updateNestedField = (obj, path, value) => {
  const keys = path.split(".");
  const updated = JSON.parse(JSON.stringify(obj));
  let current = updated;
  for (let i = 0; i < keys.length - 1; i++) {
    current[keys[i]] = current[keys[i]] || {};
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = value;
  return updated;
};

const getNestedValue = (obj, path) =>
  path.split(".").reduce((acc, key) => acc?.[key], obj);

const getAdminRoute = (role) => {
  const map = {
    "Master Admin": "master-admin",
    "Master User": "master-user",
    "Service Admin": "service-admin",
    "Project Admin": "project-admin",
    "Design Admin": "design-admin",
    "Site Incharge": "site-incharge",
    "Site Technician": "site-technician",
    "Client Site Technician": "client-site-technician",
    "Project User": "project-user",
    "Service User": "service-user",
  };
  return map[role] || "";
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const S = {
  page: { padding: "24px 0" },
  sectionCard: (color) => ({
    border: `1.5px solid ${color}20`,
    borderRadius: 8,
    marginBottom: 20,
    overflow: "hidden",
  }),
  sectionHeader: (color) => ({
    background: `${color}10`,
    borderBottom: `1.5px solid ${color}25`,
    padding: "12px 18px",
    display: "flex",
    alignItems: "center",
    gap: 10,
    cursor: "pointer",
    userSelect: "none",
  }),
  dot: (color) => ({
    width: 10,
    height: 10,
    borderRadius: "50%",
    background: color,
    flexShrink: 0,
  }),
  sectionTitle: (color) => ({
    fontSize: 13,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    color,
    margin: 0,
    flex: 1,
  }),
  chevron: { fontSize: 12, color: "#888" },
  sectionBody: { padding: "18px 18px 8px" },
  fieldCard: (color) => ({
    border: `1px solid #e5e7eb`,
    borderLeft: `3px solid ${color}`,
    borderRadius: 6,
    padding: "12px 14px",
    marginBottom: 14,
    // background: "#fafafa",
  }),
  fieldLabel: {
    fontSize: 11,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    color: "#6b7280",
    marginBottom: 6,
    display: "block",
  },
  inputRow: { display: "flex", gap: 8, alignItems: "center" },
  inputWrap: { flex: 1, position: "relative" },
  suffix: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: 10,
    color: "#9ca3af",
    fontWeight: 700,
    pointerEvents: "none",
  },
  input: {
    paddingRight: 36,
    fontSize: 13,
  },
  uploadBtn: (uploading) => ({
    padding: "6px 12px",
    fontSize: 12,
    fontWeight: 600,
    background: uploading ? "#f3f4f6" : "#fff",
    border: "1.5px solid #d1d5db",
    borderRadius: 5,
    cursor: uploading ? "not-allowed" : "pointer",
    color: "#374151",
    display: "flex",
    alignItems: "center",
    gap: 5,
    whiteSpace: "nowrap",
    flexShrink: 0,
  }),
  attachGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },
  attachItem: {
    position: "relative",
    border: "1px solid #e5e7eb",
    borderRadius: 6,
    overflow: "hidden",
  },
  attachImg: { width: 80, height: 80, objectFit: "cover", display: "block" },
  removeBtn: {
    position: "absolute",
    top: 3,
    right: 3,
    background: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: 3,
    width: 20,
    height: 20,
    fontSize: 10,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
  },
  subBadge: (bg, color) => ({
    display: "inline-block",
    fontSize: 10,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    background: bg,
    color,
    borderRadius: 4,
    padding: "3px 8px",
    marginBottom: 12,
    marginTop: 4,
  }),
  submitRow: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 12,
    paddingTop: 24,
    borderTop: "1.5px solid #e5e7eb",
    marginTop: 8,
  },
};

// ─── DimensionField ───────────────────────────────────────────────────────────

function DimensionField({
  fieldKey,
  value,
  path,
  color,
  onFieldChange,
  onUpload,
  onRemove,
  uploading,
  removing,
}) {
  const fileRef = useRef(null);
  const label = getLabel(fieldKey);
  const attachments = value?.attatchments || [];

  return (
    <div style={S.fieldCard(color || "#9ca3af")}>
      <span style={S.fieldLabel}>{label}</span>

      <div style={S.inputRow}>
        <div style={S.inputWrap}>
          <input
            type="number"
            className="form-control form-control-sm"
            style={S.input}
            placeholder="0"
            value={value?.value || ""}
            onChange={(e) => onFieldChange(`${path}.value`, e.target.value)}
          />
          {/* <span style={S.suffix}>mm</span> */}
        </div>

        <input
          type="file"
          ref={fileRef}
          style={{ display: "none" }}
          accept="image/*,.pdf,video/*"
          multiple
          onChange={(e) => onUpload(e, path)}
        />

        <button
          type="button"
          style={S.uploadBtn(uploading?.[path])}
          onClick={() => fileRef.current?.click()}
          disabled={uploading?.[path]}
        >
          {uploading?.[path] ? (
            <>
              <CSpinner size="sm" /> Uploading…
            </>
          ) : (
            <>📎 Add</>
          )}
        </button>
      </div>

      {attachments.length > 0 && (
        <div style={S.attachGrid}>
          {attachments.map((att, idx) => (
            <div key={idx} style={S.attachItem}>
              <img
                src={att.preview_url || att.img}
                alt={att.name}
                style={S.attachImg}
              />
              <button
                type="button"
                style={S.removeBtn}
                onClick={() => onRemove(path, idx)}
              >
                {removing?.[`${path}-${idx}`] ? "…" : "✕"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── SectionBlock ─────────────────────────────────────────────────────────────

function SectionBlock({ sectionKey, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const color = PART_COLORS[sectionKey] || "#6b7280";
  const label = SECTION_LABELS[sectionKey] || sectionKey;

  return (
    <div style={S.sectionCard(color)}>
      <div style={S.sectionHeader(color)} onClick={() => setOpen((p) => !p)}>
        <span style={S.dot(color)} />
        <span style={S.sectionTitle(color)}>{label}</span>
        <span style={S.chevron}>{open ? "▲" : "▼"}</span>
      </div>
      {open && <div style={S.sectionBody}>{children}</div>}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const UpdateMms = () => {
  const [{ fetchloading, updateloading, error }, dispatch] = useReducer(
    reducer,
    {
      fetchloading: true,
      updateloading: false,
      error: "",
    },
  );

  const { id } = useParams();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.userInfo);
  const adminroute = getAdminRoute(userInfo?.role);

  const [imageUploading, setImageUploading] = useState({});
  const [imageRemoving, setImageRemoving] = useState({});

  const [formData, setFormData] = useState({
    status: "",
    remark: "",
    tilt_angle: { value: "", attatchments: [] },
    perlin: {},
    rafter: {},
    braces: {},
    column: {},
    site_survey: [],
  });

  // ── Fetch ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const { data } = await axios.get(`/api/v1/mms-structure/${id}`, {
          withCredentials: true,
        });
        const d = data.data;
        setFormData({
          status: d.status || "",
          remark: d.remark || "",
          tilt_angle: d.tilt_angle || { value: "", attatchments: [] },
          perlin: d.perlin || {},
          rafter: d.rafter || {},
          braces: d.braces || {},
          column: d.column || {},
          site_survey: d.site_survey || [],
        });
        dispatch({ type: "FETCH_SUCCESS" });
      } catch (err) {
        const msg = err.response?.data?.message || err.message;
        dispatch({ type: "FETCH_FAIL", payload: msg });
        toast.error(msg);
      }
    };
    fetchData();
  }, [id]);

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFieldChange = (path, value) => {
    setFormData((prev) => updateNestedField(prev, path, value));
  };

  const handleUpload = async (e, path) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setImageUploading((prev) => ({ ...prev, [path]: true }));
    try {
      const uploaded = [];
      for (const file of files) {
        const fd = new FormData();
        fd.append("file", file);
        const { data } = await axios.post(
          "/api/v1/image-upload/mms-structure",
          fd,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          },
        );
        uploaded.push({
          name: data.original_name || file.name,
          img: data.url,
          preview_url: data.preview_url || data.url,
        });
      }
      const current = getNestedValue(formData, `${path}.attatchments`) || [];
      setFormData((prev) =>
        updateNestedField(prev, `${path}.attatchments`, [
          ...current,
          ...uploaded,
        ]),
      );
      toast.success("Uploaded successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setImageUploading((prev) => ({ ...prev, [path]: false }));
    }
  };

  const handleRemove = async (path, idx) => {
    const key = `${path}-${idx}`;
    setImageRemoving((prev) => ({ ...prev, [key]: true }));
    try {
      const current = getNestedValue(formData, `${path}.attatchments`) || [];
      const updated = current.filter((_, i) => i !== idx);
      setFormData((prev) =>
        updateNestedField(prev, `${path}.attatchments`, updated),
      );
      toast.success("Removed!");
    } catch {
      toast.error("Remove failed");
    } finally {
      setImageRemoving((prev) => ({ ...prev, [key]: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "UPDATE_REQUEST" });
    try {
      await axios.put(`/api/v1/mms-structure/${id}`, formData, {
        withCredentials: true,
      });
      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success("Updated successfully!");
      navigate(`/${adminroute}/view-mms-structure/${id}`);
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      dispatch({ type: "UPDATE_FAIL", payload: msg });
      toast.error(msg);
    }
  };

  // ── Render fields recursively ──────────────────────────────────────────────

  const renderDimensionFields = (obj, parentPath, color) => {
    return Object.entries(obj).map(([key, val]) => {
      const path = parentPath ? `${parentPath}.${key}` : key;

      // skip string metadata fields like type, description
      if (typeof val === "string") return null;

      // dimension field (has .value)
      if (typeof val === "object" && val !== null && "value" in val) {
        return (
          <CCol md={6} key={path}>
            <DimensionField
              fieldKey={key}
              value={val}
              path={path}
              color={color}
              onFieldChange={handleFieldChange}
              onUpload={handleUpload}
              onRemove={handleRemove}
              uploading={imageUploading}
              removing={imageRemoving}
            />
          </CCol>
        );
      }

      // nested object (e.g. perlin_dimension, a, b)
      if (typeof val === "object" && val !== null) {
        const isSubSection = ["a", "b", "perlin_dimension"].includes(key);
        const subColor = key === "b" ? "#dc2626" : color;
        const subBg =
          key === "a" ? "#fef3c7" : key === "b" ? "#fee2e2" : "#ede9fe";
        const subTextColor =
          key === "a" ? "#d97706" : key === "b" ? "#dc2626" : "#7c3aed";
        const subLabel =
          key === "a"
            ? "Brace A — diagonal"
            : key === "b"
              ? "Brace B — horizontal"
              : "Perlin Spacing on Rafter";

        return (
          <CCol md={12} key={path}>
            {isSubSection && (
              <span style={S.subBadge(subBg, subTextColor)}>{subLabel}</span>
            )}
            <CRow>{renderDimensionFields(val, path, subColor)}</CRow>
          </CCol>
        );
      }

      return null;
    });
  };

  // ── Guards ─────────────────────────────────────────────────────────────────

  if (fetchloading) return <LoadingSpinner />;
  if (error) return <p className="text-danger text-center mt-4">{error}</p>;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div style={S.page}>
      <CCard className="shadow-sm">
        <CCardHeader className="d-flex align-items-center justify-content-between">
          <h5 className="mb-0 fw-bold">Update MMS Structure</h5>
          <CBadge
            color="secondary"
            shape="rounded-pill"
            style={{ fontSize: 11 }}
          >
            {id}
          </CBadge>
        </CCardHeader>

        <CCardBody>
          <form onSubmit={handleSubmit}>
            {/* ── Basic Info ── */}
            <CRow className="mb-3">
              <CCol md={6} className="mb-3">
                <CFormLabel className="fw-semibold">Status</CFormLabel>
                <CFormSelect
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="">Select Status</option>
                  <option value="draft">Draft</option>
                  <option value="completed">Completed</option>
                  <option value="submitted">Submitted</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </CFormSelect>
              </CCol>

              <CCol md={12} className="mb-3">
                <CFormLabel className="fw-semibold">Remark</CFormLabel>
                <CFormTextarea
                  rows={3}
                  name="remark"
                  value={formData.remark}
                  onChange={handleChange}
                  placeholder="Optional note..."
                />
              </CCol>
            </CRow>

            <hr className="mb-4" />
            <h6
              className="fw-bold text-uppercase mb-3"
              style={{ letterSpacing: "1px", fontSize: 12, color: "#fff" }}
            >
              Structure Measurements
            </h6>

            {/* ── Tilt Angle ── */}
            <SectionBlock sectionKey="tilt_angle" defaultOpen>
              <CRow>
                <CCol md={6}>
                  <DimensionField
                    fieldKey="tilt_angle"
                    value={formData.tilt_angle}
                    path="tilt_angle"
                    color={PART_COLORS.tilt_angle}
                    onFieldChange={handleFieldChange}
                    onUpload={handleUpload}
                    onRemove={handleRemove}
                    uploading={imageUploading}
                    removing={imageRemoving}
                  />
                </CCol>
              </CRow>
            </SectionBlock>

            {/* ── Column ── */}
            <SectionBlock sectionKey="column">
              <CRow>
                {renderDimensionFields(
                  formData.column,
                  "column",
                  PART_COLORS.column,
                )}
              </CRow>
            </SectionBlock>

            {/* ── Rafter ── */}
            <SectionBlock sectionKey="rafter">
              <CRow>
                {renderDimensionFields(
                  formData.rafter,
                  "rafter",
                  PART_COLORS.rafter,
                )}
              </CRow>
            </SectionBlock>

            {/* ── Perlin ── */}
            <SectionBlock sectionKey="perlin">
              {/* type + description as simple text inputs */}
              <CRow className="mb-3">
                <CCol md={4}>
                  <CFormLabel className="fw-semibold" style={{ fontSize: 12 }}>
                    Perlin Type
                  </CFormLabel>
                  <CFormSelect
                    value={formData.perlin?.type || ""}
                    onChange={(e) =>
                      handleFieldChange("perlin.type", e.target.value)
                    }
                    size="sm"
                  >
                    <option value="">Select</option>
                    <option value="C">C-type</option>
                    <option value="Z">Z-type</option>
                    <option value="U">U-type</option>
                  </CFormSelect>
                </CCol>
                <CCol md={8}>
                  <CFormLabel className="fw-semibold" style={{ fontSize: 12 }}>
                    Description
                  </CFormLabel>
                  <CFormInput
                    size="sm"
                    value={formData.perlin?.description || ""}
                    onChange={(e) =>
                      handleFieldChange("perlin.description", e.target.value)
                    }
                    placeholder="Optional"
                  />
                </CCol>
              </CRow>
              <CRow>
                {renderDimensionFields(
                  formData.perlin?.perlin_dimension || {},
                  "perlin.perlin_dimension",
                  PART_COLORS.perlin,
                )}
              </CRow>
            </SectionBlock>

            {/* ── Braces ── */}
            <SectionBlock sectionKey="braces">
              <CRow>
                {renderDimensionFields(
                  formData.braces,
                  "braces",
                  PART_COLORS.braces,
                )}
              </CRow>
            </SectionBlock>

            {/* ── Submit ── */}
            <div style={S.submitRow}>
              <CButton
                type="button"
                color="light"
                onClick={() => navigate(-1)}
                style={{ fontSize: 13 }}
              >
                Cancel
              </CButton>
              <CButton
                type="submit"
                color="warning"
                disabled={updateloading}
                style={{ fontSize: 13, fontWeight: 700, minWidth: 130 }}
              >
                {updateloading ? (
                  <>
                    <CSpinner size="sm" className="me-2" />
                    Updating…
                  </>
                ) : (
                  "→ Update"
                )}
              </CButton>
            </div>
          </form>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default UpdateMms;
