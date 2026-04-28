import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Plus, MessageSquare, X } from "lucide-react";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";
import "./openai.css";

const ChatSidebar = ({
  chats,
  setChats,
  activeChatId,
  setActiveChatId,
  onClose,
}) => {
  const authtoken = useSelector((s) => s.authtoken);
  const [loading, setLoading] = useState(false);

  const fetchChats = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/v1/openai/chats", {
        // headers: { Authorization: `Bearer ${authtoken}` },
        withCredentials: true,
      });
      setChats(res.data.data || []);
    } catch (err) {
      toast.error(
        err.response?.data?.err ||
          err.response?.data?.message ||
          "Failed to load chats",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNewChat = () => {
    setActiveChatId(null);
    onClose?.();
  };

  const handleSelectChat = (id) => {
    setActiveChatId(id);
    onClose?.();
  };

  return (
    <>
      {/* ── Sidebar header ────────────────────── */}
      <div className="gpt-sidebar-header">
        <span className="gpt-sidebar-title">Console AI</span>
        {/* Close button — visible on mobile */}
        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: "none",
            color: "#555",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            padding: "2px 4px",
            borderRadius: 6,
          }}
          title="Close sidebar"
        >
          <X size={16} />
        </button>
      </div>

      {/* ── New chat button ───────────────────── */}
      <div style={{ padding: "8px 10px 0" }}>
        <button className="gpt-new-btn" onClick={handleNewChat}>
          <Plus size={15} />
          New chat
        </button>
      </div>

      {/* ── Chat list ─────────────────────────── */}
      <div className="gpt-sidebar-list">
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              paddingTop: 20,
            }}
          >
            <LoadingSpinner />
          </div>
        ) : chats.length > 0 ? (
          chats.map((chat) => (
            <div
              key={chat._id}
              className={`gpt-chat-item${activeChatId === chat._id ? " active" : ""}`}
              onClick={() => handleSelectChat(chat._id)}
              title={chat.title}
            >
              <MessageSquare
                size={13}
                style={{
                  display: "inline",
                  marginRight: 7,
                  opacity: 0.5,
                  flexShrink: 0,
                }}
              />
              {chat.title}
            </div>
          ))
        ) : (
          <p className="gpt-sidebar-empty">
            No conversations yet. <br /> Start a new chat!
          </p>
        )}
      </div>
    </>
  );
};

export default ChatSidebar;
