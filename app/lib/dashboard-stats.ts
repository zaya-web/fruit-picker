import { prisma } from '@/app/lib/prisma';
import { requireUserId } from '@/app/lib/current-user';
import { roundNumber, toLocalDateKey } from '@/app/lib/format';

export type DailyHarvestStat = {
  date: string;
  totalKg: number;
  totalEarned: number;
  paidAmount: number;
  unpaidKg: number;
  unpaidAmount: number;
};

export type MonthlyHarvestStat = {
  month: number;
  label: string;
  totalKg: number;
  totalEarned: number;
  paidAmount: number;
};

export type PeriodSummary = {
  totalKg: number;
  totalEarned: number;
  totalPaid: number;
  paidKg: number;
  unpaidKg: number;
  unpaidAmount: number;
};

export type FruitSummary = {
  fruitId: number;
  fruitName: string;
  totalKg: number;
  totalEarned: number;
  totalPaid: number;
  paidKg: number;
  unpaidKg: number;
  unpaidAmount: number;
};

export type WorkerSummary = {
  workerId: number;
  workerName: string;
  phone: string | null;
  totalKg: number;
  totalEarned: number;
  totalPaid: number;
  owedAmount: number;
  owedKg: number;
};

export type DashboardFilter = {
  year?: number;
  month?: number;
  date?: string;
  from?: string;
  to?: string;
  days?: number;
  fruitId?: number;
  workerId?: number;
};

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

const round = roundNumber;

function parseUtcDate(value: string) {
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function getDateRange(filter: DashboardFilter) {
  if (filter.from && filter.to) {
    const start = parseUtcDate(filter.from);
    const endExclusive = parseUtcDate(filter.to);
    if (start && endExclusive) {
      endExclusive.setUTCDate(endExclusive.getUTCDate() + 1);
      if (endExclusive > start) {
        return { start, end: endExclusive };
      }
    }
  }

  if (filter.days && filter.days > 0) {
    // Local calendar "today" so Mongolia UTC+8 matches the filter bar
    const todayKey = toLocalDateKey();
    const start = parseUtcDate(todayKey);
    const endExclusive = parseUtcDate(todayKey);
    if (!start || !endExclusive) return null;
    start.setUTCDate(start.getUTCDate() - (filter.days - 1));
    endExclusive.setUTCDate(endExclusive.getUTCDate() + 1);
    return { start, end: endExclusive };
  }

  if (filter.date) {
    const start = parseUtcDate(filter.date);
    if (!start) return null;
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 1);
    return { start, end };
  }

  if (!filter.year) {
    return null;
  }

  if (!filter.month) {
    return {
      start: new Date(Date.UTC(filter.year, 0, 1)),
      end: new Date(Date.UTC(filter.year + 1, 0, 1)),
    };
  }

  return {
    start: new Date(Date.UTC(filter.year, filter.month - 1, 1)),
    end: new Date(Date.UTC(filter.year, filter.month, 1)),
  };
}

function buildPeriodSummary(
  totalKg: number,
  totalEarned: number,
  totalPaid: number,
): PeriodSummary {
  const unpaidAmount = Math.max(0, round(totalEarned - totalPaid));
  const paidKg =
    totalEarned > 0 ? round(totalKg * (totalPaid / totalEarned)) : 0;
  const unpaidKg =
    totalEarned > 0 ? round(totalKg * (unpaidAmount / totalEarned)) : 0;

  return {
    totalKg: round(totalKg),
    totalEarned: round(totalEarned),
    totalPaid: round(totalPaid),
    paidKg,
    unpaidKg,
    unpaidAmount,
  };
}

