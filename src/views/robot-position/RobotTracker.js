// import React, { useEffect, useReducer, useRef, useState } from "react";
// import socket from "../../components/Socket";
// import RobotImg from "../../assets/images/robot.png";
// import {
//   CBadge,
//   CButton,
//   CImage,
//   COffcanvas,
//   COffcanvasBody,
//   COffcanvasHeader,
//   COffcanvasTitle,
//   CProgress,
//   CProgressBar,
//   CTable,
//   CTableBody,
//   CTableDataCell,
//   CTableHeaderCell,
//   CTableRow,
// } from "@coreui/react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import toast from "react-hot-toast";
// import LoadingSpinner from "../../components/LoadingSpinner";
// import CIcon from "@coreui/icons-react";
// import { cilTrash, cilX } from "@coreui/icons";
// import { Eye } from "lucide-react";
// const reducer = (state, action) => {
//   switch (action.type) {
//     case "FETCH_REQUEST":
//       return { ...state, loading: true, error: "" };
//     case "FETCH_SUCCESS":
//       return { ...state, loading: false, robots: action.payload };
//     case "FETCH_FAIL":
//       return { ...state, loading: false, error: action.payload };
//     case "DELETE_REQUEST":
//       return { ...state, loadingDelete: true };
//     case "DELETE_SUCCESS":
//       return { ...state, loadingDelete: false };
//     case "DELETE_FAIL":
//       return { ...state, loadingDelete: false };

//     default:
//       return state;
//   }
// };

// const RobotTracker = () => {
//   const [
//     {
//       error,
//       robots,
//       loading,
//       loadingDelete,
//       loadingRobot,

//       loadingRobotError,
//     },
//     dispatch,
//   ] = useReducer(reducer, {
//     robots: [],
//     loading: true,
//     error: "",
//     loadingDelete: false,
//     loadingRobot: false,
//     loadingRobotError: "",
//   });

//   const authtoken = useSelector((state) => state.authtoken);
//   const scrollRefs = useRef({});
//   const robotsRef = useRef([]);
//   robotsRef.current = robots;
//   // const [selectedRobotNo, setSelectedRobotNo] = useState(null);
//   const [selectedRobotId, setSelectedRobotId] = useState(null);

//   const [sideBarVisible, setsideBarVisible] = useState(false);

//   // Fetch robot tracking data
//   useEffect(() => {
//     const fetchRobotTracking = async () => {
//       dispatch({ type: "FETCH_REQUEST" });
//       try {
//         const response = await axios.get("/api/v1/robot-tracking", {
//           headers: { Authorization: `Bearer ${authtoken}` },
//         });
//         dispatch({ type: "FETCH_SUCCESS", payload: response.data.data });
//       } catch (error) {
//         dispatch({
//           type: "FETCH_FAIL",
//           payload: error.response?.data?.error || error.message,
//         });
//         toast.error(error.response?.data?.error || error.message);
//       }
//     };
//     fetchRobotTracking();
//   }, [authtoken]);

//   // helper function outside component
//   const smoothScroll = (element, target, duration = 400) => {
//     const start = element.scrollLeft;
//     const change = target - start;
//     const startTime = performance.now();

//     const animateScroll = (currentTime) => {
//       const elapsed = currentTime - startTime;
//       const progress = Math.min(elapsed / duration, 1);
//       element.scrollLeft = start + change * progress;

//       if (progress < 1) {
//         requestAnimationFrame(animateScroll);
//       }
//     };

//     requestAnimationFrame(animateScroll);
//   };

//   useEffect(() => {
//     const handleUpdate = ({ tracking }) => {
//       const newPoint = parseInt(tracking.uplink.data, 10);

//       // Update robot state
//       dispatch({
//         type: "FETCH_SUCCESS",
//         payload: robotsRef.current.map((r) =>
//           r._id === tracking._id
//             ? {
//                 ...r,
//                 uplink: { ...r.uplink, ...tracking.uplink },
//                 comments: tracking.comments,
//                 cleaning: { ...r.cleaning, ...tracking.cleaning },
//                 track_details: [
//                   ...r.track_details,
//                   ...(tracking.track_details || []),
//                 ],
//                 updatedAt: new Date().toISOString(),
//               }
//             : r
//         ),
//       });

//       // Smooth scroll update
//       const robot = robotsRef.current.find((r) => r._id === tracking._id);

//       const el = scrollRefs.current[tracking._id];
//       if (robot && el) {
//         const L = robot.row_length || 1;
//         let segmentPct = 0;

//         // forward movement 19–29
//         if (newPoint >= 19 && newPoint <= 29) {
//           segmentPct = (newPoint - 19) / (29 - 19);
//         }
//         // reverse movement 31–40
//         else if (newPoint >= 31 && newPoint <= 40) {
//           segmentPct = (newPoint - 31) / (40 - 31);
//         } else {
//           segmentPct = newPoint / L;
//         }

