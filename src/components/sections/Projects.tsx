import { projects } from '../../data/projects';
import SectionWrapper from '../layout/SectionWrapper';
import ProjectCard from '../ui/ProjectCard';
import GradientText from '../ui/GradientText';

export default function Projects() {
  return (
    <SectionWrapper id="projects">
      <h2 className="mb-10 text-3xl font-bold text-deep-blue">
        Featured <GradientText>Projects</GradientText>
      </h2>
      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </SectionWrapper>
  );
}
