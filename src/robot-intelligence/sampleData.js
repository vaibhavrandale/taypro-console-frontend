/** Sample fleet for the AI screens. Not production data. */

export const SAMPLE_NOTE =
  "Sample data in the frontend. Not live robots, and not a calibrated score.";

export const sites = [
  { site_id: "north_field", site_name: "North Field", client: "Sample Solar" },
  { site_id: "west_ridge", site_name: "West Ridge", client: "Sample Solar" },
  { site_id: "east_block", site_name: "East Block", client: "Sample Energy" },
];

export const robots = [
  { robot_no: "RB-1001", site_id: "north_field", block: "B-01", row_length: 540, battery: 86, brush: 3100, wheel: 2400, brush_high: false, wheel_high: false, communication: 94 },
  { robot_no: "RB-1002", site_id: "north_field", block: "B-02", row_length: 520, battery: 74, brush: 3300, wheel: 4100, brush_high: false, wheel_high: true, communication: 81 },
  { robot_no: "RB-1003", site_id: "north_field", block: "B-03", row_length: 560, battery: 91, brush: 3000, wheel: 2300, brush_high: false, wheel_high: false, communication: 96 },
  { robot_no: "RB-1004", site_id: "north_field", block: "B-04", row_length: 500, battery: 63, brush: 3600, wheel: 2500, brush_high: true, wheel_high: false, communication: 73 },
  { robot_no: "RB-2001", site_id: "west_ridge", block: "A-01", row_length: 480, battery: 88, brush: 2900, wheel: 2200, brush_high: false, wheel_high: false, communication: 90 },
  { robot_no: "RB-2002", site_id: "west_ridge", block: "A-02", row_length: 490, battery: 81, brush: 3050, wheel: 2350, brush_high: false, wheel_high: false, communication: 88 },
  { robot_no: "RB-2003", site_id: "west_ridge", block: "A-03", row_length: 510, battery: 69, brush: 3400, wheel: 2600, brush_high: true, wheel_high: false, communication: 70 },
  { robot_no: "RB-3001", site_id: "east_block", block: "C-01", row_length: 600, battery: 93, brush: 2800, wheel: 2100, brush_high: false, wheel_high: false, communication: 95 },
  { robot_no: "RB-3002", site_id: "east_block", block: "C-02", row_length: 580, battery: 77, brush: 3200, wheel: 2450, brush_high: false, wheel_high: false, communication: 84 },
  { robot_no: "RB-3003", site_id: "east_block", block: "C-03", row_length: 570, battery: 58, brush: 3700, wheel: 3900, brush_high: true, wheel_high: true, communication: 68 },
];

export function formatDuration(seconds) {
  if (seconds == null) return "—";
  const whole = Math.round(seconds);
  const minutes = Math.floor(whole / 60);
  const remain = whole % 60;
  return `${minutes}m ${String(remain).padStart(2, "0")}s`;
}

const cycle = (robot_no, day, finished, last_point, cancelled, battery_dead) => {
  const robot = robots.find((row) => row.robot_no === robot_no);
  const reported = finished;
  const forward = reported ? 1600 + (robot.row_length % 900) : null;
  const reverse = reported && last_point >= 40 ? forward - 50 : null;
  const zeroAverage = robot.brush_high || robot.wheel_high;
  return {
    robot_no,
    start_at: `2026-11-${day} 06:40`,
    finished,
    cancelled,
    battery_dead,
    last_point,
    battery_before: reported ? Math.min(100, robot.battery + 9) : null,
    battery_reverse: reported ? Math.min(100, robot.battery + 4) : null,
    battery_after: reported ? robot.battery : null,
    brush_avg: reported ? (zeroAverage ? 0 : Math.round(robot.brush * 0.62)) : null,
    wheel_avg: reported ? (zeroAverage ? 0 : Math.round(robot.wheel * 0.58)) : null,
    brush_max: reported ? robot.brush : null,
    wheel_max: reported ? robot.wheel : null,
    forward_time: forward,
    reverse_time: reverse,
    total_time: reported ? forward + (reverse || 0) : null,
    cycle_count: reported ? 100 + robots.indexOf(robot) * 12 + Number(day) : null,
  };
};

