import type { FruitSummary, WorkerSummary } from '@/app/lib/dashboard-stats';
import { roundNumber } from '@/app/lib/format';

export type ReportSettlementFilter = 'all' | 'settled' | 'unsettled';
export type ReportView = 'overview' | 'workers' | 'crops';

/** Signed balance: earned − paid. Negative means overpaid. */
export function getFruitBalance(fruit: Pick<FruitSummary, 'totalEarned' | 'totalPaid'>) {
  return roundNumber(fruit.totalEarned - fruit.totalPaid);
}

export function getWorkerBalance(
  worker: Pick<WorkerSummary, 'totalEarned' | 'totalPaid'>,
) {
  return roundNumber(worker.totalEarned - worker.totalPaid);
}

/** Тооцоотой: harvest exists and balance is not zero. */
export function isFruitSettled(
  fruit: Pick<FruitSummary, 'totalKg' | 'totalEarned' | 'totalPaid'>,
) {
  return fruit.totalKg > 0 && getFruitBalance(fruit) !== 0;
}

export function filterReportFruits<T extends FruitSummary>(
  fruits: T[],
  settlement: ReportSettlementFilter,
) {
  const withHarvest = fruits.filter((fruit) => fruit.totalKg > 0);

  if (settlement === 'settled') {
    return withHarvest.filter(isFruitSettled);
  }

  if (settlement === 'unsettled') {
    return withHarvest.filter((fruit) => !isFruitSettled(fruit));
  }

  return withHarvest;
}

/** Тооцоотой: harvest exists and balance is not zero. */
export function isWorkerSettled(
  worker: Pick<WorkerSummary, 'totalKg' | 'totalEarned' | 'totalPaid'>,
) {
  return worker.totalKg > 0 && getWorkerBalance(worker) !== 0;
}

export function filterReportWorkers<T extends WorkerSummary>(
  workers: T[],
  settlement: ReportSettlementFilter,
) {
  const withHarvest = workers.filter((worker) => worker.totalKg > 0);

  if (settlement === 'settled') {
    return withHarvest.filter(isWorkerSettled);
  }

  if (settlement === 'unsettled') {
    return withHarvest.filter((worker) => !isWorkerSettled(worker));
  }

  return withHarvest;
}
