'use client';

import { deleteFruit } from '@/app/lib/actions';
import { EditLink, PrimaryLink } from '@/app/ui/components';
import DeleteButton from '@/app/ui/common/delete-button';

export function CreateFruit() {
  return <PrimaryLink href="/dashboard/crops/create">Ургац нэмэх</PrimaryLink>;
}

export function UpdateFruit({ id }: { id: number }) {
  return <EditLink href={`/dashboard/crops/${id}/edit`} />;
}

export function DeleteFruit({ id }: { id: number }) {
  const deleteFruitWithId = deleteFruit.bind(null, id);

  return (
    <DeleteButton
      action={deleteFruitWithId}
      confirmTitle="Ургацыг устгах уу?"
      confirmDescription="Холбоотой түүлтийн бүртгэл байвал устгах боломжгүй."
    />
  );
}
