import type { ProbeSample, ProbeTarget, TimingBreakdown } from '../../types/networkWeather';

const DEFAULT_TIMEOUT_MS = 5000;

function cacheBuster(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}

function withTimeout(timeoutMs: number): { signal: AbortSignal; cancel: () => void } {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return { signal: controller.signal, cancel: () => clearTimeout(timer) };
}

/**
 * Total round-trip time via a no-cors fetch. Opaque responses resolve even on
 * 4xx, so the duration is a valid RTT; only network failure/timeout is a loss.
 */
export async function probeOpaque(
  target: ProbeTarget,
  cold: boolean,
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<ProbeSample> {
  const sep = target.url.includes('?') ? '&' : '?';
  const url = `${target.url}${sep}cb=${cacheBuster()}`;
  const { signal, cancel } = withTimeout(timeoutMs);
  const start = performance.now();
  try {
    await fetch(url, { mode: 'no-cors', cache: 'no-store', signal });
    return { t: Date.now(), durationMs: performance.now() - start, cold };
  } catch {
    return { t: Date.now(), durationMs: null, cold };
  } finally {
    cancel();
  }
}

/**
 * CORS fetch against an endpoint that sends Timing-Allow-Origin, then reads
 * the PerformanceResourceTiming entry for a DNS/TCP/TLS/TTFB breakdown.
 * Breakdown fields are zero on warm (reused) connections.
 */
export async function probeTimed(
  target: ProbeTarget,
  cold: boolean,
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<ProbeSample> {
  const sep = target.url.includes('?') ? '&' : '?';
  const url = `${target.url}${sep}cb=${cacheBuster()}`;
  const { signal, cancel } = withTimeout(timeoutMs);
  const start = performance.now();
  try {
    await fetch(url, { cache: 'no-store', signal });
    const durationMs = performance.now() - start;
    let breakdown: TimingBreakdown | undefined;
    const entries = performance.getEntriesByName(url) as PerformanceResourceTiming[];
    const entry = entries[entries.length - 1];
    if (entry && entry.responseStart > 0) {
      breakdown = {
        dnsMs: entry.domainLookupEnd - entry.domainLookupStart,
        tcpMs:
          (entry.secureConnectionStart > 0 ? entry.secureConnectionStart : entry.connectEnd) -
          entry.connectStart,
        tlsMs: entry.secureConnectionStart > 0 ? entry.connectEnd - entry.secureConnectionStart : 0,
        ttfbMs: entry.responseStart - entry.requestStart,
      };
    }
    return { t: Date.now(), durationMs, cold, breakdown };
  } catch {
    return { t: Date.now(), durationMs: null, cold };
  } finally {
    cancel();
  }
}

/**
 * DNS resolver response time via a DNS-over-HTTPS JSON query. A random
 * subdomain defeats resolver-side caching so each probe does real work.
 */
export async function probeDns(
  target: ProbeTarget,
  cold: boolean,
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<ProbeSample> {
  const name = `${cacheBuster().replace(/-/g, '').slice(0, 12)}.example.com`;
  const url = `${target.url}?name=${name}&type=A`;
  const { signal, cancel } = withTimeout(timeoutMs);
  const start = performance.now();
  try {
    await fetch(url, {
      cache: 'no-store',
      signal,
      headers: { accept: 'application/dns-json' },
    });
    return { t: Date.now(), durationMs: performance.now() - start, cold };
  } catch {
    return { t: Date.now(), durationMs: null, cold };
  } finally {
    cancel();
  }
}

export function probeTarget(
  target: ProbeTarget,
  cold: boolean,
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<ProbeSample> {
  switch (target.kind) {
    case 'timed':
      return probeTimed(target, cold, timeoutMs);
    case 'dns':
      return probeDns(target, cold, timeoutMs);
    default:
      return probeOpaque(target, cold, timeoutMs);
  }
}
