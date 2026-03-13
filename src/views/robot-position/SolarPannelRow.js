import React from "react";
import { CImage } from "@coreui/react";
import RobotImg from "../../assets/images/robot.png";
import { getRobotPhase } from "./helpers";
import "./tracking.css";
const SolarPanelRow = ({ robot, handleRobotClick, scrollRefs }) => {
  const L = robot.row_length;

  // ✅ Calculate highest point from track_details (19-40) instead of last point
  let highestPoint = 0;
  if (robot.track_details && robot.track_details.length > 0) {
    const validPoints = robot.track_details
      .map((td) => td.point)
      .filter((p) => p >= 19 && p <= 40);
    if (validPoints.length > 0) {
      highestPoint = Math.max(...validPoints);
    } else {
      // Fallback to last point if no valid points found
      highestPoint =
        robot.track_details[robot.track_details.length - 1].point || 0;
    }
  }

  // // const distanceCovered = pt;
  const { phase, segmentPct } = getRobotPhase(
    highestPoint,
    L,
    robot.cleaning,
    robot.track_details,
    robot.createdAt, // ✅ Pass createdAt to check if document is from today
  );

  // ✅ Get current status text for display
  const getStatusText = () => {
    // ✅ Check if cleaning finished on a previous day
    const isFinishedYesterdayOrEarlier = () => {
      if (!robot.cleaning?.finish || !robot.cleaning?.finishAt) {
        return false;
      }

      try {
        const finishDate = new Date(robot.cleaning.finishAt);
        if (isNaN(finishDate.getTime())) {
          return false; // Invalid date
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const finishDateOnly = new Date(finishDate);
        finishDateOnly.setHours(0, 0, 0, 0);

        // If finish date is before today, it was finished yesterday or earlier
        return finishDateOnly.getTime() < today.getTime();
      } catch (e) {
        return false;
      }
    };

    // ✅ If cleaning finished yesterday or earlier, show "Not yet started"
    // (Don't check cleaning.start because it might still be true from yesterday's cycle)
    if (robot.cleaning?.finish === true && isFinishedYesterdayOrEarlier()) {
      return "Not yet started";
    }

    if (robot.cleaning?.finish === true && !isFinishedYesterdayOrEarlier()) {
      return "Cleaning Finished";
    } else if (robot.cleaning?.cleaning_cancelled === true) {
      return "Cleaning Cancelled";
    } else if (robot.cleaning?.battery_dead === true) {
      return "Battery Dead";
    } else if (robot.cleaning?.start === true) {
      // Cleaning has started, determine specific phase
      if (phase === "Forward Cleaning") {
        return "Forward Cleaning In Progress";
      } else if (phase === "Reverse Cleaning") {
        return "Return Cleaning In Progress";
      } else if (
        phase === "At Reverse Station" ||
        phase === "Ready for Reverse Cleaning"
      ) {
        return "At Reverse Station";
      } else if (highestPoint >= 20 && highestPoint <= 40) {
        // Has location points but phase might not be set yet
        if (highestPoint >= 20 && highestPoint <= 28) {
          return "Forward Cleaning In Progress";
        } else if (highestPoint >= 31 && highestPoint <= 39) {
          return "Return Cleaning In Progress";
        } else if (highestPoint === 40) {
          return "At Dock";
        }
      } else {
        // Cleaning started but no location points yet (or point < 20)
        return "Starting Cleaning Cycle";
      }
    } else {
      return "At Dock";
    }
    return "At Dock";
  };

  const statusText = getStatusText();

  // ✅ Get current battery percentage for display
  const getBatteryPercentage = () => {
    const cleaning = robot.cleaning || {};

    // Priority: after_cleaning > at_reverse_station > before_cleaning
    if (cleaning.battery_after_cleaning != null) {
      return cleaning.battery_after_cleaning;
    } else if (cleaning.battery_at_reverse_station != null) {
      return cleaning.battery_at_reverse_station;
    } else if (cleaning.battery_before_cleaning != null) {
      return cleaning.battery_before_cleaning;
    }
    return null;
  };

  const batteryPercentage = getBatteryPercentage();

  const iconOffsetPx = segmentPct * L * 14;
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
          width: `${L * 14}px`,
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
          {robot.robot_no} | {statusText}
          {batteryPercentage != null && ` | 🔋 ${batteryPercentage}%`}
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
