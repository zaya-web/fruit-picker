import Link from 'next/link';
import type { FruitHarvestDashboard, FruitKgRow } from '@/app/lib/section-stats';
import DateFilter from '@/app/ui/date-filter';
import EmptyState from '@/app/ui/common/empty-state';
import { FormPanel, PanelHeader } from '@/app/ui/common/form-layout';
import { MobileCard, MobileCardHeader, MobileCardRow } from '@/app/ui/common/mobile-card';
import StatCard from '@/app/ui/common/stat-card';
import { formatKg, formatMoney } from '@/app/lib/format';



export function FruitOverviewCards({ fruits }: { fruits: FruitKgRow[] }) {
  if (fruits.length === 0) {
    return <EmptyState title="Ургац алга. Эхлээд ургац нэмнэ үү." />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {fruits.map((fruit) => (
        <Link
          key={fruit.fruitId}
          href={`/dashboard/crops/${fruit.fruitId}`}
          className="farm-card group p-4 transition hover:border-[color-mix(in_oklab,var(--farm-deep)_35%,white)] hover:shadow-md sm:p-5"
        >
          <p className="font-semibold text-[var(--foreground)] group-hover:text-[var(--farm-deep)]">
            {fruit.fruitName}
          </p>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">
            {formatMoney(fruit.pricePerKg)} / кг
          </p>
          <p className="mt-4 text-2xl font-semibold tabular-nums">
            {formatKg(fruit.totalKg)}
          </p>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            {formatMoney(fruit.totalEarned)}
          </p>
        </Link>
      ))}
    </div>
  );
}

export default function FruitHarvestDashboardCard({
  data,
}: {
  data: FruitHarvestDashboard;
}) {
  return (
    <div className="space-y-6">
      <FormPanel padded>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
          <div className="min-w-0 flex-1">
            <DateFilter
              pathname={`/dashboard/crops/${data.fruit.id}`}
              selectedDate={data.date}
              label="Өдрөөр шүүх"
            />
          </div>
          {data.date ? (
            <Link
              href={`/dashboard/crops/${data.fruit.id}`}
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--farm-deep)]"
            >
              Бүх өдөр
            </Link>
          ) : null}
        </div>
      </FormPanel>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard title="Үнэ / кг" value={formatMoney(data.fruit.pricePerKg)} />
        <StatCard title="Түүсэн кг" value={formatKg(data.totalKg)} />
        <StatCard title="Төлбөр" value={formatMoney(data.totalEarned)} />
      </div>

      <FormPanel>
        <PanelHeader
          title="Ажилтнаар"
          subtitle={
            data.date
              ? `${data.date}-нд энэ ургац түүсэн хүмүүс`
              : 'Энэ ургац түүсэн хүмүүс'
          }
        />
        {data.workers.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-[var(--text-secondary)] sm:px-5">
            Сонгосон хугацаанд түүсэн бүртгэл алга.
          </p>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="farm-table min-w-full text-left text-sm">
                <thead className="bg-[#faf6ee]">
                  <tr>
                    <th className="px-5 py-3 font-medium">Ажилтан</th>
                    <th className="px-5 py-3 text-right font-medium">Кг</th>
                    <th className="px-5 py-3 text-right font-medium">Дүн</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eee6d8]">
                  {data.workers.map((worker) => (
                    <tr key={worker.workerId}>
                      <td className="px-5 py-3.5">
                        <Link
                          href={`/dashboard/workers/${worker.workerId}`}
                          className="font-medium text-[var(--farm-deep)] hover:underline"
                        >
                          {worker.workerName}
                        </Link>
                      </td>
                      <td className="px-5 py-3.5 text-right tabular-nums">
                        {formatKg(worker.totalKg)}
                      </td>
                      <td className="px-5 py-3.5 text-right tabular-nums">
                        {formatMoney(worker.totalEarned)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="space-y-3 p-4 md:hidden">
              {data.workers.map((worker) => (
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
                  />
                  <MobileCardRow label="Кг" value={formatKg(worker.totalKg)} />
                  <MobileCardRow
                    label="Дүн"
                    value={formatMoney(worker.totalEarned)}
                    emphasize
                  />
                </MobileCard>
              ))}
            </div>
          </>
        )}
      </FormPanel>

      {!data.date && data.days.length > 0 ? (
        <FormPanel>
          <PanelHeader title="Өдрөөр түүсэн кг" />
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
                    <td className="px-5 py-3.5">
                      <Link
                        href={`/dashboard/crops/${data.fruit.id}?date=${day.date}`}
                        className="tabular-nums text-[var(--farm-deep)] hover:underline"
                      >
                        {day.date}
                      </Link>
                    </td>
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
                <MobileCardHeader
                  title={
                    <Link
                      href={`/dashboard/crops/${data.fruit.id}?date=${day.date}`}
                      className="text-[var(--farm-deep)] hover:underline"
                    >
                      {day.date}
                    </Link>
                  }
                />
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
