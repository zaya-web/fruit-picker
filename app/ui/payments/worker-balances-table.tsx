import Link from 'next/link';
import { formatKg, formatMoney } from '@/app/lib/format';
import type { WorkerBalance } from '@/app/lib/payment-stats';
import EmptyState from '@/app/ui/common/empty-state';
import {
  MobileCard,
  MobileCardActions,
  MobileCardHeader,
  MobileCardRow,
} from '@/app/ui/common/mobile-card';
import PickerAvatar from '@/app/ui/common/picker-avatar';

export default function WorkerBalancesTable({
  balances,
}: {
  balances: WorkerBalance[];
}) {
  if (balances.length === 0) {
    return <EmptyState title="Төлбөрийн өгөгдөл алга байна." />;
  }

  return (
    <>
      <div className="hidden md:block farm-card overflow-x-auto">
        <table className="farm-table min-w-full text-left text-sm">
          <thead className="bg-[#faf6ee]">
            <tr>
              <th className="px-4 py-3 font-medium">Ажилтан</th>
              <th className="px-4 py-3 text-right font-medium">Авсан кг</th>
              <th className="px-4 py-3 text-right font-medium">Төлбөр</th>
              <th className="px-4 py-3 text-right font-medium">Төлсөн</th>
              <th className="px-4 py-3 text-right font-medium">Төлөх ёстой</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eee6d8]">
            {balances.map((balance) => (
              <tr key={balance.workerId}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <PickerAvatar name={balance.workerName} />
                    <Link
                      href={`/dashboard/payments/workers/${balance.workerId}`}
                      className="font-medium text-[var(--farm-deep)] hover:underline"
                    >
                      {balance.workerName}
                    </Link>
                  </div>
                  {balance.phone ? (
                    <p className="mt-1 text-xs text-[var(--text-secondary)]">{balance.phone}</p>
                  ) : null}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-[var(--text-secondary)]">
                  {formatKg(balance.totalKg)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums">{formatMoney(balance.totalEarned)}</td>
                <td className="px-4 py-3 text-right tabular-nums text-[var(--farm-deep)]">
                  {formatMoney(balance.totalPaid)}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex flex-wrap items-center justify-end gap-3">
                    <span
                      className={
                        balance.owedAmount > 0
                          ? 'font-semibold text-amber-700'
                          : 'text-[var(--text-secondary)]'
                      }
                    >
                      {formatMoney(balance.owedAmount)}
                    </span>
                    {balance.owedAmount > 0 ? (
                      <Link
                        href={`/dashboard/payments/create?workerId=${balance.workerId}`}
                        className="farm-btn-primary inline-flex min-h-10 items-center px-3 text-sm"
                      >
                        💸 Төлбөр төлөх
                      </Link>
                    ) : null}
                  </div>
                  {balance.owedKg > 0 ? (
                    <p className="mt-1 text-xs text-[var(--text-secondary)]">
                      ≈ {formatKg(balance.owedKg)}
                    </p>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {balances.map((balance) => (
          <MobileCard key={balance.workerId}>
            <MobileCardHeader
              title={
                <div className="flex items-center gap-2">
                  <PickerAvatar name={balance.workerName} />
                  <Link
                    href={`/dashboard/payments/workers/${balance.workerId}`}
                    className="text-[var(--farm-deep)] hover:underline"
                  >
                    {balance.workerName}
                  </Link>
                </div>
              }
              subtitle={balance.phone ?? undefined}
            />
            <MobileCardRow label="Авсан кг" value={formatKg(balance.totalKg)} />
            <MobileCardRow label="Төлбөр" value={formatMoney(balance.totalEarned)} />
            <MobileCardRow label="Төлсөн" value={formatMoney(balance.totalPaid)} />
            <MobileCardRow
              label="Төлөх ёстой"
              value={formatMoney(balance.owedAmount)}
              emphasize
            />
            {balance.owedAmount > 0 ? (
              <MobileCardActions>
                <Link
                  href={`/dashboard/payments/create?workerId=${balance.workerId}`}
                  className="farm-btn-primary inline-flex min-h-10 w-full items-center justify-center px-3 text-sm"
                >
                  💸 Төлбөр төлөх
                </Link>
              </MobileCardActions>
            ) : null}
          </MobileCard>
        ))}
      </div>
    </>
  );
}
