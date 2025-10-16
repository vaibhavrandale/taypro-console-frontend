import React from "react";
import {
  CCard,
  CCardHeader,
  CCardBody,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
} from "@coreui/react";

const TrackingDetailsTable = ({ trackDetails }) => {
  if (!trackDetails?.length) return null;

  // Remove duplicate points
  const uniqueTrackDetails = [
    ...new Map(trackDetails.map((t) => [t.point, t])).values(),
  ].reverse(); // latest first

  return (
    <CCard className="border-0 mt-3 bg-dark text-light shadow-sm">
      <CCardHeader className="text-info">
        <span className="mb-0">Track Details</span>
      </CCardHeader>
      <CCardBody style={{ maxHeight: "200px", overflowY: "auto" }}>
        <CTable striped hover responsive size="sm" className="mb-0 text-light">
          <CTableHead
            style={{ position: "sticky", top: 0, backgroundColor: "#343a40" }}
          >
            <CTableRow>
              <CTableHeaderCell className="text-center">#</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Point</CTableHeaderCell>
              <CTableHeaderCell className="text-start">
                Timestamp
              </CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {uniqueTrackDetails.map((t, idx) => (
              <CTableRow
                key={idx}
                className={t.point === 30 ? "table-warning" : ""}
              >
                <CTableDataCell className="text-center">
                  {idx + 1}
                </CTableDataCell>
                <CTableDataCell className="text-center">
                  {t.point}
                </CTableDataCell>
                <CTableDataCell className="text-start">
                  {new Date(t.timestamp).toLocaleString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                  })}
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  );
};

export default TrackingDetailsTable;
