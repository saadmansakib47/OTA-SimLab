import { useState, useCallback, useRef } from "react";
import { runAlgorithm } from "@/src/utils/algorithms";

export function useSimulation() {
  const [events, setEvents] = useState([]); // streaming events for visualization
  const [metrics, setMetrics] = useState(null);
  const runningRef = useRef(false);

  const onUpdate = useCallback((e) => {
    // small buffer strategy: add event and drop old to keep UI responsive
    setEvents(prev => {
      const next = prev.concat(e);
      if (next.length > 500) next.splice(0, next.length - 500);
      return next;
    });
    if (e && e.type === "metrics") {
      setMetrics(e.metrics);
    }
  }, []);

  const simulate = useCallback(async (algKey, nodes, latency = 100, failureRate = 0) => {
    if (runningRef.current) return null;
    runningRef.current = true;
    setEvents([]);
    setMetrics(null);
    try {
      const result = await runAlgorithm(algKey, nodes, latency, failureRate, onUpdate);
      // some algos return metrics directly
      if (result && !metrics) setMetrics(result);
      runningRef.current = false;
      return result;
    } catch (err) {
      runningRef.current = false;
      throw err;
    }
  }, [onUpdate, metrics]);

  return { events, metrics, simulate, running: runningRef.current, clearEvents: () => setEvents([]) };
}