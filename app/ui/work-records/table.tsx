import Link from 'next/link';
import EmptyState from '@/app/ui/common/empty-state';
import PickerAvatar from '@/app/ui/common/picker-avatar';
import {
  MobileCard,
  MobileCardActions,
  MobileCardHeader,
  MobileCardRow,
} from '@/app/ui/common/mobile-card';
import { DeleteWorkRecord, UpdateWorkRecord } from '@/app/ui/work-records/buttons';
import { formatAmount, formatDateTime } from '@/app/lib/format';
import type { Fruit, WorkRecord, Worker } from '@prisma/client';

type WorkRecordRow = WorkRecord & {
  worker: Worker;
  fruit: Fruit;
};

export default function WorkRecordsTable({
  records,
}: {
  records: WorkRecordRow[];
}) {
  if (records.length === 0) {
    return <EmptyState title="Одоогоор түүлтийн мэдээлэл алга байна." />;
  }

  return (
    <section className="farm-card overflow-hidden">
      <div className="border-b border-[#eee6d8] px-4 py-4 sm:px-6">
        <h2 className="text-base font-semibold">Түүлтийн түүх</h2>
        <p className="mt-0.5 text-sm text-[var(--text-secondary)]">
          Бүртгэгдсэн түүлтүүд — огноо, цагаар
        </p>
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="farm-table min-w-full text-left text-sm">
          <thead className="bg-[#faf6ee]">
            <tr>
              <th className="px-4 py-3 font-medium">Огноо, цаг</th>
              <th className="px-4 py-3 font-medium">Ажилтан</th>
              <th className="px-4 py-3 font-medium">Ургац</th>
              <th className="px-4 py-3 text-right font-medium">Kg</th>
              <th className="px-4 py-3 text-right font-medium">Үнэ / кг</th>
              <th className="px-4 py-3 text-right font-medium">Нийт</th>
              <th className="px-4 py-3 font-medium">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eee6d8]">
            {records.map((record) => (
              <tr key={record.id}>
                <td className="whitespace-nowrap px-4 py-3 text-[var(--text-secondary)]">
                  {formatDateTime(record.date)}
                </td>
                <td className="px-4 py-3 font-medium">
                  <div className="flex items-center gap-2">
                    <PickerAvatar name={record.worker.name} />
                    <Link
                      href={`/dashboard/workers/${record.worker.id}`}
                      className="text-[var(--farm-deep)] hover:underline"
                    >
                      {record.worker.name}
                    </Link>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/dashboard/crops/${record.fruit.id}`}
                    className="text-[var(--farm-deep)] hover:underline"
                  >
                    {record.fruit.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-[var(--text-secondary)]">
                  {formatAmount(record.kg)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-[var(--text-secondary)]">
                  {formatAmount(record.pricePerKg)}
                </td>
                <td className="px-4 py-3 text-right font-medium tabular-nums">
                  {formatAmount(record.totalAmount)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <UpdateWorkRecord id={record.id} />
                    <DeleteWorkRecord id={record.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 p-4 md:hidden">
        {records.map((record) => (
          <MobileCard key={record.id}>
            <MobileCardHeader
              title={
                <div className="flex items-center gap-2">
                  <PickerAvatar name={record.worker.name} />
                  <Link
                    href={`/dashboard/workers/${record.worker.id}`}
                    className="text-[var(--farm-deep)] hover:underline"
                  >
                    {record.worker.name}
                  </Link>
                </div>
              }
              subtitle={formatDateTime(record.date)}
            />
            <MobileCardRow
              label="Ургац"
              value={
                <Link
                  href={`/dashboard/crops/${record.fruit.id}`}
                  className="text-[var(--farm-deep)] hover:underline"
                >
                  {record.fruit.name}
                </Link>
              }
            />
            <MobileCardRow label="Kg" value={formatAmount(record.kg)} />
            <MobileCardRow label="Үнэ / кг" value={formatAmount(record.pricePerKg)} />
            <MobileCardRow
              label="Нийт"
              value={`₮${formatAmount(record.totalAmount)}`}
              emphasize
            />
            <MobileCardActions>
              <UpdateWorkRecord id={record.id} />
              <DeleteWorkRecord id={record.id} />
            </MobileCardActions>
          </MobileCard>
        ))}
      </div>
    </section>
  );
}
