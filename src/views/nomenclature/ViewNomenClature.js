import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";

import { Link, useParams } from "react-router-dom";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CBadge,
  CAlert,
  CButton,
  CModalBody,
  CModalHeader,
  CModal,
  CModalTitle,
  CCarousel,
  CCarouselItem,
  CImage,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilSun,
  cilReload,
  cilWarning,
  cilCopy,
  cilCheck,
  cilX,
} from "@coreui/icons";
import LoadingSpinner from "../../components/LoadingSpinner";
import LastActivity from "../../components/LastActivity";
import NomenclatureChat from "./NomenclatureChat";
import { useSelector } from "react-redux";

// ─── Reducer ──────────────────────────────────────────────────────────────────
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_NOMENCLATURES_REQUEST":
      return { ...state, loadingNomenclature: true, nomenclatureError: "" };
    case "FETCH_NOMENCLATURES_SUCCESS":
      return {
        ...state,
        loadingNomenclature: false,
        nomenclature: action.payload,
      };
    case "FETCH_NOMENCLATURES_FAIL":
      return {
        ...state,
        loadingNomenclature: false,
        nomenclatureError: action.payload,
      };
    default:
      return state;
  }
};

// ─── Mock (fallback for dev) ───────────────────────────────────────────────────
const MOCK = {
  _id: "2P001A",
  name: "2P MMS Nomenclature Details",
  projectNo: "2P",
  drawingNo: "2P001A",
  scale: "GL-TPL",
  drawnBy: "SP-TPL",
  revision: "00",
  date: "13/06/2023",
  status: "Active",
  type: "2P Fixed Tilt",
  tableNo1Rows: 2,
  tableNo1Cols: 3,
  tableNo2Rows: 3,
  tableNo2Cols: 3,
  dimensions: {
    A: { label: "Solar Module Dimension", value: "1722", unit: "mm" },
    B: {
      label: "Solar Module Vertical Gap Dimension",
      value: "20",
      unit: "mm",
    },
    C: { label: "Table Width Dimension", value: "3464", unit: "mm" },
    D: { label: "Back Ground Clearance Dimension", value: "1500", unit: "mm" },
    E: { label: "Front Ground Clearance Dimension", value: "300", unit: "mm" },
    F: { label: "Solar Module Height Dimension", value: "1134", unit: "mm" },
    G: {
      label: "Solar Module Frame Cross Section Dimension",
      value: "35",
      unit: "mm",
    },
    H: { label: "Inter Table Gap Dimension", value: "20", unit: "mm" },
    I: {
      label: "Solar Module Gap Horizontal Dimension",
      value: "10",
      unit: "mm",
    },
    J: { label: "Tilt Angle", value: "25", unit: "°" },
  },
};

// ─── Colour palette per label ──────────────────────────────────────────────────
const DIM_COLORS = {
  A: "#f59e0b",
  B: "#10b981",
  C: "#3b82f6",
  D: "#8b5cf6",
  E: "#ef4444",
  F: "#06b6d4",
  G: "#f97316",
  H: "#ec4899",
  I: "#84cc16",
  J: "#e11d48",
};