function buildWorkerSummary(
  workerId: number,
  workerName: string,
  phone: string | null,
  totalKg: number,
  totalEarned: number,
  totalPaid: number,
): WorkerSummary {
  const owedAmount = Math.max(0, round(totalEarned - totalPaid));
  const owedKg =
    totalEarned > 0 ? round(totalKg * (owedAmount / totalEarned)) : 0;

  return {
    workerId,
    workerName,
    phone,
    totalKg: round(totalKg),
    totalEarned: round(totalEarned),
    totalPaid: round(totalPaid),
    owedAmount,
    owedKg,
  };
}

function allocatePaid(
  totalEarned: number,
  shareEarned: number,
  totalPaid: number,
) {
  if (totalEarned <= 0 || shareEarned <= 0 || totalPaid <= 0) {
    return 0;
  }

  return round(totalPaid * (shareEarned / totalEarned));
}

async function loadDashboardData(filter: DashboardFilter) {
  const userId = await requireUserId();
  const range = getDateRange(filter);
  const dateFilter = range
    ? { date: { gte: range.start, lt: range.end } }
    : undefined;
  const paidAtFilter = range
    ? { paidAt: { gte: range.start, lt: range.end } }
    : undefined;

  const ownedWorker = { worker: { userId } };

  const recordWhere = {
    ...dateFilter,
    ...ownedWorker,
    ...(filter.fruitId ? { fruitId: filter.fruitId } : {}),
    ...(filter.workerId ? { workerId: filter.workerId } : {}),
  };

  const [workRecords, allWorkRecords, payments, allPayments, fruits, workers] =
    await Promise.all([
      prisma.workRecord.findMany({
        where: recordWhere,
        select: {
          date: true,
          workerId: true,
          fruitId: true,
          kg: true,
          totalAmount: true,
          fruit: { select: { id: true, name: true } },
          worker: { select: { id: true, name: true, phone: true } },
        },
        orderBy: { date: 'asc' },
      }),
      prisma.workRecord.findMany({
        where: {
          ...dateFilter,
          ...ownedWorker,
          ...(filter.fruitId ? { fruitId: filter.fruitId } : {}),
        },
        select: {
          date: true,
          workerId: true,
          fruitId: true,
          kg: true,
          totalAmount: true,
          fruit: { select: { id: true, name: true } },
          worker: { select: { id: true, name: true, phone: true } },
        },
      }),
      prisma.payment.findMany({
        where: {
          ...paidAtFilter,
          ...ownedWorker,
          ...(filter.workerId ? { workerId: filter.workerId } : {}),
        },
        select: { paidAt: true, amount: true, workerId: true },
        orderBy: { paidAt: 'asc' },
      }),
      prisma.payment.findMany({
        where: {
          ...paidAtFilter,
          ...ownedWorker,
        },
        select: { paidAt: true, amount: true, workerId: true },
      }),
      prisma.fruit.findMany({
        where: { userId },
        orderBy: { name: 'asc' },
        select: { id: true, name: true },
      }),
      prisma.worker.findMany({
        where: { userId },
        orderBy: { name: 'asc' },
        select: { id: true, name: true, phone: true },
      }),
    ]);

  return {
    workRecords,
    allWorkRecords,
    payments,
    allPayments,
    fruits,
    workers,
  };
}

export async function getPeriodSummary(
  filter: DashboardFilter = {},
): Promise<PeriodSummary> {
  const { workRecords, allWorkRecords, payments, allPayments } =
    await loadDashboardData(filter);

  const totalKg = workRecords.reduce(
    (sum, record) => sum + Number(record.kg.toString()),
    0,
  );
  const totalEarned = workRecords.reduce(
    (sum, record) => sum + Number(record.totalAmount.toString()),
    0,
  );

  if (filter.workerId) {
    const totalPaid = payments.reduce(
      (sum, payment) => sum + Number(payment.amount.toString()),
      0,
    );
    return buildPeriodSummary(totalKg, totalEarned, totalPaid);
  }

  const allEarned = allWorkRecords.reduce(
    (sum, record) => sum + Number(record.totalAmount.toString()),
    0,
  );
  const totalPaidAll = allPayments.reduce(
    (sum, payment) => sum + Number(payment.amount.toString()),
    0,
  );
  const totalPaid = allocatePaid(allEarned, totalEarned, totalPaidAll);

  return buildPeriodSummary(totalKg, totalEarned, totalPaid);
}

