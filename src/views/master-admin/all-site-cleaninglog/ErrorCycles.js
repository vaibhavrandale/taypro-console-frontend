// import React from "react";

// const ErrorCycles = ({ errorlogs }) => {
//   const cycle1 = [];
//   const cycle2 = [];
//   const cycle3 = [];

//   errorlogs?.forEach((log) => {
//     const createdTime = new Date(log.createdAt);
//     const hours = createdTime.getHours();

//     // 6 AM - 12 PM
//     if (hours >= 6 && hours < 12) {
//       cycle1.push(log);
//     }

//     // 12 PM - 3 PM
//     else if (hours >= 12 && hours < 15) {
//       cycle2.push(log);
//     }

//     // 3 PM - 12 AM
//     else if (hours >= 15 && hours <= 23) {
//       cycle3.push(log);
//     }
//   });

//   console.log("Cycle 1:", cycle1);
//   console.log("Cycle 2:", cycle2);
//   console.log("Cycle 3:", cycle3);

//   return (
//     <div>
//       <h3>Cycle 1: {cycle1.length}</h3>
//       <h3>Cycle 2: {cycle2.length}</h3>
//       <h3>Cycle 3: {cycle3.length}</h3>
//     </div>
//   );
// };

// export default ErrorCycles;

import {
  CBadge,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import React from "react";

const ErrorCycles = ({ errorlogs }) => {
  const cycle1 = [];
  const cycle2 = [];
  const cycle3 = [];

  errorlogs?.forEach((log) => {
    const createdTime = new Date(log.cleaning.startAt);
    const hours = createdTime.getHours();

    // 6 AM - 12 PM
    if (hours >= 6 && hours < 12) {
      cycle1.push(log);
    }

    // 12 PM - 3 PM
    else if (hours >= 12 && hours < 15) {
      cycle2.push(log);
    }

    // 3 PM - 12 AM
    else if (hours >= 15 && hours <= 23) {
      cycle3.push(log);
    }
  });

  return (
    <div>
      <h4>Error Cycle 1 (6 AM - 12 PM)</h4>
      <CTable
        bordered
        hover
        responsive
        className="text-center bg-important mb-2"
      >
        <CTableHead color="secondary">
          <CTableRow>
            <CTableHeaderCell>Sr</CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "150px" }}>
              Robot No
            </CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "130px" }}>
              Row Number
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "190px" }}>
              Row Length (Meters)
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "190px" }}>
              Started At
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "190px" }}>
              Finished At
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "150px" }}>
              Battery Start (%)
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "190px" }}>
              Battery Finished (%)
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>

        <CTableBody>
          {cycle1.length > 0 ? (
            cycle1.map((log, index) => (
              <CTableRow key={index}>
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell>{log.robot_no}</CTableDataCell>

                {/* STATUS */}
                <CTableDataCell>
                  {log.cleaning.finish ? (
                    <CBadge color="success">Completed</CBadge>
                  ) : log.cleaning.battery_dead ? (
                    <CBadge color="danger">Battery Dead</CBadge>
                  ) : log.cleaning.cleaning_cancelled ? (
                    <CBadge color="danger">Cleaning Cancelled</CBadge>
                  ) : (
                    <CBadge color="info">In Progress</CBadge>
                  )}
                </CTableDataCell>

                <CTableDataCell>{log.row_no}</CTableDataCell>
                <CTableDataCell>{log.row_length}</CTableDataCell>

                <CTableDataCell>
                  {log.cleaning.start &&
                    new Date(log.cleaning.startAt).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                    })}
                </CTableDataCell>

                <CTableDataCell>
                  {log.cleaning.finish ? (
                    new Date(log.cleaning.finishAt).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                    })
                  ) : log.cleaning.battery_dead ? (
                    <CBadge color="danger">Battery Dead</CBadge>
                  ) : log.cleaning.cleaning_cancelled ? (
                    <CBadge color="danger">Cleaning Cancelled</CBadge>
                  ) : (
                    <CBadge color="info">In Progress</CBadge>
                  )}
                </CTableDataCell>

                <CTableDataCell>
                  {log.cleaning.battery_before_cleaning || "N/A"}
                </CTableDataCell>

                <CTableDataCell>
                  {log.cleaning.battery_after_cleaning || "N/A"}
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan="11" className="text-start">
                No logs found for Cycle 1.
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>
      <h4 className="my-2">Error Cycle 2 (12 PM - 3 PM)</h4>
      <CTable
        bordered
        hover
        responsive
        className="text-center bg-important mb-2"
      >
        <CTableHead color="secondary">
          <CTableRow>
            <CTableHeaderCell>Sr</CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "150px" }}>
              Robot No
            </CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "130px" }}>
              Row Number
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "190px" }}>
              Row Length (Meters)
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "190px" }}>
              Started At
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "190px" }}>
              Finished At
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "150px" }}>
              Battery Start (%)
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "190px" }}>
              Battery Finished (%)
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>

        <CTableBody>
          {cycle2.length > 0 ? (
            cycle2.map((log, index) => (
              <CTableRow key={index}>
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell>{log.robot_no}</CTableDataCell>

                {/* STATUS */}
                <CTableDataCell>
                  {log.cleaning.finish ? (
                    <CBadge color="success">Completed</CBadge>
                  ) : log.cleaning.battery_dead ? (
                    <CBadge color="danger">Battery Dead</CBadge>
                  ) : log.cleaning.cleaning_cancelled ? (
                    <CBadge color="danger">Cleaning Cancelled</CBadge>
                  ) : (
                    <CBadge color="info">In Progress</CBadge>
                  )}
                </CTableDataCell>

                <CTableDataCell>{log.row_no}</CTableDataCell>
                <CTableDataCell>{log.row_length}</CTableDataCell>

                <CTableDataCell>
                  {log.cleaning.start &&
                    new Date(log.cleaning.startAt).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                    })}
                </CTableDataCell>

                <CTableDataCell>
                  {log.cleaning.finish ? (
                    new Date(log.cleaning.finishAt).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                    })
                  ) : log.cleaning.battery_dead ? (
                    <CBadge color="danger">Battery Dead</CBadge>
                  ) : log.cleaning.cleaning_cancelled ? (
                    <CBadge color="danger">Cleaning Cancelled</CBadge>
                  ) : (
                    <CBadge color="info">In Progress</CBadge>
                  )}
                </CTableDataCell>

                <CTableDataCell>
                  {log.cleaning.battery_before_cleaning || "N/A"}
                </CTableDataCell>

                <CTableDataCell>
                  {log.cleaning.battery_after_cleaning || "N/A"}
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan="11" className="text-start">
                No logs found for Cycle 2.
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>
      <h4 className="my-2">ErrorCycle 3 (3 PM - 12 AM)</h4>
      <CTable
        bordered
        hover
        responsive
        className="text-center bg-important mb-2"
      >
        <CTableHead color="secondary">
          <CTableRow>
            <CTableHeaderCell>Sr</CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "150px" }}>
              Robot No
            </CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "130px" }}>
              Row Number
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "190px" }}>
              Row Length (Meters)
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "190px" }}>
              Started At
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "190px" }}>
              Finished At
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "150px" }}>
              Battery Start (%)
            </CTableHeaderCell>
            <CTableHeaderCell style={{ minWidth: "190px" }}>
              Battery Finished (%)
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>

        <CTableBody>
          {cycle3.length > 0 ? (
            cycle3.map((log, index) => (
              <CTableRow key={index}>
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell>{log.robot_no}</CTableDataCell>

                {/* STATUS */}
                <CTableDataCell>
                  {log.cleaning.finish ? (
                    <CBadge color="success">Completed</CBadge>
                  ) : log.cleaning.battery_dead ? (
                    <CBadge color="danger">Battery Dead</CBadge>
                  ) : log.cleaning.cleaning_cancelled ? (
                    <CBadge color="danger">Cleaning Cancelled</CBadge>
                  ) : (
                    <CBadge color="info">In Progress</CBadge>
                  )}
                </CTableDataCell>

                <CTableDataCell>{log.row_no}</CTableDataCell>
                <CTableDataCell>{log.row_length}</CTableDataCell>

                <CTableDataCell>
                  {log.cleaning.start &&
                    new Date(log.cleaning.startAt).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                    })}
                </CTableDataCell>

                <CTableDataCell>
                  {log.cleaning.finish ? (
                    new Date(log.cleaning.finishAt).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                    })
                  ) : log.cleaning.battery_dead ? (
                    <CBadge color="danger">Battery Dead</CBadge>
                  ) : log.cleaning.cleaning_cancelled ? (
                    <CBadge color="danger">Cleaning Cancelled</CBadge>
                  ) : (
                    <CBadge color="info">In Progress</CBadge>
                  )}
                </CTableDataCell>

                <CTableDataCell>
                  {log.cleaning.battery_before_cleaning || "N/A"}
                </CTableDataCell>

                <CTableDataCell>
                  {log.cleaning.battery_after_cleaning || "N/A"}
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan="11" className="text-start">
                No logs found for Cycle 3.
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>
    </div>
  );
};

export default ErrorCycles;
