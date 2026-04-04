import React, { useEffect, useReducer } from "react";
import {
  CTable,
  CTableBody,
  CTableRow,
  CTableDataCell,
  CBadge,
} from "@coreui/react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import LoadingSpinner from "../../../components/LoadingSpinner";
import LastActivity from "../../../components/LastActivity";
import { format } from "date-fns";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_ROBOT_REQUEST":
      return { ...state, loadingRobot: true, robotError: "" };
    case "FETCH_ROBOT_SUCCESS":
      return { ...state, loadingRobot: false, robot: action.payload.data };
    case "FETCH_ROBOT_FAIL":
      return { ...state, loadingRobot: false, robotError: action.payload };
    default:
      return state;
  }
};

const ViewRobot = () => {
  const { id } = useParams();
  const [{ robot, loadingRobot }, dispatch] = useReducer(reducer, {
    robot: {},
    loadingRobot: false,
    robotError: "",
  });

  const authtoken = useSelector((state) => state.authtoken);

  const userInfo = useSelector((state) => state.userInfo);
  let adminroute = "";

  if (userInfo.role === "Master Admin") {
    adminroute = "master-admin";
  } else if (userInfo.role === "Service Admin") {
    adminroute = "service-admin";
  } else if (userInfo.role === "Project Admin") {
    adminroute = "project-admin";
  } else if (userInfo?.role === "Master User") {
    adminroute = "master-user";
  } else if (userInfo?.role === "Service User") {
    adminroute = "service-user";
  } else if (userInfo?.role === "Project User") {
    adminroute = "project-user";
  }
  useEffect(() => {
    const fetchRobot = async () => {
      dispatch({ type: "FETCH_ROBOT_REQUEST" });
      try {
        const data = await axios.get(`/api/v1/robots/get-one/${id}`, {
          headers: { Authorization: `Bearer ${authtoken}` },
        });
        dispatch({ type: "FETCH_ROBOT_SUCCESS", payload: data.data });
      } catch (error) {
        dispatch({
          type: "FETCH_ROBOT_FAIL",
          payload: error.response?.data?.error || "Failed to fetch robot",
        });
        toast.error(
          error.response?.data?.error || error.response?.data?.message,
        );
      }
    };
    fetchRobot();
  }, [authtoken, id]);

  const formatValue = (key, value) => {
    if (typeof value === "boolean") {
      return (
        <CBadge color={value ? "success" : "danger"} shape="rounded-pill">
          {value ? "Yes" : "No"}
        </CBadge>
      );
    }

    if (value === null || value === undefined) return <i>Not Available</i>;

    if (
      key.includes("date") ||
      key.includes("createdAt") ||
      key.includes("updatedAt")
    ) {
      try {
        return format(new Date(value), "dd MMM yyyy, hh:mm a");
      } catch {
        return value;
      }
    }

    return <span className="fw-medium">{String(value)}</span>;
  };

  const sections = [
    {
      title: "Basic Details",
      fields: [
        "robot_no",
        "site_robot_sr_no",
        "block",
        "robot_type",
        "company",
        "deveui",
        "site_id",
        "manufactured_date",
        "version",
      ],
    },
    {
      title: "Motor & Timer Config",
      fields: [
        "wheel_motor_speed",
        "brush_motor_speed",
        "timer1",
        "timer1_date",
        "timer2",
        "timer2_date",
        "timer3",
        "timer3_date",
      ],
    },
    {
      title: "Status & Technical Info",
      fields: [
        "lora_state",
        "auto_clean",
        "last_status",
        "battery_voltage",
        "battery_status",
        "temperature",
        "dock",
        "rssi",
        "snr",
        "last_gateway",
        "last_uplink",
        "rescheduled_cycle",
        "soiling_loss",
        "last_command",
        "breakdown_status",
        "cleaning_flag",
      ],
    },
    {
      title: "Flags & Settings",
      fields: [
        "activate",
        "weather_lock_1",
        "weather_lock_2",
        "weather_lock_state",
        "test_mode",
        "is_current_limit",
        "manual_mode",
        "actuator",
        "tracker",
        "stop_command",
      ],
    },
    {
      title: "Debug / Maintenance",
      fields: [
        "update_debug_log",
        "stuck_count",
        "certificate_no",
        "row_length",
        "row_number",
      ],
    },
  ];

  return loadingRobot ? (
    <LoadingSpinner />
  ) : (
    <>
      {userInfo?.role === "Master Admin" && (
        <div
          className="d-flex justify-content-end gap-2 mx-auto mb-3"
          style={{ maxWidth: "900px" }}
        >
          {robot.robot_type !== "Semi-Automatic" && (
            <Link
              to={`/${adminroute}/site-management/block-management/${
                robot.site_id
              }/${encodeURIComponent(robot.block)}/${robot.robot_no}`}
              className="btn btn-outline-primary btn-sm"
            >
              Robot Operation
            </Link>
          )}
          <Link
            to={`/${adminroute}/robots/update/${robot._id}`}
            className="btn btn-outline-warning btn-sm"
          >
            Update Robot
          </Link>
        </div>
      )}

      {sections.map((section) => (
        <div
          key={section.title}
          className="mb-4 mx-auto"
          style={{ maxWidth: "900px" }}
        >
          <div className="d-flex justify-content-center mb-2">
            <h6
              className="bg-light px-3 py-2 text-dark fw-bold border rounded text-center"
              style={{ maxWidth: "300px", width: "100%" }}
            >
              {section.title}
            </h6>
          </div>

          <CTable
            bordered
            responsive
            hover
            className="mb-3"
            style={{ fontSize: "0.9rem" }}
          >
            <CTableBody>
              {section.fields.map((field) => (
                <CTableRow key={field}>
                  <CTableDataCell
                    className="fw-semibold text-uppercase"
                    style={{
                      color: "white",
                      backgroundColor: "#343a40",
                      width: "35%",
                    }}
                  >
                    {field
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (char) => char.toUpperCase())}
                  </CTableDataCell>
                  <CTableDataCell>
                    {formatValue(field, robot[field])}
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </div>
      ))}
      <LastActivity lastactivity={robot.last_activity} />
    </>
  );
};

export default ViewRobot;
