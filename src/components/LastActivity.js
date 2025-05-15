import React from "react";
import { CCard, CCardHeader, CCardBody } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilSpeech } from "@coreui/icons";
import { formatDistanceToNow } from "date-fns";

const LastActivity = ({ lastactivity }) => {
  if (!lastactivity || !Array.isArray(lastactivity)) {
    return (
      <CCard className="mx-auto shadow rounded">
        <CCardHeader className="bg-light d-flex align-items-center justify-content-between">
          <div>
            <CIcon icon={cilSpeech} className="me-2 text-primary" />
            <strong>Last Activity</strong>
          </div>
        </CCardHeader>
        <CCardBody className="overflow-auto" style={{ maxHeight: "400px" }}>
          <p className="text-center text-muted">No recent activity</p>
        </CCardBody>
      </CCard>
    );
  }

  return (
    <CCard className="w-full mx-auto shadow rounded">
      <CCardHeader className=" d-flex align-items-center justify-content-between">
        <div>
          <CIcon icon={cilSpeech} className="me-2 text-primary" />
          <strong>Last Activity</strong>
        </div>
      </CCardHeader>
      <CCardBody
        className="overflow-auto"
        style={{ maxHeight: "400px", maxWidth: "100%" }}
      >
        {lastactivity.length > 0 ? (
          lastactivity
            .slice()
            .reverse()
            .map((activity, index) => (
              <div
                key={index}
                className="d-flex align-items-center border-bottom pb-3 mb-3"
              >
                <img
                  src={activity.profile_image}
                  alt="Profile"
                  className="rounded-circle"
                  width="50"
                  height="50"
                  style={{ objectFit: "cover", cursor: "pointer" }}
                />
                <div className="flex-grow-1 mx-2">
                  <p className="mb-1 fw-semibold d-flex justify-content-between">
                    <span className="fw-semibold">{activity.name}</span>
                    <span className="text-muted small">
                      {activity.timestamp
                        ? formatDistanceToNow(new Date(activity.timestamp), {
                            addSuffix: true,
                          })
                        : "NA"}
                    </span>
                  </p>

                  <p
                    className=" maxw-75 mw-75"
                    style={{
                      fontSize: "14px",
                      lineHeight: "1.5",
                      textAlign: "start",
                    }}
                    dangerouslySetInnerHTML={{
                      __html: activity.details.replace(/, /g, ",<br>"),
                    }}
                  ></p>
                </div>
              </div>
            ))
        ) : (
          <p className="text-center text-muted">No recent activity</p>
        )}
      </CCardBody>
    </CCard>
  );
};

export default LastActivity;
