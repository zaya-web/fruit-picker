import Link from 'next/link';
import type { FruitSummary } from '@/app/lib/dashboard-stats';
import { formatKg, formatMoney } from '@/app/lib/format';
import { getFruitBalance, isFruitSettled } from '@/app/lib/report-settlement';
import EmptyState from '@/app/ui/common/empty-state';
import {
  MobileCard,
  MobileCardHeader,
  MobileCardRow,
} from '@/app/ui/common/mobile-card';
import { DataTableShell, SettlementBadge } from '@/app/ui/components';

export default function ReportFruitsTable({
  fruits,
}: {
  fruits: FruitSummary[];
}) {
  const visibleFruits = fruits.filter((fruit) => fruit.totalKg > 0);

  if (visibleFruits.length === 0) {
    return <EmptyState title="Ургацын өгөгдөл алга." />;
  }

  return (
    <DataTableShell
      title="Ургацаар"
      subtitle="Төлбөр − төлсөн = үлдэгдэл. Их эсвэл бага бол тооцоотой; яг 0 бол тооцоогүй."
      desktop={
        <table className="farm-table min-w-full text-left text-sm">
          <thead className="bg-[#faf6ee]">
            <tr>
              <th className="px-5 py-3 font-medium">Ургац</th>
              <th className="px-5 py-3 text-right font-medium">Нийт түүсэн</th>
              <th className="px-5 py-3 text-right font-medium">Төлбөр</th>
              <th className="px-5 py-3 text-right font-medium">Төлсөн</th>
              <th className="px-5 py-3 text-right font-medium">Үлдэгдэл</th>
              <th className="px-5 py-3 font-medium">Тооцоо</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eee6d8]">
            {visibleFruits.map((fruit) => {
              const settled = isFruitSettled(fruit);
              const balance = getFruitBalance(fruit);

              return (
                <tr key={fruit.fruitId}>
                  <td className="px-5 py-3.5">
                    <Link
                      href={`/dashboard/crops/${fruit.fruitId}`}
                      className="font-medium text-[var(--farm-deep)] hover:underline"
                    >
                      {fruit.fruitName}
                    </Link>
                  </td>
                  <td className="px-5 py-3.5 text-right font-medium tabular-nums">
                    {formatKg(fruit.totalKg)}
                  </td>
                  <td className="px-5 py-3.5 text-right tabular-nums">
                    {formatMoney(fruit.totalEarned)}
                  </td>
                  <td className="px-5 py-3.5 text-right tabular-nums text-[var(--farm-deep)]">
                    {formatMoney(fruit.totalPaid)}
                  </td>
                  <td
                    className={`px-5 py-3.5 text-right font-medium tabular-nums ${
                      balance === 0
                        ? ''
                        : balance > 0
                          ? 'text-[#9a5b16]'
                          : 'text-[var(--farm-deep)]'
                    }`}
                  >
                    {formatMoney(balance)}
                  </td>
                  <td className="px-5 py-3.5">
                    <SettlementBadge settled={settled} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      }
      mobile={visibleFruits.map((fruit) => {
        const settled = isFruitSettled(fruit);
        const balance = getFruitBalance(fruit);

        return (
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
              action={<SettlementBadge settled={settled} />}
            />
            <MobileCardRow
              label="Нийт түүсэн"
              value={formatKg(fruit.totalKg)}
              emphasize
            />
            <MobileCardRow label="Төлбөр" value={formatMoney(fruit.totalEarned)} />
            <MobileCardRow label="Төлсөн" value={formatMoney(fruit.totalPaid)} />
            <MobileCardRow
              label="Үлдэгдэл"
              value={formatMoney(balance)}
              emphasize
            />
          </MobileCard>
        );
      })}
    />
  );
}
