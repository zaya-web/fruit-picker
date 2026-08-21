'use client';

import { useActionState, useState } from 'react';
import {
  updateWorkRecord,
  type WorkRecordFormState,
} from '@/app/lib/actions/work-records';
import { FormField, FormShell, farmFieldClass } from '@/app/ui/common/form-shell';
import type { FruitOption, SelectOption } from '@/app/ui/select-options';

export default function EditWorkRecordForm({
  recordId,
  workers,
  fruits,
  initialValues,
}: {
  recordId: number;
  workers: SelectOption[];
  fruits: FruitOption[];
  initialValues: WorkRecordFormState['values'];
}) {
  const initialState: WorkRecordFormState = {
    message: null,
    values: initialValues,
  };

  const updateWorkRecordWithId = updateWorkRecord.bind(null, recordId);
  const [state, formAction, pending] = useActionState(
    updateWorkRecordWithId,
    initialState,
  );
  const [pricePerKg, setPricePerKg] = useState(state.values.pricePerKg);

  return (
    <FormShell
      action={formAction}
      message={state.message}
      cancelHref="/dashboard/work-records"
      submitLabel="Өөрчлөлт хадгалах"
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
