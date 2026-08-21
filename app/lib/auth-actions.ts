'use server';

import { prisma } from '@/app/lib/prisma';
import { hashPassword, verifyPassword } from '@/app/lib/password';
import {
  clearSession,
  createSession,
  getSession,
} from '@/app/lib/session';
import { redirect, unstable_rethrow } from 'next/navigation';

export type AuthFormState = {
  mode: 'login' | 'register';
  message: string | null;
  values: {
    name: string;
    email: string;
  };
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function authErrorMessage(error: unknown, fallback: string) {
  if (
    error &&
    typeof error === 'object' &&
    'code' in error &&
    error.code === 'P2002'
  ) {
    return 'Энэ имэйлээр бүртгэлтэй байна.';
  }

  if (error instanceof Error && error.message) {
    if (/connect|EAI_AGAIN|ETIMEDOUT|ENOTFOUND/i.test(error.message)) {
      return 'Өгөгдлийн сантай холбогдож чадсангүй. Дахин оролдоно уу.';
    }
    if (/Cookies can only be modified/i.test(error.message)) {
      return 'Бүртгэл амжилттай. Нэвтрэх хэсгээр нэвтэрнэ үү.';
    }
  }

  return fallback;
}

export async function loginAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = normalizeEmail(String(formData.get('email') ?? ''));
  const password = String(formData.get('password') ?? '');
  const values = { name: '', email };

  if (!email || !password) {
    return { mode: 'login', message: 'Имэйл болон нууц үг оруулна уу.', values };
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return {
        mode: 'login',
        message: 'Имэйл эсвэл нууц үг буруу байна.',
        values,
      };
    }

    await createSession({
      userId: user.id,
      email: user.email,
      name: user.name,
    });
  } catch (error) {
    unstable_rethrow(error);
    console.error('loginAction failed', error);
    return {
      mode: 'login',
      message: authErrorMessage(
        error,
        'Нэвтрэх үед алдаа гарлаа. Дахин оролдоно уу.',
      ),
      values,
    };
  }

  redirect('/dashboard');
}

export async function registerAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const name = String(formData.get('name') ?? '').trim();
  const email = normalizeEmail(String(formData.get('email') ?? ''));
  const password = String(formData.get('password') ?? '');
  const confirmPassword = String(formData.get('confirmPassword') ?? '');
  const values = { name, email };

  if (!name || !email || !password) {
    return {
      mode: 'register',
      message: 'Нэр, имэйл, нууц үг заавал бөглөнө.',
      values,
    };
  }

  if (!email.includes('@')) {
    return { mode: 'register', message: 'Имэйл буруу байна.', values };
  }

  if (password.length < 6) {
    return {
      mode: 'register',
      message: 'Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой.',
      values,
    };
  }

  if (password !== confirmPassword) {
    return {
      mode: 'register',
      message: 'Нууц үг таарахгүй байна.',
      values,
    };
  }

  let userId = 0;
  let userEmail = email;
  let userName = name;

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return {
        mode: 'register',
        message: 'Энэ имэйлээр бүртгэлтэй байна.',
        values,
      };
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashPassword(password),
      },
    });

    userId = user.id;
    userEmail = user.email;
    userName = user.name;
  } catch (error) {
    unstable_rethrow(error);
    console.error('registerAction create failed', error);
    return {
      mode: 'register',
      message: authErrorMessage(
        error,
        'Бүртгэх үед алдаа гарлаа. Дахин оролдоно уу.',
      ),
      values,
    };
  }

  try {
    await createSession({
      userId,
      email: userEmail,
      name: userName,
    });
  } catch (error) {
    unstable_rethrow(error);
    console.error('registerAction session failed', error);
    return {
      mode: 'login',
      message: 'Бүртгэл амжилттай. Нэвтрэх хэсгээр нэвтэрнэ үү.',
      values: { name: '', email },
    };
  }

  redirect('/dashboard');
}

export async function logoutAction() {
  await clearSession();
  redirect('/');
}

export type ChangePasswordState = {
  message: string | null;
  success: boolean;
};

export async function changePasswordAction(
  _prev: ChangePasswordState,
  formData: FormData,
): Promise<ChangePasswordState> {
  const session = await getSession();
  if (!session) {
    redirect('/');
  }

  const currentPassword = String(formData.get('currentPassword') ?? '');
  const newPassword = String(formData.get('newPassword') ?? '');
  const confirmPassword = String(formData.get('confirmPassword') ?? '');

  if (!currentPassword || !newPassword || !confirmPassword) {
    return {
      message: 'Бүх талбарыг бөглөнө үү.',
      success: false,
    };
  }

  if (newPassword.length < 6) {
    return {
      message: 'Шинэ нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой.',
      success: false,
    };
  }

  if (newPassword !== confirmPassword) {
    return {
      message: 'Шинэ нууц үг таарахгүй байна.',
      success: false,
    };
  }

  if (currentPassword === newPassword) {
    return {
      message: 'Шинэ нууц үг хуучнаасаа өөр байх ёстой.',
      success: false,
    };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    if (!user || !verifyPassword(currentPassword, user.passwordHash)) {
      return {
        message: 'Одоогийн нууц үг буруу байна.',
        success: false,
      };
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: hashPassword(newPassword) },
    });

    // Rotate session after password change
    await createSession({
      userId: user.id,
      email: user.email,
      name: user.name,
    });
  } catch (error) {
    unstable_rethrow(error);
    console.error('changePasswordAction failed', error);
    return {
      message: 'Нууц үг солих үед алдаа гарлаа. Дахин оролдоно уу.',
      success: false,
    };
  }

  return {
    message: 'Нууц үг амжилттай солигдлоо.',
    success: true,
  };
}
