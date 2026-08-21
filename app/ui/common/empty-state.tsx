import type { ReactNode } from 'react';

export default function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="farm-card border-dashed p-10 text-center">
      <div className="mx-auto mb-3 h-10 w-10 rounded-2xl bg-[#e7f0e8]" aria-hidden />
      <p className="text-base font-semibold text-[var(--foreground)]">{title}</p>
      {description ? (
        <p className="mt-1 text-sm text-[var(--text-secondary)]">{description}</p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
