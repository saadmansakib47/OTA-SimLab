export async function runRicartAgrawalaAlgorithm(nodesIn, latency = 100, failureRate = 0, onUpdate = () => {}) {
  const start = Date.now()
  const randDelay = () => Math.max(5, Math.round((Math.random() * latency)))
  const cloned = nodesIn.map(n => ({ ...n }))
  const nodes = {}
  cloned.forEach(n => {
    const id = n.id ?? n.name ?? String(Math.random())
    nodes[id] = {
      id,
      clock: n.clock ?? 0,
      requesting: false,
      requestTs: undefined,
      replies: new Set(),
      deferred: new Set(),
      meta: n
    }
    nodes[id].meta.id = id
  })

  let messageCount = 0
  let deliveredLatencySum = 0
  function emit(e) { try { onUpdate(e) } catch (_) {} }

  async function sendRequest(toId, fromId, ts) {
    const delay = randDelay()
    messageCount++; deliveredLatencySum += delay
    emit({ type: 'messageSent', from: fromId, to: toId, kind: 'REQUEST', ts, delay })
    await new Promise(r => setTimeout(r, delay))
    const recv = nodes[toId]
    recv.clock = Math.max(recv.clock, ts) + 1
    emit({ type: 'messageDelivered', from: fromId, to: toId, kind: 'REQUEST', ts })
    emit({ type: 'clock', nodeId: toId, clock: recv.clock })

    // decide reply or defer
    const shouldDefer =
      recv.requesting &&
      ((recv.requestTs ?? Infinity) < ts || ((recv.requestTs ?? Infinity) === ts && recv.id < fromId))

    if (shouldDefer) {
      recv.deferred.add(fromId)
      emit({ type: 'deferred', nodeId: toId, deferredFrom: fromId })
    } else {
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
  }

  async function sendDeferredReplies(fromId) {
    const self = nodes[fromId]
    const deferred = Array.from(self.deferred)
    self.deferred.clear()
    for (const d of deferred) {
      self.clock += 1
      emit({ type: 'clock', nodeId: fromId, clock: self.clock })
      messageCount++
      const delay = randDelay()
      deliveredLatencySum += delay
      emit({ type: 'messageSent', from: fromId, to: d, kind: 'REPLY', ts: self.clock, delay })
      await new Promise(r => setTimeout(r, delay))
      const recv = nodes[d]
      recv.clock = Math.max(recv.clock, self.clock) + 1
      recv.replies.add(fromId)
      emit({ type: 'messageDelivered', from: fromId, to: d, kind: 'REPLY', ts: self.clock })
      emit({ type: 'clock', nodeId: d, clock: recv.clock })
    }
  }

  const allIds = Object.keys(nodes)
  const workerPromises = allIds.map(async id => {
    const self = nodes[id]
    const fail = Math.random() < failureRate / 100
    if (fail) { self.meta.state = 'failed'; emit({ type: 'nodeFailed', nodeId: id }); return }

    // create request
    self.clock += 1
    const myTs = self.clock
    self.requesting = true
    self.requestTs = myTs
    self.replies = new Set()
    emit({ type: 'clock', nodeId: id, clock: self.clock })
    emit({ type: 'request', nodeId: id, ts: myTs })

    // multicast REQUEST
    const targets = allIds.filter(x => x !== id)
    await Promise.all(targets.map(t => sendRequest(t, id, myTs)))

    // wait until replies from all others
    while (self.replies.size < (allIds.length - 1)) {
      await new Promise(r => setTimeout(r, 15))
    }

    // enter cs
    emit({ type: 'enter', nodeId: id, clock: self.clock })
    await new Promise(r => setTimeout(r, 150 + Math.random() * 300))
    self.meta.state = 'updated'
    emit({ type: 'applied', nodeId: id })

    // exit and send deferred
    self.clock += 1
    emit({ type: 'clock', nodeId: id, clock: self.clock })
    self.requesting = false
    self.requestTs = undefined
    await sendDeferredReplies(id)
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