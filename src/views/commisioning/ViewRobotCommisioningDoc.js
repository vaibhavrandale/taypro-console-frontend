// import React, { useEffect, useReducer } from "react";
// import {
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CRow,
//   CCol,
//   CBadge,
//   CListGroup,
//   CListGroupItem,
//   CAvatar,
// } from "@coreui/react";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import { useSelector } from "react-redux";
// import toast from "react-hot-toast";
// import LoadingSpinner from "../../components/LoadingSpinner";
// import LastActivity from "../../components/LastActivity";
// const reducer = (state, action) => {
//   switch (action.type) {
//     case "FETCH_ROBOT_COMMISION_DOC_REQUEST":
//       return { ...state, loadingDoc: false, docError: "" };
//     case "FETCH_ROBOT_COMMISION_DOC_SUCCESS":
//       return {
//         ...state,
//         loadingDocs: false,
//         doc: action.payload,
//       };
//     case "FETCH_ROBOT_COMMISION_DOC_FAIL":
//       return { ...state, loadingDoc: false, docError: action.payload };

//     default:
//       return state;
//   }
// };
// const getStatusBadge = (status) => {
//   if (status === true || status === "good") return "success";
//   if (status === false || status === "damaged") return "danger";
//   if (status === "pending") return "warning";
//   return "secondary";
// };

// const formatDate = (date) => {
//   if (!date) return "-";
//   return new Date(date).toLocaleString();
// };

// const ViewRobotCommisioningDoc = () => {
//   const { id } = useParams();
//   const [{ doc, loadingDoc, docError }, dispatch] = useReducer(reducer, {
//     docError: "",
//     loadingDoc: false,
//     doc: {},
//   });
//  // const authtoken = useSelector((state) => state.authtoken);
//   //   const userInfo = useSelector((state) => state.userInfo);
//   useEffect(() => {
//     const fetchRobots = async () => {
//       dispatch({ type: "FETCH_ROBOT_COMMISION_DOC_REQUEST" });
//       try {
//         const result = await axios.get(`/api/v1/commisioning-docs//${id}`, {
//           // headers: { Authorization: `Bearer ${authtoken}` },
// withCredentials: true,
//         });
//         console.log(result.data.data);
//         dispatch({
//           type: "FETCH_ROBOT_COMMISION_DOC_SUCCESS",

//           payload: result.data.data,
//         });
//       } catch (error) {
//         dispatch({
//           type: "FETCH_ROBOT_COMMISION_DOC_FAIL",
//           payload: error.response?.data?.message || error.response?.data?.error,
//         });
//         toast.error(
//           error.response?.data?.message || error.response?.data?.error,
//         );
//       }
//     };

//     fetchRobots();
//   }, [ id]);

//   return (
//     <CRow>
//       {loadingDoc ? (
//         <LoadingSpinner />
//       ) : (
//         <>
//           {/* 🔹 Robot Info */}
//           <CCol md={6}>
//             <CCard>
//               <CCardHeader>Robot Information</CCardHeader>
//               <CCardBody>
//                 <p>
//                   <strong>Robot No:</strong> {doc.robot_no}
//                 </p>
//                 <p>
//                   <strong>Site:</strong> {doc.site_id}
//                 </p>
//                 <p>
//                   <strong>Client:</strong> {doc.client_name}
//                 </p>
//                 <p>
//                   <strong>Location:</strong> {doc.site_location}
//                 </p>
//                 <p>
//                   <strong>Block:</strong> {doc.block}
//                 </p>
//                 <p>
//                   <strong>Status:</strong>{" "}
//                   <CBadge color={getStatusBadge(doc.status)}>
//                     {doc.status}
//                   </CBadge>
//                 </p>
//                 <p>
//                   <strong>Commissioning Date:</strong>{" "}
//                   {formatDate(doc.commissioning_date)}
//                 </p>
//               </CCardBody>
//             </CCard>
//           </CCol>

