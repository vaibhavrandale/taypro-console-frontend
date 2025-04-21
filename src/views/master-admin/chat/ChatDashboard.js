import React, { useState, useEffect, useRef } from "react";
import {
  CCard,
  CInputGroup,
  CFormInput,
  CButton,
  CAvatar,
  CListGroup,
  CListGroupItem,
  CRow,
  CCol,
} from "@coreui/react";
import "./chart.css";
import { chats } from "../../../data"; // Assume this is where your provided chat data is imported from
import LoadingSpinner from "../../../components/LoadingSpinner";
import CIcon from "@coreui/icons-react";
import { cilSend } from "@coreui/icons";

export default function ChatDashboard() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null); // Ref to scroll to the bottom of the chat

  const renderLastMessage = (chatArray) => {
    const lastMsg = chatArray[chatArray.length - 1];
    return lastMsg ? lastMsg.message : "No messages yet";
  };

  const formatTimeinUserlist = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleSelectChat = (chat) => {
    setLoading(true);
    setTimeout(() => {
      setSelectedChat(chat);
      setLoading(false);
    }, 500); // simulate async load
  };

  // Scroll to the bottom when the chat is loaded
  useEffect(() => {
    if (selectedChat) {
      // Scroll to the bottom when the chat is selected
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChat]);

  return (
    <div className="border  w-100 h-100">
      <CRow className="h-100">
        <CCol md={4} className="border-end p-3 overflow-auto">
          <h5 className="mb-3 p-2 border-bottom">Chats</h5>
          <div style={{ maxHeight: "360px" }}>
            {chats
              .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)) // Sort chats by updatedAt (latest first)
              .map((chat) => (
                <div
                  key={chat._id}
                  id="chat"
                  className={` p-2 d-flex align-items-center gap-3 cursor-pointer ${
                    selectedChat?._id === chat._id
                      ? "bg-body-secondary rounded text-body-emphasis"
                      : ""
                  }`}
                  onClick={() => handleSelectChat(chat)}
                  style={{ cursor: "pointer" }}
                >
                  <CAvatar src={chat.send_user.profile_image} />
                  <div className="flex-grow-1">
                    <div className="fw-semibold text-truncate">
                      {chat.send_user.name}
                    </div>
                    <div className="text-truncate small">
                      {renderLastMessage(chat.chat)}
                    </div>
                  </div>
                  <small className="text-nowrap">
                    {formatTimeinUserlist(chat.updatedAt)}
                  </small>
                </div>
              ))}
          </div>
        </CCol>

        <CCol md={8} className="d-flex flex-column">
          {loading ? (
            <div className="flex-grow-1 d-flex align-items-center justify-content-center">
              <LoadingSpinner />
            </div>
          ) : selectedChat ? (
            <>
              <div className="border-bottom p-3 fw-semibold">
                <CAvatar src={selectedChat.receiver_user.profile_image} />
                &nbsp; &nbsp;
                {selectedChat.send_user.name}
              </div>
              <div
                className="flex-grow-1 overflow-auto p-3"
                style={{ maxHeight: "360px" }}
              >
                {selectedChat.chat
                  .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)) // Sort messages by timestamp (oldest first)
                  .map((msg, idx) => (
                    <div
                      key={idx}
                      className={`d-flex mb-2 ${
                        msg.send_by.email === selectedChat.send_user.email
                          ? "justify-content-start align-items-start"
                          : "justify-content-end align-items-start"
                      }`}
                    >
                      {/* <CAvatar src={msg.send_by.profile_image} /> */}
                      &nbsp;&nbsp;
                      <div
                        className="p-2 border"
                        style={{
                          maxWidth: "55%",
                          backgroundColor:
                            msg.send_by.email === selectedChat.send_user.email
                              ? "var(--cui-body-bg)"
                              : "var(--cui-primary-bg-subtle)",
                          color:
                            msg.send_by.email === selectedChat.send_user.email
                              ? "var(--cui-body-color)"
                              : "var(--cui-primary-color)",
                        }}
                      >
                        <div>{msg.message}</div>
                        <small className="text-muted d-block text-end">
                          {formatTime(msg.timestamp)}
                        </small>
                      </div>
                    </div>
                  ))}
                <div ref={messagesEndRef} />{" "}
                {/* This will be used to scroll to the bottom */}
              </div>
              <div className="border-top p-3">
                <CInputGroup>
                  <CFormInput placeholder="Type a message..." />
                  <CButton color="success">
                    <CIcon icon={cilSend}></CIcon>
                  </CButton>
                </CInputGroup>
              </div>
            </>
          ) : (
            <div className="flex-grow-1 d-flex align-items-center justify-content-center text-muted">
              Select a chat to start messaging
            </div>
          )}
        </CCol>
      </CRow>
    </div>
  );
}
