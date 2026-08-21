import Link from 'next/link';
import type { WorkerSummary } from '@/app/lib/dashboard-stats';
import { buildDashboardHref } from '@/app/lib/dashboard-url';
import PickerAvatar from '@/app/ui/common/picker-avatar';
import { StatMetric } from '@/app/ui/components';
import { formatKg, formatMoney } from '@/app/lib/format';



export default function WorkerOwedCard({
  worker,
  filter,
}: {
  worker: WorkerSummary;
  filter: {
    year?: number;
    month?: number;
    date?: string;
    fruitId?: number;
    workerId?: number;
  };
}) {
  return (
    <section className="farm-card overflow-hidden bg-gradient-to-br from-[#fff8ef] to-[#fff3e6]">
      <div className="flex flex-wrap items-start justify-between gap-4 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <PickerAvatar name={worker.workerName} />
          <div>
            <p className="text-sm font-semibold text-[#9a5b16]">{worker.workerName}</p>
            <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
              Төлөх ёстой ажлын хөлс
            </p>
            <p className="mt-3 text-4xl font-bold tabular-nums tracking-tight text-[#7c3e0a]">
              {formatMoney(worker.owedAmount)}
            </p>
            {worker.owedKg > 0 ? (
              <p className="mt-2 text-sm text-[#9a5b16]">
                ≈ {formatKg(worker.owedKg)} төлөгдөөгүй
              </p>
            ) : null}
          </div>
        </div>
        <Link
          href={`/dashboard/payments/create?workerId=${worker.workerId}`}
          className="farm-btn-primary inline-flex h-10 shrink-0 items-center px-5 text-sm"
        >
          Төлбөр төлөх
        </Link>
      </div>

      <div className="grid border-t border-[#f0dfc8] sm:grid-cols-3">
        <div className="border-b border-[#f0dfc8] px-5 py-4 sm:border-b-0 sm:border-r sm:px-6">
          <StatMetric
            label="Авсан"
            value={formatKg(worker.totalKg)}
            valueClassName="text-lg"
          />
        </div>
        <div className="border-b border-[#f0dfc8] px-5 py-4 sm:border-b-0 sm:border-r sm:px-6">
          <StatMetric
            label="Төлбөр"
            value={formatMoney(worker.totalEarned)}
            valueClassName="text-lg"
          />
        </div>
        <div className="px-5 py-4 sm:px-6">
          <StatMetric
            label="Төлсөн"
            value={formatMoney(worker.totalPaid)}
            valueClassName="text-lg text-[var(--farm-deep)]"
          />
        </div>
      </div>

      <div className="border-t border-[#f0dfc8] px-5 py-3 sm:px-6">
        <Link
          href={buildDashboardHref({ ...filter, workerId: undefined })}
          className="text-sm text-[#9a5b16] hover:underline"
        >
          Ажилтны шүүлтийг арилгах
        </Link>
      </div>
    </section>
  );
}
