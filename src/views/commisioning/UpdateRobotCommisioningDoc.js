// import React, { useEffect, useReducer, useState } from "react";
// import {
//   CRow,
//   CCol,
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CSpinner,
// } from "@coreui/react";
// import {
//   Zap,
//   Wifi,
//   ArrowLeftRight,
//   Gauge,
//   Brush,
//   Eye,
//   ShieldCheck,
//   Bot,
//   MapPin,
//   Building2,
//   Save,
//   ClipboardCheck,
// } from "lucide-react";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import { useSelector } from "react-redux";
// import toast from "react-hot-toast";
// import LastActivity from "../../components/LastActivity";

// /* ─────────────────────────────────────────────
//    Reducer
// ───────────────────────────────────────────── */
// const reducer = (state, action) => {
//   switch (action.type) {
//     case "FETCH_REQUEST":
//       return { ...state, loadingDoc: true, docError: "" };
//     case "FETCH_SUCCESS":
//       return { ...state, loadingDoc: false, doc: action.payload };
//     case "FETCH_FAIL":
//       return { ...state, loadingDoc: false, docError: action.payload };
//     case "UPDATE_REQUEST":
//       return { ...state, updating: true };
//     case "UPDATE_SUCCESS":
//       return { ...state, updating: false };
//     case "UPDATE_FAIL":
//       return { ...state, updating: false };
//     default:
//       return state;
//   }
// };

// /* ─────────────────────────────────────────────
//    Design tokens
// ───────────────────────────────────────────── */
// const T = {
//   bg: "#020817",
//   surface: "#0f172a",
//   surfaceAlt: "#0a111e",
//   border: "#1e293b",
//   input: "#1e293b",
//   inputBorder: "#334155",
//   textPrimary: "#e2e8f0",
//   textMuted: "#64748b",
//   amber: "#f59e0b",
// };

// /* ─────────────────────────────────────────────
//    Enum sets — kept in sync with Mongoose schema
// ───────────────────────────────────────────── */
// const PART_STATUS_OPTIONS = ["not-checked", "good", "worn", "damaged"];
// const SIGNAL_OPTIONS = ["poor", "average", "good"];
// const CLEAN_EFF_OPTIONS = ["not-checked", "poor", "average", "good"];
// const DEVIATION_OPTIONS = ["none", "low", "medium", "high"];
// const OVERALL_STATUS_OPTIONS = ["pending", "pass", "fail"];
// const STATUS_OPTIONS = ["pending", "in_progress", "completed", "failed"];

// /* ─────────────────────────────────────────────
//    Shared primitives
// ───────────────────────────────────────────── */
// const SectionCard = ({ icon: Icon, title, accent = T.amber, children }) => (
//   <CCard
//     style={{
//       background: T.surface,
//       border: `1px solid ${T.border}`,
//       borderRadius: 12,
//       overflow: "hidden",
//       marginBottom: 0,
//     }}
//   >
//     <CCardHeader
//       style={{
//         background: T.surface,
//         borderBottom: `1px solid ${T.border}`,
//         padding: "14px 20px",
//         display: "flex",
//         alignItems: "center",
//         gap: 10,
//       }}
//     >
//       <span
//         style={{
//           width: 32,
//           height: 32,
//           background: `${accent}18`,
//           border: `1px solid ${accent}40`,
//           borderRadius: 8,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           flexShrink: 0,
//         }}
//       >
//         <Icon size={15} color={accent} />
//       </span>
//       <span
//         style={{
//           //   fontFamily: "'DM Sans', sans-serif",
//           fontWeight: 600,
//           fontSize: 13,
//           color: T.textPrimary,
//           letterSpacing: "0.04em",
//           textTransform: "uppercase",
//         }}
//       >
//         {title}
//       </span>
//     </CCardHeader>
//     <CCardBody style={{ padding: "20px" }}>{children}</CCardBody>
//   </CCard>
// );

// const FieldLabel = ({ children }) => (
//   <label
//     style={{
//       display: "block",
//       //   fontFamily: "'DM Sans', sans-serif",
//       fontSize: 11,
//       fontWeight: 600,
//       color: T.textMuted,
//       textTransform: "uppercase",
//       letterSpacing: "0.06em",
//       marginBottom: 6,
//     }}
//   >
//     {children}
//   </label>
// );

// const baseInput = {
//   background: T.input,
//   border: `1px solid ${T.inputBorder}`,
//   borderRadius: 8,
//   color: T.textPrimary,
//   //   fontFamily: "'DM Mono', monospace",
//   fontSize: 13,
//   padding: "9px 12px",
//   width: "100%",
//   outline: "none",
//   transition: "border-color 0.15s",
// };

// const StyledInput = (props) => (
//   <input
//     style={baseInput}
//     onFocus={(e) => (e.target.style.borderColor = T.amber)}
//     onBlur={(e) => (e.target.style.borderColor = T.inputBorder)}
//     {...props}
//   />
// );

// const StyledSelect = ({ children, ...props }) => (
//   <select
//     style={{ ...baseInput, cursor: "pointer" }}
//     onFocus={(e) => (e.target.style.borderColor = T.amber)}
//     onBlur={(e) => (e.target.style.borderColor = T.inputBorder)}
//     {...props}
//   >
//     {children}
//   </select>
// );

// const StyledTextarea = (props) => (
//   <textarea
//     style={{ ...baseInput, resize: "vertical", minHeight: 70 }}
//     onFocus={(e) => (e.target.style.borderColor = T.amber)}
//     onBlur={(e) => (e.target.style.borderColor = T.inputBorder)}
//     {...props}
//   />
// );

// const Toggle = ({ checked, onChange, label }) => (
//   <label
//     style={{
//       display: "flex",
//       alignItems: "center",
//       gap: 10,
//       cursor: "pointer",
//       userSelect: "none",
//     }}
//   >
//     <span
//       onClick={onChange}
//       style={{
//         position: "relative",
//         width: 38,
//         height: 20,
//         background: checked ? T.amber : T.inputBorder,
//         borderRadius: 99,
//         transition: "background 0.2s",
//         flexShrink: 0,
//       }}
//     >
//       <span
//         style={{
//           position: "absolute",
//           top: 3,
//           left: checked ? 20 : 3,
//           width: 14,
//           height: 14,
//           background: "#fff",
//           borderRadius: "50%",
//           transition: "left 0.2s",
//           boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
//         }}
//       />
//     </span>
//     <span
//       style={{
//         // fontFamily: "'DM Sans', sans-serif",
//         fontSize: 13,
//         color: checked ? T.textPrimary : T.textMuted,
//       }}
//     >
//       {label}
//     </span>
//   </label>
// );

// const StatusDot = ({ ok }) => (
//   <span
//     style={{
//       display: "inline-block",
//       width: 7,
//       height: 7,
//       borderRadius: "50%",
//       background: ok ? "#22c55e" : "#ef4444",
//       marginRight: 6,
//       boxShadow: ok ? "0 0 6px #22c55e80" : "0 0 6px #ef444480",
//     }}
//   />
// );

// const ReadonlyField = ({ value }) => (
//   <div
//     style={{
//       background: T.surfaceAlt,
//       border: `1px solid ${T.border}`,
//       borderRadius: 8,
//       padding: "9px 12px",
//       //   fontFamily: "'DM Mono', monospace",
//       fontSize: 12,
//       color: T.textMuted,
//     }}
//   >
//     {value || "—"}
//   </div>
// );

// const optionLabel = (s) =>
//   s.replace(/-|_/g, " ").replace(/^\w/, (c) => c.toUpperCase());

