import React, { useEffect, useState } from "react";
import socket from "../../components/Socket";
import RobotImg from "../../assets/images/robot.png";
import { CImage } from "@coreui/react";
// const socket = io("http://localhost:5000"); // ✅ change to your backend URL

const RobotTracker = () => {
  const [robot, setRobot] = useState(null);
  const [percent, setPercent] = useState(0);
  const [distance, setDistance] = useState(0);
  const [currentPoint, setCurrentPoint] = useState(0);

  useEffect(() => {
    socket.on("robotTracking", (data) => {
      console.log("Received robotTracking data:", data);

      setRobot(data);

      if (!data.track_details || data.track_details.length === 0) return;

      const latestTrack = data.track_details[data.track_details.length - 1];
      const rowLength = data.row_length || 1;
      const totalPoints =
        data.track_details[data.track_details.length - 1].next_point ||
        rowLength;

      const point = latestTrack.point;
      const positionMeters = (point / totalPoints) * rowLength;
      const progressPercent = (positionMeters / rowLength) * 100;

      setDistance(Math.round(positionMeters));
      setCurrentPoint(point);
      setPercent(progressPercent);
    });

    return () => {
      socket.off("robotPosition");
    };
  }, []);

  if (!robot) return <div>Waiting for live data...</div>;

  return (
    <>
      <div className="w-full p-4">
        <h2 className="text-lg font-bold mb-2">{robot.robot_no}</h2>

        {/* Track Line */}
        <div className="relative w-full h-4 bg-gray-200 rounded">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-400" />
          <div
            className="absolute top-0 h-6 w-6 bg-red-500 rounded-full shadow-md transition-all duration-500 ease-in-out"
            style={{ left: `${percent}%`, transform: "translateX(-50%)" }}
            title={`Point: ${currentPoint}, ${distance}m`}
          />
        </div>

        <div className="mt-3 text-sm">
          <p>📍 Current Point: {currentPoint}</p>
          <p>
            📏 Distance Covered: {distance} m / {robot.row_length} m
          </p>
        </div>
      </div>

      <div style={{ marginBottom: "10px", padding: "5px 20px" }}>
        <div
          style={{
            position: "relative",
            height: "50px",
            borderRadius: "4px",
            marginBottom: "35px",
            // width: `${robot.row_length * 5}px`,

            backgroundImage: `
          repeating-linear-gradient(
            to right,
            #0d47a1,
            #0d47a1 10px,
            #ffffff 10px,
            #ffffff 12px
          ),
          linear-gradient(
            to bottom,
            #0d47a1 0%,
            #0d47a1 48%,
            #79aaf4ff 48%,
            #659ef5ff 53%,
            #0d47a1 53%,
            #0d47a1 100%
          )
        `,
            backgroundBlendMode: "overlay",
          }}
        >
          <span
            style={{
              fontSize: "12px",

              left: 0,
              top: "-30px",
              position: "absolute",
              fontWeight: "bold",
            }}
          >
            {robot.robot_no}
          </span>
          <span
            style={{
              position: "absolute",
              left: 0,
              top: "-20px",
              color: "#0277BD",
              fontWeight: "bold",
            }}
          >
            DS{" "}
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
              height: "80px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              transition: "left 0.5s ease-in-out",
            }}
          >
            <CImage
              src={RobotImg}
              alt="Robot"
              width="100"
              height="78"
              style={{ objectFit: "contain", borderRadius: "5px" }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default RobotTracker;
