import { experience } from '../../data/experience';
import SectionWrapper from '../layout/SectionWrapper';
import ExperienceCard from '../ui/ExperienceCard';
import GradientText from '../ui/GradientText';

export default function Experience() {
  return (
    <SectionWrapper id="experience">
      <h2 className="mb-10 text-3xl font-bold text-deep-blue">
        <GradientText>Experience</GradientText>
      </h2>

      <div className="space-y-12">
        {experience.map((category) => (
          <div key={category.label}>
            <h3 className="mb-6 text-xl font-bold text-deep-blue">
              {category.label}
            </h3>

            {/* Timeline container */}
            <div className="relative ml-1.5 border-l-2 border-accent-blue/20 md:border-l-2 md:border-gradient-to-b md:from-accent-blue md:to-accent-sage">
              {category.entries.map((entry) => (
                <ExperienceCard key={entry.role + entry.organization} entry={entry} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
