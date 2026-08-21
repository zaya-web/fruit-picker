import { getPaymentById, getWorkersForSelect } from '@/app/lib/data';
import { toDateTimeLocalValue } from '@/app/lib/format';
import PageHeader from '@/app/ui/common/page-header';
import EditPaymentForm from '@/app/ui/payments/edit-form';

export default async function EditPaymentPage({
  params,
}: PageProps<'/dashboard/payments/[id]/edit'>) {
  const { id } = await params;
  const [payment, workers] = await Promise.all([
    getPaymentById(Number(id)),
    getWorkersForSelect(),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader title="Төлбөрийн бүртгэл засах" subtitle={`ID: ${payment.id}`} />
      <EditPaymentForm
        paymentId={payment.id}
        workers={workers}
        initialValues={{
          workerId: String(payment.workerId),
          amount: payment.amount.toString(),
          paidAt: toDateTimeLocalValue(payment.paidAt),
          method: payment.method,
          note: payment.note ?? '',
        }}
      />
    </div>
  );
}
