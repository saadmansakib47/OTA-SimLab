import { runLamportAlgorithm } from "./lamport";
import { runRicartAgrawalaAlgorithm } from "./ricartAgrawala";
import { runTokenRingAlgorithm } from "./tokenRing";
import { runObserverPatternAlgorithm } from "./observerPattern";
import { runMutexAlgorithm } from "./mutexBased";
import { runLockFreeAlgorithm } from "./lockFree";

export const algorithms = {
  lamport: runLamportAlgorithm,
  ricart: runRicartAgrawalaAlgorithm,
  tokenRing: runTokenRingAlgorithm,
  observer: runObserverPatternAlgorithm,
  mutex: runMutexAlgorithm,
  lockFree: runLockFreeAlgorithm,
};

export async function runAlgorithm(key, nodes, latency, failureRate, onUpdate = () => {}) {
  const fn = algorithms[key];
  if (!fn) throw new Error(`Algorithm not found: ${key}`);
  // All our implementations return metrics (or a promise resolving metrics).
  return await fn(nodes, latency, failureRate, onUpdate);
}