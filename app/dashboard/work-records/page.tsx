import { getWorkRecords } from '@/app/lib/data';
import {
  getDayPickerDashboard,
  todayUtcKey,
} from '@/app/lib/section-stats';
import PageHeader from '@/app/ui/common/page-header';
import { CreateWorkRecord } from '@/app/ui/work-records/buttons';
import TodayPickerDashboard from '@/app/ui/work-records/today-dashboard';
import WorkRecordsTable from '@/app/ui/work-records/table';

export default async function WorkRecordsPage({
  searchParams,
}: PageProps<'/dashboard/work-records'>) {
  const params = await searchParams;
  const date =
    typeof params.date === 'string' && params.date
      ? params.date
      : todayUtcKey();

  const [records, dayDashboard] = await Promise.all([
    getWorkRecords(),
    getDayPickerDashboard(date),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Өдрийн түүлт"
        subtitle="Таблет болон утсаар хурдан бүртгэхэд тохируулсан"
        action={<CreateWorkRecord />}
      />
      <TodayPickerDashboard {...dayDashboard} />
      <WorkRecordsTable records={records} />
    </div>
  );
}
