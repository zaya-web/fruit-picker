import type { ReactNode } from 'react';

/** Compact label + value cell for card footers and summary strips. */
export function StatMetric({
  label,
  value,
  valueClassName = '',
  className = '',
}: {
  label: string;
  value: ReactNode;
  valueClassName?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-xs text-[var(--text-muted)]">{label}</p>
      <p
        className={`mt-1 font-semibold tabular-nums ${valueClassName}`.trim()}
      >
        {value}
      </p>
    </div>
  );
}
