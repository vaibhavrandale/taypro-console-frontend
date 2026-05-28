import { useReducer, useRef, useEffect, useState } from "react";
import { CButton, CSpinner } from "@coreui/react";
import axios from "axios";
import CIcon from "@coreui/icons-react";
import { cilCloudUpload } from "@coreui/icons";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

// ─── Constants ────────────────────────────────────────────────────────────────

const MMS_TYPES = [
  { value: "1P-1L", label: "1P-1L MMS" },
  { value: "2P", label: "2P MMS" },
  { value: "3P-3L", label: "3P-3L MMS" },
  { value: "4P-4L", label: "4P-4L MMS" },
  { value: "tracker", label: "Tracker MMS" },
];

const PART_COLORS = {
  column: "#1d4ed8",
  rafter: "#7c3aed",
  perlin: "#059669",
  braces: "#d97706",
};

const PART_LABELS = {
  column: "Column",
  rafter: "Rafter",
  perlin: "Perlin",
  braces: "Braces (A & B)",
};

const PART_HINTS = {
  column: "The main vertical post going into the ground",
  rafter: "The long angled beam that holds the solar panels",
  perlin: "Short cross-members sitting on top of the rafter",
  braces: "Support members — diagonal (A) and horizontal (B)",
};

const labelMap = {
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
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const createDimensionField = () => ({
  value: "",
  attatchments: [],
  _uploading: false,
});

const initialState = {
  loading: false,
  success: false,
  error: null,
  formData: {
    client: { client_name: "", email: "" },
    site: { site_name: "", location: "" },
    mms_type: "",
    status: "completed-1",
    tilt_angle: createDimensionField(),
    remark: "",
    perlin: {
      type: "",
      description: "",
      perlin_dimension: {
        height: createDimensionField(),
        width: createDimensionField(),
        thickness: createDimensionField(),
        c_bar_height: createDimensionField(),
        flenge_length: createDimensionField(),
      },
    },
    rafter: {
      total_length: createDimensionField(),
      height: createDimensionField(),
      width: createDimensionField(),
      thickness: createDimensionField(),
      c_bar_height: createDimensionField(),
      perlin_dimension: {
        perlin_count: createDimensionField(),
        module_to_perlin_gap: createDimensionField(),
        perlin_to_perlin_gap: createDimensionField(),
        center_perlin_to_perlin_gap: createDimensionField(),
      },
    },
    braces: {
      a: {
        length: createDimensionField(),
        height: createDimensionField(),
        width: createDimensionField(),
        thickness: createDimensionField(),
        c_bar_height: createDimensionField(),
      },
      b: {
        length: createDimensionField(),
        height: createDimensionField(),
        width: createDimensionField(),
        thickness: createDimensionField(),
        c_bar_height: createDimensionField(),
      },
    },
    column: {
      total_length: createDimensionField(),
      piling_depth_length: createDimensionField(),
      upper_ground_length: createDimensionField(),
      pilling_diameter: createDimensionField(),
      length: createDimensionField(),
      height: createDimensionField(),
      width: createDimensionField(),
      thickness: createDimensionField(),
      c_bar_height: createDimensionField(),
    },
    site_survey: [],
  },
};

function setNestedValue(obj, path, value) {
  const keys = path.split(".");
  const updated = JSON.parse(JSON.stringify(obj));
  let current = updated;
  for (let i = 0; i < keys.length - 1; i++) {
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = value;
  return updated;
}
function reducer(state, action) {
  switch (action.type) {
    case "CREATE_REQUEST":
      return {
        ...state,
        loading: true,
        error: null,
        success: false,
      };

    case "CREATE_SUCCESS":
      return {
        ...state,
        loading: false,
        success: true,
      };

    case "CREATE_FAIL":
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload,
      };

    case "SET_FIELD":
      return {
        ...state,
        formData: setNestedValue(state.formData, action.path, action.value),
      };

    case "SET_UPLOAD_STATE":
      return {
        ...state,
        formData: setNestedValue(
          state.formData,
          `${action.path}._uploading`,
          action.value,
        ),
      };

    case "ADD_ATTACHMENT": {
      const updated = JSON.parse(JSON.stringify(state.formData));

      let current = updated;

      action.path.split(".").forEach((k) => {
        current = current[k];
      });

      current.attatchments = current.attatchments || [];

      current.attatchments.push(action.attachment);

      return {
        ...state,
        formData: updated,
      };
    }

    case "REMOVE_ATTACHMENT": {
      const updated = JSON.parse(JSON.stringify(state.formData));

      let current = updated;

      action.path.split(".").forEach((k) => {
        current = current[k];
      });

      if (Array.isArray(current.attatchments)) {
        current.attatchments.splice(action.index, 1);
      }

      return {
        ...state,
        formData: updated,
      };
    }

    case "RESET":
      return initialState;

    case "CLEAR_MESSAGES":
      return {
        ...state,
        success: false,
        error: null,
      };

    default:
      return state;
  }
}
// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = {
  root: {
    // background: "#f8f7f4",
    minHeight: "100vh",
    color: "#1a1a1a",
  },
  // container: {
  //   maxWidth: 1100,
  //   margin: "0 auto",
  //   padding: "32px 20px",
  // },
  header: {
    marginBottom: 36,
    borderBottom: "2px solid #1a1a1a",
    paddingBottom: 20,
  },
  headerTop: {
    display: "flex",
    alignItems: "center",
    gap: 14,
  },
  headerIcon: {
    width: 44,
    height: 44,
    background: "#1a1a1a",
    color: "#f8f7f4",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
  },
  h1: {
    fontSize: 22,
    fontWeight: 700,
    letterSpacing: "-0.5px",
    margin: 0,
  },
  subtitle: {
    fontSize: 12,
    color: "#666",
    marginTop: 3,
    letterSpacing: "0.5px",
    textTransform: "uppercase",
  },
  alert: (type) => ({
    padding: "12px 16px",
    border: `1.5px solid ${type === "success" ? "#059669" : "#dc2626"}`,
    background: type === "success" ? "#ecfdf5" : "#fef2f2",
    color: type === "success" ? "#059669" : "#dc2626",
    marginBottom: 24,
    fontSize: 13,
    fontWeight: 600,
  }),
  topGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 24,
    marginBottom: 32,
  },
  topGridFull: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 24,
    marginBottom: 32,
  },
  card: {
    // background: "#fff",
    border: "1px solid #e0e0e0",
    overflow: "hidden",
  },
  cardHeader: {
    // background: "#1a1a1a",
    color: "#f8f7f4",
    padding: "10px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "1px",
    textTransform: "uppercase",
  },
  cardBody: {
    padding: 20,
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
  },
  formGroupFull: { gridColumn: "span 2" },
  label: {
    display: "block",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "1px",
    textTransform: "uppercase",
    color: "#ffffff",
    marginBottom: 6,
  },
  input: {
    width: "100%",
    padding: "8px 12px",
    border: "1.5px solid #d0d0d0",
    // background: "#fafafa",
    fontFamily: "inherit",
    fontSize: 13,
    // color: "#1a1a1a",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.15s",
  },
  textarea: {
    width: "100%",
    padding: "8px 12px",
    border: "1.5px solid #d0d0d0",
    // background: "#fafafa",
    fontFamily: "inherit",
    fontSize: 13,
    // color: "#1a1a1a",
    outline: "none",
    boxSizing: "border-box",
    resize: "vertical",
    minHeight: 80,
  },
  select: {
    width: "100%",
    padding: "8px 12px",
    border: "1.5px solid #d0d0d0",
    // background: "#fafafa",
    fontFamily: "inherit",
    fontSize: 13,
    // color: "#1a1a1a",
    outline: "none",
    appearance: "none",
    cursor: "pointer",
  },
  sectionGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 20,
    marginBottom: 32,
  },
  col: { display: "flex", flexDirection: "column", gap: 16 },
  sectionBlock: (isActive, color) => ({
    border: `2px solid ${isActive ? color : "#e0e0e0"}`,
    background: isActive ? `${color}08` : "#fff",
    transition: "all 0.2s",
    overflow: "hidden",
  }),
  sectionTrigger: (color) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 16px",
    cursor: "pointer",
    width: "100%",
    background: "none",
    border: "none",
    fontFamily: "inherit",
    textAlign: "left",
  }),
  sectionDot: (color) => ({
    width: 10,
    height: 10,
    borderRadius: "50%",
    background: color,
    flexShrink: 0,
  }),
  sectionLabel: (isActive, color) => ({
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: "0.5px",
    color: isActive ? color : "#1a1a1a",
  }),
  sectionHint: {
    fontSize: 11,
    color: "#888",
    marginTop: 2,
  },
  chevron: {
    fontSize: 14,
    fontWeight: 700,
  },
  sectionContent: {
    borderTop: "1.5px solid #f0f0f0",
    padding: 16,
  },
  dimGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  },
  dimField: (color) => ({
    borderLeft: `3px solid ${color}`,
    // background: "#fafafa",
    padding: "10px 12px",
    border: "1px solid #e8e8e8",
    borderLeftColor: color,
    borderLeftWidth: 3,
  }),
  dimBadge: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.8px",
    textTransform: "uppercase",
    color: "#888",
    marginBottom: 8,
    display: "block",
  },
  dimInputRow: {
    display: "flex",
    gap: 8,
    alignItems: "center",
  },
  dimInputWrap: {
    flex: 1,
    position: "relative",
  },
  dimInput: {
    width: "100%",
    padding: "7px 36px 7px 10px",
    border: "1.5px solid #d0d0d0",
    // background: "#fff",
    fontFamily: "inherit",
    fontSize: 13,
    outline: "none",
    boxSizing: "border-box",
  },
  mmSuffix: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: 10,
    color: "#aaa",
    fontWeight: 700,
    letterSpacing: "0.5px",
  },
  uploadBtn: (uploading) => ({
    padding: "7px 10px",
    border: "1.5px solid #d0d0d0",
    background: uploading ? "#f0f0f0" : "#fff",
    cursor: uploading ? "not-allowed" : "pointer",
    fontFamily: "inherit",
    fontSize: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    color: "#555",
  }),
  attachments: {
    marginTop: 8,
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  attachItem: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "6px 8px",
    border: "1px solid #e8e8e8",
    // background: "#fff",
    fontSize: 11,
  },
  attachThumb: {
    width: 28,
    height: 28,
    objectFit: "cover",
    flexShrink: 0,
  },
  attachName: {
    flex: 1,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    color: "#fff",
  },
  removeBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#dc2626",
    fontSize: 14,
    lineHeight: 1,
    padding: 2,
    fontFamily: "inherit",
  },
  legend: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 12,
    justifyContent: "center",
  },
  legendBtn: (isActive, color) => ({
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "5px 12px",
    border: `1.5px solid ${isActive ? color : "#d0d0d0"}`,
    background: isActive ? `${color}15` : "transparent",
    color: color,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.5px",
    cursor: "pointer",
    fontFamily: "inherit",
    textTransform: "uppercase",
  }),
  legendDot: (color) => ({
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: color,
  }),
  subLabel: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "1px",
    textTransform: "uppercase",
    padding: "4px 8px",
    marginBottom: 10,
    display: "inline-block",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 700,
    letterSpacing: "-0.3px",
    marginBottom: 6,
    marginTop: 0,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: "#777",
    marginBottom: 20,
  },
  submitRow: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    borderTop: "2px solid #1a1a1a",
    paddingTop: 24,
    marginTop: 8,
  },
  submitBtn: (loading) => ({
    padding: "11px 24px",
    background: loading ? "#555" : "#1a1a1a",
    color: "#f8f7f4",
    border: "none",
    fontFamily: "inherit",
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: "1px",
    textTransform: "uppercase",
    cursor: loading ? "not-allowed" : "pointer",
    display: "flex",
    alignItems: "center",
    gap: 8,
  }),
  resetBtn: {
    padding: "11px 20px",
    background: "transparent",
    color: "#1a1a1a",
    border: "1.5px solid #1a1a1a",
    fontFamily: "inherit",
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: "1px",
    textTransform: "uppercase",
    cursor: "pointer",
  },
  ghostBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: 11,
    color: "#888",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    fontWeight: 700,
  },
  showDiagramBtn: {
    padding: "8px 14px",
    background: "transparent",
    border: "1.5px solid #888",
    color: "#555",
    fontFamily: "inherit",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
};

