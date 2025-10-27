import React from "react";
import { useSimulation } from "@/src/hooks/useSimulation";

export default function SimulatorControls({ nodes, onMetrics }) {
  const { events, metrics, simulate, running } = useSimulation();

  async function handleSimulate() {
    const algKey = "lamport"; // read from your UI selection
    const latency = 120;      // read from UI input
    const failureRate = 5;    // read from UI input
    try {
      const m = await simulate(algKey, nodes, latency, failureRate);
      // metrics may come back here or via onUpdate events
      if (onMetrics) onMetrics(m ?? metrics);
      console.log("Simulation finished. metrics=", m ?? metrics);
    } catch (err) {
      console.error("Simulation error:", err);
    }
  }

  return (
    <div>
      <button onClick={handleSimulate} disabled={running}>
        {running ? "Running..." : "Simulate"}
      </button>
      {/* wire events -> visualizer and metrics -> bar chart */}
      <pre>{metrics ? JSON.stringify(metrics, null, 2) : "No metrics yet"}</pre>
    </div>
  );
}