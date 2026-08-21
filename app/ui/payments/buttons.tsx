'use client';

import { deletePayment } from '@/app/lib/actions/payments';
import { EditLink, PrimaryLink } from '@/app/ui/components';
import DeleteButton from '@/app/ui/common/delete-button';

export function CreatePayment() {
  return (
    <PrimaryLink href="/dashboard/payments/create">Төлбөр төлөх</PrimaryLink>
  );
}

export function UpdatePayment({ id }: { id: number }) {
  return <EditLink href={`/dashboard/payments/${id}/edit`} />;
}

export function DeletePayment({ id }: { id: number }) {
  const deletePaymentWithId = deletePayment.bind(null, id);

  return (
    <DeleteButton
      action={deletePaymentWithId}
      confirmTitle="Төлбөрийг устгах уу?"
      confirmDescription="Энэ төлбөрийн бүртгэлийг буцаах боломжгүй."
    />
  );
}
