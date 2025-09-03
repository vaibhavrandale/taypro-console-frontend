import React, { useEffect, useState } from "react";

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
import { clients } from "../../../data";
import socket from "../../../components/Socket";

// const socket = io(); // backend socket server

const tabs = [
  // "Dashboard",
  // "Configuration",
  // "OTAA keys",
  // "Activation",
  // "Queue",
  "Events",
  // "LoRaWAN frames",
];

const MqttDashboard = () => {
  const [activeTab, setActiveTab] = useState("Events");
  const [frames, setFrames] = useState(() => {
    const saved = localStorage.getItem("localStorageFrames");
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedFrame, setSelectedFrame] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    socket.on("event", (msg) => {
      setFrames((prev) => {
        const updated = [msg, ...prev].slice(0, 40); // keep latest 20
        localStorage.setItem("localStorageFrames", JSON.stringify(updated)); // sync with storage
        return updated;
      });
    });

    return () => {
      socket.off("event");
    };
  }, []);

  const handleFrameClick = (frame) => {
    setSelectedFrame(frame);
    setVisible(true);
  };
  // console.log(frames);

  return (
    <div className="">
      {/* Tabs */}
      <div className="border-bottom mb-3">
        <div className="d-flex gap-3 fw-medium small">
          {tabs.map((tab) => (
            <span
              key={tab}
              className={`pb-2 cursor-pointer ${
                activeTab === tab
                  ? "text-primary border-bottom border-primary"
                  : "text-secondary"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </span>
          ))}
        </div>
      </div>

      {/* LoRaWAN Frames Section */}
      {activeTab === "Events" && (
        <div className="d-flex flex-column gap-3">
          {frames?.map((frame, idx) => (
            <CCard
              key={idx}
              className="shadow-sm border-0"
              role="button"
              onClick={() => handleFrameClick(frame)}
            >
              <CCardBody>
                <CRow className="align-items-center g-2">
                  {/* Timestamp */}
                  <CCol xs={6} sm={4} md={3} className="d-flex flex-column">
                    <span className="fw-semibold">
                      {frame.data?.deviceInfo.deviceName}
                    </span>
                    <span className="text-muted">
                      {new Date(frame.data?.time).toLocaleString("en-GB", {
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
                        : "Unconfirmed"}
                    </CBadge>
                  </CCol>
                  {frame.topic?.endsWith("/up") && (
                    <>
                      {/* DR */}
                      <CCol xs={6} sm={2} md={1} className="text-truncate">
                        <strong>DR:</strong> {frame.data?.dr}
                      </CCol>

                      {/* Data */}
                      <CCol xs={6} sm={2} md={3} className="text-truncate">
                        <strong>Data:</strong> {frame.data?.data}
                      </CCol>

                      {/* FCnt */}
                      <CCol xs={6} sm={2} md={1} className="text-truncate">
                        <strong>FCnt:</strong> {frame.data?.fCnt}
                      </CCol>

                      {/* fPort */}
                      <CCol xs={6} sm={2} md={1} className="text-truncate">
                        <strong>fPort:</strong> {frame.data?.fPort}
                      </CCol>
                    </>
                  )}
                </CRow>
              </CCardBody>
            </CCard>
          ))}

          {frames.length === 0 && (
            <p className="text-muted text-center">No frames yet...</p>
          )}
        </div>
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
                {selectedFrame.data?.deviceInfo.deviceName}&nbsp;(
                {selectedFrame.data?.deviceInfo.devEui})
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
              {/* General Frame Info */}
              <CCard className="shadow-sm border-0 rounded-3">
                <CCardBody>
                  <h6 className="fw-bold mb-3 text-secondary">
                    <CIcon icon={cilInfo} className="me-2 text-primary" />
                    General
                  </h6>
                  <div className="d-flex flex-column  gap-2">
                    <div>
                      <strong>Topic:</strong> {selectedFrame.topic}
                    </div>
                    <div>
                      <strong>Event Type:</strong>{" "}
                      {selectedFrame.topic.split("/").pop()}
                    </div>
                    <div>
                      <strong>Frame Time:</strong> {selectedFrame.data?.time}
                    </div>
                    <div>
                      <strong>Outer Time:</strong> {selectedFrame.time}
                    </div>
                    <div>
                      <strong>Deduplication ID:</strong>{" "}
                      {selectedFrame.data?.deduplicationId}
                    </div>
                    <div>
                      <strong>Region Config:</strong>{" "}
                      {selectedFrame.data?.regionConfigId}
                    </div>
                  </div>
                </CCardBody>
              </CCard>

              {/* Device Info */}
              <CCard className="shadow-sm border-0 rounded-3">
                <CCardBody>
                  <h6 className="fw-bold mb-3 text-secondary">
                    <CIcon icon={cilDevices} className="me-2 text-primary" />
                    Device Info
                  </h6>
                  <div className="d-flex flex-column gap-2">
                    <span>
                      <strong>Device Name:</strong>{" "}
                      {selectedFrame.data?.deviceInfo?.deviceName}
                    </span>
                    <span>
                      <strong>DevEUI:</strong>{" "}
                      <CBadge color="warning">
                        {selectedFrame.data?.deviceInfo?.devEui}
                      </CBadge>
                    </span>
                    <span>
                      <strong>Device Profile:</strong>{" "}
                      {selectedFrame.data?.deviceInfo?.deviceProfileName}
                    </span>
                    <span>
                      <strong>Device Profile ID:</strong>{" "}
                      {selectedFrame.data?.deviceInfo?.deviceProfileId}
                    </span>
                    <span>
                      <strong>Device Class:</strong>{" "}
                      <CBadge color="warning">
                        {selectedFrame.data?.deviceInfo?.deviceClassEnabled}
                      </CBadge>
                    </span>
                    <span>
                      <strong>Tenant:</strong>{" "}
                      {selectedFrame.data?.deviceInfo?.tenantName} (
                      {selectedFrame.data?.deviceInfo?.tenantId})
                    </span>
                    <span>
                      <strong>Application:</strong>{" "}
                      {selectedFrame.data?.applicationName} (
                      {selectedFrame.data?.applicationId})
                    </span>
                    <span>
                      <strong>Tags:</strong>{" "}
                      {JSON.stringify(selectedFrame.data?.deviceInfo?.tags)}
                    </span>
                  </div>
                </CCardBody>
              </CCard>

              {/* Frame Info */}
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
                      <strong>DevAddr:</strong> {selectedFrame.data?.devAddr}
                    </div>
                    <div>
                      <strong>ADR:</strong> {String(selectedFrame.data?.adr)}
                    </div>
                    <div>
                      <strong>DR:</strong> {selectedFrame.data?.dr}
                    </div>
                    <div>
                      <strong>FCnt:</strong> {selectedFrame.data?.fCnt}
                    </div>
                    <div>
                      <strong>FPort:</strong> {selectedFrame.data?.fPort}
                    </div>
                    <div>
                      <strong>Confirmed:</strong>{" "}
                      {String(selectedFrame.data?.confirmed)}
                    </div>
                    <div>
                      <strong>Payload:</strong>{" "}
                      <CBadge color="success">
                        {selectedFrame.data?.data}
                      </CBadge>
                    </div>
                  </div>
                </CCardBody>
              </CCard>

              {/* Gateway Info */}
              {selectedFrame.data?.rxInfo?.map((gw, i) => (
                <CCard key={i} className="shadow-sm border-0 rounded-3">
                  <CCardBody>
                    <h6 className="fw-bold mb-3 text-secondary">
                      <CIcon icon={cilRouter} className="me-2 text-primary" />
                      Gateway #{i + 1}
                    </h6>
                    <div className="d-flex flex-column gap-2">
                      <span>
                        <strong>Gateway ID:</strong> {gw.gatewayId}
                      </span>
                      <span>
                        <strong>Uplink ID:</strong> {gw.uplinkId}
                      </span>
                      <span>
                        <strong>Gateway Time:</strong> {gw.gwTime}
                      </span>
                      <span>
                        <strong>NS Time:</strong> {gw.nsTime}
                      </span>
                      <span>
                        <strong>RSSI:</strong>{" "}
                        <CBadge color="danger">{gw.rssi}</CBadge>
                      </span>
                      <span>
                        <strong>SNR:</strong>{" "}
                        <CBadge color="warning">{gw.snr}</CBadge>
                      </span>
                      <span>
                        <strong>Channel:</strong> {gw.channel}
                      </span>
                      <span>
                        <strong>RF Chain:</strong> {gw.rfChain}
                      </span>
                      <span>
                        <strong>CRC Status:</strong> {gw.crcStatus}
                      </span>
                      <span>
                        <strong>Context:</strong> {gw.context}
                      </span>
                      <span>
                        <strong>Location:</strong>{" "}
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

              {/* TX Info */}
              <CCard className="shadow-sm border-0 rounded-3">
                <CCardBody>
                  <h6 className="fw-bold mb-3 text-secondary">
                    <CIcon icon={clients} className="me-2 text-primary" />
                    TX Info
                  </h6>
                  <div className="d-flex flex-column gap-2">
                    <span>
                      <strong>Frequency:</strong>{" "}
                      {selectedFrame.data?.txInfo?.frequency}
                    </span>
                    <span>
                      <strong>Bandwidth:</strong>{" "}
                      {selectedFrame.data?.txInfo?.modulation?.lora?.bandwidth}
                    </span>
                    <span>
                      <strong>Spreading Factor:</strong>{" "}
                      {
                        selectedFrame.data?.txInfo?.modulation?.lora
                          ?.spreadingFactor
                      }
                    </span>
                    <span>
                      <strong>Code Rate:</strong>{" "}
                      {selectedFrame.data?.txInfo?.modulation?.lora?.codeRate}
                    </span>
                  </div>
                </CCardBody>
              </CCard>

              {/* Raw JSON */}
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
            </div>
          )}
        </COffcanvasBody>
      </COffcanvas>
    </div>
  );
};

export default MqttDashboard;
