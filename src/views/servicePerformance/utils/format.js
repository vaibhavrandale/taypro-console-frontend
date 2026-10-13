export const TZ = "Asia/Kolkata";
export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function isMissing(value) {
  return value == null || value === "" || Number.isNaN(Number(value));
}

export function pct(value, missing = "—") {
  return isMissing(value) ? missing : `${Number(value).toFixed(1)}%`;
}

export function num(value, digits = 1, missing = "—") {
  return isMissing(value) ? missing : Number(value).toFixed(digits);
}

export function count(value, missing = "—") {
  return value == null ? missing : String(value);
}

/** Durations arrive in days. Under a day is shown in hours. */
export function duration(days, missing = "—") {
  if (isMissing(days)) return missing;
  const d = Number(days);
  return d < 1 ? `${(d * 24).toFixed(1)} h` : `${d.toFixed(1)} d`;
}

export function dateTime(value, timeZone = TZ) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString(undefined, { timeZone, dateStyle: "medium", timeStyle: "short" });
}

export function day(value, timeZone = TZ) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, { timeZone, dateStyle: "medium" });
}

export function monthLabel(label) {
  const [year, month] = String(label || "").split("-").map(Number);
  return MONTHS[month - 1] ? `${MONTHS[month - 1]} ${year}` : String(label || "");
}

export function humanize(code) {
  if (!code) return "—";
  const text = String(code).replaceAll("_", " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function downloadCsv(filename, rows) {
  const escape = (cell) => {
    const text = cell == null ? "" : String(cell);
    return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
  };
  const csv = rows.map((row) => row.map(escape).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
