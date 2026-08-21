import DailyHarvestChart from '@/app/ui/dashboard/daily-harvest-chart';
import FruitDonutChart from '@/app/ui/dashboard/fruit-donut-chart';
import MonthlyHarvestChart from '@/app/ui/dashboard/monthly-harvest-chart';
import DashboardFilterBar from '@/app/ui/dashboard/dashboard-filter';
import FruitSummaryTable from '@/app/ui/dashboard/fruit-summary-table';
import PeriodSummaryCard from '@/app/ui/dashboard/period-summary';
import WorkerSummaryTable from '@/app/ui/dashboard/worker-summary-table';
import PageHeader from '@/app/ui/common/page-header';
import StatCard from '@/app/ui/common/stat-card';
import {
  getDailyHarvestStats,
  getFruitSummaries,
  getMonthlyHarvestStats,
  getPeriodLabel,
  getPeriodOptions,
  getPeriodSummary,
  getWorkerSummaries,
  type DashboardFilter,
} from '@/app/lib/dashboard-stats';
import {
  getDashboardCounts,
  getFruitsForSelect,
  getWorkersForSelect,
} from '@/app/lib/data';
import { toLocalDateKey } from '@/app/lib/format';
import Link from 'next/link';

function parseDashboardFilter(searchParams: {
  year?: string;
  month?: string;
  date?: string;
  from?: string;
  to?: string;
  days?: string;
  fruitId?: string;
  workerId?: string;
}): DashboardFilter {
  const year = searchParams.year ? Number(searchParams.year) : undefined;
  const month = searchParams.month ? Number(searchParams.month) : undefined;
  const days = searchParams.days ? Number(searchParams.days) : undefined;
  const fruitId = searchParams.fruitId
    ? Number(searchParams.fruitId)
    : undefined;
  const workerId = searchParams.workerId
    ? Number(searchParams.workerId)
    : undefined;

  const parsedYear = year && Number.isFinite(year) ? year : undefined;
  const parsedMonth = month && Number.isFinite(month) ? month : undefined;
  const parsedDays =
    days === 7 || days === 14 ? days : undefined;
  const from = searchParams.from || undefined;
  const to = searchParams.to || undefined;

  if (parsedDays) {
    return {
      days: parsedDays,
      fruitId: fruitId && Number.isFinite(fruitId) ? fruitId : undefined,
      workerId: workerId && Number.isFinite(workerId) ? workerId : undefined,
    };
  }

  if (from && to) {
    return {
      from: from <= to ? from : to,
      to: from <= to ? to : from,
      fruitId: fruitId && Number.isFinite(fruitId) ? fruitId : undefined,
      workerId: workerId && Number.isFinite(workerId) ? workerId : undefined,
    };
  }

  return {
    year: parsedMonth && !parsedYear ? new Date().getUTCFullYear() : parsedYear,
    month: parsedMonth,
    date: searchParams.date || undefined,
    fruitId: fruitId && Number.isFinite(fruitId) ? fruitId : undefined,
    workerId: workerId && Number.isFinite(workerId) ? workerId : undefined,
  };
}

