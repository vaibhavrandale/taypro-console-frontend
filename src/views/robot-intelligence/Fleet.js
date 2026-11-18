import React from "react";
import { Link } from "react-router-dom";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { fleetSummary, recommendations, windowOf } from "../../robot-intelligence/sampleData";
import { axis, Grid, Kpi, Note, Panel, Pill, Shell, T, Table, Tip } from "./Frame";

const link = { color: T.cyan, textDecoration: "none", fontWeight: 650 };

const Fleet = () => {
  const summary = fleetSummary();
  const chart = summary.rows.map((row) => ({ name: row.site.site_name, Health: row.score }));
  const watch = windowOf(summary.watch);
  const visits = windowOf(recommendations());
  const breakdownTone = summary.breakdown < 15 ? "green" : "amber";
  return (
    <Shell kicker="Taypro AI" title="Fleet overview" subtitle="One bar per site. Robot lists keep the lowest 8, then you open that site or robot.">
      <Grid>
        <Kpi label="Fleet health" value={summary.health} hint="Average of the sample site scores" />
        <Kpi label="Cleaning completion" value={`${summary.completion}%`} hint="Finished and reached the end of the row" tone="cyan" />
        <Kpi label="Robot utilization" value={`${summary.utilization}%`} hint="Robots with a full pass in the sample" tone="cyan" />
        <Kpi label="Breakdown rate" value={`${summary.breakdown}%`} hint="Cancelled or battery-dead passes" tone={breakdownTone} />
      </Grid>
      <div style={{ height: 8 }} />
      <Grid min={260}>
        <Panel title="Site comparison">
          <div style={{ height: 168 }}>
            <ResponsiveContainer>
              <BarChart data={chart} layout="vertical" margin={{ left: 12, right: 12 }}>
                <XAxis type="number" domain={[0, 100]} {...axis} />
                <YAxis type="category" dataKey="name" width={108} {...axis} />
                <Tooltip content={<Tip />} cursor={{ fill: "rgba(148,163,184,.06)" }} />
                <Bar dataKey="Health" fill={T.green} radius={[0, 8, 8, 0]} barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel title="Suggested visits">
          <Note>{visits.shown.length} of {visits.total} suggested visits.</Note>
          {visits.shown.map((row) => (
            <div key={row.robot_no} style={{ padding: "10px 0", borderTop: `1px solid ${T.border}` }}>
              <Link to={`/master-admin/robot-intelligence/robots/${row.robot_no}`} style={link}>{row.robot_no}</Link>
              <span style={{ color: T.mid }}> · {row.score}</span>
              <div style={{ marginTop: 4 }}>{row.text}</div>
            </div>
          ))}
        </Panel>
      </Grid>
      <div style={{ height: 8 }} />
      <Panel title="Underperforming robots">
        <Note>Lowest {watch.shown.length} of {watch.total}. The rest stay on the site page.</Note>
        <Table
          headers={["Robot", "Site", "Health", "Flag"]}
          rows={watch.shown.map((row) => ({
            key: row.robot_no,
            cells: [
              <Link to={`/master-admin/robot-intelligence/robots/${row.robot_no}`} style={link}>{row.robot_no}</Link>,
              row.site,
              row.score,
              <Pill tone={row.flags.includes("Battery") ? "red" : "amber"}>{row.flags.join(" · ") || "Review"}</Pill>,
            ],
          }))}
        />
      </Panel>
      <div style={{ height: 8 }} />
      <Panel title="Sites">
        <Table
          headers={["Site", "Client", "Health", "Completion", "Robots", "To review"]}
          rows={summary.rows.map((row) => ({
            key: row.site.site_id,
            cells: [
              <Link to={`/master-admin/robot-intelligence/sites/${row.site.site_id}`} style={link}>{row.site.site_name}</Link>,
              row.site.client,
              row.score,
              `${row.completion}%`,
              row.members.length,
              row.watch.length,
            ],
          }))}
        />
      </Panel>
    </Shell>
  );
};

export default Fleet;
