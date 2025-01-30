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
  CRow,
} from '@coreui/react';
import TayproLogo from '../../../assets/brand/logo-white.png';
// import axios from 'axios'

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const loading = false;

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
                  <div className="text-center mb-3">
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
                  <CForm autoComplete="off">
                    <h2 className="text-center mb-4">Forgot Password</h2>

                    <CInputGroup className="mb-3">
                      {/* <CIcon icon={cilEnvelopeClosed} className="me-2 mt-1 5" /> */}
                      <CFormInput
                        type="email"
                        placeholder="Enter your email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={12} className="text-center">
                        <CButton
                          color="primary"
                          className="px-4 py-1 w-100"
                          type="submit"
                          disabled={loading}
                        >
                          {loading ? 'Processing...' : 'Send Reset Link'}
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                  <div className="text-center mt-3">
                    <CButton
                      color="link"
                      className="px-0"
                      onClick={() => navigate('/login')}
                    >
                      Back to Login
                    </CButton>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default ForgotPassword;
