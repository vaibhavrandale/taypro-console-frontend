import React, { useEffect, useState } from 'react';
import {
  CContainer,
  CTable,
  CTableBody,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CFormInput,
  CRow,
  CCol,
  CButton,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CModalFooter,
} from '@coreui/react';
import moment from 'moment';
import {
  service_technitian_daily_progress_report as dprData,
  users,
} from '../../../data'; // Import DPR data
import LoadingSpinner from '../../../components/LoadingSpinner';
import { Link } from 'react-router-dom';
import './dpr.css';
const AllSiteDpr = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedDPR, setSelectedDPR] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [updatedDPR, setUpdatedDPR] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filteredDPRs, setFilteredDPRs] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false); // Manage visibility

  useEffect(() => {
    setLoading(true); // Start loading
    setTimeout(() => {
      const filtered = dprData.filter((dpr) => {
        const submittedDate = moment(dpr.submittedAt, 'YYYY-MM-DD HH:mm:ss');
        const from = fromDate ? moment(fromDate, 'YYYY-MM-DD') : null;
        const to = toDate ? moment(toDate, 'YYYY-MM-DD') : null;

        const matchesSearch =
          dpr.technitian_username
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          dpr.technitian_email
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          dpr.site_id.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesDate =
          (!from || submittedDate.isSameOrAfter(from, 'day')) &&
          (!to || submittedDate.isSameOrBefore(to, 'day'));

        return matchesSearch && matchesDate;
      });

      setFilteredDPRs(filtered);
      setLoading(false); // Stop loading
    }, 500); // Simulating API call delay
  }, [searchTerm, fromDate, toDate]);

  // Open View Modal
  const handleView = (dpr) => {
    if (!dpr) return; // Prevent null errors
    setSelectedDPR(dpr);
    setViewModal(true);
  };

  // Open Update Modal
  const handleUpdate = (dpr) => {
    if (!dpr) return; // Prevent null errors
    setUpdatedDPR({ ...dpr }); // Ensure default values are set
    setUpdateModal(true);
  };

  // Handle Input Change in Update Form
  const handleUpdateChange = (e) => {
    setUpdatedDPR({ ...updatedDPR, [e.target.name]: e.target.value });
  };

  return (
    <CContainer className="mt-5">
      <h2 className="text-center mb-4">Daily Progress Reports (DPRs)</h2>

      {/* Search and Date Filters */}
      <CRow className="mb-3">
        <CCol md={4}>
          <CFormInput
            type="text"
            placeholder="Search by technician, email, or site"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CCol>
        <CCol md={3}>
          <CFormInput
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </CCol>
        <CCol md={3}>
          <CFormInput
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </CCol>
      </CRow>

      {/* DPR Table */}
      <CTable striped bordered hover responsive>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>#</CTableHeaderCell>
            <CTableHeaderCell>Site ID</CTableHeaderCell>
            <CTableHeaderCell>Date</CTableHeaderCell>
            <CTableHeaderCell>Total Running Robots</CTableHeaderCell>
            <CTableHeaderCell>Failed Robots</CTableHeaderCell>
            <CTableHeaderCell>Run By</CTableHeaderCell>
            <CTableHeaderCell>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        {loading ? (
          <CTableBody>
            <CTableRow className="text-center">
              <CTableDataCell colSpan={6}>
                <LoadingSpinner />
              </CTableDataCell>
            </CTableRow>
          </CTableBody>
        ) : (
          <CTableBody>
            {filteredDPRs.length > 0 ? (
              filteredDPRs.map((dpr, index) => (
                <CTableRow key={dpr.id}>
                  <CTableHeaderCell>{index + 1}</CTableHeaderCell>
                  <CTableDataCell>{dpr.site_id}</CTableDataCell>
                  <CTableDataCell>{dpr.submittedAt}</CTableDataCell>
                  <CTableDataCell>{dpr.total_running_robots}</CTableDataCell>
                  <CTableDataCell>{dpr.total_failed_robots}</CTableDataCell>
                  <CTableDataCell>
                    {dpr.robots_run_by.toUpperCase()}
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      color="info"
                      size="sm"
                      className="btn-secondary me-2"
                      onClick={() => handleView(dpr)}
                    >
                      View
                    </CButton>
                    <CButton
                      color="warning"
                      size="sm"
                      onClick={() => handleUpdate(dpr)}
                    >
                      Update
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan="6" className="text-center text-muted">
                  No records found
                </CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        )}
      </CTable>

      {/* View Modal */}
      <CModal visible={viewModal} onClose={() => setViewModal(false)} size="lg">
        <CModalHeader closeButton>
          <CModalTitle>View DPR Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedDPR ? (
            <CTable striped bordered>
              <CTableBody>
                {Object.entries(selectedDPR).map(([key, value]) => (
                  <CTableRow key={key}>
                    <CTableHeaderCell>
                      {key.replace(/_/g, ' ')}
                    </CTableHeaderCell>
                    <CTableDataCell>
                      {Array.isArray(value)
                        ? key === 'technitian_present'
                          ? value.map((tech, index) => (
                              <li key={index}>
                                {tech.technitian_username} (
                                {tech.technitian_email})
                              </li>
                            ))
                          : JSON.stringify(value)
                        : value?.toString() || 'N/A'}
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          ) : (
            <p className="text-center text-muted">No data available</p>
          )}
        </CModalBody>
      </CModal>

      {/* Update Modal */}
      <CModal
        visible={updateModal}
        onClose={() => setUpdateModal(false)}
        size="lg"
      >
        <CModalHeader closeButton>
          <CModalTitle>
            Update DPR Details -
            <span className="text-danger">
              {updatedDPR?.site_id || 'N/A'} ({updatedDPR?.submittedAt || 'N/A'}
              )
            </span>
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {updatedDPR ? (
            <CRow className="mb-3">
              <CCol md={6}>
                <label className="fw-bold">Technician Username</label>
                <CFormInput
                  type="text"
                  name="technitian_username"
                  value={updatedDPR.technitian_username || ''}
                  onChange={handleUpdateChange}
                />
              </CCol>

              <CCol md={6}>
                <label className="fw-bold">Technician Email</label>
                <CFormInput
                  type="email"
                  name="technitian_email"
                  value={updatedDPR.technitian_email || ''}
                  onChange={handleUpdateChange}
                />
              </CCol>

              <CCol md={6} className="mt-2">
                <label className="fw-bold">Site ID</label>
                <CFormInput
                  type="text"
                  name="site_id"
                  value={updatedDPR.site_id || ''}
                  onChange={handleUpdateChange}
                />
              </CCol>

              <CCol md={6} className="mt-2">
                <label className="fw-bold">Total Running Robots</label>
                <CFormInput
                  type="number"
                  name="total_running_robots"
                  value={updatedDPR.total_running_robots || 0}
                  onChange={handleUpdateChange}
                />
              </CCol>

              <CCol md={6} className="mt-2">
                <label className="fw-bold">Total Failed Robots</label>
                <CFormInput
                  type="number"
                  name="total_failed_robots"
                  value={updatedDPR.total_failed_robots || 0}
                  onChange={handleUpdateChange}
                />
              </CCol>

              <CCol md={6} className="mt-2">
                <label className="fw-bold">Robots Run By</label>
                <CFormInput
                  type="text"
                  name="robots_run_by"
                  value={updatedDPR.robots_run_by || ''}
                  onChange={handleUpdateChange}
                />
              </CCol>

              <CCol md={12} className="mt-2">
                <label className="fw-bold">Comments</label>
                <CFormInput
                  type="text"
                  name="comments"
                  value={updatedDPR.comments || ''}
                  onChange={handleUpdateChange}
                />
              </CCol>

              <CCol md={6} className="mt-2">
                <label className="fw-bold">Submitted At</label>
                <CFormInput
                  type="datetime-local"
                  name="submittedAt"
                  value={moment(updatedDPR.submittedAt || new Date()).format(
                    'YYYY-MM-DDTHH:mm'
                  )}
                  onChange={handleUpdateChange}
                />
              </CCol>

              <CCol
                md={12}
                className="mt-4 d-flex justify-content-between align-items-center"
              >
                <h5 className="fw-bold">Technicians Present</h5>
                <CButton
                  color="success"
                  size="sm"
                  onClick={() => {
                    setUpdatedDPR({
                      ...updatedDPR,
                      technitian_present: [
                        ...updatedDPR.technitian_present,
                        {
                          technitian_username: '',
                          technitian_email: '',
                          technitian_id: '',
                        },
                      ],
                    });
                  }}
                >
                  + Add Technician
                </CButton>
              </CCol>

              {/* Technician Table */}
              <CTable striped bordered responsive className="mt-2">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>#</CTableHeaderCell>
                    <CTableHeaderCell>Name</CTableHeaderCell>
                    <CTableHeaderCell>Email</CTableHeaderCell>
                    <CTableHeaderCell>ID</CTableHeaderCell>
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {updatedDPR.technitian_present.map((tech, index) => {
                    return (
                      <CTableRow key={index}>
                        <CTableHeaderCell>{index + 1}</CTableHeaderCell>

                        {/* Technician Name with Auto-Suggestions */}
                        <CTableDataCell className="position-relative">
                          <CFormInput
                            type="text"
                            name={`technitian_present[${index}].technitian_username`}
                            value={tech.technitian_username}
                            onChange={(e) => {
                              const newTechnicianPresent = [
                                ...updatedDPR.technitian_present,
                              ];
                              newTechnicianPresent[index].technitian_username =
                                e.target.value;
                              setUpdatedDPR({
                                ...updatedDPR,
                                technitian_present: newTechnicianPresent,
                              });
                              setShowSuggestions(true); // Show dropdown
                            }}
                            onBlur={() =>
                              setTimeout(() => setShowSuggestions(false), 200)
                            } // Hide dropdown on blur
                          />

                          {/* Suggestions List */}
                          {showSuggestions &&
                            tech.technitian_username.length > 0 && (
                              <div className="suggestion-dropdown">
                                {users
                                  .filter((user) =>
                                    user.username
                                      .toLowerCase()
                                      .includes(
                                        tech.technitian_username.toLowerCase()
                                      )
                                  )
                                  .slice(0, 5) // Show only top 5 suggestions
                                  .map((user, idx) => (
                                    <div
                                      key={idx}
                                      className="suggestion-item"
                                      onClick={() => {
                                        const newTechnicianPresent = [
                                          ...updatedDPR.technitian_present,
                                        ];
                                        newTechnicianPresent[index] = {
                                          technitian_username: user.username,
                                          technitian_email: user.email,
                                          technitian_id: user.id,
                                        };
                                        setUpdatedDPR({
                                          ...updatedDPR,
                                          technitian_present:
                                            newTechnicianPresent,
                                        });
                                        setShowSuggestions(false); // Hide dropdown after selection
                                      }}
                                    >
                                      {user.username} ({user.email})
                                    </div>
                                  ))}
                              </div>
                            )}
                        </CTableDataCell>

                        {/* Technician Email */}
                        <CTableDataCell>
                          <CFormInput
                            type="email"
                            name={`technitian_present[${index}].technitian_email`}
                            value={tech.technitian_email}
                            disabled
                          />
                        </CTableDataCell>

                        {/* Technician ID */}
                        <CTableDataCell>
                          <CFormInput
                            type="text"
                            name={`technitian_present[${index}].technitian_id`}
                            value={tech.technitian_id}
                            disabled
                          />
                        </CTableDataCell>

                        {/* Remove Row Button */}
                        <CTableDataCell className="text-center">
                          <CButton
                            color="danger"
                            size="sm"
                            onClick={() => {
                              const newTechnicianPresent =
                                updatedDPR.technitian_present.filter(
                                  (_, i) => i !== index
                                );
                              setUpdatedDPR({
                                ...updatedDPR,
                                technitian_present: newTechnicianPresent,
                              });
                            }}
                          >
                            ❌ Remove
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    );
                  })}
                </CTableBody>
              </CTable>
            </CRow>
          ) : (
            <p className="text-center text-muted">No data available</p>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="success" onClick={() => setUpdateModal(false)}>
            Save
          </CButton>
          <CButton color="secondary" onClick={() => setUpdateModal(false)}>
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  );
};

export default AllSiteDpr;
