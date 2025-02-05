import React, { useState } from 'react';
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CButton,
  CFormInput,
  CRow,
  CCol,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormSelect,
  CFormTextarea,
} from '@coreui/react';
import { internal_tickets } from '../../../data';
import { Link } from 'react-router-dom';

const InternalTicketsDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [formData, setFormData] = useState({});

  /** 🔍 Search Function */
  const filteredTickets = internal_tickets.filter(
    (ticket) =>
      ticket.ticket_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.created_by.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /** ✏️ Open Update Modal */
  const openModal = (ticket) => {
    setSelectedTicket(ticket);
    setFormData(ticket);
    setModalVisible(true);
  };

  /** 📝 Handle Input Change */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  /** ✅ Handle Update */
  const handleUpdate = () => {
    console.log('Updated Ticket:', formData);
    setModalVisible(false);
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center">
        {' '}
        <h2>Internal Tickets</h2>
        <Link
          to="create-new-internal-ticket"
          className="btn btn-sm btn-primary"
        >
          NEW
        </Link>
      </div>

      {/* 🔍 Search Input */}
      <CRow className="justify-content-end">
        <CCol md={4}>
          <CFormInput
            type="text"
            placeholder="Search by Ticket ID, Department, Subject, or Status"
            className="mb-3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CCol>
      </CRow>

      {/* 📋 Ticket Table */}
      <CTable bordered hover responsive className="text-center">
        <CTableHead color="dark">
          <CTableRow>
            <CTableHeaderCell>#</CTableHeaderCell>
            <CTableHeaderCell>Ticket ID</CTableHeaderCell>
            <CTableHeaderCell>Department</CTableHeaderCell>
            <CTableHeaderCell>Subject</CTableHeaderCell>
            <CTableHeaderCell>Priority</CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
            <CTableHeaderCell>Assigned To</CTableHeaderCell>
            <CTableHeaderCell>Created By</CTableHeaderCell>
            <CTableHeaderCell>Created At</CTableHeaderCell>
            <CTableHeaderCell>Action</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {filteredTickets.length > 0 ? (
            filteredTickets.map((ticket, index) => (
              <CTableRow key={index}>
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell>{ticket.ticket_id}</CTableDataCell>
                <CTableDataCell>{ticket.department}</CTableDataCell>
                <CTableDataCell>{ticket.subject}</CTableDataCell>
                <CTableDataCell>
                  <CBadge
                    color={
                      ticket.priority === 'Critical'
                        ? 'danger'
                        : ticket.priority === 'High'
                        ? 'warning'
                        : 'primary'
                    }
                  >
                    {ticket.priority}
                  </CBadge>
                </CTableDataCell>
                <CTableDataCell>
                  <CBadge
                    color={
                      ticket.status === 'Resolved'
                        ? 'success'
                        : ticket.status === 'In Progress'
                        ? 'warning'
                        : 'danger'
                    }
                  >
                    {ticket.status}
                  </CBadge>
                </CTableDataCell>
                <CTableDataCell>{ticket.assigned_to}</CTableDataCell>
                <CTableDataCell>{ticket.created_by}</CTableDataCell>
                <CTableDataCell>{ticket.created_at}</CTableDataCell>
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
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan="10" className="text-center text-danger">
                No tickets found.
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>

      {/* 🛠 Update Modal */}
      <CModal
        size="xl"
        scrollable
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        <CModalHeader>
          <CModalTitle>
            Update Ticket:{' '}
            <span className="badge bg-success">{formData.ticket_id}</span>
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedTicket && (
            <CRow>
              {/* Ticket ID & Department */}
              <CCol md={6}>
                <CFormInput
                  type="text"
                  name="ticket_id"
                  value={formData.ticket_id}
                  label="Ticket ID"
                  disabled
                  className="mb-3"
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  type="text"
                  name="department"
                  value={formData.department}
                  label="Department"
                  disabled
                  className="mb-3"
                />
              </CCol>

              {/* Subject & Description */}
              <CCol md={6}>
                <CFormInput
                  type="text"
                  name="subject"
                  value={formData.subject}
                  label="Subject"
                  onChange={handleChange}
                  className="mb-3"
                />
              </CCol>
              <CCol md={6}>
                <CFormTextarea
                  name="description"
                  value={formData.description}
                  label="Description"
                  onChange={handleChange}
                  className="mb-3"
                />
              </CCol>

              {/* Priority & Status */}
              <CCol md={6}>
                <CFormSelect
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  label="Priority"
                  className="mb-3"
                >
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </CFormSelect>
              </CCol>
              <CCol md={6}>
                <CFormSelect
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  label="Status"
                  className="mb-3"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </CFormSelect>
              </CCol>

              {/* Assigned To & Assigned Email */}
              <CCol md={6}>
                <CFormInput
                  type="text"
                  name="assigned_to"
                  value={formData.assigned_to}
                  label="Assigned To"
                  onChange={handleChange}
                  className="mb-3"
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  type="email"
                  name="assigned_to_email"
                  value={formData.assigned_to_email}
                  label="Assigned To Email"
                  onChange={handleChange}
                  className="mb-3"
                />
              </CCol>

              {/* Assigned ID (Disabled) */}
              <CCol md={12}>
                <CFormInput
                  type="text"
                  name="assigned_to_id"
                  value={formData.assigned_to_id}
                  label="Assigned To ID"
                  disabled
                  className="mb-3"
                />
              </CCol>

              {/* Created By & Created At */}
              <CCol md={6}>
                <CFormInput
                  type="text"
                  name="created_by"
                  value={formData.created_by}
                  label="Created By"
                  disabled
                  className="mb-3"
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  type="email"
                  name="created_by_email"
                  value={formData.created_by_email}
                  label="Created By Email"
                  disabled
                  className="mb-3"
                />
              </CCol>

              {/* Created By ID (Disabled) */}
              <CCol md={12}>
                <CFormInput
                  type="text"
                  name="created_by_id"
                  value={formData.created_by_id}
                  label="Created By ID"
                  disabled
                  className="mb-3"
                />
              </CCol>

              {/* Created At (Disabled) */}
              <CCol md={12}>
                <CFormInput
                  type="datetime-local"
                  name="created_at"
                  value={formData.created_at}
                  label="Created At"
                  disabled
                  className="mb-3"
                />
              </CCol>

              {/* If Resolved, Show Resolved By & Resolved At */}
              {formData.status === 'Resolved' && (
                <>
                  <CCol md={6}>
                    <CFormInput
                      type="text"
                      name="resolved_by"
                      value={formData.resolved_by || ''}
                      label="Resolved By"
                      onChange={handleChange}
                      className="mb-3"
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormInput
                      type="email"
                      name="resolved_by_email"
                      value={formData.resolved_by_email || ''}
                      label="Resolved By Email"
                      onChange={handleChange}
                      className="mb-3"
                    />
                  </CCol>

                  {/* Resolved By ID (Disabled) */}
                  <CCol md={12}>
                    <CFormInput
                      type="text"
                      name="resolved_by_id"
                      value={formData.resolved_by_id || ''}
                      label="Resolved By ID"
                      disabled
                      className="mb-3"
                    />
                  </CCol>

                  {/* Resolved At */}
                  <CCol md={12}>
                    <CFormInput
                      type="datetime-local"
                      name="resolved_at"
                      value={formData.resolved_at || ''}
                      label="Resolved At"
                      onChange={handleChange}
                      className="mb-3"
                    />
                  </CCol>
                </>
              )}

              {/* Resolution Notes */}
              <CCol md={12}>
                <CFormTextarea
                  name="resolution_notes"
                  value={formData.resolution_notes}
                  label="Resolution Notes"
                  onChange={handleChange}
                  className="mb-3"
                />
              </CCol>
            </CRow>
          )}
        </CModalBody>

        <CModalFooter>
          <CButton
            size="sm"
            color="secondary"
            onClick={() => setModalVisible(false)}
          >
            Cancel
          </CButton>
          <CButton size="sm" color="primary" onClick={handleUpdate}>
            Save Changes
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default InternalTicketsDashboard;
