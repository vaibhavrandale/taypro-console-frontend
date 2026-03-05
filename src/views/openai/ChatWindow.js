import React, { useEffect, useReducer, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Send, Square, Volume2, VolumeX } from "lucide-react";
import MessageRenderer from "./MessageRenderer";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useTextToSpeech } from "./useTextToSpeech";

/* =====================================================
   STATE MANAGEMENT
===================================================== */

const initialState = {
  messages: [],
  question: "",
  loadingChat: false,
  sending: false,
  translating: false,
  error: null,
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

/* =====================================================
   COMPONENT
===================================================== */

const ChatWindow = ({ activeChatId, setChats, setActiveChatId }) => {
  const authtoken = useSelector((s) => s.authtoken);
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { speak, stop } = useTextToSpeech();

  const abortRef = useRef(null);
  const bottomRef = useRef(null);
  const activeChatIdRef = useRef(activeChatId);
  const textareaRef = useRef(null);
  useEffect(() => {
    activeChatIdRef.current = activeChatId;
  }, [activeChatId]);
  useEffect(() => {
    if (!textareaRef.current) return;

    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
  }, [state.question]);
  /* ================= LOAD CHAT ================= */

  useEffect(() => {
    if (!activeChatId) {
      dispatch({ type: "LOAD_CHAT_SUCCESS", payload: [] });
      return;
    }

    const loadChat = async () => {
      dispatch({ type: "LOAD_CHAT_START" });

      try {
        const res = await axios.get(`/api/v1/openai/${activeChatId}`, {
          headers: { Authorization: `Bearer ${authtoken}` },
        });

        const serverMessages =
          res.data?.data?.messages?.map((msg, index) => ({
            ...msg,
            id: msg._id || `${msg.role}-${index}-${Date.now()}`,
          })) || [];

        dispatch({ type: "LOAD_CHAT_SUCCESS", payload: serverMessages });
      } catch (err) {
        dispatch({
          type: "LOAD_CHAT_ERROR",
          payload: "Failed to load chat history.",
        });
      }
    };

    loadChat();
  }, [activeChatId, authtoken]);

  /* ================= TRANSLATE ================= */

  const translateToHindi = async (text, messageId) => {
    dispatch({ type: "TRANSLATE_START", payload: messageId });

    try {
      const res = await axios.post(
        "/api/v1/openai/translate",
        { text },
        {
          headers: { Authorization: `Bearer ${authtoken}` },
        },
      );

      return res.data?.translated || text;
    } catch (err) {
      dispatch({
        type: "SEND_ERROR",
        payload: "Translation failed.",
      });
      return text;
    } finally {
      dispatch({ type: "TRANSLATE_END" });
    }
  };

  /* ================= SEND MESSAGE ================= */

  const sendMessage = async () => {
    if (!state.question.trim() || state.sending) return;

    const userMessageId = `user-${Date.now()}`;
    const assistantMessageId = `assistant-${Date.now()}`;

    const userMessage = {
      id: userMessageId,
      role: "user",
      content: state.question,
      createdAt: new Date().toISOString(),
    };

    const assistantPlaceholder = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      createdAt: new Date().toISOString(),
    };

    dispatch({ type: "ADD_MESSAGE", payload: userMessage });
    dispatch({ type: "ADD_MESSAGE", payload: assistantPlaceholder });
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
        body: JSON.stringify({
          question: userMessage.content,
          chatId: activeChatIdRef.current,
        }),
        signal: controller.signal,
      });

      if (!response.ok) throw new Error("Server error");

      const newChatId = response.headers.get("x-chat-id");

      if (!activeChatIdRef.current && newChatId) {
        activeChatIdRef.current = newChatId;
        setActiveChatId(newChatId);
        setChats((prev) => [
          { _id: newChatId, title: userMessage.content.slice(0, 40) },
          ...prev,
        ]);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;

        if (value) {
          const chunk = decoder.decode(value);
          dispatch({
            type: "UPDATE_MESSAGE",
            id: assistantMessageId,
            chunk,
          });
        }
      }

      dispatch({ type: "SEND_SUCCESS" });
    } catch (err) {
      if (err.name !== "AbortError") {
        dispatch({
          type: "SEND_ERROR",
          payload: "AI response failed.",
        });
      }
    } finally {
      abortRef.current = null;
      dispatch({ type: "SEND_SUCCESS" });
    }
  };

  /* ================= STOP STREAM ================= */

  const stopStreaming = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    stop();
    dispatch({ type: "SEND_SUCCESS" });
  };

  /* ================= AUTO SCROLL ================= */

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [state.messages]);

  /* ================= RENDER ================= */

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
        {/* ERROR DISPLAY */}
        {state.error && (
          <div
            style={{
              background: "#7f1d1d",
              color: "#fff",
              padding: 10,
              borderRadius: 6,
              marginBottom: 12,
            }}
          >
            {state.error}
            <button
              onClick={() => dispatch({ type: "CLEAR_ERROR" })}
              style={{
                marginLeft: 10,
                background: "transparent",
                border: "none",
                color: "#fca5a5",
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          </div>
        )}

        {/* CHAT LOADING */}
        {state.loadingChat ? (
          <LoadingSpinner />
        ) : (
          // state.messages.map((msg) => (
          state.messages
            .filter((msg) => msg.role === "user" || msg.content?.trim() !== "")
            .map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: "flex",
                  justifyContent:
                    msg.role === "user" ? "flex-end" : "flex-start",
                  marginBottom: 14,
                }}
              >
                <div
                  style={{
                    background: msg.role === "user" ? "#3b82f6" : "#1e293b",
                    color: "#fff",
                    padding: 5,
                    borderRadius: 5,
                    width: "40vw",
                    position: "relative",
                  }}
                >
                  {/* <MessageRenderer msg={msg} /> */}
                  {msg.content?.trim() && <MessageRenderer msg={msg} />}

                  {msg.role === "assistant" && msg.content && (
                    <>
                      <button
                        onClick={() => speak(msg.content)}
                        style={{
                          position: "absolute",
                          top: 2,
                          right: 4,
                          background: "transparent",
                          border: "none",

                          color: "#94a3b8",
                          cursor: "pointer",
                        }}
                      >
                        E
                        <Volume2 size={16} />
                      </button>
                      <button
                        disabled={state.translatingMessageId === msg.id}
                        onClick={async () => {
                          const hindi = await translateToHindi(
                            msg.content,
                            msg.id,
                          );
                          speak(hindi);
                        }}
                        style={{
                          position: "absolute",
                          top: 2,
                          right: 42,
                          background: "transparent",
                          border: "none",
                          color: "green",
                          cursor: "pointer",
                        }}
                      >
                        H
                        {state.translatingMessageId === msg.id ? (
                          <LoadingSpinner small />
                        ) : (
                          <Volume2 size={16} />
                        )}
                      </button>

                      <button
                        onClick={stop}
                        style={{
                          position: "absolute",
                          top: 2,
                          right: 80,
                          background: "transparent",
                          border: "none",
                          color: "#ef4444",
                        }}
                      >
                        <VolumeX size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
        )}

        {state.sending && (
          <div style={{ opacity: 0.6, display: "flex", gap: 8 }}>
            <LoadingSpinner small />
            AI is typing...
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* INPUT AREA */}
      <div className="p-3 border-top bg-dark">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <textarea
            ref={textareaRef}
            value={state.question}
            onChange={(e) =>
              dispatch({ type: "SET_QUESTION", payload: e.target.value })
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            rows={1}
            disabled={state.sending}
            placeholder="Ask about robots, sites, telemetry..."
            style={{
              resize: "none",
              overflow: "hidden",
              minHeight: "44px",
              maxHeight: "160px", // optional max height
            }}
            className="form-control bg-dark text-light border-secondary"
          />

          <button
            onClick={state.sending ? stopStreaming : sendMessage}
            style={{
              marginLeft: 8,
              background: state.sending ? "#dc2626" : "#2563eb",
              border: "none",
              color: "white",
              padding: "8px",
              borderRadius: 6,
            }}
          >
            {state.sending ? <Square size={16} /> : <Send size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
