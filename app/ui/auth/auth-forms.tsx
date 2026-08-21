'use client';

import { useActionState, useState } from 'react';
import {
  loginAction,
  registerAction,
  type AuthFormState,
} from '@/app/lib/auth-actions';
import { FormAlert } from '@/app/ui/form-alert';
import { FormField, farmFieldClass } from '@/app/ui/common/form-shell';
import PasswordInput from '@/app/ui/common/password-input';

const loginInitial: AuthFormState = {
  mode: 'login',
  message: null,
  values: { name: '', email: '' },
};

const registerInitial: AuthFormState = {
  mode: 'register',
  message: null,
  values: { name: '', email: '' },
};

export default function AuthForms() {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [loginState, loginFormAction, loginPending] = useActionState(
    loginAction,
    loginInitial,
  );
  const [registerState, registerFormAction, registerPending] = useActionState(
    registerAction,
    registerInitial,
  );
  const [switchMessage, setSwitchMessage] = useState<string | null>(null);

  const activeMessage =
    switchMessage ??
    (tab === 'login' ? loginState.message : registerState.message);

  function showLogin() {
    setSwitchMessage(null);
    setTab('login');
  }

  function showRegister() {
    setSwitchMessage(null);
    setTab('register');
  }

  return (
    <div className="farm-card w-full max-w-md overflow-hidden">
      <div className="border-b border-[#eee6d8] bg-[#faf6ee] px-6 py-5 text-center">
        <p className="text-sm font-medium text-[var(--farm-deep)]">🌱 Ургац хураалт</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          {tab === 'login' ? 'Нэвтрэх' : 'Бүртгүүлэх'}
        </h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Түүлт, төлбөрийн нэгдсэн бүртгэл
        </p>
      </div>

      <div className="space-y-4 p-6">
        {activeMessage ? <FormAlert message={activeMessage} /> : null}

        {tab === 'login' ? (
          <form action={loginFormAction} className="space-y-4">
            <FormField label="Имэйл" htmlFor="login-email">
              <input
                id="login-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                defaultValue={loginState.values.email}
                placeholder="name@example.com"
                className={farmFieldClass}
              />
            </FormField>
            <FormField label="Нууц үг" htmlFor="login-password">
              <PasswordInput
                id="login-password"
                name="password"
                autoComplete="current-password"
                placeholder="••••••••"
              />
            </FormField>
            <button
              type="submit"
              disabled={loginPending}
              className="farm-btn-primary inline-flex h-11 w-full items-center justify-center text-sm disabled:opacity-60"
            >
              {loginPending ? 'Нэвтэрч байна...' : 'Нэвтрэх'}
            </button>
          </form>
        ) : (
          <form action={registerFormAction} className="space-y-4">
            <FormField label="Нэр" htmlFor="register-name">
              <input
                id="register-name"
                name="name"
                type="text"
                required
                autoComplete="name"
                defaultValue={registerState.values.name}
                placeholder="Таны нэр"
                className={farmFieldClass}
              />
            </FormField>
            <FormField label="Имэйл" htmlFor="register-email">
              <input
                id="register-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                defaultValue={registerState.values.email}
                placeholder="name@example.com"
                className={farmFieldClass}
              />
            </FormField>
            <FormField label="Нууц үг" htmlFor="register-password">
              <PasswordInput
                id="register-password"
                name="password"
                autoComplete="new-password"
                placeholder="Хамгийн багадаа 6 тэмдэгт"
                minLength={6}
              />
            </FormField>
            <FormField label="Нууц үг давтах" htmlFor="register-confirm">
              <PasswordInput
                id="register-confirm"
                name="confirmPassword"
                autoComplete="new-password"
                placeholder="Нууц үгээ дахин оруулна уу"
                minLength={6}
              />
            </FormField>
            <button
              type="submit"
              disabled={registerPending}
              className="farm-btn-primary inline-flex h-11 w-full items-center justify-center text-sm disabled:opacity-60"
            >
              {registerPending ? 'Бүртгэж байна...' : 'Бүртгүүлэх'}
            </button>
          </form>
        )}

        <div className="border-t border-[#eee6d8] pt-4 text-center text-sm text-[var(--text-secondary)]">
          {tab === 'login' ? (
            <p>
              Бүртгэлгүй юу?{' '}
              <button
                type="button"
                onClick={showRegister}
                className="font-medium text-[var(--farm-deep)] underline-offset-2 hover:underline"
              >
                Бүртгүүлэх
              </button>
            </p>
          ) : (
            <p>
              Бүртгэлтэй юу?{' '}
              <button
                type="button"
                onClick={showLogin}
                className="font-medium text-[var(--farm-deep)] underline-offset-2 hover:underline"
              >
                Нэвтрэх
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
