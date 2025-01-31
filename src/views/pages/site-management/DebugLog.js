import React, { useState } from 'react';
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CFormInput,
  CInputGroup,
  CButton,
} from '@coreui/react';
import { debug_log } from '../../../data'; // Import debug log data
import { useParams } from 'react-router-dom';
import * as XLSX from 'xlsx'; // Import xlsx for Excel export

const DebugLog = () => {
  const { robot_no } = useParams();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter logs based on robot_no
  const filteredRobotLogs = debug_log.filter(
    (log) => log.robot_no === robot_no
  );

  // Search by robot_no or topic
  const filteredLogs = filteredRobotLogs
    .filter(
      (log) =>
        (log.robot_no &&
          log.robot_no.toLowerCase().includes(searchTerm.toLowerCase())) ||
        log.data.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.deveui.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.timestamp.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.topic &&
          log.topic.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  // Function to export data to Excel
  // Function to export data to Excel
  const exportToExcel = () => {
    if (filteredLogs.length === 0) {
      alert('No data available for export.');
      return;
    }

    // Convert JSON to sheet
    const worksheet = XLSX.utils.json_to_sheet(
      filteredLogs.map((log, index) => ({
        '#': index + 1,
        'Robot No': log.robot_no,
        Deveui: log.deveui,
        Data: log.data,
        Timestamp: log.timestamp,
        Topic: log.topic,
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Debug Logs');

    // Trigger download
    XLSX.writeFile(workbook, `DebugLogs_${robot_no}.xlsx`);
  };

  return (
    <div>
      <CCard className="shadow-0 border-0">
        <CCardBody>
          <CRow className="justify-content-between my-3">
            <CCol md={4} className="text-end">
              {' '}
              <h5 className="text-primary text-center">
                Debug Logs of - <b>{robot_no}</b>
              </h5>
            </CCol>
            <CCol md={2} className="text-end">
              <CButton
                color="success"
                className="btn-sm m-1 shadow-sm text-white"
                onClick={exportToExcel}
              >
                Export to Excel
              </CButton>
            </CCol>
          </CRow>

          {/* Search Bar */}
          <CRow className="justify-content-end my-3">
            <CCol md={4}>
              <CInputGroup className="mb-3">
                <CFormInput
                  type="text"
                  placeholder="Search by Robot No or Topic or data..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </CInputGroup>
            </CCol>
          </CRow>

          {/* Show Message If No Logs Found */}
          {filteredLogs.length === 0 ? (
            <p className="text-center text-muted">
              No debug logs found for this robot.
            </p>
          ) : (
            <div className="table-responsive">
              <CTable striped responsive hover bordered>
                <CTableHead>
                  {/* <CTableRow>
                    <CTableHeaderCell>#</CTableHeaderCell>
                    <CTableHeaderCell style={{ minWidth: '140px' }}>
                      Robot No
                    </CTableHeaderCell>
                    <CTableHeaderCell style={{ minWidth: '140px' }}>
                      Deveui
                    </CTableHeaderCell>
                    <CTableHeaderCell>Data</CTableHeaderCell>
                    <CTableHeaderCell style={{ minWidth: '170px' }}>
                      Timestamp
                    </CTableHeaderCell>
                    <CTableHeaderCell style={{ minWidth: '140px' }}>
                      Topic
                    </CTableHeaderCell>
                  </CTableRow> */}
                  <CTableRow>
                    <CTableHeaderCell>#</CTableHeaderCell>
                    <CTableHeaderCell
                      className="text-center"
                      style={{ minWidth: '140px' }}
                    >
                      Robot No
                    </CTableHeaderCell>
                    <CTableHeaderCell
                      className="text-center"
                      style={{ minWidth: '140px' }}
                    >
                      Deveui
                    </CTableHeaderCell>
                    <CTableHeaderCell
                      className="text-center"
                      style={{ minWidth: '150px' }}
                    >
                      Data
                    </CTableHeaderCell>
                    <CTableHeaderCell
                      className="text-center"
                      style={{ minWidth: '170px' }}
                    >
                      Timestamp
                    </CTableHeaderCell>
                    <CTableHeaderCell
                      className="text-center"
                      style={{ minWidth: '140px' }}
                    >
                      Topic
                    </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {filteredLogs.map((log, index) => (
                    <CTableRow key={log.id}>
                      <CTableHeaderCell>{index + 1}</CTableHeaderCell>
                      <CTableDataCell>{log.robot_no}</CTableDataCell>
                      <CTableDataCell>{log.deveui}</CTableDataCell>
                      <CTableDataCell>{log.data}</CTableDataCell>
                      <CTableDataCell>{log.timestamp}</CTableDataCell>
                      <CTableDataCell>{log.topic}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </div>
          )}
        </CCardBody>
      </CCard>
    </div>
  );
};

export default DebugLog;
