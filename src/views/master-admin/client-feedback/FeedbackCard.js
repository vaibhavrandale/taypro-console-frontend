import { CCard, CCardHeader, CCardBody, CBadge } from "@coreui/react";

import { User, Mail, Star, Wrench, Clock } from "lucide-react";

/* =====================
   STAR RATING
===================== */
const StarRating = ({ rating }) => {
  if (!rating) {
    return <CBadge color="secondary">N/A</CBadge>;
  }

  const color =
    rating <= 2
      ? "text-danger"
      : rating === 3
        ? "text-warning"
        : "text-warning";

  return (
    <div className={`d-flex align-items-center gap-1 ${color}`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={16} fill={i <= rating ? "currentColor" : "none"} />
      ))}
      <span className="small text-muted ms-1">{rating}/5</span>
    </div>
  );
};
const normalizeRating = (rating) =>
  typeof rating === "number" ? rating : null;

const getAllRatings = (feedback) => {
  const ratings = [
    normalizeRating(feedback.feedback_data?.rating),
    normalizeRating(feedback.service_feedback_data?.rating),
    normalizeRating(
      feedback.technician_feedback_data?.is_technician_assigned
        ? feedback.technician_feedback_data?.rating
        : null,
    ),
  ];

  return ratings.filter((r) => r !== null);
};

const getAverageRating = (ratings) => {
  if (!ratings.length) return null;
  return Math.round(ratings.reduce((sum, r) => sum + r, 0) / ratings.length);
};

const getRatingColor = (rating) => {
  if (rating <= 2) return "danger";
  if (rating === 3) return "warning";
  return "success";
};

/* =====================
   FEEDBACK CARD
===================== */
const FeedbackCard = ({ feedback }) => {
  const {
    customer_feedback_no,
    status,
    user,
    updatedAt,
    feedback_data,
    service_feedback_data,
    technician_feedback_data,
  } = feedback;
  const ratings = getAllRatings(feedback);
  const avgRating = getAverageRating(ratings);
  const avgColor = avgRating ? getRatingColor(avgRating) : "secondary";

  return (
    <CCard className="border-0 shadow-sm h-100 rounded-0">
      {/* ===== Header ===== */}
      <CCardHeader className="bg-transparent border-bottom">
        <div className="d-flex justify-content-between align-items-center">
          <strong>{customer_feedback_no}</strong>

          <div className="d-flex align-items-center gap-2">
            <CBadge color={status ? "success" : "warning"}>
              {status ? "Submitted" : "Pending"}
            </CBadge>

            <CBadge color={avgColor}>
              {avgRating ? `${avgRating}/5` : "N/A"}
            </CBadge>
          </div>
        </div>
      </CCardHeader>

      {/* ===== Body ===== */}
      <CCardBody className="py-3">
        {/* ================= User Details ================= */}
        <div className="mt-2">
          {/* Name + Designation */}
          <div className="d-flex align-items-center gap-2 mb-1">
            <User size={16} className="text-muted" />
            <span className="fw-semibold">{user.username}</span>
            {user.designation && (
              <CBadge color="success" shape="rounded-pill" className="ms-1">
                {user.designation}
              </CBadge>
            )}
          </div>

          {/* Email */}
          <div className="d-flex align-items-center gap-2 small text-muted mb-2">
            <Mail size={14} />
            <span>{user.email}</span>
          </div>

          {/* Meta Info */}
          <div className="small text-muted">
            {/* Sites */}
            <div className="mb-1">
              <span className="fw-semibold text-muted">📍 Site:</span>
              <span className="ms-1 text-success">
                {user.assigned_sites?.length
                  ? user.assigned_sites.map((site) => site.site_id).join(", ")
                  : "No Assigned Sites"}
              </span>
            </div>

            {/* Updated At */}
            <div className="d-flex align-items-center gap-1">
              <Clock size={12} className="text-warning" />
              <span className="text-warning">Updated:</span>
              <span>
                {new Date(updatedAt).toLocaleString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </span>
            </div>
          </div>
        </div>

        <hr />

        {/* ===== Portal Feedback ===== */}
        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <span className="fw-semibold">Portal Feedback</span>
            <StarRating rating={feedback_data?.rating} />
          </div>
          <div className="small text-muted">
            {feedback_data?.comments || "No comments provided"}
          </div>
        </div>

        <hr />

        {/* ===== Service Feedback ===== */}
        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <span className="fw-semibold">Service Feedback</span>
            <StarRating rating={service_feedback_data?.rating} />
          </div>
          <div className="small text-muted">
            {service_feedback_data?.comments || "No comments provided"}
          </div>
        </div>

        <hr />

        {/* ===== Technician Feedback ===== */}
        <div>
          <div className="d-flex justify-content-between align-items-center mb-1">
            <div className="d-flex align-items-center gap-2 fw-semibold">
              <Wrench size={16} />
              Technician Feedback
            </div>

            {!technician_feedback_data?.is_technician_assigned ? (
              <CBadge color="warning" shape="rounded-pill">
                Not Assigned
              </CBadge>
            ) : (
              <StarRating rating={technician_feedback_data?.rating} />
            )}
          </div>

          <div className="small text-muted">
            {technician_feedback_data?.comments || "No comments provided"}
          </div>
        </div>
      </CCardBody>
    </CCard>
  );
};

export default FeedbackCard;
