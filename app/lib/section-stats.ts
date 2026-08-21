import { prisma } from '@/app/lib/prisma';
import { requireUserId } from '@/app/lib/current-user';
import { roundNumber, toLocalDateKey } from '@/app/lib/format';
import { notFound } from 'next/navigation';

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getDayRange(date: string) {
  const start = new Date(`${date}T00:00:00.000Z`);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);
  return { start, end };
}

/** Local calendar today — matches dashboard filters. */
export function todayUtcKey() {
  return toLocalDateKey();
}

const round = roundNumber;

export type FruitKgRow = {
  fruitId: number;
  fruitName: string;
  pricePerKg: number;
  totalKg: number;
  totalEarned: number;
};

export type WorkerKgRow = {
  workerId: number;
  workerName: string;
  phone: string | null;
  totalKg: number;
  totalEarned: number;
};

export type DailyKgRow = {
  date: string;
  totalKg: number;
  totalEarned: number;
};

export type WorkerHarvestDashboard = {
  worker: {
    id: number;
    name: string;
    phone: string | null;
    bankAccount: string | null;
    status: string;
  };
  totalKg: number;
  totalEarned: number;
  fruits: FruitKgRow[];
  days: DailyKgRow[];
};

export type FruitHarvestDashboard = {
  fruit: { id: number; name: string; pricePerKg: number };
  date?: string;
  totalKg: number;
  totalEarned: number;
  workers: WorkerKgRow[];
  days: DailyKgRow[];
};

export type DayPickerRow = WorkerKgRow & {
  fruits: { fruitName: string; totalKg: number }[];
};

export async function getWorkerHarvestDashboard(
  workerId: number,
): Promise<WorkerHarvestDashboard> {
  const userId = await requireUserId();
  const worker = await prisma.worker.findFirst({
    where: { id: workerId, userId },
    select: { id: true, name: true, phone: true, bankAccount: true, status: true },
  });

  if (!worker) {
    notFound();
  }

  const records = await prisma.workRecord.findMany({
    where: { workerId, worker: { userId } },
    select: {
      date: true,
      kg: true,
      totalAmount: true,
      fruit: { select: { id: true, name: true, pricePerKg: true } },
    },
    orderBy: { date: 'asc' },
  });

  const fruitMap = new Map<number, FruitKgRow>();
  const dayMap = new Map<string, DailyKgRow>();
  let totalKg = 0;
  let totalEarned = 0;

  for (const record of records) {
    const kg = Number(record.kg.toString());
    const earned = Number(record.totalAmount.toString());
    totalKg += kg;
    totalEarned += earned;

    const fruit = fruitMap.get(record.fruit.id) ?? {
      fruitId: record.fruit.id,
      fruitName: record.fruit.name,
      pricePerKg: Number(record.fruit.pricePerKg.toString()),
      totalKg: 0,
      totalEarned: 0,
    };
    fruit.totalKg += kg;
    fruit.totalEarned += earned;
    fruitMap.set(record.fruit.id, fruit);

    const key = toDateKey(record.date);
    const day = dayMap.get(key) ?? { date: key, totalKg: 0, totalEarned: 0 };
    day.totalKg += kg;
    day.totalEarned += earned;
    dayMap.set(key, day);
  }

  return {
    worker,
    totalKg: round(totalKg),
    totalEarned: round(totalEarned),
    fruits: [...fruitMap.values()]
      .map((row) => ({
        ...row,
        totalKg: round(row.totalKg),
        totalEarned: round(row.totalEarned),
      }))
      .sort((a, b) => b.totalKg - a.totalKg),
    days: [...dayMap.values()]
      .map((row) => ({
        ...row,
        totalKg: round(row.totalKg),
        totalEarned: round(row.totalEarned),
      }))
      .sort((a, b) => b.date.localeCompare(a.date)),
  };
}

