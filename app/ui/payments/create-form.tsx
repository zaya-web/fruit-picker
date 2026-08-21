'use client';

import { useActionState, useMemo, useState } from 'react';
import {
  createPayment,
  type PaymentFormState,
} from '@/app/lib/actions/payments';
import type {
  WorkerBalance,
  WorkerFruitBreakdown,
} from '@/app/lib/payment-stats';
import { FormAlert } from '@/app/ui/form-alert';
import {
  FormActions,
  FormField,
  farmFieldClass,
} from '@/app/ui/common/form-shell';
import {
  FormInfoBox,
  FormSection,
  PanelHeader,
} from '@/app/ui/common/form-layout';
import type { SelectOption } from '@/app/ui/select-options';
import { formatKg, formatMoney } from '@/app/lib/format';



function getOwedAmount(workerId: number, balances: WorkerBalance[]): string {
  const balance = balances.find((entry) => entry.workerId === workerId);
  return balance && balance.owedAmount > 0 ? String(balance.owedAmount) : '';
}

export default function CreatePaymentForm({
  workers,
  balances,
  fruitBreakdowns,
  defaultPaidAt,
  defaultWorkerId,
}: {
  workers: SelectOption[];
  balances: WorkerBalance[];
  fruitBreakdowns: Record<number, WorkerFruitBreakdown[]>;
  defaultPaidAt: string;
  defaultWorkerId?: number;
}) {
  const initialWorkerId = defaultWorkerId ?? workers[0]?.id ?? 0;

  const [selectedWorkerId, setSelectedWorkerId] = useState(initialWorkerId);
  const [amount, setAmount] = useState(() =>
    getOwedAmount(initialWorkerId, balances),
  );

  const selectedBalance = useMemo(
    () => balances.find((entry) => entry.workerId === selectedWorkerId),
    [balances, selectedWorkerId],
  );

  const selectedFruits = fruitBreakdowns[selectedWorkerId] ?? [];

  const initialState: PaymentFormState = {
    message: null,
    values: {
      workerId: String(initialWorkerId),
      amount: getOwedAmount(initialWorkerId, balances),
      paidAt: defaultPaidAt,
      method: 'CASH',
      note: '',
    },
  };

  const [state, formAction, pending] = useActionState(
    createPayment,
    initialState,
  );

  const displayAmount = amount;
  const cancelHref = defaultWorkerId
    ? `/dashboard/payments/workers/${defaultWorkerId}`
    : '/dashboard/payments';

  const handleWorkerChange = (workerId: number) => {
    setSelectedWorkerId(workerId);
    setAmount(getOwedAmount(workerId, balances));
  };

  return (
    <form action={formAction} className="w-full space-y-5">
      <FormAlert message={state.message} />

      {selectedBalance ? (
        <FormInfoBox>
          <p className="text-sm text-[var(--text-secondary)]">
            Ажлын бүртгэлээс (ургацын үнэ × кг) тооцсон
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <div>
              <p className="text-xs text-[var(--text-muted)]">Төлбөр</p>
              <p className="mt-1 font-semibold tabular-nums">
                {formatMoney(selectedBalance.totalEarned)}
              </p>
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">Төлсөн</p>
              <p className="mt-1 font-semibold tabular-nums text-[var(--farm-deep)]">
                {formatMoney(selectedBalance.totalPaid)}
              </p>
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">Төлөх ёстой</p>
              <p className="mt-1 font-semibold tabular-nums text-[#b45309]">
                {formatMoney(selectedBalance.owedAmount)}
              </p>
            </div>
          </div>
        </FormInfoBox>
      ) : null}

      {selectedFruits.length > 0 ? (
        <FormSection className="overflow-hidden p-0">
          <PanelHeader title="Ургацаар тооцоолсон" />
          <div className="px-4 pb-4 sm:px-5 sm:pb-5">
            <div className="hidden overflow-x-auto md:block">
              <table className="farm-table min-w-full text-left text-sm">
                <thead>
                  <tr>
                    <th className="pb-2 pr-4 font-medium">Ургац</th>
                    <th className="pb-2 pr-4 font-medium">Үнэ/кг</th>
                    <th className="pb-2 pr-4 font-medium">Кг</th>
                    <th className="pb-2 font-medium">Дүн</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eee6d8]">
                  {selectedFruits.map((fruit) => (
                    <tr key={fruit.fruitId}>
                      <td className="py-2 pr-4 font-medium">{fruit.fruitName}</td>
                      <td className="py-2 pr-4 text-[var(--text-secondary)]">
                        {formatMoney(fruit.pricePerKg)}
                      </td>
                      <td className="py-2 pr-4 tabular-nums">
                        {formatKg(fruit.totalKg)}
                      </td>
                      <td className="py-2 tabular-nums">
                        {formatMoney(fruit.totalEarned)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="space-y-3 md:hidden">
              {selectedFruits.map((fruit) => (
                <div
                  key={fruit.fruitId}
                  className="rounded-xl border border-[#eee6d8] bg-[#faf6ee] p-3 text-sm"
                >
                  <p className="font-medium">{fruit.fruitName}</p>
                  <div className="mt-2 space-y-1 text-[var(--text-secondary)]">
                    <div className="flex justify-between gap-3">
                      <span>Үнэ/кг</span>
                      <span className="tabular-nums">{formatMoney(fruit.pricePerKg)}</span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span>Кг</span>
                      <span className="tabular-nums">{formatKg(fruit.totalKg)}</span>
                    </div>
                    <div className="flex justify-between gap-3 font-medium text-[var(--foreground)]">
                      <span>Дүн</span>
                      <span className="tabular-nums">
                        {formatMoney(fruit.totalEarned)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FormSection>
      ) : null}

      <FormSection className="space-y-4">
        <FormField label="Ажилтан" htmlFor="workerId">
          <select
            id="workerId"
            name="workerId"
            required
            value={String(selectedWorkerId)}
            onChange={(event) => handleWorkerChange(Number(event.target.value))}
            className={farmFieldClass}
          >
            {workers.map((worker) => (
              <option key={worker.id} value={worker.id}>
                {worker.name}
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          label="Хөлс"
          htmlFor="amount"
          hint={
            selectedBalance && selectedBalance.owedAmount > 0
              ? `Ургацын үнэ × авсан кг-аар тооцсон ${formatMoney(selectedBalance.owedAmount)} автоматаар гарлаа.`
              : 'Энэ ажилтанд одоогоор төлөх үлдэгдэл байхгүй. Төлөх дүнг гараар оруулна.'
          }
        >
          <input
            id="amount"
            name="amount"
            type="number"
            min="0.01"
            step="0.01"
            required
            value={displayAmount}
            onChange={(event) => setAmount(event.target.value)}
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

        <FormField
          label="Төлбөрийн арга"
          htmlFor="method"
          hint={
            selectedBalance?.bankAccount
              ? `Данс: ${selectedBalance.bankAccount}`
              : 'Дансны дугаар бүртгэгдээгүй бол бэлнээр төлөхийг зөвлөнө.'
          }
        >
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
            placeholder="Заавал биш"
            className={farmFieldClass}
          />
        </FormField>
      </FormSection>

      <FormActions
        cancelHref={cancelHref}
        submitLabel="Төлөх"
        pending={pending}
        submitDisabled={!displayAmount}
      />
    </form>
  );
}
