import type { ProbeTarget } from '../types/networkWeather';

// Opaque targets are timed with performance.now() around a no-cors fetch
// (total RTT only). The Cloudflare 'timed' target sends Timing-Allow-Origin,
// so it yields a full DNS/TCP/TLS/TTFB breakdown. DNS targets measure
// resolver response time via DNS-over-HTTPS JSON APIs.
export const probeTargets: ProbeTarget[] = [
  // AWS regional endpoints (lat/lng = region metro)
  { id: 'aws-us-east-1', label: 'N. Virginia · us-east-1', lat: 38.95, lng: -77.45, url: 'https://dynamodb.us-east-1.amazonaws.com/', kind: 'opaque' },
  { id: 'aws-us-west-2', label: 'Oregon · us-west-2', lat: 45.84, lng: -119.7, url: 'https://dynamodb.us-west-2.amazonaws.com/', kind: 'opaque' },
  { id: 'aws-ca-central-1', label: 'Montréal · ca-central-1', lat: 45.5, lng: -73.57, url: 'https://dynamodb.ca-central-1.amazonaws.com/', kind: 'opaque' },
  { id: 'aws-sa-east-1', label: 'São Paulo · sa-east-1', lat: -23.55, lng: -46.63, url: 'https://dynamodb.sa-east-1.amazonaws.com/', kind: 'opaque' },
  { id: 'aws-eu-west-1', label: 'Dublin · eu-west-1', lat: 53.35, lng: -6.26, url: 'https://dynamodb.eu-west-1.amazonaws.com/', kind: 'opaque' },
  { id: 'aws-eu-central-1', label: 'Frankfurt · eu-central-1', lat: 50.11, lng: 8.68, url: 'https://dynamodb.eu-central-1.amazonaws.com/', kind: 'opaque' },
  { id: 'aws-eu-north-1', label: 'Stockholm · eu-north-1', lat: 59.33, lng: 18.07, url: 'https://dynamodb.eu-north-1.amazonaws.com/', kind: 'opaque' },
  { id: 'aws-af-south-1', label: 'Cape Town · af-south-1', lat: -33.92, lng: 18.42, url: 'https://dynamodb.af-south-1.amazonaws.com/', kind: 'opaque' },
  { id: 'aws-me-south-1', label: 'Bahrain · me-south-1', lat: 26.07, lng: 50.55, url: 'https://dynamodb.me-south-1.amazonaws.com/', kind: 'opaque' },
  { id: 'aws-ap-south-1', label: 'Mumbai · ap-south-1', lat: 19.08, lng: 72.88, url: 'https://dynamodb.ap-south-1.amazonaws.com/', kind: 'opaque' },
  { id: 'aws-ap-southeast-1', label: 'Singapore · ap-southeast-1', lat: 1.35, lng: 103.82, url: 'https://dynamodb.ap-southeast-1.amazonaws.com/', kind: 'opaque' },
  { id: 'aws-ap-southeast-2', label: 'Sydney · ap-southeast-2', lat: -33.87, lng: 151.21, url: 'https://dynamodb.ap-southeast-2.amazonaws.com/', kind: 'opaque' },
  { id: 'aws-ap-northeast-1', label: 'Tokyo · ap-northeast-1', lat: 35.68, lng: 139.69, url: 'https://dynamodb.ap-northeast-1.amazonaws.com/', kind: 'opaque' },
  { id: 'aws-ap-east-1', label: 'Hong Kong · ap-east-1', lat: 22.32, lng: 114.17, url: 'https://dynamodb.ap-east-1.amazonaws.com/', kind: 'opaque' },

  // Full timing breakdown (sends Timing-Allow-Origin)
  { id: 'cf-edge', label: 'Cloudflare edge · nearest PoP', lat: 37.78, lng: -122.4, url: 'https://speed.cloudflare.com/__down?bytes=0', kind: 'timed' },

  // DNS-over-HTTPS resolvers (resolver response time)
  { id: 'dns-google', label: 'Google DNS · 8.8.8.8', lat: 37.42, lng: -122.08, url: 'https://dns.google/resolve', kind: 'dns' },
  { id: 'dns-cloudflare', label: 'Cloudflare DNS · 1.1.1.1', lat: 30.27, lng: -97.74, url: 'https://cloudflare-dns.com/dns-query', kind: 'dns' },
];
