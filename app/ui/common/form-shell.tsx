import Link from 'next/link';
import type { ReactNode } from 'react';
import { FormAlert } from '@/app/ui/form-alert';
import { FormSection } from '@/app/ui/common/form-layout';

export const farmFieldClass = 'farm-input w-full px-3 py-2 text-sm';

export function FormField({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="farm-label">
        {label}
      </label>
      {children}
      {hint ? (
        <p className="mt-2 text-xs text-[var(--text-secondary)]">{hint}</p>
      ) : null}
    </div>
  );
}

export function FormActions({
  cancelHref,
  cancelLabel = 'Болих',
  submitLabel,
  pendingLabel = 'Хадгалж байна...',
  pending = false,
  submitDisabled = false,
}: {
  cancelHref: string;
  cancelLabel?: string;
  submitLabel: string;
  pendingLabel?: string;
  pending?: boolean;
  submitDisabled?: boolean;
}) {
  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
      <Link
        href={cancelHref}
        className="inline-flex h-11 w-full items-center justify-center rounded-xl px-4 text-sm font-medium text-[var(--text-secondary)] hover:bg-[#f1ebdd] sm:w-auto"
      >
        {cancelLabel}
      </Link>
      <button
        type="submit"
        disabled={pending || submitDisabled}
        className="farm-btn-primary inline-flex h-11 w-full items-center justify-center px-5 text-sm disabled:opacity-60 sm:w-auto"
      >
        {pending ? pendingLabel : submitLabel}
      </button>
    </div>
  );
}

export function FormShell({
  children,
  action,
  message,
  cancelHref,
  cancelLabel = 'Болих',
  submitLabel,
  pendingLabel = 'Хадгалж байна...',
  pending = false,
  submitDisabled = false,
  beforeFields,
}: {
  children: ReactNode;
  action: (formData: FormData) => void | Promise<void>;
  message?: string | null;
  cancelHref: string;
  cancelLabel?: string;
  submitLabel: string;
  pendingLabel?: string;
  pending?: boolean;
  submitDisabled?: boolean;
  beforeFields?: ReactNode;
}) {
  return (
    <form action={action} className="w-full space-y-5">
      <FormAlert message={message ?? null} />
      {beforeFields}
      <FormSection className="space-y-4">{children}</FormSection>
      <FormActions
        cancelHref={cancelHref}
        cancelLabel={cancelLabel}
        submitLabel={submitLabel}
        pendingLabel={pendingLabel}
        pending={pending}
        submitDisabled={submitDisabled}
      />
    </form>
  );
}
