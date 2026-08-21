import { getFruits } from '@/app/lib/data';
import { getFruitKgOverview } from '@/app/lib/section-stats';
import PageHeader from '@/app/ui/common/page-header';
import { CreateFruit } from '@/app/ui/crops/buttons';
import { FruitOverviewCards } from '@/app/ui/crops/harvest-dashboard';
import FruitsTable from '@/app/ui/crops/table';

export default async function FruitsPage() {
  const [fruits, overview] = await Promise.all([
    getFruits(),
    getFruitKgOverview(),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ургацын тариф"
        subtitle="Ургац бүрийн үнэ болон нийт түүлтийн хяналт"
        action={<CreateFruit />}
      />
      <FruitOverviewCards fruits={overview} />
      <FruitsTable fruits={fruits} />
    </div>
  );
}
