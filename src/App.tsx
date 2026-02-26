import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import GradientDivider from './components/layout/GradientDivider';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Projects from './components/sections/Projects';
import Skills from './components/sections/Skills';
import Experience from './components/sections/Experience';
import Contact from './components/sections/Contact';

export default function App() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
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
      <Footer />
    </div>
  );
}
