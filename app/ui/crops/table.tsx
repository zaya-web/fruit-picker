import Link from 'next/link';
import EmptyState from '@/app/ui/common/empty-state';
import {
  MobileCard,
  MobileCardActions,
  MobileCardHeader,
  MobileCardRow,
} from '@/app/ui/common/mobile-card';
import { DeleteFruit, UpdateFruit } from '@/app/ui/crops/buttons';
import { formatAmount, formatDate } from '@/app/lib/format';
import type { Fruit } from '@prisma/client';

export default function FruitsTable({ fruits }: { fruits: Fruit[] }) {
  if (fruits.length === 0) {
    return <EmptyState title="Одоогоор ургацын мэдээлэл алга байна." />;
  }

  return (
    <>
      <div className="hidden md:block farm-card overflow-x-auto">
        <table className="farm-table min-w-full text-left text-sm">
          <thead className="bg-[#faf6ee]">
            <tr>
              <th className="px-4 py-3 font-medium">Нэр</th>
              <th className="px-4 py-3 font-medium">Үнэ / кг</th>
              <th className="px-4 py-3 font-medium">Нэмсэн</th>
              <th className="px-4 py-3 font-medium">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eee6d8]">
            {fruits.map((fruit) => (
              <tr key={fruit.id}>
                <td className="px-4 py-3 font-medium">
                  <Link
                    href={`/dashboard/crops/${fruit.id}`}
                    className="text-[var(--farm-deep)] hover:underline"
                  >
                    {fruit.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-[var(--text-secondary)]">
                  {formatAmount(fruit.pricePerKg)}
                </td>
                <td className="px-4 py-3 text-[var(--text-secondary)]">
                  {formatDate(fruit.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <UpdateFruit id={fruit.id} />
                    <DeleteFruit id={fruit.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {fruits.map((fruit) => (
          <MobileCard key={fruit.id}>
            <MobileCardHeader
              title={
                <Link
                  href={`/dashboard/crops/${fruit.id}`}
                  className="text-[var(--farm-deep)] hover:underline"
                >
                  {fruit.name}
                </Link>
              }
              subtitle={`Нэмсэн: ${formatDate(fruit.createdAt)}`}
            />
            <MobileCardRow
              label="Үнэ / кг"
              value={`₮${formatAmount(fruit.pricePerKg)}`}
              emphasize
            />
            <MobileCardActions>
              <UpdateFruit id={fruit.id} />
              <DeleteFruit id={fruit.id} />
            </MobileCardActions>
          </MobileCard>
        ))}
      </div>
    </>
  );
}
