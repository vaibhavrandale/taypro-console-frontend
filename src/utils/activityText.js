// Security (#529 B2): activity "details" strings come from the backend with
// some formatting markup (<span class=...>) and, for older entries, raw user
// input. Never render them as HTML. Strip tags, decode the few entities the
// backend emits, and let React render the result as plain text.
const ENTITIES = {
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&#x27;": "'",
  "&nbsp;": " ",
  "&amp;": "&", // last, so "&amp;lt;" becomes "&lt;" text, not "<"
};

export function activityToText(details) {
  if (details == null) return "";
  const noTags = String(details).replace(/<[^>]*>/g, "");
  const decoded = noTags.replace(/&(lt|gt|quot|#39|#x27|nbsp|amp);/g, (m) => ENTITIES[m]);
  return decoded.replace(/[ \t]*\n[ \t]*/g, " ").replace(/ {2,}/g, " ").trim();
}

/** Same line split the old HTML rendering used (", " became a line break). */
export const activityLines = (details) =>
  activityToText(details).split(/,\s+/).filter(Boolean);
