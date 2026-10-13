import axios from "axios";

/** @typedef {import("./types").PerformanceReport} PerformanceReport */
/** @typedef {import("./types").PerformanceConfig} PerformanceConfig */
/** @typedef {import("./types").Page} Page */
/** @typedef {import("./types").TicketDetailRow} TicketDetailRow */
/** @typedef {import("./types").ApiError} ApiError */

const BASE = "/api/v1/engineer-performance";
const opts = (params, signal) => ({ params, signal, withCredentials: true });

async function get(path, params, signal) {
  const response = await axios.get(`${BASE}${path}`, opts(params, signal));
  return response.data?.data;
}

async function send(method, path, body) {
  const response = await axios({ method, url: `${BASE}${path}`, data: body, withCredentials: true });
  return response.data?.data;
}

/** @returns {ApiError} */
export function toApiError(error) {
  if (error?.code === "missing_record_id") return { status: null, message: error.message, code: error.code, detail: null };
  const response = error?.response;
  const server = typeof response?.data === "object" ? response.data.error ?? response.data.message : null;
  const request = error?.config ? `${String(error.config.method || "get").toUpperCase()} ${error.config.url}` : null;
  return {
    status: response?.status ?? null,
    message: server || error?.message || String(error),
    detail: [response && `HTTP ${response.status}${response.statusText ? ` ${response.statusText}` : ""}`, request].filter(Boolean).join(" · ") || null,
  };
}

/** Exact server message plus HTTP status and request, for toasts and inline text. */
export function errorText(error) {
  const { message, detail } = error && typeof error === "object" && "detail" in error ? error : toApiError(error);
  return detail ? `${message} (${detail})` : message;
}

const site = (id) => encodeURIComponent(id);

export const performanceApi = {
  /** @returns {Promise<PerformanceReport>} */
  dashboard: (params, signal) => get("/", params, signal),
  /** @returns {Promise<PerformanceReport>} */
  site: (siteId, params, signal) => get(`/sites/${site(siteId)}`, params, signal),
  /** @returns {Promise<import("./types").SiteConfiguration>} */
  siteConfiguration: (siteId, signal) => get(`/sites/${site(siteId)}/configuration`, undefined, signal),
  updateSiteConfiguration: (siteId, body) => send("patch", `/sites/${site(siteId)}/configuration`, body),
  /** @returns {Promise<{year:number, points:Array}>} */
  trends: (params, signal) => get("/trends", params, signal),
  /** @returns {Promise<Page>} */
  details: (section, params, signal) => get("/details", { ...params, section }, signal),
  /** @returns {Promise<{period:Object, engineers:PerformanceReport[]}>} */
  compare: (params, signal) => get("/compare", params, signal),
  /** @returns {Promise<Page>} */
  configurationGaps: (params, signal) => get("/configuration-gaps", params, signal),
  /** @returns {Promise<PerformanceConfig>} */
  config: (signal) => get("/config", undefined, signal),
  /** @returns {Promise<PerformanceConfig[]>} */
  configHistory: (signal) => get("/config/history", undefined, signal),
  /** @returns {Promise<{valid:boolean, errors:string[]}>} */
  validateConfig: (body) => send("post", "/config/validate", body),
  /** @returns {Promise<PerformanceConfig>} */
  createConfig: (body) => send("post", "/config", body),
  activateConfig: (version) => send("post", `/config/${version}/activate`, {}),
  recalculate: (body) => send("post", "/recalculate", body),
};

/**
 * TODO(backend): there is no GET /engineer-performance/strategies yet. The
 * registry offered in the UI is the set of strategies the active
 * configuration already uses, so nothing outside the server registry can be
 * picked. Replace with the endpoint once it exists.
 * @param {PerformanceConfig} config
 * @returns {string[]}
 */
export function strategyRegistryFrom(config) {
  return [...new Set((config?.kpis || []).map((kpi) => kpi.strategy).filter(Boolean))];
}

const CONFIG_META = new Set([
  "site_id",
  "configuration_complete",
  "configuration_status",
  "missing_fields",
  "warranty_inconsistent",
  "analysis_status",
  "metrics_calculable",
  "metrics_unavailable",
  "uptime_status",
]);

/**
 * TODO(backend): required site fields have no endpoint of their own. They are
 * read from the keys of GET /sites/:siteId/configuration, which the backend
 * builds from its central REQUIRED_SITE_FIELDS list.
 */
export function requiredFieldsFrom(siteConfiguration) {
  return Object.keys(siteConfiguration || {}).filter((key) => !CONFIG_META.has(key));
}

export const lookupApi = {
  /** All site ids. Only call this for users who can read every site. */
  sites: async (signal) => {
    const response = await axios.get("/api/v1/sites", opts(undefined, signal));
    return (response.data?.data || []).map((row) => row.site_id).filter(Boolean);
  },
  faults: async (signal) => {
    const response = await axios.get("/api/v1/serviceticketsfaults/all-serviceticketsfaults-without-pg", opts(undefined, signal));
    return [...new Set((response.data?.data || []).filter((f) => !f.is_delete).map((f) => f.fault_name).filter(Boolean))];
  },
  engineers: async (signal) => {
    const response = await axios.get("/api/v1/users/get-all-internal-users-without-pg", opts(undefined, signal));
    const list = response.data?.data || response.data || [];
    return (Array.isArray(list) ? list : []).filter(
      (user) => String(user.designation || "").trim().toLowerCase() === "service engineer",
    );
  },
};

/**
 * Writes only delay_reason_code and delay_reason_remarks through the generic
 * ticket update routes. PUT /servicetickets/resolve/:id is deliberately not
 * used: on an already-resolved ticket without parts in the body it resets
 * parts_replaced and part_checklist.
 *
 * TODO(backend): /engineer-performance/details does not return the ticket
 * _id yet, and the service update route does not validate the code against
 * the active configuration (the client route does).
 * @param {TicketDetailRow} row
 */
export async function saveDelayReason(row, body) {
  if (!row?._id) {
    const error = new Error("The performance API does not return this ticket's record id yet, so the reason cannot be saved from here.");
    error.code = "missing_record_id";
    throw error;
  }
  const path = row.kind === "client_ticket" ? `/api/v1/clienttickets/${row._id}` : `/api/v1/servicetickets/${row._id}`;
  const response = await axios.put(path, body, { withCredentials: true });
  return response.data?.data;
}
