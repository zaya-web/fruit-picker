import { getFruitsForSelect, getWorkRecordById, getWorkersForSelect } from '@/app/lib/data';
import { toDateTimeLocalValue } from '@/app/lib/format';
import PageHeader from '@/app/ui/common/page-header';
import EditWorkRecordForm from '@/app/ui/work-records/edit-form';

export default async function EditWorkRecordPage({
  params,
}: PageProps<'/dashboard/work-records/[id]/edit'>) {
  const { id } = await params;
  const [record, workers, fruits] = await Promise.all([
    getWorkRecordById(Number(id)),
    getWorkersForSelect(),
    getFruitsForSelect(),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader title="Түүлтийн бүртгэл засах" subtitle={`ID: ${record.id}`} />
      <EditWorkRecordForm
        recordId={record.id}
        workers={workers}
        fruits={fruits.map((fruit) => ({
          id: fruit.id,
          name: fruit.name,
          pricePerKg: fruit.pricePerKg.toString(),
        }))}
        initialValues={{
          workerId: String(record.workerId),
          fruitId: String(record.fruitId),
          date: toDateTimeLocalValue(record.date),
          kg: record.kg.toString(),
          pricePerKg: record.pricePerKg.toString(),
        }}
      />
    </div>
  );
}
