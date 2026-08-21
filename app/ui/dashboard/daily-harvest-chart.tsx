'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { DailyHarvestStat, DashboardFilter } from '@/app/lib/dashboard-stats';
import { buildDashboardHref } from '@/app/lib/dashboard-url';
import { formatKg, formatMoney } from '@/app/lib/format';
import { ChartLegend, harvestPaymentLegend } from '@/app/ui/components';



function formatDayLabel(date: string, compact: boolean) {
  const [, month, day] = date.split('-');
  if (compact) {
    return String(Number(day));
  }
  return `${month}/${day}`;
}

function DayPopup({ day }: { day: DailyHarvestStat }) {
  return (
    <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-3 hidden w-56 -translate-x-1/2 rounded-xl border border-[#e4ded0] bg-white p-3 text-xs shadow-lg md:block">
      <p className="mb-2 font-semibold text-[var(--foreground)]">{day.date}</p>
      <dl className="space-y-1.5 text-[var(--text-secondary)]">
        <div className="flex justify-between gap-3">
          <dt>Нийт авсан</dt>
          <dd className="font-medium text-[var(--foreground)]">
            {formatKg(day.totalKg)}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>Төлбөр</dt>
          <dd className="font-medium text-[var(--foreground)]">
            {formatMoney(day.totalEarned)}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>Төлсөн</dt>
          <dd className="font-medium text-[var(--farm-deep)]">
            {formatMoney(day.paidAmount)}
          </dd>
        </div>
        <div className="border-t border-[#eee6d8] pt-1.5">
          <div className="flex justify-between gap-3">
            <dt>Төлөгдөөгүй кг</dt>
            <dd className="font-medium text-[#b45309]">
              {formatKg(day.unpaidKg)}
            </dd>
          </div>
          <div className="mt-1 flex justify-between gap-3">
            <dt>Төлөгдөөгүй дүн</dt>
            <dd className="font-medium text-[#b45309]">
              {formatMoney(day.unpaidAmount)}
            </dd>
          </div>
        </div>
      </dl>
    </div>
  );
}

export default function DailyHarvestChart({
  stats,
  filter,
}: {
  stats: DailyHarvestStat[];
  filter?: DashboardFilter;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const maxKg = useMemo(
    () => Math.max(...stats.map((day) => day.totalKg), 1),
    [stats],
  );

  if (stats.length === 0) {
    return (
      <section className="farm-card border-dashed bg-white p-8 text-center sm:p-10">
        <p className="text-sm text-[var(--text-secondary)]">
          Өдөр бүрийн график харуулах өгөгдөл алга. Эхлээд ажлын бүртгэл нэмнэ үү.
        </p>
      </section>
    );
  }

  const activeDay = activeIndex === null ? null : stats[activeIndex];
  // Month filter already implies the month — labels are just 1, 2, 3…
  const dayOnlyLabels = Boolean(filter?.month) || stats.length > 14;

  return (
    <section className="farm-card overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#eee6d8] bg-white px-4 py-4 sm:px-6">
        <div>
          <h2 className="text-base font-semibold text-[var(--foreground)]">
            {filter?.month
              ? 'Сарын өдөр бүрийн түүлт'
              : filter?.days
                ? `Сүүлийн ${filter.days} хоногийн түүлт`
                : filter?.from && filter?.to
                  ? 'Хугацааны өдөр бүрийн түүлт'
                  : 'Өдөр бүрийн түүлт'}
          </h2>
          <p className="mt-0.5 text-sm text-[var(--text-secondary)]">
            {filter?.year && filter?.month
              ? `${filter.year} оны ${filter.month}-р сард өдөр бүрт хэд түүсэн`
              : filter?.from && filter?.to
                ? `${filter.from} → ${filter.to}`
                : filter?.days
                  ? 'Өдөр бүрийн авалт'
                  : 'Багана дарж өдрөөр шүүнэ'}
          </p>
        </div>
        <ChartLegend items={harvestPaymentLegend} />
      </div>

      <div className="bg-white p-3 sm:p-6">
        {/* Fit all days in viewport — no horizontal scroll on mobile */}
        <div className="relative md:pt-24">
          <div
            className="flex w-full items-end gap-px sm:gap-1 md:gap-1.5"
            style={{ minHeight: 'clamp(160px, 42vw, 220px)' }}
          >
            {stats.map((day, index) => {
              const harvestHeight = Math.max(
                (day.totalKg / maxKg) * 160,
                day.totalKg > 0 ? 8 : 0,
              );
              const unpaidRatio =
                day.totalEarned > 0 ? day.unpaidAmount / day.totalEarned : 0;
              const unpaidHeight = harvestHeight * unpaidRatio;
              const paidHeight = Math.max(harvestHeight - unpaidHeight, 0);
              const isActive = activeIndex === index;
              const isSelected = filter?.date === day.date;

              return (
                <div
                  key={day.date}
                  className={`flex min-w-0 flex-1 flex-col items-center ${
                    isActive || isSelected ? 'rounded-md bg-[#f8f4eb] py-1' : ''
                  }`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                  onClick={() =>
                    setActiveIndex((current) =>
                      current === index ? null : index,
                    )
                  }
                >
                  <div className="relative flex h-[clamp(130px,34vw,180px)] w-full items-end justify-center">
                    {isActive ? <DayPopup day={day} /> : null}

                    <Link
                      href={
                        filter
                          ? buildDashboardHref({ ...filter, date: day.date })
                          : `/dashboard?date=${day.date}`
                      }
                      aria-label={`${day.date}: ${formatKg(day.totalKg)}`}
                      className={`relative flex w-full max-w-full flex-col justify-end overflow-hidden rounded-t-sm transition sm:rounded-t-md ${
                        isActive || isSelected
                          ? 'ring-2 ring-[var(--farm-deep)] ring-offset-1 md:ring-offset-2'
                          : 'hover:opacity-90'
                      }`}
                      style={{
                        height: `${Math.max(harvestHeight, day.totalKg > 0 ? 8 : 4)}px`,
                      }}
                    >
                      {paidHeight > 0 ? (
                        <span
                          className="block w-full bg-[var(--farm-deep)]"
                          style={{ height: `${paidHeight}px` }}
                        />
                      ) : null}
                      {unpaidHeight > 0 ? (
                        <span
                          className="block w-full bg-[var(--accent-yellow)]"
                          style={{ height: `${unpaidHeight}px` }}
                        />
                      ) : null}
                      {day.totalKg === 0 ? (
                        <span className="block h-1 w-full bg-[#ddd5c4]" />
                      ) : null}
                    </Link>
                  </div>
                  <span
                    className={`mt-1.5 tabular-nums text-[var(--text-secondary)] ${
                      dayOnlyLabels
                        ? 'text-[9px] leading-none sm:text-[10px] md:text-xs'
                        : 'text-[10px] sm:text-xs'
                    }`}
                  >
                    {formatDayLabel(day.date, dayOnlyLabels)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {activeDay ? (
          <div className="mt-4 rounded-xl border border-[#eee6d8] bg-[#faf6ee] p-4 text-sm md:hidden">
            <p className="font-medium">{activeDay.date}</p>
            <p className="mt-2 text-[var(--text-secondary)]">
              Нийт авсан: {formatKg(activeDay.totalKg)}
            </p>
            <p className="text-[var(--text-secondary)]">
              Төлсөн: {formatMoney(activeDay.paidAmount)}
            </p>
            <p className="text-[#b45309]">
              Төлөгдөөгүй: {formatKg(activeDay.unpaidKg)} /{' '}
              {formatMoney(activeDay.unpaidAmount)}
            </p>
            <Link
              href={
                filter
                  ? buildDashboardHref({ ...filter, date: activeDay.date })
                  : `/dashboard?date=${activeDay.date}`
              }
              className="mt-3 inline-flex text-[var(--farm-deep)] hover:underline"
            >
              Өдөр сонгох →
            </Link>
          </div>
        ) : (
          <p className="mt-3 text-center text-xs text-[var(--text-muted)] md:hidden">
            Өдөр сонгож дэлгэрэнгүй харна
          </p>
        )}
      </div>
    </section>
  );
}