export async function getFruitHarvestDashboard(
  fruitId: number,
  date?: string,
): Promise<FruitHarvestDashboard> {
  const userId = await requireUserId();
  const fruit = await prisma.fruit.findFirst({
    where: { id: fruitId, userId },
    select: { id: true, name: true, pricePerKg: true },
  });

  if (!fruit) {
    notFound();
  }

  const range = date ? getDayRange(date) : null;
  const records = await prisma.workRecord.findMany({
    where: {
      fruitId,
      fruit: { userId },
      ...(range ? { date: { gte: range.start, lt: range.end } } : {}),
    },
    select: {
      date: true,
      kg: true,
      totalAmount: true,
      worker: { select: { id: true, name: true, phone: true } },
    },
    orderBy: { date: 'asc' },
  });

  const workerMap = new Map<number, WorkerKgRow>();
  const dayMap = new Map<string, DailyKgRow>();
  let totalKg = 0;
  let totalEarned = 0;

  for (const record of records) {
    const kg = Number(record.kg.toString());
    const earned = Number(record.totalAmount.toString());
    totalKg += kg;
    totalEarned += earned;

    const worker = workerMap.get(record.worker.id) ?? {
      workerId: record.worker.id,
      workerName: record.worker.name,
      phone: record.worker.phone,
      totalKg: 0,
      totalEarned: 0,
    };
    worker.totalKg += kg;
    worker.totalEarned += earned;
    workerMap.set(record.worker.id, worker);

    const key = toDateKey(record.date);
    const day = dayMap.get(key) ?? { date: key, totalKg: 0, totalEarned: 0 };
    day.totalKg += kg;
    day.totalEarned += earned;
    dayMap.set(key, day);
  }

  return {
    fruit: {
      id: fruit.id,
      name: fruit.name,
      pricePerKg: Number(fruit.pricePerKg.toString()),
    },
    date,
    totalKg: round(totalKg),
    totalEarned: round(totalEarned),
    workers: [...workerMap.values()]
      .map((row) => ({
        ...row,
        totalKg: round(row.totalKg),
        totalEarned: round(row.totalEarned),
      }))
      .sort((a, b) => b.totalKg - a.totalKg),
    days: [...dayMap.values()]
      .map((row) => ({
        ...row,
        totalKg: round(row.totalKg),
        totalEarned: round(row.totalEarned),
      }))
      .sort((a, b) => b.date.localeCompare(a.date)),
  };
}

export async function getFruitKgOverview(): Promise<FruitKgRow[]> {
  const userId = await requireUserId();
  const fruits = await prisma.fruit.findMany({
    where: { userId },
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      pricePerKg: true,
      workRecords: { select: { kg: true, totalAmount: true } },
    },
  });

  return fruits
    .map((fruit) => {
      const totalKg = fruit.workRecords.reduce(
        (sum, record) => sum + Number(record.kg.toString()),
        0,
      );
      const totalEarned = fruit.workRecords.reduce(
        (sum, record) => sum + Number(record.totalAmount.toString()),
        0,
      );

      return {
        fruitId: fruit.id,
        fruitName: fruit.name,
        pricePerKg: Number(fruit.pricePerKg.toString()),
        totalKg: round(totalKg),
        totalEarned: round(totalEarned),
      };
    })
    .sort((a, b) => b.totalKg - a.totalKg);
}

export async function getDayPickerDashboard(date: string): Promise<{
  date: string;
  totalKg: number;
  totalEarned: number;
  pickers: DayPickerRow[];
}> {
  const userId = await requireUserId();
  const range = getDayRange(date);
  const records = await prisma.workRecord.findMany({
    where: {
      date: { gte: range.start, lt: range.end },
      worker: { userId },
    },
    select: {
      kg: true,
      totalAmount: true,
      worker: { select: { id: true, name: true, phone: true } },
      fruit: { select: { name: true } },
    },
  });

  const pickerMap = new Map<
    number,
    DayPickerRow & { fruitMap: Map<string, number> }
  >();
  let totalKg = 0;
  let totalEarned = 0;

  for (const record of records) {
    const kg = Number(record.kg.toString());
    const earned = Number(record.totalAmount.toString());
    totalKg += kg;
    totalEarned += earned;

    const current = pickerMap.get(record.worker.id) ?? {
      workerId: record.worker.id,
      workerName: record.worker.name,
      phone: record.worker.phone,
      totalKg: 0,
      totalEarned: 0,
      fruits: [],
      fruitMap: new Map<string, number>(),
    };

    current.totalKg += kg;
    current.totalEarned += earned;
    current.fruitMap.set(
      record.fruit.name,
      (current.fruitMap.get(record.fruit.name) ?? 0) + kg,
    );
    pickerMap.set(record.worker.id, current);
  }

  const pickers = [...pickerMap.values()]
    .map((picker) => ({
      workerId: picker.workerId,
      workerName: picker.workerName,
      phone: picker.phone,
      totalKg: round(picker.totalKg),
      totalEarned: round(picker.totalEarned),
      fruits: [...picker.fruitMap.entries()]
        .map(([fruitName, fruitKg]) => ({
          fruitName,
          totalKg: round(fruitKg),
        }))
        .sort((a, b) => b.totalKg - a.totalKg),
    }))
    .sort((a, b) => b.totalKg - a.totalKg);

  return {
    date,
    totalKg: round(totalKg),
    totalEarned: round(totalEarned),
    pickers,
  };
}
