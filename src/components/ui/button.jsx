import React from "react"
import { cva } from "class-variance-authority"
import { cn } from "../../utils/cn"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-95 transform",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 shadow-blue-500/50 dark:shadow-blue-400/30",
        secondary: "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-purple-500/50 dark:shadow-purple-400/30",
        outline: "border-2 border-slate-600 dark:border-slate-300 text-slate-300 dark:text-slate-700 hover:bg-slate-700/50 dark:hover:bg-slate-200/50 shadow-slate-500/20",
        ghost: "text-slate-300 dark:text-slate-700 hover:bg-slate-700/50 dark:hover:bg-slate-200/50 shadow-none",
        success: "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-emerald-500/50 dark:shadow-emerald-400/30",
        danger: "bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-700 hover:to-rose-700 shadow-red-500/50 dark:shadow-red-400/30",
      },
      size: {
        sm: "px-3 py-1.5 text-sm",
        md: "px-5 py-2.5 text-base",
        lg: "px-7 py-3.5 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
)

export const Button = React.forwardRef(({ className, variant, size, ...props }, ref) => (
  <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
))

Button.displayName = "Button"
