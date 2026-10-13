import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { readFilters, writeFilters } from "../utils/filters";

/** Filters live in the URL query so views are shareable and survive reloads. */
export function useFilters() {
  const [search, setSearch] = useSearchParams();
  const filters = useMemo(() => readFilters(search), [search]);
  const setFilters = useCallback(
    (patch) => {
      const next = writeFilters({ ...filters, ...patch });
      for (const [key, value] of search.entries()) {
        if (!["month", "year", "from", "to", "site_id", "fault_type", "status", "client_status", "engineer_id"].includes(key)) next.set(key, value);
      }
      setSearch(next, { replace: true });
    },
    [filters, search, setSearch],
  );
  return [filters, setFilters, search, setSearch];
}
