export const smoothScroll = (element, target, duration = 400) => {
  const start = element.scrollLeft;
  const change = target - start;
  const startTime = performance.now();

  const animateScroll = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    element.scrollLeft = start + change * progress;

    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    }
  };

  requestAnimationFrame(animateScroll);
};
// ---------------------old phase -----------------------
// export const getRobotPhase = (pt, L, cleaning) => {
//   let phase,
//     badgeColor,
//     iconBorder,
//     segmentPct = 0;

//   // 🛑 Priority 1: Check for exceptional states first
//   if (cleaning.cleaning?.battery_dead) {
//     phase = "Battery Dead";
//     badgeColor = "danger";
//     iconBorder = "#dc3545";
//     segmentPct = pt / L;
//   } else if (cleaning.cleaning?.cleaning_cancelled) {
//     phase = "Cleaning Cancelled";
//     badgeColor = "danger";
//     iconBorder = "#6c757d";
//     segmentPct = pt / L;
//   }
//   // ✅ Normal flow conditions
//   else if (pt === 11) {
//     phase = "At Dock";
//     badgeColor = "success";
//     iconBorder = "#343a40";
//     segmentPct = 0;
//   } else if (pt === 40 && cleaning.cleaning?.finish) {
//     phase = "Cleaning Completed & At Dock";
//     badgeColor = "success";
//     iconBorder = "#000";
//     segmentPct = 0;
//   } else if (pt === 29) {
//     phase = "At Reverse Station";
//     badgeColor = "warning";
//     iconBorder = "#ffc107";
//     segmentPct = 1;
//   } else if (pt === 30) {
//     phase = "Ready for Reverse Cleaning";
//     badgeColor = "primary";
//     iconBorder = "#17a2b8";
//     segmentPct = 1;
//   } else if (pt >= 20 && pt <= 28) {
//     phase = "Forward Cleaning";
//     badgeColor = "success";
//     iconBorder = "#2eb85c";
//     segmentPct = (pt - 19) / (29 - 19);
//   } else if (pt >= 31 && pt <= 39) {
//     phase = "Reverse Cleaning";
//     badgeColor = "primary";
//     iconBorder = "#0d6efd";
//     segmentPct = (pt - 29) / (40 - 29);
//   } else if (pt === 40) {
//     phase = "At Dock";
//     badgeColor = "success";
//     iconBorder = "#343a40";
//     segmentPct = 0;
//   }
//   // Default fallback
//   else {
//     phase = "At Dock";
//     badgeColor = "secondary";
//     iconBorder = "#6c757d";
//     segmentPct = pt / L;
//   }

//   return { phase, badgeColor, iconBorder, segmentPct };
// };
// ----------------------old phase -----------------------

// ---------------------new phase -----------------------
// export const getRobotPhase = (pt, L, cleaning, trackDetails) => {
//   let phase,
//     badgeColor,
//     iconBorder,
//     segmentPct = 0;

//   // --- 1. Handle exceptional states ---
//   if (cleaning?.battery_dead && !cleaning.finish) {
//     return {
//       phase: "Battery Dead",
//       badgeColor: "danger",
//       iconBorder: "#dc3545",
//       segmentPct: pt / L,
//     };
//   } else if (cleaning?.battery_dead && cleaning.finish) {
//     return {
//       phase: "Battery Dead",
//       badgeColor: "danger",
//       iconBorder: "#dc3545",
//       segmentPct: 0,
//     };
//   } else if (pt !== 40 && cleaning.finish) {
//     return {
//       phase: "Cleaning Completed & At Dock",
//       badgeColor: "success",
//       iconBorder: "#dc3545",
//       segmentPct: 0,
//     };
//   } else if (cleaning?.cleaning_cancelled) {
//     return {
//       phase: "Cleaning Cancelled",
//       badgeColor: "danger",
//       iconBorder: "#6c757d",
//       segmentPct: pt / L,
//     };
//   }
//   // else if (!cleaning.cleaning?.start && !cleaning.cleaning?.finish) {
//   //   return {
//   //     phase: "At Dock",
//   //     badgeColor: "primary",
//   //     iconBorder: "#6c757d",
//   //     segmentPct: pt / L,
//   //   };
//   // }

//   // --- 2. Get last known continuous phase point ---
//   const points = trackDetails.map((t) => t.point).sort((a, b) => a - b);

//   let effectivePoint = pt;

//   if (points.length) {
//     const lastPoint = Math.max(...points);

//     // fill missing uplinks: if we missed some but reached further, use lastPoint
//     if (lastPoint > pt) {
//       effectivePoint = lastPoint;
//     }
//   }

