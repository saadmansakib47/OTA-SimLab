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
        <CardTitle className="text-lg text-slate-100 dark:text-slate-800">Algorithms</CardTitle>
        <p className="text-sm text-slate-400 dark:text-slate-600 mt-1">Select synchronization method</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-2.5">
          {algorithms.map((algo) => (
            <button
              key={algo.value}
              onClick={() => onAlgorithmChange(algo.value)}
              className={`group p-3.5 rounded-xl border-2 transition-all duration-300 text-left relative overflow-hidden ${
                algorithm === algo.value
                  ? "border-blue-500 dark:border-blue-400 bg-blue-500/10 dark:bg-blue-400/10 shadow-lg shadow-blue-500/20"
                  : "border-slate-600/50 dark:border-slate-300/50 hover:border-slate-500 dark:hover:border-slate-400 bg-slate-700/30 dark:bg-slate-100/30 hover:bg-slate-700/50 dark:hover:bg-slate-100/50"
              }`}
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-1">
                  <p className={`font-semibold text-sm ${
                    algorithm === algo.value 
                      ? "text-blue-300 dark:text-blue-600" 
                      : "text-slate-200 dark:text-slate-800"
                  }`}>
                    {algo.label}
                  </p>
                  {algorithm === algo.value && (
                    <svg className="w-5 h-5 text-blue-400 dark:text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-600">{algo.description}</p>
              </div>
              {algorithm === algo.value && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 dark:from-blue-400/5 dark:to-purple-400/5"></div>
              )}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