// /* ─────────────────────────────────────────────
//    Main Component
// ───────────────────────────────────────────── */
// const UpdateRobotCommisioningDoc = () => {
//   const { id } = useParams();
//   const authtoken = useSelector((s) => s.authtoken);

//   const [{ doc, loadingDoc, updating }, dispatch] = useReducer(reducer, {
//     docError: "",
//     loadingDoc: false,
//     doc: {},
//     updating: false,
//   });
//   const [form, setForm] = useState(null);

//   /* ── Fetch ── */
//   useEffect(() => {
//     const fetchDoc = async () => {
//       dispatch({ type: "FETCH_REQUEST" });
//       try {
//         const res = await axios.get(`/api/v1/commisioning-docs/${id}`, {
//           // headers: { Authorization: `Bearer ${authtoken}` },
// withCredentials: true,
//         });
//         const data = res.data.data;
//         dispatch({ type: "FETCH_SUCCESS", payload: data });
//         setForm(buildForm(data));
//       } catch (err) {
//         const msg = err.response?.data?.message || err.response?.data?.error;
//         dispatch({ type: "FETCH_FAIL", payload: msg });
//         toast.error(msg);
//       }
//     };
//     fetchDoc();
//   }, [ id]);

//   const buildForm = (d) => ({
//     robot_no: d.robot_no,
//     status: d.status || "pending",
//     block: d.block || "",
//     robot_type: d.robot_type || "Automatic",
//     checklist: JSON.parse(JSON.stringify(d.checklist || {})),
//     summary: JSON.parse(
//       JSON.stringify(
//         d.summary || {
//           overall_status: "pending",
//           issues: [],
//           recommendation: "",
//         },
//       ),
//     ),
//   });

//   /* ── Deep-path setter for checklist ── */
//   const setChecklist = (path, value) =>
//     setForm((prev) => {
//       const next = JSON.parse(JSON.stringify(prev));
//       let ref = next.checklist;
//       const keys = path.split(".");
//       keys.slice(0, -1).forEach((k) => (ref = ref[k]));
//       ref[keys[keys.length - 1]] = value;
//       return next;
//     });

//   const setSummary = (key, value) =>
//     setForm((prev) => ({
//       ...prev,
//       summary: { ...prev.summary, [key]: value },
//     }));

//   /* ── Submit ── */
//   const handleSubmit = async () => {
//     dispatch({ type: "UPDATE_REQUEST" });
//     try {
//       await axios.put(`/api/v1/commisioning-docs/${id}`, form, {
//         // headers: { Authorization: `Bearer ${authtoken}` },
// withCredentials: true,
//       });
//       dispatch({ type: "UPDATE_SUCCESS" });
//       toast.success("Commissioning doc updated successfully!");
//     } catch (err) {
//       const msg = err.response?.data?.message || err.response?.data?.error;
//       dispatch({ type: "UPDATE_FAIL" });
//       toast.error(msg);
//     }
//   };

//   /* ── Loading state ── */
//   if (loadingDoc)
//     return (
//       <div
//         style={{
//           minHeight: "60vh",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           flexDirection: "column",
//           gap: 14,
//           color: T.textMuted,
//         }}
//       >
//         <CSpinner style={{ color: T.amber, width: 36, height: 36 }} />
//         <p
//           style={{
//             //  fontFamily: "'DM Sans', sans-serif",
//             margin: 0,
//           }}
//         >
//           Loading commissioning document…
//         </p>
//       </div>
//     );

//   if (!form) return null;

//   const cl = form.checklist;
//   const su = form.summary;

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
//         * { box-sizing: border-box; }
//         select option { background: #1e293b; color: #e2e8f0; }
//       `}</style>

//       <div
//         style={{ background: T.bg, minHeight: "100vh", padding: "8px 0 40px" }}
//       >
//         {/* ── Page Header ── */}
//         <div
//           style={{
//             padding: "0 4px 24px",
//             display: "flex",
//             alignItems: "flex-start",
//             justifyContent: "space-between",
//             flexWrap: "wrap",
//             gap: 16,
//           }}
//         >
//           <div>
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 8,
//                 marginBottom: 4,
//                 color: "#475569",
//                 // fontFamily: "'DM Sans', sans-serif",
//                 fontSize: 12,
//               }}
//             >
//               {/* <span>Commissioning Docs</span>
//               <ChevronRight size={12} /> */}
//             </div>
//             <div className="d-flex">
//               <span className="me-2" style={{ color: T.amber }}>
//                 Update
//               </span>{" "}
//               -{" "}
//               <h1
//                 className="ms-2"
//                 style={{
//                   //   fontFamily: "'DM Mono', monospace",
//                   fontSize: 22,
//                   fontWeight: 500,
//                   color: "#f1f5f9",
//                   margin: 0,
//                   letterSpacing: "-0.02em",
//                 }}
//               >
//                 {doc.robot_no || "—"}
//               </h1>
//             </div>
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 12,
//                 marginTop: 6,
//                 flexWrap: "wrap",
//               }}
//             >
//               <span
//                 style={{
//                   //   fontFamily: "'DM Sans', sans-serif",
//                   fontSize: 12,
//                   color: T.textMuted,
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 4,
//                 }}
//               >
//                 <MapPin size={11} />
//                 {doc.site_location}
//               </span>
//               <span
//                 style={{
//                   //   fontFamily: "'DM Sans', sans-serif",
//                   fontSize: 12,
//                   color: T.textMuted,
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 4,
//                 }}
//               >
//                 <Building2 size={11} />
//                 {doc.client_name}
//               </span>
//               <span
//                 style={{
//                   background:
//                     doc.status === "pending"
//                       ? "#92400e30"
//                       : doc.status === "completed"
//                         ? "#14532d30"
//                         : "#1e3a5f30",
//                   color:
//                     doc.status === "pending"
//                       ? "#fbbf24"
//                       : doc.status === "completed"
//                         ? "#4ade80"
//                         : "#60a5fa",
//                   border: `1px solid ${doc.status === "pending" ? "#f59e0b40" : doc.status === "completed" ? "#22c55e40" : "#3b82f640"}`,
//                   borderRadius: 99,
//                   padding: "2px 10px",
//                   fontSize: 11,
//                   //   fontFamily: "'DM Sans', sans-serif",
//                   fontWeight: 600,
//                 }}
//               >
//                 <StatusDot ok={doc.status === "completed"} />
//                 {optionLabel(doc.status || "pending")}
//               </span>
//             </div>
//           </div>

//           <button
//             onClick={handleSubmit}
//             disabled={updating}
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: 8,
//               background: updating ? "#92400e" : T.amber,
//               color: "#0f172a",
//               border: "none",
//               borderRadius: 10,
//               padding: "11px 22px",
//               //   fontFamily: "'DM Sans', sans-serif",
//               fontWeight: 700,
//               fontSize: 13,
//               cursor: updating ? "not-allowed" : "pointer",
//               boxShadow: "0 0 20px #f59e0b30",
//               transition: "opacity 0.15s",
//             }}
//           >
//             {updating ? (
//               <CSpinner size="sm" style={{ color: "#0f172a" }} />
//             ) : (
//               <Save size={15} />
//             )}
//             {updating ? "Saving…" : "Save Changes"}
//           </button>
//         </div>

