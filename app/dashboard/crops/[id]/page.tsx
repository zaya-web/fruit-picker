import Link from 'next/link';
import { getFruitHarvestDashboard } from '@/app/lib/section-stats';
import { BackLink } from '@/app/ui/common/form-layout';
import PageHeader from '@/app/ui/common/page-header';
import FruitHarvestDashboardCard from '@/app/ui/crops/harvest-dashboard';

export default async function FruitDashboardPage({
  params,
  searchParams,
}: PageProps<'/dashboard/crops/[id]'>) {
  const { id } = await params;
  const query = await searchParams;
  const fruitId = Number(id);
  const date = query.date;

  const dashboard = await getFruitHarvestDashboard(
    fruitId,
    typeof date === 'string' && date ? date : undefined,
  );

  return (
    <div className="space-y-6">
      <BackLink href="/dashboard/crops">← Ургац руу буцах</BackLink>

      <PageHeader
        title={dashboard.fruit.name}
        subtitle={`Үнэ: ₮${dashboard.fruit.pricePerKg.toLocaleString('en-US')} / кг`}
        action={
          <Link
            href={`/dashboard/crops/${dashboard.fruit.id}/edit`}
            className="inline-flex h-10 items-center rounded-xl border border-[#d9d3c4] px-4 text-sm hover:bg-[#f8f4eb]"
          >
            Засах
          </Link>
        }
      />

      <FruitHarvestDashboardCard data={dashboard} />
    </div>
  );
}
