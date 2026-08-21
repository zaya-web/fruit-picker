import PageHeader from '@/app/ui/common/page-header';
import { FormPage } from '@/app/ui/common/form-layout';
import CreateFruitForm from '@/app/ui/crops/create-form';

export default function CreateFruitPage() {
  return (
    <FormPage>
      <PageHeader title="Ургац нэмэх" subtitle="Ургацын нэр болон кг-ийн үнийг тохируулна" />
      <CreateFruitForm />
    </FormPage>
  );
}
