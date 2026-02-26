import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';
import { profile } from '../../data/profile';
import SectionWrapper from '../layout/SectionWrapper';
import GradientText from '../ui/GradientText';

const links = [
  {
    icon: <FiMail size={22} />,
    label: 'Email',
    href: `mailto:${profile.email}`,
  },
  {
    icon: <FiLinkedin size={22} />,
    label: 'LinkedIn',
    href: profile.linkedin,
  },
  {
    icon: <FiGithub size={22} />,
    label: 'GitHub',
    href: profile.github,
  },
];

export default function Contact() {
  return (
    <SectionWrapper id="contact" className="bg-lavender/40">
      <div className="text-center">
        <h2 className="mb-4 text-3xl font-bold text-deep-blue">
          Get in <GradientText>Touch</GradientText>
        </h2>
        <p className="mx-auto mb-10 max-w-md text-slate">
          I'm always open to new opportunities, collaborations, or just a friendly chat. Feel free to reach out!
        </p>

        <div className="flex justify-center gap-6">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.label !== 'Email' ? '_blank' : undefined}
              rel={link.label !== 'Email' ? 'noopener noreferrer' : undefined}
              aria-label={link.label}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-accent-blue shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:bg-accent-blue hover:text-white"
            >
              {link.icon}
            </a>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
