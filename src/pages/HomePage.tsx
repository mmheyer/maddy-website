import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import Projects from '../components/sections/Projects';
import Skills from '../components/sections/Skills';
import Experience from '../components/sections/Experience';
import Contact from '../components/sections/Contact';
import WeatherInvite from '../components/sections/WeatherInvite';
import GradientDivider from '../components/layout/GradientDivider';

export default function HomePage() {
  return (
    <>
      <Hero />
      <GradientDivider />
      <About />
      <GradientDivider />
      <Projects />
      <GradientDivider />
      <Skills />
      <GradientDivider />
      <Experience />
      <GradientDivider />
      <Contact />
      <WeatherInvite />
    </>
  );
}
