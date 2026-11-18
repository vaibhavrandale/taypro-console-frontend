import React from "react";
import { Link, useParams } from "react-router-dom";
import { formatDuration, motorScore, robotStats, windowOf } from "../../robot-intelligence/sampleData";
import { Grid, Meter, Note, Panel, ScoreRing, Shell, T, Table } from "./Frame";

const yes = (value) => (value ? "Yes" : "No");

const RobotHealth = () => {
  const { robotNo } = useParams();
  const stats = robotStats(robotNo);
  if (!stats.robot) return <Shell kicker="Taypro AI" title="Robot"><p>Robot not in the sample.</p></Shell>;
  const { robot, rows, tickets, note } = stats;
  const pass = [...rows].reverse().find((row) => row.brush_max != null);
  return (
    <Shell kicker="Robot health" title={robot.robot_no} subtitle={`${robot.site_id} · block ${robot.block} · ${robot.row_length} m row. The score uses every run. The table shows the latest 8.`}>
      <Grid min={220}>
        <Panel><ScoreRing value={Math.round(stats.score)} label="Overall" /></Panel>
        <Panel title="Component scores">
          <Meter label="Rest battery" value={stats.battery} />
          <Meter label="Motor" value={motorScore(robot)} />
          <Meter label="Operational reliability" value={stats.reliability} />
          <Meter label="Cleaning consistency" value={stats.completion} />
          <Meter label="Communication" value={robot.communication} />
          <div style={{ color: T.mid, fontSize: 12 }}>Communication is a sample field. Motor drops when brush or wheel current is above this robot's usual range. Neither one is a trained score.</div>
        </Panel>
      </Grid>
      <div style={{ height: 8 }} />
      <Grid min={260}>
        <Panel title="Cleaning runs">
          <Note>Latest {Math.min(rows.length, 8)} of {rows.length}.</Note>
          <Table
            headers={["Start", "Before", "Reverse", "After", "Total time", "Cycle count", "Max brush", "Max wheel"]}
            rows={windowOf([...rows].reverse()).shown.map((row) => ({
              key: row.start_at,
              cells: [
                row.start_at,
                row.battery_before ?? "—",
                row.battery_reverse ?? "—",
                row.battery_after ?? "—",
                formatDuration(row.total_time),
                row.cycle_count ?? "—",
                row.brush_max ?? "—",
                row.wheel_max ?? "—",
              ],
            }))}
          />
        </Panel>
        <Panel title="Notes and tickets">
          <p>{note ? `${note.date}: ${note.comment}` : "No technician note in the sample for this site."}</p>
          {tickets.length === 0 ? <p style={{ color: T.mid }}>No ticket in the sample.</p> : tickets.map((row) => (
            <div key={row.ticket_id} style={{ padding: "8px 0", borderTop: `1px solid ${T.border}` }}>
              {row.ticket_id} · {row.fault_type} · {row.opened_at}
            </div>
          ))}
          <p style={{ color: T.mid }}>
            {pass
              ? `Latest finished run: battery ${pass.battery_before} → ${pass.battery_reverse} → ${pass.battery_after}, total ${formatDuration(pass.total_time)}, cycle count ${pass.cycle_count}. Brush avg ${pass.brush_avg} / max ${pass.brush_max}. Wheel avg ${pass.wheel_avg} / max ${pass.wheel_max}. Current numbers are firmware units.`
              : "No finished run with motor and battery metrics in the sample."}
            {" "}Finished {yes(rows.some((row) => row.finished))}, cancelled {yes(rows.some((row) => row.cancelled))}, battery dead {yes(rows.some((row) => row.battery_dead))}.
          </p>
          <Link to={`/master-admin/robot-intelligence/sites/${robot.site_id}`} style={{ color: T.cyan }}>Back to site</Link>
        </Panel>
      </Grid>
    </Shell>
  );
};

export default RobotHealth;
