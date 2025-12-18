import React from "react";
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CBadge,
  CCard,
  CCardBody,
  CRow,
  CCol,
  CImage,
  CButton,
} from "@coreui/react";
import {
  Wifi,
  Network,
  MapPin,
  Server,
  Tag,
  Clock,
  Radio,
  Hash,
  Bot,
  Signal,
} from "lucide-react";
import IndoorGateway from "../assets/images/indoor_gateway.jpg";
import OutdoorGateway from "../assets/images/outdoor_gateway.jpg";
import { cilX } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { Link } from "react-router-dom";

const GatewayModel = ({ gateway, visible, onClose }) => {
  if (!gateway) return null;

  const isIndoor = gateway.gateway_type === "Indoor";
  const gatewayImage = isIndoor ? IndoorGateway : OutdoorGateway;

  return (
    <CModal
      backdrop="static"
      visible={visible}
      size="xl"
      alignment="center"
      onClose={onClose}
    >
      <CModalHeader closeButton={false}>
        <CModalTitle>{gateway.gateway_name}</CModalTitle>
        <CBadge
          color={gateway.gateway_status ? "success" : "danger"}
          className="ms-3"
        >
          {gateway.gateway_status ? "Online" : "Offline"}
        </CBadge>
        <button
          type="button"
          className="border-0 ms-auto py-0 px-1"
          onClick={onClose}
          style={{ background: "none" }}
          disabled={!visible}
        >
          <CIcon icon={cilX} size="lg" />
        </button>
      </CModalHeader>

      <CModalBody>
        {/* ===== OVERVIEW ===== */}
        <div className="gateway-overview-coreui">
          <CCard className="info-card top-left border-0">
            <CCardBody>
              <div className="d-flex align-items-center mb-3">
                <Network size={18} className="me-2 text-primary" />
                <h6 className="mb-0">Connectivity</h6>
              </div>

              <div className="status-row">
                <span className="status-label">
                  <Network size={15} className="me-2" />
                  Ethernet
                </span>
                <CBadge color="success" shape="rounded-pill">
                  Active
                </CBadge>
              </div>

              <div className="status-row">
                <span className="status-label">
                  <Wifi size={15} className="me-2" />
                  Wi-Fi AP
                </span>
                <CBadge color="warning" shape="rounded-pill">
                  Enabled
                </CBadge>
              </div>

              <div className="d-flex align-items-center mt-3">
                <MapPin size={15} className="me-2 text-muted" />
                <small className="">
                  Site : <span>{gateway.site_id}</span>
                </small>
              </div>
            </CCardBody>
          </CCard>

          <CCard className="info-card top-right border-0">
            <CCardBody>
              <div className="d-flex align-items-center mb-2">
                <Server size={18} className="me-2 text-primary" />
                <h6 className="mb-0">LNS</h6>
              </div>

              <small className="text-muted">Gateway ID</small>
              <div className="fw-semibold">
                {gateway.gateway_id_in_lns_server}
              </div>

              <div className="mt-2 d-flex align-items-center">
                <Tag size={14} className="me-2 text-muted" />
                <small>{gateway.gateway_name_in_lns_server}</small>
              </div>
            </CCardBody>
          </CCard>

          <div className="gateway-center-coreui">
            <CImage src={gatewayImage} width={200} />

            <h6 className="mt-3">{gateway.gateway_type} Gateway</h6>

            <small className="text-muted d-flex align-items-center">
              <Clock size={14} className="me-2" />
              Last update:
              <span className="ms-2">
                {new Date(gateway.last_uplink).toLocaleString()}
              </span>
            </small>

            <CBadge
              color={gateway.gateway_status ? "success" : "danger"}
              className="mt-2 px-3 py-1"
              shape="rounded-pill"
            >
              {gateway.gateway_status ? "Online" : "Offline"}
            </CBadge>
          </div>

          <CCard className="info-card bottom-left border-0">
            <CCardBody>
              <div className="d-flex align-items-center mb-2">
                <Radio size={18} className="me-2 text-primary" />
                <h6 className="mb-0">LoRa Details</h6>
              </div>

              <small className="text-muted">DevEUI</small>
              <div className="fw-semibold">{gateway.gateway_lora_deveui}</div>

              <div className="mt-2 d-flex align-items-center">
                <Hash size={14} className="me-2 text-muted" />
                <small>Lora No: {gateway.gateway_lora_no}</small>
              </div>
            </CCardBody>
          </CCard>

          <CCard className="info-card bottom-right border-0">
            <CCardBody>
              <div className="d-flex align-items-center mb-2">
                <Bot size={18} className="me-2 text-primary" />
                <h6 className="mb-0">Gateway Robot</h6>
              </div>

              <CBadge
                color={gateway.gateway_robot_no ? "success" : "secondary"}
                shape="rounded-pill"
                className="px-3 py-1"
              >
                {gateway.gateway_robot_no || "Not Assigned"}
              </CBadge>
            </CCardBody>
          </CCard>
        </div>

        {/* ===== LOCATION & SIM ===== */}
        {gateway.gateway_type === "Outdoor" && (
          <CRow className="mt-4">
            <CCol md={6}>
              <CCard>
                <CCardBody>
                  <h6 className="d-flex align-items-center">
                    <MapPin size={16} className="me-2 text-primary" />
                    Location
                  </h6>
                  <Link
                    target="blank"
                    to={`https://www.google.com/maps/search/?api=1&query=${gateway.gateway_longitude},${gateway.gateway_lattitude}`}
                  >
                    View on Map
                  </Link>
                </CCardBody>
              </CCard>
            </CCol>

            <CCol md={6}>
              <CCard>
                <CCardBody>
                  <h6 className="d-flex align-items-center">
                    <Signal size={16} className="me-2 text-primary" />
                    SIM Information
                  </h6>
                  <p className="mb-0">{gateway.gateway_simnumber || "N/A"}</p>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        )}

        {/* ===== FOOTER ===== */}
        <div className="text-end mt-4">
          <CButton size="sm" color="secondary" onClick={onClose}>
            Close
          </CButton>
        </div>
      </CModalBody>
    </CModal>
  );
};

export default GatewayModel;
