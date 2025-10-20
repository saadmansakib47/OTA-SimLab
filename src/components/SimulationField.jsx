"use client"

import { useEffect, useState, useRef } from "react"
import { OTACenter } from "./OTACenter"
import { NodeComponent } from "./NodeComponent"
import { Card } from "./ui/card"

const CONTAINER_WIDTH = 800
const CONTAINER_HEIGHT = 500
const NODE_RADIUS = 32
const MIN_DISTANCE = 80
const OTA_CENTER_RADIUS = 40

// Collision detection - ensure nodes don't overlap
const checkCollision = (pos, otherPositions, minDistance = MIN_DISTANCE) => {
  return otherPositions.some((other) => {
    const dx = pos.x - other.x
    const dy = pos.y - other.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    return distance < minDistance
  })
}

// Generate non-overlapping positions
const generateNonOverlappingPositions = (count, otaCenterPos) => {
  const positions = []
  const maxAttempts = 100

  for (let i = 0; i < count; i++) {
    let position
    let attempts = 0
    let distanceToOTA = 0

    do {
      position = {
        x: Math.random() * (CONTAINER_WIDTH - NODE_RADIUS * 2) - CONTAINER_WIDTH / 2 + NODE_RADIUS,
        y: Math.random() * (CONTAINER_HEIGHT - NODE_RADIUS * 2) - CONTAINER_HEIGHT / 2 + NODE_RADIUS,
      }

      const dx = position.x - otaCenterPos.x
      const dy = position.y - otaCenterPos.y
      distanceToOTA = Math.sqrt(dx * dx + dy * dy)

      attempts++
    } while (
      (checkCollision(position, positions) || distanceToOTA < MIN_DISTANCE + OTA_CENTER_RADIUS) &&
      attempts < maxAttempts
    )

    if (attempts < maxAttempts) {
      positions.push(position)
    }
  }

  return positions
}

