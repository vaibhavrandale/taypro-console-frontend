// import {
//   CBadge,
//   CCarousel,
//   CCarouselItem,
//   CCol,
//   CFormInput,
//   CImage,
//   CModal,
//   CModalBody,
//   CModalHeader,
//   CModalTitle,
//   CRow,
//   CTable,
//   CTableBody,
//   CTableDataCell,
//   CTableHead,
//   CTableHeaderCell,
//   CTableRow,
//   CTooltip,
// } from "@coreui/react";
// import axios from "axios";
// import React, { useEffect, useReducer, useState } from "react";
// import toast from "react-hot-toast";
// import { useSelector } from "react-redux";
// import { Link } from "react-router-dom";
// import PaginateInput from "../../../components/PaginateInput";
// import LoadingSpinner from "../../../components/LoadingSpinner";
// import LastActivity from "../../../components/LastActivity";
// import { formatDistanceToNow } from "date-fns";
// import CIcon from "@coreui/icons-react";
// import { cilBell, cilX } from "@coreui/icons";

// const reducer = (state, action) => {
//   switch (action.type) {
//     case "FETCH_PM_REQUEST":
//       return { ...state, pmloading: true, error: "" };
//     case "FETCH_PM_SUCCESS":
//       return {
//         ...state,
//         pmloading: false,
//         preventivemaintanance: action.payload.data,
//         totalPages: action.payload.totalPages, // Use API-provided totalPages
//         hasNextPage: action.payload.hasNextPage,
//         hasPrevPage: action.payload.hasPrevPage,
//       };
//     case "FETCH_PM_FAIL":
//       return { ...state, pmloading: false, error: action.payload };
//     default:
//       return state;
//   }
// };

// const PreventiveMaintanancrDashboard = () => {
//   const [
//     {
//       error,
//       preventivemaintanance,
//       pmloading,
//       totalPages,
//       hasNextPage,
//       hasPrevPage,
//     },
//     dispatch,
//   ] = useReducer(reducer, {
//     preventivemaintanance: [],
//     pmloading: true,
//     error: "",
//     totalPages: 1,
//     hasNextPage: false,
//     hasPrevPage: false,
//   });
//   // const authtoken = useSelector((state) => state.authtoken);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [pageInput, setPageInput] = useState("");
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedPm, setSelectedPm] = useState(null);
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(10);

//   const [formData, setFormData] = useState({
//     pm_id: "",
//     robot_no: "",
//     block: "",
//     robot_type: "",
//     client_name: "",
//     doc_no: "",
//     revision_no: "",
//     revised_by: "",
//     site_location: "",
//     physical_condition_of_transPipe: {},
//     physical_condition_of_channel: {},
//     physical_condition_of_top_bottom_cover: {},
//     oiling_need_for_bearing: {},
//     oiling_need_for_coupling: {},
//     oiling_need_for_motors: {},
//     alignment: {},
//     is_wheels_loose: "",
//     is_nutbolt_loose: "",
//     start_date: "",
//     end_date: "",
//     last_activity: [],
//   });

//   useEffect(() => {
//     let pagination = {
//       pg: page,
//       limit: limit,
//     };
//     const fetchPreventivemaintenances = async () => {
//       dispatch({ type: "FETCH_PM_REQUEST" });
//       try {
//         const result = await axios.post(
//           `/api/v1/preventivemaintenances/get-preventivemaintenances`,
//           pagination,
//           {
//             // headers: { Authorization: `Bearer ${authtoken}` },
//             withCredentials: true,
//           },
//         );

//         let total = Math.ceil(
//           Number(result.data.total) / Number(result.data.limit),
//         );
//         let next = result.data.hasNextPage;
//         let prev = result.data.hasPrevPage;

//         dispatch({
//           type: "FETCH_PM_SUCCESS",
//           payload: {
//             data: result.data.data,
//             totalPages: total,
//             hasNextPage: next,
//             hasPrevPage: prev,
//           },
//         });
//       } catch (error) {
//         dispatch({
//           type: "FETCH_PM_FAIL",
//           payload: error.response.data.error,
//         });
//         toast.error(error.response.data.error);
//       }
//     };

//     fetchPreventivemaintenances();
//   }, [limit, page]);

//   const FilteredPreventivemaintenances = preventivemaintanance
//     ? preventivemaintanance.filter(
//         (robot) =>
//           robot.robot_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           robot.site_id.toLowerCase().includes(searchTerm.toLowerCase()),
//       )
//     : [];

//   const handlePageInputChange = (e) => {
//     setPageInput(e.target.value);
//   };

//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= totalPages) {
//       setPage(newPage);
//     }
//   };

//   const handlePageInputSubmit = () => {
//     const pageNumber = parseInt(pageInput);
//     if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
//       handlePageChange(pageNumber);
//     }
//   };

//   const openModal = (robot) => {
//     setSelectedPm(robot);
//     setFormData(robot);
//     setModalVisible(true);
//   };

//   const userInfo = useSelector((state) => state.userInfo);

//   let adminroute = "";

//   if (userInfo.role === "Master Admin") {
//     adminroute = "master-admin";
//   } else if (userInfo.role === "Service Admin") {
//     adminroute = "service-admin";
//   } else if (userInfo.role === "Project Admin") {
//     adminroute = "project-admin";
//   } else if (userInfo?.role === "Master User") {
//     adminroute = "master-user";
//   } else if (userInfo?.role === "Service User") {
//     adminroute = "service-user";
//   } else if (userInfo?.role === "Project User") {
//     adminroute = "project-user";
//   }

//   return (
//     <div className="p-2">
//       <h2 className="text-center">All Preventive Maintenances</h2>
// <div className="d-flex justify-content-end mb-3">
//   <Link
//     className="btn btn-sm btn-danger m-1"
//     to={`/${adminroute}/preventive-maintanance-dashboard/view`}
//   >
//     View Sitewise
//   </Link>
//   {!["Master User", "Project User", "Service User"].includes(
//     userInfo?.role,
//   ) && (
//     <Link
//       className="btn btn-sm btn-primary m-1"
//       to={`/${adminroute}/preventive-maintanance-dashboard/create-pm`}
//     >
//       Create New
//     </Link>
//   )}
//   <Link
//     className="btn btn-sm btn-secondary m-1 d-flex justify-content-center align-items-center"
//     to={`/${adminroute}/preventive-maintanance-dashboard/preventive-maintanance-notifications`}
//   >
//     All PM Activity
//     <CIcon icon={cilBell} />
//   </Link>
//       </div>
//       {/* Search Input */}
//       <CRow className="justify-content-end mb-3">
//         <CCol md={4}>
//           <CFormInput
//             type="text"
//             placeholder="Search by Robot No or Site ID..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </CCol>
//       </CRow>