//         const iconOffsetPx = segmentPct * L * 25; // 25px per point
//         const halfWidth = el.clientWidth / 2;

//         let targetScroll =
//           newPoint >= 19 && newPoint <= 29
//             ? iconOffsetPx - el.clientWidth * 0.25
//             : newPoint >= 31 && newPoint <= 40
//             ? iconOffsetPx - el.clientWidth * 0.75
//             : iconOffsetPx - halfWidth;

//         targetScroll = Math.max(
//           0,
//           Math.min(targetScroll, el.scrollWidth - el.clientWidth)
//         );

//         // smooth instead of instant
//         smoothScroll(el, targetScroll, 400);
//       }
//     };
//     // Remove before adding (ensures no duplicates)
//     socket.off("robotPositionUpdate", handleUpdate);
//     socket.on("robotPositionUpdate", handleUpdate);
//     return () => {
//       socket.off("robotPositionUpdate", handleUpdate);
//     };
//   }, [dispatch]);

// // Delete handler
// const deleteHandler = async (e, id) => {
//   e.preventDefault();
//   const confirmDelete = window.confirm(
//     "Are you sure you want to delete this robot tracking?"
//   );
//   if (!confirmDelete) return; // Exit if user cancels

//   dispatch({ type: "DELETE_REQUEST" });
//   try {
//     const response = await axios.delete(`/api/v1/robot-tracking/${id}`, {
//       headers: { Authorization: `Bearer ${authtoken}` },
//     });
//     dispatch({ type: "DELETE_SUCCESS" });
//     toast.success(response.data.message);
//   } catch (error) {
//     dispatch({ type: "DELETE_FAIL" });
//     toast.error(error.response?.data?.error || error.response?.data?.message);
//   }
// };

//   // const getRobotPhase = (pt, L, cleaning) => {
//   //

//   //   let phase,
//   //     badgeColor,
//   //     iconBorder,
//   //     segmentPct = 0;

//   //   // 🚩 Case 1: At Dock (point 11 only)
//   //   if (pt === 11) {
//   //     phase = "At Dock";
//   //     badgeColor = "success";
//   //     iconBorder = "#343a40";
//   //     segmentPct = 0;
//   //   }

//   //   // 🚩 Case 2: Cleaning Completed & At Dock (point 40 + finished)
//   //   else if (pt === 40 && cleaning.cleaning?.finish) {
//   //     phase = "Cleaning Completed & At Dock";
//   //     badgeColor = "dark";
//   //     iconBorder = "#000";
//   //     segmentPct = 0; // Dock position
//   //   }

//   //   // 🚩 Case 3: At Reverse Station (point 29)
//   //   else if (pt === 29) {
//   //     phase = "At Reverse Station";
//   //     badgeColor = "warning";
//   //     iconBorder = "#ffc107";
//   //     segmentPct = 1; // End of forward
//   //   }

//   //   // 🚩 Case 4: Ready for Reverse Cleaning (point 30)
//   //   else if (pt === 30) {
//   //     phase = "At Reverse Station (Ready for Reverse Cleaning)";
//   //     badgeColor = "info";
//   //     iconBorder = "#17a2b8";
//   //     segmentPct = 1; // Still at reverse station
//   //   }

//   //   // 🚩 Case 5: Forward Cleaning (points 20–28)
//   //   else if (pt >= 20 && pt <= 28) {
//   //     phase = "Forward Cleaning";
//   //     badgeColor = "success";
//   //     iconBorder = "#2eb85c";
//   //     segmentPct = (pt - 19) / (29 - 19); // Smooth placement
//   //   }

//   //   // 🚩 Case 6: Reverse Cleaning (points 31–39)
//   //   else if (pt >= 31 && pt <= 39) {
//   //     phase = "Reverse Cleaning";
//   //     badgeColor = "primary";
//   //     iconBorder = "#0d6efd";
//   //     segmentPct = (pt - 29) / (40 - 29); // Smooth placement
//   //   }

//   //   // 🚩 Case 7: At Dock (point 40 but not finished, or unknown)
//   //   else if (pt === 40) {
//   //     phase = "At Dock";
//   //     badgeColor = "success";
//   //     iconBorder = "#343a40";
//   //     segmentPct = 0;
//   //   }
//   //   // 🚩 Case 7: At Dock (point 40 but not finished, or unknown)
//   //   else if (pt !== 40 && !cleaning.cleaning.finish) {
//   //     phase = cleaning.cleaning.battery_dead
//   //       ? "Battery Dead"
//   //       : "Cleaning Cancelled";
//   //     badgeColor = "danger";
//   //     iconBorder = "#343a40";
//   //     segmentPct = 0;
//   //   }

//   //   // 🚩 Default
//   //   else {
//   //     phase = "At Dock";
//   //     badgeColor = "secondary";
//   //     iconBorder = "#6c757d";
//   //     segmentPct = pt / L;
//   //   }

//   //   return { phase, badgeColor, iconBorder, segmentPct };
//   // };

