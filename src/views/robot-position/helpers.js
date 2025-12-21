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
// ----------------------------new phase-----------------------

export const getRobotPhase = (pt, L, cleaning, trackDetails, robotCreatedAt = null) => {
  let phase,
    badgeColor,
    iconBorder,
    segmentPct = 0;

  // ✅ Check if cleaning finished on a previous day
  const isFinishedYesterdayOrEarlier = () => {
    if (!cleaning?.finish || !cleaning?.finishAt) {
      return false;
    }
    
    try {
      const finishDate = new Date(cleaning.finishAt);
      if (isNaN(finishDate.getTime())) {
        return false; // Invalid date
      }
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const finishDateOnly = new Date(finishDate);
      finishDateOnly.setHours(0, 0, 0, 0);
      
      // If finish date is before today, it was finished yesterday or earlier
      const isPreviousDay = finishDateOnly.getTime() < today.getTime();
      
      // Debug log (remove after testing)
      if (isPreviousDay) {
        console.log(`✅ Cleaning finished on previous day: finishAt=${finishDateOnly.toISOString()}, today=${today.toISOString()}`);
      }
      
      return isPreviousDay;
    } catch (e) {
      console.error("Error checking finish date:", e);
      return false;
    }
  };

  // ✅ If cleaning finished yesterday or earlier, treat as "not started today"
  // Check if finishAt is from a previous day (regardless of start status, as start might still be true from yesterday)
  const isFinishedFromPreviousDay = cleaning?.finish && isFinishedYesterdayOrEarlier();

  // --- Determine last effective point (latest progress) ---
  const points = trackDetails.map((t) => t.point).sort((a, b) => a - b);
  let effectivePoint = pt;
  if (points.length) {
    const lastPoint = Math.max(...points);
    if (lastPoint > pt) effectivePoint = lastPoint;
  }

  // --- Handle exceptional states ---
  if (cleaning?.battery_dead && !cleaning.finish) {
    return {
      phase: "Battery Dead",
      badgeColor: "danger",
      iconBorder: "#dc3545",
      segmentPct:
        effectivePoint >= 20 && effectivePoint <= 29
          ? (effectivePoint - 19) / (29 - 19) // forward
          : effectivePoint >= 31 && effectivePoint <= 40
          ? (effectivePoint - 29) / (40 - 29) // reverse
          : 0,
      effectivePoint,
    };
  } else if (cleaning?.battery_dead && cleaning.finish) {
    return {
      phase: "Battery Dead",
      badgeColor: "danger",
      iconBorder: "#dc3545",
      segmentPct: 0,
      effectivePoint,
    };
  } else if (
    effectivePoint === 40 &&
    (cleaning?.cleaning_cancelled || cleaning?.battery_dead)
  ) {
    // ✅ If finished yesterday or earlier, show "At Dock" instead
    if (isFinishedFromPreviousDay) {
      phase = "At Dock";
      badgeColor = "secondary";
      iconBorder = "#6c757d";
      segmentPct = 0;
    } else {
      phase = "Cleaning Completed & At Dock";
      badgeColor = "success";
      iconBorder = "#000";
      segmentPct = 0;
    }
  } else if (cleaning?.cleaning_cancelled) {
    return {
      phase: "Cleaning Cancelled",
      badgeColor: "warning",
      iconBorder: "#6c757d",
      segmentPct:
        effectivePoint >= 20 && effectivePoint <= 29
          ? (effectivePoint - 19) / (29 - 19) // forward
          : effectivePoint >= 31 && effectivePoint <= 40
          ? (effectivePoint - 29) / (40 - 29) // reverse
          : 0,
      effectivePoint,
    };
  } else if (effectivePoint !== 40 && cleaning.finish) {
    // ✅ If finished yesterday or earlier, show "At Dock" instead
    if (isFinishedFromPreviousDay) {
      return {
        phase: "At Dock",
        badgeColor: "secondary",
        iconBorder: "#6c757d",
        segmentPct: 0,
        effectivePoint,
      };
    }
    return {
      phase: "Cleaning Completed & At Dock",
      badgeColor: "success",
      iconBorder: "#198754",
      segmentPct: 0,
      effectivePoint,
    };
  }

  // --- Normal phase handling ---
  if (effectivePoint === 11) {
    phase = "At Dock";
    badgeColor = "success";
    iconBorder = "#343a40";
    segmentPct = 0;
  } else if (effectivePoint === 40 && cleaning?.finish) {
    // ✅ If finished yesterday or earlier, show "At Dock" instead
    if (isFinishedFromPreviousDay) {
      phase = "At Dock";
      badgeColor = "secondary";
      iconBorder = "#6c757d";
      segmentPct = 0;
    } else {
      phase = "Cleaning Completed & At Dock";
      badgeColor = "success";
      iconBorder = "#000";
      segmentPct = 0;
    }
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
    phase = "At Dock";
    badgeColor = "secondary";
    iconBorder = "#6c757d";
    segmentPct = pt / L;
  }

  return { phase, badgeColor, iconBorder, segmentPct, effectivePoint };
};

export const getCleaningPercentage = (pt, robot) => {
  let percentage = 0;
  let distance = 0;
  const totalSteps = 20;
  
  // ✅ If cleaning is finished (uplink 16 or metrics received), always return 100%
  if (robot.cleaning?.finish === true) {
    return {
      point: pt,
      distanceCovered: totalSteps,
      totalDistance: totalSteps,
      percentage: 100,
    };
  }
  
  // ✅ Find highest point from track_details (19-40) instead of using last point
  let highestPoint = pt;
  if (robot.track_details && robot.track_details.length > 0) {
    const validPoints = robot.track_details
      .map((td) => td.point)
      .filter((p) => p >= 19 && p <= 40);
    if (validPoints.length > 0) {
      highestPoint = Math.max(...validPoints);
    }
  }
  
  // Use highest point for calculation
  if (highestPoint >= 20 && highestPoint <= 29) {
    distance = highestPoint - 19;
    percentage = (distance / totalSteps) * 100;
  } else if (highestPoint === 30) {
    distance = 10;
    percentage = (distance / totalSteps) * 100;
  } else if (highestPoint >= 31 && highestPoint <= 39) {
    distance = 10 + (highestPoint - 30);
    percentage = (distance / totalSteps) * 100;
  } else if (highestPoint === 40) {
    // ✅ Point 40 should show 99% (not 100%) unless cleaning is finished
    // Cleaning finished is handled above, so if we reach here, cleaning is not finished
    distance = 10 + (40 - 30); // = 20
    percentage = 99; // Cap at 99% for point 40 when not finished
  }

  return {
    point: highestPoint,
    distanceCovered: distance,
    totalDistance: totalSteps,
    percentage: Math.round(percentage),
  };
};
