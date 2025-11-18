import React, { useEffect, useReducer, useState } from "react";
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CButton,
  CDropdownMenu,
  CDropdown,
  CDropdownToggle,
  CTooltip,
  CBadge,
} from "@coreui/react";
import { FaArrowUp } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { formatDistanceToNow } from "date-fns";
import "../site-management/management.css";

const reducer = (state, action) => {
  switch (action.type) {
    // ===== FETCH ALL MDS DOWNLINKS =====
    case "FETCH_MDS_REQUEST":
      return { ...state, loading: true };

    case "FETCH_MDS_SUCCESS":
      return {
        ...state,
        mdsDownlinks: action.payload.data,
        loading: false,
      };

    case "FETCH_MDS_FAIL":
      return { ...state, loading: false, error: action.payload };

    // ===== DELETE MDS DOWNLINK =====
    case "DELETE_MDS_REQUEST":
      return { ...state, loadingDelete: true, successDelete: false };

    case "DELETE_MDS_SUCCESS":
      return { ...state, loadingDelete: false, successDelete: true };

    case "DELETE_MDS_FAIL":
      return { ...state, loadingDelete: false, successDelete: false };

    case "DELETE_MDS_RESET":
      return { ...state, successDelete: false };

    // ===== FETCH MDS DEVICES =====
    case "FETCH_MDS_DEVICES_REQUEST":
      return { ...state, loadingMdsDevices: true, error: "" };

    case "FETCH_MDS_DEVICES_SUCCESS":
      return { ...state, loadingMdsDevices: false, mdsDevices: action.payload };

    case "FETCH_MDS_DEVICES_FAIL":
      return { ...state, loadingMdsDevices: false, error: action.payload };

    // ===== FETCH SINGLE MDS DEVICE =====
    case "FETCH_MDS_DEVICE_REQUEST":
      return { ...state, loadingMdsDevice: true, error: "" };

    case "FETCH_MDS_DEVICE_SUCCESS":
      return { ...state, loadingMdsDevice: false, mdsDevice: action.payload };

    case "FETCH_MDS_DEVICE_FAIL":
      return { ...state, loadingMdsDevice: false, error: action.payload };

    // ===== SEND DOWNLINK TO MDS =====
    case "SEND_MDS_DOWNLINK_REQUEST":
      return { ...state, sendingCommandloading: true, error: "" };

    case "SEND_MDS_DOWNLINK_SUCCESS":
      return { ...state, sendingCommandloading: false };

    case "SEND_MDS_DOWNLINK_FAIL":
      return { ...state, sendingCommandloading: false, error: action.payload };

    default:
      return state;
  }
};
const MdsOperating = () => {
  const [
    {
      error,
      mds,
      sendingCommandloading,
      mdsDevices,
      mdsDevice,
      loadingMdsDevices,
    },
    dispatch,
  ] = useReducer(reducer, {
    mds: {},
    downlinks: [],
    sendingCommandloading: false,
    mdsDevices: [],
    mdsDevice: {},
    loadingMdsDevices: false,
  });
  const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);
  const [loadingRow, setLoadingRow] = useState(null);
  const { site_id, block, mds_no } = useParams();

  const [commandButton, setCommandButton] = useState(null);
  const [customDownlink, setCustomDownlink] = useState("");

  useEffect(() => {
    const getMds = async () => {
      try {
        dispatch({ type: "FETCH_MDS_DEVICES_REQUEST" });
        const response = await axios.get(
          `/api/v1/mds-device/get-mds-by-site-and-block/${site_id}/${block}`,
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );
        const mdsData = response.data.data; // Ensure correct data access

        dispatch({ type: "FETCH_MDS_DEVICES_SUCCESS", payload: mdsData });
      } catch (error) {
        dispatch({
          type: "FETCH_MDS_DEVICES_FAIL",
          payload: error.response.data.message || error.response.data.error,
        });
      }
    };

    getMds();
  }, [block, site_id, authtoken]);

  useEffect(() => {
    const getSingleMds = async () => {
      try {
        dispatch({ type: "FETCH_MDS_DEVICE_REQUEST" });
        const response = await axios.get(
          `/api/v1/mds-device/get-mds-using-mds-no/${mds_no}`,
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );

        dispatch({
          type: "FETCH_MDS_DEVICE_SUCCESS",
          payload: response.data.data,
        });
      } catch (error) {
        dispatch({
          type: "FETCH_MDS_DEVICE_FAIL",
          payload: error.response
            ? error.response.data.message
            : error.response.data.error,
        });
      }
    };

    getSingleMds();
  }, [authtoken, mds_no]);

  const sendsingleDownlink = async (command, index) => {
    setLoadingRow(index);
    setCommandButton(index);

    dispatch({ type: "SEND_DOWNLINK_REQUEST" });
    try {
      let mdsdownlink = {
        deveui: mdsDevice.deveui,
        payload: command,
      };
      const data = await axios.post(
        "/api/v1/robots/send-mqtt-downlink",
        mdsdownlink,
        {
          headers: { Authorization: `Bearer ${authtoken}` },
        }
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

  const sendsingleDownlinkToRobot = async (command, index) => {
    setLoadingRow(index);
    setCommandButton(index);

    dispatch({ type: "SEND_DOWNLINK_REQUEST" });
    try {
      let robotdownlink = {
        deveui: mdsDevice.robot.deveui,
        payload: command,
      };
      const data = await axios.post(
        "/api/v1/robots/send-mqtt-downlink",
        robotdownlink,
        {
          headers: { Authorization: `Bearer ${authtoken}` },
        }
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

  const sendCustomDownlink = async (command) => {
    let robotdownlink = {
      deveui: mdsDevice.deveui,
      payload: command,
    };

    dispatch({ type: "SEND_DOWNLINK_REQUEST" });
    try {
      const data = await axios.post(
        "/api/v1/mds-device/send-mqtt-downlink",
        robotdownlink,
        {
          headers: { Authorization: `Bearer ${authtoken}` },
        }
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
    setLoadingRow(null);
    setCommandButton(null);
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
  }
  error && <CBadge color="danger">{error}</CBadge>;

  return (
    <>
      {loadingMdsDevices ? (
        <div className="loading-container">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="">
          <CRow>
            <CCol>
              <h4 className="fw-bold text-center">
                <span className="">{site_id} -&nbsp;</span>
                <span className="text-primary">{block}</span>
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
                  // onClick={() => sendMulticastDownlink(start, 1)}
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
                  // onClick={() => sendMulticastDownlink(newCleaningStart, 44)}
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
                  // onClick={() => sendMulticastDownlink(stop, 2)}
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
                  // onClick={() => sendMulticastDownlink(returntodock, 3)}
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
                  // onClick={() => sendMulticastDownlink(removecurrentLimit, 42)}
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
                  to={`/${adminroute}/site-management/block-management/${site_id}/${block}/${mds_no}/debug_logs`}
                  className="btn btn-sm btn-secondary me-2 mb-2 shadow-sm"
                >
                  DEBUG LOG
                </Link>
                <Link
                  to={`/${adminroute}/site-management/block-management/${site_id}/${block}/${mds_no}/cleaning_logs`}
                  className="btn btn-sm btn-secondary me-2 mb-2 shadow-sm"
                >
                  CLEANING LOG
                </Link>

                <CDropdown className="dropdown me-2 mb-2">
                  {mdsDevices.length > 1 ? (
                    <CDropdownToggle
                      size="sm"
                      className="shadow-sm"
                      color={mdsDevice.lora_state === 1 ? "success" : "danger"}
                    >
                      {mdsDevice.mds_no}
                    </CDropdownToggle>
                  ) : (
                    <CButton
                      size="sm"
                      color={mdsDevice.lora_state === 1 ? "success" : "danger"}
                      className="shadow-sm"
                      disabled // since no dropdown when single mdsDevice
                    >
                      {mdsDevice.mds_no}
                    </CButton>
                  )}

                  {mdsDevices.length > 1 && (
                    <CDropdownMenu
                      value={mdsDevice.mds_no}
                      className="z-3 px-2 py-1 dropdown-menu-robot border"
                    >
                      {mdsDevices.map((item, index) => (
                        <Link
                          key={index}
                          to={
                            item.mds_no === mds_no
                              ? `#`
                              : `/${adminroute}/mds/site-management/block-management/${site_id}/${block}/${item.mds_no}`
                          }
                          className="dopdown-item-robot "
                        >
                          <CBadge
                            color={`${
                              item.lora_state === 1 ? "success" : "danger"
                            }`}
                            className="p-2 my-1"
                          >
                            {item.mds_no}
                          </CBadge>
                        </Link>
                      ))}
                    </CDropdownMenu>
                  )}
                </CDropdown>

                {userInfo?.role === "Master Admin" && mdsDevice?._id && (
                  <>
                    <Link
                      className="btn btn-sm btn-outline-primary me-2 mb-2"
                      to={`/${adminroute}/mds-devices/view/${mdsDevice._id}`}
                    >
                      View Mds
                    </Link>
                    <Link
                      to={`/${adminroute}/mds-devices/update/${mdsDevice._id}`}
                      className="btn btn-sm btn-outline-warning me-2 mb-2"
                    >
                      Update Mds
                    </Link>
                    <Link
                      to={`event-and-frames/${mdsDevice.deveui}`}
                      className="btn btn-sm btn-outline-info me-2 mb-2"
                    >
                      View Mds Events and Frames
                    </Link>
                  </>
                )}
              </div>
            </CCol>
          </CRow>

          <CRow className="my-2">
            <CCol></CCol>
          </CRow>
          {loadingMdsDevices ? (
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
                        <h6 className=" mb-0">{mdsDevice.mds_no}</h6>
                        <span className="px-2 py-1">
                          🔋 {mdsDevice.battery_voltage}
                          <span className="mx-1">%</span>
                        </span>
                      </div>

                      {/* Info Grid */}
                      <CRow className="text-center mb-2">
                        <CCol>
                          <small className="text-muted">PCB</small>
                          <div className="fw-semibold">
                            {mdsDevice.pcb_version}
                          </div>
                        </CCol>
                        <CCol>
                          <small className="text-muted">Firmware</small>
                          <div className="fw-semibold">{mdsDevice.version}</div>
                        </CCol>
                        <CCol>
                          <small className="text-muted">LoRa</small>
                          <CTooltip content={mdsDevice.deveui} placement="top">
                            <div
                              className="fw-semibold text-success"
                              style={{ cursor: "pointer" }}
                            >
                              {mdsDevice.lora_no}
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
                              color="danger"
                              className="px-3 py-2 rounded-pill"
                            >
                              {mdsDevice.speed}
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
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <span
                            className={`fw-bold text-${
                              mdsDevice.lora_state === 1 ? "success" : "danger"
                            }`}
                            style={{ fontSize: "16px" }}
                          >
                            {mdsDevice.lora_state === 1 ? "Online" : "Offline"}
                          </span>
                        </div>
                      </div>
                      <div className="d-flex flex-column">
                        {!mdsDevice.last_uplink ||
                        isNaN(new Date(mdsDevice.last_uplink).getTime()) ? (
                          <CBadge color="danger" shape="rounded-pill">
                            mdsDevice is not activated
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
                                  new Date(mdsDevice.last_uplink),
                                  {
                                    addSuffix: true,
                                  }
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
                                {mdsDevice.last_status || "-"}
                              </span>
                            </div>
                            <span className="">
                              (
                              {new Date(mdsDevice.last_uplink).toLocaleString()}
                              )
                            </span>
                          </>
                        )}
                      </div>
                    </CCardBody>
                  </CCard>
                </CCol>

                {/* Third Card (Custom Downlink) */}
                {userInfo.role === "Master Admin" && (
                  <CCol md={3} className="mt-2">
                    <CCard
                      className="shadow border-0 "
                      style={{ height: "100%" }}
                    >
                      <CCardBody>
                        <div className="d-flex justify-content-between align-items-center">
                          <h6 className="fw-bold">Custom Downlink</h6>
                        </div>
                        <form className="position-relative mt-4">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter command"
                            name={customDownlink}
                            onChange={(e) => setCustomDownlink(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && customDownlink) {
                                e.preventDefault();
                                sendCustomDownlink(customDownlink);
                              }
                            }}
                          />
                          <CButton
                            disabled={!customDownlink}
                            onClick={() => sendCustomDownlink(customDownlink)}
                            type="button"
                            className="d-flex justify-content-center align-items-center btn-sm send-button"
                          >
                            <span className="d-flex justify-content-center align-items-center">
                              {sendingCommandloading ? (
                                <LoadingSpinner />
                              ) : (
                                <FaArrowUp />
                              )}
                            </span>
                          </CButton>
                        </form>
                      </CCardBody>
                    </CCard>
                  </CCol>
                )}
              </CRow>

              <CRow className="my-2">
                {mdsDevice.robot && (
                  // 4th card->Robot details
                  <CCol md={5} className="mt-2">
                    <CCard className="h-100 border-0 shadow-sm rounded-3">
                      <CCardBody className="p-3">
                        {/* Top Section: Robot No + Battery */}
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h6 className=" mb-0">
                            Robot No: {mdsDevice.robot.robot_no}
                          </h6>
                          <span className="px-2 py-1">
                            🔋 {mdsDevice.robot.battery_voltage}
                            <span className="mx-1">%</span>
                          </span>
                        </div>

                        {/* Info Grid */}
                        <CRow className="text-center mb-2">
                          <CCol>
                            <small className="text-muted">PCB</small>
                            <div className="fw-semibold">
                              {mdsDevice.robot.pcb_version}
                            </div>
                          </CCol>
                          <CCol>
                            <small className="text-muted">Firmware</small>
                            <div className="fw-semibold">
                              {mdsDevice.robot.version}
                            </div>
                          </CCol>
                          <CCol>
                            <small className="text-muted">LoRa</small>
                            <CTooltip
                              content={mdsDevice.deveui}
                              placement="top"
                            >
                              <div
                                className="fw-semibold text-success"
                                style={{ cursor: "pointer" }}
                              >
                                {mdsDevice.robot.lora_no}
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
                                color="danger"
                                className="px-3 py-2 rounded-pill"
                              >
                                {mdsDevice.robot.wheel_motor_speed}
                              </CBadge>
                            </div>
                          </CCol>
                        </CRow>
                      </CCardBody>
                    </CCard>
                  </CCol>
                )}

                {/* 5th card -> mds cycle  */}
                <CCol md={3} className="mt-2">
                  <CCard
                    className="shadow border-0 "
                    style={{ height: "100%" }}
                  >
                    <CCardBody>
                      <p>MDS Cycle</p>
                      <CButton
                        className="btn btn-sm btn-secondary m-1 shadow"
                        onClick={() => sendsingleDownlink("42", 1)}
                      >
                        {commandButton === 1 ? (
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
                        onClick={() => sendsingleDownlink("41", 2)}
                      >
                        {commandButton === 2 ? (
                          <>
                            MOVE TO NEXT&nbsp;
                            <LoadingSpinner />
                          </>
                        ) : (
                          "MOVE TO NEXT"
                        )}
                      </CButton>
                      <CButton
                        className="btn btn-sm btn-secondary m-1 shadow-sm"
                        onClick={() => sendsingleDownlink("09", 3)}
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
                    </CCardBody>
                  </CCard>
                </CCol>

                {/* 6th card->robot cleaning cycle */}
                <CCol md={3} className="mt-2">
                  <CCard
                    className="shadow border-0 "
                    style={{ height: "100%" }}
                  >
                    <CCardBody>
                      <p>Robot Cleaning Cycle</p>
                      <CButton
                        className="btn btn-sm btn-secondary m-1 shadow"
                        onClick={() => sendsingleDownlinkToRobot("11", 1)}
                      >
                        {commandButton === 1 ? (
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
                        onClick={() => sendsingleDownlinkToRobot("14", 2)}
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
                        onClick={() => sendsingleDownlinkToRobot("15", 3)}
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
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default MdsOperating;
