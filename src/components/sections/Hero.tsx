import { FiChevronDown } from 'react-icons/fi';
import { profile } from '../../data/profile';
import Button from '../ui/Button';
import GradientText from '../ui/GradientText';

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6"
    >
      {/* Animated gradient blob decoration */}
      <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-accent-blue/20 blur-3xl animate-float-slow" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-accent-sage/20 blur-3xl animate-float-slower" />
      <div className="pointer-events-none absolute left-1/4 top-1/4 h-80 w-80 rounded-full bg-lavender/50 blur-3xl animate-float-slower" />

      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-4 text-sm font-semibold tracking-wide text-accent-blue opacity-0 animate-slide-up">
          Hi, I'm
        </p>
        <h1 className="mb-6 text-5xl font-extrabold leading-tight text-deep-blue opacity-0 animate-slide-up-delay-1 md:text-6xl">
          <GradientText animate>{profile.name}</GradientText>
        </h1>
        <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-slate opacity-0 animate-slide-up-delay-2">
          {profile.tagline}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 opacity-0 animate-slide-up-delay-3">
          <Button href="#projects">View Projects</Button>
          <Button href="#contact" variant="secondary">
            Get in Touch
          </Button>
        </div>
      </div>

      {/* Scroll-down indicator */}
      <a
        href="#about"
        aria-label="Scroll to about section"
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-slate/70 opacity-0 transition-colors duration-300 animate-fade-in-delay-4 hover:text-accent-blue"
      >
        <span className="text-xs font-medium uppercase tracking-widest">Scroll</span>
        <FiChevronDown className="h-5 w-5 animate-bounce-soft" />
      </a>
    </section>
  );
}
