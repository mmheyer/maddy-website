import { profile } from '../../data/profile';
import SectionWrapper from '../layout/SectionWrapper';
import GradientText from '../ui/GradientText';

export default function About() {
  return (
    <SectionWrapper id="about">
      <h2 className="mb-10 text-3xl font-bold text-deep-blue">
        About <GradientText>Me</GradientText>
      </h2>

      <div className="grid gap-10 md:grid-cols-3">
        {/* Headshot */}
        <div className="flex justify-center md:justify-start">
          <img
            src={import.meta.env.BASE_URL + 'headshot.jpg'}
            alt="Madison Heyer"
            className="h-64 w-64 rounded-2xl object-cover object-[60%_top] shadow-md"
          />
        </div>

        {/* Bio + Education */}
        <div className="md:col-span-2 space-y-6">
          {profile.bio.map((paragraph, i) => (
            <p key={i} className="leading-relaxed text-slate">
              {paragraph}
            </p>
          ))}

          {/* Education */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-deep-blue">Education</h3>
            {profile.education.map((edu, i) => (
              <div key={i} className="rounded-xl bg-white p-4 shadow-sm">
                <p className="font-semibold text-deep-blue">{edu.degree}</p>
                <p className="text-sm text-accent-sage font-medium">
                  {edu.school} &middot; {edu.dates}
                </p>
                {edu.gpa && (
                  <p className="text-sm text-slate mt-1">GPA: {edu.gpa}</p>
                )}
                <p className="text-sm text-slate/70 mt-1">
                  {edu.coursework}
                </p>
              </div>
            ))}
          </div>

          {/* Honors */}
          <div>
            <h3 className="mb-3 text-lg font-bold text-deep-blue">Honors & Awards</h3>
            <div className="flex flex-wrap gap-2">
              {profile.honors.map((honor) => (
                <span
                  key={honor}
                  className="rounded-full bg-lavender px-4 py-1.5 text-sm font-medium text-deep-blue"
                >
                  {honor}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
