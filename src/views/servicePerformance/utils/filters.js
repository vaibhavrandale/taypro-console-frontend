export const SERVICE_STATUSES = ["open", "resolved"];
export const CLIENT_STATUSES = ["Open", "In Progress", "Resolved", "Closed"];
const DAY_MS = 24 * 60 * 60 * 1000;
const IST_MS = (5 * 60 + 30) * 60 * 1000;
const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;

export function currentIstMonth(now = new Date()) {
  const ist = new Date(now.getTime() + IST_MS);
  return { month: ist.getUTCMonth() + 1, year: ist.getUTCFullYear() };
}

const int = (value) => (/^\d+$/.test(String(value ?? "")) ? Number(value) : null);

/**
 * Reads and validates filters from the URL. Invalid values are dropped and
 * reported in `errors` so the API is never sent something it will reject.
 */
export function readFilters(search, now = new Date()) {
  const get = (key) => (search.get(key) || "").trim();
  const errors = [];
  const fallback = currentIstMonth(now);
  const filters = { mode: "month", ...fallback, from: "", to: "", site_id: "", fault_type: "", status: "", client_status: "", engineer_id: "" };

  if (get("from") || get("to")) {
    const from = get("from");
    const to = get("to");
    const span = (Date.parse(to) - Date.parse(from)) / DAY_MS;
    const fromBad = !ISO_DAY.test(from) || Number.isNaN(Date.parse(from));
    const toBad = !ISO_DAY.test(to) || Number.isNaN(Date.parse(to));
    if (fromBad) errors.push(`Start date "${from}" is not a valid YYYY-MM-DD date.`);
    if (toBad) errors.push(`End date "${to}" is not a valid YYYY-MM-DD date.`);
    if (!fromBad && !toBad) {
      if (span < 0) errors.push(`End date ${to} is before start date ${from}.`);
      else if (span > 366) errors.push(`Date range ${from} to ${to} is ${Math.round(span)} days; the maximum is 366.`);
      else Object.assign(filters, { mode: "range", from, to });
    }
  } else if (get("month") || get("year")) {
    const month = int(get("month"));
    const year = int(get("year"));
    const monthBad = !month || month < 1 || month > 12;
    const yearBad = !year || year < 2000 || year > 2100;
    if (monthBad) errors.push(`Month "${get("month")}" is invalid; use 1 to 12.`);
    if (yearBad) errors.push(`Year "${get("year")}" is invalid; use 2000 to 2100.`);
    if (!monthBad && !yearBad) Object.assign(filters, { month, year });
  }

  filters.site_id = get("site_id");
  filters.fault_type = get("fault_type");
  filters.engineer_id = /^[a-f0-9]{24}$/i.test(get("engineer_id")) ? get("engineer_id") : "";
  if (get("engineer_id") && !filters.engineer_id) errors.push(`Engineer id "${get("engineer_id")}" is not a valid 24-character id.`);
  const status = get("status");
  if (status && !SERVICE_STATUSES.includes(status)) errors.push(`Service status "${status}" is not one of: ${SERVICE_STATUSES.join(", ")}.`);
  else filters.status = status;
  const clientStatus = get("client_status");
  if (clientStatus && !CLIENT_STATUSES.includes(clientStatus)) errors.push(`Client status "${clientStatus}" is not one of: ${CLIENT_STATUSES.join(", ")}.`);
  else filters.client_status = clientStatus;

  return { ...filters, errors };
}

export function writeFilters(filters) {
  const params = new URLSearchParams();
  if (filters.mode === "range") {
    params.set("from", filters.from);
    params.set("to", filters.to);
  } else {
    params.set("month", String(filters.month));
    params.set("year", String(filters.year));
  }
  for (const key of ["site_id", "fault_type", "status", "client_status", "engineer_id"]) {
    if (filters[key]) params.set(key, filters[key]);
  }
  return params;
}

/** Filters other than the period, as API params. */
export function scopeParams(filters) {
  const params = {};
  for (const key of ["site_id", "fault_type", "status", "client_status", "engineer_id"]) {
    if (filters[key]) params[key] = filters[key];
  }
  return params;
}

export function apiParams(filters) {
  const period = filters.mode === "range" ? { from: filters.from, to: filters.to } : { month: filters.month, year: filters.year };
  return { ...period, ...scopeParams(filters) };
}

/** The six months ending at the period's last month, oldest first. */
export function lastSixMonths(filters) {
  let year = filters.year;
  let month = filters.month;
  if (filters.mode === "range") {
    const end = new Date(`${filters.to}T00:00:00Z`);
    year = end.getUTCFullYear();
    month = end.getUTCMonth() + 1;
  }
  const out = [];
  for (let i = 5; i >= 0; i -= 1) {
    const index = year * 12 + (month - 1) - i;
    const y = Math.floor(index / 12);
    const m = (index % 12) + 1;
    out.push({ year: y, month: m, label: `${y}-${String(m).padStart(2, "0")}` });
  }
  return out;
}

export function periodText(filters) {
  if (filters.mode === "range") return `${filters.from} to ${filters.to}`;
  return new Date(Date.UTC(filters.year, filters.month - 1, 1)).toLocaleDateString(undefined, { month: "long", year: "numeric", timeZone: "UTC" });
}
