// import React, { useEffect, useReducer, useRef, useState } from "react";
// import socket from "../../components/Socket";
// import RobotImg from "../../assets/images/robot.png";
// import { CBadge, CButton, CImage } from "@coreui/react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import toast from "react-hot-toast";
// import LoadingSpinner from "../../components/LoadingSpinner";
// // const socket = io("http://localhost:5000"); // ✅ change to your backend URL]

// const reducer = (state, action) => {
//   switch (action.type) {
//     case "FETCH_REQUEST":
//       return { ...state, loading: true, error: "" };

//     case "FETCH_SUCCESS":
//       return {
//         ...state,
//         loading: false,
//         robots: action.payload,
//       };

//     case "FETCH_FAIL":
//       return { ...state, loading: false, error: action.payload };

//     case "DELETE_REQUEST":
//       return { ...state, loadingDelete: true };
//     case "DELETE_SUCCESS":
//       return {
//         ...state,
//         loadingDelete: false,
//       };
//     case "DELETE_FAIL":
//       return { ...state, loadingDelete: false };

//     default:
//       return state;
//   }
// };

// const RobotTracker = () => {
//   const [{ error, robots, loading, loadingDelete }, dispatch] = useReducer(
//     reducer,
//     {
//       robots: [],
//       loading: true,
//       error: "",
//       loadingDelete: false,
//     }
//   );

//   const authtoken = useSelector((state) => state.authtoken);

//   useEffect(() => {
//     const fetRobotTracking = async () => {
//       dispatch({ type: "FETCH_REQUEST" });
//       try {
//         const response = await axios.get("/api/v1/robot-tracking", {
//           headers: { Authorization: `Bearer ${authtoken}` },
//         });
//         dispatch({
//           type: "FETCH_SUCCESS",
//           payload: response.data.data,
//         });
//         // console.log(response.data.data);
//       } catch (error) {
//         dispatch({
//           type: "FETCH_FAIL",
//           payload: error.response?.data?.error || error.response.data.messag,
//         });
//         toast.error(error.response.data.error || error.response.data.message);
//       }
//     };

//     fetRobotTracking();
//   }, [authtoken]);

//   // const robotsRef = useRef([]);
//   // robotsRef.current = robots;

//   // useEffect(() => {
//   //   const activeAnimations = {};

//   //   const handleUpdate = ({ deveui, point }) => {
//   //     const newTarget = parseInt(point, 10);

//   //     const robot = robotsRef.current.find((r) => r.deveui === deveui);
//   //     if (!robot) return;

//   //     const lastPoint = parseInt(robot.uplink?.data || "0", 10);

//   //     // cancel previous animation if exists
//   //     if (activeAnimations[deveui]) {
//   //       cancelAnimationFrame(activeAnimations[deveui].rafId);
//   //     }

//   //     let startTime;
//   //     const duration = 2000; // ms

//   //     const animate = (timestamp) => {
//   //       if (!startTime) startTime = timestamp;
//   //       const elapsed = timestamp - startTime;
//   //       const t = Math.min(elapsed / duration, 1);

//   //       const interpolated = lastPoint + (newTarget - lastPoint) * t;

//   //       // update only this robot
//   //       dispatch({
//   //         type: "FETCH_SUCCESS",
//   //         payload: robotsRef.current.map((r) =>
//   //           r.deveui === deveui
//   //             ? { ...r, uplink: { ...r.uplink, data: interpolated.toString() } }
//   //             : r
//   //         ),
//   //       });

//   //       if (t < 1) {
//   //         activeAnimations[deveui].rafId = requestAnimationFrame(animate);
//   //       }
//   //     };

//   //     activeAnimations[deveui] = { rafId: requestAnimationFrame(animate) };
//   //   };

//   //   socket.on("robotPositionUpdate", handleUpdate);

//   //   return () => {
//   //     socket.off("robotPositionUpdate", handleUpdate);
//   //     Object.values(activeAnimations).forEach((a) =>
//   //       cancelAnimationFrame(a.rafId)
//   //     );
//   //   };
//   // }, [dispatch]); // ✅ only depends on dispatch

//   const robotsRef = useRef([]);
//   const scrollRefs = useRef({});
//   robotsRef.current = robots;

//   useEffect(() => {
//     const handleUpdate = ({ _id, point }) => {
//       const newPoint = parseInt(point, 10);

//       // update robot state immediately
//       dispatch({
//         type: "FETCH_SUCCESS",
//         payload: robotsRef.current.map((r) =>
//           r._id === _id
//             ? { ...r, uplink: { ...r.uplink, data: newPoint.toString() } }
//             : r
//         ),
//       });

