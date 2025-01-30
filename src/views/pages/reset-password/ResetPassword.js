import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react';

import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser } from '@coreui/icons';
import toast from 'react-hot-toast';
import { data } from '../../../data'; // Import the data array from data.js
import TayproLogo from '../../../assets/brand/logo-white.png';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Extract internal_users from the data
  const internal_users = data[0].internal_users;

  // Handle form submission
  const handleResetPassword = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      // Check if username exists
      const user = internal_users.find((user) => user.username === username);

      if (!user) {
        toast.error('Username not found');
      } else if (newPassword !== confirmPassword) {
        toast.error('Passwords do not match');
      } else {
        // Logic for resetting the password
        user.password = newPassword; // Update password in memory
        toast.success('Password reset successful!');
        navigate('/login'); // Redirect to login page
      }

      setLoading(false);
    }, 1000); // Simulate a delay for the reset process
  };

  return (
    <div
      className="min-vh-100 d-flex flex-row align-items-center"
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/di0iwc8ql/image/upload/v1724749800/ium0a01kucfsimtbyesq.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        height: '100vh',
      }}
    >
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8} lg={4}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <div className="text-center mb-4">
                    <img
                      src={TayproLogo}
                      alt="Taypro Logo"
                      className="sidebar-brand-full logo"
                      style={{
                        height: '100px',
                        width: '200px',
                        objectFit: 'contain',
                      }}
                    />
                  </div>
                  <CForm onSubmit={handleResetPassword} autoComplete="off">
                    <h1 className="text-center mb-4">Reset Password</h1>

                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Username"
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="New Password"
                        autoComplete="new-password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Confirm New Password"
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton
                          color="primary"
                          className="px-4 py-1"
                          type="submit"
                          disabled={loading}
                        >
                          {loading ? 'Resetting...' : 'Reset Password'}
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton
                          color="link"
                          className="px-0"
                          onClick={() => navigate('/login')}
                        >
                          Back to Login
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default ResetPassword;
