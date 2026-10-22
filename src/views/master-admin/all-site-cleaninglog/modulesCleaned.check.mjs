import { modulesCleanedByRobot } from "./modulesCleaned.mjs";

const full = modulesCleanedByRobot({
  row_length: 100,
  module_width: 1.2,
  across: 2,
  track_details: [{ point: 40 }],
  cleaning: { finish: true },
});
if (full.percentage !== 100 || full.doubleRemaining !== 0 || full.module_counts !== 166 || full.forwardCount !== 166 || full.reverseCount !== 166)
  throw new Error(`full ${JSON.stringify(full)}`);
if (full.columns.some((col) => col.state !== "both"))
  throw new Error("full row should be dark green");

const out = modulesCleanedByRobot({
  row_length: 100,
  track_details: [{ point: 25 }],
  cleaning: { finish: false },
});
if (out.percentage !== 30 || out.doubleRemaining !== 166 || out.forwardCount !== 100 || out.reverseCount !== 0 || out.bothCount !== 0)
  throw new Error(`forward ${out.forwardCount}`);
if (out.columns[0].state !== "one" || out.columns.at(-1).state !== "none")
  throw new Error("forward paint should start at the dock");

const back = modulesCleanedByRobot({
  row_length: 100,
  track_details: [{ point: 29 }, { point: 30 }, { point: 35 }],
  cleaning: { finish: false },
});
if (back.forwardCount !== 166 || back.reverseCount !== 82 || back.bothCount !== 82)
  throw new Error(`reverse ${back.forwardCount}/${back.reverseCount}`);
if (back.columns[0].state !== "one" || back.columns.at(-1).state !== "both")
  throw new Error("reverse paint should start at the reverse station");

const assigned = modulesCleanedByRobot({
  row_length: 100,
  module_counts: 952,
  across: 2,
  track_details: [{ point: 25 }],
  cleaning: { finish: false },
});
if (assigned.module_counts !== 952 || assigned.forwardCount !== 572 || assigned.reverseCount !== 0)
  throw new Error(`assigned ${assigned.module_counts}/${assigned.forwardCount}`);

console.log("modulesCleaned ok");
