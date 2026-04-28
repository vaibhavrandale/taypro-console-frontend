import React, { useEffect, useReducer, useState } from "react";
import {
  CCard,
  CCardBody,
  COffcanvas,
  COffcanvasBody,
  COffcanvasHeader,
  COffcanvasTitle,
  CBadge,
  CCol,
  CRow,
  CAlert,
} from "@coreui/react";
import {
  cilCode,
  cilDataTransferDown,
  cilDevices,
  cilInfo,
  cilRouter,
  cilX,
} from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { Clipboard } from "lucide-react";
import socket from "../../../components/Socket";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { decodeRobotPayload } from "../../../components/robotPayloadDecoder";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };

    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        frames:
          typeof action.payload === "function"
            ? action.payload(state.frames)
            : action.payload,
      };

    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

const MqttDashboard = () => {
  const [{ loading, error, frames }, dispatch] = useReducer(reducer, {
    frames: [],
    loading: true,
    error: "",
  });
  // const { robot_no, deveui } = useParams();
  const [activeTab, setActiveTab] = useState("Events");

  const [selectedFrame, setSelectedFrame] = useState(null);
  const [visible, setVisible] = useState(false);

  // const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      dispatch({ type: "FETCH_REQUEST" });

      try {
        const response = await axios.get(`/api/v1/mqtt-event-logs`, {
          // headers: { Authorization: `Bearer ${authtoken}` },
          withCredentials: true,
        });

        const result = response.data.data;
        dispatch({
          type: "FETCH_SUCCESS",
          payload: result,
        });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: error.response?.data?.message || error.response?.data?.error,
        });
        toast.error(
          error.response?.data?.message || error.response?.data?.error,
        );
      }
    };
    fetchSubscriptions();
  }, []);
  useEffect(() => {
    socket.emit("event");
  }, []);

  useEffect(() => {
    const handleEvent = (msg) => {
      if (msg) {
        dispatch({
          type: "FETCH_SUCCESS",
          payload: (prev) => [msg, ...prev].slice(0, 20),
        });
      }
    };

    socket.on("event", handleEvent);
    return () => socket.off("event", handleEvent);
  }, []);

  const handleFrameClick = (frame) => {
    console.log("--------------opened frame---------");
    console.log(frame);
    console.log("--------------opened frame---------");
    setSelectedFrame(frame);
    setVisible(true);
  };

  const tabs = [
    // "Dashboard",
    // "Configuration",
    // "OTAA keys",
    // "Activation",
    // "Queue",
    "Events",
    // "LoRaWAN frames",
  ];
  function isValidBase64(str) {
    if (!str || typeof str !== "string") return false;

    // Remove whitespace
    const s = str.trim();

    // Base64 regex (handles padding)
    return /^[A-Za-z0-9+/]+={0,2}$/.test(s) && s.length % 4 === 0;
  }

  function base64ToHex(base64Str) {
    if (!isValidBase64(base64Str)) return "-";

    try {
      const binaryString = atob(base64Str);
      return Array.from(binaryString, (char) =>
        char.charCodeAt(0).toString(16).padStart(2, "0"),
      ).join("");
    } catch {
      return "-";
    }
  }

  function base64ToAscii(base64Str) {
    if (!isValidBase64(base64Str)) return "-";

    try {
      const binaryString = atob(base64Str);
      return Array.from(binaryString, (char) =>
        char.charCodeAt(0) >= 32 && char.charCodeAt(0) <= 126 ? char : ".",
      ).join("");
    } catch {
      return "-";
    }
  }

  function resolveEventType(topic) {
    if (topic.includes("/event/up")) return "up";
    if (topic.includes("/event/join")) return "join";
    if (topic.includes("/event/ack")) return "ack";
    if (topic.includes("/event/txack")) return "txack";
    if (topic.includes("/event/error")) return "error";
    if (topic.includes("/event/log")) return "log";
    if (topic.startsWith("application/")) return "raw";
    return "unknown";
  }

  return (
    <div>
      <div className="">
        {/* Tabs */}
        <div className="border-bottom mb-3">
          <div className="d-flex gap-3 fw-medium small">
            {tabs.map((tab) => (
              <span
                key={tab}
                className={`pb-2 cursor-pointer ${
                  activeTab === tab ? " border-bottom border-warning" : ""
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {/* <span className="text-warning p-2 fs-6">{robot_no}</span> -{" "} */}
                <span className="fs-5">&nbsp;{tab}</span>
              </span>
            ))}
          </div>
        </div>

        {/* LoRaWAN Frames Section */}
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <CAlert color="danger">{error}</CAlert>
        ) : (
          activeTab === "Events" && (
            <div className="d-flex flex-column gap-2">
              {frames.map((frame, idx) => {
                const decoded = decodeRobotPayload(
                  frame.payload?.data || frame.data?.data,
                );

                return (
                  <CCard
                    key={idx}
                    className="shadow-sm border-0"
                    role="button"
                    onClick={() => handleFrameClick(frame)}
                  >
                    <CCardBody>
                      <CRow className="align-items-center g-2">
                        {/* Timestamp */}
                        <CCol xs={6} sm={2} md={3} className="">
                          <span className="text-success">
                            {frame.payload?.deviceInfo?.deviceName ||
                              frame.data?.deviceInfo?.deviceName}
                          </span>
                        </CCol>
                        <CCol
                          xs={6}
                          sm={4}
                          md={3}
                          className="d-flex flex-column"
                        >
                          <span className="text-muted">
                            {new Date(
                              frame.createdAt || frame.time,
                            ).toLocaleString("en-GB", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                              hour12: true,
                            })}
                          </span>
                        </CCol>

                        {/* Badge */}
                        <CCol xs={6} sm={4} md={1}>
                          <CBadge
                            className="fs-7"
                            color={
                              frame.topic?.endsWith("/up")
                                ? "success"
                                : frame.topic?.endsWith("/join")
                                  ? "warning"
                                  : frame.topic?.endsWith("/txack")
                                    ? "secondary"
                                    : frame.topic?.endsWith("/ack")
                                      ? "secondary"
                                      : frame.topic?.endsWith("/error")
                                        ? "danger"
                                        : frame.topic?.endsWith("/log")
                                          ? "primary"
                                          : frame.topic?.endsWith("/status")
                                            ? "primary"
                                            : "secondary"
                            }
                          >
                            {frame.topic?.endsWith("/up")
                              ? "Up"
                              : frame.topic?.endsWith("/join")
                                ? "Join"
                                : frame.topic?.endsWith("/txack")
                                  ? "TxAck"
                                  : frame.topic?.endsWith("/ack")
                                    ? "Ack"
                                    : frame.topic?.endsWith("/error")
                                      ? "Error"
                                      : frame.topic?.endsWith("/log")
                                        ? "Log"
                                        : frame.topic?.endsWith("/status")
                                          ? "Status"
                                          : "Unconfirmed"}
                          </CBadge>
                        </CCol>
                        {frame.topic?.endsWith("/up") && (
                          <>
                            <CCol xs={6} sm={2} md={2} className="">
                              <CBadge
                                color={
                                  decoded.type === "robot_alert"
                                    ? "warning"
                                    : decoded.type === "metric"
                                      ? "primary"
                                      : decoded.type === "battery"
                                        ? "success"
                                        : decoded.type === "cleaning"
                                          ? "warning"
                                          : decoded.type === "tracking"
                                            ? "danger"
                                            : decoded.type === "reset"
                                              ? "warning"
                                              : "secondary"
                                }
                              >
                                {decoded.description}

                                {decoded.dynamic &&
                                  decoded.unit &&
                                  decoded.value !== undefined && (
                                    <span className="ms-1">
                                      {decoded.value}
                                      {decoded.unit}
                                    </span>
                                  )}
                              </CBadge>
                            </CCol>

                            {/* <CCol xs={6} sm={2} md={2} className="text-truncate">
                            <span className="text-success">HEX:</span>&nbsp;
                            {base64ToHex(frame.payload?.data)}
                          </CCol>
                       
                          <CCol xs={6} sm={2} md={2} className="text-truncate">
                            <span className="text-success">ASCII:</span>&nbsp;
                            {base64ToAscii(frame.payload?.data)}
                          </CCol> */}

                            {/* <CCol
                              xs={6}
                              sm={2}
                              md={1}
                              className="text-truncate"
                            >
                              <span className="text-success">DR:</span>{" "}
                              {frame.payload?.dr || frame.data?.dr}
                            </CCol>

                      
                            <CCol
                              xs={6}
                              sm={2}
                              md={1}
                              className="text-truncate"
                            >
                              <span className="text-success">FCnt:</span>{" "}
                              {frame.payload?.fCnt || frame.data?.fCnt}
                            </CCol>

                         
                            <CCol
                              xs={6}
                              sm={2}
                              md={1}
                              className="text-truncate"
                            >
                              <span className="text-success">fPort:</span>{" "}
                              {frame.payload?.fPort || frame.data?.fPort}
                            </CCol> */}
                          </>
                        )}
                      </CRow>
                    </CCardBody>
                  </CCard>
                );
              })}

              {frames.length === 0 && (
                <p className="text-muted text-center">No frames yet...</p>
              )}
            </div>
          )
        )}

        <COffcanvas
          placement="end"
          visible={visible}
          onHide={() => setVisible(false)}
          style={{
            width: "100%",
            maxWidth: window.innerWidth < 768 ? "100%" : "42%", // full width on small screens
          }}
        >
          <COffcanvasHeader>
            <COffcanvasTitle className="">
              {selectedFrame && (
                <span>
                  {selectedFrame.payload?.deviceInfo.deviceName ||
                    selectedFrame.data?.deviceInfo.deviceName}
                  &nbsp;(
                  {selectedFrame.payload?.deviceInfo.devEui ||
                    selectedFrame.data?.deviceInfo.devEui}
                  )
                </span>
              )}
            </COffcanvasTitle>
            <button
              type="button"
              className="border-0 ms-auto py-0 px-1"
              onClick={() => setVisible(false)}
              style={{ background: "none" }}
            >
              <CIcon icon={cilX} size="lg" />
            </button>
          </COffcanvasHeader>

          <COffcanvasBody>
            {selectedFrame && (
              <div className="d-flex flex-column gap-4">
                <CCard className="shadow-sm border-0 rounded-3">
                  <CCardBody>
                    <h6 className="fw-bold mb-3 text-secondary">
                      <CIcon icon={cilInfo} className="me-2 text-primary" />
                      General
                    </h6>
                    <div className="d-flex flex-column  gap-2">
                      <div>
                        <span>Topic:</span> {selectedFrame.topic}
                      </div>
                      <div>
                        <span>Event Type:</span>{" "}
                        {resolveEventType(selectedFrame.topic)}
                      </div>
                      <div>
                        <span>Frame Time:</span>{" "}
                        {selectedFrame.createdAt || selectedFrame.time}
                      </div>
                      <div>
                        <span>Outer Time:</span>{" "}
                        {selectedFrame.createdAt || selectedFrame.time}
                      </div>
                      <div>
                        <span>Deduplication ID:</span>{" "}
                        {selectedFrame.payload?.deduplicationId ||
                          selectedFrame.data?.deduplicationId}
                      </div>
                      <div>
                        <span>Region Config:</span>{" "}
                        {selectedFrame.payload?.regionConfigId ||
                          selectedFrame.data?.regionConfigId}
                      </div>
                    </div>
                  </CCardBody>
                </CCard>

                <CCard className="shadow-sm border-0 rounded-3">
                  <CCardBody>
                    <h6 className="fw-bold mb-3 text-secondary">
                      <CIcon icon={cilDevices} className="me-2 text-primary" />
                      Device Info
                    </h6>
                    <div className="d-flex flex-column gap-2">
                      <span>
                        <span>Device Name:</span>{" "}
                        {selectedFrame.payload?.deviceInfo?.deviceName ||
                          selectedFrame.data?.deviceInfo?.deviceName}
                      </span>
                      <span>
                        <span>DevEUI:</span>{" "}
                        <CBadge color="warning">
                          {selectedFrame.payload?.deviceInfo?.devEui ||
                            selectedFrame.data?.deviceInfo?.devEui}
                        </CBadge>
                      </span>
                      <span>
                        <span>Device Profile:</span>{" "}
                        {selectedFrame.payload?.deviceInfo?.deviceProfileName ||
                          selectedFrame.data?.deviceInfo?.deviceProfileName}
                      </span>
                      <span>
                        <span>Device Profile ID:</span>{" "}
                        {selectedFrame.payload?.deviceInfo?.deviceProfileId ||
                          selectedFrame.data?.deviceInfo?.deviceProfileId}
                      </span>
                      <span>
                        <span>Device Class:</span>{" "}
                        <CBadge color="warning">
                          {selectedFrame.payload?.deviceInfo
                            ?.deviceClassEnabled ||
                            selectedFrame.data?.deviceInfo?.deviceClassEnabled}
                        </CBadge>
                      </span>
                      <span>
                        <span>Tenant:</span>{" "}
                        {selectedFrame.payload?.deviceInfo?.tenantName ||
                          selectedFrame.data?.deviceInfo?.tenantName}{" "}
                        (
                        {selectedFrame.payload?.deviceInfo?.tenantId ||
                          selectedFrame.data?.deviceInfo?.tenantId}
                        )
                      </span>
                      <span>
                        <span>Application:</span>{" "}
                        {selectedFrame.payload?.deviceInfo.applicationName ||
                          selectedFrame.data?.deviceInfo.applicationName}{" "}
                        (
                        {selectedFrame.payload?.deviceInfo.applicationId ||
                          selectedFrame.data?.deviceInfo.applicationId}{" "}
                        )
                      </span>
                      <span>
                        <span>Tags:</span>{" "}
                        {JSON.stringify(
                          selectedFrame.payload?.deviceInfo?.tags,
                        )}
                      </span>
                    </div>
                  </CCardBody>
                </CCard>

                {selectedFrame.topic?.endsWith("/up") && (
                  <CCard className="shadow-sm border-0 rounded-3">
                    <CCardBody>
                      <h6 className="fw-bold mb-3 text-secondary">
                        <CIcon
                          icon={cilDataTransferDown}
                          className="me-2 text-primary"
                        />
                        Frame Info
                      </h6>
                      <div className="d-flex flex-wrap  flex-column gap-1">
                        <div>
                          <span>DevAddr:</span>{" "}
                          {selectedFrame.payload?.devAddr ||
                            selectedFrame.data?.devAddr}
                        </div>
                        <div>
                          <span>ADR:</span>{" "}
                          {String(
                            selectedFrame.payload?.adr ||
                              selectedFrame.data?.adr,
                          )}
                        </div>
                        <div>
                          <span>DR:</span>{" "}
                          {selectedFrame.payload?.dr || selectedFrame.data?.dr}
                        </div>
                        <div>
                          <span>FCnt:</span>{" "}
                          {selectedFrame.payload?.fCnt ||
                            selectedFrame.data?.fCnt}
                        </div>
                        <div>
                          <span>FPort:</span>{" "}
                          {selectedFrame.payload?.fPort ||
                            selectedFrame.data?.fPort}
                        </div>
                        <div>
                          <span>Confirmed:</span>{" "}
                          {String(
                            selectedFrame.payload?.confirmed ||
                              selectedFrame.data?.confirmed,
                          )}
                        </div>
                        <div className="card shadow-sm p-3 mb-3 rounded-3">
                          <h6 className="text-success mb-3">
                            📦 Payload Details
                          </h6>

                          <div className="row">
                            <div className="col-md-4 mb-2">
                              <span className="fw-bold text-success">
                                Base64 (original):
                              </span>
                              <div className="bg-dark text-warning rounded p-2 mt-1 small">
                                {selectedFrame.payload?.data ||
                                  selectedFrame.data?.data}
                              </div>
                            </div>

                            <div className="col-md-4 mb-2">
                              <span className="fw-bold text-success">HEX:</span>
                              <div className="bg-dark text-light rounded p-2 mt-1 small">
                                {base64ToHex(selectedFrame.payload?.data) ||
                                  base64ToHex(selectedFrame.data?.data)}
                              </div>
                            </div>

                            <div className="col-md-4 mb-2">
                              <span className="fw-bold text-success">
                                ASCII:
                              </span>
                              <div className="bg-dark text-info rounded p-2 mt-1 small">
                                {base64ToAscii(selectedFrame.payload?.data) ||
                                  base64ToAscii(selectedFrame.data?.data)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CCardBody>
                  </CCard>
                )}

                {(
                  selectedFrame.payload?.rxInfo || selectedFrame.data?.rxInfo
                )?.map((gw, i) => (
                  <CCard key={i} className="shadow-sm border-0 rounded-3">
                    <CCardBody>
                      <h6 className="fw-bold mb-3 text-secondary">
                        <CIcon icon={cilRouter} className="me-2 text-primary" />
                        Gateway #{i + 1}
                      </h6>
                      <div className="d-flex flex-column gap-2">
                        <span>
                          <span>Gateway ID:</span> {gw.gatewayId}
                        </span>
                        <span>
                          <span>Uplink ID:</span> {gw.uplinkId}
                        </span>
                        <span>
                          <span>Gateway Time:</span> {gw.gwTime}
                        </span>
                        <span>
                          <span>NS Time:</span> {gw.nsTime}
                        </span>
                        <span>
                          <span>RSSI:</span>{" "}
                          <CBadge color="danger">{gw.rssi}</CBadge>
                        </span>
                        <span>
                          <span>SNR:</span>{" "}
                          <CBadge color="warning">{gw.snr}</CBadge>
                        </span>
                        <span>
                          <span>Channel:</span> {gw.channel}
                        </span>
                        <span>
                          <span>RF Chain:</span> {gw.rfChain}
                        </span>
                        <span>
                          <span>CRC Status:</span> {gw.crcStatus}
                        </span>
                        <span>
                          <span>Context:</span> {gw.context}
                        </span>
                        <span>
                          <span>Location:</span>{" "}
                          <a
                            href={`https://maps.google.com/?q=${gw.location?.latitude},${gw.location?.longitude}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {gw.location?.latitude}, {gw.location?.longitude}{" "}
                            (Alt: {gw.location?.altitude})
                          </a>
                        </span>
                      </div>
                    </CCardBody>
                  </CCard>
                ))}

                <CCard className="shadow-sm border-0 rounded-3">
                  <CCardBody>
                    <h6 className="fw-bold mb-3 text-secondary">
                      <Clipboard size={18} className="text-primary" />
                      TX Info
                    </h6>
                    <div className="d-flex flex-column gap-2">
                      <span>
                        <span>Frequency:</span>{" "}
                        {selectedFrame.payload?.txInfo?.frequency ||
                          selectedFrame.data?.txInfo?.frequency}
                      </span>
                      <span>
                        <span>Bandwidth:</span>{" "}
                        {selectedFrame.payload?.txInfo?.modulation?.lora
                          ?.bandwidth ||
                          selectedFrame.data?.txInfo?.modulation?.lora
                            ?.bandwidth}
                      </span>
                      <span>
                        <span>Spreading Factor:</span>{" "}
                        {
                          selectedFrame.payload?.txInfo?.modulation?.lora
                            ?.spreadingFactor
                        }
                      </span>
                      <span>
                        <span>Code Rate:</span>{" "}
                        {
                          selectedFrame.payload?.txInfo?.modulation?.lora
                            ?.codeRate
                        }
                      </span>
                    </div>
                  </CCardBody>
                </CCard>

                {userInfo.role?.includes("Admin") && (
                  <CCard className="shadow-sm border-0 rounded-3">
                    <CCardBody style={{ maxHeight: "35vh", overflowY: "auto" }}>
                      <h6 className="fw-bold mb-3 text-secondary">
                        <CIcon icon={cilCode} className="me-2 text-primary" />
                        Raw JSON
                      </h6>
                      <pre className="bg-dark text-light p-3 rounded small">
                        {JSON.stringify(selectedFrame, null, 2)}
                      </pre>
                    </CCardBody>
                  </CCard>
                )}
              </div>
            )}
          </COffcanvasBody>
        </COffcanvas>
      </div>
    </div>
  );
};

export default MqttDashboard;
