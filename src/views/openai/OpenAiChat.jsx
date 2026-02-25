// import React, { useState, useRef, useEffect } from "react";
// import { CFormInput } from "@coreui/react";
// import { Send, Square, Plus } from "lucide-react";
// import { CInputGroup, CInputGroupText } from "@coreui/react";
// import { useSelector } from "react-redux";
// import toast from "react-hot-toast";
// import axios from "axios";
// import MessageRenderer from "./MessageRenderer";

// const OpenAiChat = () => {
//   const authtoken = useSelector((state) => state.authtoken);

//   const [messages, setMessages] = useState([]);
//   const [question, setQuestion] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [chats, setChats] = useState([]);
//   const [activeChatId, setActiveChatId] = useState(null);

//   const abortControllerRef = useRef(null);
//   const chatEndRef = useRef(null);

//   /* ===============================
//      FETCH ALL CHATS (SIDEBAR)
//   ================================== */
//   const fetchChats = async () => {
//     try {
//       const res = await axios.get("/api/v1/openai/chats", {
//         headers: { Authorization: `Bearer ${authtoken}` },
//       });

//       const data = res.data;
//       setChats(data.data || []);
//     } catch (err) {
//       toast.error("Failed to load chats");
//     }
//   };

//   /* ===============================
//      FETCH CHAT BY ID
//   ================================== */
//   const loadChat = async (chatId) => {
//     try {
//       const res = await axios.get(`/api/v1/openai/${chatId}`, {
//         headers: { Authorization: `Bearer ${authtoken}` },
//       });

//       const data = res.data;
//       setMessages(data.data.messages || []);
//       setActiveChatId(chatId);
//     } catch (err) {
//       toast.error("Failed to load chat");
//     }
//   };

//   /* ===============================
//      NEW CHAT
//   ================================== */
//   const newChat = () => {
//     setMessages([]);
//     setActiveChatId(null);
//   };

//   /* ===============================
//      SEND MESSAGE (STREAM)
//   ================================== */
//   const runQuery = async () => {
//     if (!question.trim()) return;

//     const userMessage = { role: "user", content: question };
//     setMessages((prev) => [...prev, userMessage]);

//     setLoading(true);
//     setQuestion("");

//     setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

//     const controller = new AbortController();
//     abortControllerRef.current = controller;

//     try {
//       const response = await fetch("/api/v1/openai/explain", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${authtoken}`,
//         },
//         body: JSON.stringify({
//           question,
//           chatId: activeChatId, // 🔥 dynamic
//         }),
//         signal: controller.signal,
//       });

//       const reader = response.body.getReader();
//       const decoder = new TextDecoder("utf-8");

//       let done = false;

//       while (!done) {
//         const { value, done: doneReading } = await reader.read();
//         done = doneReading;

//         const chunk = decoder.decode(value);

//         setMessages((prev) => {
//           const updated = [...prev];
//           updated[updated.length - 1].content += chunk;
//           return updated;
//         });
//       }

//       // After stream finished → refresh sidebar
//       fetchChats();
//     } catch (err) {
//       if (err.name === "AbortError") {
//         toast.error("Request aborted");
//       } else {
//         toast.error("Streaming failed");
//       }
//     } finally {
//       setLoading(false);
//       abortControllerRef.current = null;
//     }
//   };

//   const stopQuery = () => {
//     abortControllerRef.current?.abort();
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchChats();
//   }, []);

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   return (
//     <div style={{ display: "flex", height: "80vh" }}>
//       {/* ================= SIDEBAR ================= */}
//       <div
//         style={{
//           width: 260,
//           borderRight: "1px solid #2d3748",
//           background: "#0f172a",
//           padding: 10,
//           overflowY: "auto",
//         }}
//       >
//         <button
//           onClick={newChat}
//           style={{
//             width: "100%",
//             marginBottom: 10,
//             background: "#1e293b",
//             color: "white",
//             border: "none",
//             padding: 8,
//             borderRadius: 6,
//           }}
//         >
//           <Plus size={14} /> New Chat
//         </button>

//         {chats.map((chat) => (
//           <div
//             key={chat._id}
//             onClick={() => loadChat(chat._id)}
//             style={{
//               padding: 8,
//               cursor: "pointer",
//               background: activeChatId === chat._id ? "#1e293b" : "transparent",
//               borderRadius: 6,
//               marginBottom: 6,
//               color: "#cbd5e1",
//             }}
//           >
//             {chat.title}
//           </div>
//         ))}
//       </div>

//       {/* ================= CHAT AREA ================= */}
//       <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
//         {/* CHAT BODY */}
//         <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
//           {messages.map((msg, i) => (
//             <div
//               key={i}
//               style={{
//                 display: "flex",
//                 justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
//                 marginBottom: 14,
//               }}
//             >
//               <div
//                 style={{
//                   background: msg.role === "user" ? "#3b82f6" : "#1e293b",
//                   color: "#fff",
//                   padding: msg.role === "user" ? "10px 15px" : 10,
//                   borderRadius: 14,
//                   maxWidth: "75%",
//                 }}
//               >
//                 <MessageRenderer msg={msg} />
//               </div>
//             </div>
//           ))}
//           {loading && <div className="text-muted small">AI is typing...</div>}
//           <div ref={chatEndRef} />
//         </div>

//         {/* FOOTER */}
//         <div className="px-4 py-3 border-top bg-dark">
//           <CInputGroup>
//             <CFormInput
//               value={question}
//               onChange={(e) => setQuestion(e.target.value)}
//               className="bg-dark text-light border-secondary"
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") runQuery();
//               }}
//             />

//             <CInputGroupText
//               onClick={loading ? stopQuery : runQuery}
//               style={{ cursor: "pointer" }}
//               className={
//                 loading ? "bg-danger text-white" : "bg-primary text-white"
//               }
//             >
//               {loading ? <Square size={16} /> : <Send size={16} />}
//             </CInputGroupText>
//           </CInputGroup>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OpenAiChat;

import React, { useState } from "react";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";

const OpenAiChat = () => {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);

  return (
    <div style={{ display: "flex", height: "80vh" }}>
      <ChatSidebar
        chats={chats}
        setChats={setChats}
        activeChatId={activeChatId}
        setActiveChatId={setActiveChatId}
      />

      <ChatWindow
        activeChatId={activeChatId}
        setChats={setChats}
        setActiveChatId={setActiveChatId}
      />
    </div>
  );
};

export default OpenAiChat;
