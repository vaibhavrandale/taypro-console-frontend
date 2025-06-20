import { cilLocationPin } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../components/LoadingSpinner";

const RobotRow = ({ robot }) => {
  const [distance, setDistance] = useState(0);
  const [atDS, setAtDS] = useState(false);
  const [calculated_finish_timestamp, setFinishTime] = useState("");
  const [totalCovered, setTotalCovered] = useState(0);
  const [isStuckNow, setIsStuckNow] = useState(false);
  const [stuckLocation, setStuckLocation] = useState(""); // NEW: Track stuck location for status

  // useEffect(() => {
  //   const oneWayDistance = robot.row_length;
  //   const totalTripTime =
  //     (new Date(robot.calculated_finish_timestamp) -
  //       new Date(robot.start_timestamp)) /
  //     1000; // in seconds

  //   const update = () => {
  //     const now = new Date();
  //     const elapsedTime = (now - new Date(robot.start_timestamp)) / 1000; // in seconds

  //     // Handle stuck robots with "Battery Dead" or "Stuck in bridge/Module"
  //     if (
  //       robot.isStuck &&
  //       (robot.stuck_reason === "Battery Dead" ||
  //         robot.stuck_reason === "Stuck in bridge/Module") &&
  //       now >= new Date(robot.stuck_at)
  //     ) {
  //       const stuckElapsedTime =
  //         (new Date(robot.stuck_at) - new Date(robot.start_timestamp)) / 1000; // Time when robot got stuck
  //       const clampedStuckTime = Math.max(
  //         0,
  //         Math.min(stuckElapsedTime, totalTripTime)
  //       );
  //       const stuckProgress = clampedStuckTime / totalTripTime;

  //       let stuckDistance;
  //       let stuckCovered;
  //       let location;

  //       if (stuckProgress <= 0.5) {
  //         stuckDistance = oneWayDistance * (stuckProgress * 2);
  //         stuckCovered = stuckDistance;
  //         location =
  //           stuckDistance >= oneWayDistance
  //             ? "at RS"
  //             : `at ${Math.round(stuckDistance)}m from DS`;
  //       } else {
  //         stuckDistance = oneWayDistance * ((1 - stuckProgress) * 2);
  //         stuckCovered = oneWayDistance + (oneWayDistance - stuckDistance);
  //         location =
  //           stuckDistance <= 0
  //             ? "at DS"
  //             : `at ${Math.round(stuckDistance)}m from DS`;
  //       }

  //       // Cap totalCovered at one round trip
  //       stuckCovered = Math.min(stuckCovered, oneWayDistance * 2);

  //       setDistance(Math.round(stuckDistance)); // Robot stays at stuck position
  //       setTotalCovered(Math.round(stuckCovered)); // Distance covered until stuck
  //       setIsStuckNow(true);
  //       setAtDS(false); // Not at DS
  //       setStuckLocation(location);
  //       return;
  //     }

  //     // Logic for non-stuck robots or before stuck_at
  //     if (now >= new Date(robot.calculated_finish_timestamp)) {
  //       setAtDS(true);
  //       setDistance(0); // Robot visually at DS
  //       setTotalCovered(oneWayDistance * 2); // Total path robot completed
  //       setIsStuckNow(false);
  //       setStuckLocation("");
  //       return;
  //     }

  //     const clampedTime = Math.max(0, Math.min(elapsedTime, totalTripTime));
  //     const progress = clampedTime / totalTripTime;

  //     let currentDistance;
  //     let covered;

  //     if (progress <= 0.5) {
  //       currentDistance = oneWayDistance * (progress * 2);
  //       covered = currentDistance;
  //     } else {
  //       currentDistance = oneWayDistance * ((1 - progress) * 2);
  //       covered = oneWayDistance + (oneWayDistance - currentDistance);
  //     }

  //     // Cap totalCovered at one round trip
  //     covered = Math.min(covered, oneWayDistance * 2);

  //     setDistance(Math.round(currentDistance));
  //     setTotalCovered(Math.round(covered));
  //     setIsStuckNow(false);
  //     setStuckLocation("");
  //   };

  //   // setFinishTime(
  //   //   robot.calculated_finish_timestamp.toLocaleTimeString([], {
  //   //     hour: "2-digit",
  //   //     minute: "2-digit",
  //   //   })
  //   // );

  //   setFinishTime(
  //     new Date(robot.calculated_finish_timestamp).toLocaleTimeString([], {
  //       hour: "2-digit",
  //       minute: "2-digit",
  //     })
  //   );

  //   update();
  //   const interval = setInterval(update, 10);
  //   return () => clearInterval(interval);
  // }, [robot]);

  useEffect(() => {
    const oneWayDistance = robot.row_length;
    const totalTripTime =
      (new Date(robot.calculated_finish_timestamp) -
        new Date(robot.start_timestamp)) /
      1000;

    const update = () => {
      const now = new Date();
      const elapsedTime = (now - new Date(robot.start_timestamp)) / 1000;

      if (
        robot.isStuck &&
        (robot.stuck_reason === "Battery Dead" ||
          robot.stuck_reason === "Stuck in bridge/Module") &&
        now >= new Date(robot.stuck_at)
      ) {
        const stuckElapsedTime =
          (new Date(robot.stuck_at) - new Date(robot.start_timestamp)) / 1000;
        const clampedStuckTime = Math.max(
          0,
          Math.min(stuckElapsedTime, totalTripTime)
        );
        const stuckProgress = clampedStuckTime / totalTripTime;

        let stuckDistance;
        let stuckCovered;
        let location;

        if (stuckProgress <= 0.5) {
          stuckDistance = oneWayDistance * (stuckProgress * 2);
          stuckCovered = stuckDistance;
          location =
            stuckDistance >= oneWayDistance
              ? "at RS"
              : `at ${Math.round(stuckDistance)}m from DS`;
        } else {
          stuckDistance = oneWayDistance * ((1 - stuckProgress) * 2);
          stuckCovered = oneWayDistance + (oneWayDistance - stuckDistance);
          location =
            stuckDistance <= 0
              ? "at DS"
              : `at ${Math.round(stuckDistance)}m from DS`;
        }

        stuckCovered = Math.min(stuckCovered, oneWayDistance * 2);

        setDistance(Math.round(stuckDistance));
        setTotalCovered(Math.round(stuckCovered));
        setIsStuckNow(true);
        setAtDS(false);
        setStuckLocation(location);
        return;
      }

      if (now >= new Date(robot.calculated_finish_timestamp)) {
        setAtDS(true);
        setDistance(0);
        setTotalCovered(oneWayDistance * 2);
        setIsStuckNow(false);
        setStuckLocation("");
        return;
      }

      const clampedTime = Math.max(0, Math.min(elapsedTime, totalTripTime));
      const progress = clampedTime / totalTripTime;

      let currentDistance;
      let covered;

      if (progress <= 0.5) {
        currentDistance = oneWayDistance * (progress * 2);
        covered = currentDistance;
      } else {
        currentDistance = oneWayDistance * ((1 - progress) * 2);
        covered = oneWayDistance + (oneWayDistance - currentDistance);
      }

      covered = Math.min(covered, oneWayDistance * 2);

      setDistance(Math.round(currentDistance));
      setTotalCovered(Math.round(covered));
      setIsStuckNow(false);
      setStuckLocation("");
    };

    setFinishTime(
      new Date(robot.calculated_finish_timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    );

    let animationFrameId;
    const loop = () => {
      update();
      animationFrameId = requestAnimationFrame(loop);
    };
    loop();

    return () => cancelAnimationFrame(animationFrameId);
  }, [robot]);

  const percent = Math.min(
    100,
    Math.max(0, (distance / robot.row_length) * 100)
  );
  const isRunning = !atDS && !isStuckNow;
  const robotColor = isStuckNow
    ? "#FF0000" // Red for stuck
    : atDS
    ? "#4CAF50" // Green for at DS
    : isRunning
    ? "#FFA000" // Orange for running
    : "#0D47A1"; // Blue for default

  return (
    <div style={{ marginBottom: "40px", padding: "5px 20px" }}>
      <div
        style={{
          position: "relative",
          height: "15px",
          background: "#B3E5FC",
          borderRadius: "4px",
          marginBottom: "50px",
        }}
      >
        <span
          style={{
            position: "absolute",
            left: 10,
            top: "-25px",
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

        <div
          style={{
            position: "absolute",
            left: `calc(${percent}% - 23px)`,
            top: "-12px",
            width: "30px",
            height: "60px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            transition: "left 0.5s ease-in-out",
          }}
        >
          <div
            style={{ width: "30px", height: "5px", background: robotColor }}
          />
          <div
            style={{
              width: "10px",
              height: "40px",
              background: robotColor,
            }}
          />
          <div
            style={{ width: "30px", height: "5px", background: robotColor }}
          />
          <div
            style={{
              fontSize: "12px",
              color: robotColor,
              marginTop: "4px",
              fontWeight: "bold",
            }}
          >
            {robot.robot_no.slice(-3)}
          </div>
        </div>
      </div>

      <div
        style={{
          color: "#fff",
          textAlign: "start",
          fontSize: "13px",
        }}
      >
        {isStuckNow
          ? `Robot No: ${robot.robot_no} | Stuck on Row ${stuckLocation} (Reason: ${robot.stuck_reason}) | Distance covered: ${totalCovered}m`
          : atDS
          ? `Robot No: ${robot.robot_no} | At Dock | Total distance covered: ${totalCovered}m`
          : `Robot No: ${robot.robot_no} | Distance covered: ${totalCovered}m | Finish Time: ${calculated_finish_timestamp}`}
      </div>
    </div>
  );
};
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loadingRobots: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loadingRobots: false, robotsData: action.payload };
    case "FETCH_FAIL":
      return { ...state, loadingRobots: false, error: action.payload };

    default:
      return state;
  }
};
const RobotPosition = () => {
  const site_id = "taypro_office";
  const [{ error, robotsData, loadingRobots }, dispatch] = useReducer(reducer, {
    robotsData: [],
    loadingRobots: true,
    error: "",
  });
  const authtoken = useSelector((state) => state.authtoken);
  // useEffect(() => {
  //   const fetchRobots = async () => {
  //     dispatch({ type: "FETCH_REQUEST" });
  //     try {
  //       const result = await axios.get(
  //         `/api/v1/robotpositiontracker/${site_id}`,

  //         {
  //           headers: { Authorization: `Bearer ${authtoken}` },
  //         }
  //       );
  //       console.log(result.data);

  //       dispatch({
  //         type: "FETCH_SUCCESS",
  //         payload: result.data,
  //       });
  //     } catch (error) {
  //       dispatch({
  //         type: "FETCH_FAIL",
  //         payload: error.response?.data?.message || error.response?.data?.error,
  //       });
  //       toast.error(
  //         error.response?.data?.message || error.response?.data?.error
  //       );
  //     }
  //   };

  //   fetchRobots();
  // }, [authtoken]);

  useEffect(() => {
    let intervalId;

    const fetchRobots = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get(
          `/api/v1/robotpositiontracker/${site_id}`,
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );
        console.log(result.data);

        dispatch({
          type: "FETCH_SUCCESS",
          payload: result.data,
        });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: error.response?.data?.message || error.response?.data?.error,
        });
        toast.error(
          error.response?.data?.message || error.response?.data?.error
        );
      }
    };

    // Immediately call once
    fetchRobots();

    // Then set interval
    intervalId = setInterval(fetchRobots, 7000); // every 5 seconds

    return () => {
      clearInterval(intervalId); // cleanup on unmount
    };
  }, [authtoken, site_id]); // 🔁 include `site_id` if it can change

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ marginBottom: "30px", textAlign: "center" }}>
        <CIcon icon={cilLocationPin} color="primary" size="xl" /> Live Robot
        Position Tracking
      </h2>

      {loadingRobots ? (
        <LoadingSpinner />
      ) : error ? (
        { error }
      ) : (
        robotsData.map((robot) => <RobotRow key={robot._id} robot={robot} />)
      )}
    </div>
  );
};

export default RobotPosition;
