import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
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
import { departments, role_permissions } from '../../../data'; // Ensure correct path
import LoadingSpinner from '../../../components/LoadingSpinner';
import axios from 'axios';
// import logo from '../../../assets/brand/logoforwhitebg.png';

const UsersDashboard = () => {
  // const { userInfo, authtoken } = useSelector((state) => state);
  const userInfo = useSelector((state) => state.userInfo);
  const authtoken = useSelector((state) => state.authtoken);

  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [users, setUsers] = useState([]); // State for users

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          'https://taypro-console-backend.onrender.com/api/v1/users',
          {
            headers: { authorization: `Bearer ${authtoken}` },
          }
        ); // Replace with your API endpoint

        // setUsers(filteredUsers)
        const data = response.data.data;

        setUsers(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [authtoken, userInfo]); // Runs only once on mount

  // Open Update Modal and Set Selected User Data
  const openModal = (user) => {
    setSelectedUser(user);
    setFormData(user);
    setModalVisible(true);
  };

  // Open Add User Modal
  const openAddModal = () => {
    setFormData({
      id: `U00${users.length + 1}`, // Generate unique user ID
      username: '',
      email: '',
      role: '',
      department: '',
      phone: '',
      type: 'Internal',
      profile_image: '',
    });
    setAddModalVisible(true);
  };

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Update User
  const handleUpdate = () => {
    console.log('Updated User:', formData);
    setModalVisible(false);
  };

  // Handle Add User
  const handleAdd = () => {
    console.log('New User Added:', formData);
    users.push(formData);
    setAddModalVisible(false);
  };

  // Filter Users based on Search Term and ensure they are "Internal" type
  const filteredUsers = users.filter(
    (user) =>
      user.type === 'Internal' &&
      (user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.department.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="">
      {/* <img src={logo} alt="logo" className="border" /> */}
      {/* Search & Add User Button */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 className="text-center">User Management</h2>
        </div>

        <div>
          <CButton
            color="success"
            size="sm"
            className="text-white"
            onClick={openAddModal}
          >
            + Add User
          </CButton>
        </div>
      </div>
      <CRow className="mb-3 justify-content-end">
        {' '}
        <CCol md={4} className="my-2">
          <CFormInput
            type="text"
            placeholder="Search by Name, Email, Role, or Department"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CCol>
      </CRow>

      {/* Users Table */}
      <CTable bordered hover responsive className="text-center">
        <CTableHead color="dark">
          <CTableRow>
            <CTableHeaderCell>#</CTableHeaderCell>
            <CTableHeaderCell>Profile</CTableHeaderCell>
            <CTableHeaderCell>Username</CTableHeaderCell>
            <CTableHeaderCell>Email</CTableHeaderCell>
            <CTableHeaderCell>Role</CTableHeaderCell>
            <CTableHeaderCell>Department</CTableHeaderCell>
            <CTableHeaderCell>Phone</CTableHeaderCell>
            <CTableHeaderCell>Action</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        {/* <CTableBody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) =>
              loading ? (
                <LoadingSpinner />
              ) : (
                <CTableRow key={index}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>
                    <img
                      src={user.profile_image}
                      alt="Profile"
                      className="rounded-circle"
                      width="50"
                      height="50"
                    />
                  </CTableDataCell>
                  <CTableDataCell>{user.username}</CTableDataCell>
                  <CTableDataCell>{user.email}</CTableDataCell>
                  <CTableDataCell>{user.role}</CTableDataCell>
                  <CTableDataCell>{user.department}</CTableDataCell>
                  <CTableDataCell>{user.phone}</CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      color="primary"
                      size="sm"
                      onClick={() => openModal(user)}
                    >
                      Update
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              )
            )
          ) : (
            <CTableRow>
              <CTableDataCell colSpan="8" className="text-center text-danger">
                No users found.
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody> */}

        <CTableBody>
          {loading ? (
            <CTableRow>
              <CTableDataCell colSpan="8" className="text-center">
                <LoadingSpinner />
              </CTableDataCell>
            </CTableRow>
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) => (
              <CTableRow key={index}>
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell>
                  <img
                    src={user.profile_image}
                    alt="Profile"
                    className="rounded-circle"
                    width="50"
                    height="50"
                  />
                </CTableDataCell>
                <CTableDataCell>{user.username}</CTableDataCell>
                <CTableDataCell>{user.email}</CTableDataCell>
                <CTableDataCell>{user.role}</CTableDataCell>
                <CTableDataCell>{user.department}</CTableDataCell>
                <CTableDataCell>{user.phone}</CTableDataCell>
                <CTableDataCell>
                  <CButton
                    color="primary"
                    size="sm"
                    onClick={() => openModal(user)}
                  >
                    Update
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan="8" className="text-center text-danger">
                No users found.
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>

      {/* Update User Modal */}
      <CModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        backdrop
      >
        <CModalHeader>
          <CModalTitle>Update User - {formData.username}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormLabel>Username</CFormLabel>
          <CFormInput
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          <CFormLabel>Email</CFormLabel>
          <CFormInput
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <CFormLabel>Role</CFormLabel>
          <CFormInput
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
          />
          <CFormLabel>Department</CFormLabel>
          <CFormInput
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
          />
          <CFormLabel>Phone</CFormLabel>
          <CFormInput
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
          <CFormLabel>Image</CFormLabel>

          <CFormInput
            type="file"
            name="profile_image"
            onChange={handleChange}
          />
          <div className="m-2 ">
            <img
              src={formData.profile_image}
              alt={formData.username}
              className="img-fluid"
            />
            <br />
            <span className="text-mutes">(Available Image)</span>
          </div>
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

      <CModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        backdrop
      >
        <CModalHeader>
          <CModalTitle>Add New User</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {/* Username */}
          <CFormLabel>Username</CFormLabel>
          <CFormInput
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />

          {/* Email */}
          <CFormLabel>Email</CFormLabel>
          <CFormInput
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />

          {/* Role Dropdown */}
          <CFormLabel>Role</CFormLabel>
          <CFormSelect
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="">Select Role</option>
            {role_permissions.map((role, index) => (
              <option key={index} value={role.role}>
                {role.role}
              </option>
            ))}
          </CFormSelect>

          {/* Department Dropdown */}
          <CFormLabel>Department</CFormLabel>
          <CFormSelect
            name="department"
            value={formData.department}
            onChange={handleChange}
          >
            <option value="">Select Department</option>
            {departments.map((dept, index) => (
              <option key={index} value={dept.department}>
                {dept.department}
              </option>
            ))}
          </CFormSelect>

          {/* Auto-Filled Department Email (Hidden Input) */}
          <CFormInput
            type="hidden"
            name="department_email"
            value={formData.department_email}
          />

          {/* Phone */}
          <CFormLabel>Phone</CFormLabel>
          <CFormInput
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />

          {/* Profile Image Upload */}
          <CFormLabel>Profile Image</CFormLabel>
          <CFormInput type="file" name="profile_image" />
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            size="sm"
            onClick={() => setAddModalVisible(false)}
          >
            Cancel
          </CButton>
          <CButton
            color="success"
            size="sm"
            className="text-white"
            onClick={() => handleAdd(formData)}
          >
            Add User
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Add User Modal
      <CModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        backdrop
      >
        <CModalHeader>
          <CModalTitle>Add New User</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormLabel>Username</CFormLabel>
          <CFormInput
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          <CFormLabel>Email</CFormLabel>
          <CFormInput
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <CFormLabel>Role</CFormLabel>
          <CFormInput
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
          />
          <CFormLabel>Department</CFormLabel>
          <CFormInput
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
          />
          <CFormLabel>Phone</CFormLabel>
          <CFormInput
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
          <CFormLabel>Profile Image </CFormLabel>
          <CFormInput
            type="file"
            name="profile_image"
            value={formData.profile_image}
            onChange={handleChange}
          />
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            size="sm"
            onClick={() => setAddModalVisible(false)}
          >
            Cancel
          </CButton>
          <CButton
            color="success"
            size="sm"
            className="text-white"
            onClick={handleAdd}
          >
            Add User
          </CButton>
        </CModalFooter>
      </CModal> */}
    </div>
  );
};

export default UsersDashboard;
