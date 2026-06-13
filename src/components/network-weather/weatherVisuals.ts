import type { IconType } from 'react-icons';
import {
  WiDaySunny,
  WiDayCloudy,
  WiRain,
  WiThunderstorm,
  WiCloud,
  WiNa,
} from 'react-icons/wi';
import type { WeatherCondition } from '../../types/networkWeather';

export const conditionMeta: Record<
  WeatherCondition,
  { label: string; color: string; Icon: IconType }
> = {
  sunny: { label: 'Sunny', color: '#6B9080', Icon: WiDaySunny },
  'partly-cloudy': { label: 'Partly cloudy', color: '#94A3B8', Icon: WiDayCloudy },
  rainy: { label: 'Rainy', color: '#F59E0B', Icon: WiRain },
  stormy: { label: 'Stormy', color: '#F43F5E', Icon: WiThunderstorm },
  unknown: { label: 'Gathering data', color: '#CBD5E1', Icon: WiCloud },
  unreachable: { label: 'No data (blocked?)', color: '#CBD5E1', Icon: WiNa },
};

export const latencyBands = [
  { max: 80, color: '#6B9080', label: '< 80 ms' },
  { max: 180, color: '#3B82F6', label: '80–180 ms' },
  { max: 350, color: '#F59E0B', label: '180–350 ms' },
  { max: Infinity, color: '#F43F5E', label: '≥ 350 ms / timeout' },
];

export function latencyColor(ms: number | null): string {
  if (ms === null) return '#F43F5E';
  for (const band of latencyBands) {
    if (ms < band.max) return band.color;
  }
  return '#F43F5E';
}

export function formatMs(ms: number | null): string {
  return ms === null ? '—' : `${Math.round(ms)} ms`;
}
