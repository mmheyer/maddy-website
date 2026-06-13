import { useState } from 'react';
import { useNetworkWeather } from '../../hooks/useNetworkWeather';
import WeatherGlobe from './WeatherGlobe';
import ForecastSummary from './ForecastSummary';
import RegionDetailPanel from './RegionDetailPanel';
import WeatherLegend from './WeatherLegend';
import RegionList from './RegionList';

interface WeatherDashboardProps {
  onScreen: boolean;
}

export default function WeatherDashboard({ onScreen }: WeatherDashboardProps) {
  const snapshot = useNetworkWeather(onScreen);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = snapshot.targets.find((t) => t.target.id === selectedId) ?? null;

  return (
    <div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="h-[380px] overflow-hidden rounded-3xl border border-sage/40 bg-soft-blue/30 md:h-[480px] lg:col-span-2">
          <WeatherGlobe
            snapshot={snapshot}
            selectedId={selectedId}
            onSelectTarget={setSelectedId}
          />
        </div>
        <div className="flex flex-col gap-4">
          <ForecastSummary snapshot={snapshot} />
          <RegionDetailPanel selected={selected} />
          <WeatherLegend />
        </div>
      </div>
      <div className="mt-6">
        <RegionList
          targets={snapshot.targets}
          selectedId={selectedId}
          onSelectTarget={setSelectedId}
        />
      </div>
    </div>
  );
}
