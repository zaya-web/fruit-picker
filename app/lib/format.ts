function pad2(n: number) {
  return String(n).padStart(2, '0');
}

/** Round a number to fixed decimal places (money/kg aggregates). */
export function roundNumber(value: number, digits = 2) {
  return Number(value.toFixed(digits));
}

/** Local calendar YYYY-MM-DD (farm timezone / browser local). */
export function toLocalDateKey(date = new Date()) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

/** UTC calendar YYYY-MM-DD — use for Date values stored as UTC midnight. */
export function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function formatAmount(value: { toString(): string } | number | string) {
  const amount = Number(value.toString());
  if (!Number.isFinite(amount)) {
    return '0';
  }
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

export function formatKg(
  value: number,
  options?: { digits?: number; unit?: boolean },
) {
  const digits = options?.digits ?? 2;
  const withUnit = options?.unit ?? true;
  const amount = Number.isFinite(value) ? value : 0;
  const formatted = amount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  });
  return withUnit ? `${formatted} kg` : formatted;
}

export function formatMoney(
  value: number,
  options?: { digits?: number; unit?: boolean },
) {
  const digits = options?.digits ?? 0;
  const withUnit = options?.unit ?? true;
  const amount = Number.isFinite(value) ? value : 0;
  const formatted = amount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  });
  return withUnit ? `${formatted} ₮` : formatted;
}

export function paymentMethodLabel(method: string) {
  return method === 'BANK' ? 'Дансаар' : 'Бэлнээр';
}

export function toDateInputValue(date: Date) {
  return toLocalDateKey(date);
}

export function toDateTimeLocalValue(date: Date) {
  return `${toLocalDateKey(date)}T${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

export function formatDateTime(date: Date) {
  return toDateTimeLocalValue(date).replace('T', ' ');
}

/** Parse datetime-local / ISO-ish string; null if invalid. */
export function parseDateTimeInput(value: string): Date | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = new Date(trimmed);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}
