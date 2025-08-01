import toast from "react-hot-toast";
import LoadingSpinner from "../../../components/LoadingSpinner";
import React, { useEffect, useReducer, useState } from "react";
import axios from "axios";
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CFormSelect,
  CFormCheck,
  CButton,
  CFormInput,
} from "@coreui/react";
import { useSelector } from "react-redux";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_ROBOTS_REQUEST":
      return { ...state, LoadingRobots: true, robotsError: "" };
    case "FETCH_ROBOTS_SUCCESS":
      return {
        ...state,
        LoadingRobots: false,
        shiftrobots: action.payload,
      };
    case "FETCH_ROBOTS_FAIL":
      return { ...state, LoadingRobots: false, robotsError: action.payload };
    case "FETCH_SITES_REQUEST":
      return { ...state, loadingSites: true, sitesError: "" };
    case "FETCH_SITES_SUCCESS":
      return { ...state, loadingSites: false, sites: action.payload };
    case "FETCH_SITES_FAIL":
      return { ...state, loadingSites: false, sitesError: action.payload };
    case "SEND_DOWNLINK_REQUEST":
      return { ...state, LoadingDownlink: true, sendDownLinkError: "" };
    case "SEND_DOWNLINK_SUCCESS":
      return { ...state, LoadingDownlink: false };
    case "SEND_DOWNLINK_FAIL":
      return { ...state, LoadingDownlink: false, error: action.payload };
    default:
      return state;
  }
};

