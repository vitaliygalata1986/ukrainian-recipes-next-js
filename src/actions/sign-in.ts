'use server';

import { signIn } from '@/auth/auth';
import { AuthError } from 'next-auth';

export async function signInWithCredentials(email: string, password: string) {
  try {
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (!res || (res as any).error) {
      return {
        success: false,
        error: 'Невірний email або пароль',
      };
    }

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === 'CredentialsSignin') {
        return {
          success: false,
          error: 'Невірний email або пароль',
        };
      }
    }

    console.error('Unexpected auth error:', error);
    return {
      success: false,
      error: 'Сталася помилка. Спробуйте пізніше.',
    };
  }
}
