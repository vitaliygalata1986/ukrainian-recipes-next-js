'use server';

import { IFormData } from '@/types/form-data';
import { saltAndHashPassword } from '@/utils/password';
import { prisma } from '@/utils/prisma';

export async function registerUser(formData: IFormData) {
  const { email, password, confirmPassword } = formData;
  // обращаемся к призме-клиенту для регистрации пользователя

  // будем проверять пароль с подтвеждением пароля
  if (password !== confirmPassword) {
    return { error: 'Passwords do not match' };
  }

  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters long' };
  }

  try {
    // проверяем, что пользователь с таким email уже существует
    // нам нужно удостовериться, что в нашей базе данных нет дубликатов email
    // и даннный email не использовался ранее для регистрации нового пользователя
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    // но если такой пользователь уже есть, то возвращаем ошибку
    if (existingUser) {
      return { error: 'User with this email already exists' };
    }

    // password хешируем перед сохранением в базу данных
    const pwHashed = await saltAndHashPassword(password);
    const user = await prisma.user.create({
      // user - это модель в нашей схеме Prisma
      data: {
        email,
        password: pwHashed,
      },
    });
    // console.log('user', user);
    return user;
  } catch (error) {
    console.error('Error registering user:', error);
    return { error: 'Registration failed' };
  }
}
