// import React from 'react';

// const ServiceTicketDashboard = () => {
//   return <div>ServiceTicketDashboard</div>;
// };

// export default ServiceTicketDashboard;

import React, { useState } from 'react';
import {
  CCard,
  CCardBody,
  CCardTitle,
  CCardHeader,
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
import { Bar } from 'react-chartjs-2';
import { service_tickets } from '../../../data'; // Import service ticket data
// import TicketChart from './TicketChart';
import LoadingSpinner from '../../../components/LoadingSpinner';
import PieChart from './PieChart';
import './servicetickts.css';
import { Link } from 'react-router-dom';

const ServiceTicketDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [formData, setFormData] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // 📌 Open modal with selected ticket data
  const openModal = (ticket) => {
    setSelectedTicket(ticket);
    setFormData(ticket);
    setModalVisible(true);
  };

  // 📌 Handle input change in modal
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 📌 Handle ticket update (currently logs data)
  const handleUpdate = () => {
    console.log('Updated Ticket:', formData);
    setModalVisible(false);
  };

  const filteredData = service_tickets.filter(
    (item) =>
      item.ticket_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.robot_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.deveui.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.site_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <h4 className="mb-4 text-center">Service Tickets Overview</h4>
      {/* 📊 Ticket Statistics Chart */}
      {/* <CCard className="mb-4">
        <CCardHeader>
          <h4>Service Ticket Overview</h4>
        </CCardHeader>
        <CCardBody>
          <TicketChart />
        </CCardBody>
      </CCard> */}
      <PieChart />

      {/* 📋 Service Tickets Table */}
      <CCard className="mt-4">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h4>All Service Tickets</h4>
          <Link to="create-new-ticket" className="btn btn-sm btn-primary">
            NEW
          </Link>
        </CCardHeader>

        <CCardBody>
          <CRow className="justify-content-end">
            <CCol md={5} lg={4}>
              <CFormInput
                type="text"
                placeholder="Search by Robot No, Deveui, or Site ID"
                className="mb-3"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </CCol>
          </CRow>
          <CTable bordered hover responsive className="text-center">
            <CTableHead color="dark">
              <CTableRow>
                <CTableHeaderCell>Serial</CTableHeaderCell>
                <CTableHeaderCell className="sticky-col">
                  Ticket ID
                </CTableHeaderCell>
                <CTableHeaderCell>Robot No</CTableHeaderCell>
                <CTableHeaderCell>Site ID</CTableHeaderCell>
                <CTableHeaderCell>Fault Type</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell>Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {filteredData.map((ticket, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell className="sticky-col">
                    {ticket.ticket_id}
                  </CTableDataCell>
                  <CTableDataCell>{ticket.robot_no}</CTableDataCell>
                  <CTableDataCell>{ticket.site_id}</CTableDataCell>
                  <CTableDataCell>{ticket.fault_type}</CTableDataCell>
                  <CTableDataCell>
                    {ticket.ticket_resolved ? (
                      <CBadge color="success">Resolved</CBadge>
                    ) : (
                      <CBadge color="danger">Open</CBadge>
                    )}
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      color="primary"
                      size="sm"
                      onClick={() => openModal(ticket)}
                    >
                      Update
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      {/* 📌 Update Modal */}
      <CModal
        scrollable
        size="xl"
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        <CModalHeader>
          <CModalTitle>
            Update Service Ticket :{' '}
            <span className="badge bg-danger">{formData.ticket_id}</span>
          </CModalTitle>
        </CModalHeader>

        <CModalBody>
          {selectedTicket && (
            <CRow>
              {/* Ticket ID & Robot No () */}
              <CCol md={6}>
                <CFormInput
                  type="text"
                  name="ticket_id"
                  value={formData.ticket_id}
                  disabled
                  label="Ticket ID"
                  className="mb-3"
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  type="text"
                  name="robot_no"
                  value={formData.robot_no}
                  disabled
                  label="Robot No"
                  className="mb-3"
                />
              </CCol>

              {/* Device & Site Information */}
              <CCol md={6}>
                <CFormInput
                  type="text"
                  name="deveui"
                  value={formData.deveui}
                  disabled
                  label="Deveui"
                  className="mb-3"
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  type="text"
                  name="site_id"
                  value={formData.site_id}
                  disabled
                  label="Site ID"
                  className="mb-3"
                />
              </CCol>

              {/* Fault Type & Lora No */}
              <CCol md={6}>
                <CFormInput
                  type="text"
                  name="fault_type"
                  value={formData.fault_type}
                  label="Fault Type"
                  onChange={handleChange}
                  className="mb-3"
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  type="text"
                  name="lora_no"
                  value={formData.lora_no}
                  disabled
                  label="Lora No"
                  className="mb-3"
                />
              </CCol>

              {/* Ticket Generated Info */}
              <CCol md={6}>
                <CFormInput
                  type="text"
                  name="ticket_generated_by"
                  value={formData.ticket_generated_by}
                  disabled
                  label="Generated By"
                  className="mb-3"
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  type="email"
                  name="ticket_generated_by_email"
                  value={formData.ticket_generated_by_email}
                  disabled
                  label="Generated By Email"
                  className="mb-3"
                />
              </CCol>

              {/* Ticket Generated At & Notes */}
              <CCol md={6}>
                <CFormInput
                  type="datetime-local"
                  name="ticket_generated_at"
                  value={formData.ticket_generated_at}
                  label="Generated At"
                  className="mb-3"
                />
              </CCol>
              <CCol md={12}>
                <CFormInput
                  type="textarea"
                  name="ticket_generating_notes"
                  value={formData.ticket_generating_notes}
                  label="Generating Notes"
                  className="mb-3"
                />
              </CCol>
              {/* Ticket Status & Resolved Timestamp */}
              <CCol md={6}>
                <CFormInput
                  type="text"
                  name="ticket_resolved"
                  value={formData.ticket_resolved ? 'Resolved' : 'Open'}
                  label="Status"
                  className="mb-3"
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  type="datetime-local"
                  name="ticket_resolved_at"
                  value={formData.ticket_resolved_at || ''}
                  label="Resolved At"
                  onChange={handleChange}
                  className="mb-3"
                />
              </CCol>
              {/* Ticket Resolution Info */}
              <CCol md={6}>
                <CFormInput
                  type="text"
                  name="ticket_resolved_by"
                  value={formData.ticket_resolved_by || 'N/A'}
                  label="Resolved By"
                  className="mb-3"
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  type="email"
                  name="ticket_resolved_by_email"
                  value={formData.ticket_resolved_by_email || 'N/A'}
                  label="Resolved By Email"
                  className="mb-3"
                />
              </CCol>

              {/* Resolution Notes */}
              <CCol md={12}>
                <CFormInput
                  type="textarea"
                  name="ticket_resolving_notes"
                  value={formData.ticket_resolving_notes}
                  label="Resolving Notes"
                  onChange={handleChange}
                  className="mb-3"
                />
              </CCol>

              {/* Image Upload */}
              <CCol md={12}>
                <label className="form-label">Upload Images</label>
                <CFormInput type="file" multiple className="mb-3" />
              </CCol>

              {/* Image Gallery */}
              <CCol md={12}>
                <h6 className="mt-3">Ticket Images</h6>
                <div className="d-flex flex-wrap">
                  {formData.ticket_images.map((image, index) => (
                    <div
                      key={index}
                      className="p-2"
                      style={{ cursor: 'pointer' }}
                      onClick={() => setSelectedImage(image.image)}
                    >
                      <img
                        src={image.image}
                        alt={`Ticket ${index + 1}`}
                        className="img-thumbnail"
                        width="100"
                        height="80"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  ))}
                </div>
              </CCol>

              {/* Enlarged Image Modal */}
              {selectedImage && (
                <CModal
                  visible={true}
                  onClose={() => setSelectedImage(null)}
                  size="xl"
                >
                  <div
                    className="position-absolute top-0 end-0 m-2"
                    style={{ zIndex: 999 }}
                  >
                    <CButton onClick={() => setSelectedImage(null)}>✖</CButton>
                  </div>
                  <CModalBody className="d-flex justify-content-center">
                    <img
                      src={selectedImage}
                      alt="Selected"
                      className="p-2"
                      style={{ height: '80vh' }}
                    />
                  </CModalBody>
                </CModal>
              )}
            </CRow>
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
            Save Changes{' '}
            {loading ? (
              <>
                Saving <LoadingSpinner />
              </>
            ) : (
              'save changes'
            )}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default ServiceTicketDashboard;