// ─── MMS Diagram ──────────────────────────────────────────────────────────────

function MmsDiagram({ activePart, onPartClick }) {
  const [hovered, setHovered] = useState(null);
  const effective = hovered || activePart;

  const fade = (part) => ({
    opacity: !effective || effective === part ? 1 : 0.12,
    transition: "opacity 0.2s",
    cursor: "pointer",
  });

  return (
    <svg
      viewBox="0 0 680 620"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "auto" }}
    >
      <defs>
        <marker
          id="mms-arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto-start-reverse"
        >
          <path
            d="M2 1L8 5L2 9"
            fill="none"
            stroke="context-stroke"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </marker>
      </defs>

      {/* Ground Line */}
      <line
        x1="60"
        y1="460"
        x2="620"
        y2="460"
        stroke="#adb5bd"
        strokeWidth="1.2"
      />
      <text
        x="62"
        y="454"
        fontSize="9"
        fill="#6c757d"
        fontFamily="monospace"
        fontWeight="700"
      >
        GL
      </text>
      <text x="510" y="454" fontSize="9" fill="#6c757d" fontFamily="monospace">
        Ground Level
      </text>

      {/* Column */}
      <g
        style={fade("column")}
        onClick={() => onPartClick("column")}
        onMouseEnter={() => setHovered("column")}
        onMouseLeave={() => setHovered(null)}
      >
        <rect
          x="270"
          y="200"
          width="38"
          height="260"
          rx="2"
          fill="none"
          stroke={PART_COLORS.column}
          strokeWidth="2"
        />
        <rect
          x="276"
          y="200"
          width="8"
          height="260"
          rx="1"
          fill="none"
          stroke={PART_COLORS.column}
          strokeWidth="0.8"
          opacity="0.45"
        />
        <circle
          cx="289"
          cy="222"
          r="3"
          fill="none"
          stroke={PART_COLORS.column}
          strokeWidth="1"
        />
        <circle
          cx="289"
          cy="236"
          r="3"
          fill="none"
          stroke={PART_COLORS.column}
          strokeWidth="1"
        />
        <circle
          cx="289"
          cy="440"
          r="3"
          fill="none"
          stroke={PART_COLORS.column}
          strokeWidth="1"
        />
        <circle
          cx="289"
          cy="454"
          r="3"
          fill="none"
          stroke={PART_COLORS.column}
          strokeWidth="1"
        />
        <rect
          x="256"
          y="456"
          width="66"
          height="10"
          rx="1"
          fill="none"
          stroke={PART_COLORS.column}
          strokeWidth="1.5"
        />
        <rect
          x="252"
          y="464"
          width="76"
          height="16"
          rx="3"
          fill="white"
          stroke={PART_COLORS.column}
          strokeWidth="0.8"
        />
        <text
          x="290"
          y="475"
          fontSize="9"
          fill={PART_COLORS.column}
          fontFamily="monospace"
          textAnchor="middle"
        >
          GL: 250 mm
        </text>
        <rect
          x="274"
          y="466"
          width="30"
          height="110"
          rx="3"
          fill="none"
          stroke={PART_COLORS.column}
          strokeWidth="1.5"
          strokeDasharray="5,3"
        />
        <line
          x1="274"
          y1="576"
          x2="304"
          y2="576"
          stroke={PART_COLORS.column}
          strokeWidth="2.5"
        />
        <line
          x1="46"
          y1="200"
          x2="46"
          y2="460"
          stroke={PART_COLORS.column}
          strokeWidth="0.8"
          strokeDasharray="3,2"
          opacity="0.7"
        />
        <line
          x1="42"
          y1="200"
          x2="50"
          y2="200"
          stroke={PART_COLORS.column}
          strokeWidth="0.8"
        />
        <line
          x1="42"
          y1="460"
          x2="50"
          y2="460"
          stroke={PART_COLORS.column}
          strokeWidth="0.8"
        />
        <rect
          x="4"
          y="318"
          width="38"
          height="26"
          rx="4"
          fill="white"
          stroke={PART_COLORS.column}
          strokeWidth="0.8"
        />
        <text
          x="23"
          y="328"
          fontSize="8"
          fill={PART_COLORS.column}
          fontFamily="monospace"
          textAnchor="middle"
          fontWeight="700"
        >
          Total
        </text>
        <text
          x="23"
          y="339"
          fontSize="8"
          fill={PART_COLORS.column}
          fontFamily="monospace"
          textAnchor="middle"
        >
          H: mm
        </text>
        <line
          x1="46"
          y1="466"
          x2="46"
          y2="576"
          stroke={PART_COLORS.column}
          strokeWidth="0.8"
          strokeDasharray="3,2"
          opacity="0.6"
        />
        <line
          x1="42"
          y1="466"
          x2="50"
          y2="466"
          stroke={PART_COLORS.column}
          strokeWidth="0.8"
        />
        <line
          x1="42"
          y1="576"
          x2="50"
          y2="576"
          stroke={PART_COLORS.column}
          strokeWidth="0.8"
        />
        <rect
          x="4"
          y="514"
          width="40"
          height="26"
          rx="4"
          fill="white"
          stroke={PART_COLORS.column}
          strokeWidth="0.8"
        />
        <text
          x="24"
          y="524"
          fontSize="8"
          fill={PART_COLORS.column}
          fontFamily="monospace"
          textAnchor="middle"
        >
          Pile
        </text>
        <text
          x="24"
          y="535"
          fontSize="8"
          fill={PART_COLORS.column}
          fontFamily="monospace"
          textAnchor="middle"
        >
          Depth
        </text>
        <line
          x1="248"
          y1="330"
          x2="110"
          y2="330"
          stroke={PART_COLORS.column}
          strokeWidth="0.8"
          strokeDasharray="3,2"
          opacity="0.6"
        />
        <rect
          x="60"
          y="320"
          width="50"
          height="20"
          rx="4"
          fill="white"
          stroke={PART_COLORS.column}
          strokeWidth="0.8"
        />
        <text
          x="85"
          y="334"
          fontSize="8.5"
          fill={PART_COLORS.column}
          fontFamily="monospace"
          textAnchor="middle"
        >
          Above GL
        </text>
        <line
          x1="308"
          y1="280"
          x2="586"
          y2="360"
          stroke={PART_COLORS.column}
          strokeWidth="0.7"
          strokeDasharray="4,2"
          opacity="0.7"
        />
        <rect
          x="580"
          y="348"
          width="88"
          height="20"
          rx="4"
          fill="white"
          stroke={PART_COLORS.column}
          strokeWidth="0.8"
        />
        <text
          x="624"
          y="362"
          fontSize="9"
          fill={PART_COLORS.column}
          fontFamily="monospace"
          textAnchor="middle"
        >
          Col Total: mm
        </text>
        <line
          x1="289"
          y1="530"
          x2="220"
          y2="540"
          stroke={PART_COLORS.column}
          strokeWidth="0.7"
          strokeDasharray="4,2"
          opacity="0.7"
        />
        <rect
          x="134"
          y="530"
          width="86"
          height="20"
          rx="4"
          fill="white"
          stroke={PART_COLORS.column}
          strokeWidth="0.8"
        />
        <text
          x="177"
          y="544"
          fontSize="9"
          fill={PART_COLORS.column}
          fontFamily="monospace"
          textAnchor="middle"
        >
          Pile Ø: mm
        </text>
      </g>

      {/* Rafter */}
      <g
        style={fade("rafter")}
        onClick={() => onPartClick("rafter")}
        onMouseEnter={() => setHovered("rafter")}
        onMouseLeave={() => setHovered(null)}
      >
        <line
          x1="120"
          y1="318"
          x2="560"
          y2="68"
          stroke={PART_COLORS.rafter}
          strokeWidth="9"
          strokeLinecap="round"
          opacity="0.85"
        />
        <line
          x1="289"
          y1="388"
          x2="555"
          y2="388"
          stroke={PART_COLORS.rafter}
          strokeWidth="7"
          strokeLinecap="round"
          opacity="0.7"
        />
        <line
          x1="555"
          y1="68"
          x2="555"
          y2="388"
          stroke={PART_COLORS.rafter}
          strokeWidth="4"
          opacity="0.5"
        />
        <path
          d="M 555 388 A 60 60 0 0 0 510 358"
          fill="none"
          stroke={PART_COLORS.rafter}
          strokeWidth="1"
          strokeDasharray="3,2"
          opacity="0.6"
        />
        <text
          x="516"
          y="402"
          fontSize="9"
          fill={PART_COLORS.rafter}
          fontFamily="monospace"
        >
          20°
        </text>
        <line
          x1="340"
          y1="174"
          x2="586"
          y2="120"
          stroke={PART_COLORS.rafter}
          strokeWidth="0.7"
          strokeDasharray="4,2"
          opacity="0.7"
        />
        <rect
          x="580"
          y="108"
          width="88"
          height="20"
          rx="4"
          fill="white"
          stroke={PART_COLORS.rafter}
          strokeWidth="0.8"
        />
        <text
          x="624"
          y="122"
          fontSize="9"
          fill={PART_COLORS.rafter}
          fontFamily="monospace"
          textAnchor="middle"
        >
          Rafter L: mm
        </text>
        <line
          x1="460"
          y1="118"
          x2="586"
          y2="150"
          stroke={PART_COLORS.rafter}
          strokeWidth="0.7"
          strokeDasharray="4,2"
          opacity="0.7"
        />
        <rect
          x="576"
          y="140"
          width="96"
          height="20"
          rx="4"
          fill="white"
          stroke={PART_COLORS.rafter}
          strokeWidth="0.8"
        />
        <text
          x="624"
          y="154"
          fontSize="9"
          fill={PART_COLORS.rafter}
          fontFamily="monospace"
          textAnchor="middle"
        >
          H×W×T: mm
        </text>
        <line
          x1="555"
          y1="396"
          x2="580"
          y2="398"
          stroke={PART_COLORS.rafter}
          strokeWidth="0.7"
          strokeDasharray="4,2"
          opacity="0.7"
        />
        <rect
          x="576"
          y="388"
          width="96"
          height="20"
          rx="4"
          fill="white"
          stroke={PART_COLORS.rafter}
          strokeWidth="0.8"
        />
        <text
          x="624"
          y="402"
          fontSize="9"
          fill={PART_COLORS.rafter}
          fontFamily="monospace"
          textAnchor="middle"
        >
          Low H: mm
        </text>
      </g>

      {/* Perlin */}
      <g
        style={fade("perlin")}
        onClick={() => onPartClick("perlin")}
        onMouseEnter={() => setHovered("perlin")}
        onMouseLeave={() => setHovered(null)}
      >
        <rect
          x="157"
          y="292"
          width="18"
          height="18"
          rx="2"
          fill={PART_COLORS.perlin}
          opacity="0.9"
        />
        <rect
          x="212"
          y="258"
          width="18"
          height="18"
          rx="2"
          fill={PART_COLORS.perlin}
          opacity="0.9"
        />
        <rect
          x="340"
          y="174"
          width="18"
          height="18"
          rx="2"
          fill={PART_COLORS.perlin}
          opacity="0.9"
        />
        <rect
          x="460"
          y="100"
          width="18"
          height="18"
          rx="2"
          fill={PART_COLORS.perlin}
          opacity="0.9"
        />
        <line
          x1="157"
          y1="301"
          x2="68"
          y2="220"
          stroke={PART_COLORS.perlin}
          strokeWidth="0.7"
          strokeDasharray="4,2"
          opacity="0.7"
        />
        <rect
          x="10"
          y="200"
          width="58"
          height="42"
          rx="4"
          fill="white"
          stroke={PART_COLORS.perlin}
          strokeWidth="0.8"
        />
        <text
          x="39"
          y="213"
          fontSize="8.5"
          fill={PART_COLORS.perlin}
          fontFamily="monospace"
          textAnchor="middle"
          fontWeight="700"
        >
          Perlin
        </text>
        <text
          x="39"
          y="225"
          fontSize="8.5"
          fill={PART_COLORS.perlin}
          fontFamily="monospace"
          textAnchor="middle"
        >
          H: mm
        </text>
        <text
          x="39"
          y="236"
          fontSize="8.5"
          fill={PART_COLORS.perlin}
          fontFamily="monospace"
          textAnchor="middle"
        >
          W: mm
        </text>
        <line
          x1="157"
          y1="301"
          x2="68"
          y2="258"
          stroke={PART_COLORS.perlin}
          strokeWidth="0.7"
          strokeDasharray="4,2"
          opacity="0.6"
        />
        <rect
          x="10"
          y="248"
          width="58"
          height="30"
          rx="4"
          fill="white"
          stroke={PART_COLORS.perlin}
          strokeWidth="0.8"
        />
        <text
          x="39"
          y="260"
          fontSize="8.5"
          fill={PART_COLORS.perlin}
          fontFamily="monospace"
          textAnchor="middle"
        >
          Flange L
        </text>
        <text
          x="39"
          y="272"
          fontSize="8.5"
          fill={PART_COLORS.perlin}
          fontFamily="monospace"
          textAnchor="middle"
        >
          Perlin T
        </text>
        <line
          x1="479"
          y1="109"
          x2="580"
          y2="184"
          stroke={PART_COLORS.perlin}
          strokeWidth="0.7"
          strokeDasharray="4,2"
          opacity="0.7"
        />
        <rect
          x="576"
          y="174"
          width="96"
          height="44"
          rx="4"
          fill="white"
          stroke={PART_COLORS.perlin}
          strokeWidth="0.8"
        />
        <text
          x="624"
          y="188"
          fontSize="8.5"
          fill={PART_COLORS.perlin}
          fontFamily="monospace"
          textAnchor="middle"
        >
          Perlin Cnt: pcs
        </text>
        <text
          x="624"
          y="200"
          fontSize="8.5"
          fill={PART_COLORS.perlin}
          fontFamily="monospace"
          textAnchor="middle"
        >
          P-P Gap: mm
        </text>
        <text
          x="624"
          y="212"
          fontSize="8.5"
          fill={PART_COLORS.perlin}
          fontFamily="monospace"
          textAnchor="middle"
        >
          Mod-P Gap: mm
        </text>
      </g>

      {/* Braces */}
      <g
        style={fade("braces")}
        onClick={() => onPartClick("braces")}
        onMouseEnter={() => setHovered("braces")}
        onMouseLeave={() => setHovered(null)}
      >
        <line
          x1="289"
          y1="370"
          x2="116"
          y2="460"
          stroke={PART_COLORS.braces}
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.9"
        />
        <line
          x1="292"
          y1="396"
          x2="552"
          y2="396"
          stroke="#dc2626"
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.9"
        />
        <line
          x1="200"
          y1="415"
          x2="100"
          y2="490"
          stroke={PART_COLORS.braces}
          strokeWidth="0.7"
          strokeDasharray="4,2"
          opacity="0.7"
        />
        <rect
          x="60"
          y="480"
          width="80"
          height="30"
          rx="4"
          fill="white"
          stroke={PART_COLORS.braces}
          strokeWidth="0.8"
        />
        <text
          x="100"
          y="493"
          fontSize="9"
          fill={PART_COLORS.braces}
          fontFamily="monospace"
          textAnchor="middle"
          fontWeight="700"
        >
          Brace A: mm
        </text>
        <text
          x="100"
          y="505"
          fontSize="8.5"
          fill={PART_COLORS.braces}
          fontFamily="monospace"
          textAnchor="middle"
        >
          H×W×T: mm
        </text>
        <line
          x1="450"
          y1="396"
          x2="576"
          y2="320"
          stroke="#dc2626"
          strokeWidth="0.7"
          strokeDasharray="4,2"
          opacity="0.7"
        />
        <rect
          x="576"
          y="308"
          width="96"
          height="30"
          rx="4"
          fill="white"
          stroke="#dc2626"
          strokeWidth="0.8"
        />
        <text
          x="624"
          y="321"
          fontSize="9"
          fill="#dc2626"
          fontFamily="monospace"
          textAnchor="middle"
          fontWeight="700"
        >
          Brace B: mm
        </text>
        <text
          x="624"
          y="333"
          fontSize="8.5"
          fill="#dc2626"
          fontFamily="monospace"
          textAnchor="middle"
        >
          H×W×T: mm
        </text>
      </g>

      {/* Tilt badge */}
      <rect
        x="576"
        y="420"
        width="96"
        height="20"
        rx="4"
        fill="#1c1c1c"
        stroke="#555"
        strokeWidth="0.8"
      />
      <text
        x="624"
        y="434"
        fontSize="9"
        fill="white"
        fontFamily="monospace"
        textAnchor="middle"
      >
        Tilt: 20°
      </text>

      {/* Header badges */}
      <rect
        x="10"
        y="10"
        width="130"
        height="22"
        rx="4"
        fill="white"
        stroke="#1d4ed8"
        strokeWidth="0.8"
      />
      <text
        x="75"
        y="25"
        fontSize="9"
        fill="#1d4ed8"
        fontFamily="monospace"
        textAnchor="middle"
      >
        MMS — FRONT VIEW
      </text>
      <rect x="270" y="10" width="150" height="22" rx="4" fill="#1c1c1c" />
      <text
        x="345"
        y="25"
        fontSize="9"
        fill="white"
        fontFamily="monospace"
        textAnchor="middle"
        fontWeight="700"
      >
        FRONT VIEW — 2P MMS
      </text>

      {/* Active tooltip */}
      {effective && (
        <g>
          <rect
            x="10"
            y="590"
            width="240"
            height="22"
            rx="5"
            fill={PART_COLORS[effective] || "#dc2626"}
            opacity="0.92"
          />
          <text
            x="20"
            y="605"
            fontSize="10"
            fill="white"
            fontFamily="monospace"
            fontWeight="700"
          >
            {PART_LABELS[effective]} — click to jump to fields ↓
          </text>
        </g>
      )}
    </svg>
  );
}

