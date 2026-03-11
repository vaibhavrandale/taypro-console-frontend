import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";

const ChatSidebar = ({ chats, setChats, activeChatId, setActiveChatId }) => {
  const authtoken = useSelector((s) => s.authtoken);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fetchChats = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/v1/openai/chats", {
        headers: { Authorization: `Bearer ${authtoken}` },
      });
      setChats(res.data.data || []);
      setLoading(false);
    } catch (err) {
      setError(err.response.data.err || err.response.data.message);
      toast.error(err.response.data.err || err.response.data.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  const newChat = () => {
    setActiveChatId(null);
  };

  return (
    <div
      style={{
        width: 260,
        borderRight: "1px solid #2d3748",
        background: "#0f172a",
        padding: 10,
        overflowY: "auto",
      }}
    >
      <button
        onClick={newChat}
        style={{
          width: "100%",
          marginBottom: 10,
          background: "#1e293b",
          color: "white",
          border: "none",
          padding: 8,
          borderRadius: 6,
        }}
      >
        <Plus size={14} /> New Chat
      </button>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : chats.length > 0 ? (
        chats.map((chat) => (
          <div
            key={chat._id}
            onClick={() => setActiveChatId(chat._id)}
            style={{
              padding: 8,
              cursor: "pointer",
              background: activeChatId === chat._id ? "#1e293b" : "transparent",
              borderRadius: 6,
              marginBottom: 6,
              color: "#cbd5e1",
            }}
          >
            {chat.title}
          </div>
        ))
      ) : (
        <div
          style={{
            padding: 8,
            cursor: "pointer",
            background: "#cbd5e1",
            borderRadius: 6,
            marginBottom: 6,
            color: "#000",
          }}
        >
          No Chats Found
        </div>
      )}
    </div>
  );
};

export default ChatSidebar;