//           {/* 🔹 Summary */}
//           {doc.summary && (
//             <CCol md={6}>
//               <CCard>
//                 <CCardHeader>Summary</CCardHeader>
//                 <CCardBody>
//                   <p>
//                     <strong>Overall Status:</strong>{" "}
//                     <CBadge color={getStatusBadge(doc.summary?.overall_status)}>
//                       {doc.summary.overall_status}
//                     </CBadge>
//                   </p>
//                   <p>
//                     <strong>Recommendation:</strong>{" "}
//                     {doc.summary?.recommendation}
//                   </p>
//                   <p>
//                     <strong>Issues:</strong>{" "}
//                     {doc.summary.issues.length === 0
//                       ? "No issues"
//                       : doc.summary.issues.join(", ")}
//                   </p>
//                 </CCardBody>
//               </CCard>
//             </CCol>
//           )}
//           {/* 🔹 Checklist */}
//           <CCol md={12}>
//             <CCard>
//               <CCardHeader>Checklist</CCardHeader>
//               <CCardBody>
//                 <CRow>
//                   <CCol md={6}>
//                     <p>
//                       <strong>Power On:</strong>{" "}
//                       <CBadge
//                         color={getStatusBadge(doc.checklist?.power_on.status)}
//                       >
//                         {doc.checklist?.power_on.status ? "OK" : "Failed"}
//                       </CBadge>
//                     </p>

//                     <p>
//                       <strong>Portal Connectivity:</strong>{" "}
//                       <CBadge
//                         color={getStatusBadge(
//                           doc.checklist?.portal_connectivity.is_online,
//                         )}
//                       >
//                         {doc.checklist?.portal_connectivity.is_online
//                           ? "Online"
//                           : "Offline"}
//                       </CBadge>
//                     </p>

//                     <p>
//                       <strong>Movement:</strong>{" "}
//                       {doc.checklist?.movement_test.started
//                         ? "Started"
//                         : "Not Started"}
//                     </p>

//                     <p>
//                       <strong>Alignment:</strong>{" "}
//                       <CBadge
//                         color={getStatusBadge(
//                           doc.checklist?.speed_and_alignment.alignment_ok,
//                         )}
//                       >
//                         {doc.checklist?.speed_and_alignment.alignment_ok
//                           ? "OK"
//                           : "Issue"}
//                       </CBadge>
//                     </p>
//                   </CCol>

//                   <CCol md={6}>
//                     <p>
//                       <strong>Cleaning:</strong>{" "}
//                       <CBadge
//                         color={getStatusBadge(
//                           doc.checklist?.cleaning_test.cleaning_efficiency,
//                         )}
//                       >
//                         {doc.checklist?.cleaning_test.cleaning_efficiency}
//                       </CBadge>
//                     </p>

//                     <p>
//                       <strong>Wheels:</strong>{" "}
//                       <CBadge
//                         color={getStatusBadge(
//                           doc.checklist?.physical_inspection.wheels,
//                         )}
//                       >
//                         {doc.checklist?.physical_inspection.wheels}
//                       </CBadge>
//                     </p>

//                     <p>
//                       <strong>Frame:</strong>{" "}
//                       <CBadge
//                         color={getStatusBadge(
//                           doc.checklist?.physical_inspection.frame,
//                         )}
//                       >
//                         {doc.checklist?.physical_inspection.frame}
//                       </CBadge>
//                     </p>

//                     <p>
//                       <strong>Safety:</strong>{" "}
//                       <CBadge
//                         color={getStatusBadge(
//                           doc.checklist?.safety_checks.emergency_switch &&
//                             doc.checklist?.safety_checks.auto_stop,
//                         )}
//                       >
//                         Passed
//                       </CBadge>
//                     </p>
//                   </CCol>
//                 </CRow>
//               </CCardBody>
//             </CCard>
//           </CCol>

//           {/* 🔹 Activity Log */}

//   {doc.last_activity && (
//     <LastActivity lastactivity={doc.last_activity} />
//   )}
//         </>
//       )}
//     </CRow>
//   );
// };

// export default ViewRobotCommisioningDoc;

import React, { useEffect, useReducer } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CBadge,
  CAvatar,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CListGroup,
  CListGroupItem,
  CProgress,
  CProgressBar,
  CAlert,
  CCallout,
  CWidgetStatsF,
} from "@coreui/react";
import {
  Zap,
  Wifi,
  Gauge,
  Brush,
  Search,
  ShieldAlert,
  CheckCircle,
  Clock,
  MapPin,
  Cpu,
  FileText,
  Star,
  MoveRight,
  Settings,
} from "lucide-react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";
import LastActivity from "../../components/LastActivity";

/* ─────────────────────────────────────────────
   Reducer
───────────────────────────────────────────── */
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_ROBOT_COMMISION_DOC_REQUEST":
      return { ...state, loadingDoc: true, docError: "" };
    case "FETCH_ROBOT_COMMISION_DOC_SUCCESS":
      return { ...state, loadingDoc: false, doc: action.payload };
    case "FETCH_ROBOT_COMMISION_DOC_FAIL":
      return { ...state, loadingDoc: false, docError: action.payload };
    default:
      return state;
  }
};

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
const getStatusBadge = (status) => {
  if (status === true || status === "good") return "success";
  if (status === false || status === "damaged") return "danger";
  if (status === "pending") return "warning";
  if (status === "not-checked") return "secondary";
  return "secondary";
};

