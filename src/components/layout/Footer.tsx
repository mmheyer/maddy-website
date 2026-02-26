import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';
import { profile } from '../../data/profile';

export default function Footer() {
  return (
    <footer className="bg-deep-blue text-white/70 py-10 px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 md:flex-row md:justify-between">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Madison Heyer. All rights reserved.
        </p>
        <div className="flex gap-5">
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="hover:text-white transition-colors"
          >
            <FiGithub size={18} />
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="hover:text-white transition-colors"
          >
            <FiLinkedin size={18} />
          </a>
          <a
            href={`mailto:${profile.email}`}
            aria-label="Email"
            className="hover:text-white transition-colors"
          >
            <FiMail size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}