export const cycles = [
  cycle("RB-1001", "14", true, 40, false, false),
  cycle("RB-1001", "15", true, 40, false, false),
  cycle("RB-1001", "16", true, 36, false, false),
  cycle("RB-1002", "14", true, 28, false, false),
  cycle("RB-1002", "15", false, 22, true, false),
  cycle("RB-1002", "16", true, 31, false, false),
  cycle("RB-1003", "14", true, 40, false, false),
  cycle("RB-1003", "15", true, 40, false, false),
  cycle("RB-1003", "16", true, 40, false, false),
  cycle("RB-1004", "14", false, 12, false, true),
  cycle("RB-1004", "15", true, 30, false, false),
  cycle("RB-1004", "16", true, 27, false, false),
  cycle("RB-2001", "14", true, 40, false, false),
  cycle("RB-2001", "15", true, 38, false, false),
  cycle("RB-2001", "16", true, 40, false, false),
  cycle("RB-2002", "14", true, 40, false, false),
  cycle("RB-2002", "15", true, 35, false, false),
  cycle("RB-2002", "16", true, 40, false, false),
  cycle("RB-2003", "14", true, 24, false, false),
  cycle("RB-2003", "15", false, 18, true, false),
  cycle("RB-2003", "16", true, 26, false, false),
  cycle("RB-3001", "14", true, 40, false, false),
  cycle("RB-3001", "15", true, 40, false, false),
  cycle("RB-3001", "16", true, 40, false, false),
  cycle("RB-3002", "14", true, 33, false, false),
  cycle("RB-3002", "15", true, 40, false, false),
  cycle("RB-3002", "16", true, 29, false, false),
  cycle("RB-3003", "14", false, 8, false, true),
  cycle("RB-3003", "15", true, 20, false, false),
  cycle("RB-3003", "16", false, 15, true, false),
];

export const tickets = [
  { robot_no: "RB-1004", ticket_id: "ST-501", fault_type: "Wheel", opened_at: "2026-11-15", resolved: false },
  { robot_no: "RB-3003", ticket_id: "ST-508", fault_type: "Battery", opened_at: "2026-11-14", resolved: false },
];

export const notes = [
  {
    site_id: "north_field",
    date: "2026-11-16",
    comment: "B-04 robot stopped short. Wheel checked, no part replaced.",
  },
];

export function round1(value) {
  return Math.round(value * 10) / 10;
}

export function robotStats(robotNo) {
  const robot = robots.find((row) => row.robot_no === robotNo);
  if (!robot) return { robot: null };
  const rows = cycles.filter((row) => row.robot_no === robotNo);
  const reliability = (rows.filter((row) => !row.cancelled && !row.battery_dead).length / rows.length) * 100;
  const completion = (rows.filter((row) => row.finished && row.last_point >= 40).length / rows.length) * 100;
  const battery = robot.battery;
  return {
    robot,
    rows,
    reliability: round1(reliability),
    completion: round1(completion),
    battery,
    score: round1((reliability + completion + battery) / 3),
    tickets: tickets.filter((row) => row.robot_no === robotNo),
    note: notes.find((row) => row.site_id === robot.site_id) || null,
  };
}

export function siteStats(siteId) {
  const site = sites.find((row) => row.site_id === siteId);
  if (!site) return { site: null };
  const members = robots.filter((row) => row.site_id === siteId).map((row) => robotStats(row.robot_no));
  const score = round1(members.reduce((sum, row) => sum + row.score, 0) / members.length);
  const completion = round1(members.reduce((sum, row) => sum + row.completion, 0) / members.length);
  return { site, members, score, completion, watch: members.filter((row) => row.score < 70) };
}

export function fleet() {
  return sites.map((site) => siteStats(site.site_id));
}

const REST_MONTHS = [
  ["Jun", 88],
  ["Jul", 87],
  ["Aug", 86],
  ["Sep", 84],
  ["Oct", 82],
  ["Nov", 79],
];
const REST_TIMES = ["05:30", "09:15", "13:40", "18:05"];

const meanBattery = (rows) => Math.round(rows.reduce((sum, row) => sum + row.battery, 0) / rows.length);

export const restBattery = REST_MONTHS.map(([month, base]) => {
  const days = Array.from({ length: 16 }, (_, index) => {
    const day = index + 1;
    const log = robots.slice(0, 4).flatMap((robot, robotIndex) =>
      REST_TIMES.map((time, timeIndex) => ({
        time,
        robot_no: robot.robot_no,
        battery: Math.max(55, Math.min(100, base - robotIndex + ((day + timeIndex) % 3) - 1)),
      })),
    );
    return { day: `${day} ${month}`, average: meanBattery(log), log };
  });
  return {
    month,
    average: meanBattery(days.map((row) => ({ battery: row.average }))),
    days,
  };
});

