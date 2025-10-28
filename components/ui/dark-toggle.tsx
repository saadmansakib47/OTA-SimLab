"use client"

import React, { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'

export default function DarkToggle() {
  const { theme, setTheme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const resolvedTheme = theme === 'system' ? systemTheme : theme

  const isDark = resolvedTheme === 'dark'

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      title={isDark ? 'Light' : 'Dark'}
    >
      {isDark ? (
        // Sun icon (switch to light)
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
          <path d="M12 4.5a1 1 0 011 1V8a1 1 0 11-2 0V5.5a1 1 0 011-1zM12 16a4 4 0 100-8 4 4 0 000 8zm7.5-4a1 1 0 01-1 1H18a1 1 0 110-2h.5a1 1 0 011 1zM6 12a1 1 0 01-1-1H4.5a1 1 0 110 2H5a1 1 0 011-1zM18.364 18.364a1 1 0 01-1.414 0l-.707-.707a1 1 0 011.414-1.414l.707.707a1 1 0 010 1.414zM7.757 5.636a1 1 0 01-1.414 0L5.636 4.93A1 1 0 017.05 3.515l.707.707a1 1 0 010 1.414zM18.364 5.636a1 1 0 010 1.414l-.707.707A1 1 0 0116.243 6.05l.707-.707a1 1 0 011.414 0zM7.757 18.364a1 1 0 010-1.414l.707-.707a1 1 0 011.414 1.414l-.707.707a1 1 0 01-1.414 0z" />
        </svg>
      ) : (
        // Moon icon (switch to dark)
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      )}
    </Button>
  )
}
