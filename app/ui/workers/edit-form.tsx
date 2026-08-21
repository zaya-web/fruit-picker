'use client';

import { useActionState } from 'react';
import {
  updateWorker,
  type WorkerFormState,
} from '@/app/lib/actions/workers';
import { FormField, FormShell, farmFieldClass } from '@/app/ui/common/form-shell';
import type { Worker } from '@prisma/client';

export default function EditWorkerForm({ worker }: { worker: Worker }) {
  const initialState: WorkerFormState = {
    message: null,
    values: {
      name: worker.name,
      phone: worker.phone ?? '',
      bankAccount: worker.bankAccount ?? '',
      status: worker.status,
    },
  };

  const updateWorkerWithId = updateWorker.bind(null, worker.id);
  const [state, formAction, pending] = useActionState(
    updateWorkerWithId,
    initialState,
  );

  return (
    <FormShell
      action={formAction}
      message={state.message}
      cancelHref={`/dashboard/workers/${worker.id}`}
      submitLabel="Өөрчлөлт хадгалах"
      pending={pending}
    >
      <FormField label="Нэр" htmlFor="name">
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={state.values.name}
          className={farmFieldClass}
        />
      </FormField>

      <FormField label="Утас" htmlFor="phone">
        <input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={state.values.phone}
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
