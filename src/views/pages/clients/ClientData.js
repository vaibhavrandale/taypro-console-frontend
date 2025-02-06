import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  // CCard,
  // CCardBody,
  // CCardTitle,
  // CCardText,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CRow,
  CCol,
  CInputGroup,
  CFormInput,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
} from '@coreui/react';
import { clients, sites } from '../../../data'; // Import clients & sites data
import toast from 'react-hot-toast';

const ClientData = () => {
  const { client_id } = useParams(); // Get client_id from URL params
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedSite, setSelectedSite] = useState(null);
  const [formData, setFormData] = useState({
    siteName: '',
    location: '',
    site_id: '',
    client_id: client_id,
  });

  // Function to generate client_id from client_name
  const generateClientID = (name) => {
    return name
      .toLowerCase() // Convert to lowercase
      .replace(/\s+/g, '_') // Replace spaces with underscores
      .replace(/[^\w_]/g, ''); // Remove special characters
  };

  // Find the client by client_id
  const client = clients.find((c) => c.client_id === client_id);

  // Filter sites assigned to this client
  const clientSites = sites.filter((site) => site.client_id === client_id);

  // Filter sites based on search input
  const filteredSites = clientSites.filter(
    (site) =>
      site.siteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.site_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!client) {
    return (
      <div className="text-center p-5">
        <h2 className="text-danger">Client Not Found</h2>
        <Link to="/clients">
          <CButton color="primary">Go Back to Clients</CButton>
        </Link>
      </div>
    );
  }

  // Open modal for updating site
  const openUpdateModal = (site) => {
    setSelectedSite(site);
    setFormData(site);
    setModalVisible(true);
  };

  // Open modal for updating site
  const opendeleteModal = (site) => {
    setFormData(site);
    setDeleteModal(true);
  };

  const handleDelete = (site_id) => {
    if (window.confirm('Are you sure you want to delete this site?')) {
      toast.success(`${site_id} deleted!`);
      // Here you can add logic to remove site from the state or database
      setDeleteModal(false);
    }
  };

  // Open modal for adding site
  const openAddModal = () => {
    setFormData({
      siteName: '',
      location: '',
      site_id: '',
      client_id: client_id,
    });
    setAddModalVisible(true);
  };

  // Handle input change
  const handleChange = (e) => {
    // setFormData({ ...formData, [e.target.name]: e.target.value });
    const { name, value } = e.target;
    let newFormData = { ...formData, [name]: value };

    // Generate `client_id` dynamically based on `client_name`
    if (name === 'siteName') {
      newFormData.site_id = generateClientID(value);
    }

    setFormData(newFormData);
  };

  // Handle updating site
  const handleUpdate = () => {
    console.log('Updated Site Data:', formData);
    setModalVisible(false);
  };

  // Handle adding new site
  const handleAddSite = () => {
    if (!formData.siteName || !formData.location || !formData.site_id) {
      alert('Please fill in all fields');
      return;
    }
    console.log('New Site Added:', formData);
    setAddModalVisible(false);
  };

  return (
    <div className="container mt-4">
      <CRow>
        <CCol>
          {/* Assigned Sites Table */}
          <div className=" border-0 p-3 my-2">
            <div className="d-flex justify-content-between align-items-center flex-wrap">
              <h4>
                Assigned Sites of &nbsp;
                <b>
                  {client.client_name} ({client.client_id})
                </b>
              </h4>
              <CButton color="primary" size="sm" onClick={openAddModal}>
                Add New Site
              </CButton>
            </div>
            {/* Search Input */}
            <CRow className="justify-content-end mt-2">
              <CCol xs={12} sm={10} md={8} lg={5}>
                <CInputGroup className="mb-1">
                  <CFormInput
                    type="text"
                    placeholder="Search Site..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </CInputGroup>
              </CCol>
            </CRow>

            <CTable bordered hover responsive className="text-center  mt-2">
              <CTableHead color="dark">
                <CTableRow>
                  <CTableHeaderCell>#</CTableHeaderCell>
                  <CTableHeaderCell style={{ minWidth: '200px' }}>
                    Site Name
                  </CTableHeaderCell>
                  <CTableHeaderCell style={{ minWidth: '100px' }}>
                    Location
                  </CTableHeaderCell>
                  <CTableHeaderCell style={{ minWidth: '170px' }}>
                    Site ID
                  </CTableHeaderCell>
                  <CTableHeaderCell style={{ minWidth: '170px' }}>
                    Password
                  </CTableHeaderCell>
                  <CTableHeaderCell style={{ minWidth: '170px' }}>
                    Action
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredSites.length > 0 ? (
                  filteredSites.map((site, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>{site.siteName}</CTableDataCell>
                      <CTableDataCell>{site.location}</CTableDataCell>
                      <CTableDataCell>{site.site_id}</CTableDataCell>
                      <CTableDataCell>{site.password}</CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          color="primary"
                          size="sm"
                          className="m-1"
                          onClick={() => openUpdateModal(site)}
                        >
                          Update
                        </CButton>
                        <CButton
                          className="m-1 text-white"
                          color="danger"
                          size="sm"
                          onClick={() => opendeleteModal(site)}
                        >
                          Delete
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan="6" className="text-center fw-bold">
                      results not found
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>

            {/* Add New Site Modal */}
            <CModal
              visible={addModalVisible}
              onClose={() => setAddModalVisible(false)}
            >
              <CModalHeader>
                <CModalTitle>
                  Add New Site for &nbsp;
                  <b className="text-danger">{client.client_name}</b>
                </CModalTitle>
              </CModalHeader>
              <CModalBody>
                <CForm>
                  <CFormInput
                    type="text"
                    name="siteName"
                    value={formData.siteName}
                    label="Site Name"
                    onChange={handleChange}
                    className="mb-3"
                  />
                  <CFormInput
                    type="text"
                    name="site_id"
                    disabled
                    value={formData.site_id}
                    label="Site ID"
                    onChange={handleChange}
                    className="mb-3"
                  />
                  <CFormInput
                    type="text"
                    name="client_id"
                    disabled
                    value={client_id}
                    label="Client ID"
                    onChange={handleChange}
                    className="mb-3"
                  />
                  <CFormInput
                    type="text"
                    name="location"
                    value={formData.location}
                    label="Location"
                    onChange={handleChange}
                    className="mb-3"
                  />
                </CForm>
              </CModalBody>
              <CModalFooter>
                <CButton
                  color="secondary"
                  size="sm"
                  onClick={() => setAddModalVisible(false)}
                >
                  Cancel
                </CButton>
                <CButton color="primary" size="sm" onClick={handleAddSite}>
                  Add Site
                </CButton>
              </CModalFooter>
            </CModal>

            {/* Update Site Modal */}
            <CModal
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
            >
              <CModalHeader>
                <CModalTitle>
                  Update Site{' '}
                  <b className="text-danger">
                    {formData.siteName},{formData.location}
                  </b>
                </CModalTitle>
              </CModalHeader>
              <CModalBody>
                <CForm>
                  <CFormInput
                    type="text"
                    name="siteName"
                    value={formData.siteName}
                    label="Site Name"
                    onChange={handleChange}
                    className="mb-3"
                  />
                  <CFormInput
                    type="text"
                    name="site_id"
                    disabled
                    value={formData.site_id}
                    label="site id"
                    onChange={handleChange}
                    className="mb-3"
                  />
                  <CFormInput
                    type="text"
                    name="client_id"
                    disabled
                    value={formData.client_id}
                    label="client id"
                    onChange={handleChange}
                    className="mb-3"
                  />

                  <CFormInput
                    type="text"
                    name="password"
                    value={formData.password}
                    label="password"
                    onChange={handleChange}
                    className="mb-3"
                  />
                  <CFormInput
                    type="text"
                    name="location"
                    value={formData.location}
                    label="Location"
                    onChange={handleChange}
                    className="mb-3"
                  />
                </CForm>
              </CModalBody>
              <CModalFooter>
                <CButton
                  color="secondary"
                  size="sm"
                  onClick={() => setModalVisible(false)}
                >
                  Cancel
                </CButton>
                <CButton size="sm" color="primary" onClick={handleUpdate}>
                  Save Changes
                </CButton>
              </CModalFooter>
            </CModal>

            {/* Update Site Modal */}
            <CModal
              size="lg"
              visible={deleteModal}
              onClose={() => setDeleteModal(false)}
            >
              <CModalHeader>
                <CModalTitle>
                  Are you want to delete <br />
                  <b className="text-danger">
                    {formData.siteName},{formData.location}{' '}
                    <span className="text-success">({formData.site_id})</span>
                  </b>
                  ?
                </CModalTitle>
              </CModalHeader>

              <CModalFooter>
                <CButton
                  size="sm"
                  color="danger"
                  className="text-white"
                  onClick={() => handleDelete(formData.site_id)} // Correct: Uses an arrow function
                >
                  Delete
                </CButton>
              </CModalFooter>
            </CModal>
          </div>
        </CCol>
      </CRow>
    </div>
  );
};

export default ClientData;