export const SimulationField = ({ nodes, isRunning, onNodesUpdate, latency, failureRate, onNodePositionsChange }) => {
  const [nodePositions, setNodePositions] = useState([])
  const [otaCenterPos, setOtaCenterPos] = useState({ x: 0, y: -150 })
  const [draggedNodeId, setDraggedNodeId] = useState(null)
  const [draggedOTA, setDraggedOTA] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const containerRef = useRef(null)

  useEffect(() => {
    if (nodePositions.length === 0 && nodes.length > 0) {
      const positions = generateNonOverlappingPositions(nodes.length, otaCenterPos)
      setNodePositions(positions)
    }
  }, [nodes.length])

  useEffect(() => {
    if (nodes.length > nodePositions.length) {
      const newPositions = [...nodePositions]
      const additionalCount = nodes.length - nodePositions.length
      const additionalPositions = generateNonOverlappingPositions(additionalCount, otaCenterPos)
      newPositions.push(...additionalPositions)
      setNodePositions(newPositions)
    } else if (nodes.length < nodePositions.length) {
      setNodePositions(nodePositions.slice(0, nodes.length))
    }
  }, [nodes.length])

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      const updatedNodes = nodes.map((node) => {
        if (node.state === "idle") {
          return { ...node, state: "updating" }
        }
        if (node.state === "updating") {
          const isFailed = Math.random() < failureRate / 100
          return { ...node, state: isFailed ? "failed" : "updated" }
        }
        return node
      })

      const allComplete = updatedNodes.every((n) => n.state !== "updating")
      if (allComplete) {
        onNodesUpdate(updatedNodes)
      } else {
        onNodesUpdate(updatedNodes)
      }
    }, latency + 500)

    return () => clearInterval(interval)
  }, [isRunning, nodes, latency, failureRate, onNodesUpdate])

  const handleMouseDown = (e, nodeId) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const nodePos = nodePositions[nodeId - 1]

    setDraggedNodeId(nodeId)
    setDragOffset({
      x: e.clientX - rect.left - (nodePos.x + CONTAINER_WIDTH / 2),
      y: e.clientY - rect.top - (nodePos.y + CONTAINER_HEIGHT / 2),
    })
  }

  const handleOTACenterMouseDown = (e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()

    setDraggedOTA(true)
    setDragOffset({
      x: e.clientX - rect.left - (otaCenterPos.x + CONTAINER_WIDTH / 2),
      y: e.clientY - rect.top - (otaCenterPos.y + CONTAINER_HEIGHT / 2),
    })
  }

  const handleMouseMove = (e) => {
    if (draggedNodeId === null && !draggedOTA) return
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const newX = e.clientX - rect.left - dragOffset.x - CONTAINER_WIDTH / 2
    const newY = e.clientY - rect.top - dragOffset.y - CONTAINER_HEIGHT / 2

    // Constrain to container bounds
    const constrainedX = Math.max(
      -CONTAINER_WIDTH / 2 + OTA_CENTER_RADIUS,
      Math.min(CONTAINER_WIDTH / 2 - OTA_CENTER_RADIUS, newX),
    )
    const constrainedY = Math.max(
      -CONTAINER_HEIGHT / 2 + OTA_CENTER_RADIUS,
      Math.min(CONTAINER_HEIGHT / 2 - OTA_CENTER_RADIUS, newY),
    )

    if (draggedOTA) {
      setOtaCenterPos({ x: constrainedX, y: constrainedY })
    } else if (draggedNodeId !== null) {
      const newPositions = [...nodePositions]
      newPositions[draggedNodeId - 1] = { x: constrainedX, y: constrainedY }
      setNodePositions(newPositions)
    }
  }

  const handleMouseUp = () => {
    setDraggedNodeId(null)
    setDraggedOTA(false)
  }

  useEffect(() => {
    if (draggedNodeId !== null || draggedOTA) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
      return () => {
        window.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [draggedNodeId, draggedOTA, dragOffset])

  return (
    <Card className="relative w-full bg-slate-950 border-slate-700 overflow-hidden" style={{ height: "600px" }}>
      {/* Simulation Container */}
      <div
        ref={containerRef}
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 border border-slate-700 rounded-lg bg-slate-900/50"
        style={{ width: `${CONTAINER_WIDTH}px`, height: `${CONTAINER_HEIGHT}px` }}
      >
        {/* Connection Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {nodePositions.map((pos, idx) => {
            const centerX = otaCenterPos.x + CONTAINER_WIDTH / 2
            const centerY = otaCenterPos.y + CONTAINER_HEIGHT / 2
            const nodeX = pos.x + CONTAINER_WIDTH / 2
            const nodeY = pos.y + CONTAINER_HEIGHT / 2

            return (
              <line
                key={`line-${idx}`}
                x1={centerX}
                y1={centerY}
                x2={nodeX}
                y2={nodeY}
                stroke="rgba(59, 130, 246, 0.3)"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
            )
          })}
        </svg>

        {/* OTA Center - Now draggable and inside container */}
        <div
          onMouseDown={handleOTACenterMouseDown}
          style={{
            position: "absolute",
            left: `${otaCenterPos.x + CONTAINER_WIDTH / 2}px`,
            top: `${otaCenterPos.y + CONTAINER_HEIGHT / 2}px`,
            transform: "translate(-50%, -50%)",
            cursor: draggedOTA ? "grabbing" : "grab",
            zIndex: 10,
          }}
        >
          <OTACenter isActive={isRunning} />
        </div>

        {/* Nodes */}
        {nodePositions.map((pos, idx) => (
          <div
            key={idx}
            onMouseDown={(e) => handleMouseDown(e, idx + 1)}
            style={{
              position: "absolute",
              left: `${pos.x + CONTAINER_WIDTH / 2}px`,
              top: `${pos.y + CONTAINER_HEIGHT / 2}px`,
              transform: "translate(-50%, -50%)",
              cursor: draggedNodeId === idx + 1 ? "grabbing" : "grab",
            }}
          >
            <NodeComponent
              id={idx + 1}
              name={nodes[idx]?.name || `Node ${idx + 1}`}
              state={nodes[idx]?.state || "idle"}
              type={nodes[idx]?.type || "standard"}
              isDragging={draggedNodeId === idx + 1}
            />
          </div>
        ))}
      </div>

      {/* Info Text */}
      <div className="absolute bottom-4 left-4 text-xs text-slate-400">
        <p>Drag nodes or OTA Center to reposition • Total nodes: {nodes.length}</p>
      </div>
    </Card>
  )
}
