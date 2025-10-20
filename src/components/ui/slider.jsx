"use client"

import React from "react"
import { cn } from "../../utils/cn"

export const Slider = React.forwardRef(
  ({ className, min = 0, max = 100, step = 1, value, onChange, label, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-white">{label}</label>
            <span className="text-sm text-slate-400">{value}</span>
          </div>
        )}
        <input
          ref={ref}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={cn("w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600", className)}
          {...props}
        />
      </div>
    )
  },
)

Slider.displayName = "Slider"
