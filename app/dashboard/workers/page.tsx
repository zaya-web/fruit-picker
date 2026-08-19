import { getWorkers } from '@/app/lib/data';
import { CreateWorker } from '@/app/ui/workers/buttons';
import WorkersTable from '@/app/ui/workers/table';

export default async function WorkersPage() {
  const workers = await getWorkers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Workers</h1>
        <CreateWorker />
      </div>
      <WorkersTable workers={workers} />
    </div>
  );
}
