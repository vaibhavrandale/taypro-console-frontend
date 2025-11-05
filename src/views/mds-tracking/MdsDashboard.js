// import React, { useEffect, useReducer, useState } from "react";
// import MdsRowTrack from "./MdsRowTrack";
// import Robot from "./Robot";
// import { MdsRailingTrack } from "./MdsRailingTrack";
// import { mdsTracking } from "./mds";
// import { CBadge, CSpinner } from "@coreui/react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import toast from "react-hot-toast";
// import LoadingSpinner from "../../components/LoadingSpinner";
// import socket from "../../components/Socket";
// const reducer = (state, action) => {
//   switch (action.type) {
//     case "FETCH_REQUEST":
//       return { ...state, loading: true, error: "" };
//     case "FETCH_SUCCESS":
//       return { ...state, loading: false, mdsdevices: action.payload };
//     case "FETCH_FAIL":
//       return {
//         ...state,
//         loading: false,
//         error: action.payload,

//         mdsdevices: [], // 🔥 clear previous robots on error
//       };

//     default:
//       return state;
//   }
// };
// const MdsDashboard = () => {
//   const [{ error, mdsdevices, loading }, dispatch] = useReducer(reducer, {
//     mdsdevices: [],
//     loading: true,
//     error: "",
//   });

//   // const [trackingIndex] = useState(0);
//   // const data = mdsTracking[trackingIndex];
//   const authtoken = useSelector((state) => state.authtoken);

//   const site_id = "taypro_office";
//   useEffect(() => {
//     if (site_id) {
//       socket.emit("join_site_id_room", site_id);
//       console.log("Joined site:", site_id);
//     }
//     return () => socket.emit("leave_site_id_room", site_id);
//   }, [site_id]);

