import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Plus } from "lucide-react";

const ChatSidebar = ({ chats, setChats, activeChatId, setActiveChatId }) => {
  const authtoken = useSelector((s) => s.authtoken);

  const fetchChats = async () => {
    try {
      const res = await axios.get("/api/v1/openai/chats", {
        headers: { Authorization: `Bearer ${authtoken}` },
      });
      setChats(res.data.data || []);
    } catch (err) {
      console.error("Failed to load chats");
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

      {chats.map((chat) => (
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
      ))}
    </div>
  );
};

export default ChatSidebar;
