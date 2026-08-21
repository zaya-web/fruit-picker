'use client';

import { deleteWorkRecord } from '@/app/lib/actions/work-records';
import { EditLink, PrimaryLink } from '@/app/ui/components';
import DeleteButton from '@/app/ui/common/delete-button';

export function CreateWorkRecord() {
  return (
    <PrimaryLink href="/dashboard/work-records/create">Бүртгэл нэмэх</PrimaryLink>
  );
}

export function UpdateWorkRecord({ id }: { id: number }) {
  return <EditLink href={`/dashboard/work-records/${id}/edit`} />;
}

export function DeleteWorkRecord({ id }: { id: number }) {
  const deleteWorkRecordWithId = deleteWorkRecord.bind(null, id);

  return (
    <DeleteButton
      action={deleteWorkRecordWithId}
      confirmTitle="Түүлтийн бүртгэлийг устгах уу?"
      confirmDescription="Энэ бүртгэлийг буцаах боломжгүй."
    />
  );
}
