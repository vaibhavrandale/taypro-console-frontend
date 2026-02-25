import React from "react";
import ReactMarkdown from "react-markdown";
import "./openai.css";
const MessageRenderer = ({ msg }) => {
  if (!msg) return null;
  return (
    <div
      className={`ai-response ${msg.role === "assistant" ? "mt-3 p-2" : "p-1"}`}
    >
      <ReactMarkdown>{msg.content}</ReactMarkdown>
    </div>
  );
};

export default MessageRenderer;
