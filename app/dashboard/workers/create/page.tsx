import CreateWorkerForm from '@/app/ui/workers/create-form';

export default function CreateWorkerPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Add worker</h1>
      <CreateWorkerForm />
    </div>
  );
}
