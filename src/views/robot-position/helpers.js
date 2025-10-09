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
export const getRobotPhase = (pt, L, cleaning, trackDetails) => {
  let phase,
    badgeColor,
    iconBorder,
    segmentPct = 0;

  // --- 1. Handle exceptional states ---
  if (cleaning.cleaning?.battery_dead) {
    return {
      phase: "Battery Dead",
      badgeColor: "danger",
      iconBorder: "#dc3545",
      segmentPct: pt / L,
    };
  } else if (cleaning.cleaning?.cleaning_cancelled) {
    return {
      phase: "Cleaning Cancelled",
      badgeColor: "danger",
      iconBorder: "#6c757d",
      segmentPct: pt / L,
    };
  }

  // --- 2. Get last known continuous phase point ---
  const points = trackDetails.map((t) => t.point).sort((a, b) => a - b);

  let effectivePoint = pt;

  if (points.length) {
    const lastPoint = Math.max(...points);

    // fill missing uplinks: if we missed some but reached further, use lastPoint
    if (lastPoint > pt) {
      effectivePoint = lastPoint;
    }
  }

  // --- 3. Normal flow phase handling ---
  if (effectivePoint === 11) {
    phase = "At Dock";
    badgeColor = "success";
    iconBorder = "#343a40";
    segmentPct = 0;
  } else if (effectivePoint === 40 && cleaning.cleaning?.finish) {
    phase = "Cleaning Completed & At Dock";
    badgeColor = "success";
    iconBorder = "#000";
    segmentPct = 0;
  } else if (effectivePoint === 29) {
    phase = "At Reverse Station";
    badgeColor = "warning";
    iconBorder = "#ffc107";
    segmentPct = 1;
  } else if (effectivePoint === 30) {
    phase = "Ready for Reverse Cleaning";
    badgeColor = "primary";
    iconBorder = "#17a2b8";
    segmentPct = 1;
  } else if (effectivePoint >= 20 && effectivePoint <= 28) {
    phase = "Forward Cleaning";
    badgeColor = "success";
    iconBorder = "#2eb85c";
    segmentPct = (effectivePoint - 19) / (29 - 19);
  } else if (effectivePoint >= 31 && effectivePoint <= 39) {
    phase = "Reverse Cleaning";
    badgeColor = "primary";
    iconBorder = "#0d6efd";
    segmentPct = (effectivePoint - 29) / (40 - 29);
  } else if (effectivePoint === 40) {
    phase = "At Dock";
    badgeColor = "success";
    iconBorder = "#343a40";
    segmentPct = 0;
  } else {
    // default fallback
    phase = "At Dock";
    badgeColor = "primary";
    iconBorder = "#6c757d";
    segmentPct = pt / L;
  }

  return { phase, badgeColor, iconBorder, segmentPct, effectivePoint };
};
// ---------------------new phase -----------------------

export const getCleaningPercentage = (pt) => {
  let percentage = 0;
  let distance = 0;
  const totalSteps = 20;

  if (pt >= 20 && pt <= 29) {
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
