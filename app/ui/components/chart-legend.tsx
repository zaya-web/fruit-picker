export type ChartLegendItem = {
  label: string;
  color: string;
};

export function ChartLegend({
  items,
  className = '',
}: {
  items: ChartLegendItem[];
  className?: string;
}) {
  return (
    <div
      className={`flex flex-wrap gap-3 text-xs text-[var(--text-secondary)] sm:gap-4 ${className}`.trim()}
    >
      {items.map((item) => (
        <span key={item.label} className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-sm"
            style={{ backgroundColor: item.color }}
          />
          {item.label}
        </span>
      ))}
    </div>
  );
}

export const harvestPaymentLegend: ChartLegendItem[] = [
  { label: 'Төлсөн', color: 'var(--farm-deep)' },
  { label: 'Төлөгдөөгүй', color: 'var(--accent-yellow)' },
];

export const harvestKgLegend: ChartLegendItem[] = [
  { label: 'Түүсэн кг', color: 'var(--farm-deep)' },
];
