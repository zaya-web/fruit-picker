import { getWorkerById } from '@/app/lib/data';
import PageHeader from '@/app/ui/common/page-header';
import { FormPage } from '@/app/ui/common/form-layout';
import EditWorkerForm from '@/app/ui/workers/edit-form';

export default async function EditWorkerPage({
  params,
}: PageProps<'/dashboard/workers/[id]/edit'>) {
  const { id } = await params;
  const worker = await getWorkerById(Number(id));

  return (
    <FormPage>
      <PageHeader title="Түүгч засах" subtitle={worker.name} />
      <EditWorkerForm worker={worker} />
    </FormPage>
  );
}
