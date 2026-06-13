import type { VisitorLocation } from '../../types/networkWeather';

const STORAGE_KEY = 'nw-visitor-location-v1';
const GEO_TIMEOUT_MS = 3000;

// Fixed fallback if both geo-IP services are blocked (e.g., adblockers)
const FALLBACK: VisitorLocation = {
  lat: 42.28,
  lng: -83.74,
  label: 'somewhere on Earth',
  approximate: false,
};

interface GeoService {
  url: string;
  parse: (json: Record<string, unknown>) => VisitorLocation | null;
}

const services: GeoService[] = [
  {
    url: 'https://ipwho.is/',
    parse: (j) => {
      if (j.success === false || typeof j.latitude !== 'number') return null;
      return {
        lat: j.latitude as number,
        lng: j.longitude as number,
        label: [j.city, j.country].filter(Boolean).join(', ') || 'your location',
        approximate: true,
      };
    },
  },
  {
    url: 'https://ipapi.co/json/',
    parse: (j) => {
      if (typeof j.latitude !== 'number') return null;
      return {
        lat: j.latitude as number,
        lng: j.longitude as number,
        label: [j.city, j.country_name].filter(Boolean).join(', ') || 'your location',
        approximate: true,
      };
    },
  },
];

export async function getVisitorLocation(): Promise<VisitorLocation> {
  try {
    const cached = sessionStorage.getItem(STORAGE_KEY);
    if (cached) return JSON.parse(cached) as VisitorLocation;
  } catch {
    // sessionStorage unavailable (private mode) — proceed without cache
  }

  for (const service of services) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), GEO_TIMEOUT_MS);
    try {
      const res = await fetch(service.url, { signal: controller.signal });
      if (!res.ok) continue;
      const location = service.parse(await res.json());
      if (location) {
        try {
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(location));
        } catch {
          // ignore
        }
        return location;
      }
    } catch {
      // blocked or timed out — try the next service
    } finally {
      clearTimeout(timer);
    }
  }
  return FALLBACK;
}
