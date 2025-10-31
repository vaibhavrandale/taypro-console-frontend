import React from "react";

const MdsRowTrack = ({ row }) => {
  return (
    <div className="">
      <div>
        <div
          className={`${
            row.cleaning.finish
              ? "cleaning-finished"
              : row.cleaning.start &&
                (row.cleaning.battery_dead || row.cleaning.cleaning_cancelled)
              ? "cleaning-cancelled"
              : row.cleaning.start
              ? "cleaning-in-progress"
              : "no-cleaning-today "
          }`}
          style={{
            position: "relative",
            margin: "0px",
            // top: "20px",
            height: "40px",
            borderRadius: "1px",
            width: `${row.row_length * 5}px`,
            backgroundImage: `
                repeating-linear-gradient(to right, #0d47a1, #0d47a1 10px, #fff 10px, #fff 12px),
                linear-gradient(to bottom, #0d47a1 0%, #0d47a1 48%, #79aaf4ff 48%, #659ef5ff 53%, #0d47a1 53%, #0d47a1 100%)
              `,
            backgroundBlendMode: "overlay",
          }}
        >
          {/* <span
            style={{
              position: "absolute",
              left: "-26px",
              top: "-6px",
              color: "#0277BD",
              fontWeight: "bold",
            }}
          >
            DS
          </span>
          <span
            style={{
              position: "absolute",
              right: "-23px",
              top: "-6px",
              color: "#0277BD",
              fontWeight: "bold",
            }}
          >
            RS
          </span> */}
        </div>
      </div>
    </div>
  );
};

export default MdsRowTrack;
