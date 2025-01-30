import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Get site_id from URL
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
} from '@coreui/react';
import { robots, sites } from '../../../data'; // Import robots from data.js
import './management.css';

const BlockManagement = () => {
  const { site_id } = useParams(); // Get site_id from URL
  const [blocks, setBlocks] = useState({}); //  Store robots block-wise
  const [siteName, setSiteName] = useState(''); //  Store robots block-wise
  const [siteLocation, setSiteLocation] = useState(''); //  Store robots block-wise
  const [totalAssigned, setTotalAssigned] = useState(0);
  const [totalOnline, setTotalOnline] = useState(0);
  const [totalOffline, setTotalOffline] = useState(0);

  useEffect(() => {
    if (site_id) {
      // ✅ Filter robots assigned to this site
      const siteRobots = robots.filter((robot) => robot.site_id === site_id);

      const siteData = sites.filter((site) => site.site_id === site_id);

      if (siteData.length > 0) {
        setSiteName(siteData[0].siteName); // Access first element
        setSiteLocation(siteData[0].location); // Access first element
      } else {
        console.log('Site not found');
      }

      // ✅ Distribute robots block-wise
      const blockData = {};
      let assignedCount = 0,
        onlineCount = 0,
        offlineCount = 0;

      siteRobots.forEach((robot) => {
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
          blockData[robot.block].running += 1; // Running = Online
          onlineCount++;
        } else if (robot.last_status === 'Cleaning Started') {
          blockData[robot.block].running += 1; // Running = Online
        } else if (robot.lora_state === 0) {
          blockData[robot.block].offline += 1;
          offlineCount++;
        }

        blockData[robot.block].robots.push(robot);
      });

      setBlocks(blockData);
      setTotalAssigned(assignedCount);
      setTotalOnline(onlineCount);
      setTotalOffline(offlineCount);
    }
  }, [site_id]); // Run when site_id changes

  return (
    <div className="min-vh-100 d-flex flex-column align-items-center">
      <h3 className=" p-2">
        {siteName},{siteLocation}
      </h3>
      {/* ✅ Status Summary */}
      <CContainer>
        <CRow className="my-4 d-flex justify-content-center fw-bold">
          <CCol md={3}>
            <CCard className="border-0 p-3">
              <div className=" d-flex justify-content-center flex-column align-items-center">
                {' '}
                <span className="text-center fw-bold ">Total Assigned</span>
                <span className="" style={{ color: '#cb0c9f' }}>
                  {totalAssigned}
                </span>
              </div>
            </CCard>
          </CCol>
          <CCol md={3}>
            <CCard className=" border-0 p-3">
              <div className=" d-flex justify-content-center flex-column align-items-center">
                <span className="text-center fw-bold">Total Online</span>
                <span className="text-success">{totalOnline}</span>
              </div>
            </CCard>
          </CCol>
          <CCol md={3}>
            <CCard className="text-center border-0 p-3">
              <div className=" d-flex justify-content-center flex-column align-items-center">
                {' '}
                <span className="text-center fw-bold">Total Offline</span>
                <span className="text-danger">{totalOffline}</span>
              </div>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>

      <CContainer>
        <CRow className="mt-4">
          {Object.keys(blocks).map((blockId) => {
            const block = blocks[blockId];

            return (
              <CCol md={4} className="my-3" key={block.id}>
                <CCard className="h-100 d-flex flex-column border-0 shadow">
                  {/* Card Header */}
                  <CCardHeader className="text-center fw-bold border-0">
                    {block.id}
                  </CCardHeader>

                  {/* Card Body - Flexible */}
                  <CCardBody className="d-flex flex-column flex-grow-1">
                    <div className="d-flex flex-row justify-content-between p-1">
                      <CCol md={3}>
                        <p className="text-center">Assigned</p>
                        <p className="text-danger fw-bold text-center">
                          {block.assigned}
                        </p>
                      </CCol>
                      <CCol md={3}>
                        <p className="text-center">Running</p>
                        <p className="text-success fw-bold text-center">
                          {block.running}
                        </p>
                      </CCol>
                      <CCol md={3}>
                        <p className="text-center">Online</p>
                        <p className="text-success fw-bold text-center">
                          {block.online}
                        </p>
                      </CCol>
                      <CCol md={3}>
                        <p className="d-flex justify-content-center">Offline</p>
                        <p className="text-danger fw-bold text-center">
                          {block.offline}
                        </p>
                      </CCol>
                    </div>

                    {/* <div className="col-12 d-flex flex-column mt-2">
                      <p className="d-flex justify-content-center">Offline</p>
                      <p className="text-danger fw-bold text-center">
                        {block.offline}
                      </p>
                    </div> */}

                    {/* Robot List (Auto-Grows) */}
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

                  {/* Manage Button (Always at Bottom) */}
                  <div className="p-2 d-flex justify-content-center">
                    <CButton color="primary" size="sm">
                      MANAGE
                    </CButton>
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
