import React, { useRef } from "react";
import SolarPanelRow from "./SolarPannelRow";
// import RobotHeader from "./RobotHeader";

const Robot = ({
  robot,
  handleRobotClick,
  deleteHandler,
  loadingDelete,
  scrollRefs: parentScrollRefs,
  maxRowLength,
}) => {
  const localScrollRefs = useRef({});
  const scrollRefs = parentScrollRefs || localScrollRefs;

  return (
    <div className={`mx-2`} key={robot._id}>
      <div className="">
        <SolarPanelRow
          handleRobotClick={handleRobotClick}
          deleteHandler={deleteHandler}
          loadingDelete={loadingDelete}
          robot={robot}
          scrollRefs={scrollRefs}
          maxRowLength={maxRowLength}
        />
      </div>
    </div>
  );
};

export default Robot;
