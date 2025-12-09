import { object, string, number } from 'zod';
import { z } from 'zod';

export const signInSchema = object({
  email: string({ message: 'Email is required' })
    .min(1, 'Email is required')
    .email('Invalid email'),
  password: string({ message: 'Password is required' })
    .min(1, 'Password is required')
    .min(6, 'Password must be more than 6 characters')
    .max(32, 'Password must be less than 32 characters'),
});

export const ingredientSchema = object({
  name: string().min(1, 'Назва обовязкова'),
  category: z.enum([
    'VEGETABLES',
    'FRUITS',
    'MEAT',
    'DAIRY',
    'SPICES',
    'OTHER',
  ]),
  unit: z.enum(['GRAMS', 'KILOGRAMS', 'LITERS', 'MILLILITERS', 'PIECES']),
  pricePerUnit: number({ message: 'Цiна повинна бути числом' })
    .min(0, 'Цiна не може бути меншою за 0')
    .nullable(),
  description: z.string().optional(),
});

/* 3.
 Схема валидации Zod (signInSchema) zod — это библиотека для валидации данных и типизации одновременно. 
  object({ ... }) — описываем форму/объект. 
  string() — говорим, что поле строка. .min, .max, 
  .email — правила валидации. 
Сообщения типа 'Email is required' — для пользователя/обработчика. 
Потом ты делаешь: const { email, password } = await signInSchema.parseAsync(credentials); 
Если данные валидны → получаешь нормальный объект { email, password }. 
Если невалидны → выбрасывается ZodError. Это удобно, потому что: не нужно руками писать if (!email) ... 
не нужно руками проверять email-формат у тебя типы и валидация синхронизированы. 
*/