//       // update scroll immediately
//       const robot = robotsRef.current.find((r) => r._id === _id);
//       const el = scrollRefs.current[_id];
//       if (robot && el) {
//         const L = robot.row_length || 1;

//         let segmentPct = 0;
//         if (newPoint >= 19 && newPoint <= 29) {
//           segmentPct = (newPoint - 19) / (29 - 19); // Forward Cleaning
//         } else if (newPoint >= 29 && newPoint <= 40) {
//           segmentPct = (newPoint - 29) / (40 - 29); // Reverse Cleaning
//         } else {
//           segmentPct = newPoint / L; // Dock or default
//         }

//         const iconOffsetPx = segmentPct * L * 25;
//         const halfWidth = el.clientWidth / 2;

//         let targetScroll;
//         if (newPoint >= 19 && newPoint <= 29) {
//           targetScroll = iconOffsetPx - el.clientWidth * 0.25;
//         } else if (newPoint >= 29 && newPoint <= 40) {
//           targetScroll = iconOffsetPx - el.clientWidth * 0.75;
//         } else {
//           targetScroll = iconOffsetPx - halfWidth;
//         }

//         // clamp to container
//         targetScroll = Math.max(
//           0,
//           Math.min(targetScroll, el.scrollWidth - el.clientWidth)
//         );

//         el.scrollTo({ left: targetScroll, behavior: "auto" }); // instant scroll
//       }
//     };

//     socket.on("robotPositionUpdate", handleUpdate);

//     return () => {
//       socket.off("robotPositionUpdate", handleUpdate);
//     };
//   }, [dispatch]);

//   const deleteHandler = async (e, id) => {
//     e.preventDefault();
//     dispatch({ type: "DELETE_REQUEST" });

//     try {
//       const response = await axios.delete(`/api/v1/robot-tracking/${id}`, {
//         headers: { Authorization: `Bearer ${authtoken}` },
//       });

//       dispatch({ type: "DELETE_SUCCESS" });
//       toast.success(response.data.message);
//     } catch (error) {
//       dispatch({
//         type: "DELETE_FAIL",
//         payload: error.response?.data?.error || error.response?.data?.message,
//       });

//       toast.error(error.response.data.error || error.response?.data?.message);
//     }
//   };
//   return (
//     <>
//       <div className="">
//         <span className="text-success">1 Meter= 25px</span>
//         {/* <h2 className="text-lg font-bold mb-2">{robot.robot_no}</h2> */}
//         {loading ? (
//           <LoadingSpinner />
//         ) : error ? (
//           error
//         ) : robots.length > 0 ? (
//           robots.map((item, index) => {
//             const pt = parseInt(item.uplink?.data || "0", 10);
//             const displayPt = pt;
//             const L = item.row_length || 1;
//             const progressPercent = (pt / L) * 100;
//             const distanceCovered = pt;
//             let phase, badgeColor, iconBorder, segmentPct;
//             if (displayPt === 40 || displayPt === 11) {
//               phase = "At Dock";
//               badgeColor = "success";
//               iconBorder = "#343a40"; // dark gray
//               segmentPct = 0; // At Dock is end of reverse path
//             } else if (displayPt === 29) {
//               phase = "At Reverse Station";
//               badgeColor = "warning";
//               iconBorder = "#ffc107"; // yellow (warning)
//               segmentPct = 1; // End of forward path
//             } else if (displayPt >= 19 && displayPt <= 29) {
//               phase = "Forward Cleaning";
//               badgeColor = "success";
//               iconBorder = "#2eb85c";
//               segmentPct = (displayPt - 19) / (29 - 19);
//             } else if (displayPt >= 29 && displayPt <= 40) {
//               phase = "Reverse Cleaning";
//               badgeColor = "primary";
//               iconBorder = "#0d6efd";
//               segmentPct = (displayPt - 29) / (40 - 29);
//             } else {
//               phase = "At Dock";
//               badgeColor = "secondary";
//               iconBorder = "#6c757d";
//               segmentPct = displayPt / L;
//             }

//             const iconOffsetPx = segmentPct * (L * 25);
//             const iconStyle =
//               phase === "Reverse Cleaning"
//                 ? { right: `calc(${iconOffsetPx}px - 12px)`, left: "auto" }
//                 : { left: `calc(${iconOffsetPx}px - 12px)`, right: "auto" };
//             return (
//               <div className="border border-success mx-2 my-2" key={index}>
//                 <div className=" p-2 ">
//                   {/* Progress Bar */}

