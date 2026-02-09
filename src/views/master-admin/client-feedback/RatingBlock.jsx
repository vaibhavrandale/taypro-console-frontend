const RatingBlock = ({ title, color, data }) => (
  <div className="col-md-4">
    <div className="border rounded p-2 h-100">
      <h6 className={`text-${color} mb-1`}>{title}</h6>
      <div className="fw-semibold">⭐ {data?.rating ?? "N/A"}</div>
      <p className="small text-muted mb-0">{data?.comments || "No comments"}</p>
    </div>
  </div>
);

export default RatingBlock;