//   // --- 3. Normal flow phase handling ---
//   if (effectivePoint === 11) {
//     phase = "At Dock";
//     badgeColor = "success";
//     iconBorder = "#343a40";
//     segmentPct = 0;
//   } else if (effectivePoint === 40 && cleaning?.finish) {
//     phase = "Cleaning Completed & At Dock";
//     badgeColor = "success";
//     iconBorder = "#000";
//     segmentPct = 0;
//   } else if (effectivePoint === 29) {
//     phase = "At Reverse Station";
//     badgeColor = "warning";
//     iconBorder = "#ffc107";
//     segmentPct = 1;
//   } else if (effectivePoint === 30) {
//     phase = "Ready for Reverse Cleaning";
//     badgeColor = "primary";
//     iconBorder = "#17a2b8";
//     segmentPct = 1;
//   } else if (effectivePoint >= 20 && effectivePoint <= 28) {
//     phase = "Forward Cleaning";
//     badgeColor = "success";
//     iconBorder = "#2eb85c";
//     segmentPct = (effectivePoint - 19) / (29 - 19);
//   } else if (effectivePoint >= 31 && effectivePoint <= 39) {
//     phase = "Reverse Cleaning";
//     badgeColor = "primary";
//     iconBorder = "#0d6efd";
//     segmentPct = (effectivePoint - 29) / (40 - 29);
//   } else if (effectivePoint === 40) {
//     phase = "At Dock";
//     badgeColor = "success";
//     iconBorder = "#343a40";
//     segmentPct = 0;
//   } else {
//     // default fallback
//     phase = "At Dock";
//     badgeColor = "primary";
//     iconBorder = "#6c757d";
//     segmentPct = pt / L;
//   }

//   return { phase, badgeColor, iconBorder, segmentPct, effectivePoint };
// };

// export const getRobotPhase = (pt, L, cleaning, trackDetails) => {
//   let phase,
//     badgeColor,
//     iconBorder,
//     segmentPct = 0;

//   const DS_POINT = 11;
//   const RS_POINT = 29;
//   const END_POINT = 40;

//   // --- 1. Determine effective point based on latest track data ---
//   const points = trackDetails.map((t) => t.point).sort((a, b) => a - b);
//   let effectivePoint = pt;

//   if (points.length) {
//     const lastPoint = Math.max(...points);
//     if (lastPoint > pt) effectivePoint = lastPoint;
//   }

//   // --- 🧭 2. Handle top priority: Cleaning finished ---
//   if (cleaning?.finish) {
//     phase = "Cleaning Completed & At Dock";
//     badgeColor = "success";
//     iconBorder = "#000";
//     segmentPct = 0; // Always consider robot back at DS
//     return { phase, badgeColor, iconBorder, segmentPct, effectivePoint };
//   }

//   // --- 3. Normal operation based on position ---
//   if (effectivePoint <= DS_POINT) {
//     phase = "At Dock";
//     badgeColor = "success";
//     iconBorder = "#343a40";
//     segmentPct = 0;
//   } else if (effectivePoint > DS_POINT && effectivePoint < RS_POINT) {
//     phase = "Forward Cleaning";
//     badgeColor = "success";
//     iconBorder = "#2eb85c";
//     segmentPct = (effectivePoint - DS_POINT) / (RS_POINT - DS_POINT);
//   } else if (effectivePoint === RS_POINT) {
//     phase = "At Reverse Station";
//     badgeColor = "warning";
//     iconBorder = "#ffc107";
//     segmentPct = 1;
//   } else if (effectivePoint > RS_POINT && effectivePoint <= END_POINT) {
//     phase = "Reverse Cleaning";
//     badgeColor = "primary";
//     iconBorder = "#0d6efd";
//     // Reverse path: 1 → 0 as it goes from RS → DS
//     segmentPct = 1 - (effectivePoint - RS_POINT) / (END_POINT - RS_POINT);
//   } else {
//     // fallback
//     phase = "At Dock";
//     badgeColor = "secondary";
//     iconBorder = "#6c757d";
//     segmentPct = 0;
//   }

//   // --- 4. Exceptional states ---
//   if (cleaning?.cleaning_cancelled) {
//     phase = "Cleaning Cancelled";
//     badgeColor = "danger";
//     iconBorder = "#6c757d";
//   } else if (cleaning?.battery_dead) {
//     phase = "Battery Dead";
//     badgeColor = "danger";
//     iconBorder = "#dc3545";
//   }

//   return { phase, badgeColor, iconBorder, segmentPct, effectivePoint };
// };