//                   <div className="d-flex justify-content-between text-sm ">
//                     <span
//                       style={
//                         {
//                           // left: "50px",
//                           // position: "absolute",
//                         }
//                       }
//                     >
//                       <span
//                         style={{
//                           fontSize: "15px",
//                         }}
//                       >
//                         {item.robot_no}
//                       </span>
//                       <CBadge color={badgeColor} className="ms-2 px-2">
//                         {phase}
//                       </CBadge>
//                     </span>
//                     <p>📍 Current Point: {pt}</p>
//                     <p>
//                       📏 Distance Covered: {distanceCovered} m / {L * 2} m
//                     </p>
//                     <p>📊 Progress: {progressPercent.toFixed(1)}%</p>
//                     {item.uplink?.timestamp && (
//                       <p>
//                         ⏱️ Last Update:{" "}
//                         {new Date(item.uplink.timestamp).toLocaleString()}
//                       </p>
//                     )}

//                     {item.cleaning && item.cleaning.start && (
//                       <p>
//                         Start At :
//                         {new Date(item.cleaning.startAt).toLocaleString()}
//                       </p>
//                     )}

//                     {item.cleaning && item.cleaning.finish && (
//                       <p>
//                         Finish At :
//                         {new Date(item.cleaning.finishAt).toLocaleString()}
//                       </p>
//                     )}
//                   </div>
//                   <CButton onClick={(e) => deleteHandler(e, item._id)}>
//                     {loadingDelete ? "  Deleting..." : "Delete"}
//                   </CButton>
//                   {item._id}
//                   <div
//                     style={{
//                       marginBottom: "10px",
//                       padding: " 20px",
//                       overflowX: "auto",
//                     }}
//                     className=" "
//                     ref={(el) => {
//                       if (!el) return;
//                       scrollRefs.current[item._id] = el; // use _id instead of deveui

//                       const pt = parseInt(item.uplink?.data || "0", 10);
//                       const L = item.row_length || 1;
//                       const segmentPct =
//                         item.phase === "Reverse Cleaning"
//                           ? (pt - 29) / (40 - 29)
//                           : item.phase === "Forward Cleaning"
//                           ? (pt - 19) / (29 - 19)
//                           : pt / L;

//                       const iconOffsetPx = segmentPct * L * 25;
//                       const halfWidth = el.clientWidth / 2;
//                       let targetScroll;

//                       if (item.phase === "Forward Cleaning") {
//                         targetScroll = iconOffsetPx - el.clientWidth * 0.25;
//                       } else if (item.phase === "Reverse Cleaning") {
//                         targetScroll = iconOffsetPx - el.clientWidth * 0.75;
//                       } else {
//                         targetScroll = iconOffsetPx - halfWidth;
//                       }

//                       // clamp to container boundaries
//                       targetScroll = Math.max(
//                         0,
//                         Math.min(targetScroll, el.scrollWidth - el.clientWidth)
//                       );

//                       // animate scroll
//                       el.scrollTo({ left: targetScroll, behavior: "smooth" });
//                     }}
//                   >
//                     <div
//                       className=""
//                       style={{
//                         position: "relative",
//                         top: "20px",
//                         height: "60px",
//                         borderRadius: "4px",
//                         marginBottom: "35px",
//                         width: `${L * 25}px`,
//                         backgroundImage: `
//           repeating-linear-gradient(
//             to right,
//             #0d47a1,
//             #0d47a1 10px,
//             #ffffff 10px,
//             #ffffff 12px
//           ),
//           linear-gradient(
//             to bottom,
//             #0d47a1 0%,
//             #0d47a1 48%,
//             #79aaf4ff 48%,
//             #659ef5ff 53%,
//             #0d47a1 53%,
//             #0d47a1 100%
//           )
//         `,
//                         backgroundBlendMode: "overlay",
//                       }}
//                     >
//                       <span
//                         style={{
//                           position: "absolute",
//                           left: 0,
//                           top: "-20px",
//                           color: "#0277BD",
//                           fontWeight: "bold",
//                         }}
//                       >
//                         DS{" "}
//                       </span>
//                       <span
//                         style={{
//                           position: "absolute",
//                           right: 0,
//                           top: "-20px",
//                           color: "#0277BD",
//                           fontWeight: "bold",
//                         }}
//                       >
//                         RS
//                       </span>
//                       {[...Array(L + 1)].map((_, i) => (
//                         <React.Fragment key={i}>
//                           <div
//                             style={{
//                               position: "absolute",
//                               top: "60px",
//                               left: `${i * 25}px`,
//                               width: "1px",
//                               height: "8px",
//                               backgroundColor: "#0277BD",
//                             }}
//                           />
//                           <div
//                             style={{
//                               position: "absolute",
//                               top: "68px",
//                               left: `${i * 25}px`,
//                               transform: "translateX(-50%)",
//                               fontSize: "9px",
//                               color: "#0277BD",
//                             }}
//                           >
//                             {i} m
//                           </div>
//                         </React.Fragment>
//                       ))}
//                       <div
//                         style={{
//                           position: "absolute",
//                           // left: `calc(${percent}% - 23px)`,
//                           // left: `calc(${Math.min(
//                           //   progressPercent,
//                           //   100
//                           // )}% - 12px)`,
//                           ...iconStyle,
//                           top: "-14px",
//                           width: "30px",
//                           height: "80px",
//                           display: "flex",
//                           flexDirection: "column",
//                           alignItems: "center",
//                           transition: "left 0.5s ease-in-out",
//                         }}
//                       >
//                         <CImage
//                           src={RobotImg}
//                           alt="Robot"
//                           width="100"
//                           height="92"
//                           style={{
//                             objectFit: "contain",
//                             borderRadius: "5px",
//                           }}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })
//         ) : (
//           <div>No Robots Found</div>
//         )}
//       </div>
//     </>
//   );
// };

