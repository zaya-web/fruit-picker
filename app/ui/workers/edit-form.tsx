import Link from 'next/link';
import { updateWorker } from '@/app/lib/actions';
import type { Worker } from '@prisma/client';

export default function EditWorkerForm({ worker }: { worker: Worker }) {
  const updateWorkerWithId = updateWorker.bind(null, worker.id);

  return (
    <form action={updateWorkerWithId} className="space-y-6">
      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={worker.name}
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-green-700 dark:border-zinc-700 dark:bg-black"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="phone" className="mb-2 block text-sm font-medium">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={worker.phone ?? ''}
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-green-700 dark:border-zinc-700 dark:bg-black"
          />
        </div>

        <div>
          <label htmlFor="status" className="mb-2 block text-sm font-medium">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={worker.status}
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-green-700 dark:border-zinc-700 dark:bg-black"
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Link
          href="/dashboard/workers"
          className="flex h-10 items-center rounded-lg px-4 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-900"
        >
          Cancel
        </Link>
        <button
          type="submit"
          className="flex h-10 items-center rounded-lg bg-green-700 px-4 text-sm font-medium text-white hover:bg-green-600"
        >
          Save changes
        </button>
      </div>
    </form>
  );
}