//         <CRow className="g-3">
//           {/* ══════════════════════════════════
//               LEFT COLUMN
//           ══════════════════════════════════ */}
//           <CCol xs={12} lg={4}>
//             <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
//               {/* Robot Details */}
//               <SectionCard icon={Bot} title="Robot Details" accent={T.amber}>
//                 <div
//                   style={{ display: "flex", flexDirection: "column", gap: 14 }}
//                 >
//                   <div>
//                     <FieldLabel>Robot Number</FieldLabel>
//                     <ReadonlyField value={doc.robot_no} />
//                   </div>
//                   <div>
//                     <FieldLabel>Robot Type</FieldLabel>
//                     {/* <StyledSelect
//                       value={form.robot_type}
//                       onChange={(e) =>
//                         setForm((p) => ({ ...p, robot_type: e.target.value }))
//                       }
//                     >
//                       {["Automatic", "Manual", "Semi-Automatic"].map((o) => (
//                         <option key={o} value={o}>
//                           {o}
//                         </option>
//                       ))}
//                     </StyledSelect> */}
//                     <ReadonlyField value={doc.robot_type} />
//                   </div>
//                   <div>
//                     <FieldLabel>Block</FieldLabel>
//                     <StyledInput
//                       value={form.block}
//                       onChange={(e) =>
//                         setForm((p) => ({ ...p, block: e.target.value }))
//                       }
//                       placeholder="e.g. Block-1"
//                     />
//                   </div>
//                   <div>
//                     <FieldLabel>Status</FieldLabel>
//                     <StyledSelect
//                       value={form.status}
//                       onChange={(e) =>
//                         setForm((p) => ({ ...p, status: e.target.value }))
//                       }
//                     >
//                       {STATUS_OPTIONS.map((o) => (
//                         <option key={o} value={o}>
//                           {optionLabel(o)}
//                         </option>
//                       ))}
//                     </StyledSelect>
//                   </div>
//                 </div>
//               </SectionCard>

//               {/* Site Info — read-only */}
//               <SectionCard
//                 icon={MapPin}
//                 title="Site Information"
//                 accent="#38bdf8"
//               >
//                 <div
//                   style={{ display: "flex", flexDirection: "column", gap: 12 }}
//                 >
//                   {[
//                     { label: "Site ID", value: doc.site_id },
//                     { label: "Client ID", value: doc.client_id },
//                     { label: "Client Name", value: doc.client_name },
//                     { label: "Location", value: doc.site_location },
//                   ].map(({ label, value }) => (
//                     <div key={label}>
//                       <FieldLabel>{label}</FieldLabel>
//                       <ReadonlyField value={value} />
//                     </div>
//                   ))}
//                 </div>
//               </SectionCard>

//               {/* Summary */}
//               <SectionCard
//                 icon={ClipboardCheck}
//                 title="Summary"
//                 accent="#a78bfa"
//               >
//                 <div
//                   style={{ display: "flex", flexDirection: "column", gap: 14 }}
//                 >
//                   <div>
//                     <FieldLabel>Overall Status</FieldLabel>
//                     <StyledSelect
//                       value={su.overall_status}
//                       onChange={(e) =>
//                         setSummary("overall_status", e.target.value)
//                       }
//                     >
//                       {OVERALL_STATUS_OPTIONS.map((o) => (
//                         <option key={o} value={o}>
//                           {optionLabel(o)}
//                         </option>
//                       ))}
//                     </StyledSelect>
//                   </div>
//                   <div>
//                     <FieldLabel>Issues</FieldLabel>
//                     <StyledTextarea
//                       value={(su.issues || []).join(", ")}
//                       onChange={(e) =>
//                         setSummary(
//                           "issues",
//                           e.target.value
//                             .split(",")
//                             .map((s) => s.trim())
//                             .filter(Boolean),
//                         )
//                       }
//                       placeholder="Comma-separated issues…"
//                       // style={{ minHeight: 54 }}
//                     />
//                   </div>
//                   <div>
//                     <FieldLabel>Recommendation</FieldLabel>
//                     <StyledTextarea
//                       value={su.recommendation || ""}
//                       onChange={(e) =>
//                         setSummary("recommendation", e.target.value)
//                       }
//                       placeholder="Add recommendation…"
//                       // style={{ minHeight: 54 }}
//                     />
//                   </div>
//                 </div>
//               </SectionCard>
//             </div>
//           </CCol>

//           {/* ══════════════════════════════════
//               RIGHT COLUMN — Checklist
//           ══════════════════════════════════ */}
//           <CCol xs={12} lg={8}>
//             <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
//               {/* ── Power On ── */}
//               <SectionCard icon={Zap} title="Power On" accent="#facc15">
//                 <CRow className="g-3">
//                   <CCol xs={12}>
//                     <Toggle
//                       checked={cl.power_on?.status}
//                       onChange={() =>
//                         setChecklist("power_on.status", !cl.power_on?.status)
//                       }
//                       label="Power On Status"
//                     />
//                   </CCol>
//                   <CCol xs={12}>
//                     <FieldLabel>Remarks</FieldLabel>
//                     <StyledTextarea
//                       value={cl.power_on?.remarks || ""}
//                       onChange={(e) =>
//                         setChecklist("power_on.remarks", e.target.value)
//                       }
//                       placeholder="Enter remarks…"
//                     />
//                   </CCol>
//                 </CRow>
//               </SectionCard>

//               {/* ── Portal Connectivity ── */}
//               <SectionCard
//                 icon={Wifi}
//                 title="Portal Connectivity"
//                 accent="#34d399"
//               >
//                 <CRow className="g-3">
//                   <CCol xs={12} sm={6}>
//                     <Toggle
//                       checked={cl.portal_connectivity?.is_online}
//                       onChange={() =>
//                         setChecklist(
//                           "portal_connectivity.is_online",
//                           !cl.portal_connectivity?.is_online,
//                         )
//                       }
//                       label="Online"
//                     />
//                   </CCol>
//                   <CCol xs={12} sm={6}>
//                     <FieldLabel>Signal Strength</FieldLabel>
//                     <StyledSelect
//                       value={cl.portal_connectivity?.signal_strength || ""}
//                       onChange={(e) =>
//                         setChecklist(
//                           "portal_connectivity.signal_strength",
//                           e.target.value,
//                         )
//                       }
//                     >
//                       <option value="">— Select —</option>
//                       {SIGNAL_OPTIONS.map((o) => (
//                         <option key={o} value={o}>
//                           {optionLabel(o)}
//                         </option>
//                       ))}
//                     </StyledSelect>
//                   </CCol>
//                   <CCol xs={12}>
//                     <FieldLabel>Remarks</FieldLabel>
//                     <StyledTextarea
//                       value={cl.portal_connectivity?.remarks || ""}
//                       onChange={(e) =>
//                         setChecklist(
//                           "portal_connectivity.remarks",
//                           e.target.value,
//                         )
//                       }
//                       placeholder="Enter remarks…"
//                     />
//                   </CCol>
//                 </CRow>
//               </SectionCard>

