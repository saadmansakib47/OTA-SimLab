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
        <CardTitle className="text-lg text-slate-100 dark:text-slate-800">Control Panel</CardTitle>
        <p className="text-sm text-slate-400 dark:text-slate-600 mt-1">Configure simulation parameters</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-5">
          <Slider label="Latency (ms)" min={100} max={2000} step={100} value={latency} onChange={setLatency} />
          <Slider label="Failure Rate (%)" min={0} max={50} step={5} value={failureRate} onChange={setFailureRate} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-200 dark:text-slate-700">Algorithm</label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            className="w-full px-4 py-3 bg-slate-700/50 dark:bg-slate-100/50 border border-slate-600/50 dark:border-slate-300/50 rounded-xl text-slate-100 dark:text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200 backdrop-blur-sm"
          >
            {algorithms.map((algo) => (
              <option key={algo.value} value={algo.value} className="bg-slate-800 dark:bg-white">
                {algo.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-slate-500 dark:text-slate-600 italic">Advanced synchronization algorithms</p>
        </div>

        <div className="flex gap-3 pt-2">
          <Button onClick={onStart} disabled={isRunning} variant="success" className="flex-1" size="md">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
            Start
          </Button>
          <Button onClick={onStop} disabled={!isRunning} variant="danger" className="flex-1" size="md">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
            </svg>
            Stop
          </Button>
          <Button onClick={onReset} variant="outline" className="flex-1" size="md">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
