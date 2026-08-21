'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { MonthlyHarvestStat } from '@/app/lib/dashboard-stats';
import { buildDashboardHref } from '@/app/lib/dashboard-url';
import { formatKg, formatMoney } from '@/app/lib/format';
import { ChartLegend, harvestKgLegend } from '@/app/ui/components';



function MonthPopup({
  month,
  href,
}: {
  month: MonthlyHarvestStat;
  href: string;
}) {
  return (
    <div className="pointer-events-auto absolute bottom-full left-1/2 z-30 mb-3 hidden w-52 -translate-x-1/2 rounded-xl border border-[#e4ded0] bg-white p-3 text-xs shadow-xl md:block">
      <p className="mb-2 font-semibold text-[var(--foreground)]">{month.label}</p>
      <dl className="space-y-1.5 text-[var(--text-secondary)]">
        <div className="flex justify-between gap-3">
          <dt>Түүсэн</dt>
          <dd className="font-medium text-[var(--foreground)]">
            {formatKg(month.totalKg, { digits: 1 })}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>Төлбөр</dt>
          <dd className="font-medium text-[var(--foreground)]">
            {formatMoney(month.totalEarned)}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>Төлсөн</dt>
          <dd className="font-medium text-[var(--farm-deep)]">
            {formatMoney(month.paidAmount)}
          </dd>
        </div>
      </dl>
      <Link
        href={href}
        className="mt-3 inline-flex text-[var(--farm-deep)] hover:underline"
      >
        Сар сонгох →
      </Link>
    </div>
  );
}

export default function MonthlyHarvestChart({
  stats,
  filter,
}: {
  stats: MonthlyHarvestStat[];
  filter?: {
    year?: number;
    month?: number;
    date?: string;
    fruitId?: number;
    workerId?: number;
  };
}) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const maxKg = useMemo(
    () => Math.max(...stats.map((month) => month.totalKg), 1),
    [stats],
  );

  const year = filter?.year ?? new Date().getUTCFullYear();
  const activeIndex = hoverIndex;
  const activeMonth = activeIndex === null ? null : stats[activeIndex];

  return (
    <section className="farm-card overflow-hidden md:overflow-visible">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#eee6d8] bg-white px-4 py-4 sm:px-6">
        <div>
          <h2 className="text-base font-semibold text-[var(--foreground)]">
            Сарын түүлт
          </h2>
          <p className="mt-0.5 text-sm text-[var(--text-secondary)]">
            {year} оны сар бүрийн нийт авалт
          </p>
        </div>
        <ChartLegend items={harvestKgLegend} />
      </div>

      <div className="bg-white p-4 sm:p-6">
        <div className="relative overflow-x-auto pb-1 md:overflow-visible md:pt-24">
          <div
            className="flex w-full min-w-0 items-end gap-1.5 px-0.5 sm:gap-2"
            style={{ minHeight: 'clamp(180px, 40vw, 240px)' }}
          >
            {stats.map((month, index) => {
              const barHeight = Math.max(
                (month.totalKg / maxKg) * 180,
                month.totalKg > 0 ? 8 : 4,
              );
              const isHovered = hoverIndex === index;
              const isSelected = filter?.month === month.month;
              const showPopup = activeIndex === index;
              const monthHref = filter
                ? buildDashboardHref({
                    ...filter,
                    year,
                    month: month.month,
                    date: undefined,
                  })
                : `/dashboard?year=${year}&month=${month.month}`;

              return (
                <div
                  key={month.month}
                  className={`relative flex min-w-0 flex-1 flex-col items-center rounded-lg px-0.5 py-1 transition-all duration-200 sm:rounded-xl sm:px-1 sm:py-2 ${
                    isHovered || isSelected
                      ? 'bg-[#f8f4eb] shadow-[0_0_16px_rgba(53,94,59,0.15)] md:shadow-[0_0_22px_rgba(53,94,59,0.2)]'
                      : ''
                  }`}
                  onMouseEnter={() => setHoverIndex(index)}
                  onMouseLeave={() => setHoverIndex(null)}
                >
                  {showPopup ? (
                    <MonthPopup month={month} href={monthHref} />
                  ) : null}

                  <Link
                    href={monthHref}
                    aria-label={`${month.label}: ${formatKg(month.totalKg, { digits: 1 })}`}
                    aria-current={isSelected ? 'true' : undefined}
                    onMouseEnter={() => setHoverIndex(index)}
                    onMouseLeave={() => setHoverIndex(null)}
                    onFocus={() => setHoverIndex(index)}
                    onBlur={() => setHoverIndex(null)}
                    className={`relative flex w-full min-w-[28px] max-w-[40px] items-end justify-center rounded-t-md bg-gradient-to-t from-[var(--farm-deep)] to-[var(--farm-fresh)] transition-all duration-200 sm:min-w-0 sm:max-w-[36px] sm:rounded-t-lg md:max-w-[40px] ${
                      isHovered || isSelected
                        ? 'scale-105 shadow-[0_0_14px_rgba(45,90,61,0.45)] ring-2 ring-[var(--farm-fresh)] ring-offset-1 brightness-110 md:ring-offset-2'
                        : 'hover:brightness-105'
                    }`}
                    style={{ height: `${barHeight}px` }}
                  />
                  <span
                    className={`mt-2 text-[10px] sm:mt-3 sm:text-[11px] ${
                      isHovered || isSelected
                        ? 'font-medium text-[var(--farm-deep)]'
                        : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    {month.month}
                  </span>
                  <span
                    className={`mt-0.5 hidden text-[10px] tabular-nums sm:mt-1 sm:block sm:text-xs ${
                      isHovered || isSelected
                        ? 'font-semibold text-[var(--foreground)]'
                        : 'font-medium'
                    }`}
                  >
                    {formatKg(month.totalKg, { digits: 1 })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {activeMonth ? (
          <div className="mt-4 rounded-xl border border-[#eee6d8] bg-[#faf6ee] p-4 text-sm md:hidden">
            <p className="font-medium">{activeMonth.label}</p>
            <p className="mt-2 text-[var(--text-secondary)]">
              Түүсэн: {formatKg(activeMonth.totalKg, { digits: 1 })}
            </p>
            <p className="text-[var(--text-secondary)]">
              Төлбөр: {formatMoney(activeMonth.totalEarned)}
            </p>
            <p className="text-[var(--text-secondary)]">
              Төлсөн: {formatMoney(activeMonth.paidAmount)}
            </p>
            <Link
              href={
                filter
                  ? buildDashboardHref({
                      ...filter,
                      year,
                      month: activeMonth.month,
                      date: undefined,
                    })
                  : `/dashboard?year=${year}&month=${activeMonth.month}`
              }
              className="mt-3 inline-flex text-[var(--farm-deep)] hover:underline"
            >
              Сар сонгох →
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
