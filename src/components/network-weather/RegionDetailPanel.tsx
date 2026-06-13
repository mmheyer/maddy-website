import type { TargetMetrics } from '../../types/networkWeather';
import { conditionMeta, formatMs } from './weatherVisuals';
import Sparkline from './Sparkline';

interface RegionDetailPanelProps {
  selected: TargetMetrics | null;
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-slate/70">{label}</dt>
      <dd className="text-sm font-semibold text-deep-blue">{value}</dd>
    </div>
  );
}

function TimingBar({ label, ms, maxMs }: { label: string; ms: number; maxMs: number }) {
  const pct = Math.max(2, Math.min(100, (ms / maxMs) * 100));
  return (
    <div className="flex items-center gap-2 text-xs text-slate">
      <span className="w-10 shrink-0">{label}</span>
      <div className="h-1.5 flex-1 rounded-full bg-sage/40">
        <div
          className="h-full rounded-full bg-accent-blue"
          style={{ width: `${pct}%` }}
          aria-hidden="true"
        />
      </div>
      <span className="w-14 shrink-0 text-right">{formatMs(ms)}</span>
    </div>
  );
}

export default function RegionDetailPanel({ selected }: RegionDetailPanelProps) {
  if (!selected) {
    return (
      <div className="rounded-3xl border border-sage/40 bg-soft-blue/40 p-5">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-deep-blue">
          Region detail
        </h3>
        <p className="mt-2 text-sm text-slate/70">
          Click a point on the globe — or a region below — to inspect its metrics.
        </p>
      </div>
    );
  }

  const { Icon, label, color } = conditionMeta[selected.condition];
  const hasBreakdown =
    selected.dnsMs !== null || selected.tlsMs !== null || selected.ttfbMs !== null;
  const breakdownMax = Math.max(
    selected.dnsMs ?? 0,
    selected.tlsMs ?? 0,
    selected.ttfbMs ?? 0,
    1,
  );

  return (
    <div className="rounded-3xl border border-sage/40 bg-soft-blue/40 p-5">
      <div className="flex items-center gap-2">
        <Icon size={32} style={{ color }} className="shrink-0" aria-hidden="true" />
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-deep-blue">{selected.target.label}</h3>
          <p className="text-xs text-slate/70">{label}</p>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3">
        <Stat label="Latency (median)" value={formatMs(selected.latencyMs)} />
        <Stat label="Jitter (IQR)" value={formatMs(selected.jitterMs)} />
        <Stat label="Probe loss" value={`${Math.round(selected.lossRate * 100)}%`} />
        <Stat label="Conn. setup (est.)" value={formatMs(selected.setupMs)} />
      </dl>

      {hasBreakdown && (
        <div className="mt-4 flex flex-col gap-1.5 border-t border-sage/40 pt-3">
          <p className="mb-1 text-xs text-slate/70">Handshake breakdown (last cold connection)</p>
          {selected.dnsMs !== null && <TimingBar label="DNS" ms={selected.dnsMs} maxMs={breakdownMax} />}
          {selected.tlsMs !== null && <TimingBar label="TLS" ms={selected.tlsMs} maxMs={breakdownMax} />}
          {selected.ttfbMs !== null && (
            <TimingBar label="TTFB" ms={selected.ttfbMs} maxMs={breakdownMax} />
          )}
        </div>
      )}

      <div className="mt-4 border-t border-sage/40 pt-3">
        <p className="mb-1 text-xs text-slate/70">
          Last {selected.sampleCount} probes (gaps = failures)
        </p>
        <Sparkline history={selected.history} className="h-10 w-full text-accent-blue" />
      </div>
    </div>
  );
}
