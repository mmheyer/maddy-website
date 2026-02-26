import { FiCode, FiLayers, FiTerminal, FiBarChart2 } from 'react-icons/fi';
import { skills } from '../../data/skills';
import SectionWrapper from '../layout/SectionWrapper';
import SkillBadge from '../ui/SkillBadge';
import GradientText from '../ui/GradientText';

const iconMap: Record<string, React.ReactNode> = {
  code: <FiCode size={20} />,
  layers: <FiLayers size={20} />,
  terminal: <FiTerminal size={20} />,
  chart: <FiBarChart2 size={20} />,
};

export default function Skills() {
  return (
    <SectionWrapper id="skills">
      <h2 className="mb-10 text-3xl font-bold text-deep-blue">
        Technical <GradientText>Skills</GradientText>
      </h2>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {skills.map((category) => (
          <div key={category.label}>
            <div className="mb-4 flex items-center gap-2 text-accent-blue">
              {iconMap[category.icon]}
              <h3 className="text-base font-bold text-deep-blue">
                {category.label}
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill) => (
                <SkillBadge key={skill} label={skill} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
