import { useEffect, useSyncExternalStore } from 'react';
import type { WeatherSnapshot } from '../types/networkWeather';
import { getNetworkWeatherProvider } from '../lib/networkWeather/BrowserProbeProvider';

export function useNetworkWeather(onScreen: boolean): WeatherSnapshot {
  const provider = getNetworkWeatherProvider();

  useEffect(() => {
    provider.start();
  }, [provider]);

  useEffect(() => {
    provider.setPaused(!onScreen);
  }, [provider, onScreen]);

  return useSyncExternalStore(
    (listener) => provider.subscribe(listener),
    () => provider.getSnapshot(),
  );
}
