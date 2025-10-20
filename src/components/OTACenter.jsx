"use client"
import { motion } from "framer-motion"

export const OTACenter = ({ isActive }) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        className="relative w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center cursor-pointer"
        animate={isActive ? { scale: [1, 1.1, 1] } : {}}
        transition={isActive ? { duration: 1.5, repeat: Number.POSITIVE_INFINITY } : {}}
        whileHover={{ scale: 1.05 }}
      >
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-blue-400"
          animate={isActive ? { scale: [1, 1.3, 1] } : {}}
          transition={isActive ? { duration: 1.5, repeat: Number.POSITIVE_INFINITY } : {}}
          style={{ opacity: 0.5 }}
        />
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-blue-300"
          animate={isActive ? { scale: [1, 1.6, 1] } : {}}
          transition={isActive ? { duration: 1.5, repeat: Number.POSITIVE_INFINITY } : {}}
          style={{ opacity: 0.3 }}
        />
        <span className="text-white font-bold text-sm text-center z-10">OTA Center</span>
      </motion.div>
      <p className="text-xs text-slate-400">Broadcasting Updates</p>
    </div>
  )
}