// ═══════════════════════════════════════════════════════════════════════════════
// SVG — Side-view mounting structure diagram
// ═══════════════════════════════════════════════════════════════════════════════
const SolarDiagram = ({ dimensions: dims, activeKey, onSelect }) => {
  const tilt = parseFloat(dims?.J?.value || 25);
  const col = (k) => (activeKey === k ? DIM_COLORS[k] : "#334155");
  const lw = (k) => (activeKey === k ? 2.2 : 1);
  const fs = (k) => (activeKey === k ? 13 : 10);
  const fw = (k) => (activeKey === k ? 700 : 500);
  const fc = (k) => (activeKey === k ? DIM_COLORS[k] : "#94a3b8");
  const cur = { cursor: "pointer" };

  return (
    <svg viewBox="0 0 520 290" style={{ width: "100%", height: "100%" }}>
      <defs>
        <linearGradient id="panelG" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e4080" />
          <stop offset="100%" stopColor="#0f2744" />
        </linearGradient>
        <linearGradient id="bgG" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#060f1e" />
          <stop offset="100%" stopColor="#0a1628" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2.5" result="cb" />
          <feMerge>
            <feMergeNode in="cb" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <marker
          id="arr"
          markerWidth="5"
          markerHeight="5"
          refX="2.5"
          refY="2.5"
          orient="auto"
        >
          <path d="M0,0 L5,2.5 L0,5 Z" fill="#475569" />
        </marker>
        {Object.entries(DIM_COLORS).map(([k, c]) => (
          <marker
            key={k}
            id={`arr${k}`}
            markerWidth="5"
            markerHeight="5"
            refX="2.5"
            refY="2.5"
            orient="auto"
          >
            <path d="M0,0 L5,2.5 L0,5 Z" fill={c} />
          </marker>
        ))}
      </defs>

      <rect width="520" height="290" fill="url(#bgG)" rx="10" />

      {/* Sun */}
      <circle
        cx="470"
        cy="42"
        r="18"
        fill="#fbbf24"
        style={{ filter: "url(#glow)", opacity: 0.85 }}
      />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <line
          key={a}
          x1={470 + 22 * Math.cos((a * Math.PI) / 180)}
          y1={42 + 22 * Math.sin((a * Math.PI) / 180)}
          x2={470 + 29 * Math.cos((a * Math.PI) / 180)}
          y2={42 + 29 * Math.sin((a * Math.PI) / 180)}
          stroke="#fbbf24"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.8"
        />
      ))}
      {/* Solar rays */}
      {[0, 1, 2, 3].map((i) => (
        <line
          key={i}
          x1={430 - i * 18}
          y1={70 + i * 12}
          x2={280 - i * 14}
          y2={172 + i * 6}
          stroke="#fbbf24"
          strokeWidth="0.7"
          strokeDasharray="4,3"
          opacity="0.18"
        />
      ))}

      {/* Ground */}
      <line
        x1="20"
        y1="240"
        x2="440"
        y2="240"
        stroke="#1e3a5f"
        strokeWidth="2"
        strokeDasharray="5,3"
      />
      <text
        x="444"
        y="244"
        fill="#475569"
        fontSize="9"
        // fontFamily="'Barlow Condensed',sans-serif"
        fontWeight="600"
      >
        GL
      </text>
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
        <line
          key={i}
          x1={25 + i * 37}
          y1="240"
          x2={14 + i * 37}
          y2="255"
          stroke="#1e3a5f"
          strokeWidth="1.5"
        />
      ))}

      {/* Mounting pole */}
      <rect x="192" y="175" width="16" height="65" fill="#1a3a70" rx="2" />
      <rect x="180" y="237" width="40" height="8" fill="#1a3a70" rx="2" />

      {/* Braces */}
      <line
        x1="200"
        y1="205"
        x2="135"
        y2="240"
        stroke="#2563eb"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="200"
        y1="205"
        x2="272"
        y2="240"
        stroke="#2563eb"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* ─── Panel group (tilted) ─── */}
      <g transform={`rotate(-${tilt}, 200, 175)`}>
        {/* Panel body */}
        <rect
          x="76"
          y="150"
          width="248"
          height="58"
          fill="url(#panelG)"
          rx="3"
          stroke={activeKey ? DIM_COLORS[activeKey] || "#2563eb" : "#2563eb"}
          strokeWidth={activeKey ? 2 : 1}
          style={{
            filter: activeKey ? "url(#glow)" : "none",
            transition: "stroke 0.3s",
          }}
        />
        {/* Panel grid */}
        {[0, 1, 2].map((ci) =>
          [0].map((ri) => (
            <rect
              key={`${ci}${ri}`}
              x={84 + ci * 80}
              y={156}
              width={72}
              height={46}
              fill="none"
              stroke="#1e4a8a"
              strokeWidth="0.8"
              rx="1"
            />
          )),
        )}

        {/* A — module length */}
        <g onClick={() => onSelect("A")} style={cur}>
          <line
            x1="80"
            y1="162"
            x2="320"
            y2="162"
            stroke={col("A")}
            strokeWidth={lw("A")}
            markerEnd={`url(#arrA)`}
            markerStart={`url(#arrA)`}
          />
          <text
            x="198"
            y="158"
            textAnchor="middle"
            // fontFamily="'Barlow Condensed',sans-serif"
            fontSize={fs("A")}
            fontWeight={fw("A")}
            fill={fc("A")}
          >
            A
          </text>
        </g>

        {/* B — vertical gap */}
        <g onClick={() => onSelect("B")} style={cur}>
          <line
            x1="70"
            y1="150"
            x2="70"
            y2="208"
            stroke={col("B")}
            strokeWidth={lw("B")}
            markerEnd={`url(#arrB)`}
            markerStart={`url(#arrB)`}
          />
          <text
            x="60"
            y="185"
            // fontFamily="'Barlow Condensed',sans-serif"
            fontSize={fs("B")}
            fontWeight={fw("B")}
            fill={fc("B")}
          >
            B
          </text>
        </g>

        {/* G — frame cross section circle */}
        <g onClick={() => onSelect("G")} style={cur}>
          <circle
            cx="76"
            cy="150"
            r="5"
            fill="none"
            stroke={col("G")}
            strokeWidth={lw("G")}
            style={{ filter: activeKey === "G" ? "url(#glow)" : "none" }}
          />
          <line
            x1="63"
            y1="137"
            x2="76"
            y2="150"
            stroke={col("G")}
            strokeWidth={lw("G")}
          />
          <text
            x="50"
            y="133"
            // fontFamily="'Barlow Condensed',sans-serif"
            fontSize={fs("G")}
            fontWeight={fw("G")}
            fill={fc("G")}
          >
            G
          </text>
        </g>
      </g>

      {/* C — table width */}
      <g onClick={() => onSelect("C")} style={cur}>
        <line
          x1="78"
          y1="126"
          x2="326"
          y2="126"
          stroke={col("C")}
          strokeWidth={lw("C")}
          markerEnd={`url(#arrC)`}
          markerStart={`url(#arrC)`}
        />
        <text
          x="200"
          y="120"
          textAnchor="middle"
          // fontFamily="'Barlow Condensed',sans-serif"
          fontSize={fs("C")}
          fontWeight={fw("C")}
          fill={fc("C")}
        >
          C
        </text>
      </g>

      {/* D — back clearance */}
      <g onClick={() => onSelect("D")} style={cur}>
        <line
          x1="338"
          y1="140"
          x2="338"
          y2="238"
          stroke={col("D")}
          strokeWidth={lw("D")}
          markerEnd={`url(#arrD)`}
          markerStart={`url(#arrD)`}
        />
        <text
          x="346"
          y="196"
          // fontFamily="'Barlow Condensed',sans-serif"
          fontSize={fs("D")}
          fontWeight={fw("D")}
          fill={fc("D")}
        >
          D
        </text>
      </g>

      {/* E — front clearance */}
      <g onClick={() => onSelect("E")} style={cur}>
        <line
          x1="62"
          y1="220"
          x2="62"
          y2="238"
          stroke={col("E")}
          strokeWidth={lw("E")}
          markerEnd={`url(#arrE)`}
          markerStart={`url(#arrE)`}
        />
        <text
          x="50"
          y="233"
          // fontFamily="'Barlow Condensed',sans-serif"
          fontSize={fs("E")}
          fontWeight={fw("E")}
          fill={fc("E")}
        >
          E
        </text>
      </g>

      {/* F — module height */}
      <g onClick={() => onSelect("F")} style={cur}>
        <line
          x1="42"
          y1="196"
          x2="42"
          y2="238"
          stroke={col("F")}
          strokeWidth={lw("F")}
          markerEnd={`url(#arrF)`}
          markerStart={`url(#arrF)`}
        />
        <text
          x="30"
          y="222"
          // fontFamily="'Barlow Condensed',sans-serif"
          fontSize={fs("F")}
          fontWeight={fw("F")}
          fill={fc("F")}
        >
          F
        </text>
      </g>

      {/* J — tilt angle arc */}
      <g onClick={() => onSelect("J")} style={cur}>
        <path
          d={`M 200 240 A 36 36 0 0 1 ${200 + 36 * Math.cos(((90 - tilt) * Math.PI) / 180)} ${240 - 36 * Math.sin(((90 - tilt) * Math.PI) / 180)}`}
          fill="none"
          stroke={col("J")}
          strokeWidth={lw("J")}
          strokeDasharray="3,2"
        />
        <text
          x="218"
          y="230"
          // fontFamily="'Barlow Condensed',sans-serif"
          fontSize={fs("J")}
          fontWeight={fw("J")}
          fill={fc("J")}
        >
          J={tilt}°
        </text>
      </g>

      {/* Corner label */}
      <text
        x="16"
        y="270"
        fill="#1e3a5f"
        fontSize="8"
        // fontFamily="'Barlow Condensed',sans-serif"
        fontWeight="700"
        letterSpacing="2"
      >
        TAYPRO® 2P MMS
      </text>
    </svg>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SVG — Top-view table layout