//       <CTable bordered hover responsive className="text-center shadow-sm">
//         <CTableHead color="secondary">
//           <CTableRow>
//             <CTableHeaderCell>Sr</CTableHeaderCell>
//             <CTableHeaderCell>PM ID</CTableHeaderCell>
//             <CTableHeaderCell style={{ minWidth: "200px" }}>
//               Robot No
//             </CTableHeaderCell>

//             <CTableHeaderCell>Site ID</CTableHeaderCell>
//             <CTableHeaderCell>Time</CTableHeaderCell>
//             <CTableHeaderCell style={{ minWidth: "180px" }}>
//               Action
//             </CTableHeaderCell>
//           </CTableRow>
//         </CTableHead>
//         <CTableBody>
//           {pmloading ? (
//             <CTableRow>
//               <CTableDataCell colSpan="9" className="text-center fw-bold">
//                 <LoadingSpinner />
//               </CTableDataCell>
//             </CTableRow>
//           ) : error ? (
//             <CTableRow>
//               <CTableDataCell colSpan="9" className="text-center fw-bold">
//                 {error}
//               </CTableDataCell>
//             </CTableRow>
//           ) : FilteredPreventivemaintenances.length > 0 ? (
//             FilteredPreventivemaintenances.map((pm, index) => (
//               <CTableRow key={index}>
//                 <CTableDataCell>{index + 1}</CTableDataCell>
//                 <CTableDataCell>{pm.pm_id}</CTableDataCell>
//                 <CTableDataCell>{pm.robot_no}</CTableDataCell>
//                 <CTableDataCell>{pm.site_id}</CTableDataCell>
//                 <CTableDataCell>
//                   <span>{new Date(pm.createdAt).toLocaleString()}</span>
//                 </CTableDataCell>
//                 <CTableDataCell>
//                   <Link
//                     className="btn btn-sm btn-secondary m-1"
//                     color="secondary"
//                     size="sm"
//                     onClick={() => openModal(pm)}
//                   >
//                     View
//                   </Link>

//                   <Link
//                     className="btn btn-sm btn-warning m-1"
//                     to={`/${adminroute}/preventive-maintanance-dashboard/update/${pm._id}`}
//                   >
//                     Update
//                   </Link>
//                 </CTableDataCell>
//               </CTableRow>
//             ))
//           ) : (
//             <CTableRow>
//               <CTableDataCell colSpan="7" className="text-center fw-bold">
//                 No matching robots found.
//               </CTableDataCell>
//             </CTableRow>
//           )}
//         </CTableBody>
//       </CTable>

//       <PaginateInput
//         page={page}
//         totalPages={totalPages}
//         hasPrevPage={hasPrevPage}
//         hasNextPage={hasNextPage}
//         pageInput={pageInput}
//         handlePageChange={handlePageChange}
//         handlePageInputChange={handlePageInputChange}
//         handlePageInputSubmit={handlePageInputSubmit}
//         limit={limit}
//         handleLimitChange={setLimit} // New prop
//       />
//       <CModal
//         backdrop="static"
//         size="xl"
//         scrollable
//         visible={modalVisible}
//         onClose={() => setModalVisible(false)}
//       >
//         <CModalHeader closeButton={false}>
//           <CModalTitle>
//             PM Data :&nbsp;
//             <span className="badge bg-success">{formData.pm_id}</span>{" "}
//           </CModalTitle>
//           <button
//             type="button"
//             className="border-0 ms-auto py-0 px-1"
//             onClick={() => setModalVisible(false)}
//             style={{ background: "none" }}
//           >
//             <CIcon icon={cilX} size="lg" />
//           </button>
//         </CModalHeader>

//         <CModalBody>
//           {selectedPm && (
//             <>
//               <CTable bordered responsive>
//                 <CTableHead color="secondary">
//                   <CTableRow>
//                     <CTableHeaderCell>Field</CTableHeaderCell>
//                     <CTableHeaderCell>Value</CTableHeaderCell>
//                   </CTableRow>
//                 </CTableHead>

//                 <CTableBody>
//                   {Object.entries(formData)
//                     .filter(
//                       ([key]) =>
//                         key !== "last_activity" &&
//                         key !== "is_delete" &&
//                         ![
//                           "oiling_need_for_motors_image",
//                           "physical_condition_of_transPipe_image",
//                           "physical_condition_of_channel_image",
//                           "physical_condition_of_top_bottom_cover_image",
//                           "oiling_need_for_bearing_condition_image",
//                           "oiling_need_for_coupling_image",
//                         ].includes(key),
//                     )
//                     .map(([key, value]) => (
//                       <CTableRow key={key} className="align-middle">
//                         <CTableDataCell className="fw-semibold text-uppercase">
//                           {key.replace(/_/g, " ")}
//                         </CTableDataCell>

//                         <CTableDataCell>
//                           {typeof value === "boolean" ? (
//                             <CBadge
//                               color={value ? "success" : "danger"}
//                               shape="rounded-pill"
//                             >
//                               {value ? "Active" : "Inactive"}
//                             </CBadge>
//                           ) : key.includes("atedAt") &&
//                             key !== "site_location" ? (
//                             <CTooltip
//                               content={new Date(value).toLocaleString()}
//                               placement="top"
//                             >
//                               <span>
//                                 {formatDistanceToNow(new Date(value), {
//                                   addSuffix: true,
//                                 })}
//                               </span>
//                             </CTooltip>
//                           ) : (
//                             <span className="fw-medium">{String(value)}</span>
//                           )}
//                         </CTableDataCell>
//                       </CTableRow>
//                     ))}
//                 </CTableBody>
//               </CTable>

