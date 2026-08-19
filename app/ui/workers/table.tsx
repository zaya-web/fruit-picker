import { DeleteWorker, UpdateWorker } from '@/app/ui/workers/buttons';
import type { Worker } from '@prisma/client';

export default function WorkersTable({ workers }: { workers: Worker[] }) {
  if (workers.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500 dark:border-zinc-700">
        No workers yet. Add the first picker to get started.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500 dark:bg-zinc-900">
          <tr>
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Phone</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Added</th>
            <th className="px-4 py-3 font-medium">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {workers.map((worker) => (
            <tr key={worker.id} className="bg-white dark:bg-black">
              <td className="px-4 py-3 font-medium">{worker.name}</td>
              <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                {worker.phone ?? '—'}
              </td>
              <td className="px-4 py-3">
                <span
                  className={
                    worker.status === 'ACTIVE'
                      ? 'rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-950 dark:text-green-200'
                      : 'rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300'
                  }
                >
                  {worker.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                {worker.createdAt.toISOString().slice(0, 10)}
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <UpdateWorker id={worker.id} />
                  <DeleteWorker id={worker.id} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
