import React, { useState } from 'react';
import {
  CTable,
  CFormSelect,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormInput,
  CRow,
  CCol,
  CButton,
  CModalFooter,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CForm,
  CFormLabel,
} from '@coreui/react';
import { robots, sites } from '../../../data'; // Import robots data

const Robots = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRobot, setSelectedRobot] = useState(null);
  // const [selectedSite, setSelectedSite] = useState('');
  const [formData, setFormData] = useState({
    robot_no: '',
    deveui: '',
    block: '',
    site_id: '',
    company: '',
    last_update: '',
    lora_state: '',
    activate: '',
    last_status: '',
    battery_percentage: '',
    version: '',
    old_lora_no: '',
    lora_no: '',
    wheel_speed: '',
    brush_speed: '',
    stuck_count: '',
  });

  // Filter robots based on search term
  const filteredRobots = robots.filter(
    (robot) =>
      robot.robot_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      robot.deveui.toLowerCase().includes(searchTerm.toLowerCase()) ||
      robot.site_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      robot.lora_no.toString().includes(searchTerm) // Convert lora_no to string
  );

  // Open modal and load robot data
  const openModal = (robot) => {
    setSelectedRobot(robot);
    setFormData(robot);
    setModalVisible(true);
  };

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle update action
  const handleUpdate = () => {
    console.log('Updated Robot Data:', formData);
    setModalVisible(false);
  };

  return (
    <div className="p-4">
      <h2 className="text-center">All Robots</h2>

      {/* Search Input */}
      <CRow className="justify-content-end mb-3">
        <CCol md={4}>
          <CFormInput
            type="text"
            placeholder="Search by Robot No, Deveui,Lora No, or Site ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CCol>
      </CRow>

      {/* Robots Table */}
      <CTable bordered hover responsive className="text-center shadow-sm">
        <CTableHead color="dark">
          <CTableRow>
            <CTableHeaderCell>#</CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: '200px' }}>
              Robot No
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: '200px' }}>
              Deveui
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: '100px' }}>
              Lora No
            </CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: '100px' }}>
              Block
            </CTableHeaderCell>
            <CTableHeaderCell>Site ID</CTableHeaderCell>
            <CTableHeaderCell>Action</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {filteredRobots.length > 0 ? (
            filteredRobots.map((robot, index) => (
              <CTableRow key={index}>
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell>{robot.robot_no}</CTableDataCell>
                <CTableDataCell>
                  {robot.deveui.toLocaleLowerCase()}
                </CTableDataCell>
                <CTableDataCell>{robot.lora_no}</CTableDataCell>
                <CTableDataCell>
                  {robot.lora_state === 1 ? (
                    <span className="badge bg-success">online</span>
                  ) : (
                    <span className="badge bg-danger">offline</span>
                  )}
                </CTableDataCell>
                <CTableDataCell>{robot.block}</CTableDataCell>
                <CTableDataCell>{robot.site_id}</CTableDataCell>
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
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan="7" className="text-center fw-bold">
                No matching robots found.
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>

      {/* Update Modal */}
      <CModal
        size="lg"
        scrollable
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        <CModalHeader>
          <CModalTitle>
            Update Robot Data :&nbsp;
            <span className="badge bg-success">{formData.robot_no}</span>{' '}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedRobot && (
            <CForm>
              <CRow>
                <CCol>
                  <CFormInput
                    type="text"
                    name="robot_no"
                    value={formData.robot_no}
                    label="Robot No"
                    className="mb-3"
                  />
                </CCol>
                <CCol>
                  <CFormInput
                    type="text"
                    name="deveui"
                    value={formData.deveui}
                    label="Deveui"
                    className="mb-3"
                  />
                </CCol>
              </CRow>
              <CRow>
                <CCol>
                  <CFormInput
                    type="text"
                    name="block"
                    value={formData.block}
                    label="Block"
                    onChange={handleChange}
                    className="mb-3"
                  />{' '}
                </CCol>
                <CCol>
                  {/* <CFormInput
                    type="text"
                    name="site_id"
                    value={formData.site_id}
                    label="Site ID"
                    onChange={handleChange}
                    className="mb-3"
                  /> */}
                  <CFormLabel htmlFor="siteSelect">Select Site</CFormLabel>
                  <CFormSelect
                    id="siteSelect"
                    value={formData.site_id} // Set value from formData
                    onChange={(e) =>
                      setFormData({ ...formData, site_id: e.target.value })
                    }
                  >
                    <option value="">-- Select a Site --</option>
                    {sites.map((site) => (
                      <option key={site.id} value={site.site_id}>
                        {site.site_id}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
              </CRow>
              <CRow>
                <CCol>
                  <CFormInput
                    type="text"
                    name="company"
                    value={formData.company}
                    label="Company"
                    onChange={handleChange}
                    className="mb-3"
                  />
                </CCol>
                <CCol>
                  <CFormInput
                    type="text"
                    name="last_update"
                    value={formData.last_update}
                    label="Last Update"
                    className="mb-3"
                  />
                </CCol>
              </CRow>

              <CRow>
                <CCol>
                  <CFormInput
                    type="text"
                    name="lora_state"
                    value={formData.lora_state}
                    label="Lora State"
                    onChange={handleChange}
                    className="mb-3"
                  />
                </CCol>
                <CCol>
                  <CFormInput
                    type="text"
                    name="activate"
                    value={formData.activate}
                    label="Activate"
                    onChange={handleChange}
                    className="mb-3"
                  />{' '}
                </CCol>
              </CRow>

              <CRow>
                <CCol>
                  <CFormInput
                    type="text"
                    name="last_status"
                    value={formData.last_status}
                    label="Last Status"
                    onChange={handleChange}
                    className="mb-3"
                  />{' '}
                </CCol>
                <CCol>
                  <CFormInput
                    type="text"
                    name="battery_percentage"
                    value={formData.battery_percentage}
                    label="Battery %"
                    onChange={handleChange}
                    className="mb-3"
                  />
                </CCol>
              </CRow>

              <CRow>
                <CCol>
                  <CFormInput
                    type="text"
                    name="version"
                    value={formData.version}
                    label="Version"
                    onChange={handleChange}
                    className="mb-3"
                  />
                </CCol>
                <CCol>
                  <CFormInput
                    type="text"
                    name="old_lora_no"
                    value={formData.old_lora_no}
                    label="Old Lora No"
                    className="mb-3"
                  />
                </CCol>
              </CRow>

              <CRow>
                <CCol>
                  <CFormInput
                    type="text"
                    name="lora_no"
                    value={formData.lora_no}
                    label="Current Lora No"
                    className="mb-3"
                  />{' '}
                </CCol>
                <CCol>
                  <CFormInput
                    type="text"
                    name="wheel_speed"
                    value={formData.wheel_speed}
                    label="Wheel Speed"
                    onChange={handleChange}
                    className="mb-3"
                  />
                </CCol>
              </CRow>

              <CRow>
                <CCol>
                  <CFormInput
                    type="text"
                    name="brush_speed"
                    value={formData.brush_speed}
                    label="Brush Speed"
                    onChange={handleChange}
                    className="mb-3"
                  />
                </CCol>
                <CCol>
                  <CFormInput
                    type="text"
                    name="stuck_count"
                    value={formData.stuck_count}
                    label="Stuck Count"
                    onChange={handleChange}
                    className="mb-3"
                  />
                </CCol>
              </CRow>
            </CForm>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            size="sm"
            onClick={() => setModalVisible(false)}
          >
            Cancel
          </CButton>
          <CButton color="primary" size="sm" onClick={handleUpdate}>
            Save Changes
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default Robots;
