import type { PeriodSummary } from '@/app/lib/dashboard-stats';
import { formatKg, formatMoney } from '@/app/lib/format';



export default function PeriodSummaryCard({
  summary,
  label,
}: {
  summary: PeriodSummary;
  label: string;
}) {
  const items = [
    {
      title: 'Нийт авсан',
      value: formatKg(summary.totalKg),
      hint: 'Бүртгэгдсэн нийт кг',
      accent: 'bg-[var(--farm-fresh)]',
    },
    {
      title: 'Тооцсон дүн',
      value: formatMoney(summary.totalEarned),
      hint: 'Ургацын үнэ × кг',
      accent: 'bg-[var(--accent-blue)]',
    },
    {
      title: 'Төлсөн',
      value: formatMoney(summary.totalPaid),
      hint: `${formatKg(summary.paidKg)} эквивалент`,
      accent: 'bg-[var(--farm-deep)]',
      valueClass: 'text-[var(--farm-deep)]',
    },
    {
      title: 'Төлөгдөөгүй',
      value: formatMoney(summary.unpaidAmount),
      hint: `${formatKg(summary.unpaidKg)} үлдэгдэл`,
      accent: 'bg-[var(--accent-orange)]',
      valueClass: 'text-[#b45309]',
      highlight: true,
    },
  ];

  return (
    <section className="farm-card overflow-hidden">
      <div className="border-b border-[#eee6d8] px-5 py-4 sm:px-6">
        <h2 className="text-base font-semibold text-[var(--foreground)]">Нийт тойм</h2>
        <p className="mt-0.5 text-sm text-[var(--text-secondary)]">{label}</p>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.title}
            className={`relative border-[#eee6d8] p-5 [&:not(:last-child)]:border-b sm:odd:border-r xl:border-b-0 xl:[&:not(:last-child)]:border-r ${
              item.highlight ? 'bg-[#fff8ef]' : ''
            }`}
          >
            <span
              className={`absolute left-0 top-5 h-8 w-1 rounded-r-full ${item.accent}`}
              aria-hidden
            />
            <p className="pl-3 text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
              {item.title}
            </p>
            <p
              className={`mt-2 pl-3 text-2xl font-semibold tabular-nums ${
                item.valueClass ?? 'text-[var(--foreground)]'
              }`}
            >
              {item.value}
            </p>
            <p className="mt-1 pl-3 text-xs text-[var(--text-secondary)]">{item.hint}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
