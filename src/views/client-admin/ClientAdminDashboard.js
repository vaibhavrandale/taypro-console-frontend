import React from 'react';
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardTitle,
  CCardText,
} from '@coreui/react';
import { Link } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import {
  //   cilSpeedometer,
  cilUser,
  cilSettings,
  cilChartPie,
  cilList,
  cilFolderOpen,
  cilTask,
  //   cilPeople,
  cilBell,
  cilEnvelopeOpen,
} from '@coreui/icons';

const dashboardItems = [
  //   { id: 1, title: 'Dashboard', icon: cilSpeedometer, link: '/dashboard' },
  {
    id: 2,
    title: 'Users',
    icon: cilUser,
    link: '/client-admin/users',
  },

  { id: 3, title: 'Reports', icon: cilChartPie, link: '/client-admin/reports' },
  { id: 4, title: 'Service', icon: cilTask, link: '/client-admin/service' },
  {
    id: 5,
    title: 'Notifications',
    icon: cilBell,
    link: '/client-admin/notifications',
  },
  {
    id: 6,
    title: 'Live chat',
    icon: cilEnvelopeOpen,
    link: '/client-admin/messages',
  },
  {
    id: 7,
    title: 'Projects',
    icon: cilFolderOpen,
    link: '/client-admin/projects',
  },
  {
    id: 8,
    title: 'Roles & Permissions',
    icon: cilList,
    link: '/client-admin/roles',
  },
  {
    id: 9,
    title: 'Settings',
    icon: cilSettings,
    link: '/client-admin/settings',
  },
];

const ClientAdminDashboard = () => {
  return (
    <CContainer fluid className="">
      <h3 className="text-center my-2 text-primary">Dashboard</h3>
      <CRow className="g-4 my-3">
        {dashboardItems.map((item) => (
          <CCol md={4} lg={3} key={item.id}>
            <CCard className="shadow-sm border-0 text-center">
              <CCardBody>
                <CIcon
                  icon={item.icon}
                  size="xxl"
                  className="text-primary mb-3"
                />
                <CCardTitle>{item.title}</CCardTitle>
                <CCardText>
                  <Link to={item.link} className="text-decoration-none">
                    Go to {item.title}
                  </Link>
                </CCardText>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>
    </CContainer>
  );
};

export default ClientAdminDashboard;
