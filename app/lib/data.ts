import { prisma } from '@/app/lib/prisma';
import { notFound } from 'next/navigation';

export async function getWorkers() {
  return prisma.worker.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function getWorkerById(id: number) {
  const worker = await prisma.worker.findUnique({
    where: { id },
  });

  if (!worker) {
    notFound();
  }

  return worker;
}

export async function getWorkRecords() {
  return prisma.workRecord.findMany({
    orderBy: {
      totalAmount: 'desc',
    },
  });
}
