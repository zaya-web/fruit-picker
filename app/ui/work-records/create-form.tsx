'use client';

import { useActionState, useState } from 'react';
import {
  createWorkRecord,
  type WorkRecordFormState,
} from '@/app/lib/actions/work-records';
import { FormField, FormShell, farmFieldClass } from '@/app/ui/common/form-shell';
import type { FruitOption, SelectOption } from '@/app/ui/select-options';

export default function CreateWorkRecordForm({
  workers,
  fruits,
  defaultDate,
}: {
  workers: SelectOption[];
  fruits: FruitOption[];
  defaultDate: string;
}) {
  const initialState: WorkRecordFormState = {
    message: null,
    values: {
      workerId: workers[0] ? String(workers[0].id) : '',
      fruitId: fruits[0] ? String(fruits[0].id) : '',
      date: defaultDate,
      kg: '',
      pricePerKg: fruits[0]?.pricePerKg ?? '',
    },
  };

  const [state, formAction, pending] = useActionState(
    createWorkRecord,
    initialState,
  );
  const [pricePerKg, setPricePerKg] = useState(state.values.pricePerKg);

  return (
    <FormShell
      action={formAction}
      message={state.message}
      cancelHref="/dashboard/work-records"
      submitLabel="Түүлтийг баталгаажуулах"
      pending={pending}
    >
      <FormField label="Түүгч" htmlFor="workerId">
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

      <FormField label="Ургац" htmlFor="fruitId">
        <select
          id="fruitId"
          name="fruitId"
          required
          defaultValue={state.values.fruitId}
          className={farmFieldClass}
          onChange={(event) => {
            const fruit = fruits.find(
              (item) => String(item.id) === event.target.value,
            );
            if (fruit) {
              setPricePerKg(fruit.pricePerKg);
            }
          }}
        >
          {fruits.map((fruit) => (
            <option key={fruit.id} value={fruit.id}>
              {fruit.name}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Огноо, цаг" htmlFor="date">
        <input
          id="date"
          name="date"
          type="datetime-local"
          required
          defaultValue={state.values.date}
          className={farmFieldClass}
        />
      </FormField>

      <FormField label="Түүсэн кг" htmlFor="kg">
        <input
          id="kg"
          name="kg"
          type="number"
          min="0.01"
          step="0.01"
          required
          defaultValue={state.values.kg}
          className={farmFieldClass}
        />
      </FormField>

      <FormField label="Үнэ / кг" htmlFor="pricePerKg">
        <input
          id="pricePerKg"
          name="pricePerKg"
          type="number"
          min="0"
          step="0.01"
          required
          value={pricePerKg}
          onChange={(event) => setPricePerKg(event.target.value)}
          className={farmFieldClass}
        />
      </FormField>
    </FormShell>
  );
}
