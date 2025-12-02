'use server';

import { signIn } from '@/auth/auth';

export async function signInWithCredentials(email: string, password: string) {
  try {
    return await signIn('credentials', {
      redirect: false,
      email,
      password,
    });
  } catch (error) {
    console.error('Error signing in with credentials:', error);
    throw error;
  }
}
