import AuthForms from '@/app/ui/auth/auth-forms';

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <div className="relative flex min-h-full flex-1 flex-col items-center justify-center overflow-hidden px-4 py-10 sm:px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#e8f2e9_0%,_#ffffff_55%,_#f7f3ea_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 top-16 h-56 w-56 rounded-full bg-[var(--farm-fresh)]/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 bottom-10 h-64 w-64 rounded-full bg-[var(--accent-buckthorn)]/15 blur-3xl"
      />

      <main className="relative z-10 flex w-full max-w-md flex-col items-center gap-6">
        <AuthForms />
        <p className="text-center text-xs text-[var(--text-muted)]">
          Бүртгэл үүсгээд dashboard руу нэвтэрнэ.
        </p>
      </main>
    </div>
  );
}
