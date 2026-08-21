import type { ReactNode } from 'react';
import { PanelHeader } from '@/app/ui/common/form-layout';

/** Shared responsive list layout: optional panel header, desktop table, mobile cards. */
export function DataTableShell({
  title,
  subtitle,
  header,
  desktop,
  mobile,
  empty,
  className = '',
}: {
  title?: string;
  subtitle?: string;
  header?: ReactNode;
  desktop: ReactNode;
  mobile?: ReactNode;
  empty?: ReactNode;
  className?: string;
}) {
  if (empty) {
    return <>{empty}</>;
  }

  return (
    <section className={`farm-card overflow-hidden ${className}`.trim()}>
      {header ??
        (title ? <PanelHeader title={title} subtitle={subtitle} /> : null)}

      <div className="hidden overflow-x-auto md:block">{desktop}</div>

      {mobile ? <div className="space-y-3 p-4 md:hidden">{mobile}</div> : null}
    </section>
  );
}
