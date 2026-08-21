import Link from 'next/link';
import type { WorkerSummary } from '@/app/lib/dashboard-stats';
import { formatKg, formatMoney } from '@/app/lib/format';
import { DataTableShell } from '@/app/ui/components';
import EmptyState from '@/app/ui/common/empty-state';
import {
  MobileCard,
  MobileCardHeader,
  MobileCardRow,
} from '@/app/ui/common/mobile-card';
import PickerAvatar from '@/app/ui/common/picker-avatar';

export default function WorkerSummaryTable({
  summaries,
}: {
  summaries: WorkerSummary[];
}) {
  const visibleSummaries = summaries.filter((worker) => worker.totalKg > 0);

  if (visibleSummaries.length === 0) {
    return <EmptyState title="Ажилтны өгөгдөл алга." />;
  }

  return (
    <DataTableShell
      title="Ажилтнаар"
      subtitle="Нэр дээр дарж ажилтны дэлгэрэнгүй рүү орно"
      desktop={
        <table className="farm-table min-w-full text-left text-sm">
          <thead className="bg-[#faf6ee]">
            <tr>
              <th className="px-5 py-3 font-medium">Ажилтан</th>
              <th className="px-5 py-3 text-right font-medium">Кг</th>
              <th className="px-5 py-3 text-right font-medium">Төлбөр</th>
              <th className="px-5 py-3 text-right font-medium">Төлсөн</th>
              <th className="px-5 py-3 text-right font-medium">Үлдэгдэл</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eee6d8]">
            {visibleSummaries.map((worker) => (
              <tr key={worker.workerId}>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <PickerAvatar name={worker.workerName} />
                    <div>
                      <Link
                        href={`/dashboard/workers/${worker.workerId}`}
                        className="font-medium text-[var(--farm-deep)] hover:underline"
                      >
                        {worker.workerName}
                      </Link>
                      {worker.phone ? (
                        <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                          {worker.phone}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-right tabular-nums text-[var(--text-secondary)]">
                  {formatKg(worker.totalKg)}
                </td>
                <td className="px-5 py-3.5 text-right tabular-nums">
                  {formatMoney(worker.totalEarned)}
                </td>
                <td className="px-5 py-3.5 text-right tabular-nums text-[var(--farm-deep)]">
                  {formatMoney(worker.totalPaid)}
                </td>
                <td className="px-5 py-3.5 text-right tabular-nums">
                  <span
                    className={
                      worker.owedAmount > 0
                        ? 'font-semibold text-[#b45309]'
                        : 'text-[var(--text-muted)]'
                    }
                  >
                    {formatMoney(worker.owedAmount)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      }
      mobile={visibleSummaries.map((worker) => (
        <MobileCard key={worker.workerId}>
          <MobileCardHeader
            title={
              <Link
                href={`/dashboard/workers/${worker.workerId}`}
                className="text-[var(--farm-deep)] hover:underline"
              >
                {worker.workerName}
              </Link>
            }
            subtitle={worker.phone ?? undefined}
          />
          <MobileCardRow label="Кг" value={formatKg(worker.totalKg)} />
          <MobileCardRow label="Төлбөр" value={formatMoney(worker.totalEarned)} />
          <MobileCardRow label="Төлсөн" value={formatMoney(worker.totalPaid)} />
          <MobileCardRow
            label="Үлдэгдэл"
            value={formatMoney(worker.owedAmount)}
            emphasize
          />
        </MobileCard>
      ))}
    />
  );
}
