import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { CCard, CCardBody, CSpinner, CBadge } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilReload,
  cilSignalCellular4,
  cilStorage,
  cilChartLine,
  cilClock,
  cilArrowTop,
} from "@coreui/icons";
import socket from "../../components/Socket";

const API_ENDPOINT = "/api/v1/sysinfo-logs/all-collections";

const ACCENT_COLORS = [
  {
    bar: "#3b82f6",
    glow: "rgba(59,130,246,0.3)",
    light: "rgba(59,130,246,0.08)",
  },
  {
    bar: "#8b5cf6",
    glow: "rgba(139,92,246,0.3)",
    light: "rgba(139,92,246,0.08)",
  },
  {
    bar: "#06b6d4",
    glow: "rgba(6,182,212,0.3)",
    light: "rgba(6,182,212,0.08)",
  },
  {
    bar: "#10b981",
    glow: "rgba(16,185,129,0.3)",
    light: "rgba(16,185,129,0.08)",
  },
  {
    bar: "#f59e0b",
    glow: "rgba(245,158,11,0.3)",
    light: "rgba(245,158,11,0.08)",
  },
];

const fmt = (n) => n?.toLocaleString() ?? "0";

// ── Sparkline mini bar chart ──────────────────────────────────────────────────
const MiniBar = ({ pct, color }) => (
  <div
    style={{
      flex: 1,
      height: 2,
      background: "rgba(255,255,255,0.05)",
      borderRadius: 2,
      overflow: "hidden",
    }}
  >
    <div
      style={{
        height: "100%",
        width: `${pct}%`,
        borderRadius: 2,
        background: color,
        transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)",
      }}
    />
  </div>
);

// ── Status dot ────────────────────────────────────────────────────────────────
const LiveDot = ({ connected }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      fontSize: 11,
      fontWeight: 500,
      letterSpacing: "0.06em",
      color: connected ? "#4ade80" : "#f97316",
      padding: "4px 10px",
      borderRadius: 6,
      background: connected ? "rgba(74,222,128,0.08)" : "rgba(249,115,22,0.08)",
      border: `1px solid ${connected ? "rgba(74,222,128,0.2)" : "rgba(249,115,22,0.2)"}`,
    }}
  >
    <span
      style={{
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: connected ? "#4ade80" : "#f97316",
        boxShadow: connected ? "0 0 0 2px rgba(74,222,128,0.3)" : "none",
        animation: connected ? "livePulse 2s infinite" : "none",
      }}
    />
    {connected ? "Live" : "Offline"}
  </span>
);

// ── Stat card ─────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, icon, accent, loading, delta }) => (
  <div
    style={{
      background: "#111827",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 12,
      padding: "20px 22px",
      display: "flex",
      flexDirection: "column",
      gap: 12,
      position: "relative",
      overflow: "hidden",
      transition: "border-color 0.2s",
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: 0.4,
        background: `radial-gradient(circle at top right, ${accent}18, transparent 65%)`,
        pointerEvents: "none",
      }}
    />
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: "",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        {label}
      </span>
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: 8,
          background: `${accent}15`,
          border: `1px solid ${accent}25`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CIcon icon={icon} style={{ width: 13, height: 13, color: accent }} />
      </div>
    </div>
    <div>
      {loading ? (
        <CSpinner size="sm" style={{ color: accent }} />
      ) : (
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span
            style={{
              fontSize: sub ? 18 : 28,
              fontWeight: 700,
              color: "#f9fafb",
              lineHeight: 1,
              letterSpacing: "-0.02em",
              wordBreak: "break-all",
            }}
          >
            {value}
          </span>
          {delta && (
            <span
              style={{
                fontSize: 12,
                color: "#4ade80",
                fontWeight: 600,
                animation: "fadeUp 0.3s ease",
              }}
            >
              {delta}
            </span>
          )}
        </div>
      )}
      {sub && !loading && (
        <div style={{ fontSize: 11, color: "#374151", marginTop: 3 }}>
          {sub}
        </div>
      )}
    </div>
  </div>
);

// ── Collection row — active ───────────────────────────────────────────────────
const ActiveRow = ({ item, max, rank, isNew }) => {
  const pct = max > 0 ? Math.round((item.todayCount / max) * 100) : 0;
  const accent = ACCENT_COLORS[rank % ACCENT_COLORS.length];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "11px 16px",
        borderRadius: 10,
        background: isNew ? `${accent.light}` : "transparent",
        border: `1px solid ${isNew ? accent.bar + "30" : "transparent"}`,
        transition: "all 0.35s ease",
      }}
      className="m-1"
    >
      {/* rank pill */}
      <div
        style={{
          minWidth: 22,
          height: 22,
          borderRadius: 6,
          background: `${accent.bar}18`,
          border: `1px solid ${accent.bar}30`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 10,
          fontWeight: 700,
          color: accent.bar,
          flexShrink: 0,
        }}
      >
        {rank + 1}
      </div>

      {/* name + bar */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: "#d1d5db",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {item.collection}
        </div>
        <MiniBar pct={pct} color={accent.bar} />
      </div>

      {/* count */}
      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: accent.bar,
          minWidth: 48,
          textAlign: "right",
          textShadow: `0 0 16px ${accent.glow}`,
        }}
      >
        {fmt(item.todayCount)}
      </div>
    </div>
  );
};

