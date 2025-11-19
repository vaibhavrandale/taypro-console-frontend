import React from "react";
import { CImage } from "@coreui/react";
import RobotImg from "../../assets/images/robot.png";
import { getRobotPhase } from "./helpers";
import "./tracking.css";
const SolarPanelRow = ({ robot, handleRobotClick, scrollRefs }) => {
  const L = robot.row_length;
  const lastPoint = robot.track_details?.length
    ? robot.track_details[robot.track_details.length - 1].point
    : 0;

  // // const distanceCovered = pt;
  const { phase, segmentPct } = getRobotPhase(
    lastPoint,
    L,
    robot.cleaning,
    robot.track_details
  );

  const iconOffsetPx = segmentPct * L * 25;
  const iconStyle =
    phase === "Reverse Cleaning"
      ? { right: `calc(${iconOffsetPx}px - 12px)`, left: "auto" }
      : { left: `calc(${iconOffsetPx}px - 12px)`, right: "auto" };
  let className = "";
  if (
    robot.cleaning.start &&
    !robot.cleaning.finish &&
    !robot.cleaning.cleaning_cancelled &&
    !robot.cleaning.battery_dead
  ) {
    className = "cleaning-in-progress";
  } else if (robot.cleaning.finish) {
    className = "cleaning-finished";
  } else if (robot.cleaning.cleaning_cancelled) {
    className = "cleaning-cancelled";
  } else if (robot.cleaning.battery_dead) {
    className = "battery-dead";
  } else if (!robot.cleaning.start && !robot.cleaning.finish) {
    className = "no-cleaning-today";
  } else {
    className = "unknown-status";
  }

  return (
    <div
      className=" cursor-pointer  "
      style={{
        paddingLeft: "25px",
        paddingRight: "25px",
        height: "50px",
      }}
      ref={(el) => (scrollRefs.current[robot._id] = el)}
      onClick={() => handleRobotClick(robot)}
    >
      <div
        style={{
          position: "relative",
          // top: "20px",
          height: "40px",
          borderRadius: "4px",
          width: `${L * 25}px`,
          backgroundImage: `
            repeating-linear-gradient(to right, #0d47a1, #0d47a1 10px, #fff 10px, #fff 12px),
            linear-gradient(to bottom, #0d47a1 0%, #0d47a1 48%, #79aaf4ff 48%, #659ef5ff 53%, #0d47a1 53%, #0d47a1 100%)
          `,
          backgroundBlendMode: "overlay",
        }}
        className={`${className}`}
      >
        <span
          style={{
            position: "absolute",
            left: "-26px",
            top: "-6px",
            color: "#0277BD",
            fontWeight: "bold",
          }}
        >
          DS
        </span>
        <span
          style={{
            position: "absolute",
            right: "-23px",
            top: "-6px",
            color: "#0277BD",
            fontWeight: "bold",
          }}
        >
          RS
        </span>

        {/* {[...Array(L + 1)].map((_, i) => (
          <React.Fragment key={i}>
            <div
              style={{
                position: "absolute",
                top: "40px",
                left: `${i * 25}px`,
                width: "1px",
                height: "8px",
                backgroundColor: "#0277BD",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "48px",
                left: `${i * 25}px`,
                transform: "translateX(-50%)",
                fontSize: "9px",
                color: "#0277BD",
              }}
            >
              {i}
            </div>
          </React.Fragment>
        ))} */}
        <span
          style={{
            position: "relative",
            top: "-2px",
            left: "5px",
            fontSize: "13px",
            width: "400px",
            backgroundColor: `${robot.is_delete ? `red` : `white`}`,
            color: `${robot.is_delete ? `white` : `black`}`,
            padding: "2px",
            borderRadius: "5px",
            fontWeight: "600",
          }}
        >
          {" "}
          {robot?.row_no !== 0 && <>Row: {robot.row_no} |</>}
          {robot.robot_no}
        </span>
        <div
          style={{
            position: "absolute",
            top: "-12px",
            width: "20px",
            height: "80px",
            display: "flex",

            alignItems: "start",
            justifyContent: "center",
            ...iconStyle,
          }}
        >
          <CImage
            src={RobotImg}
            alt="Robot"
            width="100"
            height="62"
            style={{ objectFit: "contain", borderRadius: "5px" }}
          />
          {/* <CSpinner color="success" variant="grow" /> */}
        </div>
      </div>
    </div>
  );
};

export default SolarPanelRow;
