import Link from 'next/link';
import {
  filterReportFruits,
  filterReportWorkers,
  getReportStats,
  type ReportSettlementFilter,
  type ReportView,
} from '@/app/lib/report-stats';
import { getPeriodOptions } from '@/app/lib/dashboard-stats';
import DailyHarvestChart from '@/app/ui/dashboard/daily-harvest-chart';
import FruitDonutChart from '@/app/ui/dashboard/fruit-donut-chart';
import MonthlyHarvestChart from '@/app/ui/dashboard/monthly-harvest-chart';
import PageHeader from '@/app/ui/common/page-header';
import StatCard from '@/app/ui/common/stat-card';
import ReportExportButtons from '@/app/ui/reports/export-buttons';
import ReportFruitsTable from '@/app/ui/reports/fruits-table';
import ReportWorkersTable from '@/app/ui/reports/workers-table';
import ReportYearFilter from '@/app/ui/reports/year-filter';

function parseReportParams(searchParams: {
  year?: string;
  month?: string;
  compare?: string;
  view?: string;
  settlement?: string;
}) {
  const year = searchParams.year
    ? Number(searchParams.year)
    : new Date().getUTCFullYear();
  const monthRaw = searchParams.month ? Number(searchParams.month) : undefined;
  const month =
    monthRaw && Number.isFinite(monthRaw) && monthRaw >= 1 && monthRaw <= 12
      ? monthRaw
      : undefined;
  const compare = searchParams.compare
    ? Number(searchParams.compare)
    : undefined;
  const view: ReportView =
    searchParams.view === 'workers'
      ? 'workers'
      : searchParams.view === 'crops' || searchParams.view === 'fruits'
        ? 'crops'
        : 'overview';
  const settlement: ReportSettlementFilter =
    searchParams.settlement === 'settled' ||
    searchParams.settlement === 'unsettled'
      ? searchParams.settlement
      : 'all';

  return {
    year: Number.isFinite(year) ? year : new Date().getUTCFullYear(),
    month,
    compare:
      !month && compare && Number.isFinite(compare) ? compare : undefined,
    view,
    settlement,
  };
}

function periodLabel(year: number, month?: number) {
  return month ? `${year} оны ${month}-р сар` : `${year} он`;
}

