import React from "react";
import {
  CCard,
  CCardBody,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilLocationPin, cilCheckCircle, cilXCircle } from "@coreui/icons";

const MdsPositionInformationCard = ({ mds, formatDateTime }) => {
  if (!mds?.default_mds_position) return null;

  const { mds_released, mds_released_at, mds_returned, mds_returned_at } =
    mds.default_mds_position;

  return (
    <CCard className="border-0 mb-3 shadow-sm bg-secondary">
      <CCardBody>
        <h5 className="text-light mb-3">
          <CIcon icon={cilLocationPin} className="me-2" />
          MDS Position Information
        </h5>

        <CTable
          responsive
          striped
          hover
          bordered
          size="sm"
          className="text-light mb-0"
        >
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell style={{ minWidth: "100px" }}>
                Released
              </CTableHeaderCell>
              <CTableHeaderCell>Released At</CTableHeaderCell>
              <CTableHeaderCell>Returned</CTableHeaderCell>
              <CTableHeaderCell>Returned At</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            <CTableRow>
              <CTableDataCell>
                {mds_released ? (
                  <CIcon
                    icon={cilCheckCircle}
                    style={{
                      color: "white",
                      background: "green",
                      borderRadius: "50%",
                    }}
                  />
                ) : (
                  <CIcon
                    icon={cilXCircle}
                    style={{
                      color: "white",
                      background: "red",
                      borderRadius: "50%",
                    }}
                  />
                )}
              </CTableDataCell>
              <CTableDataCell style={{ fontSize: "12px" }}>
                <span className="text-success">
                  {formatDateTime(mds_released_at)}
                </span>
              </CTableDataCell>
              <CTableDataCell>
                {mds_returned ? (
                  <CIcon
                    icon={cilCheckCircle}
                    style={{
                      color: "white",
                      background: "green",
                      borderRadius: "50%",
                    }}
                  />
                ) : (
                  <CIcon
                    icon={cilXCircle}
                    style={{
                      color: "white",
                      background: "red",
                      borderRadius: "50%",
                    }}
                  />
                )}
              </CTableDataCell>
              <CTableDataCell style={{ fontSize: "12px" }}>
                <span className="text-success">
                  {formatDateTime(mds_returned_at)}
                </span>
              </CTableDataCell>
            </CTableRow>
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  );
};

export default MdsPositionInformationCard;
