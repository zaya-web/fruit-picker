import { getFruitById } from '@/app/lib/data';
import PageHeader from '@/app/ui/common/page-header';
import EditFruitForm from '@/app/ui/crops/edit-form';

export default async function EditFruitPage({
  params,
}: PageProps<'/dashboard/crops/[id]/edit'>) {
  const { id } = await params;
  const fruit = await getFruitById(Number(id));

  return (
    <div className="space-y-6">
      <PageHeader title="Ургацын тариф засах" subtitle={fruit.name} />
      <EditFruitForm fruit={fruit} />
    </div>
  );
}
