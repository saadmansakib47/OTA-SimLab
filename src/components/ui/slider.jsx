"use client"

import React from "react"
import { cn } from "../../utils/cn"

export const Slider = React.forwardRef(
  ({ className, min = 0, max = 100, step = 1, value, onChange, label, ...props }, ref) => {
    const percentage = ((value - min) / (max - min)) * 100
    
    return (
      <div className="w-full space-y-3">
        {label && (
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-slate-200 dark:text-slate-700">{label}</label>
            <span className="text-sm font-bold px-3 py-1 bg-blue-500/20 dark:bg-blue-400/20 text-blue-300 dark:text-blue-600 rounded-lg border border-blue-500/30 dark:border-blue-400/30">
              {value}
            </span>
          </div>
        )}
        <div className="relative">
          <div className="h-2.5 bg-slate-700/50 dark:bg-slate-300/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400 rounded-full transition-all duration-200 shadow-lg shadow-blue-500/50 dark:shadow-blue-400/30"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <input
            ref={ref}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className={cn(
              "absolute inset-0 w-full h-full opacity-0 cursor-pointer",
              className
            )}
            {...props}
          />
        </div>
      </div>
    )
  },
)

Slider.displayName = "Slider"
