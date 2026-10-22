// One cycle is 100m out and 100m back, split into 20 parts:
// forward 20–29 (dock → reverse station), reverse 31–40 (back to the dock).
// Point 30 stays at the reverse station and adds no distance.
// 2P: each part along the row is two modules under the brush.
const PARTS = 10;
const DEFAULT_PITCH_M = 1.2;
const DEFAULT_ACROSS = 2;

export function passSegments(trackDetails = [], cleaning = {}) {
  if (cleaning?.finish === true) {
    return { forward: PARTS, reverse: PARTS, highestPoint: null };
  }

  const points = trackDetails
    .map((t) => Number(t.point ?? t.data))
    .filter((p) => Number.isFinite(p) && p >= 20 && p <= 40);
  const highestPoint = points.length ? Math.max(...points) : 0;

  let forward = 0;
  let reverse = 0;
  if (highestPoint >= 20 && highestPoint <= 29) forward = highestPoint - 19;
  else if (highestPoint >= 30) forward = PARTS;

  if (highestPoint >= 31 && highestPoint <= 40) reverse = highestPoint - 30;

  return { forward, reverse, highestPoint };
}

export function modulesCleanedByRobot({
  row_length,
  module_counts,
  module_width = DEFAULT_PITCH_M,
  across = DEFAULT_ACROSS,
  track_details,
  cleaning,
}) {
  const rowLength = Number(row_length) || 0;
  const pitch = Number(module_width) > 0 ? Number(module_width) : DEFAULT_PITCH_M;
  const sideBySide = Number(across) > 0 ? Number(across) : DEFAULT_ACROSS;
  const assigned = Number(module_counts) || 0;
  const { forward, reverse, highestPoint } = passSegments(track_details, cleaning);

  // ponytail: pitch ignores the gap between modules, so a long row over-counts. Add the gap to the pitch when a site stores it.
  const positions =
    assigned > 0
      ? Math.ceil(assigned / sideBySide)
      : pitch > 0
        ? Math.round(rowLength / pitch)
        : 0;
  const columns = [];
  for (let i = 0; i < positions; i++) {
    const seg = Math.min(PARTS - 1, Math.floor((i * PARTS) / positions));
    const cleanedForward = seg < forward;
    const cleanedReverse = reverse > 0 && seg >= PARTS - reverse;
    const state =
      cleanedForward && cleanedReverse
        ? "both"
        : cleanedForward || cleanedReverse
          ? "one"
          : "none";
    columns.push({ state, forward: cleanedForward, reverse: cleanedReverse });
  }

  const count = (pick) => columns.filter(pick).length * sideBySide;
  const forwardCount = count((col) => col.forward);
  const reverseCount = count((col) => col.reverse);
  const bothCount = count((col) => col.forward && col.reverse);
  const moduleCounts = assigned > 0 ? assigned : positions * sideBySide;

  return {
    highestPoint,
    forwardSegments: forward,
    reverseSegments: reverse,
    row_length: rowLength,
    across: sideBySide,
    module_width: pitch,
    module_counts: moduleCounts,
    forwardCount,
    reverseCount,
    bothCount,
    forwardOnlyCount: forwardCount - bothCount,
    doubleRemaining: Math.max(0, moduleCounts - bothCount),
    percentage: Math.round(((forward + reverse) / (PARTS * 2)) * 100),
    completed: count((col) => col.state !== "none"),
    remaining: moduleCounts - count((col) => col.state !== "none"),
    columns,
  };
}
