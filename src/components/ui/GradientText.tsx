interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
}

export default function GradientText({ children, className = '' }: GradientTextProps) {
  return (
    <span
      className={`bg-gradient-to-r from-accent-blue to-accent-sage bg-clip-text text-transparent ${className}`}
    >
      {children}
    </span>
  );
}
