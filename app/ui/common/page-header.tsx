import type { ReactNode } from 'react';

export default function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: ReactNode;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
      <div className="min-w-0 flex-1">
        <h1 className="text-[24px] font-bold leading-tight text-[var(--foreground)] sm:text-[28px] md:text-[32px]">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-1 text-sm text-[var(--text-secondary)]">{subtitle}</p>
        ) : null}
      </div>
      {action ? (
        <div className="flex w-full shrink-0 flex-wrap gap-2 sm:w-auto sm:justify-end [&>a]:w-full [&>a]:justify-center sm:[&>a]:w-auto [&>button]:w-full sm:[&>button]:w-auto">
          {action}
        </div>
      ) : null}
    </div>
  );
}
