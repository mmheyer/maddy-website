import type { ExperienceEntry } from '../../data/experience';

interface ExperienceCardProps {
  entry: ExperienceEntry;
}

export default function ExperienceCard({ entry }: ExperienceCardProps) {
  return (
    <div className="relative pl-8 pb-10 last:pb-0">
      {/* Timeline dot */}
      <div className="absolute left-0 top-1.5 h-3 w-3 rounded-full border-2 border-accent-blue bg-cream" />

      <div className="rounded-xl bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md">
        <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
          <h4 className="text-base font-bold text-deep-blue">{entry.role}</h4>
          <span className="text-xs font-medium text-slate/60">{entry.dates}</span>
        </div>
        <p className="mb-3 text-sm text-accent-sage font-medium">
          {entry.organization} &middot; {entry.location}
        </p>
        <ul className="space-y-1">
          {entry.highlights.map((h, i) => (
            <li key={i} className="text-sm leading-relaxed text-slate">
              &bull; {h}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
