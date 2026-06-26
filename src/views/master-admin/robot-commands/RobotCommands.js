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
  CBadge,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilRouter, cilSend } from "@coreui/icons";
// import { useSelector } from "react-redux";

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

  // const authtoken = useSelector((state) => state.authtoken);
  // const userInfo = useSelector((state) => state.userInfo);
  const [site_id, setSiteId] = useState("");
  const [selectedRobots, setSelectedRobots] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchSites = async () => {
      dispatch({ type: "FETCH_SITES_REQUEST" });
      try {
        const res = await axios.get(`/api/v1/sites`, {
          // headers: { Authorization: `Bearer ${authtoken}` },
          withCredentials: true,
        });
        dispatch({ type: "FETCH_SITES_SUCCESS", payload: res.data.data });
        setSiteId(res.data.data[1].site_id);
      } catch (err) {
        dispatch({
          type: "FETCH_SITES_FAIL",
          payload: err.response?.data?.error || err.response?.data?.message,
        });
        toast.error(err.response?.data?.error || err.response?.data?.message);
      }
    };
    fetchSites();
  }, []);

  useEffect(() => {
    if (!site_id) return;
    const fetchRobots = async () => {
      dispatch({ type: "FETCH_ROBOTS_REQUEST" });
      try {
        const res = await axios.get(
          `/api/v1/robots/get-all-robots-sitewise/${site_id}`,
          {
            // headers: { Authorization: `Bearer ${authtoken}` }
            withCredentials: true,
          },
        );

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
  }, [site_id]);

  const handleCheckboxChange = (robot) => {
    setSelectedRobots((prev) =>
      prev.some((r) => r.deveui === robot.deveui)
        ? prev.filter((r) => r.deveui !== robot.deveui)
        : [...prev, robot],
    );
  };

  const COMMAND_CODES = {
    // START: "11",
    // STOP: "CC",
    // RETURN_TO_DOCK: "D1",
    START: "11",
    STOP: "14",
    RETURN_TO_DOCK: "15",
  };

  const sendMulticastDownlink = async (commandCode) => {
    if (selectedRobots.length === 0) {
      toast.error("Please select at least one robot.");
      return;
    }

    dispatch({ type: "SEND_DOWNLINK_REQUEST" });

    const deveuiList = selectedRobots.map((r) => r.deveui);
    const robotNoList = selectedRobots.map((r) => r.robot_no);
    let robotdownlink = {
      deveui: deveuiList,
      block: "Random Block",
      site_id: site_id,
      command: commandCode,
      robot_no: robotNoList.join(", "),
    };
    try {
      await axios.post(
        // "/api/v1/robots/send-downlink-in-bulk",
        "/api/v1/robots/send-mqtt-multicast-downlink",
        robotdownlink,
        {
          // headers: { Authorization: `Bearer ${authtoken}` }
          withCredentials: true,
        },
      );
      dispatch({ type: "SEND_DOWNLINK_SUCCESS" });
      const cmd =
        commandCode === COMMAND_CODES.START
          ? "START"
          : commandCode === COMMAND_CODES.STOP
            ? "STOP"
            : "RETURN TO DOCK";
      toast.success(
        `${cmd} Command sent successfully to robots: ` + robotNoList.join(", "),
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
    robot.robot_no.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSiteNameChange = (e) => {
    dispatch({ type: "SELECT_SITENAME_REQUEST" });

    const selectedSiteName = e.target.value;
    const selectedSite = sites.find(
      (site) => site.site_id.toString() === selectedSiteName,
    );

    if (selectedSite) {
      setSiteId(selectedSite.site_id);

      dispatch({ type: "SELECT_SITENAME_SUCCESS", payload: selectedSite });
    } else {
      dispatch({ type: "SELECT_SITENAME_FAIL" });
    }
  };

  return (
    <div className="p-2">
      <h4 className="text-center mb-4">Send Commands To Robots</h4>

      <CCardBody>
        {/* <CRow className="mb-3 justify-content-between align-items-center">
          <CCol md="6">
            <div className="mb-3">
              <label className="form-label">Site Id</label>
              {loadingSites ? (
                <LoadingSpinner />
              ) : (
                <CFormSelect
                  name="site_id"
                  value={site_id}
                  onChange={handleSiteNameChange}
                >
                  <option value="">Select Site Name</option>
                  {sites?.length > 0 &&
                    sites.map((item) => (
                      <option key={item.site_id} value={item.site_id}>
                        {item.site_id}
                      </option>
                    ))}
                </CFormSelect>
              )}
            </div>
          </CCol>

          <CCol md={4}>
            <CFormInput
              type="text"
              placeholder="Search by Robot No..."
              className="mb-3"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </CCol>
        </CRow> */}
        <CRow className="mb-3 justify-content-end align-items-center">
          <CCol md="3">
            <div className="mb-3 d-flex flex-column">
              <label className="form-label">Select Site</label>
              {loadingSites ? (
                <LoadingSpinner />
              ) : (
                <CFormSelect
                  name="site_id"
                  value={site_id}
                  onChange={handleSiteNameChange}
                >
                  <option value="">Select Site Name</option>
                  {sites?.length > 0 &&
                    sites.map((item) => (
                      <option key={item.site_id} value={item.site_id}>
                        {item.site_id}
                      </option>
                    ))}
                </CFormSelect>
              )}
            </div>
          </CCol>

          <CCol md={3}>
            <label className="form-label">Search</label>
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
              {LoadingDownlink ? (
                <LoadingSpinner />
              ) : (
                <>
                  {" "}
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
            </>
          )}
        </div>
        {sendDownLinkError && (
          <CBadge color="danger">{sendDownLinkError}</CBadge>
        )}
        {/* {selectedRobots.length > 0 && (
          <div className="mt-3">
            <h5>Send Command 🔽</h5>
            <div className="d-flex flex-wrap">
              {selectedRobots.map((robot, index) => (
                <p className="m-1 border p-1" key={index}>
                  <span className="me-1 text-danger"> {index + 1})</span>
                  <span className="text-success">
                    {robot.robot_no} - [{robot.block}]
                  </span>
                </p>
              ))}
            </div>
          </div>
        )} */}

        {selectedRobots.length > 0 && (
          <div className="mt-3">
            {/* Header */}
            <div className="d-flex align-items-center gap-2 mb-2">
              <div
                className="d-flex align-items-center justify-content-center rounded bg-primary bg-opacity-10 border border-primary border-opacity-25"
                style={{ width: 28, height: 28 }}
              >
                <CIcon icon={cilSend} className="text-primary" size="sm" />
              </div>
              <span className="fw-semibold text-white small">Send Command</span>
              <CBadge color="primary" shape="rounded-pill" className="fw-bold">
                {selectedRobots.length}
              </CBadge>
            </div>

            {/* Robot chips */}
            <div className="d-flex flex-wrap gap-2">
              {selectedRobots.map((robot, index) => (
                <div
                  key={index}
                  className="d-flex align-items-center gap-1 rounded border border-secondary border-opacity-25 bg-body-tertiary px-2 py-1"
                >
                  <span
                    className="text-body-secondary "
                    style={{ minWidth: 14 }}
                  >
                    {index + 1}
                  </span>
                  <div className="vr opacity-25 mx-1" />
                  <CIcon icon={cilRouter} className="text-success" size="sm" />
                  <span className="text-success small">{robot.robot_no}</span>
                  <CBadge color="warning" className="ms-1 fw-normal opacity-75">
                    {robot.block}
                  </CBadge>
                </div>
              ))}
            </div>
          </div>
        )}
        <CRow className="g-3 mt-3">
          {LoadingRobots ? (
            <CCol className="text-center py-5">
              <LoadingSpinner />
            </CCol>
          ) : robotsError || sitesError ? (
            <CBadge color="danger" className="">
              {robotsError || sitesError}
            </CBadge>
          ) : filteredRobots.length > 0 ? (
            filteredRobots.map((robot) => (
              <CCol md={2} sm={4} xs={3} key={robot.deveui}>
                <CCard
                  className={`h-100 ${
                    robot.lora_state === 1 ? `bg-success` : `bg-danger`
                  }`}
                >
                  <CCardBody className="d-flex align-items-center p-2">
                    <CFormCheck
                      checked={selectedRobots.some(
                        (r) => r.deveui === robot.deveui,
                      )}
                      onChange={() => handleCheckboxChange(robot)}
                      className="me-3"
                      style={{}}
                    />
                    <div className="flex-grow-1 text-center">
                      <div>{robot.robot_no}</div>
                    </div>
                  </CCardBody>
                </CCard>
              </CCol>
            ))
          ) : (
            <CCol className="text-center py-5">No robots found</CCol>
          )}
        </CRow>
      </CCardBody>
    </div>
  );
};

export default RobotCommands;
