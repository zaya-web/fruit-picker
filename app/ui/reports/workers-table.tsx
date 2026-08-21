import Link from 'next/link';
import type { WorkerSummary } from '@/app/lib/dashboard-stats';
import { formatKg, formatMoney } from '@/app/lib/format';
import { getWorkerBalance, isWorkerSettled } from '@/app/lib/report-settlement';
import EmptyState from '@/app/ui/common/empty-state';
import {
  MobileCard,
  MobileCardHeader,
  MobileCardRow,
} from '@/app/ui/common/mobile-card';
import PickerAvatar from '@/app/ui/common/picker-avatar';
import { DataTableShell, SettlementBadge } from '@/app/ui/components';

export default function ReportWorkersTable({
  workers,
}: {
  workers: WorkerSummary[];
}) {
  if (workers.length === 0) {
    return <EmptyState title="Энэ шүүлтээр ажилтан олдсонгүй." />;
  }

  return (
    <DataTableShell
      title="Ажилтны тайлан"
      subtitle="Төлбөр − төлсөн = үлдэгдэл. Их эсвэл бага бол тооцоотой; яг 0 бол тооцоогүй."
      desktop={
        <table className="farm-table min-w-full text-left text-sm">
          <thead className="bg-[#faf6ee]">
            <tr>
              <th className="px-5 py-3 font-medium">Ажилтан</th>
              <th className="px-5 py-3 font-medium">Утас</th>
              <th className="px-5 py-3 text-right font-medium">Нийт түүсэн</th>
              <th className="px-5 py-3 text-right font-medium">Төлбөр</th>
              <th className="px-5 py-3 text-right font-medium">Төлсөн</th>
              <th className="px-5 py-3 text-right font-medium">Үлдэгдэл</th>
              <th className="px-5 py-3 font-medium">Тооцоо</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eee6d8]">
            {workers.map((worker) => {
              const settled = isWorkerSettled(worker);
              const balance = getWorkerBalance(worker);

              return (
                <tr key={worker.workerId}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <PickerAvatar name={worker.workerName} />
                      <Link
                        href={`/dashboard/workers/${worker.workerId}`}
                        className="font-medium text-[var(--farm-deep)] hover:underline"
                      >
                        {worker.workerName}
                      </Link>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-[var(--text-secondary)]">
                    {worker.phone ?? '—'}
                  </td>
                  <td className="px-5 py-3.5 text-right font-medium tabular-nums">
                    {formatKg(worker.totalKg)}
                  </td>
                  <td className="px-5 py-3.5 text-right tabular-nums">
                    {formatMoney(worker.totalEarned)}
                  </td>
                  <td className="px-5 py-3.5 text-right tabular-nums text-[var(--farm-deep)]">
                    {formatMoney(worker.totalPaid)}
                  </td>
                  <td
                    className={`px-5 py-3.5 text-right font-medium tabular-nums ${
                      balance === 0
                        ? ''
                        : balance > 0
                          ? 'text-[#9a5b16]'
                          : 'text-[var(--farm-deep)]'
                    }`}
                  >
                    {formatMoney(balance)}
                  </td>
                  <td className="px-5 py-3.5">
                    <SettlementBadge settled={settled} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      }
      mobile={workers.map((worker) => {
        const settled = isWorkerSettled(worker);
        const balance = getWorkerBalance(worker);

        return (
          <MobileCard key={worker.workerId}>
            <MobileCardHeader
              title={
                <div className="flex items-center gap-2">
                  <PickerAvatar name={worker.workerName} />
                  <Link
                    href={`/dashboard/workers/${worker.workerId}`}
                    className="text-[var(--farm-deep)] hover:underline"
                  >
                    {worker.workerName}
                  </Link>
                </div>
              }
              subtitle={worker.phone ?? 'Утасгүй'}
              action={<SettlementBadge settled={settled} />}
            />
            <MobileCardRow
              label="Нийт түүсэн"
              value={formatKg(worker.totalKg)}
              emphasize
            />
            <MobileCardRow label="Төлбөр" value={formatMoney(worker.totalEarned)} />
            <MobileCardRow label="Төлсөн" value={formatMoney(worker.totalPaid)} />
            <MobileCardRow
              label="Үлдэгдэл"
              value={formatMoney(balance)}
              emphasize
            />
          </MobileCard>
        );
      })}
    />
  );
}
