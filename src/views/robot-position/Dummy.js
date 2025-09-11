import React, { useState, useEffect } from "react";

const robotsData = [
  { name: "Robot A", distance: 0, direction: "forward" },
  { name: "Robot B", distance: 0, direction: "forward" },
  { name: "Robot C", distance: 0, direction: "forward" },
];

export default function Dummy() {
  const [robots, setRobots] = useState(robotsData);
  const [selectedRobot, setSelectedRobot] = useState("Robot A");

  const speed = 5; // meters per tick
  const maxDistance = 500; // track length

  useEffect(() => {
    if (!selectedRobot) return;

    const interval = setInterval(() => {
      setRobots((prev) =>
        prev.map((robot) => {
          if (robot.name !== selectedRobot) return robot;

          let newDistance = robot.distance;
          let newDirection = robot.direction;

          if (robot.direction === "forward") {
            newDistance = robot.distance + speed;
            if (newDistance >= maxDistance) {
              newDistance = maxDistance;
              newDirection = "backward"; // change direction
            }
          } else {
            newDistance = robot.distance - speed;
            if (newDistance <= 0) {
              newDistance = 0;
              newDirection = "forward"; // change direction
            }
          }

          return { ...robot, distance: newDistance, direction: newDirection };
        })
      );
    }, 100);

    return () => clearInterval(interval);
  }, [selectedRobot]);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Robot Line Drive (Back & Forth)</h2>

      <div style={{ marginBottom: "20px" }}>
        <label>Select Robot: </label>
        <select
          value={selectedRobot}
          onChange={(e) => setSelectedRobot(e.target.value)}
        >
          {robots.map((robot) => (
            <option key={robot.name} value={robot.name}>
              {robot.name}
            </option>
          ))}
        </select>
      </div>

      <div
        style={{
          position: "relative",
          width: "590px", // track
          height: "120px",
          border: "2px solid #ccc",
          marginTop: "20px",
          overflow: "hidden",
        }}
      >
        {robots.map((robot, index) => (
          <div
            key={robot.name}
            style={{
              position: "absolute",
              left: `${robot.distance}px`,
              top: `${index * 35}px`,
              transition: "left 0.1s linear",
              padding: "5px 10px",
              backgroundColor:
                selectedRobot === robot.name ? "lightgreen" : "lightblue",
              borderRadius: "5px",
              fontWeight: "bold",
            }}
          >
            {robot.name} ({robot.distance} m)
          </div>
        ))}
      </div>
    </div>
  );
}
