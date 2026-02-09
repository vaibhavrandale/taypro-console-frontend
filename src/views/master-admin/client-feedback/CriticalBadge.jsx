const CriticalBadge = ({ count }) => {
  if (!count) return null;

  const cls =
    count >= 5 ? "bg-danger text-white shadow" : "bg-warning text-dark";

  return (
    <span className={`px-2 py-1 rounded fw-semibold ${cls}`}>
      🚨 {count} Critical
    </span>
  );
};

export default CriticalBadge;
