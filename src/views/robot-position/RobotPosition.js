import React, { useEffect, useState } from "react";

// Dynamically generate robots with future start/finish times
const robotsData = [
  {
    robot_no: "R1",
    startTime: new Date("2025-06-17T15:00:00"),
    speed: 12,
    row_length: 220,
    isStuck: true,
    stuck_reason: "Battery Dead",
    stuck_at: new Date("2025-06-17T15:10:51"),
    finishTime: new Date("2025-06-17T15:11:00"),
  },
  {
    robot_no: "R2",
    startTime: new Date("2025-06-17T18:01:00"),
    speed: 12,
    row_length: 120,
    isStuck: false,
    stuck_reason: "N/A",
    finishTime: new Date("2025-06-17T18:46:00"),
  },
  {
    robot_no: "R3",
    startTime: new Date("2025-06-17T11:02:00"),
    speed: 12,
    row_length: 120,
    isStuck: false,
    stuck_reason: "N/A",
    finishTime: new Date("2025-06-17T15:06:00"),
  },
  {
    robot_no: "R4",
    startTime: new Date("2025-06-17T15:01:00"),
    speed: 12,
    row_length: 120,
    isStuck: true,
    stuck_reason: "Stuck in bridge/Module",
    stuck_at: new Date("2025-06-17T15:02:00"),
    finishTime: new Date("2025-06-17T15:06:00"),
  },
  {
    robot_no: "R5",
    startTime: new Date("2025-06-17T18:40:00"),
    speed: 12,
    row_length: 120,
    isStuck: false,
    stuck_reason: "N/A",
    finishTime: new Date("2025-06-17T18:55:00"),
  },
];

const RobotRow = ({ robot }) => {
  const [distance, setDistance] = useState(0);
  const [atDS, setAtDS] = useState(false);
  const [finishTime, setFinishTime] = useState("");
  const [totalCovered, setTotalCovered] = useState(0);
  const [isStuckNow, setIsStuckNow] = useState(false);
  const [stuckLocation, setStuckLocation] = useState(""); // NEW: Track stuck location for status
  useEffect(() => {
    const oneWayDistance = robot.row_length;
    const totalTripTime = (robot.finishTime - robot.startTime) / 1000; // in seconds

    const update = () => {
      const now = new Date();
      const elapsedTime = (now - robot.startTime) / 1000; // in seconds

      // Handle stuck robots with "Battery Dead" or "Stuck in bridge/Module"
      if (
        robot.isStuck &&
        (robot.stuck_reason === "Battery Dead" ||
          robot.stuck_reason === "Stuck in bridge/Module") &&
        now >= robot.stuck_at
      ) {
        const stuckElapsedTime = (robot.stuck_at - robot.startTime) / 1000; // Time when robot got stuck
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

        // Cap totalCovered at one round trip
        stuckCovered = Math.min(stuckCovered, oneWayDistance * 2);

        setDistance(Math.round(stuckDistance)); // Robot stays at stuck position
        setTotalCovered(Math.round(stuckCovered)); // Distance covered until stuck
        setIsStuckNow(true);
        setAtDS(false); // Not at DS
        setStuckLocation(location);
        return;
      }

      // Logic for non-stuck robots or before stuck_at
      if (now >= robot.finishTime) {
        setAtDS(true);
        setDistance(0); // Robot visually at DS
        setTotalCovered(oneWayDistance * 2); // Total path robot completed
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

      // Cap totalCovered at one round trip
      covered = Math.min(covered, oneWayDistance * 2);

      setDistance(Math.round(currentDistance));
      setTotalCovered(Math.round(covered));
      setIsStuckNow(false);
      setStuckLocation("");
    };

    setFinishTime(
      robot.finishTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    );

    update();
    const interval = setInterval(update, 10);
    return () => clearInterval(interval);
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
            {robot.robot_no}
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
          : `Robot No: ${robot.robot_no} | Distance covered: ${totalCovered}m | Finish Time: ${finishTime}`}
      </div>
    </div>
  );
};
const RobotPosition = () => {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ marginBottom: "30px", textAlign: "center" }}>
        🛠 Robot Tracker
      </h2>

      {robotsData.map((robot) => (
        <RobotRow key={robot.robot_no} robot={robot} />
      ))}
    </div>
  );
};

