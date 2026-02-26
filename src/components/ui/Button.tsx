interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export default function Button({
  children,
  href,
  variant = 'primary',
  className = '',
}: ButtonProps) {
  const base =
    'inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300';
  const variants = {
    primary:
      'bg-accent-blue text-white hover:bg-accent-blue/90 hover:shadow-lg hover:-translate-y-0.5',
    secondary:
      'border-2 border-accent-blue text-accent-blue hover:bg-accent-blue hover:text-white hover:-translate-y-0.5',
  };

  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return <button className={classes}>{children}</button>;
}