//               {/* ── Movement Test ── */}
//               <SectionCard
//                 icon={ArrowLeftRight}
//                 title="Movement Test"
//                 accent="#a78bfa"
//               >
//                 <CRow className="g-3">
//                   <CCol xs={12} sm={4}>
//                     <Toggle
//                       checked={cl.movement_test?.started}
//                       onChange={() =>
//                         setChecklist(
//                           "movement_test.started",
//                           !cl.movement_test?.started,
//                         )
//                       }
//                       label="Test Started"
//                     />
//                   </CCol>
//                   <CCol xs={6} sm={4}>
//                     <Toggle
//                       checked={cl.movement_test?.direction_check?.forward}
//                       onChange={() =>
//                         setChecklist(
//                           "movement_test.direction_check.forward",
//                           !cl.movement_test?.direction_check?.forward,
//                         )
//                       }
//                       label="Forward ✓"
//                     />
//                   </CCol>
//                   <CCol xs={6} sm={4}>
//                     <Toggle
//                       checked={cl.movement_test?.direction_check?.reverse}
//                       onChange={() =>
//                         setChecklist(
//                           "movement_test.direction_check.reverse",
//                           !cl.movement_test?.direction_check?.reverse,
//                         )
//                       }
//                       label="Reverse ✓"
//                     />
//                   </CCol>
//                   <CCol xs={12}>
//                     <FieldLabel>Remarks</FieldLabel>
//                     <StyledTextarea
//                       value={cl.movement_test?.remarks || ""}
//                       onChange={(e) =>
//                         setChecklist("movement_test.remarks", e.target.value)
//                       }
//                       placeholder="Enter remarks…"
//                     />
//                   </CCol>
//                 </CRow>
//               </SectionCard>

//               {/* ── Speed & Alignment ── */}
//               <SectionCard
//                 icon={Gauge}
//                 title="Speed & Alignment"
//                 accent="#fb923c"
//               >
//                 <CRow className="g-3">
//                   <CCol xs={6} sm={3}>
//                     <Toggle
//                       checked={cl.speed_and_alignment?.speed_ok}
//                       onChange={() =>
//                         setChecklist(
//                           "speed_and_alignment.speed_ok",
//                           !cl.speed_and_alignment?.speed_ok,
//                         )
//                       }
//                       label="Speed OK"
//                     />
//                   </CCol>
//                   <CCol xs={6} sm={3}>
//                     <Toggle
//                       checked={cl.speed_and_alignment?.alignment_ok}
//                       onChange={() =>
//                         setChecklist(
//                           "speed_and_alignment.alignment_ok",
//                           !cl.speed_and_alignment?.alignment_ok,
//                         )
//                       }
//                       label="Alignment OK"
//                     />
//                   </CCol>
//                   <CCol xs={12} sm={6}>
//                     <FieldLabel>Deviation</FieldLabel>
//                     <StyledSelect
//                       value={cl.speed_and_alignment?.deviation || "none"}
//                       onChange={(e) =>
//                         setChecklist(
//                           "speed_and_alignment.deviation",
//                           e.target.value,
//                         )
//                       }
//                     >
//                       {DEVIATION_OPTIONS.map((o) => (
//                         <option key={o} value={o}>
//                           {optionLabel(o)}
//                         </option>
//                       ))}
//                     </StyledSelect>
//                   </CCol>
//                   <CCol xs={12}>
//                     <FieldLabel>Remarks</FieldLabel>
//                     <StyledTextarea
//                       value={cl.speed_and_alignment?.remarks || ""}
//                       onChange={(e) =>
//                         setChecklist(
//                           "speed_and_alignment.remarks",
//                           e.target.value,
//                         )
//                       }
//                       placeholder="Enter remarks…"
//                     />
//                   </CCol>
//                 </CRow>
//               </SectionCard>

//               {/* ── Cleaning Test ── */}
//               <SectionCard icon={Brush} title="Cleaning Test" accent="#22d3ee">
//                 <CRow className="g-3">
//                   <CCol xs={12} sm={5}>
//                     <Toggle
//                       checked={cl.cleaning_test?.brush_rotation}
//                       onChange={() =>
//                         setChecklist(
//                           "cleaning_test.brush_rotation",
//                           !cl.cleaning_test?.brush_rotation,
//                         )
//                       }
//                       label="Brush Rotation OK"
//                     />
//                   </CCol>
//                   <CCol xs={12} sm={4}>
//                     <FieldLabel>Cleaning Efficiency</FieldLabel>
//                     <StyledSelect
//                       value={
//                         cl.cleaning_test?.cleaning_efficiency || "not-checked"
//                       }
//                       onChange={(e) =>
//                         setChecklist(
//                           "cleaning_test.cleaning_efficiency",
//                           e.target.value,
//                         )
//                       }
//                     >
//                       {CLEAN_EFF_OPTIONS.map((o) => (
//                         <option key={o} value={o}>
//                           {optionLabel(o)}
//                         </option>
//                       ))}
//                     </StyledSelect>
//                   </CCol>
//                   <CCol xs={12} sm={3}>
//                     <FieldLabel>Remarks</FieldLabel>
//                     <StyledTextarea
//                       value={cl.cleaning_test?.remarks || ""}
//                       onChange={(e) =>
//                         setChecklist("cleaning_test.remarks", e.target.value)
//                       }
//                       placeholder="Remarks…"
//                       style={{ minHeight: 42 }}
//                     />
//                   </CCol>
//                 </CRow>
//               </SectionCard>

//               {/* ── Physical Inspection ── */}
//               <SectionCard
//                 icon={Eye}
//                 title="Physical Inspection"
//                 accent="#e879f9"
//               >
//                 <CRow className="g-3">
//                   {["wheels", "brushes", "pipes", "sensors", "frame"].map(
//                     (part) => (
//                       <CCol xs={6} sm={4} key={part}>
//                         <FieldLabel>{optionLabel(part)}</FieldLabel>
//                         {/* Schema enum: not-checked | good | worn | damaged */}
//                         <StyledSelect
//                           value={
//                             cl.physical_inspection?.[part] || "not-checked"
//                           }
//                           onChange={(e) =>
//                             setChecklist(
//                               `physical_inspection.${part}`,
//                               e.target.value,
//                             )
//                           }
//                         >
//                           {PART_STATUS_OPTIONS.map((o) => (
//                             <option key={o} value={o}>
//                               {optionLabel(o)}
//                             </option>
//                           ))}
//                         </StyledSelect>
//                       </CCol>
//                     ),
//                   )}
//                   <CCol xs={12}>
//                     <FieldLabel>Issues Found</FieldLabel>
//                     <StyledTextarea
//                       value={(cl.physical_inspection?.issues_found || []).join(
//                         ", ",
//                       )}
//                       onChange={(e) =>
//                         setChecklist(
//                           "physical_inspection.issues_found",
//                           e.target.value
//                             .split(",")
//                             .map((s) => s.trim())
//                             .filter(Boolean),
//                         )
//                       }
//                       placeholder="Comma-separated list of issues…"
//                       // style={{ minHeight: 54 }}
//                     />
//                   </CCol>
//                 </CRow>
//               </SectionCard>

//               {/* ── Safety Checks ── */}
//               <SectionCard
//                 icon={ShieldCheck}
//                 title="Safety Checks"
//                 accent="#4ade80"
//               >
//                 <CRow className="g-3">
//                   <CCol xs={12} sm={4}>
//                     <Toggle
//                       checked={cl.safety_checks?.emergency_switch}
//                       onChange={() =>
//                         setChecklist(
//                           "safety_checks.emergency_switch",
//                           !cl.safety_checks?.emergency_switch,
//                         )
//                       }
//                       label="Emergency Switch"
//                     />
//                   </CCol>
//                   <CCol xs={12} sm={4}>
//                     <Toggle
//                       checked={cl.safety_checks?.obstacle_detection}
//                       onChange={() =>
//                         setChecklist(
//                           "safety_checks.obstacle_detection",
//                           !cl.safety_checks?.obstacle_detection,
//                         )
//                       }
//                       label="Obstacle Detection"
//                     />
//                   </CCol>
//                   <CCol xs={12} sm={4}>
//                     <Toggle
//                       checked={cl.safety_checks?.auto_stop}
//                       onChange={() =>
//                         setChecklist(
//                           "safety_checks.auto_stop",
//                           !cl.safety_checks?.auto_stop,
//                         )
//                       }
//                       label="Auto Stop"
//                     />
//                   </CCol>
//                   <CCol xs={12}>
//                     <FieldLabel>Remarks</FieldLabel>
//                     <StyledTextarea
//                       value={cl.safety_checks?.remarks || ""}
//                       onChange={(e) =>
//                         setChecklist("safety_checks.remarks", e.target.value)
//                       }
//                       placeholder="Enter remarks…"
//                     />
//                   </CCol>
//                 </CRow>
//               </SectionCard>
//             </div>
//           </CCol>

