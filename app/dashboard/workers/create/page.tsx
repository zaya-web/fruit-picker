import PageHeader from '@/app/ui/common/page-header';
import { FormPage } from '@/app/ui/common/form-layout';
import CreateWorkerForm from '@/app/ui/workers/create-form';

export default function CreateWorkerPage() {
  return (
    <FormPage>
      <PageHeader title="Түүгч нэмэх" subtitle="Шинэ ажилтны үндсэн мэдээллийг бүртгэнэ" />
      <CreateWorkerForm />
    </FormPage>
  );
}
