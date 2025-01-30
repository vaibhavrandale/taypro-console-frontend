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
import { data } from '../../../data';
import LoadingSpinner from '../../../components/LoadingSpinner';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Extract roles and users from the data
  const roles = data[0].roles;

  // Handle form submission
  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      let matchedUser = null;
      let matchedRole = null;

      // Check if the username and password match any user in the roles
      for (const role of roles) {
        const user = role.users.find(
          (user) => user.email === username && user.password === password
        );
        if (user) {
          matchedUser = user;
          matchedRole = role;
          break;
        }
      }

      if (matchedUser && matchedRole) {
        toast.success(`Welcome, ${matchedUser.username}!`);

        // Navigate to a specific route based on role
        switch (matchedRole.role) {
          case 'Master Admin':
            navigate('/dashboard/admin');
            break;
          case 'Project Engineer':
            navigate('/dashboard/project-engineer');
            break;
          case 'Service Admin':
            navigate('/dashboard/service-admin');
            break;
          case 'Site Technician':
            navigate('/dashboard/site-technician');
            break;
          case 'Client Admin':
            navigate('/dashboard/client-admin');
            break;
          case 'Client Technician':
            navigate('/dashboard/client-technician');
            break;
          default:
            navigate('/dashboard');
            break;
        }
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
                        style={{ cursor: 'pointer' }}
                      >
                        <FontAwesomeIcon
                          icon={showPassword ? faEyeSlash : faEye}
                        />
                      </CInputGroupText>
                    </CInputGroup>

                    <CRow className="d-flex justify-content-between align-items-center">
                      <CCol xs="6">
                        <CButton
                          color="primary"
                          className="w-100 py-2"
                          type="submit"
                        >
                          {loading ? (
                            <>
                              <LoadingSpinner /> Logging in...
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
