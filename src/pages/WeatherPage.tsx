import { lazy, Suspense } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import GradientText from '../components/ui/GradientText';

// Globe.gl pulls three.js (~heavy) — keep it out of the initial bundle so the
// home page stays light; the chunk only loads when someone opens this page.
const LazyWeatherDashboard = lazy(() => import('../components/network-weather/WeatherDashboard'));

function GlobeSkeleton() {
  return (
    <div className="flex h-[380px] animate-pulse items-center justify-center rounded-3xl border border-sage/40 bg-soft-blue/50 md:h-[480px]">
      <p className="text-sm text-slate/60">warming up the atmosphere…</p>
    </div>
  );
}

export default function WeatherPage() {
  return (
    <section className="px-6 pb-16 pt-28 md:pb-24 md:pt-32">
      <div className="mx-auto max-w-6xl">
        <a
          href="#hero"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate transition-colors hover:text-accent-blue"
        >
          <FiArrowLeft size={16} />
          Back to site
        </a>

        <h1 className="mb-4 text-3xl font-bold text-deep-blue md:text-4xl">
          Network <GradientText>Weather</GradientText>
        </h1>
        <p className="mb-10 max-w-3xl text-slate">
          A live map of internet weather, measured by you. Right now your browser is probing{' '}
          cloud regions and DNS resolvers around the world — latency, jitter, packet loss, and
          handshake timing — and painting the results as weather: clear skies on fast routes,
          storms over outages.
        </p>

        <Suspense fallback={<GlobeSkeleton />}>
          <LazyWeatherDashboard onScreen={true} />
        </Suspense>
      </div>
    </section>
  );
}
