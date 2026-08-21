export function MobileCard({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`farm-card space-y-3 p-4 ${className}`}>{children}</div>
  );
}

export function MobileCardRow({
  label,
  value,
  emphasize = false,
}: {
  label: string;
  value: React.ReactNode;
  emphasize?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-3 text-sm">
      <span className="shrink-0 text-[var(--text-secondary)]">{label}</span>
      <span
        className={`min-w-0 break-words text-right ${emphasize ? 'font-semibold tabular-nums text-[var(--foreground)]' : 'font-medium tabular-nums'}`}
      >
        {value}
      </span>
    </div>
  );
}

export function MobileCardHeader({
  title,
  subtitle,
  action,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="space-y-3 border-b border-[#eee6d8] pb-3">
      <div className="min-w-0">
        <div className="font-semibold text-[var(--foreground)]">{title}</div>
        {subtitle ? (
          <div className="mt-0.5 text-xs text-[var(--text-secondary)]">{subtitle}</div>
        ) : null}
      </div>
      {action ? (
        <div className="flex flex-wrap gap-2">{action}</div>
      ) : null}
    </div>
  );
}

export function MobileCardActions({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap gap-2 border-t border-[#eee6d8] pt-3">
      {children}
    </div>
  );
}
