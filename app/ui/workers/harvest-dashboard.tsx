import Link from 'next/link';
import type { WorkerHarvestDashboard } from '@/app/lib/section-stats';
import { FormPanel, PanelHeader } from '@/app/ui/common/form-layout';
import { MobileCard, MobileCardHeader, MobileCardRow } from '@/app/ui/common/mobile-card';
import StatCard from '@/app/ui/common/stat-card';
import { formatKg, formatMoney } from '@/app/lib/format';



export default function WorkerHarvestDashboardCard({
  data,
  showSummaryCards = true,
}: {
  data: WorkerHarvestDashboard;
  showSummaryCards?: boolean;
}) {
  return (
    <div className="space-y-5">
      {showSummaryCards ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <StatCard title="Нийт авсан" value={formatKg(data.totalKg)} hint="Бүх хугацаа" />
          <StatCard title="Төлбөр" value={formatMoney(data.totalEarned)} hint="Үнэ × кг" />
        </div>
      ) : null}

      <FormPanel>
        <PanelHeader
          title="Түүсэн ургац"
          subtitle="Энэ ажилтны түүсэн ургац тус бүрийн кг"
        />
        {data.fruits.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-[var(--text-secondary)] sm:px-5">
            Одоогоор ажлын бүртгэл алга.
          </p>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="farm-table min-w-full text-left text-sm">
                <thead className="bg-[#faf6ee]">
                  <tr>
                    <th className="px-5 py-3 font-medium">Ургац</th>
                    <th className="px-5 py-3 text-right font-medium">Үнэ/кг</th>
                    <th className="px-5 py-3 text-right font-medium">Кг</th>
                    <th className="px-5 py-3 text-right font-medium">Дүн</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eee6d8]">
                  {data.fruits.map((fruit) => (
                    <tr key={fruit.fruitId}>
                      <td className="px-5 py-3.5">
                        <Link
                          href={`/dashboard/crops/${fruit.fruitId}`}
                          className="font-medium text-[var(--farm-deep)] hover:underline"
                        >
                          {fruit.fruitName}
                        </Link>
                      </td>
                      <td className="px-5 py-3.5 text-right tabular-nums text-[var(--text-secondary)]">
                        {formatMoney(fruit.pricePerKg)}
                      </td>
                      <td className="px-5 py-3.5 text-right tabular-nums">
                        {formatKg(fruit.totalKg)}
                      </td>
                      <td className="px-5 py-3.5 text-right tabular-nums font-medium">
                        {formatMoney(fruit.totalEarned)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="space-y-3 p-4 md:hidden">
              {data.fruits.map((fruit) => (
                <MobileCard key={fruit.fruitId}>
                  <MobileCardHeader
                    title={
                      <Link
                        href={`/dashboard/crops/${fruit.fruitId}`}
                        className="text-[var(--farm-deep)] hover:underline"
                      >
                        {fruit.fruitName}
                      </Link>
                    }
                  />
                  <MobileCardRow label="Үнэ/кг" value={formatMoney(fruit.pricePerKg)} />
                  <MobileCardRow label="Кг" value={formatKg(fruit.totalKg)} />
                  <MobileCardRow
                    label="Дүн"
                    value={formatMoney(fruit.totalEarned)}
                    emphasize
                  />
                </MobileCard>
              ))}
            </div>
          </>
        )}
      </FormPanel>

      {data.days.length > 0 ? (
        <FormPanel>
          <PanelHeader title="Өдрөөр" />
          <div className="hidden overflow-x-auto md:block">
            <table className="farm-table min-w-full text-left text-sm">
              <thead className="bg-[#faf6ee]">
                <tr>
                  <th className="px-5 py-3 font-medium">Өдөр</th>
                  <th className="px-5 py-3 text-right font-medium">Кг</th>
                  <th className="px-5 py-3 text-right font-medium">Дүн</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eee6d8]">
                {data.days.map((day) => (
                  <tr key={day.date}>
                    <td className="px-5 py-3.5 tabular-nums">{day.date}</td>
                    <td className="px-5 py-3.5 text-right tabular-nums">
                      {formatKg(day.totalKg)}
                    </td>
                    <td className="px-5 py-3.5 text-right tabular-nums">
                      {formatMoney(day.totalEarned)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="space-y-3 p-4 md:hidden">
            {data.days.map((day) => (
              <MobileCard key={day.date}>
                <MobileCardHeader title={day.date} />
                <MobileCardRow label="Кг" value={formatKg(day.totalKg)} />
                <MobileCardRow
                  label="Дүн"
                  value={formatMoney(day.totalEarned)}
                  emphasize
                />
              </MobileCard>
            ))}
          </div>
        </FormPanel>
      ) : null}
    </div>
  );
}
