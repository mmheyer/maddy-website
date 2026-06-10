interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}

export default function GradientText({
  children,
  className = '',
  animate = false,
}: GradientTextProps) {
  // Animated text uses a 3-stop gradient that returns to the start color so the
  // shimmer loops seamlessly; static text keeps the original 2-stop gradient.
  const gradient = animate
    ? 'from-accent-blue via-accent-sage to-accent-blue bg-[length:200%_auto] animate-gradient'
    : 'from-accent-blue to-accent-sage';

  return (
    <span
      className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent ${className}`}
    >
      {children}
    </span>
  );
}
