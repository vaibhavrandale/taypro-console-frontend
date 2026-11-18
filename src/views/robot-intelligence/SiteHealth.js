import React from "react";
import { Link, useParams } from "react-router-dom";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { siteStats, windowOf } from "../../robot-intelligence/sampleData";
import { axis, Grid, Kpi, Note, Panel, ScoreRing, Shell, T, Table, Tip } from "./Frame";

const link = { color: T.cyan, textDecoration: "none", fontWeight: 650 };

const SiteHealth = () => {
  const { siteId } = useParams();
  const stats = siteStats(siteId);
  if (!stats.site) return <Shell kicker="Taypro AI" title="Site"><p>Site not in the sample.</p></Shell>;
  const ranked = windowOf([...stats.members].sort((a, b) => a.score - b.score));
  const chart = ranked.shown.map((row) => ({ name: row.robot.robot_no, Health: row.score }));
  const byBlock = stats.members.reduce((groups, row) => {
    const list = groups[row.robot.block] || [];
    list.push(row.score);
    groups[row.robot.block] = list;
    return groups;
  }, {});
  return (
    <Shell kicker="Site health" title={stats.site.site_name} subtitle={`${stats.site.client}. The score covers every robot. The chart lists the lowest 8.`}>
      <Grid>
        <Panel><ScoreRing value={Math.round(stats.score)} label="Site health" /></Panel>
        <Kpi label="Cleaning completion" value={`${stats.completion}%`} hint="Share of passes that reached the row end" tone="cyan" />
        <Kpi label="Robots to review" value={stats.watch.length} hint={`${stats.members.length} robots on this site`} tone={stats.watch.length ? "amber" : "green"} />
      </Grid>
      <div style={{ height: 8 }} />
      <Panel title="Block health">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(96px, 1fr))", gap: 6 }}>
          {Object.entries(byBlock).map(([block, scores]) => {
            const score = Math.round(scores.reduce((sum, value) => sum + value, 0) / scores.length);
            return (
              <div key={block} style={{ background: T.surfaceHi, borderRadius: 8, padding: "6px 8px" }}>
                <div style={{ color: T.mid, fontSize: 11 }}>{block}</div>
                <div style={{ fontSize: 16, fontWeight: 650, color: score >= 80 ? T.green : score >= 65 ? T.amber : T.red }}>{score}</div>
              </div>
            );
          })}
        </div>
      </Panel>
      <div style={{ height: 8 }} />
      <Panel title="Lowest robots">
        {ranked.total > ranked.shown.length ? <Note>Lowest {ranked.shown.length} of {ranked.total}.</Note> : null}
        <div style={{ height: 168 }}>
          <ResponsiveContainer>
            <BarChart data={chart}>
              <XAxis dataKey="name" {...axis} />
              <YAxis domain={[0, 100]} {...axis} />
              <Tooltip content={<Tip />} cursor={{ fill: "rgba(148,163,184,.06)" }} />
              <Bar dataKey="Health" fill={T.cyan} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>
      <div style={{ height: 8 }} />
      <Panel title="Robot table">
        <Table
          headers={["Robot", "Block", "Health", "Reliability", "Completion", "Battery"]}
          rows={ranked.shown.map((row) => ({
            key: row.robot.robot_no,
            cells: [
              <Link to={`/master-admin/robot-intelligence/robots/${row.robot.robot_no}`} style={link}>{row.robot.robot_no}</Link>,
              row.robot.block,
              row.score,
              `${row.reliability}%`,
              `${row.completion}%`,
              `${row.battery}%`,
            ],
          }))}
        />
      </Panel>
    </Shell>
  );
};

export default SiteHealth;
