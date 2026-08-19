'use server';

import { prisma } from '@/app/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { WorkerStatus } from '@prisma/client';

function parseWorkerForm(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim();
  const phone = String(formData.get('phone') ?? '').trim();
  const statusValue = String(formData.get('status') ?? 'ACTIVE');
  const status: WorkerStatus =
    statusValue === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE';

  if (!name) {
    throw new Error('Name is required.');
  }

  return {
    name,
    phone: phone || null,
    status,
  };
}

export async function createWorker(formData: FormData) {
  const data = parseWorkerForm(formData);

  await prisma.worker.create({ data });

  revalidatePath('/dashboard/workers');
  redirect('/dashboard/workers');
}

export async function updateWorker(id: number, formData: FormData) {
  const data = parseWorkerForm(formData);

  await prisma.worker.update({
    where: { id },
    data,
  });

  revalidatePath('/dashboard/workers');
  redirect('/dashboard/workers');
}

export async function deleteWorker(id: number) {
  const [workRecords, payments] = await Promise.all([
    prisma.workRecord.count({ where: { workerId: id } }),
    prisma.payment.count({ where: { workerId: id } }),
  ]);

  if (workRecords > 0 || payments > 0) {
    throw new Error(
      'This worker has work records or payments and cannot be deleted.',
    );
  }

  await prisma.worker.delete({
    where: { id },
  });

  revalidatePath('/dashboard/workers');
}
