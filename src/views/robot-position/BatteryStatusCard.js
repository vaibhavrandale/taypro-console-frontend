import React from "react";

const BatteryStatusCard = ({ cleaning }) => {
  return (
    <>
      {cleaning.battery_health_status && (
        <div className="border-0 card">
          <div className="m-1">Battery Status</div>
          <div>
            <div className="alert alert-warning m-2 p-1 ">
              {/* Battery Status Row */}
              <div className="d-flex align-items-start">
                <small>{cleaning.battery_health_status}</small>
              </div>
              {/* Last Update Row */}
              <div className="d-flex align-items-center">
                <small className="">Battery Last Update:</small>
                <small className="text-dark ms-2">
                  {new Date(
                    cleaning.battery_health_status_updated_at
                  ).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </small>
              </div>{" "}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BatteryStatusCard;
