"use client"

import { useState, useCallback } from "react"
import { SimulationField } from "./components/SimulationField"
import { ControlPanel } from "./components/ControlPanel"
import { MetricsPanel } from "./components/MetricsPanel"
import { AlgorithmSelector } from "./components/AlgorithmSelector"
import { NodeManagementPanel } from "./components/NodeManagementPanel"
import { DarkModeToggle } from "./components/DarkModeToggle"

const generateNodes = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    state: "idle",
    type: "standard",
    name: `Node ${i + 1}`,
  }))
}

export default function App() {
  const [nodes, setNodes] = useState(() => generateNodes(10))
  const [isRunning, setIsRunning] = useState(false)
  const [latency, setLatency] = useState(500)
  const [failureRate, setFailureRate] = useState(10)
  const [algorithm, setAlgorithm] = useState("lock-free")
  const [metrics, setMetrics] = useState({
    successCount: 0,
    failureCount: 0,
    averageLatency: 0,
    throughput: 0,
  })
  const [savedUpdates, setSavedUpdates] = useState([])

  const handleStart = useCallback(() => {
    setIsRunning(true)
  }, [])

  const handleStop = useCallback(() => {
    setIsRunning(false)
  }, [])

  const handleReset = useCallback(() => {
    setIsRunning(false)
    setNodes(generateNodes(10))
    setMetrics({
      successCount: 0,
      failureCount: 0,
      averageLatency: 0,
      throughput: 0,
    })
  }, [])

  const handleNodesUpdate = useCallback(
    (updatedNodes) => {
      setNodes(updatedNodes)

      const successCount = updatedNodes.filter((n) => n.state === "updated").length
      const failureCount = updatedNodes.filter((n) => n.state === "failed").length
      const allComplete = updatedNodes.every((n) => n.state !== "updating")

      if (allComplete && (successCount > 0 || failureCount > 0)) {
        setMetrics({
          successCount,
          failureCount,
          averageLatency: latency,
          throughput: (successCount + failureCount) / (latency / 1000),
        })
        setIsRunning(false)
      }
    },
    [latency],
  )

  const handleSaveUpdate = useCallback(() => {
    if (savedUpdates.length < 4) {
      const successRate =
        metrics.successCount + metrics.failureCount > 0
          ? (metrics.successCount / (metrics.successCount + metrics.failureCount)) * 100
          : 0

      const newUpdate = {
        id: Date.now(),
        name: `Update ${savedUpdates.length + 1}`,
        averageLatency: metrics.averageLatency,
        throughput: metrics.throughput,
        successRate: successRate,
      }
      setSavedUpdates([...savedUpdates, newUpdate])
    }
  }, [metrics, savedUpdates])

  const handleDeleteUpdate = useCallback(
    (id) => {
      setSavedUpdates(savedUpdates.filter((update) => update.id !== id))
    },
    [savedUpdates],
  )

  const handleRenameUpdate = useCallback(
    (id, newName) => {
      setSavedUpdates(savedUpdates.map((update) => (update.id === id ? { ...update, name: newName } : update)))
    },
    [savedUpdates],
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 dark:from-gray-50 dark:via-blue-50 dark:to-indigo-50 transition-all duration-500">
      {/* Animated Background Pattern */}
      <div className="fixed inset-0 opacity-20 dark:opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(76,29,149,0.1),rgba(0,0,0,0))]"></div>
      </div>

      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8 sm:mb-12 text-center relative max-w-7xl mx-auto">
          <div className="absolute top-0 right-0 sm:right-4">
            <DarkModeToggle />
          </div>
          <div className="inline-block mb-4">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/50 dark:shadow-blue-500/30">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 dark:from-blue-600 dark:via-purple-600 dark:to-pink-600 bg-clip-text text-transparent">
                OTA Simulator
              </h1>
            </div>
          </div>
          <p className="text-slate-300 dark:text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            Visualize and analyze Over-The-Air updates in distributed networks with advanced synchronization algorithms
          </p>
        </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Simulation Field */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
            <h2 className="text-xl sm:text-2xl font-bold text-white dark:text-slate-900">Network Simulation</h2>
          </div>
          <SimulationField
            nodes={nodes}
            isRunning={isRunning}
            onNodesUpdate={handleNodesUpdate}
            latency={latency}
            failureRate={failureRate}
          />
        </div>

        {/* Control, Algorithm, and Node Management */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></div>
              <h2 className="text-xl sm:text-2xl font-bold text-white dark:text-slate-900">Control Panel</h2>
            </div>
            <ControlPanel
              latency={latency}
              setLatency={setLatency}
              failureRate={failureRate}
              setFailureRate={setFailureRate}
              algorithm={algorithm}
              setAlgorithm={setAlgorithm}
              isRunning={isRunning}
              onStart={handleStart}
              onStop={handleStop}
              onReset={handleReset}
            />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"></div>
              <h2 className="text-xl sm:text-2xl font-bold text-white dark:text-slate-900">Algorithm</h2>
            </div>
            <AlgorithmSelector algorithm={algorithm} onAlgorithmChange={setAlgorithm} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-gradient-to-b from-pink-500 to-rose-500 rounded-full"></div>
              <h2 className="text-xl sm:text-2xl font-bold text-white dark:text-slate-900">Nodes</h2>
            </div>
            <NodeManagementPanel nodes={nodes} onNodesChange={setNodes} onReset={handleReset} />
          </div>
        </div>

        {/* Metrics Panel */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 bg-gradient-to-b from-violet-500 to-purple-500 rounded-full"></div>
            <h2 className="text-xl sm:text-2xl font-bold text-white dark:text-slate-900">Performance Metrics</h2>
          </div>
          <MetricsPanel
            metrics={metrics}
            onSaveUpdate={handleSaveUpdate}
            savedUpdates={savedUpdates}
            onDeleteUpdate={handleDeleteUpdate}
            onRenameUpdate={handleRenameUpdate}
          />
        </div>
      </div>
      </div>
    </div>
  )
}
