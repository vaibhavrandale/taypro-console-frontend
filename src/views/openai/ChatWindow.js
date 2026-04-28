import React, { useEffect, useReducer, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Send, Square, Volume2, VolumeX, Menu, X, Bot } from "lucide-react";
import MessageRenderer from "./MessageRenderer";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useTextToSpeech } from "./useTextToSpeech";
import "./openai.css";

/* ─────────────────────────────────────────────────
   STATE
───────────────────────────────────────────────── */
const initialState = {
  messages: [],
  question: "",
  loadingChat: false,
  sending: false,
  error: null,
  translatingMessageId: null,
};

function chatReducer(state, action) {
  switch (action.type) {
    case "LOAD_CHAT_START":
      return { ...state, loadingChat: true, error: null };
    case "LOAD_CHAT_SUCCESS":
      return { ...state, loadingChat: false, messages: action.payload };
    case "LOAD_CHAT_ERROR":
      return { ...state, loadingChat: false, error: action.payload };
    case "SEND_START":
      return { ...state, sending: true, error: null };
    case "SEND_SUCCESS":
      return { ...state, sending: false };
    case "SEND_ERROR":
      return { ...state, sending: false, error: action.payload };
    case "ADD_MESSAGE":
      return { ...state, messages: [...state.messages, action.payload] };
    case "UPDATE_MESSAGE":
      return {
        ...state,
        messages: state.messages.map((msg) =>
          msg.id === action.id
            ? { ...msg, content: msg.content + action.chunk }
            : msg,
        ),
      };
    case "SET_QUESTION":
      return { ...state, question: action.payload };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    case "TRANSLATE_START":
      return { ...state, translatingMessageId: action.payload };
    case "TRANSLATE_END":
      return { ...state, translatingMessageId: null };
    default:
      return state;
  }
}

/* ─────────────────────────────────────────────────
   EXAMPLE PROMPTS (welcome screen chips)
───────────────────────────────────────────────── */
const EXAMPLE_PROMPTS = [
  "Show robot status summary",
  "Which sites have low uptime?",
  "List pending service tickets",
  "Robots with battery issues",
];

