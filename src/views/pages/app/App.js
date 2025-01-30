import React from 'react';
import { CRow, CCol, CLink } from '@coreui/react';
import { cilHome, cilUser, cilSettings, cilInfo } from '@coreui/icons';
import CIcon from '@coreui/icons-react';

const App = () => {
  return (
    <CRow
      className="text-center d-flex align-items-center justify-content-center flex-wrap"
      style={{
        height: '70vh',
      }}
    >
      <CCol xs="1" className="my-3">
        <CLink href="/home" className="text-decoration-none link-item">
          <CIcon icon={cilHome} size="xl" className="mb-2" />
          <div style={{ fontSize: '16px', fontWeight: 'bold' }}>Home</div>
        </CLink>
      </CCol>

      <CCol xs="1" className="my-3">
        <CLink
          href="/profile"
          className="text-decoration-none link-item"
          style={{
            display: 'inline-block',
            color: '#198754', // Green color
            textAlign: 'center',
            padding: '10px',
            borderRadius: '6px',
            transition: 'transform 0.3s ease, background-color 0.3s ease',
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = '#e9ffe9')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = 'transparent')
          }
        >
          <CIcon icon={cilUser} size="xl" className="mb-2" />
          <div style={{ fontSize: '16px', fontWeight: 'bold' }}>Profile</div>
        </CLink>
      </CCol>

      <CCol xs="1" className="my-3">
        <CLink
          href="/settings"
          className="text-decoration-none link-item"
          style={{
            display: 'inline-block',
            color: '#ffc107', // Yellow color
            textAlign: 'center',
            padding: '10px',
            borderRadius: '6px',
            transition: 'transform 0.3s ease, background-color 0.3s ease',
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = '#fffbe6')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = 'transparent')
          }
        >
          <CIcon icon={cilSettings} size="xl" className="mb-2" />
          <div style={{ fontSize: '16px', fontWeight: 'bold' }}>Settings</div>
        </CLink>
      </CCol>

      <CCol xs="1" className="my-3">
        <CLink
          href="/about"
          className="text-decoration-none link-item"
          style={{
            display: 'inline-block',
            color: '#dc3545', // Red color
            textAlign: 'center',
            padding: '10px',
            borderRadius: '6px',
            transition: 'transform 0.3s ease, background-color 0.3s ease',
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = '#ffe9e9')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = 'transparent')
          }
        >
          <CIcon icon={cilInfo} size="xl" className="mb-2" />
          <div style={{ fontSize: '16px', fontWeight: 'bold' }}>About</div>
        </CLink>
      </CCol>
    </CRow>
  );
};

export default App;
