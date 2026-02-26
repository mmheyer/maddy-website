import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

interface SectionWrapperProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export default function SectionWrapper({ id, children, className = '' }: SectionWrapperProps) {
  const { ref, isVisible } = useIntersectionObserver();

  return (
    <section
      id={id}
      ref={ref}
      className={`px-6 py-16 md:py-24 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      } ${className}`}
    >
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}
