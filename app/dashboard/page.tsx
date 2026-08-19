import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        Manage fruit pickers, their work records, and payments.
      </p>
      <Link
        href="/dashboard/workers"
        className="inline-flex h-10 items-center rounded-lg bg-green-700 px-4 text-sm font-medium text-white hover:bg-green-600"
      >
        View workers
      </Link>
    </div>
  );
}