// const getRobotPhase = (pt, L, cleaning) => {
//   let phase,
//     badgeColor,
//     iconBorder,
//     segmentPct = 0;

//   // 🛑 Priority 1: Check for exceptional states first
//   if (cleaning.cleaning?.battery_dead) {
//     phase = "Battery Dead";
//     badgeColor = "danger";
//     iconBorder = "#dc3545";
//     segmentPct = pt / L;
//   } else if (cleaning.cleaning?.cleaning_cancelled) {
//     phase = "Cleaning Cancelled";
//     badgeColor = "danger";
//     iconBorder = "#6c757d";
//     segmentPct = pt / L;
//   }
//   // ✅ Normal flow conditions
//   else if (pt === 11) {
//     phase = "At Dock";
//     badgeColor = "success";
//     iconBorder = "#343a40";
//     segmentPct = 0;
//   } else if (pt === 40 && cleaning.cleaning?.finish) {
//     phase = "Cleaning Completed & At Dock";
//     badgeColor = "success";
//     iconBorder = "#000";
//     segmentPct = 0;
//   } else if (pt === 29) {
//     phase = "At Reverse Station";
//     badgeColor = "warning";
//     iconBorder = "#ffc107";
//     segmentPct = 1;
//   } else if (pt === 30) {
//     phase = "At Reverse Station (Ready for Reverse Cleaning)";
//     badgeColor = "info";
//     iconBorder = "#17a2b8";
//     segmentPct = 1;
//   } else if (pt >= 20 && pt <= 28) {
//     phase = "Forward Cleaning";
//     badgeColor = "success";
//     iconBorder = "#2eb85c";
//     segmentPct = (pt - 19) / (29 - 19);
//   } else if (pt >= 31 && pt <= 39) {
//     phase = "Reverse Cleaning";
//     badgeColor = "primary";
//     iconBorder = "#0d6efd";
//     segmentPct = (pt - 29) / (40 - 29);
//   } else if (pt === 40) {
//     phase = "At Dock";
//     badgeColor = "success";
//     iconBorder = "#343a40";
//     segmentPct = 0;
//   }
//   // Default fallback
//   else {
//     phase = "Unknown / Idle";
//     badgeColor = "secondary";
//     iconBorder = "#6c757d";
//     segmentPct = pt / L;
//   }

//   return { phase, badgeColor, iconBorder, segmentPct };
// };

//   function getCleaningPercentage(pt) {
//     let percentage = 0;
//     let distance = 0;
//     const totalSteps = 20; // 10 forward + 10 reverse

//     // 🚩 Forward cleaning (20–29 → 10 steps)
//     if (pt >= 20 && pt <= 29) {
//       distance = pt - 19; // 20 → 1, 29 → 10
//       percentage = (distance / totalSteps) * 100;
//     } else if (pt === 30) {
//       distance = 10; // 20 → 1, 29 → 10 30-19=11-1
//       percentage = (distance / totalSteps) * 100;
//     }
//     // 🚩 Reverse cleaning (31–40 → 10 steps)
//     else if (pt >= 31 && pt <= 40) {
//       distance = 10 + (pt - 30); // 31 → 11, 40 → 20
//       percentage = (distance / totalSteps) * 100;
//     }

//     return {
//       point: pt,
//       distanceCovered: distance,
//       totalDistance: totalSteps,
//       percentage: Math.round(percentage),
//     };
//   }

//   // const handleRobotClick = async (robot_no) => {
//   //   setSelectedRobotNo(robot_no);
//   //   setsideBarVisible(true);

//   // };
//   // State

//   // When clicking "View Tracking" (or similar button)
// const handleRobotClick = (robot) => {
//   setSelectedRobotId(robot._id);
//   setsideBarVisible(true);
// };
//   const selectedRobot = robots.find((r) => r._id === selectedRobotId);

//   return (
//     <div>
//       <span className="text-success">1 Meter = 25px</span>
//       {loading ? (
//         <LoadingSpinner />
//       ) : error ? (
//         error
//       ) : robots.length === 0 ? (
//         <div>No Robots Found</div>
//       ) : (
//         robots.map((item) => {
//           // const pt = parseInt(item.uplink?.data || "0", 10);
//           const lastreeivedPointInTracking =
//             item.track_details?.[item.track_details.length - 1]?.point || 0;

//           const L = item.row_length || 1;
//           // const progressPercent = (pt / L) * 100;

//           // const distanceCovered = pt;
//           const { phase, badgeColor, iconBorder, segmentPct } = getRobotPhase(
//             lastreeivedPointInTracking,
//             L,
//             item
//           );

//           // const { distanceCovered, totalDistance, percentage } =
//           //   getCleaningPercentage(lastreeivedPointInTracking);

// const iconOffsetPx = segmentPct * L * 25;
// const iconStyle =
//   phase === "Reverse Cleaning"
//     ? { right: `calc(${iconOffsetPx}px - 12px)`, left: "auto" }
//     : { left: `calc(${iconOffsetPx}px - 12px)`, right: "auto" };

