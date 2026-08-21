import Link from 'next/link';
import { getWorkRecordsByWorkerId } from '@/app/lib/data';
import { getWorkerBalance } from '@/app/lib/payment-stats';
import { getWorkerHarvestDashboard } from '@/app/lib/section-stats';
import { BackLink } from '@/app/ui/common/form-layout';
import PageHeader from '@/app/ui/common/page-header';
import PickerAvatar from '@/app/ui/common/picker-avatar';
import StatCard from '@/app/ui/common/stat-card';
import StatusBadge from '@/app/ui/common/status-badge';
import WorkerHarvestDashboardCard from '@/app/ui/workers/harvest-dashboard';
import WorkRecordsTable from '@/app/ui/work-records/table';
import { formatKg, formatMoney } from '@/app/lib/format';



export default async function WorkerDashboardPage({
  params,
}: PageProps<'/dashboard/workers/[id]'>) {
  const { id } = await params;
  const workerId = Number(id);
  const [dashboard, balance, records] = await Promise.all([
    getWorkerHarvestDashboard(workerId),
    getWorkerBalance(workerId),
    getWorkRecordsByWorkerId(workerId),
  ]);
  const { worker } = dashboard;

  return (
    <div className="space-y-6">
      <BackLink href="/dashboard/workers">← Түүгчид рүү буцах</BackLink>

      <PageHeader
        title={
          <span className="flex min-w-0 items-center gap-3">
            <PickerAvatar name={worker.name} />
            <span className="truncate">{worker.name}</span>
            <StatusBadge status={worker.status as 'ACTIVE' | 'INACTIVE'} />
          </span>
        }
        subtitle={[
          worker.phone ? `Утас: ${worker.phone}` : 'Утас бүртгэгдээгүй',
          worker.bankAccount
            ? `Данс: ${worker.bankAccount}`
            : 'Данс бүртгэгдээгүй',
        ].join(' · ')}
        action={
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Link
              href={`/dashboard/workers/${worker.id}/edit`}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-[#d9d3c4] px-4 text-sm hover:bg-[#f8f4eb]"
            >
              Засах
            </Link>
            <Link
              href={`/dashboard/payments/create?workerId=${worker.id}`}
              className="farm-btn-primary inline-flex h-11 items-center justify-center px-4 text-sm"
            >
              💸 Төлбөр төлөх
            </Link>
          </div>
        }
      />

      <div className="farm-card bg-gradient-to-br from-[#fff8ef] to-[#fff3e6] p-4 sm:p-6">
        <p className="text-sm font-medium text-[#9a5b16]">Төлөгдөөгүй үлдэгдэл</p>
        <p className="mt-2 text-3xl font-bold tabular-nums text-[#7c3e0a] sm:text-4xl">
          {formatMoney(balance.owedAmount)}
        </p>
        {balance.owedKg > 0 ? (
          <p className="mt-2 text-sm text-[#9a5b16]">
            ≈ {formatKg(balance.owedKg)} төлөгдөөгүй
          </p>
        ) : (
          <p className="mt-2 text-sm text-[var(--farm-deep)]">Тооцоо бүрэн хийгдсэн</p>
        )}
        <div className="mt-4">
          <Link
            href={`/dashboard/payments/workers/${worker.id}`}
            className="text-sm font-medium text-[var(--farm-deep)] hover:underline"
          >
            Төлбөрийн түүх харах →
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard title="Нийт түүсэн" value={formatKg(balance.totalKg)} />
        <StatCard title="Төлбөр" value={formatMoney(balance.totalEarned)} />
        <StatCard title="Төлсөн" value={formatMoney(balance.totalPaid)} />
      </div>

      <WorkerHarvestDashboardCard data={dashboard} showSummaryCards={false} />

      <WorkRecordsTable records={records} />
    </div>
  );
}
