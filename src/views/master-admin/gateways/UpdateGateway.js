import React, { useState } from 'react';
import {
  CContainer,
  CRow,
  CCol,
  CForm,
  CFormInput,
  CButton,
  CTable,
  CTableBody,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
} from '@coreui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { gateways, robots } from '../../../data'; // Import gateways and robots data
import toast from 'react-hot-toast';

const UpdateGateway = () => {
  const { gatewayid } = useParams(); // Get gateway ID from URL
  const navigate = useNavigate();

  // Find the selected gateway
  const gateway = gateways.find((g) => g.id === gatewayid);

  // State for editable gateway form fields
  const [updatedGateway, setUpdatedGateway] = useState({
    ...gateway,
  });

  // Find matching robots linked to this gateway
  const matchingRobots = robots.filter(
    (robot) =>
      robot.robot_no === gateway.gateway_robot_no &&
      robot.deveui === gateway.gateway_lora_deveui &&
      robot.lora_no === gateway.gateway_lora_no
  );

  // Handle form input changes
  const handleInputChange = (e) => {
    setUpdatedGateway({
      ...updatedGateway,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission (Mock Save)
  const handleSaveChanges = () => {
    console.log('Updated Gateway Data:', updatedGateway);
    toast.success(
      `${updatedGateway.gateway_name}-(${updatedGateway.id}) details updated successfully!`
    );
    navigate('/master-admin/all-site-gateways'); // Redirect back to gateways list
  };

  return (
    <CContainer className="mt-5">
      <h2 className="text-center  d-flex justify-content-center align-items-center">
        <span> Update Gateway</span>&nbsp;-&nbsp;
        <span className="text-primary">{gatewayid}</span>
      </h2>

      {gateway ? (
        <>
          <CForm>
            <CRow className="mb-3">
              <CCol md={6}>
                <label>Gateway Name</label>
                <CFormInput
                  type="text"
                  name="gateway_name"
                  value={updatedGateway.gateway_name}
                  onChange={handleInputChange}
                />
              </CCol>
              <CCol md={6}>
                <label>Gateway Type</label>
                <CFormInput
                  type="text"
                  name="gateway_type"
                  value={updatedGateway.gateway_type}
                  onChange={handleInputChange}
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <label>Latitude</label>
                <CFormInput
                  type="text"
                  name="gateway_lattitude"
                  value={updatedGateway.gateway_lattitude}
                  onChange={handleInputChange}
                />
              </CCol>
              <CCol md={6}>
                <label>Longitude</label>
                <CFormInput
                  type="text"
                  name="gateway_longitude"
                  value={updatedGateway.gateway_longitude}
                  onChange={handleInputChange}
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <label>SIM Number</label>
                <CFormInput
                  type="text"
                  name="gateway_simnumber"
                  value={updatedGateway.gateway_simnumber}
                  onChange={handleInputChange}
                />
              </CCol>
              <CCol md={6}>
                <label>Robot Number</label>
                <CFormInput
                  type="text"
                  name="gateway_robot_no"
                  value={updatedGateway.gateway_robot_no}
                  onChange={handleInputChange}
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <label>LoRa Number</label>
                <CFormInput
                  type="text"
                  name="gateway_lora_no"
                  value={updatedGateway.gateway_lora_no}
                  onChange={handleInputChange}
                />
              </CCol>
              <CCol md={6}>
                <label>Last Online Update</label>
                <CFormInput
                  type="text"
                  name="last_online_update"
                  value={updatedGateway.last_online_update}
                  onChange={handleInputChange}
                  disabled
                />
              </CCol>
            </CRow>

            <div className="text-end mt-4">
              <CButton color="success" size="sm" onClick={handleSaveChanges}>
                Save Changes
              </CButton>
              <CButton
                color="secondary"
                className="ms-2"
                size="sm"
                onClick={() => navigate('/master-admin/all-site-gateways')}
              >
                Cancel
              </CButton>
            </div>
          </CForm>

          {/* Robot Data Table */}
          <h4 className="mt-5">Connected Robots/Lora</h4>
          {matchingRobots.length > 0 ? (
            <CTable striped bordered hover responsive className="mt-3">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Robot No</CTableHeaderCell>{' '}
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Site ID</CTableHeaderCell>
                  <CTableHeaderCell>LoRa No</CTableHeaderCell>
                  <CTableHeaderCell>LoRa DEVEUI</CTableHeaderCell>
                  <CTableHeaderCell>Battery %</CTableHeaderCell>
                  <CTableHeaderCell>Last Seen</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {matchingRobots.map((robot, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>{robot.robot_no}</CTableDataCell>
                    <CTableDataCell>
                      {robot.lora_state === 1 ? (
                        <span className="badge bg-success">online</span>
                      ) : (
                        <span className="badge bg-danger">offline</span>
                      )}
                    </CTableDataCell>
                    <CTableDataCell>{robot.site_id}</CTableDataCell>
                    <CTableDataCell>{robot.lora_no}</CTableDataCell>
                    <CTableDataCell>{robot.deveui}</CTableDataCell>
                    <CTableDataCell>{robot.battery_percentage}%</CTableDataCell>

                    <CTableDataCell>{robot.last_update}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          ) : (
            <p className="text-muted">No connected robots found.</p>
          )}

          {/* Update Logs */}
          <h4 className="mt-5">Last Update Logs</h4>
          {updatedGateway.update_log.length > 0 ? (
            <CTable striped bordered hover responsive className="mt-3">
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
                {updatedGateway.update_log.map((log, index) => (
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
        </>
      ) : (
        <h4 className="text-danger text-center">Gateway not found.</h4>
      )}
    </CContainer>
  );
};

export default UpdateGateway;
