export default function StatusBadge({ status }: { status: 'ACTIVE' | 'INACTIVE' }) {
  if (status === 'ACTIVE') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e7f0e8] px-2.5 py-1 text-xs font-medium text-[var(--farm-deep)]">
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--farm-deep)]" aria-hidden />
        Талбайд
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fff1e0] px-2.5 py-1 text-xs font-medium text-[#9a5b16]">
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-orange)]" aria-hidden />
      Амралттай
    </span>
  );
}
