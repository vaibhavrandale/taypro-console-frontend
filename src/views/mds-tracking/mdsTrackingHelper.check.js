/**
 * Self-check for MDS robot position math (no test framework).
 * Run: node src/views/mds-tracking/mdsTrackingHelper.check.js
 * (from taypro-console-frontend, after making helpers importable — or run via this inline copy)
 *
 * Mirrors calculateRobotPosition / resolveActiveMdsPosition logic.
 */

function calculateRobotPosition(row, activeRowNumber) {
  let robotPos = 0;
  let showRobotOnMds = false;

  if (row.row_no !== activeRowNumber) {
    return { robotPos, showRobotOnMds };
  }

  const track = row.track_details || [];
  const cleaning = row.cleaning || {};
  const currentPoint = Number(track[track.length - 1]?.point);
  const hasProgress =
    track.length > 0 && Number.isFinite(currentPoint) && currentPoint >= 20;

  if (!hasProgress || (cleaning.start && cleaning.finish)) {
    showRobotOnMds = true;
    robotPos = -75;
    return { robotPos, showRobotOnMds };
  }

  if (currentPoint <= 29) {
    robotPos = ((currentPoint - 20) / 9) * (row.row_length || 0);
  } else if (currentPoint <= 40) {
    robotPos =
      (row.row_length || 0) -
      ((currentPoint - 30) / 10) * (row.row_length || 0);
  } else {
    robotPos = 0;
  }

  if (!Number.isFinite(robotPos) || robotPos < 0) {
    showRobotOnMds = true;
    robotPos = -75;
  }

  return { robotPos, showRobotOnMds };
}

function resolveActiveMdsPosition(mds_positions = []) {
  const active = [...mds_positions].reverse().find((p) => p.active === true);
  if (active) return active;

  const releasedOpen = [...mds_positions]
    .reverse()
    .find((p) => p.robot_released && !p.robot_returned);
  if (releasedOpen) return releasedOpen;

  return (
    [...mds_positions].sort(
      (a, b) =>
        new Date(b.reached_at || 0) - new Date(a.reached_at || 0)
    )[0] || null
  );
}

function assert(name, cond) {
  if (!cond) throw new Error(`FAIL: ${name}`);
  console.log(`PASS: ${name}`);
}

// --- Cases matching mds.txt / screenshots ---

// Screenshot 2: row 3 with point 0 + start (robot was at -1444px before fix)
{
  const row3 = {
    row_no: 3,
    row_length: 130,
    cleaning: { start: true, finish: false },
    track_details: [{ point: 0 }],
  };
  const r = calculateRobotPosition(row3, 3);
  assert("point 0 shows robot on MDS", r.showRobotOnMds === true);
  assert("point 0 left is dock offset", r.robotPos === -75);
}

// Empty track at active row (just arrived / waiting for start)
{
  const r = calculateRobotPosition(
    { row_no: 1, row_length: 100, cleaning: {}, track_details: [] },
    1
  );
  assert("empty track on MDS", r.showRobotOnMds === true);
}

// Mid forward clean
{
  const r = calculateRobotPosition(
    {
      row_no: 1,
      row_length: 100,
      cleaning: { start: true, finish: false },
      track_details: [{ point: 25 }],
    },
    1
  );
  assert("point 25 mid-row", !r.showRobotOnMds && Math.abs(r.robotPos - (5 / 9) * 100) < 0.01);
}

// Reverse
{
  const r = calculateRobotPosition(
    {
      row_no: 2,
      row_length: 120,
      cleaning: { start: true, finish: false },
      track_details: [{ point: 35 }],
    },
    2
  );
  assert("point 35 reverse", !r.showRobotOnMds && Math.abs(r.robotPos - 60) < 0.01);
}

// Finished → on MDS
{
  const r = calculateRobotPosition(
    {
      row_no: 1,
      row_length: 100,
      cleaning: { start: true, finish: true },
      track_details: [{ point: 40 }],
    },
    1
  );
  assert("finished on MDS", r.showRobotOnMds === true);
}

// Wrong row → no position
{
  const r = calculateRobotPosition(
    { row_no: 2, row_length: 100, cleaning: {}, track_details: [{ point: 25 }] },
    1
  );
  assert("inactive row zeroed", r.robotPos === 0 && r.showRobotOnMds === false);
}

// Active position preferred over stale released
{
  const pos = resolveActiveMdsPosition([
    {
      row_number: 1,
      active: false,
      robot_released: true,
      robot_returned: false,
      reached_at: "2026-08-05T09:00:00Z",
    },
    {
      row_number: 3,
      active: true,
      robot_released: false,
      robot_returned: false,
      reached_at: "2026-08-05T10:00:00Z",
    },
  ]);
  assert("prefer active:true", pos.row_number === 3);
}

// No active: latest reached when no open release
{
  const pos = resolveActiveMdsPosition([
    {
      row_number: 2,
      active: false,
      robot_released: false,
      robot_returned: false,
      reached_at: "2026-08-05T10:58:00Z",
    },
    {
      row_number: 3,
      active: false,
      robot_released: false,
      robot_returned: false,
      reached_at: "2026-08-05T10:59:00Z",
    },
  ]);
  assert("latest reached_at when all inactive", pos.row_number === 3);
}

console.log("\nAll MDS helper checks passed.");
