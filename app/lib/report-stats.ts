import {
  getDailyHarvestStats,
  getFruitSummaries,
  getMonthlyHarvestStats,
  getPeriodSummary,
  getWorkerSummaries,
  type DailyHarvestStat,
  type DashboardFilter,
  type WorkerSummary,
} from '@/app/lib/dashboard-stats';

export type {
  ReportSettlementFilter,
  ReportView,
} from '@/app/lib/report-settlement';

export {
  filterReportFruits,
  filterReportWorkers,
  getFruitBalance,
  getWorkerBalance,
  isFruitSettled,
  isWorkerSettled,
} from '@/app/lib/report-settlement';

export type ReportStats = {
  year: number;
  month?: number;
  summary: Awaited<ReturnType<typeof getPeriodSummary>>;
  monthly: Awaited<ReturnType<typeof getMonthlyHarvestStats>>;
  daily: DailyHarvestStat[];
  fruits: Awaited<ReturnType<typeof getFruitSummaries>>;
  workers: WorkerSummary[];
};

export async function getReportStats(
  year: number,
  month?: number,
): Promise<ReportStats> {
  const filter: DashboardFilter = {
    year,
    ...(month ? { month } : {}),
  };

  const [summary, monthly, daily, fruits, workers] = await Promise.all([
    getPeriodSummary(filter),
    getMonthlyHarvestStats({ year }),
    month
      ? getDailyHarvestStats({ year, month })
      : Promise.resolve([] as DailyHarvestStat[]),
    getFruitSummaries(filter),
    getWorkerSummaries(filter),
  ]);

  return { year, month, summary, monthly, daily, fruits, workers };
}
