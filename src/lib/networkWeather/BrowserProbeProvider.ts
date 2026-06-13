import type {
  ProbeSample,
  ProbeTarget,
  WeatherDataProvider,
  WeatherSnapshot,
} from '../../types/networkWeather';
import { probeTargets } from '../../data/probeTargets';
import { probeTarget } from './probe';
import { computeOverall, computeTargetMetrics } from './metrics';
import { getVisitorLocation } from './geolocate';

const ROUND_INTERVAL_MS = 20_000;
const SAMPLES_PER_ROUND = 3;
const SAMPLE_SPACING_MS = 300;
const MAX_CONCURRENT_TARGETS = 5;
const HISTORY_CAP = 40;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Browser-side implementation of WeatherDataProvider: probes public endpoints
 * from the visitor's browser in polite rounds. A future backend-fed provider
 * (e.g., Cloudflare Worker cron + KV) can implement the same interface and be
 * swapped in without touching the UI layer.
 */
export class BrowserProbeProvider implements WeatherDataProvider {
  private targets: ProbeTarget[];
  private history = new Map<string, ProbeSample[]>();
  private listeners = new Set<() => void>();
  private snapshot: WeatherSnapshot;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private roundActive = false;
  private roundAborted = false;
  private started = false;
  private paused = false;
  private hidden = false;
  private visitorRequested = false;

  constructor(targets: ProbeTarget[] = probeTargets) {
    this.targets = targets;
    this.snapshot = this.buildSnapshot(null, false);
  }

  start(): void {
    if (this.started) return;
    this.started = true;
    document.addEventListener('visibilitychange', this.onVisibilityChange);
    this.hidden = document.visibilityState === 'hidden';
    if (!this.visitorRequested) {
      this.visitorRequested = true;
      void getVisitorLocation().then((visitor) => {
        this.snapshot = { ...this.snapshot, visitor };
        this.emit();
      });
    }
    this.scheduleRound(0);
  }

  stop(): void {
    this.started = false;
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
    this.cancelPending();
  }

  setPaused(paused: boolean): void {
    if (this.paused === paused) return;
    this.paused = paused;
    this.applyRunState();
  }

  getSnapshot(): WeatherSnapshot {
    return this.snapshot;
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private onVisibilityChange = () => {
    this.hidden = document.visibilityState === 'hidden';
    this.applyRunState();
  };

  private get shouldRun(): boolean {
    return this.started && !this.paused && !this.hidden;
  }

  private applyRunState(): void {
    if (this.shouldRun) {
      if (!this.timer && !this.roundActive) this.scheduleRound(0);
    } else {
      this.cancelPending();
    }
  }

  private cancelPending(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.roundAborted = true;
  }

  private scheduleRound(delayMs: number): void {
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.timer = null;
      void this.runRound();
    }, delayMs);
  }

  private async runRound(): Promise<void> {
    if (!this.shouldRun || this.roundActive) return;
    this.roundActive = true;
    this.roundAborted = false;
    this.snapshot = { ...this.snapshot, probing: true };
    this.emit();

    // Concurrency pool: never more than MAX_CONCURRENT_TARGETS targets
    // in flight, so our own probes don't congest the visitor's link.
    const queue = [...this.targets];
    const workers = Array.from({ length: MAX_CONCURRENT_TARGETS }, async () => {
      for (let target = queue.shift(); target; target = queue.shift()) {
        if (this.roundAborted) return;
        await this.sampleTarget(target);
      }
    });
    await Promise.all(workers);

    // Resource timing entries accumulate against a 250-entry buffer cap
    performance.clearResourceTimings();

    this.roundActive = false;
    this.snapshot = this.buildSnapshot(Date.now(), false);
    this.emit();
    if (this.shouldRun) this.scheduleRound(ROUND_INTERVAL_MS);
  }

  private async sampleTarget(target: ProbeTarget): Promise<void> {
    const existing = this.history.get(target.id) ?? [];
    // Cold = first-ever sample, or first after a failure (browser likely
    // dropped the connection). Keep-alive keeps connections warm between
    // rounds, which makes warm RTT stable — that's what we want.
    const last = existing[existing.length - 1];
    let cold = existing.length === 0 || last?.durationMs === null;

    for (let i = 0; i < SAMPLES_PER_ROUND; i++) {
      if (this.roundAborted) return;
      const sample = await probeTarget(target, cold);
      cold = sample.durationMs === null;
      const samples = this.history.get(target.id) ?? [];
      samples.push(sample);
      if (samples.length > HISTORY_CAP) samples.splice(0, samples.length - HISTORY_CAP);
      this.history.set(target.id, samples);
      if (i < SAMPLES_PER_ROUND - 1) await sleep(SAMPLE_SPACING_MS);
    }
  }

  private buildSnapshot(lastRoundAt: number | null, probing: boolean): WeatherSnapshot {
    const targets = this.targets.map((t) =>
      computeTargetMetrics(t, [...(this.history.get(t.id) ?? [])]),
    );
    return {
      visitor: this.snapshot?.visitor ?? null,
      targets,
      overall: computeOverall(targets),
      lastRoundAt: lastRoundAt ?? this.snapshot?.lastRoundAt ?? null,
      probing,
    };
  }

  private emit(): void {
    for (const listener of this.listeners) listener();
  }
}

let singleton: BrowserProbeProvider | null = null;

/** Singleton so StrictMode double-mounting never creates two probe loops. */
export function getNetworkWeatherProvider(): WeatherDataProvider {
  if (!singleton) singleton = new BrowserProbeProvider();
  return singleton;
}
