'use client';

import { useRouter } from 'next/navigation';
import type {
  ReportSettlementFilter,
  ReportView,
} from '@/app/lib/report-settlement';

const MONTHS = Array.from({ length: 12 }, (_, index) => index + 1);

function buildReportsHref({
  year,
  month,
  compare,
  view,
  settlement,
}: {
  year: number;
  month?: number;
  compare?: number;
  view: ReportView;
  settlement: ReportSettlementFilter;
}) {
  const params = new URLSearchParams();
  params.set('year', String(year));
  if (month) params.set('month', String(month));
  if (compare) params.set('compare', String(compare));
  if (view !== 'overview') params.set('view', view);
  if (settlement !== 'all') params.set('settlement', settlement);
  return `/dashboard/reports?${params.toString()}`;
}

export default function ReportYearFilter({
  years,
  year,
  month,
  compare,
  view,
  settlement,
}: {
  years: number[];
  year: number;
  month?: number;
  compare?: number;
  view: ReportView;
  settlement: ReportSettlementFilter;
}) {
  const router = useRouter();

  return (
    <section className="farm-card grid grid-cols-1 items-end gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      <div className="min-w-0">
        <label
          htmlFor="report-year"
          className="mb-1 block text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]"
        >
          Жил
        </label>
        <select
          id="report-year"
          value={year}
          className="farm-input w-full px-3 py-2 text-sm"
          onChange={(event) => {
            router.push(
              buildReportsHref({
                year: Number(event.target.value),
                month,
                compare,
                view,
                settlement,
              }),
            );
          }}
        >
          {years.map((optionYear) => (
            <option key={optionYear} value={optionYear}>
              {optionYear} он
            </option>
          ))}
        </select>
      </div>

      <div className="min-w-0">
        <label
          htmlFor="report-month"
          className="mb-1 block text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]"
        >
          Сар
        </label>
        <select
          id="report-month"
          value={month ?? ''}
          className="farm-input w-full px-3 py-2 text-sm"
          onChange={(event) => {
            const nextMonth = event.target.value
              ? Number(event.target.value)
              : undefined;
            router.push(
              buildReportsHref({
                year,
                month: nextMonth,
                compare: nextMonth ? undefined : compare,
                view,
                settlement,
              }),
            );
          }}
        >
          <option value="">Бүх сар</option>
          {MONTHS.map((optionMonth) => (
            <option key={optionMonth} value={optionMonth}>
              {optionMonth}-р сар
            </option>
          ))}
        </select>
      </div>

      <div className="min-w-0">
        <label
          htmlFor="report-compare"
          className="mb-1 block text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]"
        >
          Харьцуулах жил
        </label>
        <select
          id="report-compare"
          value={compare ?? ''}
          disabled={Boolean(month)}
          className="farm-input w-full px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          onChange={(event) => {
            const nextCompare = event.target.value
              ? Number(event.target.value)
              : undefined;
            router.push(
              buildReportsHref({
                year,
                month,
                compare: nextCompare,
                view,
                settlement,
              }),
            );
          }}
        >
          <option value="">Сонгохгүй</option>
          {years
            .filter((optionYear) => optionYear !== year)
            .map((optionYear) => (
              <option key={optionYear} value={optionYear}>
                {optionYear} он
              </option>
            ))}
        </select>
        {month ? (
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            Сараар шүүхэд харьцуулалт идэвхгүй
          </p>
        ) : null}
      </div>

      <div className="min-w-0">
        <label
          htmlFor="report-view"
          className="mb-1 block text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]"
        >
          Тайлангийн төрөл
        </label>
        <select
          id="report-view"
          value={view}
          className="farm-input w-full px-3 py-2 text-sm"
          onChange={(event) => {
            router.push(
              buildReportsHref({
                year,
                month,
                compare,
                view: event.target.value as ReportView,
                settlement,
              }),
            );
          }}
        >
          <option value="overview">Ерөнхий тойм</option>
          <option value="workers">Ажилтнаар</option>
          <option value="crops">Ургацаар</option>
        </select>
      </div>

      <div className="min-w-0">
        <label
          htmlFor="report-settlement"
          className="mb-1 block text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]"
        >
          Тооцоо
        </label>
        <select
          id="report-settlement"
          value={settlement}
          className="farm-input w-full px-3 py-2 text-sm"
          onChange={(event) => {
            router.push(
              buildReportsHref({
                year,
                month,
                compare,
                view,
                settlement: event.target.value as ReportSettlementFilter,
              }),
            );
          }}
        >
          <option value="all">Бүгд</option>
          <option value="settled">Тооцоотой</option>
          <option value="unsettled">Тооцоогүй</option>
        </select>
      </div>
    </section>
  );
}
