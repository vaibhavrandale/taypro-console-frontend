export const QUIZ_AUDIENCE_ROLE_OPTIONS = [
  "Site Technician",
  "Client Site Technician",
  "Opex Site Technician",
  "Service User",
  "Project User",
  "Master User",
  "Client Admin",
  "Opex Client Admin",
];

export const QUESTION_TYPE_OPTIONS = [
  { value: "MCQ_SINGLE", label: "MCQ — Single" },
  { value: "MCQ_MULTI", label: "MCQ — Multiple" },
  { value: "INPUT", label: "Input" },
  { value: "IMAGE_UPLOAD", label: "Image upload" },
  { value: "FILE_UPLOAD", label: "File upload" },
  { value: "VIDEO_RECORD", label: "Video record" },
];

const pad2 = (n) => String(n).padStart(2, "0");

/** Fill datetime-local using browser local timezone (IST on your PC). */
export function toDatetimeLocalValue(date) {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

/** datetime-local → ISO UTC for API (input treated as local time). */
export function fromDatetimeLocalValue(localStr) {
  if (!localStr) return null;
  const d = new Date(localStr);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

export function formatQuizDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatMmSs(totalSec) {
  const s = Math.max(0, Number(totalSec) || 0);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}
