import type React from "react"
import type { Metadata } from "next"
import "@/src/index.css"
import { ThemeProvider } from '@/components/theme-provider'
import DarkToggle from '@/components/ui/dark-toggle'

export const metadata: Metadata = {
  title: "OTA Update Visual Simulator",
  description: "Visualize Over-The-Air updates in a distributed network",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <body className="bg-background text-foreground">
          <div className="min-h-screen">
            <div className="fixed top-4 right-4 z-50">
              <DarkToggle />
            </div>
            {children}
          </div>
        </body>
      </ThemeProvider>
    </html>
  )
}
