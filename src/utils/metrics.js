export function calculateMetrics(nodes, latency, startTime) {
  const successCount = nodes.filter((n) => n.state === "updated").length
  const failureCount = nodes.filter((n) => n.state === "failed").length
  const totalNodes = nodes.length

  const elapsedTime = (Date.now() - startTime) / 1000
  const throughput = totalNodes > 0 ? totalNodes / elapsedTime : 0

  return {
    successCount,
    failureCount,
    averageLatency: latency,
    throughput,
    successRate: totalNodes > 0 ? (successCount / totalNodes) * 100 : 0,
  }
}

export function initializeNodes(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    state: "idle",
    timestamp: null,
  }))
}
