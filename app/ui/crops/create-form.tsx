'use client';

import { useActionState } from 'react';
import {
  createFruit,
  type FruitFormState,
} from '@/app/lib/actions/crops';
import { FormField, FormShell, farmFieldClass } from '@/app/ui/common/form-shell';

const initialState: FruitFormState = {
  message: null,
  values: {
    name: '',
    pricePerKg: '',
  },
};

export default function CreateFruitForm() {
  const [state, formAction, pending] = useActionState(createFruit, initialState);

  return (
    <FormShell
      action={formAction}
      message={state.message}
      cancelHref="/dashboard/crops"
      submitLabel="Ургац бүртгэх"
      pending={pending}
    >
      <FormField label="Ургацын нэр" htmlFor="name">
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={state.values.name}
          placeholder="Жишээ: Алим"
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
          placeholder="Жишээ: 2500"
          className={farmFieldClass}
        />
      </FormField>
    </FormShell>
  );
}
