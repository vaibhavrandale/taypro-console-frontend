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
import { sites, lora_configuration } from '../../../data'; // Ensure correct path
import '../master-admin.css';
import toast from 'react-hot-toast';
const LoraConfiguration = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [addmodalVisible, setAddModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [newDeveui, setNewDeveui] = useState('');

  // Open Modal and Set Selected Item Data
  const openModal = (item) => {
    setSelectedItem(item);
    setFormData(item);
    setModalVisible(true);
  };
  // Open Modal and Set Selected Item Data
  const openAddModal = () => {
    setAddModalVisible(true);
  };

  // Handle Adding New Entry
  // const handleAdd = () => {
  //   if (!newDeveui) {
  //     alert('Please enter a valid Deveui!');
  //     return;
  //   }

  //   // Add new entry to lora_configuration
  //   const newEntry = {
  //     serial: lora_configuration.length + 1, // Generate serial
  //     robot_no: 'N/A', // Default for now
  //     deveui: newDeveui,
  //     formatted_deveui: newDeveui,
  //     site_id: 'taypro_office', // Default site
  //     added_by: 'Vaibhav Randale', // Replace with actual user
  //     added_by_email: 'vaibhav.r@gmail.com', // Replace with actual user
  //     added_by_id: 'dfbdfbdbdfbg', // Replace with actual user
  //     lastUpdateBy: null,
  //     lastUpdateAt: null,
  //   };

  //   console.log('New Lora Added:', newEntry);
  //   lora_configuration.push(newEntry);

  //   // Show Success Toast
  //   toast.success('New Lora Configuration Added Successfully!');

  //   // Close Modal & Reset
  //   setNewDeveui('');
  //   setAddModalVisible(false);
  // };

  const handleDeveuiChange = (e) => {
    let input = e.target.value;
    setNewDeveui(input);
  };

  const handleAdd = () => {
    if (!newDeveui) {
      alert('Please enter a valid Deveui!');
      return;
    }

    // Convert Deveui: Remove colons and convert to lowercase
    const formattedDeveui = newDeveui.replace(/:/g, '').toLowerCase();

    // Add new entry to lora_configuration
    const newEntry = {
      serial: lora_configuration.length + 1, // Generate serial
      robot_no: '', // Default for now
      deveui: newDeveui, // Original input
      formatted_deveui: formattedDeveui, // Converted format
      site_id: 'taypro_office', // Default site
      added_by: 'Vaibhav Randale', // Replace with actual user
      added_by_email: 'vaibhav.r@gmail.com', // Replace with actual user
      added_by_id: 'dfbdfbdbdfbg', // Replace with actual user
      lastUpdated_by: null,
      lastUpdateAt: null,
    };

    console.log(`New Lora ${lora_configuration.serial}  Added:`, newEntry);
    lora_configuration.push(newEntry);

    // Show Success Toast
    toast.success('New Lora Configuration Added Successfully!');

    // Close Modal & Reset
    setNewDeveui('');
    setAddModalVisible(false);
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
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="text-center">Lora Configuration</h2>
        <CButton
          color="success"
          size="sm"
          className="text-white"
          onClick={openAddModal}
        >
          + Add New
        </CButton>
      </div>
      {/* Add Modal */}
      <CModal
        visible={addmodalVisible}
        onClose={() => setAddModalVisible(false)}
        backdrop
      >
        <CModalHeader>
          <CModalTitle>Add New Lora </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol md={12}>
              <CFormLabel>Deveui</CFormLabel>
              <CFormInput
                type="text"
                name="deveui"
                value={newDeveui}
                onChange={handleDeveuiChange}
                placeholder="ENTER DEVEUI"
                className="mb-3"
              />
            </CCol>
            <CCol md={12}>
              <CFormLabel>Site ID (Default: taypro_office)</CFormLabel>
              <CFormInput
                type="text"
                value="taypro_office"
                disabled
                className="mb-3"
              />
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            size="sm"
            onClick={() => setAddModalVisible(false)}
          >
            Cancel
          </CButton>
          <CButton color="primary" size="sm" onClick={handleAdd}>
            Add
          </CButton>
        </CModalFooter>
      </CModal>
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
            <CTableHeaderCell>Last Update By</CTableHeaderCell>
            <CTableHeaderCell>Action</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {filteredData
            .slice()
            .reverse()
            .map((item, index) => (
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
                  {item.lastUpdated_by === null ? (
                    <span className="badge bg-danger">N/A</span>
                  ) : (
                    <span className="badge bg-success">
                      {item.lastUpdated_by}
                    </span>
                  )}
                </CTableDataCell>
                <CTableDataCell style={{ minWidth: '170px' }}>
                  {item.lastUpdateAt === null ? (
                    <span className="badge bg-danger">N/A</span>
                  ) : (
                    <span className="badge bg-success">
                      {item.lastUpdateAt}
                    </span>
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
