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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import TayproLogo from '../../../assets/brand/logo-white.png';
import toast from 'react-hot-toast';
import { users } from '../../../data';
import LoadingSpinner from '../../../components/LoadingSpinner';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      // Find user directly from the users array
      const matchedUser = users.find(
        (user) => user.email === username && user.password === password
      );

      if (matchedUser) {
        // Save user details in localStorage for session persistence
        localStorage.setItem('loggedInUser', JSON.stringify(matchedUser));

        toast.success(`Welcome, ${matchedUser.username}!`);

        // Role-based redirection
        const roleRoutes = {
          'Master Admin': '/master-admin/dashboard',
          'Master User': '/master-admin/dashboard',
          'Project Admin': '/project-admin/dashboard',
          'Project Engineer': '/project-admin/dashboard',
          'Service Admin': '/service-admin/dashboard',
          'Service User': '/service-admin/dashboard',
          'Site Technician': '/service-admin/dashboard',
          'Client Admin': '/client-admin/dashboard',
          'Client Technician': '/client-admin/dashboard',
        };

        navigate(roleRoutes[matchedUser.role]);
      } else {
        toast.error('Invalid username or password');
      }

      setLoading(false);
    }, 1000);
  };

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center min-vh-100"
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
          <CCol xs={12} sm={10} md={8} lg={5}>
            <CCardGroup>
              <CCard className="p-3 shadow-lg border-0">
                <CCardBody>
                  <div className="text-center mb-3">
                    <img
                      src={TayproLogo}
                      alt="Taypro Logo"
                      className=""
                      style={{
                        height: '80px',
                        objectFit: 'cover',
                        width: 'auto',
                      }}
                    />
                  </div>
                  <CForm onSubmit={handleLogin} autoComplete="off">
                    <h2 className="text-center mb-4">Login</h2>

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
                    {/* 
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />

                      <CInputGroupText
                        onClick={() => setShowPassword(!showPassword)}
                        className="  border-0"
                        style={{ cursor: 'pointer', background: 'transparent' }}
                      >
                        <FontAwesomeIcon
                          icon={showPassword ? faEyeSlash : faEye}
                        />
                      </CInputGroupText>
                    </CInputGroup>
                    
                    */}

                    <CInputGroup className="mb-4 position-relative">
                      {/* Lock Icon */}
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>

                      {/* Password Input */}
                      <CFormInput
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="" // Ensure space for the icon
                      />

                      {/* Show/Hide Password Button (Inside Input) */}
                      <CInputGroupText
                        onClick={() => setShowPassword(!showPassword)}
                        className="border-0 bg-transparent position-absolute"
                        style={{
                          right: '10px', // Adjust position inside input
                          top: '50%',
                          transform: 'translateY(-50%)',
                          cursor: 'pointer',
                          zIndex: 10, // Ensure it stays on top
                        }}
                      >
                        <FontAwesomeIcon
                          icon={showPassword ? faEyeSlash : faEye}
                        />
                      </CInputGroupText>
                    </CInputGroup>

                    <CRow className="d-flex justify-content-between align-items-center">
                      <CCol xs="6">
                        <CButton
                          color="success"
                          style={{ color: 'white' }}
                          className="px-4 py-1"
                          type="submit"
                          disabled={!username || !password || loading}
                        >
                          {loading ? (
                            <>
                              Login..
                              <LoadingSpinner />
                            </>
                          ) : (
                            'Login'
                          )}
                        </CButton>
                      </CCol>
                      <CCol xs="6" className="text-end">
                        <CButton
                          color="link"
                          className="px-0"
                          href="forgot-password"
                        >
                          Forgot password?
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

export default Login;
