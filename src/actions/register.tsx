'use server';

import { IFormData } from '@/types/form-data';
import { prisma } from '@/utils/prisma';

export async function registerUser(formData: IFormData) {
  const { email, password, confirmPassword } = formData;
  // обращаемся к призме-клиенту для регистрации пользователя

  try {
    const user = await prisma.user.create({
      // user - это модель в нашей схеме Prisma
      data: {
        email,
        password,
      },
    });
    console.log('user', user);
    return user;
  } catch (error) {
    console.error('Error registering user:', error);
    return { error: 'Registration failed' };
  }
}
