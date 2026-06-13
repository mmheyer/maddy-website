import { useEffect, useState } from 'react';
import { FiX, FiArrowRight } from 'react-icons/fi';
import { WiDayCloudyGusts } from 'react-icons/wi';

const DISMISS_KEY = 'network-weather-invite-dismissed';

// A small floating nudge on the home page that invites visitors over to the
// dedicated Network Weather page. It slides in after a short delay and stays
// dismissed for the rest of the browsing session.
export default function WeatherInvite() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(DISMISS_KEY)) return;
    const timer = setTimeout(() => setVisible(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem(DISMISS_KEY, '1');
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-5 right-5 z-40 max-w-[calc(100vw-2.5rem)] animate-slide-up sm:max-w-sm">
      <div className="relative overflow-hidden rounded-2xl border border-sage/50 bg-cream/95 p-5 pr-10 shadow-[0_12px_40px_rgba(30,58,95,0.18)] backdrop-blur-md">
        {/* Soft gradient glow behind the icon */}
        <div className="pointer-events-none absolute -top-10 -left-10 h-28 w-28 rounded-full bg-accent-blue/15 blur-2xl" />

        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="absolute right-3 top-3 text-slate/50 transition-colors hover:text-deep-blue"
        >
          <FiX size={18} />
        </button>

        <div className="flex items-start gap-3">
          <span className="mt-0.5 shrink-0 rounded-xl bg-soft-blue/70 p-2 text-accent-blue">
            <WiDayCloudyGusts size={28} />
          </span>
          <div>
            <p className="font-semibold text-deep-blue">Check the network weather</p>
            <p className="mt-1 text-sm leading-relaxed text-slate">
              A live map of the internet's mood — latency, jitter, and outages, measured right
              from your browser.
            </p>
            <a
              href="#/weather"
              onClick={dismiss}
              className="group mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-blue transition-colors hover:text-deep-blue"
            >
              Take a look
              <FiArrowRight className="transition-transform group-hover:translate-x-0.5" size={15} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
