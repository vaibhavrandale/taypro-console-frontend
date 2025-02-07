import React, { useState, useEffect } from 'react';
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormSelect,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormLabel,
  CFormInput,
} from '@coreui/react';
import { robots, sites } from '../../../data'; // Import Robots & Sites Data

const Timers = () => {
  const [selectedSite, setSelectedSite] = useState('');
  const [filteredBlocks, setFilteredBlocks] = useState([]);
  const [editData, setEditData] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);

  // Get Unique Site IDs for Dropdown
  const siteOptions = sites.map((site) => ({
    site_id: site.site_id,
    site_name: site.siteName, // Add the actual site name instead of ID
    site_location: site.location, // Add the actual site name instead of ID
  }));

  // Function to get Site Name from site_id
  const getSiteName = (site_id) => {
    const site = sites.find((s) => s.site_id === site_id);
    return site ? site.site_id : 'Unknown';
  };

  // Function to Filter Blocks Based on Site
  const filterBlocks = (siteID) => {
    const siteRobots = siteID
      ? robots.filter((robot) => robot.site_id === siteID)
      : robots; // Show all robots if no site selected

    const blockGroups = siteRobots.reduce((acc, robot) => {
      if (!acc[robot.block]) {
        acc[robot.block] = {
          block: robot.block,
          site_id: robot.site_id,
          total_robots: 0,
          timer1: robot.timer1,
          timer1_date: robot.timer1_date,
          timer2: robot.timer2,
          timer2_date: robot.timer2_date,
          timer3: robot.timer3,
          timer3_date: robot.timer3_date,
        };
      }
      acc[robot.block].total_robots += 1;

      return acc;
    }, {});

    setFilteredBlocks(Object.values(blockGroups));
  };

  // Set Default View (Show All Blocks)
  useEffect(() => {
    filterBlocks('');
  }, []);

  // Handle Site Selection Change
  const handleSiteChange = (e) => {
    const siteID = e.target.value;
    setSelectedSite(siteID);
    filterBlocks(siteID);
  };

  // Open Modal for Editing
  const openEditModal = (block) => {
    setEditData({ ...block });
    setEditModalVisible(true);
  };

  // Handle Input Changes in Modal
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle Save Changes
  const handleSaveChanges = () => {
    setFilteredBlocks((prevBlocks) =>
      prevBlocks.map((block) =>
        block.block === editData.block ? { ...editData } : block
      )
    );
    setEditModalVisible(false);
  };

  return (
    <div className="p-4">
      <h2>⏳ Timers Management</h2>

      {/* 📌 Site Filter */}
      <CRow className="justify-content-start mb-3">
        <CCol md={4}>
          <CFormSelect value={selectedSite} onChange={handleSiteChange}>
            <option value="">All Sites</option>
            {siteOptions.map((site, index) => (
              <option key={index} value={site.site_id}>
                {site.site_name},{site.site_location}
              </option>
            ))}
          </CFormSelect>
        </CCol>
      </CRow>

      {/* 📝 Timers Table */}
      <CCard className="shadow-sm">
        <CCardHeader>
          <h5 className="m-0">
            📋 Timers for &nbsp;
            <b>{selectedSite ? getSiteName(selectedSite) : 'All Sites'}</b>
          </h5>
        </CCardHeader>
        <CCardBody>
          <CTable bordered hover responsive>
            <CTableHead color="dark">
              <CTableRow>
                <CTableHeaderCell>Sr</CTableHeaderCell>
                <CTableHeaderCell>Site ID</CTableHeaderCell>
                <CTableHeaderCell>Block</CTableHeaderCell>
                <CTableHeaderCell>Total Robots</CTableHeaderCell>
                <CTableHeaderCell>Timer 1</CTableHeaderCell>
                <CTableHeaderCell>Date 1</CTableHeaderCell>
                <CTableHeaderCell>Timer 2</CTableHeaderCell>
                <CTableHeaderCell>Date 2</CTableHeaderCell>
                <CTableHeaderCell>Timer 3</CTableHeaderCell>
                <CTableHeaderCell>Date 3</CTableHeaderCell>
                <CTableHeaderCell>Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {filteredBlocks.length > 0 ? (
                filteredBlocks.map((block, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>{index + 1}</CTableDataCell>
                    <CTableDataCell>
                      {getSiteName(block.site_id)}
                    </CTableDataCell>
                    <CTableDataCell>{block.block}</CTableDataCell>
                    <CTableDataCell>{block.total_robots}</CTableDataCell>
                    <CTableDataCell>{block.timer1}</CTableDataCell>
                    <CTableDataCell>{block.timer1_date}</CTableDataCell>
                    <CTableDataCell>{block.timer2}</CTableDataCell>
                    <CTableDataCell>{block.timer2_date}</CTableDataCell>
                    <CTableDataCell>{block.timer3}</CTableDataCell>
                    <CTableDataCell>{block.timer3_date}</CTableDataCell>
                    <CTableDataCell>
                      <CButton
                        color="primary"
                        size="sm"
                        onClick={() => openEditModal(block)}
                      >
                        update
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell
                    colSpan="11"
                    className="text-center text-danger"
                  >
                    No blocks found for this site.
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      {/* 🔹 Update Timers Modal */}
      <CModal
        alignment="center"
        size="lg"
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
      >
        <CModalHeader>
          <CModalTitle>
            Update Timers for {getSiteName(editData?.site_id)} (
            {editData?.block})
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol md={6}>
              <CFormLabel>Timer 1</CFormLabel>
              <CFormInput
                type="text"
                name="timer1"
                value={editData?.timer1}
                onChange={handleEditChange}
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel>Executed Date 1</CFormLabel>
              <CFormInput
                type="date"
                name="timer1_date"
                value={editData?.timer1_date}
                onChange={handleEditChange}
              />
            </CCol>
          </CRow>

          <CRow>
            <CCol md={6}>
              <CFormLabel>Timer 2</CFormLabel>
              <CFormInput
                type="text"
                name="timer2"
                value={editData?.timer2}
                onChange={handleEditChange}
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel>Executed Date 2</CFormLabel>
              <CFormInput
                type="date"
                name="timer2_date"
                value={editData?.timer2_date}
                onChange={handleEditChange}
              />
            </CCol>
          </CRow>
          <CRow>
            <CCol md={6}>
              <CFormLabel>Timer 3</CFormLabel>
              <CFormInput
                type="text"
                name="timer3"
                value={editData?.timer3}
                onChange={handleEditChange}
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel>Executed Date 3</CFormLabel>
              <CFormInput
                type="date"
                name="timer3_date"
                value={editData?.timer3_date}
                onChange={handleEditChange}
              />
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton
            size="sm"
            color="secondary"
            onClick={() => setEditModalVisible(false)}
          >
            Cancel
          </CButton>
          <CButton
            size="sm"
            className="text-white"
            color="success"
            onClick={handleSaveChanges}
          >
            Save Changes
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default Timers;
