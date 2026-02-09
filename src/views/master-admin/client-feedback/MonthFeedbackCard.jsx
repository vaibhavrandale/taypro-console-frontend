import { useState } from "react";
import { CCard } from "@coreui/react";
import FeedbackSummaryBar from "./FeedbackSummaryBar";
import FeedbackItemCard from "./FeedbackItemCard";

const MonthFeedbackCard = ({ month, items }) => {
  const [open, setOpen] = useState(false);

  const completedItems = items.filter((f) => f.status === true);

  const getAvg = (path) => {
    const valid = completedItems.filter((f) => typeof path(f) === "number");
    return valid.length
      ? (valid.reduce((s, f) => s + path(f), 0) / valid.length).toFixed(1)
      : "N/A";
  };

  const avgPortal = getAvg((f) => f.feedback_data?.rating);
  const avgService = getAvg((f) => f.service_feedback_data?.rating);

  const criticalCount = items.filter((f) =>
    [f.feedback_data?.rating, f.service_feedback_data?.rating]
      .filter(Boolean)
      .some((r) => r <= 2),
  ).length;

  return (
    <CCard
      className={`mb-3 shadow-sm ${
        criticalCount > 0 ? "border border-danger border-2" : ""
      }`}
    >
      {/* Header */}
      <div
        className="d-flex justify-content-between px-3 py-3 align-items-center"
        onClick={() => setOpen(!open)}
        style={{ cursor: "pointer" }}
      >
        <div>
          <h6 className="mb-0 fw-bold">{month}</h6>
          <small className="text-muted">{items.length} feedbacks</small>
        </div>

        <FeedbackSummaryBar
          avgPortal={avgPortal}
          avgService={avgService}
          criticalCount={criticalCount}
        />
      </div>

      {open && (
        <div className="p-3">
          <div className="row g-3">
            {items.map((feedback) => (
              <FeedbackItemCard key={feedback._id} feedback={feedback} />
            ))}
          </div>
        </div>
      )}
    </CCard>
  );
};

export default MonthFeedbackCard;
