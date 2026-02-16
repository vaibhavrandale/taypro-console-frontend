import React from "react";

import SiteTodayOverview from "./cases/SiteTodayOverview";
import RobotFaultyAnalysis from "./cases/RobotFaultyAnalysis";

// import other components as you build them

const MessageRenderer = ({ msg }) => {
  if (!msg) return null;

  if (msg.role === "user") {
    return (
      <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>{msg.content}</pre>
    );
  }

  // Assistant rendering
  if (!msg.caseType || !msg.rawData) {
    return (
      <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>{msg.content}</pre>
    );
  }

  switch (msg.caseType) {
    case "SITE_TODAY_CLEANING_SUMMARY":
      return <SiteTodayOverview data={msg.rawData} />;

    case "ROBOT_ANALYSIS":
      return <RobotFaultyAnalysis data={msg.rawData} />;

    // case "SITE_TODAY_CLEANING_SUMMARY":
    //   return (
    //     <div>
    //       <strong>Site:</strong> {msg.rawData.site_id}<br />
    //       <strong>Success:</strong> {msg.rawData.success_count}<br />
    //       <strong>Failure:</strong> {msg.rawData.failure_count}
    //     </div>
    //   );

    default:
      return (
        <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>{msg.content}</pre>
      );
  }
};

export default MessageRenderer;
