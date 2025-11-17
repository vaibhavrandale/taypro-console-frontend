import React from "react";
import {
  CCard,
  CCardBody,
  CTable,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CBadge,
} from "@coreui/react";

const MdsStatusOverviewCard = ({
  mds,
  getMdsStatusColor,
  getMdsStatusText,
}) => {
  if (!mds) return null;

  return (
    <CCard className="border-0 mb-3 shadow-sm bg-secondary">
      <CCardBody>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="text-light mb-0">Status Overview</h5>
          <CBadge color={getMdsStatusColor()} className="px-3 py-2">
            {getMdsStatusText()}
          </CBadge>
        </div>

        <CTable
          responsive
          striped
          hover
          bordered
          size="sm"
          className="text-light mb-0"
        >
          <CTableBody>
            <CTableRow>
              <CTableHeaderCell scope="row" style={{ minWidth: "150px" }}>
                MDS Number
              </CTableHeaderCell>
              <CTableDataCell>{mds.mds_no}</CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableHeaderCell scope="row">DevEUI</CTableHeaderCell>
              <CTableDataCell style={{ fontSize: "12px" }}>
                {mds.deveui}
              </CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableHeaderCell scope="row">Company</CTableHeaderCell>
              <CTableDataCell>{mds.company}</CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableHeaderCell scope="row">Total Rows</CTableHeaderCell>
              <CTableDataCell>
                <div className="border-0 card" style={{ width: "100px" }}>
                  <div
                    className="alert alert-warning m-2 p-1"
                    style={{ width: "70%" }}
                  >
                    <div className="d-flex align-items-center">
                      <small className="text-dark ms-2">
                        {mds.no_of_rows} Rows
                      </small>
                    </div>
                  </div>
                </div>
              </CTableDataCell>
            </CTableRow>
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  );
};

export default MdsStatusOverviewCard;