export async function getFruitSummaries(
  filter: Pick<
    DashboardFilter,
    'year' | 'month' | 'date' | 'from' | 'to' | 'days' | 'workerId'
  > = {},
): Promise<FruitSummary[]> {
  const { allWorkRecords, allPayments, fruits } = await loadDashboardData({
    year: filter.year,
    month: filter.month,
    date: filter.date,
    from: filter.from,
    to: filter.to,
    days: filter.days,
    workerId: filter.workerId,
  });

  const allEarned = allWorkRecords.reduce(
    (sum, record) => sum + Number(record.totalAmount.toString()),
    0,
  );
  const totalPaidAll = allPayments.reduce(
    (sum, payment) => sum + Number(payment.amount.toString()),
    0,
  );

  const fruitMap = new Map<
    number,
    { fruitName: string; totalKg: number; totalEarned: number }
  >();

  for (const fruit of fruits) {
    fruitMap.set(fruit.id, {
      fruitName: fruit.name,
      totalKg: 0,
      totalEarned: 0,
    });
  }

  for (const record of allWorkRecords) {
    const current = fruitMap.get(record.fruitId) ?? {
      fruitName: record.fruit.name,
      totalKg: 0,
      totalEarned: 0,
    };

    current.totalKg += Number(record.kg.toString());
    current.totalEarned += Number(record.totalAmount.toString());
    fruitMap.set(record.fruitId, current);
  }

  return [...fruitMap.entries()]
    .map(([fruitId, fruit]) => {
      const totalPaid = allocatePaid(
        allEarned,
        fruit.totalEarned,
        totalPaidAll,
      );

      return {
        fruitId,
        fruitName: fruit.fruitName,
        ...buildPeriodSummary(fruit.totalKg, fruit.totalEarned, totalPaid),
      };
    })
    .sort((a, b) => b.totalKg - a.totalKg);
}

export async function getWorkerSummaries(
  filter: Pick<
    DashboardFilter,
    'year' | 'month' | 'date' | 'from' | 'to' | 'days' | 'fruitId'
  > = {},
): Promise<WorkerSummary[]> {
  const { allWorkRecords, allPayments, workers } = await loadDashboardData({
    year: filter.year,
    month: filter.month,
    date: filter.date,
    from: filter.from,
    to: filter.to,
    days: filter.days,
    fruitId: filter.fruitId,
  });

  const workerMap = new Map<
    number,
    { workerName: string; phone: string | null; totalKg: number; totalEarned: number }
  >();

  for (const worker of workers) {
    workerMap.set(worker.id, {
      workerName: worker.name,
      phone: worker.phone,
      totalKg: 0,
      totalEarned: 0,
    });
  }

  for (const record of allWorkRecords) {
    const current = workerMap.get(record.workerId) ?? {
      workerName: record.worker.name,
      phone: record.worker.phone,
      totalKg: 0,
      totalEarned: 0,
    };

    current.totalKg += Number(record.kg.toString());
    current.totalEarned += Number(record.totalAmount.toString());
    workerMap.set(record.workerId, current);
  }

  const paidByWorker = new Map<number, number>();
  for (const payment of allPayments) {
    paidByWorker.set(
      payment.workerId,
      (paidByWorker.get(payment.workerId) ?? 0) +
        Number(payment.amount.toString()),
    );
  }

  return [...workerMap.entries()]
    .map(([workerId, worker]) =>
      buildWorkerSummary(
        workerId,
        worker.workerName,
        worker.phone,
        worker.totalKg,
        worker.totalEarned,
        paidByWorker.get(workerId) ?? 0,
      ),
    )
    .sort((a, b) => b.totalKg - a.totalKg);
}

