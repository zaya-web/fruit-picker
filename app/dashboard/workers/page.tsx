import { getWorkers } from '@/app/lib/data';
import PageHeader from '@/app/ui/common/page-header';
import { CreateWorker } from '@/app/ui/workers/buttons';
import WorkersTable from '@/app/ui/workers/table';

export default async function WorkersPage() {
  const workers = await getWorkers();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Түүгчид"
        subtitle={`Нийт ${workers.length} ажилтан`}
        action={<CreateWorker />}
      />
      <WorkersTable workers={workers} />
    </div>
  );
}
