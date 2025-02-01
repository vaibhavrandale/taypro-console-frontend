import React, { useState } from 'react';
import {
  // CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CFormInput,
  CInputGroup,
  //   CDropdown,
  //   CDropdownToggle,
  //   CDropdownMenu,
  //   CDropdownItem,
} from '@coreui/react';
import { robots } from '../../../data'; // Import robots data
import { Link } from 'react-router-dom';

const SearchRobot = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter robots based on search term (only by Robot No)
  const filteredRobots = robots.filter((robot) =>
    robot.robot_no.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="my-3">
      <CCard className="shadow border-0" style={{ minHeight: '73vh' }}>
        <CCardBody>
          <h5 className="text-primary text-center">Search Robots</h5>

          {/* Search Bar */}
          <CRow className="justify-content-center my-3">
            <CCol md={4}>
              <CInputGroup className="mb-3">
                <CFormInput
                  type="text"
                  placeholder="Search by Robot No..."
                  value={searchTerm}
                  className="form-control"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </CInputGroup>
            </CCol>
          </CRow>

          {/* Dropdown with Robot List */}
          {searchTerm && filteredRobots.length > 0 ? (
            <CRow className="justify-content-center">
              <CCol md={4}>
                <ul
                  className="text-center shadow-sm p-3"
                  style={{ maxHeight: '300px', overflowY: 'auto' }}
                >
                  {filteredRobots.map((robot, index) => (
                    <li
                      key={index} // ✅ Move the key to the <li> (not the <Link>)
                      className="my-2 border p-2 rounded"
                      style={{ listStyle: 'none' }}
                    >
                      <Link
                        to={`/site-management/block-management/${robot.site_id}/${robot.block}/${robot.robot_no}`}
                        className="text-decoration-none"
                      >
                        {robot.robot_no}
                      </Link>
                    </li>
                  ))}
                </ul>
              </CCol>
            </CRow>
          ) : (
            <p className="text-center">No robot found.</p>
          )}
        </CCardBody>
      </CCard>
    </div>
  );
};

export default SearchRobot;
