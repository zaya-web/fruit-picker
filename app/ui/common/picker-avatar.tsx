export default function PickerAvatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  return (
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#e8f2e8] text-xs font-semibold text-[var(--farm-deep)]">
      {initials || '👨‍🌾'}
    </span>
  );
}
