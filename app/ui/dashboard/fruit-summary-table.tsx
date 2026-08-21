import Link from 'next/link';
import type { FruitSummary } from '@/app/lib/dashboard-stats';
import { formatKg, formatMoney } from '@/app/lib/format';
import { DataTableShell } from '@/app/ui/components';
import EmptyState from '@/app/ui/common/empty-state';
import {
  MobileCard,
  MobileCardHeader,
  MobileCardRow,
} from '@/app/ui/common/mobile-card';

export default function FruitSummaryTable({
  summaries,
}: {
  summaries: FruitSummary[];
}) {
  const visibleSummaries = summaries.filter((fruit) => fruit.totalKg > 0);

  if (visibleSummaries.length === 0) {
    return <EmptyState title="Ургацын өгөгдөл алга." />;
  }

  return (
    <DataTableShell
      title="Ургацаар"
      subtitle="Нэр дээр дарж ургацын дэлгэрэнгүй рүү орно"
      desktop={
        <table className="farm-table min-w-full text-left text-sm">
          <thead className="bg-[#faf6ee]">
            <tr>
              <th className="px-5 py-3 font-medium">Ургац</th>
              <th className="px-5 py-3 text-right font-medium">Кг</th>
              <th className="px-5 py-3 text-right font-medium">Төлбөр</th>
              <th className="px-5 py-3 text-right font-medium">Төлсөн</th>
              <th className="px-5 py-3 text-right font-medium">Үлдэгдэл</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eee6d8]">
            {visibleSummaries.map((fruit) => (
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
                  {formatKg(fruit.totalKg)}
                </td>
                <td className="px-5 py-3.5 text-right tabular-nums">
                  {formatMoney(fruit.totalEarned)}
                </td>
                <td className="px-5 py-3.5 text-right tabular-nums text-[var(--farm-deep)]">
                  {formatMoney(fruit.totalPaid)}
                </td>
                <td className="px-5 py-3.5 text-right tabular-nums text-[#b45309]">
                  {formatMoney(fruit.unpaidAmount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      }
      mobile={visibleSummaries.map((fruit) => (
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
          <MobileCardRow label="Кг" value={formatKg(fruit.totalKg)} />
          <MobileCardRow label="Төлбөр" value={formatMoney(fruit.totalEarned)} />
          <MobileCardRow label="Төлсөн" value={formatMoney(fruit.totalPaid)} />
          <MobileCardRow
            label="Үлдэгдэл"
            value={formatMoney(fruit.unpaidAmount)}
            emphasize
          />
        </MobileCard>
      ))}
    />
  );
}
