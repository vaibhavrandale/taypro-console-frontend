import { CCard, CCardBody, CRow, CCol, CBadge } from "@coreui/react";
import Gauge from "../../components/Gauge";

const InverterPanel = ({ site, inv }) => {
  return (
    <CCard
      className="border-0"
      style={{
        background: "linear-gradient(180deg, #0b1224, #020617)",
      }}
    >
      <CCardBody className="py-3 px-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center gap-2">
            <strong className="text-white">{inv.invertor}</strong>
            <CBadge
              color="success"
              shape="rounded-pill"
              style={{ fontSize: 10 }}
            >
              ONLINE
            </CBadge>
          </div>

          <CBadge color="warning" shape="rounded-pill" style={{ fontSize: 10 }}>
            {site.site_id}
          </CBadge>
        </div>

        {/* Gauges */}
        <CRow className="text-center">
          <CCol md={4}>
            <Gauge
              value={inv.voltage}
              max={1000}
              label="VOLTAGE"
              unit="V"
              color="#38bdf8"
            />
          </CCol>

          <CCol>
            <Gauge
              value={inv.current}
              max={300}
              label="CURRENT"
              unit="A"
              color="#facc15"
            />
          </CCol>

          <CCol>
            <Gauge
              value={inv.power}
              max={50000}
              label="POWER"
              unit="W"
              color="#22c55e"
            />
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
  );
};

export default InverterPanel;
