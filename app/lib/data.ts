import { prisma } from '@/app/lib/prisma';
import { requireUserId } from '@/app/lib/current-user';
import { notFound } from 'next/navigation';

export async function getWorkers() {
  const userId = await requireUserId();
  return prisma.worker.findMany({
    where: { userId },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function getWorkerById(id: number) {
  const userId = await requireUserId();
  const worker = await prisma.worker.findFirst({
    where: { id, userId },
  });

  if (!worker) {
    notFound();
  }

  return worker;
}

export async function getWorkersForSelect() {
  const userId = await requireUserId();
  return prisma.worker.findMany({
    where: { userId },
    orderBy: { name: 'asc' },
    select: { id: true, name: true },
  });
}

export async function getFruits() {
  const userId = await requireUserId();
  return prisma.fruit.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getFruitById(id: number) {
  const userId = await requireUserId();
  const fruit = await prisma.fruit.findFirst({
    where: { id, userId },
  });

  if (!fruit) {
    notFound();
  }

  return fruit;
}

export async function getFruitsForSelect() {
  const userId = await requireUserId();
  return prisma.fruit.findMany({
    where: { userId },
    orderBy: { name: 'asc' },
    select: { id: true, name: true, pricePerKg: true },
  });
}

export async function getWorkRecords() {
  const userId = await requireUserId();
  return prisma.workRecord.findMany({
    where: { worker: { userId } },
    include: {
      worker: true,
      fruit: true,
    },
    orderBy: {
      date: 'desc',
    },
  });
}

export async function getWorkRecordsByWorkerId(workerId: number) {
  const userId = await requireUserId();
  return prisma.workRecord.findMany({
    where: { workerId, worker: { userId } },
    include: {
      worker: true,
      fruit: true,
    },
    orderBy: {
      date: 'desc',
    },
  });
}

export async function getWorkRecordById(id: number) {
  const userId = await requireUserId();
  const workRecord = await prisma.workRecord.findFirst({
    where: { id, worker: { userId } },
    include: {
      worker: true,
      fruit: true,
    },
  });

  if (!workRecord) {
    notFound();
  }

  return workRecord;
}

export async function getPaymentById(id: number) {
  const userId = await requireUserId();
  const payment = await prisma.payment.findFirst({
    where: { id, worker: { userId } },
    include: {
      worker: true,
    },
  });

  if (!payment) {
    notFound();
  }

  return payment;
}

export async function getDashboardCounts() {
  const userId = await requireUserId();
  const [workers, fruits, workRecords, payments] = await Promise.all([
    prisma.worker.count({ where: { userId } }),
    prisma.fruit.count({ where: { userId } }),
    prisma.workRecord.count({ where: { worker: { userId } } }),
    prisma.payment.count({ where: { worker: { userId } } }),
  ]);

  return { workers, fruits, workRecords, payments };
}
