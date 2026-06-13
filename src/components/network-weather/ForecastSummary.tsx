import { useEffect, useState } from 'react';
import type { WeatherSnapshot } from '../../types/networkWeather';
import { conditionMeta } from './weatherVisuals';

interface ForecastSummaryProps {
  snapshot: WeatherSnapshot;
}

function ago(t: number, now: number): string {
  const s = Math.max(0, Math.round((now - t) / 1000));
  return s < 5 ? 'just now' : `${s}s ago`;
}

export default function ForecastSummary({ snapshot }: ForecastSummaryProps) {
  const { Icon, color } = conditionMeta[snapshot.overall.condition];
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="rounded-3xl border border-sage/40 bg-soft-blue/40 p-5">
      <div className="flex items-start gap-3">
        <Icon size={40} style={{ color }} className="shrink-0" aria-hidden="true" />
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-deep-blue">
            Current forecast
          </h3>
          <p className="mt-1 text-sm text-slate">{snapshot.overall.summary}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs text-slate/70">
        {snapshot.probing ? (
          <>
            <span className="h-2 w-2 animate-pulse rounded-full bg-accent-blue" aria-hidden="true" />
            <span>probing…</span>
          </>
        ) : snapshot.lastRoundAt ? (
          <>
            <span className="h-2 w-2 rounded-full bg-accent-sage" aria-hidden="true" />
            <span>last round {ago(snapshot.lastRoundAt, now)}</span>
          </>
        ) : (
          <span>waiting for first probe round…</span>
        )}
        {snapshot.visitor && (
          <span className="ml-auto">
            from {snapshot.visitor.approximate ? '≈ ' : ''}
            {snapshot.visitor.label}
          </span>
        )}
      </div>
    </div>
  );
}