//               <div className="my-4">
//                 {(() => {
//                   const images = [
//                     {
//                       image: formData.oiling_need_for_motors_image,
//                       title: "Motors Oiling Image",
//                     },
//                     {
//                       image: formData.physical_condition_of_transPipe_image,
//                       title: "Trans Pipe Image",
//                     },
//                     {
//                       image: formData.physical_condition_of_channel_image,
//                       title: "Channel Image",
//                     },
//                     {
//                       image:
//                         formData.physical_condition_of_top_bottom_cover_image,
//                       title: "Top Bottom Cover Image",
//                     },
//                     {
//                       image: formData.oiling_need_for_bearing_condition_image,
//                       title: "Bearing Oiling Image",
//                     },
//                     {
//                       image: formData.oiling_need_for_coupling_image,
//                       title: "Coupling Oiling Image",
//                     },
//                   ].filter((item) => item.image);

//                   if (images.length === 0) {
//                     return (
//                       <div className="text-center text-muted py-3">
//                         No Preventive Maintenance Images Available
//                       </div>
//                     );
//                   }

//                   return (
//                     <CCarousel controls={images.length > 1} indicators>
//                       {images.map((item, index) => (
//                         <CCarouselItem key={index}>
//                           <div
//                             style={{
//                               height: "400px",
//                               display: "flex",
//                               justifyContent: "center",
//                               alignItems: "center",
//                               overflow: "hidden",
//                             }}
//                           >
//                             <Link to={item.image} target="_blank">
//                               <CImage
//                                 className="d-block mx-auto"
//                                 src={item.image}
//                                 alt={item.title}
//                                 style={{
//                                   maxHeight: "100%",
//                                   maxWidth: "70%",
//                                   objectFit: "contain",
//                                   display: "block",
//                                   margin: "0 auto",
//                                 }}
//                               />
//                             </Link>
//                           </div>
//                           <div className="carousel-caption d-md-block bg-dark bg-opacity-50 p-2 rounded">
//                             <h5>{item.title}</h5>
//                           </div>
//                         </CCarouselItem>
//                       ))}
//                     </CCarousel>
//                   );
//                 })()}
//               </div>

//               {formData.last_activity && (
//                 <LastActivity lastactivity={formData.last_activity} />
//               )}
//             </>
//           )}
//         </CModalBody>
//       </CModal>
//     </div>
//   );
// };

// export default PreventiveMaintanancrDashboard;

import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import toast from "react-hot-toast";
import TayproLogo from "../../../assets/brand/logofordarkbg.png";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CFormSelect,
  CFormInput,
  CButton,
  CBadge,
  CAvatar,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CTooltip,
  CProgress,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CTableBody,
} from "@coreui/react";

import {
  Calendar,
  MapPin,
  User,
  CheckCircle2,
  AlertTriangle,
  History,
  Download,
  FilterX,
  ZoomIn,
  ZoomOut,
  X,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Wrench,
  Droplets,
  AlignHorizontalJustifyCenter,
  Search,
  Ban,
  Bot,
  Image,
  Building2,
  ClipboardList,
} from "lucide-react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import SubscriptionExpiryCard from "../../../components/SubscriptionExpiryCard";
import { Link } from "react-router-dom";
import CIcon from "@coreui/icons-react";
import { useSelector } from "react-redux";
import { cilBell } from "@coreui/icons";

// ─── Reducer ─────────────────────────────────────────────────────────────────
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_PM_REQUEST":
      return {
        ...state,
        pmloading: true,
        error: "",
        preventivemaintanance: [],
      };
    case "FETCH_PM_SUCCESS":
      return {
        ...state,
        pmloading: false,
        preventivemaintanance: action.payload,
      };
    case "FETCH_PM_FAIL":
      return {
        ...state,
        pmloading: false,
        error: action.payload,
        subscriptiondata: action.subscriptiondata,
        subscriptionStatus: action.subscriptionStatus,
      };
    case "FETCH_SITES_REQUEST":
      return { ...state, loadingSites: true, sitesError: "" };
    case "FETCH_SITES_SUCCESS":
      return { ...state, loadingSites: false, sites: action.payload };
    case "FETCH_SITES_FAIL":
      return { ...state, loadingSites: false, sitesError: action.payload };
    default:
      return state;
  }
};

