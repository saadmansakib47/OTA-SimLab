"use client"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

export const AlgorithmSelector = ({ algorithm, onAlgorithmChange }) => {
  const algorithms = [
    {
      value: "lock-free",
      label: "Lock-Free",
      description: "Non-blocking concurrent updates",
    },
    {
      value: "mutex",
      label: "Mutex-Based",
      description: "Mutual exclusion with locks",
    },
    {
      value: "observer",
      label: "Observer Pattern",
      description: "Event-driven propagation",
    },
    {
      value: "token-ring",
      label: "Token Ring",
      description: "Token-based coordination",
    },
    {
      value: "lamport",
      label: "Lamport's Algorithm",
      description: "Logical clocks for ordering",
    },
    {
      value: "ricart-agrawala",
      label: "Ricart-Agrawala Algorithm",
      description: "Distributed mutual exclusion",
    },
  ]

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg text-white">Algorithm Selection</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {algorithms.map((algo) => (
            <button
              key={algo.value}
              onClick={() => onAlgorithmChange(algo.value)}
              className={`p-3 rounded-lg border-2 transition-all text-left ${
                algorithm === algo.value
                  ? "border-blue-500 bg-blue-500 bg-opacity-10"
                  : "border-slate-700 hover:border-slate-600"
              }`}
            >
              <p className="font-medium text-sm text-white">{algo.label}</p>
              <p className="text-xs text-slate-400">{algo.description}</p>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
