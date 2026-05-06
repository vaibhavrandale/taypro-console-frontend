import React, { useEffect, useReducer, useState } from "react";
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CDropdownMenu,
  CDropdown,
  CDropdownToggle,
  CInputGroup,
  CFormInput,
  CTooltip,
  CBadge,
  CFormCheck,
} from "@coreui/react";
import { FaArrowUp } from "react-icons/fa";
import { FaCircleInfo } from "react-icons/fa6"; // Correct import
import { Link, useParams } from "react-router-dom";
import "./management.css";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { formatDistanceToNow } from "date-fns";
import PaginateInput from "../../../components/PaginateInput";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };

    case "FETCH_SUCCESS":
      return {
        ...state,
        downlinks: action.payload.data,
        totalPages: action.payload.totalPages, // Use API-provided totalPages
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
        loading: false,
      };

    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true, successDelete: false };

    case "DELETE_SUCCESS":
      return { ...state, loadingDelete: false, successDelete: true };

    case "DELETE_FAIL":
      return { ...state, loadingDelete: false, successDelete: false };

    case "DELETE_RESET":
      return { ...state, successDelete: false };

    case "FETCH_ROBOTS_REQUEST":
      return { ...state, loadingRobots: true, error: "" };

    case "FETCH_ROBOTS_SUCCESS":
      return { ...state, loadingRobots: false, robots: action.payload };

    case "FETCH_ROBOTS_FAIL":
      return { ...state, loadingRobots: false, error: action.payload };

    case "FETCH_ROBOT_REQUEST":
      return { ...state, loadingRobot: true, error: "" };

    case "FETCH_ROBOT_SUCCESS":
      return { ...state, loadingRobot: false, robot: action.payload };

    case "FETCH_ROBOT_FAIL":
      return { ...state, loadingRobot: false, error: action.payload };

    case "SEND_DOWNLINK_REQUEST":
      return { ...state, sendingCommandloading: true, error: "" };

    case "SEND_DOWNLINK_SUCCESS":
      return { ...state, sendingCommandloading: false };

    case "SEND_DOWNLINK_FAIL":
      return { ...state, sendingCommandloading: false, error: action.payload };

    default:
      return state;
  }
};

