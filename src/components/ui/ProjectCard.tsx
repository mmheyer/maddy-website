import type { Project } from '../../data/projects';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      {/* Gradient left border */}
      <div className="absolute top-0 left-0 h-full w-[3px] bg-gradient-to-b from-accent-blue to-accent-sage" />

      <div className="p-6 pl-7">
        <span className="mb-2 inline-block rounded-full bg-soft-blue px-3 py-1 text-xs font-semibold text-accent-blue">
          {project.type}
        </span>
        <h3 className="mb-2 text-lg font-bold text-deep-blue">{project.title}</h3>
        <p className="mb-4 text-sm leading-relaxed text-slate">{project.description}</p>
        <div className="flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <span
              key={t}
              className="rounded-full bg-sage/50 px-3 py-1 text-xs font-medium text-deep-blue/80"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
