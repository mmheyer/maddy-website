import type { TargetMetrics } from '../../types/networkWeather';
import { conditionMeta, formatMs } from './weatherVisuals';
import Sparkline from './Sparkline';

interface RegionListProps {
  targets: TargetMetrics[];
  selectedId: string | null;
  onSelectTarget: (id: string | null) => void;
}

/**
 * Keyboard-accessible list of all probed regions — the non-WebGL way to
 * explore the same data the globe shows.
 */
export default function RegionList({ targets, selectedId, onSelectTarget }: RegionListProps) {
  return (
    <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3" aria-label="Probed regions">
      {targets.map((t) => {
        const { Icon, label, color } = conditionMeta[t.condition];
        const selected = t.target.id === selectedId;
        return (
          <li key={t.target.id}>
            <button
              type="button"
              onClick={() => onSelectTarget(selected ? null : t.target.id)}
              aria-pressed={selected}
              className={`flex w-full items-center gap-2 rounded-2xl border px-3 py-2 text-left transition-colors ${
                selected
                  ? 'border-accent-blue bg-soft-blue'
                  : 'border-sage/40 bg-cream hover:bg-soft-blue/50'
              }`}
            >
              <Icon size={26} style={{ color }} className="shrink-0" aria-label={label} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-medium text-deep-blue">
                  {t.target.label}
                </span>
                <span className="block text-xs text-slate/70">{formatMs(t.latencyMs)}</span>
              </span>
              <Sparkline history={t.history} className="h-7 w-16 shrink-0 text-accent-blue/70" />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