// ─── Image Lightbox ───────────────────────────────────────────────────────────
const ImageModal = ({ images, initialIndex, onClose }) => {
  const [idx, setIdx] = useState(initialIndex || 0);
  const [zoom, setZoom] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const current = images[idx];
  const zoomIn = () => setZoom((z) => Math.min(z + 0.25, 4));
  const zoomOut = () => {
    setZoom((z) => Math.max(z - 0.25, 0.5));
    setPos({ x: 0, y: 0 });
  };
  const reset = () => {
    setZoom(1);
    setPos({ x: 0, y: 0 });
  };
  const prev = () => {
    setIdx((i) => (i - 1 + images.length) % images.length);
    reset();
  };
  const next = () => {
    setIdx((i) => (i + 1) % images.length);
    reset();
  };

  const handleMouseDown = (e) => {
    if (zoom <= 1) return;
    setDragging(true);
    setStartPos({ x: e.clientX - pos.x, y: e.clientY - pos.y });
  };
  const handleMouseMove = (e) => {
    if (dragging)
      setPos({ x: e.clientX - startPos.x, y: e.clientY - startPos.y });
  };
  const handleMouseUp = () => setDragging(false);
  const handleWheel = (e) => {
    e.preventDefault();

    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - rect.width / 2;
    const mouseY = e.clientY - rect.top - rect.height / 2;

    setZoom((prevZoom) => {
      const nextZoom = Math.min(
        Math.max(prevZoom + (e.deltaY < 0 ? 0.25 : -0.25), 0.5),
        4,
      );

      const scaleFactor = nextZoom / prevZoom;

      setPos((prevPos) => ({
        x: prevPos.x - mouseX * (scaleFactor - 1),
        y: prevPos.y - mouseY * (scaleFactor - 1),
      }));

      return nextZoom;
    });
  };

  const handleDoubleClick = () => {
    if (zoom === 1) {
      setZoom(2);
    } else {
      reset();
    }
  };
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "Escape") onClose();
      else if (e.key === "+") zoomIn();
      else if (e.key === "-") zoomOut();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [idx, zoom]);

  return (
    <CModal
      visible
      onClose={onClose}
      backdrop="static"
      size="xl"
      alignment="center"
      fullscreen="lg" /* full-screen on lg and below */
    >
      <CModalHeader
        className="border-0 pb-1 d-flex align-items-center justify-content-between"
        closeButton={false}
      >
        <CModalTitle className="fs-6 fw-semibold  ">
          {/* <Search size={15} className="text-primary" /> */}
          <span> {current.label}</span>
        </CModalTitle>
        <CButton color="dark" variant="outline" size="sm" onClick={onClose}>
          <X size={14} className="me-1" />
          Close
        </CButton>
      </CModalHeader>

      <CModalBody
        className="p-0 bg-dark"
        style={{ minHeight: 480, position: "relative", overflow: "hidden" }}
      >
        <div
          style={{
            width: "100%",
            height: 480,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            userSelect: "none",
            cursor: zoom > 1 ? (dragging ? "grabbing" : "grab") : "default",
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          onDoubleClick={handleDoubleClick}
        >
          <img
            src={current.src}
            alt={current.label}
            draggable={false}
            style={{
              maxHeight: "100%",
              maxWidth: "100%",
              objectFit: "contain",
              transform: `scale(${zoom}) translate(${pos.x / zoom}px, ${pos.y / zoom}px)`,
              transition: dragging ? "none" : "transform 0.15s ease",
            }}
          />
        </div>

        {images.length > 1 && (
          <>
            <CButton
              color="dark"
              variant="ghost"
              style={{
                position: "absolute",
                left: 8,
                top: "50%",
                transform: "translateY(-50%)",
                opacity: 0.85,
              }}
              onClick={prev}
            >
              <ChevronLeft size={22} color="#fff" />
            </CButton>
            <CButton
              color="dark"
              variant="ghost"
              style={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
                opacity: 0.85,
              }}
              onClick={next}
            >
              <ChevronRight size={22} color="#fff" />
            </CButton>
          </>
        )}

        <div
          style={{
            position: "absolute",
            bottom: 12,
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(0,0,0,0.55)",
            borderRadius: 20,
            padding: "4px 14px",
            color: "#fff",
            fontSize: 12,
          }}
        >
          {idx + 1} / {images.length}
        </div>
      </CModalBody>

      <CModalFooter className="border-0 d-flex justify-content-between align-items-center py-2">
        <div className="d-flex gap-2">
          <CTooltip content="Zoom out (-)">
            <CButton
              color="secondary"
              variant="outline"
              size="sm"
              onClick={zoomOut}
              disabled={zoom <= 0.5}
            >
              <ZoomOut size={15} />
            </CButton>
          </CTooltip>
          <CButton
            color="secondary"
            variant="outline"
            size="sm"
            onClick={reset}
            style={{ minWidth: 54, fontSize: 12 }}
          >
            {Math.round(zoom * 100)}%
          </CButton>
          <CTooltip content="Zoom in (+)">
            <CButton
              color="secondary"
              variant="outline"
              size="sm"
              onClick={zoomIn}
              disabled={zoom >= 4}
            >
              <ZoomIn size={15} />
            </CButton>
          </CTooltip>
          <CTooltip content="Reset zoom">
            <CButton
              color="secondary"
              variant="outline"
              size="sm"
              onClick={reset}
            >
              <RotateCcw size={15} />
            </CButton>
          </CTooltip>
        </div>
        <span className="text-muted" style={{ fontSize: 11 }}>
          Arrow keys · +/− zoom · Esc close
        </span>
      </CModalFooter>
    </CModal>
  );
};

// ─── Thumbnail ────────────────────────────────────────────────────────────────
const Thumbnail = ({ src, label, onClick }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={`View: ${label}`}
      style={{
        width: 56,
        height: 56,
        borderRadius: 8,
        overflow: "hidden",
        border: "1.5px solid var(--cui-border-color)",
        cursor: "pointer",
        flexShrink: 0,
        position: "relative",
      }}
    >
      <img
        src={src}
        alt={label}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: hovered ? "rgba(0,0,0,0.4)" : "transparent",
          transition: "background 0.15s",
        }}
      >
        {hovered && <Search size={18} color="#fff" />}
      </div>
    </div>
  );
};

// ─── Badges ───────────────────────────────────────────────────────────────────
const CondBadge = ({ val }) => {
  if (!val)
    return (
      <CBadge color="secondary" shape="rounded-pill">
        N/A
      </CBadge>
    );
  const v = String(val).toLowerCase();
  if (v === "ok")
    return (
      <CBadge
        color="success"
        shape="rounded-pill"
        className="d-inline-flex align-items-center gap-1"
      >
        <CheckCircle2 size={11} />
        OK
      </CBadge>
    );
  if (v === "yes")
    return (
      <CBadge
        color="warning"
        textColor="dark"
        shape="rounded-pill"
        className="d-inline-flex align-items-center gap-1"
      >
        <AlertTriangle size={11} />
        Yes
      </CBadge>
    );
  if (v === "no")
    return (
      <CBadge
        color="light"
        textColor="secondary"
        shape="rounded-pill"
        className="d-inline-flex align-items-center gap-1"
      >
        <Ban size={11} />
        No
      </CBadge>
    );
  return (
    <CBadge color="secondary" shape="rounded-pill">
      {val}
    </CBadge>
  );
};

const BoolBadge = ({ val }) => {
  const isYes = val === "Yes" || val === true || val === "true";
  return isYes ? (
    <CBadge
      color="danger"
      shape="rounded-pill"
      className="d-inline-flex align-items-center gap-1"
    >
      <AlertTriangle size={11} />
      Yes
    </CBadge>
  ) : (
    <CBadge
      color="success"
      shape="rounded-pill"
      className="d-inline-flex align-items-center gap-1"
    >
      <CheckCircle2 size={11} />
      No
    </CBadge>
  );
};

