import axios from "axios";
import React, { useEffect, useReducer, useRef, useState } from "react";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";
import { CCol, CFormInput, CInputGroup, CRow, CTooltip } from "@coreui/react";
import "./robots.css";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import socket from "../../components/Socket";
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, robots: action.payload };
    case "FETCH_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case "ROBOT_STATUS_UPDATE":
      return {
        ...state,
        robots: state.robots.map((r) =>
          r.robot_no === action.payload.robot_no
            ? { ...r, ...action.payload }
            : r,
        ),
      };

    default:
      return state;
  }
};
const RobotStatus = () => {
  const [{ error, robots, loading }, dispatch] = useReducer(reducer, {
    robots: [],
    loading: false,
    error: "",
  });

  const userInfo = useSelector((state) => state.userInfo);
  const [searchTerm, setSearchTerm] = useState("");
  const socketRef = useRef(null);
  useEffect(() => {
    const fetchRobots = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const response = await axios.get(
          "/api/v1/robots/robots/all-sites",

          {
            withCredentials: true,
          },
        );
        dispatch({ type: "FETCH_SUCCESS", payload: response.data.data });
        dispatch({ type: "DELETE_RESET" }); // 👈 reset flag
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: error.response?.data?.error || error.response?.data?.message,
        });
        toast.error(
          error.response?.data?.error || error.response?.data?.message,
        );
      }
    };
    fetchRobots();
  }, []);
  useEffect(() => {
    socketRef.current = socket;

    socket.emit("join-all-robots"); // join the broadcast room

    socket.on("robot-status-update", (updatedRobot) => {
      // { robot_no, lora_state, last_uplink }
      dispatch({ type: "ROBOT_STATUS_UPDATE", payload: updatedRobot });
    });

    return () => {
      socket.emit("leave-all-robots");
      socket.off("robot-status-update");
    };
  }, []);
  let adminroute = "";

  if (userInfo?.role === "Master Admin") {
    adminroute = "master-admin";
  } else if (userInfo?.role === "Service Admin") {
    adminroute = "service-admin";
  } else if (userInfo?.role === "Project Admin") {
    adminroute = "project-admin";
  } else if (userInfo?.role === "Client Admin") {
    adminroute = "client-admin";
  } else if (userInfo?.role === "Site Incharge") {
    adminroute = "site-incharge";
  } else if (userInfo?.role === "Site Technician") {
    adminroute = "site-technician";
  } else if (userInfo?.role === "Client Site Technician") {
    adminroute = "client-site-technician";
  } else if (userInfo?.role === "Master User") {
    adminroute = "master-user";
  } else if (userInfo?.role === "Service User") {
    adminroute = "service-user";
  } else if (userInfo?.role === "Project User") {
    adminroute = "project-user";
  } else if (userInfo?.role === "Factory Admin") {
    adminroute = "factory-admin";
  }

  const filteredRobots = Array.isArray(robots)
    ? robots.filter((robot) => {
        const term = searchTerm.toLowerCase();

        return (
          (robot.robot_no || "").toLowerCase().includes(term) ||
          (robot.site_id || "").toLowerCase().includes(term) ||
          (robot.block || "").toLowerCase().includes(term)
        );
      })
    : [];

  const onlineRobots =
    robots &&
    robots.filter((item) => {
      return item.lora_state === 1;
    }).length;
  const offlineRobots =
    robots &&
    robots.filter((item) => {
      return item.lora_state === 0;
    }).length;

  return (
    <div>
      <CRow className="justify-content-end align-items-center">
        <CCol xs={12} md={2}>
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            error
          ) : (
            <div className="d-flex justify-content-between align-items-center">
              <span>online: {onlineRobots}</span>
              <span> offline: {offlineRobots}</span>
            </div>
          )}
        </CCol>
        <CCol xs={12} md={2}>
          <CInputGroup>
            <CFormInput
              type="text"
              placeholder="Search Robots..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </CInputGroup>
        </CCol>
      </CRow>
      <div className="robotBlock">
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          error
        ) : filteredRobots.length > 0 ? (
          filteredRobots.map((item, index) => (
            <Link
              key={index}
              className="robot"
              to={`/${adminroute}/site-management/block-management/${item.site_id}/${item.block}/${item.robot_no}`}
            >
              <CTooltip
                content={`${item.robot_no} - ${item.site_id} - ${item.block}`}
                placement="top"
                style={{}}
              >
                <span
                  className={`${item.lora_state === 1 ? "state-online" : "state-offline"}`}
                >
                  {item.robot_no.slice(-3)}
                </span>
              </CTooltip>
            </Link>
          ))
        ) : (
          "No Robots Found"
        )}
      </div>
    </div>
  );
};

export default RobotStatus;
