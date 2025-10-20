export function runObserverPatternAlgorithm(nodes, latency, failureRate) {
  // TODO: Implement observer pattern based OTA propagation
  // Nodes subscribe to OTA center and receive notifications
  return nodes.map((node) => ({
    ...node,
    state: Math.random() < failureRate / 100 ? "failed" : "updated",
  }))
}