//           return (
// <div className=" mx-2 border-bottom" key={item._id}>
//   <div className="p-2">
//     <div className="d-flex justify-content-between text-sm">
//       <span style={{ fontSize: "13px" }}>
//         {item.robot_no}{" "}
//         <CBadge color={badgeColor} className="ms-2 px-2">
//           {phase}
//         </CBadge>
//       </span>

//       <div className="d-flex justify-content-end align-items-center">
//         <CBadge color="success" style={{ fontSize: "12px" }}>
//           📍 Current Point: {lastreeivedPointInTracking}
//         </CBadge>
//         <CButton
//           onClick={() => handleRobotClick(item)}
//           size="sm"
//           color="danger"
//           className="ms-2"
//         >
//           <Eye size={18} />
//         </CButton>
//         <CButton
//           onClick={(e) => deleteHandler(e, item._id)}
//           size="sm"
//           color="secondary"
//           className="ms-2"
//         >
//           {loadingDelete ? (
//             <LoadingSpinner />
//           ) : (
//             <CIcon icon={cilTrash} color="danger" />
//           )}
//         </CButton>
//       </div>
//     </div>
//     <div
//       style={{
//         // margin: "0px 0px 0px 10px",
//         paddingLeft: "25px",
//         paddingRight: "24px",
//         height: "120px",
//         overflowX: "auto",
//       }}
//       ref={(el) => (scrollRefs.current[item._id] = el)}
//     >
//       <div
//         style={{
//           position: "relative",
//           top: "20px",
//           height: "40px",
//           borderRadius: "4px",
//           width: `${L * 25}px`,
//           backgroundImage: `
//             repeating-linear-gradient(to right, #0d47a1, #0d47a1 10px, #fff 10px, #fff 12px),
//             linear-gradient(to bottom, #0d47a1 0%, #0d47a1 48%, #79aaf4ff 48%, #659ef5ff 53%, #0d47a1 53%, #0d47a1 100%)
//           `,
//           backgroundBlendMode: "overlay",
//         }}
//       >
//         <span
//           style={{
//             position: "absolute",
//             left: -24,
//             top: "-20px",
//             color: "#0277BD",
//             fontWeight: "bold",
//           }}
//         >
//           DS
//         </span>
//         <span
//           style={{
//             position: "absolute",
//             right: -24,
//             top: "-20px",
//             color: "#0277BD",
//             fontWeight: "bold",
//           }}
//         >
//           RS
//         </span>

//         {[...Array(L + 1)].map((_, i) => (
//           <React.Fragment key={i}>
//             <div
//               style={{
//                 position: "absolute",
//                 top: "40px",
//                 left: `${i * 25}px`,
//                 width: "1px",
//                 height: "8px",
//                 backgroundColor: "#0277BD",
//               }}
//             />
//             <div
//               style={{
//                 position: "absolute",
//                 top: "48px",
//                 left: `${i * 25}px`,
//                 transform: "translateX(-50%)",
//                 fontSize: "9px",
//                 color: "#0277BD",
//               }}
//             >
//               {i}
//             </div>
//           </React.Fragment>
//         ))}

//         <div
//           style={{
//             position: "absolute",
//             top: "-11px",
//             width: "30px",
//             height: "80px",
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             ...iconStyle,
//           }}
//         >
//           <CImage
//             src={RobotImg}
//             alt="Robot"
//             width="100"
//             height="62"
//             style={{ objectFit: "contain", borderRadius: "5px" }}
//           />
//         </div>
//       </div>
//     </div>
//   </div>
// </div>
//           );
//         })
//       )}

//       {/* === Offcanvas with Robot Details === */}
// {selectedRobot && (
//   <COffcanvas
//     style={{ backgroundColor: "#080f25" }}
//     placement="end"
//     visible={sideBarVisible}
//     onHide={() => setsideBarVisible(false)}
//   >
// <COffcanvasHeader className="">
//   <COffcanvasTitle className="d-flex flex-column justify-content-start">
//     <span style={{ fontSize: "15px" }}>
//       {" "}
//       Robot Details -{" "}
//       <CBadge color="warning" className="px-2 py-1">
//         {selectedRobot.robot_no}
//       </CBadge>
//     </span>
//     <span style={{ fontSize: "15px" }}>
//       Doc id- {selectedRobot._id}
//     </span>
//   </COffcanvasTitle>
//   <button
//     type="button"
//     className=" border-0 ms-auto py-0 px-1"
//     onClick={() => setsideBarVisible(false)}
//     style={{ background: "none" }}
//   >
//     <CIcon icon={cilX} size="xl" />
//   </button>
// </COffcanvasHeader>
//     <COffcanvasBody>
//       {loadingRobot ? (
//         <div className="h-75 d-flex justify-content-center align-items-center">
//           <LoadingSpinner />
//         </div>
//       ) : loadingRobotError ? (
//         <CBadge color="danger">{loadingRobotError}</CBadge>
//       ) : (
//         <>
// {/* === Cleaning Record === */}
// <div className="card border-0 shadow-sm mb-2 bg-dark text-light ">
//   <div className="card-body  p-2">
//     <div className="d-flex justify-content-between align-items-center mb-2">
//       <h5 className="mb-0 text-info">🧹 Cleaning Status</h5>
//       {selectedRobot.cleaning?.finish ? (
//         <CBadge color="success" className="fw-normal">
//           ✅ Finished
//         </CBadge>
//       ) : selectedRobot.cleaning?.cleaning_cancelled ? (
//         <CBadge color="danger" className="fw-normal">
//           ❌ Cancelled
//         </CBadge>
//       ) : selectedRobot.cleaning?.battery_dead ? (
//         <CBadge color="warning" className="fw-normal">
//           🔋 Battery Issue
//         </CBadge>
//       ) : (
//         <CBadge color="info" className="fw-normal">
//           ⏳ In Progress
//         </CBadge>
//       )}
//     </div>

