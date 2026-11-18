import React from "react";
import { blocks } from "../../robot-intelligence/sampleData";
import { Panel, Shell, T } from "./Frame";

const color = {
  "Priority 1": { bg: "rgba(248,113,113,.18)", fg: T.red },
  "Priority 2": { bg: "rgba(251,191,36,.16)", fg: T.amber },
  Low: { bg: "rgba(52,211,153,.12)", fg: T.green },
  "Weather hold": { bg: "rgba(56,189,248,.16)", fg: T.cyan },
};

const counts = Object.keys(color).map((name) => ({ name, n: blocks.filter((block) => block.priority === name).length }));

const Cleaning = () => (
  <Shell kicker="Cleaning intelligence" title="Block priority" subtitle="One site at a time. Tiles are blocks, so a thousand robots do not become a thousand tiles.">
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 8, color: T.mid, fontSize: 12 }}>
      {counts.map((row) => (
        <span key={row.name}><span style={{ color: color[row.name].fg }}>●</span> {row.name} · {row.n}</span>
      ))}
      <span>● Available</span>
      <span>○ Unavailable</span>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(104px, 1fr))", gap: 6 }}>
      {blocks.map((block) => {
        const tone = color[block.priority];
        return (
          <Panel key={block.block} style={{ background: tone.bg, borderColor: "transparent", padding: "8px 10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 13, fontWeight: 650 }}>{block.block}</div>
              <span title={block.state} style={{ width: 10, height: 10, borderRadius: 99, background: block.state === "Available" ? T.green : "transparent", border: `2px solid ${block.state === "Available" ? T.green : T.mid}` }} />
            </div>
            <div style={{ color: tone.fg, marginTop: 4, fontSize: 12, fontWeight: 600 }}>{block.priority}</div>
            <div style={{ color: T.mid, marginTop: 2, fontSize: 11 }}>{block.state}</div>
          </Panel>
        );
      })}
    </div>
  </Shell>
);

export default Cleaning;
