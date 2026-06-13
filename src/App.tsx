import { useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import WeatherPage from './pages/WeatherPage';
import { useHashRoute } from './hooks/useHashRoute';

export default function App() {
  const route = useHashRoute();

  // Keep scroll position sane across hash navigations: land at the top of the
  // weather page, and when returning home via a section anchor (e.g. clicking
  // "About" from the weather page) scroll to that section once it's mounted.
  useEffect(() => {
    if (route === 'weather') {
      window.scrollTo(0, 0);
      return;
    }
    const hash = window.location.hash;
    if (hash && !hash.startsWith('#/')) {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo(0, 0);
    }
  }, [route]);

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      {route === 'weather' ? <WeatherPage /> : <HomePage />}
      <Footer />
    </div>
  );
}
