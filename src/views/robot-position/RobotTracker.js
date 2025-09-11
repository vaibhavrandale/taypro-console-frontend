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

import React, { useEffect, useReducer, useRef } from "react";
import socket from "../../components/Socket";
import RobotImg from "../../assets/images/robot.png";
import { CBadge, CButton, CImage } from "@coreui/react";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";

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
    default:
      return state;
  }
};

const RobotTracker = () => {
  const [{ error, robots, loading, loadingDelete }, dispatch] = useReducer(
    reducer,
    {
      robots: [],
      loading: true,
      error: "",
      loadingDelete: false,
    }
  );

  const authtoken = useSelector((state) => state.authtoken);
  const scrollRefs = useRef({});
  const robotsRef = useRef([]);
  robotsRef.current = robots;

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

  // Socket: update robots instantly without animation
  useEffect(() => {
    const handleUpdate = ({ _id, point }) => {
      const newPoint = parseInt(point, 10);

      // Update robot state immediately
      dispatch({
        type: "FETCH_SUCCESS",
        payload: robotsRef.current.map((r) =>
          r._id === _id
            ? { ...r, uplink: { ...r.uplink, data: newPoint.toString() } }
            : r
        ),
      });

      // Update scroll
      const robot = robotsRef.current.find((r) => r._id === _id);
      const el = scrollRefs.current[_id];
      if (robot && el) {
        const L = robot.row_length || 1;
        let segmentPct = 0;

        if (newPoint >= 19 && newPoint <= 29)
          segmentPct = (newPoint - 19) / (29 - 19);
        else if (newPoint >= 29 && newPoint <= 40)
          segmentPct = (newPoint - 29) / (40 - 29);
        else segmentPct = newPoint / L;

        const iconOffsetPx = segmentPct * L * 25;
        const halfWidth = el.clientWidth / 2;
        let targetScroll =
          newPoint >= 19 && newPoint <= 29
            ? iconOffsetPx - el.clientWidth * 0.25
            : newPoint >= 29 && newPoint <= 40
            ? iconOffsetPx - el.clientWidth * 0.75
            : iconOffsetPx - halfWidth;

        targetScroll = Math.max(
          0,
          Math.min(targetScroll, el.scrollWidth - el.clientWidth)
        );
        el.scrollTo({ left: targetScroll, behavior: "auto" });
      }
    };

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

  // Helper: get robot phase & segment
  const getRobotPhase = (pt, L) => {
    let phase, badgeColor, iconBorder, segmentPct;
    if (pt === 40 || pt === 11) {
      phase = "At Dock";
      badgeColor = "success";
      iconBorder = "#343a40";
      segmentPct = 0;
    } else if (pt === 29) {
      phase = "At Reverse Station";
      badgeColor = "warning";
      iconBorder = "#ffc107";
      segmentPct = 1;
    } else if (pt >= 19 && pt <= 29) {
      phase = "Forward Cleaning";
      badgeColor = "success";
      iconBorder = "#2eb85c";
      segmentPct = (pt - 19) / (29 - 19);
    } else if (pt >= 29 && pt <= 40) {
      phase = "Reverse Cleaning";
      badgeColor = "primary";
      iconBorder = "#0d6efd";
      segmentPct = (pt - 29) / (40 - 29);
    } else {
      phase = "At Dock";
      badgeColor = "secondary";
      iconBorder = "#6c757d";
      segmentPct = pt / L;
    }
    return { phase, badgeColor, iconBorder, segmentPct };
  };

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
          const pt = parseInt(item.uplink?.data || "0", 10);
          const L = item.row_length || 1;
          const progressPercent = (pt / L) * 100;
          const distanceCovered = pt;
          const { phase, badgeColor, iconBorder, segmentPct } = getRobotPhase(
            pt,
            L
          );

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
                  <span style={{ fontSize: "12px" }}>
                    📍 Current Point: {pt}
                  </span>
                  <span style={{ fontSize: "12px" }}>
                    📏 Distance Covered: {distanceCovered} m / {L * 2} m
                  </span>
                  <span style={{ fontSize: "12px" }}>
                    📊 Progress: {progressPercent.toFixed(1)}%
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
                  )}
                  <div className="d-flex justify-content-end align-items-center">
                    <CButton
                      onClick={(e) => deleteHandler(e, item._id)}
                      size="sm"
                      color="danger"
                    >
                      {loadingDelete ? "Deleting..." : "Delete"}
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
    </div>
  );
};

export default RobotTracker;
