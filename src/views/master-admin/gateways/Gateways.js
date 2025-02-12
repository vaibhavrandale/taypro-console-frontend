import React, { useEffect, useState } from 'react';
import {
  CContainer,
  CTable,
  CTableBody,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CButton,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CRow,
  CCol,
  CInputGroup,
  CFormInput,
} from '@coreui/react';
import { gateways, robots } from '../../../data'; // Import the gateways data
import { Link } from 'react-router-dom';
import LastOnlineStatus from '../../../components/LastOnlineStatus';
import LoadingSpinner from '../../../components/LoadingSpinner';

const Gateways = () => {
  const [selectedGateway, setSelectedGateway] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [filteredGateways, setFilteredGateways] = useState([]);

  useEffect(() => {
    setLoading(true); // Start loading
    setTimeout(() => {
      const Gateways = gateways.filter(
        (gateway) =>
          gateway.gateway_robot_no
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          gateway.gateway_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          gateway.gateway_name_in_lns_server
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          gateway.gateway_robot_no
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          gateway.gateway_type.toLowerCase().includes(searchTerm.toLowerCase())
      );

      setFilteredGateways(Gateways);
      setLoading(false); // Stop loading
    }, 500); // Simulating API call delay
  }, [searchTerm]);

  // Function to handle modal open
  const openModal = (gateway) => {
    setSelectedGateway(gateway);
    setModalVisible(true);
  };

  // Function to close modal
  const closeModal = () => {
    setModalVisible(false);
    setSelectedGateway(null);
  };

  return (
    <CContainer className="mt-5">
      <h2 className="text-center mb-4">Gateways</h2>
      <CRow className="justify-content-end">
        <CCol xs={12} sm={10} md={8} lg={5}>
          <CInputGroup className="mb-3">
            <CFormInput
              type="text"
              placeholder="Search by gateway name,type ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </CInputGroup>
        </CCol>
      </CRow>
      {/* Table displaying all gateways */}
      <CTable bordered hover responsive>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>#</CTableHeaderCell>
            <CTableHeaderCell>Gateway Name</CTableHeaderCell>
            <CTableHeaderCell>Type</CTableHeaderCell>
            <CTableHeaderCell>Latitude</CTableHeaderCell>
            <CTableHeaderCell>Longitude</CTableHeaderCell>
            <CTableHeaderCell>Last Online Update</CTableHeaderCell>
            <CTableHeaderCell>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        {loading ? (
          <CTableBody>
            <CTableRow className="text-center">
              <CTableDataCell colSpan={7}>
                <LoadingSpinner />
              </CTableDataCell>
            </CTableRow>
          </CTableBody>
        ) : (
          <CTableBody>
            {filteredGateways.map((gateway, index) => (
              <CTableRow key={gateway.id}>
                <CTableHeaderCell>{index + 1}</CTableHeaderCell>
                <CTableDataCell>{gateway.gateway_name}</CTableDataCell>
                <CTableDataCell>
                  {gateway.gateway_type.toUpperCase()}
                </CTableDataCell>
                <CTableDataCell>{gateway.gateway_lattitude}</CTableDataCell>
                <CTableDataCell>{gateway.gateway_longitude}</CTableDataCell>
                <CTableDataCell style={{ minWidth: '160px' }}>
                  {gateway.last_online_update}
                </CTableDataCell>
                <CTableDataCell style={{ minWidth: '180px' }}>
                  <CButton
                    color="warning"
                    size="sm"
                    className="m-1"
                    onClick={() => openModal(gateway)}
                  >
                    View Details
                  </CButton>
                  <Link
                    type="button"
                    color="primary"
                    size="sm"
                    to={`/master-admin/update-gateway/${gateway.id}`}
                    className="btn btn-secondary  btn-sm m-1"
                  >
                    Update
                  </Link>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        )}
      </CTable>

      <CModal
        visible={modalVisible}
        onClose={closeModal}
        size="xl"
        backdrop="static"
        scrollable
      >
        <CModalHeader closeButton>
          <CModalTitle>{selectedGateway?.gateway_name} Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedGateway && (
            <div>
              {/* Gateway Information Table */}
              <h5 className="mb-3">Gateway Information</h5>
              <CTable striped bordered responsive>
                <CTableBody>
                  <CTableRow>
                    <CTableHeaderCell>Gateway ID</CTableHeaderCell>
                    <CTableDataCell>
                      {selectedGateway.gateway_id_in_lns_server}
                    </CTableDataCell>
                  </CTableRow>
                  {/* <CTableRow>
                    <CTableHeaderCell>Gateway Status</CTableHeaderCell>
                    <CTableDataCell>
                      {selectedGateway.last_online_update}
                    </CTableDataCell>
                  </CTableRow> */}

                  <CTableRow>
                    <CTableHeaderCell>Gateway Status</CTableHeaderCell>
                    <CTableDataCell>
                      <LastOnlineStatus
                        lastOnlineTime={selectedGateway.last_online_update}
                      />
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>
                      Gateway Name in LNS Server
                    </CTableHeaderCell>
                    <CTableDataCell>
                      {selectedGateway.gateway_name_in_lns_server}
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Longitude,Latitude</CTableHeaderCell>
                    <CTableDataCell>
                      {selectedGateway.gateway_longitude}&nbsp;,&nbsp;
                      {selectedGateway.gateway_lattitude}&nbsp;{' '}
                      <Link
                        target="blank"
                        to={`https://www.google.com/maps/search/?api=1&query=${selectedGateway.gateway_longitude},${selectedGateway.gateway_lattitude}`}
                      >
                        view on map
                      </Link>
                    </CTableDataCell>
                  </CTableRow>

                  <CTableRow>
                    <CTableHeaderCell>SIM Number</CTableHeaderCell>
                    <CTableDataCell>
                      {selectedGateway.gateway_simnumber}
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Robot Number</CTableHeaderCell>
                    <CTableDataCell>
                      {selectedGateway.gateway_robot_no}
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>LoRa Number</CTableHeaderCell>
                    <CTableDataCell>
                      {selectedGateway.gateway_lora_no}
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Last Online Update</CTableHeaderCell>
                    <CTableDataCell>
                      {selectedGateway.last_online_update}
                    </CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>

              {/* Finding matching robots */}
              <h5 className="mt-4 mb-3">Connected Robot/Lora</h5>
              {robots.filter(
                (robot) =>
                  robot.robot_no === selectedGateway.gateway_robot_no &&
                  robot.deveui === selectedGateway.gateway_lora_deveui &&
                  robot.lora_no === selectedGateway.gateway_lora_no
              ).length > 0 ? (
                <CTable striped bordered hover responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Robot No</CTableHeaderCell>
                      <CTableHeaderCell>Status</CTableHeaderCell>
                      <CTableHeaderCell>Site ID</CTableHeaderCell>
                      <CTableHeaderCell>LoRa Serial No</CTableHeaderCell>
                      <CTableHeaderCell>Battery %</CTableHeaderCell>
                      <CTableHeaderCell>Last Seen</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {robots
                      .filter(
                        (robot) =>
                          robot.robot_no === selectedGateway.gateway_robot_no &&
                          robot.deveui ===
                            selectedGateway.gateway_lora_deveui &&
                          robot.lora_no === selectedGateway.gateway_lora_no &&
                          robot.robot_type === 'gateway'
                      )
                      .map((robot, index) => (
                        <CTableRow key={index}>
                          <CTableDataCell>{robot.robot_no} </CTableDataCell>
                          <CTableDataCell>
                            {robot.lora_state === 1 ? (
                              <span className="badge bg-success">online</span>
                            ) : (
                              <span className="badge bg-danger">offline</span>
                            )}
                          </CTableDataCell>
                          <CTableDataCell>{robot.site_id}</CTableDataCell>
                          <CTableDataCell>
                            {robot.lora_no}&nbsp;&nbsp;({robot.deveui})
                          </CTableDataCell>
                          <CTableDataCell>
                            {robot.battery_percentage}%
                          </CTableDataCell>
                          <CTableDataCell>{robot.last_update}</CTableDataCell>
                        </CTableRow>
                      ))}
                  </CTableBody>
                </CTable>
              ) : (
                <p className="text-muted">No connected robots found.</p>
              )}

              {/* Update Logs */}
              <h5 className="mt-4 mb-3">last Update Logs</h5>
              {selectedGateway.update_log.length > 0 ? (
                <CTable striped bordered hover responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>#</CTableHeaderCell>
                      <CTableHeaderCell>Updated By</CTableHeaderCell>
                      <CTableHeaderCell>Email</CTableHeaderCell>
                      <CTableHeaderCell>Comments</CTableHeaderCell>
                      <CTableHeaderCell>Updated At</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {selectedGateway.update_log.map((log, index) => (
                      <CTableRow key={log.id}>
                        <CTableHeaderCell>{index + 1}</CTableHeaderCell>
                        <CTableDataCell>{log.updated_by}</CTableDataCell>
                        <CTableDataCell>{log.updated_by_email}</CTableDataCell>
                        <CTableDataCell>{log.comments}</CTableDataCell>
                        <CTableDataCell>{log.updated_at}</CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              ) : (
                <p className="text-muted">No updates available.</p>
              )}
            </div>
          )}
        </CModalBody>
      </CModal>
    </CContainer>
  );
};

export default Gateways;
