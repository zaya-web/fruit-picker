'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { FruitSummary } from '@/app/lib/dashboard-stats';
import { formatKg } from '@/app/lib/format';

const FRUIT_COLORS = [
  '#355e3b',
  '#8fb996',
  '#f2994a',
  '#f2c94c',
  '#5b7db1',
  '#e85d5d',
  '#6f8f72',
  '#f4a340',
];


function polarToCartesian(cx: number, cy: number, radius: number, angle: number) {
  const radians = ((angle - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(radians),
    y: cy + radius * Math.sin(radians),
  };
}

function describeArc(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number,
) {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

  return [
    'M',
    start.x,
    start.y,
    'A',
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
  ].join(' ');
}

export default function FruitDonutChart({
  summaries,
}: {
  summaries: FruitSummary[];
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const slices = useMemo(() => {
    const visible = summaries.filter((fruit) => fruit.totalKg > 0);
    const totalKg = visible.reduce((sum, fruit) => sum + fruit.totalKg, 0);

    if (totalKg <= 0) return [];

    let cursor = 0;
    return visible.map((fruit, index) => {
      const fraction = fruit.totalKg / totalKg;
      const startAngle = cursor;
      const endAngle = cursor + fraction * 360;
      cursor = endAngle;

      return {
        ...fruit,
        fraction,
        startAngle,
        endAngle,
        color: FRUIT_COLORS[index % FRUIT_COLORS.length],
      };
    });
  }, [summaries]);

  if (slices.length === 0) {
    return (
      <section className="farm-card bg-white p-8 text-center sm:p-10">
        <p className="text-sm text-[var(--text-secondary)]">
          Ургацаар хуваарилах өгөгдөл алга.
        </p>
      </section>
    );
  }

  const totalKg = slices.reduce((sum, slice) => sum + slice.totalKg, 0);
  const activeSlice = activeIndex === null ? null : slices[activeIndex];

  return (
    <section className="farm-card overflow-hidden">
      <div className="border-b border-[#eee6d8] bg-white px-4 py-4 sm:px-6">
        <h2 className="text-base font-semibold text-[var(--foreground)]">
          Ургацаар хуваарилалт
        </h2>
        <p className="mt-0.5 text-sm text-[var(--text-secondary)]">
          Нийт {formatKg(totalKg, { digits: 1 })} түүсэн ургац
        </p>
      </div>

      <div className="grid gap-5 bg-white p-4 sm:gap-6 sm:p-6 md:grid-cols-[minmax(0,220px)_1fr] md:items-center">
        <div className="relative mx-auto aspect-square w-full max-w-[180px] sm:max-w-[220px]">
          <svg viewBox="0 0 220 220" className="h-full w-full" aria-hidden>
            {slices.map((slice, index) => (
              <path
                key={slice.fruitId}
                d={describeArc(110, 110, 88, slice.startAngle, slice.endAngle - 0.4)}
                fill="none"
                stroke={slice.color}
                strokeWidth={28}
                strokeLinecap="butt"
                className={`cursor-pointer transition ${
                  activeIndex === null || activeIndex === index
                    ? 'opacity-100'
                    : 'opacity-35'
                }`}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                onClick={() =>
                  setActiveIndex((current) => (current === index ? null : index))
                }
              />
            ))}
          </svg>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-2 text-center">
            {activeSlice ? (
              <>
                <p className="text-xs text-[var(--text-secondary)]">
                  {activeSlice.fruitName}
                </p>
                <p className="mt-1 text-xl font-bold tabular-nums sm:text-2xl">
                  {formatKg(activeSlice.totalKg, { digits: 1 })}
                </p>
                <p className="text-xs text-[var(--text-secondary)]">
                  {(activeSlice.fraction * 100).toFixed(1)}%
                </p>
              </>
            ) : (
              <>
                <p className="text-xs text-[var(--text-secondary)]">Нийт</p>
                <p className="mt-1 text-xl font-bold tabular-nums sm:text-2xl">
                  {formatKg(totalKg, { digits: 1 })}
                </p>
              </>
            )}
          </div>
        </div>

        <ul className="grid gap-2 sm:gap-3">
          {slices.map((slice, index) => (
            <li key={slice.fruitId}>
              <Link
                href={`/dashboard/crops/${slice.fruitId}`}
                className={`flex items-center justify-between rounded-xl border px-3 py-2 text-sm transition ${
                  activeIndex === index
                    ? 'border-[var(--farm-deep)] bg-[#eef6ef]'
                    : 'border-[#eee6d8] bg-white hover:bg-[#faf6ee]'
                }`}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: slice.color }}
                  />
                  <span className="truncate font-medium text-[var(--farm-deep)]">
                    {slice.fruitName}
                  </span>
                </div>
                <div className="ml-3 shrink-0 text-right">
                  <p className="font-semibold tabular-nums">
                    {formatKg(slice.totalKg, { digits: 1 })}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {(slice.fraction * 100).toFixed(1)}%
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
