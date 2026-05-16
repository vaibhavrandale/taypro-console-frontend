import React, { useReducer, useEffect, useRef } from "react";

import axios from "axios";

import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CForm,
  CFormLabel,
  CFormInput,
  CFormTextarea,
  CFormSelect,
  CButton,
  CSpinner,
  CAlert,
  CBadge,
  CInputGroup,
  CInputGroupText,
} from "@coreui/react";

import CIcon from "@coreui/icons-react";

import { cilPlus, cilCloudUpload, cilImage, cilX } from "@coreui/icons";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// ─── Constants ────────────────────────────────────────────────────────────────

const MMS_TYPES = [
  { value: "", label: "Select MMS Type" },

  { value: "1P-1L", label: "1 Panel Portrait / Landscape MMS" },

  { value: "2P", label: "2P MMS" },

  { value: "3P-3L", label: "3 Panel Portrait / Landscape MMS" },

  { value: "4P-4L", label: "4 Panel Portrait / Landscape MMS" },

  { value: "tracker", label: "Tracker MMS" },
];

// ─── Reducer ──────────────────────────────────────────────────────────────────

const initialState = {
  loading: false,

  templateLoading: false,

  templateError: null,

  success: false,

  error: null,

  mmsTypeName: "",

  referenceFiles: [],

  formData: {
    client: { client_name: "" },

    site: { site_name: "", location: "" },

    mms_type: "",

    remark: "",

    nomenclature: [],
  },
};

function reducer(state, action) {
  switch (action.type) {
    case "CREATE_REQUEST":
      return { ...state, loading: true, success: false, error: null };

    case "CREATE_SUCCESS":
      return { ...state, loading: false, success: true, error: null };

    case "CREATE_FAIL":
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload,
      };

    case "TEMPLATE_REQUEST":
      return { ...state, templateLoading: true, templateError: null };

    case "TEMPLATE_SUCCESS":
      return {
        ...state,

        templateLoading: false,

        templateError: null,

        mmsTypeName: action.mms_type_name,

        referenceFiles: action.reference_files,

        formData: {
          ...state.formData,

          nomenclature: action.fields.map((f) => ({
            key: f.key,

            name: f.name,

            description: f.description,

            value: f.value !== undefined ? f.value : "",

            attachments: [],

            _uploading: false,
          })),
        },
      };

    case "TEMPLATE_FAIL":
      return {
        ...state,

        templateLoading: false,

        templateError: action.payload,

        mmsTypeName: "",

        referenceFiles: [],

        formData: { ...state.formData, nomenclature: [] },
      };

    // case "SET_FIELD":
    //   return {
    //     ...state,

    //     formData: { ...state.formData, [action.field]: action.value },
    //   };

    case "SET_FIELD": {
      if (action.field.includes(".")) {
        const [parent, child] = action.field.split(".");

        return {
          ...state,
          formData: {
            ...state.formData,
            [parent]: {
              ...state.formData[parent],
              [child]: action.value,
            },
          },
        };
      }

      return {
        ...state,
        formData: {
          ...state.formData,
          [action.field]: action.value,
        },
      };
    }

    case "SET_NOMENCLATURE_VALUE":
      return {
        ...state,

        formData: {
          ...state.formData,

          nomenclature: state.formData.nomenclature.map((item) =>
            item.key === action.key ? { ...item, value: action.value } : item,
          ),
        },
      };

    case "SET_NOMENCLATURE_UPLOADING":
      return {
        ...state,

        formData: {
          ...state.formData,

          nomenclature: state.formData.nomenclature.map((item) =>
            item.key === action.key
              ? { ...item, _uploading: action.value }
              : item,
          ),
        },
      };

    case "ADD_ATTACHMENT":
      return {
        ...state,

        formData: {
          ...state.formData,

          nomenclature: state.formData.nomenclature.map((item) =>
            item.key === action.key
              ? {
                  ...item,
                  attachments: [...item.attachments, action.attachment],
                }
              : item,
          ),
        },
      };

    case "REMOVE_ATTACHMENT":
      return {
        ...state,

        formData: {
          ...state.formData,

          nomenclature: state.formData.nomenclature.map((item) =>
            item.key === action.key
              ? {
                  ...item,
                  attachments: item.attachments.filter(
                    (_, i) => i !== action.index,
                  ),
                }
              : item,
          ),
        },
      };

    case "RESET":
      return {
        ...initialState,

        formData: { ...initialState.formData },
      };

    case "CLEAR_MESSAGES":
      return { ...state, success: false, error: null };

    default:
      return state;
  }
}

