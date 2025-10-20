"use client"

import { useState, useCallback } from "react"
import { SimulationField } from "./components/SimulationField"
import { ControlPanel } from "./components/ControlPanel"
import { MetricsPanel } from "./components/MetricsPanel"
import { AlgorithmSelector } from "./components/AlgorithmSelector"
import { NodeManagementPanel } from "./components/NodeManagementPanel"

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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-white mb-2">OTA Update Visual Simulator</h1>
        <p className="text-slate-400">Visualize Over-The-Air updates in a distributed network</p>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Simulation Field */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-3">Simulation</h2>
          <SimulationField
            nodes={nodes}
            isRunning={isRunning}
            onNodesUpdate={handleNodesUpdate}
            latency={latency}
            failureRate={failureRate}
          />
        </div>

        {/* Control, Algorithm, and Node Management */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-white mb-3">Settings</h2>
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
            <h2 className="text-xl font-semibold text-white mb-3">Algorithm</h2>
            <AlgorithmSelector algorithm={algorithm} onAlgorithmChange={setAlgorithm} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white mb-3">Nodes</h2>
            <NodeManagementPanel nodes={nodes} onNodesChange={setNodes} onReset={handleReset} />
          </div>
        </div>

        {/* Metrics Panel */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-3">Metrics</h2>
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
  )
}
