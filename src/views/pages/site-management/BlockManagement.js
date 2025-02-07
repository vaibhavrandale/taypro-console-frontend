import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CInputGroup,
  CFormInput,
} from '@coreui/react';
import { robots, sites } from '../../../data';
import './management.css';

const BlockManagement = () => {
  const { site_id } = useParams();
  const [blocks, setBlocks] = useState({});
  const [siteName, setSiteName] = useState('');
  const [siteLocation, setSiteLocation] = useState('');
  const [totalAssigned, setTotalAssigned] = useState(0);
  const [totalOnline, setTotalOnline] = useState(0);
  const [totalOffline, setTotalOffline] = useState(0);
  const [totalRunning, setTotalRunning] = useState(0);
  const [visible, setVisible] = useState(false);
  const [siteRobots, setSiteRobots] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (site_id) {
      const filteredRobots = robots.filter(
        (robot) => robot.site_id === site_id
      );
      setSiteRobots(filteredRobots);

      const siteData = sites.find((site) => site.site_id === site_id);
      if (siteData) {
        setSiteName(siteData.siteName);
        setSiteLocation(siteData.location);
      } else {
        console.log('Site not found');
      }

      const blockData = {};
      let assignedCount = 0,
        onlineCount = 0,
        offlineCount = 0,
        runningCount = 0;

      filteredRobots.forEach((robot) => {
        if (!blockData[robot.block]) {
          blockData[robot.block] = {
            id: robot.block,
            assigned: 0,
            running: 0,
            online: 0,
            offline: 0,
            robots: [],
          };
        }

        blockData[robot.block].assigned += 1;
        assignedCount++;

        if (robot.lora_state === 1) {
          blockData[robot.block].online += 1;
          onlineCount++;
        } else {
          blockData[robot.block].offline += 1;
          offlineCount++;
        }

        if (robot.last_status === 'Cleaning Started') {
          blockData[robot.block].running += 1;
          runningCount++;
        }

        blockData[robot.block].robots.push(robot);
      });

      // Sort robots within each block by robot_no in ascending order
      Object.keys(blockData).forEach((blockId) => {
        blockData[blockId].robots.sort((a, b) =>
          a.robot_no.localeCompare(b.robot_no, undefined, { numeric: true })
        );
      });

      setBlocks(blockData);
      setTotalAssigned(assignedCount);
      setTotalOnline(onlineCount);
      setTotalOffline(offlineCount);
      setTotalRunning(runningCount);
    }
  }, [site_id]);

  const filteredRobotsData = siteRobots.filter(
    (robot) =>
      robot.robot_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      robot.deveui.toLowerCase().includes(searchTerm.toLowerCase()) ||
      robot.block.toLowerCase().includes(searchTerm.toLowerCase()) ||
      robot.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      robot.site_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      robot.last_status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      robot.last_update.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-vh-100 d-flex flex-column align-items-center">
      <h4 className="p-2 text-center text-primary">
        {siteName}, {siteLocation}
      </h4>
      <div className="p-2 d-flex justify-content-center">
        <CButton
          className="btn btn-secondary btn-sm"
          size="sm"
          onClick={() => setVisible(!visible)}
        >
          All Robot Data
        </CButton>

        <CModal
          backdrop="static"
          size="xl"
          scrollable
          visible={visible}
          onClose={() => setVisible(false)}
          aria-labelledby="StaticBackdropExampleLabel"
        >
          <CModalHeader>
            <CModalTitle id="StaticBackdropExampleLabel">
              <span className="text-primary">
                {siteName}, {siteLocation} -
              </span>{' '}
              Robots Details
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
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
                  <CTableHeaderCell
                    className="text-center"
                    scope="col"
                    style={{ minWidth: '20px' }}
                  >
                    Sr
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    className="text-center"
                    scope="col"
                    style={{ minWidth: '120px' }}
                  >
                    Robot No
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    className="text-center"
                    scope="col"
                    style={{ minWidth: '120px' }}
                  >
                    deveui
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    className="text-center"
                    scope="col"
                    style={{ minWidth: '120px' }}
                  >
                    Lora State
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    className="text-center"
                    scope="col"
                    style={{ minWidth: '120px' }}
                  >
                    Block
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredRobotsData.map((item, index) => (
                  <CTableRow key={index}>
                    <CTableHeaderCell scope="row" style={{ minWidth: '20px' }}>
                      {index + 1}
                    </CTableHeaderCell>
                    <CTableDataCell style={{ minWidth: '120px' }}>
                      {item.robot_no}
                    </CTableDataCell>
                    <CTableDataCell style={{ minWidth: '120px' }}>
                      {item.deveui}
                    </CTableDataCell>
                    <CTableDataCell style={{ minWidth: '120px' }}>
                      {item.lora_state === 1 ? (
                        <span className="badge bg-success">Online</span>
                      ) : (
                        <span className="badge bg-danger">Offline</span>
                      )}
                    </CTableDataCell>
                    <CTableDataCell style={{ minWidth: '120px' }}>
                      {item.block}
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CModalBody>
          <CModalFooter className="d-flex justify-content-center">
            <span className="fw-bold text-primary">
              A Complete Robot Monitoring Console
            </span>
          </CModalFooter>
        </CModal>
      </div>

      {/* Block Display with Manage Button */}
      <CContainer>
        <CRow className="mt-4 justify-content-center">
          {Object.keys(blocks).map((blockId) => {
            const block = blocks[blockId];

            // Ensure robots are sorted and select the first robot
            const firstRobot = block.robots.length > 0 ? block.robots[0] : null;

            return (
              <CCol md={4} className="my-2" key={block.id}>
                <CCard className="h-100 d-flex flex-column border-0 shadow">
                  <CCardHeader className="text-center fw-bold border-0">
                    {block.id}
                  </CCardHeader>
                  <CCardBody className="d-flex flex-column flex-grow-1">
                    <div className="d-flex flex-row justify-content-between p-1">
                      <CCol md={3}>
                        <p className="text-center">Assigned</p>
                        <p className="text-danger fw-bold text-center">
                          {block.assigned}
                        </p>
                      </CCol>
                      <CCol md={3}>
                        <p className="text-center">Online</p>
                        <p className="text-success fw-bold text-center">
                          {block.online}
                        </p>
                      </CCol>
                      <CCol md={3}>
                        <p className="text-center">Running</p>
                        <p className="text-success fw-bold text-center">
                          {block.running}
                        </p>
                      </CCol>
                      <CCol md={3}>
                        <p className="text-center">Offline</p>
                        <p className="text-danger fw-bold text-center">
                          {block.offline}
                        </p>
                      </CCol>
                    </div>

                    {/* Robot List Display */}
                    <div className="d-flex justify-content-center flex-wrap align-items-center flex-grow-1">
                      {block.robots.map((robot, index) => {
                        const robotNumberMatch = robot.robot_no.match(/\d+/g);
                        const robotNumber = robotNumberMatch
                          ? robotNumberMatch.join('')
                          : '000';
                        const lastThreeDigits = robotNumber.slice(-3);

                        return (
                          <span
                            key={index}
                            className={`tooltip-container m-1 badge ${
                              robot.lora_state === 1
                                ? 'bg-success'
                                : 'bg-danger'
                            }`}
                          >
                            {lastThreeDigits}
                            <span className="tooltip-text">
                              {robot.last_status}
                            </span>
                          </span>
                        );
                      })}
                    </div>
                  </CCardBody>

                  {/* Manage Button with First Robot */}
                  <div className="p-2 d-flex justify-content-center">
                    {firstRobot ? (
                      <Link
                        to={`/master-admin/site-management/block-management/${site_id}/${block.id}/${firstRobot.robot_no}`}
                        className="btn btn-sm btn btn-secondary"
                        size="sm"
                      >
                        MANAGE
                      </Link>
                    ) : (
                      <CButton disabled className="btn-sm btn-secondary">
                        No Robots
                      </CButton>
                    )}
                  </div>
                </CCard>
              </CCol>
            );
          })}
        </CRow>
      </CContainer>
    </div>
  );
};

export default BlockManagement;
