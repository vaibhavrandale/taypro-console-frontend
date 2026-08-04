import React from "react";
import { Cog, Check, X } from "lucide-react";
import RobotImg from "../../assets/images/robot.png";
import { getRobotPhase } from "./helpers";
import "./tracking.css";

const SolarPanelRow = ({
  robot,
  handleRobotClick,
  scrollRefs,
  maxRowLength,
}) => {
  const L = Number(robot.row_length) || 1;
  const maxL = Math.max(Number(maxRowLength) || L, L);
  // Relative to longest row in the list — longest fills viewport, shorter rows scale down
  const trackWidthPct = Math.max(40, Math.min(100, (L / maxL) * 100));

  let highestPoint = 0;
  if (robot.track_details && robot.track_details.length > 0) {
    const validPoints = robot.track_details
      .map((td) => td.point)
      .filter((p) => p >= 19 && p <= 40);
    if (validPoints.length > 0) {
      highestPoint = Math.max(...validPoints);
    } else {
      highestPoint =
        robot.track_details[robot.track_details.length - 1].point || 0;
    }
  }

  const { phase, segmentPct } = getRobotPhase(
    highestPoint,
    L,
    robot.cleaning,
    robot.track_details,
    robot.createdAt,
  );

  const getStatusText = () => {
    const isFinishedYesterdayOrEarlier = () => {
      if (!robot.cleaning?.finish || !robot.cleaning?.finishAt) {
        return false;
      }

      try {
        const finishDate = new Date(robot.cleaning.finishAt);
        if (isNaN(finishDate.getTime())) {
          return false;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const finishDateOnly = new Date(finishDate);
        finishDateOnly.setHours(0, 0, 0, 0);

        return finishDateOnly.getTime() < today.getTime();
      } catch (e) {
        return false;
      }
    };

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
        if (highestPoint >= 20 && highestPoint <= 28) {
          return "Forward Cleaning In Progress";
        } else if (highestPoint >= 31 && highestPoint <= 39) {
          return "Return Cleaning In Progress";
        } else if (highestPoint === 40) {
          return "At Dock";
        }
      } else {
        return "Starting Cleaning Cycle";
      }
    } else {
      return "At Dock";
    }
    return "At Dock";
  };

  const statusText = getStatusText();

  const getBatteryPercentage = () => {
    const cleaning = robot.cleaning || {};

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

  // segmentPct is always fraction from DS (0) → RS (1)
  const iconStyle = {
    left: `${segmentPct * 100}%`,
    right: "auto",
    transform: "translate(-50%, -50%)",
  };

  const cleaning = robot.cleaning || {};
  let className = "";
  let gearStatus = null; // progress | failed | finished
  let gearSpin = null; // cw | ccw

  if (
    cleaning.start &&
    !cleaning.finish &&
    !cleaning.cleaning_cancelled &&
    !cleaning.battery_dead
  ) {
    className = "cleaning-in-progress";
    gearStatus = "progress";
    const isReturn =
      phase === "Reverse Cleaning" ||
      phase === "At Reverse Station" ||
      phase === "Ready for Reverse Cleaning" ||
      (highestPoint >= 29 && highestPoint <= 39);
    gearSpin = isReturn ? "ccw" : "cw";
  } else if (cleaning.finish && statusText === "Cleaning Finished") {
    className = "cleaning-finished";
    gearStatus = "finished";
  } else if (cleaning.cleaning_cancelled) {
    className = "cleaning-cancelled";
    gearStatus = "failed";
  } else if (cleaning.battery_dead) {
    className = "battery-dead";
    gearStatus = "failed";
  } else if (!cleaning.start && !cleaning.finish) {
    className = "no-cleaning-today";
  } else if (cleaning.finish) {
    className = "cleaning-finished";
  } else {
    className = "unknown-status";
  }

  return (
    <div
      className="cursor-pointer"
      style={{
        paddingLeft: "28px",
        paddingRight: "28px",
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
      }}
      ref={(el) => {
        if (scrollRefs?.current) scrollRefs.current[robot._id] = el;
      }}
      onClick={() => handleRobotClick(robot)}
    >
      <div
        style={{
          position: "relative",
          height: "56px",
          width: `${trackWidthPct}%`,
          maxWidth: "100%",
          display: "flex",
          alignItems: "center",
          boxSizing: "border-box",
        }}
      >
        <span
          style={{
            position: "absolute",
            left: "-24px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#0277BD",
            fontWeight: "bold",
            fontSize: "12px",
            lineHeight: 1,
            zIndex: 2,
          }}
        >
          DS
        </span>
        <span
          style={{
            position: "absolute",
            right: "-24px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#0277BD",
            fontWeight: "bold",
            fontSize: "12px",
            lineHeight: 1,
            zIndex: 2,
          }}
        >
          RS
        </span>

        <div
          style={{
            position: "relative",
            height: "40px",
            width: "100%",
            borderRadius: "4px",
            backgroundImage: `
              repeating-linear-gradient(to right, #0d47a1, #0d47a1 10px, #fff 10px, #fff 12px),
              linear-gradient(to bottom, #0d47a1 0%, #0d47a1 48%, #79aaf4ff 48%, #659ef5ff 53%, #0d47a1 53%, #0d47a1 100%)
            `,
            backgroundBlendMode: "overlay",
          }}
          className={className}
        >
          <span
            style={{
              position: "absolute",
              top: "50%",
              left: "8px",
              transform: "translateY(-50%)",
              zIndex: 3,
              fontSize: "12px",
              fontWeight: 600,
              maxWidth: "calc(100% - 56px)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              backgroundColor: robot.is_delete ? "red" : "white",
              color: robot.is_delete ? "white" : "black",
              padding: "2px 6px",
              borderRadius: "5px",
              pointerEvents: "none",
              lineHeight: 1.3,
            }}
          >
            {robot?.row_no !== 0 && <>Row: {robot.row_no} | </>}
            {robot.robot_no} | {statusText}
            {batteryPercentage != null && ` | 🔋 ${batteryPercentage}%`}
            {` | ${L}m`}
          </span>

          {/* Robot: tall top-down asset, vertically centered on the track */}
          <div
            className="robot-marker"
            style={{
              position: "absolute",
              top: "50%",
              width: "48px",
              height: "72px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 5,
              pointerEvents: "none",
              transition: "left 0.35s linear, right 0.35s linear",
              ...iconStyle,
            }}
          >
            <img
              src={RobotImg}
              alt="Robot"
              width={48}
              height={60}
              style={{
                objectFit: "contain",
                display: "block",
              }}
            />

            {gearStatus && (
              <span
                className={`robot-gear robot-gear--${gearStatus}`}
                title={
                  gearStatus === "progress"
                    ? "Cleaning in progress"
                    : gearStatus === "failed"
                      ? "Cleaning failed"
                      : "Cleaning finished"
                }
              >
                <Cog
                  size={14}
                  strokeWidth={2.4}
                  className={
                    gearSpin === "cw"
                      ? "robot-gear__spin-cw"
                      : gearSpin === "ccw"
                        ? "robot-gear__spin-ccw"
                        : undefined
                  }
                />
                {gearStatus === "failed" && (
                  <span className="robot-gear__badge" aria-hidden>
                    <X size={7} strokeWidth={3} />
                  </span>
                )}
                {gearStatus === "finished" && (
                  <span className="robot-gear__badge" aria-hidden>
                    <Check size={7} strokeWidth={3} />
                  </span>
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolarPanelRow;
