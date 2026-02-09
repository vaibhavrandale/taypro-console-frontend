import RatingBlock from "./RatingBlock";
import moment from "moment";

const FeedbackItemCard = ({ feedback }) => (
  <div className="col-12 col-lg-6">
    <div className="card h-100 shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h6 className="fw-bold mb-0">{feedback.user.username}</h6>
            <small className="text-muted">{feedback.user.email}</small>
          </div>
          <span
            className={`badge ${feedback.status ? "bg-success" : "bg-warning"}`}
          >
            {feedback.status ? "Completed" : "Pending"}
          </span>
        </div>

        <small className="text-muted">
          {moment(feedback.createdAt).format("DD MMM YYYY")}
        </small>

        <div className="row mt-3 g-2">
          <RatingBlock
            title="Portal"
            color="warning"
            data={feedback.feedback_data}
          />
          <RatingBlock
            title="Service"
            color="info"
            data={feedback.service_feedback_data}
          />
          {feedback.technician_feedback_data?.is_technician_assigned && (
            <RatingBlock
              title="Technician"
              color="success"
              data={feedback.technician_feedback_data}
            />
          )}
        </div>
      </div>
    </div>
  </div>
);

export default FeedbackItemCard;
