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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 w-full">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-slate-100 dark:text-slate-800">Update Results</CardTitle>
          <p className="text-sm text-slate-400 dark:text-slate-600 mt-1">Success vs failure distribution</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={summaryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" className="dark:stroke-slate-300" />
              <XAxis dataKey="name" stroke="#94a3b8" className="dark:stroke-slate-600" />
              <YAxis stroke="#94a3b8" className="dark:stroke-slate-600" />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: "#1e293b", 
                  border: "1px solid #475569",
                  borderRadius: "12px",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
                }}
                labelStyle={{ color: "#f1f5f9", fontWeight: "bold" }}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[12, 12, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-slate-100 dark:text-slate-800">Performance Metrics</CardTitle>
          <p className="text-sm text-slate-400 dark:text-slate-600 mt-1">Real-time statistics</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-500/10 to-blue-600/10 dark:from-blue-400/10 dark:to-blue-500/10 rounded-xl border border-blue-500/20 dark:border-blue-400/20 hover:border-blue-500/40 dark:hover:border-blue-400/40 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 dark:bg-blue-400/20 rounded-lg">
                  <svg className="w-5 h-5 text-blue-400 dark:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-slate-300 dark:text-slate-700">Average Latency</span>
              </div>
              <span className="text-xl font-bold text-blue-400 dark:text-blue-600">{metrics.averageLatency.toFixed(0)}<span className="text-sm ml-1">ms</span></span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-emerald-500/10 to-teal-600/10 dark:from-emerald-400/10 dark:to-teal-500/10 rounded-xl border border-emerald-500/20 dark:border-emerald-400/20 hover:border-emerald-500/40 dark:hover:border-emerald-400/40 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/20 dark:bg-emerald-400/20 rounded-lg">
                  <svg className="w-5 h-5 text-emerald-400 dark:text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-slate-300 dark:text-slate-700">Throughput</span>
              </div>
              <span className="text-xl font-bold text-emerald-400 dark:text-emerald-600">{metrics.throughput.toFixed(2)}<span className="text-sm ml-1">n/s</span></span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-500/10 to-pink-600/10 dark:from-purple-400/10 dark:to-pink-500/10 rounded-xl border border-purple-500/20 dark:border-purple-400/20 hover:border-purple-500/40 dark:hover:border-purple-400/40 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 dark:bg-purple-400/20 rounded-lg">
                  <svg className="w-5 h-5 text-purple-400 dark:text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-slate-300 dark:text-slate-700">Success Rate</span>
              </div>
              <span className="text-xl font-bold text-purple-400 dark:text-purple-600">
                {metrics.successCount + metrics.failureCount > 0
                  ? ((metrics.successCount / (metrics.successCount + metrics.failureCount)) * 100).toFixed(1)
                  : 0}<span className="text-sm ml-1">%</span>
              </span>
            </div>
            <Button
              onClick={onSaveUpdate}
              disabled={savedUpdates.length >= 4}
              variant="default"
              className="w-full mt-4"
              size="md"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              {savedUpdates.length >= 4 ? "Max 4 Updates Saved" : "Save Update"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg text-slate-100 dark:text-slate-800">Saved Updates</CardTitle>
          <p className="text-sm text-slate-400 dark:text-slate-600 mt-1">Historical simulation data</p>
        </CardHeader>
        <CardContent>
          {savedUpdates.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-slate-600 dark:text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-slate-400 dark:text-slate-600 text-sm font-medium">No saved updates yet</p>
              <p className="text-slate-500 dark:text-slate-500 text-xs mt-1">Run a simulation and click "Save Update"</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {savedUpdates.map((update, idx) => (
                <div 
                  key={update.id} 
                  className="group p-4 bg-gradient-to-br from-slate-700/40 to-slate-800/40 dark:from-slate-100/40 dark:to-slate-200/40 rounded-xl border border-slate-600/50 dark:border-slate-300/50 hover:border-blue-500/50 dark:hover:border-blue-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 dark:hover:shadow-blue-400/20"
                >
                  {renamingId === update.id ? (
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        className="flex-1 px-2 py-1.5 bg-slate-600/50 dark:bg-slate-200/50 text-slate-100 dark:text-slate-800 text-sm rounded-lg border border-slate-500 dark:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveRename(update.id)}
                        className="px-3 py-1.5 bg-blue-600 dark:bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                      >
                        ✓
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start mb-3">
                      <h3
                        onClick={() => handleStartRename(update.id, update.name)}
                        className="text-sm font-bold text-slate-100 dark:text-slate-800 cursor-pointer hover:text-blue-400 dark:hover:text-blue-600 transition-colors flex items-center gap-1"
                      >
                        {update.name}
                        <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </h3>
                      <button 
                        onClick={() => onDeleteUpdate(update.id)} 
                        className="text-red-400 dark:text-red-600 hover:text-red-300 dark:hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center p-2 bg-slate-600/30 dark:bg-slate-200/30 rounded-lg">
                      <span className="text-slate-400 dark:text-slate-600">Latency:</span>
                      <span className="font-semibold text-slate-200 dark:text-slate-800">{update.averageLatency.toFixed(0)}ms</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-slate-600/30 dark:bg-slate-200/30 rounded-lg">
                      <span className="text-slate-400 dark:text-slate-600">Throughput:</span>
                      <span className="font-semibold text-slate-200 dark:text-slate-800">{update.throughput.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-slate-600/30 dark:bg-slate-200/30 rounded-lg">
                      <span className="text-slate-400 dark:text-slate-600">Success:</span>
                      <span className="font-semibold text-slate-200 dark:text-slate-800">{update.successRate.toFixed(1)}%</span>
                    </div>
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
