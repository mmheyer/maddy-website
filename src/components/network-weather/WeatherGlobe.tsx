import { useEffect, useRef } from 'react';
import Globe from 'globe.gl';
import type { GlobeInstance } from 'globe.gl';
import land from '../../assets/land-110m.json';
import type { WeatherSnapshot } from '../../types/networkWeather';
import { conditionMeta, latencyColor, formatMs } from './weatherVisuals';

interface WeatherGlobeProps {
  snapshot: WeatherSnapshot;
  selectedId: string | null;
  onSelectTarget: (id: string | null) => void;
}

interface PointDatum {
  id: string | null; // null = visitor marker
  lat: number;
  lng: number;
  radius: number;
  color: string;
  label: string;
}

interface ArcDatum {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: [string, string];
  dashTime: number;
}

function tooltip(text: string): string {
  return `<div style="background:#1E3A5F;color:#FFF8F0;padding:4px 10px;border-radius:8px;font-size:12px;font-family:Inter,system-ui,sans-serif;white-space:nowrap">${text}</div>`;
}

export default function WeatherGlobe({ snapshot, selectedId, onSelectTarget }: WeatherGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeInstance | null>(null);
  const reducedMotionRef = useRef(false);
  const centeredRef = useRef(false);
  const onSelectRef = useRef(onSelectTarget);
  onSelectRef.current = onSelectTarget;
  // Stable datum objects keyed by target id — globe.gl diffs by object
  // identity, so reusing them updates visuals in place instead of
  // exit+enter flicker on every probe round.
  const pointCacheRef = useRef(new Map<string, PointDatum>());
  const arcCacheRef = useRef(new Map<string, ArcDatum>());
  const ringCacheRef = useRef(new Map<string, { lat: number; lng: number }>());

  // One-time globe setup; data is pushed by the effects below
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    reducedMotionRef.current = reducedMotion;

    const globe = new Globe(container, { rendererConfig: { alpha: true, antialias: true } });
    globe
      .width(container.clientWidth)
      .height(container.clientHeight)
      .backgroundColor('rgba(0,0,0,0)')
      .showAtmosphere(true)
      .atmosphereColor('#B9A8E0')
      .atmosphereAltitude(0.18)
      .hexPolygonsData(land.features as object[])
      .hexPolygonResolution(3)
      .hexPolygonMargin(0.4)
      .hexPolygonColor(() => '#9DB8A2')
      .pointAltitude(0.015)
      .pointRadius('radius')
      .pointColor('color')
      .pointLabel('label')
      .onPointClick((p) => {
        const datum = p as PointDatum;
        onSelectRef.current(datum.id);
      })
      .arcColor('color')
      .arcStroke(0.35)
      .arcAltitudeAutoScale(0.4)
      .arcsTransitionDuration(500)
      .ringColor(() => (t: number) => `rgba(244,63,94,${(1 - t).toFixed(2)})`)
      .ringMaxRadius(5)
      .ringPropagationSpeed(2)
      .ringRepeatPeriod(700);

    if (reducedMotion) {
      // Static solid arcs instead of animated pulses
      globe.arcDashLength(1).arcDashGap(0).arcDashAnimateTime(0);
    } else {
      globe
        .arcDashLength(0.45)
        .arcDashGap(0.6)
        .arcDashAnimateTime((d) => (d as ArcDatum).dashTime);
    }

    // Pale soft-blue "ocean" to match the site palette
    const material = globe.globeMaterial() as unknown as {
      color?: { set: (c: string) => void };
    };
    material.color?.set('#DCE9FB');

    const controls = globe.controls();
    controls.enableZoom = false; // never hijack page scroll
    controls.autoRotate = !reducedMotion;
    controls.autoRotateSpeed = 0.6;

    globe.pointOfView({ lat: 25, lng: -40, altitude: 2.2 }, 0);

    const resizeObserver = new ResizeObserver(() => {
      globe.width(container.clientWidth).height(container.clientHeight);
    });
    resizeObserver.observe(container);

    globeRef.current = globe;
    return () => {
      resizeObserver.disconnect();
      globeRef.current = null;
      globe._destructor();
    };
  }, []);

  // Push snapshot data — globe.gl diffs in place, no re-init
  useEffect(() => {
    const globe = globeRef.current;
    if (!globe) return;

    const visitor = snapshot.visitor;
    const pointCache = pointCacheRef.current;
    const arcCache = arcCacheRef.current;
    const ringCache = ringCacheRef.current;
    const points: PointDatum[] = [];
    const arcs: ArcDatum[] = [];
    const rings: { lat: number; lng: number }[] = [];

    if (visitor) {
      const datum = pointCache.get('visitor') ?? ({ id: null } as PointDatum);
      Object.assign(datum, {
        lat: visitor.lat,
        lng: visitor.lng,
        radius: 0.55,
        color: '#1E3A5F',
        label: tooltip(`You · probing from ${visitor.label}`),
      });
      pointCache.set('visitor', datum);
      points.push(datum);
    }

    for (const t of snapshot.targets) {
      const meta = conditionMeta[t.condition];
      const jitterBoost = Math.min(t.jitterMs ?? 0, 150) / 150;
      const point = pointCache.get(t.target.id) ?? ({ id: t.target.id } as PointDatum);
      Object.assign(point, {
        lat: t.target.lat,
        lng: t.target.lng,
        radius: t.condition === 'unreachable' ? 0.25 : 0.35 + jitterBoost * 0.45,
        color: meta.color,
        label: tooltip(`${t.target.label} · ${formatMs(t.latencyMs)} · ${meta.label}`),
      });
      pointCache.set(t.target.id, point);
      points.push(point);

      if (visitor && t.condition !== 'unreachable' && t.sampleCount > 0) {
        const arc = arcCache.get(t.target.id) ?? ({} as ArcDatum);
        Object.assign(arc, {
          startLat: visitor.lat,
          startLng: visitor.lng,
          endLat: t.target.lat,
          endLng: t.target.lng,
          color: [latencyColor(t.latencyMs === null ? null : 0), latencyColor(t.latencyMs)],
          dashTime:
            t.latencyMs === null
              ? 6000
              : Math.min(Math.max(t.latencyMs * 12, 800), 6000),
        });
        arcCache.set(t.target.id, arc);
        arcs.push(arc);
      }

      if (t.condition === 'stormy' && !reducedMotionRef.current) {
        const ring =
          ringCache.get(t.target.id) ?? { lat: t.target.lat, lng: t.target.lng };
        ringCache.set(t.target.id, ring);
        rings.push(ring);
      }
    }

    globe.pointsData(points as object[]);
    globe.arcsData(arcs as object[]);
    globe.ringsData(rings as object[]);
  }, [snapshot]);

  // Center on the visitor once their location resolves
  useEffect(() => {
    const globe = globeRef.current;
    const visitor = snapshot.visitor;
    if (!globe || !visitor || centeredRef.current) return;
    centeredRef.current = true;
    globe.pointOfView({ lat: visitor.lat, lng: visitor.lng, altitude: 2.2 }, 1200);
  }, [snapshot.visitor]);

  // Selection: pause autorotate and fly to the selected region
  useEffect(() => {
    const globe = globeRef.current;
    if (!globe) return;
    globe.controls().autoRotate = !selectedId && !reducedMotionRef.current;
    if (selectedId) {
      const t = snapshot.targets.find((m) => m.target.id === selectedId);
      if (t) {
        globe.pointOfView({ lat: t.target.lat, lng: t.target.lng, altitude: 1.9 }, 700);
      }
    }
    // Intentionally not re-flying on every snapshot — only when selection changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  // Decorative; RegionList is the accessible representation of this data
  return <div ref={containerRef} className="h-full w-full" aria-hidden="true" />;
}
