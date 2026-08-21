'use client';

import { useActionState } from 'react';
import {
  updateFruit,
  type FruitFormState,
} from '@/app/lib/actions/crops';
import { FormField, FormShell, farmFieldClass } from '@/app/ui/common/form-shell';
import type { Fruit } from '@prisma/client';

export default function EditFruitForm({ fruit }: { fruit: Fruit }) {
  const initialState: FruitFormState = {
    message: null,
    values: {
      name: fruit.name,
      pricePerKg: fruit.pricePerKg.toString(),
    },
  };

  const updateFruitWithId = updateFruit.bind(null, fruit.id);
  const [state, formAction, pending] = useActionState(
    updateFruitWithId,
    initialState,
  );

  return (
    <FormShell
      action={formAction}
      message={state.message}
      cancelHref={`/dashboard/crops/${fruit.id}`}
      submitLabel="Өөрчлөлт хадгалах"
      pending={pending}
    >
      <FormField label="Ургацын нэр" htmlFor="name">
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={state.values.name}
          className={farmFieldClass}
        />
      </FormField>

      <FormField label="Нэг кг-ийн үнэ" htmlFor="pricePerKg">
        <input
          id="pricePerKg"
          name="pricePerKg"
          type="number"
          min="0"
          step="0.01"
          required
          defaultValue={state.values.pricePerKg}
          className={farmFieldClass}
        />
      </FormField>
    </FormShell>
  );
}
