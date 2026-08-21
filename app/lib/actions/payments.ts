'use server';

import { prisma } from '@/app/lib/prisma';
import { requireUserId } from '@/app/lib/current-user';
import { parsePrice, type DeleteActionResult } from '@/app/lib/actions/shared';
import { parseDateTimeInput } from '@/app/lib/format';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { PaymentMethod } from '@prisma/client';

export type PaymentFormState = {
  message: string | null;
  values: {
    workerId: string;
    amount: string;
    paidAt: string;
    method: PaymentMethod;
    note: string;
  };
};

export async function createPayment(
  _prevState: PaymentFormState,
  formData: FormData,
): Promise<PaymentFormState> {
  const userId = await requireUserId();
  const methodValue = String(formData.get('method') ?? 'CASH');
  const method: PaymentMethod = methodValue === 'BANK' ? 'BANK' : 'CASH';

  const values = {
    workerId: String(formData.get('workerId') ?? ''),
    amount: String(formData.get('amount') ?? '').trim(),
    paidAt: String(formData.get('paidAt') ?? ''),
    method,
    note: String(formData.get('note') ?? '').trim(),
  };

  const workerId = Number(values.workerId);
  const amount = parsePrice(values.amount);

  if (!workerId || amount === null || amount <= 0) {
    return { message: 'Ажилтан болон дүнг зөв оруулна уу.', values };
  }

  const paidAt = values.paidAt
    ? parseDateTimeInput(values.paidAt)
    : new Date();
  if (!paidAt) {
    return { message: 'Төлсөн огноо буруу байна.', values };
  }

  const worker = await prisma.worker.findFirst({
    where: { id: workerId, userId },
  });
  if (!worker) {
    return { message: 'Ажилтан олдсонгүй.', values };
  }

  await prisma.payment.create({
    data: {
      workerId,
      amount,
      paidAt,
      method,
      note: values.note || null,
    },
  });

  revalidatePath('/dashboard/payments');
  revalidatePath('/dashboard');
  revalidatePath(`/dashboard/payments/workers/${workerId}`);
  redirect(`/dashboard/payments/workers/${workerId}`);
}

export async function updatePayment(
  id: number,
  _prevState: PaymentFormState,
  formData: FormData,
): Promise<PaymentFormState> {
  const userId = await requireUserId();
  const methodValue = String(formData.get('method') ?? 'CASH');
  const method: PaymentMethod = methodValue === 'BANK' ? 'BANK' : 'CASH';

  const values = {
    workerId: String(formData.get('workerId') ?? ''),
    amount: String(formData.get('amount') ?? '').trim(),
    paidAt: String(formData.get('paidAt') ?? ''),
    method,
    note: String(formData.get('note') ?? '').trim(),
  };

  const workerId = Number(values.workerId);
  const amount = parsePrice(values.amount);

  if (!workerId || amount === null || amount <= 0) {
    return { message: 'Ажилтан болон дүнг зөв оруулна уу.', values };
  }

  const paidAt = values.paidAt
    ? parseDateTimeInput(values.paidAt)
    : new Date();
  if (!paidAt) {
    return { message: 'Төлсөн огноо буруу байна.', values };
  }

  const owned = await prisma.payment.findFirst({
    where: { id, worker: { userId } },
  });
  if (!owned) {
    return { message: 'Төлбөр олдсонгүй.', values };
  }

  const worker = await prisma.worker.findFirst({
    where: { id: workerId, userId },
  });
  if (!worker) {
    return { message: 'Ажилтан олдсонгүй.', values };
  }

  await prisma.payment.update({
    where: { id },
    data: {
      workerId,
      amount,
      paidAt,
      method,
      note: values.note || null,
    },
  });

  revalidatePath('/dashboard/payments');
  revalidatePath('/dashboard');
  revalidatePath(`/dashboard/payments/workers/${workerId}`);
  redirect(`/dashboard/payments/workers/${workerId}`);
}

export async function deletePayment(id: number): Promise<DeleteActionResult> {
  const userId = await requireUserId();
  const payment = await prisma.payment.findFirst({
    where: { id, worker: { userId } },
    select: { workerId: true },
  });

  if (!payment) {
    return { error: 'Төлбөр олдсонгүй.' };
  }

  await prisma.payment.delete({
    where: { id },
  });

  revalidatePath('/dashboard/payments');
  revalidatePath('/dashboard');
  revalidatePath(`/dashboard/payments/workers/${payment.workerId}`);
  return {};
}
