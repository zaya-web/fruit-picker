import Link from 'next/link';
import {
  getWorkerBalance,
  getWorkerPayments,
} from '@/app/lib/payment-stats';
import {
  formatAmount,
  formatKg,
  formatMoney,
  paymentMethodLabel,
  toDateTimeLocalValue,
} from '@/app/lib/format';
import { BackLink, FormPanel, PanelHeader } from '@/app/ui/common/form-layout';
import {
  MobileCard,
  MobileCardActions,
  MobileCardHeader,
  MobileCardRow,
} from '@/app/ui/common/mobile-card';
import PageHeader from '@/app/ui/common/page-header';
import PickerAvatar from '@/app/ui/common/picker-avatar';
import StatCard from '@/app/ui/common/stat-card';
import { DeletePayment, UpdatePayment } from '@/app/ui/payments/buttons';

export default async function WorkerPaymentsPage({
  params,
}: PageProps<'/dashboard/payments/workers/[id]'>) {
  const { id } = await params;
  const workerId = Number(id);
  const [balance, payments] = await Promise.all([
    getWorkerBalance(workerId),
    getWorkerPayments(workerId),
  ]);

  return (
    <div className="space-y-6">
      <BackLink href="/dashboard/payments">← Төлбөр рүү буцах</BackLink>

      <PageHeader
        title={
          <span className="flex min-w-0 items-center gap-3">
            <PickerAvatar name={balance.workerName} />
            <span className="truncate">{balance.workerName}</span>
          </span>
        }
        subtitle={[
          balance.phone ? `Утас: ${balance.phone}` : null,
          balance.bankAccount ? `Данс: ${balance.bankAccount}` : null,
        ]
          .filter(Boolean)
          .join(' · ') || 'Холбоо барих мэдээлэл алга'}
        action={
          <Link
            href={`/dashboard/payments/create?workerId=${workerId}`}
            className="farm-btn-primary inline-flex h-11 items-center px-4 text-sm"
          >
            💸 Төлбөр төлөх
          </Link>
        }
      />

      <div className="farm-card bg-gradient-to-br from-[#fff8ef] to-[#fff3e6] p-4 sm:p-6">
        <p className="text-sm font-medium text-[#9a5b16]">Одоо төлөх ёстой</p>
        <p className="mt-2 text-3xl font-bold tabular-nums text-[#7c3e0a] sm:text-4xl">
          {formatMoney(balance.owedAmount)}
        </p>
        {balance.owedKg > 0 ? (
          <p className="mt-2 text-sm text-[#9a5b16]">
            ≈ {formatKg(balance.owedKg)} төлөгдөөгүй
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard title="Нийт авсан" value={formatKg(balance.totalKg)} />
        <StatCard title="Төлбөр" value={formatMoney(balance.totalEarned)} />
        <StatCard title="Төлсөн" value={formatMoney(balance.totalPaid)} />
      </div>

      <FormPanel>
        <PanelHeader title="Төлбөрийн түүх" />
        {payments.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-[var(--text-secondary)] sm:px-5">
            Энэ ажилтанд одоогоор төлбөр бүртгэгдээгүй байна.
          </p>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="farm-table min-w-full text-left text-sm">
                <thead className="bg-[#faf6ee]">
                  <tr>
                    <th className="px-5 py-3 font-medium">Огноо</th>
                    <th className="px-5 py-3 text-right font-medium">Дүн</th>
                    <th className="px-5 py-3 font-medium">Арга</th>
                    <th className="px-5 py-3 font-medium">Тэмдэглэл</th>
                    <th className="px-5 py-3 font-medium">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eee6d8]">
                  {payments.map((payment) => (
                    <tr key={payment.id}>
                      <td className="px-5 py-3 text-[var(--text-secondary)]">
                        {toDateTimeLocalValue(payment.paidAt).replace('T', ' ')}
                      </td>
                      <td className="px-5 py-3 text-right font-medium tabular-nums">
                        ₮{formatAmount(payment.amount)}
                      </td>
                      <td className="px-5 py-3">
                        <span className="inline-flex rounded-full bg-[#e7f0e8] px-2.5 py-1 text-xs font-medium text-[var(--farm-deep)]">
                          {paymentMethodLabel(payment.method)}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-[var(--text-secondary)]">
                        {payment.note ?? '—'}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-2">
                          <UpdatePayment id={payment.id} />
                          <DeletePayment id={payment.id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-3 p-4 md:hidden">
              {payments.map((payment) => (
                <MobileCard key={payment.id}>
                  <MobileCardHeader
                    title={`₮${formatAmount(payment.amount)}`}
                    subtitle={toDateTimeLocalValue(payment.paidAt).replace('T', ' ')}
                  />
                  <MobileCardRow label="Арга" value={paymentMethodLabel(payment.method)} />
                  <MobileCardRow label="Тэмдэглэл" value={payment.note ?? '—'} />
                  <MobileCardActions>
                    <UpdatePayment id={payment.id} />
                    <DeletePayment id={payment.id} />
                  </MobileCardActions>
                </MobileCard>
              ))}
            </div>
          </>
        )}
      </FormPanel>
    </div>
  );
}