//           {/* ── Last Activity ── */}
//           {doc.last_activity && (
//             <CCol xs={12}>
//               <LastActivity lastactivity={doc.last_activity} />
//             </CCol>
//           )}
//         </CRow>
//       </div>
//     </>
//   );
// };

// export default UpdateRobotCommisioningDoc;

import React, { useEffect, useReducer, useState, useRef } from "react";
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CSpinner,
  CButton,
} from "@coreui/react";
import {
  Zap,
  Wifi,
  ArrowLeftRight,
  Gauge,
  Brush,
  Eye,
  ShieldCheck,
  Bot,
  MapPin,
  Building2,
  Save,
  ChevronRight,
  ClipboardCheck,
} from "lucide-react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import LastActivity from "../../components/LastActivity";
import LoadingSpinner from "../../components/LoadingSpinner";

/* ─────────────────────────────────────────────
   Reducer
───────────────────────────────────────────── */
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loadingDoc: true, docError: "" };
    case "FETCH_SUCCESS":
      return { ...state, loadingDoc: false, doc: action.payload };
    case "FETCH_FAIL":
      return { ...state, loadingDoc: false, docError: action.payload };
    case "UPDATE_REQUEST":
      return { ...state, updating: true };
    case "UPDATE_SUCCESS":
      return { ...state, updating: false };
    case "UPDATE_FAIL":
      return { ...state, updating: false };
    default:
      return state;
  }
};

/* ─────────────────────────────────────────────
   Design tokens
───────────────────────────────────────────── */
const T = {
  bg: "#020817",
  surface: "#0f172a",
  surfaceAlt: "#0a111e",
  border: "#1e293b",
  input: "#1e293b",
  inputBorder: "#334155",
  textPrimary: "#e2e8f0",
  textMuted: "#64748b",
  amber: "#f59e0b",
};

/* ─────────────────────────────────────────────
   Enum sets — kept in sync with Mongoose schema
───────────────────────────────────────────── */
const PART_STATUS_OPTIONS = ["not-checked", "good", "worn", "damaged"];
const SIGNAL_OPTIONS = ["poor", "average", "good"];
const CLEAN_EFF_OPTIONS = ["not-checked", "poor", "average", "good"];
const DEVIATION_OPTIONS = ["none", "low", "medium", "high"];
const OVERALL_STATUS_OPTIONS = ["pending", "pass", "fail"];
const STATUS_OPTIONS = ["pending", "in_progress", "completed", "failed"];
/* ─────────────────────────────────────────────
   Shared primitives
───────────────────────────────────────────── */
const SectionCard = ({ icon: Icon, title, accent = T.amber, children }) => (
  <CCard
    style={{
      background: T.surface,
      border: `1px solid ${T.border}`,
      borderRadius: 12,
      overflow: "hidden",
      marginBottom: 0,
    }}
  >
    <CCardHeader
      style={{
        background: T.surface,
        borderBottom: `1px solid ${T.border}`,
        padding: "14px 20px",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <span
        style={{
          width: 32,
          height: 32,
          background: `${accent}18`,
          border: `1px solid ${accent}40`,
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={15} color={accent} />
      </span>
      <span
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 600,
          fontSize: 13,
          color: T.textPrimary,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        }}
      >
        {title}
      </span>
    </CCardHeader>
    <CCardBody style={{ padding: "20px" }}>{children}</CCardBody>
  </CCard>
);

const FieldLabel = ({ children }) => (
  <label
    style={{
      display: "block",
      fontFamily: "'DM Sans', sans-serif",
      fontSize: 11,
      fontWeight: 600,
      color: T.textMuted,
      textTransform: "uppercase",
      letterSpacing: "0.06em",
      marginBottom: 6,
    }}
  >
    {children}
  </label>
);

const baseInput = {
  background: T.input,
  border: `1px solid ${T.inputBorder}`,
  borderRadius: 8,
  color: T.textPrimary,
  fontFamily: "'DM Mono', monospace",
  fontSize: 13,
  padding: "9px 12px",
  width: "100%",
  outline: "none",
  transition: "border-color 0.15s",
};

const StyledInput = (props) => (
  <input
    style={baseInput}
    onFocus={(e) => (e.target.style.borderColor = T.amber)}
    onBlur={(e) => (e.target.style.borderColor = T.inputBorder)}
    {...props}
  />
);

const StyledSelect = ({ children, ...props }) => (
  <select
    style={{ ...baseInput, cursor: "pointer" }}
    onFocus={(e) => (e.target.style.borderColor = T.amber)}
    onBlur={(e) => (e.target.style.borderColor = T.inputBorder)}
    {...props}
  >
    {children}
  </select>
);

const StyledTextarea = (props) => (
  <textarea
    style={{ ...baseInput, resize: "vertical", minHeight: 70 }}
    onFocus={(e) => (e.target.style.borderColor = T.amber)}
    onBlur={(e) => (e.target.style.borderColor = T.inputBorder)}
    {...props}
  />
);

const Toggle = ({ checked, onChange, label }) => (
  <label
    style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      cursor: "pointer",
      userSelect: "none",
    }}
  >
    <span
      onClick={onChange}
      style={{
        position: "relative",
        width: 38,
        height: 20,
        background: checked ? T.amber : T.inputBorder,
        borderRadius: 99,
        transition: "background 0.2s",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 3,
          left: checked ? 20 : 3,
          width: 14,
          height: 14,
          background: "#fff",
          borderRadius: "50%",
          transition: "left 0.2s",
          boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
        }}
      />
    </span>
    <span
      style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 13,
        color: checked ? T.textPrimary : T.textMuted,
      }}
    >
      {label}
    </span>
  </label>
);

const StatusDot = ({ ok }) => (
  <span
    style={{
      display: "inline-block",
      width: 7,
      height: 7,
      borderRadius: "50%",
      background: ok ? "#22c55e" : "#ef4444",
      marginRight: 6,
      boxShadow: ok ? "0 0 6px #22c55e80" : "0 0 6px #ef444480",
    }}
  />
);

const ReadonlyField = ({ value }) => (
  <div
    style={{
      background: T.surfaceAlt,
      border: `1px solid ${T.border}`,
      borderRadius: 8,
      padding: "9px 12px",
      fontFamily: "'DM Mono', monospace",
      fontSize: 12,
      color: T.textMuted,
    }}
  >
    {value || "—"}
  </div>
);

