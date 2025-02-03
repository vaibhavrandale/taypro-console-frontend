import React, { useState } from 'react';
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CBadge,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormInput,
  CRow,
  CCol,
} from '@coreui/react';
import { robots } from '../../../data'; // Import your robots data

const InActiveRobots = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRobot, setSelectedRobot] = useState(null);
  const [formData, setFormData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  // Filter inactive robots
  const inactiveRobots = robots.filter((robot) => robot.activate === 0);

  const filteredRobots = inactiveRobots.filter(
    (robot) =>
      robot.robot_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      robot.deveui.toLowerCase().includes(searchTerm.toLowerCase()) ||
      robot.lora_no.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Open modal with selected robot data
  const openModal = (robot) => {
    setSelectedRobot(robot);
    setFormData(robot);
    setModalVisible(true);
  };

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle update (currently logs updated data)
  const handleUpdate = () => {
    console.log('Updated Data:', formData);
    setModalVisible(false);
  };

  return (
    <div className="p-4">
      <h2>Inactive Robots</h2>
      <CRow className="justify-content-end">
        <CCol md={4} lg={4}>
          {/* Search Input */}
          <CFormInput
            type="text"
            placeholder="Search by Robot No, Deveui, or Lora No"
            className="mb-3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CCol>
      </CRow>

      <CTable bordered hover responsive>
        <CTableHead color="dark">
          <CTableRow>
            <CTableHeaderCell>Sr</CTableHeaderCell>
            <CTableHeaderCell>Robot No</CTableHeaderCell>
            <CTableHeaderCell>Deveui</CTableHeaderCell>
            <CTableHeaderCell>Lora No</CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
            <CTableHeaderCell>Action</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {filteredRobots.map((robot, index) => (
            <CTableRow key={index}>
              <CTableDataCell>{index + 1}</CTableDataCell>
              <CTableDataCell>{robot.robot_no}</CTableDataCell>
              <CTableDataCell>{robot.deveui}</CTableDataCell>
              <CTableDataCell>{robot.lora_no}</CTableDataCell>
              <CTableDataCell>
                <CBadge color="danger">Inactive</CBadge>
              </CTableDataCell>
              <CTableDataCell>
                <CButton
                  color="primary"
                  size="sm"
                  onClick={() => openModal(robot)}
                >
                  Update
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      {/* Update Modal */}
      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>Update Robot Data</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedRobot && (
            <div>
              <CFormInput
                type="text"
                name="robot_no"
                value={formData.robot_no}
                label="Robot No"
                onChange={handleChange}
              />
              <CFormInput
                type="text"
                name="deveui"
                value={formData.deveui}
                label="Deveui"
                onChange={handleChange}
                className="mt-3"
              />
              <CFormInput
                type="text"
                name="lora_no"
                value={formData.lora_no}
                label="Lora No"
                onChange={handleChange}
                className="mt-3"
              />
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleUpdate}>
            Save Changes
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default InActiveRobots;
