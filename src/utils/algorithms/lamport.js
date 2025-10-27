export async function runLamportAlgorithm(nodesIn, latency = 100, failureRate = 0, onUpdate = () => {}) {
  const start = Date.now()
  const randDelay = () => Math.max(5, Math.round((Math.random() * latency)))
  const nodes = {}
  const cloned = nodesIn.map(n => ({ ...n }))
  cloned.forEach(n => {
    const id = n.id ?? n.name ?? String(Math.random())
    nodes[id] = {
      id,
      clock: n.clock ?? 0,
      queue: [], // {id, ts}
      requesting: false,
      requestTs: undefined,
      replies: new Set(),
      meta: n
    }
    // make sure meta has id
    nodes[id].meta.id = id
  })

  let messageCount = 0
  let deliveredLatencySum = 0
  function emit(e) { try { onUpdate(e) } catch (_) {} }

  function sortQueue(q) {
    q.sort((a, b) => a.ts - b.ts || String(a.id).localeCompare(String(b.id)))
  }

  async function deliverRequest(toId, fromId, ts) {
    const delay = randDelay()
    messageCount++; deliveredLatencySum += delay
    emit({ type: 'messageSent', from: fromId, to: toId, kind: 'REQUEST', ts, delay })
    await new Promise(r => setTimeout(r, delay))
    const recv = nodes[toId]
    recv.clock = Math.max(recv.clock, ts) + 1
    recv.queue.push({ id: fromId, ts })
    sortQueue(recv.queue)
    emit({ type: 'messageDelivered', from: fromId, to: toId, kind: 'REQUEST', ts })
    emit({ type: 'clock', nodeId: toId, clock: recv.clock })
    emit({ type: 'queue', nodeId: toId, queue: recv.queue.map(x => ({ ...x })) })

    // immediate reply
    recv.clock += 1
    const replyTs = recv.clock
    emit({ type: 'clock', nodeId: toId, clock: recv.clock })
    const replyDelay = randDelay()
    messageCount++; deliveredLatencySum += replyDelay
    emit({ type: 'messageSent', from: toId, to: fromId, kind: 'REPLY', ts: replyTs, delay: replyDelay })
    await new Promise(r => setTimeout(r, replyDelay))
    const sender = nodes[fromId]
    sender.clock = Math.max(sender.clock, replyTs) + 1
    sender.replies.add(toId)
    emit({ type: 'messageDelivered', from: toId, to: fromId, kind: 'REPLY', ts: replyTs })
    emit({ type: 'clock', nodeId: fromId, clock: sender.clock })
  }

  async function deliverRelease(toId, fromId, ts) {
    const delay = randDelay()
    messageCount++; deliveredLatencySum += delay
    emit({ type: 'messageSent', from: fromId, to: toId, kind: 'RELEASE', ts, delay })
    await new Promise(r => setTimeout(r, delay))
    const recv = nodes[toId]
    recv.clock = Math.max(recv.clock, ts) + 1
    recv.queue = recv.queue.filter(q => q.id !== fromId)
    emit({ type: 'messageDelivered', from: fromId, to: toId, kind: 'RELEASE', ts })
    emit({ type: 'clock', nodeId: toId, clock: recv.clock })
    emit({ type: 'queue', nodeId: toId, queue: recv.queue.map(x => ({ ...x })) })
  }

  // Start all nodes requesting concurrently
  const allIds = Object.keys(nodes)
  const workerPromises = allIds.map(async (id) => {
    const self = nodes[id]
    // decide if this node fails before sending request (simulate failureRate)
    const fail = Math.random() < failureRate / 100
    if (fail) {
      self.meta.state = 'failed'
      emit({ type: 'nodeFailed', nodeId: id })
      return
    }

    // create request
    self.clock += 1
    const myTs = self.clock
    self.requesting = true
    self.requestTs = myTs
    self.replies = new Set()
    self.queue.push({ id, ts: myTs })
    sortQueue(self.queue)
    emit({ type: 'clock', nodeId: id, clock: self.clock })
    emit({ type: 'queue', nodeId: id, queue: self.queue.map(x => ({ ...x })) })
    emit({ type: 'request', nodeId: id, ts: myTs })

    // multicast REQUEST to others
    const targets = allIds.filter(x => x !== id)
    await Promise.all(targets.map(t => deliverRequest(t, id, myTs)))

    // wait until have replies from all and top of queue
    while (self.replies.size < (allIds.length - 1) || self.queue[0]?.id !== id) {
      await new Promise(r => setTimeout(r, 15))
    }

    // enter critical section / apply update
    emit({ type: 'enter', nodeId: id, clock: self.clock })
    await new Promise(r => setTimeout(r, 150 + Math.random() * 300))
    self.meta.state = 'updated'
    emit({ type: 'applied', nodeId: id })

    // release
    self.clock += 1
    emit({ type: 'clock', nodeId: id, clock: self.clock })
    self.requesting = false
    self.requestTs = undefined
    self.queue = self.queue.filter(q => q.id !== id)
    emit({ type: 'queue', nodeId: id, queue: self.queue.map(x => ({ ...x })) })

    // multicast RELEASE
    await Promise.all(allIds.filter(x => x !== id).map(t => deliverRelease(t, id, self.clock)))
    emit({ type: 'exit', nodeId: id, clock: self.clock })
  })

  await Promise.all(workerPromises)

  const totalTime = Date.now() - start
  const metrics = {
    messages: messageCount,
    totalTime,
    averageLatency: messageCount ? Math.round(deliveredLatencySum / messageCount) : 0,
    successCount: cloned.filter(n => n.state === 'updated').length
  }
  emit({ type: 'metrics', metrics })
  return metrics
}