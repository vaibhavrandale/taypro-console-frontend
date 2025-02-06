import React, { useState } from 'react';
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormInput,
  CBadge,
  CRow,
  CCol,
  CAvatar,
} from '@coreui/react';
import { notifications } from '../../../data';
import CIcon from '@coreui/icons-react';
import { cilPeople } from '@coreui/icons';

const Notifications = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // 🔍 Filter Notifications Based on Search
  const filteredNotifications = notifications.filter(
    (notification) =>
      notification.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.performed_by.username
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      notification.performed_by.email
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      notification.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <h2>📢 System Notifications</h2>

      {/* 🔍 Search Input */}
      <CRow className="justify-content-end">
        <CCol md={4}>
          <CFormInput
            type="text"
            placeholder="Search by Action, Module, User, or Location"
            className="mb-3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CCol>
      </CRow>

      {/* 🔔 Notifications Table */}
      <CTable bordered hover responsive className="text-center">
        <CTableHead color="dark">
          <CTableRow>
            <CTableHeaderCell>#</CTableHeaderCell>
            <CTableHeaderCell>
              <CIcon icon={cilPeople} />
            </CTableHeaderCell>
            <CTableHeaderCell>Performed By</CTableHeaderCell>
            <CTableHeaderCell>Action</CTableHeaderCell>
            <CTableHeaderCell>Module</CTableHeaderCell>
            <CTableHeaderCell>Details</CTableHeaderCell>
            <CTableHeaderCell>Role</CTableHeaderCell>
            <CTableHeaderCell>Timestamp</CTableHeaderCell>
            <CTableHeaderCell>Location</CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification, index) => (
              <CTableRow key={index}>
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell>
                  <CAvatar
                    className="me-3"
                    size="md"
                    src={notification.performed_by.profile_image}
                    status={
                      notification.status === 'Read' ? 'success' : 'danger'
                    }
                  />
                </CTableDataCell>
                <CTableDataCell>
                  {notification.performed_by.username}
                  <br />
                  <small className="text-muted">
                    {notification.performed_by.email}
                  </small>
                </CTableDataCell>
                <CTableDataCell>{notification.action}</CTableDataCell>
                <CTableDataCell>{notification.module}</CTableDataCell>
                <CTableDataCell>{notification.details}</CTableDataCell>
                <CTableDataCell>
                  {notification.performed_by.role}
                </CTableDataCell>
                <CTableDataCell>{notification.timestamp}</CTableDataCell>
                <CTableDataCell>{notification.location}</CTableDataCell>
                <CTableDataCell>
                  <CBadge
                    color={
                      notification.status === 'Unread' ? 'danger' : 'success'
                    }
                  >
                    {notification.status}
                  </CBadge>
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan="10" className="text-center text-danger">
                No notifications found.
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>
    </div>
  );
};

export default Notifications;
