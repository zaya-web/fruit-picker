'use client';

import { deleteWorker } from '@/app/lib/actions';
import { EditLink, PrimaryLink } from '@/app/ui/components';
import DeleteButton from '@/app/ui/common/delete-button';

export function CreateWorker() {
  return (
    <PrimaryLink href="/dashboard/workers/create">Ажилтан нэмэх</PrimaryLink>
  );
}

export function UpdateWorker({ id }: { id: number }) {
  return <EditLink href={`/dashboard/workers/${id}/edit`} />;
}

export function DeleteWorker({ id }: { id: number }) {
  const deleteWorkerWithId = deleteWorker.bind(null, id);

  return (
    <DeleteButton
      action={deleteWorkerWithId}
      confirmTitle="Түүгчийг устгах уу?"
      confirmDescription="Холбоотой бүртгэл байвал устгах боломжгүй."
    />
  );
}
