'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { logoutAction } from '@/app/lib/auth-actions';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '▦' },
  { href: '/dashboard/workers', label: 'Түүгчид', icon: '👥' },
  { href: '/dashboard/work-records', label: 'Өдрийн түүлт', icon: '🧺' },
  { href: '/dashboard/payments', label: 'Төлбөр тооцоо', icon: '₮' },
  { href: '/dashboard/crops', label: 'Ургацын тариф', icon: '🌾' },
  { href: '/dashboard/reports', label: 'Тайлан', icon: '📈' },
  { href: '/dashboard/settings', label: 'Тохиргоо', icon: '⚙' },
];

function isActive(pathname: string, href: string) {
  if (href === '/dashboard') return pathname === href;
  return pathname.startsWith(href);
}

export default function DashboardShell({
  children,
  userName,
}: {
  children: React.ReactNode;
  userName?: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {open ? (
        <button
          type="button"
          aria-label="Цэс хаах"
          className="fixed inset-0 z-30 bg-[#26352a]/20 md:hidden"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside
          className={`fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col border-r border-[#e4ded0] bg-white p-5 transition-transform duration-200 md:sticky md:top-0 md:h-screen md:translate-x-0 md:self-start md:overflow-y-auto ${
            open ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="mb-8 flex items-center justify-between">
            <Link
              href="/dashboard"
              className="text-lg font-semibold tracking-tight text-[var(--farm-deep)]"
            >
              🌱 Ургац хураалт
            </Link>
            <button
              type="button"
              className="inline-flex min-h-10 items-center rounded-lg px-3 text-sm text-[var(--text-secondary)] md:hidden"
              onClick={() => setOpen(false)}
            >
              Хаах
            </button>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition ${
                    active
                      ? 'bg-[#e7f0e8] font-medium text-[var(--farm-deep)]'
                      : 'text-[var(--text-secondary)] hover:bg-[#f7faf7] hover:text-[var(--farm-deep)]'
                  }`}
                >
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-[#eef4ee] text-xs text-[var(--farm-deep)]">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto border-t border-[#eee6d8] pt-4">
            {userName ? (
              <p className="mb-2 truncate px-1 text-sm font-medium text-[var(--foreground)]">
                {userName}
              </p>
            ) : null}
            <form action={logoutAction}>
              <button
                type="submit"
                className="inline-flex h-10 w-full items-center justify-center rounded-xl border border-[#ddd5c4] px-3 text-sm text-[var(--text-secondary)] hover:bg-[#f7faf7] hover:text-[var(--farm-deep)]"
              >
                Гарах
              </button>
            </form>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-[#eae4d5] bg-white/95 backdrop-blur">
            <div className="flex items-center justify-between gap-3 px-4 py-3 md:px-8">
              <button
                type="button"
                className="inline-flex min-h-10 items-center rounded-lg border border-[#ddd5c4] px-3 text-sm text-[var(--text-secondary)] md:hidden"
                onClick={() => setOpen(true)}
              >
                ☰ Цэс
              </button>
              <div className="min-w-0 text-sm text-[var(--text-secondary)]">
                Ургац хураалтын систем
              </div>
              <form action={logoutAction} className="md:hidden">
                <button
                  type="submit"
                  className="inline-flex min-h-10 items-center rounded-lg px-3 text-sm text-[var(--text-secondary)]"
                >
                  Гарах
                </button>
              </form>
            </div>
          </header>

          <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 md:px-8 md:py-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
