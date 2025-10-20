import type React from "react"
import type { Metadata } from "next"
import "@/src/index.css"

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
      <body>{children}</body>
    </html>
  )
}
