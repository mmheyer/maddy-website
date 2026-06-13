import type { ProbeSample } from '../../types/networkWeather';

interface SparklineProps {
  history: ProbeSample[];
  className?: string;
}

/**
 * Dependency-free inline SVG sparkline of probe durations. Failed samples
 * (null duration) produce gaps in the line.
 */
export default function Sparkline({ history, className = '' }: SparklineProps) {
  const width = 100;
  const height = 28;
  const pad = 2;

  const durations = history
    .map((s) => s.durationMs)
    .filter((v): v is number => v !== null);
  if (durations.length < 2) {
    return <svg viewBox={`0 0 ${width} ${height}`} className={className} aria-hidden="true" />;
  }

  const min = Math.min(...durations);
  const max = Math.max(...durations);
  const range = Math.max(max - min, 1);
  const step = (width - pad * 2) / Math.max(history.length - 1, 1);

  // Split into segments at failed samples so the line shows gaps
  const segments: string[] = [];
  let current: string[] = [];
  history.forEach((s, i) => {
    if (s.durationMs === null) {
      if (current.length > 1) segments.push(current.join(' '));
      current = [];
      return;
    }
    const x = pad + i * step;
    const y = height - pad - ((s.durationMs - min) / range) * (height - pad * 2);
    current.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  });
  if (current.length > 1) segments.push(current.join(' '));

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={className} aria-hidden="true">
      {segments.map((points, i) => (
        <polyline
          key={i}
          points={points}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}