/* ─────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────── */
const ChatWindow = ({
  activeChatId,
  setChats,
  setActiveChatId,
  onToggleSidebar,
  sidebarOpen,
}) => {
  const authtoken = useSelector((s) => s.authtoken);
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { speak, stop } = useTextToSpeech();

  const abortRef = useRef(null);
  const bottomRef = useRef(null);
  const activeChatIdRef = useRef(activeChatId);
  const textareaRef = useRef(null);

  /* sync ref */
  useEffect(() => {
    activeChatIdRef.current = activeChatId;
  }, [activeChatId]);

  /* auto-grow textarea */
  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height =
      Math.min(textareaRef.current.scrollHeight, 200) + "px";
  }, [state.question]);

  /* auto-scroll */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [state.messages]);

  /* ── Load chat ───────────────────────────────── */
  useEffect(() => {
    if (!activeChatId) {
      dispatch({ type: "LOAD_CHAT_SUCCESS", payload: [] });
      return;
    }
    const load = async () => {
      dispatch({ type: "LOAD_CHAT_START" });
      try {
        const res = await axios.get(`/api/v1/openai/${activeChatId}`, {
          // headers: { Authorization: `Bearer ${authtoken}` },
          withCredentials: true,
        });
        const msgs =
          res.data?.data?.messages?.map((m, i) => ({
            ...m,
            id: m._id || `${m.role}-${i}-${Date.now()}`,
          })) || [];
        dispatch({ type: "LOAD_CHAT_SUCCESS", payload: msgs });
      } catch {
        dispatch({
          type: "LOAD_CHAT_ERROR",
          payload: "Failed to load chat history.",
        });
      }
    };
    load();
  }, [activeChatId]);

  /* ── Translate ───────────────────────────────── */
  const translateToHindi = async (text, messageId) => {
    dispatch({ type: "TRANSLATE_START", payload: messageId });
    try {
      const res = await axios.post(
        "/api/v1/openai/translate",
        { text },
        { headers: { Authorization: `Bearer ${authtoken}` } },
      );
      return res.data?.translated || text;
    } catch {
      dispatch({ type: "SEND_ERROR", payload: "Translation failed." });
      return text;
    } finally {
      dispatch({ type: "TRANSLATE_END" });
    }
  };

  /* ── Send message ────────────────────────────── */
  const sendMessage = async (text) => {
    const question = (text ?? state.question).trim();
    if (!question || state.sending) return;

    const uid = `user-${Date.now()}`;
    const aid = `assistant-${Date.now()}`;

    dispatch({
      type: "ADD_MESSAGE",
      payload: { id: uid, role: "user", content: question },
    });
    dispatch({
      type: "ADD_MESSAGE",
      payload: { id: aid, role: "assistant", content: "" },
    });
    dispatch({ type: "SET_QUESTION", payload: "" });
    dispatch({ type: "SEND_START" });

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch("/api/v1/openai/explain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authtoken}`,
        },
        body: JSON.stringify({ question, chatId: activeChatIdRef.current }),
        signal: controller.signal,
      });

      if (!response.ok) throw new Error("Server error");

      const newChatId = response.headers.get("x-chat-id");
      if (!activeChatIdRef.current && newChatId) {
        activeChatIdRef.current = newChatId;
        setActiveChatId(newChatId);
        setChats((prev) => [
          { _id: newChatId, title: question.slice(0, 40) },
          ...prev,
        ]);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;
      while (!done) {
        const { value, done: d } = await reader.read();
        done = d;
        if (value) {
          dispatch({
            type: "UPDATE_MESSAGE",
            id: aid,
            chunk: decoder.decode(value),
          });
        }
      }
      dispatch({ type: "SEND_SUCCESS" });
    } catch (err) {
      if (err.name !== "AbortError") {
        dispatch({ type: "SEND_ERROR", payload: "AI response failed." });
      }
    } finally {
      abortRef.current = null;
      dispatch({ type: "SEND_SUCCESS" });
    }
  };

  const stopStreaming = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    stop();
    dispatch({ type: "SEND_SUCCESS" });
  };

  const visibleMessages = state.messages.filter(
    (m) => m.role === "user" || m.content?.trim() !== "",
  );

  /* ═══════════════════ RENDER ════════════════════ */
  return (
    <div className="gpt-main">
      {/* ── Top header bar ──────────────────────── */}
      <div className="gpt-header">
        <button
          className="gpt-hamburger"
          onClick={onToggleSidebar}
          title="Toggle sidebar"
        >
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        <span className="gpt-header-title">Console AI</span>

        <span className="gpt-header-subtitle">
          {activeChatId ? "Chat session" : "New conversation"}
        </span>
      </div>

      {/* ── Error banner ────────────────────────── */}
      {state.error && (
        <div className="gpt-error">
          <span>{state.error}</span>
          <button onClick={() => dispatch({ type: "CLEAR_ERROR" })}>✕</button>
        </div>
      )}

      {/* ── Messages area ───────────────────────── */}
      <div className="gpt-messages">
        {state.loadingChat ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              paddingTop: 60,
            }}
          >
            <LoadingSpinner />
          </div>
        ) : visibleMessages.length === 0 ? (
          /* ── Welcome / empty state ─────────────── */
          <div className="gpt-welcome">
            <div className="gpt-welcome-logo">
              <Bot size={26} color="#fff" />
            </div>
            <h2>How can I help you?</h2>
            <p>
              Ask me anything about your robots, sites, telemetry data, service
              tickets, or operational reports.
            </p>
            <div className="gpt-welcome-chips">
              {EXAMPLE_PROMPTS.map((p) => (
                <button
                  key={p}
                  className="gpt-chip"
                  onClick={() => sendMessage(p)}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* ── Message list ─────────────────────── */
          <>
            {visibleMessages.map((msg) => (
              <div key={msg.id} className={`gpt-msg-wrap ${msg.role}`}>
                <div className="gpt-msg-inner">
                  {/* Avatar */}
                  <div className={`gpt-avatar ${msg.role}`}>
                    {msg.role === "assistant" ? (
                      <Bot size={15} color="#fff" />
                    ) : (
                      "U"
                    )}
                  </div>

                  {/* Bubble / content */}
                  {msg.role === "user" ? (
                    <div className="gpt-user-bubble">{msg.content}</div>
                  ) : (
                    <div className="gpt-assistant-content">
                      {msg.content?.trim() && <MessageRenderer msg={msg} />}

                      {/* Action bar — appears on hover */}
                      {msg.content && (
                        <div className="gpt-msg-actions">
                          {/* English TTS */}
                          <button
                            className="gpt-action-btn"
                            title="Read in English"
                            onClick={() => speak(msg.content)}
                          >
                            <Volume2 size={12} /> EN
                          </button>

                          {/* Hindi TTS */}
                          <button
                            className="gpt-action-btn hindi"
                            title="Read in Hindi"
                            disabled={state.translatingMessageId === msg.id}
                            onClick={async () => {
                              const hindi = await translateToHindi(
                                msg.content,
                                msg.id,
                              );
                              speak(hindi);
                            }}
                          >
                            {state.translatingMessageId === msg.id ? (
                              <LoadingSpinner small />
                            ) : (
                              <Volume2 size={12} />
                            )}
                            HI
                          </button>

                          {/* Stop audio */}
                          <button
                            className="gpt-action-btn mute"
                            title="Stop audio"
                            onClick={stop}
                          >
                            <VolumeX size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {state.sending && (
              <div className="gpt-msg-wrap assistant">
                <div className="gpt-msg-inner">
                  <div className="gpt-avatar assistant">
                    <Bot size={15} color="#fff" />
                  </div>
                  <div className="gpt-assistant-content">
                    <div className="gpt-typing">
                      <div className="gpt-dot" />
                      <div className="gpt-dot" />
                      <div className="gpt-dot" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Input area ──────────────────────────── */}
      <div className="gpt-input-area">
        <div className="gpt-input-box">
          <textarea
            ref={textareaRef}
            className="gpt-textarea"
            rows={1}
            value={state.question}
            disabled={state.sending}
            placeholder="Message Console AI…"
            onChange={(e) =>
              dispatch({ type: "SET_QUESTION", payload: e.target.value })
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />

          <button
            className={`gpt-send-btn ${state.sending ? "stop" : "send"}`}
            onClick={state.sending ? stopStreaming : sendMessage}
            disabled={!state.sending && !state.question.trim()}
            title={state.sending ? "Stop generating" : "Send message"}
          >
            {state.sending ? <Square size={15} /> : <Send size={15} />}
          </button>
        </div>

        <p className="gpt-input-hint">
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};

export default ChatWindow;
