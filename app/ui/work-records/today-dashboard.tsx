import Link from 'next/link';
import type { DayPickerRow } from '@/app/lib/section-stats';
import DateFilter from '@/app/ui/date-filter';
import PickerAvatar from '@/app/ui/common/picker-avatar';
import { MobileCard, MobileCardHeader, MobileCardRow } from '@/app/ui/common/mobile-card';
import { formatKg, formatMoney } from '@/app/lib/format';



export default function TodayPickerDashboard({
  date,
  totalKg,
  totalEarned,
  pickers,
}: {
  date: string;
  totalKg: number;
  totalEarned: number;
  pickers: DayPickerRow[];
}) {
  return (
    <section className="farm-card overflow-hidden">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#eee6d8] px-5 py-4 sm:px-6">
        <div>
          <h2 className="text-base font-semibold">Өдрийн авалт</h2>
          <p className="mt-0.5 text-sm text-[var(--text-secondary)]">
            {date} — тухайн өдөр түүж буй хүмүүс
          </p>
        </div>
        <DateFilter pathname="/dashboard/work-records" selectedDate={date} />
      </div>

      <div className="grid border-b border-[#eee6d8] sm:grid-cols-2">
        <div className="border-b border-[#eee6d8] px-5 py-4 sm:border-b-0 sm:border-r sm:px-6">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
            Нийт кг
          </p>
          <p className="mt-1 text-xl font-semibold tabular-nums">{formatKg(totalKg)}</p>
        </div>
        <div className="px-5 py-4 sm:px-6">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
            Төлбөр
          </p>
          <p className="mt-1 text-xl font-semibold tabular-nums">
            {formatMoney(totalEarned)}
          </p>
        </div>
      </div>

      {pickers.length === 0 ? (
        <p className="p-8 text-center text-sm text-[var(--text-secondary)]">
          Энэ өдөр түүсэн бүртгэл алга.
        </p>
      ) : (
        <>
          <div className="hidden overflow-x-auto md:block">
            <table className="farm-table min-w-full text-left text-sm">
              <thead className="bg-[#faf6ee]">
                <tr>
                  <th className="px-5 py-3 font-medium">Ажилтан</th>
                  <th className="px-5 py-3 font-medium">Ургац</th>
                  <th className="px-5 py-3 text-right font-medium">Кг</th>
                  <th className="px-5 py-3 text-right font-medium">Дүн</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eee6d8]">
                {pickers.map((picker) => (
                  <tr key={picker.workerId}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <PickerAvatar name={picker.workerName} />
                        <Link
                          href={`/dashboard/workers/${picker.workerId}`}
                          className="font-medium text-[var(--farm-deep)] hover:underline"
                        >
                          {picker.workerName}
                        </Link>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[var(--text-secondary)]">
                      {picker.fruits
                        .map((fruit) => `${fruit.fruitName} ${formatKg(fruit.totalKg)}`)
                        .join(', ')}
                    </td>
                    <td className="px-5 py-3.5 text-right tabular-nums font-medium">
                      {formatKg(picker.totalKg)}
                    </td>
                    <td className="px-5 py-3.5 text-right tabular-nums">
                      {formatMoney(picker.totalEarned)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 p-4 md:hidden">
            {pickers.map((picker) => (
              <MobileCard key={picker.workerId}>
                <MobileCardHeader
                  title={
                    <div className="flex items-center gap-2">
                      <PickerAvatar name={picker.workerName} />
                      <Link
                        href={`/dashboard/workers/${picker.workerId}`}
                        className="text-[var(--farm-deep)] hover:underline"
                      >
                        {picker.workerName}
                      </Link>
                    </div>
                  }
                />
                <MobileCardRow
                  label="Ургац"
                  value={picker.fruits
                    .map((fruit) => `${fruit.fruitName} ${formatKg(fruit.totalKg)}`)
                    .join(', ')}
                />
                <MobileCardRow label="Кг" value={formatKg(picker.totalKg)} />
                <MobileCardRow
                  label="Дүн"
                  value={formatMoney(picker.totalEarned)}
                  emphasize
                />
              </MobileCard>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
