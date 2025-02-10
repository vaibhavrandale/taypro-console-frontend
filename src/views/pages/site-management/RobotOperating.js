import React, { useEffect, useState } from 'react';
import {
  //   CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
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
  CDropdownMenu,
  CDropdownItem,
  CDropdown,
  CDropdownToggle,
  CInputGroup,
  CFormInput,
} from '@coreui/react';
import { FaCopy, FaArrowUp } from 'react-icons/fa';

import { FaCircleInfo } from 'react-icons/fa6'; // Correct import from FA6
import { Link, useParams } from 'react-router-dom';
import './management.css';
import { robots, downlinks } from '../../../data'; // Import robots from data.js
import toast from 'react-hot-toast';

const RobotOperating = () => {
  const { site_id, block, robot_no } = useParams();
  const [modalVisible, setModalVisible] = useState(false);
  const [siteRobots, setSiteRobots] = useState([]); // Store robots assigned to the site
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (site_id) {
      // ✅ Filter robots assigned to this site
      // const siteRobots = robots.filter((robot) => robot.site_id === site_id);

      const extractNumber = (robotNo) =>
        parseInt(robotNo.match(/\d+/g)?.join('') || '0', 10);

      const filteredRobots = robots
        .filter((robot) => robot.site_id === site_id && robot.block === block)
        .sort((a, b) => extractNumber(a.robot_no) - extractNumber(b.robot_no));

      setSiteRobots(filteredRobots); // Store robots in state
      //   console.log(filteredRobots);
    }
  }, [block, site_id]);

  const filtereddownlinks = downlinks.filter(
    (downlink) =>
      downlink.downlink.toLowerCase().includes(searchTerm.toLowerCase()) ||
      downlink.decodedString.toLowerCase().includes(searchTerm.toLowerCase()) ||
      downlink.usedFor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      downlink.hexadecimal.toLowerCase().includes(searchTerm.toLowerCase()) ||
      downlink.uplink.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copydownlink = (downlink) => {
    if (!document.hasFocus()) {
      toast.error('Please focus on the document before copying.');
      return;
    }

    navigator.clipboard
      .writeText(downlink)
      .then(() => toast.success(`Copied: ${downlink}`))
      .catch((err) => toast.error('Clipboard copy failed', err));
  };

  const Robotdata = robots.filter(
    (robot) =>
      robot.site_id === site_id &&
      robot.block === block &&
      robot.robot_no === robot_no
  );
  console.log(Robotdata[0].robot_no);

  return (
    <div className="">
      {/* Page Header */}
      <CRow>
        <CCol>
          <h4 className="fw-bold text-center">
            <span className="text-danger">
              {site_id} - {block}
            </span>
            &nbsp;Robot's Configuration
          </h4>
        </CCol>
      </CRow>

      {/* Action Buttons */}
      <CRow className="my-2">
        <CCol>
          <CButton className="btn btn-sm btn-secondary m-1 shadow-sm">
            START ALL
          </CButton>
          <CButton className="btn btn-sm btn-secondary m-1 shadow-sm">
            STOP ALL
          </CButton>
          <CButton className="btn btn-sm btn-secondary m-1 shadow-sm">
            RETURN TO DOCK ALL
          </CButton>
          <Link
            to={`/master-admin/site-management/block-management/${site_id}/${block}/${robot_no}/debug_logs`}
            className="btn btn-sm btn-secondary  btn-sm m-1 shadow-sm"
          >
            DEBUG LOG
          </Link>
          <Link
            to={`/master-admin/site-management/block-management/${site_id}/${block}/${robot_no}/cleaning_logs`}
            className="btn btn-sm btn-secondary m-1 shadow-sm"
          >
            CLEANING LOG
          </Link>

          <CDropdown className="dropdown">
            <CDropdownToggle size="sm" className="shadow-sm ">
              {Robotdata[0].robot_no}
            </CDropdownToggle>

            <CDropdownMenu className="px-2 py-1 dropdown-menu">
              {siteRobots.length === 1
                ? ''
                : siteRobots.map((item, index) => (
                    <CDropdownItem
                      key={index}
                      href={`${
                        item.robot_no === robot_no ? `#` : `${item.robot_no}`
                      }`}
                      className={`dopdown-item ${
                        item.lora_state === 1 ? `online` : `offline`
                      }`}
                    >
                      {item.robot_no}
                    </CDropdownItem>
                  ))}
            </CDropdownMenu>
          </CDropdown>
        </CCol>
      </CRow>
      <CRow className="my-2">
        <CCol></CCol>
      </CRow>

      <CRow className="">
        {/* First Card */}
        <CCol md={5} className="mt-2">
          <CCard className="shadow border-0" style={{ height: '100%' }}>
            <CCardBody>
              <CTable borderless>
                <CTableBody>
                  <CTableRow>
                    <CTableDataCell>
                      <b style={{ fontSize: '15px' }}>
                        {Robotdata[0].robot_no}
                      </b>
                    </CTableDataCell>
                    <CTableDataCell>
                      🔋: {Robotdata[0].battery_percentage}%
                    </CTableDataCell>
                    <CTableDataCell>
                      <span className="badge bg-success">
                        {Robotdata[0].version}
                      </span>
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell className="text-danger">
                      {Robotdata[0].deveui}
                    </CTableDataCell>
                    <CTableDataCell>Wheel Speed</CTableDataCell>
                    <CTableDataCell>
                      <span className="badge bg-danger">
                        {Robotdata[0].wheel_speed}
                      </span>
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>
                      Lora:{' '}
                      <span className="text-success">
                        {Robotdata[0].lora_no}
                      </span>
                    </CTableDataCell>
                    <CTableDataCell>Brush Speed</CTableDataCell>
                    <CTableDataCell>
                      <span className="badge bg-secondary">
                        {Robotdata[0].brush_speed}
                      </span>
                    </CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Second Card */}
        <CCol md={4} className="mt-2">
          <CCard className="shadow border-0 " style={{ height: '100%' }}>
            <CCardBody>
              <CTable borderless>
                <CTableBody>
                  <CTableRow>
                    <CTableDataCell>
                      <p
                        className={`text-${
                          Robotdata[0].lora_state === 1 ? `success` : `danger`
                        }`}
                      >
                        {Robotdata[0].lora_state === 1 ? `online` : `offline`}
                      </p>
                    </CTableDataCell>
                    <CTableDataCell>
                      <span className="text-primary">
                        {Robotdata[0].last_status}
                      </span>
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>
                      <span className="text-danger">
                        SC : {Robotdata[0].stuck_count}
                      </span>
                    </CTableDataCell>
                    <CTableDataCell>
                      <span className="text-danger">
                        {Robotdata[0].last_update}
                      </span>
                    </CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Third Card (Custom Downlink) */}
        <CCol md={3} className="mt-2">
          <CCard className="shadow border-0 " style={{ height: '100%' }}>
            <CCardBody>
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="fw-bold">Custom Downlink</h6>
                <FaCircleInfo
                  className="text-primary"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setModalVisible(true)}
                />
              </div>
              <form className="position-relative mt-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter command"
                />
                <CButton
                  type="button"
                  className="d-flex justify-content-between align-items-center btn-sm position-absolute send-button"
                >
                  <FaArrowUp />
                </CButton>
              </form>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Modal for Commands */}
      <CModal
        scrollable
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        size="xl"
      >
        <CModalHeader>
          <CModalTitle>Custom Downlink</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow className="justify-content-end">
            <CCol xs={12} sm={10} md={6} lg={4}>
              <CInputGroup className="mb-3">
                <CFormInput
                  type="text"
                  placeholder="Search downlink..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </CInputGroup>
            </CCol>
          </CRow>
          <CTable responsive hover bordered>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell style={{ minWidth: '70px' }}>
                  Sr No
                </CTableHeaderCell>
                <CTableHeaderCell style={{ minWidth: '180px' }}>
                  downlink Command
                </CTableHeaderCell>
                <CTableHeaderCell style={{ minWidth: '180px' }}>
                  Decoded String
                </CTableHeaderCell>
                <CTableHeaderCell style={{ minWidth: '180px' }}>
                  Hexa decimal
                </CTableHeaderCell>
                <CTableHeaderCell style={{ minWidth: '180px' }}>
                  Uplink
                </CTableHeaderCell>
                <CTableHeaderCell style={{ minWidth: '250px' }}>
                  Description
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {filtereddownlinks.map((item, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>
                    {item.downlink}
                    <FaCopy
                      style={{
                        cursor: 'pointer',
                        marginLeft: '5px',
                        color: 'lime',
                      }}
                      onClick={() => copydownlink(item.downlink)}
                    />
                  </CTableDataCell>
                  <CTableDataCell>{item.decodedString}</CTableDataCell>
                  <CTableDataCell>{item.hexadecimal}</CTableDataCell>
                  <CTableDataCell>{item.uplink}</CTableDataCell>
                  <CTableDataCell>{item.usedFor}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      <CRow className="my-2">
        {/* First Card - Cleaning Cycle */}
        <CCol md={3} className="mt-2">
          <CCard className="shadow border-0 " style={{ height: '100%' }}>
            <CCardBody>
              <p>Cleaning Cycle</p>
              <CButton className="btn btn-sm btn-secondary m-1 shadow">
                START
              </CButton>
              <CButton className="btn btn-sm btn-secondary m-1 shadow-sm">
                STOP
              </CButton>
              <CButton className="btn btn-sm btn-secondary m-1 shadow-sm">
                RETURN
              </CButton>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Second Card - Set Wheel Speed */}
        <CCol md={3} className="mt-2">
          <CCard className="shadow border-0 " style={{ height: '100%' }}>
            <CCardBody>
              <p>Set Wheel Speed</p>
              <CButton className="btn btn-sm btn-secondary m-1 shadow-sm">
                LOW
              </CButton>
              <CButton className="btn btn-sm btn-secondary m-1 shadow-sm">
                MEDIUM
              </CButton>
              <CButton className="btn btn-sm btn-secondary m-1 shadow-sm">
                HIGH
              </CButton>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Third Card - Set Brush Speed */}
        <CCol md={3} className="mt-2">
          <CCard className="shadow border-0 " style={{ height: '100%' }}>
            <CCardBody>
              <p>Set Brush Speed</p>
              <CButton className="btn btn-sm btn-secondary m-1 shadow-sm">
                LOW
              </CButton>
              <CButton className="btn btn-sm btn-secondary m-1 shadow-sm">
                MEDIUM
              </CButton>
              <CButton className="btn btn-sm btn-secondary m-1 shadow-sm">
                HIGH
              </CButton>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Fourth Card - Text To Base64 */}
        <CCol md={3} className="mt-2">
          <CCard className="shadow border-0 " style={{ height: '100%' }}>
            <CCardBody>
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="fw-bold">Text to Base64</h6>
              </div>
              <form className="position-relative mt-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter value"
                />
                <CButton
                  type="button"
                  className="d-flex justify-content-between align-items-center btn-sm position-absolute send-button"
                >
                  <FaArrowUp />
                </CButton>
              </form>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  );
};

export default RobotOperating;
