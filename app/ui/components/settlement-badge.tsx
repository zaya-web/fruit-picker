/** Тооцоотой = үлдэгдэл ≠ 0; Тооцоогүй = үлдэгдэл === 0 */
export function SettlementBadge({ settled }: { settled: boolean }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
        settled
          ? 'bg-[#fff3e0] text-[#9a5b16]'
          : 'bg-[#e8f5ea] text-[var(--farm-deep)]'
      }`}
    >
      {settled ? 'Тооцоотой' : 'Тооцоогүй'}
    </span>
  );
}