// ─── Image Upload Helper ───────────────────────────────────────────────────────

async function uploadToCloudinary(file) {
  const formData = new FormData();

  formData.append("file", file);

  const res = await axios.post(
    "/api/v1/image-upload/nomenclature",

    formData,

    {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    },
  );

  return res?.data?.url || "";
}

// ─── Attachment Item ───────────────────────────────────────────────────────────

const AttachmentItem = ({ attachment, index, fieldKey, onRemove }) => (
  <div className="nc-attachment-item">
    <CIcon icon={cilImage} size="sm" className="nc-attach-icon" />
    <img
      src={attachment.img}
      alt={attachment.name}
      className="nc-attach-thumb"
    />
    <span className="nc-attach-name">{attachment.name}</span>
    <CButton
      size="sm"
      color="danger"
      variant="ghost"
      className="nc-attach-remove"
      onClick={() => onRemove(fieldKey, index)}
      title="Remove attachment"
    >
      <CIcon icon={cilX} size="sm" />
    </CButton>
  </div>
);

// ─── Nomenclature Field Row ────────────────────────────────────────────────────

const NomenclatureField = ({ field, dispatch }) => {
  const fileInputRef = useRef(null);

  const handleValueChange = (e) =>
    dispatch({
      type: "SET_NOMENCLATURE_VALUE",
      key: field.key,
      value: e.target.value,
    });

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    dispatch({
      type: "SET_NOMENCLATURE_UPLOADING",
      key: field.key,
      value: true,
    });

    try {
      const url = await uploadToCloudinary(file);

      if (url) {
        dispatch({
          type: "ADD_ATTACHMENT",
          key: field.key,
          attachment: { name: file.name, img: url },
        });
      }
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      dispatch({
        type: "SET_NOMENCLATURE_UPLOADING",
        key: field.key,
        value: false,
      });

      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveAttachment = (key, index) =>
    dispatch({ type: "REMOVE_ATTACHMENT", key, index });

  // Determine field type: if value exists as a number field vs text/dropdown

  // const isNumeric = field.value === "" || !isNaN(Number(field.value));

  return (
    <div className="nc-field-card">
      <div className="nc-field-header">
        <CBadge color="primary" className="nc-field-key-badge">
          {field.key.split("_").pop().toUpperCase()}
        </CBadge>
        <span className="nc-field-name">{field.name}</span>
      </div>

      {field.description && (
        <div className="nc-field-desc">{field.description}</div>
      )}

      <CRow className="g-2 align-items-center mt-1">
        <CCol md={4}>
          <CInputGroup size="sm">
            <CInputGroupText>Value</CInputGroupText>
            <CFormInput
              placeholder="Enter value"
              value={field.value}
              onChange={handleValueChange}
              type={"text"}
            />
          </CInputGroup>
        </CCol>

        <CCol md={8}>
          <div className="nc-upload-row">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileChange}
              id={`file-${field.key}`}
            />
            <CButton
              size="sm"
              color="secondary"
              variant="outline"
              className="nc-upload-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={field._uploading}
            >
              {field._uploading ? (
                <>
                  <CSpinner size="sm" className="me-1" /> Uploading…
                </>
              ) : (
                <>
                  <CIcon icon={cilCloudUpload} size="sm" className="me-1" /> Add
                  Image
                </>
              )}
            </CButton>

            {field.attachments.length > 0 && (
              <span className="nc-attach-count">
                {field.attachments.length} image(s)
              </span>
            )}
          </div>
        </CCol>
      </CRow>

      {field.attachments.length > 0 && (
        <div className="nc-attachments-list mt-2">
          {field.attachments.map((att, idx) => (
            <AttachmentItem
              key={idx}
              attachment={att}
              index={idx}
              fieldKey={field.key}
              onRemove={handleRemoveAttachment}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────

const CreateNomenclature = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const {
    loading,
    templateLoading,
    templateError,
    success,
    error,
    mmsTypeName,
    referenceFiles,
    formData,
  } = state;

  // Auto-clear alerts
  const userInfo = useSelector((state) => state.userInfo);
  const navigate = useNavigate();
  useEffect(() => {
    if (success || error) {
      const t = setTimeout(() => dispatch({ type: "CLEAR_MESSAGES" }), 5000);

      return () => clearTimeout(t);
    }
  }, [success, error]);

  // Fetch template whenever mms_type changes

  useEffect(() => {
    if (!formData.mms_type) {
      dispatch({
        type: "TEMPLATE_SUCCESS",
        mms_type_name: "",
        reference_files: [],
        fields: [],
      });

      return;
    }

    const controller = new AbortController();

    const fetchTemplate = async () => {
      dispatch({ type: "TEMPLATE_REQUEST" });

      try {
        const res = await axios.get(
          `/api/v1/nomenclatures/template/${formData.mms_type}`,

          { withCredentials: true, signal: controller.signal },
        );

        const { mms_type_name, reference_files, nomenclature } = res.data.data;

        dispatch({
          type: "TEMPLATE_SUCCESS",

          mms_type_name,

          reference_files,

          fields: nomenclature,
        });
      } catch (err) {
        if (axios.isCancel(err)) return;

        const msg =
          err?.response?.data?.message || "Failed to load MMS template.";

        dispatch({ type: "TEMPLATE_FAIL", payload: msg });
      }
    };

    fetchTemplate();

    return () => controller.abort();
  }, [formData.mms_type]);
  let adminroute = "";

  if (userInfo?.role === "Master Admin") {
    adminroute = "master-admin";
  } else if (userInfo?.role === "Master User") {
    adminroute = "master-user";
  } else if (userInfo?.role === "Service Admin") {
    adminroute = "service-admin";
  } else if (userInfo?.role === "Project Admin") {
    adminroute = "project-admin";
  } else if (userInfo?.role === "Design Admin") {
    adminroute = "design-admin";
  } else if (userInfo?.role === "Site Incharge") {
    adminroute = "site-incharge";
  } else if (userInfo?.role === "Site Technician") {
    adminroute = "site-technician";
  } else if (userInfo?.role === "Client Site Technician") {
    adminroute = "client-site-technician";
  } else if (userInfo?.role === "Project User") {
    adminroute = "project-user";
  } else if (userInfo?.role === "Service User") {
    adminroute = "service-user";
  }

  const handleFieldChange = (field) => (e) =>
    dispatch({ type: "SET_FIELD", field, value: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch({ type: "CREATE_REQUEST" });

    try {
      const payload = {
        client: formData.client,

        site: formData.site,

        mms_type: formData.mms_type,

        remark: formData.remark,

        nomenclature: formData.nomenclature.map(
          ({ key, name, description, value, attachments }) => ({
            key,

            name,

            description,

            value:
              value === "" ? 0 : isNaN(Number(value)) ? value : Number(value),

            attachments,
          }),
        ),
      };

      const response = await axios.post("/api/v1/nomenclatures", payload, {
        withCredentials: true,
      });
      console.log(response);
      if (response.status === 201) {
        dispatch({ type: "CREATE_SUCCESS" });

        dispatch({ type: "RESET" });
        navigate(`/${adminroute}/view-nomenclature/${response.data.data._id}`);
        toast.success("Nomenclature created successfully!");
      }
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Something went wrong. Please try again.";

      dispatch({ type: "CREATE_FAIL", payload: message });
    }
  };

  const anyUploading = formData.nomenclature.some((f) => f._uploading);

  const hasFields = formData.nomenclature.length > 0;

  return (
    <>
      <style>{`

        .nc-field-card {

        

          border: 1px solid #e9ecef;

          border-left: 3px solid #0d6efd;

          border-radius: 6px;

          padding: 12px 14px;

          margin-bottom: 10px;

          transition: box-shadow 0.15s;

        }

        .nc-field-card:hover { box-shadow: 0 2px 8px rgba(13,110,253,0.08); }

        .nc-field-header { display: flex; align-items: center; gap: 8px; margin-bottom: 2px; }

        .nc-field-key-badge { font-size: 10px; letter-spacing: 0.5px; padding: 2px 6px; }

        .nc-field-name { font-weight: 600; font-size: 13.5px; color: #212529; }

        .nc-field-desc { font-size: 12px; color: #6c757d; margin-bottom: 4px; }

        .nc-upload-row { display: flex; align-items: center; gap: 8px; }

        .nc-upload-btn { white-space: nowrap; }

        .nc-attach-count { font-size: 12px; color: #6c757d; }

        .nc-attachments-list { display: flex; flex-direction: column; gap: 6px; }

        .nc-attachment-item {

          display: flex; align-items: center; gap: 8px;

          background: #fff; border: 1px solid #dee2e6;

          border-radius: 4px; padding: 5px 10px;

        }

        .nc-attach-icon { color: #6c757d; flex-shrink: 0; }

        .nc-attach-thumb {

          width: 32px; height: 32px; object-fit: cover;

          border-radius: 3px; border: 1px solid #dee2e6; flex-shrink: 0;

        }

        .nc-attach-name {

          flex: 1; font-size: 12px; color: #495057;

          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;

        }

        .nc-attach-remove { flex-shrink: 0; padding: 2px 6px; }

        .nc-section-title {

          font-size: 13px; font-weight: 600; color: #495057;

          text-transform: uppercase; letter-spacing: 0.6px;

          border-bottom: 1px solid #dee2e6;

          padding-bottom: 8px; margin-bottom: 12px;

        }

        .nc-ref-files { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }

        .nc-ref-file-link {

          display: inline-flex; align-items: center; gap: 4px;

          font-size: 12px; color: #0d6efd; text-decoration: none;

          border: 1px solid #0d6efd; border-radius: 4px;

          padding: 3px 10px; transition: background 0.15s;

        }

        .nc-ref-file-link:hover { background: #e7f0ff; }

        .nc-template-loading {

          display: flex; align-items: center; gap: 8px;

          color: #6c757d; font-size: 13px; padding: 20px 0;

        }

        .nc-empty-state {

          text-align: center; padding: 32px 0;

          color: #adb5bd; font-size: 14px;

        }

      `}</style>

      <CCard>
        <CCardHeader className="d-flex align-items-center justify-content-between">
          <strong>Create Nomenclature</strong>

          {mmsTypeName && <CBadge color="info">{mmsTypeName}</CBadge>}
        </CCardHeader>

        <CCardBody>
          {success && (
            <CAlert
              color="success"
              dismissible
              onClose={() => dispatch({ type: "CLEAR_MESSAGES" })}
            >
              Nomenclature created successfully!
            </CAlert>
          )}

          {error && (
            <CAlert
              color="danger"
              dismissible
              onClose={() => dispatch({ type: "CLEAR_MESSAGES" })}
            >
              {error}
            </CAlert>
          )}

          {templateError && <CAlert color="warning">{templateError}</CAlert>}

          <CForm onSubmit={handleSubmit}>
            {/* ── Basic Info ── */}
            <div className="nc-section-title">Basic Information</div>
            <CRow className="mb-3 g-3">
              <CCol md={4}>
                <CFormLabel htmlFor="client" className="fw-semibold">
                  Client <span className="text-danger">*</span>
                </CFormLabel>
                <CFormInput
                  id="client"
                  placeholder="Client ID or Name"
                  value={formData.client.client_name}
                  onChange={handleFieldChange("client.client_name")}
                  required
                />
              </CCol>

              <CCol md={4}>
                <CFormLabel htmlFor="site" className="fw-semibold">
                  Site Name <span className="text-danger">*</span>
                </CFormLabel>
                <CFormInput
                  id="site"
                  placeholder="Site ID or Name"
                  value={formData.site.site_name}
                  onChange={handleFieldChange("site.site_name")}
                  required
                />
              </CCol>

              <CCol md={4}>
                <CFormLabel htmlFor="site" className="fw-semibold">
                  Site Location <span className="text-danger">*</span>
                </CFormLabel>
                <CFormInput
                  id="site"
                  placeholder="Site location "
                  value={formData.site.location}
                  onChange={handleFieldChange("site.location")}
                  required
                />
              </CCol>

              <CCol md={4}>
                <CFormLabel htmlFor="mms_type" className="fw-semibold">
                  MMS Type <span className="text-danger">*</span>
                </CFormLabel>
                <CFormSelect
                  id="mms_type"
                  value={formData.mms_type}
                  onChange={handleFieldChange("mms_type")}
                  required
                >
                  {MMS_TYPES.map((opt) => (
                    <option
                      key={opt.value}
                      value={opt.value}
                      disabled={opt.value === ""}
                    >
                      {opt.label}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>

            <CRow className="mb-4">
              <CCol md={12}>
                <CFormLabel htmlFor="remark" className="fw-semibold">
                  Remark{" "}
                  <span className="text-warning ms-2">
                    [ Capacity in DC (Direct Current), No of Modules in One
                    Table (Both half and full table) , Module Make and Module
                    Capacity ]
                  </span>
                </CFormLabel>
                <CFormTextarea
                  id="remark"
                  placeholder="Add Remarks"
                  rows={2}
                  value={formData.remark}
                  onChange={handleFieldChange("remark")}
                />
              </CCol>
            </CRow>

            {/* ── Nomenclature Fields ── */}
            <div className="nc-section-title">Nomenclature Fields</div>

            {/* Reference files */}

            {referenceFiles.length > 0 && (
              <div className="nc-ref-files mb-3">
                {referenceFiles.map((rf, i) => (
                  <a
                    key={i}
                    href={rf.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nc-ref-file-link"
                  >
                    📎 {rf.name}
                  </a>
                ))}
              </div>
            )}

            {/* Template loading state */}

            {templateLoading && (
              <div className="nc-template-loading">
                <CSpinner size="sm" /> Loading fields for selected MMS type…
              </div>
            )}

            {/* Empty state — no type selected */}

            {!templateLoading && !formData.mms_type && (
              <div className="nc-empty-state">
                Select an MMS Type above to load the nomenclature fields.
              </div>
            )}

            {/* Fields */}

            {!templateLoading &&
              hasFields &&
              formData.nomenclature.map((field) => (
                <NomenclatureField
                  key={field.key}
                  field={field}
                  dispatch={dispatch}
                />
              ))}

            {/* ── Actions ── */}
            <div className="d-flex gap-2 mt-4">
              <CButton
                type="submit"
                color="primary"
                size="sm"
                disabled={
                  loading || anyUploading || !hasFields || templateLoading
                }
              >
                {loading ? (
                  <>
                    <CSpinner size="sm" className="me-2" /> Creating…
                  </>
                ) : (
                  <>Create Nomenclature</>
                )}
              </CButton>

              <CButton
                type="button"
                color="secondary"
                variant="outline"
                disabled={loading}
                size="sm"
                onClick={() => dispatch({ type: "RESET" })}
              >
                Reset
              </CButton>
            </div>
          </CForm>
        </CCardBody>
      </CCard>
    </>
  );
};

export default CreateNomenclature;