// ═══════════════════════════════════════════════════════════════════════════════
const TableLayout = ({ nom, activeKey, onSelect }) => {
  const r1 = nom?.tableNo1Rows || 2,
    c1 = nom?.tableNo1Cols || 3;
  const r2 = nom?.tableNo2Rows || 3,
    c2 = nom?.tableNo2Cols || 3;
  const cw = 42,
    ch = 54,
    g = 4;
  const col = (k) => (activeKey === k ? DIM_COLORS[k] : "#334155");
  const fc = (k) => (activeKey === k ? DIM_COLORS[k] : "#64748b");
  const fw = (k) => (activeKey === k ? 700 : 500);

  return (
    <svg viewBox="0 0 360 200" style={{ width: "100%", height: "100%" }}>
      <rect width="360" height="200" fill="#060f1e" rx="8" />

      {/* TABLE-NO-1 */}
      <text
        x="12"
        y="16"
        fill="#475569"
        fontSize="8"
        // fontFamily="'Barlow Condensed',sans-serif"
        fontWeight="600"
        letterSpacing="1"
      >
        TABLE-NO-1
      </text>
      {Array.from({ length: r1 }).map((_, ri) =>
        Array.from({ length: c1 }).map((_, ci) => (
          <rect
            key={`t1${ri}${ci}`}
            x={12 + ci * (cw + g)}
            y={22 + ri * (ch + g)}
            width={cw}
            height={ch}
            fill="#0d1f3c"
            stroke="#1e4080"
            strokeWidth="1.2"
            rx="2"
          />
        )),
      )}

      {/* B arrow on left of table 1 */}
      <g onClick={() => onSelect("B")} style={{ cursor: "pointer" }}>
        <line
          x1="8"
          y1="22"
          x2="8"
          y2={22 + r1 * (ch + g) - g}
          stroke={col("B")}
          strokeWidth="1.2"
        />
        <text
          x="2"
          y={22 + (r1 * (ch + g)) / 2 + 4}
          fill={fc("B")}
          fontSize="10"
          // fontFamily="'Barlow Condensed',sans-serif"
          fontWeight={fw("B")}
        >
          B
        </text>
      </g>

      {/* H — inter-table gap (between table 1 and 2) */}
      <g onClick={() => onSelect("H")} style={{ cursor: "pointer" }}>
        <line
          x1={12 + c1 * (cw + g)}
          y1="180"
          x2="185"
          y2="180"
          stroke={col("H")}
          strokeWidth="1.2"
          strokeDasharray="2,2"
        />
        <text
          x={12 + c1 * (cw + g) + (185 - (12 + c1 * (cw + g))) / 2}
          y="194"
          textAnchor="middle"
          fill={fc("H")}
          fontSize="10"
          // fontFamily="'Barlow Condensed',sans-serif"
          fontWeight={fw("H")}
        >
          ← H →
        </text>
      </g>

      {/* TABLE-NO-2 */}
      <text
        x="190"
        y="16"
        fill="#475569"
        fontSize="8"
        // fontFamily="'Barlow Condensed',sans-serif"
        fontWeight="600"
        letterSpacing="1"
      >
        TABLE-NO-2
      </text>
      {Array.from({ length: r2 }).map((_, ri) =>
        Array.from({ length: c2 }).map((_, ci) => (
          <rect
            key={`t2${ri}${ci}`}
            x={190 + ci * (cw + g)}
            y={22 + ri * (ch + g)}
            width={cw}
            height={ch}
            fill="#0d1f3c"
            stroke="#1e4080"
            strokeWidth="1.2"
            rx="2"
          />
        )),
      )}

      {/* I — horizontal gap top right */}
      <g onClick={() => onSelect("I")} style={{ cursor: "pointer" }}>
        <line
          x1={190 + c2 * (cw + g)}
          y1="20"
          x2={190 + c2 * (cw + g)}
          y2="26"
          stroke={col("I")}
          strokeWidth="1.2"
        />
        <text
          x={190 + c2 * (cw + g) + 4}
          y="18"
          fill={fc("I")}
          fontSize="10"
          // fontFamily="'Barlow Condensed',sans-serif"
          fontWeight={fw("I")}
        >
          I
        </text>
      </g>
    </svg>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// Dimension card
// ═══════════════════════════════════════════════════════════════════════════════
const DimCard = ({ letter, data, isActive, onClick }) => {
  const c = DIM_COLORS[letter];
  return (
    <div
      onClick={onClick}
      style={{
        background: isActive ? `${c}15` : "#0d1f3c",
        border: `1.5px solid ${isActive ? c : "#1e3a5f"}`,
        borderRadius: 10,
        padding: "10px 12px",
        cursor: "pointer",
        transition: "all 0.2s",
        transform: isActive ? "translateY(-2px)" : "none",
        boxShadow: isActive ? `0 6px 20px ${c}28` : "none",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 4,
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 7,
            background: isActive ? c : `${c}22`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            // fontFamily: "'Barlow Condensed',sans-serif",
            fontWeight: 800,
            fontSize: 14,
            color: isActive ? "#fff" : c,
            transition: "all 0.2s",
            flexShrink: 0,
          }}
        >
          {letter}
        </div>
        <div
          style={{
            // fontFamily: "'Barlow Condensed',sans-serif",
            fontSize: "0.95rem",
            fontWeight: 600,
            color: isActive ? c : "#e2e8f0",
            lineHeight: 1.2,
          }}
        >
          {data?.value ? `${data.value} ${data.unit}` : "—"}
        </div>
      </div>
      <div
        style={{
          fontSize: "0.68rem",
          color: "#64748b",
          // fontFamily: "'DM Sans',sans-serif",
          lineHeight: 1.3,
        }}
      >
        {data?.label || `Dimension ${letter}`}
      </div>
    </div>
  );
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const Skel = ({ w = "100%", h = 14, mb = 10 }) => (
  <div
    style={{
      width: w,
      height: h,
      borderRadius: 6,
      background: "linear-gradient(90deg,#0d1f3c 25%,#1e3a5f 50%,#0d1f3c 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.4s infinite",
      marginBottom: mb,
    }}
  />
);

// ─── Info chip ────────────────────────────────────────────────────────────────
const Chip = ({ label, value }) => (
  <div
    style={{
      background: "#0d1f3c",
      border: "1px solid #1e3a5f",
      borderRadius: 8,
      padding: "6px 12px",
    }}
  >
    <div
      style={{
        fontSize: "0.6rem",
        color: "#475569",
        // fontFamily: "'Barlow Condensed',sans-serif",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
      }}
    >
      {label}
    </div>
    <div
      style={{
        fontSize: "0.85rem",
        color: "#e2e8f0",
        // fontFamily: "'Barlow Condensed',sans-serif",
      }}
    >
      {value || "—"}
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// Main page
// ═══════════════════════════════════════════════════════════════════════════════
const ViewNomenClature = () => {
  const { id } = useParams();
  const [activeKey, setActiveKey] = useState(null);
  const [copied, setCopied] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const userInfo = useSelector((state) => state.userInfo);

  const [showModal, setShowModal] = useState(false);
  const [showImagesModal, setShowImagesModal] = useState(false);
  const [{ nomenclatureError, nomenclature, loadingNomenclature }, dispatch] =
    useReducer(reducer, {
      nomenclature: null,
      loadingNomenclature: true,
      nomenclatureError: "",
    });

  const refetch = async () => {
    try {
      dispatch({ type: "FETCH_NOMENCLATURES_REQUEST" });
      const resp = await axios.get(`/api/v1/nomenclatures/${id}`, {
        withCredentials: true,
      });

      const apiData = resp.data.data;

      // ✅ Convert nomenclature array -> dimensions object
      const dimensions = {};

      apiData?.nomenclature?.forEach((item, index) => {
        const letter = String.fromCharCode(65 + index); // A,B,C...

        dimensions[letter] = {
          label: item.name,
          value: item.value,
          unit: item.key?.includes("angle") ? "°" : "mm",
          description: item.description,
          attachments: item.attachments || [],
        };
      });

      // ✅ Final transformed object for UI
      const transformed = {
        site: apiData.site,
        client: apiData.client,
        _id: apiData._id,
        name: apiData.mms_type_name,
        date: new Date(apiData.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        }),

        status: apiData.status,

        type: apiData.mms_type,

        dimensions,

        chats: apiData.chats || [],

        activities: apiData.last_activity || [],

        reference_files: apiData.reference_files || [],
      };

      dispatch({ type: "FETCH_NOMENCLATURES_SUCCESS", payload: transformed });
    } catch (e) {
      // Dev fallback — remove in production
      //   dispatch({ type: "FETCH_NOMENCLATURES_SUCCESS", payload: MOCK });
      dispatch({
        type: "FETCH_NOMENCLATURES_FAIL",
        payload: e.response?.data?.message || e.response?.data?.error,
      });
      // toast.error(e.response?.data?.message);
    }
  };

  useEffect(() => {
    refetch();
  }, [id]); // eslint-disable-line

  nomenclatureError && (
    <CAlert
      color="danger"
      style={{
        borderRadius: 12,
        background: "#1a0a0a",
        border: "1px solid #ef4444",
        color: "#fca5a5",
        marginBottom: 16,
      }}
    >
      <CIcon icon={cilWarning} style={{ marginRight: 8 }} />
      {nomenclatureError}
    </CAlert>
  );

  const nom = nomenclature ? nomenclature : {};
  const dims = nom?.dimensions;
  //    || MOCK.dimensions;
  const act = activeKey ? dims[activeKey] : null;
  const sel = (k) => setActiveKey((p) => (p === k ? null : k));

  const copyId = () => {
    navigator.clipboard.writeText(nom?._id || id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

  return (
    <>
      <style>{`*{box-sizing:border-box;}
      .nr{min-height:100vh;padding:2px;}
      @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
      @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
      @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.45}}
      .nc{background:#0a1628!important;border:1px solid #1e3a5f!important;border-radius:16px!important;box-shadow:0 8px 32px rgba(0,0,0,.45)!important;}
      .nch{background:linear-gradient(135deg,#0d1f3c,#162d50)!important;border-bottom:1px solid #1e3a5f!important;border-radius:16px 16px 0 0!important;padding:14px 18px!important;}
      .dg{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;}
      .ds{max-height:360px;overflow-y:auto;padding-right:4px;}
      .ds::-webkit-scrollbar{width:3px}.ds::-webkit-scrollbar-thumb{background:#1e3a5f;border-radius:2px}
      .bs{background:#0d1f3c!important;border:1px solid #1e3a5f!important;border-radius:8px!important;color:#94a3b8!important;font-size:.8rem!important;transition:all .2s!important;padding:4px 10px!important;}
      .bs:hover{border-color:#2563eb!important;color:#e2e8f0!important;}
      .bp{background:linear-gradient(135deg,#1d4ed8,#2563eb)!important;border:none!important;border-radius:8px!important;color:#fff!important;font-weight:600!important;font-size:.85rem!important;letter-spacing:.04em!important;transition:all .2s!important;padding:5px 14px!important;}
      .bp:hover{transform:translateY(-1px);box-shadow:0 6px 16px rgba(37,99,235,.4)!important;}
      .sdot{width:8px;height:8px;border-radius:50%;background:#10b981;box-shadow:0 0 8px #10b981;animation:pulse 2s ease-in-out infinite;display:inline-block;}
      .ahl{background:linear-gradient(135deg,#0d2d5e,#0f3460);border:1.5px solid #2563eb;border-radius:12px;padding:14px 16px;animation:fadeIn .3s ease-out;}
      .chips{display:flex;flex-wrap:wrap;gap:8px;}
      .sl{font-size:.7rem;letter-spacing:.12em;text-transform:uppercase;font-weight:600;margin-bottom:10px;}
    `}</style>
      {loadingNomenclature ? (
        <LoadingSpinner fullHeight={true} />
      ) : nomenclatureError ? (
        <CAlert
          color="danger"
          style={{
            borderRadius: 12,
            background: "#1a0a0a",
            border: "1px solid #ef4444",
            color: "#fca5a5",
            marginBottom: 16,
          }}
        >
          <CIcon icon={cilWarning} style={{ marginRight: 8 }} />
          {nomenclatureError}
        </CAlert>
      ) : (
        <>
          <div className="nr">
            {/* ── Page header ── */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 18,
                animation: "fadeIn .4s ease-out",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 13,
                    background: "linear-gradient(135deg,#1d4ed8,#f59e0b)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CIcon
                    icon={cilSun}
                    style={{ color: "#fff", fontSize: 24 }}
                  />
                </div>
                <div>
                  <div
                    style={{
                      // fontFamily: "'Barlow Condensed',sans-serif",
                      fontSize: "1.55rem",
                      fontWeight: 800,
                      color: "#e2e8f0",
                      letterSpacing: ".04em",
                      lineHeight: 1,
                    }}
                  >
                    {loadingNomenclature ? "Loading…" : nom?.name}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginTop: 4,
                    }}
                  >
                    <div className="sdot" />
                    <span style={{ color: "#64748b", fontSize: ".72rem" }}>
                      {loadingNomenclature
                        ? "Fetching record…"
                        : `${nom?.date}`}
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {/* <CButton className="bs" onClick={copyId}>
                  <CIcon
                    icon={copied ? cilCheck : cilCopy}
                    size="sm"
                    style={{ marginRight: 4 }}
                  />
                  {copied ? "Copied!" : `#${id}`}
                </CButton> */}
                <Link
                  to={`/${adminroute}/update-nomenclature/${nomenclature._id}`}
                  className="btn btn-sm btn-secondary text-decoration-none"
                >
                  Update
                </Link>
                <CButton
                  className="bp"
                  onClick={refetch}
                  disabled={loadingNomenclature}
                >
                  <CIcon
                    icon={cilReload}
                    size="sm"
                    style={{ marginRight: 4 }}
                  />
                  Refresh
                </CButton>
              </div>
            </div>

            {nomenclatureError && (
              <CAlert
                color="danger"
                style={{
                  borderRadius: 12,
                  background: "#1a0a0a",
                  border: "1px solid #ef4444",
                  color: "#fca5a5",
                  marginBottom: 16,
                }}
              >
                <CIcon icon={cilWarning} style={{ marginRight: 8 }} />
                {nomenclatureError}
              </CAlert>
            )}

            <CRow className="g-3">
              {/* ── Left: diagrams ── */}
              <CCol xs={12} lg={7}>
                <CCard className="nc" style={{ height: "100%" }}>
                  <CCardHeader className="nch">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span
                        style={{
                          // fontFamily: "'Barlow Condensed',sans-serif",
                          fontWeight: 600,
                          fontSize: ".88rem",
                          color: "#64748b",
                          letterSpacing: ".08em",
                          textTransform: "uppercase",
                        }}
                      >
                        Mounting Structure — Side View
                      </span>
                      {activeKey && (
                        <span
                          style={{
                            background: DIM_COLORS[activeKey],
                            color: "#fff",
                            // fontFamily: "'Barlow Condensed',sans-serif",
                            fontSize: ".78rem",
                            fontWeight: 600,
                            borderRadius: 6,
                            padding: "3px 10px",
                            letterSpacing: ".04em",
                          }}
                        >
                          {activeKey} — {act?.label}
                        </span>
                      )}
                    </div>
                  </CCardHeader>
                  <CCardBody style={{ background: "#0a1628", padding: 16 }}>
                    {loadingNomenclature ? (
                      <div
                        style={{
                          height: 280,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <LoadingSpinner />
                      </div>
                    ) : (
                      <>
                        <div style={{ height: 290 }}>
                          <SolarDiagram
                            dimensions={dims}
                            activeKey={activeKey}
                            onSelect={sel}
                          />
                        </div>
                        <hr
                          style={{ borderColor: "#1e3a5f", margin: "12px 0" }}
                        />
                        <div className="sl">Top View — Panel Module Layout</div>
                        <div style={{ height: 160 }}>
                          <TableLayout
                            nom={nom || MOCK}
                            activeKey={activeKey}
                            onSelect={sel}
                          />
                        </div>
                        <p
                          style={{
                            fontSize: ".68rem",
                            textAlign: "center",
                            marginTop: 8,
                            // fontFamily: "'DM Sans',sans-serif",
                          }}
                        >
                          Click any label on the diagram to highlight its
                          specification →
                        </p>
                      </>
                    )}
                  </CCardBody>
                </CCard>
              </CCol>

              {/* ── Right: specs ── */}
              <CCol xs={12} lg={5}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    height: "100%",
                  }}
                >
                  {/* Project meta */}
                  <CCard className="">
                    <CCardHeader className=" d-flex justify-content-between align-items-center">
                      <span
                        style={{
                          // fontFamily: "'Barlow Condensed',sans-serif",
                          fontWeight: 600,
                          fontSize: ".88rem",
                          color: "#64748b",
                          letterSpacing: ".08em",
                          textTransform: "uppercase",
                        }}
                      >
                        Project Info
                      </span>
                      <CButton
                        className="btn btn-primary btn-sm m-1"
                        onClick={() => {
                          setShowModal(true); // ✅ Correct modal for approve
                        }}
                      >
                        View Chats
                      </CButton>
                    </CCardHeader>
                    <CCardBody
                      style={{ background: "#0a1628", padding: "14px 16px" }}
                    >
                      {loadingNomenclature ? (
                        <>
                          <Skel w="75%" />
                          <Skel w="55%" />
                          <Skel w="65%" />
                        </>
                      ) : nomenclatureError ? (
                        <CAlert color="danger">
                          <CIcon icon={cilWarning} style={{ marginRight: 8 }} />
                          {nomenclatureError}
                        </CAlert>
                      ) : (
                        <div className="chips">
                          <Chip
                            label="Client"
                            value={nom?.client?.client_name}
                          />
                          <Chip
                            label="Site"
                            value={`${nom?.site?.site_name}, ${nom?.site?.location}`}
                          />
                          <Chip label="MMS Type" value={nom?.type} />
                          <Chip
                            label="Created By"
                            value={`${nom?.activities[0]?.name} , ${new Date(
                              nom?.activities[0]?.timestamp,
                            ).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "2-digit",
                            })}`}
                          />
                          <Chip
                            label="Timestamp"
                            value={`${new Date(
                              nom?.activities[0]?.timestamp,
                            ).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                              hour12: true,
                            })}`}
                          />

                          <div
                            style={{
                              background: "#0d1f3c",
                              border: "1px solid #1e3a5f",
                              borderRadius: 8,
                              padding: "6px 12px",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            <span
                              style={{
                                fontSize: ".6rem",
                                color: "#475569",
                                // fontFamily: "'Barlow Condensed',sans-serif",
                                letterSpacing: ".1em",
                                textTransform: "uppercase",
                              }}
                            >
                              Status
                            </span>
                            <CBadge
                              color="success"
                              shape="rounded-pill"
                              style={{ fontSize: ".72rem" }}
                            >
                              {nom?.status || "Active"}
                            </CBadge>
                          </div>
                        </div>
                      )}
                    </CCardBody>
                  </CCard>

                  {/* Active dimension spotlight */}
                  {activeKey && act && (
                    <div className="ahl">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          marginBottom: 10,
                        }}
                      >
                        <div
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: 12,
                            background: DIM_COLORS[activeKey],
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            // fontFamily: "'Barlow Condensed',sans-serif",
                            fontWeight: 900,
                            fontSize: 22,
                            color: "#fff",
                          }}
                        >
                          {activeKey}
                        </div>

                        <div>
                          <div
                            style={{
                              // fontFamily: "'Barlow Condensed',sans-serif",
                              fontWeight: 600,
                              fontSize: ".85rem",
                              color: "#94a3b8",
                              lineHeight: 1.2,
                            }}
                          >
                            {act.label}
                          </div>
                          <div
                            style={{
                              // fontFamily: "'Barlow Condensed',sans-serif",
                              fontSize: "1.9rem",
                              fontWeight: 800,
                              color: DIM_COLORS[activeKey],
                              lineHeight: 1.1,
                            }}
                          >
                            {act.value}{" "}
                            <span
                              style={{
                                fontSize: "1rem",
                                fontWeight: 500,
                                color: "#94a3b8",
                              }}
                            >
                              {act.unit}
                            </span>
                          </div>
                          <CButton
                            className="btn btn-primary btn-sm m-1"
                            onClick={() => {
                              setShowImagesModal(true); // ✅ Correct modal for approve
                            }}
                          >
                            View Images
                          </CButton>
                        </div>
                      </div>

                      <div
                        style={{
                          fontSize: ".65rem",
                          //   color: "#475569",
                          marginTop: 4,
                          // fontFamily: "'DM Sans',sans-serif",
                        }}
                      >
                        Dimension {activeKey} ·{" "}
                        {act.unit === "°"
                          ? "Angular measurement"
                          : "Linear measurement"}
                      </div>
                    </div>
                  )}

                  {/* All dimensions A–J */}
                  <CCard className="nc" style={{ flex: 1 }}>
                    <CCardHeader className="nch">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <span
                          style={{
                            // fontFamily: "'Barlow Condensed',sans-serif",
                            fontWeight: 600,
                            fontSize: ".88rem",
                            color: "#64748b",
                            letterSpacing: ".08em",
                            textTransform: "uppercase",
                          }}
                        >
                          Dimensions A – J
                        </span>
                        {activeKey && (
                          <CButton
                            size="sm"
                            className="bs"
                            style={{ padding: "2px 8px", fontSize: ".7rem" }}
                            onClick={() => setActiveKey(null)}
                          >
                            Clear
                          </CButton>
                        )}
                      </div>
                    </CCardHeader>
                    <CCardBody
                      style={{ background: "#0a1628", padding: "14px 16px" }}
                    >
                      {loadingNomenclature ? (
                        <div className="dg">
                          {Array.from({ length: 10 }).map((_, i) => (
                            <div
                              key={i}
                              style={{
                                background: "#0d1f3c",
                                borderRadius: 10,
                                padding: 12,
                              }}
                            >
                              <Skel w="40%" h={10} mb={6} />
                              <Skel w="70%" h={14} mb={4} />
                              <Skel w="88%" h={9} mb={0} />
                            </div>
                          ))}
                        </div>
                      ) : nomenclatureError ? (
                        <CAlert color="danger">
                          <CIcon icon={cilWarning} style={{ marginRight: 8 }} />
                          {nomenclatureError}
                        </CAlert>
                      ) : (
                        <div className="ds">
                          <div className="dg">
                            {Object.entries(dims).map(([k, v]) => (
                              <DimCard
                                key={k}
                                letter={k}
                                data={v}
                                isActive={activeKey === k}
                                onClick={() => sel(k)}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </CCardBody>
                  </CCard>
                </div>
              </CCol>
            </CRow>

            <div className=" my-2">
              {loadingNomenclature ? (
                <Skel w="100%" h={20} />
              ) : (
                <LastActivity lastactivity={nom.activities} />
              )}
            </div>
          </div>
          {/* chat modal */}
          <CModal
            visible={showModal}
            onClose={() => {
              setShowModal(false);
            }}
            backdrop="static"
            size="lg"
            // style={{ width: "100%" }}
            scrollable
          >
            <CModalHeader closeButton={false}>
              <CModalTitle>Team Discussion</CModalTitle>
              <button
                type="button"
                className="border-0 ms-auto py-0 px-1"
                onClick={() => {
                  setShowModal(false);
                }}
                style={{ background: "none" }}
              >
                <CIcon icon={cilX} size="lg" />
              </button>
            </CModalHeader>

            <CModalBody>
              {loadingNomenclature ? (
                <Skel w="100%" h={20} />
              ) : (
                <NomenclatureChat
                  nomenclatureId={id}
                  // chats={nom?.chats || []}
                  currentUser={userInfo}
                  // onMessageSent={refetch}
                />
              )}
            </CModalBody>
          </CModal>

          <CModal
            visible={showImagesModal}
            onClose={() => setShowImagesModal(false)}
            size="xl"
            alignment="center"
            backdrop="static"
            // style={{
            //   backdropFilter: "blur(8px)",
            // }}
            scrollable
          >
            <CModalHeader
              style={{
                background: "#0a1628",
                borderBottom: "1px solid #1e3a5f",
              }}
              closeButton={false}
            >
              <CModalTitle
                style={{
                  color: "#e2e8f0",
                  fontWeight: 700,
                }}
              >
                {act?.label} Images
              </CModalTitle>
              <button
                type="button"
                className="border-0 ms-auto py-0 px-1"
                onClick={() => {
                  setShowImagesModal(false);
                }}
                style={{ background: "none" }}
              >
                <CIcon icon={cilX} size="lg" />
              </button>
            </CModalHeader>

            <CModalBody
              style={{
                background: "#060f1e",
                padding: "20px",
              }}
            >
              {!act?.attachments?.length ? (
                <div
                  style={{
                    color: "#94a3b8",
                    textAlign: "center",
                    padding: "40px 0",
                  }}
                >
                  No images available
                </div>
              ) : (
                <>
                  {/* MAIN IMAGE */}

                  <div
                    style={{
                      width: "100%",
                      height: "500px",
                      borderRadius: "14px",
                      overflow: "hidden",
                      //   border: "1px solid #1e3a5f",
                      //   background: "#0a1628",
                      marginBottom: "16px",
                    }}
                  >
                    <img
                      src={act?.attachments?.[selectedImage]?.img}
                      alt={act?.attachments?.[selectedImage]?.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </div>

                  {/* IMAGE TITLE */}

                  <div
                    style={{
                      color: "#cbd5e1",
                      fontSize: "0.95rem",
                      marginBottom: "16px",
                      textAlign: "center",
                      fontWeight: 600,
                    }}
                  >
                    {act?.attachments?.[selectedImage]?.name}
                  </div>

                  {/* THUMBNAILS */}

                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      overflowX: "auto",
                      paddingBottom: "6px",
                    }}
                  >
                    {act?.attachments?.map((attachment, index) => (
                      <div
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        style={{
                          width: "90px",
                          height: "90px",
                          borderRadius: "10px",
                          overflow: "hidden",
                          cursor: "pointer",

                          border:
                            selectedImage === index
                              ? "2px solid #2563eb"
                              : "1px solid #1e3a5f",

                          flexShrink: 0,

                          transition: "all 0.2s ease",
                        }}
                      >
                        <img
                          src={attachment?.img}
                          alt={attachment?.name}
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "contain",
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CModalBody>
          </CModal>
        </>
      )}
    </>
  );
};

export default ViewNomenClature;