//               {/* Start & Finish Times */}
//  <div className="mb-2">
//   <span>Start:</span>{" "}
//   {selectedRobot.cleaning?.startAt ? (
//     <span className="text-success">
//       {new Date(
//         selectedRobot.cleaning.startAt
//       ).toLocaleString("en-GB", {
//         day: "2-digit",
//         month: "2-digit",
//         year: "numeric",
//         hour: "2-digit",
//         minute: "2-digit",
//         hour12: true,
//       })}
//     </span>
//   ) : (
//     <span className="badge bg-secondary">Not Started</span>
//   )}
// </div>

// <div className="mb-2">
//     <span>Finish:</span>{" "}
//     {selectedRobot.cleaning?.finishAt ? (
//       <span className="text-success">
//         {new Date(
//           selectedRobot.cleaning.finishAt
//         ).toLocaleString("en-GB", {
//           day: "2-digit",
//           month: "2-digit",
//           year: "numeric",
//           hour: "2-digit",
//           minute: "2-digit",
//           hour12: true,
//         })}
//       </span>
//     ) : (
//       <span className="badge bg-warning text-dark">
//         Not Finished
//       </span>
//     )}
//    </div>

// <CTable bordered small hover responsive className="mb-3">
//   <CTableBody>
//     {/* Start Time */}
//     <CTableRow>
//       <CTableHeaderCell>Start</CTableHeaderCell>
//       <CTableDataCell>
//         {selectedRobot.cleaning?.startAt ? (
//           <span className="text-success">
//             {new Date(
//               selectedRobot.cleaning.startAt
//             ).toLocaleString("en-GB", {
//               day: "2-digit",
//               month: "2-digit",
//               year: "numeric",
//               hour: "2-digit",
//               minute: "2-digit",
//               hour12: true,
//             })}
//           </span>
//         ) : (
//           <span className="badge bg-secondary">
//             Not Started
//           </span>
//         )}
//       </CTableDataCell>
//     </CTableRow>

//     {/* Finish Time */}
//     <CTableRow>
//       <CTableHeaderCell>Finish</CTableHeaderCell>
//       <CTableDataCell>
//         {selectedRobot.cleaning?.finishAt ? (
//           <span className="text-success">
//             {new Date(
//               selectedRobot.cleaning.finishAt
//             ).toLocaleString("en-GB", {
//               day: "2-digit",
//               month: "2-digit",
//               year: "numeric",
//               hour: "2-digit",
//               minute: "2-digit",
//               hour12: true,
//             })}
//           </span>
//         ) : (
//           <span className="badge bg-warning text-dark">
//             Not Finished
//           </span>
//         )}
//       </CTableDataCell>
//     </CTableRow>
//   </CTableBody>
// </CTable>

//               {/* Progress Bar */}
// {(() => {
//   const lastPoint = selectedRobot.track_details?.length
//     ? selectedRobot.track_details[
//         selectedRobot.track_details.length - 1
//       ].point
//     : 0;

//   const { distanceCovered, totalDistance, percentage } =
//     getCleaningPercentage(lastPoint);

//   return (
//     <div className="mb-2">
//       <div className="d-flex justify-content-between mb-1">
//         <small>Progress</small>
//         <small>
//           {distanceCovered}/{totalDistance} ({percentage}%)
//         </small>
//       </div>
//       <CProgress height={18} className="rounded-pill">
//         <CProgressBar
//           value={percentage}
//           color={
//             selectedRobot.cleaning?.finish
//               ? "success"
//               : selectedRobot.cleaning?.cleaning_cancelled
//               ? "danger"
//               : selectedRobot.cleaning?.battery_dead
//               ? "warning"
//               : "info"
//           }
//           animated={!selectedRobot.cleaning?.finish}
//           striped
//         >
//           {percentage}%
//         </CProgressBar>
//       </CProgress>
//     </div>
//   );
// })()}

