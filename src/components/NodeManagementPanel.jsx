"use client"

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { useState } from "react"

export const NodeManagementPanel = ({ nodes, onNodesChange, onReset }) => {
  const [nodeCount, setNodeCount] = useState(nodes.length)
  const [newNodeType, setNewNodeType] = useState("standard")
  const [selectedNodeId, setSelectedNodeId] = useState(null)
  const [nodeName, setNodeName] = useState("")

  const handleAddNode = () => {
    const newNode = {
      id: Math.max(...nodes.map((n) => n.id), 0) + 1,
      state: "idle",
      type: newNodeType,
      name: `Node ${Math.max(...nodes.map((n) => n.id), 0) + 1}`,
    }
    onNodesChange([...nodes, newNode])
    setNodeCount(nodes.length + 1)
  }

  const handleDeleteNode = (id) => {
    onNodesChange(nodes.filter((n) => n.id !== id))
    setNodeCount(nodes.length - 1)
    setSelectedNodeId(null)
  }

  const handleRenameNode = (id, newName) => {
    onNodesChange(nodes.map((n) => (n.id === id ? { ...n, name: newName } : n)))
  }

  const handleSetNodeCount = () => {
    const count = Math.max(1, Math.min(20, nodeCount))
    const currentCount = nodes.length

    if (count > currentCount) {
      const newNodes = Array.from({ length: count - currentCount }, (_, i) => ({
        id: Math.max(...nodes.map((n) => n.id), 0) + i + 1,
        state: "idle",
        type: "standard",
        name: `Node ${Math.max(...nodes.map((n) => n.id), 0) + i + 1}`,
      }))
      onNodesChange([...nodes, ...newNodes])
    } else if (count < currentCount) {
      onNodesChange(nodes.slice(0, count))
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg text-slate-100 dark:text-slate-800">Node Management</CardTitle>
        <p className="text-sm text-slate-400 dark:text-slate-600 mt-1">Manage network nodes</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-200 dark:text-slate-700">Number of Nodes</label>
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              max="20"
              value={nodeCount}
              onChange={(e) => setNodeCount(Number.parseInt(e.target.value) || 1)}
              className="flex-1 px-4 py-2.5 bg-slate-700/50 dark:bg-slate-100/50 border border-slate-600/50 dark:border-slate-300/50 rounded-xl text-slate-100 dark:text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200"
            />
            <Button onClick={handleSetNodeCount} variant="default" size="sm" className="px-5">
              Set
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-200 dark:text-slate-700">Add Node</label>
          <div className="flex gap-2">
            <select
              value={newNodeType}
              onChange={(e) => setNewNodeType(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-slate-700/50 dark:bg-slate-100/50 border border-slate-600/50 dark:border-slate-300/50 rounded-xl text-slate-100 dark:text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200"
            >
              <option value="standard" className="bg-slate-800 dark:bg-white">Standard</option>
              <option value="critical" className="bg-slate-800 dark:bg-white">Critical</option>
              <option value="backup" className="bg-slate-800 dark:bg-white">Backup</option>
            </select>
            <Button onClick={handleAddNode} variant="success" size="sm" className="px-5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-200 dark:text-slate-700">Active Nodes ({nodes.length})</label>
          <div className="max-h-48 overflow-y-auto space-y-2 bg-slate-700/30 dark:bg-slate-100/30 p-3 rounded-xl border border-slate-600/30 dark:border-slate-300/30 backdrop-blur-sm custom-scrollbar">
            {nodes.map((node) => (
              <div key={node.id} className="flex items-center gap-2 p-2.5 bg-slate-600/40 dark:bg-white/40 rounded-lg border border-slate-500/30 dark:border-slate-300/30 hover:bg-slate-600/60 dark:hover:bg-white/60 transition-all duration-200">
                <input
                  type="text"
                  value={selectedNodeId === node.id ? nodeName : node.name}
                  onChange={(e) => {
                    if (selectedNodeId === node.id) {
                      setNodeName(e.target.value)
                    }
                  }}
                  onBlur={() => {
                    if (selectedNodeId === node.id) {
                      handleRenameNode(node.id, nodeName)
                      setSelectedNodeId(null)
                    }
                  }}
                  onFocus={() => {
                    setSelectedNodeId(node.id)
                    setNodeName(node.name)
                  }}
                  className="flex-1 px-3 py-1.5 bg-slate-500/40 dark:bg-slate-200/40 border border-slate-400/40 dark:border-slate-400/40 rounded-lg text-slate-100 dark:text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200"
                />
                <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${
                  node.type === 'critical' ? 'bg-red-500/20 text-red-300 dark:text-red-600 border border-red-500/30' :
                  node.type === 'backup' ? 'bg-amber-500/20 text-amber-300 dark:text-amber-600 border border-amber-500/30' :
                  'bg-blue-500/20 text-blue-300 dark:text-blue-600 border border-blue-500/30'
                }`}>
                  {node.type}
                </span>
                <button
                  onClick={() => handleDeleteNode(node.id)}
                  className="p-1.5 text-red-400 dark:text-red-600 hover:text-red-300 dark:hover:text-red-500 hover:bg-red-900/20 dark:hover:bg-red-100/40 rounded-lg transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        <Button onClick={onReset} variant="outline" className="w-full">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reset All Nodes
        </Button>
      </CardContent>
    </Card>
  )
}