// // ─── Attachment Item ──────────────────────────────────────────────────────────

async function uploadToCloudinary(file) {
  const formData = new FormData();

  formData.append("file", file);

  const res = await axios.post("/api/v1/image-upload/mms-structure", formData, {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return {
    url: res?.data?.url || "",
    preview_url: res?.data?.preview_url || "",
    resource_type: res?.data?.resource_type || "",
    format: res?.data?.format || "",
  };
}

// ─── Attachment Item ──────────────────────────────────────────────────────────

function AttachmentItem({ attachment, index, path, onRemove }) {
  return (
    <div style={styles.attachItem}>
      <img
        src={attachment.preview_url || attachment.img}
        alt={attachment.name}
        style={styles.attachThumb}
      />

      <span style={styles.attachName}>{attachment.name}</span>

      <CButton
        style={styles.removeBtn}
        onClick={() => onRemove(path, index)}
        type="button"
      >
        ✕
      </CButton>
    </div>
  );
}

// ─── Dimension Field ──────────────────────────────────────────────────────────

function DimensionField({ title, path, field, dispatch, onFocus, color }) {
  const fileInputRef = useRef(null);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    dispatch({
      type: "SET_UPLOAD_STATE",
      path,
      value: true,
    });

    try {
      // Upload File
      const uploadedFile = await uploadToCloudinary(file);

      if (uploadedFile.url) {
        dispatch({
          type: "ADD_ATTACHMENT",
          path,
          attachment: {
            name: file.name,
            img: uploadedFile.url,
            preview_url: uploadedFile.preview_url,
            resource_type: uploadedFile.resource_type,
            format: uploadedFile.format,
          },
        });
      }
    } catch (err) {
      console.error("Upload Error:", err);
    } finally {
      dispatch({
        type: "SET_UPLOAD_STATE",
        path,
        value: false,
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const displayLabel =
    labelMap[title] ||
    title.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div style={styles.dimField(color || "#888")}>
      <span style={styles.dimBadge}>{displayLabel}</span>

      <div style={styles.dimInputRow}>
        <div style={styles.dimInputWrap}>
          <input
            type="number"
            placeholder="0"
            value={field.value}
            onFocus={onFocus}
            onChange={(e) =>
              dispatch({
                type: "SET_FIELD",
                path: `${path}.value`,
                value: e.target.value,
              })
            }
            style={styles.dimInput}
          />

          {/* <span style={styles.mmSuffix}>mm</span> */}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept="image/*,.pdf,video/*"
          onChange={handleUpload}
        />

        <CButton
          type="button"
          style={styles.uploadBtn(field._uploading)}
          onClick={() => fileInputRef.current?.click()}
          disabled={field._uploading}
          title="Upload File"
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
      </div>

      {field.attatchments.length > 0 && (
        <div style={styles.attachments}>
          {field.attatchments.map((att, idx) => (
            <AttachmentItem
              key={idx}
              attachment={att}
              index={idx}
              path={path}
              onRemove={(p, i) =>
                dispatch({
                  type: "REMOVE_ATTACHMENT",
                  path: p,
                  index: i,
                })
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Section Block ────────────────────────────────────────────────────────────

function SectionBlock({ part, activePart, setActivePart, children }) {
  const sectionRef = useRef(null);
  const isActive = activePart === part;
  const color = PART_COLORS[part];

  useEffect(() => {
    if (isActive && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [isActive]);

  return (
    <div ref={sectionRef} style={styles.sectionBlock(isActive, color)}>
      <button
        type="button"
        style={styles.sectionTrigger(color)}
        onClick={() => setActivePart(isActive ? null : part)}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={styles.sectionDot(color)} />
          <div>
            <div style={styles.sectionLabel(isActive, color)}>
              {PART_LABELS[part]}
            </div>
            <div style={styles.sectionHint}>{PART_HINTS[part]}</div>
          </div>
        </div>
        <span style={{ ...styles.chevron, color: isActive ? color : "#aaa" }}>
          {isActive ? "▲" : "▼"}
        </span>
      </button>
      {isActive && (
        <div style={styles.sectionContent}>
          <div style={styles.dimGrid}>{children}</div>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MeasurementForm() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { formData, loading, success, error } = state;
  const [activePart, setActivePart] = useState(null);
  const [diagramVisible, setDiagramVisible] = useState(true);
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.userInfo);
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

  useEffect(() => {
    if (success || error) {
      const t = setTimeout(() => dispatch({ type: "CLEAR_MESSAGES" }), 5000);
      return () => clearTimeout(t);
    }
  }, [success, error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // e.stopPropagation();

    dispatch({ type: "CREATE_REQUEST" });

    try {
      console.log("Submitting:", formData);

      const { data } = await axios.post("/api/v1/mms-structure", formData, {
        withCredentials: true,
      });

      console.log(data);

      dispatch({
        type: "CREATE_SUCCESS",
        payload: data,
      });
      navigate(`/${adminroute}/mms-survey-dashboard`);
      toast.success("MMS Structure created successfully!");
    } catch (error) {
      console.error(error);

      dispatch({
        type: "CREATE_FAIL",
        payload: error?.response?.data?.message || "Something went wrong",
      });
    }
  };

  const handlePartClick = (part) => {
    setActivePart((prev) => (prev === part ? null : part));
  };

  return (
    <div style={styles.root}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerTop}>
            <div style={styles.headerIcon}>⊕</div>
            <div>
              <h1 style={styles.h1}>MMS Structure Measurements</h1>
              <div style={styles.subtitle}>
                Upload measurement data for technician review
              </div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {success && (
          <div style={styles.alert("success")}>
            ✓ MMS Structure Created Successfully
          </div>
        )}
        {error && <div style={styles.alert("error")}>✕ {error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Top Row: Diagram + Basic Info */}
          <div style={diagramVisible ? styles.topGrid : styles.topGridFull}>
            {/* Diagram Card */}
            {diagramVisible && (
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <span>⬡ Structure Diagram</span>
                  <button
                    type="button"
                    style={styles.ghostBtn}
                    onClick={() => setDiagramVisible(false)}
                  >
                    Hide ✕
                  </button>
                </div>
                <div style={styles.cardBody}>
                  <MmsDiagram
                    activePart={activePart}
                    onPartClick={handlePartClick}
                  />
                  <div style={styles.legend}>
                    {Object.entries(PART_COLORS).map(([part, color]) => (
                      <button
                        key={part}
                        type="button"
                        onClick={() => handlePartClick(part)}
                        style={styles.legendBtn(activePart === part, color)}
                      >
                        <span style={styles.legendDot(color)} />
                        {PART_LABELS[part].split(" ")[0]}
                      </button>
                    ))}
                  </div>
                  <p
                    style={{
                      textAlign: "center",
                      fontSize: 11,
                      color: "#aaa",
                      marginTop: 10,
                      marginBottom: 0,
                    }}
                  >
                    Click a part to highlight its measurement fields
                  </p>
                </div>
              </div>
            )}

            {/* Basic Info Card */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <span>Basic Information</span>
                {!diagramVisible && (
                  <button
                    type="button"
                    style={styles.ghostBtn}
                    onClick={() => setDiagramVisible(true)}
                  >
                    Show Diagram
                  </button>
                )}
              </div>
              <div style={styles.cardBody}>
                <div style={styles.formGrid}>
                  <div>
                    <label style={styles.label}>Client Name</label>
                    <input
                      style={styles.input}
                      value={formData.client.client_name}
                      placeholder="e.g. Adani Solar"
                      onChange={(e) =>
                        dispatch({
                          type: "SET_FIELD",
                          path: "client.client_name",
                          value: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label style={styles.label}>Client Email</label>
                    <input
                      style={styles.input}
                      type="email"
                      value={formData.client.email}
                      placeholder="admin@client.com"
                      onChange={(e) =>
                        dispatch({
                          type: "SET_FIELD",
                          path: "client.email",
                          value: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label style={styles.label}>Site Name</label>
                    <input
                      style={styles.input}
                      value={formData.site.site_name}
                      placeholder="e.g. Rajasthan Solar Plant"
                      onChange={(e) =>
                        dispatch({
                          type: "SET_FIELD",
                          path: "site.site_name",
                          value: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label style={styles.label}>Site Location</label>
                    <input
                      style={styles.input}
                      value={formData.site.location}
                      placeholder="e.g. Rajasthan"
                      onChange={(e) =>
                        dispatch({
                          type: "SET_FIELD",
                          path: "site.location",
                          value: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div style={styles.formGroupFull}>
                    <label style={styles.label}>MMS Type</label>
                    <div style={{ position: "relative" }}>
                      <select
                        style={styles.select}
                        value={formData.mms_type}
                        onChange={(e) =>
                          dispatch({
                            type: "SET_FIELD",
                            path: "mms_type",
                            value: e.target.value,
                          })
                        }
                      >
                        <option value="">— Select MMS Type —</option>
                        {MMS_TYPES.map((item) => (
                          <option key={item.value} value={item.value}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                      <span
                        style={{
                          position: "absolute",
                          right: 12,
                          top: "50%",
                          transform: "translateY(-50%)",
                          pointerEvents: "none",
                          color: "#888",
                          fontSize: 12,
                        }}
                      >
                        ▼
                      </span>
                    </div>
                  </div>

                  <div style={styles.formGroupFull}>
                    <DimensionField
                      title="tilt_angle"
                      field={formData.tilt_angle}
                      path="tilt_angle"
                      dispatch={dispatch}
                      color="#6b7280"
                    />
                  </div>

                  <div style={styles.formGroupFull}>
                    <label style={styles.label}>Remark</label>
                    <textarea
                      style={styles.textarea}
                      value={formData.remark}
                      placeholder="Optional note..."
                      onChange={(e) =>
                        dispatch({
                          type: "SET_FIELD",
                          path: "remark",
                          value: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Measurements Section */}
          <h2 style={styles.sectionTitle}>⊞ Structure Measurements</h2>
          <p style={styles.sectionSubtitle}>
            Click on a section to expand and enter measurements. Use the diagram
            to identify each part.
          </p>

          <div style={styles.sectionGrid}>
            {/* Left: Column + Perlin */}
            <div style={styles.col}>
              {/* Column */}
              <SectionBlock
                part="column"
                activePart={activePart}
                setActivePart={setActivePart}
              >
                {Object.entries(formData.column).map(([key, field]) => (
                  <DimensionField
                    key={key}
                    title={key}
                    field={field}
                    path={`column.${key}`}
                    dispatch={dispatch}
                    onFocus={() => setActivePart("column")}
                    color={PART_COLORS.column}
                  />
                ))}
              </SectionBlock>

              {/* Perlin */}
              <SectionBlock
                part="perlin"
                activePart={activePart}
                setActivePart={setActivePart}
              >
                <div style={{ gridColumn: "span 2", marginBottom: 12 }}>
                  <div style={styles.formGrid}>
                    <div>
                      <label style={styles.label}>Perlin Type</label>
                      <div style={{ position: "relative" }}>
                        <select
                          style={styles.select}
                          value={formData.perlin.type}
                          onChange={(e) =>
                            dispatch({
                              type: "SET_FIELD",
                              path: "perlin.type",
                              value: e.target.value,
                            })
                          }
                        >
                          <option value="">Select type</option>
                          <option value="C">C-type</option>
                          <option value="Z">Z-type</option>
                          <option value="U">U-type</option>
                        </select>
                        <span
                          style={{
                            position: "absolute",
                            right: 10,
                            top: "50%",
                            transform: "translateY(-50%)",
                            pointerEvents: "none",
                            // color: "#888",
                            fontSize: 11,
                          }}
                        >
                          ▼
                        </span>
                      </div>
                    </div>
                    <div>
                      <label style={styles.label}>Description</label>
                      <input
                        style={styles.input}
                        value={formData.perlin.description}
                        placeholder="Optional"
                        onChange={(e) =>
                          dispatch({
                            type: "SET_FIELD",
                            path: "perlin.description",
                            value: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
                {Object.entries(formData.perlin.perlin_dimension).map(
                  ([key, field]) => (
                    <DimensionField
                      key={key}
                      title={key}
                      field={field}
                      path={`perlin.perlin_dimension.${key}`}
                      dispatch={dispatch}
                      onFocus={() => setActivePart("perlin")}
                      color={PART_COLORS.perlin}
                    />
                  ),
                )}
              </SectionBlock>
            </div>

            {/* Right: Rafter + Braces */}
            <div style={styles.col}>
              {/* Rafter */}
              <SectionBlock
                part="rafter"
                activePart={activePart}
                setActivePart={setActivePart}
              >
                {Object.entries(formData.rafter)
                  .filter(([key]) => key !== "perlin_dimension")
                  .map(([key, field]) => (
                    <DimensionField
                      key={key}
                      title={key}
                      field={field}
                      path={`rafter.${key}`}
                      dispatch={dispatch}
                      onFocus={() => setActivePart("rafter")}
                      color={PART_COLORS.rafter}
                    />
                  ))}
                <div style={{ gridColumn: "span 2" }}>
                  <span
                    style={{
                      ...styles.subLabel,
                      background: "#ede9fe",
                      color: "#7c3aed",
                    }}
                  >
                    Perlin spacing on rafter
                  </span>
                </div>
                {Object.entries(formData.rafter.perlin_dimension).map(
                  ([key, field]) => (
                    <DimensionField
                      key={key}
                      title={key}
                      field={field}
                      path={`rafter.perlin_dimension.${key}`}
                      dispatch={dispatch}
                      onFocus={() => setActivePart("rafter")}
                      color={PART_COLORS.rafter}
                    />
                  ),
                )}
              </SectionBlock>

              {/* Braces */}
              <SectionBlock
                part="braces"
                activePart={activePart}
                setActivePart={setActivePart}
              >
                <div style={{ gridColumn: "span 2" }}>
                  <span
                    style={{
                      ...styles.subLabel,
                      background: "#fef3c7",
                      color: "#d97706",
                    }}
                  >
                    Brace A — diagonal member
                  </span>
                </div>
                {Object.entries(formData.braces.a).map(([key, field]) => (
                  <DimensionField
                    key={`a_${key}`}
                    title={key}
                    field={field}
                    path={`braces.a.${key}`}
                    dispatch={dispatch}
                    onFocus={() => setActivePart("braces")}
                    color={PART_COLORS.braces}
                  />
                ))}
                <div style={{ gridColumn: "span 2", marginTop: 8 }}>
                  <span
                    style={{
                      ...styles.subLabel,
                      background: "#fee2e2",
                      color: "#dc2626",
                    }}
                  >
                    Brace B — horizontal member
                  </span>
                </div>
                {Object.entries(formData.braces.b).map(([key, field]) => (
                  <DimensionField
                    key={`b_${key}`}
                    title={key}
                    field={field}
                    path={`braces.b.${key}`}
                    dispatch={dispatch}
                    onFocus={() => setActivePart("braces")}
                    color="#dc2626"
                  />
                ))}
              </SectionBlock>
            </div>
          </div>

          {/* Submit */}
          <div style={styles.submitRow}>
            <CButton
              component="button"
              type="submit"
              disabled={loading}
              style={styles.submitBtn(loading)}
            >
              {loading ? "⟳ Creating..." : "→ Create MMS Structure"}
            </CButton>
            <CButton
              type="button"
              style={styles.resetBtn}
              onClick={() => dispatch({ type: "RESET" })}
            >
              ↺ Reset
            </CButton>
          </div>
        </form>
      </div>
    </div>
  );
}
