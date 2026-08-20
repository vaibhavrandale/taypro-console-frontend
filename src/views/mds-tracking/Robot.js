import React from "react";
import { CImage } from "@coreui/react";
import RobotImg from "../../assets/images/robot.png";

// Static sprite — position is controlled by MdsDashboard (left px from track points).
// Do not auto-animate: rowLength was never passed, which produced translateX(NaNpx).
const Robot = () => {
  return (
    <div
      style={{
        position: "absolute",
        top: "-10px",
        left: "-21px",
        width: "20px",
        height: "80px",
        display: "flex",
      }}
    >
      <CImage
        src={RobotImg}
        alt="Robot"
        width="100"
        height="62"
        style={{ objectFit: "contain" }}
      />
    </div>
  );
};

export default Robot;
