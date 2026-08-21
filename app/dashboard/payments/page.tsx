import { getWorkerBalances } from '@/app/lib/payment-stats';
import PageHeader from '@/app/ui/common/page-header';
import StatCard from '@/app/ui/common/stat-card';
import { CreatePayment } from '@/app/ui/payments/buttons';
import WorkerBalancesTable from '@/app/ui/payments/worker-balances-table';

export default async function PaymentsPage() {
  const balances = await getWorkerBalances();
  const totalEarned = balances.reduce((sum, item) => sum + item.totalEarned, 0);
  const totalPaid = balances.reduce((sum, item) => sum + item.totalPaid, 0);
  const totalOwed = balances.reduce((sum, item) => sum + item.owedAmount, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Төлбөр тооцоо"
        subtitle="Нийт олгох, олгосон, үлдэгдлийг нэг дороос харна"
        action={<CreatePayment />}
      />
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Нийт олгох"
          value={`₮${totalEarned.toLocaleString('en-US')}`}
        />
        <StatCard
          title="Нийт олгосон"
          value={`₮${totalPaid.toLocaleString('en-US')}`}
        />
        <StatCard
          title="Үлдэгдэл"
          value={`₮${totalOwed.toLocaleString('en-US')}`}
        />
      </div>
      <WorkerBalancesTable balances={balances} />
    </div>
  );
}
