import React, { useEffect, useState } from 'react';
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormInput,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CSpinner,
  CButton, // Import Loading Spinner
} from '@coreui/react';
import { cleaning_log } from '../../../data'; // Import cleaning logs data
import { useParams } from 'react-router-dom';
// import * as XLSX from 'xlsx'; // Import xlsx for Excel export
import toast from 'react-hot-toast';

const SitewaiseLog = () => {
  const { site_id } = useParams();
  const [selectedDate, setSelectedDate] = useState('');
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(false); // 🔄 Loading state

  // Set default date when the component mounts
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
    filterLogs(today);
  }, []);

  // Function to filter logs
  const filterLogs = (date) => {
    setLoading(true); // Start loading
    setTimeout(() => {
      const logs = cleaning_log
        .filter((log) => log.site_id === site_id) // Filter by Site ID
        .filter((log) => (date ? log.start_timestamp.startsWith(date) : true)); // Filter by selected date
      setFilteredLogs(logs);
      setLoading(false); // Stop loading
    }, 800); // Simulate network delay for smooth UI
  };

  // Handle Date Change
  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    filterLogs(newDate);
  };

  // Function to export data to Excel

  // 🔽 Export to CSV Function
  const exportToCSV = () => {
    if (filteredLogs.length === 0) {
      toast.error('No data available to export.');
      return;
    }

    const csvHeader = [
      'Sr,Robot No,Row Number,Row Length (Meters),Cleaning Date,Cleaning Start Time,Battery Start (%),Cleaning Finished Time,Battery Finished (%),Distance Covered (Meters),Status',
    ];

    const csvRows = filteredLogs.map((log, index) => {
      const startBattery = log.start_battery_percentage;
      const endBattery = log.finish_battery_percentage;
      const cleaningFinishedTime = log.finish_timestamp;

      return `${index + 1},${log.robot_no},${log.row_number},${
        log.row_length
      },${log.start_timestamp.split(' ')[0]},${
        log.start_timestamp
      },${startBattery},${cleaningFinishedTime},${endBattery},${
        log.claculated_distance
      },${log.cleaning_status}`;
    });

    const csvContent = [csvHeader, ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Cleaning_Log_${selectedDate}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4">
      <h2 className="mb-4">
        Cleaning Logs of <b className="text-success">{site_id}</b>
      </h2>

      {/* 📅 Date Picker */}
      <CRow className="justify-content-between mb-3">
        <CCol md={2}>
          <CFormInput
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="mb-3"
          />
        </CCol>
        <CCol md={4} className="text-end">
          <CButton
            color="success"
            className="text-white"
            as="button"
            onClick={exportToCSV}
            // disabled={filteredLogs.length === 0}
          >
            📥 Export CSV
          </CButton>
        </CCol>
      </CRow>

      {/* 📝 Show Table Only if Date is Selected */}
      {selectedDate && (
        <CCard className="shadow-sm">
          <CCardHeader>
            <h5 className="m-0">📝 Cleaning Log Report</h5>
          </CCardHeader>
          <CCardBody>
            {/* 🔄 Loading Indicator */}
            {loading ? (
              <div className="text-center my-4">
                <CSpinner color="primary" />
              </div>
            ) : (
              <CTable bordered hover responsive className="text-center">
                <CTableHead color="dark">
                  <CTableRow>
                    <CTableHeaderCell>Sr</CTableHeaderCell>
                    <CTableHeaderCell style={{ minWidth: '150px' }}>
                      Robot No
                    </CTableHeaderCell>
                    <CTableHeaderCell>Row Number</CTableHeaderCell>
                    <CTableHeaderCell>Row Length (Meters)</CTableHeaderCell>
                    <CTableHeaderCell>Cleaning Date</CTableHeaderCell>
                    <CTableHeaderCell>Cleaning Start Time</CTableHeaderCell>
                    <CTableHeaderCell>Battery Start (%)</CTableHeaderCell>
                    <CTableHeaderCell>Cleaning Finished Time</CTableHeaderCell>
                    <CTableHeaderCell>Battery Finished (%)</CTableHeaderCell>
                    <CTableHeaderCell>
                      Distance Covered (Meters)
                    </CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {filteredLogs.length > 0 ? (
                    filteredLogs.map((log, index) => (
                      <CTableRow key={log.id}>
                        <CTableDataCell>{index + 1}</CTableDataCell>
                        <CTableDataCell>{log.robot_no}</CTableDataCell>
                        <CTableDataCell>{log.row_number}</CTableDataCell>
                        <CTableDataCell>{log.row_length}</CTableDataCell>
                        <CTableDataCell>
                          {log.start_timestamp.split(' ')[0]}
                        </CTableDataCell>
                        <CTableDataCell>{log.start_timestamp}</CTableDataCell>
                        <CTableDataCell>
                          {log.start_battery_percentage}
                        </CTableDataCell>
                        {log.finish_timestamp === null ? (
                          <CTableDataCell colSpan={4} className="text-center">
                            <span className="badge bg-warning">
                              Cleaning in progress
                            </span>
                          </CTableDataCell>
                        ) : (
                          <>
                            <CTableDataCell>
                              {log.finish_timestamp}
                            </CTableDataCell>
                            <CTableDataCell>
                              {log.finish_battery_percentage}
                            </CTableDataCell>
                            <CTableDataCell>
                              {log.claculated_distance}
                            </CTableDataCell>
                            <CTableDataCell>
                              {log.cleaning_status}
                            </CTableDataCell>
                          </>
                        )}
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell
                        colSpan="11"
                        className="text-center text-danger"
                      >
                        No logs found for the selected date.
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            )}
          </CCardBody>
        </CCard>
      )}
    </div>
  );
};

export default SitewaiseLog;
