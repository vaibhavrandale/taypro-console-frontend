import React, { useRef } from "react";
import SolarPanelRow from "./SolarPannelRow";
// import RobotHeader from "./RobotHeader";

const Robot = ({ robot, handleRobotClick, deleteHandler, loadingDelete }) => {
  const scrollRefs = useRef({});

  return (
    <div className={`mx-2`} key={robot._id}>
      <div className="">
        {/* <RobotHeader
          robot={robot}
          handleRobotClick={handleRobotClick}
          deleteHandler={deleteHandler}
          loadingDelete={loadingDelete}
        /> */}

        <SolarPanelRow
          handleRobotClick={handleRobotClick}
          deleteHandler={deleteHandler}
          loadingDelete={loadingDelete}
          robot={robot}
          scrollRefs={scrollRefs}
        />
      </div>
    </div>
  );
};

export default Robot;
