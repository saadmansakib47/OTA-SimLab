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
        <CardTitle className="text-lg text-white">Node Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Number of Nodes</label>
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              max="20"
              value={nodeCount}
              onChange={(e) => setNodeCount(Number.parseInt(e.target.value) || 1)}
              className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button onClick={handleSetNodeCount} variant="default" className="px-4">
              Set
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Add Node</label>
          <div className="flex gap-2">
            <select
              value={newNodeType}
              onChange={(e) => setNewNodeType(e.target.value)}
              className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="standard">Standard</option>
              <option value="critical">Critical</option>
              <option value="backup">Backup</option>
            </select>
            <Button onClick={handleAddNode} variant="default" className="px-4">
              Add
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Nodes ({nodes.length})</label>
          <div className="max-h-48 overflow-y-auto space-y-2 bg-slate-800/50 p-3 rounded-lg border border-slate-700">
            {nodes.map((node) => (
              <div key={node.id} className="flex items-center gap-2 p-2 bg-slate-700/50 rounded">
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
                  className="flex-1 px-2 py-1 bg-slate-600 border border-slate-500 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-xs text-slate-400 px-2 py-1 bg-slate-600 rounded">{node.type}</span>
                <Button
                  onClick={() => handleDeleteNode(node.id)}
                  variant="ghost"
                  className="px-2 py-1 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                >
                  ✕
                </Button>
              </div>
            ))}
          </div>
        </div>

        <Button onClick={onReset} variant="secondary" className="w-full text-white">
          Reset All Nodes
        </Button>
      </CardContent>
    </Card>
  )
}