export async function getMonthlyHarvestStats(
  filter: Pick<DashboardFilter, 'year' | 'fruitId' | 'workerId'> = {},
): Promise<MonthlyHarvestStat[]> {
  const year = filter.year ?? new Date().getUTCFullYear();
  const dailyStats = await getDailyHarvestStats({
    year,
    fruitId: filter.fruitId,
    workerId: filter.workerId,
  });

  const monthLabels = [
    '1-р сар',
    '2-р сар',
    '3-р сар',
    '4-р сар',
    '5-р сар',
    '6-р сар',
    '7-р сар',
    '8-р сар',
    '9-р сар',
    '10-р сар',
    '11-р сар',
    '12-р сар',
  ];

  const months = monthLabels.map((label, index) => ({
    month: index + 1,
    label,
    totalKg: 0,
    totalEarned: 0,
    paidAmount: 0,
  }));

  for (const day of dailyStats) {
    const monthIndex = Number(day.date.slice(5, 7)) - 1;
    if (monthIndex < 0 || monthIndex > 11) continue;
    months[monthIndex].totalKg += day.totalKg;
    months[monthIndex].totalEarned += day.totalEarned;
    months[monthIndex].paidAmount += day.paidAmount;
  }

  return months.map((month) => ({
    ...month,
    totalKg: round(month.totalKg),
    totalEarned: round(month.totalEarned),
    paidAmount: round(month.paidAmount),
  }));
}

export async function getDailyHarvestStats(
  filter: DashboardFilter = {},
): Promise<DailyHarvestStat[]> {
  const { workRecords, allWorkRecords, payments, allPayments } =
    await loadDashboardData(filter);

  const dayEarnedAll = new Map<string, number>();
  for (const record of allWorkRecords) {
    const key = toDateKey(record.date);
    dayEarnedAll.set(
      key,
      (dayEarnedAll.get(key) ?? 0) + Number(record.totalAmount.toString()),
    );
  }

  const dayMap = new Map<
    string,
    { totalKg: number; totalEarned: number; paidAmount: number }
  >();

  for (const record of workRecords) {
    const key = toDateKey(record.date);
    const current = dayMap.get(key) ?? {
      totalKg: 0,
      totalEarned: 0,
      paidAmount: 0,
    };

    current.totalKg += Number(record.kg.toString());
    current.totalEarned += Number(record.totalAmount.toString());
    dayMap.set(key, current);
  }

  if (filter.workerId) {
    for (const payment of payments) {
      const key = toDateKey(payment.paidAt);
      const current = dayMap.get(key) ?? {
        totalKg: 0,
        totalEarned: 0,
        paidAmount: 0,
      };

      current.paidAmount += Number(payment.amount.toString());
      dayMap.set(key, current);
    }
  } else {
    for (const payment of allPayments) {
      const key = toDateKey(payment.paidAt);
      const dayPaid = Number(payment.amount.toString());
      const dayEarnedAllAmount = dayEarnedAll.get(key) ?? 0;
      const current = dayMap.get(key) ?? {
        totalKg: 0,
        totalEarned: 0,
        paidAmount: 0,
      };

      current.paidAmount += allocatePaid(
        dayEarnedAllAmount,
        current.totalEarned,
        dayPaid,
      );
      dayMap.set(key, current);
    }
  }

  const stats = [...dayMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, day]) => {
      const unpaidAmount = Math.max(0, day.totalEarned - day.paidAmount);
      const unpaidKg =
        day.totalEarned > 0
          ? round(day.totalKg * (unpaidAmount / day.totalEarned))
          : 0;

      return {
        date,
        totalKg: round(day.totalKg),
        totalEarned: round(day.totalEarned),
        paidAmount: round(day.paidAmount),
        unpaidKg,
        unpaidAmount: round(unpaidAmount),
      };
    });

  if (filter.from && filter.to && !filter.date && !filter.days) {
    return fillRangeDailyStats(stats, filter.from, filter.to);
  }

  if (filter.days && !filter.date) {
    const range = getDateRange({ days: filter.days });
    if (range) {
      const toInclusive = new Date(range.end);
      toInclusive.setUTCDate(toInclusive.getUTCDate() - 1);
      return fillRangeDailyStats(
        stats,
        toDateKey(range.start),
        toDateKey(toInclusive),
      );
    }
  }

  if (filter.year && filter.month && !filter.date && !filter.days && !filter.from) {
    return fillMonthDailyStats(stats, filter.year, filter.month);
  }

  return stats;
}

