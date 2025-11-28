import { object, string } from 'zod';

export const signInSchema = object({
  email: string({ required_error: 'Email is required' })
    .min(1, 'Email is required')
    .email('Invalid email'),
  password: string({ required_error: 'Password is required' })
    .min(1, 'Password is required')
    .min(6, 'Password must be more than 6 characters')
    .max(32, 'Password must be less than 32 characters'),
});

/*
  3. Схема валидации Zod (signInSchema)
  zod — это библиотека для валидации данных и типизации одновременно.
    object({ ... }) — описываем форму/объект.
    string() — говорим, что поле строка.
    .min, .max, .email — правила валидации.
    Сообщения типа 'Email is required' — для пользователя/обработчика.
  Потом ты делаешь:  
    const { email, password } = await signInSchema.parseAsync(credentials);
      Если данные валидны → получаешь нормальный объект { email, password }.
      Если невалидны → выбрасывается ZodError.
  Это удобно, потому что:
    не нужно руками писать if (!email) ...
    не нужно руками проверять email-формат
    у тебя типы и валидация синхронизированы.
*/
