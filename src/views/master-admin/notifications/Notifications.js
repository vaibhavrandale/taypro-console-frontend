// import React, { useState } from 'react';
// import {
//   CTable,
//   CTableHead,
//   CTableRow,
//   CTableHeaderCell,
//   CTableBody,
//   CTableDataCell,
//   CFormInput,
//   CBadge,
//   CRow,
//   CCol,
//   CAvatar,
// } from '@coreui/react';
// import { notifications } from '../../../data';
// import CIcon from '@coreui/icons-react';
// import { cilPeople } from '@coreui/icons';

// const Notifications = () => {
//   const [searchTerm, setSearchTerm] = useState('');

//   // 🔍 Filter Notifications Based on Search
//   const filteredNotifications = notifications.filter(
//     (notification) =>
//       notification.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       notification.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       notification.performed_by.username
//         .toLowerCase()
//         .includes(searchTerm.toLowerCase()) ||
//       notification.performed_by.email
//         .toLowerCase()
//         .includes(searchTerm.toLowerCase()) ||
//       notification.location.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="m-2">
//       <h2>📢 System Notifications</h2>

//       {/* 🔍 Search Input */}
//       <CRow className="justify-content-end">
//         <CCol md={4}>
//           <CFormInput
//             type="text"
//             placeholder="Search by Action, Module, User, or Location"
//             className="mb-3"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </CCol>
//       </CRow>

//       {/* 🔔 Notifications Table */}
//       <CTable bordered hover responsive className="text-center">
//         <CTableHead color="dark">
//           <CTableRow>
//             <CTableHeaderCell>#</CTableHeaderCell>
//             <CTableHeaderCell>
//               <CIcon icon={cilPeople} />
//             </CTableHeaderCell>
//             <CTableHeaderCell>Performed By</CTableHeaderCell>
//             <CTableHeaderCell>Action</CTableHeaderCell>
//             <CTableHeaderCell>Module</CTableHeaderCell>
//             <CTableHeaderCell>Details</CTableHeaderCell>
//             <CTableHeaderCell>Role</CTableHeaderCell>
//             <CTableHeaderCell>Timestamp</CTableHeaderCell>
//             <CTableHeaderCell>Location</CTableHeaderCell>
//             <CTableHeaderCell>Status</CTableHeaderCell>
//           </CTableRow>
//         </CTableHead>
//         <CTableBody>
//           {filteredNotifications.length > 0 ? (
//             filteredNotifications.map((notification, index) => (
//               <CTableRow key={index}>
//                 <CTableDataCell>{index + 1}</CTableDataCell>
//                 <CTableDataCell>
//                   <CAvatar
//                     className="me-3"
//                     size="md"
//                     src={notification.performed_by.profile_image}
//                     status={
//                       notification.status === 'Read' ? 'success' : 'danger'
//                     }
//                   />
//                 </CTableDataCell>
//                 <CTableDataCell>
//                   {notification.performed_by.username}
//                   <br />
//                   <small className="text-muted">
//                     {notification.performed_by.email}
//                   </small>
//                 </CTableDataCell>
//                 <CTableDataCell>{notification.action}</CTableDataCell>
//                 <CTableDataCell>{notification.module}</CTableDataCell>
//                 <CTableDataCell>{notification.details}</CTableDataCell>
//                 <CTableDataCell>
//                   {notification.performed_by.role}
//                 </CTableDataCell>
//                 <CTableDataCell>{notification.timestamp}</CTableDataCell>
//                 <CTableDataCell>{notification.location}</CTableDataCell>
//                 <CTableDataCell>
//                   <CBadge
//                     color={
//                       notification.status === 'Unread' ? 'danger' : 'success'
//                     }
//                   >
//                     {notification.status}
//                   </CBadge>
//                 </CTableDataCell>
//               </CTableRow>
//             ))
//           ) : (
//             <CTableRow>
//               <CTableDataCell colSpan="10" className="text-center text-danger">
//                 No notifications found.
//               </CTableDataCell>
//             </CTableRow>
//           )}
//         </CTableBody>
//       </CTable>
//     </div>
//   );
// };

// export default Notifications;

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
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react';
import { notifications } from '../../../data';
import CIcon from '@coreui/icons-react';
import { cilPeople } from '@coreui/icons';

const Notifications = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [readUsers, setReadUsers] = useState([]);

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
        .includes(searchTerm.toLowerCase())
  );

  // 📌 Open Read Users Modal
  const handleViewReadUsers = (notification) => {
    setReadUsers(notification.read_status || []);
    setShowModal(true);
  };

  return (
    <div className="m-2">
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
            {/* <CTableHeaderCell>Location</CTableHeaderCell> */}
            {/* <CTableHeaderCell>Status</CTableHeaderCell> */}
            <CTableHeaderCell>Read By</CTableHeaderCell>
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
                <CTableDataCell>
                  {notification.details.length > 30
                    ? `${notification.details}`
                    : notification.details}
                </CTableDataCell>
                <CTableDataCell>
                  {notification.performed_by.role}
                </CTableDataCell>
                <CTableDataCell>{notification.timestamp}</CTableDataCell>
                {/* <CTableDataCell>{notification.location}</CTableDataCell> */}
                {/* <CTableDataCell>
                  <CBadge
                    color={
                      notification.read_status.some((r) => r.read)
                        ? 'success'
                        : 'danger'
                    }
                  >
                    {notification.read_status.some((r) => r.read)
                      ? 'Read'
                      : 'Unread'}
                  </CBadge>
                </CTableDataCell> */}
                <CTableDataCell>
                  <CButton
                    color="secondary"
                    size="sm"
                    onClick={() => handleViewReadUsers(notification)}
                  >
                    View
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan="11" className="text-center text-danger">
                No notifications found.
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>

      {/* 📌 Read Users Modal */}
      <CModal
        scrollable
        size="lg"
        visible={showModal}
        onClose={() => setShowModal(false)}
      >
        <CModalHeader closeButton>
          <CModalTitle>📖 Read Users</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {readUsers.length > 0 ? (
            <CTable bordered hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>#</CTableHeaderCell>
                  <CTableHeaderCell>User ID</CTableHeaderCell>
                  <CTableHeaderCell>User Name</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {readUsers.map((user, index) => (
                  <CTableRow key={user.id}>
                    <CTableDataCell>{index + 1}</CTableDataCell>
                    <CTableDataCell>{user.readbyId}</CTableDataCell>
                    <CTableDataCell>{user.readByName}</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={user.read ? 'success' : 'danger'}>
                        {user.read ? 'Read' : 'Unread'}
                      </CBadge>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          ) : (
            <p className="text-center text-muted">No users have read this.</p>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            size="sm"
            onClick={() => setShowModal(false)}
          >
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default Notifications;