function fillRangeDailyStats(
  stats: DailyHarvestStat[],
  from: string,
  to: string,
): DailyHarvestStat[] {
  const start = parseUtcDate(from);
  const end = parseUtcDate(to);
  if (!start || !end || end < start) return stats;

  const byDate = new Map(stats.map((stat) => [stat.date, stat]));
  const emptyDay = {
    totalKg: 0,
    totalEarned: 0,
    paidAmount: 0,
    unpaidKg: 0,
    unpaidAmount: 0,
  };

  const result: DailyHarvestStat[] = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    const date = toDateKey(cursor);
    result.push(byDate.get(date) ?? { date, ...emptyDay });
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return result;
}

function fillMonthDailyStats(
  stats: DailyHarvestStat[],
  year: number,
  month: number,
): DailyHarvestStat[] {
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const byDate = new Map(stats.map((stat) => [stat.date, stat]));
  const emptyDay = {
    totalKg: 0,
    totalEarned: 0,
    paidAmount: 0,
    unpaidKg: 0,
    unpaidAmount: 0,
  };

  return Array.from({ length: daysInMonth }, (_, index) => {
    const day = index + 1;
    const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return byDate.get(date) ?? { date, ...emptyDay };
  });
}

export async function getPeriodOptions(): Promise<{
  years: number[];
  monthsByYear: Record<number, number[]>;
}> {
  const userId = await requireUserId();
  const [workRecords, payments] = await Promise.all([
    prisma.workRecord.findMany({
      where: { worker: { userId } },
      select: { date: true },
    }),
    prisma.payment.findMany({
      where: { worker: { userId } },
      select: { paidAt: true },
    }),
  ]);

  const monthSetByYear = new Map<number, Set<number>>();

  const addDate = (date: Date) => {
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const months = monthSetByYear.get(year) ?? new Set<number>();
    months.add(month);
    monthSetByYear.set(year, months);
  };

  for (const record of workRecords) {
    addDate(record.date);
  }

  for (const payment of payments) {
    addDate(payment.paidAt);
  }

  const years = [...monthSetByYear.keys()].sort((a, b) => b - a);
  const monthsByYear = Object.fromEntries(
    years.map((year) => [
      year,
      [...(monthSetByYear.get(year) ?? new Set<number>())].sort((a, b) => a - b),
    ]),
  );

  return { years, monthsByYear };
}

export function getPeriodLabel(
  filter: DashboardFilter,
  names?: { fruitName?: string; workerName?: string },
) {
  const parts: string[] = [];

  if (filter.from && filter.to) {
    parts.push(`${filter.from} → ${filter.to}`);
  } else if (filter.days) {
    parts.push(`Сүүлийн ${filter.days} хоног`);
  } else if (filter.date) {
    parts.push(filter.date);
  } else if (!filter.year) {
    parts.push('Бүх хугацаа');
  } else if (!filter.month) {
    parts.push(`${filter.year} он`);
  } else {
    parts.push(`${filter.year} оны ${filter.month}-р сар`);
  }

  if (names?.fruitName) {
    parts.push(names.fruitName);
  }

  if (names?.workerName) {
    parts.push(names.workerName);
  }

  return parts.join(' · ');
}