export function motorHistory(robotNo) {
  const robot = robots.find((row) => row.robot_no === robotNo);
  if (!robot) return null;
  const days = Array.from({ length: 30 }, (_, index) => {
    const day = index + 1;
    const brushMax = robot.brush + ((day % 5) - 2) * 40;
    const wheelMax = robot.wheel + ((day % 4) - 1) * 50;
    const quietAverage = (robot.brush_high || robot.wheel_high) && day % 7 === 0;
    return {
      day: `${day} Nov`,
      finished: true,
      last_point: 40,
      battery_before: Math.min(100, robot.battery + 9),
      battery_reverse: Math.min(100, robot.battery + 4),
      battery_after: robot.battery,
      total_time: 1600 + (day % 6) * 90,
      cycle_count: 120 + day,
      brush_avg: quietAverage ? 0 : Math.round(brushMax * 0.62),
      brush_max: brushMax,
      wheel_avg: quietAverage ? 0 : Math.round(wheelMax * 0.58),
      wheel_max: wheelMax,
    };
  });
  const mean = (pick) => Math.round(days.reduce((sum, row) => sum + pick(row), 0) / days.length);
  return { robot, month: "Nov", days, brush: mean((row) => row.brush_max), wheel: mean((row) => row.wheel_max) };
}

export function latestPass(robotNo) {
  const rows = cycles.filter((row) => row.robot_no === robotNo && row.battery_after != null);
  return rows.length ? rows[rows.length - 1] : null;
}

export const blocks = [
  ["B-01", "Priority 1", "Available"],
  ["B-02", "Priority 1", "Available"],
  ["B-03", "Priority 2", "Available"],
  ["B-04", "Weather hold", "Unavailable"],
  ["B-05", "Low", "Available"],
  ["B-06", "Priority 2", "Available"],
  ["B-07", "Priority 1", "Available"],
  ["B-08", "Low", "Available"],
  ["B-09", "Priority 2", "Available"],
  ["B-10", "Low", "Available"],
  ["B-11", "Weather hold", "Unavailable"],
  ["B-12", "Weather hold", "Unavailable"],
  ["B-13", "Priority 2", "Available"],
  ["B-14", "Low", "Available"],
  ["B-15", "Low", "Available"],
  ["B-16", "Low", "Available"],
  ["B-17", "Priority 2", "Available"],
  ["B-18", "Low", "Available"],
  ["B-19", "Priority 1", "Available"],
  ["B-20", "Priority 2", "Available"],
  ["B-21", "Low", "Available"],
  ["B-22", "Low", "Available"],
  ["B-23", "Priority 1", "Unavailable"],
  ["B-24", "Low", "Available"],
].map(([block, priority, state]) => ({ block, priority, state }));

export function attention(robot, stats) {
  const flags = [];
  if (robot.brush_high || robot.wheel_high) flags.push("Motor");
  if (stats.battery < 70) flags.push("Battery");
  if (stats.completion < 40) flags.push("Cleaning gap");
  return flags;
}

export function motorScore(robot) {
  if (robot.brush_high && robot.wheel_high) return 52;
  if (robot.brush_high || robot.wheel_high) return 70;
  return 100;
}

export const SHOW = 8;

export function windowOf(list, count = SHOW) {
  return { shown: list.slice(0, count), total: list.length };
}

export function underperforming() {
  return robots
    .map((robot) => {
      const stats = robotStats(robot.robot_no);
      const site = sites.find((row) => row.site_id === robot.site_id);
      return {
        robot_no: robot.robot_no,
        site: site.site_name,
        score: stats.score,
        flags: attention(robot, stats),
      };
    })
    .filter((row) => row.flags.length || row.score < 75)
    .sort((a, b) => a.score - b.score);
}

export function fleetSummary() {
  const rows = fleet();
  const members = rows.flatMap((row) => row.members);
  const mean = (list, pick) => round1(list.reduce((sum, row) => sum + pick(row), 0) / list.length);
  const passes = members.flatMap((row) => row.rows);
  const broken = passes.filter((row) => row.cancelled || row.battery_dead).length;
  const utilized = members.filter((row) => row.rows.some((cycleRow) => cycleRow.finished && cycleRow.last_point >= 40)).length;
  return {
    rows,
    members,
    health: mean(rows, (row) => row.score),
    completion: mean(rows, (row) => row.completion),
    battery: mean(members, (row) => row.battery),
    utilization: round1((utilized / members.length) * 100),
    breakdown: round1((broken / passes.length) * 100),
    watch: underperforming(),
  };
}

export function recommendations() {
  return robots
    .map((robot) => ({ robot, stats: robotStats(robot.robot_no) }))
    .filter((row) => row.stats.score < 75 || row.robot.brush_high || row.robot.wheel_high)
    .map((row) => ({
      robot_no: row.robot.robot_no,
      site_id: row.robot.site_id,
      score: row.stats.score,
      text: row.robot.wheel_high || row.robot.brush_high
        ? "Motor current is above this robot's usual range. Inspect on the next visit."
        : "Cleaning completion is low. Check why the pass stops before the end of the row.",
    }))
    .sort((a, b) => a.score - b.score);
}
