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
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CTable,
  CTabs,
  CTabList,
  CTab,
  CTabContent,
  CTabPanel,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CFormCheck,
  CTableBody,
  CTableDataCell,
  CModalFooter,
} from "@coreui/react";
import LoadingSpinner from "../../components/LoadingSpinner";
import CIcon from "@coreui/icons-react";
import { cilX } from "@coreui/icons";

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

    case "FETCH_NOTASSIGNED_REQUEST":
      return { ...state, fetchMMSloading: true, notAssignedMMSerror: "" };
    case "FETCH_NOTASSIGNED_SUCCESS":
      return {
        ...state,
        fetchMMSloading: false,
        notAssignedMMSerror: "",
        notAssignedMMS: action.payload,
      };
    case "FETCH_NOTASSIGNED_FAIL":
      return {
        ...state,
        fetchMMSloading: false,
        notAssignedMMSerror: action.payload,
      };
    case "ASSIGN_NOMENCLATURE_REQUEST":
      return { ...state, updateloading: true };

    case "ASSIGN_NOMENCLATURE_SUCCESS":
      return { ...state, updateloading: false };

    case "ASSIGN_NOMENCLATURE_FAIL":
      return {
        ...state,
        updateloading: false,
        error: action.payload,
      };
    case "REMOVE_NOMENCLATURE_REQUEST":
      return { ...state, removeloading: true };

    case "REMOVE_NOMENCLATURE_SUCCESS":
      return { ...state, removeloading: false };

    case "REMOVE_NOMENCLATURE_FAIL":
      return {
        ...state,
        removeloading: false,
        error: action.payload,
      };
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
  const [
    {
      fetchloading,
      updateloading,
      error,
      notAssignedMMSerror,
      fetchMMSloading,
      notAssignedMMS,
      removeloading,
    },
    dispatch,
  ] = useReducer(reducer, {
    fetchloading: true,
    updateloading: false,
    error: "",
    fetchMMSloading: true,
    notAssignedMMSerror: "",
    notAssignedMMS: [],
    removeloading: false,
  });

  const { id } = useParams();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.userInfo);
  const adminroute = getAdminRoute(userInfo?.role);
  const [showModal, setShowModal] = useState(false);
  const [selectedIDS, setSelectedIDS] = useState([]);
  const [activeTab, setActiveTab] = useState("available");
  const [imageUploading, setImageUploading] = useState({});
  const [imageRemoving, setImageRemoving] = useState({});
  const [assignedMMS, setAssignedMMS] = useState([]);
  const [removeSelected, setRemoveSelected] = useState([]);
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
      console.log(d.site_survey);
      // assigned nomenclature
      setAssignedMMS(d.site_survey || []);
      dispatch({ type: "FETCH_SUCCESS" });
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      dispatch({ type: "FETCH_FAIL", payload: msg });
      toast.error(msg);
    }
  };

  const fetchNotAssignedMMS = async () => {
    dispatch({ type: "FETCH_NOTASSIGNED_REQUEST" });
    try {
      const { data } = await axios.get(
        `/api/v1/nomenclatures/not/assigned/mms`,
        {
          withCredentials: true,
        },
      );

      dispatch({ type: "FETCH_NOTASSIGNED_SUCCESS", payload: data.data });
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      dispatch({ type: "FETCH_NOTASSIGNED_FAIL", payload: msg });
      // toast.error(msg);
    }
  };

  const removeAssignedNomenclatureHandler = async () => {
    try {
      dispatch({ type: "REMOVE_NOMENCLATURE_REQUEST" });

      await axios.put(
        `/api/v1/mms-structure/remove-site-survey/${id}`,
        {
          site_survey: removeSelected,
        },
        {
          withCredentials: true,
        },
      );

      dispatch({ type: "REMOVE_NOMENCLATURE_SUCCESS" });

      // toast.success(data.message);

      setRemoveSelected([]);

      // fetchAssignedMMS();
      fetchNotAssignedMMS();
      fetchData();
    } catch (error) {
      dispatch({
        type: "REMOVE_NOMENCLATURE_FAIL",
        payload: error.response?.data?.message,
      });

      toast.error(error.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchData();
    fetchNotAssignedMMS();
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

  //  MOdal handlers ////

  const assignNomenclatureHandler = async () => {
    try {
      dispatch({ type: "ASSIGN_NOMENCLATURE_REQUEST" });

      const res = await axios.put(
        `/api/v1/mms-structure/assign-site-survey/${id}`,
        {
          site_survey: selectedIDS,
        },
        {
          withCredentials: true,
        },
      );

      dispatch({ type: "ASSIGN_NOMENCLATURE_SUCCESS" });

      toast.success(res.data.message);

      setSelectedIDS([]);
      setShowModal(false);
      fetchData();
      fetchNotAssignedMMS();
      // fetchAssignedMMS();
      // fetchNotAssignedMMS();
    } catch (error) {
      dispatch({
        type: "ASSIGN_NOMENCLATURE_FAIL",
        payload:
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed",
      });

      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed",
      );
    }
  };

  const handleToggle = (nom) => {
    setSelectedIDS((prev) =>
      prev.includes(nom._id)
        ? prev.filter((id) => id !== nom._id)
        : [...prev, nom._id],
    );
  };

  const handleSelectAllToremove = (checked) => {
    if (checked) {
      setRemoveSelected(assignedMMS.map((nom) => nom._id));
    } else {
      setRemoveSelected([]);
    }
  };

  const handleRemoveToggle = (_id) => {
    setRemoveSelected((prev) =>
      prev.includes(_id) ? prev.filter((id) => id !== _id) : [...prev, _id],
    );
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

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIDS(notAssignedMMS.map((nom) => nom._id));
    } else {
      setSelectedIDS([]);
    }
  };
  return (
    <div style={S.page}>
      <CCard className="shadow-sm">
        <CCardHeader className="d-flex align-items-center justify-content-between">
          <h5 className="mb-0 fw-bold">Update MMS Structure</h5>
          {/* <CBadge
            color="secondary"
            shape="rounded-pill"
            style={{ fontSize: 11 }}
          >
            {id}
          </CBadge>{" "} */}
          <CButton
            size="sm"
            className="ms-2"
            onClick={() => setShowModal(true)}
          >
            Assign Nomenclature
          </CButton>
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
      <CModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        // looking too small
        size="xl"
        backdrop="static"
      >
        <CModalHeader
          closeButton={false}
          className="d-flex justify-content-between align-items-center"
        >
          <CModalTitle>Assign Nomenclature</CModalTitle>

          <button
            type="button"
            className="border-0 ms-auto py-0 px-1"
            onClick={() => setShowModal(false)}
            style={{ background: "none" }}
          >
            <CIcon icon={cilX} size="lg" />
          </button>
        </CModalHeader>

        <CModalBody>
          <CTabs activeItemKey={activeTab} onActiveItemChange={setActiveTab}>
            <CTabList variant="tabs">
              <CTab itemKey="available">Available Nomenclature</CTab>
              <CTab itemKey="added">Assigned Nomenclature</CTab>
            </CTabList>

            <CTabContent>
              {/* ───────────────── AVAILABLE ───────────────── */}
              <CTabPanel itemKey="available" className="p-3">
                <CTable
                  bordered
                  hover
                  responsive
                  className="text-center align-middle"
                >
                  <CTableHead color="secondary">
                    <CTableRow>
                      <CTableHeaderCell>
                        <CFormCheck
                          checked={
                            notAssignedMMS.length > 0 &&
                            selectedIDS.length === notAssignedMMS.length
                          }
                          onChange={(e) => handleSelectAll(e.target.checked)}
                        />
                      </CTableHeaderCell>

                      <CTableHeaderCell>Nomenclature ID</CTableHeaderCell>

                      <CTableHeaderCell>Client</CTableHeaderCell>

                      <CTableHeaderCell>Location</CTableHeaderCell>

                      <CTableHeaderCell>Created By</CTableHeaderCell>

                      <CTableHeaderCell>Status</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>

                  <CTableBody>
                    {fetchMMSloading ? (
                      <CTableRow>
                        <CTableDataCell colSpan={6}>
                          <LoadingSpinner />
                        </CTableDataCell>
                      </CTableRow>
                    ) : notAssignedMMSerror ? (
                      <CTableRow>
                        <CTableDataCell colSpan={6} className="text-danger">
                          {notAssignedMMSerror}
                        </CTableDataCell>
                      </CTableRow>
                    ) : notAssignedMMS.length > 0 ? (
                      notAssignedMMS.map((nom) => (
                        <CTableRow key={nom._id}>
                          <CTableDataCell>
                            <CFormCheck
                              checked={selectedIDS.includes(nom._id)}
                              onChange={() => handleToggle(nom)}
                            />
                          </CTableDataCell>

                          <CTableDataCell>
                            <span
                              style={{
                                color: "#0d6efd",
                                cursor: "pointer",
                                fontWeight: 500,
                              }}
                              onClick={(e) => {
                                navigate(
                                  `/${adminroute}/view-nomenclature/${nom._id}`,
                                );
                              }}
                            >
                              {nom?.nomenclature_id || "-"}
                            </span>
                          </CTableDataCell>

                          <CTableDataCell>
                            {nom?.client?.client_name || "-"}
                          </CTableDataCell>

                          <CTableDataCell>
                            {nom?.site?.location || "-"}
                          </CTableDataCell>

                          <CTableDataCell>
                            {nom?.last_activity?.slice(-1)?.[0]?.name}
                          </CTableDataCell>

                          <CTableDataCell>
                            <CBadge color="warning">
                              {nom?.status || "-"}
                            </CBadge>
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    ) : (
                      <CTableRow>
                        <CTableDataCell colSpan={6}>
                          No Nomenclature Available
                        </CTableDataCell>
                      </CTableRow>
                    )}
                  </CTableBody>
                </CTable>
                {/* add loading and error states here as well */}

                <div className="d-flex justify-content-end mt-3">
                  {/* <CButton
                    updateloading={updateloading}
                    color="warning"
                    disabled={!selectedIDS.length}
                    onClick={assignNomenclatureHandler}
                  >
                    Assign Selected
                  </CButton> */}
                  <CButton
                    color="warning"
                    disabled={!selectedIDS.length || updateloading}
                    onClick={assignNomenclatureHandler}
                  >
                    {updateloading ? (
                      <>
                        <CSpinner size="sm" className="me-2" />
                        Assigning...
                      </>
                    ) : (
                      "Assign Selected"
                    )}
                  </CButton>
                </div>
              </CTabPanel>

              {/* ───────────────── ASSIGNED ───────────────── */}
              <CTabPanel itemKey="added" className="p-3">
                <CTable
                  bordered
                  hover
                  responsive
                  className="text-center align-middle"
                >
                  <CTableHead color="secondary">
                    <CTableRow>
                      <CTableHeaderCell>
                        <CFormCheck
                          checked={
                            assignedMMS.length > 0 &&
                            removeSelected.length === assignedMMS.length
                          }
                          onChange={(e) =>
                            handleSelectAllToremove(e.target.checked)
                          }
                        />
                      </CTableHeaderCell>

                      <CTableHeaderCell>Nomenclature ID</CTableHeaderCell>

                      <CTableHeaderCell>Client</CTableHeaderCell>

                      <CTableHeaderCell>Location</CTableHeaderCell>

                      <CTableHeaderCell>Created By</CTableHeaderCell>

                      <CTableHeaderCell>Status</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>

                  <CTableBody>
                    {assignedMMS?.length > 0 ? (
                      assignedMMS.map((nom) => (
                        <CTableRow key={nom._id}>
                          <CTableDataCell>
                            <CFormCheck
                              checked={removeSelected.includes(nom._id)}
                              onChange={() => handleRemoveToggle(nom._id)}
                            />
                          </CTableDataCell>

                          <CTableDataCell>
                            <span
                              style={{
                                color: "#0d6efd",
                                cursor: "pointer",

                                fontWeight: 500,
                              }}
                              onClick={() =>
                                navigate(
                                  `/${adminroute}/view-nomenclature/${nom._id}`,
                                )
                              }
                            >
                              {nom?.nomenclature_id || "-"}
                            </span>
                          </CTableDataCell>

                          <CTableDataCell>
                            {nom?.client_name || "-"}
                          </CTableDataCell>

                          <CTableDataCell>
                            {nom?.site_location || "-"}
                          </CTableDataCell>

                          <CTableDataCell>
                            {nom?.created_by || "-"}
                          </CTableDataCell>

                          <CTableDataCell>
                            <CBadge color="success">
                              {nom?.status || "-"}
                            </CBadge>
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    ) : (
                      <CTableRow>
                        <CTableDataCell colSpan={6}>
                          No Assigned Nomenclature
                        </CTableDataCell>
                      </CTableRow>
                    )}
                  </CTableBody>
                </CTable>

                <div className="d-flex justify-content-end mt-3">
                  <CButton
                    color="danger"
                    disabled={!removeSelected.length || removeloading}
                    onClick={removeAssignedNomenclatureHandler}
                  >
                    Remove Selected
                  </CButton>
                </div>
              </CTabPanel>
            </CTabContent>
          </CTabs>
        </CModalBody>
      </CModal>
    </div>
  );
};

export default UpdateMms;