const optionLabel = (s) =>
  s.replace(/-|_/g, " ").replace(/^\w/, (c) => c.toUpperCase());

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
const UpdateRobotCommisioningDoc = () => {
  const { id } = useParams();
  const authtoken = useSelector((s) => s.authtoken);
  const userInfo = useSelector((s) => s.userInfo);
  const navigate = useNavigate();
  const [{ doc, loadingDoc, updating }, dispatch] = useReducer(reducer, {
    docError: "",
    loadingDoc: false,
    doc: {},
    updating: false,
  });
  const [form, setForm] = useState(null);
  // ✅ ADD HERE
  const [commandButton, setCommandButton] = useState(null);

  let start = "11";
  let stop = "14";
  let returntodock = "15";

  // Raw string buffers so commas can be typed freely; converted to array only on blur
  const [summaryIssuesRaw, setSummaryIssuesRaw] = useState("");
  const [inspectionIssuesRaw, setInspectionIssuesRaw] = useState("");

  /* ── Fetch ── */
  useEffect(() => {
    const fetchDoc = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const res = await axios.get(`/api/v1/commisioning-docs/${id}`, {
          // headers: { Authorization: `Bearer ${authtoken}` },
          withCredentials: true,
        });
        const data = res.data.data;
        dispatch({ type: "FETCH_SUCCESS", payload: data });
        setForm(buildForm(data));
        setSummaryIssuesRaw((data.summary?.issues || []).join(", "));
        setInspectionIssuesRaw(
          (data.checklist?.physical_inspection?.issues_found || []).join(", "),
        );
      } catch (err) {
        const msg = err.response?.data?.message || err.response?.data?.error;
        dispatch({ type: "FETCH_FAIL", payload: msg });
        toast.error(msg);
      }
    };
    fetchDoc();
  }, [id]);

  const sendsingleDownlink = async (command, index) => {
    setCommandButton(index);

    try {
      const data = await axios.post(
        "/api/v1/robots/send-mqtt-downlink",
        {
          deveui: doc.deveui,
          robot_no: doc.robot_no,
          site_id: doc.site_id,
          payload: command,
          lora_no: doc.lora_no,
        },
        {
          // headers: { Authorization: `Bearer ${authtoken}` },
          withCredentials: true,
        },
      );
      dispatch({ type: "SEND_DOWNLINK_SUCCESS" });
      toast.success(data.data.message);
    } catch (error) {
      dispatch({
        type: "SEND_DOWNLINK_FAIL",
        payload: error.response?.data?.message || error.response.data.error,
      });

      toast.error(error.response.data.message || error.response.data.error);
    }
    // setLoadingRow(null);
    setCommandButton(null);
  };

  const buildForm = (d) => ({
    status: d.status || "pending",
    checklist: JSON.parse(JSON.stringify(d.checklist || {})),
    summary: JSON.parse(
      JSON.stringify(
        d.summary || {
          overall_status: "pending",
          issues: [],
          recommendation: "",
        },
      ),
    ),
  });

  let adminroute = "";

  if (userInfo?.role === "Master Admin") {
    adminroute = "master-admin";
  } else if (userInfo?.role === "Service Admin") {
    adminroute = "service-admin";
  } else if (userInfo?.role === "Project Admin") {
    adminroute = "project-admin";
  } else if (userInfo?.role === "Client Admin") {
    adminroute = "client-admin";
  } else if (userInfo?.role === "Site Incharge") {
    adminroute = "site-incharge";
  } else if (userInfo?.role === "Site Technician") {
    adminroute = "site-technician";
  } else if (userInfo?.role === "Client Site Technician") {
    adminroute = "client-site-technician";
  } else if (userInfo?.role === "Master User") {
    adminroute = "master-user";
  } else if (userInfo?.role === "Service User") {
    adminroute = "service-user";
  } else if (userInfo?.role === "Project User") {
    adminroute = "project-user";
  } else if (userInfo?.role === "Factory Admin") {
    adminroute = "factory-admin";
  }

  /* ── Deep-path setter for checklist ── */
  const setChecklist = (path, value) =>
    setForm((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      let ref = next.checklist;
      const keys = path.split(".");
      keys.slice(0, -1).forEach((k) => (ref = ref[k]));
      ref[keys[keys.length - 1]] = value;
      return next;
    });

  const setSummary = (key, value) =>
    setForm((prev) => ({
      ...prev,
      summary: { ...prev.summary, [key]: value },
    }));

  /* ── Submit ── */
  const handleSubmit = async () => {
    dispatch({ type: "UPDATE_REQUEST" });
    try {
      await axios.put(`/api/v1/commisioning-docs/${id}`, form, {
        // headers: { Authorization: `Bearer ${authtoken}` },
        withCredentials: true,
      });
      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success("Commissioning doc updated successfully!");
      navigate(
        `/${adminroute}/commissioning/view-robot-commisioning-doc/${id}`,
      );
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error;
      dispatch({ type: "UPDATE_FAIL" });
      toast.error(msg);
    }
  };

  /* ── Loading state ── */
  if (loadingDoc)
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 14,
          color: T.textMuted,
        }}
      >
        <CSpinner style={{ color: T.amber, width: 36, height: 36 }} />
        <p style={{ fontFamily: "'DM Sans', sans-serif", margin: 0 }}>
          Loading commissioning document…
        </p>
      </div>
    );

  if (!form) return null;

  const cl = form.checklist;
  const su = form.summary;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        select option { background: #1e293b; color: #e2e8f0; }
      `}</style>

      <div
        style={{ background: T.bg, minHeight: "100vh", padding: "8px 0 40px" }}
      >
        {/* ── Page Header ── */}
        <div
          style={{
            padding: "0 4px 24px",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 4,
                color: "#475569",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12,
              }}
            >
              <span>Commissioning Docs</span>
              <ChevronRight size={12} />
              <span style={{ color: T.amber }}>Update</span>
            </div>
            <h1
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 22,
                fontWeight: 500,
                color: "#f1f5f9",
                margin: 0,
                letterSpacing: "-0.02em",
              }}
            >
              {doc.robot_no || "—"}
            </h1>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginTop: 6,
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 12,
                  color: T.textMuted,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <MapPin size={11} />
                {doc.site_location}
              </span>
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 12,
                  color: T.textMuted,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <Building2 size={11} />
                {doc.client_name}
              </span>
              <span
                style={{
                  background:
                    doc.status === "pending"
                      ? "#92400e30"
                      : doc.status === "completed"
                        ? "#14532d30"
                        : "#1e3a5f30",
                  color:
                    doc.status === "pending"
                      ? "#fbbf24"
                      : doc.status === "completed"
                        ? "#4ade80"
                        : "#60a5fa",
                  border: `1px solid ${doc.status === "pending" ? "#f59e0b40" : doc.status === "completed" ? "#22c55e40" : "#3b82f640"}`,
                  borderRadius: 99,
                  padding: "2px 10px",
                  fontSize: 11,
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600,
                }}
              >
                <StatusDot ok={doc.status === "completed"} />
                {optionLabel(doc.status || "pending")}
              </span>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={updating}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: updating ? "#92400e" : T.amber,
              color: "#0f172a",
              border: "none",
              borderRadius: 10,
              padding: "11px 22px",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700,
              fontSize: 13,
              cursor: updating ? "not-allowed" : "pointer",
              boxShadow: "0 0 20px #f59e0b30",
              transition: "opacity 0.15s",
            }}
          >
            {updating ? (
              <CSpinner size="sm" style={{ color: "#0f172a" }} />
            ) : (
              <Save size={15} />
            )}
            {updating ? "Saving…" : "Save Changes"}
          </button>
        </div>

        <CRow className="g-3">
          {/* ══════════════════════════════════
              LEFT COLUMN
          ══════════════════════════════════ */}
          <CCol xs={12} lg={4}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {/* Robot Details */}
              <SectionCard icon={Bot} title="Robot Details" accent={T.amber}>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 14 }}
                >
                  <div>
                    <FieldLabel>Robot Number</FieldLabel>
                    <ReadonlyField value={doc.robot_no} />
                  </div>
                  <div>
                    <FieldLabel>Robot Type</FieldLabel>
                    <ReadonlyField value={doc.robot_type} />
                  </div>
                  <div>
                    <FieldLabel>Block</FieldLabel>
                    <ReadonlyField value={doc.block} />
                  </div>
                  <div>
                    <FieldLabel>Status</FieldLabel>
                    <StyledSelect
                      value={form.status}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, status: e.target.value }))
                      }
                    >
                      {STATUS_OPTIONS.map((o) => (
                        <option key={o} value={o}>
                          {optionLabel(o)}
                        </option>
                      ))}
                    </StyledSelect>
                  </div>
                </div>
              </SectionCard>

              {/* Site Info — read-only */}
              <SectionCard
                icon={MapPin}
                title="Site Information"
                accent="#38bdf8"
              >
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 12 }}
                >
                  {[
                    { label: "Site ID", value: doc.site_id },
                    { label: "Client ID", value: doc.client_id },
                    { label: "Client Name", value: doc.client_name },
                    { label: "Location", value: doc.site_location },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <FieldLabel>{label}</FieldLabel>
                      <ReadonlyField value={value} />
                    </div>
                  ))}
                </div>
              </SectionCard>
            </div>
          </CCol>

          {/* ══════════════════════════════════
              RIGHT COLUMN — Checklist
          ══════════════════════════════════ */}
          <CCol xs={12} lg={8}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {/* ── Power On ── */}
              <SectionCard icon={Zap} title="Power On" accent="#facc15">
                <CRow className="g-3">
                  <CCol xs={12}>
                    <Toggle
                      checked={cl.power_on?.status}
                      onChange={() =>
                        setChecklist("power_on.status", !cl.power_on?.status)
                      }
                      label="Power On Status"
                    />
                  </CCol>
                  <CCol xs={12}>
                    <FieldLabel>Remarks</FieldLabel>
                    <StyledTextarea
                      value={cl.power_on?.remarks || ""}
                      onChange={(e) =>
                        setChecklist("power_on.remarks", e.target.value)
                      }
                      placeholder="Enter remarks…"
                    />
                  </CCol>
                </CRow>
              </SectionCard>

              {/* ── Portal Connectivity ── */}
              <SectionCard
                icon={Wifi}
                title="Portal Connectivity"
                accent="#34d399"
              >
                <CRow className="g-3">
                  <CCol xs={12} sm={6}>
                    <Toggle
                      checked={cl.portal_connectivity?.is_online}
                      onChange={() =>
                        setChecklist(
                          "portal_connectivity.is_online",
                          !cl.portal_connectivity?.is_online,
                        )
                      }
                      label="Online"
                    />
                  </CCol>
                  <CCol xs={12} sm={6}>
                    <FieldLabel>Signal Strength</FieldLabel>
                    <StyledSelect
                      value={cl.portal_connectivity?.signal_strength || ""}
                      onChange={(e) =>
                        setChecklist(
                          "portal_connectivity.signal_strength",
                          e.target.value,
                        )
                      }
                    >
                      <option value="">— Select —</option>
                      {SIGNAL_OPTIONS.map((o) => (
                        <option key={o} value={o}>
                          {optionLabel(o)}
                        </option>
                      ))}
                    </StyledSelect>
                  </CCol>
                  <CCol xs={12}>
                    <FieldLabel>Remarks</FieldLabel>
                    <StyledTextarea
                      value={cl.portal_connectivity?.remarks || ""}
                      onChange={(e) =>
                        setChecklist(
                          "portal_connectivity.remarks",
                          e.target.value,
                        )
                      }
                      placeholder="Enter remarks…"
                    />
                  </CCol>
                </CRow>
              </SectionCard>

              {/* ── Movement Test ── */}
              <SectionCard
                icon={ArrowLeftRight}
                title="Movement Test"
                accent="#a78bfa"
              >
                <CRow className="g-3">
                  <CCol xs={12} sm={4}>
                    <Toggle
                      checked={cl.movement_test?.started}
                      onChange={() =>
                        setChecklist(
                          "movement_test.started",
                          !cl.movement_test?.started,
                        )
                      }
                      label="Test Started"
                    />
                  </CCol>
                  <CCol xs={6} sm={4}>
                    <Toggle
                      checked={cl.movement_test?.direction_check?.forward}
                      onChange={() =>
                        setChecklist(
                          "movement_test.direction_check.forward",
                          !cl.movement_test?.direction_check?.forward,
                        )
                      }
                      label="Forward ✓"
                    />
                  </CCol>
                  <CCol xs={6} sm={4}>
                    <Toggle
                      checked={cl.movement_test?.direction_check?.reverse}
                      onChange={() =>
                        setChecklist(
                          "movement_test.direction_check.reverse",
                          !cl.movement_test?.direction_check?.reverse,
                        )
                      }
                      label="Reverse ✓"
                    />
                  </CCol>

                  <CCol xs={12}>
                    <FieldLabel>Remarks</FieldLabel>
                    <StyledTextarea
                      value={cl.movement_test?.remarks || ""}
                      onChange={(e) =>
                        setChecklist("movement_test.remarks", e.target.value)
                      }
                      placeholder="Enter remarks…"
                    />
                  </CCol>

                  {/* ✅ Buttons Added Here */}
                  <CCol xs={12}>
                    <FieldLabel>Controls</FieldLabel>

                    <CButton
                      className="btn btn-sm btn-secondary m-1 shadow"
                      disabled={commandButton === 11}
                      onClick={() => sendsingleDownlink(start, 11)}
                    >
                      {commandButton === 11 ? (
                        <>
                          START&nbsp;
                          <LoadingSpinner />
                        </>
                      ) : (
                        "START"
                      )}
                    </CButton>

                    <CButton
                      className="btn btn-sm btn-secondary m-1 shadow-sm"
                      disabled={commandButton === 12}
                      onClick={() => sendsingleDownlink(stop, 12)}
                    >
                      {commandButton === 12 ? (
                        <>
                          STOP&nbsp;
                          <LoadingSpinner />
                        </>
                      ) : (
                        "STOP"
                      )}
                    </CButton>

                    <CButton
                      className="btn btn-sm btn-secondary m-1 shadow-sm"
                      disabled={commandButton === 13}
                      onClick={() => sendsingleDownlink(returntodock, 13)}
                    >
                      {commandButton === 13 ? (
                        <>
                          RETURN&nbsp;
                          <LoadingSpinner />
                        </>
                      ) : (
                        "RETURN"
                      )}
                    </CButton>
                  </CCol>
                </CRow>
              </SectionCard>

              {/* ── Speed & Alignment ── */}
              <SectionCard
                icon={Gauge}
                title="Speed & Alignment"
                accent="#fb923c"
              >
                <CRow className="g-3">
                  <CCol xs={6} sm={3}>
                    <Toggle
                      checked={cl.speed_and_alignment?.speed_ok}
                      onChange={() =>
                        setChecklist(
                          "speed_and_alignment.speed_ok",
                          !cl.speed_and_alignment?.speed_ok,
                        )
                      }
                      label="Speed OK"
                    />
                  </CCol>
                  <CCol xs={6} sm={3}>
                    <Toggle
                      checked={cl.speed_and_alignment?.alignment_ok}
                      onChange={() =>
                        setChecklist(
                          "speed_and_alignment.alignment_ok",
                          !cl.speed_and_alignment?.alignment_ok,
                        )
                      }
                      label="Alignment OK"
                    />
                  </CCol>
                  <CCol xs={12} sm={6}>
                    <FieldLabel>Deviation</FieldLabel>
                    <StyledSelect
                      value={cl.speed_and_alignment?.deviation || "none"}
                      onChange={(e) =>
                        setChecklist(
                          "speed_and_alignment.deviation",
                          e.target.value,
                        )
                      }
                    >
                      {DEVIATION_OPTIONS.map((o) => (
                        <option key={o} value={o}>
                          {optionLabel(o)}
                        </option>
                      ))}
                    </StyledSelect>
                  </CCol>
                  <CCol xs={12}>
                    <FieldLabel>Remarks</FieldLabel>
                    <StyledTextarea
                      value={cl.speed_and_alignment?.remarks || ""}
                      onChange={(e) =>
                        setChecklist(
                          "speed_and_alignment.remarks",
                          e.target.value,
                        )
                      }
                      placeholder="Enter remarks…"
                    />
                  </CCol>
                </CRow>
              </SectionCard>

              {/* ── Cleaning Test ── */}
              <SectionCard icon={Brush} title="Cleaning Test" accent="#22d3ee">
                <CRow className="g-3">
                  <CCol xs={12} sm={5}>
                    <Toggle
                      checked={cl.cleaning_test?.brush_rotation}
                      onChange={() =>
                        setChecklist(
                          "cleaning_test.brush_rotation",
                          !cl.cleaning_test?.brush_rotation,
                        )
                      }
                      label="Brush Rotation OK"
                    />
                  </CCol>
                  <CCol xs={12} sm={4}>
                    <FieldLabel>Cleaning Efficiency</FieldLabel>
                    <StyledSelect
                      value={
                        cl.cleaning_test?.cleaning_efficiency || "not-checked"
                      }
                      onChange={(e) =>
                        setChecklist(
                          "cleaning_test.cleaning_efficiency",
                          e.target.value,
                        )
                      }
                    >
                      {CLEAN_EFF_OPTIONS.map((o) => (
                        <option key={o} value={o}>
                          {optionLabel(o)}
                        </option>
                      ))}
                    </StyledSelect>
                  </CCol>
                  <CCol xs={12} sm={3} md={12}>
                    <FieldLabel>Remarks</FieldLabel>
                    <StyledTextarea
                      value={cl.cleaning_test?.remarks || ""}
                      onChange={(e) =>
                        setChecklist("cleaning_test.remarks", e.target.value)
                      }
                      placeholder="Remarks…"
                      //   style={{ minHeight: 42 }}
                    />
                  </CCol>
                </CRow>
              </SectionCard>

              {/* ── Physical Inspection ── */}
              <SectionCard
                icon={Eye}
                title="Physical Inspection"
                accent="#e879f9"
              >
                <CRow className="g-3">
                  {["wheels", "brushes", "pipes", "sensors", "frame"].map(
                    (part) => (
                      <CCol xs={6} sm={4} key={part}>
                        <FieldLabel>{optionLabel(part)}</FieldLabel>
                        {/* Schema enum: not-checked | good | worn | damaged */}
                        <StyledSelect
                          value={
                            cl.physical_inspection?.[part] || "not-checked"
                          }
                          onChange={(e) =>
                            setChecklist(
                              `physical_inspection.${part}`,
                              e.target.value,
                            )
                          }
                        >
                          {PART_STATUS_OPTIONS.map((o) => (
                            <option key={o} value={o}>
                              {optionLabel(o)}
                            </option>
                          ))}
                        </StyledSelect>
                      </CCol>
                    ),
                  )}
                  <CCol xs={12}>
                    <FieldLabel>Issues Found</FieldLabel>
                    <StyledTextarea
                      value={inspectionIssuesRaw}
                      onChange={(e) => setInspectionIssuesRaw(e.target.value)}
                      onBlur={(e) =>
                        setChecklist(
                          "physical_inspection.issues_found",
                          e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean),
                        )
                      }
                      placeholder="Comma-separated list of issues…"
                      //   style={{ minHeight: 54 }}
                    />
                  </CCol>
                </CRow>
              </SectionCard>

              {/* ── Safety Checks ── */}
              <SectionCard
                icon={ShieldCheck}
                title="Safety Checks"
                accent="#4ade80"
              >
                <CRow className="g-3">
                  <CCol xs={12} sm={4}>
                    <Toggle
                      checked={cl.safety_checks?.emergency_switch}
                      onChange={() =>
                        setChecklist(
                          "safety_checks.emergency_switch",
                          !cl.safety_checks?.emergency_switch,
                        )
                      }
                      label="Emergency Switch"
                    />
                  </CCol>
                  <CCol xs={12} sm={4}>
                    <Toggle
                      checked={cl.safety_checks?.obstacle_detection}
                      onChange={() =>
                        setChecklist(
                          "safety_checks.obstacle_detection",
                          !cl.safety_checks?.obstacle_detection,
                        )
                      }
                      label="Obstacle Detection"
                    />
                  </CCol>
                  <CCol xs={12} sm={4}>
                    <Toggle
                      checked={cl.safety_checks?.auto_stop}
                      onChange={() =>
                        setChecklist(
                          "safety_checks.auto_stop",
                          !cl.safety_checks?.auto_stop,
                        )
                      }
                      label="Auto Stop"
                    />
                  </CCol>
                  <CCol xs={12}>
                    <FieldLabel>Remarks</FieldLabel>
                    <StyledTextarea
                      value={cl.safety_checks?.remarks || ""}
                      onChange={(e) =>
                        setChecklist("safety_checks.remarks", e.target.value)
                      }
                      placeholder="Enter remarks…"
                    />
                  </CCol>
                </CRow>
              </SectionCard>

              {/* Summary */}
              <SectionCard
                icon={ClipboardCheck}
                title="Summary"
                accent="#a78bfa"
              >
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 14 }}
                >
                  <div>
                    <FieldLabel>Overall Status</FieldLabel>
                    <StyledSelect
                      value={su.overall_status}
                      onChange={(e) =>
                        setSummary("overall_status", e.target.value)
                      }
                    >
                      {OVERALL_STATUS_OPTIONS.map((o) => (
                        <option key={o} value={o}>
                          {optionLabel(o)}
                        </option>
                      ))}
                    </StyledSelect>
                  </div>
                  <div>
                    <FieldLabel>Issues</FieldLabel>
                    <StyledTextarea
                      value={summaryIssuesRaw}
                      onChange={(e) => setSummaryIssuesRaw(e.target.value)}
                      onBlur={(e) =>
                        setSummary(
                          "issues",
                          e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean),
                        )
                      }
                      placeholder="Comma-separated issues…"
                      //   style={{ minHeight: 54 }}
                    />
                  </div>
                  <div>
                    <FieldLabel>Recommendation</FieldLabel>
                    <StyledTextarea
                      value={su.recommendation || ""}
                      onChange={(e) =>
                        setSummary("recommendation", e.target.value)
                      }
                      placeholder="Add recommendation…"
                      //   style={{ minHeight: 54 }}
                    />
                  </div>
                </div>
              </SectionCard>
            </div>
          </CCol>

          {/* ── Last Activity ── */}
          {doc.last_activity && (
            <CCol xs={12}>
              <LastActivity lastactivity={doc.last_activity} />
            </CCol>
          )}
        </CRow>
      </div>
    </>
  );
};

export default UpdateRobotCommisioningDoc;
