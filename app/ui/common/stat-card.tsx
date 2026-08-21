import type { ReactNode } from 'react';

export default function StatCard({
  title,
  value,
  hint,
  icon,
}: {
  title: string;
  value: string;
  hint?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="farm-card p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-[var(--text-secondary)]">{title}</p>
        {icon ? (
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#e7f0e8] text-[var(--farm-deep)]">
            {icon}
          </span>
        ) : null}
      </div>
      <p className="mt-3 break-words text-[24px] font-bold leading-tight tracking-tight tabular-nums sm:text-[28px] md:text-[30px]">
        {value}
      </p>
      {hint ? <p className="mt-2 text-xs text-[var(--text-muted)]">{hint}</p> : null}
    </div>
  );
}
