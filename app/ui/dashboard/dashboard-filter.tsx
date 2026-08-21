'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { DashboardFilter } from '@/app/lib/dashboard-stats';
import { buildDashboardHref } from '@/app/lib/dashboard-url';

const selectClassName = 'farm-input w-full px-3 text-sm outline-none';

type FruitOption = { id: number; name: string };
type WorkerOption = { id: number; name: string };

function toDateKeyLocal(date = new Date()) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export default function DashboardFilterBar({
  years,
  fruits,
  workers = [],
  selectedYear,
  selectedMonth,
  selectedDays,
  selectedFrom,
  selectedTo,
  selectedFruitId,
  selectedWorkerId,
}: {
  years: number[];
  monthsByYear: Record<number, number[]>;
  fruits: FruitOption[];
  workers: WorkerOption[];
  selectedYear?: number;
  selectedMonth?: number;
  selectedDays?: number;
  selectedFrom?: string;
  selectedTo?: string;
  selectedFruitId?: number;
  selectedWorkerId?: number;
}) {
  const router = useRouter();
  const currentYear = new Date().getUTCFullYear();
  const effectiveYear = selectedYear ?? currentYear;
  const monthOptions = Array.from({ length: 12 }, (_, index) => index + 1);
  const today = toDateKeyLocal();
  const hasRange = Boolean(selectedFrom && selectedTo);
  const hasQuickPeriod = Boolean(selectedDays || hasRange);

  const updateFilter = (next: Partial<DashboardFilter>) => {
    router.push(buildDashboardHref(next));
  };

  const baseExtras = {
    fruitId: selectedFruitId,
    workerId: selectedWorkerId,
  };

  const currentFilter: DashboardFilter = {
    year: selectedYear,
    month: selectedMonth,
    days: selectedDays,
    from: selectedFrom,
    to: selectedTo,
    fruitId: selectedFruitId,
    workerId: selectedWorkerId,
  };

  const activeFilters = [
    selectedDays
      ? {
          label: `Сүүлийн ${selectedDays} хоног`,
          clear: { ...baseExtras },
        }
      : null,
    hasRange
      ? {
          label: `${selectedFrom} → ${selectedTo}`,
          clear: { ...baseExtras },
        }
      : null,
    !hasQuickPeriod && selectedYear
      ? {
          label: `${selectedYear} он`,
          clear: { ...currentFilter, year: undefined, month: undefined },
        }
      : null,
    !hasQuickPeriod && selectedMonth
      ? {
          label: `${selectedMonth}-р сар`,
          clear: { ...currentFilter, month: undefined },
        }
      : null,
    selectedFruitId
      ? {
          label: fruits.find((f) => f.id === selectedFruitId)?.name ?? 'Ургац',
          clear: { ...currentFilter, fruitId: undefined },
        }
      : null,
    selectedWorkerId
      ? {
          label: workers.find((w) => w.id === selectedWorkerId)?.name ?? 'Ажилтан',
          clear: { ...currentFilter, workerId: undefined },
        }
      : null,
  ].filter(Boolean) as { label: string; clear: DashboardFilter }[];

  return (
    <div className="farm-card p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-[var(--foreground)]">Шүүлт</p>
        {activeFilters.length > 0 ? (
          <Link
            href="/dashboard"
            className="text-sm text-[var(--text-secondary)] transition hover:text-[var(--farm-deep)]"
          >
            Бүгдийг цэвэрлэх
          </Link>
        ) : null}
      </div>

      <div className="mb-4">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
          Хугацаа
        </p>
        <div className="flex flex-wrap gap-2">
          {[7, 14].map((days) => {
            const active = selectedDays === days;
            return (
              <button
                key={days}
                type="button"
                onClick={() =>
                  updateFilter({
                    days,
                    fruitId: selectedFruitId,
                    workerId: selectedWorkerId,
                  })
                }
                className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                  active
                    ? 'bg-[var(--farm-deep)] text-white'
                    : 'border border-[#d9d3c4] bg-white hover:bg-[#f8f4eb]'
                }`}
              >
                Сүүлийн {days} хоног
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="from"
            className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]"
          >
            Эхлэх огноо
          </label>
          <input
            id="from"
            type="date"
            value={selectedFrom ?? ''}
            max={selectedTo || today}
            onChange={(event) => {
              const from = event.target.value || undefined;
              const to = selectedTo || from;
              if (!from || !to) {
                updateFilter({
                  year: selectedYear,
                  month: selectedMonth,
                  fruitId: selectedFruitId,
                  workerId: selectedWorkerId,
                });
                return;
              }
              updateFilter({
                from: from <= to ? from : to,
                to: from <= to ? to : from,
                fruitId: selectedFruitId,
                workerId: selectedWorkerId,
              });
            }}
            className={selectClassName}
          />
        </div>
        <div>
          <label
            htmlFor="to"
            className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]"
          >
            Дуусах огноо
          </label>
          <input
            id="to"
            type="date"
            value={selectedTo ?? ''}
            min={selectedFrom || undefined}
            max={today}
            onChange={(event) => {
              const to = event.target.value || undefined;
              const from = selectedFrom || to;
              if (!from || !to) {
                updateFilter({
                  year: selectedYear,
                  month: selectedMonth,
                  fruitId: selectedFruitId,
                  workerId: selectedWorkerId,
                });
                return;
              }
              updateFilter({
                from: from <= to ? from : to,
                to: from <= to ? to : from,
                fruitId: selectedFruitId,
                workerId: selectedWorkerId,
              });
            }}
            className={selectClassName}
          />
        </div>
      </div>

      {hasRange ? (
        <p className="mb-4 text-xs text-[var(--text-secondary)]">
          Сонгосон хугацаа: {selectedFrom} → {selectedTo}
          {' · '}
          <button
            type="button"
            className="text-[var(--farm-deep)] hover:underline"
            onClick={() =>
              updateFilter({
                year: selectedYear,
                month: selectedMonth,
                fruitId: selectedFruitId,
                workerId: selectedWorkerId,
              })
            }
          >
            Цэвэрлэх
          </button>
        </p>
      ) : null}

      <div className="grid gap-4 border-t border-[#eee6d8] pt-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label
            htmlFor="year"
            className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]"
          >
            Жил
          </label>
          <select
            id="year"
            value={hasQuickPeriod ? '' : (selectedYear ?? '')}
            disabled={hasQuickPeriod}
            onChange={(event) => {
              const year = event.target.value ? Number(event.target.value) : undefined;
              updateFilter({
                year,
                month: undefined,
                fruitId: selectedFruitId,
                workerId: selectedWorkerId,
              });
            }}
            className={`${selectClassName} disabled:cursor-not-allowed disabled:opacity-50`}
          >
            <option value="">Бүх жил</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="month"
            className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]"
          >
            Сар
          </label>
          <select
            id="month"
            value={hasQuickPeriod ? '' : (selectedMonth ?? '')}
            disabled={hasQuickPeriod}
            onChange={(event) => {
              const month = event.target.value ? Number(event.target.value) : undefined;
              updateFilter({
                year: selectedYear ?? effectiveYear,
                month,
                fruitId: selectedFruitId,
                workerId: selectedWorkerId,
              });
            }}
            className={`${selectClassName} disabled:cursor-not-allowed disabled:opacity-50`}
          >
            <option value="">Бүх сар</option>
            {monthOptions.map((month) => (
              <option key={month} value={month}>
                {month}-р сар
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="fruitId"
            className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]"
          >
            Ургац
          </label>
          <select
            id="fruitId"
            value={selectedFruitId ?? ''}
            onChange={(event) => {
              const fruitId = event.target.value
                ? Number(event.target.value)
                : undefined;
              updateFilter({ ...currentFilter, fruitId });
            }}
            className={selectClassName}
          >
            <option value="">Бүх ургац</option>
            {fruits.map((fruit) => (
              <option key={fruit.id} value={fruit.id}>
                {fruit.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="workerId"
            className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]"
          >
            Ажилтан
          </label>
          <select
            id="workerId"
            value={selectedWorkerId ?? ''}
            onChange={(event) => {
              const workerId = event.target.value
                ? Number(event.target.value)
                : undefined;
              updateFilter({ ...currentFilter, workerId });
            }}
            className={selectClassName}
          >
            <option value="">Бүх ажилтан</option>
            {workers.map((worker) => (
              <option key={worker.id} value={worker.id}>
                {worker.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {activeFilters.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2 border-t border-[#eee6d8] pt-4">
          {activeFilters.map((chip) => (
            <Link
              key={chip.label}
              href={buildDashboardHref(chip.clear)}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#e7f0e8] px-3 py-1 text-xs font-medium text-[var(--farm-deep)] transition hover:bg-[#d8e8da]"
            >
              {chip.label}
              <span aria-hidden>×</span>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
