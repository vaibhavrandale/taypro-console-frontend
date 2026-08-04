import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
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
import { Clipboard } from "lucide-react";
import socket from "../../../components/Socket";

const MdsEventAndFrames = () => {
  const { mds_no, deveui } = useParams();
  const [activeTab, setActiveTab] = useState("Events");
  const [frames, setFrames] = useState(() => {
    const saved = localStorage.getItem("mdsFrames");
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedFrame, setSelectedFrame] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    socket.on("event", (msg) => {
      console.log("mdsFrames" + socket.id);

      // Only add frames matching the current devEui or no-data response
      if (msg.data?.deviceInfo?.devEui === deveui || msg.topic === "no-data") {
        setFrames((prev) => {
          const updated = [msg, ...prev].slice(0, 20); // keep latest 20
          localStorage.setItem("mdsFrames", JSON.stringify(updated)); // sync with storage
          return updated;
        }); // newest on top
      }
    });

    return () => {
      socket.off("event");
    };
  }, [deveui]); // Add deveui as a dependency

  const handleFrameClick = (frame) => {
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
  function base64ToHex(base64Str) {
    const binaryString = atob(base64Str);
    return Array.from(binaryString, (char) => {
      return char.charCodeAt(0).toString(16).padStart(2, "0");
    }).join("");
  }

  function base64ToAscii(base64Str) {
    const binaryString = atob(base64Str); // decode Base64 to binary string
    return Array.from(binaryString, (char) =>
      // replace non-printable characters with "."
      char.charCodeAt(0) >= 32 && char.charCodeAt(0) <= 126 ? char : "."
    ).join("");
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
                <span className="text-warning p-2 fs-6">{mds_no}</span> -{" "}
                <span className="fs-5">&nbsp;{tab}</span>
              </span>
            ))}
          </div>
        </div>

        {/* LoRaWAN Frames Section */}
        {activeTab === "Events" && (
          <div className="d-flex flex-column gap-2">
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
                        {/* Data */}
                        <CCol xs={6} sm={2} md={2} className="text-truncate">
                          <span className="text-success">HEX:</span>&nbsp;
                          {base64ToHex(frame.data?.data)}
                        </CCol>
                        {/* Data */}
                        <CCol xs={6} sm={2} md={2} className="text-truncate">
                          <span className="text-success">ASCII:</span>&nbsp;
                          {base64ToAscii(frame.data?.data)}
                        </CCol>
                        {/* DR */}
                        <CCol xs={6} sm={2} md={1} className="text-truncate">
                          <span className="text-success">DR:</span>{" "}
                          {frame.data?.dr}
                        </CCol>

                        {/* FCnt */}
                        <CCol xs={6} sm={2} md={1} className="text-truncate">
                          <span className="text-success">FCnt:</span>{" "}
                          {frame.data?.fCnt}
                        </CCol>

                        {/* fPort */}
                        <CCol xs={6} sm={2} md={1} className="text-truncate">
                          <span className="text-success">fPort:</span>{" "}
                          {frame.data?.fPort}
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
                        <span>Topic:</span> {selectedFrame.topic}
                      </div>
                      <div>
                        <span>Event Type:</span>{" "}
                        {selectedFrame.topic.split("/").pop()}
                      </div>
                      <div>
                        <span>Frame Time:</span> {selectedFrame.data?.time}
                      </div>
                      <div>
                        <span>Outer Time:</span> {selectedFrame.time}
                      </div>
                      <div>
                        <span>Deduplication ID:</span>{" "}
                        {selectedFrame.data?.deduplicationId}
                      </div>
                      <div>
                        <span>Region Config:</span>{" "}
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
                        <span>Device Name:</span>{" "}
                        {selectedFrame.data?.deviceInfo?.deviceName}
                      </span>
                      <span>
                        <span>DevEUI:</span>{" "}
                        <CBadge color="warning">
                          {selectedFrame.data?.deviceInfo?.devEui}
                        </CBadge>
                      </span>
                      <span>
                        <span>Device Profile:</span>{" "}
                        {selectedFrame.data?.deviceInfo?.deviceProfileName}
                      </span>
                      <span>
                        <span>Device Profile ID:</span>{" "}
                        {selectedFrame.data?.deviceInfo?.deviceProfileId}
                      </span>
                      <span>
                        <span>Device Class:</span>{" "}
                        <CBadge color="warning">
                          {selectedFrame.data?.deviceInfo?.deviceClassEnabled}
                        </CBadge>
                      </span>
                      <span>
                        <span>Tenant:</span>{" "}
                        {selectedFrame.data?.deviceInfo?.tenantName} (
                        {selectedFrame.data?.deviceInfo?.tenantId})
                      </span>
                      <span>
                        <span>Application:</span>{" "}
                        {selectedFrame.data?.applicationName} (
                        {selectedFrame.data?.applicationId})
                      </span>
                      <span>
                        <span>Tags:</span>{" "}
                        {JSON.stringify(selectedFrame.data?.deviceInfo?.tags)}
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
                          <span>DevAddr:</span> {selectedFrame.data?.devAddr}
                        </div>
                        <div>
                          <span>ADR:</span> {String(selectedFrame.data?.adr)}
                        </div>
                        <div>
                          <span>DR:</span> {selectedFrame.data?.dr}
                        </div>
                        <div>
                          <span>FCnt:</span> {selectedFrame.data?.fCnt}
                        </div>
                        <div>
                          <span>FPort:</span> {selectedFrame.data?.fPort}
                        </div>
                        <div>
                          <span>Confirmed:</span>{" "}
                          {String(selectedFrame.data?.confirmed)}
                        </div>
                        <div className="card shadow-sm p-3 mb-3 rounded-3">
                          <h6 className="text-success mb-3">
                            📦 Payload Details
                          </h6>

                          <div className="row">
                            {/* Base64 */}
                            <div className="col-md-4 mb-2">
                              <span className="fw-bold text-success">
                                Base64 (original):
                              </span>
                              <div className="bg-dark text-warning rounded p-2 mt-1 small">
                                {selectedFrame.data?.data || "-"}
                              </div>
                            </div>

                            {/* HEX */}
                            <div className="col-md-4 mb-2">
                              <span className="fw-bold text-success">HEX:</span>
                              <div className="bg-dark text-light rounded p-2 mt-1 small">
                                {base64ToHex(selectedFrame.data?.data) || "-"}
                              </div>
                            </div>

                            {/* ASCII */}
                            <div className="col-md-4 mb-2">
                              <span className="fw-bold text-success">
                                ASCII:
                              </span>
                              <div className="bg-dark text-info rounded p-2 mt-1 small">
                                {base64ToAscii(selectedFrame.data?.data) || "-"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CCardBody>
                  </CCard>
                )}
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

                {/* TX Info */}
                <CCard className="shadow-sm border-0 rounded-3">
                  <CCardBody>
                    <h6 className="fw-bold mb-3 text-secondary">
                      <CIcon icon={Clipboard} className="me-2 text-primary" />
                      TX Info
                    </h6>
                    <div className="d-flex flex-column gap-2">
                      <span>
                        <span>Frequency:</span>{" "}
                        {selectedFrame.data?.txInfo?.frequency}
                      </span>
                      <span>
                        <span>Bandwidth:</span>{" "}
                        {
                          selectedFrame.data?.txInfo?.modulation?.lora
                            ?.bandwidth
                        }
                      </span>
                      <span>
                        <span>Spreading Factor:</span>{" "}
                        {
                          selectedFrame.data?.txInfo?.modulation?.lora
                            ?.spreadingFactor
                        }
                      </span>
                      <span>
                        <span>Code Rate:</span>{" "}
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
    </div>
  );
};

export default MdsEventAndFrames;
