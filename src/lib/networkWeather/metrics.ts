import type {
  ProbeSample,
  ProbeTarget,
  TargetMetrics,
  WeatherCondition,
  WeatherSnapshot,
} from '../../types/networkWeather';

export function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

/** Interquartile range — a robust jitter estimate. */
export function iqr(values: number[]): number | null {
  if (values.length < 4) return values.length >= 2 ? spread(values) : null;
  const sorted = [...values].sort((a, b) => a - b);
  const q = (p: number) => {
    const idx = p * (sorted.length - 1);
    const lo = Math.floor(idx);
    const hi = Math.ceil(idx);
    return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
  };
  return q(0.75) - q(0.25);
}

function spread(values: number[]): number {
  return Math.max(...values) - Math.min(...values);
}

// Weather thresholds — tunable. Evaluated in order; first match wins.
//   unreachable: every attempt ever failed (likely adblocker/CSP, not weather)
//   unknown:     fewer than 3 samples so far
//   stormy:      ≥20% loss in window, or 2+ consecutive timeouts
//   rainy:       jitter > max(40ms, 0.5×latency), or any loss
//   partly-cloudy: latency ≥ 250ms, or jitter > max(20ms, 0.25×latency)
//   sunny:       otherwise
export function classifyCondition(
  history: ProbeSample[],
  latencyMs: number | null,
  jitterMs: number | null,
  lossRate: number,
): WeatherCondition {
  if (history.length > 0 && history.every((s) => s.durationMs === null)) return 'unreachable';
  if (history.length < 3) return 'unknown';
  const last2 = history.slice(-2);
  if (lossRate >= 0.2 || (last2.length === 2 && last2.every((s) => s.durationMs === null))) {
    return 'stormy';
  }
  if (latencyMs !== null && jitterMs !== null && jitterMs > Math.max(40, 0.5 * latencyMs)) {
    return 'rainy';
  }
  if (lossRate > 0) return 'rainy';
  if (
    (latencyMs !== null && latencyMs >= 250) ||
    (latencyMs !== null && jitterMs !== null && jitterMs > Math.max(20, 0.25 * latencyMs))
  ) {
    return 'partly-cloudy';
  }
  return 'sunny';
}

export function computeTargetMetrics(target: ProbeTarget, history: ProbeSample[]): TargetMetrics {
  const ok = history.filter((s) => s.durationMs !== null);
  const warm = ok.filter((s) => !s.cold).map((s) => s.durationMs as number);
  const all = ok.map((s) => s.durationMs as number);
  // Fall back to all samples if we only have cold ones yet
  const latencySamples = warm.length > 0 ? warm : all;

  const latencyMs = median(latencySamples);
  const jitterMs = iqr(latencySamples);
  const lossRate = history.length > 0 ? (history.length - ok.length) / history.length : 0;

  const coldDurations = ok.filter((s) => s.cold).map((s) => s.durationMs as number);
  let setupMs: number | null = null;
  if (coldDurations.length > 0 && warm.length > 0) {
    const m = median(coldDurations);
    const w = median(warm);
    if (m !== null && w !== null) setupMs = Math.max(0, m - w);
  }

  // Breakdown metrics from the most recent cold sample that carried one
  let dnsMs: number | null = null;
  let tlsMs: number | null = null;
  let ttfbMs: number | null = null;
  for (let i = history.length - 1; i >= 0; i--) {
    const b = history[i].breakdown;
    if (b && (b.dnsMs > 0 || b.tlsMs > 0)) {
      dnsMs = b.dnsMs;
      tlsMs = b.tlsMs;
      ttfbMs = b.ttfbMs;
      if (setupMs === null) setupMs = b.dnsMs + b.tcpMs + b.tlsMs;
      break;
    }
    if (b && ttfbMs === null) ttfbMs = b.ttfbMs;
  }

  return {
    target,
    latencyMs,
    jitterMs,
    lossRate,
    setupMs,
    dnsMs,
    tlsMs,
    ttfbMs,
    condition: classifyCondition(history, latencyMs, jitterMs, lossRate),
    history,
    sampleCount: history.length,
  };
}

const CONDITION_SEVERITY: Record<WeatherCondition, number> = {
  unknown: 0,
  unreachable: 0,
  sunny: 1,
  'partly-cloudy': 2,
  rainy: 3,
  stormy: 4,
};

export function computeOverall(targets: TargetMetrics[]): WeatherSnapshot['overall'] {
  const reachable = targets.filter(
    (t) => t.condition !== 'unreachable' && t.condition !== 'unknown',
  );
  if (reachable.length === 0) {
    return { condition: 'unknown', summary: 'Gathering first probe samples…' };
  }

  const worst = reachable.reduce((a, b) =>
    CONDITION_SEVERITY[b.condition] > CONDITION_SEVERITY[a.condition] ? b : a,
  );
  const latencies = reachable
    .map((t) => t.latencyMs)
    .filter((v): v is number => v !== null);
  const med = median(latencies);
  const medText = med !== null ? `median worldwide latency ${Math.round(med)} ms` : 'warming up';

  switch (worst.condition) {
    case 'stormy':
      return {
        condition: 'stormy',
        summary: `Storm over ${worst.target.label} — ${Math.round(worst.lossRate * 100)}% of probes failing. Elsewhere, ${medText}.`,
      };
    case 'rainy':
      return {
        condition: 'rainy',
        summary: `Rough air near ${worst.target.label} — jitter ${Math.round(worst.jitterMs ?? 0)} ms. Overall ${medText}.`,
      };
    case 'partly-cloudy':
      return {
        condition: 'partly-cloudy',
        summary: `Mostly clear with some haze around ${worst.target.label} — ${medText}.`,
      };
    default:
      return { condition: 'sunny', summary: `Clear skies across the internet — ${medText}.` };
  }
}
