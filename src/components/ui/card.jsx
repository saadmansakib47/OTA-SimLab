import React from "react"
import { cn } from "../../utils/cn"

export const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-2xl border border-slate-700/50 dark:border-slate-200/50",
      "bg-slate-800/40 dark:bg-white/40 backdrop-blur-xl",
      "shadow-xl shadow-black/20 dark:shadow-slate-400/10",
      "hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20",
      "transition-all duration-300",
      "text-white dark:text-slate-900",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

export const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn(
      "flex flex-col space-y-1.5 p-5 sm:p-6 border-b border-slate-700/30 dark:border-slate-200/30", 
      className
    )} 
    {...props} 
  />
))
CardHeader.displayName = "CardHeader"

export const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h2 
    ref={ref} 
    className={cn(
      "text-lg sm:text-xl font-bold leading-none tracking-tight",
      "text-slate-100 dark:text-slate-800", 
      className
    )} 
    {...props} 
  />
))
CardTitle.displayName = "CardTitle"

export const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p 
    ref={ref} 
    className={cn(
      "text-sm text-slate-400 dark:text-slate-600", 
      className
    )} 
    {...props} 
  />
))
CardDescription.displayName = "CardDescription"

export const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-5 sm:p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

export const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center p-5 sm:p-6 pt-0", className)} {...props} />
))
CardFooter.displayName = "CardFooter"
