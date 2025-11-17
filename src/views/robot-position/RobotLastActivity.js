import React from "react";
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CCard,
  CCardBody,
} from "@coreui/react";

const RobotLastActivity = ({ last_activity }) => {
  if (!last_activity || last_activity.length === 0) {
    return (
      <CCard className="border-0 my-3 shadow-sm ">
        <CCardBody>
          <CTable bordered hover responsive>
            <CTableBody>
              <CTableRow>
                <CTableDataCell>No activity found</CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    );
  }

  return (
    <CCard className="border-0 my-3 shadow-sm ">
      <CCardBody>
        <CTable bordered hover responsive>
          <CTableHead color="dark">
            <CTableRow>
              <CTableHeaderCell scope="col">#</CTableHeaderCell>
              <CTableHeaderCell scope="col">Data</CTableHeaderCell>
              <CTableHeaderCell scope="col">Topic</CTableHeaderCell>
              <CTableHeaderCell scope="col">Details</CTableHeaderCell>
              <CTableHeaderCell scope="col">Timestamp</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {last_activity &&
              last_activity
                .map((activity, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell scope="row">{index + 1}</CTableDataCell>

                    <CTableDataCell>
                      <span color="info">{activity.data}</span>
                    </CTableDataCell>
                    <CTableDataCell>{activity.topic}</CTableDataCell>
                    <CTableDataCell>
                      <span
                        dangerouslySetInnerHTML={{ __html: activity.details }}
                      ></span>
                    </CTableDataCell>
                    <CTableDataCell>
                      {new Date(activity.timestamp).toLocaleString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                      })}
                    </CTableDataCell>
                  </CTableRow>
                ))
                .reverse()}
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  );
};

export default RobotLastActivity;
