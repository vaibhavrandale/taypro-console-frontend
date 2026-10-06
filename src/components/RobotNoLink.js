import React from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getRobotOperatingPath } from "../utils/adminRoute";
import "./RobotNoLink.css";

const RobotNoLink = ({
  robot,
  robot_no,
  site_id,
  block,
  className = "",
  children,
}) => {
  const params = useParams();
  const userInfo = useSelector((state) => state.userInfo);
  const no = robot_no ?? robot?.robot_no;
  const site = site_id ?? robot?.site_id ?? params.site_id;
  const blk = block ?? robot?.block ?? robot?.block_name ?? params.block;

  if (!no) return null;

  const to = getRobotOperatingPath(userInfo?.role, site, blk, no);
  const classNames = ["robot-no-link", className].filter(Boolean).join(" ");

  if (!to) {
    return <span className={classNames}>{children ?? no}</span>;
  }

  return (
    <Link to={to} className={classNames} onClick={(e) => e.stopPropagation()}>
      {children ?? no}
    </Link>
  );
};

export default RobotNoLink;