// ── Collection row — idle ─────────────────────────────────────────────────────
const IdleRow = ({ item }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "9px 16px",
      borderRadius: 8,
      transition: "background 0.15s",
    }}
    onMouseEnter={(e) =>
      (e.currentTarget.style.background = "rgba(255,255,255,0.02)")
    }
    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
  >
    <span
      style={{
        fontSize: 12,
        color: "",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
    >
      {item.collection}
    </span>
    <span style={{ fontSize: 11, color: "", fontWeight: 600, flexShrink: 0 }}>
      —
    </span>
  </div>
);

// ── Section header ────────────────────────────────────────────────────────────
const SectionHeader = ({ label, count, dotColor, badgeBg, badgeColor }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "14px 16px 12px",
      borderBottom: "1px solid rgba(255,255,255,0.04)",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: dotColor,
          display: "inline-block",
          boxShadow: `0 0 6px ${dotColor}`,
        }}
      />
      <span style={{ fontSize: 13, fontWeight: 600, color: "#9ca3af" }}>
        {label}
      </span>
    </div>
    <span
      style={{
        fontSize: 11,
        fontWeight: 700,
        padding: "2px 9px",
        borderRadius: 20,
        background: badgeBg,
        border: `1px solid ${badgeColor}30`,
      }}
    >
      {count}
    </span>
  </div>
);

