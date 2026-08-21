'use client';

import { useActionState } from 'react';
import { updatePayment, type PaymentFormState } from '@/app/lib/actions';
import { FormField, FormShell, farmFieldClass } from '@/app/ui/common/form-shell';
import type { SelectOption } from '@/app/ui/select-options';

export default function EditPaymentForm({
  paymentId,
  workers,
  initialValues,
}: {
  paymentId: number;
  workers: SelectOption[];
  initialValues: PaymentFormState['values'];
}) {
  const initialState: PaymentFormState = {
    message: null,
    values: initialValues,
  };

  const updatePaymentWithId = updatePayment.bind(null, paymentId);
  const [state, formAction, pending] = useActionState(
    updatePaymentWithId,
    initialState,
  );

  return (
    <FormShell
      action={formAction}
      message={state.message}
      cancelHref="/dashboard/payments"
      submitLabel="Өөрчлөлт хадгалах"
      pending={pending}
    >
      <FormField label="Ажилтан" htmlFor="workerId">
        <select
          id="workerId"
          name="workerId"
          required
          defaultValue={state.values.workerId}
          className={farmFieldClass}
        >
          {workers.map((worker) => (
            <option key={worker.id} value={worker.id}>
              {worker.name}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Хөлс" htmlFor="amount">
        <input
          id="amount"
          name="amount"
          type="number"
          min="0.01"
          step="0.01"
          required
          defaultValue={state.values.amount}
          className={farmFieldClass}
        />
      </FormField>

      <FormField label="Төлсөн огноо" htmlFor="paidAt">
        <input
          id="paidAt"
          name="paidAt"
          type="datetime-local"
          required
          defaultValue={state.values.paidAt}
          className={farmFieldClass}
        />
      </FormField>

      <FormField label="Төлбөрийн арга" htmlFor="method">
        <select
          id="method"
          name="method"
          defaultValue={state.values.method}
          className={farmFieldClass}
        >
          <option value="CASH">Бэлнээр</option>
          <option value="BANK">Дансаар</option>
        </select>
      </FormField>

      <FormField label="Тэмдэглэл" htmlFor="note">
        <input
          id="note"
          name="note"
          type="text"
          defaultValue={state.values.note}
          className={farmFieldClass}
        />
      </FormField>
    </FormShell>
  );
}
