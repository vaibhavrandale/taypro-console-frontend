import React, { useState } from 'react';
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormInput,
  CRow,
  CCol,
  CModalFooter,
  CButton,
  CFormLabel,
  CModalBody,
  CModalTitle,
  CModalHeader,
  CModal,
  CFormSelect,
} from '@coreui/react';
import { sites, lora_configuration } from '../../data'; // Ensure correct path
import './master-admin.css';
const LoraConfiguration = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({});

  // Open Modal and Set Selected Item Data
  const openModal = (item) => {
    setSelectedItem(item);
    setFormData(item);
    setModalVisible(true);
  };

  // Handle Input Change in Form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Form Submission (For Now, Just Logs the Updated Data)
  const handleUpdate = () => {
    console.log('Updated Data:', formData);
    setModalVisible(false);
  };

  // Filter data based on search term
  const filteredData = lora_configuration.filter(
    (item) =>
      item.robot_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.deveui.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.site_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const uniqueSitenames = sites.filter(
    (value, index, self) =>
      index === self.findIndex((t) => t.site_id === value.site_id)
  );

  console.log(uniqueSitenames);

  return (
    <div className="">
      <h2 className="text-center">Lora Configuration</h2>
      <CRow className="justify-content-end">
        <CCol md={4} lg={3}>
          <CFormInput
            type="text"
            placeholder="Search by Robot No, Deveui, or Site ID"
            className="mb-3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CCol>
      </CRow>
      <CTable bordered hover responsive className="text-center table-container">
        <CTableHead color="dark">
          <CTableRow>
            <CTableHeaderCell className="sticky-column">
              <div className="d-flex flex-column">
                <span>Lora Sr</span>
                {/* <span className=" text-white">(available on back side of pcb)</span> */}
              </div>
            </CTableHeaderCell>
            <CTableHeaderCell>Robot No</CTableHeaderCell>
            <CTableHeaderCell>Deveui</CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: '190px' }}>
              Formatted Deveui
            </CTableHeaderCell>
            <CTableHeaderCell>Site ID</CTableHeaderCell>
            <CTableHeaderCell>Added By</CTableHeaderCell>
            <CTableHeaderCell>Added At</CTableHeaderCell>
            <CTableHeaderCell>Last Update</CTableHeaderCell>
            <CTableHeaderCell>Action</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {filteredData.map((item, index) => (
            <CTableRow key={index}>
              <CTableDataCell className="sticky-column">
                {item.serial}
              </CTableDataCell>
              <CTableDataCell style={{ minWidth: '150px' }}>
                {item.robot_no}
              </CTableDataCell>
              <CTableDataCell style={{ minWidth: '150px' }}>
                {item.deveui}
              </CTableDataCell>
              <CTableDataCell style={{ minWidth: '150px' }}>
                {item.formatted_deveui}
              </CTableDataCell>
              <CTableDataCell style={{ minWidth: '150px' }}>
                {item.site_id}
              </CTableDataCell>
              <CTableDataCell style={{ minWidth: '170px' }}>
                {item.added_by}
              </CTableDataCell>
              <CTableDataCell style={{ minWidth: '170px' }}>
                {item.addedAt}
              </CTableDataCell>
              <CTableDataCell style={{ minWidth: '170px' }}>
                {item.lastUpdateBy === null ? (
                  <span className="badge bg-danger">N/A</span>
                ) : (
                  <span className="badge bg-success">{item.lastUpdateBy}</span>
                )}
              </CTableDataCell>
              <CTableDataCell>
                <CButton
                  color="primary"
                  className="btn-sm"
                  onClick={() => openModal(item)}
                >
                  Update
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      {/* Update Modal */}
      <CModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        backdrop
        size="lg"
      >
        <CModalHeader>
          <CModalTitle>
            Update Lora{' '}
            <b className="px-3 badge bg-danger">{formData.serial}</b>
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedItem && (
            <div>
              <CRow className="">
                <CCol md={6}>
                  <CFormLabel>Robot No</CFormLabel>
                  <CFormInput
                    type="text"
                    name="robot_no"
                    value={formData.robot_no}
                    onChange={handleChange}
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Deveui</CFormLabel>
                  <CFormInput
                    disabled
                    type="text"
                    name="deveui"
                    value={formData.deveui}
                    onChange={handleChange}
                  />
                </CCol>
              </CRow>

              <CRow className="mt-3">
                <CCol md={6}>
                  <CFormLabel>Formatted Deveui</CFormLabel>
                  <CFormInput
                    disabled
                    type="text"
                    name="formatted_deveui"
                    value={formData.formatted_deveui}
                    onChange={handleChange}
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Site ID</CFormLabel>

                  <CFormSelect
                    size="md"
                    className="mb-3"
                    aria-label="Large select example"
                  >
                    <option value="">Select site</option>
                    {uniqueSitenames.map((item, index) => (
                      <option
                        key={index}
                        value={item.site_id}
                        selected={formData.site_id === item.site_id}
                      >
                        {item.site_id}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel>Added By</CFormLabel>
                  <CFormInput
                    disabled
                    type="text"
                    name="added_by"
                    value={formData.added_by}
                    onChange={handleChange}
                  />
                </CCol>{' '}
                <CCol md={6}>
                  <CFormLabel>Added At</CFormLabel>
                  <CFormInput
                    disabled
                    type="text"
                    name="addedAt"
                    value={formData.addedAt}
                    onChange={handleChange}
                  />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel>Last Updated by</CFormLabel>
                  <CFormInput
                    disabled
                    type="text"
                    name="lastUpdateBy"
                    value={
                      formData.lastUpdateBy === null
                        ? 'N/A'
                        : formData.lastUpdateBy
                    }
                    onChange={handleChange}
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Last Updated At</CFormLabel>
                  <CFormInput
                    disabled
                    type="text"
                    name="lastUpdateAt"
                    value={
                      formData.lastUpdateAt === null
                        ? 'N/A'
                        : formData.lastUpdateAt
                    }
                    onChange={handleChange}
                  />
                </CCol>
              </CRow>
            </div>
          )}
        </CModalBody>

        <CModalFooter>
          <CButton
            color="secondary"
            className="btn-sm"
            onClick={() => setModalVisible(false)}
          >
            Cancel
          </CButton>
          <CButton color="primary" className="btn-sm" onClick={handleUpdate}>
            Save Changes
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default LoraConfiguration;
