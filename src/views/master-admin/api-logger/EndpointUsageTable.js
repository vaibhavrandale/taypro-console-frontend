import {
  CCard,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from "@coreui/react";
import moment from "moment";

const EndpointUsageTable = ({ selectedLog }) => {
  if (!selectedLog) {
    return (
      <div className="text-center text-muted py-4">
        Select an endpoint from the chart to view usage details
      </div>
    );
  }

  return (
    <CCard>
      <CCardBody>
        <h6 className="fw-semibold mb-3">
          Last Usage — {selectedLog.method} {selectedLog.endpoint}
        </h6>

        <CTable bordered hover responsive className="text-center">
          <CTableHead color="secondary">
            <CTableRow>
              <CTableHeaderCell>#</CTableHeaderCell>
              <CTableHeaderCell>Timestamp</CTableHeaderCell>
            </CTableRow>
          </CTableHead>

          <CTableBody>
            {selectedLog.last_usage.map((item, index) => (
              <CTableRow key={index}>
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell>
                  {new Date(item).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
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

export default EndpointUsageTable;
