'use server';

import { signOut } from '@/auth/auth';

export async function signOutFunc() {
  try {
    const result = await signOut({ redirect: false });
    console.log('result', result);
    return result;
  } catch (error) {
    console.error('Error signing out user:', error);
    throw error;
  }
}
