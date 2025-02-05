import React, { useState } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CForm,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CRow,
  CCol,
  CListGroup,
  CListGroupItem,
} from '@coreui/react';

import { users, departments } from '../../../data';
import './internaltickts.css';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const CreateInternalTicket = () => {
  const [formData, setFormData] = useState({
    ticket_id: `IT-${Date.now()}`, // Generate unique Ticket ID
    department: '',
    subject: '',
    description: '',
    priority: 'Medium',
    status: 'Open',
    assigned_to: '',
    assigned_to_email: '',
    assigned_to_id: '',
    created_by: 'Current User', // Replace with Authenticated User
    created_by_email: 'currentuser@taypro.in', // Replace with Authenticated User Email
    created_by_id: 'user123', // Replace with Authenticated User ID
    created_at: new Date().toISOString().slice(0, 16), // Format Date
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const navigate = useNavigate();
  // Handle Form Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Department Selection & Auto-Fill Department Email
  const handleDepartmentChange = (e) => {
    const selectedDepartment = e.target.value;
    const departmentData = departments.find(
      (dept) => dept.department === selectedDepartment
    );

    setFormData({
      ...formData,
      department: selectedDepartment,
      department_email: departmentData ? departmentData.email : '',
    });
  };

  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term.length === 0) {
      // If user clears the input, reset assigned fields
      setFormData({
        ...formData,
        assigned_to: '',
        assigned_to_email: '',
        assigned_to_id: '',
      });
      setFilteredUsers([]);
      return;
    }

    // Filter users by email
    const filteredUserEmails = users.filter((user) =>
      user.email.toLowerCase().includes(term)
    );

    // Filter departments by email
    const filteredDepartmentEmails = departments.filter((dept) =>
      dept.email.toLowerCase().includes(term)
    );

    // Combine both results
    const combinedResults = [
      ...filteredUserEmails.map((user) => ({
        username: user.username,
        email: user.email,
        id: user.id,
      })),
      ...filteredDepartmentEmails.map((dept) => ({
        username: dept.department,
        email: dept.email,
        id: dept.id, // Unique ID for departments
      })),
    ];

    setFilteredUsers(combinedResults);
  };

  const selectUser = (item) => {
    setFormData({
      ...formData,
      assigned_to: item.username,
      assigned_to_email: item.email,
      assigned_to_id: item.id,
    });

    setSearchTerm(item.email); // Show the selected email in the input
    setFilteredUsers([]); // Hide search results
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('New Ticket Created:', formData);
    toast.success('Ticket Created Successfully!');
    navigate('/master-admin/internal-tickets');
    // 🚀 Send Data to Backend or Store in State
  };

  return (
    <CRow className="justify-content-center mt-2">
      <CCol md={12}>
        <CCard className="shadow">
          <CCardHeader>
            <h4>Create New Internal Ticket</h4>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              <CRow>
                {/* Department */}
                {/* <CCol md={6}>
                  <CFormSelect
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    label="To Department"
                    required
                    className="mb-3"
                  >
                    {departments
                      .sort((a, b) => a.department.localeCompare(b.department)) // Sorting Alphabetically
                      .map((item, index) => (
                        <option key={index} value={item.department}>
                          {item.department} -{item.email}
                        </option>
                      ))}
                  </CFormSelect>
                  <CFormInput
                    type="hidden"
                    name="department_email"
                    value={formData.department_email}
                    onChange={handleChange}
                    label=""
                    required
                    className="mb-3"
                  />
                </CCol> */}

                <CCol md={6}>
                  <CFormSelect
                    name="department"
                    value={formData.department}
                    onChange={handleDepartmentChange}
                    label="To Department"
                    required
                    className=""
                  >
                    <option value="">Select Department</option>
                    {departments
                      .sort((a, b) => a.department.localeCompare(b.department)) // Sorting Alphabetically
                      .map((item, index) => (
                        <option key={index} value={item.department}>
                          {item.department}
                        </option>
                      ))}
                  </CFormSelect>
                  <span className="mx-1 text-danger mb-3">
                    {formData.department_email}
                  </span>
                  {formData.department_email ? (
                    <span className="text-muted">(this email is for cc)</span>
                  ) : (
                    ''
                  )}
                  {/* Hidden Department Email Field (Auto-Filled) */}
                  <CFormInput
                    type="hidden"
                    name="department_email"
                    value={formData.department_email}
                    label=""
                    disabled
                    className="mb-3"
                  />
                </CCol>

                {/* Subject */}
                <CCol md={6}>
                  <CFormInput
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    label="Subject"
                    required
                    className="mb-3"
                  />
                </CCol>

                {/* Description */}
                <CCol md={12}>
                  <CFormTextarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    label="Description"
                    required
                    className="mb-3"
                  />
                </CCol>

                {/* Priority */}
                <CCol md={6}>
                  <CFormSelect
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    label="Priority"
                    className="mb-3"
                  >
                    <option value="" selected>
                      Select
                    </option>
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </CFormSelect>
                </CCol>

                {/* Assign To Email (Search) */}
                <CCol md={6}>
                  <CFormInput
                    type="email"
                    name="assigned_to_email"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    label="Assign To Email"
                    className="mb-3"
                    placeholder="Search by email..."
                  />

                  {/* 📌 Display Search Suggestions */}
                  {filteredUsers.length > 0 && (
                    <CListGroup className="mb-3" id="userlist">
                      {filteredUsers.map((user) => (
                        <CListGroupItem
                          id="userlistitem"
                          key={user.id}
                          action
                          onClick={() => selectUser(user)}
                        >
                          {user.username} - {user.email}
                        </CListGroupItem>
                      ))}
                    </CListGroup>
                  )}
                </CCol>

                {/* Assigned To Name (Auto-filled) */}
                <CCol md={6}>
                  <CFormInput
                    type="text"
                    name="assigned_to"
                    readOnly
                    value={formData.assigned_to}
                    label="Assign To"
                    className="mb-3"
                  />
                </CCol>

                {/* Created At (Auto-Filled) */}
                {/* <CCol md={6}>
                  <CFormInput
                    type="datetime-local"
                    name="created_at"
                    value={formData.created_at}
                    label="Created At"
                    disabled
                    className="mb-3"
                  />
                </CCol> */}

                <CCol md={12}>
                  <CButton className="" type="submit" color="primary">
                    Create
                  </CButton>
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default CreateInternalTicket;
