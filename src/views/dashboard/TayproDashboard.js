import React, { useState } from 'react';
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CImage,
  CButton,
  CModalFooter,
  CModalBody,
  CModalTitle,
  CModalHeader,
  CModal,
  CInputGroup,
  CFormInput,
} from '@coreui/react';
import { sites, robots } from '../../data'; // Import sites and robots data
import TayproLogo from '../../assets/brand/logo-white.png';

const TayproDashboard = () => {
  // ✅ Separate state for Online & Offline modals
  const [activeOnlineSite, setActiveOnlineSite] = useState(null);
  const [activeOfflineSite, setActiveOfflineSite] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  // Calculate Total Robots, Online, and Offline
  const totalRobots = robots.length;
  const onlineRobots = robots.filter((robot) => robot.lora_state === 1).length;
  const offlineRobots = totalRobots - onlineRobots;

  return (
    <CContainer fluid>
      {/* 🔹 Logo */}
      <div className="text-center">
        <CImage fluid src={TayproLogo} width={200} height={200} />
      </div>

      {/* 🔹 Summary Section */}
      <CRow className="my-3 text-center">
        <CCol md={4} className="my-2">
          <CCard className="shadow-sm border-0">
            <CCardBody>
              <h6 className="fw-bold">Total Robots</h6>
              <h4>{totalRobots}</h4>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={4} className="my-2">
          <CCard className="shadow-sm border-0">
            <CCardBody>
              <h6 className="fw-bold text-success">Online Robots</h6>
              <h4>{onlineRobots}</h4>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={4} className="my-2">
          <CCard className="shadow-sm border-0">
            <CCardBody>
              <h6 className="fw-bold text-danger">Offline Robots</h6>
              <h4>{offlineRobots}</h4>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* 🔹 Site-wise Robot Stats */}
      <CRow className="mt-4">
        {sites.map((site) => {
          // Get Robots for this Site
          const siteRobots = robots.filter(
            (robot) => robot.site_id === site.site_id
          );
          const onlineRobots = siteRobots.filter(
            (robot) => robot.lora_state === 1
          );

          const offlineRobots = siteRobots.filter(
            (robot) => robot.lora_state === 0
          );

          const total = siteRobots.length;
          const online = onlineRobots.length;
          const offline = offlineRobots.length;

          return (
            <CCol md={4} key={site.id} className="mb-3">
              <CCard className="shadow-sm border-0">
                <CCardBody>
                  {/* Client Logo */}
                  <div className="text-center">
                    <img
                      src={site.logo}
                      alt={site.siteName}
                      style={{
                        width: '120px',
                        height: '70px',
                        objectFit: 'contain',
                      }}
                    />
                  </div>

                  {/* Client Name */}
                  <h6 className="text-center fw-bold mt-3">
                    {site.siteName}, {site.location}
                  </h6>

                  {/* Robot Status Table */}
                  <CTable striped responsive className="mt-2">
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell className="text-center">
                          Total
                        </CTableHeaderCell>
                        <CTableHeaderCell className="text-center">
                          Online
                        </CTableHeaderCell>
                        <CTableHeaderCell className="text-center">
                          Offline
                        </CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      <CTableRow>
                        <CTableDataCell className="text-center">
                          <CBadge color="primary">{total}</CBadge>
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          {/* ✅ Clickable Badge to Open Online Modal */}
                          <CBadge
                            color="success"
                            onClick={() => setActiveOnlineSite(site.site_id)}
                            style={{ cursor: 'pointer' }}
                          >
                            {online}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          {/* ✅ Clickable Badge to Open Offline Modal */}
                          <CBadge
                            color="danger"
                            onClick={() => setActiveOfflineSite(site.site_id)}
                            style={{ cursor: 'pointer' }}
                          >
                            {offline}
                          </CBadge>
                        </CTableDataCell>
                      </CTableRow>
                    </CTableBody>
                  </CTable>
                </CCardBody>
              </CCard>

              {/* ✅ Online Robots Modal */}
              <CModal
                scrollable
                size="xl"
                visible={activeOnlineSite === site.site_id}
                onClose={() => setActiveOnlineSite(null)}
              >
                <CModalHeader>
                  <CModalTitle>
                    {site.siteName} - Online Robots List
                  </CModalTitle>
                </CModalHeader>
                <CModalBody>
                  <>
                    <CRow className="justify-content-end">
                      <CCol xs={12} sm={10} md={6} lg={4}>
                        <CInputGroup className="mb-3">
                          <CFormInput
                            type="text"
                            placeholder="Search Robot..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </CInputGroup>
                      </CCol>
                    </CRow>
                    <CTable responsive hover bordered>
                      <CTableHead>
                        <CTableRow>
                          <CTableHeaderCell style={{ minWidth: '20px' }}>
                            #
                          </CTableHeaderCell>
                          <CTableHeaderCell style={{ minWidth: '150px' }}>
                            Robot No
                          </CTableHeaderCell>
                          <CTableHeaderCell style={{ minWidth: '150px' }}>
                            Deveui
                          </CTableHeaderCell>
                          <CTableHeaderCell style={{ minWidth: '150px' }}>
                            Block
                          </CTableHeaderCell>
                          <CTableHeaderCell style={{ minWidth: '150px' }}>
                            Last Status
                          </CTableHeaderCell>
                          <CTableHeaderCell style={{ minWidth: '170px' }}>
                            Last updateAt
                          </CTableHeaderCell>
                          <CTableHeaderCell style={{ minWidth: '150px' }}>
                            Status
                          </CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {onlineRobots.filter(
                          (robot) =>
                            robot.robot_no
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase()) ||
                            robot.deveui
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase()) ||
                            robot.block
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase()) ||
                            robot.last_status
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase())
                        ).length > 0 ? (
                          onlineRobots
                            .filter(
                              (robot) =>
                                robot.robot_no
                                  .toLowerCase()
                                  .includes(searchTerm.toLowerCase()) ||
                                robot.deveui
                                  .toLowerCase()
                                  .includes(searchTerm.toLowerCase()) ||
                                robot.block
                                  .toLowerCase()
                                  .includes(searchTerm.toLowerCase()) ||
                                robot.last_status
                                  .toLowerCase()
                                  .includes(searchTerm.toLowerCase())
                            )
                            .map((robot, index) => (
                              <CTableRow key={robot.robot_no}>
                                <CTableHeaderCell style={{ minWidth: '20px' }}>
                                  {index + 1}
                                </CTableHeaderCell>
                                <CTableDataCell>
                                  {robot.robot_no}
                                </CTableDataCell>
                                <CTableDataCell>{robot.deveui}</CTableDataCell>
                                <CTableDataCell>{robot.block}</CTableDataCell>
                                <CTableDataCell>
                                  {robot.last_status}
                                </CTableDataCell>
                                <CTableDataCell>
                                  {robot.last_update}
                                </CTableDataCell>
                                <CTableDataCell>
                                  <CBadge
                                    color={
                                      robot.lora_state === 1
                                        ? 'success'
                                        : 'danger'
                                    }
                                  >
                                    {robot.lora_state === 1
                                      ? 'Online'
                                      : 'Offline'}
                                  </CBadge>
                                </CTableDataCell>
                              </CTableRow>
                            ))
                        ) : (
                          <CTableRow>
                            <CTableDataCell
                              colSpan="7"
                              className="text-center text-muted"
                            >
                              No online robots found.
                            </CTableDataCell>
                          </CTableRow>
                        )}
                      </CTableBody>
                    </CTable>
                  </>
                </CModalBody>
                <CModalFooter>
                  <CButton
                    color="secondary"
                    onClick={() => setActiveOnlineSite(null)}
                  >
                    Close
                  </CButton>
                </CModalFooter>
              </CModal>

              {/* ✅ Offline Robots Modal */}
              <CModal
                scrollable
                size="xl"
                visible={activeOfflineSite === site.site_id}
                onClose={() => setActiveOfflineSite(null)}
              >
                <CModalHeader>
                  <CModalTitle>
                    {site.siteName} - Offline Robots List
                  </CModalTitle>
                </CModalHeader>
                <CModalBody>
                  <>
                    <CRow className="justify-content-end">
                      <CCol xs={12} sm={10} md={6} lg={4}>
                        <CInputGroup className="mb-3">
                          <CFormInput
                            type="text"
                            placeholder="Search Robot..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </CInputGroup>
                      </CCol>
                    </CRow>
                    <CTable responsive hover bordered>
                      <CTableHead>
                        <CTableRow>
                          <CTableHeaderCell style={{ minWidth: '20px' }}>
                            #
                          </CTableHeaderCell>
                          <CTableHeaderCell style={{ minWidth: '150px' }}>
                            Robot No
                          </CTableHeaderCell>
                          <CTableHeaderCell style={{ minWidth: '150px' }}>
                            Deveui
                          </CTableHeaderCell>
                          <CTableHeaderCell style={{ minWidth: '150px' }}>
                            Block
                          </CTableHeaderCell>
                          <CTableHeaderCell style={{ minWidth: '150px' }}>
                            Last Status
                          </CTableHeaderCell>
                          <CTableHeaderCell style={{ minWidth: '170px' }}>
                            Last updateAt
                          </CTableHeaderCell>
                          <CTableHeaderCell style={{ minWidth: '150px' }}>
                            Status
                          </CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {offlineRobots.filter(
                          (robot) =>
                            robot.robot_no
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase()) ||
                            robot.deveui
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase()) ||
                            robot.block
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase()) ||
                            robot.last_status
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase())
                        ).length > 0 ? (
                          offlineRobots
                            .filter(
                              (robot) =>
                                robot.robot_no
                                  .toLowerCase()
                                  .includes(searchTerm.toLowerCase()) ||
                                robot.deveui
                                  .toLowerCase()
                                  .includes(searchTerm.toLowerCase()) ||
                                robot.block
                                  .toLowerCase()
                                  .includes(searchTerm.toLowerCase()) ||
                                robot.last_status
                                  .toLowerCase()
                                  .includes(searchTerm.toLowerCase())
                            )
                            .map((robot, index) => (
                              <CTableRow key={robot.robot_no}>
                                <CTableHeaderCell style={{ minWidth: '20px' }}>
                                  {index + 1}
                                </CTableHeaderCell>
                                <CTableDataCell>
                                  {robot.robot_no}
                                </CTableDataCell>
                                <CTableDataCell>{robot.deveui}</CTableDataCell>
                                <CTableDataCell>{robot.block}</CTableDataCell>
                                <CTableDataCell>
                                  {robot.last_status}
                                </CTableDataCell>
                                <CTableDataCell>
                                  {robot.last_update}
                                </CTableDataCell>
                                <CTableDataCell>
                                  <CBadge
                                    color={
                                      robot.lora_state === 1
                                        ? 'success'
                                        : 'danger'
                                    }
                                  >
                                    {robot.lora_state === 1
                                      ? 'Online'
                                      : 'Offline'}
                                  </CBadge>
                                </CTableDataCell>
                              </CTableRow>
                            ))
                        ) : (
                          <CTableRow>
                            <CTableDataCell
                              colSpan="7"
                              className="text-center text-muted"
                            >
                              No Offline robots found.
                            </CTableDataCell>
                          </CTableRow>
                        )}
                      </CTableBody>
                    </CTable>
                  </>
                </CModalBody>
                <CModalFooter>
                  <CButton
                    color="secondary"
                    onClick={() => setActiveOfflineSite(null)}
                  >
                    Close
                  </CButton>
                </CModalFooter>
              </CModal>
            </CCol>
          );
        })}
      </CRow>
    </CContainer>
  );
};

export default TayproDashboard;
