// import React from 'react';
// import { Link, useParams } from 'react-router-dom';
// import {
//   CCard,
//   CCardBody,
//   CCol,
//   CContainer,
//   CRow,
//   CCardHeader,
// } from '@coreui/react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import {
//   faUserShield,
//   faUserTie,
//   faCogs,
//   faTools,
//   faBuilding,
// } from '@fortawesome/free-solid-svg-icons';
// import { useSelector } from 'react-redux';
// // import { role_permissions } from '../../data';

// const UserBasedLinkDashboard = () => {
//   // const dispatch = useDispatch(); // ✅ FIXED: Initialize dispatch
//   // const { token } = useParams();

//   // Get userInfo from Redux state
//   const userInfo = useSelector((state) => state.userInfo);

//   // Role-based data as an array
//   const roleRoutes = [
//     {
//       role: 'Master Admin',
//       path: '/master-admin/dashboard',
//       dept: 'Administration',
//       icon: faUserShield,
//     },
//     {
//       role: 'Master User',
//       path: '/master-admin/dashboard',
//       dept: 'Administration',
//       icon: faUserTie,
//     },
//     {
//       role: 'Project Admin',
//       path: '/project-admin/dashboard',
//       dept: 'Project Management',
//       icon: faCogs,
//     },
//     {
//       role: 'Project Engineer',
//       path: '/project-admin/dashboard',
//       dept: 'Project Management',
//       icon: faCogs,
//     },
//     {
//       role: 'Service Admin',
//       path: '/service-admin/dashboard',
//       dept: 'Service Department',
//       icon: faTools,
//     },
//     {
//       role: 'Service User',
//       path: '/service-admin/dashboard',
//       dept: 'Service Department',
//       icon: faTools,
//     },
//     {
//       role: 'Site Technician',
//       path: '/service-admin/dashboard',
//       dept: 'Field Operations',
//       icon: faTools,
//     },
//     {
//       role: 'Client Admin',
//       path: '/client-admin/dashboard',
//       dept: 'Client Management',
//       icon: faBuilding,
//     },
//     {
//       role: 'Client Technician',
//       path: '/client-admin/dashboard',
//       dept: 'Client Management',
//       icon: faBuilding,
//     },
//   ];

//   return (
//     <div className="mt-3  mx-2">
//       <h2 className="text-center mb-4">
//         Welcome, {userInfo && userInfo.username}
//         &nbsp;(
//         {userInfo && userInfo.role})
//       </h2>
//       <CRow>
//         {roleRoutes.map((roleData, index) => (
//           <CCol md={3} key={index} className="mb-4">
//             <CCard className="shadow-lg text-center" style={{ height: '100%' }}>
//               <CCardHeader>
//                 <h5>{roleData.role}</h5>
//                 <p className="text-muted">{roleData.dept}</p>
//               </CCardHeader>
//               <CCardBody>
//                 <FontAwesomeIcon
//                   icon={roleData.icon}
//                   size="3x"
//                   className="mb-3"
//                 />
//                 <br />
//                 <Link to={roleData.path} className="btn btn-primary btn-sm">
//                   Go to {roleData.role} Dashboard
//                 </Link>
//               </CCardBody>
//             </CCard>
//           </CCol>
//         ))}
//       </CRow>
//     </div>
//   );
// };

// export default UserBasedLinkDashboard;

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CRow,
  CCardHeader,
} from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserShield,
  faUserTie,
  faCogs,
  faTools,
  faBuilding,
} from '@fortawesome/free-solid-svg-icons';
// import NetworkStatus from '../NetworkStatus';

const UserBasedLinkDashboard = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    if (!user) {
      navigate('/login'); // Redirect if user is not found
    } else {
      setUserInfo(user);
    }
  }, [navigate]);

  if (!userInfo) {
    return null; // Prevent rendering if user isn't loaded
  }

  // Role-based routes
  const roleRoutes = {
    'Master Admin': {
      path: '/master-admin/dashboard',
      dept: 'Administration',
      icon: faUserShield,
    },
    'Master User': {
      path: '/master-admin/dashboard',
      dept: 'Administration',
      icon: faUserTie,
    },
    'Project Admin': {
      path: '/project-admin/dashboard',
      dept: 'Project Management',
      icon: faCogs,
    },
    'Project Engineer': {
      path: '/project-admin/dashboard',
      dept: 'Project Management',
      icon: faCogs,
    },
    'Service Admin': {
      path: '/service-admin/dashboard',
      dept: 'Service Department',
      icon: faTools,
    },
    'Service User': {
      path: '/service-admin/dashboard',
      dept: 'Service Department',
      icon: faTools,
    },
    'Site Technician': {
      path: '/service-admin/dashboard',
      dept: 'Field Operations',
      icon: faTools,
    },
    'Client Admin': {
      path: '/client-admin/dashboard',
      dept: 'Client Management',
      icon: faBuilding,
    },
    'Client Technician': {
      path: '/client-admin/dashboard',
      dept: 'Client Management',
      icon: faBuilding,
    },
  };

  // Get dashboard details for the logged-in user's role
  const userRoleData = roleRoutes[userInfo.role];

  return (
    <div className="mt-3 mx-2">
      <h2 className="text-center mb-4">
        Welcome, {userInfo.username} &nbsp;({userInfo.role})
      </h2>
      {/* <NetworkStatus /> */}
      <CRow className="justify-content-center">
        {userRoleData ? (
          <CCol md={3} className="mb-4">
            <CCard className="shadow-lg text-center" style={{ height: '100%' }}>
              <CCardHeader>
                <h5>{userInfo.role}</h5>
                <p className="text-muted">{userRoleData.dept}</p>
              </CCardHeader>
              <CCardBody>
                <FontAwesomeIcon
                  icon={userRoleData.icon}
                  size="3x"
                  className="mb-3"
                />
                <br />
                <Link to={userRoleData.path} className="btn btn-primary btn-sm">
                  Go to {userInfo.role} Dashboard
                </Link>
              </CCardBody>
            </CCard>
          </CCol>
        ) : (
          <p className="text-center text-danger">
            No dashboard assigned for your role.
          </p>
        )}
      </CRow>
    </div>
  );
};

export default UserBasedLinkDashboard;