//   useEffect(() => {
//     // Listen to MDS updates
//     socket.on("emitMdsUpdate", ({ tracking }) => {
//       toast.success(tracking.mds_no);
//       // Replace current data with the updated tracking data
//       dispatch({ type: "FETCH_SUCCESS", payload: [tracking] });
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   useEffect(() => {
//     const fetchmdsTracking = async () => {
//       dispatch({ type: "FETCH_REQUEST" });
//       try {
//         const response = await axios.get("/api/v1/mds-tracking", {
//           headers: { Authorization: `Bearer ${authtoken}` },
//         });
//         console.log(response.data.data);

//         dispatch({ type: "FETCH_SUCCESS", payload: response.data.data });
//         dispatch({ type: "DELETE_RESET" }); // 👈 reset flag
//       } catch (error) {
//         dispatch({
//           type: "FETCH_FAIL",
//           payload: error.response?.data?.error || error.response?.data?.message,
//         });
//         toast.error(
//           error.response?.data?.error || error.response?.data?.message
//         );
//       }
//     };

//     fetchmdsTracking();
//   }, [authtoken]);

//   const data = mdsdevices[0];

//   const totalRows = data?.no_of_rows;

//   // ✅ all MDS inactive?
//   const allMdsInactive =
//     data &&
//     data?.mds_positions.length > 0 &&
//     data?.mds_positions.every((p) => p.active === false);

//   // ✅ dock condition (only one dock → row 1)
//   const isDocked =
//     allMdsInactive &&
//     data?.default_mds_position?.mds_released === true &&
//     data?.default_mds_position?.mds_returned === true;

//   const isMoving =
//     allMdsInactive &&
//     data?.default_mds_position?.mds_released === true &&
//     data?.default_mds_position?.mds_returned === false;

//   // ✅ find active position (if any)
//   const activeMdsPosition = data?.mds_positions.find(
//     (p) => p.active || (p.robot_released && !p.robot_returned)
//   );

//   // ✅ when docked → always row 1
//   const activeRowNumber = isDocked ? 1 : activeMdsPosition?.row_number || 1;

//   return (
//     <div>
//       <h5 className="text-center text-success">MDS Tracking</h5>

//       {loading ? (
//         <LoadingSpinner />
//       ) : error ? (
//         <CBadge color="danger">{error}</CBadge>
//       ) : (
//         <div className="d-flex flex-column align-items-start p-4">
//           <div className="d-flex align-items-start">
//             <MdsRailingTrack
//               totalRows={totalRows}
//               activeRow={activeRowNumber}
//             />

//             <div className="d-flex flex-column ms-4">
//               {data.rows.map((row) => {
//                 let robotPos = 0;
//                 let showRobotOnMds = false;

//                 if (row.row_no === activeRowNumber) {
//                   const track = row.track_details;

//                   if (
//                     !track ||
//                     track.length === 0 ||
//                     (row.cleaning.start && row.cleaning.finish)
//                   ) {
//                     showRobotOnMds = true;
//                     robotPos = -75; // robot sits on MDS at dock
//                   } else {
//                     const currentPoint = track[track.length - 1].point;

//                     if (row.cleaning.start && row.cleaning.finish) {
//                       robotPos = 0;
//                     } else if (currentPoint <= 30) {
//                       const forwardStart = 20;
//                       const forwardEnd = 30;
//                       robotPos =
//                         ((currentPoint - forwardStart) /
//                           (forwardEnd - forwardStart)) *
//                         row.row_length;
//                     } else if (currentPoint > 30 && currentPoint <= 40) {
//                       const reverseStart = 30;
//                       const reverseEnd = 40;
//                       robotPos =
//                         row.row_length -
//                         ((currentPoint - reverseStart) /
//                           (reverseEnd - reverseStart)) *
//                           row.row_length;
//                     } else if (currentPoint > 40) {
//                       robotPos = 0;
//                     }
//                   }
//                 }

//                 const mdsPosition = data?.mds_positions.find(
//                   (p) => p.row_number === row.row_no
//                 );

//                 // const showMdsBridge =
//                 //   mdsPosition?.active || (isDocked && row.row_no === 1);
//                 const showMdsBridge =
//                   mdsPosition?.active ||
//                   (isDocked && row.row_no === 1) ||
//                   (isMoving && row.row_no === activeRowNumber);

//                 return (
//                   <div
//                     key={row.row_no}
//                     style={{ position: "relative", height: "70px" }}
//                   >
//                     <MdsRowTrack row={row} />

//                     {/* Bridge */}
//                     {showMdsBridge && (
//                       <div
//                         style={{
//                           position: "absolute",
//                           left: "-71px",
//                           top: "0px",
//                           width: "70px",
//                           height: "39px",
//                           borderRadius: "1px",
//                           border: "1px solid grey",
//                           transition: "width 0.5s linear",
//                         }}
//                       >
//                         <span
//                           className="d-flex justify-content-center align-items-center ms-4"
//                           style={{ height: "100%" }}
//                         >
//                           {row.row_no}
//                         </span>
//                       </div>
//                     )}

//                     {/* ✅ Robot on active row or dock */}
//                     {row.row_no === activeRowNumber &&
//                       (isMoving || activeMdsPosition || isDocked) && (
//                         <div
//                           style={{
//                             position: "absolute",
//                             top: "0px",
//                             left: `${showRobotOnMds ? -75 : robotPos * 5}px`,
//                             transition: "left 0.2s linear",
//                             zIndex: 10,
//                           }}
//                         >
//                           <Robot />
//                         </div>
//                       )}

//                     {/* ✅ MDS visual */}
//                     {showMdsBridge && (
//                       <div
//                         style={{
//                           position: "absolute",
//                           top: "0px",
//                           left: "-71px",
//                           width: "30px",
//                           height: "39px",
//                           background:
//                             "linear-gradient(to bottom, #263238, #455A64, #263238)",
//                           borderRadius: "1px",
//                           boxShadow: "0 0 10px rgba(0,0,0,0.5)",
//                           color: "#fff",
//                           textAlign: "center",
//                           fontSize: "12px",
//                           lineHeight: "25px",
//                         }}
//                       >
//                         <span className="d-flex flex-column justify-content-start align-items-center">
//                           MDS{" "}
//                           <span className="d-flex">
//                             {isDocked ? (
//                               <span
//                                 style={{
//                                   color: "lime",
//                                   fontSize: "12px",
//                                   position: "relative",
//                                   top: "15px",
//                                 }}
//                               >
//                                 Docked
//                               </span>
//                             ) : (
//                               <CSpinner
//                                 style={{ height: "10px", width: "10px" }}
//                                 color={isMoving ? "warning" : "success"} // ✅ change here
//                                 variant="grow"
//                               />
//                             )}
//                           </span>
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MdsDashboard;

import React, { useEffect, useReducer, useState } from "react";
import MdsRowTrack from "./MdsRowTrack";
import Robot from "./Robot";
import { MdsRailingTrack } from "./MdsRailingTrack";
import { CBadge, CButton } from "@coreui/react";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";
import socket from "../../components/Socket";
import { FaArrowUp } from "react-icons/fa";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    // case "FETCH_SUCCESS":
    //   return { ...state, loading: false, mdsdevices: action.payload };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        mdsdevices:
          typeof action.payload === "function"
            ? action.payload(state.mdsdevices)
            : action.payload,
      };

    case "FETCH_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
        mdsdevices: [],
      };

    case "SEND_DOWNLINK_REQUEST":
      return { ...state, sendingCommandloading: true, error: "" };

    case "SEND_DOWNLINK_SUCCESS":
      return { ...state, sendingCommandloading: false };

    case "SEND_DOWNLINK_FAIL":
      return {
        ...state,
        sendingCommandloading: false,
        sendCommandError: action.payload,
      };
    default:
      return state;
  }
};