const RobotOperating = () => {
  const [
    {
      loading,
      loadingRobot,
      error,
      robot,
      downlinks,
      successDelete,
      loadingRobots,
      robots,
      totalPages,
      hasNextPage,
      hasPrevPage,
      sendingCommandloading,
    },
    dispatch,
  ] = useReducer(reducer, {
    downlinks: [],
    robots: [],
    robot: {},
    loading: true,
    error: "",
    loadingRobots: true,
    sendingCommandloading: false,
    loadingRobot: false,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const { site_id, block, robot_no } = useParams();
  const [modalVisible, setModalVisible] = useState(false);
  // const [siteRobots, setSiteRobots] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [text, setText] = useState("");
  const [base64Text, setBase64Text] = useState("");

  // const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);

  const [pageInput, setPageInput] = useState("");
  const [wheelCurrentValue, setWheelCurrentValue] = useState("");
  const [brushCurrentValue, setBrushCurrentValue] = useState("");
  const [wheelSpeedValue, setWheelSpeedValue] = useState("");
  const [brushSpeedValue, setBrushSpeedValue] = useState("");

  let start = "11";
  let partialStart = "12";
  let stop = "14";
  let returntodock = "15";
  let removecurrentLimit = "HCD";
  let setWheelPwm100 = "69";
  let setWheelPwm200 = "6A";
  let setWheelPwm250 = "6B";
  let setBrushPwm100 = "66";
  let setBrushPwm200 = "67";
  let setBrushPwm250 = "68";
  let setWheelCurrent = "GWC";
  let setBrushCurrent = "GBC";
  let batteryVoltage = "63";
  let temp = "TP";
  let cleanRight = "C3";
  let cleanLeft = "C2";

  let moveLeft = "C4";
  let moveRight = "C5";
  // let returnToDock = "D1";
  // let cleaningStart = "C1";
  let weatherLockEnable = "WE";
  let weatherLockDisable = "WD";
  let testModeOn = "1A";
  let testModeOff = "1B";
  let setDockAtLeft = "65"; //D@
  let setDockAtRight = "64";

  let setWheelSpeed = "RWS";
  let setBrushSpeed = "RBS";
  let intelligentStart = "13";
  // let getPwmWheel = "PW";
  // let getPwmBrush = "PB";
  // let getAntiStuckBrushSpeed = "SP"; // PA180
  // let getBrushCurrent = "SB"; // CB
  // let getWheelCurrent = "SW"; // CW
  // let getEepromWheelCurrent = "EW";
  // let getEepromBrushCurrent = "EB";

  let resetBoard = "RE";
  // let atDock = "AD";
  let CheckDock = "ZD";
  let CheckSensorState = "CD";
  let checkManualMode = "AU";
  let checkActuatorMode = "LE";
  let checkBrushCurrent = "EB";
  let checkWheelCurrent = "EW";
  let checkWheelSpeed = "PW";
  let checkBrushSpeed = "PB";
  let checkTracker = "KE";

  let setManualEnable = "62";
  let setManualDisable = "61";

  let setActuatorEnable = "ILE";
  let setActuatorDisable = "ILD";

  let setTrackerEnable = "KTE";
  let setTrackerDisable = "KTD";

  let newCleaningStart = "01";

  const [loadingRow, setLoadingRow] = useState(null); // Track the row index
  const [commandButton, setCommandButton] = useState(null); // Track the row index

  const [customDownlink, setCustomDownlink] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sent_custom_to_all, setSentCustomToAll] = useState(false);

  useEffect(() => {
    const getRobots = async () => {
      try {
        dispatch({ type: "FETCH_ROBOTS_REQUEST" });
        const response = await axios.get(
          `/api/v1/robots/get-robotsno-by-site-and-block/${site_id}/${block}`,
          {
            // headers: { Authorization: `Bearer ${authtoken}` },
            withCredentials: true,
          },
        );
        // robots/site/taypro_office/Block-1/
        const robotsData = response.data.data; // Ensure correct data access

        dispatch({ type: "FETCH_ROBOTS_SUCCESS", payload: robotsData });

        // const filteredRobots = robotsData.sort(
        //   (a, b) => a.robot_no - b.robot_no
        // );

        // setSiteRobots(filteredRobots);
      } catch (error) {
        dispatch({
          type: "FETCH_ROBOTS_FAIL",
          payload: error.response.data.message || error.response.data.error,
        });
      }
    };

    getRobots();
  }, [block, site_id]);

  useEffect(() => {
    let pagination = {
      pg: page,
      limit: limit,
    };

    const getDownlinks = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const response = await axios.post(
          `/api/v1/downlinks/get-downlinks`,
          pagination,
          {
            // headers: { Authorization: `Bearer ${authtoken}` },
            withCredentials: true,
          },
        );

        let total = Math.ceil(
          Number(response.data.total) / Number(response.data.limit),
        );
        let next = response.data.hasNextPage;
        let prev = response.data.hasPrevPage;
        dispatch({
          type: "FETCH_SUCCESS",
          payload: {
            data: response.data.data,
            totalPages: total,
            hasNextPage: next,
            hasPrevPage: prev,
          },
        });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: error.response ? error.response.data.message : error.message,
        });
      }
    };

    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      getDownlinks();
    }
  }, [successDelete, page, limit]);

  useEffect(() => {
    const getRobot = async () => {
      try {
        dispatch({ type: "FETCH_ROBOT_REQUEST" });
        const response = await axios.get(
          `/api/v1/robots/get-robot-using-robot-no/${robot_no}`,
          {
            // headers: { Authorization: `Bearer ${authtoken}` },
            withCredentials: true,
          },
        );

        dispatch({ type: "FETCH_ROBOT_SUCCESS", payload: response.data.data });
      } catch (error) {
        dispatch({
          type: "FETCH_ROBOT_FAIL",
          payload: error.response
            ? error.response.data.message
            : error.response.data.error,
        });
      }
    };

    getRobot();
  }, [robot_no]);

  const filteredDownlink = downlinks.filter((item) =>
    item.downlink.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const deleteDownlink = async (downlink) => {
    if (
      window.confirm(
        `Are you sure you want to delete downlink ${downlink.downlink}🚫`,
      )
    ) {
      try {
        await axios.delete(`/api/v1/downlinks/${downlink._id}`, {
          // headers: { Authorization: `Bearer ${authtoken}` },
          withCredentials: true,
        });

        toast.success("Downlink deleted successfully");
        dispatch({ type: "DELETE_SUCCESS" });
      } catch (err) {
        toast.error(err.response ? err.response.data.message : err.message);
        dispatch({ type: "DELETE_FAIL" });
      }
    }
  };

  const blockwiserobots =
    robots?.length > 0 ? robots.filter((robot) => robot.block === block) : [];

  const sendsingleDownlink = async (command, index) => {
    setLoadingRow(index);
    setCommandButton(index);
    //deveui,command,robot_no,site_id,lora_no......
    // let robotdownlink =;
    dispatch({ type: "SEND_DOWNLINK_REQUEST" });
    try {
      const data = await axios.post(
        // "/api/v1/robots/downlink",
        "/api/v1/robots/send-mqtt-downlink",
        {
          deveui: robot.deveui,
          robot_no: robot.robot_no,
          site_id: site_id,
          payload: command,
          lora_no: robot.lora_no,
        },
        {
          // headers: { Authorization: `Bearer ${authtoken}` },
          withCredentials: true,
        },
      );

      dispatch({ type: "SEND_DOWNLINK_SUCCESS" });
      toast.success(data.data.message);
    } catch (error) {
      dispatch({
        type: "SEND_DOWNLINK_FAIL",
        payload: error.response?.data?.message || error.response.data.error,
      });

      toast.error(error.response.data.message || error.response.data.error);
    }
    setLoadingRow(null);
    setCommandButton(null);
  };

  const sendCustomDownlink = async (command, sent_custom_to_all) => {
    let robotdownlink = {};

    if (sent_custom_to_all) {
      let robots = blockwiserobots.map((robot) => ({
        deveui: robot.deveui,
        robot_no: robot.robot_no,
      }));
      robotdownlink = {
        robots,
        // deveui: [allrobots.deveui],
        // robot_no: [allrobots.robot_no],
        block: block,
        site_id: site_id,
        command: command,
      };
    } else {
      //deveui,command,robot_no,site_id,lora_no
      robotdownlink = {
        robots: [
          {
            deveui: robot.deveui,
            robot_no: robot.robot_no,
          },
        ],

        site_id: site_id,
        command: command,
        lora_no: robot.lora_no,
      };
    }
    dispatch({ type: "SEND_DOWNLINK_REQUEST" });
    try {
      const data = await axios.post(
        "/api/v1/robots/custom-downlink",
        robotdownlink,
        {
          // headers: { Authorization: `Bearer ${authtoken}` },
          withCredentials: true,
        },
      );

      toast.success(data.data.message);
      dispatch({ type: "SEND_DOWNLINK_SUCCESS" });
    } catch (error) {
      dispatch({
        type: "SEND_DOWNLINK_FAIL",
        payload: error.response?.data?.message || error.response?.data?.error,
      });

      toast.error(error.response.data.message || error.response?.data?.error);
    }
    setCustomDownlink("");
    setSentCustomToAll(false);
    setLoadingRow(null);
    setCommandButton(null);
  };

  const sendMulticastDownlink = async (command, index) => {
    let alldeveuis = blockwiserobots.map((robot) => robot.deveui); // Corrected arrow function syntax
    let allrobotnos = blockwiserobots.map((robot) => robot.robot_no); // Corrected arrow function syntax
    setCommandButton(index);
    //deveui,command,robot_no,site_id,lora_no
    let robotdownlink = {
      deveui: alldeveuis,
      block: block,
      site_id: site_id,
      command: command,
      robot_no: allrobotnos,
    };
    dispatch({ type: "SEND_DOWNLINK_REQUEST" });
    try {
      const data = await axios.post(
        // "/api/v1/robots/multicast-downlink",
        "/api/v1/robots/send-mqtt-multicast-downlink",

        robotdownlink,
        {
          // headers: { Authorization: `Bearer ${authtoken}` },
          withCredentials: true,
        },
      );

      dispatch({ type: "SEND_DOWNLINK_SUCCESS" });

      toast.success(data.data.message);
    } catch (error) {
      dispatch({
        type: "SEND_DOWNLINK_FAIL",
        payload: error.response?.data?.message || error.response.data.error,
      });

      toast.error(error.response?.data?.message || error.response.data.error);
    }

    setCommandButton(null);
  };

  const handlePageInputChange = (e) => {
    setPageInput(e.target.value);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handlePageInputSubmit = () => {
    const pageNumber = parseInt(pageInput);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      handlePageChange(pageNumber);
    }
  };

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
  } else if (userInfo?.role === "Factory Admin") {
    adminroute = "factory-admin";
  }

  const TextToBase64 = (text) => {
    const base64 = btoa(text);
    setBase64Text(base64);
    setTimeout(() => {
      setBase64Text("");
    }, 5000);
    setText("");
    return base64;
  };
  error && <CBadge color="danger">{error}</CBadge>;

  let WheelSpeedBadge = "";

  if (robot.wheel_motor_speed > 100 && robot.wheel_motor_speed <= 170) {
    WheelSpeedBadge = "primary";
  } else if (robot.wheel_motor_speed > 170 && robot.wheel_motor_speed <= 210) {
    WheelSpeedBadge = "warning";
  } else if (robot.wheel_motor_speed > 210) {
    WheelSpeedBadge = "success";
  } else {
    WheelSpeedBadge = "primary";
  }

  let BrushSpeedBadge = "";

  if (robot.brush_motor_speed > 100 && robot.brush_motor_speed <= 170) {
    BrushSpeedBadge = "primary";
  } else if (robot.brush_motor_speed > 170 && robot.brush_motor_speed <= 210) {
    BrushSpeedBadge = "warning";
  } else if (robot.brush_motor_speed > 210) {
    BrushSpeedBadge = "success";
  } else {
    BrushSpeedBadge = "primary";
  }

  return (
    <>
      {loadingRobots ? (
        <div className="loading-container">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="">
          {/* Page Header */}
          <CRow>
            <CCol>
              <h4 className=" text-center">
                <span className="text-success">{site_id} -&nbsp;</span>
                <span className="text-warning">{block}</span>
                &nbsp;-&nbsp;Robot's Configuration
              </h4>
            </CCol>
          </CRow>

          {/* Action Buttons */}
          <CRow className="my-2">
            <CCol>
              <div className="d-flex flex-wrap align-items-center">
                <CButton
                  className="btn btn-sm btn-secondary me-2 mb-2 shadow-sm"
                  onClick={() => sendMulticastDownlink(start, 1)}
                >
                  {commandButton === 1 ? (
                    <>
                      START ALL&nbsp;
                      <LoadingSpinner />
                    </>
                  ) : (
                    "START ALL"
                  )}
                </CButton>
                <CButton
                  className="btn btn-sm btn-danger me-2 mb-2 shadow-sm"
                  onClick={() => sendMulticastDownlink(newCleaningStart, 44)}
                >
                  {commandButton === 44 ? (
                    <>
                      TEST START ALL&nbsp;
                      <LoadingSpinner />
                    </>
                  ) : (
                    "TEST START ALL"
                  )}
                </CButton>
                <CButton
                  className="btn btn-sm btn-secondary me-2 mb-2 shadow-sm"
                  onClick={() => sendMulticastDownlink(stop, 2)}
                >
                  {commandButton === 2 ? (
                    <>
                      STOP ALL&nbsp;
                      <LoadingSpinner />
                    </>
                  ) : (
                    "STOP ALL"
                  )}
                </CButton>
                <CButton
                  className="btn btn-sm btn-secondary me-2 mb-2 shadow-sm"
                  onClick={() => sendMulticastDownlink(returntodock, 3)}
                >
                  {commandButton === 3 ? (
                    <>
                      RETURN TO DOCK ALL&nbsp;
                      <LoadingSpinner />
                    </>
                  ) : (
                    "RETURN TO DOCK ALL"
                  )}
                </CButton>
                <CButton
                  className="btn btn-sm btn-secondary me-2 mb-2 shadow-sm"
                  onClick={() => sendMulticastDownlink(removecurrentLimit, 42)}
                >
                  {commandButton === 42 ? (
                    <>
                      REMOVE CURRENT LIMIT ALL&nbsp;
                      <LoadingSpinner />
                    </>
                  ) : (
                    "REMOVE CURRENT LIMIT ALL"
                  )}
                </CButton>
                <Link
                  to={`/${adminroute}/site-management/block-management/${site_id}/${block}/${robot_no}/debug_logs`}
                  className="btn btn-sm btn-secondary me-2 mb-2 shadow-sm"
                >
                  DEBUG LOG
                </Link>
                <Link
                  to={`/${adminroute}/site-management/block-management/${site_id}/${block}/${robot_no}/cleaning_logs`}
                  className="btn btn-sm btn-secondary me-2 mb-2 shadow-sm"
                >
                  CLEANING LOG
                </Link>

                <CDropdown className="dropdown me-2 mb-2">
                  {robots.length > 1 ? (
                    <CDropdownToggle
                      size="sm"
                      className="shadow-sm"
                      color={robot.lora_state === 1 ? "success" : "danger"}
                    >
                      {robot.robot_no}
                    </CDropdownToggle>
                  ) : (
                    <CButton
                      size="sm"
                      color={robot.lora_state === 1 ? "success" : "danger"}
                      className="shadow-sm"
                      disabled // since no dropdown when single robot
                    >
                      {robot.robot_no}
                    </CButton>
                  )}

                  {robots.length > 1 && (
                    <CDropdownMenu className="z-3 px-2 py-1 dropdown-menu-robot border">
                      {robots.map((item, index) => (
                        <Link
                          key={index}
                          to={
                            item.robot_no === robot_no
                              ? `#`
                              : `/${adminroute}/site-management/block-management/${site_id}/${block}/${item.robot_no}`
                          }
                          className="dopdown-item-robot "
                        >
                          <CBadge
                            color={`${
                              item.lora_state === 1 ? "success" : "danger"
                            }`}
                            className="p-2 my-1"
                          >
                            {item.robot_no}{" "}
                          </CBadge>
                        </Link>
                      ))}
                    </CDropdownMenu>
                  )}
                </CDropdown>

                {userInfo?.role === "Master Admin" && robot?._id && (
                  <>
                    <Link
                      className="btn btn-sm btn-outline-primary me-2 mb-2"
                      to={`/${adminroute}/robots/view/${robot._id}`}
                    >
                      View Robot
                    </Link>
                    <Link
                      to={`/${adminroute}/robots/update/${robot._id}`}
                      className="btn btn-sm btn-outline-warning me-2 mb-2"
                    >
                      Update Robot
                    </Link>
                    {/* /robot-event-and-frames/:robot_no */}
                  </>
                )}
                <Link
                  to={`event-and-frames/${robot.deveui}`}
                  className="btn btn-sm btn-outline-info me-2 mb-2"
                >
                  View Robot Events and Frames
                </Link>
              </div>
            </CCol>
          </CRow>

          <CRow className="my-2">
            <CCol></CCol>
          </CRow>
          {loadingRobot ? (
            <LoadingSpinner />
          ) : (
            <div>
              <CRow>
                {/* First Card */}
                <CCol md={5} className="mt-2">
                  <CCard className="h-100 border-0 shadow-sm rounded-3">
                    <CCardBody className="p-3">
                      {/* Top Section: Robot No + Battery */}
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className=" mb-0">{robot.robot_no}</h6>
                        <span className="px-2 py-1">
                          🔋 {robot.battery_voltage}
                          <span className="mx-1">%</span>
                        </span>
                      </div>

                      {/* Info Grid */}
                      <CRow className="text-center mb-2">
                        <CCol>
                          <small className="text-muted">PCB</small>
                          <div className="fw-semibold">{robot.pcb_version}</div>
                        </CCol>
                        <CCol>
                          <small className="text-muted">Firmware</small>
                          <div className="fw-semibold">{robot.version}</div>
                        </CCol>
                        <CCol>
                          <small className="text-muted">LoRa</small>
                          <CTooltip content={robot.deveui} placement="top">
                            <div
                              className="fw-semibold text-success"
                              style={{ cursor: "pointer" }}
                            >
                              {robot.lora_no}
                            </div>
                          </CTooltip>
                        </CCol>
                      </CRow>

                      <hr className="my-2" />

                      {/* Speeds */}
                      <CRow className="text-center">
                        <CCol>
                          <small className="text-muted">Wheel Speed</small>
                          <div>
                            <CBadge
                              color={`${WheelSpeedBadge}`}
                              className="px-3 py-2 rounded-pill"
                            >
                              {robot.wheel_motor_speed_string} -{" "}
                              {robot.wheel_motor_speed}
                            </CBadge>
                          </div>
                        </CCol>
                        <CCol>
                          <small className="text-muted">Brush Speed</small>
                          <div>
                            <CBadge
                              color={`${BrushSpeedBadge}`}
                              className="px-3 py-2 rounded-pill"
                            >
                              {robot.brush_motor_speed_string} -{" "}
                              {robot.brush_motor_speed}
                            </CBadge>
                          </div>
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>
                </CCol>

                {/* Second Card */}
                <CCol md={4} className="mt-3">
                  <CCard className="h-100 border-0 shadow-sm">
                    <CCardBody className="d-flex flex-column justify-content-start p-3">
                      {/* Top Row: Status */}
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <span
                            className={`fw-bold text-${
                              robot.lora_state === 1 ? "success" : "danger"
                            }`}
                            style={{ fontSize: "16px" }}
                          >
                            {robot.lora_state === 1 ? "Online" : "Offline"}
                          </span>
                        </div>
                        {/* Middle Row: Stuck Count */}
                        <div className="">
                          <span className="text-danger fw-semibold">
                            SC: {robot.stuck_count}
                          </span>
                        </div>
                      </div>

                      {/* Bottom Row: Last Uplink */}
                      <div className="d-flex flex-column">
                        {!robot.last_uplink ||
                        isNaN(new Date(robot.last_uplink).getTime()) ? (
                          <CBadge color="danger" shape="rounded-pill">
                            Robot is not activated
                          </CBadge>
                        ) : (
                          <>
                            <span
                              className="text-success "
                              style={{ cursor: "pointer" }}
                            >
                              <span className="me-2">Last Uplink</span>:
                              <span className="text-white mx-2">
                                {formatDistanceToNow(
                                  new Date(robot.last_uplink),
                                  {
                                    addSuffix: true,
                                  },
                                )}
                              </span>
                            </span>

                            <div className="">
                              <span className="me-2 text-success">
                                Last Status
                              </span>
                              :
                              <span className="ms-2">
                                {" "}
                                {robot.last_status || "-"}
                              </span>
                            </div>
                            <span className="">
                              ({new Date(robot.last_uplink).toLocaleString()})
                            </span>
                          </>
                        )}
                      </div>
                    </CCardBody>
                  </CCard>
                </CCol>

                {/* Third Card (Custom Downlink) */}
                {(userInfo.role === "Master Admin" ||
                  userInfo.role === "Master User") && (
                  <CCol md={3} className="mt-2">
                    <CCard
                      className="shadow border-0 "
                      style={{ height: "100%" }}
                    >
                      <CCardBody>
                        <div className="d-flex justify-content-between align-items-center">
                          <h6 className="fw-bold">Custom Downlink</h6>

                          <FaCircleInfo
                            className="text-primary"
                            style={{ cursor: "pointer" }}
                            onClick={() => setModalVisible(true)}
                          />
                        </div>
                        {/* <form className="position-relative mt-4">
                          <CFormCheck
                            type="checkbox"
                            className="my-1"
                            label="Send to all"
                            id="sent_custom_to_all"
                            checked={sent_custom_to_all}
                            onChange={(e) => {
                              setSentCustomToAll(e.target.checked);
                            }}
                            style={{
                              cursor: "pointer",
                              transform: "scale(1.1)",
                              marginBottom: "0",
                            }}
                          />

                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter command"
                            name={customDownlink}
                            onChange={(e) => setCustomDownlink(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && customDownlink) {
                                e.preventDefault(); // Prevent form submission
                                sendCustomDownlink(
                                  customDownlink,
                                  sent_custom_to_all,
                                ); // Trigger the same function as the button
                              }
                            }}
                          />
                          <CButton
                            disabled={!customDownlink}
                            onClick={() =>
                              sendCustomDownlink(
                                customDownlink,
                                sent_custom_to_all,
                              )
                            }
                            type="button"
                            className="d-flex justify-content-center align-items-center btn-sm send-button "
                          >
                            <span className="d-flex justify-content-center align-items-center">
                              {sendingCommandloading ? (
                                <LoadingSpinner />
                              ) : (
                                <FaArrowUp />
                              )}
                            </span>
                          </CButton>
                        </form> */}
                        <form className="mt-4">
                          <CFormCheck
                            type="checkbox"
                            className="my-2"
                            label="Send to all"
                            id="sent_custom_to_all"
                            checked={sent_custom_to_all}
                            onChange={(e) =>
                              setSentCustomToAll(e.target.checked)
                            }
                            style={{
                              cursor: "pointer",
                              transform: "scale(1.1)",
                              marginBottom: "6px",
                            }}
                          />

                          {/* INPUT WRAPPER */}
                          <div className="position-relative">
                            <input
                              type="text"
                              className="form-control pe-5"
                              placeholder="Enter command"
                              name={customDownlink}
                              onChange={(e) =>
                                setCustomDownlink(e.target.value)
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && customDownlink) {
                                  e.preventDefault();
                                  sendCustomDownlink(
                                    customDownlink,
                                    sent_custom_to_all,
                                  );
                                }
                              }}
                            />

                            <CButton
                              disabled={!customDownlink}
                              onClick={() =>
                                sendCustomDownlink(
                                  customDownlink,
                                  sent_custom_to_all,
                                )
                              }
                              type="button"
                              className="send-button d-flex justify-content-center align-items-center btn-sm"
                            >
                              {sendingCommandloading ? (
                                <LoadingSpinner />
                              ) : (
                                <FaArrowUp />
                              )}
                            </CButton>
                          </div>
                        </form>
                      </CCardBody>
                    </CCard>
                  </CCol>
                )}
              </CRow>

              {/* Modal for Commands */}
              <CModal
                scrollable
                backdrop="static"
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                size="xl"
              >
                <CModalHeader>
                  <CModalTitle>Custom Downlink</CModalTitle>
                </CModalHeader>
                <CModalBody>
                  <CRow className="d-flex justify-content-between">
                    <CCol xs={12} sm={10} md={6} lg={4}>
                      <CInputGroup className="mb-3">
                        <CFormInput
                          type="text"
                          placeholder="Search downlink..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </CInputGroup>
                    </CCol>
                    <CCol
                      className="d-flex justify-content-end align-items-center"
                      xs={12}
                      sm={10}
                      md={6}
                      lg={4}
                    >
                      <Link
                        className="btn btn-sm btn-warning justify-content-end"
                        size="md"
                        // to="/master-admin/site-management/add-downlink"
                        to={`/master-admin/site-management/block-management/${site_id}/${block}/${robot_no}/add-downlink`}
                      >
                        Add Downlink
                      </Link>
                    </CCol>
                  </CRow>
                  <CTable responsive hover bordered>
                    <CTableHead color="secondary">
                      <CTableRow>
                        <CTableHeaderCell style={{ minWidth: "70px" }}>
                          Sr No
                        </CTableHeaderCell>
                        <CTableHeaderCell style={{ minWidth: "150px" }}>
                          Command
                        </CTableHeaderCell>
                        <CTableHeaderCell style={{ minWidth: "150px" }}>
                          Decoded String
                        </CTableHeaderCell>
                        <CTableHeaderCell style={{ minWidth: "120px" }}>
                          Hexa decimal
                        </CTableHeaderCell>
                        <CTableHeaderCell style={{ minWidth: "120px" }}>
                          Uplink
                        </CTableHeaderCell>
                        <CTableHeaderCell style={{ minWidth: "240px" }}>
                          Description
                        </CTableHeaderCell>
                        <CTableHeaderCell
                          style={{ minWidth: "250px" }}
                          className="text-center"
                        >
                          Action
                        </CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>

                    <CTableBody>
                      {loading ? (
                        <CTableRow className="text-center">
                          <CTableDataCell colSpan={7}>
                            <LoadingSpinner />
                          </CTableDataCell>
                        </CTableRow>
                      ) : error ? (
                        <CTableRow>
                          <CTableDataCell
                            colSpan={7}
                            className="text-center text-danger"
                          >
                            {error}
                          </CTableDataCell>
                        </CTableRow>
                      ) : filteredDownlink.length > 0 ? (
                        filteredDownlink.map((item, index) => (
                          <CTableRow key={index}>
                            <CTableDataCell>{index + 1}</CTableDataCell>

                            <CTableDataCell>
                              <Link
                                className=" "
                                style={{ textDecoration: "none" }}
                                onClick={() =>
                                  sendsingleDownlink(item.downlink, index)
                                }
                              >
                                {item.downlink}&nbsp;
                                {loadingRow === index ? <LoadingSpinner /> : ""}
                              </Link>
                            </CTableDataCell>
                            <CTableDataCell>
                              {item.decodedString}
                            </CTableDataCell>
                            <CTableDataCell>{item.hexadecimal}</CTableDataCell>
                            <CTableDataCell>{item.uplink}</CTableDataCell>
                            <CTableDataCell>
                              {item.additionalInfo}
                            </CTableDataCell>
                            <CTableDataCell>
                              <div className="d-flex justify-content-center align-items-center">
                                <Link
                                  to={`/master-admin/site-management/block-management/${site_id}/${block}/${robot_no}/view-downlink/${item._id}`}
                                  color=""
                                  size="sm"
                                  className="btn btn-sm btn-secondary m-1"
                                >
                                  View
                                </Link>

                                <Link
                                  to={`/master-admin/site-management/block-management/${site_id}/${block}/${robot_no}/update-downlink/${item._id}`}
                                  color="warning"
                                  size="sm"
                                  className="btn btn-sm btn-warning m-1"
                                >
                                  Edit
                                </Link>

                                <Link
                                  color="danger"
                                  size="sm"
                                  className=" btn btn-sm btn-danger m-1 text-white"
                                  onClick={() => deleteDownlink(item)}
                                >
                                  Delete
                                </Link>
                              </div>
                            </CTableDataCell>
                          </CTableRow>
                        ))
                      ) : (
                        <CTableRow>
                          <CTableDataCell className="text-center" colSpan={7}>
                            No Data Found.
                          </CTableDataCell>
                        </CTableRow>
                      )}
                    </CTableBody>
                  </CTable>

                  <PaginateInput
                    page={page}
                    totalPages={totalPages}
                    hasPrevPage={hasPrevPage}
                    hasNextPage={hasNextPage}
                    pageInput={pageInput}
                    handlePageChange={handlePageChange}
                    handlePageInputChange={handlePageInputChange}
                    handlePageInputSubmit={handlePageInputSubmit}
                    limit={limit}
                    handleLimitChange={setLimit} // New prop
                  />
                </CModalBody>

                <CModalFooter>
                  <CButton
                    size="sm"
                    color="secondary"
                    onClick={() => setModalVisible(false)}
                  >
                    Close
                  </CButton>
                </CModalFooter>
              </CModal>

              <CRow className="my-2">
                {/* First Card - Cleaning Cycle */}
                <CCol md={3} className="mt-2">
                  <CCard
                    className="shadow border-0 "
                    style={{ height: "100%" }}
                  >
                    <CCardBody>
                      <p>Cleaning Cycle</p>
                      <CButton
                        className="btn btn-sm btn-secondary m-1 shadow"
                        onClick={() => sendsingleDownlink(start, 45)}
                      >
                        {commandButton === 45 ? (
                          <>
                            START&nbsp;
                            <LoadingSpinner />
                          </>
                        ) : (
                          "START"
                        )}
                      </CButton>

                      <CButton
                        className="btn btn-sm btn-secondary m-1 shadow-sm"
                        onClick={() => sendsingleDownlink(stop, 2)}
                      >
                        {commandButton === 2 ? (
                          <>
                            STOP&nbsp;
                            <LoadingSpinner />
                          </>
                        ) : (
                          "STOP"
                        )}
                      </CButton>
                      <CButton
                        className="btn btn-sm btn-secondary m-1 shadow-sm"
                        onClick={() => sendsingleDownlink(returntodock, 3)}
                      >
                        {commandButton === 3 ? (
                          <>
                            RETURN&nbsp;
                            <LoadingSpinner />
                          </>
                        ) : (
                          "RETURN"
                        )}
                      </CButton>
                      <div className=" border-top">
                        {(userInfo.role === "Master Admin" ||
                          userInfo.role === "Service Admin") && (
                          <>
                            <CButton
                              className="btn btn-sm btn-warning m-1 shadow"
                              onClick={() =>
                                sendsingleDownlink(partialStart, 43)
                              }
                            >
                              {commandButton === 43 ? (
                                <>
                                  Partial Start&nbsp;
                                  <LoadingSpinner />
                                </>
                              ) : (
                                "Partial Start"
                              )}
                            </CButton>
                            <CButton
                              className="btn btn-sm btn-warning m-1 shadow"
                              onClick={() =>
                                sendsingleDownlink(intelligentStart, 46)
                              }
                            >
                              {commandButton === 46 ? (
                                <>
                                  Intelligent Start&nbsp;
                                  <LoadingSpinner />
                                </>
                              ) : (
                                "Intelligent Start"
                              )}
                            </CButton>
                          </>
                        )}
                      </div>
                    </CCardBody>
                  </CCard>
                </CCol>

                {/* Second Card - Set Wheel Speed */}
                <CCol md={3} className="mt-2">
                  <CCard
                    className="shadow border-0 "
                    style={{ height: "100%" }}
                  >
                    <CCardBody>
                      <p>Set Wheel Speed</p>
                      <CButton
                        className="btn btn-sm btn-secondary m-1 shadow-sm"
                        onClick={() => sendsingleDownlink(setWheelPwm100, 4)}
                      >
                        {commandButton === 4 ? (
                          <>
                            LOW&nbsp;
                            <LoadingSpinner />
                          </>
                        ) : (
                          "LOW"
                        )}
                      </CButton>
                      <CButton
                        className="btn btn-sm btn-secondary m-1 shadow-sm"
                        onClick={() => sendsingleDownlink(setWheelPwm200, 5)}
                      >
                        {commandButton === 5 ? (
                          <>
                            MEDIUM&nbsp;
                            <LoadingSpinner />
                          </>
                        ) : (
                          "MEDIUM"
                        )}
                      </CButton>
                      <CButton
                        className="btn btn-sm btn-secondary m-1 shadow-sm"
                        onClick={() => sendsingleDownlink(setWheelPwm250, 6)}
                      >
                        {commandButton === 6 ? (
                          <>
                            HIGH&nbsp;
                            <LoadingSpinner />
                          </>
                        ) : (
                          "HIGH"
                        )}
                      </CButton>
                    </CCardBody>
                  </CCard>
                </CCol>

                {/* Third Card - Set Brush Speed */}
                <CCol md={3} className="mt-2">
                  <CCard
                    className="shadow border-0 "
                    style={{ height: "100%" }}
                  >
                    <CCardBody>
                      <p>Set Brush Speed</p>
                      <CButton
                        className="btn btn-sm btn-secondary m-1 shadow-sm"
                        onClick={() => sendsingleDownlink(setBrushPwm100, 7)}
                      >
                        {commandButton === 7 ? (
                          <>
                            LOW&nbsp;
                            <LoadingSpinner />
                          </>
                        ) : (
                          "LOW"
                        )}
                      </CButton>
                      <CButton
                        className="btn btn-sm btn-secondary m-1 shadow-sm"
                        onClick={() => sendsingleDownlink(setBrushPwm200, 8)}
                      >
                        {commandButton === 8 ? (
                          <>
                            MEDIUM&nbsp;
                            <LoadingSpinner />
                          </>
                        ) : (
                          "MEDIUM"
                        )}
                      </CButton>
                      <CButton
                        className="btn btn-sm btn-secondary m-1 shadow-sm"
                        onClick={() => sendsingleDownlink(setBrushPwm250, 9)}
                      >
                        {commandButton === 9 ? (
                          <>
                            HIGH&nbsp;
                            <LoadingSpinner />
                          </>
                        ) : (
                          "HIGH"
                        )}
                      </CButton>
                    </CCardBody>
                  </CCard>
                </CCol>

                {/* Fourth Card - Text To Base64 */}
                {(userInfo.role === "Master Admin" ||
                  userInfo.role === "Service Admin") && (
                  <CCol md={3} className="mt-2">
                    <CCard
                      className="shadow border-0 "
                      style={{ height: "100%" }}
                    >
                      <CCardBody>
                        <div className="d-flex justify-content-between align-items-center">
                          <h6 className="fw-bold">Text to Base64</h6>
                          <span className="text-danger fst-italic">
                            {base64Text}
                          </span>
                        </div>
                        <form className="position-relative mt-4">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter value"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                          />
                          <CButton
                            onClick={() => TextToBase64(text)}
                            type="button"
                            className="d-flex justify-content-center align-items-center btn-sm send-button "
                          >
                            <span className="d-flex justify-content-center align-items-center">
                              <FaArrowUp />
                            </span>
                          </CButton>
                        </form>
                      </CCardBody>
                    </CCard>
                  </CCol>
                )}
              </CRow>

              {/* Fourth Row */}
              <CRow className="my-2">
                {(userInfo.role === "Master Admin" ||
                  userInfo.role === "Service Admin") && (
                  <>
                    {/* Card 1 - Custom Current */}
                    <CCol md={3} className="mt-2">
                      <CCard
                        className="shadow border-0"
                        style={{ height: "100%" }}
                      >
                        <CCardBody>
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <p className="mb-0">Custom Current</p>
                            <CButton className="btn btn-sm btn-secondary me-2 mb-2">
                              Remove Current Limit
                            </CButton>
                          </div>

                          {/* Wheel Current */}
                          <form className="position-relative mb-3 mt-4">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter Wheel Current"
                              value={wheelCurrentValue}
                              onChange={(e) =>
                                setWheelCurrentValue(e.target.value)
                              }
                            />
                            <CButton
                              disabled={!wheelCurrentValue}
                              onClick={() =>
                                sendsingleDownlink(
                                  `${setWheelCurrent}${wheelCurrentValue}`,
                                  10,
                                )
                              }
                              type="button"
                              className="d-flex justify-content-center align-items-center btn-sm send-button "
                            >
                              {commandButton === 10 ? (
                                <>
                                  <LoadingSpinner />
                                </>
                              ) : (
                                <FaArrowUp />
                              )}
                            </CButton>
                          </form>

                          {/* Brush Current */}
                          <div className="position-relative">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter Brush Current"
                              value={brushCurrentValue}
                              onChange={(e) =>
                                setBrushCurrentValue(e.target.value)
                              }
                            />
                            <CButton
                              disabled={!brushCurrentValue}
                              type="button"
                              className="d-flex justify-content-between align-items-center btn-sm btn-secondary position-absolute send-button shadow-sm"
                              onClick={() =>
                                sendsingleDownlink(
                                  `${setBrushCurrent}${brushCurrentValue}`,
                                  11,
                                )
                              }
                            >
                              {commandButton === 11 ? (
                                <>
                                  <LoadingSpinner />
                                </>
                              ) : (
                                <FaArrowUp />
                              )}
                            </CButton>
                          </div>
                        </CCardBody>
                      </CCard>
                    </CCol>

                    {/* Card 2 - Speed */}
                    <CCol md={3} className="mt-2">
                      <CCard
                        className="shadow border-0"
                        style={{ height: "100%" }}
                      >
                        <CCardBody>
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <p className="mb-0">Custom Speed</p>
                            <small className="text-danger">(0-255)</small>
                          </div>

                          {/* Enter Speed */}
                          <div className="position-relative mb-3">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Brush Speed"
                              value={brushSpeedValue}
                              onChange={(e) =>
                                setBrushSpeedValue(e.target.value)
                              }
                            />
                            <CButton
                              type="button"
                              disabled={!brushSpeedValue}
                              className="d-flex justify-content-between align-items-center btn-sm btn-secondary position-absolute send-button shadow-sm"
                              onClick={() =>
                                sendsingleDownlink(
                                  `${setBrushSpeed}${brushSpeedValue}`,
                                  12,
                                )
                              }
                            >
                              {commandButton === 12 ? (
                                <>
                                  <LoadingSpinner />
                                </>
                              ) : (
                                <FaArrowUp />
                              )}
                            </CButton>
                          </div>

                          {/* Brush Speed */}
                          <div className="position-relative">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="wheel Speed"
                              value={wheelSpeedValue}
                              onChange={(e) =>
                                setWheelSpeedValue(e.target.value)
                              }
                            />
                            <CButton
                              type="button"
                              disabled={!wheelSpeedValue}
                              className="d-flex justify-content-between align-items-center btn-sm btn-secondary position-absolute send-button shadow-sm"
                              onClick={() =>
                                sendsingleDownlink(
                                  `${setWheelSpeed}${wheelSpeedValue}`,
                                  13,
                                )
                              }
                            >
                              {commandButton === 13 ? (
                                <>
                                  <LoadingSpinner />
                                </>
                              ) : (
                                <FaArrowUp />
                              )}
                            </CButton>
                          </div>
                        </CCardBody>
                      </CCard>
                    </CCol>

                    {/* Card 3 - Direction */}
                    <CCol md={3} className="mt-2">
                      <CCard
                        className="shadow border-0"
                        style={{ height: "100%" }}
                      >
                        <CCardBody>
                          <p>Direction</p>
                          <div className="d-flex flex-wrap gap-2">
                            <CButton
                              className="btn btn-sm btn-secondary m-1 shadow-sm"
                              onClick={() => sendsingleDownlink(moveLeft, 14)}
                            >
                              {commandButton === 14 ? (
                                <>
                                  Move Left&nbsp;
                                  <LoadingSpinner />
                                </>
                              ) : (
                                "Move Left"
                              )}
                            </CButton>
                            <CButton
                              className="btn btn-sm btn-secondary m-1 shadow-sm"
                              onClick={() => sendsingleDownlink(moveRight, 15)}
                            >
                              {commandButton === 15 ? (
                                <>
                                  Move Right&nbsp;
                                  <LoadingSpinner />
                                </>
                              ) : (
                                "Move Right"
                              )}
                            </CButton>
                            <CButton
                              className="btn btn-sm btn-secondary m-1 shadow-sm"
                              onClick={() => sendsingleDownlink(cleanLeft, 16)}
                            >
                              {commandButton === 16 ? (
                                <>
                                  Clean Left&nbsp;
                                  <LoadingSpinner />
                                </>
                              ) : (
                                "Clean Left"
                              )}
                            </CButton>
                            <CButton
                              className="btn btn-sm btn-secondary m-1 shadow-sm"
                              onClick={() => sendsingleDownlink(cleanRight, 17)}
                            >
                              {commandButton === 17 ? (
                                <>
                                  Clean Right&nbsp;
                                  <LoadingSpinner />
                                </>
                              ) : (
                                "Clean Right"
                              )}
                            </CButton>
                          </div>
                        </CCardBody>
                      </CCard>
                    </CCol>

                    {/* Card 4 - Test Mode */}
                    <CCol md={3} className="mt-2">
                      <CCard
                        className="shadow border-0"
                        style={{ height: "100%" }}
                      >
                        <CCardBody>
                          <p>Test Mode ☀️</p>
                          <CButton
                            className="btn btn-sm btn-secondary m-1 shadow-sm"
                            onClick={() => sendsingleDownlink(testModeOn, 18)}
                          >
                            {commandButton === 18 ? (
                              <>
                                Enable&nbsp;
                                <LoadingSpinner />
                              </>
                            ) : (
                              "Enable"
                            )}
                          </CButton>
                          <CButton
                            className="btn btn-sm btn-secondary m-1 shadow-sm"
                            onClick={() => sendsingleDownlink(testModeOff, 19)}
                          >
                            {commandButton === 19 ? (
                              <>
                                Disable&nbsp;
                                <LoadingSpinner />
                              </>
                            ) : (
                              "Disable"
                            )}
                          </CButton>
                        </CCardBody>
                      </CCard>
                    </CCol>
                  </>
                )}
              </CRow>

              {/* Seventh Row */}
              <CRow className="my-2">
                {(userInfo.role === "Master Admin" ||
                  userInfo.role === "Service Admin") && (
                  <>
                    {/* Card 1 - Weather Lock */}
                    <CCol md={3} className="mt-2">
                      <CCard
                        className="shadow border-0"
                        style={{ height: "100%" }}
                      >
                        <CCardBody>
                          <p>Weather Lock ☀️</p>
                          <CButton
                            className="btn btn-sm btn-secondary m-1 shadow-sm"
                            onClick={() =>
                              sendsingleDownlink(weatherLockEnable, 20)
                            }
                          >
                            {commandButton === 20 ? (
                              <>
                                Enable&nbsp;
                                <LoadingSpinner />
                              </>
                            ) : (
                              "Enable"
                            )}
                          </CButton>
                          <CButton
                            className="btn btn-sm btn-secondary m-1 shadow-sm"
                            onClick={() =>
                              sendsingleDownlink(weatherLockDisable, 21)
                            }
                          >
                            {commandButton === 21 ? (
                              <>
                                Disable&nbsp;
                                <LoadingSpinner />
                              </>
                            ) : (
                              "Disable"
                            )}
                          </CButton>
                        </CCardBody>
                      </CCard>
                    </CCol>

                    {/* Card 2 - Reset */}
                    <CCol md={3} className="mt-2">
                      <CCard
                        className="shadow border-0"
                        style={{ height: "100%" }}
                      >
                        <CCardBody>
                          <p>Reset</p>
                          <CButton
                            className="btn btn-sm btn-secondary m-1 shadow-sm"
                            onClick={() => sendsingleDownlink(resetBoard, 22)}
                          >
                            {commandButton === 22 ? (
                              <>
                                Reset&nbsp;
                                <LoadingSpinner />
                              </>
                            ) : (
                              "Reset"
                            )}
                          </CButton>
                        </CCardBody>
                      </CCard>
                    </CCol>

                    {/* Card 3 - Set Dock Station */}
                    <CCol md={3} className="mt-2">
                      <CCard
                        className="shadow border-0"
                        style={{ height: "100%" }}
                      >
                        <CCardBody>
                          <p>Set Dock Station</p>
                          <div className="d-flex flex-wrap gap-2">
                            <CButton
                              className="btn btn-sm btn-secondary m-1 shadow-sm"
                              disabled={robot.dock === "left" ? true : false}
                              onClick={() =>
                                sendsingleDownlink(setDockAtLeft, 23)
                              }
                            >
                              {" "}
                              {commandButton === 23 ? (
                                <>
                                  Left&nbsp;
                                  <LoadingSpinner />
                                </>
                              ) : (
                                "Left"
                              )}
                            </CButton>
                            <CButton
                              className="btn btn-sm btn-secondary m-1 shadow-sm"
                              disabled={robot.dock === "right" ? true : false}
                              onClick={() =>
                                sendsingleDownlink(setDockAtRight, 24)
                              }
                            >
                              {commandButton === 24 ? (
                                <>
                                  Right&nbsp;
                                  <LoadingSpinner />
                                </>
                              ) : (
                                "Right"
                              )}
                            </CButton>
                            <CButton
                              className="btn btn-sm btn-secondary m-1 shadow-sm"
                              onClick={() => sendsingleDownlink(CheckDock, 25)}
                            >
                              {commandButton === 25 ? (
                                <>
                                  Check EEPROM Dock&nbsp;
                                  <LoadingSpinner />
                                </>
                              ) : (
                                "Check EEPROM Dock"
                              )}
                            </CButton>
                            <CButton
                              className="btn btn-sm btn-secondary m-1 shadow-sm"
                              onClick={() =>
                                sendsingleDownlink(CheckSensorState, 26)
                              }
                            >
                              {commandButton === 26 ? (
                                <>
                                  Check Sensor State&nbsp;
                                  <LoadingSpinner />
                                </>
                              ) : (
                                "Check Sensor State"
                              )}
                            </CButton>
                          </div>
                        </CCardBody>
                      </CCard>
                    </CCol>

                    {/* Card 4 - Motor Modes */}
                    <CCol md={3} className="mt-2">
                      <CCard
                        className="shadow border-0"
                        style={{ height: "100%" }}
                      >
                        <CCardBody>
                          <p>Motor Modes</p>
                          <div className="d-flex flex-wrap gap-2">
                            <CButton className="btn btn-sm btn-secondary m-1 shadow-sm">
                              40W
                            </CButton>
                            <CButton className="btn btn-sm btn-secondary m-1 shadow-sm">
                              60W
                            </CButton>
                          </div>
                        </CCardBody>
                      </CCard>
                    </CCol>
                  </>
                )}
              </CRow>

              {/* Fifth Row */}
              <CRow className="my-2">
                {(userInfo.role === "Master Admin" ||
                  userInfo.role === "Service Admin") && (
                  <>
                    {/* Card 1 - Get Values */}
                    <CCol md={3} className="mt-2">
                      <CCard
                        className="shadow border-0"
                        style={{ height: "100%" }}
                      >
                        <CCardBody>
                          <p>Get Values</p>
                          <div className="d-flex flex-wrap gap-2">
                            <CButton
                              className="btn btn-sm btn-secondary m-1 shadow-sm"
                              onClick={() =>
                                sendsingleDownlink(batteryVoltage, 27)
                              }
                            >
                              {commandButton === 27 ? (
                                <>
                                  Battery Voltage&nbsp;
                                  <LoadingSpinner />
                                </>
                              ) : (
                                "Battery Voltage"
                              )}
                            </CButton>
                            <CButton
                              className="btn btn-sm btn-secondary m-1 shadow-sm"
                              onClick={() => sendsingleDownlink(temp, 28)}
                            >
                              {commandButton === 28 ? (
                                <>
                                  Temperature&nbsp;
                                  <LoadingSpinner />
                                </>
                              ) : (
                                "Temperature"
                              )}
                            </CButton>
                          </div>
                        </CCardBody>
                      </CCard>
                    </CCol>

                    {/* Card 2 - Get EEPROM Values */}
                    <CCol md={6} className="mt-2">
                      <CCard
                        className="shadow border-0"
                        style={{ height: "100%" }}
                      >
                        <CCardBody>
                          <p>Get EEPROM Values</p>
                          <div className="d-flex justify-content-start flex-wrap gap-2">
                            <CButton
                              className="btn btn-sm btn-secondary m-1 shadow-sm"
                              onClick={() =>
                                sendsingleDownlink(checkManualMode, 29)
                              }
                            >
                              {commandButton === 29 ? (
                                <>
                                  Check Manual&nbsp;
                                  <LoadingSpinner />
                                </>
                              ) : (
                                "Check Manual"
                              )}
                            </CButton>
                            <CButton
                              className="btn btn-sm btn-secondary m-1 shadow-sm"
                              onClick={() =>
                                sendsingleDownlink(checkActuatorMode, 30)
                              }
                            >
                              {commandButton === 30 ? (
                                <>
                                  Check Actuator&nbsp;
                                  <LoadingSpinner />
                                </>
                              ) : (
                                "Check Actuator"
                              )}
                            </CButton>
                            <CButton
                              className="btn btn-sm btn-secondary m-1 shadow-sm"
                              onClick={() =>
                                sendsingleDownlink(checkBrushCurrent, 31)
                              }
                            >
                              {commandButton === 31 ? (
                                <>
                                  Brush Current&nbsp;
                                  <LoadingSpinner />
                                </>
                              ) : (
                                "Brush Current"
                              )}
                            </CButton>
                            <CButton
                              className="btn btn-sm btn-secondary m-1 shadow-sm"
                              onClick={() =>
                                sendsingleDownlink(checkWheelCurrent, 32)
                              }
                            >
                              {commandButton === 32 ? (
                                <>
                                  Wheel Current&nbsp;
                                  <LoadingSpinner />
                                </>
                              ) : (
                                "Wheel Current"
                              )}
                            </CButton>
                            <CButton
                              className="btn btn-sm btn-secondary m-1 shadow-sm"
                              onClick={() =>
                                sendsingleDownlink(checkWheelSpeed, 33)
                              }
                            >
                              {commandButton === 33 ? (
                                <>
                                  Wheel Speed&nbsp;
                                  <LoadingSpinner />
                                </>
                              ) : (
                                "Wheel Speed"
                              )}
                            </CButton>
                            <CButton
                              className="btn btn-sm btn-secondary m-1 shadow-sm"
                              onClick={() =>
                                sendsingleDownlink(checkBrushSpeed, 34)
                              }
                            >
                              {commandButton === 34 ? (
                                <>
                                  Burush Speed&nbsp;
                                  <LoadingSpinner />
                                </>
                              ) : (
                                "Burush Speed"
                              )}
                            </CButton>
                            <CButton
                              className="btn btn-sm btn-secondary m-1 shadow-sm"
                              onClick={() =>
                                sendsingleDownlink(checkTracker, 35)
                              }
                            >
                              {commandButton === 35 ? (
                                <>
                                  Check Tracker&nbsp;
                                  <LoadingSpinner />
                                </>
                              ) : (
                                "Check Tracker"
                              )}
                            </CButton>
                          </div>
                        </CCardBody>
                      </CCard>
                    </CCol>

                    {/* Card 3 - Set EEPROM Values */}
                    <CCol md={3} className="mt-2">
                      <CCard
                        className="shadow border-0"
                        style={{ height: "100%" }}
                      >
                        <CCardBody>
                          <p>Set EEPROM Values</p>
                          <div className="d-flex flex-wrap gap-2">
                            <CButton
                              className="btn btn-sm btn-secondary m-1 shadow-sm"
                              onClick={() =>
                                sendsingleDownlink(setManualEnable, 36)
                              }
                            >
                              {commandButton === 36 ? (
                                <>
                                  Manual Enable &nbsp;
                                  <LoadingSpinner />
                                </>
                              ) : (
                                "Manual Enable"
                              )}
                            </CButton>
                            <CButton
                              className="btn btn-sm btn-secondary m-1 shadow-sm"
                              onClick={() =>
                                sendsingleDownlink(setManualDisable, 37)
                              }
                            >
                              {commandButton === 37 ? (
                                <>
                                  Manual Disable&nbsp;
                                  <LoadingSpinner />
                                </>
                              ) : (
                                "Manual Disable"
                              )}
                            </CButton>
                            <CButton
                              className="btn btn-sm btn-secondary m-1 shadow-sm"
                              onClick={() =>
                                sendsingleDownlink(setActuatorEnable, 38)
                              }
                            >
                              {commandButton === 38 ? (
                                <>
                                  Actuator Enable&nbsp;
                                  <LoadingSpinner />
                                </>
                              ) : (
                                "Actuator Enable"
                              )}
                            </CButton>

                            <CButton
                              className="btn btn-sm btn-secondary m-1 shadow-sm"
                              onClick={() =>
                                sendsingleDownlink(setActuatorDisable, 39)
                              }
                            >
                              {commandButton === 39 ? (
                                <>
                                  Actuator Disable&nbsp;
                                  <LoadingSpinner />
                                </>
                              ) : (
                                "Actuator Disable"
                              )}
                            </CButton>
                            <CButton
                              className="btn btn-sm btn-secondary m-1 shadow-sm"
                              onClick={() =>
                                sendsingleDownlink(setTrackerEnable, 40)
                              }
                            >
                              {commandButton === 40 ? (
                                <>
                                  Tracker Enable&nbsp;
                                  <LoadingSpinner />
                                </>
                              ) : (
                                "Tracker Enable"
                              )}
                            </CButton>
                            <CButton
                              className="btn btn-sm btn-secondary m-1 shadow-sm"
                              onClick={() =>
                                sendsingleDownlink(setTrackerDisable, 41)
                              }
                            >
                              {commandButton === 41 ? (
                                <>
                                  Tracker Disable&nbsp;
                                  <LoadingSpinner />
                                </>
                              ) : (
                                "Tracker Disable"
                              )}
                            </CButton>
                          </div>
                        </CCardBody>
                      </CCard>
                    </CCol>
                  </>
                )}
              </CRow>

              {/* Sixth Row */}
              <CRow className="my-2">
                {(userInfo.role === "Master Admin" ||
                  userInfo.role === "Service Admin") && (
                  <>
                    {/* Card 1 - Custom Temperature Limit */}
                    <CCol md={3} className="mt-2">
                      <CCard
                        className="shadow border-0"
                        style={{ height: "100%" }}
                      >
                        <CCardBody>
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <p className="mb-0">Custom Temp</p>
                            <span className="text-danger fst-italic small"></span>
                          </div>
                          <div className="position-relative">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter Temp"
                            />
                            <CButton
                              type="button"
                              className="d-flex justify-content-between align-items-center btn-sm btn-secondary position-absolute send-button shadow-sm"
                            >
                              <FaArrowUp />
                            </CButton>
                          </div>
                        </CCardBody>
                      </CCard>
                    </CCol>
                  </>
                )}
              </CRow>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default RobotOperating;
