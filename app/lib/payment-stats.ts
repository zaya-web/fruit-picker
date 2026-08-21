import { prisma } from '@/app/lib/prisma';
import { requireUserId } from '@/app/lib/current-user';
import { roundNumber } from '@/app/lib/format';
import { notFound } from 'next/navigation';

export type WorkerBalance = {
  workerId: number;
  workerName: string;
  phone: string | null;
  bankAccount: string | null;
  totalKg: number;
  totalEarned: number;
  totalPaid: number;
  owedAmount: number;
  owedKg: number;
};

const round = roundNumber;

function buildBalance(
  workerId: number,
  workerName: string,
  phone: string | null,
  bankAccount: string | null,
  totalKg: number,
  totalEarned: number,
  totalPaid: number,
): WorkerBalance {
  const owedAmount = Math.max(0, round(totalEarned - totalPaid));
  const owedKg =
    totalEarned > 0 ? round(totalKg * (owedAmount / totalEarned)) : 0;

  return {
    workerId,
    workerName,
    phone,
    bankAccount,
    totalKg: round(totalKg),
    totalEarned: round(totalEarned),
    totalPaid: round(totalPaid),
    owedAmount,
    owedKg,
  };
}

export async function getWorkerBalances(): Promise<WorkerBalance[]> {
  const userId = await requireUserId();
  const workers = await prisma.worker.findMany({
    where: { userId },
    orderBy: { name: 'asc' },
    include: {
      workRecords: {
        select: { kg: true, totalAmount: true },
      },
      payments: {
        select: { amount: true },
      },
    },
  });

  return workers.map((worker) => {
    const totalKg = worker.workRecords.reduce(
      (sum, record) => sum + Number(record.kg.toString()),
      0,
    );
    const totalEarned = worker.workRecords.reduce(
      (sum, record) => sum + Number(record.totalAmount.toString()),
      0,
    );
    const totalPaid = worker.payments.reduce(
      (sum, payment) => sum + Number(payment.amount.toString()),
      0,
    );

    return buildBalance(
      worker.id,
      worker.name,
      worker.phone,
      worker.bankAccount,
      totalKg,
      totalEarned,
      totalPaid,
    );
  });
}

export async function getWorkerBalance(workerId: number): Promise<WorkerBalance> {
  const userId = await requireUserId();
  const worker = await prisma.worker.findFirst({
    where: { id: workerId, userId },
    include: {
      workRecords: {
        select: { kg: true, totalAmount: true },
      },
      payments: {
        select: { amount: true },
      },
    },
  });

  if (!worker) {
    notFound();
  }

  const totalKg = worker.workRecords.reduce(
    (sum, record) => sum + Number(record.kg.toString()),
    0,
  );
  const totalEarned = worker.workRecords.reduce(
    (sum, record) => sum + Number(record.totalAmount.toString()),
    0,
  );
  const totalPaid = worker.payments.reduce(
    (sum, payment) => sum + Number(payment.amount.toString()),
    0,
  );

  return buildBalance(
    worker.id,
    worker.name,
    worker.phone,
    worker.bankAccount,
    totalKg,
    totalEarned,
    totalPaid,
  );
}

export async function getWorkerPayments(workerId: number) {
  const userId = await requireUserId();
  return prisma.payment.findMany({
    where: { workerId, worker: { userId } },
    orderBy: { paidAt: 'desc' },
  });
}

export type WorkerFruitBreakdown = {
  fruitId: number;
  fruitName: string;
  pricePerKg: number;
  totalKg: number;
  totalEarned: number;
};

export async function getWorkerFruitBreakdowns(): Promise<
  Record<number, WorkerFruitBreakdown[]>
> {
  const userId = await requireUserId();
  const records = await prisma.workRecord.findMany({
    where: { worker: { userId } },
    select: {
      workerId: true,
      kg: true,
      totalAmount: true,
      fruit: { select: { id: true, name: true, pricePerKg: true } },
    },
  });

  const map = new Map<number, Map<number, WorkerFruitBreakdown>>();

  for (const record of records) {
    const workerMap = map.get(record.workerId) ?? new Map();
    const fruitId = record.fruit.id;
    const current = workerMap.get(fruitId) ?? {
      fruitId,
      fruitName: record.fruit.name,
      pricePerKg: Number(record.fruit.pricePerKg.toString()),
      totalKg: 0,
      totalEarned: 0,
    };

    current.totalKg += Number(record.kg.toString());
    current.totalEarned += Number(record.totalAmount.toString());
    workerMap.set(fruitId, current);
    map.set(record.workerId, workerMap);
  }

  return Object.fromEntries(
    [...map.entries()].map(([workerId, fruits]) => [
      workerId,
      [...fruits.values()].sort((a, b) => b.totalEarned - a.totalEarned),
    ]),
  );
}
