'use server';

import { signIn } from '@/auth/auth';

export async function signInWithCredentials(email: string, password: string) {
  try {
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });
    return result;
  } catch (error) {
    console.error('Error signing in with credentials:', error);
    throw error;
  }
}
