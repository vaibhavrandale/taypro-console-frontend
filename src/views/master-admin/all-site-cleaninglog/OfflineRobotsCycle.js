// import React from "react";

// const OfflineRobotsCycle = () => {
//   return <div>OfflineRobotsCycle</div>;
// };

// export default OfflineRobotsCycle;

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
import LoadingSpinner from "../../../components/LoadingSpinner";

const OfflineRobotsCycle = ({
  offlineLogs,
  offlineRobotLoading,
  offlineRobotError,
}) => {
  const cycle1 = [];
  const cycle2 = [];
  const cycle3 = [];

  offlineLogs.length > 0 &&
    offlineLogs.forEach((log) => {
      const createdTime = new Date(log.createdAt);
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

  console.log("Cycle 1:", cycle1);
  console.log("Cycle 2:", cycle2);
  console.log("Cycle 3:", cycle3);

  return (
    <div>
      <h4>Offline Robots Cycle 1 (6 AM - 12 PM)</h4>
      <CTable bordered hover responsive className="text-center bg-important">
        <CTableHead color="secondary">
          <CTableRow>
            <CTableHeaderCell>#</CTableHeaderCell>
            <CTableHeaderCell>Robot No</CTableHeaderCell>
            <CTableHeaderCell>Block</CTableHeaderCell>
            <CTableHeaderCell>startAt</CTableHeaderCell>
            <CTableHeaderCell>Error Type</CTableHeaderCell>
          </CTableRow>
        </CTableHead>

        <CTableBody>
          {offlineRobotLoading ? (
            <CTableRow>
              <CTableDataCell colSpan={5}>
                <LoadingSpinner />
              </CTableDataCell>
            </CTableRow>
          ) : offlineRobotError ? (
            <CBadge color="danger">{offlineRobotError}</CBadge>
          ) : cycle1?.length > 0 ? (
            cycle1.map((log, index) => (
              <CTableRow key={index}>
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell>{log.robot_no}</CTableDataCell>
                <CTableDataCell>{log.block}</CTableDataCell>
                {/* <CTableDataCell>{log.createdAt}</CTableDataCell> */}

                <CTableDataCell>
                  {log.createdAt &&
                    new Date(log.createdAt).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                    })}
                </CTableDataCell>

                <CTableDataCell>{log.error_type}</CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan={5} className="text-start">
                No offline Robots found for the selected date.
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>
      <h4 className="my-2">Offline Robots Cycle 2 (12 PM - 3 PM)</h4>
      <CTable bordered hover responsive className="text-center bg-important">
        <CTableHead color="secondary">
          <CTableRow>
            <CTableHeaderCell>#</CTableHeaderCell>
            <CTableHeaderCell>Robot No</CTableHeaderCell>
            <CTableHeaderCell>Block</CTableHeaderCell>
            <CTableHeaderCell>startAt</CTableHeaderCell>
            <CTableHeaderCell>Error Type</CTableHeaderCell>
          </CTableRow>
        </CTableHead>

        <CTableBody>
          {offlineRobotLoading ? (
            <CTableRow>
              <CTableDataCell colSpan={5}>
                <LoadingSpinner />
              </CTableDataCell>
            </CTableRow>
          ) : offlineRobotError ? (
            <CBadge color="danger">{offlineRobotError}</CBadge>
          ) : cycle2?.length > 0 ? (
            cycle2.map((log, index) => (
              <CTableRow key={index}>
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell>{log.robot_no}</CTableDataCell>
                <CTableDataCell>{log.block}</CTableDataCell>
                {/* <CTableDataCell>{log.createdAt}</CTableDataCell> */}

                <CTableDataCell>
                  {log.createdAt &&
                    new Date(log.createdAt).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                    })}
                </CTableDataCell>

                <CTableDataCell>{log.error_type}</CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan={5} className="text-start">
                No offline Robots found for Cycle 2.
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>
      <h4 className="my-2">Offline Robots Cycle 3 (3 PM - 12 AM)</h4>
      <CTable bordered hover responsive className="text-center bg-important">
        <CTableHead color="secondary">
          <CTableRow>
            <CTableHeaderCell>#</CTableHeaderCell>
            <CTableHeaderCell>Robot No</CTableHeaderCell>
            <CTableHeaderCell>Block</CTableHeaderCell>
            <CTableHeaderCell>startAt</CTableHeaderCell>
            <CTableHeaderCell>Error Type</CTableHeaderCell>
          </CTableRow>
        </CTableHead>

        <CTableBody>
          {offlineRobotLoading ? (
            <CTableRow>
              <CTableDataCell colSpan={5}>
                <LoadingSpinner />
              </CTableDataCell>
            </CTableRow>
          ) : offlineRobotError ? (
            <CBadge color="danger">{offlineRobotError}</CBadge>
          ) : cycle3?.length > 0 ? (
            cycle3.map((log, index) => (
              <CTableRow key={index}>
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell>{log.robot_no}</CTableDataCell>
                <CTableDataCell>{log.block}</CTableDataCell>
                {/* <CTableDataCell>{log.createdAt}</CTableDataCell> */}

                <CTableDataCell>
                  {log.createdAt &&
                    new Date(log.createdAt).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                    })}
                </CTableDataCell>

                <CTableDataCell>{log.error_type}</CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan={5} className="text-start">
                No offline Robots found for Cycle 3.
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>
    </div>
  );
};

export default OfflineRobotsCycle;
