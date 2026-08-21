'use client';

import { useActionState } from 'react';
import {
  createWorker,
  type WorkerFormState,
} from '@/app/lib/actions/workers';
import { FormField, FormShell, farmFieldClass } from '@/app/ui/common/form-shell';

const initialState: WorkerFormState = {
  message: null,
  values: {
    name: '',
    phone: '',
    bankAccount: '',
    status: 'ACTIVE',
  },
};

export default function CreateWorkerForm() {
  const [state, formAction, pending] = useActionState(createWorker, initialState);

  return (
    <FormShell
      action={formAction}
      message={state.message}
      cancelHref="/dashboard/workers"
      submitLabel="Түүгч бүртгэх"
      pending={pending}
    >
      <FormField label="Нэр" htmlFor="name">
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={state.values.name}
          placeholder="Ажилтны нэр"
          className={farmFieldClass}
        />
      </FormField>

      <FormField label="Утас" htmlFor="phone">
        <input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={state.values.phone}
          placeholder="Заавал биш"
          className={farmFieldClass}
        />
      </FormField>

      <FormField
        label="Дансны дугаар"
        htmlFor="bankAccount"
        hint="Дансаар төлбөр хийхэд ашиглагдана"
      >
        <input
          id="bankAccount"
          name="bankAccount"
          type="text"
          defaultValue={state.values.bankAccount}
          placeholder="Жишээ: 5000123456"
          className={farmFieldClass}
        />
      </FormField>

      <FormField label="Төлөв" htmlFor="status">
        <select
          id="status"
          name="status"
          defaultValue={state.values.status}
          className={farmFieldClass}
        >
          <option value="ACTIVE">Идэвхтэй</option>
          <option value="INACTIVE">Идэвхгүй</option>
        </select>
      </FormField>
    </FormShell>
  );
}