const MdsDashboard = () => {
  const [
    { error, mdsdevices, loading, sendingCommandloading, sendCommandError },
    dispatch,
  ] = useReducer(reducer, {
    mdsdevices: [],
    loading: true,
    error: "",
    sendCommandError: "",
    sendingCommandloading: false,
  });
  const [customDownlink, setCustomDownlink] = useState("");
  function mergeLastActivity(existing = [], incoming = []) {
    const combined = [...existing, ...incoming];
    const unique = combined.reduce((acc, item) => {
      const id = item._id?.$oid || item._id || item.timestamp;
      if (!acc.some((a) => (a._id?.$oid || a._id || a.timestamp) === id)) {
        acc.push(item);
      }
      return acc;
    }, []);
    return unique.sort(
      (a, b) =>
        new Date(b.timestamp?.$date || b.timestamp) -
        new Date(a.timestamp?.$date || a.timestamp)
    );
  }

  function mergeUniqueArrayByKey(existing = [], incoming = [], key) {
    const map = new Map();
    [...existing, ...incoming].forEach((item) => {
      const value = item[key];
      map.set(value, { ...(map.get(value) || {}), ...item });
    });
    return Array.from(map.values());
  }

  const authtoken = useSelector((state) => state.authtoken);
  const site_id = "taypro_office";
  useEffect(() => {
    if (site_id) {
      socket.emit("join_site_id_room", site_id);
      console.log("Joined site:", site_id);
    }
    return () => socket.emit("leave_site_id_room", site_id);
  }, [site_id]);

  const handleMdsUpdate = ({ tracking }) => {
    toast.success(`${tracking.mds_no} Updated`, { position: "top-right" });

    dispatch({
      type: "FETCH_SUCCESS",
      payload: (prevMdsDevices) => {
        const index = prevMdsDevices.findIndex(
          (m) => m._id === tracking._id || m.mds_no === tracking.mds_no
        );

        if (index !== -1) {
          const existing = prevMdsDevices[index];

          const mergedPositions = mergeUniqueArrayByKey(
            existing.mds_positions || [],
            tracking.mds_positions || [],
            "row_number"
          );

          const mergedActivity = mergeLastActivity(
            existing.last_activity || [],
            tracking.last_activity || []
          );

          const updated = [...prevMdsDevices];
          updated[index] = {
            ...existing,
            ...tracking,
            mds_positions: mergedPositions,
            last_activity: mergedActivity,
            updatedAt: new Date().toISOString(),
          };

          return updated;
        }

        // New MDS → add at the start
        return [tracking, ...prevMdsDevices];
      },
    });
  };
  useEffect(() => {
    // Remove old listener first
    socket.off("emitMdsUpdate", handleMdsUpdate);
    socket.on("emitMdsUpdate", handleMdsUpdate);

    return () => socket.off("emitMdsUpdate", handleMdsUpdate);
  }, [dispatch]);

  useEffect(() => {
    const fetchmdsTracking = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const response = await axios.get("/api/v1/mds-tracking", {
          headers: { Authorization: `Bearer ${authtoken}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: response.data.data });
      } catch (err) {
        const msg = err.response?.data?.error || err.response?.data?.message;
        dispatch({ type: "FETCH_FAIL", payload: msg });
        toast.error(msg);
      }
    };
    fetchmdsTracking();
  }, [authtoken]);

  if (loading) return <LoadingSpinner />;
  if (error) return <CBadge color="danger">{error}</CBadge>;
  if (!mdsdevices.length) return <div>No MDS Data Found</div>;

  const sendCustomDownlink = async (command, deveui) => {
    console.log(command, deveui);

    dispatch({ type: "SEND_DOWNLINK_REQUEST" });
    try {
      const data = await axios.post(
        "/api/v1/mds-device/send-mqtt-downlink",
        {
          deveui,
          payload: command,
        },
        {
          headers: { Authorization: `Bearer ${authtoken}` },
        }
      );

      toast.success(data.data.message);
      dispatch({ type: "SEND_DOWNLINK_SUCCESS" });
    } catch (error) {
      dispatch({
        type: "SEND_DOWNLINK_FAIL",
        payload: error.response?.data?.message || error.response?.data?.error,
      });

      toast.error(error.response.data.message || error.response?.data?.error);
    }
    // setCustomDownlink("");
  };

  return (
    <div className="p-4">
      <h5 className="text-center text-success mb-4">MDS Tracking</h5>

      {mdsdevices.map((data, index) => {
        const totalRows = data?.no_of_rows;
        const allMdsInactive =
          data?.mds_positions?.length > 0 &&
          data.mds_positions.every((p) => p.active === false);

        const isDocked =
          allMdsInactive &&
          data?.default_mds_position?.mds_released === true &&
          data?.default_mds_position?.mds_returned === true;

        const isMoving =
          allMdsInactive &&
          data?.default_mds_position?.mds_released === true &&
          data?.default_mds_position?.mds_returned === false;

        const activeMdsPosition = data?.mds_positions.find(
          (p) => p.active || (p.robot_released && !p.robot_returned)
        );

        const activeRowNumber = isDocked
          ? 1
          : activeMdsPosition?.row_number || 1;

        return (
          <div key={index} className="mb-5 border p-3 rounded">
            <h6 className="mb-3">{data.mds_no}</h6>
            <div className="d-flex justify-content-end align-items-center">
              <form className="position-relative ">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter command"
                  name={customDownlink}
                  onChange={(e) => setCustomDownlink(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && customDownlink) {
                      e.preventDefault(); // Prevent form submission
                      sendCustomDownlink(customDownlink); // Trigger the same function as the button
                    }
                  }}
                />
                <CButton
                  onClick={() =>
                    sendCustomDownlink(customDownlink, data.deveui)
                  }
                  type="button"
                  className="d-flex justify-content-center align-items-center btn-sm"
                  style={{
                    background: "#17db17",
                    color: "white",
                    height: "30px",
                    width: "30px",
                    borderRadius: "50%",
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                >
                  <span className="d-flex justify-content-center align-items-center">
                    {sendingCommandloading ? <LoadingSpinner /> : <FaArrowUp />}
                  </span>
                </CButton>
                {sendCommandError && (
                  <CBadge color="danger">{sendCommandError}</CBadge>
                )}
              </form>
            </div>
            <div className="d-flex align-items-start">
              <MdsRailingTrack
                totalRows={totalRows}
                activeRow={activeRowNumber}
              />

              <div className="d-flex flex-column ms-4">
                {data.rows.map((row, index) => {
                  let robotPos = 0;
                  let showRobotOnMds = false;

                  if (row.row_no === activeRowNumber) {
                    const track = row.track_details;

                    if (
                      !track ||
                      track.length === 0 ||
                      (row.cleaning.start && row.cleaning.finish)
                    ) {
                      showRobotOnMds = true;
                      robotPos = -75;
                    } else {
                      const currentPoint = track[track.length - 1]?.point || 0;

                      if (row.cleaning.start && row.cleaning.finish) {
                        robotPos = 0;
                      } else if (currentPoint <= 30) {
                        const forwardStart = 20;
                        const forwardEnd = 30;
                        robotPos =
                          ((currentPoint - forwardStart) /
                            (forwardEnd - forwardStart)) *
                          row.row_length;
                      } else if (currentPoint > 30 && currentPoint <= 40) {
                        const reverseStart = 30;
                        const reverseEnd = 40;
                        robotPos =
                          row.row_length -
                          ((currentPoint - reverseStart) /
                            (reverseEnd - reverseStart)) *
                            row.row_length;
                      } else if (currentPoint > 40) {
                        robotPos = 0;
                      }
                    }
                  }

                  const mdsPosition = data?.mds_positions.find(
                    (p) => p.row_number === row.row_no
                  );

                  const showMdsBridge =
                    mdsPosition?.active ||
                    (isDocked && row.row_no === 1) ||
                    (isMoving && row.row_no === activeRowNumber);

                  return (
                    <div
                      key={index}
                      style={{ position: "relative", height: "70px" }}
                    >
                      <MdsRowTrack row={row} />

                      {/* Bridge */}
                      {showMdsBridge && (
                        <div
                          style={{
                            position: "absolute",
                            left: "-71px",
                            top: "0px",
                            width: "70px",
                            height: "39px",
                            borderRadius: "1px",
                            border: "1px solid grey",
                            transition: "width 0.5s linear",
                          }}
                        >
                          <span
                            className="d-flex justify-content-center align-items-center ms-4"
                            style={{ height: "100%" }}
                          >
                            {row.row_no}
                          </span>
                        </div>
                      )}

                      {/* Robot */}
                      {row.row_no === activeRowNumber &&
                        (isMoving || activeMdsPosition || isDocked) && (
                          <div
                            style={{
                              position: "absolute",
                              top: "0px",
                              left: `${showRobotOnMds ? -75 : robotPos * 5}px`,
                              transition: "left 0.2s linear",
                              zIndex: 10,
                            }}
                          >
                            <Robot />
                          </div>
                        )}

                      {/* MDS visual */}
                      {showMdsBridge && (
                        <div
                          style={{
                            position: "absolute",
                            top: "0px",
                            left: "-71px",
                            width: "30px",
                            height: "39px",
                            background:
                              "linear-gradient(to bottom, #263238, #455A64, #263238)",
                            borderRadius: "1px",
                            boxShadow: "0 0 10px rgba(0,0,0,0.5)",
                            color: "#fff",
                            textAlign: "center",
                            fontSize: "12px",
                            lineHeight: "25px",
                          }}
                        >
                          <span className="d-flex flex-column justify-content-start align-items-center">
                            MDS{" "}
                            <span className="d-flex">
                              {isDocked ? (
                                <span
                                  style={{
                                    color: "lime",
                                    fontSize: "12px",
                                    position: "relative",
                                    top: "15px",
                                  }}
                                >
                                  Docked
                                </span>
                              ) : (
                                <span
                                  style={{
                                    width: "10px",
                                    height: "10px",
                                    backgroundColor: isMoving
                                      ? "orange"
                                      : "lime",
                                    borderRadius: "50%",
                                    display: "inline-block",
                                    // marginTop: "10px",
                                  }}
                                />
                              )}
                            </span>
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MdsDashboard;