// export default RobotTracker;

import React, { useEffect, useReducer, useRef, useState } from "react";
import socket from "../../components/Socket";
import RobotImg from "../../assets/images/robot.png";
import {
  CBadge,
  CButton,
  CImage,
  COffcanvas,
  COffcanvasBody,
  COffcanvasHeader,
  COffcanvasTitle,
  CProgress,
  CProgressBar,
} from "@coreui/react";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";
import CIcon from "@coreui/icons-react";
import { cilTrash, cilX } from "@coreui/icons";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, robots: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true };
    case "DELETE_SUCCESS":
      return { ...state, loadingDelete: false };
    case "DELETE_FAIL":
      return { ...state, loadingDelete: false };
    case "FETCH_ROBOT_REQUEST":
      return {
        ...state,
        loadingRobot: true,
        loadingRobotError: "",
        robotDetails: {},
      };
    case "FETCH_ROBOT_SUCCESS":
      return {
        ...state,
        loadingRobot: false,
        robotDetails: action.payload,
      };
    case "FETCH_ROBOT_FAIL":
      return {
        ...state,
        loadingRobot: false,
        loadingRobotError: action.payload,
      };
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
      loadingRobot,
      robotDetails,
      loadingRobotError,
    },
    dispatch,
  ] = useReducer(reducer, {
    robots: [],
    loading: true,
    error: "",
    loadingDelete: false,
    loadingRobot: false,
    robotDetails: {},
    loadingRobotError: "",
  });

  const authtoken = useSelector((state) => state.authtoken);
  const scrollRefs = useRef({});
  const robotsRef = useRef([]);
  robotsRef.current = robots;
  // const [selectedRobotNo, setSelectedRobotNo] = useState(null);
  const [selectedRobotId, setSelectedRobotId] = useState(null);

  const [sideBarVisible, setsideBarVisible] = useState(false);

  // Fetch robot tracking data
  useEffect(() => {
    const fetchRobotTracking = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const response = await axios.get("/api/v1/robot-tracking", {
          headers: { Authorization: `Bearer ${authtoken}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: response.data.data });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: error.response?.data?.error || error.message,
        });
        toast.error(error.response?.data?.error || error.message);
      }
    };
    fetchRobotTracking();
  }, [authtoken]);

  // helper function outside component
  const smoothScroll = (element, target, duration = 400) => {
    const start = element.scrollLeft;
    const change = target - start;
    const startTime = performance.now();

    const animateScroll = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      element.scrollLeft = start + change * progress;

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  useEffect(() => {
    const handleUpdate = ({ tracking }) => {
      console.log(tracking.robot_no, tracking.uplink.data);

      const newPoint = parseInt(tracking.uplink.data, 10);

      // Update robot state
      dispatch({
        type: "FETCH_SUCCESS",
        payload: robotsRef.current.map((r) =>
          r._id === tracking._id
            ? {
                ...r,
                uplink: { ...r.uplink, ...tracking.uplink },
                cleaning: { ...r.cleaning, ...tracking.cleaning },
                track_details: [
                  ...r.track_details,
                  ...(tracking.track_details || []),
                ],
                updatedAt: new Date().toISOString(),
              }
            : r
        ),
      });

      // Smooth scroll update
      const robot = robotsRef.current.find((r) => r._id === tracking._id);

      const el = scrollRefs.current[tracking._id];
      if (robot && el) {
        const L = robot.row_length || 1;
        let segmentPct = 0;

        // forward movement 19–29
        if (newPoint >= 19 && newPoint <= 29) {
          segmentPct = (newPoint - 19) / (29 - 19);
        }
        // reverse movement 31–40
        else if (newPoint >= 31 && newPoint <= 40) {
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

        // smooth instead of instant
        smoothScroll(el, targetScroll, 400);
      }
    };
    // Remove before adding (ensures no duplicates)
    socket.off("robotPositionUpdate", handleUpdate);
    socket.on("robotPositionUpdate", handleUpdate);
    return () => {
      socket.off("robotPositionUpdate", handleUpdate);
    };
  }, [dispatch]);

  // Delete handler
  const deleteHandler = async (e, id) => {
    e.preventDefault();
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this robot tracking?"
    );
    if (!confirmDelete) return; // Exit if user cancels

    dispatch({ type: "DELETE_REQUEST" });
    try {
      const response = await axios.delete(`/api/v1/robot-tracking/${id}`, {
        headers: { Authorization: `Bearer ${authtoken}` },
      });
      dispatch({ type: "DELETE_SUCCESS" });
      toast.success(response.data.message);
    } catch (error) {
      dispatch({ type: "DELETE_FAIL" });
      toast.error(error.response?.data?.error || error.response?.data?.message);
    }
  };

  const getRobotPhase = (pt, L, cleaning) => {
    let phase,
      badgeColor,
      iconBorder,
      segmentPct = 0;

    // 🚩 Case 1: At Dock (point 11 only)
    if (pt === 11) {
      phase = "At Dock";
      badgeColor = "success";
      iconBorder = "#343a40";
      segmentPct = 0;
    }

    // 🚩 Case 2: Cleaning Completed & At Dock (point 40 + finished)
    else if (pt === 40 && cleaning?.finish) {
      phase = "Cleaning Completed & At Dock";
      badgeColor = "dark";
      iconBorder = "#000";
      segmentPct = 0; // Dock position
    }

    // 🚩 Case 3: At Reverse Station (point 29)
    else if (pt === 29) {
      phase = "At Reverse Station";
      badgeColor = "warning";
      iconBorder = "#ffc107";
      segmentPct = 1; // End of forward
    }

    // 🚩 Case 4: Ready for Reverse Cleaning (point 30)
    else if (pt === 30) {
      phase = "At Reverse Station (Ready for Reverse Cleaning)";
      badgeColor = "info";
      iconBorder = "#17a2b8";
      segmentPct = 1; // Still at reverse station
    }

    // 🚩 Case 5: Forward Cleaning (points 20–28)
    else if (pt >= 20 && pt <= 28) {
      phase = "Forward Cleaning";
      badgeColor = "success";
      iconBorder = "#2eb85c";
      segmentPct = (pt - 19) / (29 - 19); // Smooth placement
    }

    // 🚩 Case 6: Reverse Cleaning (points 31–39)
    else if (pt >= 31 && pt <= 39) {
      phase = "Reverse Cleaning";
      badgeColor = "primary";
      iconBorder = "#0d6efd";
      segmentPct = (pt - 29) / (40 - 29); // Smooth placement
    }

    // 🚩 Case 7: At Dock (point 40 but not finished, or unknown)
    else if (pt === 40) {
      phase = "At Dock";
      badgeColor = "success";
      iconBorder = "#343a40";
      segmentPct = 0;
    }

    // 🚩 Default
    else {
      phase = "At Dock";
      badgeColor = "secondary";
      iconBorder = "#6c757d";
      segmentPct = pt / L;
    }

    return { phase, badgeColor, iconBorder, segmentPct };
  };

  function getCleaningPercentage(pt) {
    let percentage = 0;
    let distance = 0;
    const totalSteps = 20; // 10 forward + 10 reverse

    // 🚩 Forward cleaning (20–29 → 10 steps)
    if (pt >= 20 && pt <= 29) {
      distance = pt - 19; // 20 → 1, 29 → 10
      percentage = (distance / totalSteps) * 100;
    } else if (pt === 30) {
      distance = 10; // 20 → 1, 29 → 10 30-19=11-1
      percentage = (distance / totalSteps) * 100;
    }
    // 🚩 Reverse cleaning (31–40 → 10 steps)
    else if (pt >= 31 && pt <= 40) {
      distance = 10 + (pt - 30); // 31 → 11, 40 → 20
      percentage = (distance / totalSteps) * 100;
    }

    return {
      point: pt,
      distanceCovered: distance,
      totalDistance: totalSteps,
      percentage: Math.round(percentage),
    };
  }

  // const handleRobotClick = async (robot_no) => {
  //   setSelectedRobotNo(robot_no);
  //   setsideBarVisible(true);

  // };
  // State

  // When clicking "View Tracking" (or similar button)
  const handleRobotClick = (robot) => {
    setSelectedRobotId(robot._id);
    setsideBarVisible(true);
  };
  const selectedRobot = robots.find((r) => r._id === selectedRobotId);

  return (
    <div>
      <span className="text-success">1 Meter = 25px</span>
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        error
      ) : robots.length === 0 ? (
        <div>No Robots Found</div>
      ) : (
        robots.map((item) => {
          // const pt = parseInt(item.uplink?.data || "0", 10);
          const lastreeivedPointInTracking =
            item.track_details?.[item.track_details.length - 1]?.point || 0;

          const L = item.row_length || 1;
          // const progressPercent = (pt / L) * 100;

          // const distanceCovered = pt;
          const { phase, badgeColor, iconBorder, segmentPct } = getRobotPhase(
            lastreeivedPointInTracking,
            L,
            item
          );

          // const { distanceCovered, totalDistance, percentage } =
          //   getCleaningPercentage(lastreeivedPointInTracking);

          const iconOffsetPx = segmentPct * L * 25;
          const iconStyle =
            phase === "Reverse Cleaning"
              ? { right: `calc(${iconOffsetPx}px - 12px)`, left: "auto" }
              : { left: `calc(${iconOffsetPx}px - 12px)`, right: "auto" };

          return (
            <div className="border border-success mx-2 my-2" key={item._id}>
              <div className="p-2">
                <div className="d-flex justify-content-between text-sm">
                  <span style={{ fontSize: "15px" }}>
                    {item.robot_no}{" "}
                    <CBadge color={badgeColor} className="ms-2 px-2">
                      {phase}
                    </CBadge>
                  </span>

                  {/* <span style={{ fontSize: "12px" }}>
                    📏 Distance Covered: {distanceCovered} m / {totalDistance} m
                  </span>
                  <span style={{ fontSize: "12px" }}>
                    📊 Progress: {percentage}%
                  </span>

                  {item.uplink?.timestamp && (
                    <span style={{ fontSize: "12px" }}>
                      ⏱️ Last Update:{" "}
                      {new Date(item.uplink.timestamp).toLocaleString()}
                    </span>
                  )}
                  {item.cleaning?.start && (
                    <span style={{ fontSize: "12px" }}>
                      Start At:{" "}
                      {new Date(item.cleaning.startAt).toLocaleString()}
                    </span>
                  )}
                  {item.cleaning?.finish && (
                    <span style={{ fontSize: "12px" }}>
                      Finish At:{" "}
                      {new Date(item.cleaning.finishAt).toLocaleString()}
                    </span>
                  )} */}
                  <div className="d-flex justify-content-end align-items-center">
                    <CBadge color="success" style={{ fontSize: "12px" }}>
                      📍 Current Point: {lastreeivedPointInTracking}
                    </CBadge>
                    <CButton
                      onClick={() => handleRobotClick(item)}
                      size="sm"
                      color="danger"
                      className="ms-2"
                    >
                      View Tracking
                    </CButton>
                    <CButton
                      onClick={(e) => deleteHandler(e, item._id)}
                      size="sm"
                      color="secondary"
                      className="ms-2"
                    >
                      {loadingDelete ? (
                        <LoadingSpinner />
                      ) : (
                        <CIcon icon={cilTrash} color="danger" />
                      )}
                    </CButton>
                  </div>
                </div>
                <div
                  style={{
                    // margin: "0px 0px 0px 10px",
                    paddingLeft: "20px",
                    height: "150px",
                    overflowX: "auto",
                  }}
                  ref={(el) => (scrollRefs.current[item._id] = el)}
                >
                  <div
                    style={{
                      position: "relative",
                      top: "20px",
                      height: "60px",
                      borderRadius: "4px",
                      width: `${L * 25}px`,
                      backgroundImage: `
                        repeating-linear-gradient(to right, #0d47a1, #0d47a1 10px, #fff 10px, #fff 12px),
                        linear-gradient(to bottom, #0d47a1 0%, #0d47a1 48%, #79aaf4ff 48%, #659ef5ff 53%, #0d47a1 53%, #0d47a1 100%)
                      `,
                      backgroundBlendMode: "overlay",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        left: 0,
                        top: "-20px",
                        color: "#0277BD",
                        fontWeight: "bold",
                      }}
                    >
                      DS
                    </span>
                    <span
                      style={{
                        position: "absolute",
                        right: 0,
                        top: "-20px",
                        color: "#0277BD",
                        fontWeight: "bold",
                      }}
                    >
                      RS
                    </span>

                    {[...Array(L + 1)].map((_, i) => (
                      <React.Fragment key={i}>
                        <div
                          style={{
                            position: "absolute",
                            top: "60px",
                            left: `${i * 25}px`,
                            width: "1px",
                            height: "8px",
                            backgroundColor: "#0277BD",
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            top: "68px",
                            left: `${i * 25}px`,
                            transform: "translateX(-50%)",
                            fontSize: "9px",
                            color: "#0277BD",
                          }}
                        >
                          {i} m
                        </div>
                      </React.Fragment>
                    ))}

                    <div
                      style={{
                        position: "absolute",
                        top: "-14px",
                        width: "30px",
                        height: "80px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        ...iconStyle,
                      }}
                    >
                      <CImage
                        src={RobotImg}
                        alt="Robot"
                        width="100"
                        height="92"
                        style={{ objectFit: "contain", borderRadius: "5px" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}

      {/* === Offcanvas with Robot Details === */}
      {selectedRobot && (
        <COffcanvas
          style={{ backgroundColor: "#080f25" }}
          placement="end"
          visible={sideBarVisible}
          onHide={() => setsideBarVisible(false)}
        >
          <COffcanvasHeader className="border">
            <COffcanvasTitle className="d-flex justify-content-between align-items-center">
              <span style={{ fontSize: "15px" }}>
                {" "}
                Robot Details - {selectedRobot._id}
              </span>
            </COffcanvasTitle>
            <button
              type="button"
              className=" border-0 ms-auto py-0 px-1"
              onClick={() => setsideBarVisible(false)}
              style={{ background: "none" }}
            >
              <CIcon icon={cilX} size="xl" />
            </button>
          </COffcanvasHeader>
          <COffcanvasBody>
            {loadingRobot ? (
              <div className="h-75 d-flex justify-content-center align-items-center">
                <LoadingSpinner />
              </div>
            ) : loadingRobotError ? (
              <CBadge color="danger">{loadingRobotError}</CBadge>
            ) : (
              <div>
                {/* === Cleaning Record === */}
                <div className="mb-2 p-1 rounded">
                  <h5 className="text-success mb-3">Cleaning Record</h5>

                  <div className="card shadow-sm rounded-3 m-0">
                    <div className="card-body d-flex flex-column ">
                      {/* Cleaning Start */}
                      <div>
                        <div className="d-flex justify-content-between align-items-center">
                          <>Start:</>{" "}
                          {selectedRobot.cleaning?.start ? (
                            <span className="text-success">
                              {new Date(
                                selectedRobot.cleaning.startAt
                              ).toLocaleString("en-GB", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                                hour12: true,
                              })}
                            </span>
                          ) : (
                            <span className="badge bg-secondary">
                              Not Started
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Cleaning Finish */}
                      <div>
                        <div className="d-flex justify-content-between align-items-center">
                          <>Finish:</>{" "}
                          {selectedRobot.cleaning?.finish ? (
                            <span className="text-success">
                              {new Date(
                                selectedRobot.cleaning.finishAt
                              ).toLocaleString("en-GB", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                                hour12: true,
                              })}
                            </span>
                          ) : (
                            <span className="badge bg-warning text-dark">
                              Not Finished
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Cleaning Cancelled */}
                      {selectedRobot.cleaning?.cleaning_cancelled && (
                        <div>
                          <div className="d-flex justify-content-between align-items-center">
                            {" "}
                            <>Status:</>{" "}
                            <span className="badge bg-danger">
                              Cleaning Cancelled
                            </span>{" "}
                          </div>
                          <div className="d-flex justify-content-between align-items-center">
                            <span>Cleaning Cancelled At</span>
                            <span className="text-muted">
                              <span className="badge bg-danger">
                                at{" "}
                                {new Date(
                                  selectedRobot.cleaning.cleaning_cancelled_at
                                ).toLocaleString("en-GB", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  second: "2-digit",
                                  hour12: true,
                                })}
                              </span>
                            </span>
                          </div>
                        </div>
                      )}
                      {/* Battery Dead */}
                      {selectedRobot.cleaning?.battery_dead && (
                        <div>
                          <strong>Status:</strong>{" "}
                          <span className="badge bg-danger">Battery Dead</span>{" "}
                          <small className="text-muted">
                            at{" "}
                            {new Date(
                              selectedRobot.cleaning.battery_dead_at
                            ).toLocaleString("en-GB", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                              hour12: true,
                            })}
                          </small>
                        </div>
                      )}

                      {/* Cleaning Progress */}
                      {/* {(() => {
                        const lastPoint = selectedRobot.track_details?.length
                          ? selectedRobot.track_details[
                              selectedRobot.track_details.length - 1
                            ].point
                          : 0;

                        const { distanceCovered, totalDistance, percentage } =
                          getCleaningPercentage(lastPoint);

                        // Determine bar styling based on status
                        let progressClass = "progress-bar";
                        if (selectedRobot.cleaning?.finish) {
                          progressClass += " bg-success"; // ✅ Completed
                        } else if (selectedRobot.cleaning?.cleaning_cancelled) {
                          progressClass += " bg-danger"; // ❌ Cancelled
                        } else if (selectedRobot.battery_dead) {
                          progressClass += " bg-dark"; // 🔋 Battery Dead
                        } else if (percentage > 0) {
                          progressClass +=
                            " progress-bar-striped progress-bar-animated bg-info"; // 🚀 In Progress
                        } else {
                          progressClass += " bg-secondary"; // ⏸ Not started
                        }

                        return (
                          <div>
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <strong>Progress:</strong>
                              <small>
                                {distanceCovered} / {totalDistance} (
                                {percentage}%)
                              </small>
                            </div>
                            <div
                              className="progress"
                              style={{ height: "12px", borderRadius: "6px" }}
                            >
                              <div
                                className={progressClass}
                                role="progressbar"
                                style={{ width: `${percentage}%` }}
                                aria-valuenow={percentage}
                                aria-valuemin="0"
                                aria-valuemax="100"
                              ></div>
                            </div>
                          </div>
                        );
                      })()} */}
                      {/* Cleaning Progress */}
                      {(() => {
                        const lastPoint = selectedRobot.track_details?.length
                          ? selectedRobot.track_details[
                              selectedRobot.track_details.length - 1
                            ].point
                          : 0;

                        const { distanceCovered, totalDistance, percentage } =
                          getCleaningPercentage(lastPoint);

                        // Determine bar color/status
                        let color = "";
                        let animated = false;
                        let striped = false;

                        if (selectedRobot.cleaning?.finish) {
                          color = "success"; // ✅ Completed
                        } else if (selectedRobot.cleaning?.cleaning_cancelled) {
                          color = "danger"; // ❌ Cancelled
                        } else if (selectedRobot.battery_dead) {
                          color = "dark"; // 🔋 Battery Dead
                        } else if (percentage > 0) {
                          color = "info"; // 🚀 In Progress
                          animated = true;
                          striped = true;
                        }

                        return (
                          <div>
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <strong>Progress:</strong>
                              <small>
                                {distanceCovered} / {totalDistance} (
                                {percentage}%)
                              </small>
                            </div>

                            <CProgress
                              height={16}
                              className="mb-2 rounded-pill"
                            >
                              <CProgressBar
                                className="z-3"
                                value={percentage}
                                color={color}
                                animated={animated}
                                striped={striped}
                              />
                            </CProgress>
                          </div>
                        );
                      })()}

                      {/* Optional Comments */}
                      {selectedRobot.comments && (
                        <div className="mt-2">
                          <strong>Comments:</strong>{" "}
                          <span className="text-muted">
                            {selectedRobot.comments}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedRobot.track_details?.length > 0 && (
                    <div className="mt-3">
                      <h6 className="text-info mb-2">Track Details:</h6>
                      <div
                        style={{
                          maxHeight: "200px",
                          overflowY: "auto",
                        }}
                      >
                        <table
                          className="table table-sm mb-0 "
                          style={{ minWidth: "100%" }}
                        >
                          <thead
                            style={{
                              position: "sticky",
                              top: 0,
                              backgroundColor: "#fff",
                            }}
                          >
                            <tr>
                              <th className="text-center">#</th>
                              <th className="text-center">Point</th>
                              <th className="text-start">Timestamp</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              ...new Map(
                                selectedRobot.track_details.map((t) => [
                                  t.point,
                                  t,
                                ])
                              ).values(),
                            ]
                              .map((t, idx) => (
                                <tr
                                  key={idx}
                                  className={`${
                                    t.point === 30 ? "table-warning" : ""
                                  }`}
                                >
                                  <td className="text-center">{idx + 1}</td>
                                  <td className="text-center">{t.point}</td>
                                  <td className="text-start">
                                    {new Date(t.timestamp).toLocaleString(
                                      "en-GB",
                                      {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit",
                                        hour12: true,
                                      }
                                    )}
                                  </td>
                                </tr>
                              ))
                              .reverse()}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
                {/* === Robot Information === */}
                <div
                  className="mb-4 p-3 rounded"
                  style={{ backgroundColor: "#1b2a4b" }}
                >
                  <h5 className="text-success mb-3">Robot Information</h5>
                  <div className="d-flex flex-column gap-2">
                    <span>
                      <strong>Robot No:</strong> {selectedRobot.robot_no}
                    </span>
                    <span>
                      <strong>Block:</strong> {selectedRobot.block}
                    </span>
                    <span>
                      <strong>Type:</strong> {selectedRobot.robot_type}
                    </span>
                    <span>
                      <strong>Site:</strong> {selectedRobot.site_id}
                    </span>
                    <span>
                      <strong>Lora No:</strong> {selectedRobot.lora_no}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </COffcanvasBody>
        </COffcanvas>
      )}
    </div>
  );
};

export default RobotTracker;
