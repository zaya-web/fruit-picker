import Link from 'next/link';
import { getWorkersForSelect } from '@/app/lib/data';
import { toDateTimeLocalValue } from '@/app/lib/format';
import {
  getWorkerBalances,
  getWorkerFruitBreakdowns,
} from '@/app/lib/payment-stats';
import PageHeader from '@/app/ui/common/page-header';
import { FormPage } from '@/app/ui/common/form-layout';
import CreatePaymentForm from '@/app/ui/payments/create-form';

export default async function CreatePaymentPage({
  searchParams,
}: PageProps<'/dashboard/payments/create'>) {
  const params = await searchParams;
  const parsedWorkerId = params.workerId ? Number(params.workerId) : undefined;
  const workerId =
    parsedWorkerId && Number.isFinite(parsedWorkerId)
      ? parsedWorkerId
      : undefined;

  const [workers, balances, fruitBreakdowns] = await Promise.all([
    getWorkersForSelect(),
    getWorkerBalances(),
    getWorkerFruitBreakdowns(),
  ]);

  if (workers.length === 0) {
    return (
      <div className="space-y-4">
        <PageHeader title="Төлбөр төлөх" />
        <p className="text-sm text-[var(--text-secondary)]">
          Төлбөр төлөхийн өмнө ажилтан нэмнэ үү.
        </p>
        <Link
          href="/dashboard/workers/create"
          className="farm-btn-primary inline-flex h-10 items-center px-4 text-sm"
        >
          Ажилтан нэмэх
        </Link>
      </div>
    );
  }

  return (
    <FormPage>
      <PageHeader
        title="Төлбөр төлөх"
        subtitle="Хөлсийн дүн ургацын үнэ × авсан кг-аар автоматаар тооцогдоно."
        action={
          workerId ? (
            <Link
              href={`/dashboard/payments/workers/${workerId}`}
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--farm-deep)]"
            >
              ← Буцах
            </Link>
          ) : null
        }
      />
      <CreatePaymentForm
        workers={workers}
        balances={balances}
        fruitBreakdowns={fruitBreakdowns}
        defaultPaidAt={toDateTimeLocalValue(new Date())}
        defaultWorkerId={workerId}
      />
    </FormPage>
  );
}