// ── Main ──────────────────────────────────────────────────────────────────────
export default function MasterAdminDashboardtow() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connected, setConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [fromCache, setFromCache] = useState(false);
  const [newCollections, setNewCollections] = useState(new Set());
  const [totalDelta, setTotalDelta] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const prevTotalRef = useRef(0);

  const fetchData = async (manual = false) => {
    try {
      if (manual) setRefreshing(true);
      else setLoading(true);
      const res = await axios.get(API_ENDPOINT);
      const payload = res.data;
      setData(payload);
      setFromCache(payload.fromCache ?? false);
      setLastUpdated(new Date());
      prevTotalRef.current = payload.totalTodayCount ?? 0;
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    setConnected(socket.connected);

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    socket.on("collection:counts:updated", (payload) => {
      const newTotal = payload.totalTodayCount ?? 0;
      const delta = newTotal - prevTotalRef.current;
      if (delta > 0) {
        setTotalDelta(`+${fmt(delta)}`);
        setTimeout(() => setTotalDelta(null), 3000);
      }
      prevTotalRef.current = newTotal;

      setData((prev) => {
        if (!prev) return payload;
        const prevMap = Object.fromEntries(
          (prev.data ?? []).map((d) => [d.collection, d.todayCount]),
        );
        const updated = new Set();
        payload.data?.forEach((d) => {
          if ((prevMap[d.collection] ?? 0) < d.todayCount)
            updated.add(d.collection);
        });
        if (updated.size) {
          setNewCollections(updated);
          setTimeout(() => setNewCollections(new Set()), 2500);
        }
        return payload;
      });
      setFromCache(false);
      setLastUpdated(new Date(payload.timestamp ?? Date.now()));
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("collection:counts:updated");
    };
  }, []);

  const activeCollections = data?.data?.filter((d) => d.todayCount > 0) ?? [];
  const inactiveCollections =
    data?.data?.filter((d) => d.todayCount === 0) ?? [];
  const maxCount = activeCollections[0]?.todayCount ?? 1;

  return (
    <>
      <style>{`
        @keyframes livePulse {
          0%, 100% { box-shadow: 0 0 0 2px rgba(74,222,128,0.3); }
          50% { box-shadow: 0 0 0 5px rgba(74,222,128,0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spinIcon {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .coll-scroll::-webkit-scrollbar { width: 3px; }
        .coll-scroll::-webkit-scrollbar-track { background: transparent; }
        .coll-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.07); border-radius: 3px; }
        .refresh-icon:hover { background: rgba(255,255,255,0.06) !important; }
      `}</style>

      <div
        style={{
          background: "#0d1117",
          minHeight: "100vh",
          padding: "28px 32px",
          color: "#f9fafb",
        }}
      >
        {/* ── Top bar ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 32,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 4,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: "rgba(59,130,246,0.1)",
                  border: "1px solid rgba(59,130,246,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CIcon
                  icon={cilStorage}
                  style={{ width: 15, height: 15, color: "#3b82f6" }}
                />
              </div>
              <div>
                <h1
                  style={{
                    margin: 0,
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#f9fafb",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Collection Monitor
                </h1>
                <div style={{ fontSize: 11, color: "", marginTop: 1 }}>
                  {data?.date ?? "—"} · {data?.data?.length ?? 0} collections
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {lastUpdated && (
              <span
                style={{
                  fontSize: 11,
                  color: "#374151",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <CIcon
                  icon={cilClock}
                  style={{ width: 11, height: 11, color: "#4b5563" }}
                />
                Updated {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <LiveDot connected={connected} />
            <button
              className="refresh-icon"
              onClick={() => fetchData(true)}
              disabled={refreshing || loading}
              title="Refresh"
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                cursor: "pointer",
                color: "#4b5563",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.15s",
              }}
            >
              <CIcon
                icon={cilReload}
                style={{
                  width: 13,
                  height: 13,
                  animation: refreshing
                    ? "spinIcon 0.8s linear infinite"
                    : "none",
                }}
              />
            </button>
          </div>
        </div>

        {/* ── Stat cards ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 14,
            marginBottom: 24,
          }}
        >
          <StatCard
            label="Total Today"
            value={fmt(data?.totalTodayCount)}
            delta={totalDelta}
            icon={cilChartLine}
            accent="#3b82f6"
            loading={loading}
          />
          <StatCard
            label="Active Collections"
            value={activeCollections.length}
            icon={cilSignalCellular4}
            accent="#10b981"
            loading={loading}
          />
          <StatCard
            label="Idle Collections"
            value={inactiveCollections.length}
            icon={cilStorage}
            accent="#6b7280"
            loading={loading}
          />
          <StatCard
            label="Top Collection"
            value={data?.data?.[0]?.collection ?? "—"}
            sub={`${fmt(data?.data?.[0]?.todayCount)} documents`}
            icon={cilArrowTop}
            accent="#8b5cf6"
            loading={loading}
          />
        </div>

        {/* ── Two-panel layout ── */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
        >
          {/* Active panel */}
          <CCard
            style={{
              background: "#111827",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 12,
              margin: 0,
            }}
          >
            <SectionHeader
              label="Active"
              count={activeCollections.length}
              dotColor="#4ade80"
              badgeBg="rgba(74,222,128,0.08)"
              badgeColor="#4ade80"
            />
            <CCardBody style={{ padding: "8px 0 12px" }}>
              {loading ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    padding: 48,
                  }}
                >
                  <CSpinner
                    style={{ color: "#3b82f6", width: 24, height: 24 }}
                  />
                </div>
              ) : error ? (
                <div
                  style={{
                    color: "#f87171",
                    textAlign: "center",
                    padding: 24,
                    fontSize: 13,
                  }}
                >
                  ❌ {error}
                </div>
              ) : activeCollections.length === 0 ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "48px 24px",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: "rgba(255,255,255,0.03)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CIcon
                      icon={cilStorage}
                      style={{ width: 18, height: 18, color: "#374151" }}
                    />
                  </div>
                  <span style={{ fontSize: 13, color: "#374151" }}>
                    No activity today
                  </span>
                </div>
              ) : (
                <div
                  className="coll-scroll "
                  style={{ maxHeight: 500, overflowY: "auto" }}
                >
                  {activeCollections.map((item, i) => (
                    <ActiveRow
                      key={item.collection}
                      item={item}
                      max={maxCount}
                      rank={i}
                      isNew={newCollections.has(item.collection)}
                    />
                  ))}
                </div>
              )}
            </CCardBody>
          </CCard>

          {/* Idle panel */}
          <CCard
            style={{
              background: "#111827",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 12,
              margin: 0,
            }}
          >
            <SectionHeader
              label="Idle"
              count={inactiveCollections.length}
              dotColor="#374151"
              badgeBg="rgba(55,65,81,0.3)"
              badgeColor="#4b5563"
            />
            <CCardBody style={{ padding: "8px 0 12px" }}>
              {loading ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    padding: 48,
                  }}
                >
                  <CSpinner style={{ color: "", width: 24, height: 24 }} />
                </div>
              ) : (
                <div
                  className="coll-scroll"
                  style={{ maxHeight: 500, overflowY: "auto" }}
                >
                  {inactiveCollections.map((item) => (
                    <IdleRow key={item.collection} item={item} />
                  ))}
                </div>
              )}
            </CCardBody>
          </CCard>
        </div>

        {/* ── Footer ── */}
        <div
          style={{
            marginTop: 24,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
            fontSize: 11,
            color: "",
          }}
        >
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: connected ? "#4ade80" : "#374151",
              display: "inline-block",
            }}
          />
          {connected
            ? "Receiving real-time updates via WebSocket"
            : "Reconnecting to WebSocket..."}
          {fromCache && (
            <CBadge
              style={{
                background: "rgba(245,158,11,0.08)",
                color: "",
                border: "1px solid rgba(245,158,11,0.15)",
                fontSize: 10,
              }}
            >
              cached
            </CBadge>
          )}
        </div>
      </div>
    </>
  );
}
