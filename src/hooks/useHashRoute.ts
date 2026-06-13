import { useSyncExternalStore } from 'react';

export type Route = 'home' | 'weather';

// The site deploys to GitHub Pages, so we lean on hash-based routing rather
// than pulling in a router. The Network Weather page lives at `#/weather`;
// any other hash (`#about`, `#projects`, empty, …) is treated as the home
// page and keeps working as a plain in-page scroll anchor.
function getRoute(): Route {
  return window.location.hash.startsWith('#/weather') ? 'weather' : 'home';
}

function subscribe(callback: () => void) {
  window.addEventListener('hashchange', callback);
  return () => window.removeEventListener('hashchange', callback);
}

export function useHashRoute(): Route {
  return useSyncExternalStore(subscribe, getRoute, () => 'home');
}
