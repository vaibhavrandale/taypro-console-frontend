import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { latestPass, restBattery, robots, windowOf } from "../../robot-intelligence/sampleData";
import { axis, grid, Grid, Kpi, Note, Panel, Shell, T, Table, Tip } from "./Frame";

const link = { color: T.cyan, textDecoration: "none", fontWeight: 650 };

const crumb = {
  background: "transparent",
  color: T.cyan,
  border: 0,
  padding: 0,
  fontSize: 12,
  cursor: "pointer",
};

const Battery = () => {
  const [monthName, setMonthName] = useState(null);
  const [dayName, setDayName] = useState(null);
  const [robotNo, setRobotNo] = useState("all");
  const month = restBattery.find((row) => row.month === monthName) || null;
  const day = month?.days.find((row) => row.day === dayName) || null;
  const openMonth = (name) => {
    setMonthName(name);
    setDayName(null);
    setRobotNo("all");
  };
  const log = (day?.log || [])
    .filter((row) => robotNo === "all" || row.robot_no === robotNo)
    .slice()
    .sort((a, b) => a.time.localeCompare(b.time) || a.robot_no.localeCompare(b.robot_no));
  const ranked = windowOf([...robots].sort((a, b) => a.battery - b.battery));
  const low = robots.filter((robot) => robot.battery < 70).length;

  let chart = restBattery.map((row) => ({ name: row.month, Average: row.average }));
  let chartTitle = "Average rest battery by month";
  if (month && !day) {
    chart = month.days.map((row) => ({ name: row.day.replace(` ${month.month}`, ""), Average: row.average }));
    chartTitle = `${month.month} day by day`;
  }

  return (
    <Shell kicker="Battery intelligence" title="Battery" subtitle="Rest battery starts as a monthly average. Open a month for the days, then a day for every rest reading.">
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8, fontSize: 12 }}>
        <button type="button" style={crumb} onClick={() => openMonth(null)}>Months</button>
        {month ? <span style={{ color: T.mid }}>/</span> : null}
        {month ? <button type="button" style={crumb} onClick={() => { setDayName(null); setRobotNo("all"); }}>{month.month}</button> : null}
        {day ? <span style={{ color: T.mid }}>/</span> : null}
        {day ? <span>{day.day}</span> : null}
      </div>
      <Grid min={160}>
        <Kpi label={day ? "Day average" : month ? "Month average" : "Latest month"} value={`${day ? day.average : month ? month.average : restBattery[restBattery.length - 1].average}%`} hint="Mean of the rest readings" />
        <Kpi label="Under 70%" value={low} hint="Latest rest reading" tone={low ? "red" : "green"} />
      </Grid>
      <div style={{ height: 8 }} />
      {day ? (
        <Panel title={`Rest log · ${day.day}`}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
            <select
              aria-label="Robot"
              value={robotNo}
              onChange={(event) => setRobotNo(event.target.value)}
              style={{ background: T.surfaceHi, color: T.text, border: `1px solid ${T.border}`, borderRadius: 8, padding: "4px 8px", fontSize: 12 }}
            >
              <option value="all">All robots in this sample day</option>
              {[...new Set(day.log.map((row) => row.robot_no))].map((id) => <option key={id} value={id}>{id}</option>)}
            </select>
            <Note>{log.length} readings. Each row is one topic Battery message.</Note>
          </div>
          <Table
            headers={["Time", "Robot", "Battery"]}
            rows={log.map((row) => ({
              key: `${row.time}-${row.robot_no}`,
              cells: [row.time, <Link to={`/master-admin/robot-intelligence/robots/${row.robot_no}`} style={link}>{row.robot_no}</Link>, `${row.battery}%`],
            }))}
          />
        </Panel>
      ) : (
        <Panel title={chartTitle}>
          <Note>{month ? "Select a day to open that day's readings." : "Select a month to open the days."}</Note>
          <div style={{ height: 168 }}>
            <ResponsiveContainer>
              {month ? (
                <LineChart data={chart} onClick={(state) => state?.activePayload?.[0] && setDayName(`${state.activePayload[0].payload.name} ${month.month}`)}>
                  <CartesianGrid {...grid} />
                  <XAxis dataKey="name" {...axis} />
                  <YAxis domain={[60, 100]} {...axis} />
                  <Tooltip content={<Tip />} />
                  <Line type="monotone" dataKey="Average" stroke={T.green} strokeWidth={2} dot={{ r: 3, fill: T.green }} />
                </LineChart>
              ) : (
                <BarChart data={chart} onClick={(state) => state?.activePayload?.[0] && openMonth(state.activePayload[0].payload.name)}>
                  <CartesianGrid {...grid} />
                  <XAxis dataKey="name" {...axis} />
                  <YAxis domain={[60, 100]} {...axis} />
                  <Tooltip content={<Tip />} />
                  <Bar dataKey="Average" fill={T.green} radius={[6, 6, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
            {(month ? month.days : restBattery).map((row) => (
              <button
                key={month ? row.day : row.month}
                type="button"
                onClick={() => (month ? setDayName(row.day) : openMonth(row.month))}
                style={{ ...crumb, border: `1px solid ${T.border}`, borderRadius: 999, padding: "2px 8px", color: T.text }}
              >
                {month ? row.day.replace(` ${month.month}`, "") : row.month} {row.average}%
              </button>
            ))}
          </div>
        </Panel>
      )}
      {!month ? (
        <>
          <div style={{ height: 8 }} />
          <Panel title="Lowest rest battery">
            <Note>Lowest {ranked.shown.length} of {ranked.total}. Open a robot for its cleaning-run battery.</Note>
            <Table
              headers={["Robot", "Rest", "After cleaning"]}
              rows={ranked.shown.map((robot) => {
                const pass = latestPass(robot.robot_no);
                return {
                  key: robot.robot_no,
                  cells: [
                    <Link to={`/master-admin/robot-intelligence/robots/${robot.robot_no}`} style={link}>{robot.robot_no}</Link>,
                    `${robot.battery}%`,
                    pass ? `${pass.battery_after}%` : "—",
                  ],
                };
              })}
            />
          </Panel>
        </>
      ) : null}
    </Shell>
  );
};

export default Battery;