// --- Helper: Precompute percentage for each point ---
export const calculateSegmentPercentagesForRange = () => {
  const result = {};

  const FORWARD_START = 20;
  const FORWARD_END = 29;
  const REVERSE_START = 31;
  const REVERSE_END = 40;

  // --- Forward Cleaning (20 → 29) ---
  const forwardSteps = FORWARD_END - FORWARD_START;
  for (let point = FORWARD_START; point <= FORWARD_END; point++) {
    let pct;
    if (point <= FORWARD_START) pct = 0;
    else if (point >= FORWARD_END) pct = 1;
    else pct = (point - FORWARD_START) / forwardSteps;
    result[point] = parseFloat(pct.toFixed(1));
  }

  // --- Reverse Cleaning (31 → 40) ---
  const reverseSteps = REVERSE_END - REVERSE_START;
  for (let point = REVERSE_START; point <= REVERSE_END; point++) {
    // both 29 & 30 represent RS edge — fixed 1.0
    let pct;
    if (point === REVERSE_START) pct = 1.0;
    else pct = 1 - (point - REVERSE_START) / reverseSteps;
    result[point] = parseFloat(pct.toFixed(1));
  }

  // explicitly mark RS (29) & transition (30)
  result[29] = 1.0;
  result[30] = 1.0;

  return result;
};

// --- Main: Determine robot phase and segment percentage ---
export const getRobotPhase = (pt, L, cleaning, trackDetails) => {
  let phase, badgeColor, iconBorder;
  let segmentPct = 0;

  const DS_POINT = 11;
  const RS_POINT = 29;
  const END_POINT = 40;

  // Use the precomputed segment map
  const segmentMap = calculateSegmentPercentagesForRange(
    DS_POINT,
    RS_POINT,
    END_POINT
  );

  // --- Determine effective point based on latest track data ---
  const points = trackDetails.map((t) => t.point).sort((a, b) => a - b);
  let effectivePoint = pt;

  if (points.length) {
    const lastPoint = Math.max(...points);
    if (lastPoint > pt) effectivePoint = lastPoint;
  }

  // --- Cleaning Finished ---
  if (cleaning?.finish) {
    return {
      phase: "Cleaning Completed & At Dock",
      badgeColor: "success",
      iconBorder: "#000",
      segmentPct: 0,
      effectivePoint,
    };
  }

  // --- Determine Phase by Effective Point ---
  if (effectivePoint <= DS_POINT) {
    phase = "At Dock";
    badgeColor = "success";
    iconBorder = "#343a40";
  } else if (effectivePoint > DS_POINT && effectivePoint < RS_POINT) {
    phase = "Forward Cleaning";
    badgeColor = "success";
    iconBorder = "#2eb85c";
  } else if (effectivePoint === RS_POINT || effectivePoint === RS_POINT + 1) {
    phase = "At Reverse Station";
    badgeColor = "warning";
    iconBorder = "#ffc107";
  } else if (effectivePoint > RS_POINT && effectivePoint <= END_POINT) {
    phase = "Reverse Cleaning";
    badgeColor = "primary";
    iconBorder = "#0d6efd";
  } else {
    phase = "At Dock";
    badgeColor = "secondary";
    iconBorder = "#6c757d";
  }

  // --- Get Segment Percentage from Map ---
  segmentPct = segmentMap[effectivePoint] ?? 0;

  // --- Exceptional states ---
  if (cleaning?.cleaning_cancelled) {
    phase = "Cleaning Cancelled";
    badgeColor = "danger";
    iconBorder = "#6c757d";
  } else if (cleaning?.battery_dead) {
    phase = "Battery Dead";
    badgeColor = "danger";
    iconBorder = "#dc3545";
  }

  return { phase, badgeColor, iconBorder, segmentPct, effectivePoint };
};

// ---------------------new phase -----------------------

export const getCleaningPercentage = (pt, robot) => {
  let percentage = 0;
  let distance = 0;
  const totalSteps = 20;
  if (robot.cleaning.start && robot.cleaning.finish && pt !== 40) {
    distance = pt - 19;
    percentage = 100;
  } else if (pt >= 20 && pt <= 29) {
    distance = pt - 19;
    percentage = (distance / totalSteps) * 100;
  } else if (pt === 30) {
    distance = 10;
    percentage = (distance / totalSteps) * 100;
  } else if (pt >= 31 && pt <= 40) {
    distance = 10 + (pt - 30);
    percentage = (distance / totalSteps) * 100;
  }

  return {
    point: pt,
    distanceCovered: distance,
    totalDistance: totalSteps,
    percentage: Math.round(percentage),
  };
};
