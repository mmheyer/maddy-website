import { profile } from '../../data/profile';
import Button from '../ui/Button';
import GradientText from '../ui/GradientText';

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6"
    >
      {/* Gradient blob decoration */}
      <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-accent-blue/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-accent-sage/10 blur-3xl" />

      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-4 text-sm font-semibold tracking-wide text-accent-blue opacity-0 animate-slide-up">
          Hi, I'm
        </p>
        <h1 className="mb-6 text-5xl font-extrabold leading-tight text-deep-blue opacity-0 animate-slide-up-delay-1 md:text-6xl">
          <GradientText>{profile.name}</GradientText>
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
    </section>
  );
}
