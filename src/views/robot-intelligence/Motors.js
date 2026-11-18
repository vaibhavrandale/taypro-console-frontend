import React, { useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Bar, BarChart } from "recharts";
import { formatDuration, motorHistory, robots } from "../../robot-intelligence/sampleData";
import { axis, grid, Grid, Kpi, Note, Panel, Shell, T, Tip } from "./Frame";

const crumb = {
  background: "transparent",
  color: T.cyan,
  border: 0,
  padding: 0,
  fontSize: 12,
  cursor: "pointer",
};

const Motors = () => {
  const [robotNo, setRobotNo] = useState(robots[0].robot_no);
  const [open, setOpen] = useState(false);
  const [dayName, setDayName] = useState(null);
  const history = motorHistory(robotNo);
  const day = history?.days.find((row) => row.day === dayName) || null;
  const chooseRobot = (value) => {
    setRobotNo(value);
    setOpen(false);
    setDayName(null);
  };
  const chart = history.days.map((row) => ({
    name: row.day.replace(" Nov", ""),
    Brush: row.brush_max,
    Wheel: row.wheel_max,
  }));

  return (
    <Shell kicker="Motor intelligence" title="Motors" subtitle="One robot, one month. The month is the average max current of both motors. Open it for each cleaning day, then a day for that run.">
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8, flexWrap: "wrap" }}>
        <select
          aria-label="Robot"
          value={robotNo}
          onChange={(event) => chooseRobot(event.target.value)}
          style={{ background: T.surfaceHi, color: T.text, border: `1px solid ${T.border}`, borderRadius: 8, padding: "4px 8px", fontSize: 12 }}
        >
          {robots.map((robot) => <option key={robot.robot_no} value={robot.robot_no}>{robot.robot_no}</option>)}
        </select>
        <button type="button" style={crumb} onClick={() => { setOpen(false); setDayName(null); }}>Month</button>
        {open ? <span style={{ color: T.mid }}>/</span> : null}
        {open ? <button type="button" style={crumb} onClick={() => setDayName(null)}>{history.month}</button> : null}
        {day ? <span style={{ color: T.mid }}>/</span> : null}
        {day ? <span style={{ fontSize: 12 }}>{day.day}</span> : null}
      </div>
      <Grid min={140}>
        <Kpi label="Cleaning days" value={history.days.length} hint={`${history.month} · ${history.robot.robot_no}`} tone="cyan" />
        <Kpi label="Brush max" value={day ? day.brush_max : history.brush} hint={day ? `Avg ${day.brush_avg}` : "Mean of the daily peaks"} />
        <Kpi label="Wheel max" value={day ? day.wheel_max : history.wheel} hint={day ? `Avg ${day.wheel_avg}` : "Mean of the daily peaks"} tone="cyan" />
      </Grid>
      <div style={{ height: 8 }} />
      {day ? (
        <Panel title={`Cleaning · ${day.day}`}>
          <Note>Both motors on this run. A 0 average means that average uplink arrived as 0. Numbers are firmware units.</Note>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 8, fontSize: 12 }}>
            <div>Finished · point {day.last_point}</div>
            <div>Battery {day.battery_before} → {day.battery_reverse} → {day.battery_after}</div>
            <div>Time {formatDuration(day.total_time)}</div>
            <div>Cycle count {day.cycle_count}</div>
            <div>Brush avg {day.brush_avg} · max {day.brush_max}</div>
            <div>Wheel avg {day.wheel_avg} · max {day.wheel_max}</div>
          </div>
        </Panel>
      ) : open ? (
        <Panel title={`${history.month} cleaning days`}>
          <Note>{history.days.length} days cleaned. Brush and wheel are the max current of that run.</Note>
          <div style={{ height: 168 }}>
            <ResponsiveContainer>
              <LineChart data={chart} onClick={(state) => state?.activePayload?.[0] && setDayName(`${state.activePayload[0].payload.name} Nov`)}>
                <CartesianGrid {...grid} />
                <XAxis dataKey="name" interval={4} {...axis} />
                <YAxis {...axis} />
                <Tooltip content={<Tip />} />
                <Line type="monotone" dataKey="Brush" stroke={T.cyan} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Wheel" stroke={T.green} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 8 }}>
            {history.days.map((row) => (
              <button key={row.day} type="button" onClick={() => setDayName(row.day)} style={{ ...crumb, border: `1px solid ${T.border}`, borderRadius: 999, padding: "2px 7px", color: T.text }}>
                {row.day.replace(" Nov", "")}
              </button>
            ))}
          </div>
        </Panel>
      ) : (
        <Panel title="Month average">
          <Note>Select the month to see each cleaning day.</Note>
          <div style={{ height: 168 }}>
            <ResponsiveContainer>
              <BarChart data={[{ name: history.month, Brush: history.brush, Wheel: history.wheel }]} onClick={() => setOpen(true)}>
                <CartesianGrid {...grid} />
                <XAxis dataKey="name" {...axis} />
                <YAxis {...axis} />
                <Tooltip content={<Tip />} />
                <Bar dataKey="Brush" fill={T.cyan} radius={[6, 6, 0, 0]} />
                <Bar dataKey="Wheel" fill={T.green} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <button type="button" onClick={() => setOpen(true)} style={{ ...crumb, border: `1px solid ${T.border}`, borderRadius: 999, padding: "2px 8px", color: T.text, marginTop: 8 }}>
            {history.month} · {history.days.length} days
          </button>
        </Panel>
      )}
    </Shell>
  );
};

export default Motors;
