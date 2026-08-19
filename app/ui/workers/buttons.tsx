import Link from 'next/link';
import { deleteWorker } from '@/app/lib/actions';

export function CreateWorker() {
  return (
    <Link
      href="/dashboard/workers/create"
      className="flex h-10 items-center rounded-lg bg-green-700 px-4 text-sm font-medium text-white transition-colors hover:bg-green-600"
    >
      Add worker
    </Link>
  );
}

export function UpdateWorker({ id }: { id: number }) {
  return (
    <Link
      href={`/dashboard/workers/${id}/edit`}
      className="rounded-md border border-zinc-200 px-3 py-1.5 text-sm hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
    >
      Edit
    </Link>
  );
}

export function DeleteWorker({ id }: { id: number }) {
  const deleteWorkerWithId = deleteWorker.bind(null, id);

  return (
    <form action={deleteWorkerWithId}>
      <button
        type="submit"
        className="rounded-md border border-zinc-200 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50 dark:border-zinc-700 dark:hover:bg-red-950"
      >
        Delete
      </button>
    </form>
  );
}