const RobotCommands = () => {
  const [
    {
      LoadingRobots,
      shiftrobots,
      sites,
      LoadingDownlink,
      sitesError,
      robotsError,
      loadingSites,
      sendDownLinkError,
    },
    dispatch,
  ] = useReducer(reducer, {
    shiftrobots: [],
    loadingSites: false,
    sites: [],
    LoadingRobots: false,
    LoadingDownlink: false,
    robotsError: "",
    sitesError: "",
    sendDownLinkError: "",
  });

  const authtoken = useSelector((state) => state.authtoken);
  const [site_id, setSiteId] = useState("");
  const [selectedRobots, setSelectedRobots] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchSites = async () => {
      dispatch({ type: "FETCH_SITES_REQUEST" });
      try {
        const res = await axios.get(`/api/v1/sites`, {
          headers: { Authorization: `Bearer ${authtoken}` },
        });
        dispatch({ type: "FETCH_SITES_SUCCESS", payload: res.data.data });
      } catch (err) {
        dispatch({
          type: "FETCH_SITES_FAIL",
          payload: err.response?.data?.error || err.response?.data?.message,
        });
        toast.error(err.response?.data?.error || err.response?.data?.message);
      }
    };
    fetchSites();
  }, [authtoken]);

  useEffect(() => {
    if (!site_id) return;
    const fetchRobots = async () => {
      dispatch({ type: "FETCH_ROBOTS_REQUEST" });
      try {
        const res = await axios.get(
          `/api/v1/robots/get-all-robots-sitewise/${site_id}`,
          { headers: { Authorization: `Bearer ${authtoken}` } }
        );
        console.log("Fetched robots:", res);
        dispatch({ type: "FETCH_ROBOTS_SUCCESS", payload: res.data.data });
      } catch (err) {
        dispatch({
          type: "FETCH_ROBOTS_FAIL",
          payload: err.response?.data?.message || err.response?.data?.error,
        });
        toast.error(err.response?.data?.message || err.response?.data?.error);
      }
    };
    fetchRobots();
  }, [site_id, authtoken]);

  const handleCheckboxChange = (robot) => {
    setSelectedRobots((prev) =>
      prev.some((r) => r.deveui === robot.deveui)
        ? prev.filter((r) => r.deveui !== robot.deveui)
        : [...prev, robot]
    );
  };

  const COMMAND_CODES = {
    START: "C1",
    STOP: "CC",
    RETURN_TO_DOCK: "D1",
  };

  const sendMulticastDownlink = async (commandCode) => {
    if (selectedRobots.length === 0) {
      toast.error("Please select at least one robot.");
      return;
    }

    dispatch({ type: "SEND_DOWNLINK_REQUEST" });

    const deveuiList = selectedRobots.map((r) => r.deveui);
    const robotNoList = selectedRobots.map((r) => r.robot_no);

    try {
      await axios.post(
        "/api/v1/robots/send-downlink-in-bulk",

        { deveui: deveuiList, command: commandCode },
        { headers: { Authorization: `Bearer ${authtoken}` } }
      );
      dispatch({ type: "SEND_DOWNLINK_SUCCESS" });
      const cmd =
        commandCode === COMMAND_CODES.START
          ? "START"
          : commandCode === COMMAND_CODES.STOP
          ? "STOP"
          : "RETURN TO DOCK";
      toast.success(
        `${cmd} Command sent successfully to robots: ` + robotNoList.join(", ")
      );
      setSelectedRobots([]);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Command failed";
      dispatch({ type: "SEND_DOWNLINK_FAIL", payload: msg });
      toast.error(msg);
    }
  };

  const filteredRobots = shiftrobots.filter((robot) =>
    robot.robot_no.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-2">
      <h4 className="text-center mb-4">Send Commands To Robots</h4>
      <CCardBody>
        <CRow className="mb-3 justify-content-between align-items-center">
          <CCol md={4}>{loadingSites ? <LoadingSpinner /> : sitesError}</CCol>
          <CCol md={4}>
            <CFormInput
              type="text"
              placeholder="Search by Robot No..."
              className="mb-3"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </CCol>
        </CRow>

        <div className="d-flex justify-content-end mb-3 mt-4">
          {selectedRobots.length > 0 && (
            <>
              <CButton
                className="btn btn-sm btn-secondary m-1"
                disabled={LoadingDownlink}
                onClick={() => sendMulticastDownlink(COMMAND_CODES.START)}
              >
                START
              </CButton>
              <CButton
                className="btn btn-sm btn-secondary m-1"
                disabled={LoadingDownlink}
                onClick={() => sendMulticastDownlink(COMMAND_CODES.STOP)}
              >
                STOP
              </CButton>
              <CButton
                className="btn btn-sm btn-secondary m-1"
                disabled={LoadingDownlink}
                onClick={() =>
                  sendMulticastDownlink(COMMAND_CODES.RETURN_TO_DOCK)
                }
              >
                RETURN TO DOCK
              </CButton>
            </>
          )}
        </div>

        {selectedRobots.length > 0 && (
          <div className="mt-3">
            <h5>Send Command 🔽</h5>
            {selectedRobots.map((robot, index) => (
              <p key={index}>
                {index + 1} Robot No:{" "}
                <span className="text-primary">
                  {robot.robot_no} - [{robot.block}]
                </span>
              </p>
            ))}
          </div>
        )}

        <CRow className="g-3 mt-3">
          {LoadingRobots ? (
            <CCol className="text-center py-5">
              <LoadingSpinner />
            </CCol>
          ) : robotsError ? (
            <CCol className="text-center text-danger py-5">{robotsError}</CCol>
          ) : filteredRobots.length === 0 ? (
            <CCol className="text-center py-5">No robots found</CCol>
          ) : (
            filteredRobots.map((robot) => (
              <CCol md={3} sm={4} xs={6} key={robot.deveui}>
                <CCard className="h-100">
                  <CCardBody className="d-flex align-items-center p-3">
                    <CFormCheck
                      checked={selectedRobots.some(
                        (r) => r.deveui === robot.deveui
                      )}
                      onChange={() => handleCheckboxChange(robot)}
                      className="me-3"
                      style={{ transform: "scale(1.5)" }}
                    />
                    <div className="flex-grow-1 text-center">
                      <div>{robot.robot_no}</div>
                    </div>
                  </CCardBody>
                </CCard>
              </CCol>
            ))
          )}
        </CRow>
      </CCardBody>
    </div>
  );
};

export default RobotCommands;
