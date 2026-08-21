'use server';

import { prisma } from '@/app/lib/prisma';
import { requireUserId } from '@/app/lib/current-user';
import { parsePrice, type DeleteActionResult } from '@/app/lib/actions/shared';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export type WorkRecordFormState = {
  message: string | null;
  values: {
    workerId: string;
    fruitId: string;
    date: string;
    kg: string;
    pricePerKg: string;
  };
};

function parseWorkRecordDate(value: string) {
  if (!value) return null;
  const parsed = value.includes('T')
    ? new Date(value)
    : new Date(`${value}T12:00:00.000Z`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export async function createWorkRecord(
  _prevState: WorkRecordFormState,
  formData: FormData,
): Promise<WorkRecordFormState> {
  const userId = await requireUserId();
  const values = {
    workerId: String(formData.get('workerId') ?? ''),
    fruitId: String(formData.get('fruitId') ?? ''),
    date: String(formData.get('date') ?? ''),
    kg: String(formData.get('kg') ?? '').trim(),
    pricePerKg: String(formData.get('pricePerKg') ?? '').trim(),
  };

  const workerId = Number(values.workerId);
  const fruitId = Number(values.fruitId);
  const kg = parsePrice(values.kg);
  let price = parsePrice(values.pricePerKg);

  if (!workerId || !fruitId || !values.date || kg === null || kg <= 0) {
    return { message: 'Бүх талбарыг зөв бөглөнө үү.', values };
  }

  const [worker, fruit] = await Promise.all([
    prisma.worker.findFirst({ where: { id: workerId, userId } }),
    prisma.fruit.findFirst({ where: { id: fruitId, userId } }),
  ]);

  if (!worker) {
    return { message: 'Ажилтан олдсонгүй.', values };
  }
  if (!fruit) {
    return { message: 'Ургац олдсонгүй.', values };
  }

  if (price === null) {
    price = Number(fruit.pricePerKg.toString());
  }

  const totalAmount = Number((kg * price).toFixed(2));
  const recordedAt = parseWorkRecordDate(values.date);
  if (!recordedAt) {
    return { message: 'Огноо, цагийг зөв оруулна уу.', values };
  }

  await prisma.workRecord.create({
    data: {
      workerId,
      fruitId,
      date: recordedAt,
      kg,
      pricePerKg: price,
      totalAmount,
    },
  });

  revalidatePath('/dashboard/work-records');
  revalidatePath('/dashboard');
  redirect('/dashboard/work-records');
}

export async function updateWorkRecord(
  id: number,
  _prevState: WorkRecordFormState,
  formData: FormData,
): Promise<WorkRecordFormState> {
  const userId = await requireUserId();
  const values = {
    workerId: String(formData.get('workerId') ?? ''),
    fruitId: String(formData.get('fruitId') ?? ''),
    date: String(formData.get('date') ?? ''),
    kg: String(formData.get('kg') ?? '').trim(),
    pricePerKg: String(formData.get('pricePerKg') ?? '').trim(),
  };

  const workerId = Number(values.workerId);
  const fruitId = Number(values.fruitId);
  const kg = parsePrice(values.kg);
  let price = parsePrice(values.pricePerKg);

  if (!workerId || !fruitId || !values.date || kg === null || kg <= 0) {
    return { message: 'Бүх талбарыг зөв бөглөнө үү.', values };
  }

  const ownedRecord = await prisma.workRecord.findFirst({
    where: { id, worker: { userId } },
  });
  if (!ownedRecord) {
    return { message: 'Түүлтийн бүртгэл олдсонгүй.', values };
  }

  const [worker, fruit] = await Promise.all([
    prisma.worker.findFirst({ where: { id: workerId, userId } }),
    prisma.fruit.findFirst({ where: { id: fruitId, userId } }),
  ]);

  if (!worker) {
    return { message: 'Ажилтан олдсонгүй.', values };
  }
  if (!fruit) {
    return { message: 'Ургац олдсонгүй.', values };
  }

  if (price === null) {
    price = Number(fruit.pricePerKg.toString());
  }

  const totalAmount = Number((kg * price).toFixed(2));
  const recordedAt = parseWorkRecordDate(values.date);
  if (!recordedAt) {
    return { message: 'Огноо, цагийг зөв оруулна уу.', values };
  }

  await prisma.workRecord.update({
    where: { id },
    data: {
      workerId,
      fruitId,
      date: recordedAt,
      kg,
      pricePerKg: price,
      totalAmount,
    },
  });

  revalidatePath('/dashboard/work-records');
  revalidatePath('/dashboard');
  redirect('/dashboard/work-records');
}

export async function deleteWorkRecord(
  id: number,
): Promise<DeleteActionResult> {
  const userId = await requireUserId();
  const owned = await prisma.workRecord.findFirst({
    where: { id, worker: { userId } },
  });
  if (!owned) {
    return { error: 'Түүлтийн бүртгэл олдсонгүй.' };
  }

  await prisma.workRecord.delete({
    where: { id },
  });

  revalidatePath('/dashboard/work-records');
  revalidatePath('/dashboard');
  return {};
}
