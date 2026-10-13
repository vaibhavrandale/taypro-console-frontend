import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { lookupApi } from "../api/client";
import { canReadAll } from "../utils/access";
import { useApi } from "./useApi";

let assignedCache = { userId: null, siteIds: [] };

/**
 * Site options. Admins get every site. Everyone else only gets the site ids
 * the performance API scoped to them (report.site_ids from an unfiltered call).
 */
export function useSiteOptions(report, siteFilter) {
  const user = useSelector((state) => state.userInfo);
  const admin = canReadAll(user);
  const all = useApi((signal) => lookupApi.sites(signal), "sites", { enabled: admin });
  const [assigned, setAssigned] = useState(assignedCache.userId === user?._id ? assignedCache.siteIds : []);

  useEffect(() => {
    if (admin || siteFilter || !Array.isArray(report?.site_ids)) return;
    assignedCache = { userId: user?._id, siteIds: report.site_ids };
    setAssigned(report.site_ids);
  }, [admin, report, siteFilter, user]);

  return admin ? all.data || [] : assigned;
}

export function useFaultOptions() {
  return useApi((signal) => lookupApi.faults(signal), "faults").data || [];
}

export function useEngineerOptions(enabled) {
  return useApi((signal) => lookupApi.engineers(signal), "engineers", { enabled });
}
