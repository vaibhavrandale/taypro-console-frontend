// import React, { useEffect, useState } from 'react';
// import {
//   CTable,
//   CTableHead,
//   CTableRow,
//   CTableHeaderCell,
//   CTableBody,
//   CTableDataCell,
//   CFormInput,
//   CRow,
//   CCol,
//   CCard,
//   CCardBody,
//   CCardHeader,
// } from '@coreui/react';
// import { cleaning_log } from '../../../data'; // Import cleaning logs data
// import { useParams } from 'react-router-dom';

// const SitewaiseLog = () => {
//   const { site_id } = useParams();
//   const [selectedDate, setSelectedDate] = useState('');

//   // Set default date when the component mounts
//   useEffect(() => {
//     setSelectedDate(new Date().toISOString().split('T')[0]); // Auto-select today's date
//   }, []);

//   const filteredLogs = cleaning_log
//     .filter((log) => log.site_id === site_id) // Filter by Site ID
//     .filter(
//       (log) => (selectedDate ? log.timestamp.startsWith(selectedDate) : true) // Filter by selected date
//     );

//   return (
//     <div className="p-4">
//       <h2 className="mb-4">🧼 Cleaning Logs</h2>

//       {/* 📅 Date Picker */}
//       <CRow className="justify-content-end mb-3">
//         <CCol md={4}>
//           <CFormInput
//             type="date"
//             value={selectedDate}
//             onChange={(e) => setSelectedDate(e.target.value)}
//             className="mb-3"
//           />
//         </CCol>
//       </CRow>

//       {/* 📝 Show Table Only if Date is Selected */}
//       {selectedDate && (
//         <CCard className="shadow-sm">
//           <CCardHeader>
//             <h5 className="m-0">📝 Cleaning Log Report</h5>
//           </CCardHeader>
//           <CCardBody>
//             <CTable bordered hover responsive>
//               <CTableHead color="dark">
//                 <CTableRow>
//                   <CTableHeaderCell>Sr</CTableHeaderCell>
//                   <CTableHeaderCell>Device Name</CTableHeaderCell>
//                   <CTableHeaderCell>Row Number</CTableHeaderCell>
//                   <CTableHeaderCell>Row Length (Meters)</CTableHeaderCell>
//                   <CTableHeaderCell>Cleaning Date</CTableHeaderCell>
//                   <CTableHeaderCell>Cleaning Start Time</CTableHeaderCell>
//                   <CTableHeaderCell>Battery Start (%)</CTableHeaderCell>
//                   <CTableHeaderCell>Cleaning Finished Time</CTableHeaderCell>
//                   <CTableHeaderCell>Battery Finished (%)</CTableHeaderCell>
//                   <CTableHeaderCell>Distance Covered (Meters)</CTableHeaderCell>
//                   <CTableHeaderCell>Status</CTableHeaderCell>
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {filteredLogs.length > 0 ? (
//                   filteredLogs.map((log, index) => (
//                     <CTableRow key={log.id}>
//                       <CTableDataCell>{index + 1}</CTableDataCell>
//                       <CTableDataCell>{log.robot_no}</CTableDataCell>
//                       <CTableDataCell>N/A</CTableDataCell>
//                       <CTableDataCell>660</CTableDataCell>
//                       <CTableDataCell>
//                         {log.timestamp.split(' ')[0]}
//                       </CTableDataCell>
//                       <CTableDataCell>{log.timestamp}</CTableDataCell>
//                       <CTableDataCell>
//                         {Math.floor(Math.random() * 30) + 70}
//                       </CTableDataCell>
//                       <CTableDataCell>
//                         {new Date(
//                           new Date(log.timestamp).getTime() + 55 * 60 * 1000
//                         )
//                           .toISOString()
//                           .replace('T', ' ')
//                           .slice(0, 19)}
//                       </CTableDataCell>
//                       <CTableDataCell>
//                         {Math.floor(Math.random() * 20) + 30}
//                       </CTableDataCell>
//                       <CTableDataCell>672</CTableDataCell>
//                       <CTableDataCell>
//                         <span className="badge bg-success">Success</span>
//                       </CTableDataCell>
//                     </CTableRow>
//                   ))
//                 ) : (
//                   <CTableRow>
//                     <CTableDataCell
//                       colSpan="11"
//                       className="text-center text-danger"
//                     >
//                       No logs found for the selected date.
//                     </CTableDataCell>
//                   </CTableRow>
//                 )}
//               </CTableBody>
//             </CTable>
//           </CCardBody>
//         </CCard>
//       )}
//     </div>
//   );
// };

// export default SitewaiseLog;

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
import * as XLSX from 'xlsx'; // Import xlsx for Excel export
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
        .filter((log) => (date ? log.timestamp.startsWith(date) : true)); // Filter by selected date
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
      alert('No data available to export.');
      return;
    }

    const csvHeader = [
      'Sr,Robot No,Row Number,Row Length (Meters),Cleaning Date,Cleaning Start Time,Battery Start (%),Cleaning Finished Time,Battery Finished (%),Distance Covered (Meters),Status',
    ];

    const csvRows = filteredLogs.map((log, index) => {
      const startBattery = Math.floor(Math.random() * 30) + 70;
      const endBattery = Math.floor(Math.random() * 20) + 30;
      const cleaningFinishedTime = new Date(
        new Date(log.timestamp).getTime() + 55 * 60 * 1000
      )
        .toISOString()
        .replace('T', ' ')
        .slice(0, 19);

      return `${index + 1},${log.robot_no},N/A,660,${
        log.timestamp.split(' ')[0]
      },${
        log.timestamp
      },${startBattery},${cleaningFinishedTime},${endBattery},672,Success`;
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
        <CCol md={4}>
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
            disabled={filteredLogs.length === 0}
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
              <CTable bordered hover responsive>
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
                        <CTableDataCell>N/A</CTableDataCell>
                        <CTableDataCell>660</CTableDataCell>
                        <CTableDataCell>
                          {log.timestamp.split(' ')[0]}
                        </CTableDataCell>
                        <CTableDataCell>{log.timestamp}</CTableDataCell>
                        <CTableDataCell>
                          {Math.floor(Math.random() * 30) + 70}
                        </CTableDataCell>
                        <CTableDataCell>
                          {new Date(
                            new Date(log.timestamp).getTime() + 55 * 60 * 1000
                          )
                            .toISOString()
                            .replace('T', ' ')
                            .slice(0, 19)}
                        </CTableDataCell>
                        <CTableDataCell>
                          {Math.floor(Math.random() * 20) + 30}
                        </CTableDataCell>
                        <CTableDataCell>672</CTableDataCell>
                        <CTableDataCell>
                          <span className="badge bg-success">Success</span>
                        </CTableDataCell>
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
