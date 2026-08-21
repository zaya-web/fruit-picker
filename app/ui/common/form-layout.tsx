import Link from 'next/link';
import type { ReactNode } from 'react';

export function BackLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-sm text-[var(--text-secondary)] hover:text-[var(--farm-deep)]"
    >
      {children}
    </Link>
  );
}

/** Цагаан card — form талбар, хүснэгтийн wrapper */
export function FormSection({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`farm-form ${className}`}>{children}</div>;
}

/** Зөөлөн cream background — мэдээлэл, тойм хэсэг */
export function FormInfoBox({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`farm-form-soft ${className}`}>{children}</div>;
}

/** Panel header — хүснэгт, dashboard section */
export function PanelHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="border-b border-[#eee6d8] px-4 py-4 sm:px-6">
      <h2 className="text-base font-semibold text-[var(--foreground)]">{title}</h2>
      {subtitle ? (
        <p className="mt-0.5 text-sm text-[var(--text-secondary)]">{subtitle}</p>
      ) : null}
    </div>
  );
}

/** Цагаан panel — хүснэгт, profile header */
export function FormPanel({
  children,
  className = '',
  padded = false,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <section className={`farm-panel ${padded ? 'p-5 sm:p-6' : ''} ${className}`}>
      {children}
    </section>
  );
}

/** Form хуудсын бүтэн wrapper */
export function FormPage({ children }: { children: ReactNode }) {
  return <div className="space-y-6">{children}</div>;
}
