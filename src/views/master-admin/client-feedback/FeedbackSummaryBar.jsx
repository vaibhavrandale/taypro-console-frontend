import CriticalBadge from "./CriticalBadge";

const FeedbackSummaryBar = ({ avgPortal, avgService, criticalCount }) => (
  <div className="d-flex flex-wrap gap-2 align-items-center">
    <div className="px-2 py-1 border rounded">
      <span className="small text-success fw-semibold">Portal</span> ⭐{" "}
      {avgPortal}
    </div>

    <div className="px-2 py-1 border rounded">
      <span className="small text-info fw-semibold">Service</span> ⭐{" "}
      {avgService}
    </div>

    <CriticalBadge count={criticalCount} />
  </div>
);

export default FeedbackSummaryBar;
