'use server';

import { prisma } from '@/app/lib/prisma';
import { requireUserId } from '@/app/lib/current-user';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { WorkerStatus } from '@prisma/client';
import type { DeleteActionResult } from '@/app/lib/actions/shared';

export type WorkerFormState = {
  message: string | null;
  values: {
    name: string;
    phone: string;
    bankAccount: string;
    status: WorkerStatus;
  };
};

const DUPLICATE_WORKER_MESSAGE = 'Бүртгэгдсэн хэрэглэгч байна.';

function parseWorkerForm(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim();
  const phone = String(formData.get('phone') ?? '').trim();
  const bankAccount = String(formData.get('bankAccount') ?? '').trim();
  const statusValue = String(formData.get('status') ?? 'ACTIVE');
  const status: WorkerStatus =
    statusValue === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE';

  return {
    name,
    phone: phone || null,
    bankAccount: bankAccount || null,
    status,
    values: {
      name,
      phone,
      bankAccount,
      status,
    },
  };
}

async function workerAlreadyExists(
  userId: number,
  name: string,
  phone: string | null,
  excludeId?: number,
) {
  return prisma.worker.findFirst({
    where: {
      userId,
      id: excludeId ? { not: excludeId } : undefined,
      OR: [
        { name: { equals: name, mode: 'insensitive' as const } },
        ...(phone
          ? [{ phone: { equals: phone, mode: 'insensitive' as const } }]
          : []),
      ],
    },
  });
}

export async function createWorker(
  _prevState: WorkerFormState,
  formData: FormData,
): Promise<WorkerFormState> {
  const userId = await requireUserId();
  const { name, phone, bankAccount, status, values } = parseWorkerForm(formData);

  if (!name) {
    return { message: 'Нэр оруулна уу.', values };
  }

  const existing = await workerAlreadyExists(userId, name, phone);
  if (existing) {
    return { message: DUPLICATE_WORKER_MESSAGE, values };
  }

  await prisma.worker.create({
    data: { userId, name, phone, bankAccount, status },
  });

  revalidatePath('/dashboard/workers');
  revalidatePath('/dashboard');
  redirect('/dashboard/workers');
}

export async function updateWorker(
  id: number,
  _prevState: WorkerFormState,
  formData: FormData,
): Promise<WorkerFormState> {
  const userId = await requireUserId();
  const { name, phone, bankAccount, status, values } = parseWorkerForm(formData);

  if (!name) {
    return { message: 'Нэр оруулна уу.', values };
  }

  const owned = await prisma.worker.findFirst({ where: { id, userId } });
  if (!owned) {
    return { message: 'Ажилтан олдсонгүй.', values };
  }

  const existing = await workerAlreadyExists(userId, name, phone, id);
  if (existing) {
    return { message: DUPLICATE_WORKER_MESSAGE, values };
  }

  await prisma.worker.update({
    where: { id },
    data: { name, phone, bankAccount, status },
  });

  revalidatePath('/dashboard/workers');
  revalidatePath('/dashboard');
  redirect('/dashboard/workers');
}

export async function deleteWorker(id: number): Promise<DeleteActionResult> {
  const userId = await requireUserId();
  const owned = await prisma.worker.findFirst({ where: { id, userId } });
  if (!owned) {
    return { error: 'Ажилтан олдсонгүй.' };
  }

  const [workRecords, payments] = await Promise.all([
    prisma.workRecord.count({ where: { workerId: id } }),
    prisma.payment.count({ where: { workerId: id } }),
  ]);

  if (workRecords > 0 || payments > 0) {
    return {
      error: 'Энэ түүгчид холбоотой бүртгэл байгаа тул устгах боломжгүй.',
    };
  }

  await prisma.worker.delete({
    where: { id },
  });

  revalidatePath('/dashboard/workers');
  revalidatePath('/dashboard');
  return {};
}
