'use client';

import { useActionState, useEffect, useState } from 'react';
import {
  changePasswordAction,
  type ChangePasswordState,
} from '@/app/lib/auth-actions';
import { FormField } from '@/app/ui/common/form-shell';
import PasswordInput from '@/app/ui/common/password-input';

const initialState: ChangePasswordState = {
  message: null,
  success: false,
};

export default function ChangePasswordForm() {
  const [formKey, setFormKey] = useState(0);
  const [state, formAction, pending] = useActionState(
    changePasswordAction,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      setFormKey((key) => key + 1);
    }
  }, [state.success, state.message]);

  return (
    <form key={formKey} action={formAction} className="space-y-4">
      {state.message ? (
        <p
          role="alert"
          className={`rounded-xl border px-4 py-3 text-sm ${
            state.success
              ? 'border-[#cfe6d3] bg-[#eef6ef] text-[var(--farm-deep)]'
              : 'border-[#f0d9a8] bg-[#fff8ef] text-[#7c3e0a]'
          }`}
        >
          {state.message}
        </p>
      ) : null}

      <FormField label="Одоогийн нууц үг" htmlFor="currentPassword">
        <PasswordInput
          id="currentPassword"
          name="currentPassword"
          autoComplete="current-password"
          placeholder="Одоо ашиглаж буй нууц үг"
        />
      </FormField>

      <FormField label="Шинэ нууц үг" htmlFor="newPassword">
        <PasswordInput
          id="newPassword"
          name="newPassword"
          autoComplete="new-password"
          placeholder="Хамгийн багадаа 6 тэмдэгт"
          minLength={6}
        />
      </FormField>

      <FormField label="Шинэ нууц үг давтах" htmlFor="confirmPassword">
        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          autoComplete="new-password"
          placeholder="Шинэ нууц үгээ дахин оруулна уу"
          minLength={6}
        />
      </FormField>

      <button
        type="submit"
        disabled={pending}
        className="farm-btn-primary inline-flex h-11 w-full items-center justify-center px-4 text-sm disabled:opacity-60 sm:w-auto"
      >
        {pending ? 'Хадгалж байна...' : 'Нууц үг солих'}
      </button>
    </form>
  );
}
