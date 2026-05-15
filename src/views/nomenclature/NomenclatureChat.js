import React, { useEffect, useRef, useState, useCallback } from "react";

import axios from "axios";

import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CFormTextarea,
  CSpinner,
} from "@coreui/react";

import CIcon from "@coreui/icons-react";

import { cilSend, cilPaperclip, cilImage, cilReload } from "@coreui/icons";
import { Link } from "react-router-dom";
import fileImage from "../../assets/images/file.jpg";

const NomenclatureChat = ({ nomenclatureId, currentUser }) => {
  const [message, setMessage] = useState("");

  const [attachment, setAttachment] = useState(null);

  const [loading, setLoading] = useState(false);

  const [fetching, setFetching] = useState(false);

  const [chats, setChats] = useState([]);

  const bottomRef = useRef();

  /**
   * FETCH CHAT
   */

  const fetchChats = useCallback(async () => {
    try {
      setFetching(true);

      const { data } = await axios.get(
        `/api/v1/nomenclatures/chats/${nomenclatureId}`,
        {
          withCredentials: true,
        },
      );

      setChats(data?.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setFetching(false);
    }
  }, [nomenclatureId]);

  /**
   * INITIAL FETCH
   */

  useEffect(() => {
    if (nomenclatureId) {
      fetchChats();
    }
  }, [nomenclatureId, fetchChats]);

  /**
   * AUTO SCROLL
   */

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [chats]);

  /**
   * SEND MESSAGE
   */

  const sendMessage = async () => {
    if (!message.trim() && !attachment) return;

    try {
      setLoading(true);

      let uploadedFile = "";

      /**
       * FILE UPLOAD
       */

      if (attachment) {
        const formData = new FormData();

        formData.append("file", attachment);

        const uploadResponse = await axios.post(
          "/api/v1/image-upload/nomenclature-chats",
          formData,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        uploadedFile = uploadResponse?.data.url || "";
      }

      /**
       * SEND CHAT
       */

      await axios.post(
        `/api/v1/nomenclatures/${nomenclatureId}/chat`,
        {
          message: message.trim(),
          attachment: uploadedFile,
        },
        {
          withCredentials: true,
        },
      );

      /**
       * RESET
       */

      setMessage("");
      setAttachment(null);

      /**
       * REFETCH CHAT
       */

      await fetchChats();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * ENTER SEND
   */

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <CCard
      className="my-2"
      style={{
        width: "100%",
        height: "550px",
        background: "#0a1628",
        border: "1px solid #1e3a5f",
        borderRadius: "16px",
      }}
    >
      {/* HEADER */}

      <CCardHeader
        style={{
          padding: "6px",
          display: "flex",

          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div></div>

        <CButton className="bp" onClick={fetchChats} disabled={loading}>
          <CIcon icon={cilReload} size="sm" style={{ marginRight: 4 }} />
          Refresh
        </CButton>
      </CCardHeader>

      {/* BODY */}

      <CCardBody
        style={{
          display: "flex",
          flexDirection: "column",
          height: "450px",
          padding: 0,
        }}
      >
        {/* CHAT LIST */}

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px",
            background: "#060f1e",
          }}
        >
          {fetching ? (
            <div className="d-flex justify-content-center align-items-center h-100">
              <CSpinner />
            </div>
          ) : chats?.length === 0 ? (
            <div
              style={{
                color: "#64748b",
                textAlign: "center",
                marginTop: "100px",
              }}
            >
              No chats available
            </div>
          ) : (
            chats.map((chat, index) => {
              const isMine = chat?.sender?.email === currentUser?.email;

              return (
                <div
                  key={index}
                  style={{
                    display: "flex",

                    justifyContent: isMine ? "flex-end" : "flex-start",

                    marginBottom: "18px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",

                      flexDirection: isMine ? "row-reverse" : "row",

                      alignItems: "flex-start",

                      gap: 10,

                      maxWidth: "75%",
                    }}
                  >
                    {/* AVATAR */}

                    <img
                      alt={currentUser?.email || "User Avatar"}
                      src={
                        chat?.sender?.profile_image ||
                        "https://ui-avatars.com/api/?name=User"
                      }
                      style={{
                        border: "1px solid #1e3a5f",

                        height: 36,
                        width: 36,

                        borderRadius: "50%",

                        objectFit: "cover",
                      }}
                    />

                    {/* MESSAGE */}

                    <div>
                      <div
                        style={{
                          color: "#94a3b8",

                          fontSize: "0.72rem",

                          marginBottom: 4,

                          textAlign: isMine ? "right" : "left",
                        }}
                      >
                        {chat?.sender?.name || "Unknown User"}
                      </div>

                      <div
                        style={{
                          // background: isMine ? "#2563eb" : "#0d1f3c",

                          border: isMine
                            ? "1px solid #2563eb"
                            : "1px solid #1e3a5f",

                          padding: "12px 14px",

                          borderRadius: "14px",

                          color: "#fff",

                          wordBreak: "break-word",
                        }}
                      >
                        {chat?.message && <div>{chat.message}</div>}

                        {chat?.attachment && (
                          <div
                            style={{
                              marginTop: 10,
                            }}
                          >
                            <Link
                              to={chat.attachment}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <img
                                src={fileImage}
                                alt="attachment"
                                style={{
                                  width: "100px",

                                  maxWidth: "100%",

                                  borderRadius: "10px",
                                }}
                              />
                            </Link>
                          </div>
                        )}

                        <div
                          style={{
                            marginTop: 8,

                            fontSize: "0.68rem",

                            opacity: 0.7,

                            textAlign: "right",
                          }}
                        >
                          {new Date(chat?.timestamp).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                              hour12: true,
                            },
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          <div ref={bottomRef} />
        </div>

        {/* INPUT */}

        <div
          style={{
            borderTop: "1px solid #1e3a5f",

            background: "#0a1628",

            padding: "14px",
          }}
        >
          {attachment && (
            <div
              style={{
                marginBottom: 12,

                display: "flex",

                alignItems: "center",

                gap: 8,

                color: "#94a3b8",

                fontSize: "0.82rem",
              }}
            >
              <CIcon icon={cilImage} />
              {attachment.name}
            </div>
          )}

          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems: "flex-end",
            }}
          >
            <div style={{ flex: 1 }}>
              <CFormTextarea
                rows={2}
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{
                  background: "#060f1e",

                  border: "1px solid #1e3a5f",

                  color: "#fff",

                  resize: "none",
                }}
              />
            </div>

            {/* FILE */}

            <label
              style={{
                width: 32,
                height: 32,

                borderRadius: 10,

                background: "#0d1f3c",

                border: "1px solid #1e3a5f",

                display: "flex",

                alignItems: "center",

                justifyContent: "center",

                cursor: "pointer",

                flexShrink: 0,
              }}
            >
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => setAttachment(e.target.files[0])}
              />

              <CIcon
                icon={cilPaperclip}
                style={{
                  color: "#94a3b8",
                }}
              />
            </label>

            {/* SEND */}

            <CButton
              onClick={sendMessage}
              disabled={loading}
              style={{
                borderRadius: 12,

                background: "linear-gradient(135deg,#2563eb,#1d4ed8)",

                border: "none",
              }}
            >
              <span
                className="d-flex align-items-center justify-content-center"
                style={{
                  width: 20,
                  height: 20,
                }}
              >
                {loading ? <CSpinner size="sm" /> : <CIcon icon={cilSend} />}
              </span>
            </CButton>
          </div>
        </div>
      </CCardBody>
    </CCard>
  );
};

export default NomenclatureChat;
