import React from "react";
import { CImage, CSpinner } from "@coreui/react";
import RobotImg from "../../assets/images/robot.png";

const Robot = ({ rowLength, duration = 3 }) => {
  // Calculate distance dynamically
  const distance = rowLength * 25;

  // Create dynamic keyframes
  const animationName = `moveForward${rowLength}`;
  const styleTag = `
    @keyframes ${animationName} {
      0% { transform: translateX(0); }
      100% { transform: translateX(${distance}px); }
    }
  `;

  return (
    <>
      {/* Inject dynamic keyframes */}
      <style>{styleTag}</style>

      <div
        style={{
          position: "absolute",
          top: "-10px",

          width: "20px",
          height: "80px",
          display: "flex",
          animation: `${animationName} ${duration}s linear forwards`,
        }}
      >
        {" "}
        {/* <CSpinner
          style={{
            position: "absolute",
            left: "30px",
            height: "7px",
            width: "7px",
          }}
          color="success"
          variant="grow"
        /> */}
        <CImage
          src={RobotImg}
          alt="Robot"
          width="100"
          height="62"
          style={{ objectFit: "contain" }}
        />
      </div>
    </>
  );
};

export default Robot;
