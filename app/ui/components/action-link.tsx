import Link from 'next/link';
import type { ReactNode } from 'react';

const secondaryLinkClassName =
  'inline-flex min-h-10 items-center rounded-xl border border-[#d9d3c4] px-3 text-sm hover:bg-[#f8f4eb]';

const primaryLinkClassName =
  'farm-btn-primary inline-flex h-11 items-center px-4 text-sm';

export function SecondaryLink({
  href,
  children,
  className = '',
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`${secondaryLinkClassName} ${className}`.trim()}
    >
      {children}
    </Link>
  );
}

export function PrimaryLink({
  href,
  children,
  className = '',
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link href={href} className={`${primaryLinkClassName} ${className}`.trim()}>
      {children}
    </Link>
  );
}

export function EditLink({ href }: { href: string }) {
  return <SecondaryLink href={href}>Засах</SecondaryLink>;
}
