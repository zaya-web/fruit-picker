import { getWorkerById } from '@/app/lib/data';
import EditWorkerForm from '@/app/ui/workers/edit-form';

export default async function EditWorkerPage({
  params,
}: PageProps<'/dashboard/workers/[id]/edit'>) {
  const { id } = await params;
  const worker = await getWorkerById(Number(id));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Edit worker</h1>
      <EditWorkerForm worker={worker} />
    </div>
  );
}
