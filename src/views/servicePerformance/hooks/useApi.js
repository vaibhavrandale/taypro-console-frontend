import { useEffect, useRef, useState } from "react";
import { toApiError } from "../api/client";

const cancelled = (error) => error?.name === "CanceledError" || error?.code === "ERR_CANCELED" || error?.name === "AbortError";

/**
 * Runs `fetcher(signal)` whenever `key` changes. The previous request is
 * aborted, and `delay` debounces rapid filter changes.
 */
export function useApi(fetcher, key, { delay = 0, enabled = true } = {}) {
  const [state, setState] = useState({ data: null, loading: enabled, error: null });
  const [tick, setTick] = useState(0);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  useEffect(() => {
    if (!enabled) {
      setState({ data: null, loading: false, error: null });
      return undefined;
    }
    const controller = new AbortController();
    setState((current) => ({ ...current, loading: true, error: null }));
    const timer = setTimeout(() => {
      Promise.resolve(fetcherRef.current(controller.signal))
        .then((data) => {
          if (!controller.signal.aborted) setState({ data, loading: false, error: null });
        })
        .catch((error) => {
          if (controller.signal.aborted || cancelled(error)) return;
          setState({ data: null, loading: false, error: toApiError(error) });
        });
    }, delay);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [key, tick, enabled, delay]);

  return { ...state, reload: () => setTick((n) => n + 1) };
}