export default async function DashboardPage({
  searchParams,
}: PageProps<'/dashboard'>) {
  const params = await searchParams;
  const filter = parseDashboardFilter(params);

  const todayKey = toLocalDateKey();
  const chartYear = filter.year ?? new Date().getFullYear();
  const hasDateRange = Boolean(filter.from && filter.to);
  const hasPeriodFilter = Boolean(
    filter.year ||
      filter.month ||
      filter.date ||
      filter.days ||
      hasDateRange,
  );

  // Year only → monthly totals for that year
  // Month / from–to / days / date → daily
  // No period filter → last 7 days (daily)
  const showMonthlyChart = Boolean(
    filter.year &&
      !filter.month &&
      !filter.date &&
      !filter.days &&
      !hasDateRange,
  );
  const showDailyChart = !showMonthlyChart;

  const dailyFilter: DashboardFilter = (() => {
    if (filter.days || hasDateRange || filter.date) {
      return filter;
    }
    if (filter.month) {
      return {
        year: filter.year ?? chartYear,
        month: filter.month,
        fruitId: filter.fruitId,
        workerId: filter.workerId,
      };
    }
    return {
      days: 7,
      fruitId: filter.fruitId,
      workerId: filter.workerId,
    };
  })();

  // Keep summary / tables aligned with the chart period when no filter is set
  const summaryFilter: DashboardFilter = hasPeriodFilter
    ? {
        year: filter.year,
        month: filter.month,
        date: filter.date,
        from: filter.from,
        to: filter.to,
        days: filter.days,
        fruitId: filter.fruitId,
        workerId: filter.workerId,
      }
    : dailyFilter;

  const filterBarDays = filter.days ?? (hasPeriodFilter ? undefined : 7);

  const [
    counts,
    dailyStats,
    monthlyStats,
    todayStats,
    summary,
    periodOptions,
    fruitSummaries,
    workerSummaries,
    fruits,
    workers,
  ] = await Promise.all([
    getDashboardCounts(),
    showDailyChart ? getDailyHarvestStats(dailyFilter) : Promise.resolve([]),
    showMonthlyChart
      ? getMonthlyHarvestStats({
          year: chartYear,
          fruitId: filter.fruitId,
          workerId: filter.workerId,
        })
      : Promise.resolve([]),
    getDailyHarvestStats({ date: todayKey }),
    getPeriodSummary(summaryFilter),
    getPeriodOptions(),
    getFruitSummaries(summaryFilter),
    getWorkerSummaries(summaryFilter),
    getFruitsForSelect(),
    getWorkersForSelect(),
  ]);

  const todayKg = todayStats[0]?.totalKg ?? 0;

  const selectedFruit = filter.fruitId
    ? fruits.find((fruit) => fruit.id === filter.fruitId)
    : undefined;

  const selectedWorkerSummary = filter.workerId
    ? workerSummaries.find((worker) => worker.workerId === filter.workerId)
    : undefined;

  const quickLinks = [
    {
      href: '/dashboard/workers',
      title: 'Ажилтан',
      count: counts.workers,
      description: 'Бүртгэл, засвар',
    },
    {
      href: '/dashboard/crops',
      title: 'Ургацын тариф',
      count: counts.fruits,
      description: 'Төрөл, үнэ / кг',
    },
    {
      href: '/dashboard/work-records',
      title: 'Ажлын бүртгэл',
      count: counts.workRecords,
      description: 'Авсан кг',
    },
    {
      href: '/dashboard/payments',
      title: 'Төлбөр',
      count: counts.payments,
      description: 'Хөлс төлөх',
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Сайн байна уу ?"
        subtitle={`${filter.year ?? new Date().getUTCFullYear()} оны ургацын хяналтын самбар`}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Нийт түүсэн ургац"
          value={`${summary.totalKg.toLocaleString('en-US')} kg`}
          hint="Сонгосон хугацааны нийлбэр"
          icon={<span className="text-sm font-bold">kg</span>}
        />
        <StatCard
          title="Нийт олгосон төлбөр"
          value={`₮${summary.totalPaid.toLocaleString('en-US')}`}
          hint="Бүртгэгдсэн төлбөр"
          icon={<span className="text-sm font-bold">₮</span>}
        />
        <StatCard
          title="Идэвхтэй түүгчид"
          value={counts.workers.toLocaleString('en-US')}
          hint="Бүртгэлтэй ажилтан"
          icon={<span className="text-sm font-bold">Т</span>}
        />
        <StatCard
          title="Өнөөдрийн ургац"
          value={`${todayKg.toLocaleString('en-US')} kg`}
          hint={todayKey}
          icon={<span className="text-sm font-bold">Ө</span>}
        />
      </div>

      <DashboardFilterBar
        years={periodOptions.years}
        monthsByYear={periodOptions.monthsByYear}
        fruits={fruits.map((fruit) => ({ id: fruit.id, name: fruit.name }))}
        workers={workers}
        selectedYear={filter.year}
        selectedMonth={filter.month}
        selectedDays={filterBarDays}
        selectedFrom={filter.from}
        selectedTo={filter.to}
        selectedFruitId={filter.fruitId}
        selectedWorkerId={filter.workerId}
      />

      <PeriodSummaryCard
        summary={summary}
        label={getPeriodLabel(summaryFilter, {
          fruitName: selectedFruit?.name,
          workerName: selectedWorkerSummary?.workerName,
        })}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {showDailyChart ? (
          <DailyHarvestChart stats={dailyStats} filter={dailyFilter} />
        ) : (
          <MonthlyHarvestChart
            stats={monthlyStats}
            filter={{ ...filter, year: chartYear }}
          />
        )}
        <FruitDonutChart summaries={fruitSummaries} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <WorkerSummaryTable summaries={workerSummaries} />
        <FruitSummaryTable summaries={fruitSummaries} />
      </div>

      <Link
        href="/dashboard/work-records/create"
        className="farm-btn-primary fixed bottom-6 right-4 z-30 inline-flex h-12 items-center gap-2 rounded-full px-5 text-sm shadow-lg sm:right-6 md:hidden"
      >
        + Шинэ түүлт
      </Link>

      <section>
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-[var(--text-muted)]">
          Хурдан холбоос
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="farm-card group p-5 transition hover:border-[color-mix(in_oklab,var(--farm-deep)_35%,white)] hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-medium text-[var(--foreground)] group-hover:text-[var(--farm-deep)]">
                  {card.title}
                </h3>
                <span className="text-2xl font-semibold tabular-nums text-[var(--farm-deep)]">
                  {card.count}
                </span>
              </div>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">{card.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
