import React, { useState } from 'react';
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CInputGroup,
  CFormInput,
  CRow,
  CCol,
} from '@coreui/react';
import { sites } from '../../../data'; // Import sites from data.js
import { Link } from 'react-router-dom';

const SiteManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter table rows based on search term
  const filteredData = sites.filter(
    (site) =>
      site.siteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <h2>Site Management</h2>

      {/* Search Input */}
      <CRow className="justify-content-end">
        <CCol xs={12} sm={10} md={8} lg={5}>
          <CInputGroup className="mb-3">
            <CFormInput
              type="text"
              placeholder="Search Sites..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </CInputGroup>
        </CCol>
      </CRow>

      {/* Dynamic Data Table */}
      <CTable bordered hover responsive>
        <CTableHead color="dark">
          <CTableRow>
            <CTableHeaderCell>Sr</CTableHeaderCell>
            <CTableHeaderCell>Site Name</CTableHeaderCell>
            <CTableHeaderCell>Location</CTableHeaderCell>
            <CTableHeaderCell>Action</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {filteredData.length > 0 ? (
            filteredData.map((site, index) => (
              <CTableRow key={site.id}>
                <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                <CTableDataCell>{site.siteName}</CTableDataCell>
                <CTableDataCell>{site.location}</CTableDataCell>
                <CTableDataCell>
                  <Link
                    color="primary"
                    size="sm"
                    className="btn btn-primary btn-sm mx-1"
                    to={`/block-management/${site.site_id}`}
                  >
                    Manage
                  </Link>
                  <Link
                    color="primary"
                    size="sm"
                    className="btn btn-warning btn-sm mx-1"
                  >
                    Edit
                  </Link>
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan="4" className="text-center">
                No Site found
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>
    </div>
  );
};

export default SiteManagement;
