interface SkillBadgeProps {
  label: string;
}

export default function SkillBadge({ label }: SkillBadgeProps) {
  return (
    <span className="rounded-full bg-soft-blue px-4 py-1.5 text-sm font-medium text-deep-blue transition-colors hover:bg-accent-blue/15">
      {label}
    </span>
  );
}
