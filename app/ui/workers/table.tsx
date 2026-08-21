import Link from 'next/link';
import EmptyState from '@/app/ui/common/empty-state';
import PickerAvatar from '@/app/ui/common/picker-avatar';
import StatusBadge from '@/app/ui/common/status-badge';
import {
  MobileCard,
  MobileCardActions,
  MobileCardHeader,
  MobileCardRow,
} from '@/app/ui/common/mobile-card';
import { DeleteWorker, UpdateWorker } from '@/app/ui/workers/buttons';
import type { Worker } from '@prisma/client';

export default function WorkersTable({ workers }: { workers: Worker[] }) {
  if (workers.length === 0) {
    return <EmptyState title="Одоогоор түүгч алга байна." />;
  }

  return (
    <>
      <div className="hidden md:block farm-card overflow-x-auto">
        <table className="farm-table min-w-full text-left text-sm">
          <thead className="bg-[#faf6ee]">
            <tr>
              <th className="px-4 py-3 font-medium">Түүгч</th>
              <th className="px-4 py-3 font-medium">Утас</th>
              <th className="px-4 py-3 font-medium">Данс</th>
              <th className="px-4 py-3 font-medium">Төлөв</th>
              <th className="px-4 py-3 font-medium">Нэмсэн</th>
              <th className="px-4 py-3 font-medium">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eee6d8]">
            {workers.map((worker) => (
              <tr key={worker.id}>
                <td className="px-4 py-3 font-medium">
                  <div className="flex items-center gap-2">
                    <PickerAvatar name={worker.name} />
                    <Link
                      href={`/dashboard/workers/${worker.id}`}
                      className="text-[var(--farm-deep)] hover:underline"
                    >
                      {worker.name}
                    </Link>
                  </div>
                </td>
                <td className="px-4 py-3 text-[var(--text-secondary)]">
                  {worker.phone ?? '—'}
                </td>
                <td className="px-4 py-3 tabular-nums text-[var(--text-secondary)]">
                  {worker.bankAccount ?? '—'}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={worker.status} />
                </td>
                <td className="px-4 py-3 text-[var(--text-secondary)]">
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

      <div className="space-y-3 md:hidden">
        {workers.map((worker) => (
          <MobileCard key={worker.id}>
            <MobileCardHeader
              title={
                <div className="flex items-center gap-2">
                  <PickerAvatar name={worker.name} />
                  <Link
                    href={`/dashboard/workers/${worker.id}`}
                    className="text-[var(--farm-deep)] hover:underline"
                  >
                    {worker.name}
                  </Link>
                </div>
              }
              subtitle={worker.phone ?? 'Утасгүй'}
            />
            <MobileCardRow label="Төлөв" value={<StatusBadge status={worker.status} />} />
            <MobileCardRow label="Данс" value={worker.bankAccount ?? '—'} />
            <MobileCardRow
              label="Нэмсэн"
              value={worker.createdAt.toISOString().slice(0, 10)}
            />
            <MobileCardActions>
              <UpdateWorker id={worker.id} />
              <DeleteWorker id={worker.id} />
            </MobileCardActions>
          </MobileCard>
        ))}
      </div>
    </>
  );
}
