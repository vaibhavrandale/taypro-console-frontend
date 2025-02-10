// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   CButton,
//   CCard,
//   CCardBody,
//   CCardGroup,
//   CCol,
//   CContainer,
//   CForm,
//   CFormInput,
//   CInputGroup,
//   CInputGroupText,
//   CRow,
// } from '@coreui/react';

// import CIcon from '@coreui/icons-react';
// import { cilLockLocked, cilUser } from '@coreui/icons';
// import toast from 'react-hot-toast';
// // import { data } from '../../../data'; // Import the data array from data.js

// import { users, roles } from '../../../../data';
// import TayproLogo from '../../../assets/brand/logo-white.png';

// const ResetPassword = () => {
//   const navigate = useNavigate();
//   const [username, setUsername] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [loading, setLoading] = useState(false);

//   // Extract internal_users from the data
//   const internal_users = data[0].internal_users;

//   // Handle form submission
//   const handleResetPassword = (e) => {
//     e.preventDefault();
//     setLoading(true);

//     setTimeout(() => {
//       // Check if username exists
//       const user = internal_users.find((user) => user.username === username);

//       if (!user) {
//         toast.error('Username not found');
//       } else if (newPassword !== confirmPassword) {
//         toast.error('Passwords do not match');
//       } else {
//         // Logic for resetting the password
//         user.password = newPassword; // Update password in memory
//         toast.success('Password reset successful!');
//         navigate('/login'); // Redirect to login page
//       }

//       setLoading(false);
//     }, 1000); // Simulate a delay for the reset process
//   };

//   return (
//     <div
//       className="min-vh-100 d-flex flex-row align-items-center"
//       style={{
//         backgroundImage:
//           "url('https://res.cloudinary.com/di0iwc8ql/image/upload/v1724749800/ium0a01kucfsimtbyesq.jpg')",
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//         backgroundAttachment: 'fixed',
//         height: '100vh',
//       }}
//     >
//       <CContainer>
//         <CRow className="justify-content-center">
//           <CCol md={8} lg={4}>
//             <CCardGroup>
//               <CCard className="p-4">
//                 <CCardBody>
//                   <div className="text-center mb-4">
//                     <img
//                       src={TayproLogo}
//                       alt="Taypro Logo"
//                       className="sidebar-brand-full logo"
//                       style={{
//                         height: '100px',
//                         width: '200px',
//                         objectFit: 'contain',
//                       }}
//                     />
//                   </div>
//                   <CForm onSubmit={handleResetPassword} autoComplete="off">
//                     <h1 className="text-center mb-4">Reset Password</h1>

//                     <CInputGroup className="mb-3">
//                       <CInputGroupText>
//                         <CIcon icon={cilUser} />
//                       </CInputGroupText>
//                       <CFormInput
//                         placeholder="Username"
//                         autoComplete="username"
//                         value={username}
//                         onChange={(e) => setUsername(e.target.value)}
//                       />
//                     </CInputGroup>
//                     <CInputGroup className="mb-3">
//                       <CInputGroupText>
//                         <CIcon icon={cilLockLocked} />
//                       </CInputGroupText>
//                       <CFormInput
//                         type="password"
//                         placeholder="New Password"
//                         autoComplete="new-password"
//                         value={newPassword}
//                         onChange={(e) => setNewPassword(e.target.value)}
//                       />
//                     </CInputGroup>
//                     <CInputGroup className="mb-4">
//                       <CInputGroupText>
//                         <CIcon icon={cilLockLocked} />
//                       </CInputGroupText>
//                       <CFormInput
//                         type="password"
//                         placeholder="Confirm New Password"
//                         autoComplete="new-password"
//                         value={confirmPassword}
//                         onChange={(e) => setConfirmPassword(e.target.value)}
//                       />
//                     </CInputGroup>
//                     <CRow>
//                       <CCol xs={6}>
//                         <CButton
//                           color="primary"
//                           className="px-4 py-1"
//                           type="submit"
//                           disabled={loading}
//                         >
//                           {loading ? 'Resetting...' : 'Reset Password'}
//                         </CButton>
//                       </CCol>
//                       <CCol xs={6} className="text-right">
//                         <CButton
//                           color="link"
//                           className="px-0"
//                           onClick={() => navigate('/login')}
//                         >
//                           Back to Login
//                         </CButton>
//                       </CCol>
//                     </CRow>
//                   </CForm>
//                 </CCardBody>
//               </CCard>
//             </CCardGroup>
//           </CCol>
//         </CRow>
//       </CContainer>
//     </div>
//   );
// };

// export default ResetPassword;

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
import { users } from '../../../data'; // Use correct data import
import TayproLogo from '../../../assets/brand/logoforwhitebg.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import LoadingSpinner from '../../../components/LoadingSpinner';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Handle form submission
  const handleResetPassword = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      // Find user in `users` array
      const userIndex = users.findIndex((user) => user.email === email);

      if (userIndex === -1) {
        toast.error('Username not found');
      } else if (newPassword.length < 6) {
        toast.error('Password must be at least 6 characters long');
      } else if (newPassword !== confirmPassword) {
        toast.error('Passwords do not match');
      } else {
        // Update password (temporary, should be stored in a database)
        users[userIndex].password = newPassword;
        toast.success('Password reset successful!');
        navigate('/login');
      }

      setLoading(false);
    }, 1000);
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
          <CCol xs={12} sm={10} md={8} lg={5}>
            <CCardGroup>
              <CCard className="p-3">
                <CCardBody>
                  <div className="text-center mb-4">
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
                  <CForm onSubmit={handleResetPassword} autoComplete="off">
                    <h4 className="text-center mb-4">Reset Password</h4>

                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Username"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
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
                        required
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4 position-relative">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        // type="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Confirm New Password"
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
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
                    <CRow>
                      <CCol xs={6}>
                        <CButton
                          color="primary"
                          className="px-4 py-1"
                          type="submit"
                          disabled={
                            !email ||
                            !newPassword ||
                            !confirmPassword ||
                            loading
                          }
                        >
                          {loading ? (
                            <>
                              Resetting...
                              <LoadingSpinner />
                            </>
                          ) : (
                            'Reset Password'
                          )}
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