export default async function ReportsPage({
  searchParams,
}: PageProps<'/dashboard/reports'>) {
  const params = await searchParams;
  const { year, month, compare, view, settlement } = parseReportParams(params);
  const periodOptions = await getPeriodOptions();
  const years =
    periodOptions.years.length > 0
      ? periodOptions.years
      : [new Date().getFullYear()];
  const effectiveYear = years.includes(year) ? year : years[0]!;

  const [report, compareReport] = await Promise.all([
    getReportStats(effectiveYear, month),
    compare ? getReportStats(compare) : Promise.resolve(null),
  ]);

  const label = periodLabel(effectiveYear, month);
  const workers = filterReportWorkers(report.workers, settlement);
  const fruits = filterReportFruits(report.fruits, settlement);
  const settledCount = filterReportWorkers(report.workers, 'settled').length;
  const unsettledCount = filterReportWorkers(report.workers, 'unsettled').length;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Тайлан"
        subtitle={`${label}-ийн ургац, төлбөрийн нэгдсэн дүгнэлт`}
        action={
          <Link
            href="/dashboard/work-records/create"
            className="farm-btn-primary inline-flex h-11 items-center px-4 text-sm"
          >
            + Шинэ түүлт бүртгэх
          </Link>
        }
      />

      <ReportYearFilter
        years={years}
        year={effectiveYear}
        month={month}
        compare={compare}
        view={view}
        settlement={settlement}
      />

      <section className="farm-card border border-[#e8dfcf] bg-[#faf6ee] p-4 sm:p-5">
        <h2 className="text-sm font-semibold text-[var(--farm-deep)]">
          Тооцоотой / тооцоогүй хэрхэн шийдэгддэг вэ?
        </h2>
        <ul className="mt-2 space-y-1.5 text-sm text-[var(--text-secondary)]">
          <li>
            <span className="font-medium text-[var(--text-primary)]">
              Тооцоотой
            </span>
            {' — '}
            түүсэн кг &gt; 0 бөгөөд үлдэгдэл (төлбөр − төлсөн) 0-оос их (дутуу
            төлсөн) эсвэл бага (илүү төлсөн).
          </li>
          <li>
            <span className="font-medium text-[var(--text-primary)]">
              Тооцоогүй
            </span>
            {' — '}
            түүсэн кг &gt; 0 бөгөөд үлдэгдэл яг 0.
          </li>
          <li>
            Түүсэн кг байхгүй бол тайлангийн тооцооны шүүлтэнд орохгүй.
          </li>
        </ul>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Нийт түүсэн ургац"
          value={`${report.summary.totalKg.toLocaleString('en-US')} kg`}
          hint={`${label}-ийн нийлбэр`}
        />
        <StatCard
          title="Нийт олгосон төлбөр"
          value={`₮${report.summary.totalPaid.toLocaleString('en-US')}`}
          hint="Бүртгэгдсэн төлбөр"
        />
        <StatCard
          title="Тооцоотой"
          value={String(settledCount)}
          hint="Үлдэгдэл ≠ 0"
        />
        <StatCard
          title="Тооцоогүй"
          value={String(unsettledCount)}
          hint="Үлдэгдэл яг 0"
        />
      </div>

      {view === 'workers' ? (
        <ReportWorkersTable workers={workers} />
      ) : view === 'crops' ? (
        <ReportFruitsTable fruits={fruits} />
      ) : (
        <>
          {compareReport ? (
            <section className="farm-card p-5">
              <h2 className="text-base font-semibold">Жилийн харьцуулалт</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-[#faf6ee] p-4">
                  <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
                    Түүсэн
                  </p>
                  <p className="mt-1 text-xl font-bold tabular-nums">
                    {report.summary.totalKg.toLocaleString('en-US')} kg
                  </p>
                  <p className="mt-1 text-xs text-[var(--text-secondary)]">
                    {compare}:{' '}
                    {compareReport.summary.totalKg.toLocaleString('en-US')} kg
                  </p>
                </div>
                <div className="rounded-xl bg-[#faf6ee] p-4">
                  <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
                    Төлсөн
                  </p>
                  <p className="mt-1 text-xl font-bold tabular-nums">
                    ₮{report.summary.totalPaid.toLocaleString('en-US')}
                  </p>
                  <p className="mt-1 text-xs text-[var(--text-secondary)]">
                    {compare}: ₮
                    {compareReport.summary.totalPaid.toLocaleString('en-US')}
                  </p>
                </div>
                <div className="rounded-xl bg-[#faf6ee] p-4">
                  <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
                    Үлдэгдэл
                  </p>
                  <p className="mt-1 text-xl font-bold tabular-nums">
                    ₮{report.summary.unpaidAmount.toLocaleString('en-US')}
                  </p>
                  <p className="mt-1 text-xs text-[var(--text-secondary)]">
                    {compare}: ₮
                    {compareReport.summary.unpaidAmount.toLocaleString('en-US')}
                  </p>
                </div>
              </div>
            </section>
          ) : null}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {month ? (
              <DailyHarvestChart
                stats={report.daily}
                filter={{ year: effectiveYear, month }}
              />
            ) : (
              <MonthlyHarvestChart
                stats={report.monthly}
                filter={{ year: effectiveYear }}
              />
            )}
            <FruitDonutChart summaries={fruits} />
          </div>

          <ReportFruitsTable fruits={fruits} />
        </>
      )}

      <section className="farm-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold">Экспорт</h2>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              {label}-ийн тайланг PDF эсвэл Excel (.csv) хэлбэрээр татаж авна.
            </p>
          </div>
          <ReportExportButtons report={report} />
        </div>
      </section>
    </div>
  );
}
