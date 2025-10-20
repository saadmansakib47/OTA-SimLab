"use client"
import { motion } from "framer-motion"

const stateColors = {
  idle: "bg-slate-600",
  updating: "bg-yellow-500",
  updated: "bg-green-500",
  failed: "bg-red-500",
}

const stateLabels = {
  idle: "Idle",
  updating: "Updating",
  updated: "Updated",
  failed: "Failed",
}

const typeColors = {
  standard: "border-blue-400",
  critical: "border-red-400",
  backup: "border-green-400",
}

export const NodeComponent = ({ id, name, state, type = "standard", isDragging }) => {
  const color = stateColors[state] || stateColors.idle
  const label = stateLabels[state] || "Unknown"
  const borderColor = typeColors[type] || typeColors.standard

  return (
    <motion.div className="flex flex-col items-center gap-2">
      <motion.div
        className={`w-16 h-16 rounded-full ${color} flex items-center justify-center cursor-grab active:cursor-grabbing shadow-lg border-2 ${borderColor} transition-shadow ${isDragging ? "ring-2 ring-blue-300 shadow-xl" : ""}`}
        animate={state === "updating" ? { scale: [1, 1.1, 1] } : {}}
        transition={state === "updating" ? { duration: 0.8, repeat: Number.POSITIVE_INFINITY } : {}}
        whileHover={{ scale: 1.05 }}
      >
        <div className="text-center">
          <p className="text-white font-bold text-xs">{name}</p>
          <p className="text-white text-xs opacity-75">{label}</p>
        </div>
      </motion.div>

      {state === "updating" && (
        <motion.div
          className="absolute w-20 h-20 rounded-full border-2 border-yellow-400"
          animate={{ scale: [1, 1.3], opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
        />
      )}
    </motion.div>
  )
}
