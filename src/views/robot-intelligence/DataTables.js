import React, { useState } from "react";
import { cycles, formatDuration, notes, robots, sites, tickets, windowOf } from "../../robot-intelligence/sampleData";
import { Note, Panel, Shell, T, Table } from "./Frame";

const DataTables = () => {
  const [query, setQuery] = useState("");
  const robot = robots.find((row) => row.robot_no.toLowerCase() === query.trim().toLowerCase());
  const runs = robot ? windowOf([...cycles.filter((row) => row.robot_no === robot.robot_no)].reverse()) : null;
  const robotTickets = robot ? tickets.filter((row) => row.robot_no === robot.robot_no) : [];
  return (
    <Shell kicker="Data" title="Records" subtitle="Look up one robot. Two years of runs open there, latest 8 first. The site list stays short because it is sites, not robots.">
      <Panel title="Find a robot" style={{ marginBottom: 8 }}>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Robot number, for example RB-1001"
          aria-label="Robot number"
          style={{
            width: "100%",
            maxWidth: 280,
            background: T.surfaceHi,
            color: T.text,
            border: `1px solid ${T.border}`,
            borderRadius: 8,
            padding: "6px 8px",
            fontSize: 13,
          }}
        />
        <div style={{ marginTop: 8 }}>
          {robot && runs ? (
            <>
              <Note>Latest {runs.shown.length} of {runs.total} runs for {robot.robot_no}.</Note>
              <Table
                headers={["Start", "Before", "After", "Total time", "Cycle count", "Max brush", "Max wheel"]}
                rows={runs.shown.map((row) => ({
                  key: row.start_at,
                  cells: [row.start_at, row.battery_before ?? "—", row.battery_after ?? "—", formatDuration(row.total_time), row.cycle_count ?? "—", row.brush_max ?? "—", row.wheel_max ?? "—"],
                }))}
              />
              <div style={{ height: 8 }} />
              <Note>{robotTickets.length ? robotTickets.map((row) => row.ticket_id).join(", ") : "No ticket for this robot in the sample."}</Note>
            </>
          ) : (
            <Note>Enter the full robot number. The page does not list every robot.</Note>
          )}
        </div>
      </Panel>
      <Panel title="Sites" style={{ marginBottom: 8 }}>
        <Table headers={["Site", "Name", "Client"]} rows={sites.map((row) => ({ key: row.site_id, cells: [row.site_id, row.site_name, row.client] }))} />
      </Panel>
      <Panel title="Technician notes">
        <Table headers={["Site", "Date", "Comment"]} rows={notes.map((row) => ({ key: row.site_id, cells: [row.site_id, row.date, row.comment] }))} />
      </Panel>
    </Shell>
  );
};

export default DataTables;
