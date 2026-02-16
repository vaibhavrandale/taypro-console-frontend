import React, { useState, useRef, useEffect, useReducer } from "react";
import { CFormInput, CSpinner, CFormSelect } from "@coreui/react";
import axios from "axios";
import MessageRenderer from "./MessageRenderer";
import { Search, Bot } from "lucide-react";
import { CInputGroup, CInputGroupText } from "@coreui/react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, sitesLoading: true };
    case "FETCH_SUCCESS":
      return { ...state, sitesLoading: false, sites: action.payload };
    case "FETCH_FAIL":
      return { ...state, sitesLoading: false };
    default:
      return state;
  }
};

const CASE_OPTIONS = [
  { label: "Select Case Type", value: "" },
  { label: "Robot Analysis", value: "ROBOT_ANALYSIS" },
  {
    label: "Site Today Cleaning Summary",
    value: "SITE_TODAY_CLEANING_SUMMARY",
  },
];

const OpenAiChat = () => {
  const [{ sites }, dispatch] = useReducer(reducer, {
    sites: [],
    sitesLoading: false,
  });

  const [messages, setMessages] = useState([]);
  const [caseType, setCaseType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [robots, setRobots] = useState([]);
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const authtoken = useSelector((state) => state.authtoken);

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    const storedRobots = localStorage.getItem("robots");
    if (storedRobots) setRobots(JSON.parse(storedRobots));

    const fetchSites = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const res = await axios.get(`/api/v1/sites`, {
          headers: { Authorization: `Bearer ${authtoken}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: res.data.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL" });
        toast.error("Failed to load sites");
      }
    };

    fetchSites();
  }, [authtoken]);

  /* ---------------- FILTER ---------------- */
  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const isSiteCase = caseType.includes("SITE");
    const source = isSiteCase ? sites : robots;

    const filtered = source.filter((item) => {
      const value = isSiteCase ? item.site_id : item.robot_no;
      return value?.toLowerCase().includes(searchTerm.toLowerCase());
    });

    setResults(filtered.slice(0, 15));
    setShowDropdown(filtered.length > 0);
  }, [searchTerm, caseType, robots, sites]);

  /* ---------------- AUTO QUERY ---------------- */
  const runQuery = async (value) => {
    if (!caseType) return toast.error("Select case type first");

    const userMessage = {
      role: "user",
      content: `${caseType} → ${value}`,
    };

    setMessages((prev) => [...prev, userMessage]);
    setCaseType("");
    setSearchTerm("");
    setLoading(true);
    setShowDropdown(false);

    try {
      const res = await axios.post("/api/v1/openai/query", {
        caseType,
        query: value,
        explain: true,
      });

      const payload = res.data?.data ?? res.data;

      setMessages((prev) => [
        ...prev,
        { role: "assistant", caseType, rawData: payload },
      ]);
    } catch (err) {
      toast.error("Query failed");
    } finally {
      setLoading(false);

      // 🔥 RESET EVERYTHING
      setCaseType("");
      setSearchTerm("");
      setResults([]);
      setShowDropdown(false);
    }
  };

  /* ---------------- AUTO SCROLL ---------------- */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={{ height: "75vh", display: "flex", flexDirection: "column" }}>
      {/* CHAT BODY */}
      <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              marginBottom: 14,
            }}
          >
            <div
              style={{
                background: msg.role === "user" ? "#3b82f6" : "",
                color: msg.role === "user" ? "#fff" : "#000",
                padding: msg.role === "user" ? "10px 15px" : 0,
                borderRadius: 14,
                width: msg.role === "user" ? "40%" : "75%",
              }}
            >
              <MessageRenderer msg={msg} />
            </div>
          </div>
        ))}
        {loading && <CSpinner size="sm" />}
        <div ref={chatEndRef} />
      </div>

      {/* FOOTER */}
      <div className="px-4 py-3 border-top bg-dark">
        <div className="d-flex flex-wrap gap-3">
          {/* CASE TYPE */}
          <CInputGroup style={{ maxWidth: 260 }}>
            <CInputGroupText className="bg-dark text-light border-secondary">
              <Bot size={16} />
            </CInputGroupText>
            <CFormSelect
              value={caseType}
              onChange={(e) => setCaseType(e.target.value)}
              className="bg-dark text-light border-secondary"
            >
              {CASE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </CFormSelect>
          </CInputGroup>

          {/* SEARCH */}
          <div className="flex-grow-1 position-relative">
            <CInputGroup>
              <CInputGroupText className="bg-dark text-light border-secondary">
                <Search size={16} />
              </CInputGroupText>
              <CFormInput
                value={searchTerm}
                disabled={!caseType}
                placeholder={
                  caseType.includes("SITE")
                    ? "Search Site ID..."
                    : "Search Robot No..."
                }
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-dark text-light border-secondary"
              />
            </CInputGroup>

            {showDropdown && (
              <div
                className="position-absolute w-50 border rounded shadow"
                style={{
                  background: "#1e293b",
                  bottom: "100%",
                  marginBottom: 6,
                  maxHeight: 220,
                  overflowY: "auto",
                  zIndex: 1050,
                }}
              >
                {results.map((item, i) => {
                  const value = caseType.includes("SITE")
                    ? item.site_id
                    : item.robot_no;

                  return (
                    <div
                      key={i}
                      className="px-3 py-2 text-light border-bottom"
                      style={{ cursor: "pointer" }}
                      onMouseDown={() => runQuery(value)}
                    >
                      {value}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenAiChat;