// ─── Check Section ────────────────────────────────────────────────────────────
const CheckSection = ({ title, Icon, checks, onImageClick }) => (
  <div className="h-100">
    <div className="d-flex align-items-center gap-2 mb-3">
      <Icon size={15} className="text-primary" />
      <span
        className="fw-semibold text-uppercase"
        style={{
          fontSize: 11,
          letterSpacing: "0.06em",
          color: "var(--cui-secondary-color)",
        }}
      >
        {title}
      </span>
    </div>
    <div className="d-flex flex-column gap-2">
      {checks.map((c) => (
        <div
          key={c.label}
          className="d-flex align-items-center rounded p-2"
          style={{ background: "var(--cui-tertiary-bg)", gap: 8 }}
        >
          <span className="text-muted" style={{ fontSize: 12, flex: 1 }}>
            {c.label}
          </span>
          <CondBadge val={c.condition} />
          {c.image ? (
            <Thumbnail
              src={c.image}
              label={c.label}
              onClick={() => onImageClick(c)}
            />
          ) : (
            <div style={{ width: 56, flexShrink: 0 }} />
          )}
        </div>
      ))}
    </div>
  </div>
);

// ─── Robot PM Card ────────────────────────────────────────────────────────────
const RobotPMCard = ({ record }) => {
  const [showActivity, setShowActivity] = useState(false);
  const [lightboxImages, setLightboxImages] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const physicalChecks = [
    {
      label: "TransPipe",
      condition: record.physical_condition_of_transPipe_condition,
      image: record.physical_condition_of_transPipe_image,
    },
    {
      label: "Channel",
      condition: record.physical_condition_of_channel_condition,
      image: record.physical_condition_of_channel_image,
    },
    {
      label: "Top / Bottom cover",
      condition: record.physical_condition_of_top_bottom_cover_condition,
      image: record.physical_condition_of_top_bottom_cover_image,
    },
  ];

  const oilingChecks = [
    {
      label: "Bearing",
      condition: record.oiling_need_for_bearing_condition,
      image: record.oiling_need_for_bearing_condition_image,
    },
    {
      label: "Coupling",
      condition: record.oiling_need_for_coupling_condition,
      image: record.oiling_need_for_coupling_image,
    },
    {
      label: "Motors",
      condition: record.oiling_need_for_motors_condition,
      image: record.oiling_need_for_motors_image,
    },
  ];

  const alignmentChecks = [
    { label: "MF clothes", condition: record.mf_clothes_alignment },
    { label: "Wheels alignment", condition: record.wheels_alignment },
    { label: "Wheels loose?", condition: record.is_wheels_loose, isBool: true },
    {
      label: "Nut-bolts loose?",
      condition: record.is_nutbolt_loose,
      isBool: true,
    },
  ];

  const allImages = [
    ...physicalChecks
      .filter((c) => c.image)
      .map((c) => ({ src: c.image, label: c.label })),
    ...oilingChecks
      .filter((c) => c.image)
      .map((c) => ({ src: c.image, label: c.label })),
  ];

  const openLightbox = (check) => {
    const i = allImages.findIndex((img) => img.src === check.image);
    setLightboxIndex(i >= 0 ? i : 0);
    setLightboxImages(allImages);
  };

  const hasIssue =
    record.oiling_need_for_motors_condition === "Yes" ||
    record.oiling_need_for_bearing_condition === "Yes" ||
    record.oiling_need_for_coupling_condition === "Yes" ||
    record.is_wheels_loose === "Yes" ||
    record.is_wheels_loose === true ||
    record.is_nutbolt_loose === "Yes" ||
    record.is_nutbolt_loose === true;

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader className="d-flex justify-content-between align-items-start flex-wrap gap-3 py-3">
          <div className="d-flex align-items-center gap-3">
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                flexShrink: 0,
                background: hasIssue
                  ? "var(--cui-danger-bg-subtle)"
                  : "var(--cui-success-bg-subtle)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Bot
                size={22}
                color={hasIssue ? "var(--cui-danger)" : "var(--cui-success)"}
              />
            </div>
            <div>
              <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                <CBadge color="success" className="p-2 fs-6">
                  {record.robot_no}
                </CBadge>
                <CBadge color="info" className="p-2 fs-6">
                  {record.robot_type}
                </CBadge>
                <CBadge
                  color="secondary"
                  className="p-2 fs-6"
                  // shape="rounded-pill"
                  style={{ fontSize: 10 }}
                >
                  {record.pm_id}
                </CBadge>
              </div>
              <div
                className="d-flex flex-wrap gap-3"
                style={{ fontSize: 12, color: "var(--cui-secondary-color)" }}
              >
                <span className="d-flex align-items-center gap-1">
                  <MapPin size={12} />
                  {record.site_name} · {record.site_location}
                </span>
                <span className="d-flex align-items-center gap-1">
                  <Calendar size={12} />
                  Created:
                  {new Date(record.createdAt).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                  })}
                </span>
              </div>
            </div>
          </div>
        </CCardHeader>

        <CCardBody className="pt-3 pb-2">
          <CRow className="g-3">
            <CCol md={4}>
              <CheckSection
                title="Physical condition"
                Icon={Wrench}
                checks={physicalChecks}
                onImageClick={openLightbox}
              />
            </CCol>
            <CCol md={4}>
              <CheckSection
                title="Oiling status"
                Icon={Droplets}
                checks={oilingChecks}
                onImageClick={openLightbox}
              />
            </CCol>
            <CCol md={4}>
              <div className="h-100">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <AlignHorizontalJustifyCenter
                    size={15}
                    className="text-primary"
                  />
                  <span
                    className="fw-semibold text-uppercase"
                    style={{
                      fontSize: 11,
                      letterSpacing: "0.06em",
                      color: "var(--cui-secondary-color)",
                    }}
                  >
                    Alignment & fasteners
                  </span>
                </div>
                <div className="d-flex flex-column gap-2">
                  {alignmentChecks.map((c) => (
                    <div
                      key={c.label}
                      className="d-flex align-items-center justify-content-between rounded p-2"
                      style={{ background: "var(--cui-tertiary-bg)" }}
                    >
                      <span className="text-muted" style={{ fontSize: 12 }}>
                        {c.label}
                      </span>
                      {c.isBool ? (
                        <BoolBadge val={c.condition} />
                      ) : (
                        <CondBadge val={c.condition} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CCol>
          </CRow>

          {/* Photo strip */}
          {allImages.length > 0 && (
            <div
              className="mt-3 pt-3"
              style={{ borderTop: "1px solid var(--cui-border-color)" }}
            >
              <p
                className="text-muted mb-2 d-flex align-items-center gap-1"
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                <Image size={13} />
                Photos ({allImages.length})
              </p>
              <div className="d-flex flex-wrap gap-2">
                {allImages.map((img, i) => (
                  <CTooltip key={i} content={img.label}>
                    <div>
                      <Thumbnail
                        src={img.src}
                        label={img.label}
                        onClick={() => {
                          setLightboxIndex(i);
                          setLightboxImages(allImages);
                        }}
                      />
                    </div>
                  </CTooltip>
                ))}
              </div>
            </div>
          )}

          {/* Activity log */}
          {record.last_activity?.length > 0 && (
            <div
              className="mt-3 pt-2"
              style={{ borderTop: "1px solid var(--cui-border-color)" }}
            >
              <CButton
                color="link"
                size="sm"
                className="p-2 text-decoration-none text-muted d-flex align-items-center gap-1"
                onClick={() => setShowActivity(!showActivity)}
              >
                <History size={13} />
                {showActivity ? "Hide" : "Show"} activity log (
                {record.last_activity.length})
              </CButton>
              {showActivity && (
                <div className="mt-2 d-flex flex-column gap-2">
                  {record.last_activity.map((act, i) => (
                    <div
                      key={i}
                      className="d-flex align-items-start gap-3 rounded p-2"
                      style={{ background: "var(--cui-tertiary-bg)" }}
                    >
                      <CAvatar
                        src={act.profile_image}
                        size="md"
                        // style={{ flexShrink: 0 }}
                      />
                      <div>
                        <div
                          className="small"
                          dangerouslySetInnerHTML={{ __html: act.details }}
                        />
                        <div
                          className="d-flex align-items-center gap-2 mt-1"
                          style={{
                            fontSize: 11,
                            color: "var(--cui-secondary-color)",
                          }}
                        >
                          <span className="d-flex align-items-center gap-1">
                            <User size={11} />
                            {act.email}
                          </span>
                          <span className="d-flex align-items-center gap-1">
                            <Calendar size={11} />
                            {new Date(act.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CCardBody>
      </CCard>

      {lightboxImages && (
        <ImageModal
          images={lightboxImages}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxImages(null)}
        />
      )}
    </>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const PreventiveMaintenanceList = () => {
  const [
    {
      preventivemaintanance,
      pmloading,
      loadingSites,
      sites,
      error,
      subscriptiondata,
      subscriptionStatus,
    },
    dispatch,
  ] = useReducer(reducer, {
    sitesError: "",
    preventivemaintanance: [],
    loadingSites: false,
    sites: [],
    pmloading: true,
    error: "",
    subscriptionStatus: "",
    subscriptiondata: {},
  });

  const [site_id, setSiteId] = useState("all");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const userInfo = useSelector((state) => state.userInfo);
  useEffect(() => {
    const fetchSites = async () => {
      dispatch({ type: "FETCH_SITES_REQUEST" });
      try {
        const r = await axios.get(`/api/v1/sites`, { withCredentials: true });
        dispatch({ type: "FETCH_SITES_SUCCESS", payload: r.data.data });
      } catch (e) {
        dispatch({
          type: "FETCH_SITES_FAIL",
          payload: e.response?.data?.error || e.response?.data?.message,
        });
      }
    };

    const fetchPM = async () => {
      dispatch({ type: "FETCH_PM_REQUEST" });
      try {
        const r = await axios.get(
          `/api/v1/preventivemaintenances/sites-with-date/${startDate}/${endDate}/${site_id}`,
          { withCredentials: true },
        );
        dispatch({ type: "FETCH_PM_SUCCESS", payload: r.data });
      } catch (e) {
        dispatch({
          type: "FETCH_PM_FAIL",
          payload: e.response?.data?.error || e.response?.data?.message,
          subscriptiondata: e.response?.data?.data,
          subscriptionStatus: e.response?.data?.subscriptionStatus,
        });
        toast.error(e.response?.data?.error || e.response?.data?.message);
      }
    };

    fetchSites();
    fetchPM();
  }, [endDate, site_id, startDate]);

  // const exportToExcel = () => {
  //   const allRobots =
  //     preventivemaintanance.data?.flatMap((c) => c.robots) || [];
  //   if (!allRobots.length) {
  //     toast.error("No data found to export");
  //     return;
  //   }
  //   const rows = allRobots.map((r, i) => ({
  //     "Sr.": i + 1,
  //     "PM ID": r.pm_id,
  //     "Robot No": r.robot_no,
  //     "Robot Type": r.robot_type,
  //     Site: r.site_name,
  //     Location: r.site_location,
  //     Created: r.createdAt?.slice(0, 10),
  //     TransPipe: r.physical_condition_of_transPipe_condition,
  //     Channel: r.physical_condition_of_channel_condition,
  //     "Top/Bottom Cover": r.physical_condition_of_top_bottom_cover_condition,
  //     "Bearing Oiling": r.oiling_need_for_bearing_condition,
  //     "Coupling Oiling": r.oiling_need_for_coupling_condition,
  //     "Motor Oiling": r.oiling_need_for_motors_condition,
  //     "MF Clothes": r.mf_clothes_alignment,
  //     "Wheels Align": r.wheels_alignment,
  //     "Wheels Loose": r.is_wheels_loose,
  //     "Nut-Bolts Loose": r.is_nutbolt_loose,
  //   }));
  //   const ws = XLSX.utils.json_to_sheet(rows);
  //   const wb = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, "PM Records");
  //   const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  //   saveAs(
  //     new Blob([buf], {
  //       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //     }),
  //     `PM_${site_id}_${startDate}_${endDate}.xlsx`,
  //   );
  // };

  const exportToExcel = () => {
    const table = document.querySelector("table");
    if (!table) {
      console.error("Table not found!");
      return;
    }
    if (preventivemaintanance.length === 0) {
      toast.error("No data found to export");
      return;
    }

    // Convert table to worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.table_to_sheet(table, { raw: true });

    XLSX.utils.book_append_sheet(workbook, worksheet, "Preventive Maintenance");

    // Write to file
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(
      data,
      `${site_id}_${startDate}_${endDate}_Site_Preventive_Maintenance.xlsx`,
    );
  };

  const resetFilters = () => {
    setSiteId("all");
    const today = new Date().toISOString().split("T")[0];
    setStartDate(today);
    setEndDate(today);
  };

  const checkStatus = [
    "subscriptionSitesAssigned",
    "subscriptionFound",
    "subscriptionaRenewStatus",
    "subscriptionPaymentStatus",
    "subscriptionPlanAccess",
  ];
  const allRobots = preventivemaintanance.data?.flatMap((c) => c.robots) || [];
  const siteCount =
    preventivemaintanance.site_count ??
    (site_id === "all"
      ? new Set(allRobots.map((r) => r.site_id).filter(Boolean)).size
      : allRobots.length
        ? 1
        : 0);
  const recordCount = preventivemaintanance.record_count ?? allRobots.length;
  const issueCount = allRobots.filter(
    (r) =>
      r.oiling_need_for_motors_condition === "Yes" ||
      r.oiling_need_for_bearing_condition === "Yes" ||
      r.oiling_need_for_coupling_condition === "Yes" ||
      r.is_wheels_loose === "Yes" ||
      r.is_wheels_loose === true ||
      r.is_nutbolt_loose === "Yes" ||
      r.is_nutbolt_loose === true,
  ).length;
  const compliance =
    allRobots.length > 0
      ? Math.round(((allRobots.length - issueCount) / allRobots.length) * 100)
      : 100;

  if (pmloading) return <LoadingSpinner />;
  if (checkStatus.includes(subscriptionStatus))
    return (
      <SubscriptionExpiryCard
        data={subscriptiondata}
        subscriptionStatus={subscriptionStatus}
        error={error}
      />
    );

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

  return (
    <div className="p-3">
      {/* Header */}
      <CRow className="mb-4 align-items-center">
        <CCol>
          <h5 className="fw-bold mb-0">Preventive Maintenance Records</h5>
          <span className="text-muted" style={{ fontSize: 12 }}>
            Doc No: TPL-12 · Rev: 1 · Revised by: Abhay Singh
          </span>
        </CCol>
        {/* <CCol xs="auto">
          <img
            src={TayproLogo}
            alt="Taypro"
            style={{ height: 34, objectFit: "contain" }}
          />
        </CCol> */}
      </CRow>
      <div className="d-flex justify-content-end mb-3">
        <Link
          className="btn btn-sm btn-danger m-1"
          to={`/${adminroute}/preventive-maintanance-dashboard/view`}
        >
          View Sitewise
        </Link>
        {!["Master User", "Project User", "Service User"].includes(
          userInfo?.role,
        ) && (
          <Link
            className="btn btn-sm btn-primary m-1"
            to={`/${adminroute}/preventive-maintanance-dashboard/create-pm`}
          >
            Create New
          </Link>
        )}
        <Link
          className="btn btn-sm btn-secondary m-1 d-flex justify-content-center align-items-center"
          to={`/${adminroute}/preventive-maintanance-dashboard/preventive-maintanance-notifications`}
        >
          All PM Activity
          <CIcon icon={cilBell} />
        </Link>
      </div>
      {/* Filters */}
      <CCard className="mb-4">
        <CCardBody className="py-3">
          <CRow className="g-2 align-items-end">
            <CCol md={3} xs={12}>
              <label className="form-label small fw-semibold mb-1">Site</label>
              <CFormSelect
                value={site_id}
                onChange={(e) => setSiteId(e.target.value)}
                size="sm"
              >
                <option value="all">All sites</option>
                {loadingSites ? (
                  <option disabled>Loading...</option>
                ) : (
                  sites?.map((item) => (
                    <option key={item.site_id} value={item.site_id}>
                      {item.site_id}
                    </option>
                  ))
                )}
              </CFormSelect>
            </CCol>
            <CCol md={3} xs={6}>
              <label className="form-label small fw-semibold mb-1">From</label>
              <CFormInput
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                size="sm"
              />
            </CCol>
            <CCol md={3} xs={6}>
              <label className="form-label small fw-semibold mb-1">To</label>
              <CFormInput
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                size="sm"
              />
            </CCol>
            <CCol md={3} xs={12} className="d-flex gap-2">
              <CButton
                color="primary"
                size="sm"
                className="flex-grow-1 d-flex align-items-center justify-content-center gap-1"
                onClick={exportToExcel}
              >
                <Download size={14} />
                Export
              </CButton>
              <CTooltip content="Reset filters">
                <CButton
                  color="secondary"
                  variant="outline"
                  size="sm"
                  onClick={resetFilters}
                >
                  <FilterX size={15} />
                </CButton>
              </CTooltip>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {/* Summary */}
      <CRow className="g-3 mb-4">
        <CCol sm={6} lg={4}>
          <CCard className="h-100 border-0" style={{ background: "var(--cui-tertiary-bg)" }}>
            <CCardBody className="py-3 d-flex align-items-center gap-3">
              <Building2 size={28} className="text-primary flex-shrink-0" />
              <div>
                <div className="small text-medium-emphasis">Sites in period</div>
                <div className="fs-4 fw-semibold mb-0">{siteCount}</div>
                <div className="small text-muted">
                  {startDate} to {endDate}
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={6} lg={4}>
          <CCard className="h-100 border-0" style={{ background: "var(--cui-tertiary-bg)" }}>
            <CCardBody className="py-3 d-flex align-items-center gap-3">
              <ClipboardList size={28} className="text-success flex-shrink-0" />
              <div>
                <div className="small text-medium-emphasis">PM records generated</div>
                <div className="fs-4 fw-semibold mb-0">{recordCount}</div>
                <div className="small text-muted">
                  {site_id === "all" ? "All sites" : site_id}
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Records */}
      {allRobots.length === 0 ? (
        <CCard
          className="text-center py-5 border-0"
          style={{ background: "var(--cui-tertiary-bg)" }}
        >
          <CCardBody>
            <FilterX size={40} className="text-muted mb-3" />
            <p className="fw-semibold mb-1">No PM records found</p>
            <p className="text-muted small mb-3">
              Try adjusting the date range or selecting a different site.
            </p>
            <CButton
              color="secondary"
              variant="outline"
              size="sm"
              className="d-inline-flex align-items-center gap-1"
              onClick={resetFilters}
            >
              <RotateCcw size={13} />
              Reset filters
            </CButton>
          </CCardBody>
        </CCard>
      ) : (
        preventivemaintanance.data?.map((client) =>
          client.robots.map((record) => (
            <RobotPMCard key={record._id || record.pm_id} record={record} />
          )),
        )
      )}
      <div className="table-responsive d-none">
        <CTable responsive bordered hover>
          <CTableHead>
            {/* Top Row - Branding & Title */}
            <CTableRow className=" text-white">
              <CTableHeaderCell colSpan={1} className="text-center">
                <CAvatar
                  src={TayproLogo}
                  alt="Taypro Logo"
                  className="sidebar-brand-full logo"
                  style={{
                    height: "60px",
                    width: "180px",
                    objectFit: "contain",
                  }}
                />
              </CTableHeaderCell>
              <CTableHeaderCell colSpan={2} className="text-center">
                <h3>Preventive Maintenance Checklist - Quarterly</h3>
              </CTableHeaderCell>
              <CTableHeaderCell colSpan={1}>Doc. No. : TPL-12</CTableHeaderCell>

              <CTableHeaderCell colSpan={1}>Rev. No.: 1</CTableHeaderCell>

              <CTableHeaderCell>Revised By</CTableHeaderCell>
              <CTableHeaderCell className="fw-bold">
                Abhay Singh
              </CTableHeaderCell>
              <CTableHeaderCell>Start Date</CTableHeaderCell>
              <CTableHeaderCell className="fw-bold">
                {preventivemaintanance.start_date}
              </CTableHeaderCell>
              <CTableHeaderCell>End Date</CTableHeaderCell>
              <CTableHeaderCell colSpan={2} className="fw-bold">
                {preventivemaintanance.end_date}
              </CTableHeaderCell>
            </CTableRow>

            {/* Meta Information Row */}
            <CTableRow className="bg-light">
              <CTableHeaderCell>Site Id</CTableHeaderCell>
              <CTableHeaderCell className="fw-bold">
                {preventivemaintanance.site_id}
              </CTableHeaderCell>
              <CTableHeaderCell colSpan={1}>Client</CTableHeaderCell>
              <CTableHeaderCell colSpan={1} className="fw-bold">
                {preventivemaintanance.site_name}
              </CTableHeaderCell>
              <CTableHeaderCell>Location</CTableHeaderCell>
              <CTableHeaderCell colSpan={2} className="fw-bold">
                {preventivemaintanance.site_location}
              </CTableHeaderCell>

              <CTableHeaderCell>Tech. Name</CTableHeaderCell>
              <CTableHeaderCell className="fw-bold">
                {preventivemaintanance.technician_present?.join(", ")}
              </CTableHeaderCell>

              <CTableHeaderCell>Robot Type</CTableHeaderCell>
              <CTableHeaderCell colSpan={2} className="fw-bold">
                Automatic
              </CTableHeaderCell>
            </CTableRow>

            {/* Main Table Header */}
            <CTableRow className="text-center ">
              <CTableHeaderCell style={{ maxWidth: "100px" }}>
                Sr. No
              </CTableHeaderCell>
              <CTableHeaderCell>Robot No</CTableHeaderCell>
              <CTableHeaderCell>Robot Type</CTableHeaderCell>
              <CTableHeaderCell>Created Date</CTableHeaderCell>

              <CTableHeaderCell>
                Physical Condition - TransPipe
              </CTableHeaderCell>
              <CTableHeaderCell>Physical Condition - Channel</CTableHeaderCell>
              <CTableHeaderCell>Oiling Needed (Bearing)</CTableHeaderCell>
              <CTableHeaderCell>Oiling Needed (Motors)</CTableHeaderCell>
              <CTableHeaderCell>MF Clothes Alignment</CTableHeaderCell>
              <CTableHeaderCell>Wheels Alignment</CTableHeaderCell>
              <CTableHeaderCell>Are Wheels Loose?</CTableHeaderCell>
              <CTableHeaderCell>Are Nut-Bolts Loose?</CTableHeaderCell>
            </CTableRow>
          </CTableHead>

          <CTableBody>
            {pmloading ? (
              <LoadingSpinner />
            ) : preventivemaintanance.data?.length > 0 ? (
              preventivemaintanance.data.map((client, index) =>
                client.robots.map((record, idx) => (
                  <CTableRow key={idx} className="text-center">
                    <CTableDataCell>{idx + 1}</CTableDataCell>
                    <CTableDataCell>{record.robot_no}</CTableDataCell>
                    <CTableDataCell>{record.robot_type}</CTableDataCell>
                    <CTableDataCell>
                      {record.createdAt ? record.createdAt.slice(0, 10) : "NA"}
                    </CTableDataCell>
                    <CTableDataCell>
                      {record.physical_condition_of_transPipe_condition}
                    </CTableDataCell>
                    <CTableDataCell>
                      {record.physical_condition_of_channel_condition}
                    </CTableDataCell>
                    <CTableDataCell>
                      {record.oiling_need_for_bearing_condition}
                    </CTableDataCell>
                    <CTableDataCell>
                      {record.oiling_need_for_motors_condition}
                    </CTableDataCell>
                    <CTableDataCell>
                      {record.mf_clothes_alignment}
                    </CTableDataCell>
                    <CTableDataCell>{record.wheels_alignment}</CTableDataCell>
                    <CTableDataCell>
                      {record.is_wheels_loose ? "Yes" : "No"}
                    </CTableDataCell>
                    <CTableDataCell>
                      {record.is_nutbolt_loose ? "Yes" : "No"}
                    </CTableDataCell>
                  </CTableRow>
                )),
              )
            ) : (
              <CTableRow>
                <CTableDataCell colSpan={15} className="text-start">
                  <CBadge className="badge bg-danger">No Data Found</CBadge>
                </CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>
      </div>
    </div>
  );
};

export default PreventiveMaintenanceList;
