import Link from 'next/link';
import { getFruitsForSelect, getWorkersForSelect } from '@/app/lib/data';
import { toDateTimeLocalValue } from '@/app/lib/format';
import EmptyState from '@/app/ui/common/empty-state';
import PageHeader from '@/app/ui/common/page-header';
import { FormPage } from '@/app/ui/common/form-layout';
import CreateWorkRecordForm from '@/app/ui/work-records/create-form';

export default async function CreateWorkRecordPage() {
  const [workers, fruits] = await Promise.all([
    getWorkersForSelect(),
    getFruitsForSelect(),
  ]);

  if (workers.length === 0 || fruits.length === 0) {
    return (
      <div className="space-y-4">
        <PageHeader title="Өдрийн түүлт бүртгэх" />
        <EmptyState
          title="Бүртгэл эхлүүлэхэд ажилтан болон ургац шаардлагатай."
          action={
            <div className="flex justify-center gap-3">
              <Link
                href="/dashboard/workers/create"
                className="farm-btn-primary inline-flex h-10 items-center px-4 text-sm"
              >
                Ажилтан нэмэх
              </Link>
              <Link
                href="/dashboard/crops/create"
                className="inline-flex h-10 items-center rounded-xl border border-[#d9d3c4] px-4 text-sm font-medium hover:bg-[#f8f4eb]"
              >
                Ургац нэмэх
              </Link>
            </div>
          }
        />
      </div>
    );
  }

  return (
    <FormPage>
      <PageHeader title="Өдрийн түүлт бүртгэх" subtitle="Ажилтан → ургац → кг дарааллаар бүртгэнэ" />
      <CreateWorkRecordForm
        workers={workers}
        defaultDate={toDateTimeLocalValue(new Date())}
        fruits={fruits.map((fruit) => ({
          id: fruit.id,
          name: fruit.name,
          pricePerKg: fruit.pricePerKg.toString(),
        }))}
      />
    </FormPage>
  );
}
