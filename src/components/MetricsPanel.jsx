"use client"

import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Trash2 } from "lucide-react"

export const MetricsPanel = ({ metrics, onSaveUpdate, savedUpdates, onDeleteUpdate, onRenameUpdate }) => {
  const [renamingId, setRenamingId] = useState(null)
  const [renameValue, setRenameValue] = useState("")
  const [selectedMetric, setSelectedMetric] = useState("averageLatency")
  const [showComparison, setShowComparison] = useState(false)

  const summaryData = [
    { name: "Successful", value: metrics.successCount, fill: "#10b981" },
    { name: "Failed", value: metrics.failureCount, fill: "#ef4444" },
  ]

  const comparisonData = savedUpdates.map((update) => ({
    name: update.name,
    averageLatency: Number(update.averageLatency) || 0,
    throughput: Number(update.throughput) || 0,
    successRate: Number(update.successRate) || 0,
  }))

  console.log("[v0] Comparison Data:", comparisonData)
  console.log("[v0] Selected Metric:", selectedMetric)
  console.log("[v0] Show Comparison:", showComparison)

  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"]

  const handleStartRename = (id, currentName) => {
    setRenamingId(id)
    setRenameValue(currentName)
  }

  const handleSaveRename = (id) => {
    if (renameValue.trim()) {
      onRenameUpdate(id, renameValue)
    }
    setRenamingId(null)
    setRenameValue("")
  }

  const handleMetricChange = (metric) => {
    setSelectedMetric(metric)
  }

  const handleCompare = () => {
    console.log("[v0] Compare clicked, data:", comparisonData)
    setShowComparison(true)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-white">Update Results</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={summaryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
                labelStyle={{ color: "#f1f5f9" }}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-white">Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-slate-800 rounded-lg">
              <span className="text-sm text-slate-300">Average Latency</span>
              <span className="text-lg font-bold text-blue-400">{metrics.averageLatency.toFixed(0)}ms</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-800 rounded-lg">
              <span className="text-sm text-slate-300">Throughput</span>
              <span className="text-lg font-bold text-green-400">{metrics.throughput.toFixed(2)} nodes/s</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-800 rounded-lg">
              <span className="text-sm text-slate-300">Success Rate</span>
              <span className="text-lg font-bold text-purple-400">
                {metrics.successCount + metrics.failureCount > 0
                  ? ((metrics.successCount / (metrics.successCount + metrics.failureCount)) * 100).toFixed(1)
                  : 0}
                %
              </span>
            </div>
            <Button
              onClick={onSaveUpdate}
              disabled={savedUpdates.length >= 4}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
            >
              {savedUpdates.length >= 4 ? "Max 4 Updates Saved" : "Save Update"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg text-white">Saved Updates</CardTitle>
        </CardHeader>
        <CardContent>
          {savedUpdates.length === 0 ? (
            <p className="text-slate-400 text-sm">No saved updates yet. Run a simulation and click "Save Update".</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {savedUpdates.map((update, idx) => (
                <div key={update.id} className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                  {renamingId === update.id ? (
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        className="flex-1 px-2 py-1 bg-slate-700 text-white text-sm rounded border border-slate-600"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveRename(update.id)}
                        className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                      >
                        ✓
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center mb-2">
                      <h3
                        onClick={() => handleStartRename(update.id, update.name)}
                        className="text-sm font-semibold text-white cursor-pointer hover:text-blue-400"
                      >
                        {update.name}
                      </h3>
                      <button onClick={() => onDeleteUpdate(update.id)} className="text-red-400 hover:text-red-300">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                  <div className="text-xs text-slate-400 space-y-1">
                    <p>
                      Latency: <span className="text-slate-200">{update.averageLatency.toFixed(0)}ms</span>
                    </p>
                    <p>
                      Throughput: <span className="text-slate-200">{update.throughput.toFixed(2)}</span>
                    </p>
                    <p>
                      Success: <span className="text-slate-200">{update.successRate.toFixed(1)}%</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {savedUpdates.length > 0 && (
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg text-white">Update Result Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex gap-6 flex-wrap items-center">
              <label className="flex items-center gap-2 text-slate-300">
                <input
                  type="radio"
                  name="metric"
                  value="averageLatency"
                  checked={selectedMetric === "averageLatency"}
                  onChange={() => handleMetricChange("averageLatency")}
                  className="w-4 h-4"
                />
                <span className="text-sm">Average Latency (ms)</span>
              </label>
              <label className="flex items-center gap-2 text-slate-300">
                <input
                  type="radio"
                  name="metric"
                  value="throughput"
                  checked={selectedMetric === "throughput"}
                  onChange={() => handleMetricChange("throughput")}
                  className="w-4 h-4"
                />
                <span className="text-sm">Throughput (nodes/s)</span>
              </label>
              <label className="flex items-center gap-2 text-slate-300">
                <input
                  type="radio"
                  name="metric"
                  value="successRate"
                  checked={selectedMetric === "successRate"}
                  onChange={() => handleMetricChange("successRate")}
                  className="w-4 h-4"
                />
                <span className="text-sm">Success Rate (%)</span>
              </label>
              <div className="ml-auto">
                <Button onClick={handleCompare} className="bg-blue-600 hover:bg-blue-700 text-white">
                  Compare
                </Button>
              </div>
            </div>

            {showComparison && comparisonData.length > 0 && (
              <div style={{ width: "100%", height: "400px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
                      labelStyle={{ color: "#f1f5f9" }}
                      formatter={(value) => value.toFixed(2)}
                    />
                    <Legend />
                    {selectedMetric === "averageLatency" && (
                      <Bar dataKey="averageLatency" fill={colors[0]} name="Avg Latency (ms)" radius={[8, 8, 0, 0]} />
                    )}
                    {selectedMetric === "throughput" && (
                      <Bar dataKey="throughput" fill={colors[1]} name="Throughput (nodes/s)" radius={[8, 8, 0, 0]} />
                    )}
                    {selectedMetric === "successRate" && (
                      <Bar dataKey="successRate" fill={colors[2]} name="Success Rate (%)" radius={[8, 8, 0, 0]} />
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
