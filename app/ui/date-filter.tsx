'use client';

import { useRouter } from 'next/navigation';

export default function DateFilter({
  pathname,
  selectedDate,
  label = 'Өдөр',
}: {
  pathname: string;
  selectedDate?: string;
  label?: string;
}) {
  const router = useRouter();

  return (
    <div>
      <label
        htmlFor="date"
        className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]"
      >
        {label}
      </label>
      <input
        id="date"
        type="date"
        value={selectedDate ?? ''}
        onChange={(event) => {
          const value = event.target.value;
          const params = new URLSearchParams();
          if (value) {
            params.set('date', value);
          }
          const query = params.toString();
          router.push(query ? `${pathname}?${query}` : pathname);
        }}
        className="farm-input w-full min-w-0 px-3 text-sm outline-none"
      />
    </div>
  );
}
