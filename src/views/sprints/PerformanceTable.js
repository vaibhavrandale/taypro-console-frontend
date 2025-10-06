import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CProgress,
} from "@coreui/react";
import { CIcon } from "@coreui/icons-react";
import { cilStar } from "@coreui/icons";

const PerformanceTable = ({ reports = [] }) => {
  const getRatingColor = (rating) => {
    if (rating >= 4.5) return "success"; // green
    if (rating >= 3) return "warning"; // yellow
    return "danger"; // red
  };

  const getPerformanceLabel = (rating) => {
    if (rating >= 4.5) return "Excellent";
    if (rating >= 3) return "Good";
    return "Needs Improvement";
  };

  return (
    <div className=" rounded-4 shadow-sm">
      <CTable bordered hover responsive align="middle">
        <CTableHead>
          <CTableRow className="text-center">
            <CTableHeaderCell>Member</CTableHeaderCell>
            <CTableHeaderCell>Total Tasks</CTableHeaderCell>

            <CTableHeaderCell>In Progress</CTableHeaderCell>
            <CTableHeaderCell>Under Review/Completed</CTableHeaderCell>
            <CTableHeaderCell>Approved</CTableHeaderCell>
            <CTableHeaderCell>Rejected</CTableHeaderCell>
            <CTableHeaderCell>Progress</CTableHeaderCell>
            <CTableHeaderCell className="text-center">Rating</CTableHeaderCell>
          </CTableRow>
        </CTableHead>

        <CTableBody>
          {reports.length > 0 ? (
            reports.map((r, index) => (
              <CTableRow key={index} className="text-center">
                {/* Member Info */}
                <CTableDataCell>{r.username}</CTableDataCell>

                {/* Stats */}
                <CTableDataCell>{r.totalTasks}</CTableDataCell>

                <CTableDataCell>
                  <CBadge color="warning">{r.inProgressTasks}</CBadge>
                </CTableDataCell>
                <CTableDataCell>
                  <CBadge color="success">{r.under_review}</CBadge>
                </CTableDataCell>
                <CTableDataCell>
                  <CBadge color="success">{r.approvedTasks}</CBadge>
                </CTableDataCell>
                <CTableDataCell>
                  <CBadge color="danger">{r.rejectedTasks}</CBadge>
                </CTableDataCell>

                {/* Progress */}
                <CTableDataCell style={{ minWidth: "130px" }}>
                  <CProgress
                    value={r.averageProgress}
                    color={r.averageProgress >= 75 ? "success" : "warning"}
                    animated
                    height={8}
                    className="mb-1"
                  />
                  <small className="text-muted">{r.averageProgress}%</small>
                </CTableDataCell>

                {/* Rating */}
                <CTableDataCell className="text-center">
                  <div>
                    <strong className={`text-${getRatingColor(r.rating)}`}>
                      {r.rating?.toFixed(1)} <CIcon icon={cilStar} />
                    </strong>
                    <div className="small text-muted">
                      {getPerformanceLabel(r.rating)}
                    </div>
                  </div>
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell
                colSpan={9}
                className="text-center text-muted py-4"
              >
                No data found
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>
    </div>
  );
};

export default PerformanceTable;
