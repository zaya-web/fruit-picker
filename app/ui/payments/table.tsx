import EmptyState from '@/app/ui/common/empty-state';
import {
  MobileCard,
  MobileCardActions,
  MobileCardHeader,
  MobileCardRow,
} from '@/app/ui/common/mobile-card';
import { DeletePayment, UpdatePayment } from '@/app/ui/payments/buttons';
import { formatAmount, paymentMethodLabel, toDateTimeLocalValue } from '@/app/lib/format';
import type { Payment, Worker } from '@prisma/client';

type PaymentRow = Payment & {
  worker: Worker;
};

export default function PaymentsTable({ payments }: { payments: PaymentRow[] }) {
  if (payments.length === 0) {
    return <EmptyState title="Одоогоор төлбөрийн бүртгэл алга байна." />;
  }

  return (
    <>
      <div className="hidden md:block farm-card overflow-x-auto">
        <table className="farm-table min-w-full text-left text-sm">
          <thead className="bg-[#faf6ee]">
            <tr>
              <th className="px-4 py-3 font-medium">Огноо</th>
              <th className="px-4 py-3 font-medium">Ажилтан</th>
              <th className="px-4 py-3 text-right font-medium">Дүн</th>
              <th className="px-4 py-3 font-medium">Арга</th>
              <th className="px-4 py-3 font-medium">Тэмдэглэл</th>
              <th className="px-4 py-3 font-medium">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eee6d8]">
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td className="px-4 py-3 text-[var(--text-secondary)]">
                  {toDateTimeLocalValue(payment.paidAt).replace('T', ' ')}
                </td>
                <td className="px-4 py-3 font-medium">{payment.worker.name}</td>
                <td className="px-4 py-3 text-right tabular-nums font-medium">
                  ₮{formatAmount(payment.amount)}
                </td>
                <td className="px-4 py-3 text-[var(--text-secondary)]">
                  {paymentMethodLabel(payment.method)}
                </td>
                <td className="px-4 py-3 text-[var(--text-secondary)]">
                  {payment.note ?? '—'}
                </td>
                <td className="px-4 py-3">
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

      <div className="space-y-3 md:hidden">
        {payments.map((payment) => (
          <MobileCard key={payment.id}>
            <MobileCardHeader
              title={payment.worker.name}
              subtitle={toDateTimeLocalValue(payment.paidAt).replace('T', ' ')}
            />
            <MobileCardRow
              label="Дүн"
              value={`₮${formatAmount(payment.amount)}`}
              emphasize
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
  );
}
