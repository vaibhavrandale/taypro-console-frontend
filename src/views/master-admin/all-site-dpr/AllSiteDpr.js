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
  CAvatar,
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
  // const [showSuggestions, setShowSuggestions] = useState(false); // Manage visibility
  const [showSuggestionsIndex, setShowSuggestionsIndex] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);

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
    <div className="mt-5 mx-2">
      <h2 className="text-center mb-4">Daily Progress Reports (DPRs)</h2>

      {/* Search and Date Filters */}
      <CRow className="mb-3">
        <CCol md={4} className="m-1">
          <CFormInput
            type="text"
            placeholder="Search by technician, email, or site"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CCol>
        <CCol md={3} className="m-1">
          <CFormInput
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </CCol>
        <CCol md={3} className="m-1">
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
            <CTableHeaderCell style={{ minWidth: '100px' }}>
              Site ID
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: '100px' }}>
              Date
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: '100px' }}>
              Total Running Robots
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: '100px' }}>
              Failed Robots
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: '100px' }}>
              Run By
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: '100px' }}>
              Actions
            </CTableHeaderCell>
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
                  <CTableDataCell style={{ minWidth: '150px' }}>
                    {dpr.submittedAt}
                  </CTableDataCell>
                  <CTableDataCell style={{ minWidth: '160px' }}>
                    {dpr.total_running_robots}
                  </CTableDataCell>
                  <CTableDataCell style={{ minWidth: '140px' }}>
                    {dpr.total_failed_robots}
                  </CTableDataCell>
                  <CTableDataCell>
                    {dpr.robots_run_by.toUpperCase()}
                  </CTableDataCell>
                  <CTableDataCell style={{ minWidth: '150px' }}>
                    <CButton
                      color="info"
                      size="sm"
                      className="btn-secondary m-1"
                      onClick={() => handleView(dpr)}
                    >
                      View
                    </CButton>
                    <CButton
                      color="warning"
                      className="btn-primary m-1"
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
      <CModal visible={viewModal} onClose={() => setViewModal(false)} size="xl">
        {selectedDPR ? (
          <>
            <CModalHeader closeButton>
              <CModalTitle className="d-flex">
                <span> View DPR Details : </span>&nbsp;
                <p className="text-primary">
                  {selectedDPR.site_id}&nbsp;(
                  {selectedDPR.submittedAt.split(' ')[0]})
                </p>
              </CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CTable striped bordered hover responsive>
                <CTableBody>
                  {Object.entries(selectedDPR).map(([key, value]) => (
                    <CTableRow key={key}>
                      <CTableHeaderCell>
                        {key.replace(/_/g, ' ')}
                      </CTableHeaderCell>
                      <CTableDataCell>
                        {Array.isArray(value) ? (
                          key === 'technitian_present' ? (
                            <CTable className="w-50 border-0">
                              <CTableBody>
                                {value.map((tech, index) => {
                                  return (
                                    <CTableRow key={index} className="border">
                                      <CTableDataCell className="border-0">
                                        {index + 1})
                                      </CTableDataCell>
                                      <CTableDataCell className="border-0">
                                        <CAvatar
                                          src={tech.profile_image}
                                          className="me-2"
                                        />
                                      </CTableDataCell>
                                      <CTableDataCell className="border-0">
                                        {tech.technitian_username}
                                      </CTableDataCell>
                                      {/* <CTableDataCell className="border-0">
                                      {tech.technitian_email}
                                    </CTableDataCell> */}
                                    </CTableRow>
                                  );
                                })}
                              </CTableBody>
                            </CTable>
                          ) : (
                            JSON.stringify(value)
                          )
                        ) : (
                          value?.toString() || 'N/A'
                        )}
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CModalBody>
          </>
        ) : (
          <p className="text-center text-muted">No data available</p>
        )}
      </CModal>

      {/* Update Modal */}
      <CModal
        visible={updateModal}
        onClose={() => setUpdateModal(false)}
        size="xl"
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
              <CTable striped bordered className="mt-2">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>#</CTableHeaderCell>
                    <CTableHeaderCell>Name</CTableHeaderCell>
                    {/* <CTableHeaderCell>Email</CTableHeaderCell>
                    <CTableHeaderCell>ID</CTableHeaderCell> */}
                    <CTableHeaderCell style={{ width: '80px' }}>
                      Actions
                    </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  {updatedDPR.technitian_present.map((tech, index) => (
                    <CTableRow key={index}>
                      <CTableHeaderCell>{index + 1}</CTableHeaderCell>

                      {/* Technician Name with Auto-Suggestions */}
                      <CTableDataCell className="position-relative">
                        <CFormInput
                          type="text"
                          value={tech.technitian_username}
                          onChange={(e) => {
                            const value = e.target.value;

                            // Filter users based on input
                            // const filtered = users.filter((user) =>
                            //   user.username
                            //     .toLowerCase()
                            //     .includes(value.toLowerCase())
                            // );

                            const filtered = users
                              .filter(
                                (user) =>
                                  user.role === 'Site Technician' && // Only "Site Technician"
                                  user.username
                                    .toLowerCase()
                                    .includes(value.toLowerCase())
                              )
                              .slice(0, 5); // Limit to 5 suggestions

                            setFilteredUsers(filtered.slice(0, 5)); // Show max 5 suggestions
                            setShowSuggestionsIndex(index); // Set suggestion visibility for this row

                            const newTechnicianPresent = [
                              ...updatedDPR.technitian_present,
                            ];
                            newTechnicianPresent[index].technitian_username =
                              value;
                            setUpdatedDPR({
                              ...updatedDPR,
                              technitian_present: newTechnicianPresent,
                            });
                          }}
                          onFocus={() => setShowSuggestionsIndex(index)} // Show suggestions when input is focused
                          onBlur={() =>
                            setTimeout(() => setShowSuggestionsIndex(null), 200)
                          } // Hide dropdown on blur
                        />

                        {/* Suggestions List */}
                        {showSuggestionsIndex === index &&
                          filteredUsers.length > 0 && (
                            <div className="suggestion-dropdown">
                              {filteredUsers.map((user, idx) => (
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
                                      technitian_present: newTechnicianPresent,
                                    });
                                    setShowSuggestionsIndex(null);
                                  }}
                                >
                                  <CAvatar
                                    src={user.profile_image}
                                    className="me-2"
                                  />
                                  {user.username}
                                </div>
                              ))}
                            </div>
                          )}
                        <CFormInput
                          type="hidden"
                          value={tech.technitian_email}
                        />
                        <CFormInput type="hidden" value={tech.technitian_id} />
                      </CTableDataCell>

                      {/* Remove Button */}
                      <CTableDataCell className="text-center">
                        <CButton
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
                          ❌
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
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
    </div>
  );
};

export default AllSiteDpr;
