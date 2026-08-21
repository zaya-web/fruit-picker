'use server';

import { prisma } from '@/app/lib/prisma';
import { requireUserId } from '@/app/lib/current-user';
import { parsePrice, type DeleteActionResult } from '@/app/lib/actions/shared';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export type FruitFormState = {
  message: string | null;
  values: {
    name: string;
    pricePerKg: string;
  };
};

const CROPS_PATH = '/dashboard/crops';

export async function createFruit(
  _prevState: FruitFormState,
  formData: FormData,
): Promise<FruitFormState> {
  const userId = await requireUserId();
  const name = String(formData.get('name') ?? '').trim();
  const pricePerKg = String(formData.get('pricePerKg') ?? '').trim();
  const values = { name, pricePerKg };

  if (!name) {
    return { message: 'Нэр оруулна уу.', values };
  }

  const price = parsePrice(pricePerKg);
  if (price === null) {
    return { message: 'Үнэ буруу байна.', values };
  }

  const existing = await prisma.fruit.findFirst({
    where: { userId, name: { equals: name, mode: 'insensitive' } },
  });
  if (existing) {
    return { message: 'Бүртгэгдсэн ургац байна.', values };
  }

  await prisma.fruit.create({
    data: { userId, name, pricePerKg: price },
  });

  revalidatePath(CROPS_PATH);
  revalidatePath('/dashboard');
  redirect(CROPS_PATH);
}

export async function updateFruit(
  id: number,
  _prevState: FruitFormState,
  formData: FormData,
): Promise<FruitFormState> {
  const userId = await requireUserId();
  const name = String(formData.get('name') ?? '').trim();
  const pricePerKg = String(formData.get('pricePerKg') ?? '').trim();
  const values = { name, pricePerKg };

  if (!name) {
    return { message: 'Нэр оруулна уу.', values };
  }

  const owned = await prisma.fruit.findFirst({ where: { id, userId } });
  if (!owned) {
    return { message: 'Ургац олдсонгүй.', values };
  }

  const price = parsePrice(pricePerKg);
  if (price === null) {
    return { message: 'Үнэ буруу байна.', values };
  }

  const existing = await prisma.fruit.findFirst({
    where: {
      userId,
      id: { not: id },
      name: { equals: name, mode: 'insensitive' },
    },
  });
  if (existing) {
    return { message: 'Бүртгэгдсэн ургац байна.', values };
  }

  await prisma.fruit.update({
    where: { id },
    data: { name, pricePerKg: price },
  });

  revalidatePath(CROPS_PATH);
  revalidatePath('/dashboard');
  redirect(CROPS_PATH);
}

export async function deleteFruit(id: number): Promise<DeleteActionResult> {
  const userId = await requireUserId();
  const owned = await prisma.fruit.findFirst({ where: { id, userId } });
  if (!owned) {
    return { error: 'Ургац олдсонгүй.' };
  }

  const workRecords = await prisma.workRecord.count({
    where: { fruitId: id },
  });

  if (workRecords > 0) {
    return {
      error: 'Энэ ургацад холбоотой түүлт байгаа тул устгах боломжгүй.',
    };
  }

  await prisma.fruit.delete({
    where: { id },
  });

  revalidatePath(CROPS_PATH);
  revalidatePath('/dashboard');
  return {};
}
