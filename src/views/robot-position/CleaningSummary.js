import React from "react";
import { CCard, CCardBody, CBadge } from "@coreui/react";

const MetricCard = ({ icon, label, count, color, textColor }) => (
  <CCard className="shadow-sm border-0 rounded-3 text-center flex-grow-1">
    <CCardBody className="d-flex flex-column align-items-center justify-content-center py-3">
      <span className="fs-4 mb-1">{icon}</span>
      <span className="fw-semibold text-white mb-2">{label}</span>
      <CBadge
        color={color}
        textColor={textColor || "light"}
        className="px-3 py-2 fs-6"
      >
        {count}
      </CBadge>
    </CCardBody>
  </CCard>
);

const CleaningSummary = ({
  successFullCleaningCount,
  CleaninginProgressCount,
  BatteryDeadCount,
  CleaningCancelCount,
  noCleaningCount,
  totalCount,
  totalDeleted,
  userInfo,
}) => {
  return (
    <div className="d-flex flex-wrap gap-3 justify-content-around  p-3 rounded-3 shadow-sm">
      <MetricCard
        icon="✅"
        label="Successful"
        count={successFullCleaningCount}
        color="success"
      />
      <MetricCard
        icon="⚙️"
        label="In Progress"
        count={CleaninginProgressCount}
        color="info"
      />
      <MetricCard
        icon="🔋"
        label="Battery Dead"
        count={BatteryDeadCount}
        color="danger"
        textColor="dark"
      />
      <MetricCard
        icon="🚫"
        label="Cancelled"
        count={CleaningCancelCount}
        color="danger"
      />
      <MetricCard
        icon="⏸️"
        label="No Cleaning"
        count={noCleaningCount}
        color="secondary"
      />
      <MetricCard
        icon="📊"
        label="Total"
        count={totalCount}
        color="light"
        textColor="dark"
      />
      {userInfo?.role === "Master Admin" && (
        <MetricCard
          icon="⚠"
          label="Total Deleted"
          count={totalDeleted}
          color="light"
          textColor="dark"
        />
      )}
    </div>
  );
};

export default CleaningSummary;