export default RobotPosition;

// const RobotRow = ({ robot }) => {
//   const [distance, setDistance] = useState(0);
//   const [atDS, setAtDS] = useState(false);
//   const [finishTime, setFinishTime] = useState("");

//   const [totalCovered, setTotalCovered] = useState(0); // NEW

//   useEffect(() => {
//     const oneWayDistance = robot.row_length;
//     const totalTripTime = (robot.finishTime - robot.startTime) / 1000; // in seconds

//     const update = () => {
//       const now = new Date();
//       const elapsedTime = (now - robot.startTime) / 1000; // in seconds

//       if (now >= robot.finishTime) {
//         setAtDS(true);
//         setDistance(0); // ✅ Robot visually at DS
//         setTotalCovered(oneWayDistance * 2); // ✅ Total path robot completed
//         return;
//       }

//       const clampedTime = Math.max(0, Math.min(elapsedTime, totalTripTime));
//       const progress = clampedTime / totalTripTime;

//       let currentDistance;
//       let covered;

//       if (progress <= 0.5) {
//         currentDistance = oneWayDistance * (progress * 2);
//         covered = currentDistance;
//       } else {
//         currentDistance = oneWayDistance * ((1 - progress) * 2);
//         covered = oneWayDistance + (oneWayDistance - currentDistance);
//       }

//       setDistance(Math.round(currentDistance));
//       setTotalCovered(Math.round(covered));
//     };

//     setFinishTime(
//       robot.finishTime.toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//       })
//     );

//     update();
//     const interval = setInterval(update, 100);
//     return () => clearInterval(interval);
//   }, [robot]);

//   const percent = Math.min(
//     100,
//     Math.max(0, (distance / robot.row_length) * 100)
//   );
//   const isRunning = !atDS;
//   const robotColor = atDS ? "#4CAF50" : isRunning ? "#FFA000" : "#0D47A1";

//   return (
//     <div style={{ marginBottom: "40px", padding: "5px 20px" }}>
//       <div
//         style={{
//           position: "relative",
//           height: "15px",
//           background: "#B3E5FC",
//           borderRadius: "4px",
//           marginBottom: "50px",
//         }}
//       >
//         <span
//           style={{
//             position: "absolute",
//             left: 10,
//             top: "-25px",
//             color: "#0277BD",
//             fontWeight: "bold",
//           }}
//         >
//           DS
//         </span>
//         <span
//           style={{
//             position: "absolute",
//             right: 0,
//             top: "-20px",
//             color: "#0277BD",
//             fontWeight: "bold",
//           }}
//         >
//           RS
//         </span>

//         <div
//           style={{
//             position: "absolute",
//             left: `calc(${percent}% - 23px)`,
//             top: "-12px",
//             width: "30px",
//             height: "60px",
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             transition: "left 0.5s ease-in-out",
//           }}
//         >
//           <div
//             style={{ width: "30px", height: "5px", background: robotColor }}
//           />
//           <div
//             style={{
//               width: "10px",
//               height: "40px",
//               background: robotColor,
//             }}
//           />
//           <div
//             style={{ width: "30px", height: "5px", background: robotColor }}
//           />
//           <div
//             style={{
//               fontSize: "12px",
//               color: robotColor,
//               marginTop: "4px",
//               fontWeight: "bold",
//             }}
//           >
//             {robot.robot_no}
//           </div>
//         </div>
//       </div>

//       <div
//         style={{
//           color: "#fff",
//           textAlign: "start",
//           fontSize: "13px",
//         }}
//       >
//         {atDS
//           ? `Robot No : ${robot.robot_no} | At Dock | Total distance covered: ${totalCovered}m`
//           : `Robot No : ${robot.robot_no} | Distance covered: ${totalCovered}m | Finish Time: ${finishTime}`}
//       </div>
//     </div>
//   );
// };
