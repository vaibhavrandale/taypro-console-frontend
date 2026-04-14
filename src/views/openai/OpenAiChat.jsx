import React, { useState } from "react";
import { SquarePen, X } from "lucide-react";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";
import "./openai.css";

const OpenAiChat = () => {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="gpt-root">
      {/* ── Mobile backdrop ───────────────────── */}
      <div
        className={`gpt-backdrop${sidebarOpen ? " open" : ""}`}
        onClick={closeSidebar}
      />

      {/* ── Sidebar ───────────────────────────── */}
      <div className={`gpt-sidebar${sidebarOpen ? " open" : ""}`}>
        <ChatSidebar
          chats={chats}
          setChats={setChats}
          activeChatId={activeChatId}
          setActiveChatId={setActiveChatId}
          onClose={closeSidebar}
        />
      </div>

      {/* ── Chat area ─────────────────────────── */}
      <ChatWindow
        activeChatId={activeChatId}
        setChats={setChats}
        setActiveChatId={setActiveChatId}
        onToggleSidebar={() => setSidebarOpen((p) => !p)}
        sidebarOpen={sidebarOpen}
      />
    </div>
  );
};

export default OpenAiChat;
