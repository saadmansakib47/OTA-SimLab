"use client"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Slider } from "./ui/slider"

export const ControlPanel = ({
  latency,
  setLatency,
  failureRate,
  setFailureRate,
  algorithm,
  setAlgorithm,
  isRunning,
  onStart,
  onStop,
  onReset,
}) => {
  const algorithms = [
    { value: "lock-free", label: "Lock-Free" },
    { value: "mutex", label: "Mutex-Based" },
    { value: "observer", label: "Observer Pattern" },
    { value: "token-ring", label: "Token Ring" },
    { value: "lamport", label: "Lamport's Algorithm" },
    { value: "ricart-agrawala", label: "Ricart-Agrawala Algorithm" },
  ]

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg text-white">Control Panel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Slider label="Latency (ms)" min={100} max={2000} step={100} value={latency} onChange={setLatency} />
          <Slider label="Failure Rate (%)" min={0} max={50} step={5} value={failureRate} onChange={setFailureRate} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Algorithm</label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {algorithms.map((algo) => (
              <option key={algo.value} value={algo.value}>
                {algo.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-slate-400">Algorithm placeholder - implementation coming soon</p>
        </div>

        <div className="flex gap-3">
          <Button onClick={onStart} disabled={isRunning} variant="default" className="flex-1">
            Start Update
          </Button>
          <Button onClick={onStop} disabled={!isRunning} variant="secondary" className="flex-1">
            Stop Update
          </Button>
          <Button onClick={onReset} variant="ghost" className="flex-1">
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
