import { prisma } from '../utils/prisma';

export async function getUserFromDb(email: string) {
  // Импортируем prisma внутри функции, чтобы избежать циклических зависимостей
  return await prisma.user.findUnique({
    // обращаемся к модели User и говорим что ищем уникального пользователя по первому совпадению его email
    where: { email },
  });
}

// эта функция получает пользователя из базы данных по его email адресу.

/*
  2. Функция getUserFromDb
    Берёт общий экземпляр prisma.
    Обращается к модели User (она описана в schema.prisma и сгенерирована в generated/prisma/client).
    Ищет уникального пользователя по полю email (@unique в Prisma-схеме)
    Логика простая: email → user || null.
*/
