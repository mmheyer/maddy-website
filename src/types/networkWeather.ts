export type ProbeKind = 'opaque' | 'timed' | 'dns';

export type WeatherCondition =
  | 'sunny'
  | 'partly-cloudy'
  | 'rainy'
  | 'stormy'
  | 'unknown'
  | 'unreachable';

export interface ProbeTarget {
  id: string;
  label: string;
  lat: number;
  lng: number;
  url: string;
  kind: ProbeKind;
}

export interface TimingBreakdown {
  dnsMs: number;
  tcpMs: number;
  tlsMs: number;
  ttfbMs: number;
}

export interface ProbeSample {
  /** epoch ms */
  t: number;
  /** null = timeout or network failure */
  durationMs: number | null;
  /** first sample on a (likely) fresh connection — includes DNS+TCP+TLS setup */
  cold: boolean;
  /** only available for 'timed' targets that send Timing-Allow-Origin */
  breakdown?: TimingBreakdown;
}

export interface TargetMetrics {
  target: ProbeTarget;
  /** median of warm samples in the rolling window */
  latencyMs: number | null;
  /** IQR of warm samples */
  jitterMs: number | null;
  /** failures / attempts in the rolling window */
  lossRate: number;
  /** estimated DNS+TCP+TLS setup (cold − median warm, or breakdown sum) */
  setupMs: number | null;
  dnsMs: number | null;
  tlsMs: number | null;
  ttfbMs: number | null;
  condition: WeatherCondition;
  history: ProbeSample[];
  sampleCount: number;
}

export interface VisitorLocation {
  lat: number;
  lng: number;
  label: string;
  approximate: boolean;
}

export interface WeatherSnapshot {
  visitor: VisitorLocation | null;
  /** stable order = probeTargets order */
  targets: TargetMetrics[];
  overall: { condition: WeatherCondition; summary: string };
  lastRoundAt: number | null;
  probing: boolean;
}

export interface WeatherDataProvider {
  start(): void;
  stop(): void;
  /** pause probing while the section is offscreen or the tab is hidden */
  setPaused(paused: boolean): void;
  /** immutable; new reference per update (useSyncExternalStore contract) */
  getSnapshot(): WeatherSnapshot;
  subscribe(listener: () => void): () => void;
}
