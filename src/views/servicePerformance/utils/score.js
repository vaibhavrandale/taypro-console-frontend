import { humanize } from "./format";

const COUNTED = new Set(["eligible", "zeroed"]);

/** Completeness is eligible positive weight over configured positive weight. */
export function scoreSummary(score) {
  const kpis = score?.kpis || [];
  const weighted = kpis.filter((kpi) => kpi.status !== "disabled" && Number(kpi.weight) > 0);
  const configuredWeight = weighted.reduce((sum, kpi) => sum + Number(kpi.weight), 0);
  const eligibleWeight = weighted.filter((kpi) => COUNTED.has(kpi.status)).reduce((sum, kpi) => sum + Number(kpi.weight), 0);
  const completeness = configuredWeight > 0 ? (eligibleWeight / configuredWeight) * 100 : null;
  return {
    overall: score?.overall_score ?? null,
    eligible: weighted.filter((kpi) => COUNTED.has(kpi.status)).length,
    total: weighted.length,
    excluded: weighted.filter((kpi) => kpi.status === "excluded").length,
    configuredWeight,
    eligibleWeight,
    completeness,
    provisional: score?.overall_score == null || completeness == null || completeness < 100,
  };
}

/** One line per category explaining why data is missing, from the report. */
function categoryReason(key, report, config) {
  if (!report) return "";
  if (key === "service_tickets") {
    const sla = report.service_tickets?.sla || {};
    if (!sla.eligible) return `missing_data: no resolved ticket with a fault target_days${sla.target_missing ? ` (${sla.target_missing} without a target)` : ""}`;
    return `${sla.met} of ${sla.eligible} resolved within target`;
  }
  if (key === "client_tickets") {
    if (config?.client_ticket_sla_days == null) return "not_configured: client_ticket_sla_days is not set";
    const sla = report.client_tickets?.sla || {};
    return sla.eligible ? `${sla.met} of ${sla.eligible} resolved within ${config.client_ticket_sla_days} d` : "missing_data: no resolved client ticket";
  }
  if (key === "uptime") {
    const missing = report.uptime?.missing_sites?.length || 0;
    if (report.uptime?.status !== "available") return "missing_data: no uptime report for this period";
    return missing ? `data_incomplete: ${missing} site${missing === 1 ? "" : "s"} have no report` : "All sites reported";
  }
  if (key === "preventive_maintenance") return "informational: PM has no schedule, so on-time is unavailable";
  if (key === "material_requests") {
    const m = report.materials || {};
    if (m.on_time_percent == null) return "missing_data: no open request to age";
    return `${m.delayed_beyond_threshold ?? 0} of ${m.awaiting_dispatch ?? 0} open requests past ${m.threshold_days} d`;
  }
  if (key === "consumption") {
    const c = report.consumption || {};
    if (c.status !== "available") return `missing_data: ${c.reason || "no parts recorded"}`;
    return `${c.matched} of ${c.expected} replaced parts have a ledger row`;
  }
  return "";
}

/**
 * Category cards from the active configuration and the report's KPI rows.
 * Category weight is the sum of its KPI weights; the category score is the
 * weighted mean of its counted KPIs.
 */
export function categoryCards(config, report) {
  const rows = new Map((report?.score?.kpis || []).map((kpi) => [kpi.key, kpi]));
  return (config?.categories || []).map((category) => {
    const kpis = (config.kpis || []).filter((kpi) => kpi.category === category.key);
    const scored = kpis.map((kpi) => ({ ...kpi, row: rows.get(kpi.key) })).filter((kpi) => kpi.row);
    const positive = scored.filter((kpi) => kpi.row.status !== "disabled" && Number(kpi.row.weight) > 0);
    const counted = positive.filter((kpi) => COUNTED.has(kpi.row.status));
    const weight = positive.reduce((sum, kpi) => sum + Number(kpi.row.weight), 0);
    const countedWeight = counted.reduce((sum, kpi) => sum + Number(kpi.row.weight), 0);
    const score = countedWeight > 0 ? counted.reduce((sum, kpi) => sum + Number(kpi.row.score) * Number(kpi.row.weight), 0) / countedWeight : null;
    let state = "excluded";
    if (category.enabled === false || !scored.length) state = "excluded";
    else if (!positive.length) state = "informational";
    else if (counted.length === positive.length) state = "eligible";
    else if (counted.length) state = "partial";
    return {
      key: category.key,
      name: category.label || humanize(category.key),
      weight,
      score,
      state,
      kpiCount: kpis.length,
      reason: categoryReason(category.key, report, config),
    };
  });
}

/** Score of one KPI from a report, or null. */
export function kpiScore(report, key) {
  const row = (report?.score?.kpis || []).find((kpi) => kpi.key === key);
  return row && COUNTED.has(row.status) ? row.score : null;
}

export function weightTotal(rows) {
  return rows.reduce((sum, row) => sum + (Number(row.weight) || 0), 0);
}

export function weightsValid(rows) {
  if (!rows.length) return false;
  if (rows.some((row) => !Number.isFinite(Number(row.weight)) || row.weight < 0 || row.weight > 100)) return false;
  return Math.abs(weightTotal(rows) - 100) < 0.001;
}