const formatDate = (date) => {
  if (!date) return "—";
  return new Date(date).toLocaleString();
};

/* lucide icon wrapper — keeps sizing consistent */
const Icon = ({ as: LucideIcon, size = 16, className = "" }) => (
  <LucideIcon size={size} className={className} strokeWidth={1.75} />
);

/* Boolean → coloured badge */
const BoolBadge = ({ value, trueLabel = "OK", falseLabel = "Failed" }) => (
  <CBadge color={value ? "success" : "danger"} className="ms-1">
    {value ? trueLabel : falseLabel}
  </CBadge>
);

/* Checklist list-group row */
const CheckRow = ({ icon: LucideIcon, label, children }) => (
  <CListGroupItem className="d-flex align-items-center justify-content-between px-3 py-2">
    <div className="d-flex align-items-center gap-2 text-body">
      <Icon as={LucideIcon} className="text-success" />
      <span className="fw-semibold small">{label}</span>
    </div>
    <div className="d-flex align-items-center flex-wrap gap-1">{children}</div>
  </CListGroupItem>
);

/* Physical inspection status badge */
const InspectionBadge = ({ value }) => {
  const map = {
    good: "success",
    damaged: "danger",
    "not-checked": "secondary",
  };
  return (
    <CBadge color={map[value] ?? "secondary"} className="text-capitalize">
      {value}
    </CBadge>
  );
};

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
const ViewRobotCommisioningDoc = () => {
  const { id } = useParams();
  const [{ doc, loadingDoc, docError }, dispatch] = useReducer(reducer, {
    docError: "",
    loadingDoc: false,
    doc: {},
  });
  // const authtoken = useSelector((state) => state.authtoken);

  useEffect(() => {
    const fetchDoc = async () => {
      dispatch({ type: "FETCH_ROBOT_COMMISION_DOC_REQUEST" });
      try {
        const result = await axios.get(`/api/v1/commisioning-docs/${id}`, {
          // headers: { Authorization: `Bearer ${authtoken}` },
          withCredentials: true,
        });
        dispatch({
          type: "FETCH_ROBOT_COMMISION_DOC_SUCCESS",
          payload: result.data.data,
        });
      } catch (error) {
        const msg =
          error.response?.data?.message || error.response?.data?.error;
        dispatch({ type: "FETCH_ROBOT_COMMISION_DOC_FAIL", payload: msg });
        toast.error(msg);
      }
    };
    fetchDoc();
  }, [id]);

  if (loadingDoc) return <LoadingSpinner />;
  if (docError)
    return (
      <CAlert color="danger" className="m-3">
        {docError}
      </CAlert>
    );

  const cl = doc.checklist ?? {};
  const pi = cl.physical_inspection ?? {};
  const sc = cl.safety_checks ?? {};
  const mv = cl.movement_test ?? {};

  /* Progress calculation */
  const checkItems = [
    cl.power_on?.status,
    cl.portal_connectivity?.is_online,
    mv.started,
    cl.speed_and_alignment?.alignment_ok,
    cl.speed_and_alignment?.speed_ok,
    cl.cleaning_test?.brush_rotation,
    sc.emergency_switch,
    sc.obstacle_detection,
    sc.auto_stop,
  ];
  const passedCount = checkItems.filter(Boolean).length;
  const progressPct = Math.round((passedCount / checkItems.length) * 100);
  const progressColor =
    progressPct >= 80 ? "success" : progressPct >= 40 ? "warning" : "danger";

  return (
    <CRow className="g-4">
      {/* ── HEADER BANNER ── */}
      <CCol xs={12}>
        <CCard className="border-0 shadow-sm bg-primary text-white">
          <CCardBody className="p-4">
            <CRow className="align-items-center">
              <CCol xs="auto">
                <CAvatar
                  size="xl"
                  className="border border-white border-3 bg-white text-primary fs-4 fw-bold shadow"
                  textColor="primary"
                >
                  {doc.robot_no?.slice(0, 2) ?? "RB"}
                </CAvatar>
              </CCol>

              <CCol>
                <h4 className="mb-1 fw-bold text-white">{doc.robot_no}</h4>
                <div className="d-flex flex-wrap gap-2 align-items-center opacity-75 small">
                  <Icon as={MapPin} size={14} className="text-success" />
                  <span>{doc.site_location}</span>
                  <span>·</span>
                  <span>{doc.block}</span>
                  <span>·</span>
                  <span className="text-capitalize">{doc.robot_type}</span>
                </div>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>

      {/* ── STAT WIDGETS ── */}
      {/* <CCol xs={12} sm={6} lg={3}>
        <CWidgetStatsF
          className="mb-0 shadow-sm h-100"
          color="primary"
          icon={<Icon as={Cpu} size={24} />}
          title="Robot ID"
          value={doc.robot_no ?? "—"}
        />
      </CCol> */}
      <CCol xs={12} sm={6} lg={3}>
        <CWidgetStatsF
          className="mb-0 shadow-sm h-100"
          color="info"
          icon={<Icon as={MapPin} size={24} />}
          title="Site"
          value={doc.site_id ?? "—"}
        />
      </CCol>
      <CCol xs={12} sm={6} lg={3}>
        <CWidgetStatsF
          className="mb-0 shadow-sm h-100"
          color="warning"
          icon={<Icon as={Star} size={24} />}
          title="Client"
          value={doc.client_name ?? "—"}
        />
      </CCol>
      <CCol xs={12} sm={6} lg={3}>
        <CWidgetStatsF
          className="mb-0 shadow-sm h-100"
          color={doc.commissioning_date ? "success" : "secondary"}
          icon={<Icon as={FileText} size={24} />}
          title="Commissioning Date"
          value={formatDate(doc.commissioning_date)}
        />
      </CCol>

      <CCol xs={12} sm={6} lg={3}>
        {/* <CBadge
                  color={
                    doc.status === "pending"
                      ? "warning"
                      : doc.status === "active"
                        ? "success"
                        : "secondary"
                  }
                  className="px-3 py-2 fs-6 text-capitalize"
                >
                  {doc.status}
                </CBadge>
                <div className="d-flex align-items-center justify-content-end gap-1 small opacity-75 mt-1">
                  <Icon as={Clock} size={13} className="text-success" />
                  {formatDate(doc.createdAt)}
                </div> */}
        <CWidgetStatsF
          className="mb-0 shadow-sm h-100"
          color={
            doc.status === "pending"
              ? "secondary"
              : doc.status === "in_progress"
                ? "warning"
                : doc.status === "completed"
                  ? "success"
                  : "danger"
          }
          icon={<Icon as={Cpu} size={24} />}
          title="Status"
          value={
            <>
              <CBadge
                color={
                  doc.status === "pending"
                    ? "secondary"
                    : doc.status === "in_progress"
                      ? "warning"
                      : doc.status === "completed"
                        ? "success"
                        : "danger"
                }
                className=" text-capitalize"
              >
                {doc.status}
              </CBadge>{" "}
              <div className="d-flex align-items-center justify-content-end gap-1 small opacity-75 mt-1">
                <Icon as={Clock} size={13} className="text-success" />
                {formatDate(doc.createdAt)}
              </div>
            </>
          }
        />
      </CCol>

      {/* ── PROGRESS OVERVIEW ── */}
      <CCol xs={12}>
        <CCard className="shadow-sm border-0">
          <CCardHeader className="d-flex align-items-center justify-content-between bg-white border-bottom fw-semibold">
            <div className="d-flex align-items-center gap-2">
              <Icon as={CheckCircle} className="text-success" />
              Commissioning Checklist Progress
            </div>
            <CBadge color={progressColor} className="px-3 py-2 fs-6">
              {passedCount} / {checkItems.length} Passed
            </CBadge>
          </CCardHeader>
          <CCardBody>
            <CProgress height={12} className="mb-2">
              <CProgressBar
                color={progressColor}
                value={progressPct}
                animated={progressPct < 100}
              >
                {progressPct}%
              </CProgressBar>
            </CProgress>
            <div className="text-muted small">
              {progressPct < 40
                ? "🔴 Checklist largely incomplete — review required before commissioning."
                : progressPct < 80
                  ? "🟡 Partially complete — a few checks still pending."
                  : "🟢 Almost ready — verify remaining items."}
            </div>
          </CCardBody>
        </CCard>
      </CCol>

      {/* ── FUNCTIONAL CHECKS ── */}
      <CCol md={6}>
        <CCard className="shadow-sm border-0 h-100">
          <CCardHeader className="d-flex align-items-center gap-2 bg-white border-bottom fw-semibold">
            <Icon as={Settings} className="text-success" />
            Functional Checks
          </CCardHeader>
          <CCardBody className="p-0">
            <CListGroup flush>
              <CheckRow icon={Zap} label="Power On">
                <BoolBadge value={cl.power_on?.status} />
                {cl.power_on?.remarks && (
                  <span className="text-muted small">
                    {cl.power_on.remarks}
                  </span>
                )}
              </CheckRow>

              <CheckRow icon={Wifi} label="Portal Connectivity">
                <BoolBadge
                  value={cl.portal_connectivity?.is_online}
                  trueLabel="Online"
                  falseLabel="Offline"
                />
              </CheckRow>

              <CheckRow icon={MoveRight} label="Movement Test">
                <CBadge color={mv.started ? "success" : "secondary"}>
                  {mv.started ? "Started" : "Not Started"}
                </CBadge>
                <CBadge
                  color={mv.direction_check?.forward ? "success" : "secondary"}
                >
                  FWD
                </CBadge>
                <CBadge
                  color={mv.direction_check?.reverse ? "success" : "secondary"}
                >
                  REV
                </CBadge>
              </CheckRow>

              <CheckRow icon={Gauge} label="Speed & Alignment">
                <CBadge
                  color={
                    cl.speed_and_alignment?.speed_ok ? "success" : "danger"
                  }
                >
                  Speed
                </CBadge>
                <CBadge
                  color={
                    cl.speed_and_alignment?.alignment_ok ? "success" : "danger"
                  }
                >
                  Align
                </CBadge>
                {cl.speed_and_alignment?.deviation !== "none" && (
                  <CBadge color="warning">
                    Dev: {cl.speed_and_alignment?.deviation}
                  </CBadge>
                )}
              </CheckRow>

              <CheckRow icon={Brush} label="Cleaning Test">
                <CBadge
                  color={
                    cl.cleaning_test?.brush_rotation ? "success" : "danger"
                  }
                >
                  Brush
                </CBadge>
                <CBadge
                  color={getStatusBadge(cl.cleaning_test?.cleaning_efficiency)}
                  className="text-capitalize"
                >
                  {cl.cleaning_test?.cleaning_efficiency}
                </CBadge>
              </CheckRow>

              <CheckRow icon={ShieldAlert} label="Safety Checks">
                <CBadge color={sc.emergency_switch ? "success" : "danger"}>
                  E-Stop
                </CBadge>
                <CBadge color={sc.obstacle_detection ? "success" : "danger"}>
                  Obstacle
                </CBadge>
                <CBadge color={sc.auto_stop ? "success" : "danger"}>
                  Auto Stop
                </CBadge>
              </CheckRow>
            </CListGroup>
          </CCardBody>
        </CCard>
      </CCol>

      {/* ── PHYSICAL INSPECTION ── */}
      <CCol md={6}>
        <CCard className="shadow-sm border-0 h-100">
          <CCardHeader className="d-flex align-items-center   border-bottom fw-semibold">
            <Icon as={Search} className="text-success" />
            Physical Inspection
          </CCardHeader>
          <CCardBody className="p-0">
            <CTable bordered small responsive className="mb-0">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell className="fw-semibold text-muted small ps-4">
                    Component
                  </CTableHeaderCell>
                  <CTableHeaderCell className="fw-semibold text-muted small">
                    Status
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {[
                  ["Wheels", pi.wheels],
                  ["Brushes", pi.brushes],
                  ["Pipes", pi.pipes],
                  ["Sensors", pi.sensors],
                  ["Frame", pi.frame],
                ].map(([label, val]) => (
                  <CTableRow key={label}>
                    <CTableDataCell className="fw-semibold small ps-4 align-middle">
                      {label}
                    </CTableDataCell>
                    <CTableDataCell className="align-middle">
                      <InspectionBadge value={val} />
                    </CTableDataCell>
                  </CTableRow>
                ))}
                <CTableRow>
                  <CTableDataCell className="fw-semibold small ps-4 align-middle">
                    Issues Found
                  </CTableDataCell>
                  <CTableDataCell className="align-middle">
                    {pi.issues_found?.length > 0 ? (
                      <div className="d-flex flex-wrap gap-1">
                        {pi.issues_found.map((issue, i) => (
                          <CBadge key={i} color="danger">
                            {issue}
                          </CBadge>
                        ))}
                      </div>
                    ) : (
                      <CBadge color="success">None</CBadge>
                    )}
                  </CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
          </CCardBody>

          {sc.remarks && (
            <CCardBody className="pt-0">
              <CCallout color="warning" className="mb-0 small">
                <strong>Safety Remarks:</strong> {sc.remarks}
              </CCallout>
            </CCardBody>
          )}
        </CCard>
      </CCol>

      {/* ── LAST ACTIVITY ── */}
      {doc.last_activity && <LastActivity lastactivity={doc.last_activity} />}
    </CRow>
  );
};

export default ViewRobotCommisioningDoc;