//               {/* Comments */}
//               {selectedRobot.comments && (
//                 <div className="alert alert-warning p-1 m-0">
//                   <small>{selectedRobot.comments}</small>
//                 </div>
//               )}
//             </div>
//           </div>

//           {selectedRobot.cleaning.battery_health_status !== "" && (
// <div className="border-0 card">
//   <div className="m-2">Battery Status</div>
//   <div>
//     <div className="alert alert-warning m-2 p-1 ">
//       {/* Battery Status Row */}
//       <div className="d-flex align-items-start">
//         <small>
//           {selectedRobot.cleaning.battery_health_status}
//         </small>
//       </div>
//       {/* Last Update Row */}
//       <div className="d-flex align-items-center">
//         <small className="">Battery Last Update:</small>
//         <small className="text-dark ms-2">
//           {new Date(
//             selectedRobot.cleaning.battery_health_status_updated_at
//           ).toLocaleString("en-GB", {
//             day: "2-digit",
//             month: "2-digit",
//             year: "numeric",
//             hour: "2-digit",
//             minute: "2-digit",
//             hour12: true,
//           })}
//         </small>
//       </div>{" "}
//     </div>
//   </div>
// </div>
//           )}

// <div className="my-3 card shadow-sm  bg-dark text-light">
//   {selectedRobot.track_details?.length > 0 && (
//     <div className="card-body">
//       <div>
//         <h6 className="text-info mb-2">Track Details:</h6>
//         <div
//           style={{
//             maxHeight: "200px",
//             overflowY: "auto",
//           }}
//         >
//           <table
//             className="table table-sm mb-0 "
//             style={{ minWidth: "100%" }}
//           >
//             <thead
//               style={{
//                 position: "sticky",
//                 top: 0,
//                 backgroundColor: "#fff",
//               }}
//             >
//               <tr>
//                 <th className="text-center">#</th>
//                 <th className="text-center">Point</th>
//                 <th className="text-start">Timestamp</th>
//               </tr>
//             </thead>
//             <tbody>
//               {[
//                 ...new Map(
//                   selectedRobot.track_details.map((t) => [
//                     t.point,
//                     t,
//                   ])
//                 ).values(),
//               ]
//                 .map((t, idx) => (
//                   <tr
//                     key={idx}
//                     className={`${
//                       t.point === 30 ? "table-warning" : ""
//                     }`}
//                   >
//                     <td className="text-center">{idx + 1}</td>
//                     <td className="text-center">{t.point}</td>
//                     <td className="text-start">
//                       {new Date(t.timestamp).toLocaleString(
//                         "en-GB",
//                         {
//                           hour: "2-digit",
//                           minute: "2-digit",
//                           second: "2-digit",
//                           hour12: true,
//                         }
//                       )}
//                     </td>
//                   </tr>
//                 ))
//                 .reverse()}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   )}
// </div>
//           {/* === Robot Information === */}
//           <div className="card shadow-sm bg-secondary text-light">
//             <div className="card-body">
//               <h5 className="text-light mb-3">🤖 Robot Information</h5>
//               <div className="row">
//                 <div className="col-12">
//                   <span>No:</span> {selectedRobot.robot_no}
//                 </div>
//                 <div className="col-12">
//                   <span>Block:</span> {selectedRobot.block}
//                 </div>
//                 <div className="col-12">
//                   <span>Type:</span> {selectedRobot.robot_type}
//                 </div>
//                 <div className="col-12">
//                   <span>Site:</span> {selectedRobot.site_id}
//                 </div>
//                 <div className="col-12">
//                   <span>Lora No:</span> {selectedRobot.lora_no}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </COffcanvasBody>
//   </COffcanvas>
//       )}
//     </div>
//   );
// };

// export default RobotTracker;

import React, { useEffect, useReducer, useRef, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import Robot from "./Robot";
import RobotSidebar from "./RobotSidebar";
import { smoothScroll } from "./helpers";
import socket from "../../components/Socket";
import LoadingSpinner from "../../components/LoadingSpinner";
import { CBadge, CCol, CFormInput, CFormSelect, CRow } from "@coreui/react";
import SubscriptionExpiryCard from "../../components/SubscriptionExpiryCard";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, robots: action.payload };
    case "FETCH_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
        subscriptiondata: action.subscriptiondata,
        subscriptionStatus: action.subscriptionStatus,
      };
    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true };
    case "DELETE_SUCCESS":
      return {
        ...state,
        loadingDelete: false,
        robots: state.robots.filter((r) => r._id !== action.payload), // remove deleted robot
      };

    case "FETCH_SITES_REQUEST":
      return { ...state, loadingSites: true, sitesError: "" };
    case "FETCH_SITES_SUCCESS":
      return { ...state, loadingSites: false, sites: action.payload };
    case "FETCH_SITES_FAIL":
      return { ...state, loadingSites: false, sitesError: action.payload };

    case "DELETE_FAIL":
      return { ...state, loadingDelete: false };
    default:
      return state;
  }
};

