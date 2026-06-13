import type { WeatherCondition } from '../../types/networkWeather';
import { conditionMeta, latencyBands } from './weatherVisuals';

const legendConditions: WeatherCondition[] = ['sunny', 'partly-cloudy', 'rainy', 'stormy'];

export default function WeatherLegend() {
  return (
    <div className="rounded-3xl border border-sage/40 bg-soft-blue/40 p-5">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-deep-blue">Legend</h3>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {legendConditions.map((condition) => {
          const { Icon, label, color } = conditionMeta[condition];
          return (
            <div key={condition} className="flex items-center gap-1.5 text-xs text-slate">
              <Icon size={22} style={{ color }} aria-hidden="true" />
              <span>{label}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-3 border-t border-sage/40 pt-3">
        <p className="mb-2 text-xs text-slate/70">Route color = round-trip latency</p>
        <div className="flex flex-col gap-1.5">
          {latencyBands.map((band) => (
            <div key={band.label} className="flex items-center gap-2 text-xs text-slate">
              <span
                className="h-1 w-6 rounded-full"
                style={{ backgroundColor: band.color }}
                aria-hidden="true"
              />
              <span>{band.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
