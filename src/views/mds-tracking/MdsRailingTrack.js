const MdsRailingTrack = ({ totalRows, activeRow }) => {
  const ROW_HEIGHT = 60; // updated to match actual row height + margin

  return (
    <div>
      <div
        className="d-flex flex-column justify-content-center align-items-center me-4 border"
        style={{
          height: `${totalRows * ROW_HEIGHT}px`,
          width: "15px",
          background: "transparent",
          borderRadius: "1px",
          position: "relative",
        }}
      ></div>
    </div>
  );
};

export default MdsRailingTrack;