const RobotTracker = () => {
  const [
    {
      error,
      robots,
      loading,
      loadingDelete,
      loadingSites,
      sites,
      sitesError,
      subscriptiondata,
      subscriptionStatus,
    },
    dispatch,
  ] = useReducer(reducer, {
    robots: [],
    loading: true,
    error: "",
    loadingDelete: false,
    sites: [],
    loadingSites: true,
    sitesError: "",
    subscriptiondata: {},
    subscriptionStatus: "",
  });
  const scrollRefs = useRef({});
  const robotsRef = useRef([]);
  const [site_id, setSiteId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);
  const [selectedRobotId, setSelectedRobotId] = useState(null);
  // const [selectedRobot, setSelectedRobot] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const mergeLastActivity = (existing, incoming) => {
    const existingKeys = new Set(
      existing.map((a) => new Date(a.timestamp).getTime())
    );
    const newItems = (incoming || []).filter(
      (a) => !existingKeys.has(new Date(a.timestamp).getTime())
    );
    return [...existing, ...newItems];
  };

  // Fetch robot tracking data
  useEffect(() => {
    const fetchRobotTracking = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const response = await axios.post(
          "/api/v1/robot-tracking/sitewise/fetch-by-sites-and-date",
          {
            site_id: site_id,
            date: date,
          },
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );
        dispatch({ type: "FETCH_SUCCESS", payload: response.data.data });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: error.response?.data?.error || error.response?.data?.message,
          subscriptiondata: error.response?.data?.data,
          subscriptionStatus: error.response?.data?.subscriptionStatus,
        });
        toast.error(
          error.response?.data?.error || error.response?.data?.message
        );
      }
    };
    fetchRobotTracking();
  }, [authtoken, date, site_id]);

  useEffect(() => {
    const fetchSites = async () => {
      dispatch({ type: "FETCH_SITES_REQUEST" });
      try {
        const res = await axios.get(
          `/api/v1/sites`,

          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );
        dispatch({ type: "FETCH_SITES_SUCCESS", payload: res.data.data });
      } catch (err) {
        dispatch({
          type: "FETCH_SITES_FAIL",
          payload: err.response?.data?.error || err.response?.data?.message,
        });
        toast.error(err.response?.data?.error || err.response?.data?.message);
      }
    };
    fetchSites();
  }, [authtoken]);
  robotsRef.current = robots;
  useEffect(() => {
    const handleUpdate = ({ tracking }) => {
      const newPoint = parseInt(tracking.uplink.data, 10);

      // Update robot state
      // dispatch({
      //   type: "FETCH_SUCCESS",
      //   payload: robotsRef.current.map((r) =>
      //     r._id === tracking._id
      //       ? {
      //           ...r,
      //           uplink: { ...r.uplink, ...tracking.uplink },
      //           comments: tracking.comments,
      //           cleaning: { ...r.cleaning, ...tracking.cleaning },
      // track_details: [
      //   ...r.track_details,
      //   ...(tracking.track_details || []),
      // ],
      //           updatedAt: new Date().toISOString(),
      //         }
      //       : r
      //   ),
      // });

      //update robot state and if new robot object is coming then add to existing array
      // Update robot state and add new robot if not exists
      dispatch({
        type: "FETCH_SUCCESS",
        payload: (() => {
          const exists = robotsRef.current.some((r) => r._id === tracking._id);
          if (exists) {
            // Update existing robot
            return robotsRef.current.map((r) =>
              r._id === tracking._id
                ? {
                    ...r,
                    uplink: { ...r.uplink, ...tracking.uplink },
                    // last_activity: [
                    //   ...r.last_activity,
                    //   ...(tracking.last_activity || []),
                    // ],
                    last_activity: mergeLastActivity(
                      r.last_activity,
                      tracking.last_activity
                    ),

                    comments: tracking.comments,
                    cleaning: { ...r.cleaning, ...tracking.cleaning },
                    track_details: [
                      ...r.track_details,
                      ...(tracking.track_details || []),
                    ],
                    updatedAt: new Date().toISOString(),
                  }
                : r
            );
          } else {
            // Push new robot into array
            return [...robotsRef.current, tracking];
          }
        })(),
      });

      // Smooth scroll update
      const robot = robotsRef.current.find((r) => r._id === tracking._id);
      const el = scrollRefs.current[tracking._id];

      if (robot && el) {
        const L = robot.row_length || 1;
        let segmentPct = 0;

        if (newPoint >= 19 && newPoint <= 29) {
          segmentPct = (newPoint - 19) / (29 - 19);
        } else if (newPoint >= 31 && newPoint <= 40) {
          segmentPct = (newPoint - 31) / (40 - 31);
        } else {
          segmentPct = newPoint / L;
        }

        const iconOffsetPx = segmentPct * L * 25; // 25px per point
        const halfWidth = el.clientWidth / 2;

        let targetScroll =
          newPoint >= 19 && newPoint <= 29
            ? iconOffsetPx - el.clientWidth * 0.25
            : newPoint >= 31 && newPoint <= 40
            ? iconOffsetPx - el.clientWidth * 0.75
            : iconOffsetPx - halfWidth;

        targetScroll = Math.max(
          0,
          Math.min(targetScroll, el.scrollWidth - el.clientWidth)
        );

        smoothScroll(el, targetScroll, 400);
      }
    };

    // Remove old listener before adding
    socket.off("robotPositionUpdate", handleUpdate);
    socket.on("robotPositionUpdate", handleUpdate);

    return () => socket.off("robotPositionUpdate", handleUpdate);
  }, [dispatch]);

  const handleRobotClick = (robot) => {
    setSelectedRobotId(robot._id);
    setSidebarVisible(true); // ✅ open sidebar
  };

  const handleSidebarClose = () => setSidebarVisible(false);
  const selectedRobot = robots.find((r) => r._id === selectedRobotId);
  // Delete handler
  const deleteHandler = async (e, id) => {
    e.preventDefault();
    const confirmDelete = window.confirm(
      `Are you sure you want to delete this robot tracking (${id})?`
    );
    if (!confirmDelete) return; // Exit if user cancels

    dispatch({ type: "DELETE_REQUEST" });
    try {
      const response = await axios.delete(`/api/v1/robot-tracking/${id}`, {
        headers: { Authorization: `Bearer ${authtoken}` },
      });
      dispatch({ type: "DELETE_SUCCESS", payload: id });
      toast.success(response.data.message);
    } catch (error) {
      dispatch({ type: "DELETE_FAIL" });
      toast.error(error.response?.data?.error || error.response?.data?.message);
    }
  };

  const checkStatus = [
    "subscriptionSitesAssigned",
    "subscriptionFound",
    "subscriptionaRenewStatus",
    "subscriptionPaymentStatus",
    "subscriptionPlanAccess",
  ];
  return (
    <div className="custom-scrollbar">
      <h3 className="text-light text-center">Live Robot Tracking</h3>
      {loadingSites ? (
        <LoadingSpinner />
      ) : sitesError ? (
        <CBadge color="danger" className="p-2">
          {sitesError}
        </CBadge>
      ) : (
        <CRow className="mb-3 justify-content-end align-items-center">
          <CCol md={3}>
            <CFormSelect
              id="siteSelect"
              className="p-1"
              value={site_id}
              onChange={(e) => {
                setSiteId(e.target.value);
              }}
            >
              <option value="">Select Site</option>
              {sites?.map((site, index) => (
                <option key={index} value={site.site_id}>
                  {site.site_id}
                </option>
              ))}
            </CFormSelect>
          </CCol>
          <CCol md={2}>
            <CFormInput
              type="date"
              className="p-1"
              placeholder="Search by Category..."
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </CCol>
        </CRow>
      )}
      <div
        className=" custom-scrollbar"
        style={{
          // overflowY: "auto",
          overflowX: "auto",
          minHeight: "50vh",
        }}
      >
        {loading ? (
          <LoadingSpinner />
        ) : checkStatus.includes(subscriptionStatus) ? (
          <SubscriptionExpiryCard
            data={subscriptiondata}
            subscriptionStatus={subscriptionStatus}
            error={sitesError}
          />
        ) : (
          <>
            {robots.length > 0 ? (
              robots.map((robot) => (
                <div className="col-md-12 my-3" key={robot._id}>
                  <Robot
                    robot={robot}
                    handleRobotClick={handleRobotClick} // ✅ pass function
                    deleteHandler={(e) => deleteHandler(e, robot._id)}
                    loadingDelete={loadingDelete}
                  />
                </div>
              ))
            ) : (
              <div className="alert alert-danger w-50">No Robots Found</div>
            )}
          </>
        )}
      </div>

      {/* Sidebar */}
      {selectedRobot && (
        <RobotSidebar
          deleteHandler={deleteHandler}
          robot={selectedRobot}
          visible={sidebarVisible}
          onClose={handleSidebarClose}
          userInfo={userInfo}
        />
      )}
      {/*footer */}
      <div
        style={{
          position: "sticky",
          bottom: 0,
          padding: "5px 5px",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "15px",
          backgroundColor: "#080f25",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div
            style={{
              width: "10px",
              height: "10px",
              backgroundColor: "#FFA000",
            }}
          ></div>
          <span>Running</span>
        </div>
        |
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div
            style={{
              width: "10px",
              height: "10px",
              backgroundColor: "#4CAF50",
            }}
          ></div>
          <span>At Dock/Cleaning Completed</span>
        </div>
        |
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div
            style={{
              width: "10px",
              height: "10px",
              backgroundColor: "#ff0000ab",
            }}
          ></div>
          <span>Cancelled/Stuck/Battery Dead</span>
        </div>
      </div>
    </div>
  );
};

export default RobotTracker;
