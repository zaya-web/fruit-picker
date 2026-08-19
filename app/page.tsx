import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 dark:bg-black">
      <main className="flex max-w-lg flex-col items-center gap-6 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Fruit Picker</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Track pickers, harvest records, and payments.
        </p>
        <Link
          href="/dashboard/workers"
          className="flex h-11 items-center rounded-lg bg-green-700 px-5 text-sm font-medium text-white hover:bg-green-600"
        >
          Manage workers
        </Link>
      </main>
    </div>
  );
}
