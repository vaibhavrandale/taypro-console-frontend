import React from "react";
import { CBadge, CButton } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilTrash } from "@coreui/icons";
import { Eye } from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";
import { getRobotPhase } from "./helpers";

const RobotHeader = ({
  robot,
  handleRobotClick,
  deleteHandler,
  loadingDelete,
}) => {
  const lastreeivedPointInTracking =
    robot.track_details?.slice(-1)[0]?.point || 0;
  let L = robot.row_length;

  // const distanceCovered = pt;
  const { phase, badgeColor } = getRobotPhase(
    lastreeivedPointInTracking,
    L,
    robot.cleaning,
    robot.track_details
  );
  return (
    <div className=" d-flex justify-content-between text-sm">
      <span style={{ fontSize: "13px" }}>
        <CBadge
          color={badgeColor}
          className="ms-2 px-2 "
          style={{ fontSize: "14px" }}
        >
          {phase}
        </CBadge>
      </span>

      <div className="d-flex justify-content-end align-items-center">
        <CBadge color="success" style={{ fontSize: "12px" }}>
          📍 Current Point: {lastreeivedPointInTracking}
        </CBadge>
        <CButton
          onClick={() => handleRobotClick(robot)}
          size="sm"
          color="danger"
          className="ms-2"
        >
          <Eye size={18} />
        </CButton>
        <CButton
          onClick={(e) => deleteHandler(e, robot._id)}
          size="sm"
          color="secondary"
          className="ms-2"
        >
          {loadingDelete ? (
            <LoadingSpinner />
          ) : (
            <CIcon icon={cilTrash} color="danger" />
          )}
        </CButton>
      </div>
    </div>
  );
};

export default RobotHeader;
